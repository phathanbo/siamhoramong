/**
 * 📅 พยากรณ์ประจำเดือน - ลัคนา + ธาตุ + บ้าน 11 (Labhha)
 *
 * อ้างอิง:
 * - ลัคนา (Lagna) - ตำแหน่งที่ราศีปรากฏตอนเกิด (วัน % 9 = ดาว 9 ดวง)
 * - ธาตุ 5 ประการ - ไม้/ไฟ/ดิน/โลหะ/น้ำ (ปี % 5)
 * - บ้าน 11 (Labhha) - ลาภ/โชคลาภ/ความสุข
 * - เดือนธาตุ - แต่ละเดือนมีธาตุประจำ (ดูจากความสัมพันธ์ฤกษ์)
 *
 * หลักการ:
 * 1. ดาวเกิด (birth day % 9) = บุคลิก + ความสามารถ
 * 2. ธาตุเกิด (birth year % 5) = รูปแบบการสะสม
 * 3. ธาตุประจำเดือน = การเปลี่ยนแปลงพลังงาน
 * 4. เปรียบเทียบธาตุเกิด vs เดือนธาตุ = ข้อแนะนำเดือนนั้น
 */

"use strict";

// ธาตุประจำเดือน (ฤกษ์ไทย)
const MONTH_ELEMENTS = {
    1: "ไฟ",      // มกราคม
    2: "โลหะ",    // กุมภาพันธ์
    3: "ไม้",      // มีนาคม
    4: "น้ำ",      // เมษายน
    5: "ดิน",     // พฤษภาคม
    6: "ไฟ",      // มิถุนายน
    7: "โลหะ",    // กรกฎาคม
    8: "ไม้",      // สิงหาคม
    9: "น้ำ",      // กันยายน
    10: "ดิน",    // ตุลาคม
    11: "ไฟ",     // พฤศจิกายน
    12: "โลหะ"    // ธันวาคม
};

// ความสัมพันธ์ธาตุ (Generation vs Breaking)
const ELEMENT_RELATIONSHIP = {
    "ไม้": { support: "น้ำ", suppress: "โลหะ", description: "ไม้รักษา ต้องการน้ำให้เจริญ หวาดกลัวโลหะ" },
    "ไฟ": { support: "ไม้", suppress: "น้ำ", description: "ไฟเจริญจาก ไม้ แต่เสื่อมจากน้ำ" },
    "ดิน": { support: "ไฟ", suppress: "ไม้", description: "ดินเกิดจากไฟ ถูกลำเลียงโดยไม้" },
    "โลหะ": { support: "ดิน", suppress: "ไฟ", description: "โลหะแสร้งจากดิน แต่หลอมจากไฟ" },
    "น้ำ": { support: "โลหะ", suppress: "ดิน", description: "น้ำสะสมจากโลหะ ถูกดินกั้น" }
};

// ข้อมูลพยากรณ์รายเดือนตามธาตุและการเปรียบเทียบ
const MONTH_PREDICTION = {
    "support": {
        title: "ดวงดี - ธาตุสนับสนุน",
        description: "เดือนนี้ธาตุดำเนินการเข้ามาเพื่อให้คุณเจริญรุ่งเรือง",
        fortune: "⭐⭐⭐⭐⭐ ดวงแข็ง",
        wealth: "โชคลาภหลาย ลาภผลสูง",
        love: "ความรักเจริญงอก อบอุ่นสุขใจ",
        career: "งานประสบความสำเร็จ ได้รับการสนับสนุน",
        advice: "ควรเร่งทำการงานสำคัญและการลงทุน"
    },
    "neutral": {
        title: "ดวงปกติ - ธาตุสมดุล",
        description: "เดือนนี้ศูนย์สมดุล ความมั่นคง แต่ไม่มีความเจริญดุจ",
        fortune: "⭐⭐⭐ ดวงปานกลาง",
        wealth: "รายได้สม่ำเสมอ ไม่มีความเสี่ยง",
        love: "ความรักราบรื่น เสถียรปกติ",
        career: "งานเดินหน้าปกติ ต้องใช้ความพยายาม",
        advice: "ควรออมเงินและสะสมพลังงาน"
    },
    "suppress": {
        title: "ดวงท้าทาย - ธาตุขัดแย้ง",
        description: "เดือนนี้ธาตุเข้ามาเป็นอุปสรรค ต้องระวังและปรับตัว",
        fortune: "⭐⭐ ดวงอ่อน",
        wealth: "ต้องระมัดระวังการใช้เงิน อาจมีค่าใช้จ่ายจำนวนมาก",
        love: "มีจุดตึงเครียด ต้องสื่อสารชัดเจน",
        career: "มีอุปสรรค ต้องพยายาม อดทน",
        advice: "ทำบุญ ไหว้พระ ส่วนกุศล เพื่อผ่านพ้นยากลำบาก"
    }
};

const THAI_MONTHS = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                     "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

/**
 * 📅 คำนวณพยากรณ์รายเดือน
 */
function calculateMonthlyFortune(birthDay, birthYear, targetMonth) {
    // 1️⃣ ดาวเกิด
    const planetNum = (birthDay % 9) || 9;
    const planetNames = ["", "อาทิตย์", "จันทร์", "พฤหัสบดี", "พุธ", "ศุกร์", "ศุกร์", "เสาร์", "เสาร์", "อังคาร"];
    const planetName = planetNames[planetNum];

    // 2️⃣ ธาตุเกิด
    const birthElement = (birthYear - 1900) % 5;
    const elementNames = ["ไม้", "ไฟ", "ดิน", "โลหะ", "น้ำ"];
    const birthElementName = elementNames[birthElement];

    // 3️⃣ ธาตุประจำเดือน
    const monthElementName = MONTH_ELEMENTS[targetMonth] || "ไม้";

    // 4️⃣ เปรียบเทียบธาตุ
    const relationship = ELEMENT_RELATIONSHIP[birthElementName];
    let predictionType = "neutral";

    if (relationship.support === monthElementName) {
        predictionType = "support";
    } else if (relationship.suppress === monthElementName) {
        predictionType = "suppress";
    }

    const prediction = MONTH_PREDICTION[predictionType];

    return {
        planetNum,
        planetName,
        birthElement: birthElementName,
        monthElement: monthElementName,
        month: THAI_MONTHS[targetMonth],
        relationship: relationship,
        predictionType,
        prediction
    };
}

/**
 * 📅 แสดงหน้าพยากรณ์รายเดือน
 */
function showMonthlyFortunePage() {
    const container = document.getElementById('monthlyFortunePage');
    if (!container) return;

    container.innerHTML = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">📅 พยากรณ์ประจำเดือน</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา (ดาว 9) + ธาตุ 5 + บ้าน 11</p>
        </div>

        <div class="card-body p-4">
            <form onsubmit="return false;">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="text-gold"><strong>📅 วันเกิด</strong></label>
                            <input type="number" id="monthlyBirthDay" class="form-control bg-dark text-gold border-gold"
                                   placeholder="1-31" min="1" max="31">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="text-gold"><strong>📅 ปีเกิด</strong></label>
                            <input type="number" id="monthlyBirthYear" class="form-control bg-dark text-gold border-gold"
                                   placeholder="1990">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="text-gold"><strong>📆 เลือกเดือน</strong></label>
                            <select id="monthlySelectMonth" class="form-control bg-dark text-gold border-gold">
                                <option value="">-- เลือกเดือน --</option>
                                <option value="1">มกราคม</option>
                                <option value="2">กุมภาพันธ์</option>
                                <option value="3">มีนาคม</option>
                                <option value="4">เมษายน</option>
                                <option value="5">พฤษภาคม</option>
                                <option value="6">มิถุนายน</option>
                                <option value="7">กรกฎาคม</option>
                                <option value="8">สิงหาคม</option>
                                <option value="9">กันยายน</option>
                                <option value="10">ตุลาคม</option>
                                <option value="11">พฤศจิกายน</option>
                                <option value="12">ธันวาคม</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeMonthlyFortune()">
                    <i class="fas fa-chart-line mr-2"></i>ดูพยากรณ์เดือนนี้
                </button>
            </form>

            <div id="monthlyResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ลัคนา (Lagna) - ดาว 9 ดวง<br>
                ✓ ธาตุ 5 ประการ (Wu Xing)<br>
                ✓ บ้าน 11 (Labhha) = ลาภ/โชคลาภ<br>
                ✓ ความสัมพันธ์ธาตุตามหลักโหราศาสตร์ไทย
            </div>

            <div class="row mt-4">
                <div class="col-6">
                    <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
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
}

/**
 * 📅 วิเคราะห์พยากรณ์รายเดือน
 */
function analyzeMonthlyFortune() {
    const birthDayEl = document.getElementById('monthlyBirthDay');
    const birthYearEl = document.getElementById('monthlyBirthYear');
    const monthEl = document.getElementById('monthlySelectMonth');
    const resultEl = document.getElementById('monthlyResult');

    if (!birthDayEl.value || !birthYearEl.value || !monthEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกวันเกิด ปีเกิด และเลือกเดือน', 'warning');
        return;
    }

    const birthDay = parseInt(birthDayEl.value);
    const birthYear = parseInt(birthYearEl.value);
    const targetMonth = parseInt(monthEl.value);

    if (birthDay < 1 || birthDay > 31) {
        Swal.fire('แจ้งเตือน', 'วันเกิดต้อง 1-31', 'warning');
        return;
    }

    const result = calculateMonthlyFortune(birthDay, birthYear, targetMonth);

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">📅 ผลพยากรณ์ประจำเดือน</h4>

            <div class="alert alert-dark mb-3">
                <strong class="text-gold">📊 ข้อมูลประจำตัว:</strong><br>
                ⭐ ดาวเกิด: <strong>${result.planetName}</strong> (เลขที่ ${result.planetNum})<br>
                🌀 ธาตุเกิด: <strong>${result.birthElement}</strong><br>
                📆 เดือนที่ดู: <strong>${result.month}</strong><br>
                🔄 ธาตุประจำเดือน: <strong>${result.monthElement}</strong>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h5 class="text-gold mb-2">${result.prediction.title}</h5>
                    <p class="small mb-2">${result.prediction.description}</p>
                    <hr class="border-gold-30">
                    <p class="small mb-2"><strong>💎 ระดับดวง:</strong> ${result.prediction.fortune}</p>
                    <p class="small mb-2"><strong>💰 ลาภ/การเงิน:</strong> ${result.prediction.wealth}</p>
                    <p class="small mb-2"><strong>💑 ความรัก:</strong> ${result.prediction.love}</p>
                    <p class="small mb-2"><strong>💼 การงาน:</strong> ${result.prediction.career}</p>
                    <p class="small mb-0"><strong>✨ คำแนะนำ:</strong> ${result.prediction.advice}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold">
                <div class="card-body">
                    <h6 class="text-gold mb-2">🔄 ความสัมพันธ์ธาตุ</h6>
                    <p class="small mb-2"><strong>${result.birthElement}:</strong> ${result.relationship.description}</p>
                    <p class="small mb-0"><strong>สัมพันธ์:</strong> รักษา = ${result.relationship.support}, หวาดกลัว = ${result.relationship.suppress}</p>
                </div>
            </div>

            <div class="alert alert-secondary small mt-3">
                <strong>💡 เศษวิทยา:</strong><br>
                พยากรณ์นี้อิงจากหลักลัคนาและธาตุ 5 ประการ<br>
                ควรประกอบอื่นๆ เช่น ปฏิทินฤกษ์มงคล ดูดวงเต็มรูปแบบ สำหรับความแม่นยำมากขึ้น
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showMonthlyFortunePage();
});

window.analyzeMonthlyFortune = analyzeMonthlyFortune;
