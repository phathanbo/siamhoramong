"use strict";

function showMatch(){
    const contianer = document.getElementById('showMatchpage');
    if (!contianer) return;
    contianer.style.display = 'block';

    const html = `
        <div class="container-fluid py-4 px-2 px-md-4" style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Main Hero Card -->
            <div class="card shadow-lg border-0 overflow-hidden mb-4" style="background: radial-gradient(ellipse at top, #1e2246 0%, #111428 60%, #090a16 100%); border: 1px solid rgba(212, 175, 55, 0.4) !important; border-radius: 24px;">
                
                <!-- Header -->
                <div class="card-header text-center py-4 py-md-5 position-relative" style="background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 75px; height: 75px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(21, 25, 53, 0.8) 100%); border: 2px solid rgba(232, 200, 118, 0.6); box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);" class="mb-2 animate__animated animate__rotateIn">
                        <i class="fas fa-ring fa-2x" style="color: #ffd700; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));"></i>
                    </div>
                    <h1 class="fw-bold mb-2" style="font-family: 'Chonburi', 'Sarabun', serif; color: #ffd700; text-shadow: 0 2px 10px rgba(255,215,0,0.3); font-size: clamp(1.8rem, 4vw, 2.4rem);">💍 หาคู่รักหรือคู่สมรส</h1>
                    <p class="text-light mb-0" style="font-size: 1rem; opacity: 0.85; letter-spacing: 0.5px;">สมพงษ์ธาตุกำเนิดและสมพงษ์อายุ (ตำราฉัตร ๙ ชั้น และตำรานาคราช)</p>
                </div>

                <div class="card-body p-3 p-md-4">
                    <div style="max-width: 960px; margin: 0 auto;">
                        
                        <div class="row g-4 mb-4 align-items-stretch">
                            <!-- ฝ่ายชาย -->
                            <div class="col-md-6 col-12">
                                <div class="p-3 p-md-4 rounded-4 h-100" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(59, 130, 246, 0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(59, 130, 246, 0.25);">
                                        <div class="p-2 rounded-circle" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">
                                            <i class="fas fa-male fa-lg"></i>
                                        </div>
                                        <h4 class="fw-bold mb-0" style="color: #93c5fd; font-family: 'Chonburi', serif; font-size: 1.2rem;">ฝ่ายชาย</h4>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-address-book me-1"></i> ดึงจากประวัติสมาชิก:</label>
                                        <select id="matchMemberSelectMale" class="form-select bg-dark text-white border-gold member-selector" onchange="autoFillMatchMember('male', this.value)" style="border-radius: 10px; border-color: rgba(212,175,55,0.4);">
                                            <option value="">-- เลือกสมาชิกจากประวัติ --</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-dragon me-1"></i> ปีนักษัตรฝ่ายชาย:</label>
                                        <select id="maleYear" class="form-select bg-dark text-white border-gold fw-bold" onchange="calculateMarriageMatch();calculateElementMatch()" style="border-radius: 10px; height: 46px; border-color: rgba(212,175,55,0.4);">
                                            <option value="ชวด">ชวด (หนู ธาตุน้ำ)</option>
                                            <option value="ฉลู">ฉลู (วัว ธาตุดิน)</option>
                                            <option value="ขาล">ขาล (เสือ ธาตุไม้)</option>
                                            <option value="เถาะ">เถาะ (กระต่าย ธาตุไม้)</option>
                                            <option value="มะโรง">มะโรง (งูใหญ่ ธาตุทอง)</option>
                                            <option value="มะเส็ง">มะเส็ง (งูเล็ก ธาตุไฟ)</option>
                                            <option value="มะเมีย">มะเมีย (ม้า ธาตุไฟ)</option>
                                            <option value="มะแม">มะแม (แพะ ธาตุทอง)</option>
                                            <option value="วอก">วอก (ลิง ธาตุเหล็ก)</option>
                                            <option value="ระกา">ระกา (ไก่ ธาตุเหล็ก)</option>
                                            <option value="จอ">จอ (หมา ธาตุดิน)</option>
                                            <option value="กุน">กุน (หมู ธาตุน้ำ)</option>
                                        </select>
                                    </div>

                                    <div class="mb-2">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-birthday-cake me-1"></i> อายุย่างฝ่ายชาย (ปี):</label>
                                        <input type="number" id="maleAge" class="form-control bg-dark text-white border-gold text-center fw-bold" placeholder="ระบุอายุชาย เช่น 28" oninput="calculateMarriageMatch();calculateElementMatch()" style="border-radius: 10px; height: 46px; border-color: rgba(212,175,55,0.4);">
                                    </div>
                                </div>
                            </div>

                            <!-- ฝ่ายหญิง -->
                            <div class="col-md-6 col-12">
                                <div class="p-3 p-md-4 rounded-4 h-100" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1px solid rgba(244, 114, 182, 0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                                    <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(244, 114, 182, 0.25);">
                                        <div class="p-2 rounded-circle" style="background: rgba(244, 114, 182, 0.2); color: #f472b6;">
                                            <i class="fas fa-female fa-lg"></i>
                                        </div>
                                        <h4 class="fw-bold mb-0" style="color: #f472b6; font-family: 'Chonburi', serif; font-size: 1.2rem;">ฝ่ายหญิง</h4>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-address-book me-1"></i> ดึงจากประวัติสมาชิก:</label>
                                        <select id="matchMemberSelectFemale" class="form-select bg-dark text-white border-gold member-selector" onchange="autoFillMatchMember('female', this.value)" style="border-radius: 10px; border-color: rgba(212,175,55,0.4);">
                                            <option value="">-- เลือกสมาชิกจากประวัติ --</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-dragon me-1"></i> ปีนักษัตรฝ่ายหญิง:</label>
                                        <select id="femaleYear" class="form-select bg-dark text-white border-gold fw-bold" onchange="calculateMarriageMatch();calculateElementMatch()" style="border-radius: 10px; height: 46px; border-color: rgba(212,175,55,0.4);">
                                            <option value="ชวด">ชวด (หนู ธาตุน้ำ)</option>
                                            <option value="ฉลู">ฉลู (วัว ธาตุดิน)</option>
                                            <option value="ขาล">ขาล (เสือ ธาตุไม้)</option>
                                            <option value="เถาะ">เถาะ (กระต่าย ธาตุไม้)</option>
                                            <option value="มะโรง">มะโรง (งูใหญ่ ธาตุทอง)</option>
                                            <option value="มะเส็ง">มะเส็ง (งูเล็ก ธาตุไฟ)</option>
                                            <option value="มะเมีย">มะเมีย (ม้า ธาตุไฟ)</option>
                                            <option value="มะแม">มะแม (แพะ ธาตุทอง)</option>
                                            <option value="วอก">วอก (ลิง ธาตุเหล็ก)</option>
                                            <option value="ระกา">ระกา (ไก่ ธาตุเหล็ก)</option>
                                            <option value="จอ">จอ (หมา ธาตุดิน)</option>
                                            <option value="กุน">กุน (หมู ธาตุน้ำ)</option>
                                        </select>
                                    </div>

                                    <div class="mb-2">
                                        <label class="form-label small fw-semibold" style="color: #e8c876;"><i class="fas fa-birthday-cake me-1"></i> อายุย่างฝ่ายหญิง (ปี):</label>
                                        <input type="number" id="femaleAge" class="form-control bg-dark text-white border-gold text-center fw-bold" placeholder="ระบุอายุหญิง เช่น 26" oninput="calculateMarriageMatch();calculateElementMatch()" style="border-radius: 10px; height: 46px; border-color: rgba(212,175,55,0.4);">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mb-4">
                            <button type="button" class="btn btn-gold btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center gap-2" onclick="calculateMarriageMatch();calculateElementMatch()" style="border-radius: 50px; font-size: 1.15rem;">
                                <i class="fas fa-search-heart text-danger"></i> ตรวจสอบสมพงษ์ธาตุและอายุ
                            </button>
                        </div>

                        <div id="marriage-result-display" class="result-card mb-4" style="display: none;">
                            <div id="match-status-icon"></div>
                            <div id="match-text-content"></div>
                        </div>

                        <div id="element-result-display" class="result-card mb-4" style="display: none;">
                            <div id="element-text-content"></div>
                            <hr style="border: 0; border-top: 1px solid rgba(212,175,55,0.3); margin: 15px 0;">
                            <div id="age-text-content"></div>
                        </div>

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

    if (typeof updateAllMemberSelectors === 'function') {
        updateAllMemberSelectors();
    }
}

function autoFillMatchMember(gender, memberId) {
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
            const selectEl = document.getElementById(gender === 'male' ? 'maleYear' : 'femaleYear');
            if (selectEl) selectEl.value = zName;

            const ageEl = document.getElementById(gender === 'male' ? 'maleAge' : 'femaleAge');
            if (ageEl && typeof window.calculateRunningAge === 'function') {
                let formatted = `${year}-${member.birthdate.split(/[\/-]/)[1].padStart(2,'0')}-${member.birthdate.split(/[\/-]/)[0].padStart(2,'0')}`;
                ageEl.value = window.calculateRunningAge(formatted);
            }
            calculateMarriageMatch();
            calculateElementMatch();
        }
    }
}

window.autoFillMatchMember = autoFillMatchMember;

document.addEventListener('DOMContentLoaded', () => {
    showMatch()
});

function calculateElementMatch() {
    const maleYear = document.getElementById('maleYear').value;
    const femaleYear = document.getElementById('femaleYear').value;
    const maleAge = parseInt(document.getElementById('maleAge').value) || 0;
    const femaleAge = parseInt(document.getElementById('femaleAge').value) || 0;
    
    const display = document.getElementById('element-result-display');
    const elemContent = document.getElementById('element-text-content');
    const ageContent = document.getElementById('age-text-content');

    // 1. แปลงปีเป็นธาตุ
    const yearToElement = {
        "ชวด": "น้ำ", "กุน": "น้ำ",
        "ฉลู": "ดิน", "จอ": "ดิน",
        "ขาล": "ไม้", "เถาะ": "ไม้",
        "มะโรง": "ทอง", "มะแม": "ทอง",
        "มะเส็ง": "ไฟ", "มะเมีย": "ไฟ",
        "วอก": "เหล็ก", "ระกา": "เหล็ก"
    };

    const mElem = yearToElement[maleYear];
    const fElem = yearToElement[femaleYear];

    // 2. ตรวจสอบสมพงษ์ธาตุ (ตามกฎ 25 ข้อ)
    let elemResult = "";
    
    // กฎพิเศษ: ธาตุทองผสมกับอะไรก็ได้
    if (mElem === "ทอง" || fElem === "ทอง") {
        elemResult = "ธาตุทองนั้นไม่เลือกนิยม คือจะผสมเข้ากับธาตุใดๆ ก็ได้ (ถือว่าดี)";
    } else {
        const combo = `${mElem}-${fElem}`;
        switch (combo) {
            case "น้ำ-น้ำ": elemResult = "อยู่ด้วยกันจะเป็นสุขสบายใจ"; break;
            case "น้ำ-ดิน": elemResult = "จะมีความรักกันมาก"; break;
            case "น้ำ-ไม้": elemResult = "ดีนักจะบริบูรณ์ด้วยทรัพย์สมบัติ"; break;
            case "น้ำ-ไฟ": elemResult = "ดีแต่มักจะหึงส์กัน"; break;
            case "น้ำ-เหล็ก": elemResult = "ดีนักจะได้ยศถาบรรดาศักดิ์"; break;
            case "ดิน-ดิน": elemResult = "ดีจะมีบุตรด้วยกันและอายุยืน"; break;
            case "ดิน-น้ำ": elemResult = "อยู่ด้วยกันปีหนึ่งจะได้ดีจะมีผู้อุปถัมภ์ค้ำชู ชุบเลี้ยง"; break;
            case "ดิน-ไม้": elemResult = "อยู่ด้วยกันไม่ดี"; break;
            case "ดิน-ไฟ": elemResult = "จะได้ดีต่อภายแก่และมีทรัพย์มาก"; break;
            case "ดิน-เหล็ก": elemResult = "อยู่ด้วยกันจะมีบุตรหลายคน"; break;
            case "ไม้-ไม้": elemResult = "ไม่ดีอยู่กินด้วยกันอาภัพไม่เกิดลาภผลสักการเลย"; break;
            case "ไม้-น้ำ": elemResult = "มีความสุขมีทรัพย์แต่เลี้ยงบุตรยาก"; break;
            case "ไม้-ดิน": elemResult = "รักกันแต่จะต้องจากกัน"; break;
            case "ไม้-ไฟ": elemResult = "ดีจะมีบุตรชายก่อนแต่มักจะกำพร้า"; break;
            case "ไม้-เหล็ก": elemResult = "ไม่ดีอยู่ด้วยกันไม่นาน"; break;
            case "ไฟ-ไฟ": elemResult = "ไม่ดีอาภัพจะเข็ญใจ"; break;
            case "ไฟ-น้ำ": elemResult = "เมื่อต้นไม่ดีภายหลังดีอายุยืนแต่มักจะเกิดเป็นปากเสียงกัน"; break;
            case "ไฟ-ดิน": elemResult = "อยู่ด้วยกันไม่นานจะต้องทิ้งหย่ากัน"; break;
            case "ไฟ-ไม้": elemResult = "ไม่ดีจะวิวาทเป็นปากเสียง"; break;
            case "ไฟ-เหล็ก": elemResult = "ไม่ดีไร้ทรัพย์สมบัติ"; break;
            case "เหล็ก-เหล็ก": elemResult = "ดีนักจะอยู่เย็นเป็นสุขด้วยกันทั้งสอง"; break;
            case "เหล็ก-น้ำ": elemResult = "ดีนักจะอยู่กินด้วยกันมีความสุขเปรมใจ"; break;
            case "เหล็ก-ดิน": elemResult = "อยู่กินด้วยกันดีจะเจริญด้วยทรัพย์สิน"; break;
            case "เหล็ก-ไม้": elemResult = "จะได้เป็นใหญ่เป็นโตมีผู้นับหน้าถือตามาก"; break;
            default: elemResult = "คำทำนายเป็นมัธยม (กลางๆ)";
        }
    }

    // 3. คำนวณสมพงษ์อายุ (สูตร: ((ชาย+หญิง) * 12) / 7)
    let ageResult = "";
    if (maleAge > 0 && femaleAge > 0) {
        const totalAge = maleAge + femaleAge;
        const remainder = (totalAge * 12) % 7;
        
        if ([3, 5, 6].includes(remainder)) {
            ageResult = `เศษ ${remainder}: จะประกอบไปด้วยทรัพย์สมบัติรักกันดีนัก`;
        } else if ([2, 4, 0, 7].includes(remainder) || remainder === 1) { // 0 หรือ 7 คือลงตัว
            ageResult = `เศษ ${remainder}: จะเจ็บไข้ได้ป่วย ทรัพย์สมบัติไม่มั่นคงถาวร ทรัพย์ร้อนและที่อยู่ก็ร้อน`;
        } else {
            ageResult = `เศษ ${remainder}: อยู่ในเกณฑ์ปานกลาง`;
        }
    } else {
        ageResult = "กรุณากรอกอายุของทั้งสองฝ่ายเพื่อคำนวณเศษ";
    }

    // แสดงผล
    display.style.display = "block";
    elemContent.innerHTML = `<strong>สมพงษ์ธาตุ (${mElem} - ${fElem}):</strong><br>${elemResult}`;
    ageContent.innerHTML = `<strong>สมพงษ์อายุ:</strong><br>${ageResult}`;
}

// ฟังก์ชันตรวจสอบความสมพงษ์ปีนักษัตร (สมบูรณ์)
function calculateMarriageMatch() {
    const maleSelect = document.getElementById('maleYear');
    const femaleSelect = document.getElementById('femaleYear');
    const display = document.getElementById('marriage-result-display');
    const textContent = document.getElementById('match-text-content');

    const male = maleSelect.value.trim();
    const female = femaleSelect.value.trim();

    // Validation
    if (!male || !female) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกปีเกิดของทั้งชายและหญิง', 'warning');
        return;
    }

    // สร้าง Key แบบสมมาตร (เรียงตามลำดับภาษาไทย)
    const pairKey = [male, female].sort((a, b) => a.localeCompare(b, 'th')).join('-');

    // === Database ===
    const database = {
        // === 1. กลุ่มสมพงษ์ดีมาก (GOOD) ===
        "ชวด-มะเมีย": { text: "สมพงษ์อยู่นาคตัวเดียวกันดีนัก จะมีบุตรมากและรักใคร่กันมาก มีความสุขสำราญเป็นนิตย์", level: "good" },
        "มะแม-วอก": { text: "สมพงษ์อยู่นาคตัวเดียวกันดีนัก จะมีบุตรมากและรักใคร่กันมาก มีความสุขสำราญเป็นนิตย์", level: "good" },
        "มะโรง-มะเมีย": { text: "สมพงษ์อยู่นาคตัวเดียวกันดีนัก จะมีบุตรมากและรักใคร่กันมาก มีความสุขสำราญเป็นนิตย์", level: "good" },
        "มะโรง-มะแม": { text: "สมพงษ์อยู่นาคตัวเดียวกันดีนัก จะมีบุตรมากและรักใคร่กันมาก มีความสุขสำราญเป็นนิตย์", level: "good" },
        "ฉลู-เถาะ": { text: "สมพงษ์อยู่นาคตัวเดียวกัน เป็นสุขทุกทิพาราตรีกาล", level: "good" },
        "ฉลู-กุน": { text: "สมพงษ์อยู่นาคตัวเดียวกัน เป็นสุขทุกทิพาราตรีกาล", level: "good" },

        "ขาล-ระกา": { text: "เป็นคู่ที่ใช้ได้และเป็นสุขดีมาก", level: "good" },
        "ขาล-วอก": { text: "เป็นคู่ที่ใช้ได้และเป็นสุขดีมาก", level: "good" },
        "ระกา-วอก": { text: "เป็นคู่ที่ใช้ได้และเป็นสุขดีมาก", level: "good" },

        "ฉลู-มะเมีย": { text: "ดีนัก ท่านว่านิสัยใจคอเป็นอันเดียวกัน ดีชั่วด้วยกัน (โดยเฉพาะฝ่ายชายจะรักหญิงมาก)", level: "good" },
        "ฉลู-มะแม": { text: "ดีนัก ท่านว่านิสัยใจคอเป็นอันเดียวกัน ดีชั่วด้วยกัน", level: "good" },
        "มะเส็ง-มะเมีย": { text: "ดีนัก ท่านว่านิสัยใจคอเป็นอันเดียวกัน ดีชั่วด้วยกัน", level: "good" },
        "มะเส็ง-มะแม": { text: "ดีนัก ท่านว่านิสัยใจคอเป็นอันเดียวกัน ดีชั่วด้วยกัน", level: "good" },

        "ชวด-เถาะ": { text: "คู่นี้ดีนัก เป็นคู่สร้างคู่สม", level: "good" },
        "เถาะ-มะโรง": { text: "คู่นี้ดีนัก อยู่ด้วยกันแล้วเจริญ", level: "good" },
        "กุน-วอก": { text: "คู่นี้ดีนัก อยู่ด้วยกันแล้วมีความสุข", level: "good" },
        "ชวด-ขาล": { text: "คู่นี้ดีนัก", level: "good" },
        "ขาล-มะเส็ง": { text: "คู่นี้ดีนัก", level: "good" },

        // === 2. กลุ่มปานกลาง (NEUTRAL) ===
        "ชวด-มะโรง": { text: "คู่นี้อยู่กินด้วยกันแล้วเป็นมัธยมปานกลาง", level: "neutral" },
        "มะเมีย-มะแม": { text: "คู่นี้อยู่กินด้วยกันแล้วเป็นมัธยมปานกลาง", level: "neutral" },
        "ฉลู-มะเส็ง": { text: "คำทำนายเป็นมัธยมปานกลาง", level: "neutral" },
        "กุน-เถาะ": { text: "คำทำนายเป็นมัธยมปานกลาง", level: "neutral" },
        "มะเมีย-ระกา": { text: "อยู่ในเกณฑ์มัธยม พอใช้ได้", level: "neutral" },
        "มะแม-ระกา": { text: "อยู่ในเกณฑ์มัธยม พอใช้ได้", level: "neutral" },
        "มะเมีย-วอก": { text: "อยู่ในเกณฑ์มัธยม พอใช้ได้", level: "neutral" },
        "ขาล-ฉลู": { text: "พอใช้ได้ถึงปานกลาง", level: "neutral" },
        "จอ-มะเส็ง": { text: "พอใช้ได้ถึงปานกลาง", level: "neutral" },
        "ฉลู-จอ": { text: "พอใช้ได้ถึงปานกลาง", level: "neutral" },
        "ขาล-จอ": { text: "มักแข่งฤทธิเดชกัน (ควรระวังเรื่องการเอาชนะกัน)", level: "neutral" },
        "กุน-มะโรง": { text: "พอค่อยยังชั่ว แต่มักจะเป็นปากเสียงกันเหมือนพระรามกับสีดา", level: "neutral" },

        // === 3. กลุ่มไม่ดี/ควรระวัง (BAD) ===
        "ฉลู-มะโรง": { text: "อยู่กินด้วยกันไม่ดีเลย มักหึงหวงและมีปากเสียงกัน", level: "bad" },
        "ชวด-ฉลู": { text: "อยู่กินด้วยกันไม่ดีเลย มักหึงหวงและมีปากเสียงกัน", level: "bad" },
        "มะโรง-มะเส็ง": { text: "อยู่กินด้วยกันไม่ดีเลย มักหึงหวงและมีปากเสียงกัน", level: "bad" },
        "ชวด-มะเส็ง": { text: "อยู่กินด้วยกันไม่ดีเลย มักหึงหวงและมีปากเสียงกัน", level: "bad" },

        "เถาะ-มะเมีย": { text: "ไม่ดีเลย ไม่ใคร่จะรักกันจริง หากอยู่ด้วยกันได้ก็เป็นมัธยม", level: "bad" },
        "กุน-มะเมีย": { text: "ไม่ดีเลย ไม่ใคร่จะรักกันจริง", level: "bad" },
        "เถาะ-มะแม": { text: "ไม่ดีเลย ไม่ใคร่จะรักกันจริง", level: "bad" },
        "กุน-มะแม": { text: "ไม่ดีเลย ไม่ใคร่จะรักกันจริง", level: "bad" },

        "จอ-มะโรง": { text: "ไม่ดี ไม่ค่อยเกรงใจกัน มักเกิดหึงหวงและวิวาทกัน", level: "bad" },
        "จอ-มะเมีย": { text: "ไม่ดี ไม่ค่อยเกรงใจกัน มักเกิดหึงหวงและวิวาทกัน", level: "bad" },
        "จอ-มะแม": { text: "ไม่ดี ไม่ค่อยเกรงใจกัน มักเกิดหึงหวงและวิวาทกัน", level: "bad" },
        "ขาล-มะเมีย": { text: "ไม่ดี ไม่ค่อยเกรงใจกัน มักเกิดหึงหวงและวิวาทกัน", level: "bad" },
        "ขาล-มะแม": { text: "ไม่ดี ไม่ค่อยเกรงใจกัน มักเกิดหึงหวงและวิวาทกัน", level: "bad" },

        "มะโรง-ระกา": { text: "ไม่ดีเลย มักแข่งดีกันเสมอ ไม่ยอมลดละให้กัน", level: "bad" },
        "ระกา-ชวด": { text: "ไม่ดีเลย มักแข่งดีกันเสมอ ไม่ยอมลดละให้กัน", level: "bad" },
        "มะโรง-วอก": { text: "ไม่ดีเลย มักแข่งดีกันเสมอ ไม่ยอมลดละให้กัน", level: "bad" },
        "ชวด-วอก": { text: "ไม่ดีเลย มักแข่งดีกันเสมอ ไม่ยอมลดละให้กัน", level: "bad" },

        "เถาะ-วอก": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน หรือทะเลาะวิวาทเนืองๆ", level: "bad" },
        "กุน-ระกา": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน", level: "bad" },
        "ฉลู-วอก": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน", level: "bad" },
        "มะเส็ง-วอก": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน", level: "bad" },
        "ฉลู-ระกา": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน", level: "bad" },
        "มะเส็ง-ระกา": { text: "ไม่ดีเลย มักตกอับขัดสน ต้นมือดีปลายมือต้องจากกัน", level: "bad" },

        "ขาล-เถาะ": { text: "ไม่ดีเลย มักให้ร้ายแก่กัน และจะต้องหย่าจากกันเหมือนเมรีจากพระรถฯ", level: "bad" },
        "ขาล-กุน": { text: "ไม่ดีเลย มักให้ร้ายแก่กัน และจะต้องหย่าจากกันเหมือนเมรีจากพระรถฯ", level: "bad" },
        "กุน-จอ": { text: "ไม่ดีเลย มักให้ร้ายแก่กัน และจะต้องหย่าจากกันเหมือนเมรีจากพระรถฯ", level: "bad" }
    };

    let result;

    if (male === female) {
        result = { 
            text: `ปี${male}เหมือนกัน ท่านว่าเป็นมัธยมปานกลาง (อยู่ด้วยกันได้ตามปกติ)`, 
            level: "neutral" 
        };
    } else {
        result = database[pairKey] || { 
            text: "ไม่มีข้อมูลระบุในตำราโดยตรง (โดยทั่วไปถือเป็นมัธยมปานกลาง)", 
            level: "neutral" 
        };
    }

    // อัปเดต UI
    display.style.display = "block";
    display.className = `result-card ${result.level}`;
    
    textContent.innerHTML = `
        <p>${result.text}</p>
        ${result.level === 'good' ? '<span class="status good">● ดีมาก</span>' : ''}
        ${result.level === 'neutral' ? '<span class="status neutral">● ปานกลาง</span>' : ''}
        ${result.level === 'bad' ? '<span class="status bad">● ควรระวัง</span>' : ''}
    `;
}

// เพิ่ม Event Listener (แนะนำให้ใส่ในส่วน <script> หรือไฟล์ JS)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('checkBtn');
    if (btn) {
        btn.addEventListener('click', checkMarriageCompatibility);
    }
});
