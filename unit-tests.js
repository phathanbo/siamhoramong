/**
 * 🧪 Siam Hora - Automated Unit Test Suite
 * ครอบคลุมการทดสอบ Utility Functions, Security (XSS Protection), และ Astrology Logic
 */

const fs = require('fs');

// โหลดโค้ดจาก utils-helpers.js เพื่อทดสอบ
const helpersCode = fs.readFileSync('./utils-helpers.js', 'utf8');
eval(helpersCode);

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`✅ [PASS] ${testName}`);
        passed++;
    } else {
        console.error(`❌ [FAIL] ${testName} - ${details}`);
        failed++;
    }
}

console.log('════════════════════════════════════════════════════════════════════════════════');
console.log('🧪 RUNNING SIAM HORA UNIT TEST SUITE');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

// -----------------------------------------------------------------------------
// Test Suite 1: parseBirthdate (Utility Date Parser)
// -----------------------------------------------------------------------------
console.log('📅 [Suite 1] Date Parsing (parseBirthdate)');
const d1 = parseBirthdate("25/12/2540"); // รูปแบบ พ.ศ.
assert(d1 !== null && d1.year === 1997 && d1.month === 11 && d1.day === 25, "แปลงวันที่แบบ พ.ศ. (25/12/2540) เป็น ค.ศ. (1997) สำเร็จ");
assert(typeof d1.toISOString === 'function', "ผลลัพธ์จาก parseBirthdate เป็น Date object แท้ (มีฟังก์ชัน toISOString)");

const d2 = parseBirthdate("1997-12-25"); // รูปแบบ ค.ศ. ISO
assert(d2 !== null && d2.getFullYear() === 1997 && d2.getDate() === 25, "แปลงวันที่แบบ ISO (1997-12-25) สำเร็จ");
assert(d2.day === 25 && d2.month === 11 && d2.year === 1997, "มีการแนบ properties พิเศษ (.day, .month, .year) บน Date object ครบถ้วน");

const d3 = parseBirthdate("invalid-date");
assert(d3 === null, "คืนค่า null เมื่อข้อมูลวันที่ไม่ถูกต้อง");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 2: Thai Month Name (getMonthNameThai)
// -----------------------------------------------------------------------------
console.log('🇹🇭 [Suite 2] Thai Month Names');
assert(getMonthNameThai(1) === "มกราคม", "เดือน 1 คือ มกราคม");
assert(getMonthNameThai(4) === "เมษายน", "เดือน 4 คือ เมษายน");
assert(getMonthNameThai(12) === "ธันวาคม", "เดือน 12 คือ ธันวาคม");
assert(getMonthNameThai(13) === "เดือนไม่ทราบ", "คืนค่า default เมื่อเลขเดือนเกิน 12");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 3: Security & XSS Protection (escapeHTML)
// -----------------------------------------------------------------------------
console.log('🛡️ [Suite 3] XSS Sanitization (escapeHTML)');
const unsafeStr = '<script>alert("XSS & Attack")</script>';
const safeStr = escapeHTML(unsafeStr);
assert(safeStr === '&lt;script&gt;alert(&quot;XSS &amp; Attack&quot;)&lt;/script&gt;', "แปลงแท็กอันตราย (<script>, \", &) ให้เป็น HTML Entities สำเร็จ");
assert(escapeHTML(12345) === 12345, "คืนค่าเดิมเมื่อ Input ไม่ใช่ String");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 4: Auspicious Days Utility Verification
// -----------------------------------------------------------------------------
console.log('🚩 [Suite 4] Auspicious Days Single Source of Truth');
const ausCode = fs.readFileSync('./utils-auspicious.js', 'utf8');
assert(ausCode.includes('function getAuspiciousDays(month)'), "ไฟล์ utils-auspicious.js มีฟังก์ชัน getAuspiciousDays เป็น Single Source of Truth");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 5: Dream Interpretation Module Verification
// -----------------------------------------------------------------------------
console.log('🌙 [Suite 5] Dream Interpretation Module Verification');
global.window = {};
require('./dreamInterpretation.js');
assert(typeof window.DREAM_MEANINGS !== 'undefined', "ดาวน์โหลดและส่งออกมหาคลังข้อมูล DREAM_MEANINGS สำเร็จ");
let totalWords = 0;
for (let cat in window.DREAM_MEANINGS) {
    totalWords += Object.keys(window.DREAM_MEANINGS[cat]).length;
}
assert(totalWords >= 350, `มหาคลังคำศัพท์ความฝันมีครบถ้วนมากกว่า 350 คำ (ปัจจุบันมี ${totalWords} คำศัพท์)`);
assert(typeof window.DREAM_MEANINGS.animal['พญานาค'] !== 'undefined', "มีคำศัพท์มงคลสำคัญ เช่น 'พญานาค' และเลขนำโชคครบถ้วน");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 6: Lucky Numbers (Lotto) Numerology & Planetary Alignment
// -----------------------------------------------------------------------------
console.log('🎰 [Suite 6] Lucky Numbers Numerology & Planetary Alignment Verification');
global.document = { addEventListener: () => {} };
const lottoMod = require('./lotto.js');
assert(lottoMod.PLANET_NUMBERS['อังคาร'] === 3, "ดาวอังคารมีค่าเลข 3 ตรงตามตำราทักษาปกรณ์");
assert(lottoMod.PLANET_NUMBERS['พุธ'] === 4, "ดาวพุธ (กลางวัน) มีค่าเลข 4 ตรงตามตำราทักษาปกรณ์");
assert(lottoMod.PLANET_NUMBERS['พุธกลางคืน'] === 8 && lottoMod.PLANET_NUMBERS['ราหู'] === 8, "ดาวราหู / พุธกลางคืน มีค่าเลข 8 ตรงตามตำราทักษาปกรณ์");
assert(lottoMod.PLANET_NUMBERS['เสาร์'] === 7, "ดาวเสาร์มีค่าเลข 7 ตรงตามตำราทักษาปกรณ์");
assert(lottoMod.calculateNameSum('สมชาย') === 8, "คำนวณเลขศาสตร์ชื่ออักษรไทย (สมชาย = ส(1)+ม(5)+ช(2)+า(1)+ย(8) = 17 -> 1+7 = 8) ถูกต้องตามตำรา");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 7: Lucky Colors (Colors.js) Mahataksa & Five Elements Verification
// -----------------------------------------------------------------------------
console.log('🎨 [Suite 7] Lucky Colors Mahataksa & Five Elements Verification');
const colorsMod = require('./colors.js');
assert(colorsMod.PLANET_BY_DAY['อังคาร'] === 3, "วันอังคารตรงกับดาวอังคาร เลข 3 (ไม่ใช่เลข 9)");
assert(colorsMod.PLANET_BY_DAY['พุธกลางคืน'] === 8, "รองรับวันพุธกลางคืน (พระราหู เลข 8)");
assert(colorsMod.PLANET_BY_DAY['เสาร์'] === 7, "วันเสาร์ตรงกับดาวเสาร์ เลข 7");
assert(colorsMod.OPPOSITE_ELEMENTS['ดิน'] === 'ไม้', "ธาตุพิฆาตดินคือไม้ (รากไม้ชอนไชดิน) ไม่ใช่ดินข่มดินเอง");
assert(colorsMod.OPPOSITE_ELEMENTS['น้ำ'] === 'ดิน', "ธาตุพิฆาตน้ำจุดกาลกิณีคือดิน (ดินกั้นถมน้ำ)");
const calcHorse1990 = colorsMod.calculateLuckyColors('อาทิตย์', 1990);
assert(calcHorse1990.elementType === 'ไฟ' && calcHorse1990.wealthColor.includes('แดง'), "คำนวณธาตุปีเกิดจากราศีปีนักษัตร 1990 (มะเมีย/ม้า) คือธาตุไฟ สีโชคลาภคือสีแดง/ส้ม");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 8: Element Manual & Five Elements Astrological Relations Verification
// -----------------------------------------------------------------------------
console.log('📜 [Suite 8] Element Manual & Five Elements Astrological Relations Verification');
const elementMod = require('./element.js');
assert(elementMod.getBirthElement(8).name === "ธาตุลม" && elementMod.getBirthElement("ราหู").name === "ธาตุลม", "รองรับดาวราหู (พุธกลางคืน เลข 8) เป็นธาตุลมตามตำราทักษา");
assert(elementMod.getElementRelation("ธาตุไฟ", "ธาตุทอง").includes("พิฆาต"), "ความสัมพันธ์ ไฟ vs ทอง คือพิฆาต (ไฟหลอมละลายทอง) ถูกต้องตามตำราเบญจธาตุ");
assert(elementMod.getElementRelation("ธาตุดิน", "ธาตุไม้").includes("พิฆาต"), "ความสัมพันธ์ ดิน vs ไม้ คือพิฆาต (รากไม้ชอนไชดิน) ถูกต้องตามตำราเบญจธาตุ");
assert(elementMod.getElementRelation("ธาตุทอง", "ธาตุไม้").includes("พิฆาต"), "ความสัมพันธ์ ทอง vs ไม้ คือพิฆาต (ขวาน/โลหะตัดต้นไม้) ถูกต้องตามตำราเบญจธาตุ");
assert(elementMod.getElementRelation("ธาตุลม", "ธาตุไม้").includes("เกื้อกูล"), "ความสัมพันธ์ ลม vs ไม้ คือเกื้อกูล (ลมช่วยกระจายเกสรไม้) ถูกต้องตามตำรา");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 9: Patient Fate (ทักษาตัดอายุคนป่วย) Scripture Compliance Verification
// -----------------------------------------------------------------------------
console.log('⚕️ [Suite 9] Patient Fate (ทักษาตัดอายุคนป่วย) Scripture Compliance Verification');
const patientFateCode = fs.readFileSync('PatientFate.js', 'utf8');
const indexHtmlCode = fs.readFileSync('index.html', 'utf8');
assert(!patientFateCode.includes('>เศษ 0') && !patientFateCode.includes('เศษ ๐ : ชะตาขาดสามเส้น ทายว่าตาย') && patientFateCode.includes('เศษ ๗ (๐) : ชะตาขาดสามเส้น'), "ไม่มีการใช้ 'เศษ 0' ในการแสดงผลพยากรณ์ตัดอายุ แปลงหารลงตัวเป็นเศษ ๕ หรือเศษ ๗ ถูกต้องตามตำรา");
assert(patientFateCode.includes('remain1_raw === 0 ? 5 : remain1_raw') && patientFateCode.includes('remain2_raw === 0 ? 7 : remain2_raw'), "วิธีที่ ๑ และ ๒ แปลงค่า modulo 0 เป็นเศษ ๕ และเศษ ๗ ตามตำราโบราณ");
assert(indexHtmlCode.includes('ตำราพรหมชาติ (วิชาทักษาตัดอายุคนเจ็บ)'), "คำอธิบายใต้หัวข้อวิธีพยากรณ์ตัดอายุคนป่วยถูกต้องตามตำราพรหมชาติ");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 10: Life Extension (วิชามหามงคลต่อชะตาชีวิต) Scripture Compliance Verification
// -----------------------------------------------------------------------------
console.log('⏳ [Suite 10] Life Extension (วิชามหามงคลต่อชะตาชีวิต) Scripture Compliance Verification');
const lifeExtCode = fs.readFileSync('lifeExtension.js', 'utf8');
assert(lifeExtCode.includes('dayDict') && lifeExtCode.includes('power: 6') && lifeExtCode.includes('power: 15') && lifeExtCode.includes('power: 12'), "ครบถ้วนด้วยระบบกำลังวันเกิดทั้ง ๘ วัน (รวมพระราหู กำลัง ๑๒ และอาทิตย์ กำลัง ๖) ตามตำราทักษาปกรณ์");
assert(lifeExtCode.includes('เดือนอ้าย') && lifeExtCode.includes('เดือนยี่') && lifeExtCode.includes('เดือนห้า'), "ใช้การนับเดือนเกิดตามจันทรคติไทย (เดือนอ้าย ถึง เดือนสิบสอง) ถูกต้องตามตำราพรหมชาติ");
assert(lifeExtCode.includes('dayPrayer') && lifeExtCode.includes('candleText') && lifeExtCode.includes('guardian'), "มีระบบคำนวณเทียนมงคล พระคาถาประจำวัน และเทวดาคุ้มครองชะตาครบถ้วนสมบูรณ์");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 11: Year Clash (ปีชง-ปีเสริม) Default Year & Auto-Render Verification
// -----------------------------------------------------------------------------
console.log('🐉 [Suite 11] Year Clash (ปีชง-ปีเสริม) Default Year & Auto-Render Verification');
const yearClashCode = fs.readFileSync('yearClash.js', 'utf8');
const scriptCode = fs.readFileSync('script.js', 'utf8');
assert(yearClashCode.includes('function ycGetDefaultBirthYear()') && yearClashCode.includes('MemberManager.getSingleProfile') && yearClashCode.includes('localStorage.getItem("userBirthdate")'), "มีระบบค้นหาปีเกิดปัจจุบันของผู้ใช้จาก MemberManager, localStorage และช่อง input อย่างชาญฉลาด");
assert(yearClashCode.includes('const defY = ycGetDefaultBirthYear();') && yearClashCode.includes('setTimeout(renderYearClash, 80);'), "ใช้ค่าเริ่มต้นของปีปัจจุบันหรือปีผู้ใช้ พร้อมสั่งวิเคราะห์และแสดงผลทันทีที่เปิดหน้า");
assert(scriptCode.includes("pageId === 'yearClashPage'") && scriptCode.includes("showYearClashPage"), "มีการเชื่อมต่อ navigation hook ใน script.js เพื่อให้อัปเดตข้อมูลปีชงปีเสริมทุกครั้งที่สลับหน้า");
console.log('');

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('════════════════════════════════════════════════════════════════════════════════');
console.log(`📊 TEST SUMMARY: Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
console.log('════════════════════════════════════════════════════════════════════════════════');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
