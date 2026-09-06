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
    0: { 
        name: "ยามอาทิตย์ (๑)", 
        planet: "ดาวอาทิตย์ (ธาตุไฟ)", 
        trait: "ร้อนแรง มีอำนาจ บารมี มุ่งมั่น ทรงเกียรติ", 
        good: "เข้าหาผู้ใหญ่ ขอความช่วยเหลือ เริ่มต้นงานใหญ่ เปิดตัวโครงการ ประกาศเกียรติคุณ เข้าพบผู้บังคับบัญชา", 
        bad: "การเจรจาความลับ งานที่ต้องใช้ความประนีประนอมสูง ระวังอารมณ์ร้อนวู่วาม",
        icon: "fa-sun",
        element: "เตโชธาตุ (ไฟ)",
        color: "#ef4444"
    },
    1: { 
        name: "ยามจันทร์ (๒)", 
        planet: "ดาวจันทร์ (ธาตุดิน/น้ำ)", 
        trait: "อ่อนโยน เมตตามหานิยม เสน่ห์ ดึงดูดจิตใจ", 
        good: "งานบริการ งานค้าขาย ติดต่อเพศตรงข้าม เจรจาสมานไมตรี ขอความเห็นใจ งานศิลปะการแสดง", 
        bad: "งานที่ต้องใช้ความเด็ดขาด การตัดสินโทษ การปะทะหรือทวงสิทธิ์ที่จริงจัง",
        icon: "fa-moon",
        element: "อาโปธาตุ (น้ำ)",
        color: "#fbbf24"
    },
    2: { 
        name: "ยามอังคาร (๓)", 
        planet: "ดาวอังคาร (ธาตุลม/ไฟ)", 
        trait: "กล้าหาญ บุกเบิก รวดเร็ว ขยัน เด็ดขาด", 
        good: "การแข่งขัน ประมูลงาน ทวงหนี้ ออกกำลังกาย กิจกรรมโลดโผน การปราบปราม เข้าสนามแข่งขัน", 
        bad: "การสู่ขอ แต่งงาน งานพิธีมงคลที่ต้องการความสงบร่มเย็น ระวังอุบัติเหตุและมีปากเสียง",
        icon: "fa-fire",
        element: "วาโยธาตุ (ลมกรด)",
        color: "#ec4899"
    },
    3: { 
        name: "ยามพุธ (๔)", 
        planet: "ดาวพุธ (ธาตุน้ำ)", 
        trait: "เจรจา ปัญญา การค้า การทูต สื่อสารคมคาย", 
        good: "การค้าขาย ปิดการขาย เซ็นสัญญาธุรกิจ ส่งสาร เขียนจดหมาย การประชาสัมพันธ์ สอบสัมภาษณ์", 
        bad: "การให้คำมั่นสัญญาที่ทำไม่ได้จริง การโกหกหลอกลวงจะถูกเปิดโปงทันที",
        icon: "fa-comments",
        element: "วาโยธาตุ (ลมแผ่ว)",
        color: "#10b981"
    },
    4: { 
        name: "ยามเสาร์ (๗)", 
        planet: "ดาวเสาร์ (ธาตุไฟ/ดิน)", 
        trait: "สุขุม หนักแน่น อดทน ยาวนาน มั่นคงถาวร", 
        good: "ซื้อขายอสังหาริมทรัพย์ ที่ดิน ก่อสร้างอาคาร วางรากฐานงานระยะยาว งานเกษตรกรรมและอุตสาหกรรมหนัก", 
        bad: "งานมงคลสมรส งานเลี้ยงรื่นเริง การเริ่มต้นเรื่องความรัก (อาจติดขัด ล่าช้า เหน็ดเหนื่อย)",
        icon: "fa-mountain",
        element: "ปฐวีธาตุ (ดินแข็ง)",
        color: "#8b5cf6"
    },
    5: { 
        name: "ยามพฤหัสบดี (๕)", 
        planet: "ดาวพฤหัสบดี (ธาตุดิน)", 
        trait: "มหาพิชัยมงคล ครูอาจารย์ คุณธรรม สติปัญญา ศิริมงคลสูงสุด", 
        good: "การศึกษาหาความรู้ บวชเรียน ไหว้ครู เข้าพบผู้หลักผู้ใหญ่ ขึ้นบ้านใหม่ เจริญพระพุทธมนต์ ขอพรสิ่งศักดิ์สิทธิ์", 
        bad: "การริเริ่มอบายมุข เสี่ยงโชคแบบผิดกฎหมาย หรือการเอาเปรียบผู้อื่น",
        icon: "fa-graduation-cap",
        element: "ปฐวีธาตุ (ดินบริสุทธิ์)",
        color: "#f59e0b"
    },
    6: { 
        name: "ยามศุกร์ (๖)", 
        planet: "ดาวศุกร์ (ธาตุน้ำ)", 
        trait: "โชคลาภ ทรัพย์สิน ความรื่นรมย์ สุนทรียภาพ ความรักสมหวัง", 
        good: "งานแต่งงาน สู่ขอ ขึ้นบ้านใหม่ เปิดร้านเสริมสวย ซื้อเสื้อผ้า เครื่องประดับ จัดงานเลี้ยงสังสรรค์", 
        bad: "งานศพ งานอวมงคล การพูดคุยเรื่องความทุกข์ระทมหรือความขัดแย้ง",
        icon: "fa-gem",
        element: "อาโปธาตุ (น้ำบริสุทธิ์)",
        color: "#06b6d4"
    },
    7: { 
        name: "ยามราหู (๘)", 
        planet: "ดาวราหู (ธาตุลม)", 
        trait: "พลิกแพลง กลยุทธ์ ไหวพริบ ความลับ พลังเงา", 
        good: "งานกลางคืน สถานบันเทิง เสี่ยงโชคเก็งกำไร งานที่ต้องใช้ไหวพริบแก้เกม งานสายลับการทูตเชิงลึก", 
        bad: "การเดินทางไกล การทำสัญญาเปิดเผย งานบุญมงคลใหญ่ ระวังการถูกหลอกลวงต้มตุ๋น",
        icon: "fa-mask",
        element: "วาโยธาตุ (ลมพายุ)",
        color: "#94a3b8"
    }
};

/**
 * คำนวณยามจาก Input
 */
function calculateYarm() {
    const daySelect = document.getElementById('yarmDaySelect');
    const timeInput = document.getElementById('yarmTimeInput');
    const resDiv = document.getElementById('yarmResult');
    
    if (!timeInput || !timeInput.value) { 
        if (typeof Swal !== 'undefined') {
            Swal.fire('แจ้งเตือน', 'กรุณาระบุเวลาที่ต้องการตรวจสอบครับ', 'warning');
        } else {
            alert('กรุณาระบุเวลาที่ต้องการตรวจสอบครับ');
        }
        return; 
    }
    
    const day = parseInt(daySelect.value);
    const [hours, mins] = timeInput.value.split(':').map(Number);
    const totalMins = hours * 60 + mins;
    
    // คำนวณหาตำแหน่งยาม (ยามละ 90 นาที = 1 ชั่วโมงครึ่ง)
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
    const dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];

    if (resDiv) {
        resDiv.style.display = 'block';
        resDiv.innerHTML = `
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 animate__animated animate__fadeInUp" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid ${info.color}66 !important;">
                
                <div class="card-header py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2" style="background: linear-gradient(90deg, ${info.color}25 0%, rgba(20,24,52,0.8) 100%); border-bottom: 1px solid ${info.color}40;">
                    <div class="d-flex align-items-center gap-3">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${info.color}20; border: 1.5px solid ${info.color}; display: flex; align-items: center; justify-content: center; color: ${info.color};">
                            <i class="fas ${info.icon} fa-lg"></i>
                        </div>
                        <div>
                            <h4 class="mb-0 fw-bold" style="color: #ffd700; font-family: 'Chonburi', serif;">✨ ${info.name}</h4>
                            <small class="text-white-50">${dayNames[day]} · ช่วงเวลา ${isDay ? '☀️ กลางวัน' : '🌙 กลางคืน'} (ยามที่ ${yarmIndex + 1})</small>
                        </div>
                    </div>
                    <span class="badge px-3 py-2 rounded-pill fw-bold" style="background: ${info.color}25; color: ${info.color}; border: 1px solid ${info.color}; font-size: 0.95rem;">
                        <i class="fas fa-clock me-1"></i> ${timeRangeStr} น.
                    </span>
                </div>

                <div class="card-body p-3 p-md-4">
                    
                    <!-- Trait & Element Badge Row -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-6 col-12">
                            <div class="p-3 rounded-3 h-100" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);">
                                <small class="text-gold fw-bold d-block mb-1"><i class="fas fa-fingerprint me-1"></i> ดาวและธาตุครองยาม:</small>
                                <span class="text-white fw-bold fs-6">${info.planet} · ${info.element}</span>
                            </div>
                        </div>
                        <div class="col-md-6 col-12">
                            <div class="p-3 rounded-3 h-100" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);">
                                <small class="text-gold fw-bold d-block mb-1"><i class="fas fa-magic me-1"></i> จริตและอิทธิพลของยาม:</small>
                                <span class="text-light fs-6">${info.trait}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Good vs Bad Aspects -->
                    <div class="row g-3">
                        <div class="col-md-6 col-12">
                            <div class="p-3 p-md-4 rounded-4 h-100" style="background: rgba(34, 197, 94, 0.08); border: 1.5px solid rgba(34, 197, 94, 0.35); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <span style="display:inline-flex; width: 28px; height: 28px; border-radius: 50%; background: #22c55e25; color: #22c55e; align-items: center; justify-content: center; font-weight: bold;">✔</span>
                                    <h5 class="mb-0 fw-bold" style="color: #4ade80;">มงคลและเหมาะสำหรับ</h5>
                                </div>
                                <p class="mb-0 text-light" style="line-height: 1.7; font-size: 0.95rem;">${info.good}</p>
                            </div>
                        </div>
                        <div class="col-md-6 col-12">
                            <div class="p-3 p-md-4 rounded-4 h-100" style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.35); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.08);">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <span style="display:inline-flex; width: 28px; height: 28px; border-radius: 50%; background: #ef444425; color: #ef4444; align-items: center; justify-content: center; font-weight: bold;">⚠️</span>
                                    <h5 class="mb-0 fw-bold" style="color: #f87171;">ข้อพึงระวังและข้อห้าม</h5>
                                </div>
                                <p class="mb-0 text-light" style="line-height: 1.7; font-size: 0.95rem;">${info.bad}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
}

function getStarColor(starId) {
    const colors = ["#ef4444", "#fbbf24", "#ec4899", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#94a3b8"];
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

    // ตามหลักยามอัฏฐกาล: ถ้ายังไม่ 06:00 น. ให้ถือว่าเป็นวันเก่า
    if (total < 360) {
        day = day === 0 ? 6 : day - 1;
    }

    let yarmIndex, isDay, startMins;
    if (total >= 360 && total < 1080) {
        yarmIndex = Math.floor((total - 360) / 90); 
        isDay = true;
        startMins = 360 + (yarmIndex * 90);
    } else {
        let nTotal = total < 360 ? total + 1440 : total;
        yarmIndex = Math.floor((nTotal - 1080) / 90); 
        isDay = false;
        yarmIndex = Math.min(yarmIndex, 7);
        startMins = 1080 + (yarmIndex * 90);
    }

    const formatTime = (t) => {
        let hr = Math.floor((t % 1440) / 60);
        let mn = t % 60;
        return `${hr.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}`;
    };

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
        yarmNowTime.innerText = `เวลาปัจจุบัน ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} น. (ช่วง ${formatTime(startMins)} - ${formatTime(startMins + 90)} น.)`;
    }
    
    const yarmNowIcon = document.getElementById('yarmNowIcon');
    if (yarmNowIcon) {
        yarmNowIcon.className = `fas ${info.icon} fa-3x mb-2`;
        yarmNowIcon.style.color = info.color;
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
    
    setTimeout(() => {
        const daySelect = document.getElementById('yarmDaySelect');
        const timeInput = document.getElementById('yarmTimeInput');

        if (daySelect && timeInput) {
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

function showyarm() {
    const container = document.getElementById('showyarmpage');
    if (!container) return;
    
    const now = new Date();
    let currentDay = now.getDay();
    if ((now.getHours() * 60 + now.getMinutes()) < 360) {
        currentDay = currentDay === 0 ? 6 : currentDay - 1;
    }
    const currentH = now.getHours().toString().padStart(2, '0');
    const currentM = now.getMinutes().toString().padStart(2, '0');

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Main Hero Card -->
            <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
                
                <!-- Header -->
                <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(232, 200, 118, 0.6); box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);" class="mb-3 animate__animated animate__pulse animate__infinite">
                        <i class="fas fa-hourglass-half fa-2x" style="color: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));"></i>
                    </div>
                    <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">🕰️ ยามอัฏฐกาลพยากรณ์</h1>
                    <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">คำนวณและเลือกช่วงเวลาเพื่อตรวจหาฤกษ์ยามมงคลตามตำราพรหมชาติโบราณ</p>
                </div>
                
                <div class="card-body p-3 p-md-4">
                    
                    <!-- Live Current Yarm Orb Card -->
                    <div class="text-center mb-4 p-4 rounded-4" style="background: linear-gradient(145deg, rgba(30, 34, 70, 0.7) 0%, rgba(17, 20, 40, 0.9) 100%); border: 1.5px solid rgba(212, 175, 55, 0.35); box-shadow: inset 0 0 30px rgba(0,0,0,0.4);">
                        <div id="currentTimeYarm" class="mx-auto text-center" style="max-width: 320px;">
                            <div class="d-inline-flex align-items-center justify-content-center mb-2" style="width: 70px; height: 70px; border-radius: 50%; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3);">
                                <i id="yarmNowIcon" class="fas fa-sun fa-2x" style="color: #ffd700;"></i>
                            </div>
                            <small class="text-gold fw-bold text-uppercase d-block letter-spacing-1 mb-1">● ขณะนี้ตรงกับ</small>
                            <h2 id="yarmNowName" class="fw-bold mb-1" style="color: #ffd700; font-family: 'Chonburi', serif; font-size: clamp(1.5rem, 3vw, 2rem);">กำลังคำนวณ...</h2>
                            <span id="yarmNowTime" class="badge bg-dark border border-secondary text-white-50 px-3 py-2 rounded-pill mt-1">...</span>
                        </div>
                    </div>

                    <!-- Filter Control Form -->
                    <div class="card border-0 rounded-4 p-3 p-md-4 mb-4" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.2) !important;">
                        <div class="row g-3 justify-content-center align-items-end">
                            <div class="col-md-5 col-12">
                                <label class="form-label text-gold fw-bold small mb-2"><i class="fas fa-calendar-day me-1"></i> เลือกวันในสัปดาห์</label>
                                <select id="yarmDaySelect" onchange="calculateYarm()" class="form-control text-white" style="background: #151833; border: 1.5px solid rgba(212,175,55,0.4); border-radius: 12px; height: 48px; font-weight: 500;">
                                    <option value="0" ${currentDay === 0 ? 'selected' : ''}>วันอาทิตย์</option>
                                    <option value="1" ${currentDay === 1 ? 'selected' : ''}>วันจันทร์</option>
                                    <option value="2" ${currentDay === 2 ? 'selected' : ''}>วันอังคาร</option>
                                    <option value="3" ${currentDay === 3 ? 'selected' : ''}>วันพุธ</option>
                                    <option value="4" ${currentDay === 4 ? 'selected' : ''}>วันพฤหัสบดี</option>
                                    <option value="5" ${currentDay === 5 ? 'selected' : ''}>วันศุกร์</option>
                                    <option value="6" ${currentDay === 6 ? 'selected' : ''}>วันเสาร์</option>
                                </select>
                            </div>
                            <div class="col-md-4 col-12">
                                <label class="form-label text-gold fw-bold small mb-2"><i class="fas fa-clock me-1"></i> ระบุเวลาที่ต้องการดู (น.)</label>
                                <input type="time" id="yarmTimeInput" value="${currentH}:${currentM}" onchange="calculateYarm()" class="form-control text-white text-center" style="background: #151833; border: 1.5px solid rgba(212,175,55,0.4); border-radius: 12px; height: 48px; font-weight: 600; font-size: 1.1rem;">
                            </div>
                            <div class="col-md-3 col-12">
                                <button class="btn btn-warning w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow" onclick="calculateYarm()" style="background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%); color: #000; border: none; height: 48px; border-radius: 12px;">
                                    <i class="fas fa-search"></i> ดูคำทำนาย
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Yarm Calculation Result Area -->
                    <div id="yarmResult"></div>

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

            <footer class="text-center mt-3 text-white-50 small">
                ข้อมูลยามอัฏฐกาลตามตำราพรหมชาติโบราณ · คำนวณเพื่อใช้เป็นแนวทางประกอบการดำเนินกิจกรรมมงคล
            </footer>

        </div>
    `;
    container.innerHTML = html;
    updateCurrentYarm();
    calculateYarm();
}

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', () => {
    showyarm();
    updateCurrentYarm();
    setInterval(updateCurrentYarm, 60000);
});