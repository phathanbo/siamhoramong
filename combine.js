const fs = require('fs');
let autoPostJs = fs.readFileSync('adminAutoPost.js', 'utf8');
let carouselJs = fs.readFileSync('adminCarouselFortune.js', 'utf8');

let combined = `
// --- Combined Logic for adminZodiacAutoCarousel ---

function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    
    if(mode === 'single') {
        document.getElementById('tabSingle').classList.add('active');
        document.getElementById('singleControls').style.display = 'block';
        document.getElementById('carouselControls').style.display = 'none';
        
        document.getElementById('captureArea').style.display = 'flex';
        document.getElementById('singlePreviewBtns').style.display = 'block';
        document.getElementById('cfPreviewWrapper').style.display = 'none';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่าง (ขนาด 1080x1080)';
    } else {
        document.getElementById('tabCarousel').classList.add('active');
        document.getElementById('singleControls').style.display = 'none';
        document.getElementById('carouselControls').style.display = 'block';
        
        document.getElementById('captureArea').style.display = 'none';
        document.getElementById('singlePreviewBtns').style.display = 'none';
        document.getElementById('cfPreviewWrapper').style.display = 'flex';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่างอัลบั้ม 9 ภาพ (เลื่อนลงเพื่อดูทั้งหมด)';
        
        const dateInput = document.getElementById('cfDate');
        if (!dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        renderCarouselPreview();
    }
}

// -------------------------------------
// AUTO POST LOGIC (Single)
// -------------------------------------
`;

autoPostJs = autoPostJs.replace('async function postToFacebook() {', 'async function postSingleToFacebook() {');
combined += autoPostJs;

combined += `
// -------------------------------------
// CAROUSEL LOGIC
// -------------------------------------
`;

carouselJs = carouselJs.replace(/function openCarouselFortuneModal\(\) \{[\s\S]*?function closeCarouselFortuneModal\(\) \{[\s\S]*?\}/, '');
combined += carouselJs;

combined += `
async function generateAllCarouselDataUrls() {
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
            ctx.fillStyle = '#0d1221';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            const r1 = ctx.createRadialGradient(216, 324, 0, 216, 324, 432);
            r1.addColorStop(0, '#1a2235');
            r1.addColorStop(1, 'transparent');
            ctx.fillStyle = r1;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            const r2 = ctx.createRadialGradient(864, 756, 0, 864, 756, 432);
            r2.addColorStop(0, '#1a2235');
            r2.addColorStop(1, 'transparent');
            ctx.fillStyle = r2;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(540, 540, 300, 0, Math.PI*2); ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.beginPath(); ctx.arc(540, 540, 400, 0, Math.PI*2); ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,0.02)';
            ctx.beginPath(); ctx.arc(540, 540, 500, 0, Math.PI*2); ctx.stroke();
            
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = 'bold 18px "Sarabun", sans-serif';
            ctx.fillText('🔮 สยามโหรามงคล', 1050, 1060);
        }

        let images = [];
        for (let i = 0; i < 9; i++) {
            Swal.update({ html: 'เรนเดอร์ภาพ ' + (i+1) + ' / 9' });
            await new Promise(r => setTimeout(r, 50));
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawSpaceBg();

            if (i === 0) { // Cover
                drawRoundedRect(ctx, 140, 315, 800, 450, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', {color:'rgba(0,0,0,0.5)', blur:40});
                ctx.textAlign = 'center';
                ctx.font = 'bold 64px "Sarabun", sans-serif';
                drawStrokedText(ctx, 'ดวงรายวัน', 540, 380, '#d4af37', 'rgba(212,175,55,0.3)', 2);
                drawStrokedText(ctx, 'แม่นๆ มาแล้วจ้า!', 540, 460, '#d4af37', 'rgba(212,175,55,0.3)', 2);
                drawRoundedRect(ctx, 240, 520, 600, 60, 30, 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = '28px "Sarabun", sans-serif';
                ctx.fillText('ประจำวัน' + dayNameStr + 'ที่ ' + dateTitle, 540, 560);
                ctx.font = 'bold 36px "Sarabun", sans-serif';
                ctx.fillText('เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!', 540, 650);
                const btnGrad = ctx.createLinearGradient(140, 0, 940, 0);
                btnGrad.addColorStop(0, '#3498db');
                btnGrad.addColorStop(1, '#9b59b6');
                drawRoundedRect(ctx, 140, 850, 800, 80, 40, btnGrad, null, {color:'rgba(0,0,0,0.5)', blur:30});
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉', 540, 898);

            } else if (i === 1) { // KalaYok
                ctx.textAlign = 'center';
                ctx.font = 'bold 50px "Sarabun", sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText('ฐานดวงประจำปี: ใครดวงปัง ใครต้องระวัง?', 540, 160);
                
                let badDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.ubart] : 'วันอาทิตย์';
                let bestDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.thongChai] : 'วันจันทร์';
                let powerDayTxt = kala ? 'วัน' + CF_DAY_NAMES[kala.athibadi] : 'วันเสาร์';

                const panels = [
                    {x: 70, color: '#e74c3c', t1: badDayTxt, t2: "เกณฑ์ 'อุบาทว์'", desc: 'ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี'},
                    {x: 390, color: '#2ecc71', t1: bestDayTxt, t2: "เกณฑ์ 'วันธงชัย'", desc: 'ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง'},
                    {x: 710, color: '#9b59b6', t1: powerDayTxt, t2: "เกณฑ์ 'วันอธิบดี'", desc: 'ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ'}
                ];

                panels.forEach(p => {
                    drawRoundedRect(ctx, p.x, 350, 300, 450, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, 350, 300, 5); 
                    ctx.beginPath(); ctx.arc(p.x + 150, 460, 75, 0, Math.PI*2);
                    ctx.strokeStyle = p.color; ctx.lineWidth = 10; ctx.stroke();
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 28px "Sarabun", sans-serif';
                    ctx.fillText(p.t1, p.x + 150, 600);
                    ctx.fillText(p.t2, p.x + 150, 640);
                    ctx.fillStyle = '#bbb';
                    ctx.font = '20px "Sarabun", sans-serif';
                    wrapText(ctx, p.desc, p.x + 150, 700, 260, 30);
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
                wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);

                const dColor = CF_DAY_COLORS[dayIdx];
                const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
                let colorStr = '-';
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                drawRoundedRect(ctx, 340, 80, 400, 70, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', {color: dColor, blur: 30});
                ctx.beginPath(); ctx.arc(380, 115, 15, 0, Math.PI*2); ctx.fillStyle = dColor; ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 48px "Sarabun", sans-serif';
                ctx.fillText('คนเกิดวัน' + CF_DAY_NAMES[dayIdx], 420, 130);

                drawRoundedRect(ctx, 110, 250, 860, 140, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('💼 การงาน', 230, 290);
                ctx.font = '22px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                ctx.fillText(wText, 230, 330);

                drawRoundedRect(ctx, 110, 415, 860, 140, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('💰 การเงิน', 230, 455);
                ctx.font = '22px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                ctx.fillText(fText, 230, 495);

                drawRoundedRect(ctx, 110, 580, 860, 200, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('❤️ ความรัก', 230, 620);
                ctx.fillText('โสด', 400, 620);
                ctx.fillText('มีคู่', 700, 620);
                
                ctx.font = '20px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                wrapText(ctx, lText, 400, 670, 350, 28);
                ctx.fillStyle = '#999';
                wrapText(ctx, coupleText, 700, 670, 350, 28);

                drawRoundedRect(ctx, 110, 890, 860, 70, 15, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText('ทริคเสริมดวง', 150, 935);
                ctx.fillText('เลขมงคล: ' + luckyNum, 380, 935);
                ctx.fillText('สีมงคล: ' + colorStr, 650, 935);
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

async function postCarouselToFacebook() {
    try {
        const images = await generateAllCarouselDataUrls();
        if (!images || images.length === 0) return;
        
        const dateStr = document.getElementById('cfDate').value;
        const msg = '🔮 ดวงรายวันประจำวันที่ ' + dateStr + '\\n\\nพร้อมเสิร์ฟดวง 7 วัน เกิดปัง เกิดปิ๊ง แค่ไหน เช็คเลย! 👉\\n\\n#สยามโหรามงคล #ดวงรายวัน #ดูดวง';
        
        let imagesHtml = '';
        images.forEach((img) => {
            imagesHtml += `<img src="${img}" style="width: 48%; margin: 1%; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.3); display: inline-block;">`;
        });
        
        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์อัลบั้ม',
                        html: `
                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Siam&background=4F46E5&color=fff" style="width: 100%; height: 100%;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                        </div>
                    </div>
                    <div style="padding: 4px 16px 16px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${msg}</div>
                    <div style="max-height: 300px; overflow-y: auto; text-align: center; border-top: 1px solid #eee; background: #f0f2f5; padding: 5px;">
                        ${imagesHtml}
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม (Optional)</h4>
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (ถ้ามี):</label>
                    <input type="datetime-local" id="swalScheduleTime" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">เช็คอินสถานที่ (รหัส Place ID):</label>
                    <input type="text" id="swalPlaceId" placeholder="เช่น 108398189188044 (Bangkok)" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์อัลบั้ม',
            cancelButtonText: 'ยกเลิก',
            background: '#1e1e1e',
            color: '#fff',
            width: '600px',
            preConfirm: () => {
                return {
                    scheduleTime: document.getElementById('swalScheduleTime') ? document.getElementById('swalScheduleTime').value : '',
                    placeId: document.getElementById('swalPlaceId') ? document.getElementById('swalPlaceId').value.trim() : ''
                };
            }
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        let scheduledPublishTime = null;
        if (confirmResult.value && confirmResult.value.scheduleTime) {
            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
        }
        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

        Swal.fire({
            title: 'กำลังอัปโหลดโพสต์อัลบั้มลงเพจ...',
            text: 'กรุณารอสักครู่...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post-multi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, images: images , scheduledPublishTime: scheduledPublishTime, place: place })
        });
        
        const data = await res.json();
        if (data.success) {
            Swal.fire('สำเร็จ!', 'โพสต์ลงเพจ Facebook เรียบร้อยแล้ว', 'success');
        } else {
            Swal.fire('ข้อผิดพลาด', data.error || 'ไม่สามารถโพสต์ได้', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message, 'error');
    }
}
`;

fs.writeFileSync('adminZodiacAutoCarousel.js', combined);
