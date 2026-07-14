"use strict";

const THAI_ANCHORS = {
    // ตัวอย่างข้อมูล (ต้องเติมให้ครบตามปีที่ต้องการ)
    // รูปแบบ: ปีคริสต์ศักราช: { date: new Date(ปี, เดือน-1, วัน), zodiac: "ชื่อปี", isAthikamat: true/false }
    1957: { date: new Date(1957, 2, 31), zodiac: "ระกา", isAthikamat: false }, // 2500
    1958: { date: new Date(1958, 2, 20), zodiac: "จอ", isAthikamat: true },   // 2501 (อธิกมาส)
    1959: { date: new Date(1959, 3, 8),  zodiac: "กุน", isAthikamat: false },  // 2502
    1960: { date: new Date(1960, 2, 27), zodiac: "ชวด", isAthikamat: false }, // 2503
    1961: { date: new Date(1961, 2, 16), zodiac: "ฉลู", isAthikamat: true },   // 2504 (อธิกมาส)
    1962: { date: new Date(1962, 3, 4),  zodiac: "ขาล", isAthikamat: false },  // 2505
    1963: { date: new Date(1963, 2, 25), zodiac: "เถาะ", isAthikamat: false }, // 2506
    1964: { date: new Date(1964, 3, 12), zodiac: "มะโรง", isAthikamat: false },// 2507
    1965: { date: new Date(1965, 3, 1),  zodiac: "มะเส็ง", isAthikamat: true }, // 2508 (อธิกมาส)
    1966: { date: new Date(1966, 2, 21), zodiac: "มะเมีย", isAthikamat: false },// 2509
    1967: { date: new Date(1967, 3, 9),  zodiac: "มะแม", isAthikamat: false },  // 2510
    1968: { date: new Date(1968, 2, 28), zodiac: "วอก", isAthikamat: true },   // 2511 (อธิกมาส)
    1969: { date: new Date(1969, 2, 18), zodiac: "ระกา", isAthikamat: false }, // 2512
    1970: { date: new Date(1970, 3, 6),  zodiac: "จอ", isAthikamat: false },   // 2513
    1971: { date: new Date(1971, 2, 26), zodiac: "กุน", isAthikamat: true },   // 2514 (อธิกมาส)
    1972: { date: new Date(1972, 2, 15), zodiac: "ชวด", isAthikamat: false }, // 2515
    1973: { date: new Date(1973, 3, 3),  zodiac: "ฉลู", isAthikamat: false },  // 2516
    1974: { date: new Date(1974, 2, 23), zodiac: "ขาล", isAthikamat: true },   // 2517 (อธิกมาส)
    1975: { date: new Date(1975, 3, 11), zodiac: "เถาะ", isAthikamat: false }, // 2518
    1976: { date: new Date(1976, 2, 30), zodiac: "มะโรง", isAthikamat: false },// 2519
    1977: { date: new Date(1977, 2, 20), zodiac: "มะเส็ง", isAthikamat: true },  // 2520 (อธิกมาส)
    1978: { date: new Date(1978, 3, 8),  zodiac: "มะเมีย", isAthikamat: false }, // 2521
    1979: { date: new Date(1979, 2, 28), zodiac: "มะแม", isAthikamat: false },  // 2522
    1980: { date: new Date(1980, 2, 17), zodiac: "วอก", isAthikamat: true },   // 2523 (อธิกมาส)
    1981: { date: new Date(1981, 3, 5),  zodiac: "ระกา", isAthikamat: false }, // 2524
    1982: { date: new Date(1982, 2, 25), zodiac: "จอ", isAthikamat: false },   // 2525
    1983: { date: new Date(1983, 3, 13), zodiac: "กุน", isAthikamat: true },   // 2526 (อธิกมาส)
    1984: { date: new Date(1984, 3, 1),  zodiac: "ชวด", isAthikamat: false },  // 2527
    1985: { date: new Date(1985, 2, 21), zodiac: "ฉลู", isAthikamat: false },  // 2528
    1986: { date: new Date(1986, 3, 9),  zodiac: "ขาล", isAthikamat: true },   // 2529 (อธิกมาส)
    1987: { date: new Date(1987, 2, 29), zodiac: "เถาะ", isAthikamat: false }, // 2530
    1988: { date: new Date(1988, 2, 18), zodiac: "มะโรง", isAthikamat: false },// 2531
    1989: { date: new Date(1989, 3, 6),  zodiac: "มะเส็ง", isAthikamat: true }, // 2532 (อธิกมาส)
    1990: { date: new Date(1990, 2, 26), zodiac: "มะเมีย", isAthikamat: false },// 2533
    1991: { date: new Date(1991, 2, 16), zodiac: "มะแม", isAthikamat: false },  // 2534
    1992: { date: new Date(1992, 3, 3),  zodiac: "วอก", isAthikamat: true },   // 2535 (อธิกมาส)
    1993: { date: new Date(1993, 2, 23), zodiac: "ระกา", isAthikamat: false }, // 2536
    1994: { date: new Date(1994, 3, 11), zodiac: "จอ", isAthikamat: false },   // 2537
    1995: { date: new Date(1995, 2, 31), zodiac: "กุน", isAthikamat: true },   // 2538 (อธิกมาส)
    1996: { date: new Date(1996, 2, 20), zodiac: "ชวด", isAthikamat: false },  // 2539
    1997: { date: new Date(1997, 3, 8),  zodiac: "ฉลู", isAthikamat: false },    // 2540
    1998: { date: new Date(1998, 2, 28), zodiac: "ขาล", isAthikamat: true },   // 2541 (อธิกมาส)
    1999: { date: new Date(1999, 2, 17), zodiac: "เถาะ", isAthikamat: false }, // 2542
    2000: { date: new Date(2000, 3, 4),  zodiac: "มะโรง", isAthikamat: false },// 2543
    2001: { date: new Date(2001, 2, 25), zodiac: "มะเส็ง", isAthikamat: true }, // 2544 (อธิกมาส)
    2002: { date: new Date(2002, 3, 13), zodiac: "มะเมีย", isAthikamat: false },// 2545
    2003: { date: new Date(2003, 3, 2),  zodiac: "มะแม", isAthikamat: false },  // 2546
    2004: { date: new Date(2004, 2, 21), zodiac: "วอก", isAthikamat: true },   // 2547 (อธิกมาส)
    2005: { date: new Date(2005, 3, 9),  zodiac: "ระกา", isAthikamat: false }, // 2548
    2006: { date: new Date(2006, 2, 29), zodiac: "จอ", isAthikamat: false },   // 2549
    2007: { date: new Date(2007, 2, 19), zodiac: "กุน", isAthikamat: true },   // 2550 (อธิกมาส)
    2008: { date: new Date(2008, 3, 6),  zodiac: "ชวด", isAthikamat: false },  // 2551
    2009: { date: new Date(2009, 2, 26), zodiac: "ฉลู", isAthikamat: false },  // 2552
    2010: { date: new Date(2010, 2, 16), zodiac: "ขาล", isAthikamat: true },   // 2553 (อธิกมาส)
    2011: { date: new Date(2011, 3, 4),  zodiac: "เถาะ", isAthikamat: false }, // 2554
    2012: { date: new Date(2012, 2, 23), zodiac: "มะโรง", isAthikamat: false },// 2555
    2013: { date: new Date(2013, 3, 11), zodiac: "มะเส็ง", isAthikamat: true }, // 2556 (อธิกมาส)
    2014: { date: new Date(2014, 2, 31), zodiac: "มะเมีย", isAthikamat: false },// 2557
    2015: { date: new Date(2015, 2, 20), zodiac: "มะแม", isAthikamat: false },  // 2558
    2016: { date: new Date(2016, 3, 7),  zodiac: "วอก", isAthikamat: true },   // 2559 (อธิกมาส)
    2017: { date: new Date(2017, 2, 28), zodiac: "ระกา", isAthikamat: false, isAthikawan: false }, // 2560
    2018: { date: new Date(2018, 2, 17), zodiac: "จอ",   isAthikamat: false, isAthikawan: false }, // 2561
    2019: { date: new Date(2019, 3, 5),  zodiac: "กุน",  isAthikamat: true,  isAthikawan: false }, // 2562 (8 สองหน)
    2020: { date: new Date(2020, 2, 24), zodiac: "ชวด",  isAthikamat: false, isAthikawan: false }, // 2563
    2021: { date: new Date(2021, 3, 12), zodiac: "ฉลู",  isAthikamat: false, isAthikawan: true  }, // 2564 (อธิกวาร - เดือน 7 มี 30 วัน)
    2022: { date: new Date(2022, 3, 1),  zodiac: "ขาล",  isAthikamat: false, isAthikawan: false }, // 2565 (ปกติมาส ปกติวาร)
    2023: { date: new Date(2023, 2, 22), zodiac: "เถาะ", isAthikamat: true,  isAthikawan: false }, // 2566 (8 สองหน ปกติวาร)
    2024: { date: new Date(2024, 3, 9),  zodiac: "มะโรง", isAthikamat: false, isAthikawan: true  }, // 2567 (อธิกวาร - เดือน 7 มี 30 วัน)
    2025: { date: new Date(2025, 2, 29), zodiac: "มะเส็ง", isAthikamat: false, isAthikawan: false }, // 2568 (ปกติ)
    2026: { date: new Date(2026, 2, 19), zodiac: "มะเมีย", isAthikamat: true,  isAthikawan: false }, // 2569 (8 สองหน)
    2027: { date: new Date(2027, 3, 8),  zodiac: "มะแม",  isAthikamat: false, isAthikawan: false }, // 2570 (ปกติ)
    2028: { date: new Date(2028, 2, 27), zodiac: "วอก",   isAthikamat: false, isAthikawan: true  }, // 2571 (อธิกวาร)
    2029: { date: new Date(2029, 3, 15), zodiac: "ระกา",  isAthikamat: true,  isAthikawan: false }, // 2572 (8 สองหน)
    2030: { date: new Date(2030, 3, 4),  zodiac: "จอ",    isAthikamat: false, isAthikawan: false }, // 2573 (ปกติ)
    2031: { date: new Date(2031, 2, 23), zodiac: "กุน", isAthikamat: true },    // 2574 (อธิกมาส)
    2032: { date: new Date(2032, 3, 10), zodiac: "ชวด", isAthikamat: false },  // 2575
    2033: { date: new Date(2033, 2, 30), zodiac: "ฉลู", isAthikamat: false },  // 2576
    2034: { date: new Date(2034, 2, 20), zodiac: "ขาล", isAthikamat: true },    // 2577 (อธิกมาส)
    2035: { date: new Date(2035, 3, 8),  zodiac: "เถาะ", isAthikamat: false },  // 2578
    2036: { date: new Date(2036, 2, 27), zodiac: "มะโรง", isAthikamat: false }, // 2579
    2037: { date: new Date(2037, 2, 16), zodiac: "มะเส็ง", isAthikamat: true },   // 2580 (อธิกมาส)
    2038: { date: new Date(2038, 3, 4),  zodiac: "มะเมีย", isAthikamat: false }, // 2581
    2039: { date: new Date(2039, 2, 25), zodiac: "มะแม", isAthikamat: true },   // 2582 (อธิกมาส)
    2040: { date: new Date(2040, 3, 12), zodiac: "วอก", isAthikamat: false },  // 2583
    2041: { date: new Date(2041, 3, 1),  zodiac: "ระกา", isAthikamat: false }, // 2584
    2042: { date: new Date(2042, 2, 22), zodiac: "จอ", isAthikamat: true },    // 2585 (อธิกมาส)
    2043: { date: new Date(2043, 3, 10), zodiac: "กุน", isAthikamat: false },  // 2586
    2044: { date: new Date(2044, 2, 30), zodiac: "ชวด", isAthikamat: false },  // 2587
    2045: { date: new Date(2045, 2, 19), zodiac: "ฉลู", isAthikamat: true },    // 2588 (อธิกมาส)
    2046: { date: new Date(2046, 3, 7),  zodiac: "ขาล", isAthikamat: false },  // 2589
    2047: { date: new Date(2047, 2, 27), zodiac: "เถาะ", isAthikamat: false }, // 2590
    2048: { date: new Date(2048, 2, 15), zodiac: "มะโรง", isAthikamat: true },  // 2591 (อธิกมาส)
    2049: { date: new Date(2049, 3, 3),  zodiac: "มะเส็ง", isAthikamat: false }, // 2592
    2050: { date: new Date(2050, 2, 23), zodiac: "มะเมีย", isAthikamat: false }, // 2593
    2051: { date: new Date(2051, 3, 11), zodiac: "มะแม", isAthikamat: true },   // 2594 (อธิกมาส)
    2052: { date: new Date(2052, 2, 31), zodiac: "วอก", isAthikamat: false },  // 2595
    2053: { date: new Date(2053, 2, 20), zodiac: "ระกา", isAthikamat: false }, // 2596
    2054: { date: new Date(2054, 3, 8),  zodiac: "จอ", isAthikamat: true },    // 2597 (อธิกมาส)
    2055: { date: new Date(2055, 2, 29), zodiac: "กุน", isAthikamat: false },  // 2598
    2056: { date: new Date(2056, 2, 18), zodiac: "ชวด", isAthikamat: false },  // 2599
    2057: { date: new Date(2057, 3, 6),  zodiac: "ฉลู", isAthikamat: true }     // 2600 (อธิกมาส)
};



function getThaiLunar(dateInput) {
    const d = new Date(dateInput);
    d.setHours(12, 0, 0);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const time = d.getTime();

    // FIX 1: Guard สำหรับปีที่อยู่นอกช่วง anchor data
    const minYear = Math.min(...Object.keys(THAI_ANCHORS).map(Number));
    const maxYear = Math.max(...Object.keys(THAI_ANCHORS).map(Number));
    if (year < minYear || year > maxYear) {
        console.warn(`getThaiLunar: ปี ${year} อยู่นอกช่วง ${minYear}–${maxYear} ที่รองรับ`);
        return null;
    }

    // สร้าง anchor time ของปีปัจจุบันที่เวลา 12:00:00 เพื่อให้เทียบกันได้พอดี
    const currentAnchorDate = new Date(THAI_ANCHORS[year].date.getTime());
    currentAnchorDate.setHours(12, 0, 0, 0);

    // 1. เลือก Anchor (วันเริ่มปีนักษัตรไทย ขึ้น 1 ค่ำ เดือน 5)
    let anchorYear = year;
    if (time < currentAnchorDate.getTime()) {
        anchorYear = year - 1;
    }

    // FIX 1 (ต่อ): ตรวจ anchorYear ด้วย
    if (!THAI_ANCHORS[anchorYear]) {
        console.warn(`getThaiLunar: ไม่พบ anchor สำหรับปี ${anchorYear}`);
        return null;
    }

    const anchor = THAI_ANCHORS[anchorYear];

    // ตั้งเวลา 12:00:00 ให้เหมือนกับ d เพื่อให้ลบกันแล้วได้จำนวนวันเต็มๆ (ไม่มีเศษทศนิยมตกค้าง)
    const anchorTime = new Date(anchor.date.getTime());
    anchorTime.setHours(12, 0, 0, 0);

    // คำนวณประเภทปีจาก gap ระหว่าง anchor จริง แทนการพึ่ง flag ที่เก็บไว้ (ซึ่งอาจผิดได้)
    let isAthikamat = !!anchor.isAthikamat;
    let isAthikawan = !!anchor.isAthikawan;
    const nextAnchorEntry = THAI_ANCHORS[anchorYear + 1];
    if (nextAnchorEntry) {
        const nextAt = new Date(nextAnchorEntry.date.getTime());
        nextAt.setHours(12, 0, 0, 0);
        const yearDays = Math.round((nextAt - anchorTime) / 86400000);
        isAthikamat = yearDays === 384;
        isAthikawan = yearDays === 355;
    }

    let daysRemaining = Math.round((time - anchorTime.getTime()) / (1000 * 60 * 60 * 24));

    // 2. ตั้งค่าเริ่มต้นการนับเดือน (เริ่มที่เดือน 5)
    let currentMonth = 5;
    let isSecondMonth8 = false;

    // 3. ลูปหักลบจำนวนวันในแต่ละเดือนไทย
    while (true) {
        let daysInMonth;

        if (currentMonth === 8 && isAthikamat) {
            // เดือน 8 ทุกหน (ทั้งหนแรกและหนหลัง) ของปีอธิกมาส มี 30 วัน
            daysInMonth = 30;
        } else if (currentMonth % 2 === 0) {
            // เดือนคู่ปกติ (2, 4, 6, 10, 12) มี 30 วัน
            daysInMonth = 30;
        } else {
            // เดือนคี่ปกติ (1, 3, 5, 7, 9, 11) มี 29 วัน
            daysInMonth = 29;
            if (currentMonth === 7 && isAthikawan) daysInMonth = 30;
        }

        // ตรวจสอบว่าจำนวนวันที่เหลือ "พอ" สำหรับเดือนนี้ไหม
        if (daysRemaining < daysInMonth) break;

        // ถ้าพอ ให้หักลบวันออก แล้วเลื่อนไปเดือนถัดไป
        daysRemaining -= daysInMonth;

        // จัดการเรื่องลำดับเดือน 8 สองหน
        if (currentMonth === 8 && isAthikamat && !isSecondMonth8) {
            isSecondMonth8 = true; // ยังอยู่เดือน 8 แต่เป็นหนที่สอง
        } else {
            isSecondMonth8 = false;
            currentMonth++;
            if (currentMonth > 12) currentMonth = 1;
        }
    }

    // 4. สรุปผล
    let klamTotal = daysRemaining + 1;
    let phase = klamTotal <= 15 ? "ข้างขึ้น" : "ข้างแรม";
    let amount = klamTotal <= 15 ? klamTotal : klamTotal - 15;
    
    // แปลงชื่อเดือน 1 และ 2
    let monthLabel = currentMonth.toString();
    if (currentMonth === 1) monthLabel = "อ้าย (1)";
    if (currentMonth === 2) monthLabel = "ยี่ (2)";
    if (isSecondMonth8) monthLabel = "8-8";

    
    // คำนวณวันพระ (วันธรรมสวนะ)
    let isHolyDay = false;
    if (amount === 8 || amount === 15) {
        isHolyDay = true;
    } else if (amount === 14 && phase === "ข้างแรม") {
        // แรม 14 ค่ำ จะเป็นวันพระก็ต่อเมื่อเดือนนั้นมี 29 วัน
        let daysInThisMonth = 29;
        if (currentMonth === 8 && isAthikamat) {
            daysInThisMonth = 30;
        } else if (currentMonth % 2 === 0) {
            daysInThisMonth = 30;
        } else {
            if (currentMonth === 7 && isAthikawan) daysInThisMonth = 30;
        }
        if (daysInThisMonth === 29) {
            isHolyDay = true;
        }
    }
    
    return {
        phase,
        amount,
        month: monthLabel,
        zodiac: anchor.zodiac,
        fullString: `${phase} ${amount} ค่ำ เดือน ${monthLabel} ปี${anchor.zodiac}`,
        isHolyDay
    };

}


/**
 * ฟังก์ชันแสดงผลบนหน้าจอ
 */
function displayLunar() {
    const dateInput = document.getElementById('checkDate').value;
    if (!dateInput) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกวันที่ก่อนครับ', 'warning');
        return;
    }

    const result = getThaiLunar(dateInput);
    if (!result) return;

    const resultDiv = document.getElementById('lunarResult');
    resultDiv.classList.remove('d-none');

    document.getElementById('resMoonPhase').innerHTML = `✨ ${result.phase} ${result.amount} ค่ำ ✨`;
    document.getElementById('resThaiMonth').innerText = `เดือนทางจันทรคติ: เดือน ${result.month}`;
    document.getElementById('resZodiac').innerText = `ปีนักษัตร: ${result.zodiac}`;
}