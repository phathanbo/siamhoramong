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
// ตารางสีตามดาว 8 ดวง (อิงจากตำรามหาทักษาปกรณ์แท้)
const PLANET_COLORS = {
    1: { name: "อาทิตย์", color: "#FFD700", colorName: "สีทอง/สีแดง/สีส้มแสด", hex: "#FFD700", textColor: "#000000" },      // อาทิตย์ = ทอง/แดง
    2: { name: "จันทร์", color: "#FFFFFF", colorName: "สีขาว/สีเหลืองนวล/สีครีม", hex: "#FFFFFF", textColor: "#000000" },      // จันทร์ = ขาว
    3: { name: "อังคาร", color: "#FF69B4", colorName: "สีชมพู/สีแดงกุหลาบ", hex: "#FF69B4", textColor: "#000000" },     // อังคาร = ชมพู (ตรงตามทักษาปกรณ์)
    4: { name: "พุธ", color: "#32CD32", colorName: "สีเขียว/สีมรกต", hex: "#32CD32", textColor: "#000000" },          // พุธกลางวัน = เขียว (ตรงตามทักษาปกรณ์)
    5: { name: "พฤหัสบดี", color: "#FF8C00", colorName: "สีส้มแสด/สีเหลืองทอง", hex: "#FF8C00", textColor: "#000000" },    // พฤหัสบดี = ส้ม (ตรงตามทักษาปกรณ์)
    6: { name: "ศุกร์", color: "#1E90FF", colorName: "สีฟ้า/สีน้ำเงิน/สีขาวบริสุทธิ์", hex: "#1E90FF", textColor: "#FFFFFF" }, // ศุกร์ = ฟ้า/น้ำเงิน (ตรงตามทักษาปกรณ์)
    7: { name: "เสาร์", color: "#4B0082", colorName: "สีม่วงเข้ม/สีดำ/สีกรมท่า", hex: "#4B0082", textColor: "#FFFFFF" },     // เสาร์ = ม่วง/ดำ (ตรงตามทักษาปกรณ์)
    8: { name: "ราหู", color: "#708090", colorName: "สีเทาเข้ม/สีควันบุหรี่/สีเหลือบประกาย", hex: "#708090", textColor: "#FFFFFF" }      // พุธกลางคืน (ราหู) = เทาเข้ม (ตรงตามทักษาปกรณ์)
};

// ตารางสีตามธาตุ 5 ประการ (อิงตามหลักธาตุปีนักษัตร)
const ELEMENT_COLORS = {
    "ไม้": { color: "#228B22", colorName: "สีเขียวเหนี่ยวทรัพย์", hex: "#228B22", textColor: "#FFFFFF" },            // ไม้ = เขียว
    "ไฟ": { color: "#FF4500", colorName: "สีแดง/สีส้มสว่าง", hex: "#FF4500", textColor: "#FFFFFF" },               // ไฟ = แดง/ส้ม
    "ดิน": { color: "#DAA520", colorName: "สีเหลืองทอง/สีน้ำตาลดิน", hex: "#DAA520", textColor: "#000000" },             // ดิน = ทองแดง/เหลือง
    "โลหะ": { color: "#C0C0C0", colorName: "สีเงิน/สีขาว/สีทองคำ", hex: "#C0C0C0", textColor: "#000000" },               // โลหะ = เงิน/ขาว
    "น้ำ": { color: "#1E90FF", colorName: "สีฟ้า/สีน้ำเงินลึก", hex: "#1E90FF", textColor: "#FFFFFF" }                 // น้ำ = ฟ้า/น้ำเงิน
};

// ตารางทิศตามดาว 8 ดวง (ทักษาปกรณ์แท้)
const PLANET_DIRECTIONS = {
    1: "อีสาน (ตะวันออกเฉียงเหนือ)",  // อาทิตย์ = อีสาน
    2: "บูรพา (ตะวันออก)",            // จันทร์ = บูรพา
    3: "อาคเนย์ (ตะวันออกเฉียงใต้)",  // อังคาร = อาคเนย์
    4: "ทักษิณ (ใต้)",               // พุธ = ทักษิณ
    5: "ประจิม (ตะวันตก)",            // พฤหัสบดี = ประจิม
    6: "อุดร (เหนือ)",               // ศุกร์ = อุดร
    7: "หรดี (ตะวันตกเฉียงใต้)",     // เสาร์ = หรดี
    8: "พายัพ (ตะวันตกเฉียงเหนือ)"    // ราหู (พุธกลางคืน) = พายัพ
};

/**
 * 🎨 คำนวณสีมงคล จากลัคนา + ธาตุ
 *
 * วิธีการ:
 * 1. input: วันเกิด → หาดาวเกิด (ดาวตามทักษา 8 ดวง)
 * 2. input: ปีเกิด → หาธาตุประจำปี (ตามปีนักษัตร 12 ราศี)
 * 3. สูตร: สีโชค = ธาตุของเรา + สีบารมี = ดาวเกิด + สีกาลกิณี = ธาตุขัดแย้ง
 */

// แปลงวันเกิดเป็นดาว (ทักษาปกรณ์แท้)
const PLANET_BY_DAY = {
    "อาทิตย์": 1,
    "จันทร์": 2,
    "อังคาร": 3,
    "พุธ": 4,
    "พุธกลางวัน": 4,
    "พุธกลางคืน": 8,
    "พฤหัสบดี": 5,
    "ศุกร์": 6,
    "เสาร์": 7,
    "ราหู": 8
};

// ธาตุตรงข้าม (กาลกิณี - เบญจธาตุพิฆาต)
const OPPOSITE_ELEMENTS = {
    "ไม้": "โลหะ",  // โลหะตัดไม้
    "ไฟ": "น้ำ",    // น้ำดับไฟ
    "ดิน": "ไม้",   // ไม้ชอนไชดิน
    "โลหะ": "ไฟ",   // ไฟหลอมโลหะ
    "น้ำ": "ดิน"    // ดินถมน้ำ
};

/**
 * คำนวณสีมงคลจากลัคนา + ธาตุ
 */
function calculateLuckyColors(birthDay, birthYear) {
    // 1. ดาวเกิดจากวัน
    const planetNum = PLANET_BY_DAY[birthDay] || 1;
    const planetInfo = PLANET_COLORS[planetNum] || PLANET_COLORS[1];

    // 2. ธาตุจากปี (คำนวณจากราศีปีนักษัตร 12 ราศี)
    let elementType = "ดิน"; // default
    if (birthYear) {
        const yearAD = typeof toCE === 'function' ? toCE(birthYear) : (birthYear > 2400 ? birthYear - 543 : birthYear);
        const zodiacIndex = ((yearAD - 4) % 12 + 12) % 12; // สูตรมาตรฐาน: ชวด = CE 4, ชวด = index 0
        const ZODIAC_ELEMENTS = {
            0: "น้ำ",  // ชวด (หนู)
            1: "ดิน",  // ฉลู (วัว)
            2: "ไม้",  // ขาล (เสือ)
            3: "ไม้",  // เถาะ (กระต่าย)
            4: "ดิน",  // มะโรง (มังกร)
            5: "ไฟ",   // มะเส็ง (งู)
            6: "ไฟ",   // มะเมีย (ม้า)
            7: "ดิน",  // มะแม (แพะ)
            8: "โลหะ", // วอก (ลิง)
            9: "โลหะ", // ระกา (ไก่)
            10: "ดิน", // จอ (สุนัข)
            11: "น้ำ"  // กุน (หมู)
        };
        const idx = zodiacIndex >= 0 ? zodiacIndex : (zodiacIndex + 12) % 12;
        elementType = ZODIAC_ELEMENTS[idx] || "ดิน";
    }
    const elementInfo = ELEMENT_COLORS[elementType] || ELEMENT_COLORS["ดิน"];
    const oppositeElement = OPPOSITE_ELEMENTS[elementType] || "โลหะ";
    const oppositeInfo = ELEMENT_COLORS[oppositeElement] || ELEMENT_COLORS["โลหะ"];

    // 3. ทิศจากดาวเกิด
    const direction = PLANET_DIRECTIONS[planetNum] || "อีสาน (ตะวันออกเฉียงเหนือ)";

    return {
        planetNum,
        planetName: planetInfo.name,
        wealthColor: elementInfo.colorName,      // สีโชคลาภ = ธาตุของเรา
        wealthHex: elementInfo.hex,
        wealthTextColor: elementInfo.textColor || "#000000",
        powerColor: planetInfo.colorName,        // สีบารมี = ดาวเกิด
        powerHex: planetInfo.hex,
        powerTextColor: planetInfo.textColor || "#000000",
        forbiddenColor: oppositeInfo.colorName,  // สีกาลกิณี = ธาตุขัดแย้ง
        forbiddenHex: oppositeInfo.hex,
        forbiddenTextColor: oppositeInfo.textColor || "#FFFFFF",
        direction,
        elementType,
        explanation: `ดาว${planetInfo.name} (เลข ${planetNum}) + ธาตุปีเกิด${elementType} = สีโชคลาภคือ${elementInfo.colorName}, สีส่งเสริมบารมีคือ${planetInfo.colorName}, ส่วนสีกาลกิณีที่ควรหลีกเลี่ยงคือ${oppositeInfo.colorName}`
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
    <div class="card shadow-sm border-0 mb-3" style="background: linear-gradient(90deg, #fffafaff, ${colors.powerHex}); color: white;">
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
                            <div style="background: ${colors.wealthHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                <strong style="color: ${colors.wealthTextColor}; font-size: 11px; text-shadow: ${colors.wealthTextColor === '#FFFFFF' ? '1px 1px 2px #000' : 'none'};">โชคลาภ</strong>
                            </div>
                            <small class="text-warning mt-1 d-block font-weight-bold">${colors.wealthColor}</small>
                        </div>
                        <div class="col-4">
                            <div style="background: ${colors.powerHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                <strong style="color: ${colors.powerTextColor}; font-size: 11px; text-shadow: ${colors.powerTextColor === '#FFFFFF' ? '1px 1px 2px #000' : 'none'};">บารมี</strong>
                            </div>
                            <small class="text-warning mt-1 d-block font-weight-bold">${colors.powerColor}</small>
                        </div>
                        <div class="col-4">
                            <div style="background: ${colors.forbiddenHex}; width: 60px; height: 60px; margin: 0 auto; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                <strong style="color: ${colors.forbiddenTextColor}; font-size: 10px; text-shadow: ${colors.forbiddenTextColor === '#FFFFFF' ? '1px 1px 2px #000' : 'none'};">กาลกิณี</strong>
                            </div>
                            <small class="text-warning mt-1 d-block font-weight-bold">${colors.forbiddenColor}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    showWeeklyTable();
}

/**
 * 📊 แสดงตารางสี 7 วัน + 5 ธาตุ
 * อธิบาย: สีโชค = ธาตุปี, สีบารมี = ดาวจากวัน, สีห้าม = ตรงข้ามของธาตุปี
 * (ธาตุตรงข้าม = ธาตุของปี ไม่ใช่ธาตุของวัน)
 */
function showWeeklyTable(){
    const tableWrapper = document.getElementById("weeklyTableWrapper");
    const tableBody = document.getElementById("weeklyTableBody");
    if(!tableWrapper || !tableBody) return;

    const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พุธกลางคืน","พฤหัสบดี","ศุกร์","เสาร์"];
    const birthYearEl = document.getElementById("colorBirthYear");
    const birthYear = birthYearEl ? parseInt(birthYearEl.value) || new Date().getFullYear() : new Date().getFullYear();

    // คำนวณธาตุและสี forbidden ครั้งเดียว (เหมือนกันทุกวัน เพราะมาจากปีเกิดเดียวกัน)
    let elementType = "ดิน";
    if (birthYear) {
        const yearAD = typeof toCE === 'function' ? toCE(birthYear) : (birthYear > 2400 ? birthYear - 543 : birthYear);
        const zodiacIndex = ((yearAD - 4) % 12 + 12) % 12; // สูตรมาตรฐาน: ชวด = CE 4, ชวด = index 0
        const ZODIAC_ELEMENTS = {
            0: "น้ำ", 1: "ดิน", 2: "ไม้", 3: "ไม้", 4: "ดิน", 5: "ไฟ",
            6: "ไฟ", 7: "ดิน", 8: "โลหะ", 9: "โลหะ", 10: "ดิน", 11: "น้ำ"
        };
        const idx = zodiacIndex >= 0 ? zodiacIndex : (zodiacIndex + 12) % 12;
        elementType = ZODIAC_ELEMENTS[idx] || "ดิน";
    }
    const elementInfo = ELEMENT_COLORS[elementType] || ELEMENT_COLORS["ดิน"];
    const oppositeElement = OPPOSITE_ELEMENTS[elementType] || "โลหะ";
    const oppositeInfo = ELEMENT_COLORS[oppositeElement] || ELEMENT_COLORS["โลหะ"];

    let html = `
        <tr style="background-color: rgba(212,175,55,0.2); border-bottom: 2px solid #d4af37;">
            <th class="text-gold" style="text-align: center; padding: 10px;">📅 วัน<br><small>(ดาวเกิด)</small></th>
            <th class="text-gold" style="text-align: center; padding: 10px; background: ${elementInfo.hex}33;">💰 โชคลาภ<br><small style="color: #999;">(ธาตุปี = ${elementType})</small><br><span style="font-size: 12px; color: ${elementInfo.hex};">⚫ เหมือนทุกวัน</span></th>
            <th class="text-gold" style="text-align: center; padding: 10px;">👑 บารมี<br><small style="color: #999;">(ดาวจากวัน)</small><br><span style="font-size: 12px;">⚫ เปลี่ยนตามวัน</span></th>
            <th class="text-gold" style="text-align: center; padding: 10px; background: ${oppositeInfo.hex}33;">🚫 กาลกิณี<br><small style="color: #999;">(ธาตุ${oppositeElement})</small><br><span style="font-size: 12px; color: ${oppositeInfo.hex};">⚫ เหมือนทุกวัน</span></th>
            <th class="text-gold" style="text-align: center; padding: 10px;">🧭 ทิศมงคล<br><small style="color: #999;">(จากดาว)</small></th>
        </tr>
    `;

    days.forEach(day => {
        const planetNum = PLANET_BY_DAY[day];
        const planetInfo = PLANET_COLORS[planetNum] || PLANET_COLORS[1];
        const elementInfo = ELEMENT_COLORS[elementType];
        const direction = PLANET_DIRECTIONS[planetNum] || "ตะวันออก";

        const rowStyle = `border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px;`;
        html += `
        <tr style="${rowStyle}">
            <td style="color: ${planetInfo.hex}; font-weight:bold; font-size:15px; text-align: center;">
                วัน${day}
            </td>
            <td style="background-color: ${elementInfo.hex}33; color: ${elementInfo.hex}; font-weight: bold; text-align: center;">
                💰 ${elementInfo.colorName}
            </td>
            <td style="background-color: ${planetInfo.hex}33; color: ${planetInfo.hex}; font-weight: bold; text-align: center;">
                👑 ${planetInfo.colorName}
            </td>
            <td style="background-color: ${oppositeInfo.hex}33; color: ${oppositeInfo.hex}; font-weight: bold; text-align: center;">
                ⛔ ${oppositeInfo.colorName}
            </td>
            <td style="text-align: center; color: #ffc107;">
                🧭 ${direction}
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
                                <option value="อาทิตย์">อาทิตย์ (ดาวอาทิตย์ = สีทอง/แดง/ส้มแสด)</option>
                                <option value="จันทร์">จันทร์ (ดาวจันทร์ = สีขาว/เหลืองนวล/ครีม)</option>
                                <option value="อังคาร">อังคาร (ดาวอังคาร = สีชมพู/แดงกุหลาบ)</option>
                                <option value="พุธ">พุธกลางวัน (ดาวพุธ = สีเขียวมรกต)</option>
                                <option value="พุธกลางคืน">พุธกลางคืน (พระราหู = สีเทาเข้ม/เหลือบประกาย)</option>
                                <option value="พฤหัสบดี">พฤหัสบดี (ดาวพฤหัสบดี = สีส้มแสด/เหลืองทอง)</option>
                                <option value="ศุกร์">ศุกร์ (ดาวศุกร์ = สีฟ้า/น้ำเงิน/ขาวบริสุทธิ์)</option>
                                <option value="เสาร์">เสาร์ (ดาวเสาร์ = สีม่วงเข้ม/ดำ/กรมท่า)</option>
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
            <div id="dailyColorHeader" class="container"></div>

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

if (typeof document !== 'undefined') {
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
}

// Global exports for testing and module usage
if (typeof window !== 'undefined') {
    window.PLANET_COLORS = PLANET_COLORS;
    window.ELEMENT_COLORS = ELEMENT_COLORS;
    window.PLANET_BY_DAY = PLANET_BY_DAY;
    window.OPPOSITE_ELEMENTS = OPPOSITE_ELEMENTS;
    window.calculateLuckyColors = calculateLuckyColors;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLANET_COLORS, ELEMENT_COLORS, PLANET_BY_DAY, OPPOSITE_ELEMENTS, calculateLuckyColors };
}