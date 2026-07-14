/**
 * adminAutoPost.js
 * จัดการการสร้างภาพดวงอัตโนมัติ (12 ราศี, 7 วัน, ไพ่ยิปซี) 
 */

const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const THAI_DAYS_LONG = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

const ZODIAC_LIST = [
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
        // 'tarot', 'zodiac_all', 'sevendays_all', 'thai_ascendant_all', 'thai_animal_all'
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
    
    // สุ่มไพ่จากวันที่ + Random
    const randomIdx = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[randomIdx];
    
    container.classList.add('template-tarot');
    
    // If no img URL is valid or available, we just use a styled div, but tarotCards should have img property
    const cardImgUrl = card.img || 'https://images.unsplash.com/photo-1638202513410-85f0967a149f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    container.innerHTML = `
        <div class="tarot-overlay"></div>
        <div class="tarot-content-wrapper">
            <div class="tarot-header">ไพ่ยิปซีประจำวัน<br><span style="font-size:32px; color:#aaa;">${dateThai}</span></div>
            
            <div class="tarot-card-img" style="background-image: url('${cardImgUrl}');">
                <!-- If image fails, show text fallback -->
                ${!card.img ? card.name : ''}
            </div>
            
            <h2 style="font-size: 52px; color: #fff; margin-bottom: 15px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">${card.name}</h2>
            
            <div class="tarot-meaning">
                "${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> ${card.future}
            </div>
            
            <div style="position: absolute; bottom: 30px; font-size: 24px; color: rgba(255,255,255,0.4);">
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

function downloadImage() {
    const captureArea = document.getElementById('captureArea');
    
    // Temporarily reset transform for clean render
    const origTransform = captureArea.style.transform;
    captureArea.style.transform = 'scale(1)';
    
    // Show loading
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'โปรดรอสักครู่ ระบบกำลังประมวลผล',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    html2canvas(captureArea, {
        scale: 2, // High quality
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        captureArea.style.transform = origTransform;
        
        const link = document.createElement('a');
        link.download = `siamhora_fortune_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        Swal.close();
    }).catch(err => {
        captureArea.style.transform = origTransform;
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้: ' + err.message, 'error');
    });
}

// ----------------------------------------------------
// ระบบสร้างข้อความโพสต์อัตโนมัติ (Generate Post Text)
// ----------------------------------------------------
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
        case 'zodiac_animal_all':
            title = "🐲 สรุปดวง 12 ปีนักษัตร ประจำ" + dateThai + " 🐲";
            content = "ปีนักษัตรไหนกำลังจะรวย? ปีไหนมีเกณฑ์พ้นเคราะห์ \nเช็คดวงชะตาของแต่ละปีนักษัตรประจำวันนี้กันครับ 👇";
            hashtags += "#ดวง12ปีนักษัตร #ปีนักษัตร";
            break;
        case 'thai_ascendant_all':
            title = "🔮 สรุปดวง 12 ลัคนาราศี ประจำ" + dateThai + " 🔮";
            content = "ลัคนาราศีไหนจะดวงปังสุดๆ ในวันนี้? ใครมีเกณฑ์ได้ลาภก้อนโต \nเช็คดวงตามหลักโหราศาสตร์ไทยได้ที่นี่เลยครับ 👇";
            hashtags += "#ดวง12ลัคนา #โหราศาสตร์ไทย";
            break;
        case 'daily_12zodiac':
            title = "🔮 ดวงรายวัน 12 ราศี ประจำ" + dateThai + " 🔮";
            content = "ดวงประจำวันของทั้ง 12 ราศีมาแล้วครับ เช็คดวงการงาน การเงิน ความรัก ได้เลย! 👇";
            hashtags += "#ดวง12ราศี";
            break;
        case 'tarot_daily':
            title = "🎴 ไพ่ยิปซีทำนายดวง ประจำ" + dateThai + " 🎴";
            content = "ไพ่ยิปซีประจำวันบอกอะไรกับคุณบ้าง? มาดูคำทำนายจากไพ่กันครับ 👇";
            hashtags += "#ไพ่ยิปซี #ดูดวงไพ่ยิปซี";
            break;
        case 'esiimsi_daily':
            title = "🏮 เซียมซีทำนายโชค ประจำ" + dateThai + " 🏮";
            content = "เซียมซีประจำวันนี้บอกอะไรเกี่ยวกับดวงชะตาของคุณ? มาอ่านคำทำนายกันครับ 👇";
            hashtags += "#เซียมซี #เสี่ยงทาย";
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
