/**
 * 🎡 วงล้อพยากรณ์ - ตำราพรหมชาติ (ฉบับสมบูรณ์ ปรับปรุงแก้บั๊กสูตรคำนวณและอนิเมชันวงล้อ)
 *
 * อ้างอิง:
 * - ตำราพรหมชาติ (Brahmasat) - ตำราโหราศาสตร์ไทยโบราณ
 * - วงล้อ 12 ตำแหน่ง = 12 นักษัตร / 12 ช่วงอายุชะตาตก
 * - วิธีคำนวณ: ตั้งต้นอายุ 1 ขวบ ที่ตำแหน่งที่ 1 (เจดีย์) เสมอ
 * - ชายให้นับเวียนขวา (ตามเข็มนาฬิกา), หญิงให้นับเวียนซ้าย (ทวนเข็มนาฬิกา)
 */

"use strict";

// ข้อมูลคำทำนายพรหมชาติ 12 ตำแหน่ง (อิงตำราพรหมชาติโบราณ)
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
    // ตรวจสอบทั้ง ID พิมพ์เล็กและพิมพ์ใหญ่ เพื่อป้องกัน Error
    const container = document.getElementById('promchartsection') || document.getElementById('promchartSection');
    if (!container) return;
    // หมายเหตุ: ไม่เขียนทับ innerHTML เพื่อรักษาโครงสร้างหน้าเว็บและวงล้อ SVG ใน index.html ไว้
}

/**
 * 🎡 คำนวณวงล้อพยากรณ์พรหมชาติและหมุนเข็มชี้ชะตา
 */
function calculatePromchart() {
    // 1. รับค่าอายุและเพศจากหน้าเว็บ (รองรับทั้ง ID จากหน้าหลักและฟอร์มสำรอง)
    const ageEl = document.getElementById('userAgeprom') || document.getElementById('promchartAge');
    const birthDateEl = document.getElementById('promchartBirthDate');
    const genderEl = document.getElementById('userGender') || document.getElementById('promchartGender');
    const resultEl = document.getElementById('resultDisplay') || document.getElementById('promchartResult');

    let age = 0;
    if (ageEl && ageEl.value) {
        age = parseInt(ageEl.value, 10);
    } else if (birthDateEl && birthDateEl.value) {
        const birthDate = new Date(birthDateEl.value);
        const birthYear = birthDate.getFullYear();
        const currentYear = new Date().getFullYear();
        age = (currentYear - birthYear) + 1; // นับอายุย่างตามหลักโหราศาสตร์ไทย
        if (ageEl) ageEl.value = age;
    }

    if (!age || isNaN(age) || age <= 0) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('แจ้งเตือน', 'กรุณาระบุอายุปัจจุบันหรือเลือกสมาชิกจากประวัติ', 'warning');
        } else {
            alert('กรุณาระบุอายุปัจจุบันหรือเลือกสมาชิกจากประวัติ');
        }
        return;
    }

    const gender = genderEl ? genderEl.value : 'male';

    // 2. คำนวณตำแหน่งชะตาตกตามตำราพรหมชาติโบราณ (1 ถึง 12)
    // อายุ 1 ปี เริ่มต้นที่ตำแหน่งที่ 1 (เจดีย์) เสมอ
    // ชาย = นับเวียนขวาตามเข็มนาฬิกา (1 -> 2 -> 3 ... -> 12 -> 1)
    // หญิง = นับเวียนซ้ายทวนเข็มนาฬิกา (1 -> 12 -> 11 ... -> 2 -> 1)
    let position;
    const rem = ((age - 1) % 12) + 1;
    if (gender === 'male') {
        position = rem;
    } else {
        position = (rem === 1) ? 1 : (14 - rem);
    }

    const data = PROMCHART_DATA[position - 1];

    // 3. แสดงผลคำทำนาย
    if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = `
            <div class="card border-gold bg-dark text-white p-4 shadow-lg mb-4">
                <div class="d-flex justify-content-between align-items-center border-bottom border-gold pb-3 mb-3 flex-wrap">
                    <h4 class="text-gold mb-2 mb-md-0">🎡 ผลการทำนายดวงชะตา (ตำราพรหมชาติ)</h4>
                    <span class="badge badge-gold px-3 py-2" style="font-size:1rem;">ตำแหน่งที่ ${position} / 12</span>
                </div>

                <div class="alert alert-dark border border-secondary mb-3 d-flex justify-content-between flex-wrap">
                    <div class="mr-3 mb-1"><strong class="text-gold">👤 เพศ:</strong> ${gender === 'male' ? '🧑 ชาย (นับเวียนขวา)' : '👩 หญิง (นับเวียนซ้าย)'}</div>
                    <div class="mr-3 mb-1"><strong class="text-gold">🎂 อายุย่าง:</strong> ${age} ปี</div>
                    <div class="mb-1"><strong class="text-gold">📍 ตกตำแหน่ง:</strong> <span class="text-warning font-weight-bold">${data.name}</span> (${data.meaning})</div>
                </div>

                <div class="card bg-dark border-gold mb-3">
                    <div class="card-body">
                        <h5 class="text-gold mb-2">✨ คำทำนายชะตาตก: ${data.name}</h5>
                        <p class="mb-2"><strong>ความหมายมงคล:</strong> <span class="text-warning">${data.meaning}</span> (${data.rating})</p>
                        <p class="mb-0" style="font-size: 1.1rem; line-height: 1.6;">"${data.detail}"</p>
                    </div>
                </div>

                <div class="alert alert-secondary small mb-3">
                    <strong>💡 หลักการนับรอบวงล้อพรหมชาติโบราณ:</strong><br>
                    • ตั้งต้นอายุ 1 ขวบ ที่ตำแหน่งที่ 1 (เจดีย์)<br>
                    • ชายให้นับเวียนขวา (ตามเข็มนาฬิกา) ส่วนหญิงให้นับเวียนซ้าย (ทวนเข็มนาฬิกา)<br>
                    • นับไปทีละตำแหน่งจนครบเท่าอายุย่างปัจจุบัน จะได้ตำแหน่งชะตาตกในปีนี้
                </div>

                <export-share-buttons download-fn="downloadHoroscopeImage()" share-fn="shareToFacebook()"></export-share-buttons>
            </div>
        `;
        // เลื่อนหน้าจอลงมาดูผลลัพธ์
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 4. สั่งอนิเมชันหมุนเข็มชี้และไฮไลท์ตำแหน่งบนวงล้อ SVG
    animatePromchartWheel(position);
}

/**
 * 🎡 ฟังก์ชันหมุนเข็มชี้ชะตาและไฮไลท์วงล้อพรหมชาติบน SVG
 */
function animatePromchartWheel(position) {
    const needle = document.getElementById('wheel-needle');
    const highlightCircle = document.getElementById('highlight-circle');

    // พิกัด (cx, cy) ของตำแหน่งทั้ง 12 บนวงล้อ SVG (อ้างอิงจากแท็ก <g> ใน index.html)
    const wheelCoords = [
        { x: 200, y: 45 },   // 1. เจดีย์ (pos-0, 0 องศา)
        { x: 275, y: 65 },   // 2. ฉัตรเงิน (pos-1, 30 องศา)
        { x: 335, y: 125 },  // 3. คอขาด (pos-2, 60 องศา)
        { x: 355, y: 200 },  // 4. เรือนหลวง (pos-3, 90 องศา)
        { x: 335, y: 275 },  // 5. ปราสาท (pos-4, 120 องศา)
        { x: 275, y: 335 },  // 6. ราหู (pos-5, 150 องศา)
        { x: 200, y: 355 },  // 7. ฉัตรทอง (pos-6, 180 องศา)
        { x: 125, y: 335 },  // 8. เทวดาขี่เต่า (pos-7, 210 องศา)
        { x: 65, y: 275 },   // 9. คนต้องข้อคา (pos-8, 240 องศา)
        { x: 45, y: 200 },   // 10. พ่อมด (pos-9, 270 องศา)
        { x: 65, y: 125 },   // 11. แม่มด (pos-10, 300 องศา)
        { x: 125, y: 65 }    // 12. นาคราช (pos-11, 330 องศา)
    ];

    if (needle) {
        needle.style.display = 'block';
        needle.style.transformOrigin = '200px 200px';
        needle.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
        
        // ตำแหน่ง 1 (เจดีย์) คือมุม 0 องศา แต่ละตำแหน่งห่างกัน 30 องศา
        const targetAngle = (position - 1) * 30;
        // หมุนรอบวงล้ออย่างน้อย 2 รอบ (720 องศา) ก่อนหยุดที่เป้าหมาย
        needle.style.transform = `rotate(${targetAngle + 720}deg)`;
    }

    if (highlightCircle) {
        // ปิดวงกลมไฮไลท์ระหว่างที่เข็มกำลังหมุน
        highlightCircle.style.display = 'none';
        highlightCircle.classList.remove('glow-active');

        setTimeout(() => {
            const coords = wheelCoords[position - 1];
            if (coords) {
                highlightCircle.setAttribute('cx', coords.x);
                highlightCircle.setAttribute('cy', coords.y);
                highlightCircle.style.display = 'block';
                highlightCircle.classList.add('glow-active');
            }
        }, 1500); // แสดงหลังเข็มหมุนเสร็จใน 1.5 วินาที
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showPromchartPage();
});

window.calculatePromchart = calculatePromchart;
window.animatePromchartWheel = animatePromchartWheel;
if (!window.downloadHoroscopeImage && window.downloadImage) {
    window.downloadHoroscopeImage = window.downloadImage;
}
