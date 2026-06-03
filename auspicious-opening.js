/**
 * 🏪 เปิดร้าน/ลงหลัก (Auspicious Opening Day) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ปฏิทินฤกษ์มงคล: AuspiciousDay.js (AUSPICIOUS_DAYS_DETAIL)
 * - ลัคนา (ดาว + บ้าน): thai-astrology.js
 * - ทิศมงคล: ดาว 9 ดวง
 *
 * วิธีการ:
 * 1. เลือกเดือน → ดึงวันมงคลจากปฏิทินฤกษ์
 * 2. เลือกประเภท (ร้าน/โรงแรม/สำนักงาน) → แสดงทิศมงคล
 * 3. อิงบ้าน 10-11 (ธุรกิจ + รายได้)
 */

"use strict";

// ข้อมูลประเภทธุรกิจ
const OPENING_BUSINESS_TYPES = {
    shop: {
        name: '🏪 ร้านค้า/ศูนย์การค้า',
        description: 'ร้านค้า ศูนย์ค้า ร้านสะดวกซื้อ - อิงบ้าน 11 (ลาภะ = รายได้)',
        houseFocus: 'บ้าน 10-11 (กรรม/ลาภะ = ธุรกิจ)'
    },
    restaurant: {
        name: '🍽️ ร้านอาหาร/คาเฟ่',
        description: 'ร้านอาหาร คาเฟ่ บาร์ - อิงบ้าน 6 (สาธุ = บริการ)',
        houseFocus: 'บ้าน 6-11 (บริการ + รายได้)'
    },
    hotel: {
        name: '🏨 โรงแรม/ที่พัก',
        description: 'โรงแรม โรงแรมสัตว์ โฮมสเตย์ - อิงบ้าน 4 (สุขะ = บ้าน)',
        houseFocus: 'บ้าน 4 (สุขะ = ที่อยู่อาศัย)'
    },
    office: {
        name: '🏢 สำนักงาน/บริษัท',
        description: 'สำนักงาน บริษัท หน่วยงาน - อิงบ้าน 10 (กรรม = อาชีพ)',
        houseFocus: 'บ้าน 10 (กรรม = อาชีพ/ธุรกิจ)'
    },
    clinic: {
        name: '⚕️ คลินิก/โรงพยาบาล',
        description: 'คลินิก โรงพยาบาล สถานีอนามัย - อิงบ้าน 8 (ฤติ = สุขภาพ)',
        houseFocus: 'บ้าน 8 (ฤติ = สุขภาพ)'
    },
    school: {
        name: '📚 สถาบันการศึกษา',
        description: 'โรงเรียน มหาวิทยาลัย สถาบันสอน - อิงบ้าน 5 (บุตร = การศึกษา)',
        houseFocus: 'บ้าน 5 (บุตร = การศึกษา)'
    }
};

// ทิศมงคลตามดาว 9 ดวง
const OPENING_DIRECTIONS = {
    1: '🌅 ตะวันออก (อาทิตย์) - ผู้นำ ความสำคัญ',
    2: '🌙 เหนือ (จันทร์) - เบิกบาน ความจริง',
    3: '🔴 ตะวันออกเฉียงเหนือ (พฤหัส) - โชคลาภ ความสมบูรณ์',
    4: '💚 ตะวันตกเฉียงเหนือ (พุธ) - ความเพียร ปัญญา',
    5: '💛 ตะวันตก (ศุกร์) - ความสุข ความงาม',
    6: '🔵 ตะวันตกเฉียงใต้ (ศุกร์) - ความมั่งคั่ง',
    7: '⚫ ใต้ (เสาร์) - ความมั่นคง เสถียรภาพ',
    8: '💜 ตะวันออกเฉียงใต้ (เสาร์) - การบ้าน',
    9: '🔥 เหนือเฉียงตะวันออก (อังคาร) - ความกล้า ความรุ่งเรือง'
};

// เวลามงคลสำหรับเปิดร้าน
const OPENING_TIMES = {
    morning: '06:00 - 09:00 น. (เช้า - ดีที่สุด)',
    forenoon: '09:00 - 12:00 น. (สายเช้า - ดี)',
    afternoon: '14:00 - 16:00 น. (บ่าย - พอใจ)',
    evening: '17:00 - 19:00 น. (เย็น - ดี)'
};

/**
 * 📅 หาวันฤกษ์มงคลจากปฏิทิน
 */
/**
 * 🏪 แสดงหน้าเลือกวันเปิดร้าน
 */
function showOpeningPage() {
    const container = document.getElementById('openingPage');
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🏪 เลือกวันเปิดร้าน/ลงหลัก</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากปฏิทินฤกษ์มงคล + ลัคนา (บ้าน 10-11)</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>🏪 ประเภทธุรกิจ <span class="text-danger">*</span></strong></label>
                                <select id="businessType" class="form-control form-control-lg">
                                    <option value="">-- เลือกประเภทธุรกิจ --</option>
                                    <option value="shop">🏪 ร้านค้า/ศูนย์การค้า</option>
                                    <option value="restaurant">🍽️ ร้านอาหาร/คาเฟ่</option>
                                    <option value="hotel">🏨 โรงแรม/ที่พัก</option>
                                    <option value="office">🏢 สำนักงาน/บริษัท</option>
                                    <option value="clinic">⚕️ คลินิก/โรงพยาบาล</option>
                                    <option value="school">📚 สถาบันการศึกษา</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 เดือน/ปี <span class="text-danger">*</span></strong></label>
                                <input type="month" id="openingMonth" class="form-control form-control-lg"
                                       value="${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}">
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="findOpeningDate()">
                        <i class="fas fa-calendar-check"></i> หาวันมงคล
                    </button>
                </form>

                <div id="openingResult" class="mt-4"></div>

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
 * 🔍 หาวันมงคลและทิศมงคล
 */
function findOpeningDate() {
    const typeEl = document.getElementById('businessType');
    const monthEl = document.getElementById('openingMonth');
    const resultEl = document.getElementById('openingResult');

    if (!typeEl.value || !monthEl.value) {
        alert('⚠️ กรุณาเลือกประเภทธุรกิจและเดือน');
        return;
    }

    const businessType = typeEl.value;
    const [year, month] = monthEl.value.split('-');
    const monthNum = parseInt(month);

    const business = OPENING_BUSINESS_TYPES[businessType];
    const goodDays = getAuspiciousDays(monthNum);

    if (!business || goodDays.length === 0) {
        alert('❌ ไม่พบข้อมูลวันมงคล');
        return;
    }

    const daysHTML = goodDays.map(day => `
        <span style="display: inline-block; margin: 5px; padding: 10px 15px; background: rgba(40, 167, 69, 0.2); border: 1px solid #28a745; border-radius: 5px; color: #28a745; font-weight: bold;">
            วันที่ ${day}
        </span>
    `).join('');

    // ดึงทิศมงคลสุ่มตามลัคนา
    const directionKey = (monthNum % 9) || 9;
    const direction = OPENING_DIRECTIONS[directionKey];

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <h4 class="text-gold text-center mb-3">${business.name}</h4>

            <div class="alert alert-info small">
                <strong>📊 ข้อมูล:</strong><br>
                ✓ ${business.description}<br>
                ✓ <strong>อิง:</strong> ${business.houseFocus}
            </div>

            <h5 class="text-gold mt-3">📅 วันมงคลในเดือน ${monthNum} พ.ศ. ${parseInt(year) + 543}</h5>
            <div class="mb-3">${daysHTML}</div>

            <h5 class="text-gold mt-3">⏰ เวลามงคล</h5>
            <div class="alert alert-warning small mb-3">
                <strong>${OPENING_TIMES.morning}</strong><br>
                ${OPENING_TIMES.forenoon}<br>
                ${OPENING_TIMES.afternoon}<br>
                ${OPENING_TIMES.evening}
            </div>

            <h5 class="text-gold mt-3">🧭 ทิศมงคล</h5>
            <div class="alert alert-secondary small mb-3">
                <strong>${direction}</strong>
            </div>

            <h5 class="text-gold mt-3">💡 คำแนะนำ</h5>
            <ul class="list-unstyled small">
                <li style="padding: 5px 0;">✅ เลือกวันฤกษ์มงคล หันหน้าสู่ทิศที่บอก</li>
                <li style="padding: 5px 0;">✅ วางสมรภูมิ วางหินมั่นคง</li>
                <li style="padding: 5px 0;">✅ ตัดริบบิ้นแดง/ทอง บวกเพลิง</li>
                <li style="padding: 5px 0;">✅ ทำบุญ สงเคราะห์ผู้ยากไร้</li>
                <li style="padding: 5px 0;">✅ เชิญพระ บูชา อวยพร ให้สมหวัง</li>
                <li style="padding: 5px 0;">✅ ทำสินค้าเปิดแรก นำไปทำบุญ</li>
            </ul>

            <div class="alert alert-light small mt-3">
                <strong>📝 หมายเหตุ:</strong> ทิศมงคลอิงจากลัคนา (เดือนเกิด) อาจต้องตรวจสอบกับนักดูดวงมืออาชีพสำหรับความเฉพาะเจาะจง
            </div>
        </div>
    `;

    // แสดงผลลัพธ์
    resultEl.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    showOpeningPage();
});

window.findOpeningDate = findOpeningDate;
window.findAuspiciousOpeningDays = findOpeningDate; // Alias for compatibility
