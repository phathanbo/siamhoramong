const themes = {
    gold: {
        bg: "linear-gradient(135deg, #24243e, #302b63, #0f0c29)",
        glow: "#e8c97a",
        textColor: "#f1c40f"
    },
    pink: {
        bg: "linear-gradient(135deg, #4b134f, #c94b4b, #2c0b30)",
        glow: "#ff7eb3",
        textColor: "#ff7eb3"
    },
    blue: {
        bg: "linear-gradient(135deg, #141e30, #243b55, #0a0f18)",
        glow: "#00c6ff",
        textColor: "#00c6ff"
    },
    green: {
        bg: "linear-gradient(135deg, #134e5e, #71b280, #0b2e38)",
        glow: "#a8e063",
        textColor: "#a8e063"
    }
};

function adjustScale() {
    const wrapper = document.getElementById('previewWrapper');
    const canvas = document.getElementById('renderCanvas');
    if (!wrapper || !canvas) return;

    const wrapperHeight = wrapper.clientHeight;
    const targetHeight = 1920;
    
    let scale = wrapperHeight / targetHeight;
    if (scale > 1) scale = 1;

    canvas.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', adjustScale);

function initData() {
    if (typeof tarotCards === 'undefined') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี', 'error');
        return;
    }

    const select = document.getElementById('cardSelect');
    
    tarotCards.forEach((card, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.text = `${card.name} - ${card.meaning.substring(0,30)}...`;
        
        if (card.name === "The Sun") {
            option.selected = true;
        }
        select.appendChild(option);
    });

    updatePreview();
    adjustScale();
}

function updatePreview() {
    const themeKey = document.getElementById('themeSelect').value;
    const patternKey = document.getElementById('patternSelect').value;
    const cardIndex = document.getElementById('cardSelect').value;
    const luckyNumbers = document.getElementById('luckyNumbersInput').value;
    const customName = document.getElementById('nameInput').value;

    const theme = themes[themeKey];
    const card = tarotCards[cardIndex];

    const canvas = document.getElementById('renderCanvas');
    const glow = document.getElementById('themeGlow');
    const numbers = document.getElementById('previewNumbers');
    
    // Toggle Patterns
    const starburst = document.querySelector('.starburst');
    const mandala = document.querySelector('.mandala-bg');
    
    if (starburst) starburst.style.display = 'none';
    if (mandala) mandala.style.display = 'none';
    
    if (patternKey !== 'none' && patternKey !== 'starburst' && mandala) {
        mandala.style.display = 'block';
        let svgStr = '';
        if (patternKey === 'mandala') {
            mandala.style.backgroundSize = 'cover';
            mandala.style.backgroundRepeat = 'no-repeat';
            mandala.style.backgroundPosition = 'center';
            svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="80"/><path d="M100 10 Q140 50 190 100 Q140 150 100 190 Q60 150 10 100 Q60 50 100 10Z"/><path d="M10 100 Q50 60 100 10 Q150 60 190 100 Q150 140 100 190 Q50 140 10 100Z" transform="rotate(45 100 100)"/><circle cx="100" cy="100" r="50"/><path d="M100 50 L100 150 M50 100 L150 100" stroke-dasharray="2,2"/></g></svg>';
        } else if (patternKey === 'seed') {
            mandala.style.backgroundSize = 'cover';
            mandala.style.backgroundRepeat = 'no-repeat';
            mandala.style.backgroundPosition = 'center';
            svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="40"/><circle cx="100" cy="60" r="40"/><circle cx="100" cy="140" r="40"/><circle cx="65.36" cy="80" r="40"/><circle cx="134.64" cy="80" r="40"/><circle cx="65.36" cy="120" r="40"/><circle cx="134.64" cy="120" r="40"/><circle cx="100" cy="100" r="80"/></g></svg>';
        } else if (patternKey === 'yantra') {
            mandala.style.backgroundSize = 'cover';
            mandala.style.backgroundRepeat = 'no-repeat';
            mandala.style.backgroundPosition = 'center';
            svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="90"/><path d="M100 20 L170 140 L30 140 Z"/><path d="M100 180 L170 60 L30 60 Z"/><path d="M100 40 L150 120 L50 120 Z"/><path d="M100 160 L150 80 L50 80 Z"/><circle cx="100" cy="100" r="10" fill="rgba(212,175,55,0.4)"/></g></svg>';
        } else if (patternKey === 'flower') {
            mandala.style.backgroundSize = '200px 200px';
            mandala.style.backgroundRepeat = 'repeat';
            mandala.style.backgroundPosition = 'top left';
            svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="0" cy="0" r="50"/><circle cx="50" cy="0" r="50"/><circle cx="100" cy="0" r="50"/><circle cx="0" cy="50" r="50"/><circle cx="50" cy="50" r="50"/><circle cx="100" cy="50" r="50"/><circle cx="0" cy="100" r="50"/><circle cx="50" cy="100" r="50"/><circle cx="100" cy="100" r="50"/></g></svg>';
        } else if (patternKey === 'grid') {
            mandala.style.backgroundSize = '200px 200px';
            mandala.style.backgroundRepeat = 'repeat';
            mandala.style.backgroundPosition = 'top left';
            svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g fill="none" stroke="rgba(212,175,55,0.25)" stroke-width="1.5"><path d="M0 0 L100 100 M100 0 L0 100"/><rect x="0" y="0" width="100" height="100"/><circle cx="50" cy="50" r="35"/></g></svg>';
        }
        const b64 = btoa(svgStr);
        mandala.style.backgroundImage = "url('data:image/svg+xml;base64," + b64 + "')";
    } else if (patternKey === 'starburst' && starburst) {
        starburst.style.display = 'block';
    }

    canvas.style.background = theme.bg;
    glow.style.background = theme.glow;
    
    numbers.style.color = theme.textColor;
    numbers.style.textShadow = `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${theme.textColor}`;

    // Fix CORS for preview image
    const proxiedImgUrl = card.img; // Now using direct upload.wikimedia.org which has native CORS
    document.getElementById('previewCard').src = proxiedImgUrl;
    document.getElementById('previewNumbers').innerText = luckyNumbers;
    document.getElementById('previewName').innerText = customName || " ";
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}

async function downloadImage() {
    Swal.fire({
        title: 'กำลังสร้างวอลเปเปอร์...',
        text: 'ภาพมีความละเอียดสูงมาก กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        const width = 1080;
        const height = 1920;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const themeKey = document.getElementById('themeSelect').value;
        const patternKey = document.getElementById('patternSelect').value;
        const cardIndex = document.getElementById('cardSelect').value;
        const luckyNumbers = document.getElementById('luckyNumbersInput').value;
        const customName = document.getElementById('nameInput').value;
        
        const theme = themes[themeKey];
        const card = tarotCards[cardIndex];

        // 1. Background Gradient
        const colors = theme.bg.match(/#[a-zA-Z0-9]{3,6}/g);
        let grad = ctx.createLinearGradient(0, 0, width, height);
        if (colors && colors.length >= 3) {
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(0.5, colors[1]);
            grad.addColorStop(1, colors[2]);
        } else {
            grad.addColorStop(0, '#24243e');
            grad.addColorStop(1, '#0f0c29');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 2. Pattern
        if (patternKey !== 'none' && patternKey !== 'starburst') {
            let svgStr = '';
            let isCenter = false;
            
            if (patternKey === 'mandala') {
                isCenter = true;
                svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="80"/><path d="M100 10 Q140 50 190 100 Q140 150 100 190 Q60 150 10 100 Q60 50 100 10Z"/><path d="M10 100 Q50 60 100 10 Q150 60 190 100 Q150 140 100 190 Q50 140 10 100Z" transform="rotate(45 100 100)"/><circle cx="100" cy="100" r="50"/><path d="M100 50 L100 150 M50 100 L150 100" stroke-dasharray="2,2"/></g></svg>';
            } else if (patternKey === 'seed') {
                isCenter = true;
                svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="40"/><circle cx="100" cy="60" r="40"/><circle cx="100" cy="140" r="40"/><circle cx="65.36" cy="80" r="40"/><circle cx="134.64" cy="80" r="40"/><circle cx="65.36" cy="120" r="40"/><circle cx="134.64" cy="120" r="40"/><circle cx="100" cy="100" r="80"/></g></svg>';
            } else if (patternKey === 'yantra') {
                isCenter = true;
                svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="100" cy="100" r="90"/><path d="M100 20 L170 140 L30 140 Z"/><path d="M100 180 L170 60 L30 60 Z"/><path d="M100 40 L150 120 L50 120 Z"/><path d="M100 160 L150 80 L50 80 Z"/><circle cx="100" cy="100" r="10" fill="rgba(212,175,55,0.4)"/></g></svg>';
            } else if (patternKey === 'flower') {
                svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"><circle cx="0" cy="0" r="50"/><circle cx="50" cy="0" r="50"/><circle cx="100" cy="0" r="50"/><circle cx="0" cy="50" r="50"/><circle cx="50" cy="50" r="50"/><circle cx="100" cy="50" r="50"/><circle cx="0" cy="100" r="50"/><circle cx="50" cy="100" r="50"/><circle cx="100" cy="100" r="50"/></g></svg>';
            } else if (patternKey === 'grid') {
                svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g fill="none" stroke="rgba(212,175,55,0.25)" stroke-width="1.5"><path d="M0 0 L100 100 M100 0 L0 100"/><rect x="0" y="0" width="100" height="100"/><circle cx="50" cy="50" r="35"/></g></svg>';
            }
            
            const patImg = new Image();
            const b64 = btoa(svgStr);
            patImg.src = "data:image/svg+xml;base64," + b64;
            await new Promise(r => { patImg.onload = r; patImg.onerror = r; });
            
            if (isCenter) {
                const size = Math.max(width, height);
                ctx.drawImage(patImg, (width - size)/2, (height - size)/2, size, size);
            } else {
                const patternCanvas = document.createElement('canvas');
                patternCanvas.width = 200;
                patternCanvas.height = 200;
                const pCtx = patternCanvas.getContext('2d');
                pCtx.drawImage(patImg, 0, 0, 200, 200);
                const pattern = ctx.createPattern(patternCanvas, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, width, height);
            }
        } else if (patternKey === 'starburst') {
            ctx.save();
            ctx.translate(width/2, height/2);
            for(let i=0; i<360; i+=10) {
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.rotate(10 * Math.PI / 180);
                ctx.lineTo(0, Math.max(width, height));
                ctx.lineTo(10, Math.max(width, height));
                ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
                ctx.fill();
            }
            ctx.restore();
        }

        // 3. Stars bg
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        for (let i = 0; i < 150; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Glow Effect
        ctx.save();
        const glowX = width/2;
        const glowY = height * 0.42;
        let glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 400);
        let hex = theme.glow.replace('#', '');
        let r = parseInt(hex.substring(0,2), 16), g = parseInt(hex.substring(2,4), 16), b = parseInt(hex.substring(4,6), 16);
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath(); ctx.arc(glowX, glowY, 400, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        // 5. Magic Circle
        ctx.save();
        ctx.translate(width/2, height * 0.42);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 15]);
        ctx.beginPath(); ctx.arc(0, 0, 425, 0, Math.PI*2); ctx.stroke(); 
        
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(0, 0, 390, 0, Math.PI*2); ctx.stroke(); 
        
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, 460, 0, Math.PI*2); ctx.stroke();
        ctx.restore();

        // 6. Card Image
        if (card.img) {
            const proxiedUrl = card.img;
            const cImg = new Image(); cImg.crossOrigin = "Anonymous"; cImg.src = proxiedUrl;
            await new Promise(r => { cImg.onload=r; cImg.onerror=r; });
            
            const cardW = 500;
            const cardH = cImg.height * (500 / cImg.width);
            const cardX = width/2 - 250;
            const cardY = height * 0.20;
            
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 60; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            
            ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
            drawRoundedRect(ctx, cardX - 12, cardY - 12, cardW + 24, cardH + 24, 25);
            ctx.fill();
            ctx.shadowColor = 'transparent';
            
            ctx.fillStyle = '#d4af37';
            drawRoundedRect(ctx, cardX - 4, cardY - 4, cardW + 8, cardH + 8, 20);
            ctx.fill();
            
            ctx.beginPath(); drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 18); ctx.clip();
            ctx.drawImage(cImg, cardX, cardY, cardW, cardH);
            ctx.restore();
        }

        // 7. Lucky Numbers
        ctx.save();
        const numY = height * 0.68 + 70;
        ctx.font = '700 150px "Cinzel", serif'; 
        ctx.fillStyle = '#f1c40f';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const spacedNumbers = luckyNumbers.split('').join(String.fromCharCode(8202));
        
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 10;
        ctx.fillText(spacedNumbers, width/2, numY);
        ctx.shadowColor = 'rgba(241, 196, 15, 0.6)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 0;
        ctx.fillText(spacedNumbers, width/2, numY);
        ctx.restore();

        // 8. Text Container
        ctx.save();
        const boxW = width * 0.85;
        const boxX = (width - boxW) / 2;
        const boxY = height * 0.82;
        const boxH = 160;
        
        let boxGrad = ctx.createLinearGradient(0, boxY, 0, boxY + boxH);
        boxGrad.addColorStop(0, 'rgba(0,0,0,0.05)');
        boxGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = boxGrad;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        
        ctx.strokeStyle = 'rgba(212,175,55,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(boxX, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.stroke();
        
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.font = '24px "Sarabun"';
        ctx.fillText("✦   ✧   ✦   ✧   ✦", width/2, boxY + 50);
        
        ctx.fillStyle = '#fff';
        ctx.font = '600 50px "Sarabun"';
        ctx.shadowColor = 'rgba(0,0,0,1)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
        ctx.fillText(customName || " ", width/2, boxY + 110);
        ctx.restore();

        // 9. Watermark
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '24px "Sarabun"';
        ctx.fillText("สยามโหรามงคล", width/2, height - 50);
        ctx.restore();

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `LuckyWallpaper_${dateStr}.png`;
        link.href = image;
        link.click();
        
        Swal.close();
    } catch (error) {
        console.error("Error generating image:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
}

window.onload = initData;
