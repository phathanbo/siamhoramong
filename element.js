"use strict";

/**
 * ข้อมูลธาตุตามวันเกิด (ดาวเคราะห์)
 * dayIndex: 0 = อาทิตย์, 1 = จันทร์, ..., 6 = เสาร์
 */
const ELEMENT_INFO = {
    0: { name: "ธาตุไฟ", level: "(ไฟแรง)", color: "#e63946", desc: "กระตือรือร้น ใจร้อน มีความเป็นผู้นำสูง" },
    1: { name: "ธาตุดิน", level: "(ดินอ่อน)", color: "#ffb703", desc: "อ่อนน้อม ปรับตัวเก่ง มีเมตตาชอบช่วยเหลือ" },
    2: { name: "ธาตุลม", level: "(ลมพายุ)", color: "#ff85a1", desc: "กล้าหาญ ตรงไปตรงมา รวดเร็วเด็ดขาด" },
    3: { name: "ธาตุน้ำ", level: "(น้ำน้อย)", color: "#2a9d8f", desc: "มีวาทศิลป์ ปัญญาดี ช่างคิดช่างเจรจา" },
    4: { name: "ธาตุดิน", level: "(ดินแข็ง)", color: "#f4a261", desc: "หนักแน่น มีหลักการ รักความถูกต้อง" },
    5: { name: "ธาตุน้ำ", level: "(น้ำไหล)", color: "#a2d2ff", desc: "อารมณ์สุนทรีย์ รักสวยรักงาม ใจดีอ่อนโยน" },
    6: { name: "ธาตุไฟ", level: "(ไฟสุมขอน)", color: "#7209b7", desc: "อดทนสูง จริงจัง คิดการณ์ไกล" }
};

/**
 * ข้อมูลธาตุตามเดือนเกิด (ต้น/กลาง/ปลายธาตุ)
 * monthIndex: 0-11 (มกราคม = 0, กุมภาพันธ์ = 1, ...)
 */
const MONTH_ELEMENTS = {
    // ธาตุน้ำ
    0: { name: "ธาตุน้ำ", level: "(ต้นธาตุ)", power: "สูง", color: "#0077b6", strength: "แข็ง/นิ่ง", desc: "สุขุมลุ่มลึก เยือกเย็นเหมือนน้ำแข็ง" },
    1: { name: "ธาตุน้ำ", level: "(กลางธาตุ)", power: "ปานกลาง", color: "#00b4d8", strength: "ใสสะอาด", desc: "ร่าเริง แจ่มใส ปรับตัวเก่งเหมือนน้ำในแก้ว" },
    2: { name: "ธาตุน้ำ", level: "(ปลายธาตุ)", power: "ปานกลาง",color: "#90e0ef", strength: "อ่อนไหว", desc: "ช่างเพ้อฝัน อ่อนไหวง่ายเหมือนละอองหมอก" },

    // ธาตุไฟ
    3: { name: "ธาตุไฟ", level: "(ต้นธาตุ)", power: "สูง", color: "#d00000", strength: "แรงกล้า", desc: "ร้อนแรง มุ่งมั่น มีพลังความเป็นผู้นำสูงมาก" },
    4: { name: "ธาตุไฟ", level: "(กลางธาตุ)", power: "ปานกลาง", color: "#dc2f02", strength: "สม่ำเสมอ", desc: "อบอุ่น มีเหตุผล เป็นที่พึ่งพาให้ผู้อื่นได้" },
    5: { name: "ธาตุไฟ", level: "(ปลายธาตุ)", power: "ปานกลาง", color: "#ffba08", strength: "อ่อนแรง", desc: "อารมณ์แปรปรวนง่าย ทำอะไรตามใจตัวเอง" },

    // ธาตุดิน
    6: { name: "ธาตุดิน", level: "(ต้นธาตุ)", power: "สูง", color: "#6c584c", strength: "แข็งแกร่ง", desc: "หนักแน่น มั่นคงมาก ไม่ชอบการเปลี่ยนแปลง" },
    7: { name: "ธาตุดิน", level: "(กลางธาตุ)", power: "ปานกลาง", color: "#a98467", strength: "อุดมสมบูรณ์", desc: "จิตใจดี มีเมตตา อดทนต่ออุปสรรคได้ดี" },
    8: { name: "ธาตุดิน", level: "(ปลายธาตุ)", power: "ปานกลาง", color: "#adc178", strength: "อ่อนนุ่ม", desc: "ขี้เกรงใจ อ่อนโยน แต่ขาดความเด็ดขาด" },

    // ธาตุลม
    9: { name: "ธาตุลม", level: "(ต้นธาตุ)", power: "สูง", color: "#48cae4", strength: "รวดเร็ว", desc: "ว่องไว คิดเร็วทำเร็วเหมือนพายุ" },
    10: { name: "ธาตุลม", level: "(กลางธาตุ)", power: "ปานกลาง", color: "#ade8f4", strength: "นุ่มนวล", desc: "มีวาทศิลป์ดี ติดต่อประสานงานเก่ง" },
    11: { name: "ธาตุลม", level: "(ปลายธาตุ)", power: "ปานกลาง", color: "#caf0f8", strength: "แผ่วเบา", desc: "รักสันโดษ มีโลกส่วนตัวสูง ชอบคิดค้น" }
};

/**
 * ข้อมูลธาตุตามปีนักษัตร (12 นักษัตร)
 * zodiacIndex: 0 = ชวด, 1 = ฉลู, ..., 11 = กุน
 */
const ZODIAC_ELEMENTS = {
    0: { name: "ชวด", element: "ธาตุน้ำ", color: "#219ebc", desc: "ฉลาด มีไหวพริบ ปรับตัวเก่ง", job: "งานบริการ, ธุรกิจเครื่องดื่ม, การขนส่ง" },
    1: { name: "ฉลู", element: "ธาตุดิน", color: "#f4a261", desc: "อดทน ขยัน หนักแน่น", job: "เกษตรกรรม, อสังหาริมทรัพย์, งานก่อสร้าง" },
    2: { name: "ขาล", element: "ธาตุไม้", color: "#2a9d8f", desc: "กล้าหาญ มีพลัง มีความเป็นผู้นำ", job: "ครูอาจารย์, งานไม้, งานด้านสุขภาพ" },
    3: { name: "เถาะ", element: "ธาตุไม้", color: "#2a9d8f", desc: "อ่อนโยน เมตตา รักสันติ", job: "สถาปนิก, นักเขียน, ธุรกิจต้นไม้/ดอกไม้" },
    4: { name: "มะโรง", element: "ธาตุดิน", color: "#f4a261", desc: "มีอำนาจ บารมี ใจกว้าง", job: "บริหารการจัดการ, นักการเมือง, เจ้าของธุรกิจ" },
    5: { name: "มะเส็ง", element: "ธาตุไฟ", color: "#e63946", desc: "ฉลาดล้ำลึก มีเสน่ห์ มุ่งมั่น", job: "วางแผนกลยุทธ์, งานบันเทิง, เชฟ" },
    6: { name: "มะเมีย", element: "ธาตุไฟ", color: "#e63946", desc: "ร่าเริง รักอิสระ พลังงานล้นเหลือ", job: "การตลาด, ประชาสัมพันธ์, งานที่ต้องเดินทาง" },
    7: { name: "มะแม", element: "ธาตุดิน", color: "#f4a261", desc: "สุภาพ อ่อนโยน รักครอบครัว", job: "งานศิลปะ, ของตกแต่งบ้าน, ที่ปรึกษา" },
    8: { name: "วอก", element: "ธาตุทอง", color: "#ffb703", desc: "คล่องแคล่ว แก้ปัญหาเก่ง", job: "การเงิน, ธนาคาร, ตลาดหุ้น, เครื่องจักร" },
    9: { name: "ระกา", element: "ธาตุทอง", color: "#ffb703", desc: "ช่างสังเกต เจ้าระเบียบ ตรงไปตรงมา", job: "ร้านทอง, อัญมณี, งานบัญชี/ตรวจสอบ" },
    10: { name: "จอ", element: "ธาตุดิน", color: "#f4a261", desc: "ซื่อสัตย์ จริงใจ มีคุณธรรม", job: "ทนายความ, งานป้องกันภัย, มูลนิธิ/NGO" },
    11: { name: "กุน", element: "ธาตุน้ำ", color: "#219ebc", desc: "ใจดี มองโลกในแง่ดี", job: "ธุรกิจนำเข้า, การโรงแรม, งานวิเทศสัมพันธ์" }
};

/**
 * ดึงธาตุตามวันเกิด (ดาวเคราะห์)
 * @param {number} dayIndex - 0-6 (อาทิตย์-เสาร์)
 * @returns {object} ข้อมูลธาตุ
 */
function getBirthElement(dayIndex) {
    if (typeof dayIndex !== "number" || dayIndex < 0 || dayIndex > 6) {
        return { name: "ไม่ระบุ", color: "#ccc", desc: "-" };
    }
    return ELEMENT_INFO[dayIndex] || { name: "ไม่ระบุ", color: "#ccc", desc: "-" };
}

/**
 * ดึงธาตุตามเดือนเกิด
 * @param {number} monthIndex - 0-11
 * @returns {object} ข้อมูลธาตุ
 */
function getMonthElement(monthIndex) {
    if (typeof monthIndex !== "number") {
        return { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };
    }
    const idx = ((monthIndex % 12) + 12) % 12; // รองรับค่าติดลบหรือเกิน
    return MONTH_ELEMENTS[idx] || { name: "ไม่ระบุ", color: "#ccc", strength: "-", desc: "-" };
}

/**
 * ดึงธาตุตามปีนักษัตร
 * @param {number} zodiacIndex - 0-11
 * @returns {object} ข้อมูลนักษัตร + ธาตุ
 */
/**
 * ดึงธาตุตามปีนักษัตร
 * รองรับ:
 * - เลข index 0-11
 * - Date object
 * - yyyy-mm-dd
 * - dd/mm/yyyy
 * - พ.ศ.
 */
function getZodiacElement(input) {

    let idx = null;

    // =========================
    // กรณีส่งเป็นเลข 0-11 มา
    // =========================
    if (typeof input === "number" && Number.isFinite(input)) {

        idx = ((input % 12) + 12) % 12;

    } else {

        // =========================
        // กรณีส่งวันเกิดมา
        // =========================

        let dateObj = null;

        // Date object
        if (input instanceof Date) {
            dateObj = input;
        }

        // string
        else if (typeof input === "string") {

            // yyyy-mm-dd
            if (input.includes("-")) {

                dateObj = new Date(input);

            }

            // dd/mm/yyyy หรือ พ.ศ.
            else if (input.includes("/")) {

                const parts = input.split("/");

                if (parts.length === 3) {

                    let day = parseInt(parts[0], 10);
                    let month = parseInt(parts[1], 10) - 1;
                    let year = parseInt(parts[2], 10);

                    // แปลง พ.ศ. -> ค.ศ.
                    if (year > 2400) {
                        year -= 543;
                    }

                    dateObj = new Date(year, month, day);
                }
            }
        }

        // =========================
        // ตรวจสอบ date
        // =========================
        if (!dateObj || isNaN(dateObj.getTime())) {
            return {
                name: "ไม่ระบุ",
                element: "-",
                color: "#ccc",
                desc: "-",
                job: "-"
            };
        }

        // =========================
        // ปีนักษัตรไทย
        // ก่อน 13 เม.ย. นับปีเก่า
        // =========================

        let year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        if (month < 4 || (month === 4 && day < 13)) {
            year -= 1;
        }

        idx = Math.abs(year - 4) % 12;
    }

    return ZODIAC_ELEMENTS[idx] || {
        name: "ไม่ระบุ",
        element: "-",
        color: "#ccc",
        desc: "-",
        job: "-"
    };
}

/**
 * ตรวจสอบความสัมพันธ์ระหว่างธาตุสองธาตุ
 * @param {string} baseElem - ชื่อธาตุหลัก (เช่น "ธาตุไฟ (ไฟแรง)" หรือ "ธาตุน้ำ")
 * @param {string} supportElem - ชื่อธาตุสนับสนุน
 * @returns {string} ความสัมพันธ์
 */
function getElementRelation(baseElem, supportElem) {
    if (typeof baseElem !== "string" || typeof supportElem !== "string") {
        return "เป็นกลาง (ข้อมูลไม่ถูกต้อง)";
    }

    // ลบคำขยายออกให้เหลือชื่อธาตุหลัก
    const b = baseElem.split(" ")[0];
    const s = supportElem.split(" ")[0];

    const relations = {
        "ธาตุไฟ": {
            "ธาตุลม": "หนุนส่ง (ลมช่วยให้ไฟโชติช่วง)",
            "ธาตุไม้": "เกื้อกูล (ไม้เป็นเชื้อเพลิง)",
            "ธาตุน้ำ": "พิฆาต (น้ำดับไฟ)",
            "ธาตุดิน": "ถ่ายเท (ไฟเผาดินให้แกร่ง)"
        },
        "ธาตุดิน": {
            "ธาตุไฟ": "หนุนส่ง (ไฟเผาผลาญเป็นดิน)",
            "ธาตุทอง": "ถ่ายเท (ดินบ่มเพาะแร่ธาตุ)",
            "ธาตุน้ำ": "เกื้อกูล (ดินกักเก็บน้ำ)",
            "ธาตุลม": "ขัดเกลา (ลมทำให้ดินแห้ง)"
        },
        "ธาตุลม": {
            "ธาตุน้ำ": "หนุนส่ง (ลมพาฝน)",
            "ธาตุไฟ": "หนุนส่ง (ลมทำให้ไฟแรง)",
            "ธาตุทอง": "พิฆาต (โลหะตัดกระแสลม)",
            "ธาตุดิน": "ถ่ายเท (ลมพัดพาหน้าดิน)"
        },
        "ธาตุน้ำ": {
            "ธาตุทอง": "หนุนส่ง (โลหะหลอมเหลวเป็นน้ำ/เรียกฝน)",
            "ธาตุไม้": "ถ่ายเท (น้ำเลี้ยงไม้)",
            "ธาตุไฟ": "พิฆาต (น้ำดับไฟ)",
            "ธาตุดิน": "ขัดเกลา (ดินกั้นทางน้ำ)"
        },
        "ธาตุไม้": {
            "ธาตุน้ำ": "หนุนส่ง (น้ำหล่อเลี้ยงต้นไม้)",
            "ธาตุไฟ": "ถ่ายเท (ไม้กลายเป็นไฟ)",
            "ธาตุทอง": "พิฆาต (ขวานตัดไม้)",
            "ธาตุดิน": "เกื้อกูล (ไม้หยั่งรากในดิน)"
        },
        "ธาตุทอง": {
            "ธาตุดิน": "หนุนส่ง (ดินสร้างแร่ธาตุ)",
            "ธาตุน้ำ": "ถ่ายเท (ทองละลายเป็นน้ำ)",
            "ธาตุไฟ": "พิฆาต (ไฟหลอมทอง)",
            "ธาตุลม": "ขัดเกลา (ทองต้านแรงลม)"
        }
    };

    if (b === s) {
        return "ธาตุเดียวกัน (ส่งเสริมความมั่นคง)";
    }
    return relations[b]?.[s] || "เป็นกลาง (อยู่ร่วมกันได้)";
}

/**
 * คำแนะนำเสริมธาตุ (ตามวันเกิด)
 * @param {string} dayElementName - ชื่อธาตุจาก getBirthElement().name
 * @returns {string} คำแนะนำ
 */
function getRemedyAdvice(dayElementName) {
    if (typeof dayElementName !== "string") {
        return "หมั่นทำบุญตักบาตรเพื่อเสริมสิริมงคล";
    }
    const e = dayElementName.split(" ")[0];
    const advice = {
        "ธาตุไฟ": "ควรเสริมด้วยการทำบุญแสงสว่าง หรือถวายน้ำดื่มเพื่อลดความใจร้อน",
        "ธาตุดิน": "ควรเสริมด้วยการใส่เครื่องประดับโลหะ หรือทำบุญบริจาคเครื่องมือแพทย์",
        "ธาตุลม": "ควรเสริมด้วยการนั่งสมาธิ หรือปลูกต้นไม้รอบบ้านเพื่อสร้างความนิ่ง",
        "ธาตุน้ำ": "ควรเสริมด้วยการทำบุญสร้างโบสถ์วิหาร หรือใช้สิ่งของโทนสีดินเพื่อความมั่นคง"
    };
    return advice[e] || "หมั่นทำบุญตักบาตรเพื่อเสริมสิริมงคล";
}

// ============================================================
// Export สำหรับใช้งานในระบบต่าง ๆ (ES Module + CommonJS + Global)
// ============================================================
const ElementAPI = {
    ELEMENT_INFO,
    MONTH_ELEMENTS,
    ZODIAC_ELEMENTS,
    getBirthElement,
    getMonthElement,
    getZodiacElement,
    getElementRelation,
    getRemedyAdvice
};

// ES Module
if (typeof module !== "undefined" && module.exports) {
    module.exports = ElementAPI;
} else if (typeof window !== "undefined") {
    // สำหรับ <script> แบบปกติ (global)
    window.ElementAPI = ElementAPI;
    // เพื่อความสะดวก เปิดให้เรียกฟังก์ชันโดยตรงได้ด้วย
    window.getBirthElement = getBirthElement;
    window.getMonthElement = getMonthElement;
    window.getZodiacElement = getZodiacElement;
    window.getElementRelation = getElementRelation;
    window.getRemedyAdvice = getRemedyAdvice;
}
