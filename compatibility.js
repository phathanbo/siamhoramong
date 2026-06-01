"use strict";

// =====================
// DATA
// =====================
const ZODIAC_MASTER = {
    "ชวด":   { element: "น้ำ", animal: "หนู", friend: ["ฉลู", "มะโรง", "วอก"], enemy: ["มะเมีย"] },
    "ฉลู":   { element: "ดิน", animal: "วัว", friend: ["ชวด", "มะเส็ง", "ระกา"], enemy: ["มะแม"] },
    "ขาล":   { element: "ลม", animal: "เสือ", friend: ["มะเมีย", "จอ", "กุน"], enemy: ["วอก"] },
    "เถาะ":  { element: "ลม", animal: "กระต่าย", friend: ["มะแม", "กุน", "จอ"], enemy: ["ระกา"] },
    "มะโรง": { element: "ดิน", animal: "งูใหญ่", friend: ["ชวด", "วอก", "ระกา"], enemy: ["จอ"] },
    "มะเส็ง": { element: "ไฟ", animal: "งูเล็ก", friend: ["ฉลู", "ระกา"], enemy: ["กุน"] },
    "มะเมีย": { element: "ไฟ", animal: "ม้า", friend: ["ขาล", "จอ"], enemy: ["ชวด"] },
    "มะแม":  { element: "ดิน", animal: "แพะ", friend: ["เถาะ", "กุน"], enemy: ["ฉลู"] },
    "วอก":   { element: "ลม", animal: "ลิง", friend: ["ชวด", "มะโรง"], enemy: ["ขาล"] },
    "ระกา":  { element: "ลม", animal: "ไก่", friend: ["ฉลู", "มะเส็ง", "มะโรง"], enemy: ["เถาะ"] },
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
        <div class="card border-gold animate__animated animate__fadeIn">
            <div class="card-body text-center">
                <h5 class="text-muted">ระดับความสมพงษ์</h5>
                <div style="font-size:4rem;color:${colorScore}">
                    ${result.score}%
                </div>
                <h3 class="text-gold">${result.zodiacResult} <strong class="text-gold"> ${result.elementResult}</strong></h3>
                       
                <table class="table text-center fs-6">
                    <thead>
                        <tr>
                            <th>ดวงชะตาของคุณ</th>
                            <th></th>
                            <th>ดวงชะตาคู่ครอง</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                ปี${myZodiac}<br>
                                <b>ธาตุ${result.p1Element} ${icon1}</b>
                            </td>
                            <td class="align-middle" style="font-size: 2rem;">❤️</td>
                            <td>
                                ปี${partnerZodiac}<br>
                                <b>ธาตุ${result.p2Element} ${icon2}</b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> 
        </div>
    `;

    resultDiv.scrollIntoView?.({ behavior: 'smooth' });
}

function compatitable() {
    const container =document.getElementById('compatipage');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4 border-bottom-gold">
                <h2 class="text-gold mb-1">🔮 วิเคราะห์ดวงสมพงษ์</h2>
                <span class="text-gold mb-1">ตรวจเช็คคู่ครองและพันธมิตร ตามตำราพรหมชาติไทย</span>
            </div>
            <div class="card-body bg-light">
                <div class="row justify-content-center align-items-center">
                    <div class="col-md-5">
                        <div class="form-group text-center">
                            <label class="font-weight-bold text-dark">นักษัตรของคุณ:</label>
                            <select id="myZodiac" onchange="processCompatibility()" class="form-control form-control-lg border-gold shadow-inner"
                                style="border-radius: 15px; color: #ffcf56; text-align: center;">
                                <option value="ชวด">ปีชวด (หนู)</option>
                                <option value="ฉลู">ปีฉลู (วัว)</option>
                                <option value="ขาล">ปีขาล (เสือ)</option>
                                <option value="เถาะ">ปีเถาะ (กระต่าย)</option>
                                <option value="มะโรง">ปีมะโรง (งูใหญ่)</option>
                                <option value="มะเส็ง">ปีมะเส็ง (งูเล็ก)</option>
                                <option value="มะเมีย">ปีมะเมีย (ม้า)</option>
                                <option value="มะแม">ปีมะแม (แพะ)</option>
                                <option value="วอก">ปีวอก (ลิง)</option>
                                <option value="ระกา">ปีระกา (ไก่)</option>
                                <option value="จอ">ปีจอ (หมา)</option>
                                <option value="กุน">ปีกุน (หมู)</option>
                            </select>
                        </div>
                    </div>
                        <div style="font-size: 3rem; line-height: 100px;">❤️</div>
                    <div class="col-md-5">
                        <div class="form-group text-center">
                            <label class="font-weight-bold text-dark">นักษัตรของคู่:</label>
                            <select id="partnerZodiac" onchange="processCompatibility()" class="form-control form-control-lg border-gold shadow-inner"
                                style="border-radius: 15px; color: #b8860b; text-align: center;">
                                <option value="ชวด">ปีชวด (หนู)</option>
                                <option value="ฉลู">ปีฉลู (วัว)</option>
                                <option value="ขาล">ปีขาล (เสือ)</option>
                                <option value="เถาะ">ปีเถาะ (กระต่าย)</option>
                                <option value="มะโรง">ปีมะโรง (งูใหญ่)</option>
                                <option value="มะเส็ง">ปีมะเส็ง (งูเล็ก)</option>
                                <option value="มะเมีย">ปีมะเมีย (ม้า)</option>
                                <option value="มะแม">ปีมะแม (แพะ)</option>
                                <option value="วอก">ปีวอก (ลิง)</option>
                                <option value="ระกา">ปีระกา (ไก่)</option>
                                <option value="จอ">ปีจอ (หมา)</option>
                                <option value="กุน">ปีกุน (หมู)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="btn btn-gold btn-block btn-lg shadow mt-4 py-3 font-weight-bold"
                    onclick="processCompatibility()">✨ วิเคราะห์ดวงสมพงษ์
                </button>
                <div id="compatResult" class="mt-4"></div>
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
}

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