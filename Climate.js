/**
 * 🌧️ พิรุณศาสตร์ - ศาสตร์การขอฝน
 *
 * อ้างอิง:
 * - พิรุณศาสตร์ = "หลักวิชาว่าด้วยฝน"
 * - คัมภีร์โหราศาสตร์ไทยมาตรฐาน
 * - หลักการ: ดาว 9 ดวง + ปีเกิด → คาดการณ์ปริมาณฝน
 * - ใช้ในเกษตรกรรมและเพื่อขอให้เกิดฝนตามความเหมาะสม
 *
 * หมายเหตุ: พิรุณศาสตร์เป็นศาสตร์การโหรา ไม่ใช่วิทยาศาสตร์อากาศ
 */

"use strict";

// ข้อมูลพิรุณศาสตร์ตามดาว 9 ดวง
const PIRUN_BY_PLANET = {
    1: {
        planet: "อาทิตย์",
        symbol: "☀️",
        prediction: "น้ำฝนน้อย แดดร้อน ธัญญาหารขาดแคลน",
        rainfall: "น้อย (0-50%)",
        crops: "ต้องการรดน้ำเพิ่มเติม ระวังภัยแล้ง",
        recommendation: "ปลูกพืชที่ทนแล้งได้"
    },
    2: {
        planet: "จันทร์",
        symbol: "🌙",
        prediction: "น้ำฝนปกติ ธัญญาหารดี เพียงพอบริโภค",
        rainfall: "ปกติ (50-100%)",
        crops: "ผลผลิตสมดุล มีน้ำเพียงพอ",
        recommendation: "ปลูกพืชตามฤดูกาลปกติ"
    },
    3: {
        planet: "พฤหัสบดี",
        symbol: "♃",
        prediction: "น้ำฝนมาก ธัญญาหารอุดม ผลผลิตดี",
        rainfall: "มาก (100-150%)",
        crops: "ผลผลิตสูง อุดมสมบูรณ์",
        recommendation: "เหมาะสำหรับทุกชนิดพืช"
    },
    5: {
        planet: "พุธ",
        symbol: "☿️",
        prediction: "น้ำฝนปะปนแปร ธัญญาหารลังเล เนื้อที่บางส่วนดี",
        rainfall: "ผันผวน (50-100%)",
        crops: "ผลผลิตไม่แน่นอน บางพื้นที่ดี บางพื้นที่ไม่ดี",
        recommendation: "เตรียมการรดน้ำสำรอง"
    },
    6: {
        planet: "ศุกร์",
        symbol: "♀",
        prediction: "น้ำฝนดี ธัญญาหารดีสม่ำเสมอ",
        rainfall: "ดี (80-120%)",
        crops: "ผลผลิตมั่นคง สม่ำเสมอ",
        recommendation: "สภาพดีสำหรับการเกษตร"
    },
    8: {
        planet: "เสาร์",
        symbol: "♄",
        prediction: "น้ำฝนขาดแคลน ภัยแล้ง ธัญญาหารน้อย",
        rainfall: "น้อย (20-50%)",
        crops: "ผลผลิตต่ำ ต้องระวังภัยแล้ง",
        recommendation: "ต้องเก็บน้ำสำรอง ปลูกพืชทนแล้ง"
    },
    9: {
        planet: "อังคาร",
        symbol: "♂",
        prediction: "น้ำฝนสุม ฝนลงหนัก บ้านบาง ภัยน้ำท่วม",
        rainfall: "สูงกว่าปกติ (120-180%)",
        crops: "ต้องระวังน้ำท่วม อาจมีปัญหา",
        recommendation: "ต้องระบายน้ำดี หลีกเลี่ยงพื้นที่เตี้ย"
    }
};

// วิธีการขอฝนตามพิรุณศาสตร์
const PIRUN_METHODS = [
    { name: "พิธีขอพระเจ้าน้ำ", description: "ไหว้พระเจ้าน้ำหรือเทวดาแห่งฝน ในวันพระต่อเดือน" },
    { name: "การปล่อยสัตว์", description: "ปล่อยสัตว์น้ำ เช่น ปลา กบ เพื่อหวังให้เกิดฝน" },
    { name: "การสึกน้ำ", description: "สึกหน้าด้วยน้ำที่สะสมจากท้องฟ้า เพื่อสื่อสารความปรารถนา" },
    { name: "การทำบุญตามหลัก", description: "ทำบุญเพื่อหวังให้เกิดผลสัตบรรณ ช่วยให้เกิดฝน" }
];

function showClimate() {
    const container = document.getElementById('climate-section');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">🌧️ พิรุณศาสตร์ - ศาสตร์การขอฝน</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากคัมภีร์โหราศาสตร์ไทย</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิดของคุณ:</strong></label>
                <input type="date" id="pirunBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="calculatePirun()">
                <i class="fas fa-cloud-rain mr-2"></i>คาดการณ์ปริมาณฝนปีนี้
            </button>

            <div id="pirunResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ พิรุณศาสตร์ (Pirun Sastra) = ศาสตร์การขอฝน<br>
                ✓ คัมภีร์โหราศาสตร์ไทยมาตรฐาน<br>
                ✓ หลักการ: ดาว 9 ดวง → คาดการณ์ปริมาณฝน<br>
                ✓ ใช้ในเกษตรกรรมแบบดั้งเดิม
            </div>

            <div class="row mt-4">
                <div class="col-6">
                    <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> กลับห้องพยากรณ์
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

/**
 * 🌧️ คาดการณ์ปริมาณฝน
 */
function calculatePirun() {
    const birthDateEl = document.getElementById('pirunBirthDate');
    const resultEl = document.getElementById('pirunResult');

    if (!birthDateEl.value) {
        alert('⚠️ กรุณากรอกวันเกิด');
        return;
    }

    const birthDate = new Date(birthDateEl.value);
    const birthDay = birthDate.getDate();

    // คำนวณดาวเกิด
    const planetNum = (birthDay % 9) || 9;
    const planet = PIRUN_BY_PLANET[planetNum];

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">🌧️ คาดการณ์พิรุณศาสตร์</h4>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">⭐ ดาวเกิดของคุณ</h6>
                    <p class="mb-2"><strong>${planet.symbol} ${planet.planet}</strong></p>
                    <p class="small mb-0">ตามหลักพิรุณศาสตร์ วันที่ ${birthDay} สอดคล้องกับ ${planet.planet}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">🌧️ คาดการณ์ปริมาณฝน</h6>
                    <p class="mb-2"><strong>${planet.rainfall}</strong></p>
                    <p class="small mb-0">${planet.prediction}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">🌾 ผลต่อธัญญาหาร</h6>
                    <p class="small mb-0">${planet.crops}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-2">💡 คำแนะนำเกษตร</h6>
                    <p class="small mb-0">${planet.recommendation}</p>
                </div>
            </div>

            <div class="card bg-dark border-gold">
                <div class="card-body">
                    <h6 class="text-gold mb-3">🙏 วิธีการขอฝนตามพิรุณศาสตร์</h6>
                    <ul class="list-unstyled small">
                        ${PIRUN_METHODS.map(m => `
                        <li class="py-2 border-bottom border-gold-30">
                            <strong>${m.name}:</strong> ${m.description}
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div class="alert alert-warning small mt-3">
                <strong>⚠️ หมายเหตุ:</strong><br>
                พิรุณศาสตร์เป็นศาสตร์การโหรา ไม่ใช่วิทยาศาสตร์อากาศ<br>
                ใช้ประกอบการวางแผนเกษตรแบบดั้งเดิมเท่านั้น
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showClimate();
});

window.calculatePirun = calculatePirun;
