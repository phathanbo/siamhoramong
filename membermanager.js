"use strict";

let currentMemberId = null;  // ← เพิ่มบรรทัดนี้


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs,
    query, where, orderBy, deleteDoc, doc, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. การตั้งค่า Firebase (นำข้อมูลจาก Firebase Console ของคุณมาใส่ที่นี่)
const firebaseConfig = {
    apiKey: "AIzaSyCAXqUv97g4THeV_bKqVHGg7Ka0q3umvwA",
    authDomain: "siamhora-c6b27.firebaseapp.com",
    projectId: "siamhora-c6b27",
    storageBucket: "siamhora-c6b27.firebasestorage.app",
    messagingSenderId: "148386870420",
    appId: "1:148386870420:web:fd6e6bf4a1bb5555a2b081",
    measurementId: "G-DH8VVHWKQ5"
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersCol = collection(db, "horo_history");

// Expose app and db globally so auth script can use it for Google Login
window.firebaseApp = app;
window.firebaseDb = db;

/* หมายเหตุ: ฟังก์ชัน getCurrentUsername ถูกย้ายไปที่ utils-helpers.js แล้ว */

let currentUser = getCurrentUsername();

/**
 * บันทึกข้อมูลลง Firestore
 * @param {Object} userData 
 */
async function saveToFirestore(userData) {
    try {
        // ล้างเวลาให้เป็น HH:mm
        let cleanTime = userData.birthtime || "00:00";
        if (cleanTime.includes('T')) cleanTime = cleanTime.split('T')[1].substring(0, 5);
        else cleanTime = cleanTime.substring(0, 5);

        // ดึงค่าจากหน้าจอ
        const lastName = document.getElementById('targetLastName').value;

        // ดึง element ของ select
        const genderSelect = document.getElementById('targetGender');

        // ดึงค่าออกมา
        const selectedGender = genderSelect.value; 


        const payload = {
            memberId: userData.memberId,
            username: getCurrentUsername(), // ✅ เก็บ username ไว้สำหรับกรอง
            name: userData.name || currentUser || "ผู้มาเยือน",
            lastName: lastName, // เพิ่มนามสกุลเข้าไปใน Object
            birthdate: userData.birthdate,
            birthMonththai: userData.birthMonththai,
            birthDaythai: userData.dayjanta || "",
            birthtime: cleanTime,
            gender: userData.gender,
            ThaiId: userData.ThaiId,
            zodiac: userData.zodiac || "",
            element: userData.element || "ไม้",
            yam: userData.yam || "",
            createdAt: new Date()
        };

        const docRef = await addDoc(membersCol, payload);
        console.log("🚀 บันทึกไป Firestore สำเร็จ ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ บันทึกล้มเหลว:", error);
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลไปที่ Cloud ได้", "error");
    }
}

// --- 2. ซิงค์ข้อมูลจาก Cloud มา LocalStorage ---
async function syncDataFromFirestore() {
    try {
        const currentUsername = getCurrentUsername();
        const isAdminUser = typeof isAdmin === 'function' && isAdmin();

        let q;
        if (isAdminUser) {
            // Admin ดึงข้อมูลทั้งหมด
            q = query(membersCol, orderBy("createdAt", "desc"));
        } else if (currentUsername) {
            // User ปกติ: ดึงเฉพาะข้อมูลของตนเอง (ไม่เก็บข้อมูลคนอื่นใน LocalStorage)
            q = query(membersCol, where("username", "==", currentUsername));
        } else {
            localStorage.setItem('horo_history', JSON.stringify([]));
            return;
        }

        const querySnapshot = await getDocs(q);
        const history = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });

        // เรียงลำดับ client-side (สำหรับ user query ที่ไม่มี orderBy)
        if (!isAdminUser) {
            history.sort((a, b) => {
                const ta = a.createdAt?.seconds ?? 0;
                const tb = b.createdAt?.seconds ?? 0;
                return tb - ta;
            });
        }

        localStorage.setItem('horo_history', JSON.stringify(history));
        updateAllMemberSelectors(history);

        if (typeof loadHistory === 'function') loadHistory();
    } catch (err) {
        console.error("❌ ซิงค์ล้มเหลว:", err);
    }
}

// สร้างฟังก์ชันใหม่ไว้ข้างนอก (ในไฟล์เดิม)
function updateAllMemberSelectors(allHistory) {
    // ✅ กรองข้อมูลให้ User ทั่วไปเห็นเฉพาะของตนเอง
    const history = filterHistoryByCurrentUser(allHistory);

    // ดึง Select ทุกตัวที่มี id หรือ class ที่เรากำหนดไว้
    // แนะนำให้ใช้คลาส .member-selector-shared เพื่อความแม่นยำ
    const selectors = document.querySelectorAll('#memberSelect, .member-selector-shared');

    selectors.forEach(select => {
        const currentVal = select.value; // เก็บค่าที่เลือกค้างไว้ก่อนหน้า (ถ้ามี)
        select.innerHTML = '<option value="">-- เลือกสมาชิก --</option>';

        history.forEach(member => {
            const option = document.createElement('option');
            // สำคัญ: เราจะเก็บข้อมูลวันที่ไว้ใน value เพื่อให้ฟังก์ชันอื่นดึงไปใช้ง่ายๆ
            option.value = member.memberId || member.birthdate || "";
            option.textContent = `${member.memberId ? `${member.memberId} - ` : ''}${member.name}${member.lastName ? ` ${member.lastName}` : ''}`;
            // ถ้ามีข้อมูลอายุ/วันที่ ให้เก็บไว้ใน data attribute เผื่อเรียกใช้
            option.setAttribute('data-name', member.name);
            select.appendChild(option);
        });

        select.value = currentVal; // คืนค่าที่เลือกไว้
    });
}

// ส่งฟังก์ชันออกไปให้โลกภายนอกรู้จัก (เพราะไฟล์นี้เป็น Module)
window.syncDataFromFirestore = syncDataFromFirestore;
window.updateAllMemberSelectors = updateAllMemberSelectors;


/**
 * ดึงข้อมูลล่าสุดจากโปรไฟล์
 */
/**
 * ✨ ดึงข้อมูลโปรไฟล์ล่าสุด
 */
function getProfileData() {
    try {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];
        if (history.length > 0) {
            return history[0]; // คืนข้อมูลล่าสุด
        }
    } catch (e) {
        console.error('Error getting profile data:', e);
    }
    return null;
}

// Export ให้ global
window.getProfileData = getProfileData;
window.getProfileByMemberId = getProfileByMemberId;
window.viewMemberProfile = viewMemberProfile;




/**
 * ลบข้อมูลสมาชิก
 * @param {string} docId - ID ของเอกสารใน Firestore
 */
async function deleteMember(docId) {
    if (!confirm("ยืนยันการลบข้อมูลนี้จากฐานข้อมูลก้อนเมฆ?")) return;

    try {
        await deleteDoc(doc(db, "horo_history", docId));
        console.log("🗑️ ลบข้อมูลใน Cloud สำเร็จ:", docId);

        // อัปเดต Local และ UI ทันที
        await syncDataFromFirestore();
    } catch (err) {
        console.error("❌ ลบไม่สำเร็จ:", err);
    }
}


let isViewingHistory = false;

// 3. แก้ไขจุดเริ่มต้นทำงาน
// หมายเหตุ: syncDataFromFirestore() เรียกใน DOMContentLoaded ที่รอ auth session แล้ว
window.addEventListener('load', async () => {

    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }

    if (typeof fillUserData === 'function') {
        fillUserData();
    }

});

// ✅ เรียก sync เมื่อ DOM พร้อมแต่รอ auth session ก่อน
document.addEventListener('DOMContentLoaded', async () => {

    // รอ auth session initialize (สูงสุด 5 วินาที)
    let retries = 0;
    const maxRetries = 50; // 50 × 100ms = 5 วินาที

    while (retries < maxRetries) {
        const session = localStorage.getItem('siamhora_auth_session');
        if (session) {
            try {
                await syncDataFromFirestore();
            } catch (err) {
                console.error('❌ DOMContentLoaded sync error:', err);
            }
            return;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
});

// --- เพิ่มฟังก์ชันนี้เพื่อกรอกข้อมูลอัตโนมัติ ---
function fillUserData() {
    try {
        const targetInput = document.getElementById('targetName');
        
        // 1. ลองดึงจาก Profile Manager ก่อน
        const profile = SingleProfileManager.load();
        if (profile) {
            const fields = {
                'targetName': profile.name || '',
                'targetLastName': profile.lastName || '',
                'birthdate': profile.birthdate || '',
                'birthtime': profile.birthtime || '',
                'targetGender': profile.gender || '',
                'dayjanta': profile.birthDaythai || '',
                'birthMonththai': profile.birthMonththai || '',
                'ThaiId': profile.ThaiId || '',
                'targetProvince': profile.province || ''
            };
            
            for (const [id, val] of Object.entries(fields)) {
                const el = document.getElementById(id);
                if (el && val) {
                    el.value = val;
                }
            }
        } 
        
        // 2. ถ้าช่องชื่อยังว่างอยู่ ให้พยายามใช้ displayName จาก Session
        if (targetInput && !targetInput.value) {
            const session = localStorage.getItem('siamhora_auth_session');
            if (session) {
                const data = JSON.parse(session);
                const displayName = data.displayName || '';
                if (displayName) {
                    targetInput.value = displayName;
                }
            }
        }
    } catch (e) {
        console.warn('⚠️ fillUserData error:', e);
    }
}


// 📌 ระบบเก็บข้อมูลแบบ Single-Entry (1 คน 1 ข้อมูล) - ผูกกับ User ที่ล็อกอิน
const SingleProfileManager = {
    getKey: function(username) {
        // ✅ Key แยกตามผู้ใช้ที่ล็อกอิน
        return `siamHora_Profile_${username || 'guest'}`;
    },

    getCurrentUser: function() {
        // ดึง username จากระบบ auth session
        return getCurrentUsername();
    },

    // บันทึกข้อมูล (มีได้แค่อันเดียว per user)
    save: function(profileData) {
        try {
            const username = this.getCurrentUser();
            if (!username) {
                console.warn('⚠️ ไม่พบ user ที่ล็อกอิน');
                return false;
            }

            const key = this.getKey(username);
            localStorage.setItem(key, JSON.stringify(profileData));
            return true;
        } catch (e) {
            console.error('❌ Error saving profile:', e);
            return false;
        }
    },

    // ดึงข้อมูลที่บันทึกไว้ (เฉพาะของ user ที่ล็อกอิน)
    load: function(username = null) {
        try {
            const user = username || this.getCurrentUser();
            if (!user) return null;

            const key = this.getKey(user);
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading profile:', e);
            return null;
        }
    },

    // ลบข้อมูล
    delete: function() {
        try {
            const username = this.getCurrentUser();
            if (!username) return false;

            const key = this.getKey(username);
            localStorage.removeItem(key);
            console.log('🗑️ ลบข้อมูลสมาชิกแล้ว (User:', username + ')');
            return true;
        } catch (e) {
            console.error('Error deleting profile:', e);
            return false;
        }
    },

    // ตรวจสอบว่ามีข้อมูลหรือไม่ (เฉพาะของ user ที่ล็อกอิน)
    exists: function() {
        const username = this.getCurrentUser();
        if (!username) return false;
        return !!localStorage.getItem(this.getKey(username));
    }
};

function loadLastProfileFromStorage() {
    return SingleProfileManager.load();
}

function getYarmFromTime(timeStr) {

    // =========================
    // ตรวจ dependency
    // =========================

    if (
        typeof YARM_CHART === 'undefined' ||
        typeof YARM_INFO === 'undefined'
    ) {

        console.warn('⚠️ YARM system not loaded');

        return "ไม่ระบุ";
    }

    // =========================
    // ตรวจเวลา
    // =========================

    if (!timeStr || !timeStr.includes(":")) {
        return "ไม่ระบุ";
    }

    const [h, m] = timeStr.split(":").map(Number);

    if (isNaN(h) || isNaN(m)) {
        return "ไม่ระบุ";
    }

    const total = h * 60 + m;

    let yarmIndex;
    let isDay;

    // กลางวัน
    if (total >= 360 && total < 1080) {

        yarmIndex = Math.floor((total - 360) / 90);
        isDay = true;

    } else {

        // กลางคืน
        let nTotal = total < 360
            ? total + 1440
            : total;

        yarmIndex = Math.floor((nTotal - 1080) / 90);

        isDay = false;
    }

    const day = new Date().getDay();

    // =========================
    // อ่านข้อมูลยาม
    // =========================

    const chart = isDay
        ? YARM_CHART.day
        : YARM_CHART.night;

    if (
        !chart ||
        !chart[day] ||
        typeof chart[day][yarmIndex] === 'undefined'
    ) {

        return "ไม่ระบุ";
    }

    const starId = chart[day][yarmIndex];

    if (
        !YARM_INFO[starId] ||
        !YARM_INFO[starId].name
    ) {

        return "ไม่ระบุ";
    }

    return YARM_INFO[starId].name;
}

// 2. ฟังก์ชันหลักเมื่อกดปุ่ม "ดูดวงชะตา"
async function calculateEsh() {
    // ========================================
    // 1️⃣ ดึงข้อมูลจาก Form (ลำดับความสำคัญ)
    // ========================================
    
    let nameInput = document.getElementById('targetName')?.value.trim() || '';
    let lastNameInput = document.getElementById('targetLastName')?.value.trim() || '';
    let birthdate = document.getElementById('birthdate')?.value || '';
    let birthtime = document.getElementById('birthtime')?.value || '';
    let birthMonththai = document.getElementById('birthMonththai')?.value || '';
    let ThaiId = document.getElementById('ThaiId')?.value || '';
    let gender = document.getElementById('targetGender')?.value || '';
    let birthDaythai = document.getElementById('dayjanta')?.value || '';
    let targetProvince = document.getElementById('targetProvince')?.value.trim() || 'กรุงเทพมหานคร';
 
    // ========================================
    // 2️⃣ ถ้า Form ว่าง → ดึงจากโปรไฟล์
    // ========================================
    
    if (!birthdate || !birthtime) {
        const profileData = getProfileData();
        
        if (profileData) {
            if (!birthdate) birthdate = profileData.birthdate;
            if (!birthtime) birthtime = profileData.birthtime;
            if (!nameInput) nameInput = profileData.name;
            if (!lastNameInput) lastNameInput = profileData.lastName;
            if (!gender) gender = profileData.gender;
            if (!birthMonththai) {
                // คำนวณเดือนไทยจาก birthdate
                const [day, month, year] = birthdate.split('/');
                birthMonththai = month;
            }
            
        }
    }
 
    // ========================================
    // 3️⃣ ตรวจสอบข้อมูลครบไหม
    // ========================================
    
    if (!birthdate || !birthtime || !birthMonththai || !ThaiId || !gender || !birthDaythai) {
        const missing = [];
        if (!birthdate) missing.push('วันเกิด');
        if (!birthtime) missing.push('เวลาเกิด');
        if (!birthMonththai) missing.push('เดือนเกิด(ไทย)');
        if (!ThaiId) missing.push('เลขที่บัตรประชาชน');
        if (!gender) missing.push('เพศ');
        if (!birthDaythai) missing.push('ขึ้น/แรม');
        
        Swal.fire(
            "กรุณากรอกข้อมูล",
            "ต้องระบุ: " + missing.join(', '),
            "warning"
        );
        return;
    }
 
    // ========================================
    // 4️⃣ แสดงสถานะ Loading
    // ========================================
    
    Swal.fire({
        title: 'กำลังประมวลผล...',
        text: 'กรุณารอสักครู่ ระบบกำลังบันทึกข้อมูลไปยังคลาวด์',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
    });
 
    try {
        // ========================================
        // 5️⃣ คำนวณข้อมูลพยากรณ์
        // ========================================
        
        const birthDateObj = parseThaiDate(birthdate);
 
        // คำนวณปีนักษัตร
        let zodiacName = "";
        if (typeof window.getZodiacElement === "function") {
            const z = window.getZodiacElement(birthdate);
            zodiacName = z.name;
        }
 
        const yam = getYarmFromTime(birthtime);
 
        // ========================================
        // 6️⃣ สร้าง Object บันทึก
        // ========================================
        
        const mId = await generateMemberId();
 
        const dataToSave = {
            memberId: mId,
            username: getCurrentUsername(), // ✅ เก็บ username ไว้สำหรับกรอง
            name: nameInput || currentUser || "ผู้มาเยือน",
            lastName: lastNameInput,
            birthdate: birthdate,              // ✅ ใช้ birthdate ที่ถูกต้อง
            birthMonththai: birthMonththai,
            birthDaythai: birthDaythai,
            birthtime: birthtime,
            province: targetProvince,
            ThaiId: ThaiId,
            gender: gender,
            zodiac: zodiacName,
            yam: yam,
            createdAt: new Date()
        };
 
        // ========================================
        // 7️⃣ บันทึก Firestore + localStorage
        // ========================================
        
        const docRef = await addDoc(membersCol, dataToSave);
        dataToSave.id = docRef.id;
 
        // บันทึก localStorage
        let history = JSON.parse(localStorage.getItem('horo_history')) || [];
        history.unshift(dataToSave);
        localStorage.setItem('horo_history', JSON.stringify(history));
 
        // ========================================
        // 8️⃣ อัปเดต UI (Dropdown, ประวัติ) ทันที
        // ========================================

        if (typeof syncDataFromFirestore === 'function') {
            await syncDataFromFirestore();
        }

        // ========================================
        // 9️⃣ แสดงโปรไฟล์ + Navigate
        // ========================================

        if (typeof showProfilePage === 'function') {
            showProfilePage(dataToSave);
        }

        if (typeof navigateTo === 'function') {
            navigateTo('profilePage');
        }

        // ปิด Loading
        Swal.close();
 
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
 
        Swal.fire({
            icon: 'error',
            title: 'การบันทึกล้มเหลว',
            text: err.message
        });
 
    }
}



// ฟังก์ชันแยกสำหรับบันทึกข้อมูล
function saveToHistory(data) {
    // 📌 ตรวจสอบว่า User เป็น Admin หรือไม่
    const isAdminUser = typeof isAdmin === 'function' && isAdmin();

    if (isAdminUser) {
        // ✅ Admin: เก็บหลายรายการ (ระบบเดิม)
        let history = JSON.parse(localStorage.getItem('horo_history')) || [];
        const exists = history.some(item => item.id === data.id);

        if (!exists) {
            history.push(data);
            localStorage.setItem('horo_history', JSON.stringify(history));
            if (typeof saveMember === 'function') {
                saveMember(data);
            }
        }
    } else {
        // ✅ User ปกติ: เก็บแค่ 1 คน (Single-Entry)
        const success = SingleProfileManager.save(data);

        if (success) {
            if (typeof saveMember === 'function') {
                saveMember(data);
            }
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: '⚠️ ระบบเก็บข้อมูล 1 คนต่อครั้ง (เพื่อป้องกันข้อมูลซ้ำซ้อน)',
                    timer: 2500
                });
            }
            return;
        }
    }

    // 🔄 อัปเดต Dropdown + ประวัติ ทันที
    loadHistory();
    if (typeof updateAllMemberSelectors === 'function') {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];
        updateAllMemberSelectors(history);
    }
}

// 🗑️ ฟังก์ชันลบข้อมูลสมาชิก (เฉพาะ User ปกติ - Admin ไม่ต้อง)
function deleteSingleProfile() {
    // ตรวจสอบว่า Admin หรือไม่
    const isAdminUser = typeof isAdmin === 'function' && isAdmin();
    if (isAdminUser) {
        Swal.fire('แจ้งเตือน', 'Admin สามารถจัดการข้อมูลหลายรายการได้ ไม่จำเป็นต้องลบ', 'info');
        return;
    }

    if (!SingleProfileManager.exists()) {
        Swal.fire('แจ้งเตือน', 'ไม่มีข้อมูลสมาชิกที่ต้องลบ', 'info');
        return;
    }

    // ยืนยันการลบ
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'warning',
            title: 'ยืนยันการลบข้อมูล',
            text: 'เมื่อลบแล้วจะไม่สามารถกู้คืนได้ คุณต้องการลบเพื่อเพิ่มข้อมูลใหม่หรือไม่?',
            showCancelButton: true,
            confirmButtonColor: '#d4af37',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ใช่ ลบเลย',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                SingleProfileManager.delete();
                location.reload();
            }
        });
    } else {
        if (confirm('ยืนยันการลบข้อมูล? เมื่อลบแล้วจะไม่สามารถกู้คืนได้')) {
            SingleProfileManager.delete();
            location.reload();
        }
    }
}

window.deleteSingleProfile = deleteSingleProfile;

// --- ฟังก์ชันสร้างรหัสสมาชิก 10 หลัก (YYYYMMDDXX) ---
async function generateMemberId() {

    try {

        const now = new Date();

        const dateStr =
            `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

        // =========================
        // ดึงล่าสุดแค่ 1 รายการ
        // =========================

        const q = query(
            membersCol,
            orderBy("memberId", "desc"),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        let nextSeq = 1;

        if (!querySnapshot.empty) {

            const latestDoc = querySnapshot.docs[0].data();

            const latestId = String(
                latestDoc.memberId || ""
            );

            // =========================
            // ถ้าเป็นวันเดียวกัน
            // =========================

            if (latestId.startsWith(dateStr)) {

                const latestSeq =
                    parseInt(latestId.substring(8), 10);

                if (!isNaN(latestSeq)) {
                    nextSeq = latestSeq + 1;
                }
            }
        }

        // ใช้ 3 หลักเพื่อรองรับได้ถึง 999 คนต่อวัน (ป้องกัน overflow เดิมที่ 99)
        return dateStr + String(nextSeq).padStart(3, '0');

    } catch (err) {

        console.error(
            "generateMemberId error:",
            err
        );

        // fallback กันระบบล่ม
        return Date.now().toString();
    }
}

// --- ฟังก์ชัน Render ตารางแยกออกมาเพื่อให้ใช้ซ้ำได้ทั้ง Load ปกติ และ ค้นหา
function renderTable(dataArray) {
    const historyBody = document.getElementById('historyBody');

    if (!historyBody) {
        return;
    }

    historyBody.innerHTML = '';
    if (!dataArray || dataArray.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">ไม่พบข้อมูล</td></tr>';
        return;
    }

    const esc = (v) => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    dataArray.forEach((item) => {
        const safeId = esc(item.id);
        const row = `
            <tr>
                <td>${esc(item.memberId) || 'N/A'}</td>
                <td>${esc(item.name)}</td>
                <td>${esc(item.lastName) || '-'}</td>
                <td>${esc(item.birthdate)}</td>
                <td>${esc(item.zodiac) || '-'}</td>
                <td>${esc(item.yam) || '-'}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewHistory('${safeId}')">🔍 ดู</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteItem('${safeId}')">🗑️ ลบ</button>
                    </div>
                </td>
            </tr>`;
        historyBody.insertAdjacentHTML('beforeend', row);
    });
}

// 🔐 ฟังก์ชันกรองข้อมูลให้เหลือแค่ของ User ที่ล็อกอิน (Admin เห็นทั้งหมด)
function filterHistoryByCurrentUser(allHistory) {
    const currentUser = getCurrentUsername();

    if (!currentUser) {
        return [];
    }

    const isAdminUser = typeof isAdmin === 'function' && isAdmin();

    if (isAdminUser) {
        return allHistory;
    } else {
        return allHistory.filter(item => (item.username || item.name) === currentUser);
    }
}

function loadHistory() {
    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    const history = filterHistoryByCurrentUser(allHistory);
    renderTable(history);
    const countEl = document.getElementById('historyCount');
    if (countEl) countEl.innerText = `ทั้งหมด ${history.length} รายการ`;
}

function viewHistory(docId) {
    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    // ✅ กรองให้เหลือแค่ของ current user
    const userHistory = filterHistoryByCurrentUser(allHistory);
    const data = userHistory.find(item => item.id == docId);
    if (data) {
        showProfilePage(data);
        navigateTo('profilePage');
    } else {
        console.warn('❌ ไม่พบข้อมูล ID:', docId);
    }
}

// ระบบค้นหา
function searchHistory() {

    const input = document.getElementById('searchInput');

    if (!input) {
        console.warn('searchInput not found');
        return;
    }

    const term = (input.value || "")
        .toLowerCase()
        .trim();

    const allHistory = JSON.parse(
        localStorage.getItem('horo_history') || '[]'
    );

    // ✅ กรองให้เหลือแค่ของ current user ก่อน
    const userHistory = filterHistoryByCurrentUser(allHistory);

    const filtered = userHistory.filter(item => {

        const name = (item?.name || "")
            .toLowerCase();

        const lastName = (item?.lastName || "")
            .toLowerCase();

        const memberId = String(item?.memberId || "");

        return (
            name.includes(term) ||
            lastName.includes(term) ||
            memberId.includes(term)
        );
    });

    renderTable(filtered);
}

// ฟังก์ชันสำหรับ "เลือก" สมาชิกคนนี้มาดูดวง
function selectMemberToView(name, birthdate) {
    // 1. อัปเดตช่องกรอกวันเกิดที่หน้าหลักให้เป็นของสมาชิกคนนี้
    const birthField = document.getElementById('birthdate');
    if (birthField) {
        birthField.value = birthdate;
    }

    // 2. บันทึกทับลงใน LocalStorage หลัก (userBirthdate) — normalize เป็น ISO เสมอ
    const isoDate = typeof birthdateToISO === 'function' ? birthdateToISO(birthdate) : birthdate;
    localStorage.setItem('userBirthdate', isoDate || birthdate);
    if (typeof updateGraph === 'function') {
        updateGraph();
    }

    // 3. ตั้ง currentMemberId เพื่อให้ navigateTo auto-fill ได้
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const found = allHistory.find(m => m.birthdate === birthdate && m.name === name);
    if (found && found.memberId) {
        currentMemberId = found.memberId;
        window.currentMemberId = found.memberId;
    }

    Swal.fire('สำเร็จ', 'โหลดข้อมูลของคุณ ' + name + ' เรียบร้อยแล้ว', 'success');
}

function showElementManual() {
    // 1. จัดการการสลับหน้า (อิงตามระบบ main-section ของคุณ)
    document.querySelectorAll('.main-section').forEach(section => {
        section.classList.add('hidden');
    });

    const manualPage = document.getElementById('elementManualPage');
    if (manualPage) {
        manualPage.classList.remove('hidden');
    } else {
        return; // ป้องกัน Error ถ้าหาหน้าไม่เจอ
    }

    // 2. ล้างข้อมูลเก่าในหน้าคู่มือ
    document.querySelectorAll('.user-label').forEach(el => el.innerText = '');
    document.querySelectorAll('[id^="manual-"]').forEach(box => {
        box.style.backgroundColor = 'white';
        box.style.border = '1px solid #dee2e6';
    });

    // 3. ส่วนสำคัญ: ตรวจสอบว่ามีการคำนวณดวงไว้หรือยัง (กัน Error)
    // เช็คว่าตัวแปรที่ใช้ใน element.js มีค่าไหม
    if (typeof elementData !== 'undefined' && elementData.name) {

        // ฟังก์ชันช่วยดึงชื่อธาตุสั้นๆ เช่น "ธาตุไฟ (ไฟแรง)" -> "ไฟ"
        const cleanE = (name) => name ? name.replace("ธาตุ", "").split(" ")[0].split("(")[0].trim() : "";

        try {
            const myElements = [
                { name: cleanE(elementData.name), label: 'วันเกิด' },
                { name: cleanE(mElement.name), label: 'เดือนเกิด' },
                { name: cleanE(zElement.element), label: 'ปีเกิด' }
            ];

            // 4. สั่งไฮไลต์
            myElements.forEach(item => {
                const box = document.getElementById(`manual-${item.name}`);
                if (box) {
                    box.style.backgroundColor = '#fff9e6'; // สีเหลืองทองอ่อนๆ
                    box.style.border = '2px solid #d4af37';
                    const label = box.querySelector('.user-label');
                    if (label) {
                        label.innerHTML += (label.innerHTML ? ' / ' : '') +
                            `<span class="badge badge-primary" style="font-size:10px">${item.label}</span>`;
                    }
                }
            });
        } catch (err) {
            console.log("รอการคำนวณดวงชะตาเพื่อแสดงธาตุประจำตัว");
        }
    }

    window.scrollTo(0, 0);
}

async function deleteItem(docId) {
    // ✅ ตรวจสอบสิทธิ์ตามบทบาท
    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    const targetItem = allHistory.find(item => item.id === docId);
    const currentUser = getCurrentUsername();
    const isAdminUser = typeof isAdmin === 'function' && isAdmin();

    if (!targetItem) {
        Swal.fire("ข้อผิดพลาด", "ไม่พบข้อมูลที่ต้องการลบ", "error");
        return;
    }

    // User ปกติ: ลบเฉพาะของตนเอง (เปรียบเทียบ username)
    if (!isAdminUser && (targetItem.username || targetItem.name) !== currentUser) {
        Swal.fire("ปฏิเสธ", "❌ คุณสามารถลบเฉพาะข้อมูลของตนเองเท่านั้น", "warning");
        return;
    }

    // Admin: ลบได้ทั้งหมด (มีข้อความแตกต่าง)
    const confirmMsg = isAdminUser ? `ลบข้อมูล ${targetItem.name}?` : "ยืนยันการลบข้อมูลนี้ถาวร?";

    if (!confirm(confirmMsg)) return;
    try {
        await deleteDoc(doc(db, "horo_history", docId));
        await syncDataFromFirestore();
    } catch (err) {
        console.error("❌ ลบไม่สำเร็จ:", err);
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    }
}



function getThaiZodiacYear(dateObj) {

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    // ถ้าเกิดก่อนสงกรานต์ (13 เม.ย.) ให้นับเป็นปีนักษัตรก่อนหน้า
    if (month < 4 || (month === 4 && day < 13)) {
        year -= 1;
    }

    return year;
}

// 3. ปรับฟังก์ชันแสดงโปรไฟล์ให้ดึงข้อมูลมาแสดงครบถ้วน
function showProfilePage(data, memberId) {
    if (data && data.memberId) {
        currentMemberId = data.memberId;
        window.currentMemberId = currentMemberId;
        console.log("📍 currentMemberId:", currentMemberId);
    }
    
    // 2️⃣ ถ้าส่ง data มา แต่ไม่มี memberId
    // → ใช้ memberId จาก data.memberId ได้
    if (data && data.memberId && !memberId) {
        memberId = data.memberId;
    }

    // 3️⃣ ถ้ายังไม่มี data → ดึงล่าสุด (fallback)
    if (!data || !data.birthdate) {
        data = loadLastProfileFromStorage();
    }

    if (!data || !data.birthdate) {
        console.error("❌ ไม่พบข้อมูลโปรไฟล์");
        return;
    }
 
    const predictionArea = document.getElementById('profPredictionArea');
    if (!predictionArea) return;

    // 1. จัดรูปเวลาเกิด (ทำก่อนเพื่อใช้คำนวณวันเกิด)
    let cleanTime = data.birthtime || "12:00";
    if (cleanTime.includes('T')) {
        cleanTime = cleanTime.split('T')[1].substring(0, 5);
    } else {
        cleanTime = cleanTime.substring(0, 5);
    }

    // 2. แปลงวันเกิด
    const birthDateObj = parseThaiDate(data.birthdate);
    const computerDayIdx = birthDateObj.getDay();
    
    // ใช้ฟังก์ชัน 06:00 น. ถ้ามี
    let dayIdx = computerDayIdx;
    if (typeof window.getAstrologicalDayOfWeek === 'function') {
        dayIdx = window.getAstrologicalDayOfWeek(data.birthdate, cleanTime);
    }

    const monthIdx = birthDateObj.getMonth();
    const year = birthDateObj.getFullYear();
    const yam = getYarmFromTime(cleanTime);
    const currentAge = typeof window.calculateRunningAge === 'function' ? window.calculateRunningAge(data.birthdate) : "-";

    // 3. ปฏิทินจันทรคติ
    let lunarStr = "";
    if (typeof getThaiLunar === 'function') {
        try {
            const lunarObj = getThaiLunar(birthDateObj);
            lunarStr = lunarObj ? lunarObj.fullString : "ไม่สามารถแปลงได้";
        } catch(e) { console.log(e); }
    }

    // 4. ลัคนาสถิตราศี
    let ascText = "ไม่สามารถคำนวณได้";
    let ascDesc = "";
    if (typeof ascCalcLagna === 'function' && typeof ZODIAC_DATA !== 'undefined') {
        try {
            const parts = data.birthdate.split('/');
            const d = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            let y = parseInt(parts[2], 10);
            if (y > 2400) y -= 543;
            const ceDateStr = `${y}-${m}-${d}`;
            
            const ascObj = ascCalcLagna(ceDateStr, cleanTime, 13.75, 100.5167); // กทม.
            const rasiData = ZODIAC_DATA[ascObj.rasi];
            if(rasiData) {
                ascText = `ลัคนาสถิตราศี${rasiData.name} ${rasiData.icon}`;
                ascDesc = `<span style="font-weight:normal; font-size: 0.9em; color:#555;">${rasiData.desc} ดาวประจำตัว: ${rasiData.ruler}</span>`;
            }
        } catch(e) {
            console.log("Error calculating ascendant:", e);
        }
    }

    // 5. เรียกข้อมูลธาตุ
    let elementData = { name: "ไม่ระบุ", color: "#ccc", desc: "ขาดข้อมูลการคำนวณ" };
    if (typeof getBirthElement === 'function') {
        elementData = getBirthElement(dayIdx);
    } else if (typeof window.getElementData === 'function') {
        elementData = window.getElementData(data.birthdate);
    }

    const mElement = typeof window.getMonthElement === 'function' ? window.getMonthElement(monthIdx) : { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };

    const zElement = typeof window.getZodiacElement === 'function' ? window.getZodiacElement(birthDateObj) : { name: "ไม่ระบุ", color: "#ccc", element: "-", desc: "-", job: "-" };

    // 6. วิเคราะห์ความสัมพันธ์ธาตุ
    let relDayMonth = "ทั่วไป";
    let relDayYear = "ทั่วไป";
    if (typeof window.getElementRelation === 'function') {
        const resMonth = window.getElementRelation(elementData?.name, mElement?.name);
        relDayMonth = typeof resMonth === 'object' ? resMonth.text : (resMonth || "ทั่วไป");

        const resYear = window.getElementRelation(elementData?.name, zElement?.element);
        relDayYear = typeof resYear === 'object' ? resYear.text : (resYear || "ทั่วไป");
    }

    // 7. แสดงข้อมูล Header
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setText('profName', data.name);
    setText('profLastName', data.lastName || '');
    setText('profId', `ID: ${data.memberId || 'สมาชิกใหม่'}`);
    setText('profBirth', data.birthdate);
    setText('profTime', cleanTime + " น.");
    setText('profZodiac', data.zodiac || zElement.name || "ไม่ระบุ");
    setText('profYam', yam || "ไม่ระบุ");
    setText('profullname', `${data.name} ${data.lastName || ''}`);

    const safeName = typeof escapeHTML === 'function' ? escapeHTML(data.name) : data.name;
    const safeLastName = typeof escapeHTML === 'function' ? escapeHTML(data.lastName || '') : (data.lastName || '');

    // สร้างข้อความกำกับวันเกิด
    const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    let displayDay = `วัน${dayNames[computerDayIdx]}`;
    let astNote = "";
    if (dayIdx !== computerDayIdx) {
        astNote = `<br><span style="color:#d63384; font-size:0.85em;">*(ดวงโหราศาสตร์: ตรงกับวัน${dayNames[dayIdx]} เนื่องจากเกิดก่อน 6 โมงเช้า)*</span>`;
    } else {
        astNote = `<br><span style="color:#6c757d; font-size:0.85em;">*(ดวงโหราศาสตร์: วัน${dayNames[dayIdx]})*</span>`;
    }

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    let role = typeof getCurrentUserRole === 'function' ? getCurrentUserRole() : (data.role || 'user');
    
    // แปลง role user เป็นชื่อระดับเริ่มต้น (อิงจาก tiers.js)
    if (role === 'user') {
        role = 'ทดลองใช้'; 
    }

    let roleBadge = '';
    if (role === 'admin' || role === 'Admin') {
        roleBadge = `<span class="badge text-white ms-2" style="background-color: #dc3545; font-size: 0.5em; vertical-align: middle; padding: 5px 8px; border-radius: 12px;"><i class="fas fa-crown"></i> ผู้ดูแลระบบ</span>`;
    } else if (role === 'ทดลองใช้') {
        roleBadge = `<span class="badge text-dark ms-2" style="background-color: #e9ecef; font-size: 0.5em; vertical-align: middle; padding: 5px 8px; border-radius: 12px; border: 1px solid #ced4da;"><i class="fas fa-user"></i> ระดับทดลองใช้</span>`;
    } else {
        // ถ้าระดับตรงกับใน tiers.js (เช่น ธรรมดา, ทองแดง, เงิน, ทองคำ ฯลฯ)
        roleBadge = `<span class="badge text-dark ms-2" style="background-color: #f8c146; font-size: 0.5em; vertical-align: middle; padding: 5px 8px; border-radius: 12px; border: 1px solid #d4af37;"><i class="fas fa-star"></i> ระดับ${role}</span>`;
    }

    // 8. แสดงผลแผ่นดวงชะตา (ธีม ทอง-ม่วงอ่อน)
    predictionArea.innerHTML = `
        <div class="text-end mb-2 d-flex justify-content-end align-items-center" style="gap: 10px;">
            ${role !== 'admin' ? `
            <button class="btn btn-sm" style="background: linear-gradient(135deg, #d4af37, #b8960c); color: #000; font-weight: bold; border-color: #d4af37;" onclick="if(typeof navigateTo === 'function') navigateTo('package');">
                <i class="fas fa-level-up-alt"></i> อัปเกรดระดับสมาชิก
            </button>
            ` : ''}
            <button class="btn btn-sm text-white" style="background-color: #6a0dad; border-color: #d4af37;" onclick="saveHoroscopeImage()">
                <i class="fas fa-camera"></i> บันทึกภาพดวงชะตา
            </button>
        </div>
        <div id="horoscopeCaptureArea" class="p-4 rounded shadow-sm" style="background: linear-gradient(135deg, #fdfaf0 0%, #f4effa 100%); border: 3px solid #d4af37; outline: 1px solid #9370db; outline-offset: -6px;">
            <div class="text-center mb-4">
                <h2 style="color:#6a0dad; font-weight: bold; text-shadow: 1px 1px 2px #d4af37;">🔮 แผ่นดวงชะตา</h2>
                <h4 style="color:#333; font-weight: bold; font-size: 24px; border-bottom: 2px dashed #d4af37; display: inline-block; padding-bottom: 5px; align-items: center;">
                    คุณ ${safeName} ${safeLastName} ${roleBadge}
                </h4>
                <div class="mt-2 text-muted" style="font-size: 14px;">
                    <i class="fas fa-map-marker-alt text-danger"></i> จังหวัดที่เกิด: ${data.province || "ไม่ระบุ (อ้างอิง กทม.)"}
                </div>
            </div>
            
            <div class="prediction-content" style="font-size: 16px; line-height: 1.6;">
                <div class="row text-center mb-3">
                    <div class="col-md-6 mb-2">
                        <div class="p-2 rounded" style="background-color: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37;">
                            <strong>อายุย่างปัจจุบัน</strong><br>
                            <span style="font-size: 20px; color: #b8860b; font-weight: bold;">${currentAge} ปี</span>
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="p-2 rounded" style="background-color: rgba(147, 112, 219, 0.1); border: 1px solid #9370db;">
                            <strong>ลัคนา</strong><br>
                            <span style="font-size: 20px; color: #6a0dad; font-weight: bold;">${ascText}</span>
                            <br>${ascDesc}
                        </div>
                    </div>
                </div>

                <div class="p-3 mb-3 rounded" style="background: #fff; border: 1px solid #e0d4f5;">
                    <div class="mb-2">
                        <strong>📅 ข้อมูลปฏิทิน:</strong> ${displayDay} ที่ ${parseInt(data.birthdate.split('/')[0])} ${monthNames[monthIdx]} พ.ศ. ${year + 543}
                        ${astNote}
                    </div>
                    <div class="mb-2">
                        <strong>🌙 จันทรคติไทย:</strong> <span style="color:#6a0dad;">${lunarStr || "ไม่สามารถแปลงได้"}</span>
                    </div>
                    <div>
                        <strong>⏰ เวลาเกิด:</strong> ${cleanTime} น. &nbsp;&nbsp;|&nbsp;&nbsp; <strong>ยามเกิด:</strong> ${yam || "ไม่ระบุ"}
                    </div>
                </div>

                <hr style="border-top:1px dashed #9370db">

                <h5 class="text-center" style="color:#6a0dad; margin-top: 15px;">🌟 องค์ประกอบธาตุประจำตัว</h5>
                
                <!-- ธาตุวันเกิด -->
                <div class="mb-2 p-3 rounded shadow-sm" style="background:${elementData.color}15; border-left: 5px solid ${elementData.color}">
                    <strong style="color:${elementData.color}">
                        🧬 ธาตุประจำวันเกิด (${dayNames[dayIdx]}): ${elementData.name} ${elementData.level || ""}
                    </strong>
                    <br><span style="font-weight: normal;">บุคลิก: ${elementData.desc}</span>
                </div>

                <!-- ธาตุเดือน -->
                <div class="mb-2 p-3 rounded shadow-sm" style="background:${mElement.color}15; border-left: 5px solid ${mElement.color}">
                    <strong style="color:${mElement.color}">
                        📅 ธาตุเดือนเกิด: ${mElement.name} ${mElement.level || ""} (กำลัง: ${mElement.strength})
                    </strong>
                    <br><span style="font-weight: normal;">บุคลิก: ${mElement.desc}</span>
                </div>

                <!-- ธาตุนักษัตร -->
                <div class="mb-3 p-3 rounded shadow-sm" style="background:${zElement.color}15; border-left: 5px solid ${zElement.color}">
                    <strong style="color:${zElement.color}">
                        🐉 ธาตุปีนักษัตร (${zElement.name}): ${zElement.element}
                    </strong>
                    <br><span style="font-weight: normal;">บุคลิก: ${zElement.desc}</span>
                    <br><span style="font-weight: normal; color:#555;">🚀 <b>งานที่เหมาะ:</b> ${zElement.job || "ไม่ระบุ"}</span>
                </div>

                <!-- วิเคราะห์ธาตุ -->
                <div class="mt-3 p-3 rounded shadow-sm" style="background:#fff; border: 1px dashed #d4af37;">
                    <h6 style="color:#b8860b; font-weight:bold;">⚖️ วิเคราะห์สมพงษ์ธาตุ</h6>
                    <ul class="mb-0" style="padding-left: 20px; font-size: 0.9em;">
                        <li><strong>วันเกิด (${elementData.name}) + เดือนเกิด (${mElement.name}):</strong> ${relDayMonth}</li>
                        <li><strong>วันเกิด (${elementData.name}) + ปีนักษัตร (${zElement.element}):</strong> ${relDayYear}</li>
                    </ul>
                </div>
                
                <hr style="border-top:1px dashed #9370db; margin-top:20px;">
                
                <!-- คำทำนายพื้นดวง -->
                <h5 class="text-center" style="color:#6a0dad; margin-top: 15px; margin-bottom: 15px;">📖 คำทำนายพื้นดวงชะตา</h5>
                <div class="mb-3 p-3 rounded shadow-sm" style="background:#fff; border: 1px solid #e0d4f5;">
                    <strong style="color:#b8860b">คำทำนายวันเกิด:</strong>
                    <div style="font-size: 0.9em; margin-top: 5px;">${typeof getDayPrediction === 'function' ? getDayPrediction(dayIdx) : "-"}</div>
                </div>
                <div class="mb-3 p-3 rounded shadow-sm" style="background:#fff; border: 1px solid #e0d4f5;">
                    <strong style="color:#b8860b">คำทำนายเดือนเกิด:</strong>
                    <div style="font-size: 0.9em; margin-top: 5px;">${typeof getMonthPrediction === 'function' ? getMonthPrediction(monthIdx) : "-"}</div>
                </div>
                <div class="mb-3 p-3 rounded shadow-sm" style="background:#fff; border: 1px solid #e0d4f5;">
                    <strong style="color:#b8860b">คำทำนายปีนักษัตร:</strong>
                    <div style="font-size: 0.9em; margin-top: 5px;">${typeof getZodiacPrediction === 'function' ? getZodiacPrediction(["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"].indexOf(zElement.name)) : "-"}</div>
                </div>

                <hr style="border-top:1px dashed #9370db; margin-top:20px;">
                <div class="text-center mt-3">
                    <p class="small text-muted" style="font-size:12px;">ดวงชะตานี้คำนวณด้วยหลักโหราศาสตร์ไทย นิรายันระบบ และการตัดวันเวลา 06:00 น.</p>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-4">
            ${typeof isAdmin === 'function' && isAdmin() ?
                `<p class="small text-success mb-2"><i class="fas fa-crown mr-2"></i>👑 Admin: จัดการข้อมูลจำนวนไม่จำกัด</p>` :
                `<p class="small text-muted mb-2">💾 ระบบเก็บข้อมูลแบบ 1 คน 1 รายการ</p>
                <button class="btn btn-danger btn-sm" onclick="deleteSingleProfile()" style="background-color: #dc3545; border: none;">
                    <i class="fas fa-trash mr-2"></i>ลบข้อมูลสมาชิก
                </button>
                <p class="small text-muted mt-2">
                    <i class="fas fa-info-circle mr-1"></i>หากต้องการเพิ่มข้อมูลใหม่ ให้ลบอันเก่าออกก่อน
                </p>`
            }
        </div>
    `;
}

function initProfileOnPageLoad() {
    const lastData = loadLastProfileFromStorage();
    
    if (lastData && lastData.birthdate) {
        // ✅ ส่งเป็น object ที่มี memberId อยู่
        showProfilePage(lastData);
        console.log("✅ โหลดโปรไฟล์: " + lastData.name);
    }
}

async function saveHoroscopeImage() {
    const captureArea = document.getElementById('horoscopeCaptureArea');
    if (!captureArea) return;

    try {
        Swal.fire({
            title: 'กำลังสร้างรูปภาพ...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const canvas = await html2canvas(captureArea, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fdfaf0"
        });

        const link = document.createElement('a');
        link.download = `ดวงชะตา_${document.getElementById('profName')?.innerText || 'ของท่าน'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Swal.close();
    } catch (err) {
        console.error("Error capturing image:", err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initProfileOnPageLoad();
});

function getProfileByMemberId(identifier) {
    try {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];

        let profile = history.find(item => item.memberId === identifier);
        if (!profile) profile = history.find(item => item.username === identifier);
        if (!profile) profile = history.find(item => item.name === identifier);
        if (!profile) profile = history.find(item => item.id === identifier);

        return profile || null;
    } catch (e) {
        console.error('❌ Error getting profile by ID:', e);
        return null;
    }
}

function viewMemberProfile(memberId) {
    if (!memberId) return;

    const profile = getProfileByMemberId(memberId);

    if (profile) {
        showProfilePage(profile);
        if (typeof navigateTo === 'function') {
            navigateTo('profilePage');
        }
    } else {
        Swal.fire('แจ้งเตือน', 'ไม่พบข้อมูลสมาชิก', 'warning');
    }
}


// --- element data helper functions (called from showProfilePage) ---
// These will be defined by element.js, relation.js etc. when they load
// Fallback: create placeholder exports if they don't exist
if (typeof window.getElementData !== 'function') {
    window.getElementData = (birthdate) => {
        // Tries to use getBirthElement from element.js if available
        if (typeof getBirthElement === 'function') {
            const dateObj = parseThaiDate(birthdate);
            return getBirthElement(dateObj.getDay());
        }
        return { name: "ไม่ระบุ", color: "#ccc", desc: "ขาดข้อมูลการคำนวณ" };
    };
}

if (typeof window.getMonthElement !== 'function') {
    window.getMonthElement = (monthIdx) => {
        // Tries to use MONTH_ELEMENTS from element.js if available
        if (typeof MONTH_ELEMENTS !== 'undefined') {
            return MONTH_ELEMENTS[monthIdx] || { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };
        }
        return { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };
    };
}

if (typeof window.getZodiacElement !== 'function') {
    window.getZodiacElement = (birthdate) => {
        // Tries to use ZODIAC_ELEMENTS from element.js if available
        if (typeof ZODIAC_ELEMENTS !== 'undefined') {
            const dateObj = parseThaiDate(birthdate);

            // ใช้ปีนักษัตรไทย
            const thaiYear = getThaiZodiacYear(dateObj);

            const zodiacIdx = Math.abs(thaiYear - 4) % 12;
            return ZODIAC_ELEMENTS[zodiacIdx] || { name: "-", color: "#ccc", element: "-", desc: "-", job: "-" };
        }
        return { name: "ไม่ระบุ", color: "#ccc", element: "-", desc: "-", job: "-" };
    };
}

if (typeof window.getElementRelation !== 'function') {
    window.getElementRelation = (element1, element2) => {
        // Tries to use getElementRelation from relation.js if available
        if (typeof getElementRelation === 'function') {
            return getElementRelation(element1, element2);
        }
        return "ทั่วไป";
    };
}
// end of exports

// ฟังก์ชันนี้จะถูกเรียกเมื่อมีการเปลี่ยนรายชื่อสมาชิก
// ฟังก์ชันสำหรับล้างข้อมูลเก่า (form fields + cache)
function clearAllFormFields() {
    // 🗑️ ล้างข้อมูลหน้าวิเคราะห์ชื่อ
    const inputs = ['firstName', 'lastName', 'birthDaynumSelect'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า มหาทักษา
    ['birthDate', 'chatraAge'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า ฉัตร 3 ชั้น
    ['ascBirthDate', 'ascBirthTime'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า ฉัตร 9 ชั้น
    ['chatraninebirthDaySelect', 'chatranineAge'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า ทักษาพยากรณ์
    ['weekday', 'age'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า มหาทักษาสัตตเลข
    const el1 = document.getElementById('birthDateSatta');
    if (el1) el1.value = '';

    // ล้างข้อมูลหน้า ทักษา
    ['taksagender', 'userAge', 'birthDaySelect'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า พยากรณ์วันเกิด
    ['fortuneDay', 'fortuneMonth', 'fortuneYear', 'fortuneBE'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า วงล้อพยากรณ์
    ['userGender', 'userAgeprom'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า เลข 7 ตัว
    ['sdDay', 'sdMonth', 'sdYear', 'sdAge'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // ล้างข้อมูลหน้า ตำราเลข 7 ตัว
    ['input-day', 'input-month', 'input-zodiac', 'input-birthtime', 'input-age'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // 💾 ล้างข้อมูลใน localStorage
    localStorage.removeItem('userBirthdate');
    localStorage.removeItem('userBirthTime');

    console.log("✨ ล้างข้อมูลเก่าและแคชเรียบร้อย");
}

window.autoFillMemberData = function (memberKey) {
    if (!memberKey) return;

    // 🔄 ล้างข้อมูลเก่าก่อน
    clearAllFormFields();

    // 1. ค้นหาสมาชิกด้วย memberId ก่อน ถ้าไม่เจอจึง fallback ด้วย birthdate
    // ✅ User ทั่วไป: เห็นเฉพาะของตนเอง | Admin: เห็นทั้งหมด
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const history = filterHistoryByCurrentUser(allHistory);
    const member = history.find(m => m.memberId === memberKey)
                || history.find(m => m.birthdate === memberKey);

    // ⚠️ ตรวจสอบ: ถ้า User ทั่วไปพยายามเข้าถึงข้อมูลของคนอื่น
    if (!member && !isAdmin()) {
        console.warn('❌ ไม่สามารถเข้าถึงข้อมูลนี้ได้');
        Swal.fire('ปฏิเสธ', 'คุณสามารถเข้าถึงเฉพาะข้อมูลของตนเองเท่านั้น', 'warning');
        return;
    }

    // ถ้า Admin เปิดข้อมูล user อื่น ต้องดึงจากทั้งหมด
    const finalMember = member
        || allHistory.find(m => m.memberId === memberKey)
        || allHistory.find(m => m.birthdate === memberKey);

    // อัปเดต currentMemberId ทันทีที่เปลี่ยนคน
    if (finalMember && finalMember.memberId) {
        window.currentMemberId = finalMember.memberId;
    }

    // 2. แปลงวันที่ให้เป็น yyyy-MM-dd
    function formatToInputDate(dateStr) {
        if (!dateStr) return "";
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            let year = parseInt(parts[2]);
            year = toCE(year);
            return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr.split('T')[0];
    }

    // ใช้ birthdate จาก member record เสมอ (ไม่ใช้ memberKey ที่อาจเป็น memberId)
    const birthDate = (finalMember && finalMember.birthdate) || memberKey;
    const formattedDate = formatToInputDate(birthDate);

    // 3. ตรวจเช็คว่าตอนนี้อยู่หน้าไหน
    const isPageVisible = (id) => {

        const el = document.getElementById(id);

        if (!el) return false;

        return !el.classList.contains('hidden') &&
            getComputedStyle(el).display !== 'none';
    };

    const isMahathaksaPage = isPageVisible('mahathaksaPage');

    const isChatraPage = isPageVisible('chatraPage');

    const isNamePage = isPageVisible('nameAnalysisPage');


    // --- กรณีหน้าวิเคราะห์ชื่อ (Name Analysis) ---
    if (isNamePage && member) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const birthDaySelect = document.getElementById('birthDaynumSelect');

        if (firstNameInput && member.name) {
            // หั่นชื่อกับนามสกุล (ถ้าเก็บรวมกันด้วยช่องว่าง)
            const nameParts = member.name.trim().split(/\s+/);
            const lastNameParts = member.lastName ? member.lastName.trim().split(/\s+/) : [];
            if (lastNameParts.length > 0) {
                firstNameInput.value = nameParts[0] || "";
                if (lastNameInput) lastNameInput.value = lastNameParts[0] || "";
            }
        }

        if (birthDaySelect && formattedDate) {
            // หาเลขวันในสัปดาห์ (0-6) เพื่อเลือกวันเกิดอัตโนมัติ (รองรับระบบตัดเวลา 06:00 น.)
            const dayOfWeek = window.getAstrologicalDayOfWeek(formattedDate, finalMember ? finalMember.birthtime : null);
            // หมายเหตุ: ต้องระวังเรื่องวันพุธกลางคืน ถ้าในประวัติไม่ได้เก็บไว้ ระบบจะเลือกพุธกลางวัน (3) ให้ก่อนครับ
            birthDaySelect.value = dayOfWeek;
        }

    }

    // --- ส่วนของหน้า มหาทักษา (เหมือนเดิม) ---
    if (isMahathaksaPage) {
        const thaksaDateInput = document.getElementById('birthDate') || document.getElementById('birthdate');
        if (thaksaDateInput) {
            thaksaDateInput.value = formattedDate;
            thaksaDateInput.dispatchEvent(new Event('change'));
            thaksaDateInput.dispatchEvent(new Event('input'));
            if (typeof calculateThaksa === 'function') calculateThaksa(false);
        }
    }

    // --- ส่วนของหน้า ฉัตร 3 ชั้น (เหมือนเดิม) ---
    if (isChatraPage) {
        const chatraAgeInput = document.getElementById('chatraAge');
        if (chatraAgeInput) {
            chatraAgeInput.value = window.calculateRunningAge(formattedDate);
            setTimeout(() => { if (typeof calculateChatra === 'function') calculateChatra(); }, 100);
        }
    }

    //----ส่วนของหน้าลัคนา---
    const isAscendantPage =
        isPageVisible('ascendantPage'); if (isAscendantPage) {
            const dateInput = document.getElementById('ascBirthDate');
            const timeInput = document.getElementById('ascBirthTime');

            if (dateInput) dateInput.value = formattedDate;
            if (timeInput && member.birthtime) {
                // เติมเวลาเกิดจาก Firebase (สมมติเก็บในชื่อ birthtime)
                timeInput.value = member.birthtime;
            }
        }
    // --- ส่วนของหน้า ฉัตร 9 ชั้น (ฉบับแก้ไข) ---
    const ischatninePage = isPageVisible('showchatraninePage');

    if (ischatninePage) {
        const ninebirthDaySelect = document.getElementById('chatraninebirthDaySelect');
        const nineageselect = document.getElementById('chatranineAge');

        if (formattedDate) {
            // 1. จัดการเรื่องวันเกิด
            let dayOfWeek = window.getAstrologicalDayOfWeek(formattedDate, finalMember ? finalMember.birthtime : null);
            if (dayOfWeek === 0) dayOfWeek = 7; // เปลี่ยนอาทิตย์จาก 0 เป็น 7 ให้ตรงกับ HTML

            if (ninebirthDaySelect) {
                ninebirthDaySelect.value = dayOfWeek;
            }

            // 2. จัดการเรื่องอายุ
            if (nineageselect) {
                nineageselect.value = window.calculateRunningAge(formattedDate);

                // 3. สั่งคำนวณอัตโนมัติ
                setTimeout(() => {
                    if (typeof calculateChatnine === 'function') calculateChatnine();
                }, 150);
            }
        }
    }

    // ---- ส่วนของหน้าทักษาพยากรณ์ (thaksanine.js) ----    
    const isshowthaksaninepage = isPageVisible('showthaksaninepage');

    if (isshowthaksaninepage) {
        const weekdaySelect = document.getElementById('weekday');
        const ageInput = document.getElementById('age');

        if (weekdaySelect) {
            const birthDay = window.getAstrologicalDayOfWeek(formattedDate, finalMember ? finalMember.birthtime : null);
            weekdaySelect.value = birthDay;
        }

        if (ageInput) {
            ageInput.value = window.calculateRunningAge(formattedDate);
        }

        // สั่งคำนวณอัตโนมัติ (ใช้ calculateAll สำหรับหน้านี้)
        setTimeout(() => {
            if (typeof calculateAll === 'function') calculateAll();
        }, 100);
    }


    const isMahathaksaSattalekPage = isPageVisible('mahataksasattalek');

    if (isMahathaksaSattalekPage) {
        const birthDateInput = document.getElementById('birthDateSatta');
        if (birthDateInput) {
            birthDateInput.value = formattedDate;
            setTimeout(() => { if (typeof processDestiny === 'function') processDestiny(); }, 100);
        }
    }

const istaksapage = isPageVisible('taksaTablepage');

if (istaksapage) {
    // ใช้ ID ที่มีอยู่จริงใน HTML
    const genderSelect = document.getElementById('taksagender');
    const ageInput = document.getElementById('userAge');
    const birthdateSelect = document.getElementById('birthDaySelect');

    // สมมติว่า 'member' คือ object ข้อมูลสมาชิกที่ดึงมาได้
    if (member) {
        // 1. จัดการเพศ (ใช้ .value สำหรับ <select>)
        if (genderSelect) {
            genderSelect.value = member.gender; // ค่าต้องตรงกับ 'male' หรือ 'female'
        }

        // 2. คำนวณอายุย่าง (จาก member.birthdate)
        if (ageInput && member.birthdate) {
            const birthYear = new Date(member.birthdate).getFullYear();
            const currentYear = new Date().getFullYear();
            // คำนวณอายุย่าง: (ปีปัจจุบัน - ปีเกิด) + 1
            ageInput.value = (currentYear - birthYear) + 1;
        }

        // 3. จัดการเรื่องวันเกิด
        if (birthdateSelect && member.birthdate) {
            const birthDay = new Date(formattedDate).getDay();
            birthdateSelect.value = birthDay + 1;        
        }
    }
}


const isbirthfortune = isPageVisible('birthfortune');

if (isbirthfortune) {
    const birthfortune = document.getElementById('fortuneDay');
    const monthfortune = document.getElementById('fortuneMonth');
    const thaiyearname = 
    {
        'ชวด' : 0,
        'ฉลู' : 1,
        'ขาล' : 2,
        'เถาะ' : 3,
        'มะโรง' : 4,
        'มะเส็ง' : 5,
        'มะเมีย' : 6,
        'มะแม' : 7,
        'วอก' : 8,
        'ระกา' : 9,
        'จอ' : 10,
        'กุน' : 11  
    };
    const yearfortune = document.getElementById('fortuneYear');
    const befortune = document.getElementById('fortuneBE');


    if (birthfortune && member.birthdate) {
            const birthDay = new Date(formattedDate).getDay();
            birthfortune.value = birthDay;        
        }
    

    if (monthfortune && member.birthMonththai) {
        monthfortune.value = member.birthMonththai;
    }

    if (yearfortune && member.zodiac) {
        const zodiacIdx = thaiyearname[member.zodiac];
        yearfortune.value = zodiacIdx !== undefined ? zodiacIdx : "ไม่ระบุ";
    }

    if (befortune && member.birthdate) {
        befortune.value = toBE(new Date(member.birthdate).getFullYear());
    }
}

const promchartsection = isPageVisible('promchartsection');

if (promchartsection) {
    const gender = document.getElementById('userGender');
    const age = document.getElementById('userAgeprom');

    if (gender && member.gender) {
        gender.value = member.gender;
    }

    if (age && member.birthdate) {
        const birthYear = new Date(member.birthdate).getFullYear();
        const currentYear = new Date().getFullYear();
        age.value = (currentYear - birthYear) + 1;
    }
}

const sevenPage = isPageVisible('sevenPage');

if (sevenPage) {
    const day = document.getElementById('sdDay');
    const month = document.getElementById('sdMonth');
    const year = document.getElementById('sdYear');
    const thaiyearname =     {
        'ชวด' : 0,
        'ฉลู' : 1,
        'ขาล' : 2,
        'เถาะ' : 3,
        'มะโรง' : 4,
        'มะเส็ง' : 5,
        'มะเมีย' : 6,
        'มะแม' : 7,
        'วอก' : 8,
        'ระกา' : 9,
        'จอ' : 10,
        'กุน' : 11  
    }
    const age = document.getElementById('sdAge');

    if (day && member.birthdate) {
        const birthDay = new Date(formattedDate).getDay();
        day.value = birthDay;        
    }

    if (month && member.birthMonththai) {
        month.value = member.birthMonththai;
    }

    if (year && member.zodiac) {
        const zodiacIdx = thaiyearname[member.zodiac];
        year.value = zodiacIdx !== undefined ? zodiacIdx : "ไม่ระบุ";
    }   

    if (age && member.birthdate) {
        const birthYear = new Date(member.birthdate).getFullYear();
        const currentYear = new Date().getFullYear();
        age.value = (currentYear - birthYear) + 1;
    }
}


const horoseven = isPageVisible('horoscopeseven');

if (horoseven) {
    const day = document.getElementById('input-day');
    const month = document.getElementById('input-month');
    const thaiyearname =  {
        'ชวด' : 0,
        'ฉลู' : 1,
        'ขาล' : 2,
        'เถาะ' : 3,
        'มะโรง' : 4,
        'มะเส็ง' : 5,
        'มะเมีย' : 6,
        'มะแม' : 7,
        'วอก' : 8,
        'ระกา' : 9,
        'จอ' : 10,
        'กุน' : 11  
    }
    const year = document.getElementById('input-zodiac');
    const time = document.getElementById('input-birthtime');
    const age = document.getElementById('input-age');

    if (day && member.birthdate) {
        const birthDay = new Date(formattedDate).getDay();
        day.value = birthDay;        
    }

    if (month && member.birthMonththai) {
        month.value = member.birthMonththai;
    }

    if (year && member.zodiac) {
        const zodiacIdx = thaiyearname[member.zodiac];
        year.value = zodiacIdx !== undefined ? zodiacIdx : "ไม่ระบุ";
    }

    if (time && member.birthtime) {
        time.value = member.birthtime;
    }

    if (age && member.birthdate) {
        const birthYear = new Date(member.birthdate).getFullYear();
        const currentYear = new Date().getFullYear();
        age.value = (currentYear - birthYear) + 1;
    }
}

// ---- ส่วนของหน้าเลขมงคล (lotto.js) ----
const isLottoPage = isPageVisible('lottoResultpage');

if (isLottoPage && finalMember) {
    const lottoBirthday = document.getElementById('lottoBirthday');
    const lottoUserName = document.getElementById('lottoUserName');

    if (lottoBirthday) {
        lottoBirthday.value = formattedDate;
    }

    if (lottoUserName && finalMember.name) {
        lottoUserName.value = finalMember.name;
    }
}

// ---- ส่วนของหน้าปีชง-ปีเสริม (yearClash.js) ----
const isYearClashPage = isPageVisible('yearClashContainer');

if (isYearClashPage && finalMember && finalMember.birthdate) {
    const ycInput = document.getElementById('ycBirthYear');
    if (ycInput) {
        const birthYear = new Date(formattedDate).getFullYear();
        // แปลงเป็น พ.ศ. (เพราะช่องรับทั้ง พ.ศ. และ ค.ศ.)
        ycInput.value = birthYear + 543;
        setTimeout(() => { if (typeof renderYearClash === 'function') renderYearClash(); }, 150);
    }
}

}

// เพิ่มไว้ท้ายไฟล์ membermanager.js เพื่อแก้ Error: calculateEsh is not defined
window.saveToHistory = saveToHistory;
window.deleteItem = deleteItem;
window.viewHistory = viewHistory;
window.showProfilePage = showProfilePage;
window.searchHistory = searchHistory;// expose auxiliary functions used by inline handlers or other scripts
window.fillUserData = fillUserData;
window.syncDataFromFirestore = syncDataFromFirestore;
window.generateMemberId = generateMemberId;
window.deleteMember = deleteMember;
window.getProfileData = getProfileData;
window.calculateEsh = calculateEsh;
window.viewMemberProfile = viewMemberProfile;
window.loadLastProfileFromStorage = loadLastProfileFromStorage;
window.initProfileOnPageLoad = initProfileOnPageLoad;
window.currentMemberId = currentMemberId;
// ===================================================
// ===================================================
// PAYMENT & UPGRADE SYSTEM
// ===================================================
window.openPaymentModal = function(pkgName, period, price) {
    const session = getSession();
    if (!session) {
        Swal.fire('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนอัปเกรดแพ็กเกจ', 'warning').then(() => {
            if(typeof switchToLogin === 'function') switchToLogin();
        });
        return;
    }

    document.getElementById('payPkgName').textContent = pkgName;
    document.getElementById('payPkgPeriod').textContent = period;
    document.getElementById('payPrice').textContent = price.toLocaleString();

    const promptPayId = "0943926453";
    const qrUrl = `https://promptpay.io/${promptPayId}/${price}.png`;
    document.getElementById('promptpayQR').src = qrUrl;

    document.getElementById('slipUpload').value = '';
    document.getElementById('paymentModalOverlay').style.display = 'flex';
};

window.submitPayment = async function() {
    const slipFile = document.getElementById('slipUpload').files[0];
    if (!slipFile) {
        Swal.fire('กรุณาแนบสลิป', 'โปรดแนบรูปภาพสลิปหลักฐานการโอนเงินก่อนส่ง', 'warning');
        return;
    }

    Swal.fire({
        title: 'กำลังส่งข้อมูล...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const session = getSession();
        const pkgName = document.getElementById('payPkgName').textContent;
        const period = document.getElementById('payPkgPeriod').textContent;
        const price = document.getElementById('payPrice').textContent;

        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const paymentsRef = collection(window.firebaseDb, "payments");

        await addDoc(paymentsRef, {
            username: session.username,
            email: session.email || '',
            package: pkgName,
            period: period,
            price: price,
            status: 'pending',
            timestamp: new Date().toISOString()
        });

        document.getElementById('paymentModalOverlay').style.display = 'none';

        Swal.fire({
            icon: 'success',
            title: 'ส่งหลักฐานสำเร็จ!',
            text: 'ระบบได้รับข้อมูลการชำระเงินของคุณแล้ว กรุณารอแอดมินตรวจสอบและอัปเกรดสถานะให้ภายใน 24 ชั่วโมง',
        });

    } catch (error) {
        console.error("Payment Submission Error:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
};