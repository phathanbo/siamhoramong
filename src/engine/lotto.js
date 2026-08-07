/**
 * 🎰 เลขมงคล (Lucky Numbers) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ลัคนา (ดาว 9 ดวง): thai-astrology.js
 * - เลขศาสตร์ (ผลรวมชื่อ): namesdb.js
 * - เลข 7 ตัว (ฐาน 4): sevenDigits.js
 * - ธาตุ 5: element.js
 *
 * วิธีคำนวณ:
 * 1. ใช้วันเกิด → หาดาวเกิด (ดาว 9 ดวง)
 * 2. ใช้ชื่อ → หา sum ของชื่อ (เลขศาสตร์)
 * 3. รวม ดาว + ชื่อ + ธาตุ → ได้เลขเด่น
 * 4. เลขรอง: ใช้บ้านเกี่ยวโชค (บ้าน 2, 8, 11 = ลาภะ)
 * 5. เลขกัน: ธาตุที่ขัดแย้ง
 */

"use strict";

// ตารางดาว 9 ดวงตามวันเกิด (อิงจาก thai-astrology.js)
const PLANET_NUMBERS = {
    "อาทิตย์": 1,     // อาทิตย์ = 1
    "จันทร์": 2,       // จันทร์ = 2
    "อังคาร": 3,       // อังคาร = 3 (ตรงตามตำราทักษาปกรณ์)
    "พุธ": 4,          // พุธกลางวัน = 4 (ตรงตามตำราทักษาปกรณ์)
    "พุธกลางคืน": 8,   // พุธกลางคืน (ราหู) = 8 (ตรงตามตำราทักษาปกรณ์)
    "พฤหัสบดี": 5,     // พฤหัสบดี = 5 (ตรงตามตำราทักษาปกรณ์)
    "ศุกร์": 6,        // ศุกร์ = 6
    "เสาร์": 7,        // เสาร์ = 7 (ตรงตามตำราทักษาปกรณ์)
    "ราหู": 8,         // ราหู = 8
    "เกตุ": 9          // เกตุ = 9
};

// ตารางธาตุ 5 ประการ (อิงจาก element.js)
const ELEMENT_NUMBERS = {
    "ไม้": { number: 3, opposite: "โลหะ" },
    "ไฟ": { number: 9, opposite: "น้ำ" },
    "ดิน": { number: 5, opposite: "ดิน" },
    "โลหะ": { number: 7, opposite: "ไม้" },
    "น้ำ": { number: 1, opposite: "ไฟ" }
};

/**
 * 🐭 ปีนักษัตร 12 ปี + ธาตุ 5 ประการที่เกี่ยวข้อง
 * อ้างอิง: Chinese Zodiac + 5 Elements (ในหลักโหราศาสตร์เทพเจ้า)
 */
const ZODIAC_ANIMAL_ELEMENT = {
    0: { animal: "หนู (Rat)", element: "น้ำ", number: 1 },
    1: { animal: "วัว (Ox)", element: "ดิน", number: 5 },
    2: { animal: "เสือ (Tiger)", element: "ไม้", number: 3 },
    3: { animal: "กระต่าย (Rabbit)", element: "ไม้", number: 3 },
    4: { animal: "มังกร (Dragon)", element: "ดิน", number: 5 },
    5: { animal: "งู (Snake)", element: "ไฟ", number: 9 },
    6: { animal: "ม้า (Horse)", element: "ไฟ", number: 9 },
    7: { animal: "แพะ (Goat)", element: "ดิน", number: 5 },
    8: { animal: "ลิง (Monkey)", element: "โลหะ", number: 7 },
    9: { animal: "ไก่ (Rooster)", element: "โลหะ", number: 7 },
    10: { animal: "สุนัข (Dog)", element: "ดิน", number: 5 },
    11: { animal: "หมู (Pig)", element: "น้ำ", number: 1 }
};

/**
 * หาปฏิทินหวยออก (ตามปฏิทินจริงของประเทศไทย)
 * งวด 1: 1-16 มีนาคม / 1-15 เดือนอื่น
 * งวด 2: 16-31 มีนาคม / 16-30 เดือนอื่น
 */
function getNextLottoDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    let target;
    if (day < 16) {
        target = new Date(year, month, 16);
    } else {
        target = new Date(year, month + 1, 1);
    }

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    return {
        date: target.getDate(),
        month: target.getMonth() + 1,
        year: target.getFullYear(),
        fullDate: `${target.getDate()} ${thaiMonths[target.getMonth()]} ${target.getFullYear() + 543}`,
        dayName: thaiDays[target.getDay()]
    };
}

/**
 * 🐭 คำนวณปีนักษัตร จากปีเกิด
 * สูตรที่ถูกต้อง: (ปีค.ศ. - 1900) % 12
 * ตัวอย่าง:
 * - 1995 → (1995 - 1900) % 12 = 95 % 12 = 11 → หมู ✓
 * - 1992 → (1992 - 1900) % 12 = 92 % 12 = 8 → ลิง ✓
 * - 2000 → (2000 - 1900) % 12 = 100 % 12 = 4 → มังกร ✓
 */
function calculateZodiacAnimal(birthYear) {
    // ถ้า input เป็น พ.ศ. → แปลงเป็น ค.ศ.
    const yearAD = typeof toCE === 'function' ? toCE(birthYear) : (birthYear > 2400 ? birthYear - 543 : birthYear);

    const zodiacIndex = (yearAD - 1900) % 12;
    return ZODIAC_ANIMAL_ELEMENT[zodiacIndex];
}

/**
 * 🎯 คำนวณเลขมงคล - อิงลัคนา + ชื่อ + ธาตุ (จากปีนักษัตร)
 *
 * สูตร:
 * 1. เลขเด่น = (ดาว 9 + sum ชื่อ + ธาตุ) % 10
 * 2. เลขรอง = (บ้าน 11 = ลาภะ + เดือน) % 10
 * 3. เลขกัน = ธาตุตรงข้าม
 */
function calculateMainNumbers(birthDay, userName, birthYear) {
    const next = getNextLottoDate();

    // 1️⃣ ดาวเกิดจากวันเกิด (อิง thai-astrology.js)
    const planetNum = PLANET_NUMBERS[birthDay] || 1;

    // 2️⃣ Sum ของชื่อ (อิง namesdb.js)
    let nameSum = 0;
    if (userName) {
        nameSum = calculateNameSum(userName);
    }

    // 3️⃣ ธาตุประจำปี (จากปีนักษัตร Chinese Zodiac)
    let elementNum = 5; // default ดิน
    let elementType = "ดิน";
    let zodiacInfo = null;

    if (birthYear) {
        zodiacInfo = calculateZodiacAnimal(birthYear);
        if (zodiacInfo && ELEMENT_NUMBERS[zodiacInfo.element]) {
            elementType = zodiacInfo.element;
            elementNum = ELEMENT_NUMBERS[elementType].number;
        }
    }

    // 4️⃣ คำนวณเลขเด่น
    let main = (planetNum + nameSum + elementNum) % 10;

    // 5️⃣ เลขรอง = บ้าน 11 (ลาภะ = เลขพยากรณ์ลาภ) + เดือน
    let secondary = (11 + next.month) % 10;

    // ถ้าซ้ำกัน ให้ปรับหนี
    if (secondary === main) {
        secondary = (secondary + 1) % 10;
    }

    // 6️⃣ เลขกัน = ธาตุตรงข้าม
    const oppositeElement = ELEMENT_NUMBERS[elementType].opposite;
    const forbidden = ELEMENT_NUMBERS[oppositeElement].number;

    return {
        main,
        secondary,
        forbidden,
        planetNum,
        nameSum,
        elementNum,
        elementType,
        zodiacInfo,
        explanation: `ดาว=${planetNum} + ชื่อ=${nameSum} + ธาตุ=${elementNum} = เด่น ${main}`
    };
}

/**
 * คำนวณ sum ของชื่อ (อิงจากหลักทักษาอักษรไทย / เลขศาสตร์คชาปกรณ์มาตรฐาน)
 * เชื่อมโยงกับตาราง NameAnalysis.alphabetValues เพื่อความแม่นยำ 100%
 */
function calculateNameSum(name) {
    if (!name) return 0;

    // ตารางค่าอักษรเลขศาสตร์ไทยมาตรฐาน (คชาปกรณ์ / ทักษาอักษร จาก nameAnalysis.js)
    const ALPHABET_VALUES = {
        // ค่าตัวเลข 1 (อาทิตย์)
        'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ส': 1, 'า': 1, 'ำ': 1, 'ุ': 1,
        // ค่าตัวเลข 2 (จันทร์)
        'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2, 'ู': 2,
        // ค่าตัวเลข 3 (อังคาร)
        'ฆ': 3, 'ต': 3, 'ฑ': 3, 'ฒ': 3,
        // ค่าตัวเลข 4 (พุธ)
        'ค': 4, 'ธ': 4, 'ญ': 4, 'ร': 4, 'ะ': 4,
        // ค่าตัวเลข 5 (พฤหัสบดี)
        'ฉ': 5, 'ฌ': 5, 'ฎ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
        // ค่าตัวเลข 6 (ศุกร์)
        'จ': 6, 'ล': 6, 'ว': 6, 'ใ': 6,
        // ค่าตัวเลข 7 (เสาร์)
        'ซ': 7, 'ศ': 7, 'ษ': 7, 'ี': 7, 'ื': 7, 'เ': 7, 'แ': 7,
        // ค่าตัวเลข 8 (ราหู)
        'ย': 8, 'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8, 'ึ': 8, '็': 8,
        // ค่าตัวเลข 9 (เกตุ)
        'ฏ': 9, 'ฐ': 9, 'ไ': 9, 'โ': 9, 'อ': 9, '์': 9, 'ิ': 9
    };

    let sum = 0;
    // ถ้าในระบบโหลด NameAnalysis อยู่ ให้เรียกใช้เพื่อ Single Source of Truth
    if (typeof NameAnalysis !== 'undefined' && typeof NameAnalysis.calculate === 'function') {
        sum = NameAnalysis.calculate(name);
    } else {
        // คำนวณตามตารางมาตรฐาน
        for (let char of name) {
            sum += ALPHABET_VALUES[char] || 0;
            if (/[0-9]/.test(char)) {
                sum += parseInt(char) || 0;
            }
        }
    }

    // ลดให้เหลือหลักเดียวตามหลักเลขศาสตร์ดาวนพเคราะห์ (1-9)
    while (sum > 9) {
        sum = Math.floor(sum / 10) + (sum % 10);
    }

    return sum || 1;
}

// (ฟังก์ชัน generateTwoDigits และ generateThreeDigits คงเดิมตามที่ประธานเขียน)
// สุ่มเลข 2 ตัว (ห้ามซ้ำ, ห้ามมีเลขกัน)
function generateTwoDigits(main, secondary, forbidden, count = 6) {
    const nums = [];
    while (nums.length < count) {
        const d1 = Math.random() < 0.5 ? main : secondary;
        let d2 = Math.floor(Math.random() * 10);

        // 🛡️ ถ้าหลักที่ 2 ไปตรงกับเลขกัน ให้สุ่มใหม่จนกว่าจะไม่ตรง
        while (d2 === forbidden) {
            d2 = Math.floor(Math.random() * 10);
        }

        const num = `${d1}${d2}`;
        const rev = `${d2}${d1}`;

        if (!nums.includes(num) && !nums.includes(rev)) {
            nums.push(num);
        }
    }
    return nums;
}

// สุ่มเลข 3 ตัว (ห้ามซ้ำ, ห้ามมีเลขกันในทุกหลัก)
function generateThreeDigits(main, secondary, forbidden, count = 6) {
    const nums = [];
    while (nums.length < count) {
        const d1 = Math.random() < 0.5 ? main : secondary;
        let d2 = Math.floor(Math.random() * 10);
        let d3 = Math.floor(Math.random() * 10);

        // 🛡️ เช็กหลักที่ 2 และ 3 ถ้าตรงกับเลขกัน ให้สุ่มใหม่ทันที
        while (d2 === forbidden) d2 = Math.floor(Math.random() * 10);
        while (d3 === forbidden) d3 = Math.floor(Math.random() * 10);

        const num = `${d1}${d2}${d3}`;

        if (!nums.includes(num)) {
            nums.push(num);
        }
    }
    return nums;
}

/**
 * 🎯 สร้างเลขมงคล
 * Input: วันเกิด (date) + ชื่อ
 * Compute: ธาตุประจำปี (จากปีนักษัตร)
 */
/**
 * 🎯 สร้างเลขมงคลจาก array ของตัวเลข (สำหรับ lucky.js)
 */
function generateLuckyNumberFromArray(baseNumbers) {
    if (!baseNumbers || baseNumbers.length === 0) {
        return "ไม่มีข้อมูล";
    }

    // สุ่มเลข 1 ตัวจาก baseNumbers
    const randomIndex = Math.floor(Math.random() * baseNumbers.length);
    const selected = baseNumbers[randomIndex];

    // ถ้าเป็น 2 ตัวเลข ให้ add digit
    if (selected.length === 1) {
        const digit = Math.floor(Math.random() * 10);
        return `${selected}${digit}`;
    }

    return selected;
}

/**
 * 🎰 เลขมงคล - เมื่อผู้ใช้กรอกข้อมูลในหน้า lottoPage
 */
function generateLuckyNumbers() {
    const birthdayEl = document.getElementById("lottoBirthday");
    const userNameEl = document.getElementById("lottoUserName") || { value: "" };

    // ตรวจสอบว่า element มีอยู่
    if (!birthdayEl) {
        console.warn('❌ Element #lottoBirthday ไม่พบ');
        return;
    }

    // แยก date input
    const birthDate = new Date(birthdayEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();

    // คำนวณวันในสัปดาห์ → ชื่อเป็นภาษาไทย
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    let dayName = thaiDays[birthDate.getDay()];

    // ตรวจสอบตัวเลือกพุธกลางคืน (ราหู = 8)
    const wedNightEl = document.getElementById("lottoIsWednesdayNight");
    if (dayName === "พุธ" && wedNightEl && wedNightEl.checked) {
        dayName = "พุธกลางคืน";
    }

    // ป้องกัน XSS โดยแปลงอักขระพิเศษก่อนนำไปใส่ innerHTML
    const rawUserName = userNameEl.value || "ไม่ระบุ";
    const userName = typeof escapeHTML === 'function' ? escapeHTML(rawUserName) : rawUserName;

    const next = getNextLottoDate();
    const calc = calculateMainNumbers(dayName, userName, birthYear);
    const twoDigits = generateTwoDigits(calc.main, calc.secondary, calc.forbidden, 6);
    const threeDigits = generateThreeDigits(calc.main, calc.secondary, calc.forbidden, 6);

    // สร้าง HTML แสดงผลพร้อมอธิบาย
    const zodiacDisplay = calc.zodiacInfo ? `${calc.zodiacInfo.animal} (${calc.zodiacInfo.element})` : "ไม่สามารถคำนวณ";

    const html = `
    <div id="lottoCaptureArea" class="card shadow mt-4 border-0 p-4 bg-white">
        <div class="card-body">
            <h4 class="text-gold text-center">🔮 วิเคราะห์เลขมงคล</h4>

            <div class="alert alert-info small mt-3">
                <strong>📊 ข้อมูลที่ใช้:</strong><br>
                ✓ วันเกิด: <strong>${birthDay}/${birthMonth}/${birthYear}</strong> (${dayName} = ดาว${calc.planetNum})<br>
                ✓ ชื่อ: <strong>${userName}</strong> (Sum = ${calc.nameSum})<br>
                ✓ ปีเกิด: <strong>${birthYear}</strong> (นักษัตร: ${zodiacDisplay})<br>
                ✓ ธาตุประจำปี: <strong>${calc.elementType}</strong> (ธาตุ = ${calc.elementNum})<br>
                <hr class="my-2">
                <strong>📐 สูตร:</strong> ${calc.explanation}
            </div>

            <hr>
            <h5 class="text-center text-gold">📅 งวด ${next.fullDate} (วัน${next.dayName})</h5>
            <hr>

            <div class="row mt-3">
                <div class="col-4 text-center">
                    <h6 class="text-gold">⭐ เด่น</h6>
                    <h2 class="text-success" style="font-weight: bold;">${calc.main}</h2>
                    <small class="text-muted">(จำหน่วย)</small>
                </div>
                <div class="col-4 text-center">
                    <h6 class="text-gold">✨ รอง</h6>
                    <h2 style="color: #ffc107; font-weight: bold;">${calc.secondary}</h2>
                    <small class="text-muted">(เลขกลาง)</small>
                </div>
                <div class="col-4 text-center">
                    <h6 style="color: #dc3545;">⚠️ กัน</h6>
                    <h2 style="color: #dc3545; font-weight: bold;">${calc.forbidden}</h2>
                    <small class="text-muted">(หลีกเลี่ยง)</small>
                </div>
            </div>

            <hr>
            <h5 class="mt-4 text-gold text-center">🎯 เลขเสี่ยงทายแนะนำ 2 ตัว</h5>
            <div class="text-center" style="font-size: 1.3rem; color: #0066cc; font-weight: bold;">
                ${twoDigits.join(" &nbsp; &nbsp; ")}
            </div>

            <h5 class="mt-4 text-gold text-center">🎯 เลขเสี่ยงทายแนะนำ 3 ตัว</h5>
            <div class="text-center" style="font-size: 1.3rem; color: #28a745; font-weight: bold;">
                ${threeDigits.join(" &nbsp; &nbsp; ")}
            </div>

            <div class="alert alert-warning small mt-3">
                <strong>⚡ สำคัญ:</strong> เลขนี้มีพื้นฐานมาจากลัคนา ชื่อ และธาตุประจำปี<br>
                เป็นการวิเคราะห์เชิงศาสตร์ ไม่ใช่การรับประกัน
            </div>
        </div>
    </div><br>
    <div class="text-center">
        <button class="btn btn-gold" onclick="downloadLottoResult()">🔮 บันทึกเป็นรูปภาพ</button>
    </div>
    `;

    document.getElementById("lottoResult").innerHTML = html;
}

function showlotto(){
    const contioner = document.getElementById("lottoResultpage")

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🎰 หอคำนวณเลขมงคล</h2>
                <span class="text-white-50 mb-0 small">✨ อิงจากลัคนา ชื่อ และธาตุประจำปี</span>
            </div>
            <div class="card-body bg-light">
                <div class="py-4" id="beforeGenerate">
                    <div class="text-center mb-4">
                        <i class="fas fa-dice-d20 fa-5x text-gold mb-3 animate__animated animate__infinite animate__pulse"></i>
                        <h4 style="color: #000;">วิเคราะห์เลขมงคลด้วยหลักโหรา</h4>
                        <p class="text-muted small">ระบบใช้ลัคนา (ดาวเกิด) + ชื่อ (เลขศาสตร์) + ธาตุประจำปี</p>
                    </div>

                    <form onsubmit="return false;">
                        <div class="form-group mb-3">
                            <label class="text-gold"><strong>👤 เลือกสมาชิกจากประวัติ:</strong></label>
                            <select class="form-control bg-black text-black border-gold member-selector-shared"
                                onchange="autoFillMemberData(this.value); setTimeout(generateLuckyNumbers, 300)">
                                <option value="">-- เลือกสมาชิก --</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                            <input type="date" id="lottoBirthday" class="form-control form-control-lg" required>
                            <div class="custom-control custom-checkbox mt-2">
                                <input type="checkbox" class="custom-control-input" id="lottoIsWednesdayNight">
                                <label class="custom-control-label text-dark small" for="lottoIsWednesdayNight">🌌 เกิดวันพุธกลางคืน (หลัง 18:00 น. - นับเป็นดาวราหู เลข 8)</label>
                            </div>
                            <small class="text-muted">วันเกิด = คำนวณดาว 9 + ปีเกิด = ปีนักษัตร + ธาตุ</small>
                        </div>

                        <div class="form-group">
                            <label class="text-gold"><strong>📝 ชื่อของคุณ <span class="text-danger">*</span></strong></label>
                            <input type="text" id="lottoUserName" class="form-control form-control-lg" placeholder="ใส่ชื่อจริง (ที่ใช้อยู่)" required>
                            <small class="text-muted">เช่น สมหญิง, สมชาย, อนิรุธ ฯลฯ</small>
                        </div>

                        <div class="alert alert-secondary small">
                            <strong>🐭 ระบบคำนวณอัตโนมัติ:</strong><br>
                            ✓ ธาตุประจำปี = คำนวณจากปีนักษัตร (Chinese Zodiac)<br>
                            ✓ ตัวอย่าง: หนู/หมู=น้ำ, วัว/มังกร/แพะ/สุนัข=ดิน, เสือ/กระต่าย=ไม้, งู/ม้า=ไฟ, ลิง/ไก่=โลหะ
                        </div>

                        <button type="button" class="btn btn-gold btn-lg btn-block mt-4" onclick="generateLuckyNumbers()">
                            <i class="fas fa-wand-magic-sparkles"></i> คำนวณเลขมงคล
                        </button>
                    </form>
                </div>

                <div id="lottoResult" class="mt-3"></div>

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
    contioner.innerHTML = html;
}

if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        showlotto();
    });
}

if (typeof window !== 'undefined') {
    window.saveAscendantImage = async function() {
    const captureArea = document.getElementById('ascResult');
    if (!captureArea || captureArea.style.display === 'none') {
        Swal.fire('แจ้งเตือน', 'คำนวณก่อนเซฟครับประธาน!', 'warning');
        return;
    }
    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        const texts = captureArea.innerText.split('\n').filter(t => t.trim());
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        let y = 60;
        texts.forEach((line, idx) => {
            ctx.font = idx === 0 ? 'bold 50px "Sarabun", sans-serif' : '34px "Sarabun", sans-serif';
            ctx.fillStyle = idx === 0 ? '#d4af37' : '#ffffff';
            ctx.fillText(line, canvas.width / 2, y);
            y += idx === 0 ? 80 : 60;
        });
        ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.font = '28px "Sarabun", sans-serif';
        ctx.fillText('✨ สยามโหรามงคล - พยากรณ์ดวงชะตาแม่นยำ ✨', canvas.width / 2, canvas.height - 80);
        const link = document.createElement('a');
        link.download = `ดวงชะตา_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch(e) {
        console.error('Canvas Error:', e);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเซฟภาพได้', 'error');
    }
};
}

// 3. ฟังก์ชันบันทึกภาพ
if (typeof window !== 'undefined') {
    window.downloadLottoResult = async function() {
    const area = document.getElementById('lottoCaptureArea');
    if (!area) { Swal.fire('แจ้งเตือน', 'คำนวณเลขก่อนครับประธาน', 'warning'); return; }
    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        // Galaxy background
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0f0c29');
        grad.addColorStop(0.5, '#302b63');
        grad.addColorStop(1, '#24243e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Double gold border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.lineWidth = 3;
        ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

        // Inner glow
        const glowGrad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
        glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Header
        ctx.font = 'bold 72px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('✨ วิเคราะห์เลขมงคล ✨', canvas.width / 2, 60);

        // Get data from the rendered area
        const calcEl = area.querySelector('.alert-info');
        const calcText = calcEl?.innerText || '';
        ctx.font = '30px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(calcText.split('\n')[1] || '', canvas.width / 2, 160);

        // Main / Secondary / Forbidden numbers
        const h2s = area.querySelectorAll('h2');
        const mainNum = h2s[0]?.innerText || '?';
        const secNum = h2s[1]?.innerText || '?';
        const forbNum = h2s[2]?.innerText || '?';

        const drawNumBox = (num, label, color, x, y, w) => {
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.beginPath();
            ctx.roundRect(x - w/2, y - 10, w, 180, 20);
            ctx.fill();
            ctx.font = 'bold 120px "Sarabun", sans-serif';
            ctx.fillStyle = color;
            ctx.fillText(num, x, y);
            ctx.font = 'bold 30px "Sarabun", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(label, x, y + 145);
        };

        drawNumBox(mainNum,  '⭐ เด่น',   '#00e676', canvas.width * 0.2, 230, 250);
        drawNumBox(secNum,   '✨ รอง',    '#ffc107', canvas.width * 0.5, 230, 250);
        drawNumBox(forbNum,  '⚠️ กัน',   '#ff5252', canvas.width * 0.8, 230, 250);

        // Divider
        ctx.strokeStyle = 'rgba(212,175,55,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(80, 460); ctx.lineTo(canvas.width - 80, 460); ctx.stroke();

        // 2-digit numbers
        const twoDigitEl = area.querySelectorAll('.text-center')[2];
        const twoDigits = twoDigitEl?.innerText?.trim() || '';
        ctx.font = 'bold 40px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('🎯 เลขแนะนำ 2 ตัว', canvas.width / 2, 490);
        ctx.font = 'bold 60px "Sarabun", sans-serif';
        ctx.fillStyle = '#4fc3f7';
        ctx.fillText(twoDigits, canvas.width / 2, 550);

        // 3-digit numbers
        const threeDigitEl = area.querySelectorAll('.text-center')[3];
        const threeDigits = threeDigitEl?.innerText?.trim() || '';
        ctx.font = 'bold 40px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('🎯 เลขแนะนำ 3 ตัว', canvas.width / 2, 660);
        ctx.font = 'bold 60px "Sarabun", sans-serif';
        ctx.fillStyle = '#69f0ae';
        ctx.fillText(threeDigits, canvas.width / 2, 720);

        // Footer
        ctx.strokeStyle = 'rgba(212,175,55,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(80, 860); ctx.lineTo(canvas.width - 80, 860); ctx.stroke();
        ctx.font = '32px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('⚜️ สยามโหรามงคล ⚜️', canvas.width / 2, 890);

        const link = document.createElement('a');
        link.download = `เลขมงคล_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch(e) {
        console.error('Canvas Error:', e);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
};
}

// Global exports for testing and module usage
if (typeof window !== 'undefined') {
    window.PLANET_NUMBERS = PLANET_NUMBERS;
    window.calculateNameSum = calculateNameSum;
    window.calculateMainNumbers = calculateMainNumbers;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLANET_NUMBERS, calculateNameSum, calculateMainNumbers };
}