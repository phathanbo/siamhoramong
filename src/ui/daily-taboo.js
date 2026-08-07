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
        <div class="direction-card">
            <h6 class="text-gold text-center mb-3"><i class="fas fa-compass"></i> ทิศมงคลประจำวัน</h6>
            <div class="row text-center">
                <div class="col-6 border-right-gold">
                    <span class="badge badge-success mb-2">🎯 ทิศโชคลาภ</span>
                    <div class="text-white font-weight-bold">${dir.lucky}</div>
                </div>
                <div class="col-6">
                    <span class="badge badge-danger mb-2">🚫 ทิศกาลกิณี</span>
                    <div class="text-white font-weight-bold">${dir.blind}</div>
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
    
    if (greatEl) greatEl.innerText = great.join(', ') || "-";
    if (badEl) badEl.innerText = bad.join(', ') || "-";
}


function showdailytaboo(){
    const contianer = document.getElementById('showdailytaboopage')
    if (!contianer) return;
    
    const html = `
            <div class="card-header bg-dark border-gold py-3 text-center">
                <h2 class="text-gold mb-1">📜 ข้อห้ามรายวัน</h2>
                <div class="selection-grid" style="margin-bottom: 20px; display: flex; justify-content: center;">
                    <div class="input-box" style="width: 100%; max-width: 400px; text-align: center;">
                        <label style="display: block; margin-bottom: 8px; color: #f0f0f0;">เลือกวันเพื่อดูคำทำนาย</label>
                        <select id="tabooDaySelect" class="form-control"
                            style="text-align: center; text-align-last: center;" onchange="changeTabooDay()">
                            <option value="0">วันอาทิตย์</option>
                            <option value="1">วันจันทร์</option>
                            <option value="2">วันอังคาร</option>
                            <option value="3">วันพุธ</option>
                            <option value="4">วันพฤหัสบดี</option>
                            <option value="5">วันศุกร์</option>
                            <option value="6">วันเสาร์</option>
                        </select>
                    </div>
                </div>
                <div id="tabooCaptureArea" class="p-4 rounded text-center" style="background: #1a1a1a; border: 2px solid #d4af37;">               
                            <h3 id="tabooDayTitle" class="text-gold mb-0">วัน...</h3>
                            <div class="text-white-50 small mb-4">สยามโหรามงคล • พรหมชาติ & กาลโยค</div>
                            <h6 class="text-gold text-center mb-3"><i class="fas fa-calendar-alt"></i>
                                เคล็ดลับมงคลรายวัน</h6>
                            <div class="row text-left">
                                <div class="col-6 border-right"
                                    style="border-right-color: rgba(212, 175, 55, 0.2) !important;">
                                    <div class="text-center mb-2"><span class="badge badge-success">✅
                                            สิ่งที่ควรทำ</span></div>
                                    <ul id="goodList" class="mb-0 pl-3 small text-white"
                                        style="text-align: center;"></ul>
                                </div>
                                <div class="col-6">
                                    <div class="text-center mb-2"><span class="badge badge-danger">🚫
                                            สิ่งที่ควรเลี่ยง</span></div>
                                    <ul id="badList" class="mb-0 pl-3 small text-white"
                                        style="text-align: center;"></ul>
                                </div>
                            </div>
                            <br>
                            <div id="directionContainer" class="col-12 mb-3"></div>
                            <h6 class="text-gold text-center mb-3"><i class="fas fa-star"></i> ดวงตามปีนักษัตร</h6>
                            <div class="row text-center">
                                <div class="col-6 border-right"
                                    style="border-right-color: rgba(212, 175, 55, 0.2) !important;">
                                    <span class="badge badge-success mb-2">🚀 ปีที่มงคลยิ่ง</span>
                                    <div id="zodiacGreat" class="small text-white font-weight-bold"></div>
                                </div>
                                <div class="col-6">
                                    <span class="badge badge-danger mb-2">⚠️ ปีที่ควรระวัง</span>
                                    <div id="zodiacBad" class="small text-white font-weight-bold"></div>
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


// ==========================================
// 3. เริ่มทำงานตอนโหลดหน้า (Initialization)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const dayIndex = now.getDay();

    // แสดงวันที่ปัจจุบัน
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

    // รันข้อมูลรายวัน
    updateDailyTaboo(dayIndex);
    
    // รันยามอุบากอง (ถ้ามีฟังก์ชันนี้อยู่ในไฟล์เดียวกัน)
    if (typeof renderUbakongDay === 'function') {
        renderUbakongDay();
        showdailytaboo();
    }
});





async function downloadTabooImage() {
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        ctx.setLineDash([]);

        const dayTitle = document.getElementById('tabooDayTitle')?.innerText || 'วัน...';
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 80px "Sarabun", sans-serif';
        ctx.fillText(dayTitle, canvas.width / 2, 80);
        
        ctx.font = '30px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('สยามโหรามงคล • พรหมชาติ & กาลโยค', canvas.width / 2, 180);
        
        ctx.font = 'bold 45px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('เคล็ดลับมงคลรายวัน', canvas.width / 2, 250);
        
        // Good / Bad section
        const drawList = (items, startX, startY, isGood) => {
            ctx.textAlign = 'center';
            ctx.font = 'bold 35px "Sarabun", sans-serif';
            ctx.fillStyle = isGood ? '#28a745' : '#dc3545';
            ctx.fillText(isGood ? '✅ สิ่งที่ควรทำ' : '🚫 สิ่งที่ควรเลี่ยง', startX, startY);
            
            ctx.font = '30px "Sarabun", sans-serif';
            ctx.fillStyle = '#ffffff';
            let curY = startY + 70;
            items.forEach(item => {
                let txt = item.innerText || item.textContent;
                txt = txt.replace(/^[✅🚫\s]+/, '');
                ctx.fillText(txt, startX, curY);
                curY += 50;
            });
        };
        
        const goodItems = document.querySelectorAll('#goodList li, #goodList div');
        const badItems = document.querySelectorAll('#badList li, #badList div');
        
        drawList(Array.from(goodItems), canvas.width / 4, 340, true);
        drawList(Array.from(badItems), (canvas.width / 4) * 3, 340, false);
        
        // Line separator
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 340);
        ctx.lineTo(canvas.width / 2, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, 650);
        ctx.lineTo(canvas.width - 100, 650);
        ctx.stroke();
        
        // Direction Section
        ctx.font = 'bold 40px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('ทิศมงคลประจำวัน', canvas.width / 2, 690);
        
        const dirLucky = document.querySelector('.badge-success + div')?.innerText || '-';
        const dirBlind = document.querySelector('.badge-danger + div')?.innerText || '-';
        
        ctx.font = 'bold 30px "Sarabun", sans-serif';
        ctx.fillStyle = '#28a745';
        ctx.fillText('🎯 ทิศโชคลาภ', canvas.width / 4, 760);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dirLucky, canvas.width / 4, 810);
        
        ctx.fillStyle = '#dc3545';
        ctx.fillText('🚫 ทิศกาลกิณี', (canvas.width / 4) * 3, 760);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dirBlind, (canvas.width / 4) * 3, 810);
        
        ctx.beginPath();
        ctx.moveTo(100, 880);
        ctx.lineTo(canvas.width - 100, 880);
        ctx.stroke();
        
        // Zodiac Section
        ctx.font = 'bold 40px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('ดวงตามปีนักษัตร', canvas.width / 2, 920);
        
        const zGreat = document.getElementById('zodiacGreat')?.innerText || '-';
        const zBad = document.getElementById('zodiacBad')?.innerText || '-';
        
        ctx.font = 'bold 30px "Sarabun", sans-serif';
        ctx.fillStyle = '#28a745';
        ctx.fillText('🚀 ปีที่มงคลยิ่ง', canvas.width / 4, 990);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(zGreat, canvas.width / 4, 1040);
        
        ctx.fillStyle = '#dc3545';
        ctx.fillText('⚠️ ปีที่ควรระวัง', (canvas.width / 4) * 3, 990);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(zBad, (canvas.width / 4) * 3, 1040);

        const link = document.createElement('a');
        link.download = `ดวงรายวัน_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Swal.close();
    } catch (e) {
        console.error("Capture Failed:", e);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้', 'error');
    }
}

// ฟังก์ชันเมื่อผู้ใช้เปลี่ยนวันใน Dropdown
function changeTabooDay() {
    const select = document.getElementById('tabooDaySelect');
    if (select) updateDailyTaboo(parseInt(select.value));
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const dayIndex = now.getDay();

    const tabooSelect = document.getElementById('tabooDaySelect');
    if (tabooSelect) tabooSelect.value = dayIndex;

    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = "วันนี้: " + now.toLocaleDateString('th-TH', options);
    }

    updateDailyTaboo(dayIndex);
});

// ปรับปรุงฟังก์ชันเดิมให้รองรับการเปลี่ยนข้อมูล
function updateDailyTaboo(dayIndex) {
    const data = TABOO_DATA[dayIndex];
    if (!data) return;

    // 1. อัปเดตหัวข้อและรายการ ดี-ร้าย
    const dayTitle = document.getElementById('tabooDayTitle');
    const goodList = document.getElementById('goodList');
    const badList = document.getElementById('badList');

    if (dayTitle) dayTitle.innerText = "วัน" + data.day;
    
    if (goodList) {
        goodList.innerHTML = data.good.map(item => 
            `<div class="list-item-custom"><i class="fas fa-check-circle text-success mr-2"></i>${item}</div>`
        ).join('');
    }

    if (badList) {
        badList.innerHTML = data.bad.map(item => 
            `<div class="list-item-custom"><i class="fas fa-times-circle text-danger mr-2"></i>${item}</div>`
        ).join('');
    }

    // 2. อัปเดตทิศมงคลและดวงนักษัตรตามวันที่เลือก
    updateDirectionDisplay(dayIndex);
    updateZodiacLuckDisplay(dayIndex);
}

// แก้ไขส่วน DOMContentLoaded เพื่อให้ Dropdown ตรงกับวันจริงตอนเปิดแอปครั้งแรก
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const dayIndex = now.getDay();

    // ตั้งค่า Dropdown ให้ตรงกับวันปัจจุบัน
    const tabooSelect = document.getElementById('tabooDaySelect');
    if (tabooSelect) tabooSelect.value = dayIndex;

    // แสดงวันที่ปัจจุบัน
    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = "วันนี้: " + now.toLocaleDateString('th-TH', options);
    }

    // รันข้อมูลครั้งแรก
    updateDailyTaboo(dayIndex);
});