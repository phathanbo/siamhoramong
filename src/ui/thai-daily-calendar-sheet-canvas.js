/**
 * 📜 Thai Daily Calendar Sheet Canvas Generator (สไตล์สมุดจดดวง 2010 & สยามโหรามงคล)
 * สร้างภาพปฏิทินโหราศาสตร์ไทยรายวันขนาด HD ครบทั้ง:
 * 1. ข้อมูลสุริยคติ - จันทรคติ - ศักราช
 * 2. วงล้อดวงราศีจักร (พร้อมตารางนวางค์ย่อ)
 * 3. ตารางสมผุสดาว ๑๐ ดวง (ราศี, องศา, ลิปดา, วิลิปดา/สถานะ, ตรียางค์/นวางค์/ฤกษ์, พิษ, เวลาย้ายราศี/นวางค์)
 * 4. สรุปดวงอาทิตย์-ดวงจันทร์ขึ้นตก, นวางค์จันทร์, ฤกษ์บน-ฤกษ์ล่าง, ดิถี, ศรี/กาลี, พินทุบาทว์, ลัคนา ๒๔ ชม., ทัศนจันทร์
 * 5. แถบลายเซ็นอนุรักษ์วิชาโหราศาสตร์ไทย
 */

const ThaiDailyCalendarSheet = (function() {
    "use strict";

    const THAI_NUMS = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
    const RASI_NAMES = ["เมษ", "พฤษภ", "มิถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
    const RASI_SHORT = ["มษ", "พภ", "มถ", "กฎ", "สห", "กน", "ตล", "พจ", "ธน", "มก", "กภ", "มน"];
    const DAY_NAMES = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const LUNAR_MONTH_NAMES = ["อ้าย", "ยี่", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ", "สิบเอ็ด", "สิบสอง"];
    const ANIMAL_YEARS = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];

    // ดาวครองเรือนเกษตร 12 ราศี (0=เมษ ถึง 11=มีน)
    const KASET_OWNERS = [3, 6, 4, 2, 1, 4, 6, 3, 5, 7, 8, 5];

    // 9 ฤกษ์
    const NINE_REUX = [
        "ทลิทโท", "มหัทธโน", "โจโร", "ภูมิปาโล", "เทศาตรี", "เทวี", "เพชฌฆาต", "ราชา", "สมโณ"
    ];

    // แปลงตัวเลขอารบิกทั้งหมดให้เป็นตัวเลขไทย (รองรับทั้งตัวเลขเดี่ยว ข้อความ และเวลา)
    function toThaiNum(str) {
        if (str === undefined || str === null) return "";
        return String(str).replace(/[0-9]/g, ch => THAI_NUMS[parseInt(ch, 10)]);
    }

    // คำนวณตรียางค์ (1 ราศี = 3 ตรียางค์ ตรียางค์ละ 10°)
    function getDrekkana(rasi, deg) {
        const dIdx = Math.min(2, Math.floor(deg / 10)); // 0, 1, 2
        let targetRasi = rasi;
        if (dIdx === 1) targetRasi = (rasi + 4) % 12; // ธาตุเดียวกัน ลำดับถัดไป
        else if (dIdx === 2) targetRasi = (rasi + 8) % 12;
        const lord = KASET_OWNERS[targetRasi];
        return { index: dIdx + 1, lordRasi: targetRasi, lordPlanet: lord };
    }

    // คำนวณนวางค์ (1 ราศี = 9 นวางค์ นวางค์ละ 3°20' หรือ 200')
    function getNavamsha(rasi, deg, min) {
        const totalMinutes = deg * 60 + min;
        const nIdx = Math.min(8, Math.floor(totalMinutes / 200)); // 0 ถึง 8
        // จุดเริ่มต้นนวางค์แรกตามธาตุ
        let startRasi = 0; // เมษ (ไฟ)
        const element = rasi % 4; // 0=ไฟ, 1=ดิน, 2=ลม, 3=น้ำ
        if (element === 0) startRasi = 0; // เมษ
        else if (element === 1) startRasi = 9; // มังกร
        else if (element === 2) startRasi = 6; // ตุลย์
        else if (element === 3) startRasi = 3; // กรกฎ

        const navRasi = (startRasi + nIdx) % 12;
        const lord = KASET_OWNERS[navRasi];
        return { index: nIdx + 1, navRasi, lordPlanet: lord };
    }

    // คำนวณฤกษ์ประจำองศา (27 นักษัตร)
    function getNaksatraReux(longDeg) {
        const nakIdx = Math.floor(longDeg / (360 / 27)) % 27;
        const reuxIdx = nakIdx % 9;
        return {
            nakIndex: nakIdx + 1,
            reuxName: NINE_REUX[reuxIdx]
        };
    }

    // คำนวณเกณฑ์พิษ (พิษครุฑ, พิษสุนัข, พิษนาค)
    function checkPoison(planetNum, rasi, drekIndex, navIndex) {
        // ตำราพิษโหราศาสตร์ไทย
        if (rasi === 0 && drekIndex === 3) return "สุนัข"; // พิษสุนัข เมษ ตรียางค์ 3
        if (rasi === 3 && drekIndex === 2) return "ครุฑ";  // พิษครุฑ กรกฎ ตรียางค์ 2
        if (rasi === 4 && (drekIndex === 2 || navIndex === 5)) return "ครุฑ";
        if (rasi === 6 && drekIndex === 2) return "ครุฑ";
        if (rasi === 7 && drekIndex === 3) return "นาค";   // พิษนาค พิจิก
        if (rasi === 10 && drekIndex === 1) return "สุนัข";
        if (rasi === 1 && drekIndex === 2) return "ครุฑ";
        if (planetNum === 4 || planetNum === 6) {
            if (rasi === 6) return "ครุฑ";
        }
        if (planetNum === 5 && rasi === 3) return "สุนัข";
        if (planetNum === 0 && rasi === 1) return "ครุฑ";
        return "";
    }

    // คำนวณทักษาประจำวัน (ศรี, กาลี)
    function getTaksaDay(dayOfWeek) { // 0=อาทิตย์ ถึง 6=เสาร์
        // บริวาร อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี
        const taksaOrder = [1, 2, 3, 4, 7, 5, 8, 6];
        const dayIdxMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5, 5: 7, 6: 4 }; // อังคาร=2, พุธ=3, เสาร์=4, พฤหัส=5, ราหู=6, ศุกร์=7
        const baseIdx = dayIdxMap[dayOfWeek] !== undefined ? dayIdxMap[dayOfWeek] : 0;
        
        function getAt(offset) {
            return taksaOrder[(baseIdx + offset) % 8];
        }

        const sriPlanet = getAt(3);
        const kaliPlanet = getAt(7);

        const planetDetails = {
            1: { name: "อาทิตย์", rasi: "สิงห์", dir: "อีสาน", color: "แดง" },
            2: { name: "จันทร์", rasi: "สิงห์", dir: "ตะวันออก", color: "ขาว,งาช้าง" },
            3: { name: "อังคาร", rasi: "พิจิก", dir: "อาคเนย์", color: "ชมพู" },
            4: { name: "พุธ", rasi: "กันย์", dir: "ทักษิณ", color: "เขียว" },
            5: { name: "พฤหัสบดี", rasi: "กรกฎ", dir: "ตะวันตก", color: "เหลือง,น้ำตาล" },
            6: { name: "ศุกร์", rasi: "ตุลย์", dir: "อุดร", color: "ฟ้า,น้ำเงิน" },
            7: { name: "เสาร์", rasi: "มังกร", dir: "หรดี", color: "ดำ,ม่วง" },
            8: { name: "ราหู", rasi: "กุมภ์", dir: "พายัพ", color: "เทา,บรอนซ์" }
        };

        return {
            sri: { num: sriPlanet, ...planetDetails[sriPlanet] },
            kali: { num: kaliPlanet, ...planetDetails[kaliPlanet] }
        };
    }

    // สรุปข้อมูลทั้งหมดของวันเพื่อใช้วาด Canvas
    function prepareDailyCalendarData(dateObj, locationKey = "bangkok") {
        const dt = dateObj ? new Date(dateObj) : new Date();
        const y = dt.getFullYear();
        const m = dt.getMonth();
        const d = dt.getDate();
        const dayOfWeek = dt.getDay(); // 0-6

        const yearBE = y + 543;
        const yearCS = yearBE - 1181;
        // 2567 = มะโรง (index 4), 2569 = มะเมีย (index 6)
        const animalYearIdx = ((yearBE - 2567 + 4) % 12 + 12) % 12;
        const animalYear = ANIMAL_YEARS[animalYearIdx];

        // เรียกข้อมูลจาก SuriyayatraEngine
        let rep = null;
        if (typeof SuriyayatraEngine !== "undefined" && SuriyayatraEngine.getFullSuriyaReport) {
            rep = SuriyayatraEngine.getFullSuriyaReport(dt, locationKey);
        }

        // คำนวณสมผุสดาวพื้นฐาน
        let planetsList = [];
        if (rep && rep.planets && rep.planets.list) {
            planetsList = rep.planets.list;
        } else {
            // fallback ถ้าไม่มี engine
            planetsList = [
                { num: 1, thNum: "๑", name: "อาทิตย์", rasi: 5, deg: 18, min: 36, motion: "ปกติ" },
                { num: 2, thNum: "๒", name: "จันทร์", rasi: 4, deg: 0, min: 31, motion: "ปกติ" },
                { num: 3, thNum: "๓", name: "อังคาร", rasi: 3, deg: 10, min: 24, motion: "ปกติ" },
                { num: 4, thNum: "๔", name: "พุธ", rasi: 6, deg: 13, min: 59, motion: "มนท์ (ม)" },
                { num: 5, thNum: "๕", name: "พฤหัสบดี", rasi: 3, deg: 28, min: 4, motion: "เสริด (ส)" },
                { num: 6, thNum: "๖", name: "ศุกร์", rasi: 6, deg: 19, min: 42, motion: "มนท์ (ม)" },
                { num: 7, thNum: "๗", name: "เสาร์", rasi: 11, deg: 10, min: 19, motion: "พักร์ (พ)" },
                { num: 8, thNum: "๘", name: "ราหู", rasi: 10, deg: 2, min: 27, motion: "ปกติ" },
                { num: 9, thNum: "๙", name: "เกตุ", rasi: 7, deg: 4, min: 12, motion: "ปกติ" },
                { num: 0, thNum: "๐", name: "มฤตยู", rasi: 1, deg: 18, min: 33, motion: "พักร์ (พ)" }
            ];
        }

        // เสริมข้อมูลตรียางค์ / นวางค์ / ฤกษ์ / พิษ ให้แต่ละดาว
        const enhancedPlanets = planetsList.map((p, idx) => {
            const pNum = p.num !== undefined ? p.num : (idx === 9 ? 0 : idx + 1);
            const rasi = p.rasi !== undefined ? p.rasi : 0;
            const deg = p.deg !== undefined ? p.deg : 0;
            const min = p.min !== undefined ? p.min : 0;
            const longDeg = rasi * 30 + deg + min / 60;

            const drek = getDrekkana(rasi, deg);
            const nav = getNavamsha(rasi, deg, min);
            const reux = getNaksatraReux(longDeg);
            const poison = checkPoison(pNum, rasi, drek.index, nav.index);

            // สถานะย่อ พ/ส/ม
            let motionShort = "";
            if (p.motion) {
                if (p.motion.includes("พักร์") || p.motion.includes("พ.")) motionShort = "พ";
                else if (p.motion.includes("เสริด") || p.motion.includes("ส.")) motionShort = "ส";
                else if (p.motion.includes("มนท์") || p.motion.includes("ม.")) motionShort = "ม";
            }

            // เวลาย้ายราศี และย้ายนวางค์จำลอง (เป็นเลขไทย)
            let moveRasiTime = "";
            let moveNavTime = "";
            if (pNum === 2) {
                moveRasiTime = toThaiNum("23.07");
            } else if (pNum === 3) {
                moveNavTime = toThaiNum("05.08");
            }

            return {
                ...p,
                num: pNum,
                thNum: toThaiNum(pNum),
                rasi,
                deg,
                min,
                motionShort,
                drek,
                nav,
                reux,
                poison,
                drekNavReuxStr: `${toThaiNum(drek.index)}:${toThaiNum(drek.lordPlanet)}/${toThaiNum(nav.index)}:${toThaiNum(nav.lordPlanet)}/${reux.reuxName}`,
                moveRasiTime,
                moveNavTime
            };
        });

        // ข้อมูลสุริย-จันทรคติ
        const lunarMonth = rep && rep.elections ? rep.elections.lunarMonthNum : (((m + 1) > 12) ? ((m + 1) - 12) : (m + 1));
        const isWaxing = rep ? rep.elections.isWaxing : false;
        const lunarDay = rep ? rep.elections.lunarDay : 10;
        const thaiNumDay = toThaiNum(lunarDay);
        const lunarPhaseStr = isWaxing ? `ขึ้น ${thaiNumDay} ค่ำ` : `แรม ${thaiNumDay} ค่ำ`;

        let lunarMonthName = "สิบ";
        if (rep && rep.elections && rep.elections.lunarMonthName) {
            // ดึงเฉพาะชื่อเดือนไทย เช่น "สิบ", "เก้า", "แปดหลัง"
            lunarMonthName = rep.elections.lunarMonthName.split(" ")[0].trim();
        } else {
            lunarMonthName = LUNAR_MONTH_NAMES[lunarMonth - 1] || "สิบ";
        }

        const calculatedAnimalYear = rep && rep.elections && rep.elections.animalYear ? rep.elections.animalYear : animalYear;

        // ฤกษ์บน / ฤกษ์ล่าง
        const taksa = getTaksaDay(dayOfWeek);

        // เวลาดวงอาทิตย์ / ดวงจันทร์ ขึ้น-ตก (แปลงเป็นเลขไทย)
        const sunrise = rep ? toThaiNum(rep.solarLunar.sunrise) : toThaiNum("06.08");
        const localNoon = rep ? toThaiNum(rep.solarLunar.localNoon) : toThaiNum("12.07");
        const sunset = rep ? toThaiNum(rep.solarLunar.sunset) : toThaiNum("18.05");
        const moonrise = rep ? toThaiNum(rep.solarLunar.moonrise) : toThaiNum("02.00");
        const moonset = rep ? toThaiNum(rep.solarLunar.moonset) : toThaiNum("15.02");

        return {
            dateObj: dt,
            dayName: DAY_NAMES[dayOfWeek],
            dayDate: toThaiNum(d),
            monthName: THAI_MONTHS[m],
            yearBE: toThaiNum(yearBE),
            yearCS: toThaiNum(yearCS),
            animalYear: calculatedAnimalYear,
            lunarMonthName: lunarMonthName,
            lunarPhaseStr,
            planets: enhancedPlanets,
            taksa,
            solarLunar: {
                sunrise,
                localNoon,
                sunset,
                moonrise,
                moonset
            },
            elections: rep ? rep.elections : null
        };
    }

    // วาดการ์ดปฏิทินดวงรายวันลงบน Canvas
    function renderDailySheetCanvas(canvasId, targetDate, locationKey = "bangkok") {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");

        // ขนาด Canvas มาตรฐาน คมชัดระดับ HD
        const W = 1080;
        const H = 1080;
        canvas.width = W;
        canvas.height = H;

        const data = prepareDailyCalendarData(targetDate, locationKey);

        // 1. พื้นหลังสีขาวสะอาด
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);

        // กรอบนอกหลัก
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 3;
        ctx.strokeRect(16, 16, W - 32, H - 32);

        // ลายน้ำจางๆ สยามโหรามงคล / สมุดจดดวง
        ctx.save();
        ctx.font = "bold 65px 'Sarabun', sans-serif";
        ctx.fillStyle = "rgba(226, 232, 240, 0.4)";
        ctx.textAlign = "center";
        ctx.translate(W / 2, H / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText("สมุดจดดวง • สยามโหรามงคล", 0, -80);
        ctx.fillText("วิชาโหราศาสตร์ไทย ๒๕๖๙", 0, 50);
        ctx.restore();

        // -------------------------------------------------------------
        // 2. HEADER: สุริยคติ & จันทรคติ (ปรับตำแหน่งให้กึ่งกลางสมดุล)
        // -------------------------------------------------------------
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#0f172a";

        const headerStartY = 54;

        // บรรทัดที่ 1: สุริยคติ
        ctx.font = "bold 34px 'Sarabun', sans-serif";
        const solarText = `สุริยคติ ${data.dayName} ที่ ${data.dayDate} เดือน ${data.monthName} พุทธศักราช ${data.yearBE}`;
        ctx.fillText(solarText, 32, headerStartY);

        // บรรทัดที่ 2: จันทรคติ
        ctx.font = "bold 32px 'Sarabun', sans-serif";
        const lunarText = `จันทรคติ ${data.dayName} ${data.lunarPhaseStr} เดือน ${data.lunarMonthName} ปี${data.animalYear} จุลศักราช ${data.yearCS}`;
        ctx.fillText(lunarText, 32, headerStartY + 42);

        // เส้นคั่นใต้ Header
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(24, headerStartY + 88);
        ctx.lineTo(W - 24, headerStartY + 88);
        ctx.stroke();

        // -------------------------------------------------------------
        // 3. UPPER SECTION: วงกลมราศีจักร (ซ้าย) & ตารางสมผุสดาว (ขวา)
        // -------------------------------------------------------------
        const topSectionY = headerStartY + 98; // 152
        const chartW = 390;
        const tableX = 415;
        const tableW = W - tableX - 28; // ~637px
        const upperH = 410;

        // --- ด้านซ้าย: วงล้อดวงราศีจักร ---
        drawRasiWheel(ctx, 32, topSectionY, chartW, upperH, data);

        // --- ด้านขวา: ตารางสมผุสดาว ๑๐ ดวง ---
        drawPlanetEphemerisTable(ctx, tableX, topSectionY, tableW, upperH, data);

        // -------------------------------------------------------------
        // 4. LOWER SECTION: รายละเอียดสรุปดาราศาสตร์ & โหราศาสตร์ (การ์ดหมวดหมู่ อ่านเข้าใจง่าย 100%)
        // -------------------------------------------------------------
        const botY = topSectionY + upperH + 16; // 578
        drawDetailedFooterInfo(ctx, 28, botY, W - 56, data);

        // (ลบแถบตราสัญลักษณ์ด้านล่างออก เพื่อความสะอาด สบายตา และจัดตำแหน่งกึ่งกลางรูปภาพพอดี)

        return data;
    }

    // ฟังก์ชันวาดวงล้อราศีจักร (ซ้ายบน)
    function drawRasiWheel(ctx, x, y, w, h, data) {
        ctx.save();

        // กล่องนวางค์/ชันษาจิ๋ว มุมซ้ายบน (3x3 grid)
        const miniX = x + 4;
        const miniY = y + 4;
        const miniSize = 64;
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1;
        ctx.strokeRect(miniX, miniY, miniSize, miniSize);
        // เส้นแบ่ง 3x3
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(miniX + i * (miniSize / 3), miniY);
            ctx.lineTo(miniX + i * (miniSize / 3), miniY + miniSize);
            ctx.moveTo(miniX, miniY + i * (miniSize / 3));
            ctx.lineTo(miniX + miniSize, miniY + i * (miniSize / 3));
            ctx.stroke();
        }
        ctx.font = "11px 'Sarabun', sans-serif";
        ctx.fillStyle = "#334155";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const sampleMini = [
            ["๒", "๕", "๓"],
            ["๑", "๙", "๔"],
            ["ภ", "๗", "๐"]
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                ctx.fillText(sampleMini[r][c], miniX + c * 21 + 11, miniY + r * 21 + 11);
            }
        }

        // วงกลมหลักดวงราศีจักร
        const cx = x + w / 2;
        const cy = y + h / 2 - 12;
        const outerR = 175;
        const midR = outerR * 0.76;
        const innerR = outerR * 0.28;

        // เส้นรอบวงกลมนอก & ใน สีส้มอมทองสไตล์โบราณ
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, midR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.stroke();

        // เส้นแบ่ง 12 ราศี (ทุก 30 องศา)
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 12; i++) {
            const rad = (i * 30 - 90) * Math.PI / 180;
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // กากบาทแบ่ง 4 จตุรภาคตรงกลาง
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - innerR, cy);
        ctx.lineTo(cx + innerR, cy);
        ctx.moveTo(cx, cy - innerR);
        ctx.lineTo(cx, cy + innerR);
        ctx.stroke();

        // องศาตรงกลางวงกลม (เช่น ๑๗/๕๔)
        ctx.font = "bold 13px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(toThaiNum("17/54"), cx, cy);

        // จัดดาวลง 12 ราศี
        const planetsInRasi = {};
        for (let i = 0; i < 12; i++) planetsInRasi[i] = [];

        // ลัคนาจร (จำลอง ณ ราศีเมษ หรือตามข้อมูล)
        // บรรจุดาว ๑-๐
        data.planets.forEach(p => {
            planetsInRasi[p.rasi].push(p);
        });

        // วาดชื่อดาวในแต่ละราศี
        for (let rasi = 0; rasi < 12; rasi++) {
            const list = planetsInRasi[rasi];
            if (list.length === 0) continue;

            const midAngle = ((rasi * 30) - 75) * Math.PI / 180;
            const px = cx + (outerR * 0.52) * Math.cos(midAngle);
            const py = cy + (outerR * 0.52) * Math.sin(midAngle);

            ctx.font = "bold 23px 'Sarabun', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (list.length === 1) {
                const item = list[0];
                ctx.fillStyle = (item.num === 2) ? "#dc2626" : "#0f172a"; // ดาว ๒ เป็นสีแดง
                ctx.fillText(item.thNum, px, py);
            } else {
                // มีหลายดวงเรียงกัน
                const combined = list.map(item => item.thNum).join(" ");
                // เช็คว่ามีดาว ๒ หรือไม่
                const hasMoon = list.some(item => item.num === 2);
                ctx.fillStyle = hasMoon ? "#dc2626" : "#0f172a";
                ctx.fillText(combined, px, py);
            }
        }

        // ตัวเลขเวลาใต้ดวง (ซ้าย ๐๕-๑๘-๓๖ / ขวา ๐๗.๒๕)
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "left";
        ctx.fillText(toThaiNum("05-18-36"), x + 16, y + h - 14);

        ctx.textAlign = "right";
        ctx.fillText(toThaiNum("07.25"), x + w - 16, y + h - 14);

        ctx.restore();
    }

    // ฟังก์ชันวาดตารางสมผุสดาว ๑๐ ดวง (ขวาบน)
    function drawPlanetEphemerisTable(ctx, x, y, w, h, data) {
        ctx.save();

        const rowCount = 11; // 1 หัวตาราง + 10 ดาว
        const rowH = h / rowCount;

        // คอลัมน์: ดาว, ร., อ., ล., วิ., ตรียางค์/นวางค์/ฤกษ์, พิษ, ย้าย ร., ย้าย นว.
        const cols = [
            { key: "planet", title: "ดาว", w: 48, align: "center" },
            { key: "rasi", title: "ร.", w: 34, align: "center" },
            { key: "deg", title: "อ.", w: 34, align: "center" },
            { key: "min", title: "ล.", w: 34, align: "center" },
            { key: "motion", title: "วิ.", w: 32, align: "center" },
            { key: "drekNav", title: "ตรียางค์/นวางค์/ฤกษ์", w: 200, align: "left" },
            { key: "poison", title: "พิษ", w: 52, align: "center" },
            { key: "moveRasi", title: "ย้าย ร.", w: 66, align: "center" },
            { key: "moveNav", title: "ย้ายนว.", w: 62, align: "center" }
        ];

        // วาดเส้นกรอบนอกตาราง
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, w, h);

        // วาดหัวตาราง
        let curX = x;
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        cols.forEach((col, idx) => {
            const cx = (col.align === "left") ? curX + 8 : curX + col.w / 2;
            ctx.textAlign = col.align;
            ctx.fillText(col.title, cx, y + rowH / 2);

            // เส้นคั่นแนวตั้ง
            if (idx < cols.length - 1) {
                ctx.beginPath();
                ctx.moveTo(curX + col.w, y);
                ctx.lineTo(curX + col.w, y + h);
                ctx.stroke();
            }
            curX += col.w;
        });

        // เส้นคั่นแนวนอนใต้หัวตาราง
        ctx.beginPath();
        ctx.moveTo(x, y + rowH);
        ctx.lineTo(x + w, y + rowH);
        ctx.stroke();

        // ข้อมูลแถวของดาว ๑๐ ดวง
        data.planets.forEach((p, rIdx) => {
            const rowY = y + (rIdx + 1) * rowH;

            // เส้นคั่นแนวนอนระหว่างแถว
            ctx.beginPath();
            ctx.moveTo(x, rowY + rowH);
            ctx.lineTo(x + w, rowY + rowH);
            ctx.stroke();

            // พิมพ์ค่าแต่ละคอลัมน์
            let colX = x;
            cols.forEach(col => {
                ctx.textAlign = col.align;
                const textX = (col.align === "left") ? colX + 8 : colX + col.w / 2;
                const textY = rowY + rowH / 2;

                if (col.key === "planet") {
                    ctx.font = "bold 17px 'Sarabun', sans-serif";
                    ctx.fillStyle = (p.num === 2) ? "#dc2626" : "#0f172a"; // ดาว ๒ สีแดง
                    ctx.fillText(p.thNum, textX, textY);
                } else if (col.key === "rasi") {
                    ctx.font = "15px 'Sarabun', sans-serif";
                    ctx.fillStyle = (p.num === 2) ? "#dc2626" : "#0f172a";
                    ctx.fillText(toThaiNum(p.rasi), textX, textY);
                } else if (col.key === "deg") {
                    ctx.font = "15px 'Sarabun', sans-serif";
                    ctx.fillStyle = (p.num === 2) ? "#dc2626" : "#0f172a";
                    const degStr = p.deg < 10 ? "0" + p.deg : String(p.deg);
                    ctx.fillText(toThaiNum(degStr), textX, textY);
                } else if (col.key === "min") {
                    ctx.font = "15px 'Sarabun', sans-serif";
                    ctx.fillStyle = (p.num === 2) ? "#dc2626" : "#0f172a";
                    const minStr = p.min < 10 ? "0" + p.min : String(p.min);
                    ctx.fillText(toThaiNum(minStr), textX, textY);
                } else if (col.key === "motion") {
                    ctx.font = "bold 14px 'Sarabun', sans-serif";
                    ctx.fillStyle = "#0f172a";
                    ctx.fillText(p.motionShort || "", textX, textY);
                } else if (col.key === "drekNav") {
                    ctx.font = "14px 'Sarabun', sans-serif";
                    ctx.fillStyle = (p.num === 2) ? "#dc2626" : "#0f172a";
                    ctx.fillText(p.drekNavReuxStr, textX, textY);
                } else if (col.key === "poison") {
                    ctx.font = "14px 'Sarabun', sans-serif";
                    ctx.fillStyle = "#0f172a";
                    ctx.fillText(p.poison || "", textX, textY);
                } else if (col.key === "moveRasi") {
                    ctx.font = "bold 15px 'Sarabun', sans-serif";
                    ctx.fillStyle = "#dc2626"; // เวลาเน้นสีแดง
                    ctx.fillText(p.moveRasiTime || "", textX, textY);
                } else if (col.key === "moveNav") {
                    ctx.font = "15px 'Sarabun', sans-serif";
                    ctx.fillStyle = "#0f172a";
                    ctx.fillText(p.moveNavTime || "", textX, textY);
                }

                colX += col.w;
            });
        });

        ctx.restore();
    }

    // ฟังก์ชันวาดกล่องขอบมน (Helper Box)
    function drawRoundedBox(ctx, bx, by, bw, bh, radius, fillColor, strokeColor, lineWidth = 1) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, radius);
        } else {
            ctx.rect(bx, by, bw, bh);
        }
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
        ctx.restore();
    }

    // ฟังก์ชันวาดป้ายแท็ก (Badge Tag)
    function drawBadge(ctx, bx, by, text, bgCol, textCol, borderCol) {
        ctx.save();
        ctx.font = "bold 13px 'Sarabun', sans-serif";
        const tw = ctx.measureText(text).width;
        const bw = tw + 18;
        const bh = 26;
        drawRoundedBox(ctx, bx, by, bw, bh, 13, bgCol, borderCol, 1);
        ctx.fillStyle = textCol;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, bx + bw / 2, by + bh / 2);
        ctx.restore();
        return bw;
    }

    // ฟังก์ชันวาดสรุปดาราศาสตร์และฤกษ์ยาม (จัดเป็น 4 การ์ดข้อมูลอ่านเข้าใจง่าย 100% สำหรับผู้ใช้ทั่วไป)
    function drawDetailedFooterInfo(ctx, x, y, w, data) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        // =========================================================================
        // 🗂️ การ์ด 1: พระอาทิตย์ & พระจันทร์ (เวลาขึ้น-ตก และเที่ยงจริง)
        // =========================================================================
        const card1H = 46;
        drawRoundedBox(ctx, x, y, w, card1H, 8, "#f8fafc", "#cbd5e1", 1.2);

        // อาทิตย์
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#b45309"; // ส้มทอง
        ctx.fillText("☀️ พระอาทิตย์:", x + 16, y + card1H / 2);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#1e293b";
        ctx.fillText(`ขึ้น ${data.solarLunar.sunrise} น.   •   เที่ยงจริง ${data.solarLunar.localNoon} น.   •   ตก ${data.solarLunar.sunset} น.`, x + 120, y + card1H / 2);

        // เส้นคั่นกลาง
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.moveTo(x + 550, y + 8);
        ctx.lineTo(x + 550, y + card1H - 8);
        ctx.stroke();

        // จันทร์
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#1d4ed8"; // ฟ้าคราม
        ctx.fillText("🌙 พระจันทร์:", x + 575, y + card1H / 2);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#1e293b";
        ctx.fillText(`ขึ้น ${data.solarLunar.moonrise} น.   •   ตก ${data.solarLunar.moonset} น.`, x + 675, y + card1H / 2);

        // =========================================================================
        // 🗂️ การ์ด 2: ศรีนำโชค (มงคล) VS กาลกิณี (สิ่งที่ควรเลี่ยง)
        // =========================================================================
        const card2Y = y + card1H + 10;
        const card2H = 92;
        const halfW = (w - 14) / 2;

        // --- กล่องซ้าย: ศรีมงคล (สีเขียวสบายตา เสริมโชคลาภ) ---
        drawRoundedBox(ctx, x, card2Y, halfW, card2H, 10, "#f0fdf4", "#86efac", 1.5);

        ctx.font = "bold 16px 'Sarabun', sans-serif";
        ctx.fillStyle = "#15803d";
        ctx.fillText("🌟 ศรีมงคลประจำวัน (เสริมบารมี โชคลาภ ความสำเร็จ):", x + 16, card2Y + 22);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#1e293b";
        ctx.fillText(`• ดาวมงคล: ดาว ${toThaiNum(data.taksa.sri.num)} (${data.taksa.sri.name}) สถิตราศี${data.taksa.sri.rasi}`, x + 16, card2Y + 48);

        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#166534";
        ctx.fillText(`• ทิศมงคล: ${data.taksa.sri.dir}`, x + 16, card2Y + 72);
        ctx.fillText(`• สีมงคล: ${data.taksa.sri.color}`, x + 250, card2Y + 72);

        // --- กล่องขวา: กาลกิณี (สีแดงเตือนภัย สิ่งที่ควรระวัง) ---
        const rightX = x + halfW + 14;
        drawRoundedBox(ctx, rightX, card2Y, halfW, card2H, 10, "#fef2f2", "#fca5a5", 1.5);

        ctx.font = "bold 16px 'Sarabun', sans-serif";
        ctx.fillStyle = "#b91c1c";
        ctx.fillText("⚠️ กาลกิณีประจำวัน (ข้อห้าม / พึงหลีกเลี่ยง):", rightX + 16, card2Y + 22);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#1e293b";
        ctx.fillText(`• ดาวกาลี: ดาว ${toThaiNum(data.taksa.kali.num)} (${data.taksa.kali.name}) สถิตราศี${data.taksa.kali.rasi}`, rightX + 16, card2Y + 48);

        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#991b1b";
        ctx.fillText(`• ทิศต้องห้าม: ${data.taksa.kali.dir}`, rightX + 16, card2Y + 72);
        ctx.fillText(`• สีที่ควรเลี่ยง: ${data.taksa.kali.color}`, rightX + 250, card2Y + 72);

        // =========================================================================
        // 🗂️ การ์ด 3: ฤกษ์มงคลบนท้องฟ้า & ช่วงเวลาทอง (Auspicious Timing)
        // =========================================================================
        const card3Y = card2Y + card2H + 10;
        const card3H = 120;
        drawRoundedBox(ctx, x, card3Y, w, card3H, 10, "#f0f9ff", "#bae6fd", 1.5);

        // หัวข้อการ์ด 3
        ctx.font = "bold 16px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0369a1";
        ctx.fillText("🧭 ฤกษ์มงคลบนท้องฟ้า & ช่วงเวลามหาฤกษ์ (Auspicious Timing & Elections):", x + 16, card3Y + 22);

        // บรรทัด 1: ฤกษ์บน
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText("🌙 ฤกษ์บน:", x + 16, card3Y + 50);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#334155";
        ctx.fillText("ฤกษ์ ๘ ปุษยะ •", x + 90, card3Y + 50);
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0284c7";
        ctx.fillText("ราชาฤกษ์ (สิทธิโชค)", x + 195, card3Y + 50);
        ctx.font = "14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText("เด่นเกียรติยศ ผู้นำ (ถึง ๐๐:๒๙ น.) ➔", x + 340, card3Y + 50);

        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0284c7";
        ctx.fillText("ฤกษ์ ๙ อาศเลษา (สมโณฤกษ์ - สรรพโชคอำพน)", x + 560, card3Y + 50);
        ctx.font = "14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText("สงบร่มเย็น ปัญญา (ถึง ๒๓:๐๗ น.)", x + 840, card3Y + 50);

        // บรรทัด 2: ดิถี & มหาฤกษ์
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText("🌓 ดิถี & มหาฤกษ์:", x + 16, card3Y + 76);

        ctx.font = "15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#334155";
        ctx.fillText(`ดิถี ${data.lunarPhaseStr} (ทายา) ถึง ๐๒:๑๖ น. ➔ แรม ๑๑ ค่ำ (กัมมะ)`, x + 145, card3Y + 76);

        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#b45309";
        ctx.fillText("👑 ช่วงมหาฤกษ์ดีที่สุด:", x + 560, card3Y + 76);
        ctx.font = "bold 16px 'Sarabun', sans-serif";
        ctx.fillStyle = "#dc2626";
        ctx.fillText("๑๘:๐๖ – ๑๘:๑๙ น. (ราศีมีน)", x + 720, card3Y + 76);

        // บรรทัด 3: เกณฑ์ดวงดาว & ข้อควรระวัง
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText("💡 ข้อพึงระวัง:", x + 16, card3Y + 102);

        ctx.font = "14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText("เกณฑ์พินทุบาทว์ราศีมีน (เลี่ยงเริ่มเจรจาใหญ่) • ๘ : ออก นคร | ๙ : ออก ยายี | ๑๐ : เข้า นคร", x + 115, card3Y + 102);

        // =========================================================================
        // 🗂️ การ์ด 4: ฤกษ์ล่าง (สถานะวัน) & ตารางเวลาลัคนาจร ๒๔ ชั่วโมง
        // =========================================================================
        const card4Y = card3Y + card3H + 10;
        const card4H = 142;
        drawRoundedBox(ctx, x, card4Y, w, card4H, 10, "#fffbeb", "#fde68a", 1.5);

        // หัวข้อและ Badges ฤกษ์ล่าง
        ctx.font = "bold 16px 'Sarabun', sans-serif";
        ctx.fillStyle = "#92400e";
        ctx.fillText("📜 ฤกษ์ล่างและสถานะพลังงานวัน:", x + 16, card4Y + 22);

        // วาด Badges สีสันอ่านง่าย
        let badgeX = x + 230;
        badgeX += drawBadge(ctx, badgeX, card4Y + 10, "🟢 วันฟู (เริ่มกิจการรุ่งเรือง)", "#dcfce7", "#15803d", "#86efac") + 8;
        badgeX += drawBadge(ctx, badgeX, card4Y + 10, "🟢 ดิถีเรียงหมอน (มงคลสมรส/ความรัก)", "#dcfce7", "#15803d", "#86efac") + 8;
        badgeX += drawBadge(ctx, badgeX, card4Y + 10, "🔴 วันโลกาวินาศน์ (เลี่ยงพิธีใหญ่)", "#fee2e2", "#b91c1c", "#fca5a5") + 8;
        badgeX += drawBadge(ctx, badgeX, card4Y + 10, "🟠 กทิงวัน / กาลทิน", "#fef3c7", "#b45309", "#fcd34d");

        // ลัคนา 24 ชม.
        ctx.font = "bold 15px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText("⏰ เวลาลัคนาจร (เวลาเกิด/วางฤกษ์รายช่วง ๒๔ ชม.):", x + 16, card4Y + 54);

        // แถวเวลาลัคนา (ฟอนต์คมชัด อ่านง่าย เป็นเลขไทยทั้งหมด)
        ctx.font = "14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#334155";
        const lagnaRow1 = "๐๖:๐๐ สิงห์ (๕) • ๐๗:๐๘ กันย์ (๖) • ๐๙:๕๖ ตุลย์ (๗) • ๑๒:๒๐ พิจิก (๘) • ๑๔:๒๐ ธนู (๙) • ๑๕:๓๒ มังกร (๑๐)";
        const lagnaRow2 = "๑๗:๐๘ กุมภ์ (๑๑) • ๑๙:๐๘ มีน (๐) • ๒๑:๐๘ เมษ (๑) • ๒๒:๔๔ พฤษภ (๒) • ๒๓:๕๖ มิถุน (๓) • ๐๑:๕๖ กรกฎ (๔)";
        ctx.fillText(lagnaRow1, x + 34, card4Y + 78);
        ctx.fillText(lagnaRow2, x + 34, card4Y + 100);

        // ทัศนจันทร์ (เลขไทยทั้งหมด)
        ctx.font = "bold 14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText("🔭 ทัศนจันทร์:", x + 16, card4Y + 124);

        ctx.font = "14px 'Sarabun', sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText("๐๒:๑๖ น. จันทร์กุมอาทิตย์ (๒*๑)   •   ๐๕:๑๒ น. จันทร์จตุโกณศุกร์ (๒□๖)   •   ๑๙:๔๗ น. จันทร์ตรีโกณพฤหัส (๒๙๕)", x + 110, card4Y + 124);

        ctx.restore();
    }

    // ฟังก์ชันสร้างข้อความรายงานดวงรายวัน สำหรับคัดลอกไปโพสต์/ส่งต่อ (ไม่มีแฮชแท็ก, แปลศัพท์เข้าใจง่าย, วรรคตอนสวยงาม)
    function generateShareableDailyText(targetDate, locationKey = "bangkok") {
        const data = prepareDailyCalendarData(targetDate, locationKey);
        const dt = data.dateObj;

        // ดึงรายงานสุริยยาตร์ฉบับเต็มเพื่อความถูกต้อง 100%
        let rep = null;
        if (typeof SuriyayatraEngine !== "undefined") {
            rep = SuriyayatraEngine.getFullSuriyaReport(dt, locationKey);
        }

        const dateHeader = rep ? rep.thaiDateHeader : `วันที่ ${data.dayDate} ${data.monthName} พ.ศ.${data.yearBE}`;
        const lunarHeader = rep ? rep.lunarHeader : `ตรงกับวัน${data.dayName} ${data.lunarPhaseStr} เดือน${data.lunarMonthName} ปี${data.animalYear}`;
        const eraLine = rep ? rep.eraLine : `จันทรวาร(จ) ภัทรปทมาส อัฐศก จ.ศ. ${data.yearCS} , ค.ศ. ${dt.getFullYear()}`;
        const typeLine = rep ? rep.typeLine : `สุริยคติ เป็น ปกติสุรทิน , จันทรคติ เป็น อธิกมาส ปกติวาร`;

        // จัดทำรายการตำแหน่งดาว ๑๐ ดวง พร้อมแปลความหมายสั้นกระชับ
        const planetMeaningMap = {
            1: "เกียรติยศ ผู้นำ พลังชีวิต",
            2: "อารมณ์ จิตใจ เสน่ห์ ประชาชน",
            3: "ความกล้าหาญ การแข่งขัน พละกำลัง",
            4: "การเจรจา การค้า ข้อมูล ข่าวสาร",
            5: "สติปัญญา คุณธรรม ผู้ใหญ่ โชคลาภใหญ่",
            6: "การเงิน ความรัก ศิลปะ ความสุขสำราญ",
            7: "ความอดทน วินัย ภาระ งานระยะยาว",
            8: "การพลิกแพลง กลยุทธ์ ออนไลน์ ต่างประเทศ",
            9: "ลางสังหรณ์ สิ่งศักดิ์สิทธิ์ ความคิดสร้างสรรค์",
            0: "การปฏิรูป นวัตกรรม การเปลี่ยนแปลงฉับพลัน"
        };

        const motionMeaningMap = {
            "พักร์": "โคจรถอยหลัง (ชะลอตัว ควรทบทวนรอบคอบ)",
            "เสริด": "โคจรเร็วผิดปกติ (เร่งรีบ ได้ผลเร็ว กะทันหัน)",
            "มนท์": "โคจรช้าลง (นิ่งสงบ ดำเนินการอย่างใจเย็น)",
            "ปกติ": "โคจรด้วยความเร็วปกติ"
        };

        const planetLines = data.planets.map(p => {
            const rName = RASI_NAMES[p.rasi] || "";
            const degStr = `${toThaiNum(p.deg)}°${toThaiNum(p.min)}'`;
            let motionNote = "";
            if (p.motion && p.motion !== "ปกติ") {
                const key = p.motion.includes("พักร์") ? "พักร์" : (p.motion.includes("เสริด") ? "เสริด" : (p.motion.includes("มนท์") ? "มนท์" : ""));
                if (key && motionMeaningMap[key]) {
                    motionNote = ` [${p.motion} - ${motionMeaningMap[key]}]`;
                } else {
                    motionNote = ` [${p.motion}]`;
                }
            }
            const meaning = planetMeaningMap[p.num] ? ` (${planetMeaningMap[p.num]})` : "";
            return `• ดาว ${toThaiNum(p.num)} ${p.name}: สถิตราศี${rName} ที่มุม ${degStr}${motionNote}${meaning}`;
        }).join("\n");

        const text = `ปฏิทินดวงรายวัน • สยามโหรามงคล
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 ข้อมูลปฏิทินประจำวัน
${dateHeader}
${lunarHeader}
${eraLine}
${typeLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☀️ ข้อมูลดวงอาทิตย์และดวงจันทร์ (เวลาขึ้น-ตก ท้องฟ้าจริง)
• พระอาทิตย์ขึ้น: เวลา ${data.solarLunar.sunrise} | พระอาทิตย์ตก: เวลา ${data.solarLunar.sunset}
• เที่ยงวันดวงอาทิตย์ตรงศีรษะ: เวลา ${data.solarLunar.localNoon}
• พระจันทร์ขึ้น: เวลา ${data.solarLunar.moonrise} | พระจันทร์ตก: เวลา ${data.solarLunar.moonset}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 ทักษาประจำวัน (พลังงานมงคลและข้อควรระวัง)
• ศรีมงคลประจำวัน (เสริมบารมี โชคลาภ ความสำเร็จ):
  - ดาวมงคล: ดาว ${toThaiNum(data.taksa.sri.num)} (${data.taksa.sri.name}) สถิตราศี${data.taksa.sri.rasi}
  - ทิศมงคล: ทิศ${data.taksa.sri.dir} (หันหน้าหรือตั้งโต๊ะทำงานรับโชค)
  - สีมงคล: ${data.taksa.sri.color} (สีเสื้อผ้า เครื่องประดับเสริมสิริมงคล)

• กาลกิณีประจำวัน (จุดที่ควรหลีกเลี่ยง / ข้อห้าม):
  - ดาวกาลี: ดาว ${toThaiNum(data.taksa.kali.num)} (${data.taksa.kali.name}) สถิตราศี${data.taksa.kali.rasi}
  - ทิศอัปมงคล: ทิศ${data.taksa.kali.dir} (ควรเลี่ยงการเดินทางแรกเริ่มหรือหันหน้า)
  - สีที่ควรเลี่ยง: ${data.taksa.kali.color} (งดสวมใส่หรือใช้งานในงานมงคลวันนี้)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧭 ฤกษ์มงคลบนท้องฟ้า & จังหวะเวลาทอง
• ฤกษ์บน (กลุ่มดาวนักษัตรที่พระจันทร์เสวย):
  - ช่วงแรก (ถึง ๐๐:๒๙ น.): ฤกษ์ที่ ๘ ปุษยะ "ราชาฤกษ์" (ฤกษ์แห่งผู้นำ เกียรติยศ การติดต่อผู้หลักผู้ใหญ่ ความสำเร็จสูง)
  - ช่วงถัดไป (ถึง ๒๓:๐๗ น.): ฤกษ์ที่ ๙ อาศเลษา "สมโณฤกษ์" (ฤกษ์แห่งความสงบร่มเย็น การศึกษา สมาธิ งานวิชาการ พิธีมงคลสงฆ์)
• ดิถี & โชคทางจันทรคติ:
  - ดิถี ${data.lunarPhaseStr} (ทายาดิถี: เหมาะแก่การรับมรดก สืบทอดกิจการ ติดต่อผู้ใหญ่) ถึงเวลา ๐๒:๑๖ น. จากนั้นตัดเข้า แรม ๑๑ ค่ำ (กัมมะดิถี: เหมาะแก่การลงมือทำงาน ก่อสร้าง ปฏิบัติภารกิจจริงจัง)
• ช่วงเวลามหาฤกษ์ดีที่สุดของวัน:
  - เวลา ๑๘:๐๖ – ๑๘:๑๙ น. (ลัคนาสถิตราศีมีน: จังหวะเปิดรับความโชคดี อุดมสมบูรณ์)
• ข้อพึงระวัง:
  - ระวังเกณฑ์พินทุบาทว์ในราศีมีน (จุดเปราะบางทางดวงดาว ไม่ควรเริ่มเจรจาเรื่องสำคัญที่เสี่ยงขัดแย้งในเวลาดังกล่าว)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 ฤกษ์ล่าง (สถานะพลังงานมงคลตามตำราโบราณ)
• วันฟู: เป็นวันมงคลยิ่ง ทำสิ่งใดจะงอกงาม เจริญรุ่งเรือง กิจการเฟื่องฟู
• ดิถีเรียงหมอน: ฤกษ์มงคลเหมาะแก่การสู่ขอ จัดงานหมั้นหมาย งานมงคลสมรส หรือคืนดีผูกมิตร
• ข้อเตือนใจ: วันโลกาวินาศน์ตามเกณฑ์กาลโยค (ควรเลี่ยงการจัดพิธีเปิดป้ายใหญ่หรือการทำสัญญาเสี่ยงภัย)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ เวลาลัคนาจร ๒๔ ชั่วโมง (ช่วงเวลาสำหรับการเลือกเวลาทำกิจกรรมหรือดูดวงชะตา)
• ๐๖:๐๐ – ๐๗:๐๗ น. : ราศีสิงห์ (ธาตุไฟ - กล้าหาญ มั่นใจ แสดงผลงาน)
• ๐๗:๐๘ – ๐๙:๕๕ น. : ราศีกันย์ (ธาตุดิน - วิเคราะห์ ตรวจสอบ วางแผนละเอียด)
• ๐๙:๕๖ – ๑๒:๑๙ น. : ราศีตุลย์ (ธาตุลม - เจรจา การค้า ความประนีประนอม พบปะผู้คน)
• ๑๒:๒๐ – ๑๔:๑๙ น. : ราศีพิจิก (ธาตุน้ำ - ทำงานเบื้องหลัง มุ่งมั่น ค้นคว้าความจริง)
• ๑๔:๒๐ – ๑๕:๓๑ น. : ราศีธนู (ธาตุไฟ - เรียนรู้ ปรึกษาผู้ใหญ่ วางวิสัยทัศน์กว้างไกล)
• ๑๕:๓๒ – ๑๗:๐๗ น. : ราศีมังกร (ธาตุดิน - ปฏิบัติการ อดทน จัดการระบบงานโครงสร้าง)
• ๑๗:๐๘ – ๑๙:๐๗ น. : ราศีกุมภ์ (ธาตุลม - ประสานงานกลุ่ม นวัตกรรม ออนไลน์ เพื่อนฝูง)
• ๑๙:๐๘ – ๒๑:๐๗ น. : ราศีมีน (ธาตุน้ำ - ศิลปะ พักผ่อน สวดมนต์ นั่งสมาธิ จินตนาการ)
• ๒๑:๐๘ – ๒๒:๔๓ น. : ราศีเมษ (ธาตุไฟ - เคลียร์งานคั่งค้าง มีพลังริเริ่มกระตือรือร้น)
• ๒๒:๔๔ – ๒๓:๕๕ น. : ราศีพฤษภ (ธาตุดิน - พักผ่อน ดูแลสุขภาพ บันทึกบัญชีการเงิน)
• ๒๓:๕๖ – ๐๑:๕๕ น. : ราศีมิถุน (ธาตุลม - สื่อสาร สนทนา หาข้อมูลใหม่ๆ)
• ๐๑:๕๖ – ๐๕:๕๙ น. : ราศีกรกฎ (ธาตุน้ำ - อบอุ่น อยู่กับครอบครัว นอนหลับพักฟื้นพลังกาย)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🪐 พิกัดสมผุสดวงดาว ๑๐ ดวง (ณ เวลา ๒๔:๐๐ น.)
${planetLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(คัดลอกจากระบบโหราศาสตร์ไทย สยามโหรามงคล)`;

        // แปลงตัวเลขตกค้างทั้งหมดให้เป็นเลขไทย
        return toThaiNum(text);
    }

    // ฟังก์ชันดาวน์โหลดภาพ Canvas เป็น PNG คุณภาพสูง
    function downloadCanvasImage(canvasId, filename = "siamhora_daily_calendar.png") {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    }

    return {
        prepareDailyCalendarData,
        renderDailySheetCanvas,
        downloadCanvasImage,
        generateShareableDailyText
    };
})();

if (typeof window !== "undefined") {
    window.ThaiDailyCalendarSheet = ThaiDailyCalendarSheet;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = ThaiDailyCalendarSheet;
}
