/**
 * 🌟 Thai Astrology Data - รวมข้อมูลทั้งหมด
 * อ้างอิง: ลัคนา + ดาว 9 + ธาตุ 5 + บ้าน 12
 */

"use strict";

// ========== ดาว 9 ดวง ==========
const PLANETS_DATA = {
    1: {
        name: "อาทิตย์",
        thaiName: "ดาวอาทิตย์",
        symbol: "☀️",
        dayName: "วันอาทิตย์",
        element: "ไฟ",
        direction: "ใต้",
        color: "แดง",
        number: 1,
        character: "มีนำ มีจิตสำนึก หมั่นเพียร",
        strength: "ผู้นำ บริหารจัดการ",
        weakness: "มีอิสระสูง อาจจำแนก"
    },
    2: {
        name: "จันทร์",
        thaiName: "ดาวจันทร์",
        symbol: "🌙",
        dayName: "วันจันทร์",
        element: "น้ำ",
        direction: "เหนือ",
        color: "ขาว",
        number: 2,
        character: "อ่อนโยน หวังแหวน มีสัญชาติ",
        strength: "บุคลิกจริงใจ ศิลปะ",
        weakness: "อารมณ์ไม่เสถียร ใจอ่อนง่าย"
    },
    3: {
        name: "พฤหัสบดี",
        thaiName: "ดาวพฤหัสบดี",
        symbol: "♃",
        dayName: "วันพฤหัสบดี",
        element: "ไม้",
        direction: "ตะวันออกเฉียงเหนือ",
        color: "เหลือง",
        number: 3,
        character: "เจริญและสำเร็จ โชคดีตามธรรมชาติ",
        strength: "การศึกษา ศาสนา",
        weakness: "อาจมีอคติ"
    },
    5: {
        name: "พุธ",
        thaiName: "ดาวพุธ",
        symbol: "☿️",
        dayName: "วันพุธ",
        element: "ดิน",
        direction: "ตรงกลาง",
        color: "เขียว",
        number: 5,
        character: "ปัญญา การคิด การสื่อสาร",
        strength: "ทักษะปฏิบัติ ธุรกิจ",
        weakness: "ความกระสับกระส่าย"
    },
    6: {
        name: "ศุกร์",
        thaiName: "ดาวศุกร์",
        symbol: "♀",
        dayName: "วันศุกร์",
        element: "โลหะ",
        direction: "ตะวันตก",
        color: "ขาว",
        number: 6,
        character: "ความสุข ความงาม การศิลป์",
        strength: "ความมีเสน่ห์ ศิลปะ",
        weakness: "อาจหลงตัวเอง"
    },
    8: {
        name: "เสาร์",
        thaiName: "ดาวเสาร์",
        symbol: "♄",
        dayName: "วันเสาร์",
        element: "ดิน",
        direction: "ตะวันออกเฉียงใต้",
        color: "ดำ",
        number: 8,
        character: "ความจริง ความเด็ดเดี่ยว ความอดทน",
        strength: "ความมั่นคง มีหลักการ",
        weakness: "ก้อกด้าน"
    },
    9: {
        name: "อังคาร",
        thaiName: "ดาวอังคาร",
        symbol: "♂",
        dayName: "วันอังคาร",
        element: "ไฟ",
        direction: "ตะวันออก",
        color: "แดง",
        number: 9,
        character: "ความกล้าหาญ พลัง ความรุ่งเรือง",
        strength: "สู้ชีวิต มีกำลังใจ",
        weakness: "อารมณ์ร้อน"
    }
};

// ========== ธาตุ 5 ประการ ==========
const ELEMENTS_DATA = {
    0: {
        name: "ไม้",
        element: "Wood",
        symbol: "♻️",
        color: "เขียว",
        number: 3,
        influence: "เจริญงอก เติบโต ปราณีอ่อนไหว",
        opposite: "โลหะ",
        luckyColor: "เขียว",
        avoidColor: "ขาว"
    },
    1: {
        name: "ไฟ",
        element: "Fire",
        symbol: "🔥",
        color: "แดง",
        number: 9,
        influence: "ร้อนรุ่ง เปี่ยมป้อมอำนาจ ใจเด็ด",
        opposite: "น้ำ",
        luckyColor: "แดง",
        avoidColor: "ดำ"
    },
    2: {
        name: "ดิน",
        element: "Earth",
        symbol: "🏔️",
        color: "เหลือง",
        number: 5,
        influence: "มั่นคง สุบิน ผู้ฟังคำสั่ง",
        opposite: "ไม้",
        luckyColor: "เหลือง",
        avoidColor: "เขียว"
    },
    3: {
        name: "โลหะ",
        element: "Metal",
        symbol: "⚔️",
        color: "ขาว",
        number: 7,
        influence: "เข้มแข็ง กระตุกตัว ทะเบียน",
        opposite: "ไฟ",
        luckyColor: "ขาว",
        avoidColor: "แดง"
    },
    4: {
        name: "น้ำ",
        element: "Water",
        symbol: "💧",
        color: "ดำ/น้ำเงิน",
        number: 1,
        influence: "ไหลเบา ซึ่งเขินเศร้า สลิดลับ",
        opposite: "ดิน",
        luckyColor: "ดำ",
        avoidColor: "เหลือง"
    }
};

// ========== 12 ปีนักษัตร + ธาตุ ==========
const ZODIAC_ANIMAL_DATA = {
    0: { animal: "หนู", name: "ปีชวด", element: "น้ำ", elementObj: ELEMENTS_DATA[4], years: [1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
    1: { animal: "วัว", name: "ปีฉลู", element: "ดิน", elementObj: ELEMENTS_DATA[2], years: [1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
    2: { animal: "เสือ", name: "ปีขาล", element: "ไม้", elementObj: ELEMENTS_DATA[0], years: [1902, 1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
    3: { animal: "กระต่าย", name: "ปีเถาะ", element: "ไม้", elementObj: ELEMENTS_DATA[0], years: [1903, 1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
    4: { animal: "มังกร", name: "ปีมโหรี", element: "ดิน", elementObj: ELEMENTS_DATA[2], years: [1904, 1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
    5: { animal: "งู", name: "ปีมะเส็ง", element: "ไฟ", elementObj: ELEMENTS_DATA[1], years: [1905, 1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
    6: { animal: "ม้า", name: "ปีมังกรต่ำ", element: "ไฟ", elementObj: ELEMENTS_DATA[1], years: [1906, 1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
    7: { animal: "แพะ", name: "ปีแกะ", element: "ดิน", elementObj: ELEMENTS_DATA[2], years: [1907, 1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
    8: { animal: "ลิง", name: "ปีวอก", element: "โลหะ", elementObj: ELEMENTS_DATA[3], years: [1908, 1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
    9: { animal: "ไก่", name: "ปีระกา", element: "โลหะ", elementObj: ELEMENTS_DATA[3], years: [1909, 1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
    10: { animal: "สุนัข", name: "ปีสุนัข", element: "ดิน", elementObj: ELEMENTS_DATA[2], years: [1910, 1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
    11: { animal: "หมู", name: "ปีกุน", element: "น้ำ", elementObj: ELEMENTS_DATA[4], years: [1911, 1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] }
};

// ========== บ้าน 12 บ้าน ==========
const HOUSES_DATA = {
    1: { name: "บ้าน 1 (ตนะ)", meaning: "บุคลิกภาพ รูปร่าง ลักษณะบุคลิก" },
    2: { name: "บ้าน 2 (ธนะ)", meaning: "การเงิน ทรัพย์สิน ครอบครัว" },
    3: { name: "บ้าน 3 (สหจะ)", meaning: "พี่น้อง ปัญชา การเยี่ยม" },
    4: { name: "บ้าน 4 (สุขะ)", meaning: "บ้าน ที่อยู่ อสังหาริมทรัพย์" },
    5: { name: "บ้าน 5 (บุตร)", meaning: "บุตร การศึกษา ความรัก ศิลปะ" },
    6: { name: "บ้าน 6 (สาธุ)", meaning: "โรค ศัตรู ปัญหา บริการ" },
    7: { name: "บ้าน 7 (สัปตม)", meaning: "คู่สัญญา แต่งงาน สัมพันธ์" },
    8: { name: "บ้าน 8 (ฤติ)", meaning: "สุขภาพ ความยาว ความลึกลับ" },
    9: { name: "บ้าน 9 (ทนะ)", meaning: "ศาสนา ปัญญา โภคนายก" },
    10: { name: "บ้าน 10 (กรรม)", meaning: "อาชีพ ผู้ใหญ่ สังคม" },
    11: { name: "บ้าน 11 (ลาภะ)", meaning: "รายได้ ความสุข มิตรภาพ" },
    12: { name: "บ้าน 12 (ยยะ)", meaning: "สูญเสีย จากไป ความลับ" }
};

// ========== ฟังก์ชันช่วยคำนวณ ==========
function getPlanetByBirthDay(birthDay) {
    const planetNum = (birthDay % 9) || 9;
    return { num: planetNum, data: PLANETS_DATA[planetNum] };
}

function getZodiacByYear(year) {
    const yearAD = year > 2400 ? year - 543 : year;
    const zodiacIndex = (yearAD - 1900) % 12;
    return { index: zodiacIndex, data: ZODIAC_ANIMAL_DATA[zodiacIndex] };
}

function getElementByYear(year) {
    const yearAD = year > 2400 ? year - 543 : year;
    const elementIndex = (yearAD - 1900) % 5;
    return { index: elementIndex, data: ELEMENTS_DATA[elementIndex] };
}

function getHouseByMonthAndDay(month, day) {
    const houseNum = ((month - 1 + Math.floor((day - 1) / 10)) % 12) + 1;
    return { num: houseNum, data: HOUSES_DATA[houseNum] };
}

// ========== ส่งออก ==========
window.ThaiAstrologyData = {
    PLANETS_DATA,
    ELEMENTS_DATA,
    ZODIAC_DATA,
    HOUSES_DATA,
    getPlanetByBirthDay,
    getZodiacByYear,
    getElementByYear,
    getHouseByMonthAndDay
};

