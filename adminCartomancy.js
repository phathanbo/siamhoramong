/**
 * adminCartomancy.js
 * โลจิกสำหรับหน้า adminCartomancy.html 
 * ปรับปรุงให้ใช้ Canvas 2D API แบบ Native แทน html2canvas
 */

function openAdminCartomancyModal() {
    window.location.href = 'adminCartomancy.html';
}

function adminDrawCartomancyPage() {
    if (typeof drawSingleCartomancy !== 'function') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ป๊อก', 'error');
        return;
    }
    
    const drawType = document.getElementById('drawType').value;
    
    let cards = [];
    if (drawType === '1') {
        cards = [drawSingleCartomancy()];
    } else {
        cards = drawThreeCartomancy();
    }
    
    // บันทึกไพ่ล่าสุดไว้สำหรับวาดใหม่เมื่อแก้ข้อความเสริม
    window.lastDrawnCards = cards;
    
    renderCanvas(drawType, cards);
}

function renderEmptyCanvas() {
    const canvas = document.getElementById('cartomancyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const canvasWidth = 900;
    const canvasHeight = 600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Draw Background
    drawBackground(ctx, canvasWidth, canvasHeight);
    
    // Draw Header
    drawHeader(ctx, canvasWidth);
    
    // Draw Empty State Text
    ctx.fillStyle = '#555555';
    ctx.font = '30px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('กรุณากดสุ่มไพ่', canvasWidth / 2, canvasHeight / 2 + 50);
}

function renderCanvas(drawType, cards) {
    const canvas = document.getElementById('cartomancyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 1 card mode: 900x1200
    // 3 cards mode: 1200x900
    let canvasWidth = drawType === '1' ? 900 : 1200;
    let canvasHeight = drawType === '1' ? 1200 : 900;
    
    // Adjust height for 3 cards based on content if needed, but 900-1000 is usually enough
    if(drawType === '3') canvasHeight = 950;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Enable antialiasing (usually on by default, but good to ensure high quality)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 1. Draw Background
    drawBackground(ctx, canvasWidth, canvasHeight);
    
    // 2. Draw Header
    drawHeader(ctx, canvasWidth);
    
    const cardWidth = 220;
    const cardHeight = 310;
    const cardY = 220;
    
    if (drawType === '1') {
        // 1 Card Mode
        const cardX = (canvasWidth - cardWidth) / 2;
        drawCard(ctx, cards[0], cardX, cardY, cardWidth, cardHeight);
        
        // Draw Meaning Box below the card
        const boxY = cardY + cardHeight + 40;
        const boxWidth = 800;
        const boxX = (canvasWidth - boxWidth) / 2;
        const boxHeight = canvasHeight - boxY - 40;
        drawMeaningBox1(ctx, cards[0], boxX, boxY, boxWidth, boxHeight);
        
    } else {
        // 3 Cards Mode
        const gap = 50;
        const totalCardsWidth = (cardWidth * 3) + (gap * 2);
        let startX = (canvasWidth - totalCardsWidth) / 2;
        const positions = ['อดีต', 'ปัจจุบัน', 'อนาคต'];
        
        for (let i = 0; i < 3; i++) {
            const cardX = startX + (i * (cardWidth + gap));
            
            // Draw Position Text
            ctx.fillStyle = '#d4af37';
            ctx.font = 'bold 24px "Sarabun", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`ไพ่ใบที่ ${i + 1}`, cardX + (cardWidth/2), cardY - 40);
            ctx.font = '18px "Sarabun", sans-serif';
            ctx.fillText(`(${positions[i]})`, cardX + (cardWidth/2), cardY - 15);
            
            drawCard(ctx, cards[i], cardX, cardY, cardWidth, cardHeight);
            
            // Draw Meaning Box below each card
            const boxY = cardY + cardHeight + 40;
            const boxHeight = canvasHeight - boxY - 40;
            drawMeaningBox3(ctx, cards[i], cardX, boxY, cardWidth, boxHeight);
        }
    }
}

function drawBackground(ctx, width, height) {
    // Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a0831');
    gradient.addColorStop(1, '#0d041a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Golden Border
    ctx.strokeStyle = '#e9b64c';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, height - 32);
}

function drawHeader(ctx, width) {
    // Title
    ctx.fillStyle = '#f9d976';
    ctx.font = 'bold 45px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('สยามโหรามงคล', width / 2, 70);
    
    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Subtitle 1
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px "Sarabun", sans-serif';
    ctx.fillText('คำทำนายไพ่ป๊อกพยากรณ์', width / 2, 120);
    
    // Custom Subtitle
    const customText = document.getElementById('adminCartomancyCustomText').value || '';
    if (customText) {
        ctx.fillStyle = '#d4af37';
        ctx.font = '24px "Sarabun", sans-serif';
        ctx.fillText(customText, width / 2, 160);
    }
}

function drawCard(ctx, card, x, y, width, height) {
    const radius = 15;
    
    // Card Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    
    // Card Base
    ctx.fillStyle = '#111111';
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    
    // Card Gradient Overlay
    const cardGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    cardGradient.addColorStop(0, '#111111');
    cardGradient.addColorStop(1, '#222222');
    ctx.fillStyle = cardGradient;
    ctx.fill();
    
    // Reset shadow for content
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Card Content Color
    const textColor = card.color === 'red' ? '#ff3333' : '#e0e0e0';
    ctx.fillStyle = textColor;
    
    const rank = card.name.split(' ')[0];
    
    // Top Left Corner
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(rank, x + 25, y + 35);
    ctx.font = '28px Arial';
    ctx.fillText(card.symbol, x + 25, y + 65);
    
    // Bottom Right Corner (Upside down)
    ctx.save();
    ctx.translate(x + width - 25, y + height - 35);
    ctx.rotate(Math.PI);
    ctx.font = 'bold 24px Arial';
    ctx.fillText(rank, 0, 0);
    ctx.font = '28px Arial';
    ctx.fillText(card.symbol, 0, 30);
    ctx.restore();
    
    // Center Content
    drawCenterPips(ctx, rank, card.symbol, textColor, x, y, width, height);
}

function drawCenterPips(ctx, rank, symbol, color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const cx = x + (width / 2);
    const cy = y + (height / 2);
    
    if (['J', 'Q', 'K'].includes(rank)) {
        const icon = rank === 'K' ? '♚' : (rank === 'Q' ? '♛' : '♞');
        ctx.font = '50px Arial';
        ctx.fillText(icon, cx, cy - 30);
        ctx.font = 'bold 80px Arial';
        ctx.fillText(rank, cx, cy + 30);
        return;
    }
    
    if (rank === 'A') {
        ctx.font = '90px Arial';
        ctx.fillText(symbol, cx, cy);
        return;
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

    // Pip positioning map
    // Grid: L(eft), C(enter), R(ight) x 1(top) to 5(bottom)
    const cw = width;
    const ch = height;
    
    const posX = { 'L': x + cw * 0.3, 'C': cx, 'R': x + cw * 0.7 };
    const posY = { '1': y + ch * 0.2, '2': y + ch * 0.35, '3': cy, '4': y + ch * 0.65, '5': y + ch * 0.8 };
    
    ctx.font = '35px Arial';
    
    pips.forEach(p => {
        const col = p.charAt(0);
        const row = p.charAt(1);
        const px = posX[col];
        const py = posY[row];
        
        const invert = parseInt(row) > 3;
        
        ctx.save();
        ctx.translate(px, py);
        if (invert) ctx.rotate(Math.PI);
        ctx.fillText(symbol, 0, 0);
        ctx.restore();
    });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' '); // For Thai, word boundary is hard without a library, we might need character wrap or approximate it.
    // Thai text wrapping on canvas without Intl.Segmenter can be tricky, we'll use a basic char-by-char approach if it's purely Thai, but space split is a start.
    // Better yet, split by space, but for long Thai string, we might need a custom wrapper.
    
    // Simple custom wrapper that respects English spaces but also breaks Thai reasonably by length.
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            line = char;
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

function drawMeaningBox1(ctx, card, x, y, width, height) {
    // Box Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    
    const radius = 15;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Card Name Title
    ctx.fillStyle = '#f9d976';
    ctx.font = 'bold 32px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(card.name, x + width / 2, y + 25);
    
    // Meanings
    ctx.textAlign = 'left';
    let textY = y + 80;
    
    ctx.font = 'bold 22px "Sarabun", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🔮 ภาพรวม:', x + 30, textY);
    ctx.font = '22px "Sarabun", sans-serif';
    ctx.fillStyle = '#eeeeee';
    textY = wrapText(ctx, card.meaning, x + 140, textY, width - 170, 30);
    
    textY += 15;
    
    // Sub-boxes
    const drawSubBox = (icon, title, text, titleColor, bgColor, bdColor, sy) => {
        // Draw small bg rect
        ctx.fillStyle = bgColor;
        ctx.fillRect(x + 30, sy, width - 60, 60);
        // Draw left border
        ctx.fillStyle = bdColor;
        ctx.fillRect(x + 30, sy, 5, 60);
        
        ctx.fillStyle = titleColor;
        ctx.font = 'bold 20px "Sarabun", sans-serif';
        // We'll skip emoji/fontawesome icons in canvas to avoid missing fonts, use text instead.
        ctx.fillText(title, x + 50, sy + 18);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Sarabun", sans-serif';
        wrapText(ctx, text, x + 150, sy + 18, width - 200, 26);
        return sy + 75;
    };
    
    textY = drawSubBox('', 'การงาน:', card.work, '#81c784', 'rgba(46, 125, 50, 0.1)', '#4caf50', textY);
    textY = drawSubBox('', 'การเงิน:', card.finance, '#64b5f6', 'rgba(21, 101, 192, 0.1)', '#2196f3', textY);
    textY = drawSubBox('', 'ความรัก:', card.love, '#e57373', 'rgba(198, 40, 40, 0.1)', '#f44336', textY);
}

function drawMeaningBox3(ctx, card, x, y, width, height) {
    // Box Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    
    const radius = 10;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Card Name Title
    ctx.fillStyle = '#f9d976';
    ctx.font = 'bold 22px "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(card.name, x + width / 2, y + 15);
    
    // Line separator
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x + 20, y + 45);
    ctx.lineTo(x + width - 20, y + 45);
    ctx.strokeStyle = '#555555';
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.textAlign = 'left';
    let textY = y + 60;
    
    ctx.font = 'bold 16px "Sarabun", sans-serif';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('ความหมาย:', x + 15, textY);
    ctx.font = '16px "Sarabun", sans-serif';
    ctx.fillStyle = '#cccccc';
    textY = wrapText(ctx, card.meaning, x + 15, textY + 22, width - 30, 22);
    
    textY += 10;
    
    const drawLineInfo = (title, text, color, sy) => {
        ctx.fillStyle = color;
        ctx.font = 'bold 16px "Sarabun", sans-serif';
        ctx.fillText(title, x + 15, sy);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px "Sarabun", sans-serif';
        return wrapText(ctx, text, x + 60, sy, width - 75, 22);
    };
    
    textY = drawLineInfo('งาน:', card.work, '#81c784', textY);
    textY = drawLineInfo('เงิน:', card.finance, '#64b5f6', textY + 5);
    textY = drawLineInfo('รัก:', card.love, '#e57373', textY + 5);
}

function downloadAdminCartomancyImagePage() {
    const canvas = document.getElementById('cartomancyCanvas');
    if (!canvas) {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบ Canvas', 'error');
        return;
    }
    
    // ตรวจสอบว่ามีการสุ่มไพ่หรือยัง (ดูจาก window.lastDrawnCards)
    if (!window.lastDrawnCards || window.lastDrawnCards.length === 0) {
        Swal.fire('แจ้งเตือน', 'กรุณาสุ่มไพ่ก่อนทำการดาวน์โหลด', 'warning');
        return;
    }
    
    try {
        const dataUrl = canvas.toDataURL('image/png');
        const filename = `cartomancy_premium_${new Date().getTime()}.png`;
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
        
        Swal.fire({
            icon: 'success',
            title: 'บันทึกรูปภาพสำเร็จ!',
            confirmButtonColor: '#d4af37'
        });
    } catch (err) {
        console.error("Canvas export error:", err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถบันทึกรูปภาพได้', 'error');
    }
}
