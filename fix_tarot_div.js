const fs = require('fs');

let code = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const bad_chunk = `    if (combinedLength > 350) { fontSize = 21; lineH = 1.2; nameSize = 36; imgSize = 230; gap = 5; }
    
                <span style="color: #d4af37;">คำแนะนำ:</span> \${card.future}
            </div>`;

const good_chunk = `    if (combinedLength > 350) { fontSize = 21; lineH = 1.2; nameSize = 36; imgSize = 230; gap = 5; }
    
    container.innerHTML = \`
        <div class="tarot-overlay"></div>
        <div class="tarot-content-wrapper" style="padding: \${gap}px 0;">
            <div class="tarot-header" style="margin-bottom: \${gap}px; font-size: 40px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:26px; color:#aaa;">\${dateThai}</span></div>
            
            <img src="\${cardImgUrl}" class="tarot-card-img" style="height: \${imgSize}px; margin: 0 auto; display: block; border-radius: 10px; border: 2px solid #d4af37; margin-bottom: 0;" crossorigin="anonymous" />
            
            <h2 style="font-size: \${nameSize}px; color: #fff; margin-bottom: \${gap}px; margin-top: \${gap}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">\${card.name}</h2>
            
            <div class="tarot-meaning" style="font-size: \${fontSize}px; line-height: \${lineH}; max-width: 900px; padding: 0 40px;">
                "\${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> \${card.future}
            </div>\``;

code = code.replace(bad_chunk, good_chunk);

fs.writeFileSync('adminZodiacAutoCarousel.js', code, 'utf8');
console.log("Fixed!");
