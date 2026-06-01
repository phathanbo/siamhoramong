/**
 * 💰 พยากรณ์โชคลาภ - ลัคนา บ้าน 11
 *
 * อ้างอิง:
 * - ลัคนา (Lagna) - ตำแหน่งที่ราศีปรากฏตอนเกิด
 * - บ้าน 11 (Labhha/ลาภะ) = "ลาภ" = รายได้ โชคลาภ ความสุข
 * - Surya Siddhanta (สุริยยาตร์) - คัมภีร์โหราศาสตร์พื้นฐาน
 * - หลักการ: ดาวเกิด + บ้าน 11 → ระดับความร่ำรวย
 */

"use strict";

// ข้อมูลพยากรณ์โชคลาภตามดาว 9 ดวง
const FORTUNE_BY_PLANET = {
    1: {
        planet: "อาทิตย์",
        symbol: "☀️",
        fortune: "มีโชคลาภสูง ได้เงินทองจากอำนาจ",
        wealth: "ร่ำรวย (สูง)",
        income: "จากตำแหน่ง อำนาจ การเป็นนาย",
        prediction: "ชีวิตเต็มไปด้วยรายได้มั่นคง มีการอยู่เย็นเป็นสุข",
        strength: "บารมี อำนาจ ศักดิ์ยศ"
    },
    2: {
        planet: "จันทร์",
        symbol: "🌙",
        fortune: "โชคลาภปกติ รายได้สม่ำเสมอ",
        wealth: "ปกติ (กลาง)",
        income: "จากการทำงาน ศิลปะ ธุรกิจน้อย",
        prediction: "มีเสน่ห์สร้างมิตรภาพได้หลาย ได้รับการช่วยเหลือจากผู้อื่น",
        strength: "อารมณ์ดี ใจอ่อนโยน เป็นที่รักของคน"
    },
    3: {
        planet: "พฤหัสบดี",
        symbol: "♃",
        fortune: "โชคลาภสูงสุด ร่ำรวยจากตามชาติ",
        wealth: "ร่ำรวยมาก (สูงสุด)",
        income: "จากโอกาส ศาสนา การศึกษา บุญกุศล",
        prediction: "มีสติปัญญา ผู้ใหญ่เมตตา ชีวิตเจริญรุ่งเรือง",
        strength: "ปัญญา โชค ศรัทธา สมดุล"
    },
    5: {
        planet: "พุธ",
        symbol: "☿️",
        fortune: "โชคลาภผันผวน จากการค้าขาย",
        wealth: "ผันผวน (ปกติ)",
        income: "จากการค้า การเจรจา การติดต่อสื่อสาร",
        prediction: "มีไหวพริบ สามารถปรับตัว ต้องใช้สติปัญญา",
        strength: "ปัญญา ไหวพริบ การเจรจา เล่นหลัก"
    },
    6: {
        planet: "ศุกร์",
        symbol: "♀",
        fortune: "โชคลาภดี ร่ำรวยจากความงาม",
        wealth: "ร่ำรวย (สูง)",
        income: "จากศิลปะ ความสুขสำราญ การเพ้อ",
        prediction: "มีเสน่ห์เหลือล้น การเงินไหลมา จึงอยู่สบาย",
        strength: "เสน่ห์ ความงาม ความสุข"
    },
    8: {
        planet: "เสาร์",
        symbol: "♄",
        fortune: "โชคลาภจำกัด ต้องอดทน ทำงานหนัก",
        wealth: "จำกัด (ต่ำ)",
        income: "จากการแรงงาน การอดทน ลำเนากวาง",
        prediction: "ต้องพยายามหนัก แต่จะได้ผลในที่สุด ชีวิตมั่นคง",
        strength: "อดทน มั่นคง ความจริง"
    },
    9: {
        planet: "อังคาร",
        symbol: "♂",
        fortune: "โชคลาภขึ้นลง กล้าเสี่ยง",
        wealth: "ขึ้นลง (กลาง-สูง)",
        income: "จากความกล้า การสู้ศึก ธุรกิจเสี่ยง",
        prediction: "มีพลัง มีจิตใจแข็ง แต่ต้องระวังการพลิกผัน",
        strength: "กล้าหาญ พลัง ความรุ่งเรือง"
    }
};

// ข้อมูลบ้าน 11 (Labhha - ลาภะ)
const HOUSE_11_INFO = {
    name: "บ้าน 11 (ลาภะ)",
    meaning: "ลาภ = ลาภยศ รายได้ โชคลาภ ความสุข",
    description: "บ้าน 11 ศึกษาว่าคนนั้นจะมีรายได้มากน้อย มีโชคลาภ มีความสุขในชีวิตแค่ไหน",
    factors: [
        "ดาวเกิด (ตำแหน่งที่ราศีปรากฏ)",
        "ธาตุประจำปี (ไม้/ไฟ/ดิน/โลหะ/น้ำ)",
        "ปีนักษัตร (หนู/วัว/เสือ... / หมู)",
        "พลังดาวที่เกี่ยวข้อง"
    ]
};

function showFortunePage() {
    const container = document.getElementById('fortunePage');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">💰 พยากรณ์โชคลาภ - ลัคนา บ้าน 11</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา (Lagna) และบ้าน 11 (Labhha)</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิด:</strong></label>
                <input type="date" id="fortuneBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="calculateFortune()">
                <i class="fas fa-coins mr-2"></i>ทำนายโชคลาภ
            </button>

            <div id="fortuneResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ลัคนา (Lagna) - ตำแหน่งราศีตอนเกิด<br>
                ✓ บ้าน 11 (Labhha) = ลาภ/รายได้/โชคลาภ<br>
                ✓ Surya Siddhanta (สุริยยาตร์)<br>
                ✓ ดาว 9 ดวง และสิ่งที่เกี่ยวข้อง
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
 * 💰 ทำนายโชคลาภ
 */
function calculateFortune() {
    const birthDateEl = document.getElementById('fortuneBirthDate');
    const resultEl = document.getElementById('fortuneResult');

    if (!birthDateEl.value) {
        alert('⚠️ กรุณากรอกวันเกิด');
        return;
    }

    const birthDate = new Date(birthDateEl.value);
    const birthDay = birthDate.getDate();

    // คำนวณดาวเกิด
    const planetNum = (birthDay % 9) || 9;
    const planet = FORTUNE_BY_PLANET[planetNum];

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">💰 ผลการทำนายโชคลาภ</h4>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">⭐ ดาวเกิดของคุณ</h6>
                    <p class="mb-2"><strong>${planet.symbol} ${planet.planet}</strong></p>
                    <p class="small mb-0">บ้าน 11 (ลาภะ) = รายได้ โชคลาภ ความสุข</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💎 ระดับโชคลาภ</h6>
                    <p class="mb-2"><strong>${planet.wealth}</strong></p>
                    <p class="small mb-0">${planet.fortune}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💵 แหล่งรายได้</h6>
                    <p class="small mb-0">${planet.income}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">🔮 พยากรณ์</h6>
                    <p class="small mb-0">${planet.prediction}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💪 จุดแข็ง</h6>
                    <p class="small mb-0">${planet.strength}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold">
                <div class="card-body">
                    <h6 class="text-gold mb-2">📋 เกี่ยวกับบ้าน 11 (ลาภะ)</h6>
                    <p class="small mb-2"><strong>${HOUSE_11_INFO.name}</strong></p>
                    <p class="small mb-2"><strong>ความหมาย:</strong> ${HOUSE_11_INFO.meaning}</p>
                    <p class="small mb-2"><strong>ศึกษา:</strong> ${HOUSE_11_INFO.description}</p>
                    <p class="small mb-0"><strong>ปัจจัยที่เกี่ยวข้อง:</strong></p>
                    <ul class="small list-unstyled">
                        ${HOUSE_11_INFO.factors.map(f => `<li>• ${f}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="alert alert-secondary small mt-3">
                <strong>💡 คำแนะนำ:</strong><br>
                โชคลาภนั้นเกิดจากหลายปัจจัย ควรศึกษาลัคนาเต็มรูปแบบ<br>
                รวมทั้งบุญ การทำงาน และการอดทนจึงจะประสบความสำเร็จได้
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showFortunePage();
    console.log("✅ Fortune.js loaded - อิงลัคนา บ้าน 11 (authentic Thai astrology)");
});

window.calculateFortune = calculateFortune;
