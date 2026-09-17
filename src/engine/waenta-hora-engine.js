/**
 * 🔮 กลไกการคำนวณและพยากรณ์ตามคัมภีร์แว่นตาโหรโบราณ (Waenta Hora Engine)
 * สยามโหรามงคล
 */
"use strict";

const WaentaHoraEngine = {
    /**
     * คำนวณมหาทักษาเสวยอายุและแทรก
     * @param {number} birthDay 0 (อาทิตย์) ถึง 6 (เสาร์)
     * @param {number} currentAge อายุเต็มรอบ
     */
    calculateMahataksa: function(birthDay, currentAge) {
        // ดาวตั้งต้นตามวันเกิด
        // วันอาทิตย์(0) -> ดาวอาทิตย์(1)
        // วันจันทร์(1) -> ดาวจันทร์(2)
        // วันอังคาร(2) -> ดาวอังคาร(3)
        // วันพุธ(3) -> ดาวพุธ(4)
        // วันพฤหัสบดี(4) -> ดาวพฤหัสบดี(5)
        // วันศุกร์(5) -> ดาวศุกร์(6)
        // วันเสาร์(6) -> ดาวเสาร์(7)
        const dayToStartPlanet = {
            0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7
        };

        const planetsCycle = [1, 2, 3, 4, 7, 5, 8, 6]; // ลำดับนพเคราะห์มหาทักษา: ๑, ๒, ๓, ๔, ๗, ๕, ๘, ๖
        const startPlanetId = dayToStartPlanet[birthDay] || 1;
        const startIndex = planetsCycle.indexOf(startPlanetId);

        // กำลังดาว
        const planetPowers = { 1: 6, 2: 15, 3: 8, 4: 17, 7: 10, 5: 19, 8: 12, 6: 21 };
        const planetNames = {
            1: "พระอาทิตย์ (๑)",
            2: "พระจันทร์ (๒)",
            3: "พระอังคาร (๓)",
            4: "พระพุธ (๔)",
            7: "พระเสาร์ (๗)",
            5: "พระพฤหัสบดี (๕)",
            8: "พระราหู (๘)",
            6: "พระศุกร์ (๖)"
        };

        // รอบรวม 108 ปี
        let ageInCycle = (currentAge > 0 ? currentAge : 1) % 108;
        if (ageInCycle === 0) ageInCycle = 108;

        let accumulatedAge = 0;
        let rulingPlanetId = startPlanetId;
        let yearsIntoRuling = 0;

        for (let i = 0; i < planetsCycle.length; i++) {
            const pId = planetsCycle[(startIndex + i) % planetsCycle.length];
            const power = planetPowers[pId];
            if (accumulatedAge + power >= ageInCycle) {
                rulingPlanetId = pId;
                yearsIntoRuling = ageInCycle - accumulatedAge; // ปีที่เสวยไปแล้ว
                break;
            }
            accumulatedAge += power;
        }

        // คำนวณช่วงดาวแทรกภายในดาวเสวยอายุ
        // สูตรโบราณ: นำกำลังดาวเสวย × กำลังดาวแทรก / 12 = เดือน
        const rulingIndex = planetsCycle.indexOf(rulingPlanetId);
        const interceptList = [];
        let monthsSum = 0;
        const targetMonths = yearsIntoRuling * 12;

        let currentInterceptPlanetId = rulingPlanetId;

        for (let j = 0; j < planetsCycle.length; j++) {
            const intPlanetId = planetsCycle[(rulingIndex + j) % planetsCycle.length];
            const pMajor = planetPowers[rulingPlanetId];
            const pMinor = planetPowers[intPlanetId];

            const totalMonths = (pMajor * pMinor) / 12;
            const years = Math.floor(totalMonths / 12);
            const remMonthsAfterYear = totalMonths % 12;
            const months = Math.floor(remMonthsAfterYear);
            const remDaysFrac = (remMonthsAfterYear - months) * 30;
            const days = Math.round(remDaysFrac);

            interceptList.push({
                majorId: rulingPlanetId,
                minorId: intPlanetId,
                minorName: planetNames[intPlanetId],
                powerMinor: pMinor,
                years,
                months,
                days,
                durationText: `${years > 0 ? years + ' ปี ' : ''}${months > 0 ? months + ' เดือน ' : ''}${days > 0 ? days + ' วัน' : ''}`.trim() || 'ไม่ถึง 1 เดือน'
            });

            monthsSum += totalMonths;
            if (monthsSum >= targetMonths && !currentInterceptPlanetId) {
                currentInterceptPlanetId = intPlanetId;
            }
        }

        if (!currentInterceptPlanetId) {
            currentInterceptPlanetId = interceptList[0].minorId;
        }

        const predMap = WAENTA_HORA_DATA.mahataksaPredictions[rulingPlanetId] || {};
        const activePrediction = predMap[currentInterceptPlanetId] || "เกณฑ์ชะตาอยู่ในช่วงเปลี่ยนผ่านกำลังดาวเสวย";

        return {
            age: currentAge,
            rulingPlanet: {
                id: rulingPlanetId,
                name: planetNames[rulingPlanetId],
                power: planetPowers[rulingPlanetId],
                yearsIntoRuling
            },
            interceptPlanet: {
                id: currentInterceptPlanetId,
                name: planetNames[currentInterceptPlanetId],
                power: planetPowers[currentInterceptPlanetId]
            },
            interceptList,
            prediction: activePrediction
        };
    },

    /**
     * คำนวณทักษาจรตามอายุแบบมี "ตากลาง" ตามตำราแว่นตาโหรแท้
     * @param {number} birthDay 0-6
     * @param {number} age อายุย่าง (1, 2, 3...)
     */
    calculateTaksaJorTaKlang: function(birthDay, age) {
        // ผังทักษา 8 ภูมิรอบวง: 1(อาทิตย์), 2(จันทร์), 3(อังคาร), 4(พุธ), 7(เสาร์), 5(พฤหัส), 8(ราหู), 6(ศุกร์)
        // เมื่อวนตก 1 (อาทิตย์) อายุปีถัดไปจะเข้า "ตากลาง" 1 ปี แล้วค่อยออกไป 2 (จันทร์)
        const sequence = [1, 2, 3, 4, 7, 5, 8, 6];
        const dayToStart = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };
        const startPlanet = dayToStart[birthDay] || 1;

        let currentPlanet = startPlanet;
        let isTaKlang = false;

        for (let y = 2; y <= age; y++) {
            if (isTaKlang) {
                isTaKlang = false;
                currentPlanet = 2; // ออกจากตากลางไปหาภูมิจันทร์ (๒)
            } else if (currentPlanet === 1) {
                isTaKlang = true; // จากอาทิตย์เข้าตากลาง
            } else {
                const idx = sequence.indexOf(currentPlanet);
                currentPlanet = sequence[(idx + 1) % sequence.length];
            }
        }

        const planetLabels = {
            1: "พระอาทิตย์ (๑)", 2: "พระจันทร์ (๒)", 3: "พระอังคาร (๓)", 4: "พระพุธ (๔)",
            7: "พระเสาร์ (๗)", 5: "พระพฤหัสบดี (๕)", 8: "พระราหู (๘)", 6: "พระศุกร์ (๖)",
            "center": "ศูนย์กลางตากลาง (เสวยเงาชะตา)"
        };

        return {
            age,
            isTaKlang,
            currentPlanet,
            planetName: isTaKlang ? planetLabels["center"] : planetLabels[currentPlanet]
        };
    },

    /**
     * คำนวณผลฤกษ์ปลูกเรือนและเดือนมิตร
     * @param {number} birthMonth เดือนไทย 1-12
     * @param {number} targetMonth เดือนที่ต้องการปลูกเรือน 1-12
     * @param {number} age อายุ
     */
    calculateHouseBuilding: function(birthMonth, targetMonth, age) {
        // สูตร: นับจากเดือน ๕ ไปถึงเดือนที่ต้องการ บวกด้วยอายุ แล้วนำ ๓ คูณ เอา ๓ หาร พิจารณาเศษ
        // การนับเดือนจาก ๕ ถึง targetMonth (นับแบบเวียน 1-12)
        let monthDiff = 0;
        if (targetMonth >= 5) {
            monthDiff = (targetMonth - 5) + 1;
        } else {
            monthDiff = (12 - 5 + 1) + targetMonth;
        }

        const totalSum = (monthDiff + age) * 3;
        const remainder = totalSum % 3; // ในตำราโบราณกล่าวถึง เศษ ๑, ๒, ๓(หรือเศษ ๗ ตามสูตรพิธี)
        // ตำราแว่นตาโหร หน้า 45-46:
        // เศษ ๑: ได้ลาภแต่เป็นทุกขลาภ
        // เศษ ๒: ได้ลาภจากผู้มีวาสนา
        // เศษ ๓ (หรือหารลงตัว): มักร้อนใจ
        const outcomes = {
            1: { title: "เศษ ๑", desc: "ได้ลาภแต่เป็นทุกขลาภ มีสิ่งรบกวนก่อนได้ความเจริญ", status: "ปานกลาง" },
            2: { title: "เศษ ๒", desc: "ได้ลาภจากผู้มีวาสนา บังเกิดความมั่งคั่งสวัสดี", status: "ดีเยี่ยม" },
            0: { title: "เศษ ๓ (ลงตัว)", desc: "มักร้อนใจ ต้องระมัดระวังเรื่องคนและความขัดแย้ง", status: "พึงระวัง" }
        };

        const monthData = WAENTA_HORA_DATA.birthMonths[birthMonth] || {};
        return {
            birthMonthName: monthData.monthName || `เดือน ${birthMonth}`,
            targetMonth,
            age,
            remainder,
            outcome: outcomes[remainder],
            recommendation: monthData.houseAuspiciousMonth || "เลือกเดือนมิตรร่วมธาตุ",
            friendlyMonth: monthData.friendlyMonth || "เดือนมิตรตามตำรา"
        };
    },

    /**
     * คำนวณยามตรีเนตร์ & ยาม 3 ตา
     * @param {number} hour ชั่วโมง
     * @param {number} minute นาที
     * @param {number} questionNum เลขข้อที่ถามหรือเลขยาม
     */
    calculateYarmTriNetr: function(hour, minute, questionNum = 1) {
        // ยามละ 1 ชั่วโมงครึ่ง เริ่มนับย่ำรุ่ง (06:00)
        let totalMinutes = hour * 60 + minute;
        let dayStartMinutes = 6 * 60; // 06:00
        if (totalMinutes < dayStartMinutes) {
            totalMinutes += 24 * 60;
        }
        const diff = totalMinutes - dayStartMinutes;
        const yarmIndex = Math.floor(diff / 90) % 8 + 1; // ยามที่ 1 ถึง 8

        // เกณฑ์ยามตรีเนตร์: วน ก่ำ / ใส / ปลอด
        const triNetrCycle = ["ก่ำ", "ใส", "ปลอด"];
        const primaryNetr = triNetrCycle[(yarmIndex - 1) % 3];
        const netrMeaning = WAENTA_HORA_DATA.yarmLore.triNetrMeanings[primaryNetr];

        // ยาม 3 ตา: เลขยาม x 2 หาร 3 ดูเศษ
        const samTaScore = (yarmIndex * 2) % 3;
        const samTaMeaning = WAENTA_HORA_DATA.yarmLore.yarmSamTaRemainders[samTaScore];

        return {
            timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
            yarmSlot: yarmIndex,
            triNetr: primaryNetr,
            netrDetail: netrMeaning,
            samTaRemainder: samTaScore,
            samTaText: samTaMeaning
        };
    }
};

if (typeof window !== 'undefined') {
    window.WaentaHoraEngine = WaentaHoraEngine;
}
