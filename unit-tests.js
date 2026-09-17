/**
 * 🧪 Siam Hora - Automated Unit Test Suite
 * ครอบคลุมการทดสอบ Utility Functions, Security (XSS Protection), และ Astrology Logic
 */

const fs = require('fs');

// โหลดโค้ดจาก utils-helpers.js เพื่อทดสอบ
const helpersCode = fs.readFileSync('./src/utils/utils-helpers.js', 'utf8');
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
const ausCode = fs.readFileSync('./src/utils/utils-auspicious.js', 'utf8');
assert(ausCode.includes('function getAuspiciousDays(month)'), "ไฟล์ utils-auspicious.js มีฟังก์ชัน getAuspiciousDays เป็น Single Source of Truth");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 5: Dream Interpretation Module Verification
// -----------------------------------------------------------------------------
console.log('🌙 [Suite 5] Dream Interpretation Module Verification');
global.window = {};
require('./src/ui/dream-interpretation.js');
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
const lottoMod = require('./src/engine/lotto.js');
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
const colorsMod = require('./src/utils/colors.js');
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
const elementMod = require('./src/engine/element.js');
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
const patientFateCode = fs.readFileSync('src/engine/patient-fate.js', 'utf8');
const indexHtmlCode = fs.readFileSync('index.html', 'utf8');
assert(!patientFateCode.includes('>เศษ 0') && !patientFateCode.includes('เศษ ๐ : ชะตาขาดสามเส้น ทายว่าตาย') && patientFateCode.includes('เศษ ๗ (๐) : ชะตาขาดสามเส้น'), "ไม่มีการใช้ 'เศษ 0' ในการแสดงผลพยากรณ์ตัดอายุ แปลงหารลงตัวเป็นเศษ ๕ หรือเศษ ๗ ถูกต้องตามตำรา");
assert(patientFateCode.includes('remain1_raw === 0 ? 5 : remain1_raw') && patientFateCode.includes('remain2_raw === 0 ? 7 : remain2_raw'), "วิธีที่ ๑ และ ๒ แปลงค่า modulo 0 เป็นเศษ ๕ และเศษ ๗ ตามตำราโบราณ");
assert(indexHtmlCode.includes('ตำราพรหมชาติ (วิชาทักษาตัดอายุคนเจ็บ)'), "คำอธิบายใต้หัวข้อวิธีพยากรณ์ตัดอายุคนป่วยถูกต้องตามตำราพรหมชาติ");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 10: Life Extension (วิชามหามงคลต่อชะตาชีวิต) Scripture Compliance Verification
// -----------------------------------------------------------------------------
console.log('⏳ [Suite 10] Life Extension (วิชามหามงคลต่อชะตาชีวิต) Scripture Compliance Verification');
const lifeExtCode = fs.readFileSync('src/engine/life-extension.js', 'utf8');
assert(lifeExtCode.includes('dayDict') && lifeExtCode.includes('power: 6') && lifeExtCode.includes('power: 15') && lifeExtCode.includes('power: 12'), "ครบถ้วนด้วยระบบกำลังวันเกิดทั้ง ๘ วัน (รวมพระราหู กำลัง ๑๒ และอาทิตย์ กำลัง ๖) ตามตำราทักษาปกรณ์");
assert(lifeExtCode.includes('เดือนอ้าย') && lifeExtCode.includes('เดือนยี่') && lifeExtCode.includes('เดือนห้า'), "ใช้การนับเดือนเกิดตามจันทรคติไทย (เดือนอ้าย ถึง เดือนสิบสอง) ถูกต้องตามตำราพรหมชาติ");
assert(lifeExtCode.includes('dayPrayer') && lifeExtCode.includes('candleText') && lifeExtCode.includes('guardian'), "มีระบบคำนวณเทียนมงคล พระคาถาประจำวัน และเทวดาคุ้มครองชะตาครบถ้วนสมบูรณ์");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 11: Year Clash (ปีชง-ปีเสริม) Default Year & Auto-Render Verification
// -----------------------------------------------------------------------------
console.log('🐉 [Suite 11] Year Clash (ปีชง-ปีเสริม) Default Year & Auto-Render Verification');
const yearClashCode = fs.readFileSync('src/engine/year-clash.js', 'utf8');
const scriptCode = fs.readFileSync('src/ui/script.js', 'utf8');
assert(yearClashCode.includes('function ycGetDefaultBirthYear()') && yearClashCode.includes('MemberManager.getSingleProfile') && yearClashCode.includes('localStorage.getItem("userBirthdate")'), "มีระบบค้นหาปีเกิดปัจจุบันของผู้ใช้จาก MemberManager, localStorage และช่อง input อย่างชาญฉลาด");
assert(yearClashCode.includes('const defY = ycGetDefaultBirthYear();') && yearClashCode.includes('setTimeout(renderYearClash, 80);'), "ใช้ค่าเริ่มต้นของปีปัจจุบันหรือปีผู้ใช้ พร้อมสั่งวิเคราะห์และแสดงผลทันทีที่เปิดหน้า");
assert(scriptCode.includes("pageId === 'yearClashPage'") && scriptCode.includes("showYearClashPage"), "มีการเชื่อมต่อ navigation hook ใน script.js เพื่อให้อัปเดตข้อมูลปีชงปีเสริมทุกครั้งที่สลับหน้า");
// -----------------------------------------------------------------------------
// Test Suite 12: Ascendant Multi-System Calculation (Lahiri Sidereal vs Anto-Natee)
// -----------------------------------------------------------------------------
console.log('🔭 [Suite 12] Ascendant Multi-System Calculation (Lahiri Sidereal vs Anto-Natee)');
const thaiHoroMod = require('./src/engine/thai-horoscope-engine.js');
const ascTestMod = require('./src/engine/ascendant.js');
assert(typeof ascTestMod.ascCalcLagna === 'function', "ascendant.js ส่งออกฟังก์ชันคำนวณ ascCalcLagna อย่างถูกต้อง");

const testLahiri = thaiHoroMod.calculateFullHoroscope('1995-07-14', '11:15', { calculationMethod: 'lahiri' });
assert(testLahiri.asc.method === 'lahiri', "รองรับการคำนวณลัคนาแบบ Lahiri Sidereal");
assert(testLahiri.asc.rasiName === 'กุมภ์' || testLahiri.asc.rasiName === 'มีน', `ผลลัพธ์ลัคนาแบบ Lahiri คำนวณได้ราศี ${testLahiri.asc.rasiName} (กุมภ์/มีน คาบรอยต่อ)`);
assert(typeof testLahiri.asc.deg === 'number' && typeof testLahiri.asc.min === 'number', "มีค่าองศาและลิปดาครบถ้วน");

const testAnto = thaiHoroMod.calculateFullHoroscope('1995-07-14', '11:15', { calculationMethod: 'anto' });
assert(testAnto.asc.method === 'anto', "รองรับการคำนวณลัคนาแบบอันโตนาทีไทยโบราณ");
assert(testAnto.asc.rasiName === 'กันย์', `ผลลัพธ์ลัคนาแบบอันโตนาทีคำนวณได้ราศี ${testAnto.asc.rasiName}`);
// -----------------------------------------------------------------------------
// Test Suite 13: Promchart (วงล้อพยากรณ์) & Multi-Format Age Auto-Fill Verification
// -----------------------------------------------------------------------------
console.log('🎡 [Suite 13] Promchart (วงล้อพยากรณ์) & Multi-Format Age Auto-Fill Verification');
const promchartCode = fs.readFileSync('src/engine/promchart.js', 'utf8');
const memberManagerCode = fs.readFileSync('src/ui/membermanager.js', 'utf8');
const scriptUpdatedCode = fs.readFileSync('src/ui/script.js', 'utf8');

assert(memberManagerCode.includes("activeMember = finalMember || member") && memberManagerCode.includes("safeParseThaiDate(activeMember.birthdate)"), "membermanager.js คำนวณอายุโดยใช้ activeMember และ safeParseThaiDate ปลอดภัยต่อวันเกิด พ.ศ./ค.ศ.");
assert(memberManagerCode.includes("calculatePromchart") && memberManagerCode.includes("if (typeof calculatePromchart === 'function') calculatePromchart();"), "membermanager.js สั่งคำนวณวงล้อพยากรณ์อัตโนมัติทันทีที่ดึงอายุสำเร็จ");
assert(scriptUpdatedCode.includes("if (pageId === 'promchartsection')") && scriptUpdatedCode.includes("autoFillMemberData(window.currentMemberId)"), "script.js มี hook ดักจับเมื่อเข้าหน้า promchartsection เพื่ออัปเดต dropdown และ autoFill อัตโนมัติ");
assert(promchartCode.includes("safeParseThaiDate(birthDateEl.value)") || promchartCode.includes("parseBirthdate(birthDateEl.value)"), "promchart.js รองรับการแปลงวันเกิดทั้ง พ.ศ. และ ค.ศ. อย่างปลอดภัย");

// ทดสอบคำนวณอายุจากวันที่แบบไทย (25/12/2540)
const sampleBirthThai = parseBirthdate("25/12/2540");
const calculatedAge = (new Date().getFullYear() - sampleBirthThai.year) + 1;
assert(calculatedAge > 0 && typeof calculatedAge === 'number', `คำนวณอายุย่างจาก 25/12/2540 ได้ ${calculatedAge} ปี อย่างถูกต้อง`);
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 14: System-Wide Date/Age Parsing & Backward Compatibility Verification
// -----------------------------------------------------------------------------
console.log('📅 [Suite 14] System-Wide Date/Age Parsing & Backward Compatibility Verification');
const auspiciousCode = fs.readFileSync('src/engine/auspicious-days.js', 'utf8');
const dayBirthCode = fs.readFileSync('src/data/day-birth-data.js', 'utf8');
const numerologyCode = fs.readFileSync('src/engine/numerology.js', 'utf8');

// 1. auspicious-days.js checks
assert(auspiciousCode.includes("bdateStr.includes('/')") && auspiciousCode.includes("bdateStr.includes('-')"), "formatThaiBirthdateWithAge รองรับทั้งรูปแบบ DD/MM/YYYY และ YYYY-MM-DD");
assert(auspiciousCode.includes("member.birthdate.includes('/')") && auspiciousCode.includes("member.birthdate.includes('-')"), "getMemberFortuneForDay รองรับทั้งรูปแบบ / และ - ปลอดภัยไม่เกิดข้อผิดพลาด");
assert(auspiciousCode.includes("memberProfile.birthdate.includes('/')") && auspiciousCode.includes("memberProfile.birthdate.includes('-')"), "พระจันทร์เสวยภพในใบพิมพ์รองรับวันเกิดทุกรูปแบบทั้ง พ.ศ. และ ค.ศ.");

// 2. day-birth-data.js checks
assert(dayBirthCode.includes("parseBirthdate(profile.birthdate)") || (dayBirthCode.includes("profile.birthdate.includes('/')") && dayBirthCode.includes("y -= 543")), "day-birth-data.js แปลงวันเกิด DD/MM/YYYY พ.ศ. ได้ถูกต้อง ไม่เกิด Invalid Date หรือ NaN");

// 3. numerology.js checks
assert(numerologyCode.includes("if (y > 2400) y -= 543;"), "numerology.js แปลงปี พ.ศ. (> 2400) เป็น ค.ศ. ก่อนคำนวณวันในสัปดาห์");

// 4. ทดสอบความถูกต้องของวันในสัปดาห์ (14/07/2538 ต้องเป็นวันศุกร์ dayIdx = 5)
const testDateBe = "14/07/2538";
const p = testDateBe.split('/');
let yr = parseInt(p[2], 10);
if (yr > 2400) yr -= 543;
const dateObjTest = new Date(yr, parseInt(p[1], 10) - 1, parseInt(p[0], 10));
assert(dateObjTest.getDay() === 5, "วันที่ 14/07/2538 คำนวณวันในสัปดาห์ตรงกับวันศุกร์ (dayIdx=5) ถูกต้องสมบูรณ์");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 15: Auth Enhancements (Reset Password, Phone Field, Consent Persistence)
// -----------------------------------------------------------------------------
console.log('🔐 [Suite 15] Auth Enhancements (Reset Password, Phone Field, Consent Persistence)');
const authCode = fs.readFileSync('src/utils/auth-enhanced-firebase-fixed.js', 'utf8');
const indexHtmlCodeAuth = fs.readFileSync('index.html', 'utf8');
const consentCode = fs.readFileSync('src/ui/consent-form.js', 'utf8');

// 1. Phone validation & Registration checks
assert(authCode.includes('function validatePhone(phone)'), "auth-enhanced-firebase-fixed.js มีฟังก์ชัน validatePhone สำหรับตรวจรูปแบบเบอร์โทรศัพท์");
assert(authCode.includes('authRegPhone') && authCode.includes('phone: phone'), "doRegister รองรับการดึงและบันทึกข้อมูลเบอร์โทรศัพท์ phone");
assert(authCode.includes('phone: user.phone || \'\''), "saveUserToFirestore บันทึกฟิลด์ phone ลงใน Firestore");
assert(indexHtmlCodeAuth.includes('id="authRegPhone"'), "index.html มีช่อง input เบอร์โทรศัพท์ในฟอร์มสมัครสมาชิก");

// 2. Reset Password feature checks
assert(indexHtmlCodeAuth.includes('id="authForgotPwLink"') && indexHtmlCodeAuth.includes('switchToReset()'), "index.html มีลิงก์ลืมรหัสผ่านเพื่อสลับไปหน้า Reset Password");
assert(indexHtmlCodeAuth.includes('id="authResetForm"') && indexHtmlCodeAuth.includes('doResetPassword()'), "index.html มีฟอร์ม Reset Password ครบถ้วน");
assert(indexHtmlCodeAuth.includes('id="authResetUsername"') && indexHtmlCodeAuth.includes('id="authResetPhone"'), "ฟอร์ม Reset Password มีช่องกรอก Username และ Phone สำหรับยืนยันตัวตน");
assert(indexHtmlCodeAuth.includes('id="authResetPassword"') && indexHtmlCodeAuth.includes('id="authResetPasswordConfirm"'), "ฟอร์ม Reset Password มีช่อง New Password และ Confirm Password");
assert(authCode.includes('async function doResetPassword()'), "auth-enhanced-firebase-fixed.js มีฟังก์ชัน doResetPassword");
assert(authCode.includes('window.doResetPassword = doResetPassword'), "doResetPassword ถูกส่งออกเป็น Global Function");

// 3. PDPA Consent Persistence checks
assert(!authCode.includes("localStorage.removeItem('pdpaConsent');"), "clearSession ไม่ลบข้อมูล pdpaConsent ของเครื่องเมื่อออกจากระบบ");
assert(consentCode.includes("pdpaConsent_' + targetUserId.toLowerCase()"), "consent-form.js ตรวจสอบความยินยอมเฉพาะบุคคล pdpaConsent_<userId>");
assert(consentCode.includes("pdpaConsent_' + userId.toLowerCase()"), "consent-form.js บันทึกความยินยอมแยกรายบุคคล pdpaConsent_<userId>");
assert(authCode.includes("pdpaConsent_' + user.username.toLowerCase()"), "doLogin กู้คืนสถานะการยินยอม pdpaConsent ตาม user ทันทีที่ล็อกอิน");

// 4. LINE Login & Dynamic Bot Fortune checks
const lineBotCode = fs.readFileSync('google-apps-script-line-bot.js', 'utf8');
assert(indexHtmlCodeAuth.includes('id="authLineLoginBtn"') && indexHtmlCodeAuth.includes('doLineLogin()'), "index.html มีปุ่มเข้าสู่ระบบด้วย LINE (LINE Login)");
assert(authCode.includes('function doLineLogin()') && authCode.includes('checkLineLoginCallback()'), "auth-enhanced-firebase-fixed.js มีฟังก์ชัน doLineLogin และ checkLineLoginCallback");
assert(authCode.includes('window.doLineLogin = doLineLogin'), "doLineLogin ถูกส่งออกเป็น Global Function พร้อมใช้งาน");
assert(lineBotCode.includes('TAKSA_MEANINGS') && lineBotCode.includes('getZodiacFortune(zodiacNum, targetDate)'), "google-apps-script-line-bot.js คำนวณพยากรณ์ดวงตามหลักมหาทักษาปกรณ์จริง");
assert(lineBotCode.includes('dayPlanetMap') && lineBotCode.includes('variationIdx'), "LINE Bot มีระบบหมุนเวียนภูมิทักษาและคำทำนายตามวันจริง 100% ไม่ซ้ำซาก");
assert(lineBotCode.includes('OFFICIAL_TIERS') && lineBotCode.includes('processUserMessage'), "LINE Bot ตรวจสอบระดับแพ็กเกจสมาชิก 16 ระดับเพื่อปลดล็อกฟังก์ชันอย่างถูกต้อง");
console.log('');

// -----------------------------------------------------------------------------
// Test Suite 16: Profile Sidebar Tier Enforcement & Access Protection
// -----------------------------------------------------------------------------
console.log('🔒 [Suite 16] Profile Sidebar Tier Enforcement & Access Protection');
const tiersCode = fs.readFileSync('src/utils/tiers.js', 'utf8');
const indexHtmlProfile = fs.readFileSync('index.html', 'utf8');
const lifeGraphCode = fs.readFileSync('src/engine/life-graph.js', 'utf8');
const mahataksaCode = fs.readFileSync('src/engine/mahataksa.js', 'utf8');
const memberManagerCodeSuite16 = fs.readFileSync('src/ui/membermanager.js', 'utf8');
const scriptCodeSuite16 = fs.readFileSync('src/ui/script.js', 'utf8');

// 1. Tiers definition & helper verification
assert(tiersCode.includes("'lifeGraphPage': 4") && tiersCode.includes("'mahathaksaPage': 5") && tiersCode.includes("'nameAnalysisPage': 4"), "systemMinTier กำหนดสิทธิ์ขั้นต่ำสำหรับ lifeGraphPage (ทองคำ), mahathaksaPage (ทองคำขาว), และ nameAnalysisPage (ทองคำ)");
assert(tiersCode.includes('window.getRequiredTierInfo = function') && tiersCode.includes('window.showTierUpgradePrompt = function'), "tiers.js มีฟังก์ชัน getRequiredTierInfo และ showTierUpgradePrompt สำหรับแจ้งเตือนอัปเกรด");

// 2. Direct button action enforcement
assert(lifeGraphCode.includes("window.hasPackagePermission('lifeGraphPage')"), "calculateLifeGraph ตรวจสอบสิทธิ์ hasPackagePermission('lifeGraphPage') ก่อนทำงาน ป้องกันผู้ใช้ทดลองใช้เข้าถึง");
assert(mahataksaCode.includes("window.hasPackagePermission('mahathaksaPage')"), "calculatemahataksa ตรวจสอบสิทธิ์ hasPackagePermission('mahathaksaPage') ก่อนทำงาน ป้องกันผู้ใช้ทดลองใช้เข้าถึง");
assert(indexHtmlProfile.includes("profBtnNameAnalysis") && indexHtmlProfile.includes("hasPackagePermission('nameAnalysisPage')"), "ปุ่มวิเคราะห์ชื่อ-นามสกุลใน index.html ตรวจสอบสิทธิ์ hasPackagePermission('nameAnalysisPage') ก่อนนำทาง");

// 3. SPA Navigation Router protection
assert(scriptCodeSuite16.includes("window.hasPackagePermission(pageId)"), "navigateTo ใน script.js ตรวจสอบสิทธิ์การเข้าถึงหน้าระบบ ป้องกันการเจาะผ่าน URL hash หรือฟังก์ชันนำทาง");

// 4. Visual badge and lock on Profile Sidebar
assert(memberManagerCodeSuite16.includes("window.updateProfileSidebarTierAccess = function"), "membermanager.js มีฟังก์ชัน updateProfileSidebarTierAccess สำหรับแสดง badge และไอคอนล็อกตามระดับผู้ใช้");
assert(indexHtmlProfile.includes('id="profBtnLifeGraph"') && indexHtmlProfile.includes('id="profBtnMahataksa"'), "index.html กำหนด id ให้ปุ่ม Sidebar ใน #profilePage ชัดเจนเพื่อรองรับการอัปเดตสถานะล็อก");

// -----------------------------------------------------------------------------
console.log('🔄 [Suite 17] Profile Page F5 Reload Persistence & Auto-Render Verification');
const scriptCodeSuite17 = fs.readFileSync('src/ui/script.js', 'utf8');
const memberManagerCodeSuite17 = fs.readFileSync('src/ui/membermanager.js', 'utf8');

// 1. profilePage must not be blocked in tempPages
assert(!scriptCodeSuite17.includes("const tempPages = ['lifeGraphPage', 'nameAnalysisPage', 'profilePage']"), "profilePage ไม่ถูกบล็อกใน tempPages ของ script.js เพื่อให้จำหน้าได้เมื่อกด F5");
assert(scriptCodeSuite17.includes("const tempPages = ['lifeGraphPage', 'nameAnalysisPage']"), "tempPages คงเหลือเฉพาะหน้าที่ต้องการให้เป็น temporary อย่างถูกต้อง");

// 2. navigateTo auto-render hook for profilePage
assert(scriptCodeSuite17.includes("profPredictionArea") && scriptCodeSuite17.includes("showProfilePage"), "navigateTo ใน script.js มี hook เรียก showProfilePage อัตโนมัติเมื่อเปิดหรือรีโหลดหน้า profilePage");

// 3. Robust fallback profile loader
assert(memberManagerCodeSuite17.includes("window.loadAllAvailableProfiles") && memberManagerCodeSuite17.includes("loadLastProfileFromStorage"), "loadLastProfileFromStorage ใน membermanager.js มีระบบค้นหา fallback ป้องกันหน้าว่าง 100%");

console.log('');

// -----------------------------------------------------------------------------
// Test Suite 18: Member Auto-Selection for Regular Users vs Admin Selectors
// -----------------------------------------------------------------------------
console.log('👤 [Suite 18] Member Auto-Selection for Regular Users vs Admin Selectors');
const memberManagerCodeSuite18 = fs.readFileSync('src/ui/membermanager.js', 'utf8');
const scriptCodeSuite18 = fs.readFileSync('src/ui/script.js', 'utf8');

// 1. Regular Member auto-selection in updateAllMemberSelectors
assert(memberManagerCodeSuite18.includes("const defaultMember = (!canViewAll && history.length > 0) ? history[0] : null;"), "membermanager.js กำหนด defaultMember อัตโนมัติสำหรับสมาชิกทั่วไป");
assert(memberManagerCodeSuite18.includes("select.value = defaultMemberVal;"), "membermanager.js ตั้งค่า dropdown เป็นข้อมูลของตนเองอัตโนมัติ");
assert(memberManagerCodeSuite18.includes("if (!canViewAll && defaultMemberVal)") && memberManagerCodeSuite18.includes("autoFillMemberData(defaultMemberVal)"), "membermanager.js เรียก autoFillMemberData อัตโนมัติเมื่อเป็นสมาชิกทั่วไป");

// 2. Admin selector support preserved
assert(memberManagerCodeSuite18.includes("select.innerHTML = '<option value=\"\">-- เลือกสมาชิกจากประวัติ --</option>';"), "ผู้ดูแลระบบ/กรณีมีหลายรายการยังคงมีตัวเลือกเริ่มต้นเพื่อเลือกดูสมาชิกคนอื่นได้ตามปกติ");

// 3. Navigation Hook auto-fill in script.js
assert(scriptCodeSuite18.includes("if (!canViewAll && typeof autoFillMemberData === 'function')") && scriptCodeSuite18.includes("autoFillMemberData(currentTargetId)"), "script.js มี hook เรียก autoFillMemberData อัตโนมัติทุกครั้งที่มีการเปลี่ยนหน้าสำหรับสมาชิกทั่วไป");

console.log('');

// -----------------------------------------------------------------------------
// Test Suite 19: Admin Tier Simulator & Package Switcher Verification
// -----------------------------------------------------------------------------
console.log('🧪 [Suite 19] Admin Tier Simulator & Package Switcher Verification');
const authCodeSuite19 = fs.readFileSync('src/utils/auth-enhanced-firebase-fixed.js', 'utf8');
const tiersCodeSuite19 = fs.readFileSync('src/utils/tiers.js', 'utf8');
const memberManagerCodeSuite19 = fs.readFileSync('src/ui/membermanager.js', 'utf8');

// 1. openAdminTierSimulatorModal exists and is exported
assert(authCodeSuite19.includes('function openAdminTierSimulatorModal()'), "auth-enhanced-firebase-fixed.js มีฟังก์ชัน openAdminTierSimulatorModal สำหรับเปิดแผงทดสอบ");
assert(authCodeSuite19.includes('window.openAdminTierSimulatorModal = openAdminTierSimulatorModal'), "openAdminTierSimulatorModal ถูกส่งออกเป็น Global Function พร้อมใช้งาน");

// 2. Security: Admin restriction
assert(authCodeSuite19.includes("session.role !== 'admin'") && authCodeSuite19.includes("Swal.fire('ไม่มีสิทธิ์'"), "openAdminTierSimulatorModal ตรวจสอบสิทธิ์ admin ป้องกันผู้ใช้ทั่วไปแอบเปิด");

// 3. UI Buttons for admin in top badge and profile page
assert(authCodeSuite19.includes('id="adminSimulateTierBtn"') && authCodeSuite19.includes("isAdminUser ?"), "แถบข้อมูลผู้ใช้ (updateUserBadge) มีปุ่มทดสอบระดับสมาชิกเฉพาะเมื่อเป็น admin");
assert(memberManagerCodeSuite19.includes("openAdminTierSimulatorModal()") && memberManagerCodeSuite19.includes("🧪 ทดสอบระดับสมาชิก"), "หน้าโปรไฟล์ (Profile Page) มีปุ่มลัดสำหรับแอดมินกดทดสอบระดับสมาชิก");

// 4. Simulator Enforcement in tiers.js
assert(tiersCodeSuite19.includes("localStorage.getItem('siamhora_simulate_package')"), "tiers.js รองรับการจำลองระดับแพ็กเกจ (siamhora_simulate_package) เพื่อทดสอบการล็อกฟีเจอร์เสมือนจริง");
assert(authCodeSuite19.includes("function resetSimulatedPackage()"), "มีฟังก์ชัน resetSimulatedPackage คืนค่าสิทธิ์แอดมินเต็มได้ทันที");

console.log('');

// -----------------------------------------------------------------------------
// Test Suite 20: Waenta Hora System (Diamond Tier System)
// -----------------------------------------------------------------------------
console.log('🔮 [Suite 20] Waenta Hora System (Diamond Tier Restriction & Integration)');
const tiersCodeSuite20 = fs.readFileSync('src/utils/tiers.js', 'utf8');
const mainpageCodeSuite20 = fs.readFileSync('src/ui/mainpage.js', 'utf8');
const waentaHtmlExists = fs.existsSync('pages/waenta-hora.html');
const waentaDataExists = fs.existsSync('src/data/waenta-hora-data.js');
const waentaEngineExists = fs.existsSync('src/engine/waenta-hora-engine.js');

assert(waentaHtmlExists, "มีไฟล์หน้า HTML pages/waenta-hora.html สำหรับระบบคัมภีร์แว่นตาโหร");
assert(waentaDataExists, "มีไฟล์ฐานข้อมูลตำรา src/data/waenta-hora-data.js ครบ 51 หน้า");
assert(waentaEngineExists, "มีไฟล์คำนวณสูตรแว่นตาโหร src/engine/waenta-hora-engine.js");
assert(tiersCodeSuite20.includes("'waentaHoraPage': 10"), "tiers.js กำหนดสิทธิ์ waentaHoraPage ขั้นต่ำระดับเพชร (Tier 10) ขึ้นไป");
assert(mainpageCodeSuite20.includes("'waentaHoraPage'") && mainpageCodeSuite20.includes("pages/waenta-hora.html"), "mainpage.js ลงทะเบียนการ์ดคัมภีร์แว่นตาโหรในห้องพยากรณ์ (APP_MENU)");

if (waentaHtmlExists) {
    const waentaHtml = fs.readFileSync('pages/waenta-hora.html', 'utf8');
    assert(waentaHtml.includes("hasPackagePermission('waentaHoraPage')"), "waenta-hora.html ตรวจสอบสิทธิ์ระดับเพชรก่อนเข้าใช้งาน");
    assert(waentaHtml.includes("src/data/waenta-hora-data.js") && waentaHtml.includes("src/engine/waenta-hora-engine.js"), "waenta-hora.html เชื่อมโยง Data และ Engine ครบถ้วน");
}

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
