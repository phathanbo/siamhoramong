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

async function downloadCartomancyUserImage() {
    const cardData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
    if (!cardData) {
        if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่พบข้อมูลไพ่ กรุณาสุ่มไพ่ใหม่', 'error');
        else alert("ไม่พบข้อมูลไพ่ กรุณาสุ่มไพ่ใหม่");
        return;
    }
    
    try {
        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3000;
        const ctx = canvas.getContext('2d');
        
        await document.fonts.ready;
        
        const rank = cardData.name.split(' ')[0];
        const isRed = cardData.color === 'red' || ['♥', '♦'].includes(cardData.symbol);
        const cardColor = isRed ? '#ff4d4d' : '#ffffff';
        
        const drawContent = (isMeasure = false) => {
            let cy = 80;
            const cx = width / 2;
            
            if (!isMeasure) {
                let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#1a0831');
                grad.addColorStop(1, '#0d041a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, canvas.height);
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 15;
                ctx.strokeRect(15, 15, width - 30, canvas.height - 30);
                
                ctx.font = '700 60px "Chonburi"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText("สยามโหรามงคล", cx, cy);
                
                cy += 90;
                ctx.font = '400 40px "Sarabun"';
                ctx.fillStyle = '#f9e596';
                ctx.fillText("คำทำนายไพ่ป๊อกรายวัน", cx, cy);
                
                cy += 80;
            } else {
                cy += 80 + 90 + 80;
            }
            
            const cardW = 340;
            const cardH = 480;
            const cardX = cx - cardW/2;
            const cardY = cy;
            
            if (!isMeasure) {
                ctx.fillStyle = '#1a1a1a';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
                    ctx.fill();
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#d4af37';
                    ctx.stroke();
                } else {
                    ctx.fillRect(cardX, cardY, cardW, cardH);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#d4af37';
                    ctx.strokeRect(cardX, cardY, cardW, cardH);
                }
                
                ctx.fillStyle = cardColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '700 45px "Sarabun"';
                
                ctx.fillText(rank, cardX + 45, cardY + 50);
                ctx.fillText(cardData.symbol, cardX + 45, cardY + 95);
                
                ctx.save();
                ctx.translate(cardX + cardW - 45, cardY + cardH - 50);
                ctx.rotate(Math.PI);
                ctx.fillText(rank, 0, 0); 
                ctx.fillText(cardData.symbol, 0, 45); 
                ctx.restore();
                
                const drawPipGrid = () => {
                    let pips = [];
                    const num = parseInt(rank);
                    if (num === 2) pips = ['C1', 'C5'];
                    if (num === 3) pips = ['C1', 'C3', 'C5'];
                    if (num === 4) pips = ['L1', 'R1', 'L5', 'R5'];
                    if (num === 5) pips = ['L1', 'R1', 'C3', 'L5', 'R5'];
                    if (num === 6) pips = ['L1', 'R1', 'L3', 'R3', 'L5', 'R5'];
                    if (num === 7) pips = ['L1', 'R1', 'C2', 'L3', 'R3', 'L5', 'R5'];
                    if (num === 8) pips = ['L1', 'R1', 'C2', 'L3', 'R3', 'C4', 'L5', 'R5'];
                    if (num === 9) pips = ['L1', 'R1', 'L2', 'R2', 'C3', 'L4', 'R4', 'L5', 'R5'];
                    if (num === 10) pips = ['L1', 'R1', 'C2', 'L2', 'R2', 'L4', 'R4', 'C4', 'L5', 'R5'];
                    
                    const pW = 80;
                    const pH = 70;
                    const offsetX = cardX + cardW/2 - pW;
                    const offsetY = cardY + 70;
                    
                    ctx.font = '60px "Sarabun"';
                    
                    for(let r=1; r<=5; r++) {
                        for (let c of ['L', 'C', 'R']) {
                            let pos = `${c}${r}`;
                            if(pips.includes(pos)) {
                                let px = offsetX + (c === 'L' ? 0 : (c === 'C' ? pW : pW*2));
                                let py = offsetY + (r-1)*pH + pH/2;
                                
                                ctx.save();
                                ctx.translate(px, py);
                                if (r > 3) ctx.rotate(Math.PI);
                                ctx.fillText(cardData.symbol, 0, 0);
                                ctx.restore();
                            }
                        }
                    }
                };
                
                if (['J', 'Q', 'K'].includes(rank)) {
                    let icon = rank === 'K' ? '♚' : (rank === 'Q' ? '♛' : '♞');
                    ctx.font = '100px "Sarabun"';
                    ctx.fillText(icon, cardX + cardW/2, cardY + cardH/2 - 30);
                    ctx.font = '700 80px "Sarabun"';
                    ctx.fillText(rank, cardX + cardW/2, cardY + cardH/2 + 60);
                } else if (rank === 'A') {
                    ctx.font = '140px "Sarabun"';
                    ctx.fillText(cardData.symbol, cardX + cardW/2, cardY + cardH/2);
                } else {
                    drawPipGrid();
                }
            }
            cy += cardH + 60;
            
            const boxStartX = 80;
            const maxW = width - 160;
            const boxY = cy;
            
            const items = [
                { text: cardData.name, font: '700 48px "Sarabun"', color: '#f9e596', align: 'center', label: '', labelColor: '' },
                { text: cardData.meaning, font: '400 36px "Sarabun"', color: '#ffffff', align: 'left', label: '🔮 ความหมาย:', labelColor: '#ffffff', spacer: true },
                { text: cardData.work, font: '400 36px "Sarabun"', color: '#ffffff', align: 'left', label: '💼 การงาน:', labelColor: '#81c784' },
                { text: cardData.finance, font: '400 36px "Sarabun"', color: '#ffffff', align: 'left', label: '💰 การเงิน:', labelColor: '#64b5f6' },
                { text: cardData.love, font: '400 36px "Sarabun"', color: '#ffffff', align: 'left', label: '❤️ ความรัก:', labelColor: '#e57373' }
            ];
            
            let currentBoxY = boxY + 60; 
            const lineSpacing = 50;
            const parsedItems = [];
            
            ctx.textBaseline = 'top';
            for (let item of items) {
                ctx.font = item.font;
                let fullText = (item.label ? item.label + ' ' : '') + item.text;
                let pLines = [];
                
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(fullText);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > (maxW - 80) && currentLine.trim() !== '') {
                            pLines.push(currentLine);
                            currentLine = segment;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                } else {
                    let currentLine = "";
                    for (let j = 0; j < fullText.length; j++) {
                        const char = fullText[j];
                        const testLine = currentLine + char;
                        if (ctx.measureText(testLine).width > (maxW - 80) && j > 0) {
                            pLines.push(currentLine);
                            currentLine = char;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                }
                
                parsedItems.push({ ...item, lines: pLines, startY: currentBoxY });
                currentBoxY += pLines.length * lineSpacing;
                if(item.spacer) currentBoxY += 20;
                currentBoxY += 20;
            }
            currentBoxY += 40; 
            
            if (!isMeasure) {
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                if(ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(boxStartX, boxY, maxW, currentBoxY - boxY, 20);
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#d4af37';
                    ctx.stroke();
                } else {
                    ctx.fillRect(boxStartX, boxY, maxW, currentBoxY - boxY);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#d4af37';
                    ctx.strokeRect(boxStartX, boxY, maxW, currentBoxY - boxY);
                }
                
                for (let parsed of parsedItems) {
                    ctx.font = parsed.font;
                    let ty = parsed.startY;
                    for (let i = 0; i < parsed.lines.length; i++) {
                        let l = parsed.lines[i];
                        if (i === 0 && parsed.label && l.startsWith(parsed.label)) {
                            let labelW = ctx.measureText(parsed.label + ' ').width;
                            let rem = l.substring(parsed.label.length + 1);
                            
                            ctx.fillStyle = parsed.labelColor;
                            ctx.textAlign = 'left';
                            ctx.fillText(parsed.label, boxStartX + 40, ty);
                            
                            ctx.fillStyle = parsed.color;
                            ctx.fillText(' ' + rem, boxStartX + 40 + labelW, ty);
                        } else {
                            ctx.fillStyle = parsed.color;
                            ctx.textAlign = parsed.align;
                            if (parsed.align === 'center') {
                                ctx.fillText(l, width/2, ty);
                            } else {
                                ctx.fillText(l, boxStartX + 40, ty);
                            }
                        }
                        ty += lineSpacing;
                    }
                }
            }
            
            cy = currentBoxY + 80;
            return cy;
        };
        
        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);
        
        const link = document.createElement('a');
        link.download = `siamhora-cartomancy-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
    } catch (err) {
        console.error("Error generating image:", err);
        if(typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
        else alert("เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง");
    }
}
