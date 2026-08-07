"use strict";

function showThaksanine() {
  const container = document.getElementById("showthaksaninepage");
  container.style.display = "block";

  const html = `
    <div class="headpage text-center mb-4">
        <h1>🌟 ทักษาพยากรณ์ 🌟</h1>
        <p class="text-gold">ระบบพยากรณ์ดวงชะตาแบบละเอียด</p>
    </div>
    
    <div class="container">
        <div class="card shadow-lg border-gold overflow-hidden mb-4" style="background:#1a1a1a; border-radius:16px;">
            <div class="card-header bg-dark text-white p-4 text-center">
                <h4 class="mb-0 text-gold"><i class="bi bi-star-fill me-2"></i> ป้อนข้อมูลเพื่อพยากรณ์</h4>
            </div>
            
            <div class="card-body p-4">
                <div class="row justify-content-center mb-4">
                    <div class="col-md-8">
                        <label class="text-gold mb-2"><strong>👤 เลือกสมาชิกจากประวัติ:</strong></label>
                        <select id="membersel" class="form-control form-control-lg bg-dark text-white border-gold member-selector-shared"
                            onchange="autoFillMemberData(this.value); calculateAll()">
                            <option value="">-- เลือกสมาชิก --</option>
                        </select>
                    </div>
                </div>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-3 col-6">
                        <label class="text-gold mb-2"><strong>📅 วันเกิด:</strong></label>
                        <select id="weekday" class="form-control bg-dark text-white border-gold" onchange="calculateAll()">
                            <option value="0">อาทิตย์</option>
                            <option value="1">จันทร์</option>
                            <option value="2">อังคาร</option>
                            <option value="3">พุธ (กลางวัน)</option>
                            <option value="7">พุธกลางคืน (ราหู)</option>
                            <option value="4">พฤหัสบดี</option>
                            <option value="5">ศุกร์</option>
                            <option value="6">เสาร์</option>
                        </select>
                    </div>
                    
                    <div class="col-md-3 col-6">
                        <label class="text-gold mb-2"><strong>🎂 อายุ (ปี):</strong></label>
                        <input type="number" id="age" class="form-control bg-dark text-white border-gold" value="35" onchange="calculateAll()" readonly>
                    </div>
                    
                    <div class="col-md-3 col-6">
                        <label class="text-gold mb-2"><strong>🌙 เดือน:</strong></label>
                        <input type="number" id="month" class="form-control bg-dark text-white border-gold" value="5" min="1" max="12" onchange="calculateAll()">
                    </div>
                    
                    <div class="col-md-3 col-6">
                        <label class="text-gold mb-2"><strong>📆 สัปดาห์:</strong></label>
                        <input type="number" id="week" class="form-control bg-dark text-white border-gold" value="22" min="1" max="52" onchange="calculateAll()">
                    </div>
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-gold px-5 py-3 rounded-pill fw-bold" onclick="calculateAll()" style="background: linear-gradient(135deg, #b8860b, #ffd700); color: #000; border: none; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">
                        <i class="fas fa-magic me-2"></i> คำนวณดวงทักษา
                    </button>
                </div>
            </div>
        </div>
        
        <div id="result" class="mt-4"></div>
        
        <div class="row mt-4 mb-5">
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0 rounded-pill p-3" onclick="navigateTo('mainpage')">
                    <i class="fas fa-chevron-left me-2"></i> กลับห้องพยากรณ์
                </button>
            </div>
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0 rounded-pill p-3" onclick="goBack()">
                    <i class="fas fa-home me-2"></i> กลับหน้าหลัก
                </button>
            </div>
        </div>
    </div>
  `;
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  showThaksanine();
});

// ข้อมูลหลัก: เรียงลำดับตามภูมิทักษา (เวียนขวา) 1-2-3-4-7-5-8-6-9
const planetNames = [
  "อาทิตย์", // 0
  "จันทร์",  // 1
  "อังคาร",  // 2
  "พุธ",     // 3
  "เสาร์",   // 4 (เวียนจากพุธไปเสาร์)
  "พฤหัส",   // 5
  "ราหู",    // 6
  "ศุกร์",    // 7
  "เกตุ",    // 8
];

// ธาตุตามลำดับดวงดาวในผังทักษา
const elements = [
  "ไฟ",     // 1 อาทิตย์
  "ดิน",    // 2 จันทร์
  "ลม",     // 3 อังคาร
  "น้ำ",     // 4 พุธ
  "ไฟ",     // 7 เสาร์
  "ดิน",    // 5 พฤหัส
  "ลม",     // 8 ราหู
  "น้ำ",     // 6 ศุกร์
  "วิญญาณ"  // 9 เกตุ
];

const meanings = [
  "บริวาร",
  "อายุ",
  "เดช",
  "ศรี",
  "มูละ",
  "อุตสาหะ",
  "มนตรี",
  "กาลกิณี",
];

// Map วันเกิดไปยัง index ในผังทักษา
const birthToIndex = { 
  0: 0, // อาทิตย์ (0)
  1: 1, // จันทร์ (1)
  2: 2, // อังคาร (2)
  3: 3, // พุธกลางวัน (3)
  4: 5, // พฤหัส (5)
  5: 7, // ศุกร์ (7)
  6: 4, // เสาร์ (4)
  7: 6  // พุธกลางคืน/ราหู (6) 
};

const meaningDesc = {
  บริวาร: "ตัวคุณเอง คนใกล้ชิด บริวาร ลูกหลาน คู่ครอง",
  อายุ: "สุขภาพ ร่างกาย อายุขัย พลังชีวิต",
  เดช: "อำนาจ ชื่อเสียง ตำแหน่ง เกียรติยศ พลังบารมี",
  ศรี: "โชคลาภ การเงิน ความสุข สิริมงคล",
  มูละ: "ทรัพย์สิน บ้านเรือน ความมั่นคง รากฐานชีวิต",
  อุตสาหะ: "การงาน ความเพียร โอกาสในการกระทำ",
  มนตรี: "ผู้ช่วยเหลือ ที่ปรึกษา ผู้สนับสนุน",
  กาลกิณี: "อุปสรรค ความขัดข้อง โชคร้าย ความเสื่อม",
};

function getElementRelation(e1, e2) {
  if (e1 === e2)
    return {
      text: "เป็นกลาง",
      color: "text-gray-600",
      advice: "สถานการณ์คงที่เกี่ยวกับ",
    };
  const good =
    (e1 === "ไฟ" && e2 === "ลม") ||
    (e1 === "ลม" && e2 === "ไฟ") ||
    (e1 === "ดิน" && e2 === "น้ำ") ||
    (e1 === "น้ำ" && e2 === "ดิน");
  return good
    ? {
        text: "ส่งเสริมกัน",
        color: "text-green-600",
        advice: "พลังงานไหลลื่น ผลลัพธ์ดีเกี่ยวกับ",
      }
    : {
        text: "หักล้างกัน",
        color: "text-red-600",
        advice: "ระวังความขัดแย้งและอุปสรรคในเรื่อง",
      };
}

function generateLongPrediction(level, mainPlanet, mainElement, meaningsList) {
  let text = `📌 คำพยากรณ์${level}นี้:\n\n`;
  text += `<br>บริวารหลักคือ **ดาว${mainPlanet}** ธาตุ${mainElement} `;
  text += `ซึ่งส่งผลโดยตรงต่อชีวิตใน${level}นี้\n\n`;

  text += `<br>🔹 จุดเด่น: `;
  if (meaningsList[0].includes("บริวาร"))
    text += "ตัวคุณและคนรอบตัวมีบทบาทสำคัญ ";
  if (meaningsList[3].includes("ศรี")) text += "มีโอกาสได้รับโชคลาภและความสุข ";
  if (meaningsList[2].includes("เดช")) text += "อำนาจและชื่อเสียงเพิ่มขึ้น ";

  text += `<br>\n\n⚠️ จุดที่ควรระวัง: `;
  if (meaningsList[7].includes("กาลกิณี"))
    text += "ระวังอุปสรรคและความขัดข้อง โดยเฉพาะเรื่อง " + mainPlanet;

  text += `<br>\n\n💡 คำแนะนำ: ควรเน้นการพัฒนา${meaningsList[4]} และ${meaningsList[5]} เพื่อสร้างความมั่นคงและความก้าวหน้าใน${level}นี้`;

  return text;
}

function calculateAll() {
  const wd = parseInt(document.getElementById("weekday").value);
  const age = parseInt(document.getElementById("age").value);
  const month = parseInt(document.getElementById("month").value);
  const weekNum = parseInt(document.getElementById("week").value);

  const start = birthToIndex[wd];
  const yearPos = (start + age - 1) % 9;
  const monthPos = (yearPos + Math.floor(month * 0.75)) % 9;
  const weekPos = (yearPos + Math.floor(weekNum * 0.35)) % 9;

  let html = `
  <br>
  <h2 class="text-gold" style="text-align: center;">ผลการคำนวณดวงทักษา</h2>`;

  // รายปี
  html += createDetailedSection(
    "📅 รายปี (อายุ " + age + " ปี)",
    yearPos,
    "ปี",
    age,
  );

  // รายเดือน
  html += createDetailedSection(
    "📆 รายเดือน (เดือน " + month + ")",
    monthPos,
    "เดือน",
    month,
  );

  // รายสัปดาห์
  html += createDetailedSection(
    "🗓️ รายสัปดาห์ (สัปดาห์ที่ " + weekNum + ")",
    weekPos,
    "สัปดาห์",
    weekNum,
  );

  document.getElementById("result").innerHTML = html;
}

function createDetailedSection(title, pos, unit, value) {
  const mainPlanet = planetNames[pos];
  const mainElement = elements[pos];
  let html = `<div class="mb-12"><h3 class="text font-bold mb-4" style="color: #D4AF37;">${title}</h3>`;

  // ตารางภูมิ
  html += `<div class="cell">`;
  for (let i = 0; i < 9; i++) {
    const active = i === pos ? "highlight" : "bg-white";
    html += `<div class="cell ${active}">ดาว${planetNames[i]}<small class="text-xs">ธาตุ${elements[i]}</small></div>`;
  }
  html += `</div>`;

  // คำพยากรณ์ยาว
  html += `<br><div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 whitespace-pre-line text-dark leading-relaxed">`;
  html += generateLongPrediction(unit, mainPlanet, mainElement, meanings);
  html += `</div>`;

  // นิยามละเอียด
  html += `<br><h4 class="font-bold text-gold">รายละเอียดนิยาม ๘ ประการ</h4><br><div class="cell">`;
  for (let i = 0; i < 8; i++) {
    const p = (pos + i) % 9;
    const rel = getElementRelation(mainElement, elements[p]);
    html += `
        <div style="border-left: 4px solid ${rel.color === 'text-green-600' ? '#16a34a' : rel.color === 'text-red-600' ? '#dc2626' : '#4b5563'}; padding: 8px 12px; background-color: ${rel.color === 'text-green-600' ? '#e6ffec' : rel.color === 'text-red-600' ? '#ffe6e6' : '#e6f0ff'}; border-radius: 8px; color: #333; margin-bottom: 8px;">
        <span style="font-weight: bold;">${meanings[i]} → ${planetNames[p]} (${elements[p]})</span>
        <span class="${rel.color}" style="font-weight: bold; margin-left: 8px;">${rel.text}</span>
        <p style="margin-top: 4px; margin-bottom: 0;">${rel.advice} ${meaningDesc[meanings[i]]}</p>
        </div>
      `;
  }
  html += `  <br></div></div>`;
  return html;
}
