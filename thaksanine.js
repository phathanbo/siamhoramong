"use strict";

function showThaksanine() {
  const container = document.getElementById("showthaksaninepage");
  container.style.display = "block";

  const html = `
  <div class="headpage">
    <h1>🌟 ทักษาพยากรณ์ 🌟</h1>
    <p class="text">ระบบพยากรณ์ดวงชะตาแบบละเอียด</p>
  </div>
  <div class="container">  
      <div class="grid-taksa">
              <select id="membersel"
            class="form-control bg-dark text-white border-gold member-selector-shared"
            onchange="autoFillMemberData(this.value); calculateAll()">
            <option value="">-- เลือกสมาชิก --</option>
        </select>
        <div class="space-taksa">        
          <div>          
            <label class="form-col">วันเกิด</label>
            <select id="weekday" onchange="calculateAll()">
              <option value="0">อาทิตย์</option>
              <option value="1">จันทร์</option>
              <option value="2">อังคาร</option>
              <option value="3">พุธ</option>
              <option value="4">พฤหัสบดี</option>
              <option value="5">ศุกร์</option>
              <option value="6">เสาร์</option>
            </select>
          </div>

          <div>
            <label class="form-col">อายุ (ปี)</label>
            <input type="number" id="age" value="35" onchange="calculateAll()" readonly>
          </div>

            <div>
              <label class="form-col">เดือน</label>
              <input type="number" id="month" value="5" min="1" max="12" onchange="calculateAll()">
            </div>

            <div>
              <label class="form-col">สัปดาห์</label>
              <input type="number" id="week" value="22" min="1" max="52" onchange="calculateAll()">
            </div>        
        </div>

          <div class="text-center ">       
            <button onclick="calculateAll()" style="margin-top: 1px;" class="btn-gold">คำนวณดวงทักษา</button>
          </div> 
          <hr>
          <div id="result"></div> 
          <div class="row mt-4">
            <div class="col-6">
              <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                <i class="fas fa-home"></i> กลับหน้าหลัก
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

// ข้อมูลหลัก
const planetNames = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัส",
  "ศุกร์",
  "เสาร์",
  "ราหู",
  "เกตุ",
];
const elements = ["ไฟ", "ดิน", "ลม", "น้ำ", "ดิน", "น้ำ", "ไฟ", "ลม", "วิญญาณ"];
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

const birthToIndex = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

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
