"use strict";

const COLOR_MASTER = Object.freeze({
    "อาทิตย์": { bg:"#e63946", lucky:"แดง", wealth:"เขียว", power:"ชมพู", forbidden:"น้ำเงิน", direction:"อีสาน", cWealth:"#00ff00", cPower:"#ff69b4", cForbidden:"#5da9ff"},
    "จันทร์": { bg:"#ffb703", lucky:"เหลือง", wealth:"ม่วง", power:"เขียว", forbidden:"แดง", direction:"บูรพา", cWealth:"#da70d6", cPower:"#00ff00", cForbidden:"#ff4d4d"},
    "อังคาร": { bg:"#ff85a1", lucky:"ชมพู", wealth:"ส้ม", power:"ม่วง", forbidden:"เหลือง", direction:"อาคเนย์", cWealth:"#ff9800", cPower:"#da70d6", cForbidden:"#ffff00"},
    "พุธ": { bg:"#2a9d8f", lucky:"เขียว", wealth:"ฟ้า", power:"ส้ม", forbidden:"ชมพู", direction:"ทักษิณ", cWealth:"#5da9ff", cPower:"#ff9800", cForbidden:"#ff69b4"},
    "พฤหัสบดี": { bg:"#f4a261", lucky:"ส้ม", wealth:"แดง", power:"ฟ้า", forbidden:"ม่วง", direction:"พายัพ", cWealth:"#ff4d4d", cPower:"#5da9ff", cForbidden:"#da70d6"},
    "ศุกร์": { bg:"#a2d2ff", lucky:"ฟ้า", wealth:"ชมพู", power:"ขาว", forbidden:"ดำ", direction:"อุดร", cWealth:"#ff69b4", cPower:"#ffffff", cForbidden:"#000000"},
    "เสาร์": { bg:"#7209b7", lucky:"ม่วง", wealth:"ฟ้า", power:"แดง", forbidden:"เขียว", direction:"หรดี", cWealth:"#5da9ff", cPower:"#ff4d4d", cForbidden:"#00ff00"}
});

// สร้างฟังก์ชันช่วยใส่ขอบตัวอักษร (Text Shadow)
const textOutline = "text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0px 0px 4px rgba(0,0,0,0.2);";
const darkOutline = "text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;";

function getThaiDayName(){
    const thaiDays = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
    const now = new Date();
    const index = now.getDay();
    if(index < 0 || index > 6) return "อาทิตย์";
    return thaiDays[index];
}

function renderDailyColors() {
    const headerDiv = document.getElementById("dailyColorHeader");
    if (!headerDiv) return;

    const dayName = getThaiDayName();
    const data = COLOR_MASTER[dayName];
    if (!data) {
        console.error("COLOR_MASTER missing day:", dayName);
        return;
    }

    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    // ฟังก์ชันย่อยสำหรับอัปเดตเฉพาะข้อความเวลา (เพื่อความลื่นไหล)
    const updateTimeUI = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Bangkok' 
        });
        const timeSpan = document.getElementById("liveTimeClock");
        if (timeSpan) timeSpan.innerText = timeStr;
    };

    const nowInTH = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const currentDate = nowInTH.getDate();
    const currentMonth = thaiMonths[nowInTH.getMonth()];
    const currentYear = nowInTH.getFullYear() + 543;

    headerDiv.innerHTML = `
    <div class="reux-card" 
        style="background: linear-gradient(90deg, #1a1a1a, ${data.bg}); 
               color: white; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <div class="card-body py-2 px-3">
            <div class="d-flex justify-content-between align-items-center" onclick="navigateTo('weeklyColorSection') " style="cursor: pointer;">
                <div>
                    <i class="fas fa-calendar-alt text-warning mr-2"></i>
                    <strong>สีมงคล</strong> วัน${dayName}ที่ ${currentDate} ${currentMonth} ${currentYear} 
                    | <i class="fas fa-clock ml-2 mr-1"></i> <span id="liveTimeClock">...</span> น.
                </div>
                <div class="text-right">
                    <span class="mr-3">
                        <i class="fas fa-coins" style="color: #ffd700;"></i> 
                        <strong>โชคลาภ:</strong> <span style="color:${data.cWealth}">สี${data.wealth}</span>
                    </span>
                    <span class="mr-3">
                        <i class="fas fa-crown" style="color: #ff4500;"></i> 
                        <strong>อำนาจ:</strong> <span style="color:${data.cPower}">สี${data.power}</span>
                    </span>
                    <span>
                        <i class="fas fa-ban text-danger"></i> 
                        <strong>กาลกิณี:</strong> <span style="color:${data.cForbidden}">สี${data.forbidden}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `;

    // เริ่มต้นตัวนับเวลา (เรียกครั้งเดียวข้างนอก หรือจัดการด้วย ID เพื่อไม่ให้เกิด Loop ซ้อน)
    if (window.colorClockInterval) clearInterval(window.colorClockInterval);
    updateTimeUI(); // เรียกทันทีครั้งแรก
    window.colorClockInterval = setInterval(updateTimeUI, 1000);
}

function showWeeklyTable(){
    const tableWrapper = document.getElementById("weeklyTableWrapper");
    const tableBody = document.getElementById("weeklyTableBody");
    if(!tableWrapper || !tableBody) return;

    const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
    const currentDay = getThaiDayName();
    let html = "";

    days.forEach(day => {
        const d = COLOR_MASTER[day];
        const isToday = day === currentDay;
        
        // กำหนดสไตล์สำหรับแถวที่เป็นวันปัจจุบัน
        const rowStyle = isToday 
            ? `background-color: rgba(255, 215, 0, 0.15); border: 2px solid #ffd700; transition: 0.3s;` 
            : `border-bottom: 1px solid rgba(255,255,255,0.1);`;
        html += `
        <tr style="${rowStyle}">
            <td style="color:${d.bg}; font-weight:bold; font-size:16px;">
                ${isToday ? '▶ ' : ''} วัน${day}
            </td>
            <td style="color:${d.cWealth}; ">สี${d.wealth}</td>
            <td style="color:${d.cPower}; ">สี${d.power}</td>
            <td style="color:${d.cForbidden}; ">สี${d.forbidden}</td>
            <td style="color:white; ">${d.direction}</td>
        </tr>`;
    });

    tableBody.innerHTML = html;
    tableWrapper.style.display = "block";
}

function colorTable(){
    const container =document.getElementById('colorpage');
    if (!container) return; 
    const html = `
            <div class="card-header bg-dark text-white text-center py-4">
            <i class="fas fa-palette fa-5x text-gold mb-4 animate__animated animate__infinite animate__pulse"></i>
            <h2 class="text-gold mb-1">✨ หอพยากรณ์สีมงคล</h2>
            <h3>ตรวจสอบตารางสีประจำสัปดาห์</h3>
            <p class="text-white-50 mb-0 small">วางแผนเสริมดวงชะตา เลือกสีเสื้อผ้าและทิศมงคลให้เฮงตลอดทั้งอาทิตย์</p>
            <p class="text-muted">ให้พลังแห่งสีสรรค์ช่วยส่งเสริมความสำเร็จในทุกการเจรจาของคุณ</p>
            <div class="mt-4 animate__animated animate__fadeIn" style="text-align: center;">
                <span class="badge badge-outline-gold p-2 " style="white-space: normal;">
                    <i class="fas fa-info-circle mr-1"></i> เคล็ดลับ: หากต้องไปเจรจางานสำคัญ ให้เน้นสีในช่อง "บารมี"
                    เป็นหลัก
                </span>
            </div>
        </div>
        <div id="weeklyTableWrapper" class="mt-2" style="display: none;">
            <div class="weekly-card animate__animated animate__fadeInUp">
                <div class="table-responsive">
                    <table class="table table-borderless text-center mb-0">
                        <thead>
                            <tr>
                                <th class="text-gold-light">วัน</th>
                                <th class="text-gold-light">โชคลาภ (เงิน)</th>
                                <th class="text-gold-light">บารมี (งาน)</th>
                                <th class="text-gold-light">กาลกิณี (ห้าม)</th>
                                <th class="text-gold-light">ทิศมงคล</th>
                            </tr>
                        </thead>
                        <tbody id="weeklyTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
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
        </div>
        </div>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    renderDailyColors();
    colorTable();
    showWeeklyTable();
});