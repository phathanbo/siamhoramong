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
        outputText += `🌟 ดวงรายวัน แม่นๆ มาแล้วจ้า! 🌟\nประจำ${dateThStr}\nเช็คดวงด่วนๆ ก่อนเริ่มวันใหม่กันเลย! 👇\n\n`;
    } else if (tone === "formal") {
        outputText += `📋 คำทำนายดวงชะตารายวัน 📋\nประจำ${dateThStr}\nขอให้ทุกท่านประสบพบเจอแต่สิ่งดีงามในวันนี้ครับ\n\n`;
    } else if (tone === "mystic") {
        outputText += `🔮 เปิดชะตาฟ้าลิขิต ฟันธงดวงรายวัน! 🔮\nประจำ${dateThStr}\nชะตากำหนดไว้แล้ว มาดูกันว่าวันนี้ใครรุ่ง ใครต้องระวัง!\n\n`;
    }

    if (type === "day") {
        // วนลูป 7 วัน
        for (let i = 0; i < 7; i++) {
            const dayName = ADMIN_CONTENT_DAYS_LIST[i];
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

            outputText += `${dColor} คนเกิดวัน${dayName} ${dColor}\n`;
            outputText += `💼 การงาน: ${wText}\n`;
            outputText += `💰 การเงิน: ${fText}\n`;
            outputText += `❤️ ความรัก: \n${lText}\n`;
            outputText += `🌟 ทริคเสริมดวง: เลขมงคล ${luckyNum1}${luckyNum2} | สีมงคล: ${luckyColor}\n`;
            outputText += `---------------------------------\n\n`;
            
            cards.push({ icon: dColor, title: dayName, wText: wText, fText: fText, lText: lText, luckyNum: `${luckyNum1}${luckyNum2}`, luckyColor: luckyColor });
        }
    } else if (type === "zodiac") {
        // วนลูป 12 ราศี
        for (let i = 0; i < 12; i++) {
            const z = ADMIN_CONTENT_ZODIAC_LIST[i];
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

            outputText += `${z.icon} ${z.name} (ธาตุ${z.element})\n`;
            outputText += `💼 งาน: ${wText}\n`;
            outputText += `💰 เงิน: ${fText}\n`;
            outputText += `❤️ รัก: ${lText.replace(/\\n/g, ' ')}\n`; // รวมบรรทัดเพื่อความกระชับ
            outputText += `🌟 เลขมงคลพารวย: ${luckyNum1}, ${luckyNum2}\n`;
            outputText += `---------------------------------\n\n`;
            
            cards.push({ icon: z.icon, title: z.name, wText: wText, fText: fText, lText: lText, luckyNum: `${luckyNum1}${luckyNum2}` });
        }
    }

    // Hashtags
    outputText += `อย่าลืมกดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับความโชคดีกันนะครับ 🙏✨\n`;
    outputText += `#ดูดวง #ดวงรายวัน #ดวงวันนี้ #สยามโหรามงคล #ดวงแม่นๆ`;

    const resContainer = document.getElementById('genResultContainer');
    const resText = document.getElementById('genResultText');
    
    resText.value = outputText;
    resContainer.style.display = "block";
    window.lastGeneratedCards = cards;
}
