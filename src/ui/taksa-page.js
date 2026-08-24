"use strict";

// ===================================================================
//  TAKSA PAGE — ทักษาพยากรณ์  (refactored & bug-fixed)
//  เรียงลำดับ id ให้ตรงกับลำดับเวียนดาวมาตรฐาน
//  0=อาทิตย์  1=จันทร์  2=อังคาร  3=พุธ  4=พฤหัสบดี
//  5=ศุกร์    6=เสาร์   7=ราหู
// ===================================================================

const TAKSA_MASTER = [
    { id: 0, name: "อาทิตย์",   color: "#e63946", icon: "fa-sun"       },
    { id: 1, name: "จันทร์",    color: "#ffb703", icon: "fa-moon"      },
    { id: 2, name: "อังคาร",    color: "#ff85a1", icon: "fa-fire"      },
    { id: 3, name: "พุธ",       color: "#2a9d8f", icon: "fa-book-open" },
    { id: 4, name: "พฤหัสบดี",  color: "#f4a261", icon: "fa-star"      },
    { id: 5, name: "ศุกร์",     color: "#a2d2ff", icon: "fa-heart"     },
    { id: 6, name: "เสาร์",     color: "#7209b7", icon: "fa-mountain"  },
    { id: 7, name: "ราหู",      color: "#495057", icon: "fa-dragon"    }
];

// ลำดับเวียนดาวตามเข็มนาฬิกามาตรฐาน (ราหูแทนอาทิตย์ในบางตำรา)
// อาทิตย์(0) → จันทร์(1) → อังคาร(2) → พุธ(3) → พฤหัสบดี(4) → ศุกร์(5) → เสาร์(6) → ราหู(7)
const STAR_CYCLE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7];

// ลำดับ 8 ภูมิ
const GEO_ORDER = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];

// 8 ทิศ (เริ่ม index 0 = ทิศที่สัมพันธ์กับดาว id 0)
const DIRECTION_MASTER = [
    "ตะวันออก",          // 0 อาทิตย์
    "ตะวันออกเฉียงเหนือ", // 1 จันทร์
    "ใต้",               // 2 อังคาร
    "เหนือ",             // 3 พุธ
    "ตะวันออกเฉียงใต้",  // 4 พฤหัสบดี
    "ตะวันตก",           // 5 ศุกร์
    "ตะวันตกเฉียงเหนือ", // 6 เสาร์
    "ตะวันตกเฉียงใต้"    // 7 ราหู
];

// -------------------------------------------------------------------
//  ข้อมูลความหมายแต่ละภูมิ
// -------------------------------------------------------------------
const TAKSA_DETAILED_MEANINGS = {
    "บริวาร": {
        title: "บริวาร",
        subtitle: "คนรอบกาย · สายสัมพันธ์ · ผู้ติดตาม",
        summary: "ผู้คนที่อยู่เคียงข้าง ครอบครัว ลูกหลาน คู่ครอง เพื่อนสนิท ลูกน้อง คนที่ต้องอุปการะเลี้ยงดู เป็นภาพสะท้อนความสัมพันธ์และการเป็นที่พึ่งพิงในชีวิต",
        positive: "คนรอบตัวภักดี เกื้อกูล ครอบครัวอบอุ่น ลูกหลานกตัญญู มีคนคอยหนุนหลังทั้งในยามทุกข์และสุข เป็นที่รักใคร่ของผู้ใต้บังคับบัญชา ทีมงานจงรักภักดี",
        negative: "ความขัดแย้งในครอบครัว เพื่อนหักหลัง ลูกน้องทรยศ ญาติพี่น้องไม่ลงรอย ถูกคนใกล้ชิดเอาเปรียบหรือนินทาเบื้องหลัง",
        realLifeExamples: [
            "ลูกน้องทำงานด้วยใจ จนโปรเจกต์ประสบความสำเร็จเกินคาด",
            "คู่ครอง/ลูกหลานเป็นกำลังใจสำคัญ ช่วยเหลือครอบครัวในยามลำบาก",
            "ถูกเพื่อนสนิทหักหลังจนเสียหายทั้งชื่อเสียงและทรัพย์สิน",
            "ลูกน้องไม่ภักดี นำปัญหามาสร้างความเดือดร้อน ต้องเปลี่ยนทีมงานใหม่"
        ],
        advice: "ทำบุญอุทิศส่วนกุศลให้ญาติผู้ใหญ่ที่ล่วงลับ สร้างสัมพันธภาพด้วยการเอาใจใส่ ไหว้พระขอพรให้ครอบครัวอยู่เย็นเป็นสุข บริจาคอาหารให้คนยากไร้และสัตว์",
        lucky: { color: "ชมพู/แดง", number: "6, 15", direction: "ทิศใต้" }
    },
    "อายุ": {
        title: "อายุ",
        subtitle: "สุขภาพกายใจ · อายุยืน · พลังชีวิต",
        summary: "สุขภาพร่างกาย ความแข็งแรง พลังชีวิต ความเป็นอยู่ประจำวัน รวมถึงอายุขัยและความสมดุลระหว่างกาย-ใจ",
        positive: "สุขภาพแข็งแรง อายุยืนยาว พลังงานดี ไม่เจ็บป่วยรุนแรง ชีวิตเรียบง่ายแต่สุขกายสบายใจ มีวินัยดูแลตนเองดีเยี่ยม",
        negative: "เจ็บป่วยบ่อย โรคเรื้อรังกำเริบ อายุอาจสั้นกว่าที่ควร เกิดอุบัติเหตุซ้ำซาก สุขภาพจิตแปรปรวน หมดเรี่ยวแรง",
        realLifeExamples: [
            "สุขภาพดีตลอดปี วิ่งมาราธอนได้สบาย ๆ อายุยืนแบบปู่ย่าถึง 90+",
            "ป่วยเรื้อรัง เช่น เบาหวาน-ความดัน ต้องนอนโรงพยาบาลบ่อยครั้ง",
            "เกิดอุบัติเหตุเล็กน้อยซ้ำ ๆ จนต้องพักงานนานและเสียค่าใช้จ่ายมาก",
            "สุขภาพจิตแย่ ซึมเศร้า วิตกกังวล ชีวิตไม่มีความสุขแม้ร่างกายไม่ป่วย"
        ],
        advice: "ออกกำลังกายสม่ำเสมอ กินอาหารครบหมู่ ทำบุญปล่อยสัตว์ บริจาคเลือด สวดมนต์บทอายุวัฒนะ ไหว้พระขอพรอายุยืนยาว",
        lucky: { color: "เขียว/ฟ้า", number: "4, 7", direction: "ทิศเหนือ" }
    },
    "เดช": {
        title: "เดช",
        subtitle: "บารมี · อำนาจวาสนา · ชื่อเสียง",
        summary: "บารมี อำนาจ ความยำเกรง ชื่อเสียงเกียรติยศ วาสนาเก่าที่สะสมมา เป็นสิ่งที่ทำให้คนเกรงใจและยอมรับ",
        positive: "บารมีสูง คนเกรงขาม ได้รับการยอมรับ เลื่อนยศเลื่อนตำแหน่ง ชื่อเสียงดี เป็นผู้นำโดยธรรมชาติ มีผู้ใหญ่ยกย่อง",
        negative: "บารมีเสื่อม ถูกหมิ่นเหม่า อำนาจลดลง ถูกใส่ร้ายป้ายสี เสื่อมเสียชื่อเสียง ตำแหน่งสั่นคลอน ถูกกดทับ",
        realLifeExamples: [
            "ได้เลื่อนตำแหน่งกะทันหัน คนเกรงใจขึ้นอย่างเห็นได้ชัด",
            "ได้รับรางวัลหรือเกียรติยศจากสังคม/องค์กร",
            "ถูกใส่ร้ายจนเสียชื่อเสียง โดนย้ายตำแหน่งหรือถูกตรวจสอบ",
            "สูญเสียอำนาจการตัดสินใจ ถูกเบียดเบียนจากผู้ใหญ่หรือคู่แข่ง"
        ],
        advice: "ทำบุญใหญ่ ปล่อยนกปล่อยปลา บริจาคให้วัด สร้างเจดีย์ ไหว้ครูบาอาจารย์ ขอพรจากผู้ใหญ่ สวมเครื่องประดับเสริมบารมี (พระ, หยก, ทองคำ)",
        lucky: { color: "แดง/ทอง", number: "1, 9", direction: "ทิศตะวันออก" }
    },
    "ศรี": {
        title: "ศรี",
        subtitle: "โชคลาภ · สิริมงคล · เสน่ห์ · ความรุ่งเรือง",
        summary: "โชคลาภเงินทอง ความสำเร็จ สิริมงคล เสน่ห์เมตตามหานิยม ความงาม ความสุข ความสมบูรณ์พูนผล",
        positive: "โชคลาภมหาศาล ได้ลาภลอย ธุรกิจรุ่งเรือง มีเสน่ห์แรง คนเอ็นดูนิยม สิ่งที่หวังสมหวัง ชีวิตสุขสบาย",
        negative: "ขาดโชค เสียเงิน เสียของ เสน่ห์ตก ความงามลดลง ชีวิตขาดความสุข สิ่งดี ๆ ที่หวังมักไม่สมหวัง",
        realLifeExamples: [
            "ถูกหวยก้อนโต หรือได้โบนัส/เงินรางวัลไม่คาดฝัน",
            "ขายของออนไลน์ยอดพุ่ง คนนิยมมากจนสินค้าขาดตลาด",
            "ลงทุนผิดพลาด เสียเงินก้อนใหญ่ หรือซื้อของแล้วของปลอม",
            "เสน่ห์ตก คนไม่ค่อยเอ็นดู ความรักหรือหน้าที่การงานสะดุด"
        ],
        advice: "ทำบุญตักบาตรเที่ยงวัน สวดบทชินบัญชร บริจาคของใช้ให้คนยากไร้ ปลูกต้นไม้ทำบุญ สวมใส่สีมงคลประจำวัน (ชมพู/ฟ้า)",
        lucky: { color: "ชมพู/ม่วง", number: "6, 15", direction: "ทิศใต้" }
    },
    "มูละ": {
        title: "มูละ",
        subtitle: "หลักฐาน · มรดก · ความมั่นคง · ที่อยู่อาศัย",
        summary: "ฐานะมั่นคง มรดก ทรัพย์สินเดิม ที่ดิน บ้านเรือน ความมั่นคงทางการเงินและชีวิต",
        positive: "ฐานะมั่นคง ได้มรดกตกทอด ที่ดิน/บ้านราคาขึ้น ทรัพย์สินเพิ่มพูน ไม่โยกย้ายบ่อย ชีวิตมั่นคงยั่งยืน",
        negative: "เสียหลักฐาน เสียทรัพย์เดิม บ้านชำรุด มรดกมีปัญหา ฐานะสั่นคลอน ถูกยึดทรัพย์หรือมีปัญหาเอกสาร",
        realLifeExamples: [
            "ได้มรดกบ้าน/ที่ดิน หรือซื้อบ้านแล้วราคาพุ่งสูงในไม่กี่ปี",
            "ฐานะมั่นคง ไม่ต้องย้ายที่อยู่บ่อย ชีวิตราบรื่น",
            "บ้านทรุดโทรม ต้องเสียเงินซ่อมแซมก้อนโต หรือมีปัญหาเอกสารที่ดิน",
            "ถูกยึดทรัพย์บางส่วน หรือมรดกจากญาติมีปัญหาคดีความ"
        ],
        advice: "ทำบุญสร้างวัด บริจาคที่ดินให้วัด ปลูกต้นไม้ใหญ่ ไหว้พระที่บ้าน สร้างกองทรายทำบุญ",
        lucky: { color: "เขียว/น้ำตาล", number: "4, 5", direction: "ทิศตะวันตกเฉียงเหนือ" }
    },
    "อุตสาหะ": {
        title: "อุตสาหะ",
        subtitle: "ความขยัน · ความพยายาม · ผลงานด้วยน้ำพักน้ำแรง",
        summary: "ความขยัน อดทน มานะพากเพียร งานที่ทำด้วยน้ำพักน้ำแรง ความสำเร็จจากการต่อสู้ด้วยตนเอง",
        positive: "ขยัน อดทน งานสำเร็จด้วยน้ำพักน้ำแรง ได้ผลตอบแทนคุ้มค่า ความพยายามนำมาซึ่งความสำเร็จใหญ่หลวง",
        negative: "ขี้เกียจ งานไม่สำเร็จ เหนื่อยแต่ไม่เห็นผล หมดกำลังใจ เรียนไม่จบ งานสะดุดขาดตอน",
        realLifeExamples: [
            "เปิดร้านแล้วลูกค้าแน่น จากความขยันและทุ่มเท",
            "เรียนจบด้วยเกียรตินิยม จากการตั้งใจจริงและไม่ยอมแพ้",
            "ทุ่มเทเต็มที่แต่เงินเดือนไม่ขึ้น งานสะดุดหรือถูกเลิกจ้าง",
            "เหนื่อยมากแต่ผลลัพธ์ไม่เป็นอย่างหวัง หมดไฟในการทำงาน"
        ],
        advice: "ทำบุญด้วยแรงกาย เช่น กวาดวัด ล้างพื้น ช่วยงานบุญ สวดมนต์บทอิติปิโส บริจาคแรงงาน",
        lucky: { color: "ส้ม/แดง", number: "3, 8", direction: "ทิศตะวันออกเฉียงใต้" }
    },
    "มนตรี": {
        title: "มนตรี",
        subtitle: "ผู้ใหญ่ · ที่ปรึกษา · เจ้านาย · ผู้ปกป้อง",
        summary: "ผู้ใหญ่ ที่ปรึกษา เจ้านาย ผู้มีอำนาจที่ให้การอุปถัมภ์ ค้ำชู เป็นที่พึ่งพิงในยามลำบาก",
        positive: "มีผู้ใหญ่ค้ำชู เจ้านายดี ได้รับการอุปถัมภ์ มีที่ปรึกษาที่เฉลียวฉลาด ช่วยให้ผ่านพ้นวิกฤตได้",
        negative: "ขาดผู้ใหญ่ช่วย เจ้านายไม่ดี ถูกกดทับ ถูกหักหลังจากคนที่ไว้ใจ โดนเบียดเบียนจนต้องลาออก",
        realLifeExamples: [
            "ได้เจ้านายดี คอยหนุนหลังจนเลื่อนตำแหน่งเร็ว",
            "มีที่ปรึกษาช่วยผ่านวิกฤตธุรกิจหรือปัญหาชีวิตได้",
            "เจ้านายกดทับ ถูกเบียดเบียนจนต้องลาออกหรือย้ายงาน",
            "ขาดคนค้ำชู ต้องต่อสู้ด้วยตัวคนเดียวจนเหนื่อยล้า"
        ],
        advice: "ไหว้ครูบาอาจารย์ ทำบุญกับผู้ใหญ่ในครอบครัว สวดมนต์บทพระพุทธคุณ บริจาคหนังสือธรรมะ",
        lucky: { color: "เหลือง/ส้ม", number: "5, 1", direction: "ทิศตะวันออกเฉียงเหนือ" }
    },
    "กาลกิณี": {
        title: "กาลกิณี",
        subtitle: "เคราะห์ร้าย · อุปสรรคใหญ่ · สิ่งอัปมงคล",
        summary: "สิ่งอัปมงคล อุปสรรค เคราะห์ซ้ำซ้อน ปัญหาที่ทำให้ชีวิตสะดุดหรือเสียหายรุนแรง",
        positive: "เมื่อผ่านพ้นกาลกิณีแล้ว มักเกิดการเปลี่ยนแปลงครั้งใหญ่ไปในทางที่ดี ชีวิตพลิกผันดีขึ้นอย่างก้าวกระโดด",
        negative: "เคราะห์ร้ายรุมเร้า เสียหายทั้งเงินทอง ชื่อเสียง สุขภาพ ถูกขโมย ถูกหักหลัง เกิดคดีความ อุบัติเหตุใหญ่ ชีวิตตกต่ำ",
        realLifeExamples: [
            "หลังหย่ากลับมาเจอคู่แท้ ชีวิตดีขึ้นอย่างน่าอัศจรรย์",
            "หลังล้มละลายแล้วสร้างธุรกิจใหม่จนร่ำรวยกว่าเดิม",
            "โดนขโมยรถ/ทรัพย์สิน ถูกหักหลังหนัก หรือป่วยต้องผ่าตัดใหญ่",
            "เกิดคดีความ อุบัติเหตุรุนแรง หรือปัญหาต่อเนื่องหลายเดือน"
        ],
        advice: "ทำพิธีแก้เคล็ดหนัก ๆ (บุญ 9 วัด, สวดชินบัญชร 108 จบ, ปล่อยสัตว์น้ำจำนวนมาก) หลีกเลี่ยงเริ่มงานใหญ่ ทำบุญอุทิศส่วนกุศลให้สิ่งศักดิ์สิทธิ์และวิญญาณ",
        lucky: { color: "ดำ/เทา (หลีกเลี่ยง)", number: "หลีกเลี่ยงเลขคู่", direction: "หลีกเลี่ยงทิศกาลกิณี" }
    }
};

// -------------------------------------------------------------------
//  ข้อมูลพยากรณ์รายดาว (ใช้ใน card + สรุป)
// -------------------------------------------------------------------
const STAR_PREDICTIONS = {
    0: { // อาทิตย์
        power:   "เกียรติยศเด่นชัด มีออร่าดั่งพญาราชสีห์",
        work:    "มีโอกาสได้เลื่อนตำแหน่ง หรือได้รับโปรเจกต์ใหญ่ที่สร้างชื่อเสียง",
        wealth:  "เงินทองมาพร้อมกับบารมี ยิ่งให้ยิ่งได้รับคืน",
        love:    "คนโสดจะเจอคนโปรไฟล์ดีเข้ามาหา คนมีคู่จะส่งเสริมบารมีกัน",
        remedy:  "ถวายหลอดไฟ หรือร่วมทำบุญเกี่ยวกับแสงสว่างเพื่อแก้เคล็ด"
    },
    1: { // จันทร์
        power:   "เสน่ห์เมตตามหานิยม มีคนเอ็นดูอุปถัมภ์",
        work:    "งานบริการหรืองานประสานงานจะรุ่งเรืองมาก ผู้ใหญ่จะหยิบยื่นโอกาสทอง",
        wealth:  "ไหลมาดั่งสายน้ำ ไม่ขาดมือแต่ต้องระวังเรื่องอารมณ์ในการใช้เงิน",
        love:    "มีความเข้าใจกันมากขึ้น เป็นปีที่เหมาะแก่การเริ่มต้นชีวิตคู่",
        remedy:  "บริจาคค่าน้ำ หรือร่วมสร้างห้องน้ำวัด เสริมดวงการเงินให้ลื่นไหล"
    },
    2: { // อังคาร
        power:   "พลังขับเคลื่อนมหาศาล เอาชนะอุปสรรคทั้งปวงได้",
        work:    "งานที่ต้องแข่งขันหรือบุกเบิกจะสำเร็จลุล่วงด้วยความเพียร",
        wealth:  "ลาภลอยจากการเสี่ยงโชคหรือความกล้าได้กล้าเสีย",
        love:    "ความสัมพันธ์คึกคัก มีไฟในการสร้างอนาคตร่วมกัน",
        remedy:  "บริจาคเลือด หรือร่วมทำบุญกับโรงพยาบาลทหารผ่านศึก"
    },
    3: { // พุธ
        power:   "วาจาเป็นประกาศิต เจรจาสิ่งใดเป็นเงินเป็นทอง",
        work:    "การค้าขายออนไลน์ การเจรจาธุรกิจต่างแดนจะสัมฤทธิ์ผล",
        wealth:  "กำไรจากการลงทุนระยะสั้นโดดเด่นมาก",
        love:    "การสื่อสารคือหัวใจหลักปีนี้ ยิ่งพูดดียิ่งรักกันมาก",
        remedy:  "ร่วมพิมพ์หนังสือสวดมนต์ หรือบริจาคอุปกรณ์การศึกษา"
    },
    4: { // พฤหัสบดี
        power:   "ปัญญาคือแสงสว่าง มีเทวดาคุ้มครองดวงชะตา",
        work:    "ผลงานทางวิชาการ หรือการสอบแข่งขันจะได้รับชัยชนะเด็ดขาด",
        wealth:  "ลาภผลจากผู้ใหญ่ที่เคารพรัก หรือมรดกตกทอด",
        love:    "คู่ครองจะนำพาความเจริญมาให้ มีเกณฑ์ได้บุตรมงคล",
        remedy:  "จัดสังฆทานด้วยอาหารดีๆ หรือร่วมเป็นเจ้าภาพบวชพระ"
    },
    5: { // ศุกร์
        power:   "สุนทรียภาพและความสุข บันดาลทรัพย์ด้วยรอยยิ้ม",
        work:    "วงการบันเทิง ความงาม หรือศิลปะจะรุ่งเรืองถึงขีดสุด",
        wealth:  "รายได้สะพัดจากการใช้ความคิดสร้างสรรค์",
        love:    "เสน่ห์ล้นเหลือ เป็นปีที่หัวใจจะเบ่งบานดั่งดอกไม้",
        remedy:  "ถวายดอกไม้หอมพระประธาน หรือร่วมบุญวิวาห์มงคล"
    },
    6: { // เสาร์
        power:   "ความอดทนคืออาวุธ มั่นคงดั่งขุนเขา",
        work:    "งานอสังหาริมทรัพย์หรืองานโปรเจกต์ระยะยาวจะผลิดอกออกผล",
        wealth:  "เก็บเล็กผสมน้อยจนเป็นเงินก้อนใหญ่ เป็นปีแห่งการสะสมทรัพย์",
        love:    "รักที่มั่นคง ต้องอาศัยเวลาและความเข้าใจลึกซึ้ง",
        remedy:  "ร่วมทำบุญสร้างอุโบสถ หรือถวายกระเบื้องมุงหลังคาวัด"
    },
    7: { // ราหู
        power:   "ปฏิภาณไหวพริบยอดเยี่ยม พลิกวิกฤตเป็นโอกาส",
        work:    "งานเบื้องหลัง หรืองานที่เกี่ยวข้องกับต่างชาติจะประสบความสำเร็จสูง",
        wealth:  "เงินทองเข้าเร็วออกเร็ว มีลาภก้อนโตจากคนทางไกล",
        love:    "ความรักที่ตื่นเต้นท้าทาย แต่อย่าหลงลืมสติในการใช้ชีวิต",
        remedy:  "ไหว้พระราหูด้วยของดำ หรือบริจาคเงินให้มูลนิธิคนตาบอด"
    }
};

const STAR_NATURES = {
    0: { trait: "เน้นเกียรติยศ ความเป็นผู้นำ และการปรากฏตัวต่อสังคม (ดั่งราชา)" },
    1: { trait: "เน้นการดูแลเอาใจใส่ ความอ่อนโยน และการใช้อารมณ์ความรู้สึก (ดั่งราชินี)" },
    2: { trait: "เน้นความขยัน การบุกเบิก พละกำลัง และการเอาชนะอุปสรรค (ดั่งนักรบ)" },
    3: { trait: "เน้นการสื่อสาร การเจรจา ปัญญาไหวพริบ และการค้าขาย (ดั่งพ่อค้า/ทูต)" },
    4: { trait: "เน้นความถูกต้อง ปัญญาทางวิชาการ และความเมตตาจากผู้ใหญ่ (ดั่งครูบาอาจารย์)" },
    5: { trait: "เน้นความสุข ความบันเทิง ศิลปะ และโชคลาภทางการเงิน (ดั่งเศรษฐี)" },
    6: { trait: "เน้นความอดทน ทรัพย์สินก้อนใหญ่ และการวางแผนระยะยาว (ดั่งกสิกร)" },
    7: { trait: "เน้นความพลิกแพลง ไหวพริบในเงามืด และการเปลี่ยนแปลงที่รวดเร็ว (ดั่งนักเลง)" }
};

// -------------------------------------------------------------------
//  Navigation helpers
// -------------------------------------------------------------------
function showTaksaPage() {
    navigateTo('taksaPage');
    resetTaksa();
}

function resetTaksa() {
    const inputEl  = document.getElementById('taksaInput');
    const resultEl = document.getElementById('taksaResult');

    if (inputEl)  inputEl.style.display  = 'block';
    if (resultEl) {
        resultEl.style.display = 'none';
        resultEl.innerHTML     = '';
    }

    const ageInput  = document.getElementById('userAge');
    const daySelect = document.getElementById('birthDaySelect');
    if (ageInput)  ageInput.value       = '';
    if (daySelect) daySelect.selectedIndex = 0;
}

// -------------------------------------------------------------------
//  คำนวณทักษา ตามตำราหลวง
// -------------------------------------------------------------------
/**
 * birthDay : 0 = อาทิตย์ … 7 = ราหู  (ตรงกับ id ใน TAKSA_MASTER)
 * age      : อายุย่าง (เริ่มจาก 1)
 * gender   : 'male' | 'female'
 *
 * วิธีคิดตามตำรา:
 *  - steps = (age - 1) % 8
 *  - ชาย   → เวียนขวา  startIndex = (birthIndex + steps) % 8
 *  - หญิง  → เวียนซ้าย startIndex = (birthIndex - steps + 8) % 8
 *  - เวียนภูมิ 8 ตำแหน่งต่อเนื่อง (ทิศเดียวกับดาวหลัก)
 */
function computeTaksa(birthDay, age, gender) {
    const birthIndex = STAR_CYCLE_ORDER.indexOf(birthDay);
    const steps      = (age - 1) % 8;
    const isFemale   = (gender === 'female');

    // ชาย → บวก steps (เวียนขวา), หญิง → ลบ steps (เวียนซ้าย)
    const startIndex = isFemale
        ? ((birthIndex - steps) % 8 + 8) % 8
        : (birthIndex + steps) % 8;

    // ทิศเวียนภูมิ: ชาย +1 ต่อภูมิ, หญิง -1 ต่อภูมิ
    const dir = isFemale ? -1 : 1;

    const result = {};
    GEO_ORDER.forEach((geo, i) => {
        const cycleIdx = ((startIndex + dir * i) % 8 + 8) % 8;
        const starId   = STAR_CYCLE_ORDER[cycleIdx];
        result[geo]    = { id: starId };
    });
    return result;
}

// -------------------------------------------------------------------
//  สร้าง Card แต่ละภูมิ (Bootstrap 5 + ข้อมูลพยากรณ์รายดาว)
// -------------------------------------------------------------------
function createTaksaCard(geoKey, taksaStar) {
    const m    = TAKSA_DETAILED_MEANINGS[geoKey];
    if (!m) return '';

    const star  = TAKSA_MASTER[taksaStar.id] || { name: "ไม่ทราบ", color: "#ffffff", icon: "fa-question" };
    const pred  = STAR_PREDICTIONS[taksaStar.id] || {};
    const nat   = STAR_NATURES[taksaStar.id]     || {};

    return `
        <div class="card taksa-card mb-4 shadow-lg border-0 overflow-hidden" style="border-radius:16px; background:linear-gradient(135deg,#1a1a1a 0%,#2d1b47 100%);">

            <!-- Header -->
            <div class="card-header text-white py-4 text-center" style="background:linear-gradient(90deg,${star.color}44,transparent); border-bottom:3px solid ${star.color};">
                <i class="fas ${star.icon} fa-3x mb-2 d-block" style="color:${star.color}; filter:drop-shadow(0 0 10px ${star.color});"></i>
                <h4 class="mb-0 fw-bold">${m.title}</h4>
                <div class="text-white-50 small mb-2">${m.subtitle}</div>
                <span class="badge bg-dark text-white px-3 py-2" style="font-size:.95rem; border:1px solid ${star.color};">
                    ดาวครอง: <strong>${star.name}</strong>
                </span>
            </div>

            <div class="card-body p-4 text-white">

                <!-- ธรรมชาติดาว -->
                ${nat.trait ? `
                <div class="mb-3 px-3 py-2 rounded" style="background:rgba(255,255,255,.07); border-left:3px solid ${star.color};">
                    <small class="text-white-50"><i class="fas fa-info-circle me-1"></i>${nat.trait}</small>
                </div>` : ''}

                <!-- ภาพรวม -->
                <div class="alert border-0 mb-4" style="background:rgba(255,255,255,.08);">
                    <h6 class="mb-2" style="color:${star.color};"><i class="fas fa-scroll me-2"></i>ภาพรวม</h6>
                    <p class="mb-0 small">${m.summary}</p>
                </div>

                <!-- ผลดี / ผลร้าย -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="h-100 p-3 rounded" style="background:rgba(40,167,69,.2); border:1px solid rgba(40,167,69,.4);">
                            <h6 class="text-success fw-bold mb-2"><i class="fas fa-thumbs-up me-2"></i>เมื่อดาวส่งผลดี</h6>
                            <p class="mb-0 small">${m.positive}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="h-100 p-3 rounded" style="background:rgba(220,53,69,.2); border:1px solid rgba(220,53,69,.4);">
                            <h6 class="text-danger fw-bold mb-2"><i class="fas fa-exclamation-triangle me-2"></i>เมื่อดาวส่งผลร้าย</h6>
                            <p class="mb-0 small">${m.negative}</p>
                        </div>
                    </div>
                </div>

                <!-- พยากรณ์รายด้าน -->
                ${pred.work ? `
                <div class="mb-3 p-3 rounded" style="background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12);">
                    <h6 class="fw-bold mb-2" style="color:${star.color};"><i class="fas fa-briefcase me-2"></i>ด้านการงาน/การเรียน</h6>
                    <p class="mb-1 small">${pred.work}</p>
                    <p class="mb-1 small"><i class="fas fa-coins me-1 text-warning"></i><strong>การเงิน:</strong> ${pred.wealth}</p>
                    <p class="mb-0 small"><i class="fas fa-heart me-1 text-pink"></i><strong>ความรัก:</strong> ${pred.love}</p>
                </div>` : ''}

                <!-- ตัวอย่างสถานการณ์ -->
                <div class="p-3 rounded mb-3" style="background:rgba(255,193,7,.1); border:1px solid rgba(255,193,7,.3);">
                    <h6 class="fw-bold mb-2" style="color:#ffc107;"><i class="fas fa-lightbulb me-2"></i>ตัวอย่างสถานการณ์จริง</h6>
                    <ul class="mb-0 ps-4 small">
                        ${m.realLifeExamples.map(ex => `<li class="mb-1">${ex}</li>`).join('')}
                    </ul>
                </div>

                <!-- เคล็ดเสริมดวง -->
                <div class="p-3 rounded" style="background:rgba(13,202,240,.1); border:1px solid rgba(13,202,240,.3);">
                    <h6 class="fw-bold mb-2" style="color:#0dcaf0;"><i class="fas fa-pray me-2"></i>เคล็ดเสริมดวง / แก้เคล็ด</h6>
                    <p class="mb-2 small">${m.advice}</p>
                    ${pred.remedy ? `<p class="mb-2 small text-warning"><i class="fas fa-magic me-1"></i>${pred.remedy}</p>` : ''}
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        <span class="badge" style="background:rgba(255,255,255,.15);">🎨 สีเสริม: ${m.lucky.color}</span>
                        <span class="badge" style="background:rgba(255,255,255,.15);">🔢 เลขนำโชค: ${m.lucky.number}</span>
                        <span class="badge" style="background:rgba(255,255,255,.15);">🧭 ทิศแนะนำ: ${m.lucky.direction}</span>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// -------------------------------------------------------------------
//  สร้างบทสรุปดวงปี
// -------------------------------------------------------------------
function generateYearSummary(taksa, age, gender) {
    try {
        if (!taksa) return '';

        const getStarName = (key) => {
            const s = taksa[key];
            if (!s) return 'ไม่ทราบ';
            const id = (typeof s === 'object') ? s.id : s;
            return TAKSA_MASTER[id]?.name || 'ไม่ทราบ';
        };

        const boriwanName = getStarName('บริวาร');
        const sriName     = getStarName('ศรี');
        const kalaName    = getStarName('กาลกิณี');
        const detName     = getStarName('เดช');

        if (boriwanName === 'ไม่ทราบ') {
            return '<div class="p-3 text-center text-white-50">-- ไม่สามารถสร้างคำทำนายรายปีได้ --</div>';
        }

        const ageNum  = parseInt(age) || 0;
        const isFem   = gender === 'female';
        const tone    = isFem ? 'อ่อนโยนแต่เฉียบคม' : 'มั่นคงและเด็ดขาด';
        const pronoun = isFem ? 'สาวน้อย' : 'หนุ่มใหญ่';
        const thaiYear = new Date().getFullYear() + 543;

        let p1 = `ปี ${thaiYear} นี้ ดวงชะตาเดินทางเข้าสู่ช่วงที่ดาว${boriwanName}จรมาครองบริวาร
            ทำให้เรื่องราวของคนรอบข้าง ความสัมพันธ์ และการเป็นที่พึ่งพิงของกันและกัน
            กลายเป็นประเด็นหลักที่มีอิทธิพลต่อชีวิตมากที่สุดในรอบปีนี้
            ครอบครัว เพื่อนสนิท ลูกหลาน หรือทีมงาน จะมีบทบาทสำคัญอย่างยิ่ง`;

        if (sriName !== 'ไม่ทราบ') {
            p1 += ` พร้อมกันนั้น ดาว${sriName}เข้ามาครองศรี
                ทำให้โชคลาภ สิริมงคล และความเมตตาจากผู้อื่นไหลมาไม่ขาดสาย
                งานที่ทำมีแนวโน้มราบรื่น มีคนเอ็นดูนิยม
                เงินทองที่เข้ามาจะเป็นผลจากการที่คุณ${tone}และทุ่มเทมาตลอด`;
        }

        let p2 = `อย่างไรก็ตาม ต้องระวังเงาของดาว${kalaName}ที่ครองกาลกิณีในปีนี้
            ซึ่งอาจนำพาอุปสรรคหรือเหตุการณ์ไม่คาดฝันมาให้ต้องจัดการบ้างเป็นระยะ
            ไม่ว่าจะเป็นความขัดแย้งเล็กน้อย ปัญหาสุขภาพ หรือเรื่องที่ต้องใช้ความอดทน
            แต่หากผ่านด่านนี้ไปได้ จะกลายเป็นจุดเปลี่ยนครั้งใหญ่ที่ทำให้ชีวิตก้าวไปอีกขั้น`;

        if (detName !== 'ไม่ทราบ') {
            p2 += ` โชคดีที่ดาว${detName}ส่งพลังบารมีมาช่วยประคอง
                แม้จะมีคลื่นลม คุณก็ยังคงได้รับการยอมรับและเกรงใจจากคนรอบข้างอยู่ดี`;
        }

        const agePhase = ageNum >= 40
            ? 'วัยนี้คือช่วงเก็บเกี่ยวผลบุญที่เคยทำมา'
            : ageNum >= 25
            ? 'วัยนี้คือช่วงสร้างฐานะและบารมีให้แข็งแกร่ง'
            : 'วัยนี้คือช่วงวางรากฐานชีวิตที่ดีที่สุด';

        p2 += ` โดยรวมแล้ว ปีนี้เป็นปีที่${tone}และมีโอกาสเติบโตสูงมาก
            หากหมั่นทำบุญ ดูแลสุขภาพ และรักษาความสัมพันธ์กับคนรอบตัวให้ดี
            สิ่งดี ๆ ที่หวังไว้มีแนวโน้มจะสมหวังเกินคาดแน่นอน
            ${agePhase} ขอให้${pronoun}คนนี้ผ่านปีนี้ไปอย่างรุ่งโรจน์`;

        return `
            <div id="yearSummarySection" class="card border-0 mt-4 mb-4 shadow-lg" style="background:linear-gradient(135deg,rgba(212,175,55,.15),rgba(26,26,46,.95)); border:1px solid rgba(212,175,55,.4) !important;">
                <div class="card-header text-center py-3" style="background:rgba(212,175,55,.2); border-bottom:1px solid rgba(212,175,55,.3);">
                    <h4 class="mb-0" style="color:#d4af37;">✨ บทสรุปดวงชะตาปี ${thaiYear}</h4>
                    ${ageNum > 0 ? `<small class="text-white-50">อายุย่าง ${ageNum} ปี</small>` : ''}
                </div>
                <div class="card-body p-4 text-white" style="line-height:2; font-size:1.05rem;">
                    <p class="mb-3">${p1.trim()}</p>
                    <p class="mb-0">${p2.trim()}</p>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('generateYearSummary error:', err);
        return '';
    }
}

// -------------------------------------------------------------------
//  Tab switcher สำหรับผลทักษา
// -------------------------------------------------------------------
function switchTaksaTab(tabName) {
    document.querySelectorAll('.taksa-tab-content').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.taksa-tab-btn').forEach(el => {
        el.style.background    = 'rgba(255,255,255,.05)';
        el.style.color         = 'rgba(255,255,255,.55)';
        el.style.borderBottom  = '2px solid transparent';
    });
    const content = document.getElementById(`taksaTab_${tabName}`);
    if (content) content.style.display = 'block';
    const btn = document.getElementById(`taksaTabBtn_${tabName}`);
    if (btn) {
        btn.style.background   = 'rgba(212,175,55,.18)';
        btn.style.color        = '#d4af37';
        btn.style.borderBottom = '2px solid #d4af37';
    }
}

// -------------------------------------------------------------------
//  Tab 2: ดวงประจำวัน
// -------------------------------------------------------------------
function renderDailyTab(taksa, age, gender) {
    const now         = new Date();
    const dayOfWeek   = now.getDay();           // 0=Sun … 6=Sat → ตรงกับ TAKSA_MASTER id
    const todayStarId = dayOfWeek;              // Sun=0(อาทิตย์) … Sat=6(เสาร์)
    const dayNames    = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
    const dayName     = dayNames[dayOfWeek];
    const todayStar   = TAKSA_MASTER[todayStarId] || { name:'ไม่ทราบ', color:'#d4af37', icon:'fa-star' };
    const pred        = STAR_PREDICTIONS[todayStarId] || {};

    // หาว่าดาววันนี้ตกภูมิไหนในดวงของผู้ใช้
    let todayGeo = null;
    for (const [geo, val] of Object.entries(taksa)) {
        if (val.id === todayStarId) { todayGeo = geo; break; }
    }
    const geoMeaning = todayGeo ? (TAKSA_DETAILED_MEANINGS[todayGeo] || {}) : {};

    const influenceMap = {
        'บริวาร':  { level:'🟢 ดี',       text:'ดาววันนี้ตกภูมิบริวาร — คนรอบข้างให้พลังงานบวก เหมาะทำงานเป็นทีมหรือขอความช่วยเหลือ' },
        'อายุ':    { level:'🟢 ดี',       text:'ดาววันนี้เสริมภูมิอายุ — สุขภาพแข็งแรง มีพลังงานดีตลอดวัน เหมาะออกกำลังกาย' },
        'เดช':     { level:'🌟 เด่นมาก',  text:'ดาววันนี้อยู่ภูมิเดช — บารมีสูงสุด วันนี้เหมาะนำเสนอผลงาน เจรจา ขอความก้าวหน้า' },
        'ศรี':     { level:'🌟 โชคเด่น',  text:'ดาววันนี้ตกภูมิศรี — โชคลาภและสิริมงคลสูงสุด เหมาะทำธุรกรรม ลงทุน ค้าขาย' },
        'มูละ':    { level:'🟡 ปานกลาง', text:'ดาววันนี้ตกภูมิมูละ — มั่นคงสม่ำเสมอ เหมาะดูแลทรัพย์สิน ซ่อมแซมบ้าน วางแผนระยะยาว' },
        'อุตสาหะ': { level:'🟢 ดี',       text:'ดาววันนี้เสริมภูมิอุตสาหะ — ยิ่งลุยยิ่งได้ผล วันที่เหมาะทำงานหนัก ความพยายามคือกุญแจ' },
        'มนตรี':   { level:'🟢 ดี',       text:'ดาววันนี้ตกภูมิมนตรี — ผู้ใหญ่เกื้อกูล เหมาะขอคำปรึกษา ติดต่อราชการ หรือพบเจ้านาย' },
        'กาลกิณี': { level:'🔴 ระวัง',    text:'ดาววันนี้ตกภูมิกาลกิณี — ควรระมัดระวังตัว งดตัดสินใจใหญ่ เสริมบุญกุศลไว้ก่อน' }
    };
    const influence = todayGeo ? (influenceMap[todayGeo] || {}) : {};

    const thaiDate = now.toLocaleDateString('th-TH', {
        weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:'Asia/Bangkok'
    });

    return `
        <div class="p-3">
            <div class="text-center mb-4 p-4 rounded" style="background:linear-gradient(135deg,${todayStar.color}22,rgba(15,12,26,.9));border:2px solid ${todayStar.color}66;">
                <i class="fas ${todayStar.icon} fa-3x mb-2" style="color:${todayStar.color};filter:drop-shadow(0 0 12px ${todayStar.color});"></i>
                <div class="h5 fw-bold text-white mb-2">📅 ${thaiDate}</div>
                <span class="badge px-3 py-2" style="background:${todayStar.color};color:#000;font-size:.9rem;">ดาว${dayName} (${todayStar.name}) ครองวัน</span>
                ${todayGeo ? `<div class="mt-2 p-2 rounded" style="background:rgba(255,255,255,.08);">
                    <span class="small text-white-50">ตกภูมิ</span>
                    <strong class="ms-2" style="color:#d4af37;">${todayGeo}</strong>
                    <span class="ms-2 badge" style="background:rgba(255,255,255,.12);font-size:.75rem;">${influence.level || ''}</span>
                </div>` : ''}
            </div>
            ${influence.text ? `<div class="alert mb-4 p-3" style="background:rgba(212,175,55,.1);border-left:3px solid #d4af37;border:1px solid rgba(212,175,55,.3);border-radius:8px;">
                <i class="fas fa-star-of-david me-2" style="color:#d4af37;"></i><span class="text-white small">${influence.text}</span>
            </div>` : ''}
            <div class="row g-3 mb-4">
                <div class="col-6"><div class="p-3 h-100 rounded text-center" style="background:rgba(40,167,69,.15);border:1px solid rgba(40,167,69,.4);">
                    <i class="fas fa-briefcase fa-lg text-success mb-2 d-block"></i>
                    <div class="small text-success fw-bold mb-1">การงาน</div>
                    <div class="small text-white">${pred.work || 'ดำเนินไปตามปกติ'}</div>
                </div></div>
                <div class="col-6"><div class="p-3 h-100 rounded text-center" style="background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);">
                    <i class="fas fa-coins fa-lg text-warning mb-2 d-block"></i>
                    <div class="small text-warning fw-bold mb-1">การเงิน</div>
                    <div class="small text-white">${pred.wealth || 'รายรับรายจ่ายสมดุล'}</div>
                </div></div>
                <div class="col-6"><div class="p-3 h-100 rounded text-center" style="background:rgba(220,53,69,.15);border:1px solid rgba(220,53,69,.4);">
                    <i class="fas fa-heart fa-lg text-danger mb-2 d-block"></i>
                    <div class="small text-danger fw-bold mb-1">ความรัก</div>
                    <div class="small text-white">${pred.love || 'สัมพันธ์ราบรื่น'}</div>
                </div></div>
                <div class="col-6"><div class="p-3 h-100 rounded text-center" style="background:rgba(13,202,240,.15);border:1px solid rgba(13,202,240,.4);">
                    <i class="fas fa-heartbeat fa-lg text-info mb-2 d-block"></i>
                    <div class="small text-info fw-bold mb-1">สุขภาพ</div>
                    <div class="small text-white">${geoMeaning.positive ? geoMeaning.positive.substring(0,55)+'...' : 'แข็งแรงพอสมควร'}</div>
                </div></div>
            </div>
            <div class="p-3 rounded" style="background:rgba(13,202,240,.08);border:1px solid rgba(13,202,240,.25);">
                <h6 class="fw-bold mb-3" style="color:#0dcaf0;"><i class="fas fa-pray me-2"></i>เคล็ดเสริมดวงวันนี้</h6>
                <div class="row g-2 text-center">
                    <div class="col-4"><div class="small text-white-50">🎨 สีมงคล</div><div class="small fw-bold text-white">${geoMeaning.lucky?.color || '-'}</div></div>
                    <div class="col-4"><div class="small text-white-50">🔢 เลขนำโชค</div><div class="small fw-bold text-white">${geoMeaning.lucky?.number || (todayStarId+1)}</div></div>
                    <div class="col-4"><div class="small text-white-50">🧭 ทิศมงคล</div><div class="small fw-bold text-white">${geoMeaning.lucky?.direction || DIRECTION_MASTER[todayStarId] || '-'}</div></div>
                </div>
                ${pred.remedy ? `<div class="mt-3 small text-warning"><i class="fas fa-magic me-1"></i>${pred.remedy}</div>` : ''}
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 3: ดวงประจำเดือน
// -------------------------------------------------------------------
function renderMonthlyTab(taksa, age, gender) {
    const now        = new Date();
    const monthIdx   = now.getMonth();                                          // 0–11
    const thaiYear   = now.getFullYear() + 543;
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                        'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    // แต่ละเดือนเน้นภูมิต่างกัน (วนรอบ 8 ภูมิ)
    const monthToGeo = ['บริวาร','อายุ','เดช','ศรี','มูละ','อุตสาหะ','มนตรี','กาลกิณี','บริวาร','อายุ','เดช','ศรี'];
    const focusGeo   = monthToGeo[monthIdx];
    const focusStar  = TAKSA_MASTER[taksa[focusGeo]?.id] || {};
    const focusMean  = TAKSA_DETAILED_MEANINGS[focusGeo] || {};
    const focusPred  = STAR_PREDICTIONS[taksa[focusGeo]?.id] || {};

    // ภูมิรอง (ถัดไป 1 ตำแหน่ง)
    const secGeo     = GEO_ORDER[(GEO_ORDER.indexOf(focusGeo) + 1) % 8];
    const secStar    = TAKSA_MASTER[taksa[secGeo]?.id] || {};

    const moonPhase  = monthIdx < 6
        ? 'ช่วงต้นเดือน (ข้างขึ้น) เหมาะเริ่มต้นสิ่งใหม่ · ช่วงปลายเดือน (ข้างแรม) เหมาะสรุปและปิดงาน'
        : 'ช่วงต้นเดือน (ข้างขึ้น) มีแรงหนุนโชค · ช่วงปลายเดือน (ข้างแรม) เหมาะทบทวนวางแผน';

    return `
        <div class="p-3">
            <div class="text-center mb-4 p-4 rounded" style="background:linear-gradient(135deg,rgba(90,50,180,.3),rgba(15,12,26,.9));border:2px solid rgba(212,175,55,.4);">
                <i class="fas fa-moon fa-3x mb-2" style="color:#d4af37;filter:drop-shadow(0 0 12px #d4af37);"></i>
                <div class="h5 fw-bold text-white mb-2">🗓️ ${monthNames[monthIdx]} ${thaiYear}</div>
                <span class="badge px-3 py-2" style="background:rgba(212,175,55,.3);color:#d4af37;border:1px solid #d4af37;font-size:.9rem;">ภพเด่นเดือนนี้: <strong>${focusGeo}</strong></span>
                ${focusStar.name ? `<div class="small text-white-50 mt-2">ดาวครอง: <span style="color:${focusStar.color};">${focusStar.name}</span></div>` : ''}
            </div>
            <div class="card border-0 mb-3" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12) !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-2" style="color:${focusStar.color||'#d4af37'};"><i class="fas fa-scroll me-2"></i>ภาพรวมเดือนนี้ — ${focusGeo}</h6>
                    <p class="small text-white mb-3">${focusMean.summary || 'เดือนนี้เน้นเรื่อง '+focusGeo}</p>
                    <div class="row g-2">
                        <div class="col-6"><div class="p-2 rounded" style="background:rgba(40,167,69,.15);border:1px solid rgba(40,167,69,.3);">
                            <div class="small text-success fw-bold">✅ โอกาสเดือนนี้</div>
                            <div class="small text-white mt-1">${focusMean.positive || 'มีโอกาสดี'}</div>
                        </div></div>
                        <div class="col-6"><div class="p-2 rounded" style="background:rgba(220,53,69,.15);border:1px solid rgba(220,53,69,.3);">
                            <div class="small text-danger fw-bold">⚠️ ควรระวัง</div>
                            <div class="small text-white mt-1">${focusMean.negative?.substring(0,65)||'ระมัดระวังตามสมควร'}...</div>
                        </div></div>
                    </div>
                </div>
            </div>
            <div class="card border-0 mb-3" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12) !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-3" style="color:#d4af37;"><i class="fas fa-layer-group me-2"></i>พยากรณ์รายด้านประจำเดือน</h6>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid rgba(255,255,255,.1);">
                        <span class="small text-white-50"><i class="fas fa-briefcase me-1"></i>การงาน: </span>
                        <span class="small text-white">${focusPred.work||'ดำเนินการตามปกติ'}</span>
                    </div>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid rgba(255,255,255,.1);">
                        <span class="small text-white-50"><i class="fas fa-coins me-1"></i>การเงิน: </span>
                        <span class="small text-white">${focusPred.wealth||'รายรับรายจ่ายสมดุล'}</span>
                    </div>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid rgba(255,255,255,.1);">
                        <span class="small text-white-50"><i class="fas fa-heart me-1"></i>ความรัก: </span>
                        <span class="small text-white">${focusPred.love||'ดูแลความสัมพันธ์ให้ดี'}</span>
                    </div>
                    ${secStar.name ? `<div class="mt-1 pt-1" style="border-top:1px solid rgba(255,255,255,.1);">
                        <span class="small text-white-50">ดาวรองเดือน (${secGeo}): </span>
                        <span class="small" style="color:${secStar.color};">${secStar.name} — เสริมด้าน${secGeo}ให้เด่นขึ้น</span>
                    </div>` : ''}
                </div>
            </div>
            <div class="p-3 rounded mb-3" style="background:rgba(90,50,180,.15);border:1px solid rgba(90,50,180,.4);">
                <h6 class="fw-bold mb-2" style="color:#a78bfa;"><i class="fas fa-calendar-day me-2"></i>ฤกษ์ข้างขึ้น–ข้างแรม</h6>
                <p class="small text-white mb-0">${moonPhase}</p>
            </div>
            <div class="p-3 rounded" style="background:rgba(13,202,240,.08);border:1px solid rgba(13,202,240,.25);">
                <h6 class="fw-bold mb-2" style="color:#0dcaf0;"><i class="fas fa-list-check me-2"></i>แนะนำประจำเดือนนี้</h6>
                <div class="mb-2"><span class="text-success small fw-bold">✅ ควรทำ: </span><span class="small text-white">${focusMean.advice||'ทำบุญตามกำลัง รักษาสุขภาพ'}</span></div>
                <div><span class="text-danger small fw-bold">❌ สิ่งที่ควรระวัง: </span><span class="small text-white">${focusMean.negative?.substring(0,70)||'การตัดสินใจใหญ่โดยไม่รอบคอบ'}...</span></div>
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 4: ดวงประจำปี (ขยายจาก generateYearSummary)
// -------------------------------------------------------------------
function renderYearlyTab(taksa, age, gender) {
    const thaiYear = new Date().getFullYear() + 543;
    const ageNum   = parseInt(age) || 0;

    const getStarName  = geo => TAKSA_MASTER[taksa[geo]?.id]?.name  || '?';
    const getStarColor = geo => TAKSA_MASTER[taksa[geo]?.id]?.color || '#d4af37';
    const getStarId    = geo => taksa[geo]?.id ?? -1;

    const isFem    = gender === 'female';
    const agePhase = ageNum >= 51 ? 'เก็บเกี่ยวผลบุญที่สั่งสมมา'
                   : ageNum >= 26 ? 'สร้างฐานะและบารมีให้แข็งแกร่ง'
                   : 'วางรากฐานชีวิตที่ดีที่สุด';

    const quarters = [
        { label:'Q1 ม.ค.–มี.ค.', geo:'บริวาร', icon:'fa-seedling', color:'#2ecc71' },
        { label:'Q2 เม.ย.–มิ.ย.', geo:'เดช',    icon:'fa-bolt',     color:'#f39c12' },
        { label:'Q3 ก.ค.–ก.ย.', geo:'ศรี',     icon:'fa-star',     color:'#3498db' },
        { label:'Q4 ต.ค.–ธ.ค.', geo:'มูละ',    icon:'fa-home',     color:'#9b59b6' }
    ];

    return `
        <div class="p-3">
            ${generateYearSummary(taksa, age, gender)}
            <div class="row g-3 mb-3">
                <div class="col-6"><div class="p-3 rounded text-center h-100" style="background:rgba(46,204,113,.15);border:1px solid rgba(46,204,113,.4);">
                    <i class="fas fa-gem fa-2x text-success mb-2 d-block"></i>
                    <div class="small text-success fw-bold">🌟 ดาวศรีประจำปี</div>
                    <div class="h4 fw-bold text-white my-1">ดาว${getStarName('ศรี')}</div>
                    <div class="small text-white-50">ส่งเสริมโชคลาภ สิริมงคล</div>
                </div></div>
                <div class="col-6"><div class="p-3 rounded text-center h-100" style="background:rgba(231,76,60,.15);border:1px solid rgba(231,76,60,.4);">
                    <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2 d-block"></i>
                    <div class="small text-danger fw-bold">🚫 ดาวกาลกิณี</div>
                    <div class="h4 fw-bold text-white my-1">ดาว${getStarName('กาลกิณี')}</div>
                    <div class="small text-white-50">ระวัง อุปสรรค ความเสี่ยง</div>
                </div></div>
            </div>
            <div class="card border-0 mb-3" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12) !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-3" style="color:#d4af37;"><i class="fas fa-chart-line me-2"></i>ภาพรวมรายไตรมาส ปี ${thaiYear}</h6>
                    <div class="row g-2">
                        ${quarters.map(q => {
                            const qStar = TAKSA_MASTER[getStarId(q.geo)] || {};
                            const qPred = STAR_PREDICTIONS[getStarId(q.geo)] || {};
                            return `<div class="col-6"><div class="p-2 rounded h-100" style="background:${q.color}22;border:1px solid ${q.color}55;">
                                <div class="small fw-bold mb-1" style="color:${q.color};"><i class="fas ${q.icon} me-1"></i>${q.label}</div>
                                <div class="small text-white-50">เน้น: ${q.geo}</div>
                                ${qStar.name ? `<div class="small" style="color:${qStar.color};">ดาว${qStar.name}ครอง</div>` : ''}
                                <div class="small text-white mt-1">${qPred.work?.substring(0,48)||'ดำเนินตามปกติ'}...</div>
                            </div></div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
            <div class="p-3 rounded" style="background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);">
                <h6 class="fw-bold mb-2" style="color:#d4af37;"><i class="fas fa-hourglass-half me-2"></i>ช่วงชีวิตปัจจุบัน (อายุย่าง ${ageNum} ปี)</h6>
                <p class="small text-white mb-3">วัยนี้คือช่วง<strong class="text-warning"> ${agePhase}</strong> — ${isFem ? 'ดั่งสตรีบารมีสูง อ่อนโยนแต่เฉียบคม' : 'ดั่งบุรุษมีบารมี มั่นคงเด็ดขาด'}</p>
                <div class="row g-2 text-center">
                    ${['มนตรี','อุตสาหะ','อายุ','มูละ'].map(geo => `
                    <div class="col-3">
                        <div class="small text-white-50">${geo}</div>
                        <div class="small fw-bold" style="color:${getStarColor(geo)};">ดาว${getStarName(geo)}</div>
                    </div>`).join('')}
                </div>
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 5: ดวงตลอดชีวิต
// -------------------------------------------------------------------
function renderLifetimeTab(taksa, age, gender) {
    const ageNum   = parseInt(age) || 0;
    const isFem    = gender === 'female';

    const getStarName  = geo => TAKSA_MASTER[taksa[geo]?.id]?.name  || '?';
    const getStarColor = geo => TAKSA_MASTER[taksa[geo]?.id]?.color || '#d4af37';
    const getStarIcon  = geo => TAKSA_MASTER[taksa[geo]?.id]?.icon  || 'fa-star';
    const getMean      = geo => TAKSA_DETAILED_MEANINGS[geo] || {};
    const getPred      = geo => STAR_PREDICTIONS[taksa[geo]?.id] || {};

    const coreGeo     = 'บริวาร';
    const coreStar    = TAKSA_MASTER[taksa[coreGeo]?.id] || { name:'?', color:'#d4af37', icon:'fa-star' };
    const coreMean    = getMean(coreGeo);

    const curStage    = ageNum < 26 ? 'early' : ageNum < 51 ? 'mid' : 'late';
    const stageHL     = s => s === curStage ? 'border:2px solid #d4af37 !important;box-shadow:0 0 15px rgba(212,175,55,.3);' : '';

    const stages = [
        {
            key:'early', icon:'👶', label:'ปฐมวัย', range:'แรกเกิด – 25 ปี', color:'#3498db',
            geo1:'บริวาร', geo2:'อายุ',
            title:'การวางรากฐาน · การเรียนรู้ · ครอบครัว',
            desc:`ช่วงนี้ดาว<b>${getStarName('บริวาร')}</b>ครองภูมิบริวาร สะท้อนสิ่งแวดล้อมครอบครัวและความสัมพันธ์แรกเริ่ม ประกอบกับดาว<b>${getStarName('อายุ')}</b>ครองภูมิอายุ บ่งบอกพลังชีวิตและสุขภาพในวัยเด็ก`
        },
        {
            key:'mid', icon:'🏃', label:'วัยสร้างตัว', range:'26 – 50 ปี', color:'#e67e22',
            geo1:'เดช', geo2:'อุตสาหะ',
            title:'บารมี · การงาน · ฐานะ · ความรัก',
            desc:`ช่วงพลังบุกเบิก ดาว<b>${getStarName('เดช')}</b>ครองเดชบารมี ขับเคลื่อนชื่อเสียงและอำนาจ ดาว<b>${getStarName('อุตสาหะ')}</b>ครองการงาน บ่งบอกว่ายิ่งทุ่มเทยิ่งสำเร็จ`
        },
        {
            key:'late', icon:'🏡', label:'วัยบั้นปลาย', range:'51 ปีขึ้นไป', color:'#2ecc71',
            geo1:'ศรี', geo2:'มนตรี',
            title:'ความสำเร็จ · ความสงบ · มรดก · ผู้ดูแล',
            desc:`ช่วงเก็บเกี่ยวผลบุญ ดาว<b>${getStarName('ศรี')}</b>ครองโชคลาภสิริมงคล ดาว<b>${getStarName('มนตรี')}</b>ครองผู้ใหญ่ บ่งบอกว่าจะมีคนรุ่นหลังเคารพนับถือและเกื้อกูล`
        }
    ];

    return `
        <div class="p-3">
            <div class="text-center mb-4 p-4 rounded" style="background:linear-gradient(135deg,${coreStar.color}22,rgba(15,12,26,.95));border:2px solid ${coreStar.color}66;">
                <i class="fas ${coreStar.icon} fa-3x mb-2" style="color:${coreStar.color};filter:drop-shadow(0 0 15px ${coreStar.color});"></i>
                <div class="h5 fw-bold text-white mb-1">🌟 วาสนาพื้นดวงชะตา</div>
                <div class="small text-white-50 mb-2">ดาวหลักที่กำหนดเส้นทางชีวิต</div>
                <span class="badge px-3 py-2" style="background:${coreStar.color};color:#000;font-size:.9rem;">ดาว${coreStar.name} — ${coreMean.subtitle||''}</span>
                <p class="small text-white mt-3 mb-0" style="line-height:1.7;">${coreMean.summary||''}</p>
            </div>
            <div class="row g-2 mb-4">
                <div class="col-6"><div class="p-3 rounded text-center h-100" style="background:rgba(255,193,7,.1);border:1px solid rgba(255,193,7,.3);">
                    <div class="small text-warning fw-bold mb-1">💪 พลังตลอดชีวิต</div>
                    <div class="small text-white">${coreMean.positive||'ดีตามดวงชะตา'}</div>
                </div></div>
                <div class="col-6"><div class="p-3 rounded text-center h-100" style="background:rgba(13,202,240,.1);border:1px solid rgba(13,202,240,.3);">
                    <div class="small text-info fw-bold mb-1">🎯 แนวทางชีวิต</div>
                    <div class="small text-white">${coreMean.advice||'ทำบุญสม่ำเสมอ'}</div>
                </div></div>
            </div>
            <h6 class="fw-bold mb-3" style="color:#d4af37;"><i class="fas fa-route me-2"></i>เส้นทางชีวิต 3 ช่วง</h6>
            <div class="d-flex flex-column gap-3 mb-4">
                ${stages.map(s => `
                <div class="p-3 rounded" style="background:rgba(15,12,26,.8);border-left:4px solid ${s.color};border:1px solid ${s.color}44;${stageHL(s.key)}">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span style="font-size:1.3rem;">${s.icon}</span>
                        <div>
                            <div class="fw-bold text-white">${s.label}
                                ${s.key===curStage ? '<span class="badge ms-2" style="background:#d4af37;color:#000;font-size:.68rem;">◀ ปัจจุบัน</span>' : ''}
                            </div>
                            <div class="small" style="color:${s.color};">${s.range}</div>
                        </div>
                    </div>
                    <div class="small text-white-50 fst-italic mb-2">${s.title}</div>
                    <p class="small text-white mb-2" style="line-height:1.6;">${s.desc}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        <span class="badge" style="background:${getStarColor(s.geo1)}33;color:${getStarColor(s.geo1)};border:1px solid ${getStarColor(s.geo1)}55;">
                            <i class="fas ${getStarIcon(s.geo1)} me-1"></i>ดาว${getStarName(s.geo1)} (${s.geo1})
                        </span>
                        <span class="badge" style="background:${getStarColor(s.geo2)}33;color:${getStarColor(s.geo2)};border:1px solid ${getStarColor(s.geo2)}55;">
                            <i class="fas ${getStarIcon(s.geo2)} me-1"></i>ดาว${getStarName(s.geo2)} (${s.geo2})
                        </span>
                    </div>
                </div>`).join('')}
            </div>
            <div class="card border-0 mb-3" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12) !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-3" style="color:#d4af37;"><i class="fas fa-balance-scale me-2"></i>ดุลยภาพชีวิต</h6>
                    <div class="row g-2">
                        <div class="col-6"><div class="p-2 rounded text-center" style="background:${getStarColor('มูละ')}22;border:1px solid ${getStarColor('มูละ')}55;">
                            <i class="fas fa-home" style="color:${getStarColor('มูละ')};"></i>
                            <div class="small text-white-50 mt-1">รากฐาน-มรดก (มูละ)</div>
                            <div class="small fw-bold" style="color:${getStarColor('มูละ')};">ดาว${getStarName('มูละ')}</div>
                            <div class="small text-white mt-1">${getMean('มูละ').positive?.substring(0,55)||''}...</div>
                        </div></div>
                        <div class="col-6"><div class="p-2 rounded text-center" style="background:rgba(231,76,60,.15);border:1px solid rgba(231,76,60,.4);">
                            <i class="fas fa-yin-yang" style="color:#ff6b6b;"></i>
                            <div class="small text-white-50 mt-1">บทเรียนชีวิต (กาลกิณี)</div>
                            <div class="small fw-bold text-danger">ดาว${getStarName('กาลกิณี')}</div>
                            <div class="small text-white mt-1">${getMean('กาลกิณี').positive?.substring(0,55)||''}...</div>
                        </div></div>
                    </div>
                </div>
            </div>
            <div class="p-3 rounded" style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.3);">
                <h6 class="fw-bold mb-2" style="color:#d4af37;"><i class="fas fa-scroll me-2"></i>วาระสรุปดวงชะตา</h6>
                <p class="small text-white mb-1" style="line-height:1.7;">
                    ดวงชะตาของ${isFem ? 'ท่านสตรี' : 'ท่าน'}กำหนดให้เส้นทางชีวิตเดินผ่านพลัง<b style="color:${coreStar.color};">ดาว${coreStar.name}</b>
                    ซึ่งนำพาความ<b>${coreMean.subtitle?.split('·')[0]?.trim()||'สมบูรณ์'}</b> เป็นแก่นกลางชีวิต
                    หากดูแลจุดแข็งนี้อย่างต่อเนื่อง ชีวิตจะรุ่งเรืองและมีความสุขในทุกช่วงวัย
                </p>
                <div class="small text-white-50 fst-italic">✨ ${coreMean.advice||'ทำบุญตามกำลัง เสริมสร้างปัญญา รักษาความสัมพันธ์ที่ดี'}</div>
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Render ผลลัพธ์ทั้งหมด
// -------------------------------------------------------------------
function renderTaksaResult(taksa, age, gender) {

    // --- สร้าง HTML ของ Tab 1 (8 ภูมิ เดิม) ---
    let tab1Html = '';

    // Part 1: บริวาร – ศรี
    tab1Html += `<div id="taksaPart1" class="p-3 mb-4 rounded shadow-sm" style="background:#0f0c1a;border:1px solid #d4af37;">`;
    tab1Html += `<h5 class="text-center mb-3 small" style="color:#d4af37;"><i class="fas fa-star me-2"></i>ทักษาชุดที่ 1 — บริวาร · อายุ · เดช · ศรี</h5>`;
    tab1Html += `<div class="row g-0">`;
    GEO_ORDER.slice(0, 4).forEach(key => {
        if (taksa[key]) tab1Html += `<div class="col-12 col-md-6 p-1">${createTaksaCard(key, taksa[key])}</div>`;
    });
    tab1Html += `</div></div>`;

    // Part 2: มูละ – กาลกิณี
    tab1Html += `<div id="taksaPart2" class="p-3 mb-4 rounded shadow-sm" style="background:#0f0c1a;border:1px solid #d4af37;">`;
    tab1Html += `<h5 class="text-center mb-3 small" style="color:#d4af37;"><i class="fas fa-shield-alt me-2"></i>ทักษาชุดที่ 2 — มูละ · อุตสาหะ · มนตรี · กาลกิณี</h5>`;
    tab1Html += `<div class="row g-0">`;
    GEO_ORDER.slice(4, 8).forEach(key => {
        if (taksa[key]) tab1Html += `<div class="col-12 col-md-6 p-1">${createTaksaCard(key, taksa[key])}</div>`;
    });
    tab1Html += `</div></div>`;

    // ทิศมงคล + สรุปปี
    const sriStar  = taksa['ศรี'];
    const kalaStar = taksa['กาลกิณี'];
    tab1Html += `<div id="taksaDetails" class="p-3 rounded" style="background:rgba(26,26,46,.8);">`;
    if (sriStar && kalaStar) {
        const luckyDir = DIRECTION_MASTER[sriStar.id]  || '—';
        const avoidDir = DIRECTION_MASTER[kalaStar.id] || '—';
        tab1Html += `
            <div class="card border-0 mb-4 shadow" style="background:linear-gradient(135deg,#1a1a2e,#2d1b47);">
                <div class="card-body text-center p-4">
                    <div class="row align-items-center">
                        <div class="col-6">
                            <i class="fas fa-compass fa-2x text-success mb-2"></i>
                            <div class="text-success small mb-1">ทิศมงคลปีนี้</div>
                            <div class="h5 fw-bold text-white">${luckyDir}</div>
                        </div>
                        <div class="col-6">
                            <i class="fas fa-ban fa-2x text-danger mb-2"></i>
                            <div class="text-danger small mb-1">ทิศต้องระวัง</div>
                            <div class="h5 fw-bold text-white">${avoidDir}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    tab1Html += generateYearSummary(taksa, age, gender);
    tab1Html += `</div>`; // ปิด taksaDetails

    // --- Tab styles ---
    const tabBtnBase = `style="flex:1;min-width:80px;padding:10px 6px;font-size:.78rem;font-weight:600;border:none;cursor:pointer;border-bottom:2px solid transparent;background:rgba(255,255,255,.05);color:rgba(255,255,255,.55);transition:all .25s;white-space:nowrap;"`;
    const tabBtnActive = `style="flex:1;min-width:80px;padding:10px 6px;font-size:.78rem;font-weight:600;border:none;cursor:pointer;border-bottom:2px solid #d4af37;background:rgba(212,175,55,.18);color:#d4af37;transition:all .25s;white-space:nowrap;"`;

    const tabs = [
        { key:'8geo',     icon:'fa-th',         label:'8 ภูมิทักษา' },
        { key:'daily',    icon:'fa-sun',         label:'ดวงวันนี้'    },
        { key:'monthly',  icon:'fa-moon',        label:'ดวงเดือนนี้'  },
        { key:'yearly',   icon:'fa-calendar-alt',label:'ดวงปีนี้'     },
        { key:'lifetime', icon:'fa-infinity',    label:'ดวงตลอดชีวิต' }
    ];

    // --- สร้าง HTML รวม ---
    let html = `
        <div class="text-center mb-3">
            <h3 style="color:#d4af37;" class="fw-bold mb-1">ผลผูกดวงทักษาพยากรณ์</h3>
            <p class="text-white-50 small">สยามโหรามงคล</p>
        </div>

        <!-- Tab Navigation -->
        <div style="display:flex;overflow-x:auto;background:rgba(0,0,0,.35);border-radius:12px 12px 0 0;border:1px solid rgba(212,175,55,.25);border-bottom:none;margin-bottom:0;-webkit-overflow-scrolling:touch;" class="mb-0">
            ${tabs.map((t,i) => `
            <button id="taksaTabBtn_${t.key}"
                class="taksa-tab-btn"
                onclick="switchTaksaTab('${t.key}')"
                ${i===0 ? tabBtnActive : tabBtnBase}>
                <i class="fas ${t.icon} d-block mb-1" style="font-size:1.1rem;"></i>
                ${t.label}
            </button>`).join('')}
        </div>

        <!-- Tab Contents -->
        <div style="background:rgba(15,12,26,.95);border:1px solid rgba(212,175,55,.25);border-radius:0 0 12px 12px;min-height:300px;">

            <div id="taksaTab_8geo" class="taksa-tab-content" style="display:block;">
                ${tab1Html}
            </div>

            <div id="taksaTab_daily" class="taksa-tab-content" style="display:none;">
                ${renderDailyTab(taksa, age, gender)}
            </div>

            <div id="taksaTab_monthly" class="taksa-tab-content" style="display:none;">
                ${renderMonthlyTab(taksa, age, gender)}
            </div>

            <div id="taksaTab_yearly" class="taksa-tab-content" style="display:none;">
                ${renderYearlyTab(taksa, age, gender)}
            </div>

            <div id="taksaTab_lifetime" class="taksa-tab-content" style="display:none;">
                ${renderLifetimeTab(taksa, age, gender)}
            </div>

        </div>

        <!-- ปุ่มกด (อยู่นอก tabs ไม่ติดภาพ) -->
        <div class="share-buttons-container mt-4 p-3 rounded" style="background:rgba(255,255,255,.08);">
            <p class="text-center small mb-3" style="color:#d4af37;">📸 บันทึกภาพคำทำนาย</p>
            <div class="row g-2 mb-2">
                <div class="col-4">
                    <button class="btn btn-sm btn-outline-warning w-100 py-2" onclick="downloadSpecificPart('taksaPart1','ผังทักษา_1')">ส่วนที่ 1</button>
                </div>
                <div class="col-4">
                    <button class="btn btn-sm btn-outline-warning w-100 py-2" onclick="downloadSpecificPart('taksaPart2','ผังทักษา_2')">ส่วนที่ 2</button>
                </div>
                <div class="col-4">
                    <button class="btn btn-sm btn-outline-warning w-100 py-2" onclick="downloadSpecificPart('taksaDetails','สรุปดวงปี')">สรุปดวง</button>
                </div>
            </div>
            <button class="btn btn-warning w-100 py-3 fw-bold" onclick="resetTaksa()">
                <i class="fas fa-redo-alt me-2"></i>ผูกดวงใหม่
            </button>
        </div>
    `;

    const resultEl = document.getElementById('taksaResult');
    if (resultEl) {
        resultEl.innerHTML     = html;
        resultEl.style.display = 'block';

        // เพิ่มปุ่มโพสต์ Facebook สำหรับ Admin
        if (typeof window.addFacebookPostButtonsForAdmin === 'function') {
            window.addFacebookPostButtonsForAdmin("taksaResult", () => {
                return `✨ ผลผูกดวงทักษาพยากรณ์ จากสยามโหรามงคล\nพยากรณ์ชะตาชีวิตและดาวเสวยอายุประจำปีช่วงอายุย่าง ${age} ปี\n\n• บทสรุปดวงชะตาประจำปี:\n` + (document.querySelector('#taksaResult .summary-text')?.innerText || "คำทำนายดวงชะตาประจำปีของคุณ");
            });
        }

        // Animate cards (เฉพาะ tab 1)
        setTimeout(() => {
            resultEl.querySelectorAll('.taksa-card').forEach((el, i) => {
                el.style.opacity   = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = `opacity .4s ease ${i * 0.12}s, transform .4s ease ${i * 0.12}s`;
                void el.offsetHeight;
                el.style.opacity   = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 50);
    }
}


// -------------------------------------------------------------------
//  ฟังก์ชันหลัก: ผูกดวงทักษา
// -------------------------------------------------------------------
function calculateAndShowTaksa() {
    const btn       = document.getElementById('taksaBtn');
    const ageInput  = document.getElementById('userAge');
    const daySelect = document.getElementById('birthDaySelect');

    // อ่านเพศจาก select#taksagender (UI ใช้ select ไม่ใช่ radio)
    const genderSelect = document.getElementById('taksagender');
    const gender       = genderSelect?.value || 'male';

    // Validate อายุ
    const age = parseInt(ageInput?.value);
    if (!age || age < 1 || age > 120) {
        ageInput?.focus();
        const errEl = document.getElementById('taksaAgeError');
        if (errEl) {
            errEl.textContent = 'กรุณากรอกอายุย่างให้ถูกต้อง (1–120 ปี)';
            errEl.style.display = 'block';
        } else {
            Swal.fire('แจ้งเตือน', 'กรุณากรอกอายุย่างให้ถูกต้อง (1–120 ปี)', 'warning');
        }
        return;
    }

    const errEl = document.getElementById('taksaAgeError');
    if (errEl) errEl.style.display = 'none';

    const birthDay = parseInt(daySelect?.value ?? '0');

    if (btn) {
        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>กำลังผูกดวง...';
    }

    setTimeout(() => {
        try {
            // ส่ง gender เข้า computeTaksa เพื่อเวียนซ้าย/ขวาตามตำรา
            const taksa = computeTaksa(birthDay, age, gender);
            document.getElementById('taksaInput').style.display  = 'none';
            document.getElementById('taksaResult').style.display = 'block';
            renderTaksaResult(taksa, age, gender);
            document.getElementById('taksaResult').scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            console.error('calculateAndShowTaksa error:', e);
            Swal.fire('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง', 'error');
        } finally {
            if (btn) {
                btn.disabled  = false;
                btn.innerHTML = '✨ ผูกดวงทักษา';
            }
        }
    }, 700);
}

function showtaksatable(){
    const container = document.getElementById('taksaTablepage')
    if (container) {
        container.style.display = 'block';
    }

    const html = `
            <div class="card-header bg-dark border-gold text-center py-4">
            <i class="fas fa-dharmachakra fa-5x text-gold mb-4 animate__animated animate__rotateIn"></i>
                <h2 class="text-gold mb-1">☸️ ทักษาพยากรณ์</h2>
                <span class="text-white-50 mb-0 small">คำนวณดาวเสวยอายุและภูมิพยากรณ์ตามตำราหลวง</span>
            
            <div class="card-body text-center">
                <div id="taksaInput" class="py-4">
                    <h4>ระบุข้อมูลเพื่อผูกดวงทักษา</h4>

                <div class="form-group mb-3">
                    <label class="text-gold">เลือกสมาชิกจากประวัติ:</label>
                    <select class="form-control bg-black text-black border-gold member-selector-shared"
                        onchange="autoFillMemberData(this.value)">
                        <option value="">-- เลือกสมาชิก --</option>
                    </select>
                </div>

                    <div class="form-group mt-2 mx-auto" style="max-width: 300px;">
                        <label class="text-gold">เพศ (ทิศเวียนทักษา)</label>
                        <select id="taksagender" class="form-control bg-dark text-white border-gold" style="height: 55px;"> 
                            <option value="male"> ชาย (เวียนขวา)</option>
                            <option value="female"> หญิง (เวียนซ้าย)</option>
                        </select>
                    </div>
                    <div class="form-group mt-2 mx-auto" style="max-width: 300px;">
                        <label class="text-white-50">วันเกิด</label>
                        <select id="birthDaySelect" class="form-control bg-dark text-white border-gold"
                            style="height: 55px;">
                            <option value="0">วันอาทิตย์</option>
                            <option value="1">วันจันทร์</option>
                            <option value="2">วันอังคาร</option>
                            <option value="3">วันพุธ (กลางวัน)</option>
                            <option value="7">วันพุธ (กลางคืน/ราหู)</option>
                            <option value="4">วันพฤหัสบดี</option>
                            <option value="5">วันศุกร์</option>
                            <option value="6">วันเสาร์</option>
                        </select>
                    </div>
                    <div class="form-group mt-2 mx-auto" style="max-width: 300px;">
                        <label class="text-white-50">อายุย่าง = อายุในปีปัจจุบัน <br>(นับแบบไทย ถ้ายังไม่ถึงวันเกิดให้
                            +1)</label>
                        <input type="number" id="userAge" class="form-control bg-dark text-white border-gold"
                            placeholder="เช่น 25" min="1" max="120" required style="height: 55px;">
                    </div>
                    <button class="btn btn-gold btn-lg px-5 mt-4 shadow-lg" onclick="calculateAndShowTaksa()" id="taksaBtn">
                        ✨ ผูกดวงทักษา
                    </button>
                </div>
                <div id="taksaResult" class="mt-2" style="display: none;">
                    <div id="taksaDisplay"></div>
                </div>
            </div>
        </div> 
                    <div class="row mt-4">
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                                <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                                <i class="fas fa-home"></i> กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    showtaksatable();
    const inputEl = document.getElementById('taksaTablepage');
    if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') calculateAndShowTaksa();
        });
    }
});

// -------------------------------------------------------------------
//  ดาวน์โหลดภาพเฉพาะส่วน
// -------------------------------------------------------------------
async function downloadSpecificPart(elementId, fileName) {
    const area = document.getElementById(elementId);
    if (!area) return;

    const shareBtns = document.querySelector('.share-buttons-container');
    if (shareBtns) shareBtns.style.visibility = 'hidden';

    const savedStyle = area.style.cssText;
    try {
        area.style.padding       = '25px';
        area.style.borderRadius  = '0';

        const canvas = await html2canvas(area, {
            scale:           2.5,
            backgroundColor: '#0f0c1a',
            useCORS:         true,
            logging:         false,
            scrollY:         -window.scrollY
        });

        const link      = document.createElement('a');
        link.download   = `${fileName}_สยามโหรา_${Date.now()}.png`;
        link.href       = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error('downloadSpecificPart error:', e);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้ กรุณาลองใหม่', 'error');
    } finally {
        area.style.cssText = savedStyle;
        if (shareBtns) shareBtns.style.visibility = 'visible';
    }
}

// -------------------------------------------------------------------
//  ดาวน์โหลดภาพทั้งผลลัพธ์ (legacy — ยังคงไว้เพื่อ backward compat)
// -------------------------------------------------------------------
async function downloadTaksaImage() {
    const element = document.getElementById('taksaResult');
    if (!element || element.style.display === 'none') {
        Swal.fire('แจ้งเตือน', 'กรุณาผูกดวงทักษาก่อนทำการบันทึกภาพ', 'warning');
        return;
    }
    if (typeof html2canvas === 'undefined') {
        return Swal.fire('กรุณารอสักครู่', 'ระบบกำลังโหลดโมดูลสร้างรูปภาพ...', 'info');
    }

    const btn         = document.querySelector('.btn-download-taksa, [onclick="downloadTaksaImage()"]');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>กำลังเตรียมภาพ...';
    }

    const actionButtons  = element.querySelectorAll('button, .btn, .no-export');
    const savedElemStyle = element.style.cssText;

    try {
        actionButtons.forEach(el => { el.style.visibility = 'hidden'; });

        element.style.padding    = '30px';
        element.style.background = 'linear-gradient(135deg,#0f0c1a 0%,#1a1a2e 100%)';
        element.style.borderRadius = '0';

        const canvas = await html2canvas(element, {
            scale:           2.2,
            backgroundColor: '#0f0c1a',
            useCORS:         true,
            logging:         false,
            scrollX:         0,
            scrollY:         0
        });

        const link      = document.createElement('a');
        link.download   = `ทักษาพยากรณ์_${Date.now()}.png`;
        link.href       = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('downloadTaksaImage error:', err);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    } finally {
        actionButtons.forEach(el => { el.style.visibility = 'visible'; });
        element.style.cssText = savedElemStyle;
        if (btn) {
            btn.innerHTML = originalHTML;
            btn.disabled  = false;
        }
    }
}