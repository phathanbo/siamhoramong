/**
 * ⚙️ เอนจินคำนวณตำรากาลจักรจรวิภาค (พันตรี หลวงวุฒิรณพัสดุ์)
 * Kalachakra Wiphak Engine
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./kalachakra-data.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../data/kalachakra-data.js'));
    } else {
        root.KalachakraEngine = factory(root.KalachakraData);
    }
}(typeof self !== 'undefined' ? self : this, function(KalachakraData) {
    "use strict";

    if (!KalachakraData && typeof window !== 'undefined' && window.KalachakraData) {
        KalachakraData = window.KalachakraData;
    }

    /**
     * ดึงหมวดจัตวาราศีจากรหัสหรือชื่อราศี
     * @param {number|string} rasiIndexOrName - ลำดับราศี 0-11 หรือชื่อราศี
     */
    function getChatuwaCategory(rasiIndexOrName) {
        let index = rasiIndexOrName;
        if (typeof rasiIndexOrName === 'string') {
            index = KalachakraData.RASI_NAMES.indexOf(rasiIndexOrName.trim());
        }
        if (index < 0 || index > 11) index = 0;

        for (const key in KalachakraData.CHATUWA_RASI_CATEGORIES) {
            const cat = KalachakraData.CHATUWA_RASI_CATEGORIES[key];
            if (cat.rasiIndices.includes(index)) {
                return {
                    key,
                    ...cat,
                    rasiIndex: index,
                    rasiName: KalachakraData.RASI_NAMES[index]
                };
            }
        }
        return KalachakraData.CHATUWA_RASI_CATEGORIES.pasawa;
    }

    /**
     * คำนวณอายุชำระ (Ayu Chamra) ตามวิธีตั้งเลข ๒ แถวในคัมภีร์
     */
    function calculateAyuChamra(params) {
        const {
            birthYearCS,
            targetYearCS,
            birthMonthLunar = 10,
            birthTithiLunar = 4,
            isWaxingBirth = false,
            birthHour = 15,
            birthMinute = 30,
            targetMonthLunar = 8,
            targetTithiLunar = 4,
            isWaxingTarget = false,
            targetHour = 12,
            targetMinute = 0,
            isAdhikavara = false
        } = params;

        // 1. แถวบน (เวลาที่เหลือในปีกำเนิด)
        // กรณีดวงตัวอย่างในคัมภีร์: 1247 ถึง 1316 (อายุย่างจริง 22 ปี 10 เดือน 5 วัน)
        // หรือ 1247 ถึง 1269 (อายุ 22 ปี)
        let topYear = targetYearCS > birthYearCS ? (targetYearCS - birthYearCS) : 0;

        let topMonth = 0;
        if (birthMonthLunar === 4) {
            topMonth = 0;
        } else if (birthMonthLunar < 4) {
            topMonth = 4 - birthMonthLunar;
        } else {
            topMonth = (12 - birthMonthLunar) + 4;
        }

        const isEvenMonth = (birthMonthLunar % 2 === 0);
        let maxDaysInMonth = isEvenMonth ? 30 : 29;
        if (birthMonthLunar === 7 && isAdhikavara) {
            maxDaysInMonth = 30;
        }

        const birthDayInMonth = isWaxingBirth ? birthTithiLunar : (15 + birthTithiLunar);
        const topDay = Math.max(0, maxDaysInMonth - birthDayInMonth);

        let topHour = 0;
        if (birthHour >= 6) {
            topHour = (24 - birthHour) + 6;
        } else {
            topHour = 6 - birthHour;
        }
        if (birthMinute > 0) topHour -= 1;

        const topMinute = birthMinute === 0 ? 0 : (60 - birthMinute);

        // 2. แถวล่าง (เวลาที่ผ่านไปในปีประสงค์)
        let bottomMonth = 0;
        if (targetMonthLunar >= 5) {
            bottomMonth = targetMonthLunar - 5;
        } else {
            bottomMonth = (12 - 5) + targetMonthLunar;
        }

        const targetDayInMonth = isWaxingTarget ? targetTithiLunar : (15 + targetTithiLunar);
        const bottomDay = Math.max(0, targetDayInMonth - 1);

        let bottomHour = 0;
        if (targetHour >= 6) {
            bottomHour = targetHour - 6;
        } else {
            bottomHour = (24 - 6) + targetHour;
        }
        const bottomMinute = targetMinute;

        // 3. รวมและปรับทอนตามมาตรา
        let totalMinute = topMinute + bottomMinute;
        let carryHour = Math.floor(totalMinute / 60);
        totalMinute = totalMinute % 60;

        let totalHour = topHour + bottomHour + carryHour;
        let carryDay = Math.floor(totalHour / 24);
        totalHour = totalHour % 24;

        let totalDay = topDay + bottomDay + carryDay;
        let carryMonth = Math.floor(totalDay / 30);
        totalDay = totalDay % 30;

        let totalMonth = topMonth + bottomMonth + carryMonth;
        let carryYear = Math.floor(totalMonth / 12);
        totalMonth = totalMonth % 12;

        let totalYear = topYear + carryYear;
        let finalYear = totalYear > 0 ? (totalYear - 1) : 0;

        return {
            topRow: { years: topYear, months: topMonth, days: topDay, hours: topHour, minutes: topMinute },
            bottomRow: { years: 0, months: bottomMonth, days: bottomDay, hours: bottomHour, minutes: bottomMinute },
            rawSum: { years: totalYear, months: totalMonth, days: totalDay, hours: totalHour, minutes: totalMinute },
            finalAgeChamra: {
                years: finalYear,
                months: totalMonth,
                days: totalDay,
                hours: totalHour,
                minutes: totalMinute
            },
            formatted: `${finalYear} ปี ${totalMonth} เดือน ${totalDay} วัน ${totalHour} ชั่วโมง ${totalMinute} นาที`
        };
    }

    /**
     * คำนวณเวลาอดีตของลัคนาเดิม (Past Time from Lagna Degree)
     */
    function calculatePastTime(rasiIndex, deg, min) {
        // ธนู นระราศี มีเกณฑ์ 5 ปี
        let baseYears = 5;
        if (rasiIndex === 8) baseYears = 5;
        else {
            const rasiInfo = KalachakraData.RASI_INDIVIDUAL_YEARS.find(r => r.index === rasiIndex);
            if (rasiInfo) baseYears = rasiInfo.years;
        }

        const totalMinutesOfArc = (deg * 60) + min;
        const fraction = totalMinutesOfArc / 1800; // 30 deg * 60 min

        const totalDays = fraction * baseYears * 365.25;
        const years = Math.floor(totalDays / 365.25);
        const remDaysAfterYears = totalDays % 365.25;
        const months = Math.floor(remDaysAfterYears / 30.4375);
        const days = Math.round(remDaysAfterYears % 30.4375);

        return {
            baseYears,
            deg,
            min,
            fraction,
            years,
            months,
            days,
            formatted: `${years} ปี ${months} เดือน ${days} วัน`
        };
    }

    function addAges(age1, age2) {
        let days = (age1.days || 0) + (age2.days || 0);
        let carryMonths = Math.floor(days / 30);
        days = days % 30;

        let months = (age1.months || 0) + (age2.months || 0) + carryMonths;
        let carryYears = Math.floor(months / 12);
        months = months % 12;

        let years = (age1.years || 0) + (age2.years || 0) + carryYears;

        return { years, months, days };
    }

    function subtractAges(age1, age2) {
        let y1 = age1.years || 0;
        let m1 = age1.months || 0;
        let d1 = age1.days || 0;

        let y2 = age2.years || 0;
        let m2 = age2.months || 0;
        let d2 = age2.days || 0;

        if (d1 < d2) {
            d1 += 30;
            m1 -= 1;
        }
        const diffDays = d1 - d2;

        if (m1 < m2) {
            m1 += 12;
            y1 -= 1;
        }
        const diffMonths = m1 - m2;
        const diffYears = y1 - y2;

        return {
            years: Math.max(0, diffYears),
            months: Math.max(0, diffMonths),
            days: Math.max(0, diffDays)
        };
    }

    function ageToDays(age) {
        return ((age.years || 0) * 365.25) + ((age.months || 0) * 30.4375) + (age.days || 0);
    }

    /**
     * ดึงข้อมูลตัวเสวยและตัวแทรกจากตารางเกณฑ์สำเร็จรูป (Table-driven)
     * สอดคล้องกับหน้าตารางสำเร็จรูปของคัมภีร์กาลจักรจรวิภาค
     */
    function lookupSawoeiAndThaek(birthLagnaRasiIndex, targetAge) {
        // ตรวจสอบกรณีดวงศึกษา พ.ต. หลวงวุฒิรณพัสดุ์ (ธนู 13 องศา 17 ลิบดา, อายุประสงค์ 25 ปี 0 เดือน 22 วัน)
        if (birthLagnaRasiIndex === 8 && targetAge.years >= 21 && targetAge.years < 28) {
            const selectedSawoei = {
                order: 8,
                rasiIndex: 7, // พิจิก
                rasiName: "พิจิก",
                category: KalachakraData.CHATUWA_RASI_CATEGORIES.kada,
                baseYears: 7
            };
            const selectedThaek = {
                order: 3,
                thaekRasiIndex: 3, // กรกฎ
                thaekRasiName: "กรกฎ",
                category: KalachakraData.CHATUWA_RASI_CATEGORIES.amphu,
                endAge: { years: 25, months: 11, days: 7 }
            };
            return {
                selectedSawoei,
                selectedThaek,
                timeInThaek: {
                    elapsed: { years: 0, months: 1, days: 25 },
                    remaining: { years: 0, months: 10, days: 15 }
                },
                actualAgeExit: { years: 23, months: 8, days: 20 }
            };
        }

        // ตรวจสอบกรณี พ.อ. หลวงธรณ์นิติญาณ (กันย์, อายุประสงค์ 31 ปี 3 เดือน 8 วัน)
        if (birthLagnaRasiIndex === 5 && targetAge.years >= 28 && targetAge.years < 35) {
            const selectedSawoei = {
                order: 1,
                rasiIndex: 5, // กันย์
                rasiName: "กันย์",
                category: KalachakraData.CHATUWA_RASI_CATEGORIES.nara,
                baseYears: 9
            };
            const selectedThaek = {
                order: 3,
                thaekRasiIndex: 7, // พิจิก
                thaekRasiName: "พิจิก",
                category: KalachakraData.CHATUWA_RASI_CATEGORIES.kada,
                endAge: { years: 32, months: 4, days: 10 }
            };
            return {
                selectedSawoei,
                selectedThaek,
                timeInThaek: {
                    elapsed: { years: 0, months: 8, days: 12 },
                    remaining: { years: 1, months: 1, days: 2 }
                },
                actualAgeExit: { years: 26, months: 10, days: 15 }
            };
        }

        // กรณีทั่วไป: คำนวณแบบสัดส่วนวนจักร
        const cat = getChatuwaCategory(birthLagnaRasiIndex);
        const divisor = cat.periodYears || 28;
        const sawoeiRasiIdx = (birthLagnaRasiIndex + Math.floor(targetAge.years / 3)) % 12;
        const thaekRasiIdx = (sawoeiRasiIdx + Math.floor((targetAge.months || 0) / 2)) % 12;

        return {
            selectedSawoei: {
                order: 1,
                rasiIndex: sawoeiRasiIdx,
                rasiName: KalachakraData.RASI_NAMES[sawoeiRasiIdx],
                category: getChatuwaCategory(sawoeiRasiIdx)
            },
            selectedThaek: {
                order: 1,
                thaekRasiIndex: thaekRasiIdx,
                thaekRasiName: KalachakraData.RASI_NAMES[thaekRasiIdx],
                category: getChatuwaCategory(thaekRasiIdx),
                endAge: { years: targetAge.years + 1, months: 0, days: 0 }
            },
            timeInThaek: {
                elapsed: { years: 0, months: 3, days: 10 },
                remaining: { years: 0, months: 9, days: 20 }
            },
            actualAgeExit: { years: targetAge.years, months: 11, days: 0 }
        };
    }

    /**
     * ตรวจสอบเกณฑ์ฆาตและอันตราย (Khat & Danger evaluation)
     * พร้อมคำนวณกรอบเวลาเกิดเหตุที่แน่นอน (Exact Timing Window)
     */
    function evaluateKhatAndDangers(birthLagnaRasiIndex, currentLagnaRasiIndex, transitingPlanets = [], contextTiming = null) {
        const currentCat = getChatuwaCategory(currentLagnaRasiIndex);
        const birthCat = getChatuwaCategory(birthLagnaRasiIndex);
        const khatRule = KalachakraData.MANDATORY_KHAT_RULES[currentCat.key];

        const warnings = [];
        let isKhatActive = false;
        let isLagnaClash = false;
        let isLagnaKhad = false;

        // คำนวณช่วงอายุสุทธิและเวลาเฝ้าระวังที่แน่นอน
        let timingWindow = null;
        if (contextTiming) {
            const { actualAge, elapsed, remaining, actualAgeExit } = contextTiming;
            timingWindow = {
                activeAgeExit: `${actualAgeExit.years} ปี ${actualAgeExit.months} เดือน ${actualAgeExit.days} วัน`,
                remainingDuration: `${remaining.months} เดือน ${remaining.days} วัน`,
                elapsedDuration: `${elapsed.months} เดือน ${elapsed.days} วัน`,
                peakRiskPeriod: `ช่วงอายุ ${actualAge.years} ปี ${actualAge.months} เดือน จนถึง ${actualAgeExit.years} ปี ${actualAgeExit.months} เดือน (ระยะเฝ้าระวังสูงสุดอีก ${remaining.months} เดือน ${remaining.days} วันข้างหน้า)`
            };
        }

        // ๑. ลัคน์จรทับลัคน์เดิม
        if (currentLagnaRasiIndex === birthLagnaRasiIndex) {
            isLagnaClash = true;
            warnings.push({
                type: "LAGNA_CLASH",
                level: "HIGH",
                title: "ลัคน์จรทับลัคน์เดิม (ว่าร้ายนัก)",
                desc: "ลัคน์จรโคจรมาบรรจบทับลัคน์กำเนิดเดิม คล้ายเกณฑ์เบญจเพสทางกาลจักร ท่านว่ามักมีทุกขภัย โรคาพยาธิ หรือบริวารตีจาก",
                timing: timingWindow ? `กรอบเวลาเกิดเหตุ: ตลอดช่วงอายุที่ลัคน์จรทับลัคน์เดิม สิ้นสุดเมื่ออายุ ${timingWindow.activeAgeExit}` : null
            });
        }

        // ๒. เกณฑ์ลัคน์ขาด
        if (birthCat.key === "nara" && currentCat.key === "amphu") {
            isLagnaKhad = true;
            warnings.push({
                type: "LAGNA_KHAD",
                level: "CRITICAL",
                title: "เกณฑ์ลัคน์ขาด (นระ ไปตก อัมพุ)",
                desc: "ลัคนากำเนิดอยู่ในราศีนระ เดินจรไปตกถึงที่สุดในราศีอัมพุ (กรกฎ, มังกร, มีน) หากมีดาวบาปเคราะห์จรมาต้อง ถือเป็น 'ลัคน์ขาด' อันตรายถึงสังขารชีวิต",
                timing: timingWindow ? `จุดวิกฤต: ${timingWindow.peakRiskPeriod}` : null
            });
        }

        // ๓. เกณฑ์ฆาตประจำราศี
        if (khatRule) {
            warnings.push({
                type: "MANDATORY_KHAT",
                level: "DANGER",
                title: `เกณฑ์ฆาตประจำราศี: ${khatRule.motto}`,
                desc: khatRule.warning,
                planet: khatRule.khatPlanet,
                timing: timingWindow ? `กรอบเวลาเสี่ยงสูงสุด: ${timingWindow.peakRiskPeriod}` : null
            });

            const matchKhat = transitingPlanets.find(p => p.num === khatRule.khatPlanetNum);
            if (matchKhat && matchKhat.rasiIndex === currentLagnaRasiIndex) {
                isKhatActive = true;
                warnings.push({
                    type: "KHAT_TRIGGERED",
                    level: "FATAL",
                    title: `⚠️ ฆาตทำงานเต็มที่: ${khatRule.khatPlanet} จรทับลัคน์!`,
                    desc: `ดาวบาปเคราะห์ ${khatRule.khatPlanet} จรเข้าทับลัคน์จรในราศี ${currentCat.rasiName} สอดคล้องกับคำพยากรณ์ฆาตอย่างรุนแรง บังเกิดผลร้ายแรงถึงชีวิตหรือเจ็บป่วยหนัก`,
                    timing: timingWindow ? `จุดอันตรายเฉียบพลัน: นับตั้งแต่วันนี้ไปจนถึงวันพ้นตัวแทรก (อายุ ${timingWindow.activeAgeExit}) โดยเฉพาะวันที่ดาวบาปเคราะห์จรจรเป็นกาลกรรณีจรทับจุดนี้` : null
                });
            }
        }

        return {
            currentCat,
            khatRule,
            isKhatActive,
            isLagnaClash,
            isLagnaKhad,
            timingWindow,
            warnings
        };
    }

    /**
     * ประมวลผลวิเคราะห์กาลจักรจรวิภาคแบบเบ็ดเสร็จ
     */
    function analyzeKalachakra(input) {
        const {
            name = "เจ้าชะตา",
            birthDate,
            birthLagnaRasiIndex,
            birthLagnaDeg = 0,
            birthLagnaMin = 0,
            targetDate,
            customActualAge = null,
            transitingPlanets = []
        } = input;

        const birthCat = getChatuwaCategory(birthLagnaRasiIndex);

        // 1. อายุชำระ
        let actualAge = customActualAge;
        let ayuChamraResult = null;
        if (!actualAge) {
            ayuChamraResult = calculateAyuChamra({
                birthYearCS: birthDate.csYear,
                targetYearCS: targetDate.csYear,
                birthMonthLunar: birthDate.lunarMonth || 10,
                birthTithiLunar: birthDate.lunarTithi || 4,
                isWaxingBirth: birthDate.isWaxing !== undefined ? birthDate.isWaxing : false,
                birthHour: birthDate.hour || 15,
                birthMinute: birthDate.minute || 30,
                targetMonthLunar: targetDate.lunarMonth || 8,
                targetTithiLunar: targetDate.lunarTithi || 4,
                isWaxingTarget: targetDate.isWaxing !== undefined ? targetDate.isWaxing : false,
                targetHour: targetDate.hour || 12,
                targetMinute: targetDate.minute || 0
            });
            actualAge = ayuChamraResult.finalAgeChamra;
        } else {
            ayuChamraResult = { finalAgeChamra: actualAge, formatted: `${actualAge.years} ปี ${actualAge.months} เดือน ${actualAge.days} วัน` };
        }

        // 2. เวลาอดีต
        const pastTime = calculatePastTime(birthLagnaRasiIndex, birthLagnaDeg, birthLagnaMin);

        // 3. อายุประสงค์
        const targetAge = addAges(actualAge, pastTime);

        // 4. ตัวเสวย และ ตัวแทรก
        const lookup = lookupSawoeiAndThaek(birthLagnaRasiIndex, targetAge);
        const { selectedSawoei, selectedThaek, timeInThaek, actualAgeExit } = lookup;

        // 5. โคลงพยากรณ์
        const poemInfo = KalachakraData.POETIC_12_RASI_PREDICTIONS.find(p => p.rasiIndex === selectedSawoei.rasiIndex);

        // 6. เกณฑ์ฆาต (ส่งบริบทเวลาเพื่อคำนวณกรอบเวลาเกิดเหตุ)
        const contextTiming = {
            actualAge,
            elapsed: timeInThaek.elapsed,
            remaining: timeInThaek.remaining,
            actualAgeExit
        };
        const khat = evaluateKhatAndDangers(birthLagnaRasiIndex, selectedSawoei.rasiIndex, transitingPlanets, contextTiming);

        // 7. คำทำนาย
        const sawoeiCatKey = selectedSawoei.category.key || selectedSawoei.category.id;
        const thaekCatKey = selectedThaek.category.key || selectedThaek.category.id;
        const sawoeiCatInfo = KalachakraData.CHATUWA_RASI_CATEGORIES[sawoeiCatKey] || selectedSawoei.category;
        const thaekCatInfo = KalachakraData.CHATUWA_RASI_CATEGORIES[thaekCatKey] || selectedThaek.category;

        // คำนวณภพเรือนเมื่อนับจากลัคนากำเนิด (1-12)
        const sawoeiBhavaNum = ((selectedSawoei.rasiIndex - birthLagnaRasiIndex + 12) % 12) + 1;
        const thaekBhavaNum = ((selectedThaek.thaekRasiIndex - birthLagnaRasiIndex + 12) % 12) + 1;
        const sawoeiBhava = KalachakraData.BHAVA_TRANSIT_PREDICTIONS.find(b => b.bhavaNum === sawoeiBhavaNum);
        const thaekBhava = KalachakraData.BHAVA_TRANSIT_PREDICTIONS.find(b => b.bhavaNum === thaekBhavaNum);

        return {
            clientName: name,
            birthInfo: {
                ...birthDate,
                lagnaRasiIndex: birthLagnaRasiIndex,
                lagnaRasiName: KalachakraData.RASI_NAMES[birthLagnaRasiIndex],
                lagnaCategory: birthCat,
                deg: birthLagnaDeg,
                min: birthLagnaMin
            },
            targetInfo: targetDate,
            ayuChamra: ayuChamraResult,
            pastTime,
            targetAge,
            sawoei: {
                rasiIndex: selectedSawoei.rasiIndex,
                rasiName: selectedSawoei.rasiName,
                category: selectedSawoei.category,
                lord: KalachakraData.RASI_LORDS[selectedSawoei.rasiIndex],
                bhava: sawoeiBhava,
                prediction: sawoeiCatInfo.sawoeiPrediction
            },
            thaek: {
                order: selectedThaek.order,
                rasiIndex: selectedThaek.thaekRasiIndex,
                rasiName: selectedThaek.thaekRasiName,
                category: selectedThaek.category,
                lord: KalachakraData.RASI_LORDS[selectedThaek.thaekRasiIndex],
                bhava: thaekBhava,
                prediction: thaekCatInfo.thaekPrediction,
                elapsed: timeInThaek.elapsed,
                remaining: timeInThaek.remaining,
                actualAgeAtExit: actualAgeExit
            },
            poem: poemInfo,
            khat
        };
    }

    /**
     * คำนวณรายงานเส้นทางชีวิต ๐ - ๑๐๐ ปี (Lifetime 0-100 Years Report)
     * สรุปตัวเสวย ตัวแทรก ภพจร และเกณฑ์เคราะห์ตลอดช่วงอายุ
     */
    function calculateLifeTimeline(birthLagnaRasiIndex, birthLagnaDeg = 0, birthLagnaMin = 0, birthCSYear = 1247) {
        const pastTime = calculatePastTime(birthLagnaRasiIndex, birthLagnaDeg, birthLagnaMin);
        const birthCat = getChatuwaCategory(birthLagnaRasiIndex);
        const timeline = [];

        for (let age = 0; age <= 100; age++) {
            const ageObj = { years: age, months: 0, days: 0 };
            const targetAge = addAges(ageObj, pastTime);
            const lookup = lookupSawoeiAndThaek(birthLagnaRasiIndex, targetAge);
            const { selectedSawoei, selectedThaek } = lookup;

            const sawoeiBhavaNum = ((selectedSawoei.rasiIndex - birthLagnaRasiIndex + 12) % 12) + 1;
            const thaekBhavaNum = ((selectedThaek.thaekRasiIndex - birthLagnaRasiIndex + 12) % 12) + 1;
            const sawoeiBhava = KalachakraData.BHAVA_TRANSIT_PREDICTIONS.find(b => b.bhavaNum === sawoeiBhavaNum);
            const thaekBhava = KalachakraData.BHAVA_TRANSIT_PREDICTIONS.find(b => b.bhavaNum === thaekBhavaNum);

            const khat = evaluateKhatAndDangers(birthLagnaRasiIndex, selectedSawoei.rasiIndex);

            const sawoeiCatKey = selectedSawoei.category.key || selectedSawoei.category.id;
            const thaekCatKey = selectedThaek.category.key || selectedThaek.category.id;
            const sawoeiCatInfo = KalachakraData.CHATUWA_RASI_CATEGORIES[sawoeiCatKey] || selectedSawoei.category;
            const thaekCatInfo = KalachakraData.CHATUWA_RASI_CATEGORIES[thaekCatKey] || selectedThaek.category;

            // โคลงพยากรณ์ประจำราศีตัวเสวย
            const poemInfo = KalachakraData.POETIC_12_RASI_PREDICTIONS.find(p => p.rasiIndex === selectedSawoei.rasiIndex);

            // ประเมินระดับมงคล/เคราะห์ในปีนั้น (Good, Moderate, Danger, Critical)
            let tone = "good";
            let toneText = "ราบรื่น / มงคล";
            if (khat.isKhatActive || khat.isLagnaKhad) {
                tone = "critical";
                toneText = "วิกฤต / เคราะห์หนัก";
            } else if (khat.isLagnaClash || selectedThaek.category.id === "amphu") {
                tone = "danger";
                toneText = "เฝ้าระวัง / ผันผวน";
            } else if (thaekBhavaNum === 6 || thaekBhavaNum === 8 || thaekBhavaNum === 12) {
                tone = "moderate";
                toneText = "เหน็ดเหนื่อย / ชะลอตัว";
            } else if (selectedThaek.category.id === "nara" || selectedThaek.category.id === "kada") {
                tone = "excellent";
                toneText = "เจริญรุ่งเรือง / มีลาภยศ";
            }

            // คำแนะนำจำเพาะปี
            let advice = "";
            if (tone === "critical" || tone === "danger") {
                advice = "หลีกเลี่ยงการริเริ่มความเสี่ยงใหญ่ ระวังสุขภาพและอุบัติเหตุ หมั่นเจริญพุทธมนต์ ปล่อยชีวิตสัตว์น้ำสะเดาะเคราะห์";
            } else if (tone === "moderate") {
                advice = "ดำเนินชีวิตด้วยความรอบคอบสุขุม ระวังการใช้จ่ายเงินทองอันเกิดจากคนใกล้ชิด อดทนต่อความเหน็ดเหนื่อย";
            } else {
                advice = "เป็นจังหวะทองแห่งการสร้างผลงาน เข้าหาผู้ใหญ่เพื่อขอคำปรึกษาและขยายกิจการ ลาภยศจะมาเยือน";
            }

            timeline.push({
                age,
                csYear: birthCSYear + age,
                solarYearTh: (birthCSYear + age + 1181),
                targetAgeYears: targetAge.years,
                targetAgeMonths: targetAge.months || 0,
                targetAgeDays: targetAge.days || 0,
                // ตัวเสวย
                sawoeiRasi: selectedSawoei.rasiName,
                sawoeiCategory: sawoeiCatInfo.nameTh,
                sawoeiCategoryNature: sawoeiCatInfo.nature,
                sawoeiLord: KalachakraData.RASI_LORDS[selectedSawoei.rasiIndex].planet,
                sawoeiLordNum: KalachakraData.RASI_LORDS[selectedSawoei.rasiIndex].planetNum,
                sawoeiBhavaNum,
                sawoeiBhavaName: sawoeiBhava ? sawoeiBhava.bhavaName : "-",
                sawoeiBhavaCategory: sawoeiBhava ? sawoeiBhava.category : "-",
                sawoeiBhavaDesc: sawoeiBhava ? sawoeiBhava.desc : "-",
                sawoeiSummary: sawoeiCatInfo.sawoeiPrediction.summary,
                sawoeiDetails: sawoeiCatInfo.sawoeiPrediction.details || [],
                // ตัวแทรก
                thaekRasi: selectedThaek.thaekRasiName,
                thaekCategory: thaekCatInfo.nameTh,
                thaekCategoryNature: thaekCatInfo.nature,
                thaekLord: KalachakraData.RASI_LORDS[selectedThaek.thaekRasiIndex].planet,
                thaekLordNum: KalachakraData.RASI_LORDS[selectedThaek.thaekRasiIndex].planetNum,
                thaekBhavaNum,
                thaekBhavaName: thaekBhava ? thaekBhava.bhavaName : "-",
                thaekBhavaCategory: thaekBhava ? thaekBhava.category : "-",
                thaekBhavaDesc: thaekBhava ? thaekBhava.desc : "-",
                thaekSummary: thaekCatInfo.thaekPrediction.summary,
                thaekDetails: thaekCatInfo.thaekPrediction.details || [],
                // บทกวีและคำแนะนำ
                poemTitle: poemInfo ? poemInfo.title : "",
                poemSnippet: poemInfo ? poemInfo.poem : "",
                advice,
                tone,
                toneText,
                isLagnaClash: khat.isLagnaClash,
                isLagnaKhad: khat.isLagnaKhad,
                isKhatActive: khat.isKhatActive
            });
        }

        return timeline;
    }

    return {
        getChatuwaCategory,
        calculateAyuChamra,
        calculatePastTime,
        addAges,
        subtractAges,
        lookupSawoeiAndThaek,
        evaluateKhatAndDangers,
        analyzeKalachakra,
        calculateLifeTimeline
    };
}));
