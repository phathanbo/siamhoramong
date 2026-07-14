function adjustScale() {
    const wrapper = document.getElementById('previewWrapper');
    const canvas = document.getElementById('renderCanvas');
    if (!wrapper || !canvas) return;

    const wrapperWidth = wrapper.clientWidth;
    const targetWidth = 1200;
    
    let scale = wrapperWidth / targetWidth;
    if (scale > 1) scale = 1;

    canvas.style.transform = `scale(${scale})`;
    wrapper.style.height = `${targetWidth * scale + 40}px`; 
}

window.addEventListener('resize', adjustScale);

// Global variable to store auto-generated summary
let autoSummary = "";

function drawThreeCards() {
    if (typeof tarotCards === 'undefined' || tarotCards.length < 3) {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี หรือข้อมูลไม่ครบ', 'error');
        return;
    }

    let selected = [];
    while(selected.length < 3) {
        let r = Math.floor(Math.random() * tarotCards.length);
        if(!selected.includes(r)) {
            selected.push(r);
        }
    }

    const card1 = tarotCards[selected[0]];
    const card2 = tarotCards[selected[1]];
    const card3 = tarotCards[selected[2]];

    // Past
    document.getElementById('name1').innerText = card1.name;
    document.getElementById('img1').src = card1.img;
    document.getElementById('desc1').innerText = card1.past;

    // Present
    document.getElementById('name2').innerText = card2.name;
    document.getElementById('img2').src = card2.img;
    document.getElementById('desc2').innerText = card2.present;

    // Future
    document.getElementById('name3').innerText = card3.name;
    document.getElementById('img3').src = card3.img;
    document.getElementById('desc3').innerText = card3.future;

    // Auto Summary
    autoSummary = `จากอิทธิพลของไพ่ ${card1.name} ชี้ให้เห็นว่าพื้นฐานอดีตของคุณมาจาก${card1.past} ในขณะที่สถานการณ์ปัจจุบันไพ่ ${card2.name} บ่งบอกถึง${card2.present} สิ่งสำคัญที่สุดคือทิศทางในอนาคต ไพ่ ${card3.name} แนะนำว่า${card3.future} ขอให้คุณใช้สติและรับมือกับสิ่งที่กำลังจะเกิดขึ้น`;
    
    // Update UI
    const customInput = document.getElementById('customSummaryInput').value;
    document.getElementById('summaryText').innerText = customInput || autoSummary;
}

async function downloadImage() {
    const canvasEl = document.getElementById('renderCanvas');
    const wrapper = document.getElementById('previewWrapper');

    // Remove scale trick to ensure high-res sharp capture
    const originalTransform = canvasEl.style.transform;
    const originalHeight = wrapper.style.height;

    canvasEl.style.transform = 'none';
    wrapper.style.height = '1200px';
    wrapper.style.overflow = 'visible';

    // Give browser a moment to repaint without scale
    await new Promise(r => setTimeout(r, 100));

    Swal.fire({
        title: 'กำลังสร้างภาพ...',
        text: 'กรุณารอสักครู่ (ภาพอาจมีขนาดใหญ่)',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const canvas = await html2canvas(canvasEl, {
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#0f0c29'
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement('a');
        
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `TarotReading_${dateStr}.png`;
        link.href = image;
        link.click();
        
        Swal.close();
    } catch (error) {
        console.error("Error generating Tarot image:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    } finally {
        canvasEl.style.transform = originalTransform;
        wrapper.style.height = originalHeight;
        wrapper.style.overflow = 'hidden';
    }
}

// Draw initial on load
window.onload = () => {
    adjustScale();
    drawThreeCards();
};
