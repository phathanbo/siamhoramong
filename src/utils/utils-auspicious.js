/**
 * 📅 Utility Functions - Auspicious Days
 *
 * รวม function ที่ทำซ้ำเพื่อให้เป็น single source of truth
 * ใช้งาน: เรียกใน index.html ก่อน script ที่ต้องใช้
 */

"use strict";

/**
 * 📅 หาวันมงคลจากเดือน
 *
 * ใช้งาน:
 * - ceremony-date.js (findCeremonyDate)
 * - auspicious-opening.js (findAuspiciousOpeningDays)
 * - travelData.js (ระหว่างเดินทาง)
 * - AuspiciousDays.js (ปฏิทินฤกษ์)
 *
 * @param {number} month - เดือน (1-12)
 * @returns {array} - วันมงคลในเดือนนั้น
 */
function getAuspiciousDays(month) {
    // ❌ ลบ implementation ของ function นี้จากไฟล์อื่น ๆ
    // ✅ ใช้ function นี้แทน

    // อิงจาก AuspiciousDay.js - AUSPICIOUS_DAYS_DETAIL
    if (typeof AUSPICIOUS_DAYS_DETAIL !== 'undefined' && AUSPICIOUS_DAYS_DETAIL[month]) {
        const data = AUSPICIOUS_DAYS_DETAIL[month];
        if (data && data.goodDates) {
            return data.goodDates;
        }
    }

    // fallback: วันมงคลตัวแทน (ถ้า AUSPICIOUS_DAYS_DETAIL ไม่มี)
    const defaultGoodDates = {
        1: [1, 5, 8, 10, 13, 15, 18, 20, 23, 25, 28, 30],
        2: [2, 4, 7, 9, 12, 14, 17, 19, 22, 24, 27],
        3: [1, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28, 31],
        4: [3, 5, 8, 10, 13, 15, 18, 20, 23, 25, 28, 30],
        5: [1, 4, 6, 9, 11, 14, 16, 19, 21, 24, 26, 29, 31],
        6: [2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30],
        7: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28, 31],
        8: [2, 4, 7, 9, 12, 14, 17, 19, 22, 24, 27, 29],
        9: [1, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30],
        10: [2, 4, 7, 9, 12, 14, 17, 19, 22, 24, 27, 29],
        11: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28],
        12: [2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30]
    };

    return defaultGoodDates[month] || [];
}

/**
 * 🔍 ตรวจสอบว่าวันนั้นเป็นวันมงคลหรือไม่
 *
 * @param {number} month - เดือน (1-12)
 * @param {number} day - วัน (1-31)
 * @returns {boolean} - true ถ้าเป็นวันมงคล
 */
function isAuspiciousDay(month, day) {
    const auspiciousDays = getAuspiciousDays(month);
    return auspiciousDays.includes(day);
}

/**
 * 📋 รวมวันมงคลสำหรับหลายเดือน
 *
 * @param {array} months - array ของเดือน [1, 2, 3]
 * @returns {object} - { month: [goodDates] }
 */
function getAuspiciousDaysForMonths(months) {
    const result = {};
    months.forEach(month => {
        result[month] = getAuspiciousDays(month);
    });
    return result;
}

/**
 * 📅 หา N วันมงคลถัดไป
 *
 * @param {number} month - เดือนเริ่มต้น (1-12)
 * @param {number} count - จำนวนวันที่ต้องหา (default 5)
 * @returns {array} - วันมงคล N วันถัดไป
 */
function getNextAuspiciousDays(month, count = 5) {
    const result = [];
    let currentMonth = month;
    let daysFound = 0;

    while (daysFound < count) {
        const days = getAuspiciousDays(currentMonth);

        // ถ้าเดือนแรก ให้ skip วันที่ผ่านไป
        const today = new Date().getDate();
        const currentMonthNum = new Date().getMonth() + 1;

        const startDay = currentMonth === currentMonthNum ? today : 1;

        days.forEach(day => {
            if (day >= startDay && daysFound < count) {
                result.push({ month: currentMonth, day: day });
                daysFound++;
            }
        });

        currentMonth++;
        if (currentMonth > 12) currentMonth = 1;
    }

    return result;
}

// Export สำหรับ module systems (ถ้าใช้)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAuspiciousDays,
        isAuspiciousDay,
        getAuspiciousDaysForMonths,
        getNextAuspiciousDays
    };
}
