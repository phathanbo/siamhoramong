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
    div.className = "yarm-row-mobile animate__animated animate__fadeIn mb-2 p-3 rounded-3";
    div.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-left: 5px solid ${color};
        background: rgba(255, 255, 255, 0.04);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        gap: 12px;
    `;
    
    div.innerHTML = `
        <div style="flex: 1; min-width: 130px;">
            <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 2px;">
                <i class="far fa-clock me-1"></i> ${timeRange}
            </div>
            <div style="color: ${color}; font-size: 1.1rem; font-weight: bold;">
                ${info.name}
            </div>
            <div style="font-size: 0.75rem; letter-spacing: 2px;">${stars}</div>
        </div>
        <div style="flex: 2; text-align: right;">
            <div style="color: #f8fafc; font-size: 0.92rem; font-weight: 500; line-height: 1.4;">
                ${info.good}
            </div>
        </div>
    `;
    return div;
}


function showDailytable() {
    const contianer = document.getElementById('showdailytablepage');
    if (!contianer) return;

    // Set today's date formatted
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayISO = `${year}-${month}-${day}`;

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Main Hero Card -->
            <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
                
                <!-- Header -->
                <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(232, 200, 118, 0.6); box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);" class="mb-2 animate__animated animate__rotateIn">
                        <i class="fas fa-calendar-alt fa-2x" style="color: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));"></i>
                    </div>
                    <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">📅 แผนที่ฤกษ์มงคลรายวัน</h1>
                    <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">วางแผนชีวิตตามจังหวะดวงดาว สรุปเวลาฤกษ์ดีรายชั่วโมงตลอด ๒๔ ชั่วโมง</p>
                </div>
                
                <div class="card-body p-3 p-md-4">
                    
                    <!-- Date Picker Centered -->
                    <div style="max-width: 500px; margin: 0 auto 24px auto;">
                        <label class="form-label fw-bold d-flex align-items-center justify-content-center gap-2 mb-2" style="color: #e8c876;">
                            <i class="fas fa-calendar-day"></i> เลือกวันที่ต้องการวางแผนฤกษ์:
                        </label>
                        <input type="date" id="highlightDatePicker" class="form-control bg-dark text-white border-gold text-center py-2 fs-5 fw-bold"
                            value="${todayISO}" onchange="generateDailyMap()" style="border-color: rgba(212, 175, 55, 0.5); border-radius: 14px;">
                    </div>

                    <!-- Capture Card Box -->
                    <div id="dailyMapCapture" class="p-3 p-md-4 rounded-4" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid rgba(212, 175, 55, 0.35); box-shadow: 0 8px 25px rgba(0,0,0,0.4);">
                        
                        <div class="text-center mb-4 pb-2" style="border-bottom: 1px solid rgba(212,175,55,0.25);">
                            <h3 id="mapDateTitle" class="fw-bold mb-1" style="font-family: 'Chonburi', serif; color: #ffd700; font-size: 1.4rem;"></h3>
                            <small class="text-white-50">ผังยามเสวยอายุและเกณฑ์มงคลรายชั่วโมง</small>
                        </div>
                        
                        <div class="row g-4">
                            <!-- ภาคกลางวัน -->
                            <div class="col-md-6 col-12">
                                <div class="p-2 mb-3 rounded-3 text-center" style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.3);">
                                    <h5 class="mb-0 fw-bold" style="color: #facc15; font-size: 1.1rem;">
                                        <i class="fas fa-sun me-1"></i> ภาคกลางวัน (๐๖:๐๐ - ๑๘:๐๐ น.)
                                    </h5>
                                </div>
                                <div id="dayYarmList"></div>
                            </div>
                            
                            <!-- ภาคกลางคืน -->
                            <div class="col-md-6 col-12">
                                <div class="p-2 mb-3 rounded-3 text-center" style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3);">
                                    <h5 class="mb-0 fw-bold" style="color: #60a5fa; font-size: 1.1rem;">
                                        <i class="fas fa-moon me-1"></i> ภาคกลางคืน (๑๘:๐๐ - ๐๖:๐๐ น.)
                                    </h5>
                                </div>
                                <div id="nightYarmList"></div>
                            </div>
                        </div>

                    </div>

                    <!-- Actions -->
                    <div class="text-center mt-4">
                        <button class="btn btn-gold btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center gap-2 download-btn" onclick="downloadDailyMap(this)" style="border-radius: 50px; font-size: 1.1rem;">
                            <i class="fas fa-image"></i> เซฟเป็นรูปภาพเก็บไว้
                        </button>
                    </div>

                </div>
            </div>

            <!-- Bottom Navigation -->
            <div class="row mt-4 g-2">
                <div class="col-6">
                    <button class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" style="border-radius: 12px; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2);" onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2" style="border-radius: 12px; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2);" onclick="goBack()">
                        <i class="fas fa-home"></i> กลับหน้าหลัก
                    </button>
                </div>
            </div>

        </div>
    `;
    contianer.innerHTML = html;
    generateDailyMap();
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

