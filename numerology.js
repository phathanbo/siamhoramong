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
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4 border-bottom-gold">
            <h2 class="text-gold mb-1">🔮 เลขศาสตร์ไทยแท้ - ดาว 9 ดวง</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนาและดาว 9 ดวง - โหราศาสตร์ไทยแท้</p>
        </div>
        <div class="card-body" style="background: rgba(26,26,26,0.95);">
            <div class="btn-group btn-group-toggle w-100 mb-4 shadow-sm" data-toggle="buttons">
                <label class="btn btn-outline-gold active flex-fill text-white">
                    <input type="radio" name="numType" value="phone" checked onchange="updateNumUI('phone')"> 📱 เบอร์มือถือ
                </label>
                <label class="btn btn-outline-gold flex-fill text-white">
                    <input type="radio" name="numType" value="car" onchange="updateNumUI('car')"> 🚗 ทะเบียนรถ
                </label>
                <label class="btn btn-outline-gold flex-fill text-white">
                    <input type="radio" name="numType" value="home" onchange="updateNumUI('home')"> 🏠 เลขที่บ้าน
                </label>
            </div>
            <div class="form-group text-center">
                <label for="phoneNumber" class="font-weight-bold text-gold" id="inputLabel">กรอกหมายเลข:</label>
                <input type="text" class="form-control form-control-lg bg-dark text-white border-gold text-center shadow-inner mb-3"
                    id="phoneNumber" placeholder="08XXXXXXXX" oninput="validateInput(this)"
                    style="font-size: 1.5rem; letter-spacing: 2px; border-radius: 15px;">
                
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-gold text-dark border-gold"><i class="fas fa-user"></i></span>
                    </div>
                    <select id="memberTaksaSelect" class="form-control bg-dark text-white border-gold">
                        <option value="">-- เลือกสมาชิกเพื่อผสานดวงวันเกิด (ทักษา) --</option>
                    </select>
                </div>
                
                <small class="text-white-50 mt-2 d-block">*วิเคราะห์ตามลัคนา: ผลรวมตัวเลข → ดาว 9 ดวง</small>
            </div>
            <button class="btn btn-gold btn-block btn-lg shadow mt-4 py-3 font-weight-bold" id="btnAnalyze"
                onclick="analyzeNumber()">
                ✨ วิเคราะห์เบอร์มือถือ
            </button>
            <div id="numerologyResult" class="mt-4"></div>
            <div id="numResult" class="mt-4 p-4 rounded-lg" style="display:none; background: #222; border: 1px solid #444;"></div>

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
    
    // โหลดรายชื่อสมาชิก
    if (typeof loadTaksaMembers === 'function') {
        loadTaksaMembers();
    }
}

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
                <div class="card bg-dark border-gold mb-3">
                    <div class="card-header bg-gold text-white">
                        <strong>👤 ความเหมาะสมกับดวงชะตา (วันเกิด x เบอร์โทร)</strong>
                    </div>
                    <div class="card-body">
                        <div class="alert ${alertClass} border-0 mb-3" style="background: rgba(0,0,0,0.3);">
                            <h5 class="mb-0">${icon} ${statusText}</h5>
                        </div>
                        <div class="mt-3">
                            <h6 class="text-gold mb-3"><i class="fas fa-search"></i> เจาะลึกอิทธิพลของแต่ละเลขในเบอร์:</h6>
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
            <div class="card bg-dark border-gold mb-3">
                <div class="card-header bg-gold text-white">
                    <strong>🔢 พลังตัวเลขในเบอร์</strong>
                </div>
                <div class="card-body small text-light">
                    <div class="row">
        `;
        uniqueDigits.forEach(d => {
            const numPlanet = ThaiAstrologyData?.PLANETS_DATA?.[parseInt(d)];
            if (numPlanet) {
                individualNumbersHtml += `
                    <div class="col-md-6 mb-2">
                        <strong class="text-gold" style="font-size: 1.1em;">เลข ${d} (${numPlanet.name}):</strong> 
                        <br>${numPlanet.character}
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
                <div class="card bg-dark border-gold mb-3">
                    <div class="card-header bg-gold text-white">
                        <strong>🔗 วิเคราะห์คู่เลข (Pairing)</strong>
                    </div>
                    <div class="card-body small text-light">
                        <p class="text-white-50 mb-3 pb-2 border-bottom border-secondary"><small>* เบอร์มือถือมักเน้นวิเคราะห์ความหมายคู่เลข 7 ตัวหลังเป็นหลัก</small></p>
                        <div class="list-group list-group-flush">
            `;
            
            pairs.forEach(pair => {
                const pairData = (typeof NUMEROLOGY_PAIRS !== 'undefined') ? NUMEROLOGY_PAIRS[pair] : null;
                let meaningText = pairData ? pairData.meaning : "ไม่มีข้อมูลคู่เลขนี้";
                let badgeClass = "badge-secondary";
                
                if (pairData) {
                    if (pairData.type === 'good') badgeClass = 'badge-success';
                    else if (pairData.type === 'bad') badgeClass = 'badge-danger';
                    else badgeClass = 'badge-warning text-dark';
                }
                
                pairsHtml += `
                    <div class="list-group-item bg-dark border-secondary p-2 mb-2 rounded" style="border: 1px solid rgba(212, 175, 55, 0.3) !important;">
                        <span class="badge ${badgeClass} mr-2 px-2 py-1" style="font-size: 1.1em;">${pair}</span> 
                        <span class="text-light">${meaningText}</span>
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
                <div class="card bg-dark border-gold mb-3">
                    <div class="card-header bg-gold text-white">
                        <strong>🔮 ความหมายผลรวมเลขศาสตร์</strong>
                    </div>
                    <div class="card-body text-light text-center">
                        <div class="mb-3">
                            <span class="display-4 font-weight-bold" style="color: #ffc107; text-shadow: 0 0 10px rgba(255,193,7,0.4);">${numSum}</span>
                        </div>
                        <h5 class="mb-3 text-gold">${title}</h5>
                        <div class="mb-0 text-white text-center">${desc}</div>
                    </div>
                </div>
            `;
        }
    }

    // สร้าง Result HTML
    resultDiv.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4 shadow-sm animate__animated animate__fadeInUp">
            <div class="text-center mb-4 pb-3 border-bottom border-secondary">
                <h3 class="text-gold">ผลวิเคราะห์เลขศาสตร์</h3>
                <div style="font-size: 1.5rem; color: #d4af37; letter-spacing: 2px;" class="mt-2 font-weight-bold">${inputField.value}</div>
            </div>

            ${taksaHtml}
            ${totalMeaningHtml}
            ${pairsHtml}
            ${individualNumbersHtml}

            <!-- ดาวที่ได้ (จากผลรวม 1-9) -->
            <div class="card bg-dark border-gold mb-3">
                <div class="card-header bg-gold text-white">
                    <strong>⭐ อิทธิพลดาวหลัก (จากผลรวม → ดาว ${planetNum})</strong>
                </div>
                <div class="card-body text-center">
                    <div style="font-size: 3rem; text-shadow: 0 0 10px rgba(255,215,0,0.5);">${planet.symbol}</div>
                    <h4 class="text-gold mt-2">${planet.name}</h4>
                    <p class="mb-1 text-light"><strong>ลักษณะ:</strong> ${planet.character}</p>
                    <p class="mb-1 text-light"><strong>ธาตุ:</strong> ${planet.element} | <strong>ทิศมงคล:</strong> ${planet.direction}</p>
                    <p class="mb-0 text-light"><strong>จุดแข็ง:</strong> ${planet.strength}</p>
                </div>
            </div>

            <!-- ธาตุสนับสนุน -->
            ${elementData ? `
            <div class="card bg-dark border-gold">
                <div class="card-header bg-gold text-white">
                    <strong>🌀 ธาตุสนับสนุน (จากผลรวม → ธาตุ ${elementNum})</strong>
                </div>
                <div class="card-body text-center text-white small">
                    <p class="mb-1"><span style="font-size:1.5rem;">${elementData.symbol}</span> <strong>${elementData.name}</strong></p>
                    <p class="mb-1 text-light"><strong>สี:</strong> ${elementData.color}</p>
                    <p class="mb-0 text-light"><strong>อิทธิพล:</strong> ${elementData.influence}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="alert alert-dark small mt-4 mb-0 border-secondary text-white-50">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ตำราเลขศาสตร์ไทย (จับคู่เลข, ผลรวม) และ โหราศาสตร์ไทยแท้ (อิทธิพลดาว 9 ดวง)
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
