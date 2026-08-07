"use strict";

/**
 * 🔮 ระบบสร้างภาพอินโฟกราฟิกคำทำนายรายวัน (Daily Horoscope Infographic System)
 * สยามโหรามงคล
 */

const THAI_MONTHS_FULL = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const THAI_MONTHS_SHORT = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

// ฐานข้อมูลสำหรับสุ่ม/คำนวณคำทำนาย
const INFOGRAPHIC_KNOWLEDGE = {
    workGood: [
        "โปรเจกต์ที่ทำอยู่สำเร็จเกินคาด", "เด่นเรื่องการเจรจาตกลงสัญญา", "ผู้ใหญ่สนับสนุนเห็นผลงานชัดเจน",
        "มีข่าวดีเรื่องการเลื่อนขั้น/งานใหม่", "แก้ปัญหาเฉพาะหน้าได้อย่างยอดเยี่ยม"
    ],
    wealthGood: [
        "มีเกณฑ์ได้ลาภลอยหรือโชคฟลุคๆ", "ได้เงินคืนจากลูกหนี้ที่รอมานาน", "การลงทุนเริ่มส่งผลกำไรชัดเจน",
        "ได้รับของขวัญหรือเงินพิเศษ", "ซื้อง่ายขายคล่องรับทรัพย์จัดเต็ม"
    ],
    caution: [
        "ระวังของหายหรือทรัพย์สินตกหล่น", "ระวังการสื่อสารผิดพลาดคลาดเคลื่อน", "ระวังการใช้จ่ายตามอารมณ์ชั่ววูบ",
        "ระวังอาการปวดหลัง/ออฟฟิศซินโดรม", "ระวังมีปากเสียงเรื่องเรื่องเล็กน้อย"
    ],
    loveSingle: [
        "มีลุ้นพบรักจากการทำงานหรือเพื่อนแนะนำ", "เสน่ห์แรงมีคนเข้ามาขายขนมจีบ", "คนรักเก่าอาจวนเวียนกลับมาทักทาย"
    ],
    loveCouple: [
        "ความรักหวานชื่น เข้าใจกันดี", "ควรระวังคำพูดเรื่องเล็กๆ น้อยๆ", "มีเกณฑ์ได้เดินทางท่องเที่ยวร่วมกัน"
    ],
    focusPoints: [
        "การเจรจา", "ข่าวดีเรื่องงาน", "ความอดทน", "ระวังของหาย", "จัดสรรเวลา", "ผู้ใหญ่หนุน",
        "งานสำเร็จ", "ลาภลอย", "คุมรายจ่าย", "ดูแลสุขภาพ", "วางแผนรอบคอบ"
    ],
    luckyColors: [
        { name: "เขียว", class: "green" },
        { name: "แดง", class: "red" },
        { name: "เหลือง", class: "yellow" },
        { name: "ส้ม", class: "orange" },
        { name: "ชมพู", class: "pink" },
        { name: "ฟ้า", class: "blue" },
        { name: "ม่วง", class: "purple" }
    ]
};

// Seeded Random Generator
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function getRandomItems(arr, count, seed) {
    let result = [];
    let clone = [...arr];
    for (let i = 0; i < count && clone.length > 0; i++) {
        let idx = Math.floor(seededRandom(seed + i) * clone.length);
        result.push(clone.splice(idx, 1)[0]);
    }
    return result;
}

// Adjust scale to fit 1920x1080 canvas inside workspace smoothly
function updateCanvasScale() {
    const previewArea = document.querySelector('.preview-area');
    const scaler = document.getElementById('canvasScaler');
    const canvas = document.getElementById('infographicCanvas');
    if (!previewArea || !scaler || !canvas) return;

    const availableWidth = previewArea.clientWidth - 30;
    const targetWidth = 1920;
    const targetHeight = 1080;
    
    let scale = availableWidth / targetWidth;
    if (scale > 1) scale = 1;
    if (scale < 0.2) scale = 0.2;

    scaler.style.width = `${targetWidth * scale}px`;
    scaler.style.height = `${targetHeight * scale}px`;

    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'top left';
}

// Changing date via prev/next buttons
window.changeDate = function(delta) {
    const dateInput = document.getElementById('predictDate');
    if (!dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
    
    let d = new Date(dateInput.value);
    d.setDate(d.getDate() + delta);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;

    generateDailyInfographic();
};

// Main generator function
window.generateDailyInfographic = function() {
    const dateInput = document.getElementById('predictDate');
    const toneSelect = document.getElementById('predictTone');

    if (!dateInput.value) return;

    const d = new Date(dateInput.value);
    const dayOfWeekIdx = d.getDay(); // 0 = Sunday, 6 = Saturday
    const dayName = THAI_DAYS[dayOfWeekIdx];
    const dateNum = d.getDate();
    const monthFull = THAI_MONTHS_FULL[d.getMonth()];
    const monthShort = THAI_MONTHS_SHORT[d.getMonth()];
    const yearBE = d.getFullYear() + 543;

    // Date strings
    const fullDateStr = `วัน${dayName}ที่ ${dateNum} ${monthFull} พ.ศ. ${yearBE}`;
    const shortDateStr = `วัน${dayName}ที่ ${dateNum} ${monthShort} ${yearBE}`;

    // Update Header Text
    const mainTitle = document.getElementById('canvasMainTitle');
    const subhead1 = document.getElementById('canvasSubhead1');

    if (mainTitle) mainTitle.innerText = `เปิดชะตาฟ้าลิขิต: ฟันธงดวงรายวันประจำ${shortDateStr}`;
    if (subhead1) subhead1.innerText = `สรุปคำทำนายดวงชะตามันเกิดทั้ง 7 วัน ประจำ${fullDateStr}`;

    // Base seed for deterministic prediction per date
    const dateSeed = parseInt(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`);

    const days7 = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
    
    // Pick days dynamically for predictions
    const workDays1 = getRandomItems(days7, 3, dateSeed + 1).join(" ");
    const workDay2 = getRandomItems(days7.filter(day => !workDays1.includes(day)), 1, dateSeed + 2)[0];
    const workHighlight1 = getRandomItems(INFOGRAPHIC_KNOWLEDGE.workGood, 1, dateSeed + 3)[0];
    const workHighlight2 = getRandomItems(INFOGRAPHIC_KNOWLEDGE.workGood, 1, dateSeed + 4)[0];
    
    const workDescEl = document.getElementById('workDesc');
    if (workDescEl) {
        workDescEl.innerText = `${workDays1} มีเกณฑ์${workHighlight1} ส่วน${workDay2}เด่นเรื่อง${workHighlight2}`;
    }

    // Wealth days
    const wealthDays = getRandomItems(days7, 4, dateSeed + 5).join(" ");
    const wealthHighlight = getRandomItems(INFOGRAPHIC_KNOWLEDGE.wealthGood, 1, dateSeed + 6)[0];
    const wealthDescEl = document.getElementById('wealthDesc');
    if (wealthDescEl) {
        wealthDescEl.innerText = `${wealthDays} มีเกณฑ์${wealthHighlight}`;
    }

    // Caution days
    const cautionDay1 = getRandomItems(days7, 1, dateSeed + 7)[0];
    const cautionDay2 = getRandomItems(days7.filter(d => d !== cautionDay1), 1, dateSeed + 8)[0];
    const cautionDay3 = getRandomItems(days7.filter(d => d !== cautionDay1 && d !== cautionDay2), 1, dateSeed + 9)[0];
    const cautionText1 = getRandomItems(INFOGRAPHIC_KNOWLEDGE.caution, 1, dateSeed + 10)[0];
    const cautionText2 = getRandomItems(INFOGRAPHIC_KNOWLEDGE.caution, 1, dateSeed + 11)[0];
    const cautionText3 = getRandomItems(INFOGRAPHIC_KNOWLEDGE.caution, 1, dateSeed + 12)[0];

    const cautionDescEl = document.getElementById('cautionDesc');
    if (cautionDescEl) {
        cautionDescEl.innerText = `${cautionDay1}${cautionText1} ${cautionDay2}${cautionText2} และ${cautionDay3}${cautionText3}`;
    }

    // Love status
    const loveSingleDays = getRandomItems(days7, 3, dateSeed + 13).join(" ");
    const loveCoupleDays = getRandomItems(days7, 2, dateSeed + 14).join(" ");
    const loveSingleText = getRandomItems(INFOGRAPHIC_KNOWLEDGE.loveSingle, 1, dateSeed + 15)[0];
    const loveCoupleText = getRandomItems(INFOGRAPHIC_KNOWLEDGE.loveCouple, 1, dateSeed + 16)[0];

    const loveDescEl = document.getElementById('loveDesc');
    if (loveDescEl) {
        loveDescEl.innerText = `คนโสด${loveSingleDays} ${loveSingleText} ส่วนคนมีคู่ควรระวังเรื่อง${loveCoupleText}ใน${loveCoupleDays}`;
    }

    // Table Data Generation (7 Individual Day Rows: อาทิตย์ -> เสาร์)
    const tableBody = document.getElementById('luckyTableBody');
    if (tableBody) {
        const weekDays = [
            { name: "อาทิตย์", defaultColors: ["red", "green"] },
            { name: "จันทร์", defaultColors: ["yellow", "orange"] },
            { name: "อังคาร", defaultColors: ["pink", "purple"] },
            { name: "พุธ", defaultColors: ["green", "black"] },
            { name: "พฤหัสบดี", defaultColors: ["orange", "blue"] },
            { name: "ศุกร์", defaultColors: ["blue", "pink"] },
            { name: "เสาร์", defaultColors: ["purple", "red"] }
        ];

        const COLOR_NAME_MAP = {
            red: "แดง", green: "เขียว", yellow: "เหลือง", orange: "ส้ม",
            pink: "ชมพู", purple: "ม่วง", blue: "ฟ้า", black: "ดำ", white: "ขาว"
        };

        let tableHtml = "";

        weekDays.forEach((dayObj, idx) => {
            const seed = dateSeed + (idx * 10);

            // Lucky Colors (2 colors per day)
            const colorPills = dayObj.defaultColors.map(cKey => 
                `<span class="color-pill ${cKey}">${COLOR_NAME_MAP[cKey] || cKey}</span>`
            ).join(" ");

            // Lucky Numbers (2 numbers)
            let n1 = String(Math.floor(seededRandom(seed + 1) * 100)).padStart(2, '0');
            let n2 = String(Math.floor(seededRandom(seed + 2) * 100)).padStart(2, '0');
            const numStr = `${n1} / ${n2}`;

            // Focus point (1-2 points)
            const focusPoints = getRandomItems(INFOGRAPHIC_KNOWLEDGE.focusPoints, 2, seed + 3).join(" / ");

            tableHtml += `
                <tr>
                    <td>${dayObj.name}</td>
                    <td>${colorPills}</td>
                    <td>${numStr}</td>
                    <td>${focusPoints}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = tableHtml;
    }

    // Generate Caption for Social Media Posting
    generateCaptionText(fullDateStr);
};

// Generate Caption Text for FB
function generateCaptionText(fullDateStr) {
    const mainTitle = document.getElementById('canvasMainTitle')?.innerText || "";
    const workDesc = document.getElementById('workDesc')?.innerText || "";
    const wealthDesc = document.getElementById('wealthDesc')?.innerText || "";
    const cautionDesc = document.getElementById('cautionDesc')?.innerText || "";
    const loveDesc = document.getElementById('loveDesc')?.innerText || "";

    const caption = `🔮 ${mainTitle} 🔮
ประจำ${fullDateStr}

✨ สรุปภาพรวมดวงชะตามันเกิดทั้ง 7 วัน
💼 การงาน: ${workDesc}
💰 การเงิน: ${wealthDesc}
⚠️ ข้อควรระวัง: ${cautionDesc}
❤️ ความรัก: ${loveDesc}

👇 ตรวจสอบเลขและสีมงคลเสริมดวงประจำวันในภาพอินโฟกราฟิกได้เลยครับ!

กดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับพลังงานบวกในวันนี้ครับ 🙏✨

#ดูดวง #ดวงรายวัน #ดวงวันนี้ #สยามโหรามงคล #ดวงแม่นๆ #เช็คดวง`;

    const captionArea = document.getElementById('captionTextArea');
    if (captionArea) captionArea.value = caption;
}

// Download Infographic PNG via html2canvas
window.downloadInfographicPNG = async function() {
    const canvasEl = document.getElementById('infographicCanvas');
    if (!canvasEl) return;

    Swal.fire({
        title: 'กำลังสร้างรูปภาพ PNG...',
        text: 'กรุณารอซักครู่ (ความละเอียด 1920x1080 HD)',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        // Temporarily reset transform scale to 1 for html2canvas capture
        const originalTransform = canvasEl.style.transform;
        canvasEl.style.transform = 'none';

        const canvas = await html2canvas(canvasEl, {
            scale: 2, // High resolution output
            useCORS: true,
            backgroundColor: '#fdfbf7',
            width: 1920,
            height: 1080
        });

        // Restore scale
        canvasEl.style.transform = originalTransform;

        const imageURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        
        const dateVal = document.getElementById('predictDate').value || 'daily';
        downloadLink.download = `daily-horoscope-infographic-${dateVal}.png`;
        downloadLink.href = imageURL;
        downloadLink.click();

        Swal.fire({
            icon: 'success',
            title: 'ดาวน์โหลดรูปภาพสำเร็จ!',
            text: 'ไฟล์ภาพ 1920x1080 PNG พร้อมใช้งานแล้วครับ',
            confirmButtonColor: '#d97706',
            timer: 2500
        });
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถสร้างรูปภาพได้: ' + err.message,
            confirmButtonColor: '#d97706'
        });
    }
};

// Copy Caption Text to Clipboard
window.copyCaptionText = function() {
    const captionArea = document.getElementById('captionTextArea');
    if (!captionArea || !captionArea.value) return;

    navigator.clipboard.writeText(captionArea.value).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'คัดลอกแคปชันสำเร็จ!',
            text: 'นำไปโพสต์ลง Facebook หรือเพจได้ทันที',
            confirmButtonColor: '#d97706',
            timer: 2000
        });
    }).catch(err => {
        alert('คัดลอกไม่สำเร็จ: ' + err);
    });
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date by default
    const dateInput = document.getElementById('predictDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }

    // Initial canvas scaling & generation
    updateCanvasScale();
    window.addEventListener('resize', updateCanvasScale);

    generateDailyInfographic();
});
