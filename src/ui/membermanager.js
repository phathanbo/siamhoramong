"use strict";

let currentMemberId = null;  // ← เพิ่มบรรทัดนี้


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs,
    query, where, orderBy, deleteDoc, doc, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. การตั้งค่า Firebase (นำข้อมูลจาก Firebase Console ของคุณมาใส่ที่นี่)
const firebaseConfig = {
    apiKey: "AIzaSyAXf-p2Wo5Ush1BP57ehCaYIZLoHV3CeCE",
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

function safeParseThaiDate(dateStr) {
    if (typeof window !== 'undefined' && typeof window.parseThaiDate === 'function') {
        return window.parseThaiDate(dateStr);
    }
    if (typeof window !== 'undefined' && typeof window.parseBirthdate === 'function') {
        return window.parseBirthdate(dateStr);
    }
    if (typeof parseBirthdate === 'function') {
        return parseBirthdate(dateStr);
    }
    return new Date(dateStr);
}

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
        const canViewAll = typeof canViewAllMembers === 'function' ? canViewAllMembers() : (typeof isAdmin === 'function' && isAdmin());

        let q;
        if (canViewAll) {
            // Admin, Data Manager, Member Checker ดึงข้อมูลทั้งหมด
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
        if (!canViewAll) {
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
    if (!allHistory || !Array.isArray(allHistory)) {
        try {
            allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
        } catch (e) {
            allHistory = [];
        }
    }
    if (!Array.isArray(allHistory)) allHistory = [];

    if (typeof window.initStandaloneProfile === 'function' && document.getElementById('profileMemberSelect')) {
        window.initStandaloneProfile();
    }

    // ✅ กรองข้อมูลให้ User ทั่วไปเห็นเฉพาะของตนเอง
    let history = filterHistoryByCurrentUser(allHistory);
    if (!Array.isArray(history)) history = [];

    const canViewAll = typeof canViewAllMembers === 'function' ? canViewAllMembers() : (typeof isAdmin === 'function' && isAdmin());

    // ดึง Select ทุกตัวที่มี id หรือ class ที่เรากำหนดไว้
    const selectors = document.querySelectorAll('#nameMemberSelect, #memberSelect, .member-selector-shared, .member-selector, #dsMemberSelect1, #dsMemberSelect2');

    // สำหรับสมาชิกทั่วไป: ดึงข้อมูลสมาชิกของตนเองมาเป็นค่าเริ่มต้น
    const defaultMember = (!canViewAll && history.length > 0) ? history[0] : null;
    const defaultMemberVal = defaultMember ? (defaultMember.memberId || defaultMember.birthdate || "") : "";

    selectors.forEach(select => {
        if (select.id === 'profileMemberSelect') return; // หน้า profile มีระบบ initStandaloneProfile ของตนเอง
        const currentVal = select.value; // เก็บค่าที่เลือกค้างไว้ก่อนหน้า (ถ้ามี)
        
        // ถ้าเป็น User ทั่วไป และมีข้อมูลตนเอง ไม่จำเป็นต้องขึ้น '-- เลือกสมาชิกจากประวัติ --' เป็นตัวเลือกบังคับ
        if (!canViewAll && history.length === 1) {
            select.innerHTML = '';
        } else {
            select.innerHTML = '<option value="">-- เลือกสมาชิกจากประวัติ --</option>';
        }

        history.forEach(member => {
            if (!member) return;
            const option = document.createElement('option');
            option.value = member.memberId || member.birthdate || "";
            option.textContent = `${member.memberId ? `${member.memberId} - ` : ''}${member.name || ''}${member.lastName ? ` ${member.lastName}` : ''}`;
            option.setAttribute('data-name', member.name || '');
            option.setAttribute('data-member', JSON.stringify(member));
            select.appendChild(option);
        });

        // กำหนดค่ากลับ: ถ้ามี currentVal เดิมให้คงไว้ ถ้าไม่มีและเป็นสมาชิกทั่วไปให้เลือก defaultMemberVal อัตโนมัติ
        if (currentVal) {
            select.value = currentVal;
        } else if (defaultMemberVal) {
            select.value = defaultMemberVal;
        }
    });

    // หากเป็น User ทั่วไป และมีค่า defaultMemberVal ให้อัปเดต window.currentMemberId และเรียก autoFillMemberData อัตโนมัติ
    if (!canViewAll && defaultMemberVal) {
        window.currentMemberId = defaultMember.memberId || defaultMemberVal;
        if (typeof autoFillMemberData === 'function') {
            try {
                autoFillMemberData(defaultMemberVal);
            } catch (err) {
                console.warn("Auto-fill member data error:", err);
            }
        }
    }
}

// ส่งฟังก์ชันออกไปให้โลกภายนอกรู้จัก (เพราะไฟล์นี้เป็น Module)
window.syncDataFromFirestore = syncDataFromFirestore;
window.updateAllMemberSelectors = updateAllMemberSelectors;
window.openChangeRoleModal = openChangeRoleModal;
window.getMemberRole = getMemberRole;
window.filterHistoryByCurrentUser = filterHistoryByCurrentUser;


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
    let profile = SingleProfileManager.load();
    if (profile && profile.birthdate) return profile;

    // Fallback 1: ตรวจสอบจาก currentMemberId ถ้ามี
    if (window.currentMemberId && typeof getProfileByMemberId === 'function') {
        profile = getProfileByMemberId(window.currentMemberId);
        if (profile && profile.birthdate) return profile;
    }

    // Fallback 2: ตรวจสอบจากประวัติ horo_history หรือ loadAllAvailableProfiles
    if (typeof window.loadAllAvailableProfiles === 'function') {
        const all = window.loadAllAvailableProfiles();
        if (Array.isArray(all) && all.length > 0) {
            return all[0];
        }
    }

    try {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];
        if (history.length > 0) {
            return history[0];
        }
    } catch (e) {}

    return null;
}

function getYarmFromTime(timeStr) {
    // =========================
    // ตรวจ dependency
    // =========================
    const yarmChart = typeof YARM_CHART !== 'undefined' ? YARM_CHART : (typeof window !== 'undefined' ? window.YARM_CHART : undefined);
    const yarmInfo = typeof YARM_INFO !== 'undefined' ? YARM_INFO : (typeof window !== 'undefined' ? window.YARM_INFO : undefined);

    if (!yarmChart || !yarmInfo) {
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
        let nTotal = total < 360 ? total + 1440 : total;
        yarmIndex = Math.floor((nTotal - 1080) / 90);
        isDay = false;
    }

    const day = new Date().getDay();

    // =========================
    // อ่านข้อมูลยาม
    // =========================
    const chart = isDay ? yarmChart.day : yarmChart.night;

    if (!chart || !chart[day] || typeof chart[day][yarmIndex] === 'undefined') {
        return "ไม่ระบุ";
    }

    const starId = chart[day][yarmIndex];
    if (!yarmInfo[starId] || !yarmInfo[starId].name) {
        return "ไม่ระบุ";
    }

    return yarmInfo[starId].name;
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
        
        const birthDateObj = safeParseThaiDate(birthdate);
 
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

// Helper ดึงระดับสิทธิ์ของสมาชิก
function getMemberRole(item) {
    if (item && item.role) return item.role;
    try {
        const users = JSON.parse(localStorage.getItem('siamhora_users') || '[]');
        const u = users.find(x => x && (x.username === item.username || x.username === item.name || x.displayName === item.name));
        if (u && u.role) return u.role;
    } catch (e) {}
    return 'user';
}

// --- ฟังก์ชัน Render ตารางแยกออกมาเพื่อให้ใช้ซ้ำได้ทั้ง Load ปกติ และ ค้นหา
function renderTable(dataArray) {
    const historyBody = document.getElementById('historyBody');

    if (!historyBody) {
        return;
    }

    historyBody.innerHTML = '';
    if (!dataArray || dataArray.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5" style="background: rgba(13,21,39,0.5);">
                    <i class="fas fa-user-slash fa-3x text-muted mb-3 d-block"></i>
                    <span style="color: #CBD5E1; font-size: 1rem;">ยังไม่พบประวัติสมาชิกที่ลงทะเบียน</span>
                </td>
            </tr>`;
        return;
    }

    const esc = (v) => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    const isCurrentUserAdmin = typeof canManageRoles === 'function' ? canManageRoles() : (typeof isAdmin === 'function' && isAdmin());
    const isCurrentUserChecker = typeof isMemberChecker === 'function' ? isMemberChecker() : false;
    const canUserEdit = typeof canEditAllMembers === 'function' ? canEditAllMembers() : isCurrentUserAdmin;

    dataArray.forEach((item, index) => {
        const safeId = esc(item.id);
        const memberIdText = esc(item.memberId) || 'N/A';
        const fullName = `${esc(item.name)} ${esc(item.lastName) || ''}`.trim();
        const birthdateText = esc(item.birthdate) || '-';
        const zodiacText = esc(item.zodiac) || '-';
        const yamText = esc(item.yam) || '-';
        const roleKey = getMemberRole(item);
        const roleBadge = typeof getRoleBadgeHTML === 'function' ? getRoleBadgeHTML(roleKey) : '';
        const targetUsername = esc(item.username || item.name || item.memberId);
        const safeName = esc(item.name || targetUsername);

        const row = `
            <tr style="
                border-bottom: 1px solid rgba(255,255,255,0.06);
                transition: background 0.25s ease;
                background: ${index % 2 === 0 ? 'rgba(20,32,58,0.3)' : 'rgba(13,21,39,0.3)'};
            "
            onmouseover="this.style.background='rgba(241,208,110,0.1)';"
            onmouseout="this.style.background='${index % 2 === 0 ? 'rgba(20,32,58,0.3)' : 'rgba(13,21,39,0.3)'}';"
            >
                <td style="padding: 16px 12px; vertical-align: middle;">
                    <span class="badge" style="background: rgba(241,208,110,0.18); color: #FFF0A8; border: 1px solid rgba(241,208,110,0.4); padding: 5px 12px; border-radius: 15px; font-weight: 600; font-size: 0.85rem;">
                        ${memberIdText}
                    </span>
                </td>
                <td style="padding: 16px 12px; vertical-align: middle; text-align: left;">
                    <div style="font-weight: 600; color: #FFFFFF; font-size: 1rem;">
                        ${fullName}
                    </div>
                    <div class="mt-1">
                        ${roleBadge}
                    </div>
                </td>
                <td style="padding: 16px 12px; vertical-align: middle; color: #E2E8F0; font-size: 0.95rem;">
                    <i class="far fa-calendar-alt text-warning mr-1"></i> ${birthdateText}
                </td>
                <td style="padding: 16px 12px; vertical-align: middle;">
                    <span style="display: inline-block; padding: 4px 10px; background: rgba(56,178,172,0.15); border: 1px solid rgba(56,178,172,0.3); border-radius: 8px; color: #81E6D9; font-size: 0.85rem;">
                        ${zodiacText}
                    </span>
                </td>
                <td style="padding: 16px 12px; vertical-align: middle; color: #CBD5E1; font-size: 0.95rem;">
                    ${yamText}
                </td>
                <td style="padding: 16px 12px; vertical-align: middle;">
                    <div class="d-inline-flex gap-2 align-items-center" style="gap: 6px;">
                        <button class="btn btn-sm btn-gold px-3 py-1" onclick="viewHistory('${safeId}')" style="border-radius: 20px; font-weight: 600; font-size: 0.85rem; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" title="ดูผลการพยากรณ์">
                            <i class="fas fa-chart-pie mr-1"></i> พยากรณ์
                        </button>
                        ${isCurrentUserAdmin ? `
                        <button class="btn btn-sm btn-outline-warning px-2 py-1" onclick="openChangeRoleModal('${targetUsername}', '${roleKey}', '${safeName}')" style="border-radius: 20px; font-size: 0.85rem; border-color: #d4af37; color: #ffd700;" title="ปรับเปลี่ยนระดับสิทธิ์">
                            <i class="fas fa-user-shield mr-1"></i> สิทธิ์
                        </button>` : ''}
                        ${(!isCurrentUserChecker && canUserEdit) ? `
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="deleteItem('${safeId}')" style="border-radius: 20px; font-size: 0.85rem;" title="ลบข้อมูล">
                            <i class="fas fa-trash-alt"></i>
                        </button>` : ''}
                    </div>
                </td>
            </tr>`;
        historyBody.insertAdjacentHTML('beforeend', row);
    });
}

// 👑 Modal สำหรับเลือกปรับระดับสิทธิ์สมาชิก
function openChangeRoleModal(username, currentRole, displayName) {
    if (typeof canManageRoles === 'function' && !canManageRoles()) {
        return Swal.fire('ไม่มีสิทธิ์', 'เฉพาะแอดมินเท่านั้นที่มีสิทธิ์ปรับระดับสมาชิก', 'warning');
    }

    const currentRoleKey = currentRole || 'user';
    
    const html = `
        <div class="text-left p-2">
            <div class="mb-3 text-center p-3 rounded" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.25);">
                <div class="text-gold font-weight-bold" style="font-size: 1.15rem;">${displayName || username}</div>
                <small class="text-white-50">บัญชีผู้ใช้: @${username}</small>
                <div class="mt-2">สิทธิ์ปัจจุบัน: ${typeof getRoleBadgeHTML === 'function' ? getRoleBadgeHTML(currentRoleKey) : currentRoleKey}</div>
            </div>
            <div class="form-group mb-3">
                <label class="text-gold small mb-1"><i class="fas fa-id-badge mr-1"></i> เลือกระดับสิทธิ์ใหม่:</label>
                <select id="swalRoleSelect" class="form-control bg-dark text-gold border-warning w-100" style="height: 46px; font-size: 0.95rem; background-color: #1a1a1a; border: 1px solid #d4af37; border-radius: 8px;">
                    <option value="admin" ${currentRoleKey === 'admin' ? 'selected' : ''}>👑 แอดมิน (Admin) - สิทธิ์สูงสุด จัดการทุกส่วนและปรับสิทธิ์ได้</option>
                    <option value="data_manager" ${currentRoleKey === 'data_manager' ? 'selected' : ''}>📁 ผู้ดูแลข้อมูล (Data Manager) - จัดการ/แก้ไข/ลบสมาชิก และดูสถิติ</option>
                    <option value="member_checker" ${currentRoleKey === 'member_checker' ? 'selected' : ''}>🔍 คนเช็คสมาชิก (Member Checker) - ค้นหา/ดูข้อมูลสมาชิกทุกคน (ดูได้อย่างเดียว)</option>
                    <option value="user" ${currentRoleKey === 'user' ? 'selected' : ''}>👤 สมาชิกทั่วไป (General Member) - ดูเฉพาะข้อมูลตนเอง และดูดวง</option>
                </select>
            </div>
            <div class="card p-3 bg-black border-gold" style="border-radius: 10px; font-size: 0.82rem; color: #CBD5E1; line-height: 1.6;">
                <div class="text-warning font-weight-bold mb-1"><i class="fas fa-info-circle mr-1"></i> รายละเอียดขอบเขตสิทธิ์:</div>
                <ul class="mb-0 pl-3">
                    <li><b>👑 แอดมิน:</b> สิทธิ์ควบคุมระบบ 100% จัดการและปรับเปลี่ยนสิทธิ์ผู้อื่นได้</li>
                    <li><b>📁 ผู้ดูแลข้อมูล:</b> ดู/เพิ่ม/แก้ไข/ลบ ข้อมูลสมาชิกทุกคนในระบบ และดูสรุปสถิติ</li>
                    <li><b>🔍 คนเช็คสมาชิก:</b> ตรวจสอบและค้นหาข้อมูลสมาชิกทุกคนเพื่อดูดวง แต่ไม่สามารถแก้ไขหรือลบได้</li>
                    <li><b>👤 สมาชิกทั่วไป:</b> ดูและจัดการได้เฉพาะข้อมูลตนเอง</li>
                </ul>
            </div>
        </div>
    `;

    Swal.fire({
        title: '👑 ปรับระดับสิทธิ์สมาชิก',
        html: html,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check mr-1"></i> บันทึกสิทธิ์',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d4af37',
        cancelButtonColor: '#4a5568',
        background: '#121212',
        color: '#d4af37',
        customClass: { popup: 'border-gold shadow-lg' },
        preConfirm: () => {
            const selectEl = document.getElementById('swalRoleSelect');
            return selectEl ? selectEl.value : currentRoleKey;
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            if (typeof updateUserRole === 'function') {
                updateUserRole(username, result.value);
            }
        }
    });
}

// 🔐 ฟังก์ชันกรองข้อมูลให้เหลือแค่ของ User ที่ล็อกอิน (Admin / Data Manager / Member Checker เห็นทั้งหมด)
function filterHistoryByCurrentUser(allHistory) {
    if (!allHistory || !Array.isArray(allHistory)) {
        try {
            allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
        } catch (e) {
            allHistory = [];
        }
    }
    if (!Array.isArray(allHistory)) return [];

    const currentUser = typeof getCurrentUsername === 'function' ? getCurrentUsername() : null;

    if (!currentUser) {
        return allHistory; // ถ้ายังไม่ได้ล็อกอิน คืนประวัติในเครื่องทั้งหมด
    }

    const canViewAll = typeof canViewAllMembers === 'function' ? canViewAllMembers() : (typeof isAdmin === 'function' && isAdmin());

    if (canViewAll) {
        return allHistory;
    } else {
        return allHistory.filter(item => item && ((item.username || item.name) === currentUser));
    }
}

function loadHistory() {
    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    const history = filterHistoryByCurrentUser(allHistory);
    renderTable(history);
    
    // อัปเดตตัวนับและวิดเจ็ตสถิติ
    const countEl = document.getElementById('historyCount');
    if (countEl) countEl.innerText = `ทั้งหมด ${history.length} รายการ`;

    const totalEl = document.getElementById('statTotalMembers');
    if (totalEl) totalEl.innerText = history.length;

    let maleCount = 0;
    let femaleCount = 0;
    history.forEach(m => {
        if (m.gender === 'male' || m.gender === 'm' || m.gender === 'ชาย') maleCount++;
        else if (m.gender === 'female' || m.gender === 'f' || m.gender === 'หญิง') femaleCount++;
    });

    const maleEl = document.getElementById('statMaleMembers');
    if (maleEl) maleEl.innerText = maleCount;

    const femaleEl = document.getElementById('statFemaleMembers');
    if (femaleEl) femaleEl.innerText = femaleCount;
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
    if (typeof navigateTo === 'function') {
        navigateTo('elementManualPage');
    } else {
        document.querySelectorAll('.main-section').forEach(section => {
            section.classList.add('hidden');
            section.style.display = 'none';
        });

        const manualPage = document.getElementById('elementManualPage');
        if (manualPage) {
            manualPage.classList.remove('hidden');
            manualPage.style.display = 'block';
        } else {
            return;
        }
    }

    if (typeof renderElemHistory === 'function') {
        renderElemHistory();
    }

    // 2. ล้างข้อมูลเก่าในหน้าคู่มือ
    document.querySelectorAll('.user-label').forEach(el => el.innerText = '');
    document.querySelectorAll('[id^="manual-"]').forEach(box => {
        box.style.backgroundColor = 'white';
        box.style.border = '1px solid #dee2e6';
    });

    // 3. ตรวจสอบว่ามีการคำนวณดวงไว้หรือยัง
    if (typeof elementData !== 'undefined' && elementData && elementData.name) {
        const cleanE = (name) => name ? name.replace("ธาตุ", "").split(" ")[0].split("(")[0].trim() : "";

        try {
            const myElements = [
                { name: cleanE(elementData.name), label: 'วันเกิด' },
                { name: cleanE(typeof mElement !== 'undefined' && mElement ? mElement.name : ''), label: 'เดือนเกิด' },
                { name: cleanE(typeof zElement !== 'undefined' && zElement ? (zElement.element || zElement.name) : ''), label: 'ปีเกิด' }
            ];

            // 4. สั่งไฮไลต์
            myElements.forEach(item => {
                if (!item.name) return;
                const box = document.getElementById(`manual-${item.name}`);
                if (box) {
                    box.style.backgroundColor = '#fff9e6';
                    box.style.border = '2px solid #d4af37';
                    const label = box.querySelector('.user-label');
                    if (label) {
                        label.innerHTML += (label.innerHTML ? ' ' : '') +
                            `<span class="badge badge-warning text-dark px-2 py-1 mx-1" style="font-size:11px; font-weight:bold; border-radius:10px;">${item.label}</span>`;
                    }
                }
            });
        } catch (err) {
            console.log("รอการคำนวณดวงชะตาเพื่อแสดงธาตุประจำตัว", err);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteItem(docId) {
    // ✅ ตรวจสอบสิทธิ์ตามบทบาท (RBAC)
    const isChecker = typeof isMemberChecker === 'function' && isMemberChecker();
    if (isChecker) {
        Swal.fire("ไม่มีสิทธิ์", "บทบาทคนเช็คสมาชิก (Member Checker) ดูข้อมูลได้อย่างเดียว ไม่มีสิทธิ์ลบข้อมูล", "warning");
        return;
    }

    const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
    const targetItem = allHistory.find(item => item.id === docId);
    const currentUser = typeof getCurrentUsername === 'function' ? getCurrentUsername() : null;
    const canEditAll = typeof canEditAllMembers === 'function' ? canEditAllMembers() : (typeof isAdmin === 'function' && isAdmin());

    if (!targetItem) {
        Swal.fire("ข้อผิดพลาด", "ไม่พบข้อมูลที่ต้องการลบ", "error");
        return;
    }

    // User ปกติ: ลบเฉพาะของตนเอง (เปรียบเทียบ username)
    if (!canEditAll && (targetItem.username || targetItem.name) !== currentUser) {
        Swal.fire("ปฏิเสธ", "❌ คุณสามารถลบเฉพาะข้อมูลของตนเองเท่านั้น", "warning");
        return;
    }

    // Admin / Data Manager: ลบได้ทั้งหมด
    const confirmMsg = canEditAll ? `ลบข้อมูล ${targetItem.name || 'สมาชิก'}?` : "ยืนยันการลบข้อมูลนี้ถาวร?";

    if (!confirm(confirmMsg)) return;
    try {
        await deleteDoc(doc(db, "horo_history", docId));
        await syncDataFromFirestore();
        Swal.fire("สำเร็จ", "ลบข้อมูลเรียบร้อยแล้ว", "success");
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
 
    const profPage = document.getElementById('profilePage');
    if (profPage) {
        profPage.classList.add('active');
        profPage.style.display = 'block';
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
    let birthDateObj = safeParseThaiDate(data.birthdate);
    if (!birthDateObj || isNaN(birthDateObj.getTime())) {
        birthDateObj = new Date();
    }
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
    if (typeof ascCalcLagna === 'function' && typeof ZODIAC_DATA !== 'undefined' && data.birthdate) {
        try {
            let ceDateStr = "";
            if (data.birthdate.includes('/')) {
                const parts = data.birthdate.split('/');
                if (parts.length === 3) {
                    const d = parts[0].padStart(2, '0');
                    const m = parts[1].padStart(2, '0');
                    let y = parseInt(parts[2], 10);
                    if (y > 2400) y -= 543;
                    ceDateStr = `${y}-${m}-${d}`;
                }
            } else if (data.birthdate.includes('-')) {
                ceDateStr = data.birthdate.split('T')[0];
            }

            if (ceDateStr) {
                const ascObj = ascCalcLagna(ceDateStr, cleanTime, 13.75, 100.5167); // กทม.
                const rasiData = ZODIAC_DATA[ascObj.rasi];
                if (rasiData) {
                    ascText = `ลัคนาสถิตราศี${rasiData.name} ${rasiData.icon}`;
                    ascDesc = `<span style="font-weight:normal; font-size: 0.9em; color:#555;">${rasiData.desc} ดาวประจำตัว: ${rasiData.ruler}</span>`;
                }
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
        roleBadge = '';
    } else if (role === 'ทดลองใช้') {
        roleBadge = `<span class="badge text-dark ms-2" style="background-color: #e9ecef; font-size: 0.5em; vertical-align: middle; padding: 5px 8px; border-radius: 12px; border: 1px solid #ced4da;"><i class="fas fa-user"></i> ระดับทดลองใช้</span>`;
    } else {
        // ถ้าระดับตรงกับใน tiers.js (เช่น ธรรมดา, ทองแดง, เงิน, ทองคำ ฯลฯ)
        roleBadge = `<span class="badge text-dark ms-2" style="background-color: #f8c146; font-size: 0.5em; vertical-align: middle; padding: 5px 8px; border-radius: 12px; border: 1px solid #d4af37;"><i class="fas fa-star"></i> ระดับ${role}</span>`;
    }

    const dayPredFn = typeof getDayPrediction === 'function' ? getDayPrediction : (typeof window !== 'undefined' ? window.getDayPrediction : null);
    const monthPredFn = typeof getMonthPrediction === 'function' ? getMonthPrediction : (typeof window !== 'undefined' ? window.getMonthPrediction : null);
    const zodiacPredFn = typeof getZodiacPrediction === 'function' ? getZodiacPrediction : (typeof window !== 'undefined' ? window.getZodiacPrediction : null);

    // 8. แสดงผลแผ่นดวงชะตา (ธีม Modern Cute Pastel Claymorphism & Royal Gold)
    predictionArea.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3" style="border-bottom: 2px dashed #ece7f8; gap: 12px;">
            <div class="d-flex align-items-center" style="gap: 10px;">
                <span style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #ffffff; font-size: 0.9rem; padding: 6px 16px; border-radius: 50px; font-weight: 700; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fas fa-certificate text-warning"></i> แผ่นดวงชะตาฉบับเต็ม
                </span>
            </div>
            <div class="d-flex align-items-center flex-wrap" style="gap: 10px;">
                ${(typeof isAdmin === 'function' && isAdmin()) || role === 'admin' ? `
                <button class="btn-cute-action" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);" onclick="if(typeof openAdminTierSimulatorModal === 'function') openAdminTierSimulatorModal();" title="แผงจำลองระดับสมาชิกสำหรับทดสอบระบบ">
                    <i class="fas fa-flask"></i> 🧪 ทดสอบระดับสมาชิก
                </button>
                ` : ''}
                ${role !== 'admin' ? `
                <button class="btn-cute-action" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);" onclick="if(typeof navigateTo === 'function') navigateTo('package');">
                    <i class="fas fa-crown"></i> อัปเกรด VIP
                </button>
                ` : ''}
                <button class="btn-cute-action" onclick="saveHoroscopeImage()">
                    <i class="fas fa-camera"></i> บันทึกรูปภาพ
                </button>
            </div>
        </div>

        <div id="horoscopeCaptureArea" style="background: #ffffff; border-radius: 24px; padding: 24px; border: 2px solid #ffffff; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.06);">
            
            <!-- Header Section (Clean cute card) -->
            <div id="profileSection_header" style="position:relative; margin-bottom: 20px;">
                <div class="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-4" style="background: linear-gradient(135deg, #fbf7ff 0%, #fef4f8 100%); border-radius: 20px; border: 1.5px solid #f1e9fb;">
                    <div class="d-flex align-items-center" style="gap: 16px;">
                        <div style="width: 60px; height: 60px; border-radius: 18px; background: linear-gradient(135deg, #fbcfe8, #e9d5ff); display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 6px 16px rgba(244, 114, 182, 0.25); border: 2px solid #ffffff;">
                            🔮
                        </div>
                        <div>
                            <h2 style="color: #4c1d95; font-size: 1.35rem; font-weight: 800; margin: 0;">
                                แผ่นดวงชะตาส่วนบุคคล
                            </h2>
                            <h3 style="color: #1e1b4b; font-weight: 800; font-size: 1.25rem; margin: 2px 0 0 0;">
                                คุณ ${safeName} ${safeLastName} ${roleBadge}
                            </h3>
                        </div>
                    </div>
                    
                    <div class="d-flex flex-wrap align-items-center" style="gap: 8px; margin-top: 8px;">
                        <span style="background: #ede9fe; color: #6d28d9; padding: 6px 14px; font-size: 0.82rem; border-radius: 50px; font-weight: 700;">
                            <i class="fas fa-id-badge text-purple"></i> ID: ${data.memberId || 'สมาชิกใหม่'}
                        </span>
                        <span style="background: #fef3c7; color: #b45309; padding: 6px 14px; font-size: 0.82rem; border-radius: 50px; font-weight: 700;">
                            <i class="fas fa-map-marker-alt text-danger"></i> ${data.province || "กรุงเทพมหานคร"}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Calendar & Birth Timing Section (Modern Clean Card) -->
            <div id="profileSection_calendar" class="mb-4" style="position:relative;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span style="font-weight: 800; font-size: 0.95rem; color: #4c1d95; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="far fa-calendar-alt" style="color: #8b5cf6;"></i> ข้อมูลปฏิทินและเวลาเกิด
                    </span>
                    <button class="btn-cute-action" style="padding: 3px 12px; font-size: 0.72rem;" onclick="saveSection('profileSection_calendar','ข้อมูลปฏิทิน')">
                        <i class="fas fa-camera"></i> แคปส่วนนี้
                    </button>
                </div>
                
                <div style="background: #faf8ff; border-radius: 18px; padding: 18px; border: 1.5px solid #ece7f8;">
                    <div class="row" style="row-gap: 14px;">
                        <div class="col-md-6">
                            <div class="d-flex align-items-start" style="gap: 12px;">
                                <i class="fas fa-sun text-warning fa-lg mt-1"></i>
                                <div>
                                    <strong style="color: #0f172a; font-size: 0.95rem;">สุริยคติ:</strong> 
                                    <span style="color: #1e293b; font-weight: 700; font-size: 0.95rem;">${displayDay} ที่ ${birthDateObj.getDate()} ${monthNames[monthIdx]} พ.ศ. ${year + 543}</span>
                                    ${astNote}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-start" style="gap: 12px;">
                                <i class="fas fa-moon fa-lg mt-1" style="color: #6b21a8;"></i>
                                <div>
                                    <strong style="color: #0f172a; font-size: 0.95rem;">จันทรคติไทย:</strong> 
                                    <span style="color: #581c87; font-weight: 700; font-size: 0.95rem;">${lunarStr || "ไม่สามารถแปลงได้"}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 mt-2 pt-3 border-top" style="border-color: #e2e8f0 !important;">
                            <div class="d-flex flex-wrap align-items-center" style="gap: 24px;">
                                <div>
                                    <i class="far fa-clock text-primary mr-1"></i>
                                    <strong style="color: #0f172a;">เวลาเกิด:</strong> <span style="color: #0f172a; font-weight: 700;">${cleanTime} น.</span>
                                </div>
                                <div>
                                    <i class="fas fa-yin-yang text-primary mr-1"></i>
                                    <strong style="color: #0f172a;">ยามเกิด:</strong> <span style="color: #0f172a; font-weight: 700;">${yam || "ไม่ระบุ"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elements Section -->
            <div id="profileSection_elements" class="mb-4" style="position:relative;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="section-title-badge">
                        <i class="fas fa-atom" style="color: #059669;"></i> องค์ประกอบธาตุประจำตัว
                    </div>
                    <button class="snap-btn" onclick="saveSection('profileSection_elements','องค์ประกอบธาตุประจำตัว')" title="บันทึกภาพส่วนนี้">
                        <i class="fas fa-camera"></i> แคปส่วนนี้
                    </button>
                </div>

                <div class="row" style="row-gap: 12px;">
                    <div class="col-md-4">
                        <div class="element-pill-box h-100" style="background:#ffffff; border-left: 5px solid ${elementData.color}; border-top: 1.5px solid #e2e8f0; border-right: 1.5px solid #e2e8f0; border-bottom: 1.5px solid #e2e8f0;">
                            <strong style="color:#0f172a; font-size: 0.95rem;">
                                🧬 ธาตุประจำวันเกิด: <span style="color:${elementData.color}; font-weight: 800;">${elementData.name} ${elementData.level || ""}</span>
                            </strong>
                            <div class="mt-1" style="font-size: 0.88rem; color:#334155; line-height: 1.5;">${elementData.desc}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="element-pill-box h-100" style="background:#ffffff; border-left: 5px solid ${mElement.color}; border-top: 1.5px solid #e2e8f0; border-right: 1.5px solid #e2e8f0; border-bottom: 1.5px solid #e2e8f0;">
                            <strong style="color:#0f172a; font-size: 0.95rem;">
                                📅 ธาตุเดือนเกิด: <span style="color:${mElement.color}; font-weight: 800;">${mElement.name}</span> (กำลัง: ${mElement.strength})
                            </strong>
                            <div class="mt-1" style="font-size: 0.88rem; color:#334155; line-height: 1.5;">${mElement.desc}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="element-pill-box h-100" style="background:#ffffff; border-left: 5px solid ${zElement.color}; border-top: 1.5px solid #e2e8f0; border-right: 1.5px solid #e2e8f0; border-bottom: 1.5px solid #e2e8f0;">
                            <strong style="color:#0f172a; font-size: 0.95rem;">
                                🐉 ธาตุปีนักษัตร (${zElement.name}): <span style="color:${zElement.color}; font-weight: 800;">${zElement.element}</span>
                            </strong>
                            <div class="mt-1" style="font-size: 0.88rem; color:#334155; line-height: 1.5;">${zElement.desc}</div>
                            <div class="mt-1" style="font-size: 0.84rem; color:#0f172a;"><b>🚀 งานที่เหมาะ:</b> ${zElement.job || "ไม่ระบุ"}</div>
                        </div>
                    </div>
                </div>

                <div class="mt-3 p-3 rounded" style="background: #fffdf5; border: 1.5px dashed #d97706; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                    <div class="d-flex align-items-center mb-2" style="gap: 8px;">
                        <i class="fas fa-balance-scale text-warning"></i>
                        <span style="color:#78350f; font-weight:800; font-size: 0.98rem;">วิเคราะห์สมพงษ์และปฏิสัมพันธ์ของธาตุ</span>
                    </div>
                    <div class="row" style="row-gap: 8px; font-size: 0.9rem;">
                        <div class="col-md-6">
                            <span style="color:#475569; font-weight: 600;">วันเกิด (${elementData.name}) + เดือนเกิด (${mElement.name}):</span>
                            <div class="font-weight-bold" style="color: #0f172a;">${relDayMonth}</div>
                        </div>
                        <div class="col-md-6">
                            <span style="color:#475569; font-weight: 600;">วันเกิด (${elementData.name}) + ปีนักษัตร (${zElement.element}):</span>
                            <div class="font-weight-bold" style="color: #0f172a;">${relDayYear}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Stamp -->
            <div class="text-center mt-3 pt-3" style="border-top: 1px dashed #e2d9f3;">
                <p class="mb-0 text-muted" style="font-size: 11px;">
                    ✨ คำนวณตามคัมภีร์สุริยยาตร์ โหราศาสตร์ไทยนิรายันวิธี และยึดหลักตัดรอบวันเวลา 06:00 น. • สยามโหรามงคล
                </p>
            </div>
        </div>
        
        <div class="text-center mt-3 mb-2">
            ${typeof isAdmin === 'function' && isAdmin() ?
                `<p class="small text-success mb-2"><i class="fas fa-crown mr-2"></i>👑 Admin: จัดการข้อมูลจำนวนไม่จำกัด</p>` :
                `<p class="small text-muted mb-2">💾 ระบบเก็บข้อมูลแบบ 1 คน 1 รายการ</p>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteSingleProfile()" style="border-radius: 50px; padding: 4px 14px; font-size:0.75rem;">
                    <i class="fas fa-trash mr-1"></i>ลบข้อมูลสมาชิก
                </button>`
            }
        </div>
    `;

    // Trigger cute dashboard UI update if on profile page
    if (typeof window.updateCuteProfileUI === 'function') {
        window.updateCuteProfileUI(data);
    }

    // 🔒 อัปเดตสถานะการล็อกและ badge บนปุ่ม Sidebar ซ้ายของหน้าโปรไฟล์
    if (typeof window.updateProfileSidebarTierAccess === 'function') {
        window.updateProfileSidebarTierAccess();
    }
}

// 🔒 ฟังก์ชันตรวจสอบและอัปเดตสถานะปุ่ม Sidebar ในหน้าโปรไฟล์ตามแพ็กเกจของผู้ใช้
window.updateProfileSidebarTierAccess = function() {
    const sidebarConfigs = [
        { id: 'profBtnLifeGraph', menuId: 'lifeGraphPage', title: '✨ วิเคราะห์กราฟชีวิต' },
        { id: 'profBtnNameAnalysis', menuId: 'nameAnalysisPage', title: '🔮 วิเคราะห์ชื่อ-นามสกุลมงคล' },
        { id: 'profBtnMahataksa', menuId: 'mahathaksaPage', title: '🕉️ วิเคราะห์มหาทักษาพยากรณ์' }
    ];

    sidebarConfigs.forEach(item => {
        const btn = document.getElementById(item.id);
        if (!btn) return;

        const hasAccess = (typeof window.hasPackagePermission === 'function') ? window.hasPackagePermission(item.menuId) : true;
        if (!hasAccess) {
            const reqInfo = (typeof window.getRequiredTierInfo === 'function') ? window.getRequiredTierInfo(item.menuId) : { packageName: 'พรีเมียม' };
            btn.innerHTML = `${item.title} <span class="badge badge-warning ml-1" style="font-size: 0.72rem; background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4);"><i class="fas fa-lock mr-1"></i>${reqInfo.packageName}</span>`;
            btn.style.opacity = '0.85';
            btn.title = `ฟีเจอร์นี้สงวนสิทธิ์สำหรับสมาชิกแพ็กเกจระดับ ${reqInfo.packageName} ขึ้นไป (คลิกเพื่ออัปเกรด)`;
        } else {
            btn.innerHTML = item.title;
            btn.style.opacity = '1';
            btn.title = '';
        }
    });
};

function initProfileOnPageLoad() {
    const lastData = loadLastProfileFromStorage();
    
    if (lastData && lastData.birthdate) {
        // ✅ ส่งเป็น object ที่มี memberId อยู่
        showProfilePage(lastData);
        console.log("✅ โหลดโปรไฟล์: " + lastData.name);
    }
}

async function ensureHtml2CanvasLoaded() {
    if (typeof html2canvas !== 'undefined') return true;
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
    });
}

async function saveHoroscopeImage() {
    const captureArea = document.getElementById('horoscopeCaptureArea');
    if (!captureArea) return;

    try {
        Swal.fire({
            title: 'กำลังสร้างรูปภาพ...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        await ensureHtml2CanvasLoaded();
        await document.fonts.ready;

        // Clone capture area into a fixed-width offscreen wrapper for a polished image
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:720px;z-index:-1;';
        const clone = captureArea.cloneNode(true);

        // Remove all buttons from clone
        clone.querySelectorAll('button').forEach(b => b.remove());

        // Apply enhanced styling for image output
        clone.style.cssText = `
            width: 720px;
            max-width: 720px;
            padding: 32px 28px;
            background: linear-gradient(135deg, #fdfaf0 0%, #f4effa 100%);
            border: 4px solid #d4af37;
            outline: 2px solid #9370db;
            outline-offset: -8px;
            border-radius: 12px;
            font-family: 'Sarabun', sans-serif;
            color: #333;
        `;

        // Boost font sizes & make text vivid in clone
        const enhanceStyle = document.createElement('style');
        enhanceStyle.textContent = `
            .capture-clone * { box-sizing: border-box; }
            .capture-clone h2 { font-size: 28px !important; color: #6a0dad !important; }
            .capture-clone h4 { font-size: 22px !important; color: #333 !important; }
            .capture-clone h5 { font-size: 20px !important; color: #6a0dad !important; }
            .capture-clone h6 { font-size: 17px !important; }
            .capture-clone strong { font-size: 15px !important; }
            .capture-clone div, .capture-clone span, .capture-clone p, .capture-clone li {
                font-size: 14px !important;
                line-height: 1.6 !important;
                color: #333 !important;
            }
            .capture-clone span[style*="b8860b"] { color: #b8860b !important; font-size: 20px !important; }
            .capture-clone span[style*="6a0dad"] { color: #6a0dad !important; font-size: 20px !important; }
            .capture-clone strong[style*="color"] { font-size: 15px !important; }
            .capture-clone .badge { font-size: 13px !important; }
            .capture-clone .text-muted { color: #666 !important; font-size: 13px !important; }
            .capture-clone .p-2, .capture-clone .p-3 { padding: 12px !important; }
            .capture-clone .mb-2 { margin-bottom: 10px !important; }
            .capture-clone .mb-3 { margin-bottom: 14px !important; }
            .capture-clone .row { display: flex !important; flex-wrap: wrap !important; }
            .capture-clone .col-md-6 { flex: 0 0 50% !important; max-width: 50% !important; }
            .capture-clone hr { border-top: 1px dashed #d4af37 !important; margin: 12px 0 !important; }
            .capture-clone .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
        `;
        document.head.appendChild(enhanceStyle);

        clone.classList.add('capture-clone');
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        // Wait for layout to settle
        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#fdfaf0',
            width: 720
        });

        // Cleanup
        document.body.removeChild(wrapper);
        document.head.removeChild(enhanceStyle);

        // Get member name for filename
        const nameEl = clone.querySelector('h4');
        const profName = nameEl ? nameEl.innerText.replace(/[\n\r]/g, '').trim() : 'ดวงชะตา';
        const link = document.createElement('a');
        link.download = `แผ่นดวงชะตา_${profName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        Swal.close();
    } catch (err) {
        console.error("Error capturing image:", err);
        // Cleanup on error
        document.querySelectorAll('.capture-clone').forEach(e => e.parentElement?.remove());
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
}

window.saveHoroscopeImage = saveHoroscopeImage;

async function saveSection(sectionId, title) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    try {
        Swal.fire({
            title: `กำลังสร้างรูปภาพ ${title}...`,
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        await ensureHtml2CanvasLoaded();
        await document.fonts.ready;

        // Clone section into a fixed-width offscreen wrapper
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:700px;z-index:-1;';
        const clone = el.cloneNode(true);

        // Remove buttons
        clone.querySelectorAll('button').forEach(b => b.remove());

        // Style the clone for image output
        clone.style.cssText = `
            width: 700px;
            max-width: 700px;
            padding: 24px;
            background: linear-gradient(135deg, #fdfaf0 0%, #f4effa 100%);
            border: 3px solid #d4af37;
            border-radius: 10px;
            font-family: 'Sarabun', sans-serif;
            color: #333;
        `;

        // Add title header
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'text-align:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px dashed #d4af37;';
        titleDiv.innerHTML = `<h3 style="color:#6a0dad;font-weight:bold;margin:0;">🔮 ${title}</h3>
            <small style="color:#888;">สยามโหรามงคล</small>`;
        clone.insertBefore(titleDiv, clone.firstChild);

        // Add footer
        const footerDiv = document.createElement('div');
        footerDiv.style.cssText = 'text-align:center;margin-top:16px;padding-top:10px;border-top:1px solid #d4af37;';
        footerDiv.innerHTML = `<span style="color:#d4af37;font-weight:bold;font-size:14px;">✨ สยามโหรามงคล 🔮</span>`;
        clone.appendChild(footerDiv);

        // Enhance styles
        const enhanceStyle = document.createElement('style');
        enhanceStyle.textContent = `
            .capture-section-clone * { box-sizing: border-box; }
            .capture-section-clone strong { font-size: 15px !important; }
            .capture-section-clone div, .capture-section-clone span, .capture-section-clone p, .capture-section-clone li {
                font-size: 14px !important; line-height: 1.6 !important; color: #333 !important;
            }
            .capture-section-clone span[style*="b8860b"] { color: #b8860b !important; font-size: 18px !important; }
            .capture-section-clone span[style*="6a0dad"] { color: #6a0dad !important; font-size: 18px !important; }
            .capture-section-clone h5, .capture-section-clone h6 { font-size: 18px !important; }
            .capture-section-clone .row { display: flex !important; flex-wrap: wrap !important; }
            .capture-section-clone .col-md-6 { flex: 0 0 50% !important; max-width: 50% !important; }
        `;
        document.head.appendChild(enhanceStyle);

        clone.classList.add('capture-section-clone');
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#fdfaf0',
            width: 700
        });

        // Cleanup
        document.body.removeChild(wrapper);
        document.head.removeChild(enhanceStyle);

        const link = document.createElement('a');
        link.download = `${title}_สยามโหรามงคล.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        Swal.close();
    } catch (e) {
        console.error('saveSection error:', e);
        document.querySelectorAll('.capture-section-clone').forEach(el => el.parentElement?.remove());
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้: ' + e.message, 'error');
    }
}

window.saveSection = saveSection;


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

        if (!profile && typeof window.loadAllAvailableProfiles === 'function') {
            const allProfiles = window.loadAllAvailableProfiles();
            profile = allProfiles.find(item => String(item.memberId) === String(identifier) || String(item.id) === String(identifier) || String(item.birthdate) === String(identifier) || item.name === identifier);
        }

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
            const dateObj = safeParseThaiDate(birthdate);
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
            const dateObj = safeParseThaiDate(birthdate);

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

    const canViewAll = typeof canViewAllMembers === 'function' ? canViewAllMembers() : (typeof isAdmin === 'function' && isAdmin());

    // ⚠️ ตรวจสอบ: ถ้า User ทั่วไปพยายามเข้าถึงข้อมูลของคนอื่น
    if (!member && !canViewAll) {
        console.warn('❌ ไม่สามารถเข้าถึงข้อมูลนี้ได้');
        Swal.fire('ปฏิเสธ', 'คุณสามารถเข้าถึงเฉพาะข้อมูลของตนเองเท่านั้น', 'warning');
        return;
    }

    // ถ้าผู้มีสิทธิ์เปิดข้อมูล user อื่น ต้องดึงจากทั้งหมด
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
    if (isNamePage && (member || finalMember)) {
        const activeMember = finalMember || member;
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const birthDaySelect = document.getElementById('birthDaynumSelect');
        const nameMemberSelect = document.getElementById('nameMemberSelect') || document.getElementById('memberSelect');

        if (nameMemberSelect && memberKey) {
            nameMemberSelect.value = memberKey;
        }

        if (firstNameInput && activeMember.name) {
            if (activeMember.lastName) {
                firstNameInput.value = (activeMember.name || '').trim();
                if (lastNameInput) lastNameInput.value = (activeMember.lastName || '').trim();
            } else {
                const nameParts = activeMember.name.trim().split(/\s+/);
                firstNameInput.value = nameParts[0] || '';
                if (lastNameInput) lastNameInput.value = nameParts.slice(1).join(' ') || '';
            }
        }

        if (birthDaySelect && formattedDate) {
            let dayOfWeek = typeof window.getAstrologicalDayOfWeek === 'function'
                ? window.getAstrologicalDayOfWeek(formattedDate, activeMember.birthtime || null)
                : new Date(formattedDate).getDay();

            // ตรวจสอบวันพุธกลางคืน (ถ้าเกิดวันพุธ และเวลา 18:00 - 05:59 น.)
            if (Number(dayOfWeek) === 3 && activeMember.birthtime) {
                const hour = parseInt(activeMember.birthtime.split(':')[0], 10);
                if (hour >= 18 || hour < 6) {
                    dayOfWeek = 7;
                }
            }
            birthDaySelect.value = String(dayOfWeek);
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

    // ---- ส่วนของหน้า ฮวงจุ้ยตามหลักแท้ (fengshui.js) ----
    const isFengShuiPage = isPageVisible('fengShuiPage');
    if (isFengShuiPage) {
        const fengshuiBirthDateEl = document.getElementById('fengshuiBirthday');
        if (fengshuiBirthDateEl && formattedDate) {
            fengshuiBirthDateEl.value = formattedDate;
        }
    }

    // ---- ส่วนของหน้า พิรุณศาสตร์ (climate.js) ----
    const isClimateSection = isPageVisible('climate-section');
    if (isClimateSection) {
        const pirunBirthDateEl = document.getElementById('pirunBirthDate');
        if (pirunBirthDateEl && formattedDate) {
            pirunBirthDateEl.value = formattedDate;
            setTimeout(() => {
                if (typeof calculatePirun === 'function') calculatePirun();
            }, 100);
        }
    }

    // ---- ส่วนของหน้าทักษาพยากรณ์ (thaksanine.js) ----    
    const isshowthaksaninepage = isPageVisible('showthaksaninepage') || isPageVisible('thaksaninesection');

    if (isshowthaksaninepage) {
        const weekdaySelect = document.getElementById('weekday');
        const ageInput = document.getElementById('age');
        const monthInput = document.getElementById('month');
        const weekInput = document.getElementById('week');

        if (weekdaySelect) {
            const birthDay = window.getAstrologicalDayOfWeek(formattedDate, finalMember ? finalMember.birthtime : null);
            weekdaySelect.value = birthDay;
        }

        if (ageInput) {
            ageInput.value = window.calculateRunningAge(formattedDate);
        }

        // อัปเดตเดือนจรและสัปดาห์จรปัจจุบันแบบเรียลไทม์
        const now = new Date();
        if (monthInput) monthInput.value = now.getMonth() + 1;
        if (weekInput) {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const pastDaysOfYear = (now - startOfYear) / 86400000;
            weekInput.value = Math.min(52, Math.max(1, Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)));
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

if (istaksapage && finalMember) {
    const genderSelect = document.getElementById('taksagender');
    const ageInput = document.getElementById('userAge');
    const birthdateSelect = document.getElementById('birthDaySelect');

    // 1. จัดการเพศ ('male' หรือ 'female')
    if (genderSelect && finalMember.gender) {
        genderSelect.value = (finalMember.gender === 'female' || finalMember.gender === 'หญิง') ? 'female' : 'male';
    }

    // 2. คำนวณอายุย่าง (จาก birthDate)
    if (ageInput && formattedDate) {
        ageInput.value = window.calculateRunningAge(formattedDate);
    }

    // 3. จัดการเรื่องวันเกิด (0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์, 7=พุธกลางคืน)
    if (birthdateSelect && formattedDate) {
        const birthDay = window.getAstrologicalDayOfWeek(formattedDate, finalMember.birthtime || null);
        birthdateSelect.value = birthDay;        
    }

    // 4. สั่งคำนวณอัตโนมัติ
    setTimeout(() => {
        if (typeof calculateAndShowTaksa === 'function') {
            calculateAndShowTaksa();
        }
    }, 150);
}


    const isbirthfortune = isPageVisible('birthfortune');

    if (isbirthfortune) {
        const birthfortune = document.getElementById('fortuneDay');
        const monthfortune = document.getElementById('fortuneMonth');
        const yearfortune = document.getElementById('fortuneYear');
        const befortune = document.getElementById('fortuneBE');
        const activeMember = finalMember || member;

        if (activeMember && activeMember.birthdate) {
            // คำนวณวันในสัปดาห์ (1=อาทิตย์, 2=จันทร์, ..., 5=พฤหัสบดี, 6=ศุกร์, 7=เสาร์)
            if (birthfortune && formattedDate) {
                const dateObj = new Date(formattedDate + 'T00:00:00');
                const jsDay = dateObj.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, 6=Sat
                const astroDay = jsDay + 1; // 1=อาทิตย์ ... 5=พฤหัสบดี ... 7=เสาร์
                birthfortune.value = String(astroDay);
            }

            // เดือนเกิด (1-12)
            if (monthfortune) {
                if (activeMember.birthMonththai) {
                    monthfortune.value = activeMember.birthMonththai;
                } else if (formattedDate) {
                    const m = parseInt(formattedDate.split('-')[1], 10);
                    monthfortune.value = m;
                }
            }

            // ปีนักษัตร (1=ชวด, ..., 12=กุน)
            if (yearfortune && activeMember.zodiac) {
                const thaiyear1Based = {
                    'ชวด': 1, 'ฉลู': 2, 'ขาล': 3, 'เถาะ': 4,
                    'มะโรง': 5, 'มะเส็ง': 6, 'มะเมีย': 7, 'มะแม': 8,
                    'วอก': 9, 'ระกา': 10, 'จอ': 11, 'กุน': 12
                };
                const zodiacIdx = thaiyear1Based[activeMember.zodiac];
                yearfortune.value = zodiacIdx !== undefined ? String(zodiacIdx) : "1";
            }

            // ปี พ.ศ.
            if (befortune) {
                const dObj = new Date(activeMember.birthdate);
                let rawYear = dObj.getFullYear();
                if (rawYear < 2400) rawYear += 543;
                befortune.value = rawYear;
            }

            setTimeout(() => {
                if (typeof calculateBirthFortune === 'function') calculateBirthFortune();
            }, 100);
        }
    }

    const promchartsection = isPageVisible('promchartsection');

    if (promchartsection) {
        const gender = document.getElementById('userGender');
        const age = document.getElementById('userAgeprom');
        const activeMember = finalMember || member;

        if (gender && activeMember && activeMember.gender) {
            gender.value = activeMember.gender;
        }

        if (age && activeMember && (activeMember.birthdate || formattedDate)) {
            let birthYear = null;
            if (formattedDate) {
                const parts = formattedDate.split('-');
                if (parts.length >= 1) birthYear = parseInt(parts[0], 10);
            }
            if (!birthYear || isNaN(birthYear)) {
                const d = safeParseThaiDate(activeMember.birthdate);
                if (d && !isNaN(d.getFullYear())) {
                    birthYear = d.getFullYear();
                    if (birthYear > 2400) birthYear -= 543;
                }
            }
            if (birthYear && !isNaN(birthYear)) {
                const currentYear = new Date().getFullYear();
                age.value = (currentYear - birthYear) + 1;
            }
        }

        setTimeout(() => {
            if (typeof calculatePromchart === 'function') calculatePromchart();
        }, 150);
    }

const isBusinessFortune = isPageVisible('businessFortune');

if (isBusinessFortune && finalMember) {
    const birthdayInput = document.getElementById('businessBirthday');
    const birthTimeInput = document.getElementById('businessBirthTime');
    const zodiacSelect = document.getElementById('businessZodiac');
    const yearInput = document.getElementById('businessYear');

    if (birthdayInput) {
        birthdayInput.value = formattedDate;
    }

    if (birthTimeInput && finalMember.birthtime) {
        birthTimeInput.value = finalMember.birthtime;
    }

    // เติมปีนักษัตรอัตโนมัติ
    if (zodiacSelect && finalMember.zodiac) {
        const thaiToEng = {
            'ชวด': 'rat', 'ฉลู': 'ox', 'ขาล': 'tiger', 'เถาะ': 'rabbit',
            'มะโรง': 'dragon', 'มะเส็ง': 'snake', 'มะเมีย': 'horse', 'มะแม': 'goat',
            'วอก': 'monkey', 'ระกา': 'rooster', 'จอ': 'dog', 'กุน': 'pig'
        };
        const engZodiac = thaiToEng[finalMember.zodiac];
        if (engZodiac) zodiacSelect.value = engZodiac;
    }

    // เติมปี ค.ศ. จากวันเกิด
    if (yearInput && formattedDate) {
        const birthYear = new Date(formattedDate).getFullYear();
        if (birthYear) yearInput.value = new Date().getFullYear();
    }

    setTimeout(() => {
        if (typeof displayBusinessFortune === 'function') displayBusinessFortune();
    }, 150);
}

const isZodiacFortune = isPageVisible('zodiacFortunePage');

if (isZodiacFortune && formattedDate) {
    const zodiacSelect = document.getElementById('zodiacSelect');
    
    if (zodiacSelect) {
        const d = new Date(formattedDate);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        let westernZodiac = null;
        
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) westernZodiac = 1; // Aries
        else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) westernZodiac = 2; // Taurus
        else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) westernZodiac = 3; // Gemini
        else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) westernZodiac = 4; // Cancer
        else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) westernZodiac = 5; // Leo
        else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) westernZodiac = 6; // Virgo
        else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) westernZodiac = 7; // Libra
        else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) westernZodiac = 8; // Scorpio
        else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) westernZodiac = 9; // Sagittarius
        else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) westernZodiac = 10; // Capricorn
        else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) westernZodiac = 11; // Aquarius
        else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) westernZodiac = 12; // Pisces
        
        if (westernZodiac) {
            zodiacSelect.value = westernZodiac;
        }
    }
    
    setTimeout(() => {
        if (typeof handleZodiacChange === 'function') handleZodiacChange();
    }, 150);
}

const isYearClashPage = isPageVisible('yearClashPage');

if (isYearClashPage && formattedDate) {
    const ycBirthYearInput = document.getElementById('ycBirthYear');
    
    if (ycBirthYearInput) {
        const d = new Date(formattedDate);
        // ใช้ getThaiZodiacYear ถ้ามี เพื่อปรับปีสำหรับคนที่เกิดก่อนสงกรานต์
        const birthYearCE = typeof getThaiZodiacYear === 'function' ? getThaiZodiacYear(d) : d.getFullYear();
        
        if (birthYearCE) {
            ycBirthYearInput.value = birthYearCE + 543;
        }
    }
    
    setTimeout(() => {
        if (typeof renderYearClash === 'function') renderYearClash();
    }, 150);
}

const isThaiAstrologyPage = isPageVisible('thaiAstrology');

if (isThaiAstrologyPage && formattedDate) {
    const astrologyBirthDateInput = document.getElementById('astrologyBirthDate');
    const astrologyBirthTimeInput = document.getElementById('astrologyBirthTime');

    if (astrologyBirthDateInput) {
        astrologyBirthDateInput.value = formattedDate;
    }
    if (astrologyBirthTimeInput && finalMember && finalMember.birthtime) {
        astrologyBirthTimeInput.value = finalMember.birthtime;
    }

    setTimeout(() => {
        if (typeof calculateThaiAstrology === 'function') calculateThaiAstrology();
    }, 150);
}

const isChantPage = isPageVisible('chantPage');
if (isChantPage && formattedDate) {
    const chantBirthDateInput = document.getElementById('chantBirthDate');
    if (chantBirthDateInput) {
        chantBirthDateInput.value = formattedDate;
    }
    setTimeout(() => {
        if (typeof calculateChants === 'function') calculateChants();
    }, 150);
}

// ---- ส่วนของหน้าลักษณะนิสัยและพื้นดวงตามวันเกิด (daily-horoscope) ----
const isDailyHoroscopePage = isPageVisible('daily-horoscope') || isPageVisible('showdaybirthpage');
if (isDailyHoroscopePage && formattedDate) {
    // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Wed Night
    let dayNum = window.getAstrologicalDayOfWeek(formattedDate, finalMember ? finalMember.birthtime : null);
    // Map to button index: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat (ถ้าพุธกลางคืน map เป็น 4=พุธ)
    let btnDayId = (dayNum === 0) ? 1 : (dayNum === 7 ? 4 : dayNum + 1);

    setTimeout(() => {
        const btn = document.getElementById(`btn-day-${btnDayId}`);
        if (btn) {
            btn.click();
        }
    }, 100);
}

const isLifeExtensionPage = isPageVisible('lifeExtensionPage') || isPageVisible('showlifeextensionpage');
if (isLifeExtensionPage && formattedDate) {
    const d = new Date(formattedDate);
    if (!isNaN(d.getTime())) {
        const dayOfWeek = d.getDay(); // 0=Sun
        // Map: 0(Sun)->1, 1(Mon)->2, 2(Tue)->3, 3(Wed)->4, 4(Thu)->5, 5(Fri)->6, 6(Sat)->7
        const dayVal = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
        const bDaySelect = document.getElementById('birthDay');
        if (bDaySelect) bDaySelect.value = dayVal.toString();

        let mVal = 1;
        if (typeof getThaiLunar === 'function') {
            const lunar = getThaiLunar(d);
            if (lunar && lunar.month) {
                let mNum = parseInt(lunar.month);
                if (!isNaN(mNum)) mVal = mNum;
            }
        } else {
            mVal = d.getMonth() + 1;
        }
        const bMonthSelect = document.getElementById('birthMonth');
        if (bMonthSelect) bMonthSelect.value = mVal.toString();
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

    const activeSevenMember = finalMember || member;
    if (age && activeSevenMember && (activeSevenMember.birthdate || formattedDate)) {
        let birthYear = null;
        if (formattedDate) {
            const parts = formattedDate.split('-');
            if (parts.length >= 1) birthYear = parseInt(parts[0], 10);
        }
        if (!birthYear || isNaN(birthYear)) {
            const d = safeParseThaiDate(activeSevenMember.birthdate);
            if (d && !isNaN(d.getFullYear())) {
                birthYear = d.getFullYear();
                if (birthYear > 2400) birthYear -= 543;
            }
        }
        if (birthYear && !isNaN(birthYear)) {
            const currentYear = new Date().getFullYear();
            age.value = (currentYear - birthYear) + 1;
        }
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
    const activeHoroSevenMember = finalMember || member;

    if (day && activeHoroSevenMember && activeHoroSevenMember.birthdate) {
        const birthDay = new Date(formattedDate).getDay();
        day.value = birthDay;        
    }

    if (month && activeHoroSevenMember && activeHoroSevenMember.birthMonththai) {
        month.value = activeHoroSevenMember.birthMonththai;
    }

    if (year && activeHoroSevenMember && activeHoroSevenMember.zodiac) {
        const zodiacIdx = thaiyearname[activeHoroSevenMember.zodiac];
        year.value = zodiacIdx !== undefined ? zodiacIdx : "ไม่ระบุ";
    }

    if (time && activeHoroSevenMember && activeHoroSevenMember.birthtime) {
        time.value = activeHoroSevenMember.birthtime;
    }

    if (age && activeHoroSevenMember && (activeHoroSevenMember.birthdate || formattedDate)) {
        let birthYear = null;
        if (formattedDate) {
            const parts = formattedDate.split('-');
            if (parts.length >= 1) birthYear = parseInt(parts[0], 10);
        }
        if (!birthYear || isNaN(birthYear)) {
            const d = safeParseThaiDate(activeHoroSevenMember.birthdate);
            if (d && !isNaN(d.getFullYear())) {
                birthYear = d.getFullYear();
                if (birthYear > 2400) birthYear -= 543;
            }
        }
        if (birthYear && !isNaN(birthYear)) {
            const currentYear = new Date().getFullYear();
            age.value = (currentYear - birthYear) + 1;
        }
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

};

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

        // Compress image before saving
        const slipBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 600;
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(slipFile);
        });

        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const paymentsRef = collection(window.firebaseDb, "payments");

        await addDoc(paymentsRef, {
            username: session.username,
            email: session.email || '',
            package: pkgName,
            period: period,
            price: price,
            slipImage: slipBase64,
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
        console.error("Payment error:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
};