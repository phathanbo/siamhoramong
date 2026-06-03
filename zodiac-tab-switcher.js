/**
 * 🐀 Zodiac Tab Switcher
 *
 * ทำงาน: switch แท็บปีนักษัตร (zodiacdetailsection)
 */

"use strict";

// 📋 ข้อมูลปีนักษัตร (12 ปี)
const ZODIAC_ANIMALS = {
    'rat': {
        name: 'ปีชวด',
        number: 1,
        emoji: '🐭',
        description: 'ราศีหนูเป็นสัตว์ที่ฉลาด ว่องไว ประหยัด และรักความเป็นเอกลักษณ์'
    },
    'ox': {
        name: 'ปีฉลู',
        number: 2,
        emoji: '🐂',
        description: 'ราศีวัวเป็นสัตว์ที่ขยันขันแข็ง ซื่อสัตย์ และแข็งแกร่ง'
    },
    'tiger': {
        name: 'ปีขาล',
        number: 3,
        emoji: '🐯',
        description: 'ราศีเสือเป็นสัตว์ที่กล้าหาญ ผู้นำ และมีความมั่นใจ'
    },
    'rabbit': {
        name: 'ปีเถาะ',
        number: 4,
        emoji: '🐰',
        description: 'ราศีกระต่ายเป็นสัตว์ที่ยุ่มยำ เอื้อเฟื้อ และรักสันติภาพ'
    },
    'dragon': {
        name: 'ปีมะโรง',
        number: 5,
        emoji: '🐉',
        description: 'ราศีมังกรเป็นสัตว์ที่มหัศจรรย์ มีพลัง และเต็มไปด้วยความสุข'
    },
    'snake': {
        name: 'ปีมะเส็ง',
        number: 6,
        emoji: '🐍',
        description: 'ราศีงูเป็นสัตว์ที่ฉลาด ลึกลับ และมีสัญชาตญาณ'
    },
    'horse': {
        name: 'ปีมะเมีย',
        number: 7,
        emoji: '🐴',
        description: 'ราศีม้าเป็นสัตว์ที่อิสระ ร่าเริง และมีพลังงาน'
    },
    'goat': {
        name: 'ปีมะแม',
        number: 8,
        emoji: '🐐',
        description: 'ราศีแกะเป็นสัตว์ที่อ่อนโยน สร้างสรรค์ และห่วงใจผู้อื่น'
    },
    'monkey': {
        name: 'ปีวอก',
        number: 9,
        emoji: '🐵',
        description: 'ราศีลิงเป็นสัตว์ที่ฉลาด ขี้ขลาด และชอบสนุก'
    },
    'rooster': {
        name: 'ปีระกา',
        number: 10,
        emoji: '🐓',
        description: 'ราศีไก่เป็นสัตว์ที่ตรงไปตรงมา ทะเยอทะยาน และจริงจังในการทำงาน'
    },
    'dog': {
        name: 'ปีจอ',
        number: 11,
        emoji: '🐕',
        description: 'ราศีสุนัขเป็นสัตว์ที่จริงใจ ซื่อสัตย์ และจงรักภักดี'
    },
    'pig': {
        name: 'ปีอุกกาก',
        number: 12,
        emoji: '🐷',
        description: 'ราศีหมูเป็นสัตว์ที่เป็นมิตร มีความสุข และให้อภัย'
    }
};

/**
 * 🐀 สลับแท็บปีนักษัตร
 *
 * @param {string} animal - ชื่อสัตว์ (rat, ox, tiger, etc.)
 */
function switchZodiac(animal) {
    if (!ZODIAC_ANIMALS[animal]) {
        console.warn(`❌ ปีนักษัตร '${animal}' ไม่พบ`);
        return;
    }

    const data = ZODIAC_ANIMALS[animal];

    // 🔄 สลับปุ่ม active
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 📝 อัปเดต content
    const contentDiv = document.getElementById('zodiac-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="zodiac-detail">
                <h3 class="text-gold mb-3">
                    <span style="font-size: 2rem;">${data.emoji}</span>
                    ${data.name}
                </h3>
                <p class="mb-3">${data.description}</p>

                <div class="alert alert-info small mt-3">
                    <strong>📌 ลำดับปีนักษัตร:</strong> ที่ ${data.number} ใน 12 ปี
                </div>

                <!-- สามารถเพิ่ม details เพิ่มเติมได้ที่นี่ -->
            </div>
        `;
    }
}

/**
 * 🎯 Initialize zodiac tabs
 */
function initZodiacTabs() {
    // ตั้ง default ให้แสดง 'rat'
    const firstButton = document.querySelector('.tab-btn');
    if (firstButton) {
        // Simulate click on first button
        firstButton.click();
    }
}

/**
 * 📅 คำนวณพยากรณ์ตามเดือนและวันเกิด
 */
function calculateDynamicFortune() {
    const monthSelect = document.getElementById('dynamicMonth');
    const daySelect = document.getElementById('dynamicDay');
    const resultArea = document.getElementById('dynamicResultArea');

    if (!monthSelect || !daySelect || !resultArea) {
        console.warn('❌ ไม่พบ elements สำหรับ zodiac fortune calculation');
        return;
    }

    const month = parseInt(monthSelect.value);
    const dayNum = parseInt(daySelect.value);

    if (!month || dayNum === undefined) {
        resultArea.style.display = 'none';
        return;
    }

    // 📋 ชื่อวันเกิด
    const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayName = dayNames[dayNum];

    // 📋 ชื่อเดือน (ไทย)
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const monthName = monthNames[month - 1];

    // 🎯 พยากรณ์ตัวอย่าง (ควร reference จากข้อมูล ZODIAC DATA)
    const predictions = {
        '0_1': '📿 วันอาทิตย์ เดือนมกราคม: ผู้เกิดวันนี้มีภาวะผู้นำที่แท้จริง มีพลังแสดงออก',
        '1_1': '📿 วันจันทร์ เดือนมกราคม: อารมณ์จะอ่อนไหว ควรดูแลจิตใจ',
        '2_1': '📿 วันอังคาร เดือนมกราคม: มีพลังในการสื่อสารและการแสดงความคิดเห็น',
        '3_1': '📿 วันพุธ เดือนมกราคม: เหมาะสำหรับการเรียนรู้และการศึกษาใหม่ ๆ',
        '4_1': '📿 วันพฤหัสบดี เดือนมกราคม: พยากรณ์ดีเสริม โชคลาภในด้านการเงิน',
        '5_1': '📿 วันศุกร์ เดือนมกราคม: มีเสน่ห์และความเป็นที่รัก สัมพันธ์ดี',
        '6_1': '📿 วันเสาร์ เดือนมกราคม: ควรสนใจการพัฒนาตนเองและการออม'
    };

    const key = `${dayNum}_${month}`;
    const prediction = predictions[key] || `📿 วัน${dayName} เดือน${monthName}: คุณมีพลังพิเศษในวันนี้`;

    // 📝 แสดงผลลัพธ์
    resultArea.innerHTML = `
        <div class="prediction-card">
            <h4 class="text-gold">🌟 พยากรณ์สำหรับวัน${dayName} เดือน${monthName}</h4>
            <p class="prediction-text">${prediction}</p>
            <div class="alert alert-info small mt-3">
                <strong>💡 คำแนะนำ:</strong> พยากรณ์นี้อิงจากลักษณะของวันเกิดและเดือนเกิด
                ควรใช้เป็นการสะท้อนตัวเอง มากกว่าการยึดติดอย่างแน่นอน
            </div>
        </div>
    `;

    resultArea.style.display = 'block';
}

// เรียก init เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', initZodiacTabs);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { switchZodiac, calculateDynamicFortune, ZODIAC_ANIMALS };
}
