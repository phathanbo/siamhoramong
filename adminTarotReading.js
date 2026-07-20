function adjustScale() {
    const wrapper = currentMode === 3 ? document.getElementById('previewWrapper3') : document.getElementById('previewWrapper1');
    const canvas = currentMode === 3 ? document.getElementById('renderCanvas') : document.getElementById('tarotRenderCanvas');
    if (!wrapper || !canvas) return;

    const wrapperWidth = wrapper.clientWidth;
    const targetWidth = currentMode === 3 ? 1200 : 1080;
    
    let scale = wrapperWidth / targetWidth;
    if (scale > 1) scale = 1;

    canvas.style.transform = `scale(${scale})`;
    wrapper.style.height = `${canvas.scrollHeight * scale + 40}px`; 
}

window.addEventListener('resize', adjustScale);

// Global variable to store auto-generated summary
let autoSummary = "";

function drawThreeCards() {
    if (typeof tarotCards === 'undefined' || tarotCards.length < 3) {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี หรือข้อมูลไม่ครบ', 'error');
        return;
    }

    let selected = [];
    while(selected.length < 3) {
        let r = Math.floor(Math.random() * tarotCards.length);
        if(!selected.includes(r)) {
            selected.push(r);
        }
    }

    const card1 = tarotCards[selected[0]];
    const card2 = tarotCards[selected[1]];
    const card3 = tarotCards[selected[2]];

    // Past
    document.getElementById('name1').innerText = card1.name;
    document.getElementById('img1').src = card1.img;
    document.getElementById('desc1').innerText = card1.past;

    // Present
    document.getElementById('name2').innerText = card2.name;
    document.getElementById('img2').src = card2.img;
    document.getElementById('desc2').innerText = card2.present;

    // Future
    document.getElementById('name3').innerText = card3.name;
    document.getElementById('img3').src = card3.img;
    document.getElementById('desc3').innerText = card3.future;

    // Auto Summary
    const summary = `จากอิทธิพลของไพ่ ${card1.name} ชี้ให้เห็นว่าพื้นฐานอดีตของคุณมาจาก${card1.past} ในขณะที่สถานการณ์ปัจจุบันไพ่ ${card2.name} บ่งบอกถึง${card2.present} สิ่งสำคัญที่สุดคือทิศทางในอนาคต ไพ่ ${card3.name} แนะนำว่า${card3.future} ขอให้คุณใช้สติและรับมือกับสิ่งที่กำลังจะเกิดขึ้น`;
    
    // Update UI
    const customInput = document.getElementById('customSummaryInput').value;
    document.getElementById('summaryText').innerText = customInput || summary;
    autoSummary = summary;
    
    // Adjust scale now that contents are populated
    setTimeout(adjustScale, 50);
}

async function downloadImage(action = 'download') {
    Swal.fire({
        title: 'กำลังสร้างภาพ...',
        text: 'กรุณารอสักครู่ (ภาพมีความละเอียดสูง)',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        
        const width = 1200;
        
        // --- DYNAMIC HEIGHT CALCULATION ---
        const tctx = document.createElement('canvas').getContext('2d');
        const cols = [
            { id: 1, cx: 240, posText: 'อดีต (Past)', name: document.getElementById('name1').innerText, desc: document.getElementById('desc1').innerText, imgSrc: document.getElementById('img1').src },
            { id: 2, cx: 600, posText: 'ปัจจุบัน (Present)', name: document.getElementById('name2').innerText, desc: document.getElementById('desc2').innerText, imgSrc: document.getElementById('img2').src },
            { id: 3, cx: 960, posText: 'อนาคต (Future)', name: document.getElementById('name3').innerText, desc: document.getElementById('desc3').innerText, imgSrc: document.getElementById('img3').src },
        ];
        
        tctx.font = '400 20px "Sarabun"';
        let maxLines = 0;
        for (let col of cols) {
            const maxW = 310 - 40;
            let currentLine = "";
            let pLines = [];
            for(let j=0; j<col.desc.length; j++) {
                const char = col.desc[j];
                const testLine = currentLine + char;
                if(tctx.measureText(testLine).width > maxW && j > 0) {
                    pLines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
            pLines.push(currentLine);
            col.pLines = pLines;
            if (pLines.length > maxLines) maxLines = pLines.length;
        }
        
        const cardY = 130;
        const panelY = cardY + 500;
        const panelH = maxLines * 30 + 40; // 40 is top/bottom padding
        
        const summaryW = 1020;
        const summaryText = document.getElementById('summaryText').innerText;
        tctx.font = '400 22px "Sarabun"';
        let sLines = [];
        if (window.Intl && window.Intl.Segmenter) {
            const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
            const segments = segmenter.segment(summaryText);
            let currentLine = "";
            for (const {segment} of segments) {
                if (tctx.measureText(currentLine + segment).width > summaryW - 60 && currentLine.trim() !== '') {
                    sLines.push(currentLine);
                    currentLine = segment;
                } else {
                    currentLine += segment;
                }
            }
            sLines.push(currentLine);
        } else {
            let currentLine = "";
            for(let j=0; j<summaryText.length; j++) {
                const char = summaryText[j];
                if(tctx.measureText(currentLine + char).width > summaryW - 60 && j > 0) {
                    sLines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine += char;
                }
            }
            sLines.push(currentLine);
        }
        
        const summaryY = panelY + panelH + 40;
        const summaryH = sLines.length * 35 + 100;
        const height = summaryY + summaryH + 80; // Footer margin
        // --- END CALCULATION ---
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // 1. Background
        let grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f0c29');
        grad.addColorStop(0.5, '#302b63');
        grad.addColorStop(1, '#24243e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // 2. Stars bg
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let i = 0; i < (height/6); i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Header
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 1;
        
        const bubbleX = 50;
        const bubbleY = 40;
        const bubbleW = 400;
        const bubbleH = 50;
        const bubbleRadius = 25;
        
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, bubbleRadius);
        } else {
            ctx.moveTo(bubbleX + bubbleRadius, bubbleY);
            ctx.lineTo(bubbleX + bubbleW - bubbleRadius, bubbleY);
            ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + bubbleRadius);
            ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - bubbleRadius);
            ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - bubbleRadius, bubbleY + bubbleH);
            ctx.lineTo(bubbleX + bubbleRadius, bubbleY + bubbleH);
            ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - bubbleRadius);
            ctx.lineTo(bubbleX, bubbleY + bubbleRadius);
            ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + bubbleRadius, bubbleY);
            ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 26px "Sarabun"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText("🃏 ไพ่ยิปซีทำนายดวงชะตา (3 ใบ)", bubbleX + 30, bubbleY + 25);
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
        ctx.font = '700 35px "Sarabun"';
        ctx.fillStyle = '#d4af37';
        ctx.fillText("สยามโหรามงคล", width - 50, 40);
        
        ctx.font = '400 20px "Sarabun"';
        ctx.fillStyle = '#f1c40f';
        ctx.fillText("ศาสตร์พยากรณ์", width - 50, 80);
        ctx.shadowColor = 'transparent';

        // 4. Draw Cards & Columns
        for(let col of cols) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
            ctx.fillStyle = '#d4af37';
            ctx.font = '700 22px "Sarabun"';
            ctx.fillText(col.posText, col.cx, cardY);
            
            ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
            ctx.fillStyle = '#fff';
            ctx.font = '700 32px "Sarabun"';
            ctx.fillText(col.name, col.cx, cardY + 30);
            ctx.shadowColor = 'transparent';
            
            if (col.imgSrc) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = col.imgSrc;
                await new Promise(r => { img.onload=r; img.onerror=r; });
                
                const drawH = 380;
                const drawW = img.width * (drawH / img.height);
                const drawX = col.cx - drawW/2;
                const drawY = cardY + 90;
                
                ctx.save();
                ctx.shadowColor = '#e8c97a';
                ctx.shadowBlur = 50;
                ctx.fillStyle = '#e8c97a';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(drawX, drawY, drawW, drawH, 20);
                else ctx.rect(drawX, drawY, drawW, drawH);
                ctx.fill();
                ctx.restore();
                
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 15;
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 4;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(drawX, drawY, drawW, drawH, 12);
                else ctx.rect(drawX, drawY, drawW, drawH);
                ctx.stroke();
                
                ctx.clip();
                ctx.drawImage(img, drawX, drawY, drawW, drawH);
                ctx.restore();
            }
            
            const panelW = 310;
            const panelX = col.cx - panelW/2;
            
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            ctx.lineWidth = 1;
            ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
            
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(panelX, panelY, panelW, panelH, 15);
            else ctx.rect(panelX, panelY, panelW, panelH);
            ctx.fill();
            ctx.shadowColor = 'transparent';
            ctx.stroke();
            
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '400 20px "Sarabun"';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
            
            let tY = panelY + 20;
            for(let l of col.pLines) {
                ctx.fillText(l, panelX + 20, tY);
                tY += 30;
            }
            ctx.restore();
        }
        
        // 5. Summary Box
        const summaryX = width/2 - summaryW/2;
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
        
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(summaryX, summaryY, summaryW, summaryH, 20);
        else ctx.rect(summaryX, summaryY, summaryW, summaryH);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.stroke();
        
        ctx.fillStyle = '#d4af37';
        ctx.font = '700 28px "Sarabun"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
        ctx.fillText("🔮 บทสรุปภาพรวมดวงชะตา", summaryX + 30, summaryY + 30);
        
        ctx.fillStyle = '#fff';
        ctx.font = '400 22px "Sarabun"';
        
        let tY = summaryY + 80;
        for(let l of sLines) {
            ctx.fillText(l, summaryX + 30, tY);
            tY += 35;
        }
        ctx.restore();
        
        // 6. Footer
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '400 18px "Sarabun"';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText("© สยามโหรามงคล - ห้ามนำไปดัดแปลงหรือใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต", width/2, height - 20);

        // Export
        const dataUrl = canvas.toDataURL('image/png');
        
        if (action === 'post') {
            Swal.close();
            return dataUrl;
        }

        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `TarotReading_${dateStr}.png`;
        link.href = dataUrl;
        link.click();
        
        Swal.close();

    } catch (error) {
        console.error("Error generating Tarot image:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
}

// Draw initial on load
window.onload = () => {
    drawThreeCards();
    // adjustScale is now called at the end of drawThreeCards
};


// --- Mode Switching Logic ---
let currentMode = 3;

function switchMode(mode) {
    currentMode = mode;
    
    // Update Buttons
    document.getElementById('btnMode1').className = mode === 1 ? 'btn btn-warning active' : 'btn btn-outline-warning';
    document.getElementById('btnMode3').className = mode === 3 ? 'btn btn-warning active' : 'btn btn-outline-warning';
    
    // Update Controls
    document.getElementById('controlsMode1').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('controlsMode3').style.display = mode === 3 ? 'flex' : 'none';
    document.getElementById('summaryMode3').style.display = mode === 3 ? 'flex' : 'none';
    
    // Update Canvas Wrappers
    document.getElementById('previewWrapper1').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('previewWrapper3').style.display = mode === 3 ? 'flex' : 'none';
    
    // Update Title
    document.getElementById('pageTitle').innerHTML = mode === 1 
        ? '<i class="fas fa-layer-group text-warning mr-2"></i>ระบบสร้างภาพไพ่ยิปซี (1 ใบ)' 
        : '<i class="fas fa-layer-group text-warning mr-2"></i>ระบบสร้างภาพไพ่ยิปซี (3 ใบ)';
        
    adjustScale();
    
    // Auto draw if empty
    if (mode === 1 && lastCardIndex === -1) {
        drawSingleTarot();
    }
}

// Check URL Params for mode
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === '1') {
        switchMode(1);
    }
});

// --- 1 Card Mode Logic ---
let lastCardIndex = -1;

function drawSingleTarot() {
    if (typeof tarotCards === 'undefined') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี (tarot-data.js)', 'error');
        return;
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * tarotCards.length);
    } while (randomIndex === lastCardIndex && tarotCards.length > 1);
    
    lastCardIndex = randomIndex;
    const card = tarotCards[randomIndex];

    document.getElementById('tarotPreviewImg').src = card.img;
    document.getElementById('tarotPreviewName').innerText = card.name;
    document.getElementById('tarotPreviewMeaning').innerText = card.meaning;
    document.getElementById('tarotPreviewPast').innerText = card.past;
    document.getElementById('tarotPreviewPresent').innerText = card.present;
    document.getElementById('tarotPreviewFuture').innerText = card.future;
    
    setTimeout(adjustScale, 100);
}

function downloadSingleTarot(action = 'download') {
    return new Promise((resolve) => {
    Swal.fire({ title: 'กำลังประมวลผล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    // Reset scale before capture
    const canvas = document.getElementById('tarotRenderCanvas');
    const wrapper = document.getElementById('previewWrapper1');
    canvas.style.transform = 'none';
    
    // Use html2canvas
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => {
        html2canvas(canvas, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#090915'
        }).then(c => {
            const dataUrl = c.toDataURL('image/png');
            if (action === 'post') {
                Swal.close();
                adjustScale();
                resolve(dataUrl);
                return;
            }
            const link = document.createElement('a');
            link.download = 'daily-tarot-' + Date.now() + '.png';
            link.href = dataUrl;
            link.click();
            Swal.close();
            adjustScale(); // restore scale
            resolve();
        }).catch(err => {
            console.error(err);
            Swal.fire('Error', 'ไม่สามารถสร้างภาพได้', 'error');
            adjustScale();
            resolve();
        });
    };
    document.body.appendChild(script);
    });
}

// --- Facebook Posting Logic ---
async function postToFacebook() {
    try {
        const dataUrl = await downloadImage('post');
        if (!dataUrl) return;
        
        const summaryText = document.getElementById('summaryText').innerText || "ดูดวงไพ่ยิปซี 3 ใบ กับสยามโหรามงคล";
        
        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์',
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
                    <div style="padding: 4px 16px 16px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${summaryText}</div>
                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
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
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์',
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
            title: 'กำลังโพสต์ลงเพจ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: summaryText, image: dataUrl , scheduledPublishTime: scheduledPublishTime, place: place })
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

async function postSingleToFacebook() {
    try {
        const dataUrl = await downloadSingleTarot('post');
        if (!dataUrl) return;
        
        const cardName = document.getElementById('tarotPreviewName').innerText;
        const msg = `ดวงไพ่ยิปซีประจำวัน: ${cardName}\n\n${document.getElementById('tarotPreviewMeaning').innerText}`;
        
        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์',
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
                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
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
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์',
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
            title: 'กำลังโพสต์ลงเพจ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, image: dataUrl , scheduledPublishTime: scheduledPublishTime, place: place })
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
