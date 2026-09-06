/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔮 สยามโหรามงคล (Siam Horamongkol System Engine)
 * ระบบผังการพยากรณ์ดวงชะตากำเนิด (สไตล์โหรสยามฯ) ๑๐ ขั้นตอน • ๔ ระยะ • ครบทุกจุด
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SiamHoramongkol = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // ─── ๑. ฐานข้อมูลราศี (12 Signs) ──────────────────────────────────
    const ZODIAC_SIGNS = [
        { id: 0, name: "เมษ", en: "Aries", symbol: "♈", lord: 3, lordName: "อังคาร (๓)", element: "ไฟ", type: "จรราศี", category: "ปัศวะ (สัตว์ 4 เท้า)" },
        { id: 1, name: "พฤษภ", en: "Taurus", symbol: "♉", lord: 6, lordName: "ศุกร์ (๖)", element: "ดิน", type: "สถิรราศี", category: "ปัศวะ (สัตว์ 4 เท้า)" },
        { id: 2, name: "มิถุน", en: "Gemini", symbol: "♊", lord: 4, lordName: "พุธ (๔)", element: "ลม", type: "ทวิภาวะราศี", category: "นร (มนุษย์)" },
        { id: 3, name: "กรกฎ", en: "Cancer", symbol: "♋", lord: 2, lordName: "จันทร์ (๒)", element: "น้ำ", type: "จรราศี", category: "ปู/อำพุ (สัตว์น้ำ)" },
        { id: 4, name: "สิงห์", en: "Leo", symbol: "♌", lord: 1, lordName: "อาทิตย์ (๑)", element: "ไฟ", type: "สถิรราศี", category: "ปัศวะ (สัตว์ 4 เท้า)" },
        { id: 5, name: "กันย์", en: "Virgo", symbol: "♍", lord: 4, lordName: "พุธ (๔)", element: "ดิน", type: "ทวิภาวะราศี", category: "นร (มนุษย์)" },
        { id: 6, name: "ตุลย์", en: "Libra", symbol: "♎", lord: 6, lordName: "ศุกร์ (๖)", element: "ลม", type: "จรราศี", category: "นร (มนุษย์)" },
        { id: 7, name: "พิจิก", en: "Scorpio", symbol: "♏", lord: 3, lordName: "อังคาร (๓)", element: "น้ำ", type: "สถิรราศี", category: "กีฏะ (แมลง/สัตว์มีพิษ)" },
        { id: 8, name: "ธนู", en: "Sagittarius", symbol: "♐", lord: 5, lordName: "พฤหัสบดี (๕)", element: "ไฟ", type: "ทวิภาวะราศี", category: "นร (มนุษย์ครึ่งสัตว์)" },
        { id: 9, name: "มังกร", en: "Capricorn", symbol: "♑", lord: 7, lordName: "เสาร์ (๗)", element: "ดิน", type: "จรราศี", category: "อำพุ (สัตว์น้ำ/มังกร)" },
        { id: 10, name: "กุมภ์", en: "Aquarius", symbol: "♒", lord: 8, lordName: "ราหู (๘)", element: "ลม", type: "สถิรราศี", category: "นร (มนุษย์)" },
        { id: 11, name: "มีน", en: "Pisces", symbol: "♓", lord: 5, lordName: "พฤหัสบดี (๕)", element: "น้ำ", type: "ทวิภาวะราศี", category: "อำพุ (สัตว์น้ำ)" }
    ];

    // ─── ๒. ภพทั้ง 12 ภพ ─────────────────────────────────────────────
    const HOUSES = [
        { id: 0, name: "ตนุ", meaning: "วาสนา ตัวตน รูปร่าง บุคลิก สุขภาพ วิถีชีวิตและนิสัยใจคอ", isKendra: true, isTrika: false },
        { id: 1, name: "กดุมภะ", meaning: "การเงิน ทรัพย์สิน รายได้ แหล่งที่มาของเงินทอง ความมั่งคั่ง", isKendra: false, isTrika: false },
        { id: 2, name: "สหัชชะ", meaning: "เพื่อนสนิท มิตรสหาย สังคม การเจรจา การติดต่อ การเดินทางใกล้", isKendra: false, isTrika: false },
        { id: 3, name: "พันธุ", meaning: "ครอบครัว ญาติผู้ใหญ่ บ้าน ที่ดิน รถยนต์ ความมั่นคงแห่งชีวิต", isKendra: true, isTrika: false },
        { id: 4, name: "ปุตตะ", meaning: "บุตร บริวาร สิ่งริเริ่มใหม่ ความบันเทิง โชคลาภเสี่ยงทาย ความรักใหม่", isKendra: false, isTrika: false },
        { id: 5, name: "อริ", meaning: "อุปสรรค ศัตรู ปัญหา หนี้สิน การฟันฝ่า โรคภัยประจำตัว", isKendra: false, isTrika: true },
        { id: 6, name: "ปัตนิ", meaning: "คู่ครอง คนรัก หุ้นส่วน คู่ค้า คู่สัญญา ผู้มีบทบาทตรงข้าม", isKendra: true, isTrika: false },
        { id: 7, name: "มรณะ", meaning: "ความตาย การสูญเสีย การพลัดพราก การเดินทางไกล มรดก การเปลี่ยนแปลงครั้งใหญ่", isKendra: false, isTrika: true },
        { id: 8, name: "ศุภะ", meaning: "ความเจริญก้าวหน้า ผู้ใหญ่เกื้อหนุน คุณธรรม ศาสนา การศึกษาขั้นสูง", isKendra: false, isTrika: false },
        { id: 9, name: "กัมมะ", meaning: "การงาน อาชีพ หน้าที่ ภารกิจ เกียรติยศ ชื่อเสียง ความรับผิดชอบ", isKendra: true, isTrika: false },
        { id: 10, name: "ลาภะ", meaning: "ลาภผล กำไร ความสำเร็จ มิตรภาพชั้นผู้ใหญ่ สิ่งที่ได้มาโดยง่าย", isKendra: false, isTrika: false },
        { id: 11, name: "วินาศ", meaning: "ความลับ เบื้องหลัง ความเสียหาย การพลัดพราก ศัตรูที่ไม่เปิดเผย", isKendra: false, isTrika: true }
    ];

    // ─── ๓. ข้อมูลดาวทั้ง 10 ดวง ─────────────────────────────────────
    const PLANETS = {
        1: { num: 1, thNum: "๑", name: "อาทิตย์", color: "#e74c3c", element: "ไฟ", nature: "บาปเคราะห์", role: "ยศศักดิ์ เกียรติ บารมี สติปัญญาผู้นำ", standardZodiac: 4 },
        2: { num: 2, thNum: "๒", name: "จันทร์", color: "#f1c40f", element: "ดิน", nature: "ศุภเคราะห์", role: "เสน่ห์ เมตตา อารมณ์ การบริการ แม่ สตรี", standardZodiac: 3 },
        3: { num: 3, thNum: "๓", name: "อังคาร", color: "#e91e63", element: "ลม", nature: "บาปเคราะห์", role: "ความกล้าหาญ ขยัน ลุย ช่าง กีฬา การต่อสู้", standardZodiac: 0 },
        4: { num: 4, thNum: "๔", name: "พุธ", color: "#2ecc71", element: "น้ำ", nature: "ศุภเคราะห์", role: "วาจา สื่อสาร เจรจา การค้า ไหวพริบ เอกสาร", standardZodiac: 2 },
        5: { num: 5, thNum: "๕", name: "พฤหัสบดี", color: "#e67e22", element: "ดิน", nature: "มหาศุภเคราะห์", role: "คุณธรรม ปัญญา ครูบาอาจารย์ โชคใหญ่ ผู้ใหญ่คุ้มภัย", standardZodiac: 8 },
        6: { num: 6, thNum: "๖", name: "ศุกร์", color: "#3498db", element: "น้ำ", nature: "ศุภเคราะห์", role: "การเงิน ความรัก ศิลปะ ความสุข บันเทิง เสน่หา", standardZodiac: 1 },
        7: { num: 7, thNum: "๗", name: "เสาร์", color: "#795548", element: "ไฟ", nature: "มหาบาปเคราะห์", role: "ความอดทน ทนทาน ช้า หนักแน่น เก่าแก่ อสังหาฯ", standardZodiac: 9 },
        8: { num: 8, thNum: "๘", name: "ราหู", color: "#607d8b", element: "ลม", nature: "บาปเคราะห์", role: "ความกล้าได้กล้าเสีย โลกีย์ ธุรกิจเสี่ยง เทา บันเทิง ต่างแดน", standardZodiac: 10 },
        9: { num: 9, thNum: "๙", name: "เกตุ", color: "#9c27b0", element: "วิญญาณธาตุ", nature: "วิญญาณธาตุ", role: "ลางสังหรณ์ สิ่งศักดิ์สิทธิ์ ธรรมะ ปาฏิหาริย์", standardZodiac: null },
        0: { num: 0, thNum: "๐", name: "มฤตยู", color: "#1abc9c", element: "อากาศธาตุ", nature: "ดาวปฏิวัติ", role: "การเปลี่ยนแปลงฉับพลัน นวัตกรรม ล้ำยุค อิสระ", standardZodiac: null }
    };

    // ─── ๔. ตำแหน่งมาตรฐานดวงดาว ─────────────────────────────────────
    const DIGNITIES = {
        kaset: {
            1: [4],
            2: [3],
            3: [0, 7],
            4: [2, 5],
            5: [8, 11],
            6: [1, 6],
            7: [9],
            8: [10]
        },
        uch: {
            1: 0,
            2: 1,
            3: 9,
            4: 5,
            5: 3,
            6: 11,
            7: 6,
            8: 7
        },
        rajachoke: {
            1: 2,
            2: 8,
            3: 5,
            4: 0,
            5: 9,
            6: 3,
            7: 7,
            8: 1
        },
        mahachak: {
            1: 3,
            2: 7,
            3: 8,
            4: 6,
            5: 2,
            6: 8,
            7: 4,
            8: 9
        },
        pra: {
            1: [10],
            2: [9],
            3: [1, 6],
            4: [8, 11],
            5: [2, 5],
            6: [0, 7],
            7: [3],
            8: [4]
        },
        nich: {
            1: 6,
            2: 7,
            3: 3,
            4: 11,
            5: 9,
            6: 5,
            7: 0,
            8: 1
        }
    };

    // ─── ๕. ฤกษ์ 9 หมวด ──────────────────────────────────────────────
    const NINE_NAKSHATRA_GROUPS = [
        { id: 1, name: "ทลิทโทฤกษ์", meaning: "ฤกษ์ขอทาน / ผู้อ่อนน้อมถ่อมตน เด่นด้านการขอความช่วยเหลือ ความเมตตา มีเสน่ห์คนรักใคร่" },
        { id: 2, name: "มหัทธโนฤกษ์", meaning: "ฤกษ์มหาเศรษฐี เด่นด้านการเงิน ทรัพย์สิน ความมั่งคั่ง การค้าขายและโชคลาภ" },
        { id: 3, name: "โจโรฤกษ์", meaning: "ฤกษ์ช่วงชิง / ต่อสู้ เด่นด้านความกล้าหาญ ปราบศัตรู การแข่งขัน ชิงไหวชิงพริบ" },
        { id: 4, name: "ภูมิปาโลฤกษ์", meaning: "ฤกษ์รักษาแผ่นดิน เด่นด้านความมั่นคง อสังหาริมทรัพย์ การปกครอง ราชการ ความหนักแน่น" },
        { id: 5, name: "เทศาตรีฤกษ์", meaning: "ฤกษ์ท่องเที่ยว / สังคม เด่นด้านการเดินทาง ต่างประเทศ บันเทิง ค้าขายตลาดสด คมนาคม" },
        { id: 6, name: "เทวีฤกษ์", meaning: "ฤกษ์นางพญา เด่นด้านความงาม ความรัก ศิลปะ สุภาพสตรี ผู้อุปถัมภ์ โชคทางสุนทรียภาพ" },
        { id: 7, name: "เพชฌฆาตฤกษ์", meaning: "ฤกษ์เด็ดขาด / การตัดฟัน เด่นด้านการตัดสินใจ ศัลยกรรม กฎหมาย ชัยชนะเด็ดขาด ปราบปราม" },
        { id: 8, name: "ราชาฤกษ์", meaning: "ฤกษ์กษัตริย์ / ผู้นำสูงสุด เด่นด้านอำนาจ บารมี เกียรติยศ ผู้นำ การยกย่องนับถือจากมวลชน" },
        { id: 9, name: "สมโณฤกษ์", meaning: "ฤกษ์สงบ / ปัญญาธรรม เด่นด้านศาสนา ปรัชญา ครูบาอาจารย์ ความสุขสงบทางจิตใจ ความบริสุทธิ์" }
    ];

    // ─── ๖. 27 ฤกษ์ทางโหราศาสตร์ ───────────────────────────────────
    const NAKSHATRAS_27 = [
        { id: 1, name: "อัศวินี", group: "ทลิทโทฤกษ์", lord: "เกตุ", symbol: "หัวม้า" },
        { id: 2, name: "ภรณี", group: "มหัทธโนฤกษ์", lord: "ศุกร์", symbol: "โยนี" },
        { id: 3, name: "กฤตติกา", group: "โจโรฤกษ์", lord: "อาทิตย์", symbol: "ใบมีดโกน" },
        { id: 4, name: "โรหิณี", group: "ภูมิปาโลฤกษ์", lord: "จันทร์", symbol: "เกวียน" },
        { id: 5, name: "มฤคศิร", group: "เทศาตรีฤกษ์", lord: "อังคาร", symbol: "หัวกวาง" },
        { id: 6, name: "อาร์ทรา", group: "เทวีฤกษ์", lord: "ราหู", symbol: "หยดน้ำตา/เพชร" },
        { id: 7, name: "ปุนรวสุ", group: "เพชฌฆาตฤกษ์", lord: "พฤหัสบดี", symbol: "คันธนู" },
        { id: 8, name: "ปุษยะ", group: "ราชาฤกษ์", lord: "เสาร์", symbol: "ดอกบัว/เต้านมวัว" },
        { id: 9, name: "อาศเลษา", group: "สมโณฤกษ์", lord: "พุธ", symbol: "พญานาค" },
        { id: 10, name: "มฆา", group: "ทลิทโทฤกษ์", lord: "เกตุ", symbol: "ราชบัลลังก์" },
        { id: 11, name: "ปูรวาผลคุนี", group: "มหัทธโนฤกษ์", lord: "ศุกร์", symbol: "เตียงนอน" },
        { id: 12, name: "อุตตราผลคุนี", group: "โจโรฤกษ์", lord: "อาทิตย์", symbol: "ขาเตียง" },
        { id: 13, name: "หัสตะ", group: "ภูมิปาโลฤกษ์", lord: "จันทร์", symbol: "ฝ่ามือ" },
        { id: 14, name: "จิตรา", group: "เทศาตรีฤกษ์", lord: "อังคาร", symbol: "ไข่มุก" },
        { id: 15, name: "สวาติ", group: "เทวีฤกษ์", lord: "ราหู", symbol: "ต้นกล้าอ่อน" },
        { id: 16, name: "วิศาขา", group: "เพชฌฆาตฤกษ์", lord: "พฤหัสบดี", symbol: "ซุ้มประตูชัย" },
        { id: 17, name: "อนุราธา", group: "ราชาฤกษ์", lord: "เสาร์", symbol: "แถวดอกบัว" },
        { id: 18, name: "เชษฐา", group: "สมโณฤกษ์", lord: "พุธ", symbol: "ต่างหู/ร่ม" },
        { id: 19, name: "มูละ", group: "ทลิทโทฤกษ์", lord: "เกตุ", symbol: "มัดรากไม้" },
        { id: 20, name: "ปูรวาษาฒ", group: "มหัทธโนฤกษ์", lord: "ศุกร์", symbol: "พัดงา" },
        { id: 21, name: "อุตตราษาฒ", group: "โจโรฤกษ์", lord: "อาทิตย์", symbol: "งาช้าง" },
        { id: 22, name: "ศรวณะ", group: "ภูมิปาโลฤกษ์", lord: "จันทร์", symbol: "ใบหู/รอยเท้าพระวิษณุ" },
        { id: 23, name: "ธนิษฐา", group: "เทศาตรีฤกษ์", lord: "อังคาร", symbol: "กลองมโหระทึก" },
        { id: 24, name: "ศตภิษัช", group: "เทวีฤกษ์", lord: "ราหู", symbol: "วงกลม 100 ดวงดาว" },
        { id: 25, name: "ปูรวาภัทรบท", group: "เพชฌฆาตฤกษ์", lord: "พฤหัสบดี", symbol: "คนสองหน้า" },
        { id: 26, name: "อุตตราภัทรบท", group: "ราชาฤกษ์", lord: "เสาร์", symbol: "พญานาคในน้ำลึก" },
        { id: 27, name: "เรวดี", group: "สมโณฤกษ์", lord: "พุธ", symbol: "ปลาคู่" }
    ];

    // ─── ๗. คำถามสำหรับการสอบลัคนา (Rectification Quiz) ─────────────
    const RECTIFICATION_QUESTIONS = [
        {
            id: "physique",
            question: "๑. รูปร่าง โครงสร้างสรีระร่างกาย และใบหน้าของท่านเป็นอย่างไร?",
            options: [
                { text: "โครงกระดูกใหญ่ ใบหน้าคมเข้ม กระฉับกระเฉง สายตามุ่งมั่น มีแผลหรือตำหนิที่ศีรษะ/หน้า", rasis: [0, 7] },
                { text: "ลำตัวหนา คอสั้น สมบูรณ์ ผิวพรรณนุ่มนวล ใบหน้าอิ่มเอิบ มีเสน่ห์ รสนิยมดี", rasis: [1, 6] },
                { text: "รูปร่างสูงโปร่ง คล่องแคล่ว แขนขายาว หน้าเด็กกว่าวัย แววตาวาวไหวพริบ", rasis: [2, 5] },
                { text: "รูปร่างกลมมน อกผาย ใบหน้ากลม หน้าผากกว้าง นัยน์ตาอ่อนหวาน อ่อนไหวง่าย", rasis: [3] },
                { text: "สง่างาม ผึ่งผาย ไหล่กว้าง อกแน่น ใบหน้ามีบารมีเป็นผู้นำ ผมดกหนา เสียงกังวาน", rasis: [4] },
                { text: "สูงสง่า สุภาพ เรียบร้อย หน้าตาดูมีความรู้ น่าเคารพนับถือ ผิวพรรณผ่องใส", rasis: [8, 11] },
                { text: "ผอมสูงหรือกระดูกเด่น ผิวคล้ำหรือคมเข้ม สีหน้าจริงจัง สุขุม เงียบขรึม", rasis: [9, 10] }
            ]
        },
        {
            id: "temperament",
            question: "๒. นิสัยใจคอและปฏิกิริยาต่อสถานการณ์คับขัน?",
            options: [
                { text: "ใจร้อน กล้าได้กล้าเสีย ลุยทันที ไม่ชอบการรอคอย มุ่งสู่เป้าหมายตรงไปตรงมา", rasis: [0, 4, 7] },
                { text: "ใจเย็น รอบคอบ รักสงบ ไม่ชอบการเปลี่ยนแปลงกะทันหัน อดทนสูง หวงความปลอดภัย", rasis: [1, 9] },
                { text: "ช่างพูด ช่างเจรจา ปรับตัวเก่ง มีไหวพริบ คิดเร็ว เบื่อง่ายถ้าซ้ำซาก", rasis: [2, 5, 10] },
                { text: "อ่อนโยน ขี้สงสาร เอาใจใส่คนรอบข้าง นึกถึงความรู้สึกเป็นหลัก ยึดติดครอบครัว", rasis: [3, 11] },
                { text: "มีหลักการ ยึดความถูกต้อง ใฝ่เรียนรู้ ชอบสอนและให้คำปรึกษา เป็นที่พึ่งพา", rasis: [8, 5] }
            ]
        },
        {
            id: "career_interest",
            question: "๓. งานหรือสิ่งที่ทำแล้วรู้สึกว่าเข้ากับตนเองที่สุด?",
            options: [
                { text: "งานลุย งานบริหาร สั่งการ กีฬา เครื่องจักร ทหารตำรวจ ผู้ประกอบการลุยเดี่ยว", rasis: [0, 7] },
                { text: "งานการเงิน บัญชี ธุรกิจความงาม ศิลปะ ออกแบบ อสังหาริมทรัพย์ อาหารการกิน", rasis: [1, 6] },
                { text: "งานสื่อสาร การตลาด งานเขียน เจรจา ค้าขาย นายหน้า ไอที งานที่ต้องเดินทาง", rasis: [2, 5] },
                { text: "งานบริการ การดูแล พยาบาล โรงแรม อาหาร ครอบครัว ของใช้สตรี การกุศล", rasis: [3] },
                { text: "งานระดับสูง มีเกียรติ ยศศักดิ์ หน่วยงานรัฐ ข้าราชการ เจ้าของกิจการใหญ่", rasis: [4] },
                { text: "งานวิชาการ การศึกษา แพทย์ กฎหมาย ที่ปรึกษา ศาสนา ธรรมะ ต่างประเทศ", rasis: [8, 11] },
                { text: "งานอุตสาหกรรม งานช่าง เกษตร คลังสินค้า งานเบื้องหลัง งานเทคโนโลยีซับซ้อน", rasis: [9, 10] }
            ]
        },
        {
            id: "life_event",
            question: "๔. เหตุการณ์หรือจุดเปลี่ยนในชีวิตที่ตรงกับท่านมากที่สุด?",
            options: [
                { text: "มักมีเหตุให้ต้องต่อสู้แข่งขัน มีรอยแผลเป็นตั้งแต่เด็ก หรือต้องฝ่าฟันด้วยตัวเองไม่พึ่งใคร", rasis: [0, 7] },
                { text: "ชีวิตผูกพันกับเรื่องเงินทอง ความมั่นคง มีการสะสมทรัพย์ หรือชอบสะสมของมีค่า", rasis: [1, 6] },
                { text: "ย้ายที่อยู่หรือเปลี่ยนงานบ่อย ติดต่อผู้คนหลากหลาย สังคมกว้างขวาง", rasis: [2, 10] },
                { text: "มีเรื่องกระทบกระเทือนอารมณ์จากครอบครัวหรือความรัก มักเป็นผู้เสียสละให้ผู้อื่น", rasis: [3, 11] },
                { text: "มักได้รับโอกาสขึ้นเป็นหัวหน้า มีผู้ใหญ่คอยมอง หรือชีวิตต้องมีชื่อเสียงเกียรติยศ", rasis: [4, 8] },
                { text: "ชีวิตเริ่มต้นจากความยากลำบาก ต้องอดทนเหน็ดเหนื่อยมากกว่าคนอื่นจึงจะสำเร็จ", rasis: [9] }
            ]
        }
    ];

    // ─── ๘. ฟังก์ชันคำนวณตำแหน่งดาวและลัคนาทางดาราศาสตร์โหรไทย ───────
    function toJD(y, m, d, h) {
        const A = Math.floor((14 - m) / 12);
        const Y = y + 4800 - A;
        const M = m + 12 * A - 3;
        let jdn = d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) -
            Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
        return jdn - 0.5 + h / 24.0;
    }

    function getLahiriAyanamsha(jd) {
        const T = (jd - 2451545.0) / 36525;
        return 23.853056 + (50.290966 / 3600) * (T * 100);
    }

    function calcAscendant(jd, lat, lng) {
        const T = (jd - 2451545.0) / 36525;
        let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
            0.000387933 * T * T - (T * T * T) / 38710000;
        gmst = ((gmst % 360) + 360) % 360;
        const lst = ((gmst + lng) % 360 + 360) % 360;

        const eps = (23.4392911 - (46.8150 * T) / 3600) * Math.PI / 180;
        const phi = lat * Math.PI / 180;
        const theta = lst * Math.PI / 180;

        const y = Math.cos(theta);
        const x = -Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
        let asc = Math.atan2(y, x) * 180 / Math.PI;
        asc = ((asc % 360) + 360) % 360;

        const ayanamsha = getLahiriAyanamsha(jd);
        let siderealAsc = ((asc - ayanamsha) % 360 + 360) % 360;
        const sign = Math.floor(siderealAsc / 30);
        const deg = siderealAsc % 30;

        return {
            totalDeg: siderealAsc,
            sign: sign,
            signName: ZODIAC_SIGNS[sign].name,
            deg: Math.floor(deg),
            min: Math.floor((deg % 1) * 60),
            sec: Math.floor((((deg % 1) * 60) % 1) * 60),
            element: ZODIAC_SIGNS[sign].element,
            category: ZODIAC_SIGNS[sign].category,
            lord: ZODIAC_SIGNS[sign].lord
        };
    }

    function calcPlanetsPositions(jd) {
        const T = (jd - 2451545.0) / 36525;
        const ayanamsha = getLahiriAyanamsha(jd);

        function siderealPos(meanLong, rate) {
            let trop = meanLong + rate * T;
            let sid = ((trop - ayanamsha) % 360 + 360) % 360;
            let s = Math.floor(sid / 30);
            let d = sid % 30;
            return {
                totalDeg: sid,
                sign: s,
                signName: ZODIAC_SIGNS[s].name,
                deg: Math.floor(d),
                min: Math.floor((d % 1) * 60)
            };
        }

        const sun = siderealPos(280.46646, 36000.76983);
        const moon = siderealPos(218.3165, 481267.8813);
        const mars = siderealPos(355.433, 19140.2993);
        const mer = siderealPos((sun.totalDeg + 18.5) % 360, 0);
        const jup = siderealPos(34.351, 3034.9057);
        const ven = siderealPos((sun.totalDeg + 27.2) % 360, 0);
        const sat = siderealPos(50.077, 1222.1138);
        const rahu = siderealPos(125.0445 - 1934.1363 * T, 0);
        const ketu = {
            totalDeg: (rahu.totalDeg + 180) % 360,
            sign: Math.floor(((rahu.totalDeg + 180) % 360) / 30),
            signName: ZODIAC_SIGNS[Math.floor(((rahu.totalDeg + 180) % 360) / 30)].name,
            deg: Math.floor(((rahu.totalDeg + 180) % 360) % 30),
            min: rahu.min
        };
        const ura = siderealPos(314.055, 428.4669);

        return {
            1: { ...PLANETS[1], ...sun },
            2: { ...PLANETS[2], ...moon },
            3: { ...PLANETS[3], ...mars },
            4: { ...PLANETS[4], ...mer },
            5: { ...PLANETS[5], ...jup },
            6: { ...PLANETS[6], ...ven },
            7: { ...PLANETS[7], ...sat },
            8: { ...PLANETS[8], ...rahu },
            9: { ...PLANETS[9], ...ketu },
            0: { ...PLANETS[0], ...ura }
        };
    }

    // ─── ๙. คำนวณตนุเศษ (Tanuset) ──────────────────────────────────
    function calcTanuset(ascSign, planets) {
        const ascLord = ZODIAC_SIGNS[ascSign].lord;
        const lordPlanet = planets[ascLord];
        const lordSign = lordPlanet ? lordPlanet.sign : ascSign;
        
        const countAscToLord = ((lordSign - ascSign + 12) % 12) + 1;
        const tanusetNum = ((countAscToLord * 7) % 8) || 1;
        const tanusetSign = planets[tanusetNum] ? planets[tanusetNum].sign : lordSign;

        return {
            planetNum: tanusetNum,
            planetName: PLANETS[tanusetNum] ? PLANETS[tanusetNum].name : "อาทิตย์",
            sign: tanusetSign,
            signName: ZODIAC_SIGNS[tanusetSign].name,
            meaning: "ตนุเศษบ่งบอกถึงจิตเบื้องลึก อุปนิสัยแท้จริง ความปรารถนา ความรู้สึกภายในใจที่ซ่อนอยู่หลังหน้ากากภายนอก"
        };
    }

    // ─── ๑๐. คำนวณฤกษ์เกิด นวางศ์ ตรียางศ์ ────────────────────────────
    function calcBirthNakshatra(moonTotalDeg) {
        const nakshatraIndex = Math.floor(moonTotalDeg / (360 / 27));
        const nakshatra = NAKSHATRAS_27[nakshatraIndex % 27];
        const groupIndex = nakshatraIndex % 9;
        const group = NINE_NAKSHATRA_GROUPS[groupIndex];

        const signDeg = moonTotalDeg % 30;
        const triyangIndex = Math.floor(signDeg / 10);
        const nawangIndex = Math.floor(signDeg / (30 / 9));

        return {
            nakshatraNumber: nakshatra.id,
            nakshatraName: nakshatra.name,
            symbol: nakshatra.symbol,
            rulingPlanet: nakshatra.lord,
            groupName: group.name,
            groupMeaning: group.meaning,
            triyangNumber: triyangIndex + 1,
            nawangNumber: nawangIndex + 1
        };
    }

    // ─── ๑๑. ประเมินศักยภาพดาวทั้ง ๑๐ ดวงตาม Decision Tree แบบละเอียดลึกซึ้ง ─────
    const PLANET_REMEDIES = {
        1: { color: "สีแดง, สีส้มแสด", worship: "ทำบุญเติมน้ำมันตะเกียง ถวายหลอดไฟ บูชาพระแก้วมรกต หรือบริจาคโลหิต", gem: "ทับทิม (Ruby)", advice: "รักษาความสัตย์ตรง มีเมตตาต่อผู้ใต้บังคับบัญชา ไม่ใช้อารมณ์ตัดสินปัญหา" },
        2: { color: "สีขาวนวล, สีเหลืองอ่อน, สีครีม", worship: "ทำบุญปล่อยปลา บริจาคน้ำดื่ม ช่วยเหลือแม่และเด็ก หรือสตรีผู้ยากไร้", gem: "มุกดาหาร (Moonstone) หรือไข่มุก", advice: "ฝึกควบคุมอารมณ์ให้หนักแน่น ไม่หวั่นไหวต่อคำพูดคนรอบข้าง" },
        3: { color: "สีชมพู, สีกลีบบัว", worship: "บริจาคเครื่องมือแพทย์ ช่วยเหลือโรงพยาบาลทหารผ่านศึก บริจาคโลหิต", gem: "โกเมนเอก หรือปะการังแดง", advice: "ใช้ความกล้าหาญในทางสร้างสรรค์ มีสติยับยั้งชั่งใจ ระวังความใจร้อนมุทะลุ" },
        4: { color: "สีเขียวใบไม้, สีเขียวมรกต", worship: "ทำบุญพิมพ์หนังสือธรรมะ บริจาคอุปกรณ์การศึกษา ช่วยเหลือคนพิการทางการพูด/ได้ยิน", gem: "มรกต (Emerald)", advice: "รักษาสัจจะวาจา ไม่นินทาให้ร้ายผู้อื่น ใช้คำพูดสร้างแรงบันดาลใจ" },
        5: { color: "สีส้ม, สีทอง, สีเหลืองเข้ม", worship: "ทำบุญค่ายาพระภิกษุสงฆ์ ถวายหนังสือเรียน ถวายผ้าไตรจีวร ไหว้พระพุทธรูปปางสมาธิ", gem: "บุษราคัม (Yellow Sapphire)", advice: "รักษาศีล ๕ สม่ำเสมอ กตัญญูต่อบิดามารดาและครูบาอาจารย์ หมั่นศึกษาหาความรู้" },
        6: { color: "สีฟ้า, สีน้ำเงินคราม", worship: "ทำบุญถวายดอกไม้หอม ของสวยงาม ช่วยเหลือเด็กกำพร้า ส่งเสริมศิลปวัฒนธรรม", gem: "ไพลิน (Blue Sapphire) หรือเพชร", advice: "รักษาสมดุลทางการเงิน ไม่ลุ่มหลงในกิเลสและของฟุ่มเฟือย ซื่อสัตย์ต่อคนรัก" },
        7: { color: "สีม่วงเข้ม, สีดำ, สีเทาดำ", worship: "ทำบุญสร้างโบสถ์วิหาร สร้างสะพาน ถวายกระเบื้องมุงหลังคา ปล่อยนกปล่อยปลาวันเสาร์", gem: "นิลกาฬ หรืออเมทิสต์ (Amethyst)", advice: "ฝึกความอดทน มองโลกในแง่ดี ไม่เก็บความทุกข์ไว้ในใจ มีวินัยในการทำงาน" },
        8: { color: "สีบรอนซ์เงิน, สีกรมท่า, สีควันบุหรี่", worship: "ทำบุญช่วยผู้ป่วยติดยาเสพติด เลิกเหล้า/การพนัน ไหว้พระราหูด้วยของดำ ๘ อย่าง", gem: "ไพฑูรย์ (Cat's Eye)", advice: "มีสติสัมปชัญญะ ไม่หลงใหลในอบายมุขและการเก็งกำไรที่เสี่ยงเกินตัว" },
        9: { color: "สีทอง, สีรุ้งหลากสี, สีขาวบริสุทธิ์", worship: "ปฏิบัติวิปัสสนากรรมฐาน ไหว้พระประธานศักดิ์สิทธิ์ สวดมนต์พระปริตร", gem: "หินเขี้ยวหนุมาน (Quartz) หรือเพชรตาแมว", advice: "เชื่อมั่นในลางสังหรณ์ที่มีศีลธรรมกำกับ ประพฤติตนอยู่ในกรอบความดีงาม" },
        0: { color: "สีเขียวหัวเป็ด, สีทองคำขาว", worship: "ทำบุญบริจาคโรงพยาบาลโรคเรื้อรัง บริจาคโลงศพ บริจาคอวัยวะ ช่วยงานวิจัยวิทยาศาสตร์", gem: "หินอุกกาบาต (Meteorite) หรือเทกไทต์", advice: "เปิดรับการเปลี่ยนแปลง เรียนรู้นวัตกรรมใหม่ๆ ปล่อยวางเรื่องเก่าที่ไม่เป็นประโยชน์" }
    };

    // ─── ฟังก์ชันสร้างคำพยากรณ์สถานะพลังดาวเชิงลึกระดับคัมภีร์โหราศาสตร์ไทย ────────
    function generateMasterPlanetaryInterpretation(p, signData, house, dignity, powerLevel, score, grade, elementSynergy) {
        let masterStatus = "";
        if (dignity.includes("เกษตร")) {
            masterStatus = `เป็นเจ้าบ้านผู้ทรงบารมี มั่นคง สมบูรณ์ มีอำนาจปกครองและเป็นหลักชัยค้ำจุนดวงชะตา`;
        } else if (dignity.includes("อุจจ์")) {
            masterStatus = `วาสนาบารมีสูงส่ง โดดเด่นเหนือบุคคลทั่วไป เกียรติยศชื่อเสียงปรากฏขจรขจาย เป็นที่เคารพนับถือ`;
        } else if (dignity.includes("ราชาโชค")) {
            masterStatus = `มิตรสหายและผู้ใหญ่อุปถัมภ์ค้ำชู ได้สิ่งใดมาอย่างง่ายดาย มีเสน่ห์ทางสังคมสูง ไร้อุปสรรคขัดขวาง`;
        } else if (dignity.includes("มหาจักร")) {
            masterStatus = `วาสนานักสู้ผู้ยิ่งใหญ่ ต้องบุกเบิกฝ่าฟันด้วยลำแข้งตนเอง ลำบากก่อนสบายทีหลัง แล้วจะรุ่งโรจน์เกรียงไกร`;
        } else if (dignity.includes("ประเกษตร")) {
            masterStatus = `ขาดความมั่นคงในตนเอง ต้องพึ่งพาผู้อื่นหรือทำงานเป็นทีม ผลประโยชน์มักรั่วไหล ต้องรอบคอบในการเก็บรักษา`;
        } else if (dignity.includes("นิจ")) {
            masterStatus = `กำลังถดถอย อ่อนแอ หรือขาดโอกาสหนุนนำ ต้องใช้ความพยายามและความเพียรเป็นสองเท่าจึงจะสัมฤทธิผล`;
        } else if (dignity.includes("ทุสถานภพ")) {
            masterStatus = `สถิตภพเสีย (${house.name}) ส่งผลให้เกิดความเหน็ดเหนื่อย ปัญหาเฉพาะหน้า หรือความสูญเสีย ต้องใช้สติปัญญาและธรรมะแก้ไข`;
        } else {
            masterStatus = `ทำหน้าที่ส่งผลตามภพ${house.name} อย่างเป็นธรรมชาติ สามารถตรวจเกณฑ์พิเศษ โยค ตรีโกณ และคู่สมพลเพื่อเพิ่มพูนพลัง`;
        }

        const deepAnalysis = `✦ [ศักยภาพและสถานะพลัง]: ดาว${p.name} (${p.thNum}) สถิตราศี${signData.name} ธาตุ${signData.element} ครองภพ${house.name} ได้รับการประเมินมาตรฐาน "${dignity}" ระดับพลัง "${powerLevel}" (เกรด ${grade} • คะแนน ${score}/100) ${masterStatus}\n` +
            `✦ [ผลกระทบต่อวิถีชีวิต]: ดาว${p.name}เป็นตัวแทนของ ${p.role} เมื่อสถิตในภพ${house.name} (${house.meaning}) จึงส่งผลให้ชะตาชีวิตของท่านผูกพันกับเรื่องนี้อย่างมีนัยสำคัญ ขับเคลื่อนด้วยพลังแห่ง${signData.element}\n` +
            `✦ [ความสัมพันธ์ธาตุ]: ${elementSynergy}`;

        return { masterStatus, deepAnalysis };
    }

    function evaluatePlanetsDignity(ascSign, planets) {
        const results = {};

        for (let pNum in planets) {
            const num = parseInt(pNum);
            const p = planets[num];
            const sign = p.sign;
            const houseIndex = ((sign - ascSign + 12) % 12);
            const house = HOUSES[houseIndex];
            const signData = ZODIAC_SIGNS[sign];

            let dignity = "ปกติ";
            let powerLevel = "ปานกลาง";
            let statusDesc = "ตรวจเกณฑ์พิเศษ";
            let badgeClass = "badge-secondary";
            let score = 60;
            let grade = "B";

            // Decision Steps Trace (บันทึกเส้นทางการตัดสินใจ ๔ ขั้นตอนอย่างละเอียด)
            const decisionSteps = [
                { step: 1, name: "เกษตร / อุจจ์ / ราชาโชค", passed: false, reason: "" },
                { step: 2, name: "ประ / นิจ / มหาจักร", passed: false, reason: "" },
                { step: 3, name: "ทุสถานภพ (อริ/มรณะ/วินาศ)", passed: false, reason: "" },
                { step: 4, name: "ดาวปกติ (ตรวจเกณฑ์พิเศษ)", passed: false, reason: "" }
            ];

            // ๑. ตรวจสอบ เกษตร / อุจจ์ / ราชาโชค
            if (DIGNITIES.kaset[num] && DIGNITIES.kaset[num].includes(sign)) {
                dignity = "เกษตรบดี (เกษตร)";
                powerLevel = "มั่นคงเข้มแข็งสูงสุด";
                statusDesc = "เป็นเจ้าบ้านที่ทรงพลัง มั่นคง สมบูรณ์ มีอำนาจปกครองและเป็นหลักชัยให้ดวงชะตา";
                badgeClass = "badge-success";
                score = 96;
                grade = "S";
                decisionSteps[0].passed = true;
                decisionSteps[0].reason = `สถิตราศี${signData.name} ซึ่งเป็นเรือนเกษตรของตนเอง จึงได้มาตรฐานสูงสุด`;
            } else if (DIGNITIES.uch[num] === sign) {
                dignity = "มหาอุจจ์ (อุจจ์)";
                powerLevel = "สูงส่งทรงพลังบารมี";
                statusDesc = "มีวาสนาสูงส่ง โดดเด่น เกียรติยศชื่อเสียงปรากฏขจรขจาย เป็นที่ยกย่องนับถือ";
                badgeClass = "badge-warning";
                score = 100;
                grade = "S+";
                decisionSteps[0].passed = true;
                decisionSteps[0].reason = `สถิตราศี${signData.name} ซึ่งเป็นตำแหน่งมหาอุจจ์ ให้พลังสูงสุดยอดเยี่ยม`;
            } else if (DIGNITIES.rajachoke[num] === sign) {
                dignity = "ราชาโชค";
                powerLevel = "ราบรื่นมีเสน่ห์โชคลาภ";
                statusDesc = "มิตรสหายและผู้ใหญ่อุปถัมภ์ ได้สิ่งใดมาอย่างง่ายดาย มีเสน่ห์ทางสังคมสูงยิ่ง";
                badgeClass = "badge-primary";
                score = 90;
                grade = "A+";
                decisionSteps[0].passed = true;
                decisionSteps[0].reason = `สถิตราศี${signData.name} ซึ่งเป็นตำแหน่งราชาโชค นำพาความราบรื่นไร้อุปสรรค`;
            } else {
                decisionSteps[0].reason = `ไม่ได้สถิตในราศีเกษตร อุจจ์ หรือราชาโชค ➔ ส่งต่อไปยังขั้นตอนที่ ๒`;
            }

            // ๒. ตรวจสอบ ประ / นิจ / มหาจักร (ถ้าไม่ผ่านขั้นที่ ๑)
            if (!decisionSteps[0].passed) {
                if (DIGNITIES.mahachak[num] === sign) {
                    dignity = "มหาจักร";
                    powerLevel = "ฝ่าฟันผาดโผนเกรียงไกร";
                    statusDesc = "วาสนาบุกเบิก ต้องต่อสู้ฟันฝ่าด้วยลำแข้งตนเอง แล้วจะประสบความสำเร็จยิ่งใหญ่อย่างน่าอัศจรรย์";
                    badgeClass = "badge-info";
                    score = 85;
                    grade = "A";
                    decisionSteps[1].passed = true;
                    decisionSteps[1].reason = `สถิตราศี${signData.name} เป็นมหาจักร บ่งบอกถึงการฟันฝ่าอุปสรรคแล้วรุ่งโรจน์`;
                } else if (DIGNITIES.pra[num] && DIGNITIES.pra[num].includes(sign)) {
                    dignity = "ประเกษตร";
                    powerLevel = "ไม่มั่นคง รั่วไหล";
                    statusDesc = "ขาดความมั่นคงในตนเอง ต้องพึ่งพาผู้อื่น ผลประโยชน์มักรั่วไหลหรือกระจายไปสู่คนรอบข้าง";
                    badgeClass = "badge-danger";
                    score = 35;
                    grade = "D+";
                    decisionSteps[1].passed = true;
                    decisionSteps[1].reason = `สถิตราศีตรงข้ามเกษตร (${signData.name}) เป็นประเกษตร ขาดกำลังความเป็นตัวของตัวเอง`;
                } else if (DIGNITIES.nich[num] === sign) {
                    dignity = "นิจ (ต่ำต้อย)";
                    powerLevel = "อ่อนกำลัง ต้องฟูมฟัก";
                    statusDesc = "กำลังถดถอย อ่อนแอ หรือขาดโอกาส ต้องใช้ความพยายามและความเพียรเป็นสองเท่าจึงจะสำเร็จ";
                    badgeClass = "badge-danger";
                    score = 25;
                    grade = "D";
                    decisionSteps[1].passed = true;
                    decisionSteps[1].reason = `สถิตราศีตรงข้ามมหาอุจจ์ (${signData.name}) เป็นนิจ กำลังดวงดาวอ่อนแรง`;
                } else {
                    decisionSteps[1].reason = `ไม่ได้เป็นประ นิจ หรือมหาจักร ➔ ส่งต่อไปยังขั้นตอนที่ ๓`;
                }
            }

            // ๓. ตรวจสอบ ทุสถานภพ (ถ้าไม่ผ่านขั้นที่ ๑ และ ๒)
            if (!decisionSteps[0].passed && !decisionSteps[1].passed) {
                if (house.isTrika) {
                    dignity = `ตกทุสถานภพ (${house.name})`;
                    powerLevel = "ติดขัด มีอุปสรรค";
                    statusDesc = `สถิตภพเสีย (${house.name}) ส่งผลให้เกิดความเหน็ดเหนื่อย ปัญหาเฉพาะหน้า หรือความสูญเสีย ต้องใช้สติปัญญาแก้ไข`;
                    badgeClass = "badge-dark";
                    score = 42;
                    grade = "C-";
                    decisionSteps[2].passed = true;
                    decisionSteps[2].reason = `สถิตในภพ ${house.name} ซึ่งเป็น ๑ ใน ๓ ทุสถานภพ (อริ/มรณะ/วินาศ)`;
                } else {
                    decisionSteps[2].reason = `ไม่ตกทุสถานภพ (สถิตในภพศุภสถาน ${house.name}) ➔ ส่งต่อไปยังขั้นตอนที่ ๔`;
                }
            }

            // ๔. ตรวจสอบ ดาวปกติ (ถ้าผ่าน ๑-๓ ทั้งหมดเป็น False)
            if (!decisionSteps[0].passed && !decisionSteps[1].passed && !decisionSteps[2].passed) {
                dignity = "ดาวปกติ (ตามภพศุภสถาน)";
                powerLevel = "ปานกลาง สมดุล";
                statusDesc = `ทำหน้าที่ส่งผลตามภพ${house.name} อย่างเป็นธรรมชาติ สามารถตรวจเกณฑ์พิเศษ โยค ตรีโกณ และคู่สมพลเพื่อเพิ่มพลัง`;
                badgeClass = "badge-secondary";
                score = 65;
                grade = "B+";
                decisionSteps[3].passed = true;
                decisionSteps[3].reason = `เป็นดาวปกติที่สถิตในภพ${house.name} ส่งเสริมเรื่อง${house.meaning.split(' ')[0]}`;
            }

            // ความสัมพันธ์ของธาตุดาว กับ ธาตุราศี (Elemental Synergy)
            let elementSynergy = "";
            let elementBonus = 0;
            if (p.element === signData.element) {
                elementSynergy = `ธาตุเดียวกัน (${p.element} สถิตราศี${signData.element}) ➔ เสริมพลังธาตุเข้มแข็งเต็มร้อย`;
                elementBonus = 5;
            } else if ((p.element === "ไฟ" && signData.element === "ลม") || (p.element === "ลม" && signData.element === "ไฟ")) {
                elementSynergy = `ธาตุเกื้อหนุน (ไฟ-ลม) ➔ จุดประกายพลังขับเคลื่อนรวดเร็ว`;
                elementBonus = 4;
            } else if ((p.element === "ดิน" && signData.element === "น้ำ") || (p.element === "น้ำ" && signData.element === "ดิน")) {
                elementSynergy = `ธาตุเกื้อกูล (ดิน-น้ำ) ➔ ชุ่มชื้น อุดมสมบูรณ์ มั่นคง`;
                elementBonus = 4;
            } else if ((p.element === "ไฟ" && signData.element === "น้ำ") || (p.element === "น้ำ" && signData.element === "ไฟ")) {
                elementSynergy = `ธาตุขัดแย้ง (ไฟ-น้ำ) ➔ ต้องระวังอารมณ์ร้อนเย็นไม่แน่นอน`;
                elementBonus = -3;
            } else {
                elementSynergy = `ธาตุผสมผสาน (${p.element} ในราศี${signData.element}) ➔ ส่งพลังปานกลาง`;
            }

            const finalScore = Math.min(100, Math.max(10, score + elementBonus));
            const remedy = PLANET_REMEDIES[num] || { color: "สีทอง", worship: "ทำบุญสวดมนต์รักษาศีล", gem: "อัญมณีมงคล", advice: "ดำเนินชีวิตด้วยสติ" };

            // คำพยากรณ์เจาะลึกเฉพาะดาวดวงนี้ระดับคัมภีร์โหราศาสตร์ไทย
            const interp = generateMasterPlanetaryInterpretation(p, signData, house, dignity, powerLevel, finalScore, grade, elementSynergy);
            const statusDescFinal = interp.masterStatus;
            const detailedAnalysis = interp.deepAnalysis;

            results[num] = {
                ...p,
                houseIndex: houseIndex,
                houseName: house.name,
                houseMeaning: house.meaning,
                signName: signData.name,
                signElement: signData.element,
                signCategory: signData.category,
                dignity: dignity,
                powerLevel: powerLevel,
                statusDesc: statusDescFinal,
                badgeClass: badgeClass,
                score: finalScore,
                grade: grade,
                decisionSteps: decisionSteps,
                elementSynergy: elementSynergy,
                detailedAnalysis: detailedAnalysis,
                remedy: remedy
            };
        }

        return results;
    }

    // ─── ๑๒. ความสัมพันธ์ ลัคนา + ดาว (Aspects & Special Aspects) ─────
    function evaluateAscendantAspects(ascSign, planets) {
        const aspects = [];

        for (let pNum in planets) {
            const num = parseInt(pNum);
            const p = planets[num];
            const diff = ((p.sign - ascSign + 12) % 12);
            const houseNum = diff + 1;

            let aspectType = null;
            let desc = "";

            if (diff === 0) {
                aspectType = "กุมลัคนา (๑st House)";
                desc = `ดาว${p.name} (${p.thNum}) กุมลัคนาร่วมราศี มีอิทธิพลต่อบุคลิกภาพ รูปร่าง และจิตวิญญาณโดยตรง`;
            } else if (diff === 6) {
                aspectType = "เล็งลัคนา (๗th House)";
                desc = `ดาว${p.name} (${p.thNum}) เล็งลัคนาในภพปัตนิ ส่งกระแสตรงถึงตัวตนและเรื่องคู่ครองหุ้นส่วน`;
            } else if (diff === 4 || diff === 8) {
                aspectType = "ตรีโกณถึงลัคนา (๕th/๙th House)";
                desc = `ดาว${p.name} (${p.thNum}) ทำมุมตรีโกณ ๑๒๐° ส่งพลังเกื้อหนุนอย่างกลมกลืนและเป็นมงคล`;
            } else if (diff === 2 || diff === 10) {
                aspectType = "โยคหน้า / โยคหลัง (๓rd/๑๑th House)";
                desc = `ดาว${p.name} (${p.thNum}) ทำมุมโยค ๖๐° ส่งผลส่งเสริมด้านความช่วยเหลือ โอกาส และมิตรสหาย`;
            } else if (diff === 3 || diff === 9) {
                aspectType = "ฉาก / จตุโกณ (๔th/๑๐th House)";
                desc = `ดาว${p.name} (${p.thNum}) ทำมุมฉาก ๙๐° ก่อให้เกิดแรงผลักดัน ความท้าทาย และการปรับเปลี่ยน`;
            }

            const specialAspects = [];
            if (num === 3) {
                const targetH4 = (p.sign + 3) % 12;
                const targetH8 = (p.sign + 7) % 12;
                if (targetH4 === ascSign) specialAspects.push("อังคารส่งแรงเอื้อมพิเศษเกณฑ์ ๔ ถึงลัคนา (แรงกระตุ้นรวดเร็ว)");
                if (targetH8 === ascSign) specialAspects.push("อังคารส่งแรงเอื้อมพิเศษเกณฑ์ ๘ ถึงลัคนา (การปกป้องคุ้มภัย/ความเด็ดขาด)");
            }
            if (num === 5) {
                const targetH5 = (p.sign + 4) % 12;
                const targetH9 = (p.sign + 8) % 12;
                if (targetH5 === ascSign || targetH9 === ascSign) {
                    specialAspects.push("พฤหัสบดีส่งแรงเอื้อมพิเศษเกณฑ์ ๕, ๙ ส่องแสงคุณธรรมคุ้มครองลัคนาเต็มกำลัง");
                }
            }
            if (num === 7) {
                const targetH3 = (p.sign + 2) % 12;
                const targetH10 = (p.sign + 9) % 12;
                if (targetH3 === ascSign) specialAspects.push("เสาร์ส่งแรงเอื้อมพิเศษเกณฑ์ ๓ ถึงลัคนา (ความอดทนไม่ย่อท้อ)");
                if (targetH10 === ascSign) specialAspects.push("เสาร์ส่งแรงเอื้อมพิเศษเกณฑ์ ๑๐ ถึงลัคนา (ความรับผิดชอบและภาระสร้างตัว)");
            }

            aspects.push({
                planetNum: num,
                planetName: p.name,
                signName: p.signName,
                houseNumber: houseNum,
                aspectType: aspectType,
                description: desc,
                specialAspects: specialAspects
            });
        }

        return aspects;
    }

    // ─── ๑๓. ความสัมพันธ์ ดาว + ดาว (45 คู่ดาว & 5 มุมสัมพันธ์) ────────
    function evaluatePlanetInteractions(planets) {
        const pairs = [];
        const planetKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const PAIR_DATABASE = {
            "1-5": { type: "คู่มิตรใหญ่", desc: "อาทิตย์-พฤหัส: สติปัญญาเลิศ ผู้ใหญ่เมตตา ยศศักดิ์สูงส่ง มีศีลธรรม" },
            "2-4": { type: "คู่มิตรเสน่หา", desc: "จันทร์-พุธ: วาจาไพเราะ เจรจาค้าขายดีเลิศ เสน่ห์เมตตามหานิยม คนรักใคร่" },
            "3-6": { type: "คู่มิตรสมหวัง", desc: "อังคาร-ศุกร์: เสน่ห์เย้ายวน ความรักเร่าร้อน โชคลาภด้านความสุข เงินทองคล่องตัว" },
            "7-8": { type: "คู่มิตรนักเลง", desc: "เสาร์-ราหู: ใจถึงพึ่งได้ กล้าได้กล้าเสีย บารมีคุ้มครองบริวาร ธุรกิจกว้างขวาง" },
            "1-3": { type: "คู่ศัตรู/อุบัติเหตุ", desc: "อาทิตย์-อังคาร: ใจร้อน มุทะลุ ระวังการขัดแย้ง แตกหัก และอุบัติเหตุของมีคม" },
            "2-5": { type: "คู่ศัตรู/ขัดแย้งศีลธรรม", desc: "จันทร์-พฤหัส: ความคิดเห็นไม่ตรงกับผู้ใหญ่ ระวังเรื่องศีลธรรมกับอารมณ์" },
            "4-7": { type: "คู่ศัตรูทางวาจา", desc: "พุธ-เสาร์: วาจาเชือดเฉือน พูดตรงเกินไป ระวังเอกสารสัญญาคลาดเคลื่อน" },
            "6-8": { type: "คู่ศัตรูมัวเมา", desc: "ศุกร์-ราหู: หลงระเริงกิเลส ระวังการเงินรั่วไหลจากอบายมุขหรือการลงทุนเสี่ยงเกินตัว" },
            "1-6": { type: "คู่สมพล", desc: "อาทิตย์-ศุกร์: มีเกียรติยศชื่อเสียง เงินทองไหลมาเทมา มีรสนิยมและความสุข" },
            "2-8": { type: "คู่สมพล", desc: "จันทร์-ราหู: เสน่ห์ล้นเหลือ การค้าต่างแดน โชคลาภจากการเก็งกำไร" },
            "3-5": { type: "คู่สมพล", desc: "อังคาร-พฤหัส: ปัญญาคู่พลัง ลุยงานฉลาด ขยันรอบคอบ ประสบความสำเร็จสูง" },
            "4-7": { type: "คู่สมพล", desc: "พุธ-เสาร์: ความจำแม่นยำ เชี่ยวชาญเฉพาะทาง วิจัยค้นคว้าลึกซึ้ง" },
            "1-7": { type: "คู่ธาตุไฟ", desc: "อาทิตย์-เสาร์: ร้อนแรง มุ่งมั่นเด็ดเดี่ยว เป็นผู้นำที่อดทนแกร่งกล้า" },
            "2-5": { type: "คู่ธาตุดิน", desc: "จันทร์-พฤหัส: อบอุ่น หนักแน่น ปลอดภัย มั่นคงในทรัพย์สินและที่อยู่อาศัย" },
            "3-8": { type: "คู่ธาตุลม", desc: "อังคาร-ราหู: รวดเร็ว ทันใจ กล้าเสี่ยง ชอบความท้าทายและการปฏิวัติสิ่งใหม่" },
            "4-6": { type: "คู่ธาตุน้ำ", desc: "พุธ-ศุกร์: ปากหวาน เจรจามีเสน่ห์ ศิลปะการแสดง การเงินหมุนเวียนยอดเยี่ยม" }
        };

        for (let i = 0; i < planetKeys.length; i++) {
            for (let j = i + 1; j < planetKeys.length; j++) {
                const p1 = planets[planetKeys[i]];
                const p2 = planets[planetKeys[j]];
                if (!p1 || !p2) continue;

                const diff = Math.abs(p1.sign - p2.sign);
                const step = Math.min(diff, 12 - diff);
                let aspect = "สัมพันธ์ห่าง";

                if (step === 0) aspect = "กุมร่วมราศี (Conjunction)";
                else if (step === 6) aspect = "เล็งตรงข้าม (Opposition)";
                else if (step === 4) aspect = "ตรีโกณ (Trine 120°)";
                else if (step === 2) aspect = "โยคสัมพันธ์ (Sextile 60°)";
                else if (step === 3) aspect = "ฉาก (Square 90°)";

                const key1 = `${p1.num}-${p2.num}`;
                const key2 = `${p2.num}-${p1.num}`;
                const pairData = PAIR_DATABASE[key1] || PAIR_DATABASE[key2];

                if (pairData || step <= 4) {
                    pairs.push({
                        pairName: `${p1.name} (${p1.thNum}) + ${p2.name} (${p2.thNum})`,
                        p1Num: p1.num,
                        p2Num: p2.num,
                        aspect: aspect,
                        pairType: pairData ? pairData.type : "คู่ดาวผสมผสาน",
                        desc: pairData ? pairData.desc : `ดาวทั้งสองทำมุม ${aspect} ส่งผลหนุนนำทางอุปนิสัยและจังหวะชีวิต`
                    });
                }
            }
        }

        return pairs;
    }

    // ─── ๑๔. สูตรผสมภพ ๑๔๔ รูปแบบ (House Lord Placements) ───────────
    function evaluate144HouseCombinations(ascSign, planets) {
        const combinations = [];

        const HOUSE_COMBO_MEANINGS = {
            "ตนุ_ตนุ": "ตนเองพึ่งตนเอง วาสนาเข้มแข็ง มั่นใจในตัวเองสูง มีจุดยืนชัดเจน",
            "ตนุ_กดุมภะ": "จิตใจมุ่งมั่นหาเงิน ทรัพย์สินสร้างขึ้นด้วยตัวเอง มีหัวการค้า",
            "ตนุ_สหัชชะ": "ชอบเข้าสังคม มีเพื่อนฝูงมาก เดินทางบ่อย ประสานงานเก่ง",
            "ตนุ_พันธุ": "รักครอบครัว ผูกพันกับบ้านที่อยู่อาศัย ยึดหลักความมั่นคง",
            "ตนุ_ปุตตะ": "มีความคิดสร้างสรรค์ รักเด็ก/บริวาร ชอบริเริ่มสิ่งใหม่ จิตใจสดใส",
            "ตนุ_อริ": "ชีวิตต้องต่อสู้ฟันฝ่า ชอบเอาชนะอุปสรรค ไม่ยอมแพ้ต่อความยากลำบาก",
            "ตนุ_ปัตนิ": "ผูกพันกับคู่ครอง ให้ความสำคัญกับหุ้นส่วนและคนรักเป็นศูนย์กลาง",
            "ตนุ_มรณะ": "มักเดินทางไกล ไปเติบโตต่างถิ่น หรือผ่านวิกฤตแล้วเปลี่ยนแปลงชีวิต",
            "ตนุ_ศุภะ": "ใฝ่รู้ ใฝ่ธรรมะ ผู้ใหญ่เมตตา ชะตาชีวิตเจริญรุ่งเรืองด้วยคุณงามความดี",
            "ตนุ_กัมมะ": "บ้างาน ขยันขันแข็ง ทุ่มเทเพื่อหน้าที่การงาน เกียรติยศชื่อเสียงเด่น",
            "ตนุ_ลาภะ": "เป็นคนมีโชคลาภ หวังสิ่งใดมักสมปรารถนา มิตรสหายนำผลประโยชน์มาให้",
            "ตนุ_วินาศ": "ชอบทำงานเบื้องหลัง สันโดษ เก็บตัว หรือประสบความสำเร็จในทางลับ/ต่างแดน",

            "กดุมภะ_ตนุ": "เงินทองไหลเข้ามาหาตนเอง มีความสามารถในการดึงดูดทรัพย์",
            "กดุมภะ_กดุมภะ": "มหาเศรษฐี ทรัพย์สินมั่นคง การเงินมั่งคั่ง เก็บเงินเก่ง",
            "กดุมภะ_ลาภะ": "เงินต่อเงิน ค้าขายมีกำไร โชคลาภเรื่องการเงินหนุนนำตลอดเวลา",
            "กดุมภะ_กัมมะ": "มีรายได้จากหน้าที่การงานโดยตรง ยิ่งทำงานยิ่งร่ำรวย",
            "กดุมภะ_อริ": "การเงินติดขัด ต้องเหนื่อยยากหาเงิน หรือมีหนี้สินต้องบริหาร",
            "กดุมภะ_มรณะ": "ได้ทรัพย์มรดก ประกันภัย หรือได้เงินจากทางไกล/ต่างประเทศ",
            "กดุมภะ_วินาศ": "เงินทองหมดไปกับเรื่องไม่คาดคิด หรือต้องเก็บเงินแบบซ่อน/อสังหาฯ",

            "ปัตนิ_ตนุ": "คู่ครองตามใจ ให้เกียรติ และเข้ามาส่งเสริมวิถีชีวิตโดยตรง",
            "ปัตนิ_กดุมภะ": "คู่ครองนำโชคเรื่องเงินทองมาให้ หรือร่วมกันทำธุรกิจสร้างฐานะ",
            "ปัตนิ_กัมมะ": "ได้คู่ครองร่วมงาน หรือส่งเสริมตำแหน่งหน้าที่การงานให้เจริญก้าวหน้า",
            "ปัตนิ_ลาภะ": "คู่ครองนำพาโชคลาภ วาสนา และความสำเร็จอันยิ่งใหญ่มาสู่ชีวิต",
            "ปัตนิ_อริ": "คู่ครองขัดแย้ง มีทัศนคติไม่ตรงกัน ต้องปรับความเข้าใจบ่อยครั้ง",
            "ปัตนิ_มรณะ": "คู่ครองอยู่ห่างไกล เป็นชาวต่างชาติต่างภาษา หรือต้องพลัดพรากช่วงหนึ่ง",

            "กัมมะ_ตนุ": "งานขึ้นอยู่กับตัวเอง มีธุรกิจส่วนตัว หรือเป็นผู้นำขับเคลื่อนองค์กร",
            "กัมมะ_กดุมภะ": "การงานสร้างรายได้มหาศาล ทำงานสายการเงิน การค้า การลงทุนรุ่งเรือง",
            "กัมมะ_ศุภะ": "การงานก้าวหน้าสูงส่ง ผู้ใหญ่สนับสนุน มีชื่อเสียงในระดับชาติ/สากล",
            "กัมมะ_ลาภะ": "การงานนำมาซึ่งความสำเร็จและโชคลาภ ได้ผลตอบแทนเกินคาด",
            "กัมมะ_อริ": "งานมีอุปสรรค ต้องแก้ปัญหาเฉพาะหน้าตลอดเวลา เหมาะกับงานตรวจสอบ/แก้ไข",
            "กัมมะ_วินาศ": "ทำงานเบื้องหลัง ที่ปรึษาลับ งานต่างประเทศ หรืองานออนไลน์"
        };

        for (let i = 0; i < 12; i++) {
            const houseA = HOUSES[i];
            const signA = (ascSign + i) % 12;
            const lordA = ZODIAC_SIGNS[signA].lord;
            const lordPlanet = planets[lordA];

            if (!lordPlanet) continue;

            const targetSign = lordPlanet.sign;
            const targetHouseIndex = ((targetSign - ascSign + 12) % 12);
            const houseB = HOUSES[targetHouseIndex];

            const comboKey = `${houseA.name}_${houseB.name}`;
            const defaultMeaning = `เรื่อง${houseA.name} (${houseA.meaning.split(' ')[0]}) สัมพันธ์เชื่อมโยงกับ${houseB.name} (${houseB.meaning.split(' ')[0]}) โดยมีดาว${lordPlanet.name} (${lordPlanet.thNum}) เป็นตัวนำพา`;
            const detailedMeaning = HOUSE_COMBO_MEANINGS[comboKey] || defaultMeaning;

            combinations.push({
                sourceHouse: houseA.name,
                sourceIndex: i + 1,
                targetHouse: houseB.name,
                targetIndex: targetHouseIndex + 1,
                lordPlanetName: lordPlanet.name,
                lordPlanetNum: lordPlanet.thNum,
                targetSignName: ZODIAC_SIGNS[targetSign].name,
                interpretation: detailedMeaning
            });
        }

        return combinations;
    }

    // ─── ๑๕. เกณฑ์พิเศษ + ทักษา + ตรีวัย ─────────────────────────────
    function evaluateSpecialYogasTaksaTriwai(birthDate, ascSign, planets) {
        const yogas = [];
        const ascCategory = ZODIAC_SIGNS[ascSign].category;

        if (ascCategory.includes("นร")) {
            if ([4, 5, 6].includes(planets[5].houseIndex) || planets[5].houseIndex === 0) {
                yogas.push({ name: "นรองค์เกณฑ์", type: "เกณฑ์มหาบุรุษ", desc: "ลัคนาราศีนร ได้รับกระแสพฤหัสบดี/ศุภเคราะห์ เป็นผู้มีสติปัญญาเลิศ สง่างาม เป็นที่เคารพ" });
            }
        } else if (ascCategory.includes("ปัศวะ")) {
            if (planets[1].houseIndex === 9 || planets[3].houseIndex === 9) {
                yogas.push({ name: "ปัศวะองค์เกณฑ์", type: "เกณฑ์ผู้นำเด็ดขาด", desc: "ได้ดาวบาปเคราะห์ทรงพลังในภพกัมมะ เป็นนักสู้ ผู้บุกเบิก ประสบความสำเร็จยิ่งใหญ่" });
            }
        } else if (ascCategory.includes("อำพุ")) {
            if (planets[4].houseIndex === 3 || planets[6].houseIndex === 3) {
                yogas.push({ name: "อำพุองค์เกณฑ์", type: "เกณฑ์โภคทรัพย์มหาศาล", desc: "มีหลักฐานบ้านช่องมั่นคง อุดมด้วยที่ดิน ยานพาหนะ และความมั่งคั่งร่มเย็น" });
            }
        } else if (ascCategory.includes("กีฏะ")) {
            if (planets[8].houseIndex === 6 || planets[3].houseIndex === 6) {
                yogas.push({ name: "กีฏะองค์เกณฑ์", type: "เกณฑ์ชัยชนะศัตรูพินาศ", desc: "มีพลังลึกลับ ชนะศัตรูทั้งปวง มีสัญชาตญาณแม่นยำและบารมีน่าเกรงขาม" });
            }
        }

        if (planets[2].sign === planets[5].sign) {
            yogas.push({ name: "จันทร์-ครูร่วมราศี (คุรุสิริ)", type: "ยอดเมตตามหานิยม", desc: "มีเสน่ห์ทางปัญญาและคุณธรรม ได้รับการอุปถัมภ์จากผู้หลักผู้ใหญ่ตลอดชีวิต" });
        }
        if (planets[1].sign === planets[5].sign) {
            yogas.push({ name: "สุริยะคุรุ (อาทิตย์-พฤหัส)", type: "ดาวอยงยศ ยศศักดิ์เลิศ", desc: "มีวาสนาทางราชการ เกียรติยศสูงเด่น เป็นผู้นำที่มีวิสัยทัศน์กว้างไกล" });
        }

        const dayOfWeek = birthDate.getDay();
        const TAKSA_CYCLE = [1, 2, 3, 4, 7, 5, 8, 6];
        const startTaksaIndex = [0, 1, 2, 3, 5, 7, 4][dayOfWeek];

        const TAKSA_NAMES = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
        const taksaInfo = {};

        for (let i = 0; i < 8; i++) {
            const planetId = TAKSA_CYCLE[(startTaksaIndex + i) % 8];
            taksaInfo[TAKSA_NAMES[i]] = {
                planetNum: planetId,
                planetName: PLANETS[planetId].name,
                thNum: PLANETS[planetId].thNum,
                meaning: `ดาว${PLANETS[planetId].name} ทำหน้าที่เป็นดาว${TAKSA_NAMES[i]}ประจำดวงชะตา`
            };
        }

        const triwai = {
            firstAge: { range: "ปฐมวัย (แรกเกิด - ๒๕ ปี)", ruler: taksaInfo["บริวาร"].planetName, focus: "การวางรากฐานชีวิต การศึกษา การเรียนรู้ และการปรับตัวในครอบครัว" },
            middleAge: { range: "มัชฌิมวัย (๒๖ - ๕๐ ปี)", ruler: taksaInfo["ศรี"].planetName, focus: "การสร้างฐานะ ความมั่นคงทางการเงิน อาชีพการงาน คู่ครอง และชื่อเสียง" },
            lateAge: { range: "ปัจฉิมวัย (๕๑ ปีขึ้นไป)", ruler: taksaInfo["มนตรี"].planetName, focus: "ความสำเร็จที่ตกผลึก ความสุขสงบ การเป็นที่พึ่งพา และธรรมะบารมี" }
        };

        const highlights = [];
        const weaknesses = [];

        for (let pNum in planets) {
            const p = planets[pNum];
            if (["เกษตร", "อุจจ์", "ราชาโชค", "มหาจักร"].includes(p.dignity)) {
                highlights.push(`ดาว${p.name} (${p.thNum}) สถิตภพ${p.houseName} ได้มาตรฐาน ${p.dignity}: ${p.statusDesc}`);
            }
            if (["ประเกษตร", "นิจ"].includes(p.dignity) || p.houseIndex === 5 || p.houseIndex === 7 || p.houseIndex === 11) {
                weaknesses.push(`ดาว${p.name} (${p.thNum}) สถิตภพ${p.houseName} (${p.dignity}): พึงระวัง${p.statusDesc}`);
            }
        }

        return {
            specialYogas: yogas,
            taksa: taksaInfo,
            triwai: triwai,
            summaryHighlights: highlights,
            summaryWeaknesses: weaknesses
        };
    }

    // ─── ๑๖. วิเคราะห์ ๕ มิติ & สรุปคำพยากรณ์ ๕ มิติหลัก ──────────────
    function synthesizePredictions(ascInfo, planets, dignityResult, combinations, specialResult, userQuestion) {
        const peopleDesc = `ท่านเป็นผู้มีวาสนาผูกพันกับดาว${ZODIAC_SIGNS[ascInfo.sign].lordName} ในดวงชะตา มักได้รับการสนับสนุนจาก${specialResult.taksa["มนตรี"].planetName} และควรระมัดระวังการขัดแย้งกับผู้ที่มีอิทธิพลของดาว${specialResult.taksa["กาลกิณี"].planetName}`;
        const eventsDesc = `ชีวิตมีจังหวะการเปลี่ยนแปลงที่สำคัญผ่านการหมุนเวียนของเรือนเกณฑ์ทั้ง ๔ (ตนเอง-หลักฐาน-คู่ครอง-การงาน) โดยมีเรื่องเด่นคือ: ${specialResult.summaryHighlights[0] || 'การสร้างตัวด้วยตนเองอย่างมั่นคง'}`;
        const timingDesc = `ช่วงชีวิตแบ่งเป็น ๓ ยุค โดยวัยสร้างตัว (มัชฌิมวัย) จะได้รับอิทธิพลเกื้อหนุนจากดาว${specialResult.triwai.middleAge.ruler} นำพาความสำเร็จด้านทรัพย์สินและเกียรติยศ`;

        const locElement = ascInfo.element;
        let directionDesc = "ทิศมงคลเสริมบารมี: ทิศตะวันออก (ธาตุไฟ) และทิศเหนือ (ธาตุน้ำ)";
        if (locElement === "ดิน") directionDesc = "ทิศมงคลเสริมบารมี: ทิศตะวันออกเฉียงใต้ และทิศตะวันตกเฉียงใต้ หนุนความมั่นคง";
        else if (locElement === "ลม") directionDesc = "ทิศมงคลเสริมบารมี: ทิศตะวันตก และทิศตะวันตกเฉียงเหนือ หนุนการเจรจาค้าขาย";

        const adviceDesc = `เทคนิคเสริมชะตา: เสริมพลังดาวศรี (${specialResult.taksa["ศรี"].planetName}) ด้วยการบำเพ็ญกุศล สวมใส่เครื่องประดับหรือสีมงคลตามหลักทักษา และระวังผลกระทบจากดาวกาลกิณี (${specialResult.taksa["กาลกิณี"].planetName}) ด้วยความมีสติ`;

        const kendraHouses = {
            tanu: {
                house: "ภพตนุ (ตัวตน/บุคลิก)",
                interpretation: `ลัคนาราศี${ascInfo.signName} ธาตุ${ascInfo.element} มีความเป็นผู้นำ มุ่งมั่นในศักดิ์ศรี จิตใจลึกซึ้ง บุคลิกเด่นเป็นสง่า`
            },
            bandhu: {
                house: "ภพพันธุ (ครอบครัว/บ้าน/ยานพาหนะ)",
                interpretation: `รากฐานครอบครัวและอสังหาริมทรัพย์มั่นคง มีเกณฑ์ได้บ้านหรือหลักทรัพย์ที่สร้างขึ้นด้วยความพากเพียร`
            },
            patni: {
                house: "ภพปัตนิ (คู่ครอง/หุ้นส่วน)",
                interpretation: `คู่ครองเป็นคนขยัน มีความรู้ หรือส่งเสริมเกื้อหนุนดวงชะตา การทำสัญญาทางธุรกิจต้องเน้นความโปร่งใส`
            },
            kamma: {
                house: "ภพกัมมะ (การงาน/อาชีพ)",
                interpretation: `การงานโดดเด่นในสายบริหาร ธุรกิจ การเจรจา หรืองานที่ใช้ความเชี่ยวชาญเฉพาะทาง มีโอกาสก้าวหน้าสู่ตำแหน่งสูง`
            }
        };

        const lifePillars = {
            finance: `การเงินมีความคล่องตัว มีช่องทางรายได้หลายทาง การลงทุนระยะยาวและการเก็บออมในรูปสินทรัพย์มีค่าจะช่วยให้อยู่ดีกินดีอย่างยั่งยืน`,
            career: `การงานมีความก้าวหน้าตามลำดับขั้น เหมาะกับการเป็นผู้นำ เจ้าของกิจการ หรือผู้เชี่ยวชาญระดับสูง`,
            love: `ความรักต้องการความเข้าใจและความจริงใจต่อกัน ควรประคับประคองด้วยการสื่อสารที่นุ่มนวล`,
            health: `สุขภาพโดยรวมแข็งแรง ควรระมัดระวังเรื่องความเครียดและระบบทางเดินอาหารหรือการพักผ่อนไม่เพียงพอ`
        };

        return {
            dimensions5: {
                people: peopleDesc,
                events: eventsDesc,
                timing: timingDesc,
                location: directionDesc,
                technique: adviceDesc
            },
            kendraHouses: kendraHouses,
            lifePillars: lifePillars,
            userQuestionAnswer: userQuestion ? `คำพยากรณ์สำหรับข้อซักถาม "${userQuestion}": ดวงชะตาเปิดรับโอกาสที่ดี มีดาวศุภเคราะห์หนุนนำ หากลงมือทำด้วยความรอบคอบและมีแผนงานชัดเจน จะสัมฤทธิผลตามที่ปรารถนาอย่างแน่นอน` : "ไม่มีคำถามเพิ่มเติมจากเจ้าชะตา"
        };
    }

    // ─── ๑๗. ฟังก์ชันหลักในการประมวลผลทั้ง ๑๐ ขั้นตอน ๔ ระยะ ──────────
    function calculateFullHoroscope(inputData) {
        const {
            name = "ท่านเจ้าชะตา",
            birthDateStr,
            birthTimeStr = "12:00",
            isTimeKnown = true,
            quizAnswers = null,
            lat = 13.7563,
            lng = 100.5018,
            userQuestion = ""
        } = inputData;

        let finalAscSign = null;
        let rectificationUsed = false;
        let rectificationDetails = null;

        const dateParts = birthDateStr.split('-').map(Number);
        const timeParts = birthTimeStr.split(':').map(Number);
        const birthDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]);

        const jd = toJD(dateParts[0], dateParts[1], dateParts[2], timeParts[0] + timeParts[1] / 60);
        let ascCalc = calcAscendant(jd, lat, lng);

        if (!isTimeKnown && quizAnswers) {
            rectificationUsed = true;
            const rasiVotes = new Array(12).fill(0);

            quizAnswers.forEach(ans => {
                if (ans && ans.rasis) {
                    ans.rasis.forEach(r => { rasiVotes[r] += 2; });
                }
            });

            let maxVotes = -1;
            let bestRasi = ascCalc.sign;
            for (let r = 0; r < 12; r++) {
                if (rasiVotes[r] > maxVotes) {
                    maxVotes = rasiVotes[r];
                    bestRasi = r;
                }
            }

            finalAscSign = bestRasi;
            ascCalc = {
                ...ascCalc,
                sign: bestRasi,
                signName: ZODIAC_SIGNS[bestRasi].name,
                element: ZODIAC_SIGNS[bestRasi].element,
                category: ZODIAC_SIGNS[bestRasi].category,
                lord: ZODIAC_SIGNS[bestRasi].lord
            };

            rectificationDetails = {
                recommendedRasi: ZODIAC_SIGNS[bestRasi].name,
                votesSummary: rasiVotes,
                note: "สอบลัคนาผ่านแบบประเมินรูปพรรณ อุปนิสัย และประวัติชีวิต ๔ มิติสำเร็จ"
            };
        } else {
            finalAscSign = ascCalc.sign;
        }

        const planets = calcPlanetsPositions(jd);
        const tanuset = calcTanuset(finalAscSign, planets);
        const nakshatra = calcBirthNakshatra(planets[2].totalDeg);
        const dignityEvaluations = evaluatePlanetsDignity(finalAscSign, planets);
        const ascAspects = evaluateAscendantAspects(finalAscSign, dignityEvaluations);
        const planetPairs = evaluatePlanetInteractions(dignityEvaluations);
        const house144Combos = evaluate144HouseCombinations(finalAscSign, dignityEvaluations);
        const specialResults = evaluateSpecialYogasTaksaTriwai(birthDate, finalAscSign, dignityEvaluations);
        const synthesis = synthesizePredictions(ascCalc, dignityEvaluations, dignityEvaluations, house144Combos, specialResults, userQuestion);

        return {
            metadata: {
                systemName: "สยามโหรามงคล (Siam Astrology Forecast System)",
                clientName: name,
                birthDateStr: birthDateStr,
                birthTimeStr: birthTimeStr,
                isTimeKnown: isTimeKnown,
                calculatedAt: new Date().toISOString()
            },
            phase1: {
                title: "ระยะที่ ๑: เตรียมข้อมูล + เช็คตัวตน",
                step1_input: {
                    birthDate: birthDateStr,
                    birthTime: birthTimeStr,
                    isTimeKnown: isTimeKnown,
                    rectificationUsed: rectificationUsed,
                    rectificationDetails: rectificationDetails
                },
                step2_chart: {
                    ascendant: ascCalc,
                    tanuset: tanuset,
                    nakshatra: nakshatra,
                    planets: dignityEvaluations
                }
            },
            phase2: {
                title: "ระยะที่ ๒: วัดกำลัง + ศักยภาพของดาว",
                step3_dignityHierarchy: dignityEvaluations,
                step4_ascendantAspects: ascAspects,
                step5_planetInteractions: planetPairs
            },
            phase3: {
                title: "ระยะที่ ๓: รวบรวม ร้อยเรียงเรื่องราว",
                step6_housePlacements: dignityEvaluations,
                step7_house144Combinations: house144Combos,
                step8_specialYogasTaksaTriwai: specialResults
            },
            phase4: {
                title: "ระยะที่ ๔: สังเคราะห์ ออกคำพยากรณ์",
                step9_fiveDimensions: synthesis.dimensions5,
                step10_summaryKendraAndLife: {
                    kendraHouses: synthesis.kendraHouses,
                    lifePillars: synthesis.lifePillars,
                    userQuestionAnswer: synthesis.userQuestionAnswer
                }
            }
        };
    }

    return {
        ZODIAC_SIGNS,
        HOUSES,
        PLANETS,
        DIGNITIES,
        NINE_NAKSHATRA_GROUPS,
        NAKSHATRAS_27,
        RECTIFICATION_QUESTIONS,
        toJD,
        getLahiriAyanamsha,
        calcAscendant,
        calcPlanetsPositions,
        calcTanuset,
        calcBirthNakshatra,
        evaluatePlanetsDignity,
        evaluateAscendantAspects,
        evaluatePlanetInteractions,
        evaluate144HouseCombinations,
        evaluateSpecialYogasTaksaTriwai,
        synthesizePredictions,
        calculateFullHoroscope
    };
}));
