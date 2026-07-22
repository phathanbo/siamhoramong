// --- Combined Logic for adminZodiacAutoCarousel ---

function changeCarouselDate(offset) {
    const input = document.getElementById('cfDate');
    if (!input || !input.value) return;
    const d = new Date(input.value);
    d.setDate(d.getDate() + offset);
    input.value = d.toISOString().split('T')[0];
    
    // อัปเดตการแสดงผลพรีวิว
    if (typeof renderCarouselPreview === 'function') {
        renderCarouselPreview();
    }
}

function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    
    if(mode === 'single') {
        document.getElementById('tabSingle').classList.add('active');
        document.getElementById('singleControls').style.display = 'block';
        document.getElementById('carouselControls').style.display = 'none';
        
        document.getElementById('captureArea').style.display = 'flex';
        document.getElementById('singlePreviewBtns').style.display = 'block';
        document.getElementById('cfPreviewWrapper').style.display = 'none';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่าง (ขนาด 1080x1080)';
    } else {
        document.getElementById('tabCarousel').classList.add('active');
        document.getElementById('singleControls').style.display = 'none';
        document.getElementById('carouselControls').style.display = 'block';
        
        document.getElementById('captureArea').style.display = 'none';
        document.getElementById('singlePreviewBtns').style.display = 'none';
        document.getElementById('cfPreviewWrapper').style.display = 'flex';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่างอัลบั้ม 9 ภาพ (เลื่อนลงเพื่อดูทั้งหมด)';
        
        const dateInput = document.getElementById('cfDate');
        if (!dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

// ข้อมูลคงที่
if (typeof THAI_DAYS_LONG === 'undefined') { var THAI_DAYS_LONG = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']; }
if (typeof CF_DAY_NAMES === 'undefined') { var CF_DAY_NAMES = THAI_DAYS_LONG; }
if (typeof CF_DAY_COLORS === 'undefined') { var CF_DAY_COLORS = ['#e74c3c', '#f1c40f', '#e84393', '#2ecc71', '#e67e22', '#3498db', '#9b59b6']; }
if (typeof THAI_MONTHS === 'undefined') { var THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']; }

if (typeof DEFAULT_DAILY_FORTUNE_DB === 'undefined') {
    var DEFAULT_DAILY_FORTUNE_DB = {
        work: [
            "วันนี้มีเกณฑ์ได้รับข่าวดีเรื่องงาน โปรเจกต์ที่ทำอยู่จะประสบความสำเร็จเกินคาด 💼✨",
            "เป็นวันที่ต้องใช้ความอดทนสูง อาจมีอุปสรรคเล็กน้อย แต่จะผ่านไปได้ด้วยดี 🧱",
            "ผู้ใหญ่ให้การสนับสนุน หรือมีเกณฑ์ได้แสดงฝีมือให้เป็นที่ประจักษ์ 🌟",
            "งานล้นมือ ต้องจัดสรรเวลาให้ดี ระวังการสื่อสารผิดพลาดกับเพื่อนร่วมงาน 🗣️",
            "มีเกณฑ์ชีพจรลงเท้า ต้องเดินทางเรื่องงาน หรือรับผิดชอบงานนอกสถานที่ 🚶‍♂️",
            "เจรจาต่อรองประสบความสำเร็จ ลูกค้าหรือพาร์ทเนอร์ตอบรับข้อเสนอเป็นอย่างดี 🤝"
        ],
        finance: [
            "มีโชคลาภลอยแบบไม่คาดฝัน หรือได้เงินคืนจากลูกหนี้เก่า 💰💸",
            "การเงินสะพัด แต่ก็มีรายจ่ายจุกจิกเข้ามาตลอดวัน ระวังการใช้จ่ายตามอารมณ์ 💳",
            "มีเกณฑ์ได้ทรัพย์สินชิ้นใหญ่ หรือการลงทุนเริ่มผลิดอกออกผล 📈",
            "ระวังคนแปลกหน้ามาหยิบยืมเงิน หรือทำของมีค่าสูญหาย ⚠️",
            "ได้รับโชคจากผู้ใหญ่ หรือเพศตรงข้ามนำความโชคดีมาให้ 🎁",
            "การเงินมั่นคง แต่อาจต้องเสียเงินเพื่อสุขภาพหรือซ่อมแซมยานพาหนะ 🛠️"
        ],
        love: [
            "คนโสด: มีโอกาสพบเจอคนถูกใจจากการทำงาน หรือคนรู้จักแนะนำให้ ❤️\nคนมีคู่: ความรักหวานชื่น เข้าอกเข้าใจกันดี",
            "คนโสด: ยังต้องโฟกัสเรื่องงานไปก่อน รักไม่ยุ่งมุ่งแต่รวย 💼\nคนมีคู่: ระวังคำพูดที่ตรงเกินไปจนผิดใจกัน 🤐",
            "คนโสด: เสน่ห์แรงเป็นพิเศษ มีคนเข้ามาให้ความสนใจหลายคน 🌹\nคนมีคู่: มีเกณฑ์ได้เดินทางท่องเที่ยว หรือใช้เวลาดีๆ ร่วมกัน ✈️",
            "คนโสด: ระวังเจอคนมีเจ้าของเข้ามาพัวพัน เช็คให้ดีก่อนสานต่อ 🕵️‍♀️\nคนมีคู่: อาจมีเรื่องงอนกันเล็กๆ น้อยๆ แต่เคลียร์กันได้ 💖",
            "คนโสด: คนรักเก่าอาจวนเวียนกลับมา หรือนึกถึงความทรงจำเก่าๆ 🕰️\nคนมีคู่: ดูแลเอาใจใส่กันเป็นพิเศษ ความรักมั่นคงดี 🥰"
        ]
    };
}

if (typeof ZODIAC_LIST === 'undefined') {
    var ZODIAC_LIST = [
        { id: '1', name: 'ราศีเมษ', dateRange: '13 เม.ย. - 13 พ.ค.', icon: '♈' },
        { id: '2', name: 'ราศีพฤษภ', dateRange: '14 พ.ค. - 13 มิ.ย.', icon: '♉' },
        { id: '3', name: 'ราศีเมถุน', dateRange: '14 มิ.ย. - 14 ก.ค.', icon: '♊' },
        { id: '4', name: 'ราศีกรกฎ', dateRange: '15 ก.ค. - 16 ส.ค.', icon: '♋' },
        { id: '5', name: 'ราศีสิงห์', dateRange: '17 ส.ค. - 16 ก.ย.', icon: '♌' },
        { id: '6', name: 'ราศีกันย์', dateRange: '17 ก.ย. - 16 ต.ค.', icon: '♍' },
        { id: '7', name: 'ราศีตุลย์', dateRange: '17 ต.ค. - 15 พ.ย.', icon: '♎' },
        { id: '8', name: 'ราศีพิจิก', dateRange: '16 พ.ย. - 15 ธ.ค.', icon: '♏' },
        { id: '9', name: 'ราศีธนู', dateRange: '16 ธ.ค. - 13 ม.ค.', icon: '♐' },
        { id: '10', name: 'ราศีมังกร', dateRange: '14 ม.ค. - 12 ก.พ.', icon: '♑' },
        { id: '11', name: 'ราศีกุมภ์', dateRange: '13 ก.พ. - 13 มี.ค.', icon: '♒' },
        { id: '12', name: 'ราศีมีน', dateRange: '14 มี.ค. - 12 เม.ย.', icon: '♓' }
    ];
}

const SEVEN_DAYS_LIST = [
    { id: '0', name: 'วันอาทิตย์ (สีแดง)', color: '#FF0000', bg: '#ffe5e5', border: '#ff4d4d' },
    { id: '1', name: 'วันจันทร์ (สีเหลือง)', color: '#FFC107', bg: '#fffbd6', border: '#ffdb4d' },
    { id: '2', name: 'วันอังคาร (สีชมพู)', color: '#FF69B4', bg: '#ffe6f2', border: '#ff99cc' },
    { id: '3', name: 'วันพุธ (สีเขียว)', color: '#4CAF50', bg: '#e8f5e9', border: '#81c784' },
    { id: '4', name: 'วันพฤหัสบดี (สีส้ม)', color: '#FF9800', bg: '#fff3e0', border: '#ffb74d' },
    { id: '5', name: 'วันศุกร์ (สีฟ้า)', color: '#2196F3', bg: '#e3f2fd', border: '#64b5f6' },
    { id: '6', name: 'วันเสาร์ (สีม่วง)', color: '#9C27B0', bg: '#f3e5f5', border: '#ba68c8' }
];

document.addEventListener('DOMContentLoaded', () => {
    // กำหนดวันที่ค่าเริ่มต้นเป็นวันนี้
    const dateInput = document.getElementById('dateSelect');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    updateSubOptions();
});

document.getElementById('categorySelect').addEventListener('change', () => {
    updateSubOptions();
});

function updateSubOptions() {
    const category = document.getElementById('categorySelect').value;
    const targetSelect = document.getElementById('targetSelect');
    const targetGroup = document.getElementById('subTargetGroup');
    const label = document.getElementById('subTargetLabel');

    targetSelect.innerHTML = '';
    
    if (category === 'zodiac') {
        targetGroup.style.display = 'flex';
        label.innerText = 'เลือกราศี';
        ZODIAC_LIST.forEach(z => {
            targetSelect.innerHTML += `<option value="${z.id}">${z.name} (${z.dateRange})</option>`;
        });
    } else if (category === 'sevendays') {
        targetGroup.style.display = 'flex';
        label.innerText = 'เลือกวันเกิด';
        SEVEN_DAYS_LIST.forEach(d => {
            targetSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
        });
    } else {
        targetGroup.style.display = 'none';
    }
}

function formatDateThai(dateObj) {
    const dayOfWeek = THAI_DAYS_LONG[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = THAI_MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543;
    return `ประจำวัน${dayOfWeek}ที่ ${day} ${month} พ.ศ.${year}`;
}

function generateAutoContent() {
    const category = document.getElementById('categorySelect').value;
    const dateStr = document.getElementById('dateSelect').value;
    
    if (!dateStr) {
        Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกวันที่', 'error');
        return;
    }
    
    const dateObj = new Date(dateStr);
    const dateThai = formatDateThai(dateObj);
    const captureArea = document.getElementById('captureArea');
    
    // Clear previous classes
    captureArea.className = 'canvas-container';

    if (category === 'zodiac') {
        generateZodiacTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'sevendays') {
        generateSevendaysTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'tarot') {
        generateTarotTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'zodiac_all') {
        generateZodiacAllTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'sevendays_all') {
        generateSevendaysAllTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'thai_ascendant_all') {
        generateThaiAscendantAllTemplate(dateObj, dateThai, captureArea);
    } else if (category === 'thai_animal_all') {
        generateThaiAnimalAllTemplate(dateObj, dateThai, captureArea);
    }
}

function generateZodiacTemplate(dateObj, dateThai, container) {
    const targetId = document.getElementById('targetSelect').value;
    
    if (typeof generateDailyZodiacFortunes !== 'function') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฟังก์ชันดึงข้อมูล 12 ราศี', 'error');
        return;
    }
    
    // ดึงข้อมูลทั้งหมดของวันนั้น แล้วกรองเอาราศีที่เลือก
    const predictions = generateDailyZodiacFortunes(dateObj);
    const pred = predictions.find(p => p.id == targetId);
    
    if (!pred) return;
    
    container.classList.add('template-zodiac');
    
    // สุ่มดาว
    const stars = ["⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    const workStars = stars[Math.floor(Math.random() * stars.length)];
    const moneyStars = stars[Math.floor(Math.random() * stars.length)];
    const loveStars = stars[Math.floor(Math.random() * stars.length)];

    container.innerHTML = `
        <div class="zodiac-icon">${pred.icon}</div>
        <div class="zodiac-title">${pred.name}</div>
        <div class="zodiac-date">${dateThai}</div>
        <div class="zodiac-prediction">
            <span style="color: #4CAF50;">✅ ดี:</span> ${pred.good} <br><br>
            <span style="color: #F44336;">⚠️ ระวัง:</span> ${pred.bad} <br><br>
            <span style="color: #aaa; font-size:32px;">"${pred.description}"</span>
        </div>
        <div class="zodiac-rating">
            <div class="rating-item">
                <span class="rating-label">การงาน</span>
                <span class="rating-stars">${workStars}</span>
            </div>
            <div class="rating-item">
                <span class="rating-label">การเงิน</span>
                <span class="rating-stars">${moneyStars}</span>
            </div>
            <div class="rating-item">
                <span class="rating-label">ความรัก</span>
                <span class="rating-stars">${loveStars}</span>
            </div>
        </div>
        <div class="watermark">สยามโหรามงคล (Siamhora.com)</div>
    `;
}

function generateSevendaysTemplate(dateObj, dateThai, container) {
    const targetId = parseInt(document.getElementById('targetSelect').value);
    const dayData = SEVEN_DAYS_LIST[targetId];
    
    // ใช้คำทำนายพื้นฐานสำหรับ 7 วัน
    const baseMeanings = [
        "วันนี้จะมีเรื่องเซอร์ไพรส์เข้ามา การงานราบรื่น การเงินอยู่ในเกณฑ์ที่จัดการได้ดี ควรทำใจให้สบาย",
        "ต้องระมัดระวังเรื่องการสื่อสาร อาจมีปากเสียงกับคนรอบข้างหรือเพื่อนร่วมงานได้ง่าย",
        "ความรักโดดเด่น มีเกณฑ์ได้พบเจอคนถูกใจ หรือคนรักเอาใจใส่เป็นพิเศษ",
        "มีผู้ใหญ่คอยอุปถัมภ์ค้ำชู ติดต่องานใดๆ จะสำเร็จลุล่วงด้วยดี",
        "ระวังเรื่องสุขภาพ อาการปวดเมื่อย หรือโรคเก่ากำเริบ ควรพักผ่อนให้เพียงพอ",
        "โชคลาภลอยเข้ามาหา มีโอกาสได้รับเงินก้อนจากการลงทุน หรือถูกรางวัล",
        "การเดินทางไกลจะนำโชคมาให้ หรือได้พบเจอคนดีๆ จากต่างถิ่น"
    ];
    
    // Seed by date + day
    const seed = dateObj.getDate() + dateObj.getMonth() + targetId;
    const textIndex = seed % baseMeanings.length;
    const mainDesc = baseMeanings[textIndex];
    
    const workIdx = (seed + 1) % baseMeanings.length;
    const financeIdx = (seed + 2) % baseMeanings.length;
    
    container.classList.add('template-sevendays');
    container.style.border = `20px solid ${dayData.border}`;
    
    container.innerHTML = `
        <div class="sevendays-header" style="background: ${dayData.color};">
            <h1 class="sevendays-title">คนเกิด${dayData.name.split(' ')[0]}</h1>
            <div class="sevendays-date">${dateThai}</div>
        </div>
        
        <div style="font-size: 40px; text-align: center; margin-bottom: 40px; font-weight: bold; color: ${dayData.color}; padding: 0 40px;">
            "${mainDesc}"
        </div>
        
        <div class="sevendays-grid">
            <div class="sevendays-box" style="border-left-color: ${dayData.color};">
                <div class="box-title" style="color: ${dayData.color};"><i class="fas fa-briefcase"></i> การงาน</div>
                <div class="box-content">${baseMeanings[workIdx]}</div>
            </div>
            <div class="sevendays-box" style="border-left-color: ${dayData.color};">
                <div class="box-title" style="color: ${dayData.color};"><i class="fas fa-coins"></i> การเงิน</div>
                <div class="box-content">${baseMeanings[financeIdx]}</div>
            </div>
        </div>
        
        <div class="sevendays-footer">
            ดูดวงแม่นๆ ที่ สยามโหรามงคล (Siamhora.com)
        </div>
    `;
}

function generateTarotTemplate(dateObj, dateThai, container) {
    if (typeof tarotCards === 'undefined' || tarotCards.length === 0) {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฐานข้อมูลไพ่ยิปซี (tarotCards)', 'error');
        return;
    }
    const randomIdx = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[randomIdx];
    window.currentDrawnCard = card; // Store for canvas
    container.classList.add('template-tarot');
    
    const cardImgUrl = card.img || 'https://images.unsplash.com/photo-1638202513410-85f0967a149f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
    let fontSize = 32;
    let lineH = 1.4;
    let nameSize = 52;
    let imgSize = 350;
    let gap = 20;
    
    if (combinedLength > 150) { fontSize = 28; nameSize = 48; imgSize = 320; gap = 15; }
    if (combinedLength > 250) { fontSize = 24; lineH = 1.3; nameSize = 42; imgSize = 270; gap = 10; }
    if (combinedLength > 350) { fontSize = 21; lineH = 1.2; nameSize = 36; imgSize = 230; gap = 5; }
    
    container.innerHTML = `
        <div class="tarot-overlay"></div>
        <div class="tarot-content-wrapper" style="padding: ${gap}px 0;">
            <div class="tarot-header" style="margin-bottom: ${gap}px; font-size: 40px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:26px; color:#aaa;">${dateThai}</span></div>
            
            <img src="${cardImgUrl}" class="tarot-card-img" style="height: ${imgSize}px; margin: 0 auto; display: block; border-radius: 10px; border: 2px solid #d4af37; margin-bottom: 0;" crossorigin="anonymous" />
            
            <h2 style="font-size: ${nameSize}px; color: #fff; margin-bottom: ${gap}px; margin-top: ${gap}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">${card.name}</h2>
            
            <div class="tarot-meaning" style="font-size: ${fontSize}px; line-height: ${lineH}; max-width: 900px; padding: 0 40px;">
                "${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> ${card.future}
            </div>
            
            <div style="position: absolute; bottom: ${gap}px; font-size: 22px; color: rgba(255,255,255,0.4);">
                สยามโหรามงคล (Siamhora.com)
            </div>
        </div>
    `;
}

// -----------------------------------------------------
// COMBINED ALL-IN-ONE GENERATORS
// -----------------------------------------------------

function generateZodiacAllTemplate(dateObj, dateThai, container) {
    container.className = 'canvas-container template-combined-all';
    container.style.backgroundImage = "url('assets/zodiac_bg.png')";

    const predictions = (typeof generateDailyZodiacFortunes === 'function') ? generateDailyZodiacFortunes(dateObj) : [];

    let gridHtml = '';
    ZODIAC_LIST.forEach(z => {
        const pred = predictions.find(p => p.id == z.id) || { description: "มีสิ่งดีๆ รออยู่", good: "ดวงเปิดรับโชค" };
        // Truncate the description to fit the grid
        const shortDesc = pred.description.length > 50 ? pred.description.substring(0, 50) + "..." : pred.description;
        
        gridHtml += `
            <div class="combined-item">
                <div class="item-icon">${z.icon}</div>
                <div class="item-title">${z.name}</div>
                <div class="item-desc" style="font-size: 16px;">
                    <span style="color: #2e7d32; font-weight: bold;">✅ ${pred.good}</span><br>
                    <span style="color: #666; font-style: italic;">"${shortDesc}"</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="combined-header">
            <h1>สรุปดวง 12 ราศี</h1>
            <div class="date">${dateThai}</div>
        </div>
        <div class="combined-grid-3x4">
            ${gridHtml}
        </div>
        <div style="text-align: center; color: rgba(255,255,255,0.5); margin-top: 15px; position: relative; z-index: 1;">สยามโหรามงคล (Siamhora.com)</div>
    `;
}

function generateSevendaysAllTemplate(dateObj, dateThai, container) {
    container.className = 'canvas-container template-combined-all';
    container.style.backgroundImage = "url('assets/sevendays_bg.png')";

    const baseMeanings = [
        "งานราบรื่น เงินดี รักสดใส",
        "ระวังคำพูด งดเสี่ยงโชค",
        "มีผู้ใหญ่อุปถัมภ์ เงินเข้าเรื่อยๆ",
        "พักผ่อนบ้าง งานหนักเงินดี",
        "โชคลาภเด่น การงานมีอุปสรรคเล็กน้อย",
        "เดินทางไกลได้โชค ความรักมีเกณฑ์ดี",
        "ธุรกิจเจริญก้าวหน้า ระวังปัญหาสุขภาพ"
    ];
    
    let gridHtml = '';
    SEVEN_DAYS_LIST.forEach((d, index) => {
        const seed = dateObj.getDate() + index;
        const shortMeaning = baseMeanings[seed % baseMeanings.length];
        
        gridHtml += `
            <div class="combined-item" style="border-color: ${d.color};">
                <div class="item-title" style="color: ${d.color}; border-bottom-color: ${d.color};">${d.name.split(' ')[0]}</div>
                <div class="item-desc" style="font-size: 22px; padding: 10px;">${shortMeaning}</div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="combined-header">
            <h1 style="color: #333; text-shadow: 0 0 10px #fff;">สรุปดวงคนเกิด 7 วัน</h1>
            <div class="date" style="color: #444; font-weight: bold; background: rgba(255,255,255,0.7); display: inline-block; padding: 5px 20px; border-radius: 20px;">${dateThai}</div>
        </div>
        <div class="combined-flex-7">
            ${gridHtml}
        </div>
    `;
}

function generateThaiAscendantAllTemplate(dateObj, dateThai, container) {
    container.className = 'canvas-container template-combined-all';
    container.style.backgroundImage = "url('assets/zodiac_bg.png')"; // Reusing starry background for Astro

    const ascendants = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
    
    const thaiMeanings = [
        "ดาวพฤหัสบดีส่งผลดี โชคลาภเข้ามาต่อเนื่อง", "ราหูเล็ง ระวังเรื่องเอกสารและสัญญา", 
        "ดาวศุกร์เด่น ความรักและโชคลาภการเงินดีมาก", "ดาวเสาร์ทับ ล่าช้าแต่สุดท้ายจะมั่นคง", 
        "ดาวอังคารให้คุณ แข่งขันชนะ ได้รับการยอมรับ", "ดาวพุธกุมลัคนา เจรจาค้าขายเป็นเลิศ",
        "ดาวอาทิตย์ร่วม สมหวังเรื่องเลื่อนขั้นเลื่อนตำแหน่ง", "ระวังปัญหาสุขภาพ และอุบัติเหตุเล็กน้อย",
        "ดาวมฤตยูเคลื่อน การเปลี่ยนแปลงครั้งใหญ่กำลังมา", "ผู้ใหญ่อุปถัมภ์ค้ำชู ได้ของมีค่า"
    ];

    let gridHtml = '';
    ascendants.forEach((asc, index) => {
        const seed = dateObj.getMonth() + dateObj.getDate() + index;
        const meaning = thaiMeanings[seed % thaiMeanings.length];
        gridHtml += `
            <div class="combined-item">
                <div class="item-title">ลัคนาราศี${asc}</div>
                <div class="item-desc" style="font-size: 18px;">${meaning}</div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="combined-header">
            <h1>ทำนายดวง 12 ลัคนาราศี</h1>
            <div class="date">${dateThai}</div>
        </div>
        <div class="combined-grid-3x4">
            ${gridHtml}
        </div>
        <div style="text-align: center; color: rgba(255,255,255,0.5); margin-top: 15px; position: relative; z-index: 1;">สยามโหรามงคล (Siamhora.com)</div>
    `;
}

function generateThaiAnimalAllTemplate(dateObj, dateThai, container) {
    container.className = 'canvas-container template-combined-all';
    container.style.backgroundImage = "url('assets/sevendays_bg.png')";

    const animals = ["ชวด 🐀", "ฉลู 🐂", "ขาล 🐅", "เถาะ 🐇", "มะโรง 🐉", "มะเส็ง 🐍", "มะเมีย 🐎", "มะแม 🐐", "วอก 🐒", "ระกา 🐓", "จอ 🐕", "กุน 🐖"];
    const baseMeanings = [
        "งานราบรื่น เงินดี รักสดใส", "ระวังคำพูด งดเสี่ยงโชค", "มีผู้ใหญ่อุปถัมภ์ เงินเข้าเรื่อยๆ", "พักผ่อนบ้าง งานหนักเงินดี", 
        "โชคลาภเด่น งานมีอุปสรรคเล็กน้อย", "เดินทางไกลได้โชค", "ธุรกิจเจริญก้าวหน้า", "สุขภาพแข็งแรง ศัตรูพ่ายแพ้"
    ];

    let gridHtml = '';
    animals.forEach((animal, index) => {
        const seed = dateObj.getFullYear() + dateObj.getDate() + index;
        const meaning = baseMeanings[seed % baseMeanings.length];
        gridHtml += `
            <div class="combined-item" style="border-color: #d4af37;">
                <div class="item-title" style="color: #d4af37;">ปี${animal}</div>
                <div class="item-desc" style="font-size: 20px;">${meaning}</div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="combined-header">
            <h1 style="color: #333; text-shadow: 0 0 10px #fff;">สรุปดวงคนเกิด 12 ปีนักษัตร</h1>
            <div class="date" style="color: #444; font-weight: bold; background: rgba(255,255,255,0.7); display: inline-block; padding: 5px 20px; border-radius: 20px;">${dateThai}</div>
        </div>
        <div class="combined-grid-3x4">
            ${gridHtml}
        </div>
    `;
}

async function drawZodiacCanvas(ctx, dateObj, dateThai) {
    const targetId = document.getElementById('targetSelect').value;
    const predictions = generateDailyZodiacFortunes(dateObj);
    const pred = predictions.find(p => p.id == targetId);
    if (!pred) throw new Error("ไม่พบข้อมูลราศี");

    const bgImg = new Image(); bgImg.src = 'assets/zodiac_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 30; ctx.strokeRect(15, 15, 1050, 1050);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'; ctx.lineWidth = 4; ctx.setLineDash([10,10]);
    ctx.strokeRect(40, 40, 1000, 1000); ctx.setLineDash([]);
    
    ctx.textAlign = 'center';
    ctx.font = '150px sans-serif'; ctx.fillStyle = '#d4af37';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)'; ctx.shadowBlur = 40;
    ctx.fillText(pred.icon, 540, 250); ctx.shadowBlur = 0;
    
    ctx.font = 'bold 72px "Sarabun"'; ctx.fillText(pred.name, 540, 340);
    
    ctx.font = '32px "Sarabun"'; ctx.fillStyle = '#aaa';
    const badgeW = 450;
    drawRoundedRect(ctx, 540 - badgeW/2, 380, badgeW, 50, 25, 'rgba(255,255,255,0.1)');
    ctx.fillText(dateThai, 540, 415);
    
    ctx.font = '42px "Sarabun"'; ctx.fillStyle = '#4CAF50';
    ctx.textAlign = 'left'; ctx.fillText("✅ ดี:", 100, 520);
    ctx.fillStyle = '#fff'; wrapText(ctx, pred.good, 230, 520, 750, 60);
    
    ctx.fillStyle = '#F44336'; ctx.fillText("⚠️ ระวัง:", 100, 620);
    ctx.fillStyle = '#fff'; wrapText(ctx, pred.bad, 270, 620, 710, 60);
    
    ctx.fillStyle = '#aaa'; ctx.font = '32px "Sarabun"'; ctx.textAlign = 'center';
    wrapText(ctx, `"${pred.description}"`, 540, 740, 880, 45);
    
    const stars = ["⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    const wS = stars[Math.floor(Math.random() * stars.length)];
    const mS = stars[Math.floor(Math.random() * stars.length)];
    const lS = stars[Math.floor(Math.random() * stars.length)];
    drawRoundedRect(ctx, 140, 850, 800, 120, 20, 'rgba(0,0,0,0.4)', 'rgba(212, 175, 55, 0.2)');
    ctx.fillStyle = '#aaa'; ctx.font = '24px "Sarabun"';
    ctx.fillText("การงาน", 270, 890); ctx.fillText("การเงิน", 540, 890); ctx.fillText("ความรัก", 810, 890);
    ctx.fillStyle = '#d4af37'; ctx.font = '36px "Sarabun"';
    ctx.fillText(wS, 270, 940); ctx.fillText(mS, 540, 940); ctx.fillText(lS, 810, 940);
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '24px "Sarabun"';
    ctx.fillText("สยามโหรามงคล (Siamhora.com)", 540, 1040);
}

async function drawSevendaysCanvas(ctx, dateObj, dateThai) {
    const targetId = parseInt(document.getElementById('targetSelect').value);
    const dayData = SEVEN_DAYS_LIST[targetId];
    const baseMeanings = [
        "วันนี้จะมีเรื่องเซอร์ไพรส์เข้ามา การงานราบรื่น การเงินอยู่ในเกณฑ์ที่จัดการได้ดี ควรทำใจให้สบาย",
        "ต้องระมัดระวังเรื่องการสื่อสาร อาจมีปากเสียงกับคนรอบข้างหรือเพื่อนร่วมงานได้ง่าย",
        "ความรักโดดเด่น มีเกณฑ์ได้พบเจอคนถูกใจ หรือคนรักเอาใจใส่เป็นพิเศษ",
        "มีผู้ใหญ่คอยอุปถัมภ์ค้ำชู ติดต่องานใดๆ จะสำเร็จลุล่วงด้วยดี",
        "ระวังเรื่องสุขภาพ อาการปวดเมื่อย หรือโรคเก่ากำเริบ ควรพักผ่อนให้เพียงพอ",
        "โชคลาภลอยเข้ามาหา มีโอกาสได้รับเงินก้อนจากการลงทุน หรือถูกรางวัล",
        "การเดินทางไกลจะนำโชคมาให้ หรือได้พบเจอคนดีๆ จากต่างถิ่น"
    ];
    const seed = dateObj.getDate() + dateObj.getMonth() + targetId;
    const mainDesc = baseMeanings[seed % baseMeanings.length];
    const workDesc = baseMeanings[(seed + 1) % baseMeanings.length];
    const finDesc = baseMeanings[(seed + 2) % baseMeanings.length];

    const bgImg = new Image(); bgImg.src = 'assets/sevendays_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.strokeStyle = dayData.border; ctx.lineWidth = 40; ctx.strokeRect(20, 20, 1040, 1040);
    
    ctx.fillStyle = dayData.color; ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 20;
    drawRoundedRect(ctx, 140, 80, 800, 220, 30, dayData.color); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = 'bold 80px "Sarabun"'; ctx.fillText(`คนเกิด${dayData.name.split(' ')[0]}`, 540, 180);
    ctx.font = '36px "Sarabun"'; ctx.fillText(dateThai, 540, 250);
    
    ctx.fillStyle = dayData.color; ctx.font = 'bold 40px "Sarabun"';
    wrapText(ctx, `"${mainDesc}"`, 540, 400, 900, 55);
    
    drawRoundedRect(ctx, 100, 580, 400, 300, 20, '#fff');
    ctx.fillStyle = dayData.color; ctx.fillRect(100, 580, 12, 300);
    ctx.font = 'bold 36px "Sarabun"'; ctx.textAlign = 'left'; ctx.fillText("💼 การงาน", 140, 640);
    ctx.fillStyle = '#555'; ctx.font = '36px "Sarabun"'; wrapText(ctx, workDesc, 140, 700, 330, 45);

    drawRoundedRect(ctx, 580, 580, 400, 300, 20, '#fff');
    ctx.fillStyle = dayData.color; ctx.fillRect(580, 580, 12, 300);
    ctx.font = 'bold 36px "Sarabun"'; ctx.textAlign = 'left'; ctx.fillText("💰 การเงิน", 620, 640);
    ctx.fillStyle = '#555'; ctx.font = '36px "Sarabun"'; wrapText(ctx, finDesc, 620, 700, 330, 45);
    
    ctx.fillStyle = '#888'; ctx.font = '28px "Sarabun"'; ctx.textAlign = 'center';
    ctx.fillText("ดูดวงแม่นๆ ที่ สยามโหรามงคล (Siamhora.com)", 540, 1020);
}

async function drawTarotCanvas(ctx, dateObj, dateThai) {
    const card = window.currentDrawnCard || tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const bgImg = new Image(); bgImg.src = 'assets/tarot_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.fillStyle = 'rgba(15, 10, 30, 0.4)'; ctx.fillRect(0, 0, 1080, 1080);
    drawRoundedRect(ctx, 50, 50, 980, 980, 30, 'rgba(0,0,0,0.6)', 'rgba(212,175,55,0.5)');
    
    ctx.textAlign = 'center'; ctx.fillStyle = '#d4af37'; ctx.font = 'bold 44px "Sarabun"';
    ctx.fillText("ไพ่ยิปซีประจำวัน", 540, 130);
    ctx.fillStyle = '#aaa'; ctx.font = '32px "Sarabun"'; ctx.fillText(dateThai, 540, 180);
    
    ctx.beginPath(); ctx.moveTo(340, 210); ctx.lineTo(740, 210);
    ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 2; ctx.stroke();
    
    if (card.img) {
        const cImg = new Image(); cImg.src = card.img; cImg.crossOrigin = "Anonymous";
        await new Promise(r => { cImg.onload=r; cImg.onerror=r; });
        ctx.save(); ctx.beginPath(); ctx.roundRect(435, 250, 210, 350, 15); ctx.clip();
        ctx.drawImage(cImg, 435, 250, 210, 350); ctx.restore();
        ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(435, 250, 210, 350);
    }
    
    ctx.fillStyle = '#fff'; ctx.font = 'bold 52px "Sarabun"';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
    ctx.fillText(card.name, 540, 660); ctx.shadowBlur = 0;
    
    // Dynamic text scaling
    const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
    let fontSize = 32;
    let lineH = 45;
    let startY = 720;
    
    if (combinedLength > 150) {
        fontSize = 28;
        lineH = 40;
    }
    if (combinedLength > 250) {
        fontSize = 24;
        lineH = 34;
    }
    if (combinedLength > 350) {
        fontSize = 22;
        lineH = 32;
    }
    
    ctx.font = `${fontSize}px "Sarabun"`; ctx.fillStyle = '#fff';
    const linesMeaning = wrapText(ctx, `"${card.meaning}"`, 540, startY, 900, lineH);
    const nextY = startY + (linesMeaning * lineH) + 15;
    
    ctx.fillStyle = '#d4af37'; ctx.fillText("คำแนะนำ:", 540, nextY);
    ctx.fillStyle = '#fff'; wrapText(ctx, card.future, 540, nextY + lineH, 900, lineH);
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '24px "Sarabun"';
    ctx.fillText("สยามโหรามงคล (Siamhora.com)", 540, 1000);
}

async function drawZodiacAllCanvas(ctx, dateObj, dateThai) {
    const bgImg = new Image(); bgImg.src = 'assets/zodiac_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.textAlign = 'center'; ctx.fillStyle = '#b8860b'; ctx.font = 'bold 54px "Sarabun"';
    drawStrokedText(ctx, "สรุปดวง 12 ราศี", 540, 100, '#b8860b', 'rgba(255,255,255,0.8)', 2);
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; drawRoundedRect(ctx, 390, 130, 300, 40, 20, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = '#333'; ctx.font = 'bold 28px "Sarabun"'; ctx.fillText(dateThai, 540, 160);
    
    const predictions = generateDailyZodiacFortunes(dateObj);
    let startX = 60, startY = 200, cardW = 310, cardH = 190, gap = 15;
    
    for (let i=0; i<12; i++) {
        const z = ZODIAC_LIST[i];
        const p = predictions.find(pr => pr.id == z.id) || { description: "มีสิ่งดีๆ รออยู่", good: "ดวงเปิดรับโชค" };
        const cx = startX + (i % 3) * (cardW + gap);
        const cy = startY + Math.floor(i / 3) * (cardH + gap);
        
        drawRoundedRect(ctx, cx, cy, cardW, cardH, 15, 'rgba(255,255,255,0.9)', '#d4af37');
        ctx.fillStyle = '#b8860b'; ctx.font = 'bold 26px "Sarabun"';
        ctx.fillText(z.name, cx + cardW/2, cy + 80);
        ctx.font = '32px sans-serif'; ctx.fillText(z.icon, cx + cardW/2, cy + 40);
        
        ctx.beginPath(); ctx.moveTo(cx+20, cy+95); ctx.lineTo(cx+cardW-20, cy+95);
        ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.stroke();
        
        ctx.fillStyle = '#2e7d32'; ctx.font = 'bold 16px "Sarabun"';
        const goodTxt = `✅ ${p.good}`.substring(0, 35);
        ctx.fillText(goodTxt, cx + cardW/2, cy + 120);
        
        ctx.fillStyle = '#666'; ctx.font = 'italic 16px "Sarabun"';
        const descTxt = `"${p.description}"`.substring(0, 45) + "...";
        wrapText(ctx, descTxt, cx + cardW/2, cy + 145, cardW - 30, 22);
    }
    
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '20px "Sarabun"';
    ctx.fillText("สยามโหรามงคล (Siamhora.com)", 540, 1040);
}

async function drawSevendaysAllCanvas(ctx, dateObj, dateThai) {
    const bgImg = new Image(); bgImg.src = 'assets/sevendays_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.textAlign = 'center'; ctx.fillStyle = '#333'; ctx.font = 'bold 54px "Sarabun"';
    drawStrokedText(ctx, "สรุปดวงคนเกิด 7 วัน", 540, 100, '#333', '#fff', 4);
    
    drawRoundedRect(ctx, 360, 130, 360, 40, 20, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = '#444'; ctx.font = 'bold 28px "Sarabun"'; ctx.fillText(dateThai, 540, 160);
    
    const baseM = ["งานราบรื่น เงินดี รักสดใส", "ระวังคำพูด งดเสี่ยงโชค", "มีผู้ใหญ่อุปถัมภ์ เงินเข้าเรื่อยๆ", "พักผ่อนบ้าง งานหนักเงินดี", "โชคลาภเด่น งานมีอุปสรรคเล็กน้อย", "เดินทางไกลได้โชค", "ธุรกิจเจริญก้าวหน้า"];
    
    // Adjusted layout to fill the 1080x1080 canvas
    const boxH = 220;
    const layout = [
        {w: 460, x: 60, y: 230}, {w: 460, x: 560, y: 230}, 
        {w: 293, x: 60, y: 490}, {w: 293, x: 393, y: 490}, {w: 293, x: 726, y: 490}, 
        {w: 460, x: 60, y: 750}, {w: 460, x: 560, y: 750}
    ];
    
    for (let i=0; i<7; i++) {
        const d = SEVEN_DAYS_LIST[i];
        const m = baseM[(dateObj.getDate() + i) % baseM.length];
        const box = layout[i];
        
        // Shadow and Base Box
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 20;
        drawRoundedRect(ctx, box.x, box.y, box.w, boxH, 20, 'rgba(255,255,255,0.95)');
        ctx.shadowBlur = 0;

        // Styling the box with a thick border and top colored section
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(box.x, box.y, box.w, boxH, 20);
        ctx.clip();
        
        // Soft background color block at the top
        ctx.fillStyle = d.bg || d.color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(box.x, box.y, box.w, 75);
        ctx.globalAlpha = 1.0;
        
        // Thick Border
        ctx.lineWidth = 8;
        ctx.strokeStyle = d.color;
        ctx.strokeRect(box.x, box.y, box.w, boxH);
        ctx.restore();

        // Title (Day Name)
        ctx.fillStyle = d.color; 
        ctx.font = 'bold 36px "Sarabun"';
        ctx.fillText(d.name.split(' ')[0], box.x + box.w/2, box.y + 50);

        // Decorative Line
        ctx.beginPath(); 
        ctx.moveTo(box.x + 30, box.y + 75); 
        ctx.lineTo(box.x + box.w - 30, box.y + 75);
        ctx.strokeStyle = d.color; 
        ctx.lineWidth = 2;
        ctx.stroke();

        // Description Text
        ctx.fillStyle = '#333'; 
        ctx.font = 'bold 24px "Sarabun"';
        wrapText(ctx, m, box.x + box.w/2, box.y + 125, box.w - 40, 36);
    }

    // Watermark at the bottom
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; 
    ctx.font = '22px "Sarabun"';
    ctx.fillText("สยามโหรามงคล (Siamhora.com)", 540, 1040);
}

async function drawThaiAscendantAllCanvas(ctx, dateObj, dateThai) {
    const bgImg = new Image(); bgImg.src = 'assets/zodiac_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.textAlign = 'center'; ctx.fillStyle = '#b8860b'; ctx.font = 'bold 54px "Sarabun"';
    drawStrokedText(ctx, "ทำนายดวง 12 ลัคนาราศี", 540, 100, '#b8860b', 'rgba(255,255,255,0.8)', 2);
    
    drawRoundedRect(ctx, 390, 130, 300, 40, 20, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = '#333'; ctx.font = 'bold 28px "Sarabun"'; ctx.fillText(dateThai, 540, 160);
    
    const asc = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
    const tm = ["ดาวพฤหัสบดีส่งผลดี โชคลาภเข้ามาต่อเนื่อง", "ราหูเล็ง ระวังเรื่องเอกสารและสัญญา", "ดาวศุกร์เด่น ความรักและโชคลาภการเงินดีมาก", "ดาวเสาร์ทับ ล่าช้าแต่สุดท้ายจะมั่นคง", "ดาวอังคารให้คุณ แข่งขันชนะ ได้รับการยอมรับ", "ดาวพุธกุมลัคนา เจรจาค้าขายเป็นเลิศ", "ดาวอาทิตย์ร่วม สมหวังเรื่องเลื่อนขั้นเลื่อนตำแหน่ง", "ระวังปัญหาสุขภาพ และอุบัติเหตุเล็กน้อย", "ดาวมฤตยูเคลื่อน การเปลี่ยนแปลงครั้งใหญ่กำลังมา", "ผู้ใหญ่อุปถัมภ์ค้ำชู ได้ของมีค่า"];
    
    let startX = 60, startY = 200, cardW = 310, cardH = 190, gap = 15;
    for (let i=0; i<12; i++) {
        const m = tm[(dateObj.getMonth() + dateObj.getDate() + i) % tm.length];
        const cx = startX + (i % 3) * (cardW + gap);
        const cy = startY + Math.floor(i / 3) * (cardH + gap);
        
        drawRoundedRect(ctx, cx, cy, cardW, cardH, 15, 'rgba(255,255,255,0.9)', '#d4af37');
        ctx.fillStyle = '#b8860b'; ctx.font = 'bold 26px "Sarabun"';
        ctx.fillText(`ลัคนาราศี${asc[i]}`, cx + cardW/2, cy + 60);
        ctx.beginPath(); ctx.moveTo(cx+20, cy+80); ctx.lineTo(cx+cardW-20, cy+80);
        ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.stroke();
        ctx.fillStyle = '#333'; ctx.font = '18px "Sarabun"';
        wrapText(ctx, m, cx + cardW/2, cy + 110, cardW - 30, 26);
    }
}

async function drawThaiAnimalAllCanvas(ctx, dateObj, dateThai) {
    const bgImg = new Image(); bgImg.src = 'assets/sevendays_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.textAlign = 'center'; ctx.fillStyle = '#333'; ctx.font = 'bold 54px "Sarabun"';
    drawStrokedText(ctx, "สรุปดวงคนเกิด 12 ปีนักษัตร", 540, 100, '#333', '#fff', 4);
    
    drawRoundedRect(ctx, 360, 130, 360, 40, 20, 'rgba(255,255,255,0.7)');
    ctx.fillStyle = '#444'; ctx.font = 'bold 28px "Sarabun"'; ctx.fillText(dateThai, 540, 160);
    
    const anm = ["ชวด 🐀", "ฉลู 🐂", "ขาล 🐅", "เถาะ 🐇", "มะโรง 🐉", "มะเส็ง 🐍", "มะเมีย 🐎", "มะแม 🐐", "วอก 🐒", "ระกา 🐓", "จอ 🐕", "กุน 🐖"];
    const baseM = ["งานราบรื่น เงินดี รักสดใส", "ระวังคำพูด งดเสี่ยงโชค", "มีผู้ใหญ่อุปถัมภ์ เงินเข้าเรื่อยๆ", "พักผ่อนบ้าง งานหนักเงินดี", "โชคลาภเด่น งานมีอุปสรรคเล็กน้อย", "เดินทางไกลได้โชค", "ธุรกิจเจริญก้าวหน้า", "สุขภาพแข็งแรง ศัตรูพ่ายแพ้"];
    
    let startX = 60, startY = 200, cardW = 310, cardH = 190, gap = 15;
    for (let i=0; i<12; i++) {
        const m = baseM[(dateObj.getFullYear() + dateObj.getDate() + i) % baseM.length];
        const cx = startX + (i % 3) * (cardW + gap);
        const cy = startY + Math.floor(i / 3) * (cardH + gap);
        
        drawRoundedRect(ctx, cx, cy, cardW, cardH, 15, 'rgba(255,255,255,0.9)', '#d4af37');
        ctx.fillStyle = '#d4af37'; ctx.font = 'bold 26px "Sarabun"';
        ctx.fillText(`ปี${anm[i]}`, cx + cardW/2, cy + 60);
        ctx.beginPath(); ctx.moveTo(cx+20, cy+80); ctx.lineTo(cx+cardW-20, cy+80);
        ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.stroke();
        ctx.fillStyle = '#333'; ctx.font = '20px "Sarabun"';
        wrapText(ctx, m, cx + cardW/2, cy + 120, cardW - 30, 30);
    }
}

async function generateAllCarouselDataUrls() {
    const category = document.getElementById('categorySelect').value;
    const dateStr = document.getElementById('dateSelect').value;
    
    if (!dateStr) {
        Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกวันที่', 'error');
        return;
    }
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'โปรดรอสักครู่ ระบบกำลังประมวลผล',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        const dateObj = new Date(dateStr);
        const dateThai = formatDateThai(dateObj);
        
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // โหลดภาพพื้นหลัง AI
        const bgImage = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn('Failed to load AI background image, using fallback gradient');
                resolve(null);
            };
            img.src = 'images/carousel_bg.png';
        });

        function drawSpaceBg() {
            if (bgImage) {
                ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
            } else {
                // Fallback gradient
                const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
                bgGrad.addColorStop(0, '#0f0c29');
                bgGrad.addColorStop(0.5, '#302b63');
                bgGrad.addColorStop(1, '#24243e');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            }

            // เพิ่มความมืดด้านบนและล่างเล็กน้อยเพื่อให้ตัวหนังสือชัดเจน
            const shadowGrad = ctx.createLinearGradient(0, 0, 0, 1080);
            shadowGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
            shadowGrad.addColorStop(0.2, 'rgba(0,0,0,0)');
            shadowGrad.addColorStop(0.8, 'rgba(0,0,0,0)');
            shadowGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = shadowGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 20px "Sarabun", sans-serif';
            ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1040, 1040);
        }

        function drawCard(x, y, w, h, icon, title, text, accentColor) {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            
            ctx.fillStyle = 'rgba(15, 15, 25, 0.75)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 20);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(212,175,55,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            if (accentColor) {
                ctx.fillStyle = accentColor;
                ctx.beginPath();
                ctx.roundRect(x, y, w, 8, [20, 20, 0, 0]);
                ctx.fill();
            }

            ctx.textAlign = 'left';
            ctx.font = 'bold 30px "Sarabun", sans-serif';
            ctx.fillStyle = '#d4af37';
            ctx.fillText(icon + ' ' + title, x + 30, y + 60);

            ctx.font = '24px "Sarabun", sans-serif';
            ctx.fillStyle = '#f0f0f0';
            if (typeof text === 'string') {
                wrapText(ctx, text, x + 30, y + 110, w - 60, 36);
            } else {
                let currentY = y + 110;
                text.forEach(item => {
                    ctx.font = 'bold 22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#d4af37';
                    ctx.fillText(item.label, x + 30, currentY);
                    
                    ctx.font = '22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#e0e0e0';
                    wrapText(ctx, item.val, x + 100, currentY, w - 130, 32);
                    currentY += 45;
                });
            }
        }

        let images = [];
        for (let i = 0; i < 9; i++) {
            Swal.update({ html: 'เรนเดอร์ภาพ ' + (i+1) + ' / 9' });
            await new Promise(r => setTimeout(r, 50));
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawSpaceBg();

            if (i === 0) { 
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 15;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath();
                ctx.roundRect(140, 250, 800, 550, 30);
                ctx.fill();
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.strokeStyle = 'rgba(212,175,55,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(155, 265, 770, 520, 20); ctx.stroke();

                ctx.textAlign = 'center';
                ctx.font = 'bold 80px "Sarabun", sans-serif';
                ctx.fillStyle = '#d4af37';
                ctx.fillText('ดวงรายวัน', 540, 390);
                
                ctx.font = 'bold 50px "Sarabun", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('แม่นๆ มาแล้วจ้า!', 540, 480);
                
                ctx.fillStyle = 'rgba(212,175,55,0.15)';
                ctx.beginPath(); ctx.roundRect(240, 540, 600, 70, 35); ctx.fill();
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.stroke();
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px "Sarabun", sans-serif';
                ctx.fillText('ประจำวัน' + dayNameStr + 'ที่ ' + dateTitle, 540, 587);
                
                ctx.font = '32px "Sarabun", sans-serif';
                ctx.fillStyle = '#d4af37';
                ctx.fillText('เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!', 540, 700);
                
                const btnGrad = ctx.createLinearGradient(140, 0, 940, 0);
                btnGrad.addColorStop(0, '#b8860b');
                btnGrad.addColorStop(1, '#f1c40f');
                
                ctx.shadowColor = 'rgba(241,196,15,0.4)';
                ctx.shadowBlur = 25;
                ctx.fillStyle = btnGrad;
                ctx.beginPath(); ctx.roundRect(140, 850, 800, 80, 40); ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉', 540, 898);

            } else if (i === 1) {
                ctx.textAlign = 'center';
                ctx.font = 'bold 46px "Sarabun", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?', 540, 150);
                
                let badDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.ubart] : 'วันอาทิตย์';
                let bestDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.thongChai] : 'วันจันทร์';
                let powerDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.athibadi] : 'วันเสาร์';

                const panels = [
                    {x: 70, color: '#ff4757', t1: badDayTxt, t2: "เกณฑ์ 'อุบาทว์'", desc: 'ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี', icon: '⚠️'},
                    {x: 390, color: '#2ed573', t1: bestDayTxt, t2: "เกณฑ์ 'วันธงชัย'", desc: 'ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง', icon: '🚩'},
                    {x: 710, color: '#9b59b6', t1: powerDayTxt, t2: "เกณฑ์ 'วันอธิบดี'", desc: 'ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ', icon: '👑'}
                ];

                panels.forEach(p => {
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = 'rgba(15,15,25,0.8)';
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 520, 25); ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
                    ctx.shadowColor = 'transparent';
                    
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 8, [25, 25, 0, 0]); ctx.fill();

                    ctx.fillStyle = 'rgba(255,255,255,0.05)';
                    ctx.beginPath(); ctx.arc(p.x + 150, 360, 60, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = p.color; ctx.lineWidth = 4; ctx.stroke();
                    ctx.font = '50px sans-serif';
                    ctx.fillText(p.icon, p.x + 150, 375);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 30px "Sarabun", sans-serif';
                    ctx.fillText(p.t1, p.x + 150, 480);
                    
                    ctx.fillStyle = p.color;
                    ctx.font = 'bold 26px "Sarabun", sans-serif';
                    ctx.fillText(p.t2, p.x + 150, 530);
                    
                    ctx.fillStyle = '#dcdde1';
                    ctx.font = '22px "Sarabun", sans-serif';
                    wrapText(ctx, p.desc, p.x + 150, 600, 240, 32);
                });

            } else {
                const dayIdx = i - 2;
                const seed = dateSeedBase + dayIdx;
                
                const dbWork = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.work) ? DAILY_FORTUNE_DB.work : DEFAULT_DAILY_FORTUNE_DB.work;
                const dbFinance = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.finance) ? DAILY_FORTUNE_DB.finance : DEFAULT_DAILY_FORTUNE_DB.finance;
                const dbLove = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.love) ? DAILY_FORTUNE_DB.love : DEFAULT_DAILY_FORTUNE_DB.love;

                let wText = getRandomFromDB(dbWork, seed + 1);
                let fText = getRandomFromDB(dbFinance, seed + 2);
                let rawLove = getRandomFromDB(dbLove, seed + 3);
                
                let lText = 'เสน่ห์แรง มีคนเข้ามาให้ความสนใจ';
                let coupleText = 'ความรักราบรื่น ดูแลเอาใจใส่กันดี';
                if (rawLove.includes('คนมีคู่:')) {
                    let parts = rawLove.split('คนมีคู่:');
                    lText = parts[0].replace('คนโสด:', '').trim();
                    coupleText = parts[1].trim();
                }
                wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
                fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
                lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);
                coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);

                let dColor = CF_DAY_COLORS[dayIdx];
                if (dColor === '#000000') dColor = '#7f8c8d';
                
                const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
                let colorStr = '-';
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                ctx.shadowColor = 'rgba(0,0,0,0.4)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath(); ctx.roundRect(290, 80, 500, 80, 40); ctx.fill();
                ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.beginPath(); ctx.arc(340, 120, 20, 0, Math.PI*2); ctx.fillStyle = dColor; ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 44px "Sarabun", sans-serif';
                ctx.fillText('คนเกิดวัน' + CF_DAY_NAMES[dayIdx], 380, 133);

                drawCard(90, 210, 900, 170, '💼', 'การงาน', wText, dColor);
                drawCard(90, 410, 900, 170, '💰', 'การเงิน', fText, dColor);
                
                const loveData = [
                    { label: 'โสด:', val: lText },
                    { label: 'มีคู่:', val: coupleText }
                ];
                drawCard(90, 610, 900, 200, '❤️', 'ความรัก', loveData, dColor);

                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath(); ctx.roundRect(90, 850, 900, 90, 25); ctx.fill();
                ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = dColor;
                ctx.font = 'bold 26px "Sarabun", sans-serif';
                ctx.fillText('✨ ทริคเสริมดวง', 130, 905);
                
                ctx.fillStyle = '#dcdde1';
                ctx.font = '24px "Sarabun", sans-serif';
                ctx.fillText('เลขมงคล: ' + luckyNum, 360, 905);
                ctx.fillText('สีมงคล: ' + colorStr, 600, 905);
            }

            images.push(canvas.toDataURL('image/png', 0.8));
        }
        
        Swal.close();
        return images;
    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');
        return null;
    }
}


function renderCarouselPreview() {
    const area = document.getElementById('cfPreviewWrapper');
    if (!area) return;

    const dateStr = document.getElementById('cfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = CF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dateTitle = dateObj.toLocaleDateString('th-TH', options);

    let kala = null;
    if (typeof calculateKalaYok === 'function') {
        kala = calculateKalaYok(dateObj);
    }
    
    const dateSeedBase = parseInt(dateStr.replace(/-/g, ''));
    function seededRandom(seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function getRandomFromDB(arr, seed) {
        if (!arr || arr.length === 0) return "-";
        const idx = Math.floor(seededRandom(seed) * arr.length);
        return arr[idx];
    }

    // CSS สำหรับ Background อวกาศโทนเข้ม ยิ่งใหญ่ หรูหราทรงคุณค่า
    const spaceBg = `
        background: radial-gradient(circle at 50% 25%, #25124b 0%, #110a29 55%, #06030e 100%);
    `;
    
    // CSS สำหรับวงแหวนดาราศาสตร์เรืองแสงทอง
    const astroRings = `
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:720px; height:720px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.18); box-shadow:0 0 40px rgba(212,175,55,0.08); box-sizing:border-box;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:960px; height:960px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.12); box-sizing:border-box;"></div>
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:12px solid rgba(212,175,55,0.15); box-sizing:border-box; pointer-events:none;"></div>
        <div style="position:absolute; top:25px; left:25px; right:25px; bottom:25px; border:2px solid rgba(212,175,55,0.3); box-sizing:border-box; pointer-events:none;"></div>
    `;

    // 1. หน้าปก (Cover)
    let slidesHtml = `
        <div class="cf-slide" id="cf-slide-0" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
            ${astroRings}
            <div style="position:absolute; bottom:25px; right:35px; font-size:20px; color:rgba(212,175,55,0.6); font-weight:bold; letter-spacing:1px;">🔮 สยามโหรามงคล (Siamhora.com)</div>
            
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:860px; height:600px; background:rgba(18,14,35,0.88); border-radius:35px; box-shadow:0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.25); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:50px; border:3px solid #d4af37;">
                <div style="background:linear-gradient(135deg, #d4af37, #fff3a8, #aa7c11); padding:6px 30px; border-radius:20px; margin-bottom:20px; box-shadow:0 4px 15px rgba(212,175,55,0.4);">
                    <span style="color:#0f0c29; font-size:22px; font-weight:bold; letter-spacing:2px;">✨ มหาจักรพรรดิพยากรณ์ • สยามโหรามงคล ✨</span>
                </div>
                
                <h1 style="color:#d4af37; font-size:90px; font-weight:900; margin-bottom:10px; text-align:center; text-shadow:0 0 35px rgba(212,175,55,0.8), 0 0 70px rgba(212,175,55,0.3); font-family:'Sarabun', sans-serif;">
                    ดวงชะตาประจำวัน
                </h1>
                <h2 style="color:#ffffff; font-size:48px; font-weight:bold; margin-top:0; text-shadow:0 2px 10px rgba(0,0,0,0.8);">วิเคราะห์ลึกซึ้ง คนเกิดทั้ง 7 วัน</h2>
                
                <div style="background:rgba(212,175,55,0.12); border-radius:40px; border:2px solid #d4af37; padding:18px 55px; margin:25px 0; box-shadow:0 0 20px rgba(212,175,55,0.2);">
                    <span style="color:#fff; font-size:32px; font-weight:bold; text-shadow:0 0 10px rgba(255,255,255,0.5);">ประจำวัน${dayNameStr}ที่ ${dateTitle}</span>
                </div>
                
                <h3 style="color:#e0e0e0; font-size:28px; margin-top:10px; opacity:0.9;">เช็คดวงการงาน การเงิน ความรัก และทริคเสริมดวงก่อนเริ่มวันใหม่!</h3>
            </div>
            
            <div style="position:absolute; bottom:130px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg, #aa7c11, #f1c40f, #aa7c11); padding:22px 65px; border-radius:50px; box-shadow:0 12px 30px rgba(241,196,15,0.5); border:2px solid #fff;">
                <span style="color:#000; font-size:26px; font-weight:bold; letter-spacing:0.5px;">🔮 ปัดไปทางซ้าย เพื่อดูดวงประจำวันเกิดของคุณ 👉</span>
            </div>
        </div>
    `;

    // 2. สไลด์กาลโยค (KalaYok 3 Pillars)
    let badDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.ubart]}` : 'วันอาทิตย์';
    let bestDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.thongChai]}` : 'วันจันทร์';
    let powerDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.athibadi]}` : 'วันเสาร์';

    slidesHtml += `
        <div class="cf-slide" id="cf-slide-1" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
            ${astroRings}
            <div style="position:absolute; bottom:25px; right:35px; font-size:20px; color:rgba(212,175,55,0.6); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora.com)</div>
            
            <div style="position:absolute; top:90px; left:0; width:100%; text-align:center;">
                <div style="display:inline-block; background:rgba(212,175,55,0.15); border:1px solid #d4af37; padding:6px 25px; border-radius:20px; color:#d4af37; font-size:20px; font-weight:bold; margin-bottom:10px;">
                    ✨ ปฏิทินกาลโยคมหาทักษาประจำวัน
                </div>
                <h2 style="color:#ffffff; font-size:50px; font-weight:bold; text-shadow:0 0 20px rgba(255,255,255,0.3); margin:0;">
                    อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?
                </h2>
            </div>

            <!-- เสาที่ 1: วันอุบาทว์ -->
            <div style="position:absolute; top:250px; left:60px; width:310px; height:580px; background:rgba(22,14,35,0.85); border:2px solid #ff4757; border-radius:30px; box-shadow:0 15px 35px rgba(255,71,87,0.3); display:flex; flex-direction:column; align-items:center; overflow:hidden;">
                <div style="width:100%; height:12px; background:linear-gradient(90deg, #ff4757, #ff6b81);"></div>
                <div style="width:130px; height:130px; border-radius:50%; border:4px solid #ff4757; background:rgba(255,71,87,0.1); display:flex; justify-content:center; align-items:center; margin-top:25px; font-size:55px; box-shadow:0 0 20px rgba(255,71,87,0.4);">⚠️</div>
                <h3 style="color:#ffffff; font-size:34px; font-weight:bold; margin:20px 0 5px 0;">${badDayTxt}</h3>
                <div style="background:#ff4757; color:#fff; padding:6px 20px; border-radius:15px; font-size:22px; font-weight:bold; margin-bottom:20px;">เกณฑ์ 'อุบาทว์'</div>
                <p style="color:#e0e0e0; font-size:23px; text-align:center; padding:0 25px; line-height:1.6;">ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์และสติให้ดี</p>
            </div>

            <!-- เสาที่ 2: วันธงชัย -->
            <div style="position:absolute; top:250px; left:385px; width:310px; height:580px; background:rgba(22,14,35,0.85); border:2px solid #2ed573; border-radius:30px; box-shadow:0 15px 35px rgba(46,213,115,0.3); display:flex; flex-direction:column; align-items:center; overflow:hidden;">
                <div style="width:100%; height:12px; background:linear-gradient(90deg, #2ed573, #7bed9f);"></div>
                <div style="width:130px; height:130px; border-radius:50%; border:4px solid #2ed573; background:rgba(46,213,115,0.1); display:flex; justify-content:center; align-items:center; margin-top:25px; font-size:55px; box-shadow:0 0 20px rgba(46,213,115,0.4);">🚩</div>
                <h3 style="color:#ffffff; font-size:34px; font-weight:bold; margin:20px 0 5px 0;">${bestDayTxt}</h3>
                <div style="background:#2ed573; color:#000; padding:6px 20px; border-radius:15px; font-size:22px; font-weight:bold; margin-bottom:20px;">เกณฑ์ 'วันธงชัย'</div>
                <p style="color:#e0e0e0; font-size:23px; text-align:center; padding:0 25px; line-height:1.6;">ดวงแข็งเป็นพิเศษ! ทำการใหญ่ เจรจาค้าขาย มีโอกาสสำเร็จสูงมาก</p>
            </div>

            <!-- เสาที่ 3: วันอธิบดี -->
            <div style="position:absolute; top:250px; left:710px; width:310px; height:580px; background:rgba(22,14,35,0.85); border:2px solid #9b59b6; border-radius:30px; box-shadow:0 15px 35px rgba(155,89,182,0.3); display:flex; flex-direction:column; align-items:center; overflow:hidden;">
                <div style="width:100%; height:12px; background:linear-gradient(90deg, #9b59b6, #be2edd);"></div>
                <div style="width:130px; height:130px; border-radius:50%; border:4px solid #9b59b6; background:rgba(155,89,182,0.1); display:flex; justify-content:center; align-items:center; margin-top:25px; font-size:55px; box-shadow:0 0 20px rgba(155,89,182,0.4);">👑</div>
                <h3 style="color:#ffffff; font-size:34px; font-weight:bold; margin:20px 0 5px 0;">${powerDayTxt}</h3>
                <div style="background:#9b59b6; color:#fff; padding:6px 20px; border-radius:15px; font-size:22px; font-weight:bold; margin-bottom:20px;">เกณฑ์ 'วันอธิบดี'</div>
                <p style="color:#e0e0e0; font-size:23px; text-align:center; padding:0 25px; line-height:1.6;">ดวงมีบารมีเป็นใหญ่ ผู้คนเกรงใจ ให้เกียรติ และพร้อมช่วยเหลือ</p>
            </div>

            <div style="position:absolute; bottom:110px; left:50%; transform:translateX(-50%); background:rgba(212,175,55,0.15); border:1.5px solid #d4af37; padding:15px 50px; border-radius:30px; text-align:center;">
                <span style="color:#d4af37; font-size:24px; font-weight:bold;">เลื่อนสไลด์ต่อไป เพื่ออ่านดวงเจาะลึกคนเกิดทั้ง 7 วัน 👉</span>
            </div>
        </div>
    `;

    // 3. ดวง 7 วัน (7 Slides)
    const DAY_GRADIENTS = [
        'linear-gradient(135deg, #ff4e50, #f9d423)', // Sunday Red/Gold
        'linear-gradient(135deg, #f1c40f, #f39c12)', // Monday Yellow
        'linear-gradient(135deg, #ff758c, #ff7eb3)', // Tuesday Pink
        'linear-gradient(135deg, #11998e, #38ef7d)', // Wednesday Green
        'linear-gradient(135deg, #ff9966, #ff5e62)', // Thursday Orange
        'linear-gradient(135deg, #3a7bd5, #3a6073)', // Friday Blue
        'linear-gradient(135deg, #8e2de2, #4a00e0)'  // Saturday Purple
    ];

    for (let i = 0; i < 7; i++) {
        const seed = dateSeedBase + i;
        
        const dbWork = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.work) ? DAILY_FORTUNE_DB.work : DEFAULT_DAILY_FORTUNE_DB.work;
        const dbFinance = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.finance) ? DAILY_FORTUNE_DB.finance : DEFAULT_DAILY_FORTUNE_DB.finance;
        const dbLove = (typeof DAILY_FORTUNE_DB !== 'undefined' && DAILY_FORTUNE_DB.love) ? DAILY_FORTUNE_DB.love : DEFAULT_DAILY_FORTUNE_DB.love;

        let wText = getRandomFromDB(dbWork, seed + 1);
        let fText = getRandomFromDB(dbFinance, seed + 2);
        let rawLove = getRandomFromDB(dbLove, seed + 3);
        
        let lText = 'เสน่ห์แรง มีคนเข้ามาให้ความสนใจ';
        let coupleText = 'ความรักราบรื่น ดูแลเอาใจใส่กันดี';
        if (rawLove.includes('คนมีคู่:')) {
            let parts = rawLove.split('คนมีคู่:');
            lText = parts[0].replace('คนโสด:', '').trim();
            coupleText = parts[1].trim();
        }
        wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
        fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
        lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);
        coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);

        let dColor = CF_DAY_COLORS[i];
        if (dColor === '#000000') dColor = '#7f8c8d';
        const dayGrad = DAY_GRADIENTS[i];

        const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
        const defaultColorsMap = {
            'อาทิตย์': 'แดง, ชมพู, ทอง',
            'จันทร์': 'เหลือง, เขียว, ขาว',
            'อังคาร': 'ชมพู, ม่วง, แดง',
            'พุธ': 'เขียว, ส้ม, เทา',
            'พฤหัสบดี': 'ส้ม, แดง, ฟ้า',
            'ศุกร์': 'ฟ้า, ชมพู, ขาว',
            'เสาร์': 'ม่วง, น้ำเงิน, ดำ'
        };
        let colorStr = defaultColorsMap[CF_DAY_NAMES[i]] || 'แดง, ทอง';
        if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[i]]) {
            const colors = DASH_DAY_COLORS[CF_DAY_NAMES[i]].colors;
            if(colors && colors.length > 0) colorStr = colors.join(', ');
        }

        slidesHtml += `
            <div class="cf-slide" id="cf-slide-${i+2}" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
                ${astroRings}
                <div style="position:absolute; bottom:25px; right:35px; font-size:20px; color:rgba(212,175,55,0.6); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora.com)</div>
                
                <!-- หัวข้อประจำวัน -->
                <div style="position:absolute; top:75px; left:50%; transform:translateX(-50%); width:600px; height:90px; background:rgba(18,14,35,0.9); border:2px solid #d4af37; border-radius:50px; box-shadow:0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; padding:0 30px;">
                    <div style="width:45px; height:45px; border-radius:50%; background:${dayGrad}; margin-right:20px; box-shadow:0 0 15px ${dColor}; flex-shrink:0;"></div>
                    <h2 style="color:#ffffff; font-size:46px; font-weight:bold; margin:0; text-shadow:0 0 15px rgba(255,255,255,0.4);">คนเกิดวัน${CF_DAY_NAMES[i]}</h2>
                </div>

                <!-- การงาน -->
                <div style="position:absolute; top:200px; left:80px; width:920px; height:185px; background:rgba(18,14,35,0.85); border:2px solid rgba(212,175,55,0.4); border-radius:24px; box-shadow:0 15px 30px rgba(0,0,0,0.6); overflow:hidden;">
                    <div style="width:12px; height:100%; background:${dayGrad}; position:absolute; left:0; top:0;"></div>
                    <div style="padding: 25px 30px 25px 45px;">
                        <div style="color:#d4af37; font-size:32px; font-weight:bold; margin-bottom:12px; display:flex; align-items:center;">
                            <span style="margin-right:12px;">💼</span> การงานและการดำเนินชีวิต
                        </div>
                        <div style="color:#f0f0f0; font-size:25px; line-height:1.5;">${wText}</div>
                    </div>
                </div>

                <!-- การเงิน -->
                <div style="position:absolute; top:410px; left:80px; width:920px; height:185px; background:rgba(18,14,35,0.85); border:2px solid rgba(212,175,55,0.4); border-radius:24px; box-shadow:0 15px 30px rgba(0,0,0,0.6); overflow:hidden;">
                    <div style="width:12px; height:100%; background:${dayGrad}; position:absolute; left:0; top:0;"></div>
                    <div style="padding: 25px 30px 25px 45px;">
                        <div style="color:#d4af37; font-size:32px; font-weight:bold; margin-bottom:12px; display:flex; align-items:center;">
                            <span style="margin-right:12px;">💰</span> การเงินและโชคลาภ
                        </div>
                        <div style="color:#f0f0f0; font-size:25px; line-height:1.5;">${fText}</div>
                    </div>
                </div>

                <!-- ความรัก -->
                <div style="position:absolute; top:620px; left:80px; width:920px; height:210px; background:rgba(18,14,35,0.85); border:2px solid rgba(212,175,55,0.4); border-radius:24px; box-shadow:0 15px 30px rgba(0,0,0,0.6); overflow:hidden;">
                    <div style="width:12px; height:100%; background:${dayGrad}; position:absolute; left:0; top:0;"></div>
                    <div style="padding: 25px 30px 25px 45px;">
                        <div style="color:#d4af37; font-size:32px; font-weight:bold; margin-bottom:12px; display:flex; align-items:center;">
                            <span style="margin-right:12px;">❤️</span> ความรักและความสัมพันธ์
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div><span style="color:#ff79c6; font-size:24px; font-weight:bold;">• คนโสด:</span> <span style="color:#e0e0e0; font-size:24px;">${lText}</span></div>
                            <div><span style="color:#ffb86c; font-size:24px; font-weight:bold;">• คนมีคู่:</span> <span style="color:#e0e0e0; font-size:24px;">${coupleText}</span></div>
                        </div>
                    </div>
                </div>

                <!-- ทริคเสริมดวง -->
                <div style="position:absolute; top:855px; left:80px; width:920px; height:100px; background:rgba(18,14,35,0.92); border:2px solid #d4af37; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.2); display:flex; align-items:center; padding:0 45px; justify-content:space-between;">
                    <div style="color:#d4af37; font-size:28px; font-weight:bold; display:flex; align-items:center;">
                        <span style="margin-right:10px;">✨</span> ทริคเสริมดวงประจำวัน
                    </div>
                    <div style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; padding:8px 25px; border-radius:20px; color:#ffffff; font-size:24px; font-weight:bold;">
                        เลขมงคล: <span style="color:#f1c40f;">${luckyNum}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); padding:8px 25px; border-radius:20px; color:#ffffff; font-size:24px; font-weight:bold;">
                        สีมงคล: <span style="color:#54a0ff;">${colorStr}</span>
                    </div>
                </div>
            </div>
        `;
    }

    area.innerHTML = slidesHtml;
    const containerWidth = area.parentElement.clientWidth;
    const scale = (containerWidth - 20) / 1080;
    const slides = document.querySelectorAll('.cf-slide');
    slides.forEach(s => {
        s.style.transform = `scale(${scale})`;
        s.style.transformOrigin = 'top left';
        s.style.marginBottom = `-${1080 * (1 - scale) - 20}px`;
    });
}


async function postCarouselToFacebook() {
    try {
        const images = await generateAllCarouselDataUrls();
        if (!images || images.length === 0) return;
        
        const dateStr = document.getElementById('cfDate').value;
        const dateObj = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateThai = dateObj.toLocaleDateString('th-TH', options);

        const msg = `🔮 มหาจักรพรรดิพยากรณ์ • ดวงรายวันประจำวัน${dateThai} 🌟\n\nอัปเดตดวงชะตาชีวิตคนเกิดทั้ง 7 วัน และเกณฑ์กาลโยคมหาทักษาประจำวัน! มาเช็คกันด่วนๆ ว่าวันเกิดของคุณวันนี้จะดวงพุ่งปังขนาดไหน 💼💰❤️\n\nปัดสไลด์ไปทางซ้ายเพื่ออ่านคำทำนายเจาะลึกวันเกิดของคุณได้เลยครับ 👇\n\nอย่าลืมพิมพ์ "สาธุ" และกดแชร์เพื่อเปิดดวงรับโชคใหญ่วันนี้นะครับ 🙏✨\n\n#สยามโหรามงคล #ดูดวง #ดวงรายวัน #ดวงวันนี้ #ดวงคนเกิด7วัน #กาลโยค #เลขมงคล`;
        
        let imagesHtml = '';
        images.forEach((img) => {
            imagesHtml += `<img src="${img}" style="width: 48%; margin: 1%; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.3); display: inline-block;">`;
        });
        
        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์อัลบั้ม',
                        html: `
                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Siam&background=4F46E5&color=fff" style="width: 100%; height: 100%;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                        </div>
                    </div>
                    <div style="padding: 4px 16px 16px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${msg}</div>
                    <div style="max-height: 300px; overflow-y: auto; text-align: center; border-top: 1px solid #eee; background: #f0f2f5; padding: 5px;">
                        ${imagesHtml}
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม (Optional)</h4>
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (ถ้ามี):</label>
                    <input type="datetime-local" id="swalScheduleTime" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">เช็คอินสถานที่ (รหัส Place ID):</label>
                    <input type="text" id="swalPlaceId" placeholder="เช่น 108398189188044 (Bangkok)" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์อัลบั้ม',
            cancelButtonText: 'ยกเลิก',
            background: '#1e1e1e',
            color: '#fff',
            width: '600px',
            preConfirm: () => {
                return {
                    scheduleTime: document.getElementById('swalScheduleTime') ? document.getElementById('swalScheduleTime').value : '',
                    placeId: document.getElementById('swalPlaceId') ? document.getElementById('swalPlaceId').value.trim() : ''
                };
            }
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        let scheduledPublishTime = null;
        if (confirmResult.value && confirmResult.value.scheduleTime) {
            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
        }
        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

        Swal.fire({
            title: 'กำลังอัปโหลดโพสต์อัลบั้มลงเพจ...',
            text: 'กรุณารอสักครู่...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post-multi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, images: images , scheduledPublishTime: scheduledPublishTime, place: place })
        });
        
        const data = await res.json();
        if (data.success) {
            Swal.fire('สำเร็จ!', 'โพสต์ลงเพจ Facebook เรียบร้อยแล้ว', 'success');
        } else {
            Swal.fire('ข้อผิดพลาด', data.error || 'ไม่สามารถโพสต์ได้', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message, 'error');
    }
}

async function downloadCarouselImages() {
    const images = await generateAllCarouselDataUrls();
    if (!images || images.length === 0) return;
    
    images.forEach((dataUrl, idx) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `carousel_image_${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}



// -----------------------------------------------------
// NATIVE SINGLE CANVAS GENERATOR
// -----------------------------------------------------
async function generateSingleNativeCanvas() {
    const category = document.getElementById('categorySelect').value;
    const dateStr = document.getElementById('dateSelect').value;
    const targetId = document.getElementById('targetSelect').value;
    
    if (!dateStr) {
        throw new Error('กรุณาเลือกวันที่');
    }
    
    await document.fonts.ready;
    const dateObj = new Date(dateStr);
    const dateThai = formatDateThai(dateObj);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    const bgImage = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = 'images/carousel_bg.png';
    });
    
    function drawSpaceBg() {
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, 1080, 1080);
        } else {
            const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
            bgGrad.addColorStop(0, '#0f0c29');
            bgGrad.addColorStop(0.5, '#302b63');
            bgGrad.addColorStop(1, '#24243e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 1080, 1080);
        }

        const shadowGrad = ctx.createLinearGradient(0, 0, 0, 1080);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
        shadowGrad.addColorStop(0.2, 'rgba(0,0,0,0)');
        shadowGrad.addColorStop(0.8, 'rgba(0,0,0,0)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, 0, 1080, 1080);

        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 20px "Sarabun", sans-serif';
        ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1040, 1040);
    }
    
    if (category === 'zodiac') {
        if (typeof generateDailyZodiacFortunes !== 'function') throw new Error("ไม่พบฟังก์ชันดึงข้อมูล 12 ราศี");
        const predictions = generateDailyZodiacFortunes(dateObj);
        const pred = predictions.find(p => p.id == targetId);
        if (!pred) throw new Error("ไม่พบข้อมูลราศีที่เลือก");
        drawSpaceBg();
        await drawZodiacCanvas(ctx, dateObj, dateThai);
    } else if (category === 'sevendays') {
        drawSpaceBg();
        await drawSevendaysCanvas(ctx, dateObj, dateThai);
    } else if (category === 'tarot') {
        await drawTarotCanvas(ctx, dateObj, dateThai);
    } else if (category === 'zodiac_all') {
        await drawZodiacAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'sevendays_all') {
        await drawSevendaysAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'thai_ascendant_all') {
        await drawThaiAscendantAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'thai_animal_all') {
        await drawThaiAnimalAllCanvas(ctx, dateObj, dateThai);
    }
    
    return canvas;
}

async function downloadImage() {
    try {
        Swal.fire({
            title: 'กำลังสร้างรูปภาพ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        const canvas = await generateSingleNativeCanvas();
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        Swal.close();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `preview_image.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (err) {
        console.error(err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้: ' + err.message, 'error');
    }
}

async function postSingleToFacebook() {
    try {
        Swal.fire({
            title: 'กำลังสร้างรูปภาพ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        const canvas = await generateSingleNativeCanvas();
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        Swal.close();
        
        const dateVal = document.getElementById('dateSelect') ? document.getElementById('dateSelect').value : new Date().toISOString().split('T')[0];
        const dateObj = new Date(dateVal);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateThai = dateObj.toLocaleDateString('th-TH', options);

        const msg = `✨ พยากรณ์ดวงชะตาประจำวัน${dateThai} ✨\n\nพร้อมเสิร์ฟคำทำนายแม่นๆ ต้อนรับวันใหม่! มาเช็คดวงการงาน การเงิน ความรัก และเลขมงคลเสริมโชคของคุณวันนี้กันครับ 🔮💫\n\nกดปุ่ม ไลก์ & แชร์ เพื่อเป็นพลังบุญรับโชคลาภและความปังตลอดทั้งวันนะครับ 🙏\n\n#สยามโหรามงคล #ดูดวง #ดวงรายวัน #ดวงวันนี้ #เช็คดวง #เลขมงคล`;
        
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์ (ภาพเดียว)',
            html: `
                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Siam&background=4F46E5&color=fff" style="width: 100%; height: 100%;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                        </div>
                    </div>
                    <div style="padding: 4px 16px 16px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505;">${msg}</div>
                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
                </div>
                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม (Optional)</h4>
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (ถ้ามี):</label>
                    <input type="datetime-local" id="swalScheduleTime" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">เช็คอินสถานที่ (รหัส Place ID):</label>
                    <input type="text" id="swalPlaceId" placeholder="เช่น 108398189188044 (Bangkok)" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์',
            cancelButtonText: 'ยกเลิก',
            background: '#1e1e1e',
            color: '#fff',
            width: '600px',
            preConfirm: () => {
                return {
                    scheduleTime: document.getElementById('swalScheduleTime') ? document.getElementById('swalScheduleTime').value : '',
                    placeId: document.getElementById('swalPlaceId') ? document.getElementById('swalPlaceId').value.trim() : ''
                };
            }
        });

        if (!confirmResult.isConfirmed) return;

        let scheduledPublishTime = null;
        if (confirmResult.value && confirmResult.value.scheduleTime) {
            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
        }
        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

        Swal.fire({
            title: 'กำลังโพสต์ลงเพจ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, image: dataUrl , scheduledPublishTime: scheduledPublishTime, place: place })
        });
        
        const data = await res.json();
        if (data.success) {
            Swal.fire('สำเร็จ!', 'โพสต์ลงเพจ Facebook เรียบร้อยแล้ว', 'success');
        } else {
            Swal.fire('ข้อผิดพลาด', data.error || 'ไม่สามารถโพสต์ได้', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message, 'error');
    }
}

function generatePostText() {
    const category = document.getElementById('categorySelect').value;
    const dateVal = document.getElementById('dateSelect').value;
    const dateObj = new Date(dateVal);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateThai = dateObj.toLocaleDateString('th-TH', options);

    let title = "";
    let content = "";
    let hashtags = "#ดูดวง #ดวงวันนี้ #สยามโหรามงคล #ดูดวงแม่นๆ ";

    switch(category) {
        case 'zodiac':
            title = "✨ ดวงราศีประจำ" + dateThai + " ✨";
            content = "ดวงของคุณวันนี้จะเป็นอย่างไร? เช็คดวงด่วนๆ ได้ในภาพเลยครับ! 👇";
            hashtags += "#ดวงราศี #ราศี";
            break;
        case 'sevendays':
            title = "🌟 ดวงคนเกิด 7 วัน ประจำ" + dateThai + " 🌟";
            content = "คนเกิดวันไหนกำลังดวงขึ้น? เช็คดวงของคุณวันนี้ได้เลยครับ! 👇";
            hashtags += "#ดวงคนเกิด7วัน #ดวงรายวัน";
            break;
        case 'tarot':
            title = "🎴 ไพ่ยิปซีประจำ" + dateThai + " 🎴";
            content = "ไพ่ยิปซีบอกอะไรกับคุณบ้าง? มาดูคำทำนายจากไพ่กันครับ 👇";
            hashtags += "#ไพ่ยิปซี #ดูดวงไพ่ยิปซี";
            break;
        case 'zodiac_all':
            title = "✨ สรุปดวง 12 ราศี ประจำ" + dateThai + " ✨";
            content = "ดวงของคุณวันนี้จะเป็นอย่างไร? ราศีไหนมีเกณฑ์รับโชคใหญ่ หรือต้องระวังเรื่องอะไรเป็นพิเศษ \nเช็คดวงด่วนๆ ได้ในภาพเลยครับ! 👇";
            hashtags += "#ดวง12ราศี #ราศี";
            break;
        case 'sevendays_all':
            title = "🌟 สรุปดวงคนเกิด 7 วัน ประจำ" + dateThai + " 🌟";
            content = "คนเกิดวันไหนกำลังดวงขึ้น? วันไหนมีเกณฑ์รับโชค หรือต้องระวังเรื่องอะไรบ้าง \nเช็คดวงของคุณวันนี้ได้เลยครับ! 👇";
            hashtags += "#ดวงคนเกิด7วัน #ดวงรายวัน";
            break;
        case 'thai_ascendant_all':
            title = "🔮 สรุปดวง 12 ลัคนาราศี ประจำ" + dateThai + " 🔮";
            content = "ลัคนาราศีไหนจะดวงปังสุดๆ ในวันนี้? ใครมีเกณฑ์ได้ลาภก้อนโต \nเช็คดวงตามหลักโหราศาสตร์ไทยได้ที่นี่เลยครับ 👇";
            hashtags += "#ดวง12ลัคนา #โหราศาสตร์ไทย";
            break;
        case 'thai_animal_all':
            title = "🐲 สรุปดวง 12 ปีนักษัตร ประจำ" + dateThai + " 🐲";
            content = "ปีนักษัตรไหนกำลังจะรวย? ปีไหนมีเกณฑ์พ้นเคราะห์ \nเช็คดวงชะตาของแต่ละปีนักษัตรประจำวันนี้กันครับ 👇";
            hashtags += "#ดวง12ปีนักษัตร #ปีนักษัตร";
            break;
        default:
            title = "✨ สรุปดวงประจำ" + dateThai + " ✨";
            content = "เช็คดวงรายวันของคุณได้ในภาพเลยครับ! 👇";
            break;
    }

    const postText = `${title}\n\n${content}\n\nอย่าลืมกดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับความโชคดีกันนะครับ 🙏✨\n\n${hashtags}`;
    
    document.getElementById('postTextOutput').value = postText;
    document.getElementById('postTextContainer').style.display = 'block';
}

function copyPostText() {
    const text = document.getElementById('postTextOutput').value;
    if(!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'คัดลอกสำเร็จ!',
                text: 'นำไปโพสต์ได้เลยครับ',
                timer: 1500,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#fff'
            });
        } else {
            alert('คัดลอกข้อความสำเร็จ!');
        }
    });
}
