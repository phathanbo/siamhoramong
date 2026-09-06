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

    // Auto Preview Summary Image
    const previewImg = document.getElementById('dailyPreviewImg');
    const previewLoading = document.getElementById('dailyPreviewLoading');
    if (previewImg) {
        previewImg.style.display = 'none';
        if (previewLoading) previewLoading.style.display = 'block';
        setTimeout(async () => {
            try {
                const dataUrl = await downloadSummaryImage('post');
                if (dataUrl) {
                    previewImg.src = dataUrl;
                    previewImg.style.display = 'block';
                }
            } catch (e) {
                console.error("Preview image error", e);
            } finally {
                if (previewLoading) previewLoading.style.display = 'none';
            }
        }, 100);
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
        title: 'กำลังสร้างโปสเตอร์สรุปดวงชะตา...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const cards = window.lastGeneratedCards;
        const dateStr = document.getElementById('genDate').value;
        const type = document.getElementById('genType') ? document.getElementById('genType').value : 'day';
        const dateObj = new Date(dateStr);
        const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Adjust canvas aspect to match reference poster (1080 x 1520 for 7 days, 1080 x 1920 for 12 zodiacs)
        const isZodiac = (type === 'zodiac' || cards.length > 7);
        const canvasWidth = 1080;
        const canvasHeight = isZodiac ? 1920 : 1520;

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // 1. Midnight Cosmic Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        bgGrad.addColorStop(0, '#060815');
        bgGrad.addColorStop(0.3, '#0b1129');
        bgGrad.addColorStop(0.65, '#130f2d');
        bgGrad.addColorStop(1, '#050713');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Cosmic Nebula Glow Centers
        const radGlow1 = ctx.createRadialGradient(canvasWidth * 0.5, 380, 60, canvasWidth * 0.5, 380, 560);
        radGlow1.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
        radGlow1.addColorStop(0.45, 'rgba(234, 179, 8, 0.16)');
        radGlow1.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow1;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const radGlow2 = ctx.createRadialGradient(canvasWidth * 0.5, canvasHeight - 380, 60, canvasWidth * 0.5, canvasHeight - 380, 500);
        radGlow2.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        radGlow2.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow2;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 3. Ambient Sparkling Constellations
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 95; i++) {
            const sx = (Math.sin(i * 127 + 3) * 0.5 + 0.5) * canvasWidth;
            const sy = (Math.cos(i * 53 + 11) * 0.5 + 0.5) * canvasHeight;
            const r = (i % 7 === 0) ? 2.6 : ((i % 3 === 0) ? 1.8 : 1.1);
            ctx.globalAlpha = 0.25 + ((i % 8) / 10);
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // 4. Luxury Golden Borders & Corners
        ctx.save();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

        ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 40, canvasWidth - 80, canvasHeight - 80);

        const drawDiamond = (dx, dy) => {
            ctx.save();
            ctx.translate(dx, dy);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-6.5, -6.5, 13, 13);
            ctx.restore();
        };
        drawDiamond(30, 30);
        drawDiamond(canvasWidth - 30, 30);
        drawDiamond(30, canvasHeight - 30);
        drawDiamond(canvasWidth - 30, canvasHeight - 30);
        ctx.restore();

        // 5. Header Section (Bold, Grand, Clear)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '700 16px "Prompt", sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.letterSpacing = '3px';
        ctx.fillText("✦  SIAM HORAMONGKOL • COSMIC ASTROLOGY MAP  ✦", canvasWidth / 2, 60);

        // Main Poster Title (Gold Gradient with Glow)
        ctx.font = '800 48px "Prompt", sans-serif';
        const titleGrad = ctx.createLinearGradient(canvasWidth / 2 - 280, 92, canvasWidth / 2 + 280, 92);
        titleGrad.addColorStop(0, '#fffbeb');
        titleGrad.addColorStop(0.3, '#fde047');
        titleGrad.addColorStop(0.7, '#f59e0b');
        titleGrad.addColorStop(1, '#fde047');
        ctx.fillStyle = titleGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowBlur = 22;
        const mainHeader = isZodiac ? "แผนผังชะตาพลังจักรวาล 12 ราศี" : "แผนผังพลังชะตารายวัน 7 วันเกิด";
        ctx.fillText(mainHeader, canvasWidth / 2, 90);
        ctx.shadowBlur = 0;

        // Subtitle Line
        ctx.font = '600 21px "Prompt", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`วิเคราะห์พลังการงาน การเงิน ความรัก และเกณฑ์เสริมชะตา • ${dateThStr}`, canvasWidth / 2, 156);

        // Gold Subtle Divider
        const divGrad = ctx.createLinearGradient(120, 195, canvasWidth - 120, 195);
        divGrad.addColorStop(0, 'transparent');
        divGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.8)');
        divGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(140, 195);
        ctx.lineTo(canvasWidth - 140, 195);
        ctx.stroke();

        // 6. Center S-Curve Energy Wave (Thick, Radiant Gold & Violet like Reference)
        const contentStartY = 220;
        const bottomAreaH = 135;
        const availableH = canvasHeight - contentStartY - bottomAreaH;
        const midX = canvasWidth / 2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(midX, contentStartY);
        const wavePoints = 80;
        const cycles = isZodiac ? 4.5 : 3.5;
        for (let i = 0; i <= wavePoints; i++) {
            const prog = i / wavePoints;
            const py = contentStartY + prog * availableH;
            const px = midX + Math.sin(prog * Math.PI * cycles) * 62;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        // Outer aura
        ctx.lineWidth = 26;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
        ctx.stroke();
        // Inner gold glow
        ctx.lineWidth = 12;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.stroke();
        // Core radiant light
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.95)';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        // 7. Cards Layout - Expanded & Filled (No huge gaps!)
        const count = cards.length;
        const numRows = Math.ceil(count / 2);
        const rowHeight = availableH / numRows;
        const cardW = 410; // Wider cards to fill horizontal space
        const cardH = Math.min(rowHeight - 16, 210); // Taller cards to fill vertical space nicely

        // Zodiac element colors & icons map
        const ZODIAC_EMOJIS = {
            "เมษ": "♈", "พฤษภ": "♉", "เมถุน": "♊", "กรกฎ": "♋",
            "สิงห์": "♌", "กันย์": "♍", "ตุลย์": "♎", "พิจิก": "♏",
            "ธนู": "♐", "มังกร": "♑", "กุมภ์": "♒", "มีน": "♓"
        };
        const DAY_EMOJIS = ["☀️", "🌙", "⚔️", "🌱", "👑", "💎", "🛡️"];

        for (let i = 0; i < count; i++) {
            const card = cards[i];
            const isLeft = (i % 2 === 0);
            const rowIndex = Math.floor(i / 2);

            const cardY = contentStartY + rowIndex * rowHeight + (rowHeight - cardH) / 2;
            const cardX = isLeft ? (midX - cardW - 65) : (midX + 65);

            // Center Node Connector Line
            const nodeProgress = (rowIndex + 0.5) / numRows;
            const nodeX = midX + Math.sin(nodeProgress * Math.PI * cycles) * 62;
            const nodeY = cardY + cardH / 2;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(isLeft ? (cardX + cardW) : cardX, nodeY);
            ctx.lineTo(nodeX, nodeY);
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.stroke();

            // Center Glowing Node Orb
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, 11, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0f24';
            ctx.fill();
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(nodeX, nodeY, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a';
            ctx.fill();
            ctx.restore();

            // Card Glassmorphism Container with Gold Glow
            ctx.save();
            drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20, 'rgba(12, 18, 38, 0.88)', null, {
                color: 'rgba(0, 0, 0, 0.55)',
                blur: 18,
                offsetY: 6
            });
            drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20, null, {
                color: isLeft ? 'rgba(245, 158, 11, 0.45)' : 'rgba(192, 132, 252, 0.48)',
                width: 1.8
            });

            // Glowing Avatar Circle (Like the anatomy/zodiac bubble in the reference)
            const circleR = 26;
            const circleX = cardX + cardW - 42;
            const circleY = cardY + 42;

            ctx.beginPath();
            ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
            const avatarGrad = ctx.createRadialGradient(circleX, circleY, 5, circleX, circleY, circleR);
            avatarGrad.addColorStop(0, isLeft ? 'rgba(245, 158, 11, 0.4)' : 'rgba(168, 85, 247, 0.45)');
            avatarGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
            ctx.fillStyle = avatarGrad;
            ctx.fill();
            ctx.strokeStyle = isLeft ? '#facc15' : '#c084fc';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Circle Icon Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '24px Arial, sans-serif';
            const iconGlyph = isZodiac ? (ZODIAC_EMOJIS[card.title.replace('ราศี', '')] || card.icon || "♈") : (DAY_EMOJIS[i % 7] || "✦");
            ctx.fillText(iconGlyph, circleX, circleY);

            // Card Title (Large & Prominent)
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '800 21px "Prompt", sans-serif';
            ctx.fillStyle = '#fef08a';
            const numPrefix = `${i + 1}. `;
            ctx.fillText(numPrefix + card.title, cardX + 20, cardY + 18);

            // Sub-headline under title
            ctx.font = '600 13px "Prompt", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(isZodiac ? "พลังธาตุและเกณฑ์ชะตารายวัน" : "พลังจักรวาลประจำวันเกิด", cardX + 20, cardY + 45);

            // Card Inner Divider
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cardX + 20, cardY + 68);
            ctx.lineTo(cardX + cardW - 20, cardY + 68);
            ctx.stroke();

            // Set font before measuring
            ctx.textAlign = 'left';
            ctx.font = '500 13.5px "Prompt", sans-serif';

            // Function to truncate text strictly to fit inside max text width
            const maxTextWidth = cardW - 44; // Ensure 22px margin on right side
            const truncateToWidth = (prefix, rawText) => {
                let full = `${prefix} ${rawText}`;
                if (ctx.measureText(full).width <= maxTextWidth) return full;
                let t = rawText;
                while (t.length > 0 && ctx.measureText(`${prefix} ${t}...`).width > maxTextWidth) {
                    t = t.slice(0, -1);
                }
                return `${prefix} ${t.trim()}...`;
            };

            // Work Text (Clean and strict single line)
            const cleanWork = (card.wText || "").replace(/💼|✨|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|เลย/g, '').trim();
            ctx.fillStyle = '#f1f5f9';
            ctx.fillText(truncateToWidth('💼 งาน:', cleanWork), cardX + 20, cardY + 82);

            // Finance / Love Text (Clean and strict single line)
            const cleanFin = (card.fText || card.lText || "").replace(/💰|💸|💳|📈|⚠️|🎁|🛠️|❤️/g, '').trim();
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(truncateToWidth('💰 เงิน:', cleanFin), cardX + 20, cardY + 108);

            // Lucky Pill Badge (Bottom row of card)
            const pillY = cardY + cardH - 38;
            ctx.font = '700 13px "Prompt", sans-serif';
            ctx.fillStyle = '#38bdf8';
            const luckyTxt = card.luckyColor ? `เลขมงคล ${card.luckyNum} • สี${card.luckyColor}` : `เลขเด่น ${card.luckyNum}`;
            ctx.fillText(`✦ ${luckyTxt}`, cardX + 20, pillY);

            // 5 Stars Rating
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fbbf24';
            ctx.font = '13px Arial, sans-serif';
            ctx.fillText("★★★★★", cardX + cardW - 20, pillY);

            ctx.restore();
        }

        // 8. Bottom Action Callout (Like "GET YOUR FULL MAP & BALANCING TIPS!")
        const ctaW = 620;
        const ctaH = 58;
        const ctaX = (canvasWidth - ctaW) / 2;
        const ctaY = canvasHeight - 110;

        const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
        ctaGrad.addColorStop(0, '#fffbeb');
        ctaGrad.addColorStop(0.3, '#fde047');
        ctaGrad.addColorStop(0.8, '#f59e0b');
        ctaGrad.addColorStop(1, '#d97706');
        drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 29, ctaGrad, null, {
            color: 'rgba(245, 158, 11, 0.55)',
            blur: 24,
            offsetY: 6
        });

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 22px "Prompt", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText("อ่านคำทำนายฉบับเต็มและวิธีเสริมดวงที่แคปชั่น! 👆", canvasWidth / 2, ctaY + ctaH / 2);

        // Web URL Footer
        ctx.textBaseline = 'top';
        ctx.font = '700 15px "Prompt", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.letterSpacing = '1.5px';
        ctx.fillText("สยามโหรามงคล • SIAMHORAMONGKOL.COM", canvasWidth / 2, canvasHeight - 42);

        // 9. Export Image
        const dataUrl = canvas.toDataURL('image/png', 0.95);
        
        if (action === 'post') {
            Swal.close();
            return dataUrl;
        }

        const link = document.createElement('a');
        link.download = `แผนผังดวงรายวัน_${dateStr}.png`;
        link.href = dataUrl;
        link.click();
        
        Swal.close();
    } catch (err) {
        console.error("Error drawing canvas: ", err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้: ' + err.message, 'error');
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
