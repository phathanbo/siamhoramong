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
 * 🎨 หาสีตามสถานะวัน
 */
function getColorByStatus(status) {
    if (!status) return '#28a745'; // เขียวสว่าง (ค่าเริ่มต้นถ้าไม่มี status)
    if (status.includes('ธงชัย')) return '#28a745'; // เขียวสว่าง
    if (status.includes('อธิบดี')) return '#007bff'; // น้ำเงิน
    if (status.includes('มหาสิทธิโชค')) return '#17a2b8'; // ฟ้า
    if (status.includes('ราชาโชค')) return '#ffc107'; // เหลือง
    if (status.includes('ชัยโชค')) return '#20c997'; // เขียวลึก
    if (status.includes('อุบาทว์')) return '#fd7e14'; // ส้ม
    if (status.includes('โลกาวินาศ')) return '#dc3545'; // แดง
    return '#6c757d'; // เทาธรรมดา (ปกติ)
}

/**
 * 🔍 หาวันมงคลและทิศมงคล
 */
function findOpeningDate() {
    const typeEl = document.getElementById('businessType');
    const monthEl = document.getElementById('openingMonth');
    const resultEl = document.getElementById('openingResult');

    if (!typeEl || !monthEl || !resultEl) {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่พบ element', 'error');
        console.error('typeEl:', typeEl, 'monthEl:', monthEl, 'resultEl:', resultEl);
        return;
    }

    if (!typeEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกประเภทธุรกิจ', 'warning');
        return;
    }

    if (!monthEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณาเลือกเดือนและปี', 'warning');
        return;
    }

    const businessType = typeEl.value;
    const monthValue = monthEl.value; // format: "YYYY-MM"
    const [year, month] = monthValue.split('-');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    console.log('🔍 Debug:', { monthValue, year, month, monthNum, yearNum });

    // ตรวจสอบ business type
    const business = OPENING_BUSINESS_TYPES[businessType];
    if (!business) {
        Swal.fire('เกิดข้อผิดพลาด', 'ประเภทธุรกิจไม่ถูกต้อง', 'error');
        return;
    }

    // ดึงวันมงคล (ส่ง 2 parameters: month, year)
    const goodDays = getAuspiciousDays(monthNum, yearNum);
    console.log('📅 Good days:', goodDays);

    if (!goodDays || goodDays.length === 0) {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่พบข้อมูลวันมงคล - โปรดลองเดือนอื่น', 'error');
        console.error('Error: goodDays empty or undefined');
        return;
    }

    const daysHTML = goodDays.map(dayItem => {
        const dayNum = typeof dayItem === 'object' ? dayItem.day : dayItem;
        const statusStr = typeof dayItem === 'object' && dayItem.status ? dayItem.status : 'ฤกษ์มงคล';
        
        return `
            <div class="px-3 py-2 rounded-3 text-center fw-bold shadow-sm" style="background: rgba(34, 197, 94, 0.18); border: 1.5px solid #22c55e; color: #4ade80; font-size: 0.95rem; min-width: 120px;">
                <i class="fas fa-calendar-check me-1"></i> วันที่ ${dayNum} <small class="d-block text-white" style="font-size: 0.78rem; font-weight: normal; opacity: 0.9;">${statusStr}</small>
            </div>
        `;
    }).join('');

    // ดึงทิศมงคลสุ่มตามลัคนา
    const directionKey = (monthNum % 9) || 9;
    const direction = OPENING_DIRECTIONS[directionKey];

    resultEl.innerHTML = `
        <div class="card border-0 rounded-4 p-3 p-md-4 mb-4" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important;">
            
            <div class="text-center mb-4 pb-2" style="border-bottom: 1px solid rgba(212,175,55,0.25);">
                <h3 class="fw-bold mb-2" style="font-family: 'Chonburi', serif; color: #ffd700; font-size: 1.4rem;">
                    ${business.name}
                </h3>
                <div class="d-inline-block px-3 py-2 rounded-pill mt-1" style="background: rgba(212,175,55,0.2); color: #ffd700; border: 1px solid rgba(212,175,55,0.45); font-size: 0.92rem; font-weight: 500;">
                    <i class="fas fa-info-circle me-1"></i> ${business.description} · อิง ${business.houseFocus}
                </div>
            </div>

            <!-- วันมงคล -->
            <div class="mb-4 p-3 rounded-3" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
                <h5 class="fw-bold small mb-3" style="color: #ffd700;">
                    <i class="fas fa-calendar-check me-2"></i> วันมงคลเปิดร้านในเดือน ${monthNum} (พ.ศ. ${parseInt(year) + 543}):
                </h5>
                <div class="d-flex flex-wrap gap-2">${daysHTML}</div>
            </div>

            <div class="row g-3 mb-4">
                <!-- เวลามงคล -->
                <div class="col-md-6 col-12">
                    <div class="p-3 rounded-3 h-100" style="background: rgba(234, 179, 8, 0.12); border: 1.5px solid rgba(234, 179, 8, 0.4);">
                        <h6 class="fw-bold mb-3" style="color: #fde047; font-size: 1.05rem;"><i class="fas fa-clock me-1"></i> ช่วงเวลามงคล (กาลพิเศษ)</h6>
                        <ul class="list-unstyled small mb-0" style="line-height: 2; color: #f8fafc;">
                            <li><span class="badge bg-warning text-dark me-1">เช้า ดีเลิศ</span> <strong>06:00 - 09:00 น.</strong></li>
                            <li><span class="badge bg-light text-dark me-1">สาย ดีมาก</span> <strong>09:00 - 12:00 น.</strong></li>
                            <li><span class="badge bg-light text-dark me-1">บ่าย ราบรื่น</span> <strong>14:00 - 16:00 น.</strong></li>
                            <li><span class="badge bg-light text-dark me-1">เย็น มั่งคั่ง</span> <strong>17:00 - 19:00 น.</strong></li>
                        </ul>
                    </div>
                </div>

                <!-- ทิศมงคล -->
                <div class="col-md-6 col-12">
                    <div class="p-3 rounded-3 h-100" style="background: rgba(59, 130, 246, 0.12); border: 1.5px solid rgba(59, 130, 246, 0.4);">
                        <h6 class="fw-bold mb-3" style="color: #93c5fd; font-size: 1.05rem;"><i class="fas fa-compass me-1"></i> ทิศมงคลประจำกิจการ</h6>
                        <div class="p-3 rounded-2 mb-2 text-center" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(59, 130, 246, 0.5);">
                            <strong class="fs-5 text-white" style="letter-spacing: 0.5px;">${direction}</strong>
                        </div>
                        <small class="text-white-50 d-block">*หันหน้าหน้าร้าน ป้ายร้าน หรือโต๊ะเก็บเงินสู่ทิศมงคลนี้เพื่อดึงดูดพลังงานบวก</small>
                    </div>
                </div>
            </div>

            <!-- ข้อแนะนำ -->
            <div class="p-3 rounded-3 mb-3" style="background: rgba(34, 197, 94, 0.12); border: 1.5px solid rgba(34, 197, 94, 0.4);">
                <h6 class="fw-bold mb-3" style="color: #86efac; font-size: 1.05rem;"><i class="fas fa-lightbulb me-1"></i> ข้อปฏิบัติเพื่อความเป็นสิริมงคล</h6>
                <div class="row g-2 small" style="color: #f1f5f9; line-height: 1.7;">
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> เลือกวันฤกษ์มงคล และหันหน้าหรือตั้งโต๊ะสู่ทิศมงคล</div>
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> วางฮวงจุ้ยหรือหินมงคลให้มั่นคง แน่นหนา</div>
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> ตัดริบบิ้นแดง/ทอง หรือจุดประทัดเบิกฤกษ์</div>
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> ทำบุญตักบาตร หรือแบ่งปันสงเคราะห์เพื่อเปิดทางโชค</div>
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> นิมนต์พระสงฆ์เจริญพระพุทธมนต์ ประพรมน้ำพระพุทธมนต์</div>
                    <div class="col-md-6 col-12"><i class="fas fa-check-circle text-success me-1"></i> สินค้าชิ้นแรกของวัน นำเงินเข้าเก๊ะหรือนำไปทำบุญ</div>
                </div>
            </div>

            <div class="text-center text-white-50 small mt-2">
                <i class="fas fa-scroll me-1"></i> ข้อมูลการคำนวณอิงตามเกณฑ์โหราศาสตร์ไทยโบราณและตำแหน่งเรือนชะตาธุรกิจ
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
