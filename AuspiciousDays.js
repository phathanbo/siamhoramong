/* ======================================================
   📅 ปฏิทินฤกษ์มงคล
====================================================== */

"use strict";

/* ======================================================
   แปลงปี พ.ศ. → จ.ศ.
====================================================== */

function convertToChulaSakarat(beYear) {
    return beYear - 1181
}

/* ======================================================
   ปีโหราศาสตร์ (เปลี่ยนกาลโยคหลังวันเถลิงศก 16 เมษายน)
====================================================== */
function getEffectiveAstroYear(date) {
    const y = date.getFullYear();
    const m = date.getMonth(); // 0 = มกราคม, 3 = เมษายน
    const d = date.getDate();

    const thaiYear = y + 543;

    // กาลโยคจะเปลี่ยนตามปีจุลศักราช (จ.ศ.) ซึ่งเปลี่ยนในวันเถลิงศก
    // โดยทั่วไปใช้มาตรฐานวันที่ 16 เมษายนของทุกปี
    if (m < 3 || (m === 3 && d < 16)) {
        return thaiYear - 1;
    }
    return thaiYear;
}

/* ======================================================
   คำนวณกาลโยค (ฉบับปรับปรุง Logic Modulo)
====================================================== */
function calculateKalaYok(date) {
    const year = getEffectiveAstroYear(date);
    const cs = year - 1181; // แปลงเป็น จ.ศ.
    

    const getRem = (num, divisor) => {
        let rem = num % divisor;
        return rem < 0 ? rem + divisor : rem;
    };

    const thongchaiBase = (cs * 10) + 3;
    const athibadiBase = (cs % 498);
    const ubatBase = (cs * 10) + 2;
    const lokawinasBase = cs + 1120;  
    

  
    return {
        thongChai: getRem(thongchaiBase - 1, 7),
        athibadi: getRem(athibadiBase - 1, 7),
        ubart: getRem(ubatBase - 1, 7),
        lokawinat: getRem(lokawinasBase - 1, 7)
    }
   

}


/* ======================================================
   ดาวจร 7 ดาว
====================================================== */

function getPlanetTransit(date) {

    const day = date.getDay()

    const planets = [
        { name: "☀️ ดาวอาทิตย์", power: "อำนาจ วาสนา" },
        { name: "🌙 ดาวจันทร์", power: "เมตตา เสน่ห์" },
        { name: "♂ ดาวอังคาร", power: "พลัง การต่อสู้" },
        { name: "☿ ดาวพุธ", power: "การค้า การสื่อสาร" },
        { name: "♃ ดาวพฤหัส", power: "ปัญญา ผู้ใหญ่" },
        { name: "♀ ดาวศุกร์", power: "เงิน เสน่ห์" },
        { name: "♄ ดาวเสาร์", power: "กรรม อุปสรรค" }
    ]

    return planets[day]
}

/* ======================================================
   ฤกษ์บน ฤกษ์ล่าง
====================================================== */

function calculateRuek(date) {

    const d = date.getDate()
    const top = d % 3
    const bottom = d % 4

    let topResult = "ปกติ"
    let bottomResult = "ปกติ"

    if (top === 0) topResult = "ฤกษ์ดี"
    if (top === 1) topResult = "ฤกษ์กลาง"
    if (top === 2) topResult = "ฤกษ์แรง"

    if (bottom === 0) bottomResult = "ฤกษ์ดี"
    if (bottom === 1) bottomResult = "ฤกษ์เสีย"
    if (bottom === 2) bottomResult = "ฤกษ์กลาง"
    if (bottom === 3) bottomResult = "ฤกษ์ดี"

    return {
        top: topResult,
        bottom: bottomResult
    }
}

/* ======================================================
   หมายเหตุ: ฟังก์ชัน getAuspiciousDays ถูกย้ายไปที่ utils-auspicious.js แล้ว
====================================================== */

/* ======================================================
   ฟังก์ชันแสดงหน้าปฏิทิน (แก้ไขใหม่)
====================================================== */
function showAuspiciousPage() {
    // 1. นำทางไปยังหน้า auspiciousPage
    navigateTo("auspiciousPage");

    // 2. ใช้ฟังก์ชันช่วยเพื่อให้แน่ใจว่า Element ถูกสร้างขึ้นใน DOM แล้ว
    const initCalendar = () => {
        const body = document.getElementById("calendarBody");
        if (body) {
            renderAuspiciousCalendar();
        } else {
            // ถ้ายังไม่เจอ ให้ลองใหม่ใน Frame ถัดไป (ประสิทธิภาพดีกว่า setInterval)
            window.requestAnimationFrame(initCalendar);
        }
    };

    // เริ่มการตรวจสอบ
    window.requestAnimationFrame(initCalendar);
}

/* ======================================================
   เดือนที่ดู
====================================================== */

let viewDate = new Date()

function changeMonth(offset) {

    viewDate.setMonth(viewDate.getMonth() + offset)

    renderAuspiciousCalendar()

}

/* ======================================================
   ปฏิทินฤกษ์
====================================================== */

/* ... (ฟังก์ชัน convertToChulaSakarat, getEffectiveAstroYear, calculateKalaYok เหมือนเดิม) ... */

function Calenderbody() {
    const body = document.getElementById("calendarBodypage");
    if (!body) return;  

    const html = `<div class="card shadow-lg border-gold">
            <div class="card-header bg-dark text-gold text-center py-4">
                <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-outline-gold btn-sm text-white" onclick="changeMonth(-1)">◀
                        เดือนก่อนหน้า</button>
                    <div>
                        <h2 class="mb-0">📅 ปฏิทินฤกษ์มงคล เดือน<span id="currentMonthYear"></span></h2><br>
                        <span class="box" onclick="goToToday()" style="cursor: pointer;">📍 กลับวันนี้</span>
                    </div>
                    <button class="btn btn-outline-gold btn-sm text-white" onclick="changeMonth(1)">เดือนถัดไป
                        ▶</button>
                </div>
            </div>
            <div class="card-body p-0">
                <table class="table table-bordered calendar-table mb-0">
                    <thead>
                        <tr class="text-center">
                            <th class="text-danger">อาทิตย์</th>
                            <th>จันทร์</th>
                            <th>อังคาร</th>
                            <th>พุธ</th>
                            <th>พฤหัสบดี</th>
                            <th>ศุกร์</th>
                            <th>เสาร์</th>
                        </tr>
                    </thead>
                    <tbody id="calendarBody"></tbody>
                </table>
            </div>
        </div>
        <div class="card-footer">
            <div class="row mt-4">
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                    <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                </button>
            </div>
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                    <i class="fas fa-home"></i> กลับหน้าหลัก
                </button>
            </div>
        </div> 
        </div>`;

    body.innerHTML = html;
    renderAuspiciousCalendar();

}

document.addEventListener('DOMContentLoaded', () => {
    Calenderbody();
});

function renderAuspiciousCalendar() {
    const body = document.getElementById("calendarBody");
    const title = document.getElementById("currentMonthYear");
    if (!body || !title) return;

    body.innerHTML = ""; // เคลียร์ก่อนวาดใหม่

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const thaiYear = year + 543;
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    title.innerText = `${monthNames[month]} ${thaiYear}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // ดึงวันที่ปัจจุบันมาเช็ค
    const now = new Date();
    const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;
    const todayDate = now.getDate();

    let dateCounter = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            cell.style.cssText = "width:14%;height:110px;border:1px solid #ddd;padding:5px;vertical-align:top;position:relative;";

            if ((i === 0 && j < firstDay) || dateCounter > daysInMonth) {
                cell.classList.add("bg-light");
            } else {
                const date = new Date(year, month, dateCounter);
                const kala = calculateKalaYok(date);
                const planet = getPlanetTransit(date);
                const ruek = calculateRuek(date);

                // ในลูปสร้างปฏิทิน...
                cell.style.cursor = "pointer";
                // ใน renderAuspiciousCalendar
                cell.onclick = (function (d, m, y) {
                    return function () { showDayDetail(d, m, y); };
                })(dateCounter, month, year);

                // เช็คว่าเป็นวันปัจจุบันหรือไม่
                const isToday = isCurrentMonth && dateCounter === todayDate;

                if (isToday) {
                    cell.style.backgroundColor = "#fdfb94"; // พื้นหลังเหลืองอ่อนสำหรับวันนี้
                    cell.style.border = "2px solid #fcba1f"; // ขอบสีทอง
                }

                let html = `<div style="display:flex; justify-content:space-between;">
                                <span style="font-weight:bold; font-size:1.1rem;">${dateCounter}</span>
                                ${isToday ? '<span style="font-size:12px; color:#e67e22; font-weight:bold;">📍 วันนี้</span>' : ''}
                            </div>`;

                // ส่วนการแสดงกาลโยค
                if (j === kala.thongChai) html += `<div class="text-success" style="font-size:12px;">🚩 ธงชัย</div>`;
                if (j === kala.athibadi) html += `<div class="text-primary" style="font-size:12px;">👑 อธิบดี</div>`;
                if (j === kala.mahaSiddhi) html += `<div class="text-info" style="font-size:12px;">🔮 มหาสิทธิโชค</div>`;
                if (j === kala.rachaChok) html += `<div class="text-warning" style="font-size:12px;">👑 ราชาโชค</div>`;
                if (j === kala.chaiChok) html += `<div class="text-success" style="font-size:12px;">🌟 ชัยโชค</div>`;
                if (j === kala.ubart) html += `<div class="text-warning" style="font-size:12px;">⚠️ อุบาทว์</div>`;
                if (j === kala.lokawinat) html += `<div class="text-danger" style="font-size:12px;">❌ โลกาวินาศ</div>`;

                html += `<div style="font-size:10px; margin-top:4px; color:#666;">${planet.name}</div>`;
                html += `<div style="font-size:10px; color:#888;">บน:${ruek.top} | ล่าง:${ruek.bottom}</div>`;
                html += `<div style="position:absolute; bottom:5px; left:5px; right:5px; font-size:8px; color:#aaa;">คลิกดูรายละเอียด</div>`;

                cell.innerHTML = html;
                dateCounter++;
            }
            row.appendChild(cell);
        }
        body.appendChild(row);
        if (dateCounter > daysInMonth) break;
    }
}

/* ======================================================
   ฟังก์ชันกลับมายังเดือนปัจจุบัน
====================================================== */
function goToToday() {
    viewDate = new Date(); // รีเซ็ต viewDate เป็นวันที่ปัจจุบัน
    renderAuspiciousCalendar(); // วาดปฏิทินใหม่
    window.scrollTo({ behavior: 'smooth' }); // เลื่อนขึ้นบนสุดของหน้า
}

/* ======================================================
   ฟังก์ชันดึงคำทำนายจากระบบยามที่มีอยู่ (แก้ Error)
====================================================== */
function getYarmPrediction(dayIdx) {
    // 1. ตรวจสอบก่อนว่ามีตาราง YARM_CHART และ YARM_INFO จาก yarmPage.js หรือไม่
    if (window.YARM_CHART && typeof YARM_INFO !== 'undefined') {

        // ดึงยามปัจจุบัน (สมมติว่าเป็นยามที่ 1 ของวันนั้นๆ เพื่อแสดงเป็นตัวอย่างใน Modal)
        // หรือถ้าคุณต้องการยามตามเวลาจริง สามารถปรับ Logic ตรงนี้ได้ครับ
        const starId = window.YARM_CHART.day[dayIdx][0]; // ดึงยามแรกของวัน
        const info = YARM_INFO[starId];

        return `${info.name}: ${info.trait} (เหมาะสำหรับ${info.good})`;
    }

    // 2. ถ้าหาไฟล์ yarmPage.js ไม่เจอ ให้ใช้ค่า Default กัน Error
    return "ยามมงคลมหาโชค เหมาะแก่การประกอบการมงคล";
}

/* ======================================================
   ฟังก์ชันช่วยเช็คสถานะกาลโยค
====================================================== */
function getKalaStatus(dayIdx, kala) {
    if (dayIdx === kala.thongChai) return "🚩 วันธงชัย (ดีที่สุด)";
    if (dayIdx === kala.athibadi) return "👑 วันอธิบดี (เน้นอำนาจ)";
    if (dayIdx === kala.ubart) return "⚠️ วันอุบาทว์ (ควรเลี่ยง)";
    if (dayIdx === kala.lokawinat) return "❌ วันโลกาวินาศ (ห้ามเด็ดขาด)";
    return "วันปกติ";
}

/* ======================================================
   ฟังก์ชันคำนวณยามมงคล (ยามอุบากอง)
====================================================== */
function getAuspiciousTime(dayIdx) {
    // โครงสร้างยาม: 0=อาทิตย์, 1=จันทร์ ...
    const timeMatrix = {
        0: "06.00-08.24 (ดีมาก), 13.13-15.36 (ปานกลาง)", // อาทิตย์
        1: "08.25-10.48 (ดี), 15.37-18.00 (ดีมาก)",     // จันทร์
        2: "10.49-13.12 (ดีมาก), 06.00-08.24 (ปานกลาง)", // อังคาร
        3: "13.13-15.36 (ดี), 08.25-10.48 (ดีมาก)",     // พุธ
        4: "15.37-18.00 (ดีมาก), 10.49-13.12 (ดี)",     // พฤหัสบดี
        5: "06.00-08.24 (ดี), 13.13-15.36 (ดีมาก)",     // ศุกร์
        6: "08.25-10.48 (ปานกลาง), 15.37-18.00 (ดี)"     // เสาร์
    };
    return timeMatrix[dayIdx] || "09.00-12.00 (เวลามาตรฐาน)";
}

/* ======================================================
   ฟังก์ชันดาวน์โหลดภาพฤกษ์มงคล (ปรับปรุงใหม่)
====================================================== */
async function downloadAuspiciousImage(element, bgColor) {
    const area = document.getElementById('captureArea');
    if (!area) return;

    let btn = element instanceof HTMLElement ? element : document.querySelector('.btn-share-image');
    const originalText = btn ? btn.innerHTML : "บันทึกรูปภาพ";

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังวาดลายแทง...';
        btn.disabled = true;
    }

    try {
        // ดึงข้อมูลข้อความจากหน้าจอเดิมมาเก็บไว้
        const contentHtml = area.innerHTML;

        // 1. สร้าง Element ลับขึ้นมานอกจอเพื่อใช้ถ่ายรูปโดยเฉพาะ
        const offScreenArea = document.createElement('div');
        offScreenArea.id = "offScreenCapture";
        // จัดสไตล์ให้เป็นจัตุรัสสวยงาม และอ่านง่าย
        offScreenArea.style.cssText = `
            position: absolute;
            left: -9999px;
            top: 0;
            width: 500px;
            padding: 50px;
            background: linear-gradient(135deg, ${bgColor} 0%, #000000 120%);
            color: #ffffff;
            font-family: 'Sarabun', sans-serif;
            line-height: 1.6;
            box-sizing: border-box;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        // 2. ใส่เนื้อหา และลบปุ่มกดออก (ไม่ให้ติดในรูป)
        offScreenArea.innerHTML = contentHtml;
        const btnInClone = offScreenArea.querySelector('button');
        if (btnInClone) btnInClone.remove();

        // 3. เพิ่ม Footer เกรดพรีเมียม
        const footer = document.createElement('div');
        footer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
                <div style="font-size: 22px; font-weight: bold; color: #ffd700;">🌌 มหาโหราจักรวาล</div>
                <div style="font-size: 14px; color: #fff; opacity: 0.8; text-align: right;">วิเคราะห์โดย ประธานโบ้</div>
            </div>
        `;
        offScreenArea.appendChild(footer);

        // นำไปแปะใน body ชั่วคราวเพื่อให้ html2canvas มองเห็น
        document.body.appendChild(offScreenArea);

        // 4. สั่งถ่ายรูปจาก Element ลับนี้
        const canvas = await html2canvas(offScreenArea, {
            backgroundColor: bgColor,
            scale: 2.5, // ความชัดกำลังดี ไม่หนักเครื่องเกินไป
            useCORS: true,
            width: 500,
            // ลบความสูงที่บังคับออก เพื่อให้ภาพยาวตามเนื้อหาจริงแต่ไม่เกินสัดส่วน
        });

        // 5. ลบ Element ลับทิ้ง
        document.body.removeChild(offScreenArea);

        // 6. บันทึกไฟล์
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = `มหาโหราจักรวาล_${new Date().getTime()}.png`;
        link.click();

        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', timer: 1000, showConfirmButton: false });

    } catch (e) {
        console.error("Save Error:", e);
        Swal.fire('เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง', 'error');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}


/* ======================================================
   ฟังก์ชันแสดงรายละเอียดเมื่อคลิกวันที่
====================================================== */
function showDayDetail(day, month, year) {
    const date = new Date(year, month, day);
    const dayIdx = date.getDay();
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const dayName = thaiDays[dayIdx];
    const thaiYear = year + 543;

    const kala = calculateKalaYok(date);
    const planet = getPlanetTransit(date);
    const colorInfo = COLOR_MASTER[dayName];
    const auspiciousTime = getAuspiciousTime(dayIdx);

    // --- ส่วนคำทำนาย (เหมือนเดิมที่คุณมี) ---
    let doList = "";
    let dontList = "";
    if (dayIdx === kala.thongChai || dayIdx === kala.athibadi) {
        doList = "เหมาะกับการเริ่มต้นสิ่งใหม่, เปิดกิจการ, เจรจาธุรกิจสำคัญ";
        dontList = "ไม่มีข้อห้ามพิเศษ แต่ควรระวังเรื่องการใช้อารมณ์";
    } else if (dayIdx === kala.ubart || dayIdx === kala.lokawinat) {
        doList = "ควรเน้นงานเอกสารหรืองานภายใน, ทำบุญกรวดน้ำ";
        dontList = "ไม่ควรออกรถใหม่, ขึ้นบ้านใหม่ หรือจัดงานมงคลใหญ่ๆ";
    } else {
        doList = "ทำงานตามปกติ, พบปะเพื่อนฝูง, วางแผนโครงการในอนาคต";
        dontList = "งดการตัดสินใจเรื่องการเงินกะทันหัน";
    }

    const dayAnalysis = {
        0: { lucky: "พฤหัสบดี, อังคาร", unlucky: "ศุกร์", numbers: "1, 9, 5" },
        1: { lucky: "พุธ, เสาร์", unlucky: "อาทิตย์", numbers: "2, 4, 6" },
        2: { lucky: "ศุกร์, พฤหัสบดี", unlucky: "จันทร์", numbers: "3, 5, 8" },
        3: { lucky: "จันทร์, ศุกร์", unlucky: "อังคาร", numbers: "4, 2, 7" },
        4: { lucky: "อาทิตย์, อังคาร", unlucky: "เสาร์", numbers: "5, 1, 9" },
        5: { lucky: "อังคาร, จันทร์", unlucky: "พุธกลางคืน", numbers: "6, 3, 5" },
        6: { lucky: "พุธกลางคืน, ศุกร์", unlucky: "พฤหัสบดี", numbers: "7, 8, 2" }
    };
    const result = dayAnalysis[dayIdx];

    const content = `
        <div id="captureArea" style="text-align:left; line-height:1.6; font-size: 15px; background:#fff; padding:20px; border-radius:10px; color:#333;">
            <h3 style="color:${colorInfo.bg}; border-bottom:2px solid ${colorInfo.bg}; padding-bottom:10px; text-align:center; margin-top:0;">
                วัน${dayName}ที่ ${day} ${monthNames[month]} ${thaiYear}
            </h3> 
            <p><strong>🌟 กาลโยค:</strong> ${getKalaStatus(dayIdx, kala)}</p>
            <p><strong>🪐 ดาวประจำวัน:</strong> ${planet.name} (${planet.power})</p>
            <hr style="border:0; border-top:1px solid #eee;">
            <p><strong>⏰ ยามมงคลวันนี้:</strong><br><span style="color:#e67e22; font-weight:bold;">${auspiciousTime}</span></p>
            <hr style="border:0; border-top:1px solid #eee;">
            <p style="color:green;"><strong>✅ สิ่งที่ควรทำ:</strong><br>${doList}</p>
            <p style="color:red;"><strong>❌ สิ่งที่ควรเลี่ยง:</strong><br>${dontList}</p>
            <hr style="border:0; border-top:1px solid #eee;">
            <p><strong>💎 คนที่วันเกิดจะโชคดี:</strong> วัน${result.lucky}</p>
            <p><strong>⚠️ คนที่วันเกิดควรระวัง:</strong> วัน${result.unlucky}</p>
            <hr style="border:0; border-top:1px solid #eee;">
            <p><strong>🔢 เลขนำโชค:</strong> <span style="font-size: 18px; letter-spacing: 2px; color:${colorInfo.bg}; font-weight:bold;">${result.numbers}</span></p>
            <p><strong>🧭 ทิศมงคล:</strong> ทิศ${colorInfo.direction}</p>
            <p><strong>🎨 สีมงคล:</strong> <span style="color:${colorInfo.bg}; font-weight:bold;">${colorInfo.lucky}</span> (เลี่ยงสี${colorInfo.forbidden})</p>
        </div>
        <button onclick="downloadAuspiciousImage(this, '${colorInfo.bg}')" class="btn btn-primary w-100 mt-3 btn-share-image" style="background:${colorInfo.bg}; border:none;">
            📸 บันทึกเป็นรูปภาพเพื่อแชร์
        </button>
    `;

    Swal.fire({
        title: `คำทำนายดวงรายวัน`,
        html: content,
        confirmButtonText: 'รับทราบ',
        confirmButtonColor: colorInfo.bg,
        background: '#fff',
        customClass: {
            title: 'fw-bold'
        }
    });
}



