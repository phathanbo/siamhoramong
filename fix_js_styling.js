const fs = require('fs');

let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const newCanvasFunc = `async function generateAllCarouselDataUrls() {
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
            // Modern Dark/Mystical Background
            const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
            bgGrad.addColorStop(0, '#0f0c29');
            bgGrad.addColorStop(0.5, '#302b63');
            bgGrad.addColorStop(1, '#24243e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Magical Glow in center
            const r1 = ctx.createRadialGradient(540, 540, 0, 540, 540, 800);
            r1.addColorStop(0, 'rgba(212,175,55,0.15)');
            r1.addColorStop(1, 'transparent');
            ctx.fillStyle = r1;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Sacred geometry rings
            ctx.strokeStyle = 'rgba(212,175,55,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(540, 540, 350, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(540, 540, 500, 0, Math.PI*2); ctx.stroke();

            // Stars
            for(let s=0; s<30; s++) {
                ctx.fillStyle = 'rgba(255,255,255,' + (Math.random()*0.5 + 0.1) + ')';
                ctx.beginPath();
                ctx.arc(Math.random()*1080, Math.random()*1080, Math.random()*2+1, 0, Math.PI*2);
                ctx.fill();
            }

            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = 'bold 18px "Sarabun", sans-serif';
            ctx.fillText('🔮 สยามโหรามงคล (Siamhora)', 1020, 1040);
        }

        function drawCard(x, y, w, h, icon, title, text, accentColor) {
            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            
            // Dark Glass Card
            ctx.fillStyle = 'rgba(20, 20, 35, 0.7)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 20);
            ctx.fill();
            
            // Subtle Border
            ctx.strokeStyle = 'rgba(212,175,55,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowColor = 'transparent';

            // Accent border on top
            if (accentColor) {
                ctx.fillStyle = accentColor;
                ctx.beginPath();
                ctx.roundRect(x, y, w, 8, [20, 20, 0, 0]);
                ctx.fill();
            }

            // Icon + Title
            ctx.textAlign = 'left';
            ctx.font = 'bold 30px "Sarabun", sans-serif';
            ctx.fillStyle = '#d4af37';
            ctx.fillText(icon + ' ' + title, x + 30, y + 60);

            // Text
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

            if (i === 0) { // Cover
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 15;
                ctx.fillStyle = 'rgba(20,20,35,0.85)';
                ctx.beginPath();
                ctx.roundRect(140, 250, 800, 550, 30);
                ctx.fill();
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.shadowColor = 'transparent';
                
                // Decorative inner border
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

            } else if (i === 1) { // KalaYok
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
                    ctx.fillStyle = 'rgba(20,20,35,0.7)';
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
                if (dColor === '#000000') dColor = '#7f8c8d';
                
                const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
                let colorStr = '-';
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                ctx.shadowColor = 'rgba(0,0,0,0.4)';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(20,20,35,0.85)';
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
                ctx.fillStyle = 'rgba(20,20,35,0.85)';
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
        }
        
        Swal.close();
        return images;
    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');
        return null;
    }
}
`

const newPreviewFunc = `function renderCarouselPreview() {
    const area = document.getElementById('cfPreviewWrapper');
    if (!area) return;

    const dateStr = document.getElementById('cfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = CF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dateTitle = dateObj.toLocaleDateString('th-TH', options);

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
        if (!arr || arr.length === 0) return "-";
        const idx = Math.floor(seededRandom(seed) * arr.length);
        return arr[idx];
    }

    // CSS สำหรับ Background อวกาศโทนเข้ม หรูหรา
    const spaceBg = \`
        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    \`;
    
    // CSS สำหรับวงแหวนดาราศาสตร์
    const astroRings = \`
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:700px; height:700px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.1); box-sizing:border-box;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:1000px; height:1000px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.1); box-sizing:border-box;"></div>
    \`;

    // 1. หน้าปก (Cover)
    let slidesHtml = \`
        <div class="cf-slide" id="cf-slide-0" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; \${spaceBg}">
            \${astroRings}
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
            
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:800px; height:550px; background:rgba(20,20,35,0.85); border-radius:30px; box-shadow:0 15px 40px rgba(0,0,0,0.6); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:40px; border:3px solid #d4af37;">
                <h1 style="color:#d4af37; font-size:80px; font-weight:bold; margin-bottom:10px; text-align:center;">
                    ดวงรายวัน
                </h1>
                <h2 style="color:#ffffff; font-size:50px; font-weight:bold; margin-top:0;">แม่นๆ มาแล้วจ้า!</h2>
                <div style="background:rgba(212,175,55,0.15); border-radius:35px; border:2px solid #d4af37; padding:15px 50px; margin:30px 0;">
                    <span style="color:#fff; font-size:30px; font-weight:bold;">ประจำวัน\${dayNameStr}ที่ \${dateTitle}</span>
                </div>
                <h2 style="color:#d4af37; font-size:32px; margin-top:10px;">เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!</h2>
            </div>
            
            <div style="position:absolute; bottom:150px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg, #b8860b, #f1c40f); padding:25px 60px; border-radius:40px; box-shadow:0 10px 25px rgba(241,196,15,0.4);">
                <span style="color:#000; font-size:24px; font-weight:bold;">เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉</span>
            </div>
        </div>
    \`;

    // 2. สไลด์กาลโยค (KalaYok)
    let badDayTxt = kala ? \`วัน\${CF_DAY_NAMES[kala.ubart]}\` : 'วันอาทิตย์';
    let bestDayTxt = kala ? \`วัน\${CF_DAY_NAMES[kala.thongChai]}\` : 'วันจันทร์';
    let powerDayTxt = kala ? \`วัน\${CF_DAY_NAMES[kala.athibadi]}\` : 'วันเสาร์';

    slidesHtml += \`
        <div class="cf-slide" id="cf-slide-1" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; \${spaceBg}">
            \${astroRings}
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
            
            <div style="position:absolute; top:100px; left:0; width:100%; text-align:center;">
                <h2 style="color:#ffffff; font-size:46px; font-weight:bold;">
                    อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?
                </h2>
            </div>

            <div style="position:absolute; top:260px; left:70px; width:300px; height:520px; background:rgba(20,20,35,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.5); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#ff4757; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #ff4757; background:rgba(255,255,255,0.05); display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">⚠️</div>
                <h3 style="color:#ffffff; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${badDayTxt}</h3>
                <h4 style="color:#ff4757; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'อุบาทว์'</h4>
                <p style="color:#dcdde1; font-size:22px; text-align:center; padding:0 20px;">ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี</p>
            </div>

            <div style="position:absolute; top:260px; left:390px; width:300px; height:520px; background:rgba(20,20,35,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.5); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#2ed573; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #2ed573; background:rgba(255,255,255,0.05); display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">🚩</div>
                <h3 style="color:#ffffff; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${bestDayTxt}</h3>
                <h4 style="color:#2ed573; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'วันธงชัย'</h4>
                <p style="color:#dcdde1; font-size:22px; text-align:center; padding:0 20px;">ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง</p>
            </div>

            <div style="position:absolute; top:260px; left:710px; width:300px; height:520px; background:rgba(20,20,35,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.5); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#9b59b6; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #9b59b6; background:rgba(255,255,255,0.05); display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">👑</div>
                <h3 style="color:#ffffff; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${powerDayTxt}</h3>
                <h4 style="color:#9b59b6; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'วันอธิบดี'</h4>
                <p style="color:#dcdde1; font-size:22px; text-align:center; padding:0 20px;">ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ</p>
            </div>
        </div>
    \`;

    // 3. ดวง 7 วัน (7 Slides)
    for (let i = 0; i < 7; i++) {
        const seed = dateSeedBase + i;
        
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

        let dColor = CF_DAY_COLORS[i];
        if (dColor === '#000000') dColor = '#7f8c8d';

        const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
        let colorStr = '-';
        if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[i]]) {
            const colors = DASH_DAY_COLORS[CF_DAY_NAMES[i]].colors;
            if(colors && colors.length > 0) colorStr = colors.join(', ');
        }

        slidesHtml += \`
            <div class="cf-slide" id="cf-slide-\${i+2}" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; \${spaceBg}">
                \${astroRings}
                <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
                
                <div style="position:absolute; top:80px; left:290px; width:500px; height:80px; background:rgba(20,20,35,0.85); border:2px solid rgba(212,175,55,0.4); border-radius:40px; box-shadow:0 15px 20px rgba(0,0,0,0.4); display:flex; align-items:center; padding:0 30px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:\${dColor}; margin-right:20px;"></div>
                    <h2 style="color:#ffffff; font-size:44px; font-weight:bold; margin:0;">คนเกิดวัน\${CF_DAY_NAMES[i]}</h2>
                </div>

                <div style="position:absolute; top:210px; left:90px; width:900px; height:170px; background:rgba(20,20,35,0.7); border:2px solid rgba(212,175,55,0.3); border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.5);">
                    <div style="width:100%; height:8px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#d4af37; font-size:30px; font-weight:bold; margin-bottom:15px;">💼 การงาน</div>
                        <div style="color:#f0f0f0; font-size:24px;">\${wText}</div>
                    </div>
                </div>

                <div style="position:absolute; top:410px; left:90px; width:900px; height:170px; background:rgba(20,20,35,0.7); border:2px solid rgba(212,175,55,0.3); border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.5);">
                    <div style="width:100%; height:8px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#d4af37; font-size:30px; font-weight:bold; margin-bottom:15px;">💰 การเงิน</div>
                        <div style="color:#f0f0f0; font-size:24px;">\${fText}</div>
                    </div>
                </div>

                <div style="position:absolute; top:610px; left:90px; width:900px; height:200px; background:rgba(20,20,35,0.7); border:2px solid rgba(212,175,55,0.3); border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.5);">
                    <div style="width:100%; height:8px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#d4af37; font-size:30px; font-weight:bold; margin-bottom:15px;">❤️ ความรัก</div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div><span style="color:#d4af37; font-size:22px; font-weight:bold;">โสด:</span> <span style="color:#e0e0e0; font-size:22px;">\${lText}</span></div>
                            <div><span style="color:#d4af37; font-size:22px; font-weight:bold;">มีคู่:</span> <span style="color:#e0e0e0; font-size:22px;">\${coupleText}</span></div>
                        </div>
                    </div>
                </div>

                <div style="position:absolute; top:850px; left:90px; width:900px; height:90px; background:rgba(20,20,35,0.85); border:1px solid rgba(212,175,55,0.3); border-radius:25px; box-shadow:0 10px 15px rgba(0,0,0,0.3); display:flex; align-items:center; padding:0 40px;">
                    <div style="color:\${dColor}; font-size:26px; font-weight:bold; flex:1;">✨ ทริคเสริมดวง</div>
                    <div style="color:#dcdde1; font-size:24px; flex:1;">เลขมงคล: \${luckyNum}</div>
                    <div style="color:#dcdde1; font-size:24px; flex:1;">สีมงคล: \${colorStr}</div>
                </div>
            </div>
        \`;
    }

    area.innerHTML = slidesHtml;
    const containerWidth = area.parentElement.clientWidth;
    const scale = (containerWidth - 20) / 1080;
    const slides = document.querySelectorAll('.cf-slide');
    slides.forEach(s => {
        s.style.transform = \`scale(\${scale})\`;
        s.style.transformOrigin = 'top left';
        s.style.marginBottom = \`-\${1080 * (1 - scale) - 20}px\`;
    });
}
`;

const regexCanvas = /async function generateAllCarouselDataUrls\(\) \{[\s\S]*?return null;\s*\}\s*\}/;
const regexPreview = /function renderCarouselPreview\(\) \{[\s\S]*?area\.innerHTML = slidesHtml;[\s\S]*?\}\s*\n/m;

let fixedJs = js.replace(regexCanvas, () => newCanvasFunc);
fixedJs = fixedJs.replace(regexPreview, () => newPreviewFunc);
fs.writeFileSync('adminZodiacAutoCarousel.js', fixedJs);
