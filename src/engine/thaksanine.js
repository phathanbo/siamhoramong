"use strict";

function showThaksanine() {
  const container = document.getElementById("showthaksaninepage");
  if (!container) return;
  container.style.display = "block";

  // Auto-calculate current real-time month and week of year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const currentWeek = Math.min(52, Math.max(1, Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)));

  const html = `
    <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px;">
        
        <!-- Main Card -->
        <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
            
            <!-- Header -->
            <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(232, 200, 118, 0.6); box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);" class="mb-2 animate__animated animate__rotateIn">
                    <i class="fas fa-chart-line fa-2x" style="color: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));"></i>
                </div>
                <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">🌟 ทักษาพยากรณ์ ๙ ภูมิ 🌟</h1>
                <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">ระบบพยากรณ์ดาวเสวยอายุและทักษาจร ๙ ภูมิ (รายปี · รายเดือน · รายสัปดาห์)</p>
            </div>
            
            <div class="card-body p-3 p-md-4">
                
                <div style="max-width: 960px; margin: 0 auto;">
                    <!-- Member Selector Box -->
                    <div class="p-3 mb-4 rounded-3" style="background: rgba(35, 42, 86, 0.5); border: 1px dashed rgba(201, 164, 92, 0.45);">
                        <label class="form-label fw-bold d-flex align-items-center gap-2 mb-2" style="color: #e8c876;">
                            <i class="fas fa-user-circle"></i> ดึงข้อมูลจากสมาชิก (ตัวเลือกเสริม):
                        </label>
                        <select id="membersel" class="form-select bg-dark text-white border-gold member-selector-shared"
                            onchange="autoFillMemberData(this.value); calculateAll()" style="border-color: rgba(212, 175, 55, 0.5); border-radius: 10px; padding: 10px 14px;">
                            <option value="">-- เลือกจากฐานข้อมูลสมาชิก --</option>
                        </select>
                    </div>
                    
                    <!-- Inputs Form -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-3 col-6">
                            <label class="form-label fw-semibold" style="color: #e8c876;"><i class="fas fa-calendar-day me-1"></i> วันเกิด:</label>
                            <select id="weekday" class="form-select bg-dark text-white border-gold" onchange="calculateAll()" style="border-radius: 12px; height: 48px; border-color: rgba(212, 175, 55, 0.4);">
                                <option value="0">วันอาทิตย์ (๑)</option>
                                <option value="1">วันจันทร์ (๒)</option>
                                <option value="2">วันอังคาร (๓)</option>
                                <option value="3">วันพุธ กลางวัน (๔)</option>
                                <option value="7">วันพุธ กลางคืน / ราหู (๘)</option>
                                <option value="4">วันพฤหัสบดี (๕)</option>
                                <option value="5">วันศุกร์ (๖)</option>
                                <option value="6">วันเสาร์ (๗)</option>
                            </select>
                        </div>
                        
                        <div class="col-md-3 col-6">
                            <label class="form-label fw-semibold" style="color: #e8c876;"><i class="fas fa-hourglass-half me-1"></i> อายุ (ปี):</label>
                            <input type="number" id="age" class="form-control bg-dark text-white border-gold text-center" value="35" min="1" max="120" onchange="calculateAll()" style="border-radius: 12px; height: 48px; border-color: rgba(212, 175, 55, 0.4); font-weight: bold; font-size: 1.1rem;">
                        </div>
                        
                        <div class="col-md-3 col-6">
                            <label class="form-label fw-semibold" style="color: #e8c876;"><i class="fas fa-moon me-1"></i> เดือนจร (1-12):</label>
                            <input type="number" id="month" class="form-control bg-dark text-white border-gold text-center" value="${currentMonth}" min="1" max="12" onchange="calculateAll()" style="border-radius: 12px; height: 48px; border-color: rgba(212, 175, 55, 0.4); font-weight: bold;">
                        </div>
                        
                        <div class="col-md-3 col-6">
                            <label class="form-label fw-semibold" style="color: #e8c876;"><i class="fas fa-calendar-week me-1"></i> สัปดาห์จร (1-52):</label>
                            <input type="number" id="week" class="form-control bg-dark text-white border-gold text-center" value="${currentWeek}" min="1" max="52" onchange="calculateAll()" style="border-radius: 12px; height: 48px; border-color: rgba(212, 175, 55, 0.4); font-weight: bold;">
                        </div>
                    </div>
                    
                    <div class="text-center mt-3">
                        <button class="btn btn-gold btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center gap-2" onclick="calculateAll()" style="border-radius: 50px; font-size: 1.15rem; letter-spacing: 0.5px;">
                            <i class="fas fa-magic"></i> คำนวณดวงทักษา ๙ ภูมิ
                        </button>
                    </div>
                </div>

                <!-- Results container -->
                <div id="result" class="mt-4 pt-3"></div>

            </div>
        </div>
        
        <!-- Bottom Navigation -->
        <div class="row mt-4 g-2">
            <div class="col-6">
                <button class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" style="border-radius: 12px; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2);" onclick="navigateTo('mainpage')">
                    <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
                </button>
            </div>
            <div class="col-6">
                <button class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" style="border-radius: 12px; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2);" onclick="goBack()">
                    <i class="fas fa-home"></i> กลับหน้าหลัก
                </button>
            </div>
        </div>
    </div>
  `;
  container.innerHTML = html;
  calculateAll();
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

const planetIcons = [
  "fa-sun",
  "fa-moon",
  "fa-fire",
  "fa-book-open",
  "fa-mountain",
  "fa-star",
  "fa-dragon",
  "fa-heart",
  "fa-dharmachakra"
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

function getThaksaElementRelation(e1, e2) {
  if (e1 === e2)
    return {
      text: "เป็นกลาง",
      badgeClass: "bg-secondary text-light",
      borderColor: "#64748b",
      bgColor: "rgba(100, 116, 139, 0.15)",
      advice: "สถานการณ์คงที่ สม่ำเสมอเกี่ยวกับ",
    };
  const good =
    (e1 === "ไฟ" && e2 === "ลม") ||
    (e1 === "ลม" && e2 === "ไฟ") ||
    (e1 === "ดิน" && e2 === "น้ำ") ||
    (e1 === "น้ำ" && e2 === "ดิน");
  return good
    ? {
        text: "ส่งเสริมกัน",
        badgeClass: "bg-success text-light",
        borderColor: "#22c55e",
        bgColor: "rgba(34, 197, 94, 0.12)",
        advice: "พลังงานไหลลื่น ผลลัพธ์ดีเลิศเกี่ยวกับ",
      }
    : {
        text: "หักล้างกัน",
        badgeClass: "bg-danger text-light",
        borderColor: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.12)",
        advice: "ควรมีสติ ระวังความขัดแย้งในเรื่อง",
      };
}

function generateLongPrediction(level, mainPlanet, mainElement, meaningsList) {
  let text = `คำพยากรณ์หลักประจำ${level}นี้ มี <strong>ดาว${mainPlanet}</strong> (ธาตุ${mainElement}) จรมาเป็นบริวารครองดวงชะตา ซึ่งส่งผลต่อวิถีชีวิตโดยตรงในรอบ${level}นี้`;
  return `
    <div class="p-3 rounded-3 mb-3" style="background: rgba(255, 215, 0, 0.08); border-left: 4px solid #ffd700;">
        <p class="mb-2" style="font-size: 1.05rem; line-height: 1.7; color: #f8fafc;">${text}</p>
        <div class="row g-2 mt-2">
            <div class="col-md-6">
                <div class="p-2 rounded-2" style="background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3);">
                    <strong class="text-success small"><i class="fas fa-check-circle me-1"></i> จุดเด่นที่หนุนนำ:</strong>
                    <div class="small text-light mt-1">
                        ${meaningsList[0].includes("บริวาร") ? "ตัวคุณและคนรอบตัวมีบทบาทสำคัญ " : ""}
                        ${meaningsList[3].includes("ศรี") ? "มีโอกาสได้รับโชคลาภและความสุขความสำเร็จ " : ""}
                        ${meaningsList[2].includes("เดช") ? "มีอำนาจ บารมี และชื่อเสียงเป็นที่ยอมรับ" : ""}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="p-2 rounded-2" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3);">
                    <strong class="text-danger small"><i class="fas fa-exclamation-triangle me-1"></i> จุดที่ควรระมัดระวัง:</strong>
                    <div class="small text-light mt-1">
                        ระวังอุปสรรคและความขัดข้อง โดยเฉพาะเรื่องที่เกี่ยวกับดาว ${mainPlanet}
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2 text-white-50 small">
            💡 <strong>คำแนะนำเสริมดวง:</strong> ควรเน้นการพัฒนาด้าน <strong>${meaningsList[4]} (มูละ)</strong> และ <strong>${meaningsList[5]} (อุตสาหะ)</strong> เพื่อสร้างความมั่นคงในระยะยาว
        </div>
    </div>
  `;
}

function calculateAll() {
  const weekdayEl = document.getElementById("weekday");
  const ageEl = document.getElementById("age");
  const monthEl = document.getElementById("month");
  const weekEl = document.getElementById("week");
  if (!weekdayEl || !ageEl || !monthEl || !weekEl) return;

  const wd = parseInt(weekdayEl.value);
  const age = parseInt(ageEl.value) || 1;
  const month = parseInt(monthEl.value) || 1;
  const weekNum = parseInt(weekEl.value) || 1;

  const start = birthToIndex[wd];
  const yearPos = (start + age - 1) % 9;
  const monthPos = (yearPos + Math.floor(month * 0.75)) % 9;
  const weekPos = (yearPos + Math.floor(weekNum * 0.35)) % 9;

  let html = `
    <div class="text-center mb-4 pt-2">
        <h2 style="color:#ffd700; font-family: 'Chonburi', serif;" class="fw-bold mb-1">ผลการพยากรณ์ทักษา ๙ ภูมิ</h2>
        <p class="text-white-50 small">วิเคราะห์ความสัมพันธ์ธาตุและดาวเสวยอายุ</p>
    </div>
  `;

  // รายปี
  html += createDetailedSection(
    "📅 ทักษาจรรายปี (อายุ " + age + " ปี)",
    yearPos,
    "ปี",
    age
  );

  // รายเดือน
  html += createDetailedSection(
    "📆 ทักษาจรรายเดือน (เดือนที่ " + month + ")",
    monthPos,
    "เดือน",
    month
  );

  // รายสัปดาห์
  html += createDetailedSection(
    "🗓️ ทักษาจรรายสัปดาห์ (สัปดาห์ที่ " + weekNum + ")",
    weekPos,
    "สัปดาห์",
    weekNum
  );

  const resultEl = document.getElementById("result");
  if (resultEl) resultEl.innerHTML = html;
}

function createDetailedSection(title, pos, unit, value) {
  const mainPlanet = planetNames[pos];
  const mainElement = elements[pos];

  // 9 Planets Grid
  let gridHtml = `<div class="row g-2 mb-3 justify-content-center">`;
  for (let i = 0; i < 9; i++) {
    const isActive = i === pos;
    const activeStyle = isActive 
      ? `background: linear-gradient(135deg, #ffd700, #d4af37); color: #000; border: 2px solid #fff; box-shadow: 0 0 15px rgba(255,215,0,0.6); transform: scale(1.05); font-weight: bold;` 
      : `background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1);`;

    gridHtml += `
      <div class="col-4 col-md">
        <div class="p-2 text-center rounded-3 h-100 d-flex flex-column align-items-center justify-content-center" style="${activeStyle} transition: all 0.2s;">
            <i class="fas ${planetIcons[i]} mb-1" style="font-size: 1.1rem;"></i>
            <div style="font-size: 0.88rem;">ดาว${planetNames[i]}</div>
            <small style="font-size: 0.72rem; opacity: 0.85;">ธาตุ${elements[i]}</small>
        </div>
      </div>
    `;
  }
  gridHtml += `</div>`;

  // 8 Meanings Cards
  let meaningsCards = `<div class="row g-2">`;
  for (let i = 0; i < 8; i++) {
    const p = (pos + i) % 9;
    const rel = getThaksaElementRelation(mainElement, elements[p]);
    meaningsCards += `
        <div class="col-12 col-md-6">
            <div class="p-3 rounded-3 h-100" style="border-left: 4px solid ${rel.borderColor}; background: ${rel.bgColor}; border-top: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <span class="fw-bold" style="color: #ffd700; font-size: 0.95rem;">
                        ภูมิ${meanings[i]} ➔ ดาว${planetNames[p]} (${elements[p]})
                    </span>
                    <span class="badge ${rel.badgeClass}" style="font-size: 0.75rem;">${rel.text}</span>
                </div>
                <p class="mb-0 small text-light" style="line-height: 1.5; opacity: 0.9;">
                    ${rel.advice} <strong>${meaningDesc[meanings[i]]}</strong>
                </p>
            </div>
        </div>
    `;
  }
  meaningsCards += `</div>`;

  return `
    <div class="card mb-4 border-0 shadow-lg overflow-hidden" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212,175,55,0.25) !important; border-radius: 20px;">
        <div class="card-header py-3 px-4" style="background: rgba(212, 175, 55, 0.12); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
            <h4 class="mb-0 fw-bold" style="color: #ffd700; font-family: 'Chonburi', serif; font-size: 1.25rem;">
                ${title}
            </h4>
        </div>
        <div class="card-body p-3 p-md-4">
            
            <h6 class="fw-semibold text-white-50 mb-2 small"><i class="fas fa-th me-1"></i> ผังดาวทักษา ๙ ภูมิ:</h6>
            ${gridHtml}

            ${generateLongPrediction(unit, mainPlanet, mainElement, meanings)}

            <h5 class="fw-bold mt-4 mb-3" style="color: #ffd700; font-size: 1.05rem;">
                <i class="fas fa-layer-group me-2"></i>รายละเอียดนิยาม ๘ ภูมิและความสัมพันธ์ของธาตุ:
            </h5>
            ${meaningsCards}

        </div>
    </div>
  `;
}

