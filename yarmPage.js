"use strict";

/**
 * ตารางการเดินยามอัฏฐกาล (0 = อาทิตย์, 1 = จันทร์, ..., 6 = เสาร์)
 * 7 = ยามราหู (ยามกลางคืนหรือยามที่ 8 ในบางตำรา)
 */
window.YARM_CHART = {
    day: [
        [0, 6, 4, 2, 7, 5, 3, 0], // อาทิตย์
        [1, 7, 5, 3, 1, 6, 4, 1], // จันทร์
        [2, 0, 6, 4, 2, 7, 5, 2], // อังคาร
        [3, 1, 7, 5, 3, 0, 6, 3], // พุธ
        [5, 3, 1, 7, 5, 2, 0, 5], // พฤหัสบดี
        [6, 4, 2, 0, 6, 1, 7, 6], // ศุกร์
        [4, 2, 0, 6, 4, 3, 1, 4]  // เสาร์
    ],
    night: [
        [5, 3, 1, 7, 5, 2, 0, 5], // อาทิตย์
        [6, 4, 2, 0, 6, 1, 7, 6], // จันทร์
        [4, 2, 0, 6, 4, 3, 1, 4], // อังคาร
        [0, 6, 4, 2, 7, 5, 3, 0], // พุธ
        [1, 7, 5, 3, 1, 6, 4, 1], // พฤหัสบดี
        [2, 0, 6, 4, 2, 7, 5, 2], // ศุกร์
        [3, 1, 7, 5, 3, 0, 6, 3]  // เสาร์
    ]
};

window.YARM_INFO = {
    0: { name: "ยามอาทิตย์", trait: "ร้อนแรง มีอำนาจ", good: "เข้าหาผู้ใหญ่, เริ่มงานใหญ่", bad: "การเจรจาความลับ, ใจร้อนเกินเหตุ" },
    1: { name: "ยามจันทร์", trait: "อ่อนโยน เมตตา", good: "งานบริการ, ติดต่อเพศตรงข้าม", bad: "งานที่ต้องใช้ความเด็ดขาด" },
    2: { name: "ยามอังคาร", trait: "บุกเบิก ขยัน", good: "การแข่งขัน, ทวงหนี้, ออกกำลังกาย", bad: "การทะเลาะวิวาท, ผ่าตัด" },
    3: { name: "ยามพุธ", trait: "เจรจา ปัญญา", good: "ขายของ, เซ็นสัญญา, เขียนจดหมาย", bad: "การโกหกหลอกลวงจะถูกจับได้" },
    4: { name: "ยามเสาร์", trait: "หนักแน่น อดทน", good: "ซื้อที่ดิน, ก่อสร้าง, งานระยะยาว", bad: "งานมงคลรื่นเริง, ความรัก" },
    5: { name: "ยามพฤหัสบดี", trait: "สิริมงคล ครูอาจารย์", good: "เรียนรู้, บวช, ไหว้พระ, พบผู้ใหญ่", bad: "เรื่องอบายมุขทุกชนิด" },
    6: { name: "ยามศุกร์", trait: "ความสุข โชคลาภ", good: "แต่งงาน, ขึ้นบ้านใหม่, ซื้อเสื้อผ้า", bad: "ความเศร้า, งานศพ" },
    7: { name: "ยามราหู", trait: "พลิกแพลง กลลวง", good: "งานกลางคืน, งานเสี่ยงโชค", bad: "การเดินทางไกล, สัญญาสำคัญ" }
};

/**
 * คำนวณยามจาก Input
 */
function calculateYarm() {
    const daySelect = document.getElementById('yarmDaySelect');
    const timeInput = document.getElementById('yarmTimeInput');
    const resDiv = document.getElementById('yarmResult');
    
    if (!timeInput || !timeInput.value) { 
        Swal.fire('แจ้งเตือน', 'กรุณาระบุเวลาครับ', 'warning');
        return; 
    }
    
    const day = parseInt(daySelect.value);
    const [hours, mins] = timeInput.value.split(':').map(Number);
    const totalMins = hours * 60 + mins;
    
    // คำนวณหาตำแหน่งยาม (ยามละ 90 นาที)
    let yarmIndex = 0;
    let isDay = true;
    let startMins = 0;

    if (totalMins >= 360 && totalMins < 1080) { // กลางวัน 06:00 - 17:59
        yarmIndex = Math.floor((totalMins - 360) / 90);
        isDay = true;
        startMins = 360 + (yarmIndex * 90);
    } else { // กลางคืน 18:00 - 05:59
        isDay = false;
        let nightMins = totalMins < 360 ? totalMins + 1440 : totalMins;
        yarmIndex = Math.floor((nightMins - 1080) / 90);
        // ตรวจสอบ Index ไม่ให้เกินขอบเขต (ยามที่ 8 คือ index 7)
        yarmIndex = Math.min(yarmIndex, 7);
        startMins = 1080 + (yarmIndex * 90);
    }

    const formatTime = (total) => {
        let h = Math.floor((total % 1440) / 60);
        let m = total % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const timeRangeStr = `${formatTime(startMins)} - ${formatTime(startMins + 90)}`;
    const starId = isDay ? window.YARM_CHART.day[day][yarmIndex] : window.YARM_CHART.night[day][yarmIndex];
    const info = YARM_INFO[starId];
    const starColor = getStarColor(starId);

    if (resDiv) {
        resDiv.style.display = 'block';
        resDiv.innerHTML = `
            <div class="p-4 bg-dark-soft rounded animate__animated animate__fadeInUp" style="border-left: 5px solid ${starColor}; background: rgba(255,255,255,0.02);">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                        <h4 class="mb-1" style="color: ${starColor}">✨ ${info.name} (${isDay ? 'กลางวัน' : 'กลางคืน'})</h4>
                        <p class="text-gold font-weight-bold mb-3">🕒 ช่วงเวลา: ${timeRangeStr} น.</p>
                    </div>
                    <span class="badge badge-outline mb-2" style="border: 1px solid ${starColor}; color: ${starColor}">ยามที่ ${yarmIndex + 1}</span>
                </div>
                
                <div class="mb-3">
                    <b class="text-white-50">จริตยาม:</b> <span class="text-white">${info.trait}</span>
                </div>
                <hr style="border-top: 1px solid rgba(255,255,255,0.1)">
                <div class="row text-center g-2 mt-3">
                    <div class="col-6">
                        <div class="p-2 border border-success rounded bg-dark h-100">
                            <small class="text-success d-block mb-1 font-weight-bold">✅ เหมาะสำหรับ</small>
                            <span class="small text-white-50">${info.good}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-2 border border-danger rounded bg-dark h-100">
                            <small class="text-danger d-block mb-1 font-weight-bold">⚠️ ควรระวัง</small>
                            <span class="small text-white-50">${info.bad}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function getStarColor(starId) {
    const colors = ["#e63946", "#ffb703", "#ff85a1", "#2a9d8f", "#7209b7", "#f4a261", "#a2d2ff", "#ffffff"];
    return colors[starId] || "#ffffff";
}

/**
 * อัปเดตยามปัจจุบัน (รองรับการข้ามวันตามหลักโหราศาสตร์)
 */
function updateCurrentYarm() {
    const now = new Date();
    let day = now.getDay(); 
    const h = now.getHours();
    const m = now.getMinutes();
    const total = h * 60 + m;

    // ตามหลักยามอัฏฐกาล: ถ้ายังไม่ 06:00 น. ให้ถือว่าเป็นวันเก่า (เช่น ตี 2 วันจันทร์ คือ กลางคืนวันอาทิตย์)
    if (total < 360) {
        day = day === 0 ? 6 : day - 1;
    }

    let yarmIndex, isDay;
    if (total >= 360 && total < 1080) {
        yarmIndex = Math.floor((total - 360) / 90); 
        isDay = true;
    } else {
        let nTotal = total < 360 ? total + 1440 : total;
        yarmIndex = Math.floor((nTotal - 1080) / 90); 
        isDay = false;
    }
    
    yarmIndex = Math.min(yarmIndex, 7);

    const starId = isDay ? window.YARM_CHART.day[day][yarmIndex] : window.YARM_CHART.night[day][yarmIndex];
    const info = YARM_INFO[starId];

    // อัปเดต Navbar
    const navYarm = document.getElementById('navYarmName');
    if (navYarm) navYarm.innerText = info.name;

    // อัปเดต UI ในหน้า Page
    const yarmNowName = document.getElementById('yarmNowName');
    if (yarmNowName) {
        yarmNowName.innerText = info.name;
        yarmNowName.style.color = getStarColor(starId);
    }
    
    const yarmNowTime = document.getElementById('yarmNowTime');
    if (yarmNowTime) {
        yarmNowTime.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} น.`;
    }
}

/**
 * ฟังก์ชันทางลัด: นำทางไปหน้ายามและคำนวณเวลาปัจจุบันทันที
 */
function quickPredictYarm() {
    if (typeof window.navigateTo === "function") {
        window.navigateTo('yarmPage');
    }

    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    
    // หน่วงเวลาเล็กน้อยเพื่อให้ DOM ของหน้า yarmPage โหลดเสร็จก่อน
    setTimeout(() => {
        const daySelect = document.getElementById('yarmDaySelect');
        const timeInput = document.getElementById('yarmTimeInput');

        if (daySelect && timeInput) {
            // เช็คการข้ามวัน
            let day = now.getDay();
            if ((now.getHours() * 60 + now.getMinutes()) < 360) {
                day = day === 0 ? 6 : day - 1;
            }
            
            daySelect.value = day; 
            timeInput.value = `${h}:${m}`;
            calculateYarm();
            
            document.getElementById('yarmResult')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}


function showyarm(){
    const contianer = document.getElementById('showyarmpage')
    if (!contianer) return;
    
    const html = `
    <div class="card-header bg-dark border-gold py-4">
                <h2 class="text-gold mb-1">🕰️ ยามอัฏฐกาลพยากรณ์</h2>
                <span class="text-white-50 mb-0">เลือกเวลาเพื่อดูฤกษ์ยามมงคลตามตำราพรหมชาติ</span>
            <div class="card-body">
                <div id="currentTimeYarm"
                    class="mb-4 p-3 rounded-circle border-gold mx-auto animate__animated animate__pulse animate__infinite"
                    style="width: 200px; height: 200px; display: flex; flex-direction: column; justify-content: center; background: rgba(212, 175, 55, 0.05);">
                    <h6 class="text-gold mb-0 small">ยามปัจจุบัน</h6>
                    <h3 id="yarmNowName" class="mb-0">...</h3>
                    <small id="yarmNowTime" class="text-white-50">...</small>
                </div>
                <div class="form-row justify-content-center mb-4">
                    <div class="col-md-4">
                        <label class="text-white-50">เลือกวัน</label>
                        <select id="yarmDaySelect" onchange="calculateYarm()"
                            class="form-control bg-dark text-white border-gold" style="height: auto;">
                            <option value="0">วันอาทิตย์</option>
                            <option value="1">วันจันทร์</option>
                            <option value="2">วันอังคาร</option>
                            <option value="3">วันพุธ</option>
                            <option value="4">วันพฤหัสบดี</option>
                            <option value="5">วันศุกร์</option>
                            <option value="6">วันเสาร์</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="text-white-50">ระบุเวลา</label>
                        <input type="time" id="yarmTimeInput" onchange="calculateYarm()"
                            class="form-control bg-dark text-white border-gold" style="height: auto;">
                    </div>
                </div>
                <button class="btn btn-gold btn-lg px-5 mb-4 shadow" onclick="calculateYarm()">🔍 ดูคำทำนายยาม</button>

                <div id="yarmResult" class="text-left animate__animated animate__fadeIn" style="display: none;">
                    <div class="p-4 bg-dark-soft rounded border-gold">
                        <h4 id="resYarmTitle" class="text-gold mb-3"></h4>
                        <div id="resYarmDetail" class="text-white"></div>
                        <hr class="border-gold opacity-25">
                        <div class="row text-center mt-3">
                            <div class="col-6 border-right">
                                <small class="text-success d-block">เหมาะสำหรับ</small>
                                <span id="yarmGood"></span>
                            </div>
                            <div class="col-6">
                                <small class="text-danger d-block">ควรระวัง</small>
                                <span id="yarmBad"></span>
                            </div>
                        </div>
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
    `;
    contianer.innerHTML = html;

}


// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', () => {
    showyarm();
    updateCurrentYarm();
    // อัปเดตทุก 1 นาที (60000 ms)
    setInterval(updateCurrentYarm, 60000);
});