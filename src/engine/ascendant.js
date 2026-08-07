"use strict";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ระบบคำนวณลัคนาพยากรณ์ — ตามหลักโหราศาสตร์ไทย-ฮินดู (นิรายันระบบ)
 * ═══════════════════════════════════════════════════════════════════════
 * หลักการ:
 *   1. คำนวณ Julian Day Number (JDN) จากวัน-เดือน-ปี-เวลาเกิด (UTC+7)
 *   2. คำนวณ Greenwich Sidereal Time (IAU 2006) → Local Sidereal Time
 *   3. คำนวณองศาลัคนาสุริยวิถีแบบสายัน (Tropical Ascendant)
 *      สูตร: atan(cos(LST) / (-sin(ε)·tan(φ) + cos(ε)·sin(LST)))
 *      พร้อม Quadrant Correction
 *   4. ลบอยันศ์ลาหิริ (Lahiri Ayanamsha) → ลัคนานิรายัน (Sidereal)
 *   5. แบ่งราศี 30° ต่อราศี → ได้ลัคนาราศี + องศา นาที วินาที
 *
 * ใช้ค่าคงที่เดียวกับ thaiHora.js:
 *   LAHIRI_OFFSET_J2000 = 23.853056°
 *   PRECESSION_RATE     = 50.290966"/yr
 */

// ─── ข้อมูล 12 ราศี (Rasi) ─────────────────────────────────────────────
const ZODIAC_DATA = [
  {
    name: "เมษ", icon: "♈",
    desc: "เป็นคนกระตือรือร้น มีความเป็นผู้นำ กล้าหาญ และชอบความท้าทาย",
    element: "ธาตุไฟ", ruler: "ดาวอังคาร",
    strengths: ["กล้าตัดสินใจ", "พลังงานสูง", "ตรงไปตรงมา"],
    weaknesses: ["ใจร้อน", "เบื่อง่าย", "ไม่ฟังใคร"],
    luckyColor: "แดง, ส้ม", luckyNumber: [1, 9],
    compatible: ["สิงห์", "ธนู", "เมถุน"],
    career: "ทหาร ตำรวจ นักกีฬา สตาร์ทอัพ นักขาย",
    love: "รักเร็ว ร้อนแรง ต้องการคนตามทัน",
    health: "ระวังศีรษะ ไมเกรน อุบัติเหตุจากความรีบ"
  },
  {
    name: "พฤษภ", icon: "♉",
    desc: "เป็นคนหนักแน่น อดทน รักสวยรักงาม และให้ความสำคัญกับความมั่นคง",
    element: "ธาตุดิน", ruler: "ดาวศุกร์",
    strengths: ["อดทน", "ซื่อสัตย์", "มีรสนิยม"],
    weaknesses: ["ดื้อ", "ยึดติด", "หวงของ"],
    luckyColor: "เขียว, ชมพู", luckyNumber: [2, 6],
    compatible: ["กันย์", "มังกร", "กรกฎ"],
    career: "การเงิน อสังหา เชฟ ศิลปะ งานฝีมือ",
    love: "รักมั่นคง ช้าแต่นาน ต้องการความปลอดภัย",
    health: "ระวังคอ ต่อมไทรอยด์ น้ำหนักขึ้นง่าย"
  },
  {
    name: "เมถุน", icon: "♊",
    desc: "เป็นคนฉลาด มีไหวพริบ ช่างพูดช่างเจรจา และปรับตัวเก่ง",
    element: "ธาตุลม", ruler: "ดาวพุธ",
    strengths: ["สื่อสารเก่ง", "เรียนรู้ไว", "ยืดหยุ่น"],
    weaknesses: ["ลังเล", "เบื่อง่าย", "พูดมาก"],
    luckyColor: "เหลือง, เทา", luckyNumber: [3, 5],
    compatible: ["ตุลย์", "กุมภ์", "เมษ"],
    career: "สื่อ นักเขียน MC ขาย การตลาด",
    love: "ต้องการความสนุก คุยรู้เรื่อง ไม่น่าเบื่อ",
    health: "ระวังปอด ภูมิแพ้ ความเครียดจากคิดมาก"
  },
  {
    name: "กรกฎ", icon: "♋",
    desc: "เป็นคนรักครอบครัว มีเมตตา อ่อนโยน และมีสัญชาตญาณแรงกล้า",
    element: "ธาตุน้ำ", ruler: "ดวงจันทร์",
    strengths: ["เอาใจใส่", "จำเก่ง", "ปกป้องคนรัก"],
    weaknesses: ["อ่อนไหว", "ขี้น้อยใจ", "ยึดติดอดีต"],
    luckyColor: "ขาว, เงิน", luckyNumber: [2, 7],
    compatible: ["พิจิก", "มีน", "พฤษภ"],
    career: "ครู พยาบาล เชฟ งานดูแล อสังหา",
    love: "รักลึกซึ้ง ต้องการบ้านที่อบอุ่น",
    health: "ระวังกระเพาะ ทางเดินอาหาร อารมณ์แปรปรวน"
  },
  {
    name: "สิงห์", icon: "♌",
    desc: "เป็นคนสง่างาม มั่นใจในตัวเอง มีบารมี และชอบความเป็นที่หนึ่ง",
    element: "ธาตุไฟ", ruler: "ดวงอาทิตย์",
    strengths: ["ผู้นำ", "ใจกว้าง", "สร้างแรงบันดาลใจ"],
    weaknesses: ["อีโก้สูง", "ชอบควบคุม", "ติดหรู"],
    luckyColor: "ทอง, ส้ม", luckyNumber: [1, 5],
    compatible: ["เมษ", "ธนู", "ตุลย์"],
    career: "ผู้บริหาร ดารา งานสร้างแบรนด์ อีเวนต์",
    love: "ชอบถูกยกย่อง รักแบบเปิดเผย",
    health: "ระวังหัวใจ หลัง ความดัน"
  },
  {
    name: "กันย์", icon: "♍",
    desc: "เป็นคนละเอียดรอบคอบ มีระเบียบวินัย และเก่งในการวิเคราะห์",
    element: "ธาตุดิน", ruler: "ดาวพุธ",
    strengths: ["เป๊ะ", "วิเคราะห์เก่ง", "บริการดี"],
    weaknesses: ["จู้จี้", "กังวล", "วิจารณ์เก่ง"],
    luckyColor: "เขียวอ่อน, น้ำตาล", luckyNumber: [5, 14],
    compatible: ["พฤษภ", "มังกร", "กรกฎ"],
    career: "หมอ นักวิจัย บัญชี QA งานข้อมูล",
    love: "รักด้วยการกระทำ ต้องการความสมบูรณ์แบบ",
    health: "ระวังลำไส้ ระบบย่อย ความเครียด"
  },
  {
    name: "ตุลย์", icon: "♎",
    desc: "เป็นคนรักความยุติธรรม มีเสน่ห์ เข้ากับคนง่าย และชอบความสมดุล",
    element: "ธาตุลม", ruler: "ดาวศุกร์",
    strengths: ["ทูต", "ยุติธรรม", "มีสไตล์"],
    weaknesses: ["ลังเล", "กลัวขัดแย้ง", "พึ่งพาคนอื่น"],
    luckyColor: "ฟ้า, ชมพู", luckyNumber: [6, 9],
    compatible: ["เมถุน", "กุมภ์", "สิงห์"],
    career: "กฎหมาย ดีไซน์ PR ที่ปรึกษา ความงาม",
    love: "โรแมนติก ต้องการคู่ที่เท่าเทียม",
    health: "ระวังไต หลังส่วนล่าง สมดุลฮอร์โมน"
  },
  {
    name: "พิจิก", icon: "♏",
    desc: "เป็นคนมีความลึกลับ มีพลังอำนาจในตัว และมีความมุ่งมั่นสูง",
    element: "ธาตุน้ำ", ruler: "ดาวอังคาร",
    strengths: ["ลึกซึ้ง", "อดทน", "อ่านคนออก"],
    weaknesses: ["หึงหวง", "แค้นฝัง", "ควบคุม"],
    luckyColor: "แดงเลือดหมู, ดำ", luckyNumber: [8, 11],
    compatible: ["กรกฎ", "มีน", "กันย์"],
    career: "สืบสวน จิตแพทย์ การเงิน นักวิจัย",
    love: "รักลึก หวงแหน ต้องการความจริงใจ 100%",
    health: "ระวังอวัยวะสืบพันธุ์ ระบบขับถ่าย"
  },
  {
    name: "ธนู", icon: "♐",
    desc: "เป็นคนมองโลกกว้าง รักอิสระ ชอบเดินทาง และมีปรัชญาในการใช้ชีวิต",
    element: "ธาตุไฟ", ruler: "ดาวพฤหัสบดี",
    strengths: ["มองภาพใหญ่", "เป็นกันเอง", "ซื่อตรง"],
    weaknesses: ["ปากตรงเกิน", "หวือหวา", "ไม่มีวินัย"],
    luckyColor: "ม่วง, น้ำเงิน", luckyNumber: [3, 12],
    compatible: ["เมษ", "สิงห์", "กุมภ์"],
    career: "อาจารย์ นักเดินทาง ทนาย ศาสนา",
    love: "รักเสรีภาพ ต้องการคนที่ให้พื้นที่",
    health: "ระวังสะโพก ต้นขา น้ำหนักเกิน"
  },
  {
    name: "มังกร", icon: "♑",
    desc: "เป็นคนทะเยอทะยาน มีวินัย ขยันและอดทนเพื่อความสำเร็จ",
    element: "ธาตุดิน", ruler: "ดาวเสาร์",
    strengths: ["อดทน", "มีวินัย", "มุ่งมั่น"],
    weaknesses: ["เย็นชา", "ทำงานหนักเกิน", "ยึดติดสถานะ"],
    luckyColor: "เทา, ดำ, น้ำตาล", luckyNumber: [8, 10],
    compatible: ["พฤษภ", "กันย์", "พิจิก"],
    career: "บริหาร วิศวกรรม การเงิน รัฐการ",
    love: "รักมั่นคง ต้องการความจริงจัง",
    health: "ระวังเข่า กระดูก ผิวหนัง"
  },
  {
    name: "กุมภ์", icon: "♒",
    desc: "เป็นคนคิดนอกกรอบ รักความเป็นเอกเทศ และมีอุดมการณ์เพื่อส่วนรวม",
    element: "ธาตุลม", ruler: "ดาวเสาร์/ยูเรนัส",
    strengths: ["สร้างสรรค์", "เป็นตัวเอง", "มีอุดมการณ์"],
    weaknesses: ["ห่างเหิน", "ดื้อ", "ไม่แน่ใจในอารมณ์"],
    luckyColor: "ฟ้า, ม่วง", luckyNumber: [4, 11],
    compatible: ["เมถุน", "ตุลย์", "ธนู"],
    career: "IT วิทยาศาสตร์ สังคมสงเคราะห์ นวัตกรรม",
    love: "ต้องการเพื่อนคู่คิด ไม่ชอบความน่าเบื่อ",
    health: "ระวังข้อเท้า ระบบไหลเวียน"
  },
  {
    name: "มีน", icon: "♓",
    desc: "เป็นคนมีจินตนาการสูง เห็นอกเห็นใจผู้อื่น และมีจิตวิญญาณทางศิลปะ",
    element: "ธาตุน้ำ", ruler: "ดาวพฤหัสบดี/เนปจูน",
    strengths: ["เห็นอกเห็นใจ", "สร้างสรรค์", "ลึกซึ้ง"],
    weaknesses: ["โลกส่วนตัว", "เปราะบาง", "ไม่ตั้งใจ"],
    luckyColor: "ทะเล, ม่วงอ่อน", luckyNumber: [7, 12],
    compatible: ["กรกฎ", "พิจิก", "มังกร"],
    career: "ศิลปิน นักดนตรี นักจิตวิทยา งานบวช",
    love: "รักด้วยหัวใจ ต้องการความอ่อนโยน",
    health: "ระวังเท้า ระบบน้ำเหลือง ภาวะซึมเศร้า"
  }
];

// ─── สีตามธาตุ ─────────────────────────────────────────────────────────
const ASC_ELEMENT_COLORS = {
  "ธาตุไฟ": "#ff4444",
  "ธาตุดิน": "#c68642",
  "ธาตุลม": "#00ddff",
  "ธาตุน้ำ": "#0077ff"
};

// ─── รายชื่อจังหวัด/เมืองสำคัญทั่วไทย ─────────────────────────────────
const ASC_CITY_LIST = [
  { name:"กรุงเทพมหานคร",    lat:13.7563, lng:100.5018 },
  { name:"กาญจนบุรี",        lat:14.0023, lng: 99.5472 },
  { name:"กาฬสินธุ์",        lat:16.4315, lng:103.5060 },
  { name:"กำแพงเพชร",        lat:16.4828, lng: 99.5228 },
  { name:"ขอนแก่น",          lat:16.4322, lng:102.8236 },
  { name:"จันทบุรี",         lat:12.6105, lng:102.1044 },
  { name:"ฉะเชิงเทรา",       lat:13.6904, lng:101.0779 },
  { name:"ชลบุรี",           lat:13.3611, lng:100.9847 },
  { name:"ชัยนาท",           lat:15.1853, lng:100.1246 },
  { name:"ชัยภูมิ",          lat:15.8068, lng:101.9222 },
  { name:"ชุมพร",            lat:10.4930, lng: 99.1800 },
  { name:"เชียงของ",         lat:20.2694, lng:100.4017 },
  { name:"เชียงราย",         lat:19.9071, lng: 99.8308 },
  { name:"เชียงใหม่",        lat:18.7883, lng: 98.9853 },
  { name:"ตรัง",             lat: 7.5591, lng: 99.6114 },
  { name:"ตราด",             lat:12.2428, lng:102.5167 },
  { name:"ตาก",              lat:16.8800, lng: 99.1428 },
  { name:"นครนายก",          lat:14.2048, lng:101.2131 },
  { name:"นครปฐม",           lat:13.8199, lng:100.0640 },
  { name:"นครพนม",           lat:17.4101, lng:104.7730 },
  { name:"นครราชสีมา",       lat:14.9799, lng:102.0978 },
  { name:"นครศรีธรรมราช",    lat: 8.4324, lng: 99.9631 },
  { name:"นครสวรรค์",        lat:15.7027, lng:100.1369 },
  { name:"นนทบุรี",          lat:13.8621, lng:100.5149 },
  { name:"นราธิวาส",         lat: 6.4264, lng:101.8236 },
  { name:"น่าน",             lat:18.7756, lng:100.7731 },
  { name:"บึงกาฬ",           lat:18.3609, lng:103.6484 },
  { name:"บุรีรัมย์",        lat:14.9950, lng:103.1029 },
  { name:"ปทุมธานี",         lat:14.0208, lng:100.5250 },
  { name:"ประจวบคีรีขันธ์",  lat:11.8126, lng: 99.7978 },
  { name:"ปราจีนบุรี",       lat:14.0519, lng:101.3673 },
  { name:"ปัตตานี",          lat: 6.8697, lng:101.2510 },
  { name:"พระนครศรีอยุธยา",  lat:14.3532, lng:100.5697 },
  { name:"พะเยา",            lat:19.1566, lng: 99.9000 },
  { name:"พังงา",            lat: 8.4515, lng: 98.5254 },
  { name:"พัทลุง",           lat: 7.6167, lng:100.0743 },
  { name:"พิจิตร",           lat:16.4426, lng:100.3493 },
  { name:"พิษณุโลก",         lat:16.8211, lng:100.2659 },
  { name:"เพชรบุรี",         lat:13.1119, lng: 99.9399 },
  { name:"เพชรบูรณ์",        lat:16.4190, lng:101.1591 },
  { name:"แพร่",             lat:18.1445, lng:100.1399 },
  { name:"ภูเก็ต",           lat: 7.8804, lng: 98.3923 },
  { name:"มหาสารคาม",        lat:16.1851, lng:103.3000 },
  { name:"มุกดาหาร",         lat:16.5432, lng:104.7239 },
  { name:"แม่ฮ่องสอน",       lat:19.3020, lng: 97.9655 },
  { name:"ยโสธร",            lat:15.7924, lng:104.1478 },
  { name:"ยะลา",             lat: 6.5213, lng:101.2804 },
  { name:"ร้อยเอ็ด",         lat:16.0540, lng:103.6520 },
  { name:"ระนอง",            lat: 9.9529, lng: 98.6085 },
  { name:"ระยอง",            lat:12.6814, lng:101.2816 },
  { name:"ราชบุรี",          lat:13.5282, lng: 99.8134 },
  { name:"ลพบุรี",           lat:14.7995, lng:100.6534 },
  { name:"ลำปาง",            lat:18.2888, lng: 99.4944 },
  { name:"ลำพูน",            lat:18.5741, lng: 99.0087 },
  { name:"เลย",              lat:17.4866, lng:101.7236 },
  { name:"ศรีสะเกษ",         lat:15.1199, lng:104.3217 },
  { name:"สกลนคร",           lat:17.1554, lng:104.1348 },
  { name:"สงขลา/หาดใหญ่",   lat: 7.0078, lng:100.4730 },
  { name:"สตูล",             lat: 6.6238, lng:100.0673 },
  { name:"สมุทรปราการ",      lat:13.5991, lng:100.5999 },
  { name:"สมุทรสงคราม",      lat:13.4098, lng:100.0019 },
  { name:"สมุทรสาคร",        lat:13.5477, lng:100.2742 },
  { name:"สระแก้ว",          lat:13.8236, lng:102.0643 },
  { name:"สระบุรี",          lat:14.5289, lng:100.9097 },
  { name:"สิงห์บุรี",        lat:14.8897, lng:100.3967 },
  { name:"สุโขทัย",          lat:17.0060, lng: 99.8260 },
  { name:"สุพรรณบุรี",       lat:14.4744, lng:100.1178 },
  { name:"สุราษฎร์ธานี",     lat: 9.1382, lng: 99.3314 },
  { name:"สุรินทร์",         lat:14.8827, lng:103.4937 },
  { name:"หนองคาย",          lat:17.8782, lng:102.7410 },
  { name:"หนองบัวลำภู",      lat:17.2047, lng:102.4378 },
  { name:"อ่างทอง",          lat:14.5896, lng:100.4552 },
  { name:"อำนาจเจริญ",       lat:15.8601, lng:104.6252 },
  { name:"อุดรธานี",         lat:17.4158, lng:102.7878 },
  { name:"อุตรดิตถ์",        lat:17.6248, lng:100.0993 },
  { name:"อุทัยธานี",        lat:15.3835, lng:100.0256 },
  { name:"อุบลราชธานี",      lat:15.2448, lng:104.8473 },
];

// ═══════════════════════════════════════════════════════════════════════
// ฟังก์ชันดาราศาสตร์ (ใช้ค่าคงที่เดียวกับ thaiHora.js)
// ═══════════════════════════════════════════════════════════════════════

/** Julian Day Number (Gregorian calendar, อัลกอริทึม Meeus) */
function ascJD(year, month, day, utHour) {
  const A = Math.floor((14 - month) / 12);
  const Y = year + 4800 - A;
  const M = month + 12 * A - 3;
  const jdn = day + Math.floor((153 * M + 2) / 5)
            + 365 * Y + Math.floor(Y / 4)
            - Math.floor(Y / 100) + Math.floor(Y / 400)
            - 32045;
  return jdn - 0.5 + utHour / 24.0;
}

/** Normalize to [0, 360) */
function ascNorm(deg) {
  let d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Greenwich Sidereal Time (IAU 2006) เป็นองศา */
function ascGST(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const θ = 280.46061837
           + 360.98564736629 * (jd - 2451545.0)
           + 0.000387933 * T * T
           - T * T * T / 38710000.0;
  return ascNorm(θ);
}

/** Obliquity of the ecliptic (องศา) */
function ascObliquity(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.439291 - 0.013004 * T;
}

/** อยันศ์ลาหิริ (Lahiri Ayanamsha) เป็นองศา — ค่าเดียวกับ thaiHora.js */
function ascAyanamsha(jd) {
  const LAHIRI_J2000  = 23.853056;
  const PRECESSION_YR = 50.290966 / 3600; // deg/year
  return LAHIRI_J2000 + PRECESSION_YR * (jd - 2451545.0) / 365.25;
}

/**
 * คำนวณองศาลัคนาสุริยวิถี (Tropical Ascendant)
 * สูตร: atan(cos(LST) / (-sin(ε)·tan(φ) + cos(ε)·sin(LST)))
 * พร้อม Quadrant Correction ตามเครื่องหมาย sin(LST)
 *
 * @param {number} lst - Local Sidereal Time (degrees)
 * @param {number} lat - Geographic latitude (degrees north)
 * @param {number} eps - Obliquity of ecliptic (degrees)
 * @returns {number} Tropical ecliptic longitude of Ascendant (0–360°)
 */
function ascTropical(lst, lat, eps) {
  const D      = Math.PI / 180;
  const lstRad = lst * D;
  const latRad = lat * D;
  const epsRad = eps * D;

  const cosLST = Math.cos(lstRad);
  const sinLST = Math.sin(lstRad);
  const tanLat = Math.tan(latRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);

  const tanAsc = cosLST / (-sinEps * tanLat + cosEps * sinLST);
  let asc = Math.atan(tanAsc) / D;

  // Quadrant correction (เหมือน thaiHora.js)
  if (sinLST < 0)                        asc += 180;
  else if (sinLST > 0 && cosLST < 0)    asc += 360;

  return ascNorm(asc);
}

/**
 * ฟังก์ชันหลัก: คำนวณลัคนาทั้งหมด
 * @param {string} dateStr  - "YYYY-MM-DD" (ค.ศ.)
 * @param {string} timeStr  - "HH:MM"
 * @param {number} lat      - ละติจูด (degrees N)
 * @param {number} lng      - ลองจิจูด (degrees E)
 * @returns {{ rasi, deg, min, sec, tropical, sidereal, ayan, jd, lst, eps }}
 */
function ascCalcLagna(dateStr, timeStr, lat, lng) {
  // แปลงเวลาท้องถิ่น UTC+7 → UTC ด้วย Date object (จัดการ rollover อัตโนมัติ)
  const dt    = new Date(`${dateStr}T${timeStr}:00+07:00`);
  const y     = dt.getUTCFullYear();
  const mo    = dt.getUTCMonth() + 1;
  const d     = dt.getUTCDate();
  const utH   = dt.getUTCHours() + dt.getUTCMinutes() / 60;

  const jd      = ascJD(y, mo, d, utH);
  const gst     = ascGST(jd);
  const lst     = ascNorm(gst + lng);
  const eps     = ascObliquity(jd);
  const ayan    = ascAyanamsha(jd);
  const tropical = ascTropical(lst, lat, eps);

  let sidereal = tropical - ayan;
  sidereal = ascNorm(sidereal);

  const rasi      = Math.floor(sidereal / 30);
  const degInSign = sidereal - rasi * 30;
  const deg       = Math.floor(degInSign);
  const minFrac   = (degInSign - deg) * 60;
  const min       = Math.floor(minFrac);
  const sec       = Math.floor((minFrac - min) * 60);

  return { rasi, deg, min, sec, tropical, sidereal, ayan, jd, lst, eps };
}

// ═══════════════════════════════════════════════════════════════════════
// UI — สร้างหน้าลัคนา
// ═══════════════════════════════════════════════════════════════════════

function showascen() {
  const container = document.getElementById('showascPage');
  if (!container) return;

  const cityOpts = ASC_CITY_LIST
    .map((c, i) => `<option value="${i}"${c.name.includes('กรุงเทพ') ? ' selected' : ''}>${c.name}</option>`)
    .join('');

  container.innerHTML = `
    <div class="container mt-4">
      <div class="card bg-dark border-gold text-white p-4 shadow-lg">

        <h2 class="text-gold mb-1 text-center">
          <i class="fas fa-star-and-crescent mr-2"></i> คำนวณลัคนาพยากรณ์
        </h2>
        <p class="text-center mb-4" style="color:#aaa; font-size:0.82rem;">
          ระบบนิรายัน (Sidereal) · อยันศ์ลาหิริ · โหราศาสตร์ไทย-ฮินดู
        </p>

        <!-- เลือกสมาชิก -->
        <div class="form-group mb-3">
          <label class="text-gold small">เลือกสมาชิกจากประวัติ:</label>
          <select class="form-control bg-black text-gold border-gold member-selector-shared"
            onchange="autoFillMemberData(this.value); setTimeout(calculateAscendant, 300);">
            <option value="">-- เลือกสมาชิก --</option>
          </select>
        </div>

        <!-- ฟอร์มกรอกข้อมูล -->
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="text-gold small">วันเกิด (ค.ศ.)</label>
            <input type="date" id="ascBirthDate"
              class="form-control bg-black text-gold border-gold">
          </div>
          <div class="col-md-4 mb-3">
            <label class="text-gold small">เวลาเกิด (น.)</label>
            <input type="time" id="ascBirthTime"
              class="form-control bg-black text-gold border-gold">
          </div>
          <div class="col-md-4 mb-3">
            <label class="text-gold small">จังหวัดที่เกิด</label>
            <select id="ascCity" class="form-control bg-black text-gold border-gold">
              ${cityOpts}
            </select>
          </div>
        </div>

        <button class="btn btn-gold btn-block mt-2" onclick="calculateAscendant()">
          <i class="fas fa-magic mr-2"></i> คำนวณลัคนา
        </button>

        <!-- ผลลัพธ์ -->
        <div id="ascendantResult" class="mt-4 p-4 rounded"
          style="display:none; background:rgba(212,175,55,0.08); border:1px dashed #d4af37;">

          <!-- หัวข้อลัคนา -->
          <div class="text-center mb-3">
            <div id="ascIcon" style="font-size:3.5rem; line-height:1;"></div>
            <h3 id="ascSign" class="text-gold mt-2 mb-0"></h3>
            <div id="ascDegree" style="font-size:0.95rem; color:#d4af37; opacity:0.85;"></div>
          </div>

          <!-- ข้อมูลลัคนา -->
          <div class="mb-2">
            <span class="text-gold">ดาวเจ้าเรือน:</span>
            <b id="ascruler" class="text-white ml-2"></b>
            <span id="ascElement" class="ml-2"></span>
          </div>
          <div class="mb-2">
            <span class="text-gold">ราศีที่สมพงศ์:</span>
            <b id="asccompatible" class="text-white ml-2"></b>
          </div>
          <div id="ascDesc" class="mb-2" style="font-size:0.95rem;"></div>
          <div id="asccareer" class="mb-1" style="font-size:0.9rem;"></div>
          <div class="mb-1">
            <span class="text-success">จุดเด่น: </span>
            <span id="ascstrengths" style="font-size:0.9rem;"></span>
          </div>
          <div class="mb-1">
            <span class="text-danger">ควรระวัง: </span>
            <span id="ascweaknesses" style="font-size:0.9rem;"></span>
          </div>
          <div class="mb-1">
            <span class="text-info">เรื่องรัก: </span>
            <span id="ascLove" style="font-size:0.9rem;"></span>
          </div>
          <div class="mb-3">
            <span class="text-warning">สุขภาพ: </span>
            <span id="ascHealth" style="font-size:0.9rem;"></span>
          </div>

          <hr style="border-top:1px solid rgba(212,175,55,0.3);">

          <!-- ตาราง 12 ภพเรือน -->
          <h5 class="text-gold mb-3">
            <i class="fas fa-th-large mr-2"></i> พื้นฐานดวงชะตา 12 ภพเรือน
          </h5>
          <div class="table-responsive">
            <table class="table table-sm table-bordered text-white border-gold mb-3"
              style="background:rgba(0,0,0,0.3); font-size:0.82rem;">
              <thead class="text-gold">
                <tr>
                  <th>ภพ</th><th>ราศีสถิต</th><th>จุดเด่น</th><th>ควรระวัง</th>
                </tr>
              </thead>
              <tbody id="houseTableBody"></tbody>
            </table>
          </div>

          <!-- ข้อมูลดาราศาสตร์ (สำหรับผู้สนใจ) -->
          <div id="ascAstroInfo"
            style="font-size:0.78rem; color:#888; background:rgba(0,0,0,0.25); border-radius:6px; padding:8px 12px;">
          </div>

          <!-- ปุ่มบันทึกภาพ -->
          <div class="text-center mt-4">
            <button class="btn btn-outline-gold px-5 py-2" onclick="saveAscendantImg()">
              <i class="fas fa-camera mr-2"></i> บันทึกภาพดวงชะตา
            </button>
          </div>
        </div><!-- /ascendantResult -->

        <!-- ปุ่มนำทาง -->
        <div class="row mt-4">
          <div class="col-6">
            <button class="btn btn-outline-secondary btn-block border-0"
              onclick="navigateTo('mainpage')">
              <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-outline-secondary btn-block border-0"
              onclick="goBack()">
              <i class="fas fa-home"></i> กลับหน้าหลัก
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => { showascen(); });

// ═══════════════════════════════════════════════════════════════════════
// ฟังก์ชันคำนวณ (เรียกจากปุ่ม)
// ═══════════════════════════════════════════════════════════════════════

function calculateAscendant() {
  const dateEl = document.getElementById('ascBirthDate');
  const timeEl = document.getElementById('ascBirthTime');
  const cityEl = document.getElementById('ascCity');

  if (!dateEl?.value || !timeEl?.value) {
    Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเกิดและเวลาเกิดให้ครบถ้วนครับ', 'warning');
    return;
  }

  const cityIdx = parseInt(cityEl?.value ?? '0') || 0;
  const city    = ASC_CITY_LIST[cityIdx] || ASC_CITY_LIST[0];

  const result = ascCalcLagna(dateEl.value, timeEl.value, city.lat, city.lng);
  generateHouseTable(result.rasi);
  displayAscendantResult(ZODIAC_DATA[result.rasi], result, city);
}

// ═══════════════════════════════════════════════════════════════════════
// สร้างตาราง 12 ภพเรือน
// ═══════════════════════════════════════════════════════════════════════

function generateHouseTable(startZodiacIndex) {
  const tableBody = document.getElementById('houseTableBody');
  if (!tableBody) return;

  const houseNames = [
    "ตนุ (ตัวตน)",
    "กดุมพะ (การเงิน)",
    "สหัชชะ (สังคม)",
    "พันธุ (ครอบครัว)",
    "ปุตตะ (บุตร/บริวาร)",
    "อริ (อุปสรรค)",
    "ปัตนิ (คู่ครอง)",
    "มรณะ (ความสูญเสีย)",
    "ศุภะ (ความสุข/ศาสนา)",
    "กัมมะ (การงาน)",
    "ลาภะ (โชคลาภ)",
    "วินาศ (ความลับ/เบื้องหลัง)"
  ];

  let html = '';
  for (let i = 0; i < 12; i++) {
    const idx    = (startZodiacIndex + i) % 12;
    const zodiac = ZODIAC_DATA[idx];
    html += `
      <tr>
        <td class="text-gold" style="white-space:nowrap;">${i + 1}. ${houseNames[i]}</td>
        <td style="white-space:nowrap;">${zodiac.icon} ราศี${zodiac.name}</td>
        <td><span class="text-success">${zodiac.strengths.join(', ')}</span></td>
        <td><span class="text-danger">${zodiac.weaknesses.join(', ')}</span></td>
      </tr>`;
  }
  tableBody.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════════
// แสดงผลลัพธ์ลัคนา
// ═══════════════════════════════════════════════════════════════════════

function displayAscendantResult(data, result, city) {
  const resDiv = document.getElementById('ascendantResult');
  if (!resDiv) return;

  const color = ASC_ELEMENT_COLORS[data.element] || '#ffffff';

  // องศา นาที วินาทีในราศี
  const degStr = `${result.deg}° ${result.min}' ${result.sec}" ในราศี${data.name}`;

  // อยันศ์
  const ayanDeg = Math.floor(result.ayan);
  const ayanMin = Math.floor((result.ayan - ayanDeg) * 60);

  document.getElementById('ascSign').innerText     = `ลัคนาราศี${data.name} ${data.icon}`;
  document.getElementById('ascIcon').innerText     = data.icon;
  document.getElementById('ascDegree').innerHTML   =
    `<b>${degStr}</b> &nbsp;|&nbsp; สายันที่ ${result.tropical.toFixed(2)}°`;
  document.getElementById('ascDesc').innerText     = data.desc;
  document.getElementById('asccareer').innerText   = `อาชีพที่เหมาะสม: ${data.career}`;
  document.getElementById('ascstrengths').innerText = data.strengths.join(', ');
  document.getElementById('ascweaknesses').innerText = data.weaknesses.join(', ');
  document.getElementById('ascLove').innerText     = data.love;
  document.getElementById('ascHealth').innerText   = data.health;
  document.getElementById('ascruler').innerText    = data.ruler;
  document.getElementById('asccompatible').innerText = data.compatible.join(', ');
  document.getElementById('ascElement').innerHTML  =
    `<span style="color:${color};">(${data.element})</span>`;

  // ข้อมูลดาราศาสตร์
  document.getElementById('ascAstroInfo').innerHTML = `
    📍 สถานที่เกิด: <b>${city.name}</b>
    (ละติจูด ${city.lat.toFixed(4)}°N, ลองจิจูด ${city.lng.toFixed(4)}°E)
    &nbsp;|&nbsp; JD: ${result.jd.toFixed(5)}
    &nbsp;|&nbsp; LST: ${result.lst.toFixed(3)}°
    &nbsp;|&nbsp; ε: ${result.eps.toFixed(4)}°
    &nbsp;|&nbsp; อยันศ์ลาหิริ: ${ayanDeg}°${ayanMin}'
    &nbsp;|&nbsp; ลัคนาสายัน: ${result.tropical.toFixed(3)}°
    &nbsp;|&nbsp; ลัคนานิรายัน: ${result.sidereal.toFixed(3)}°
  `;

  resDiv.style.display = 'block';
  resDiv.classList.add('animate__animated', 'animate__fadeIn');
  resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ═══════════════════════════════════════════════════════════════════════
// บันทึกภาพ
// ═══════════════════════════════════════════════════════════════════════

async function saveAscendantImg() {
  const captureArea = document.getElementById('ascendantResult');
  if (!captureArea || captureArea.style.display === 'none') {
    Swal.fire('แจ้งเตือน', 'กรุณาคำนวณลัคนาก่อนบันทึกภาพครับ', 'warning');
    return;
  }
  
  Swal.fire({
      title: 'กำลังสร้างรูปภาพ...',
      text: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
  });

  try {
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1350;
    
    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.setLineDash([]);
    
    // Header
    const icon = document.getElementById('ascIcon')?.innerText || '✨';
    const sign = document.getElementById('ascSign')?.innerText || 'ลัคนา';
    const degree = document.getElementById('ascDegree')?.innerText || '';
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 120px "Sarabun", sans-serif';
    ctx.fillText(icon, canvas.width / 2, 120);
    
    ctx.font = 'bold 65px "Sarabun", sans-serif';
    ctx.fillText(sign, canvas.width / 2, 260);
    
    ctx.font = '35px "Sarabun", sans-serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.fillText(degree, canvas.width / 2, 340);
    
    // Content box
    ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.fillRect(80, 420, canvas.width - 160, 720);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 420, canvas.width - 160, 720);
    
    // Detail texts
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let y = 480;
    const drawLine = (label, text, color) => {
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText(label, 120, y);
        const w = ctx.measureText(label).width;
        ctx.font = '36px "Sarabun", sans-serif';
        ctx.fillStyle = color || '#ffffff';
        ctx.fillText(text, 120 + w + 15, y);
        y += 65;
    };
    
    const ruler = document.getElementById('ascruler')?.innerText || '';
    drawLine('ดาวเจ้าเรือน:', ruler, '#ffffff');
    
    const compatible = document.getElementById('asccompatible')?.innerText || '';
    drawLine('ราศีที่สมพงศ์:', compatible, '#ffffff');
    
    y += 15;
    const desc = document.getElementById('ascDesc')?.innerText || '';
    ctx.font = '32px "Sarabun", sans-serif';
    ctx.fillStyle = '#cccccc';
    
    // wrap logic
    let lines = [];
    if (window.Intl && window.Intl.Segmenter) {
        const seg = new Intl.Segmenter('th', { granularity: 'word' });
        const segments = seg.segment(desc);
        let curr = "";
        for (const {segment} of segments) {
            if (ctx.measureText(curr + segment).width > 800 && curr.trim() !== "") {
                lines.push(curr); curr = segment;
            } else curr += segment;
        }
        lines.push(curr);
    } else {
        lines.push(desc.substring(0, 50) + "...");
    }
    for(let l of lines) {
        ctx.fillText(l, 120, y);
        y += 50;
    }
    
    y += 20;
    const career = document.getElementById('asccareer')?.innerText || '';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(career, 120, y); y += 65;
    
    const strengths = document.getElementById('ascstrengths')?.innerText || '';
    drawLine('จุดเด่น:', strengths, '#4caf50');
    
    const weaknesses = document.getElementById('ascweaknesses')?.innerText || '';
    drawLine('ควรระวัง:', weaknesses, '#f44336');
    
    const love = document.getElementById('ascLove')?.innerText || '';
    drawLine('เรื่องรัก:', love, '#00bcd4');
    
    const health = document.getElementById('ascHealth')?.innerText || '';
    drawLine('สุขภาพ:', health, '#ff9800');
    
    // Footer watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '28px "Sarabun", sans-serif';
    ctx.fillText('สยามโหรามงคล - โปรแกรมคำนวณลัคนาพยากรณ์', canvas.width / 2, canvas.height - 100);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const zodiacName = sign.replace('ลัคนาราศี', '') || '';
    link.download = `ลัคนา_ราศี${zodiacName}.png`;
    link.click();
    
    Swal.close();
  } catch (e) {
    console.error('Capture Error:', e);
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้ โปรดลองอีกครั้ง', 'error');
  }
}

// ─── Event listener ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('btnCalculateAsc');
  if (calcBtn) calcBtn.addEventListener('click', calculateAscendant);
});