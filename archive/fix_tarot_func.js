const fs = require('fs');
let code = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const badFunctionStr = code.substring(code.indexOf('function generateTarotTemplate'), code.indexOf('// -----------------------------------------------------'));

const correctFunction = `function generateTarotTemplate(dateObj, dateThai, container) {
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
        <div class="tarot-content-wrapper" style="padding: \${gap}px 0;">
            <div class="tarot-header" style="margin-bottom: \${gap}px; font-size: 40px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:26px; color:#aaa;">\${dateThai}</span></div>
            
            <img src="\${cardImgUrl}" class="tarot-card-img" style="height: \${imgSize}px; margin: 0 auto; display: block; border-radius: 10px; border: 2px solid #d4af37; margin-bottom: 0;" crossorigin="anonymous" />
            
            <h2 style="font-size: \${nameSize}px; color: #fff; margin-bottom: \${gap}px; margin-top: \${gap}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">\${card.name}</h2>
            
            <div class="tarot-meaning" style="font-size: \${fontSize}px; line-height: \${lineH}; max-width: 900px; padding: 0 40px;">
                "\${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> \${card.future}
            </div>
            
            <div style="position: absolute; bottom: \${gap}px; font-size: 22px; color: rgba(255,255,255,0.4);">
                สยามโหรามงคล (Siamhora.com)
            </div>
        </div>
    \`;
}

`;

code = code.replace(badFunctionStr, correctFunction);
fs.writeFileSync('adminZodiacAutoCarousel.js', code, 'utf8');
console.log('generateTarotTemplate fully restored!');
