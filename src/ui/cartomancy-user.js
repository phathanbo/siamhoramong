/**
 * cartomancy-user.js
 * โลจิกสำหรับทำนายไพ่ป๊อก 52 ใบ สำหรับสมาชิก (หน้าบ้าน)
 * รองรับโหมด:
 * 1. daily: จั่วรายวัน 1 ใบ
 * 2. timeline: ผัง 3 กาล (อดีต - ปัจจุบัน - อนาคต)
 * 3. quadrant: ผัง 4 มิติ (ตนเอง - การงาน - การเงิน - ความรัก)
 */

let currentCartoMode = 'daily'; // 'daily', 'timeline', 'quadrant'
let lastDrawnCards = [];

function switchCartomancyMode(mode) {
    currentCartoMode = mode;
    
    // อัปเดตสถานะปุ่ม
    const btnMap = {
        daily: 'cartoModeBtn1',
        timeline: 'cartoModeBtn3',
        quadrant: 'cartoModeBtn4'
    };
    
    ['daily', 'timeline', 'quadrant'].forEach(m => {
        const btn = document.getElementById(btnMap[m]);
        if (btn) {
            if (m === mode) {
                btn.classList.add('active');
                btn.classList.replace('btn-outline-warning', 'btn-warning');
            } else {
                btn.classList.remove('active');
                btn.classList.replace('btn-warning', 'btn-outline-warning');
            }
        }
    });

    const drawBtn = document.getElementById('drawCartomancyBtn');
    if (drawBtn) {
        drawBtn.innerHTML = '<i class="fas fa-hand-sparkles mr-2"></i> สับไพ่และเสี่ยงทาย';
        drawBtn.disabled = false;
        drawBtn.classList.replace('btn-secondary', 'btn-danger');
    }

    const resultDiv = document.getElementById('cartomancyResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }

    // หากเป็นโหมดรายวัน ให้เช็คว่าวันนี้เคยจั่วไปแล้วหรือไม่
    if (mode === 'daily') {
        initCartomancyUser();
    }
}

function initCartomancyUser() {
    if (currentCartoMode !== 'daily') return;

    const lastDrawDate = localStorage.getItem('cartomancyLastDrawDate');
    const todayStr = new Date().toISOString().split('T')[0];
    const btn = document.getElementById('drawCartomancyBtn');
    
    if (lastDrawDate === todayStr) {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> ดูผลทำนายวันนี้';
            btn.classList.replace('btn-danger', 'btn-secondary');
        }
        
        const savedData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
        if (savedData) {
            renderCartomancyResult([savedData], false, 'daily');
        }
    } else {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-hand-sparkles mr-2"></i> จั่วไพ่รายวัน';
            btn.classList.replace('btn-secondary', 'btn-danger');
            btn.disabled = false;
        }
    }
}

function drawCartomancyUser() {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDrawDate = localStorage.getItem('cartomancyLastDrawDate');
    
    // ถ้าโหมดรายวันและเคยจั่วแล้ว ให้เปิดดูผลเดิม
    if (currentCartoMode === 'daily' && lastDrawDate === todayStr) {
        const savedData = JSON.parse(localStorage.getItem('cartomancyTodayData'));
        if (savedData) {
            renderCartomancyResult([savedData], false, 'daily');
            return;
        }
    }

    const btn = document.getElementById('drawCartomancyBtn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสับไพ่ ๕๒ ใบ...';
        btn.disabled = true;
    }
    
    setTimeout(() => {
        let cards = [];
        if (currentCartoMode === 'daily') {
            const single = drawSingleCartomancy();
            cards = [single];
            localStorage.setItem('cartomancyLastDrawDate', todayStr);
            localStorage.setItem('cartomancyTodayData', JSON.stringify(single));
        } else if (currentCartoMode === 'timeline') {
            cards = drawMultipleCartomancy(3);
        } else if (currentCartoMode === 'quadrant') {
            cards = drawMultipleCartomancy(4);
        }
        
        lastDrawnCards = cards;

        if (btn) {
            btn.innerHTML = '<i class="fas fa-redo"></i> เสี่ยงทายใหม่อีกครั้ง';
            btn.classList.replace('btn-danger', 'btn-secondary');
            btn.disabled = false;
        }
        
        renderCartomancyResult(cards, true, currentCartoMode);
        
    }, 900);
}

function drawMultipleCartomancy(count = 3) {
    const activeData = (typeof ACTIVE_CARTOMANCY_DATA !== 'undefined' && Object.keys(ACTIVE_CARTOMANCY_DATA).length > 0)
        ? ACTIVE_CARTOMANCY_DATA 
        : CARTOMANCY_DATA;

    const keys = Object.keys(activeData);
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    const pickedKeys = shuffled.slice(0, Math.min(count, keys.length));
    
    return pickedKeys.map(k => {
        const c = Object.assign({}, activeData[k]);
        c.id = k;
        return c;
    });
}

// Helper to generate CSS pips for playing cards
function generatePips(rank, symbol) {
    if (['J', 'Q', 'K'].includes(rank)) {
        let icon = rank === 'K' ? '♚' : (rank === 'Q' ? '♛' : '♞');
        return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <span style="font-size: 42px; line-height: 1;">${icon}</span>
                <span class="rank-large" style="font-size: 55px; margin-top: -5px;">${rank}</span>
            </div>
        `;
    }
    if (rank === 'A') {
        return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span style="font-size: 65px;">${symbol}</span></div>`;
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

    let gridHtml = `<div class="pip-container" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: repeat(5, 1fr); width: 100%; height: 100%; padding: 18px; box-sizing: border-box;">`;
    for (let r = 1; r <= 5; r++) {
        for (let c of ['L', 'C', 'R']) {
            let pos = `${c}${r}`;
            let hasPip = pips.includes(pos);
            let invert = (r > 3) ? 'transform: rotate(180deg);' : '';
            gridHtml += `<div style="display: flex; justify-content: center; align-items: center; font-size: 20px; line-height: 1; ${invert}">
                            ${hasPip ? symbol : ''}
                         </div>`;
        }
    }
    gridHtml += `</div>`;
    return gridHtml;
}

function generateSingleCardMarkup(card, idx = 0, animate = false) {
    const rank = card.name.split(' ')[0];
    const centerContent = generatePips(rank, card.symbol);
    return `
        <div class="cartomancy-wrapper mt-2">
            <div class="cartomancy-card mx-auto ${animate ? '' : 'flipped'}" id="userCartoCard_${idx}" onclick="this.classList.toggle('flipped')">
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

function renderCartomancyResult(cards, animate = false, mode = 'daily') {
    const resultDiv = document.getElementById('cartomancyResult');
    resultDiv.style.display = 'block';
    lastDrawnCards = cards;

    let positionLabels = [];
    if (mode === 'daily') {
        positionLabels = [{ title: "ดวงชะตาประจำวัน", badge: "ภาพรวมวันนี้", icon: "fa-sun" }];
    } else if (mode === 'timeline') {
        positionLabels = [
            { title: "๑. อดีต (สิ่งที่เป็นรากฐาน/ที่มา)", badge: "อดีต", icon: "fa-history" },
            { title: "๒. ปัจจุบัน (สถานการณ์ที่กำลังเผชิญ)", badge: "ปัจจุบัน", icon: "fa-clock" },
            { title: "๓. อนาคต (แนวโน้มและบทสรุป)", badge: "อนาคต", icon: "fa-arrow-right" }
        ];
    } else if (mode === 'quadrant') {
        positionLabels = [
            { title: "๑. ตัวตนและจิตใจ (สภาวะตนเอง)", badge: "ตัวตน", icon: "fa-user" },
            { title: "๒. การงานและหน้าที่ (ความก้าวหน้า)", badge: "การงาน", icon: "fa-briefcase" },
            { title: "๓. การเงินและโชคลาภ (ทรัพย์สิน)", badge: "การเงิน", icon: "fa-coins" },
            { title: "๔. ความรักและความสัมพันธ์ (คนใกล้ชิด)", badge: "ความรัก", icon: "fa-heart" }
        ];
    }

    let html = `
        <div class="text-center my-4">
            <h4 class="text-warning font-weight-bold" style="letter-spacing: 0.5px;">
                <i class="fas fa-crown mr-2"></i> ผลการทำนาย${mode === 'daily' ? 'รายวัน' : (mode === 'timeline' ? 'ผัง ๓ กาล' : 'ผัง ๔ มิติ')}
            </h4>
            <p class="text-white-50 small mb-0">ถอดรหัสคำทำนายจากสำรับมาตรฐาน ๕๒ ใบ</p>
        </div>
        <div class="row justify-content-center">
    `;

    cards.forEach((card, i) => {
        const meta = positionLabels[i] || { title: `ตำแหน่งที่ ${i+1}`, badge: `ใบที่ ${i+1}`, icon: "fa-star" };
        const colClass = cards.length === 1 ? 'col-12 col-md-8' : (cards.length === 3 ? 'col-12 col-lg-4 mb-4' : 'col-12 col-md-6 mb-4');

        // ตรวจสอบสีและชื่อดอก
        const suitNameMap = {
            'Spades': 'โพดำ',
            'Hearts': 'โพแดง',
            'Diamonds': 'ข้าวหลามตัด',
            'Clubs': 'ดอกจิก'
        };
        const suitTh = suitNameMap[card.suit] || '';

        html += `
            <div class="${colClass}">
                <div class="card h-100 shadow-lg text-white" style="background: linear-gradient(145deg, rgba(20, 28, 50, 0.95) 0%, rgba(11, 17, 33, 0.98) 100%); border: 1.5px solid rgba(212, 175, 55, 0.35); border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.5);">
                    
                    <!-- Card Top Header -->
                    <div class="d-flex justify-content-between align-items-center px-3 py-2" style="background: rgba(0,0,0,0.45); border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
                        <span class="text-warning font-weight-bold" style="font-size: 0.92rem;">
                            <i class="fas ${meta.icon} mr-1"></i> ${meta.title}
                        </span>
                        <span class="badge px-2 py-1" style="background: rgba(212, 175, 55, 0.2); color: #ffd700; border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; font-size: 0.78rem;">
                            ${meta.badge}
                        </span>
                    </div>

                    <!-- Card Body & Interactive Card -->
                    <div class="card-body p-3 p-md-4 text-center">
                        ${generateSingleCardMarkup(card, i, animate)}
                        
                        <!-- Title & Badges -->
                        <div class="mt-3 mb-2">
                            <h5 class="text-gold font-weight-bold mb-1" style="font-size: 1.25rem;">
                                ${card.name}
                            </h5>
                            <span class="badge px-2 py-1 text-white-50" style="background: rgba(255,255,255,0.06); font-size: 0.8rem;">
                                หมวดหมู่: ${suitTh} (${card.symbol})
                            </span>
                        </div>

                        <!-- Core Meaning Box -->
                        <div class="text-left p-3 my-3 rounded" style="background: rgba(0, 0, 0, 0.35); border-left: 3.5px solid #ffd700; font-size: 0.92rem; line-height: 1.6; color: #e2e8f0;">
                            <strong class="text-warning d-block mb-1"><i class="fas fa-sparkles mr-1"></i> ภาพรวมดวงชะตา:</strong>
                            ${card.meaning}
                        </div>
                        
                        <!-- Aspects Section (Grid breakdown) -->
                        <div class="text-left" style="display: grid; gap: 8px;">
                            <div class="p-2 rounded d-flex align-items-start" style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.2);">
                                <span class="badge badge-info mr-2 px-2 py-1" style="min-width: 58px; font-size: 0.78rem;"><i class="fas fa-briefcase mr-1"></i>การงาน</span>
                                <span style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.45;">${card.work}</span>
                            </div>

                            <div class="p-2 rounded d-flex align-items-start" style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2);">
                                <span class="badge badge-success mr-2 px-2 py-1" style="min-width: 58px; font-size: 0.78rem;"><i class="fas fa-coins mr-1"></i>การเงิน</span>
                                <span style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.45;">${card.finance}</span>
                            </div>

                            <div class="p-2 rounded d-flex align-items-start" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2);">
                                <span class="badge badge-danger mr-2 px-2 py-1" style="min-width: 58px; font-size: 0.78rem;"><i class="fas fa-heart mr-1"></i>ความรัก</span>
                                <span style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.45;">${card.love}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    if (mode === 'daily') {
        html += `
            <div class="text-center mt-3">
                <button onclick="downloadCartomancyUserImage()" class="btn btn-sm btn-outline-warning rounded-pill px-3 py-1 font-weight-bold" style="border: 1.5px solid #d4af37; box-shadow: 0 2px 10px rgba(212, 175, 55, 0.25); font-size: 0.85rem;">
                    <i class="fas fa-download mr-1"></i> บันทึกรูปภาพคำทำนาย
                </button>
            </div>
        `;
    }

    resultDiv.innerHTML = html;

    if (animate) {
        cards.forEach((_, idx) => {
            setTimeout(() => {
                const cardEl = document.getElementById(`userCartoCard_${idx}`);
                if (cardEl) cardEl.classList.add('flipped');
            }, 300 + (idx * 250));
        });
    }

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

// Global exposure for UI onclick handlers and tab switches
window.switchCartomancyMode = switchCartomancyMode;
window.initCartomancyUser = initCartomancyUser;
window.drawCartomancyUser = drawCartomancyUser;
window.downloadCartomancyUserImage = downloadCartomancyUserImage;
window.downloadCartomancyShareImage = downloadCartomancyUserImage;

