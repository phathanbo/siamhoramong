/**
 * ⚙️ เอนจินคำนวณคัมภีร์วิธีดูหมอเลข ๗ ตัว ภาคพิสดาร
 * Seven Digits Pisadan Engine
 * รองรับทั้ง Node.js และ Browser
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./seven-digits-pisadan-data.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../data/seven-digits-pisadan-data.js'));
    } else {
        root.SevenDigitsPisadanEngine = factory(root.SevenDigitsPisadanData);
    }
}(typeof self !== 'undefined' ? self : this, function(PisadanData) {
    "use strict";

    if (!PisadanData && typeof window !== 'undefined' && window.SevenDigitsPisadanData) {
        PisadanData = window.SevenDigitsPisadanData;
    }

    /**
     * แปลงวันในสัปดาห์ (0 = อาทิตย์ ถึง 6 = เสาร์) ให้เป็นเลขดาว 1 - 7
     */
    function dayOfWeekToStar(dayOfWeek) {
        return dayOfWeek === 0 ? 1 : dayOfWeek + 1; // 0=อาทิตย์->1, 1=จันทร์->2, ..., 6=เสาร์->7
    }

    /**
     * คำนวณเลขตั้งต้นฐานที่ ๒ จากเดือนไทย (จันทรคติ 1 - 12)
     * กฎ: เกิดเดือน 8 ให้เอา 7 ลบออกก่อน ผลลัพธ์ตั้งเป็นตัวแรก
     * เดือน 1 หรือ 8 -> 1
     * เดือน 2 หรือ 9 -> 2
     * เดือน 3 หรือ 10 -> 3
     * เดือน 4 หรือ 11 -> 4
     * เดือน 5 หรือ 12 -> 5
     * เดือน 6 -> 6
     * เดือน 7 -> 7
     */
    function getMonthStartNumber(lunarMonth) {
        let m = parseInt(lunarMonth, 10);
        if (isNaN(m) || m < 1) m = 1;
        if (m > 12) m = ((m - 1) % 12) + 1;

        if (m === 8) return 1; // 8 - 7 = 1
        if (m === 9) return 2; // 9 - 7 = 2
        if (m === 10) return 3; // 10 - 7 = 3
        if (m === 11) return 4; // 11 - 7 = 4
        if (m === 12) return 5; // 12 - 7 = 5
        return m; // 1-7
    }

    /**
     * คำนวณเลขตั้งต้นฐานที่ ๓ จากปีนักษัตร (1 = ชวด ถึง 12 = กุน)
     * กฎ: ชวด/มะแม=1, ฉลู/วอก=2, ขาล/ระกา=3, เถาะ/จอ=4, มะโรง/กุน=5, มะเส็ง=6, มะเมีย=7
     */
    function getYearStartNumber(zodiacIndex) {
        let z = parseInt(zodiacIndex, 10);
        if (isNaN(z) || z < 1) z = 1;
        if (z > 12) z = ((z - 1) % 12) + 1;

        const map = {
            1: 1,  // ชวด
            2: 2,  // ฉลู
            3: 3,  // ขาล
            4: 4,  // เถาะ
            5: 5,  // มะโรง
            6: 6,  // มะเส็ง
            7: 7,  // มะเมีย
            8: 1,  // มะแม (8 - 7 = 1)
            9: 2,  // วอก (9 - 7 = 2)
            10: 3, // ระกา (10 - 7 = 3)
            11: 4, // จอ (11 - 7 = 4)
            12: 5  // กุน (12 - 7 = 5)
        };
        return map[z] || 1;
    }

    /**
     * สร้างแถว ๗ ตัว เรียงวน 1 - 7
     */
    function generateRow(startNum) {
        const row = [];
        let curr = startNum;
        for (let i = 0; i < 7; i++) {
            row.push(curr);
            curr++;
            if (curr > 7) curr = 1;
        }
        return row;
    }

    /**
     * คำนวณแผงดวงเลข ๗ ตัว ๔ ฐานแบบเต็มรูป
     */
    function calculateChart(params) {
        const {
            dayOfWeek,       // 0=อาทิตย์ ถึง 6=เสาร์ หรือ 1-7
            lunarMonth,      // 1-12
            zodiacIndex,     // 1=ชวด ถึง 12=กุน
            birthDayDate,    // 1-31 (วันเกิดทางสุริยคติ)
            birthHour = 12,  // ชั่วโมงเกิด
            birthMinute = 0, // นาทีเกิด
            ageYears = 0,    // อายุเต็ม
            ageMonths = 0,   // เศษเดือน
            targetYearZodiac = null, // ปีจร (1-12)
            targetMonth = null,      // เดือนจร (1-12)
            targetDayOfWeek = null,  // วันจร (0-6 หรือ 1-7)
            kaliyokePositions = null // { thongchai: starNum, athipati: starNum, ubabat: starNum, lokawinas: starNum }
        } = params;

        const starDay = dayOfWeek === 0 ? 1 : (dayOfWeek <= 7 ? dayOfWeek : 1);
        const starMonth = getMonthStartNumber(lunarMonth);
        const starYear = getYearStartNumber(zodiacIndex);

        const row1 = generateRow(starDay);
        const row2 = generateRow(starMonth);
        const row3 = generateRow(starYear);
        const row4 = [];

        for (let i = 0; i < 7; i++) {
            row4.push(row1[i] + row2[i] + row3[i]);
        }

        // วิเคราะห์อายุย่างจร (บทที่ 13, 16)
        let actualAge = ageYears + (ageMonths > 0 ? 1 : 0);
        if (actualAge <= 0) actualAge = 1; // เริ่มแรกเกิดนับอายุย่าง ๑ ปี

        // นับวนรอบ 21 ปี (ฐานละ 7 ช่อง)
        const remainder = ((actualAge - 1) % 21) + 1; // 1 - 21
        let ageBase = 1;
        let ageColIndex = 0; // 0-6

        if (remainder <= 7) {
            ageBase = 1;
            ageColIndex = remainder - 1;
        } else if (remainder <= 14) {
            ageBase = 2;
            ageColIndex = remainder - 8;
        } else {
            ageBase = 3;
            ageColIndex = remainder - 15;
        }

        const ageStar = (ageBase === 1) ? row1[ageColIndex] : ((ageBase === 2) ? row2[ageColIndex] : row3[ageColIndex]);
        const ageHouseObj = (ageBase === 1) ? PisadanData.positions.base1[ageColIndex] :
                           ((ageBase === 2) ? PisadanData.positions.base2[ageColIndex] : PisadanData.positions.base3[ageColIndex]);

        // คำนวณยามอัฏฐกาล (บทที่ 12)
        const totalMinutes = (birthHour * 60) + birthMinute;
        const isDayTime = (totalMinutes >= 360 && totalMinutes < 1080); // 06:00 - 18:00

        let yarmIndex = 1; // 1-16
        if (isDayTime) {
            const minsFrom6 = totalMinutes - 360;
            yarmIndex = Math.min(8, Math.floor(minsFrom6 / 90) + 1);
        } else {
            let minsFrom18 = totalMinutes >= 1080 ? totalMinutes - 1080 : totalMinutes + 360;
            yarmIndex = Math.min(8, Math.floor(minsFrom18 / 90) + 1) + 8;
        }

        const yarmInfo = PisadanData.atthakalaHours[yarmIndex - 1];
        const dayYarmPredictions = PisadanData.atthakalaPredictions[starDay] || {};
        const yarmPrediction = dayYarmPredictions[yarmIndex] || "ยามดีมีมงคลในการดำเนินชีวิต";

        // ลัคนาตามยามอัฏฐกาล (บทที่ 15)
        // ดาวประจำยามอัฏฐกาลตามหลักโหร: ยาม 1=ดาวประจำวัน, ยาม 2=+1 ...
        const lagnaStar = ((starDay - 1 + (yarmIndex <= 8 ? yarmIndex - 1 : yarmIndex - 9)) % 7) + 1;
        
        // หาตำแหน่งที่ลัคนาเกาะกุมในฐาน 1, 2, 3
        const lagnaInBase1Idx = row1.indexOf(lagnaStar);
        const lagnaInBase2Idx = row2.indexOf(lagnaStar);
        const lagnaInBase3Idx = row3.indexOf(lagnaStar);

        const lagnaPredictions = [];
        if (lagnaInBase1Idx !== -1) {
            const hId = PisadanData.positions.base1[lagnaInBase1Idx].id;
            const pred = PisadanData.lagnaPredictions.base1[hId];
            if (pred) lagnaPredictions.push({ base: 1, house: PisadanData.positions.base1[lagnaInBase1Idx].name, text: pred });
        }
        if (lagnaInBase2Idx !== -1) {
            const hId = PisadanData.positions.base2[lagnaInBase2Idx].id;
            const pred = PisadanData.lagnaPredictions.base2[hId];
            if (pred) lagnaPredictions.push({ base: 2, house: PisadanData.positions.base2[lagnaInBase2Idx].name, text: pred });
        }
        if (lagnaInBase3Idx !== -1) {
            const hId = PisadanData.positions.base3[lagnaInBase3Idx].id;
            const pred = PisadanData.lagnaPredictions.base3[hId];
            if (pred) lagnaPredictions.push({ base: 3, house: PisadanData.positions.base3[lagnaInBase3Idx].name, text: pred });
        }

        // บทที่ 4 & 5: วิเคราะห์ฐานบวกที่ ๔
        const base4Evaluations = row4.map((sumVal, colIdx) => {
            let level = "low";
            let levelName = PisadanData.base4Analysis.low.levelName;
            let info = PisadanData.base4Analysis.low.numbers[sumVal];

            if (PisadanData.base4Analysis.high.numbers[sumVal]) {
                level = "high";
                levelName = PisadanData.base4Analysis.high.levelName;
                info = PisadanData.base4Analysis.high.numbers[sumVal];
            } else if (PisadanData.base4Analysis.medium.numbers[sumVal]) {
                level = "medium";
                levelName = PisadanData.base4Analysis.medium.levelName;
                info = PisadanData.base4Analysis.medium.numbers[sumVal];
            }

            // ตรวจสอบความสัมพันธ์คู่ดาวบนฐานบวก (ฐาน 3 กับ ฐาน 4)
            const b3Star = row3[colIdx];
            const interactions = [];

            // คู่มิตร
            PisadanData.base4Interactions.friendly.pairs.forEach(p => {
                if (p.base3 === b3Star && p.base4 === sumVal) {
                    interactions.push({ type: "friendly", name: "คู่มิตร", label: p.label, meaning: PisadanData.base4Interactions.friendly.meaning });
                }
            });

            // คู่ศัตรู
            PisadanData.base4Interactions.enemy.pairs.forEach(p => {
                if (p.base3 === b3Star && p.base4.includes(sumVal)) {
                    interactions.push({ type: "enemy", name: "คู่ศัตรู", label: p.label, meaning: PisadanData.base4Interactions.enemy.meaning });
                }
            });

            // คู่ธาตุ
            PisadanData.base4Interactions.element.pairs.forEach(p => {
                if (p.base3 === b3Star && p.base4.includes(sumVal)) {
                    interactions.push({ type: "element", name: "คู่ธาตุ", label: p.label, meaning: PisadanData.base4Interactions.element.meaning });
                }
            });

            // คู่สมพล
            PisadanData.base4Interactions.somphon.pairs.forEach(p => {
                if (p.base3 === b3Star && p.base4.includes(sumVal)) {
                    interactions.push({ type: "somphon", name: "คู่สมพล", label: p.label, meaning: PisadanData.base4Interactions.somphon.meaning });
                }
            });

            // กำลังตนเอง
            PisadanData.base4Interactions.ownPower.pairs.forEach(p => {
                if (p.base3 === b3Star && p.base4 === sumVal) {
                    interactions.push({ type: "ownPower", name: "กำลังของตนเอง", label: p.label, meaning: PisadanData.base4Interactions.ownPower.meaning });
                }
            });

            return {
                colIndex: colIdx,
                sum: sumVal,
                level,
                levelName,
                starBase3: b3Star,
                info: info || { name: `ผลบวก ${sumVal}`, text: "กำลังส่งผลตามธรรมชาติแห่งดาว" },
                interactions
            };
        });

        // บทที่ 11: คำพูด อุปนิสัย ความเป็นอยู่ (หลักที่ 4)
        const p4Speech = PisadanData.pillar4Specifics.speech[row1[3]];
        const p4Habit = PisadanData.pillar4Specifics.habit[row2[3]];
        const p4Living = PisadanData.pillar4Specifics.living[row3[3]];

        // บทที่ 15: สูตรเคล็ดคำนวณ นิสัย และ คำพูด
        // นิสัย: (เลขอัตตะ + เลขพันธุ) % 7
        const habitRemainder = (row1[0] + row2[3]) % 7;
        const habitSecret = PisadanData.secrets.habitFormula.remainders[habitRemainder];

        // คำพูด: (เลขตนุ + เลขปิตา) % 7
        const speechRemainder = (row2[0] + row1[3]) % 7;
        const speechSecret = PisadanData.secrets.speechFormula.remainders[speechRemainder];

        // บทที่ 8: คู่ครอง (ดูจากเลขปัตนิ ฐานที่ 2)
        const patniStar = row2[6];
        const soulmateProfile = PisadanData.relationshipLore.patniPlanets[patniStar];

        // บทที่ 9: ดิถีกำเนิดตรวจสอบ
        const tithiAnalysis = [];
        const tithiNum = params.lunarTithi || 1; // 1-15
        const isWaxing = params.isWaxing !== false;

        // ดิถีมหาสูญ
        const mahasoonDays = PisadanData.birthTithiRules.mahasoon.table[lunarMonth] || [];
        if (mahasoonDays.includes(tithiNum)) {
            tithiAnalysis.push({
                type: "danger",
                name: "ดิถีมหาสูญ",
                desc: "ตกเกณฑ์ดิถีมหาสูญ วิถีชีวิตมักไม่ค่อยราบรื่น ต้องเผชิญความขลุกขลักในการดำเนินชีวิตบ่อยครั้ง"
            });
        }

        // ดิถีพิฆาต
        const phikhatDays = PisadanData.birthTithiRules.phikhat.table[starDay] || [];
        if (phikhatDays.includes(tithiNum)) {
            tithiAnalysis.push({
                type: "danger",
                name: "ดิถีพิฆาต",
                desc: "ตกเกณฑ์ดิถีพิฆาต วิถีชะตามักมีเภทภัยหรืออุบัติเหตุเข้ามากระทบการดำเนินชีวิต"
            });
        }

        // ดิถีกระทิงวัน (ขึ้นค่ำตรงกับเลขเดือน)
        if (isWaxing && tithiNum === lunarMonth) {
            tithiAnalysis.push({
                type: "warning",
                name: "ดิถีกระทิงวัน",
                desc: "ขึ้นค่ำตรงกับเลขเดือน เกิดความวุ่นวายสับสน ไม่สงบสุข ชีวิตมีความผันผวนขึ้นๆ ลงๆ"
            });
        }

        // วันผีโขมด (แรมค่ำตรงกับเลขเดือน)
        if (!isWaxing && tithiNum === lunarMonth) {
            tithiAnalysis.push({
                type: "warning",
                name: "วันผีโขมด",
                desc: "แรมค่ำตรงกับเลขเดือน ชะตามักมีความโศกเศร้า ทุกข์ใจ เสียใจ และชีวิตมักอับเฉา"
            });
        }

        // บทที่ 14: อิทธิพลของตัวเลขวันเกิด (วันที่ 1 - 31)
        const dayDateInfluence = PisadanData.birthDayDates[birthDayDate] || null;

        // บทที่ 16: การทายจร 4 จุด (อายุจร, ปีจร, เดือนจร, วันจร)
        let transitSummary = null;
        if (targetYearZodiac || targetMonth || targetDayOfWeek !== null) {
            const zYear = targetYearZodiac ? getYearStartNumber(targetYearZodiac) : starYear;
            const zMonth = targetMonth ? getMonthStartNumber(targetMonth) : starMonth;
            let zDay = starDay;
            if (targetDayOfWeek !== null && targetDayOfWeek !== undefined) {
                if (targetDayOfWeek === 0) zDay = 1;
                else if (targetDayOfWeek >= 1 && targetDayOfWeek <= 7) zDay = targetDayOfWeek;
                else zDay = ((targetDayOfWeek - 1) % 7) + 1;
            }

            // ตรวจว่าดาวจรไปตกที่นิมิตใดในดวงเดิม
            const yearTransitHouses = [];
            const monthTransitHouses = [];
            const dayTransitHouses = [];

            [row1, row2, row3].forEach((r, bIdx) => {
                const posArr = (bIdx === 0) ? PisadanData.positions.base1 : ((bIdx === 1) ? PisadanData.positions.base2 : PisadanData.positions.base3);
                r.forEach((num, colIdx) => {
                    if (num === zYear) yearTransitHouses.push({ base: bIdx + 1, name: posArr[colIdx].name, col: colIdx });
                    if (num === zMonth) monthTransitHouses.push({ base: bIdx + 1, name: posArr[colIdx].name, col: colIdx });
                    if (num === zDay) dayTransitHouses.push({ base: bIdx + 1, name: posArr[colIdx].name, col: colIdx });
                });
            });

            transitSummary = {
                year: { star: zYear, houses: yearTransitHouses },
                month: { star: zMonth, houses: monthTransitHouses },
                day: { star: zDay, houses: dayTransitHouses }
            };
        }

        // บุคลิกบุคคลจากเลขอัตตะ และ ตนุ (บทที่ 6)
        const attaProfile = PisadanData.personProfiles[row1[0]];
        const tanuProfile = PisadanData.personProfiles[row2[0]];

        return {
            matrix: {
                row1,
                row2,
                row3,
                row4
            },
            inputParams: params,
            actualAge,
            ageTransit: {
                age: actualAge,
                base: ageBase,
                colIndex: ageColIndex,
                star: ageStar,
                house: ageHouseObj
            },
            yarm: {
                index: yarmIndex,
                info: yarmInfo,
                prediction: yarmPrediction,
                lagnaStar
            },
            lagna: {
                star: lagnaStar,
                predictions: lagnaPredictions
            },
            base4: base4Evaluations,
            pillar4: {
                speech: { star: row1[3], text: p4Speech },
                habit: { star: row2[3], text: p4Habit },
                living: { star: row3[3], text: p4Living }
            },
            secrets: {
                habit: { remainder: habitRemainder, text: habitSecret },
                speech: { remainder: speechRemainder, text: speechSecret }
            },
            soulmate: {
                star: patniStar,
                profile: soulmateProfile
            },
            profiles: {
                atta: attaProfile,
                tanu: tanuProfile
            },
            tithiAnalysis,
            dayDateInfluence,
            transitSummary
        };
    }

    return {
        calculateChart,
        dayOfWeekToStar,
        getMonthStartNumber,
        getYearStartNumber,
        generateRow
    };
}));
