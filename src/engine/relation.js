/**
 * 💑 ความสัมพันธ์ - ลัคนา บ้าน 7
 *
 * อ้างอิง:
 * - ลัคนา (Lagna) - ตำแหน่งที่ราศีปรากฏตอนเกิด
 * - บ้าน 7 (Patni/ปัตนิ) = "สิ่งตรงข้าม" = คู่สัญญา แต่งงาน ความสัมพันธ์
 * - Surya Siddhanta (สุริยยาตร์) - คัมภีร์โหราศาสตร์พื้นฐาน
 * - หลักการ: ดาวเกิด + บ้าน 7 = คู่ชีวิตที่เหมาะสม
 */

"use strict";

// บ้าน 7 ลัคนา - ลักษณะคู่ชีวิต (Navagraha - 9 ดาว)
const PATNI_BY_PLANET = {
    1: {
        planet: "อาทิตย์",
        symbol: "☀️",
        element: "ไฟ",
        varna: "เกษตร",
        character: "ผู้นำ มีบารมี อิสระสูง กีรติศรี",
        partner: "ต้องการคู่ที่เกื้อหนุน รองรับได้ มีความกล้า",
        strength: "ความมั่นใจสูง ความเป็นผู้นำ ความสุจริต",
        weakness: "อาจดื้อรั้น มีอเหนือมาก ต้องการความสนใจอยู่เสมอ",
        suitable: "ผู้ที่มีความเคารพ เข้าใจบทบาทของอาทิตย์ ยืดหยุ่น"
    },
    2: {
        planet: "จันทร์",
        symbol: "🌙",
        element: "ดิน",
        varna: "ว่าน",
        character: "อ่อนโยน เอมโอฮะ ช่างคิด สวยงาม",
        partner: "ต้องการคู่ที่ใจเย็น มีเมตตา สงบสติหนึ่ง",
        strength: "มีจินตนาการ เมตตา ความอ่อนไหว ดูแลคนรักดี",
        weakness: "อารมณ์ไม่เสถียร ลังเลง่าย ต้องการการรับประกัน",
        suitable: "ผู้ที่อ่อนโยน ใจเย็น มีความเห็นใจ และเข้าใจความอ่อนไหว"
    },
    3: {
        planet: "อังคาร",
        symbol: "♂",
        element: "ลม",
        varna: "เกษตร",
        character: "กล้าหาญ พลัง ร้อนรุ่ง สมหวัง พลังใจแรง",
        partner: "ต้องการคู่ที่กล้า มีพลัง ไม่ยอมแพ้ สมหวัง",
        strength: "กล้า มีพลัง อดทน ความรักเข้มข้น นำหน้า",
        weakness: "อารมณ์ร้อน ความรุนแรง ความไม่อดทน ความใจร้อน",
        suitable: "ผู้ที่กล้า มีพลัง ไม่หวั่นไหว สามารถรับความรักที่เข้มข้น"
    },
    4: {
        planet: "พุธ",
        symbol: "☿️",
        element: "น้ำ",
        varna: "วัณิก",
        character: "ปัญญาชาญ ว่องไว ช่างพูด ทะลุ ปรับตัวเก่ง",
        partner: "ต้องการคู่ที่สัญญาณสอบ เป็นเรื่องราว การเจรจา",
        strength: "ไหวพริบ ช่างเจรจา ความประเมินใจดี ลูกครึ่งหลวง",
        weakness: "ความกระสับกระส่าย ใจไม่เสถียร เจรจาเยอะ",
        suitable: "ผู้ที่มีไหวพริบ สามารถสนทนา เรียนรู้ร่วมกันได้ดี"
    },
    5: {
        planet: "พฤหัสบดี",
        symbol: "♃",
        element: "ดิน",
        varna: "พราหมณ์",
        character: "เจริญสำเร็จ โชคดี มีปัญญา มหาสัย คนดี",
        partner: "ต้องการคู่ที่มีศรัทธา มีการศึกษา ใจดี",
        strength: "ได้รับพร บารมี มีระเบียบวินัย ศรัทธาในศาสนา",
        weakness: "อาจคาดหวังสูง บางครั้งอาจดูหลวมๆ",
        suitable: "ผู้ที่มีศรัทธา ยุติธรรม มีการศึกษา ใจดี"
    },
    6: {
        planet: "ศุกร์",
        symbol: "♀",
        element: "น้ำ",
        varna: "วัณิก",
        character: "ความสุข ความงาม รัก ศิลป์ มั่งมี มีเสน่ห์",
        partner: "ต้องการคู่ที่มีเสน่ห์ รักความงาม รักษาความพึงพอใจ",
        strength: "เสน่ห์มาก ความเป็นศิลปิน บารมี การเงินดี",
        weakness: "ความอ่อนไหว ความเอื้อเฟื้อเกินไป ช่างเลือกลวง",
        suitable: "ผู้ที่มีเสน่ห์ รักษาความงาม ร่วมแบ่งปันความสุข"
    },
    7: {
        planet: "เสาร์",
        symbol: "♄",
        element: "ไฟ",
        varna: "ศูดร",
        character: "ความจริง ความเด็ดเดี่ยว อดทน ยาวนาน ทำให้",
        partner: "ต้องการคู่ที่มีหลักการ เสถียร ยืดหยุ่น ทำงานหนัก",
        strength: "มั่นคง ยาวนาน อดทนสูง ซื่อสัตย์ เชื่อถือได้",
        weakness: "หนักแน่น ไม่เบิกบาน ความลาช้า ความเครียด",
        suitable: "ผู้ที่มั่นคง ซื่อสัตย์ พร้อมสร้างมูลนิธิ"
    },
    8: {
        planet: "ราหู",
        symbol: "🌑",
        element: "ลม",
        varna: "ศูดร",
        character: "มหัศจรรย์ลึกลับ ความกระหวังมาก กษัตริย์ของปีศาจ",
        partner: "ต้องการคู่ที่เข้าใจความลึกลับของตน สามารถสนับสนุนได้",
        strength: "ความลึกลับ ความสามารถซ่อนเร้น การเมือง อิทธิพล",
        weakness: "อาจเสอะสมควร ความขัดแย้ง ความสับสน ความหลง",
        suitable: "ผู้ที่เข้าใจชีวิตลึกลับ มีสติปัญญา อดทน"
    },
    9: {
        planet: "เกตุ",
        symbol: "☋",
        element: "ไฟ",
        varna: "ศูดร",
        character: "แยกแหลก อดทน เงียบ มนต์วิทยา ลึกลับ",
        partner: "ต้องการคู่ที่อดทน เข้าใจความเงียบ มีจิตสาธารณะ",
        strength: "อดทนสูง ความสงบ ใจเอื้อเฟื้อ จิตมงคล",
        weakness: "ความเงียบที่มากเกินไป ความบ่นน่อย การแยกแหลก",
        suitable: "ผู้ที่อดทน เข้าใจความโดดเดี่ยว มีจิตสาธารณะ"
    }
};

function showRelationPage() {
    const container = document.getElementById('relationPage');
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4">
            <h2 class="text-gold mb-1">💑 วิเคราะห์ความสัมพันธ์ - ลัคนา บ้าน 7</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนา (Lagna) และบ้าน 7 (Patni)</p>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิดของคุณ:</strong></label>
                <input type="date" id="yourBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <div class="form-group">
                <label class="text-gold"><strong>📅 วันเกิดของคู่:</strong></label>
                <input type="date" id="partnerBirthDate" class="form-control bg-dark text-gold border-gold">
            </div>

            <button class="btn btn-gold btn-lg btn-block mt-3" onclick="analyzeRelation()">
                <i class="fas fa-heart mr-2"></i>วิเคราะห์ความสัมพันธ์
            </button>

            <div id="relationResult" class="mt-4"></div>

            <hr class="my-4">
            <div class="alert alert-info small">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ลัคนา (Lagna) - ตำแหน่งราศีตอนเกิด<br>
                ✓ บ้าน 7 (Patni/ปัตนิ) = คู่สัญญา แต่งงาน<br>
                ✓ Surya Siddhanta (สุริยยาตร์)<br>
                ✓ ดาว 9 ดวง และลักษณะบุคลิกของแต่ละดาว
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

// 🌟 ตารางมิตรภาพของดาว (Graha Maitri)
const GRAHA_MAITRI = {
    1: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'ศัตรู', 4: 'เป็นกลาง', 5: 'เพื่อน', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    2: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'เป็นกลาง', 4: 'เพื่อน', 5: 'ศัตรู', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    3: { 1: 'ศัตรู', 2: 'เป็นกลาง', 3: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เพื่อน', 7: 'เป็นกลาง', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    4: { 1: 'เป็นกลาง', 2: 'เพื่อน', 3: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'ศัตรู', 9: 'เป็นกลาง' },
    5: { 1: 'เพื่อน', 2: 'ศัตรู', 3: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    6: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'เพื่อน', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'ศัตรู', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    7: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'ศัตรู', 7: 'เป็นกลาง', 8: 'เพื่อน', 9: 'เป็นกลาง' },
    8: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'เป็นกลาง', 4: 'ศัตรู', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เพื่อน', 8: 'เป็นกลาง', 9: 'เป็นกลาง' },
    9: { 1: 'เป็นกลาง', 2: 'เป็นกลาง', 3: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'เป็นกลาง', 9: 'เป็นกลาง' }
};

/**
 * 💑 วิเคราะห์ความสัมพันธ์ตามหลัก Gun Milan
 */
function analyzeRelation() {
    const yourDateEl = document.getElementById('yourBirthDate');
    const partnerDateEl = document.getElementById('partnerBirthDate');
    const resultEl = document.getElementById('relationResult');

    if (!yourDateEl.value || !partnerDateEl.value) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกวันเกิดของทั้งคู่', 'warning');
        return;
    }

    const yourDate = new Date(yourDateEl.value);
    const partnerDate = new Date(partnerDateEl.value);

    // ดึงข้อมูลดาวเกิดจากวันในสัปดาห์ (0=อาทิตย์ -> 1, 1=จันทร์ -> 2, ..., 6=เสาร์ -> 7)
    const yourPlanetNum = yourDate.getDay() + 1;
    const partnerPlanetNum = partnerDate.getDay() + 1;

    const yourPlanet = PATNI_BY_PLANET[yourPlanetNum];
    const partnerPlanet = PATNI_BY_PLANET[partnerPlanetNum];

    // คำนวณความเข้ากันตามหลัก Gun Milan
    const scores = calculateGunMilan(yourPlanetNum, partnerPlanetNum);
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = 36;
    const compatibilityPercent = Math.round((totalScore / maxScore) * 100);

    // ข้อมูลมิตรภาพของดาว
    const planetalFriendship = GRAHA_MAITRI[yourPlanetNum][partnerPlanetNum];

    resultEl.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4">
            <h4 class="text-gold mb-3">💑 ผลวิเคราะห์ความสัมพันธ์ (Gun Milan)</h4>

            <!-- ข้อมูลดาวเกิด -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card bg-dark border-gold-30 p-3">
                        <h6 class="text-gold">👤 ข้อมูลของคุณ</h6>
                        <p class="mb-2"><strong>${yourPlanet.symbol} ${yourPlanet.planet}</strong></p>
                        <p class="small mb-1"><strong>ธาตุ:</strong> ${yourPlanet.element}</p>
                        <p class="small mb-2"><strong>วรรณะ:</strong> ${yourPlanet.varna}</p>
                        <p class="small mb-2"><strong>ลักษณะ:</strong> ${yourPlanet.character}</p>
                        <p class="small mb-2"><strong>จุดแข็ง:</strong> ${yourPlanet.strength}</p>
                        <p class="small"><strong>จุดท้าทาย:</strong> ${yourPlanet.weakness}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-dark border-gold-30 p-3">
                        <h6 class="text-gold">👤 ข้อมูลของคู่</h6>
                        <p class="mb-2"><strong>${partnerPlanet.symbol} ${partnerPlanet.planet}</strong></p>
                        <p class="small mb-1"><strong>ธาตุ:</strong> ${partnerPlanet.element}</p>
                        <p class="small mb-2"><strong>วรรณะ:</strong> ${partnerPlanet.varna}</p>
                        <p class="small mb-2"><strong>ลักษณะ:</strong> ${partnerPlanet.character}</p>
                        <p class="small mb-2"><strong>จุดแข็ง:</strong> ${partnerPlanet.strength}</p>
                        <p class="small"><strong>จุดท้าทาย:</strong> ${partnerPlanet.weakness}</p>
                    </div>
                </div>
            </div>

            <!-- สคอร์ Gun Milan -->
            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-3">📊 คะแนน Gun Milan</h6>
                    <div class="table-responsive">
                        <table class="table table-sm text-white">
                            <tr>
                                <td><strong>🎯 Varna (วรรณะ):</strong></td>
                                <td>${scores.varna}/4 ${getScoreBadge(scores.varna, 4)}</td>
                            </tr>
                            <tr>
                                <td><strong>🌊 Bhakoot (ธาตุ):</strong></td>
                                <td>${scores.bhakoot}/7 ${getScoreBadge(scores.bhakoot, 7)}</td>
                            </tr>
                            <tr>
                                <td><strong>💫 Gana (กลุ่มชาติ):</strong></td>
                                <td>${scores.gana}/6 ${getScoreBadge(scores.gana, 6)}</td>
                            </tr>
                            <tr>
                                <td><strong>🤝 Graha Maitri (มิตรภาพดาว):</strong></td>
                                <td>${scores.graha}/5 ${getScoreBadge(scores.graha, 5)}</td>
                            </tr>
                            <tr class="border-top">
                                <td><strong>📍 รวม:</strong></td>
                                <td><strong class="text-gold">${totalScore}/${maxScore}</strong></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ความเข้ากัน -->
            <div class="card bg-dark border-gold mb-3">
                <div class="card-body">
                    <h6 class="text-gold mb-3">💕 ความเข้ากัน</h6>
                    <div class="progress mb-2" style="height: 30px;">
                        <div class="progress-bar ${getProgressColor(compatibilityPercent)}" style="width: ${compatibilityPercent}%; font-weight: bold;">
                            ${compatibilityPercent}%
                        </div>
                    </div>
                    <p class="small mb-2">${getCompatibilityText(compatibilityPercent)}</p>
                    <p class="small text-warning"><strong>🌟 ความสัมพันธ์ดาว:</strong> ${capitalizeFirst(planetalFriendship)}</p>
                </div>
            </div>

            <!-- คำแนะนำ -->
            <div class="alert alert-secondary small">
                <strong>💡 คำแนะนำ:</strong><br>
                ✓ Varna Gun - ความสอดคล้องในชั้นวรรณะและลำดับ<br>
                ✓ Bhakoot Gun - ความเข้ากันของธาตุ (ไฟ น้ำ ลม ดิน)<br>
                ✓ Gana Gun - ความเข้าใจในลักษณะนิสัย<br>
                ✓ Graha Maitri - มิตรภาพตามธรรมชาติของดาว<br><br>
                <strong class="text-gold">📚 หลักการ Gun Milan:</strong> การเข้ากันที่ดี (24+ คะแนน) หมายถึงพื้นฐานความสัมพันธ์ดี<br>
                อย่างไรก็ตาม ความรักและการเข้าใจแต่ละบุคคลสำคัญที่สุด
            </div>
        </div>
    `;
}

/**
 * 🔢 คำนวณคะแนน Gun Milan
 */
function calculateGunMilan(yourNum, partnerNum) {
    const scores = {
        varna: 0,
        bhakoot: 0,
        gana: 0,
        graha: 0
    };

    // 1. Varna Gun (4 คะแนน) - ความสอดคล้องของวรรณะ
    const varnaOrder = { 'เกษตร': 1, 'ว่าน': 2, 'พราหมณ์': 2, 'วัณิก': 3, 'ศูดร': 4 };
    const yourVarna = varnaOrder[PATNI_BY_PLANET[yourNum].varna];
    const partnerVarna = varnaOrder[PATNI_BY_PLANET[partnerNum].varna];
    const varnaDiff = Math.abs(yourVarna - partnerVarna);
    scores.varna = Math.max(4 - varnaDiff, 0);

    // 2. Bhakoot Gun (7 คะแนน) - ความเข้ากันของธาตุ
    const elementCompatibility = {
        'ไฟ': { 'ไฟ': 7, 'ลม': 6, 'ดิน': 0, 'น้ำ': 0 },
        'น้ำ': { 'น้ำ': 7, 'ดิน': 6, 'ไฟ': 0, 'ลม': 0 },
        'ลม': { 'ลม': 7, 'ไฟ': 6, 'น้ำ': 0, 'ดิน': 0 },
        'ดิน': { 'ดิน': 7, 'น้ำ': 6, 'ลม': 0, 'ไฟ': 0 }
    };
    const yourElem = PATNI_BY_PLANET[yourNum].element;
    const partnerElem = PATNI_BY_PLANET[partnerNum].element;
    scores.bhakoot = elementCompatibility[yourElem][partnerElem] || 0;

    // 3. Gana Gun (6 คะแนน) - ความเข้าใจในลักษณะนิสัย
    // กำหนด Gana ตามดาว: Deva (divine), Manushya (human), Rakshasa (demon)
    const ganaMap = {
        1: 'Deva',     // อาทิตย์ (Sun)
        2: 'Manushya', // จันทร์ (Moon)
        3: 'Rakshasa', // อังคาร (Mars)
        4: 'Manushya', // พุธ (Mercury)
        5: 'Deva',     // พฤหัสบดี (Jupiter)
        6: 'Deva',     // ศุกร์ (Venus)
        7: 'Manushya', // เสาร์ (Saturn)
        8: 'Rakshasa', // ราหู (Rahu)
        9: 'Rakshasa'  // เกตุ (Ketu)
    };
    const yourGana = ganaMap[yourNum];
    const partnerGana = ganaMap[partnerNum];
    if (yourGana === partnerGana) {
        scores.gana = 6;
    } else if ((yourGana === 'Deva' && partnerGana === 'Manushya') ||
               (yourGana === 'Manushya' && partnerGana === 'Deva')) {
        scores.gana = 3;
    } else {
        scores.gana = 1;
    }

    // 4. Graha Maitri (5 คะแนน) - มิตรภาพของดาว
    const friendship = GRAHA_MAITRI[yourNum][partnerNum];
    if (friendship === 'เพื่อน') {
        scores.graha = 5;
    } else if (friendship === 'เป็นกลาง') {
        scores.graha = 2;
    } else {
        scores.graha = 1;
    }

    return scores;
}

/**
 * 🎨 ฟังก์ชันช่วยเหลือ - สร้าง Badge สำหรับสคอร์
 */
function getScoreBadge(score, maxScore) {
    const percent = (score / maxScore) * 100;
    if (percent >= 75) return '<span class="badge badge-success">✓ ดี</span>';
    if (percent >= 50) return '<span class="badge badge-warning">⚠ ปานกลาง</span>';
    return '<span class="badge badge-danger">✗ อ่อน</span>';
}

/**
 * 🎨 ดึงสีสำหรับ Progress Bar
 */
function getProgressColor(percent) {
    if (percent >= 80) return 'bg-success';
    if (percent >= 60) return 'bg-warning';
    if (percent >= 40) return 'bg-danger';
    return 'bg-secondary';
}

/**
 * 💭 ข้อความความเข้ากัน
 */
function getCompatibilityText(percent) {
    if (percent >= 32) return '✅ <strong class="text-success">เข้ากันดี</strong> - ความสัมพันธ์มีพื้นฐานดี ต้องการความรักและการสื่อสาร';
    if (percent >= 24) return '⚠️ <strong class="text-warning">เข้ากันได้</strong> - ต้องเรียนรู้ร่วมกัน ความอดทนสำคัญ';
    if (percent >= 18) return '⚠️ <strong class="text-warning">ต้องระวัง</strong> - ต้องเข้าใจกันดีขึ้น การสื่อสารเป็นสำคัญ';
    return '❌ <strong class="text-danger">อ่อน</strong> - ต้องอดทนและสื่อสารกันเยอะ';
}

/**
 * 🔤 ตัวช่วย - ทำให้ตัวแรกเป็นตัวใหญ่
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
    showRelationPage();
});

window.analyzeRelation = analyzeRelation;
