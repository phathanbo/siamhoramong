/**
 * 💼 พยากรณ์ธุรกิจ/การเงิน (Business & Finance Fortune) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ลัคนา (ดาว 9 ดวง): thai-astrology.js
 * - บ้าน 10 (การจ้างงาน) & บ้าน 11 (ลาภะ = รายได้): thai-astrology.js
 * - ธาตุ 5 ประการ: element.js
 * - เดือนเกิด: หลักเพิ่มเติมสำหรับบ้านหลัก
 * - เวลาเกิด (optional): lagna ascendant calculation
 *
 * วิธีคำนวณ:
 * 1. วันเกิด (date) → ดาว 9 ดวง → ลักษณะธุรกิจ
 * 2. เดือนเกิด (month) → บ้านหลัก → ความเฉพาะเจาะจง
 * 3. ปีเกิด (year) → ธาตุ 5 ประการ → สิ่งที่ลงทุน
 * 4. เวลาเกิด (time) → lagna ascendant (optional) → ความแม่นยำเพิ่ม
 * 5. บ้าน 10 (กรรม) → อาชีพเหมาะสม
 * 6. บ้าน 11 (ลาภะ) → ระดับรายได้
 */

"use strict";

// ข้อมูลธุรกิจตามดาว 9 ดวง
const BUSINESS_BY_PLANET = {
    1: {
        name: "อาทิตย์",
        businessRating: 5,
        financeRating: 5,
        summary: "ผู้นำธุรกิจที่เก่ง ความสว่างสำหรับความสำเร็จ",
        character: "ความแข็งแกร่ง ความหนักแน่น จิตสำนึกสูง",
        risk: "อาจเชื่อมั่นในตัวเองมากเกินไป"
    },
    2: {
        name: "จันทร์",
        businessRating: 3,
        financeRating: 3,
        summary: "ธุรกิจขนาดกลาง ยิ่งพูดคุยเท่า ยิ่งขาย",
        character: "อ่อนไหว สัญชาตญาณดี สตรีศ้อม",
        risk: "อาจตัดสินใจโดยอารมณ์"
    },
    3: {
        name: "พฤหัสบดี",
        businessRating: 5,
        financeRating: 5,
        summary: "โชคลาภอย่างยิ่ง การลงทุนปกติก็ได้กำไร",
        character: "มีน้ำใจ เศรษฐี ช่วยเหลือผู้อื่น",
        risk: "อาจสละสลวยให้ตัวตนแบบพ่อค้า"
    },
    5: {
        name: "พุธ",
        businessRating: 4,
        financeRating: 4,
        summary: "สติปัญญาในการค้า การซื้อขายดีมาก",
        character: "สติปัญญา การวิเคราะห์ ไหวพริบดี",
        risk: "อาจคิดจนเกินไป เน้นปะละเอียด"
    },
    6: {
        name: "ศุกร์",
        businessRating: 4,
        financeRating: 4,
        summary: "ธุรกิจศิลป์ การค้าสินค้าสวย บิวตี้ดี",
        character: "ความสวย การปรึกษา ประสิทธิภาพ",
        risk: "อาจหลงใจในความสวย นิยมเป่าลม"
    },
    8: {
        name: "เสาร์",
        businessRating: 2,
        financeRating: 2,
        summary: "ต้องพยายามหนัก ผลลัพธ์ช้า แต่ยั่งยืน",
        character: "อดทน สม่ำเสมอ คุณภาพ",
        risk: "อาจติดขัดจากอุปสรรคเก่า"
    },
    9: {
        name: "อังคาร",
        businessRating: 4,
        financeRating: 3,
        summary: "ธุรกิจเดือด ความเสี่ยงสูง ถ้าชนะ ยิ่งใหญ่",
        character: "ความกล้าหาญ พลังไฟ ความร้อนแรง",
        risk: "อาจโดดเข้ง เสี่ยงสูง"
    }
};

// อาชีพเหมาะสมตามดาว + บ้าน 10
const SUITABLE_CAREERS = {
    1: ["ผู้บริหาร", "นักธุรกิจ", "ข้าราชการ", "วิศวกร", "หมอ"],
    2: ["กลเมดริน", "นักบัญชี", "ผู้เชี่ยวชาญด้านอาหาร", "อาจารย์", "ที่ปรึกษา"],
    3: ["ธนาคารการ", "อาจารย์", "นักการเมือง", "นักธุรกิจ", "บริหาร"],
    5: ["นักค้า", "อาจารย์", "นักเขียน", "สื่อมวลชน", "บัญชี"],
    6: ["ศิลปิน", "นักแสดง", "ดีไซเนอร์", "นักท่องเที่ยว", "บริหาร"],
    8: ["วิศวกร", "สถาปนิก", "บัญชี", "วิทยาศาสตร์", "เกษตรกร"],
    9: ["ทหาร", "ตำรวจ", "นักกีฬา", "วิศวกร", "นักบริหาร"]
};

// ระดับรายได้ตามบ้าน 11 (ลาภะ)
const INCOME_LEVELS = {
    high: { rating: 5, description: "รายได้สูง โอกาสทำเงิน" },
    medium: { rating: 3, description: "รายได้ปกติ สม่ำเสมอ" },
    low: { rating: 2, description: "รายได้น้อย ต้องหาเพิ่ม" }
};

// ลงทุนเหมาะสมตามธาตุ
const INVESTMENT_GUIDE = {
    "ไม้": {
        good: ["เกษตร", "อสังหาริมทรัพย์", "ธุรกิจสร้างสรรค์"],
        avoid: ["โลหะ", "บ่อน", "การพนัน"]
    },
    "ไฟ": {
        good: ["บิวตี้", "ร้านอาหาร", "มีเดีย", "ทัวร์"],
        avoid: ["น้ำ", "ธุรกิจน้ำ", "ปลูกป่า"]
    },
    "ดิน": {
        good: ["ที่ดิน", "อสังหาริมทรัพย์", "สินค้า", "เกษตร"],
        avoid: ["ดิน", "ปลูกผลไม้", "ขุดคุ้"]
    },
    "โลหะ": {
        good: ["เทคโนโลยี", "เครื่องจักร", "เงินเชื่อ", "ธุรกิจค้นหา"],
        avoid: ["ไม้", "เรือ", "เข่าเถื่อน"]
    },
    "น้ำ": {
        good: ["ท่องเที่ยว", "การขนส่ง", "กิจการน้ำ", "ตกปลา"],
        avoid: ["ไฟ", "พยัญชนะ", "อพยพเสี่ยง"]
    }
};

/**
 * 💼 คำนวณพยากรณ์ธุรกิจ จากข้อมูลวันเดือนปีเกิดแบบสมบูรณ์
 * @param {string|Date} birthDateInput - YYYY-MM-DD หรือ Date object
 * @param {string} birthTimeStr - optional HH:MM (เวลาเกิด สำหรับ lagna คำนวณ)
 */
function calculateBusinessFortune(birthDateInput, birthTimeStr = null) {
    // แปลง input เป็น Date object
    let birthDate, birthDay, birthMonth, birthYear, dayOfWeek;

    if (typeof birthDateInput === 'string') {
        // รองรับทั้ง YYYY-MM-DD และชื่อวัน
        if (['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'].includes(birthDateInput)) {
            // legacy: ถ้า input เป็นชื่อวัน ให้ใช้เดิม
            const planets = {
                "อาทิตย์": 1, "จันทร์": 2, "อังคาร": 9, "พุธ": 5,
                "พฤหัสบดี": 3, "ศุกร์": 6, "เสาร์": 8
            };
            const planetNum = planets[birthDateInput] || 1;
            const planetInfo = BUSINESS_BY_PLANET[planetNum];

            // simple version ถ้าใช้แค่ day name (ไม่มีวันที่ที่แท้จริง)
            let elementType = birthTimeStr ? "ดิน" : "ดิน"; // default
            if (birthTimeStr) {
                const year2k = (parseInt(birthTimeStr) - 2000) % 5;
                const elements = ["โลหะ", "น้ำ", "ไม้", "ไฟ", "ดิน"];
                elementType = elements[year2k] || "ดิน";
            }

            let incomeLevel = "medium";
            if ([1, 3, 5, 6].includes(planetNum)) {
                incomeLevel = planetInfo.financeRating >= 4 ? "high" : "medium";
            } else if (planetNum === 8) {
                incomeLevel = "low";
            }

            return {
                birthDate: "ไม่ระบุวันที่ที่แท้จริง",
                planetNum,
                planetName: planetInfo.name,
                businessRating: planetInfo.businessRating,
                financeRating: planetInfo.financeRating,
                character: planetInfo.character,
                riskWarning: planetInfo.risk,
                summary: planetInfo.summary,
                careers: SUITABLE_CAREERS[planetNum] || [],
                elementType,
                investmentGood: (INVESTMENT_GUIDE[elementType] || {}).good || [],
                investmentAvoid: (INVESTMENT_GUIDE[elementType] || {}).avoid || [],
                incomeLevel,
                incomeDescription: INCOME_LEVELS[incomeLevel].description,
                explanation: `ดาว${planetInfo.name}(${planetNum}) + ธาตุ${elementType}`
            };
        } else {
            // YYYY-MM-DD format
            birthDate = new Date(birthDateInput);
            if (isNaN(birthDate.getTime())) {
                return { error: "รูปแบบวันเกิดไม่ถูกต้อง (ใช้ YYYY-MM-DD)" };
            }
        }
    } else if (birthDateInput instanceof Date) {
        birthDate = birthDateInput;
    } else {
        return { error: "รูปแบบวันเกิดไม่ถูกต้อง" };
    }

    // ดึงข้อมูลจาก Date
    birthDay = birthDate.getDate();
    birthMonth = birthDate.getMonth() + 1;
    birthYear = birthDate.getFullYear();
    dayOfWeek = birthDate.getDay();

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = thaiDays[dayOfWeek];

    // 1️⃣ ดาวเกิดจากวันที่ (date) - ดาว 9 ดวง
    const planetNum = (birthDay % 9) || 9;
    const planetInfo = BUSINESS_BY_PLANET[planetNum];
    if (!planetInfo) {
        return { error: "ไม่พบข้อมูลดาวเกิด" };
    }

    // 2️⃣ ธาตุประจำปี (5 ธาตุ)
    const buddhayear = birthYear - 543;
    const elementIndex = buddhayear % 5;
    const elementNames = ["ไม้", "ไฟ", "ดิน", "โลหะ", "น้ำ"];
    const elementType = elementNames[elementIndex] || "ดิน";
    const elementInfo = INVESTMENT_GUIDE[elementType] || INVESTMENT_GUIDE["ดิน"];

    // 3️⃣ บ้านหลัก (House) - คำนวณจากเดือนเกิด
    const houseNum = ((birthMonth - 1 + Math.floor((birthDay - 1) / 10)) % 12) + 1;

    // 4️⃣ Lagna / Ascendant (ถ้ามีเวลาเกิด)
    let lagnaInfo = null;
    if (birthTimeStr) {
        // ในอนาคตสามารถเพิ่มคำนวณ lagna ได้
        lagnaInfo = `เวลาเกิด: ${birthTimeStr} (ต้องการสำหรับ lagna ที่แม่นยำ)`;
    }

    // 5️⃣ ระดับรายได้ (บ้าน 11 = ลาภะ)
    let incomeLevel = "medium";
    if ([1, 3, 5, 6].includes(planetNum)) {
        incomeLevel = planetInfo.financeRating >= 4 ? "high" : "medium";
    } else if (planetNum === 8) {
        incomeLevel = "low";
    }

    // 6️⃣ สรุปข้อมูล
    return {
        birthDate: `${birthDay}/${birthMonth}/${birthYear} (${dayName})`,
        dayName: dayName,
        planetNum: planetNum,
        planetName: planetInfo.name,
        businessRating: planetInfo.businessRating,
        financeRating: planetInfo.financeRating,
        character: planetInfo.character,
        riskWarning: planetInfo.risk,
        summary: planetInfo.summary,
        careers: SUITABLE_CAREERS[planetNum] || [],
        houseNum: houseNum,
        elementType: elementType,
        investmentGood: elementInfo.invest || [],
        investmentAvoid: elementInfo.avoid || [],
        lagnaInfo: lagnaInfo,
        incomeLevel: incomeLevel,
        incomeDescription: INCOME_LEVELS[incomeLevel].description,
        explanation: `ดาว${planetInfo.name}(${planetNum}) + บ้าน${houseNum} + ธาตุ${elementType}(ปี${birthYear}) = ดวงธุรกิจ${incomeLevel === 'high' ? '💎 สูง' : incomeLevel === 'medium' ? '🏡 ปานกลาง' : '⚠️ ต่ำ'}`
    };
}

/**
 * แสดงผลพยากรณ์ธุรกิจ
 */
function showBusinessFortune() {
    const container = document.getElementById('businessFortuneContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">💼 พยากรณ์ธุรกิจและการเงิน</h2>
                <p class="text-white-50 mb-0 small">🎯 อิงจากลัคนา (ดาว + บ้าน 10-11) + ธาตุประจำปี</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                                <select id="businessBirthDay" class="form-control form-control-lg">
                                    <option value="">-- เลือกวันเกิด --</option>
                                    <option value="อาทิตย์">อาทิตย์</option>
                                    <option value="จันทร์">จันทร์</option>
                                    <option value="อังคาร">อังคาร</option>
                                    <option value="พุธ">พุธ</option>
                                    <option value="พฤหัสบดี">พฤหัสบดี</option>
                                    <option value="ศุกร์">ศุกร์</option>
                                    <option value="เสาร์">เสาร์</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>🌍 ปีเกิด <span class="text-danger">*</span></strong></label>
                                <input type="number" id="businessBirthYear" class="form-control form-control-lg"
                                       placeholder="เช่น 1990" min="1900" max="2100"
                                       value="${new Date().getFullYear()}">
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="calculateAndShowBusiness()">
                        <i class="fas fa-calculator"></i> วิเคราะห์ดวงธุรกิจ
                    </button>
                </form>

                <div id="businessResult" class="mt-4"></div>

                <hr class="my-4">
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
 * คำนวณและแสดงผล
 */
function calculateAndShowBusiness() {
    const dayEl = document.getElementById("businessBirthDay");
    const yearEl = document.getElementById("businessBirthYear");
    const resultEl = document.getElementById("businessResult");

    if (!dayEl.value || !yearEl.value) {
        alert("⚠️ กรุณากรอกวันเกิดและปีเกิด");
        return;
    }

    const result = calculateBusinessFortune(dayEl.value, parseInt(yearEl.value));

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <div class="alert alert-info small">
                <strong>📊 วิเคราะห์:</strong> ${result.explanation}
            </div>

            <div class="row mt-3">
                <div class="col-md-6">
                    <h5 class="text-gold">💼 ดวงธุรกิจ</h5>
                    <p class="mb-2">
                        <strong>ดาว:</strong> ${result.planetName}<br>
                        <strong>ธุรกิจ:</strong> ${'⭐'.repeat(result.businessRating)}<br>
                        <strong>การเงิน:</strong> ${'⭐'.repeat(result.financeRating)}
                    </p>
                    <p class="text-muted small">${result.summary}</p>
                </div>
                <div class="col-md-6">
                    <h5 class="text-gold">💰 ระดับรายได้</h5>
                    <p class="mb-2">
                        <strong>บ้าน 11 (ลาภะ):</strong><br>
                        <span class="badge badge-${result.incomeLevel === 'high' ? 'success' : result.incomeLevel === 'medium' ? 'warning' : 'danger'} p-2">
                            ${result.incomeDescription}
                        </span>
                    </p>
                </div>
            </div>

            <hr class="my-3">

            <div class="row">
                <div class="col-md-6">
                    <h5 class="text-gold">✨ ลักษณะบุคลิก</h5>
                    <p class="small text-muted">${result.character}</p>
                </div>
                <div class="col-md-6">
                    <h5 class="text-warning">⚠️ คำเตือน</h5>
                    <p class="small text-muted">${result.riskWarning}</p>
                </div>
            </div>

            <hr class="my-3">

            <div class="row">
                <div class="col-md-6">
                    <h5 class="text-gold">👨‍💼 อาชีพเหมาะสม</h5>
                    <ul class="list-unstyled small">
                        ${result.careers.map(c => `<li>✓ ${c}</li>`).join('')}
                    </ul>
                </div>
                <div class="col-md-6">
                    <h5 class="text-gold">💎 สิ่งที่ลงทุนได้ (ธาตุ${result.elementType})</h5>
                    <p class="small text-success"><strong>✅ ลงทุนได้:</strong></p>
                    <ul class="list-unstyled small">
                        ${result.investmentGood.map(i => `<li>• ${i}</li>`).join('')}
                    </ul>
                    <p class="small text-danger mt-2"><strong>❌ หลีกเลี่ยง:</strong></p>
                    <ul class="list-unstyled small">
                        ${result.investmentAvoid.map(i => `<li>• ${i}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

/**
 * 🎯 Display Business Fortune (สำหรับ onchange จาก HTML form)
 * รองรับทั้ง:
 * 1. businessBirthday (date input) + businessBirthTime (time input optional) - ใหม่
 * 2. businessZodiac + businessYear - เดิม (legacy)
 */
function displayBusinessFortune() {
    const birthdayEl = document.getElementById('businessBirthday');
    const birthTimeEl = document.getElementById('businessBirthTime');
    const zodiacEl = document.getElementById('businessZodiac');
    const yearEl = document.getElementById('businessYear');
    const resultEl = document.getElementById('businessResult');

    let birthDateInput, birthTimeInput;

    // ลองใช้ date input ก่อน (ใหม่)
    if (birthdayEl && birthdayEl.value) {
        birthDateInput = birthdayEl.value; // YYYY-MM-DD
        birthTimeInput = birthTimeEl && birthTimeEl.value ? birthTimeEl.value : null; // HH:MM
    } else if (zodiacEl && zodiacEl.value && yearEl && yearEl.value) {
        // fallback: ใช้ zodiac + year (เดิม)
        const zodiacMap = {
            "rat": "จันทร์",        // หนู
            "ox": "อาทิตย์",        // วัว
            "tiger": "อังคาร",      // เสือ
            "rabbit": "จันทร์",     // กระต่าย
            "dragon": "อาทิตย์",    // มังกร
            "snake": "ศุกร์",       // งู
            "horse": "อังคาร",      // ม้า
            "goat": "อาทิตย์",      // แพะ
            "monkey": "พุธ",        // ลิง
            "rooster": "พฤหัสบดี", // ไก่
            "dog": "อังคาร",        // สุนัข
            "pig": "จันทร์"         // หมู
        };

        const dayName = zodiacMap[zodiacEl.value] || "อาทิตย์";
        birthDateInput = dayName;
        birthTimeInput = parseInt(yearEl.value);
    } else {
        alert('⚠️ กรุณาป้อนวันเกิดและเวลาเกิด หรือเลือกปีนักษัตร');
        return;
    }

    // คำนวณผลลัพธ์
    const result = calculateBusinessFortune(birthDateInput, birthTimeInput);

    // แสดงผล
    if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = `
            <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
                <div class="alert alert-info small">
                    <strong>📊 วิเคราะห์:</strong> ${result.explanation}
                </div>

                <div class="row mt-3">
                    <div class="col-md-6">
                        <h5 class="text-gold">💼 ดวงธุรกิจ</h5>
                        <p class="mb-2">
                            <strong>ดาว:</strong> ${result.planetName}<br>
                            <strong>ธุรกิจ:</strong> ${'⭐'.repeat(result.businessRating)}<br>
                            <strong>การเงิน:</strong> ${'⭐'.repeat(result.financeRating)}
                        </p>
                        <p class="text-muted small">${result.summary}</p>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-gold">💰 ระดับรายได้</h5>
                        <p class="mb-2">
                            <strong>บ้าน 11 (ลาภะ):</strong><br>
                            <span class="badge badge-${result.incomeLevel === 'high' ? 'success' : result.incomeLevel === 'medium' ? 'warning' : 'danger'} p-2">
                                ${result.incomeDescription}
                            </span>
                        </p>
                    </div>
                </div>

                <hr class="my-3">

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-gold">✨ ลักษณะบุคลิก</h5>
                        <p class="small text-muted">${result.character}</p>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-warning">⚠️ คำเตือน</h5>
                        <p class="small text-muted">${result.riskWarning}</p>
                    </div>
                </div>

                <hr class="my-3">

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-gold">👨‍💼 อาชีพเหมาะสม</h5>
                        <ul class="list-unstyled small">
                            ${result.careers.map(c => `<li>✓ ${c}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-gold">💎 สิ่งที่ลงทุนได้ (ธาตุ${result.elementType})</h5>
                        <p class="small text-success"><strong>✅ ลงทุนได้:</strong></p>
                        <ul class="list-unstyled small">
                            ${result.investmentGood.map(i => `<li>• ${i}</li>`).join('')}
                        </ul>
                        <p class="small text-danger mt-2"><strong>❌ หลีกเลี่ยง:</strong></p>
                        <ul class="list-unstyled small">
                            ${result.investmentAvoid.map(i => `<li>• ${i}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showBusinessFortune();
});

window.calculateAndShowBusiness = calculateAndShowBusiness;
window.displayBusinessFortune = displayBusinessFortune;
