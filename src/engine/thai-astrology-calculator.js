/**
 * 🌟 Thai Astrology Calculator - Logic
 * อ้างอิง: thai-astrology-data.js
 */

"use strict";

// ข้อความพยากรณ์
const FORTUNE_TEXTS = {
    love: {
        good: "ความรักพูดเจอ เสน่ห์แรง มีโอกาสพบปะคนสำคัญ เหมาะสำหรับแต่งงานและทำสัญญา",
        medium: "ความรักปกติ มีความเข้าใจดี เหมาะสำหรับพัฒนาความสัมพันธ์ต่อไป",
        bad: "อารมณ์ไม่เสถียร ต้องระวังการเข้าใจผิด ควรสื่อสารให้ชัดเจน"
    },
    career: {
        good: "อาชีพก้าวหน้า โอกาสส่วนราชการ การค้า การจ้างงาน มีบสมและความสำเร็จ",
        medium: "อาชีพปกติ มีความก้าวหน้าค่อยเป็นค่อยไป ต้องหมั่นเพียร",
        bad: "อาชีพมีปัญหา ควรระวังการเปลี่ยนแปลง อดทนและหาทางแก้ไข"
    },
    finance: {
        good: "รายได้สูง มีโอกาสสำเร็จ เหมาะสำหรับการลงทุน ธุรกิจเจริญรุ่งเรือง",
        medium: "รายได้ปกติ สามารถออม ค่อยๆ สะสมทรัพย์",
        bad: "ต้องระมัดระวังรายจ่าย ไม่ควรลงทุนเสี่ยง ออมอาหารจำนวน"
    },
    health: {
        good: "สุขภาพดี พลังงานเต็มที่ ควรใช้พลังนี้ในการกีฬาและกิจกรรม",
        medium: "สุขภาพปกติ ควรดูแลตามสมควร ออกกำลังกายสม่ำเสมอ",
        bad: "ต้องระวังสุขภาพ เลี่ยงความเหน็ดเหนื่อย ฟื้นตัวด้วยการพักผ่อน"
    }
};

const RASSI_THAI = {
    0: { name: "ราศีเมษ", symbol: "♈" },
    1: { name: "ราศีพฤษภ", symbol: "♉" },
    2: { name: "ราศีเมถุน", symbol: "♊" },
    3: { name: "ราศีกรกฎ", symbol: "♋" },
    4: { name: "ราศีสิงห์", symbol: "♌" },
    5: { name: "ราศีกันย์", symbol: "♍" },
    6: { name: "ราศีตุลย์", symbol: "♎" },
    7: { name: "ราศีพิจิก", symbol: "♏" },
    8: { name: "ราศีธนู", symbol: "♐" },
    9: { name: "ราศีมังกร", symbol: "♑" },
    10: { name: "ราศีกุมภ์", symbol: "♒" },
    11: { name: "ราศีมีน", symbol: "♓" }
};

/**
 * 🔍 คำนวณราศีตามหลักโหราศาสตร์ไทย (นิรายนะ / สุริยยาตร์)
 * อ้างอิง: คัมภีร์สุริยยาตร์และปฏิทินโหราศาสตร์ไทย (ตัดราศีวันที่ 13-16 ของแต่ละเดือน)
 */
function getRassiIndex(month, day) {
    // ราศีเมษ: 13-14 เม.ย. - 13-14 พ.ค.
    if ((month == 4 && day >= 13) || (month == 5 && day <= 13)) return 0;
    // ราศีพฤษภ: 14 พ.ค. - 13-14 มิ.ย.
    if ((month == 5 && day >= 14) || (month == 6 && day <= 14)) return 1;
    // ราศีมิถุน: 15 มิ.ย. - 14-15 ก.ค.
    if ((month == 6 && day >= 15) || (month == 7 && day <= 15)) return 2;
    // ราศีกรกฎ: 16 ก.ค. - 16 ส.ค.
    if ((month == 7 && day >= 16) || (month == 8 && day <= 16)) return 3;
    // ราศีสิงห์: 17 ส.ค. - 16 ก.ย.
    if ((month == 8 && day >= 17) || (month == 9 && day <= 16)) return 4;
    // ราศีกันย์: 17 ก.ย. - 16 ต.ค.
    if ((month == 9 && day >= 17) || (month == 10 && day <= 16)) return 5;
    // ราศีตุลย์: 17 ต.ค. - 15 พ.ย.
    if ((month == 10 && day >= 17) || (month == 11 && day <= 15)) return 6;
    // ราศีพิจิก: 16 พ.ย. - 15 ธ.ค.
    if ((month == 11 && day >= 16) || (month == 12 && day <= 15)) return 7;
    // ราศีธนู: 16 ธ.ค. - 13-14 ม.ค.
    if ((month == 12 && day >= 16) || (month == 1 && day <= 14)) return 8;
    // ราศีมังกร: 15 ม.ค. - 12-13 ก.พ.
    if ((month == 1 && day >= 15) || (month == 2 && day <= 12)) return 9;
    // ราศีกุมภ์: 13 ก.พ. - 13-14 มี.ค.
    if ((month == 2 && day >= 13) || (month == 3 && day <= 13)) return 10;
    // ราศีมีน: 14 มี.ค. - 12-13 เม.ย.
    return 11;
}

/**
 * 🎯 คำนวณลัคนา
 */
function calculateAstrology() {
    const birthdateEl = document.getElementById('birthDate');
    const resultSection = document.getElementById('resultSection');

    if (!birthdateEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกวันเกิด', 'warning');
        return;
    }

    const birthDate = new Date(birthdateEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();
    const dayOfWeek = birthDate.getDay();

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = thaiDays[dayOfWeek];

    // คำนวณลัคนา
    const { num: planetNum, data: planetData } = ThaiAstrologyData.getPlanetByBirthDay(birthDay);
    const { index: zodiacIndex, data: zodiacData } = ThaiAstrologyData.getZodiacByYear(birthYear);
    const { index: elementIndex, data: elementData } = ThaiAstrologyData.getElementByYear(birthYear);
    const { num: houseNum, data: houseData } = ThaiAstrologyData.getHouseByMonthAndDay(birthMonth, birthDay);
    const rassiIndex = getRassiIndex(birthMonth, birthDay);
    const rassiData = RASSI_THAI[rassiIndex];

    // ระดับพยากรณ์ (ตามลัคนา)
    const fortuneLevel = (planetNum + zodiacIndex) % 3; // 0=bad, 1=medium, 2=good
    const fortuneLevels = ['bad', 'medium', 'good'];

    // ส่วนข้อมูลพื้นฐาน
    document.getElementById('zodiacInfo').textContent =
        `${zodiacData.animal} (${zodiacData.name}) ${zodiacData.elementObj.symbol}`;
    document.getElementById('rassiInfo').textContent =
        `${rassiData.symbol} ${rassiData.name}`;
    document.getElementById('elementInfo').textContent =
        `${elementData.symbol} ${elementData.name} (${elementData.influence})`;
    document.getElementById('planetInfo').textContent =
        `${planetData.symbol} ${planetData.name} - ${dayName} (${planetData.element})`;
    document.getElementById('houseInfo').textContent =
        `${houseData.name}: ${houseData.meaning}`;
    document.getElementById('directionInfo').textContent =
        `${planetData.direction}`;
    document.getElementById('characterInfo').textContent =
        `${planetData.character}\n💪 จุดแข็ง: ${planetData.strength}\n⚠️ จุดท้าทาย: ${planetData.weakness}`;

    // ส่วนพยากรณ์
    const luckLevel = fortuneLevels[fortuneLevel];
    document.getElementById('loveInfo').textContent = FORTUNE_TEXTS.love[luckLevel];
    document.getElementById('careerInfo').textContent = FORTUNE_TEXTS.career[luckLevel];
    document.getElementById('financeInfo').textContent = FORTUNE_TEXTS.finance[luckLevel];
    document.getElementById('healthInfo').textContent = FORTUNE_TEXTS.health[luckLevel];

    // ส่วนมงคล
    const luckyNums = planetData.number + ',' + elementData.number + ',' + houseNum;
    const avoidNum = (10 - planetData.number) % 10;

    document.getElementById('luckyNumbers').textContent = luckyNums;
    document.getElementById('luckyColor').textContent =
        `${planetData.color} (ดาว), ${elementData.color} (ธาตุ)`;
    document.getElementById('avoidColor').textContent = elementData.avoidColor;
    document.getElementById('avoidNumbers').textContent = avoidNum;
    document.getElementById('luckyDirection').textContent = planetData.direction;
    document.getElementById('luckyGem').textContent = zodiacData.element;

    // แสดงผลลัพธ์
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 🌟 ฟังก์ชันสำหรับ index.html thaiAstrology section
 */
function calculateThaiAstrology() {
    const birthdateEl = document.getElementById('astrologyBirthDate');
    const resultEl = document.getElementById('astrologyResult');

    if (!birthdateEl || !birthdateEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกวันเกิด', 'warning');
        return;
    }

    const birthDate = new Date(birthdateEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();
    const dayOfWeek = birthDate.getDay();

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = thaiDays[dayOfWeek];

    // คำนวณลัคนา
    const { num: planetNum, data: planetData } = ThaiAstrologyData.getPlanetByBirthDay(birthDay);
    const { index: zodiacIndex, data: zodiacData } = ThaiAstrologyData.getZodiacByYear(birthYear);
    const { index: elementIndex, data: elementData } = ThaiAstrologyData.getElementByYear(birthYear);
    const { num: houseNum, data: houseData } = ThaiAstrologyData.getHouseByMonthAndDay(birthMonth, birthDay);
    const rassiIndex = getRassiIndex(birthMonth, birthDay);
    const rassiData = RASSI_THAI[rassiIndex];

    // แสดง Main Planet
    document.getElementById('mainPlanet').innerHTML = `
        <strong>${planetData.symbol} ${planetData.name}</strong> (เกิดวัน${dayName})<br>
        ธาตุ: <strong>${planetData.element}</strong><br>
        ลักษณะ: ${planetData.character}
    `;

    // แสดง Nine Stars (ดาว 9 ดวง)
    const nineStarsEl = document.getElementById('nineStars');
    let starsHTML = '';
    for (let i = 1; i <= 9; i++) {
        if (!ThaiAstrologyData.PLANETS_DATA[i]) continue;
        const p = ThaiAstrologyData.PLANETS_DATA[i];
        const isMain = i === planetNum ? 'border-gold' : '';
        starsHTML += `
            <div class="col-md-4 mb-3">
                <div class="card bg-dark ${isMain}" style="border: 2px solid ${isMain ? '#d4af37' : 'rgba(212,175,55,0.3)'};;">
                    <div class="card-body text-center p-3">
                        <div style="font-size: 2rem;">${p.symbol}</div>
                        <strong class="text-gold">${p.name}</strong><br>
                        <small class="text-muted">${p.dayName}</small><br>
                        <small>${p.element}</small>
                        ${isMain ? '<br><span class="badge badge-gold">ดาวหลัก</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }
    nineStarsEl.innerHTML = starsHTML;

    // แสดง Twelve Houses
    const twelveHousesEl = document.getElementById('twelveHouses');
    let housesHTML = '';
    for (let h = 1; h <= 12; h++) {
        const house = ThaiAstrologyData.HOUSES_DATA[h];
        housesHTML += `
            <div class="col-md-6 mb-2">
                <small><strong>${house.name}:</strong> ${house.meaning}</small>
            </div>
        `;
    }
    twelveHousesEl.innerHTML = housesHTML;

    // แสดง Personal Character
    document.getElementById('personalCharacter').innerHTML = `
        <p><strong>ลักษณะบุคลิก:</strong> ${planetData.character}</p>
        <p><strong>💪 จุดแข็ง:</strong> ${planetData.strength}</p>
        <p><strong>⚠️ จุดท้าทาย:</strong> ${planetData.weakness}</p>
    `;

    // แสดง Prediction
    const fortuneLevel = (planetNum + zodiacIndex) % 3;
    const fortuneLevels = ['bad', 'medium', 'good'];
    const luckLevel = fortuneLevels[fortuneLevel];

    document.getElementById('prediction').innerHTML = `
        <div class="alert alert-info mb-3">
            <strong>❤️ ความรัก/สัมพันธ์:</strong> ${FORTUNE_TEXTS.love[luckLevel]}
        </div>
        <div class="alert alert-info mb-3">
            <strong>💼 อาชีพ/การงาน:</strong> ${FORTUNE_TEXTS.career[luckLevel]}
        </div>
        <div class="alert alert-warning mb-3">
            <strong>💰 การเงิน/รายได้:</strong> ${FORTUNE_TEXTS.finance[luckLevel]}
        </div>
        <div class="alert alert-success">
            <strong>🏥 สุขภาพ:</strong> ${FORTUNE_TEXTS.health[luckLevel]}
        </div>
    `;

    // แสดง Element Fortune
    document.getElementById('elementFortune').innerHTML = `
        <p><strong>🌍 ปีนักษัตร:</strong> ${zodiacData.animal} (${zodiacData.name}) ${zodiacData.elementObj.symbol}</p>
        <p><strong>♈ ราศี:</strong> ${rassiData.symbol} ${rassiData.name}</p>
        <p><strong>🌀 ธาตุประจำปี:</strong> ${elementData.symbol} ${elementData.name} (${elementData.influence})</p>
        <p><strong>🧭 ทิศมงคล:</strong> ${planetData.direction}</p>
        <p><strong>🎨 สีมงคล:</strong> ${planetData.color}, ${elementData.color}</p>
    `;

    // แสดงผลลัพธ์
    if (resultEl) {
        resultEl.style.display = 'block';
    }
}

