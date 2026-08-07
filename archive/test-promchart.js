/**
 * 🧪 TEST SCRIPT: Promchart Age Calculator Verification
 * ตรวจสอบความถูกต้องของสูตรคำนวณวงล้อพรหมชาติสำหรับชายและหญิง
 */

const fs = require('fs');
const path = require('path');

// จำลองการโหลดไฟล์ promchart.js
const promchartCode = fs.readFileSync(path.join(__dirname, 'promchart.js'), 'utf8');

// ดึงตัวแปร PROMCHART_DATA ออกมาทดสอบ
const promchartDataMatch = promchartCode.match(/const PROMCHART_DATA = (\[[\s\S]*?\]);/);
if (!promchartDataMatch) {
    console.error("❌ [FAIL] ไม่พบตาราง PROMCHART_DATA ในไฟล์ promchart.js");
    process.exit(1);
}

const PROMCHART_DATA = eval(promchartDataMatch[1]);

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("🧪 PROMCHART AGE ASTROLOGY - UNIT TEST SUITE");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

let passCount = 0;
let failCount = 0;

function testCalculation(age, gender, expectedPos, expectedName) {
    let position;
    const rem = ((age - 1) % 12) + 1;
    if (gender === 'male') {
        position = rem;
    } else {
        position = (rem === 1) ? 1 : (14 - rem);
    }

    const data = PROMCHART_DATA[position - 1];
    const isPass = (position === expectedPos && data.name === expectedName);

    if (isPass) {
        console.log(`  ✅ [PASS] ${gender === 'male' ? '🧑 ชาย ' : '👩 หญิง'} อายุ ${age} ปี -> ตำแหน่งที่ ${position}: ${data.name}`);
        passCount++;
    } else {
        console.error(`  ❌ [FAIL] ${gender === 'male' ? '🧑 ชาย ' : '👩 หญิง'} อายุ ${age} ปี -> ได้ตำแหน่ง ${position}: ${data ? data.name : 'undefined'}, คาดหวัง: ตำแหน่ง ${expectedPos}: ${expectedName}`);
        failCount++;
    }
}

console.log("📌 1. ตรวจสอบข้อมูลตารางพรหมชาติ 12 ตำแหน่ง:");
if (PROMCHART_DATA.length === 12) {
    console.log("  ✅ [PASS] ตารางพรหมชาติมีครบถ้วน 12 ตำแหน่ง");
    passCount++;
} else {
    console.error(`  ❌ [FAIL] ตารางพรหมชาติมี ${PROMCHART_DATA.length} ตำแหน่ง (คาดหวัง 12)`);
    failCount++;
}


console.log("\n📌 2. ตรวจสอบความละเอียดของฐานข้อมูลแยกมิติครบทุกตำแหน่ง:");
const requiredDimensionKeys = ['work', 'money', 'love', 'health', 'caution', 'remedy'];
PROMCHART_DATA.forEach((item) => {
    const hasBaseFields = item.position && item.name && item.meaning && item.detail && item.rating && item.tone && item.sourceNote;
    const hasDimensions = item.dimensions && requiredDimensionKeys.every(key => typeof item.dimensions[key] === 'string' && item.dimensions[key].length >= 80);
    const hasDetailedOverview = typeof item.detail === 'string' && item.detail.length >= 120;
    if (hasBaseFields && hasDimensions && hasDetailedOverview) {
        console.log(`  ✅ [PASS] ตำแหน่ง ${item.position}: ${item.name} มีข้อมูลภาพรวมและ 6 มิติครบถ้วน`);
        passCount++;
    } else {
        console.error(`  ❌ [FAIL] ตำแหน่ง ${item.position}: ${item.name} ข้อมูลแยกมิติยังไม่ครบหรือสั้นเกินไป`);
        failCount++;
    }
});
console.log("\n📌 3. ตรวจสอบสูตรคำนวณสำหรับชาย (นับเวียนขวา):");
testCalculation(1, 'male', 1, 'เจดีย์');
testCalculation(2, 'male', 2, 'ฉัตรเงิน');
testCalculation(6, 'male', 6, 'ราหู');
testCalculation(12, 'male', 12, 'นาคราช');
testCalculation(13, 'male', 1, 'เจดีย์');
testCalculation(25, 'male', 1, 'เจดีย์');

console.log("\n📌 4. ตรวจสอบสูตรคำนวณสำหรับหญิง (นับเวียนซ้าย):");
testCalculation(1, 'female', 1, 'เจดีย์');
testCalculation(2, 'female', 12, 'นาคราช');
testCalculation(3, 'female', 11, 'แม่มด');
testCalculation(12, 'female', 2, 'ฉัตรเงิน');
testCalculation(13, 'female', 1, 'เจดีย์');
testCalculation(25, 'female', 1, 'เจดีย์');

console.log("\n════════════════════════════════════════════════════════════════════════════════");
console.log(`🏁 PROMCHART TEST SUMMARY: Total Checks: ${passCount + failCount} | ✅ Valid: ${passCount} | ❌ Failed: ${failCount}`);
console.log("════════════════════════════════════════════════════════════════════════════════\n");

if (failCount > 0) {
    process.exit(1);
}
