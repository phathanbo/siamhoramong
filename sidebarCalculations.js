/**
 * sidebarCalculations.js
 * โมดูลคำนวนแบบอิสระสำหรับแถบด้านข้าง (Sidebar)
 * ใช้สูตรจากไฟล์ต่างๆ เพื่อแสดงผลข้อมูลชั้นสูง
 * 
 * ไม่ต้องพึ่ง index.html หรือหน้าอื่นๆ
 */

"use strict";

const SidebarCalculations = {
    /**
     * ดึงข้อมูลผู้ใช้จาก LocalStorage
     */
    getUserData() {
        return {
            birthDay: localStorage.getItem('birthDay') || '',
            birthDate: localStorage.getItem('birthDate') || '',
            birthTime: localStorage.getItem('birthTime') || '',
            userName: localStorage.getItem('thaiHoroUserName') || 'ผู้มาเยือน',
            birthMonth: localStorage.getItem('birthMonth') || '',
            birthYear: localStorage.getItem('birthYear') || ''
        };
    },

    /**
     * ชุดค่าตัวเลขศาสตร์ไทย (จาก nameAnalysis.js)
     */
    alphabetValues: {
        'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ส': 1, 'า': 1, 'ำ': 1, 'ุ': 1,
        'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2, 'ู': 2,
        'ฆ': 3, 'ต': 3, 'ฑ': 3, 'ฒ': 3,
        'ค': 4, 'ธ': 4, 'ญ': 4, 'ร': 4, 'ะ': 4,
        'ฉ': 5, 'ฌ': 5, 'ฎ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
        'จ': 6, 'ล': 6, 'ว': 6, 'ใ': 6,
        'ซ': 7, 'ศ': 7, 'ษ': 7, 'ี': 7, 'ื': 7, 'เ': 7, 'แ': 7,
        'ย': 8, 'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8, 'ึ': 8, '็': 8,
        'ฏ': 9, 'ฐ': 9, 'ไ': 9, 'โ': 9, 'อ': 9, '์': 9, 'ิ': 9
    },

    /**
     * คำนวณมูลค่าตัวเลขศาสตร์ของชื่อ
     */
    calculateNameNumber(name) {
        if (!name) return 0;
        let sum = 0;
        for (let char of name) {
            sum += this.alphabetValues[char] || 0;
        }
        // ลดรูปเป็นตัวเลขหลักเดียว (ยกเว้น 11, 22, 33)
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return sum;
    },

    /**
     * คำนวณหลักชีวิต (Life Path Number)
     */
    calculateLifePath(date, month, year) {
        if (!date || !month || !year) return null;
        const d = parseInt(date);
        const m = parseInt(month);
        const y = parseInt(year);
        let sum = d + m + y;
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return sum;
    },

    /**
     * ความหมายเลขศาสตร์ (จาก numerology.js)
     */
    fortuneMeanings: {
        1: "แห่งดวงอาทิตย์: มีความเชื่อมั่นสูง มีบารมี ชอบความเป็นหนึ่ง",
        2: "แห่งดวงจันทร์: อ่อนโยน มีจินตนาการสูง เมตตามหานิยม",
        3: "แห่งดาวอังคาร: กล้าหาญ ขยันขันแข็ง รักพวกพ้อง",
        4: "แห่งดาวพุธ: ปฏิภาณไหวพริบ ช่างเจรจา ปรับตัวเก่ง",
        5: "แห่งดาวพฤหัสบดี: ปัญญาเป็นเลิศ ผู้ใหญ่เมตตาเอ็นดู",
        6: "แห่งดาวศุกร์: เด่นด้านศิลปะ ความรัก มีเสน่ห์เหลือล้น",
        7: "แห่งดาวเสาร์: มีความอดทนสูง แบกรับภาระได้ดี",
        8: "แห่งราหู: กล้าได้กล้าเสีย มีลาภลอยกะทันหัน",
        9: "แห่งพระเกตุ: มีสิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาดจากภัย",
        11: "เลขมาสเตอร์: ปัญญาเหนือชั้น มีพรสวรรค์พิเศษ",
        22: "เลขมาสเตอร์บิลเดอร์: สร้างสรรค์โครงการใหญ่ได้สำเร็จ",
        33: "เลขมาสเตอร์ครู: มีคุณธรรม เมตตา ผู้ประเทือนมนุษย์"
    },

    /**
     * ทำนายตามเลขศาสตร์
     */
    getNumberMeaning(num) {
        return this.fortuneMeanings[num] || `เลขมงคล: มีความเป็นเอกตัว มีสัญชาติญาณแข็งกร้าว`;
    },

    /**
     * คำนวณเลขนำโชค (สำหรับวันนี้)
     */
    getLuckyNumbers(birthDate, birthMonth) {
        if (!birthDate || !birthMonth) return ['1', '3', '5', '7', '9'];
        const d = parseInt(birthDate);
        const m = parseInt(birthMonth);
        const today = new Date();
        const luckyBase = (d + m + today.getDate()) % 10;
        return [
            String(luckyBase || 1),
            String((luckyBase + 2) % 10 || 2),
            String((luckyBase + 5) % 10 || 5)
        ];
    },

    /**
     * คำนวณสีมงคล (จาก colors.js)
     */
    getLuckyColors(birthMonth) {
        const monthColors = {
            1: ["แดง", "ส้ม"],
            2: ["ม่วง", "ชมพู"],
            3: ["เหลือง", "ทอง"],
            4: ["เขียว", "เทา"],
            5: ["ขาว", "เงิน"],
            6: ["น้ำเงิน", "น้ำเงินเข้ม"],
            7: ["แดง", "แดงเข้ม"],
            8: ["ดำ", "ม่วง"],
            9: ["แดง", "ส้ม"],
            10: ["ม่วง", "ม่วงเข้ม"],
            11: ["เหลือง", "ทอง"],
            12: ["เขียว", "สีตึงดำ"]
        };
        const colors = monthColors[parseInt(birthMonth)] || ["ขาว", "ทอง"];
        return colors;
    },

    /**
     * ข้อมูลราศีพื้นฐาน (จาก ascendant.js)
     */
    zodiacData: {
        'เมษ': { icon: '♈', element: 'ไฟ', ruler: 'อังคาร', color: '#FF6B6B' },
        'พฤษภ': { icon: '♉', element: 'ดิน', ruler: 'ศุกร์', color: '#A8D8A8' },
        'เมถุน': { icon: '♊', element: 'ลม', ruler: 'พุธ', color: '#FFD93D' },
        'กรกฎ': { icon: '♋', element: 'น้ำ', ruler: 'จันทร์', color: '#6BCFFF' },
        'สิงห์': { icon: '♌', element: 'ไฟ', ruler: 'อาทิตย์', color: '#FFA947' },
        'กันย์': { icon: '♍', element: 'ดิน', ruler: 'พุธ', color: '#B8E0B8' },
        'ตุลย์': { icon: '♎', element: 'ลม', ruler: 'ศุกร์', color: '#FFB7D5' },
        'พิจิก': { icon: '♏', element: 'น้ำ', ruler: 'พระเคราะห์', color: '#9B72CF' },
        'ธนู': { icon: '♐', element: 'ไฟ', ruler: 'พฤหัสบดี', color: '#FF8C69' },
        'มกร': { icon: '♑', element: 'ดิน', ruler: 'เสาร์', color: '#8BA7C7' },
        'กุมภ์': { icon: '♒', element: 'ลม', ruler: 'เสาร์', color: '#7EC8C8' },
        'มีน': { icon: '♓', element: 'น้ำ', ruler: 'พฤหัสบดี', color: '#A0C4FF' }
    },

    /**
     * ตรวจสอบราศีจากวันเกิด
     */
    getZodiacSign(date, month) {
        if (!date || !month) return null;
        const d = parseInt(date);
        const m = parseInt(month);

        const zodiacRanges = [
            { sign: 'เมษ', start: [21, 3], end: [19, 4] },
            { sign: 'พฤษภ', start: [20, 4], end: [20, 5] },
            { sign: 'เมถุน', start: [21, 5], end: [20, 6] },
            { sign: 'กรกฎ', start: [21, 6], end: [22, 7] },
            { sign: 'สิงห์', start: [23, 7], end: [22, 8] },
            { sign: 'กันย์', start: [23, 8], end: [22, 9] },
            { sign: 'ตุลย์', start: [23, 9], end: [22, 10] },
            { sign: 'พิจิก', start: [23, 10], end: [21, 11] },
            { sign: 'ธนู', start: [22, 11], end: [21, 12] },
            { sign: 'มกร', start: [22, 12], end: [19, 1] },
            { sign: 'กุมภ์', start: [20, 1], end: [18, 2] },
            { sign: 'มีน', start: [19, 2], end: [20, 3] }
        ];

        for (let zod of zodiacRanges) {
            const [startD, startM] = zod.start;
            const [endD, endM] = zod.end;

            if (startM === endM) {
                if (m === startM && d >= startD && d <= endD) return zod.sign;
            } else {
                if ((m === startM && d >= startD) || (m === endM && d <= endD)) return zod.sign;
            }
        }
        return null;
    },

    /**
     * ทำนายประจำวันตามราศี
     */
    getDailyFortuneForZodiac(zodiacSign) {
        const dailyFortunes = {
            'เมษ': 'วันนี้พลังของคุณอยู่ในจุดสูงสุด เหมาะสำหรับการเริ่มต้นโครงการใหม่',
            'พฤษภ': 'ค่อนข้างเรียบ ร้อย แต่ให้ความสำคัญกับการออมและการวางแผน',
            'เมถุน': 'ความสื่อสารจะดีเยี่ยม เหมาะสำหรับการเจรจาหรือการขาย',
            'กรกฎ': 'อารมณ์ของคุณอาจแกว่งได้บ้าง พักผ่อนให้เพียงพอและคนใกล้ชิด',
            'สิงห์': 'วันดีสำหรับการโดดเด่นและเป็นศูนย์กลาง จงแสดงความยิ่งใหญ่ของคุณ',
            'กันย์': 'วันแห่งการรวบรวมและวิเคราะห์ คิดให้ระมัดระวังก่อนตัดสินใจ',
            'ตุลย์': 'วันมงคลสำหรับความสัมพันธ์ การประนีประนวม และความสตุลยา',
            'พิจิก': 'อยากให้เหล่าเลือกสรรและไตรตรวจสิ่งต่างๆ อย่ารีบร้อน',
            'ธนู': 'วันแห่งการขยายและการเรียนรู้ สิ่งใหม่กำลังรอคุณอยู่',
            'มกร': 'วันของการบริหารและการปฏิบัติ ให้ความเข้มข้นกับงานที่สำคัญ',
            'กุมภ์': 'วันแห่งอิสระและนวัตกรรม พิจารณาแนวทางใหม่เพื่อปัญหาเก่า',
            'มีน': 'วันแห่งความคิดสร้างสรรค์และจินตนาการ ฟังใจลึกของคุณ'
        };
        return dailyFortunes[zodiacSign] || 'พลังของดาวพยักษ์ส่งสัญญาณดีๆ มาหาคุณ';
    },

    /**
     * รวมข้อมูลสรุปผู้ใช้
     */
    getUserSummary() {
        const user = this.getUserData();
        const nameNum = this.calculateNameNumber(user.userName);
        const lifePath = this.calculateLifePath(user.birthDate, user.birthMonth, user.birthYear);
        const zodiac = this.getZodiacSign(user.birthDate, user.birthMonth);
        const luckyNums = this.getLuckyNumbers(user.birthDate, user.birthMonth);
        const luckyColors = this.getLuckyColors(user.birthMonth);
        const dailyFortune = zodiac ? this.getDailyFortuneForZodiac(zodiac) : '';

        return {
            name: user.userName,
            nameNumber: nameNum,
            nameNumberMeaning: this.getNumberMeaning(nameNum),
            lifePath: lifePath,
            lifePathMeaning: lifePath ? this.getNumberMeaning(lifePath) : '',
            zodiac: zodiac,
            zodiacIcon: zodiac ? this.zodiacData[zodiac].icon : '?',
            zodiacElement: zodiac ? this.zodiacData[zodiac].element : '',
            zodiacColor: zodiac ? this.zodiacData[zodiac].color : '#94a3b8',
            luckyNumbers: luckyNums,
            luckyColors: luckyColors,
            dailyFortune: dailyFortune,
            birthDate: user.birthDate,
            birthMonth: user.birthMonth,
            birthYear: user.birthYear
        };
    }
};

// Export หากใช้ Node.js หรือ Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarCalculations;
}
