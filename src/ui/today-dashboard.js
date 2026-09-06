"use strict";

(function () {

    // ===== ข้อมูลทั้งหมด (self-contained ไม่พึ่ง const ของไฟล์อื่น) =====

    const DASH_DAY_COLORS = {
        "อาทิตย์": { colors: ["แดง (เฉดส้ม)"], hex: ["#E8471A"] },
        "จันทร์":  { colors: ["ขาว", "นวล", "งาช้าง", "มุกดา"], hex: ["#F5F0E8", "#E8E0D0", "#FAFAFA", "#B0A8C0"] },
        "อังคาร":  { colors: ["ชมพู", "ม่วงแดง"], hex: ["#F06080", "#C04080"] },
        "พุธ":     { colors: ["เขียวสด"], hex: ["#28B463"] },
        "พฤหัสบดี":{ colors: ["เหลือง", "น้ำตาล", "น้ำผึ้ง", "ตองอ่อน"], hex: ["#F4D03F", "#A0522D", "#D4A017", "#C8E6C9"] },
        "ศุกร์":   { colors: ["น้ำเงิน", "ฟ้า", "กรมท่า", "เขียวทะเล"], hex: ["#2471A3", "#5DADE2", "#1A5276", "#1A8A6E"] },
        "เสาร์":   { colors: ["ดำ", "หม่น", "ม่วง", "เทา"], hex: ["#1C1C1C", "#6D6D6D", "#7D3C98", "#888888"] },
    };

    const DASH_DAY_ELEMENT = {
        "อาทิตย์": "ไฟ", "จันทร์": "น้ำ", "อังคาร": "น้ำ",
        "พุธ": "ดิน", "พฤหัสบดี": "ไฟ", "ศุกร์": "ลม", "เสาร์": "ดิน",
    };

    const DASH_DAY_DIRECTION = {
        "อาทิตย์": { dech: "ตะวันออกเฉียงใต้", sri: "ใต้" },
        "จันทร์":  { dech: "ใต้", sri: "ตะวันตกเฉียงใต้" },
        "อังคาร":  { dech: "ตะวันตกเฉียงใต้", sri: "ตะวันตก" },
        "พุธ":     { dech: "ตะวันตก", sri: "ตะวันตกเฉียงเหนือ" },
        "พฤหัสบดี":{ dech: "เหนือ", sri: "ตะวันออกเฉียงเหนือ" },
        "ศุกร์":   { dech: "ตะวันออก", sri: "ตะวันออกเฉียงใต้" },
        "เสาร์":   { dech: "ตะวันตกเฉียงเหนือ", sri: "เหนือ" },
    };

    const DASH_GHOST_DIRECTION = {
        "อาทิตย์": "ตะวันออกเฉียงเหนือ", "จันทร์": "ตะวันออก",
        "อังคาร":  "ตะวันออกเฉียงเหนือ", "พุธ": "เหนือ",
        "พฤหัสบดี": "ใต้", "ศุกร์": "ตะวันตก", "เสาร์": "ตะวันออกเฉียงใต้",
    };

    const DASH_SPIRIT_DIRECTION = {
        "อาทิตย์": { deva: "ตะวันออกเฉียงใต้", mritu: "ตะวันออกเฉียงเหนือ" },
        "จันทร์":  { deva: "ตะวันตก", mritu: "ตะวันออก" },
        "อังคาร":  { deva: "ตะวันออกเฉียงเหนือ", mritu: "ตะวันตกเฉียงใต้" },
        "พุธ":     { deva: "ใต้", mritu: "เหนือ" },
        "พฤหัสบดี":{ deva: "ตะวันออกเฉียงเหนือ", mritu: "ตะวันออกเฉียงใต้" },
        "ศุกร์":   { deva: "ตะวันออก", mritu: "ตะวันตก" },
        "เสาร์":   { deva: "ตะวันตกเฉียงใต้", mritu: "ตะวันออกเฉียงเหนือ" },
    };

    // ราหูจรตามช่วงเวลา (index ตรงกับ slots ด้านล่าง)
    const DASH_RAHU_SLOTS = [
        { label: "06:00–09:00", dir: "ตะวันออก",          start: 360,  end: 540  },
        { label: "09:00–12:00", dir: "ตะวันตกเฉียงเหนือ", start: 540,  end: 720  },
        { label: "12:00–15:00", dir: "เหนือ",              start: 720,  end: 900  },
        { label: "15:00–18:00", dir: "ตะวันออกเฉียงใต้",  start: 900,  end: 1080 },
        { label: "18:00–21:00", dir: "ตะวันตก",            start: 1080, end: 1260 },
        { label: "21:00–24:00", dir: "ตะวันออกเฉียงเหนือ",start: 1260, end: 1440 },
        { label: "00:00–03:00", dir: "ใต้",                start: 0,    end: 180  },
        { label: "03:00–06:00", dir: "ตะวันตกเฉียงเหนือ", start: 180,  end: 360  },
    ];

    const DASH_TABOO = {
        0: { good: ["สระผม (อายุยืน)", "ตัดผม (อายุยืน)", "นุ่งผ้าใหม่ (ชนะศัตรู)"],   bad: ["ตัดเล็บ (จะมีศัตรู)", "ห้ามขึ้นบ้านใหม่"] },
        1: { good: ["สระผม (มีลาภ)", "ตัดผม (จะมีลาภ)", "ตัดเล็บ (มีลาภใหญ่)"],       bad: ["ห้ามทำของหาย", "ห้ามเดินทางไกลทางน้ำ"] },
        2: { good: ["สระผม (ชนะศัตรู)", "โกนหนวดเครา"],                                bad: ["ตัดผม (ศัตรูจะทำร้าย)", "นุ่งผ้าใหม่", "ตัดเล็บ"] },
        3: { good: ["นุ่งผ้าใหม่ (มีสุขมาก)", "ตัดเล็บ"],                              bad: ["สระผม", "ตัดผม (พุธหัวกุด)"] },
        4: { good: ["สระผม", "ตัดผม", "นุ่งผ้าใหม่"],                                  bad: ["ตัดเล็บ (จะมีทุกข์)"] },
        5: { good: ["สระผม", "ตัดผม", "นุ่งผ้าใหม่", "ตัดเล็บ"],                      bad: ["ห้ามขึ้นบ้านใหม่"] },
        6: { good: ["สระผม", "ตัดผม"],                                                  bad: ["นุ่งผ้าใหม่", "ตัดเล็บ"] },
    };

    // ข้อมูลยาม (สำรองกรณี yarmPage.js ยังโหลดไม่เสร็จ)
    const DASH_YARM_CHART = {
        day: [
            [0,6,4,2,7,5,3,0], // อาทิตย์
            [1,7,5,3,1,6,4,1], // จันทร์
            [2,0,6,4,2,7,5,2], // อังคาร
            [3,1,7,5,3,0,6,3], // พุธ
            [5,3,1,7,5,2,0,5], // พฤหัสบดี
            [6,4,2,0,6,1,7,6], // ศุกร์
            [4,2,0,6,4,3,1,4], // เสาร์
        ],
        night: [
            [5,3,1,7,5,2,0,5], // อาทิตย์
            [6,4,2,0,6,1,7,6], // จันทร์
            [4,2,0,6,4,3,1,4], // อังคาร
            [0,6,4,2,7,5,3,0], // พุธ
            [1,7,5,3,1,6,4,1], // พฤหัสบดี
            [2,0,6,4,2,7,5,2], // ศุกร์
            [3,1,7,5,3,0,6,3], // เสาร์
        ],
    };

    const DASH_YARM_INFO = {
        0: { name: "ยามอาทิตย์", trait: "ร้อนแรง มีอำนาจ",      good: "เข้าหาผู้ใหญ่, เริ่มงานใหญ่",            bad: "การเจรจาความลับ, ใจร้อน" },
        1: { name: "ยามจันทร์",  trait: "อ่อนโยน เมตตา",        good: "งานบริการ, ติดต่อเพศตรงข้าม",           bad: "งานที่ต้องใช้ความเด็ดขาด" },
        2: { name: "ยามอังคาร", trait: "บุกเบิก ขยัน",          good: "การแข่งขัน, ทวงหนี้, ออกกำลังกาย",     bad: "การทะเลาะวิวาท, ผ่าตัด" },
        3: { name: "ยามพุธ",    trait: "เจรจา ปัญญา",           good: "ขายของ, เซ็นสัญญา, เขียนจดหมาย",       bad: "การโกหกจะถูกจับได้" },
        4: { name: "ยามเสาร์",  trait: "หนักแน่น อดทน",        good: "ซื้อที่ดิน, ก่อสร้าง, งานระยะยาว",      bad: "งานมงคล, ความรัก" },
        5: { name: "ยามพฤหัสบดี", trait: "สิริมงคล ครูอาจารย์", good: "เรียนรู้, บวช, ไหว้พระ, พบผู้ใหญ่",   bad: "เรื่องอบายมุข" },
        6: { name: "ยามศุกร์",  trait: "ความสุข โชคลาภ",       good: "แต่งงาน, ขึ้นบ้านใหม่, ซื้อเสื้อผ้า", bad: "ความเศร้า, งานศพ" },
        7: { name: "ยามราหู",   trait: "พลิกแพลง กลลวง",       good: "งานกลางคืน, งานเสี่ยงโชค",             bad: "การเดินทางไกล, สัญญาสำคัญ" },
    };

    // ===== สีการ์ดยามตามดาว =====
    const YARM_CARD_STYLE = {
        0: { bg: 'linear-gradient(135deg,#922b21,#c0392b)', border: '#c0392b' }, // อาทิตย์
        1: { bg: 'linear-gradient(135deg,#566573,#7f8c8d)', border: '#7f8c8d' }, // จันทร์
        2: { bg: 'linear-gradient(135deg,#922b21,#e74c3c)', border: '#e74c3c' }, // อังคาร
        3: { bg: 'linear-gradient(135deg,#1a5632,#27ae60)', border: '#27ae60' }, // พุธ
        4: { bg: 'linear-gradient(135deg,#17202a,#2c3e50)', border: '#5d6d7e' }, // เสาร์
        5: { bg: 'linear-gradient(135deg,#9a7d0a,#d4ac0d)', border: '#f4d03f' }, // พฤหัสบดี
        6: { bg: 'linear-gradient(135deg,#154360,#2980b9)', border: '#5dade2' }, // ศุกร์
        7: { bg: 'linear-gradient(135deg,#4a235a,#7d3c98)', border: '#a569bd' }, // ราหู
    };

    const DIR_ARROW = {
        'ตะวันออก': '→', 'ตะวันตก': '←', 'เหนือ': '↑', 'ใต้': '↓',
        'ตะวันออกเฉียงเหนือ': '↗', 'ตะวันตกเฉียงเหนือ': '↖',
        'ตะวันออกเฉียงใต้': '↘', 'ตะวันตกเฉียงใต้': '↙',
    };

    const ELEM_ICON  = { 'ไฟ': '🔥', 'น้ำ': '💧', 'ดิน': '🌍', 'ลม': '💨' };
    const ELEM_COLOR = { 'ไฟ': '#e74c3c', 'น้ำ': '#3498db', 'ดิน': '#e67e22', 'ลม': '#1abc9c' };

    // ===== ข้อมูลราศี 12 ราศี =====
    const DASH_ZODIAC_SIGNS = {
        1:  { name:"ราศีเมษ",    english:"Aries",       symbol:"♈", dateRange:"21 มี.ค. – 19 เม.ย.", element:"ไฟ",    ruling:"ดาวอังคาร",   emoji:"🐏", color:"#e74c3c" },
        2:  { name:"ราศีพฤษภ",  english:"Taurus",      symbol:"♉", dateRange:"20 เม.ย. – 20 พ.ค.", element:"ดิน",   ruling:"ดาวศุกร์",    emoji:"🐂", color:"#27ae60" },
        3:  { name:"ราศีเมถุน", english:"Gemini",      symbol:"♊", dateRange:"21 พ.ค. – 20 มิ.ย.", element:"อากาศ", ruling:"ดาวพุธ",      emoji:"👯", color:"#f39c12" },
        4:  { name:"ราศีกรกฎ",  english:"Cancer",      symbol:"♋", dateRange:"21 มิ.ย. – 22 ก.ค.", element:"น้ำ",   ruling:"ดาวจันทร์",   emoji:"🦀", color:"#95a5a6" },
        5:  { name:"ราศีสิงห์", english:"Leo",         symbol:"♌", dateRange:"23 ก.ค. – 22 ส.ค.",  element:"ไฟ",    ruling:"ดาวอาทิตย์",  emoji:"🦁", color:"#f4d03f" },
        6:  { name:"ราศีกันย์", english:"Virgo",       symbol:"♍", dateRange:"23 ส.ค. – 22 ก.ย.",  element:"ดิน",   ruling:"ดาวพุธ",      emoji:"👰", color:"#3498db" },
        7:  { name:"ราศีตุลย์", english:"Libra",       symbol:"♎", dateRange:"23 ก.ย. – 22 ต.ค.", element:"อากาศ", ruling:"ดาวศุกร์",    emoji:"⚖️", color:"#9b59b6" },
        8:  { name:"ราศีแมง",   english:"Scorpio",     symbol:"♏", dateRange:"23 ต.ค. – 21 พ.ย.", element:"น้ำ",   ruling:"ดาวพลูโต",    emoji:"🦂", color:"#c0392b" },
        9:  { name:"ราศีธนู",   english:"Sagittarius", symbol:"♐", dateRange:"22 พ.ย. – 21 ธ.ค.", element:"ไฟ",    ruling:"ดาวพฤหัสบดี", emoji:"🏹", color:"#8e44ad" },
        10: { name:"ราศีมังกร", english:"Capricorn",   symbol:"♑", dateRange:"22 ธ.ค. – 19 ม.ค.", element:"ดิน",   ruling:"ดาวเสาร์",    emoji:"🐐", color:"#607d8b" },
        11: { name:"ราศีกุมภ์", english:"Aquarius",    symbol:"♒", dateRange:"20 ม.ค. – 18 ก.พ.", element:"อากาศ", ruling:"ดาวยูเรนัส",  emoji:"🏺", color:"#5dade2" },
        12: { name:"ราศีมีน",   english:"Pisces",      symbol:"♓", dateRange:"19 ก.พ. – 20 มี.ค.", element:"น้ำ",  ruling:"ดาวเนปจูน",   emoji:"🐟", color:"#1abc9c" },
    };

    // ลักษณะประจำราศี — อิงธาตุ โหมด และดาวนำตามหลักโหราศาสตร์ตะวันตกคลาสสิก
    const DASH_MONTHLY_FORTUNES = {
        1:  { // เมษ — ไฟ Cardinal ดาวอังคาร
            love:"⭐⭐⭐⭐",    work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐",      finance:"⭐⭐⭐",
            loveText:"กล้าแสดงออก แต่รีบร้อน อีโก้สูง",
            workText:"พลังนำ ริเริ่มได้ดี แต่ขาดความอดทนระยะยาว",
            healthText:"พลังสูง แต่เสี่ยงอักเสบ อุบัติเหตุจากความรีบ",
            financeText:"กล้าเสี่ยง ได้เร็วเสียเร็ว ระวังตัดสินใจด้วยอารมณ์" },
        2:  { // พฤษภ — ดิน Fixed ดาวศุกร์
            love:"⭐⭐⭐⭐⭐",  work:"⭐⭐⭐⭐",    health:"⭐⭐⭐⭐",    finance:"⭐⭐⭐⭐⭐",
            loveText:"ซื่อสัตย์ มีเสน่ห์ทางกาย แต่หึงหวงและยึดติด",
            workText:"อดทน เชื่อถือได้ เหมาะงานต้องความสม่ำเสมอและฝีมือ",
            healthText:"แข็งแรงพื้นฐานดี ระวังโรคที่คอ ต่อมไทรอยด์",
            financeText:"เก็บออมเก่ง สัญชาตญาณการเงินดี ชอบความมั่นคง" },
        3:  { // เมถุน — อากาศ Mutable ดาวพุธ
            love:"⭐⭐⭐⭐",    work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐",      finance:"⭐⭐⭐⭐",
            loveText:"เสน่ห์การสื่อสาร สนุกสนาน แต่อารมณ์ไม่คงเส้นคงวา",
            workText:"สื่อสารเก่ง ปรับตัวได้ เหมาะงานพบปะ เขียน สอน",
            healthText:"ระบบประสาทไว ระวังความเครียด นอนไม่หลับ ปัญหาปอด",
            financeText:"รายได้หลายช่องทาง แต่รายจ่ายก็หลากหลายเช่นกัน" },
        4:  { // กรกฎ — น้ำ Cardinal ดาวจันทร์
            love:"⭐⭐⭐⭐⭐",  work:"⭐⭐⭐⭐",    health:"⭐⭐⭐",      finance:"⭐⭐⭐⭐",
            loveText:"ดูแลเอาใจใส่ อ่อนโยน แต่อ่อนไหวและหวงแหนสูง",
            workText:"สัญชาตญาณดี เข้าใจผู้คน เหมาะงานดูแล บริการ",
            healthText:"อารมณ์ส่งผลต่อสุขภาพโดยตรง ระวังกระเพาะ ระบบย่อยอาหาร",
            financeText:"สัญชาตญาณออมดี แต่อาจใช้จ่ายเมื่ออารมณ์แปรปรวน" },
        5:  { // สิงห์ — ไฟ Fixed ดาวอาทิตย์
            love:"⭐⭐⭐⭐⭐",  work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐⭐",    finance:"⭐⭐⭐",
            loveText:"โรแมนติก มีเสน่ห์ เอื้อเฟื้อ แต่ต้องการคำชื่นชมตลอด",
            workText:"ผู้นำโดยธรรมชาติ สร้างสรรค์ เหมาะบทบาทหัวหน้า",
            healthText:"พลังงานสูง แต่ระวังโรคหัวใจ ความดัน (จุดอ่อนของราศีนี้)",
            financeText:"ใจกว้าง อาจใช้จ่ายเพื่อภาพลักษณ์ ต้องฝึกการออม" },
        6:  { // กันย์ — ดิน Mutable ดาวพุธ
            love:"⭐⭐⭐",      work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐⭐",    finance:"⭐⭐⭐⭐",
            loveText:"ดูแลละเอียดอ่อน แต่วิจารณ์ตัวเองและคนรักมากเกินไป",
            workText:"วิเคราะห์เก่ง ถี่ถ้วน เหมาะงานต้องความแม่นยำและบริการ",
            healthText:"ใส่ใจสุขภาพ แต่ระวังวิตกกังวลเรื่องสุขภาพเกินเหตุ",
            financeText:"รอบคอบ วางแผนดี แต่อาจประหยัดจนกระทบคุณภาพชีวิต" },
        7:  { // ตุลย์ — อากาศ Cardinal ดาวศุกร์
            love:"⭐⭐⭐⭐⭐",  work:"⭐⭐⭐⭐",    health:"⭐⭐⭐⭐",    finance:"⭐⭐⭐",
            loveText:"มีเสน่ห์ โรแมนติก แต่ลังเลในการตัดสินใจและพึ่งพาคู่สูง",
            workText:"เจรจาเก่ง ยุติธรรม เหมาะงานไกล่เกลี่ยและสร้างสัมพันธ์",
            healthText:"ระวังโรคไต ต่อมไร้ท่อ (จุดอ่อนของราศีนี้)",
            financeText:"ชอบความหรูหรา ต้องฝึกวินัยทางการเงินให้สมดุล" },
        8:  { // แมง — น้ำ Fixed ดาวพลูโต+อังคาร
            love:"⭐⭐⭐⭐",    work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐",      finance:"⭐⭐⭐⭐⭐",
            loveText:"ลึกซึ้ง ทรงพลัง แต่อิจฉา ครอบครอง ต้องการความไว้วางใจสูง",
            workText:"มุ่งมั่น เจาะลึก เหมาะงานวิจัย สืบสวน บริหารเงิน",
            healthText:"พลังฟื้นตัวดี แต่ระวังระบบสืบพันธุ์ ความเครียดสะสม",
            financeText:"เข้าใจการเงินและการลงทุนลึก จัดการทรัพย์สินได้ดี" },
        9:  { // ธนู — ไฟ Mutable ดาวพฤหัสบดี
            love:"⭐⭐⭐⭐",    work:"⭐⭐⭐⭐",    health:"⭐⭐⭐⭐⭐",  finance:"⭐⭐⭐⭐",
            loveText:"มีอิสระ ผจญภัย มีแรงบันดาลใจ แต่กลัวการผูกมัด",
            workText:"มองภาพรวมดี มีแรงบันดาลใจ แต่ขาดความสนใจในรายละเอียด",
            healthText:"พลังงานสูง สุขภาพแข็งแกร่ง ระวังบาดเจ็บที่สะโพก ต้นขา",
            financeText:"โชคลาภมาพร้อมดาวพฤหัสบดี แต่ต้องวางแผนระยะยาว" },
        10: { // มังกร — ดิน Cardinal ดาวเสาร์
            love:"⭐⭐⭐",      work:"⭐⭐⭐⭐⭐",  health:"⭐⭐⭐",      finance:"⭐⭐⭐⭐⭐",
            loveText:"จริงจัง ซื่อสัตย์ มั่นคง แต่แสดงอารมณ์และแสดงความรักยาก",
            workText:"ทะเยอทะยาน อดทน วางแผนดี เหมาะผู้บริหารและงานระยะยาว",
            healthText:"ระวังกระดูก ข้อต่อ เข่า ผิวหนัง (จุดอ่อนของราศีนี้)",
            financeText:"ประหยัด วางแผนดี สะสมทรัพย์ระยะยาวได้ดีที่สุด" },
        11: { // กุมภ์ — อากาศ Fixed ดาวยูเรนัส+เสาร์
            love:"⭐⭐⭐",      work:"⭐⭐⭐⭐",    health:"⭐⭐⭐⭐",    finance:"⭐⭐⭐",
            loveText:"มีมิตรมาก แต่ความลึกซึ้งทางอารมณ์ทำได้ยาก",
            workText:"คิดสร้างสรรค์ นวัตกรรม เหมาะงานล้ำหน้าและทำงานกลุ่ม",
            healthText:"ระวังระบบไหลเวียนโลหิต ข้อเท้า ความเครียดสะสม",
            financeText:"แนวคิดหารายได้ใหม่ดี แต่รายได้ไม่สม่ำเสมอ ต้องมีสำรอง" },
        12: { // มีน — น้ำ Mutable ดาวเนปจูน+พฤหัสบดี
            love:"⭐⭐⭐⭐⭐",  work:"⭐⭐⭐",      health:"⭐⭐⭐",      finance:"⭐⭐⭐",
            loveText:"อ่อนโยน เสียสละ เข้าใจผู้อื่นลึก แต่ระวังถูกเอาเปรียบ",
            workText:"สัญชาตญาณดี สร้างสรรค์ เหมาะงานศิลปะ ดูแลผู้อื่น",
            healthText:"ระวังการหลีกหนีจากความจริง ปัญหาเท้า ระบบน้ำเหลือง",
            financeText:"ใจบุญอาจให้เงินคนอื่นมากเกินไป ต้องดูแลความมั่นคงตัวเอง" },
    };

    // พยากรณ์ปี 2569/2026 — อิง transit จริง: Jupiter Cancer→Leo (~26 ก.ค.), Saturn Aries(จาก 13 ก.พ.), Uranus Taurus→Gemini(25 เม.ย.), Neptune Aries(26 ม.ค.), Pluto Aquarius
    const DASH_YEARLY_2026 = {
        1:  "Saturn+Neptune ใน Aries กดดัน + Jupiter Cancer square H1 — ระวังตัดสินใจด้วยอารมณ์ หลัง เม.ย. Uranus Gemini sextile + Jupiter Leo trine ช่วยให้ H2 ดีขึ้นมาก",
        2:  "Uranus ยังอยู่ใน Taurus ถึง 25 เม.ย. — Q1 ยังผันผวน หลังนั้น Uranus พ้น มั่นคงขึ้น Jupiter Cancer sextile ดีครึ่งแรก ระวัง Jupiter Leo square H2",
        3:  "ต้นปีสงบ Uranus ยังไม่เข้า — หลัง 25 เม.ย. Uranus เข้า Gemini conjunction พลิกโฉมชีวิต ปลายปี Jupiter Leo sextile เปิดโอกาสใหม่",
        4:  "Jupiter ใน Cancer ครึ่งแรกปี = โชคลาภสูงสุดในรอบ 12 ปี — ปีดีที่สุดสำหรับกรกฎ เหมาะขยายกิจการ ครอบครัว การลงทุน",
        5:  "Q1 Uranus Taurus square สิงห์ (ต้องรับมือ) — หลัง เม.ย. Uranus Gemini sextile ผ่อนคลาย และ Jupiter เข้า Leo ก.ค. ดาวโชคลาภมาสถิตในราศีตัวเอง",
        6:  "Q1 Uranus Taurus trine กันย์ (โอกาสดี) แล้ว Uranus Gemini square Q2-Q4 (ปรับตัว) — Jupiter Cancer sextile ครึ่งแรกสนับสนุนทักษะและสุขภาพ",
        7:  "Saturn Aries opposition ตุลย์ตลอดปี + Jupiter Cancer square H1 (ยาก) — หลัง เม.ย. Uranus Gemini trine + Jupiter Leo sextile H2 ช่วยพบทางออก",
        8:  "Q1 Uranus Taurus opposition แมง (ผันผวน) แต่ Jupiter Cancer trine ครึ่งแรก (โชคดีมาก) — ครึ่งหลัง Jupiter Leo square ต้องระวังความขัดแย้ง",
        9:  "Saturn Aries trine ธนูสนับสนุนวินัย — หลัง เม.ย. Uranus Gemini opposition (แผนผันผวน) แต่ Jupiter Leo trine H2 ดึงโอกาสกลับมา",
        10: "Saturn Aries square มังกรตลอดปี + Jupiter Cancer opposition H1 (ระวังขยายเกิน) — Q1 Uranus Taurus trine ช่วยเปิดทางใหม่",
        11: "Q1 Uranus Taurus square กุมภ์ (ตึงเครียด) → Q2-Q4 Uranus Gemini trine (นวัตกรรม) + Pluto เปลี่ยนแปลงเชิงลึก + Jupiter Leo opposition H2",
        12: "Jupiter Cancer trine + Uranus Taurus sextile ดี Q1 — Neptune ออก 26 ม.ค. ความชัดเจนมา แต่ Uranus Gemini square Q2-Q4 ต้องปรับตัว",
    };

    // ===== Helper functions =====

    function fmtTime(totalMins) {
        const t = ((totalMins % 1440) + 1440) % 1440;
        return `${String(Math.floor(t / 60)).padStart(2,'0')}:${String(t % 60).padStart(2,'0')} น.`;
    }

    function getYarm(dayIndex, totalMins) {
        const chart = window.YARM_CHART || DASH_YARM_CHART;
        const info  = window.YARM_INFO  || DASH_YARM_INFO;

        let yarmIdx, isDay, startMins;
        if (totalMins >= 360 && totalMins < 1080) {
            isDay    = true;
            yarmIdx  = Math.floor((totalMins - 360) / 90);
            startMins = 360 + yarmIdx * 90;
        } else {
            isDay = false;
            const nightMins = totalMins < 360 ? totalMins + 1440 : totalMins;
            yarmIdx   = Math.min(Math.floor((nightMins - 1080) / 90), 7);
            startMins = 1080 + yarmIdx * 90;
        }

        const row     = isDay ? chart.day[dayIndex] : chart.night[dayIndex];
        const planet  = row ? row[yarmIdx] : 0;
        const yarmInf = info[planet] || DASH_YARM_INFO[0];
        return { yarmIdx, isDay, startMins, endMins: startMins + 90, planet, info: yarmInf };
    }

    function getElapsed(totalMins, isDay, startMins) {
        if (isDay) return totalMins - startMins;
        return totalMins >= 1080 ? totalMins - startMins : (totalMins + 1440) - startMins;
    }

    function getNextYarm(dayIndex, endMins) {
        const nextTotal = endMins % 1440;
        const nextDay   = endMins >= 1440 ? (dayIndex + 1) % 7 : dayIndex;
        const { info }  = getYarm(nextDay, nextTotal);
        return { info, startTime: fmtTime(endMins) };
    }

    function getRahu(totalMins) {
        return DASH_RAHU_SLOTS.find(s => totalMins >= s.start && totalMins < s.end)
            || DASH_RAHU_SLOTS[0];
    }

    function getSunZodiac(month, day) {
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 1;
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 2;
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 3;
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 4;
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 5;
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 6;
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 7;
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 8;
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 9;
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 10;
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 11;
        return 12;
    }

    function buildZodiacDetail(signNum) {
        const s = DASH_ZODIAC_SIGNS[signNum];
        const f = DASH_MONTHLY_FORTUNES[signNum];
        const y = DASH_YEARLY_2026[signNum] || '';
        const eColors = { 'ไฟ':'#ef4444', 'ดิน':'#f59e0b', 'น้ำ':'#38bdf8', 'อากาศ':'#2dd4bf' };
        const ec = eColors[s.element] || '#fbbf24';
        return `<div style="animation:fadeZodiac 0.22s ease;padding:12px 0 4px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span style="font-size:2.2rem;">${s.emoji}</span>
            <div>
              <div style="color:#ffffff;font-size:1.15rem;font-weight:800;">${s.name}
                <span style="color:#94a3b8;font-size:0.88rem;font-weight:normal;margin-left:4px;">${s.symbol} ${s.english}</span>
              </div>
              <div style="color:#cbd5e1;font-size:0.78rem;">ช่วงวันเกิด: ${s.dateRange}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <span style="background:${ec}25;border:1px solid ${ec}77;color:${ec};border-radius:20px;padding:4px 12px;font-size:0.78rem;font-weight:700;">
              ธาตุ${s.element}
            </span>
            <span style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);color:#fbbf24;border-radius:20px;padding:4px 12px;font-size:0.78rem;font-weight:700;">
              ดาวเกษตร: ${s.ruling}
            </span>
          </div>
          <div style="color:#fbbf24;font-size:0.78rem;font-weight:700;letter-spacing:1px;margin-bottom:8px;"><i class="fas fa-calendar-alt mr-1"></i> ดวงประจำเดือน</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(244,114,182,0.3);border-radius:10px;padding:10px 12px;">
              <div style="color:#f472b6;font-size:0.75rem;font-weight:700;margin-bottom:3px;">❤ ความรัก <span style="letter-spacing:1px;">${f.love}</span></div>
              <div style="color:#f1f5f9;font-size:0.82rem;line-height:1.5;">${f.loveText}</div>
            </div>
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:10px 12px;">
              <div style="color:#34d399;font-size:0.75rem;font-weight:700;margin-bottom:3px;">💼 การงาน <span style="letter-spacing:1px;">${f.work}</span></div>
              <div style="color:#f1f5f9;font-size:0.82rem;line-height:1.5;">${f.workText}</div>
            </div>
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:10px 12px;">
              <div style="color:#38bdf8;font-size:0.75rem;font-weight:700;margin-bottom:3px;">💊 สุขภาพ <span style="letter-spacing:1px;">${f.health}</span></div>
              <div style="color:#f1f5f9;font-size:0.82rem;line-height:1.5;">${f.healthText}</div>
            </div>
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:10px 12px;">
              <div style="color:#fbbf24;font-size:0.75rem;font-weight:700;margin-bottom:3px;">💰 การเงิน <span style="letter-spacing:1px;">${f.finance}</span></div>
              <div style="color:#f1f5f9;font-size:0.82rem;line-height:1.5;">${f.financeText}</div>
            </div>
          </div>
          ${y ? `<div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:10px 14px;margin-bottom:10px;">
            <div style="color:#fbbf24;font-size:0.75rem;letter-spacing:1px;font-weight:700;margin-bottom:4px;"><i class="fas fa-crown mr-1"></i> ภาพรวมดวงปี 2569 (2026)</div>
            <div style="color:#f8fafc;font-size:0.86rem;line-height:1.65;">${y}</div>
          </div>` : ''}
          <button onclick="navigateTo('zodiacFortunePage')" style="width:100%;background:linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(99,102,241,0.2) 100%);border:1px solid rgba(245,158,11,0.35);border-radius:8px;color:#fde047;padding:8px 12px;font-size:0.84rem;font-weight:600;cursor:pointer;font-family:'Prompt',sans-serif;transition:all 0.2s;">
            <i class="fas fa-star mr-1"></i> ดูพยากรณ์ 12 ราศีฉบับเต็ม
          </button>
        </div>`;
    }

    window.showZodiacDetail = function (signNum) {
        const el = document.getElementById('dashZodiacDetail');
        if (!el) return;
        el.innerHTML = buildZodiacDetail(signNum);
        document.querySelectorAll('.db-zsign').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById('db-zsign-' + signNum);
        if (btn) btn.classList.add('active');
        window._dashActiveZodiac = signNum;
    };

    // ===== CSS inject (ทำครั้งเดียว) =====
    function injectCSS() {
        if (document.getElementById('dashCSS')) return;
        const s = document.createElement('style');
        s.id = 'dashCSS';
        s.textContent = `
            .dash-wrapper {
                max-width: 900px;
                margin: 0 auto;
                padding: 10px 14px 40px;
                font-family: 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .db-card {
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.88) 100%);
                border: 1px solid rgba(245, 158, 11, 0.28);
                border-radius: 16px;
                padding: 18px 20px;
                margin-bottom: 14px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
                backdrop-filter: blur(12px);
                transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .db-card:hover {
                border-color: rgba(245, 158, 11, 0.5);
                box-shadow: 0 10px 30px rgba(245, 158, 11, 0.12);
            }
            .db-label {
                color: #fbbf24;
                font-size: 0.85rem;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .db-grid2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 14px;
                margin-bottom: 14px;
            }
            @media (max-width: 640px) {
                .db-grid2 { grid-template-columns: 1fr; }
            }
            .db-qbtn {
                flex: 1 1 calc(33.333% - 8px);
                min-width: 140px;
                background: linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
                border: 1px solid rgba(245, 158, 11, 0.28);
                border-radius: 8px;
                color: #fde047;
                padding: 8px 12px;
                font-size: 0.82rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.18s ease;
                font-family: 'Prompt', sans-serif;
                text-align: center;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .db-qbtn:hover  {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(99, 102, 241, 0.25) 100%);
                border-color: #fbbf24;
                transform: translateY(-1px);
                color: #ffffff;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
            }
            .db-qbtn:active { transform: translateY(0); }
            .db-taboo-row {
                font-size: 0.85rem;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
                line-height: 1.6;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .db-taboo-row:last-child { border-bottom: none; }
            .db-zodiac-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 6px;
                margin-bottom: 12px;
            }
            @media (max-width: 600px) {
                .db-zodiac-grid { grid-template-columns: repeat(4, 1fr); }
            }
            .db-zsign {
                background: rgba(15, 23, 42, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                padding: 10px 4px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
                font-family: 'Prompt', sans-serif;
                font-size: 0.78rem;
                color: #cbd5e1;
                line-height: 1.4;
            }
            .db-zsign:hover  {
                background: rgba(245, 158, 11, 0.18);
                border-color: rgba(245, 158, 11, 0.6);
                color: #ffffff;
                transform: translateY(-2px);
            }
            .db-zsign:active { transform: translateY(0); }
            .db-zsign.active {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(99, 102, 241, 0.4) 100%);
                border-color: #fbbf24;
                color: #fbbf24;
                font-weight: 700;
                box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
            }
            @keyframes fadeZodiac {
                from { opacity: 0; transform: translateY(6px); }
                to   { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(s);
    }

    // ===== Render =====
    function render() {
        const container = document.getElementById('dashboardContainer');
        if (!container) return;

        const now      = new Date();
        const dayIdx   = now.getDay();
        const totalMin = now.getHours() * 60 + now.getMinutes();

        const DAYS_TH   = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
        const MONTHS_TH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
                           "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

        const dayName = DAYS_TH[dayIdx];
        const dateStr = `วัน${dayName}ที่ ${now.getDate()} ${MONTHS_TH[now.getMonth()]} พ.ศ. ${now.getFullYear() + 543}`;
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} น.`;

        // ยาม
        const { isDay, startMins, endMins, planet, info: yarmInf } = getYarm(dayIdx, totalMin);
        const elapsed   = getElapsed(totalMin, isDay, startMins);
        const progress  = Math.min(100, Math.max(0, Math.round(elapsed / 90 * 100)));
        const remMins   = Math.max(0, 90 - elapsed);
        const remStr    = remMins >= 60
            ? `${Math.floor(remMins / 60)} ชม. ${remMins % 60} นาที`
            : `${remMins} นาที`;
        const next      = getNextYarm(dayIdx, endMins);
        const yStyle    = YARM_CARD_STYLE[planet] || YARM_CARD_STYLE[0];

        // ข้อมูลประจำวัน
        const colors  = DASH_DAY_COLORS[dayName];
        const element = DASH_DAY_ELEMENT[dayName] || '-';
        const dir     = DASH_DAY_DIRECTION[dayName];
        const ghost   = DASH_GHOST_DIRECTION[dayName] || '-';
        const spirit  = DASH_SPIRIT_DIRECTION[dayName];
        const taboo   = DASH_TABOO[dayIdx];
        const rahu    = getRahu(totalMin);

        const eColor  = ELEM_COLOR[element] || '#d4af37';
        const eIcon   = ELEM_ICON[element]  || '✨';

        // ราศีดวงอาทิตย์วันนี้
        const todayZodiacNum  = getSunZodiac(now.getMonth() + 1, now.getDate());
        const activeZodiac    = window._dashActiveZodiac !== undefined ? window._dashActiveZodiac : todayZodiacNum;
        const zodiacDetailHTML = buildZodiacDetail(activeZodiac);

        // Color swatches HTML
        const swatchHTML = colors
            ? colors.hex.map((hex, i) => `
                <span style="display:inline-flex;align-items:center;margin:3px 10px 3px 0;background:rgba(255,255,255,0.06);padding:4px 10px;border-radius:20px;border:1px solid rgba(255,255,255,0.12);">
                    <span style="width:16px;height:16px;border-radius:50%;background:${hex};
                          border:2px solid rgba(255,255,255,0.6);display:inline-block;margin-right:6px;flex-shrink:0;box-shadow:0 0 6px ${hex};"></span>
                    <span style="color:#f1f5f9;font-size:0.86rem;font-weight:500;">${colors.colors[i]}</span>
                </span>`).join('')
            : '<span style="color:#94a3b8">-</span>';

        container.innerHTML = `
<div class="dash-wrapper">

  <!-- HEADER HERO -->
  <div style="text-align:center;padding:26px 16px 20px;background:radial-gradient(ellipse at top, rgba(99,102,241,0.25) 0%, rgba(15,23,42,0) 70%);margin-bottom:14px;border-radius:20px;">
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);padding:4px 16px;border-radius:30px;color:#fbbf24;font-size:0.82rem;font-weight:700;letter-spacing:1px;margin-bottom:8px;">
      <i class="fas fa-sparkles"></i> สยามโหรามงคล · สรุปดวงวันนี้
    </div>
    <div style="color:#ffffff;font-size:1.45rem;font-weight:700;margin:6px 0 2px;">${dateStr}</div>
    <div id="dashLiveClock" style="color:#fbbf24;font-size:2.4rem;font-weight:800;letter-spacing:3px;font-family:'Courier New', monospace;text-shadow:0 0 20px rgba(245,158,11,0.5);">${timeStr}</div>
  </div>

  <!-- YARM CARD (Hero Card) -->
  <div style="background:${yStyle.bg};border:2px solid ${yStyle.border};border-radius:20px;
              padding:22px 20px;margin-bottom:14px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.4);position:relative;">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
      <div>
        <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(0,0,0,0.3);padding:3px 12px;border-radius:20px;color:rgba(255,255,255,0.9);font-size:0.75rem;font-weight:600;letter-spacing:1px;margin-bottom:6px;">
          ${isDay ? '☀️ ยามกลางวัน' : '🌙 ยามกลางคืน'}
        </div>
        <div style="color:#ffffff;font-size:2rem;font-weight:800;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,0.4);">${yarmInf.name}</div>
        <div style="color:rgba(255,255,255,0.95);font-size:0.95rem;margin-top:4px;font-weight:500;">✦ ${yarmInf.trait}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;background:rgba(0,0,0,0.25);padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);">
        <div style="color:rgba(255,255,255,0.7);font-size:0.75rem;">ช่วงเวลายามนี้</div>
        <div style="color:#ffffff;font-size:1.05rem;font-weight:700;">${fmtTime(startMins)} – ${fmtTime(endMins)}</div>
        <div style="color:#fde047;font-size:0.82rem;margin-top:2px;font-weight:600;"><i class="fas fa-hourglass-half"></i> เหลืออีก ${remStr}</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div style="height:8px;background:rgba(0,0,0,0.3);border-radius:4px;margin:16px 0 6px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
      <div style="height:100%;width:${progress}%;border-radius:4px;background:linear-gradient(90deg, #fde047, #ffffff);box-shadow:0 0 10px rgba(255,255,255,0.8);"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:rgba(255,255,255,0.75);margin-bottom:14px;font-weight:500;">
      <span>เริ่ม ${fmtTime(startMins)}</span><span style="color:#fde047;font-weight:700;">${progress}%</span><span>สิ้นสุด ${fmtTime(endMins)}</span>
    </div>

    <!-- ดี/เลี่ยงในยามนี้ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:12px 14px;">
        <div style="color:#4ade80;font-size:0.8rem;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
          <i class="fas fa-check-circle"></i> ดีในยามนี้
        </div>
        <div style="color:#f0fdf4;font-size:0.88rem;line-height:1.55;">${yarmInf.good}</div>
      </div>
      <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(248,113,113,0.3);border-radius:12px;padding:12px 14px;">
        <div style="color:#f87171;font-size:0.8rem;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
          <i class="fas fa-times-circle"></i> ควรหลีกเลี่ยง
        </div>
        <div style="color:#fef2f2;font-size:0.88rem;line-height:1.55;">${yarmInf.bad}</div>
      </div>
    </div>
  </div>

  <!-- ROW 1: สีมงคล + ธาตุ -->
  <div class="db-grid2">
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-palette"></i> สีมงคลเสริมโชคประจำวัน</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">${swatchHTML}</div>
    </div>
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-fire-alt"></i> ธาตุประจำวันเกิดเมือง</div>
      <div style="margin-top:6px;">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;
                    border-radius:30px;border:1.5px solid ${eColor};background:linear-gradient(135deg, ${eColor}22, ${eColor}44);box-shadow:0 4px 12px ${eColor}33;">
          <span style="font-size:1.5rem;">${eIcon}</span>
          <span style="color:#ffffff;font-size:1.1rem;font-weight:700;">ธาตุ${element}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ROW 2: ทิศมงคล + ราหูจร -->
  <div class="db-grid2">
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-compass"></i> ทิศมงคลเสริมพลัง</div>
      ${dir ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
        <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(52,211,153,0.3);padding:10px 12px;border-radius:10px;">
          <div style="color:#34d399;font-size:0.75rem;font-weight:600;">ทิศเดช (อำนาจ)</div>
          <div style="color:#ffffff;font-size:1rem;font-weight:700;margin-top:2px;">
            ${DIR_ARROW[dir.dech]||'•'} ${dir.dech}
          </div>
        </div>
        <div style="background:rgba(99,102,241,0.15);border:1px solid rgba(165,180,252,0.3);padding:10px 12px;border-radius:10px;">
          <div style="color:#a5b4fc;font-size:0.75rem;font-weight:600;">ทิศศรี (โชคลาภ)</div>
          <div style="color:#ffffff;font-size:1rem;font-weight:700;margin-top:2px;">
            ${DIR_ARROW[dir.sri]||'•'} ${dir.sri}
          </div>
        </div>
      </div>` : '<span style="color:#94a3b8">-</span>'}
    </div>
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-ban"></i> ราหูจรช่วงเวลานี้</div>
      <div style="background:rgba(239,68,68,0.12);border:1px solid rgba(248,113,113,0.3);padding:10px 14px;border-radius:10px;margin-top:6px;">
        <div style="color:#f87171;font-size:1.1rem;font-weight:800;">
          ${DIR_ARROW[rahu.dir]||'•'} ทิศ${rahu.dir}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
          <span style="color:#cbd5e1;font-size:0.78rem;">ช่วงเวลา: ${rahu.label}</span>
          <span style="color:#fca5a5;font-size:0.75rem;font-weight:600;"><i class="fas fa-exclamation-triangle"></i> เลี่ยงเผชิญหน้า</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ROW 3: ทิศเดินทาง + ข้อปฏิบัติ -->
  <div class="db-grid2">
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-route"></i> ทิศเดินทาง & เทพเจ้าคุ้มครอง</div>
      ${spirit ? `
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);padding:6px 10px;border-radius:8px;">
          <span style="color:#a7f3d0;font-size:0.8rem;font-weight:600;"><i class="fas fa-dove mr-1"></i> เทวดาจร (ดีมาก):</span>
          <span style="color:#ffffff;font-size:0.88rem;font-weight:700;">${DIR_ARROW[spirit.deva]||'•'} ${spirit.deva}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);padding:6px 10px;border-radius:8px;">
          <span style="color:#fca5a5;font-size:0.8rem;font-weight:600;"><i class="fas fa-skull-crossbones mr-1"></i> มฤตยูจร (เลี่ยง):</span>
          <span style="color:#ffffff;font-size:0.88rem;font-weight:700;">${DIR_ARROW[spirit.mritu]||'•'} ${spirit.mritu}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);padding:6px 10px;border-radius:8px;">
          <span style="color:#ef4444;font-size:0.8rem;font-weight:600;"><i class="fas fa-ghost mr-1"></i> ผีหลวง (ห้ามหันหน้าเข้า):</span>
          <span style="color:#ffffff;font-size:0.88rem;font-weight:700;">${DIR_ARROW[ghost]||'•'} ${ghost}</span>
        </div>
      </div>` : `
      <div>
        <div style="color:#cbd5e1;font-size:0.8rem;">ผีหลวง: ${DIR_ARROW[ghost]||'•'} ${ghost}</div>
      </div>`}
    </div>
    <div class="db-card" style="margin-bottom:0;">
      <div class="db-label"><i class="fas fa-list-check"></i> ข้อควรทำ & ข้อพึงหลีกเลี่ยงวันนี้</div>
      ${taboo ? `
      <div style="margin-top:6px;">
        <div style="color:#4ade80;font-size:0.75rem;font-weight:700;margin-bottom:4px;"><i class="fas fa-check-circle"></i> สิ่งที่ควรทำ:</div>
        <div style="margin-bottom:8px;">
          ${taboo.good.map(g =>
            `<div class="db-taboo-row" style="color:#f0fdf4;">
               <i class="fas fa-check" style="color:#4ade80;font-size:0.75rem;"></i> ${g}
             </div>`).join('')}
        </div>
        <div style="color:#f87171;font-size:0.75rem;font-weight:700;margin-bottom:4px;"><i class="fas fa-times-circle"></i> สิ่งที่ควรเลี่ยง:</div>
        <div>
          ${taboo.bad.map(b =>
            `<div class="db-taboo-row" style="color:#fef2f2;">
               <i class="fas fa-times" style="color:#f87171;font-size:0.75rem;"></i> ${b}
             </div>`).join('')}
        </div>
      </div>` : '<span style="color:#94a3b8">-</span>'}
    </div>
  </div>

  <!-- ยามถัดไป -->
  <div class="db-card" style="background:linear-gradient(135deg, rgba(30,27,75,0.95) 0%, rgba(15,23,42,0.9) 100%);border:1.5px solid rgba(245,158,11,0.4);
       display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div>
      <div class="db-label" style="margin-bottom:4px;"><i class="fas fa-forward"></i> จังหวะยามถัดไป (Next Transition)</div>
      <div style="color:#ffffff;font-size:1.25rem;font-weight:800;">${next.info.name}</div>
      <div style="color:#cbd5e1;font-size:0.88rem;">✦ ${next.info.trait}</div>
      <div style="color:#6ee7b7;font-size:0.82rem;margin-top:3px;font-weight:600;"><i class="fas fa-thumbs-up"></i> ดีสำหรับ: ${next.info.good}</div>
    </div>
    <div style="text-align:right;background:rgba(0,0,0,0.3);padding:10px 16px;border-radius:12px;border:1px solid rgba(245,158,11,0.25);">
      <div style="color:#fbbf24;font-size:0.75rem;font-weight:600;">เริ่มเวลา</div>
      <div style="color:#fde047;font-size:1.5rem;font-weight:800;font-family:'Courier New', monospace;">${next.startTime}</div>
    </div>
  </div>

  <!-- 12 ราศี -->
  <div class="db-card">
    <div class="db-label"><i class="fas fa-star"></i> 12 ราศี · ถอดรหัสดวงชะตา</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:12px 16px;
                background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;">
      <span style="font-size:2rem;">${DASH_ZODIAC_SIGNS[todayZodiacNum].emoji}</span>
      <div>
        <div style="color:#94a3b8;font-size:0.7rem;letter-spacing:1px;font-weight:600;">ราศีดวงอาทิตย์วันนี้ (Sun Sign)</div>
        <div style="color:#fbbf24;font-size:1.05rem;font-weight:800;">
          ${DASH_ZODIAC_SIGNS[todayZodiacNum].name}
          <span style="color:#ffffff;opacity:0.7;font-size:0.88rem;margin-left:4px;">${DASH_ZODIAC_SIGNS[todayZodiacNum].symbol}</span>
        </div>
        <div style="color:#cbd5e1;font-size:0.75rem;">${DASH_ZODIAC_SIGNS[todayZodiacNum].dateRange}</div>
      </div>
      <div style="margin-left:auto;text-align:right;">
        <div style="color:#94a3b8;font-size:0.7rem;font-weight:600;">ธาตุประจำราศี</div>
        <div style="color:${ELEM_COLOR[DASH_ZODIAC_SIGNS[todayZodiacNum].element]||'#fbbf24'};font-size:0.92rem;font-weight:700;">
          ${ELEM_ICON[DASH_ZODIAC_SIGNS[todayZodiacNum].element]||'✨'} ธาตุ${DASH_ZODIAC_SIGNS[todayZodiacNum].element}
        </div>
      </div>
    </div>
    <div class="db-zodiac-grid">
      ${Object.entries(DASH_ZODIAC_SIGNS).map(([num, s]) => `
        <button id="db-zsign-${num}" class="db-zsign${parseInt(num) === activeZodiac ? ' active' : ''}"
                onclick="showZodiacDetail(${num})">
          <div style="font-size:1.25rem;margin-bottom:2px;">${s.emoji}</div>
          <div>${s.name.replace('ราศี','')}</div>
        </button>`).join('')}
    </div>
    <div id="dashZodiacDetail">${zodiacDetailHTML}</div>
  </div>

  <!-- QUICK LINKS -->
  <div class="db-card">
    <div class="db-label"><i class="fas fa-bolt"></i> บริการพยากรณ์และคำนวณฤกษ์มงคล</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <button onclick="navigateTo('yarmPage')"        class="db-qbtn"><i class="fas fa-clock text-warning"></i> ตารางยามสามตา</button>
      <button onclick="navigateTo('reuxpage')"        class="db-qbtn"><i class="fas fa-scroll text-warning"></i> คำนวณฤกษ์มงคล</button>
      <button onclick="navigateTo('dailyTabooPage')"  class="db-qbtn"><i class="fas fa-ban text-danger"></i> ข้อห้ามประจำวัน</button>
      <button onclick="navigateTo('ubakong-yarm')"    class="db-qbtn"><i class="fas fa-road text-info"></i> ยามอุบากอง</button>
      <button onclick="navigateTo('auspiciousPage')"  class="db-qbtn"><i class="fas fa-calendar-alt text-success"></i> ปฏิทิน 100 ปี</button>
      <button onclick="navigateTo('weeklyColorSection')" class="db-qbtn"><i class="fas fa-palette text-purple"></i> สีมงคลประจำวัน</button>
    </div>
  </div>

  <!-- SHARE & NAVIGATION BUTTONS -->
  <div class="text-center my-3">
    <button class="btn btn-gold px-4 py-2 font-weight-bold" style="border-radius: 8px; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(245,158,11,0.35); display: inline-flex; align-items: center; gap: 8px;" onclick="generateShareDashboard()">
      <i class="fas fa-camera"></i> บันทึก & แชร์สรุปดวงวันนี้
    </button>
  </div>

  <div class="row pt-1" style="max-width: 480px; margin: 0 auto;">
    <div class="col-6">
      <button class="btn btn-outline-light btn-block py-2" style="border-radius:8px; font-size: 0.85rem; border-color:rgba(255,255,255,0.25); background: rgba(255,255,255,0.04);" onclick="navigateTo('mainpage')">
        <i class="fas fa-chevron-left mr-1"></i> ห้องพยากรณ์
      </button>
    </div>
    <div class="col-6">
      <button class="btn btn-outline-light btn-block py-2" style="border-radius:8px; font-size: 0.85rem; border-color:rgba(255,255,255,0.25); background: rgba(255,255,255,0.04);" onclick="goBack()">
        <i class="fas fa-home mr-1"></i> หน้าหลัก
      </button>
    </div>
  </div>
</div>`;

        startClock();
        
        // Save data for Share Card
        window.__dashData = {
            colors: colors ? colors.colors.join(', ') : '-',
            colorHex: colors ? colors.hex : [],
            dirDech: dir ? dir.dech : '-',
            dirSri: dir ? dir.sri : '-',
            element: element,
            eIcon: eIcon,
            tabooGood: taboo ? taboo.good[0] : 'ทำจิตใจให้ผ่องใส',
            tabooBad: taboo ? taboo.bad[0] : 'ระวังการใช้อารมณ์',
            yarmName: yarmInf.name,
            yarmTrait: yarmInf.trait,
            yarmTime: `${fmtTime(startMins)} – ${fmtTime(endMins)}`,
            isDay: isDay,
            dayName: dayName,
            dateStr: dateStr,
            ghost: ghost,
            rahuStart: rahu ? rahu.start : '-',
            rahuEnd: rahu ? rahu.end : '-'
        };
    }

    // Live clock (วินาที)
    function startClock() {
        if (window._dashClkIv) clearInterval(window._dashClkIv);
        window._dashClkIv = setInterval(() => {
            const el = document.getElementById('dashLiveClock');
            if (!el) { clearInterval(window._dashClkIv); return; }
            const n = new Date();
            el.textContent = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')} น.`;
        }, 1000);
    }

    // ===== Public =====
    window.initTodayDashboard = function () {
        injectCSS();
        render();
        // re-render ทุก 60 วินาที เพื่ออัปเดต progress bar ยาม
        if (window._dashRenderIv) clearInterval(window._dashRenderIv);
        window._dashRenderIv = setInterval(render, 60000);
    };

    window.generateShareDashboard = function() {
        if(typeof sharePrediction !== 'function') {
            Swal.fire('ข้อผิดพลาด', 'ไม่พบระบบแชร์ กรุณารีเฟรชหน้าเว็บ', 'error');
            return;
        }
        
        const data = window.__dashData || {};
        const todayStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric', weekday:'long' });
        
        // สร้าง Color Swatches
        const colorSwatches = (data.colorHex || []).map((hex, i) => {
            const names = (data.colors || '').split(', ');
            return `<span style="display:inline-flex;align-items:center;margin:4px 10px 4px 0;">
                <span style="width:28px;height:28px;border-radius:50%;background:${hex};border:3px solid rgba(255,255,255,0.3);display:inline-block;margin-right:8px;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span>
                <span style="color:#eee;font-size:24px;">${names[i] || ''}</span>
            </span>`;
        }).join('') || '<span style="color:#888">-</span>';

        const html = `
            <div style="text-align:center; margin-bottom:30px;">
                <div style="font-size:22px; color:#a0aec0;">📅 ${todayStr}</div>
            </div>

            <!-- ยามปัจจุบัน -->
            <div style="background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)); border: 2px solid rgba(212,175,55,0.4); border-radius:20px; padding:25px 30px; margin-bottom:25px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                    <div>
                        <div style="color:rgba(255,255,255,0.5); font-size:18px; letter-spacing:1px;">${data.isDay ? '☀ ยามกลางวัน' : '🌙 ยามกลางคืน'}</div>
                        <div style="color:#d4af37; font-size:36px; font-weight:bold; margin:5px 0;">${data.yarmName || '-'}</div>
                        <div style="color:rgba(255,255,255,0.7); font-size:20px;">${data.yarmTrait || ''}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:rgba(255,255,255,0.5); font-size:16px;">ช่วงเวลา</div>
                        <div style="color:#fff; font-size:26px; font-weight:bold;">${data.yarmTime || '-'}</div>
                    </div>
                </div>
            </div>

            <!-- Grid ข้อมูลประจำวัน -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:25px;">
                <!-- สีมงคล -->
                <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.3); border-radius:16px; padding:20px;">
                    <div style="color:#d4af37; font-size:20px; margin-bottom:10px;">🌟 สีมงคลวันนี้</div>
                    <div style="display:flex; flex-wrap:wrap;">${colorSwatches}</div>
                </div>
                <!-- ธาตุประจำวัน -->
                <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.3); border-radius:16px; padding:20px;">
                    <div style="color:#d4af37; font-size:20px; margin-bottom:10px;">${data.eIcon || '✨'} ธาตุประจำวัน</div>
                    <div style="font-size:34px; font-weight:bold; color:#fff;">${data.element || '-'}</div>
                </div>
                <!-- ทิศมงคล -->
                <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.3); border-radius:16px; padding:20px;">
                    <div style="color:#d4af37; font-size:20px; margin-bottom:10px;">🧭 ทิศเดช / ทิศศรี</div>
                    <div style="font-size:28px; font-weight:bold; color:#fff;">${data.dirDech} / ${data.dirSri}</div>
                </div>
                <!-- ราหูอมจันทร์ -->
                <div style="background:rgba(231,76,60,0.08); border:1px solid rgba(231,76,60,0.3); border-radius:16px; padding:20px;">
                    <div style="color:#e74c3c; font-size:20px; margin-bottom:10px;">⚠️ ราหูอมจันทร์</div>
                    <div style="font-size:28px; font-weight:bold; color:#ff6b6b;">${data.rahuStart} - ${data.rahuEnd}</div>
                </div>
            </div>

            <!-- ควรทำ / ควรเลี่ยง -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div style="background:rgba(46,204,113,0.08); border:2px solid rgba(46,204,113,0.4); padding:22px; border-radius:16px;">
                    <div style="color:#2ecc71; font-size:22px; font-weight:bold; margin-bottom:10px;">✓ ควรทำ</div>
                    <div style="font-size:22px; color:#fff; line-height:1.6;">${data.tabooGood || '-'}</div>
                </div>
                <div style="background:rgba(231,76,60,0.08); border:2px solid rgba(231,76,60,0.4); padding:22px; border-radius:16px;">
                    <div style="color:#e74c3c; font-size:22px; font-weight:bold; margin-bottom:10px;">✗ ควรหลีกเลี่ยง</div>
                    <div style="font-size:22px; color:#fff; line-height:1.6;">${data.tabooBad || '-'}</div>
                </div>
            </div>
        `;
        
        sharePrediction('สรุปดวงวันนี้ — วัน' + (data.dayName || ''), html);
    };

})();
