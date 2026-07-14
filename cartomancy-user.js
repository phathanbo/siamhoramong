/**
 * cartomancy-user.js
 * โลจิกสำหรับสุ่มไพ่ป๊อก 52 ใบ สำหรับสมาชิก (หน้าบ้าน)
 */

function initCartomancyUser() {
    // โหลดประวัติการเปิดไพ่จาก LocalStorage
    const lastDrawDate = localStorage.getItem('cartomancyLastDrawDate');
    const todayStr = new Date().toISOString().split('T')[0];
    const btn = document.getElementById('drawCartomancyBtn');
    
    if (lastDrawDate === todayStr) {
        // วันนี้จั่วไปแล้ว แสดงผลลัพธ์เดิม
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> เปิดไพ่ไปแล้ววันนี้';
            btn.classList.replace('btn-danger', 'btn-secondary');
            // btn.disabled = true; // ไม่ปิดเพื่อให้กดดูซ้ำได้
        }
        
        const savedData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
        if (savedData) {
            renderCartomancyResult(savedData, false);
        }
    } else {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-hand-sparkles mr-2"></i> จั่วไพ่';
            btn.classList.replace('btn-secondary', 'btn-danger');
            btn.disabled = false;
        }
    }
}

function drawCartomancyUser() {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDrawDate = localStorage.getItem('cartomancyLastDrawDate');
    
    // ถ้าเคยจั่วแล้ว ให้ดูซ้ำได้ แต่ไม่สุ่มใหม่
    if (lastDrawDate === todayStr) {
        const savedData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
        if (savedData) {
            renderCartomancyResult(savedData, false);
            return;
        }
    }

    const btn = document.getElementById('drawCartomancyBtn');
    if(btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสับไพ่...';
        btn.disabled = true;
    }
    
    // จำลองเวลาสับไพ่
    setTimeout(() => {
        const card = drawSingleCartomancy();
        
        // บันทึกลง LocalStorage
        localStorage.setItem('cartomancyLastDrawDate', todayStr);
        localStorage.setItem('cartomancyTodayData', JSON.stringify(card));
        
        if(btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> เปิดไพ่สำเร็จ';
            btn.classList.replace('btn-danger', 'btn-secondary');
            btn.disabled = false;
        }
        
        renderCartomancyResult(card, true);
        
    }, 1200);
}

// Helper to generate CSS pips for playing cards
function generatePips(rank, symbol) {
    if (['J', 'Q', 'K'].includes(rank)) {
        let icon = rank === 'K' ? '♚' : (rank === 'Q' ? '♛' : '♞');
        return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <span style="font-size: 50px; line-height: 1;">${icon}</span>
                <span class="rank-large" style="font-size: 70px; margin-top: -5px;">${rank}</span>
            </div>
        `;
    }
    if (rank === 'A') {
        return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span style="font-size: 80px;">${symbol}</span></div>`;
    }
    const num = parseInt(rank);
    let pips = [];
    if (num === 2) pips = ['C1', 'C5'];
    if (num === 3) pips = ['C1', 'C3', 'C5'];
    if (num === 4) pips = ['L1', 'R1', 'L5', 'R5'];
    if (num === 5) pips = ['L1', 'R1', 'C3', 'L5', 'R5'];
    if (num === 6) pips = ['L1', 'R1', 'L3', 'R3', 'L5', 'R5'];
    if (num === 7) pips = ['L1', 'R1', 'C2', 'L3', 'R3', 'L5', 'R5'];
    if (num === 8) pips = ['L1', 'R1', 'C2', 'L3', 'R3', 'C4', 'L5', 'R5'];
    if (num === 9) pips = ['L1', 'R1', 'L2', 'R2', 'C3', 'L4', 'R4', 'L5', 'R5'];
    if (num === 10) pips = ['L1', 'R1', 'C2', 'L2', 'R2', 'L4', 'R4', 'C4', 'L5', 'R5'];

    let gridHtml = `<div class="pip-container" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: repeat(5, 1fr); width: 100%; height: 100%; padding: 25px; box-sizing: border-box;">`;
    for (let r = 1; r <= 5; r++) {
        for (let c of ['L', 'C', 'R']) {
            let pos = `${c}${r}`;
            let hasPip = pips.includes(pos);
            let invert = (r > 3) ? 'transform: rotate(180deg);' : '';
            gridHtml += `<div style="display: flex; justify-content: center; align-items: center; font-size: 26px; line-height: 1; ${invert}">
                            ${hasPip ? symbol : ''}
                         </div>`;
        }
    }
    gridHtml += `</div>`;
    return gridHtml;
}

function generateCardHtml(card, animate = false) {
    const rank = card.name.split(' ')[0];
    const centerContent = generatePips(rank, card.symbol);
    return `
        <div class="cartomancy-wrapper mt-4">
            <div class="cartomancy-card mx-auto ${animate ? '' : 'flipped'}" id="userCartomancyCard" onclick="this.classList.toggle('flipped')">
                <div class="card-back"></div>
                <div class="card-front ${card.color}">
                    <div class="corner top-left">
                        <span class="rank">${rank}</span>
                        <span class="suit">${card.symbol}</span>
                    </div>
                    <div class="center" style="width: 100%; height: 100%; position: absolute; left: 0; top: 0;">
                        ${centerContent}
                    </div>
                    <div class="corner bottom-right">
                        <span class="rank">${rank}</span>
                        <span class="suit">${card.symbol}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCartomancyResult(card, animate = false) {
    const resultDiv = document.getElementById('cartomancyResult');
    resultDiv.style.display = 'block';
    
    let html = generateCardHtml(card, animate);
    
    html += `
        <div class="mt-4 text-left p-3" style="background: rgba(0,0,0,0.5); border: 1px solid #d4af37; border-radius: 10px;">
            <h4 class="text-gold text-center mb-3">${card.name}</h4>
            <p><strong>🔮 ความหมาย:</strong> ${card.meaning}</p>
            <hr class="border-secondary">
            <p><strong class="text-info"><i class="fas fa-briefcase"></i> การงาน:</strong> ${card.work}</p>
            <p><strong class="text-success"><i class="fas fa-coins"></i> การเงิน:</strong> ${card.finance}</p>
            <p><strong class="text-danger"><i class="fas fa-heart"></i> ความรัก:</strong> ${card.love}</p>
        </div>
        <div class="text-center mt-4">
            <button onclick="downloadCartomancyUserImage()" class="btn btn-warning rounded-pill px-4 py-2 font-weight-bold" style="color: #1a0831; border: 2px solid #d4af37; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">
                <i class="fas fa-download mr-2"></i> ดาวน์โหลดคำทำนาย
            </button>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    
    if (animate) {
        // ให้ผู้ใช้เห็นหลังไพ่แป๊บนึง แล้วค่อยพลิก
        setTimeout(() => {
            const cardEl = document.getElementById('userCartomancyCard');
            if(cardEl) cardEl.classList.add('flipped');
        }, 500);
    }
}

function downloadCartomancyUserImage() {
    const cardData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
    if (!cardData) {
        alert("ไม่พบข้อมูลไพ่ กรุณาสุ่มไพ่ใหม่");
        return;
    }

    // Create a temporary hidden container for capturing
    const captureDiv = document.createElement('div');
    captureDiv.style.position = 'absolute';
    captureDiv.style.left = '-9999px';
    captureDiv.style.top = '-9999px';
    captureDiv.style.width = '800px';
    captureDiv.style.padding = '50px';
    captureDiv.style.background = '#1a0831'; // Dark purple background
    captureDiv.style.backgroundImage = 'linear-gradient(135deg, #1a0831 0%, #0d041a 100%)';
    captureDiv.style.color = '#fff';
    captureDiv.style.fontFamily = "'Sarabun', sans-serif";
    captureDiv.style.border = '10px solid #d4af37';
    captureDiv.style.borderRadius = '20px';
    captureDiv.style.boxSizing = 'border-box';
    captureDiv.style.display = 'flex';
    captureDiv.style.flexDirection = 'column';
    captureDiv.style.alignItems = 'center';

    const rank = cardData.name.split(' ')[0];
    const centerPips = generatePips(rank, cardData.symbol);

    captureDiv.innerHTML = `
        <h2 style="color: #d4af37; font-size: 40px; margin-bottom: 5px; font-weight: bold;">สยามโหรามงคล</h2>
        <h3 style="color: #f9e596; font-size: 28px; margin-bottom: 40px;">คำทำนายไพ่ป๊อกรายวัน</h3>
        
        <div style="margin-bottom: 40px; transform: scale(1.2); transform-origin: top center;">
            <div class="cartomancy-card admin-premium" style="cursor: default; transform: none; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); border: 2px solid #d4af37; border-radius: 12px; overflow: hidden; width: 220px; height: 320px;">
                <div class="card-front ${cardData.color}" style="transform: none; position: relative; width: 100%; height: 100%; background-color: #111; background-image: linear-gradient(135deg, #111, #222);">
                    <div class="corner top-left" style="position: absolute; top: 10px; left: 10px; font-size: 28px; font-weight: bold; line-height: 1; text-align: center;">
                        <span class="rank" style="display: block;">${rank}</span>
                        <span class="suit" style="display: block;">${cardData.symbol}</span>
                    </div>
                    <div class="center" style="width: 100%; height: 100%; position: absolute; left: 0; top: 0; display: flex; justify-content: center; align-items: center;">
                        ${centerPips}
                    </div>
                    <div class="corner bottom-right" style="position: absolute; bottom: 10px; right: 10px; font-size: 28px; font-weight: bold; line-height: 1; text-align: center; transform: rotate(180deg);">
                        <span class="rank" style="display: block;">${rank}</span>
                        <span class="suit" style="display: block;">${cardData.symbol}</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="background: rgba(0,0,0,0.6); border: 1px solid #d4af37; border-radius: 15px; padding: 30px; width: 100%; text-align: left;">
            <h3 style="color: #f9e596; text-align: center; font-size: 32px; margin-bottom: 20px;">${cardData.name}</h3>
            <p style="font-size: 24px; line-height: 1.6; margin-bottom: 20px;"><strong>🔮 ความหมาย:</strong> ${cardData.meaning}</p>
            <p style="font-size: 20px; line-height: 1.5; margin-bottom: 15px; color: #81c784;"><strong>💼 การงาน:</strong> ${cardData.work}</p>
            <p style="font-size: 20px; line-height: 1.5; margin-bottom: 15px; color: #64b5f6;"><strong>💰 การเงิน:</strong> ${cardData.finance}</p>
            <p style="font-size: 20px; line-height: 1.5; margin-bottom: 0; color: #e57373;"><strong>❤️ ความรัก:</strong> ${cardData.love}</p>
        </div>
    `;

    document.body.appendChild(captureDiv);

    // Ensure cartomancy.css styles are loaded for the card (though we inline mostly, pips need it)
    html2canvas(captureDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `siamhora-cartomancy-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        document.body.removeChild(captureDiv);
    }).catch(err => {
        console.error("Error generating image:", err);
        alert("เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง");
        document.body.removeChild(captureDiv);
    });
}
