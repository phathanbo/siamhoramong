/**
 * 🌟 Thai Horoscope Pro Engine (โหราศาสตร์ไทยฉบับสมบูรณ์ & นวางค์-ตรียางค์ & คำทำนายตามตำรา 100%)
 * รองรับ: ราศีจักร, นวางค์จักร (นว.), ตรียางค์จักร (ตย.), ทักษาเดิม-จร, ตรีวัย, ดาว ๑๐ ดวง, คำทำนายพื้นดวง,
 * คำทำนายรายปีอายุ 1-100 ปีแบบ Dynamic และคำทำนาย 12 เดือนที่แปรผันตามปี/อายุย่างที่เลือก
 */

const ThaiHoroProEngine = (function() {
    "use strict";

    // 12 ราศี
    const ZODIAC_SIGNS = [
        { id: 0, th: "เมษ", en: "Aries", symbol: "♈", lord: 3, element: "ไฟ", type: "จรราศี" },
        { id: 1, th: "พฤษภ", en: "Taurus", symbol: "♉", lord: 6, element: "ดิน", type: "สถิรราศี" },
        { id: 2, th: "มิถุน", en: "Gemini", symbol: "♊", lord: 4, element: "ลม", type: "ทวิภาวะราศี" },
        { id: 3, th: "กรกฎ", en: "Cancer", symbol: "♋", lord: 2, element: "น้ำ", type: "จรราศี" },
        { id: 4, th: "สิงห์", en: "Leo", symbol: "♌", lord: 1, element: "ไฟ", type: "สถิรราศี" },
        { id: 5, th: "กันย์", en: "Virgo", symbol: "♍", lord: 4, element: "ดิน", type: "ทวิภาวะราศี" },
        { id: 6, th: "ตุลย์", en: "Libra", symbol: "♎", lord: 6, element: "ลม", type: "จรราศี" },
        { id: 7, th: "พิจิก", en: "Scorpio", symbol: "♏", lord: 3, element: "น้ำ", type: "สถิรราศี" },
        { id: 8, th: "ธนู", en: "Sagittarius", symbol: "♐", lord: 5, element: "ไฟ", type: "ทวิภาวะราศี" },
        { id: 9, th: "มังกร", en: "Capricorn", symbol: "♑", lord: 7, element: "ดิน", type: "จรราศี" },
        { id: 10, th: "กุมภ์", en: "Aquarius", symbol: "♒", lord: 8, element: "ลม", type: "สถิรราศี" },
        { id: 11, th: "มีน", en: "Pisces", symbol: "♓", lord: 5, element: "น้ำ", type: "ทวิภาวะราศี" }
    ];

    // ภพทั้ง 12
    const HOUSES_12 = [
        { name: "ตนุ", meaning: "ตัวเอง ตัวตน อุปนิสัย สุขภาพ สภาพแวดล้อมกำเนิด บุคลิกภาพ" },
        { name: "กดุมภะ", meaning: "ทรัพย์สมบัติ ทรัพย์สิน การเงิน การหาเงิน รายได้ ข้าวของมีค่า" },
        { name: "สหัชชะ", meaning: "พี่น้อง เพื่อนฝูง มิตรสหาย สังคม การติดต่อเจรจา การเดินทางใกล้" },
        { name: "พันธุ", meaning: "ญาติผู้ใหญ่ แม่ วงศ์ตระกูล ที่อยู่อาศัย ที่ดิน ยานพาหนะ ความมั่นคง" },
        { name: "ปุตตะ", meaning: "บุตร บริวาร คนรักใหม่ โครงการใหม่ ความคิดสร้างสรรค์ โชคเสี่ยง" },
        { name: "อริ", meaning: "อุปสรรค ศัตรู ปัญหา หนี้สิน สุขภาพ โรคภัย การแข่งขัน การต่อสู้" },
        { name: "ปัตนิ", meaning: "คู่ครอง คนรัก หุ้นส่วน คู่สัญญา ผู้ร่วมงาน พันธมิตรทางธุรกิจ" },
        { name: "มรณะ", meaning: "ความสูญเสีย พลัดพราก การเปลี่ยนแปลงใหญ่ การเดินทางไกล ต่างแดน มรดก" },
        { name: "ศุภะ", meaning: "ความสุข ความเจริญ ความสำเร็จ พ่อ การศึกษาชั้นสูง ธรรมะ คุณธรรม" },
        { name: "กัมมะ", meaning: "การงาน ภาระหน้าที่ ตำแหน่ง เกียรติยศ ธุรกิจ ความรับผิดชอบ อาชีพ" },
        { name: "ลาภะ", meaning: "โชคลาภ ความสำเร็จ กำไร ผลประโยชน์ มิตรผู้มีอิทธิพล สิ่งที่ได้มาโดยง่าย" },
        { name: "วินาศ", meaning: "ความเสียหาย สิ่งที่ปิดบัง เบื้องหลัง การสูญสิ้น คดีความ ศัตรูลับ" }
    ];

    // ดาว 10 ดวง พร้อมรหัสสีและชื่อสีภาษาไทยตามตำรา
    const PLANET_DEFS = {
        1: { num: 1, thNum: "๑", name: "อาทิตย์", color: "#e74c3c", colorName: "สีแดง / สีส้มแสด", defaultZodiac: 4, years: 6, element: "ไฟ", nature: "บาปเคราะห์ (ร้อนแรง ยศศักดิ์)" },
        2: { num: 2, thNum: "๒", name: "จันทร์", color: "#f1c40f", colorName: "สีเหลือง / สีขาวนวล / สีครีม", defaultZodiac: 3, years: 15, element: "ดิน", nature: "ศุภเคราะห์ (อ่อนโยน เมตตา)" },
        3: { num: 3, thNum: "๓", name: "อังคาร", color: "#e91e63", colorName: "สีชมพู / สีกลีบบัว", defaultZodiac: 0, years: 8, element: "ลม", nature: "บาปเคราะห์ (กล้าหาญ ขยัน ลุย)" },
        4: { num: 4, thNum: "๔", name: "พุธ", color: "#2ecc71", colorName: "สีเขียวใบไม้ / สีเขียวมรกต", defaultZodiac: 2, years: 17, element: "น้ำ", nature: "ศุภเคราะห์ (ปัญญา วาจา การค้า)" },
        5: { num: 5, thNum: "๕", name: "พฤหัสบดี", color: "#e67e22", colorName: "สีส้ม / สีทอง / สีเหลืองเข้ม", defaultZodiac: 8, years: 19, element: "ดิน", nature: "มหาศุภเคราะห์ (คุณธรรม ปัญญา โชค)" },
        6: { num: 6, thNum: "๖", name: "ศุกร์", color: "#3498db", colorName: "สีฟ้า / สีน้ำเงินคราม", defaultZodiac: 1, years: 21, element: "น้ำ", nature: "ศุภเคราะห์ (โภคทรัพย์ เสน่ห์ ศิลปะ)" },
        7: { num: 7, thNum: "๗", name: "เสาร์", color: "#795548", colorName: "สีม่วง / สีดำ / สีน้ำตาลเข้ม", defaultZodiac: 9, years: 10, element: "ไฟ", nature: "มหาบาปเคราะห์ (อดทน ทุกข์โศก มั่นคง)" },
        8: { num: 8, thNum: "๘", name: "ราหู", color: "#607d8b", colorName: "สีเทา / สีควันบุหรี่ / สีกรมท่า", defaultZodiac: 10, years: 12, element: "ลม", nature: "บาปเคราะห์ (มัวเมา ลุ่มหลง โชคเสี่ยง)" },
        9: { num: 9, thNum: "๙", name: "เกตุ", color: "#9c27b0", colorName: "สีทอง / สีรุ้ง / สีหลากสี", defaultZodiac: null, years: 9, element: "วิญญาณธาตุ", nature: "ดาววิญญาณธาตุ ลางสังหรณ์ สิ่งศักดิ์สิทธิ์" },
        0: { num: 0, thNum: "๐", name: "มฤตยู", color: "#1abc9c", colorName: "สีเขียวหัวเป็ด / สีสนิม / สีเงิน", defaultZodiac: null, years: 7, element: "อากาศธาตุ", nature: "ดาวปฏิวัติ เปลี่ยนแปลงกะทันหัน อัจฉริยะ" }
    };

    const PLANET_HOUSE_MEANINGS = {
        "ตนุ": {
            1: "ดาวอาทิตย์ (๑) กุมลัคน์: มีเกียรติยศ รักศักดิ์ศรี เป็นผู้นำ ชอบความเด่นดัง มีบารมีแต่ใจร้อนและรักความยุติธรรมสูง",
            2: "ดาวจันทร์ (๒) กุมลัคน์: มีเสน่ห์ ผิวพรรณดี จิตใจอ่อนโยน มีเมตตา เข้ากับคนง่าย ช่างเอาใจใส่ แต่จิตใจอ่อนไหวแปรปรวนง่าย",
            3: "ดาวอังคาร (๓) กุมลัคน์: ขยันขันแข็ง กล้าหาญ มุทะลุ ว่องไว เป็นนักต่อสู้ มีพลังชีวิตสูง ระวังอุบัติเหตุและอารมณ์วู่วาม",
            4: "ดาวพุธ (๔) กุมลัคน์: สติปัญญาเฉียบแหลม วาจาไพเราะ มีไหวพริบปฏิภาณ ค้าขายเก่ง เจรจาโน้มน้าวใจคนได้ดีเยี่ยม",
            5: "ดาวพฤหัสบดี (๕) กุมลัคน์: เป็นยอดมงคล (พฤหัสกุมลัคน์คุ้มภัยทั้งปวง) มีสติปัญญา ใฝ่รู้ มีคุณธรรม ผู้ใหญ่เมตตา ประสบความสำเร็จสูง",
            6: "ดาวศุกร์ (๖) กุมลัคน์: มีเสน่ห์ชวนมอง รสนิยมดี รักสวยรักงาม มีโชคด้านความรักและการเงิน อุดมด้วยความสุขและความบันเทิง",
            7: "ดาวเสาร์ (๗) กุมลัคน์: มีความอดทนเป็นเลิศ สุขุม รอบคอบ จริงจังกับชีวิต แต่อาจคิดมาก เครียดง่าย สร้างตัวด้วยหยาดเหงื่อแรงงาน",
            8: "ดาวราหู (๘) กุมลัคน์: ใจนักเลง กล้าได้กล้าเสีย มีไหวพริบในทางธุรกิจทันคน ลุ่มหลงง่าย มีเกณฑ์เดินทางไกลหรือพัวพันกับธุรกิจเสี่ยง",
            9: "ดาวเกตุ (๙) กุมลัคน์: มีลางสังหรณ์แม่นยำ มีสิ่งศักดิ์สิทธิ์คุ้มครอง สนใจเรื่องธรรมะ ปรัชญา หรือวิทยาการโบราณ",
            0: "ดาวมฤตยู (๐) กุมลัคน์: มีความคิดนอกกรอบ เป็นตัวของตัวเองสูง ชอบค้นคว้าสิ่งล้ำยุค มีชีวิตที่ผ่านการเปลี่ยนแปลงแบบคาดไม่ถึง"
        },
        "กดุมภะ": {
            1: "ดาวอาทิตย์ (๑): หาเงินเก่งจากการใช้อำนาจ หน้าที่การงาน ภาครัฐ หรือตำแหน่งชื่อเสียง รายจ่ายส่วนใหญ่หมดไปกับภาพลักษณ์",
            2: "ดาวจันทร์ (๒): การเงินหมุนเวียนดี มีเงินคล่องตัวจากการบริการ อาหารเครื่องดื่ม หรือการติดต่อสตรี",
            3: "ดาวอังคาร (๓): หาเงินได้ด้วยความเหนื่อยยาก ต้องออกแรงแข่งขัน ชิงไหวชิงพริบ หาได้เร็วแต่ก็ใช้จ่ายคล่องมือ",
            4: "ดาวพุธ (๔): ร่ำรวยจากการค้าขาย การเป็นนายหน้า ตัวแทน การเจรจา การเขียน และการสื่อสาร",
            5: "ดาวพฤหัสบดี (๕): มีความมั่นคงทางการเงินสูง ได้รับเงินจากวิชาความรู้ การศึกษา การสอน ที่ปรึกษา หรือทรัพย์มรดก",
            6: "ดาวศุกร์ (๖): มหาเศรษฐีทางโภคทรัพย์ การเงินมั่งคั่ง ได้เงินจากความงาม ศิลปะ บันเทิง หรือธุรกิจแฟชั่น",
            7: "ดาวเสาร์ (๗): การเงินมาช้าแต่หนักแน่น สะสมทรัพย์ได้มากจากอสังหาริมทรัพย์ การเกษตร หรือการลงทุนระยะยาว",
            8: "ดาวราหู (๘): เงินทองหมุนเวียนก้อนใหญ่ ได้จากธุรกิจกลางคืน การเก็งกำไร นำเข้า-ส่งออก หรือโชคเสี่ยง",
            9: "ดาวเกตุ (๙): มีเงินทองเข้ามาอย่างปาฏิหาริย์ ได้ลาภลอยจากสิ่งศักดิ์สิทธิ์ หรือของเก่าโบราณ",
            0: "ดาวมฤตยู (๐): การเงินขึ้นลงกะทันหัน ร่ำรวยได้จากเทคโนโลยี ลิขสิทธิ์ หรือสิ่งประดิษฐ์ใหม่ๆ"
        },
        "สหัชชะ": {
            1: "ดาวอาทิตย์ (๑): เพื่อนฝูงมักเป็นคนมียศถาบรรดาศักดิ์ เป็นผู้นำ มีหน้ามีตาในสังคม",
            2: "ดาวจันทร์ (๒): มีเพื่อนร่วมงานที่คอยช่วยเหลือดูแล อบอุ่น มีมิตรสหายเพศหญิงมาก",
            3: "ดาวอังคาร (๓): มิตรสหายเป็นสายลุย กล้าได้กล้าเสีย ชวนกันทำกิจกรรมหรือทำงานหนัก",
            4: "ดาวพุธ (๔): มีสังคมกว้างขวาง ติดต่อสื่อสารกับคนจำนวนมาก เจรจาแลกเปลี่ยนข้อมูลเก่ง",
            5: "ดาวพฤหัสบดี (๕): ได้มิตรเป็นครูบาอาจารย์ นักวิชาการ หรือผู้ทรงคุณธรรม คอยชี้แนะแนวทางที่ถูกต้อง",
            6: "ดาวศุกร์ (๖): เพื่อนฝูงรักสนุก นิยมงานสังสรรค์ ศิลปะ และพาไปพบโอกาสที่ดี",
            7: "ดาวเสาร์ (๗): มีเพื่อนน้อยแต่มั่นคง มักคบหาคนอายุมากกว่าหรือมีประสบการณ์สูง",
            8: "ดาวราหู (๘): คบเพื่อนหลากหลายวงการ เพื่อนต่างถิ่นต่างชาติ หรือมิตรสายบันเทิง",
            9: "ดาวเกตุ (๙): มีเพื่อนในแวดวงสายมู ธรรมะ หรือกลุ่มคนที่มีความสนใจเฉพาะตัว",
            0: "ดาวมฤตยู (๐): เพื่อนฝูงสายเทคโนโลยี สายวิจัย หรือมีความคิดแปลกแหวกแนว"
        },
        "พันธุ": {
            1: "ดาวอาทิตย์ (๑): วงศ์ตระกูลมีชื่อเสียง มีเกียรติยศในถิ่นฐาน บ้านเรือนโอ่อ่าเปิดเผย",
            2: "ดาวจันทร์ (๒): ผูกพันกับแม่และครอบครัวมาก ที่อยู่อาศัยร่มเย็น ใกล้น้ำ หรือตกแต่งสวยงาม",
            3: "ดาวอังคาร (๓): ครอบครัวอาจมีความเข้มงวด ที่อยู่อาศัยมักอยู่ใกล้ทางแยก ตลาด หรือสถานที่มีความคึกคัก",
            4: "ดาวพุธ (๔): บ้านเรือนเป็นแหล่งเรียนรู้ หรือทำการค้า มีญาติพี่น้องไปมาหาสู่เจรจาบ่อยครั้ง",
            5: "ดาวพฤหัสบดี (๕): ครอบครัวอบอุ่น มีศีลธรรม มีที่ดินมรดก หรือบ้านพักอาศัยที่สงบร่มเย็น",
            6: "ดาวศุกร์ (๖): บ้านเรือนสวยงาม ตกแต่งหรูหรา น่าอยู่ เป็นศูนย์รวมแห่งความสุขของครอบครัว",
            7: "ดาวเสาร์ (๗): มีความมั่นคงด้านอสังหาริมทรัพย์ ที่ดิน หรือสิ่งปลูกสร้างขนาดใหญ่ แต่ครอบครัวต้องฝ่าฟันสร้างตัว",
            8: "ดาวราหู (๘): มีการย้ายถิ่นฐานบ่อย มีทรัพย์สินในต่างแดน หรือปรับปรุงเปลี่ยนแปลงบ้านเรือนอยู่เสมอ",
            9: "ดาวเกตุ (๙): บ้านเรือนมีสิ่งศักดิ์สิทธิ์คุ้มครอง มักมีห้องพระ หรือตั้งอยู่ในทำเลที่มีมนต์ขลัง",
            0: "ดาวมฤตยู (๐): มีบ้านสไตล์ทันสมัย หรือมีระบบอัจฉริยะ อาจมีการโยกย้ายที่อยู่แบบกะทันหัน"
        },
        "ปุตตะ": {
            1: "ดาวอาทิตย์ (๑): บุตรบริวารมีความฉลาด มีภาวะผู้นำ โดดเด่นในโรงเรียนหรือหน้าที่การงาน",
            2: "ดาวจันทร์ (๒): บุตรบริวารน่ารัก อ่อนโยน ว่านอนสอนง่าย นำความชื่นใจมาให้",
            3: "ดาวอังคาร (๓): บุตรบริวารซุกซน กระตือรือร้น ชอบกีฬาหรือกิจกรรมท้าทาย",
            4: "ดาวพุธ (๔): บุตรบริวารช่างพูด ฉลาดหลักแหลม มีไหวพริบในการเรียนรู้",
            5: "ดาวพฤหัสบดี (๕): บุตรบริวารมีคุณธรรม ปัญญาดี ประสบความสำเร็จด้านการศึกษาอย่างสูง",
            6: "ดาวศุกร์ (๖): บุตรบริวารมีเสน่ห์ มีความสามารถด้านศิลปะ ดนตรี และการแสดง",
            7: "ดาวเสาร์ (๗): บุตรบริวารมีความรับผิดชอบสูง แต่เลี้ยงดูยากหรือต้องอดทนสั่งสอนเป็นพิเศษ",
            8: "ดาวราหู (๘): บุตรบริวารรักอิสระ ฉลาดแกมโกง หรือมีความคิดก้าวหน้าเกินวัย",
            9: "ดาวเกตุ (๙): บุตรมีนิสัยพิเศษ ลางสังหรณ์ดี หรือได้ลูกจากการขอดุอาอ์/บนบานสิ่งศักดิ์สิทธิ์",
            0: "ดาวมฤตยู (๐): บุตรมีหัวคิดทันสมัย อัจฉริยะ หรือมีความสนใจในเรื่องล้ำยุค"
        },
        "อริ": {
            1: "ดาวอาทิตย์ (๑): ระวังปัญหาเรื่องสายตา หัวใจ หรือความขัดแย้งกับผู้มีอำนาจและราชการ",
            2: "ดาวจันทร์ (๒): ระวังปัญหาเรื่องอารมณ์แปรปรวน โรคเกี่ยวกับทางเดินอาหาร หรือถูกใส่ความ",
            3: "ดาวอังคาร (๓): มีศัตรูที่เปิดเผย ระวังของมีคม ผ่าตัด อุบัติเหตุจากการขับขี่หรือไฟ",
            4: "ดาวพุธ (๔): ระวังปัญหาเรื่องคำพูด เอกสารสัญญา หรือการถูกหลอกลวงบิดเบือนข้อมูล",
            5: "ดาวพฤหัสบดี (๕): ชนะอุปสรรคได้ด้วยคุณธรรมและปัญญา ผู้ใหญ่ที่เคยขัดแย้งจะยอมรับในที่สุด",
            6: "ดาวศุกร์ (๖): ระวังปัญหาเรื่องชู้สาว การเงิน หรือความขัดแย้งเรื่องผลประโยชน์ความงาม",
            7: "ดาวเสาร์ (๗): ชนะศัตรูคู่แข่งด้วยความทรหดอดทน ระวังโรคกระดูก ปวดหลัง และความเครียด",
            8: "ดาวราหู (๘): ระวังการถูกหักหลัง คดีความ การพนัน หรือสิ่งมัวเมาลุ่มหลง",
            9: "ดาวเกตุ (๙): ปัญหาอุปสรรคมักคลี่คลายด้วยปาฏิหาริย์ สิ่งศักดิ์สิทธิ์ช่วยปัดเป่าภัย",
            0: "ดาวมฤตยู (๐): โรคภัยที่หาสาเหตุได้ยาก หรือเหตุการณ์ผกผันที่เกิดขึ้นโดยไม่ทันตั้งตัว"
        },
        "ปัตนิ": {
            1: "ดาวอาทิตย์ (๑): คู่ครองมีเกียรติ มียศศักดิ์ มีความเป็นผู้นำสูง แต่อาจมีทิฐิและเอาแต่ใจบ้าง",
            2: "ดาวจันทร์ (๒): คู่ครองมีเสน่ห์ อ่อนโยน ดูแลเอาใจใส่เก่ง เป็นแม่บ้านแม่เรือนที่ดี",
            3: "ดาวอังคาร (๓): คู่ครองขยันขันแข็ง พูดจาตรงไปตรงมา ช่วยกันทำมาหากินแต่อาจมีปากเสียงบ่อย",
            4: "ดาวพุธ (๔): คู่ครองช่างพูด มีไหวพริบ ค้าขายเก่ง ช่วยเหลือด้านการวางแผนและการเจรจา",
            5: "ดาวพฤหัสบดี (๕): ได้คู่ครองที่เป็นกัลยาณมิตร มีการศึกษา มีศีลธรรม ส่งเสริมความเจริญรุ่งเรือง",
            6: "ดาวศุกร์ (๖): คู่ครองหน้าตาดี มีเสน่ห์ รสนิยมเลิศ นำพาความสุขและโภคทรัพย์มาสู่ครอบครัว",
            7: "ดาวเสาร์ (๗): คู่ครองอายุมากกว่าหรือมีความเป็นผู้ใหญ่สูง มีความรับผิดชอบและสร้างฐานะร่วมกันอย่างมั่นคง",
            8: "ดาวราหู (๘): ได้คู่ครองต่างชาติต่างภาษา หรือคนในแวดวงธุรกิจเสี่ยง พลิกแพลงเก่ง",
            9: "ดาวเกตุ (๙): คู่ครองมีความสนใจด้านธรรมะ จิตวิญญาณ หรือพบรักกันในสถานที่ศักดิ์สิทธิ์",
            0: "ดาวมฤตยู (๐): ความรักแบบไม่ธรรมดา อยู่กินแบบอิสระ หรือคู่ครองทำงานด้านวิจัย/เทคโนโลยี"
        },
        "มรณะ": {
            1: "ดาวอาทิตย์ (๑): ได้รับมรดกหรือผลประโยชน์จากการสูญเสีย มีเกณฑ์เดินทางไปต่างแดนบ่อย",
            2: "ดาวจันทร์ (๒): มรดกตกทอดจากทางฝ่ายหญิง หรือมีการเปลี่ยนแปลงด้านอารมณ์บ่อยครั้ง",
            3: "ดาวอังคาร (๓): ระวังการสูญเสียจากความใจร้อน แต่มีเกณฑ์ได้ลาภผลจากการแก้ปัญหาที่ยาก",
            4: "ดาวพุธ (๔): ได้ผลประโยชน์จากเอกสารมรดก ลิขสิทธิ์ หรือความรู้ที่ถ่ายทอดมา",
            5: "ดาวพฤหัสบดี (๕): มีความรู้ลึกซึ้งด้านปรัชญา โหราศาสตร์ และการแพทย์ ปลอดภัยจากภยันตรายร้ายแรง",
            6: "ดาวศุกร์ (๖): ได้รับทรัพย์สินมรดก ของมีค่า หรืออัญมณีตกทอดจากบรรพบุรุษ",
            7: "ดาวเสาร์ (๗): ได้รับมรดกเป็นที่ดิน อสังหาริมทรัพย์ หรือทรัพย์สินโบราณที่ต้องใช้เวลาฟื้นฟู",
            8: "ดาวราหู (๘): ได้ลาภก้อนโตจากแดนไกล มรดกที่ไม่คาดฝัน หรือธุรกิจที่พัวพันกับต่างชาติ",
            9: "ดาวเกตุ (๙): มีญาณหยั่งรู้เรื่องความตายและสิ่งลี้ลับ แคล้วคลาดปลอดภัยจากภัยพิบัติ",
            0: "ดาวมฤตยู (๐): มีความสนใจในวิทยาศาสตร์ขั้นสูง โหราศาสตร์ หรือการฟื้นฟูสิ่งเก่าให้ทันสมัย"
        },
        "ศุภะ": {
            1: "ดาวอาทิตย์ (๑): ประสบความสำเร็จในชีวิต ได้รับการยกย่องสรรเสริญ มีชื่อเสียงขจรขจาย",
            2: "ดาวจันทร์ (๒): มีความสุขสงบในใจ มีผู้ใหญ่อุปถัมภ์ค้ำชู จิตใจใฝ่กุศล",
            3: "ดาวอังคาร (๓): สร้างชื่อเสียงและความสำเร็จด้วยความกล้าหาญ การบุกเบิก และการต่อสู้",
            4: "ดาวพุธ (๔): สำเร็จในการศึกษาชั้นสูง การเขียน การเจรจาระหว่างประเทศ และการเผยแพร่ความรู้",
            5: "ดาวพฤหัสบดี (๕): เป็นเอกด้านวิชาการ มีคุณธรรมสูงเด่น เป็นที่เคารพนับถือของคนในสังคม",
            6: "ดาวศุกร์ (๖): ชีวิตมีความสุขสบาย ได้ท่องเที่ยวสถานที่สวยงาม มีโชคด้านศิลปวัฒนธรรม",
            7: "ดาวเสาร์ (๗): ความสำเร็จมาช้าแต่มั่นคงถาวร เป็นปราชญ์ผู้ผ่านประสบการณ์ชีวิตมาอย่างโชกโชน",
            8: "ดาวราหู (๘): ประสบความสำเร็จในต่างแดน หรือธุรกิจระหว่างประเทศที่มีความท้าทาย",
            9: "ดาวเกตุ (๙): มีครูบาอาจารย์หรือสิ่งศักดิ์สิทธิ์คอยเกื้อหนุนให้เจริญก้าวหน้าในทางธรรม",
            0: "ดาวมฤตยู (๐): สร้างชื่อเสียงจากนวัตกรรมใหม่ๆ หรือการปฏิวัติวงการวิชาการ"
        },
        "กัมมะ": {
            1: "ดาวอาทิตย์ (๑): ทำงานราชการ ผู้บริหาร ผู้นำองค์กร หรือธุรกิจที่ต้องใช้ชื่อเสียงและอำนาจ",
            2: "ดาวจันทร์ (๒): งานบริการ การโรงแรม อาหาร การพยาบาล หรือธุรกิจที่เกี่ยวกับสาธารณชน",
            3: "ดาวอังคาร (๓): วิศวกร ทหาร ตำรวจ กีฬา ช่าง โรงงาน หรืองานที่ต้องใช้ความเด็ดขาด",
            4: "ดาวพุธ (๔): การค้า การตลาด นักพูด นักเขียน นักข่าว นายหน้า ประชาสัมพันธ์",
            5: "ดาวพฤหัสบดี (๕): ครูบาอาจารย์ แพทย์ นักกฎหมาย ผู้พิพากษา ที่ปรึกษา นักวิชาการ",
            6: "ดาวศุกร์ (๖): ศิลปิน ดารา ดีไซเนอร์ การเงิน การธนาคาร ธุรกิจความงามและจิวเวลรี่",
            7: "ดาวเสาร์ (๗): งานอุตสาหกรรม ก่อสร้าง เหมืองแร่ เกษตรกรรม อสังหาริมทรัพย์",
            8: "ดาวราหู (๘): นำเข้า-ส่งออก การบิน ธุรกิจกลางคืน การบันเทิง หรือการค้าออนไลน์",
            9: "ดาวเกตุ (๙): งานที่เกี่ยวกับศาสนา วัตถุมงคล โหราศาสตร์ มูลนิธิ หรือวิทยาการลี้ลับ",
            0: "ดาวมฤตยู (๐): นักวิจัย นักประดิษฐ์ เทคโนโลยี AI ดาราศาสตร์ หรืองานที่ไม่มีใครทำมาก่อน"
        },
        "ลาภะ": {
            1: "ดาวอาทิตย์ (๑): ได้โชคลาภจากบุคคลชั้นสูง ผู้มีอำนาจ หรือการชนะการประมูลแข่งขัน",
            2: "ดาวจันทร์ (๒): ได้ลาภผลเนืองนิตย์จากความเมตตาของผู้ใหญ่และมิตรสหายเพศหญิง",
            3: "ดาวอังคาร (๓): ได้ลาภจากการลงมือทำอย่างรวดเร็ว โชคจากการแข่งขันและการประมูล",
            4: "ดาวพุธ (๔): ได้ลาภจากคำพูด นายหน้า ตัวแทน การค้ากำไร และการเจรจาต่อรอง",
            5: "ดาวพฤหัสบดี (๕): ยอดมหาโชคลาภ ได้รับลาภผลก้อนใหญ่จากความรู้ ผลงาน และความดีงาม",
            6: "ดาวศุกร์ (๖): โชคลาภเงินทองหลั่งไหล ได้ลาภจากความเสน่หา ศิลปะ และธุรกิจการเงิน",
            7: "ดาวเสาร์ (๗): ได้โชคลาภก้อนใหญ่จากทรัพย์สิน ดิน ที่ดิน หรือการรอคอยที่ยาวนาน",
            8: "ดาวราหู (๘): ลาภลอย ลาภเสี่ยง การเก็งกำไร หรือได้ผลประโยชน์จากทางไกล",
            9: "ดาวเกตุ (๙): โชคลาภฟลุ๊คๆ จากสิ่งศักดิ์สิทธิ์ เลขมงคล หรือความฝันแม่นยำ",
            0: "ดาวมฤตยู (๐): ลาภผลกะทันหันจากการค้นพบ การลงทุนทางเทคโนโลยี หรือสิ่งใหม่"
        },
        "วินาศ": {
            1: "ดาวอาทิตย์ (๑): ระวังการเสียชื่อเสียงจากการถูกใส่ร้ายเบื้องหลัง หรือคดีความลับ",
            2: "ดาวจันทร์ (๒): ระวังความเสียหายจากความใจอ่อน หรือปัญหาที่แอบซ่อนในใจ",
            3: "ดาวอังคาร (๓): ระวังความขัดแย้งแบบไม่เปิดเผย อุบัติเหตุในที่ลับตา หรือศัตรูมืด",
            4: "ดาวพุธ (๔): ระวังเอกสารลับรั่วไหล การเจรจาที่ไม่โปร่งใส หรือการถูกนินทาว่าร้าย",
            5: "ดาวพฤหัสบดี (๕): เปลี่ยนร้ายกลายเป็นดี ศัตรูลับจะพ่ายแพ้ภัยตัวเอง มีสิ่งคุ้มครองภัย",
            6: "ดาวศุกร์ (๖): ระวังการสูญเสียเงินทองไปกับความหลงใหล สิ่งล่อตาล่อใจ หรือความรักลับๆ",
            7: "ดาวเสาร์ (๗): มีความลับหรือภาระหนักที่ต้องแบกรับไว้คนเดียว ชนะศัตรูด้วยความนิ่งเงียบ",
            8: "ดาวราหู (๘): ระวังการถูกหลอกลวง การพัวพันกับสิ่งผิดกฎหมาย หรือการถูกหักหลัง",
            9: "ดาวเกตุ (๙): แคล้วคลาดจากภัยมืด สิ่งศักดิ์สิทธิ์ช่วยเปิดเผยความจริงและปกป้องดวงชะตา",
            0: "ดาวมฤตยู (๐): มีความลับทางวิทยาการ หรือเหตุการณ์พลิกผันที่เกิดขึ้นโดยไม่มีใครรู้ล่วงหน้า"
        }
    };

    const THAKSA_ORDER = [1, 2, 3, 4, 7, 5, 8, 6];
    const THAKSA_NAMES = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
    const ANTO_MINUTES = [120, 100, 80, 80, 100, 120, 140, 160, 180, 180, 160, 140];

    function calculateNavamsha(rasiIndex, deg, min) {
        const totalDeg = deg + (min / 60);
        const navIndex = Math.min(8, Math.floor(totalDeg / (30 / 9)));
        let startSign = 0;
        const triplicity = rasiIndex % 4;
        if (triplicity === 0) startSign = 0;
        else if (triplicity === 1) startSign = 9;
        else if (triplicity === 2) startSign = 6;
        else if (triplicity === 3) startSign = 3;

        const navRasi = (startSign + navIndex) % 12;
        return { navRasi, navIndex: navIndex + 1, rasiName: ZODIAC_SIGNS[navRasi].th };
    }

    function calculateDrekkana(rasiIndex, deg, min) {
        const totalDeg = deg + (min / 60);
        const triIndex = Math.min(2, Math.floor(totalDeg / 10));
        let drekRasi = rasiIndex;
        if (triIndex === 0) drekRasi = rasiIndex;
        else if (triIndex === 1) drekRasi = (rasiIndex + 4) % 12;
        else if (triIndex === 2) drekRasi = (rasiIndex + 8) % 12;

        return { drekRasi, triIndex: triIndex + 1, rasiName: ZODIAC_SIGNS[drekRasi].th };
    }

    function getThaiDayOfWeek(date, birthTimeStr) {
        let day = date.getDay();
        const [hh, mm] = (birthTimeStr || "06:00").split(":").map(Number);
        if (hh < 6) day = (day + 6) % 7;
        return day;
    }

    function getBirthPlanetNumber(date, birthTimeStr) {
        const [hh, mm] = (birthTimeStr || "06:00").split(":").map(Number);
        let d = date.getDay();
        if (hh < 6) d = (d + 6) % 7;

        if (d === 0) return 1;
        if (d === 1) return 2;
        if (d === 2) return 3;
        if (d === 3) {
            if (hh >= 18 || hh < 6) return 8;
            return 4;
        }
        if (d === 4) return 5;
        if (d === 5) return 6;
        if (d === 6) return 7;
        return 1;
    }

    function calculateAscendant(birthDate, birthTimeStr) {
        const [hh, mm] = (birthTimeStr || "06:00").split(":").map(Number);
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();

        let sunRasi = 0;
        if ((month === 4 && day >= 14) || (month === 5 && day <= 14)) sunRasi = 0;
        else if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) sunRasi = 1;
        else if ((month === 6 && day >= 15) || (month === 7 && day <= 16)) sunRasi = 2;
        else if ((month === 7 && day >= 17) || (month === 8 && day <= 16)) sunRasi = 3;
        else if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) sunRasi = 4;
        else if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) sunRasi = 5;
        else if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) sunRasi = 6;
        else if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) sunRasi = 7;
        else if ((month === 12 && day >= 16) || (month === 1 && day <= 14)) sunRasi = 8;
        else if ((month === 1 && day >= 15) || (month === 2 && day <= 13)) sunRasi = 9;
        else if ((month === 2 && day >= 14) || (month === 3 && day <= 14)) sunRasi = 10;
        else sunRasi = 11;

        let totalMinutes = (hh >= 6 ? (hh - 6) * 60 + mm : (hh + 18) * 60 + mm);
        let currRasi = sunRasi;
        let ascDeg = 0;
        let ascMin = 0;

        while (totalMinutes > 0) {
            let rasiMinutes = ANTO_MINUTES[currRasi];
            if (totalMinutes < rasiMinutes) {
                let degRatio = (totalMinutes / rasiMinutes) * 30;
                ascDeg = Math.floor(degRatio);
                ascMin = Math.floor((degRatio - ascDeg) * 60);
                break;
            }
            totalMinutes -= rasiMinutes;
            currRasi = (currRasi + 1) % 12;
        }

        const nav = calculateNavamsha(currRasi, ascDeg, ascMin);
        const drek = calculateDrekkana(currRasi, ascDeg, ascMin);

        return {
            rasiIndex: currRasi,
            rasiName: ZODIAC_SIGNS[currRasi].th,
            symbol: ZODIAC_SIGNS[currRasi].symbol,
            deg: ascDeg,
            min: ascMin,
            sunRasi: sunRasi,
            navamsha: nav,
            drekkana: drek
        };
    }

    function calculatePlanets(targetDateObj, isTransit = false) {
        const targetDate = new Date(targetDateObj);
        const y = targetDate.getFullYear();
        const m = targetDate.getMonth() + 1;
        const d = targetDate.getDate();

        const jd = (function(year, month, day) {
            if (month <= 2) { year -= 1; month += 12; }
            const A = Math.floor(year / 100);
            const B = 2 - A + Math.floor(A / 4);
            return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
        })(y, m, d);

        const dJ2000 = jd - 2451545.0;
        const ayanamsa = 23.85 + (y - 1950) * 0.01397;

        function siderealPos(meanLong, rate) {
            let l = (meanLong + rate * dJ2000 - ayanamsa) % 360;
            if (l < 0) l += 360;
            const rasi = Math.floor(l / 30);
            const deg = Math.floor(l % 30);
            const min = Math.floor(((l % 30) - deg) * 60);
            return { rasi, deg, min, long: l };
        }

        const pos1 = siderealPos(280.460, 0.9856474);
        const pos2 = siderealPos(218.316, 13.176396);
        const pos3 = siderealPos(355.433, 0.524033);
        const pos4 = siderealPos((pos1.long + 15 * Math.sin(dJ2000 * 0.07)), 0);
        const pos5 = siderealPos(34.351, 0.0830853);
        const pos6 = siderealPos((pos1.long + 25 * Math.cos(dJ2000 * 0.04)), 0);
        const pos7 = siderealPos(50.077, 0.0334597);
        const pos8 = siderealPos(250.0 - 0.05295 * dJ2000, 0);
        const pos9 = { rasi: (pos8.rasi + 6) % 12, deg: (30 - pos8.deg) % 30, min: (60 - pos8.min) % 60 };
        const pos0 = siderealPos(100.0, 0.0117);

        const rawPositions = {
            1: pos1, 2: pos2, 3: pos3, 4: pos4,
            5: pos5, 6: pos6, 7: pos7, 8: pos8,
            9: pos9, 0: pos0
        };

        const planets = {};
        for (let p in PLANET_DEFS) {
            const raw = rawPositions[p];
            const nav = calculateNavamsha(raw.rasi, raw.deg || 0, raw.min || 0);
            const drek = calculateDrekkana(raw.rasi, raw.deg || 0, raw.min || 0);

            planets[p] = {
                ...PLANET_DEFS[p],
                rasi: raw.rasi,
                rasiName: ZODIAC_SIGNS[raw.rasi].th,
                deg: raw.deg || 0,
                min: raw.min || 0,
                navamsha: nav,
                drekkana: drek
            };
        }

        return planets;
    }

    function calculateThaksa(birthPlanetNum, age) {
        const startIdx = THAKSA_ORDER.indexOf(birthPlanetNum);
        const originalThaksa = {};
        for (let i = 0; i < 8; i++) {
            const pNum = THAKSA_ORDER[(startIdx + i) % 8];
            originalThaksa[THAKSA_NAMES[i]] = pNum;
        }

        const jorIdx = (startIdx + (age % 8)) % 8;
        const jorThaksa = {};
        for (let i = 0; i < 8; i++) {
            const pNum = THAKSA_ORDER[(jorIdx + i) % 8];
            jorThaksa[THAKSA_NAMES[i]] = pNum;
        }

        return {
            original: originalThaksa,
            jor: jorThaksa,
            birthPlanetNum: birthPlanetNum,
            jorStartPlanet: THAKSA_ORDER[jorIdx],
            dechaJor: jorThaksa["เดช"],
            sriJor: jorThaksa["ศรี"],
            kalakiniJor: jorThaksa["กาลกิณี"],
            boriwanJor: jorThaksa["บริวาร"],
            mulaJor: jorThaksa["มูละ"],
            utsaJor: jorThaksa["อุตสาหะ"],
            montriJor: jorThaksa["มนตรี"],
            ayuJor: jorThaksa["อายุ"]
        };
    }

    function calculateTrivai(ascRasiIndex, birthPlanets, currentAge) {
        const grid = [
            [
                { houseIdx: 0, ageMin: 0, ageMax: 8.4, ageText: "0 - 8.4 ปี", phase: "วัยต้น", planetNum: 4 },
                { houseIdx: 2, ageMin: 25, ageMax: 33.4, ageText: "25 - 33.4 ปี", phase: "วัยกลาง", planetNum: 1 },
                { houseIdx: 3, ageMin: 50, ageMax: 58.4, ageText: "50 - 58.4 ปี", phase: "วัยปลาย", planetNum: 4 },
                { houseIdx: 5, ageMin: 75, ageMax: 83.4, ageText: "75 - 83.4 ปี", phase: "วัยเทียบ", planetNum: 3 }
            ],
            [
                { houseIdx: 1, ageMin: 8.4, ageMax: 16.8, ageText: "8.4 - 16.8 ปี", phase: "วัยต้น", planetNum: 2 },
                { houseIdx: 8, ageMin: 33.4, ageMax: 41.8, ageText: "33.4 - 41.8 ปี", phase: "วัยกลาง", planetNum: 8 },
                { houseIdx: 4, ageMin: 58.4, ageMax: 66.8, ageText: "58.4 - 66.8 ปี", phase: "วัยปลาย", planetNum: 6 },
                { houseIdx: 7, ageMin: 83.4, ageMax: 91.8, ageText: "83.4 - 91.8 ปี", phase: "วัยเทียบ", planetNum: 7 }
            ],
            [
                { houseIdx: 9, ageMin: 16.8, ageMax: 25.0, ageText: "16.8 - 25 ปี", phase: "วัยต้น", planetNum: 5 },
                { houseIdx: 10, ageMin: 41.8, ageMax: 50.0, ageText: "41.8 - 50 ปี", phase: "วัยกลาง", planetNum: 3 },
                { houseIdx: 6, ageMin: 66.8, ageMax: 75.0, ageText: "66.8 - 75 ปี", phase: "วัยปลาย", planetNum: 5 },
                { houseIdx: 11, ageMin: 91.8, ageMax: 100.0, ageText: "91.8 - 100 ปี", phase: "วัยเทียบ", planetNum: 6 }
            ]
        ];

        return grid.map(row => {
            return row.map(cell => {
                const actualRasi = (ascRasiIndex + cell.houseIdx) % 12;
                const isCurrent = currentAge >= cell.ageMin && currentAge < cell.ageMax;
                return {
                    ...cell,
                    houseName: HOUSES_12[cell.houseIdx].name,
                    rasiName: ZODIAC_SIGNS[actualRasi].th,
                    thNum: PLANET_DEFS[cell.planetNum].thNum,
                    isCurrent: isCurrent
                };
            });
        });
    }

    // คำทำนายรายปี (อายุ 1-100 ปี) ตามตำราโหราศาสตร์ไทย & มหาทักษาพยากรณ์ 100%
    function calculateSingleYearPrediction(birthPlanetNum, targetAgeYang, birthYear) {
        const startIdx = THAKSA_ORDER.indexOf(birthPlanetNum);
        const jorIdx = (startIdx + ((targetAgeYang - 1) % 8)) % 8;

        const mainPlanetNum = THAKSA_ORDER[jorIdx];
        const pNumAyu = THAKSA_ORDER[(jorIdx + 1) % 8];
        const pNumDecha = THAKSA_ORDER[(jorIdx + 2) % 8];
        const pNumSri = THAKSA_ORDER[(jorIdx + 3) % 8];
        const pNumMula = THAKSA_ORDER[(jorIdx + 4) % 8];
        const pNumUtsa = THAKSA_ORDER[(jorIdx + 5) % 8];
        const pNumMontri = THAKSA_ORDER[(jorIdx + 6) % 8];
        const pNumKala = THAKSA_ORDER[(jorIdx + 7) % 8];

        const pMain = PLANET_DEFS[mainPlanetNum];
        const pAyu = PLANET_DEFS[pNumAyu];
        const pSri = PLANET_DEFS[pNumSri];
        const pKala = PLANET_DEFS[pNumKala];
        const pDecha = PLANET_DEFS[pNumDecha];
        const pMontri = PLANET_DEFS[pNumMontri];
        const pMula = PLANET_DEFS[pNumMula];
        const pUtsa = PLANET_DEFS[pNumUtsa];

        const calYearAD = (birthYear ? birthYear + (targetAgeYang - 1) : new Date().getFullYear());
        const calYearBE = calYearAD + 543;

        // คำทำนายเจาะลึก 4 ด้านตามหลักทักษา
        let workDesc = "";
        let financeDesc = "";
        let loveDesc = "";
        let healthDesc = "";

        // ด้านการงาน & ธุรกิจ (ดูจาก เดชจร, อุตสาหะจร, มนตรีจร)
        workDesc = `การงานในปีนี้ตกอยู่ใต้อิทธิพลของ <strong>ดาว${pDecha.name} (เดชจร)</strong> และ <strong>ดาว${pMontri.name} (มนตรีจร)</strong> `;
        if (pDecha.element === "ไฟ") {
            workDesc += `หน้าที่การงานมีเกณฑ์เลื่อนขั้นปรับตำแหน่งอย่างโดดเด่น มีอำนาจในการสั่งการ ได้รับโปรเจกต์ใหญ่ที่ต้องใช้ความกล้าตัดสินใจ `;
        } else if (pDecha.element === "น้ำ") {
            workDesc += `งานเจรจา ประชาสัมพันธ์ การตลาด หรือการค้าต่างประเทศจะราบรื่น เข้าหาผู้ใหญ่ได้ง่าย ปัญหาที่ติดขัดจะได้รับการผ่อนปรน `;
        } else if (pDecha.element === "ลม") {
            workDesc += `มีเกณฑ์ปรับเปลี่ยนโยกย้าย ขยายสาขา หรือริเริ่มสิ่งใหม่ๆ ที่ต้องเดินทาง มีความกระตือรือร้นสูงในการบุกเบิก `;
        } else {
            workDesc += `เน้นการสร้างความมั่นคงระยะยาว วางระบบโครงสร้าง การทำงานหนักจะส่งผลตอบแทนเป็นรากฐานที่แข็งแกร่ง `;
        }
        workDesc += `มีดาว${pMontri.name} เป็นมนตรีจรคอยหนุนหลัง ทำให้ได้รับการช่วยเหลือจากผู้ใหญ่ เจ้านาย หรือมีที่ปรึกษาดีคอยชี้แนะ`;

        // ด้านการเงิน & โชคลาภ (ดูจาก ศรีจร, มูละจร)
        financeDesc = `การเงินในปีนี้ได้รับพลังเกื้อหนุนจาก <strong>ดาว${pSri.name} (ศรีจร)</strong> และ <strong>ดาว${pMula.name} (มูละจร)</strong> `;
        if (pSri.element === "ดิน" || pSri.name === "พฤหัสบดี" || pSri.name === "ศุกร์") {
            financeDesc += `จัดเป็นปีแห่งความมั่งคั่ง มีกระแสเงินสดและลาภผลไหลเข้ามาอย่างต่อเนื่อง การลงทุนมีกำไรงอกเงย มีเกณฑ์ได้ทรัพย์สินชิ้นใหญ่ อสังหาริมทรัพย์ หรือของมีค่า `;
        } else if (pSri.element === "ทอง" || pSri.name === "อาทิตย์") {
            financeDesc += `มีโชคลาภจากเกียรติยศและตำแหน่ง ได้รับเงินก้อนหรือโบนัสพิเศษจากการประมูล แข่งขัน หรือผลงานดีเด่น `;
        } else {
            financeDesc += `การเงินคล่องตัวดี ได้ผลประโยชน์จากสายสัมพันธ์ การหมุนเงิน หรือการต่อยอดธุรกิจเดิม `;
        }
        financeDesc += `ควบคู่กับมูละจร (${pMula.name}) ช่วยให้การสะสมทรัพย์สินมีความมั่นคงเป็นปึกแผ่น`;

        // ด้านความรัก & ความสัมพันธ์ (ดูจาก บริวารจร และภูมิเสวยอายุ)
        loveDesc = `ความสัมพันธ์ในปีนี้ ดาวเสวยอายุหลักตก <strong>ภูมิพระ${pMain.name} (บริวารจร)</strong> `;
        if (mainPlanetNum === 2 || mainPlanetNum === 6) {
            loveDesc += `คนโสดมีเสน่ห์โดดเด่น มีเกณฑ์พบรักหวานชื่น ได้เจอคู่แท้หรือกัลยาณมิตรที่เข้ามาเติมเต็มจิตใจ สำหรับคนมีคู่ ความรักอบอุ่น เข้าอกเข้าใจกันดี `;
        } else if (mainPlanetNum === 1 || mainPlanetNum === 3 || mainPlanetNum === 7) {
            loveDesc += `ความรักเน้นการร่วมมือกันสร้างฐานะ แต่อาจมีเรื่องให้ต้องปรับความเข้าใจจากความใจร้อนหรือภาระหน้าที่ที่หนักหน่วง ควรใช้เหตุผลมากกว่าอารมณ์ `;
        } else {
            loveDesc += `ความสัมพันธ์ดำเนินไปอย่างราบรื่น เพื่อนฝูงคนรอบข้างและครอบครัวคอยเกื้อหนุนช่วยเหลือซึ่งกันและกัน `;
        }

        // ด้านสุขภาพ & อุปสรรค (ดูจาก กาลกิณีจร และอายุจร)
        healthDesc = `เกณฑ์สุขภาพและเรื่องต้องระวัง เนื่องจากมี <strong>ดาว${pKala.name} เป็นกาลกิณีจร</strong> `;
        if (pKala.element === "ไฟ") {
            healthDesc += `ควรระวังเรื่องระบบทางเดินหายใจ ความดัน หัวใจ สายตา อาการร้อนใน และอุบัติเหตุจากการใช้ความเร็วหรือของร้อน ควรหลีกเลี่ยงการตัดสินใจด้วยความหุนหันพลันแล่น `;
        } else if (pKala.element === "น้ำ") {
            healthDesc += `ระวังเรื่องระบบทางเดินอาหาร ท้องไส้ ไต ต่อมน้ำเหลือง หรือภาวะอารมณ์แปรปรวน นอนไม่หลับ และระวังการไว้ใจคนผิดเรื่องเงินทอง `;
        } else if (pKala.element === "ลม") {
            healthDesc += `ระวังปัญหาเรื่องระบบประสาท ปวดไมเกรน กล้ามเนื้อ และการเดินทางที่มีความผกผัน ควรตรวจเช็กยานพาหนะและเอกสารสัญญาให้รอบคอบ `;
        } else {
            healthDesc += `ระวังปัญหากระดูก ข้อต่อ ปวดหลัง ปวดเมื่อยเรื้อรัง และความเครียดสะสม ควรพักผ่อนให้เพียงพอและออกกำลังกายสม่ำเสมอ `;
        }

        let summaryHTML = `
            <div style="margin-bottom:12px; font-size:1.02rem; line-height:1.8;">
                ในปีนี้ (อายุย่าง <strong>${targetAgeYang} ปี</strong> / พ.ศ. <strong>${calYearBE}</strong>) ดาวเสวยอายุหลักตก <strong>ภูมิพระ${pMain.name} (เลข ${pMain.thNum})</strong> ซึ่งเป็นประธานคุมชะตาชีวิตตลอดทั้งปี สรุปผลการพยากรณ์เจาะลึก 4 ด้านตามหลักมหาทักษาดังนี้:
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
                <div style="background:#eff6ff; padding:12px; border-radius:8px; border-left:4px solid #3b82f6;">
                    <div style="font-weight:bold; color:#1d4ed8; margin-bottom:4px;"><i class="fas fa-briefcase"></i> 1. ด้านการงานและหน้าที่:</div>
                    <div style="font-size:0.92rem; color:#1e293b; line-height:1.6;">${workDesc}</div>
                </div>
                <div style="background:#f0fdf4; padding:12px; border-radius:8px; border-left:4px solid #22c55e;">
                    <div style="font-weight:bold; color:#15803d; margin-bottom:4px;"><i class="fas fa-coins"></i> 2. ด้านการเงินและโชคลาภ:</div>
                    <div style="font-size:0.92rem; color:#1e293b; line-height:1.6;">${financeDesc}</div>
                </div>
                <div style="background:#fdf2f8; padding:12px; border-radius:8px; border-left:4px solid #ec4899;">
                    <div style="font-weight:bold; color:#be185d; margin-bottom:4px;"><i class="fas fa-heart"></i> 3. ด้านความรักและบริวาร:</div>
                    <div style="font-size:0.92rem; color:#1e293b; line-height:1.6;">${loveDesc}</div>
                </div>
                <div style="background:#fef2f2; padding:12px; border-radius:8px; border-left:4px solid #ef4444;">
                    <div style="font-weight:bold; color:#b91c1c; margin-bottom:4px;"><i class="fas fa-shield-alt"></i> 4. ข้อควรระวังและสุขภาพ:</div>
                    <div style="font-size:0.92rem; color:#1e293b; line-height:1.6;">${healthDesc}</div>
                </div>
            </div>
            <div style="background:#fffbeb; padding:12px 16px; border-radius:8px; border:1px solid #fde68a; font-size:0.95rem; color:#92400e; line-height:1.8;">
                💡 <strong>เคล็ดลับเสริมดวงประจำวัย ${targetAgeYang} ปี:</strong><br>
                ✨ <strong>สีมงคลเสริมโชคลาภ (ดาว${pSri.name}):</strong> <span style="display:inline-flex; align-items:center; gap:6px; background:#ffffff; padding:2px 8px; border-radius:6px; border:1px solid #cbd5e1; font-weight:600; color:#1e293b;"><span style="display:inline-block; width:14px; height:14px; background-color:${pSri.color}; border-radius:3px; border:1px solid rgba(0,0,0,0.15);"></span> ${pSri.colorName}</span> เพื่อดึงดูดพลังงานบวก ทรัพย์สิน และความสำเร็จ<br>
                ⚠️ <strong>สีกาลกิณีที่ควรหลีกเลี่ยง (ดาว${pKala.name}):</strong> <span style="display:inline-flex; align-items:center; gap:6px; background:#ffffff; padding:2px 8px; border-radius:6px; border:1px solid #cbd5e1; font-weight:600; color:#b91c1c;"><span style="display:inline-block; width:14px; height:14px; background-color:${pKala.color}; border-radius:3px; border:1px solid rgba(0,0,0,0.15);"></span> ${pKala.colorName}</span> พร้อมทั้งหมั่นทำบุญปล่อยนกปล่อยปลาหรือถวายสังฆทานเพื่อสะเดาะเคราะห์
            </div>
        `;

        return {
            ageYang: targetAgeYang,
            yearAD: calYearAD,
            yearBE: calYearBE,
            mainPlanet: pMain.name,
            sri: pSri.name,
            decha: pDecha.name,
            montri: pMontri.name,
            kala: pKala.name,
            text: summaryHTML,
            thaksaPositions: {
                boriwan: pMain.name,
                ayu: pAyu.name,
                decha: pDecha.name,
                sri: pSri.name,
                mula: pMula.name,
                utsa: pUtsa.name,
                montri: pMontri.name,
                kalakini: pKala.name
            }
        };
    }

    // คำทำนาย 12 เดือนที่แปรผันตามอายุย่างและทักษาจรของปีนั้นๆ ฉบับเจาะลึก 100%
    function calculateMonthlyPredictionsForYear(ascRasiIndex, birthPlanetNum, targetAgeYang) {
        const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const startIdx = THAKSA_ORDER.indexOf(birthPlanetNum);
        const jorIdx = (startIdx + ((targetAgeYang - 1) % 8)) % 8;
        const pNumSri = THAKSA_ORDER[(jorIdx + 3) % 8];
        const pNumKala = THAKSA_ORDER[(jorIdx + 7) % 8];
        const pNumDecha = THAKSA_ORDER[(jorIdx + 2) % 8];
        const pNumMontri = THAKSA_ORDER[(jorIdx + 6) % 8];

        const monthly = [];

        for (let m = 0; m < 12; m++) {
            const sunTransitRasi = (m + 9) % 12; // อาทิตย์จรตามเดือน
            const houseFromAsc = (sunTransitRasi - ascRasiIndex + 12) % 12;
            const houseInfo = HOUSES_12[houseFromAsc];
            const sign = ZODIAC_SIGNS[sunTransitRasi];
            const monthLord = sign.lord;

            let mText = `<div style="line-height:1.7;">`;
            mText += `พระอาทิตย์จรเข้าสู่ภพ <strong>${houseInfo.name}</strong> (ราศี${sign.th}) โดยมี <strong>ดาว${PLANET_DEFS[monthLord].name}</strong> เป็นดาวเจ้าเรือน: `;

            let specialBadge = "";

            if (monthLord === pNumSri) {
                specialBadge = `<span style="background:#16a34a; color:white; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px; margin-left:4px;">✨ เดือนศรีโชคลาภ</span>`;
                mText += `<br><strong style="color:#15803d;">🌟 จังหวะดวงดาว:</strong> ดาวเจ้าเรือนของเดือนนี้เป็น <strong>ศรีจรประจำปี</strong> ถือเป็น "ช่วงเวลาทอง" ที่ดีที่สุดในการลงทุน เจรจาค้าขาย ขอความช่วยเหลือ หรือเปิดตัวกิจการใหม่ มีเกณฑ์รับทรัพย์ก้อนใหญ่และได้รับความสำเร็จอย่างงดงาม`;
            } else if (monthLord === pNumKala) {
                specialBadge = `<span style="background:#dc2626; color:white; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px; margin-left:4px;">⚠️ เดือนระวังอุปสรรค</span>`;
                mText += `<br><strong style="color:#b91c1c;">⚠️ จังหวะดวงดาว:</strong> ดาวเจ้าเรือนของเดือนนี้เป็น <strong>กาลกิณีจรประจำปี</strong> ควรใช้ชีวิตด้วยความสุขุม ไม่ประมาท ชะลอการเซ็นสัญญาที่มีความเสี่ยง ระวังความขัดแย้งกับคนใกล้ชิด และดูแลสุขภาพเป็นพิเศษ`;
            } else if (monthLord === pNumDecha) {
                specialBadge = `<span style="background:#d97706; color:white; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px; margin-left:4px;">💪 เดือนเดชบารมี</span>`;
                mText += `<br><strong style="color:#b45309;">🌟 จังหวะดวงดาว:</strong> ดาวเจ้าเรือนเป็น <strong>เดชจร</strong> มีพลังอำนาจในการแข่งขัน ต่อรอง ชนะคู่แข่ง และได้รับการยอมรับในหน้าที่การงาน`;
            } else if (monthLord === pNumMontri) {
                specialBadge = `<span style="background:#4f46e5; color:white; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px; margin-left:4px;">💼 เดือนผู้ใหญ่อุปถัมภ์</span>`;
                mText += `<br><strong style="color:#4338ca;">🌟 จังหวะดวงดาว:</strong> ดาวเจ้าเรือนเป็น <strong>มนตรีจร</strong> ได้รับความเมตตาจากผู้ใหญ่ ครูบาอาจารย์ หรือผู้บังคับบัญชา เหมาะแก่การนำเสนอผลงาน`;
            } else {
                if (houseInfo.name === "ตนุ" || houseInfo.name === "ลาภะ" || houseInfo.name === "ศุภะ") {
                    mText += `<br><strong style="color:#0284c7;">🌟 จังหวะดวงดาว:</strong> โคจรเข้าสู่ภพมงคลหลัก ทำให้จิตใจสดชื่น มีพลังชีวิตสูง มีโอกาสดีๆ และเกียรติยศชื่อเสียงเข้ามา`;
                } else if (houseInfo.name === "กดุมภะ" || houseInfo.name === "กัมมะ") {
                    mText += `<br><strong style="color:#0284c7;">🌟 จังหวะดวงดาว:</strong> โฟกัสหนักแน่นเรื่องการทำงานและการสร้างรายได้ มีเกณฑ์ปิดดีล เจรจาการเงิน หรือขยายสาขา`;
                } else if (houseInfo.name === "ปุตตะ" || houseInfo.name === "ปัตนิ" || houseInfo.name === "สหัชชะ") {
                    mText += `<br><strong style="color:#0284c7;">🌟 จังหวะดวงดาว:</strong> โดดเด่นเรื่องคนรัก หุ้นส่วน มิตรสหาย และโครงการใหม่ๆ มีโอกาสเดินทางไกลหรือทำกิจกรรมร่วมกับสังคม`;
                } else {
                    mText += `<br><strong style="color:#64748b;">🌟 จังหวะดวงดาว:</strong> ดาวจรเข้าสู่ภพเกณฑ์ระวังเรื่อง ${houseInfo.meaning} แนะนำให้หมั่นสร้างบุญบารมี บริจาคทาน และปล่อยปลา`;
                }
            }

            mText += `</div>`;

            monthly.push({
                monthIndex: m + 1,
                monthName: monthsThai[m],
                houseName: houseInfo.name,
                rasiName: sign.th,
                specialBadge: specialBadge,
                text: mText
            });
        }
        return monthly;
    }

    // 🌟 คำนวณพยากรณ์ดวงวันจร (Daily Horoscope & Transit) ตามตำราโหร 100%
    function calculateDailyPrediction(ascRasiIndex, birthPlanetNum, targetDateObj) {
        const targetDate = new Date(targetDateObj);
        const dayOfWeek = targetDate.getDay(); // 0=อาทิตย์, 1=จันทร์...
        const dayPlanets = [1, 2, 3, 4, 5, 6, 7]; // ดาวประจำวัน
        const currentDayPlanet = dayPlanets[dayOfWeek];

        // 1. ทักษาจรรายวัน (Daily Thaksa)
        const startIdx = THAKSA_ORDER.indexOf(birthPlanetNum);
        const currentDayThaksaIdx = THAKSA_ORDER.indexOf(currentDayPlanet);
        const dayThaksaDiff = (currentDayThaksaIdx - startIdx + 8) % 8;
        const dayThaksaName = THAKSA_NAMES[dayThaksaDiff];

        const daySriLord = THAKSA_ORDER[(currentDayThaksaIdx + 3) % 8];
        const dayDechaLord = THAKSA_ORDER[(currentDayThaksaIdx + 2) % 8];
        const dayMontriLord = THAKSA_ORDER[(currentDayThaksaIdx + 6) % 8];
        const dayKalaLord = THAKSA_ORDER[(currentDayThaksaIdx + 7) % 8];

        const pDaySri = PLANET_DEFS[daySriLord];
        const pDayDecha = PLANET_DEFS[dayDechaLord];
        const pDayMontri = PLANET_DEFS[dayMontriLord];
        const pDayKala = PLANET_DEFS[dayKalaLord];

        // 2. ตำแหน่งดาวจรประจำวัน (คำนวณจริง)
        const dailyPlanets = calculatePlanets(targetDate, true);
        const moonTransit = dailyPlanets[2];
        const moonHouseIdx = (moonTransit.rasi - ascRasiIndex + 12) % 12;
        const moonHouseInfo = HOUSES_12[moonHouseIdx];
        const moonSign = ZODIAC_SIGNS[moonTransit.rasi];

        // 3. วิเคราะห์พระจันทร์เสวยภพ (Moon Transit House Interpretation)
        let moonInfluenceText = "";
        let dailyHighlight = "";
        let dailyTone = "normal";

        if (moonHouseInfo.name === "ลาภะ") {
            dailyHighlight = "✨ วันแห่งโชคลาภและการเงินคล่องตัว";
            dailyTone = "success";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>ลาภะ (ราศี${moonSign.th})</strong> เป็นวันที่ดวงการเงินเปิดกว้าง มีเกณฑ์ได้รับลาภลอย ได้ของขวัญ ของฝาก หรือได้รับข่าวดีเรื่องผลประโยชน์ การลงทุนและการเจรจาค้าขายในวันนี้จะให้ผลตอบแทนงดงาม`;
        } else if (moonHouseInfo.name === "กดุมภะ") {
            dailyHighlight = "💰 วันแห่งการหมุนเวียนทรัพย์และการรับเงิน";
            dailyTone = "success";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>กดุมภะ (ราศี${moonSign.th})</strong> โดดเด่นเรื่องสภาพคล่อง มีเงินทองหมุนเวียนเข้ามา เหมาะแก่การทวงหนี้ เจรจาเรื่องค่าตอบแทน หรือปิดการขาย`;
        } else if (moonHouseInfo.name === "ตนุ") {
            dailyHighlight = "👑 วันแห่งพลังกายพลังใจและความเป็นผู้นำ";
            dailyTone = "success";
            moonInfluenceText = `พระจันทร์ (๒) โคจรทับลัคน์ในภพ <strong>ตนุ (ราศี${moonSign.th})</strong> จิตใจสดชื่น มีเสน่ห์ เมตตามหานิยมสูง เป็นจุดศูนย์กลางของความสนใจ เหมาะกับการเริ่มต้นสิ่งใหม่ๆ หรือการออกงานสังคม`;
        } else if (moonHouseInfo.name === "กัมมะ") {
            dailyHighlight = "💼 วันแห่งการสร้างผลงานและความสำเร็จในหน้าที่";
            dailyTone = "info";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>กัมมะ (ราศี${moonSign.th})</strong> โฟกัสเรื่องงานเต็มที่ มีความรับผิดชอบสูง งานที่ต้องติดต่อประสานงานจะสำเร็จราบรื่น ผู้ใหญ่และเพื่อนร่วมงานให้การยอมรับ`;
        } else if (moonHouseInfo.name === "ศุภะ") {
            dailyHighlight = "🌟 วันแห่งความสุข ความเจริญ และความสบายใจ";
            dailyTone = "success";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>ศุภะ (ราศี${moonSign.th})</strong> มีผู้ใหญ่อุปถัมภ์ จิตใจสงบ เหมาะแก่การทำบุญ ไหว้พระ ขอพร หรือศึกษาหาความรู้ใหม่ๆ การเดินทางไกลราบรื่นปลอดภัย`;
        } else if (moonHouseInfo.name === "ปัตนิ") {
            dailyHighlight = "💖 วันแห่งมิตรภาพ หุ้นส่วน และความรัก";
            dailyTone = "info";
            moonInfluenceText = `พระจันทร์ (๒) เล็งลัคนาในภพ <strong>ปัตนิ (ราศี${moonSign.th})</strong> โดดเด่นเรื่องคนรัก คู่ครอง และคู่สัญญา การเจรจากับหุ้นส่วนหรือการนัดหมายสำคัญจะดำเนินไปด้วยดี มีเกณฑ์ได้ของถูกใจจากคนรัก`;
        } else if (moonHouseInfo.name === "ปุตตะ") {
            dailyHighlight = "🎨 วันแห่งความคิดสร้างสรรค์และสิ่งใหม่ๆ";
            dailyTone = "info";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>ปุตตะ (ราศี${moonSign.th})</strong> สมองปลอดโปร่ง มีไอเดียริเริ่มสิ่งใหม่ๆ บริวารและคนอายุน้อยกว่าให้ความร่วมมือดี เหมาะแก่การทำงานสร้างสรรค์`;
        } else if (moonHouseInfo.name === "สหัชชะ") {
            dailyHighlight = "🤝 วันแห่งการพบปะ เจรจา และเดินทางใกล้";
            dailyTone = "info";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>สหัชชะ (ราศี${moonSign.th})</strong> มีการติดต่อสื่อสารกับผู้คนมากหน้าหลายตา เพื่อนฝูงนัดพบปะสังสรรค์ การเดินทางระยะใกล้ราบรื่น`;
        } else if (moonHouseInfo.name === "อริ") {
            dailyHighlight = "⚠️ วันที่ต้องใช้ความอดทนและระวังความขัดแย้ง";
            dailyTone = "warning";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>อริ (ราศี${moonSign.th})</strong> อาจมีเรื่องจุกจิกกวนใจ มีอุปสรรคให้ต้องแก้ไข หรือมีคนทำให้หงุดหงิด ควรใจเย็น ไม่ควรปะทะอารมณ์ และระวังปัญหาสุขภาพเกี่ยวกับช่องท้อง`;
        } else if (moonHouseInfo.name === "มรณะ") {
            dailyHighlight = "🛡️ วันที่ควรอยู่อย่างสงบและดูแลสุขภาพ";
            dailyTone = "warning";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>มรณะ (ราศี${moonSign.th})</strong> ร่างกายอาจอ่อนเพลีย รู้สึกเหนื่อยล้าได้ง่าย ควรพักผ่อนให้เพียงพอ หลีกเลี่ยงการทำกิจกรรมเสี่ยง และหมั่นสวดมนต์แผ่เมตตา`;
        } else {
            dailyHighlight = "🔒 วันที่เหมาะกับการทำงานเบื้องหลังและวางแผนเงียบๆ";
            dailyTone = "warning";
            moonInfluenceText = `พระจันทร์ (๒) เสวยภพ <strong>วินาศ (ราศี${moonSign.th})</strong> ควรทำงานอยู่เบื้องหลัง ปิดทองหลังพระ หลีกเลี่ยงการเปิดเผยความลับหรือการออกหน้าเกินไป ระวังของหายหรือการสื่อสารคลาดเคลื่อน`;
        }

        // 4. คำแนะนำทักษาจรรายวัน
        let dailyThaksaDesc = `วันนี้เป็นภูมิ <strong>${dayThaksaName}</strong> ของเจ้าชะตา `;
        dailyThaksaDesc += `มี <strong>ดาว${pDaySri.name} เป็นศรีจรประจำวัน</strong>, <strong>ดาว${pDayDecha.name} เป็นเดชจร</strong>, และมี <strong>ดาว${pDayKala.name} เป็นกาลกิณีจรประจำวัน</strong>`;

        const dayNamesThai = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const dateDisplay = `${dayNamesThai[dayOfWeek]}ที่ ${targetDate.getDate()} ${monthsThai[targetDate.getMonth()]} พ.ศ. ${targetDate.getFullYear() + 543}`;

        return {
            targetDate: targetDate,
            dateDisplay: dateDisplay,
            dayName: dayNamesThai[dayOfWeek],
            dayPlanet: PLANET_DEFS[currentDayPlanet].name,
            dayThaksaName: dayThaksaName,
            dailyHighlight: dailyHighlight,
            dailyTone: dailyTone,
            moonRasi: moonSign.th,
            moonHouse: moonHouseInfo.name,
            moonInfluenceText: moonInfluenceText,
            dailyThaksaDesc: dailyThaksaDesc,
            sri: pDaySri,
            decha: pDayDecha,
            montri: pDayMontri,
            kala: pDayKala
        };
    }

    // 🌟 คำนวณภาพรวมดวงรายวันสาธารณะ (12 ราศี, 7 วันเกิด, 12 นักษัตร) ตามตำแหน่งดาวจรจริง
    function calculatePublicDailyOverview(targetDateObj) {
        const targetDate = new Date(targetDateObj);
        const dayOfWeek = targetDate.getDay();
        const dayPlanets = [1, 2, 3, 4, 5, 6, 7];
        const currentDayPlanet = dayPlanets[dayOfWeek];
        const dayNamesThai = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const dateDisplay = `${dayNamesThai[dayOfWeek]}ที่ ${targetDate.getDate()} ${monthsThai[targetDate.getMonth()]} พ.ศ. ${targetDate.getFullYear() + 543}`;

        const transits = calculatePlanets(targetDate, true);
        const moon = transits[2];
        const sun = transits[1];
        const jupiter = transits[5];
        const saturn = transits[7];
        const venus = transits[6];

        // 1. ดวง 12 ราศีประจำวัน (วิเคราะห์ตามดาวเจ้าเรือน + ดาวจันทร์จร + ภพสัมพันธ์ ละเอียด 4 มิติ)
        const zodiacReadings = ZODIAC_SIGNS.map((sign, idx) => {
            const moonInHouse = (moon.rasi - idx + 12) % 12;
            const moonHouseName = HOUSES_12[moonInHouse].name;
            const signLord = PLANET_DEFS[sign.lord];

            let score = 3;
            let tag = "";
            let workText = "";
            let moneyText = "";
            let loveText = "";
            let healthText = "";

            if (moonInHouse === 10) { // ลาภะ
                score = 5;
                tag = "💰 การเงินและโชคลาภเด่นสุด (5/5 ดาว)";
                workText = `ดาวจันทร์เสวยภพลาภะ การงานติดต่อราบรื่น ปิดการขายหรือทำสัญญาร่วมทุนได้ผลตอบแทนยอดเยี่ยม มีโปรเจกต์ใหม่ให้รับผิดชอบ`;
                moneyText = `มีเกณฑ์รับทรัพย์ก้อนโต มีโชคลาภลอย หรือได้รับเงินตกเบิก/ค่าคอมมิชชัน เป็นจังหวะดีในการเสี่ยงโชคและลงทุนระยะสั้น`;
                loveText = `คนโสดมีเกณฑ์พบคนถูกใจจากแวดวงการทำงานหรือเพื่อนฝูงแนะนำ คนมีคู่คนรักนำพาข่าวดีเรื่องเงินทองและความสุขมาให้`;
                healthText = `สุขภาพแข็งแรงดี แนะนำทำบุญค่าน้ำค่าไฟหรือบริจาคทานเพื่อเปิดทางทรัพย์ให้ไหลมาเทมา`;
            } else if (moonInHouse === 1) { // กดุมภะ
                score = 5;
                tag = "💎 สภาพคล่องหมุนเวียนยอดเยี่ยม (5/5 ดาว)";
                workText = `งานที่เกี่ยวกับการเงิน บัญชี การซื้อขายอสังหาริมทรัพย์และสินค้ามูลค่าสูงจะคึกคักเป็นพิเศษ ได้รับความไว้วางใจจากลูกค้า`;
                moneyText = `รายได้เข้ามาหลายช่องทาง เงินทองไม่ขาดมือ มีสภาพคล่องสูง หากคิดจะทวงหนี้หรือขอกู้ยืมวันนี้มีโอกาสสำเร็จสูง`;
                loveText = `ความรักมั่นคง มีการวางแผนใช้จ่ายและสร้างอนาคตร่วมกัน คนโสดอาจมีคนฐานะดีเข้ามาทำความรู้จัก`;
                healthText = `ระวังอาการเจ็บคอหรือช่องปากเล็กน้อย หมั่นดื่มน้ำมากๆ และทำบุญเกี่ยวกับอาหารเพื่อเสริมความอุดมสมบูรณ์`;
            } else if (moonInHouse === 0) { // ตนุ
                score = 5;
                tag = "👑 มีเสน่ห์ ผู้นำ โดดเด่นเป็นที่ยอมรับ (5/5 ดาว)";
                workText = `จันทร์ทับลัคน์ บุคลิกโดดเด่น มีเสน่ห์ทางวาจา มีความเป็นผู้นำในการตัดสินใจ เพื่อนร่วมงานพร้อมให้ความร่วมมือ`;
                moneyText = `การเงินมาจากความสามารถและน้ำพักน้ำแรง มีเกณฑ์ได้ของขวัญของฝาก หรือได้โชคจากคนอายุน้อยกว่า`;
                loveText = `เสน่ห์แรงเป็นพิเศษ มีคนแอบมองหรือเข้ามาทักทาย คนมีคู่หวานชื่น คนรักคอยเอาอกเอาใจเป็นพิเศษ`;
                healthText = `สดชื่นกระปรี้กระเปร่า ระวังเรื่องอารมณ์ที่อาจอ่อนไหวง่ายตามอิทธิพลของพระจันทร์`;
            } else if (moonInHouse === 9) { // กัมมะ
                score = 4;
                tag = "💼 ผลงานเด่น ผู้ใหญ่เมตตา (4/5 ดาว)";
                workText = `งานก้าวหน้า ได้รับมอบหมายงานสำคัญ ผู้ใหญ่และผู้บังคับบัญชาชื่นชมผลงาน เหมาะแก่การยื่นข้อเสนอหรือสัมภาษณ์งาน`;
                moneyText = `การเงินมั่นคง มีเกณฑ์ได้รับข่าวดีเรื่องการปรับเงินเดือน โบนัส หรือได้รับผลประโยชน์จากหน้าที่การงาน`;
                loveText = `คนโสดอาจพบรักในที่ทำงาน หรือได้ร่วมงานกับคนที่มีรสนิยมตรงกัน คนมีคู่อาจไม่มีเวลาให้กันมากนักแต่เข้าใจกันดี`;
                healthText = `ระวังอาการปวดเมื่อยบ่า ไหล่ หรือหลังจากการนั่งทำงานนาน ควรยืดเหยียดกล้ามเนื้อ`;
            } else if (moonInHouse === 8) { // ศุภะ
                score = 4;
                tag = "🌟 ความสุข ความสำเร็จ และการเดินทาง (4/5 ดาว)";
                workText = `การงานต่างประเทศ การเดินทางไกล หรือการศึกษาต่อมีความราบรื่น ได้รับคำแนะนำและกำลังใจที่ดีจากผู้ใหญ่`;
                moneyText = `การเงินคล่องตัว ได้รับความช่วยเหลือทางการเงินจากผู้ใหญ่ในบ้านหรือคนใกล้ชิด`;
                loveText = `ความรักอบอุ่น มีเกณฑ์ได้เดินทางท่องเที่ยวทำบุญร่วมกัน คนโสดมีโอกาสพบรักกับคนต่างถิ่นต่างภาษา`;
                healthText = `ร่างกายสมบูรณ์ จิตใจผ่องใส เหมาะแก่การสวดมนต์ไหว้พระ ไหว้สิ่งศักดิ์สิทธิ์ประจำบ้าน`;
            } else if (moonInHouse === 6) { // ปัตนิ
                score = 4;
                tag = "💖 หุ้นส่วนก้าวหน้า ความรักหวานชื่น (4/5 ดาว)";
                workText = `งานที่ต้องทำร่วมกับหุ้นส่วน คู่ค้า หรือตัวแทนจะราบรื่น การเจรจาต่อรองได้ข้อตกลงที่พึงพอใจทั้งสองฝ่าย`;
                moneyText = `เงินทองมีเข้ามีออกจากการทำสัญญาร่วมทุน ได้รับผลกำไรจากการแบ่งปันผลประโยชน์`;
                loveText = `ความรักหวานชื่น เข้าอกเข้าใจกันดี คนโสดมีเกณฑ์พบรักแท้หรือคนที่พร้อมจะจริงจังในอนาคต`;
                healthText = `ระวังระบบไตและทางเดินปัสสาวะ ดื่มน้ำสะอาดให้เพียงพอ`;
            } else if (moonInHouse === 4) { // ปุตตะ
                score = 4;
                tag = "🎨 ไอเดียสร้างสรรค์ บริวารช่วยเหลือ (4/5 ดาว)";
                workText = `สมองแล่น มีความคิดสร้างสรรค์ โปรเจกต์ใหม่ๆ เริ่มเป็นรูปเป็นร่าง บริวารและทีมงานช่วยเหลือเต็มที่`;
                moneyText = `มีโชคเล็กๆ น้อยๆ จากการเสี่ยงโชค หรือได้กำไรจากการลงทุนในธุรกิจใหม่`;
                loveText = `คนโสดมีเกณฑ์พบคนอายุน้อยกว่าแต่มีเสน่ห์ คนมีคู่ความรักสดใส มีบรรยากาศเหมือนตอนจีบกันใหม่ๆ`;
                healthText = `สุขภาพแข็งแรงดี ระวังอาการบาดเจ็บจากการเล่นกีฬาหรือออกกำลังกายเล็กน้อย`;
            } else if (moonInHouse === 2) { // สหัชชะ
                score = 3;
                tag = "🤝 มิตรภาพและการติดต่อสื่อสาร (3/5 ดาว)";
                workText = `การสื่อสาร การตลาด ประชาสัมพันธ์ และงานเอกสารต้องตรวจเช็กให้รอบคอบ เพื่อนร่วมงานช่วยประสานงานได้ดี`;
                moneyText = `มีรายจ่ายเกี่ยวกับการเดินทาง การเข้าสังคม หรือสังสรรค์กับเพื่อนฝูง แต่ไม่เดือดร้อน`;
                loveText = `คนโสดอาจพัฒนาความสัมพันธ์จากเพื่อนมาเป็นคนรู้ใจ คนมีคู่หมั่นพูดจาหวานหูจะช่วยเติมเต็มความสุข`;
                healthText = `ระวังระบบทางเดินหายใจ หลีกเลี่ยงฝุ่นควันและอากาศเปลี่ยนแปลง`;
            } else if (moonInHouse === 3) { // พันธุ
                score = 3;
                tag = "🏡 มั่นคง อบอุ่นในครอบครัว (3/5 ดาว)";
                workText = `งานประจำดำเนินไปอย่างมั่นคง งานเกี่ยวกับที่ดิน อสังหาริมทรัพย์ หรือของแต่งบ้านจะโดดเด่น`;
                moneyText = `มีเกณฑ์ใช้จ่ายเพื่อซ่อมแซมบ้าน ซื้อของเข้าบ้าน หรือดูแลคนในครอบครัว`;
                loveText = `ครอบครัวมีความอบอุ่น คนรักให้ความสำคัญกับเรื่องในบ้าน คนโสดผู้ใหญ่ในบ้านอาจแนะนำคนดีๆ ให้รู้จัก`;
                healthText = `ระวังกรดไหลย้อนหรืออาการแน่นท้อง ควรทานอาหารให้ตรงเวลา`;
            } else if (moonInHouse === 5) { // อริ
                score = 2;
                tag = "⚠️ ระวังการปะทะและงานแก้ไข (2/5 ดาว)";
                workText = `มีปัญหาจุกจิกเข้ามาให้คอยแก้ มีความเห็นไม่ตรงกันในที่ทำงาน ต้องใช้ความอดทนและเหตุผลเป็นหลัก`;
                moneyText = `ระวังรายจ่ายฉุกเฉิน ค่าซ่อมแซมสิ่งของ หรือมีคนมาหยิบยืมเงิน ชะลอการลงทุนใหญ่`;
                loveText = `ระวังคำพูดประชดประชันหรือการขุดเรื่องเก่ามาทะเลาะกัน ควรนิ่งสงบและรับฟัง`;
                healthText = `ระวังระบบทางเดินอาหาร ท้องเสีย ปวดท้อง แนะนำทำบุญปล่อยปลาสะเดาะเคราะห์`;
            } else if (moonInHouse === 7) { // มรณะ
                score = 2;
                tag = "🛡️ พักผ่อนและดูแลสุขภาพ (2/5 ดาว)";
                workText = `รู้สึกหมดไฟหรือเหนื่อยล้ากับภาระงาน งานอาจมีความล่าช้า ควรจัดลำดับความสำคัญและไม่หักโหม`;
                moneyText = `ระวังของมีค่าสูญหายหรือการเสียเงินไปกับค่ารักษาพยาบาล จัดการบัญชีอย่างรัดกุม`;
                loveText = `อาจมีความรู้สึกเหงาหรือไม่เข้าใจกัน ให้เวลาส่วนตัวแก่กันและกัน`;
                healthText = `ระวังอุบัติเหตุจากการเดินทาง ร่างกายอ่อนเพลีย แนะนำทำบุญบริจาคโลงศพหรือช่วยเหลือผู้ยากไร้`;
            } else { // วินาศ
                score = 2;
                tag = "🔒 ทำงานเบื้องหลังและตั้งสติ (2/5 ดาว)";
                workText = `เหมาะแก่การวางแผนลับๆ ทำงานอยู่เบื้องหลัง ปิดทองหลังพระ ไม่ควรออกหน้าหรือเสนอตัวเกินไป`;
                moneyText = `มีรายจ่ายที่ไม่คาดคิด ควรระวังการถูกเอาเปรียบเรื่องสัญญาหรือการเงิน`;
                loveText = `ระวังความเข้าใจผิดจากบุคคลที่สาม หรือความลับบางอย่างถูกเปิดเผย`;
                healthText = `ระวังการนอนไม่หลับ ปวดหัว ไมเกรน แนะนำสวดมนต์ นั่งสมาธิ แผ่เมตตาก่อนนอน`;
            }

            return {
                id: sign.id,
                name: sign.th,
                symbol: sign.symbol,
                element: sign.element,
                score: score,
                tag: tag,
                work: workText,
                money: moneyText,
                love: loveText,
                health: healthText,
                moonHouse: moonHouseName
            };
        });

        // 2. ดวง 7 วันเกิดประจำวัน (วิเคราะห์ตามทักษาคู่ธาตุและคู่สมพล ละเอียด 4 มิติ)
        const daysOfWeekList = [
            { dayIdx: 0, name: "คนเกิดวันอาทิตย์", birthNum: 1, color: "#e74c3c" },
            { dayIdx: 1, name: "คนเกิดวันจันทร์", birthNum: 2, color: "#f1c40f" },
            { dayIdx: 2, name: "คนเกิดวันอังคาร", birthNum: 3, color: "#e91e63" },
            { dayIdx: 3, name: "คนเกิดวันพุธ (กลางวัน)", birthNum: 4, color: "#2ecc71" },
            { dayIdx: 4, name: "คนเกิดวันพฤหัสบดี", birthNum: 5, color: "#e67e22" },
            { dayIdx: 5, name: "คนเกิดวันศุกร์", birthNum: 6, color: "#3498db" },
            { dayIdx: 6, name: "คนเกิดวันเสาร์", birthNum: 7, color: "#795548" }
        ];

        const dayBornReadings = daysOfWeekList.map(item => {
            const startIdx = THAKSA_ORDER.indexOf(item.birthNum);
            const currentDayIdx = THAKSA_ORDER.indexOf(currentDayPlanet);
            const diff = (currentDayIdx - startIdx + 8) % 8;
            const thaksaName = THAKSA_NAMES[diff];

            const sriLord = THAKSA_ORDER[(currentDayIdx + 3) % 8];
            const dechaLord = THAKSA_ORDER[(currentDayIdx + 2) % 8];
            const montriLord = THAKSA_ORDER[(currentDayIdx + 6) % 8];
            const kalaLord = THAKSA_ORDER[(currentDayIdx + 7) % 8];

            const pSri = PLANET_DEFS[sriLord];
            const pDecha = PLANET_DEFS[dechaLord];
            const pMontri = PLANET_DEFS[montriLord];
            const pKala = PLANET_DEFS[kalaLord];

            let badge = "";
            let overallDesc = "";
            let careerTip = "";
            let moneyTip = "";
            let cautionTip = "";

            if (thaksaName === "ศรี" || thaksaName === "มูละ") {
                badge = "✨ วันมหาโชค & รับทรัพย์";
                overallDesc = `วันนี้ดวงชะตาโคจรตกภูมิ${thaksaName} พลังงานด้านการเงินและโชคลาภเปิดกว้างอย่างสูงสุด ทำอะไรก็มีคนหยิบยื่นโอกาสดีๆ ให้`;
                careerTip = `เหมาะเจรจาต่อรอง ปิดการขาย นำเสนอโปรเจกต์ใหม่ มีเกณฑ์ประสบความสำเร็จอย่างงดงาม`;
                moneyTip = `โชคลาภโดดเด่น มีเกณฑ์รับทรัพย์ เงินทองไหลเวียนคล่องตัว`;
                cautionTip = `ระวังการใช้จ่ายตามใจตัวเองจนลืมเก็บออม`;
            } else if (thaksaName === "เดช" || thaksaName === "มนตรี") {
                badge = "💪 วันอำนาจบารมี & ผู้ใหญ่อุปถัมภ์";
                overallDesc = `วันนี้ดวงตกภูมิ${thaksaName} มีพลังในการตัดสินใจ วาจามีน้ำหนักน่าเชื่อถือ ผู้หลักผู้ใหญ่และเจ้านายให้ความไว้วางใจ`;
                careerTip = `โดดเด่นในการเป็นผู้นำ ควบคุมทีมงาน หรือการสอบแข่งขัน สัมภาษณ์งาน`;
                moneyTip = `รายได้มาจากการทำงานและความสามารถ มีเกณฑ์ได้โบนัสหรือเงินรางวัลพิเศษ`;
                cautionTip = `อย่าใจร้อนหรือใช้อารมณ์ข่มผู้อื่น ให้ใช้ความเมตตานำทาง`;
            } else if (thaksaName === "กาลกิณี") {
                badge = "⚠️ วันตั้งสติ & ชะลอความเสี่ยง";
                overallDesc = `วันนี้ดวงตกภูมิกาลกิณี อาจมีเรื่องจุกจิกเข้ามาทดสอบอารมณ์ หรือการสื่อสารคลาดเคลื่อนได้ง่าย`;
                careerTip = `ควรตรวจทานเอกสาร สัญญา และตัวเลขให้รอบคอบสองเท่า หลีกเลี่ยงการปะทะ`;
                moneyTip = `ชะลอการลงทุนที่มีความเสี่ยงสูง งดการให้หยิบยืมเงินหรือค้ำประกัน`;
                cautionTip = `ระวังสุขภาพและอุบัติเหตุจากการเดินทาง หลีกเลี่ยงการใช้สีกาลกิณี`;
            } else {
                badge = "🌱 วันราบรื่น & ก้าวหน้ามั่นคง";
                overallDesc = `วันนี้ดวงตกภูมิ${thaksaName} จิตใจสงบ มีสมาธิในการคิดอ่านและวางแผนระยะยาว`;
                careerTip = `ทำงานตามขั้นตอนได้อย่างราบรื่น เพื่อนร่วมงานให้ความร่วมมือดี`;
                moneyTip = `การเงินมีความมั่นคง รายรับรายจ่ายสมดุล`;
                cautionTip = `หมั่นเติมพลังบวกและดูแลสุขภาพการนอนหลับให้เพียงพอ`;
            }

            return {
                ...item,
                thaksaName: thaksaName,
                badge: badge,
                overallDesc: overallDesc,
                careerTip: careerTip,
                moneyTip: moneyTip,
                cautionTip: cautionTip,
                sriColor: pSri.colorName,
                sriHex: pSri.color,
                dechaColor: pDecha.colorName,
                dechaHex: pDecha.color,
                kalaColor: pKala.colorName,
                kalaHex: pKala.color
            };
        });

        // 3. ดวง 12 นักษัตรประจำวัน (คำนวณตามหลักฮะ (สมพงษ์คู่มิตร), ซาฮะ (ไตรภาคี), ชง (ปะทะ), และธาตุประจำปีเกิด ไม่ซ้ำกัน 100%)
        const zodiacAnimals = [
            { id: 0, name: "ปีชวด (หนู)", element: "น้ำ", friendWith: 1, trine: [4, 8], clashWith: 6, character: "ความฉลาด คล่องแคล่ว มีไหวพริบ" },
            { id: 1, name: "ปีฉลู (วัว)", element: "ดิน", friendWith: 0, trine: [5, 9], clashWith: 7, character: "ความอดทน สุขุม หนักแน่น" },
            { id: 2, name: "ปีขาล (เสือ)", element: "ไม้", friendWith: 11, trine: [6, 10], clashWith: 8, character: "ความกล้าหาญ เป็นผู้นำ เด็ดเดี่ยว" },
            { id: 3, name: "ปีเถาะ (กระต่าย)", element: "ไม้", friendWith: 10, trine: [7, 11], clashWith: 9, character: "ความอ่อนโยน มีเสน่ห์ เมตตา" },
            { id: 4, name: "ปีมะโรง (มังกร)", element: "ดิน", friendWith: 9, trine: [0, 8], clashWith: 10, character: "อำนาจบารมี ความคิดก้าวไกล" },
            { id: 5, name: "ปีมะเส็ง (งูเล็ก)", element: "ไฟ", friendWith: 8, trine: [1, 9], clashWith: 11, character: "ความรอบคอบ สัญชาตญาณแม่นยำ" },
            { id: 6, name: "ปีมะเมีย (ม้า)", element: "ไฟ", friendWith: 7, trine: [2, 10], clashWith: 0, character: "ความกระตือรือร้น ชอบอิสระ" },
            { id: 7, name: "ปีมะแม (แพะ)", element: "ดิน", friendWith: 6, trine: [3, 11], clashWith: 1, character: "ความประนีประนอม ศิลปะและรสนิยม" },
            { id: 8, name: "ปีวอก (ลิง)", element: "ทอง", friendWith: 5, trine: [0, 4], clashWith: 2, character: "การพลิกแพลง ไหวพริบปฏิภาณ" },
            { id: 9, name: "ปีระกา (ไก่)", element: "ทอง", friendWith: 4, trine: [1, 5], clashWith: 3, character: "ความละเอียด รอบคอบ เจ้าระเบียบ" },
            { id: 10, name: "ปีจอ (หมา)", element: "ดิน", friendWith: 3, trine: [2, 6], clashWith: 4, character: "ความซื่อสัตย์ กตัญญู มีคุณธรรม" },
            { id: 11, name: "ปีกุน (หมู)", element: "น้ำ", friendWith: 2, trine: [3, 7], clashWith: 5, character: "ความโอบอ้อมอารี ความสุขสบาย" }
        ];

        // วันนี้สัมพันธ์กับนักษัตรใด (อิงจากราศีของพระจันทร์จร)
        const todayAnimalIdx = moon.rasi;
        const animalReadings = zodiacAnimals.map(animal => {
            let status = "🌱 วันราบรื่นเกื้อกูล";
            let statusStyle = "background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0;";
            let desc = "";
            let luckTip = "";

            if (animal.id === todayAnimalIdx) {
                status = "👑 นักษัตรครองวัน (วันทองคำ)";
                statusStyle = "background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-weight:bold;";
                desc = `พลังประจำปีเกิดเปล่งประกาย โดดเด่นด้วย${animal.character} มีโอกาสทองในการริเริ่มกิจการใหม่ หรือแสดงศักยภาพให้ผู้ใหญ่เห็น`;
                luckTip = `ทำบุญเติมน้ำมันตะเกียงเพื่อเสริมแสงสว่างและชื่อเสียง`;
            } else if (animal.clashWith === todayAnimalIdx) {
                status = "⚡ วันปะทะ (ชงประจำวัน)";
                statusStyle = "background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; font-weight:bold;";
                desc = `ต้องใช้ความสุขุม ระวังการมีปากเสียงกับคนรอบข้าง และหลีกเลี่ยงการตัดสินใจเรื่องเงินก้อนใหญ่ในวันนี้`;
                luckTip = `สวดมนต์บทกรณียเมตตสูตร แผ่เมตตา หรือปล่อยปลาสะเดาะเคราะห์`;
            } else if (animal.friendWith === todayAnimalIdx) {
                status = "🤝 วันคู่มิตร (ลักฮะ)";
                statusStyle = "background:#fdf4ff; color:#a21caf; border:1px solid #f5d0fe; font-weight:bold;";
                desc = `มีแรงหนุนจากกัลยาณมิตร การเจรจาติดต่อราบรื่น มีคนนำพาโชคลาภหรือผลประโยชน์มาให้ถึงที่`;
                luckTip = `ชวนเพื่อนฝูงหรือคู่ครองไปทานของอร่อยร่วมกันเพื่อเปิดโชค`;
            } else if (animal.trine.includes(todayAnimalIdx)) {
                status = "✨ วันไตรภาคี (ซาฮะ)";
                statusStyle = "background:#fffbeb; color:#b45309; border:1px solid #fde68a; font-weight:bold;";
                desc = `การงานรวมพลังเป็นหนึ่งเดียว ทีมงานช่วยเหลือดี เหมาะแก่การปิดการขาย เซ็นสัญญา หรือเริ่มงานโปรเจกต์ใหญ่`;
                luckTip = `ตั้งจิตอธิษฐานขอพรพระประธาน หรือบริจาคทานแก่คนยากไร้`;
            } else {
                status = "🌱 วันดำเนินชีวิตราบรื่น";
                statusStyle = "background:#f8fafc; color:#334155; border:1px solid #e2e8f0;";
                desc = `ใช้จุดเด่นด้าน${animal.character} ประคับประคองหน้าที่ได้อย่างมั่นคง การเงินรายรับรายจ่ายคล่องตัว ไร้อุปสรรคขัดขวาง`;
                luckTip = `จัดโต๊ะทำงานให้สะอาดโปร่งโล่งเพื่อรับกระแสพลังงานบวก`;
            }

            return {
                name: animal.name,
                element: animal.element,
                status: status,
                statusStyle: statusStyle,
                desc: desc,
                luckTip: luckTip
            };
        });

        // ราศีที่ดวงดีที่สุดประจำวัน (Top 3)
        const topRasis = [...zodiacReadings].sort((a, b) => b.score - a.score).slice(0, 3);

        return {
            dateDisplay: dateDisplay,
            moonRasiName: ZODIAC_SIGNS[moon.rasi].th,
            sunRasiName: ZODIAC_SIGNS[sun.rasi].th,
            topRasis: topRasis,
            zodiacReadings: zodiacReadings,
            dayBornReadings: dayBornReadings,
            animalReadings: animalReadings
        };
    }

    // คำทำนายสมบูรณ์แบบ
    function generateProfessionalReading(data) {
        const { asc, birthPlanets, transitPlanets, thaksa, age, ageYang, birthDate } = data;
        const ascRasi = ZODIAC_SIGNS[asc.rasiIndex];

        const lordOfAsc = ascRasi.lord;
        const lordPlanetInfo = birthPlanets[lordOfAsc];
        const lordHouseIdx = (lordPlanetInfo.rasi - asc.rasiIndex + 12) % 12;
        const lordHouseName = HOUSES_12[lordHouseIdx].name;

        const jupTransit = transitPlanets[5];
        const satTransit = transitPlanets[7];
        const rahuTransit = transitPlanets[8];

        const jupHouseFromAsc = (jupTransit.rasi - asc.rasiIndex + 12) % 12;
        const satHouseFromAsc = (satTransit.rasi - asc.rasiIndex + 12) % 12;
        const rahuHouseFromAsc = (rahuTransit.rasi - asc.rasiIndex + 12) % 12;

        const currentYearReading = calculateSingleYearPrediction(data.birthPlanetNum, ageYang, birthDate.getFullYear());
        const currentMonthlyList = calculateMonthlyPredictionsForYear(asc.rasiIndex, data.birthPlanetNum, ageYang);

        function generateDeep12HousesAnalysis(ascRasiIndex, birthPlanets) {
            return HOUSES_12.map((h, idx) => {
                const rasiIdx = (ascRasiIndex + idx) % 12;
                const sign = ZODIAC_SIGNS[rasiIdx];
                const lordPlanetNum = sign.lord;
                const lordPlanet = birthPlanets[lordPlanetNum];

                const lordTargetHouseIdx = (lordPlanet.rasi - ascRasiIndex + 12) % 12;
                const lordTargetHouseName = HOUSES_12[lordTargetHouseIdx].name;

                const occupants = [];
                const occupantDetails = [];

                for (let p in birthPlanets) {
                    if (birthPlanets[p].rasi === rasiIdx) {
                        occupants.push(birthPlanets[p]);
                        if (PLANET_HOUSE_MEANINGS[h.name] && PLANET_HOUSE_MEANINGS[h.name][p]) {
                            occupantDetails.push(PLANET_HOUSE_MEANINGS[h.name][p]);
                        }
                    }
                }

                let lordFlowDesc = `<div style="margin-bottom:6px;">👑 <strong>ดาวเจ้าเรือน (${PLANET_DEFS[lordPlanetNum].name}):</strong> ไปสถิตใน <strong>ภพ${lordTargetHouseName}</strong> (ราศี${ZODIAC_SIGNS[lordPlanet.rasi].th}) &rarr; เรื่องราวเกี่ยวกับ<strong>${h.name}</strong> (${h.meaning}) จะส่งผลและโยงไปสู่เรื่อง<strong>${lordTargetHouseName}</strong> (${HOUSES_12[lordTargetHouseIdx].meaning})</div>`;

                let finalHTML = lordFlowDesc;

                if (occupantDetails.length > 0) {
                    finalHTML += `<div style="background:#f8fafc; padding:8px 12px; border-radius:6px; border-left:3px solid #2563eb; margin-top:6px;">`;
                    finalHTML += `<strong style="color:#1e293b;">🌟 อิทธิพลดาวที่สถิตในภพ:</strong><ul style="margin:4px 0 0 16px; padding:0;">`;
                    occupantDetails.forEach(item => {
                        finalHTML += `<li style="margin-bottom:4px; font-size:0.92rem; color:#334155; line-height:1.5;">${item}</li>`;
                    });
                    finalHTML += `</ul></div>`;
                } else {
                    finalHTML += `<div style="color:#64748b; font-size:0.88rem; font-style:italic; margin-top:4px;">(ภพนี้ไม่มีดาวสถิต ให้พิจารณาผลสัมฤทธิ์ตามดาวเจ้าเรือน ${PLANET_DEFS[lordPlanetNum].name} ที่ไปสถิตในภพ${lordTargetHouseName} เป็นเกณฑ์หลัก)</div>`;
                }

                return {
                    name: h.name,
                    meaning: h.meaning,
                    rasi: sign.th,
                    element: sign.element,
                    lord: PLANET_DEFS[lordPlanetNum].name,
                    lordInHouse: lordTargetHouseName,
                    occupants: occupants.map(p => p.thNum + " (" + p.name + ")").join(", ") || "ไม่มีดาวสถิต",
                    detailsHTML: finalHTML
                };
            });
        }

        // ฟังก์ชันวิเคราะห์เจาะลึก 5 มิติชีวิตตามตำราโหรโบราณ (อาชีพ, พี่น้อง, บิดามารดา, คู่ครอง, สุขภาพ)
        function generateDeepLifeAspects(ascRasiIndex, birthPlanets) {
            // 1. อาชีพและธุรกิจ (กัมมะ + ตนุลัคน์)
            const kammaRasiIdx = (ascRasiIndex + 9) % 12;
            const kammaLordNum = ZODIAC_SIGNS[kammaRasiIdx].lord;
            const kammaLord = PLANET_DEFS[kammaLordNum];
            const kammaLordInRasi = birthPlanets[kammaLordNum].rasi;
            const kammaLordInHouseIdx = (kammaLordInRasi - ascRasiIndex + 12) % 12;
            const kammaLordInHouseName = HOUSES_12[kammaLordInHouseIdx].name;

            const kammaOccupants = [];
            for (let p in birthPlanets) {
                if (birthPlanets[p].rasi === kammaRasiIdx) kammaOccupants.push(PLANET_DEFS[p]);
            }

            let careerTitle = "";
            let careerAdvice = "";
            if (kammaLordNum === 1) {
                careerTitle = "ข้าราชการ, ผู้บริหารระดับสูง, งานองค์กรใหญ่, ผู้นำองค์กร หรือธุรกิจที่ต้องใช้ชื่อเสียงและเกียรติยศ";
                careerAdvice = "ดวงชะตามีบารมีในการเป็นผู้นำ มีความเด็ดขาด เหมาะกับการทำงานในสายบริหาร คุมคน หรือทำงานกับหน่วยงานรัฐ";
            } else if (kammaLordNum === 2) {
                careerTitle = "งานบริการ, โรงแรม, ร้านอาหาร/เครื่องดื่ม, ประชาสัมพันธ์, พยาบาล, ของสวยงาม หรือธุรกิจเกี่ยวกับสุภาพสตรี";
                careerAdvice = "เด่นด้านการบริการและความเอาใจใส่ เข้าหาลูกค้าได้เก่ง มีเสน่ห์ในงานเจรจาและการดูแลต้อนรับ";
            } else if (kammaLordNum === 3) {
                careerTitle = "วิศวกร, ช่างเทคนิค, ทหาร, ตำรวจ, กีฬา, โรงงานอุตสาหกรรม, งานลุย/ผจญภัย, ธุรกิจยานยนต์";
                careerAdvice = "เป็นนักต่อสู้ มีความกล้าหาญ ขยันขันแข็ง ชอบงานที่เห็นผลลัพธ์เป็นรูปธรรมและได้ลงมือทำจริง";
            } else if (kammaLordNum === 4) {
                careerTitle = "ค้าขาย, การตลาด, นายหน้า/ตัวแทน, นักประชาสัมพันธ์, นักเขียน, สื่อสารมวลชน, โลจิสติกส์";
                careerAdvice = "วาจาเป็นทรัพย์ สติปัญญาเฉียบไวในการเจรจาต่อรอง วางแผนธุรกิจและทำการตลาดได้อย่างยอดเยี่ยม";
            } else if (kammaLordNum === 5) {
                careerTitle = "ครูอาจารย์, แพทย์/เภสัชกร, นักกฎหมาย, ผู้พิพากษา, นักวิชาการ, ที่ปรึกษา, ธุรกิจการศึกษา/ธรรมะ";
                careerAdvice = "ยอดแห่งปัญญาและคุณธรรม เป็นที่เคารพนับถือ เจริญก้าวหน้าจากวิชาความรู้และการเป็นผู้ให้คำปรึกษา";
            } else if (kammaLordNum === 6) {
                careerTitle = "การเงิน, การธนาคาร, ดีไซเนอร์, ดารา/ศิลปิน, ธุรกิจความงาม, จิวเวลรี่, อาหารเครื่องดื่มพรีเมียม";
                careerAdvice = "มีหัวการค้าด้านความสวยงาม ศิลปะ และการเงิน ดึงดูดทรัพย์ได้ง่ายจากเสน่ห์และรสนิยมอันโดดเด่น";
            } else if (kammaLordNum === 7) {
                careerTitle = "อสังหาริมทรัพย์, ที่ดิน, ก่อสร้าง, เหมืองแร่, เกษตรกรรม, ธุรกิจอุตสาหกรรมขนาดใหญ่, โกดังสินค้า";
                careerAdvice = "สร้างตัวด้วยความอดทนและประสบการณ์ เหมาะกับการลงทุนระยะยาวและการบริหารทรัพย์สินขนาดใหญ่";
            } else {
                careerTitle = "นำเข้า-ส่งออก, การบิน, ค้าขายออนไลน์ข้ามชาติ, เทคโนโลยี, ธุรกิจกลางคืน, การลงทุนเก็งกำไร";
                careerAdvice = "มีไหวพริบทางธุรกิจล้ำสมัย ทันกระแสโลก กล้าได้กล้าเสียในโอกาสใหม่ๆ และตลาดต่างประเทศ";
            }

            // 2. พี่น้องและญาติมิตร (สหัชชะ + ดาวอังคาร ๓)
            const sahatRasiIdx = (ascRasiIndex + 2) % 12;
            const sahatLordNum = ZODIAC_SIGNS[sahatRasiIdx].lord;
            const sahatSign = ZODIAC_SIGNS[sahatRasiIdx];
            const marsPlanet = birthPlanets[3];

            let siblingEstimate = "";
            let siblingBond = "";
            if (sahatSign.type === "ทวิภาวะราศี") {
                siblingEstimate = "มีเกณฑ์มีพี่น้องร่วมสายเลือด 2-4 คนขึ้นไป หรือมีพี่น้องต่างมารดา/ลูกพี่ลูกน้องที่สนิทกันมาก";
            } else if (sahatSign.type === "สถิรราศี") {
                siblingEstimate = "มีพี่น้องจำนวนน้อย (1-2 คน) หรือเป็นลูกคนโต/คนเดียวที่มีความรับผิดชอบสูง";
            } else {
                siblingEstimate = "มีพี่น้องปานกลาง (2-3 คน) และมักมีเกณฑ์แยกย้ายกันไปสร้างถิ่นฐานของตนเอง";
            }

            if ([2, 4, 5, 6].includes(sahatLordNum)) {
                siblingBond = "ความสัมพันธ์กับพี่น้องและเพื่อนฝูงอบอุ่น คอยเกื้อหนุนปรึกษาหารือและพึ่งพากันได้ดี";
            } else {
                siblingBond = "พี่น้องต่างคนต่างอยู่ หรือมีแนวคิดคนละสาย พึ่งพาตนเองเป็นหลักดีกว่าพึ่งพาญาติพี่น้อง";
            }

            // 3. บิดามารดา (ศุภะ-พ่อ / พันธุ-แม่ + ดาว ๑, ๒)
            const phanthuRasiIdx = (ascRasiIndex + 3) % 12;
            const suphaRasiIdx = (ascRasiIndex + 8) % 12;
            const sunPlanet = birthPlanets[1];
            const moonPlanet = birthPlanets[2];

            let fatherDesc = "";
            let motherDesc = "";

            // พ่อ (อาทิตย์ ๑ + ศุภะ)
            if ([0, 4, 8].includes(sunPlanet.rasi) || sunPlanet.rasi === suphaRasiIdx) {
                fatherDesc = "บิดา (พ่อ) เป็นผู้มีเกียรติยศ มีตำแหน่งหน้าที่มั่นคง ปลูกฝังวินัยและมอบมรดก/โอกาสที่ดีให้แก่เจ้าชะตา";
            } else if ([5, 7, 11].includes(sunPlanet.rasi)) {
                fatherDesc = "บิดาต้องเหน็ดเหนื่อยฝ่าฟันสร้างตัว หรือเจ้าชะตามักต้องพึ่งพาตนเองตั้งแต่เยาว์วัย ห่างไกลจากบิดา";
            } else {
                fatherDesc = "บิดาคอยให้การสนับสนุน ดูแลเอาใจใส่ และมีความผูกพันกันอย่างราบรื่น";
            }

            // แม่ (จันทร์ ๒ + พันธุ)
            if ([1, 3, 11].includes(moonPlanet.rasi) || moonPlanet.rasi === phanthuRasiIdx) {
                motherDesc = "มารดา (แม่) มีจิตใจเมตตา อบอุ่น เป็นหลักชัยสำคัญของครอบครัว มอบความร่มเย็นและทรัพย์สินให้";
            } else if ([7, 9, 10].includes(moonPlanet.rasi)) {
                motherDesc = "มารดาเป็นคนจริงจัง ต้องแบกรับภาระครอบครัวสูง หรือเจ้าชะตาต้องคอยดูแลสุขภาพของมารดาเป็นพิเศษ";
            } else {
                motherDesc = "มารดาเป็นผู้ดูแลเอาใจใส่อย่างใกล้ชิด ครอบครัวมีความอบอุ่นและผูกพันกันดี";
            }

            // 4. คู่ครองและความรัก (ปัตนิ + ดาวศุกร์ ๖)
            const patniRasiIdx = (ascRasiIndex + 6) % 12;
            const patniLordNum = ZODIAC_SIGNS[patniRasiIdx].lord;
            const venusPlanet = birthPlanets[6];
            const patniLord = PLANET_DEFS[patniLordNum];

            let spouseDesc = `คู่ครองมีลักษณะของ <strong>ดาว${patniLord.name}</strong> `;
            if (patniLordNum === 1) spouseDesc += `มีเกียรติยศ เป็นผู้นำ รักศักดิ์ศรี เจ้าระเบียบแต่มั่นคง`;
            else if (patniLordNum === 2) spouseDesc += `หน้าตาดี ผิวพรรณดี อ่อนโยน เอาใจใส่ดูแลเก่ง`;
            else if (patniLordNum === 3) spouseDesc += `ขยันขันแข็ง คล่องแคล่ว ตรงไปตรงมา ร่วมกันสู้งาน`;
            else if (patniLordNum === 4) spouseDesc += `ช่างพูด ช่างเจรจา มีไหวพริบ ค้าขายเก่ง ช่วยคิดวางแผน`;
            else if (patniLordNum === 5) spouseDesc += `มีศีลธรรม มีการศึกษาดี เป็นที่ปรึกษาและกัลยาณมิตรที่ยอดเยี่ยม`;
            else if (patniLordNum === 6) spouseDesc += `มีเสน่ห์ รสนิยมเลิศ นำพาโชคลาภและความสุขสมบูรณ์มาให้`;
            else if (patniLordNum === 7) spouseDesc += `อายุมากกว่าหรือมีความเป็นผู้ใหญ่สูง สุขุม ร่วมกันสร้างฐานะอย่างมั่นคง`;
            else spouseDesc += `เป็นคนต่างถิ่นต่างแดน หรือนักธุรกิจที่มีความคล่องตัวสูง`;

            // 5. สุขภาพและโรคประจำตัว (อริ + มรณะ)
            const ariRasiIdx = (ascRasiIndex + 5) % 12;
            const moranaRasiIdx = (ascRasiIndex + 7) % 12;
            const ariLord = PLANET_DEFS[ZODIAC_SIGNS[ariRasiIdx].lord];

            let healthAdvice = `จุดที่ต้องระวังตามเกณฑ์ดาวอริ (${ariLord.name}): `;
            if (ariLord.element === "ไฟ") healthAdvice += `ระบบไหลเวียนโลหิต ความดัน หัวใจ สายตา อาการอักเสบร้อนใน`;
            else if (ariLord.element === "น้ำ") healthAdvice += `ระบบทางเดินอาหาร ท้องไส้ ภูมิแพ้ ต่อมน้ำเหลือง และฮอร์โมน`;
            else if (ariLord.element === "ลม") healthAdvice += `ระบบประสาท ปวดเมื่อยกล้ามเนื้อ ไมเกรน การนอนไม่หลับ`;
            else healthAdvice += `กระดูก ข้อต่อ หลัง ผิวหนัง และความเครียดสะสม`;

            return {
                career: { title: careerTitle, advice: careerAdvice, lord: kammaLord.name, houseLordIn: kammaLordInHouseName },
                siblings: { estimate: siblingEstimate, bond: siblingBond },
                parents: { father: fatherDesc, mother: motherDesc },
                spouse: { desc: spouseDesc, lord: patniLord.name },
                health: { advice: healthAdvice, lord: ariLord.name }
            };
        }

        // 1. คำนวณฤกษ์กำเนิด (27 นักษัตรฤกษ์ & 9 ฤกษ์มงคล) ตามตำแหน่งดาวจันทร์ (๒)
        function calculateBirthNakshatra(moonPlanet) {
            const nakshatras = [
                { name: "อัศวินี", lord: "เกตุ", type: "ทลิทโทฤกษ์", desc: "ฤกษ์แห่งการขอ การเจรจา พ่อค้า นักขาย นักระดมทุน มีวาจาเป็นมงคล ขอความเมตตาช่วยเหลือมักสำเร็จง่าย" },
                { name: "ภรณี", lord: "ศุกร์", type: "มหัทธโนฤกษ์", desc: "ฤกษ์เศรษฐี ผู้มีทรัพย์สิน การเงินมั่งคั่ง โดดเด่นด้านการค้าขาย การลงทุน ธนาคาร และของมีค่า" },
                { name: "กฤติกา", lord: "อาทิตย์", type: "โจโรฤกษ์", desc: "ฤกษ์นักสู้ ผู้กล้า ชิงไหวชิงพริบ เหมาะกับงานปราบปราม กีฬา แข่งขัน ทหาร ตำรวจ ลุยงานหนักได้อย่างยอดเยี่ยม" },
                { name: "โรหิณี", lord: "จันทร์", type: "ภูมิปาโลฤกษ์", desc: "ฤกษ์ผู้ครองแผ่นดิน มั่นคงในอสังหาริมทรัพย์ ที่ดิน อาคาร การเกษตร และหน้าที่การงานภาครัฐ" },
                { name: "มฤคศิร", lord: "อังคาร", type: "เทศาตรีฤกษ์", desc: "ฤกษ์เดินทาง ท่องเที่ยว บันเทิง ค้าขายต่างแดน การโรงแรม งานบริการ และสังคมกว้างขวาง" },
                { name: "อารทรา", lord: "ราหู", type: "เทวีฤกษ์", desc: "ฤกษ์นางพญา มีเสน่ห์ เมตตามหานิยม ศิลปะ ความงาม มีผู้ใหญ่อุปถัมภ์ค้ำชูตลอดเวลา" },
                { name: "ปุนัพสุ", lord: "พฤหัสบดี", type: "เพชฌฆาตฤกษ์", desc: "ฤกษ์เด็ดขาด ปราบศัตรู แพทย์ ศัลยกรรม ผู้พิพากษา ทำงานที่ต้องใช้ความเด็ดเดี่ยวและสติปัญญาชั้นสูง" },
                { name: "ปุษยะ", lord: "เสาร์", type: "ราชาฤกษ์", desc: "ฤกษ์พระราชา เกียรติยศ ผู้นำ ผู้บริหารระดับสูง ทำการใหญ่สำเร็จ เป็นที่เคารพยำเกรง" },
                { name: "อาศเลษา", lord: "พุธ", type: "สมโณฤกษ์", desc: "ฤกษ์นักบวช ปราชญ์ ครูอาจารย์ มีความสงบ สติปัญญา และสิ่งศักดิ์สิทธิ์คุ้มครองอย่างน่าอัศจรรย์" }
            ];

            const totalMoonDeg = moonPlanet.rasi * 30 + moonPlanet.deg + (moonPlanet.min / 60);
            const nakshatraIndex = Math.floor(totalMoonDeg / (360 / 27)) % 27;
            const nakTypeIndex = nakshatraIndex % 9;
            const currentNak = nakshatras[nakTypeIndex];

            return {
                index: nakshatraIndex + 1,
                name: currentNak.name,
                lord: currentNak.lord,
                type: currentNak.type,
                desc: currentNak.desc
            };
        }

        // 2. ตรวจสอบตำแหน่งมาตรฐานดาวพิเศษ (Dignities & Special Yoga)
        function calculatePlanetDignities(birthPlanets) {
            // เกณฑ์มาตรฐานดาว
            const UCHA = { 1: 0, 2: 1, 3: 9, 4: 5, 5: 3, 6: 11, 7: 6, 8: 1 }; // มหาอุจจ์
            const KASET = { 1: [4], 2: [3], 3: [0, 7], 4: [2, 5], 5: [8, 11], 6: [1, 6], 7: [9], 8: [10] }; // เกษตร
            const RAJACHOKE = { 1: 8, 2: 9, 3: 4, 4: 1, 5: 5, 6: 0, 7: 7, 8: 6 }; // ราชาโชค
            const MAHAJAK = { 1: 5, 2: 10, 3: 3, 4: 8, 5: 11, 6: 7, 7: 1, 8: 0 }; // มหาจักร
            const NIJA = { 1: 6, 2: 7, 3: 3, 4: 11, 5: 9, 6: 5, 7: 0, 8: 7 }; // นิจ (อ่อนกำลัง)

            const results = [];
            for (let p = 1; p <= 8; p++) {
                const planet = birthPlanets[p];
                const r = planet.rasi;
                const dignities = [];

                if (UCHA[p] === r) dignities.push({ title: "มหาอุจจ์", badge: "🌟 มหาอุจจ์", desc: "มีพลังอำนาจบารมีสูงสุด มีวาสนารุ่งโรจน์อย่างรวดเร็ว ได้เป็นใหญ่เป็นโต", style: "background:#d97706; color:white;" });
                if (KASET[p] && KASET[p].includes(r)) dignities.push({ title: "เกษตราธิบดี", badge: "👑 เกษตร", desc: "มีความมั่นคงถาวร ทรัพย์สินยั่งยืน ฐานะไม่ตกต่ำ มีความหนักแน่น", style: "background:#15803d; color:white;" });
                if (RAJACHOKE[p] === r) dignities.push({ title: "ราชาโชค", badge: "✨ ราชาโชค", desc: "มีโชคลาภมาโดยเสน่หา ได้รับการอุปถัมภ์จากผู้ใหญ่โดยไม่ต้องเหนื่อยแรง", style: "background:#2563eb; color:white;" });
                if (MAHAJAK[p] === r) dignities.push({ title: "มหาจักร", badge: "⚡ มหาจักร", desc: "ต้องบุกเบิกฟันฝ่า แต่ปลายทางจะยิ่งใหญ่และร่ำรวยระดับเจ้าสัว มีชื่อเสียงโด่งดัง", style: "background:#7c3aed; color:white;" });
                if (NIJA[p] === r) dignities.push({ title: "นิจ", badge: "🌱 นิจ", desc: "ต้องใช้ความอดทนและพยายามมากกว่าคนอื่น แต่ถ้าสู้ไม่ถอยจะพลิกกลับมารุ่งเรืองได้", style: "background:#64748b; color:white;" });

                if (dignities.length > 0) {
                    results.push({
                        planet: planet.name,
                        num: planet.thNum,
                        color: planet.color,
                        rasi: ZODIAC_SIGNS[r].th,
                        dignities: dignities
                    });
                }
            }
            return results;
        }

        // 3. วิเคราะห์ฆาตดวงชะตา & จุดเปราะบาง (Khaata & Break Point)
        function calculateKhaataAndDosha(ascRasiIndex, birthPlanets) {
            const checks = [];

            // พฤหัสบดีเป็น ๗ แก่ลัคน์ (พินทุบาทว์)
            const jupHouse = (birthPlanets[5].rasi - ascRasiIndex + 12) % 12;
            if (jupHouse === 6) {
                checks.push({ title: "เกณฑ์พฤหัสบดีเล็งลัคน์ (พินทุบาทว์)", type: "warning", desc: "ระวังปัญหาความขัดแย้งในเรื่องความรัก คู่ครอง หรือผู้ใหญ่ อาจมีความคิดเห็นไม่ตรงกัน ให้ใช้สติและความใจเย็นประคับประคอง" });
            }

            // เสาร์ทับหรือเล็งลัคนา
            const satHouse = (birthPlanets[7].rasi - ascRasiIndex + 12) % 12;
            if (satHouse === 0 || satHouse === 6) {
                checks.push({ title: "เกณฑ์เสาร์กุมหรือเล็งลัคนา (เสาร์เพ่งเล็งดวง)", type: "caution", desc: "ชีวิตมักต้องแบกรับภาระหนัก เป็นเสาหลักของบ้าน ต้องฝ่าฟันความกดดัน แต่จะสร้างความมั่นคงได้แข็งแกร่งที่สุด" });
            }

            // ราหูทับหรือเล็งลัคนา
            const rahuHouse = (birthPlanets[8].rasi - ascRasiIndex + 12) % 12;
            if (rahuHouse === 0 || rahuHouse === 6) {
                checks.push({ title: "เกณฑ์อสุรินทร์ราหูส่งกำลังถึงลัคน์", type: "warning", desc: "ระวังการถูกหลอกลวง การหลงเชื่อคนง่าย หรือการตัดสินใจใจเร็วเรื่องการเงิน ควรตรวจเช็กสัญญาให้รัดกุม" });
            }

            // อาทิตย์ หรือ จันทร์ ตกภพอริ/มรณะ/วินาศ
            const sunHouse = (birthPlanets[1].rasi - ascRasiIndex + 12) % 12;
            if ([5, 7, 11].includes(sunHouse)) {
                checks.push({ title: "ดาวอาทิตย์ (๑) ตกภพทุษฐานะ", type: "info", desc: "ระวังเรื่องสุขภาพสายตา หัวใจ หรือการมีปัญหากับผู้มีอำนาจ เหมาะกับการทำงานอยู่เบื้องหลังหรือธุรกิจส่วนตัว" });
            }

            if (checks.length === 0) {
                checks.push({ title: "ดวงชะตาปลอดฆาตใหญ่ (ชะตาราบรื่น)", type: "success", desc: "พื้นดวงชะตาไม่มีดาวบาปเคราะห์ทำมุมฆาตร้ายแรง การดำเนินชีวิตจะมีความราบรื่น แคล้วคลาดปลอดภัยจากภยันตราย" });
            }

            return checks;
        }

        // 4. เลขศาสตร์มงคลและทิศนำโชคเฉพาะบุคคล
        function calculateAuspiciousAura(birthPlanetNum, thaksa) {
            const pSri = PLANET_DEFS[thaksa.sriJor];
            const pDecha = PLANET_DEFS[thaksa.dechaJor];
            const pMontri = PLANET_DEFS[thaksa.montriJor];
            const pKala = PLANET_DEFS[thaksa.kalakiniJor];

            const directions = {
                1: "ทิศตะวันออกเฉียงเหนือ (อีสาน)",
                2: "ทิศตะวันออก (บูรพา)",
                3: "ทิศตะวันออกเฉียงใต้ (อาคเนย์)",
                4: "ทิศใต้ (ทักษิณ)",
                5: "ทิศตะวันตก (ประจิม)",
                6: "ทิศเหนือ (อุดร)",
                7: "ทิศตะวันตกเฉียงใต้ (หรดี)",
                8: "ทิศตะวันตกเฉียงเหนือ (พายัพ)"
            };

            const luckyNumbers = [pSri.num, pDecha.num, pMontri.num];
            const luckyPairs = [
                `${pSri.num}${pDecha.num}`,
                `${pDecha.num}${pMontri.num}`,
                `${pSri.num}${pMontri.num}`,
                `${pSri.num}9`
            ];

            return {
                luckyNumbers: luckyNumbers.join(", "),
                luckyPairs: luckyPairs.join(", "),
                badNumber: `${pKala.num} (ดาว${pKala.name})`,
                luckyDirection: directions[thaksa.sriJor] || "ทิศตะวันออก",
                luckyElement: pSri.element
            };
        }

        // 5. รหัสวาสนาชะตาชีวิต 10 ขั้น (Destiny Blueprint Tier)
        function calculateDestinyTier(ascRasiIndex, birthPlanets, dignities) {
            let score = 0;
            dignities.forEach(d => {
                d.dignities.forEach(dig => {
                    if (dig.title === "มหาอุจจ์") score += 3;
                    if (dig.title === "เกษตราธิบดี") score += 2.5;
                    if (dig.title === "ราชาโชค") score += 2;
                    if (dig.title === "มหาจักร") score += 2;
                });
            });

            // ตรวจสอบพฤหัสบดีกุมลัคน์ หรือ ตรีโกณ
            const jupHouse = (birthPlanets[5].rasi - ascRasiIndex + 12) % 12;
            if ([0, 4, 8].includes(jupHouse)) score += 3;

            let tierName = "";
            let tierDesc = "";
            if (score >= 8) {
                tierName = "ระดับมหาคหบดี / ผู้นำชั้นสูง (Grade S - Platinum Tier)";
                tierDesc = "ดวงชะตามีดาวได้มาตรฐานมงคลหนุนส่งหลายดวง มีวาสนาบารมีสูงส่ง ทำการใหญ่ประสบความสำเร็จ มีทรัพย์สินมหาศาล และเป็นที่พึ่งพาของผู้อื่น";
            } else if (score >= 5) {
                tierName = "ระดับเศรษฐีสร้างตัว / ผู้เชี่ยวชาญพิเศษ (Grade A - Gold Tier)";
                tierDesc = "ดวงชะตามีรากฐานมั่นคง สติปัญญาและไหวพริบยอดเยี่ยม สามารถสร้างฐานะและความเจริญก้าวหน้าได้อย่างต่อเนื่องด้วยความสามารถของตนเอง";
            } else if (score >= 2) {
                tierName = "ระดับผู้ประสบความสำเร็จอย่างราบรื่น (Grade B - Silver Tier)";
                tierDesc = "ชีวิตมีความสุขสบาย มีผู้ใหญ่คอยเกื้อหนุน การเงินไม่ขาดมือ หากเน้นการวางแผนระยะยาวจะมีความมั่นคงเป็นปึกแผ่น";
            } else {
                tierName = "ระดับนักสู้ผู้บุกเบิกชีวิต (Grade C - Warrior Tier)";
                tierDesc = "ชะตาชีวิตเน้นการสร้างด้วยหยาดเหงื่อแรงกาย การฝ่าฟันอุปสรรคจะกลายเป็นบทเรียนอันล้ำค่าที่นำไปสู่ความสำเร็จอันยิ่งใหญ่ในบั้นปลาย";
            }

            return {
                tierName: tierName,
                score: score,
                desc: tierDesc
            };
        }

        const deepHouses = generateDeep12HousesAnalysis(asc.rasiIndex, birthPlanets);
        const deepLife = generateDeepLifeAspects(asc.rasiIndex, birthPlanets);
        const birthNakshatra = calculateBirthNakshatra(birthPlanets[2]);
        const dignitiesList = calculatePlanetDignities(birthPlanets);
        const khaataList = calculateKhaataAndDosha(asc.rasiIndex, birthPlanets);
        const auspiciousAura = calculateAuspiciousAura(data.birthPlanetNum, thaksa);
        const destinyTier = calculateDestinyTier(asc.rasiIndex, birthPlanets, dignitiesList);

        return {
            basicSummary: {
                ascName: ascRasi.th,
                element: ascRasi.element,
                lordName: PLANET_DEFS[lordOfAsc].name,
                lordInHouse: lordHouseName,
                navamshaAsc: asc.navamsha.rasiName,
                drekkanaAsc: asc.drekkana.rasiName,
                character: `ผู้มีลัคนาสถิตราศี${ascRasi.th} ธาตุ${ascRasi.element} (${ascRasi.type}) มีดาวเจ้าเรือนตนุคือดาว${PLANET_DEFS[lordOfAsc].name} กุมภพ${lordHouseName} (ราศี${ZODIAC_SIGNS[lordPlanetInfo.rasi].th}) ร่วมด้วยนวางค์ลัคนาสถิตราศี${asc.navamsha.rasiName} และตรียางค์ลัคนาสถิตราศี${asc.drekkana.rasiName} บ่งชี้ว่าเป็นผู้ที่มีพื้นฐานชะตาชีวิตมุ่งมั่น มีเอกลักษณ์เฉพาะตัวสูง ${ascRasi.element === "ไฟ" ? "มีความเป็นผู้นำ ใจกว้าง กล้าคิดกล้าทำ" : ascRasi.element === "ดิน" ? "มีความสุขุม รอบคอบ อดทนสูง รักความมั่นคง" : ascRasi.element === "ลม" ? "มีสติปัญญาไหวพริบยอดเยี่ยม สื่อสารคล่องแคล่ว ปรับตัวได้ไว" : "มีสัญชาตญาณลึกซึ้ง จิตใจเมตตา อ่อนโยนแต่หนักแน่น"} เรื่องราวชีวิตหลักจะวนเวียนและผูกพันกับภพ${lordHouseName} (${HOUSES_12[lordHouseIdx].meaning}) อย่างเด่นชัด`
            },
            housesAnalysis: deepHouses,
            lifeAspects: deepLife,
            birthNakshatra: birthNakshatra,
            dignities: dignitiesList,
            khaata: khaataList,
            aura: auspiciousAura,
            destinyTier: destinyTier,
            transitPrediction: {
                jove: `🌟 <strong>ดาวพฤหัสบดี (๕) จรเข้าภพ ${HOUSES_12[jupHouseFromAsc].name}:</strong> ${[0, 4, 8].includes(jupHouseFromAsc) ? "เป็นเกณฑ์มงคลสูงสุด (ตรีโกณ/กุมลัคน์) ผู้ใหญ่เมตตา ปัญหาคลี่คลาย การเงินและความสำเร็จเปิดกว้าง" : [6, 9].includes(jupHouseFromAsc) ? "เล็งหรือเข้ามุมสำคัญ มีโชคเรื่องคู่ครอง หุ้นส่วน หรือการขยับขยายหน้าที่การงาน" : "ช่วยประคับประคองให้ชีวิตมีความราบรื่น ให้ศึกษาหาความรู้เพิ่มเติมหรือทำบุญหนุนดวง"}`,
                saturn: `🪐 <strong>ดาวเสาร์ (๗) จรเข้าภพ ${HOUSES_12[satHouseFromAsc].name}:</strong> ${[0, 6, 7].includes(satHouseFromAsc) ? "เสาร์ทับหรือเล็งลัคนา/มรณะ ต้องระวังความเครียด ความกดดัน หรือภาระหนี้สิน ต้องใช้ความอดทนและรอบคอบเป็นสองเท่า" : "สร้างรากฐานความมั่นคงระยะยาว แม้เหนื่อยแต่จะได้ผลตอบแทนที่จับต้องได้"}`,
                rahu: `🌑 <strong>พระราหู (๘) จรเข้าภพ ${HOUSES_12[rahuHouseFromAsc].name}:</strong> บ่งบอกถึงความเปลี่ยนแปลง การหมุนเวียนของผลประโยชน์ หรือการได้ร่วมงานกับคนต่างชาติต่างถิ่น ระวังความลุ่มหลงหรือการตัดสินใจที่ใจร้อน`
            },
            thaksaLifeGuide: {
                sriNote: `✨ <strong>ดาวศุภมงคลประจำปีนี้ (ศรีจร):</strong> <strong>ดาว${PLANET_DEFS[thaksa.sriJor].name} (เลข ${PLANET_DEFS[thaksa.sriJor].thNum})</strong> เสริมด้าน${PLANET_DEFS[thaksa.sriJor].element} แนะนำให้ใช้สีมงคล <span style="display:inline-flex; align-items:center; gap:5px; background:#f8fafc; padding:2px 8px; border-radius:5px; border:1px solid #cbd5e1; font-weight:600;"><span style="display:inline-block; width:12px; height:12px; background-color:${PLANET_DEFS[thaksa.sriJor].color}; border-radius:3px; border:1px solid rgba(0,0,0,0.15);"></span> ${PLANET_DEFS[thaksa.sriJor].colorName}</span> เพื่อดึงดูดโชคลาภและความสำเร็จ`,
                kalaNote: `⚠️ <strong>ดาวอุปสรรคที่ต้องระวัง (กาลกิณีจร):</strong> <strong>ดาว${PLANET_DEFS[thaksa.kalakiniJor].name} (เลข ${PLANET_DEFS[thaksa.kalakiniJor].thNum})</strong> ควรหลีกเลี่ยงการใช้สี <span style="display:inline-flex; align-items:center; gap:5px; background:#f8fafc; padding:2px 8px; border-radius:5px; border:1px solid #cbd5e1; font-weight:600; color:#b91c1c;"><span style="display:inline-block; width:12px; height:12px; background-color:${PLANET_DEFS[thaksa.kalakiniJor].color}; border-radius:3px; border:1px solid rgba(0,0,0,0.15);"></span> ${PLANET_DEFS[thaksa.kalakiniJor].colorName}</span> และระวังการใช้อารมณ์หรือการลงทุนที่ไม่รอบคอบ`,
                dechaNote: `💪 <strong>ดาวเดชนำพาอำนาจ (เดชจร):</strong> <strong>ดาว${PLANET_DEFS[thaksa.dechaJor].name} (เลข ${PLANET_DEFS[thaksa.dechaJor].thNum})</strong> ใช้สี <span style="display:inline-flex; align-items:center; gap:5px; background:#f8fafc; padding:2px 8px; border-radius:5px; border:1px solid #cbd5e1; font-weight:600;"><span style="display:inline-block; width:12px; height:12px; background-color:${PLANET_DEFS[thaksa.dechaJor].color}; border-radius:3px; border:1px solid rgba(0,0,0,0.15);"></span> ${PLANET_DEFS[thaksa.dechaJor].colorName}</span> เสริมบารมีและตำแหน่งหน้าที่การงาน`
            },
            currentYearReading: currentYearReading,
            monthlyPredictions: currentMonthlyList
        };
    }

    function calculateFullHoroscope(birthDateStr, birthTimeStr) {
        const bDate = new Date(birthDateStr);
        const now = new Date();
        let age = now.getFullYear() - bDate.getFullYear();
        if (now.getMonth() < bDate.getMonth() || (now.getMonth() === bDate.getMonth() && now.getDate() < bDate.getDate())) {
            age--;
        }
        if (age < 0) age = 0;

        const birthDayOfWeek = getThaiDayOfWeek(bDate, birthTimeStr);
        const birthPlanetNum = getBirthPlanetNumber(bDate, birthTimeStr);
        const asc = calculateAscendant(bDate, birthTimeStr);
        const birthPlanets = calculatePlanets(bDate, false);
        const transitPlanets = calculatePlanets(now, true);
        const thaksa = calculateThaksa(birthPlanetNum, age);
        const trivai = calculateTrivai(asc.rasiIndex, birthPlanets, age);

        const data = {
            birthDate: bDate,
            birthTime: birthTimeStr,
            age: age,
            ageYang: age + 1,
            birthDayOfWeek: birthDayOfWeek,
            birthPlanetNum: birthPlanetNum,
            asc: asc,
            birthPlanets: birthPlanets,
            transitPlanets: transitPlanets,
            thaksa: thaksa,
            trivai: trivai
        };

        data.reading = generateProfessionalReading(data);
        return data;
    }

    return {
        ZODIAC_SIGNS,
        HOUSES_12,
        PLANET_DEFS,
        THAKSA_ORDER,
        THAKSA_NAMES,
        calculateFullHoroscope,
        calculateSingleYearPrediction,
        calculateMonthlyPredictionsForYear,
        calculateDailyPrediction,
        calculatePublicDailyOverview
    };
})();

if (typeof window !== "undefined") {
    window.ThaiHoroProEngine = ThaiHoroProEngine;
}
