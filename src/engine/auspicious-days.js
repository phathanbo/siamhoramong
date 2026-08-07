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

let currentAuspiciousData = null;

async function downloadAuspiciousImage(element) {
    if (!currentAuspiciousData) return;
    const data = currentAuspiciousData;
    
    let btn = element instanceof HTMLElement ? element : document.querySelector('.btn-share-image');
    const originalText = btn ? btn.innerHTML : "บันทึกรูปภาพ";

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังวาดลายแทง...';
        btn.disabled = true;
    }

    try {
        await document.fonts.ready;
        
        const width = 1080;
        const height = 1350; // 4:5 portrait format for socials
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Background
        let grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, data.bgColor);
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Title Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(80, 80, width - 160, 100, 20);
        else ctx.rect(80, 80, width - 160, 100);
        ctx.fill();
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 50px "Sarabun"';
        ctx.fillStyle = data.bgColor;
        ctx.fillText(`วัน${data.dayName}ที่ ${data.day} ${data.monthName} ${data.thaiYear}`, width/2, 130);
        
        // Content Area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(80, 220, width - 160, height - 360, 20);
        else ctx.rect(80, 220, width - 160, height - 360);
        ctx.fill();
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.font = '400 36px "Sarabun"';
        
        let cy = 260;
        const cx = 130;
        const maxWidth = width - 260;
        const lh = 55;
        
        function drawLine(text, y, color = '#ffffff', bold = false) {
            ctx.font = `${bold ? '700' : '400'} 36px "Sarabun"`;
            ctx.fillStyle = color;
            ctx.fillText(text, cx, y);
            return y + lh;
        }
        
        function drawWrappedText(text, y, color = '#ffffff') {
            ctx.font = '400 36px "Sarabun"';
            ctx.fillStyle = color;
            let pLines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                const segments = segmenter.segment(text);
                let currentLine = "";
                for (const {segment} of segments) {
                    const testLine = currentLine + segment;
                    if (ctx.measureText(testLine).width > maxWidth && currentLine.trim() !== '') {
                        pLines.push(currentLine);
                        currentLine = segment;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            } else {
                let currentLine = "";
                for (let j = 0; j < text.length; j++) {
                    const char = text[j];
                    const testLine = currentLine + char;
                    if (ctx.measureText(testLine).width > maxWidth && j > 0) {
                        pLines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            }
            
            for (let l of pLines) {
                ctx.fillText(l, cx, y);
                y += lh;
            }
            return y;
        }

        cy = drawLine(`🌟 กาลโยค: ${data.kalaStatus}`, cy);
        cy = drawLine(`🪐 ดาวประจำวัน: ${data.planetName} (${data.planetPower})`, cy);
        
        cy += 15;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`⏰ ยามมงคลวันนี้:`, cy);
        cy = drawLine(`${data.auspiciousTime}`, cy, '#f39c12', true);
        
        cy += 15;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`✅ สิ่งที่ควรทำ:`, cy, '#4cd137', true);
        cy = drawWrappedText(`${data.doList}`, cy, '#4cd137');
        
        cy += 15;
        cy = drawLine(`❌ สิ่งที่ควรเลี่ยง:`, cy, '#e84118', true);
        cy = drawWrappedText(`${data.dontList}`, cy, '#e84118');
        
        cy += 15;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`💎 คนที่วันเกิดจะโชคดี: วัน${data.luckyDays}`, cy);
        cy = drawLine(`⚠️ คนที่วันเกิดควรระวัง: วัน${data.unluckyDays}`, cy);
        
        cy += 15;
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🔢 เลขนำโชค: `, cx, cy);
        ctx.font = '700 42px "Sarabun"';
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`${data.numbers}`, cx + 220, cy - 4);
        cy += lh;
        
        cy = drawLine(`🧭 ทิศมงคล: ทิศ${data.direction}`, cy);
        
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🎨 สีมงคล: `, cx, cy);
        ctx.font = '700 36px "Sarabun"';
        ctx.fillStyle = data.bgColor;
        ctx.fillText(`${data.luckyColor}`, cx + 180, cy);
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        const luckyW = ctx.measureText(`${data.luckyColor}`).width;
        ctx.fillText(`(เลี่ยงสี${data.forbiddenColor})`, cx + 180 + luckyW + 20, cy);
        
        // Footer
        const fy = height - 70;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '700 40px "Sarabun"';
        ctx.fillStyle = '#ffd700';
        ctx.fillText("🌌 มหาโหราจักรวาล", 80, fy);
        
        ctx.textAlign = 'right';
        ctx.font = '400 24px "Sarabun"';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText("วิเคราะห์โดย ประธานโบ้", width - 80, fy);
        
        // Export
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
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
    
    currentAuspiciousData = {
        day, monthName: monthNames[month], thaiYear, dayName,
        kalaStatus: getKalaStatus(dayIdx, kala),
        planetName: planet.name, planetPower: planet.power,
        auspiciousTime, doList, dontList,
        luckyDays: result.lucky, unluckyDays: result.unlucky,
        numbers: result.numbers, direction: colorInfo.direction,
        luckyColor: colorInfo.lucky, forbiddenColor: colorInfo.forbidden,
        bgColor: colorInfo.bg
    };

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
        <button onclick="downloadAuspiciousImage(this)" class="btn btn-primary w-100 mt-3 btn-share-image" style="background:${colorInfo.bg}; border:none;">
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



