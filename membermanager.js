"use strict";
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

let currentUser = localStorage.getItem('thaiHoroUserName') || null;

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

        const payload = {
            memberId: userData.memberId,
            name: userData.name || currentUser || "ผู้มาเยือน",
            lastName: lastName, // เพิ่มนามสกุลเข้าไปใน Object
            birthdate: userData.birthdate,
            birthMonththai: userData.birthMonththai,
            birthtime: cleanTime,
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
function updateAllMemberSelectors(history) {
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

// --- ส่วนที่เพิ่มใหม่: กระจายรายชื่อไปทุกหน้า ---

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

// 3. แก้ไขจุดเริ่มต้นทำงาน (เรียก Sync เมื่อเปิดหน้าเว็บ)
window.addEventListener('load', async () => {

    await syncDataFromFirestore();

    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }

    if (typeof fillUserData === 'function') {
        fillUserData();
    }

});

// --- เพิ่มฟังก์ชันนี้เพื่อกรอกข้อมูลอัตโนมัติ ---
function fillUserData() {
    const targetInput = document.getElementById('targetName');
    if (currentUser && targetInput) {
        targetInput.value = currentUser;
        targetInput.readOnly = true;
    }
}

// ระบบ Login/Logout
function login() {
    const name = prompt("กรุณากรอกชื่อสมาชิกของคุณ:");
    if (name) {
        localStorage.setItem('thaiHoroUserName', name);
        location.reload();
    }
}

function logout() {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem('thaiHoroUserName');
        location.reload();
    }
}

// --- แก้ไขฟังก์ชันที่มีปัญหา ---
function checkLoginStatus() {
    const userGreeting = document.getElementById('userGreeting');
    const authBtn = document.getElementById('authButtons');

    // ตรวจสอบก่อนว่ามี Element เหล่านี้ใน HTML หรือไม่
    if (currentUser && userGreeting) {
        userGreeting.innerHTML = `✨ ยินดีต้อนรับคุณ <strong>${currentUser}</strong>`;

        if (authBtn) {
            authBtn.innerHTML = `<button class="btn btn-outline-danger btn-sm" onclick="logout()">ออกจากระบบ</button>`;
        }
    }
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

    const nameInput = document.getElementById('targetName').value.trim();
    const lastNameInput = document.getElementById('targetLastName').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const birthMonththai = document.getElementById('birthMonththai').value;

    if (!birthdate || !birthtime || !birthMonththai) {
        Swal.fire("กรุณากรอกข้อมูล", "ต้องระบุวันเกิดและเวลาเกิดให้ครบถ้วนครับ", "warning");
        return;
    }

    // แปลงวันที่
    const birthDateObj = parseThaiDate(birthdate);

    // คำนวณปีนักษัตร
    let zodiacName = "";
    if (typeof window.getZodiacElement === "function") {
        const z = window.getZodiacElement(birthdate);
        zodiacName = z.name;
    }

    const yam = getYarmFromTime(birthtime);

    Swal.fire({
        title: 'กำลังประมวลผล...',
        text: 'กรุณารอสักครู่ ระบบกำลังบันทึกข้อมูลไปยังคลาวด์',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
    });

    try {

        const mId = await generateMemberId();

        const dataToSave = {
            memberId: mId,
            name: nameInput || currentUser || "ผู้มาเยือน",
            lastName: lastNameInput, // เพิ่มนามสกุลเข้าไปใน Object
            birthdate: birthdate,
            birthMonththai: birthMonththai,
            birthtime: birthtime,
            zodiac: zodiacName,   // ⭐ บันทึกนักษัตรที่คำนวณแล้ว
            yam: yam,
            createdAt: new Date()
        };

        const docRef = await addDoc(membersCol, dataToSave);
        dataToSave.id = docRef.id;

        let history = JSON.parse(localStorage.getItem('horo_history')) || [];
        history.unshift(dataToSave);
        localStorage.setItem('horo_history', JSON.stringify(history));

        if (typeof showProfilePage === 'function') showProfilePage(dataToSave);
        if (typeof navigateTo === 'function') navigateTo('profilePage');

    } catch (err) {

        console.error("❌ เกิดข้อผิดพลาด:", err);

        Swal.fire({
            icon: 'error',
            title: 'การบันทึกล้มเหลว',
            text: err.message
        });

    } finally {

        if (Swal.isLoading()) {
            Swal.close();
        }

    }
}



// ฟังก์ชันแยกสำหรับบันทึกข้อมูล
function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('horo_history')) || [];

    // ตรวจสอบว่ามี ID นี้อยู่แล้วหรือไม่ (เพื่อป้องกันการบันทึกซ้ำเวลา refresh)
    const exists = history.some(item => item.id === data.id);

    if (!exists) {
        history.push(data);
        localStorage.setItem('horo_history', JSON.stringify(history));
        // ส่งข้อมูลไป Google Sheet
        if (typeof saveMember === 'function') {
            saveMember(data);
        }
    }
    loadHistory(); // สั่งให้ตารางอัปเดตทันที
}

// --- ฟังก์ชันสร้างรหัสสมาชิก 10 หลัก (YYYYMMDDXX) ---
// --- แก้ไขฟังก์ชัน generateMemberId ---
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
    if (!historyBody) return;

    historyBody.innerHTML = '';
    if (!dataArray || dataArray.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">ไม่พบข้อมูล</td></tr>';
        return;
    }

    dataArray.forEach((item) => {
        // ใช้ item.id (Cloud ID) แทน Date.now()
        const row = `
            <tr> 
                <td>${item.memberId || 'N/A'}</td>
                <td>${item.name}</td>
                <td>${item.lastName || '-'}</td>
                <td>${item.birthdate}</td>
                <td>${item.birthMonththai || '-'}</td>
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
    });
}


function loadHistory() {
    const history = JSON.parse(localStorage.getItem('horo_history')) || [];
    renderTable(history);
    const countEl = document.getElementById('historyCount');
    if (countEl) countEl.innerText = `ทั้งหมด ${history.length} รายการ`;
}

function viewHistory(docId) {
    const history = JSON.parse(localStorage.getItem('horo_history')) || [];
    const data = history.find(item => item.id == docId);
    if (data) {
        showProfilePage(data);
        navigateTo('profilePage');
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

    const history = JSON.parse(
        localStorage.getItem('horo_history') || '[]'
    );

    const filtered = history.filter(item => {

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
    if (!confirm("ยืนยันการลบข้อมูลนี้ถาวร?")) return;
    try {
        await deleteDoc(doc(db, "horo_history", docId));
        await syncDataFromFirestore(); // รีเฟรชข้อมูล
    } catch (err) {
        console.error("ลบไม่สำเร็จ:", err);
    }
}

// แปลงวันที่ไทย dd/mm/พ.ศ. → Date Object
function parseThaiDate(dateStr) {
    if (!dateStr) return null;

    // ถ้าเป็น format yyyy-mm-dd ให้ใช้ตรงๆ
    if (dateStr.includes('-')) {
        return new Date(dateStr);
    }

    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(dateStr);

    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]) - 1;
    let year = parseInt(parts[2]);

    // แปลง พ.ศ. → ค.ศ.
    if (year > 2400) {
        year -= 543;
    }

    return new Date(year, month, day);
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
function showProfilePage(data) {
    if (!data || !data.birthdate) return;

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
                <p><strong>วันเกิด:</strong> วัน${dayIdx !== undefined ? ` ${["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][dayIdx]}` : ''} ที่ ${parseInt(data.birthdate.split('/')[0])} ${monthIdx !== undefined ? ` ${["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][monthIdx]}` : ''} พ.ศ. ${year + 543}    
               <strong>นักษัตร:</strong> ปี${zElement.name} (${zElement.element}) 
               <p><strong>เวลาเกิด:</strong> ${cleanTime} น.   <strong>ยามเกิด:</strong> ${data.yam || "ไม่ระบุ"}</p>
                
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
            </div>
        </div>
    `;
}



// เพิ่มไว้ท้ายไฟล์ membermanager.js เพื่อแก้ Error: calculateEsh is not defined
window.navigateTo = navigateTo;
window.saveToHistory = saveToHistory;
window.calculateEsh = calculateEsh;
window.deleteItem = deleteItem;
window.viewHistory = viewHistory;
window.showProfilePage = showProfilePage;
window.searchHistory = searchHistory;// expose auxiliary functions used by inline handlers or other scripts
window.login = login;
window.logout = logout; // original function includes confirmation
window.fillUserData = fillUserData;
window.checkLoginStatus = checkLoginStatus;
window.syncDataFromFirestore = syncDataFromFirestore;
window.generateMemberId = generateMemberId;
window.deleteMember = deleteMember;

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
window.autoFillMemberData = function (birthDate) {
    if (!birthDate) return;

    // 1. ค้นหาข้อมูลสมาชิกตัวเต็มจาก Array (เพื่อเอาชื่อ)
    // หมายเหตุ: ประธานต้องดูว่าในสมาชิกมีฟิลด์ name เก็บไว้ยังไงนะครับ
    const history = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const member = history.find(m => m.birthdate === birthDate);

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

    const isMahathaksaPage =
        isPageVisible('mahathaksaPage');

    const isChatraPage =
        isPageVisible('chatraPage');

    const isNamePage =
        isPageVisible('nameAnalysisPage');
    

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
        isPageVisible('ascendantPage');    if (isAscendantPage) {
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


    const isMahathaksaSattalekPage = 
        isPageVisible('mahataksasattalek');
    
    if (isMahathaksaSattalekPage) {
        const birthDateInput = document.getElementById('birthDateSatta');
        if (birthDateInput) {
            birthDateInput.value = formattedDate;
            setTimeout(() => { if (typeof processDestiny === 'function') processDestiny(); }, 100);
        }
    }





};