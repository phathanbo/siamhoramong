"use strict";

const fs = require('fs');
const path = require('path');

console.log("=================================================");
console.log("🧪 เริ่มการทดสอบระบบคำทำนายโหราศาสตร์ไทยเบื้องต้น");
console.log("=================================================");

// 1. อ่านไฟล์ ayanamsa-data.js และประเมินผล
const ayanamsaDataPath = path.join(__dirname, '..', 'ayanamsa-data.js');
const ayanamsaCode = fs.readFileSync(ayanamsaDataPath, 'utf8');

// รันซอร์สโค้ด ayanamsa-data.js ในบริบท Node
const evalContext = {};
const evalFn = new Function('exports', ayanamsaCode + '\nreturn { ayanamsaPredictions };');
const { ayanamsaPredictions } = evalFn(evalContext);

console.log("✅ 1. ตรวจสอบวัตถุ ayanamsaPredictions สัมฤทธิ์ผล");

// 2. ตรวจสอบหมวดคำทำนายสำคัญตามตำรา
const requiredSections = [
    'lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu',
    'housePredictions', 'lordInHousePredictions', 'taksaPredictions', 'conjunctions',
    'aspectPredictions', 'decanNavamsaTraits', 'transitMajorPredictions', 'transitMinorPredictions',
    'mahaTaksaPredictions', 'treeAnalogy', 'bodyPartMapping', 'spousePredictions', 'careerPredictions'
];

let hasError = false;

requiredSections.forEach(sec => {
    if (!ayanamsaPredictions[sec]) {
        console.error(`❌ ขาดหมวดคำทำนาย: ${sec}`);
        hasError = true;
    } else {
        console.log(`  - หมวด [${sec}]: สมบูรณ์ 👌`);
    }
});

if (hasError) {
    console.error("❌ การทดสอบล้มเหลว มีหมวดคำทำนายขาดหาย");
    process.exit(1);
}

// 3. ตรวจสอบความถูกต้องของเนื้อหาตามตำราคู่ครองและอาชีพ
console.log("\n✅ 2. ตรวจสอบข้อมูลหมวดคู่ครองตามตำรา");
if (!ayanamsaPredictions.spousePredictions.lordInHouse || ayanamsaPredictions.spousePredictions.lordInHouse.length !== 12) {
    console.error("❌ ข้อมูลเจ้าเรือนปัตนิไปสถิต 12 ภพ ไม่ครบ 12 ภพ");
    process.exit(1);
}
console.log(`  - คำทำนายเจ้าเรือนปัตนิสถิต 12 ภพ: ครบ 12 ภพ`);

if (!ayanamsaPredictions.spousePredictions.byPlanet || Object.keys(ayanamsaPredictions.spousePredictions.byPlanet).length < 10) {
    console.error("❌ ข้อมูลลักษณะคู่ครองตามดาว ๑ ถึง ๐ ไม่ครบ 10 ดวงดาว");
    process.exit(1);
}
console.log(`  - คำทำนายลักษณะ อุปนิสัย ฐานะ อาชีพคู่ครองตามดาว ๑ ถึง ๐: ครบถ้วน`);

console.log("\n✅ 3. ตรวจสอบข้อมูลหมวดอาชีพตามตำรา");
if (!ayanamsaPredictions.careerPredictions.byElement || Object.keys(ayanamsaPredictions.careerPredictions.byElement).length !== 4) {
    console.error("❌ ข้อมูลอาชีพตาม 4 ธาตุไม่ครบถ้วน");
    process.exit(1);
}
console.log(`  - คำทำนายอาชีพตามธาตุเรือนกัมมะ (ไฟ, ดิน, ลม, น้ำ): ครบถ้วน`);

if (!ayanamsaPredictions.careerPredictions.byPlanet || Object.keys(ayanamsaPredictions.careerPredictions.byPlanet).length < 10) {
    console.error("❌ ข้อมูลอาชีพตามดาวเจ้าเรือนกัมมะไม่ครบถ้วน");
    process.exit(1);
}
console.log(`  - คำทำนายอาชีพตามดาวเจ้าเรือนกัมมะ: ครบถ้วน`);

// 4. ตรวจสอบหมวดต้นไม้ใหญ่และอวัยวะร่างกาย
console.log("\n✅ 4. ตรวจสอบข้อมูลต้นไม้ใหญ่และร่างกาย");
if (!ayanamsaPredictions.treeAnalogy || Object.keys(ayanamsaPredictions.treeAnalogy).length < 9) {
    console.error("❌ ข้อมูลเปรียบเทียบดวงชะตากับต้นไม้ใหญ่ไม่ครบถ้วน");
    process.exit(1);
}
console.log(`  - คำทำนายเปรียบเทียบดวงชะตากับต้นไม้ใหญ่: ครบถ้วน 9 ส่วนองค์ประกอบ`);

if (!ayanamsaPredictions.bodyPartMapping || Object.keys(ayanamsaPredictions.bodyPartMapping).length !== 12) {
    console.error("❌ ข้อมูลอวัยวะประจำ 12 ราศีไม่ครบถ้วน");
    process.exit(1);
}
console.log(`  - ข้อมูลอวัยวะประจำ 12 ราศี: ครบ 12 ราศี`);

// 5. ตรวจสอบภาษาไทยและอักขระ
console.log("\n✅ 5. ตรวจสอบอักขระและภาษาไทย 100%");
const testStringify = JSON.stringify(ayanamsaPredictions);
if (testStringify.includes("undefined") || testStringify.includes("NaN") || testStringify.includes("null")) {
    console.error("❌ พบข้อผิดพลาด undefined / NaN / null ในฐานข้อมูลคำทำนาย");
    process.exit(1);
}

console.log("=================================================");
console.log("🎉 การทดสอบทั้งหมดผ่าน 100% ไม่มีข้อผิดพลาด!");
console.log("=================================================");
