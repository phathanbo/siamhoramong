/**
 * adminZodiacDaily.js
 * สำหรับรันหน้า adminZodiacDaily.html (Premium Layout)
 */

const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

function initZodiacDailyStandalone() {
    renderZodiacDailyPreview();
    
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
    
    const scaleX = availableWidth / 1400;
    const scaleY = availableHeight / 900;
    const scale = Math.min(scaleX, scaleY, 1); // max scale 1
    
    container.style.transform = `scale(${scale})`;
    container.style.width = `${1400 * scale}px`;
    container.style.height = `${900 * scale}px`;
}

function renderZodiacDailyPreview() {
    const dateStr = document.getElementById('zdDate').value;
    if (!dateStr) return;
    
    const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    
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
    const grid = document.getElementById('zdGrid');
    grid.innerHTML = '';
    
    // Build Facebook Text Preview
    let fbText = `ทำนายดวงชะตา 12ราศี\n`;
    fbText += `ประจำวัน ${dayOfWeek} ที่ ${day} เดือน ${month} พ.ศ. ${year}\n`;
    fbText += `---------------------------------------\n\n`;
    
    const zodiacEmojis = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

    predictions.forEach((p, idx) => {
        // Truncate text for image layout to prevent cutoff
        const shortDesc = p.description.length > 55 ? p.description.substring(0, 55) + '...' : p.description;
        const shortGood = p.good.length > 30 ? p.good.substring(0, 30) + '...' : p.good;
        const shortBad = p.bad.length > 30 ? p.bad.substring(0, 30) + '...' : p.bad;

        const cardHTML = `
            <div class="zodiac-card">
                <!-- Header (Fixed Height) -->
                <div style="display: flex; align-items: center; height: 50px; margin-bottom: 15px; border-bottom: 1px dashed rgba(184, 134, 11, 0.5); padding-bottom: 12px;">
                    <div class="zodiac-icon-container">
                        ${p.icon}
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 700; font-size: 19px; line-height: 22px; color: #1a0831;">${p.name}</div>
                        <div style="font-size: 12px; line-height: 16px; color: #555;">${p.dateRange}</div>
                    </div>
                </div>
                
                <!-- Body (Fixed Height) -->
                <div style="font-size: 14px; line-height: 22px; height: 100px; margin-bottom: 10px; text-align: left; overflow: hidden;">
                    ${shortDesc}
                </div>
                
                <!-- Footer (Fixed Height) -->
                <div style="font-size: 13px; font-weight: 600; text-align: left; display: flex; flex-direction: column; justify-content: flex-end; flex-grow: 1;">
                    <div style="color: #2E7D32; margin-bottom: 5px;"><i class="fas fa-check-circle mr-1"></i> ดี : ${shortGood}</div>
                    <div style="color: #C62828;"><i class="fas fa-exclamation-triangle mr-1"></i> ระวัง : ${shortBad}</div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
        
        // Append to FB Text
        const emoji = zodiacEmojis[idx] || "✨";
        fbText += `${emoji} ${p.name}\n`;
        fbText += `📜 คำทำนาย: ${p.description}\n`;
        fbText += `✅ สิ่งที่ดี: ${p.good}\n`;
        fbText += `⚠️ ข้อควรระวัง: ${p.bad}\n\n`;
    });
    
    fbText += `---------------------------------------\n`;
    fbText += `✦ โดย สยามโหรามงคล ✦\n`;
    fbText += `ทำดี คิดดี พูดดี จะมีแต่สิ่งดี ๆ เข้ามาในชีวิต 🙏✨\n\n`;
    fbText += `#ดูดวง #ดวงรายวัน #ทำนายดวง #ดูดวง12ราศี #สยามโหรามงคล #ดูดวงแม่นๆ`;
    
    const fbPreview = document.getElementById('fbTextPreview');
    if(fbPreview) {
        fbPreview.value = fbText;
    }
}

async function downloadZodiacDailyImage(action = 'download') {
    if (typeof generateDailyZodiacFortunes !== 'function') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฟังก์ชัน generateDailyZodiacFortunes', 'error');
        return;
    }

    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        
        const dateStr = document.getElementById('zdDate').value;
        const dateObj = new Date(dateStr);
        const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
        const dayOfWeek = THAI_DAYS[dateObj.getDay()];
        const day = dateObj.getDate();
        const month = THAI_MONTHS[dateObj.getMonth()];
        const year = dateObj.getFullYear() + 543;
        
        const badgeText = `ประจำวัน ${dayOfWeek} ที่ ${day} เดือน ${month} พ.ศ. ${year}`;
        const predictions = generateDailyZodiacFortunes(dateObj);

        const canvasWidth = 1400;
        const canvasHeight = 900;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Draw Background image or color
        ctx.fillStyle = '#1a0831';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const bgImg = new Image();
        bgImg.src = 'assets/thai_astrology_bg.png';
        await new Promise((resolve) => {
            bgImg.onload = () => {
                ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
                resolve();
            };
            bgImg.onerror = () => resolve(); // If missing, just use color
        });
        
        // Add dark overlay to make text readable
        ctx.fillStyle = 'rgba(26, 8, 49, 0.4)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Border (6px solid #e9b64c)
        ctx.strokeStyle = '#e9b64c';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, canvasWidth - 6, canvasHeight - 6);
        
        // Ornate Border (dashed)
        ctx.strokeStyle = 'rgba(233, 182, 76, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(15, 15, canvasWidth - 30, canvasHeight - 30);
        ctx.setLineDash([]);

        // Header Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f9d976';
        ctx.font = 'bold 76px "Prompt", sans-serif';
        drawStrokedText(ctx, "ทำนายดวงชะตา 12ราศี", canvasWidth / 2, 95, '#f9d976', 'rgba(0,0,0,0.9)', 3);

        ctx.font = 'bold 24px "Sarabun", sans-serif';
        const badgeWidth = 480;
        const badgeHeight = 46;
        const badgeX = (canvasWidth - badgeWidth) / 2;
        const badgeGrad = ctx.createLinearGradient(0, 130, 0, 176);
        badgeGrad.addColorStop(0, '#d4af37');
        badgeGrad.addColorStop(1, '#b8860b');
        drawRoundedRect(ctx, badgeX, 130, badgeWidth, badgeHeight, 8, badgeGrad);
        ctx.fillStyle = '#1a0831';
        ctx.fillText(badgeText, canvasWidth / 2, 161);
        
        ctx.fillStyle = '#f9d976';
        ctx.font = '20px "Sarabun", sans-serif';
        drawStrokedText(ctx, "✦ โดย สยามโหรามงคล ✦", canvasWidth / 2, 210, '#f9d976', 'rgba(0,0,0,0.8)', 1);

        // Grid parameters (6 columns, 2 rows)
        const cols = 6;
        const rows = 2;
        const gapX = 15;
        const gapY = 15;
        const cardWidth = (1400 - 60 - (cols - 1) * gapX) / cols; // 30px padding on each side
        const cardHeight = 280;
        const startX = 30;
        const startY = 240;

        for (let i = 0; i < predictions.length; i++) {
            const p = predictions[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = startX + col * (cardWidth + gapX);
            const cy = startY + row * (cardHeight + gapY);

            // Card Background
            const cardGrad = ctx.createLinearGradient(cx, cy, cx + cardWidth, cy + cardHeight);
            cardGrad.addColorStop(0, 'rgba(255,249,235,0.95)');
            cardGrad.addColorStop(1, 'rgba(253,228,181,0.95)');
            drawRoundedRect(ctx, cx, cy, cardWidth, cardHeight, 10, cardGrad, '#b8860b', {color: 'rgba(0,0,0,0.5)', blur: 15});
            ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(cx + 4, cy + 4, cardWidth - 8, cardHeight - 8);
            
            // Header Line
            ctx.beginPath();
            ctx.moveTo(cx + 12, cy + 65);
            ctx.lineTo(cx + cardWidth - 12, cy + 65);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = 'rgba(184, 134, 11, 0.5)';
            ctx.stroke();
            ctx.setLineDash([]);

            // Icon circle
            const iconGrad = ctx.createLinearGradient(cx + 12, cy + 12, cx + 56, cy + 56);
            iconGrad.addColorStop(0, '#2c0f4c');
            iconGrad.addColorStop(1, '#1a0831');
            ctx.beginPath();
            ctx.arc(cx + 34, cy + 34, 22, 0, Math.PI * 2);
            ctx.fillStyle = iconGrad;
            ctx.fill();
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#f9d976';
            ctx.font = '22px "Sarabun", sans-serif';
            ctx.fillText(p.icon, cx + 34, cy + 42);

            // Title
            ctx.textAlign = 'left';
            ctx.fillStyle = '#1a0831';
            ctx.font = 'bold 18px "Sarabun", sans-serif';
            ctx.fillText(p.name, cx + 64, cy + 28);
            
            ctx.fillStyle = '#555';
            ctx.font = '11px "Sarabun", sans-serif';
            ctx.fillText(p.dateRange, cx + 64, cy + 46);

            // Description
            ctx.fillStyle = '#1a0831';
            ctx.font = '13px "Sarabun", sans-serif';
            const shortDesc = p.description.length > 55 ? p.description.substring(0, 55) + '...' : p.description;
            wrapText(ctx, shortDesc, cx + 12, cy + 85, cardWidth - 24, 19);

            // Good / Bad
            const goodY = cy + cardHeight - 85;
            const badY = cy + cardHeight - 45;
            
            ctx.fillStyle = '#2E7D32';
            ctx.font = 'bold 12px "Sarabun", sans-serif';
            // wrap text to prevent overflow
            const goodTxt = `✓ ดี : ${p.good}`.substring(0, 60);
            wrapText(ctx, goodTxt + (p.good.length > 60 ? '...' : ''), cx + 12, goodY, cardWidth - 24, 18);
            
            ctx.fillStyle = '#C62828';
            const badTxt = `⚠ ระวัง : ${p.bad}`.substring(0, 60);
            wrapText(ctx, badTxt + (p.bad.length > 60 ? '...' : ''), cx + 12, badY, cardWidth - 24, 18);
        }

        // Footer Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f9d976';
        ctx.font = '22px "Sarabun", sans-serif';
        drawStrokedText(ctx, "ทำดี คิดดี พูดดี จะมีแต่สิ่งดี ๆ เข้ามาในชีวิต", canvasWidth / 2, canvasHeight - 35, '#f9d976', 'rgba(0,0,0,0.8)', 1);

        // Save
        const imgData = canvas.toDataURL('image/png', 0.9);
        
        if (action === 'post') {
            Swal.close();
            return imgData;
        }

        const link = document.createElement('a');
        link.download = `zodiac_daily_premium_${dateStr}.png`;
        link.href = imgData;
        link.click();
        
        Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวง 12 ราศีเรียบร้อยแล้ว', 'success');

    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้', 'error');
    }
}

// --- Facebook Posting Logic ---
async function postToFacebook() {
    try {
        const dataUrl = await downloadZodiacDailyImage('post');
        if (!dataUrl) return;
        
        const fbPreview = document.getElementById('fbTextPreview');
        const msg = (fbPreview && fbPreview.value) ? fbPreview.value : "ดวงรายวัน 12 ราศี โดยสยามโหรามงคล";
        
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
            text: 'คัดลอกข้อความทั้งหมดพร้อมนำไปโพสต์ลง Facebook แล้ว',
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
