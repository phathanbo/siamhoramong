/**
 * 💑 ความสัมพันธ์ - ลัคนา บ้าน 7
 *
 * อ้างอิง:
 * - ลัคนา (Lagna) - ตำแหน่งที่ราศีปรากฏตอนเกิด
 * - บ้าน 7 (Patni/ปัตนิ) = "สิ่งตรงข้าม" = คู่สัญญา แต่งงาน ความสัมพันธ์
 * - Surya Siddhanta (สุริยยาตร์) - คัมภีร์โหราศาสตร์พื้นฐาน
 * - หลักการ: ดาวเกิด + บ้าน 7 = คู่ชีวิตที่เหมาะสม
 */

"use strict";

// บ้าน 7 ลัคนา - ลักษณะคู่ชีวิต (อิงดาว 9 ดวง)
const PATNI_BY_PLANET = {
    1: {
        planet: "อาทิตย์",
        symbol: "☀️",
        character: "ผู้นำ มีบารมี อิสระสูง",
        partner: "ต้องการคู่ที่เกื้อหนุน รองรับได้",
        strength: "จงรักษา ความสัมพันธ์จำเป็นต้องอาศัยเรียนรู้ร่วมกัน",
        weakness: "อาจดื้อรั้น ต้องการพื้นที่ส่วนตัว",
        suitable: "ผู้ที่เข้าใจความปรารถนาของคุณ มีสติปัญญา"
    },
    2: {
        planet: "จันทร์",
        symbol: "🌙",
        character: "อ่อนโยน อารมณ์ไม่เสถียร รักการหลีกเลี่ยงขัดแย้ง",
        partner: "ต้องการคู่ที่ใจเย็น มีเสน่ห์บาดใจ",
        strength: "มีจินตนาการ เมตตา จิตสัตว์",
        weakness: "ใจอ่อน ลังเลง่าย ต้องการความรักคอยโปรดปรี",
        suitable: "ผู้ที่อ่อนโยน มีความเห็นใจ ยืดหยุ่นในการแก้ไข"
    },
    3: {
        planet: "พฤหัสบดี",
        symbol: "♃",
        character: "เจริญสำเร็จ โชคดี มีปัญญา หวังผล",
        partner: "ต้องการคู่ที่มีศรัทธา คนดี มีการศึกษา",
        strength: "เสน่ห์ดี ได้รับความเมตตา มีโชคลาภ",
        weakness: "อาจคาดหวังสูง ต้องการให้คู่นั้นสมบูรณ์",
        suitable: "ผู้ที่เก่งการศึกษา ใจดี ศรัทธาสูง"
    },
    5: {
        planet: "พุธ",
        symbol: "☿️",
        character: "ปัญญาชาญ ว่องไว ช่างพูด ปรับตัวเก่ง",
        partner: "ต้องการคู่ที่สัญญาณสอบ เรียบรอบ ไม่เหมือนใจ",
        strength: "ไหวพริบ ช่างเจรจา หาเหตุผลได้",
        weakness: "ความกระสับกระส่าย ใจไม่เสถียร ต้องกิจกรรมแบบไม่เดียวกัน",
        suitable: "ผู้ที่มีไหวพริบ สามารถสนทนาได้ดี เข้าใจความวิวิธพันธ์"
    },
    6: {
        planet: "ศุกร์",
        symbol: "♀",
        character: "ความสุข ความงาม รัก ศิลป์ สุนทรียภาพ",
        partner: "ต้องการคู่ที่มีเสน่ห์ รักการชีวิตสวย ๆ",
        strength: "มีเสน่ห์เหลือล้น การเงินดี รักษาความเย็นเป็นเนื้อเดียวกัน",
        weakness: "อาจไม่ยุ่งกับปัญหาเข้ามา ชอบความสบาย เลิกง่าย",
        suitable: "ผู้ที่มีเสน่ห์ รักษาความเอิ่มที่สวย ๆ ห่วงใจเหมือนกัน"
    },
    8: {
        planet: "เสาร์",
        symbol: "♄",
        character: "ความจริง ความเด็ดเดี่ยว อดทน ความอดทนสูง",
        partner: "ต้องการคู่ที่มีหลักการ เสถียร ยืดหยุ่นในการแก้ไขตัว",
        strength: "มั่นคง ยาวนาน มีสติ หมั่นทำ",
        weakness: "หนักแน่น ลึก ต้องการเวลายาวนาน เข้าใจ",
        suitable: "ผู้ที่มั่นคง ซื่อสัตย์ พร้อมก้าวอดทนด้วยกัน"
    },
    9: {
        planet: "อังคาร",
        symbol: "♂",
        character: "กล้าหาญ พลัง ร้อนรุ่ง ความรุ่งเรือง พลังใจสูง",
        partner: "ต้องการคู่ที่กล้า มีพลัง สามารถปรับตัว",
        strength: "กล้า มีพลังขับเคลื่อน สู้ชีวิต มีจิตใจอย่างแข็งแรง",
        weakness: "อารมณ์ร้อน จิตใจอาจรุ่งเรือง ต้องการให้เข้าใจตัวเอง",
        suitable: "ผู้ที่กล้า มีพลัง สามารถสื่อสารความรู้สึกได้อย่างตรงไปตรงมา"
    }
};

function showRelationPage() {
    const container = document.getElementById('relationPage');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">💑 วิเคราะห์ความสัมพันธ์ - ลัคนา บ้าน 7</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา (Lagna) และบ้าน 7 (Patni)</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิดของคุณ:</strong></label>
                <input type="date" id="yourBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิดของคู่:</strong></label>
                <input type="date" id="partnerBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeRelation()">
                <i class="fas fa-heart mr-2"></i>วิเคราะห์ความสัมพันธ์
            </button>

            <div id="relationResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ลัคนา (Lagna) - ตำแหน่งราศีตอนเกิด<br>
                ✓ บ้าน 7 (Patni/ปัตนิ) = คู่สัญญา แต่งงาน<br>
                ✓ Surya Siddhanta (สุริยยาตร์)<br>
                ✓ ดาว 9 ดวง และลักษณะบุคลิกของแต่ละดาว
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
 * 💑 วิเคราะห์ความสัมพันธ์
 */
function analyzeRelation() {
    const yourDateEl = document.getElementById('yourBirthDate');
    const partnerDateEl = document.getElementById('partnerBirthDate');
    const resultEl = document.getElementById('relationResult');

    if (!yourDateEl.value || !partnerDateEl.value) {
        alert('⚠️ กรุณากรอกวันเกิดของทั้งคู่');
        return;
    }

    const yourDate = new Date(yourDateEl.value);
    const partnerDate = new Date(partnerDateEl.value);

    const yourDay = yourDate.getDate();
    const partnerDay = partnerDate.getDate();

    // ดึงข้อมูลดาวเกิด
    const yourPlanetNum = (yourDay % 9) || 9;
    const partnerPlanetNum = (partnerDay % 9) || 9;

    const yourPlanet = PATNI_BY_PLANET[yourPlanetNum];
    const partnerPlanet = PATNI_BY_PLANET[partnerPlanetNum];

    // คำนวณความเข้ากัน (ตามหลักลัคนา)
    const planetDiff = Math.abs(yourPlanetNum - partnerPlanetNum);
    const compatibility = 100 - (planetDiff * 10);

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">💑 ผลวิเคราะห์ความสัมพันธ์</h4>

            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold-30 p-3">
                        <h6 class="text-gold">👤 ข้อมูลของคุณ</h6>
                        <p class="mb-2"><strong>${yourPlanet.symbol} ${yourPlanet.planet}</strong></p>
                        <p class="small mb-2"><strong>ลักษณะ:</strong> ${yourPlanet.character}</p>
                        <p class="small mb-2"><strong>จุดแข็ง:</strong> ${yourPlanet.strength}</p>
                        <p class="small"><strong>จุดท้าทาย:</strong> ${yourPlanet.weakness}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-dark border-gold-30 p-3">
                        <h6 class="text-gold">👤 ข้อมูลของคู่</h6>
                        <p class="mb-2"><strong>${partnerPlanet.symbol} ${partnerPlanet.planet}</strong></p>
                        <p class="small mb-2"><strong>ลักษณะ:</strong> ${partnerPlanet.character}</p>
                        <p class="small mb-2"><strong>จุดแข็ง:</strong> ${partnerPlanet.strength}</p>
                        <p class="small"><strong>จุดท้าทาย:</strong> ${partnerPlanet.weakness}</p>
                    </div>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-3">💕 ความเข้ากัน</h6>
                    <div class="progress mb-2" style="height: 25px;">
                        <div class="progress-bar bg-success" style="width: ${Math.max(compatibility, 0)}%;">
                            ${Math.max(compatibility, 0)}%
                        </div>
                    </div>
                    <p class="small">${
                        compatibility >= 80 ? '✅ เข้ากันดีมาก - ความสัมพันธ์มีพื้นฐานดี' :
                        compatibility >= 60 ? '⚠️ เข้ากันได้ - ต้องเรียนรู้ร่วมกัน' :
                        compatibility >= 30 ? '⚠️ ต้องระวัง - ต้องเข้าใจกันดีขึ้น' :
                        '❌ ต้องอดทนและสื่อสารกันเยอะ'
                    }</p>
                </div>
            </div>

            <div class="alert alert-secondary small">
                <strong>💡 คำแนะนำ:</strong><br>
                ความสัมพันธ์ที่ยั่งยืนต้อง: ความเข้าใจ การสื่อสาร และความอดทนร่วมกัน<br>
                ควรศึกษาลัคนาเต็มรูปแบบสำหรับการวิเคราะห์ที่แม่นยำยิ่งขึ้น
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showRelationPage();
});

window.analyzeRelation = analyzeRelation;
