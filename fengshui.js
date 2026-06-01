/**
 * 🏠 ฮวงจุ้ยตามหลักแท้ (Feng Shui) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ธาตุ 5 ประการ (Wu Xing): ไม้ไฟดินโลหะน้ำ
 * - ดาว 9 ดวง (Astrology): thai-astrology.js
 * - ทิศมงคล: อิงจากปี + ธาตุ + ดาว
 *
 * หลักการ:
 * 1. ปีเกิด → ธาตุ 5 ประการ (ปี % 5)
 * 2. วันเกิด → ดาว 9 ดวง (วัน % 9)
 * 3. ธาตุ + ดาว → ทิศมงคล + สีมงคล + ธาตุลงทุน
 */

"use strict";

// ธาตุ 5 ประการ (Wu Xing)
const ELEMENT_FENGSHUI = {
    0: { name: "ไม้", color: "เขียว", colors: ["เขียว", "ฟ้า"], numbers: [3, 8], symbol: "♻️", luckyDirection: "ตะวันออก" },
    1: { name: "ไฟ", color: "แดง", colors: ["แดง", "ส้ม"], numbers: [9], symbol: "🔥", luckyDirection: "ใต้" },
    2: { name: "ดิน", color: "เหลือง", colors: ["เหลือง", "น้ำตาล"], numbers: [5], symbol: "🏔️", luckyDirection: "ตรงกลาง" },
    3: { name: "โลหะ", color: "ขาว", colors: ["ขาว", "เงิน"], numbers: [7], symbol: "⚔️", luckyDirection: "ตะวันตก" },
    4: { name: "น้ำ", color: "ดำ/น้ำเงิน", colors: ["ดำ", "น้ำเงิน"], numbers: [1], symbol: "💧", luckyDirection: "เหนือ" }
};

// โชคลาภรวมของเดือน (อิงจากธาตุประจำเดือน)
const MONTHLY_FORTUNE_LEVEL = {
    "ไม้": { level: "ดี", fortune: "⭐⭐⭐⭐", text: "พลังเจริญ เข้ากับการงานใหม่" },
    "ไฟ": { level: "ดี", fortune: "⭐⭐⭐⭐", text: "พลังสว่าง โชคลาภดี ก้าวหน้าเร็ว" },
    "ดิน": { level: "ปกติ", fortune: "⭐⭐⭐", text: "พลังมั่นคง เสถียร ต้องพยายาม" },
    "โลหะ": { level: "ดี", fortune: "⭐⭐⭐⭐", text: "พลังเข้มแข็ง การเงินดี" },
    "น้ำ": { level: "ดี", fortune: "⭐⭐⭐⭐⭐", text: "พลังปรับตัวได้ โชคลาภสูง เจริญรุ่งเรือง" }
};

// สัตว์นักษัตรที่เข้ากับเดือน (อิงธาตุ)
const ZODIAC_COMPATIBILITY = {
    "ไม้": { animals: ["หนู", "เสือ", "กระต่าย"], description: "ปีสัตว์แบบไม้ มีพลังสนับสนุน" },
    "ไฟ": { animals: ["งู", "ม้า"], description: "ปีสัตว์แบบไฟ เข้าข้อมูลเดือนนี้" },
    "ดิน": { animals: ["วัว", "มังกร", "แพะ", "สุนัข"], description: "ปีสัตว์แบบดิน มั่นคง" },
    "โลหะ": { animals: ["ลิง", "ไก่"], description: "ปีสัตว์แบบโลหะ เข้มแข็ง" },
    "น้ำ": { animals: ["หนู", "หมู"], description: "ปีสัตว์แบบน้ำ ปรับตัวได้" }
};

// พืชมงคลตามธาตุ (อิงธาตุและความหมายสัญลักษณ์)
const AUSPICIOUS_PLANTS = {
    "ไม้": {
        plants: ["ต้นไม้สูงใหญ่", "ต้นมะนาว", "ต้นมะไฟ"],
        description: "ต้นไม้ขึ้นแข็งแรง สัญลักษณ์การเจริญ"
    },
    "ไฟ": {
        plants: ["ดอกกุหลาบแดง", "บัวแดง", "ดาวแดง"],
        description: "ดอกไม้แดงสัญลักษณ์ความกล้าหาญ พลัง"
    },
    "ดิน": {
        plants: ["มะเขือ", "มะมุม", "ต้นยางอินเดีย"],
        description: "พืชเสถียร สัญลักษณ์ความมั่นคง"
    },
    "โลหะ": {
        plants: ["ดอกมะลิ", "กุหลาบขาว", "ออร์คิดขาว"],
        description: "ดอกไม้ขาวสัญลักษณ์ความบริสุทธิ์ เข้มแข็ง"
    },
    "น้ำ": {
        plants: ["ต้นมะปรางต้นรูปปลา", "ไร้มะนาว", "ต้นหญ้าลมหายใจ"],
        description: "พืชปรับตัวได้ สัญลักษณ์ความยืดหยุ่น"
    }
};

// รสชาติอาหารมงคลตามธาตุ (อิงสมดุลธาตุ 5)
const LUCKY_FOOD_FLAVORS = {
    "ไม้": {
        flavor: "เปรี้ยว",
        foods: ["ส้มควัน", "มะขาม", "เลมอนสดชื่น"],
        description: "รสเปรี้ยวช่วยกระตุ้นพลังเจริญ"
    },
    "ไฟ": {
        flavor: "ขม",
        foods: ["ชาดำ", "โกโก้", "กาแฟเข้มข้น"],
        description: "รสขมกระตุ้นพลังและความกล้า"
    },
    "ดิน": {
        flavor: "หวาน",
        foods: ["น้ำเต้า", "มันหวาน", "คุกกี้หวาน"],
        description: "รสหวานสร้างความสุข สมดุล"
    },
    "โลหะ": {
        flavor: "เค็ม",
        foods: ["เกลือแห้ง", "แหนม", "ปูเค็ม"],
        description: "รสเค็มเสริมความเข้มแข็งเสถียร"
    },
    "น้ำ": {
        flavor: "เค็มเปรี้ยว",
        foods: ["น้ำปลา", "แจ่วฮ้อ", "เกาลัด"],
        description: "รสเค็มเปรี้ยวสร้างสมดุล"
    }
};

// ระดับกลาง: ความเสี่ยงของเดือน (อิงจากการขัดแย้งธาตุ)
const RISK_LEVEL = {
    "ไม้": { level: "🟢 ต่ำ", percentage: "20-30%", text: "ปลอดภัย ระวังเพียงเล็กน้อย" },
    "ไฟ": { level: "🟡 กลาง", percentage: "40-50%", text: "ต้องระมัดระวังน้ำและของเหลว" },
    "ดิน": { level: "🟢 ต่ำ", percentage: "10-20%", text: "ปลอดภัยที่สุด ดินเป็นกลาง" },
    "โลหะ": { level: "🟡 กลาง", percentage: "40-50%", text: "ต้องระมัดระวังไฟและความร้อน" },
    "น้ำ": { level: "🟡 กลาง", percentage: "30-40%", text: "ต้องระมัดระวังดินและสิ่งมั่นคง" }
};

// ระดับกลาง: วัตถุเสริมมงคล (อิงธาตุและตำรากำจัดเคราะห์)
const AUSPICIOUS_OBJECTS = {
    "ไม้": {
        objects: ["ต้นไม้สด", "รูปไม้ตัดปลูก", "บอนไซ", "ศิลปะไม้"],
        description: "วัตถุจากไม้เสริมพลังเจริญ"
    },
    "ไฟ": {
        objects: ["เทียนแดง", "โคมไฟ", "หลอดไฟแดง", "รูปดาว"],
        description: "วัตถุไฟเสริมพลังและสว่าง"
    },
    "ดิน": {
        objects: ["หินแร่", "ผลึกควอตซ์", "เซรามิก", "ดินเหนียวปั้น"],
        description: "วัตถุดินเสริมเสถียรและมั่นคง"
    },
    "โลหะ": {
        objects: ["เหรียญโชค", "กระดิ่งทองแดง", "รูปทองเหลืองเด็ก", "จี้โลหะ"],
        description: "วัตถุโลหะเสริมความเข้มแข็ง"
    },
    "น้ำ": {
        objects: ["น้ำพุ", "ตู้ปลา", "ความเหนียวน้ำ", "รูปสัตว์น้ำ"],
        description: "วัตถุน้ำเสริมการไหลและปรับตัว"
    }
};

// ระดับกลาง: ส่วนกายที่ต้องดูแล (อิงจาก 5 Elements medicine)
const BODY_PARTS_TO_CARE = {
    "ไม้": {
        organs: ["ตับ", "ตา", "เอ็น", "โลหิต"],
        symptoms: "อาจเจ็บท้อง ปัญหาด้านตา หรืออารมณ์ไม่สดชื่น",
        care: "ดื่มน้ำเปลี่ยวให้มากพอ ออกกำลังกายสม่ำเสมอ หลีกเลี่ยงความเครียด"
    },
    "ไฟ": {
        organs: ["หัวใจ", "ลิ้น", "ลำไส้เล็ก", "เลือด"],
        symptoms: "อาจมีปัญหาหัวใจ นอนไม่หลับ หรือปากหำหามอาหาร",
        care: "นอนให้พอ เสริมวิตามิน ลดความร้อนโกรธ ดื่มน้ำเย็น"
    },
    "ดิน": {
        organs: ["ม้าม", "ท้อง", "ปาก", "กล้ามเนื้อ"],
        symptoms: "อาจท้องเสีย เหนื่อย หรือปัญหาระบบย่อยอาหาร",
        care: "ทานอาหารสม่ำเสมอ หลีกเลี่ยงความเครียด บริหารร่างกาย"
    },
    "โลหะ": {
        organs: ["ปอด", "ลำไส้ใหญ่", "ผิวหนัง", "จมูก"],
        symptoms: "อาจซึมหรือหอบ ปัญหาผิวหนัง หรือภูมิแพ้",
        care: "หลีกเลี่ยงมลภาวะ ดูแลผิวหนัง หายใจเชื่อมั่น"
    },
    "น้ำ": {
        organs: ["ไต", "膀胱", "หู", "กระดูก"],
        symptoms: "อาจเมื่อยล้า ปัญหาการได้ยิน หรือเบื่อ",
        care: "นอนให้เพียงพอ หลีกเลี่ยงเย็นจัด อุ่นร่างกายดี"
    }
};

// กิจกรรมห้ามตามธาตุ (ตรงข้ามกับสิ่งที่ดี)
const FORBIDDEN_ACTIVITIES = {
    "ไม้": [
        "❌ ห้ามตัดต้นไม้หรือทำลายสัตว์เลี้ยง",
        "❌ ห้ามใช้เครื่องมือโลหะตัดสิ่งของ",
        "❌ ห้ามการปรับปรุงลำเลียงหรือการตัดแต่งกิ่ง",
        "❌ ห้ามขุดดิน หรือการก่อสร้างลึก"
    ],
    "ไฟ": [
        "❌ ห้ามจัดงานเกี่ยวกับน้ำหรือสระว่ายน้ำ",
        "❌ ห้ามการโลดแลนน้ำ หรือการล่องเรือ",
        "❌ ห้ามวางสิ่งของใกล้แหล่งน้ำ",
        "❌ ห้ามการซ่อมแซมหลังคา หรือบ้านสูง"
    ],
    "ดิน": [
        "❌ ห้ามปลูกต้นไม้ ใหญ่ๆ อยู่ใกล้บ้าน",
        "❌ ห้ามดำเนินการเกี่ยวกับการขึ้นบ้าน",
        "❌ ห้ามการจัดวางสิ่งของจำนวนมาก",
        "❌ ห้ามการรีโนเวทบ้านเต็มหลัง"
    ],
    "โลหะ": [
        "❌ ห้ามการเผาไฟ หรือการปรุงอาหารใหญ่",
        "❌ ห้ามการสีทาบ้านแดง ส้ม",
        "❌ ห้ามการติดตั้งเทียนหรือหลอดไฟสีแดง",
        "❌ ห้ามการทำงานเกี่ยวกับไม้ใหญ่"
    ],
    "น้ำ": [
        "❌ ห้ามการปรับปรุงหรือสร้างเสริมบ้าน",
        "❌ ห้ามการตัดต้นไม้ใหญ่ หรือดิน",
        "❌ ห้ามการเก็บของหลายๆ ที่",
        "❌ ห้ามการสร้างพื้นหรือลูกตาข่ายใหม่"
    ]
};

// ดาว 9 ดวง และทิศมงคลที่เกี่ยวข้อง
const PLANET_DIRECTION = {
    1: { name: "อาทิตย์", direction: "ใต้", element: "ไฟ" },
    2: { name: "จันทร์", direction: "เหนือ", element: "น้ำ" },
    3: { name: "พฤหัสบดี", direction: "ตะวันออกเฉียงเหนือ", element: "ไม้" },
    4: { name: "พุธ", direction: "ตะวันตกเฉียงเหนือ", element: "โลหะ" },
    5: { name: "พุธ (ร่วม)", direction: "ตรงกลาง", element: "ดิน" },
    6: { name: "ศุกร์", direction: "ตะวันตก", element: "โลหะ" },
    7: { name: "เสาร์", direction: "ตะวันออกเฉียงใต้", element: "ดิน" },
    8: { name: "เสาร์", direction: "ตะวันตกเฉียงใต้", element: "ดิน" },
    9: { name: "อังคาร", direction: "ตะวันออก", element: "ไม้" }
};

// ความเข้ากันระหว่างธาตุ
const ELEMENT_COMPATIBILITY = {
    "ไม้": { support: "น้ำ", suppress: "โลหะ", avoid: "โลหะ" },
    "ไฟ": { support: "ไม้", suppress: "น้ำ", avoid: "น้ำ" },
    "ดิน": { support: "ไฟ", suppress: "ไม้", avoid: "ไม้" },
    "โลหะ": { support: "ดิน", suppress: "ไฟ", avoid: "ไฟ" },
    "น้ำ": { support: "โลหะ", suppress: "ดิน", avoid: "ดิน" }
};

// ระดับลึก: ดาวประจำเดือน (อิงจากลัคนา + เดือน)
const MONTHLY_PLANETS = {
    "ไม้": {
        planet: "พฤหัสบดี (Jupiter)",
        symbol: "♃",
        impact: "ปัญญา โชค การเจริญ",
        activities: "ดีสำหรับ: การศึกษา บูชาพระ ตัดสินใจใหญ่",
        caution: "ระวัง: การออกเดินทาง ความโล่ง"
    },
    "ไฟ": {
        planet: "อาทิตย์ (Sun)",
        symbol: "☀️",
        impact: "พลัง แสง ความสำเร็จ",
        activities: "ดีสำหรับ: การเปิดตัวใหม่ งานเปิด ตัดสินใจเด่น",
        caution: "ระวัง: ความเหนื่อยล้า การทะเลาะวิวาท"
    },
    "ดิน": {
        planet: "ม้าม (Saturn)",
        symbol: "♄",
        impact: "เสถียร มั่นคง โครงสร้าง",
        activities: "ดีสำหรับ: ก่อสร้าง ซ่อมแซม การสะสม",
        caution: "ระวัง: ความล่าช้า ปัญหาเก่าขึ้นมา"
    },
    "โลหะ": {
        planet: "ศุกร์ (Venus)",
        symbol: "♀",
        impact: "ความงาม ความรัก การเงิน",
        activities: "ดีสำหรับ: การแต่งตัว อาหาร ความสัมพันธ์",
        caution: "ระวัง: ความสำราญจนเกินไป การใช้จ่ายเกิน"
    },
    "น้ำ": {
        planet: "พุธ (Mercury)",
        symbol: "☿️",
        impact: "สื่อสาร ปัญญา การเจรจา",
        activities: "ดีสำหรับ: การเดินทาง การค้า การติดต่อ",
        caution: "ระวัง: สับสน ข้อมูลผิด ความเหงา"
    }
};

// ระดับลึก: วิธีเสริมพลังมงคล (authentic practices)
const ENHANCEMENT_METHODS = {
    "ไม้": {
        rituals: ["ไหว้ธรรมชาติ/ต้นไม้", "ทำบุญปลูกป่า", "สวดมนต์ 108 ครั้ง"],
        feng_shui: ["วางต้นไม้สด", "ใช้สีเขียว/ฟ้า", "วางของทิศตะวันออก"],
        charity: "บริจาคหนังสือ สนับสนุนการศึกษา"
    },
    "ไฟ": {
        rituals: ["ไหว้พระ จุดเทียนแดง", "ทำบุญศาสนา", "สวดมนต์เช้า"],
        feng_shui: ["วางเทียน โคมไฟ", "ใช้สีแดง/ส้ม", "เปิดหน้าต่างหลังคา"],
        charity: "บริจาคอาหาร สนับสนุนวัด"
    },
    "ดิน": {
        rituals: ["ไหว้พื้นดิน/ท้องฟ้า", "ทำบุญเลี้ยงสัตว์", "สวดมนต์บ่าย"],
        feng_shui: ["วางหินแร่/ผลึก", "ใช้สีเหลือง/น้ำตาล", "ตั้งพื้นที่ศูนย์กลาง"],
        charity: "บริจาคสิ่งของ สนับสนุนชุมชน"
    },
    "โลหะ": {
        rituals: ["ไหว้ศาสตร์ พระ", "ทำบุญจำสำนัก", "สวดมนต์เยน"],
        feng_shui: ["วางกระดิ่ง/เหรียญ", "ใช้สีขาว/เงิน", "เก็บความสะอาด"],
        charity: "บริจาคเงิน สนับสนุนศาสตร์"
    },
    "น้ำ": {
        rituals: ["ไหว้เจ้าน้ำ/ปลา", "ปล่อยสัตว์น้ำ", "สวดมนต์ค่ำ"],
        feng_shui: ["วางน้ำพุ/ตู้ปลา", "ใช้สีดำ/น้ำเงิน", "ไหลเวียนอากาศ"],
        charity: "บริจาคเมล็ดพืช สนับสนุนสิ่งแวดล้อม"
    }
};

// ระดับลึก: ความขัดแย้งปีนักษัตร (authentic zodiac conflicts)
const ZODIAC_CONFLICTS = {
    "ไม้": {
        animals: ["หนู", "เสือ", "กระต่าย"],
        conflict_with: ["วัว", "ลิง"],
        reason: "โลหะขัดไม้ ดินสลายไม้",
        impact: "อาจมีปัญหาด้านการงาน ความสัมพันธ์"
    },
    "ไฟ": {
        animals: ["งู", "ม้า"],
        conflict_with: ["หนู", "หมู"],
        reason: "น้ำดับไฟ เกิดความขัดแย้ง",
        impact: "ต้องระวังการสูญเสีย ความหวังแตกหัก"
    },
    "ดิน": {
        animals: ["วัว", "มังกร", "แพะ", "สุนัข"],
        conflict_with: ["เสือ", "กระต่าย"],
        reason: "ไม้ลำเลียงดิน ความไม่มั่นคง",
        impact: "อาจมีปัญหาเงิน บ้านเรือน"
    },
    "โลหะ": {
        animals: ["ลิง", "ไก่"],
        conflict_with: ["งู", "ม้า"],
        reason: "ไฟหลอมโลหะ ความแตกแยก",
        impact: "ต้องระวังการหลงผิด ความเสื่อม"
    },
    "น้ำ": {
        animals: ["หนู", "หมู"],
        conflict_with: ["มังกร", "แพะ"],
        reason: "ดินกั้นน้ำ ความติดขัด",
        impact: "อาจมีปัญหาการเดินทาง การทำงาน"
    }
};

/**
 * 🎯 แสดงหน้า Feng Shui
 */
function showFengShuiPage() {
    const container = document.getElementById('fengShuiPage');
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🏠 ฮวงจุ้ยตามหลักแท้</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากธาตุ 5 + ดาว 9 ดวง</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                                <input type="date" id="fengshuiBirthday" class="form-control form-control-lg">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>🏠 ทิศบ้านปัจจุบัน <span class="text-danger">*</span></strong></label>
                                <select id="fengshuiSittingDir" class="form-control form-control-lg">
                                    <option value="">-- เลือกทิศหลังบ้าน --</option>
                                    <option value="N">⬆️ เหนือ</option>
                                    <option value="NE">⬈️ ตะวันออกเฉียงเหนือ</option>
                                    <option value="E">➡️ ตะวันออก</option>
                                    <option value="SE">⬉️ ตะวันออกเฉียงใต้</option>
                                    <option value="S">⬇️ ใต้</option>
                                    <option value="SW">⬋️ ตะวันตกเฉียงใต้</option>
                                    <option value="W">⬅️ ตะวันตก</option>
                                    <option value="NW">⬉️ ตะวันตกเฉียงเหนือ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeFengShui()">
                        <i class="fas fa-compass"></i> วิเคราะห์ฮวงจุ้ย
                    </button>
                </form>

                <div id="fengshuiResult" class="mt-4"></div>

                <hr class="my-4">
                <div class="row">
                    <div class="col-6">
                        <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                            <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                            <i class="fas fa-home"></i> กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 🔍 วิเคราะห์ฮวงจุ้ย
 */
function analyzeFengShui() {
    const birthdayEl = document.getElementById('fengshuiBirthday');
    const sittingDirEl = document.getElementById('fengshuiSittingDir');
    const resultEl = document.getElementById('fengshuiResult');

    if (!birthdayEl.value || !sittingDirEl.value) {
        alert('⚠️ กรุณาป้อนวันเกิดและเลือกทิศหลังบ้าน');
        return;
    }

    const birthDate = new Date(birthdayEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();
    const sittingDir = sittingDirEl.value;

    // 1️⃣ คำนวณธาตุ 5 (จากปี)
    const buddhayear = birthYear - 543;
    const elementIndex = buddhayear % 5;
    const element = ELEMENT_FENGSHUI[elementIndex];

    // 2️⃣ คำนวณดาว 9 (จากวันเกิด)
    const planetNum = (birthDay % 9) || 9;
    const planet = PLANET_DIRECTION[planetNum];

    // 3️⃣ ทิศมงคลจากธาตุ
    const luckyDir = element.luckyDirection;

    // 4️⃣ ความเข้ากันของธาตุ
    const compat = ELEMENT_COMPATIBILITY[element.name];

    // 5️⃣ สีมงคล
    const luckColor = element.color;
    const supportElement = compat.support;

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = thaiDays[birthDate.getDay()];

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <h4 class="text-gold text-center mb-4">🏠 วิเคราะห์ฮวงจุ้ย</h4>

            <div class="alert alert-info small mb-4">
                <strong>👤 ข้อมูลสำคัญ:</strong><br>
                ✓ วันเกิด: ${birthDay}/${birthMonth}/${birthYear} (${dayName})<br>
                ✓ ดาวเกิด: ${planet.name} (เลขที่ ${planetNum})<br>
                ✓ ธาตุประจำปี: <strong>${element.name}</strong> (${element.symbol})
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark">
                            <strong>🧭 ทิศมงคลตามธาตุ</strong>
                        </div>
                        <div class="card-body text-center">
                            <h3 class="text-gold mb-2">${luckyDir}</h3>
                            <p class="small text-muted mb-2">ท่าทางที่เหมาะสำหรับ ${element.name}</p>
                            <div style="font-size: 2rem;">${element.symbol}</div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark">
                            <strong>🎨 สีมงคล</strong>
                        </div>
                        <div class="card-body text-center">
                            <p class="mb-2"><strong>สีหลัก:</strong></p>
                            <div style="padding: 15px; background: ${getColorCode(element.color)}; border-radius: 8px; color: #fff; font-weight: bold;">
                                ${element.color}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="text-gold mt-4">⚖️ ความสมดุลของธาตุ</h5>
            <div class="alert alert-secondary small mb-4">
                <strong>${element.name}</strong> ได้รับการสนับสนุนจาก <strong>${compat.support}</strong><br>
                ปกครองด้วย <strong>${compat.suppress}</strong><br>
                <strong style="color: #dc3545;">หลีกเลี่ยง:</strong> ธาตุ<strong>${compat.avoid}</strong>
            </div>

            <h5 class="text-gold">💡 คำแนะนำฮวงจุ้ย</h5>
            <ul class="list-unstyled small">
                <li style="padding: 5px 0;">✅ ทิศนั่ง (Sitting): หันหน้าไป <strong>${luckyDir}</strong></li>
                <li style="padding: 5px 0;">✅ สีห้อง: ใช้สีหลัก <strong>${element.color}</strong> มากขึ้น</li>
                <li style="padding: 5px 0;">✅ วัตถุมงคล: เลือกสิ่งของธาตุ <strong>${element.name}</strong> + <strong>${supportElement}</strong></li>
                <li style="padding: 5px 0;">✅ หลีกเลี่ยง: วัตถุธาตุ <strong>${compat.avoid}</strong></li>
                <li style="padding: 5px 0;">✅ ดาวเกิด: ${planet.name} → ทิศ ${planet.direction} เสริมโชค</li>
            </ul>

            <div class="alert alert-light small mt-4">
                <strong>📝 หมายเหตุ:</strong> การวิเคราะห์นี้อิงจากธาตุ 5 ประการ (Wu Xing) และดาว 9 ดวง ควรประสานกับผู้เชี่ยวชาญฮวงจุ้ยสำหรับความแม่นยำสูงสุด
            </div>
        </div>
    `;
}

/**
 * 🎨 แปลงชื่อสี → รหัสสี
 */
function getColorCode(colorName) {
    const colorMap = {
        "เขียว": "#28a745",
        "แดง": "#dc3545",
        "เหลือง": "#ffc107",
        "ขาว": "#f0f0f0",
        "ดำ/น้ำเงิน": "#001a4d"
    };
    return colorMap[colorName] || "#d4af37";
}

/**
 * 🏠 แสดงปฏิทินฮวงจุ้ยรายเดือน
 */
function displayFengShuiCalendar() {
    const monthEl = document.getElementById('fengshuiMonth');
    const yearEl = document.getElementById('fengshuiYear');
    const resultEl = document.getElementById('fengshuiResult');
    const luckyDirEl = document.getElementById('luckyDirection');
    const unluckyDirEl = document.getElementById('unluckyDirection');
    const importantDaysEl = document.getElementById('importantDays');
    const fengshuiTipsEl = document.getElementById('fengshuiTips');

    if (!monthEl || !yearEl || !resultEl) return;

    const month = parseInt(monthEl.value);
    const year = parseInt(yearEl.value);

    if (!month) {
        alert('⚠️ กรุณาเลือกเดือน');
        return;
    }

    // คำนวณธาตุประจำเดือน (fixed per month)
    const monthElements = {
        1: "ไฟ",    // มกราคม
        2: "โลหะ",  // กุมภาพันธ์
        3: "ไม้",    // มีนาคม
        4: "น้ำ",    // เมษายน
        5: "ดิน",   // พฤษภาคม
        6: "ไฟ",    // มิถุนายน
        7: "โลหะ",  // กรกฎาคม
        8: "ไม้",    // สิงหาคม
        9: "น้ำ",    // กันยายน
        10: "ดิน",  // ตุลาคม
        11: "ไฟ",   // พฤศจิกายน
        12: "โลหะ"  // ธันวาคม
    };

    // วันสำคัญและข้อห้ามตามธาตุ
    const importantDaysByElement = {
        "ไม้": {
            important: "1, 8, 15, 22, 29",
            forbidden: "7, 14, 21, 28",
            description: "วันงอก เจริญ ขยายตัว - หมั่นทำการงานสร้างสรรค์"
        },
        "ไฟ": {
            important: "3, 10, 17, 24",
            forbidden: "6, 13, 20, 27",
            description: "วันพลัง อุ่น สว่าง - เหมาะสำหรับเปิดตัวใหม่"
        },
        "ดิน": {
            important: "5, 12, 19, 26",
            forbidden: "2, 9, 16, 23, 30",
            description: "วันมั่นคง ตั้งมั่น - ดีสำหรับตั้งฐาน สร้างสิ่งก่อสร้าง"
        },
        "โลหะ": {
            important: "4, 11, 18, 25",
            forbidden: "3, 10, 17, 24",
            description: "วันเข้มแข็ง ทำความสะอาด - ดีสำหรับการดำเนินการ"
        },
        "น้ำ": {
            important: "2, 9, 16, 23, 30",
            forbidden: "5, 12, 19, 26",
            description: "วันไหล ปรับตัว - ดีสำหรับการเยี่ยมอื่นๆ"
        }
    };

    // คำแนะนำตามธาตุ
    const recommendationsByElement = {
        "ไม้": [
            "✅ ดีสำหรับ: ปลูกบ้าน, ปลูกต้นไม้, เปิดธุรกิจใหม่",
            "✅ สี: เขียว, ฟ้า",
            "✅ ตัวเลข: 3, 8",
            "❌ หลีกเลี่ยง: ลงทุนในโลหะ, งานเลิกจ้าง"
        ],
        "ไฟ": [
            "✅ ดีสำหรับ: ซ่อมแซม, ทำความสะอาด, เปิดร้าน",
            "✅ สี: แดง, ส้ม",
            "✅ ตัวเลข: 9",
            "❌ หลีกเลี่ยง: การเดินทางไกล, สัญญาน้ำ"
        ],
        "ดิน": [
            "✅ ดีสำหรับ: ไหว้บ้าน, บูรณะ, การจ้าง",
            "✅ สี: เหลือง, น้ำตาล",
            "✅ ตัวเลข: 5",
            "❌ หลีกเลี่ยง: การขุด, งานที่ทำลาย"
        ],
        "โลหะ": [
            "✅ ดีสำหรับ: การ์ดการเงิน, ซ่อมเครื่องจักร",
            "✅ สี: ขาว, เงิน",
            "✅ ตัวเลข: 7",
            "❌ หลีกเลี่ยง: งานเกี่ยวกับไม้, การเก็บของ"
        ],
        "น้ำ": [
            "✅ ดีสำหรับ: ท่องเที่ยว, ซ่อมแซมที่ฝา, การขนส่ง",
            "✅ สี: ดำ, น้ำเงิน",
            "✅ ตัวเลข: 1",
            "❌ หลีกเลี่ยง: งานเกี่ยวกับไฟ, การเก็บความร้อน"
        ]
    };

    const monthElement = monthElements[month];
    const monthElementData = ELEMENT_FENGSHUI[Object.keys(ELEMENT_FENGSHUI).find(k => ELEMENT_FENGSHUI[k].name === monthElement)];
    const importantDays = importantDaysByElement[monthElement];
    const recommendations = recommendationsByElement[monthElement];

    // คำนวณธาตุประจำปี
    const yearElement = (year - 1900) % 5;
    const yearElementData = ELEMENT_FENGSHUI[yearElement];

    // ทิศมงคล (จากธาตุประจำเดือน)
    const luckyDir = monthElementData.luckyDirection;

    // ทิศไม่มงคล (ธาตุตรงข้าม)
    const oppositeElements = {
        "ไม้": "โลหะ",
        "ไฟ": "น้ำ",
        "ดิน": "ดิน",
        "โลหะ": "ไม้",
        "น้ำ": "ไฟ"
    };
    const oppositeElement = oppositeElements[monthElement];
    const oppositeElementData = ELEMENT_FENGSHUI[Object.keys(ELEMENT_FENGSHUI).find(k => ELEMENT_FENGSHUI[k].name === oppositeElement)];
    const unluckyDir = oppositeElementData.luckyDirection;

    // แสดงผลลัพธ์
    if (luckyDirEl) {
        luckyDirEl.innerHTML = `
            <div style="padding: 15px; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border-left: 4px solid #d4af37;">
                <p class="mb-2"><strong>📍 เดือน:</strong> <span style="color: #d4af37; font-size: 18px;">${monthElementData.symbol} ${monthElement}</span></p>
                <p class="mb-2"><strong>🧭 ทิศมงคล:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">${luckyDir}</span></p>
                <p class="small mb-0"><strong>💡 คำแนะนำ:</strong> ตั้งเตียง โต๊ะทำงาน หรือประตูหลักโดยเข้ากับทิศ ${luckyDir}</p>
            </div>
        `;
    }

    if (unluckyDirEl) {
        unluckyDirEl.innerHTML = `
            <div style="padding: 15px; background: rgba(220, 53, 69, 0.1); border-radius: 8px; border-left: 4px solid #dc3545;">
                <p class="mb-2"><strong>📍 ธาตุตรงข้าม:</strong> <span style="color: #dc3545; font-size: 18px;">${oppositeElementData.symbol} ${oppositeElement}</span></p>
                <p class="mb-2"><strong>🚫 ทิศหลีกเลี่ยง:</strong> <span style="color: #dc3545; font-size: 18px; font-weight: bold;">${unluckyDir}</span></p>
                <p class="small mb-0"><strong>⚠️ คำแนะนำ:</strong> หลีกเลี่ยงการตั้งสิ่งสำคัญทางทิศ ${unluckyDir}</p>
            </div>
        `;
    }

    if (importantDaysEl) {
        importantDaysEl.innerHTML = `
            <div style="padding: 15px;">
                <p class="mb-3"><strong>✅ วันมงคล:</strong></p>
                <p style="font-size: 18px; color: #28a745; font-weight: bold; margin-bottom: 10px;">${importantDays.important}</p>
                <p class="small mb-3">${importantDays.description}</p>

                <p class="mb-3"><strong>❌ วันข้อห้าม:</strong></p>
                <p style="font-size: 18px; color: #dc3545; font-weight: bold;">${importantDays.forbidden}</p>
            </div>
        `;
    }

    if (fengshuiTipsEl) {
        fengshuiTipsEl.innerHTML = `
            <div style="padding: 15px;">
                <ul class="list-unstyled">
                    ${recommendations.map(rec => `<li style="padding: 8px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">${rec}</li>`).join('')}
                </ul>
                <p class="small mt-3 mb-0">
                    <strong>💡 เดือนปัจจุบัน:</strong> ธาตุ${monthElement} (ปี${year}) + ธาตุปี${yearElementData.name}<br>
                    <strong>🔄 ความสัมพันธ์:</strong> รักษา = ${ELEMENT_COMPATIBILITY[monthElement].support}, หวาดกลัว = ${ELEMENT_COMPATIBILITY[monthElement].suppress}
                </p>
            </div>
        `;
    }

    // เพิ่มส่วน โชคลาภ + สัตว์นักษัตร + พืช + รสชาติ
    if (resultEl) {
        // ดึงข้อมูลโชคลาภจากธาตุประจำเดือน
        const fortuneData = MONTHLY_FORTUNE_LEVEL[monthElement] || MONTHLY_FORTUNE_LEVEL["ดิน"];

        const easyLevelInfo = `
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-star mr-2"></i>โชคลาภเดือนนี้
                            </h5>
                            <div style="padding: 10px; text-align: center;">
                                <p style="font-size: 24px; color: #d4af37; margin-bottom: 5px;">${fortuneData.fortune}</p>
                                <p class="mb-2"><strong>${fortuneData.level}</strong></p>
                                <p class="small">${fortuneData.text}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-dragon mr-2"></i>สัตว์นักษัตรที่โชค
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2" style="font-size: 18px; color: #d4af37;">
                                    ${ZODIAC_COMPATIBILITY[monthElement].animals.join(', ')}
                                </p>
                                <p class="small">${ZODIAC_COMPATIBILITY[monthElement].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-leaf mr-2"></i>พืชมงคล
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2" style="color: #28a745;">
                                    ${AUSPICIOUS_PLANTS[monthElement].plants.join(', ')}
                                </p>
                                <p class="small">${AUSPICIOUS_PLANTS[monthElement].description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-utensils mr-2"></i>รสชาติมงคล
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2" style="font-size: 18px; color: #d4af37;">
                                    🍴 ${LUCKY_FOOD_FLAVORS[monthElement].flavor}
                                </p>
                                <p class="small mb-2">${LUCKY_FOOD_FLAVORS[monthElement].foods.join(', ')}</p>
                                <p class="small">${LUCKY_FOOD_FLAVORS[monthElement].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultEl.innerHTML += easyLevelInfo;
    }

    // เพิ่มส่วน สีมงคล + เลขมงคล + กิจกรรมห้าม
    if (resultEl) {
        const colorsAndNumbers = `
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-palette mr-2"></i>สีมงคล + เลขมงคล
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2"><strong>🎨 สีมงคล:</strong></p>
                                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                    ${monthElementData.colors.map(c => `
                                        <div style="width: 50px; height: 50px; border-radius: 8px; background: ${getColorCodeForName(c)}; border: 2px solid #d4af37; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 12px; text-align: center;">${c}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <p class="mb-0"><strong>🔢 เลขมงคล:</strong></p>
                                <p style="font-size: 20px; color: #d4af37; font-weight: bold; margin-top: 8px;">
                                    ${monthElementData.numbers.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-ban mr-2"></i>กิจกรรมห้ามเดือนนี้
                            </h5>
                            <ul class="list-unstyled small">
                                ${FORBIDDEN_ACTIVITIES[monthElement].map(activity => `
                                    <li style="padding: 8px 0; border-bottom: 1px solid rgba(220, 53, 69, 0.3);">
                                        ${activity}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultEl.innerHTML += colorsAndNumbers;
    }

    // เพิ่มส่วน ดาวประจำเดือน + วิธีเสริมพลัง + ความขัดแย้ง (ระดับลึก จากธาตุประจำเดือน)
    if (resultEl) {
        const planetData = MONTHLY_PLANETS[monthElement] || MONTHLY_PLANETS["ดิน"];
        const enhanceData = ENHANCEMENT_METHODS[monthElement] || ENHANCEMENT_METHODS["ดิน"];
        const conflictData = ZODIAC_CONFLICTS[monthElement] || ZODIAC_CONFLICTS["ดิน"];

        const deepLevelInfo = `
            <hr class="border-gold-30 my-4">
            <h4 class="text-gold mb-3 text-center">🔥 ระดับลึก (Deep Insights)</h4>

            <div class="alert alert-info small mb-3">
                <strong>📅 เดือนปัจจุบัน:</strong> ธาตุ${monthElement}
                <br><strong>💡 สำหรับความเฉพาะเจาะจง:</strong> ใช้ "วิเคราะห์ฮวงจุ้ย" และป้อนวันเดือนปีเกิด
            </div>

            <div class="row mt-3">
                <div class="col-md-4">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-star mr-2"></i>ดาวประจำเดือน
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2" style="font-size: 20px; font-weight: bold;">
                                    ${planetData.symbol} ${planetData.planet}
                                </p>
                                <p class="small mb-2"><strong>อิทธิพล:</strong> ${planetData.impact}</p>
                                <p class="small mb-2"><strong>✅ ดี:</strong> ${planetData.activities}</p>
                                <p class="small"><strong>⚠️ ระวัง:</strong> ${planetData.caution}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-magic mr-2"></i>วิธีเสริมพลัง
                            </h5>
                            <div style="padding: 10px;">
                                <p class="small mb-2"><strong>🙏 พิธี:</strong></p>
                                <ul class="small list-unstyled mb-2">
                                    ${enhanceData.rituals.map(r => `<li>• ${r}</li>`).join('')}
                                </ul>
                                <p class="small mb-2"><strong>🏠 ฮวงจุ้ย:</strong></p>
                                <ul class="small list-unstyled mb-2">
                                    ${enhanceData.feng_shui.map(f => `<li>• ${f}</li>`).join('')}
                                </ul>
                                <p class="small"><strong>💝 บุญ:</strong> ${enhanceData.charity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-warning mr-2"></i>ขัดแย้งปีอื่น
                            </h5>
                            <div style="padding: 10px;">
                                <p class="small mb-2"><strong>🐉 ปีนักษัตร:</strong></p>
                                <p class="small font-weight-bold mb-2">${conflictData.animals.join(', ')}</p>
                                <p class="small mb-2"><strong>❌ ขัดแย้งกับ:</strong></p>
                                <p class="small font-weight-bold mb-2">${conflictData.conflict_with.join(', ')}</p>
                                <p class="small mb-2"><strong>เหตุผล:</strong> ${conflictData.reason}</p>
                                <p class="small"><strong>ผลกระทบ:</strong> ${conflictData.impact}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultEl.innerHTML += deepLevelInfo;
    }

    // เพิ่มส่วน ความเสี่ยง + วัตถุเสริม + ส่วนกาย (ระดับกลาง)
    if (resultEl) {
        // ดึงข้อมูลระดับกลางพร้อม fallback
        const riskData = RISK_LEVEL[monthElement] || RISK_LEVEL["ดิน"];
        const objectsData = AUSPICIOUS_OBJECTS[monthElement] || AUSPICIOUS_OBJECTS["ดิน"];
        const bodyData = BODY_PARTS_TO_CARE[monthElement] || BODY_PARTS_TO_CARE["ดิน"];

        const mediumLevelInfo = `
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-exclamation-triangle mr-2"></i>ความเสี่ยงเดือนนี้
                            </h5>
                            <div style="padding: 10px;">
                                <p class="mb-2" style="font-size: 18px; font-weight: bold;">
                                    ${riskData.level}
                                </p>
                                <p class="small mb-2">ระดับความเสี่ยง: <strong>${riskData.percentage}</strong></p>
                                <p class="small">${riskData.text}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-box mr-2"></i>วัตถุเสริมมงคล
                            </h5>
                            <div style="padding: 10px;">
                                <p class="small mb-2">${objectsData.objects.join(', ')}</p>
                                <p class="small">${objectsData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3 mb-3">
                <div class="col-12">
                    <div class="card bg-dark border-gold">
                        <div class="card-body">
                            <h5 class="text-gold mb-3">
                                <i class="fas fa-heart mr-2"></i>ส่วนกายที่ต้องดูแล
                            </h5>
                            <div style="padding: 10px;">
                                <p class="small mb-2"><strong>🫀 อวัยวะหลัก:</strong> ${bodyData.organs.join(', ')}</p>
                                <p class="small mb-2"><strong>⚠️ อาการที่อาจเกิด:</strong> ${bodyData.symptoms}</p>
                                <p class="small mb-0"><strong>💊 วิธีดูแล:</strong> ${bodyData.care}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultEl.innerHTML += mediumLevelInfo;
    }

    resultEl.style.display = 'block';
}

/**
 * 🎨 แปลงชื่อสี → รหัส RGB
 */
function getColorCodeForName(colorName) {
    const colorMap = {
        "เขียว": "#28a745",
        "ฟ้า": "#0084ff",
        "แดง": "#dc3545",
        "ส้ม": "#fd7e14",
        "เหลือง": "#ffc107",
        "น้ำตาล": "#8b4513",
        "ขาว": "#f0f0f0",
        "เงิน": "#c0c0c0",
        "ดำ": "#1a1a1a",
        "น้ำเงิน": "#001a4d"
    };
    return colorMap[colorName] || "#d4af37";
}

document.addEventListener("DOMContentLoaded", () => {
    showFengShuiPage();

    // Populate month dropdown in Feng Shui calendar
    const monthSelect = document.getElementById('fengshuiMonth');
    if (monthSelect) {
        const months = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                       "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        months.forEach((month, index) => {
            if (index > 0) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = month;
                monthSelect.appendChild(option);
            }
        });
    }

    console.log("✅ fengshui.js loaded - อิงธาตุ 5 + ดาว 9 ดวง (authentic Feng Shui)");
});

window.showFengShuiPage = showFengShuiPage;
window.analyzeFengShui = analyzeFengShui;
window.displayFengShuiCalendar = displayFengShuiCalendar;
