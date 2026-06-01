/**
 * 🎡 วงล้อพยากรณ์ - ตำราพรหมชาติ
 *
 * อ้างอิง:
 * - ตำราพรหมชาติ (Brahmasat) - ตำราโหราศาสตร์ไทยโบราณ
 * - วงล้อ 12 ตำแหน่ง = 12 ส่วนของปี หรือ 12 เดือน
 * - วิธีคำนวณ: นับปี/เดือนตั้งแต่ปีเกิด เวียนไปตามวงล้อ
 * - ใช้ได้กับทั้งชาย (นับขวา) และหญิง (นับซ้าย)
 *
 * หมายเหตุ: วงล้อพยากรณ์เป็นศาสตร์การตีความตามตำราโบราณ
 */

"use strict";

// ข้อมูลคำทำนายพรหมชาติ 12 ตำแหน่ง (อิงตำราพรหมชาติ)
const PROMCHART_DATA = [
  {
    position: 1,
    name: "เจดีย์",
    meaning: "มงคลสูง",
    detail: "ปีนั้นจะอยู่ร่มเย็นเป็นสุข จะมีความสุขกายสบายใจ จะได้ทำบุญกุศลในศาสนา ปรารถนาสิ่งใด ย่อมได้สมใจนึกแล",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    position: 2,
    name: "ฉัตรเงิน",
    meaning: "ลาภปกติ",
    detail: "ปีนั้นจะมีลาภผลเงินทอง ใช้พอสบายไม่เดือดร้อนกายในครอบครัว ไปทางไหนทิศใด จะมีคนอุปถัมภ์ค้ำชูพอประมาณแล",
    rating: "⭐⭐⭐⭐"
  },
  {
    position: 3,
    name: "คอขาด",
    meaning: "ลางร้าย",
    detail: "ปีนั้นจะประสบความร้อนอกร้อนใจ จะมีคดีความถึงโรงถึงศาลทำให้ต้องเสียเงินทองของรัก ต้องระวัง",
    rating: "⭐"
  },
  {
    position: 4,
    name: "เรือนหลวง",
    meaning: "มงคลมาก",
    detail: "ปีนั้นจะดีมีความสุขกายสบายใจ จะมีที่พึ่งพิงในความอนุเคราะห์ เป็นข้าราชการจะได้เลื่อนยศฐาบรรดาศักดิ์ดีแล",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    position: 5,
    name: "ปราสาท",
    meaning: "มงคลสูงสุด",
    detail: "ปีนั้นว่าจะมีความสุขอย่างยิ่ง จะประสบโชคลาภมากมายในชีวิต คิดสิ่งใดจะได้สมความปรารถนา ดีนักแล",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    position: 6,
    name: "ราหู",
    meaning: "ลางร้ายสุด",
    detail: "ปีนั้นจะเดือดร้อนใจอาจจะมีเรื่องทะเลาะวิวาท มีคนมาคอยยุแหย่ให้วุ่นวาย มีอาการเจ็บป่วยเป็นประจำ ต้องระวังมาก",
    rating: "⭐"
  },
  {
    position: 7,
    name: "ฉัตรทอง",
    meaning: "มงคลสูง",
    detail: "ปีนั้นจะมีเกียรติยศปรากฏในฝูงชนทั่วไป ไปสารทิศใดๆจะมีคนคอยอุปถัมภ์ค้ำชู ไม่เดือดร้อนเลย ดีมากแล",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    position: 8,
    name: "เทวดาขี่เต่า",
    meaning: "มงคลปกติ",
    detail: "ปีนั้นค่อนข้างดี จะมีคนคอยช่วยเหลือในหน้าที่การงาน แต่ระวังบริวารจะนำความเดือดร้อนมาให้ ดีปานกลางแล",
    rating: "⭐⭐⭐"
  },
  {
    position: 9,
    name: "คนต้องข้อคา",
    meaning: "ลางร้าย",
    detail: "ปีนั้นถึงคราวเคราะห์หามยามร้ายจะมีเรื่องวุ่นวายในตนและครอบครัว ไม่มีความสุขกายสบายใจเลย",
    rating: "⭐"
  },
  {
    position: 10,
    name: "พ่อมด",
    meaning: "มงคลปานกลาง",
    detail: "ปีนั้นจะมีคนมาขอความช่วยเหลือรับอาสาเจ้านายจะได้ดี จะมีความทุกข์กายทุกข์ใจพอประมาณ ดีปานกลางแล",
    rating: "⭐⭐⭐"
  },
  {
    position: 11,
    name: "แม่มด",
    meaning: "มงคลปานกลาง",
    detail: "ปีนั้นจะมีคนนำลาภมาให้ แต่ต้องแลกเปลี่ยนกับความช่วยเหลือจากตน มีความสบายใจพอประมาณแต่เหนื่อยใจปานกลางแล",
    rating: "⭐⭐⭐"
  },
  {
    position: 12,
    name: "นาคราช",
    meaning: "มงคลปานกลาง",
    detail: "ปีนั้นจะมีอำนาจวาสนา ชะตากำลังดี มีคนมาอ่อนน้อมยอมเป็นคนรับใช้ แต่ให้ระวังคำพูดและอารมณ์ให้มาก ดีปานกลางแล",
    rating: "⭐⭐⭐"
  }
];

function showPromchartPage() {
    const container = document.getElementById('promchartSection');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">🎡 วงล้อพยากรณ์ - ตำราพรหมชาติ</h2>
            <p class="text-white-50 mb-0 small">✨ อิงตำราโหราศาสตร์ไทยโบราณ</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิด (ค.ศ.):</strong></label>
                <input type="date" id="promchartBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <div class="form-group">
                <label class="text-gold"><strong>👤 เพศ:</strong></label>
                <select id="promchartGender" class="form-control bg-dark text-gold border-gold">
                    <option value="male">🧑 ชาย (นับเวียนไปขวา)</option>
                    <option value="female">👩 หญิง (นับเวียนไปซ้าย)</option>
                </select>
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="calculatePromchart()">
                <i class="fas fa-spinner mr-2"></i>ดูวงล้อพยากรณ์
            </button>

            <div id="promchartResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ตำราพรหมชาติ (Brahmasat)<br>
                ✓ วงล้อ 12 ตำแหน่ง = 12 เดือนของปี<br>
                ✓ วิธี: นับตั้งแต่ปีเกิด นับรอบวงล้อ<br>
                ✓ ชาย = นับขวา, หญิง = นับซ้าย
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
 * 🎡 คำนวณวงล้อพยากรณ์
 */
function calculatePromchart() {
    const birthDateEl = document.getElementById('promchartBirthDate');
    const genderEl = document.getElementById('promchartGender');
    const resultEl = document.getElementById('promchartResult');

    if (!birthDateEl.value) {
        alert('⚠️ กรุณากรอกวันเกิด');
        return;
    }

    const birthDate = new Date(birthDateEl.value);
    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const gender = genderEl.value;

    // นับรอบวงล้อ (เวียนตามเพศ)
    // ชาย = นับขวา (1,2,3,4,5...), หญิง = นับซ้าย (1,12,11,10...)
    let position;
    if (gender === 'male') {
        position = (age % 12) + 1;
        if (position > 12) position = position - 12;
        if (position === 0) position = 12;
    } else {
        position = 12 - (age % 12);
        if (position <= 0) position = position + 12;
    }

    const data = PROMCHART_DATA[position - 1];

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">🎡 ผลการดูวงล้อพยากรณ์</h4>

            <div class="alert alert-dark mb-3">
                <strong class="text-gold">📊 ข้อมูลการนับ:</strong><br>
                เพศ: ${gender === 'male' ? '🧑 ชาย (นับขวา)' : '👩 หญิง (นับซ้าย)'}<br>
                อายุ: ${age} ปี<br>
                ตำแหน่งที่: <strong class="text-gold">${position}</strong> / 12
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h5 class="text-gold mb-2">✨ ${data.name}</h5>
                    <p class="mb-2"><strong>ความหมาย:</strong> <span class="text-gold">${data.meaning}</span></p>
                    <p class="mb-2"><strong>คะแนนมงคล:</strong> ${data.rating}</p>
                    <p class="small mb-0"><strong>คำทำนาย:</strong> ${data.detail}</p>
                </div>
            </div>

            <div class="alert alert-secondary small">
                <strong>💡 วิธีใช้วงล้อพยากรณ์:</strong><br>
                1. นับปีเกิด = ตำแหน่งที่ 1<br>
                2. นับไปเรื่อยๆ ตามปีปัจจุบัน<br>
                3. ชาย = เวียนขวา, หญิง = เวียนซ้าย<br>
                4. ดูคำทำนายตามตำแหน่งที่ลงมา
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showPromchartPage();
    console.log("✅ promchart.js loaded - อิงตำราพรหมชาติ (authentic Thai astrology)");
});

window.calculatePromchart = calculatePromchart;
