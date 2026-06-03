/**
 * 👤 พยากรณ์ส่วนบุคคล (Personal Fortune via Lagna) - แก้ให้แท้จริง
 *
 * อ้างอิง:
 * - ลัคนา (ดาว 9 ดวง + บ้าน 12 บ้าน): thai-astrology.js
 * - บ้านของโหราศาสตร์:
 *   - บ้าน 1 (ตนะ): บุคลิกภาพ
 *   - บ้าน 5 (บุตร): ความรัก การศึกษา
 *   - บ้าน 7 (สัปตม): คู่สัญญา สัมพันธ์
 *   - บ้าน 8 (ฤติ): สุขภาพ ลึกลับ
 *   - บ้าน 10 (กรรม): อาชีพ ผู้ใหญ่
 *   - บ้าน 11 (ลาภะ): รายได้ ความสุข
 *   - บ้าน 12 (ยยะ): การสูญเสีย การจากไป
 */

"use strict";

// ดาว 9 ดวงและลักษณะ
const PLANET_PERSONALITY = {
    1: {
        name: 'อาทิตย์',
        character: 'มีนำ มีจิตสำนึก หมั่นเพียร',
        strength: 'ผู้นำ บริหารจัดการ',
        challenge: 'มีอิสระสูง อาจจำแนก'
    },
    2: {
        name: 'จันทร์',
        character: 'อ่อนโยน หวังแหวน มีสัญชาติ',
        strength: 'บุคลิกจริงใจ ศิลปะ',
        challenge: 'อารมณ์ไม่เสถียร ใจอ่อนง่าย'
    },
    3: {
        name: 'พฤหัสบดี',
        character: 'เจริญและสำเร็จ โชคดีตามธรรมชาติ',
        strength: 'การศึกษา ศาสนา ความคิดเห็น',
        challenge: 'อาจมีอคติ หรือเนืองขึ้น'
    },
    4: {
        name: 'พุธ',
        character: 'ปัญญา การคิด การสื่อสาร',
        strength: 'ทักษะปฏิบัติ ธุรกิจ บ่วงจิต',
        challenge: 'ความกระสับกระส่ายทางใจ'
    },
    5: {
        name: 'ศุกร์',
        character: 'ความสุข ความงาม การศิลป์',
        strength: 'ความมีเสน่ห์ ศิลปะ ความโปรดปราน',
        challenge: 'อาจหลงตัวเอง หรือสะเพร่า'
    },
    6: {
        name: 'ศุกร์ (วัฒนากร)',
        character: 'ความสุข ความงาม การศิลป์',
        strength: 'ความมีเสน่ห์ ศิลปะ ความโปรดปราน',
        challenge: 'อาจหลงตัวเอง หรือสะเพร่า'
    },
    7: {
        name: 'เสาร์',
        character: 'ความจริง ความเด็ดเดี่ยว ความอดทน',
        strength: 'ความมั่นคง มีหลักการ',
        challenge: 'ก้อกด้าน อาจหม่อมความต้องการเกินไป'
    },
    8: {
        name: 'เสาร์ (ทีมนิยม)',
        character: 'ความจริง ความเด็ดเดี่ยว ความอดทน',
        strength: 'ความมั่นคง มีหลักการ',
        challenge: 'ก้อกด้าน อาจหม่อมความต้องการเกินไป'
    },
    9: {
        name: 'อังคาร',
        character: 'ความกล้าหาญ พลัง ความรุ่งเรือง',
        strength: 'สู้ชีวิต มีกำลังใจ ผู้บัญชาการ',
        challenge: 'อารมณ์ร้อน อาจรุนแรงเกินไป'
    }
};

// ธาตุ 5 ประการและผลกระทบต่ออุปนิสัย
const ELEMENT_INFLUENCE = {
    0: { name: 'ไม้', color: 'เขียว', influence: 'เจริญงอก เติบโต ปราณีอ่อนไหว' },
    1: { name: 'ไฟ', color: 'แดง', influence: 'ร้อนรุ่ง เปี่ยมป้อมอำนาจ ใจเด็ด' },
    2: { name: 'ดิน', color: 'เหลือง', influence: 'มั่นคง สุบิน ผู้ฟังคำสั่ง' },
    3: { name: 'โลหะ', color: 'ขาว', influence: 'เข้มแข็ง กระตุกตัว ทะเบียน' },
    4: { name: 'น้ำ', color: 'ดำ', influence: 'ไหลเบา ซึ่งเขินเศร้า สลิดลับ' }
};

// บ้าน 12 บ้านและความหมาย
const HOUSE_MEANING = {
    1: { name: 'บ้าน 1 (ตนะ)', meaning: 'บุคลิกภาพ รูปร่าง ลักษณะบุคลิก' },
    2: { name: 'บ้าน 2 (ธนะ)', meaning: 'การเงิน ทรัพย์สิน ครอบครัว' },
    3: { name: 'บ้าน 3 (สহจะ)', meaning: 'พี่น้อง ปัญชา การเยี่ยม' },
    4: { name: 'บ้าน 4 (สุขะ)', meaning: 'บ้าน ที่อยู่ อสังหาริมทรัพย์' },
    5: { name: 'บ้าน 5 (บุตร)', meaning: 'บุตร การศึกษา ความรัก ศิลปะ' },
    6: { name: 'บ้าน 6 (สาธุ)', meaning: 'โรค ศัตรู ปัญหา บริการ' },
    7: { name: 'บ้าน 7 (สัปตม)', meaning: 'คู่สัญญา แต่งงาน สัมพันธ์' },
    8: { name: 'บ้าน 8 (ฤติ)', meaning: 'สุขภาพ ความยาว ความลึกลับ' },
    9: { name: 'บ้าน 9 (ทนะ)', meaning: 'ศาสนา ปัญญา โภคนายก' },
    10: { name: 'บ้าน 10 (กรรม)', meaning: 'อาชีพ ผู้ใหญ่ สังคม' },
    11: { name: 'บ้าน 11 (ลาภะ)', meaning: 'รายได้ ความสุข มิตรภาพ' },
    12: { name: 'บ้าน 12 (ยยะ)', meaning: 'สูญเสีย จากไป ความลับ' }
};

/**
 * 👤 แสดงหน้าพยากรณ์ส่วนบุคคล
 */
function showPersonalFortunePage() {
    const container = document.getElementById('personalFortunePage');
    if (!container) return;

    const currentYear = new Date().getFullYear();

    container.innerHTML = `
        <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">👤 พยากรณ์ส่วนบุคคล</h2>
                <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา (ดาว 9 ดวง + บ้าน 12 บ้าน)</p>
            </div>

            <div class="card-body p-4">
                <form onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 วันเกิด <span class="text-danger">*</span></strong></label>
                                <input type="date" id="fortuneBirthday" class="form-control form-control-lg">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="text-gold"><strong>📅 ปีเกิด <span class="text-danger">*</span></strong></label>
                                <input type="number" id="fortuneBirthYear" class="form-control form-control-lg"
                                       placeholder="พ.ศ." min="2450" max="${new Date().getFullYear() + 543}">
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzePersonalFortune()">
                        <i class="fas fa-star"></i> วิเคราะห์บุคลิก
                    </button>
                </form>

                <div id="fortuneResult" class="mt-4"></div>

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
 * 🔍 วิเคราะห์บุคลิกตามลัคนา
 */
function analyzePersonalFortune() {
    const birthdayEl = document.getElementById('fortuneBirthday');
    const birthYearEl = document.getElementById('fortuneBirthYear');
    const resultEl = document.getElementById('fortuneResult');

    if (!birthdayEl.value || !birthYearEl.value) {
        alert('⚠️ กรุณาป้อนวันเกิดและปีเกิด');
        return;
    }

    const birthDate = new Date(birthdayEl.value);
    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1;
    const birthYear = parseInt(birthYearEl.value);

    // คำนวณดาว 9 ดวง
    const planetNum = (birthDay % 9) || 9;
    const planet = PLANET_PERSONALITY[planetNum];

    // คำนวณธาตุ 5 ประการ
    const buddhayear = birthYear - 543; // แปลงเป็น พ.ศ. → ค.ศ.
    const elementNum = buddhayear % 5;
    const element = ELEMENT_INFLUENCE[elementNum];

    if (!planet || !element) {
        alert('❌ ไม่พบข้อมูลลัคนา');
        return;
    }

    // คำนวณบ้านทั่วไป (อิงจากดาว)
    const houseNum = ((planetNum - 1) % 12) + 1;
    const house = HOUSE_MEANING[houseNum] || HOUSE_MEANING[1];

    resultEl.innerHTML = `
        <div class="card shadow-sm border-0 p-4" style="background: rgba(212, 175, 55, 0.05);">
            <h4 class="text-gold text-center mb-4">👤 วิเคราะห์บุคลิก</h4>

            <div class="alert alert-info small mb-4">
                <strong>📊 ข้อมูลสำคัญ:</strong><br>
                ✓ วันเกิด: ${birthDay}/${birthMonth}/${birthYear}<br>
                ✓ ดาวเกิด: <strong>${planet.name}</strong> (เลขที่ ${planetNum})<br>
                ✓ ธาตุประจำปี: <strong>${element.name}</strong>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark small">
                            <strong>⭐ ดาวเกิด: ${planet.name}</strong>
                        </div>
                        <div class="card-body small">
                            <p class="mb-1"><strong>บุคลิก:</strong> ${planet.character}</p>
                            <p class="mb-1"><strong>จุดแข็ง:</strong> ${planet.strength}</p>
                            <p class="mb-0"><strong>จุดท้าทาย:</strong> ${planet.challenge}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card bg-dark border-gold mb-3">
                        <div class="card-header bg-gold text-dark small">
                            <strong>🌿 ธาตุประจำปี: ${element.name}</strong>
                        </div>
                        <div class="card-body small">
                            <p class="mb-1"><strong>สีแสดง:</strong> ${element.color}</p>
                            <p class="mb-0"><strong>อิทธิพล:</strong> ${element.influence}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="text-gold mt-4">🏠 บ้านหลัก</h5>
            <div class="alert alert-secondary small mb-4">
                <strong>${house.name}:</strong> ${house.meaning}
            </div>

            <h5 class="text-gold">💡 คำแนะนำส่วนบุคคล</h5>
            <ul class="list-unstyled small">
                <li style="padding: 5px 0;">✅ เข้าใจตัวเอง ยอมรับ จุดแข็ง-จุดอ่อน</li>
                <li style="padding: 5px 0;">✅ พัฒนาจุดแข็งให้เป็นทักษะหลัก</li>
                <li style="padding: 5px 0;">✅ รับมือกับจุดท้าทายด้วยสติและปัญญา</li>
                <li style="padding: 5px 0;">✅ ใช้ธาตุและสีมงคล ในการแต่งตัวประจำวัน</li>
                <li style="padding: 5px 0;">✅ เสริมสร้างสุขภาพกาย จิตใจ ด้วยนิยม</li>
                <li style="padding: 5px 0;">✅ ทำบุญเชื่อมสัตว์ ยิ่งชีวิต ให้มีความสุข</li>
            </ul>

            <div class="alert alert-light small mt-4">
                <strong>📝 หมายเหตุ:</strong> การวิเคราะห์นี้อิงจากลัคนา (ดาว 9 ดวง + บ้าน 12 บ้าน) โดยแสดงลักษณะทั่วไป อาจต้องตรวจสอบกับนักดูดวงมืออาชีพสำหรับการวิเคราะห์เชิงลึก
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showPersonalFortunePage();
});

window.analyzePersonalFortune = analyzePersonalFortune;
