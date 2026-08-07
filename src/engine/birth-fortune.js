"use strict";

/* =========================
   1. UTIL
========================= */
function getInt(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.error(`❌ ไม่พบ element: ${id}`);
        return null;
    }
    const val = parseInt(el.value);
    return isNaN(val) ? null : val;
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

/* =========================
   2. VALIDATION
========================= */
function validateBirthFortuneInput(day, month, year, be) {
    if (!day || day < 1 || day > 31) return "วันไม่ถูกต้อง";
    if (!month || month < 1 || month > 12) return "เดือนไม่ถูกต้อง";
    if (!be || be < 2000) return "ปี พ.ศ. ไม่ถูกต้อง";
    if (!year) return "ปี (เลขเสริม) ไม่ถูกต้อง";
    return null;
}

/* =========================
   3. CORE LOGIC
========================= */
function calculateMod7(value) {
    return ((value % 7) + 7) % 7; // กันค่าติดลบ
}

/* =========================
   4. MAIN FUNCTION
========================= */
function calculateBirthFortune() {
    try {
        const day = getInt("fortuneDay");
        const month = getInt("fortuneMonth");
        const year = getInt("fortuneYear"); // เลขเสริม/เลขปี
        const be = getInt("fortuneBE");

        const error = validateBirthFortuneInput(day, month, year, be);
        if (error) {
            Swal.fire('เกิดข้อผิดพลาด', error, 'error');
            return;
        }

        const display = document.getElementById("fortune-result-display");
        if (!display) {
            console.error("❌ ไม่พบ display");
            return;
        }

        // แปลง พ.ศ. → จ.ศ.
        const cs = be - 1181;

        /* =========================
           แบบที่ 1 และ 2
        ========================= */
        const sum12 = (day + month + year) * 3;
        const remain12 = calculateMod7(sum12);

        const text1 = {
            0: "นิสัยใจคอไม่แน่นอน ทำงานเป็นพักๆ",
            1: "อาชีพทางทำนาดี",
            2: "ค้าขายดี",
            3: "ทหาร/ราชการดี",
            4: "ทำสวนไร่นาดี",
            5: "ครู หมอ นักบวชดี",
            6: "เข้าเฝ้าเจ้านายดี"
        };

        const text2 = {
            0: "ทำได้ทุกอย่าง ปานกลาง",
            1: "ราชการมียศศักดิ์",
            2: "พ่อบ้านแม่เรือนดี",
            3: "อาสาเจ้านายดี",
            4: "เกษตรดี",
            5: "ครู/หมอดี",
            6: "ค้าขายดี"
        };

        /* =========================
           แบบที่ 3
        ========================= */
        let res3 = "ไม่สามารถคำนวณได้";
        if (cs > 0) {
            const step3 = (((cs * 40) + year + month) * 3) + day;
            const remain3 = calculateMod7(step3);

            const text3 = {
                0: "ใจกล้า นักสู้",
                1: "เหนื่อยมาก แต่พออยู่ได้",
                2: "เกษตร/ค้าขายดี",
                3: "ราชการเด่น",
                4: "พ่อค้ารวย",
                5: "นักบวช/หมอดี",
                6: "มีวาสนา เป็นผู้นำ"
            };

            res3 = `(จ.ศ. ${cs}) เศษ ${remain3} : ${text3[remain3] || "-"}`;
        }

        /* =========================
           OUTPUT
        ========================= */
        safeSetText("fortune-res-1", `เศษ ${remain12} : ${text1[remain12] || "-"}`);
        safeSetText("fortune-res-2", `เศษ ${remain12} : ${text2[remain12] || "-"}`);
        safeSetText("fortune-res-3", res3);

        display.style.display = "block";

    } catch (err) {
        console.error("🔥 ERROR:", err);
        Swal.fire('เกิดข้อผิดพลาด', 'ระบบเกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
    }
}