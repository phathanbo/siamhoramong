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
//  สร้าง Card แต่ละภูมิ (EduNova Light SaaS Dashboard Style)
// -------------------------------------------------------------------
function createTaksaCard(geoKey, taksaStar) {
    const m    = TAKSA_DETAILED_MEANINGS[geoKey];
    if (!m) return '';

    const star  = TAKSA_MASTER[taksaStar.id] || { name: "ไม่ทราบ", color: "#4f46e5", icon: "fa-question" };
    const pred  = STAR_PREDICTIONS[taksaStar.id] || {};
    const nat   = STAR_NATURES[taksaStar.id]     || {};

    return `
        <div class="card taksa-card border-0 mb-3" style="border-radius: 20px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #f1f5f9 !important; transition: transform 0.2s, box-shadow 0.2s;">

            <!-- Header -->
            <div class="py-3 px-4 d-flex align-items-center justify-content-between" style="border-bottom: 1px solid #f1f5f9; background: #ffffff; border-radius: 20px 20px 0 0;">
                <div class="d-flex align-items-center gap-3">
                    <div style="width: 44px; height: 44px; border-radius: 14px; background: ${star.color}15; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${star.icon}" style="color: ${star.color}; font-size: 1.25rem;"></i>
                    </div>
                    <div>
                        <h5 class="mb-0 fw-bold" style="color: #1e293b; font-size: 1.1rem;">ภูมิ${m.title}</h5>
                        <div style="color: #64748b; font-size: 0.82rem;">${m.subtitle}</div>
                    </div>
                </div>
                <span class="badge px-3 py-2" style="font-size: 0.85rem; font-weight: 700; background: ${star.color}15; color: ${star.color}; border-radius: 30px;">
                    ดาว${star.name}
                </span>
            </div>

            <div class="card-body p-4 text-dark">

                <!-- ธรรมชาติดาว -->
                ${nat.trait ? `
                <div class="mb-3 px-3 py-2 rounded-3" style="background: #f8fafc; border-left: 3px solid ${star.color};">
                    <small style="color: #475569;"><i class="fas fa-sparkles me-1" style="color:${star.color};"></i>${nat.trait}</small>
                </div>` : ''}

                <!-- ภาพรวม -->
                <div class="mb-3 p-3 rounded-3" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                    <div class="fw-bold mb-1" style="color: #334155; font-size: 0.88rem;"><i class="fas fa-info-circle me-1" style="color:${star.color};"></i> อิทธิพลประจำภูมิ</div>
                    <p class="mb-0" style="font-size: 0.88rem; line-height: 1.6; color: #475569;">${m.summary}</p>
                </div>

                <!-- ผลดี / ผลร้าย -->
                <div class="row g-2 mb-3">
                    <div class="col-md-6">
                        <div class="h-100 p-3 rounded-3" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
                            <div class="fw-bold mb-1" style="color: #15803d; font-size: 0.82rem;"><i class="fas fa-check-circle me-1"></i> เมื่อดาวส่งผลดี</div>
                            <p class="mb-0" style="font-size: 0.82rem; line-height: 1.5; color: #166534;">${m.positive}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="h-100 p-3 rounded-3" style="background: #fef2f2; border: 1px solid #fecaca;">
                            <div class="fw-bold mb-1" style="color: #b91c1c; font-size: 0.82rem;"><i class="fas fa-exclamation-circle me-1"></i> ข้อควรระวัง</div>
                            <p class="mb-0" style="font-size: 0.82rem; line-height: 1.5; color: #991b1b;">${m.negative}</p>
                        </div>
                    </div>
                </div>

                <!-- พยากรณ์รายด้าน -->
                ${pred.work ? `
                <div class="mb-3 p-3 rounded-3" style="background: #ffffff; border: 1px solid #e2e8f0;">
                    <div class="fw-bold mb-2" style="color: #1e293b; font-size: 0.88rem;"><i class="fas fa-chart-pie me-1 text-primary"></i> พยากรณ์จำแนกหมวด</div>
                    <div class="mb-1" style="font-size: 0.85rem; color: #475569;"><strong style="color:#0284c7;"><i class="fas fa-briefcase me-1"></i>การงาน/การเรียน:</strong> ${pred.work}</div>
                    <div class="mb-1" style="font-size: 0.85rem; color: #475569;"><strong style="color:#d97706;"><i class="fas fa-coins me-1"></i>การเงิน:</strong> ${pred.wealth}</div>
                    <div class="mb-0" style="font-size: 0.85rem; color: #475569;"><strong style="color:#e11d48;"><i class="fas fa-heart me-1"></i>ความรัก:</strong> ${pred.love}</div>
                </div>` : ''}

                <!-- ตัวอย่างสถานการณ์จริง -->
                <div class="p-3 rounded-3 mb-3" style="background: #fffbeb; border: 1px solid #fef3c7;">
                    <div class="fw-bold mb-2" style="color: #b45309; font-size: 0.85rem;"><i class="fas fa-lightbulb me-1"></i> สถานการณ์จริงที่พบบ่อย</div>
                    <ul class="mb-0 ps-3" style="font-size: 0.82rem; color: #78350f; line-height: 1.6;">
                        ${m.realLifeExamples.map(ex => `<li class="mb-1">${ex}</li>`).join('')}
                    </ul>
                </div>

                <!-- เคล็ดเสริมดวง -->
                <div class="p-3 rounded-3" style="background: #f0f9ff; border: 1px solid #e0f2fe;">
                    <div class="fw-bold mb-2" style="color: #0369a1; font-size: 0.85rem;"><i class="fas fa-pray me-1"></i> เคล็ดเสริมดวง & วัตถุมงคล</div>
                    <p class="mb-2" style="font-size: 0.82rem; color: #0c4a6e; line-height: 1.5;">${m.advice}</p>
                    ${pred.remedy ? `<p class="mb-2" style="font-size: 0.82rem; color: #b45309;"><i class="fas fa-magic me-1"></i>${pred.remedy}</p>` : ''}
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        <span class="badge py-2 px-3" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; font-size: 0.78rem;">🎨 สีมงคล: ${m.lucky.color}</span>
                        <span class="badge py-2 px-3" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; font-size: 0.78rem;">🔢 เลขมงคล: ${m.lucky.number}</span>
                        <span class="badge py-2 px-3" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; font-size: 0.78rem;">🧭 ทิศมงคล: ${m.lucky.direction}</span>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// -------------------------------------------------------------------
//  สร้างบทสรุปดวงปี (EduNova Clean Style)
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
            return '<div class="p-3 text-center text-muted">-- ไม่สามารถสร้างคำทำนายรายปีได้ --</div>';
        }

        const ageNum  = parseInt(age) || 0;
        const isFem   = gender === 'female';
        const tone    = isFem ? 'อ่อนโยนแต่เฉียบคม' : 'มั่นคงและเด็ดขาด';
        const pronoun = isFem ? 'ท่านสตรี' : 'ท่านสุภาพบุรุษ';
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
            ${agePhase} ขอให้${pronoun}ผ่านปีนี้ไปอย่างรุ่งโรจน์`;

        return `
            <div id="yearSummarySection" class="card border-0 mt-4 mb-4" style="border-radius: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border: 1px solid #bbf7d0 !important; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                <div class="card-header py-3 px-4 d-flex align-items-center justify-content-between" style="background: transparent; border-bottom: 1px solid #dcfce7;">
                    <div class="d-flex align-items-center gap-2">
                        <span style="font-size:1.3rem;">✨</span>
                        <h5 class="mb-0 fw-bold" style="color: #166534;">บทสรุปดวงชะตาปี ${thaiYear}</h5>
                    </div>
                    ${ageNum > 0 ? `<span class="badge" style="background: #166534; color: #fff; border-radius:20px; padding:6px 14px;">อายุย่าง ${ageNum} ปี</span>` : ''}
                </div>
                <div class="card-body p-4" style="line-height: 1.8; font-size: 0.95rem; color: #1e293b !important;">
                    <p class="mb-3" style="color: #1e293b !important; text-shadow: none !important;">${p1.trim()}</p>
                    <p class="mb-0" style="color: #1e293b !important; text-shadow: none !important;">${p2.trim()}</p>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('generateYearSummary error:', err);
        return '';
    }
}

// -------------------------------------------------------------------
//  Tab switcher สำหรับผลทักษา (EduNova Style)
// -------------------------------------------------------------------
function switchTaksaTab(tabName) {
    document.querySelectorAll('.taksa-tab-content').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.taksa-tab-btn').forEach(el => {
        el.classList.remove('active');
        el.style.background = '';
        el.style.color      = '';
        el.style.fontWeight = '';
    });
    const content = document.getElementById(`taksaTab_${tabName}`);
    if (content) content.style.display = 'block';
    const btn = document.getElementById(`taksaTabBtn_${tabName}`);
    if (btn) {
        btn.classList.add('active');
    }
}

// -------------------------------------------------------------------
//  Tab 2: ดวงประจำวัน (Clean Light Style)
// -------------------------------------------------------------------
function renderDailyTab(taksa, age, gender) {
    const now         = new Date();
    const dayOfWeek   = now.getDay();
    const todayStarId = dayOfWeek;
    const dayNames    = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
    const dayName     = dayNames[dayOfWeek];
    const todayStar   = TAKSA_MASTER[todayStarId] || { name:'ไม่ทราบ', color:'#3b82f6', icon:'fa-star' };
    const pred        = STAR_PREDICTIONS[todayStarId] || {};

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
        <div class="p-2">
            <div class="text-center mb-4 p-4 rounded-4" style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border: 1px solid #bfdbfe;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: #dbeafe; display: inline-flex; align-items: center; justify-content: center;" class="mb-2">
                    <i class="fas ${todayStar.icon} fa-2x text-primary"></i>
                </div>
                <div class="h5 fw-bold text-dark mb-1">📅 ${thaiDate}</div>
                <span class="badge px-3 py-2" style="background:#3b82f6; color:#fff; font-size:.85rem; border-radius:20px;">ดาว${dayName} (${todayStar.name}) ครองวัน</span>
                ${todayGeo ? `<div class="mt-2 p-2 rounded-3 d-inline-block" style="background:#ffffff; border:1px solid #cbd5e1;">
                    <span class="small text-muted">ตกภูมิ</span>
                    <strong class="ms-2 text-primary">${todayGeo}</strong>
                    <span class="ms-2 badge" style="background:#f1f5f9; color:#334155; font-size:.75rem;">${influence.level || ''}</span>
                </div>` : ''}
            </div>
            ${influence.text ? `<div class="alert mb-4 p-3 rounded-3" style="background:#eff6ff; border-left:4px solid #3b82f6; border:1px solid #dbeafe;">
                <i class="fas fa-info-circle text-primary me-2"></i><span class="text-dark small">${influence.text}</span>
            </div>` : ''}
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-3"><div class="p-3 h-100 rounded-4 text-center" style="background:#f0fdf4; border:1px solid #bbf7d0;">
                    <i class="fas fa-briefcase fa-lg text-success mb-2 d-block"></i>
                    <div class="small text-success fw-bold mb-1">การงาน</div>
                    <div class="small text-muted">${pred.work || 'ดำเนินไปตามปกติ'}</div>
                </div></div>
                <div class="col-6 col-md-3"><div class="p-3 h-100 rounded-4 text-center" style="background:#fefce8; border:1px solid #fef08a;">
                    <i class="fas fa-coins fa-lg text-warning mb-2 d-block"></i>
                    <div class="small text-warning fw-bold mb-1">การเงิน</div>
                    <div class="small text-muted">${pred.wealth || 'รายรับรายจ่ายสมดุล'}</div>
                </div></div>
                <div class="col-6 col-md-3"><div class="p-3 h-100 rounded-4 text-center" style="background:#fff1f2; border:1px solid #fecdd3;">
                    <i class="fas fa-heart fa-lg text-danger mb-2 d-block"></i>
                    <div class="small text-danger fw-bold mb-1">ความรัก</div>
                    <div class="small text-muted">${pred.love || 'สัมพันธ์ราบรื่น'}</div>
                </div></div>
                <div class="col-6 col-md-3"><div class="p-3 h-100 rounded-4 text-center" style="background:#f0f9ff; border:1px solid #bae6fd;">
                    <i class="fas fa-heartbeat fa-lg text-info mb-2 d-block"></i>
                    <div class="small text-info fw-bold mb-1">สุขภาพ</div>
                    <div class="small text-muted">${geoMeaning.positive ? geoMeaning.positive.substring(0,40)+'...' : 'แข็งแรงดี'}</div>
                </div></div>
            </div>
            <div class="p-3 rounded-4" style="background:#ffffff; border:1px solid #e2e8f0;">
                <h6 class="fw-bold mb-3 text-dark"><i class="fas fa-magic text-primary me-2"></i> เคล็ดเสริมดวงวันนี้</h6>
                <div class="row g-2 text-center">
                    <div class="col-4"><div class="small text-muted">🎨 สีมงคล</div><div class="small fw-bold text-dark">${geoMeaning.lucky?.color || '-'}</div></div>
                    <div class="col-4"><div class="small text-muted">🔢 เลขนำโชค</div><div class="small fw-bold text-dark">${geoMeaning.lucky?.number || (todayStarId+1)}</div></div>
                    <div class="col-4"><div class="small text-muted">🧭 ทิศมงคล</div><div class="small fw-bold text-dark">${geoMeaning.lucky?.direction || DIRECTION_MASTER[todayStarId] || '-'}</div></div>
                </div>
                ${pred.remedy ? `<div class="mt-3 small text-primary"><i class="fas fa-lightbulb me-1"></i>${pred.remedy}</div>` : ''}
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 3: ดวงประจำเดือน (Clean Light Style)
// -------------------------------------------------------------------
function renderMonthlyTab(taksa, age, gender) {
    const now        = new Date();
    const monthIdx   = now.getMonth();
    const thaiYear   = now.getFullYear() + 543;
    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                        'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    const monthToGeo = ['บริวาร','อายุ','เดช','ศรี','มูละ','อุตสาหะ','มนตรี','กาลกิณี','บริวาร','อายุ','เดช','ศรี'];
    const focusGeo   = monthToGeo[monthIdx];
    const focusStar  = TAKSA_MASTER[taksa[focusGeo]?.id] || {};
    const focusMean  = TAKSA_DETAILED_MEANINGS[focusGeo] || {};
    const focusPred  = STAR_PREDICTIONS[taksa[focusGeo]?.id] || {};

    const secGeo     = GEO_ORDER[(GEO_ORDER.indexOf(focusGeo) + 1) % 8];
    const secStar    = TAKSA_MASTER[taksa[secGeo]?.id] || {};

    const moonPhase  = monthIdx < 6
        ? 'ช่วงต้นเดือน (ข้างขึ้น) เหมาะเริ่มต้นสิ่งใหม่ · ช่วงปลายเดือน (ข้างแรม) เหมาะสรุปและปิดงาน'
        : 'ช่วงต้นเดือน (ข้างขึ้น) มีแรงหนุนโชค · ช่วงปลายเดือน (ข้างแรม) เหมาะทบทวนวางแผน';

    return `
        <div class="p-2">
            <div class="text-center mb-4 p-4 rounded-4" style="background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%); border: 1px solid #ddd6fe;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: #ede9fe; display: inline-flex; align-items: center; justify-content: center;" class="mb-2">
                    <i class="fas fa-moon fa-2x text-primary"></i>
                </div>
                <div class="h5 fw-bold text-dark mb-1">🗓️ ${monthNames[monthIdx]} ${thaiYear}</div>
                <span class="badge px-3 py-2" style="background:#8b5cf6; color:#fff; font-size:.85rem; border-radius:20px;">ภพเด่นเดือนนี้: <strong>${focusGeo}</strong></span>
                ${focusStar.name ? `<div class="small text-muted mt-2">ดาวครอง: <strong style="color:${focusStar.color};">${focusStar.name}</strong></div>` : ''}
            </div>
            <div class="card border-0 mb-3 rounded-4" style="background:#ffffff; border:1px solid #e2e8f0 !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-2 text-dark"><i class="fas fa-scroll me-2 text-primary"></i> ภาพรวมเดือนนี้ — ${focusGeo}</h6>
                    <p class="small text-muted mb-3">${focusMean.summary || 'เดือนนี้เน้นเรื่อง '+focusGeo}</p>
                    <div class="row g-2">
                        <div class="col-6"><div class="p-2 rounded-3" style="background:#f0fdf4; border:1px solid #bbf7d0;">
                            <div class="small text-success fw-bold">✅ โอกาสเดือนนี้</div>
                            <div class="small text-dark mt-1">${focusMean.positive || 'มีโอกาสดี'}</div>
                        </div></div>
                        <div class="col-6"><div class="p-2 rounded-3" style="background:#fef2f2; border:1px solid #fecaca;">
                            <div class="small text-danger fw-bold">⚠️ ควรระวัง</div>
                            <div class="small text-dark mt-1">${focusMean.negative?.substring(0,55)||'ระมัดระวังตามสมควร'}...</div>
                        </div></div>
                    </div>
                </div>
            </div>
            <div class="card border-0 mb-3 rounded-4" style="background:#ffffff; border:1px solid #e2e8f0 !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-3 text-dark"><i class="fas fa-layer-group me-2 text-primary"></i> พยากรณ์รายด้านประจำเดือน</h6>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid #f1f5f9;">
                        <span class="small text-muted"><i class="fas fa-briefcase me-1"></i>การงาน: </span>
                        <span class="small text-dark">${focusPred.work||'ดำเนินการตามปกติ'}</span>
                    </div>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid #f1f5f9;">
                        <span class="small text-muted"><i class="fas fa-coins me-1"></i>การเงิน: </span>
                        <span class="small text-dark">${focusPred.wealth||'รายรับรายจ่ายสมดุล'}</span>
                    </div>
                    <div class="mb-2 pb-2" style="border-bottom:1px solid #f1f5f9;">
                        <span class="small text-muted"><i class="fas fa-heart me-1"></i>ความรัก: </span>
                        <span class="small text-dark">${focusPred.love||'ดูแลความสัมพันธ์ให้ดี'}</span>
                    </div>
                    ${secStar.name ? `<div class="mt-1 pt-1">
                        <span class="small text-muted">ดาวรองเดือน (${secGeo}): </span>
                        <span class="small fw-bold" style="color:${secStar.color};">${secStar.name} — เสริมด้าน${secGeo}ให้เด่นขึ้น</span>
                    </div>` : ''}
                </div>
            </div>
            <div class="p-3 rounded-4" style="background:#f8fafc; border:1px solid #e2e8f0;">
                <h6 class="fw-bold mb-2 text-dark"><i class="fas fa-calendar-day me-2 text-primary"></i> ฤกษ์ข้างขึ้น–ข้างแรม</h6>
                <p class="small text-muted mb-0">${moonPhase}</p>
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 4: ดวงประจำปี (Clean Light Style)
// -------------------------------------------------------------------
function renderYearlyTab(taksa, age, gender) {
    const thaiYear = new Date().getFullYear() + 543;
    const ageNum   = parseInt(age) || 0;

    const getStarName  = geo => TAKSA_MASTER[taksa[geo]?.id]?.name  || '?';
    const getStarColor = geo => TAKSA_MASTER[taksa[geo]?.id]?.color || '#3b82f6';
    const getStarId    = geo => taksa[geo]?.id ?? -1;

    const quarters = [
        { label:'Q1 ม.ค.–มี.ค.', geo:'บริวาร', icon:'fa-seedling', color:'#10b981' },
        { label:'Q2 เม.ย.–มิ.ย.', geo:'เดช',    icon:'fa-bolt',     color:'#f59e0b' },
        { label:'Q3 ก.ค.–ก.ย.', geo:'ศรี',     icon:'fa-star',     color:'#3b82f6' },
        { label:'Q4 ต.ค.–ธ.ค.', geo:'มูละ',    icon:'fa-home',     color:'#8b5cf6' }
    ];

    return `
        <div class="p-2">
            ${generateYearSummary(taksa, age, gender)}
            <div class="row g-3 mb-3">
                <div class="col-6"><div class="p-3 rounded-4 text-center h-100" style="background:#f0fdf4; border:1px solid #bbf7d0;">
                    <i class="fas fa-gem fa-2x text-success mb-2 d-block"></i>
                    <div class="small text-success fw-bold">🌟 ดาวศรีประจำปี</div>
                    <div class="h4 fw-bold text-dark my-1">ดาว${getStarName('ศรี')}</div>
                    <div class="small text-muted">ส่งเสริมโชคลาภ สิริมงคล</div>
                </div></div>
                <div class="col-6"><div class="p-3 rounded-4 text-center h-100" style="background:#fef2f2; border:1px solid #fecaca;">
                    <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2 d-block"></i>
                    <div class="small text-danger fw-bold">🚫 ดาวกาลกิณี</div>
                    <div class="h4 fw-bold text-dark my-1">ดาว${getStarName('กาลกิณี')}</div>
                    <div class="small text-muted">ระวัง อุปสรรค ความเสี่ยง</div>
                </div></div>
            </div>
            <div class="card border-0 mb-3 rounded-4" style="background:#ffffff; border:1px solid #e2e8f0 !important;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-3 text-dark"><i class="fas fa-chart-line me-2 text-primary"></i> ภาพรวมรายไตรมาส ปี ${thaiYear}</h6>
                    <div class="row g-2">
                        ${quarters.map(q => {
                            const qStar = TAKSA_MASTER[getStarId(q.geo)] || {};
                            const qPred = STAR_PREDICTIONS[getStarId(q.geo)] || {};
                            return `<div class="col-6"><div class="p-3 rounded-3 h-100" style="background:#f8fafc; border:1px solid #e2e8f0;">
                                <div class="small fw-bold mb-1" style="color:${q.color};"><i class="fas ${q.icon} me-1"></i>${q.label}</div>
                                <div class="small text-muted">เน้น: ${q.geo}</div>
                                ${qStar.name ? `<div class="small fw-bold" style="color:${qStar.color};">ดาว${qStar.name}ครอง</div>` : ''}
                                <div class="small text-dark mt-1">${qPred.work?.substring(0,40)||'ดำเนินตามปกติ'}...</div>
                            </div></div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Tab 5: ดวงตลอดชีวิต (Clean Light Style)
// -------------------------------------------------------------------
function renderLifetimeTab(taksa, age, gender) {
    const ageNum   = parseInt(age) || 0;
    const isFem    = gender === 'female';

    const getStarName  = geo => TAKSA_MASTER[taksa[geo]?.id]?.name  || '?';
    const getStarColor = geo => TAKSA_MASTER[taksa[geo]?.id]?.color || '#3b82f6';
    const getStarIcon  = geo => TAKSA_MASTER[taksa[geo]?.id]?.icon  || 'fa-star';
    const getMean      = geo => TAKSA_DETAILED_MEANINGS[geo] || {};

    const coreGeo     = 'บริวาร';
    const coreStar    = TAKSA_MASTER[taksa[coreGeo]?.id] || { name:'?', color:'#3b82f6', icon:'fa-star' };
    const coreMean    = getMean(coreGeo);

    const curStage    = ageNum < 26 ? 'early' : ageNum < 51 ? 'mid' : 'late';

    const stages = [
        {
            key:'early', icon:'👶', label:'ปฐมวัย', range:'แรกเกิด – 25 ปี', color:'#3b82f6',
            geo1:'บริวาร', geo2:'อายุ',
            title:'การวางรากฐาน · การเรียนรู้ · ครอบครัว',
            desc:`ช่วงนี้ดาว<b>${getStarName('บริวาร')}</b>ครองภูมิบริวาร สะท้อนสิ่งแวดล้อมครอบครัวและความสัมพันธ์แรกเริ่ม ประกอบกับดาว<b>${getStarName('อายุ')}</b>ครองภูมิอายุ บ่งบอกพลังชีวิตและสุขภาพในวัยเด็ก`
        },
        {
            key:'mid', icon:'🏃', label:'วัยสร้างตัว', range:'26 – 50 ปี', color:'#f59e0b',
            geo1:'เดช', geo2:'อุตสาหะ',
            title:'บารมี · การงาน · ฐานะ · ความรัก',
            desc:`ช่วงพลังบุกเบิก ดาว<b>${getStarName('เดช')}</b>ครองเดชบารมี ขับเคลื่อนชื่อเสียงและอำนาจ ดาว<b>${getStarName('อุตสาหะ')}</b>ครองการงาน บ่งบอกว่ายิ่งทุ่มเทยิ่งสำเร็จ`
        },
        {
            key:'late', icon:'🏡', label:'วัยบั้นปลาย', range:'51 ปีขึ้นไป', color:'#10b981',
            geo1:'ศรี', geo2:'มนตรี',
            title:'ความสำเร็จ · ความสงบ · มรดก · ผู้ดูแล',
            desc:`ช่วงเก็บเกี่ยวผลบุญ ดาว<b>${getStarName('ศรี')}</b>ครองโชคลาภสิริมงคล ดาว<b>${getStarName('มนตรี')}</b>ครองผู้ใหญ่ บ่งบอกว่าจะมีคนรุ่นหลังเคารพนับถือและเกื้อกูล`
        }
    ];

    return `
        <div class="p-2">
            <div class="text-center mb-4 p-4 rounded-4" style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border: 1px solid #bfdbfe;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: #dbeafe; display: inline-flex; align-items: center; justify-content: center;" class="mb-2">
                    <i class="fas ${coreStar.icon} fa-2x text-primary"></i>
                </div>
                <div class="h5 fw-bold text-dark mb-1">🌟 วาสนาพื้นดวงชะตา</div>
                <div class="small text-muted mb-2">ดาวหลักที่กำหนดเส้นทางชีวิต</div>
                <span class="badge px-3 py-2" style="background:#3b82f6; color:#fff; font-size:.85rem; border-radius:20px;">ดาว${coreStar.name} — ${coreMean.subtitle||''}</span>
                <p class="small text-dark mt-3 mb-0" style="line-height:1.7;">${coreMean.summary||''}</p>
            </div>
            <h6 class="fw-bold mb-3 text-dark"><i class="fas fa-route me-2 text-primary"></i> เส้นทางชีวิต 3 ช่วง</h6>
            <div class="d-flex flex-column gap-3 mb-4">
                ${stages.map(s => `
                <div class="p-3 rounded-4" style="background:#ffffff; border-left:4px solid ${s.color}; border:1px solid #e2e8f0; ${s.key===curStage ? 'box-shadow:0 4px 15px rgba(59,130,246,0.15);' : ''}">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span style="font-size:1.3rem;">${s.icon}</span>
                        <div>
                            <div class="fw-bold text-dark">${s.label}
                                ${s.key===curStage ? '<span class="badge ms-2" style="background:#3b82f6; color:#fff; font-size:.7rem;">◀ ปัจจุบัน</span>' : ''}
                            </div>
                            <div class="small fw-bold" style="color:${s.color};">${s.range}</div>
                        </div>
                    </div>
                    <p class="small text-dark mb-2" style="line-height:1.6;">${s.desc}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        <span class="badge" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1;">
                            <i class="fas ${getStarIcon(s.geo1)} me-1"></i>ดาว${getStarName(s.geo1)} (${s.geo1})
                        </span>
                        <span class="badge" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1;">
                            <i class="fas ${getStarIcon(s.geo2)} me-1"></i>ดาว${getStarName(s.geo2)} (${s.geo2})
                        </span>
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
}

// -------------------------------------------------------------------
//  Render ผลลัพธ์ทั้งหมด (EduNova Light SaaS Dashboard Structure)
// -------------------------------------------------------------------
function renderTaksaResult(taksa, age, gender) {

    // --- สร้าง HTML ของ Tab 1 (8 ภูมิ) ---
    let tab1Html = '';

    // Part 1: บริวาร – ศรี
    tab1Html += `<div id="taksaPart1" class="mb-4">`;
    tab1Html += `<div class="d-flex align-items-center gap-2 mb-3"><div style="width:4px; height:18px; background:#3b82f6; border-radius:2px;"></div><h5 class="mb-0 fw-bold" style="color:#1e293b;">ทักษาชุดที่ 1 — บริวาร · อายุ · เดช · ศรี</h5></div>`;
    tab1Html += `<div class="row g-3">`;
    GEO_ORDER.slice(0, 4).forEach(key => {
        if (taksa[key]) tab1Html += `<div class="col-12 col-lg-6">${createTaksaCard(key, taksa[key])}</div>`;
    });
    tab1Html += `</div></div>`;

    // Part 2: มูละ – กาลกิณี
    tab1Html += `<div id="taksaPart2" class="mb-4">`;
    tab1Html += `<div class="d-flex align-items-center gap-2 mb-3"><div style="width:4px; height:18px; background:#8b5cf6; border-radius:2px;"></div><h5 class="mb-0 fw-bold" style="color:#1e293b;">ทักษาชุดที่ 2 — มูละ · อุตสาหะ · มนตรี · กาลกิณี</h5></div>`;
    tab1Html += `<div class="row g-3">`;
    GEO_ORDER.slice(4, 8).forEach(key => {
        if (taksa[key]) tab1Html += `<div class="col-12 col-lg-6">${createTaksaCard(key, taksa[key])}</div>`;
    });
    tab1Html += `</div></div>`;

    // ทิศมงคล + สรุปปี
    const sriStar  = taksa['ศรี'];
    const kalaStar = taksa['กาลกิณี'];
    tab1Html += `<div id="taksaDetails">`;
    if (sriStar && kalaStar) {
        const luckyDir = DIRECTION_MASTER[sriStar.id]  || '—';
        const avoidDir = DIRECTION_MASTER[kalaStar.id] || '—';
        tab1Html += `
            <div class="row g-3 mb-4">
                <div class="col-6">
                    <div class="p-4 rounded-4 text-center" style="background:#f0fdf4; border:1px solid #bbf7d0;">
                        <i class="fas fa-compass fa-2x text-success mb-2"></i>
                        <div class="text-success small fw-bold mb-1">ทิศมงคลปีนี้</div>
                        <div class="h4 fw-bold text-dark">${luckyDir}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-4 rounded-4 text-center" style="background:#fef2f2; border:1px solid #fecaca;">
                        <i class="fas fa-ban fa-2x text-danger mb-2"></i>
                        <div class="text-danger small fw-bold mb-1">ทิศต้องระวัง</div>
                        <div class="h4 fw-bold text-dark">${avoidDir}</div>
                    </div>
                </div>
            </div>`;
    }
    tab1Html += generateYearSummary(taksa, age, gender);
    tab1Html += `</div>`;

    const tabs = [
        { key:'8geo',     icon:'fa-th-large',    label:'8 ภูมิทักษา' },
        { key:'daily',    icon:'fa-sun',         label:'ดวงวันนี้'    },
        { key:'monthly',  icon:'fa-moon',        label:'ดวงเดือนนี้'  },
        { key:'yearly',   icon:'fa-calendar-alt',label:'ดวงปีนี้'     },
        { key:'lifetime', icon:'fa-infinity',    label:'ดวงตลอดชีวิต' }
    ];

    let html = `
        <!-- Liquid Glass Tab Navigation -->
        <div class="d-flex gap-2 p-2 mb-4 taksa-glass-tab-container" style="overflow-x:auto;">
            ${tabs.map((t,i) => `
            <button id="taksaTabBtn_${t.key}"
                class="taksa-tab-btn flex-fill d-flex align-items-center justify-content-center gap-2 ${i===0 ? 'active' : ''}"
                onclick="switchTaksaTab('${t.key}')">
                <i class="fas ${t.icon}"></i>
                ${t.label}
            </button>`).join('')}
        </div>

        <!-- Tab Contents -->
        <div>
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

        <!-- Export & Reset Buttons (Liquid Glass Style) -->
        <div class="p-4 mt-4 taksa-glass-card">
            <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                <div class="d-flex flex-wrap gap-2">
                    <button class="taksa-glass-pill" onclick="downloadSpecificPart('taksaPart1','ผังทักษา_1')">
                        <i class="fas fa-download"></i> เซฟทักษา 1
                    </button>
                    <button class="taksa-glass-pill" onclick="downloadSpecificPart('taksaPart2','ผังทักษา_2')">
                        <i class="fas fa-download"></i> เซฟทักษา 2
                    </button>
                    <button class="taksa-glass-pill taksa-glass-pill-emerald" onclick="downloadSpecificPart('taksaDetails','สรุปดวงปี')">
                        <i class="fas fa-file-image"></i> เซฟสรุปปี
                    </button>
                </div>
                <button class="taksa-glass-pill taksa-glass-pill-primary" onclick="resetTaksa()">
                    <i class="fas fa-redo-alt"></i> ผูกดวงใหม่อีกครั้ง
                </button>
            </div>
        </div>
    `;

    const resultEl = document.getElementById('taksaResult');
    if (resultEl) {
        resultEl.innerHTML     = html;
        resultEl.style.display = 'block';

        if (typeof window.addFacebookPostButtonsForAdmin === 'function') {
            window.addFacebookPostButtonsForAdmin("taksaResult", () => {
                return `✨ ผลผูกดวงทักษาพยากรณ์ จากสยามโหรามงคล\nพยากรณ์ชะตาชีวิตและดาวเสวยอายุประจำปีช่วงอายุย่าง ${age} ปี\n\n• บทสรุปดวงชะตาประจำปี:\n` + (document.querySelector('#taksaResult .summary-text')?.innerText || "คำทำนายดวงชะตาประจำปีของคุณ");
            });
        }
    }
}

// -------------------------------------------------------------------
//  สร้างหน้า Dashboard ทักษาพยากรณ์ (EduNova AI Theme)
// -------------------------------------------------------------------
function showtaksatable(){
    const container = document.getElementById('taksaTablepage');
    if (!container) return;
    container.style.display = 'block';

    const now = new Date();
    const thaiDate = now.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

    const html = `
        <style>
            #taksaTablepage input,
            #taksaTablepage select,
            #taksaTablepage .form-control,
            #taksaTablepage .form-select,
            #taksaTablepage .member-selector-shared {
                background-color: #ffffff !important;
                color: #0f172a !important;
                border: 1.5px solid #cbd5e1 !important;
                border-radius: 12px !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
            }
            #taksaTablepage select option {
                background-color: #ffffff !important;
                color: #0f172a !important;
                padding: 10px 14px !important;
            }
            #taksaTablepage input:focus,
            #taksaTablepage select:focus {
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
            }
            /* High-contrast fixes: ป้องกันตัวหนังสือสีขาวกลืนกับพื้นหลังขาว/เขียวอ่อน/การ์ดทักษา */
            #taksaTablepage .card {
                background-color: #ffffff !important;
                color: #1e293b !important;
            }
            #taksaTablepage .card-body,
            #taksaTablepage .card-body p,
            #taksaTablepage .card-body div,
            #taksaTablepage .card-body span:not(.badge),
            #taksaTablepage p,
            #taksaTablepage .taksa-card p,
            #yearSummarySection,
            #yearSummarySection .card-body,
            #yearSummarySection p {
                color: #1e293b !important;
                text-shadow: none !important;
            }
            #yearSummarySection {
                background: #ffffff !important;
                border: 1.5px solid #86efac !important;
            }
            #yearSummarySection .card-header h5 {
                color: #15803d !important;
            }
            #taksaResult, #taksaResult * {
                -webkit-text-fill-color: initial;
            }
            /* =========================================================
               🔮 LIQUID GLASS KIT STYLING (iOS / VisionOS Ultra Glass)
               ========================================================= */
            .taksa-glass-tab-container {
                background: rgba(255, 255, 255, 0.55) !important;
                backdrop-filter: blur(20px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                border: 1px solid rgba(255, 255, 255, 0.8) !important;
                border-radius: 9999px !important;
                padding: 6px 8px !important;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
                            inset 0 1px 2px rgba(255, 255, 255, 0.9),
                            inset 0 -1px 2px rgba(0, 0, 0, 0.03) !important;
            }

            .taksa-tab-btn {
                border: none !important;
                outline: none !important;
                background: transparent !important;
                color: #64748b !important;
                font-weight: 500 !important;
                font-size: 0.9rem !important;
                padding: 9px 20px !important;
                border-radius: 9999px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                white-space: nowrap !important;
                cursor: pointer !important;
            }

            .taksa-tab-btn:hover {
                color: #0f172a !important;
                background: rgba(255, 255, 255, 0.6) !important;
            }

            .taksa-tab-btn.active {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)) !important;
                color: #0f172a !important;
                font-weight: 700 !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08),
                            0 1px 3px rgba(0, 0, 0, 0.05),
                            inset 0 1px 1px #ffffff,
                            inset 0 -1px 1px rgba(0,0,0,0.06) !important;
                transform: scale(1.02);
            }

            /* Liquid Glass Pill Button - Base */
            .taksa-glass-pill {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                padding: 10px 24px !important;
                border-radius: 9999px !important;
                font-weight: 600 !important;
                font-size: 0.92rem !important;
                text-decoration: none !important;
                letter-spacing: normal !important;
                text-transform: none !important;
                cursor: pointer !important;
                position: relative !important;
                overflow: hidden !important;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                
                /* Frosted Transparent Liquid Glass */
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.4) 100%) !important;
                backdrop-filter: blur(16px) saturate(190%) !important;
                -webkit-backdrop-filter: blur(16px) saturate(190%) !important;
                border: 1px solid rgba(255, 255, 255, 0.9) !important;
                color: #1e293b !important;
                box-shadow: 0 10px 24px -4px rgba(100, 116, 139, 0.16),
                            0 2px 6px rgba(0, 0, 0, 0.04),
                            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95),
                            inset 0 -1.5px 2px rgba(0, 0, 0, 0.05) !important;
            }

            .taksa-glass-pill::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 48% !important;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
                border-radius: 9999px 9999px 0 0 !important;
                pointer-events: none !important;
            }

            .taksa-glass-pill:hover {
                transform: translateY(-2px) scale(1.02) !important;
                color: #0f172a !important;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.55) 100%) !important;
                box-shadow: 0 14px 28px -4px rgba(100, 116, 139, 0.25),
                            0 4px 10px rgba(0, 0, 0, 0.06),
                            inset 0 2px 2px rgba(255, 255, 255, 1),
                            inset 0 -1.5px 2px rgba(0, 0, 0, 0.06) !important;
            }

            .taksa-glass-pill:active {
                transform: translateY(1px) scale(0.98) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1),
                            inset 0 2px 4px rgba(0, 0, 0, 0.08) !important;
            }

            /* Liquid Glass Pill - Primary Purple / Blue Gradient (Like Liquid Glass Kit "secondary" violet) */
            .taksa-glass-pill-primary {
                background: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #4f46e5 100%) !important;
                border: 1px solid rgba(255, 255, 255, 0.55) !important;
                color: #ffffff !important;
                box-shadow: 0 12px 26px -4px rgba(124, 58, 237, 0.45),
                            0 4px 12px rgba(99, 102, 241, 0.25),
                            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.65),
                            inset 0 -2px 3px rgba(0, 0, 0, 0.2) !important;
            }

            .taksa-glass-pill-primary:hover {
                color: #ffffff !important;
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6366f1 100%) !important;
                box-shadow: 0 16px 32px -4px rgba(124, 58, 237, 0.55),
                            0 6px 16px rgba(99, 102, 241, 0.35),
                            inset 0 2px 2px rgba(255, 255, 255, 0.8) !important;
            }

            /* Liquid Glass Pill - Cyan / Emerald (Like Liquid Glass Kit "Secondary" cyan) */
            .taksa-glass-pill-cyan {
                background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #0284c7 100%) !important;
                border: 1px solid rgba(255, 255, 255, 0.6) !important;
                color: #ffffff !important;
                box-shadow: 0 12px 26px -4px rgba(6, 182, 212, 0.45),
                            0 4px 12px rgba(14, 165, 233, 0.25),
                            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.7),
                            inset 0 -2px 3px rgba(0, 0, 0, 0.15) !important;
            }

            .taksa-glass-pill-cyan:hover {
                color: #ffffff !important;
                background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0ea5e9 100%) !important;
                box-shadow: 0 16px 32px -4px rgba(6, 182, 212, 0.55),
                            inset 0 2px 2px rgba(255, 255, 255, 0.85) !important;
            }

            /* Liquid Glass Pill - Emerald Green */
            .taksa-glass-pill-emerald {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
                border: 1px solid rgba(255, 255, 255, 0.6) !important;
                color: #ffffff !important;
                box-shadow: 0 12px 24px -4px rgba(16, 185, 129, 0.4),
                            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.65),
                            inset 0 -2px 3px rgba(0, 0, 0, 0.15) !important;
            }

            .taksa-glass-pill-emerald:hover {
                color: #ffffff !important;
                background: linear-gradient(135deg, #34d399 0%, #10b981 100%) !important;
                box-shadow: 0 16px 30px -4px rgba(16, 185, 129, 0.5),
                            inset 0 2px 2px rgba(255, 255, 255, 0.85) !important;
            }

            /* Liquid Glass Container Cards */
            .taksa-glass-card {
                background: rgba(255, 255, 255, 0.6) !important;
                backdrop-filter: blur(20px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                border: 1.5px solid rgba(255, 255, 255, 0.85) !important;
                border-radius: 24px !important;
                box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.05),
                            0 0 0 1px rgba(255, 255, 255, 0.5),
                            inset 0 1.5px 2px rgba(255, 255, 255, 0.95) !important;
            }
        </style>
        <div style="background: #f8fafc; min-height: 100vh; padding: 24px 16px; font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; color: #1e293b;">
            <div class="container-fluid" style="max-width: 1360px; margin: 0 auto;">

                <!-- TOP BAR -->
                <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom flex-wrap gap-3" style="border-color: #e2e8f0 !important;">
                    <div class="d-flex align-items-center gap-3">
                        <div style="width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(37,99,235,0.28);">
                            <i class="fas fa-dharmachakra fa-lg"></i>
                        </div>
                        <div>
                            <h4 class="mb-0 fw-bold" style="color: #0f172a; font-size: 1.3rem;">ทักษาพยากรณ์</h4>
                            <small class="text-muted"><i class="fas fa-compass me-1 text-primary"></i> ภูมิพยากรณ์ ๘ ทิศ · มหาทักษาจักรหลวง</small>
                        </div>
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <button class="taksa-glass-pill" style="padding: 8px 18px !important; font-size: 0.85rem !important;" onclick="navigateTo('mainpage')">
                            <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
                        </button>
                        <button class="taksa-glass-pill" style="padding: 8px 18px !important; font-size: 0.85rem !important;" onclick="goBack()">
                            <i class="fas fa-home"></i> หน้าหลัก
                        </button>
                    </div>
                </div>

                <!-- MAIN LAYOUT GRID -->
                <div class="row g-4">

                    <!-- LEFT / MAIN CONTENT (9 Cols) -->
                    <div class="col-12 col-xl-9">

                        <!-- HERO WELCOME BANNER -->
                        <div class="card border-0 mb-4 overflow-hidden position-relative taksa-glass-card" style="border-radius: 24px; background: linear-gradient(135deg, rgba(239, 246, 255, 0.7) 0%, rgba(240, 253, 244, 0.7) 100%) !important;">
                            <div class="card-body p-4 p-md-5 d-flex flex-wrap align-items-center justify-content-between position-relative" style="z-index: 2;">
                                <div class="col-12 col-md-8 mb-3 mb-md-0">
                                    <span class="badge px-3 py-1 mb-2 fw-bold" style="background: rgba(124, 58, 237, 0.12); color: #7c3aed; border-radius: 20px; font-size: 0.82rem;">
                                        ✨ คำนวณตามคัมภีร์มหาทักษาหลวงโบราณ
                                    </span>
                                    <h2 class="fw-bold mb-2" style="color: #0f172a; font-size: clamp(1.4rem, 2.8vw, 2rem);">
                                        ระบบผูกดวงและวิเคราะห์มหาทักษา ☸️
                                    </h2>
                                    <p class="text-muted mb-3" style="font-size: 0.95rem; line-height: 1.6;">
                                        คำนวณดาวครอง 8 ภูมิพยากรณ์, ดาวเสวยอายุ, ดาวแทรก, ดาวศรี และดาวกาลกิณีประจำช่วงวัย พร้อมคำทำนายเชิงลึก
                                    </p>
                                    <button class="taksa-glass-pill taksa-glass-pill-cyan" onclick="document.getElementById('taksaInputConsole').scrollIntoView({behavior:'smooth'})">
                                        เริ่มผูกดวงชะตาทันที <i class="fas fa-arrow-down ms-1"></i>
                                    </button>
                                </div>
                                <div class="col-12 col-md-4 text-center d-flex align-items-center justify-content-center">
                                    <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(124, 58, 237, 0.15)); display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.2); border: 1px solid rgba(255, 255, 255, 0.8);">
                                        <i class="fas fa-dharmachakra" style="font-size: 4rem; color: #0284c7; opacity: 0.9;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 4 STATS METRIC CARDS (EduNova KPI Cards) -->
                        <div class="row g-3 mb-4">
                            <div class="col-6 col-md-3">
                                <div class="p-3 rounded-4 bg-white" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted fw-semibold">ภูมิคุ้มครอง</span>
                                        <div style="width:32px; height:32px; border-radius:10px; background:#eff6ff; display:flex; align-items:center; justify-content:center; color:#3b82f6;">
                                            <i class="fas fa-compass"></i>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-1" style="color: #0f172a;">8 ภูมิ</h4>
                                    <small class="text-success fw-bold" style="font-size:0.75rem;"><i class="fas fa-arrow-up"></i> บริวาร ถึง กาลกิณี</small>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-3 rounded-4 bg-white" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted fw-semibold">ดาวครองทิศ</span>
                                        <div style="width:32px; height:32px; border-radius:10px; background:#f0fdf4; display:flex; align-items:center; justify-content:center; color:#10b981;">
                                            <i class="fas fa-star"></i>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-1" style="color: #0f172a;">8 พระเคราะห์</h4>
                                    <small class="text-success fw-bold" style="font-size:0.75rem;"><i class="fas fa-check"></i> อาทิตย์ ถึง ราหู</small>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-3 rounded-4 bg-white" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted fw-semibold">รอบเสวยอายุ</span>
                                        <div style="width:32px; height:32px; border-radius:10px; background:#fefce8; display:flex; align-items:center; justify-content:center; color:#f59e0b;">
                                            <i class="fas fa-hourglass-half"></i>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-1" style="color: #0f172a;">108 ปี</h4>
                                    <small class="text-warning fw-bold" style="font-size:0.75rem;">มหาทักษาจักร</small>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-3 rounded-4 bg-white" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted fw-semibold">มิติวิเคราะห์</span>
                                        <div style="width:32px; height:32px; border-radius:10px; background:#f5f3ff; display:flex; align-items:center; justify-content:center; color:#8b5cf6;">
                                            <i class="fas fa-chart-line"></i>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-1" style="color: #0f172a;">5 ไทม์ไลน์</h4>
                                    <small class="text-primary fw-bold" style="font-size:0.75rem;">วัน, เดือน, ปี, ชีวิต</small>
                                </div>
                            </div>
                        </div>

                        <!-- INPUT CONSOLE CARD -->
                        <div id="taksaInputConsole" class="card border-0 mb-4 rounded-4 bg-white" style="box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9 !important;">
                            <div class="card-header py-3 px-4 bg-white d-flex align-items-center justify-content-between" style="border-bottom: 1px solid #f1f5f9;">
                                <div class="d-flex align-items-center gap-2">
                                    <div style="width:8px; height:8px; border-radius:50%; background:#3b82f6;"></div>
                                    <h5 class="mb-0 fw-bold" style="color: #0f172a; font-size:1.05rem;">กรอกข้อมูลเพื่อผูกดวงทักษา</h5>
                                </div>
                                <span class="badge" style="background:#f1f5f9; color:#64748b; font-size:0.8rem;">Quick Setup</span>
                            </div>

                            <div class="card-body p-4">
                                <div id="taksaInput">
                                    
                                    <!-- Member Selector -->
                                    <div class="mb-3 p-3 rounded-3" style="background:#f8fafc; border:1px solid #e2e8f0;">
                                        <label class="form-label small fw-bold text-dark mb-1">
                                            <i class="fas fa-users text-primary me-1"></i> ดึงข้อมูลจากฐานสมาชิก (ตัวเลือกเสริม):
                                        </label>
                                        <select class="form-select member-selector-shared" onchange="autoFillMemberData(this.value)" style="border-radius:10px; font-size:0.9rem; padding:10px 14px; font-weight:600;">
                                            <option value="">-- เลือกจากฐานข้อมูลสมาชิก --</option>
                                        </select>
                                    </div>

                                    <div class="row g-3">
                                        <!-- Gender -->
                                        <div class="col-md-4">
                                            <label class="form-label small fw-bold text-dark">
                                                <i class="fas fa-venus-mars text-primary me-1"></i> เพศ (ทิศเวียนทักษา)
                                            </label>
                                            <select id="taksagender" class="form-select fw-semibold" style="border-radius:12px; height:48px; font-size:0.95rem;">
                                                <option value="male">👨 ชาย (เวียนขวา)</option>
                                                <option value="female">👩 หญิง (เวียนซ้าย)</option>
                                            </select>
                                        </div>

                                        <!-- Birth Day -->
                                        <div class="col-md-4">
                                            <label class="form-label small fw-bold text-dark">
                                                <i class="fas fa-calendar-day text-primary me-1"></i> วันเกิดตามสัปดาห์
                                            </label>
                                            <select id="birthDaySelect" class="form-select fw-semibold" style="border-radius:12px; height:48px; font-size:0.95rem;">
                                                <option value="0">วันอาทิตย์ (๑)</option>
                                                <option value="1">วันจันทร์ (๒)</option>
                                                <option value="2">วันอังคาร (๓)</option>
                                                <option value="3">วันพุธ กลางวัน (๔)</option>
                                                <option value="7">วันพุธ กลางคืน / ราหู (๘)</option>
                                                <option value="4">วันพฤหัสบดี (๕)</option>
                                                <option value="5">วันศุกร์ (๖)</option>
                                                <option value="6">วันเสาร์ (๗)</option>
                                            </select>
                                        </div>

                                        <!-- Age -->
                                        <div class="col-md-4">
                                            <label class="form-label small fw-bold text-dark">
                                                <i class="fas fa-hourglass-half text-primary me-1"></i> อายุย่าง (ปี)
                                            </label>
                                            <input type="number" id="userAge" class="form-control fw-bold text-center" placeholder="เช่น 28" min="1" max="120" style="border-radius:12px; height:48px; font-size:1.1rem; color:#0f172a;">
                                            <div id="taksaAgeError" class="text-danger small mt-1" style="display:none;"></div>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between mt-4 pt-3 border-top flex-wrap gap-2" style="border-color:#f1f5f9 !important;">
                                        <small class="text-muted"><i class="fas fa-info-circle me-1"></i> นับอายุเต็ม + 1 ปี หากยังไม่ถึงวันเกิดปีนี้</small>
                                        <button class="taksa-glass-pill taksa-glass-pill-primary" onclick="calculateAndShowTaksa()" id="taksaBtn">
                                            <i class="fas fa-bolt"></i> คำนวณผูกดวงทักษา
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- RESULT SECTION -->
                        <div id="taksaResult" style="display: none;"></div>

                    </div><!-- /col-xl-9 -->

                    <!-- RIGHT SIDEBAR (3 Cols - EduNova Calendar & Activity Panel) -->
                    <div class="col-12 col-xl-3">
                        
                        <!-- CALENDAR WIDGET -->
                        <div class="p-4 rounded-4 bg-white mb-4" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h6 class="fw-bold mb-0 text-dark">ปฏิทินดาราศาสตร์</h6>
                                <span class="badge" style="background:#eff6ff; color:#3b82f6; font-size:0.75rem;">${thaiDate}</span>
                            </div>
                            
                            <div class="d-flex flex-column gap-2">
                                <div class="d-flex align-items-center justify-content-between p-2 rounded-3" style="background:#f8fafc;">
                                    <div class="d-flex align-items-center gap-2">
                                        <span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
                                        <span class="small fw-semibold text-dark">วันธงชัย</span>
                                    </div>
                                    <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.7rem;">ฤกษ์ดี</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-2 rounded-3" style="background:#f8fafc;">
                                    <div class="d-flex align-items-center gap-2">
                                        <span style="width:8px; height:8px; border-radius:50%; background:#3b82f6;"></span>
                                        <span class="small fw-semibold text-dark">วันอธิบดี</span>
                                    </div>
                                    <span class="badge" style="background:#dbeafe; color:#1d4ed8; font-size:0.7rem;">เจริญก้าวหน้า</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-2 rounded-3" style="background:#f8fafc;">
                                    <div class="d-flex align-items-center gap-2">
                                        <span style="width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                                        <span class="small fw-semibold text-dark">วันอุบาทว์ / โลกาวินาศ</span>
                                    </div>
                                    <span class="badge" style="background:#fee2e2; color:#b91c1c; font-size:0.7rem;">พึงระวัง</span>
                                </div>
                            </div>
                        </div>

                        <!-- QUICK TIPS -->
                        <div class="p-4 rounded-4 bg-white mb-4" style="border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.03);">
                            <h6 class="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                                <i class="fas fa-lightbulb text-warning"></i> เคล็ดลับการใช้ทักษา
                            </h6>
                            
                            <div class="d-flex gap-3 mb-3 pb-3 border-bottom" style="border-color:#f1f5f9 !important;">
                                <div style="width:36px; height:36px; border-radius:10px; background:#eff6ff; display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0;">
                                    <i class="fas fa-tshirt"></i>
                                </div>
                                <div>
                                    <div class="fw-bold" style="font-size:0.85rem; color:#0f172a;">การแต่งกายเสริมศรี</div>
                                    <small class="text-muted" style="font-size:0.78rem;">เลือกสวมใส่เสื้อผ้าโทนสว่างหรือสีที่เข้ากับดาวครองวัน</small>
                                </div>
                            </div>

                            <div class="d-flex gap-3 mb-3 pb-3 border-bottom" style="border-color:#f1f5f9 !important;">
                                <div style="width:36px; height:36px; border-radius:10px; background:#fefce8; display:flex; align-items:center; justify-content:center; color:#f59e0b; flex-shrink:0;">
                                    <i class="fas fa-hand-holding-heart"></i>
                                </div>
                                <div>
                                    <div class="fw-bold" style="font-size:0.85rem; color:#0f172a;">เสริมบารมีแก้กาลกิณี</div>
                                    <small class="text-muted" style="font-size:0.78rem;">ทำบุญปล่อยปลา เติมน้ำมันตะเกียง เสริมพลังธาตุ</small>
                                </div>
                            </div>

                            <div class="d-flex gap-3">
                                <div style="width:36px; height:36px; border-radius:10px; background:#f0fdf4; display:flex; align-items:center; justify-content:center; color:#10b981; flex-shrink:0;">
                                    <i class="fas fa-comments"></i>
                                </div>
                                <div>
                                    <div class="fw-bold" style="font-size:0.85rem; color:#0f172a;">การเจรจาติดต่อ</div>
                                    <small class="text-muted" style="font-size:0.78rem;">ใช้คำพูดสุภาพอ่อนโยน จะได้ความเมตตาจากมนตรี</small>
                                </div>
                            </div>
                        </div>

                        <!-- NAVIGATION BACK -->
                        <div class="d-flex flex-column gap-2">
                            <button class="taksa-glass-pill w-100" onclick="navigateTo('mainpage')">
                                <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
                            </button>
                            <button class="taksa-glass-pill w-100" onclick="goBack()">
                                <i class="fas fa-home"></i> กลับหน้าหลัก
                            </button>
                        </div>

                    </div><!-- /col-xl-3 -->

                </div><!-- /row -->

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