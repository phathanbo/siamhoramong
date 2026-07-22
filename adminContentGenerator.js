"use strict";

/**
 * 📱 ระบบสร้างคอนเทนต์ดวงรายวันสำหรับ Admin (Daily Fortune Generator)
 * สร้าง Text สำหรับนำไปโพสต์ Facebook โดยอิงหลักโหราศาสตร์
 */

// ฐานข้อมูลคำทำนายตามวันเกิด (วันอาทิตย์ - เสาร์)
const DAILY_FORTUNE_DB = {
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

// ข้อมูล 12 ราศี
if (typeof ZODIAC_LIST === 'undefined') { var ZODIAC_LIST = [
    { name: "ราศีเมษ", icon: "♈", element: "ไฟ" },
    { name: "ราศีพฤษภ", icon: "♉", element: "ดิน" },
    { name: "ราศีเมถุน", icon: "♊", element: "ลม" },
    { name: "ราศีกรกฎ", icon: "♋", element: "น้ำ" },
    { name: "ราศีสิงห์", icon: "♌", element: "ไฟ" },
    { name: "ราศีกันย์", icon: "♍", element: "ดิน" },
    { name: "ราศีตุลย์", icon: "♎", element: "ลม" },
    { name: "ราศีพิจิก", icon: "♏", element: "น้ำ" },
    { name: "ราศีธนู", icon: "♐", element: "ไฟ" },
    { name: "ราศีมังกร", icon: "♑", element: "ดิน" },
    { name: "ราศีกุมภ์", icon: "♒", element: "ลม" },
    { name: "ราศีมีน", icon: "♓", element: "น้ำ" }
]; }

const DAYS_LIST = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const ADMIN_CONTENT_DAY_COLORS = ["🔴", "🟡", "🩷", "🟢", "🟠", "🔵", "🟣"];



/**
 * ระบบสุ่มแบบมี Seed โดยใช้วันที่เป็นตัวตั้ง
 * เพื่อให้กดสุ่มวันเดียวกันกี่ครั้งก็ได้ผลเหมือนเดิม (ความสม่ำเสมอ)
 */
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function getRandomFromDB(array, seed) {
    const index = Math.floor(seededRandom(seed) * array.length);
    return array[index];
}

/**
 * ฟังก์ชันหลักในการสร้างเนื้อหา
 */
function generateDailyContent() {
    const dateVal = document.getElementById('genDate').value;
    const type = document.getElementById('genType').value;
    const tone = document.getElementById('genTone').value;
    
    if(!dateVal) {
        alert("กรุณาเลือกวันที่");
        return;
    }

    // แปลงวันที่เป็น Seed สากล (YYYYMMDD)
    const dateObj = new Date(dateVal);
    const dateSeedBase = parseInt(dateVal.replace(/-/g, ''));
    
    // แปลง Format วันที่แสดงผลแบบไทย
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateThStr = dateObj.toLocaleDateString('th-TH', options);

    let outputText = "";
    let cards = [];
    window.lastGeneratedDateStr = dateThStr;

    // ปรับ Header ตาม Tone
    if (tone === "casual") {
        outputText += `🌟 ดวงรายวัน แม่นๆ มาแล้วจ้า! 🌟
ประจำ${dateThStr}
เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่กันเลย! 👇

`;
    } else if (tone === "formal") {
        outputText += `📋 คำทำนายดวงชะตารายวัน 📋
ประจำ${dateThStr}
ขอให้ทุกท่านประสบพบเจอแต่สิ่งดีงามในวันนี้ครับ

`;
    } else if (tone === "mystic") {
        outputText += `🔮 เปิดชะตาฟ้าลิขิต ฟันธงดวงรายวัน! 🔮
ประจำ${dateThStr}
ชะตากำหนดไว้แล้ว มาดูกันว่าวันนี้ใครรุ่ง ใครต้องระวัง!

`;
    }

    if (type === "day") {
        // วนลูป 7 วัน
        for (let i = 0; i < 7; i++) {
            const dayName = DAYS_LIST[i];
            const dColor = ADMIN_CONTENT_DAY_COLORS[i];
            
            // Seed เฉพาะสำหรับ วันที่ + วันเกิด
            const seed = dateSeedBase + i;
            
            let wText = getRandomFromDB(DAILY_FORTUNE_DB.work, seed + 1);
            let fText = getRandomFromDB(DAILY_FORTUNE_DB.finance, seed + 2);
            let lText = getRandomFromDB(DAILY_FORTUNE_DB.love, seed + 3);

            // ปรับคำตามโทน
            if (tone === "formal") {
                wText = wText.replace(/จ้า|กันเลย|ๆ|✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝/g, '');
                fText = fText.replace(/💸|💰|💳|📈|⚠️|🎁|🛠️/g, '');
                lText = lText.replace(/❤️|💼|🤐|🌹|✈️|🕵️‍♀️|💖|🕰️|🥰/g, '');
            } else if (tone === "mystic") {
                wText = `ฟันธง! ` + wText;
                fText = `ชะตาการเงิน: ` + fText;
            }

            // สุ่มเลขมงคล 2 ตัว และสีมงคล (ดึงจากอาทิตย์-เสาร์ อิงกาลโยคเทียม)
            const luckyNum1 = Math.floor(seededRandom(seed + 4) * 10);
            const luckyNum2 = Math.floor(seededRandom(seed + 5) * 10);
            const luckyColorIdx = Math.floor(seededRandom(seed + 6) * 7);
            const luckyColor = ["แดง", "เหลือง", "ชมพู", "เขียว", "ส้ม", "ฟ้า", "ม่วง", "ขาว", "ดำ"][luckyColorIdx];

            outputText += `${dColor} คนเกิดวัน${dayName} ${dColor}
`;
            outputText += `💼 การงาน: ${wText}
`;
            outputText += `💰 การเงิน: ${fText}
`;
            outputText += `❤️ ความรัก: 
${lText}
`;
            outputText += `🌟 ทริคเสริมดวง: เลขมงคล ${luckyNum1}${luckyNum2} | สีมงคล: ${luckyColor}
`;
            outputText += `---------------------------------

`;
            
            cards.push({ icon: dColor, title: dayName, wText: wText, fText: fText, lText: lText, luckyNum: `${luckyNum1}${luckyNum2}`, luckyColor: luckyColor });
        }
    } else if (type === "zodiac") {
        // วนลูป 12 ราศี
        for (let i = 0; i < 12; i++) {
            const z = ZODIAC_LIST[i];
            const seed = dateSeedBase + i * 10;

            let wText = getRandomFromDB(DAILY_FORTUNE_DB.work, seed + 1);
            let fText = getRandomFromDB(DAILY_FORTUNE_DB.finance, seed + 2);
            let lText = getRandomFromDB(DAILY_FORTUNE_DB.love, seed + 3);

            if (tone === "formal") {
                wText = wText.replace(/จ้า|กันเลย|ๆ|✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝/g, '');
                fText = fText.replace(/💸|💰|💳|📈|⚠️|🎁|🛠️/g, '');
                lText = lText.replace(/❤️|💼|🤐|🌹|✈️|🕵️‍♀️|💖|🕰️|🥰/g, '');
            } else if (tone === "mystic") {
                wText = `ดวงดาวบ่งชี้ว่า ` + wText;
            }

            const luckyNum1 = Math.floor(seededRandom(seed + 4) * 10);
            const luckyNum2 = Math.floor(seededRandom(seed + 5) * 10);

            outputText += `${z.icon} ${z.name} (ธาตุ${z.element})
`;
            outputText += `💼 งาน: ${wText}
`;
            outputText += `💰 เงิน: ${fText}
`;
            outputText += `❤️ รัก: ${lText.replace(/\n/g, ' ')}
`; // รวมบรรทัดเพื่อความกระชับ
            outputText += `🌟 เลขมงคลพารวย: ${luckyNum1}, ${luckyNum2}
`;
            outputText += `---------------------------------

`;
            
            cards.push({ icon: z.icon, title: z.name, wText: wText, fText: fText, lText: lText, luckyNum: `${luckyNum1}${luckyNum2}` });
        }
    }

    // Hashtags
    outputText += `อย่าลืมกดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับความโชคดีกันนะครับ 🙏✨
`;
    outputText += `#ดูดวง #ดวงรายวัน #ดวงวันนี้ #สยามโหรามงคล #ดวงแม่นๆ`;

    const resContainer = document.getElementById('genResultContainer');
    const resText = document.getElementById('genResultText');
    
    resText.value = outputText;
    resContainer.style.display = "flex";
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
    window.lastGeneratedCards = cards;
}


function copyGenResult() {
    const resText = document.getElementById('genResultText');
    resText.select();
    resText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    
    // แจ้งเตือน
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'คัดลอกข้อความสำเร็จ!',
            text: 'นำไปโพสต์ลง Facebook หรือช่องทางอื่นได้เลย',
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        alert("คัดลอกข้อความสำเร็จ!");
    }
}


function copyGenResult() {
    const text = document.getElementById('genResultText').value;
    if(!text) return alert('ไม่มีข้อความให้คัดลอก');
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'คัดลอกสำเร็จ!',
            text: 'คัดลอกข้อความสำหรับโพสต์เรียบร้อยแล้ว',
            confirmButtonColor: '#d4af37',
            background: '#1a1a2e',
            color: '#fff'
        });
    }).catch(err => {
        alert('ไม่สามารถคัดลอกได้: ' + err);
    });
}

async function downloadSummaryImage(action = 'download') {
    if (!window.lastGeneratedCards || window.lastGeneratedCards.length === 0) return alert('ยังไม่มีข้อมูล กรุณากดสร้างข้อความก่อน');
    
    Swal.fire({
        title: 'กำลังสร้างภาพสรุป...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const cards = window.lastGeneratedCards;
        const HEX_COLORS = {
            "🔴": "#ff4d4d", "🟡": "#ffd700", "🩷": "#ffb6c1",
            "🟢": "#00e676", "🟠": "#ff9100", "🔵": "#2979ff", "🟣": "#d500f9",
            "♈": "#ff4d4d", "♉": "#00e676", "♊": "#ffd700", "♋": "#b0bec5",
            "♌": "#ff9100", "♍": "#78909c", "♎": "#2979ff", "♏": "#d500f9",
            "♐": "#ffab00", "♑": "#455a64", "♒": "#00b0ff", "♓": "#00e5ff"
        };
        
        const dateStr = document.getElementById('genDate').value;
        const dateObj = new Date(dateStr);
        const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Calculate layout
        const canvasWidth = 1080;
        const cols = 3;
        const rows = Math.ceil(cards.length / cols);
        const cardWidth = 310; // (1080 - 60 padding - 40 gap) / 3 ≈ 326 -> 310 for safety
        const cardHeight = 280;
        const gap = 20;
        
        const paddingTop = 130;
        const titleAreaHeight = 120;
        const gridHeight = rows * cardHeight + (rows - 1) * gap;
        const bottomAreaHeight = 100;
        const paddingBottom = 65;
        
        const canvasHeight = paddingTop + titleAreaHeight + gridHeight + bottomAreaHeight + paddingBottom;

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        bgGrad.addColorStop(0, '#6c7293');
        bgGrad.addColorStop(0.5, '#8c90a8');
        bgGrad.addColorStop(1, '#6c7293');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Stars
        ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            ctx.globalAlpha = Math.random() * 0.5 + 0.1;
            ctx.font = (Math.random() * 10 + 8) + "px Arial";
            ctx.fillText("✨", Math.random() * canvasWidth, Math.random() * canvasHeight);
        }
        ctx.globalAlpha = 1.0;

        // Main Panel (Glassmorphism effect)
        drawRoundedRect(ctx, 30, 35, canvasWidth - 60, canvasHeight - 70, 24, 'rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.4)', {color: 'rgba(0,0,0,0.1)', blur: 35});

        // Title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 48px "Sarabun", sans-serif';
        drawStrokedText(ctx, "🌙 สรุปดวงประจำวัน", canvasWidth / 2, 60, '#FFDF73', 'rgba(0,0,0,0.3)', 2);
        
        ctx.font = '500 22px "Sarabun", sans-serif';
        drawStrokedText(ctx, `ประจำ${dateThStr}`, canvasWidth / 2, 120, '#ffffff', 'rgba(0,0,0,0.2)', 1);

        // Grid
        const startX = 30 + (canvasWidth - 60 - (cols * cardWidth + (cols - 1) * gap)) / 2;
        const startY = paddingTop + titleAreaHeight;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = startX + col * (cardWidth + gap);
            const cy = startY + row * (cardHeight + gap);
            const bgColor = HEX_COLORS[card.icon] || "#d4af37";

            // Card Panel
            drawRoundedRect(ctx, cx, cy, cardWidth, cardHeight, 18, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.8)', {color: 'rgba(0,0,0,0.05)', blur: 15});
            
            // Header
            ctx.beginPath();
            ctx.moveTo(cx + 15, cy + 45);
            ctx.lineTo(cx + cardWidth - 15, cy + 45);
            ctx.strokeStyle = 'rgba(0,0,0,0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Color circle
            ctx.beginPath();
            ctx.arc(cx + 25, cy + 25, 9, 0, Math.PI * 2);
            ctx.fillStyle = bgColor;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            
            // Title
            ctx.textAlign = 'left';
            ctx.font = 'bold 20px "Sarabun", sans-serif';
            ctx.fillStyle = '#1a1a2e';
            ctx.fillText(card.title, cx + 42, cy + 13);
            
            // Content
            ctx.font = '13.5px "Sarabun", sans-serif';
            ctx.fillStyle = '#2d3436';
            
            const wShort = card.wText.length > 50 ? card.wText.substring(0, 50) + '...' : card.wText;
            const fShort = card.fText.length > 50 ? card.fText.substring(0, 50) + '...' : card.fText;
            const lShort = card.lText.length > 50 ? card.lText.substring(0, 50) + '...' : card.lText;
            
            let currentY = cy + 55;
            ctx.fillText("💼", cx + 15, currentY);
            let lines = wrapText(ctx, wShort, cx + 35, currentY, cardWidth - 50, 20);
            
            currentY += lines * 20 + 5;
            ctx.fillText("💰", cx + 15, currentY);
            lines = wrapText(ctx, fShort, cx + 35, currentY, cardWidth - 50, 20);
            
            currentY += lines * 20 + 5;
            ctx.fillText("❤️", cx + 15, currentY);
            wrapText(ctx, lShort, cx + 35, currentY, cardWidth - 50, 20);

            // Bottom Pill
            const pillWidth = 140;
            const pillHeight = 28;
            const pillX = cx + (cardWidth - pillWidth) / 2;
            const pillY = cy + cardHeight - 55;
            
            const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY);
            pillGrad.addColorStop(0, '#b8860b');
            pillGrad.addColorStop(1, '#d4af37');
            drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 14, pillGrad, null, {color: 'rgba(0,0,0,0.2)', blur: 5, offsetY: 2});
            
            ctx.textAlign = 'center';
            ctx.font = 'bold 13px "Sarabun", sans-serif';
            ctx.fillStyle = 'white';
            ctx.fillText(`เลขมงคล: ${card.luckyNum || '00'}`, cx + cardWidth / 2, pillY + 6);
            
            ctx.font = '14px Arial';
            ctx.fillStyle = '#FFDF73';
            ctx.fillText("⭐⭐⭐⭐⭐", cx + cardWidth / 2, pillY + 35);
        }

        // Bottom Banner
        const bannerWidth = 450;
        const bannerHeight = 40;
        const bannerX = (canvasWidth - bannerWidth) / 2;
        const bannerY = startY + gridHeight + 30;
        
        drawRoundedRect(ctx, bannerX, bannerY, bannerWidth, bannerHeight, 20, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.9)', {color: 'rgba(0,0,0,0.1)', blur: 10, offsetY: 4});
        
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px "Sarabun", sans-serif';
        ctx.fillStyle = '#333';
        ctx.fillText("🌟 อ่านคำทำนายเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล 🌟", canvasWidth / 2, bannerY + 12);

        // Save
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        
        if (action === 'post') {
            Swal.close();
            return dataUrl;
        }

        const link = document.createElement('a');
        link.download = `ดวงรายวัน_${dateStr}.png`;
        link.href = dataUrl;
        link.click();
        
        Swal.close();
    } catch (err) {
        console.error("Error drawing canvas: ", err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้', 'error');
    }
}

// --- Facebook Posting Logic ---
async function postToFacebook() {
    try {
        const dataUrl = await downloadSummaryImage('post');
        if (!dataUrl) return;
        
        const genResultText = document.getElementById('genResultText').value;
        const msg = genResultText ? genResultText : "สรุปดวงรายวัน โดยสยามโหรามงคล";
        
        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์',
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

        if (!confirmResult.isConfirmed) {
            return;
        }

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
