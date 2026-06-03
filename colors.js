/**
 * 🎨 สีมงคล (Lucky Colors) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ดาว 9 ดวง: thai-astrology.js
 * - ธาตุ 5 ประการ: element.js
 * - บ้าน 12 บ้าน: thai-astrology.js (บ้าน 8 = ความตาย/บริสุทธิ์)
 *
 * สีมงคล 3 ประเภท:
 * 1. สีโชคลาภ: ธาตุของเราเองจำนวน
 * 2. สีบารมี: ดาวเกิด + บ้าน 10 (การจ้างงาน)
 * 3. สีกาลกิณี: ธาตุตรงข้าม (ต้องหลีกเลี่ยง)
 */

"use strict";

// ตารางสีตามดาว 9 ดวง
const PLANET_COLORS = {
    1: { name: "อาทิตย์", color: "#FFD700", colorName: "ทอง", hex: "#FFD700" },      // อาทิตย์ = ทอง
    2: { name: "จันทร์", color: "#FFFFFF", colorName: "ขาว", hex: "#FFFFFF" },      // จันทร์ = ขาว
    3: { name: "พฤหัสบดี", color: "#FF8C00", colorName: "ส้ม", hex: "#FF8C00" },    // พฤหัสบดี = ส้ม
    5: { name: "พุธ", color: "#32CD32", colorName: "เขียว", hex: "#32CD32" },      // พุธ = เขียว
    6: { name: "ศุกร์", color: "#FF69B4", colorName: "ชมพู", hex: "#FF69B4" },     // ศุกร์ = ชมพู
    8: { name: "เสาร์", color: "#4B0082", colorName: "ม่วง", hex: "#4B0082" },     // เสาร์ = ม่วง
    9: { name: "อังคาร", color: "#FF0000", colorName: "แดง", hex: "#FF0000" }      // อังคาร = แดง
};

// ตารางสีตามธาตุ 5 ประการ
const ELEMENT_COLORS = {
    "ไม้": { color: "#228B22", colorName: "เขียวเข้ม", hex: "#228B22" },            // ไม้ = เขียว
    "ไฟ": { color: "#FF4500", colorName: "สีโอคร", hex: "#FF4500" },               // ไฟ = แดง/ส้ม
    "ดิน": { color: "#DAA520", colorName: "ทองแดง", hex: "#DAA520" },             // ดิน = ทองแดง
    "โลหะ": { color: "#C0C0C0", colorName: "เงิน", hex: "#C0C0C0" },               // โลหะ = เงิน/ขาว
    "น้ำ": { color: "#1E90FF", colorName: "ฟ้า", hex: "#1E90FF" }                 // น้ำ = ฟ้า
};

// ตารางทิศตามดาว 9 ดวง
const PLANET_DIRECTIONS = {
    1: "ตะวันออก",      // อาทิตย์
    2: "เหนือ",          // จันทร์
    3: "อาคเนย์",        // พฤหัสบดี
    5: "ใต้",            // พุธ
    6: "ตะวันตก",        // ศุกร์
    8: "เหนือตะวันตก",   // เสาร์
    9: "ตะวันออกเฉียงใต้" // อังคาร
};

/**
 * 🎨 คำนวณสีมงคล จากลัคนา + ธาตุ
 *
 * วิธีการ:
 * 1. input: วันเกิด → หาดาวเกิด (ดาว 9)
 * 2. input: ปีเกิด → หาธาตุประจำปี
 * 3. สูตร: สีโชค = ธาตุของเรา + สีบารมี = ดาวเกิด + สีกาลกิณี = ธาตุตรงข้าม
 */

// แปลงวันเกิดเป็นดาว 9 ดวง
const PLANET_BY_DAY = {
    "อาทิตย์": 1,
    "จันทร์": 2,
    "อังคาร": 9,
    "พุธ": 5,
    "พฤหัสบดี": 3,
    "ศุกร์": 6,
    "เสาร์": 8
};

// ธาตุตรงข้าม (หลีกเลี่ยง)
const OPPOSITE_ELEMENTS = {
    "ไม้": "โลหะ",
    "ไฟ": "น้ำ",
    "ดิน": "ดิน",
    "โลหะ": "ไม้",
    "น้ำ": "ไฟ"
};

/**
 * คำนวณสีมงคลจากลัคนา + ธาตุ
 */
function calculateLuckyColors(birthDay, birthYear) {
    // 1. ดาวเกิดจากวัน
    const planetNum = PLANET_BY_DAY[birthDay] || 1;
    const planetInfo = PLANET_COLORS[planetNum] || PLANET_COLORS[1];

    // 2. ธาตุจากปี
    let elementType = "ดิน"; // default
    if (birthYear) {
        const year2k = (birthYear - 2000) % 5;
        const elements = ["โลหะ", "น้ำ", "ไม้", "ไฟ", "ดิน"];
        elementType = elements[year2k] || "ดิน";
    }
    const elementInfo = ELEMENT_COLORS[elementType];
    const oppositeElement = OPPOSITE_ELEMENTS[elementType];
    const oppositeInfo = ELEMENT_COLORS[oppositeElement];

    // 3. ทิศจากดาวเกิด
    const direction = PLANET_DIRECTIONS[planetNum] || "ตะวันออก";

    return {
        planetNum,
        planetName: planetInfo.name,
        wealthColor: elementInfo.colorName,      // สีโชคลาภ = ธาตุของเรา
        wealthHex: elementInfo.hex,
        powerColor: planetInfo.colorName,        // สีบารมี = ดาวเกิด
        powerHex: planetInfo.hex,
        forbiddenColor: oppositeInfo.colorName,  // สีกาลกิณี = ธาตุตรงข้าม
        forbiddenHex: oppositeInfo.hex,
        direction,
        elementType,
        explanation: `ดาว${planetInfo.name}(${planetNum}) + ธาตุ${elementType} = สีโชค${elementInfo.colorName}, สีบารมี${planetInfo.colorName}, หลีกเลี่ยงสี${oppositeInfo.colorName}`
    };
}

/**
 * 🎨 แสดงสีมงคลประจำตัว
 */
function renderDailyColors() {
    const headerDiv = document.getElementById("dailyColorHeader");
    if (!headerDiv) return;

    // รับ input จากผู้ใช้
    const birthDayEl = document.getElementById("colorBirthDay");
    const birthYearEl = document.getElementById("colorBirthYear");

    if (!birthDayEl || !birthDayEl.value || !birthYearEl) {
        headerDiv.innerHTML = `
            <div class="alert alert-warning">
                ⚠️ กรุณากรอกวันเกิดและปีเกิดก่อนดูสีมงคล
            </div>
        `;
        return;
    }

    const birthDay = birthDayEl.value;
    const birthYear = parseInt(birthYearEl.value) || new Date().getFullYear();

    // คำนวณสีมงคล
    const colors = calculateLuckyColors(birthDay, birthYear);

    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const nowInTH = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const currentDate = nowInTH.getDate();
    const currentMonth = thaiMonths[nowInTH.getMonth()];
    const currentYear = nowInTH.getFullYear() + 543;

    headerDiv.innerHTML = `
    <div class="card shadow-sm border-0 mb-3" style="background: linear-gradient(90deg, #1a1a1a, ${colors.powerHex}); color: white;">
        <div class="card-body p-3">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h5 class="text-gold mb-2">🎨 สีมงคลประจำตัวของคุณ</h5>
                    <p class="mb-1">
                        <strong>วันเกิด:</strong> ${birthDay} |
                        <strong>ปีเกิด:</strong> ${birthYear} (พ.ศ. ${birthYear + 543})
                    </p>
                    <small class="text-muted">📐 ${colors.explanation}</small>
                </div>
                <div class="col-md-6">
                    <div class="row text-center">
                        <div class="col-4">
                            <div style="background: ${colors.wealthHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center;">
                                <strong style="color: #000; font-size: 10px;">โชค</strong>
                            </div>
                            <small class="text-warning mt-1 d-block">สี${colors.wealthColor}</small>
                        </div>
                        <div class="col-4">
                            <div style="background: ${colors.powerHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center;">
                                <strong style="color: #fff; font-size: 10px;">บารมี</strong>
                            </div>
                            <small class="text-warning mt-1 d-block">สี${colors.powerColor}</small>
                        </div>
                        <div class="col-4">
                            <div style="background: ${colors.forbiddenHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center;">
                                <strong style="color: #fff; font-size: 9px;">กาลกิณี</strong>
                            </div>
                            <small class="text-warning mt-1 d-block">สี${colors.forbiddenColor}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * 📊 แสดงตารางสี 7 วัน + 5 ธาตุ
 */
function showWeeklyTable(){
    const tableWrapper = document.getElementById("weeklyTableWrapper");
    const tableBody = document.getElementById("weeklyTableBody");
    if(!tableWrapper || !tableBody) return;

    const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
    const birthYearEl = document.getElementById("colorBirthYear");
    const birthYear = birthYearEl ? parseInt(birthYearEl.value) || new Date().getFullYear() : new Date().getFullYear();

    let html = `
        <tr style="background-color: rgba(212,175,55,0.2); border-bottom: 2px solid #d4af37;">
            <th class="text-gold" style="text-align: center; padding: 10px;">📅 วัน (ดาวเกิด)</th>
            <th class="text-gold" style="text-align: center; padding: 10px;">💰 โชคลาภ (ธาตุปี)</th>
            <th class="text-gold" style="text-align: center; padding: 10px;">👑 บารมี (ดาว)</th>
            <th class="text-gold" style="text-align: center; padding: 10px;">🚫 กาลกิณี (ตรงข้าม)</th>
            <th class="text-gold" style="text-align: center; padding: 10px;">🧭 ทิศมงคล</th>
        </tr>
    `;

    days.forEach(day => {
        const planetNum = PLANET_BY_DAY[day];
        const colors = calculateLuckyColors(day, birthYear);

        const rowStyle = `border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px;`;
        html += `
        <tr style="${rowStyle}">
            <td style="color: ${colors.powerHex}; font-weight:bold; font-size:15px; text-align: center;">
                วัน${day}
            </td>
            <td style="background-color: ${colors.wealthHex}33; color: ${colors.wealthHex}; font-weight: bold; text-align: center;">
                🟠 ${colors.wealthColor}
            </td>
            <td style="background-color: ${colors.powerHex}33; color: ${colors.powerHex}; font-weight: bold; text-align: center;">
                🔴 ${colors.powerColor}
            </td>
            <td style="background-color: ${colors.forbiddenHex}33; color: ${colors.forbiddenHex}; font-weight: bold; text-align: center;">
                ⛔ ${colors.forbiddenColor}
            </td>
            <td style="text-align: center; color: #ffc107;">
                ${colors.direction}
            </td>
        </tr>`;
    });

    tableBody.innerHTML = html;
    tableWrapper.style.display = "block";
}

function colorTable(){
    const container = document.getElementById('colorpage');
    if (!container) return;
    const currentYear = new Date().getFullYear();
    const html = `
            <div class="card-header bg-dark text-white text-center py-4">
            <i class="fas fa-palette fa-5x text-gold mb-3 animate__animated animate__infinite animate__pulse"></i>
            <h2 class="text-gold mb-1">✨ หอพยากรณ์สีมงคล</h2>
            <p class="text-white-50 mb-0 small">🎨 อิงจากลัคนา (ดาว + ธาตุ) | ดูสีมงคลประจำตัวคุณ</p>
        </div>

        <div class="card-body p-4">
            <form onsubmit="return false;">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                            <select id="colorBirthDay" class="form-control form-control-lg">
                                <option value="">-- เลือกวันเกิด --</option>
                                <option value="อาทิตย์">อาทิตย์ (ดาวอาทิตย์ = ทอง)</option>
                                <option value="จันทร์">จันทร์ (ดาวจันทร์ = ขาว)</option>
                                <option value="อังคาร">อังคาร (ดาวอังคาร = แดง)</option>
                                <option value="พุธ">พุธ (ดาวพุธ = เขียว)</option>
                                <option value="พฤหัสบดี">พฤหัสบดี (ดาวพฤหัสบดี = ส้ม)</option>
                                <option value="ศุกร์">ศุกร์ (ดาวศุกร์ = ชมพู)</option>
                                <option value="เสาร์">เสาร์ (ดาวเสาร์ = ม่วง)</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="text-gold"><strong>🌍 ปีเกิด <span class="text-danger">*</span></strong></label>
                            <input type="number" id="colorBirthYear" class="form-control form-control-lg"
                                   placeholder="เช่น 1990" min="1900" max="${currentYear}"
                                   value="${currentYear}">
                            <small class="text-muted">พ.ศ. ลบ 543 = ค.ศ.</small>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-gold btn-lg btn-block mt-2" onclick="renderDailyColors()">
                    <i class="fas fa-wand-magic-sparkles"></i> ดูสีมงคลของฉัน
                </button>
            </form>

            <hr class="my-4">

            <div id="dailyColorHeader"></div>

            <div class="alert alert-info small mt-3">
                <strong>💡 วิธีใช้:</strong><br>
                ✓ <strong>สีโชคลาภ:</strong> ธาตุประจำปีเกิดของคุณ - สวมใส่เพื่อเพิ่มโชคด้านเงิน<br>
                ✓ <strong>สีบารมี:</strong> ดาวเกิดของคุณ - สวมใส่ในวันสำคัญ/เจรจางาน<br>
                ✓ <strong>สีกาลกิณี:</strong> ธาตุตรงข้าม - หลีกเลี่ยงเวลาสำคัญ
            </div>
        </div>
        <div id="weeklyTableWrapper" class="mt-2" style="display: none;">
            <div class="weekly-card animate__animated animate__fadeInUp">
                <div class="table-responsive">
                    <table class="table table-borderless text-center mb-0">
                        <thead>
                            <tr>
                                <th class="text-gold-light">วัน</th>
                                <th class="text-gold-light">โชคลาภ (เงิน)</th>
                                <th class="text-gold-light">บารมี (งาน)</th>
                                <th class="text-gold-light">กาลกิณี (ห้าม)</th>
                                <th class="text-gold-light">ทิศมงคล</th>
                            </tr>
                        </thead>
                        <tbody id="weeklyTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
                    <div class="row mt-4">
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                                <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                                <i class="fas fa-home"></i> กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
        </div>
        </div>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    colorTable();
    showWeeklyTable();

    // เมื่อเลือกวัน/ปี ให้อัปเดตสี
    const birthDayEl = document.getElementById("colorBirthDay");
    const birthYearEl = document.getElementById("colorBirthYear");

    if (birthDayEl) {
        birthDayEl.addEventListener("change", () => {
            renderDailyColors();
            showWeeklyTable();
        });
    }

    if (birthYearEl) {
        birthYearEl.addEventListener("change", () => {
            renderDailyColors();
            showWeeklyTable();
        });
    }

});