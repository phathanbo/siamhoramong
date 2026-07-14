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
const ZODIAC_LIST = [
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
];

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

async function downloadSummaryImage() {
    if (!window.lastGeneratedCards || window.lastGeneratedCards.length === 0) return alert('ยังไม่มีข้อมูล กรุณากดสร้างข้อความก่อน');
    if (typeof html2canvas === 'undefined') return alert('กำลังโหลดไลบรารีรูปภาพ กรุณารอสักครู่...');

    const container = document.getElementById('canvasExportArea');
    const cards = window.lastGeneratedCards;
    
    // Vibrant colors for the day indicators (matches the mockup's neon glow feel)
    const HEX_COLORS = {
        "🔴": "#ff4d4d", "🟡": "#ffd700", "🩷": "#ffb6c1",
        "🟢": "#00e676", "🟠": "#ff9100", "🔵": "#2979ff", "🟣": "#d500f9",
        "♈": "#ff4d4d", "♉": "#00e676", "♊": "#ffd700", "♋": "#b0bec5",
        "♌": "#ff9100", "♍": "#78909c", "♎": "#2979ff", "♏": "#d500f9",
        "♐": "#ffab00", "♑": "#455a64", "♒": "#00b0ff", "♓": "#00e5ff"
    };
    
    let itemsHtml = '';
    
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        
        let wShort = card.wText.length > 50 ? card.wText.substring(0, 50) + '...' : card.wText;
        let fShort = card.fText.length > 50 ? card.fText.substring(0, 50) + '...' : card.fText;
        let lShort = card.lText.length > 50 ? card.lText.substring(0, 50) + '...' : card.lText;
        
        // Remove emoji from card title if it exists, as we use a colored circle instead
        let cleanTitle = card.title;
        
        itemsHtml += `
            <div style="background: rgba(255, 255, 255, 0.4); border-radius: 18px; padding: 20px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05), inset 0 10px 20px -10px ${bgColor}88; border: 1px solid rgba(255, 255, 255, 0.8); display: flex; flex-direction: column; gap: 8px; width: calc(33.333% - 14px); box-sizing: border-box; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                
                <!-- Card Header -->
                <div style="font-size: 20px; color: #1a1a2e; font-weight: bold; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 12px; margin-bottom: 5px;">
                    <div style="width: 18px; height: 18px; border-radius: 50%; background: ${bgColor}; box-shadow: 0 0 8px ${bgColor}; border: 2px solid white;"></div>
                    ${cleanTitle}
                    
                    <!-- Faded planet icon top right -->
                    <div style="position: absolute; top: 15px; right: 15px; font-size: 30px; opacity: 0.15; filter: grayscale(100%);">🪐</div>
                </div>
                
                <!-- Content -->
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">💼</span>
                    <span>${wShort}</span>
                </div>
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">💰</span>
                    <span>${fShort}</span>
                </div>
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">❤️</span>
                    <span>${lShort}</span>
                </div>
                
                <!-- Bottom Pill & Stars -->
                <div style="margin-top: auto; padding-top: 10px; text-align: center;">
                    <div style="background: linear-gradient(to right, #b8860b, #d4af37); color: white; padding: 4px 20px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        เลขมงคล: ${card.luckyNum || '00'}
                    </div>
                    <div style="margin-top: 5px; color: #FFDF73; font-size: 14px; letter-spacing: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ⭐⭐⭐⭐⭐
                    </div>
                </div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div id="exportSummary" style="width: 1080px; background: linear-gradient(135deg, #6c7293, #8c90a8, #6c7293); color: #333; font-family: 'Sarabun', sans-serif; padding: 35px; box-sizing: border-box; text-align: center; position: relative;">
            
            <!-- Stars background -->
            <div style="position: absolute; top: 15%; left: 10%; font-size: 10px; color: white; opacity: 0.5;">✨</div>
            <div style="position: absolute; top: 30%; right: 15%; font-size: 14px; color: white; opacity: 0.4;">✨</div>
            <div style="position: absolute; bottom: 20%; left: 20%; font-size: 12px; color: white; opacity: 0.6;">✨</div>
            <div style="position: absolute; bottom: 40%; right: 10%; font-size: 8px; color: white; opacity: 0.5;">✨</div>
            <div style="position: absolute; top: 50%; left: 5%; font-size: 16px; color: white; opacity: 0.3;">✨</div>
            
            <div style="position: relative; z-index: 10; background: rgba(255, 255, 255, 0.25); padding: 35px 30px; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(10px);">
                
                <div style="margin-bottom: 25px;">
                    <h1 style="color: #FFDF73; font-size: 48px; margin: 0 0 5px 0; font-weight: bold; text-shadow: 1px 2px 4px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; gap: 15px;">
                        <span style="font-size: 50px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🌙</span> สรุปดวงประจำวัน
                    </h1>
                    <h2 style="color: #ffffff; font-weight: 500; font-size: 22px; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                        ประจำ${dateThStr}
                    </h2>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; text-align: left;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 30px; font-size: 16px; color: #333; font-weight: bold; padding: 10px 30px; background: rgba(255,255,255,0.7); border-radius: 30px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.9);">
                    <span style="color: #b8860b;">🌟</span> อ่านคำทำนายเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล <span style="color: #b8860b;">🌟</span>
                </div>
                
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#6c7293",
        logging: false
    });
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    
    const link = document.createElement('a');
    link.download = `ดวงรายวัน_${dateStr}.png`;
    link.href = dataUrl;
    link.click();
    
    container.innerHTML = '';
}
