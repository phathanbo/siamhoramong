function initTarot() {
    const tarotBtn = document.getElementById('drawTarotBtn');
    const tarotResult = document.getElementById('tarotResult');
    if (!tarotBtn || !tarotResult) return;

    tarotBtn.addEventListener('click', () => {
        const lastDraw = localStorage.getItem('lastTarotDraw');
        const today = new Date().toISOString().split('T')[0];

        if (lastDraw === today) {
            Swal.fire('อ๊ะ!', 'คุณเปิดไพ่ยิปซีประจำวันไปแล้ว รอวันพรุ่งนี้นะครับ', 'warning');
            return;
        }

        // Animation
        tarotBtn.disabled = true;
        tarotBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสับไพ่...';
        
        setTimeout(() => {
            const randomIdx = Math.floor(Math.random() * tarotCards.length);
            const card = tarotCards[randomIdx];
            
            localStorage.setItem('lastTarotDraw', today);
            
            tarotResult.innerHTML = `
                <div class="card bg-dark border-gold mt-4 p-3 text-center" style="animation: fadeIn 1s;">
                    <img src="${card.img}" alt="${card.name}" style="max-height: 300px; width: auto; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 15px rgba(212,175,55,0.3);">
                    <h3 class="text-gold mt-3">${card.name}</h3>
                    <p class="text-light mt-2" style="font-size: 1.1rem;">${card.meaning}</p>
                </div>
            `;
            tarotResult.style.display = 'block';
            tarotBtn.innerHTML = '<i class="fas fa-check"></i> เปิดไพ่สำเร็จ';
        }, 1500);
    });
}

let currentSiamsiResult = null;

function initSiamsi() {
    const siamsiBtn = document.getElementById('shakeSiamsiBtn');
    const siamsiResult = document.getElementById('siamsiResult');
    const siamsiCylinder = document.getElementById('siamsiCylinder');
    
    if (!siamsiBtn || !siamsiResult || !siamsiCylinder) return;

    siamsiBtn.addEventListener('click', () => {
        const lastDraw = localStorage.getItem('lastSiamsiDraw');
        const today = new Date().toISOString().split('T')[0];

        // For testing purposes, we might want to bypass this, but let's keep it for production
        // if (lastDraw === today) {
        //     Swal.fire('อ๊ะ!', 'คุณเสี่ยงเซียมซีประจำวันไปแล้ว รอวันพรุ่งนี้นะครับ', 'warning');
        //     return;
        // }

        // Animation Phase
        siamsiBtn.disabled = true;
        siamsiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังเขย่า...';
        
        let shakeInterval = setInterval(() => {
            const rot = (Math.random() - 0.5) * 40; // Random rotation between -20 and 20 deg
            siamsiCylinder.style.transform = `rotate(${rot}deg) translateX(${rot/2}px)`;
        }, 100);

        setTimeout(() => {
            clearInterval(shakeInterval);
            siamsiCylinder.style.transform = 'rotate(0deg)';
            
            // Random Result
            const randomIdx = Math.floor(Math.random() * siamsiSticks.length);
            const stick = siamsiSticks[randomIdx];
            currentSiamsiResult = stick;
            
            localStorage.setItem('lastSiamsiDraw', today);
            
            // Populate Ticket Data
            document.getElementById('ticketNum').innerText = stick.num;
            document.getElementById('ticketType').innerText = stick.type;
            document.getElementById('ticketPoem').innerText = stick.poem;
            document.getElementById('ticketWork').innerText = stick.work;
            document.getElementById('ticketLove').innerText = stick.love;
            document.getElementById('ticketHealth').innerText = stick.health;
            
            // Populate Preview Data
            document.getElementById('previewNum').innerText = stick.num;
            
            // Hide Animation, Show Result
            document.getElementById('siamsiAnimationContainer').style.display = 'none';
            siamsiResult.style.display = 'flex';
            
            // Generate Preview Image
            generateSiamsiPreview();

        }, 2000); // Shake for 2 seconds
    });
}

async function generateSiamsiPreview() {
    // We don't pre-generate the image anymore.
    // The HTML ticket will remain visible to the user.
    const wrapper = document.getElementById('siamsiTicketWrapper');
    wrapper.style.display = 'flex';
}

async function downloadSiamsiTicket() {
    if (!currentSiamsiResult) return;

    // Show loading state on button
    const btn = (typeof event !== 'undefined' && event && event.currentTarget) ? event.currentTarget : null;
    let originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังบันทึกภาพ...';
        btn.disabled = true;
    }
    
    try {
        if (document.fonts) {
            await document.fonts.ready;
        }

        // 9:16 Smartphone Resolution
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1920;

        // Local helper for rounded rectangles
        const drawLocalRoundedRect = (c, x, y, width, height, radius, fillStyle = null, strokeStyle = null, shadow = null) => {
            c.save();
            if (shadow) {
                c.shadowColor = shadow.color || 'rgba(0,0,0,0.3)';
                c.shadowBlur = shadow.blur || 8;
                c.shadowOffsetX = shadow.offsetX || 0;
                c.shadowOffsetY = shadow.offsetY || 2;
            }
            c.beginPath();
            c.moveTo(x + radius, y);
            c.lineTo(x + width - radius, y);
            c.quadraticCurveTo(x + width, y, x + width, y + radius);
            c.lineTo(x + width, y + height - radius);
            c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            c.lineTo(x + radius, y + height);
            c.quadraticCurveTo(x, y + height, x, y + height - radius);
            c.lineTo(x, y + radius);
            c.quadraticCurveTo(x, y, x + radius, y);
            c.closePath();

            if (fillStyle) {
                c.fillStyle = fillStyle;
                c.fill();
            }
            c.shadowColor = 'transparent';
            if (strokeStyle) {
                c.lineWidth = strokeStyle.width || 1;
                c.strokeStyle = strokeStyle.color || strokeStyle;
                c.stroke();
            }
            c.restore();
        };
        
        // 1. Draw 9:16 AI-generated mobile background
        let bgLoaded = false;
        try {
            const bgImg = new Image();
            bgImg.crossOrigin = "Anonymous";
            bgImg.src = 'assets/images/siamsi_mobile_bg.jpg';
            await new Promise((resolve) => {
                bgImg.onload = () => {
                    ctx.drawImage(bgImg, 0, 0, 1080, 1920);
                    bgLoaded = true;
                    resolve();
                };
                bgImg.onerror = () => {
                    const fallbackImg = new Image();
                    fallbackImg.crossOrigin = "Anonymous";
                    fallbackImg.src = 'assets/siamsi_bg.jpg';
                    fallbackImg.onload = () => {
                        ctx.drawImage(fallbackImg, 0, 0, 1080, 1920);
                        bgLoaded = true;
                        resolve();
                    };
                    fallbackImg.onerror = resolve;
                };
            });
        } catch (e) {
            console.warn("Could not load AI background, drawing fallback", e);
        }

        if (!bgLoaded) {
            // Elegant fallback background
            ctx.fillStyle = '#4a0808';
            ctx.fillRect(0, 0, 1080, 1920);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 16;
            ctx.strokeRect(30, 30, 1020, 1860);
            ctx.strokeStyle = '#f9e596';
            ctx.lineWidth = 4;
            ctx.strokeRect(55, 55, 970, 1810);
            drawLocalRoundedRect(ctx, 160, 280, 760, 1360, 24, '#fffdf5', { width: 3, color: '#d4af37' });
        }

        ctx.save();

        // 2. Top Branding: สยามโหรามงคล
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#6a0a14';
        ctx.font = 'bold 40px "Sarabun", sans-serif';
        ctx.fillText('✦  ส ย า ม โ ห ร า ม ง ค ล  ✦', 540, 435);
        ctx.shadowBlur = 0;

        // Decorative Line Under Branding
        ctx.beginPath();
        ctx.moveTo(320, 470);
        ctx.lineTo(760, 470);
        ctx.strokeStyle = 'rgba(184, 134, 11, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#b8860b';
        ctx.font = '18px "Sarabun", sans-serif';
        ctx.fillText('❖', 540, 470);

        // 3. Ticket Number Header
        ctx.fillStyle = '#4a0404';
        ctx.font = 'bold 54px "Sarabun", sans-serif';
        ctx.fillText(`ใบเซียมซีที่ ${currentSiamsiResult.num}`, 540, 528);

        // 4. Fortune Badge (Capsule)
        const badgeText = `ผลทำนาย : ${currentSiamsiResult.type}`;
        ctx.font = 'bold 24px "Sarabun", sans-serif';
        const badgeTextWidth = ctx.measureText(badgeText).width;
        const badgeW = Math.max(badgeTextWidth + 70, 280);
        const badgeH = 44;
        const badgeX = 540 - (badgeW / 2);
        const badgeY = 575;

        const grad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
        grad.addColorStop(0, '#880e12');
        grad.addColorStop(0.5, '#b31b20');
        grad.addColorStop(1, '#880e12');

        drawLocalRoundedRect(
            ctx, 
            badgeX, 
            badgeY, 
            badgeW, 
            badgeH, 
            22, 
            grad, 
            { width: 2, color: '#d4af37' }, 
            { color: 'rgba(0,0,0,0.25)', blur: 6, offsetY: 2 }
        );
        
        ctx.fillStyle = '#f9e596';
        ctx.font = 'bold 24px "Sarabun", sans-serif';
        ctx.fillText(badgeText, 540, badgeY + (badgeH / 2) + 1);

        // 5. Poem Section (บทกลอนเสี่ยงทาย) - Printed directly on parchment
        const poemLines = currentSiamsiResult.poem ? currentSiamsiResult.poem.split('\n') : [];
        
        ctx.fillStyle = '#7a0c0e';
        ctx.font = 'bold 23px "Sarabun", sans-serif';
        ctx.fillText('— บทกลอนเสี่ยงทาย —', 540, 665);

        const isEightLines = poemLines.length > 4;
        const poemFontSize = isEightLines ? 23 : 26;
        const poemLineSpacing = isEightLines ? 35 : 44;
        let curPoemY = isEightLines ? 710 : 725;

        ctx.font = `italic ${poemFontSize}px "Sarabun", sans-serif`;
        ctx.fillStyle = '#22110c';

        for (let line of poemLines) {
            ctx.fillText(line.trim(), 540, curPoemY);
            curPoemY += poemLineSpacing;
        }

        // Section Divider
        const dividerY = Math.max(curPoemY + 15, 1020);
        ctx.beginPath();
        ctx.moveTo(270, dividerY);
        ctx.lineTo(810, dividerY);
        ctx.strokeStyle = 'rgba(184, 134, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#b8860b';
        ctx.font = '16px "Sarabun", sans-serif';
        ctx.fillText('❖', 540, dividerY);

        // 6. Detailed Predictions (เจาะลึกคำทำนาย 3 ด้าน) - Clean & Natural
        const detailStartX = 260;
        const maxTextWidth = 560;

        const drawCategory = (icon, title, text, startY, showDivider = true) => {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            // Title
            ctx.font = 'bold 25px "Sarabun", sans-serif';
            ctx.fillStyle = '#7a0c0e';
            const fullTitle = `${icon} ${title}:`;
            ctx.fillText(fullTitle, detailStartX, startY);

            // Body text
            ctx.font = '23px "Sarabun", sans-serif';
            ctx.fillStyle = '#1e1e1e';
            
            let currentTextY = startY + 34;

            let words = [];
            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                words = Array.from(segmenter.segment(text)).map(s => s.segment);
            } else {
                words = text.split(' ');
            }

            let line = '';
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n];
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxTextWidth && line !== '') {
                    ctx.fillText(line, detailStartX, currentTextY);
                    line = words[n];
                    currentTextY += 32;
                } else {
                    line = testLine;
                }
            }
            if (line) {
                ctx.fillText(line, detailStartX, currentTextY);
                currentTextY += 32;
            }

            if (showDivider) {
                ctx.beginPath();
                ctx.moveTo(detailStartX, currentTextY + 12);
                ctx.lineTo(detailStartX + maxTextWidth, currentTextY + 12);
                ctx.strokeStyle = 'rgba(184, 134, 11, 0.25)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            return currentTextY + 24;
        };

        let nextDetailY = dividerY + 35;
        nextDetailY = drawCategory('💼', 'ด้านการงานและการเงิน', currentSiamsiResult.work, nextDetailY, true);
        nextDetailY = drawCategory('❤️', 'ด้านความรักและความสัมพันธ์', currentSiamsiResult.love, nextDetailY, true);
        nextDetailY = drawCategory('🏥', 'ด้านสุขภาพและแคล้วคลาด', currentSiamsiResult.health, nextDetailY, false);

        // 7. Footer / Branding / Timestamp
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const thaiDate = new Date().toLocaleDateString('th-TH', dateOptions);

        ctx.fillStyle = '#6a4010';
        ctx.font = '20px "Sarabun", sans-serif';
        ctx.fillText(`เสี่ยงทาย ณ วันที่ ${thaiDate}`, 540, 1475);

        ctx.fillStyle = '#7a0c0e';
        ctx.font = 'bold 21px "Sarabun", sans-serif';
        ctx.fillText(`สยามโหรามงคล  •  siamhoramongkol`, 540, 1510);

        ctx.restore();

        // 8. Trigger Download
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `Siamsi_${currentSiamsiResult.num}_${dateStr}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                text: `ดาวน์โหลดใบเซียมซีที่ ${currentSiamsiResult.num} เรียบร้อยแล้ว`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    } catch (err) {
        console.error("Error generating Siamsi preview:", err);
        if (typeof Swal !== 'undefined') {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดภาพได้', 'error');
        }
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

function resetSiamsi() {
    // Reset UI
    document.getElementById('siamsiResult').style.display = 'none';
    document.getElementById('siamsiAnimationContainer').style.display = 'flex';
    
    const siamsiBtn = document.getElementById('shakeSiamsiBtn');
    siamsiBtn.disabled = false;
    siamsiBtn.innerHTML = '<i class="fas fa-drum mr-2"></i> เขย่าเซียมซี';
    
    // Allow re-drawing for testing/fun
    localStorage.removeItem('lastSiamsiDraw');
}

document.addEventListener('DOMContentLoaded', () => {
    initTarot();
    initSiamsi();
});
