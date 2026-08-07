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
    // Show loading state on button
    const btn = event.currentTarget;
    let originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังบันทึก...';
        btn.disabled = true;
    }
    
    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background
        ctx.fillStyle = '#fffdf5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 15;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 5;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Headers
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#8b0000';
        ctx.font = 'bold 80px "Sarabun", sans-serif';
        ctx.fillText('ใบเซียมซี', canvas.width / 2, 80);
        
        ctx.font = 'bold 50px "Sarabun", sans-serif';
        ctx.fillText(`ใบที่ ${currentSiamsiResult.num}`, canvas.width / 2, 170);
        
        // Type Badge
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(canvas.width / 2 - 120, 240, 240, 60);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 35px "Sarabun", sans-serif';
        ctx.fillText(currentSiamsiResult.type, canvas.width / 2, 250);
        
        // Poem
        ctx.fillStyle = '#8b0000';
        ctx.font = '40px "Sarabun", sans-serif';
        const lines = currentSiamsiResult.poem.split('\n');
        let y = 350;
        for (let line of lines) {
            ctx.fillText(line.trim(), canvas.width / 2, y);
            y += 55;
        }
        
        // Details
        y += 30;
        ctx.textAlign = 'left';
        
        const drawDetail = (title, text, color) => {
            ctx.font = 'bold 36px "Sarabun", sans-serif';
            ctx.fillStyle = '#8b0000';
            ctx.fillText(title, 120, y);
            const titleW = ctx.measureText(title).width;
            
            ctx.font = '36px "Sarabun", sans-serif';
            ctx.fillStyle = color || '#333333';
            
            // simple text wrap for detail
            let pLines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const seg = new Intl.Segmenter('th', { granularity: 'word' });
                const segments = seg.segment(text);
                let curr = "";
                for (const {segment} of segments) {
                    if (ctx.measureText(curr + segment).width > canvas.width - 240 - titleW && curr.trim() !== "") {
                        pLines.push(curr); curr = segment;
                    } else curr += segment;
                }
                pLines.push(curr);
            } else {
                pLines.push(text.substring(0, 45) + "...");
            }
            
            ctx.fillText(pLines[0], 120 + titleW + 15, y);
            y += 50;
            for(let i=1; i<pLines.length; i++) {
                ctx.fillText(pLines[i], 120 + titleW + 15, y);
                y += 50;
            }
            y += 20;
        };

        drawDetail('💼 การงาน:', currentSiamsiResult.work, '#1a1a1a');
        drawDetail('❤️ ความรัก:', currentSiamsiResult.love, '#1a1a1a');
        drawDetail('🏥 สุขภาพ:', currentSiamsiResult.health, '#1a1a1a');
        
        // Watermark
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(139, 0, 0, 0.4)';
        ctx.font = '28px "Sarabun", sans-serif';
        ctx.fillText('สยามโหรามงคล', canvas.width / 2, canvas.height - 100);
        
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `Siamsi_${currentSiamsiResult.num}_${dateStr}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        console.error("Error generating Siamsi preview:", err);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดภาพได้', 'error');
    } finally {
        if(btn) {
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
