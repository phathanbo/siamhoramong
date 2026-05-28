"use strict";

/**
 * ข้อมูลสีมงคลประจำวัน
 * เพิ่ม 'forbidden' ให้ครบทุกวันเพื่อป้องกันค่า undefined
 */
const dailyColors = {
    0: { day: "อาทิตย์", lucky: "แดง", wealth: "เขียว", power: "ชมพู/ดำ", forbidden: "ฟ้า/น้ำเงิน", numbers: "1, 9" },
    1: { day: "จันทร์", lucky: "เหลือง/ขาว", wealth: "ม่วง", power: "เขียว", forbidden: "แดง", numbers: "2, 5" },
    2: { day: "อังคาร", lucky: "ชมพู", wealth: "ส้ม/ทอง", power: "ม่วง/ดำ", forbidden: "ขาว/เหลือง", numbers: "3, 8" },
    3: { day: "พุธ", lucky: "เขียว", wealth: "ฟ้า/น้ำเงิน", power: "ส้ม/ทอง", forbidden: "ชมพู", numbers: "4, 7" },
    4: { day: "พฤหัสบดี", lucky: "ส้ม/ทอง", wealth: "แดง", power: "ฟ้า/น้ำเงิน", forbidden: "ม่วง/ดำ", numbers: "5, 1" },
    5: { day: "ศุกร์", lucky: "ฟ้า/น้ำเงิน", wealth: "ชมพู", power: "เหลือง/ขาว", forbidden: "ม่วง", numbers: "6, 3" },
    6: { day: "เสาร์", lucky: "ม่วง/ดำ", wealth: "น้ำเงิน/ฟ้า", power: "แดง", forbidden: "เขียว", numbers: "7, 2" }
};

/**
 * ฟังก์ชันสุ่มตัวเลขแบบใช้ Seed (อิงตามวันที่) 
 * เพื่อให้เลขนำโชควันนี้เหมือนเดิมตลอดทั้งวัน แม้จะ Refresh หน้าเว็บ
 */
function getSeededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateLuckyNumbers(baseNumbers) {
    const todaySeed = new Date().setHours(0, 0, 0, 0); // ใช้ timestamp วันนี้เป็น seed
    const nums = new Set();
    let attempts = 0;

    // สุ่มเลข 2 หลักจำนวน 3 ชุด
    while (nums.size < 3 && attempts < 50) {
        attempts++;
        const iterationSeed = todaySeed + attempts;
        const randIdx = Math.floor(getSeededRandom(iterationSeed) * baseNumbers.length);
        const base = baseNumbers[randIdx];
        const randDigit = Math.floor(getSeededRandom(iterationSeed + 1) * 10);

        const num = `${base}${randDigit}`;
        const rev = `${randDigit}${base}`;

        // ตรวจสอบความซ้ำซ้อน (เช่น 19 กับ 91 ถือเป็นชุดเดียวกัน)
        if (!nums.has(num) && !nums.has(rev)) {
            nums.add(num);
        }
    }

    return [...nums].join(", ") || "รออัปเดต";
}

/**
 * ดึงข้อมูลมงคลตามวันปัจจุบัน
 */
function getTodayLuckyData() {
    const today = new Date().getDay();
    // ป้องกันกรณี index ผิดพลาด ให้ fallback ไปที่วันอาทิตย์ (0)
    return dailyColors[today] || dailyColors[0];
}

/**
 * แสดงหน้าสีมงคลหลัก
 */
function showLuckyPage() {
    // ตรวจสอบว่ามีฟังก์ชันนำทางหรือไม่
    if (typeof window.navigateTo === "function") {
        window.navigateTo('auspiciousPage');
    }

    const page = document.getElementById('luckyPage');
    if (page) page.classList.remove('hidden');

    const data = getTodayLuckyData();
    const container = document.getElementById('luckyContent');
    
    if (!container) return;

    // จัดเตรียมเลขนำโชค
    const baseNums = data.numbers.split(",").map(n => n.trim());
    const luckyNums = generateLuckyNumbers(baseNums);

    container.innerHTML = `
        <div class="text-center mb-4">
            <h3 class="text-primary">วันนี้วัน${data.day}</h3>
            <p class="text-muted small">อัปเดตข้อมูลตามตำราทักษาพยากรณ์</p>
        </div>
        <div class="list-group">
            ${createListItem("🎨 <b>สีมงคลหลัก:</b>", data.lucky, "text-success")}
            ${createListItem("💰 <b>สีเสริมโชคลาภ:</b>", data.wealth, "text-info")}
            ${createListItem("🦁 <b>สีเสริมอำนาจ:</b>", data.power, "text-secondary")}
            ${createListItem("🚫 <b>สีต้องห้าม:</b>", data.forbidden || 'ไม่มี', "text-danger fw-bold", "bg-light-danger")}
            ${createListItem("🔢 <b>เลขนำโชควันนี้:</b>", luckyNums, "fw-bold text-dark", "bg-gold-light")}
        </div>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Helper function สำหรับสร้าง HTML list item ลดความซ้ำซ้อนของโค้ด
 */
function createListItem(label, value, valueClass, bgClass = "") {
    return `
        <div class="list-group-item d-flex justify-content-between ${bgClass}">
            <span>${label}</span>
            <span class="${valueClass}">${value}</span>
        </div>
    `;
}

/**
 * อัปเดตข้อมูลบน Header Bar
 */
function updateHeaderLuckyBar() {
    const data = getTodayLuckyData();
    const baseNums = data.numbers.split(",").map(n => n.trim());
    const luckyNums = generateLuckyNumbers(baseNums);

    const elements = {
        'headerDayName': data.day,
        'headerLuckyColor': data.lucky,
        'headerWealthColor': data.wealth,
        'headerForbiddenColor': data.forbidden || "ไม่มี",
        'headerLuckyNumber': luckyNums
    };

    // วนลูปอัปเดต Element ถ้ามีอยู่ในหน้าเว็บ
    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderLuckyBar();
});