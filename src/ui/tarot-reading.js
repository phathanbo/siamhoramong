/**
 * 🔮 Tarot Celtic Cross Engine (10-Card Comprehensive Divination)
 * ระบบพยากรณ์ไพ่ยิปซีเซลติกครอส 10 ใบ ระดับมาตรฐานสากล
 */

const celticPositions = [
    { num: 1, title: "1. ตัวตน / สถานการณ์ปัจจุบัน (The Present / Significator)", desc: "สภาวะใจ จุดยืน หรือสถานการณ์สำคัญที่คุณกำลังเผชิญอยู่ในขณะนี้", zone: "cross", role: "core" },
    { num: 2, title: "2. อุปสรรค / สิ่งกีดขวาง (The Challenge / Crossing)", desc: "ความท้าทาย สิ่งขัดขวาง หรือพลังงานที่เข้ามาทดสอบคุณ", zone: "cross", role: "challenge" },
    { num: 3, title: "3. รากฐานของเรื่องราว (The Foundation / Root)", desc: "ต้นตอในอดีต จิตใต้สำนึก หรือสิ่งที่สร้างให้เกิดเหตุการณ์นี้", zone: "cross", role: "root" },
    { num: 4, title: "4. อดีตที่เพิ่งผ่านพ้น (The Recent Past)", desc: "เหตุการณ์หรือปัจจัยที่เพิ่งเกิดขึ้นและกำลังจะหมดอิทธิพลลง", zone: "cross", role: "past" },
    { num: 5, title: "5. ความมุ่งหวัง / จิตสำนึก (The Crown / Best Outcome)", desc: "เป้าหมายสูงสุด สิ่งที่คุณคาดหวัง หรือความคิดที่มีต่อเรื่องนี้", zone: "cross", role: "crown" },
    { num: 6, title: "6. อนาคตอันใกล้ (The Near Future)", desc: "แนวโน้มสิ่งที่จะเกิดขึ้นในระยะ 1-3 เดือนข้างหน้า", zone: "cross", role: "near_future" },
    { num: 7, title: "7. ทัศนคติต่อตนเอง (Self / Attitude)", desc: "ความรู้สึก สภาพจิตใจ และมุมมองที่คุณมีต่อสถานการณ์นี้", zone: "staff", role: "self" },
    { num: 8, title: "8. สิ่งแวดล้อมและคนรอบข้าง (Environment / Outside Forces)", desc: "อิทธิพลของคนรอบตัว เพื่อนร่วมงาน ครอบครัว หรือปัจจัยภายนอก", zone: "staff", role: "env" },
    { num: 9, title: "9. ความหวังและความกังวลลึกๆ (Hopes and Fears)", desc: "สิ่งที่อยู่ในก้นบึ้งของหัวใจ ทั้งความหวังสูงสุดและความกลัว", zone: "staff", role: "hopes_fears" },
    { num: 10, title: "10. บทสรุปและผลลัพธ์สุดท้าย (The Final Outcome)", desc: "ทิศทางบทสรุปในท้ายที่สุด หากสถานการณ์ดำเนินไปตามปัจจัยปัจจุบัน", zone: "staff", role: "outcome" }
];

// พจนานุกรมชื่อไพ่ทาโรต์ภาษาไทย (Major & Minor Arcana 78 Cards)
const TAROT_THAI_NAMES = {
    "The Fool": "คนโง่เขลา / ผู้แสวงหาอิสระ",
    "The Magician": "ผู้วิเศษ / นักมายากล",
    "The High Priestess": "นักบวชหญิง / ราชินีแห่งลางสังหรณ์",
    "The Empress": "จักรพรรดินี / เทพีแห่งความอุดมสมบูรณ์",
    "The Emperor": "จักรพรรดิ / ผู้นำแห่งอำนาจและความมั่นคง",
    "The Hierophant": "พระสังฆราช / ผู้ทรงศีลและประเพณี",
    "The Lovers": "คู่รัก / ทางเลือกแห่งหัวใจ",
    "The Chariot": "นักรบรถม้า / ชัยชนะและการควบคุม",
    "Strength": "พลังแห่งจิตใจ / ความกล้าหาญและความอ่อนโยน",
    "The Hermit": "ฤๅษี / ผู้ค้นหาความจริงในความสันโดษ",
    "Wheel of Fortune": "กงล้อแห่งโชคชะตา / วัฏจักรการเปลี่ยนแปลง",
    "Justice": "ความยุติธรรม / กฎแห่งกรรมและความจริง",
    "The Hanged Man": "คนห้อยหัว / การเสียสละและการมองต่างมุม",
    "Death": "ความตาย / การสิ้นสุดเพื่อเริ่มต้นใหม่",
    "Temperance": "การปรับสมดุล / การประนีประนอมและการเยียวยา",
    "The Devil": "ปีศาจ / กิเลส ตัณหา และพันธนาการ",
    "The Tower": "หอคอยถล่ม / การเปลี่ยนแปลงกะทันหัน",
    "The Star": "ดวงดาว / ความหวัง การฟื้นฟู และแรงบันดาลใจ",
    "The Moon": "ดวงจันทร์ / ภาพลวงตา ความกังวล และจิตใต้สำนึก",
    "The Sun": "ดวงอาทิตย์ / ความสำเร็จ ความสุข และความกระจ่างแจ้ง",
    "Judgement": "การพิพากษา / การตื่นรู้ การให้อภัย และการเริ่มต้นใหม่",
    "The World": "โลก / ความสำเร็จสมบูรณ์แบบและการปิดฉากอย่างงดงาม",

    // Wands (ไม้เท้า - ธาตุไฟ)
    "Ace of Wands": "1 ไม้เท้า (จุดเริ่มต้นของพลังงานและความคิดสร้างสรรค์)",
    "Two of Wands": "2 ไม้เท้า (การวางแผนสู่อนาคตและการขยายขอบเขต)",
    "Three of Wands": "3 ไม้เท้า (การเติบโตและการรอคอยผลลัพธ์)",
    "Four of Wands": "4 ไม้เท้า (การเฉลิมฉลอง ความมั่นคง และความสุขในครอบครัว)",
    "Five of Wands": "5 ไม้เท้า (การแข่งขัน ความขัดแย้ง และการแย่งชิง)",
    "Six of Wands": "6 ไม้เท้า (ชัยชนะ การได้รับการยอมรับ และเกียรติยศ)",
    "Seven of Wands": "7 ไม้เท้า (การยืนหยัดต่อสู้และการปกป้องจุดยืน)",
    "Eight of Wands": "8 ไม้เท้า (ความรวดเร็ว ข่าวสาร และความก้าวหน้าฉับไว)",
    "Nine of Wands": "9 ไม้เท้า (ความระแวดระวังและการอดทนต่อสู้ขั้นสุดท้าย)",
    "Ten of Wands": "10 ไม้เท้า (ภาระหน้าที่อันหนักอึ้งและความรับผิดชอบ)",
    "Page of Wands": "มหาดเล็กไม้เท้า (ข่าวดีและการเริ่มต้นกระตือรือร้น)",
    "Knight of Wands": "อัศวินไม้เท้า (ความกล้าหาญ การเดินทาง และพลังไฟลุกโชน)",
    "Queen of Wands": "ราชินีไม้เท้า (ความเป็นผู้นำ มั่นใจ และมีเสน่ห์ดึงดูด)",
    "King of Wands": "ราชาไม้เท้า (วิสัยทัศน์กว้างไกล ความสำเร็จ และบารมี)",

    // Cups (ถ้วย - ธาตุน้ำ)
    "Ace of Cups": "1 ถ้วย (การเริ่มต้นของความรัก ความสุข และความรู้สึกใหม่)",
    "Two of Cups": "2 ถ้วย (ความรักที่สมดุล มิตรภาพ และการจับคู่ลงตัว)",
    "Three of Cups": "3 ถ้วย (การสังสรรค์ การเฉลิมฉลอง และมิตรภาพที่อบอุ่น)",
    "Four of Cups": "4 ถ้วย (ความเบื่อหน่าย การปฏิเสธโอกาส และการครุ่นคิด)",
    "Five of Cups": "5 ถ้วย (ความเสียใจ ความสูญเสีย และการจมกับอดีต)",
    "Six of Cups": "6 ถ้วย (ความทรงจำในอดีต มิตรภาพเก่า และความไร้เดียงสา)",
    "Seven of Cups": "7 ถ้วย (ภาพลวงตา ตัวเลือกมากมาย และความฝันกลางวัน)",
    "Eight of Cups": "8 ถ้วย (การเดินจากไปเพื่อแสวงหาสิ่งที่มีความหมายกว่า)",
    "Nine of Cups": "9 ถ้วย (ความพึงพอใจในตนเอง ความสุขสมหวัง)",
    "Ten of Cups": "10 ถ้วย (ครอบครัวเปี่ยมสุข ความรักนิรันดร์ และความอิ่มเอมใจ)",
    "Page of Cups": "มหาดเล็กถ้วย (ข่าวสารทางอารมณ์ ความอ่อนไหว และจินตนาการ)",
    "Knight of Cups": "อัศวินถ้วย (ข้อเสนอที่โรแมนติก มิตรไมตรี และความจริงใจ)",
    "Queen of Cups": "ราชินีถ้วย (ความเห็นอกเห็นใจ ลางสังหรณ์ และความอ่อนโยน)",
    "King of Cups": "ราชาถ้วย (ความมั่นคงทางอารมณ์ วุฒิภาวะ และความเมตตา)",

    // Swords (ดาบ - ธาตุลม)
    "Ace of Swords": "1 ดาบ (ความชัดเจนทางความคิด ชัยชนะแห่งสติปัญญา)",
    "Two of Swords": "2 ดาบ (การตัดสินใจที่ยากลำบาก ทางสองแพร่ง และการปิดกั้น)",
    "Three of Swords": "3 ดาบ (ความผิดหวัง หัวใจสลาย และความเจ็บปวด)",
    "Four of Swords": "4 ดาบ (การพักผ่อน สงบจิตใจ และการฟื้นฟูกำลัง)",
    "Five of Swords": "5 ดาบ (ความขัดแย้ง ความพ่ายแพ้ และการเอาชนะที่ไม่คุ้มเสีย)",
    "Six of Swords": "6 ดาบ (การผ่านพ้นวิกฤต การเดินทางสู่ความสงบ)",
    "Seven of Swords": "7 ดาบ (กลยุทธ์ลับ ความลับ และการเอาตัวรอดอย่างชาญฉลาด)",
    "Eight of Swords": "8 ดาบ (ความรู้สึกจนมุม ข้อจำกัดทางความคิด และความกลัว)",
    "Nine of Swords": "9 ดาบ (ความวิตกกังวล ฝันร้าย และความเครียดสะสม)",
    "Ten of Swords": "10 ดาบ (จุดจบที่เจ็บปวด แต่เป็นจุดสิ้นสุดของปัญหา)",
    "Page of Swords": "มหาดเล็กดาบ (ความอยากรู้อยากเห็น ข้อมูลข่าวสาร และการสอดแนม)",
    "Knight of Swords": "อัศวินดาบ (ความเด็ดเดี่ยว มุ่งมั่น และการพุ่งชนเป้าหมาย)",
    "Queen of Swords": "ราชินีดาบ (ความเฉียบคม เป็นกลาง และพึ่งพาตนเอง)",
    "King of Swords": "ราชาดาบ (ปัญญาขั้นสูง ความยุติธรรม และอำนาจตัดสินใจ)",

    // Pentacles (เหรียญ - ธาตุดิน)
    "Ace of Pentacles": "1 เหรียญ (โอกาสทางการเงิน ทรัพย์สิน และโชคลาภก้อนใหม่)",
    "Two of Pentacles": "2 เหรียญ (การหมุนเงิน การรักษาสมดุล และความยืดหยุ่น)",
    "Three of Pentacles": "3 เหรียญ (การทำงานเป็นทีม ฝีมือยอดเยี่ยม และการสร้างสรรค์)",
    "Four of Pentacles": "4 เหรียญ (การประหยัด ความตระหนี่ และการหวงแหนทรัพย์สิน)",
    "Five of Pentacles": "5 เหรียญ (ความยากลำบาก ปัญหาสภาพคล่อง และความโดดเดี่ยว)",
    "Six of Pentacles": "6 เหรียญ (การแบ่งปัน การให้และรับ และความช่วยเหลือเกื้อกูล)",
    "Seven of Pentacles": "7 เหรียญ (การประเมินผลกำไร การอดทนรอเก็บเกี่ยวผลผลิต)",
    "Eight of Pentacles": "8 เหรียญ (ความขยันหมั่นเพียร การพัฒนาทักษะ และความเชี่ยวชาญ)",
    "Nine of Pentacles": "9 เหรียญ (ความมั่งคั่ง อิสรภาพทางการเงิน และความสุขสันโดษ)",
    "Ten of Pentacles": "10 เหรียญ (มรดก ความมั่งคั่งรุ่นสู่รุ่น และความมั่นคงถาวร)",
    "Page of Pentacles": "มหาดเล็กเหรียญ (โอกาสศึกษาต่อ การเริ่มต้นลงทุนเล็กๆ)",
    "Knight of Pentacles": "อัศวินเหรียญ (ความรอบคอบ ความซื่อสัตย์ และการทำงานหนัก)",
    "Queen of Pentacles": "ราชินีเหรียญ (ความอุดมสมบูรณ์ บริหารเงินเก่ง และความอบอุ่น)",
    "King of Pentacles": "ราชาเหรียญ (มหาเศรษฐี ความสำเร็จทางธุรกิจ และความมั่นคงสูงสุด)"
};

/**
 * ดึงชื่อเต็มของไพ่พร้อมวงเล็บภาษาไทย (รองรับทั้งแบบตัวเลข 10 of Cups และตัวหนังสือ Ten of Cups)
 */
function getTarotCardFullName(cardName) {
    if (!cardName) return "";
    let cleanName = cardName.trim();
    
    // ลองหาแบบตรงตัว
    if (TAROT_THAI_NAMES[cleanName]) {
        return `${cleanName} (${TAROT_THAI_NAMES[cleanName]})`;
    }

    // แปลงตัวเลขเป็นคำ เช่น "10 of Cups" -> "Ten of Cups", "1 of Wands" -> "Ace of Wands"
    const numMap = {
        "1": "Ace", "2": "Two", "3": "Three", "4": "Four", "5": "Five",
        "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine", "10": "Ten"
    };

    const parts = cleanName.split(" ");
    if (parts.length >= 3 && numMap[parts[0]]) {
        const convertedName = `${numMap[parts[0]]} ${parts[1]} ${parts[2]}`;
        if (TAROT_THAI_NAMES[convertedName]) {
            return `${cleanName} (${TAROT_THAI_NAMES[convertedName]})`;
        }
    }

    // แปลงคำเป็นตัวเลข เช่น "Ten of Cups" -> "10 of Cups"
    const wordMap = {
        "Ace": "1", "Two": "2", "Three": "3", "Four": "4", "Five": "5",
        "Six": "6", "Seven": "7", "Eight": "8", "Nine": "9", "Ten": "10"
    };
    if (parts.length >= 3 && wordMap[parts[0]]) {
        const numConverted = `${wordMap[parts[0]]} ${parts[1]} ${parts[2]}`;
        if (TAROT_THAI_NAMES[numConverted]) {
            return `${cleanName} (${TAROT_THAI_NAMES[numConverted]})`;
        }
    }

    return cleanName;
}

let currentSpread = [];
let flippedState = [false, false, false, false, false, false, false, false, false, false];
let selectedCategory = 'general';

/**
 * 🎴 เริ่มเปิดผังเซลติกครอส 10 ใบ
 */
function drawCelticCross() {
    if (typeof tarotCards === 'undefined' || tarotCards.length < 10) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('ข้อผิดพลาด', 'ไม่พบฐานข้อมูลไพ่ยิปซี หรือข้อมูลไม่ครบถ้วน', 'error');
        }
        return;
    }

    const catEl = document.getElementById('tarotQuestionCategory');
    selectedCategory = catEl ? catEl.value : 'general';

    const catBadge = document.getElementById('tarotCategoryBadge');
    if (catBadge) {
        const catMap = {
            general: "หมวด: ภาพรวมชีวิตและชะตา",
            career: "หมวด: การงานและธุรกิจ",
            finance: "หมวด: การเงินและการลงทุน",
            love: "หมวด: ความรักและความสัมพันธ์"
        };
        catBadge.innerText = catMap[selectedCategory] || "หมวด: ภาพรวมชีวิต";
    }

    document.getElementById('tarotPreDraw').style.display = 'none';
    document.getElementById('tarotResult').style.display = 'block';

    // สับไพ่แบบสุ่มสมบูรณ์
    let shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    currentSpread = shuffled.slice(0, 10);
    flippedState = new Array(10).fill(false);

    renderCelticCrossLayout();

    // แสดงคำแนะนำการคลิก
    document.getElementById('tarotReadingContent').innerHTML = `
        <div class="text-center py-4">
            <h5 class="text-warning mb-2"><i class="fas fa-hand-pointer mr-2"></i> กรุณาคลิกที่ไพ่แต่ละใบในผัง เพื่อเปิดเผยคำทำนาย</h5>
            <p class="text-white-50 m-0">หรือกดปุ่ม <strong>"เปิดไพ่ทั้งหมดพร้อมกัน"</strong> ด้านบนเพื่อดูคำพยากรณ์และบทวิเคราะห์สังเคราะห์ครบ 10 ใบ</p>
        </div>
    `;

    const synthEl = document.getElementById('tarotOverallSynthesis');
    if (synthEl) synthEl.style.display = 'none';
}

/**
 * 🏛️ เรนเดอร์ผัง Celtic Cross แท้ (ฝั่งซ้ายเป็น Cross & Circle + ฝั่งขวาเป็น Staff 4 ใบ)
 */
function renderCelticCrossLayout() {
    const layoutEl = document.querySelector('.celtic-cross-layout');
    if (!layoutEl) return;

    let html = `
        <div class="celtic-wrapper">
            <!-- ฝั่งซ้าย: The Cross & Circle (ใบที่ 1 - 6) -->
            <div class="celtic-cross-section">
                <!-- แถวบน: ตำแหน่ง 5 (Crown) -->
                <div class="celtic-row top-row text-center mb-2">
                    ${renderSingleCardHtml(4)}
                </div>

                <!-- แถวกลาง: ตำแหน่ง 4 (Past) + ตำแหน่ง 1&2 (Center Cross) + ตำแหน่ง 6 (Future) -->
                <div class="celtic-row middle-row d-flex justify-content-center align-items-center mb-2">
                    <div class="mr-3">${renderSingleCardHtml(3)}</div>
                    
                    <!-- ใจกลางกากบาท ใบที่ 1 และ ใบที่ 2 (Crossed) -->
                    <div class="center-cross-container mx-2 position-relative" style="width: 105px; height: 165px;">
                        <div class="card-1-wrap position-absolute" style="top: 0; left: 0; z-index: 1;">
                            ${renderSingleCardHtml(0, true)}
                        </div>
                        <div class="card-2-wrap position-absolute" style="top: 15px; left: -10px; z-index: 2; transform: rotate(90deg) scale(0.92); opacity: 0.95;">
                            ${renderSingleCardHtml(1, true)}
                        </div>
                    </div>

                    <div class="ml-3">${renderSingleCardHtml(5)}</div>
                </div>

                <!-- แถวล่าง: ตำแหน่ง 3 (Foundation / Root) -->
                <div class="celtic-row bottom-row text-center mt-2">
                    ${renderSingleCardHtml(2)}
                </div>
            </div>

            <!-- ฝั่งขวา: The Staff / The Pillar (ใบที่ 7, 8, 9, 10 เรียงจากล่างขึ้นบน) -->
            <div class="celtic-staff-section d-flex flex-column align-items-center justify-content-between pl-md-4 mt-4 mt-md-0">
                <div class="mb-2">${renderSingleCardHtml(9)}</div> <!-- 10. Outcome -->
                <div class="mb-2">${renderSingleCardHtml(8)}</div> <!-- 9. Hopes/Fears -->
                <div class="mb-2">${renderSingleCardHtml(7)}</div> <!-- 8. Environment -->
                <div>${renderSingleCardHtml(6)}</div>               <!-- 7. Self -->
            </div>
        </div>
    `;

    layoutEl.innerHTML = html;
    injectCelticStyles();
}

/**
 * 🃏 สร้าง HTML ของไพ่แต่ละใบ
 */
function renderSingleCardHtml(index, isCompact = false) {
    const pos = celticPositions[index];
    const card = currentSpread[index];
    const isFlipped = flippedState[index];

    const imgSrc = isFlipped ? card.img : 'assets/tarot_bg.png';
    const fallbackImg = isFlipped ? `https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}` : 'https://upload.wikimedia.org/wikipedia/commons/d/d4/RWS_Tarot_Card_Back.jpg';

    return `
        <div class="celtic-card-slot text-center" style="width: ${isCompact ? '95px' : '105px'};" onclick="flipCard(${index})">
            ${!isCompact ? `<div class="card-slot-label text-gold font-weight-bold mb-1" style="font-size: 0.72rem; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${pos.title}">${pos.num}. ${pos.role.toUpperCase()}</div>` : ''}
            <div class="card-slot-box position-relative" id="tarotCardWrap_${index}" style="cursor: pointer; transition: all 0.3s ease;">
                <img src="${imgSrc}" 
                     onerror="this.src='${fallbackImg}'" 
                     id="tarotImg_${index}" 
                     alt="${card ? card.name : 'Tarot'}" 
                     class="img-fluid rounded shadow-lg border ${isFlipped ? 'border-warning' : 'border-secondary'}" 
                     style="height: ${isCompact ? '145px' : '155px'}; width: 100%; object-fit: cover; border-width: 2px !important; transition: all 0.3s ease;">
                ${!isFlipped ? '<div class="card-back-badge position-absolute" style="bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: #F1D06E; font-size: 10px; padding: 1px 4px; border-radius: 4px;">#' + pos.num + '</div>' : ''}
            </div>
            ${!isCompact ? `<small class="d-block text-white-50 mt-1" style="font-size: 0.68rem; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${isFlipped ? getTarotCardFullName(card.name) : 'แตะเปิด'}">${isFlipped ? getTarotCardFullName(card.name) : 'แตะเปิด'}</small>` : ''}
        </div>
    `;
}

/**
 * ⚡ พลิกเปิดไพ่ใบที่ index
 */
function flipCard(index) {
    if (flippedState[index]) {
        showPositionReading(index);
        return;
    }

    flippedState[index] = true;
    let card = currentSpread[index];

    let imgEl = document.getElementById(`tarotImg_${index}`);
    let wrapEl = document.getElementById(`tarotCardWrap_${index}`);

    if (wrapEl) wrapEl.style.transform = 'scale(1.08)';
    setTimeout(() => {
        if (imgEl) {
            imgEl.onerror = function() {
                this.src = `https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}`;
            };
            imgEl.src = card.img;
            imgEl.classList.remove('border-secondary');
            imgEl.classList.add('border-warning');
        }
        if (wrapEl) wrapEl.style.transform = 'scale(1)';
    }, 150);

    showPositionReading(index);
    checkAndRenderSynthesis();
}

/**
 * 👁️ เปิดไพ่ทั้งหมดพร้อมกันในคลิกเดียว (Reveal All)
 */
function revealAllTarotCards() {
    for (let i = 0; i < 10; i++) {
        flippedState[i] = true;
        let card = currentSpread[i];
        let imgEl = document.getElementById(`tarotImg_${i}`);
        if (imgEl) {
            imgEl.onerror = function() {
                this.src = `https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}`;
            };
            imgEl.src = card.img;
            imgEl.classList.remove('border-secondary');
            imgEl.classList.add('border-warning');
        }
    }
    showPositionReading(9); // แสดงบทสรุป (Outcome) ก่อน
    checkAndRenderSynthesis(true);
}

/**
 * 📜 แสดงคำทำนายเฉพาะตำแหน่งแบบเจาะจง 10 มิติ
 */
function showPositionReading(index) {
    const card = currentSpread[index];
    const pos = celticPositions[index];
    const specificInterpretation = generatePositionalReading(card, pos, selectedCategory);
    const cardFullName = getTarotCardFullName(card.name);

    const readingHtml = `
        <div class="reading-result-card" style="animation: fadeIn 0.4s ease;">
            
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-warning flex-wrap">
                <div>
                    <span class="badge badge-warning text-dark font-weight-bold mb-1">ตำแหน่งที่ ${pos.num} จาก 10</span>
                    <h4 class="text-gold font-weight-bold m-0">${pos.title}</h4>
                    <small class="text-white-50">${pos.desc}</small>
                </div>
                <div class="text-right mt-2 mt-md-0">
                    <span class="text-warning font-weight-bold" style="font-size: 1.15rem;">${cardFullName}</span>
                </div>
            </div>
            
            <div class="row align-items-center mb-4 p-3 rounded" style="background: rgba(0,0,0,0.35); border: 1px solid rgba(241,208,110,0.2);">
                <div class="col-12 col-md-3 text-center mb-3 mb-md-0">
                    <img src="${card.img}" onerror="this.src='https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}'" 
                         class="img-fluid rounded shadow-lg border border-warning" style="max-height: 200px;">
                </div>
                <div class="col-12 col-md-9">
                    <h5 class="text-gold mb-2 font-weight-bold"><i class="fas fa-book-open mr-2 text-warning"></i>ความหมายหลักของไพ่ (Core Meaning):</h5>
                    <p class="text-light small lh-lg mb-3" style="text-align: justify; font-size: 0.92rem;">${card.meaning}</p>
                    
                    <div class="p-3 rounded" style="background: linear-gradient(135deg, rgba(241,208,110,0.15) 0%, rgba(20,25,45,0.7) 100%); border-left: 4px solid #F1D06E;">
                        <h6 class="text-warning font-weight-bold mb-1">
                            <i class="fas fa-star mr-1"></i> คำทำนายในตำแหน่งนี้ (${pos.role.toUpperCase()}):
                        </h6>
                        <p class="text-white m-0" style="font-size: 1rem; line-height: 1.7;">${specificInterpretation.positionMeaning}</p>
                    </div>
                </div>
            </div>

            <!-- Action & Advice สำหรับตำแหน่งนี้ -->
            <div class="row g-3">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                    <div class="p-3 rounded h-100" style="background: rgba(34,197,94,0.08); border-left: 3px solid #22C55E;">
                        <strong style="color: #4ADE80; font-size: 0.9rem;"><i class="fas fa-lightbulb mr-1"></i> คำแนะนำและแนวทางปฏิบัติ:</strong>
                        <p class="small text-white-50 m-0 mt-1">${specificInterpretation.advice}</p>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="p-3 rounded h-100" style="background: rgba(239,68,68,0.08); border-left: 3px solid #EF4444;">
                        <strong style="color: #F87171; font-size: 0.9rem;"><i class="fas fa-shield-alt mr-1"></i> สิ่งที่ควรระวังในจุดนี้:</strong>
                        <p class="small text-white-50 m-0 mt-1">${specificInterpretation.caution}</p>
                    </div>
                </div>
            </div>

        </div>
    `;

    document.getElementById('tarotReadingContent').innerHTML = readingHtml;

    // ไฮไลต์ไพ่ที่เลือก
    for (let i = 0; i < 10; i++) {
        let el = document.getElementById(`tarotImg_${i}`);
        if (el) {
            if (i === index) {
                el.style.boxShadow = '0 0 20px #F1D06E';
                el.style.borderColor = '#F1D06E';
            } else {
                el.style.boxShadow = 'none';
            }
        }
    }
}

/**
 * 🧠 สร้างคำทำนายเฉพาะตำแหน่ง 10 ใบ โดยผูกกับหมวดหมู่คำถาม (General, Career, Finance, Love)
 */
function generatePositionalReading(card, pos, category) {
    const cardFullName = getTarotCardFullName(card.name);
    let baseText = card.present || card.meaning;
    if (pos.role === 'past' || pos.role === 'root') baseText = card.past || card.meaning;
    if (pos.role === 'near_future' || pos.role === 'outcome') baseText = card.future || card.meaning;

    const positionalVerdicts = {
        core: `ไพ่ ${cardFullName} บ่งบอกว่าจุดศูนย์กลางของเรื่องนี้คือคุณกำลังอยู่ในสภาวะ ${baseText.substring(0, 80)}... ซึ่งเป็นจุดเริ่มต้นที่กำหนดทิศทางทั้งหมด`,
        challenge: `สิ่งที่เข้ามาขัดขวางหรือเป็นบททดสอบคือพลังงานของ ${cardFullName} ซึ่งเตือนให้ระวังความเร่งรีบหรืออุปสรรคที่ไม่คาดคิด`,
        root: `รากฐานที่แท้จริงมาจากเหตุการณ์ในอดีตหรือจิตใต้สำนึกที่มีอิทธิพลสืบเนื่องมาจาก ${cardFullName}`,
        past: `ปัจจัยในอดีตที่เพิ่งผ่านพ้นไปคือบทเรียนจาก ${cardFullName} ซึ่งกำลังส่งผลกระทบต่อเนื่องมาถึงปัจจุบัน`,
        crown: `เป้าหมายสูงสุดหรือสิ่งที่คุณมุ่งหวังในใจคือความสำเร็จที่สอดคล้องกับพลังของ ${cardFullName}`,
        near_future: `ในระยะเวลา 1-3 เดือนข้างหน้านี้ คุณจะได้พบกับสถานการณ์และโอกาสตามไพ่ ${cardFullName}`,
        self: `ทัศนคติและจุดยืนในใจของคุณในตอนนี้เปรียบเสมือน ${cardFullName} ซึ่งแสดงถึงความรู้สึกที่แท้จริง`,
        env: `คนรอบข้าง เพื่อนร่วมงาน หรือสิ่งแวดล้อมภายนอกกำลังส่งผลต่อคุณในรูปแบบของ ${cardFullName}`,
        hopes_fears: `ความหวังลึกๆ ของคุณคือความสมหวัง แต่ก็มีความกังวลตามพลังของ ${cardFullName} ซ่อนอยู่`,
        outcome: `บทสรุปและผลลัพธ์สุดท้ายหากคุณก้าวเดินต่อไปตามแนวทางนี้ คือความสำเร็จและความลงตัวตามไพ่ ${cardFullName}`
    };

    return {
        positionMeaning: positionalVerdicts[pos.role] || baseText,
        advice: `จงนำคุณสมบัติเด่นของ ${cardFullName} เช่น ความกล้าหาญ การมีสติ หรือการวางแผนรอบคอบมาปรับใช้กับเป้าหมายของคุณ`,
        caution: `หลีกเลี่ยงการใช้อารมณ์วู่วาม และอย่าปล่อยให้ความกลัวมาขัดขวางการตัดสินใจที่ถูกต้อง`
    };
}

/**
 * 🔮 วิเคราะห์สังเคราะห์ภาพรวม 10 ใบ (Spread Synthesis: ธาตุเด่น + บทสรุปทั้งสำรับ)
 */
function checkAndRenderSynthesis(force = false) {
    const allFlipped = flippedState.every(s => s === true);
    if (!allFlipped && !force) return;

    const synthContainer = document.getElementById('tarotOverallSynthesis');
    const synthContent = document.getElementById('tarotSynthesisContent');
    if (!synthContainer || !synthContent) return;

    synthContainer.style.display = 'block';

    // วิเคราะห์ Major Arcana vs Minor Arcana
    let majorCount = 0;
    let wands = 0, cups = 0, swords = 0, pentacles = 0;

    currentSpread.forEach(c => {
        if (c.id <= 21) {
            majorCount++;
        } else {
            const name = c.name.toLowerCase();
            if (name.includes('wand')) wands++;
            else if (name.includes('cup')) cups++;
            else if (name.includes('sword')) swords++;
            else if (name.includes('pentacle') || name.includes('coin')) pentacles++;
        }
    });

    const dominantElements = [];
    if (swords >= 3) dominantElements.push({ elem: "ธาตุลม (ดาบ)", desc: "มีเรื่องต้องคิด ตัดสินใจ หรือมีแรงกดดัน/ความเครียดที่ต้องใช้ปัญญาคลี่คลาย" });
    if (cups >= 3) dominantElements.push({ elem: "ธาตุน้ำ (ถ้วย)", desc: "อารมณ์ ความรู้สึก ความรัก และความสัมพันธ์มีบทบาทนำในสถานการณ์นี้" });
    if (pentacles >= 3) dominantElements.push({ elem: "ธาตุดิน (เหรียญ)", desc: "เรื่องการเงิน ทรัพย์สิน ความมั่นคง และผลประโยชน์ทางธุรกิจกำลังโดดเด่น" });
    if (wands >= 3) dominantElements.push({ elem: "ธาตุไฟ (ไม้เท้า)", desc: "พลังงานการทำงาน โครงการใหม่ ความกระตือรือร้น และการขยับขยาย" });

    const finalCard = currentSpread[9]; // ใบที่ 10
    const finalCardFullName = getTarotCardFullName(finalCard.name);

    synthContent.innerHTML = `
        <div class="row g-3">
            <div class="col-12 col-md-4 mb-3 mb-md-0">
                <div class="p-3 rounded h-100 text-center" style="background: rgba(241,208,110,0.1); border: 1px solid rgba(241,208,110,0.3);">
                    <span class="text-white-50 small d-block">พลังงานชะตาชีวิตใหญ่ (Major Arcana)</span>
                    <h3 class="text-gold font-weight-bold my-2">${majorCount} / 10 ใบ</h3>
                    <small style="color: #CBD5E1;">${majorCount >= 4 ? 'ชีวิตกำลังอยู่ในจุดเปลี่ยนผ่านและมีเหตุการณ์สำคัญของชีวิต' : 'เป็นช่วงเวลาของการลงมือทำและจัดการเรื่องราวประจำวัน'}</small>
                </div>
            </div>

            <div class="col-12 col-md-4 mb-3 mb-md-0">
                <div class="p-3 rounded h-100" style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);">
                    <span class="text-white-50 small d-block mb-1">ธาตุที่ทรงอิทธิพลในผัง</span>
                    ${dominantElements.length > 0 ? dominantElements.map(e => `
                        <div class="mb-2">
                            <strong style="color: #93C5FD;">• ${e.elem}:</strong>
                            <small class="d-block text-white-50">${e.desc}</small>
                        </div>
                    `).join('') : '<small class="text-light">ธาตุทั้ง 4 มีความสมดุลกลมกลืน ไม่มีด้านใดตึงหรือหย่อนเกินไป</small>'}
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div class="p-3 rounded h-100" style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);">
                    <span class="text-white-50 small d-block mb-1">ไพ่บทสรุปชี้ทิศทาง (The Outcome)</span>
                    <strong style="color: #4ADE80; font-size: 1.05rem;">${finalCardFullName}</strong>
                    <p class="small text-white-50 mt-2 mb-0" style="line-height: 1.5;">${finalCard.future || finalCard.meaning}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * 🎨 สไตล์ CSS สำหรับ ผัง Celtic Cross แท้
 */
function injectCelticStyles() {
    if (document.getElementById('celticCrossCustomStyles')) return;
    const style = document.createElement('style');
    style.id = 'celticCrossCustomStyles';
    style.innerHTML = `
        .celtic-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
        .celtic-cross-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 340px;
        }
        .celtic-staff-section {
            border-left: 2px dashed rgba(241,208,110,0.3);
            min-width: 140px;
        }
        @media (max-width: 768px) {
            .celtic-staff-section {
                border-left: none;
                border-top: 2px dashed rgba(241,208,110,0.3);
                padding-top: 20px;
                flex-direction: row !important;
                flex-wrap: wrap;
                justify-content: center !important;
                width: 100%;
            }
            .celtic-staff-section > div {
                margin: 6px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 🔄 ล้างผังเพื่อดูใหม่
 */
function resetTarotReading() {
    const layoutEl = document.querySelector('.celtic-cross-layout');
    if (layoutEl) layoutEl.innerHTML = '';
    const readEl = document.getElementById('tarotReadingContent');
    if (readEl) readEl.innerHTML = '';
    const synthEl = document.getElementById('tarotOverallSynthesis');
    if (synthEl) synthEl.style.display = 'none';

    document.getElementById('tarotPreDraw').style.display = 'block';
    document.getElementById('tarotResult').style.display = 'none';
}

// ผูกเข้ากับ window scope
window.drawCelticCross = drawCelticCross;
window.flipCard = flipCard;
window.revealAllTarotCards = revealAllTarotCards;
window.resetTarotReading = resetTarotReading;

