/**
 * adminCartomancy.js
 * โลจิกสำหรับหน้า adminCartomancy.html 
 */

// โค้ดเก่าสำหรับ Modal (อาจจะไม่ถูกเรียกใช้แล้ว แต่คงไว้เผื่อจำเป็น)
function openAdminCartomancyModal() {
    window.location.href = 'adminCartomancy.html';
}

function adminDrawCartomancyPage() {
    if (typeof drawSingleCartomancy !== 'function') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ป๊อก', 'error');
        return;
    }
    
    const drawType = document.getElementById('drawType').value;
    
    if (drawType === '1') {
        renderOneCard();
    } else {
        renderThreeCards();
    }
}

// Helper to generate CSS pips for playing cards
function generatePips(rank, symbol) {
    if (['J', 'Q', 'K'].includes(rank)) {
        // Court cards: large elegant letter + crown/star
        let icon = rank === 'K' ? '♚' : (rank === 'Q' ? '♛' : '♞');
        return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <span style="font-size: 60px; line-height: 1;">${icon}</span>
                <span class="rank-large" style="font-size: 80px; margin-top: -10px;">${rank}</span>
            </div>
        `;
    }
    
    if (rank === 'A') {
        return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span style="font-size: 100px;">${symbol}</span></div>`;
    }
    
    // Number cards
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

    let gridHtml = `<div class="pip-container" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: repeat(5, 1fr); width: 100%; height: 100%; padding: 25px 35px; box-sizing: border-box;">`;
    
    for (let r = 1; r <= 5; r++) {
        for (let c of ['L', 'C', 'R']) {
            let pos = `${c}${r}`;
            let hasPip = pips.includes(pos);
            let invert = (r > 3) ? 'transform: rotate(180deg);' : '';
            gridHtml += `<div style="display: flex; justify-content: center; align-items: center; font-size: 30px; line-height: 1; ${invert}">
                            ${hasPip ? symbol : ''}
                         </div>`;
        }
    }
    
    gridHtml += `</div>`;
    return gridHtml;
}

function generatePremiumCardHtml(card) {
    const rank = card.name.split(' ')[0];
    const centerContent = generatePips(rank, card.symbol);
    
    return `
        <div class="cartomancy-wrapper" style="margin-bottom: 10px;">
            <!-- Removed 3D flip classes for html2canvas compatibility -->
            <div class="cartomancy-card admin-premium" style="cursor: default; transform: none; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);">
                <div class="card-front ${card.color}" style="transform: none; position: relative; width: 100%; height: 100%; background-color: #111; background-image: linear-gradient(135deg, #111, #222);">
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

function renderOneCard() {
    const card = drawSingleCartomancy();
    
    // Cards Render
    document.getElementById('adminCartomancyCardRender').innerHTML = generatePremiumCardHtml(card);
    
    // Meaning Box Render
    const html = `
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 15px; padding: 30px; text-align: left;">
            <h3 style="color: #f9d976; text-align: center; font-size: 2rem; margin-bottom: 20px;">${card.name}</h3>
            
            <div style="font-size: 1.2rem; line-height: 1.6; color: #eee; margin-bottom: 20px;">
                <strong>🔮 ภาพรวม:</strong> ${card.meaning}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                <div style="background: rgba(46, 125, 50, 0.1); border-left: 5px solid #4caf50; padding: 15px; border-radius: 5px;">
                    <strong style="color: #81c784; font-size: 1.2rem;"><i class="fas fa-briefcase"></i> การงาน:</strong> 
                    <span style="color: #fff; font-size: 1.1rem; line-height: 1.5;">${card.work}</span>
                </div>
                <div style="background: rgba(21, 101, 192, 0.1); border-left: 5px solid #2196f3; padding: 15px; border-radius: 5px;">
                    <strong style="color: #64b5f6; font-size: 1.2rem;"><i class="fas fa-coins"></i> การเงิน:</strong> 
                    <span style="color: #fff; font-size: 1.1rem; line-height: 1.5;">${card.finance}</span>
                </div>
                <div style="background: rgba(198, 40, 40, 0.1); border-left: 5px solid #f44336; padding: 15px; border-radius: 5px;">
                    <strong style="color: #e57373; font-size: 1.2rem;"><i class="fas fa-heart"></i> ความรัก:</strong> 
                    <span style="color: #fff; font-size: 1.1rem; line-height: 1.5;">${card.love}</span>
                </div>
            </div>
        </div>
    `;
    
    const meaningBox = document.getElementById('adminCartomancyMeaningBox');
    meaningBox.innerHTML = html;
    meaningBox.style.display = 'block';
}

function renderThreeCards() {
    const cards = drawThreeCartomancy();
    
    // Cards Render
    let cardsHtml = '';
    const positions = ['อดีต', 'ปัจจุบัน', 'อนาคต'];
    
    cards.forEach((card, index) => {
        cardsHtml += `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="color: #d4af37; font-size: 1.4rem; font-weight: bold; margin-bottom: 10px;">ไพ่ใบที่ ${index + 1} <br><small>(${positions[index]})</small></div>
                ${generatePremiumCardHtml(card)}
            </div>
        `;
    });
    
    document.getElementById('adminCartomancyCardRender').innerHTML = cardsHtml;
    
    // Meaning Box Render
    let meaningHtml = '<div class="meaning-box-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">';
    
    cards.forEach((card, index) => {
        meaningHtml += `
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 15px; padding: 20px; text-align: left; height: 100%;">
                <h4 style="color: #f9d976; text-align: center; border-bottom: 1px dashed #555; padding-bottom: 10px; margin-bottom: 15px;">
                    ${card.name}
                </h4>
                <div style="font-size: 1rem; color: #ccc; margin-bottom: 10px; line-height: 1.5;">
                    <strong class="text-gold">ความหมาย:</strong> ${card.meaning}
                </div>
                <div style="font-size: 0.95rem; color: #fff; margin-bottom: 5px;">
                    <strong style="color: #81c784;"><i class="fas fa-briefcase"></i> งาน:</strong> ${card.work}
                </div>
                <div style="font-size: 0.95rem; color: #fff; margin-bottom: 5px;">
                    <strong style="color: #64b5f6;"><i class="fas fa-coins"></i> เงิน:</strong> ${card.finance}
                </div>
                <div style="font-size: 0.95rem; color: #fff;">
                    <strong style="color: #e57373;"><i class="fas fa-heart"></i> รัก:</strong> ${card.love}
                </div>
            </div>
        `;
    });
    
    meaningHtml += '</div>';
    
    const meaningBox = document.getElementById('adminCartomancyMeaningBox');
    meaningBox.innerHTML = meaningHtml;
    meaningBox.style.display = 'block';
}

function downloadAdminCartomancyImagePage() {
    if (typeof html2canvas === 'undefined') {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบไลบรารี html2canvas', 'error');
        return;
    }

    const captureArea = document.getElementById('adminCartomancyCaptureArea');
    if (document.getElementById('adminCartomancyMeaningBox').style.display === 'none') {
        Swal.fire('แจ้งเตือน', 'กรุณาสุ่มไพ่ก่อนทำการดาวน์โหลด', 'warning');
        return;
    }
    
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            
            // ใช้วิธี Clone DOM Element เพื่อแก้ปัญหา Flexbox/Scroll บีบสเกล
            const clone = captureArea.cloneNode(true);
            
            clone.style.position = 'absolute';
            clone.style.top = '0px';
            clone.style.left = '0px';
            clone.style.zIndex = '-9999';
            clone.style.transform = 'none';
            clone.style.margin = '0';
            // Adjust width if 3 cards
            const drawType = document.getElementById('drawType').value;
            if (drawType === '3') {
                clone.style.width = '1200px'; 
            } else {
                clone.style.width = '900px';
            }
            
            document.body.appendChild(clone);

            html2canvas(clone, {
                scale: 2, 
                backgroundColor: '#1a0831',
                useCORS: true,
                logging: false
            }).then(canvas => {
                document.body.removeChild(clone);

                const filename = `cartomancy_premium_${new Date().getTime()}.png`;
                
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกรูปภาพสำเร็จ!',
                    confirmButtonColor: '#d4af37'
                });
            }).catch(err => {
                console.error("html2canvas error:", err);
                if (document.body.contains(clone)) document.body.removeChild(clone);
                Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้', 'error');
            });
        }
    });
}
