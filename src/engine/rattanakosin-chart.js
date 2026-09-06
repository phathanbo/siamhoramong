/**
 * 🏛️ Rattanakosin City Horoscope Engine (ระบบดวงชะตากรุงรัตนโกสินทร์)
 * สยามโหรามงคล (Siam Horamongkol)
 * 
 * วันสถาปนาเสาหลักเมือง: วันอาทิตย์ที่ ๒๑ เมษายน พ.ศ. ๒๓๒๕ (ค.ศ. 1782)
 * เวลา ๐๖:๕๔ น. (ย่ำรุ่ง ๙ บาท) ลัคนาสถิตราศีเมษ
 * รัชสมัยพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช (รัชกาลที่ ๑)
 */

const RattanakosinCityEngine = (function() {
    "use strict";

    const RASI_NAMES = [
        "เมษ", "พฤษภ", "มิถุน", "กรกฎ", "สิงห์", "กันย์",
        "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"
    ];

    const RASI_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

    // ข้อมูลวันสถาปนาดวงเมือง
    const CITY_FOUNDATION = {
        dateString: "21 เมษายน พ.ศ. 2325",
        timeString: "06:54 น. (ย่ำรุ่ง ๙ บาท)",
        dayOfWeek: "วันอาทิตย์",
        dayNumber: 1, // อาทิตย์
        beYear: 2325,
        ceYear: 1782,
        month: 4,
        day: 21,
        hour: 6,
        minute: 54,
        lunarDetail: "วันอาทิตย์ ขึ้น ๑๐ ค่ำ เดือน ๖ ปีขาล จัตวาศก จุลศักราช ๑๑๔๔",
        ascendant: {
            rasiIndex: 0, // ราศีเมษ
            rasiName: "เมษ",
            deg: 0,
            min: 54,
            triyangka: "ปฐมตรียางค์ ๑ (อังคาร)",
            navangka: "นวางค์ ๙ (อาทิตย์)",
            nakshatra: "อัศวินีนักษัตร",
            symbol: "♈"
        }
    };

    // ดวงดาวกำเนิดกรุงรัตนโกสินทร์ (ดวงเดิม / Natal Chart)
    const NATAL_PLANETS = [
        {
            num: 1,
            thNum: "๑",
            name: "อาทิตย์",
            rasiIndex: 0,
            rasiName: "เมษ",
            deg: 8,
            min: 15,
            bhava: "ตนุ",
            bhavaNum: 1,
            dignity: "มหาอุจจ์",
            element: "ไฟ",
            taksaRole: "บริวารเดิม",
            nature: "ผู้นำ, สถาบันหลัก, เอกราช, พระเกียรติยศ, ชาติวาสนา",
            meaning: "ดาวอาทิตย์สถิตราศีเมษ กุมลัคนาดวงเมือง ได้ตำแหน่ง 'มหาอุจจ์' ส่งผลให้ชาติไทยคงความเป็นเอกราช มีพระบารมีแห่งองค์พระมหากษัตริย์เป็นศูนย์รวมจิตใจ ชาติมีเกียรติภูมิ มั่นคงไม่สูญสิ้นความเป็นไทย"
        },
        {
            num: 2,
            thNum: "๒",
            name: "จันทร์",
            rasiIndex: 3,
            rasiName: "กรกฎ",
            deg: 16,
            min: 42,
            bhava: "พันธุ",
            bhavaNum: 4,
            dignity: "เกษตราธิบดี",
            element: "ดิน",
            taksaRole: "อายุเดิม",
            nature: "ประชาชน, ราษฎร, ผืนแผ่นดิน, อู่ข้าวอู่น้ำ, เกษตรกรรม",
            meaning: "ดาวจันทร์สถิตราศีกรกฎ ภพพันธุ ได้ตำแหน่ง 'เกษตราธิบดี' สะท้อนถึงผืนแผ่นดินที่อุดมสมบูรณ์ในน้ำมีปลาในนามีข้าว ประชาชนมีจิตใจโอบอ้อมอารี และความอยู่รอดปลอดภัยของคนในชาติ"
        },
        {
            num: 3,
            thNum: "๓",
            name: "อังคาร",
            rasiIndex: 1,
            rasiName: "พฤษภ",
            deg: 24,
            min: 10,
            bhava: "กดุมภะ",
            bhavaNum: 2,
            dignity: "ราชาโชค / ประ",
            element: "ลม",
            taksaRole: "เดชเดิม",
            nature: "ทหาร, ความมั่นคง, กล้าหาญ, กำลังทรัพย์, การสร้างชาติ",
            meaning: "ดาวอังคารเป็นตนุลัคน์และมรณะ สถิตราศีพฤษภ ภพกดุมภะ ได้ตำแหน่ง 'ราชาโชค' บ่งบอกถึงการปกป้องรักษาทรัพย์สมบัติแผ่นดินด้วยกำลังทหารและความเด็ดเดี่ยว แม้ต้องเผชิญวิกฤตเศรษฐกิจก็สามารถฟื้นตัวได้"
        },
        {
            num: 4,
            thNum: "๔",
            name: "พุธ",
            rasiIndex: 11,
            rasiName: "มีน",
            deg: 18,
            min: 30,
            bhava: "วินาศ",
            bhavaNum: 12,
            dignity: "ประ / นิจ",
            element: "น้ำ",
            taksaRole: "ศรีเดิม",
            nature: "การทูต, การเจรจา, การต่างประเทศ, สนธิสัญญา, ไหวพริบ",
            meaning: "ดาวพุธสถิตราศีมีน ภพวินาศ การเจรจาและการทูตระหว่างประเทศดำเนินไปด้วยความสุขุม ลุ่มลึก ลับลวงพราง สามารถผ่อนหนักเป็นเบาและรอดพ้นจากการตกเป็นอาณานิคมด้วยกุศโลบายทางการทูต"
        },
        {
            num: 5,
            thNum: "๕",
            name: "พฤหัสบดี",
            rasiIndex: 8,
            rasiName: "ธนู",
            deg: 12,
            min: 50,
            bhava: "ศุภะ",
            bhavaNum: 9,
            dignity: "เกษตราธิบดี",
            element: "ดิน",
            taksaRole: "อุตสาหะเดิม",
            nature: "พระพุทธศาสนา, ความยุติธรรม, ครูอาจารย์, กฎหมาย, จริยธรรม",
            meaning: "ดาวพฤหัสบดีสถิตราศีธนู ภพศุภะ ได้ตำแหน่ง 'เกษตราธิบดี' สถาบันพุทธศาสนาและคุณธรรมเป็นเสาค้ำจุนประเทศชาติ มีระบบนิติรัฐและครูบาอาจารย์คอยปกป้องคุ้มครองให้ชาติแคล้วคลาดปลอดภัย"
        },
        {
            num: 6,
            thNum: "๖",
            name: "ศุกร์",
            rasiIndex: 11,
            rasiName: "มีน",
            deg: 26,
            min: 0,
            bhava: "วินาศ",
            bhavaNum: 12,
            dignity: "มหาอุจจ์",
            element: "น้ำ",
            taksaRole: "กาลกิณีเดิม",
            nature: "ศิลปวัฒนธรรม, บันเทิง, การท่องเที่ยว, การเงินซ่อนเร้น, ต่างชาติ",
            meaning: "ดาวศุกร์สถิตราศีมีน ภพวินาศ ได้ตำแหน่ง 'มหาอุจจ์' แต่เป็นกาลกิณีวันเกิด ส่งผลให้ประเทศโดดเด่นอย่างยิ่งในด้านศิลปวัฒนธรรม เสน่ห์การท่องเที่ยว อาหาร และความบันเทิงระดับโลก แต่ต้องระวังเรื่องการใช้จ่ายฟุ่มเฟือยและอบายมุข"
        },
        {
            num: 7,
            thNum: "๗",
            name: "เสาร์",
            rasiIndex: 8,
            rasiName: "ธนู",
            deg: 15,
            min: 20,
            bhava: "ศุภะ",
            bhavaNum: 9,
            dignity: "มหาจักร",
            element: "ไฟ",
            taksaRole: "มูละเดิม",
            nature: "ความอดทน, โครงสร้างพื้นฐาน, การปฏิรูป, เกษตรกร, อสังหาริมทรัพย์",
            meaning: "ดาวเสาร์สถิตราศีธนู ภพศุภะ กุมดาวพฤหัสบดี ได้ตำแหน่ง 'มหาจักร' สะท้อนถึงการสร้างชาติที่ต้องผ่านการตรากตรำ การปฏิรูปโครงสร้างใหญ่ของประเทศ และความอดทนอย่างยิ่งยวดของบรรพบุรุษ"
        },
        {
            num: 8,
            thNum: "๘",
            name: "ราหู",
            rasiIndex: 7,
            rasiName: "พิจิก",
            deg: 22,
            min: 40,
            bhava: "มรณะ",
            bhavaNum: 8,
            dignity: "นิจ",
            element: "ลม",
            taksaRole: "มนตรีเดิม",
            nature: "การเปลี่ยนแปลง, การต่างแดน, เทคโนโลยี, ธุรกิจสีเทา, การพลิกผัน",
            meaning: "พระราหูสถิตราศีพิจิก ภพมรณะ ได้ตำแหน่ง 'นิจ' ช่วยลดทอนโทษภัยจากสิ่งมืดดำและอบายมุข ชาติสามารถปรับตัวเข้ากับการเปลี่ยนแปลงของโลก และฟื้นคืนชีพจากวิกฤติต่างๆ ได้อย่างน่าอัศจรรย์"
        },
        {
            num: 9,
            thNum: "๙",
            name: "เกตุ",
            rasiIndex: 1,
            rasiName: "พฤษภ",
            deg: 10,
            min: 15,
            bhava: "กดุมภะ",
            bhavaNum: 2,
            dignity: "เทวอิทธิฤทธิ์",
            element: "วิญญาณธาตุ",
            taksaRole: "เทพารักษ์",
            nature: "สิ่งศักดิ์สิทธิ์, พระสยามเทวาธิราช, เสาหลักเมือง, พระสยามฯ",
            meaning: "พระเกตุสถิตราศีพฤษภ ร่วมเรือนดาว ๓ ในภพการคลัง บ่งบอกถึงสิ่งศักดิ์สิทธิ์คู่บ้านคู่เมือง พระสยามเทวาธิราช และศาลหลักเมืองที่คอยปกปักรักษาผืนแผ่นดินไทยและพระคลังหลวงให้พ้นภัย"
        },
        {
            num: 0,
            thNum: "๐",
            name: "มฤตยู",
            rasiIndex: 0,
            rasiName: "เมษ",
            deg: 4,
            min: 30,
            bhava: "ตนุ",
            bhavaNum: 1,
            dignity: "ปฏิวัติ-เปลี่ยนแปลง",
            element: "อากาศธาตุ",
            taksaRole: "กาลอวกาศ",
            nature: "การปฏิรูปยุคสมัย, วิทยาศาสตร์, นวัตกรรม, การเปลี่ยนผ่าน",
            meaning: "ดาวมฤตยูกุมลัคนาดวงเมืองในราศีเมษ บ่งบอกถึงการเปลี่ยนผ่านสู่ยุคใหม่อย่างต่อเนื่อง การปฏิวัติอุตสาหกรรม เทคโนโลยีสมัยใหม่ และการปรับตัวให้ทันอารยธรรมสากลโลก"
        }
    ];

    // ความหมายของ 12 ภพในดวงเมือง
    const BHAVA_CITY_MEANING = [
        { name: "ตนุ (ราศีเมษ)", lord: "ดาวอังคาร (๓)", meaning: "ตัวตนของประเทศชาติ, ภาพลักษณ์, ประชาชาติ, ผู้นำสูงสุด, เกียรติภูมิและอธิปไตย" },
        { name: "กดุมภะ (ราศีพฤษภ)", lord: "ดาวศุกร์ (๖)", meaning: "คลังหลวง, เศรษฐกิจ, การเงินการธนาคาร, ทรัพย์สินแผ่นดิน, รายได้ประชาชาติ" },
        { name: "สหัชชะ (ราศีมิถุน)", lord: "ดาวพุธ (๔)", meaning: "ประเทศเพื่อนบ้าน, การคมนาคมขนส่ง, โทรคมนาคม, สื่อสารมวลชน, สนธิสัญญาระยะสั้น" },
        { name: "พันธุ (ราศีกรกฎ)", lord: "ดาวจันทร์ (๒)", meaning: "ผืนแผ่นดิน, อาณาเขต, ทรัพยากรธรรมชาติ, การเกษตร, บ้านเมือง, ความมั่นคงในชาติ" },
        { name: "ปุตตะ (ราศีสิงห์)", lord: "ดาวอาทิตย์ (๑)", meaning: "เยาวชน, การศึกษาขั้นต้น, การบันเทิง, ตลาดหุ้น, การลงทุนเก็งกำไร, ประชากรเกิดใหม่" },
        { name: "อริ (ราศีกันย์)", lord: "ดาวพุธ (๔)", meaning: "ศัตรูภายนอก, ปัญหาความขัดแย้ง, สาธารณสุข, โรคระบาด, ภาระหนี้สินของชาติ, แรงงาน" },
        { name: "ปัตนิ (ราศีตุลย์)", lord: "ดาวศุกร์ (๖)", meaning: "พันธมิตรต่างชาติ, คู่ค้า, การต่างประเทศ, ข้อตกลงระหว่างประเทศ, สงครามหรือสันติภาพ" },
        { name: "มรณะ (ราศีพิจิก)", lord: "ดาวอังคาร (๓)", meaning: "ความสูญเสีย, ภัยพิบัติธรรมชาติ, การสูญเสียบุคคลสำคัญ, หนี้สินต่างประเทศ, ภาษีมรดก" },
        { name: "ศุภะ (ราศีธนู)", lord: "ดาวพฤหัสบดี (๕)", meaning: "สถาบันศาสนา, ศาลสถิตยุติธรรม, กฎหมายสูงสุด, การอุดมศึกษา, ปรัชญาและศีลธรรม" },
        { name: "กัมมะ (ราศีมังกร)", lord: "ดาวเสาร์ (๗)", meaning: "รัฐบาล, คณะรัฐมนตรี, การบริหารราชการแผ่นดิน, ผู้นำรัฐบาล, ข้าราชการ, งานพัฒนาชาติ" },
        { name: "ลาภะ (ราศีกุมภ์)", lord: "พระราหู (๘)", meaning: "รัฐสภา, สมาชิกสภา, รายได้เข้าประเทศ, ผลประโยชน์ร่วมระหว่างประเทศ, พันธมิตรลับ" },
        { name: "วินาศ (ราศีมีน)", lord: "ดาวพฤหัสบดี (๕)", meaning: "ศัตรูลับ, การจารกรรม, กองทุนลับ, คุกตะราง, โรงพยาบาล, วิกฤตการณ์ที่คาดไม่ถึง" }
    ];

    // คำนวณอายุเมือง (ชันษาดวงเมือง) และทักษาจรประจำปี
    function calculateCityAgeAndTaksa(targetDate = new Date()) {
        const targetYear = targetDate.getFullYear();
        const targetMonth = targetDate.getMonth() + 1;
        const targetDay = targetDate.getDate();

        // 21 เมษายน พ.ศ. 2325 (1782)
        let fullYears = targetYear - CITY_FOUNDATION.ceYear;
        if (targetMonth < 4 || (targetMonth === 4 && targetDay < 21)) {
            fullYears -= 1;
        }
        const turningAge = fullYears + 1; // อายุย่างดวงเมือง

        // ลำดับทักษาเดิม (วันอาทิตย์): 1 (อาทิตย์), 2 (จันทร์), 3 (อังคาร), 4 (พุธ), 7 (เสาร์), 5 (พฤหัสบดี), 8 (ราหู), 6 (ศุกร์)
        const taksaPlanets = [1, 2, 3, 4, 7, 5, 8, 6];
        const planetNames = {
            1: "อาทิตย์ (๑)",
            2: "จันทร์ (๒)",
            3: "อังคาร (๓)",
            4: "พุธ (๔)",
            7: "เสาร์ (๗)",
            5: "พฤหัสบดี (๕)",
            8: "ราหู (๘)",
            6: "ศุกร์ (๖)"
        };

        // ทักษาจรตามอายุย่าง (นับเวียนขวา 8 ภูมิ)
        const jorOffset = (turningAge - 1) % 8;
        const taksaRoles = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
        
        const taksaJor = {};
        for (let i = 0; i < 8; i++) {
            const planetIdx = (jorOffset + i) % 8;
            const pNum = taksaPlanets[planetIdx];
            taksaJor[taksaRoles[i]] = {
                planetNum: pNum,
                planetName: planetNames[pNum]
            };
        }

        // ตรีวัยดวงเมือง (ช่วงละ 25 ปี หรือรอบวัย)
        const triWaiCycle = ((turningAge - 1) % 75);
        let currentWai = "ปฐมวัย (สร้างรากฐานและวัฒนธรรม)";
        if (triWaiCycle >= 50) currentWai = "ปัจฉิมวัย (การพัฒนาสู่ยุคแห่งปัญญาและสากล)";
        else if (triWaiCycle >= 25) currentWai = "มัชฌิมวัย (การขยายตัวทางเศรษฐกิจและความมั่นคง)";

        return {
            fullYears,
            turningAge,
            targetYearBE: targetYear + 543,
            taksaJor,
            currentWai,
            cityBirthday: `21 เมษายน พ.ศ. ${targetYear + 543} (ครบรอบ ${fullYears} ปี เต็ม)`
        };
    }

    // คำนวณตำแหน่งดาวจรปัจจุบัน (Transit Planets)
    function calculateTransitPlanets(targetDate = new Date()) {
        if (typeof SuriyayatraEngine !== "undefined" && typeof SuriyayatraEngine.calculateFullSuriyaPlanets === "function") {
            const suriya = SuriyayatraEngine.calculateFullSuriyaPlanets(targetDate);
            return suriya.list;
        }

        // Fallback Algorithm สำหรับคำนวณสมผุสดาวจรแบบดาราศาสตร์
        const y = targetDate.getFullYear();
        const m = targetDate.getMonth() + 1;
        const d = targetDate.getDate();

        let jy = y, jm = m;
        if (m <= 2) { jy -= 1; jm += 12; }
        const A = Math.floor(jy / 100);
        const B = 2 - A + Math.floor(A / 4);
        const jd = Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + d + B - 1524.5;
        const dJ2000 = jd - 2451545.0;
        const ayanamsa = 24.12;

        function getPlanet(base, rate, corr = 0) {
            let l = (base + rate * dJ2000 + corr - ayanamsa) % 360;
            if (l < 0) l += 360;
            const rasi = Math.floor(l / 30);
            const deg = Math.floor(l % 30);
            const min = Math.floor(((l % 30) - deg) * 60);
            return { rasi, deg, min, long: l };
        }

        const sun = getPlanet(280.466, 0.98564736);
        const moon = getPlanet(218.316, 13.176396, 6.289 * Math.sin(0.01745 * (134.963 + 13.064993 * dJ2000)));
        const mars = getPlanet(355.433, 0.524033, 1.8 * Math.sin(0.01745 * (336.06 + 0.524033 * dJ2000)));
        const mercury = getPlanet(sun.long + 18 * Math.sin(0.01745 * (sun.long * 1.5)), 0);
        const jupiter = getPlanet(34.351, 0.0830853, 0.8 * Math.sin(0.01745 * (14.3 + 0.083 * dJ2000)));
        const venus = getPlanet(sun.long + 28 * Math.cos(0.01745 * (sun.long * 0.9)), 0);
        const saturn = getPlanet(50.077, 0.0334597, 0.5 * Math.sin(0.01745 * (92.4 + 0.033 * dJ2000)));
        const rahu = getPlanet(250.0, -0.05295);
        const ketu = { rasi: (rahu.rasi + 6) % 12, deg: (30 - rahu.deg) % 30, min: (60 - rahu.min) % 60, long: (rahu.long + 180) % 360 };
        const uranus = getPlanet(314.055, 0.0117283);

        const names = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "ราหู", "เกตุ", "มฤตยู"];
        const pNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        const pObj = [sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu, uranus];

        return pNums.map((num, i) => {
            return {
                num: num,
                thNum: num === 0 ? "๐" : String.fromCharCode(0x0E50 + num),
                name: names[i],
                rasi: pObj[i].rasi,
                rasiName: RASI_NAMES[pObj[i].rasi],
                deg: pObj[i].deg,
                min: pObj[i].min
            };
        });
    }

    // วิเคราะห์ผลกระทบดาวจรต่อดวงเมือง (Transit Impact Analysis)
    function analyzeTransitToCity(transitList, taksaJorInfo) {
        const analysis = [];
        const cityAscRasi = 0; // ราศีเมษ

        // 1. ตรวจสอบดาวพฤหัสบดี (๕) จร
        const jup = transitList.find(p => p.num === 5);
        if (jup) {
            const bhavaIdx = (jup.rasi - cityAscRasi + 12) % 12;
            const bhavaName = BHAVA_CITY_MEANING[bhavaIdx].name;
            let effect = "";
            let score = "good";

            if (bhavaIdx === 0) {
                effect = "ดาวพฤหัสบดี (๕) จรทับลัคนาดวงเมืองในราศีเมษ ถือเป็นมหามงคลสูงสุด สถาบันหลักและผู้นำได้รับความเชื่อมั่น นโยบายเศรษฐกิจและการศึกษาขยายตัว ชาติได้รับความคุ้มครองจากสิ่งศักดิ์สิทธิ์";
            } else if (bhavaIdx === 8) { // ศุภะ
                effect = "ดาวพฤหัสบดี (๕) จรเข้าภพศุภะ (ราศีธนู) เล็งเห็นความเจริญรุ่งเรืองทางคุณธรรม กฎหมาย และภาพลักษณ์ของประเทศในสายตาประชาคมโลก มีความมั่นคงทางนิติรัฐ";
            } else if (bhavaIdx === 10) { // ลาภะ
                effect = "ดาวพฤหัสบดี (๕) จรเข้าภพลาภะ (ราศีกุมภ์) ส่งเสริมให้รัฐสภาและการค้าระหว่างประเทศสร้างผลกำไร มิตรประเทศให้การสนับสนุนด้านเศรษฐกิจอย่างดียิ่ง";
            } else if (bhavaIdx === 1) { // กดุมภะ
                effect = "ดาวพฤหัสบดี (๕) จรเข้าภพกดุมภะ (ราศีพฤษภ) เสริมสภาพคล่องทางการเงิน การคลังของชาติ และการจัดเก็บรายได้แผ่นดินที่เติบโต";
            } else if (bhavaIdx === 5 || bhavaIdx === 7 || bhavaIdx === 11) { // อริ, มรณะ, วินาศ
                effect = "ดาวพฤหัสบดี (๕) จรเข้าภพทุสถานะ (อริ/มรณะ/วินาศ) ต้องระวังข้อพิพาททางข้อกฎหมาย คดีความสำคัญระดับชาติ และความเห็นต่างเรื่องนโยบายสาธารณะ";
                score = "warning";
            } else {
                effect = `ดาวพฤหัสบดี (๕) จรในภพ ${bhavaName} ส่งพลังเกื้อหนุนให้ระบบโครงสร้างและกิจการในภพนี้พัฒนาไปในทางก้าวหน้า`;
            }

            analysis.push({
                planet: "พฤหัสบดี (๕)",
                rasi: jup.rasiName,
                bhava: bhavaName,
                score: score,
                summary: effect
            });
        }

        // 2. ตรวจสอบดาวเสาร์ (๗) จร
        const sat = transitList.find(p => p.num === 7);
        if (sat) {
            const bhavaIdx = (sat.rasi - cityAscRasi + 12) % 12;
            const bhavaName = BHAVA_CITY_MEANING[bhavaIdx].name;
            let effect = "";
            let score = "neutral";

            if (bhavaIdx === 0) { // ทับลัคนา
                effect = "ดาวเสาร์ (๗) จรทับลัคนาดวงเมือง เกิดภาระหนักหน่วง การปรับโครงสร้างระบบราชการ การเมือง และปัญหาเรื่องที่ดินทำกิน ประชาชนต้องใช้ความอดทนสูง";
                score = "danger";
            } else if (bhavaIdx === 6) { // เล็งลัคนา
                effect = "ดาวเสาร์ (๗) จรเล็งลัคนาดวงเมืองในราศีตุลย์ เกิดความตึงเครียดในความสัมพันธ์ระหว่างประเทศ และการเจรจาทางการค้าที่ต้องรัดกุมเป็นพิเศษ";
                score = "warning";
            } else if (bhavaIdx === 9) { // กัมมะ
                effect = "ดาวเสาร์ (๗) จรในภพกัมมะ (ราศีมังกร) ซึ่งเป็นเกษตรเดิม รัฐบาลและฝ่ายบริหารมีความจริงจังในการก่อสร้างโครงการพื้นฐานระดับเมกะโปรเจกต์";
                score = "good";
            } else if (bhavaIdx === 10) { // ลาภะ
                effect = "ดาวเสาร์ (๗) จรในภพลาภะ (ราศีกุมภ์) ส่งผลดีต่อการวางแผนระยะยาว รายได้จากการส่งออกสินค้าอุตสาหกรรมและเกษตรกรรม";
                score = "good";
            } else {
                effect = `ดาวเสาร์ (๗) จรในภพ ${bhavaName} บ่งชี้ถึงการจัดระเบียบใหม่ การทดสอบความแข็งแกร่ง และการแก้ปัญหาค้างคาในภพนี้`;
            }

            analysis.push({
                planet: "เสาร์ (๗)",
                rasi: sat.rasiName,
                bhava: bhavaName,
                score: score,
                summary: effect
            });
        }

        // 3. ตรวจสอบพระราหู (๘) จร
        const rahu = transitList.find(p => p.num === 8);
        if (rahu) {
            const bhavaIdx = (rahu.rasi - cityAscRasi + 12) % 12;
            const bhavaName = BHAVA_CITY_MEANING[bhavaIdx].name;
            let effect = "";
            let score = "neutral";

            if (bhavaIdx === 0) {
                effect = "พระราหู (๘) จรทับลัคนาดวงเมือง ระวังภาพลวงตา ข่าวลือ ข่าวปลอม การเปลี่ยนแปลงทางการเมืองที่ฉับพลัน และกระแสการเงินนอกระบบที่ผันผวน";
                score = "warning";
            } else if (bhavaIdx === 1) {
                effect = "พระราหู (๘) จรในภพกดุมภะ (ราหูค้นทรัพย์) ต้องระวังเงินเฟ้อ การใช้จ่ายงบประมาณที่รั่วไหล และความเสี่ยงในระบบการเงินเก็งกำไร";
                score = "danger";
            } else if (bhavaIdx === 11) {
                effect = "พระราหู (๘) จรในภพวินาศ (ราศีมีน) ส่งผลให้ธุรกิจสีเทาหรือสิ่งผิดกฎหมายถูกเปิดโปง นำเงินนอกระบบเข้าสู่ระบบภาษีได้มากขึ้น";
                score = "good";
            } else {
                effect = `พระราหู (๘) จรในภพ ${bhavaName} กระตุ้นให้เกิดนวัตกรรม เทคโนโลยี และการลงทุนที่ต้องอาศัยความกล้าได้กล้าเสีย`;
            }

            analysis.push({
                planet: "ราหู (๘)",
                rasi: rahu.rasiName,
                bhava: bhavaName,
                score: score,
                summary: effect
            });
        }

        // 4. ตรวจสอบดาวมฤตยู (๐) จร
        const uranus = transitList.find(p => p.num === 0);
        if (uranus) {
            const bhavaIdx = (uranus.rasi - cityAscRasi + 12) % 12;
            const bhavaName = BHAVA_CITY_MEANING[bhavaIdx].name;
            let effect = "";
            let score = "neutral";

            if (bhavaIdx === 0) {
                effect = "ดาวมฤตยู (๐) ทับลัคนาดวงเมือง ยุคแห่งการปฏิวัติโครงสร้างประเทศ การเกิดกฎหมายใหม่ นวัตกรรมปัญญาประดิษฐ์ และการก้าวสู่ยุคดิจิทัลเต็มรูปแบบ";
                score = "warning";
            } else if (bhavaIdx === 1) {
                effect = "ดาวมฤตยู (๐) สถิตภพกดุมภะ (ราศีพฤษภ) การปฏิวัติระบบการเงิน บล็อกเชน ดิจิทัลเคอร์เรนซี และการเปลี่ยนรูปแบบการถือครองทรัพย์สินของประเทศ";
                score = "good";
            } else {
                effect = `ดาวมฤตยู (๐) ในภพ ${bhavaName} ก่อให้เกิดการเปลี่ยนแปลงเชิงปฏิรูปที่ไม่สามารถย้อนกลับได้ในภพนี้`;
            }

            analysis.push({
                planet: "มฤตยู (๐)",
                rasi: uranus.rasiName,
                bhava: bhavaName,
                score: score,
                summary: effect
            });
        }

        // 4 เสาหลักสภาพการณ์บ้านเมือง
        const pillars = {
            economy: {
                title: "เศรษฐกิจ & การเงินการคลัง (ภพกดุมภะ-ลาภะ)",
                status: "มีแนวโน้มขยายตัวแบบค่อยเป็นค่อยไป",
                details: "กระแสการค้า การลงทุน และการท่องเที่ยวจากต่างประเทศเป็นแรงขับเคลื่อนสำคัญ ควรระมัดระวังเรื่องหนี้ครัวเรือนและความผันผวนของค่าเงิน",
                rating: 80
            },
            politics: {
                title: "การเมือง & การบริหารราชการแผ่นดิน (ภพตนุ-กัมมะ)",
                status: "มีการปรับเปลี่ยนและจัดสมดุลอำนาจ",
                details: "การประสานประโยชน์ระหว่างกลุ่มต่างๆ เพื่อความมั่นคงของชาติ การขับเคลื่อนนโยบายต้องอาศัยความโปร่งใสและมติมหาชน",
                rating: 74
            },
            society: {
                title: "ความเป็นอยู่ของประชาชน & สังคม (ภพพันธุ-ปุตตะ)",
                status: "มีความหวังและสร้างสรรค์นวัตกรรมใหม่",
                details: "คนรุ่นใหม่มีบทบาทสำคัญในการผลักดัน Soft Power และเศรษฐกิจสร้างสรรค์ ความสามัคคีในชาติยังคงเป็นเสาหลักที่เหนียวแน่น",
                rating: 85
            },
            security: {
                title: "ความมั่นคง & ภัยธรรมชาติ (ภพวินาศ-มรณะ-อริ)",
                status: "เฝ้าระวังภัยจากสภาพอากาศและโรคอุบัติใหม่",
                details: "ต้องเตรียมพร้อมรับมือภัยพิบัติน้ำท่วม-ภัยแล้ง และการเปลี่ยนแปลงของสภาวะอากาศโลก โดยอาศัยเทคโนโลยีเตือนภัยล่วงหน้า",
                rating: 70
            }
        };

        return {
            analysis,
            pillars,
            taksaJorInfo
        };
    }

    // ระบบเปรียบเทียบดวงบุคคลกับดวงเมือง (City-Personal Synastry Match)
    function matchPersonalWithCity(personalData) {
        if (!personalData || personalData.ascRasi === undefined) {
            return null;
        }

        const cityAsc = 0; // ราศีเมษ
        const userAsc = personalData.ascRasi;
        const diffRasi = (userAsc - cityAsc + 12) % 12;

        const bhavaRoles = [
            { role: "ผู้ร่วมสร้างภาพลักษณ์และเกียรติภูมิแผ่นดิน (ตนุ)", merit: "มีจิตวิญญาณแห่งความเป็นผู้นำ เสริมสร้างบารมีประเทศ เหมาะกับงานราชการ บริหาร หรือสร้างชื่อเสียงให้ชาติ" },
            { role: "ผู้ขับเคลื่อนเศรษฐกิจและการคลัง (กดุมภะ)", merit: "มีดวงเกื้อหนุนการค้า การลงทุน และสร้างความมั่งคั่งให้แผ่นดิน เสริมสภาพคล่องและการเงินของชาติ" },
            { role: "ผู้เชื่อมโยงการสื่อสารและมิตรไมตรี (สหัชชะ)", merit: "มีวาสนาทางด้านการทูต การสื่อสาร คมนาคม และการสร้างความสัมพันธ์อันดีระหว่างชุมชนและนานาชาติ" },
            { role: "ผู้พิทักษ์ผืนแผ่นดินและทรัพยากร (พันธุ)", merit: "มีสายใยผูกพันกับบ้านเกิด เหมาะกับการพัฒนาที่ดิน อสังหาริมทรัพย์ เกษตรกรรม และความมั่นคงของชุมชน" },
            { role: "ผู้ริเริ่มความคิดสร้างสรรค์และเยาวชน (ปุตตะ)", merit: "มีพรสวรรค์ด้านการศึกษา นวัตกรรม ศิลปะบันเทิง หรือการสร้างสรรค์สิ่งใหม่ให้เยาวชนรุ่นหลัง" },
            { role: "ผู้อดทนแก้ปัญหาและพัฒนาสาธารณสุข (อริ)", merit: "มีจิตใจเสียสละเพื่อประโยชน์ส่วนรวม เก่งในการแก้ปัญหาความขัดแย้ง งานแพทย์ พยาบาล หรืองานช่วยเหลือผู้ยากไร้" },
            { role: "ผู้เจรจาพันธมิตรและการค้าระหว่างประเทศ (ปัตนิ)", merit: "มีวาสนาสมพงศ์กับต่างชาติ เหมาะกับการค้าระหว่างประเทศ การทูต และการสร้างข้อตกลงสันติภาพ" },
            { role: "ผู้สืบสานมรดกและฟื้นฟูวิกฤต (มรณะ)", merit: "มีพลังในการพลิกฟื้นสิ่งชำรุดเสียหาย กิจการประกันภัย โบราณคดี หรือการแก้ปัญหาวิกฤตของชาติ" },
            { role: "ผู้ค้ำชูศีลธรรม ศาสนา และนิติธรรม (ศุภะ)", merit: "มีวาสนาสูงส่งทางธรรม กฎหมาย การศึกษาชั้นสูง ครูบาอาจารย์ เป็นเสาหลักทางจริยธรรมให้สังคม" },
            { role: "ผู้บริหารงานแผ่นดินและสร้างความเจริญ (กัมมะ)", merit: "มีเกณฑ์เจริญก้าวหน้าในงานบริหาร องค์กรขนาดใหญ่ และการลงมือปฏิบัติงานเพื่อชาติบ้านเมือง" },
            { role: "ผู้สร้างสรรค์นโยบายและประโยชน์สาธารณะ (ลาภะ)", merit: "มีวิสัยทัศน์กว้างไกล เหมาะกับงานสภา ประโยชน์สาธารณะ สังคมสงเคราะห์ และการพัฒนาระดับประเทศ" },
            { role: "ผู้ปิดทองหลังพระและพลังแห่งจิตวิญญาณ (วินาศ)", merit: "มีความสามารถในการทำงานเบื้องหลัง งานความมั่นคงลับ ศาสนา จิตศาสตร์ และการคุ้มครองประเทศด้วยจิตบริสุทธิ์" }
        ];

        const matchInfo = bhavaRoles[diffRasi];

        // แนะนำสถานที่ศักดิ์สิทธิ์และวิธีเสริมดวง
        const holyPlaces = [
            {
                name: "ศาลหลักเมืองกรุงเทพมหานคร",
                location: "ใกล้สนามหลวงและกระทรวงกลาโหม",
                blessing: "ขอพรเพื่อความมั่นคงในหน้าที่การงาน ตัดเคราะห์ เสริมบารมี ต่อชะตา และเป็นหลักชัยในชีวิต",
                item: "ผ้าแพร ๓ สี/๗ สี, พวงมาลัยดาวเรือง, น้ำมันเติมตะเกียงพระประจำวันเกิด"
            },
            {
                name: "วัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)",
                location: "พระบรมมหาราชวัง",
                blessing: "กราบสักการะ 'พระพุทธมหามณีรัตนปฏิมากร' (พระแก้วมรกต) ขอพรความเป็นสิริมงคลสูงสุด ความร่มเย็นเป็นสุข",
                item: "ดอกบัวขาว, ธูป ๓ ดอก, เทียน ๑ เล่ม, น้อมจิตถวายบุญกุศลแด่บูรพกษัตริย์"
            },
            {
                name: "พระที่นั่งไพศาลทักษิณ (สักการะพระสยามเทวาธิราช)",
                location: "สวดบูชา ณ บ้านเรือน หรือสถานที่มงคล",
                blessing: "ขอพรให้ชาติบ้านเมืองสงบสุข แคล้วคลาดจากอริศัตรู และขอให้สิ่งศักดิ์สิทธิ์คุ้มครองตนเองและครอบครัว",
                item: "สวดพระคาถาบูชาพระสยามเทวาธิราช เจริญเมตตาภาวนา"
            },
            {
                name: "ศาลเจ้าพ่อหอกลอง",
                location: "ภายในบริเวณศาลหลักเมือง",
                blessing: "ขอพรเรื่องชื่อเสียง เกียรติยศ การสอบแข่งขัน การเลื่อนตำแหน่ง และความโดดเด่นในสายอาชีพ",
                item: "พวงมาลัยดอกมะลิ, ธูปเทียน"
            }
        ];

        return {
            userAscName: RASI_NAMES[userAsc],
            cityAscName: "เมษ",
            relationshipRasi: diffRasi + 1,
            roleTitle: matchInfo.role,
            roleDetail: matchInfo.merit,
            holyPlaces: holyPlaces,
            patronChant: "สยามะเทวาธิราชา เทวา ติระกะขะกา มะหิทธิกา ธะยัมปะติราชินี จะ อิมัง รัฏฐัง รังขันตุ สัพพะทาฯ"
        };
    }

    // ระบบพยากรณ์ทิศทาง วัน / เดือน / ปี ปัจจุบัน (Day / Month / Year Directional Forecast)
    function calculateDayMonthYearTrends(targetDate = new Date()) {
        const targetYear = targetDate.getFullYear();
        const targetMonth = targetDate.getMonth() + 1;
        const targetDay = targetDate.getDate();
        const dayOfWeek = targetDate.getDay(); // 0=อาทิตย์, 1=จันทร์ ...
        const thaiDayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const thaiMonthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const dayPlanets = [
            { num: 1, name: "อาทิตย์ (๑)", element: "ไฟ", nature: "เกียรติยศ ผู้นำ ความร้อนแรง" },
            { num: 2, name: "จันทร์ (๒)", element: "ดิน", nature: "จิตใจ ประชาชน อุปถัมภ์ เมตตา" },
            { num: 3, name: "อังคาร (๓)", element: "ลม", nature: "ความกล้าหาญ การแข่งขัน กีฬา กิจการมั่นคง" },
            { num: 4, name: "พุธ (๔)", element: "น้ำ", nature: "การเจรจา การค้า ข้อมูล ข่าวสาร" },
            { num: 5, name: "พฤหัสบดี (๕)", element: "ดิน", nature: "ความยุติธรรม ปัญญา การศึกษา พิธีกรรมมงคล" },
            { num: 6, name: "ศุกร์ (๖)", element: "น้ำ", nature: "ศิลปะ บันเทิง ความรัก การเงิน การจับจ่าย" },
            { num: 7, name: "เสาร์ (๗)", element: "ไฟ", nature: "ความอดทน โครงการระยะยาว การแก้ปัญหาใหญ่" }
        ];

        const transitList = calculateTransitPlanets(targetDate);
        const cityAgeInfo = calculateCityAgeAndTaksa(targetDate);

        // --- 1. ทิศทางประจำวัน (Daily Direction) ---
        const todayPlanet = dayPlanets[dayOfWeek];
        const moonTransit = transitList.find(p => p.num === 2) || { rasi: 0, rasiName: "เมษ" };
        const moonBhavaIdx = (moonTransit.rasi - 0 + 12) % 12;
        const moonBhava = BHAVA_CITY_MEANING[moonBhavaIdx];

        const moonBhavaInsights = [
            { vibe: "กระตือรือร้น & ความเคลื่อนไหวระดับชาติ", score: 85, focus: "ผู้นำแถลงนโยบาย ประชาชนตื่นตัวในข่าวสารบ้านเมือง กิจกรรมสำคัญคึกคัก", caution: "อารมณ์ประชาชนอาจใจร้อน ตัดสินใจฉับพลัน" },
            { vibe: "คล่องตัวทางเศรษฐกิจ & จับจ่ายใช้สอย", score: 90, focus: "การค้าขายปลีก ตลาดสด อาหาร และการหมุนเวียนของเงินตราคึกคักเป็นพิเศษ", caution: "การใช้จ่ายเกินตัว หรือการหลงซื้อสินค้าฟุ่มเฟือย" },
            { vibe: "การสื่อสาร & การเดินทางคึกคัก", score: 82, focus: "การคมนาคม ข่าวสารบนสื่อโซเชียล การเดินทางท่องเที่ยวระยะสั้นเด่นชัด", caution: "ข่าวลือหรือข้อมูลคลาดเคลื่อนในโลกออนไลน์" },
            { vibe: "ความอบอุ่น & สายใยครอบครัว-แผ่นดิน", score: 92, focus: "ความมั่นคงในเคหสถาน ธุรกิจการเกษตร อาหารท้องถิ่น และความสุขในครอบครัว", caution: "สภาพอากาศแปรปรวน หรือความอ่อนไหวทางอารมณ์" },
            { vibe: "ไอเดียสร้างสรรค์ & บันเทิงคึกคัก", score: 86, focus: "วงการบันเทิง การจัดแสดงงานศิลปะ คอนเสิร์ต และการลงทุนเก็งกำไรระยะสั้น", caution: "การเสี่ยงโชคเกินขอบเขต ควรมีสติในการลงทุน" },
            { vibe: "แก้ไขปัญหา & มุ่งเน้นสาธารณสุข", score: 72, focus: "การทำงานที่ต้องใช้ความละเอียดรอบคอบ การดูแลสุขภาพและสวัสดิการแรงงาน", caution: "ความเห็นต่างในที่ทำงาน และโรคภัยไข้เจ็บตามฤดูกาล" },
            { vibe: "มิตรภาพ & เจรจาทำสัญญาคู่ค้า", score: 88, focus: "การเซ็นสัญญาข้อตกลง การร่วมทุน และการประสานประโยชน์ระหว่างองค์กร", caution: "ความล่าช้าในการตกลงผลประโยชน์ ต้องมีลายลักษณ์อักษรชัดเจน" },
            { vibe: "การปรับปรุงฟื้นฟู & ลึกลับหยั่งรู้", score: 68, focus: "การแก้ไขข้อบกพร่องเก่า การทำบุญอุทิศส่วนกุศล และศึกษาเรื่องจิตศาสตร์", caution: "อุบัติเหตุจากการเดินทาง หรือข่าวการสูญเสียของบุคคล" },
            { vibe: "สิริมงคล & คุณธรรมความก้าวหน้า", score: 95, focus: "การศึกษา วิชาการ ไหว้พระทำบุญ ผู้ใหญ่ให้การอุปถัมภ์เกื้อกูล", caution: "ความยึดติดในกรอบเดิมเกินไป ควรเปิดรับมุมมองใหม่" },
            { vibe: "มุ่งมั่นในการงาน & เมกะโปรเจกต์", score: 84, focus: "การลงมือปฏิบัติงานหนัก การบริหารจัดการองค์กร และการสร้างผลงานเชิงประจักษ์", caution: "ความเหน็ดเหนื่อยและความเครียดจากการทำงาน" },
            { vibe: "โชคลาภ & ผลประโยชน์สาธารณะ", score: 91, focus: "ลาภลอย การระดมทุน เครือข่ายมิตรภาพ และความร่วมมือในสังคม", caution: "การจัดสรรผลประโยชน์ที่ไม่ลงตัวในหมู่คณะ" },
            { vibe: "ความสงบ & การทำงานเบื้องหลัง", score: 70, focus: "การวางแผนเงียบๆ การเจริญสมาธิภาวนา และการจัดการปัญหาลับๆ", caution: "การถูกเข้าใจผิด หรือการมีเรื่องปกปิดที่ไม่พึงประสงค์" }
        ];

        const currentMoonInsight = moonBhavaInsights[moonBhavaIdx];
        const dailyTrend = {
            dayName: thaiDayNames[dayOfWeek],
            dayPlanet: todayPlanet,
            moonRasi: moonTransit.rasiName,
            moonBhavaName: moonBhava.name,
            vibe: currentMoonInsight.vibe,
            score: currentMoonInsight.score,
            focus: currentMoonInsight.focus,
            caution: currentMoonInsight.caution,
            recommendation: `ใน${thaiDayNames[dayOfWeek]}นี้ พลังงานดาว${todayPlanet.name} ส่งกระแสร่วมกับดาวจันทร์ใน${moonBhava.name} แนะนำให้เน้น${currentMoonInsight.focus.split(' ')[0]} พร้อมระวัง${currentMoonInsight.caution}`
        };

        // --- 2. ทิศทางประจำเดือน (Monthly Direction) ---
        const sunTransit = transitList.find(p => p.num === 1) || { rasi: 4, rasiName: "สิงห์" };
        const sunBhavaIdx = (sunTransit.rasi - 0 + 12) % 12;
        const sunBhava = BHAVA_CITY_MEANING[sunBhavaIdx];
        const venusTransit = transitList.find(p => p.num === 6) || { rasi: 5, rasiName: "กันย์" };

        const monthlyThemes = [
            { theme: "เดือนแห่งการเปิดศักราช & เริ่มต้นเป้าหมายใหม่ของชาติ", focus: "การประกาศทิศทางใหม่ นโยบายผู้นำ และการขับเคลื่อนโครงการต้นปี" },
            { theme: "เดือนแห่งการเสริมสภาพคล่อง & การค้าการลงทุน", focus: "การกระตุ้นเศรษฐกิจ การค้าขาย อาหาร และการเติบโตของรายได้ประชาชาติ" },
            { theme: "เดือนแห่งการคมนาคม & การสื่อสารเชื่อมโยง", focus: "การท่องเที่ยว สนธิสัญญาการค้า การขนส่ง และการแลกเปลี่ยนทางวัฒนธรรม" },
            { theme: "เดือนแห่งผืนแผ่นดิน & ความมั่นคงภายในชาติ", focus: "การเกษตร อสังหาริมทรัพย์ การอนุรักษ์สิ่งแวดล้อม และความสามัคคี" },
            { theme: "เดือนแห่งพลังสร้างสรรค์ & Soft Power สู่สากล", focus: "วงการบันเทิง แฟชั่น งานเทศกาล ตลาดหุ้น และเยาวชนรุ่นใหม่" },
            { theme: "เดือนแห่งการจัดระเบียบ & พัฒนาสาธารณสุขแรงงาน", focus: "การแก้ปัญหาหนี้สิน การพัฒนาการแพทย์ และการยกระดับคุณภาพชีวิต" },
            { theme: "เดือนแห่งการเจรจาต่างประเทศ & มิตรภาพสากล", focus: "ความร่วมมือระหว่างประเทศ การค้าทวิภาคี และการท่องเที่ยวระดับพรีเมียม" },
            { theme: "เดือนแห่งการปรับโครงสร้าง & พลิกฟื้นจากวิกฤต", focus: "การจัดการภาษี การแก้ปัญหาภัยธรรมชาติ และการฟื้นฟูระบบการเงิน" },
            { theme: "เดือนแห่งสิริมงคล ศีลธรรม & ก้าวสู่อนาคต", focus: "งานประเพณีสำคัญ พระพุทธศาสนา การศึกษาชั้นสูง และความยุติธรรม" },
            { theme: "เดือนแห่งการบริหารบ้านเมือง & โครงสร้างพื้นฐาน", focus: "การอนุมัติงบประมาณ การก่อสร้างคมนาคม และผลงานของรัฐบาล" },
            { theme: "เดือนแห่งความร่วมมือสาธารณะ & เทคโนโลยีดิจิทัล", focus: "เศรษฐกิจดิจิทัล นวัตกรรมใหม่ และการมีส่วนร่วมของภาคประชาชน" },
            { theme: "เดือนแห่งการวางแผนเชิงลึก & เตรียมรับความเปลี่ยนแปลง", focus: "การสะสางงานเก่า การค้าระหว่างประเทศลับๆ และการเตรียมตัวสู่ปีใหม่" }
        ];

        const curMonthTheme = monthlyThemes[sunBhavaIdx];
        const monthlyTrend = {
            monthName: thaiMonthNames[targetMonth - 1],
            yearBE: targetYear + 543,
            sunRasi: sunTransit.rasiName,
            sunBhava: sunBhava.name,
            theme: curMonthTheme.theme,
            focus: curMonthTheme.focus,
            economicScore: 82,
            economicTrend: `ดาวอาทิตย์สถิต${sunBhava.name} ร่วมกับดาวศุกร์ใน${venusTransit.rasiName} ช่วยขับเคลื่อนธุรกิจการค้า การท่องเที่ยว และการบริโภคภายในประเทศให้ขยายตัวอย่างต่อเนื่อง`,
            socialTrend: "ประชาชนมีความหวังและตื่นตัวกับนวัตกรรมใหม่ๆ กระแส Soft Power ไทยได้รับความสนใจจากนานาประเทศ",
            strategicAdvice: "ผู้ประกอบการควรเร่งปรับโมเดลธุรกิจเข้าสู่ระบบดิจิทัล และเน้นการสร้างแบรนด์ที่เน้นคุณภาพและความยั่งยืน"
        };

        // --- 3. ทิศทางประจำปี (Yearly Direction) ---
        const jupTransit = transitList.find(p => p.num === 5);
        const satTransit = transitList.find(p => p.num === 7);
        const rahuTransit = transitList.find(p => p.num === 8);
        const uranusTransit = transitList.find(p => p.num === 0);

        const yearlyTrend = {
            yearBE: targetYear + 543,
            cityAge: `${cityAgeInfo.fullYears} ปีบริบูรณ์ (ย่าง ${cityAgeInfo.turningAge} ปี)`,
            currentWai: cityAgeInfo.currentWai,
            taksaSri: cityAgeInfo.taksaJor["ศรี"].planetName,
            taksaDech: cityAgeInfo.taksaJor["เดช"].planetName,
            taksaKala: cityAgeInfo.taksaJor["กาลกิณี"].planetName,
            taksaMontri: cityAgeInfo.taksaJor["มนตรี"].planetName,
            macroOutlook: `ในปี พ.ศ. ${targetYear + 543} ดวงเมืองกรุงรัตนโกสินทร์มีชันษาย่าง ${cityAgeInfo.turningAge} ปี มีดาว ${cityAgeInfo.taksaJor["ศรี"].planetName} เป็นดาวศรีจร และดาว ${cityAgeInfo.taksaJor["เดช"].planetName} เป็นดาวเดชจร หนุนนำให้ประเทศชาติมีเกียรติยศชื่อเสียงในระดับสากล มีการปฏิรูปโครงสร้างทางเศรษฐกิจและเทคโนโลยีให้ทันยุคสมัย`,
            keyPillars: [
                {
                    area: "เศรษฐกิจ & การเงิน (Financial & Economy)",
                    trend: "การปรับตัวสู่เศรษฐกิจดิจิทัลและการเงินยุคใหม่",
                    detail: "อิทธิพลของดาวพฤหัสบดี (๕) และมฤตยู (๐) ผลักดันให้ระบบการเงิน บล็อกเชน และนวัตกรรมกลายเป็นหัวหอกขับเคลื่อนเศรษฐกิจ"
                },
                {
                    area: "การเมือง & การบริหารราชการ (Politics & Governance)",
                    trend: "การจัดสมดุลอำนาจและการบริหารแบบเน้นผลสัมฤทธิ์",
                    detail: "การบูรณาการการทำงานระหว่างภาครัฐและเอกชนเพื่อขับเคลื่อนโครงการเมกะโปรเจกต์คมนาคมและพลังงานสะอาด"
                },
                {
                    area: "สังคม & วัฒนธรรม (Society & Soft Power)",
                    trend: "พลัง Soft Power วัฒนธรรม อาหาร และการท่องเที่ยวไทยโดดเด่น",
                    detail: "ชาวต่างชาติเดินทางหลั่งไหลเข้ามาท่องเที่ยวและพำนักระยะยาว สร้างรายได้หมุนเวียนในทุกระดับชุมชน"
                },
                {
                    area: "ความมั่นคง & สิ่งแวดล้อม (Security & Climate)",
                    trend: "การบริหารจัดการน้ำ สภาพอากาศ และความปลอดภัยไซเบอร์",
                    detail: "จำเป็นต้องเตรียมแผนป้องกันภัยพิบัติทางธรรมชาติและการเปลี่ยนแปลงสภาพภูมิอากาศด้วยระบบเตือนภัยอัจฉริยะ"
                }
            ],
            goldenRule: "ยึดมั่นในความซื่อสัตย์สุจริต มีสติในการลงทุน กระจายความเสี่ยง และหมั่นสร้างบุญกุศลน้อมถวายแด่บูรพมหากษัตริย์และพระสยามเทวาธิราช"
        };

        return {
            targetDate,
            dailyTrend,
            monthlyTrend,
            yearlyTrend
        };
    }

    return {
        CITY_FOUNDATION,
        NATAL_PLANETS,
        BHAVA_CITY_MEANING,
        calculateCityAgeAndTaksa,
        calculateTransitPlanets,
        analyzeTransitToCity,
        matchPersonalWithCity,
        calculateDayMonthYearTrends
    };
})();

// Export สำหรับ Browser และ Node.js
if (typeof window !== "undefined") {
    window.RattanakosinCityEngine = RattanakosinCityEngine;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = RattanakosinCityEngine;
}

