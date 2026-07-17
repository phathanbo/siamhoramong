const fs = require('fs');
let js = fs.readFileSync('adminAutoPost.js', 'utf-8');

const generateTarotTemplateStart = js.indexOf('function generateTarotTemplate');
const generateTarotTemplateEnd = js.indexOf('function generateZodiacAllTemplate');
if(generateTarotTemplateStart > -1 && generateTarotTemplateEnd > -1) {
    const newTemplate = `function generateTarotTemplate(dateObj, dateThai, container) {
    if (typeof tarotCards === 'undefined' || tarotCards.length === 0) {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฐานข้อมูลไพ่ยิปซี (tarotCards)', 'error');
        return;
    }
    const randomIdx = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[randomIdx];
    window.currentDrawnCard = card; // Store for canvas
    container.classList.add('template-tarot');
    
    const cardImgUrl = card.img || 'https://images.unsplash.com/photo-1638202513410-85f0967a149f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
    let fontSize = 32;
    let lineH = 1.4;
    let nameSize = 52;
    let imgSize = 350;
    let gap = 20;
    
    if (combinedLength > 150) { fontSize = 28; nameSize = 48; imgSize = 320; gap = 15; }
    if (combinedLength > 250) { fontSize = 24; lineH = 1.3; nameSize = 42; imgSize = 270; gap = 10; }
    if (combinedLength > 350) { fontSize = 21; lineH = 1.2; nameSize = 36; imgSize = 230; gap = 5; }
    
    container.innerHTML = \`
        <div class="tarot-overlay"></div>
        <div class="tarot-content-wrapper" style="padding: \$\{gap\}px 0;">
            <div class="tarot-header" style="margin-bottom: \$\{gap\}px; font-size: 40px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:26px; color:#aaa;">\$\{dateThai\}</span></div>
            
            <div class="tarot-card-img" style="background-image: url('\$\{cardImgUrl\}'); height: \$\{imgSize\}px; width: \$\{imgSize * 0.6\}px; background-size: cover; margin-bottom: 0;">
            </div>
            
            <h2 style="font-size: \$\{nameSize\}px; color: #fff; margin-bottom: \$\{gap\}px; margin-top: \$\{gap\}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">\$\{card.name\}</h2>
            
            <div class="tarot-meaning" style="font-size: \$\{fontSize\}px; line-height: \$\{lineH\}; max-width: 900px; padding: 0 40px;">
                "\$\{card.meaning\}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> \$\{card.future\}
            </div>
            
            <div style="position: absolute; bottom: \$\{gap\}px; font-size: 22px; color: rgba(255,255,255,0.4);">
                สยามโหรามงคล (Siamhora.com)
            </div>
        </div>
    \`;
}

// -----------------------------------------------------
// COMBINED ALL-IN-ONE GENERATORS
// -----------------------------------------------------

`;
    js = js.substring(0, generateTarotTemplateStart) + newTemplate + js.substring(generateTarotTemplateEnd + 120); // + 120 is roughly enough to skip to the end of the generator. Wait, let's just replace substring.
}

const drawTarotCanvasStart = js.indexOf('async function drawTarotCanvas');
const drawTarotCanvasEnd = js.indexOf('async function generateImage()');
if(drawTarotCanvasStart > -1 && drawTarotCanvasEnd > -1) {
    const newDrawCanvas = `async function drawTarotCanvas(ctx, dateObj, dateThai) {
    const card = window.currentDrawnCard || tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const bgImg = new Image(); bgImg.src = 'assets/tarot_bg.png';
    await new Promise(r => { bgImg.onload=r; bgImg.onerror=r; });
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);
    
    ctx.fillStyle = 'rgba(15, 10, 30, 0.4)'; ctx.fillRect(0, 0, 1080, 1080);
    drawRoundedRect(ctx, 50, 50, 980, 980, 30, 'rgba(0,0,0,0.6)', 'rgba(212,175,55,0.5)');
    
    const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
    let fontSize = 32; let lineH = 45; let startY = 720;
    let imgY = 250; let imgH = 350; let imgW = 210;
    let titleY = 660; let dateY = 180; let lineY = 210;
    
    if (combinedLength > 150) {
        fontSize = 28; lineH = 40; imgY = 230; imgH = 320; imgW = 192; titleY = 600; startY = 650; dateY = 160; lineY = 190;
    }
    if (combinedLength > 250) {
        fontSize = 24; lineH = 34; imgY = 210; imgH = 280; imgW = 168; titleY = 540; startY = 580; dateY = 150; lineY = 180;
    }
    if (combinedLength > 350) {
        fontSize = 21; lineH = 30; imgY = 200; imgH = 240; imgW = 144; titleY = 480; startY = 520; dateY = 140; lineY = 170;
    }

    ctx.textAlign = 'center'; ctx.fillStyle = '#d4af37'; ctx.font = 'bold 44px "Sarabun"';
    ctx.fillText("ไพ่ยิปซีประจำวัน", 540, dateY - 50);
    ctx.fillStyle = '#aaa'; ctx.font = '32px "Sarabun"'; ctx.fillText(dateThai, 540, dateY);
    
    ctx.beginPath(); ctx.moveTo(340, lineY); ctx.lineTo(740, lineY);
    ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 2; ctx.stroke();

    if (card.img) {
        const cImg = new Image(); cImg.src = card.img; cImg.crossOrigin = "Anonymous";
        await new Promise(r => { cImg.onload=r; cImg.onerror=r; });
        ctx.save(); ctx.beginPath(); ctx.roundRect(540 - imgW/2, imgY, imgW, imgH, 15); ctx.clip();
        ctx.drawImage(cImg, 540 - imgW/2, imgY, imgW, imgH); ctx.restore();
        ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(540 - imgW/2, imgY, imgW, imgH);
    }
    
    ctx.fillStyle = '#fff'; ctx.font = 'bold ' + (fontSize + 20) + 'px "Sarabun"';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
    ctx.fillText(card.name, 540, titleY); ctx.shadowBlur = 0;

    ctx.font = \`\$\{fontSize\}px "Sarabun"\`; ctx.fillStyle = '#fff';
    const linesMeaning = wrapText(ctx, \`"\$\{card.meaning\}"\`, 540, startY, 900, lineH);
    const nextY = startY + (linesMeaning * lineH) + (lineH * 0.5);
    
    ctx.fillStyle = '#d4af37'; ctx.fillText("คำแนะนำ:", 540, nextY);
    ctx.fillStyle = '#fff'; wrapText(ctx, card.future, 540, nextY + lineH, 900, lineH);
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '24px "Sarabun"';
    ctx.fillText("สยามโหรามงคล (Siamhora.com)", 540, 1010);
}

`;
    js = js.substring(0, drawTarotCanvasStart) + newDrawCanvas + js.substring(drawTarotCanvasEnd);
}

fs.writeFileSync('adminAutoPost.js', js, 'utf-8');
console.log("Success");
