// ==========================================
// 1. ข้อมูลฐานระบบ (Database)
// ==========================================

const TABOO_DATA = {
    0: { day: "อาทิตย์", good: ["สระผม (อายุยืน)", "ตัดผม (อายุยืน)", "นุ่งผ้าใหม่ (ชนะศัตรู)"], bad: ["ตัดเล็บ (จะมีศัตรู)", "ห้ามขึ้นบ้านใหม่"] },
    1: { day: "จันทร์", good: ["สระผม (มีลาภ)", "ตัดผม (จะมีลาภ)", "ตัดเล็บ (มีลาภใหญ่)"], bad: ["ห้ามทำของหาย", "ห้ามเดินทางไกลทางน้ำ"] },
    2: { day: "อังคาร", good: ["สระผม (ชนะศัตรู)", "โกนหนวดเครา"], bad: ["ตัดผม (ศัตรูจะทำร้าย)", "นุ่งผ้าใหม่", "ตัดเล็บ"] },
    3: { day: "พุธ", good: ["นุ่งผ้าใหม่ (มีสุขมาก)", "ตัดเล็บ"], bad: ["สระผม", "ตัดผม (พุธหัวกุด)"] },
    4: { day: "พฤหัสบดี", good: ["สระผม", "ตัดผม", "นุ่งผ้าใหม่"], bad: ["ตัดเล็บ (จะมีทุกข์)"] },
    5: { day: "ศุกร์", good: ["สระผม", "ตัดผม", "นุ่งผ้าใหม่", "ตัดเล็บ"], bad: ["ห้ามขึ้นบ้านใหม่"] },
    6: { day: "เสาร์", good: ["สระผม", "ตัดผม"], bad: ["นุ่งผ้าใหม่", "ตัดเล็บ"] }
};

const DIRECTION_DATA = {
    0: { lucky: "ทิศตะวันออก", blind: "ทิศตะวันตกเฉียงเหนือ" },
    1: { lucky: "ทิศตะวันตก", blind: "ทิศตะวันออก" },
    2: { lucky: "ทิศตะวันออก", blind: "ทิศตะวันออกเฉียงเหนือ" },
    3: { lucky: "ทิศเหนือ", blind: "ทิศเหนือ" },
    4: { lucky: "ทิศเหนือ", blind: "ทิศใต้" },
    5: { lucky: "ทิศตะวันออก", blind: "ทิศตะวันตก" },
    6: { lucky: "ทิศใต้", blind: "ทิศตะวันออกเฉียงใต้" }
};

const ZODIAC_RELATIONS = {
    "ชวด": { great: ["มะโรง", "วอก"], bad: ["มะเมีย"] },
    "ฉลู": { great: ["มะเส็ง", "ระกา"], bad: ["มะแม"] },
    "ขาล": { great: ["มะเมีย", "จอ"], bad: ["วอก"] },
    "เถาะ": { great: ["มะแม", "กุน"], bad: ["ระกา"] },
    "มะโรง": { great: ["ชวด", "วอก"], bad: ["จอ"] },
    "มะเส็ง": { great: ["ฉลู", "ระกา"], bad: ["กุน"] },
    "มะเมีย": { great: ["ขาล", "จอ"], bad: ["ชวด"] },
    "มะแม": { great: ["เถาะ", "กุน"], bad: ["ฉลู"] },
    "วอก": { great: ["ชวด", "มะโรง"], bad: ["ขาล"] },
    "ระกา": { great: ["ฉลู", "มะเส็ง"], bad: ["เถาะ"] },
    "จอ": { great: ["ขาล", "มะเมีย"], bad: ["มะโรง"] },
    "กุน": { great: ["เถาะ", "มะแม"], bad: ["มะเส็ง"] }
};

// ==========================================
// 2. ฟังก์ชันการทำงาน (Logic)
// ==========================================

function updateDirectionDisplay(dayIndex) {
    const dir = DIRECTION_DATA[dayIndex];
    const container = document.getElementById('directionContainer');
    if (!container || !dir) return;

    container.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6 col-12">
                <div class="p-3 p-md-4 rounded-4 h-100 text-center d-flex flex-column justify-content-center" 
                     style="background: linear-gradient(145deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%); border: 1.5px solid rgba(34, 197, 94, 0.35); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);">
                    <div class="mb-2">
                        <span class="badge px-3 py-1 rounded-pill fw-bold" style="background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); font-size: 0.85rem;">
                            <i class="fas fa-compass me-1"></i> ทิศโชคลาภ-สิริมงคล
                        </span>
                    </div>
                    <div class="fs-4 fw-bold" style="color: #4ade80; font-family: 'Chonburi', serif;">${dir.lucky}</div>
                    <small class="text-white-50 mt-1">${dir.luckyDesc || 'ทิศมงคล เสริมโชคลาภบารมี'}</small>
                </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="p-3 p-md-4 rounded-4 h-100 text-center d-flex flex-column justify-content-center" 
                     style="background: linear-gradient(145deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%); border: 1.5px solid rgba(239, 68, 68, 0.35); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.08);">
                    <div class="mb-2">
                        <span class="badge px-3 py-1 rounded-pill fw-bold" style="background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); font-size: 0.85rem;">
                            <i class="fas fa-ban me-1"></i> ทิศกาลกิณี-ห้ามยาตรา
                        </span>
                    </div>
                    <div class="fs-4 fw-bold" style="color: #f87171; font-family: 'Chonburi', serif;">${dir.blind}</div>
                    <small class="text-white-50 mt-1">${dir.blindDesc || 'ทิศอับโชค พึงหลีกเลี่ยงการออกเดินทาง'}</small>
                </div>
            </div>
        </div>
    `;
}

function updateZodiacLuckDisplay(dayIndex) {
    const dayZodiacs = ["มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ"];
    const currentDayZodiac = dayZodiacs[dayIndex];
    
    let great = [];
    let bad = [];
    
    for (let zodiac in ZODIAC_RELATIONS) {
        if (ZODIAC_RELATIONS[zodiac].great.includes(currentDayZodiac)) great.push(zodiac);
        if (ZODIAC_RELATIONS[zodiac].bad.includes(currentDayZodiac)) bad.push(zodiac);
    }
    
    const greatEl = document.getElementById('zodiacGreat');
    const badEl = document.getElementById('zodiacBad');
    
    if (greatEl) {
        greatEl.innerHTML = great.length 
            ? great.map(z => `<span class="badge px-3 py-2 rounded-pill fw-bold" style="background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.35); font-size: 0.95rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">ปี${z}</span>`).join(' ') 
            : '<span class="text-white-50">- ไม่มีเกณฑ์พิเศษ -</span>';
    }
    if (badEl) {
        badEl.innerHTML = bad.length 
            ? bad.map(z => `<span class="badge px-3 py-2 rounded-pill fw-bold" style="background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.35); font-size: 0.95rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">ปี${z}</span>`).join(' ') 
            : '<span class="text-white-50">- ไม่มีเกณฑ์พิเศษ -</span>';
    }
}


function showdailytaboo(){
    const container = document.getElementById('showdailytaboopage');
    if (!container) return;

    const days = [
        { idx: 0, name: 'วันอาทิตย์', short: 'อา.', color: '#ef4444' },
        { idx: 1, name: 'วันจันทร์', short: 'จ.', color: '#facc15' },
        { idx: 2, name: 'วันอังคาร', short: 'อ.', color: '#ec4899' },
        { idx: 3, name: 'วันพุธ', short: 'พ.', color: '#22c55e' },
        { idx: 4, name: 'วันพฤหัสบดี', short: 'พฤ.', color: '#f97316' },
        { idx: 5, name: 'วันศุกร์', short: 'ศ.', color: '#38bdf8' },
        { idx: 6, name: 'วันเสาร์', short: 'ส.', color: '#a855f7' }
    ];

    const todayIdx = new Date().getDay();
    const currentDay = typeof currentSelectedDay !== 'undefined' ? currentSelectedDay : todayIdx;

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1200px; margin: 0 auto;">
            
            <!-- Hero Header Card -->
            <div class="card border-0 rounded-4 overflow-hidden mb-4 shadow-lg" style="background: radial-gradient(circle at top, #1e2246 0%, #101226 70%, #0a0b18 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important;">
                <div class="card-body p-4 p-md-5 text-center position-relative">
                    
                    <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.35); box-shadow: 0 0 20px rgba(212,175,55,0.2);">
                        <i class="fas fa-book-reader text-warning"></i>
                        <span style="color: #ffd700; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.5px;">คัมภีร์พรหมชาติ & กาลโยคโบราณ</span>
                    </div>

                    <h1 class="fw-bold mb-2" style="color: #ffd700; font-family: 'Chonburi', 'Cinzel', serif; font-size: clamp(2rem, 5vw, 2.7rem); text-shadow: 0 2px 10px rgba(0,0,0,0.7);">
                        <i class="fas fa-calendar-check me-2 text-warning"></i> ข้อห้ามและฤกษ์มงคลรายวัน
                    </h1>
                    <p class="text-white-50 mx-auto mb-4" style="max-width: 650px; font-size: 1rem; line-height: 1.6;">
                        ตำราโบราณว่าด้วยกิจที่ควรทำ กิจที่พึงละเว้น ทิศมหาลาภ-กาลกิณี และเกณฑ์สมพงษ์ตามปีนักษัตร
                    </p>

                    <!-- Day Selector Pills / Grid -->
                    <div class="d-flex flex-wrap justify-content-center gap-2 mb-2" style="display: flex !important; flex-wrap: wrap !important; justify-content: center !important; gap: 8px !important;">
                        ${days.map(d => `
                            <div id="taboo-btn-${d.idx}"
                                 class="taboo-day-item ${d.idx === currentDay ? 'active' : ''}" 
                                 onclick="selectTabooDay(${d.idx})" 
                                 style="cursor: pointer; display: inline-flex !important; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px !important; border-radius: 50px !important; font-weight: 700 !important; font-size: 0.95rem !important; transition: all 0.25s ease !important; user-select: none; width: auto !important; max-width: none !important; ${d.idx === currentDay ? 
                                    'background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%) !important; color: #0b1220 !important; box-shadow: 0 0 16px rgba(255,215,0,0.6) !important; border: 1.5px solid #ffd700 !important; transform: scale(1.06);' : 
                                    'background: rgba(255,255,255,0.07) !important; color: #f1f5f9 !important; border: 1px solid rgba(255,255,255,0.18) !important;'}">
                                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${d.color}; box-shadow: 0 0 6px ${d.color};"></span>
                                <span>${d.name}</span>
                                ${d.idx === todayIdx ? '<span style="background: #ef4444; color: #fff; font-size: 0.7rem; padding: 2px 7px; border-radius: 10px; margin-left: 2px;">วันนี้</span>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <input type="hidden" id="tabooDaySelect" value="${currentDay}">
                </div>
            </div>

            <!-- Content Presentation Card (Capture Area) -->
            <div id="tabooCaptureArea" class="card border-0 rounded-4 overflow-hidden mb-4 shadow-lg animate__animated animate__fadeIn" style="background: linear-gradient(145deg, #131730 0%, #0d0f21 100%); border: 1.5px solid rgba(212, 175, 55, 0.3) !important;">
                
                <!-- Day Banner -->
                <div class="p-4 text-center position-relative" style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); background: rgba(0,0,0,0.25);">
                    <div class="d-inline-block p-3 rounded-circle mb-2" id="dayIconContainer" style="background: rgba(255,215,0,0.1); border: 1.5px solid rgba(255,215,0,0.3);">
                        <i id="dayMainIcon" class="fas fa-sun fa-2x" style="color: #ffd700;"></i>
                    </div>
                    <h2 id="tabooDayTitle" class="fw-bold mb-1" style="color: #ffd700; font-family: 'Chonburi', serif; font-size: clamp(1.8rem, 4vw, 2.4rem);">วัน...</h2>
                    <div id="current-date-display" class="text-white-50 small">สยามโหรามงคล • พรหมชาติ & กาลโยค</div>
                </div>

                <div class="p-3 p-md-4">
                    <!-- 2 Columns: Good & Bad Lists -->
                    <div class="row g-3 g-md-4 mb-4">
                        
                        <!-- Good List Column -->
                        <div class="col-lg-6 col-12">
                            <div class="p-3 p-md-4 rounded-4 h-100 position-relative" style="background: rgba(34, 197, 94, 0.05); border: 1.5px solid rgba(34, 197, 94, 0.3); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.05);">
                                <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px dashed rgba(34, 197, 94, 0.3);">
                                    <div class="d-flex align-items-center justify-content-center rounded-circle" style="width: 36px; height: 36px; background: rgba(34, 197, 94, 0.2); color: #4ade80;">
                                        <i class="fas fa-check-circle fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 class="mb-0 fw-bold" style="color: #4ade80;">สิ่งที่ควรทำ / กิจมงคล</h5>
                                        <small class="text-white-50">เสริมสิริมงคล เมตตามหานิยม</small>
                                    </div>
                                </div>
                                <div id="goodList" class="d-flex flex-column gap-2"></div>
                            </div>
                        </div>

                        <!-- Bad List Column -->
                        <div class="col-lg-6 col-12">
                            <div class="p-3 p-md-4 rounded-4 h-100 position-relative" style="background: rgba(239, 68, 68, 0.05); border: 1.5px solid rgba(239, 68, 68, 0.3); box-shadow: 0 4px 20px rgba(239, 68, 68, 0.05);">
                                <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px dashed rgba(239, 68, 68, 0.3);">
                                    <div class="d-flex align-items-center justify-content-center rounded-circle" style="width: 36px; height: 36px; background: rgba(239, 68, 68, 0.2); color: #f87171;">
                                        <i class="fas fa-ban fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 class="mb-0 fw-bold" style="color: #f87171;">สิ่งที่ควรเลี่ยง / ข้อห้าม</h5>
                                        <small class="text-white-50">พึงละเว้นเพื่อความแคล้วคลาด</small>
                                    </div>
                                </div>
                                <div id="badList" class="d-flex flex-column gap-2"></div>
                            </div>
                        </div>

                    </div>

                    <!-- Directions Section -->
                    <div class="mb-4">
                        <div id="directionContainer"></div>
                    </div>

                    <!-- Zodiac Relations Section -->
                    <div class="p-3 p-md-4 rounded-4" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(212, 175, 55, 0.2);">
                        <div class="text-center mb-3">
                            <h5 class="fw-bold mb-1" style="color: #ffd700; font-family: 'Chonburi', serif;">
                                <i class="fas fa-star text-warning me-2"></i> เกณฑ์ดวงสมพงษ์ตามปีนักษัตร
                            </h5>
                            <small class="text-white-50">ความสัมพันธ์ของปีเกิดกับพลังงานประจำวัน</small>
                        </div>
                        
                        <div class="row g-3 text-center">
                            <div class="col-md-6 col-12">
                                <div class="p-3 rounded-3 h-100" style="background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.25);">
                                    <div class="d-flex align-items-center justify-content-center gap-1 text-success fw-bold mb-2">
                                        <i class="fas fa-thumbs-up"></i>
                                        <span>ปีนักษัตรที่มงคลยิ่ง / เกื้อหนุน</span>
                                    </div>
                                    <div id="zodiacGreat" class="d-flex flex-wrap justify-content-center gap-2 pt-1"></div>
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="p-3 rounded-3 h-100" style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.25);">
                                    <div class="d-flex align-items-center justify-content-center gap-1 text-danger fw-bold mb-2">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span>ปีนักษัตรที่ควรระวัง / ชงประจำวัน</span>
                                    </div>
                                    <div id="zodiacBad" class="d-flex flex-wrap justify-content-center gap-2 pt-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Bar inside Card -->
                    <div class="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3" style="border-top: 1px solid rgba(212, 175, 55, 0.2);">
                        <button class="btn px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 shadow" 
                                style="background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%); color: #000; border: none;" 
                                onclick="downloadTabooImage()">
                            <i class="fas fa-download"></i> ดาวน์โหลดรูปภาพคำทำนาย
                        </button>
                    </div>

                </div>
            </div>

            <!-- Footer Navigation Buttons -->
            <div class="row g-3">
                <div class="col-6">
                    <button class="btn btn-outline-light w-100 py-3 rounded-4 d-flex align-items-center justify-content-center gap-2 shadow-sm" 
                            style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.2); transition: all 0.3s;" 
                            onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> <span>กลับห้องพยากรณ์</span>
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-outline-light w-100 py-3 rounded-4 d-flex align-items-center justify-content-center gap-2 shadow-sm" 
                            style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.2); transition: all 0.3s;" 
                            onclick="goBack()">
                        <i class="fas fa-home"></i> <span>กลับหน้าหลัก</span>
                    </button>
                </div>
            </div>

            <p class="text-center text-white-50 small mt-4 mb-2">
                ตำราข้อห้ามและฤกษ์มงคลรายวัน คำนวณตามหลักวิชาพรหมชาติและกาลโยคโบราณเพื่อความสวัสดีมีชัย
            </p>

        </div>
    `;
    container.innerHTML = html;
    updateDailyTaboo(currentDay);
}

function selectTabooDay(dayIndex) {
    currentSelectedDay = dayIndex;
    const select = document.getElementById('tabooDaySelect');
    if (select) select.value = dayIndex;

    const days = [0, 1, 2, 3, 4, 5, 6];
    days.forEach(d => {
        const btn = document.getElementById('taboo-btn-' + d);
        if (btn) {
            if (d === dayIndex) {
                btn.style.setProperty('background', 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)', 'important');
                btn.style.setProperty('color', '#0b1220', 'important');
                btn.style.setProperty('box-shadow', '0 0 16px rgba(255,215,0,0.6)', 'important');
                btn.style.setProperty('border', '1.5px solid #ffd700', 'important');
                btn.style.setProperty('transform', 'scale(1.06)', 'important');
            } else {
                btn.style.setProperty('background', 'rgba(255,255,255,0.07)', 'important');
                btn.style.setProperty('color', '#f1f5f9', 'important');
                btn.style.setProperty('box-shadow', 'none', 'important');
                btn.style.setProperty('border', '1px solid rgba(255,255,255,0.18)', 'important');
                btn.style.setProperty('transform', 'none', 'important');
            }
        }
    });

    updateDailyTaboo(dayIndex);
}


// ==========================================
// 3. เริ่มทำงานตอนโหลดหน้า (Initialization)
// ==========================================

function updateDailyTaboo(dayIndex) {
    const data = TABOO_DATA[dayIndex];
    if (!data) return;

    const dayTitle = document.getElementById('tabooDayTitle');
    const goodList = document.getElementById('goodList');
    const badList = document.getElementById('badList');
    const dayMainIcon = document.getElementById('dayMainIcon');

    if (dayTitle) dayTitle.innerText = "วัน" + data.day;
    if (dayMainIcon && data.icon) {
        dayMainIcon.className = `fas ${data.icon} fa-2x`;
        dayMainIcon.style.color = data.color || '#ffd700';
    }

    if (goodList) {
        goodList.innerHTML = data.good.map(item => `
            <div class="p-3 rounded-3 d-flex align-items-center gap-3 transition-all" style="background: rgba(34, 197, 94, 0.08); border: 1.5px solid rgba(34, 197, 94, 0.25);">
                <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 30px; height: 30px; background: rgba(34, 197, 94, 0.25); color: #4ade80;">
                    <i class="fas fa-check small"></i>
                </div>
                <div class="text-white fw-bold" style="font-size: 1rem;">${item}</div>
            </div>
        `).join('');
    }

    if (badList) {
        badList.innerHTML = data.bad.map(item => `
            <div class="p-3 rounded-3 d-flex align-items-center gap-3 transition-all" style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.25);">
                <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 30px; height: 30px; background: rgba(239, 68, 68, 0.25); color: #f87171;">
                    <i class="fas fa-times small"></i>
                </div>
                <div class="text-white fw-bold" style="font-size: 1rem;">${item}</div>
            </div>
        `).join('');
    }

    updateDirectionDisplay(dayIndex);
    updateZodiacLuckDisplay(dayIndex);
}

function changeTabooDay() {
    const select = document.getElementById('tabooDaySelect');
    if (select) selectTabooDay(parseInt(select.value));
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const dayIndex = now.getDay();
    currentSelectedDay = dayIndex;

    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dateStr = "วันนี้: " + now.toLocaleDateString('th-TH', options);
        if (typeof getThaiLunar === 'function') {
            const lunar = getThaiLunar(now);
            if (lunar && lunar.fullString) {
                dateStr += ` (${lunar.fullString})`;
            }
        }
        dateDisplay.innerText = dateStr;
    }

    showdailytaboo();
});

// ==========================================
// 4. บันทึกรูปภาพ (Image Generator)
// ==========================================

async function downloadTabooImage() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'กำลังสร้างรูปภาพ...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });
    }

    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#101226');
        bgGrad.addColorStop(1, '#080912');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Outer Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 8;
        ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
        
        // Inner Dashed Border
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        ctx.setLineDash([]);

        const dayTitle = document.getElementById('tabooDayTitle')?.innerText || 'วัน...';
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 75px "Sarabun", sans-serif';
        ctx.fillText(dayTitle, canvas.width / 2, 70);
        
        ctx.font = '26px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('สยามโหรามงคล • กฎเกณฑ์ตามคัมภีร์พรหมชาติ', canvas.width / 2, 160);
        
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('เคล็ดลับมงคลและข้อห้ามประจำวัน', canvas.width / 2, 220);
        
        // Good / Bad section
        const drawList = (items, startX, startY, isGood) => {
            ctx.textAlign = 'center';
            ctx.font = 'bold 32px "Sarabun", sans-serif';
            ctx.fillStyle = isGood ? '#4ade80' : '#f87171';
            ctx.fillText(isGood ? '✔ สิ่งที่ควรทำ / กิจมงคล' : '⚠️ สิ่งที่ควรเลี่ยง / ข้อห้าม', startX, startY);
            
            ctx.font = '26px "Sarabun", sans-serif';
            ctx.fillStyle = '#ffffff';
            let curY = startY + 60;
            items.forEach(item => {
                let txt = item.innerText || item.textContent;
                txt = txt.replace(/^[✔⚠️✅🚫\s]+/, '');
                ctx.fillText(txt, startX, curY);
                curY += 48;
            });
        };
        
        const goodItems = document.querySelectorAll('#goodList > div');
        const badItems = document.querySelectorAll('#badList > div');
        
        drawList(Array.from(goodItems), canvas.width / 4, 300, true);
        drawList(Array.from(badItems), (canvas.width / 4) * 3, 300, false);
        
        // Line separator
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 300);
        ctx.lineTo(canvas.width / 2, 580);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(80, 620);
        ctx.lineTo(canvas.width - 80, 620);
        ctx.stroke();
        
        // Direction Section
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('ทิศมงคลและทิศกาลกิณี', canvas.width / 2, 650);
        
        const dir = typeof DIRECTION_DATA !== 'undefined' && typeof currentSelectedDay !== 'undefined' ? DIRECTION_DATA[currentSelectedDay] : null;
        const dirLucky = dir?.lucky || '-';
        const dirBlind = dir?.blind || '-';
        
        ctx.font = 'bold 28px "Sarabun", sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('🎯 ทิศโชคลาภ', canvas.width / 4, 720);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dirLucky, canvas.width / 4, 765);
        
        ctx.fillStyle = '#f87171';
        ctx.fillText('🚫 ทิศกาลกิณี', (canvas.width / 4) * 3, 720);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dirBlind, (canvas.width / 4) * 3, 765);
        
        ctx.beginPath();
        ctx.moveTo(80, 830);
        ctx.lineTo(canvas.width - 80, 830);
        ctx.stroke();
        
        // Zodiac Section
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('เกณฑ์ดวงตามปีนักษัตร', canvas.width / 2, 860);
        
        const zGreat = document.getElementById('zodiacGreat')?.innerText || '-';
        const zBad = document.getElementById('zodiacBad')?.innerText || '-';
        
        ctx.font = 'bold 28px "Sarabun", sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('🚀 ปีที่มงคลยิ่ง', canvas.width / 4, 925);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(zGreat, canvas.width / 4, 970);
        
        ctx.fillStyle = '#f87171';
        ctx.fillText('⚠️ ปีที่ควรระวัง', (canvas.width / 4) * 3, 925);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(zBad, (canvas.width / 4) * 3, 970);

        const link = document.createElement('a');
        link.download = `ดวงรายวัน_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (typeof Swal !== 'undefined') Swal.close();
    } catch (e) {
        console.error("Capture Failed:", e);
        if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้', 'error');
    }
}