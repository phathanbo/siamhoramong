/**
 * 🔢 numerology.js - เลขศาสตร์ไทยแท้
 *
 * อ้างอิง:
 * - ดาว 9 ดวง (Navagraha) จาก thai-astrology-data.js
 * - ธาตุ 5 ประการ (Wu Xing) จาก thai-astrology-data.js
 * - หลักการ: ผลรวมตัวเลข (1-9) → ดาว, ผลรวม (1-5) → ธาตุ
 */

"use strict";

function Numbertable() {
    const container = document.getElementById("numberlogypage");
    if (!container) return;

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Main Hero Card -->
            <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
                
                <!-- Header -->
                <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(232, 200, 118, 0.6); box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);" class="mb-2 animate__animated animate__pulse">
                        <i class="fas fa-mobile-alt fa-2x" style="color: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));"></i>
                    </div>
                    <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">เลขศาสตร์ไทยแท้ · ดาว ๙ ดวง</h1>
                    <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">วิเคราะห์คู่เลขมงคล ผลรวมชะตา และตรวจสอบคู่ดาวกาลกิณีตามวันเกิด (เบอร์โทร · ทะเบียนรถ · บ้านเลขที่)</p>
                </div>

                <div class="card-body p-3 p-md-4">
                    <div style="max-width: 860px; margin: 0 auto;">
                        
                        <!-- Segment Tabs -->
                        <div class="d-flex justify-content-center gap-2 p-1 mb-4 rounded-pill" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(212,175,55,0.3); max-width: 500px; margin: 0 auto;">
                            <button type="button" class="btn btn-sm px-3 py-2 rounded-pill flex-fill fw-bold active num-tab-btn" id="tabPhone" onclick="switchNumType('phone')" style="background: #ffd700; color: #000;">
                                <i class="fas fa-mobile-alt me-1"></i> เบอร์มือถือ
                            </button>
                            <button type="button" class="btn btn-sm px-3 py-2 rounded-pill flex-fill fw-bold text-white num-tab-btn" id="tabCar" onclick="switchNumType('car')" style="background: transparent;">
                                <i class="fas fa-car me-1"></i> ทะเบียนรถ
                            </button>
                            <button type="button" class="btn btn-sm px-3 py-2 rounded-pill flex-fill fw-bold text-white num-tab-btn" id="tabHome" onclick="switchNumType('home')" style="background: transparent;">
                                <i class="fas fa-home me-1"></i> เลขที่บ้าน
                            </button>
                            <input type="hidden" id="numTypeHidden" value="phone">
                        </div>

                        <!-- Form Input Box -->
                        <div class="p-3 p-md-4 rounded-4 mb-4" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                            
                            <div class="text-center mb-3">
                                <label for="phoneNumber" class="form-label fw-bold mb-2" id="inputLabel" style="color: #ffd700; font-size: 1.1rem;">
                                    <i class="fas fa-keyboard me-1"></i> กรอกหมายเลขเบอร์มือถือ:
                                </label>
                                <input type="text" class="form-control bg-dark text-white border-gold text-center fw-bold shadow-inner mx-auto"
                                    id="phoneNumber" placeholder="08XXXXXXXX" oninput="validateInput(this)"
                                    style="max-width: 420px; font-size: 1.6rem; letter-spacing: 3px; border-radius: 12px; height: 55px; border-color: rgba(212,175,55,0.4);">
                            </div>

                            <div class="mb-4" style="max-width: 550px; margin: 0 auto;">
                                <label class="form-label small fw-semibold" style="color: #e8c876;">
                                    <i class="fas fa-user-check me-1"></i> เลือกสมาชิกเพื่อผสานดวงวันเกิด (ทักษาปกรณ์):
                                </label>
                                <select id="memberTaksaSelect" class="form-select bg-dark text-white border-gold member-selector" style="border-radius: 10px; border-color: rgba(212,175,55,0.4);">
                                    <option value="">-- เลือกสมาชิกเพื่อผสานดวงวันเกิด (ทักษา) --</option>
                                </select>
                            </div>

                            <div class="text-center">
                                <button class="btn btn-gold px-5 py-2 py-md-3 shadow fw-bold d-inline-flex align-items-center gap-2" id="btnAnalyze" onclick="analyzeNumber()" style="border-radius: 50px; font-size: 1.05rem; min-width: 220px; justify-content: center;">
                                    <i class="fas fa-magic text-danger"></i> วิเคราะห์เลขศาสตร์
                                </button>
                            </div>

                        </div>

                        <div id="numResult" class="mt-4" style="display:none;"></div>

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
    container.innerHTML = html;
    
    // โหลดรายชื่อสมาชิก
    if (typeof loadTaksaMembers === 'function') {
        loadTaksaMembers();
    }
}

function switchNumType(type) {
    const hidden = document.getElementById('numTypeHidden');
    if (hidden) hidden.value = type;

    const btnPhone = document.getElementById('tabPhone');
    const btnCar = document.getElementById('tabCar');
    const btnHome = document.getElementById('tabHome');
    const label = document.getElementById('inputLabel');
    const input = document.getElementById('phoneNumber');
    const btnAnalyze = document.getElementById('btnAnalyze');

    [btnPhone, btnCar, btnHome].forEach(b => {
        if (b) {
            b.style.background = 'transparent';
            b.classList.remove('text-dark');
            b.classList.add('text-white');
        }
    });

    if (type === 'phone') {
        if (btnPhone) { btnPhone.style.background = '#ffd700'; btnPhone.classList.add('text-dark'); btnPhone.classList.remove('text-white'); }
        if (label) label.innerHTML = '<i class="fas fa-mobile-alt me-1"></i> กรอกหมายเลขเบอร์มือถือ:';
        if (input) input.placeholder = '08XXXXXXXX';
        if (btnAnalyze) btnAnalyze.innerHTML = '<i class="fas fa-magic text-danger"></i> วิเคราะห์เบอร์มือถือ';
    } else if (type === 'car') {
        if (btnCar) { btnCar.style.background = '#ffd700'; btnCar.classList.add('text-dark'); btnCar.classList.remove('text-white'); }
        if (label) label.innerHTML = '<i class="fas fa-car me-1"></i> กรอกหมายเลขทะเบียนรถ:';
        if (input) input.placeholder = 'เช่น 1กข1234 หรือ 9999';
        if (btnAnalyze) btnAnalyze.innerHTML = '<i class="fas fa-magic text-danger"></i> วิเคราะห์ทะเบียนรถ';
    } else if (type === 'home') {
        if (btnHome) { btnHome.style.background = '#ffd700'; btnHome.classList.add('text-dark'); btnHome.classList.remove('text-white'); }
        if (label) label.innerHTML = '<i class="fas fa-home me-1"></i> กรอกเลขที่บ้าน:';
        if (input) input.placeholder = 'เช่น 123/45 หรือ 88';
        if (btnAnalyze) btnAnalyze.innerHTML = '<i class="fas fa-magic text-danger"></i> วิเคราะห์เลขที่บ้าน';
    }
}

window.switchNumType = switchNumType;

// ฐานข้อมูลทักษาสำหรับตัวเลข (ศรี, กาลกิณี)
// 1=อาทิตย์, 2=จันทร์, 3=อังคาร, 4=พุธกลางวัน, 5=พฤหัส, 6=ศุกร์, 7=เสาร์, 8=พุธกลางคืน
// วันเกิด (0=อาทิตย์, 1=จันทร์, 2=อังคาร, 3=พุธกลางวัน, 4=พฤหัส, 5=ศุกร์, 6=เสาร์, 7=พุธกลางคืน)
const NUMBER_TAKSA_RULES = {
    0: { name: "วันอาทิตย์", sri: "4", kalakini: "6" },
    1: { name: "วันจันทร์", sri: "5", kalakini: "1" },
    2: { name: "วันอังคาร", sri: "7", kalakini: "2" },
    3: { name: "วันพุธ (กลางวัน)", sri: "8", kalakini: "3" },
    4: { name: "วันพฤหัสบดี", sri: "2", kalakini: "7" },
    5: { name: "วันศุกร์", sri: "3", kalakini: "8" },
    6: { name: "วันเสาร์", sri: "1", kalakini: "4" },
    7: { name: "วันพุธ (กลางคืน)", sri: "6", kalakini: "5" }
};

function loadTaksaMembers() {
    const select = document.getElementById('memberTaksaSelect');
    if (!select) return;
    
    try {
        const history = JSON.parse(localStorage.getItem('horo_history')) || [];
        history.forEach((member, index) => {
            if (member.name && member.birthdate) {
                // หารูปแบบวันที่ YYYY-MM-DD หรือ DD/MM/YYYY
                let dateStr = member.birthdate;
                let dateObj;
                if (dateStr.includes('/')) {
                    const parts = dateStr.split('/');
                    if (parts.length === 3) {
                        // DD/MM/YYYY -> YYYY-MM-DD
                        dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                } else {
                    dateObj = new Date(dateStr);
                }
                
                if (dateObj && !isNaN(dateObj.getTime())) {
                    let dayIdx = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ...
                    
                    // เช็คพุธกลางคืน
                    if (dayIdx === 3 && member.birthtime) {
                        const hours = parseInt(member.birthtime.split(':')[0]);
                        if (hours >= 18) {
                            dayIdx = 7; // พุธกลางคืน
                        }
                    }
                    
                    const dayName = NUMBER_TAKSA_RULES[dayIdx] ? NUMBER_TAKSA_RULES[dayIdx].name : "ไม่ระบุ";
                    
                    const option = document.createElement('option');
                    option.value = dayIdx;
                    option.text = `${member.name} (เกิด${dayName})`;
                    select.appendChild(option);
                }
            }
        });
    } catch (e) {
        console.error("Error loading members for taksa:", e);
    }
}

/**
 * 🎯 วิเคราะห์ตัวเลข อิงดาว 9 ดวง + ธาตุ 5
 */
function analyzeNumber() {
    const inputField = document.getElementById('phoneNumber');
    const resultDiv = document.getElementById('numResult');

    if (!inputField || !resultDiv || !inputField.value) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกหมายเลข', 'warning');
        return;
    }

    resultDiv.style.display = 'block';

    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    // ล้างตัวเลขเท่านั้น
    let cleanInput = inputField.value.replace(/[^0-9ก-ฮ]/g, '');
    let numSum = 0;
    
    // สำหรับระบบคู่เลข เราดึงเฉพาะตัวเลขออกมา
    let digitsOnly = inputField.value.replace(/[^0-9]/g, '');

    // คำนวณผลรวมตัวเลข
    for (let char of cleanInput) {
        if (/[0-9]/.test(char)) {
            numSum += parseInt(char);
        } else if (/[ก-ฮ]/.test(char)) {
            // แท็กไทย: ก-ง=1, จ-ช=2, ญ-ณ=3, ด-น=4, บ-ม=5, ย-ว=6, ศ-ฮ=7
            const thaiValue = getThaiBycodeValue(char);
            numSum += thaiValue;
        }
    }

    // ลด sum ให้เป็น 1-9 (เพื่อเชื่อมกับดาว 9)
    let planetNum = (numSum % 9) || 9;
    let elementNum = (numSum % 5) || 5;

    // ดึงข้อมูลจาก thai-astrology-data.js
    const planet = ThaiAstrologyData?.PLANETS_DATA?.[planetNum];
    const elementData = ThaiAstrologyData?.ELEMENTS_DATA?.[elementNum - 1];

    if (!planet) {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลดาว 9 ดวง', 'error');
        return;
    }

    // --- ตรวจสอบทักษา (ถ้าเลือกสมาชิก) ---
    let taksaHtml = '';
    const memberSelect = document.getElementById('memberTaksaSelect');
    if (memberSelect && memberSelect.value !== '') {
        const dayIdx = parseInt(memberSelect.value);
        const taksaRule = NUMBER_TAKSA_RULES[dayIdx];
        
        if (taksaRule) {
            // ลำดับทักษาปกรณ์: อาทิตย์(1), จันทร์(2), อังคาร(3), พุธ(4), เสาร์(7), พฤหัส(5), ราหู(8), ศุกร์(6)
            const taksaSequence = [1, 2, 3, 4, 7, 5, 8, 6];
            const dayIdxToPlanet = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8 };
            const startPlanet = dayIdxToPlanet[dayIdx];
            const startIdx = taksaSequence.indexOf(startPlanet);
            
            const taksaMeanings = [
                { name: "บริวาร", desc: "แวดล้อมดี มีคนช่วยเหลือ บริวารเชื่อฟัง", color: "text-info" },
                { name: "อายุ", desc: "สุขภาพแข็งแรง ไร้โรคภัย ชีวิตมั่นคง", color: "text-success" },
                { name: "เดช", desc: "มีอำนาจบารมี ชื่อเสียง การยอมรับ", color: "text-warning" },
                { name: "ศรี", desc: "สิริมงคล โชคลาภ เสน่ห์ดึงดูดทรัพย์", color: "text-success" },
                { name: "มูละ", desc: "ทรัพย์สมบัติ ฐานะมั่นคง การเงินดี", color: "text-primary" },
                { name: "อุตสาหะ", desc: "ขยันขันแข็ง สำเร็จด้วยความพยายาม", color: "text-secondary" },
                { name: "มนตรี", desc: "ผู้ใหญ่เมตตา ผู้อุปถัมภ์ค้ำชู", color: "text-info" },
                { name: "กาลกิณี", desc: "อุปสรรค ศัตรู โชคร้าย (ควรหลีกเลี่ยง)", color: "text-danger" }
            ];

            let hasKalakini = false;
            let taksaDetails = '';
            let uniqueDigits = [...new Set(digitsOnly.split(''))].sort();

            uniqueDigits.forEach(dStr => {
                const d = parseInt(dStr);
                let roleName = "";
                let roleDesc = "";
                let color = "text-white-50";

                if (d === 0) {
                    roleName = "มฤตยู (นอกกฎ)";
                    roleDesc = "การเปลี่ยนแปลง นวัตกรรม เซ้นส์แรง";
                } else if (d === 9) {
                    roleName = "เกตุ (นอกกฎ)";
                    roleDesc = "สิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาด";
                } else {
                    const digitIdx = taksaSequence.indexOf(d);
                    let offset = digitIdx - startIdx;
                    if (offset < 0) offset += 8;
                    
                    const t = taksaMeanings[offset];
                    roleName = t.name;
                    roleDesc = t.desc;
                    color = t.color;
                    
                    if (roleName === "กาลกิณี") hasKalakini = true;
                }

                taksaDetails += `
                    <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
                        <div>
                            <span class="badge badge-light mr-2 text-dark" style="font-size: 1rem; width: 25px;">${d}</span>
                            <strong class="${color}">${roleName}</strong>
                        </div>
                        <small class="text-right text-light" style="max-width: 65%;">${roleDesc}</small>
                    </div>
                `;
            });
            
            let alertClass = "alert-success text-success";
            let icon = "🌟";
            let statusText = `<strong>เยี่ยมมาก!</strong> เบอร์นี้ไม่มีเลขกาลกิณีขัดขวางดวงชะตาเลย`;
            
            if (hasKalakini) {
                alertClass = "alert-danger text-danger";
                icon = "🚨";
                statusText = `<strong>ระวัง!</strong> เบอร์นี้มีเลข <strong>กาลกิณี</strong> ผสมอยู่ ซึ่งอาจสร้างอุปสรรคให้คุณ`;
            }
            
            taksaHtml = `
                <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25) !important;">
                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                        <div class="p-2 rounded-circle" style="background: rgba(212, 175, 55, 0.2); color: #ffd700;">
                            <i class="fas fa-shield-alt fa-lg"></i>
                        </div>
                        <h5 class="fw-bold mb-0" style="color: #ffd700; font-family: 'Chonburi', serif; font-size: 1.15rem;">ความเหมาะสมกับดวงชะตา (วันเกิด x ตัวเลข)</h5>
                    </div>
                    <div>
                        <div class="alert ${alertClass} border-0 mb-3" style="background: rgba(0,0,0,0.3); border-radius: 12px;">
                            <h6 class="mb-0 fw-bold">${icon} ${statusText}</h6>
                        </div>
                        <div class="mt-3">
                            <h6 class="text-gold mb-3 small fw-bold"><i class="fas fa-search me-1"></i> เจาะลึกอิทธิพลของแต่ละเลขในเบอร์:</h6>
                            ${taksaDetails}
                        </div>
                        <p class="mt-3 mb-0 text-white-50 small text-center">* หมายเหตุ: เลข 0 และ 9 ถือเป็นเลขนอกกฎทักษา ไม่มีค่ากาลกิณี</p>
                    </div>
                </div>
            `;
        }
    }

    // 1. วิเคราะห์พลังเลขรายตัว (0-9)
    let uniqueDigits = [...new Set(digitsOnly.split(''))].sort();
    let individualNumbersHtml = '';
    if (uniqueDigits.length > 0) {
        individualNumbersHtml = `
            <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25) !important;">
                <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div class="p-2 rounded-circle" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">
                        <i class="fas fa-hashtag fa-lg"></i>
                    </div>
                    <h5 class="fw-bold mb-0" style="color: #93c5fd; font-family: 'Chonburi', serif; font-size: 1.15rem;">พลังตัวเลขเดี่ยวในเบอร์</h5>
                </div>
                <div class="small text-light">
                    <div class="row g-2">
        `;
        uniqueDigits.forEach(d => {
            const numPlanet = ThaiAstrologyData?.PLANETS_DATA?.[parseInt(d)];
            if (numPlanet) {
                individualNumbersHtml += `
                    <div class="col-md-6 col-12 mb-2">
                        <div class="p-2 rounded-3 h-100" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
                            <strong class="text-gold" style="font-size: 1.05em;"><i class="fas fa-star me-1 text-warning"></i> เลข ${d} (${numPlanet.name}):</strong> 
                            <div class="text-white-50 small mt-1">${numPlanet.character}</div>
                        </div>
                    </div>
                `;
            }
        });
        individualNumbersHtml += `</div></div></div>`;
    }

    // 2. ระบบจับคู่เลข (Number Pairing)
    let pairsHtml = '';
    if (digitsOnly.length >= 2) {
        let pairTarget = digitsOnly;
        // ถ้าเป็นมือถือและยาว 10 หลัก นิยมวิเคราะห์แค่ 7 ตัวหลัง
        if (type === 'phone' && digitsOnly.length === 10) {
            pairTarget = digitsOnly.substring(3);
        }
        
        let pairs = [];
        for (let i = 0; i < pairTarget.length - 1; i++) {
            pairs.push(pairTarget.substring(i, i + 2));
        }
        
        if (pairs.length > 0) {
            pairsHtml = `
                <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25) !important;">
                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                        <div class="p-2 rounded-circle" style="background: rgba(244, 114, 182, 0.2); color: #f472b6;">
                            <i class="fas fa-link fa-lg"></i>
                        </div>
                        <h5 class="fw-bold mb-0" style="color: #f472b6; font-family: 'Chonburi', serif; font-size: 1.15rem;">วิเคราะห์คู่เลขมงคล (Pairing)</h5>
                    </div>
                    <div class="small text-light">
                        <p class="text-white-50 mb-3 pb-2 border-bottom border-secondary"><small>* เบอร์มือถือเน้นวิเคราะห์ความหมายคู่เลข ๗ ตัวหลังเป็นสำคัญ</small></p>
                        <div class="d-flex flex-column gap-2">
            `;
            
            pairs.forEach(pair => {
                const pairData = (typeof NUMEROLOGY_PAIRS !== 'undefined') ? NUMEROLOGY_PAIRS[pair] : null;
                let meaningText = pairData ? pairData.meaning : "ไม่มีข้อมูลคู่เลขนี้";
                let badgeStyle = "background: rgba(255,255,255,0.2); color: #fff;";
                
                if (pairData) {
                    if (pairData.type === 'good') badgeStyle = 'background: rgba(34, 197, 94, 0.25); color: #4ade80; border: 1px solid #22c55e;';
                    else if (pairData.type === 'bad') badgeStyle = 'background: rgba(239, 68, 68, 0.25); color: #f87171; border: 1px solid #ef4444;';
                    else badgeStyle = 'background: rgba(234, 179, 8, 0.25); color: #fde047; border: 1px solid #eab308;';
                }
                
                pairsHtml += `
                    <div class="p-2 p-md-3 rounded-3 d-flex align-items-center gap-3" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(212, 175, 55, 0.2);">
                        <span class="badge fw-bold px-3 py-2 rounded-3" style="font-size: 1.15em; ${badgeStyle}">${pair}</span> 
                        <span class="text-light small flex-fill">${meaningText}</span>
                    </div>
                `;
            });
            pairsHtml += `</div></div></div>`;
        }
    }

    // 3. ความหมายผลรวม
    let totalMeaningHtml = '';
    if (typeof NameAnalysis !== 'undefined' && typeof NameAnalysis.getMeaning === 'function') {
        const totalMeaningStr = NameAnalysis.getMeaning(numSum);
        if (totalMeaningStr) {
            let title = "คำทำนาย";
            let desc = totalMeaningStr;
            
            if (totalMeaningStr.includes(':')) {
                let parts = totalMeaningStr.split(':');
                title = parts[0].trim();
                desc = parts.slice(1).join(':').trim();
            }

            totalMeaningHtml = `
                <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid rgba(212, 175, 55, 0.35) !important;">
                    <div class="text-center">
                        <small class="text-white-50 d-block mb-1">ผลรวมเลขศาสตร์โดยรวม</small>
                        <div class="display-4 fw-bold mb-2" style="color: #ffd700; text-shadow: 0 0 15px rgba(255,215,0,0.5); font-size: clamp(2.4rem, 5vw, 3.5rem);">
                            ${numSum}
                        </div>
                        <div class="badge px-3 py-2 rounded-pill fw-bold mb-3" style="background: #ffd700; color: #000; font-size: 0.95rem;">
                            ${title}
                        </div>
                        <div class="text-light small" style="line-height: 1.7; max-width: 680px; margin: 0 auto;">${desc}</div>
                    </div>
                </div>
            `;
        }
    }

    // สร้าง Result HTML
    resultDiv.innerHTML = `
        <div class="card border-0 rounded-4 p-3 p-md-4 mt-4 shadow-lg animate__animated animate__fadeInUp" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important;">
            <div class="text-center mb-4 pb-3" style="border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                <span class="badge px-3 py-2 rounded-pill fw-bold mb-2" style="background: rgba(212,175,55,0.2); color: #ffd700; border: 1px solid rgba(212,175,55,0.4); font-size: 0.9rem;">
                    <i class="fas fa-scroll me-1"></i> รายงานวิเคราะห์เลขศาสตร์ฉบับสมบูรณ์
                </span>
                <div style="font-size: clamp(1.6rem, 4vw, 2.2rem); color: #ffd700; letter-spacing: 3px; font-family: 'Chonburi', serif;" class="mt-1 font-weight-bold">${inputField.value}</div>
            </div>

            ${taksaHtml}
            ${totalMeaningHtml}
            ${pairsHtml}
            ${individualNumbersHtml}

            <!-- ดาวที่ได้ (จากผลรวม 1-9) -->
            <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25) !important;">
                <div class="text-center">
                    <div class="badge px-3 py-1 rounded-pill mb-2" style="background: rgba(212,175,55,0.15); color: #ffd700; border: 1px solid rgba(212,175,55,0.3);">
                        ⭐ อิทธิพลดาวหลัก (จากผลรวม → ดาว ${planetNum})
                    </div>
                    <div style="font-size: 3rem; text-shadow: 0 0 15px rgba(255,215,0,0.5);">${planet.symbol}</div>
                    <h4 class="text-gold mt-2 fw-bold">${planet.name}</h4>
                    <p class="mb-1 text-light small"><strong>ลักษณะ:</strong> ${planet.character}</p>
                    <p class="mb-1 text-light small"><strong>ธาตุ:</strong> ${planet.element} | <strong>ทิศมงคล:</strong> ${planet.direction}</p>
                    <p class="mb-0 text-light small"><strong>จุดแข็ง:</strong> ${planet.strength}</p>
                </div>
            </div>

            <!-- ธาตุสนับสนุน -->
            ${elementData ? `
            <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-sm" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(212, 175, 55, 0.25) !important;">
                <div class="text-center text-white small">
                    <div class="badge px-3 py-1 rounded-pill mb-2" style="background: rgba(59,130,246,0.15); color: #93c5fd; border: 1px solid rgba(59,130,246,0.3);">
                        🌀 ธาตุสนับสนุน (จากผลรวม → ธาตุ ${elementNum})
                    </div>
                    <p class="mb-1"><span style="font-size:1.5rem;">${elementData.symbol}</span> <strong class="fs-6">${elementData.name}</strong></p>
                    <p class="mb-1 text-light"><strong>สีมงคล:</strong> ${elementData.color}</p>
                    <p class="mb-0 text-light"><strong>อิทธิพล:</strong> ${elementData.influence}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="p-3 rounded-3 text-center small text-white-50" style="background: rgba(0,0,0,0.3); border: 1px dashed rgba(255,255,255,0.1);">
                <strong>📚 แหล่งอ้างอิง:</strong> ตำราเลขศาสตร์ไทย (จับคู่เลข, ผลรวม) และโหราศาสตร์ไทยแท้ (อิทธิพลดาว ๙ ดวง)
            </div>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 🔤 แปลงตัวอักษรไทยเป็นตัวเลข
 */
function getThaiBycodeValue(char) {
    // อ้างอิงตามตารางเลขศาสตร์ไทย (คชาปกรณ์มาตรฐาน) แบบเดียวกับ nameAnalysis.js
    const thaiMap = {
        // ค่าตัวเลข 1
        'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ส': 1,
        // ค่าตัวเลข 2
        'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2,
        // ค่าตัวเลข 3
        'ฆ': 3, 'ต': 3, 'ฑ': 3, 'ฒ': 3,
        // ค่าตัวเลข 4
        'ค': 4, 'ธ': 4, 'ญ': 4, 'ร': 4,
        // ค่าตัวเลข 5
        'ฉ': 5, 'ฌ': 5, 'ฎ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
        // ค่าตัวเลข 6
        'จ': 6, 'ล': 6, 'ว': 6,
        // ค่าตัวเลข 7
        'ซ': 7, 'ศ': 7, 'ษ': 7,
        // ค่าตัวเลข 8
        'ย': 8, 'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8,
        // ค่าตัวเลข 9
        'ฏ': 9, 'ฐ': 9, 'อ': 9
    };
    return thaiMap[char] || 0;
}

/**
 * 📱 อัปเดต UI ตามประเภทที่เลือก
 */
function updateNumUI(type) {
    const label = document.getElementById('inputLabel');
    const input = document.getElementById('phoneNumber');
    const btn = document.getElementById('btnAnalyze');

    input.value = "";
    document.getElementById('numerologyResult').innerHTML = "";

    if (type === 'phone') {
        label.innerText = "กรอกหมายเลขโทรศัพท์:";
        input.placeholder = "0XXXXXXXXX";
        btn.innerHTML = "✨ วิเคราะห์เบอร์มือถือ";
    } else if (type === 'car') {
        label.innerText = "กรอกทะเบียนรถ:";
        input.placeholder = "1กข1234";
        btn.innerHTML = "✨ วิเคราะห์ทะเบียนรถ";
    } else if (type === 'home') {
        label.innerText = "กรอกเลขที่บ้าน:";
        input.placeholder = "123/45";
        btn.innerHTML = "✨ วิเคราะห์เลขที่บ้าน";
    }
}

/**
 * ✅ ล้างข้อมูลขณะพิมพ์
 */
function validateInput(input) {
    let selectionStart = input.selectionStart;
    let oldLength = input.value.length;

    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    if (type === 'phone') {
        let value = input.value.replace(/\D/g, '').slice(0, 10);
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = value.substring(0, 3);
            if (value.length > 3) formattedValue += '-' + value.substring(3, 6);
            if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
        }
        input.value = formattedValue;
    } else if (type === 'home') {
        input.value = input.value.replace(/[^0-9ก-ฮ\/]/g, '');
    } else {
        input.value = input.value.replace(/[^0-9ก-ฮ]/g, '');
    }

    let newLength = input.value.length;
    selectionStart += (newLength - oldLength);
    input.setSelectionRange(selectionStart, selectionStart);
}

document.addEventListener("DOMContentLoaded", () => {
    Numbertable();
});
