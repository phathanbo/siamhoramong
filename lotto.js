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
    "อาทิตย์": 1,   // อาทิตย์ = 1
    "จันทร์": 2,     // จันทร์ = 2
    "อังคาร": 9,     // อังคาร = 9
    "พุธ": 5,        // พุธ = 5
    "พฤหัสบดี": 3,   // พฤหัสบดี = 3
    "ศุกร์": 6,      // ศุกร์ = 6
    "เสาร์": 8       // เสาร์ = 8
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
    let yearAD = birthYear;
    if (birthYear > 2400) {
        yearAD = birthYear - 543; // พ.ศ. → ค.ศ.
    }

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
 * คำนวณ sum ของชื่อ (อิงจาก namesdb.js)
 * ใช้ตัวหนังสือไทยแปลงเป็นตัวเลข 1-9
 */
function calculateNameSum(name) {
    if (!name) return 0;

    // ตัวหนังสือไทยแปลงเป็นตัวเลข (Unicode ไทย)
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        const code = name.charCodeAt(i);
        // ตัวหนังสือไทย Unicode 0x0E00 - 0x0E7F
        if (code >= 0x0E00 && code <= 0x0E7F) {
            sum += (code - 0x0E00) % 9 + 1;
        } else if (/[0-9]/.test(name[i])) {
            sum += parseInt(name[i]) || 1;
        }
    }

    // ลดให้เหลือหลักเดียว (Numerology)
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
    const dayName = thaiDays[birthDate.getDay()];

    const userName = userNameEl.value || "ไม่ระบุ";

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
                        <div class="form-group">
                            <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                            <input type="date" id="lottoBirthday" class="form-control form-control-lg" required>
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

document.addEventListener("DOMContentLoaded", () => {
    showlotto();
});

window.saveAscendantImage = function() {
    const captureArea = document.getElementById('ascResult');
    if (!captureArea || captureArea.style.display === 'none') {
        alert("คำนวณก่อนเซฟครับประธาน!");
        return;
    }

    // สั่งเซฟด้วยการ "จำลอง" ขนาดใหม่
    html2canvas(captureArea, {
        backgroundColor: '#0a0a0a',
        scale: 2, // เพิ่มความชัด x2
        logging: false,
        onclone: (clonedDoc) => {
            // --- 💡 ความลับอยู่ตรงนี้ครับประธาน ---
            const clonedElement = clonedDoc.getElementById('ascResult');
            
            // บังคับขนาดในรูปเซฟให้เป็น 1080px (ขนาดมาตรฐาน Facebook/Instagram)
            clonedElement.style.width = '1080px';
            clonedElement.style.maxWidth = 'none'; 
            clonedElement.style.padding = '40px'; // เพิ่มขอบให้รูปดูแพง
            
            // ปรับตัวหนังสือในรูปให้ใหญ่ขึ้นนิดนึงตอนเซฟ จะได้อ่านในเฟสง่าย
            clonedElement.style.fontSize = '20px'; 
            
            // แอบเติมลายน้ำหรือเครดิตแอปในรูปเซฟ (โผล่เฉพาะในรูป)
            const footer = clonedDoc.createElement('div');
            footer.innerHTML = '<center><p style="color:#d4af37; margin-top:20px; font-size:18px;">✨ สยามโหรามงคล - พยากรณ์ดวงชะตาแม่นยำ ✨</p></center>';
            clonedElement.appendChild(footer);
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ดวงชะตา_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        console.log("📸 เซฟรูปขนาด Facebook Standard เรียบร้อย!");
    });
};

// 3. ฟังก์ชันบันทึกภาพ
function downloadLottoResult() {
    const area = document.getElementById('lottoCaptureArea');
    if (!area) return alert("คำนวณเลขก่อนครับประธาน");

    html2canvas(area, {
        backgroundColor: null, // ปล่อยเป็นใสเพื่อให้ Background ที่เราตั้งใน clone ทำงาน
        scale: 2,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('lottoCaptureArea');
            
            // --- 🎨 แต่งองค์ทรงเครื่องให้ภาพเซฟ ---
            el.style.width = '600px';
            el.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'; // พื้นหลังกาแล็กซี่ทางช้างเผือก
            el.style.border = '5px double #d4af37'; // ขอบทองสองชั้นแบบยันต์
            el.style.borderRadius = '20px';
            el.style.padding = '40px';
            el.style.color = '#fff';
            el.style.boxShadow = 'inset 0 0 50px rgba(212, 175, 55, 0.3)'; // แสงสีทองเรืองๆ ด้านใน

            // ปรับแต่งหัวข้อ
            const title = el.querySelector('h4');
            if(title) {
                title.style.fontSize = '32px';
                title.style.textShadow = '2px 2px 4px #000';
                title.style.color = '#ffd700';
                title.innerHTML = `✨ ${title.innerText} ✨`;
            }

            // ปรับแต่งตัวเลขเด่น (ทำให้ดูเหมือนลูกบอลทองคำ)
            const mainNum = el.querySelector('.text-danger');
            if(mainNum) {
                mainNum.style.fontSize = '80px';
                mainNum.style.color = '#fff';
                mainNum.style.textShadow = '0 0 20px #ff0000, 0 0 30px #ff0000';
                mainNum.style.margin = '20px 0';
            }

            // เพิ่มเครดิตแบบหรูๆ
            const footer = clonedDoc.createElement('div');
            footer.style.marginTop = '30px';
            footer.style.borderTop = '1px solid #d4af37';
            footer.style.paddingTop = '15px';
            footer.style.fontSize = '14px';
            footer.style.color = '#d4af37';
            footer.style.textAlign = 'center';
            footer.style.letterSpacing = '2px';
            footer.innerHTML = '⚜️ สยามโหรามงคล ⚜️';
            el.appendChild(footer);
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `เลขมงคล_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}