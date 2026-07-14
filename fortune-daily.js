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
    const ticketEl = document.getElementById('siamsiTicket');
    
    // Show loading state on button
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังบันทึก...';
    btn.disabled = true;
    
    try {
        const canvas = await html2canvas(ticketEl, {
            scale: 2,
            backgroundColor: "#fffdf5",
            useCORS: true
        });
        
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `Siamsi_${currentSiamsiResult.num}_${dateStr}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        console.error("Error generating Siamsi preview:", err);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดภาพได้', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
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
