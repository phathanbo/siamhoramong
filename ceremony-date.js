/**
 * 🎊 กำหนดวันประกอบพิธี (Ceremony Date Selection) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ปฏิทินฤกษ์มงคล: AuspiciousDay.js (AUSPICIOUS_DAYS_DETAIL)
 * - ลัคนา (ดาว + บ้าน): thai-astrology.js
 *
 * วิธีการ:
 * 1. เลือกเดือน → ดึงวันมงคลจากปฏิทินฤกษ์
 * 2. เลือกประเภทพิธี → แสดงเวลามงคล
 * 3. อิงบ้าน 5 (บุตร) สำหรับงานบวช
 * 4. อิงบ้าน 7 (คู่สัญญา) สำหรับแต่งงาน/หมั้น
 */

"use strict";

// ข้อมูลพิธี 6 ประเภทตามหลักโหราศาสตร์ไทย
const CEREMONY_DATA = {
    wedding: {
        name: '💍 พิธีแต่งงาน',
        description: 'วันแต่งงานสำคัญที่สุดในชีวิต - อิงบ้าน 7 (คู่สัญญา) + ปฏิทินฤกษ์',
        houseFocus: 'บ้าน 7 (สัปตม = คู่สัญญา)',
        time: '09:00 - 12:00 น. (เช้า) หรือ 14:00 - 17:00 น. (บ่าย)',
        tips: [
            '✅ เลือกวันฤกษ์มงคลจากปฏิทินเดือน',
            '✅ ตรวจสอบดวงคู่ (ลัคนาสัตบรรณ)',
            '✅ เชิญพระ สรุป บวช อวยพร',
            '✅ ทำบุญวันแต่งงาน',
            '✅ บ้านสาวหรือบ้านหนุ่ม โดยพบใจ'
        ]
    },
    engagement: {
        name: '💎 พิธีหมั้น',
        description: 'วันประกาศความรักต่อหน้าคนรู้จัก - อิงปฏิทินฤกษ์',
        houseFocus: 'บ้าน 7 (คู่สัญญา)',
        time: '14:00 - 17:00 น. (บ่ายมงคล)',
        tips: [
            '✅ เลือกวันฤกษ์ที่ดี',
            '✅ ครอบครัวทั้งสองฝ่ายร่วมสนุก',
            '✅ สลักแหวน บูชาบรรพบุรุษ',
            '✅ ทำบุญครบทั้งสองฝ่าย',
            '✅ ตรวจสอบสิ่งของมงคล'
        ]
    },
    party: {
        name: '🎉 พิธีเลี้ยง',
        description: 'งานฉลองอันสุขสันต์ - อิงปฏิทินฤกษ์มงคล',
        houseFocus: 'บ้าน 11 (ลาภะ = เลี้ยง)',
        time: '11:00 - 15:00 น. (บ่ายถึงเย็น)',
        tips: [
            '✅ เลือกวันฤกษ์ที่ดี',
            '✅ จัดเลี้ยงอาหารอร่อย ชาติพรรค',
            '✅ เชิญพระ บูชา อวยพร',
            '✅ แจกของพร ทำให้ผู้เข้าร่วมดีใจ',
            '✅ ทำบุญดวล ปันสุข'
        ]
    },
    ordination: {
        name: '🙏 พิธีบวช',
        description: 'วันเข้าวัด บวชพระ - อิงบ้าน 5 (บุตร) + ปฏิทินฤกษ์',
        houseFocus: 'บ้าน 5 (บุตร = ผู้บวช) + บ้าน 9 (ศาสนา)',
        time: '06:00 - 09:00 น. (เช้า)',
        tips: [
            '✅ เลือกวันฤกษ์ที่ดี ปราศจากอุปสรรค',
            '✅ ไหว้พระ บูชา ฟังธรรม',
            '✅ ครอบครัวและญาติพี่น้องมารับ',
            '✅ ทำบุญเต็มศรัทธา',
            '✅ มีแสง (ปลั่ง) สิ่งศุภมงคล'
        ]
    },
    housewarming: {
        name: '🏠 พิธีไหว้บ้าน',
        description: 'วันเข้าบ้านใหม่ - อิงบ้าน 4 (สุขะ = บ้าน) + ปฏิทินฤกษ์',
        houseFocus: 'บ้าน 4 (สุขะ = บ้าน/ที่อยู่)',
        time: '09:00 - 12:00 น. (เช้า)',
        tips: [
            '✅ เลือกวันฤกษ์มงคล',
            '✅ เชิญพระ สรุป บวช อวยพร',
            '✅ โปรยน้ำศักดิ์สิทธิ์',
            '✅ มีเทียนไทรธูป บูชาพระ',
            '✅ ทำให้บ้านปราศจากวิญญาณเก่า'
        ]
    },
    opening: {
        name: '🏪 พิธีเปิดร้าน',
        description: 'วันเปิดธุรกิจใหม่ - อิงบ้าน 10 (กรรม = การจ้างงาน) + ปฏิทินฤกษ์',
        houseFocus: 'บ้าน 10 (กรรม = ธุรกิจ) + บ้าน 11 (ลาภะ = รายได้)',
        time: '06:00 - 09:00 น. (เช้า)',
        tips: [
            '✅ เลือกวันฤกษ์ที่ดี',
            '✅ ตัดริบบิ้น เปิดพิธี',
            '✅ โปรยน้ำศักดิ์สิทธิ์ทั้งร้าน',
            '✅ เชิญพระ บูชา อวยพร',
            '✅ ทำบุญวันแรก'
        ]
    }
};

/**
 * 📅 หาวันฤกษ์มงคลจากปฏิทิน
 */
/**
 * 🎊 แสดงหน้าเลือกวันพิธี
 */
function showCeremonyPage() {
    const container = document.getElementById('ceremonyPage');
    if (!container) return;

    const currentYear = new Date().getFullYear();
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🎊 กำหนดวันประกอบพิธี</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากปฏิทินฤกษ์มงคล + ลัคนา</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>🎯 ประเภทพิธี <span class="text-danger">*</span></strong></label>
                                <select id="ceremonyType" class="form-control form-control-lg">
                                    <option value="">-- เลือกประเภทพิธี --</option>
                                    <option value="wedding">💍 พิธีแต่งงาน</option>
                                    <option value="engagement">💎 พิธีหมั้น</option>
                                    <option value="party">🎉 พิธีเลี้ยง</option>
                                    <option value="ordination">🙏 พิธีบวช</option>
                                    <option value="housewarming">🏠 พิธีไหว้บ้าน</option>
                                    <option value="opening">🏪 พิธีเปิดร้าน</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 เดือน/ปี <span class="text-danger">*</span></strong></label>
                                <input type="month" id="ceremonyMonth" class="form-control form-control-lg"
                                       value="${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}">
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="findCeremonyDate()">
                        <i class="fas fa-calendar-check"></i> หาวันมงคล
                    </button>
                </form>

                <div id="ceremonyResult" class="mt-4"></div>

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
 * 🔍 หาวันมงคลสำหรับพิธี
 */
function findCeremonyDate() {
    const typeEl = document.getElementById('ceremonyType');
    const monthEl = document.getElementById('ceremonyMonth');
    const resultEl = document.getElementById('ceremonyResult');

    if (!typeEl.value || !monthEl.value) {
        alert('⚠️ กรุณาเลือกประเภทพิธีและเดือน');
        return;
    }

    const ceremonyType = typeEl.value;
    const [year, month] = monthEl.value.split('-');
    const monthNum = parseInt(month);

    const ceremony = CEREMONY_DATA[ceremonyType];
    const goodDays = getAuspiciousDays(monthNum);

    if (!ceremony || goodDays.length === 0) {
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
            <h4 class="text-gold text-center mb-3">${ceremony.name}</h4>

            <div class="alert alert-info small">
                <strong>📊 ข้อมูล:</strong><br>
                ✓ ${ceremony.description}<br>
                ✓ <strong>อิง:</strong> ${ceremony.houseFocus}
            </div>

            <h5 class="text-gold mt-3">📅 วันมงคลในเดือน ${monthNum} พ.ศ. ${parseInt(year) + 543}</h5>
            <div class="mb-3">${daysHTML}</div>

            <h5 class="text-gold mt-3">⏰ เวลามงคล</h5>
            <div class="alert alert-warning small mb-3">
                ${ceremony.time}
            </div>

            <h5 class="text-gold mt-3">💡 คำแนะนำ</h5>
            <ul class="list-unstyled small">
                ${ceremony.tips.map(tip => `<li style="padding: 5px 0;">${tip}</li>`).join('')}
            </ul>

            <div class="alert alert-light small mt-3">
                <strong>📝 หมายเหตุ:</strong> วันมงคลอิงจากปฏิทินฤกษ์มงคลไทยแท้ อาจต้องตรวจสอบกับนักดูดวงมืออาชีพสำหรับความแม่นยำสูงสุด
            </div>
        </div>
    `;

    // แสดงผลลัพธ์
    resultEl.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    showCeremonyPage();
    console.log("✅ ceremony-date.js loaded - อิงปฏิทินฤกษ์มงคล + ลัคนา");
});

window.findCeremonyDate = findCeremonyDate;
