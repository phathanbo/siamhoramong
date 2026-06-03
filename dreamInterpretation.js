/**
 * 🌙 ทำนายฝัน - ตำราพรหมชาติ
 *
 * อ้างอิง:
 * - ตำราพรหมชาติ (Brahmasat) - ตำราโหราศาสตร์ไทยโบราณ
 * - หลักการ: ฝันในเวลาต่างๆ ของคืน และสิ่งต่างๆ ที่ปรากฏในฝัน
 * - วิธีตีฝัน: ตีความตามวัน เดือน ปี และเวลาที่เห็นฝัน
 *
 * หมายเหตุ: ทำนายฝันเป็นศาสตร์การตีความเพื่อคาดการณ์เหตุการณ์
 * ตามตำราโหราศาสตร์ไทยโบราณ ไม่ใช่วิทยาศาสตร์สมัยใหม่
 */

"use strict";

// ข้อมูลการตีฝันตามเวลาของคืน (ตำราพรหมชาติ)
const DREAM_TIMING = {
    first_watch: {
        name: "ยามแรก (18:00 - 21:00)",
        meaning: "ฝันเห็นในยามแรกมักเป็นเรื่องที่เห็นเมื่อวานนี้",
        reliability: "ต่ำ"
    },
    second_watch: {
        name: "ยามที่สอง (21:00 - 00:00)",
        meaning: "ฝันในยามนี้มีความหมายปานกลาง",
        reliability: "ปานกลาง"
    },
    third_watch: {
        name: "ยามที่สาม (00:00 - 03:00)",
        meaning: "ฝันในเวลานี้มีแนวโน้มจริงสูง เป็นการแจ้งเตือน",
        reliability: "สูง"
    },
    fourth_watch: {
        name: "ยามที่สี่ (03:00 - 06:00)",
        meaning: "ฝันตอนเช้ามีความแม่นยำสูงสุด",
        reliability: "สูงที่สุด"
    }
};

// ความหมายฝันตามสิ่งต่างๆ (อิงตำราพรหมชาติ)
const DREAM_MEANINGS = {
    animal: {
        "ค้างคาว": "ลาภไม่เที่ยง ระวังเรื่องโกง",
        "ชิงโห้": "ได้พบผู้อุปถัมภ์ ช่วยเหลือจากผู้ใหญ่",
        "จระเข้": "ระวังศัตรู คนคิดไม่ซื่อสัตย์",
        "ดิ้นหนอน": "ความรสินรู้และสติปัญญา",
        "เต่า": "ความมั่นคง อายุยืนยาว",
        "นก": "ข่าวดีจากที่ไกล ข่าวบุคคลใหม่",
        "ปลา": "ความหนำในการค้าขาย",
        "ม้า": "การเดินทาง โยกย้ายที่อยู่",
        "วัว": "ความขยันขันแข็ง ลาภจากแรงงาน",
        "ลิง": "ข้อหา หรือปัญหาพยศ",
        "หนู": "ระวังเรื่องสูญเสีย คนลักขโมย",
        "หมา": "เพื่อนหรือคนใกล้ชิด"
    },
    element: {
        "ไฟไหม้": "โชคลาภหรือข่าวร้ายอย่างรุนแรง",
        "ทะเล": "เดินทาง บรรเทา ความเจ้อนหวั่นไหว",
        "น้ำท่วม": "ความเสียหายหรือการผิดพลาด",
        "ฝน": "โชคลาภ ความสบายใจ",
        "ฟ้าผ่า": "ข่าวร้ายกระทันหัน",
        "ดินทะลุ": "การเปลี่ยนแปลงครั้งใหญ่"
    },
    event: {
        "ถูกไล่ล่า": "ความเป็นห่วง ความเครียด",
        "ถูกฆ่า": "อายุยืนยาว (ตรงข้าม) หรือผ่านพ้นอันตราย",
        "ตกจากที่สูง": "ลดระดับ เสียหาย เสียชื่อเสียง",
        "ตกน้ำ": "ความผิดพลาด ต้องระมัดระวัง",
        "ตันโพลน": "สงสัย กังวล ความสับสน",
        "แต่งงาน": "สิ่งดี โชคลาภ ความสุข",
        "บิน": "ความสำเร็จ ความมั่นใจสูง",
        "ยิงปืน": "ข่าวกะทันหัน",
        "ว่ายน้ำ": "ผ่านพ้นปัญหา",
        "วิ่ง": "ความด่วน ข่าวรอ"
    },
    people: {
        "ครอบครัว": "เรื่องของครอบครัว ระวังสุขภาพ",
        "ศัตรู": "ความขัดแย้ง ต้องระวังคำพูด",
        "เจ้ากรรมการ": "ความเป็นธรรม การตัดสินใจ",
        "คนตาย": "ข่าวจากผู้ล่วงลับ หรืออายุยืนยาว",
        "พระ": "โชคลาภสูงสุด บุญที่ทำการ",
        "ผู้ใหญ่": "การได้รับคำแนะนำ สนับสนุน"
    },
    object: {
        "เงิน": "รายได้ลาภไหลมา",
        "ทอง": "โชคลาภสูง สำเร็จด้านการเงิน",
        "เครื่องประดับ": "เกียรติยศ ความหรู",
        "หนังสือ": "ข้อมูล สติปัญญา",
        "อาวุธ": "ความขัดแย้ง ต้องระวัง",
        "อาหาร": "ความอยากได้สิ่งใหม่"
    }
};

function showDreamPage() {
    const container = document.getElementById('dreamPage');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">🌙 ทำนายฝัน - ตำราพรหมชาติ</h2>
            <p class="text-white-50 mb-0 small">อิงจากตำราโหราศาสตร์ไทยโบราณ</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📝 บรรยายฝันที่เห็น:</strong></label>
                <textarea id="dreamDesc" class="form-control bg-dark text-white border-gold"
                          rows="4" placeholder="เขียนรายละเอียดฝันของคุณ..."></textarea>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="text-gold"><strong>⏰ เวลาที่เห็นฝัน:</strong></label>
                        <select id="dreamTime" class="form-control bg-dark text-gold border-gold">
                            <option value="first_watch">ยามแรก (18:00-21:00)</option>
                            <option value="second_watch">ยามที่สอง (21:00-00:00)</option>
                            <option value="third_watch" selected>ยามที่สาม (00:00-03:00)</option>
                            <option value="fourth_watch">ยามที่สี่ (03:00-06:00)</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="text-gold"><strong>📅 วันที่เห็นฝัน:</strong></label>
                        <input type="date" id="dreamDate" class="form-control bg-dark text-gold border-gold">
                    </div>
                </div>
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="interpretDream()">
                <i class="fas fa-search mr-2"></i>ตีความฝัน
            </button>

            <div id="dreamResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ตำราพรหมชาติ (Brahmasat) - ตำราโหราศาสตร์ไทยโบราณ<br>
                ✓ หลักการตีความฝัน: เวลา วัน และปรากฏการณ์ในฝัน<br>
                ✓ เป็นศาสตร์การตีความเพื่อคาดการณ์ ไม่ใช่วิทยาศาสตร์
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
 * 🔮 ตีความฝัน
 */
function interpretDream() {
    const descEl = document.getElementById('dreamDesc');
    const timeEl = document.getElementById('dreamTime');
    const dateEl = document.getElementById('dreamDate');
    const resultEl = document.getElementById('dreamResult');

    if (!descEl.value.trim()) {
        alert('⚠️ กรุณาบรรยายฝันของคุณ');
        return;
    }

    const dreamText = descEl.value.toLowerCase();
    const dreamTime = timeEl.value;
    const timing = DREAM_TIMING[dreamTime];

    // หาความหมายจากคำสำคัญ
    let meanings = [];
    let foundKeys = [];

    // ค้นหาสัตว์
    for (let [key, meaning] of Object.entries(DREAM_MEANINGS.animal)) {
        if (dreamText.includes(key)) {
            meanings.push(`🐾 ${key}: ${meaning}`);
            foundKeys.push(key);
        }
    }

    // ค้นหาธรรมชาติ
    for (let [key, meaning] of Object.entries(DREAM_MEANINGS.element)) {
        if (dreamText.includes(key)) {
            meanings.push(`🌊 ${key}: ${meaning}`);
            foundKeys.push(key);
        }
    }

    // ค้นหาเหตุการณ์
    for (let [key, meaning] of Object.entries(DREAM_MEANINGS.event)) {
        if (dreamText.includes(key)) {
            meanings.push(`⚡ ${key}: ${meaning}`);
            foundKeys.push(key);
        }
    }

    // ค้นหาบุคคล
    for (let [key, meaning] of Object.entries(DREAM_MEANINGS.people)) {
        if (dreamText.includes(key)) {
            meanings.push(`👤 ${key}: ${meaning}`);
            foundKeys.push(key);
        }
    }

    // ค้นหาวัตถุ
    for (let [key, meaning] of Object.entries(DREAM_MEANINGS.object)) {
        if (dreamText.includes(key)) {
            meanings.push(`💎 ${key}: ${meaning}`);
            foundKeys.push(key);
        }
    }

    // สร้าง Result
    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">✨ การตีความฝัน</h4>

            <div class="alert alert-info small mb-3">
                <strong>⏰ ${timing.name}</strong><br>
                ความนัยสำคัญ: ${timing.meaning}<br>
                ความเชื่อถือได้: ${timing.reliability}
            </div>

            ${meanings.length > 0 ? `
            <div class="mb-3">
                <h6 class="text-gold">สิ่งที่ปรากฏในฝัน:</h6>
                <ul class="list-unstyled small">
                    ${meanings.map(m => `<li class="py-2 border-bottom border-gold-30">${m}</li>`).join('')}
                </ul>
            </div>
            ` : `
            <div class="alert alert-secondary small">
                ไม่พบคำสำคัญในฐานข้อมูล ลองพิมพ์ฝันอีกครั้ง หรือให้คำอธิบายละเอียดกว่า
            </div>
            `}

            <div class="alert alert-warning small mt-3">
                <strong>💡 คำแนะนำ:</strong><br>
                การตีความฝันเป็นศาสตร์ความศรัทธา และการตีความตามหลักโหรา<br>
                ไม่ควรเชื่อถือเพียงฝันเพียงอย่างเดียว<br>
                ควรดูประกอบกับลัคนาและดวงชะตาทั้งหมด
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    showDreamPage();
});

window.interpretDream = interpretDream;
