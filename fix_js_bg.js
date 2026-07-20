const fs = require('fs');

let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const regexCanvas = /const canvas = document\.createElement\('canvas'\);[\s\S]*?images\.push\(canvas\.toDataURL\('image\/png', 0\.8\)\);\n        \}/;

const newCanvasCode = `const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // โหลดภาพพื้นหลัง AI
        const bgImage = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn('Failed to load AI background image, using fallback gradient');
                resolve(null);
            };
            img.src = 'images/carousel_bg.png';
        });

        function drawSpaceBg() {
            if (bgImage) {
                ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
            } else {
                // Fallback gradient
                const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
                bgGrad.addColorStop(0, '#0f0c29');
                bgGrad.addColorStop(0.5, '#302b63');
                bgGrad.addColorStop(1, '#24243e');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            }

            // เพิ่มความมืดด้านบนและล่างเล็กน้อยเพื่อให้ตัวหนังสือชัดเจน
            const shadowGrad = ctx.createLinearGradient(0, 0, 0, 1080);
            shadowGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
            shadowGrad.addColorStop(0.2, 'rgba(0,0,0,0)');
            shadowGrad.addColorStop(0.8, 'rgba(0,0,0,0)');
            shadowGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = shadowGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 20px "Sarabun", sans-serif';
            ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1040, 1040);
        }

        function drawCard(x, y, w, h, icon, title, text, accentColor) {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            
            ctx.fillStyle = 'rgba(15, 15, 25, 0.75)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 20);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(212,175,55,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            if (accentColor) {
                ctx.fillStyle = accentColor;
                ctx.beginPath();
                ctx.roundRect(x, y, w, 8, [20, 20, 0, 0]);
                ctx.fill();
            }

            ctx.textAlign = 'left';
            ctx.font = 'bold 30px "Sarabun", sans-serif';
            ctx.fillStyle = '#d4af37';
            ctx.fillText(icon + ' ' + title, x + 30, y + 60);

            ctx.font = '24px "Sarabun", sans-serif';
            ctx.fillStyle = '#f0f0f0';
            if (typeof text === 'string') {
                wrapText(ctx, text, x + 30, y + 110, w - 60, 36);
            } else {
                let currentY = y + 110;
                text.forEach(item => {
                    ctx.font = 'bold 22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#d4af37';
                    ctx.fillText(item.label, x + 30, currentY);
                    
                    ctx.font = '22px "Sarabun", sans-serif';
                    ctx.fillStyle = '#e0e0e0';
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

            if (i === 0) { 
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 15;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath();
                ctx.roundRect(140, 250, 800, 550, 30);
                ctx.fill();
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.strokeStyle = 'rgba(212,175,55,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(155, 265, 770, 520, 20); ctx.stroke();

                ctx.textAlign = 'center';
                ctx.font = 'bold 80px "Sarabun", sans-serif';
                ctx.fillStyle = '#d4af37';
                ctx.fillText('ดวงรายวัน', 540, 390);
                
                ctx.font = 'bold 50px "Sarabun", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('แม่นๆ มาแล้วจ้า!', 540, 480);
                
                ctx.fillStyle = 'rgba(212,175,55,0.15)';
                ctx.beginPath(); ctx.roundRect(240, 540, 600, 70, 35); ctx.fill();
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.stroke();
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px "Sarabun", sans-serif';
                ctx.fillText('ประจำวัน' + dayNameStr + 'ที่ ' + dateTitle, 540, 587);
                
                ctx.font = '32px "Sarabun", sans-serif';
                ctx.fillStyle = '#d4af37';
                ctx.fillText('เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!', 540, 700);
                
                const btnGrad = ctx.createLinearGradient(140, 0, 940, 0);
                btnGrad.addColorStop(0, '#b8860b');
                btnGrad.addColorStop(1, '#f1c40f');
                
                ctx.shadowColor = 'rgba(241,196,15,0.4)';
                ctx.shadowBlur = 25;
                ctx.fillStyle = btnGrad;
                ctx.beginPath(); ctx.roundRect(140, 850, 800, 80, 40); ctx.fill();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉', 540, 898);

            } else if (i === 1) {
                ctx.textAlign = 'center';
                ctx.font = 'bold 46px "Sarabun", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?', 540, 150);
                
                let badDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.ubart] : 'วันอาทิตย์';
                let bestDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.thongChai] : 'วันจันทร์';
                let powerDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.athibadi] : 'วันเสาร์';

                const panels = [
                    {x: 70, color: '#ff4757', t1: badDayTxt, t2: "เกณฑ์ 'อุบาทว์'", desc: 'ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี', icon: '⚠️'},
                    {x: 390, color: '#2ed573', t1: bestDayTxt, t2: "เกณฑ์ 'วันธงชัย'", desc: 'ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง', icon: '🚩'},
                    {x: 710, color: '#9b59b6', t1: powerDayTxt, t2: "เกณฑ์ 'วันอธิบดี'", desc: 'ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ', icon: '👑'}
                ];

                panels.forEach(p => {
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = 'rgba(15,15,25,0.8)';
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 520, 25); ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
                    ctx.shadowColor = 'transparent';
                    
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.roundRect(p.x, 260, 300, 8, [25, 25, 0, 0]); ctx.fill();

                    ctx.fillStyle = 'rgba(255,255,255,0.05)';
                    ctx.beginPath(); ctx.arc(p.x + 150, 360, 60, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = p.color; ctx.lineWidth = 4; ctx.stroke();
                    ctx.font = '50px sans-serif';
                    ctx.fillText(p.icon, p.x + 150, 375);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 30px "Sarabun", sans-serif';
                    ctx.fillText(p.t1, p.x + 150, 480);
                    
                    ctx.fillStyle = p.color;
                    ctx.font = 'bold 26px "Sarabun", sans-serif';
                    ctx.fillText(p.t2, p.x + 150, 530);
                    
                    ctx.fillStyle = '#dcdde1';
                    ctx.font = '22px "Sarabun", sans-serif';
                    wrapText(ctx, p.desc, p.x + 150, 600, 240, 32);
                });

            } else {
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
                if (dColor === '#000000') dColor = '#7f8c8d';
                
                const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
                let colorStr = '-';
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                ctx.shadowColor = 'rgba(0,0,0,0.4)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath(); ctx.roundRect(290, 80, 500, 80, 40); ctx.fill();
                ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.beginPath(); ctx.arc(340, 120, 20, 0, Math.PI*2); ctx.fillStyle = dColor; ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 44px "Sarabun", sans-serif';
                ctx.fillText('คนเกิดวัน' + CF_DAY_NAMES[dayIdx], 380, 133);

                drawCard(90, 210, 900, 170, '💼', 'การงาน', wText, dColor);
                drawCard(90, 410, 900, 170, '💰', 'การเงิน', fText, dColor);
                
                const loveData = [
                    { label: 'โสด:', val: lText },
                    { label: 'มีคู่:', val: coupleText }
                ];
                drawCard(90, 610, 900, 200, '❤️', 'ความรัก', loveData, dColor);

                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = 'rgba(15,15,25,0.85)';
                ctx.beginPath(); ctx.roundRect(90, 850, 900, 90, 25); ctx.fill();
                ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                ctx.fillStyle = dColor;
                ctx.font = 'bold 26px "Sarabun", sans-serif';
                ctx.fillText('✨ ทริคเสริมดวง', 130, 905);
                
                ctx.fillStyle = '#dcdde1';
                ctx.font = '24px "Sarabun", sans-serif';
                ctx.fillText('เลขมงคล: ' + luckyNum, 360, 905);
                ctx.fillText('สีมงคล: ' + colorStr, 600, 905);
            }

            images.push(canvas.toDataURL('image/png', 0.8));
        }`;

let fixedJs = js.replace(regexCanvas, newCanvasCode);

// Update renderCarouselPreview
const previewBgRegex = /const spaceBg = `\s*background: linear-gradient[^`]+`;/;
const newPreviewBg = `const spaceBg = \`
        background: url('images/carousel_bg.png') center/cover no-repeat;
    \`;`;
fixedJs = fixedJs.replace(previewBgRegex, newPreviewBg);

// Remove astroRings from preview if we use AI BG, or just keep it minimal.
// Let's remove astroRings since the AI image will have beautiful things.
fixedJs = fixedJs.replace(/\${astroRings}/g, '');

fs.writeFileSync('adminZodiacAutoCarousel.js', fixedJs);
