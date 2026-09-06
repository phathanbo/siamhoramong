/**
 * โหราศาสตร์ไทย - ดูดวงตามดาวเกิด (Thai Astrology System)
 * วิเคราะห์ดาว 9 ดวง และตำแหน่งใน 12 ภพเรือนชะตา
 * อ้างอิง: คัมภีร์โหราศาสตร์ไทยมาตรฐาน (สุริยยาตร์และพรหมชาติ)
 */

"use strict";

// ========================================
// 🌟 ดาว 9 ดวง (ระบบโหราศาสตร์ไทย)
// ========================================
const PLANETS = {
    sun: {
        name: '☀️ อาทิตย์ (สูรย์ - ๑)',
        thai: 'ดาวอาทิตย์',
        color: '#FF4D4D',
        meaning: 'ยศศักดิ์ อำนาจ บารมี เกียรติยศ ผู้นำ ความเชื่อมั่นในตนเอง',
        character: 'มีความเป็นผู้นำสูง สติปัญญาเฉียบแหลม มั่นใจในตนเอง รักเกียรติยศศักดิ์ศรี ใจกว้าง',
        strength: 'กล้าหาญ เด็ดขาด มีความรับผิดชอบสูง สง่างาม เป็นที่พึ่งพาของผู้อื่นได้ดี',
        weakness: 'ใจร้อน วู่วาม ทิฐิสูง หยิ่งทะนง ไม่ยอมก้มหัวให้ใคร',
        career: ['ข้าราชการระดับสูง', 'ผู้บริหารองค์กร', 'นักการเมือง', 'เจ้าของธุรกิจ', 'ผู้นำชุมชน'],
        compatibility: 'คู่มิตร: ดาวพฤหัสบดี (๕) | คู่สมพล: ดาวศุกร์ (๖) | คู่ธาตุ: ดาวเสาร์ (๗)',
        property: 'ตัวแทนแห่งเกียรติยศ ธาตุไฟกรด ทิศอีสาน',
        moolatrikona: 'ราศีสิงห์',
        exaltation: 'ราศีเมษ (มหาอุจจ์)',
        debilitation: 'ราศีตุลย์ (นิจ)'
    },
    moon: {
        name: '🌙 จันทร์ (โสม - ๒)',
        thai: 'ดาวจันทร์',
        color: '#F0E68C',
        meaning: 'เสน่ห์ ความอ่อนโยน จินตนาการ จิตใจ การบริการ ความเมตตา',
        character: 'อ่อนหวาน นุ่มนวล มีเสน่ห์ ช่างจินตนาการ รักความสงบและศิลปะ มีสัญชาตญาณการดูแล',
        strength: 'มีเมตตากรุณา เข้าอกเข้าใจผู้อื่น ประนีประนอมเก่ง วาจาไพเราะ เป็นที่รักใคร่ของผู้คน',
        weakness: 'อารมณ์อ่อนไหวแปรปรวนง่าย หูเบา ขี้ใจน้อย โลเลขาดความเด็ดขาด',
        career: ['งานบริการและการโรงแรม', 'พยาบาลและสาธารณสุข', 'งานศิลปะและความงาม', 'ธุรกิจอาหารและเครื่องดื่ม', 'ครูอาจารย์'],
        compatibility: 'คู่มิตร: ดาวพุธ (๔) | คู่สมพล: ดาวพฤหัสบดี (๕) | คู่ธาตุ: ดาวพฤหัสบดี (๕)',
        property: 'ตัวแทนแห่งเสน่ห์และรูปงาม ธาตุดินร่วน ทิศบูรพา',
        moolatrikona: 'ราศีพฤษภ',
        exaltation: 'ราศีพฤษภ (มหาอุจจ์)',
        debilitation: 'ราศีพิจิก (นิจ)'
    },
    mars: {
        name: '🔴 อังคาร (ภุมมะ - ๓)',
        thai: 'ดาวอังคาร',
        color: '#FF4500',
        meaning: 'ความกล้าหาญ การต่อสู้ พละกำลัง ความขยันขันแข็ง กีฬา ยานยนต์',
        character: 'กล้าหาญ ชาญชัย นักต่อสู้ ขยันขันแข็ง รักความยุติธรรม ชอบความท้าทายและการแข่งขัน',
        strength: 'มีความทรหดอดทน ทำงานจริงจัง ไม่ย่อท้อต่ออุปสรรค กล้าได้กล้าเสีย ว่องไว',
        weakness: 'มุทะลุ ดุดัน ใจร้อนชอบประจัญหน้า ขาดความยับยั้งชั่งใจ',
        career: ['ทหาร ตำรวจ', 'วิศวกร ช่างเทคนิค', 'นักกีฬา', 'ศัลยแพทย์', 'งานอุตสาหกรรมเครื่องจักร'],
        compatibility: 'คู่มิตร: ดาวราหู (๘) | คู่สมพล: ดาวศุกร์ (๖) | คู่ธาตุ: ดาวพุธ (๔)',
        property: 'ตัวแทนแห่งความกล้าหาญ ธาตุลมกรด ทิศอาคเนย์',
        moolatrikona: 'ราศีเมษ',
        exaltation: 'ราศีมังกร (มหาอุจจ์)',
        debilitation: 'ราศีกรกฎ (นิจ)'
    },
    mercury: {
        name: '🟢 พุธ (พุธ - ๔)',
        thai: 'ดาวพุธ',
        color: '#2ECC71',
        meaning: 'วาจา สติปัญญา การสื่อสาร การพาณิชย์ เอกสารสัญญา ไหวพริบ',
        character: 'ช่างเจรจาพาที มีวาทศิลป์ ไหวพริบปฏิภาณเฉลียวฉลาด เรียนรู้เร็ว ชอบการสื่อสารและค้าขาย',
        strength: 'พูดจาจูงใจคนเก่ง มีปฏิภาณทางภาษา ประสานงานยอดเยี่ยม ปรับตัวเข้ากับทุกสังคมได้ดี',
        weakness: 'พูดมากเกินไป ขี้หลงขี้ลืม จับจด ทำหลายอย่างพร้อมกันจนไม่เสร็จสักอย่าง',
        career: ['นักสื่อสารมวลชน พิธีกร', 'นักเขียน นักข่าว', 'พ่อค้า นักการตลาด', 'นักการทูตและล่าม', 'นักบัญชี'],
        compatibility: 'คู่มิตร: ดาวจันทร์ (๒) | คู่สมพล: ดาวอาทิตย์ (๑) | คู่ธาตุ: ดาวอังคาร (๓)',
        property: 'ตัวแทนแห่งสติปัญญาและวาจา ธาตุน้ำซึมซับ ทิศทักษิณ',
        moolatrikona: 'ราศีกันย์',
        exaltation: 'ราศีกันย์ (มหาอุจจ์)',
        debilitation: 'ราศีมีน (นิจ)'
    },
    jupiter: {
        name: '🟠 พฤหัสบดี (ครู - ๕)',
        thai: 'ดาวพฤหัสบดี',
        color: '#F39C12',
        meaning: 'คุณธรรม ปัญญา ความรู้ กฎหมาย ศาสนา โชคลาภ ความสำเร็จอันบริสุทธิ์',
        character: 'มีคุณธรรม สติปัญญาเป็นเลิศ ใฝ่รู้ใฝ่เรียน มีเมตตาสูง สุขุมรอบคอบ ยึดมั่นในความถูกต้อง',
        strength: 'มีปัญญาญาณลึกซึ้ง เป็นที่ปรึกษาและครูบาอาจารย์ที่ดี ผู้ใหญ่ให้ความเคารพนับถือและอุปถัมภ์',
        weakness: 'เจ้าระเบียบ จู้จี้ ยึดติดตำราหรือหลักการมากเกินไปจนดื้อเงียบ',
        career: ['ครูบาอาจารย์ นักวิชาการ', 'แพทย์ เภสัชกร', 'ผู้พิพากษา ทนายความ', 'นักบวช นักการศาสนา', 'ที่ปรึกษาองค์กร'],
        compatibility: 'คู่มิตร: ดาวอาทิตย์ (๑) | คู่สมพล: ดาวจันทร์ (๒) | คู่ธาตุ: ดาวจันทร์ (๒)',
        property: 'ตัวแทนแห่งปัญญาบริสุทธิ์ ธาตุดินแข็ง ทิศประจิม',
        moolatrikona: 'ราศีธนู',
        exaltation: 'ราศีกรกฎ (มหาอุจจ์)',
        debilitation: 'ราศีมังกร (นิจ)'
    },
    venus: {
        name: '🔵 ศุกร์ (ศุกร - ๖)',
        thai: 'ดาวศุกร์',
        color: '#3498DB',
        meaning: 'ความรัก ความงาม ศิลปะ โภคทรัพย์ ความสุขสำราญ เสน่ห์ดึงดูด',
        character: 'รักสวยรักงาม มีรสนิยมสูง ชื่นชอบศิลปะ ดนตรี ความรื่นรมย์ มีเสน่ห์ดึงดูดใจผู้คน',
        strength: 'มีพรสวรรค์ด้านความคิดสร้างสรรค์ การเงินการค้าคล่องตัว เข้าสังคมเก่ง มองโลกในแง่ดี',
        weakness: 'รักความสบาย ฟุ่มเฟือย หลงใหลในรูป รส กลิ่น เสียง และกามารมณ์ได้ง่าย',
        career: ['ศิลปิน ดารา นักร้อง', 'นักออกแบบ ดีไซเนอร์', 'ธุรกิจแฟชั่น เครื่องประดับ', 'นักการเงินและการธนาคาร', 'สปาและความงาม'],
        compatibility: 'คู่มิตร: ดาวเสาร์ (๗) | คู่สมพล: ดาวอังคาร (๓) | คู่ธาตุ: ดาวราหู (๘)',
        property: 'ตัวแทนแห่งโภคทรัพย์และศิลปะ ธาตุน้ำทะเล ทิศอุดร',
        moolatrikona: 'ราศีตุลย์',
        exaltation: 'ราศีมีน (มหาอุจจ์)',
        debilitation: 'ราศีกันย์ (นิจ)'
    },
    saturn: {
        name: '🟣 เสาร์ (โสระ - ๗)',
        thai: 'ดาวเสาร์',
        color: '#9B59B6',
        meaning: 'ความอดทน การรอคอย ความรับผิดชอบ ความมั่นคง อสังหาริมทรัพย์ ของโบราณ',
        character: 'สุขุมเยือกเย็น หนักแน่น อดทนเป็นเลิศ สันโดษ คิดการณ์ไกล ระมัดระวังตัวสูง',
        strength: 'มีความรับผิดชอบสูง ละเอียดรอบคอบ ทนต่อแรงกดดันได้ดีเยี่ยม สร้างความสำเร็จระยะยาว',
        weakness: 'คิดมาก วิตกกังวล เครียดง่าย เจ้าคิดเจ้าแค้น ระแวงคนรอบข้าง',
        career: ['ธุรกิจอสังหาริมทรัพย์ ที่ดิน', 'การเกษตรกรรมและฟาร์ม', 'ผู้รับเหมาก่อสร้าง', 'อุตสาหกรรมเหมืองแร่', 'นักวิจัยประวัติศาสตร์'],
        compatibility: 'คู่มิตร: ดาวศุกร์ (๖) | คู่สมพล: ดาวราหู (๘) | คู่ธาตุ: ดาวอาทิตย์ (๑)',
        property: 'ตัวแทนแห่งความอดทน ธาตุไฟสุมขอน ทิศหรดี',
        moolatrikona: 'ราศีกุมภ์',
        exaltation: 'ราศีตุลย์ (มหาอุจจ์)',
        debilitation: 'ราศีเมษ (นิจ)'
    },
    rahu: {
        name: '⬛ ราหู (อสุรินทร์ - ๘)',
        thai: 'พระราหู',
        color: '#34495E',
        meaning: 'ความกล้าเสี่ยง การพลิกแพลง เล่ห์เหลี่ยม ไหวพริบ เทคโนโลยี ต่างประเทศ เงามายา',
        character: 'ใจกล้า บ้าบิ่น เล่ห์เหลี่ยมแพรวพราว ทันคน พลิกแพลงสถานการณ์เก่ง มีไหวพริบในการเสี่ยงโชค',
        strength: 'แก้ปัญหาเฉพาะหน้าได้ฉับไว ใจใหญ่ มีพรรคพวกบริวารมาก กว้างขวางในสังคม',
        weakness: 'ลุ่มหลงมัวเมาง่าย มุทะลุ ขาดความรอบคอบ ชอบทำอะไรนอกกรอบหรือเสี่ยงอันตราย',
        career: ['ธุรกิจออนไลน์ การค้าระหว่างประเทศ', 'งานบันเทิงและสถานบันเทิง', 'นักสืบ การข่าวกรอง', 'เทคโนโลยี นวัตกรรมไอที', 'การลงทุนเสี่ยงโชค'],
        compatibility: 'คู่มิตร: ดาวอังคาร (๓) | คู่สมพล: ดาวเสาร์ (๗) | คู่ธาตุ: ดาวศุกร์ (๖)',
        property: 'ตัวแทนแห่งเงามายาและไหวพริบ ธาตุลมพายุ ทิศพายัพ',
        moolatrikona: 'ราศีกุมภ์',
        exaltation: 'ราศีพิจิก (มหาอุจจ์)',
        debilitation: 'ราศีพฤษภ (นิจ)'
    },
    ketu: {
        name: '⚪ เกตุ (พระเกตุ - ๙)',
        thai: 'ดาวพระเกตุ',
        color: '#BDC3C7',
        meaning: 'สิ่งศักดิ์สิทธิ์ ลางสังหรณ์ ญาณหยั่งรู้ การหลุดพ้น การเดินทางไกล พลังลี้ลับ',
        character: 'มีลางสังหรณ์แม่นยำ ผูกพันกับสิ่งศักดิ์สิทธิ์และศาสนา ชอบของโบราณ โหราศาสตร์ และการปฏิบัติธรรม',
        strength: 'มีสัมผัสที่หก แคล้วคลาดปลอดภัย มีบารมีสิ่งศักดิ์สิทธิ์คุ้มครอง มักรอดพ้นวิกฤตได้อย่างปาฏิหาริย์',
        weakness: 'อารมณ์ผันแปร เข้าใจยาก ความคิดล้ำยุคหรือแปลกแยกจากคนทั่วไป',
        career: ['นักโหราศาสตร์ นักพยากรณ์', 'พระภิกษุ นักบวช ผู้ปฏิบัติธรรม', 'นักโบราณคดี ของขลังวัตถุมงคล', 'แพทย์แผนโบราณและการบำบัดจิต'],
        compatibility: 'เข้าได้กับทุกดาวโดยมีผลเสริมพลังทางจิตวิญญาณ',
        property: 'ตัวแทนแห่งญาณวิถีและสิ่งศักดิ์สิทธิ์ วิญญาณธาตุ ทิศศูนย์กลาง',
        moolatrikona: 'ราศีมีน',
        exaltation: 'ราศีธนู',
        debilitation: 'ราศีเมถุน'
    }
};

// ========================================
// 🏠 12 ภพเรือนชะตา (12 Bhava Houses)
// ========================================
const HOUSES = {
    1: {
        name: 'ภพที่ ๑ : ตนุ (ลัคนา)',
        thai: 'ตนุ',
        meaning: 'ตัวตน บุคลิกภาพ รูปร่าง จิตใจ วาสนากำเนิด สุขภาพโดยรวม',
        planet_effects: 'บ่งบอกตัวตน วาสนา และลักษณะทางกายภาพ'
    },
    2: {
        name: 'ภพที่ ๒ : กฎุมภะ',
        thai: 'กฎุมภะ',
        meaning: 'ทรัพย์สมบัติ เงินทอง การหารายได้ ทรัพย์สินที่หามาได้ด้วยตนเอง',
        planet_effects: 'บ่งบอกฐานะการเงินและแหล่งที่มาของรายได้'
    },
    3: {
        name: 'ภพที่ ๓ : สหัชชะ',
        thai: 'สหัชชะ',
        meaning: 'พี่น้อง เพื่อนฝูง มิตรสหาย สังคมใกล้ชิด การเดินทางระยะใกล้ การสื่อสาร',
        planet_effects: 'บ่งบอกความสัมพันธ์กับมิตรสหายและการติดต่อสื่อสาร'
    },
    4: {
        name: 'ภพที่ ๔ : พันธุ',
        thai: 'พันธุ',
        meaning: 'วงศ์ตระกูล ญาติพี่น้อง มารดา บ้าน ที่อยู่อาศัย ที่ดิน ยานพาหนะ',
        planet_effects: 'บ่งบอกความมั่นคงของครอบครัวและอสังหาริมทรัพย์'
    },
    5: {
        name: 'ภพที่ ๕ : ปุตตะ',
        thai: 'ปุตตะ',
        meaning: 'บุตร บริวาร ผู้ใต้บังคับบัญชา ความคิดสร้างสรรค์ โชคลาภการเสี่ยง ความรักใหม่',
        planet_effects: 'บ่งบอกโชคลาภ บุตรบริวาร และการริเริ่มสิ่งใหม่'
    },
    6: {
        name: 'ภพที่ ๖ : อริ',
        thai: 'อริ',
        meaning: 'อุปสรรค ศัตรู ปัญหา หนี้สิน โรคภัยไข้เจ็บ การแข่งขัน การฝ่าฟัน',
        planet_effects: 'บ่งบอกอุปสรรค ศัตรูคู่แข่ง และโรคประจำตัว'
    },
    7: {
        name: 'ภพที่ ๗ : ปัตนิ',
        thai: 'ปัตนิ',
        meaning: 'คู่ครอง คู่ชีวิต หุ้นส่วน คู่สัญญา ความสัมพันธ์ระยะยาว การทำสัญญา',
        planet_effects: 'บ่งบอกคู่ครอง ลักษณะของคู่ และการร่วมทุนธุรกิจ'
    },
    8: {
        name: 'ภพที่ ๘ : มรณะ',
        thai: 'มรณะ',
        meaning: 'การสูญเสีย การพลัดพราก มรดก สิ่งลี้ลับ การเจ็บป่วยเรื้อรัง การเดินทางไกลต่างแดน',
        planet_effects: 'บ่งบอกสุขภาพเรื้อรัง มรดก และการเปลี่ยนแปลงพลิกผัน'
    },
    9: {
        name: 'ภพที่ ๙ : ศุภะ',
        thai: 'ศุภะ',
        meaning: 'ความเจริญก้าวหน้า คุณธรรม บิดา การศึกษาระดับสูง โชคลาภ เกียรติยศชื่อเสียง',
        planet_effects: 'บ่งบอกความสำเร็จ ความก้าวหน้าในชีวิต และผู้ใหญ่อุปถัมภ์'
    },
    10: {
        name: 'ภพที่ ๑๐ : กัมมะ',
        thai: 'กัมมะ',
        meaning: 'การงาน อาชีพ ภาระหน้าที่ ตำแหน่งหน้าที่ ความรับผิดชอบในสังคม',
        planet_effects: 'บ่งบอกสายงาน ความสำเร็จในหน้าที่ และสถานะทางสังคม'
    },
    11: {
        name: 'ภพที่ ๑๑ : ลาภะ',
        thai: 'ลาภะ',
        meaning: 'โชคลาภ ความสำเร็จ ผลกำไร รายได้เสริม มิตรภาพที่เกื้อหนุน ความสมหวัง',
        planet_effects: 'บ่งบอกลาภลอย ผลตอบแทน และความสำเร็จอันพึงได้'
    },
    12: {
        name: 'ภพที่ ๑๒ : วินาศ',
        thai: 'วินาศ',
        meaning: 'ความเสียหาย ความลับ การถูกหักหลัง ความสูญเปล่า การปลีกวิเวก สิ่งที่มองไม่เห็น',
        planet_effects: 'บ่งบอกสิ่งที่ต้องระวัง ศัตรูลับ และการทำงานเบื้องหลัง'
    }
};

// ========================================
// 🌙 ๒๗ ฤกษ์นักษัตร (27 Nakshatras)
// ========================================
const NAKSHATRAS = [
    { name: 'อัศวินี (ทลิทโทฤกษ์)', lord: 'ketu', meaning: 'การเริ่มต้นอย่างรวดเร็ว ความคล่องแคล่ว', element: 'ธาตุไฟ' },
    { name: 'ภรณี (มหัทธโณฤกษ์)', lord: 'venus', meaning: 'ความหนักแน่น ภาระหน้าที่ ความมั่งคั่ง', element: 'ธาตุไฟ' },
    { name: 'กฤตติกา (โจโรฤกษ์)', lord: 'sun', meaning: 'ความเฉียบคม อำนาจเด็ดขาด การตัดสละ', element: 'ธาตุไฟ' },
    { name: 'โรหิณี (ภูมิปาโลฤกษ์)', lord: 'moon', meaning: 'ความงอกงาม อุดมสมบูรณ์ ความมีเสน่ห์', element: 'ธาตุดิน' },
    { name: 'มฤคศิระ (เทศาตรีฤกษ์)', lord: 'mars', meaning: 'การแสวงหา ท่องเที่ยว ความกระตือรือร้น', element: 'ธาตุน้ำ' },
    { name: 'อารทรา (เทวีฤกษ์)', lord: 'mercury', meaning: 'ความพยายาม อดทนฝ่าฟัน การชำระล้าง', element: 'ธาตุน้ำ' },
    { name: 'ปุนัพสุ (ราชาฤกษ์)', lord: 'jupiter', meaning: 'การฟื้นฟู ความบริสุทธิ์ การกลับคืนถิ่น', element: 'ธาตุน้ำ' },
    { name: 'ปุษยะ (ทลิทโทฤกษ์)', lord: 'saturn', meaning: 'ความเจริญรุ่งเรือง คุณธรรมสูง การอบรมเลี้ยงดู', element: 'ธาตุน้ำ' },
    { name: 'อาศเลษา (มหัทธโณฤกษ์)', lord: 'mercury', meaning: 'ปรีชาญาณลึกซึ้ง ความลึกลับ ไหวพริบป้องกันตัว', element: 'ธาตุน้ำ' },
    { name: 'มาฆะ (โจโรฤกษ์)', lord: 'ketu', meaning: 'เกียรติยศ อำนาจราชศักดิ์ บารมีบรรพชน', element: 'ธาตุไฟ' },
    { name: 'บุรพผลคุนี (ภูมิปาโลฤกษ์)', lord: 'venus', meaning: 'ความสุขสำราญ โชคลาภ ความรักและครอบครัว', element: 'ธาตุไฟ' },
    { name: 'อุตรผลคุนี (เทศาตรีฤกษ์)', lord: 'sun', meaning: 'มิตรภาพ การช่วยเหลืออุปถัมภ์ ความสำเร็จมั่นคง', element: 'ธาตุไฟ' },
    { name: 'หัสตะ (เทวีฤกษ์)', lord: 'moon', meaning: 'ฝีมือประณีต ปัญญา การค้าขาย ความสามารถรอบด้าน', element: 'ธาตุดิน' },
    { name: 'จิตรา (ราชาฤกษ์)', lord: 'mars', meaning: 'ความวิจิตรตระการตา ความคิดสร้างสรรค์ ศิลปกรรม', element: 'ธาตุไฟ' },
    { name: 'สวาตี (ทลิทโทฤกษ์)', lord: 'rahu', meaning: 'อิสรภาพ ความเป็นตัวของตัวเอง การค้าขายคล่องตัว', element: 'ธาตุลม' },
    { name: 'วิสาขา (มหัทธโณฤกษ์)', lord: 'jupiter', meaning: 'ความมุ่งมั่นสู่เป้าหมาย ความสำเร็จในกิจการใหญ่', element: 'ธาตุไฟ' },
    { name: 'อนุราธะ (โจโรฤกษ์)', lord: 'saturn', meaning: 'มิตรภาพ ความจงรักภักดี ความสำเร็จในต่างแดน', element: 'ธาตุน้ำ' },
    { name: 'เชษฐา (ภูมิปาโลฤกษ์)', lord: 'mercury', meaning: 'ความเป็นผู้นำ เกียรติยศ การปกป้องคุ้มครอง', element: 'ธาตุน้ำ' },
    { name: 'มูละ (เทศาตรีฤกษ์)', lord: 'ketu', meaning: 'รากฐาน การค้นคว้าลึกซึ้ง การเปลี่ยนแปลงสู่สิ่งใหม่', element: 'ธาตุลม' },
    { name: 'ปุรพอาษาฒ (เทวีฤกษ์)', lord: 'venus', meaning: 'ชัยชนะ ความบริสุทธิ์ใจ ความน่าเชื่อถือ', element: 'ธาตุน้ำ' },
    { name: 'อุตตราษาฒ (ราชาฤกษ์)', lord: 'sun', meaning: 'เกียรติยศที่ยั่งยืน ชัยชนะที่ไร้ข้อกังขา', element: 'ธาตุดิน' },
    { name: 'ศรวณะ (ทลิทโทฤกษ์)', lord: 'moon', meaning: 'การฟัง การเรียนรู้ การศึกษา ปัญญาบารมี', element: 'ธาตุลม' },
    { name: 'ธนิษฐา (มหัทธโณฤกษ์)', lord: 'mars', meaning: 'ความมั่งคั่ง ดนตรี จังหวะ ความกล้าหาญ', element: 'ธาตุไฟ' },
    { name: 'ศตภิษัช (โจโรฤกษ์)', lord: 'rahu', meaning: 'การรักษาเยียวยา วิทยาการล้ำหน้า ความลึกลับ', element: 'ธาตุลม' },
    { name: 'ปุรพภัทรบท (ภูมิปาโลฤกษ์)', lord: 'jupiter', meaning: 'ปัญญาสูง การเสียสละเพื่อส่วนรวม ความเพียร', element: 'ธาตุไฟ' },
    { name: 'อุตรภัทรบท (เทศาตรีฤกษ์)', lord: 'saturn', meaning: 'ความสงบเยือกเย็น สมาธิ การควบคุมตนเอง', element: 'ธาตุน้ำ' },
    { name: 'เรวดี (เทวีฤกษ์)', lord: 'mercury', meaning: 'ความสมบูรณ์พูนสุข การเดินทางปลอดภัย ความเมตตา', element: 'ธาตุน้ำ' }
];

// ========================================
// 📊 ธาตุ 5 ประการ (โหราศาสตร์เบญจธาตุ)
// ========================================
const YEAR_ELEMENTS = {
    wood: 'ธาตุไม้ (เจริญงอกงาม ยืดหยุ่น มีเมตตา เปี่ยมด้วยคุณธรรม)',
    fire: 'ธาตุไฟ (ร้อนแรง กระตือรือร้น มีพลังขับเคลื่อน สว่างไสว)',
    earth: 'ธาตุดิน (มั่นคง หนักแน่น ซื่อสัตย์ อดทน กตัญญู)',
    metal: 'ธาตุโลหะ/ทอง (เด็ดขาด เข้มแข็ง มีระเบียบวินัย ยุติธรรม)',
    water: 'ธาตุน้ำ (ลื่นไหล ปรับตัวเก่ง มีสติปัญญา รอบรู้ อุดมสมบูรณ์)'
};

// ========================================
// 🎯 วิเคราะห์ดาวเกิดหลักตามวันเกิด
// ========================================
function getPlanetByDay(day) {
    const dayMap = {
        0: 'sun',      // วันอาทิตย์ (๑)
        1: 'moon',     // วันจันทร์ (๒)
        2: 'mars',     // วันอังคาร (๓)
        3: 'mercury',  // วันพุธ (๔)
        4: 'jupiter',  // วันพฤหัสบดี (๕)
        5: 'venus',    // วันศุกร์ (๖)
        6: 'saturn'    // วันเสาร์ (๗)
    };
    return dayMap[day] || 'sun';
}

function getYearElement(year) {
    const yearAD = year > 2400 ? year - 543 : year;
    const elementCode = ((yearAD - 1900) % 5 + 5) % 5;
    const elementKeys = ['metal', 'water', 'wood', 'fire', 'earth'];
    return YEAR_ELEMENTS[elementKeys[elementCode]] || YEAR_ELEMENTS['earth'];
}

function getNakshatraByDate(day, month) {
    const nakshatraIndex = Math.floor((((month - 1) * 30) + day) / 13.34) % 27;
    return NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
}

// ========================================
// 🔮 คำนวณโหราศาสตร์ไทยอย่างละเอียด
// ========================================
function calculateThaiAstrology() {
    const birthDateInput = document.getElementById('astrologyBirthDate');
    const resultDiv = document.getElementById('astrologyResult');

    if (!birthDateInput || !birthDateInput.value) {
        if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเกิดของท่าน', 'warning');
        else alert('กรุณาระบุวันเกิดของท่าน');
        return;
    }

    const date = new Date(birthDateInput.value);
    const dayOfWeek = date.getDay();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const mainPlanetKey = getPlanetByDay(dayOfWeek);
    const mainPlanet = PLANETS[mainPlanetKey];
    const nakshatra = getNakshatraByDate(day, month);

    const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

    // ==== ส่วนที่ 1: แสดงดาวเกิดหลัก ====
    const mainPlanetEl = document.getElementById('mainPlanet');
    if (mainPlanetEl) {
        mainPlanetEl.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 3.5rem; margin-bottom: 10px;">${mainPlanet.name}</div>
                <div style="color: #f1d06e; font-size: 1.25rem; font-weight: bold; margin-bottom: 15px;">
                    ความหมาย : ${mainPlanet.meaning}
                </div>
                <div style="background: rgba(241, 208, 110, 0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(241, 208, 110, 0.3); margin-bottom: 15px; text-align: left;">
                    <strong style="color: #f1d06e;">📋 อุปนิสัยและบุคลิกภาพกำเนิด:</strong><br>
                    <span style="color: #e2e8f0; font-size: 1rem; line-height: 1.8;">${mainPlanet.character}</span>
                </div>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 2; text-align: left;">
                    <strong>📅 วันเกิด :</strong> ${thaiDays[dayOfWeek]} ที่ ${day}/${month}/${year + 543} (พ.ศ.)<br>
                    <strong>⭐ ดาวเกิดหลัก :</strong> ${mainPlanet.thai}<br>
                    <strong>🌙 ฤกษ์นักษัตร :</strong> ${nakshatra.name} (ครองโดย ${PLANETS[nakshatra.lord]?.thai || 'ดาวเกตุ'})<br>
                    <strong>🌾 เบญจธาตุประจำปี :</strong> ${getYearElement(year)}<br>
                    <strong>📍 มหาอุจจ์ :</strong> ${mainPlanet.exaltation} | <strong>นิจ (ต่ำสุด) :</strong> ${mainPlanet.debilitation}
                </div>
            </div>
        `;
    }

    // ==== ส่วนที่ 2: แสดงดาว 9 ดวง ====
    const nineStarsEl = document.getElementById('nineStars');
    if (nineStarsEl) {
        let nineStarsHTML = '';
        Object.keys(PLANETS).forEach(key => {
            const planet = PLANETS[key];
            const isMain = key === mainPlanetKey;
            nineStarsHTML += `
                <div class="col-md-4 mb-3">
                    <div style="padding: 16px; background: rgba(13, 21, 39, 0.85); border-radius: 12px; border: 1.5px solid ${isMain ? '#f1d06e' : 'rgba(241, 208, 110, 0.25)'}; height: 100%;">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong style="color: ${planet.color}; font-size: 1.1rem;">${planet.name}</strong>
                            ${isMain ? '<span class="badge bg-gold text-dark fw-bold">ดาวประจำตัว</span>' : ''}
                        </div>
                        <small style="color: #e2e8f0; font-size: 0.85rem; line-height: 1.7; display: block;">
                            <strong class="text-gold">ความหมาย :</strong> ${planet.meaning}<br>
                            <strong class="text-gold">จุดเด่น :</strong> ${planet.strength}<br>
                            <strong class="text-gold">อาชีพเด่น :</strong> ${planet.career.slice(0, 3).join(', ')}<br>
                            <strong class="text-gold">เกษตรเรือนใน :</strong> ${planet.moolatrikona}
                        </small>
                    </div>
                </div>
            `;
        });
        nineStarsEl.innerHTML = nineStarsHTML;
    }

    // ==== ส่วนที่ 3: แสดง 12 ภพเรือนชะตา ====
    const twelveHousesEl = document.getElementById('twelveHouses');
    if (twelveHousesEl) {
        let housesHTML = '';
        for (let i = 1; i <= 12; i++) {
            const house = HOUSES[i];
            housesHTML += `
                <div class="col-md-6 mb-3">
                    <div style="padding: 14px; background: rgba(13, 21, 39, 0.85); border-radius: 10px; border-left: 4px solid #f1d06e; border: 1px solid rgba(241, 208, 110, 0.2);">
                        <strong style="color: #f1d06e; font-size: 1.05rem;">${house.name}</strong><br>
                        <small style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.7;">
                            ${house.meaning}<br>
                            <em class="text-gold-light">📌 ${house.planet_effects}</em>
                        </small>
                    </div>
                </div>
            `;
        }
        twelveHousesEl.innerHTML = housesHTML;
    }

    // ==== ส่วนที่ 4: ลักษณะบุคคล ====
    const charEl = document.getElementById('personalCharacter');
    if (charEl) {
        charEl.innerHTML = `
            <div style="padding: 18px; background: rgba(13, 21, 39, 0.85); border-left: 4px solid #f1d06e; border-radius: 12px; border: 1px solid rgba(241, 208, 110, 0.25);">
                <h5 class="text-gold mb-3">
                    <i class="fas fa-user-shield mr-2"></i>วิเคราะห์อัตลักษณ์ประจำดาว ${mainPlanet.thai} :
                </h5>
                <ul style="list-style: none; padding: 0; line-height: 2.1; color: #e2e8f0; margin-bottom: 0;">
                    <li>🔹 <strong class="text-gold">ลักษณะนิสัย :</strong> ${mainPlanet.character}</li>
                    <li>💪 <strong class="text-success">จุดแข็งส่งเสริมวาสนา :</strong> ${mainPlanet.strength}</li>
                    <li>⚠️ <strong class="text-warning">ข้อควรระวัง/จุดท้าทาย :</strong> ${mainPlanet.weakness}</li>
                    <li>💼 <strong class="text-gold">สายอาชีพที่ถูกโฉลก :</strong> ${mainPlanet.career.join(', ')}</li>
                    <li>🤝 <strong class="text-info">ดาวคู่มิตรและเกื้อหนุน :</strong> ${mainPlanet.compatibility}</li>
                    <li>🎭 <strong class="text-gold">ธาตุกำเนิดและทิศมงคล :</strong> ${mainPlanet.property}</li>
                </ul>
            </div>
        `;
    }

    // ==== ส่วนที่ 5: คำทำนายชะตากรรม ====
    const predEl = document.getElementById('prediction');
    if (predEl) {
        predEl.innerHTML = `
            <div style="padding: 18px; background: rgba(13, 21, 39, 0.85); border-left: 4px solid #2ecc71; border-radius: 12px; border: 1px solid rgba(46, 204, 113, 0.25);">
                <h5 class="text-success mb-3">
                    <i class="fas fa-scroll mr-2"></i>มหาพยากรณ์ชะตาชีวิตตามหลักโหราศาสตร์ไทย :
                </h5>
                <ul style="list-style: none; padding: 0; line-height: 2; color: #e2e8f0;">
                    <li>🌟 <strong class="text-gold">ดาวประจำตัว :</strong> ${mainPlanet.thai} (${mainPlanet.meaning})</li>
                    <li>🌟 <strong class="text-gold">ฤกษ์นักษัตรกำเนิด :</strong> ${nakshatra.name} - ${nakshatra.meaning}</li>
                    <li>🌟 <strong class="text-gold">ธาตุประจำปีเกิด :</strong> ${getYearElement(year)}</li>
                    <li style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed rgba(241, 208, 110, 0.3);">
                        <strong class="text-gold">💡 สรุปภาพรวมชะตาชีวิต :</strong> ท่านเป็นบุคคลที่มีพลังอำนาจและอุปนิสัยเด่นตาม <strong>${mainPlanet.thai}</strong> มีความเหมาะสมในการประกอบวิชาชีพทางด้าน <strong>${mainPlanet.career[0]}</strong> หรือ <strong>${mainPlanet.career[1]}</strong> อย่างยิ่ง หากมุ่งมั่นพัฒนาจุดแข็ง และใช้สติระมัดระวังจุดท้าทาย จะสามารถสร้างฐานะและเกียรติยศได้อย่างมั่นคง
                    </li>
                </ul>
            </div>
        `;
    }

    // ==== ส่วนที่ 6: ธาตุและปีมงคล ====
    const eleEl = document.getElementById('elementFortune');
    if (eleEl) {
        eleEl.innerHTML = `
            <div style="display: grid; gap: 12px;">
                <div style="padding: 14px; background: rgba(13, 21, 39, 0.85); border-radius: 8px; border-left: 4px solid #f1d06e; border: 1px solid rgba(241, 208, 110, 0.2);">
                    <strong style="color: #f1d06e;">🌾 เบญจธาตุประจำปี (พ.ศ. ${year + 543}) :</strong><br>
                    <span style="color: #e2e8f0;">${getYearElement(year)}</span>
                </div>
                <div style="padding: 14px; background: rgba(13, 21, 39, 0.85); border-radius: 8px; border-left: 4px solid #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2);">
                    <strong style="color: #2ecc71;">✨ ปีมงคลเกื้อหนุน (๕ ปีถัดไป) :</strong><br>
                    <span style="color: #e2e8f0;">
                        พ.ศ. ${year + 544}, พ.ศ. ${year + 545}, พ.ศ. ${year + 546}, พ.ศ. ${year + 547}, พ.ศ. ${year + 548}
                    </span>
                </div>
                <div style="padding: 14px; background: rgba(13, 21, 39, 0.85); border-radius: 8px; border-left: 4px solid #3498db; border: 1px solid rgba(52, 152, 219, 0.2);">
                    <strong style="color: #3498db;">📌 ข้อคิดเสริมบารมี :</strong><br>
                    <span style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.8;">
                        • หมั่นสวดมนต์บูชาเทวดาประจำวันเกิดเพื่อเสริมสิริมงคล<br>
                        • เสริมดวงด้วยการทำบุญตามทิศมงคลและสวมใส่เครื่องแต่งกายตามวรรณะสีดาวประจำตัว<br>
                        • ประกอบสัมมาอาชีวะด้วยความซื่อสัตย์สุจริตจะช่วยหนุนนำให้ดวงชะตารุ่งเรืองไม่ตกต่ำ
                    </span>
                </div>
            </div>
        `;
    }

    if (resultDiv) {
        resultDiv.style.opacity = '0';
        resultDiv.style.display = 'block';
        setTimeout(() => {
            resultDiv.style.transition = 'opacity 0.6s ease-in-out';
            resultDiv.style.opacity = '1';
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// ========================================
// 🖼️ ระบบสร้างรูปภาพส่งออก (Canvas Image Export)
// ========================================
async function downloadThaiAstrologyImage(e) {
    const birthDateInput = document.getElementById('astrologyBirthDate');
    if (!birthDateInput || !birthDateInput.value) {
        if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเกิดก่อนบันทึกภาพ', 'warning');
        else alert('กรุณาระบุวันเกิดก่อนบันทึกภาพ');
        return;
    }

    const btn = e ? e.currentTarget : null;
    let originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังสร้างภาพความละเอียดสูง...';
        btn.disabled = true;
    }

    try {
        const date = new Date(birthDateInput.value);
        const dayOfWeek = date.getDay();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const mainPlanetKey = getPlanetByDay(dayOfWeek);
        const mainPlanet = PLANETS[mainPlanetKey];
        const nakshatra = getNakshatraByDate(day, month);
        const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3600;
        const ctx = canvas.getContext('2d');

        await document.fonts.ready;

        const drawContent = (isMeasure = false) => {
            let cy = 90;
            const cx = 80;
            const maxW = width - 160;

            if (!isMeasure) {
                let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#0c1424');
                grad.addColorStop(0.3, '#14223c');
                grad.addColorStop(0.7, '#0d1628');
                grad.addColorStop(1, '#080d1a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, canvas.height);

                ctx.strokeStyle = '#f1d06e';
                ctx.lineWidth = 3;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(40, 40, width - 80, canvas.height - 80, 24);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(40, 40, width - 80, canvas.height - 80);
                }

                ctx.strokeStyle = 'rgba(241, 208, 110, 0.25)';
                ctx.lineWidth = 1;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(50, 50, width - 100, canvas.height - 100, 18);
                    ctx.stroke();
                }

                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("👑 มหาคัมภีร์โหราศาสตร์ไทยโบราณ", width/2, cy);
                cy += 55;

                ctx.font = '700 50px "Prompt", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'middle';
                ctx.fillText("วิเคราะห์ดาวกำเนิดและดวงชะตา", width/2, cy);
                cy += 60;

                ctx.font = '400 30px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textBaseline = 'middle';
                ctx.fillText(`เกิด${thaiDays[dayOfWeek]} ที่ ${day}/${month}/${year + 543} (พ.ศ.)`, width/2, cy);
                cy += 45;

                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(width/2 - 240, cy);
                ctx.lineTo(width/2 + 240, cy);
                ctx.stroke();
                cy += 45;
            } else {
                cy += 215;
            }

            // Main Planet Banner
            if (!isMeasure) {
                ctx.font = '700 46px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${mainPlanet.name}`, width/2, cy);
            }
            cy += 50;

            const renderWrappedText = (text, textColor = '#e8e9f5', fontSize = 26, lineHeight = 42, align = 'left', targetX = cx, targetW = maxW) => {
                ctx.font = `400 ${fontSize}px "Prompt", sans-serif`;
                let pLines = [];
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(text);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > targetW && currentLine.trim() !== '') {
                            pLines.push(currentLine);
                            currentLine = segment;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                } else {
                    let currentLine = "";
                    for (let j = 0; j < text.length; j++) {
                        const char = text[j];
                        const testLine = currentLine + char;
                        if (ctx.measureText(testLine).width > targetW && j > 0) {
                            pLines.push(currentLine);
                            currentLine = char;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                }

                for (let l of pLines) {
                    if (!isMeasure) {
                        ctx.fillStyle = textColor;
                        ctx.textAlign = align;
                        ctx.textBaseline = 'top';
                        ctx.fillText(l, targetX, cy);
                    }
                    cy += lineHeight;
                }
            };

            const renderBox = (badgeTitle, linesArray, strokeColor = '#f1d06e') => {
                const boxPad = 26;
                const blockW = width - 160;
                const startBoxY = cy;
                let innerY = startBoxY + boxPad;

                if (!isMeasure) {
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, innerY);
                }
                innerY += 44;

                cy = innerY;
                for (let txt of linesArray) {
                    renderWrappedText(txt, '#e2e8f0', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
                }
                cy += boxPad;

                const boxH = cy - startBoxY;
                if (!isMeasure) {
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1.5;
                    ctx.fillStyle = 'rgba(20, 30, 52, 0.75)';
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(cx, startBoxY, blockW, boxH, 18);
                        ctx.fill();
                        ctx.stroke();
                    }

                    let redrawY = startBoxY + boxPad;
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, redrawY);
                    redrawY += 44;
                    cy = redrawY;
                    for (let txt of linesArray) {
                        renderWrappedText(txt, '#e2e8f0', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
                    }
                    cy = startBoxY + boxH;
                }
                cy += 24;
            };

            // Box 1: Planet Identity
            renderBox(`⭐ อัตลักษณ์แห่ง ${mainPlanet.thai}`, [
                `• ความหมาย : ${mainPlanet.meaning}`,
                `• อุปนิสัยกำเนิด : ${mainPlanet.character}`,
                `• จุดแข็งส่งเสริมวาสนา : ${mainPlanet.strength}`,
                `• ข้อควรระวัง : ${mainPlanet.weakness}`
            ], 'rgba(241, 208, 110, 0.4)');

            // Box 2: Auspicious Element & Career
            renderBox(`💼 สายอาชีพและธาตุมงคล`, [
                `• อาชีพที่ถูกโฉลก : ${mainPlanet.career.join(', ')}`,
                `• คู่ดาวเกื้อหนุน : ${mainPlanet.compatibility}`,
                `• ฤกษ์นักษัตรประจำตัว : ${nakshatra.name} (${nakshatra.meaning})`,
                `• เบญจธาตุประจำปีเกิด : ${getYearElement(year)}`
            ], 'rgba(56, 189, 248, 0.4)');

            // Box 3: Guidance & Auspicious Years
            renderBox(`🔮 คำทำนายและปีมงคล`, [
                `• สรุปชะตาชีวิต : ท่านมีพลังวาสนาของ ${mainPlanet.thai} เป็นแกนนำชีวิต หากตั้งใจทำหน้าที่ด้วยความซื่อสัตย์สุจริต จะประสบความสำเร็จอย่างงดงาม`,
                `• ปีมงคลเกื้อหนุน : พ.ศ. ${year + 544}, ${year + 545}, ${year + 546}, ${year + 547}, ${year + 548}`
            ], 'rgba(74, 222, 128, 0.4)');

            cy += 30;
            if (!isMeasure) {
                ctx.font = '500 24px "Prompt", sans-serif';
                ctx.fillStyle = 'rgba(241, 208, 110, 0.85)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("🔮 สยามโหรามงคล · ระบบพยากรณ์โหราศาสตร์ไทยชั้นสูง", width/2, cy);
            }
            cy += 50;

            return cy;
        };

        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);

        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ดาวกำเนิด_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch(err) {
        console.error("เกิดข้อผิดพลาดในการสร้างภาพ:", err);
        if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

// ========================================
// ✨ Export ให้ global
// ========================================
window.calculateThaiAstrology = calculateThaiAstrology;
window.downloadThaiAstrologyImage = downloadThaiAstrologyImage;
window.PLANETS = PLANETS;
window.HOUSES = HOUSES;
window.NAKSHATRAS = NAKSHATRAS;
window.YEAR_ELEMENTS = YEAR_ELEMENTS;
