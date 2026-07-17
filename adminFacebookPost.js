document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const captionInput = document.getElementById('captionInput');
    const fbCaptionPreview = document.getElementById('fbCaptionPreview');
    const imageTitle = document.getElementById('imageTitle');
    const imageText = document.getElementById('imageText');
    const previewTitle = document.getElementById('previewTitle');
    const previewText = document.getElementById('previewText');
    
    const bgSelect = document.getElementById('bgSelect');
    const bgUpload = document.getElementById('bgUpload');
    const exportImageArea = document.getElementById('exportImageArea');
    const previewBg = document.getElementById('previewBg');
    
    const titleColor = document.getElementById('titleColor');
    const textColor = document.getElementById('textColor');
    
    const templateSelect = document.getElementById('templateSelect');
    const btnGenerate = document.getElementById('btnGenerate');
    const btnCopyText = document.getElementById('btnCopyText');
    const btnDownloadImg = document.getElementById('btnDownloadImg');
    const postDate = document.getElementById('postDate');

    // Set default date to today
    const todayStr = new Date().toISOString().split('T')[0];
    if (postDate) postDate.value = todayStr;

    // Real-time Text Updates
    captionInput.addEventListener('input', () => {
        let text = captionInput.value;
        if (text.trim() === '') {
            fbCaptionPreview.innerHTML = 'พิมพ์ข้อความโพสต์ที่นี่...';
        } else {
            // Replace newlines with <br> for HTML preview
            fbCaptionPreview.innerHTML = text.replace(/\n/g, '<br>');
        }
    });

    imageTitle.addEventListener('input', () => {
        previewTitle.textContent = imageTitle.value || 'หัวข้อ';
    });

    imageText.addEventListener('input', () => {
        previewText.textContent = imageText.value || 'ข้อความ';
    });

    // Real-time Color Updates
    titleColor.addEventListener('input', () => {
        previewTitle.style.color = titleColor.value;
    });

    textColor.addEventListener('input', () => {
        previewText.style.color = textColor.value;
    });

    // Background Image/Color updates
    bgSelect.addEventListener('change', () => {
        if (bgSelect.value === 'custom') {
            bgUpload.style.display = 'block';
            previewBg.style.background = 'rgba(0,0,0,0.5)'; // Darken base when waiting for upload
        } else {
            bgUpload.style.display = 'none';
            exportImageArea.style.background = bgSelect.value;
            previewBg.style.backgroundImage = 'none';
        }
    });

    bgUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewBg.style.backgroundImage = `url(${e.target.result})`;
                exportImageArea.style.background = '#000'; // Make background black to let opacity work on img
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Helper: Insert text/emoji into caption at cursor
    window.insertText = function(targetId, textToInsert) {
        let input;
        if (targetId === 'caption') input = captionInput;
        
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            
            input.value = text.substring(0, start) + textToInsert + text.substring(end);
            input.selectionStart = input.selectionEnd = start + textToInsert.length;
            input.focus();
            
            // Trigger input event to update preview
            input.dispatchEvent(new Event('input'));
        }
    };

    // Auto-Generate based on template
    btnGenerate.addEventListener('click', () => {
        const type = templateSelect.value;
        if (!type) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกเทมเพลต',
                text: 'โปรดเลือกเทมเพลตก่อนกดสร้าง',
                background: '#1e1e1e',
                color: '#fff'
            });
            return;
        }

        // Seeded random for consistency per date
        function seededRandom(seed) {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }
        function getRandomFromDB(array, seed) {
            const index = Math.floor(seededRandom(seed) * array.length);
            return array[index];
        }

        const DAILY_FORTUNE_DB = [
            "มีเกณฑ์ได้รับข่าวดีเรื่องงาน โปรเจกต์ที่ทำอยู่จะประสบความสำเร็จเกินคาด \nมีผู้ใหญ่ให้การสนับสนุน หรือมีเกณฑ์ได้แสดงฝีมือให้เป็นที่ประจักษ์",
            "เป็นวันที่ต้องใช้ความอดทนสูง อาจมีอุปสรรคเล็กน้อย แต่จะผ่านไปได้ด้วยดี \nเจรจาต่อรองประสบความสำเร็จ ลูกค้าหรือพาร์ทเนอร์ตอบรับข้อเสนอ",
            "มีโชคลาภลอยแบบไม่คาดฝัน หรือได้เงินคืนจากลูกหนี้เก่า \nหยิบจับอะไรก็เป็นเงินเป็นทอง มีผู้อุปถัมภ์ค้ำชู ทำสิ่งใดก็ราบรื่น",
            "การเงินสะพัด แต่ก็มีรายจ่ายจุกจิกเข้ามาตลอดวัน ระวังการใช้จ่ายตามอารมณ์ \nมีเกณฑ์ชีพจรลงเท้า ต้องเดินทางเรื่องงาน",
            "คนโสดมีเสน่ห์แรงเป็นพิเศษ มีคนเข้ามาให้ความสนใจ \nความรักหวานชื่น เข้าอกเข้าใจกันดี มีเกณฑ์ได้เดินทางท่องเที่ยว",
            "ได้รับโชคจากผู้ใหญ่ หรือเพศตรงข้ามนำความโชคดีมาให้ \nผลงานโดดเด่นเข้าตาผู้ใหญ่ คู่แข่งยอมแพ้ เป็นวันของคุณที่จะได้เฉิดฉาย"
        ];
        
        const AUSPICIOUS_DB = [
            "เวลามงคล: 09:09 - 11:39 น.\nเหมาะสำหรับการเริ่มต้นสิ่งใหม่ \nเปิดร้าน เจรจาธุรกิจ",
            "เวลามงคล: 13:15 - 15:45 น.\nเหมาะกับการเจรจาค้าขาย \nลงทุน เสี่ยงโชค",
            "เวลามงคล: 08:45 - 10:15 น.\nเหมาะกับการออกรถใหม่ \nขึ้นบ้านใหม่ ทำบุญ",
            "เวลามงคล: 14:30 - 16:00 น.\nเหมาะกับการติดต่อราชการ \nพบปะผู้ใหญ่ ขอความช่วยเหลือ"
        ];
        
        const QUOTE_DB = [
            "ดวงดาวไม่ได้กำหนดชีวิตเราทั้งหมด\nมันเป็นเพียงแผนที่นำทาง \nส่วนคนขับรถคือตัวคุณเอง",
            "ความพยายามในวันนี้\nคือสะพานเชื่อมสู่ \nความสำเร็จในวันพรุ่งนี้",
            "โชคชะตาอาจมีส่วน\nแต่ความมุ่งมั่นตั้งใจ \nคือสิ่งที่เปลี่ยนชีวิตคุณ",
            "อย่าให้คำทำนายร้ายๆ มาบั่นทอน\nให้ใช้เป็นเครื่องเตือนสติ \nเพื่อก้าวเดินอย่างระมัดระวัง"
        ];

        let captionText = '';
        let titleText = '';
        let imgContentText = '';
        
        // Date logic
        const dateInput = document.getElementById('postDate').value;
        let targetDate = new Date();
        let dateStrForTitle = 'วันนี้';
        let dateStrForText = 'วันนี้';
        
        // Create a numeric seed from the date (e.g. 20260714)
        let dateSeed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate();
        
        if (dateInput) {
            targetDate = new Date(dateInput);
            dateSeed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate();
            const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
            dateStrForTitle = `${targetDate.getDate()} ${thaiMonths[targetDate.getMonth()]}`;
            dateStrForText = `วันที่ ${targetDate.getDate()} ${thaiMonths[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`;
        }

        if (type === 'daily') {
            const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
            const dayName = days[targetDate.getDay()];
            
            titleText = `ดวงรายวัน ประจำวัน${dayName}`;
            imgContentText = getRandomFromDB(DAILY_FORTUNE_DB, dateSeed + 1);
            captionText = `🔮 #ดวงรายวัน ประจำวัน${dayName} ${dateInput ? `(${dateStrForTitle})` : ''}\n\n${imgContentText}\n\n🌟 สีมงคล: สีแดง, สีทอง\n❌ สีสีกาลกิณี: สีดำ\n\n🙏 ขอให้ทุกคนโชคดี มีความสุขตลอดวันครับ\n\n#สยามโหรามงคล #ดูดวง #ดวงวันนี้`;
        
        } else if (type === 'auspicious') {
            titleText = `ฤกษ์มงคล ${dateInput ? dateStrForTitle : 'วันนี้'}`;
            imgContentText = getRandomFromDB(AUSPICIOUS_DB, dateSeed + 2);
            captionText = `💰 #ฤกษ์มงคล ประจำ${dateInput ? dateStrForText : 'วันนี้'}\n\n${imgContentText}\n\n🌟 ขอให้กิจการรุ่งเรือง ประสบความสำเร็จครับ\n\n#สยามโหรามงคล #ฤกษ์ดี #ฤกษ์เปิดกิจการ`;
            
        } else if (type === 'quote') {
            titleText = `ข้อคิดโหราศาสตร์`;
            imgContentText = getRandomFromDB(QUOTE_DB, dateSeed + 3);
            captionText = `✨ แอดมินมีข้อคิดดีๆ มาฝากครับ\n\n"${imgContentText}"\n\nเชื่อมั่นในตัวเอง และทำทุกวันให้ดีที่สุดครับ 💖\n\n#สยามโหรามงคล #ข้อคิด #กำลังใจ`;
        }

        captionInput.value = captionText;
        imageTitle.value = titleText;
        imageText.value = imgContentText;
        
        // Trigger events to update UI
        captionInput.dispatchEvent(new Event('input'));
        imageTitle.dispatchEvent(new Event('input'));
        imageText.dispatchEvent(new Event('input'));
        
        Swal.fire({
            icon: 'success',
            title: 'สร้างข้อความสำเร็จ',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            background: '#1e1e1e',
            color: '#fff'
        });
    });

    // Copy Text
    btnCopyText.addEventListener('click', () => {
        if (!captionInput.value.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่มีข้อความให้คัดลอก',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1e1e1e',
                color: '#fff'
            });
            return;
        }

        navigator.clipboard.writeText(captionInput.value).then(() => {
            const originalHtml = btnCopyText.innerHTML;
            btnCopyText.innerHTML = '<i class="fas fa-check"></i> คัดลอกแล้ว';
            btnCopyText.classList.replace('btn-secondary', 'btn-primary');
            
            setTimeout(() => {
                btnCopyText.innerHTML = originalHtml;
                btnCopyText.classList.replace('btn-primary', 'btn-secondary');
            }, 2000);
            
            Swal.fire({
                icon: 'success',
                title: 'คัดลอกข้อความแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1e1e1e',
                color: '#fff'
            });
        });
    });

    // Download Image
    btnDownloadImg.addEventListener('click', async () => {
        const originalHtml = btnDownloadImg.innerHTML;
        btnDownloadImg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสร้างรูปภาพ...';
        btnDownloadImg.disabled = true;

        try {
            await document.fonts.ready;
            
            const width = 1080;
            const height = 1080;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // 1. Background
            const bgVal = bgSelect.value;
            if (bgVal === 'custom') {
                const bgImgUrl = previewBg.style.backgroundImage;
                if (bgImgUrl && bgImgUrl !== 'none') {
                    // Fill black background first
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, width, height);
                    
                    const url = bgImgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    const img = new Image();
                    img.src = url;
                    await new Promise((resolve, reject) => { 
                        img.onload = resolve; 
                        img.onerror = resolve; 
                    });
                    
                    ctx.globalAlpha = 0.3; // Match CSS opacity
                    
                    // Cover sizing
                    const scale = Math.max(width / img.width, height / img.height);
                    const drawW = img.width * scale;
                    const drawH = img.height * scale;
                    const drawX = (width - drawW) / 2;
                    const drawY = (height - drawH) / 2;
                    
                    ctx.drawImage(img, drawX, drawY, drawW, drawH);
                    ctx.globalAlpha = 1.0;
                } else {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, width, height);
                }
            } else {
                const colors = bgVal.match(/#[a-zA-Z0-9]{3,6}/g);
                let grad = ctx.createLinearGradient(0, 0, width, height);
                if (colors && colors.length >= 2) {
                    grad.addColorStop(0, colors[0]);
                    if(colors.length > 2) {
                        grad.addColorStop(0.5, colors[1]);
                        grad.addColorStop(1, colors[2]);
                    } else {
                        grad.addColorStop(1, colors[1]);
                    }
                } else {
                    grad.addColorStop(0, '#1a1a2e');
                    grad.addColorStop(1, '#16213e');
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
            }
            
            // 2. Text layout calculations
            ctx.font = '400 50px "Sarabun"';
            const maxWidth = width - 160; // 80px padding each side
            const textStr = previewText.textContent || '';
            const lines = textStr.split('\n');
            let paragraphLinesAll = [];
            
            for (let i = 0; i < lines.length; i++) {
                let paragraphLines = [];
                // Use Intl.Segmenter for proper Thai word wrapping if available
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(lines[i]);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > maxWidth && currentLine.trim() !== '') {
                            paragraphLines.push(currentLine);
                            currentLine = segment;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    paragraphLines.push(currentLine);
                } else {
                    // Fallback to character wrapping
                    let currentLine = "";
                    for (let j = 0; j < lines[i].length; j++) {
                        const char = lines[i][j];
                        const testLine = currentLine + char;
                        if (ctx.measureText(testLine).width > maxWidth && j > 0) {
                            paragraphLines.push(currentLine);
                            currentLine = char;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    paragraphLines.push(currentLine);
                }
                paragraphLinesAll.push(...paragraphLines);
            }
            
            const titleHeight = 80;
            const marginTitle = 60;
            const bodyLineHeight = 75;
            
            const totalTextHeight = titleHeight + marginTitle + (paragraphLinesAll.length * bodyLineHeight);
            let currentY = (height - totalTextHeight) / 2; // Center vertically
            
            // 3. Draw Title
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 2;
            
            ctx.font = '700 80px "Sarabun"';
            ctx.fillStyle = titleColor.value;
            ctx.fillText(previewTitle.textContent, width/2, currentY);
            
            currentY += titleHeight + marginTitle;
            
            // 4. Draw Body Text
            ctx.font = '400 50px "Sarabun"';
            ctx.fillStyle = textColor.value;
            for(let pLine of paragraphLinesAll) {
                ctx.fillText(pLine, width/2, currentY);
                currentY += bodyLineHeight;
            }
            
            // 5. Watermark
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.font = '400 36px "Sarabun"';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.shadowBlur = 0; 
            ctx.shadowOffsetY = 0;
            ctx.fillText("เพจ สยามโหรามงคล", width - 40, height - 30);
            
            // 6. Export
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `siamhora_fb_post_${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
            
            btnDownloadImg.innerHTML = originalHtml;
            btnDownloadImg.disabled = false;
            
            Swal.fire({
                icon: 'success',
                title: 'ดาวน์โหลดรูปภาพสำเร็จ',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#1e1e1e',
                color: '#fff'
            });
            
        } catch (err) {
            console.error('Error generating image:', err);
            btnDownloadImg.innerHTML = originalHtml;
            btnDownloadImg.disabled = false;
            
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถสร้างรูปภาพได้',
                background: '#1e1e1e',
                color: '#fff'
            });
        }
    });
});
