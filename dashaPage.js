"use strict";

// ทศาดาว (Planetary Dasha) — ช่วงอายุดาวเจ้าของตามโหราศาสตร์ไทย-อินเดีย
// ระบบนี้ใช้ Vimshottari Dasha (120 ปี) ปรับตามหลักโหราศาสตร์ไทย

// ลำดับดาว 9 ดวง และระยะเวลา Dasha (ปี)
const DASHA_ORDER = [
  { planet:"อาทิตย์",   years:6,   icon:"☀️", color:"#f1c40f", element:"ไฟ"  },
  { planet:"จันทร์",    years:10,  icon:"🌙", color:"#90caf9", element:"ดิน" },
  { planet:"อังคาร",    years:7,   icon:"🔴", color:"#ef5350", element:"ลม"  },
  { planet:"ราหู",      years:18,  icon:"🌑", color:"#7c4dff", element:"ลม"  },
  { planet:"พฤหัสบดี",  years:16,  icon:"🟡", color:"#ffd54f", element:"ดิน" },
  { planet:"เสาร์",     years:19,  icon:"⬛", color:"#90a4ae", element:"ไฟ"  },
  { planet:"พุธ",       years:17,  icon:"💚", color:"#66bb6a", element:"น้ำ" },
  { planet:"เกตุ",      years:7,   icon:"☄️", color:"#ff8a65", element:"น้ำ" },
  { planet:"ศุกร์",     years:20,  icon:"💖", color:"#f48fb1", element:"น้ำ" }
];
// รวม 120 ปี

// ดาวเกิดตามวันในสัปดาห์ (0=อาทิตย์)
const DASHA_BIRTH_PLANET_IDX = {
  0: 0, // อาทิตย์ → เริ่มทศาอาทิตย์
  1: 1, // จันทร์  → เริ่มทศาจันทร์
  2: 2, // อังคาร → เริ่มทศาอังคาร
  3: 6, // พุธ    → เริ่มทศาพุธ (index 6)
  4: 4, // พฤหัส  → เริ่มทศาพฤหัส (index 4)
  5: 8, // ศุกร์  → เริ่มทศาศุกร์ (index 8)
  6: 5  // เสาร์  → เริ่มทศาเสาร์ (index 5)
};

// คำพยากรณ์แต่ละทศา
const DASHA_PRED = {
  "อาทิตย์": {
    positive:["ได้รับเกียรติยศและชื่อเสียง","เลื่อนตำแหน่ง","ได้รับความช่วยเหลือจากผู้ใหญ่","สุขภาพดี"],
    negative:["ระวังความหยิ่งยโส","ปัญหาจากผู้มีอำนาจ","สุขภาพหัวใจ"],
    summary:"ทศาแห่งเกียรติยศ อำนาจ และความสำเร็จ เหมาะทำงานราชการ ขอความช่วยเหลือจากผู้ใหญ่ สร้างชื่อเสียง"
  },
  "จันทร์": {
    positive:["ชีวิตครอบครัวอบอุ่น","ค้าขายดี","ความคิดสร้างสรรค์สูง","ได้รับความนิยม"],
    negative:["อารมณ์แปรปรวน","ปัญหาด้านน้ำ ของเหลว","ระวังคนรอบข้าง"],
    summary:"ทศาแห่งความรู้สึกและครอบครัว เหมาะทำธุรกิจกับประชาชน ดูแลบ้านและครอบครัว"
  },
  "อังคาร": {
    positive:["พลังงานสูง","กล้าตัดสินใจ","เหมาะงานที่ต้องการความกล้า"],
    negative:["ระวังอุบัติเหตุ","ความขัดแย้ง","ความหุนหันพลันแล่น"],
    summary:"ทศาแห่งพลังและการต่อสู้ เหมาะงานที่ต้องความกล้าและพลังงาน ระวังการทะเลาะ"
  },
  "ราหู": {
    positive:["โอกาสใหม่ที่ไม่คาดฝัน","ได้รับสิ่งแปลกใหม่","การเปลี่ยนแปลงที่ดี"],
    negative:["ความไม่มั่นคง","ภาพลวงตา","ระวังสิ่งเสพติดและความหลงผิด"],
    summary:"ทศาแห่งการเปลี่ยนแปลงและโอกาสพิเศษ อาจได้รับโอกาสที่ไม่คาดคิด แต่ต้องระวังภาพลวงตา"
  },
  "พฤหัสบดี": {
    positive:["โชคลาภ","การศึกษาและปัญญา","ศาสนาและจิตใจ","ลูกหลานดี","การเงินดี"],
    negative:["ระวังความเกียจคร้าน","ความฟุ่มเฟือย"],
    summary:"ทศาแห่งโชคและปัญญา ช่วงเวลาดีที่สุดช่วงหนึ่งในชีวิต เหมาะลงทุน ศึกษา และทำบุญ"
  },
  "เสาร์": {
    positive:["ผลจากความพยายามระยะยาว","ความมั่นคง","วินัยและความรับผิดชอบ"],
    negative:["ช้า อุปสรรค","โรคเรื้อรัง","ความเครียดและภาระ"],
    summary:"ทศาแห่งบทเรียนและความอดทน ต้องทำงานหนัก แต่ผลลัพธ์ยั่งยืน ดูแลสุขภาพกระดูกและข้อ"
  },
  "พุธ": {
    positive:["ฉลาด สื่อสารดี","ธุรกิจเจริญ","การเรียนและการเขียน"],
    negative:["ระวังความลังเล","ความสับสนและการตัดสินใจช้า"],
    summary:"ทศาแห่งปัญญาและการค้า เหมาะเรียนรู้ สื่อสาร เขียน และทำธุรกิจที่ต้องใช้ความคิด"
  },
  "เกตุ": {
    positive:["ปัญญาทางจิตวิญญาณ","ความเป็นอิสระ","ความสามารถพิเศษ"],
    negative:["ความโดดเดี่ยว","ความไม่มั่นคง","เหตุการณ์ไม่คาดฝัน"],
    summary:"ทศาแห่งการปลดปล่อยและจิตวิญญาณ เหมาะศึกษาธรรมและพัฒนาจิตใจ ระวังความโดดเดี่ยว"
  },
  "ศุกร์": {
    positive:["ความรัก ความสุข","ทรัพย์สิน","ศิลปะและความงาม","ครอบครัวดี"],
    negative:["ระวังความฟุ่มเฟือย","ความสัมพันธ์ที่ซับซ้อน"],
    summary:"ทศาที่ยาวนานที่สุด (20 ปี) แห่งความสุขและความเจริญรุ่งเรือง เหมาะสร้างครอบครัวและทรัพย์สิน"
  }
};

function getDayOfWeekFromISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  // Zeller หรือ Date()
  return new Date(y, m - 1, d).getDay();
}

function calcDashas(birthISO, currentYear) {
  const dow       = getDayOfWeekFromISO(birthISO);
  const startIdx  = DASHA_BIRTH_PLANET_IDX[dow] ?? 0;
  const birthYear = parseInt(birthISO.split("-")[0]);
  const ageNow    = currentYear - birthYear;

  // สร้าง sequence ทศาทั้งหมดตั้งแต่แรกเกิด
  const dashas = [];
  let yearCursor = 0;
  for (let cycle = 0; cycle < 3; cycle++) { // 3 รอบ = 360 ปี (มากพอ)
    for (let i = 0; i < 9; i++) {
      const idx    = (startIdx + i + cycle * 9) % 9 + (cycle > 0 ? 0 : 0);
      const planet = DASHA_ORDER[(startIdx + i) % 9];
      dashas.push({
        planet: planet.planet,
        icon:   planet.icon,
        color:  planet.color,
        element:planet.element,
        fromAge: yearCursor,
        toAge:   yearCursor + planet.years,
        fromYear: birthYear + yearCursor,
        toYear:   birthYear + yearCursor + planet.years
      });
      yearCursor += planet.years;
      if (yearCursor > 120) break;
    }
    if (yearCursor > 120) break;
  }

  // หาทศาปัจจุบัน
  const current = dashas.find(d => ageNow >= d.fromAge && ageNow < d.toAge);
  return { dashas, current, ageNow, birthYear };
}

function renderDashaPage() {
  const el = document.getElementById("dashaContent");
  if (!el) return;

  const raw     = document.getElementById("dashaBirthDate")?.value?.trim() || "";
  const isoDate = raw
    ? (typeof birthdateToISO === "function" ? birthdateToISO(raw) : raw)
    : (localStorage.getItem("userBirthdate") || "");
  if (!isoDate) {
    el.innerHTML = `<div class="alert alert-warning text-center">กรุณากรอกวันเกิด</div>`;
    return;
  }

  const now       = new Date();
  const { dashas, current, ageNow, birthYear } = calcDashas(isoDate, now.getFullYear());
  if (!current) {
    el.innerHTML = `<div class="alert alert-info text-center">ไม่พบทศาปัจจุบัน (อายุ ${ageNow} ปี)</div>`;
    return;
  }

  const pred = DASHA_PRED[current.planet] || {};

  let html = `
    <div class="text-center mb-4 pb-3" style="border-bottom:1px solid rgba(212,175,55,0.3);">
      <div style="font-size:3rem;">${current.icon}</div>
      <h3 style="color:${current.color};" class="mt-1">ทศาดาว${current.planet}</h3>
      <p style="color:#aaa;font-size:0.9rem;">
        อายุ ${current.fromAge}–${current.toAge} ปี
        (พ.ศ. ${current.fromYear+543}–${current.toYear+543})
      </p>
      <div class="badge" style="background:${current.color}22;color:${current.color};border:1px solid ${current.color};padding:6px 16px;">
        ธาตุ${current.element}
      </div>
      <p class="mt-3 mx-auto mb-0" style="color:#ccc;max-width:500px;line-height:1.7;">${pred.summary || ""}</p>
    </div>

    <div class="row mb-4">
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(40,167,69,0.08);border:1px solid rgba(40,167,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#5cb85c;">✅ ผลด้านบวก</h6>
            <ul class="mb-0" style="color:#bbb;padding-left:18px;">
              ${(pred.positive||[]).map(p=>`<li>${p}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(220,53,69,0.08);border:1px solid rgba(220,53,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#ff6b6b;">⚠️ ข้อควรระวัง</h6>
            <ul class="mb-0" style="color:#bbb;padding-left:18px;">
              ${(pred.negative||[]).map(n=>`<li>${n}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <h5 class="text-gold text-center mb-3">📅 ตารางทศาดาวตลอดชีวิต</h5>
    <div class="table-responsive">
    <table class="table table-dark table-sm text-center" style="border-color:rgba(212,175,55,0.15);">
      <thead><tr style="color:#d4af37;"><th>ดาว</th><th>ช่วงอายุ</th><th>ปี พ.ศ.</th><th>ระยะ (ปี)</th></tr></thead>
      <tbody>`;

  dashas.forEach(d => {
    const isCur = d.planet === current.planet && d.fromAge === current.fromAge;
    html += `<tr style="${isCur ? `background:${d.color}18;font-weight:bold;` : ""}">
      <td style="color:${d.color};">${d.icon} ${d.planet}</td>
      <td style="color:${isCur?"#d4af37":"#aaa"};">${d.fromAge}–${d.toAge} ปี${isCur?" ◀":""}</td>
      <td style="color:#aaa;">${d.fromYear+543}–${d.toYear+543}</td>
      <td style="color:#888;">${d.toAge - d.fromAge}</td>
    </tr>`;
  });

  html += `</tbody></table></div>

    <div class="card mt-3" style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.25);border-radius:12px;">
      <div class="card-body">
        <h6 class="text-gold">📖 ทศาดาว คืออะไร</h6>
        <p style="color:#ccc;font-size:0.88rem;margin:0;line-height:1.7;">
          ทศาดาว (Vimshottari Dasha) มาจากโหราศาสตร์อินเดียที่โหราศาสตร์ไทยรับมา
          แบ่งช่วงชีวิต 120 ปีออกเป็น 9 ช่วงตามดาวเคราะห์ แต่ละช่วงมีดาวเจ้าของ
          ที่กำหนดลักษณะและเหตุการณ์ในช่วงนั้น แตกต่างจากทักษา (Thaksa) ซึ่งแบ่งตามรอบ 9 ปี
          ดาวเกิดตามวันในสัปดาห์กำหนดทศาแรกที่เริ่มต้น
        </p>
      </div>
    </div>`;

  el.innerHTML = html;
}

function showDashaPage() {
  const c = document.getElementById("dashaContainer");
  if (!c) return;

  const isoDate = localStorage.getItem("userBirthdate") || "";
  let dispDate  = isoDate;
  if (isoDate) {
    const [y, m, d] = isoDate.split("-").map(Number);
    dispDate = `${d}/${m}/${y + 543}`;
  }

  c.innerHTML = `
    <div class="headpage">
      <h1>🪐 ทศาดาว</h1>
      <p class="text">ช่วงอายุดาวเจ้าของตามหลักโหราศาสตร์ไทย-อินเดีย (120 ปี)</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div class="row justify-content-center mb-4">
            <div class="col-md-5">
              <label class="text-gold mb-1">วัน/เดือน/ปีเกิด</label>
              <div class="input-group">
                <input type="date" id="dashaBirthDate" class="form-control bg-dark text-white border-gold"
                  value="${isoDate}"
                  style="border-radius:10px 0 0 10px;"
                  onkeydown="if(event.key==='Enter') renderDashaPage()">
                <div class="input-group-append">
                  <button class="btn btn-gold" onclick="renderDashaPage()" style="border-radius:0 10px 10px 0;">
                    <i class="fas fa-calculator mr-1"></i> คำนวณ
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div id="dashaContent"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;

  if (isoDate) setTimeout(renderDashaPage, 80);
}

document.addEventListener("DOMContentLoaded", showDashaPage);
window.showDashaPage   = showDashaPage;
window.renderDashaPage = renderDashaPage;
