"use strict";

// ฤกษ์ยาม 7 เจ้า — Planetary Hours ตามหลักโหราศาสตร์คัลเดีย-ไทย

// ลำดับ Chaldean wheel: อาทิตย์ → ศุกร์ → พุธ → จันทร์ → เสาร์ → พฤหัส → อังคาร
const PH_SEQUENCE = ["อาทิตย์","ศุกร์","พุธ","จันทร์","เสาร์","พฤหัสบดี","อังคาร"];

// index ใน PH_SEQUENCE ที่เป็นเจ้าของยามแรก (หลังดวงอาทิตย์ขึ้น) ของแต่ละวัน
// อา(0)=อาทิตย์(0), จ(1)=จันทร์(3), อ(2)=อังคาร(6), พ(3)=พุธ(2), พฤ(4)=พฤหัส(5), ศ(5)=ศุกร์(1), ส(6)=เสาร์(4)
const PH_DAY_OFFSET = [0, 3, 6, 2, 5, 1, 4];

const PH_DATA = {
  "อาทิตย์": {
    icon:"☀️", color:"#f1c40f", element:"ไฟ",
    good:["ประกอบพิธีกรรม","เข้าพบผู้ใหญ่","เซ็นสัญญาสำคัญ","งานราชการ","บูชาสิ่งศักดิ์สิทธิ์"],
    avoid:["การทะเลาะ","การพนัน","ความขัดแย้ง"],
    desc:"ยามแห่งเกียรติยศและพลัง เหมาะกิจกรรมสำคัญ เข้าพบผู้มีอำนาจ และงานเพื่อส่วนรวม พลังงานสูงสุด"
  },
  "จันทร์": {
    icon:"🌙", color:"#90caf9", element:"ดิน",
    good:["เรื่องครอบครัว","การค้าประจำวัน","การเดินทาง","ขอความช่วยเหลือ","ดูแลสุขภาพ"],
    avoid:["งานหนัก","การโต้เถียง"],
    desc:"ยามแห่งความอ่อนโยนและอารมณ์ เหมาะเรื่องบ้านและครอบครัว ค้าขายทั่วไป สิ่งที่ต้องอาศัยความนุ่มนวล"
  },
  "อังคาร": {
    icon:"🔴", color:"#ef5350", element:"ลม",
    good:["ออกกำลังกาย","งานช่าง","งานที่ต้องใช้กำลัง","ปกป้องตนเอง"],
    avoid:["การทะเลาะ","เซ็นสัญญา","การผ่าตัดที่ไม่ฉุกเฉิน","การลงทุน"],
    desc:"ยามแห่งพลังรบและไฟ ระวังความหุนหันพลันแล่น ไม่เหมาะเรื่องสัญญาและความสัมพันธ์ ดีสำหรับงานใช้กำลัง"
  },
  "พุธ": {
    icon:"💚", color:"#66bb6a", element:"น้ำ",
    good:["เรียนหนังสือ","ค้าขาย","เขียนสัญญา","สื่อสาร","วางแผน","ทำธุรกรรม"],
    avoid:["การพนัน","การสุ่มเสี่ยง"],
    desc:"ยามแห่งปัญญาและการสื่อสาร เหมาะเรียนรู้ เขียน วางแผน ค้าขาย และกิจกรรมที่ต้องใช้สติปัญญา"
  },
  "พฤหัสบดี": {
    icon:"🟡", color:"#ffd54f", element:"ดิน",
    good:["ทำบุญ","ขอพรสิ่งศักดิ์สิทธิ์","เรียนศาสนา","พิธีมงคล","หาครูอาจารย์","ขยายกิจการ"],
    avoid:["การทะเลาะ","ทำสิ่งผิดกฎหมาย"],
    desc:"ยามแห่งโชคและศาสนา เหมาะทำบุญ ขอพร เรียนธรรม เรื่องที่ปรึกษาและครูบาอาจารย์ โชคลาภมาเอง"
  },
  "ศุกร์": {
    icon:"💖", color:"#f48fb1", element:"น้ำ",
    good:["เรื่องความรัก","ศิลปะ","ตกแต่ง","แต่งกาย","บันเทิง","สังสรรค์"],
    avoid:["การโต้เถียง","งานหนัก","เรื่องขัดแย้ง"],
    desc:"ยามแห่งความงามและความรัก เหมาะกิจกรรมสังสรรค์ ศิลปะ แฟชั่น ความบันเทิง และเรื่องหัวใจทุกอย่าง"
  },
  "เสาร์": {
    icon:"⬛", color:"#90a4ae", element:"ไฟ",
    good:["งานวิจัย","งานที่ต้องใช้ความอดทน","งานคนเดียว","ทบทวนแผน"],
    avoid:["เริ่มกิจการใหม่","เดินทางไกล","ลงทุน","ขอสินเชื่อ"],
    desc:"ยามแห่งความช้าและความอดทน ระวังความล่าช้าและอุปสรรค ไม่เหมาะเริ่มสิ่งใหม่ แต่ดีสำหรับงานระยะยาวที่ต้องการความพยายาม"
  }
};

const PH_THAI_DAYS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];

// sunrise ประมาณ 06:00 น. สำหรับประเทศไทย
const SUNRISE_HOUR = 6;

function phGetCurrentPlanet(date) {
  const dow  = date.getDay();
  const h    = date.getHours();
  const elapsed = ((h - SUNRISE_HOUR) + 24) % 24;
  return PH_SEQUENCE[(PH_DAY_OFFSET[dow] + elapsed) % 7];
}

function phGetSchedule(date) {
  const dow    = date.getDay();
  const offset = PH_DAY_OFFSET[dow];
  const list   = [];
  for (let i = 0; i < 24; i++) {
    const hour = (SUNRISE_HOUR + i) % 24;
    list.push({
      from:   `${String(hour).padStart(2,"0")}:00`,
      to:     `${String((hour+1)%24).padStart(2,"0")}:00`,
      planet: PH_SEQUENCE[(offset + i) % 7],
      slot:   i
    });
  }
  return list;
}

function renderPlanetaryHours() {
  const el = document.getElementById("phContent");
  if (!el) return;

  const now     = new Date();
  const curPl   = phGetCurrentPlanet(now);
  const pd      = PH_DATA[curPl];
  const schedule = phGetSchedule(now);
  const curSlot  = ((now.getHours() - SUNRISE_HOUR) + 24) % 24;

  let html = `
    <div class="text-center mb-4 pb-3" style="border-bottom:1px solid rgba(212,175,55,0.3);">
      <p style="color:#888;font-size:0.85rem;margin-bottom:4px;">
        วัน${PH_THAI_DAYS[now.getDay()]} — ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")} น.
      </p>
      <div style="font-size:3rem;line-height:1.2;">${pd.icon}</div>
      <h3 style="color:${pd.color};" class="mt-1">ยามดาว${curPl}</h3>
      <span class="badge" style="background:${pd.color}22;color:${pd.color};border:1px solid ${pd.color};padding:5px 14px;">
        ธาตุ${pd.element}
      </span>
      <p class="mt-3 mb-0 mx-auto" style="color:#ccc;max-width:500px;line-height:1.7;font-size:0.95rem;">${pd.desc}</p>
    </div>

    <div class="row mb-4">
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(40,167,69,0.08);border:1px solid rgba(40,167,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#5cb85c;">✅ เหมาะสำหรับ</h6>
            <ul class="mb-0" style="color:#bbb;padding-left:18px;">
              ${pd.good.map(g=>`<li>${g}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(220,53,69,0.08);border:1px solid rgba(220,53,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#ff6b6b;">⚠️ ควรหลีกเลี่ยง</h6>
            <ul class="mb-0" style="color:#bbb;padding-left:18px;">
              ${pd.avoid.map(a=>`<li>${a}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <h5 class="text-gold text-center mb-3">📋 ตารางยามดาวทั้งวัน (วัน${PH_THAI_DAYS[now.getDay()]})</h5>
    <div class="table-responsive">
    <table class="table table-dark table-sm text-center" style="border-color:rgba(212,175,55,0.15);">
      <thead><tr style="color:#d4af37;">
        <th>ช่วงเวลา</th><th>ดาวเจ้ายาม</th><th>ธาตุ</th><th>เหมาะสำหรับ</th>
      </tr></thead>
      <tbody>`;

  schedule.forEach((s, i) => {
    const p   = PH_DATA[s.planet];
    const cur = i === curSlot;
    html += `<tr style="${cur ? `background:${p.color}18;` : ""}">
      <td style="color:${cur ? p.color : "#aaa"};">${s.from}${cur ? " ◀" : ""}</td>
      <td style="color:${p.color};font-weight:${cur?"bold":"normal"};">${p.icon} ${s.planet}</td>
      <td style="color:#ccc;">${p.element}</td>
      <td style="color:#888;font-size:0.8rem;">${p.good.slice(0,2).join(", ")}</td>
    </tr>`;
  });

  html += `</tbody></table></div>

    <div class="card mt-3" style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.25);border-radius:12px;">
      <div class="card-body">
        <h6 class="text-gold">📖 หลักการยาม 7 เจ้า</h6>
        <p style="color:#ccc;font-size:0.88rem;margin:0;line-height:1.7;">
          ยาม 7 เจ้า (Planetary Hours) มาจากหลักโหราศาสตร์คัลเดีย ซึ่งโหราศาสตร์ไทยรับมาผ่านอินเดียและเขมร
          แต่ละชั่วโมงนับจากดวงอาทิตย์ขึ้น (~06:00 น.) มีดาวเคราะห์เจ้าของสลับกันตาม
          <em>วงล้อ Chaldean</em>: ☀️→💖→💚→🌙→⬛→🟡→🔴 แล้ววนซ้ำ
        </p>
      </div>
    </div>`;

  el.innerHTML = html;
}

function showPlanetaryHoursPage() {
  const c = document.getElementById("planetaryHoursContainer");
  if (!c) return;

  c.innerHTML = `
    <div class="headpage">
      <h1>🌟 ฤกษ์ยาม 7 เจ้า</h1>
      <p class="text">ยามดาวพระเคราะห์ตามหลักโหราศาสตร์คัลเดีย-ไทย</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div id="phContent"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;

  renderPlanetaryHours();

  // อัปเดตทุกนาที
  if (window._phTimer) clearInterval(window._phTimer);
  window._phTimer = setInterval(renderPlanetaryHours, 60000);
}

document.addEventListener("DOMContentLoaded", showPlanetaryHoursPage);
window.showPlanetaryHoursPage = showPlanetaryHoursPage;
window.renderPlanetaryHours   = renderPlanetaryHours;
