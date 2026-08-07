/**
 * โหราศาสตร์ไทย - ดูดวงตามดาวเกิด (Thai Astrology System)
 * วิเคราะห์ดาว 9 ดวง และตำแหน่งในบ้าน 12 บ้าน
 * อิงตามหลักโหราศาสตร์ไทยอย่างละเอียด
 */

// ========================================
// 🌟 ดาว 9 ดวง (ระบบโหราศาสตร์ไทย)
// ========================================
const PLANETS = {
    sun: {
        name: '☀️ อาทิตย์ (สูรย์)',
        thai: 'สูรย์',
        color: '#FFD700',
        meaning: 'ชีวิต พลัง ความนำ ชื่อเสียง ความแข็งแกร่ง',
        character: 'ผู้นำ มีอำนาจ เด่นชัด กล้าหาญ ตัดสินใจได้ดี',
        strength: 'ความแข็งแกร่ง ความมั่นใจ ความรับผิดชอบ ความโด่งดัง',
        weakness: 'อาจหนักแน่น อยากเป็นศูนย์กลาง ไม่อ่อนไหว',
        career: ['ผู้บริหาร', 'นักธุรกิจ', 'ข้าราชการสูง', 'ผู้นำการเมือง', 'นักวิทยาศาสตร์'],
        compatibility: 'ดีกับจันทร์ พฤหัสบดี เสาร์',
        property: 'ตัวแทน ผู้บัญชา ใจจริง',
        moolatrikona: '10°-40° สิงห์',
        exaltation: '10°-40° เมษ',
        debilitation: '10°-40° ธุลา'
    },
    moon: {
        name: '🌙 จันทร์',
        thai: 'จันทร์',
        color: '#D3D3D3',
        meaning: 'อารมณ์ จิตใจ จำนวน ความรู้สึก ความอ่อนไหว',
        character: 'อ่อนไหว มีน้ำใจ ช่วยเหลือ ขลาด เห็นอกเห็นใจ',
        strength: 'ความอ่อนหวาน สัญชาตญาณแหลม ความเห็นใจ ความมั่นคง',
        weakness: 'ขี้แพ้ ใจสั่น ไม่แน่วแน่ อารมณ์เปลี่ยนแปลง',
        career: ['พยาบาล', 'ครู', 'นักศาสตร์ด้านเด็ก', 'งานศาสนา', 'นักดนตรี'],
        compatibility: 'ดีกับอาทิตย์ พุธ ศุกร์',
        property: 'แม่ สตรี ความชื้น ความสงบ',
        moolatrikona: '4°-30° ธนู',
        exaltation: '3°-27° ริษฎ์',
        debilitation: '3°-27° ตุลา'
    },
    mars: {
        name: '🔴 อังคาร',
        thai: 'อังคาร',
        color: '#FF4500',
        meaning: 'พลัง ความกล้า ความคิด ศรัทธา ความเด่น',
        character: 'กล้าหาญ ก้าวร้าว แข็งแรง เร่งด่วน ร้อนแรง',
        strength: 'ความดุเดือด พลังแรง ความกล้าหาญ ความทะเยอทะยาน',
        weakness: 'ก้าวร้าว ติดใจ ขัดแย้ง ไม่อดทน ก้าวร้าวเกินไป',
        career: ['ทหาร', 'ตำรวจ', 'นักกีฬา', 'วิศวกร', 'นักศิลป์การต่อสู้'],
        compatibility: 'ดีกับอาทิตย์ พฤหัสบดี',
        property: 'ชาย ความแข็ง ลัว ความกล้า',
        moolatrikona: '0°-12° แกแส',
        exaltation: '28° มกร',
        debilitation: '28° ลิ่ม'
    },
    mercury: {
        name: '🟡 พุธ',
        thai: 'พุธ',
        color: '#FFA500',
        meaning: 'สติปัญญา การค้นคว้า ภาษา การสื่อสาร ความฉลาด',
        character: 'ฉลาด มีสติ วิเคราะห์ได้ดี ชอบเรียนรู้ พูดเก่ง',
        strength: 'ความเหมาะสมด้านปัญญา การพูด ความจำที่ดี ความยืดหยุ่น',
        weakness: 'อาจใจแคบ ชอบถกเถียง ไม่เชื่อใจง่าย นิสัยไม่สุขุม',
        career: ['อาจารย์', 'นักเขียน', 'นักการค้า', 'นักบัญชี', 'นักสื่อสาร'],
        compatibility: 'ดีกับจันทร์ ศุกร์',
        property: 'พี่น้อง การค้นคว้า การสื่อสาร',
        moolatrikona: '16°-20° กันย์',
        exaltation: '15° กันย์',
        debilitation: '15° มีนาคม'
    },
    jupiter: {
        name: '🟠 พฤหัสบดี',
        thai: 'พฤหัสบดี',
        color: '#FF8C00',
        meaning: 'โชค บุญ ความมีน้ำใจ โอกาส ความสำเร็จ',
        character: 'มีน้ำใจ เศรษฐี ช่วยเหลือ ยุติธรรม เมตตา',
        strength: 'ความมีน้ำใจ บุญฟ้า ความสำเร็จ ความเป็นอัครเสบศูนย์',
        weakness: 'อาจหลงตัว ไม่ระมัดระวัง ประมาท อวดตน',
        career: ['อาจารย์', 'นักศาสตร์', 'นักกฎหมาย', 'นักการศาสนา', 'นักการเมือง'],
        compatibility: 'ดีกับอาทิตย์ อังคาร เสาร์',
        property: 'มั่นคง โชค บุญมงคล อุดมสมบูรณ์',
        moolatrikona: '0°-12° ธนู',
        exaltation: '0°-15° กันย์',
        debilitation: '0°-15° มีนาคม'
    },
    venus: {
        name: '💚 ศุกร์',
        thai: 'ศุกร์',
        color: '#32CD32',
        meaning: 'ความรัก ความสวย ศิลป์ ความสุข ความเสน่ห์',
        character: 'สวย งาม อ่อนโยน ช่วยเหลือ รักษา รักษาผู้อื่น',
        strength: 'ความสวย ความหวาน ศิลป์การ ความเสน่ห์ ความสุข',
        weakness: 'อาจชอบในความสุขมากเกินไป ไม่จริงจัง ห่วนแหน',
        career: ['ศิลปิน', 'นักแสดง', 'นักออกแบบ', 'นักดนตรี', 'วิจารย์สวย'],
        compatibility: 'ดีกับอาทิตย์ จันทร์ พุธ',
        property: 'ความมีเสน่ห์ ความสุข รักษา ความหวาน',
        moolatrikona: '0°-15° ท่วม',
        exaltation: '27°-40° มีนาคม',
        debilitation: '27°-40° ตุลา'
    },
    saturn: {
        name: '🤎 เสาร์',
        thai: 'เสาร์',
        color: '#8B4513',
        meaning: 'ข้อจำกัด บทเรียน ทรงคุณวุฒิ ความอดทน ความเข้มแข็ง',
        character: 'จริงจัง ซื่อสัตย์ อดทน เข้มแข็ง เป้อปะ',
        strength: 'ความเข้มแข็ง ความทรงคุณวุฒิ ความอดทน ความยาวนาน',
        weakness: 'ถ้าจำกัดมากเกิน จะลำบาก ไม่อ่อนไหว หนักแน่น',
        career: ['วิศวกร', 'สถาปนิก', 'นักบัญชี', 'นักคณิตศาสตร์', 'ชาวไร่'],
        compatibility: 'ดีกับพฤหัสบดี เกตุ',
        property: 'ความเข้มแข็ง ความทรงคุณวุฒิ เวลา',
        moolatrikona: '0°-30° ธนู',
        exaltation: '20°-30° ตุลา',
        debilitation: '20°-30° เมษ'
    },
    rahu: {
        name: '⬛ ราหู',
        thai: 'ราหู',
        color: '#000000',
        meaning: 'มหาวัย เดือด เทพเจ้า ความมุ่งหมาย ความเสี่ยง',
        character: 'เดือดร้อน มีการเปลี่ยนแปลง อันตราย สตรีศรัทธา',
        strength: 'การบำรุง เดือดร้อนแต่สำเร็จ ความปรารถนา ความมุ่งมั่น',
        weakness: 'อาจเดือดร้อน ยุ่งวุ่น ความเสี่ยงสูง ผิดพลาด',
        career: ['นักสืบ', 'นักข่าว', 'นักกฎหมาย', 'นักจิตรกรรม', 'นักธุรกิจขาย'],
        compatibility: 'ต้องถือเท่า เกตุ ดีกับศุกร์',
        property: 'เดือดร้อน เมตตาเทพ ความคลาดเคลื่อน',
        exaltation: 'ธนู',
        debilitation: 'เจมินี'
    },
    ketu: {
        name: '⬜ เกตุ',
        thai: 'เกตุ',
        color: '#696969',
        meaning: 'การปล่อยวาง จิตวิญญาณ ปัญญา การโยธา',
        character: 'อันตรายดี ปล่อยวาง มีปัญญา สงบ สติวิจารณ์',
        strength: 'การตัดใจปล่อยวาง ปัญญาวิจารณ์ ความเพียร อุตสาห์',
        weakness: 'อาจขาดสำนึก ลืมเลือน เฉยเมยชีวิต',
        career: ['พระภิกษุ', 'นักปราชญ์', 'นักดนตรี', 'นักคิดค้น', 'มัคนายก'],
        compatibility: 'ต้องถือเท่า ราหู ดีกับเสาร์',
        property: 'ปลดปล่อย จิตสำนึก การหลุดพ้น',
        exaltation: 'เจมินี',
        debilitation: 'ธนู'
    }
};

// ========================================
// 🏠 บ้าน 12 บ้าน (12 Houses - Bhava)
// ========================================
const HOUSES = {
    1: {
        name: 'บ้านที่ 1 (ตัวท่าน - ลัคนา)',
        thai: 'ตัวท่าน',
        meaning: 'ตัวตน ลักษณะ อำนาจ ความสุขนอก จิตประสงค์ หมู่คณะ',
        planet_effects: 'ดาวในบ้านนี้แสดงลักษณะบุคลิก'
    },
    2: {
        name: 'บ้านที่ 2 (อักษระ)',
        thai: 'อักษระ',
        meaning: 'เงินทอง สถานะ การได้มา การเสีย ทรัพย์สมบัติ อาหาร',
        planet_effects: 'ดาวในบ้านนี้แสดงการเงิน'
    },
    3: {
        name: 'บ้านที่ 3 (ยาติ)',
        thai: 'ยาติ',
        meaning: 'พี่น้อง ญาติ คนรู้จัก ความสัมพันธ์ การเดินทาง ความกล้า',
        planet_effects: 'ดาวในบ้านนี้แสดงญาติสัมพันธ์'
    },
    4: {
        name: 'บ้านที่ 4 (สุขะ)',
        thai: 'สุขะ',
        meaning: 'บ้าน ที่อยู่ แม่ รากฐาน จิตใจนอก แผ่นดิน ยานพาหนะ',
        planet_effects: 'ดาวในบ้านนี้แสดงความสุข'
    },
    5: {
        name: 'บ้านที่ 5 (บุตร)',
        thai: 'บุตร',
        meaning: 'ลูก ศิษย์ สร้างสรรค์ การเรียน ความรัก ศิลป์ การเล่น',
        planet_effects: 'ดาวในบ้านนี้แสดงลูก'
    },
    6: {
        name: 'บ้านที่ 6 (ศัตรู)',
        thai: 'ศัตรู',
        meaning: 'ศัตรู โรค หนี้สิน ปัญหา อุปสรรค การทำงาน ข่มขี่',
        planet_effects: 'ดาวในบ้านนี้แสดงปัญหา'
    },
    7: {
        name: 'บ้านที่ 7 (สัปตม)',
        thai: 'สัปตม',
        meaning: 'คู่ชีวิต คู่สัญญา ความสัมพันธ์ สัญญา การแต่งงาน พ่อค้า',
        planet_effects: 'ดาวในบ้านนี้แสดงคู่ชีวิต'
    },
    8: {
        name: 'บ้านที่ 8 (มรณะ)',
        thai: 'มรณะ',
        meaning: 'อายุ ความตาย มรณา มหาวัย มืดมัว ความลับ มรดก',
        planet_effects: 'ดาวในบ้านนี้แสดงอายุ'
    },
    9: {
        name: 'บ้านที่ 9 (ตพ)',
        thai: 'ตพ',
        meaning: 'ศาสนา กรุณา บัญญัติ โชค อายุยืน ท่านพ่อ การศึกษา',
        planet_effects: 'ดาวในบ้านนี้แสดงโชค'
    },
    10: {
        name: 'บ้านที่ 10 (กรรม)',
        thai: 'กรรม',
        meaning: 'อาชีพ การเมือง สถานะ ชื่อเสียง ตำแหน่งสูง การงาน',
        planet_effects: 'ดาวในบ้านนี้แสดงอาชีพ'
    },
    11: {
        name: 'บ้านที่ 11 (ลาภะ)',
        thai: 'ลาภะ',
        meaning: 'รายได้ หลัง มิตร ความหวัง ความสุขใจ ความพึงพอใจ',
        planet_effects: 'ดาวในบ้านนี้แสดงรายได้'
    },
    12: {
        name: 'บ้านที่ 12 (ยะ)',
        thai: 'ยะ',
        meaning: 'อุปสรรค การสูญเสีย ปัญหา การพนัน โรค คุกขัง การลี้ลับ',
        planet_effects: 'ดาวในบ้านนี้แสดงอุปสรรค'
    }
};

// ========================================
// 🌙 27 ดาวมังกร (Nakshatra)
// ========================================
const NAKSHATRAS = [
    { name: 'อศ्วินี', lord: 'ketu', meaning: 'การเริ่มต้น ความเร็ว', element: 'ไฟ' },
    { name: 'พหารต์ถี', lord: 'venus', meaning: 'ความเศร้า ความเดียวดาย', element: 'ไฟ' },
    { name: 'กฤตฎิกา', lord: 'sun', meaning: 'การสร้าง ความแข็งแกร่ง', element: 'ไฟ' },
    { name: 'โรหิณี', lord: 'moon', meaning: 'การเลี้ยงดู ความมั่นคง', element: 'ดิน' },
    { name: 'มฤคศิรส', lord: 'mars', meaning: 'ความแข็ง ความกล้า', element: 'น้ำ' },
    { name: 'อาร์ทรา', lord: 'mercury', meaning: 'การสอน ความเหมาะสม', element: 'น้ำ' },
    { name: 'พุนารวสู', lord: 'jupiter', meaning: 'การกลับมา ความเอื้อเฟื้อ', element: 'น้ำ' },
    { name: 'พุษยา', lord: 'saturn', meaning: 'ความอุดมสมบูรณ์ ความเสริม', element: 'โลหะ' },
    { name: 'อาศเลษา', lord: 'mercury', meaning: 'สปรส ความสมดุล', element: 'โลหะ' },
    { name: 'มคา', lord: 'ketu', meaning: 'มหาดใหญ่ ความลึกลับ', element: 'โลหะ' },
    { name: 'พหาลกษมี', lord: 'venus', meaning: 'ความเชื่อ ความเหมาะสม', element: 'ไม้' },
    { name: 'อูตรา', lord: 'sun', meaning: 'ความหลัง ความต่อจาก', element: 'ไม้' },
    { name: 'หัสตา', lord: 'moon', meaning: 'มือ ความเปี่ยมปร่ำ', element: 'ไม้' },
    { name: 'จิตรา', lord: 'mars', meaning: 'การสร้าง ความนวม', element: 'ไฟ' },
    { name: 'สวาติ', lord: 'rahu', meaning: 'ความเป่าปีปลาสัย ความสุข', element: 'ลม' },
    { name: 'วิศาขา', lord: 'jupiter', meaning: 'กิจการ ความเสริมสร้าง', element: 'ไฟ' },
    { name: 'อนุราธา', lord: 'saturn', meaning: 'ตัวเล็ก ความเข้มแข็ง', element: 'น้ำ' },
    { name: 'ชยา', lord: 'mercury', meaning: 'ความชัยชนะ ความแม่นยำ', element: 'น้ำ' },
    { name: 'มูลา', lord: 'ketu', meaning: 'ราก ความลึก', element: 'ลม' },
    { name: 'พูร์วาษฐา', lord: 'venus', meaning: 'แรก ความแข็งแรง', element: 'ไฟ' },
    { name: 'อุตราษฐา', lord: 'sun', meaning: 'ท้ายแรก ความเสริม', element: 'ไฟ' },
    { name: 'ศรวณะ', lord: 'moon', meaning: 'จุด ความตื่นสัมปชัญญะ', element: 'ลม' },
    { name: 'ธนิษฐา', lord: 'mars', meaning: 'ถมเนิน ความมั่นคง', element: 'ไฟ' },
    { name: 'สตภิษจ', lord: 'rahu', meaning: 'พร้อมเพื่อ ความฉลาด', element: 'อากาศ' },
    { name: 'พูร์วาภาทร', lord: 'jupiter', meaning: 'แรก ความสั้น', element: 'ไฟ' },
    { name: 'อุตรภาทร', lord: 'saturn', meaning: 'ท้ายแรก ความเสริม', element: 'ไฟ' },
    { name: 'เรวตี', lord: 'mercury', meaning: 'ช่วงสุดท้าย ความเหมาะสม', element: 'โลหะ' }
];

// ========================================
// 💎 ความสัมพันธ์ระหว่างดาว
// ========================================
const PLANET_RELATIONSHIPS = {
    friends: {
        sun: ['jupiter', 'mars'],
        moon: ['sun', 'mercury'],
        mars: ['sun', 'jupiter'],
        mercury: ['moon', 'venus'],
        jupiter: ['sun', 'mars'],
        venus: ['mercury', 'saturn'],
        saturn: ['venus', 'ketu'],
        rahu: ['venus'],
        ketu: ['saturn']
    },
    enemies: {
        sun: ['venus', 'saturn'],
        moon: ['mars'],
        mars: ['mercury'],
        mercury: ['moon'],
        jupiter: ['mercury'],
        venus: ['sun', 'mars'],
        saturn: ['sun', 'mars'],
        rahu: ['sun', 'moon'],
        ketu: ['sun', 'moon']
    }
};

// ========================================
// 📊 ธาตุ 5 ประการ (Panchamahabhuta)
// ========================================
const YEAR_ELEMENTS = {
    wood: 'ไม้ (มีชีวิต ยืดหยุ่น วัฒนา ความเจริญเติบโต)',
    fire: 'ไฟ (ร้อนแรง กระตือรือร้น พลังแรง ความคิด)',
    earth: 'ดิน (สถิร มั่นคง กลาง ความสมดุล)',
    metal: 'โลหะ (เข็ง เคร่งครัด คมชัด สั่นลั่น)',
    water: 'น้ำ (ไหลลื่น ปรับตัว เชื่อม ความเหมือนหมาย)'
};

// ========================================
// 🎯 วิเคราะห์ดาว 9 ดวง ตามวันเกิด
// ========================================
function getPlanetByDay(day) {
    const dayMap = {
        0: 'sun',      // วันอาทิตย์
        1: 'moon',     // วันจันทร์
        2: 'mars',     // วันอังคาร
        3: 'mercury',  // วันพุธ
        4: 'jupiter',  // วันพฤหัสบดี
        5: 'venus',    // วันศุกร์
        6: 'saturn'    // วันเสาร์
    };
    return dayMap[day];
}

// ========================================
// 🌾 ดึงข้อมูลธาตุตามปี
// ========================================
function getYearElement(year) {
    const year2000Based = year - 2000;
    const elementCode = year2000Based % 5;
    const elementKeys = ['metal', 'water', 'wood', 'fire', 'earth'];
    return YEAR_ELEMENTS[elementKeys[elementCode]];
}

// ========================================
// ⭐ ดึงข้อมูล Nakshatra
// ========================================
function getNakshatraByDate(day, month) {
    // สูตรคำนวณ Nakshatra แบบง่าย (อิงจากวันที่เดือน)
    const dayInYear = new Date(new Date().getFullYear(), month - 1, day).getDate();
    const nakshatraIndex = Math.floor((dayInYear - 1) / 13.34) % 27;
    return NAKSHATRAS[nakshatraIndex];
}

// ========================================
// 🔮 คำนวณโหราศาสตร์ไทยอย่างละเอียด
// ========================================
function calculateThaiAstrology() {
    const birthDate = document.getElementById('astrologyBirthDate').value;
    const resultDiv = document.getElementById('astrologyResult');

    if (!birthDate) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเกิด', 'warning');
        return;
    }

    const date = new Date(birthDate);
    const dayOfWeek = date.getDay();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // ดาวเกิดหลัก
    const mainPlanetKey = getPlanetByDay(dayOfWeek);
    const mainPlanet = PLANETS[mainPlanetKey];

    // Nakshatra
    const nakshatra = getNakshatraByDate(day, month);

    // ==== ส่วนที่ 1: แสดงดาวเกิดหลัก ====
    document.getElementById('mainPlanet').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">${mainPlanet.name}</div>
            <div style="color: #d4af37; font-size: 1.2rem; margin-bottom: 15px;">
                <strong>ความหมาย:</strong> ${mainPlanet.meaning}
            </div>
            <div style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <strong style="color: #d4af37;">📋 ลักษณะบุคลิก:</strong><br>
                <span style="color: #ccc; font-size: 0.95rem;">${mainPlanet.character}</span>
            </div>
            <div style="color: #888; font-size: 0.9rem; line-height: 1.8;">
                <strong>📅 วันเกิด:</strong> ${date.toLocaleDateString('th-TH')} (${['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'][dayOfWeek]})<br>
                <strong>⭐ ดาวเกิดหลัก:</strong> ${mainPlanet.thai}<br>
                <strong>🌙 Nakshatra:</strong> ${nakshatra.name} (ปกครองโดย ${PLANETS[nakshatra.lord].thai})<br>
                <strong>🌾 ธาตุประจำปี:</strong> ${getYearElement(year)}<br>
                <strong>📍 Exaltation:</strong> ${mainPlanet.exaltation} | <strong>Debilitation:</strong> ${mainPlanet.debilitation}
            </div>
        </div>
    `;

    // ==== ส่วนที่ 2: แสดงดาว 9 ดวง ====
    let nineStarsHTML = '';
    const nineStarKeys = Object.keys(PLANETS);
    nineStarKeys.forEach(key => {
        const planet = PLANETS[key];
        const isMain = key === mainPlanetKey ? 'border: 3px solid #d4af37;' : '';
        nineStarsHTML += `
            <div class="col-md-4 mb-3">
                <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; ${isMain}">
                    <strong style="color: ${planet.color};">${planet.name}</strong><br>
                    <small style="color: #aaa; font-size: 0.8rem;">
                        <strong>ความหมาย:</strong> ${planet.meaning}<br>
                        <strong>ลักษณะ:</strong> ${planet.character}<br>
                        <strong>อาชีพ:</strong> ${planet.career.join(', ')}<br>
                        <strong>Moolatrikona:</strong> ${planet.moolatrikona}
                    </small>
                </div>
            </div>
        `;
    });
    document.getElementById('nineStars').innerHTML = nineStarsHTML;

    // ==== ส่วนที่ 3: แสดงบ้าน 12 บ้าน ====
    let housesHTML = '';
    for (let i = 1; i <= 12; i++) {
        const house = HOUSES[i];
        housesHTML += `
            <div class="col-md-6 mb-3">
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #d4af37;">
                    <strong style="color: #d4af37;">${house.name}</strong><br>
                    <small style="color: #aaa; font-size: 0.85rem;">
                        ${house.meaning}<br>
                        <em>📌 ${house.planet_effects}</em>
                    </small>
                </div>
            </div>
        `;
    }
    document.getElementById('twelveHouses').innerHTML = housesHTML;

    // ==== ส่วนที่ 4: ลักษณะบุคคล ====
    const characterHTML = `
        <div style="padding: 15px; background: rgba(212, 175, 55, 0.1); border-left: 3px solid #d4af37; border-radius: 5px;">
            <p style="margin-bottom: 10px;">
                <strong>🔸 ดาว ${mainPlanet.thai} - ลักษณะบุคคลอย่างละเอียด:</strong>
            </p>
            <ul style="list-style: none; padding: 0; line-height: 2;">
                <li>🔸 <strong>ลักษณะ:</strong> ${mainPlanet.character}</li>
                <li>💪 <strong>จุดแข็ง:</strong> ${mainPlanet.strength}</li>
                <li>⚠️ <strong>จุดอ่อน:</strong> ${mainPlanet.weakness}</li>
                <li>💼 <strong>อาชีพเหมาะสม:</strong> ${mainPlanet.career.join(', ')}</li>
                <li>🤝 <strong>เข้ากันดีกับ:</strong> ${mainPlanet.compatibility}</li>
                <li>🎭 <strong>ตัวแทน:</strong> ${mainPlanet.property}</li>
            </ul>
        </div>
    `;
    document.getElementById('personalCharacter').innerHTML = characterHTML;

    // ==== ส่วนที่ 5: คำทำนาย ====
    const predictionHTML = `
        <div style="padding: 15px; background: rgba(40, 167, 69, 0.1); border-left: 3px solid #28a745; border-radius: 5px;">
            <p style="margin-bottom: 10px;">
                <strong>🔮 คำทำนายชะตากรรมตามหลักโหราศาสตร์ไทย:</strong>
            </p>
            <ul style="list-style: none; padding: 0; line-height: 1.9;">
                <li>🌟 <strong>ดาวเกิด:</strong> ${mainPlanet.thai} (${mainPlanet.meaning})</li>
                <li>🌟 <strong>Nakshatra (ดาวมังกร):</strong> ${nakshatra.name} - ${nakshatra.meaning}</li>
                <li>🌟 <strong>ธาตุประจำปี (ค.ศ. ${year}):</strong> ${getYearElement(year)}</li>
                <li>🌟 <strong>วันเกิด:</strong> ${['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'][dayOfWeek]}</li>
                <li>🌟 <strong>ตัวแทนลักษณะ:</strong> ${mainPlanet.property}</li>
                <li style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <strong>💝 สรุป:</strong> ท่านเป็นบุคคลที่มีลักษณะ <strong>${mainPlanet.character}</strong> มีความเหมาะสมในการทำงาน <strong>${mainPlanet.career[0]}</strong> หรือ <strong>${mainPlanet.career[1]}</strong> ตามความรู้สึกและความสนใจตนเอง ควรพัฒนาจุดแข็ง และแก้ไขจุดอ่อน
                </li>
            </ul>
        </div>
    `;
    document.getElementById('prediction').innerHTML = predictionHTML;

    // ==== ส่วนที่ 6: ธาตุและปีมงคล ====
    const elementHTML = `
        <div style="display: grid; gap: 10px;">
            <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 5px; border-left: 3px solid #d4af37;">
                <strong style="color: #d4af37;">🌾 ธาตุประจำปี (ค.ศ. ${year}):</strong><br>
                <span style="color: #ccc;">${getYearElement(year)}</span>
            </div>
            <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 5px; border-left: 3px solid #28a745;">
                <strong style="color: #28a745;">✨ ปีมงคล (5 ปีถัดไป):</strong><br>
                <span style="color: #ccc;">
                    ${year + 1}, ${year + 2}, ${year + 3}, ${year + 4}, ${year + 5}
                </span>
            </div>
            <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 5px; border-left: 3px solid #ff9800;">
                <strong style="color: #ff9800;">📌 คำแนะนำ:</strong><br>
                <span style="color: #ccc; font-size: 0.9rem;">
                    ✅ ศึกษาเพิ่มเติมจากนักโหราศาสตร์มืออาชีพ<br>
                    ✅ วิเคราะห์ความสัมพันธ์ดาวของท่านกับบ้าน 12 บ้าน<br>
                    ✅ พิจารณา Dasha (ระยะเวลาปกครอง) เพื่อพยากรณ์ที่แม่นยำ
                </span>
            </div>
        </div>
    `;
    document.getElementById('elementFortune').innerHTML = elementHTML;

    resultDiv.style.display = 'block';
}

// ========================================
// ✨ Export ให้ global
// ========================================
window.calculateThaiAstrology = calculateThaiAstrology;
window.PLANETS = PLANETS;
window.HOUSES = HOUSES;
window.NAKSHATRAS = NAKSHATRAS;
window.PLANET_RELATIONSHIPS = PLANET_RELATIONSHIPS;

