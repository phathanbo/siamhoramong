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
  "อาทิตย์": "ไฟ","จันทร์": "ดิน","อังคาร": "ลม",
  "พุธ": "น้ำ","พฤหัสบดี": "ดิน","ศุกร์": "น้ำ","เสาร์": "ไฟ",
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
  { label: "12:00–15:00", dir: "เหนือ" },
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

  if (clkDate) {
      let text = now.toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
      if (typeof getThaiLunar === 'function') {
          const lunar = getThaiLunar(now);
          if (lunar && lunar.fullString) {
              text += ` (${lunar.fullString})`;
          }
      }
      clkDate.textContent = text;
  }
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
    <div class="row g-3">
      <div class="col-md-3 col-6">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-calendar-alt text-gold me-1"></i> ประจำวัน</small>
          <strong class="fs-6 text-warning">วัน${info.dayName}</strong>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-burn text-danger me-1"></i> ธาตุประจำวัน</small>
          <strong class="fs-6 text-light">ธาตุ${info.element}</strong>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-palette text-info me-1"></i> สีมงคล</small>
          <strong class="fs-6 text-light">สี${info.colors.colors[0]}</strong>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-compass text-success me-1"></i> ทิศเดช (หันหน้า)</small>
          <strong class="fs-6" style="color:#4ade80;">ทิศ${info.direction.dech}</strong>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.25);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-crown text-gold me-1"></i> ทิศศรี (เสริมสิริมงคล)</small>
          <strong class="fs-6 text-warning">ทิศ${info.direction.sri}</strong>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="p-3 rounded-3 text-center h-100" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);">
          <small class="text-white-50 d-block mb-1"><i class="fas fa-dragon text-danger me-1"></i> ราหูจรขณะนี้</small>
          <strong class="fs-6 text-danger">สถิตทิศ${info.currentRahu.dir}</strong> <small class="text-white-50">(${info.currentRahu.label} น.)</small>
        </div>
      </div>
    </div>
  `;
}

// ---- SECTION 2: DITHEE ----
function renderDithee() {
  const day = A.getDayName(new Date());
  const data = A.getAuspiciousDithee(day);
  const ranks = ['อมฤตโชค','มหาสิทธิโชค','สิทธิโชค','ชัยโชค','ราชาโชค'];
  const tbody = document.getElementById('ditheeBody');
  if (!tbody) return;
  tbody.innerHTML = data.map((d,i) => `
    <tr>
      <td><span class="badge py-1 px-2" style="background: rgba(212,175,55,0.2); color:#ffd700; border:1px solid rgba(212,175,55,0.4); font-size:0.85rem;">${d.zodiac}</span></td>
      <td><strong style="color:#ffd700; font-size:1.05rem;">${d.dithee}</strong> <span class="small text-white-50">ค่ำ</span></td>
      <td style="color:#94a3b8; font-size:.85rem;">ใช้ได้ทั้งข้างขึ้นและแรม (ข้างขึ้นผลดีเลิศ)</td>
    </tr>
  `).join('');
}

// ---- SECTION 3: DIRECTION ----
function renderDirection() {
  const day = A.getDayName(new Date());
  const dir  = A.DAY_DIRECTION[day];
  const ghost = A.GHOST_DIRECTION[day];
  const sp    = A.SPIRIT_DIRECTION[day];
  const dirGrid = document.getElementById('dirGrid');
  if (!dirGrid) return;

  dirGrid.innerHTML = `
    <div class="row g-2">
      <div class="col-6">
        <div class="p-2 rounded-3 text-center" style="background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3);">
          <small class="text-success fw-bold d-block">ทิศเดช (พลัง/สำเร็จ)</small>
          <strong class="text-white small">⬆ ทิศ${dir.dech}</strong>
        </div>
      </div>
      <div class="col-6">
        <div class="p-2 rounded-3 text-center" style="background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3);">
          <small class="text-info fw-bold d-block">ทิศศรี (เสริมบารมี)</small>
          <strong class="text-white small">⬆ ทิศ${dir.sri}</strong>
        </div>
      </div>
      <div class="col-12">
        <div class="p-2 rounded-3 text-center" style="background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3);">
          <small class="text-success fw-bold d-block">เทวดาจร (หันหน้าสู่ทิศนี้ได้คุณ)</small>
          <strong class="text-white small">⬆ ทิศ${sp.deva}</strong>
        </div>
      </div>
      <div class="col-6">
        <div class="p-2 rounded-3 text-center" style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);">
          <small class="text-danger fw-bold d-block">มฤตยูจร (ควรเลี่ยง)</small>
          <strong class="text-white small">✕ ทิศ${sp.mritu}</strong>
        </div>
      </div>
      <div class="col-6">
        <div class="p-2 rounded-3 text-center" style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);">
          <small class="text-danger fw-bold d-block">ผีหลวง (ทิศร้ายห้ามไป)</small>
          <strong class="text-white small">✕ ทิศ${ghost}</strong>
        </div>
      </div>
    </div>
  `;
}

// ---- SECTION 4: RAHU ----
function renderRahu() {
  const now = new Date();
  const cur  = A.getCurrentRahu(now);
  const rahuGrid = document.getElementById('rahuGrid');
  if (!rahuGrid) return;
  rahuGrid.innerHTML = A.RAHU_DIRECTION.map(r => {
    const active = r.label === cur.label;
    const activeStyle = active ? 'background: rgba(239, 68, 68, 0.2); border: 1.5px solid #ef4444;' : '';
    return `
      <tr style="${activeStyle}">
        <td>${active ? '<span class="badge bg-danger text-light px-2 py-1"><i class="fas fa-exclamation-circle me-1"></i> ขณะนี้</span>' : '<span class="text-white-50">-</span>'}</td>        
        <td><strong class="text-light">${r.label} น.</strong></td>
        <td><strong style="color: #f87171;">ทิศ${r.dir}</strong></td>
      </tr>
    `;
  }).join('');
}

// ---- SECTION 5: REUX ----
function renderReux(list) {
  const reuxGrid = document.getElementById('reuxGrid');
  if (!reuxGrid) return;
  reuxGrid.innerHTML = `
    <div class="row g-3">
      ${(list || A.REUX_TYPES).map(r => `
        <div class="col-md-4 col-sm-6 col-12">
          <div class="card h-100 border-0 rounded-3 p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.3) !important;">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold mb-0 text-gold" style="font-size: 1.05rem;">${r.name}</h5>
              <span class="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25">ดาว${r.planet}</span>
            </div>
            <div class="small text-white-50 mb-2">
              ธาตุ: <strong class="text-light">${r.element}</strong> | เพศ: <strong class="text-light">${r.gender}</strong>
            </div>
            <ul class="small text-light ps-3 mb-0" style="line-height: 1.6;">
              ${r.uses.map(u => `<li>${u}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function searchReux() {
  const kw = document.getElementById('reuxSearch')?.value.trim() || "";
  renderReux(A.findReuxByActivity(kw));
  const rg = document.getElementById('reuxGrid');
  if (rg) rg.style.display = 'block';
}

const reuxSearchEl = document.getElementById('reuxSearch');
if (reuxSearchEl) {
  reuxSearchEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchReux();
  });
}

// ---- SECTION 6: MISC ----
function renderMisc() {
  // กาลกิณีปุ่ม
  const kkRow = document.getElementById('kkButtons');
  if (kkRow) {
    kkRow.innerHTML = A.DAYS.map(d =>
      `<button class="btn btn-outline-warning btn-sm fw-bold px-3 py-2 rounded-3 kk-btn" onclick="showKalakinee('${d}',this)">วัน${d}</button>`
    ).join('');
  }

  // ดิถีแต่งงาน
  const wdUp = document.getElementById('wdUp');
  const wdDown = document.getElementById('wdDown');
  if (wdUp) wdUp.innerHTML = A.WEDDING_DITHEE.ขึ้น.map(n=>`${n} ค่ำ`).join(', ');
  if (wdDown) wdDown.innerHTML = A.WEDDING_DITHEE.แรม.map(n=>`${n} ค่ำ`).join(', ');

  // ข้อห้ามวันนี้
  const day = A.getDayName(new Date());
  const taboos = A.DAY_TABOOS[day] || [];
  const generalOk = [
    'ก่อนฤกษ์ควรดูทิศเดช-ทิศศรี ประกอบ',
    'ช่วง 05:45–06:15 น. ห้ามประกอบฤกษ์ใด ๆ',
    'ฤกษ์มงคล — ข้างขึ้นดีกว่าข้างแรม',
  ];
  const list = document.getElementById('tabooList');
  if (list) {
    list.innerHTML =
      taboos.map(t=>`<li class="text-danger fw-bold"><i class="fas fa-times-circle me-1"></i> ${t}</li>`).join('') +
      generalOk.map(t=>`<li class="text-success"><i class="fas fa-check-circle me-1"></i> ${t}</li>`).join('');
  }
}

function showKalakinee(day, btn) {
  document.querySelectorAll('.kk-btn').forEach(b => {
    b.classList.remove('btn-warning', 'text-dark');
    b.classList.add('btn-outline-warning');
  });
  if (btn) {
    btn.classList.remove('btn-outline-warning');
    btn.classList.add('btn-warning', 'text-dark');
  }
  const kk = A.getKalakinee(day);
  const kkResult = document.getElementById('kk-result');
  if (kkResult) {
    kkResult.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="fas fa-exclamation-triangle text-danger fa-2x"></i>
        <div>
          <div>ผู้เกิดวัน<strong class="text-warning"> ${day}</strong> ➔ วันกาลกิณีต้องห้ามคือ <span class="badge bg-danger fs-6 px-2 py-1">วัน${kk}</span></div>
          <small class="text-white-50">ควรหลีกเลี่ยงการประกอบฤกษ์มงคล ทำสัญญา หรือเริ่มต้นการใหญ่ในวัน${kk}</small>
        </div>
      </div>
    `;
  }
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