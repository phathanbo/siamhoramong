"use strict";

// ดิถีพยากรณ์ — ทำนายตามวันค่ำ (ข้างขึ้น-ข้างแรม) ตามตำราพรหมชาติไทย

// Reference new moon: 6 Jan 2000 18:14 UTC  (Julian Day 2451550.1)
const DITHEE_REF = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
const SYNODIC    = 29.530588853; // วันจันทรคติ

function getDithee(date) {
  const diffDays = (date - DITHEE_REF) / 86400000;
  const lunarAge = ((diffDays % SYNODIC) + SYNODIC) % SYNODIC; // 0–29.53
  const ditheeNum = Math.floor(lunarAge) + 1; // 1–30

  let phase, day, phaseThai;
  if (ditheeNum <= 15) {
    phase = "ขึ้น"; phaseThai = "ข้างขึ้น (ศุกลปักษ์)"; day = ditheeNum;
  } else {
    phase = "แรม"; phaseThai = "ข้างแรม (กฤษณปักษ์)"; day = ditheeNum - 15;
  }

  // ประมาณเวลาพระจันทร์ขึ้นเต็มดวง
  const moonPct = Math.round((lunarAge / SYNODIC) * 100);
  let moonIcon;
  if      (lunarAge < 3.7)  moonIcon = "🌑";
  else if (lunarAge < 7.4)  moonIcon = "🌒";
  else if (lunarAge < 11.1) moonIcon = "🌓";
  else if (lunarAge < 14.8) moonIcon = "🌔";
  else if (lunarAge < 16.6) moonIcon = "🌕";
  else if (lunarAge < 20.4) moonIcon = "🌖";
  else if (lunarAge < 24.1) moonIcon = "🌗";
  else if (lunarAge < 27.8) moonIcon = "🌘";
  else                       moonIcon = "🌑";

  return { phase, phaseThai, day, ditheeNum, lunarAge, moonIcon, moonPct };
}

// ข้อมูลดิถีทั้ง 30 — ตามตำราพรหมชาติและโหราศาสตร์ไทยโบราณ
const DITHEE_DATA = {
  // ข้างขึ้น 1–15
  "ขึ้น-1":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันเริ่มต้นรอบใหม่ เหมาะเริ่มกิจการ ขอพร และวางรากฐาน",
    good:["เริ่มกิจการใหม่","ขอพรสิ่งศักดิ์สิทธิ์","ปลูกต้นไม้","วางรากฐาน"],
    avoid:["การทะเลาะ"] },
  "ขึ้น-2":  { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันแปรปรวน อารมณ์ไม่แน่นอน ควรระมัดระวังในคำพูดและการตัดสินใจ",
    good:["งานประจำ","การดูแลสุขภาพ"], avoid:["การเซ็นสัญญา","การลงทุน"] },
  "ขึ้น-3":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันดีสำหรับการเริ่มต้น เหมาะเดินทาง ค้าขาย และสร้างสัมพันธ์",
    good:["เดินทาง","ค้าขาย","สร้างความสัมพันธ์"], avoid:[] },
  "ขึ้น-4":  { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันมีอุปสรรค ระวังความเข้าใจผิดและปัญหาที่ไม่คาดคิด",
    good:["งานที่ต้องทำคนเดียว"], avoid:["การเริ่มสิ่งใหม่","ธุรกรรมสำคัญ"] },
  "ขึ้น-5":  { level:"ดีมาก", icon:"🌟", color:"#ffd700",
    meaning:"วันมงคลค้าขาย เหมาะทำธุรกิจ หารายได้ และสร้างความเจริญรุ่งเรือง",
    good:["ค้าขาย","หารายได้","เปิดกิจการ","เซ็นสัญญา"], avoid:[] },
  "ขึ้น-6":  { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันระวังเรื่องสุขภาพและโรคภัย ควรดูแลร่างกายให้ดี",
    good:["การรักษาพยาบาล","พักผ่อน"], avoid:["เดินทางไกล","งานหนัก"] },
  "ขึ้น-7":  { level:"ดีมาก", icon:"🌟", color:"#ffd700",
    meaning:"วันมงคลสูง เหมาะทำสิ่งสำคัญทุกอย่าง งานพิธีกรรมและธุรกิจ",
    good:["พิธีกรรม","งานสำคัญ","เซ็นสัญญา","เริ่มกิจการ"], avoid:[] },
  "ขึ้น-8":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันพระ (อัฏฐมี) เหมาะทำบุญ รักษาศีล สวดมนต์ งดเบียดเบียนสัตว์",
    good:["ทำบุญ","ถือศีล","สวดมนต์","ให้ทาน"], avoid:["การฆ่าสัตว์","ความรุนแรง"] },
  "ขึ้น-9":  { level:"ดีมาก", icon:"🌟", color:"#ffd700",
    meaning:"วันนวมี มงคลยิ่ง เหมาะงานพิธีและการเริ่มต้นสิ่งที่ต้องการความยั่งยืน",
    good:["งานแต่งงาน","ขึ้นบ้านใหม่","เปิดกิจการ"], avoid:[] },
  "ขึ้น-10": { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันปกติดี เหมาะงานกลุ่ม การประชุม และการวางแผนร่วมกัน",
    good:["ประชุม","วางแผน","ทำงานทีม"], avoid:[] },
  "ขึ้น-11": { level:"ดีมาก", icon:"🌟", color:"#ffd700",
    meaning:"วันเอกาทศี ลาภมาเอง เหมาะหารายได้ ลงทุน และขอความช่วยเหลือจากผู้มีอุปการะ",
    good:["หารายได้","ลงทุน","ขอความช่วยเหลือ"], avoid:[] },
  "ขึ้น-12": { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันระวังเรื่องทรัพย์สิน ระวังการสูญเสียและความผิดพลาดทางการเงิน",
    good:["ตรวจสอบบัญชี","ทบทวนแผน"], avoid:["ลงทุนใหม่","ซื้อของมีค่า"] },
  "ขึ้น-13": { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันดีพอควร เหมาะงานสร้างสรรค์และการพัฒนาตนเอง",
    good:["เรียนรู้","พัฒนาตัวเอง","งานศิลปะ"], avoid:[] },
  "ขึ้น-14": { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันจตุรทศี ใกล้วันเพ็ญ พลังงานสูง เหมาะทำบุญและงานพิธี",
    good:["ทำบุญ","งานพิธี","เตรียมงานสำคัญ"], avoid:[] },
  "ขึ้น-15": { level:"ดีมาก", icon:"🌕", color:"#ffd700",
    meaning:"วันเพ็ญ (ปณมี) — วันมงคลสูงสุดของข้างขึ้น พระจันทร์เต็มดวง พลังงานเต็มที่ ทำสิ่งสำคัญได้ทุกอย่าง",
    good:["พิธีกรรมสำคัญ","ทำบุญ","เริ่มกิจการ","แต่งงาน","ขึ้นบ้านใหม่"], avoid:[] },
  // ข้างแรม 1–15
  "แรม-1":  { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันเริ่มต้นข้างแรม พลังงานลดลง ควรระมัดระวัง ไม่เหมาะเริ่มสิ่งใหม่",
    good:["งานประจำ","พักผ่อน"], avoid:["เริ่มกิจการ","ลงทุน"] },
  "แรม-2":  { level:"ปานกลาง", icon:"🔵", color:"#17a2b8",
    meaning:"วันปานกลาง เหมาะงานที่ต้องความอดทน ไม่เร่งรีบ",
    good:["งานต่อเนื่อง","ทบทวน"], avoid:["ตัดสินใจสำคัญ"] },
  "แรม-3":  { level:"ระวัง", icon:"❌", color:"#dc3545",
    meaning:"วันมีอันตราย ระวังอุบัติเหตุ การทะเลาะและการสูญเสีย",
    good:["งานในบ้าน","พักผ่อน"], avoid:["เดินทางไกล","การทะเลาะ","การลงทุน"] },
  "แรม-4":  { level:"ดีพอควร", icon:"✅", color:"#5cb85c",
    meaning:"วันพอใช้ได้ เหมาะงานประจำและการดูแลรักษาสิ่งที่มีอยู่",
    good:["งานประจำ","ซ่อมแซม","ดูแลทรัพย์สิน"], avoid:[] },
  "แรม-5":  { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันพลังงานต่ำ ระวังความผิดพลาดและความเข้าใจผิด",
    good:["งานสงบ","การนั่งสมาธิ"], avoid:["งานกลุ่ม","การเจรจา"] },
  "แรม-6":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันดีในข้างแรม เหมาะค้าขายทั่วไป สร้างความสัมพันธ์",
    good:["ค้าขาย","สร้างสัมพันธ์","งานสังคม"], avoid:[] },
  "แรม-7":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันพระ (สัปตมี ข้างแรม) เหมาะทำบุญ ถือศีล สวดมนต์",
    good:["ทำบุญ","ถือศีล","สวดมนต์"], avoid:["ความรุนแรง","การฆ่าสัตว์"] },
  "แรม-8":  { level:"ดี",    icon:"✅", color:"#5cb85c",
    meaning:"วันพระ (อัฏฐมีข้างแรม) มงคลพอควร เหมาะทำบุญและสวดมนต์",
    good:["ทำบุญ","สวดมนต์","ให้ทาน"], avoid:[] },
  "แรม-9":  { level:"ดีมาก", icon:"🌟", color:"#ffd700",
    meaning:"วันดีมากในข้างแรม เหมาะทำสิ่งสำคัญ ลงทุน เดินทาง",
    good:["ลงทุน","เดินทาง","งานสำคัญ","เซ็นสัญญา"], avoid:[] },
  "แรม-10": { level:"ปานกลาง", icon:"🔵", color:"#17a2b8",
    meaning:"วันปานกลาง เหมาะงานทั่วไปที่ไม่ต้องการพลังงานสูงมาก",
    good:["งานประจำ","ทบทวน"], avoid:["การเริ่มสิ่งใหม่"] },
  "แรม-11": { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันระวังเรื่องการสูญเสียและอุบัติเหตุ ระวังคนที่ไม่หวังดี",
    good:["พักผ่อน","งานในบ้าน"], avoid:["การลงทุน","เดินทางไกล","ไว้วางใจคนใหม่"] },
  "แรม-12": { level:"ดีพอควร", icon:"✅", color:"#5cb85c",
    meaning:"วันดีพอควรสำหรับงานศิลปะและการเรียนรู้",
    good:["งานศิลปะ","เรียนรู้","พัฒนาทักษะ"], avoid:[] },
  "แรม-13": { level:"ระวัง", icon:"⚠️", color:"#fd7e14",
    meaning:"วันระวัง พลังงานลดลงมาก ระมัดระวังในทุกเรื่อง",
    good:["พักผ่อน","นั่งสมาธิ"], avoid:["การตัดสินใจสำคัญ","งานหนัก"] },
  "แรม-14": { level:"ดีพอควร", icon:"✅", color:"#5cb85c",
    meaning:"วันพระ (จตุรทศีข้างแรม) เหมาะทำบุญ สวดมนต์ เตรียมตัวสำหรับวันดำ",
    good:["ทำบุญ","สวดมนต์","เตรียมตัว"], avoid:[] },
  "แรม-15": { level:"ระวัง", icon:"🌑", color:"#6c757d",
    meaning:"วันดับ (อมาวสี) — วันที่พลังงานต่ำสุด ไม่เหมาะเริ่มสิ่งสำคัญ เหมาะทำบุญอุทิศให้บรรพบุรุษ",
    good:["ทำบุญอุทิศ","สวดมนต์","พักผ่อน"], avoid:["เริ่มกิจการ","ลงทุน","งานสำคัญ"] }
};

// วันพระ (อุโบสถ) ใน 1 เดือนจันทรคติ = ขึ้น 8, ขึ้น 15, แรม 8, แรม 14/15
const WAT_DAYS = new Set(["ขึ้น-8","ขึ้น-15","แรม-8","แรม-14","แรม-15"]);

function renderDitheePage() {
  const el = document.getElementById("ditheeContent");
  if (!el) return;

  const now  = new Date();
  const info = getDithee(now);
  const key  = `${info.phase}-${info.day}`;
  const data = DITHEE_DATA[key] || {
    level:"ปานกลาง", icon:"🔵", color:"#17a2b8",
    meaning:"วันปกติในรอบจันทรคติ", good:[], avoid:[]
  };
  const isWatDay = WAT_DAYS.has(key);

  let html = `
    <div class="text-center mb-4 pb-3" style="border-bottom:1px solid rgba(212,175,55,0.3);">
      <div style="font-size:4rem;line-height:1;">${info.moonIcon}</div>
      <h3 class="text-gold mt-2">วัน${info.phase} ${info.day} ค่ำ</h3>
      <p style="color:#aaa;font-size:0.9rem;margin-bottom:8px;">${info.phaseThai} • พระจันทร์ ${info.moonPct}%</p>
      ${isWatDay ? `<span class="badge mr-2" style="background:#d4af3740;color:#d4af37;border:1px solid #d4af37;padding:5px 14px;">🙏 วันพระ</span>` : ""}
      <span class="badge" style="background:${data.color}22;color:${data.color};border:1px solid ${data.color};padding:5px 14px;">
        ${data.icon} ${data.level}
      </span>
    </div>

    <div class="card mb-4" style="background:#111;border:2px solid ${data.color};border-radius:14px;">
      <div class="card-body text-center">
        <h5 style="color:${data.color};">${data.icon} ความหมายของวัน</h5>
        <p class="mb-0" style="color:#ccc;line-height:1.7;">${data.meaning}</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(40,167,69,0.08);border:1px solid rgba(40,167,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#5cb85c;">✅ เหมาะสำหรับวันนี้</h6>
            ${data.good.length
              ? `<ul class="mb-0" style="color:#bbb;padding-left:18px;">${data.good.map(g=>`<li>${g}</li>`).join("")}</ul>`
              : `<p class="mb-0" style="color:#888;">ทำได้ทุกอย่างตามปกติ</p>`}
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-3">
        <div class="card h-100" style="background:rgba(220,53,69,0.08);border:1px solid rgba(220,53,69,0.35);border-radius:12px;">
          <div class="card-body">
            <h6 style="color:#ff6b6b;">⚠️ ควรหลีกเลี่ยง</h6>
            ${data.avoid.length
              ? `<ul class="mb-0" style="color:#bbb;padding-left:18px;">${data.avoid.map(a=>`<li>${a}</li>`).join("")}</ul>`
              : `<p class="mb-0" style="color:#888;">ไม่มีข้อจำกัดพิเศษ</p>`}
          </div>
        </div>
      </div>
    </div>`;

  // ตารางดิถีตลอดเดือน
  const refDay = new Date(now);
  // หา วันขึ้น 1 ค่ำ ที่ใกล้ที่สุดก่อนวันนี้
  const daysBack = info.ditheeNum - 1;
  const monthStart = new Date(refDay - daysBack * 86400000);

  html += `<h5 class="text-gold text-center mb-3">📅 ดิถีรอบเดือนนี้</h5>
    <div class="table-responsive">
    <table class="table table-dark table-sm text-center" style="border-color:rgba(212,175,55,0.15);">
      <thead><tr style="color:#d4af37;"><th>วันที่</th><th>ดิถี</th><th>ระดับ</th></tr></thead>
      <tbody>`;

  for (let d = 0; d < 30; d++) {
    const dayDate = new Date(monthStart.getTime() + d * 86400000);
    const di      = getDithee(dayDate);
    const k       = `${di.phase}-${di.day}`;
    const dd      = DITHEE_DATA[k] || { level:"ปานกลาง", icon:"🔵", color:"#17a2b8" };
    const isToday = di.ditheeNum === info.ditheeNum;
    const wDay    = WAT_DAYS.has(k);
    const dStr    = `${dayDate.getDate()}/${dayDate.getMonth()+1}`;

    html += `<tr style="${isToday ? `background:${dd.color}20;font-weight:bold;` : ""}">
      <td style="color:${isToday?"#d4af37":"#aaa"};">${dStr}${isToday?" ◀ วันนี้":""}</td>
      <td style="color:${dd.color};">${di.moonIcon} ${di.phase} ${di.day} ค่ำ${wDay?" 🙏":""}</td>
      <td style="color:${dd.color};">${dd.icon} ${dd.level}</td>
    </tr>`;
  }

  html += `</tbody></table></div>

    <div class="card mt-3" style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.25);border-radius:12px;">
      <div class="card-body">
        <h6 class="text-gold">📖 ดิถีในโหราศาสตร์ไทย</h6>
        <p style="color:#ccc;font-size:0.88rem;margin:0;line-height:1.7;">
          ดิถี (Tithi) คือวันจันทรคติ — หนึ่งเดือนจันทรคติมี 30 ดิถี แบ่งเป็น <em>ข้างขึ้น</em> (ศุกลปักษ์) 15 วัน
          และ <em>ข้างแรม</em> (กฤษณปักษ์) 15 วัน ตำราพรหมชาติและโหราศาสตร์ไทยโบราณใช้ดิถีเป็นเกณฑ์
          ตัดสินความเป็นมงคล/อัปมงคลของกิจกรรมต่างๆ ร่วมกับยาม ฤกษ์ และทักษา
        </p>
      </div>
    </div>`;

  el.innerHTML = html;
}

function showDitheePage() {
  const c = document.getElementById("ditheeContainer");
  if (!c) return;
  c.innerHTML = `
    <div class="headpage">
      <h1>🌙 ดิถีพยากรณ์</h1>
      <p class="text">ทำนายตามวันข้างขึ้น-ข้างแรม ตามตำราพรหมชาติไทยโบราณ</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div id="ditheeContent"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;
  renderDitheePage();
}

document.addEventListener("DOMContentLoaded", showDitheePage);
window.showDitheePage   = showDitheePage;
window.renderDitheePage = renderDitheePage;
