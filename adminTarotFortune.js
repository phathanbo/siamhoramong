function openTarotFortuneModal() {
    let existing = document.getElementById('tarotFortuneModal');
    if (existing) {
        existing.remove();
    }

    const modalHTML = `
    <div id="tarotFortuneModal" class="admin-modal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:#fff; width:90%; max-width:600px; border-radius:12px; padding:20px; position:relative; max-height:90vh; overflow-y:auto; font-family:'Sarabun', sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:15px; margin-bottom:20px;">
                <h3 class="m-0 text-dark"><i class="fas fa-clone text-danger mr-2"></i>สร้างภาพไพ่ยิปซีรายวัน</h3>
                <span class="close-modal" onclick="closeTarotFortuneModal()" style="font-size: 1.5rem; cursor: pointer; color: #888;">&times;</span>
            </div>

            <!-- Controls -->
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <button class="btn btn-warning shadow-sm" onclick="drawRandomTarot()" style="font-size: 1.1rem; padding: 10px 20px; border-radius: 8px; font-weight: bold; background: linear-gradient(135deg, #f1c40f, #e67e22); border: none; color: #fff;">
                        <i class="fas fa-random mr-2"></i>สุ่มไพ่ใหม่ (Draw)
                    </button>
                    <button class="btn btn-dark shadow-sm ml-2" onclick="downloadTarotImage()" style="font-size: 1.1rem; padding: 10px 20px; border-radius: 8px; font-weight: bold; background: linear-gradient(135deg, #4b134f, #c94b4b); border: none; color: #fff;">
                        <i class="fas fa-download mr-2"></i>ดาวน์โหลดภาพ
                    </button>
                </div>
            </div>

            <!-- Preview Wrapper for Scaling -->
            <div id="tarotPreviewWrapper" style="width: 100%; overflow: hidden; display: flex; justify-content: center; background: #f8f9fa; border: 1px dashed #ccc; padding: 20px 0; border-radius: 8px;">
                
                <!-- The Actual 1080x1080 Container -->
                <div id="tarotRenderCanvas" style="width: 1080px; height: 1080px; position: relative; overflow: hidden; transform-origin: top center; background: linear-gradient(135deg, #090915, #1d0f3b, #300f3f); box-shadow: inset 0 0 100px rgba(0,0,0,0.8);">
                    
                    <!-- Stars / Particles background -->
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.6; background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 4px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 3px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 4px), radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 3px); background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;"></div>
                    
                    <!-- Branding Logo -->
                    <div style="position: absolute; top: 40px; right: 40px; text-align: right; z-index: 10;">
                        <h2 style="margin:0; font-size: 2.2rem; color:#d4af37; font-family:'Sarabun', sans-serif; font-weight:700; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">สยามโหรามงคล</h2>
                        <p style="margin:0; font-size: 1.2rem; color:#f1c40f; font-family:'Sarabun', sans-serif; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">ศาสตร์พยากรณ์</p>
                    </div>

                    <!-- Daily Tarot Title -->
                    <div style="position: absolute; top: 40px; left: 40px; z-index: 10;">
                        <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 215, 0, 0.4); padding: 10px 25px; border-radius: 30px; backdrop-filter: blur(8px);">
                            <span style="font-size: 1.4rem; color: #fff; font-family: 'Sarabun', sans-serif;">🃏 ไพ่ยิปซีประจำวัน</span>
                        </div>
                    </div>

                    <!-- Content Layout -->
                    <div style="position: absolute; top: 130px; left: 0; width: 100%; height: 930px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5;">
                        
                        <!-- Card Image -->
                        <div style="margin-bottom: 30px; position: relative;">
                            <!-- Glow behind card -->
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 280px; height: 480px; background: #e8c97a; filter: blur(50px); opacity: 0.3; border-radius: 20px;"></div>
                            
                            <img id="tarotPreviewImg" src="" crossorigin="anonymous" style="height: 480px; width: auto; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.8), 0 0 0 2px #d4af37; position: relative; z-index: 2;" />
                        </div>

                        <!-- Glassmorphism Text Box -->
                        <div style="width: 85%; max-height: 400px; background: rgba(20, 10, 40, 0.6); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 30px 40px; backdrop-filter: blur(12px); box-shadow: 0 15px 35px rgba(0,0,0,0.5); text-align: center; position: relative; display: flex; flex-direction: column; justify-content: center;">
                            
                            <!-- Ornaments -->
                            <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); color: #d4af37; font-size: 2rem;">✦</div>
                            
                            <h1 id="tarotPreviewName" style="color: #e8c97a; font-family: 'Sarabun', sans-serif; font-weight: 700; font-size: 2.8rem; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">The Tarot</h1>
                            <p id="tarotPreviewDesc" style="color: #ffffff; font-family: 'Sarabun', sans-serif; font-size: 1.6rem; line-height: 1.5; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                                คำทำนายความหมายของไพ่...
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            <p class="text-muted text-center mt-3 mb-0" style="font-size: 0.85rem;">พรีวิวถูกย่อขนาดให้พอดีกับหน้าจอ ภาพที่ดาวน์โหลดจะเป็นขนาด 1080x1080 คมชัด 100%</p>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initial scale adjustment for preview
    adjustTarotScale();
    window.addEventListener('resize', adjustTarotScale);

    // Draw initial card
    drawRandomTarot();
}

function closeTarotFortuneModal() {
    window.removeEventListener('resize', adjustTarotScale);
    const el = document.getElementById('tarotFortuneModal');
    if (el) el.remove();
}

function adjustTarotScale() {
    const wrapper = document.getElementById('tarotPreviewWrapper');
    const canvas = document.getElementById('tarotRenderCanvas');
    if (!wrapper || !canvas) return;

    const wrapperWidth = wrapper.clientWidth;
    const targetWidth = 1080;
    
    let scale = wrapperWidth / targetWidth;
    if (scale > 1) scale = 1; // Don't scale up

    canvas.style.transform = `scale(${scale})`;
    // Adjust wrapper height to prevent huge blank space below scaled canvas
    wrapper.style.height = `${targetWidth * scale + 40}px`; 
}

let lastCardIndex = -1;

function drawRandomTarot() {
    if (typeof tarotCards === 'undefined') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี (fortune-daily-data.js)', 'error');
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
    document.getElementById('tarotPreviewDesc').innerText = card.meaning;
}

async function downloadTarotImage() {
    const nameStr = document.getElementById('tarotPreviewName').innerText.replace(/\s+/g, '_');
    const descStr = document.getElementById('tarotPreviewDesc').innerText;
    const imgSrc = document.getElementById('tarotPreviewImg').src;

    Swal.fire({
        title: 'กำลังสร้างภาพ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // 1. Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
        bgGrad.addColorStop(0, '#090915');
        bgGrad.addColorStop(0.5, '#1d0f3b');
        bgGrad.addColorStop(1, '#300f3f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Stars / Particles
        ctx.fillStyle = 'white';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 1080;
            const y = Math.random() * 1080;
            const radius = Math.random() * 2;
            const alpha = Math.random() * 0.5 + 0.1;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // 3. Branding Logo
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        drawStrokedText(ctx, "สยามโหรามงคล", 1040, 40, '#d4af37', 'rgba(0,0,0,0.8)', 4);
        ctx.font = '20px "Sarabun", sans-serif';
        drawStrokedText(ctx, "ศาสตร์พยากรณ์", 1040, 85, '#f1c40f', 'rgba(0,0,0,0.8)', 2);

        // 4. Daily Tarot Title
        ctx.textAlign = 'left';
        ctx.font = '24px "Sarabun", sans-serif';
        drawRoundedRect(ctx, 40, 40, 250, 50, 25, 'rgba(255, 255, 255, 0.1)', 'rgba(255, 215, 0, 0.4)');
        ctx.fillStyle = '#fff';
        ctx.fillText("🃏 ไพ่ยิปซีประจำวัน", 65, 52);

        // 5. Load and Draw Card Image
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imgSrc;
        });

        // Glow behind card
        ctx.shadowColor = '#e8c97a';
        ctx.shadowBlur = 50;
        drawRoundedRect(ctx, 540 - 140, 150, 280, 480, 20, '#e8c97a');
        
        // Draw Card
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 15;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#d4af37';
        // Approximate aspect ratio of card is usually 1:1.7
        const imgWidth = 280;
        const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;
        const imgY = 150 + (480 - imgHeight) / 2;
        ctx.drawImage(img, 540 - imgWidth / 2, imgY, imgWidth, imgHeight);
        ctx.strokeRect(540 - imgWidth / 2, imgY, imgWidth, imgHeight);

        ctx.shadowColor = 'transparent';

        // 6. Text Box
        const boxWidth = 918; // 85% of 1080
        const boxHeight = 350;
        const boxX = (1080 - boxWidth) / 2;
        const boxY = 650;
        
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 15;
        drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 20, 'rgba(20, 10, 40, 0.6)', 'rgba(212, 175, 55, 0.3)');
        ctx.shadowColor = 'transparent';

        // Ornament
        ctx.textAlign = 'center';
        ctx.font = '32px Arial';
        ctx.fillStyle = '#d4af37';
        ctx.fillText("✦", 540, boxY - 15);

        // Title
        ctx.font = 'bold 44px "Sarabun", sans-serif';
        drawStrokedText(ctx, document.getElementById('tarotPreviewName').innerText, 540, boxY + 40, '#e8c97a', 'rgba(0,0,0,0.8)', 4);

        // Description
        ctx.font = '26px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffffff';
        // Adding a slight drop shadow to text manually
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        wrapText(ctx, descStr, 540, boxY + 110, boxWidth - 80, 36);
        ctx.shadowColor = 'transparent';

        // Output
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `Tarot_${dateStr}_${nameStr}.png`;
        link.href = dataUrl;
        link.click();
        
        Swal.close();
    } catch (error) {
        console.error("Error generating Tarot image:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    }
}

