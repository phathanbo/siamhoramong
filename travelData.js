/**
 * 🚗 วันมงคลเดินทาง (Auspicious Travel Day) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ปฏิทินฤกษ์มงคล: AuspiciousDay.js (AUSPICIOUS_DAYS_DETAIL)
 * - ลัคนา (ดาว 9 ดวง + ทิศ): thai-astrology.js
 *
 * วิธีการ:
 * 1. ป้อนวันเกิด → คำนวณ ดาว 9 ดวง
 * 2. เลือกเดือนเดินทาง → ดึงวันมงคล
 * 3. ดาว 9 ดวง + วันเดินทาง → ทิศมงคล + เวลา
 */

"use strict";

// ดาว 9 ดวงและทิศมงคลเดินทาง
const PLANET_TRAVEL_INFO = {
    1: {
        name: 'อาทิตย์ (Sun)',
        dayName: 'วันอาทิตย์',
        direction: '🌅 ตะวันออก',
        advice: 'เดินทางควรเลือกเช้า ทิศตะวันออก จะมีชัยชนะ'
    },
    2: {
        name: 'จันทร์ (Moon)',
        dayName: 'วันจันทร์',
        direction: '🌙 เหนือ',
        advice: 'เดินทางควรนอนหลับพักผ่อนพอแล้ว ทิศเหนือ จะดี'
    },
    3: {
        name: 'พฤหัสบดี (Jupiter)',
        dayName: 'วันพฤหัสบดี',
        direction: '🟡 ใต้',
        advice: 'เดินทางควรแต่งตัวเจิม ทิศใต้ จะมีโชค'
    },
    4: {
        name: 'พุธ (Mercury)',
        dayName: 'วันพุธ',
        direction: '💚 ตะวันตกเฉียงเหนือ',
        advice: 'เดินทางควรรับประทานอาหารบริบูรณ์ก่อน ทิศตะวันตกเฉียงเหนือ จะดี'
    },
    5: {
        name: 'ศุกร์ (Venus)',
        dayName: 'วันศุกร์',
        direction: '💛 ตะวันตก',
        advice: 'เดินทางควรพักระหว่างทาง ทิศตะวันตก จะมีลาภ'
    },
    6: {
        name: 'ศุกร์ (Venus)',
        dayName: 'วันศุกร์',
        direction: '💛 ตะวันตก',
        advice: 'เดินทางควรพักระหว่างทาง ทิศตะวันตก จะมีลาภ'
    },
    7: {
        name: 'เสาร์ (Saturn)',
        dayName: 'วันเสาร์',
        direction: '⚫ ตะวันออกเฉียงใต้',
        advice: 'เดินทางควรระงับสติอารมณ์ ทิศตะวันออกเฉียงใต้ จะมีหนุนคณ'
    },
    8: {
        name: 'เสาร์ (Saturn)',
        dayName: 'วันเสาร์',
        direction: '⚫ ตะวันออกเฉียงใต้',
        advice: 'เดินทางควรระงับสติอารมณ์ ทิศตะวันออกเฉียงใต้ จะมีหนุนคณ'
    },
    9: {
        name: 'อังคาร (Mars)',
        dayName: 'วันอังคาร',
        direction: '🔴 ตะวันออกเฉียงเหนือ',
        advice: 'เดินทางควรรับประทานหวานก่อน ทิศตะวันออกเฉียงเหนือ จะรุ่งเรือง'
    }
};

// เวลามงคลเดินทาง
const TRAVEL_AUSPICIOUS_TIMES = {
    morning: '06:00 - 09:00 น. (เช้า - ดีที่สุด)',
    forenoon: '09:00 - 12:00 น. (สายเช้า - ดี)',
    afternoon: '14:00 - 16:00 น. (บ่าย - พอใจ)',
    evening: '17:00 - 19:00 น. (เย็น - ดี)'
};

/**
 * 📅 หาวันฤกษ์มงคลเดินทาง
 */
/**
 * 🚗 แสดงหน้าเลือกวันเดินทาง
 */
function showTravelPage() {
    const container = document.getElementById('travelPage');
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🚗 วันมงคลเดินทาง</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากปฏิทินฤกษ์มงคล + ลัคนา (ดาว 9 ดวง)</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                                <input type="date" id="travelBirthday" class="form-control form-control-lg">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 เดือนเดินทาง <span class="text-danger">*</span></strong></label>
                                <input type="month" id="travelMonth" class="form-control form-control-lg"
                                       value="${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}">
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="findTravelDate()">
                        <i class="fas fa-calendar-check"></i> หาวันมงคลเดินทาง
                    </button>
                </form>

                <div id="travelResult" class="mt-4"></div>

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
 * 🔍 คำนวณวันมงคลเดินทาง
 */
function findTravelDate() {
    const birthdayEl = document.getElementById('travelBirthday');
    const monthEl = document.getElementById('travelMonth');
    const resultEl = document.getElementById('travelResult');

    if (!birthdayEl.value || !monthEl.value) {
        alert('⚠️ กรุณาป้อนวันเกิดและเลือกเดือนเดินทาง');
        return;
    }

    // คำนวณดาวเกิด
    const birthDate = new Date(birthdayEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = birthDate.getFullYear();

    // ดาว = (วันเกิด % 9) || 9
    const planetNum = (birthDay % 9) || 9;
    const planet = PLANET_TRAVEL_INFO[planetNum];

    const [year, month] = monthEl.value.split('-');
    const monthNum = parseInt(month);
    const goodDays = getAuspiciousDays(monthNum);

    if (!planet || goodDays.length === 0) {
        alert('❌ ไม่พบข้อมูลวันมงคล');
        return;
    }

    const daysHTML = goodDays.map(day => `
        <span style="display: inline-block; margin: 5px; padding: 10px 15px; background: rgba(40, 167, 69, 0.2); border: 1px solid #28a745; border-radius: 5px; color: #28a745; font-weight: bold;">
            วันที่ ${day}
        </span>
    `).join('');

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <h4 class="text-gold text-center mb-3">🚗 วันมงคลเดินทาง</h4>

            <div class="alert alert-info small mb-3">
                <strong>👤 ข้อมูลผู้เดินทาง:</strong><br>
                ✓ วันเกิด: ${birthDay}/${birthMonth}/${birthYear}<br>
                ✓ ดาวเกิด: <strong>${planet.name}</strong> (เลขที่ ${planetNum})<br>
                ✓ ทิศมงคล: <strong>${planet.direction}</strong>
            </div>

            <h5 class="text-gold mt-3">📅 วันมงคลเดินทางในเดือน ${monthNum} พ.ศ. ${parseInt(year) + 543}</h5>
            <div class="mb-3">${daysHTML}</div>

            <h5 class="text-gold mt-3">⏰ เวลามงคลเดินทาง</h5>
            <div class="alert alert-warning small mb-3">
                <strong>${TRAVEL_AUSPICIOUS_TIMES.morning}</strong><br>
                ${TRAVEL_AUSPICIOUS_TIMES.forenoon}<br>
                ${TRAVEL_AUSPICIOUS_TIMES.afternoon}<br>
                ${TRAVEL_AUSPICIOUS_TIMES.evening}
            </div>

            <h5 class="text-gold mt-3">💡 คำแนะนำ</h5>
            <div class="alert alert-secondary small mb-3">
                <strong>${planet.advice}</strong>
            </div>

            <h5 class="text-gold mt-3">📋 เคล็ดวิธีเดินทางปลอดภัย</h5>
            <ul class="list-unstyled small">
                <li style="padding: 5px 0;">✅ เลือกวันมงคล หันหน้าสู่ทิศที่บอก</li>
                <li style="padding: 5px 0;">✅ ตรวจสอบพาหนะ ให้ปลอดภัย</li>
                <li style="padding: 5px 0;">✅ ทำบุญก่อนเดินทาง</li>
                <li style="padding: 5px 0;">✅ โปรยน้ำศักดิ์สิทธิ์บนพาหนะ</li>
                <li style="padding: 5px 0;">✅ เดินทางระงับสติ อารมณ์สุขสันต์</li>
                <li style="padding: 5px 0;">✅ ถ้าเดินทางไกล ควรพักกลางวัน</li>
            </ul>

            <div class="alert alert-light small mt-3">
                <strong>📝 หมายเหตุ:</strong> วันมงคลอิงจากปฏิทินฤกษ์มงคลไทยแท้ และทิศมงคลอิงจากลัคนา (ดาว 9 ดวง)
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showTravelPage();
});

window.findTravelDate = findTravelDate;
