/**
 * 💼 คัมภีร์พยากรณ์ธุรกิจและการเงินขั้นสูง (Advanced Business & Financial Astrology Engine)
 * ครอบคลุม: ภาพรวมพื้นฐานดวงการเงิน + พยากรณ์จรรายปี + พยากรณ์จรราย 12 เดือน + พันธมิตรธุรกิจ + ฤกษ์การค้า
 */

"use strict";

// 1. ธาตุและความสอดคล้องทางธุรกิจ
const ELEMENT_BIZ_PROFILES = {
    "ไม้": {
        nature: "การเจริญเติบโตก้าวหน้า การแตกกิ่งก้านสาขา การขยายสาขา",
        suitable: ["การศึกษา/อบรม/สัมมนา", "เกษตรแปรรูป/พืชพรรณ/ไม้ประดับ", "สิ่งพิมพ์/สื่อสร้างสรรค์/คอนเทนต์", "เฟอร์นิเจอร์/งานออกแบบ", "เทคโนโลยีสตาร์ทอัพ"],
        unfavorable: ["โลหะหนัก/ของมีคม", "ของมึนเมา/สถานบันเทิงอบายมุข", "ธุรกิจเสี่ยงโชคแบบฉับพลัน"],
        color: "เขียว, ฟ้าคราม",
        direction: "ทิศตะวันออก",
        luckyDay: "วันพฤหัสบดี"
    },
    "ไฟ": {
        nature: "ความกระตือรือร้น นวัตกรรม ชื่อเสียง การตลาด และความโดดเด่น",
        suitable: ["ความงาม/สปา/ศัลยกรรม", "ร้านอาหาร/เครื่องดื่มร้อน/ปิ้งย่าง", "การตลาดดิจิทัล/อินฟลูเอนเซอร์", "แฟชั่น/เสื้อผ้าแบรนด์", "พลังงาน/ไฟฟ้า/โซลาร์เซลล์"],
        unfavorable: ["กิจการห้องเย็น", "ธุรกิจขนส่งทางน้ำล้วนๆ", "การค้าแบบหลบซ่อนเงียบๆ"],
        color: "แดง, ชมพู, ส้ม, ม่วงสด",
        direction: "ทิศใต้",
        luckyDay: "วันอาทิตย์ / วันอังคาร"
    },
    "ดิน": {
        nature: "ความมั่นคง หนักแน่น ทรงคุณค่าระยะยาว และความน่าเชื่อถือ",
        suitable: ["อสังหาริมทรัพย์/ที่ดิน/บ้านจัดสรร", "วัสดุก่อสร้าง/ตกแต่งบ้าน", "คลังสินค้า/โลจิสติกส์", "เกษตรกรรม/พืชไร่/เหมืองแร่", "สถาบันการเงิน/สหกรณ์"],
        unfavorable: ["การเก็งกำไรระยะสั้นจัดๆ", "สินค้าตามกระแสที่มาไวไปไว", "ธุรกิจขายตรงที่ฉาบฉวย"],
        color: "เหลือง, น้ำตาล, ครีมทอง",
        direction: "ทิศตะวันออกเฉียงเหนือ / ทิศตะวันตกเฉียงใต้",
        luckyDay: "วันจันทร์ / วันพฤหัสบดี"
    },
    "โลหะ": {
        nature: "ความเด็ดขาด เฉียบคม เทคโนโลยี ความแม่นยำ และมูลค่าสูง",
        suitable: ["เทคโนโลยีขั้นสูง/AI/ซอฟต์แวร์/ไอที", "เครื่องจักร/ยานยนต์/EV", "เครื่องประดับ/ทองคำ/จิวเวลรี่", "การเงิน/หลักทรัพย์/การลงทุน"],
        unfavorable: ["ธุรกิจไม้แปรรูป", "งานเกษตรอินทรีย์ที่ต้องใช้แรงคนล้วนๆ"],
        color: "ขาว, เงิน, ทองคำ, เทาเมทัลลิก",
        direction: "ทิศตะวันตก",
        luckyDay: "วันศุกร์ / วันพุธ"
    },
    "น้ำ": {
        nature: "การหมุนเวียน ปรับตัว ยืดหยุ่น คมนาคม การค้าข้ามแดน และการบริการ",
        suitable: ["การค้าระหว่างประเทศ/นำเข้า-ส่งออก", "เครื่องดื่ม/คาเฟ่/บาร์", "การขนส่ง/เดลิเวอรี่", "การท่องเที่ยว/โรงแรม/รีสอร์ต", "ธุรกิจบริการ/อีเวนต์"],
        unfavorable: ["การผูกขาดแบบแข็งตัว", "ธุรกิจที่ห้ามเปลี่ยนแปลงตามโลก"],
        color: "น้ำเงิน, ฟ้า, ดำ, กรมท่า",
        direction: "ทิศเหนือ",
        luckyDay: "วันพุธกลางคืน / วันศุกร์"
    }
};

// 2. คำพยากรณ์รายเดือน 12 เดือน (Dynamic 12-Month Financial Flow Calculator based on Target Year & Natal Planet)
function generateMonthlyBusinessForecast(planetNum, targetYear) {
    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    // ข้อมูลเชิงลึกสำหรับแต่ละเกรด พร้อมข้อควรระวัง (Caution) และคำแนะนำ (Advice) ที่เปลี่ยนไปตามปี
    const detailHigh = [
        {
            status: "ก้าวหน้าก้าวกระโดด (Peak Growth)",
            advice: "จังหวะทองของการเจรจาธุรกิจ ปิดดีลกับลูกค้ารายใหญ่ เซ็นสัญญาสำคัญ หรือเปิดตัวโครงการใหม่ มีผู้ใหญ่และสถาบันการเงินสนับสนุนเต็มที่",
            caution: "ระวังเรื่องเอกสารสัญญาทางกฎหมายที่ซับซ้อน และการขยายงานเร็วเกินจนลูกน้องตามไม่ทัน อย่าลืมตรวจทานรายละเอียดก่อนลงนาม",
            action: "เร่งทำการตลาดเชิงรุก ทุ่มงบโฆษณา จัดอีเวนต์ใหญ่ และขยายช่องทางจำหน่าย",
            luckyAuspicious: "ขึ้น ๕ ค่ำ, ขึ้น ๙ ค่ำ, ขึ้น ๑๕ ค่ำ (เหมาะเจรจา/เปิดร้าน)"
        },
        {
            status: "จุดพีกการค้า & ลาภลอย (Financial Zenith)",
            advice: "กระแสเงินสดไหลเข้าคล่องตัวสูง มีเกณฑ์ได้รับเงินก้อนโต โบนัส เงินปันผล หรือลูกหนี้นำเงินมาคืนเกินความคาดหมาย",
            caution: "ระวังการใช้จ่ายตามอารมณ์หรือการซื้อของฟุ่มเฟือย ควรแบ่งกำไรส่วนหนึ่งไปเก็บในสินทรัพย์ปลอดภัยทันที",
            action: "ต่อยอดผลกำไรด้วยการซื้อทองคำ พันธบัตร หรือลงทุนปรับปรุงระบบการทำงาน",
            luckyAuspicious: "ขึ้น ๑ ค่ำ, ขึ้น ๘ ค่ำ, ขึ้น ๑๒ ค่ำ (เหมาะซื้อทรัพย์สิน)"
        },
        {
            status: "ขยายพันธมิตรรุ่งเรือง (Strategic Partnership)",
            advice: "ได้คู่ค้ารายใหม่ หรือได้ร่วมทุนกับผู้เชี่ยวชาญที่มีชื่อเสียง นำพาเทคโนโลยีและฐานลูกค้าใหม่มาสู่ธุรกิจอย่างงดงาม",
            caution: "กำหนดสัดส่วนผลประโยชน์และหน้าที่ความรับผิดชอบให้ชัดเจนเป็นลายลักษณ์อักษร เพื่อป้องกันความเข้าใจผิดในระยะยาว",
            action: "นัดประชุมพันธมิตร วางโครงสร้างแผนงานร่วม และเปิดตัวโปรดักต์ความร่วมมือ",
            luckyAuspicious: "ขึ้น ๓ ค่ำ, ขึ้น ๗ ค่ำ, ขึ้น ๑๑ ค่ำ (เหมาะเจรจาหุ้นส่วน)"
        }
    ];

    const detailGood = [
        {
            status: "กระแสเงินสดคล่องตัว (Steady Cashflow)",
            advice: "ยอดขายทรงตัวในระดับดี มีลูกค้าประจำหมุนเวียนต่อเนื่อง การบริหารสภาพคล่องทำได้ง่าย ไม่มีหนี้สินติดขัด",
            caution: "อย่าชะล่าใจกับคู่แข่งหน้าใหม่ที่เริ่มเข้ามาตีตลาด ควรพัฒนาบริการหรือจัดกิจกรรมส่งเสริมการขายสม่ำเสมอ",
            action: "จัดโปรโมชัน Loyalty Program เอาใจลูกค้าเก่า และปรับปรุงการบริการหน้าร้าน/ออนไลน์",
            luckyAuspicious: "ขึ้น ๔ ค่ำ, ขึ้น ๑๐ ค่ำ, แรม ๒ ค่ำ"
        },
        {
            status: "ฟื้นตัวสดใส (Recovery & Rebound)",
            advice: "ปัญหาอุปสรรคที่เคยติดขัดเริ่มคลี่คลาย มีผู้สนับสนุนยื่นมือเข้ามาช่วยเหลือ การหมุนเงินเริ่มกลับมาเป็นบวก",
            caution: "ระวังรายจ่ายจรเกี่ยวกับค่าซ่อมแซมยานพาหนะ อุปกรณ์ หรือค่ารักษาพยาบาลของคนในทีม",
            action: "รีไฟแนนซ์หรือปรับโครงสร้างหนี้เพื่อลดดอกเบี้ย และเริ่มสะสมเงินสำรองฉุกเฉิน",
            luckyAuspicious: "ขึ้น ๒ ค่ำ, ขึ้น ๖ ค่ำ, แรม ๕ ค่ำ"
        },
        {
            status: "ลูกค้าใหม่หลั่งไหล (Market Expansion)",
            advice: "การโฆษณาและการบอกต่อเริ่มเห็นผล มีกลุ่มลูกค้าใหม่ให้ความสนใจติดต่อเข้ามาอย่างต่อเนื่อง",
            caution: "ระวังการส่งมอบสินค้าล่าช้าหรือบริการไม่ทัน ควรเตรียมกำลังคนและสต็อกสินค้าให้พร้อมรองรับ",
            action: "พัฒนาระบบแอดมินตอบแชทและระบบจัดส่งให้รวดเร็วฉับไว",
            luckyAuspicious: "ขึ้น ๕ ค่ำ, ขึ้น ๑๓ ค่ำ, แรม ๘ ค่ำ"
        }
    ];

    const detailNeutral = [
        {
            status: "รักษาสมดุล & รัดเข็มขัด (Cost Control)",
            advice: "เดือนนี้เน้นการบริหารจัดการภายใน ลดรายจ่ายที่ไม่จำเป็น ทบทวนสัญญาเช่าหรือต้นทุนแฝงต่างๆ",
            caution: "หลีกเลี่ยงการกู้ยืมเงินก้อนใหม่ที่มีดอกเบี้ยสูง และห้ามค้ำประกันทางการเงินให้ใครเด็ดขาดในเดือนนี้",
            action: "ตรวจสอบระบบบัญชี ปิดรอยรั่วไหลทางการเงิน และเน้นรักษากระแสเงินสดในมือเป็นหลัก",
            luckyAuspicious: "ขึ้น ๙ ค่ำ, แรม ๔ ค่ำ (เหมาะทำความสะอาดฮวงจุ้ย/จัดร้าน)"
        },
        {
            status: "จัดระเบียบสต็อก (Inventory Clearance)",
            advice: "เป็นช่วงเวลาที่เหมาะแก่การระบายสินค้าคงคลังเก่า นำทุนจมกลับมาหมุนเวียนให้เกิดสภาพคล่อง",
            caution: "ระวังสินค้าสูญหาย ชำรุด หรือหมดอายุ ตรวจนับสต็อกอย่างละเอียดทุกสัปดาห์",
            action: "จัดแคมเปญลดล้างสต็อก Flash Sale หรือ Bundle ขายพ่วงเพื่อดึงเงินสดกลับคืนมา",
            luckyAuspicious: "ขึ้น ๗ ค่ำ, แรม ๑ ค่ำ, แรม ๙ ค่ำ"
        },
        {
            status: "ชะลอการเสี่ยง (Defensive Strategy)",
            advice: "รักษามาตรฐานคุณภาพสินค้าเดิม ไม่ควรใจร้อนทุ่มเงินลงโปรเจกต์ใหม่ที่ยังไม่ชัดเจนเรื่องผลตอบแทน",
            caution: "ระวังความขัดแย้งด้านความคิดเห็นกับหุ้นส่วนหรือลูกน้องคนสนิท ควรใช้เหตุผลมากกว่าอารมณ์",
            action: "ศึกษาหาความรู้เพิ่มเติม วิจัยตลาด และวางแผนกลยุทธ์ล่วงหน้าสำหรับไตรมาสถัดไป",
            luckyAuspicious: "ขึ้น ๑๔ ค่ำ, แรม ๓ ค่ำ (เหมาะสวดมนต์/ทำบุญหนุนดวงค้าขาย)"
        }
    ];

    return monthNames.map((mName, idx) => {
        const mNum = idx + 1;
        // คำนวณความสัมพันธ์ของ ดาวกำเนิด (planetNum) + เดือนจร (mNum) + ปีจร (targetYear)
        const monthScore = ((planetNum * 13 + mNum * 19 + (targetYear % 9) * 23 + Math.floor(targetYear * 1.5)) % 40) + 60; // 60 - 99 คะแนน

        let grade = "B+";
        let stars = 4;
        let pool = detailGood;

        if (monthScore >= 90) {
            grade = "A+";
            stars = 5;
            pool = detailHigh;
        } else if (monthScore >= 82) {
            grade = "A";
            stars = 4;
            pool = detailHigh;
        } else if (monthScore >= 74) {
            grade = "B+";
            stars = 4;
            pool = detailGood;
        } else if (monthScore >= 68) {
            grade = "B";
            stars = 3;
            pool = detailNeutral;
        } else {
            grade = "B-";
            stars = 2;
            pool = detailNeutral;
        }

        const pickedInfo = pool[(planetNum * 3 + mNum * 7 + targetYear) % pool.length];

        return {
            monthIndex: mNum,
            monthName: mName,
            year: targetYear,
            grade: grade,
            stars: stars,
            score: monthScore,
            status: pickedInfo.status,
            advice: pickedInfo.advice,
            caution: pickedInfo.caution,
            action: pickedInfo.action,
            luckyAuspicious: pickedInfo.luckyAuspicious
        };
    });
}

/**
 * 💼 คำนวณพยากรณ์ธุรกิจและการเงินขั้นสูง
 */
function calculateAdvancedBusinessFortune(birthDateInput, birthTimeStr = null, targetYear = new Date().getFullYear()) {
    let dayOfWeekNum = 0; // 0=อาทิตย์
    let birthDateObj = null;

    if (birthDateInput instanceof Date) {
        birthDateObj = birthDateInput;
    } else if (typeof birthDateInput === 'string') {
        if (typeof safeParseThaiDate === 'function') {
            birthDateObj = safeParseThaiDate(birthDateInput);
        } else if (typeof parseBirthdate === 'function') {
            birthDateObj = parseBirthdate(birthDateInput);
        } else {
            birthDateObj = new Date(birthDateInput);
        }
    }

    if (birthDateObj && !isNaN(birthDateObj.getTime())) {
        if (typeof getAstrologicalDayOfWeek === 'function') {
            dayOfWeekNum = getAstrologicalDayOfWeek(birthDateInput, birthTimeStr || '12:00');
        } else {
            dayOfWeekNum = birthDateObj.getDay();
        }
    }

    const planetMapping = [1, 2, 9, 5, 3, 6, 8]; // 0=อาทิตย์(1), 1=จันทร์(2), 2=อังคาร(9), 3=พุธ(5), 4=พฤหัส(3), 5=ศุกร์(6), 6=เสาร์(8)
    const planetNum = planetMapping[dayOfWeekNum] || 1;

    // ธาตุปีเกิด
    let birthYearCE = birthDateObj ? birthDateObj.getFullYear() : targetYear;
    const elementKeys = ["โลหะ", "น้ำ", "ไม้", "ไฟ", "ดิน"];
    const elementKey = elementKeys[Math.abs(birthYearCE - 4) % 5] || "ดิน";
    const elementInfo = ELEMENT_BIZ_PROFILES[elementKey] || ELEMENT_BIZ_PROFILES["ดิน"];

    // คำนวณแนวโน้ม 5 ปีล่วงหน้าและประเมิน "ปีทองที่ดีที่สุด" (Best Golden Years Ranking)
    const futureYears = [];
    for (let offset = 0; offset < 6; offset++) {
        const y = targetYear + offset;
        const yearCycleScore = ((planetNum * 7 + (y % 12) * 13 + (y % 5) * 17) % 25) + 75; // 75 - 99 คะแนน
        const stars = yearCycleScore >= 93 ? 5 : (yearCycleScore >= 85 ? 4 : 3);
        
        let theme = "";
        let verdict = "";
        let opportunity = "";
        let cautious = "";

        if (yearCycleScore >= 93) {
            theme = "⭐ ปีมหาเศรษฐีเปิดทาง (Golden Zenith Year)";
            verdict = "ดวงการค้าพุ่งทะยานสูงสุด มีเกณฑ์รับทรัพย์ก้อนโต ได้คู่ค้าขนาดใหญ่ ขยายกิจการไร้อุปสรรค";
            opportunity = "ทุ่มกำลังลงทุนในโปรเจกต์ใหญ่ เซ็นสัญญาสำคัญ ซื้อสินทรัพย์หรือเปิดสาขาใหม่";
            cautious = "บริหารจัดการความสำเร็จและทีมงานให้ทันกับการเติบโตแบบก้าวกระโดด";
        } else if (yearCycleScore >= 87) {
            theme = "🚀 ปีแห่งการเติบโตและต่อยอดพันธมิตร";
            verdict = "การเงินหมุนเวียนคล่องตัว ยอดขายเติบโตต่อเนื่อง มีโอกาสได้ลูกค้ารายใหม่เข้ามาเสริม";
            opportunity = "การตลาดเชิงรุก การสร้างแบรนด์ และการร่วมทุนกับพันธมิตร";
            cautious = "ระวังเรื่องกระแสเงินสดสำรองและการบริหารลูกหนี้การค้า";
        } else {
            theme = "🛡️ ปีแห่งการสะสมทุนและปรับระบบหลังบ้าน";
            verdict = "ดวงการเงินทรงตัว เน้นความมั่นคง ปรับปรุงกระบวนการทำงานให้รัดกุมและประหยัดต้นทุน";
            opportunity = "การฝึกอบรมบุคลากร การนำระบบดิจิทัลมาช่วยลดค่าใช้จ่าย";
            cautious = "ชะลอการลงทุนที่มีความเสี่ยงสูงจัดๆ และหลีกเลี่ยงการค้ำประกัน";
        }

        futureYears.push({
            year: y,
            theme,
            starRating: stars,
            financialScore: yearCycleScore,
            businessVerdict: verdict,
            keyOpportunity: opportunity,
            cautiousQuarter: cautious,
            isBestYear: false
        });
    }

    // หาปีที่คะแนนสูงสุดเป็น "ปีทองที่ดีที่สุด (Best Year)"
    let maxScore = -1;
    let bestYearObj = null;
    futureYears.forEach(item => {
        if (item.financialScore > maxScore) {
            maxScore = item.financialScore;
            bestYearObj = item;
        }
    });
    if (bestYearObj) bestYearObj.isBestYear = true;

    // รายเดือน 12 เดือนสำหรับปีที่เลือก
    const monthlyForecast = generateMonthlyBusinessForecast(planetNum, targetYear);

    // หุ้นส่วนธุรกิจที่สมพงษ์ (Business Compatibility)
    const partnerGood = [
        { role: "หุ้นส่วนสายกลยุทธ์/การเงิน", match: "ผู้เกิดวันพฤหัสบดี หรือ วันศุกร์", benefit: "ช่วยควบคุมกระแสเงินสดและป้องกันความเสี่ยง" },
        { role: "หุ้นส่วนสายการตลาด/ยอดขาย", match: "ผู้เกิดวันพุธ หรือ วันอังคาร", benefit: "นำพายอดขาย ลูกค้าใหม่ และความคึกคักมาสู่บริษัท" }
    ];

    return {
        planetNum,
        dayOfWeekNum,
        element: elementKey,
        elementInfo,
        targetYear,
        yearlyTrend: futureYears,
        bestYear: bestYearObj,
        monthlyForecast,
        partnerGood
    };
}

/**
 * 🔄 ปรับเปลี่ยนปีที่ต้องการพยากรณ์ (+1 / -1 ปี)
 */
function changeBusinessYear(offset) {
    const yearEl = document.getElementById('businessYear');
    if (!yearEl) return;
    let currentVal = parseInt(yearEl.value, 10) || new Date().getFullYear();
    currentVal += offset;
    if (currentVal < 2000) currentVal = 2000;
    if (currentVal > 2100) currentVal = 2100;
    yearEl.value = currentVal;
    displayBusinessFortune();
}

/**
 * 💡 ฟังก์ชันเปิด Popup แสดงรายละเอียดคำแนะนำ & ข้อควรระวังประจำเดือน
 */
function showMonthDetailModal(monthIdx, targetYear) {
    const birthdayEl = document.getElementById('businessBirthday');
    const birthTimeEl = document.getElementById('businessBirthTime');
    const zodiacEl = document.getElementById('businessZodiac');

    let birthDateInput = birthdayEl && birthdayEl.value ? birthdayEl.value : null;
    let birthTimeInput = birthTimeEl && birthTimeEl.value ? birthTimeEl.value : '12:00';

    if (!birthDateInput && zodiacEl && zodiacEl.value) {
        const sampleYears = {
            rat: "2008-05-15", ox: "2009-05-15", tiger: "2010-05-15", rabbit: "2011-05-15",
            dragon: "2012-05-15", snake: "2013-05-15", horse: "2014-05-15", goat: "2015-05-15",
            monkey: "2016-05-15", rooster: "2017-05-15", dog: "2018-05-15", pig: "2019-05-15"
        };
        birthDateInput = sampleYears[zodiacEl.value] || "2000-01-01";
    }

    const data = calculateAdvancedBusinessFortune(birthDateInput, birthTimeInput, targetYear);
    const mData = data.monthlyForecast.find(m => m.monthIndex === monthIdx);

    if (!mData) return;

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: `<span style="color: #FFF0A8; font-weight: bold;"><i class="fas fa-calendar-star mr-2 text-warning"></i>${mData.monthName} ${targetYear} (พ.ศ. ${targetYear + 543})</span>`,
            html: `
                <div class="text-left" style="font-size: 0.95rem; line-height: 1.7; color: #F3F4F6;">
                    
                    <!-- เกรดและสถานะ -->
                    <div class="p-3 mb-3 rounded d-flex justify-content-between align-items-center" style="background: rgba(241,208,110,0.15); border: 1px solid rgba(241,208,110,0.4);">
                        <div>
                            <span class="text-white-50 small d-block">สถานะกระแสการเงิน</span>
                            <strong style="color: #FFF0A8; font-size: 1.1rem;">${mData.status}</strong>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-warning text-dark font-weight-bold p-2" style="font-size: 1rem;">เกรด ${mData.grade}</span>
                            <div class="text-warning small mt-1">${'⭐'.repeat(mData.stars)}</div>
                        </div>
                    </div>

                    <!-- 1. คำแนะนำการค้า -->
                    <div class="p-3 mb-3 rounded" style="background: rgba(34,197,94,0.1); border-left: 4px solid #22C55E;">
                        <h6 style="color: #4ADE80; font-weight: bold; margin-bottom: 6px;">
                            <i class="fas fa-lightbulb mr-2"></i>💡 กลยุทธ์และคำแนะนำ (Business Strategy):
                        </h6>
                        <p class="m-0" style="color: #E2E8F0;">${mData.advice}</p>
                    </div>

                    <!-- 2. ข้อควรระวัง -->
                    <div class="p-3 mb-3 rounded" style="background: rgba(239,68,68,0.1); border-left: 4px solid #EF4444;">
                        <h6 style="color: #F87171; font-weight: bold; margin-bottom: 6px;">
                            <i class="fas fa-exclamation-triangle mr-2"></i>⚠️ ข้อควรระวังและจุดบกพร่อง (Risk & Caution):
                        </h6>
                        <p class="m-0" style="color: #E2E8F0;">${mData.caution}</p>
                    </div>

                    <!-- 3. สิ่งที่ควรลงมือทำ -->
                    <div class="p-3 mb-3 rounded" style="background: rgba(59,130,246,0.1); border-left: 4px solid #3B82F6;">
                        <h6 style="color: #93C5FD; font-weight: bold; margin-bottom: 6px;">
                            <i class="fas fa-tasks mr-2"></i>🎯 สิ่งที่ควรลงมือทำทันที (Action Items):
                        </h6>
                        <p class="m-0" style="color: #E2E8F0;">${mData.action}</p>
                    </div>

                    <!-- 4. ฤกษ์มงคลประจำเดือน -->
                    <div class="p-2 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(241,208,110,0.3);">
                        <small style="color: #CBD5E1;"><i class="fas fa-moon text-warning mr-1"></i> <strong>วันดิถีฤกษ์มงคล:</strong> ${mData.luckyAuspicious}</small>
                    </div>

                </div>
            `,
            background: 'linear-gradient(135deg, #162238 0%, #0c1424 100%)',
            confirmButtonText: 'เข้าใจแล้ว / ปิดหน้าต่าง',
            confirmButtonColor: '#C99727',
            customClass: {
                popup: 'border-gold rounded-xl shadow-2xl'
            }
        });
    }
}

/**
 * 🎯 Display Business Fortune (แสดงผลพยากรณ์ธุรกิจและการเงินแบบละเอียดครบครัน)
 */
function displayBusinessFortune() {
    const birthdayEl = document.getElementById('businessBirthday');
    const birthTimeEl = document.getElementById('businessBirthTime');
    const zodiacEl = document.getElementById('businessZodiac');
    const yearEl = document.getElementById('businessYear');
    const resultEl = document.getElementById('businessResult');

    let birthDateInput = birthdayEl && birthdayEl.value ? birthdayEl.value : null;
    let birthTimeInput = birthTimeEl && birthTimeEl.value ? birthTimeEl.value : '12:00';
    let targetYear = yearEl && yearEl.value ? parseInt(yearEl.value, 10) : new Date().getFullYear();

    // Fallback ถ้าไม่ได้ใส่วันเกิด แต่เลือกนักษัตร
    if (!birthDateInput && zodiacEl && zodiacEl.value) {
        const sampleYears = {
            rat: "2008-05-15", ox: "2009-05-15", tiger: "2010-05-15", rabbit: "2011-05-15",
            dragon: "2012-05-15", snake: "2013-05-15", horse: "2014-05-15", goat: "2015-05-15",
            monkey: "2016-05-15", rooster: "2017-05-15", dog: "2018-05-15", pig: "2019-05-15"
        };
        birthDateInput = sampleYears[zodiacEl.value] || "2000-01-01";
    }

    if (!birthDateInput) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('แจ้งเตือน', 'กรุณาเลือกสมาชิก หรือระบุวันเกิด/เลือกปีนักษัตรเพื่อวิเคราะห์', 'warning');
        }
        return;
    }

    const data = calculateAdvancedBusinessFortune(birthDateInput, birthTimeInput, targetYear);

    if (!resultEl) return;
    resultEl.style.display = 'block';

    const currentYearData = data.yearlyTrend[0];

    // สร้าง HTML ผลลัพธ์แบบหรูหรา Radiant Cosmic Card
    resultEl.innerHTML = `
        <div class="p-4 rounded mb-4" style="background: linear-gradient(135deg, rgba(20,32,58,0.85) 0%, rgba(13,21,39,0.95) 100%); border: 1px solid rgba(241,208,110,0.4); border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.4);">
            
            <!-- Best Golden Year Highlight Badge -->
            ${data.bestYear ? `
                <div class="p-3 mb-4 rounded text-center" style="background: linear-gradient(90deg, rgba(241,208,110,0.2) 0%, rgba(245,158,11,0.3) 50%, rgba(241,208,110,0.2) 100%); border: 1px solid rgba(241,208,110,0.6); border-radius: 16px; box-shadow: 0 0 20px rgba(241,208,110,0.3);">
                    <div style="font-size: 1.1rem; color: #FFF0A8; font-weight: bold;">
                        🏆 <span style="text-decoration: underline;">ปีทองที่ดีที่สุดล่วงหน้า</span> คือ <strong>ปี ${data.bestYear.year} (พ.ศ. ${data.bestYear.year + 543})</strong>
                    </div>
                    <small style="color: #CBD5E1;">คะแนนดวงการค้าพุ่งสูงถึง <strong>${data.bestYear.financialScore}%</strong> (${data.bestYear.theme})</small>
                </div>
            ` : ''}

            <!-- 1. Header Overview Cards -->
            <div class="row g-3 mb-4">
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    <div class="p-3 text-center h-100 rounded" style="background: rgba(241,208,110,0.1); border: 1px solid rgba(241,208,110,0.3);">
                        <span class="text-white-50 small d-block">ธาตุประจำดวงการค้า</span>
                        <h4 style="color: #FFF0A8; font-weight: bold; margin: 4px 0;">ธาตุ${data.element}</h4>
                        <small style="color: #CBD5E1;">${data.elementInfo.nature}</small>
                    </div>
                </div>
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    <div class="p-3 text-center h-100 rounded" style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);">
                        <span class="text-white-50 small d-block">สีและทิศมงคลนำโชค</span>
                        <h5 style="color: #93C5FD; font-weight: bold; margin: 4px 0;">สี: ${data.elementInfo.color}</h5>
                        <small style="color: #CBD5E1;">ทิศมงคล: ${data.elementInfo.direction} | วันมงคล: ${data.elementInfo.luckyDay}</small>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="p-3 text-center h-100 rounded" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3);">
                        <span class="text-white-50 small d-block">ดัชนีการเงินปี ${data.targetYear}</span>
                        <h3 style="color: #E9D5FF; font-weight: bold; margin: 4px 0;">${currentYearData.financialScore}%</h3>
                        <small style="color: #4ADE80;">เกรด ${currentYearData.financialScore >= 90 ? 'A+' : 'A'} (${'⭐'.repeat(currentYearData.starRating)})</small>
                    </div>
                </div>
            </div>

            <!-- 2. หมวดธุรกิจที่รุ่งโรจน์ & ควรระวัง -->
            <div class="row g-4 mb-4">
                <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <div class="p-3 rounded h-100" style="background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3);">
                        <h6 style="color: #4ADE80; font-weight: bold;"><i class="fas fa-check-circle mr-2"></i>ธุรกิจ/สินค้าที่ถูกโฉลกทำแล้วรวย:</h6>
                        <ul class="m-0 pl-3 small" style="color: #E2E8F0; line-height: 1.8;">
                            ${data.elementInfo.suitable.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="p-3 rounded h-100" style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3);">
                        <h6 style="color: #F87171; font-weight: bold;"><i class="fas fa-exclamation-triangle mr-2"></i>กิจการที่ต้องระวัง/ไม่ควรลงทุนสุ่มสี่สุ่มห้า:</h6>
                        <ul class="m-0 pl-3 small" style="color: #E2E8F0; line-height: 1.8;">
                            ${data.elementInfo.unfavorable.map(u => `<li>${u}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 3. พยากรณ์กระแสการเงินราย 12 เดือน (12-Month Cashflow Calendar) -->
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div>
                        <h5 style="color: #FFF0A8; font-weight: bold; margin: 0;">
                            <i class="fas fa-calendar-alt mr-2 text-warning"></i> แผนภูมิพยากรณ์กระแสการเงินรายเดือน (ประจำปี ${data.targetYear})
                        </h5>
                        <small class="text-white-50"><i class="fas fa-hand-pointer mr-1 text-warning"></i> คลิกที่การ์ดเดือนเพื่อดูคำแนะนำ กลยุทธ์ และข้อควรระวังแบบเจาะลึก</small>
                    </div>
                    <div class="btn-group btn-group-sm mt-2 mt-md-0">
                        <button class="btn btn-outline-gold" onclick="changeBusinessYear(-1)"><i class="fas fa-chevron-left"></i> ปีก่อน</button>
                        <button class="btn btn-gold text-dark font-weight-bold" disabled>ปี ${data.targetYear}</button>
                        <button class="btn btn-outline-gold" onclick="changeBusinessYear(1)">ปีถัดไป <i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>

                <div class="row g-3">
                    ${data.monthlyForecast.map(m => `
                        <div class="col-12 col-sm-6 col-lg-3 mb-3">
                            <div class="p-3 rounded h-100" 
                                 style="background: rgba(15,23,42,0.85); border: 1px solid rgba(241,208,110,0.25); cursor: pointer; transition: all 0.25s ease;"
                                 onmouseover="this.style.borderColor='#F1D06E'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 20px rgba(241,208,110,0.2)';"
                                 onmouseout="this.style.borderColor='rgba(241,208,110,0.25)'; this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                                 onclick="showMonthDetailModal(${m.monthIndex}, ${data.targetYear})">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <strong style="color: #FFF0A8; font-size: 0.95rem;">${m.monthName}</strong>
                                    <span class="badge" style="background: ${m.grade.includes('+') ? '#10B981' : '#F59E0B'}; color: #FFF;">${m.grade}</span>
                                </div>
                                <div class="text-warning mb-2" style="font-size: 0.8rem;">${'⭐'.repeat(m.stars)}</div>
                                <p style="color: #93C5FD; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">${m.status}</p>
                                <small style="color: #94A3B8; font-size: 0.78rem; line-height: 1.4; display: block; margin-bottom: 6px;">${m.advice}</small>
                                <div class="text-right">
                                    <span class="badge badge-dark text-warning border border-warning" style="font-size: 10px;">คลิกดูเจาะลึก 🔍</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 4. พยากรณ์แนวโน้มธุรกิจ 5 ปีข้างหน้า (Multi-Year Horizon & Golden Year Ranking) -->
            <div class="mb-4 p-3 rounded" style="background: rgba(15,23,42,0.7); border: 1px solid rgba(241,208,110,0.2);">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <h5 style="color: #FFF0A8; font-weight: bold; margin: 0;">
                        <i class="fas fa-chart-line mr-2 text-warning"></i> ลำดับแนวโน้มดวงการค้า 5 ปีล่วงหน้า (พ.ศ. ${data.targetYear + 543} - ${data.targetYear + 5 + 543})
                    </h5>
                    <small class="text-white-50">คลิกที่ปีเพื่อเจาะลึกการพยากรณ์</small>
                </div>
                <div class="row g-3">
                    ${data.yearlyTrend.map(y => `
                        <div class="col-12 col-md-4 mb-3">
                            <div class="p-3 rounded h-100" style="background: ${y.isBestYear ? 'linear-gradient(135deg, rgba(241,208,110,0.2) 0%, rgba(30,46,78,0.8) 100%)' : 'rgba(30,46,78,0.6)'}; border-left: 4px solid ${y.isBestYear ? '#F59E0B' : '#F1D06E'}; border: ${y.isBestYear ? '1px solid rgba(241,208,110,0.6)' : 'none'}; cursor: pointer;"
                                 onclick="document.getElementById('businessYear').value = ${y.year}; displayBusinessFortune();">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <h6 style="color: #FFF0A8; font-weight: bold; margin: 0;">
                                        ปี ${y.year} (พ.ศ. ${y.year + 543})
                                        ${y.isBestYear ? '<span class="badge badge-warning text-dark ml-1 font-weight-bold">🏆 ปีทอง</span>' : ''}
                                    </h6>
                                    <span style="color: #F1D06E; font-size: 0.85rem;">${y.financialScore}%</span>
                                </div>
                                <p style="color: #93C5FD; font-size: 0.85rem; font-weight: bold; margin-bottom: 6px;">${y.theme}</p>
                                <p style="color: #CBD5E1; font-size: 0.82rem; margin-bottom: 6px;">${y.businessVerdict}</p>
                                <div class="small text-white-50">
                                    <div><i class="fas fa-bullseye text-success mr-1"></i> <strong>โอกาส:</strong> ${y.keyOpportunity}</div>
                                    <div class="mt-1"><i class="fas fa-shield-alt text-warning mr-1"></i> <strong>คำแนะนำ:</strong> ${y.cautiousQuarter}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 5. หุ้นส่วนและพันธมิตรที่เกื้อหนุน (Business Partners) -->
            <div class="p-3 rounded" style="background: rgba(15,23,42,0.7); border: 1px solid rgba(241,208,110,0.2);">
                <h5 style="color: #FFF0A8; font-weight: bold; margin-bottom: 10px;">
                    <i class="fas fa-handshake mr-2 text-warning"></i> หุ้นส่วนและพันธมิตรทางธุรกิจที่ส่งเสริมกัน
                </h5>
                <div class="row">
                    ${data.partnerGood.map(p => `
                        <div class="col-12 col-md-6 mb-2">
                            <div class="p-2 rounded" style="background: rgba(255,255,255,0.03);">
                                <strong style="color: #F1D06E; font-size: 0.9rem;">${p.role}:</strong>
                                <span style="color: #FFFFFF; font-size: 0.88rem;"> ${p.match}</span>
                                <small class="d-block text-white-50 mt-1">${p.benefit}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>
    `;

    // เลื่อนหน้าจอไปยังผลลัพธ์อย่างนุ่มนวล
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ผูกฟังก์ชันเข้ากับ window
window.displayBusinessFortune = displayBusinessFortune;
window.changeBusinessYear = changeBusinessYear;
window.showMonthDetailModal = showMonthDetailModal;
window.calculateAdvancedBusinessFortune = calculateAdvancedBusinessFortune;
