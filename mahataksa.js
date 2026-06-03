"use strict";

// 1. นำเข้า Firebase (ต้องอยู่บนสุดของไฟล์เสมอ)
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const THAKSA_NAMES = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
const PLANET_NAMES = ["อาทิตย์ (๑)", "จันทร์ (๒)", "อังคาร (๓)", "พุธ (๔)", "เสาร์ (๗)", "พฤหัสบดี (๕)", "ราหู (๘)", "ศุกร์ (๖)"];

const THAKSA_INFO = {
    "บริวาร": "คนในปกครอง บุตร ภรรยา สามี และมิตรสหายที่คอยสนับสนุน",
    "อายุ": "สุขภาพ การดำเนินชีวิต ความเป็นอยู่ และอายุขัย",
    "เดช": "อำนาจ บารมี เกียรติยศ ชื่อเสียง และตำแหน่งหน้าที่",
    "ศรี": "โชคลาภ ทรัพย์สิน ความสำเร็จ และความเป็นสิริมงคล",
    "มูละ": "มรดก ที่ดิน บ้านเรือน รากฐานความมั่นคงของชีวิต",
    "อุตสาหะ": "ความขยันหมั่นเพียร การงาน และความพยายามที่ส่งผลสำเร็จ",
    "มนตรี": "ผู้ใหญ่เมตตา มีคนคอยอุปถัมภ์ชูชุบช่วยเหลือ",
    "กาลกิณี": "อุปสรรค ปัญหา สิ่งไม่เป็นมงคล และสิ่งที่ควรหลีกเลี่ยง"
};

const ANGEL_DATA = [
    {
        name: "พระอาทิตย์", vehicle: "ราชสีห์", power: 6, direction: "ทิศตะวันออก (บูรพา)", type: "บาปเคราะห์", resistance: "พระจันทร์",
        desc: "เด่นด้านยศศักดิ์ อำนาจ และบารมี", location: "สถิตย์ในทิศบูรพา",
        prediction: "จะเกิดลาภผลพูนผล มีเกียรติยศชื่อเสียง จะมีผู้ใหญ่สนับสนุนในหน้าที่การงานดีนัก",
        shrine: "ควรทำบุญทางทิศตะวันออกเพื่อเสริมบารมี",
        animal: "นามครุฑ", alphabet: "ก ข ค ง",
        luckyColor: "สีแดง", bg: "#e63946",
        unluckyColor: "สีฟ้า, สีน้ำเงิน"
    },
    {
        name: "พระจันทร์", vehicle: "อัศวราช (ม้า)", power: 15, direction: "ทิศตะวันออกเฉียงใต้ (อาคเนย์)", type: "ศุภเคราะห์", resistance: "พระอาทิตย์",
        desc: "เด่นด้านเสน่ห์ เมตตา และโชคลาภ", location: "สถิตย์ในทิศอาคเนย์",
        prediction: "จะมีความสุขสบาย มีโชคลาภจากเพศตรงข้าม ได้ของถูกใจ มีเสน่ห์แก่คนทั้งหลาย",
        shrine: "ควรทำบุญทางทิศตะวันออกเฉียงใต้จะเสริมโชคลาภ",
        animal: "นามพยัคฆ์ (เสือ)", alphabet: "จ ฉ ช ซ ฌ ญ",
        luckyColor: "สีขาว, สีเหลืองนวล", bg: "#ffb703",
        unluckyColor: "สีแดง"
    },
    {
        name: "พระอังคาร", vehicle: "มหิงสา (กระบือ)", power: 8, direction: "ทิศใต้ (ทักษิณ)", type: "บาปเคราะห์", resistance: "พระพุธ",
        desc: "เด่นด้านความกล้าหาญ ชัยชนะ และพละกำลัง", location: "สถิตย์ในทิศทักษิณ",
        prediction: "ให้ระวังการขัดแย้ง ทะเลาะวิวาท หรือของหาย จะมีเรื่องร้อนใจจากมิตรสหายหรือญาติพี่น้อง",
        shrine: "ควรหมั่นทำบุญปล่อยสัตว์หรืออุทิศส่วนกุศลไปทางทิศใต้",
        animal: "นามสีหะ (สิงโต)", alphabet: "ฏ ฐ ด ต ถ น",
        luckyColor: "สีชมพู, สีม่วงแดง", bg: "#f76c8c",
        unluckyColor: "สีขาว, สีเหลือง"
    },
    {
        name: "พระพุธ", vehicle: "คชสาร (ช้าง)", power: 17, direction: "ทิศตะวันตกเฉียงใต้ (หรดี)", type: "ศุภเคราะห์", resistance: "พระอังคาร",
        desc: "เด่นด้านการเจรจา ปัญญา และการค้าขาย", location: "สถิตย์ในทิศหรดี",
        prediction: "จะได้ลาภจากทางไกล การเจรจาติดต่อจะสำเร็จผลดี มีสติปัญญาเฉลียวฉลาด แก้ปัญหาได้ทุกประการ",
        shrine: "ควรทำบุญถวายหนังสือหรือเครื่องเขียนทางทิศตะวันตกเฉียงใต้",
        animal: "นามโสณ (สุนัข)", alphabet: "บ ป ผ ฝ พ ฟ ภ ม",
        luckyColor: "สีเขียวทุกชนิด", bg: "#2bff00",
        unluckyColor: "สีชมพู"
    },
    {
        name: "พระเสาร์", vehicle: "พยัคฆราช (เสือ)", power: 10, direction: "ทิศตะวันตก (ประจิม)", type: "บาปเคราะห์", resistance: "พระพฤหัสบดี",
        desc: "เด่นด้านความอดทน ที่ดิน และความมั่นคง", location: "สถิตย์ในทิศประจิม",
        prediction: "จะมีความทุกข์ยากลำบาก ระวังโรคภัยไข้เจ็บหรือเสียของรัก ให้ถือความอดทนเป็นที่ตั้ง",
        shrine: "ควรไปไหว้พระปางนาคปรกหรือทำบุญทางทิศตะวันตก",
        animal: "นามนาค (งูใหญ่)", alphabet: "ย ร ล ว",
        luckyColor: "สีดำ, สีม่วงเข้ม, สีน้ำเงินเข้ม", bg: "#5d009b",
        unluckyColor: "สีเขียว"
    },
    {
        name: "พระพฤหัสบดี", vehicle: "มฤคราช (กวาง)", power: 19, direction: "ทิศตะวันตกเฉียงเหนือ (พายัพ)", type: "ศุภเคราะห์", resistance: "พระเสาร์",
        desc: "เด่นด้านสติปัญญา ผู้ใหญ่ และศีลธรรม", location: "สถิตย์ในทิศพายัพ",
        prediction: "จะได้ลาภเป็นของมีค่า ผู้ใหญ่และครูบาอาจารย์จะเมตตาปราณี จิตใจจะผ่องใสในธรรม",
        shrine: "ควรทำบุญถวายภัตตาหารหรือไหว้พระพุทธรูปปางสมาธิทางทิศตะวันตกเฉียงเหนือ",
        animal: "นามมูสิกะ (หนู)", alphabet: "ศ ษ ส ห ฬ อ",
        luckyColor: "สีส้ม, สีทอง, สีเหลืองเข้ม", bg: "#ff7300",
        unluckyColor: "สีดำ, สีม่วง"
    },
    {
        name: "พระราหู", vehicle: "พยัคฆ์", power: 12, direction: "ทิศเหนือ (อุดร)", type: "บาปเคราะห์", resistance: "พระศุกร์",
        desc: "เด่นด้านลาภลอย การเปลี่ยนแปลง และไหวพริบ", location: "สถิตย์ในทิศอุดร",
        prediction: "จะเกิดการเปลี่ยนแปลงกะทันหัน มีลาภลอยหรือได้โชคแบบไม่คาดฝัน ระวังความลุ่มหลงมัวเมา",
        shrine: "ควรทำบุญปล่อยนกปล่อยปลาไปทางทิศเหนือ",
        animal: "นามคชะ (ช้างตัวใหญ่)", alphabet: "ฎ ฏ",
        luckyColor: "สีบรอนซ์, สีเทาเข้ม, สีควันบุหรี่", bg: "#9c9c9c",
        unluckyColor: "สีส้ม, สีแสด"
    },
    {
        name: "พระศุกร์", vehicle: "โคอุสุภราช (วัว)", power: 21, direction: "ทิศตะวันออกเฉียงเหนือ (อีสาน)", type: "ศุภเคราะห์", resistance: "พระราหู",
        desc: "เด่นด้านความรัก ความสุข และการเงิน", location: "สถิตย์ในทิศอีสาน",
        prediction: "จะได้ลาภจากทางใกล้และไกล จะมีความรื่นรมย์ในชีวิต ความรักสมหวัง เงินทองไหลมาเทมา",
        shrine: "ควรทำบุญด้วยดอกไม้หอมหรือของสวยงามทางทิศตะวันออกเฉียงเหนือ",
        animal: "นามมนุษย์ (คน)", alphabet: "สระทั้งหมด",
        luckyColor: "สีฟ้า, สีน้ำเงิน, สีคราม", bg: "#0084ff",
        unluckyColor: "สีบรอนซ์, สีเทา"
    }
];

// ข้อมูลคำทำนายพื้นดวงตามภูมิกำเนิด (อ้างอิงตำรามหาทักษา)
const BIRTH_DESTINY_DATA = [
    { day: "อาทิตย์", text: "เป็นคนมีเกียรติยศ ทะเยอทะยาน มีความเป็นผู้นำสูง ใจร้อนแต่โกรธง่ายหายเร็ว มักได้ดีเพราะสติปัญญาของตนเอง" },
    { day: "จันทร์", text: "เป็นคนมีเสน่ห์ อ่อนโยน ช่างฝัน มีเมตตาต่อผู้อื่น มักมีโชคลาภจากผู้ใหญ่ แต่จิตใจมักอ่อนไหวง่าย" },
    { day: "อังคาร", text: "เป็นคนกล้าหาญ ขยันขันแข็ง อดทนสูง พูดจาตรงไปตรงมา ชอบการแข่งขันและงานที่ต้องใช้พละกำลัง" },
    { day: "พุธ (กลางวัน)", text: "เป็นคนมีวาทศิลป์ดีเลิศ เฉลียวฉลาดในการเจรจา ปรับตัวเก่ง เข้ากับคนง่าย เหมาะกับงานค้าขายหรืองานวางแผน" },
    { day: "เสาร์", text: "เป็นคนหนักแน่น อดทนสูง คิดรอบคอบ มักเก็บความรู้สึกเก่ง มีความรับผิดชอบสูง แต่อาจจะเคร่งเครียดเกินไปบ้าง" },
    { day: "พฤหัสบดี", text: "เป็นคนมีคุณธรรม ชอบศึกษาหาความรู้ มีสติปัญญาดี มักเป็นที่ปรึกษาให้ผู้อื่น ใจบุญสุนทานและมีผู้ใหญ่คอยอุปถัมภ์" },
    { day: "ราหู (พุธกลางคืน)", text: "เป็นคนมีไหวพริบดี แก้ปัญหาเฉพาะหน้าเก่ง กล้าได้กล้าเสีย มีซิกส์เซนส์ดี มักมีโชคลาภแบบไม่คาดฝัน" },
    { day: "ศุกร์", text: "เป็นคนรักสวยรักงาม มีรสนิยมดี ชอบความรื่นรมย์ ศิลปะ และดนตรี มักมีโชคเรื่องการเงินและความรักเสมอ" }
];

const PLANET_RELATIONS = {
    // คู่มิตร (หน้า 29): ส่งเสริม ช่วยเหลือ เมตตา
    partners: {
        "๑": { target: "๕", name: "พระพฤหัสบดี", desc: "ผู้ใหญ่เอ็นดู มีบารมี" },
        "๒": { target: "๔", name: "พระพุธ", desc: "เสน่ห์เมตตา เจรจาค้าขายดี" },
        "๓": { target: "๖", name: "พระศุกร์", desc: "โชคลาภเงินทอง ความรักสมหวัง" },
        "๔": { target: "๒", name: "พระจันทร์", desc: "มีคนคอยช่วยเหลือ สนับสนุน" },
        "๕": { target: "๑", name: "พระอาทิตย์", desc: "เกียรติยศชื่อเสียงเด่นชัด" },
        "๖": { target: "๓", name: "พระอังคาร", desc: "ความกล้าหาญนำมาซึ่งลาภ" },
        "๗": { target: "๘", name: "พระราหู", desc: "พรรคพวกมาก อสังหาฯ เด่น" },
        "๘": { target: "๗", name: "พระเสาร์", desc: "ขยายอำนาจ ได้ชัยชนะ" }
    },
    // คู่ศัตรู (หน้า 31): ขัดแย้ง อุบัติเหตุ ปัญหา
    enemies: {
        "๑": { target: "๓", name: "พระอังคาร", desc: "ระวังอุบัติเหตุ โทสะรุนแรง" },
        "๒": { target: "๕", name: "พระพฤหัสบดี", desc: "ผิดใจกับผู้ใหญ่ เสียทรัพย์" },
        "๓": { target: "๑", name: "พระอาทิตย์", desc: "การทะเลาะวิวาท ของมีคม" },
        "๔": { target: "๘", name: "พระราหู", desc: "ถูกหลอกลวง เอกสารมีปัญหา" },
        "๕": { target: "๒", name: "พระจันทร์", desc: "ถ้อยความ คดีความ ปัญหาสุขภาพ" },
        "๖": { target: "๗", name: "พระเสาร์", desc: "ผิดหวังความรัก การเงินติดขัด" },
        "๗": { target: "๖", name: "พระศุกร์", desc: "ความขมขื่น ของรักสูญหาย" },
        "๘": { target: "๔", name: "พระพุธ", desc: "ผิดคำพูด ถูกโกง เสียชื่อเสียง" }
    },
    // คู่สมพล (หน้า 30): เพิ่มพลังอำนาจ การงานก้าวหน้า
    somphon: {
        "๑": { target: "๖", name: "พระศุกร์", desc: "เด่นการเงินและชื่อเสียง" },
        "๒": { target: "๘", name: "พระราหู", desc: "เด่นโชคลาภแบบไม่คาดฝัน" },
        "๓": { target: "๕", name: "พระพฤหัสบดี", desc: "การงานสำเร็จด้วยสติปัญญา" },
        "๔": { target: "๗", name: "พระเสาร์", desc: "ความมั่นคงในทรัพย์สินที่ดิน" },
        "๕": { target: "๓", name: "พระอังคาร", desc: "มีพละกำลังเอาชนะอุปสรรค" },
        "๖": { target: "๑", name: "พระอาทิตย์", desc: "วาสนาดี มีคนเกรงใจ" },
        "๗": { target: "๔", name: "พระพุธ", desc: "ขยันขันแข็ง งานสำเร็จราบรื่น" },
        "๘": { target: "๒", name: "พระจันทร์", desc: "เมตตามหานิยม มีโชคจากทางไกล" }
    }
};

// เพิ่มคู่ธาตุ (ตามหน้า 29-30)
const ELEMENT_PAIRS = {
    "๑": { target: "๗", name: "พระเสาร์", element: "ธาตุไฟ", desc: "เสริมอำนาจ บารมี และความร้อนแรง" },
    "๒": { target: "๕", name: "พระพฤหัสบดี", element: "ธาตุดิน", desc: "เสริมความมั่นคง หลักฐาน และทรัพย์สิน" },
    "๓": { target: "๘", name: "พระราหู", element: "ธาตุลม", desc: "เสริมความกล้าหาญ การฉวยโอกาส และโชคลาภ" },
    "๔": { target: "๖", name: "พระศุกร์", element: "ธาตุน้ำ", desc: "เสริมเมตตา ความร่มเย็น และการเงิน" },
    "๕": { target: "๒", name: "พระจันทร์", element: "ธาตุดิน", desc: "เสริมความเมตตาจากผู้ใหญ่ และความมั่นคง" },
    "๖": { target: "๔", name: "พระพุธ", element: "ธาตุน้ำ", desc: "เสริมเสน่ห์ การเจรจา และความสุข" },
    "๗": { target: "๑", name: "พระอาทิตย์", element: "ธาตุไฟ", desc: "เสริมยศศักดิ์ และความเด็ดขาด" },
    "๘": { target: "๓", name: "พระอังคาร", element: "ธาตุลม", desc: "เสริมพละกำลัง และการเอาชนะอุปสรรค" }
};

const SUN_SAWOEI_DATA = {
    mainName: "พระอาทิตย์ (๑)",
    totalYears: 6,
    prediction: "ตกว่าปีนั้นจะเกิดลาภผลพูนผล มีเกียรติยศชื่อเสียง จะมีผู้ใหญ่สนับสนุนในหน้าที่การงานดีนัก",
    subPeriods: [
        { id: "1-1", name: "อาทิตย์แทรก", days: 120, text: "มีความสุขกายสบายใจ ศัตรูพ่ายแพ้ จะได้ลาภจากผู้ใหญ่หรือผู้มียศถาบรรดาศักดิ์" },
        { id: "1-2", name: "จันทร์แทรก", days: 300, text: "จะได้ลาภเป็นของขาวเหลือง (เงินทอง) ได้ลาภจากเพศตรงข้าม มีเสน่ห์ ชีวิตราบรื่น" },
        { id: "1-3", name: "อังคารแทรก", days: 160, text: "<b>ระวัง:</b> เกิดถ้อยความ ทะเลาะวิวาท เจ็บไข้ได้ป่วย ทรัพย์สินเสียหายหรือของหาย ระวังไฟและของมีคม" },
        { id: "1-4", name: "พุธแทรก", days: 340, text: "จะได้ลาภจากทางไกล การเจรจาสื่อสารสำเร็จผลดี มีสติปัญญาแก้ปัญหาได้ทุกประการ" },
        { id: "1-7", name: "เสาร์แทรก", days: 200, text: "<b>ระวัง:</b> ทุกข์ยาก ลำบากกายใจ ระวังโรคภัยไข้เจ็บ หรือเสียของรัก มีเรื่องเดือดร้อนใจ" },
        { id: "1-5", name: "พฤหัสแทรก", days: 380, text: "<b>ปีทอง:</b> ได้ลาภของมีค่า ผู้ใหญ่เมตตา จิตใจผ่องใสในธรรม มีเกณฑ์เลื่อนยศตำแหน่ง" },
        { id: "1-8", name: "ราหูแทรก", days: 240, text: "<b>ระวัง:</b> เกิดความมัวหมอง มีเรื่องเดือดร้อนจากเพื่อนฝูงบริวาร ถูกหลอกลวงหรือตัดสินใจผิด" },
        { id: "1-6", name: "ศุกร์แทรก", days: 420, text: "มีความสุขสำราญ ได้ลาภจากทางไกล ความรักสมหวัง การเงินหมุนเวียนคล่องตัวดีมาก" }
    ]
};

const MOON_SAWOEI_DATA = {
    mainName: "พระจันทร์ (๒)",
    totalYears: 15,
    prediction: "ตกว่าปีนั้นจะมีความสุขกายสบายใจ จะได้ลาภจากเพศตรงข้าม หรือได้ของขาวเหลืองถูกใจ มีเสน่ห์แก่คนทั้งหลาย",
    subPeriods: [
        { id: "2-2", name: "จันทร์แทรก", days: 750, text: "มีความสุขสำราญใจ คิดทำการสิ่งใดจะสำเร็จผล มีเสน่ห์เมตตาคนรักใคร่" },
        { id: "2-3", name: "อังคารแทรก", days: 400, text: "<b>ระวัง:</b> มีเรื่องร้อนใจ เกิดถ้อยความทะเลาะวิวาทกับเพื่อนฝูงหรือพี่น้อง ทรัพย์สินเสียหาย" },
        { id: "2-4", name: "พุธแทรก", days: 850, text: "<b>คู่มิตร:</b> ได้ลาภจากการเจรจา สติปัญญาดีเยี่ยม ผู้ใหญ่เมตตาเอ็นดู การค้าขายรุ่งเรือง" },
        { id: "2-7", name: "เสาร์แทรก", days: 500, text: "<b>ระวัง:</b> มีความวิตกกังวล ระวังจะเสียของรัก หรือมีอาการเจ็บไข้ได้ป่วยที่รักษายาก" },
        { id: "2-5", name: "พฤหัสแทรก", days: 950, text: "<b>คู่ธาตุดิน:</b> ตกว่าจะได้ลาภมหาศาล มีความสุขสำราญ ได้เลื่อนยศตำแหน่งหรือที่อยู่อาศัยใหม่" },
        { id: "2-8", name: "ราหูแทรก", days: 600, text: "<b>ระวัง:</b> มักถูกหลอกลวง มัวเมาในอบายมุข มีเรื่องมัวหมองใจ ห้ามหูเบาหรือลงทุนเสี่ยงดวง" },
        { id: "2-6", name: "ศุกร์แทรก", days: 1050, text: "มีความสุขในกามารมณ์ ความรักสมหวัง ได้ของสวยงามถูกใจ การเงินคล่องตัวดีมาก" },
        { id: "2-1", name: "อาทิตย์แทรก", days: 300, text: "จะได้ลาภจากผู้ใหญ่ที่เป็นชาย การงานมีความก้าวหน้า มีเกียรติยศชื่อเสียงเกิดขึ้น" }
    ]
};

const MARS_SAWOEI_DATA = {
    mainName: "พระอังคาร (๓)",
    totalYears: 8,
    prediction: "ตกว่าปีนั้นจะเกิดถ้อยความ ทะเลาะวิวาท หรือเจ็บไข้ได้ป่วย ทรัพย์สินจะเสียหาย ระวังอันตรายจากไฟและของมีคม",
    subPeriods: [
        { id: "3-3", name: "อังคารแทรก", days: 213, text: "<b>ระวัง:</b> จะเกิดถ้อยความ ทะเลาะวิวาทกับเพื่อนฝูงหรือญาติพี่น้อง ระวังของมีคมและไฟ" },
        { id: "3-4", name: "พุธแทรก", days: 453, text: "จะได้ลาภจากทางไกล การงานที่ยากจะสำเร็จด้วยสติปัญญาและการเจรจา" },
        { id: "3-7", name: "เสาร์แทรก", days: 266, text: "<b>ระวัง:</b> (คู่ศัตรู) จะเกิดความทุกข์ยาก ลำบากกายใจ เสียทรัพย์สินเงินทอง หรือเกิดการเจ็บป่วย" },
        { id: "3-5", name: "พฤหัสแทรก", days: 506, text: "<b>คู่สมพล:</b> ผู้ใหญ่จะเมตตาช่วยเหลือ คดีความหรือปัญหาที่มีจะคลี่คลายไปในทางที่ดี" },
        { id: "3-8", name: "ราหูแทรก", days: 320, text: "<b>คู่ธาตุลม:</b> จะมีโชคลาภกะทันหัน แต่ให้ระวังจะถูกหลอกลวงหรือมัวเมาในอบายมุข" },
        { id: "3-6", name: "ศุกร์แทรก", days: 560, text: "<b>คู่มิตร:</b> จะมีความสุขสำราญใจ ความรักสมหวัง ได้โชคลาภเงินทองจากเพศตรงข้าม" },
        { id: "3-1", name: "อาทิตย์แทรก", days: 160, text: "<b>ระวัง:</b> (คู่ศัตรู) จะมีเรื่องร้อนใจจากผู้ใหญ่ ระวังอุบัติเหตุและโทสะจะทำให้เสียการ" },
        { id: "3-2", name: "จันทร์แทรก", days: 400, text: "จิตใจเริ่มสงบขึ้น จะได้ลาภเป็นของขาวเหลือง มีเสน่ห์เมตตาคนรักใคร่" }
    ]
};

const MERCURY_SAWOEI_DATA = {
    mainName: "พระพุธ (๔)",
    totalYears: 17,
    prediction: "ตกว่าปีนั้นจะได้ลาภจากทางไกล การเจรจาติดต่อจะสำเร็จผลดี มีสติปัญญาเฉลียวฉลาด แก้ปัญหาได้ทุกประการ",
    subPeriods: [
        { id: "4-4", name: "พุธแทรก", days: 963, text: "สติปัญญาเฉลียวฉลาด คิดทำการสิ่งใดจะสำเร็จผลดี มีโชคลาภจากการพูดและการเขียน" },
        { id: "4-7", name: "เสาร์แทรก", days: 566, text: "<b>คู่สมพล:</b> การงานจะมั่นคง มีเกณฑ์ได้ลาภเป็นที่ดินหรืออสังหาริมทรัพย์ แต่ต้องขยันขันแข็งจึงจะสำเร็จ" },
        { id: "4-5", name: "พฤหัสแทรก", days: 1076, text: "ผู้ใหญ่จะให้ความเมตตาปราณี ได้เลื่อนยศตำแหน่ง จิตใจจะผ่องใสในธรรม มีโชคลาภจากผู้ทรงความรู้" },
        { id: "4-8", name: "ราหูแทรก", days: 680, text: "<b>ระวัง:</b> (คู่ศัตรู) จะถูกหลอกลวง เอกสารสัญญาผิดพลาด เสียชื่อเสียงเพราะคำพูด ห้ามใจร้อนหรือหูเบา" },
        { id: "4-6", name: "ศุกร์แทรก", days: 1190, text: "<b>คู่ธาตุน้ำ:</b> มีความสุขสำราญใจ การเงินรุ่งเรือง ความรักสมหวัง ได้โชคลาภเงินทองไหลมาเทมา" },
        { id: "4-1", name: "อาทิตย์แทรก", days: 340, text: "จะได้ลาภจากผู้ใหญ่ที่เป็นชาย ชื่อเสียงจะปรากฏ การงานที่ติดต่อไว้จะได้รับข่าวดี" },
        { id: "4-2", name: "จันทร์แทรก", days: 850, text: "<b>คู่มิตร:</b> มีเสน่ห์เมตตามหานิยม มีคนคอยอุปถัมภ์ช่วยเหลือ การเจรจาค้าขายคล่องตัวดีนัก" },
        { id: "4-3", name: "อังคารแทรก", days: 453, text: "<b>ระวัง:</b> จะเกิดการขัดแย้ง มีปากเสียงกับมิตรสหาย ให้ใช้สติและความใจเย็นเข้าแก้ปัญหา" }
    ]
};

const SATURN_SAWOEI_DATA = {
    mainName: "พระเสาร์ (๗)",
    totalYears: 10,
    prediction: "ตกว่าปีนั้นจะเกิดความทุกข์ยากลำบาก ระวังโรคภัยไข้เจ็บหรือเสียของรัก ให้ถือความอดทนเป็นที่ตั้ง",
    subPeriods: [
        { id: "7-7", name: "เสาร์แทรก", days: 333, text: "<b>ระวัง:</b> จะเกิดความทุกข์กายใจ มีเกณฑ์เสียของรักหรือของมีค่า ระวังโรคเก่ากำเริบ" },
        { id: "7-5", name: "พฤหัสแทรก", days: 633, text: "ผู้ใหญ่จะเข้ามาช่วยระงับเหตุร้าย ปัญหาที่หนักจะเบาบางลง มีเกณฑ์ได้โชคลาภจากสิ่งศักดิ์สิทธิ์" },
        { id: "7-8", name: "ราหูแทรก", days: 400, text: "<b>คู่มิตร:</b> จะได้ลาภจากทางไกล มีพรรคพวกบริวารช่วยเหลือ งานด้านอสังหาฯ หรือของเก่าจะเด่นมาก" },
        { id: "7-6", name: "ศุกร์แทรก", days: 700, text: "<b>ระวัง:</b> (คู่ศัตรู) ความรักขมขื่น การเงินติดขัด มีเรื่องเดือดร้อนใจเกี่ยวกับเพศตรงข้าม" },
        { id: "7-1", name: "อาทิตย์แทรก", days: 200, text: "<b>คู่ธาตุไฟ:</b> จะมีอำนาจบารมีเพิ่มขึ้น แต่ระวังความร้อนใจและอุบัติเหตุจากไฟหรือของร้อน" },
        { id: "7-2", name: "จันทร์แทรก", days: 500, text: "<b>ระวัง:</b> จะมีความวิตกกังวล จิตใจไม่สงบ ระวังการเจ็บป่วยของตนเองหรือญาติผู้ใหญ่" },
        { id: "7-3", name: "อังคารแทรก", days: 266, text: "<b>ระวัง:</b> (คู่ศัตรู) ระวังเลือดตกยางออก การทะเลาะวิวาทรุนแรง ห้ามประมาทเด็ดขาด" },
        { id: "7-4", name: "พุธแทรก", days: 566, text: "<b>คู่สมพล:</b> การงานจะเริ่มมั่นคงขึ้น มีเกณฑ์ได้ลาภเป็นทรัพย์สินชิ้นใหญ่หรือที่ดิน" }
    ]
};

const JUPITER_SAWOEI_DATA = {
    mainName: "พระพฤหัสบดี (๕)",
    totalYears: 19,
    prediction: "ตกว่าปีนั้นจะได้ลาภเป็นอันมาก มีความสุขสำราญยิ่งนัก จะได้เลื่อนยศตำแหน่ง หรือได้ที่อยู่อาศัยใหม่ จิตใจผ่องใสในธรรม",
    subPeriods: [
        { id: "5-5", name: "พฤหัสแทรก", days: 1203, text: "สติปัญญาแจ่มใส ผู้ใหญ่เมตตาอุปถัมภ์ ได้โชคลาภจากทางไกลหรือสิ่งศักดิ์สิทธิ์" },
        { id: "5-8", name: "ราหูแทรก", days: 760, text: "<b>ระวัง:</b> (คู่ศัตรู) จะถูกหลอกลวง มัวหมองใจ ระวังเรื่องอื้อฉาว หรือมีคนปองร้ายให้เสียชื่อเสียง" },
        { id: "5-6", name: "ศุกร์แทรก", days: 1330, text: "<b>คู่มิตร:</b> มีความสุขสำราญยิ่งนัก โชคลาภเงินทองไหลมา ความรักสมหวัง ได้ของมีค่า" },
        { id: "5-1", name: "อาทิตย์แทรก", days: 380, text: "<b>คู่มิตร:</b> มีเกียรติยศชื่อเสียงปรากฏ ผู้ใหญ่หนุนหลัง งานที่ติดต่อไว้จะได้รับผลสำเร็จดี" },
        { id: "5-2", name: "จันทร์แทรก", days: 950, text: "<b>คู่ธาตุดิน:</b> มีความมั่นคงในทรัพย์สินเงินทอง มีเสน่ห์เมตตา ได้ลาภจากเพศตรงข้าม" },
        { id: "5-3", name: "อังคารแทรก", days: 506, text: "<b>คู่สมพล:</b> การงานจะสำเร็จด้วยความขยันและปัญญา จะได้ชัยชนะเหนือศัตรูคู่แข่ง" },
        { id: "5-4", name: "พุธแทรก", days: 1076, text: "จะได้ลาภจากการเจรจา การค้าขายรุ่งเรือง มีสติปัญญาดีเยี่ยม แก้ปัญหาได้ทุกประการ" },
        { id: "5-7", name: "เสาร์แทรก", days: 633, text: "ผู้ใหญ่จะช่วยระงับเหตุร้าย ปัญหาที่หนักจะเบาบางลง มีเกณฑ์ได้ลาภเป็นที่ดินอสังหาฯ" }
    ]
};

const RAHU_SAWOEI_DATA = {
    mainName: "พระราหู (๘)",
    totalYears: 12,
    prediction: "ตกว่าปีนั้นจะเกิดการเปลี่ยนแปลงกะทันหัน มีลาภลอยหรือโชคจากทางไกล แต่ให้ระวังความมัวเมาและการถูกหลอกลวง",
    subPeriods: [
        { id: "8-8", name: "ราหูแทรก", days: 480, text: "<b>ระวัง:</b> มัวเมาในอบายมุข มีเรื่องมัวหมองใจ ระวังการถูกหลอกลวงหรือตัดสินใจผิดพลาดเพราะความหลง" },
        { id: "8-6", name: "ศุกร์แทรก", days: 840, text: "จะได้โชคลาภจากการเสี่ยง หรือโชคจากทางไกล ความรักมีเสน่ห์แต่อาจเป็นแบบฉาบฉวย การเงินหมุนเวียนดี" },
        { id: "8-1", name: "อาทิตย์แทรก", days: 240, text: "<b>ระวัง:</b> มีเรื่องร้อนใจจากผู้ใหญ่ เกียรติยศชื่อเสียงมัวหมอง ระวังอันตรายจากไฟหรือของร้อน" },
        { id: "8-2", name: "จันทร์แทรก", days: 600, text: "<b>ระวัง:</b> จิตใจฟุ้งซ่าน หลงเชื่อคนง่าย จะเสียทรัพย์เพราะเพศตรงข้าม หรือมีเรื่องอื้อฉาวใจ" },
        { id: "8-3", name: "อังคารแทรก", days: 320, text: "<b>คู่ธาตุลม:</b> จะมีลาภผลกะทันหัน แต่ระวังอุบัติเหตุจากการเดินทางและความใจร้อน" },
        { id: "8-4", name: "พุธแทรก", days: 680, text: "<b>ระวัง:</b> (คู่ศัตรู) การเจรจาเอกสารสัญญาจะมีปัญหา ถูกนินทาว่าร้าย หรือผิดคำพูดจนเสียเรื่อง" },
        { id: "8-7", name: "เสาร์แทรก", days: 400, text: "<b>คู่มิตร:</b> (นักเลงเจอนักเลง) จะได้ลาภมหาศาลจากงานใหญ่ อสังหาริมทรัพย์ หรือโชคจากแดนไกล มีพรรคพวกช่วยเหลือ" },
        { id: "8-5", name: "พฤหัสแทรก", days: 760, text: "<b>ระวัง:</b> (คู่ศัตรู) จะผิดใจกับผู้ใหญ่หรือครูบาอาจารย์ คดีความเบียดเบียน หรือเสียทรัพย์เพราะความประมาท" }
    ]
};

const VENUS_SAWOEI_DATA = {
    mainName: "พระศุกร์ (๖)",
    totalYears: 21,
    prediction: "ตกว่าปีนั้นจะมีความสุขสำราญ ได้ลาภจากทางไกล ความรักสมหวัง การเงินหมุนเวียนคล่องตัว มีโชคลาภโภคทรัพย์มหาศาล",
    subPeriods: [
        { id: "6-6", name: "ศุกร์แทรก", days: 1470, text: "มีความสุขกายสบายใจ ได้ลาภจากของสวยงาม ความรักสดชื่นสมหวัง การเงินดีเยี่ยม" },
        { id: "6-1", name: "อาทิตย์แทรก", days: 420, text: "จะได้ลาภจากผู้ใหญ่ เกียรติยศชื่อเสียงปรากฏ การงานที่ติดต่อไว้จะได้รับข่าวดี" },
        { id: "6-2", name: "จันทร์แทรก", days: 1050, text: "มีเสน่ห์เมตตามหานิยม มีโชคลาภจากเพศตรงข้าม ชีวิตมีความสุขสำราญยิ่งนัก" },
        { id: "6-3", name: "อังคารแทรก", days: 560, text: "<b>คู่มิตร:</b> จะได้โชคลาภเงินทองจากมิตรสหาย แต่ระวังความใจร้อนจะทำให้เสียทรัพย์ย่อยยับ" },
        { id: "6-4", name: "พุธแทรก", days: 1190, text: "<b>คู่ธาตุน้ำ:</b> การเจรจาค้าขายรุ่งเรือง สติปัญญาดี มีโชคลาภจากการสื่อสารและการเดินทาง" },
        { id: "6-7", name: "เสาร์แทรก", days: 700, text: "<b>ระวัง:</b> (คู่ศัตรู) ความรักขมขื่น มีเกณฑ์พลัดพรากจากที่อยู่หรือของรัก การเงินติดขัดขัดสน" },
        { id: "6-5", name: "พฤหัสแทรก", days: 1330, text: "<b>คู่มิตร:</b> ผู้ใหญ่และครูบาอาจารย์จะเมตตาอุปถัมภ์ ได้โชคลาภก้อนใหญ่หรือเลื่อนยศตำแหน่ง" },
        { id: "6-8", name: "ราหูแทรก", days: 840, text: "จะมีโชคลาภจากการเสี่ยงโชค แต่ระวังเรื่องอื้อฉาวมัวหมองใจ ห้ามมัวเมาในอบายมุข" }
    ]
};

const STAR_TRAITS = {
    1: { trait: "ทายยศศักดิ์", jrit: "ทิฐิจริต (มานะ)" }, // อาทิตย์
    2: { trait: "รูปจริต", jrit: "ราคะจริต" },           // จันทร์
    3: { trait: "กล้าแข็งขยัน", jrit: "โทสะจริต" },      // อังคาร
    4: { trait: "เจรจาอ่อนหวาน", jrit: "ศรัทธาจริต" },    // พุธ
    5: { trait: "ปัญญาศีลธรรมบริสุทธิ์", jrit: "พุทธจริต" }, // พฤหัสบดี
    6: { trait: "กิเลสสมบัติ", jrit: "ราคะจริต" },       // ศุกร์
    7: { trait: "โทษทุกข์", jrit: "วิตกจริต" },          // เสาร์
    8: { trait: "มัวเมา", jrit: "โมหะจริต" },           // ราหู
    9: { trait: "อายุยืนอยู่", jrit: "วิญญาณจริต" },     // เกตุ (เสริมจากตำรา)
    0: { trait: "ภัยอาเพศ", jrit: "จินตจริต" }          // มฤตยู (เสริมจากตำรา)
};

// ข้อมูลนิสัยและจริตดาวจากคัมภีร์ (สกัดจากรูปภาพที่ประธานส่งมา)
const STAR_CORE_TRAITS = {
    1: { trait: "ทายยศศักดิ์", jrit: "ทิฐิจริต (มานะ)", icon: "👑" }, // อาทิตย์
    2: { trait: "ทายรูปจริต", jrit: "ราคะจริต (เพลิดเพลิน)", icon: "🌙" }, // จันทร์
    3: { trait: "ทายกล้าแข็งขยัน", jrit: "โทสะจริต (วู่วาม)", icon: "⚔️" }, // อังคาร
    4: { trait: "ทายเจรจาอ่อนหวาน", jrit: "ศรัทธาจริต (เชื่อมั่น)", icon: "💬" }, // พุธ
    7: { trait: "ทายโทษทุกข์", jrit: "วิตกจริต (กังวล)", icon: "🪐" }, // เสาร์
    5: { trait: "ทายปัญญาบริสุทธิ์", jrit: "พุทธจริต (ใช้เหตุผล)", icon: "🙏" }, // พฤหัสบดี
    8: { trait: "ทายมัวเมา", jrit: "โมหะจริต (หลงลืม)", icon: "🌑" }, // ราหู
    6: { trait: "ทายกิเลสสมบัติ", jrit: "ราคะจริต (หลงใหล)", icon: "🎨" } // ศุกร์
};

const STAR_ADVICE = {
    1: {
        advice: "ช่วงนี้บารมีแรง มีเกณฑ์ได้ลาภยศหรือตำแหน่ง แต่ต้องระวัง 'ทิฐิจริต' จะทำให้คนรอบข้างหมั่นไส้ ควรลดความใจร้อนและเลิกเอาตัวเองเป็นศูนย์กลาง ลองรับฟังความเห็นผู้อื่นบ้างจะรุ่งมาก",
        remedy: "ทำบุญด้วยแสงสว่าง เติมน้ำมันตะเกียง หรือบริจาคหลอดไฟให้วัด/โรงเรียน"
    },
    2: {
        advice: "ตกใน 'ราคะจริต' จิตใจจะอ่อนไหวง่าย เพลิดเพลินไปกับสิ่งสวยงามและคำหวาน ระวังจะถูกหลอกเพราะความขี้สงสาร หรือเสียเงินไปกับของไม่จำเป็น จิตใจช่วงนี้จะรวนเรเหมือนน้ำขึ้นน้ำลง",
        remedy: "ทำบุญเกี่ยวกับน้ำดื่ม หรือบริจาคเงินสมทบทุนช่วยเหลือสตรีและเด็ก"
    },
    3: {
        advice: "พลัง 'โทสะจริต' รุนแรงมาก จะขยันผิดปกติ อยากทำนู่นทำนี่ตลอดเวลา แต่ระวังอารมณ์วู่วามจะพาซวย มีเกณฑ์ปากเสียงหรืออุบัติเหตุจากความประมาท อย่าด่วนตัดสินใจอะไรในขณะที่โกรธ",
        remedy: "บริจาคโลหิต หรือทำบุญซื้ออุปกรณ์การแพทย์ เครื่องมือตัดเย็บ"
    },
    4: {
        advice: "ตก 'ศรัทธาจริต' เชื่อคนง่าย ใครพูดอะไรก็เคลิ้มตามได้หมด แม้จะเจรจาเก่งค้าขายดี แต่ต้องระวังการเซ็นเอกสารหรือการรับปากใครสุ่มสี่สุ่มห้า ช่วงนี้ข้อมูลจะเยอะจนสับสน ควรมีสติในการคัดกรอง",
        remedy: "ทำบุญด้วยหนังสือธรรมะ หนังสือเรียน หรือบริจาคเครื่องเขียนให้เด็กยากไร้"
    },
    5: {
        advice: "อยู่ในช่วง 'พุทธจริต' สติปัญญาดีเยี่ยม เหมาะแก่การเรียนรู้หรือวางแผนระยะยาว ผู้ใหญ่จะเมตตาเป็นพิเศษ แต่ระวังจะกลายเป็นคนเจ้าระเบียบเกินไปจนคนข้างๆ อึดอัด อย่าเอาบรรทัดฐานตัวเองไปวัดคนอื่น",
        remedy: "ถวายสังฆทานยา บริจาคผ้าไตรจีวร หรือสมทบทุนสร้างสถานศึกษา"
    },
    6: {
        advice: "กิเลสสมบัติเข้าครอบงำ ตกใน 'ราคะจริต' สายสุนทรีย์ อยากกินของอร่อย อยากเที่ยว อยากใช้เงินแก้ปัญหา ระวังเรื่องความรักแทรกซ้อนหรือความหลงมัวเมาในกามารมณ์จะทำให้เสียงาน",
        remedy: "ทำบุญด้วยของหอม ธูปหอม ดอกไม้สด หรืออาสากวาดลานวัด"
    },
    7: {
        advice: "พลัง 'วิตกจริต' ทำงานหนัก คิดวนเวียนอยู่กับเรื่องเก่าๆ หรือกังวลอนาคตที่ยังไม่มาถึง มีเกณฑ์เหนื่อยหนักแบกภาระแทนคนอื่น ระวังสุขภาพทางจิตหรือโรคเครียดลงกระเพาะ",
        remedy: "ทำบุญโลงศพ บริจาคให้โรงพยาบาลโรคทางจิต หรือปลูกต้นไม้ในที่สาธารณะ"
    },
    8: {
        advice: "ตกอยู่ใน 'โมหะจริต' มัวเมาไปกับอบายมุขหรือสิ่งลวงตาได้ง่าย จิตใจพร่ามัว ตัดสินใจผิดพลาดเพราะความหลงผิด ระวังการถูกชักชวนไปในทางที่ไม่ดีหรือการพนันจะทำให้ทรัพย์ละลาย",
        remedy: "ทำบุญเกี่ยวกับการให้ปัญญา บริจาคแว่นตา หรือร่วมหล่อพระพุทธรูป"
    }
};

// 2. ฟังก์ชันแปลง DD/MM/YYYY เป็น YYYY-MM-DD เพื่อใช้กับ Input Date
function formatToInputDate(dateStr) {
    if (!dateStr) return "";

    // กรณีข้อมูลมาเป็น DD/MM/YYYY
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
    }

    return dateStr; // กรณีข้อมูลมาเป็น YYYY-MM-DD อยู่แล้ว
}

// 3. ฟังก์ชันดึงรายชื่อสมาชิกมาใส่ใน Select Box
async function loadMembersToThaksa() {
    const memberSelect = document.getElementById('memberSelect');
    if (!memberSelect) return;

    try {
        const db = getFirestore();
        const currentUser = localStorage.getItem('thaiHoroUserName');

        let q = collection(db, "horo_history");
        if (currentUser) {
            q = query(collection(db, "horo_history"), where("owner", "==", currentUser));
        }

        const querySnapshot = await getDocs(q);
        memberSelect.innerHTML = '<option value="">-- เลือกสมาชิก --</option>';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = data.birthdate;
            option.textContent = `${data.name} (${data.birthdate})`;
            memberSelect.appendChild(option);
        });

        console.log("โหลดรายชื่อสมาชิกสำเร็จ");
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

// 4. ผูก Event ต่างๆ เมื่อโหลดหน้า (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    // เรียกโหลดสมาชิกทันทีที่เปิดหน้า
    loadMembersToThaksa();
});

document.getElementById('memberSelect').addEventListener('change', function (e) {
    const rawDate = e.target.value;
    if (rawDate) {
        const bDateInput = document.getElementById('birthdate');
        if (bDateInput) {
            // 1. แปลงฟอร์แมตวันที่
            const formattedDate = formatToInputDate(rawDate);
            bDateInput.value = formattedDate;

            // 2. กระตุ้น Event เพื่อให้ UI รับรู้
            bDateInput.dispatchEvent(new Event('change'));
            bDateInput.dispatchEvent(new Event('input'));

            // 3. เรียกฟังก์ชันคำนวณโดยตรง (เปลี่ยนชื่อเป็น calculateThaksa)
            if (typeof calculateThaksa === 'function') {
                calculateThaksa(false); // ใส่ false เพื่อบอกว่าไม่ได้แก้ด้วยมือ (Manual)
                console.log("✅ คำนวณมหาทักษาอัตโนมัติสำเร็จ");
            } else {
                // ถ้ายังหาไม่เจออีก ให้ลองเช็กว่าฟังก์ชันถูกส่งออกไปที่ window หรือยัง
                if (typeof window.calculateThaksa === 'function') {
                    window.calculateThaksa(false);
                    console.log("✅ คำนวณผ่าน window.calculateThaksa สำเร็จ");
                } else {
                    console.error("❌ หาฟังก์ชัน calculateThaksa ไม่เจอในระบบ");
                }
            }
        }
    }
});

// 5. สำคัญมาก: ส่งออกฟังก์ชันไปที่ Global Scope 
// เพื่อให้ปุ่มคำนวณใน HTML หรือไฟล์ script.js เรียกใช้ได้
window.loadMembersToThaksa = loadMembersToThaksa;
window.formatToInputDate = formatToInputDate;
window.calculateThaksaAge = calculateThaksaAge;
window.findSubPeriodByDate = findSubPeriodByDate;
window.getSubPeriodDays = getSubPeriodDays;
window.getSubPeriodHTML = getSubPeriodHTML;
window.getSawoeiContent = getSawoeiContent;


function getSubPeriodDays(mainPlanetYears, subPlanetYears) {
    // สูตร: (ปีหลัก * ปีแทรก * 360) / 108
    const totalDays = (mainPlanetYears * subPlanetYears * 360) / 108;
    return Math.floor(totalDays);
}

function getSubPeriodHTML(planetData) {
    let html = `<div class="p-3 border-gold bg-dark rounded shadow-sm">
                    <h5 class="text-warning text-center border-bottom pb-2">
                        <i class="fas fa- calendar-alt mr-2"></i>ช่วงแทรกย่อย: ${planetData.mainName} เสวยอายุ
                    </h5>`;

    planetData.subPeriods.forEach(sub => {
        const y = Math.floor(sub.days / 360);
        const m = Math.floor((sub.days % 360) / 30);
        const d = sub.days % 30;

        let duration = `${y > 0 ? y + ' ปี ' : ''}${m > 0 ? m + ' เดือน ' : ''}${d > 0 ? d + ' วัน' : ''}`;

        html += `
            <div class="mt-3 p-2 rounded" style="background: rgba(255,255,255,0.05)">
                <div class="d-flex justify-content-between align-items-center">
                    <strong class="text-gold">${sub.name}</strong>
                    <small class="badge badge-secondary">${duration.trim()}</small>
                </div>
                <p class="small text-light mb-0 mt-1" style="opacity: 0.8">${sub.text}</p>
            </div>`;
    });

    html += `</div>`;
    return html;
}

function getSawoeiContent(currentPlanet) {
    let data;
    if (currentPlanet === 1) data = SUN_SAWOEI_DATA;
    else if (currentPlanet === 2) data = MOON_SAWOEI_DATA;
    else if (currentPlanet === 3) data = MARS_SAWOEI_DATA;
    // ... ดาวอื่นๆ ...

    if (!data) return "";

    return `
        <div class="card bg-dark border-gold">
            <div class="card-header text-center text-warning">
                <h4>${data.mainName} เสวยอายุ (${data.totalYears} ปี)</h4>
                <p class="small mb-0">${data.prediction}</p>
            </div>
            <div class="card-body">
                ${getSubPeriodHTML(data)} 
            </div>
        </div>
    `;
}


/**
 * ฟังก์ชันคำนวณอายุย่างและระบุตัวเลขดาวเสวยอายุ
 * @param {string} birthdateStr - วันเกิดรูปแบบ "YYYY-MM-DD"
 * @returns {Object} - อายุเต็ม, อายุย่าง, และดาวที่เสวยอายุขณะนั้น
 */
function calculateThaksaAge(birthdateStr) {
    const birthdate = new Date(birthdateStr);
    const today = new Date(); // วันที่ปัจจุบัน

    // 1. คำนวณอายุเต็ม (ปี)
    let ageFull = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        ageFull--;
    }

    // 2. อายุย่าง (มหาทักษาใช้ตัวนี้)
    const ageYang = ageFull + 1;

    // 3. หาดาวเสวยอายุ (ตามลำดับ 1, 2, 3, 4, 7, 5, 8, 6)
    // ลำดับปีเสวย: 6, 15, 8, 17, 10, 19, 12, 21 (รวม 108 ปี)
    const sawoeiOrder = [
        { id: 1, years: 6 },
        { id: 2, years: 15 },
        { id: 3, years: 8 },
        { id: 4, years: 17 },
        { id: 7, years: 10 },
        { id: 5, years: 19 },
        { id: 8, years: 12 },
        { id: 6, years: 21 }
    ];

    // คำนวณหาตำแหน่งดาว (ตัดรอบที่ 108 ปี)
    let currentAgePoint = ageYang % 108;
    if (currentAgePoint === 0) currentAgePoint = 108;

    let accumulatedYears = 0;
    let mainPlanet = null;
    let startYearOfPeriod = 0;

    for (let i = 0; i < sawoeiOrder.length; i++) {
        accumulatedYears += sawoeiOrder[i].years;
        if (currentAgePoint <= accumulatedYears) {
            mainPlanet = sawoeiOrder[i].id;
            startYearOfPeriod = accumulatedYears - sawoeiOrder[i].years;
            break;
        }
    }

    // 4. คำนวณปีที่ "แทรก" อยู่ (ว่าเสวยมาแล้วกี่ปีในรอบนั้น)
    const yearInPeriod = currentAgePoint - startYearOfPeriod;

    return {
        ageFull: ageFull,
        ageYang: ageYang,
        mainPlanet: mainPlanet,
        yearInPeriod: yearInPeriod // ปีที่เท่าไหร่ของดาวดวงนั้นที่เสวยอยู่
    };
}

/**
 * ฟังก์ชันหาดาวเสวยและดาวแทรกแบบละเอียดรายวัน
 * @param {string} birthdateStr - วันเกิด (YYYY-MM-DD)
 * @param {string} targetDateStr - วันที่ต้องการดูดวง (ถ้าไม่ใส่จะใช้ปัจจุบัน)
 */
function findSubPeriodByDate(birthdateStr, targetDateStr = null) {
    const birthdate = new Date(birthdateStr);
    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

    // 1. คำนวณหาจำนวนวันที่ใช้ชีวิตมาทั้งหมด (1 ปีโหร = 360 วัน)
    // ใช้เกณฑ์มหาทักษา: อายุเต็ม + 1 = อายุย่าง
    // เราจะหา "วันสะสม" ในรอบ 108 ปี (38,880 วัน)
    const diffTime = targetDate - birthdate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // หาตำแหน่งวันในรอบ 108 ปี
    const totalDaysInCycle = 108 * 360;
    let currentCycleDay = diffDays % totalDaysInCycle;

    // ลำดับดาวเสวยและจำนวนวัน (ปี * 360)
    const sawoeiPlanets = [
        { id: 1, name: "อาทิตย์", years: 6, days: 2160 },
        { id: 2, name: "จันทร์", years: 15, days: 5400 },
        { id: 3, name: "อังคาร", years: 8, days: 2880 },
        { id: 4, name: "พุธ", years: 17, days: 6120 },
        { id: 7, name: "เสาร์", years: 10, days: 3600 },
        { id: 5, name: "พฤหัส", years: 19, days: 6840 },
        { id: 8, name: "ราหู", years: 12, days: 4320 },
        { id: 6, name: "ศุกร์", years: 21, days: 7560 }
    ];

    // 2. หาดาวหลักที่เสวยอายุ (Main Planet)
    let accumulatedDays = 0;
    let mainPlanet = null;
    let daysIntoMainPlanet = 0;

    for (let p of sawoeiPlanets) {
        if (currentCycleDay < (accumulatedDays + p.days)) {
            mainPlanet = p;
            daysIntoMainPlanet = currentCycleDay - accumulatedDays;
            break;
        }
        accumulatedDays += p.days;
    }

    // 3. หาดาวที่เข้าแทรก (Sub Planet)
    // สูตรหาดาวแทรก: (วันเสวยของดาวหลัก * วันเสวยของดาวแทรก) / 108
    // แต่เพื่อให้ง่าย เราจะเรียงลำดับดาวแทรกเริ่มจากดาวหลักเอง
    const planetIds = [1, 2, 3, 4, 7, 5, 8, 6];
    let startIndex = planetIds.indexOf(mainPlanet.id);
    let sortedSubPlanets = [];

    for (let i = 0; i < 8; i++) {
        let pId = planetIds[(startIndex + i) % 8];
        let pInfo = sawoeiPlanets.find(x => x.id === pId);
        // คำนวณวันแทรก: (ปีเสวยหลัก * ปีเสวยแทรก * 360) / 108
        let subDays = Math.floor((mainPlanet.years * pInfo.years * 360) / 108);
        sortedSubPlanets.push({ id: pId, name: pInfo.name, subDays: subDays });
    }

    let subAccumulated = 0;
    let currentSubPlanet = null;
    let daysIntoSubPlanet = 0;

    for (let sub of sortedSubPlanets) {
        if (daysIntoMainPlanet < (subAccumulated + sub.subDays)) {
            currentSubPlanet = sub;
            daysIntoSubPlanet = daysIntoMainPlanet - subAccumulated;
            break;
        }
        subAccumulated += sub.subDays;
    }

    return {
        main: mainPlanet.name,
        sub: currentSubPlanet.name,
        subNum: currentSubPlanet.id,
        daysInSub: Math.floor(daysIntoSubPlanet),
        totalSubDays: currentSubPlanet.subDays,
        percent: ((daysIntoSubPlanet / currentSubPlanet.subDays) * 100).toFixed(2)
    };
}

function showBirthDestiny(startDayIndex) {
    const destiny = BIRTH_DESTINY_DATA[startDayIndex];
    const angel = ANGEL_DATA[startDayIndex];

    return `
        <div class="mt-4 p-3">
            <h4 class="text-gold"><i class="fas fa-star mr-2"></i>พื้นดวงชะตาภูมิกำเนิด <i class="fas fa-star mr-2"></i></h4> 
            <span class="text-gold" style="font-size: 50px; font-weight: bold;"><span style="color:${angel.bg}">วัน${destiny.day}</span></span><br>
            <div class="badge ${angel.type === 'บาปเคราะห์' ? 'badge-danger' : 'badge-success'} mb-2"> ฝ่าย${angel.type}</div><br>
            <span class="text-gold">ทรง ${angel.vehicle} เป็นพาหนะ มีกำลังดาว ${angel.power} ${angel.animal} ${angel.desc} ${angel.location}</p>
            <span class="text-gold" style="line-height: 1.6;">${destiny.text}</p>
            <span class="text-gold"> สีมงคล: ${angel.luckyColor} สีไม่มงคล: ${angel.unluckyColor}</p>
        </div>
    `;
}

window.calculateThaksa = function (isManualChange = false) {
    const daySelect = document.getElementById('birthDaySelecttaksa');
    const bDateInput = document.getElementById('birthdate');
    const display = document.getElementById('thaksaDisplay');
    const ageLabel = document.getElementById('displayAgeYang');
    const detail = document.getElementById('thaksaDetail');
    const resultBox = document.getElementById('thaksaResult');



    if (!daySelect || !display) return;

    let ageYang = 0;

    // 1. คำนวณอายุย่างจากช่อง Input
    if (bDateInput && bDateInput.value) {
        const bDate = new Date(bDateInput.value);
        const today = new Date();

        // ปีปัจจุบัน - ปีเกิด + 1 (หลักโหราศาสตร์ไทย)
        ageYang = (today.getFullYear() - bDate.getFullYear()) + 1;

        if (ageLabel) {
            ageLabel.innerHTML = `อายุย่าง ${ageYang} ปี`;
            ageLabel.style.display = "inline-block";
        }

        // ถ้าเปิดหน้ามาครั้งแรก หรือเปลี่ยนวันที่ปฏิทิน ให้ Auto Select วันเกิดในทักษา
        if (!isManualChange) {
            const dayOfWeek = bDate.getDay();
            const thaksaMapping = [0, 1, 2, 3, 5, 7, 4]; // อา(0), จ(1), อ(2), พุธ(3), พฤ(5), ศ(7), ส(4)
            daySelect.value = thaksaMapping[dayOfWeek];
        }
    } else {
        if (ageLabel) ageLabel.innerHTML = "กรุณาระบุวันเกิดในปฏิทิน";
    }

    let startDay = parseInt(daySelect.value);

    // 2. คำนวณภูมิเสวย (ตำแหน่งที่อายุตก)
    let currentPos = (startDay + (ageYang > 0 ? ageYang - 1 : 0)) % 8;

    // 3. วาดวงล้อทักษา
    display.innerHTML = '';
    let resultHTML = '';
    for (let i = 0; i < 8; i++) {
        let planetIndex = (startDay + i) % 8;
        let isCurrent = (planetIndex === currentPos && ageYang > 0);
        let thaksaType = THAKSA_NAMES[i];

        let activeStyle = isCurrent
            ? "border: 2px solid #d4af37; background: rgba(212,175,55,0.3); box-shadow: 0 0 20px rgba(212,175,55,0.5); transform: scale(1.05);"
            : "border: 1px solid rgba(212,175,55,0.3); background: rgba(0,0,0,0.2);";

        resultHTML += `
            <div class="col-6 col-md-3 mb-3">
                <div class="p-2 rounded text-center transition-all" style="${activeStyle}">
                    <small class="${isCurrent ? 'text-warning font-weight-bold' : 'text-muted'} d-block">
                        ${thaksaType} ${isCurrent ? '<b>(ปีนี้)</b>' : ''}
                    </small>
                    <span class="text-white" style="font-size: 0.9rem;">${PLANET_NAMES[planetIndex]}</span>
                </div>
            </div>
        `;
    }
    display.innerHTML = resultHTML;

    // 4. แสดงคำทำนายและเทวดา
    if (resultBox) resultBox.style.display = 'block';
    const angel = ANGEL_DATA[currentPos];
    const sriPlanet = PLANET_NAMES[(currentPos + 3) % 8];
    const kaliPlanet = PLANET_NAMES[(currentPos + 7) % 8];
    const kaliAngel = ANGEL_DATA[(currentPos + 7) % 8]; // ดึงข้อมูลเทวดาที่เป็นกาลกิณีจรปีนี้

    const planetNum = ["๑", "๒", "๓", "๔", "๗", "๕", "๘", "๖"][currentPos];
    const partner = PLANET_RELATIONS.partners[planetNum];
    const enemy = PLANET_RELATIONS.enemies[planetNum];
    const somphon = PLANET_RELATIONS.somphon[planetNum];
    const elementPair = ELEMENT_PAIRS[planetNum];
    const birthdateEl = document.getElementById('birthdate');

    if (!birthdateEl || !birthdateEl.value) {
        console.error("❌ birthdate element or value not found");
        alert;
        return;
    }

    const birthDay = birthdateEl.value;

    const result = findSubPeriodByDate(birthDay);

    // 1. เรียกใช้ฟังก์ชันคำนวณอายุที่สร้างไว้ก่อนหน้า
    const userStatus = calculateThaksaAge(birthDay);

    // 2. สร้างที่เก็บข้อมูลรวม (รวบรวมตัวแปรที่เราสร้างไว้ ๑-๖)
    const ALL_SAWOEI_DATA = {
        1: SUN_SAWOEI_DATA,
        2: MOON_SAWOEI_DATA,
        3: MARS_SAWOEI_DATA,
        4: MERCURY_SAWOEI_DATA,
        7: SATURN_SAWOEI_DATA,
        5: JUPITER_SAWOEI_DATA,
        8: RAHU_SAWOEI_DATA,
        6: VENUS_SAWOEI_DATA
    };

    // 3. ดึงข้อมูลดาวหลักที่เสวยอยู่ปัจจุบัน
    const currentMainData = ALL_SAWOEI_DATA[userStatus.mainPlanet];

    // 4. ดึงคำทำนายแทรก "รายปี" (Logic ที่ประธานถาม)
    let currentYearPrediction = "";
    if (currentMainData) {
        // ป้องกัน Error ถ้า yearInPeriod เกินจำนวนที่มีใน Array
        const subIdx = userStatus.yearInPeriod - 1;
        if (currentMainData.subPeriods[subIdx]) {
            currentYearPrediction = currentMainData.subPeriods[subIdx].text;
        }
    }

    // คำนวณดาวคู่ต้านทาน
    const resister = angel.resistance;

    // วันที่ปัจจุบันที่ใช้คำนวณดาวแทรก
    const currentDate = new Date();

    const starNameToNum = {
        "อาทิตย์": 1, "จันทร์": 2, "อังคาร": 3, "พุธ": 4,
        "เสาร์": 7, "พฤหัสบดี": 5, "ราหู": 8, "ศุกร์": 6
    };

    // 2. ดึงเลขดาวจากชื่อดาวที่อยู่ใน result.sub
    const currentSubNum = starNameToNum[result.sub];


    const subStarNum = result?.subNum || 0;

    const traitInfo = STAR_CORE_TRAITS[subStarNum] || { trait: "-", jrit: "-", icon: "✨" };
    const starInfo = STAR_TRAITS[subStarNum] || { trait: traitInfo.trait, jrit: traitInfo.jrit };
    const adviceInfo = STAR_ADVICE[subStarNum] || { advice: "-", remedy: "-" };

    // กรณีไม่มีเลขดาว ให้เทียบจากชื่อแทน
    const starMap = { "อาทิตย์": 1, "จันทร์": 2, "อังคาร": 3, "พุธ": 4, "เสาร์": 7, "พฤหัสบดี": 5, "ราหู": 8, "ศุกร์": 6 };
    const currentId = starMap[result.sub]; // แปลงชื่อ "อาทิตย์" เป็นเลข 1


    const card1_HTML = `
    <div id="capture-card1" class="p-3 mb-2" style="background: #000; border-radius: 15px;">
                <div class="mb-3" style="text-align: center;">
                    ${showBirthDestiny(startDay)}
                </div>
        <div class="text-center mb-4 p-3 border-gold" style="background: rgba(0,0,0,0.5); border-radius: 15px;">
            <h4 class="text-gold">ปีนี้อายุย่าง ${ageYang || '--'} ปี</h4>
            <span class="text-warning">เทวดาเสวยอายุ ${angel.name} <span class="small text-gold">( ${angel.desc} )</span></span><br>
            <span class="small text-gold"><i class="fas fa-shield-alt"></i> มีดาวคู่ต้านทานภัยปีนี้: <b>${resister}</b></span><br>
            <span class="text-gold mb-0"><b>คำทำนาย:</b> ${angel.prediction}</span><br>
            <span class="small text-white-50"><i class="fas fa-magic"></i> <b>เคล็ดลับ:</b> ${angel.shrine}</span>
        </div>
    </div>
        `;

    const card2_HTML = `
    <div id="capture-card2" class="p-3 mb-2" style="background: #000; border-radius: 15px;">
        <div class="my-2 p-2 rounded" style="text-align: center; background: rgba(212,175,55,0.1); border: 1px dashed #d4af37;">
                <span class="text-gold small">ทิศรักษาประจำปีนี้:</span><br>
                <b class="text-white"><i class="fas fa-compass mr-1"></i> ${angel.direction}</b>
        </div>        
        <div class="row text-center mt-3">
            <div class="col-6">
                <div class="p-2 border rounded border-warning" style="background: rgba(255,193,7,0.1)">
                        <small class="text-warning d-block">ศรีจร (สิริมงคล)</small>
                        <b class="text-white">${PLANET_NAMES[(currentPos + 3) % 8]}</b>
                        <p class="x-small text-muted mb-0">${THAKSA_INFO["ศรี"]}</p>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-2 border rounded border-danger" style="background: rgba(220,53,69,0.1)">
                        <small class="text-danger d-block">กาลกิณีจร (สิ่งที่ห้าม)</small>
                        <b class="text-white">${PLANET_NAMES[(currentPos + 7) % 8]}</b>
                        <p class="x-small text-muted mb-0">${THAKSA_INFO["กาลกิณี"]}</p>
                    </div>               
            </div>      
        </div>
        <div class="mt-3 p-2 bg-dark rounded" style="text-align: center; border: 1px solid #d4af37;">
                    <p class="text-white mb-1"><b>เสื้อสีมงคล:</b> <span class="text-success">${angel.luckyColor}</span></p>
                    <p class="text-white mb-1"><b>อักษรกาลกิณีห้ามใช้:</b> <span class="text-danger">${kaliAngel.alphabet}</span></p>
        </div>
        </div>
            `;

    const card3_HTML = `
    <div id="capture-card3" class="p-3 mb-2" style="background: #000; border-radius: 15px;">
        <div class="mt-4">
            <h6 class="text-gold border-bottom pb-1"><i class="fas fa-link"></i> ความสัมพันธ์ดาวในปีนี้</h6>
            <div class="row no-gutters mt-2">
                <div class="col-6 pr-1">
                    <div class="text-center p-2 rounded" style="background: rgba(0, 196, 10, 0.15); border: 1px solid #00ff40;">
                        <small class="text-success d-block"><b>ดาวคู่มิตร (หนุนดวง)</b></small>
                        <b class="text-white">${partner.name}</b>
                        <p class="x-small text-white-50 mb-0">${partner.desc}</p>
                    </div>
                </div>
                <div class="col-6 pl-1">
                    <div class="text-center p-2 rounded" style="background: rgba(253, 109, 109, 0.15); border: 1px solid #ff0000;">
                        <small class="text-danger d-block"><b>ดาวคู่ศัตรู (ควรระวัง)</b></small>
                        <b class="text-white">${enemy.name}</b>
                        <p class="x-small text-white-50 mb-0">${enemy.desc}</p>
                    </div>
                </div>
            </div>            
            <div class="row no-gutters mt-2">
            <div class="col-6 pr-1">
                    <div class="text-center p-2 rounded" style="background: rgba(0,123,255,0.15); border: 1px solid #007bff;">
                        <small class="text-primary font-weight-bold">คู่สมพล (สนับสนุน)</small><br>
                        <b class="text-white">${somphon.name}</b>
                        <p class="x-small text-white-50 mt-1 mb-0">${somphon.desc}</p>
                    </div>
            </div>
             <div class="col-6 pl-1">
                    <div class="text-center p-2 rounded" style="background: rgba(255,165,0,0.1); border: 1px solid #ffa500;">
                        <small class="text-warning font-weight-bold">คู่ธาตุปีนี้ (${elementPair.element})</small><br>
                        <b class="text-white">${elementPair.name}</b>
                        <p class="x-small text-white-50 mt-1 mb-0">${elementPair.desc}</p>
                    </div>
            </div>      
        </div>
        <p div class="mt-2 p-2 text-center rounded bg-black-50 border-gold-dashed">
                <small class="text-warning"><i class="fas fa-star"></i> <b>เคล็ดลับ:</b> 
                    ในปีนี้ควรหาโอกาสทำบุญร่วมกับคนเกิดวันเดียวกับ <b>ดาวคู่มิตร</b> เพื่อเสริมดวง
                </small>
        </div></p>
        </div>        
    `;

    const card4_HTML = `
    <div id="capture-card4" class="p-3 mb-2" style="background: #000; border-radius: 15px;">
        <div class="prediction-card p-4 rounded shadow" style="background: #1a1a1a; border-left: 5px solid gold;">
        <h4 class="text-warning">วิเคราะห์ดวงรายวัน</h4> 
        <h3 class="text-gold">วัน <b>${currentDate.getDate() !== undefined ? ` ${["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][currentDate.getDay()]}` : ''}</b> ที่ <b>${currentDate.getDate() !== undefined ? ` ${currentDate.getDate()}` : ''}</b> <b>${currentDate.getMonth() + 1 !== undefined ? ` ${["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][currentDate.getMonth()]} ` : ''}</b> พ.ศ. <b>${currentDate.getFullYear() + 543}</b></h3>
        <p class="text-white">ปัจจุบันคุณอยู่ในช่วง: <b>${result.main} เสวยอายุ</b></p>
        <div class="sub-info bg-dark p-3 rounded border border-secondary">
            <span class="text-info">ดาวแทรกขณะนี้: <b>${result.sub}</b></span>
            <div class="progress mt-2" style="height: 10px;">
                <div class="progress-bar bg-info" style="width: ${result.percent}%"></div>
            </div>
            <small class="text-muted">แทรกมาแล้ว ${result.daysInSub} วัน (จากทั้งหมด ${result.totalSubDays} วัน)</small>
        </div>

        <div class="alert alert-info">
            <h5>ปีนี้: ${currentMainData.mainName} เสวยอายุ</h5>
            <p><b>คำทำนายปีที่ ${userStatus.yearInPeriod}:</b> ${currentYearPrediction}</p>
        </div>
        <p class="mt-3 small text-white-50 italic">* คำนวณตามคัมภีร์มหาทักษาพยากรณ์ ละเอียดระดับรายวัน</p>
    </div>


    <div class="mt-3 mb-3 p-3" style="background: rgba(212,175,55,0.05); border: 1px solid #d4af37; border-radius: 10px;">
            <h6 class="text-gold"><i class="fas fa-scroll"></i> แก่นแท้ดาวแทรก (${result.sub})</h6>
            <div class="row text-center mt-2">
                <div class="col-6" style="border-right: 1px solid rgba(212,175,55,0.3);">
                    <small class="text-muted d-block">นิสัยดาว</small>
                    <b class="text-white" style="font-size: 1.1rem;">${traitInfo.icon} ${traitInfo.trait}</b>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block">จริตประจำตัวช่วงนี้</small>
                    <b class="text-warning" style="font-size: 1.1rem;">${traitInfo.jrit}</b>
                </div>
            </div>
        <div class="mt-4 p-3" style="background: rgba(255, 193, 7, 0.05); border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <h6 class="text-gold"><i class="fas fa-comment-dots"></i> คำแนะนำเฉพาะช่วงนี้</h6>
            <p class="text-white small" style="line-height: 1.6;">${adviceInfo.advice}</p>
            
            <hr style="border-top: 1px dashed rgba(212, 175, 55, 0.3);">
            
            <div class="d-flex align-center">
                <div class="mr-2 text-warning"><i class="fas fa-hand-holding-heart"></i></div>
                <div class="text-warning" style="text-align: center;"><b>เคล็ดเสริมดวง:</b> ${adviceInfo.remedy}</div>
            </div>
    </div>
    
    </div>

    


       `;

    const controls_HTML = `
            <div class="save-controls mt-4 p-3 border-top border-gold text-center">
                <h6 class="text-gold mb-3"><i class="fas fa-camera"></i> เลือกบันทึกส่วนที่ต้องการแชร์</h6>                
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-info" onclick="saveCard('capture-card1')">
                        <i class="fas fa-image"></i> บันทึก: พื้นดวง
                    </button>
                    <button class="btn btn-outline-info" onclick="saveCard('capture-card2')">
                        <i class="fas fa-users"></i> บันทึก: คู่มิตร-ศัตรู
                    </button>
                    <button class="btn btn-outline-info" onclick="saveCard('capture-card3')">
                        <i class="fas fa-bolt"></i> บันทึก: ความสัมพันธ์ดาวในปีนี้
                    </button>
                    <button class="btn btn-outline-info" onclick="saveCard('capture-card4')">
                        <i class="fas fa-bolt"></i> บันทึก: วิเคราะห์ดวงรายวัน
                    </button>
                </div>                
                <small class="text-muted d-block mt-2">ภาพจะถูกบันทึกเป็นไฟล์ .PNG ลงในเครื่อง</small>
            </div>
            
            `;


    detail.innerHTML = card1_HTML + card2_HTML + card3_HTML + card4_HTML;
    detail.innerHTML += controls_HTML;
}


// ผูก Event ทั้งหมด
document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.getElementById('birthDaySelecttaksa');
    const bDateInput = document.getElementById('birthdate');

    // ถ้าเปลี่ยนวันเกิดในทักษา (Dropdown)
    if (daySelect) {
        daySelect.addEventListener('change', () => calculateThaksa(true));
    }
    // ถ้าเปลี่ยนวันเกิดในปฏิทิน (Input Date)
    if (bDateInput) {
        bDateInput.addEventListener('change', () => calculateThaksa(false));
    }

    // รันครั้งแรกถ้ามีค่าอยู่แล้ว
    calculateThaksa();
});

window.saveCard = function (cardId) {
    const element = document.getElementById(cardId);
    if (!element) return;

    // แสดง Loading นิดนึงเผื่อเครื่องช้า
    const originalText = event.target.innerText;
    event.target.innerText = "⌛ กำลังบันทึก...";
    event.target.disabled = true;

    html2canvas(element, {
        backgroundColor: "#1a1a1a", // สีพื้นหลังภาพ
        scale: 2, // เพิ่มความชัดเป็น 2 เท่า (เหมาะสำหรับแชร์ลงโซเชียล)
        logging: false,
        useCORS: true // เผื่อมีรูปภาพจากภายนอก
    }).then(canvas => {
        // สร้างลิงก์ดาวน์โหลด
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `mu-fortune-${cardId}-${timestamp}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // คืนค่าปุ่ม
        event.target.innerText = originalText;
        event.target.disabled = false;
    }).catch(err => {
        console.error("Save image failed:", err);
        alert("ไม่สามารถบันทึกรูปภาพได้ในขณะนี้");
    });
};

// ✅ ฟังก์ชันแปลงวันเกิด
function parseBirthdate(input) {
    if (!input) return null;

    // รูปแบบ: dd/mm/yyyy หรือ yyyy-mm-dd
    if (input.includes('/')) {
        const parts = input.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            let year = parseInt(parts[2]);
            if (year > 2400) year -= 543; // แปลง BE ≈ AD
            return new Date(year, month - 1, day);
        }
    } else if (input.includes('-')) {
        return new Date(input);
    }
    return null;
}

window.calculatemahataksa = function () {
    // 1️⃣ ดึงจากฟอร์ม
    let input = document.getElementById('birthdate')?.value;

    // 2️⃣ ถ้าไม่มี → ดึงจาก localStorage
    if (!input) {
        const localData = localStorage.getItem('horo_history');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                // ✅ แก้: เข้า Array [0]
                input = parsed[0]?.birthdate || parsed[0]?.birthDate;
            } catch(e) {
                console.error('Parse error:', e);
            }
        }
    }

    // 3️⃣ Fallback → โปรไฟล์
    if (!input) {
        input = document.getElementById('profBirth')?.innerText;
    }

    // ตรวจสอบ
    const birthDate = parseBirthdate(input);
    if (!birthDate) {
        alert("🔮 กรุณากรอกวันเกิด หรือเลือกสมาชิกก่อนคำนวณมหาทักษา");
        return;
    }

    // บันทึก
    localStorage.setItem('userBirthdate', birthDate.toISOString().split('T')[0]);

    // คำนวณ + Navigate
    calculateThaksa();

    if (typeof navigateTo === "function") {
        navigateTo('mahathaksaPage');
    }
};