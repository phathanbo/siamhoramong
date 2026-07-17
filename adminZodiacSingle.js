/**
 * adminZodiacSingle.js
 * สำหรับรันหน้า adminZodiacSingle.html (Premium Layout - แยกทีละราศี)
 */

const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const ZODIAC_EMOJIS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

function initZodiacSingleStandalone() {
    renderZodiacSinglePreview();
    
    // Scale preview automatically
    window.addEventListener('resize', resizeZodiacPreview);
    resizeZodiacPreview();
}

function resizeZodiacPreview() {
    const container = document.getElementById('zdPreviewContainer');
    const captureArea = document.getElementById('zdCaptureArea');
    if (!container || !captureArea) return;
    
    const availableWidth = window.innerWidth - 390; // account for sidebar + padding
    const availableHeight = window.innerHeight - 40;
    
    const scaleX = availableWidth / 1080;
    const scaleY = availableHeight / 1350;
    const scale = Math.min(scaleX, scaleY, 1); // max scale 1
    
    container.style.transform = `scale(${scale})`;
    container.style.width = `${1080 * scale}px`;
    container.style.height = `${1350 * scale}px`;
}

function renderZodiacSinglePreview() {
    const dateStr = document.getElementById('zdDate').value;
    const zodiacIndex = parseInt(document.getElementById('zdZodiacSelect').value, 10);
    if (!dateStr || isNaN(zodiacIndex)) return;
    
    const dateObj = new Date(dateStr);
    const dayOfWeek = THAI_DAYS[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = THAI_MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543;
    
    document.getElementById('zdDateBadge').innerText = `ประจำวัน ${dayOfWeek} ที่ ${day} เดือน ${month} พ.ศ. ${year}`;

    if (typeof generateDailyZodiacFortunes !== 'function') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฟังก์ชัน generateDailyZodiacFortunes กรุณาตรวจสอบไฟล์ zodiac-daily-data.js', 'error');
        return;
    }
    
    const predictions = generateDailyZodiacFortunes(dateObj);
    const p = predictions[zodiacIndex];
    
    if (!p) return;
    
    // Update Image UI
    document.getElementById('zsIcon').innerHTML = p.icon;
    document.getElementById('zsName').innerText = p.name;
    document.getElementById('zsDateRange').innerText = p.dateRange;
    document.getElementById('zsDescription').innerHTML = p.description;
    document.getElementById('zsGood').innerText = p.good;
    document.getElementById('zsBad').innerText = p.bad;
    
    // Build Facebook Text Preview
    let fbText = `ทำนายดวงชะตา ${p.name}\n`;
    fbText += `ประจำวัน ${dayOfWeek} ที่ ${day} เดือน ${month} พ.ศ. ${year}\n`;
    fbText += `---------------------------------------\n\n`;
    
    const emoji = ZODIAC_EMOJIS[zodiacIndex] || "✨";
    fbText += `${emoji} ${p.name}\n`;
    fbText += `📜 คำทำนาย: ${p.description}\n`;
    fbText += `✅ สิ่งที่ดี: ${p.good}\n`;
    fbText += `⚠️ ข้อควรระวัง: ${p.bad}\n\n`;
    
    fbText += `---------------------------------------\n`;
    fbText += `✦ โดย สยามโหรามงคล ✦\n`;
    fbText += `ทำดี คิดดี พูดดี จะมีแต่สิ่งดี ๆ เข้ามาในชีวิต 🙏✨\n\n`;
    fbText += `#ดูดวง #ดวงรายวัน #ทำนายดวง #ดูดวง${p.name.replace('ราศี','')} #สยามโหรามงคล #ดูดวงแม่นๆ`;
    
    const fbPreview = document.getElementById('fbTextPreview');
    if(fbPreview) {
        fbPreview.value = fbText;
    }
}

async function generateZodiacCanvas(p, dateStr) {
    const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dateObj = new Date(dateStr);
    const dayOfWeek = THAI_DAYS[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = THAI_MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543;
    
    const badgeText = `ประจำวัน ${dayOfWeek} ที่ ${day} เดือน ${month} พ.ศ. ${year}`;

    await document.fonts.ready;
    
    const canvasWidth = 1080;
    const canvasHeight = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Draw Background
    ctx.fillStyle = '#1a0831';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const bgImg = new Image();
    bgImg.src = 'assets/thai_astrology_bg.png';
    await new Promise((resolve) => {
        bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
            resolve();
        };
        bgImg.onerror = () => resolve(); 
    });
    
    ctx.fillStyle = 'rgba(26, 8, 49, 0.4)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Border
    ctx.strokeStyle = '#e9b64c';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvasWidth - 8, canvasHeight - 8);
    
    // Ornate Border
    ctx.strokeStyle = 'rgba(233, 182, 76, 0.7)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);
    ctx.setLineDash([]);

    // Header Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 88px "Prompt", sans-serif';
    if(typeof drawStrokedText === "function") {
        drawStrokedText(ctx, "ทำนายดวงชะตา", canvasWidth / 2, 100, '#f9d976', 'rgba(0,0,0,0.9)', 4);
    } else {
        ctx.fillStyle = '#f9d976';
        ctx.fillText("ทำนายดวงชะตา", canvasWidth / 2, 100);
    }

    // Ribbon
    ctx.font = 'bold 35px "Sarabun", sans-serif';
    const badgeWidth = 550;
    const badgeHeight = 70;
    const badgeX = (canvasWidth - badgeWidth) / 2;
    if(typeof drawRoundedRect === "function") {
        const badgeGrad = ctx.createLinearGradient(0, 160, 0, 230);
        badgeGrad.addColorStop(0, '#d4af37');
        badgeGrad.addColorStop(1, '#b8860b');
        drawRoundedRect(ctx, badgeX, 160, badgeWidth, badgeHeight, 8, badgeGrad);
    } else {
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(badgeX, 160, badgeWidth, badgeHeight);
    }
    ctx.fillStyle = '#1a0831';
    ctx.fillText(badgeText, canvasWidth / 2, 195);

    // Zodiac Icon
    ctx.fillStyle = '#f9d976';
    ctx.font = '150px "Sarabun", sans-serif';
    ctx.shadowColor = 'rgba(233,182,76,0.6)';
    ctx.shadowBlur = 30;
    ctx.fillText(p.icon, canvasWidth / 2, 360);
    ctx.shadowBlur = 0;

    // Zodiac Name
    ctx.font = 'bold 80px "Prompt", sans-serif';
    if(typeof drawStrokedText === "function") {
        drawStrokedText(ctx, p.name, canvasWidth / 2, 500, '#ffffff', 'rgba(0,0,0,0.8)', 3);
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.name, canvasWidth / 2, 500);
    }
    
    // Date Range
    ctx.fillStyle = '#d4af37';
    ctx.font = '32px "Sarabun", sans-serif';
    ctx.fillText(p.dateRange, canvasWidth / 2, 570);

    // Prediction Card
    const cardY = 620;
    const cardW = 900;
    const cardH = 620;
    const cardX = (canvasWidth - cardW) / 2;
    
    if(typeof drawRoundedRect === "function") {
        const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
        cardGrad.addColorStop(0, 'rgba(255,249,235,0.95)');
        cardGrad.addColorStop(1, 'rgba(253,228,181,0.95)');
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20, cardGrad, '#b8860b', {color: 'rgba(0,0,0,0.6)', blur: 20});
    } else {
        ctx.fillStyle = 'rgba(255,249,235,0.95)';
        ctx.fillRect(cardX, cardY, cardW, cardH);
    }

    // Prediction description
    ctx.fillStyle = '#1a0831';
    ctx.font = '35px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if(typeof wrapText === "function") {
        wrapText(ctx, p.description, cardWidth / 2, cardY + 50, cardW - 80, 52);
    } else {
        ctx.fillText(p.description.substring(0, 50) + '...', canvasWidth / 2, cardY + 60);
    }

    // Good / Bad box
    const boxY = cardY + cardH - 180;
    if(typeof drawRoundedRect === "function") {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        drawRoundedRect(ctx, cardX + 40, boxY, cardW - 80, 140, 15);
    }
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cardX + 40, boxY, cardW - 80, 140);
    ctx.setLineDash([]);
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Good
    ctx.fillStyle = '#2E7D32';
    ctx.font = 'bold 30px "Sarabun", sans-serif';
    ctx.fillText("✓", cardX + 60, boxY + 45);
    ctx.fillStyle = '#000000';
    ctx.fillText("ดี: ", cardX + 100, boxY + 45);
    
    ctx.fillStyle = '#2E7D32';
    ctx.font = '30px "Sarabun", sans-serif';
    if(typeof wrapText === "function") {
        ctx.textBaseline = 'top';
        wrapText(ctx, p.good, cardX + 150, boxY + 28, cardW - 200, 36);
        ctx.textBaseline = 'middle';
    } else {
        ctx.fillText(p.good.substring(0, 35) + '...', cardX + 150, boxY + 45);
    }

    // Bad
    ctx.fillStyle = '#C62828';
    ctx.font = 'bold 30px "Sarabun", sans-serif';
    ctx.fillText("⚠", cardX + 60, boxY + 95);
    ctx.fillStyle = '#000000';
    ctx.fillText("ระวัง: ", cardX + 100, boxY + 95);
    
    ctx.fillStyle = '#C62828';
    ctx.font = '30px "Sarabun", sans-serif';
    if(typeof wrapText === "function") {
        ctx.textBaseline = 'top';
        wrapText(ctx, p.bad, cardX + 180, boxY + 78, cardW - 230, 36);
    } else {
        ctx.fillText(p.bad.substring(0, 35) + '...', cardX + 180, boxY + 95);
    }

    // Footer
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '28px "Sarabun", sans-serif';
    if(typeof drawStrokedText === "function") {
        drawStrokedText(ctx, "✦ โดย สยามโหรามงคล ✦", canvasWidth / 2, 1300, '#f9d976', 'rgba(0,0,0,0.8)', 2);
    } else {
        ctx.fillStyle = '#f9d976';
        ctx.fillText("✦ โดย สยามโหรามงคล ✦", canvasWidth / 2, 1300);
    }

    return canvas;
}

function copyTextForFacebook() {
    const fbPreview = document.getElementById('fbTextPreview');
    if (!fbPreview || !fbPreview.value) {
        Swal.fire('แจ้งเตือน', 'ไม่พบข้อความสำหรับคัดลอก', 'warning');
        return;
    }
    
    const fbText = fbPreview.value;
    
    // Copy to clipboard
    navigator.clipboard.writeText(fbText).then(() => {
        Swal.fire({
            title: 'คัดลอกสำเร็จ! 📝',
            text: 'คัดลอกข้อความสำหรับราศีนี้เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonColor: '#1877F2',
            confirmButtonText: 'รับทราบ'
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fbText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            Swal.fire('คัดลอกสำเร็จ!', 'นำไปวางใน Facebook ได้เลยครับ', 'success');
        } catch (e) {
            Swal.fire('ผิดพลาด', 'ไม่สามารถคัดลอกได้อัตโนมัติ กรุณาก๊อปปี้ด้วยตนเอง', 'error');
        }
        document.body.removeChild(textArea);
    });
}

async function downloadZodiacSingleImage() {
    if (typeof generateDailyZodiacFortunes !== 'function') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฟังก์ชัน generateDailyZodiacFortunes', 'error');
        return;
    }

    const zodiacIndex = parseInt(document.getElementById('zdZodiacSelect').value, 10);
    const dateStr = document.getElementById('zdDate').value;
    if (!dateStr || isNaN(zodiacIndex)) return;
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            
            try {
                const dateObj = new Date(dateStr);
                const predictions = generateDailyZodiacFortunes(dateObj);
                const p = predictions[zodiacIndex];
                
                if(!p) throw new Error("ไม่พบข้อมูลราศีนี้");
                
                const canvas = await generateZodiacCanvas(p, dateStr);
                
                const filename = `zodiac_single_${zodiacIndex}_${dateStr}.png`;
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png', 0.9);
                link.click();
                
                Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวงเรียบร้อยแล้ว', 'success');
            } catch (err) {
                console.error("Canvas Generate Error:", err);
                Swal.fire('ผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่', 'error');
            }
        }
    });
}

async function downloadAllZodiacImages() {
    if (typeof generateDailyZodiacFortunes !== 'function') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฟังก์ชัน generateDailyZodiacFortunes', 'error');
        return;
    }
    
    const dateStr = document.getElementById('zdDate').value;
    if (!dateStr) return;
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพทั้งหมด (12 รูป)',
        html: 'ระบบกำลังทยอยเซฟรูปลงเครื่องทีละรูป กรุณารอสักครู่...<br><br><b id="dlProgress">0 / 12</b>',
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            try {
                const dateObj = new Date(dateStr);
                const predictions = generateDailyZodiacFortunes(dateObj);
                
                for (let i = 0; i < 12; i++) {
                    const p = predictions[i];
                    if(!p) continue;
                    
                    const canvas = await generateZodiacCanvas(p, dateStr);
                    
                    const filename = `zodiac_single_${i}_${dateStr}.png`;
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = canvas.toDataURL('image/png', 0.9);
                    link.click();
                    
                    document.getElementById('dlProgress').innerText = `${i + 1} / 12`;
                    
                    await new Promise(r => setTimeout(r, 500));
                }
                
                Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวงทั้ง 12 ราศีเรียบร้อยแล้ว', 'success');
            } catch(e) {
                console.error("Error generating all images", e);
                Swal.fire('ผิดพลาด', 'ไม่สามารถสร้างรูปภาพทั้งหมดได้', 'error');
            }
        }
    });
}
