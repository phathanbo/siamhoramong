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
// UI — สร้างหน้าลัคนา (Modern Porsche Digital Cockpit Theme)
// ═══════════════════════════════════════════════════════════════════════

function showascen() {
  const container = document.getElementById('showascPage');
  if (!container) return;

  const cityOpts = ASC_CITY_LIST
    .map((c, i) => `<option value="${i}"${c.name.includes('กรุงเทพ') ? ' selected' : ''}>${c.name}</option>`)
    .join('');

  container.innerHTML = `
    <style>
      /* ─── Porsche Cockpit Luxury Theme (High Contrast Edition) ─── */
      .asc-cockpit-wrapper {
        font-family: 'Sarabun', 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at 50% -10%, #2b2552 0%, #151327 50%, #0c0b16 100%);
        border-radius: 28px;
        padding: 20px;
        color: #1e1e2d;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75), 0 0 0 2px rgba(168, 85, 247, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
      }
      
      .asc-cockpit-frame {
        background: linear-gradient(145deg, #f4f6fc 0%, #e9ecf8 40%, #dfe3f3 100%);
        border-radius: 24px;
        padding: 24px;
        box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.9), 0 12px 35px rgba(0, 0, 0, 0.35);
        border: 2px solid #ffffff;
        position: relative;
      }

      /* Top Status Bar */
      .asc-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(124, 58, 237, 0.2);
        margin-bottom: 22px;
      }
      .asc-brand-title {
        font-family: 'Cinzel', 'Chonburi', 'Sarabun', serif;
        font-size: 1.4rem;
        font-weight: 800;
        letter-spacing: 2.5px;
        background: linear-gradient(135deg, #4c1d95 0%, #6d28d9 40%, #9333ea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
        margin: 0;
        filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.15));
      }
      .asc-badge-telemetry {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        color: #4c1d95;
        background: #ede9fe;
        padding: 5px 14px;
        border-radius: 20px;
        border: 1.5px solid rgba(139, 92, 246, 0.4);
        box-shadow: 0 2px 6px rgba(139, 92, 246, 0.12);
      }

      /* Controls Console */
      .asc-control-panel {
        background: #ffffff;
        border-radius: 20px;
        padding: 20px 22px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
        border: 1.5px solid rgba(139, 92, 246, 0.25);
        margin-bottom: 24px;
      }
      .asc-input-label {
        font-size: 0.84rem;
        font-weight: 800;
        color: #4c1d95;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .asc-control-input {
        background: #f8fafc !important;
        border: 1.5px solid #cbd5e1 !important;
        color: #0f172a !important;
        border-radius: 12px !important;
        padding: 9px 14px !important;
        font-weight: 700 !important;
        font-size: 0.92rem !important;
        transition: all 0.25s ease !important;
      }
      .asc-control-input:focus {
        border-color: #7c3aed !important;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25) !important;
        background: #ffffff !important;
      }

      /* Cockpit Button */
      .btn-asc-porsche {
        background: linear-gradient(135deg, #581c87 0%, #6d28d9 45%, #9333ea 100%);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 30px;
        padding: 12px 28px;
        font-weight: 800;
        font-size: 1.02rem;
        letter-spacing: 0.5px;
        box-shadow: 0 8px 22px rgba(109, 40, 217, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      .btn-asc-porsche:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(109, 40, 217, 0.55);
        color: #ffffff;
      }
      .btn-asc-porsche:active {
        transform: translateY(1px);
      }

      /* Gauge Cluster & Telemetry */
      .asc-gauge-box {
        background: radial-gradient(circle at center, #ffffff 0%, #f1f3fa 70%, #e2e7f6 100%);
        border-radius: 50%;
        width: 250px;
        height: 250px;
        margin: 0 auto;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 18px 40px rgba(109, 40, 217, 0.2),
                    inset 0 0 0 8px #ffffff,
                    inset 0 0 0 12px rgba(124, 58, 237, 0.25),
                    0 0 0 4px rgba(124, 58, 237, 0.4);
        border: 4px solid #ffffff;
      }
      .asc-gauge-ring {
        position: absolute;
        top: -6px; left: -6px; right: -6px; bottom: -6px;
        border-radius: 50%;
        border: 2px dashed rgba(124, 58, 237, 0.5);
        animation: spinSlow 40s linear infinite;
        pointer-events: none;
      }
      @keyframes spinSlow {
        100% { transform: rotate(360deg); }
      }

      .asc-card-panel {
        background: #ffffff;
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
        border: 1.5px solid rgba(139, 92, 246, 0.22);
        height: 100%;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .asc-card-panel:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 35px rgba(124, 58, 237, 0.16);
        border-color: rgba(139, 92, 246, 0.45);
      }
      
      .asc-telemetry-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1.5px solid #f1f5f9;
        font-size: 0.92rem;
      }
      .asc-telemetry-row:last-child {
        border-bottom: none;
      }
      .asc-telemetry-label {
        color: #475569;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .asc-telemetry-val {
        color: #0f172a;
        font-weight: 800;
      }

      /* 12 House Grid Cards */
      .asc-house-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 14px 16px;
        border: 1.5px solid #e2e8f0;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }
      .asc-house-card:hover {
        border-color: #7c3aed;
        box-shadow: 0 8px 24px rgba(124, 58, 237, 0.16);
        transform: translateY(-3px);
      }

      .asc-mode-tag {
        background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
        color: #ffffff;
        font-weight: 800;
        font-size: 0.74rem;
        letter-spacing: 1.2px;
        padding: 4px 14px;
        border-radius: 14px;
        text-transform: uppercase;
        display: inline-block;
        box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
      }
    </style>

    <div class="container-fluid py-4" style="max-width: 1200px; margin: 0 auto;">
      <div class="asc-cockpit-wrapper">
        <div class="asc-cockpit-frame">

          <!-- TOP BAR: PORSCHE / COCKPIT HEADER -->
          <div class="asc-topbar">
            <div class="d-flex align-items-center gap-2">
              <span class="asc-badge-telemetry">
                <i class="fas fa-satellite-dish"></i> SIDEREAL LAHIRI
              </span>
              <span class="asc-badge-telemetry d-none d-sm-inline-flex">
                <i class="fas fa-clock"></i> UTC+07:00
              </span>
            </div>
            
            <h2 class="asc-brand-title text-center">
              <i class="fas fa-compass me-1"></i> SIAMPORIS HOROSCOPE
            </h2>

            <div>
              <span class="asc-mode-tag">SPORT PLUS</span>
            </div>
          </div>

          <!-- SUBHEADER & MEMBER SELECT -->
          <div class="asc-control-panel">
            <div class="row align-items-end g-3">
              <div class="col-lg-3 col-md-6">
                <label class="asc-input-label">
                  <i class="fas fa-user-circle text-purple"></i> ดึงจากประวัติสมาชิก:
                </label>
                <select class="form-select asc-control-input member-selector-shared"
                  onchange="autoFillMemberData(this.value); setTimeout(calculateAscendant, 300);">
                  <option value="">-- เลือกสมาชิกจากประวัติ --</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-6">
                <label class="asc-input-label">
                  <i class="fas fa-calendar-alt text-purple"></i> วันเกิด (ค.ศ.):
                </label>
                <input type="date" id="ascBirthDate" class="form-control asc-control-input">
              </div>
              <div class="col-lg-2 col-md-6">
                <label class="asc-input-label">
                  <i class="fas fa-clock text-purple"></i> เวลาเกิด (น.):
                </label>
                <input type="time" id="ascBirthTime" class="form-control asc-control-input">
              </div>
              <div class="col-lg-2 col-md-6">
                <label class="asc-input-label">
                  <i class="fas fa-map-marker-alt text-purple"></i> จังหวัดที่เกิด:
                </label>
                <select id="ascCity" class="form-select asc-control-input">
                  ${cityOpts}
                </select>
              </div>
              <div class="col-lg-2 col-12 text-center">
                <button type="button" class="btn btn-asc-porsche w-100 d-flex align-items-center justify-content-center gap-2" onclick="calculateAscendant()">
                  <i class="fas fa-bolt"></i> คำนวณลัคนา
                </button>
              </div>
            </div>
          </div>

          <!-- RESULT COCKPIT DASHBOARD -->
          <div id="ascendantResult" style="display: none;">
            
            <!-- 3-COLUMN COCKPIT GAUGES & TELEMETRY -->
            <div class="row g-3 mb-4">
              
              <!-- LEFT PANEL: VEHICLE & ORBIT STATUS -->
              <div class="col-lg-4 col-md-6">
                <div class="asc-card-panel">
                  <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <span class="fw-bold text-uppercase" style="color: #6b21a8; font-size: 0.88rem; letter-spacing: 1px;">
                      <i class="fas fa-atom me-1"></i> ธาตุและเกษตรประจำลัคนา
                    </span>
                    <span class="badge bg-purple-subtle text-purple rounded-pill px-2 py-1" style="font-size: 0.72rem; background: rgba(147, 51, 234, 0.1); color: #7e22ce;">
                      SYSTEM ACTIVE
                    </span>
                  </div>

                  <div class="asc-telemetry-row">
                    <span class="asc-telemetry-label"><i class="fas fa-globe-asia text-primary"></i> ดาวเจ้าเรือนเกษตร</span>
                    <span id="ascruler" class="asc-telemetry-val text-primary fs-6">-</span>
                  </div>
                  <div class="asc-telemetry-row">
                    <span class="asc-telemetry-label"><i class="fas fa-fire-alt text-danger"></i> ธาตุประจำราศี</span>
                    <span id="ascElement" class="asc-telemetry-val">-</span>
                  </div>
                  <div class="asc-telemetry-row">
                    <span class="asc-telemetry-label"><i class="fas fa-handshake text-success"></i> ราศีที่สมพงศ์</span>
                    <span id="asccompatible" class="asc-telemetry-val text-success">-</span>
                  </div>
                  <div class="asc-telemetry-row">
                    <span class="asc-telemetry-label"><i class="fas fa-palette text-warning"></i> สีมงคลเสริมโชค</span>
                    <span id="ascLuckyColor" class="asc-telemetry-val text-dark">-</span>
                  </div>
                  <div class="asc-telemetry-row">
                    <span class="asc-telemetry-label"><i class="fas fa-dice text-info"></i> เลขให้คุณเด่น</span>
                    <span id="ascLuckyNumber" class="asc-telemetry-val text-purple">-</span>
                  </div>

                  <div class="mt-3 p-2 rounded-3" style="background: rgba(139, 92, 246, 0.06); border: 1px dashed rgba(139, 92, 246, 0.25);">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <i class="fas fa-briefcase text-purple" style="font-size: 0.85rem;"></i>
                      <span class="fw-bold text-dark" style="font-size: 0.82rem;">เส้นทางอาชีพและวาสนา:</span>
                    </div>
                    <div id="asccareer" class="text-muted" style="font-size: 0.82rem; line-height: 1.4;">-</div>
                  </div>
                </div>
              </div>

              <!-- CENTER PANEL: PORSCHE MAIN TACHOMETER GAUGE -->
              <div class="col-lg-4 col-md-12 order-first order-lg-0">
                <div class="asc-card-panel text-center position-relative d-flex flex-column justify-content-between">
                  <div class="asc-gauge-box my-2">
                    <div class="asc-gauge-ring"></div>
                    <div id="ascIcon" style="font-size: 2.8rem; line-height: 1; filter: drop-shadow(0 4px 10px rgba(124,58,237,0.3));">✨</div>
                    <div id="ascSign" class="fw-bold mt-1" style="font-size: 1.55rem; color: #4c1d95; letter-spacing: 0.5px;">-</div>
                    <div id="ascDegree" style="font-size: 0.82rem; font-weight: 700; color: #7c3aed;">-</div>
                    <div class="mt-1">
                      <span class="asc-mode-tag">ASCENDANT</span>
                    </div>
                  </div>

                  <!-- Central Character Overview HUD -->
                  <div class="p-3 rounded-4 mt-2" style="background: linear-gradient(135deg, rgba(245, 243, 255, 0.8) 0%, rgba(237, 233, 254, 0.6) 100%); border: 1px solid rgba(139, 92, 246, 0.2);">
                    <div class="fw-bold text-purple mb-1" style="font-size: 0.85rem;">
                      <i class="fas fa-quote-left me-1"></i> บุคลิกลักษณะและชะตากำเนิด
                    </div>
                    <div id="ascDesc" style="font-size: 0.86rem; color: #334155; line-height: 1.5;">-</div>
                  </div>
                </div>
              </div>

              <!-- RIGHT PANEL: LIFE METRICS & DIAGNOSTICS -->
              <div class="col-lg-4 col-md-6">
                <div class="asc-card-panel">
                  <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <span class="fw-bold text-uppercase" style="color: #6b21a8; font-size: 0.88rem; letter-spacing: 1px;">
                      <i class="fas fa-chart-line me-1"></i> เกณฑ์ชะตาและการเฝ้าระวัง
                    </span>
                    <span class="badge bg-success-subtle text-success rounded-pill px-2 py-1" style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.1); color: #047857;">
                      OPTIMIZED
                    </span>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-success fw-bold" style="font-size: 0.85rem;"><i class="fas fa-check-circle me-1"></i> จุดเด่นและพลังวาสนา:</span>
                    </div>
                    <div id="ascstrengths" class="p-2 rounded-3 text-dark fw-semibold" style="background: rgba(16, 185, 129, 0.08); font-size: 0.84rem; border-left: 3px solid #10b981;">-</div>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-danger fw-bold" style="font-size: 0.85rem;"><i class="fas fa-exclamation-triangle me-1"></i> จุดควรระวัง/สิ่งบั่นทอน:</span>
                    </div>
                    <div id="ascweaknesses" class="p-2 rounded-3 text-dark fw-semibold" style="background: rgba(239, 68, 68, 0.08); font-size: 0.84rem; border-left: 3px solid #ef4444;">-</div>
                  </div>

                  <div class="mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-info fw-bold" style="font-size: 0.85rem;"><i class="fas fa-heart me-1"></i> เกณฑ์ความรัก/คู่ครอง:</span>
                    </div>
                    <div id="ascLove" class="p-2 rounded-3 text-dark" style="background: rgba(6, 182, 212, 0.08); font-size: 0.83rem; border-left: 3px solid #06b6d4;">-</div>
                  </div>

                  <div>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-warning fw-bold" style="font-size: 0.85rem;"><i class="fas fa-medkit me-1"></i> สุขภาพที่ต้องดูแล:</span>
                    </div>
                    <div id="ascHealth" class="p-2 rounded-3 text-dark" style="background: rgba(245, 158, 11, 0.08); font-size: 0.83rem; border-left: 3px solid #f59e0b;">-</div>
                  </div>
                </div>
              </div>

            </div>

            <!-- 12 HOUSES COCKPIT GRID -->
            <div class="asc-card-panel mb-4">
              <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h5 class="fw-bold mb-0" style="color: #4c1d95; font-size: 1.05rem;">
                  <i class="fas fa-th-large me-2 text-purple"></i> พื้นฐานดวงชะตา 12 ภพเรือน (Cockpit Grid System)
                </h5>
                <span class="badge rounded-pill px-3 py-1" style="background: rgba(139, 92, 246, 0.12); color: #6d28d9; font-weight: 700; font-size: 0.75rem;">
                  12 BHAVAS ALIGNED
                </span>
              </div>

              <div id="houseGridContainer" class="row g-2 g-md-3"></div>
            </div>

            <!-- ASTRONOMICAL HUD FOOTER -->
            <div id="ascAstroInfo" class="p-3 rounded-4 mb-4" style="font-size: 0.8rem; background: #ffffff; border: 1px solid rgba(139,92,246,0.18); color: #64748b; line-height: 1.6; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            </div>

            <!-- EXPORT ACTION BUTTON -->
            <div class="text-center mt-3">
              <button type="button" class="btn btn-asc-porsche px-5 py-3 shadow-lg" onclick="saveAscendantImg()">
                <i class="fas fa-camera me-2"></i> บันทึกภาพแผ่นดวงชะตาลัคนา (Digital Hi-Res)
              </button>
            </div>

          </div><!-- /ascendantResult -->

          <!-- NAVIGATION BAR -->
          <div class="row g-2 mt-4 pt-3 border-top" style="border-color: rgba(139, 92, 246, 0.15) !important;">
            <div class="col-6">
              <button class="btn btn-outline-dark w-100 py-2 rounded-pill fw-semibold" style="border-color: #cbd5e1; background: #ffffff;" onclick="navigateTo('mainpage')">
                <i class="fas fa-chevron-left me-1"></i> กลับห้องพยากรณ์
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-outline-dark w-100 py-2 rounded-pill fw-semibold" style="border-color: #cbd5e1; background: #ffffff;" onclick="goBack()">
                <i class="fas fa-home me-1"></i> กลับหน้าหลัก
              </button>
            </div>
          </div>

        </div><!-- /asc-cockpit-frame -->
      </div><!-- /asc-cockpit-wrapper -->
    </div>
  `;

  // ตรวจสอบข้อมูลสมาชิกที่ส่งมาจากหน้าโปรไฟล์เพื่อคำนวณอัตโนมัติ
  setTimeout(() => {
    try {
      const autoDataRaw = localStorage.getItem('siamhora_auto_calc_ascendant');
      if (autoDataRaw) {
        localStorage.removeItem('siamhora_auto_calc_ascendant');
        const mem = JSON.parse(autoDataRaw);
        if (mem) {
          let bDateStr = "";
          if (mem.birthdate) {
            if (mem.birthdate.includes('/')) {
              const p = mem.birthdate.split('/');
              if (p.length === 3) {
                let y = parseInt(p[2], 10);
                if (y > 2400) y -= 543;
                bDateStr = `${y}-${String(p[1]).padStart(2,'0')}-${String(p[0]).padStart(2,'0')}`;
              }
            } else if (mem.birthdate.includes('-')) {
              const p = mem.birthdate.split('-');
              if (p.length === 3) {
                let y = parseInt(p[0], 10);
                if (y > 2400) y -= 543;
                bDateStr = `${y}-${String(p[1]).padStart(2,'0')}-${String(p[2]).padStart(2,'0')}`;
              }
            }
          }
          const dateEl = document.getElementById('ascBirthDate');
          if (dateEl && bDateStr) dateEl.value = bDateStr;

          const timeEl = document.getElementById('ascBirthTime');
          if (timeEl && mem.birthtime) timeEl.value = mem.birthtime.substring(0, 5);

          const cityEl = document.getElementById('ascCity');
          if (cityEl && mem.province && typeof ASC_CITY_LIST !== 'undefined') {
            const cIdx = ASC_CITY_LIST.findIndex(c => c.name.includes(mem.province));
            if (cIdx !== -1) cityEl.value = String(cIdx);
          }

          if (typeof calculateAscendant === 'function') {
            setTimeout(calculateAscendant, 200);
          }
        }
      }
    } catch (e) {
      console.error("Auto calc ascendant error:", e);
    }
  }, 100);
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
  generateHouseGrid(result.rasi);
  displayAscendantResult(ZODIAC_DATA[result.rasi], result, city);
}

// ═══════════════════════════════════════════════════════════════════════
// สร้างการ์ดแสดง 12 ภพเรือน (Cockpit Grid — Enhanced Edition)
// ═══════════════════════════════════════════════════════════════════════

function generateHouseGrid(startZodiacIndex) {
  const gridContainer = document.getElementById('houseGridContainer');
  if (!gridContainer) return;

  const houseDataList = [
    {
      num: 1,
      title: "ตนุ",
      sub: "ตัวตน / ชะตาชีวิต",
      icon: "fa-user-astronaut",
      desc: "บ่งบอกถึงรูปร่าง บุคลิกภาพ ความคิด สติปัญญา และภาพรวมวาสนากำเนิด",
      aspect: "พลังขับเคลื่อนและอัตลักษณ์บุคคล"
    },
    {
      num: 2,
      title: "กดุมพะ",
      sub: "ทรัพย์สิน / การเงิน",
      icon: "fa-coins",
      desc: "การหาเงิน รายได้ แหล่งทรัพย์สิน ความมั่งคั่ง และพฤติกรรมการใช้จ่าย",
      aspect: "สภาพคล่องและการสะสมทรัพย์"
    },
    {
      num: 3,
      title: "สหัชชะ",
      sub: "สังคม / มิตรสหาย",
      icon: "fa-users",
      desc: "พี่น้อง เพื่อนฝูง สังคมแวดล้อม การเดินทางระยะใกล้ และการติดต่อสื่อสาร",
      aspect: "เครือข่ายและการเจรจาต่อรอง"
    },
    {
      num: 4,
      title: "พันธุ",
      sub: "ครอบครัว / รากฐาน",
      icon: "fa-home",
      desc: "พ่อแม่ บ้าน ที่อยู่อาศัย ยานพาหนะ ที่ดิน และความมั่นคงในวัยต้น",
      aspect: "ความอบอุ่นและหลักปักฐาน"
    },
    {
      num: 5,
      title: "ปุตตะ",
      sub: "บริวาร / การริเริ่ม",
      icon: "fa-seedling",
      desc: "บุตร บริวาร ความคิดสร้างสรรค์ การลงทุนใหม่ๆ และเรื่องเสี่ยงโชค",
      aspect: "โปรเจกต์ใหม่และผู้ใต้บังคับบัญชา"
    },
    {
      num: 6,
      title: "อริ",
      sub: "อุปสรรค / การแก้ปัญหา",
      icon: "fa-shield-virus",
      desc: "ศัตรู ปัญหา หนี้สิน โรคภัย และความสามารถในการฝ่าฟันวิกฤต",
      aspect: "ภูมิคุ้มกันและการเอาชนะขวากหนาม"
    },
    {
      num: 7,
      title: "ปัตนิ",
      sub: "คู่ครอง / หุ้นส่วน",
      icon: "fa-heart",
      desc: "คู่ชีวิต หุ้นส่วนธุรกิจ สัญญาร่วมทุน และบุคคลที่มีผลประโยชน์ร่วม",
      aspect: "ชีวิตคู่และการร่วมงานระยะยาว"
    },
    {
      num: 8,
      title: "มรณะ",
      sub: "การสูญเสีย / มรดก",
      icon: "fa-hourglass-end",
      desc: "ความเปลี่ยนแปลงครั้งใหญ่ มรดก การเดินทางไกลต่างแดน และสิ่งที่ซ่อนเร้น",
      aspect: "การสิ้นสุดเพื่อเริ่มต้นสิ่งใหม่"
    },
    {
      num: 9,
      title: "ศุภะ",
      sub: "คุณธรรม / ความก้าวหน้า",
      icon: "fa-feather",
      desc: "ความสำเร็จชั้นสูง ปัญญา ศาสนา ผู้ใหญ่สนับสนุน และการเรียนรู้ระดับสูง",
      aspect: "วาสนาบารมีและความเจริญรุ่งเรือง"
    },
    {
      num: 10,
      title: "กัมมะ",
      sub: "การงาน / ยศตำแหน่ง",
      icon: "fa-briefcase",
      desc: "หน้าที่การงาน อาชีพหลัก ภาระรับผิดชอบ และเกียรติยศชื่อเสียงในสังคม",
      aspect: "ความสำเร็จในสายอาชีพและหน้าที่"
    },
    {
      num: 11,
      title: "ลาภะ",
      sub: "โชคลาภ / ผลสำเร็จ",
      icon: "fa-trophy",
      desc: "ลาภลอย โอกาสทอง ความสมหวัง และผลกำไรที่ได้รับจากผลงาน",
      aspect: "เงินก้อนใหญ่และความสำเร็จเป้าหมาย"
    },
    {
      num: 12,
      title: "วินาศ",
      sub: "เบื้องหลัง / ความลับ",
      icon: "fa-mask",
      desc: "การอยู่เบื้องหลัง เรื่องที่ไม่เปิดเผย สิ่งลี้ลับ และการเดินทางไกลต่างถิ่น",
      aspect: "งานเบื้องหลังและการปลีกวิเวก"
    }
  ];

  let html = '';
  for (let i = 0; i < 12; i++) {
    const idx    = (startZodiacIndex + i) % 12;
    const zodiac = ZODIAC_DATA[idx];
    const house  = houseDataList[i];
    const elemColor = ASC_ELEMENT_COLORS[zodiac.element] || '#7c3aed';
    
    html += `
      <div class="col-xl-4 col-lg-6 col-12">
        <div class="asc-house-card h-100 d-flex flex-column justify-content-between" style="border-top: 5px solid ${elemColor}; background: #ffffff; box-shadow: 0 6px 20px rgba(15,23,42,0.06);">
          <div>
            <!-- Header ภพเรือน -->
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div class="d-flex align-items-center gap-2">
                <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#ede9fe; color:#6d28d9; font-weight:800; font-size:0.85rem;">
                  ${house.num}
                </span>
                <span class="fw-bold" style="font-size: 0.95rem; color: #3b0764;">
                  <i class="fas ${house.icon} me-1" style="color: #7c3aed;"></i> ภพ${house.title}
                </span>
              </div>
              <span class="badge rounded-pill px-2 py-1" style="background: #ede9fe; color: #5b21b6; font-size: 0.72rem; font-weight: 700; border: 1px solid rgba(124, 58, 237, 0.25);">
                ${house.sub}
              </span>
            </div>

            <!-- ความหมายหลักของภพ -->
            <div class="p-2 rounded-2 mb-2" style="background: #faf5ff; border: 1px dashed rgba(168, 85, 247, 0.3); font-size: 0.8rem; color: #581c87; line-height: 1.4;">
              <b><i class="fas fa-info-circle me-1"></i>อิทธิพลภพ:</b> ${house.desc}
            </div>
            
            <!-- ราศีสถิต & ดาวเกษตร -->
            <div class="d-flex align-items-center justify-content-between mb-2 p-2 rounded-3" style="background: #f1f5f9; border: 1.5px solid #e2e8f0;">
              <div class="d-flex align-items-center gap-2">
                <span style="font-size: 1.35rem; line-height:1;">${zodiac.icon}</span>
                <div>
                  <span class="fw-bold text-dark" style="font-size: 0.88rem;">สถิตราศี${zodiac.name}</span>
                  <div class="text-muted" style="font-size: 0.74rem;">ดาวเกษตร: <b style="color:#6d28d9;">${zodiac.ruler}</b></div>
                </div>
              </div>
              <span class="badge" style="background: ${elemColor}15; color: ${elemColor}; border: 1px solid ${elemColor}40; font-weight: 800; font-size: 0.76rem;">
                ${zodiac.element}
              </span>
            </div>

            <!-- จุดเด่น & จุดระวัง -->
            <div class="mb-2">
              <div class="small mb-1 text-dark" style="font-size: 0.82rem; line-height: 1.4;">
                <span class="text-success fw-bold"><i class="fas fa-check-circle me-1"></i>ส่งผลดี:</span> ${zodiac.strengths.join(', ')}
              </div>
              <div class="small text-dark" style="font-size: 0.82rem; line-height: 1.4;">
                <span class="text-danger fw-bold"><i class="fas fa-exclamation-circle me-1"></i>ข้อควรระวัง:</span> ${zodiac.weaknesses.join(', ')}
              </div>
            </div>
          </div>

          <!-- ท้ายการ์ด: คำแนะนำ/ด้านที่ส่งเสริม -->
          <div class="pt-2 mt-2 border-top d-flex justify-content-between align-items-center" style="font-size: 0.76rem; color: #64748b;">
            <span><i class="fas fa-compass text-purple me-1"></i><b>จุดเน้น:</b> ${house.aspect}</span>
            <span class="text-purple fw-bold">สมพงศ์: ${zodiac.compatible.slice(0, 2).join('/')}</span>
          </div>

        </div>
      </div>`;
  }
  gridContainer.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════════
// แสดงผลลัพธ์ลัคนา
// ═══════════════════════════════════════════════════════════════════════

function displayAscendantResult(data, result, city) {
  const resDiv = document.getElementById('ascendantResult');
  if (!resDiv) return;

  const color = ASC_ELEMENT_COLORS[data.element] || '#7c3aed';

  // องศา นาที วินาทีในราศี
  const degStr = `${result.deg}° ${result.min}' ${result.sec}" (${data.name})`;

  // อยันศ์
  const ayanDeg = Math.floor(result.ayan);
  const ayanMin = Math.floor((result.ayan - ayanDeg) * 60);

  const signEl = document.getElementById('ascSign');
  if (signEl) signEl.innerText = `ลัคนาราศี${data.name}`;

  const iconEl = document.getElementById('ascIcon');
  if (iconEl) iconEl.innerText = data.icon;

  const degEl = document.getElementById('ascDegree');
  if (degEl) degEl.innerHTML = `${degStr} &nbsp;·&nbsp; สายัน ${result.tropical.toFixed(2)}°`;

  const descEl = document.getElementById('ascDesc');
  if (descEl) descEl.innerText = data.desc;

  const careerEl = document.getElementById('asccareer');
  if (careerEl) careerEl.innerText = data.career;

  const strengthsEl = document.getElementById('ascstrengths');
  if (strengthsEl) strengthsEl.innerText = data.strengths.join(', ');

  const weakEl = document.getElementById('ascweaknesses');
  if (weakEl) weakEl.innerText = data.weaknesses.join(', ');

  const loveEl = document.getElementById('ascLove');
  if (loveEl) loveEl.innerText = data.love;

  const healthEl = document.getElementById('ascHealth');
  if (healthEl) healthEl.innerText = data.health;

  const rulerEl = document.getElementById('ascruler');
  if (rulerEl) rulerEl.innerText = data.ruler;

  const compEl = document.getElementById('asccompatible');
  if (compEl) compEl.innerText = data.compatible.join(', ');

  const elemEl = document.getElementById('ascElement');
  if (elemEl) elemEl.innerHTML = `<span style="color:${color}; font-weight:700;">${data.element}</span>`;

  const luckyColorEl = document.getElementById('ascLuckyColor');
  if (luckyColorEl) luckyColorEl.innerText = data.luckyColor || '-';

  const luckyNumEl = document.getElementById('ascLuckyNumber');
  if (luckyNumEl) luckyNumEl.innerText = data.luckyNumber ? data.luckyNumber.join(', ') : '-';

  // ข้อมูลดาราศาสตร์ HUD
  const astroEl = document.getElementById('ascAstroInfo');
  if (astroEl) {
    astroEl.innerHTML = `
      <div class="row g-2">
        <div class="col-md-6 col-12">
          <i class="fas fa-map-pin text-danger me-1"></i> พิกัดคำนวณ: <b>${city.name}</b> (Lat: ${city.lat.toFixed(4)}°N, Lng: ${city.lng.toFixed(4)}°E)
        </div>
        <div class="col-md-6 col-12">
          <i class="fas fa-satellite text-primary me-1"></i> Julian Day (JD): <b>${result.jd.toFixed(5)}</b> &nbsp;|&nbsp; LST: <b>${result.lst.toFixed(3)}°</b>
        </div>
        <div class="col-md-6 col-12">
          <i class="fas fa-angle-double-right text-purple me-1"></i> อยันศ์ลาหิริ (Lahiri Ayanamsha): <b>${ayanDeg}° ${ayanMin}'</b> &nbsp;|&nbsp; ความเอียงสุริยวิถี (ε): <b>${result.eps.toFixed(4)}°</b>
        </div>
        <div class="col-md-6 col-12">
          <i class="fas fa-circle-notch text-success me-1"></i> ลัคนาสายัน (Tropical): <b>${result.tropical.toFixed(3)}°</b> &nbsp;|&nbsp; ลัคนานิรายัน (Sidereal): <b>${result.sidereal.toFixed(3)}°</b>
        </div>
      </div>
    `;
  }

  resDiv.style.display = 'block';
  resDiv.classList.add('animate__animated', 'animate__fadeIn');
  resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ═══════════════════════════════════════════════════════════════════════
// บันทึกภาพแผ่นดวงชะตาลัคนา (Luxury Porsche HUD Theme)
// ═══════════════════════════════════════════════════════════════════════

async function saveAscendantImg() {
  const captureArea = document.getElementById('ascendantResult');
  if (!captureArea || captureArea.style.display === 'none') {
    Swal.fire('แจ้งเตือน', 'กรุณาคำนวณลัคนาก่อนบันทึกภาพครับ', 'warning');
    return;
  }
  
  Swal.fire({
      title: 'กำลังสร้างแผ่นดวงชะตาสุดหรู...',
      text: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
  });

  try {
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1440;
    
    // Background: Modern Luxury Dark & Violet Gradient
    const bgGrad = ctx.createRadialGradient(canvas.width/2, 200, 50, canvas.width/2, canvas.height/2, 900);
    bgGrad.addColorStop(0, '#1c1836');
    bgGrad.addColorStop(0.6, '#0f0e1d');
    bgGrad.addColorStop(1, '#07060d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Outer Frame Glow
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);
    ctx.setLineDash([]);
    
    // Header
    const icon = document.getElementById('ascIcon')?.innerText || '✨';
    const sign = document.getElementById('ascSign')?.innerText || 'ลัคนา';
    const degree = document.getElementById('ascDegree')?.innerText || '';
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 32px "Sarabun", sans-serif';
    ctx.fillText('SIAM HORAMANGKOL — DIGITAL HOROSCOPE', canvas.width / 2, 75);

    // Center Cockpit Dial Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 260, 140, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    
    ctx.fillStyle = '#4c1d95';
    ctx.font = 'bold 70px "Sarabun", sans-serif';
    ctx.fillText(icon, canvas.width / 2, 175);
    
    ctx.font = 'bold 42px "Sarabun", sans-serif';
    ctx.fillText(sign, canvas.width / 2, 260);
    
    ctx.font = '22px "Sarabun", sans-serif';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText(degree, canvas.width / 2, 320);
    
    // Content box
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(70, 440, canvas.width - 140, 850, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Detail texts
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let y = 500;
    const drawLine = (label, text, color) => {
        ctx.font = 'bold 30px "Sarabun", sans-serif';
        ctx.fillStyle = '#6b21a8';
        ctx.fillText(label, 110, y);
        const w = ctx.measureText(label).width;
        ctx.font = '28px "Sarabun", sans-serif';
        ctx.fillStyle = color || '#1e293b';
        ctx.fillText(text, 110 + w + 15, y);
        y += 55;
    };
    
    const ruler = document.getElementById('ascruler')?.innerText || '';
    const element = document.getElementById('ascElement')?.innerText || '';
    drawLine('ดาวเกษตรประจำลัคนา:', `${ruler} (${element})`, '#0284c7');
    
    const compatible = document.getElementById('asccompatible')?.innerText || '';
    drawLine('ราศีที่สมพงศ์:', compatible, '#059669');
    
    const colors = document.getElementById('ascLuckyColor')?.innerText || '';
    const luckyNum = document.getElementById('ascLuckyNumber')?.innerText || '';
    drawLine('สีมงคล / เลขเด่น:', `${colors} | เลข ${luckyNum}`, '#d97706');

    y += 10;
    const desc = document.getElementById('ascDesc')?.innerText || '';
    ctx.font = '26px "Sarabun", sans-serif';
    ctx.fillStyle = '#475569';
    
    // Wrap text logic
    let lines = [];
    if (window.Intl && window.Intl.Segmenter) {
        const seg = new Intl.Segmenter('th', { granularity: 'word' });
        const segments = seg.segment(desc);
        let curr = "";
        for (const {segment} of segments) {
            if (ctx.measureText(curr + segment).width > 820 && curr.trim() !== "") {
                lines.push(curr); curr = segment;
            } else curr += segment;
        }
        lines.push(curr);
    } else {
        lines.push(desc.substring(0, 50) + "...");
    }
    for(let l of lines) {
        ctx.fillText(l, 110, y);
        y += 42;
    }
    
    y += 15;
    const career = document.getElementById('asccareer')?.innerText || '';
    drawLine('เส้นทางอาชีพ:', career, '#334155');
    
    const strengths = document.getElementById('ascstrengths')?.innerText || '';
    drawLine('จุดเด่นและพลัง:', strengths, '#16a34a');
    
    const weaknesses = document.getElementById('ascweaknesses')?.innerText || '';
    drawLine('จุดควรระวัง:', weaknesses, '#dc2626');
    
    const love = document.getElementById('ascLove')?.innerText || '';
    drawLine('เรื่องความรัก:', love, '#0284c7');
    
    const health = document.getElementById('ascHealth')?.innerText || '';
    drawLine('การดูแลสุขภาพ:', health, '#ea580c');
    
    // Footer watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a78bfa';
    ctx.font = '24px "Sarabun", sans-serif';
    ctx.fillText('สยามโหรามงคล · ระบบลัคนาพยากรณ์นิรายัน ดาราศาสตร์สากล', canvas.width / 2, canvas.height - 75);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const zodiacName = sign.replace('ลัคนาราศี', '').trim() || 'ดวงชะตา';
    link.download = `ลัคนา_ราศี${zodiacName}_PorscheEdition.png`;
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