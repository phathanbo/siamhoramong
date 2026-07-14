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

function downloadZodiacDailyImage() {
    if (typeof html2canvas === 'undefined') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบไลบรารี html2canvas', 'error');
        return;
    }

    const captureArea = document.getElementById('zdCaptureArea');
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กรุณารอสักครู่ (อาจใช้เวลา 2-3 วินาที)',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            
            // Clone DOM Element to render off-screen without scaling issues
            const clone = captureArea.cloneNode(true);
            
            clone.style.position = 'absolute';
            clone.style.top = '0px';
            clone.style.left = '0px';
            clone.style.zIndex = '-9999';
            clone.style.transform = 'none';
            clone.style.margin = '0';
            clone.style.width = '1400px';
            clone.style.height = '900px';
            
            document.body.appendChild(clone);

            html2canvas(clone, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                width: 1400,
                height: 900
            }).then(canvas => {
                document.body.removeChild(clone);

                const dateStr = document.getElementById('zdDate').value;
                const filename = `zodiac_daily_premium_${dateStr}.png`;
                
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                
                Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวง 12 ราศีเรียบร้อยแล้ว', 'success');
            }).catch(err => {
                console.error("HTML2Canvas Error:", err);
                document.body.removeChild(clone);
                Swal.fire('ผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่', 'error');
            });
        }
    });
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
