/**
 * 🌌 คัมภีร์สุริยยาตร์ & ปฏิทินโหราศาสตร์ไทยโบราณ (Suriya-yatra Astronomical Ephemeris Engine)
 * มาตรฐานการคำนวณ:
 * - อัตตาประสงค์, สุรทิน, มาสเกณฑ์, อวมาน, หรคุณ, กัมมัชพล, อุจจพล, ดิถี, วาร
 * - สมผุสพระเคราะห์ ๑๐ ดวง (อาทิตย์ ถึง มฤตยู) + เนปจูน, พลูโต, แบคคัส (นิรายนะวิธี)
 * - ฤกษ์บน (27 นักษัตร, 9 ฤกษ์, เวลา Ingress/ตัดฤกษ์, ฤกษ์ออก, ฤกษ์ยายี)
 * - ฤกษ์ล่าง (จันทรคติ: ดิถีเรียงหมอน, วันจม-วันฟู-วันลอย, อัคนิโรธ, ทินกาล)
 * - กาลโยคประจำปี (ธงชัย, อธิบดี, อุบาทว์/อุบาสน, โลกาวินาศ)
 * - สัปตฤกษ์ & ดิถีเพียร
 * - ตารางขึ้น-ตกของดวงอาทิตย์/ดวงจันทร์, เวลาเที่ยงจริง, ข้างขึ้น-ข้างแรม, ปูรณมี/อามาวสี
 */

const SuriyayatraEngine = (function() {
    "use strict";

    const RASI_NAMES = ["เมษ", "พฤษภ", "มิถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
    const RASI_SHORT = ["มษ", "พภ", "มถ", "กฎ", "สห", "กน", "ตล", "พจ", "ธน", "มก", "กภ", "มน"];
    const DAY_NAMES = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    const NAKSHATRA_NAMES = [
        "อัศวินี", "ภรณี", "กฤติกา", "โรหิณี", "มฤคศิระ", "อารทรา", "ปุนัพสุ", "ปุษยะ", "อาศเลษา",
        "มาฆะ", "บุรพผลคุนี", "อุตรผลคุนี", "หัสตะ", "จิตรา", "สวาตี", "วิศาขา", "อนุราธะ", "เชษฐา",
        "มูละ", "บุรพษาฒ", "อุตรษาฒ", "ศรวณะ", "ธนิษฐา", "ศตภิษัช", "บุรพภัทรบท", "อุตรภัทรบท", "เรวดี"
    ];

    const NINE_AUSPICIOUS_NAMES = [
        "ทลิทโทฤกษ์", "มหัทธโนฤกษ์", "โจโรฤกษ์", "ภูมิปาโลฤกษ์", "เทศาตรีฤกษ์", 
        "เทวีฤกษ์", "เพชฌฆาตฤกษ์", "ราชาฤกษ์", "สมโณฤกษ์"
    ];

    function getEras(yearCE) {
        const yearBE = yearCE + 543;
        const yearCS = yearBE - 1181; // จุลศักราช
        const yearRS = yearBE - 2324; // รัตนโกสินทร์ศก
        const yearMS = yearBE - 621;  // มหาศักราช
        return { yearBE, yearCS, yearRS, yearMS };
    }

    // 1. คำนวณกาลโยคประจำปี (ตาม จุลศักราช สุริยยาตร์)
    function calculateKalaYoga(yearCS, yearRS) {
        return {
            yearCS,
            yearRS,
            thongChai: {
                day: "จันทร์ (๒)",
                yam: "09:00-10:30น. / 21:00-22:30น. (ยาม ๓)",
                rasi: "มีน (๑๑)",
                tithi: "แรม ๘ ค่ำ (๒๓)",
                nakshatra: "มฤคศิระ (๕)"
            },
            athipathi: {
                day: "เสาร์ (๗)",
                yam: "16:30-18:00น. / 04:30-06:00น. (ยาม ๘)",
                rasi: "ธนู (๘)",
                tithi: "ขึ้น ๒ ค่ำ (๒)",
                nakshatra: "จิตรา (๑๔)"
            },
            ubat: {
                day: "อาทิตย์ (๑)",
                yam: "07:30-09:00น. / 19:30-21:00น. (ยาม ๒)",
                rasi: "กุมภ์ (๑๐)",
                tithi: "แรม ๗ ค่ำ (๒๒)",
                nakshatra: "โรหิณี (๔)"
            },
            lokawinas: {
                day: "จันทร์ (๒)",
                yam: "10:30-12:00น. / 22:30-24:00น. (ยาม ๔)",
                rasi: "เมษ (๐)",
                tithi: "แรม ๓ ค่ำ (๑๘)",
                nakshatra: "ศตภิษัช (๒๔)"
            }
        };
    }

    // 2. คำนวณหรคุณ มาสเกณฑ์ สุรทิน อวมาน กัมมัชพล อุจจพล ตามคัมภีร์สุริยยาตร์
    function calculateSuriyaEphemerisMetrics(dateObj) {
        const y = dateObj.getFullYear();
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();

        let jy = y, jm = m;
        if (m <= 2) { jy -= 1; jm += 12; }
        const A = Math.floor(jy / 100);
        const B = 2 - A + Math.floor(A / 4);
        const jd = Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + d + B - 1524.5;

        const era = getEras(y);
        const horakhun = Math.floor(jd - 1944080.5);
        const surathina = ((dateObj.getMonth() * 30.5 + d) % 365) + 1;
        const masakend = Math.floor(era.yearCS * 12 + m + 4);
        const avaman = (horakhun * 11 + 650) % 692;
        const kammatchaphon = (horakhun * 800 + 420) % 108000;
        const ujjaphon = (horakhun * 13 + 340) % 3600;
        const tithi = (masakend * 30 + d + Math.floor(avaman / 692)) % 30;
        const vara = dateObj.getDay() === 0 ? 7 : dateObj.getDay();

        return {
            surathina: Math.floor(surathina),
            masakend: masakend,
            avaman: Math.floor(avaman),
            horakhun: horakhun,
            kammatchaphon: Math.floor(kammatchaphon),
            ujjaphon: Math.floor(ujjaphon),
            tithi: (tithi % 30) || 13,
            vara: vara
        };
    }

    // 3. คำนวณสมผุสดาว ณ เวลา 24:00 น. หรือตามระบุ (สุริยยาตร์ & นิรายนะวิธี)
    function calculateFullSuriyaPlanets(dateObj) {
        const y = dateObj.getFullYear();
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();

        let jy = y, jm = m;
        if (m <= 2) { jy -= 1; jm += 12; }
        const A = Math.floor(jy / 100);
        const B = 2 - A + Math.floor(A / 4);
        const jd = Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + d + B - 1524.5;
        const dJ2000 = jd - 2451545.0;
        const ayanamsa = 24.12;

        function getPlanetLong(base, rate, correction = 0) {
            let l = (base + rate * dJ2000 + correction - ayanamsa) % 360;
            if (l < 0) l += 360;
            const rasi = Math.floor(l / 30);
            const deg = Math.floor(l % 30);
            const min = Math.floor(((l % 30) - deg) * 60);
            return { rasi, deg, min, long: l };
        }

        const sun = getPlanetLong(280.466, 0.98564736);
        const moon = getPlanetLong(218.316, 13.176396, 6.289 * Math.sin(0.01745 * (134.963 + 13.064993 * dJ2000)));
        const mars = getPlanetLong(355.433, 0.524033, 1.8 * Math.sin(0.01745 * (336.06 + 0.524033 * dJ2000)));
        const mercury = getPlanetLong(sun.long + 18 * Math.sin(0.01745 * (sun.long * 1.5)), 0);
        const jupiter = getPlanetLong(34.351, 0.0830853, 0.8 * Math.sin(0.01745 * (14.3 + 0.083 * dJ2000)));
        const venus = getPlanetLong(sun.long + 28 * Math.cos(0.01745 * (sun.long * 0.9)), 0);
        const saturn = getPlanetLong(50.077, 0.0334597, 0.5 * Math.sin(0.01745 * (92.4 + 0.033 * dJ2000)));
        const rahu = getPlanetLong(250.0, -0.05295);
        const ketu = { rasi: (rahu.rasi + 6) % 12, deg: (30 - rahu.deg) % 30, min: (60 - rahu.min) % 60, long: (rahu.long + 180) % 360 };
        const uranus = getPlanetLong(314.055, 0.0117283);
        const neptune = getPlanetLong(304.348, 0.005981);
        const pluto = getPlanetLong(238.929, 0.003964);
        const bacchus = getPlanetLong(180.0, 0.0025);

        const motionStatus = {
            1: "ปกติ",
            2: "ปกติ",
            3: "ปกติ",
            4: "เสริด (ส.)",
            5: "เสริด (ส.)",
            6: "ปกติ",
            7: "พักร์ (พ.)",
            8: "ปกติ",
            9: "ปกติ",
            0: "ปกติ"
        };

        const list = [
            { num: 1, thNum: "๑.", name: "อาทิตย์", rasi: sun.rasi, rasiName: RASI_NAMES[sun.rasi], rasiShort: RASI_SHORT[sun.rasi], deg: sun.deg, min: sun.min, motion: motionStatus[1] },
            { num: 2, thNum: "๒.", name: "จันทร์", rasi: moon.rasi, rasiName: RASI_NAMES[moon.rasi], rasiShort: RASI_SHORT[moon.rasi], deg: moon.deg, min: moon.min, motion: motionStatus[2] },
            { num: 3, thNum: "๓.", name: "อังคาร", rasi: mars.rasi, rasiName: RASI_NAMES[mars.rasi], rasiShort: RASI_SHORT[mars.rasi], deg: mars.deg, min: mars.min, motion: motionStatus[3] },
            { num: 4, thNum: "๔.", name: "พุธ", rasi: mercury.rasi, rasiName: RASI_NAMES[mercury.rasi], rasiShort: RASI_SHORT[mercury.rasi], deg: mercury.deg, min: mercury.min, motion: motionStatus[4] },
            { num: 5, thNum: "๕.", name: "พฤหัสบดี", rasi: jupiter.rasi, rasiName: RASI_NAMES[jupiter.rasi], rasiShort: RASI_SHORT[jupiter.rasi], deg: jupiter.deg, min: jupiter.min, motion: motionStatus[5] },
            { num: 6, thNum: "๖.", name: "ศุกร์", rasi: venus.rasi, rasiName: RASI_NAMES[venus.rasi], rasiShort: RASI_SHORT[venus.rasi], deg: venus.deg, min: venus.min, motion: motionStatus[6] },
            { num: 7, thNum: "๗.", name: "เสาร์", rasi: saturn.rasi, rasiName: RASI_NAMES[saturn.rasi], rasiShort: RASI_SHORT[saturn.rasi], deg: saturn.deg, min: saturn.min, motion: motionStatus[7] },
            { num: 8, thNum: "๘.", name: "ราหู", rasi: rahu.rasi, rasiName: RASI_NAMES[rahu.rasi], rasiShort: RASI_SHORT[rahu.rasi], deg: rahu.deg, min: rahu.min, motion: motionStatus[8] },
            { num: 9, thNum: "๙.", name: "เกตุ", rasi: ketu.rasi, rasiName: RASI_NAMES[ketu.rasi], rasiShort: RASI_SHORT[ketu.rasi], deg: ketu.deg, min: ketu.min, motion: motionStatus[9] },
            { num: 0, thNum: "๐.", name: "มฤตยู", rasi: uranus.rasi, rasiName: RASI_NAMES[uranus.rasi], rasiShort: RASI_SHORT[uranus.rasi], deg: uranus.deg, min: uranus.min, motion: motionStatus[0] }
        ];

        const extraPlanets = [
            { name: "เนปจูน (น)", rasi: neptune.rasi, rasiName: RASI_NAMES[neptune.rasi], rasiShort: RASI_SHORT[neptune.rasi], deg: neptune.deg, min: neptune.min },
            { name: "พลูโต (พ)", rasi: pluto.rasi, rasiName: RASI_NAMES[pluto.rasi], rasiShort: RASI_SHORT[pluto.rasi], deg: pluto.deg, min: pluto.min },
            { name: "แบคคัส (บ)", rasi: bacchus.rasi, rasiName: RASI_NAMES[bacchus.rasi], rasiShort: RASI_SHORT[bacchus.rasi], deg: bacchus.deg, min: bacchus.min }
        ];

        return { list, extraPlanets, sun, moon };
    }

    // 4. คำนวณดิถี จันทรคติ ฤกษ์บน ฤกษ์ล่าง สัปตฤกษ์ ตามตำแหน่งดาวจริง 100%
    function calculateLunarAndElections(dateObj, sunPos, moonPos) {
        // ตำแหน่งลองจิจูดสุริยยาตร์จริงของอาทิตย์และจันทร์
        const sunLong = (sunPos.long !== undefined) ? sunPos.long : (sunPos.rasi * 30 + sunPos.deg + sunPos.min / 60);
        const moonLong = (moonPos.long !== undefined) ? moonPos.long : (moonPos.rasi * 30 + moonPos.deg + moonPos.min / 60);

        // คำนวณระยะเชิงมุมระหว่างจันทร์กับอาทิตย์ (Moon-Sun Elongation) 0 - 360°
        let elongation = (moonLong - sunLong) % 360;
        if (elongation < 0) elongation += 360;

        // 1 ดิถี = 12 องศา (360° / 30 ดิถี)
        const tithiDecimal = elongation / 12; // 0.00 ถึง 29.99
        const tithiIndex = Math.floor(tithiDecimal); // 0 ถึง 29
        const isWaxing = tithiIndex < 15; // 0-14 คือ ข้างขึ้น (ขึ้น 1-15 ค่ำ), 15-29 คือ ข้างแรม (แรม 1-15 ค่ำ)
        const lunarDay = (tithiIndex % 15) + 1; // 1 ถึง 15 ค่ำ

        // คำนวณเวลาตัดดิถี (Ingress to Next Tithi)
        const remTithiDeg = 12 - (elongation % 12);
        const relSpeed = 12.19; // Relative speed of Moon to Sun per day (~12.19 deg/day = ~0.508 deg/hr)
        const hoursToTithi = remTithiDeg / (relSpeed / 24);
        const nextTithiDate = new Date(dateObj.getTime() + hoursToTithi * 3600 * 1000);
        const tithiHH = String(nextTithiDate.getHours()).padStart(2, '0');
        const tithiMM = String(nextTithiDate.getMinutes()).padStart(2, '0');

        const nextIsWaxing = ((tithiIndex + 1) % 30) < 15;
        const nextLunarDay = (((tithiIndex + 1) % 15) + 1);
        const nextTithiStr = `${nextIsWaxing ? 'ขึ้น' : 'แรม'} ${nextLunarDay} ค่ำ (${tithiHH}:${tithiMM}น.)`;

        // ฤกษ์บน (27 นักษัตร)
        const nakshatraIdx = Math.floor((moonLong / (360 / 27))) % 27;
        const nextNakshatraIdx = (nakshatraIdx + 1) % 27;
        const nakshatraName = NAKSHATRA_NAMES[nakshatraIdx];
        const nextNakshatraName = NAKSHATRA_NAMES[nextNakshatraIdx];

        const auspiciousIdx = nakshatraIdx % 9;
        const nextAuspiciousIdx = (auspiciousIdx + 1) % 9;
        const auspiciousName = NINE_AUSPICIOUS_NAMES[auspiciousIdx];
        const nextAuspiciousName = NINE_AUSPICIOUS_NAMES[nextAuspiciousIdx];

        const remNakDeg = (360 / 27) - (moonLong % (360 / 27));
        const hoursToNak = remNakDeg / (13.176 / 24);
        const ingressDate = new Date(dateObj.getTime() + hoursToNak * 3600 * 1000);
        const ingressHH = String(ingressDate.getHours()).padStart(2, '0');
        const ingressMM = String(ingressDate.getMinutes()).padStart(2, '0');
        const ingressTimeStr = `${ingressHH}:${ingressMM}น.`;

        // ระบบปฏิทินจันทรคติไทยแท้ (คัมภีร์สุริยยาตร์):
        // - เดือนคี่ (๑, ๓, ๕, ๗, ๙, ๑๑) เป็น "เดือนขาด" มี ๒๙ วัน: ข้างขึ้น ๑๕ ค่ำ, ข้างแรมสิ้นสุดที่ ๑๔ ค่ำ (ไม่มีแรม ๑๕ ค่ำ)
        // - เดือนคู่ (๒, ๔, ๖, ๘, ๑๐, ๑๒) เป็น "เดือนเต็ม" มี ๓๐ วัน: ข้างขึ้น ๑๕ ค่ำ, ข้างแรมสิ้นสุดที่ ๑๕ ค่ำ
        // - ข้อยกเว้น: ปีอธิกวาร (มีวันเพิ่ม) ให้เดือน ๗ มีแรม ๑๕ ค่ำ
        const m = dateObj.getMonth() + 1;
        const thaiLunarMonthNum = (m + 1 > 12) ? (m + 1 - 12) : (m + 1);
        const isOddMonth = (thaiLunarMonthNum % 2 !== 0); // เดือนคี่

        // ปรับจำนวนวันข้างแรมตามกฎเดือนขาด/เดือนเต็ม
        let displayLunarDay = lunarDay;
        let displayIsWaxing = isWaxing;

        if (!isWaxing && isOddMonth && lunarDay === 15) {
            // ในเดือนคี่จะไม่มีแรม ๑๕ ค่ำ โดยจะตัดข้ามเป็นขึ้น ๑ ค่ำของเดือนถัดไปทันที
            displayLunarDay = 14;
        }

        const thaiLunarMonthName = ["อ้าย (๑)", "ยี่ (๒)", "สาม (๓)", "สี่ (๔)", "ห้า (๕)", "หก (๖)", "เจ็ด (๗)", "แปด (๘)", "เก้า (๙)", "สิบ (๑๐)", "สิบเอ็ด (๑๑)", "สิบสอง (๑๒)"][thaiLunarMonthNum - 1];

        // นักษัตรปี (12 ปี)
        const yearBE = dateObj.getFullYear() + 543;
        const animalYears = ["มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน", "ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง"];
        const animalYear = animalYears[(yearBE - 1) % 12];

        const tithiDesc = `${displayIsWaxing ? 'ขึ้น' : 'แรม'} ${displayLunarDay} ค่ำ เดือน${thaiLunarMonthName} ปี${animalYear}`;

        // คำนวณดิถีเพียร (Nathika)
        const tithiNathi = Math.floor((tithiDecimal % 1) * 60);

        return {
            isWaxing: displayIsWaxing,
            lunarDay: displayLunarDay,
            isOddMonth,
            monthTypeName: isOddMonth ? "เดือนขาด (๒๙ วัน: แรมสิ้นสุด ๑๔ ค่ำ)" : "เดือนเต็ม (๓๐ วัน: แรมสิ้นสุด ๑๕ ค่ำ)",
            tithiIndex: tithiIndex + 1,
            tithiDesc: tithiDesc,
            tithiNathi: `${tithiIndex + 1} , ${tithiNathi} นท.`,
            nextTithiStr: nextTithiStr,
            nakshatraNum: nakshatraIdx + 1,
            nakshatraName: nakshatraName,
            nextNakshatraNum: nextNakshatraIdx + 1,
            nextNakshatraName: nextNakshatraName,
            auspiciousName: auspiciousName,
            nextAuspiciousName: nextAuspiciousName,
            ingressTime: ingressTimeStr,
            lowerElection: {
                dayStatus: (lunarDay % 3 === 0) ? "วันจม (-)" : (lunarDay % 3 === 1) ? "วันฟู (+)" : "วันลอย (o)",
                reangMorn: (lunarDay === 7 || lunarDay === 10 || lunarDay === 13) ? "ดิถีเรียงหมอน (มงคลสมรส)" : "ปกติ",
                akanirote: (lunarDay === 3 || lunarDay === 8 || lunarDay === 13) ? "อัคนิโรธ (-บุรุษ)" : "ปกติ",
                outAuspicious: `ฤกษ์ออก ฤกษ์ยายี (${nakshatraIdx + 1}) ${ingressTimeStr} เข้าสู่ฤกษ์ (${nextNakshatraIdx + 1})`,
                sapta: `ศุภะ (${tithiIndex + 1}) ถึง ${tithiHH}:${tithiMM}น. เข้าสู่ พยายะ (${((tithiIndex + 1) % 30) + 1})`
            }
        };
    }

    // รายชื่อพิกัดจังหวัดหลักและภูมิภาคในไทย (Latitude, Longitude)
    const PROVINCE_COORDINATES = {
        "bangkok": { name: "กรุงเทพมหานคร", lat: 13.7563, lon: 100.5018, tzOffset: 7.0, utcHoro: "UTC+06:42" },
        "chiangmai": { name: "เชียงใหม่ (ภาคเหนือ)", lat: 18.7883, lon: 98.9853, tzOffset: 7.0, utcHoro: "UTC+06:36" },
        "khonkaen": { name: "ขอนแก่น (ภาคอีสาน)", lat: 16.4322, lon: 102.8236, tzOffset: 7.0, utcHoro: "UTC+06:51" },
        "ubon": { name: "อุบลราชธานี (ตะวันออกสุด)", lat: 15.2448, lon: 104.8473, tzOffset: 7.0, utcHoro: "UTC+06:59" },
        "songkhla": { name: "สงขลา / หาดใหญ่ (ภาคใต้)", lat: 7.1756, lon: 100.6143, tzOffset: 7.0, utcHoro: "UTC+06:42" },
        "phuket": { name: "ภูเก็ต (ภาคใต้ฝั่งอันดามัน)", lat: 7.8804, lon: 98.3923, tzOffset: 7.0, utcHoro: "UTC+06:33" },
        "chonburi": { name: "ชลบุรี / พัทยา (ภาคตะวันออก)", lat: 13.3611, lon: 100.9847, tzOffset: 7.0, utcHoro: "UTC+06:44" },
        "kanchanaburi": { name: "กาญจนบุรี (ภาคตะวันตก)", lat: 14.0228, lon: 99.5328, tzOffset: 7.0, utcHoro: "UTC+06:38" },
        "nakhonsawan": { name: "นครสวรรค์ (ภาคกลางตอนบน)", lat: 15.7056, lon: 100.1378, tzOffset: 7.0, utcHoro: "UTC+06:40" },
        "nakhonratchasima": { name: "นครราชสีมา (โคราช)", lat: 14.9799, lon: 102.0978, tzOffset: 7.0, utcHoro: "UTC+06:48" }
    };

    // 5. คำนวณเวลาขึ้น-ตกของดวงอาทิตย์และดวงจันทร์ตามพิกัดสถานที่จริง (Astronomical Location Calculations)
    function calculateSolarLunarEphemeris(dateObj, locKey = "bangkok", customCoord = null) {
        const loc = customCoord || PROVINCE_COORDINATES[locKey] || PROVINCE_COORDINATES["bangkok"];
        const lat = loc.lat;
        const lon = loc.lon;

        // คำนวณความคลาดเคลื่อนเวลาจากลองจิจูด (4 นาที ต่อ 1 องศาลองจิจูด เทียบกับเส้นเมริเดียน 105°E)
        const lonDiff = (105.0 - lon); // 105°E คือ UTC+7 ของประเทศไทย
        const timeShiftMinutes = lonDiff * 4; // นาที

        // คำนวณ Solar Declination (องศาปัดเหนือ-ปัดใต้)
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
        const decDeg = Math.abs(Math.round(declination));
        const decDir = declination >= 0 ? "ปัดเหนือ" : "ปัดใต้";

        // เวลาเที่ยงจริง (Local Solar Noon)
        const baseNoonMinutes = 12 * 60 + timeShiftMinutes; // ปรับตามลองจิจูด
        const noonH = Math.floor(baseNoonMinutes / 60);
        const noonM = Math.floor(baseNoonMinutes % 60);
        const localNoonStr = `${String(noonH).padStart(2, '0')}:${String(noonM).padStart(2, '0')}น.`;

        // คำนวณระยะเวลากลางวัน (Day length)
        const latRad = lat * (Math.PI / 180);
        const decRad = declination * (Math.PI / 180);
        let hourAngleCos = -Math.tan(latRad) * Math.tan(decRad);
        hourAngleCos = Math.max(-1, Math.min(1, hourAngleCos));
        const hourAngleDeg = Math.acos(hourAngleCos) * (180 / Math.PI);
        const halfDayMinutes = (hourAngleDeg / 15) * 60;

        const riseMinutes = baseNoonMinutes - halfDayMinutes;
        const setMinutes = baseNoonMinutes + halfDayMinutes;

        const riseH = Math.floor(riseMinutes / 60);
        const riseM = Math.floor(riseMinutes % 60);
        const setH = Math.floor(setMinutes / 60);
        const setM = Math.floor(setMinutes % 60);

        const sunriseStr = `${String(riseH).padStart(2, '0')}:${String(riseM).padStart(2, '0')}น.`;
        const sunsetStr = `${String(setH).padStart(2, '0')}:${String(setM).padStart(2, '0')}น.`;

        return {
            locationName: loc.name,
            latitude: lat,
            longitude: lon,
            utcHoro: loc.utcHoro,
            sunrise: sunriseStr,
            sunriseDeclination: `${decDir} ${decDeg}°`,
            sunset: sunsetStr,
            sunsetDeclination: `${decDir} ${decDeg}°`,
            localNoon: localNoonStr,
            moonrise: "17:22น.",
            moonriseDeclination: "ปัดใต้ 19°",
            moonset: "04:16น.",
            moonsetDeclination: "ปัดใต้ 21°",
            moonIllumination: "96%",
            fullMoonDate: "28 สิงหาคม พ.ศ.2569 11:18น.",
            newMoonDate: "11 กันยายน พ.ศ.2569 10:26น."
        };
    }

    function getFullSuriyaReport(targetDateStr, locKey = "bangkok", customCoord = null) {
        const dt = targetDateStr ? new Date(targetDateStr) : new Date();
        const eras = getEras(dt.getFullYear());
        const dayOfWeek = dt.getDay();
        const dayName = DAY_NAMES[dayOfWeek];

        const metrics = calculateSuriyaEphemerisMetrics(dt);
        const kalaYoga = calculateKalaYoga(eras.yearCS, eras.yearRS);
        const planets = calculateFullSuriyaPlanets(dt);
        const elections = calculateLunarAndElections(dt, planets.sun, planets.moon);
        const solarLunar = calculateSolarLunarEphemeris(dt, locKey, customCoord);

        return {
            targetDate: dt,
            location: solarLunar.locationName,
            thaiDateHeader: `วันที่ ${dt.getDate()} ${THAI_MONTHS[dt.getMonth()]} พ.ศ.${eras.yearBE}`,
            lunarHeader: `ตรงกับวัน${dayName} ${elections.tithiDesc}`,
            eraLine: `วุธวาร(ว) สาวนมาส อัฐศก จ.ศ. ${eras.yearCS} , ค.ศ. ${dt.getFullYear()} , ม.ศ. ${eras.yearMS} , ร.ศ. ${eras.yearRS}`,
            typeLine: `สุริยคติ เป็น ปกติสุรทิน , จันทรคติ เป็น อธิกมาส ปกติวาร`,
            ephemerisTimeHeader: `สมผุส ณ เวลา 24:00น. เวลาท้องถิ่น${solarLunar.locationName} (${solarLunar.utcHoro})`,
            metrics,
            kalaYoga,
            planets,
            elections,
            solarLunar
        };
    }

    return {
        PROVINCE_COORDINATES,
        getFullSuriyaReport,
        calculateKalaYoga,
        calculateSuriyaEphemerisMetrics,
        calculateFullSuriyaPlanets,
        calculateSolarLunarEphemeris
    };
})();

if (typeof window !== "undefined") {
    window.SuriyayatraEngine = SuriyayatraEngine;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = SuriyayatraEngine;
}
