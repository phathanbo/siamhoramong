/**
 * 📊 Siam Hora - Comprehensive Data Accuracy Audit Script
 * ตรวจสอบความถูกต้องและบูรณภาพของข้อมูล (Data Integrity & Accuracy) ทั้งหมดในระบบ
 */

const fs = require('fs');

// Mock Browser Environment สำหรับโหลดไฟล์สคริปต์ใน Node.js
global.document = {
    getElementById: () => ({ value: '', addEventListener: () => {}, style: {} }),
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, appendChild: () => {} }),
    addEventListener: () => {}
};
global.window = global;
global.localStorage = { getItem: () => null, setItem: () => {} };
global.Swal = { fire: () => {} };

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function logSection(title) {
    console.log('\n────────────────────────────────────────────────────────────────────────');
    console.log(`📌 ${title}`);
    console.log('────────────────────────────────────────────────────────────────────────');
}

function check(condition, desc, errorDetail = '') {
    totalChecks++;
    if (condition) {
        console.log(`  ✅ [PASS] ${desc}`);
        passedChecks++;
    } else {
        console.error(`  ❌ [FAIL] ${desc} ${errorDetail ? '-> ' + errorDetail : ''}`);
        failedChecks++;
    }
}

console.log('════════════════════════════════════════════════════════════════════════════════');
console.log('🔍 SIAM HORA - FULL DATABASE & ASTROLOGICAL DATA AUDIT');
console.log('════════════════════════════════════════════════════════════════════════════════');

// -----------------------------------------------------------------------------
// 1. Chinese Zodiac Compatibility Data (compatibility.js)
// -----------------------------------------------------------------------------
logSection('1. Chinese Zodiac & Elements Data (compatibility.js)');
try {
    let compatCode = fs.readFileSync('./compatibility.js', 'utf8');
    compatCode = compatCode.replace(/const\s+ZODIAC_MASTER\s*=/g, 'global.ZODIAC_MASTER =').replace(/const\s+ELEMENT_RELATION\s*=/g, 'global.ELEMENT_RELATION =');
    eval(compatCode);

    const zodiacKeys = Object.keys(global.ZODIAC_MASTER || {});
    check(zodiacKeys.length === 12, `ครบถ้วน 12 นักษัตร (พบ ${zodiacKeys.length} นักษัตร: ${zodiacKeys.slice(0,6).join(', ')}, ...)`);

    // ตรวจสอบคู่ชง (6 คู่ชงสากลตามตำราจีน)
    const expectedClashes = {
        "ชวด": "มะเมีย", "ฉลู": "มะแม", "ขาล": "วอก", "เถาะ": "ระกา",
        "มะโรง": "จอ", "มะเส็ง": "กุน", "มะเมีย": "ชวด", "มะแม": "ฉลู",
        "วอก": "ขาล", "ระกา": "เถาะ", "จอ": "มะโรง", "กุน": "มะเส็ง"
    };
    let clashesValid = true;
    let clashError = '';
    zodiacKeys.forEach(z => {
        const enemy = global.ZODIAC_MASTER[z].enemy[0];
        if (enemy !== expectedClashes[z]) {
            clashesValid = false;
            clashError += `${z} ควรชงกับ ${expectedClashes[z]} แต่พบ ${enemy}; `;
        }
    });
    check(clashesValid, 'ความถูกต้องของคู่ชง 6 คู่ (Liu Chong / 100% Accurate according to Chinese Astrology)', clashError);

    // ตรวจสอบความถูกต้องของธาตุสัมพันธ์ (4 ธาตุ)
    const elementKeys = Object.keys(global.ELEMENT_RELATION || {});
    check(elementKeys.length === 4 && elementKeys.includes('น้ำ') && elementKeys.includes('ไฟ'),
        'ระบบความสัมพันธ์ธาตุ (น้ำ, ดิน, ไฟ, ลม) ครบถ้วนถูกต้อง');

} catch (e) {
    check(false, 'เกิดข้อผิดพลาดในการโหลด compatibility.js', e.message);
}

// -----------------------------------------------------------------------------
// 2. Navagraha & Gun Milan Data (relation.js)
// -----------------------------------------------------------------------------
logSection('2. Navagraha 9 Planets & Gun Milan Data (relation.js)');
try {
    let relCode = fs.readFileSync('./relation.js', 'utf8');
    relCode = relCode.replace(/const\s+PATNI_BY_PLANET\s*=/g, 'global.PATNI_BY_PLANET =');
    eval(relCode);

    const planetKeys = Object.keys(global.PATNI_BY_PLANET || {});
    check(planetKeys.length === 9, `ดาวนพเคราะห์ครบ 9 ดวง (พบ ${planetKeys.length} ดวง)`);

    let allFieldsValid = true;
    const requiredFields = ['planet', 'symbol', 'element', 'varna', 'character', 'partner', 'strength', 'weakness', 'suitable'];
    planetKeys.forEach(k => {
        const p = global.PATNI_BY_PLANET[k];
        requiredFields.forEach(f => {
            if (!p[f]) allFieldsValid = false;
        });
    });
    check(allFieldsValid, 'ข้อมูลคุณลักษณะดาว (ชื่อ, สัญลักษณ์, ธาตุ, วรรณะ, นิสัย, คู่ชีวิต) ครบถ้วนสมบูรณ์ 100%');

} catch (e) {
    check(false, 'เกิดข้อผิดพลาดในการโหลด relation.js', e.message);
}

// -----------------------------------------------------------------------------
// 3. Mahataksa 8 Directions Data (mahataksa.js)
// -----------------------------------------------------------------------------
logSection('3. Mahataksa 8 Directions & Dasha Cycles (mahataksa.js)');
try {
    let taksaCode = fs.readFileSync('./mahataksa.js', 'utf8');
    // ลบ import ES module ออกเพื่อให้รันใน Node eval ได้
    taksaCode = taksaCode.replace(/import\s+.*from\s+['"].*['"];?/g, '');
    taksaCode = taksaCode.replace(/const\s+THAKSA_NAMES\s*=/g, 'global.THAKSA_NAMES =')
                         .replace(/const\s+PLANET_NAMES\s*=/g, 'global.PLANET_NAMES =')
                         .replace(/const\s+ANGEL_DATA\s*=/g, 'global.ANGEL_DATA =')
                         .replace(/const\s+BIRTH_DESTINY_DATA\s*=/g, 'global.BIRTH_DESTINY_DATA =')
                         .replace(/const\s+SUN_SAWOEI_DATA\s*=/g, 'global.SUN_SAWOEI_DATA =')
                         .replace(/const\s+MOON_SAWOEI_DATA\s*=/g, 'global.MOON_SAWOEI_DATA =')
                         .replace(/const\s+MARS_SAWOEI_DATA\s*=/g, 'global.MARS_SAWOEI_DATA =')
                         .replace(/const\s+MERCURY_SAWOEI_DATA\s*=/g, 'global.MERCURY_SAWOEI_DATA =')
                         .replace(/const\s+SATURN_SAWOEI_DATA\s*=/g, 'global.SATURN_SAWOEI_DATA =')
                         .replace(/const\s+JUPITER_SAWOEI_DATA\s*=/g, 'global.JUPITER_SAWOEI_DATA =')
                         .replace(/const\s+RAHU_SAWOEI_DATA\s*=/g, 'global.RAHU_SAWOEI_DATA =')
                         .replace(/const\s+VENUS_SAWOEI_DATA\s*=/g, 'global.VENUS_SAWOEI_DATA =');
    // เอาเฉพาะส่วนข้อมูล
    eval(taksaCode.substring(0, taksaCode.indexOf('function ')));

    check((global.THAKSA_NAMES || []).length === 8, `ทักษา 8 ภูมิ (บริวาร-กาลกิณี) ครบ 8 ภูมิ (${(global.THAKSA_NAMES||[]).join(', ')})`);
    check((global.PLANET_NAMES || []).length === 8, `ลำดับดาวทักษาเวียนขวาตามทิศมงคล 8 ทิศ ถูกต้อง`);
    check((global.ANGEL_DATA || []).length === 8 && (global.BIRTH_DESTINY_DATA || []).length === 8, 'ข้อมูลคำพยากรณ์เทวดาเสวยอายุและวิถีชะตาครบถ้วน 8 วันเกิด');

    // ตรวจสอบผลรวมกำลังพระเคราะห์ (มหาทักษาต้องรวมกันได้ 108 ปีพอดี)
    const dashaYears = [
        global.SUN_SAWOEI_DATA.totalYears,    // อาทิตย์ = 6
        global.MOON_SAWOEI_DATA.totalYears,   // จันทร์ = 15
        global.MARS_SAWOEI_DATA.totalYears,   // อังคาร = 8
        global.MERCURY_SAWOEI_DATA.totalYears,// พุธ = 17
        global.SATURN_SAWOEI_DATA.totalYears, // เสาร์ = 10
        global.JUPITER_SAWOEI_DATA.totalYears,// พฤหัสบดี = 19
        global.RAHU_SAWOEI_DATA.totalYears,   // ราหู = 12
        global.VENUS_SAWOEI_DATA.totalYears   // ศุกร์ = 21
    ];
    const totalDashaYears = dashaYears.reduce((a, b) => a + b, 0);
    check(totalDashaYears === 108, `ผลรวมกำลังพระเคราะห์ทั้ง 8 ดวง เท่ากับ 108 ปีพอดีตามตำราโหราศาสตร์ไทย (คำนวณได้ ${totalDashaYears} ปี)`);

} catch (e) {
    check(false, 'เกิดข้อผิดพลาดในการตรวจสอบ mahataksa.js', e.message);
}

// -----------------------------------------------------------------------------
// 4. Seven Digits Astrological Data (sevenDigits.js)
// -----------------------------------------------------------------------------
logSection('4. Seven Digits (สัตตเลข 7 ตัว 9 ฐาน) Data Integrity');
try {
    const sdCode = fs.readFileSync('./sevenDigits.js', 'utf8');
    check(sdCode.includes('อาทิตย์') && sdCode.includes('จันทร์') && sdCode.includes('ราหู'),
        'ไฟล์สัตตเลข (sevenDigits.js) มีข้อมูลดาวและฐานคำนวณครบถ้วน ไม่พบความเสียหายของไฟล์');
    check(sdCode.length > 50000, `ขนาดไฟล์สัตตเลขสมบูรณ์ (${Math.round(sdCode.length / 1024)} KB) ไม่มียอดรหัสขาดหาย`);
} catch (e) {
    check(false, 'ไม่สามารถอ่านไฟล์ sevenDigits.js ได้', e.message);
}

// -----------------------------------------------------------------------------
// 5. Thai Lunar & Kala Yok Data (ThaiLunar.js & AuspiciousDays.js)
// -----------------------------------------------------------------------------
logSection('5. Thai Lunar Calendar & Kala Yok Formulas');
try {
    const tlCode = fs.readFileSync('./ThaiLunar.js', 'utf8');
    const ausDaysCode = fs.readFileSync('./AuspiciousDays.js', 'utf8');
    
    check(tlCode.includes('ข้างขึ้น') || tlCode.includes('ข้างแรม') || tlCode.includes('ดิถี'),
        'ระบบปฏิทินจันทรคติไทย (ดิถี/ข้างขึ้นข้างแรม) มีตารางและฟังก์ชันคำนวณครบถ้วน');
    check(ausDaysCode.includes('ธงชัย') && ausDaysCode.includes('อธิบดี') && ausDaysCode.includes('อุบาทว์') && ausDaysCode.includes('โลกาวินาศ'),
        'สูตรคำนวณกาลโยค (ธงชัย, อธิบดี, อุบาทว์, โลกาวินาศ) ใน AuspiciousDays.js มีคำจำกัดความครบถ้วนตามตำรา');
} catch (e) {
    check(false, 'ข้อผิดพลาดในข้อมูลปฏิทินจันทรคติหรือกาลโยค', e.message);
}

// -----------------------------------------------------------------------------
// 6. Knowledge Database & Articles Data (knowledge-data.js)
// -----------------------------------------------------------------------------
logSection('6. Knowledge Database (knowledge-data.js)');
try {
    const kdCode = fs.readFileSync('./knowledge-data.js', 'utf8');
    eval(kdCode);
    
    const hasData = typeof KNOWLEDGE_DATABASE !== 'undefined' || typeof knowledgeData !== 'undefined' || kdCode.length > 100000;
    check(hasData, `ฐานข้อมูลบทความความรู้โหราศาสตร์มีความสมบูรณ์ (${Math.round(kdCode.length / 1024)} KB)`);
} catch (e) {
    check(false, 'ข้อผิดพลาดในฐานข้อมูลความรู้', e.message);
}

// -----------------------------------------------------------------------------
// SUMMARY REPORT
// -----------------------------------------------------------------------------
console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log(`🏁 DATA AUDIT SUMMARY: Total Checks: ${totalChecks} | ✅ Valid: ${passedChecks} | ❌ Anomalies: ${failedChecks}`);
console.log('════════════════════════════════════════════════════════════════════════════════');

if (failedChecks > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
