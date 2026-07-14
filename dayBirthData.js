"use strict";

// ---------------------------------------------------------------------------
// ตารางแปลง direction key → ชื่อทิศภาษาไทย
// ใช้ใน showDayInfo() เพื่อแสดงชื่อทิศที่อ่านได้แทน key ภาษาอังกฤษ
// ---------------------------------------------------------------------------
const DIRECTION_LABELS = {
    north:              "ทิศเหนือ",
    northeast:          "ทิศตะวันออกเฉียงเหนือ (อีสาน)",
    east:               "ทิศตะวันออก (บูรพา)",
    southeast:          "ทิศตะวันออกเฉียงใต้ (อาคเนย์)",
    south:              "ทิศใต้ (ทักษิณ)",
    southwest:          "ทิศตะวันตกเฉียงใต้ (หรดี)",
    west:               "ทิศตะวันตก (ประจิม)",
    northwest:          "ทิศตะวันตกเฉียงเหนือ (พายัพ)",
    east_south:         "ทิศตะวันออก-ใต้",
    north_east:         "ทิศเหนือ-ตะวันออก",
    west_north:         "ทิศตะวันตก-เหนือ",
    west_south:         "ทิศตะวันตก-ใต้",
    northeast_southeast:"ทิศตะวันออกเฉียงเหนือ-อาคเนย์",
    southeast_southwest:"ทิศตะวันออกเฉียงใต้-หรดี"
};

// ---------------------------------------------------------------------------
// ข้อมูลวันเกิด — นาม ลักษณะนิสัย เกณฑ์อายุ และทิศมงคล
// แก้ไข: thursday.meta และ friday.meta ใช้นามสัตว์ที่ถูกต้องตามตำรา
// ---------------------------------------------------------------------------
const dayBirthData = {
    1: {
        name:      "วันอาทิตย์",
        meta:      "นามครุฑ ",
        character: "จิตใจเป็นกุศลยิ่งใหญ่ ทำคุณคนมักไม่ค่อยขึ้นเหมือนรดน้ำบนต้นไม้เหี่ยว เชื่อคนง่ายจนบางครั้งต้องลำบากภายหลัง",
        milestones: [
            { age: 21,      detail: "พบความทุกข์ร้อน จิตใจไม่ตั้งมั่น" },
            { age: 25,      detail: "ระวังเรื่องถ้อยความและคดีความที่ทำให้เหนื่อยยาก" },
            { age: "26-27", detail: "ระวังคำพูดตนเองให้มาก พ้นจากนี้จะมีลาภผลตราบชรา" }
        ],
        directions: {
            south:     "ทิศศรี (มงคล) เหมาะทำสวนปลูกดอกไม้",
            northeast: "อายุสม (ส่งเสริมอายุ) ให้ประดิษฐานเจดีย์หรือพระบูชา",
            east:      "ควรมีบ่อธารน้ำ",
            southeast: "ทิศตั้งยุ้งฉางและครัวไฟ",
            north:     "ทิศสำหรับบริวารและคอกสัตว์",
            southwest: "ที่เก็บอาวุธและของมีคม",
            west:      "ทิศส่งเสริมยศถาบรรดาศักดิ์"
        }
    },
    2: {
        name:      "วันจันทร์",
        meta:      "นามพยัคฆ์ (เสือ)",
        character: "มีวาทศิลป์ดี แต่ปากร้ายทำให้คนมักเป็นศัตรู โกรธง่ายหายเร็ว เก็บเงินไม่อยู่มักเรี่ยราดร่อยหรอ",
        milestones: [
            { age: 15,   detail: "ร้อนใจเพราะคบคนพาล" },
            { age: 23,   detail: "จะเริ่มมีสมบัติและโชคลาภตามใจหวัง" },
            { age: 30,   detail: "ระวังเคราะห์ร้ายแรงที่อาจเกิดขึ้น" },
            { age: "50+",detail: "ชีวิตจะสุขใจเจริญศรีไปจนสิ้นสกุล" }
        ],
        directions: {
            east_south: "ที่ไหว้พระและสิ่งศักดิ์สิทธิ์",
            southeast:  "ควรเป็นสระน้ำหรือบ่อน้ำ",
            northeast:  "สวนดอกไม้เพื่อความร่มเย็น",
            southwest:  "ที่อยู่บ่าวไพร่และสัตว์เลี้ยง",
            north:      "ทิศตั้งยุ้งฉาง",
            northwest:  "ทิศสำหรับครัวไฟ"
        }
    },
    3: {
        name:      "วันอังคาร",
        meta:      "นามสีหราช (สิงโต) ",
        character: "ใจแข็ง มั่นคงในตัวเอง ชอบอาสา มักมีไฝปานที่ใบหน้า พึ่งพาญาติพี่น้องไม่ได้ ต้องสร้างตัวด้วยตัวเองเท่านั้น",
        milestones: [
            { age: 15,      detail: "ช่วงชีวิตที่โศกเศร้า" },
            { age: 25,      detail: "ระวังโรคภัยรุมเร้า" },
            { age: "30-40", detail: "ช่วงมรสุมชีวิต มีความทุกข์รายวัน พ้นจากนี้จะพบสุข" }
        ],
        directions: {
            northeast_southeast: "ทิศสำหรับวางรูปพระบูชา",
            east:      "ทิศสวนหย่อม",
            north:     "ทิศบ่อน้ำหรือธารน้ำ",
            southwest: "ยุ้งฉางและคอกสัตว์",
            west:      "ที่เก็บเครื่องศาสตราอาวุธ",
            northwest: "ทิศครัวไฟ",
            south:     "ทิศมงคลที่ช่วยให้พ้นโพยภัย"
        }
    },
    4: {
        name:      "วันพุธ",
        meta:      "นามสุนัข ",
        character: "รอบรู้ในสรรพการ ขยันขันแข็ง พูดจาอาจหาญไม่กลัวใคร มักต้องไปได้ดีในถิ่นอื่นที่ไม่ใช่บ้านเกิด",
        milestones: [
            { age: 13, detail: "ระวังโรคภัยและคดีความรบกวน" },
            { age: 50, detail: "มีสมบัติพั่งคั่ง เสวยสุขสำราญ" },
            { age: 58, detail: "ระวังอาการเจ็บป่วยหนักหรือมีภัย" }
        ],
        directions: {
            north_east: "ที่ประดิษฐานพระปฏิมาหรือเจดีย์",
            southeast:  "ทิศสำหรับสวนหย่อม",
            northeast:  "ที่ตั้งครัวไฟ",
            southwest:  "ทิศสระน้ำหรือบ่อน้ำ",
            west:       "ทิศตั้งยุ้งฉาง",
            south:      "ที่เก็บศาสตราอาวุธ",
            northwest:  "ที่อยู่บริวารและสัตว์เลี้ยง"
        }
    },
    5: {
        name:      "วันพฤหัสบดี",
        meta:      "นามมฤคราช (กวาง) ",
        character: "ปัญญาสูง รักการศึกษาเชี่ยวชาญการเขียนและโวหาร โมโหดุแต่จิตใจดี เป็นที่รักของคนทั่วไป",
        milestones: [
            { age: 15,          detail: "พบความโศกเศร้าอาภัพ" },
            { age: "วัยผู้ใหญ่", detail: "เจริญด้วยยศศักดิ์และลาภผล มีความสุขเหมือนอยู่ในวัง" }
        ],
        directions: {
            west_north: "ที่ตั้งเจดีย์หรือพระพุทธรูป",
            east:       "ที่เก็บอาวุธ",
            northwest:  "ทิศขุดสระน้ำ",
            southwest:  "สวนหย่อมมงคล",
            south:      "ที่ตั้งยุ้งฉาง",
            northeast:  "ที่อยู่บริวารและคอกสัตว์",
            southeast:  "ทิศสำหรับครัวไฟ"
        }
    },
    6: {
        name:      "วันศุกร์",
        meta:      "นามอุสุภราช (วัว)",
        character: "จิตใจมักทะเยอทะยาน มีวาทศิลป์ดีแต่บางครั้งปากร้าย โกรธง่ายหายเร็ว หาเงินเก่งแต่ใช้เก่ง",
        milestones: [
            { age: 11, detail: "มีอาการเจ็บป่วยบ่อยครั้ง" },
            { age: 25, detail: "เริ่มตั้งตัวได้ มีคู่คิดและมิตรดี" },
            { age: 40, detail: "ดวงการงานเด่น มีคู่ครองที่รักใคร่" },
            { age: 60, detail: "มีลาภยศสมบูรณ์พูนผล" }
        ],
        directions: {
            west_south: "ทิศสำหรับเจดีย์หรือรูปพระ",
            northeast:  "ทิศสระน้ำกินน้ำใช้",
            north:      "ที่เก็บศาสตราอาวุธ",
            east:       "ที่ตั้งยุ้งฉาง",
            southeast:  "ที่อยู่บริวารและคอกสัตว์",
            southwest:  "ทิศสำหรับครัวไฟ"
        }
    },
    7: {
        name:      "วันเสาร์",
        meta:      "นามนาคา (พญานาค)",
        character: "จิตใจดุร้ายโกรธหนัก รักพวกพ้องแบบนักเลง มีกามราคีสูง มักมีรอยแผลตามตัว ชีวิตมีอุปสรรคแต่จะรวยตอนท้าย",
        milestones: [
            { age: 15,   detail: "ต้องเสียของรัก" },
            { age: 20,   detail: "มีการโยกย้ายที่อยู่อาศัย" },
            { age: 30,   detail: "ระวังถูกริบทรัพย์หรือมีเรื่องวิวาท" },
            { age: "30+",detail: "ดวงจะเริ่มดีขึ้น มีสมบัติมากมาย" }
        ],
        directions: {
            southeast_southwest: "ที่ประดิษฐานพระบูชา",
            north:     "ทิศสำหรับสวนหย่อม",
            west:      "ทิศขุดสระบ่อน้ำ",
            east:      "ที่ตั้งครัวไฟ",
            northeast: "ที่เก็บศาสตราอาวุธ",
            south:     "ที่อยู่บริวารและคอกสัตว์"
        }
    }
};

// ---------------------------------------------------------------------------
// ข้อมูลพระเคราะห์ — รวมเป็นชุดเดียว (ลบ PLANETARY_DATA ที่ซ้ำซ้อนออก)
// เพิ่ม: symbol, colors สำหรับแสดงสีประจำตัว
// ---------------------------------------------------------------------------
const planetData = {
    1: {
        name: "อาทิตย์", abbr: "อ", symbol: "อ.",
        element: "ไฟ", direction: "อีสาน (ตะวันออกเฉียงเหนือ)",
        power: 6, vehicle: "ราชสีห์", color: "แดงทับทิม",
        colors: ["สีแดง", "ดำแดง"],
        คู่ธาตุ: 7
    },
    2: {
        name: "จันทร์", abbr: "จ", symbol: "จ.",
        element: "ดิน", direction: "บูรพา (ตะวันออก)",
        power: 15, vehicle: "ม้า (อัศวราช)", color: "ขาวนวล",
        colors: ["สีขาวนวล", "เหลืองอ่อน"],
        คู่ธาตุ: 5
    },
    3: {
        name: "อังคาร", abbr: "ภ", symbol: "ภ.",
        element: "ลม", direction: "อาคเนย์ (ตะวันออกเฉียงใต้)",
        power: 8, vehicle: "กระบือ (กาสรราช)", color: "ชมพู/แดงแก่",
        colors: ["สีแดงแก่", "ดำแดงเข้ม", "ชมพู"],
        คู่ธาตุ: 8
    },
    4: {
        name: "พุธ", abbr: "ว", symbol: "ว.",
        element: "น้ำ", direction: "ทักษิณ (ใต้)",
        power: 17, vehicle: "ช้าง (คชราช)", color: "เขียวมรกต",
        colors: ["สีเขียว", "ขาวแกมแดง"],
        คู่ธาตุ: 6
    },
    5: {
        name: "พฤหัสบดี", abbr: "ช", symbol: "ช.",
        element: "ดิน", direction: "ประจิม (ตะวันตก)",
        power: 19, vehicle: "กวาง (มฤคราช)", color: "เหลืองสดใส",
        colors: ["สีขาวเหลืองแก่"],
        คู่ธาตุ: 2
    },
    6: {
        name: "ศุกร์", abbr: "ศ", symbol: "ศ.",
        element: "น้ำ", direction: "อุดร (เหนือ)",
        power: 21, vehicle: "วัว (อุสุภราช)", color: "น้ำเงิน/ประภัสสร",
        colors: ["สีเหลืองไม่ขาวไม่ดำ", "น้ำเงิน"],
        คู่ธาตุ: 4
    },
    7: {
        name: "เสาร์", abbr: "ส", symbol: "ส.",
        element: "ไฟ", direction: "หรดี (ตะวันตกเฉียงใต้)",
        power: 10, vehicle: "เสือ (พยัคฆราช)", color: "ดำคล้ำ",
        colors: ["สีดำ", "น้ำตาลแก่ปนดำ"],
        คู่ธาตุ: 1
    },
    8: {
        name: "ราหู", abbr: "ร", symbol: "ร.",
        element: "ลม", direction: "พายัพ (ตะวันตกเฉียงเหนือ)",
        power: 12, vehicle: "ครุฑ (ครุฑราช)", color: "ดำหมอกเมฆ",
        colors: ["สีดำ", "สีสัมฤทธิ์"],
        คู่ธาตุ: 3
    },
    9: {
        name: "เกตุ", abbr: "ก", symbol: "ก.",
        element: "ธาตุปรุงแต่ง", direction: "กลางจักรวาล",
        power: 9, vehicle: "นาค (นาคราช)", color: "ทองนพคุณ",
        colors: ["สีทองคำ", "สีใส"],
        คู่ธาตุ: null
    }
};

// ---------------------------------------------------------------------------
// พระพุทธรูปประจำวัน (7 วัน → key 1-7 ตรงกับเลขวันโหราศาสตร์)
// แก้ไข: key 4 "พระปาอุ้มบาตร" → "พระปางอุ้มบาตร"
// ---------------------------------------------------------------------------
const buddha = {
    1: { name: "พระปางถวายเนตร" },
    2: { name: "พระปางห้ามญาติ" },
    3: { name: "พระปางไสยาสน์" },
    4: { name: "พระปางอุ้มบาตร" },
    5: { name: "พระปางสมาธิ" },
    6: { name: "พระปางทรงรำพึง" },
    7: { name: "พระปางนาคปรก" }
};

// ---------------------------------------------------------------------------
// ข้อมูลรายละเอียดวันเกิด (จิตใจ ร่างกาย ธาตุ อาชีพ)
// ---------------------------------------------------------------------------
const detailDayBirthData = {
    1: {
        name: "วันอาทิตย์",
        mind: "ความคิด ความมีใจสูง เกียรติยศ ความเด่น อำนาจ ใจเร็ว ใจร้อน ชอบอิสระ ไฟฟ้า ชอบตัดสินใจเร็ว รูปพรรณขาวแดงสันทัด หน้ากลม",
        body: "เป็นส่วนสำคัญของชีวิต หัวใจความเป็นอยู่แห่งหลอดโลหิตแดง ความโยกย้ายเพราะใจเร็ว สมาธิคือจากความสงบ จากโกรธมาเป็นที่ตั้งแห่งธรรม",
        element: "ทองคำ",
        employment: "คนในสำนักรัฐบาล คนขายเพชรพลอย ช่างทอง ช่างกะไหล่ หรือทำงานเกี่ยวกับทอง ช่างไฟฟ้า"
    },
    2: {
        name: "วันจันทร์",
        mind: "ความสวยงามเป็นเสน่ห์ ใจเย็นเปลี่ยนแปลงง่าย มาตุคาม ทางน้ำ เกี่ยวกับแม่เหล็กคือความดึงดูด หนาว ชื้น มีผล รูปพรรณสันทัด ขาวนวล เป็นนางพระยา",
        body: "เป็นส่วนของร่างกาย คือนม กระเพาะอาหาร น้ำเหลือง และความไม่เที่ยงธรรม",
        element: "เงิน",
        employment: "เจ้าหน้าที่ฝ่ายหญิง ผู้พยาบาล แพทย์ผดุงครรภ์ นักท่องเที่ยว กลาสี ชาวประมง ผู้ขนส่ง"
    },
    3: {
        name: "วันอังคาร",
        mind: "รูปพรรณสันทัด ค่อนข้างเล็กเกร็ง ผมหยิก หน้ากระดูก ดำแดง นักรบ การกบฏการขโมย ไฟ ความกล้าหาญ อกอาจเปี่ยมด้วยอำนาจ ว่องไวใจกล้า การแกล้งติเตียน เป็นพาล ความบ้าคลั่ง เป็นศัตรู ชอบอิจฉา ดื้อดึง แสนงอน ทิฐิมานะ",
        body: "หมายถึงหน้าผาก จมูก เอ็น กล้ามเนื้อ",
        element: "เหล็ก",
        employment: "ทหาร นักเลงโต แพทย์ผ่าตัด เพชฌฆาต แพทย์ถอนฟัน ผู้ชำนาญการช่างเหล็ก ทำปืน ช่างตัดผม คนครัว คนฆ่าสัตว์"
    },
    4: {
        name: "วันพุธ",
        mind: "รูปพรรณขาวท่วม ขาวเหลือง ความคิด ความเปลี่ยนแปลง อ่อนหวาน อ่อนโยน ใจน้อยปลุกใจง่าย กลัวง่าย ชอบทำธุระการในบ้านมาก ระวังรักษาดี การดนตรี ความชื้นแฉะ มีผลปานกลาง",
        body: "หมายถึงเส้นประสาท ไส้ พุง ความเป็นอยู่แห่งประสาทอ่อนทั่วไป",
        element: "ปรอท",
        employment: "คนฉลาดในวิชาหนังสือ นักปาฐก นักประพันธ์ เลขานุการ สมุหบัญชี อาจารย์ นายทะเบียน ล่ามเสมียน คนนำส่งข้าวสาร ช่างพิมพ์ คนขายหนังสือ คนส่งของ"
    },
    5: {
        name: "วันพฤหัสบดี",
        mind: "รูปพรรณค่อนข้างขาวสูง มีทั้งอ้วนและผอม หน้าผากกว้างเถิก ผมอ่อนบาง ความฉลาด ศีลธรรม ความสำเร็จ ความเป็นใหญ่ ความสัตย์ วิชาความรู้ อาจารย์ หรือผู้ใหญ่ กฎหมาย นักปราชญ์ โชค ความทำนุบำรุง ใจอารีกว้างขวาง ปกครอง กรุณาเผื่อแผ่",
        body: "หมายถึงโคนขา ต้นขา หูขวา เท้า ความเป็นอยู่แห่งความปกครองของใจ ปัญญาความรู้",
        element: "สังกะสี",
        employment: "สมณพราหมณาจารย์ สมาชิกสภาแห่งชาติ ผู้พิพากษา ที่ปรึกษา ครู อาจารย์ ผู้ดำเนินตามพระเจ้า ผู้สอนศาสนา โหราจารย์ สมาชิกวิทยาลัย ทนายความ แพทย์ทางยา คนทำงานธนาคาร"
    },
    6: {
        name: "วันศุกร์",
        mind: "รูปสูงโปร่ง เนื้อสองสีค่อนข้างขาว ไม่ผอม หน้ายาว ใบหน้าสวย หน้ารูปไข่ เท้าเล็ก เป็นขุนคลัง การเงิน ความสมหมาย ความเรียบร้อย ความมีเสน่ห์ เยือกเย็นรู้เล่ห์เหลี่ยม ใจดีมีกรุณา ความยินดี ความสวยงาม ความรัก กามารมณ์ ความบันเทิงใจ ดนตรี เครื่องสำอาง ช่างศิลป์",
        body: "มีผลแสดงถึงหลอดอากาศ มดลูก รังไข่ กระเพาะลำไส้ คาง แก้ม ความเป็นอยู่ให้เกิดพันธุ์ เส้นโลหิตดำทั่วไป",
        element: "ทองแดง",
        employment: "ขุนคลัง นาฏศาสตร์และการบันเทิง นักดนตรี นักร้อง นักแต่งบทกลอน นักตบแต่งร่างกาย ช่างแห่งศิลป์ที่สวยงามทุกชนิด พ่อค้าเครื่องประดับกาย เครื่องสำอาง คนทำและขายอาหาร"
    },
    7: {
        name: "วันเสาร์",
        mind: "รูปร่างแข็งแรง ร่างใหญ่แต่ไม่อ้วนผิวคำ วิตกวิจารณ์ เป็นทุกข์ เสียใจ ตกจากตำแหน่ง ความชักช้า ลึกลับ เหตุร้ายอาจถึงตาย ศัตรูในที่ซุ่มซ่อนเป็นใหญ่กว่า โรคร้าย ป่วยเรื้อรัง ความกระเหม็ดกระแหม่ ขยัน คงที่ไม่ผันแปร แรงกล้าในทางทุกข์",
        body: "แสดงถึงกระดูก ตับไต หูซ้าย น่องเข่า ความเป็นอยู่ที่ถ่ายออกจากต่อมทั่วไป ทุกขัง ที่ตั้งแห่งทุกข์",
        element: "ตะกั่ว",
        employment: "การกสิกรรม บ่อแร่ คนขายที่ดินและทรัพย์สมบัติ ของหมักดองชนิดไม่เมา ผู้คุมนักโทษ คนเฝ้าโบสถ์ สัปเหร่อ กรรมกร คนตรากตรำงาน กรรมกรทำงานกลางคืนหรืองานใต้ดิน"
    }
};

// ---------------------------------------------------------------------------
// ทักษาพยากรณ์ (key = เลขดาวโหราศาสตร์ไทย 1-9)
// แก้ไข: key 8 (ราหู) — ใส่ข้อมูลเฉพาะตัว ไม่ซ้ำกับเสาร์
// เพิ่ม: key 9 (เกตุ) ที่ขาดหายไป
// ---------------------------------------------------------------------------
const THAKSA_PROPHESY = {
    1: { // อาทิตย์
        บริวาร:  "มีลูกเมียมาก แต่สอนยาก",
        อายุ:    "มีอายุยืนกว่าญาติ",
        เดช:     "มีเดชดังพระยาราชสีห์",
        ศรี:     "มีทรัพย์มากดังเศรษฐี",
        มูลละ:   "รูปไม่งาม",
        อุตสาหะ: "มีความรู้ยิ่งกว่าผู้อื่น ทำอันใดมักเป็นคุณแก่คน",
        มนตรี:   "มีลูกเมียข้าไทยสั่งสอนยาก มักไม่เกรง",
        กาลกิณี: "หัวแหวนเป็นโทษ ทำไร่นาค้าขายไม่สู้ดี มีของตำหนิ"
    },
    2: { // จันทร์
        บริวาร:  "เป็นคนใหญ่ ร่ำรวยมาก",
        อายุ:    "บังเกิดเป็นพยาธิ",
        เดช:     "มีเดชมีกำลังมากดังพระยาคชสาร",
        ศรี:     "มีผู้คนข้าทาส มักจับจ่ายเงิน",
        มูลละ:   "รูปร่างงามเป็นที่ชอบใจแก่คนทั้งหลาย",
        อุตสาหะ: "มีความรู้มาก ทำการอันใดมักนานจึงแล้ว",
        มนตรี:   "มีผู้คนข้าไทยมาก ได้เมียเผ่าผู้ดี",
        กาลกิณี: "มีอายุน้อยนักแล"
    },
    3: { // อังคาร
        บริวาร:  "มีลูกเมียข้าคนย่อมรู้หลัก ปากกล้าดี",
        อายุ:    "มีอายุยืนกว่าญาติ",
        เดช:     "มีเดชดังพญาหนุมาน",
        ศรี:     "มีทรัพย์และความรู้มาก",
        มูลละ:   "รูปมิสู้งาม เดินมักก้มหน้า",
        อุตสาหะ: "เป็นช่างดีมีทรัพย์มาก",
        มนตรี:   "มีข้าคนมักเป็นศัตรู",
        กาลกิณี: "ทำไร่นาค้าขายมิสู้ดีได้แต่พอกิน"
    },
    4: { // พุธ
        บริวาร:  "มีลูกเมียข้าคน มักนำลาภมาให้",
        อายุ:    "อายุไม่ใคร่ยืน เกิดโรคาพยาธิมาก",
        เดช:     "มีเดชเหมือนโพธิสัตว์ (ใจบุญ)",
        ศรี:     "ทรัพย์น้อยทำได้ไว้มิคง มักจับจ่าย มักขี้โกรธ",
        มูลละ:   "รูปงาม",
        อุตสาหะ: "ใจเร็ว มีทรัพย์ข้าวของมาก",
        มนตรี:   "มีลูกเมียข้าไทยย่อมเอาทรัพย์มาสู่ตน",
        กาลกิณี: "อาภัพมิตรสหาย เพื่อนฝูงมักเป็นศัตรูต่อคน"
    },
    5: { // พฤหัสบดี
        บริวาร:  "มีผู้คนลูกเมียช้างม้ามาก ประกอบไปด้วยความสุข",
        อายุ:    "มักเกิดโรคมาก",
        เดช:     "มีศัพทานุภาพดังพระยาอุสุภราช",
        ศรี:     "มีทรัพย์มากแต่มักเสียหาย",
        มูลละ:   "รูปงามมักชอบใจคนทั้งหลาย มีเมียหลาย",
        อุตสาหะ: "ทำอันใดมักไกล",
        มนตรี:   "มีลูกเมียข้าไทยดี",
        กาลกิณี: "ร้ายนัก ญาติพี่น้องมักเป็นศัตรู"
    },
    6: { // ศุกร์
        บริวาร:  "มีลูกเมียข้าไทยดี",
        อายุ:    "อายุยืน บางตำราว่าเกิดโรค",
        เดช:     "มีเดชดังพญาคชสาร",
        ศรี:     "ทรัพย์มากแต่มักจ่ายเสียหาย",
        มูลละ:   "รูปงาม",
        อุตสาหะ: "ทำอันใดมักสลาย บางตำราว่ามักร้างไว้ มีปัญญา",
        มนตรี:   "ลูกเมียข้าไทยดี จะได้เป็นใหญ่",
        กาลกิณี: "อาภัพพี่น้อง มิตรสหายย่อมเป็นศัตรูแล"
    },
    7: { // เสาร์
        บริวาร:  "มีลูกเมียข้าคนมักเป็นศัตรู สอนยากใจร้าย",
        อายุ:    "อายุยืนกว่าพี่น้อง จะมีทรัพย์สมบัติมาก",
        เดช:     "มีเดชดังพระยาครุฑ",
        ศรี:     "มีทรัพย์สมบัติ ปัญญาดี ความรู้มาก",
        มูลละ:   "รูปงาม สีเนื้อดำแดง ชอบใจคนทั้งหลาย",
        อุตสาหะ: "มีความรู้ ทำการอันใดนานชอบคนทั้งหลาย",
        มนตรี:   "มีข้าไทยสั่งสอนยากมักเป็นศัตรู",
        กาลกิณี: "มักจ่ายทรัพย์ ทรัพย์มักเป็นศัตรูแล"
    },
    8: { // ราหู — แก้ไข: ข้อมูลเฉพาะตัว ไม่ซ้ำเสาร์
        บริวาร:  "มีบริวารมาก แต่ไม่ค่อยซื่อสัตย์ มักคิดร้ายในที่ลับ",
        อายุ:    "อายุขัยมักผันแปร มีโรคซ่อนเร้นและอุบัติเหตุระวัง",
        เดช:     "มีเดชซ่อนเร้นดังพระยานาคราช เข้มแข็งแต่ไม่ประกาศตัว",
        ศรี:     "ทรัพย์มาแบบพลิกผัน ได้มาเร็วเสียไปเร็ว",
        มูลละ:   "รูปร่างลึกลับ สีเนื้อคล้ำหมอก มีเสน่ห์แฝง",
        อุตสาหะ: "ทำการงานอย่างลึกลับ มักได้ผลในทางที่ไม่คาดคิด",
        มนตรี:   "บริวารมักหักหลัง ต้องระวังคนใกล้ชิด",
        กาลกิณี: "เคราะห์มักมาจากศัตรูซ่อนเร้น อย่าประมาทคนรอบข้าง"
    },
    9: { // เกตุ — เพิ่มข้อมูลที่ขาดหายไป
        บริวาร:  "บริวารน้อยแต่ซื่อสัตย์ มักอยู่อย่างสันโดษ",
        อายุ:    "อายุขัยขึ้นอยู่กับบุญบารมีที่สั่งสม มักมีโรคลึกลับ",
        เดช:     "มีเดชทางปัญญาและวิทยาคม ดังนาคราชผู้ทรงอิทธิฤทธิ์",
        ศรี:     "ทรัพย์ไม่มากแต่เพียงพอ มักได้จากทางธรรมหรือวิชา",
        มูลละ:   "รูปร่างพิเศษ มักมีเครื่องหมายแปลกที่ร่างกาย",
        อุตสาหะ: "มุ่งมั่นในทางที่สนใจ มักเชี่ยวชาญวิชาลึกลับหรือจิตวิญญาณ",
        มนตรี:   "บริวารน้อยแต่มีคุณภาพ ได้คนดีมาช่วยเหลือในยามยาก",
        กาลกิณี: "เคราะห์มักเกิดจากตัวเอง ความสงสัยและวิตกกังวลเป็นอุปสรรค"
    }
};

// ---------------------------------------------------------------------------
// สีประจำวัน
// ---------------------------------------------------------------------------
const DAY_COLORS = {
    1:    "#e74c3c",
    2:    "#f1c40f",
    3:    "#e84393",
    4:    "#27ae60",
    5:    "#e67e22",
    6:    "#2980b9",
    7:    "#241c61af"
};



function showdaybirth(){
    const contianer = document.getElementById('showdaybirthpage')
    if (contianer) {
        contianer.style.display = 'block';
    }

    const html = `
    <div class="container" style="max-width: 900px; margin: 0 auto; padding: 20px 10px;">
            <h2 class="text-center text-gold mb-4 font-weight-bold" style="text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);">✨ คำพยากรณ์ลักษณะนิสัยและพื้นดวงตามวันเกิด ✨</h2>
    
            <div class="day-selector d-flex justify-content-center flex-wrap gap-2 mb-4" style="gap: 12px;">
                <button class="btn-day" id="btn-day-1"
                    onclick="showDayInfo(1, event); showPlanet(1); showPlanetaryData(1); showBuddha(1); showDetailDay(1); showThaksaDay(1);"
                    style="--day-color: #FF4D4D;">อา.</button>
                <button class="btn-day" id="btn-day-2"
                    onclick="showDayInfo(2, event); showPlanet(2); showPlanetaryData(2); showBuddha(2); showDetailDay(2); showThaksaDay(2);"
                    style="--day-color: #FFD700;">จ.</button>
                <button class="btn-day" id="btn-day-3"
                    onclick="showDayInfo(3, event); showPlanet(3); showPlanetaryData(3); showBuddha(3); showDetailDay(3); showThaksaDay(3);"
                    style="--day-color: #FF80B3;">อ.</button>
                <button class="btn-day" id="btn-day-4"
                    onclick="showDayInfo(4, event); showPlanet(4); showPlanetaryData(4); showBuddha(4); showDetailDay(4); showThaksaDay(4);"
                    style="--day-color: #2ECC71;">พ.</button>
                <button class="btn-day" id="btn-day-5"
                    onclick="showDayInfo(5, event); showPlanet(5); showPlanetaryData(5); showBuddha(5); showDetailDay(5); showThaksaDay(5);"
                    style="--day-color: #FFA500;">พฤ.</button>
                <button class="btn-day" id="btn-day-6"
                    onclick="showDayInfo(6, event); showPlanet(6); showPlanetaryData(6); showBuddha(6); showDetailDay(6); showThaksaDay(6);"
                    style="--day-color: #33C9FF;">ศ.</button>
                <button class="btn-day" id="btn-day-7"
                    onclick="showDayInfo(7, event); showPlanet(7); showPlanetaryData(7); showBuddha(7); showDetailDay(7); showThaksaDay(7);"
                    style="--day-color: #A349A4;">ส.</button>
            </div>
            <div id="prediction-card" class="prediction-card shadow-lg d-none" style="background: rgba(10, 15, 29, 0.92) !important; border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 20px !important; padding: 0 !important; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.7) !important;">
                <div class="card-header" id="card-name-bg" style="border-radius: 20px 20px 0 0; padding: 25px 30px; border-bottom: 2px solid rgba(212, 175, 55, 0.4);">
                    <h3 id="display-name" class="m-0 mb-2" style="font-weight: 800; font-size: 1.8rem; color: #D4AF37;"></h3>
                    <div style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;">
                        <span id="display-meta" style="color: #F9E596 !important; font-weight: 600;"></span><br>
                        <span id="planetarydatadisplay"></span><br>
                        <span id="detailelement"></span> <span id="buddhadisplay" style="color: #F9E596 !important;"></span><br>
                        <span id="detaildaybody"></span>
                    </div>
                </div>
                <div class="card-body" style="padding: 30px; color: #F3F4F6 !important; background: transparent;">
                    <div class="mb-4">
                        <h4 class="text-gold mb-3" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-user mr-2"></i> ลักษณะนิสัยและพื้นดวง</h4>
                        <p id="display-character" style="color: #F3F4F6 !important; font-size: 1.1rem; line-height: 1.8; text-align: justify; margin-bottom: 15px;"></p>
                        <p id="detailday" style="color: #F3F4F6 !important; font-size: 1.1rem; line-height: 1.8; text-align: justify; margin-bottom: 15px;"></p>
                        <div id="detailemployment" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;"></div>
                    </div>
                    <hr style="border: 0; border-bottom: 1px dashed rgba(212, 175, 55, 0.35); margin: 28px 0;">
                    <div class="mb-4">
                        <h4 class="text-gold mb-3" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-calendar-alt mr-2"></i> เกณฑ์อายุสำคัญชะตาชีวิต</h4>
                        <ul id="displaymilestones" class="list-unstyled" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8; padding-left: 0;"></ul>
                    </div>
                    <hr style="border: 0; border-bottom: 1px dashed rgba(212, 175, 55, 0.35); margin: 28px 0;">
                    <div>
                        <h4 class="text-gold mb-3" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-compass mr-2"></i> ทิศมงคลและการจัดบ้านเรือน</h4>
                        <div id="display-directions" class="list-unstyled" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;"></div>
                    </div>
                    <hr style="border: 0; border-bottom: 1px dashed rgba(212, 175, 55, 0.35); margin: 28px 0;">
                    <div id="planetinfodisplay" class="mb-4" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;"></div>
                    <hr style="border: 0; border-bottom: 1px dashed rgba(212, 175, 55, 0.35); margin: 28px 0;">
                    <div id="thaksaday" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;"></div>
                </div>
            </div>

            <div class="text-center mt-4 mb-5">
                <div class="row mt-4">
                    <div class="col-6">
                        <button class="btn btn-outline-gold btn-block" style="border: 1px solid rgba(212,175,55,0.4); color: #F9E596; background: rgba(15,23,42,0.8); border-radius: 50px; padding: 10px 20px; transition: 0.3s;" onclick="navigateTo('mainpage')">
                            <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-gold btn-block" style="border: 1px solid rgba(212,175,55,0.4); color: #F9E596; background: rgba(15,23,42,0.8); border-radius: 50px; padding: 10px 20px; transition: 0.3s;" onclick="goBack()">
                            <i class="fas fa-home"></i> กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
    </div>    
    `;

    contianer.innerHTML = html;

    // Auto-select user's day of birth if available
    try {
        const profileStr = localStorage.getItem('thaiHoroProfile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            if (profile && profile.birthdate) {
                const bDate = new Date(profile.birthdate);
                let dayIdx = bDate.getDay(); // 0=Sun, 1=Mon ... 6=Sat
                
                // Adjust for Thai day change at 6:00 AM
                if (typeof calculateThaiDay === 'function') {
                    dayIdx = calculateThaiDay(bDate);
                }
                
                // Map dayIdx to the button ID format (1=Sun, 2=Mon ... 7=Sat)
                const dayMap = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };
                const dayId = dayMap[dayIdx];
                
                if (dayId) {
                    setTimeout(() => {
                        const btn = document.getElementById(`btn-day-${dayId}`);
                        if (btn) {
                            btn.click();
                        }
                    }, 50);
                }
            }
        }
    } catch (e) {
        console.error("Error auto-selecting day of birth", e);
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    showdaybirth();
});
// ---------------------------------------------------------------------------
// helper — เขียนค่าลง DOM พร้อม null-check
// ---------------------------------------------------------------------------
function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setElHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

// ---------------------------------------------------------------------------
// แสดงข้อมูลวันเกิดหลัก
// แก้ไข: รับ event เป็น parameter / แสดงชื่อทิศภาษาไทยแทน key
// ---------------------------------------------------------------------------
function showDayInfo(num, event) {
const data = dayBirthData[num];
if (!data) return;

// แสดงการ์ด
const card = document.getElementById("prediction-card");
if (card) card.classList.remove("d-none");

// ข้อมูลหลัก
setEl("display-name", data.name);
setEl("display-meta", data.meta);
setEl("display-character", data.character);

// สี header ให้ตัดกับพื้นหลังหรูหรา
const bg = document.getElementById("card-name-bg");
if (bg) {
    bg.style.background = `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)`;
    bg.style.borderBottom = `3px solid ${DAY_COLORS[num] || "#D4AF37"}`;
    bg.style.boxShadow = `0 6px 25px rgba(0,0,0,0.6)`;
}
const dispName = document.getElementById("display-name");
if (dispName) {
    dispName.style.color = DAY_COLORS[num] || "#D4AF37";
    dispName.style.textShadow = "0 2px 10px rgba(0,0,0,0.8)";
}

// milestones
if (data.milestones) {
    const milestonesHTML = data.milestones.map(m =>
        `<li class="mb-2" style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.7;"><b style="color: #F9E596;">อายุ ${m.age}:</b> ${m.detail}</li>`
    ).join("");
    setElHTML("displaymilestones", milestonesHTML);
}

// directions
if (data.directions) {
    const directionsHTML = Object.entries(data.directions).map(([key, val]) => {
        const label = DIRECTION_LABELS[key] || key;
        return `<div class="col-md-6 mb-2" style="color: #F3F4F6 !important; font-size: 1.05rem;"><b style="color: #F9E596;">${label}:</b> ${val}</div>`;
    }).join("");
    setElHTML("display-directions", `<div class="row">${directionsHTML}</div>`);
}

// =========================
// ✅ จัดการ active (แก้ใหม่)
// =========================
document.querySelectorAll(".btn-day").forEach(btn => btn.classList.remove("active"));

if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
}
}

document.querySelectorAll(".btn-day").forEach(btn => {
btn.addEventListener("click", (e) => {
const day = btn.dataset.day;
const num = parseInt(btn.dataset.num);

    // active
    document.querySelectorAll(".btn-day").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // call functions
    showDayInfo(num, e);
    showPlanet(planetNum);
    showPlanetaryData(planetNum);
    showBuddha(planetNum);
    showDetailDay(planetNum);
    showThaksaDay(planetNum);
});
});


// ---------------------------------------------------------------------------
// วิเคราะห์และแสดงข้อมูลพระเคราะห์ (รวมสีและคู่ธาตุ)
// ---------------------------------------------------------------------------
function analyzePlanetElement(planetNum) {
    const planet = planetData[planetNum];
    if (!planet) return "ไม่พบข้อมูลพระเคราะห์";

    let html = `<div style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;"><h4 class="text-gold mb-3" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-globe mr-2"></i> ข้อมูลพระเคราะห์ประจำวันเกิด</h4>`;
    html += `<b>พระ${planet.name}</b> (เลข ${planetNum}) ครอง<b style="color: #F9E596;">ธาตุ${planet.element}</b> `;
    html += `ประจำทิศ${planet.direction} มีกำลังมหาจักรคือ ${planet.power} `;
    html += `ทรง${planet.vehicle}เป็นพาหนะ ผิวกายสี${planet.color} `;
    html += `| <b style="color: #F9E596;">สีมงคล:</b> ${planet.colors.join(", ")}`;

    if (planet.คู่ธาตุ) {
        const pair = planetData[planet.คู่ธาตุ];
        if (pair) {
            html += `<br><br><span style="color: #F9E596 !important; background: rgba(212, 175, 55, 0.15); padding: 8px 14px; border-radius: 10px; display: inline-block; border: 1px solid rgba(212, 175, 55, 0.3);"><b>💡 คู่ธาตุเสริมบารมี:</b> พระ${planet.name} และ พระ${pair.name} `;
            html += `เป็นคู่ธาตุ${planet.element} (คู่อสิติธาตุ) `;
            html += `หากกุมลัคนาจะรุ่งเรืองยิ่งนัก แม้เกิดในตระกูลต่ำก็เด่นขึ้นมาได้</span>`;
        }
    }
    html += `</div>`;
    return html;
}

function showPlanet(num) {
    setElHTML("planetinfodisplay", analyzePlanetElement(num));
}

// ---------------------------------------------------------------------------
// แสดงสีประจำพระเคราะห์ (ใช้ planetData ชุดเดียว — ลบ PLANETARY_DATA แล้ว)
// ---------------------------------------------------------------------------
function showPlanetaryData(planetNum) {
    const planet = planetData[planetNum];
    const el = document.getElementById("planetarydatadisplay");
    if (!el) return;
    if (!planet) { el.innerHTML = "ไม่พบข้อมูลพระเคราะห์"; return; }
    el.innerHTML = `<b style="color: #F9E596;">🎨 สีมงคลประจำตัว:</b> <span style="color: #F3F4F6 !important;">${planet.colors.join(", ")}</span>`;
}

// ---------------------------------------------------------------------------
// แสดงพระพุทธรูปประจำเคราะห์
// ---------------------------------------------------------------------------
function showBuddha(planetNum) {
    const el = document.getElementById("buddhadisplay");
    if (!el) return;
    const data = buddha[planetNum];
    el.innerHTML = data
        ? `<b style="color: #F9E596;">🙏 พระพุทธรูปประจำวัน:</b> <span style="color: #F3F4F6 !important;">${data.name}</span>`
        : "ไม่พบข้อมูลพระพุทธรูปประจำเคราะห์";
}

// ---------------------------------------------------------------------------
// แสดงรายละเอียดวันเกิด (แก้ไข: ชื่อฟังก์ชัน + null-check ครบ)
// ---------------------------------------------------------------------------
function showDetailDay(num) {
    const data = detailDayBirthData[num];
    if (!data) {
        setElHTML("detailday", "ไม่พบข้อมูลรายละเอียดวันเกิด");
        return;
    }
    setElHTML("detailday",        data.mind);
    setElHTML("detaildaybody",    data.body);
    setElHTML("detailelement",    `<b style="color: #F9E596;">🌱 ธาตุประจำวัน:</b> <span style="color: #F3F4F6 !important;">${data.element}</span>`);
    setElHTML("detailemployment", `<h4 class="text-gold mt-4 mb-2" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-briefcase mr-2"></i> อาชีพและหน้าที่การงานที่เหมาะสม</h4><div style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.8;">${data.employment}</div>`);
}

// ---------------------------------------------------------------------------
// แสดงทักษาพยากรณ์ (เพิ่ม null-check กรณีไม่พบ key)
// ---------------------------------------------------------------------------
function showThaksaDay(dayKey) {
    const data = THAKSA_PROPHESY[dayKey];
    const el = document.getElementById("thaksaday");
    if (!el) return;
    if (!data) { el.innerHTML = "ไม่พบข้อมูลทักษาพยากรณ์"; return; }

    el.innerHTML = `
        <h4 class="text-gold mb-3" style="color: #D4AF37 !important; font-weight: bold;"><i class="fas fa-star mr-2"></i> ทักษาพยากรณ์ประจำวันเกิด</h4>
        <div style="color: #F3F4F6 !important; font-size: 1.05rem; line-height: 1.9; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #D4AF37;"><b style="color: #F9E596;">👑 บริวาร:</b> ${data.บริวาร}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #2ECC71;"><b style="color: #F9E596;">🌿 อายุ:</b> ${data.อายุ}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #FF4D4D;"><b style="color: #F9E596;">🔥 เดช:</b> ${data.เดช}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #33C9FF;"><b style="color: #F9E596;">💎 ศรี:</b> ${data.ศรี}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #FFA500;"><b style="color: #F9E596;">💰 มูลละ:</b> ${data.มูลละ}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #FF80B3;"><b style="color: #F9E596;">⚙️ อุตสาหะ:</b> ${data.อุตสาหะ}</div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #A349A4;"><b style="color: #F9E596;">🛡️ มนตรี:</b> ${data.มนตรี}</div>
            <div style="background: rgba(255,0,0,0.15); padding: 10px 15px; border-radius: 10px; border-left: 3px solid #FF0000;"><b style="color: #FF6B6B;">⚠️ กาลกิณี:</b> ${data.กาลกิณี}</div>
        </div>
    `;
}
