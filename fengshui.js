/**
 * 🏠 ฮวงจุ้ยตามหลักแท้ (Feng Shui) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ธาตุ 5 ประการ (Wu Xing): ไม้ไฟดินโลหะน้ำ
 * - ดาว 9 ดวง (Astrology): thai-astrology.js
 * - ทิศมงคล: อิงจากปี + ธาตุ + ดาว
 *
 * หลักการ:
 * 1. ปีเกิด → ธาตุ 5 ประการ (ปี % 5)
 * 2. วันเกิด → ดาว 9 ดวง (วัน % 9)
 * 3. ธาตุ + ดาว → ทิศมงคล + สีมงคล + ธาตุลงทุน
 */

"use strict";

// ธาตุ 5 ประการ (Wu Xing)
const ELEMENT_FENGSHUI = {
    0: { name: "ไม้", color: "เขียว", number: 3, symbol: "♻️", luckyDirection: "ตะวันออก" },
    1: { name: "ไฟ", color: "แดง", number: 9, symbol: "🔥", luckyDirection: "ใต้" },
    2: { name: "ดิน", color: "เหลือง", number: 5, symbol: "🏔️", luckyDirection: "ตรงกลาง" },
    3: { name: "โลหะ", color: "ขาว", number: 7, symbol: "⚔️", luckyDirection: "ตะวันตก" },
    4: { name: "น้ำ", color: "ดำ/น้ำเงิน", number: 1, symbol: "💧", luckyDirection: "เหนือ" }
};

// ดาว 9 ดวง และทิศมงคลที่เกี่ยวข้อง
const PLANET_DIRECTION = {
    1: { name: "อาทิตย์", direction: "ใต้", element: "ไฟ" },
    2: { name: "จันทร์", direction: "เหนือ", element: "น้ำ" },
    3: { name: "พฤหัสบดี", direction: "ตะวันออกเฉียงเหนือ", element: "ไม้" },
    4: { name: "พุธ", direction: "ตะวันตกเฉียงเหนือ", element: "โลหะ" },
    5: { name: "พุธ (ร่วม)", direction: "ตรงกลาง", element: "ดิน" },
    6: { name: "ศุกร์", direction: "ตะวันตก", element: "โลหะ" },
    7: { name: "เสาร์", direction: "ตะวันออกเฉียงใต้", element: "ดิน" },
    8: { name: "เสาร์", direction: "ตะวันตกเฉียงใต้", element: "ดิน" },
    9: { name: "อังคาร", direction: "ตะวันออก", element: "ไม้" }
};

// ความเข้ากันระหว่างธาตุ
const ELEMENT_COMPATIBILITY = {
    "ไม้": { support: "น้ำ", suppress: "โลหะ", avoid: "โลหะ" },
    "ไฟ": { support: "ไม้", suppress: "น้ำ", avoid: "น้ำ" },
    "ดิน": { support: "ไฟ", suppress: "ไม้", avoid: "ไม้" },
    "โลหะ": { support: "ดิน", suppress: "ไฟ", avoid: "ไฟ" },
    "น้ำ": { support: "โลหะ", suppress: "ดิน", avoid: "ดิน" }
};

/**
 * 🎯 แสดงหน้า Feng Shui
 */
function showFengShuiPage() {
    const container = document.getElementById('fengShuiPage');
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🏠 ฮวงจุ้ยตามหลักแท้</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากธาตุ 5 + ดาว 9 ดวง</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                                <input type="date" id="fengshuiBirthday" class="form-control form-control-lg">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>🏠 ทิศบ้านปัจจุบัน <span class="text-danger">*</span></strong></label>
                                <select id="fengshuiSittingDir" class="form-control form-control-lg">
                                    <option value="">-- เลือกทิศหลังบ้าน --</option>
                                    <option value="N">⬆️ เหนือ</option>
                                    <option value="NE">⬈️ ตะวันออกเฉียงเหนือ</option>
                                    <option value="E">➡️ ตะวันออก</option>
                                    <option value="SE">⬉️ ตะวันออกเฉียงใต้</option>
                                    <option value="S">⬇️ ใต้</option>
                                    <option value="SW">⬋️ ตะวันตกเฉียงใต้</option>
                                    <option value="W">⬅️ ตะวันตก</option>
                                    <option value="NW">⬉️ ตะวันตกเฉียงเหนือ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeFengShui()">
                        <i class="fas fa-compass"></i> วิเคราะห์ฮวงจุ้ย
                    </button>
                </form>

                <div id="fengshuiResult" class="mt-4"></div>

                <hr class="my-4">
                <div class="row">
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
}

/**
 * 🔍 วิเคราะห์ฮวงจุ้ย
 */
function analyzeFengShui() {
    const birthdayEl = document.getElementById('fengshuiBirthday');
    const sittingDirEl = document.getElementById('fengshuiSittingDir');
    const resultEl = document.getElementById('fengshuiResult');

    if (!birthdayEl.value || !sittingDirEl.value) {
        alert('⚠️ กรุณาป้อนวันเกิดและเลือกทิศหลังบ้าน');
        return;
    }

    const birthDate = new Date(birthdayEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();
    const sittingDir = sittingDirEl.value;

    // 1️⃣ คำนวณธาตุ 5 (จากปี)
    const buddhayear = birthYear - 543;
    const elementIndex = buddhayear % 5;
    const element = ELEMENT_FENGSHUI[elementIndex];

    // 2️⃣ คำนวณดาว 9 (จากวันเกิด)
    const planetNum = (birthDay % 9) || 9;
    const planet = PLANET_DIRECTION[planetNum];

    // 3️⃣ ทิศมงคลจากธาตุ
    const luckyDir = element.luckyDirection;

    // 4️⃣ ความเข้ากันของธาตุ
    const compat = ELEMENT_COMPATIBILITY[element.name];

    // 5️⃣ สีมงคล
    const luckColor = element.color;
    const supportElement = compat.support;

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = thaiDays[birthDate.getDay()];

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <h4 class="text-gold text-center mb-4">🏠 วิเคราะห์ฮวงจุ้ย</h4>

            <div class="alert alert-info small mb-4">
                <strong>👤 ข้อมูลสำคัญ:</strong><br>
                ✓ วันเกิด: ${birthDay}/${birthMonth}/${birthYear} (${dayName})<br>
                ✓ ดาวเกิด: ${planet.name} (เลขที่ ${planetNum})<br>
                ✓ ธาตุประจำปี: <strong>${element.name}</strong> (${element.symbol})
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark">
                            <strong>🧭 ทิศมงคลตามธาตุ</strong>
                        </div>
                        <div class="card-body text-center">
                            <h3 class="text-gold mb-2">${luckyDir}</h3>
                            <p class="small text-muted mb-2">ท่าทางที่เหมาะสำหรับ ${element.name}</p>
                            <div style="font-size: 2rem;">${element.symbol}</div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark">
                            <strong>🎨 สีมงคล</strong>
                        </div>
                        <div class="card-body text-center">
                            <p class="mb-2"><strong>สีหลัก:</strong></p>
                            <div style="padding: 15px; background: ${getColorCode(element.color)}; border-radius: 8px; color: #fff; font-weight: bold;">
                                ${element.color}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="text-gold mt-4">⚖️ ความสมดุลของธาตุ</h5>
            <div class="alert alert-secondary small mb-4">
                <strong>${element.name}</strong> ได้รับการสนับสนุนจาก <strong>${compat.support}</strong><br>
                ปกครองด้วย <strong>${compat.suppress}</strong><br>
                <strong style="color: #dc3545;">หลีกเลี่ยง:</strong> ธาตุ<strong>${compat.avoid}</strong>
            </div>

            <h5 class="text-gold">💡 คำแนะนำฮวงจุ้ย</h5>
            <ul class="list-unstyled small">
                <li style="padding: 5px 0;">✅ ทิศนั่ง (Sitting): หันหน้าไป <strong>${luckyDir}</strong></li>
                <li style="padding: 5px 0;">✅ สีห้อง: ใช้สีหลัก <strong>${element.color}</strong> มากขึ้น</li>
                <li style="padding: 5px 0;">✅ วัตถุมงคล: เลือกสิ่งของธาตุ <strong>${element.name}</strong> + <strong>${supportElement}</strong></li>
                <li style="padding: 5px 0;">✅ หลีกเลี่ยง: วัตถุธาตุ <strong>${compat.avoid}</strong></li>
                <li style="padding: 5px 0;">✅ ดาวเกิด: ${planet.name} → ทิศ ${planet.direction} เสริมโชค</li>
            </ul>

            <div class="alert alert-light small mt-4">
                <strong>📝 หมายเหตุ:</strong> การวิเคราะห์นี้อิงจากธาตุ 5 ประการ (Wu Xing) และดาว 9 ดวง ควรประสานกับผู้เชี่ยวชาญฮวงจุ้ยสำหรับความแม่นยำสูงสุด
            </div>
        </div>
    `;
}

/**
 * 🎨 แปลงชื่อสี → รหัสสี
 */
function getColorCode(colorName) {
    const colorMap = {
        "เขียว": "#28a745",
        "แดง": "#dc3545",
        "เหลือง": "#ffc107",
        "ขาว": "#f0f0f0",
        "ดำ/น้ำเงิน": "#001a4d"
    };
    return colorMap[colorName] || "#d4af37";
}

document.addEventListener("DOMContentLoaded", () => {
    showFengShuiPage();
    console.log("✅ fengshui.js loaded - อิงธาตุ 5 + ดาว 9 ดวง (authentic Feng Shui)");
});

window.analyzeFengShui = analyzeFengShui;
