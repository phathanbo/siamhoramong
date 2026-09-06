"use strict";

// =====================
// DATA
// =====================
const ZODIAC_MASTER = {
    "ชวด":   { element: "น้ำ", animal: "หนู", friend: ["ฉลู", "มะโรง", "วอก"], enemy: ["มะเมีย"] },
    "ฉลู":   { element: "ดิน", animal: "วัว", friend: ["ชวด", "มะเส็ง", "ระกา"], enemy: ["มะแม"] },
    "ขาล":   { element: "ไฟ", animal: "เสือ", friend: ["มะเมีย", "จอ", "กุน"], enemy: ["วอก"] },
    "เถาะ":  { element: "ลม", animal: "กระต่าย", friend: ["มะแม", "กุน", "จอ"], enemy: ["ระกา"] },
    "มะโรง": { element: "ดิน", animal: "งูใหญ่", friend: ["ชวด", "วอก", "ระกา"], enemy: ["จอ"] },
    "มะเส็ง": { element: "ไฟ", animal: "งูเล็ก", friend: ["ฉลู", "ระกา"], enemy: ["กุน"] },
    "มะเมีย": { element: "ไฟ", animal: "ม้า", friend: ["ขาล", "จอ"], enemy: ["ชวด"] },
    "มะแม":  { element: "ดิน", animal: "แพะ", friend: ["เถาะ", "กุน"], enemy: ["ฉลู"] },
    "วอก":   { element: "ลม", animal: "ลิง", friend: ["ชวด", "มะโรง"], enemy: ["ขาล"] },
    "ระกา":  { element: "ดิน", animal: "ไก่", friend: ["ฉลู", "มะเส็ง", "มะโรง"], enemy: ["เถาะ"] },
    "จอ":    { element: "ดิน", animal: "หมา", friend: ["ขาล", "มะเมีย", "เถาะ"], enemy: ["มะโรง"] },
    "กุน":   { element: "น้ำ", animal: "หมู", friend: ["เถาะ", "มะแม", "ขาล"], enemy: ["มะเส็ง"] }
};

// ธาตุสัมพันธ์ (แก้ให้ logic ชัดเจน)
const ELEMENT_RELATION = {
    "น้ำ": { support: "ลม", block: "ไฟ", icon: "💧" },
    "ดิน": { support: "ไฟ", block: "ลม", icon: "🪨" },
    "ไฟ":  { support: "ดิน", block: "น้ำ", icon: "🔥" },
    "ลม":  { support: "น้ำ", block: "ดิน", icon: "🌪️" }
};

// =====================
// CORE LOGIC
// =====================
function analyzeCompatibility(p1, p2) {

    if (!ZODIAC_MASTER[p1] || !ZODIAC_MASTER[p2]) {
        return {
            error: true,
            message: "กรุณาเลือกนักษัตรให้ครบก่อน"
        };
    }

    const person1 = ZODIAC_MASTER[p1];
    const person2 = ZODIAC_MASTER[p2];

    let score = 70;
    let zodiacResult = "เป็นกลาง";

    // --- Zodiac ---
    if (person1.friend.includes(p2)) {
        score = 95;
        zodiacResult = "คู่สร้างคู่สม (มงคลยิ่ง)";
    } else if (person1.enemy.includes(p2)) {
        score = 40;
        zodiacResult = "คู่กัด/ศัตรู (ต้องระวัง)";
    }

    // --- Element ---
    let elementResult = "ธาตุเป็นกลาง";

    if (ELEMENT_RELATION[person1.element].support === person2.element) {
        elementResult = "ธาตุหนุนนำ (ฝ่ายคุณหนุนเขา)";
        score += 10;
    } 
    else if (ELEMENT_RELATION[person2.element].support === person1.element) {
        elementResult = "ธาตุหนุนนำ (เขาหนุนคุณ)";
        score += 10;
    }
    else if (ELEMENT_RELATION[person1.element].block === person2.element) {
        elementResult = "ธาตุพิฆาต (คุณกดเขา)";
        score -= 20;
    } 
    else if (ELEMENT_RELATION[person2.element].block === person1.element) {
        elementResult = "ธาตุพิฆาต (เขากดคุณ)";
        score -= 20;
    }

    // clamp score
    score = Math.max(20, Math.min(100, score));

    return {
        score,
        zodiacResult,
        elementResult,
        p1Element: person1.element,
        p2Element: person2.element
    };
}

// =====================
// UI
// =====================
function processCompatibility() {

    const myZodiac = document.getElementById('myZodiac')?.value;
    const partnerZodiac = document.getElementById('partnerZodiac')?.value;
    const resultDiv = document.getElementById('compatResult');

    if (!resultDiv) return;

    const result = analyzeCompatibility(myZodiac, partnerZodiac);

    if (result.error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="alert alert-warning text-center">${result.message}</div>`;
        return;
    }

    const icon1 = ELEMENT_RELATION[result.p1Element]?.icon || "";
    const icon2 = ELEMENT_RELATION[result.p2Element]?.icon || "";

    const colorScore =
        result.score >= 80 ? '#d4af37' :
        result.score >= 50 ? '#28a745' :
        '#dc3545';

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-lg text-center" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important;">
            <div class="text-center mb-4">
                <small class="text-white-50 d-block mb-1">ระดับความสมพงษ์โดยรวม</small>
                <div class="display-4 fw-bold mb-2" style="color: ${colorScore}; text-shadow: 0 0 15px ${colorScore}; font-size: clamp(2.4rem, 5vw, 3.5rem);">
                    ${result.score}%
                </div>
                <div class="badge px-3 py-2 rounded-pill fs-6 fw-bold" style="background: rgba(212,175,55,0.2); color: #ffd700; border: 1px solid rgba(212,175,55,0.4);">
                    ${result.zodiacResult} · ${result.elementResult}
                </div>
            </div>

            <div class="row align-items-center justify-content-center g-3 mb-3">
                <div class="col-md-5 col-5">
                    <div class="p-3 rounded-3" style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3);">
                        <small class="text-white-50 d-block mb-1">ดวงของคุณ</small>
                        <strong class="fs-5 text-white">ปี${myZodiac}</strong>
                        <div class="text-info small mt-1">ธาตุ${result.p1Element} ${icon1}</div>
                    </div>
                </div>
                <div class="col-md-2 col-2 text-center">
                    <div style="font-size: 2rem; filter: drop-shadow(0 0 8px rgba(248,113,113,0.6));">❤️</div>
                </div>
                <div class="col-md-5 col-5">
                    <div class="p-3 rounded-3" style="background: rgba(244, 114, 182, 0.12); border: 1px solid rgba(244, 114, 182, 0.3);">
                        <small class="text-white-50 d-block mb-1">ดวงของคู่ครอง</small>
                        <strong class="fs-5 text-white">ปี${partnerZodiac}</strong>
                        <div class="text-danger small mt-1" style="color: #f472b6 !important;">ธาตุ${result.p2Element} ${icon2}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultDiv.scrollIntoView?.({ behavior: 'smooth' });
}

function compatitable() {
    const container = document.getElementById('compatipage');
    if (!container) return;

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Main Hero Card -->
            <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
                
                <!-- Header -->
                <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(248, 113, 113, 0.6); box-shadow: 0 0 25px rgba(239, 68, 68, 0.35);" class="mb-2 animate__animated animate__pulse animate__infinite">
                        <i class="fas fa-heart fa-2x" style="color: #f87171; filter: drop-shadow(0 0 10px rgba(248,113,113,0.6));"></i>
                    </div>
                    <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">🔮 วิเคราะห์ดวงสมพงษ์</h1>
                    <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">ตรวจเช็คคู่ครองและพันธมิตร ตามตำราพรหมชาติไทย (สมพงศ์ธาตุ + ปีนักษัตร)</p>
                </div>

                <div class="card-body p-3 p-md-4">
                    <div style="max-width: 960px; margin: 0 auto;">
                        
                        <div class="row g-4 mb-4 align-items-stretch">
                            <!-- ฝ่ายของคุณ -->
                            <div class="col-md-6 col-12">
                                <div class="p-3 p-md-4 rounded-4 h-100" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(59, 130, 246, 0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(59, 130, 246, 0.25);">
                                        <div class="p-2 rounded-circle" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">
                                            <i class="fas fa-user fa-lg"></i>
                                        </div>
                                        <h4 class="fw-bold mb-0" style="color: #93c5fd; font-family: 'Chonburi', serif; font-size: 1.2rem;">ฝ่ายของคุณ</h4>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-address-book me-1"></i> ดึงจากประวัติสมาชิก:</label>
                                        <select id="compatMemberSelect1" class="form-select bg-dark text-white border-gold member-selector" onchange="autoFillCompatMember(1, this.value)" style="border-radius: 10px; border-color: rgba(212,175,55,0.4);">
                                            <option value="">-- เลือกสมาชิกจากประวัติ --</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-2">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-dragon me-1"></i> ปีนักษัตรของคุณ:</label>
                                        <select id="myZodiac" onchange="processCompatibility()" class="form-select bg-dark text-white border-gold fw-bold text-center" style="border-radius: 10px; height: 48px; border-color: rgba(212,175,55,0.4);">
                                            <option value="ชวด">ปีชวด (หนู - ธาตุน้ำ)</option>
                                            <option value="ฉลู">ปีฉลู (วัว - ธาตุดิน)</option>
                                            <option value="ขาล">ปีขาล (เสือ - ธาตุไฟ)</option>
                                            <option value="เถาะ">ปีเถาะ (กระต่าย - ธาตุลม)</option>
                                            <option value="มะโรง">ปีมะโรง (งูใหญ่ - ธาตุดิน)</option>
                                            <option value="มะเส็ง">ปีมะเส็ง (งูเล็ก - ธาตุไฟ)</option>
                                            <option value="มะเมีย">ปีมะเมีย (ม้า - ธาตุไฟ)</option>
                                            <option value="มะแม">ปีมะแม (แพะ - ธาตุดิน)</option>
                                            <option value="วอก">ปีวอก (ลิง - ธาตุลม)</option>
                                            <option value="ระกา">ปีระกา (ไก่ - ธาตุดิน)</option>
                                            <option value="จอ">ปีจอ (หมา - ธาตุดิน)</option>
                                            <option value="กุน">ปีกุน (หมู - ธาตุน้ำ)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- ฝ่ายของคู่ครอง/พันธมิตร -->
                            <div class="col-md-6 col-12">
                                <div class="p-3 p-md-4 rounded-4 h-100" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(244, 114, 182, 0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(244, 114, 182, 0.25);">
                                        <div class="p-2 rounded-circle" style="background: rgba(244, 114, 182, 0.2); color: #f472b6;">
                                            <i class="fas fa-user-plus fa-lg"></i>
                                        </div>
                                        <h4 class="fw-bold mb-0" style="color: #f472b6; font-family: 'Chonburi', serif; font-size: 1.2rem;">ฝ่ายคู่ครอง / พันธมิตร</h4>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-address-book me-1"></i> ดึงจากประวัติสมาชิก:</label>
                                        <select id="compatMemberSelect2" class="form-select bg-dark text-white border-gold member-selector" onchange="autoFillCompatMember(2, this.value)" style="border-radius: 10px; border-color: rgba(212,175,55,0.4);">
                                            <option value="">-- เลือกสมาชิกจากประวัติ --</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-2">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-dragon me-1"></i> ปีนักษัตรของคู่:</label>
                                        <select id="partnerZodiac" onchange="processCompatibility()" class="form-select bg-dark text-white border-gold fw-bold text-center" style="border-radius: 10px; height: 48px; border-color: rgba(212,175,55,0.4);">
                                            <option value="ชวด">ปีชวด (หนู - ธาตุน้ำ)</option>
                                            <option value="ฉลู">ปีฉลู (วัว - ธาตุดิน)</option>
                                            <option value="ขาล">ปีขาล (เสือ - ธาตุไฟ)</option>
                                            <option value="เถาะ">ปีเถาะ (กระต่าย - ธาตุลม)</option>
                                            <option value="มะโรง">ปีมะโรง (งูใหญ่ - ธาตุดิน)</option>
                                            <option value="มะเส็ง">ปีมะเส็ง (งูเล็ก - ธาตุไฟ)</option>
                                            <option value="มะเมีย">ปีมะเมีย (ม้า - ธาตุไฟ)</option>
                                            <option value="มะแม">ปีมะแม (แพะ - ธาตุดิน)</option>
                                            <option value="วอก">ปีวอก (ลิง - ธาตุลม)</option>
                                            <option value="ระกา">ปีระกา (ไก่ - ธาตุดิน)</option>
                                            <option value="จอ">ปีจอ (หมา - ธาตุดิน)</option>
                                            <option value="กุน">ปีกุน (หมู - ธาตุน้ำ)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mb-4">
                            <button class="btn btn-gold btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center gap-2" onclick="processCompatibility()" style="border-radius: 50px; font-size: 1.15rem;">
                                <i class="fas fa-magic text-danger"></i> ตรวจสอบผลวิเคราะห์ดวงสมพงษ์
                            </button>
                        </div>

                        <div id="compatResult" class="mt-4"></div>

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

    if (typeof updateAllMemberSelectors === 'function') {
        updateAllMemberSelectors();
    }
}

function autoFillCompatMember(personNum, memberId) {
    if (!memberId) return;
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const member = allHistory.find(m => m.memberId === memberId || m.id === memberId || m.birthdate === memberId);
    if (member && member.birthdate) {
        let year = 0;
        if (member.birthdate.includes('/')) {
            const parts = member.birthdate.split('/');
            year = parseInt(parts[2]);
        } else if (member.birthdate.includes('-')) {
            const parts = member.birthdate.split('-');
            year = parseInt(parts[0]);
        }
        if (year > 2400) year -= 543;
        if (year > 1900) {
            const zodiacNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
            const idx = (year - 1900) % 12;
            const zName = zodiacNames[idx < 0 ? idx + 12 : idx];
            const selectEl = document.getElementById(personNum === 1 ? 'myZodiac' : 'partnerZodiac');
            if (selectEl) {
                selectEl.value = zName;
                processCompatibility();
            }
        }
    }
}

window.autoFillCompatMember = autoFillCompatMember;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize compatibility page UI
    compatitable();
    // Ensure compatibility result is cleared
    const resultDiv = document.getElementById('compatResult');
    if (resultDiv) resultDiv.innerHTML = '';
});

// =====================
// QUICK MODE
// =====================
let debounceTimer = null;

function quickAnalyze() {

    if (typeof navigateTo === "function") {
        navigateTo('compatibilityPage');
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        processCompatibility();
    }, 300);
}