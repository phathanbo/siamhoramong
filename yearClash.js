"use strict";

// ปีชง-ปีเสริม ตามตำราพรหมชาติไทย

const YC_ZODIACS = ["ชวด","ฉลู","ขาล","เถาะ","มะโรง","มะเส็ง","มะเมีย","มะแม","วอก","ระกา","จอ","กุน"];

const YC_ZODIAC_INFO = {
  "ชวด":   { animal:"หนู",     element:"น้ำ", icon:"🐭", planet:"พุธ" },
  "ฉลู":   { animal:"วัว",     element:"ดิน", icon:"🐮", planet:"เสาร์" },
  "ขาล":   { animal:"เสือ",   element:"ไฟ",  icon:"🐯", planet:"อังคาร" },
  "เถาะ":  { animal:"กระต่าย",element:"ลม",  icon:"🐰", planet:"อังคาร" },
  "มะโรง": { animal:"งูใหญ่", element:"ดิน", icon:"🐉", planet:"ราหู" },
  "มะเส็ง":{ animal:"งูเล็ก", element:"ไฟ",  icon:"🐍", planet:"เกตุ" },
  "มะเมีย":{ animal:"ม้า",    element:"ไฟ",  icon:"🐴", planet:"อาทิตย์" },
  "มะแม":  { animal:"แพะ",    element:"ดิน", icon:"🐐", planet:"จันทร์" },
  "วอก":   { animal:"ลิง",    element:"ลม",  icon:"🐒", planet:"ศุกร์" },
  "ระกา":  { animal:"ไก่",    element:"ดิน", icon:"🐓", planet:"พฤหัสบดี" },
  "จอ":    { animal:"หมา",    element:"ดิน", icon:"🐕", planet:"อาทิตย์" },
  "กุน":   { animal:"หมู",    element:"น้ำ", icon:"🐷", planet:"พฤหัสบดี" }
};

// กลุ่มสามเหลี่ยมธาตุ (ปีเสริม)
const YC_TRIANGLES = {
  "น้ำ": { signs:["ชวด","มะโรง","วอก"],   color:"#4fc3f7", icon:"💧" },
  "ดิน": { signs:["ฉลู","มะเส็ง","ระกา"],  color:"#a1887f", icon:"🪨" },
  "ไฟ":  { signs:["ขาล","มะเมีย","จอ"],   color:"#ef5350", icon:"🔥" },
  "ลม":  { signs:["เถาะ","มะแม","กุน"],   color:"#66bb6a", icon:"🌪️" }
};

// คำพยากรณ์ปีชง (เฉพาะนักษัตรเกิด — ปีที่ชน)
const YC_CLASH_PRED = {
  "ชวด":  "ระวังสุขภาพโดยรวม ร่างกายเหนื่อยล้า การเงินผันผวน อย่าลงทุนขนาดใหญ่ เหมาะทำบุญสะเดาะเคราะห์",
  "ฉลู":  "ระวังเรื่องบ้านเรือนและครอบครัว ความขัดแย้งในบ้าน อาจมีการโยกย้ายถิ่นฐาน ระมัดระวังเอกสารสิทธิ์",
  "ขาล":  "ระวังอุบัติเหตุและความรุนแรง ควบคุมอารมณ์ให้ดี หลีกเลี่ยงการโต้เถียงและข้อพิพาท",
  "เถาะ": "ระวังเรื่องเพื่อนฝูงและพันธมิตร อาจถูกหักหลัง เอกสารและสัญญาต้องตรวจสอบให้ดี",
  "มะโรง":"ระวังเรื่องที่ดินและอสังหาริมทรัพย์ ชะลอการลงทุนไว้ก่อน อาจมีเรื่องกฎหมาย",
  "มะเส็ง":"ระวังเรื่องสุขภาพทางเดินอาหาร คำพูดและการสื่อสาร ระวังการเซ็นสัญญาโดยไม่รอบคอบ",
  "มะเมีย":"ระวังการเงิน รายจ่ายสูงกว่าปกติ ความสัมพันธ์รักอาจมีปัญหา หลีกเลี่ยงการพนัน",
  "มะแม": "ระวังสุขภาพและการงาน ความผิดพลาดจากความประมาท ระวังคนที่ไม่หวังดี",
  "วอก":  "ระวังข้อพิพาทและการโต้เถียง ความไม่มั่นคงในหน้าที่ อย่าเปลี่ยนงานในปีนี้",
  "ระกา": "ระวังชื่อเสียงและคำนินทา อาจมีคนใส่ความ ระวังเรื่องเอกสารและลิขสิทธิ์",
  "จอ":   "ระวังความสัมพันธ์และพันธมิตร คู่ครองอาจมีความขัดแย้ง ระวังการเซ็นสัญญาร่วมกัน",
  "กุน":  "ระวังสุขภาพและการเดินทาง ควรตรวจสุขภาพประจำปี ระวังการสูญเสียทรัพย์"
};

// คำแนะนำสำหรับปีเสริม
const YC_BOOST_PRED = {
  "น้ำ": "ปีเสริมพลังน้ำ — เหมาะค้าขาย สร้างความสัมพันธ์ ขยายเครือข่าย โอกาสดีทางธุรกิจ",
  "ดิน": "ปีเสริมพลังดิน — เหมาะลงทุนระยะยาว ซื้อที่ดินบ้าน ปลูกสร้าง สะสมทรัพย์สิน",
  "ไฟ":  "ปีเสริมพลังไฟ — โด่งดัง มีพลังสูง เหมาะเริ่มกิจการ เลื่อนตำแหน่ง สร้างชื่อเสียง",
  "ลม":  "ปีเสริมพลังลม — คล่องแคล่ว เหมาะค้าขาย การสื่อสาร เดินทาง ศึกษาเพิ่มเติม"
};

function ycGetZodiac(ceYear) {
  return YC_ZODIACS[((ceYear - 4) % 12 + 12) % 12]; // สูตรมาตรฐาน: ชวด = CE 4, ชวด = index 0
}

function ycBirthYearToZodiac(raw) {
  const y = parseInt(raw);
  if (!y || isNaN(y)) return null;
  return ycGetZodiac(y > 2400 ? y - 543 : y);
}

function ycAnalyze(birthZodiac, targetCEYear) {
  const targetZodiac = ycGetZodiac(targetCEYear);
  const birthIdx     = YC_ZODIACS.indexOf(birthZodiac);
  const clashZodiac  = YC_ZODIACS[(birthIdx + 6) % 12];

  // ตรวจกลุ่มสามเหลี่ยม
  let boostElement = null;
  for (const [el, g] of Object.entries(YC_TRIANGLES)) {
    if (g.signs.includes(birthZodiac)) { boostElement = el; break; }
  }
  const boostGroup = boostElement ? YC_TRIANGLES[boostElement].signs : [];

  // คู่สหาย (ชิดชน — 1 ช่อง)
  const friendIdx  = (birthIdx + 1) % 12;
  const friendIdx2 = (birthIdx - 1 + 12) % 12;
  const friendZodiacs = [YC_ZODIACS[friendIdx], YC_ZODIACS[friendIdx2]];

  let relation, prediction, color, severity;

  if (targetZodiac === clashZodiac) {
    relation   = "⚠️ ปีชง (ชนนักษัตร)";
    prediction = YC_CLASH_PRED[birthZodiac];
    color      = "#dc3545";
    severity   = "danger";
  } else if (boostGroup.includes(targetZodiac) && targetZodiac !== birthZodiac) {
    relation   = `✨ ปีเสริม (${boostElement})`;
    prediction = YC_BOOST_PRED[boostElement];
    color      = YC_TRIANGLES[boostElement].color;
    severity   = "good";
  } else if (friendZodiacs.includes(targetZodiac)) {
    relation   = "🤝 ปีสหาย";
    prediction = "ปีที่ใกล้ชิดกัน — มีผู้ช่วยเหลือ เหมาะขอความร่วมมือ สร้างพันธมิตร";
    color      = "#17a2b8";
    severity   = "good";
  } else if (targetZodiac === birthZodiac) {
    relation   = "🔄 ปีเดิมพันธุ์ (ตรงปีเกิด)";
    prediction = "ปีตรงกับปีเกิด — มีทั้งโอกาสและอุปสรรค ระวังตัวเองให้มาก เหมาะทำบุญสะเดาะเคราะห์";
    color      = "#fd7e14";
    severity   = "warn";
  } else {
    relation   = "😐 ปีปกติ";
    prediction = "ไม่มีผลพิเศษมาก ดำเนินชีวิตตามปกติ ขึ้นอยู่กับความพยายามและกรรมของตนเอง";
    color      = "#6c757d";
    severity   = "neutral";
  }

  return { targetZodiac, relation, prediction, color, severity };
}

function renderYearClash() {
  const raw       = document.getElementById("ycBirthYear")?.value?.trim();
  const container = document.getElementById("ycResult");
  if (!container) return;

  const birthZodiac = ycBirthYearToZodiac(raw);
  if (!birthZodiac) {
    container.innerHTML = `<div class="alert alert-warning text-center">กรุณากรอกปีเกิด (พ.ศ. หรือ ค.ศ.)</div>`;
    return;
  }

  const info        = YC_ZODIAC_INFO[birthZodiac];
  const currentCE   = new Date().getFullYear();

  // ผลปีปัจจุบันและปีหน้า
  let html = `
    <div class="text-center mb-4 py-3" style="border-bottom:1px solid rgba(212,175,55,0.3);">
      <div style="font-size:3.5rem;line-height:1;">${info.icon}</div>
      <h4 class="text-gold mt-2">ปีเกิด: ปี${birthZodiac} (${info.animal})</h4>
      <span class="badge mr-2" style="background:rgba(212,175,55,0.15);color:#d4af37;border:1px solid #d4af37;padding:6px 14px;">ธาตุ${info.element}</span>
      <span class="badge" style="background:rgba(212,175,55,0.15);color:#d4af37;border:1px solid #d4af37;padding:6px 14px;">ดาว${info.planet}</span>
    </div>
    <div class="row mb-4">
  `;

  for (let i = 0; i <= 1; i++) {
    const yr = currentCE + i;
    const r  = ycAnalyze(birthZodiac, yr);
    const zi = YC_ZODIAC_INFO[r.targetZodiac];
    html += `
      <div class="col-md-6 mb-3">
        <div class="card h-100" style="background:#111;border:2px solid ${r.color};border-radius:14px;">
          <div class="card-body">
            <h5 style="color:${r.color};">${zi.icon} พ.ศ. ${yr+543} — ปี${r.targetZodiac}</h5>
            <div class="badge mb-2 d-block text-left" style="background:${r.color}20;color:${r.color};border:1px solid ${r.color};padding:5px 10px;font-size:0.85rem;">${r.relation}</div>
            <p class="mb-0" style="color:#ccc;font-size:0.9rem;line-height:1.7;">${r.prediction}</p>
          </div>
        </div>
      </div>`;
  }
  html += `</div>`;

  // ตาราง 12 ปีข้างหน้า
  html += `
    <h5 class="text-gold text-center mb-3">📅 วงจร 12 ปีข้างหน้า</h5>
    <div class="table-responsive">
    <table class="table table-dark table-sm text-center" style="border-color:rgba(212,175,55,0.2);">
      <thead><tr style="color:#d4af37;"><th>ปี พ.ศ.</th><th>นักษัตร</th><th>ความสัมพันธ์</th></tr></thead>
      <tbody>`;

  for (let i = 0; i <= 12; i++) {
    const yr = currentCE + i;
    const r  = ycAnalyze(birthZodiac, yr);
    const zi = YC_ZODIAC_INFO[r.targetZodiac];
    html += `<tr style="background:${r.severity === 'neutral' ? 'transparent' : r.color + '18'}">
      <td style="color:${i===0?'#d4af37':'#aaa'};">${yr+543}${i===0?' ◀ ปีนี้':''}</td>
      <td style="color:${r.color};">${zi.icon} ปี${r.targetZodiac}</td>
      <td style="color:${r.color};">${r.relation}</td>
    </tr>`;
  }

  html += `</tbody></table></div>

    <div class="card mt-3" style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:12px;">
      <div class="card-body">
        <h6 class="text-gold">📖 คำอธิบาย</h6>
        <ul class="mb-0" style="color:#ccc;line-height:1.9;">
          <li><span style="color:#dc3545;">⚠️ ปีชง</span> — นักษัตรตรงข้ามกัน 6 ปี มีอุปสรรค ควรทำบุญสะเดาะเคราะห์</li>
          <li><span style="color:#66bb6a;">✨ ปีเสริม</span> — นักษัตรในกลุ่มสามเหลี่ยมธาตุเดียวกัน เหมาะทำสิ่งสำคัญ</li>
          <li><span style="color:#17a2b8;">🤝 ปีสหาย</span> — นักษัตรข้างเคียง มีคนช่วยเหลือ</li>
          <li><span style="color:#fd7e14;">🔄 ปีเดิมพันธุ์</span> — ตรงกับปีเกิด ระวังตัว ทำบุญ</li>
        </ul>
      </div>
    </div>`;

  container.innerHTML = html;
}

function ycGetDefaultBirthYear() {
  let iso = "";
  // 1. ดึงจาก MemberManager (ข้อมูลผู้ใช้ปัจจุบัน/โปรไฟล์ที่เลือก)
  if (typeof window.MemberManager !== "undefined" && window.MemberManager.getSingleProfile) {
    const profile = window.MemberManager.getSingleProfile();
    if (profile && profile.birthdate) {
      iso = profile.birthdate;
    }
  }
  // 2. ดึงจาก localStorage (userBirthdate)
  if (!iso) {
    iso = localStorage.getItem("userBirthdate") || "";
  }
  // 3. ดึงจากช่อง input หน้าหลัก (#birthdate)
  if (!iso) {
    const mainBirthInput = document.getElementById("birthdate")?.value || "";
    if (mainBirthInput) {
      if (typeof window.birthdateToISO === "function") {
        iso = window.birthdateToISO(mainBirthInput);
      } else if (mainBirthInput.includes("-")) {
        iso = mainBirthInput;
      } else if (mainBirthInput.includes("/")) {
        const parts = mainBirthInput.split("/");
        if (parts.length === 3) {
          let y = parseInt(parts[2]);
          return y <= 2400 ? y + 543 : y;
        }
      }
    }
  }

  if (iso) {
    const rawY = iso.split("-")[0];
    if (rawY && !isNaN(parseInt(rawY))) {
      const y = parseInt(rawY);
      return y <= 2400 ? y + 543 : y;
    }
  }

  // 4. ถ้ายังไม่มีข้อมูลผู้ใช้เลย ให้ใช้ค่าเริ่มต้น (ปีปัจจุบัน - 30) เพื่อให้ระบบแสดงผลวิเคราะห์เริ่มต้นได้ทันที
  return new Date().getFullYear() + 543 - 30;
}

function showYearClashPage() {
  const c = document.getElementById("yearClashContainer");
  if (!c) return;

  const defY = ycGetDefaultBirthYear();

  c.innerHTML = `
    <div class="headpage">
      <h1>🐉 ปีชง – ปีเสริม</h1>
      <p class="text">วิเคราะห์วงจรนักษัตรตามตำราพรหมชาติไทย</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div class="row justify-content-center mb-3">
            <div class="col-md-5">
              <label class="text-gold mb-2">👤 เลือกสมาชิกจากประวัติ</label>
              <select class="form-control bg-dark text-white border-gold member-selector-shared"
                onchange="autoFillMemberData(this.value)">
                <option value="">-- เลือกสมาชิก --</option>
              </select>
            </div>
          </div>
          <div class="row justify-content-center mb-4">
            <div class="col-md-5">
              <label class="text-gold mb-2">ปีเกิด (พ.ศ. หรือ ค.ศ.)</label>
              <div class="input-group">
                <input type="number" id="ycBirthYear" class="form-control bg-dark text-white border-gold"
                  placeholder="เช่น 2510 หรือ 1967" value="${defY}"
                  style="border-radius:10px 0 0 10px;"
                  onkeydown="if(event.key==='Enter') renderYearClash()">
                <div class="input-group-append">
                  <button class="btn btn-gold" onclick="renderYearClash()" style="border-radius:0 10px 10px 0;">
                    <i class="fas fa-search mr-1"></i> วิเคราะห์
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div id="ycResult"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;

  setTimeout(renderYearClash, 80);
}

document.addEventListener("DOMContentLoaded", showYearClashPage);
window.renderYearClash  = renderYearClash;
window.showYearClashPage = showYearClashPage;
window.ycGetDefaultBirthYear = ycGetDefaultBirthYear;
