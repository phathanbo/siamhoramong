const fs = require('fs');

let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const newFunc = `async function generateAllCarouselDataUrls() {
    Swal.fire({
        title: 'กำลังสร้างอัลบั้มภาพ...',
        html: 'เรนเดอร์ภาพ 0 / 9',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const dateStr = document.getElementById('cfDate').value;
        const dateObj = new Date(dateStr);
        const dayNameStr = CF_DAY_NAMES[dateObj.getDay()];
        let dateTitle = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let kala = null;
        if (typeof calculateKalaYok === 'function') {
            kala = calculateKalaYok(dateObj);
        }
        
        const dateSeedBase = parseInt(dateStr.replace(/-/g, ''));
        function seededRandom(seed) {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }
        function getRandomFromDB(arr, seed) {
            if (!arr || arr.length === 0) return '-';
            const idx = Math.floor(seededRandom(seed) * arr.length);
            return arr[idx];
        }

        const canvasWidth = 1080;
        const canvasHeight = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        function drawSpaceBg() {
            // Bright elegant background
            ctx.fillStyle = '#fdfbf7';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Soft golden glow
            const r1 = ctx.createRadialGradient(540, -100, 0, 540, 200, 800);
            r1.addColorStop(0, '#fffdfa');
            r1.addColorStop(1, '#f9f4ea');
            ctx.fillStyle = r1;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Sacred geometric rings (faint gold)
            ctx.strokeStyle = 'rgba(212,175,55,0.15)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(540, 540, 350, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(540, 540, 480, 0, Math.PI*2); ctx.stroke();
            
            // Decorative corners
            const cornerSize = 40;
            ctx.strokeStyle = 'rgba(212,175,55,0.4)';
            ctx.lineWidth = 3;
            // TL
            ctx.beginPath(); ctx.moveTo(40, 40+cornerSize); ctx.lineTo(40, 40); ctx.lineTo(40+cornerSize, 40); ctx.stroke();
            // TR
            ctx.beginPath(); ctx.moveTo(1040-cornerSize, 40); ctx.lineTo(1040, 40); ctx.lineTo(1040, 40+cornerSize); ctx.stroke();
            // BL
            ctx.beginPath(); ctx.moveTo(40, 1040-cornerSize); ctx.lineTo(40, 1040); ctx.lineTo(40+cornerSize, 1040); ctx.stroke();
            // BR
            ctx.beginPath(); ctx.moveTo(1040-cornerSize, 1040); ctx.lineTo(1040, 1040); ctx.lineTo(1040, 1040-cornerSize); ctx.stroke();

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.font = 'bold 18px "Sarabun", sans-serif';
            ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1020, 1020);
        }

        // Helper to draw modern card
        function drawCard(x, y, w, h, icon, title, text, accentColor) {
            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.08)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            ctx.fillStyle = '#ffffff';
            
            // Card BG
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 20);
            ctx.fill();
            ctx.shadowColor = 'transparent';

            // Accent border on top
            if (accentColor) {
                ctx.fillStyle = accentColor;
                ctx.beginPath();
                ctx.roundRect(x, y, w, 6, [20, 20, 0, 0]);
                ctx.fill();
            }

            // Icon + Title
            ctx.textAlign = 'left';
            ctx.font = 'bold 28px "Sarabun", sans-serif';
            ctx.fillStyle = '#b8860b'; // Gold title
            ctx.fillText(icon + ' ' + title, x + 30, y + 55);

            // Text
            ctx.font = '24px "Sarabun", sans-serif';
            ctx.fillStyle = '#4a4a4a';
            if (typeof text === 'string') {
                wrapText(ctx, text, x + 30, y + 105, w - 60, 36);
            } else {
                let currentY = y + 105;
                text.forEach(item => {
                    ctx.font = 'bold 22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#8b5a2b';
                    ctx.fillText(item.label, x + 30, currentY);
                    
                    ctx.font = '22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#4a4a4a';
                    wrapText(ctx, item.val, x + 100, currentY, w - 130, 32);
                    currentY += 45;
                });
            }
        }

        let images = [];
        for (let i = 0; i < 9; i++) {
            Swal.update({ html: 'เรนเดอร์ภาพ ' + (i+1) + ' / 9' });
            await new Promise(r => setTimeout(r, 50));
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawSpaceBg();

            if (i === 0) { // Cover
                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 15;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.roundRect(140, 250, 800, 550, 30);
                ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.strokeStyle = 'rgba(212,175,55,0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(155, 265, 770, 520, 20);
                ctx.stroke();

                ctx.textAlign = 'center';
                ctx.font = 'bold 80px "Sarabun", sans-serif';
                ctx.fillStyle = '#b8860b';
                ctx.fillText('ดวงรายวัน', 540, 390);
                
                ctx.font = 'bold 50px "Sarabun", sans-serif';
                ctx.fillStyle = '#2c3e50';
                ctx.fillText('แม่นๆ มาแล้วจ้า!', 540, 480);
                
                ctx.fillStyle = '#fdfbf7';
                ctx.beginPath(); ctx.roundRect(240, 540, 600, 70, 35); ctx.fill();
                ctx.strokeStyle = '#d4af37'; ctx.stroke();
                
                ctx.fillStyle = '#333';
                ctx.font = 'bold 30px "Sarabun", sans-serif';
                ctx.fillText('ประจำวัน' + dayNameStr + 'ที่ ' + dateTitle, 540, 587);
                
                ctx.font = '32px "Sarabun", sans-serif';
                ctx.fillStyle = '#555';
                ctx.fillText('เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!', 540, 700);
                
                const btnGrad = ctx.createLinearGradient(140, 0, 940, 0);
                btnGrad.addColorStop(0, '#b8860b');
                btnGrad.addColorStop(1, '#d4af37');
                
                ctx.shadowColor = 'rgba(184,134,11,0.3)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = btnGrad;
                ctx.beginPath(); ctx.roundRect(140, 850, 800, 80, 40); ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉', 540, 898);

            } else if (i === 1) { // KalaYok
                ctx.textAlign = 'center';
                ctx.font = 'bold 46px "Sarabun", sans-serif';
                ctx.fillStyle = '#2c3e50';
                ctx.fillText('อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?', 540, 150);
                
                let badDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.ubart] : 'วันอาทิตย์';
                let bestDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.thongChai] : 'วันจันทร์';
                let powerDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.athibadi] : 'วันเสาร์';

                const panels = [
                    {x: 70, color: '#e74c3c', t1: badDayTxt, t2: "เกณฑ์ 'อุบาทว์'", desc: 'ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี', icon: '⚠️'},
                    {x: 390, color: '#27ae60', t1: bestDayTxt, t2: "เกณฑ์ 'วันธงชัย'", desc: 'ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง', icon: '🚩'},
                    {x: 710, color: '#8e44ad', t1: powerDayTxt, t2: "เกณฑ์ 'วันอธิบดี'", desc: 'ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ', icon: '👑'}
                ];

                panels.forEach(p => {
                    ctx.shadowColor = 'rgba(0,0,0,0.1)';
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 520, 25); ctx.fill();
                    ctx.shadowColor = 'transparent';
                    
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 8, [25, 25, 0, 0]); ctx.fill();

                    ctx.fillStyle = '#fcf8f2';
                    ctx.beginPath(); ctx.arc(p.x + 150, 360, 60, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = p.color; ctx.lineWidth = 4; ctx.stroke();
                    ctx.font = '50px sans-serif';
                    ctx.fillText(p.icon, p.x + 150, 375);

                    ctx.fillStyle = '#333';
                    ctx.font = 'bold 30px "Sarabun", sans-serif';
                    ctx.fillText(p.t1, p.x + 150, 480);
                    
                    ctx.fillStyle = p.color;
                    ctx.font = 'bold 26px "Sarabun", sans-serif';
                    ctx.fillText(p.t2, p.x + 150, 530);
                    
                    ctx.fillStyle = '#555';
                    ctx.font = '22px "Sarabun", sans-serif';
                    wrapText(ctx, p.desc, p.x + 150, 600, 240, 32);
                });

            } else { // Days 1-7
                const dayIdx = i - 2;
                const seed = dateSeedBase + dayIdx;
                
                let wText = '', fText = '', rawLove = '';
                if (typeof DAILY_FORTUNE_DB !== 'undefined') {
                    wText = getRandomFromDB(DAILY_FORTUNE_DB.work, seed + 1);
                    fText = getRandomFromDB(DAILY_FORTUNE_DB.finance, seed + 2);
                    rawLove = getRandomFromDB(DAILY_FORTUNE_DB.love, seed + 3);
                }
                
                let lText = 'เสน่ห์แรง มีคนเข้ามาให้ความสนใจ';
                let coupleText = 'ความรักราบรื่น ดูแลเอาใจใส่กันดี';
                if (rawLove.includes('คนมีคู่:')) {
                    let parts = rawLove.split('คนมีคู่:');
                    lText = parts[0].replace('คนโสด:', '').trim();
                    coupleText = parts[1].trim();
                }
                wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
                fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 100);
                lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);
                coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 80);

                let dColor = CF_DAY_COLORS[dayIdx];
                if (dColor === '#000000') dColor = '#34495e';
                
                const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
                let colorStr = '-';
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.roundRect(290, 80, 500, 80, 40); ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.beginPath(); ctx.arc(340, 120, 20, 0, Math.PI*2); ctx.fillStyle = dColor; ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillStyle = '#333';
                ctx.font = 'bold 44px "Sarabun", sans-serif';
                ctx.fillText('คนเกิดวัน' + CF_DAY_NAMES[dayIdx], 380, 133);

                drawCard(90, 210, 900, 170, '💼', 'การงาน', wText, dColor);
                drawCard(90, 410, 900, 170, '💰', 'การเงิน', fText, dColor);
                
                const loveData = [
                    { label: 'โสด:', val: lText },
                    { label: 'มีคู่:', val: coupleText }
                ];
                drawCard(90, 610, 900, 200, '❤️', 'ความรัก', loveData, dColor);

                ctx.shadowColor = 'rgba(0,0,0,0.1)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.roundRect(90, 850, 900, 90, 25); ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = dColor;
                ctx.font = 'bold 26px "Sarabun", sans-serif';
                ctx.fillText('✨ ทริคเสริมดวง', 130, 905);
                
                ctx.fillStyle = '#555';
                ctx.font = '24px "Sarabun", sans-serif';
                ctx.fillText('เลขมงคล: ' + luckyNum, 360, 905);
                ctx.fillText('สีมงคล: ' + colorStr, 600, 905);
            }

            images.push(canvas.toDataURL('image/png', 0.8));
        }
        
        Swal.close();
        return images;
    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');
        return null;
    }
}`;

const regex = /async function generateAllCarouselDataUrls\(\) \{[\s\S]*?return null;\s*\}\s*\}/;
const newJs = js.replace(regex, newFunc);
fs.writeFileSync('adminZodiacAutoCarousel.js', newJs);
