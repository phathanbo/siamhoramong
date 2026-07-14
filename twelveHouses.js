"use strict";

// 12 ภพ (Twelve Houses) — โหราศาสตร์ไทยแบบดูดาว
// คำนวณจากลัคนา (Lagna/Ascendant) ตามเวลาเกิด

const TH_SIGNS = [
  { name:"เมษ",   eng:"Aries",       planet:"อังคาร",   element:"ไฟ",  icon:"♈" },
  { name:"พฤษภ",  eng:"Taurus",      planet:"ศุกร์",    element:"ดิน", icon:"♉" },
  { name:"เมถุน", eng:"Gemini",      planet:"พุธ",      element:"ลม",  icon:"♊" },
  { name:"กรกฎ",  eng:"Cancer",      planet:"จันทร์",   element:"น้ำ", icon:"♋" },
  { name:"สิงห์", eng:"Leo",         planet:"อาทิตย์",  element:"ไฟ",  icon:"♌" },
  { name:"กันย์", eng:"Virgo",       planet:"พุธ",      element:"ดิน", icon:"♍" },
  { name:"ตุลย์", eng:"Libra",       planet:"ศุกร์",    element:"ลม",  icon:"♎" },
  { name:"พิจิก", eng:"Scorpio",     planet:"อังคาร",   element:"น้ำ", icon:"♏" },
  { name:"ธนู",   eng:"Sagittarius", planet:"พฤหัสบดี", element:"ไฟ",  icon:"♐" },
  { name:"มกร",   eng:"Capricorn",   planet:"เสาร์",    element:"ดิน", icon:"♑" },
  { name:"กุมภ์", eng:"Aquarius",    planet:"เสาร์",    element:"ลม",  icon:"♒" },
  { name:"มีน",   eng:"Pisces",      planet:"พฤหัสบดี", element:"น้ำ", icon:"♓" }
];

// ชื่อ 12 ภพ (Houses) ตามตำราไทย
const TH_HOUSES = [
  { num:1,  name:"ชาตา",   area:"ตัวเอง ร่างกาย บุคลิก ชะตาชีวิต",          icon:"👤" },
  { num:2,  name:"กดุมภ์", area:"ทรัพย์สมบัติ การเงิน ครอบครัว อาหาร",       icon:"💰" },
  { num:3,  name:"สหัช",   area:"พี่น้อง การสื่อสาร การเดินทางใกล้ ความกล้า", icon:"🤝" },
  { num:4,  name:"พันธุ์", area:"บ้านเรือน มารดา ที่ดิน รากฐานชีวิต",        icon:"🏠" },
  { num:5,  name:"บุตร",   area:"บุตร ความรัก ความสร้างสรรค์ การศึกษา",       icon:"👶" },
  { num:6,  name:"ทาสี",   area:"สุขภาพ ศัตรู การรับใช้ หนี้สิน โรคภัย",     icon:"⚕️" },
  { num:7,  name:"ปัตนิ",  area:"คู่ครอง พันธมิตร การสมรส สัญญา",            icon:"💑" },
  { num:8,  name:"มรณะ",   area:"อายุ มรดก การเปลี่ยนแปลง สิ่งซ่อนเร้น",    icon:"🔮" },
  { num:9,  name:"สุภ",    area:"ศาสนา โชคลาภ การเดินทางไกล บิดา ปัญญา",    icon:"🙏" },
  { num:10, name:"กรรม",   area:"อาชีพ เกียรติยศ ชื่อเสียง ผลกรรม",          icon:"🏆" },
  { num:11, name:"ลาภ",    area:"รายได้ มิตรภาพ ความหวัง ลาภลอย",            icon:"⭐" },
  { num:12, name:"วินาศ",  area:"การสูญเสีย ความลับ การเดินทางต่างประเทศ",    icon:"🌊" }
];

// คำพยากรณ์ตามเจ้าของราศีที่ตกภพ
const TH_HOUSE_PRED = {
  // [house][planet] = คำพยากรณ์
  1: {
    "อังคาร":   "บุคลิกองอาจ กล้าหาญ มีพลังงานสูง ผู้นำ แต่ต้องระวังความหุนหันพลันแล่น",
    "ศุกร์":    "รูปงาม อ่อนโยน มีเสน่ห์ รักสวยรักงาม มีความสามารถด้านศิลปะ",
    "พุธ":      "ฉลาด พูดเก่ง ชอบเรียนรู้ มีความสามารถด้านการสื่อสารและธุรกิจ",
    "จันทร์":   "อ่อนไหว เมตตา รักครอบครัว อารมณ์แปรปรวน มีจินตนาการสูง",
    "อาทิตย์":  "มีอำนาจ โดดเด่น ชอบเป็นผู้นำ มีความภาคภูมิใจในตัวเอง",
    "พฤหัสบดี": "โชคดี ใจกว้าง ฉลาด มีความรู้และปัญญา ได้รับการยอมรับ",
    "เสาร์":    "ขยัน อดทน รับผิดชอบ แต่ชีวิตมีอุปสรรคที่ต้องผ่าน"
  },
  2: {
    "อังคาร":   "หาเงินได้ดีแต่ใช้เร็ว ระวังการทะเลาะเรื่องเงิน",
    "ศุกร์":    "โชคดีด้านการเงิน มีรายได้จากความงามและศิลปะ",
    "พุธ":      "รายได้จากการค้าและการสื่อสาร หลายช่องทางรายได้",
    "จันทร์":   "รายได้ผันผวนตามสภาพจิตใจ รักความมั่นคงด้านการเงิน",
    "อาทิตย์":  "มีรายได้ดี ทรัพย์สินมาจากตำแหน่งและชื่อเสียง",
    "พฤหัสบดี": "มั่งคั่งได้ โชคดีด้านการเงิน มรดกดี",
    "เสาร์":    "ต้องขยันหาเงินเอง ชีวิตทางการเงินต้องใช้ความพยายาม"
  },
  3: {
    "อังคาร":   "พี่น้องมีปัญหากัน กล้าแสดงออก ชอบเดินทาง",
    "ศุกร์":    "มีพี่น้องและเพื่อนน่ารัก สัมพันธ์ดี ชอบสังสรรค์",
    "พุธ":      "ฉลาด เขียนและพูดดี มีพี่น้องหลายคน สัมพันธ์ดี",
    "จันทร์":   "อารมณ์อ่อนไหว ผูกพันกับพี่น้อง ชอบเดินทางใกล้บ้าน",
    "อาทิตย์":  "มีพี่น้องน้อย แต่สัมพันธ์ดี เป็นหัวหน้าพี่น้อง",
    "พฤหัสบดี": "พี่น้องดี ได้รับความช่วยเหลือจากพี่น้อง สัมพันธ์ดี",
    "เสาร์":    "พี่น้องน้อย หรือห่างเหิน ต้องพึ่งตัวเอง"
  },
  4: {
    "อังคาร":   "บ้านมีความขัดแย้ง มารดามีบุคลิกแข็งแกร่ง ย้ายบ้านบ่อย",
    "ศุกร์":    "บ้านสวยงาม มารดาน่ารัก ชีวิตครอบครัวมีความสุข",
    "พุธ":      "บ้านเต็มไปด้วยหนังสือและการเรียนรู้ มารดาฉลาด",
    "จันทร์":   "ผูกพันกับบ้านและมารดามาก ย้ายบ้านบ่อย อารมณ์ขึ้นกับบรรยากาศบ้าน",
    "อาทิตย์":  "บ้านใหญ่โต มีชื่อเสียงในครอบครัว มารดาโดดเด่น",
    "พฤหัสบดี": "บ้านร่มรื่น ครอบครัวอบอุ่น มีที่ดินและทรัพย์สิน",
    "เสาร์":    "ชีวิตครอบครัวมีอุปสรรค ต้องดูแลพ่อแม่ บ้านอาจเก่า"
  },
  5: {
    "อังคาร":   "บุตรน้อย ลูกมีพลังงานสูง ชอบเสี่ยงในความรัก",
    "ศุกร์":    "มีบุตรน่ารัก ชีวิตรักโรแมนติก ชอบความบันเทิงและศิลปะ",
    "พุธ":      "บุตรฉลาด ชอบกิจกรรมสร้างสรรค์ หลายความสัมพันธ์",
    "จันทร์":   "รักลูกมาก อยากมีลูกหลาย ความรักผันผวนตามอารมณ์",
    "อาทิตย์":  "บุตรน้อยแต่โดดเด่น ความรักเต็มเปี่ยม ชอบเป็นศูนย์กลาง",
    "พฤหัสบดี": "บุตรดี มีการศึกษาดี โชคดีในความรัก ได้รับความสุข",
    "เสาร์":    "บุตรน้อย หรือล่าช้า ต้องอดทนในเรื่องความรัก"
  },
  6: {
    "อังคาร":   "สุขภาพต้องระวัง โรคเกี่ยวกับความร้อน อุบัติเหตุ แต่ฟื้นตัวเร็ว",
    "ศุกร์":    "สุขภาพดี ระวังเรื่องไต ผิวหนัง และน้ำหนัก",
    "พุธ":      "ระวังระบบประสาทและการหายใจ ต้องระวังความเครียด",
    "จันทร์":   "สุขภาพขึ้นลงตามอารมณ์ ระวังท้อง และของเหลวในร่างกาย",
    "อาทิตย์":  "สุขภาพดี ระวังหัวใจและสายตา มีศัตรูน้อย",
    "พฤหัสบดี": "สุขภาพดี ฟื้นตัวเร็ว มีผู้ช่วยเหลือมาก",
    "เสาร์":    "ระวังสุขภาพกระดูกและเข่า โรคเรื้อรัง ต้องดูแลสุขภาพอย่างสม่ำเสมอ"
  },
  7: {
    "อังคาร":   "คู่ครองมีบุคลิกแข็งกร้าว มีความขัดแย้งในชีวิตคู่ หย่าร้างได้",
    "ศุกร์":    "คู่ครองน่ารัก งดงาม ชีวิตคู่มีความสุข โรแมนติก",
    "พุธ":      "คู่ครองฉลาด พูดดี ชีวิตคู่มีการสื่อสารที่ดี",
    "จันทร์":   "คู่ครองอ่อนโยน เมตตา แต่อารมณ์แปรปรวน ต้องประนีประนอม",
    "อาทิตย์":  "คู่ครองมีชื่อเสียง โดดเด่น ชีวิตคู่เด่น",
    "พฤหัสบดี": "คู่ครองดี มีการศึกษา ชีวิตคู่มั่นคงและมีความสุข",
    "เสาร์":    "แต่งงานช้า หรือคู่ครองอาวุโสกว่า ต้องรับผิดชอบมาก"
  },
  8: {
    "อังคาร":   "ระวังอุบัติเหตุ การเสี่ยงตาย แต่รอดพ้นได้ มรดกมีข้อพิพาท",
    "ศุกร์":    "ได้มรดกหรือสมบัติจากคู่ครอง อายุยืน ความลับด้านความรัก",
    "พุธ":      "ชอบเรื่องลึกลับ วิทยาศาสตร์ลึก มรดกจากพี่น้อง",
    "จันทร์":   "อารมณ์อ่อนไหวต่อการสูญเสีย ได้รับมรดกจากมารดา",
    "อาทิตย์":  "อายุยืน แต่ต้องระวังสุขภาพหัวใจ มรดกดี",
    "พฤหัสบดี": "อายุยืน โชคดีในเรื่องมรดก ผ่านวิกฤติได้ดี",
    "เสาร์":    "อายุยืนแต่ต้องเผชิญความยากลำบาก ระวังโรคเรื้อรัง"
  },
  9: {
    "อังคาร":   "ศรัทธาแรงกล้า เดินทางไกลบ่อย บิดาแข็งแกร่ง",
    "ศุกร์":    "โชคดีในการเดินทาง บิดาน่ารัก มีความเชื่อมั่นในศาสนา",
    "พุธ":      "ชอบปรัชญาและการศึกษาระดับสูง เขียนหนังสือ นักเรียนรู้",
    "จันทร์":   "ศรัทธาลึกซึ้ง ชอบเดินทางไกล ความเชื่อเปลี่ยนตามวัย",
    "อาทิตย์":  "บิดาโดดเด่น โชคดีจากการเดินทาง ชื่อเสียงในต่างแดน",
    "พฤหัสบดี": "โชคดีมากในภพนี้ โชคลาภ ศาสนา ปัญญา การศึกษาสูง",
    "เสาร์":    "ศรัทธาในศาสนาช้า การเดินทางมีอุปสรรค บิดามีความยากลำบาก"
  },
  10: {
    "อังคาร":   "อาชีพด้านการทหาร ตำรวจ แพทย์ ผู้นำ แต่มีการแข่งขันสูง",
    "ศุกร์":    "อาชีพด้านศิลปะ ความงาม ธุรกิจ ความบันเทิง ชื่อเสียงดี",
    "พุธ":      "อาชีพด้านการสื่อสาร ค้าขาย เลขานุการ การศึกษา นักเขียน",
    "จันทร์":   "อาชีพเกี่ยวกับประชาชน ค้าขาย อาหาร อสังหาริมทรัพย์",
    "อาทิตย์":  "มีอำนาจสูงในอาชีพ ผู้นำ ราชการ ชื่อเสียงดีมาก",
    "พฤหัสบดี": "อาชีพราบรื่น เจริญก้าวหน้า ได้รับการยอมรับ",
    "เสาร์":    "อาชีพต้องใช้ความพยายามและเวลา แต่ประสบความสำเร็จในที่สุด"
  },
  11: {
    "อังคาร":   "มีเพื่อนมาก แต่อาจมีความขัดแย้ง รายได้จากการแข่งขัน",
    "ศุกร์":    "เพื่อนน่ารัก สังคมดี รายได้จากความงามและศิลปะ",
    "พุธ":      "เพื่อนฉลาด เครือข่ายกว้าง รายได้จากการค้าและการสื่อสาร",
    "จันทร์":   "เพื่อนมาก อ่อนไหวต่อสังคม รายได้ผันผวน",
    "อาทิตย์":  "มีเพื่อนที่มีอำนาจ ได้รับการสนับสนุนจากผู้ใหญ่",
    "พฤหัสบดี": "โชคดีมากในภพนี้ มีเพื่อนดี ได้รับลาภผล",
    "เสาร์":    "เพื่อนน้อย เลือกเพื่อนยาก แต่เพื่อนที่มีคือเพื่อนแท้"
  },
  12: {
    "อังคาร":   "ระวังศัตรูลับ ค่าใช้จ่ายสูง อาจมีคดีความ แต่เอาชนะได้",
    "ศุกร์":    "ค่าใช้จ่ายเพื่อความสุขสูง ชอบความลับ ความสัมพันธ์ลับ",
    "พุธ":      "ชอบงานลับ วิจัย ระวังเรื่องการพูดและเอกสาร",
    "จันทร์":   "อารมณ์อ่อนไหว ชอบความสงบ ต้องการเวลาส่วนตัว",
    "อาทิตย์":  "ต้องระวังเรื่องชื่อเสียงและความลับ ค่าใช้จ่ายสูง",
    "พฤหัสบดี": "สูญเสียน้อย ผ่านอุปสรรคได้ดี ได้รับความช่วยเหลือลับๆ",
    "เสาร์":    "มีภาระซ่อนเร้น โรคลึก ต้องระวังศัตรูลับและการถูกใส่ร้าย"
  }
};

// คำนวณลัคนาราศี (approximate) จากเวลาเกิด
function calcLagna(birthDateISO, birthTime) {
  if (!birthDateISO || !birthTime) return null;

  // ใช้ระบบคำนวณลัคนาแบบแม่นยำสูง (ตัดอายนางศ์แบบลาหิรี) หากมีฟังก์ชันจาก ascendant.js
  if (typeof ascCalcLagna === 'function') {
    // กำหนดค่าละติจูด/ลองจิจูด เริ่มต้นเป็นกรุงเทพฯ หากไม่มี
    const lat = 13.7563;
    const lng = 100.5018;
    const result = ascCalcLagna(birthDateISO, birthTime, lat, lng);
    return result.rasi; // rasi index 0-11 (0=เมษ)
  }

  // --- ระบบ Fallback แบบประมาณการ (หากไม่ได้โหลด ascendant.js) ---
  const [h, m] = birthTime.split(":").map(Number);
  const totalMins = h * 60 + m;
  const date = new Date(birthDateISO);
  // หา offset แบบหยาบๆ จากวันในรอบปี (1 เมษายน เริ่มเมษ)
  // ให้วันที่ 13 เมษายน เป็นจุดเริ่มต้นราศีเมษ (องศา=0)
  const dApril = new Date(date.getFullYear(), 3, 13); 
  let diff = date - dApril;
  if (diff < 0) {
      const dAprilPrev = new Date(date.getFullYear() - 1, 3, 13);
      diff = date - dAprilPrev;
  }
  const dayOfYear = Math.floor(diff / 86400000);
  const signOffset = Math.floor(dayOfYear / 30.4375) % 12;

  // สมมติฐานให้ 1 ราศีใช้เวลาขึ้น 2 ชั่วโมง 
  // (ซึ่งในความเป็นจริงอันโตนาทีแต่ละราศีไม่เท่ากัน)
  // เริ่มต้นที่ราศีที่พระอาทิตย์สถิตในตอนเช้า (06:00 น.)
  const minSince6AM = totalMins - 360; 
  let ascOffset = Math.floor(minSince6AM / 120);
  
  const lagnaIdx = ((signOffset + ascOffset) % 12 + 12) % 12;
  return lagnaIdx;
}

function formatToISODate(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr;
    const p = dateStr.split("/");
    if (p.length === 3) {
        let y = parseInt(p[2]);
        if (y > 2400) y -= 543;
        return `${y}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
    }
    return dateStr;
}

function renderTwelveHouses() {
  const el = document.getElementById("twHContent");
  if (!el) return;

  const rawDate   = document.getElementById("twhBirthDate")?.value?.trim() || "";
  const isoDate   = rawDate ? formatToISODate(rawDate) : formatToISODate(localStorage.getItem("userBirthdate") || "");
  const birthTime = document.getElementById("twhBirthTime")?.value  || localStorage.getItem("userBirthTime") || "";

  if (!isoDate || !birthTime) {
    el.innerHTML = `<div class="alert alert-warning text-center">กรุณากรอกวันเกิดและเวลาเกิด เพื่อคำนวณลัคนาราศี</div>`;
    return;
  }

  const lagnaIdx = calcLagna(isoDate, birthTime);
  if (lagnaIdx === null) {
    el.innerHTML = `<div class="alert alert-warning text-center">ข้อมูลไม่ครบ</div>`;
    return;
  }

  const lagnaSign = TH_SIGNS[lagnaIdx];

  let html = `
    <div class="text-center mb-4 pb-3" style="border-bottom:1px solid rgba(212,175,55,0.3);">
      <div style="font-size:3rem;">${lagnaSign.icon}</div>
      <h3 class="text-gold mt-1">ลัคนาราศี${lagnaSign.name}</h3>
      <p style="color:#aaa;font-size:0.9rem;">เจ้าลัคนา: ดาว${lagnaSign.planet} • ธาตุ${lagnaSign.element}</p>
      <small style="color:#666;font-size:0.78rem;">* การคำนวณแบบประมาณ เหมาะสำหรับการพยากรณ์ทั่วไป</small>
    </div>`;

  // แสดง 12 ภพ
  html += `<div class="row">`;
  for (let i = 0; i < 12; i++) {
    const houseSignIdx = (lagnaIdx + i) % 12;
    const sign  = TH_SIGNS[houseSignIdx];
    const house = TH_HOUSES[i];
    const pred  = TH_HOUSE_PRED[house.num]?.[sign.planet] || "ดาวในภพนี้ส่งผลตามธรรมชาติของดาวและราศี";

    html += `
      <div class="col-md-6 mb-3">
        <div class="card h-100" style="background:#111;border:1px solid rgba(212,175,55,0.25);border-radius:12px;">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <span style="font-size:1.5rem;margin-right:10px;">${house.icon}</span>
              <div>
                <h6 class="text-gold mb-0">ภพที่ ${house.num} — ${house.name}</h6>
                <small style="color:#888;">${house.area}</small>
              </div>
              <span class="ml-auto" style="font-size:1.3rem;">${sign.icon}</span>
            </div>
            <div class="d-flex align-items-center mb-2">
              <span style="color:#aaa;font-size:0.82rem;">ราศี${sign.name} • เจ้าราศี: ดาว${sign.planet}</span>
            </div>
            <p class="mb-0" style="color:#ccc;font-size:0.85rem;line-height:1.6;">${pred}</p>
          </div>
        </div>
      </div>`;
  }
  html += `</div>

    <div class="card mt-3" style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.25);border-radius:12px;">
      <div class="card-body">
        <h6 class="text-gold">📖 เกี่ยวกับ 12 ภพ</h6>
        <p style="color:#ccc;font-size:0.88rem;margin:0;line-height:1.7;">
          ระบบ 12 ภพ (Bhava) มาจากโหราศาสตร์อินเดีย (Jyotish) ที่โหราศาสตร์ไทยรับมา
          ภพที่ 1 (ชาตา) คือลัคนาราศีที่ขึ้นทางทิศตะวันออก ณ เวลาเกิด
          ภพถัดไปเรียงตามลำดับราศีทวนเข็มนาฬิกา
          เจ้าของแต่ละภพ (เจ้าราศีที่ปรากฏในภพ) กำหนดคุณสมบัติและผลของภพนั้น
        </p>
      </div>
    </div>`;

  el.innerHTML = html;
}

function fillTWHFromMember(val) {
    if (!val) return;
    try {
        const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
        let member = allHistory.find(m => m.memberId === val || m.birthdate === val);
        if (!member) return;

        if (member.birthdate) {
            document.getElementById('twhBirthDate').value = formatToISODate(member.birthdate);
        }
        if (member.birthtime) {
            document.getElementById('twhBirthTime').value = member.birthtime.replace(/\s*น\.?/, '').trim();
        }
        renderTwelveHouses();
    } catch(e) {}
}

function showTwelveHousesPage() {
  const c = document.getElementById("twelveHousesContainer");
  if (!c) return;

  const isoDate   = localStorage.getItem("userBirthdate") || "";
  const birthTime = localStorage.getItem("userBirthTime") || "";

  // date input requires YYYY-MM-DD
  let dispDate = isoDate ? formatToISODate(isoDate) : "";

  c.innerHTML = `
    <div class="headpage">
      <h1>🏛️ 12 ภพ</h1>
      <p class="text">วิเคราะห์ชีวิต 12 ด้านจากลัคนาราศี ตามหลักโหราศาสตร์ไทย</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div class="row justify-content-center mb-4">
            <div class="col-md-12 mb-3">
              <label style="display:block;color:#d4af37;font-size:0.82rem;margin-bottom:6px;">👥 เลือกสมาชิกจากประวัติ</label>
              <select id="twhMemberSelect" onchange="fillTWHFromMember(this.value)" class="member-selector-shared form-control bg-dark text-white border-gold"
                      style="border-radius:10px;">
                <option value="">— เลือกสมาชิก —</option>
              </select>
            </div>
            <div class="col-md-5 mb-2">
              <label class="text-gold mb-1">วันเกิด</label>
              <input type="date" id="twhBirthDate" class="form-control bg-dark text-white border-gold"
                value="${dispDate}"
                style="border-radius:10px;">
            </div>
            <div class="col-md-4 mb-2">
              <label class="text-gold mb-1">เวลาเกิด</label>
              <input type="time" id="twhBirthTime" class="form-control bg-dark text-white border-gold"
                value="${birthTime}" style="border-radius:10px;">
            </div>
            <div class="col-md-3 mb-2 d-flex align-items-end">
              <button class="btn btn-gold btn-block" onclick="renderTwelveHouses()" style="border-radius:10px;">
                <i class="fas fa-calculator mr-1"></i> คำนวณ
              </button>
            </div>
          </div>
          <div id="twHContent"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;

  if (window.autoFillMemberData) {
      window.autoFillMemberData(''); // Trigger population of .member-selector-shared if available
  }
  
  if (dispDate && birthTime) setTimeout(renderTwelveHouses, 80);
}

document.addEventListener("DOMContentLoaded", showTwelveHousesPage);
window.showTwelveHousesPage = showTwelveHousesPage;
window.renderTwelveHouses   = renderTwelveHouses;
window.fillTWHFromMember    = fillTWHFromMember;
