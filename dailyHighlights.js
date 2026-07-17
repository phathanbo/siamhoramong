"use strict";

/**
 * เปิดหน้าไฮไลท์ประจำวันและเตรียมข้อมูล
 */
function showDailyHighlightPage() {
    // 1. ตั้งค่าวันที่ใน Input (ใช้เวลาท้องถิ่นแทน ISO เพื่อความแม่นยำของวันที่)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const picker = document.getElementById('highlightDatePicker');
    if (picker) {
        picker.value = `${year}-${month}-${day}`;
    }
    
    // 2. เปลี่ยนหน้า
    if (typeof window.navigateTo === "function") {
        window.navigateTo('dailyHighlightPage');
    }
    
    // 3. วาดตาราง
    generateDailyMap();
}

/**
 * สร้างตารางยามมงคลประจำวัน
 */
function generateDailyMap() {
    const picker = document.getElementById('highlightDatePicker');
    const dayContainer = document.getElementById('dayYarmList');
    const nightContainer = document.getElementById('nightYarmList');
    const titleEl = document.getElementById('mapDateTitle');

    if (!picker || !picker.value || !dayContainer || !nightContainer) return;

    // ตรวจสอบว่ามีข้อมูลยามจากไฟล์อื่นโหลดมาหรือยัง
    if (!window.YARM_CHART || !window.YARM_INFO) {
        console.error("DailyHighlight: YARM_CHART or YARM_INFO is missing.");
        return;
    }

    // [BUG FIX #1] new Date("YYYY-MM-DD") แปลงเป็น UTC ทำให้วันเลื่อนใน timezone GMT+7
    // แก้ไข: แยก token แล้วสร้าง Date ด้วย local time โดยตรง
    const [y, m, d] = picker.value.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    const dayOfWeek = targetDate.getDay();

    // แสดงวันที่ภาษาไทย
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (titleEl) {
        titleEl.innerText = targetDate.toLocaleDateString('th-TH', options);
    }

    dayContainer.innerHTML = '';
    nightContainer.innerHTML = '';

    const timeLabels = [
        "06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00",
        "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30", "16:30 - 18:00",
        "18:00 - 19:30", "19:30 - 21:00", "21:00 - 22:30", "22:30 - 00:00",
        "00:00 - 01:30", "01:30 - 03:00", "03:00 - 04:30", "04:30 - 06:00"
    ];

    // วาดกลางวัน 8 ยาม
    for (let i = 0; i < 8; i++) {
        const starId = window.YARM_CHART.day[dayOfWeek][i];
        dayContainer.appendChild(renderYarmRow(timeLabels[i], starId));
    }

    // วาดกลางคืน 8 ยาม 
    // หมายเหตุ: ตามหลักโหราศาสตร์ ตารางกลางคืนจะอิงตามวันปัจจุบันที่เลือก
    for (let i = 0; i < 8; i++) {
        const starId = window.YARM_CHART.night[dayOfWeek][i];
        nightContainer.appendChild(renderYarmRow(timeLabels[i + 8], starId));
    }
}

/**
 * สร้างแถวข้อมูล HTML ของแต่ละยาม
 */
function renderYarmRow(timeRange, starId) {
    // [BUG FIX #4] Guard กรณี starId ไม่มีใน YARM_INFO เพื่อป้องกัน crash
    const info = window.YARM_INFO[starId];
    if (!info) {
        console.warn(`renderYarmRow: ไม่พบข้อมูลสำหรับ starId="${starId}"`);
        const div = document.createElement('div');
        div.className = "yarm-row-mobile";
        div.style.cssText = "padding: 12px; margin-bottom: 8px; color: #888;";
        div.textContent = `${timeRange} — ไม่พบข้อมูล (starId: ${starId})`;
        return div;
    }

    // เรียกใช้ getStarColor จาก yarmPage.js (ตรวจสอบความพร้อม)
    const color = typeof window.getStarColor === "function" ? window.getStarColor(starId) : "#ffd700";
    
    // Logic การให้คะแนนดาว
    let count = 4;
    if ([0, 1, 5, 6].includes(starId)) count = 5; // กลุ่มมงคลสูง
    else if ([4, 7].includes(starId)) count = 3;  // กลุ่มควรระวัง

    const stars = "⭐".repeat(count);

    const div = document.createElement('div');
    div.className = "yarm-row-mobile animate__animated animate__fadeIn";
    div.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        margin-bottom: 8px;
        border-left: 5px solid ${color};
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
        gap: 10px;
    `;
    
    div.innerHTML = `
        <div style="flex: 1; min-width: 120px;">
            <div style="color: #aaa; font-size: 0.85rem; margin-bottom: 2px;">
                <i class="far fa-clock"></i> ${timeRange}
            </div>
            <div style="color: ${color}; font-size: 1.1rem; font-weight: bold;">
                ${info.name}
            </div>
            <div style="font-size: 0.7rem; letter-spacing: 2px;">${stars}</div>
        </div>
        <div style="flex: 2; text-align: right;">
            <div style="color: #eee; font-size: 0.9rem; font-weight: 500; line-height: 1.3;">
                ${info.good}
            </div>
        </div>
    `;
    return div;
}


function showDailytable() {
    const contianer = document.getElementById('showdailytablepage')
    if (!contianer) return;

    const html = `
            <div class="card shadow-lg border-gold bg-dark text-white">
            <div class="card-header bg-dark border-gold py-3 text-center">
                <h2 class="text-gold mb-1">📅 แผนที่ฤกษ์มงคลรายวัน</h2>
                <span class="text-white-50">วางแผนชีวิตตามจังหวะดวงดาว</span>
            </div>
            <div class="card-body">
                <div class="form-row justify-content-center mb-4">
                    <div class="col-md-6">
                        <label class="text-white-50">เลือกวันที่ต้องการวางแผน</label>
                        <input type="date" id="highlightDatePicker" class="form-control bg-dark text-white border-gold"
                            onchange="generateDailyMap()">
                    </div>
                </div>
                <div id="dailyMapCapture" class="p-3 rounded bg-dark" style="border: 2px solid #d4af37;">
                    <div class="text-center mb-3">
                        <h4 id="mapDateTitle" class="text-gold"></h4>
                        <hr class="border-gold opacity-25">
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="text-warning text-center"><i class="fas fa-sun"></i> ภาคกลางวัน</h6>
                            <div id="dayYarmList"></div>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-info text-center mt-3 mt-md-0"><i class="fas fa-moon"></i> ภาคกลางคืน</h6>
                            <div id="nightYarmList"></div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-gold btn-lg px-5 download-btn" onclick="downloadDailyMap(this)">
                        <i class="fas fa-image mr-2"></i> เซฟเป็นรูปภาพเก็บไว้
                    </button>
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
        </div>
    `;
    contianer.innerHTML = html;
}


function showtabledaily() {
    const contianer = document.getElementById('showtabledailypage')
    if (!contianer) return;

    const html = `
    
    `;
    contianer.innerHTML = html;   

}

document.addEventListener("DOMContentLoaded", () => {
    showDailytable();

    // หาปีปัจจุบัน
    const now = new Date();
    const currentYear = now.getFullYear() + 543;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // เซ็ตค่าเริ่มต้นใน Input
    const picker = document.getElementById("highlightDatePicker");
    if (picker) {
        picker.value = `${currentYear}-${month}-${day}`;
    }

    generateDailyMap();
});


async function downloadDailyMap(element) {
    const picker = document.getElementById('highlightDatePicker');
    if (!picker || !picker.value) {
        if(typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'กรุณาเลือกวันที่ก่อน', 'error');
        else alert('กรุณาเลือกวันที่ก่อน');
        return;
    }

    const btn = (element instanceof HTMLElement) ? element : document.querySelector('.download-btn');
    const originalContent = btn ? btn.innerHTML : "";
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังเตรียมภาพ...';
        btn.disabled = true;
    }

    try {
        if (!window.YARM_CHART || !window.YARM_INFO) {
            throw new Error("ข้อมูลตารางยามมงคลยังไม่พร้อม");
        }

        const [y, m, d] = picker.value.split('-').map(Number);
        const targetDate = new Date(y, m - 1, d);
        const dayOfWeek = targetDate.getDay();

        const timeLabels = [
            "06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00",
            "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30", "16:30 - 18:00",
            "18:00 - 19:30", "19:30 - 21:00", "21:00 - 22:30", "22:30 - 00:00",
            "00:00 - 01:30", "01:30 - 03:00", "03:00 - 04:30", "04:30 - 06:00"
        ];
        
        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3000;
        const ctx = canvas.getContext('2d');
        
        await document.fonts.ready;
        
        const drawContent = (isMeasure = false) => {
            let cy = 80;
            
            if (!isMeasure) {
                ctx.fillStyle = '#121212';
                ctx.fillRect(0, 0, width, canvas.height);
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 4;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(20, 20, width - 40, canvas.height - 40, 20);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(20, 20, width - 40, canvas.height - 40);
                }
                
                const titleEl = document.getElementById('mapDateTitle');
                let dateTitle = titleEl ? titleEl.innerText : targetDate.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                
                ctx.font = '700 46px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(dateTitle, width/2, cy);
                
                cy += 80;
                ctx.strokeStyle = 'rgba(212,175,55,0.25)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(100, cy);
                ctx.lineTo(width - 100, cy);
                ctx.stroke();
                
                cy += 40;
                ctx.font = '700 36px "Sarabun"';
                ctx.fillStyle = '#ffc107'; 
                ctx.fillText("☀️ ภาคกลางวัน", width/4, cy);
                ctx.fillStyle = '#0dcaf0'; 
                ctx.fillText("🌙 ภาคกลางคืน", (width/4)*3, cy);
            } else {
                cy += 80 + 40 + 40;
            }
            
            cy += 60;
            const startYLists = cy;
            
            const renderList = (isDay, startX, colW) => {
                let localCy = startYLists;
                for (let i = 0; i < 8; i++) {
                    const starId = isDay ? window.YARM_CHART.day[dayOfWeek][i] : window.YARM_CHART.night[dayOfWeek][i];
                    const timeRange = timeLabels[isDay ? i : i + 8];
                    const info = window.YARM_INFO[starId];
                    if (!info) continue;
                    
                    const color = typeof window.getStarColor === "function" ? window.getStarColor(starId) : "#ffd700";
                    let count = 4;
                    if ([0, 1, 5, 6].includes(starId)) count = 5;
                    else if ([4, 7].includes(starId)) count = 3;
                    const stars = "⭐".repeat(count);
                    
                    let boxH = 140; 
                    
                    if (!isMeasure) {
                        ctx.fillStyle = 'rgba(255,255,255,0.03)';
                        ctx.fillRect(startX, localCy, colW, boxH);
                        
                        ctx.fillStyle = color;
                        ctx.fillRect(startX, localCy, 8, boxH);
                        
                        ctx.textAlign = 'left';
                        ctx.fillStyle = '#aaaaaa';
                        ctx.font = '400 24px "Sarabun"';
                        ctx.fillText(timeRange, startX + 25, localCy + 25);
                        
                        ctx.fillStyle = color;
                        ctx.font = '700 32px "Sarabun"';
                        ctx.fillText(info.name, startX + 25, localCy + 70);
                        
                        ctx.font = '24px "Sarabun"';
                        ctx.fillText(stars, startX + 25, localCy + 105);
                        
                        ctx.textAlign = 'right';
                        ctx.fillStyle = '#eeeeee';
                        ctx.font = '500 26px "Sarabun"';
                        
                        const maxRightW = colW - 170;
                        let text = info.good;
                        let lines = [];
                        
                        if (window.Intl && window.Intl.Segmenter) {
                            const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                            const segments = segmenter.segment(text);
                            let currentLine = "";
                            for (const {segment} of segments) {
                                const testLine = currentLine + segment;
                                if (ctx.measureText(testLine).width > maxRightW && currentLine.trim() !== '') {
                                    lines.push(currentLine);
                                    currentLine = segment;
                                } else {
                                    currentLine = testLine;
                                }
                            }
                            lines.push(currentLine);
                        } else {
                            let currentLine = "";
                            for (let j = 0; j < text.length; j++) {
                                const char = text[j];
                                const testLine = currentLine + char;
                                if (ctx.measureText(testLine).width > maxRightW && j > 0) {
                                    lines.push(currentLine);
                                    currentLine = char;
                                } else {
                                    currentLine = testLine;
                                }
                            }
                            lines.push(currentLine);
                        }
                        
                        let tY = localCy + (boxH/2) - ((lines.length * 30)/2) + 10;
                        for(let l of lines) {
                            ctx.fillText(l.trim(), startX + colW - 20, tY);
                            tY += 35;
                        }
                    }
                    localCy += boxH + 15;
                }
                return localCy;
            };
            
            const colWidth = 460;
            const leftColY = renderList(true, 55, colWidth);
            const rightColY = renderList(false, 55 + colWidth + 50, colWidth);
            
            cy = Math.max(leftColY, rightColY);
            
            cy += 40;
            if (!isMeasure) {
                ctx.strokeStyle = 'rgba(212,175,55,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(100, cy);
                ctx.lineTo(width-100, cy);
                ctx.stroke();
                
                cy += 30;
                ctx.textAlign = 'center';
                ctx.fillStyle = '#d4af37';
                ctx.font = '700 28px "Sarabun"';
                ctx.fillText("🔮 สยามโหรามงคล", width/2, cy);
                
                cy += 35;
                ctx.fillStyle = 'rgba(212,175,55,0.7)';
                ctx.font = '400 22px "Sarabun"';
                ctx.fillText("ลิขสิทธิ์ข้อมูลตามตำราทักษาพยากรณ์", width/2, cy);
            }
            
            cy += 50;
            return cy;
        }
        
        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);
        
        const titleEl = document.getElementById('mapDateTitle');
        let dateTitle = titleEl ? titleEl.innerText : 'Daily';
        
        const link = document.createElement('a');
        link.download = `ฤกษ์มงคล_${dateTitle.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (btn) {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    } catch (e) {
        console.error("Capture Error:", e);
        if(typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้: ' + e.message, 'error');
        else alert('เกิดข้อผิดพลาด: ' + e.message);
        
        if (btn) {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    }
}

