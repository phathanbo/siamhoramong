/**
 * 💎 ข้อมูลความมั่งคั่ง - ลัคนา + ธาตุ + ดาว
 *
 * อ้างอิง:
 * - ลัคนา (Lagna) - ตำแหน่งที่ราศีปรากฏตอนเกิด
 * - ธาตุ 5 ประการ (Wu Xing) - ไม้/ไฟ/ดิน/โลหะ/น้ำ
 * - ดาว 9 ดวง (Navagraha) - ดวงอาทิตย์ จันทร์ สิงห์ฯลฯ
 * - หลักการ: การสะสมทรัพย์ = ลัคนา + ธาตุ + ดาว + บ้าน 11
 */

"use strict";

// ข้อมูลการสะสมทรัพย์ตามธาตุ 5 ประการ
const WEALTH_BY_ELEMENT = {
    0: {
        name: "ไม้",
        symbol: "♻️",
        character: "โตเร็ว เต้าท่วม เจริญรวดเร็ว",
        wealth_pattern: "ร่ำรวยแบบสั้นหน้า ได้เร็ว หายเร็ว",
        strength: "การรุ่งเรือง ความเจริญที่รวดเร็ว",
        weakness: "ความไม่มั่นคง อาจสูญเสียได้เร็ว",
        advice: "ควรสนับสนุนด้วยธาตุไม้และน้ำ หลีกเลี่ยงโลหะ"
    },
    1: {
        name: "ไฟ",
        symbol: "🔥",
        character: "ร้อนรุ่ง เปี่ยมปอมด้วยพลัง",
        wealth_pattern: "มีความปรารถนาสูง ต้องการความมั่งคั่งมาก",
        strength: "พลังความต้องการ ความกล้าเสี่ยง",
        weakness: "อาจเสียหายจากอบายมุข ตัดสินใจรีบ",
        advice: "ควรปรึกษาหารือก่อนตัดสินใจ หลีกเลี่ยงการเสี่ยง"
    },
    2: {
        name: "ดิน",
        symbol: "🏔️",
        character: "มั่นคง เสถียร ยั่งยืน",
        wealth_pattern: "สะสมอย่างช้า ๆ แต่มั่นคง ยั่งยืน",
        strength: "ความมั่นคง การสะสมที่ยั่งยืน",
        weakness: "อาจสะสมช้า ขาดความยืดหยุ่น",
        advice: "ประยุกต์ใช้ไม้และอีกธาตุเพื่อความสมดุล"
    },
    3: {
        name: "โลหะ",
        symbol: "⚔️",
        character: "เข้มแข็ง ตัดสินใจไว",
        wealth_pattern: "เก็บรักษาเงินได้ดี ความมั่งคั่งถูกคุ้มครอง",
        strength: "ความเข้มแข็ง การป้องกัน การเก็บรักษา",
        weakness: "อาจเก็บเนื้อเก็บตัวมากเกินไป",
        advice: "ควรสมดุลด้วยไม้เพื่อความเจริญรุ่งเรือง"
    },
    4: {
        name: "น้ำ",
        symbol: "💧",
        character: "ไหลเบา เปลี่ยนแปลง ปรับตัวได้",
        wealth_pattern: "ความมั่งคั่งไหลมาไหลไป เปลี่ยนแปลง",
        strength: "การปรับตัว ความยืดหยุ่น ความสอบเสบ",
        weakness: "ความไม่มั่นคง อาจหลุดมือได้ง่าย",
        advice: "ต้องอดทนและสะสมอย่างสม่ำเสมอ"
    }
};

// การรวมกันของลัคนาและธาตุ
const WEALTH_COMPATIBILITY = {
    high: {
        title: "ความมั่งคั่งสูง",
        description: "มีเกณฑ์ดีจากลัคนา ดาว และธาตุ",
        percentage: "70-100%",
        advice: "ควรใช้โอกาสนี้เพื่อสะสมทรัพย์อย่างสุดความสามารถ"
    },
    medium: {
        title: "ความมั่งคั่งปานกลาง",
        description: "มีเกณฑ์ปานกลาง ต้องการความพยายาม",
        percentage: "40-70%",
        advice: "ต้องทำงานหนักและอดทนเพื่อให้ได้ผลลัพธ์"
    },
    low: {
        title: "ความมั่งคั่งจำกัด",
        description: "มีเกณฑ์ต่ำ ต้องใช้วิธีอื่นเสริม",
        percentage: "10-40%",
        advice: "ควรทำบุญ สนับสนุนด้วยดาวและสี และเพิ่มความอดทน"
    }
};

// ปัจจัยที่ส่งผลต่อความมั่งคั่ง
const WEALTH_FACTORS = [
    { factor: "ลัคนา (Lagna)", impact: "พื้นฐาน", description: "ตำแหน่งราศีตอนเกิด" },
    { factor: "ดาว 9 ดวง", impact: "สูง", description: "ธรรมชาติ คุณสมบัติ" },
    { factor: "ธาตุ 5 ประการ", impact: "สูง", description: "รูปแบบการสะสม" },
    { factor: "บ้าน 11 (ลาภะ)", impact: "สำคัญ", description: "รายได้ โชคลาภ ความสุข" },
    { factor: "ปีนักษัตร", impact: "กลาง", description: "ลักษณะทั่วไปของปี" },
    { factor: "บุญ/การทำบุญ", impact: "สูง", description: "ผลกรรมจากการกระทำ" }
];

// ข้อแนะนำการเพิ่มความมั่งคั่ง
const WEALTH_RECOMMENDATIONS = {
    general: [
        "ทำการค้าหรือธุรกิจที่สอดคล้องกับธาตุของคุณ",
        "สนับสนุนด้วยสีมงคล และเลขมงคล",
        "ทำบุญอย่างสม่ำเสมอเพื่อเพิ่มการได้",
        "ปรึกษานักโหรามืออาชีพสำหรับวิธีการเพิ่มเติม"
    ],
    byElement: {
        0: "กำหนดเป้าหมายสูงและเร่งความเจริญ",
        1: "จงระวังความรีบและการเสี่ยงโดยตัวแปร",
        2: "พยายามสะสมอย่างช้า ๆ แต่อย่างไม่ขาดสาย",
        3: "เก็บรักษาทรัพย์ให้ดี หลีกเลี่ยงการใช้จ่ายเกินตัว",
        4: "ต้องพยายามสะสมให้มั่นคง ไม่ให้เสียหาย"
    }
};

function showWealthDataPage() {
    const container = document.getElementById('fortuneWealthDataSection');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">💎 ข้อมูลความมั่งคั่ง - ลัคนา + ธาตุ</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา ธาตุ 5 ประการ และดาว 9 ดวง</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิด:</strong></label>
                <input type="date" id="wealthBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <div class="form-group">
                <label class="text-gold"><strong>📅 ปีเกิด (ค.ศ.):</strong></label>
                <input type="number" id="wealthBirthYear" class="form-control bg-dark text-gold border-gold" placeholder="1990">
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeWealth()">
                <i class="fas fa-gem mr-2"></i>วิเคราะห์ความมั่งคั่ง
            </button>

            <div id="wealthResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ลัคนา (Lagna) - ตำแหน่งราศีตอนเกิด<br>
                ✓ ธาตุ 5 ประการ (Wu Xing) - ไม้/ไฟ/ดิน/โลหะ/น้ำ<br>
                ✓ ดาว 9 ดวง (Navagraha)<br>
                ✓ บ้าน 11 (Labhha) = ลาภ/ความมั่งคั่ง
            </div>

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
    container.innerHTML = html;
}

/**
 * 💎 วิเคราะห์ความมั่งคั่ง
 */
function analyzeWealth() {
    const birthDateEl = document.getElementById('wealthBirthDate');
    const birthYearEl = document.getElementById('wealthBirthYear');
    const resultEl = document.getElementById('wealthResult');

    if (!birthDateEl.value || !birthYearEl.value) {
        alert('⚠️ กรุณากรอกวันเกิดและปีเกิด');
        return;
    }

    const birthDate = new Date(birthDateEl.value);
    const birthDay = birthDate.getDate();
    const birthYear = parseInt(birthYearEl.value);

    // คำนวณธาตุ
    const elementIndex = (birthYear - 1900) % 5;
    const element = WEALTH_BY_ELEMENT[elementIndex];

    // คำนวณความมั่งคั่งรวม
    const wealthScore = ((birthDay + birthYear) % 100);
    let wealthLevel;
    if (wealthScore >= 70) wealthLevel = WEALTH_COMPATIBILITY.high;
    else if (wealthScore >= 40) wealthLevel = WEALTH_COMPATIBILITY.medium;
    else wealthLevel = WEALTH_COMPATIBILITY.low;

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">💎 ผลการวิเคราะห์ความมั่งคั่ง</h4>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">🌀 ธาตุประจำปีเกิด</h6>
                    <p class="mb-2"><strong>${element.symbol} ${element.name}</strong></p>
                    <p class="small mb-2">ลักษณะ: ${element.character}</p>
                    <p class="small mb-0">รูปแบบการสะสม: ${element.wealth_pattern}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💰 ระดับความมั่งคั่ง</h6>
                    <p class="mb-2"><strong>${wealthLevel.title}</strong></p>
                    <p class="small mb-2">ร้อยละ: ${wealthLevel.percentage}</p>
                    <p class="small mb-0">${wealthLevel.description}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💪 จุดแข็ง</h6>
                    <p class="small mb-0">${element.strength}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">⚠️ จุดท้าทาย</h6>
                    <p class="small mb-0">${element.weakness}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💡 คำแนะนำ</h6>
                    <p class="small mb-2">${element.advice}</p>
                    <p class="small mb-0">${wealthLevel.advice}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold">
                <div class="card-body">
                    <h6 class="text-gold mb-2">📋 ปัจจัยที่ส่งผลต่อความมั่งคั่ง</h6>
                    <table class="small w-100">
                        <tr class="border-bottom border-gold-30">
                            <td class="text-gold"><strong>ปัจจัย</strong></td>
                            <td class="text-gold"><strong>ผลกระทบ</strong></td>
                        </tr>
                        ${WEALTH_FACTORS.map(f => `
                        <tr class="border-bottom border-gold-30">
                            <td>${f.factor}</td>
                            <td>${f.impact}</td>
                        </tr>
                        `).join('')}
                    </table>
                </div>
            </div>

            <div class="alert alert-secondary small mt-3">
                <strong>💡 เศษวิทยา:</strong><br>
                ความมั่งคั่งขึ้นอยู่กับหลายปัจจัย<br>
                ควรศึกษาลัคนาเต็มรูปแบบ รวมทั้งบุญและการทำบุญเพื่อสร้างความมั่งคั่งที่ยั่งยืน
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showWealthDataPage();
});

window.analyzeWealth = analyzeWealth;
