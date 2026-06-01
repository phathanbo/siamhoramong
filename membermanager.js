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

// ✅ ดึง username จาก auth session (ไม่ซ้ำกัน)
function getCurrentUsername() {
    try {
        const session = localStorage.getItem('siamhora_auth_session');
        if (session) {
            const data = JSON.parse(session);
            // 👤 ใช้ username (unique identifier) ไม่ใช่ displayName
            return data.username || null;
        }
    } catch (e) {
        console.warn('⚠️ ไม่สามารถดึง username จาก session:', e);
    }
    return localStorage.getItem('thaiHoroUserName') || null;
}

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

        // ตรวจสอบค่าก่อนนำไปใช้
        console.log("ค่าที่เลือกคือ:", selectedGender);

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
    console.log("🔄 กำลังซิงค์ข้อมูลจาก Cloud...");
    try {
        const q = query(membersCol, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const history = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });

        // เก็บลง LocalStorage ตามเดิม
        localStorage.setItem('horo_history', JSON.stringify(history));

        // --- ส่วนที่เพิ่มใหม่: กระจายรายชื่อไปทุกหน้า ---
        updateAllMemberSelectors(history);

        if (typeof loadHistory === 'function') loadHistory();
        console.log("✅ ซิงค์และอัปเดตรายชื่อสำเร็จ");
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
            option.value = member.birthdate || "";
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
    console.log('📄 DOMContentLoaded: รอการเตรียมข้อมูล...');

    // รอ auth session initialize (สูงสุด 5 วินาที)
    let retries = 0;
    const maxRetries = 50; // 50 × 100ms = 5 วินาที

    while (retries < maxRetries) {
        const session = localStorage.getItem('siamhora_auth_session');
        if (session) {
            console.log('✅ Auth session พบแล้ว กำลังซิงค์...');
            try {
                await syncDataFromFirestore();
                console.log('✅ DOMContentLoaded: ซิงค์สำเร็จ');
            } catch (err) {
                console.error('❌ DOMContentLoaded sync error:', err);
            }
            return;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 100)); // รอ 100ms
    }

    console.warn('⚠️ Auth session ไม่พบ หลังจากรอ 5 วินาที');
});

// --- เพิ่มฟังก์ชันนี้เพื่อกรอกข้อมูลอัตโนมัติ ---
function fillUserData() {
    const targetInput = document.getElementById('targetName');
    if (targetInput) {
        try {
            const session = localStorage.getItem('siamhora_auth_session');
            if (session) {
                const data = JSON.parse(session);
                // ✅ ใช้ displayName ไม่ใช่ username
                const displayName = data.displayName || '';
                if (displayName) {
                    targetInput.value = displayName;
                    console.log('✅ fillUserData: เติมชื่อ', displayName);
                }
            }
        } catch (e) {
            console.warn('⚠️ fillUserData error:', e);
        }
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
            console.log('✅ บันทึกข้อมูลสมาชิก:', profileData.name, '(User:', username + ')');
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
            
            console.log("✅ ดึงจากโปรไฟล์:", profileData);
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
 
        console.log("✅ บันทึกสำเร็จ:", dataToSave);

        // ========================================
        // 8️⃣ อัปเดต UI (Dropdown, ประวัติ) ทันที
        // ========================================

        // 🔄 ซิงค์และอัปเดต Dropdown + ประวัติ
        if (typeof syncDataFromFirestore === 'function') {
            await syncDataFromFirestore();
            console.log('🔄 อัปเดต UI สำเร็จ');
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
            console.log('✅ Admin: บันทึกข้อมูลสมาชิกจำนวนไม่จำกัด');
        }
    } else {
        // ✅ User ปกติ: เก็บแค่ 1 คน (Single-Entry)
        const success = SingleProfileManager.save(data);

        if (success) {
            if (typeof saveMember === 'function') {
                saveMember(data);
            }
            console.log('✅ User: บันทึกข้อมูลสมาชิก 1 คนเรียบร้อย');

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
        alert('❌ Admin สามารถจัดการข้อมูลหลายรายการได้ ไม่จำเป็นต้องลบ');
        return;
    }

    if (!SingleProfileManager.exists()) {
        alert('❌ ไม่มีข้อมูลสมาชิกที่ต้องลบ');
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
                console.log('✅ ลบข้อมูลแล้ว พร้อมเพิ่มข้อมูลใหม่');
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

        return dateStr +
            String(nextSeq).padStart(2, '0');

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
    console.log('🎨 renderTable: historyBody =', historyBody);
    console.log('🎨 renderTable: dataArray =', dataArray);

    if (!historyBody) {
        console.error('❌ ไม่พบ element: historyBody');
        return;
    }

    historyBody.innerHTML = '';
    if (!dataArray || dataArray.length === 0) {
        console.warn('⚠️ ไม่พบข้อมูล');
        historyBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">ไม่พบข้อมูล</td></tr>';
        return;
    }

    console.log(`✅ แสดง ${dataArray.length} แถว`);
    dataArray.forEach((item, idx) => {
        // ใช้ item.id (Cloud ID) แทน Date.now()
        const row = `
            <tr>
                <td>${item.memberId || 'N/A'}</td>
                <td>${item.name}</td>
                <td>${item.lastName || '-'}</td>
                <td>${item.birthdate}</td>
                <td>${item.zodiac || '-'}</td>
                <td>${item.yam || '-'}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewHistory('${item.id}')">🔍 ดู</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteItem('${item.id}')">🗑️ ลบ</button>
                    </div>
                </td>
            </tr>`;
        historyBody.insertAdjacentHTML('beforeend', row);
        console.log(`  └─ แถว ${idx + 1}:`, item.name);
    });
}

// 🔐 ฟังก์ชันกรองข้อมูลให้เหลือแค่ของ User ที่ล็อกอิน (Admin เห็นทั้งหมด)
function filterHistoryByCurrentUser(allHistory) {
    const currentUser = getCurrentUsername();
    console.log('🔐 filterHistoryByCurrentUser:');
    console.log('  currentUser (username):', currentUser);
    console.log('  typeof isAdmin:', typeof isAdmin);
    console.log('  allHistory[0]:', allHistory[0]); // 👈 ดูข้อมูลตัวอย่าง

    if (!currentUser) {
        console.warn('⚠️ ไม่พบ currentUser');
        return [];
    }

    // ✅ ตรวจสอบว่า Admin หรือไม่
    const isAdminUser = typeof isAdmin === 'function' && isAdmin();
    console.log('  isAdminUser:', isAdminUser);
    console.log('  allHistory.length:', allHistory.length);

    if (isAdminUser) {
        // 👨‍💼 Admin เห็นข้อมูลทั้งหมด
        console.log(`👨‍💼 Admin: แสดงข้อมูลทั้งหมด (${allHistory.length} รายการ)`);
        console.log('  usernames:', allHistory.map(x => x.username || x.name));
        return allHistory;
    } else {
        // 👤 User ปกติ เห็นเฉพาะของตนเอง (กรองตาม username ไม่ใช่ name)
        console.log(`🔍 User: กรองข้อมูลสำหรับ ${currentUser}`);
        console.log('  all usernames:', allHistory.map(x => `[${x.username}|${x.name}]`)); // 👈 ดูค่า username
        const filtered = allHistory.filter(item => (item.username || item.name) === currentUser);
        console.log(`✅ พบ ${filtered.length} รายการของ ${currentUser}`);
        return filtered;
    }
}

function loadHistory() {
    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    console.log('📊 horo_history ทั้งหมด:', allHistory.length, 'รายการ', allHistory);

    // ✅ กรองให้เหลือแค่ของ current user
    const history = filterHistoryByCurrentUser(allHistory);
    console.log('🎯 หลังกรอง:', history.length, 'รายการ', history);

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

    // 2. บันทึกทับลงใน LocalStorage หลัก (userBirthdate) 
    // เพื่อให้ "กราฟชีวิต" และส่วนอื่นๆ ดึงไปใช้ต่อได้ทันที
    localStorage.setItem('userBirthdate', birthdate);
    if (typeof updateGraph === 'function') {
        updateGraph();
    }

    // 3. แจ้งเตือนให้ผู้ใช้ทราบ (Optional)
    console.log("เปลี่ยนข้อมูลเป็นของ: " + name + " (" + birthdate + ")");

    // 4. พาผู้ใช้กลับไปหน้าหลัก หรือหน้าทำนายทันที
    // navigateTo('homePage'); // หรือหน้าอื่นๆ ที่คุณต้องการ

    alert("โหลดข้อมูลของคุณ " + name + " เรียบร้อยแล้ว");
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
    const confirmMsg = isAdminUser
        ? `ลบข้อมูล ${targetItem.name}?`
        : "ยืนยันการลบข้อมูลนี้ถาวร?";

    if (!confirm(confirmMsg)) return;
    try {
        await deleteDoc(doc(db, "horo_history", docId));
        await syncDataFromFirestore(); // รีเฟรชข้อมูล
        console.log("✅ ลบข้อมูลสำเร็จ ID:", docId);
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
        console.log("📍 ใช้ memberId จาก data:", memberId);
    }
    
    // 3️⃣ ถ้ายังไม่มี data → ดึงล่าสุด (fallback)
    if (!data || !data.birthdate) {
        console.log("📌 Fallback: ดึงล่าสุด");
        data = loadLastProfileFromStorage();
    }
    
    if (!data || !data.birthdate) {
        console.error("❌ ไม่พบข้อมูลโปรไฟล์");
        return;
    }
 
    console.log("✨ แสดงโปรไฟล์:", data.name, data.lastName);
 
    const predictionArea = document.getElementById('profPredictionArea');
    if (!predictionArea) return;

    // 1. แปลงวันเกิด
    const birthDateObj = parseThaiDate(data.birthdate);

    const dayIdx = birthDateObj.getDay();
    const monthIdx = birthDateObj.getMonth();
    const year = birthDateObj.getFullYear();
    const yam = getYarmFromTime(data.birthtime || "00:00");



    // 2. เรียกข้อมูลธาตุจาก script.js
    const elementData = typeof window.getElementData === 'function'
        ? window.getElementData(data.birthdate)
        : { name: "ไม่ระบุ", color: "#ccc", desc: "ขาดข้อมูลการคำนวณ" };

    const mElement = typeof window.getMonthElement === 'function'
        ? window.getMonthElement(monthIdx)
        : { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };

    const zElement = typeof window.getZodiacElement === 'function'
        ? window.getZodiacElement(birthDateObj)
        : {
            name: "ไม่ระบุ",
            color: "#ccc",
            element: "-",
            desc: "-",
            job: "-"
        };

    // 3. วิเคราะห์ความสัมพันธ์ธาตุ
    let relDayMonth = "ทั่วไป";
    let relDayYear = "ทั่วไป";

    if (typeof window.getElementRelation === 'function') {
        relDayMonth = window.getElementRelation(elementData?.name, mElement?.name) || "ทั่วไป";
        relDayYear = window.getElementRelation(elementData?.name, zElement?.element) || "ทั่วไป";
    }

    // 4. จัดรูปเวลา
    let cleanTime = data.birthtime || "--:--";

    if (cleanTime.includes('T')) {
        cleanTime = cleanTime.split('T')[1].substring(0, 5);
    } else {
        cleanTime = cleanTime.substring(0, 5);
    }

    // 5. แสดงข้อมูล Header
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
    setText('profYam', data.yam || "ไม่ระบุ");
    setText('profullname', `${data.name} ${data.lastName || ''}`);

    // 6. แสดงผลคำทำนาย
    predictionArea.innerHTML = `
        <div id="captureArea" class="p-4" style="background:#fdfaf0;border:1px solid #d4af37">
            <div class="text-center">
                <h2 style="color:#b8860b">🔮 แผ่นดวงชะตา</h2>
                <h4 style="color:#333; font-weight: bold; font-size: 25px;">คุณ ${data.name} ${data.lastName || ''}</h4>
            </div>
            <hr style="border-top:2px double #d4af37">
            <div class="prediction-content">
                <br><strong>วันเกิด:</strong> วัน${dayIdx !== undefined ? ` ${["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][dayIdx]}` : ''} ที่ ${parseInt(data.birthdate.split('/')[0])} ${monthIdx !== undefined ? ` ${["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][monthIdx]}` : ''} พ.ศ. ${year + 543}    
               <strong>นักษัตร:</strong> ปี${zElement.name} (${zElement.element}) 
               <br><strong>เวลาเกิด:</strong> ${cleanTime} น.   <strong>ยามเกิด:</strong> ${data.yam || "ไม่ระบุ"}
                
                <hr style="border-top:1px dashed #d4af37">

                <!-- ธาตุวันเกิด -->
                <div class="mb-3 p-3 rounded" style="background:${elementData.color}15;border:1px solid ${elementData.color}">
                    <strong style="color:${elementData.color}">
                        🧬 ธาตุประจำวันเกิด: ${elementData.name} ${elementData.level || ""} <span style="font-weight: normal;">เป็นคน ${elementData.desc}</span>
                    </strong>
                </div>

                <!-- ธาตุเดือน -->
                <div class="mb-3 p-3 rounded" style="background:${mElement.color}15;border:1px solid ${mElement.color}">
                    <strong style="color:${mElement.color}">
                        📅 ธาตุเดือนเกิด: ${mElement.name} ${mElement.level || ""} (กำลัง: ${mElement.strength}) <span style="font-weight: normal;">เป็นคน ${mElement.desc}</span>
                    </strong>                    
                </div>

                <!-- ธาตุนักษัตร -->
                <div class="mb-3 p-3 rounded" style="background:${zElement.color}15;border:1px solid ${zElement.color}">
                    <strong style="color:${zElement.color}">
                        🐉 ธาตุปีนักษัตร: ${zElement.name} (${zElement.element}) <span style="font-weight: normal;">เป็นคน ${zElement.desc}</span><br>
                        <b>🚀 งานที่เหมาะกับดวงปี${zElement.name}</b> <span style="font-weight: normal;">เหมาะกับอาชีพ : ${zElement.job || "ไม่ระบุ"}</span>
                    </strong>
                </div>

                <!-- วิเคราะห์ธาตุ -->
                <div class="mt-4 p-3 rounded" style="background:#fff;border:2px dashed #d4af37">
                    <h5 class="text-center" style="color:#b8860b">⚖️ วิเคราะห์สมพงษ์ธาตุ</h5>

                    <div class="small p-2 bg-light rounded mb-2">
                        <strong>วันเกิด ${elementData.name} + เดือนเกิด ${mElement.name}:</strong> ${relDayMonth}
                    </div>

                    <div class="small p-2 bg-light rounded">
                        <strong>วันเกิด${elementData.name} + ปีนักษัตร ${zElement.element}:</strong> ${relDayYear}
                    </div>
                </div>
                <hr style="border-top:1px dashed #d4af37">
                <div class="mb-3">
                    <strong>คำทำนายวันเกิด:</strong>
                    ${typeof getDayPrediction === 'function' ? getDayPrediction(dayIdx) : "-"}
                </div>
                <div class="mb-3">
                    <strong>คำทำนายเดือนเกิด:</strong>
                    ${typeof getMonthPrediction === 'function' ? getMonthPrediction(monthIdx) : "-"}
                </div>
                <div class="mb-3">
                    <strong>คำทำนายปีนักษัตร:</strong>
                    ${typeof getZodiacPrediction === 'function' ? getZodiacPrediction(["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"].indexOf(zElement.name)) : "-"}
                </div>

                <hr style="border-top: 2px dashed #d4af37; margin: 30px 0;">

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
            </div>
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

document.addEventListener('DOMContentLoaded', () => {
    initProfileOnPageLoad();
});

function getProfileByMemberId(identifier) {
    try {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];
        console.log('🔍 getProfileByMemberId:', { identifier, historyLength: history.length });

        // ค้นหาโดยใช้ username
        let profile = history.find(item => item.username === identifier);
        console.log('  ค้นหา username:', { found: !!profile, username: profile?.username });

        // ถ้าไม่เจอ ลองค้นหาจาก name
        if (!profile) {
            profile = history.find(item => item.name === identifier);
            console.log('  ค้นหา name:', { found: !!profile, name: profile?.name });
        }

        // ถ้าไม่เจอ ลองค้นหาจาก ID
        if (!profile) {
            profile = history.find(item => item.id === identifier);
            console.log('  ค้นหา ID:', { found: !!profile, id: profile?.id });
        }

        if (profile) {
            console.log('✅ พบข้อมูล:', { username: profile.username, name: profile.name, id: profile.id });
        } else {
            console.log('❌ ไม่พบข้อมูล สำหรับ:', identifier);
            console.log('  ข้อมูลที่มี:', history.slice(0, 3).map(x => ({ username: x.username, name: x.name, id: x.id })));
        }

        return profile || null;
    } catch (e) {
        console.error('❌ Error getting profile by ID:', e);
        return null;
    }
}

function viewMemberProfile(memberId) {
    if (!memberId) {
        console.warn('⚠️ ไม่มี memberId');
        return;
    }

    const profile = getProfileByMemberId(memberId);

    console.log('🔍 viewMemberProfile:', { memberId, foundProfile: !!profile });

    if (profile) {
        showProfilePage(profile);  // ✅ ส่ง profile (data จะมี memberId)

        if (typeof navigateTo === 'function') {
            navigateTo('profilePage');
        }
    } else {
        alert('⚠️ ไม่พบข้อมูลสมาชิก');
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
    localStorage.removeItem('siamHora_Profile');

    console.log("✨ ล้างข้อมูลเก่าและแคชเรียบร้อย");
}

window.autoFillMemberData = function (birthDate) {
    if (!birthDate) return;

    // 🔄 ล้างข้อมูลเก่าก่อน
    clearAllFormFields();

    // 1. ค้นหาข้อมูลสมาชิกตัวเต็มจาก Array (เพื่อเอาชื่อ)
    // ✅ User ทั่วไป: เห็นเฉพาะของตนเอง | Admin: เห็นทั้งหมด
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const history = filterHistoryByCurrentUser(allHistory);
    const member = history.find(m => m.birthdate === birthDate);

    // ⚠️ ตรวจสอบ: ถ้า User ทั่วไปพยายามเข้าถึงข้อมูลของคนอื่น
    if (!member && !isAdmin()) {
        console.warn('❌ ไม่สามารถเข้าถึงข้อมูลนี้ได้');
        Swal.fire('ปฏิเสธ', '❌ คุณสามารถเข้าถึงเฉพาะข้อมูลของตนเองเท่านั้น', 'warning');
        return;
    }

    // ถ้า Admin เปิดข้อมูล user อื่น ต้องดึงจากทั้งหมด
    const finalMember = member || allHistory.find(m => m.birthdate === birthDate);

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
            if (year > 2400) year -= 543;
            return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr.split('T')[0];
    }

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
            // หาเลขวันในสัปดาห์ (0-6) เพื่อเลือกวันเกิดอัตโนมัติ
            const dayOfWeek = new Date(formattedDate).getDay();
            // หมายเหตุ: ต้องระวังเรื่องวันพุธกลางคืน ถ้าในประวัติไม่ได้เก็บไว้ ระบบจะเลือกพุธกลางวัน (3) ให้ก่อนครับ
            birthDaySelect.value = dayOfWeek;
        }

    }

    // --- ส่วนของหน้า มหาทักษา (เหมือนเดิม) ---
    if (isMahathaksaPage) {
        const thaksaDateInput = document.getElementById('birthDate');
        if (thaksaDateInput) {
            thaksaDateInput.value = formattedDate;
            setTimeout(() => { if (typeof calculateThaksa === 'function') calculateThaksa(false); }, 100);
        }
    }

    // --- ส่วนของหน้า ฉัตร 3 ชั้น (เหมือนเดิม) ---
    if (isChatraPage) {
        const chatraAgeInput = document.getElementById('chatraAge');
        if (chatraAgeInput) {
            const birthYear = new Date(formattedDate).getFullYear();
            chatraAgeInput.value = new Date().getFullYear() - birthYear;
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
            let dayOfWeek = new Date(formattedDate).getDay();
            if (dayOfWeek === 0) dayOfWeek = 7; // เปลี่ยนอาทิตย์จาก 0 เป็น 7 ให้ตรงกับ HTML

            if (ninebirthDaySelect) {
                ninebirthDaySelect.value = dayOfWeek;
            }

            // 2. จัดการเรื่องอายุ
            if (nineageselect) {
                const birthYear = new Date(formattedDate).getFullYear();
                const currentYear = new Date().getFullYear();
                // คำนวณอายุย่าง (ปีปัจจุบัน - ปีเกิด) + 1 (หรือตามสูตรที่คุณใช้)
                nineageselect.value = currentYear - birthYear + 1;

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
            const birthDay = new Date(formattedDate).getDay();
            weekdaySelect.value = birthDay;
        }

        if (ageInput) {
            const birthYear = new Date(formattedDate).getFullYear();
            const currentYear = new Date().getFullYear();
            // คำนวณอายุย่าง
            ageInput.value = currentYear - birthYear + 1;
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
    }
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
        befortune.value = new Date(member.birthdate).getFullYear() + 543;
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

}

// เพิ่มไว้ท้ายไฟล์ membermanager.js เพื่อแก้ Error: calculateEsh is not defined
window.navigateTo = navigateTo;
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
window.analyzeName = analyzeName;
window.calculateEsh = calculateEsh;
window.calculateLifeGraph = calculateLifeGraph;
window.viewMemberProfile = viewMemberProfile;
window.loadLastProfileFromStorage = loadLastProfileFromStorage;
window.initProfileOnPageLoad = initProfileOnPageLoad;
window.currentMemberId = currentMemberId;
