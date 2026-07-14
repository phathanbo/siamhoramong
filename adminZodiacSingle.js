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

function downloadZodiacSingleImage() {
    if (typeof html2canvas === 'undefined') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบไลบรารี html2canvas', 'error');
        return;
    }

    const captureArea = document.getElementById('zdCaptureArea');
    const zodiacIndex = parseInt(document.getElementById('zdZodiacSelect').value, 10);
    const dateStr = document.getElementById('zdDate').value;
    
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
            clone.style.width = '1080px';
            clone.style.height = '1350px';
            
            document.body.appendChild(clone);

            html2canvas(clone, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                width: 1080,
                height: 1350
            }).then(canvas => {
                document.body.removeChild(clone);

                const filename = `zodiac_single_${zodiacIndex}_${dateStr}.png`;
                
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                
                Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวงเรียบร้อยแล้ว', 'success');
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

/**
 * ดาวน์โหลดทั้งหมด 12 รูป
 */
async function downloadAllZodiacImages() {
    if (typeof html2canvas === 'undefined') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบไลบรารี html2canvas', 'error');
        return;
    }
    
    const dateStr = document.getElementById('zdDate').value;
    if (!dateStr) return;
    
    const select = document.getElementById('zdZodiacSelect');
    const originalIndex = select.value; // Store original
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพทั้งหมด (12 รูป)',
        html: 'ระบบกำลังทยอยเซฟรูปลงเครื่องทีละรูป กรุณารอสักครู่...<br><br><b id="dlProgress">0 / 12</b>',
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            const captureArea = document.getElementById('zdCaptureArea');
            
            for (let i = 0; i < 12; i++) {
                // Change select and trigger render
                select.value = i;
                renderZodiacSinglePreview();
                
                // Wait for DOM to update
                await new Promise(r => setTimeout(r, 100));
                
                // Clone and render
                const clone = captureArea.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.top = '0px';
                clone.style.left = '0px';
                clone.style.zIndex = '-9999';
                clone.style.transform = 'none';
                clone.style.margin = '0';
                clone.style.width = '1080px';
                clone.style.height = '1350px';
                
                document.body.appendChild(clone);
                
                try {
                    const canvas = await html2canvas(clone, {
                        scale: 2, 
                        useCORS: true,
                        logging: false,
                        width: 1080,
                        height: 1350
                    });
                    
                    document.body.removeChild(clone);
                    
                    const filename = `zodiac_single_${i}_${dateStr}.png`;
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = canvas.toDataURL('image/png', 1.0);
                    link.click();
                    
                    document.getElementById('dlProgress').innerText = `${i + 1} / 12`;
                    
                    // Small delay between downloads so browser doesn't freeze or block
                    await new Promise(r => setTimeout(r, 500));
                } catch(e) {
                    console.error("Error at index " + i, e);
                    document.body.removeChild(clone);
                }
            }
            
            // Restore original
            select.value = originalIndex;
            renderZodiacSinglePreview();
            
            Swal.fire('สำเร็จ!', 'ดาวน์โหลดภาพดวงทั้ง 12 ราศีเรียบร้อยแล้ว', 'success');
        }
    });
}
