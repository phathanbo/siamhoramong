/**
 * 🧪 TEST SCRIPT: Zodiac Promchart Verification
 * ตรวจสอบความสมบูรณ์และถูกต้องของข้อมูล 12 นักษัตรตำราพรหมชาติ
 */

const fs = require('fs');
const path = require('path');

const zodiacCode = fs.readFileSync(path.join(__dirname, 'zodiac-tab-switcher.js'), 'utf8');

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("🧪 ZODIAC PROMCHART (12 ANIMAL YEARS) - UNIT TEST SUITE");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

let passCount = 0;
let failCount = 0;

// 1. ตรวจสอบการไม่มีคำผิดร้ายแรง
const forbiddenWords = ['ปีอุกกาก', 'ยุ่มยำ', 'ขี้ขลาด'];
forbiddenWords.forEach(word => {
    if (zodiacCode.includes(word)) {
        console.error(`  ❌ [FAIL] พบคำผิดร้ายแรงในไฟล์: "${word}"`);
        failCount++;
    } else {
        console.log(`  ✅ [PASS] ไม่พบคำผิดร้ายแรง: "${word}"`);
        passCount++;
    }
});

// 2. ตรวจสอบรายชื่อ 12 นักษัตรครบถ้วน
const requiredKeys = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
requiredKeys.forEach(key => {
    if (zodiacCode.includes(`'${key}': {`) || zodiacCode.includes(`"${key}": {`)) {
        console.log(`  ✅ [PASS] พบโครงสร้างข้อมูลปีนักษัตร: ${key}`);
        passCount++;
    } else {
        console.error(`  ❌ [FAIL] ไม่พบข้อมูลปีนักษัตร: ${key}`);
        failCount++;
    }
});

// 3. ตรวจสอบข้อมูลเชิงลึกตำราพรหมชาติ (ธาตุเกิด, มิ่งขวัญ, คู่มิตร, คู่ชง)
const attributes = ['element:', 'guardian:', 'friendly:', 'conflict:'];
attributes.forEach(attr => {
    if (zodiacCode.includes(attr)) {
        console.log(`  ✅ [PASS] พบแอตทริบิวต์ตำราพรหมชาติ: ${attr}`);
        passCount++;
    } else {
        console.error(`  ❌ [FAIL] ไม่พบแอตทริบิวต์: ${attr}`);
        failCount++;
    }
});

console.log("\n════════════════════════════════════════════════════════════════════════════════");
console.log(`🏁 ZODIAC PROMCHART TEST SUMMARY: Total Checks: ${passCount + failCount} | ✅ Valid: ${passCount} | ❌ Failed: ${failCount}`);
console.log("════════════════════════════════════════════════════════════════════════════════\n");

if (failCount > 0) {
    process.exit(1);
}
