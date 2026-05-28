"use strict";

// ===================================================
//  การให้ฤกษ์ฉบับง่าย
//  โดย "พลูหลวง"
// ===================================================

// ---------- ข้อมูลพื้นฐาน ----------

const DAYS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];

// สีประจำวัน
const DAY_COLORS = {
  "อาทิตย์": { colors: ["แดง (เฉดส้ม)"], hex: ["#E8471A"] },
  "จันทร์":  { colors: ["ขาว","นวล","งาช้าง","มุกดา"], hex: ["#F5F0E8","#E8E0D0","#FAFAFA","#B0A8C0"] },
  "อังคาร":  { colors: ["ชมพู","ม่วงแดง"], hex: ["#F06080","#C04080"] },
  "พุธ":     { colors: ["เขียวสด"], hex: ["#28B463"] },
  "พฤหัสบดี":{ colors: ["เหลือง","น้ำตาล","น้ำผึ้ง","ตองอ่อน"], hex: ["#F4D03F","#A0522D","#D4A017","#C8E6C9"] },
  "ศุกร์":   { colors: ["น้ำเงิน","ฟ้า","กรมท่า","เขียวทะเล"], hex: ["#2471A3","#5DADE2","#1A5276","#1A8A6E"] },
  "เสาร์":   { colors: ["ดำ","หม่น","ม่วง","เทา"], hex: ["#1C1C1C","#6D6D6D","#7D3C98","#888888"] },
};

// ธาตุประจำวัน
const DAY_ELEMENT = {
  "อาทิตย์": "ไฟ","จันทร์": "น้ำ","อังคาร": "น้ำ",
  "พุธ": "ดิน","พฤหัสบดี": "ไฟ","ศุกร์": "ลม","เสาร์": "ดิน",
};

// ทิศเดช / ทิศศรี ประจำวัน
const DAY_DIRECTION = {
  "อาทิตย์": { dech: "ตะวันออกเฉียงใต้", sri: "ใต้" },
  "จันทร์":  { dech: "ใต้", sri: "ตะวันตกเฉียงใต้" },
  "อังคาร":  { dech: "ตะวันตกเฉียงใต้", sri: "ตะวันตก" },
  "พุธ":     { dech: "ตะวันตก", sri: "ตะวันตกเฉียงเหนือ" },
  "พฤหัสบดี":{ dech: "เหนือ", sri: "ตะวันออกเฉียงเหนือ" },
  "ศุกร์":   { dech: "ตะวันออก", sri: "ตะวันออกเฉียงใต้" },
  "เสาร์":   { dech: "ตะวันตกเฉียงเหนือ", sri: "เหนือ" },
};

// ทิศผีหลวง
const GHOST_DIRECTION = {
  "อาทิตย์": "ตะวันออกเฉียงเหนือ","จันทร์": "ตะวันออก",
  "อังคาร": "ตะวันออกเฉียงเหนือ","พุธ": "เหนือ",
  "พฤหัสบดี": "ใต้","ศุกร์": "ตะวันตก","เสาร์": "ตะวันออกเฉียงใต้",
};

// เทวดาจร / มฤตยูจร
const SPIRIT_DIRECTION = {
  "อาทิตย์": { deva: "ตะวันออกเฉียงใต้", mritu: "ตะวันออกเฉียงเหนือ" },
  "จันทร์":  { deva: "ตะวันตก", mritu: "ตะวันออก" },
  "อังคาร":  { deva: "ตะวันออกเฉียงเหนือ", mritu: "ตะวันตกเฉียงใต้" },
  "พุธ":     { deva: "ใต้", mritu: "เหนือ" },
  "พฤหัสบดี":{ deva: "ตะวันออกเฉียงเหนือ", mritu: "ตะวันออกเฉียงใต้" },
  "ศุกร์":   { deva: "ตะวันออก", mritu: "ตะวันตก" },
  "เสาร์":   { deva: "ตะวันตกเฉียงใต้", mritu: "ตะวันออกเฉียงเหนือ" },
};

// ราหูจรตามเวลา
const RAHU_DIRECTION = [
  { label: "06:00–09:00", dir: "ตะวันออก" },
  { label: "09:00–12:00", dir: "ตะวันตกเฉียงเหนือ" },
  { label: "12:00–14:00", dir: "เหนือ" },
  { label: "15:00–18:00", dir: "ตะวันออกเฉียงใต้" },
  { label: "18:00–21:00", dir: "ตะวันตก" },
  { label: "21:00–24:00", dir: "ตะวันออกเฉียงเหนือ" },
  { label: "00:00–03:00", dir: "ใต้" },
  { label: "03:00–06:00", dir: "ตะวันตกเฉียงเหนือ" },
];

// ดิถีดี
const AUSPICIOUS_DITHEE = {
  "อมฤตโชค":     { "อาทิตย์":8,"จันทร์":3,"อังคาร":9,"พุธ":2,"พฤหัสบดี":4,"ศุกร์":1,"เสาร์":5 },
  "มหาสิทธิโชค": { "อาทิตย์":14,"จันทร์":12,"อังคาร":13,"พุธ":4,"พฤหัสบดี":7,"ศุกร์":10,"เสาร์":15 },
  "สิทธิโชค":    { "อาทิตย์":13,"จันทร์":5,"อังคาร":14,"พุธ":10,"พฤหัสบดี":9,"ศุกร์":11,"เสาร์":15 },
  "ชัยโชค":      { "อาทิตย์":8,"จันทร์":3,"อังคาร":11,"พุธ":10,"พฤหัสบดี":4,"ศุกร์":1,"เสาร์":11 },
  "ราชาโชค":     { "อาทิตย์":6,"จันทร์":3,"อังคาร":9,"พุธ":6,"พฤหัสบดี":10,"ศุกร์":1,"เสาร์":5 },
};

// กาลกิณีประจำวันเกิด
const KALAKINEE = {
  "อาทิตย์": "ศุกร์","จันทร์": "อาทิตย์","อังคาร": "จันทร์",
  "พุธ": "อังคาร","พฤหัสบดี": "เสาร์","ศุกร์": "พุธ (กลางคืน)","เสาร์": "พุธ",
};

// ดิถีเรียงหมอน (แต่งงาน)
const WEDDING_DITHEE = {
  ขึ้น: [7, 10, 13],
  แรม: [4, 8, 10, 14],
};

// ข้อห้ามประจำวัน
const DAY_TABOOS = {
  "อังคาร": ["ห้ามฤกษ์มงคลทุกชนิด (ดาวบาปเคราะห์)"],
  "เสาร์":  ["ห้ามฤกษ์มงคลทุกชนิด (ดาวบาปเคราะห์)"],
  "พฤหัสบดี":["ห้ามแต่งงาน","ห้ามกิจกรรมต่ำ — เหมาะสำหรับไหว้ครูและเรียนวิชา"],
  "ศุกร์":  ["ห้ามเผาผี","ไม่นิยมปลูกบ้าน (เสียงตรงกับ 'สุก')"],
  "พุธ":    ["ห้ามแต่งงาน","ห้ามหมั้นหมาย (พุธรวนเร)","ห้ามตัดผม/ต้นไม้/ดายหญ้า"],
  "จันทร์": ["เหมาะกิจการสตรีและกิจการเกี่ยวกับน้ำ","กิจการแข็งไม่นิยม"],
  "อาทิตย์":["เหมาะกิจการแข็งแกร่งและกิจการชาย"],
};

// หมวดฤกษ์ทั้ง 9
const REUX_TYPES = [
  {
    name: "ทลิทโทฤกษ์", planet: "เสาร์", element: "ดิน", gender: "ชาย",
    uses: ["สู่ขอ","ทวงหนี้","เดินตลาด","ขอประนีประนอม","ซื้อของเงินผ่อน","กู้ยืมสิน","ออกบวช","ซ่อมบ้าน/รถ","ร้านอาหารเล็กๆ","ค้าเครื่องอะไหล่"],
  },
  {
    name: "มหัทโนฤกษ์", planet: "พฤหัสบดี", element: "ไฟ", gender: "ชาย",
    uses: ["ขึ้นบ้านใหม่","ทำบุญบ้าน","เปิดธนาคาร","เปิดห้างสรรพสินค้า","ร้านขายทอง","งานแซยิด","โกนจุก","แต่งงาน (ผู้มีฐานะ)"],
  },
  {
    name: "โจโรฤกษ์", planet: "มฤตยู", element: "ลม", gender: "หญิง",
    uses: ["ออกเดินทางต่างแดน","การสำรวจ/ค้นคว้า","เผชิญภัย","ท่องเที่ยว","เปิดสถาบันวิจัย","เปิดสถาบันวิทยาศาสตร์"],
  },
  {
    name: "ภูมิปาโลฤกษ์", planet: "พุธ", element: "ดิน", gender: "ชาย",
    uses: ["กสิกรรม","ปลูกบ้าน/ก่อสร้าง","เหมืองแร่","เปิดพิพิธภัณฑ์","งานทูต/เจรจา","ยานพาหนะบนบก","สถานที่เยาวชน"],
  },
  {
    name: "เทศาตรีฤกษ์", planet: "ศุกร์", element: "ลม", gender: "หญิง",
    uses: ["ศิลปการบันเทิง","ไนต์คลับ","โรงภาพยนตร์","แฟชั่น","ร้านเสริมสวย","สถานอาบอบนวด","โรงแรม/โมเตล","สถานตากอากาศ"],
  },
  {
    name: "เทวีฤกษ์", planet: "จันทร์/เนปจูน", element: "น้ำ", gender: "หญิง",
    uses: ["กิจการสตรี","โรงเรียนสตรี","หอพักหญิง","ร้านเครื่องสำอาง","สมาคมสตรี","ทหาร/ตำรวจ (แทนเพชฌฆาต)"],
  },
  {
    name: "เพ็ชรฆาตฤกษ์", planet: "อังคาร", element: "น้ำ", gender: "หญิง",
    uses: ["กิจการทหาร/ตำรวจ","ร้านขายอาวุธ","การต่อสู้/ชกมวย","แข่งกีฬา","ล่าสัตว์","ปลุกเสกเครื่องราง","ไล่ผี"],
  },
  {
    name: "ราชาฤกษ์", planet: "อาทิตย์", element: "ไฟ", gender: "ชาย",
    uses: ["รัฐพิธีโอ่อ่า","ราชาภิเษก","อภิเษกสมรส","วางหลักเมือง","เปิดกระทรวง/รัฐสภา","งานฉลองระดับชาติ"],
  },
  {
    name: "สมโณฤกษ์", planet: "พลูโต", element: "ไฟ", gender: "ชาย",
    uses: ["สร้างอาคารศาสนา","ยกช่อฟ้า","เปิดโรงพยาบาล","งานกฐิน","พุทธาภิเษก","เปิดสวนสาธารณะ","สำนักวิปัสสนา"],
  },
];

// ---------- ฟังก์ชันคำนวณ ----------

/**
 * คืนชื่อวันภาษาไทยจากวันที่
 */
function getDayName(date) {
  return DAYS[date.getDay()];
}

/**
 * ดิถีดีสำหรับวันนั้น
 */
function getAuspiciousDithee(dayName) {
  const result = [];
  for (const [zodiac, days] of Object.entries(AUSPICIOUS_DITHEE)) {
    if (days[dayName] !== undefined) {
      result.push({ zodiac, dithee: days[dayName] });
    }
  }
  return result;
}

/**
 * ราหูจรตามเวลาปัจจุบัน
 */
function getCurrentRahu(date) {
const h = date.getHours();
  // ปรับ Logic ให้ครอบคลุมทุกชั่วโมง
  if (h >= 6 && h < 9)   return RAHU_DIRECTION[0];
  if (h >= 9 && h < 12)  return RAHU_DIRECTION[1];
  if (h >= 12 && h < 15) return RAHU_DIRECTION[2]; // ปรับจาก 14 เป็น 15 เพื่อความต่อเนื่อง
  if (h >= 15 && h < 18) return RAHU_DIRECTION[3];
  if (h >= 18 && h < 21) return RAHU_DIRECTION[4];
  if (h >= 21 && h < 24) return RAHU_DIRECTION[5];
  if (h >= 0  && h < 3)  return RAHU_DIRECTION[6];
  return RAHU_DIRECTION[7];
}

/**
 * ตรวจว่าเวลาอยู่ในช่วงห้ามฤกษ์ (ก่อน/หลังพระอาทิตย์ขึ้น 15 นาที)
 * ใช้ค่าประมาณ sunrise=06:00
 */
function isForbiddenTime(date) {
  const h = date.getHours(), m = date.getMinutes();
  const mins = h * 60 + m;
  return mins >= 345 && mins <= 375; // 05:45 – 06:15
}

/**
 * รวมข้อมูลทั้งหมดสำหรับวันที่กำหนด
 */
function getAllInfoForDate(date) {
  const dayName = getDayName(date);
  return {
    dayName,
    element: DAY_ELEMENT[dayName],
    colors: DAY_COLORS[dayName],
    direction: DAY_DIRECTION[dayName],
    ghostDir: GHOST_DIRECTION[dayName],
    spiritDir: SPIRIT_DIRECTION[dayName],
    taboos: DAY_TABOOS[dayName] || [],
    auspiciousDithee: getAuspiciousDithee(dayName),
    currentRahu: getCurrentRahu(date),
    forbiddenTime: isForbiddenTime(date),
  };
}

/**
 * ค้นหาฤกษ์เหมาะสมตามกิจการ
 */
function findReuxByActivity(keyword) {
  if (!keyword) return REUX_TYPES;
  const kw = keyword.toLowerCase();
  return REUX_TYPES.filter(r =>
    r.name.includes(keyword) ||
    r.uses.some(u => u.toLowerCase().includes(kw)) ||
    r.element.includes(keyword) ||
    r.planet.includes(keyword)
  );
}

/**
 * กาลกิณีของวันเกิด
 */
function getKalakinee(birthDay) {
  return KALAKINEE[birthDay] || "ไม่พบข้อมูล";
}

// Export สำหรับใช้ใน HTML
const A = window.AuspiciousCalc = {
  DAYS, DAY_COLORS, DAY_ELEMENT, DAY_DIRECTION,
  GHOST_DIRECTION, SPIRIT_DIRECTION, RAHU_DIRECTION,
  AUSPICIOUS_DITHEE, KALAKINEE, WEDDING_DITHEE,
  REUX_TYPES, DAY_TABOOS,
  getDayName, getAuspiciousDithee, getCurrentRahu,
  isForbiddenTime, getAllInfoForDate,
  findReuxByActivity, getKalakinee,
};

// ---- ELEMENT TAG HELPER ----
function elemTag(el) {
  const map = { ไฟ:'fire', น้ำ:'water', ดิน:'earth', ลม:'wind' };
  return `<span class="tag ${map[el]||''}">${el}</span>`;
}
function genderTag(g) {
  return g === 'ชาย'
    ? `<span class="tag male">เพศชาย ＋</span>`
    : `<span class="tag female">เพศหญิง −</span>`;
}

// ---- SECTION 1: TODAY ----
function renderToday() {
  const now  = new Date();
  const info = A.getAllInfoForDate(now);

// อัปเดต Clock Bar
  const clkDate = document.getElementById('clkDate');
  const clkDay = document.getElementById('clkDay');
  const clkTime = document.getElementById('clkTime');
  const clkElement = document.getElementById('clkElement');

  if (clkDate) clkDate.textContent = now.toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
  if (clkDay) clkDay.textContent = info.dayName;
  if (clkTime) {
      clkTime.textContent = now.toLocaleTimeString('th-TH');
      // แสดงสีแดงแจ้งเตือนช่วงเวลาห้ามฤกษ์
      clkTime.style.color = info.forbiddenTime ? "#ff4444" : "";
      clkTime.title = info.forbiddenTime ? "ช่วงเวลาอาถรรพ์ห้ามประกอบฤกษ์" : "";
  }
  if (clkElement) clkElement.textContent = info.element;

  const g = document.getElementById('todayGrid');
  if (!g) return; // Guard clause ป้องกัน Error ถ้าไม่มี Element

  g.innerHTML = `
    <div>ข้อมูลประจำวัน${info.dayName}</div>
      <div>ธาตุประจำวัน: ธาตุ${info.element}</div>
      <div>สีมงคล: สี${info.colors.colors[0]}</div>
      <div>ทิศเดช (หันหน้า)<span style="color:#5DDBA3">: ทิศ${info.direction.dech}</span></div>
       <div>ทิศศรี<span class="value" style="color:#F0D080">: ทิศ${info.direction.sri}</div>
      <div>ราหูจรขณะนี้
      <span class="value" style="color:#FF9980">ใน ทิศ${info.currentRahu.dir}</span> ณ เวลา <span class="sub">${info.currentRahu.label}</span>
    </div>
  `;
}

// ---- SECTION 2: DITHEE ----
function renderDithee() {
  const day = A.getDayName(new Date());
  const data = A.getAuspiciousDithee(day);
  const ranks = ['อมฤตโชค','มหาสิทธิโชค','สิทธิโชค','ชัยโชค','ราชาโชค'];
  const badgeClass = ['high','','low','low',''];
  const tbody = document.getElementById('ditheeBody');
  tbody.innerHTML = data.map((d,i) => `
    <tr style="background:var(--bg-alt);">
      <td><span class="badge ${badgeClass[i]||''}">${d.zodiac}</span></td>
      <td><strong style="color:var(--gold-lt)">${d.dithee}</strong> ค่ำ</td>
      <td style="color:var(--muted);font-size:.8rem">ใช้ได้ทั้งข้างขึ้นและแรม (ข้างขึ้นดีกว่า)</td>
    </tr>
  `).join('');
}

// ---- SECTION 3: DIRECTION ----
function renderDirection() {
  const day = A.getDayName(new Date());
  const dir  = A.DAY_DIRECTION[day];
  const ghost = A.GHOST_DIRECTION[day];
  const sp    = A.SPIRIT_DIRECTION[day];

  document.getElementById('dirGrid').innerHTML = `
    <div class="dir-card safe">
      <div class="dir-label">ทิศเดช — ให้พลังและความสำเร็จ :</div>
      <div class="dir-value">⬆ ${dir.dech}</div>
    <br>    
    </div>
    <div class="dir-card">
      <div class="dir-label">ทิศศรี — เสริมบารมี :</div>
      <div class="dir-value">⬆ ${dir.sri}</div>
    <br>    
    <div class="dir-card safe">
      <div class="dir-label">เทวดาจร - หันหน้าสู่ทิศนี้ได้คุณ:</div>
      <div class="dir-value">⬆ ${sp.deva}</div>
    <br>    
    <div class="dir-card danger">
      <div class="dir-label">มฤตยูจร — หลีกเลี่ยง :</div>
      <div class="dir-value">✕ ${sp.mritu}</div>
    <br>    
    <div class="dir-card danger">
      <div class="dir-label">ผีหลวง — โดยเฉพาะการเล่นพนัน</div>
      <div class="dir-value">✕ ${ghost}</div>
    </div>
  `;
}

// ---- SECTION 4: RAHU ----
function renderRahu() {
  const now = new Date();
  const cur  = A.getCurrentRahu(now);
  document.getElementById('rahuGrid').innerHTML = A.RAHU_DIRECTION.map(r => {
    const active = r.label === cur.label;
    return `
      <div class="rahu-card ${active?'active':''}">
        <tr>
        <td>${active ? '<span class="now-tag">ขณะนี้</span>' : ''}</td>        
        <td><div class="rahu-time">${r.label} น.</div></td>
        <td><div class="rahu-dir">${r.dir}</div></td>
        </tr>
      </div>
    `;
  }).join('');
}

// ---- SECTION 5: REUX ----
function renderReux(list) {
  document.getElementById('reuxGrid').innerHTML = (list || A.REUX_TYPES).map(r => `
    <div class="reux-card" style="display: block;">
      <div class="reux-name">${r.name}</div>
      <div class="reux-info">
        <span>ดาว${r.planet}</span>
        ${elemTag(r.element)}
        ${genderTag(r.gender)}
      </div>
      <ul class="reux-uses" style="margin-top: .5rem; padding-left: 1.2rem; font-size: .9rem;">
        ${r.uses.map(u=>`<li>${u}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function searchReux() {
  const kw = document.getElementById('reuxSearch').value.trim();
  renderReux(A.findReuxByActivity(kw));
}
document.getElementById('reuxSearch').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchReux();

  document.getElementById('reuxGrid').style.display = 'block';
 // แสดงผลปุ่ม Clear อัตโนมัติเมื่อกด Enter
});

// ---- SECTION 6: MISC ----
function renderMisc() {
  // กาลกิณีปุ่ม
  const kkRow = document.getElementById('kkButtons');
  kkRow.innerHTML = A.DAYS.map(d =>
    `<button class="kk-btn" onclick="showKalakinee('${d}',this)">${d}</button>`
  ).join('');

  // ดิถีแต่งงาน
  document.getElementById('wdUp').innerHTML = A.WEDDING_DITHEE.ขึ้น.map(n=>`<span class="dithee-pill">${n} ค่ำ</span>`).join(' ,');
  document.getElementById('wdDown').innerHTML = A.WEDDING_DITHEE.แรม.map(n=>`<span class="dithee-pill">${n} ค่ำ</span>`).join(' ,');

  // ข้อห้ามวันนี้
  const day = A.getDayName(new Date());
  const taboos = A.DAY_TABOOS[day] || [];
  const generalOk = [
    'ก่อนฤกษ์ควรดูทิศเดช-ทิศศรี ประกอบ',
    'ช่วง 05:45–06:15 น. ห้ามประกอบฤกษ์ใด ๆ',
    'ฤกษ์มงคล — ข้างขึ้นดีกว่าข้างแรม',
  ];
  const list = document.getElementById('tabooList');
  list.innerHTML =
    taboos.map(t=>`<li>${t}</li>`).join('') +
    generalOk.map(t=>`<li class="ok">${t}</li>`).join('');
}

function showKalakinee(day, btn) {
  document.querySelectorAll('.kk-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const kk = A.getKalakinee(day);
  document.getElementById('kk-result').innerHTML =
    `ผู้เกิดวัน<strong style="color:var(--gold-lt)">${day}</strong> — วันกาลกิณีคือ <span class="kk-highlight">${kk}</span><br>
     <span style="font-size:.8rem;color:var(--muted)">หลีกเลี่ยงประกอบฤกษ์มงคลในวัน${kk}</span>`;
}

// ---- INIT ----
function init() {
  renderToday();
  renderDithee();
  renderDirection();
  renderRahu();
  renderReux();
  renderMisc();
}

init();

// อัปเดตนาฬิกาทุก 30 วินาที
setInterval(() => {
  const now = new Date();
  const info = A.getAllInfoForDate(now);
  document.getElementById('clkTime').textContent = now.toLocaleTimeString('th-TH');
  // refresh rahu ด้วย
  renderRahu();
}, 1000);