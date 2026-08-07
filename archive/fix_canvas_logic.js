const fs = require('fs');
let code = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const newFunction = `
// -----------------------------------------------------
// NATIVE SINGLE CANVAS GENERATOR
// -----------------------------------------------------
async function generateSingleNativeCanvas() {
    const category = document.getElementById('categorySelect').value;
    const dateStr = document.getElementById('dateSelect').value;
    const targetId = document.getElementById('targetSelect').value;
    
    if (!dateStr) {
        throw new Error('กรุณาเลือกวันที่');
    }
    
    await document.fonts.ready;
    const dateObj = new Date(dateStr);
    const dateThai = formatDateThai(dateObj);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    const bgImage = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = 'images/carousel_bg.png';
    });
    
    function drawSpaceBg() {
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, 1080, 1080);
        } else {
            const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
            bgGrad.addColorStop(0, '#0f0c29');
            bgGrad.addColorStop(0.5, '#302b63');
            bgGrad.addColorStop(1, '#24243e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 1080, 1080);
        }

        const shadowGrad = ctx.createLinearGradient(0, 0, 0, 1080);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
        shadowGrad.addColorStop(0.2, 'rgba(0,0,0,0)');
        shadowGrad.addColorStop(0.8, 'rgba(0,0,0,0)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, 0, 1080, 1080);

        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 20px "Sarabun", sans-serif';
        ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1040, 1040);
    }
    
    if (category === 'zodiac') {
        if (typeof generateDailyZodiacFortunes !== 'function') throw new Error("ไม่พบฟังก์ชันดึงข้อมูล 12 ราศี");
        const predictions = generateDailyZodiacFortunes(dateObj);
        const pred = predictions.find(p => p.id == targetId);
        if (!pred) throw new Error("ไม่พบข้อมูลราศีที่เลือก");
        drawSpaceBg();
        await drawZodiacCanvas(ctx, dateObj, dateThai);
    } else if (category === 'sevendays') {
        drawSpaceBg();
        await drawSevendaysCanvas(ctx, dateObj, dateThai);
    } else if (category === 'tarot') {
        await drawTarotCanvas(ctx, dateObj, dateThai);
    } else if (category === 'zodiac_all') {
        await drawZodiacAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'sevendays_all') {
        await drawSevendaysAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'thai_ascendant_all') {
        await drawThaiAscendantAllCanvas(ctx, dateObj, dateThai);
    } else if (category === 'thai_animal_all') {
        await drawThaiAnimalAllCanvas(ctx, dateObj, dateThai);
    }
    
    return canvas;
}

`;

// Insert the new function before downloadImage
code = code.replace('async function downloadImage() {', newFunction + 'async function downloadImage() {');

// Replace renderElementToCanvas calls in downloadImage and postSingleToFacebook
code = code.replace(/const canvas = await renderElementToCanvas\('captureArea', \{ width: 1080, height: 1080 \}\);/g, 'const canvas = await generateSingleNativeCanvas();');

fs.writeFileSync('adminZodiacAutoCarousel.js', code, 'utf8');
console.log('Successfully injected generateSingleNativeCanvas!');
