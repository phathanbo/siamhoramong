/**
 * adminWeeklyFortune.js
 * ระบบสร้างภาพสรุปดวงรายวัน/รายสัปดาห์ (Auto) อิงตามตำราในระบบ
 */

function openWeeklyFortuneModal_impl() {
    // ลบอันเก่าทิ้งถ้ามี
    const existing = document.getElementById('weeklyFortuneModal');
    if (existing) existing.remove();

    const todayStr = new Date().toISOString().split('T')[0];

    const html = `
    <div id="weeklyFortuneModal" class="admin-modal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
        <div class="admin-modal-content" style="max-width: 1200px; width: 95%; padding: 0; display: flex; flex-direction: column; max-height: 95vh; overflow: hidden; background: #fdfdfd; color: #333; border-radius: 20px;">
            <div class="modal-header d-flex justify-content-between align-items-center" style="padding: 20px 30px; border-bottom: 1px solid #eee; background: #fff;">
                <h3 class="m-0 text-dark"><i class="fas fa-magic text-warning mr-2"></i>สร้างภาพดวงอัตโนมัติ</h3>
                <span class="close-modal" onclick="closeWeeklyFortuneModal()" style="font-size: 1.5rem; cursor: pointer; color: #888;">&times;</span>
            </div>
            
            <div style="display: flex; flex: 1; overflow: hidden;">
                <!-- ซ้าย: การตั้งค่า -->
                <div style="flex: 0 0 350px; padding: 25px; background: #f8f9fa; border-right: 1px solid #eee; overflow-y: auto;">
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">📅 เลือกวันที่:</label>
                        <input type="date" id="wfDate" class="form-control" value="${todayStr}" onchange="renderWeeklyFortunePreview()">
                    </div>
                    
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">✨ รูปแบบวันมงคลสูงสุด (ซ้ายบน):</label>
                        <select id="wfBestDay" class="form-control" onchange="renderWeeklyFortunePreview()">
                            <option value="auto">คำนวณอัตโนมัติ (ธงชัย/อธิบดี)</option>
                            <option value="sun">วันอาทิตย์</option>
                            <option value="mon">วันจันทร์</option>
                            <option value="tue">วันอังคาร</option>
                            <option value="wed">วันพุธ</option>
                            <option value="thu">วันพฤหัสบดี</option>
                            <option value="fri">วันศุกร์</option>
                            <option value="sat">วันเสาร์</option>
                        </select>
                    </div>

                    <div class="form-group mb-4">
                        <label class="font-weight-bold">⚠️ วันที่ต้องระวัง (ขวาบน):</label>
                        <select id="wfBadDay" class="form-control" onchange="renderWeeklyFortunePreview()">
                            <option value="auto">คำนวณอัตโนมัติ (อุบาทว์/โลกาวินาศ)</option>
                            <option value="sun">วันอาทิตย์</option>
                            <option value="mon">วันจันทร์</option>
                            <option value="tue">วันอังคาร</option>
                            <option value="wed">วันพุธ</option>
                            <option value="thu">วันพฤหัสบดี</option>
                            <option value="fri">วันศุกร์</option>
                            <option value="sat">วันเสาร์</option>
                        </select>
                    </div>
                    
                    <hr>
                    <button class="btn btn-warning btn-block font-weight-bold py-3 mt-4" style="border-radius: 10px;" onclick="downloadWeeklyFortuneImage()">
                        <i class="fas fa-download mr-2"></i> ดาวน์โหลดรูปภาพ
                    </button>
                    <p class="text-muted small mt-3 text-center">ภาพจะถูกบันทึกเป็นไฟล์ PNG ความละเอียดสูง</p>
                </div>

                <!-- ขวา: Preview -->
                <div style="flex: 1; padding: 20px; background: #e9ecef; overflow-y: auto; display: flex; justify-content: center; align-items: flex-start;">
                    <div id="wfPreviewArea" style="width: 1200px; transform-origin: top center; transform: scale(0.65); box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
                        <!-- Template จะถูกวาดที่นี่ -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    
    // วาด Preview ครั้งแรก
    setTimeout(renderWeeklyFortunePreview, 100);
}

function closeWeeklyFortuneModal() {
    const modal = document.getElementById('weeklyFortuneModal');
    if (modal) modal.remove();
}

const WF_DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const WF_DAY_COLORS = ['#e74c3c', '#f1c40f', '#e67e22', '#2ecc71', '#e67e22', '#3498db', '#9b59b6'];

function renderWeeklyFortunePreview() {
    const area = document.getElementById('wfPreviewArea');
    if (!area) return;

    const dateStr = document.getElementById('wfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = WF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateTitle = dateObj.toLocaleDateString('th-TH', options);

    // ดึงข้อมูล 7 วัน
    let daysHtml = '';
    
    // สมมติฐาน: DASH_TABOO มีข้อห้าม/ควรทำ DASH_DAY_COLORS มีสีมงคล
    // เราจะใช้ window.DASH_TABOO ถ้ามี ถ้าไม่มีใช้ค่า dummy
    
    for (let i = 0; i < 7; i++) {
        let goodStr = "ทำจิตใจให้ผ่องใส";
        let badStr = "ระวังการใช้อารมณ์";
        let colorStr = "-";
        
        // ถ้าหน้า todayDashboard โหลดไว้ จะมีตัวแปร DASH_TABOO
        if (typeof DASH_TABOO !== 'undefined' && DASH_TABOO[i]) {
            goodStr = DASH_TABOO[i].good[0] || goodStr;
            badStr = DASH_TABOO[i].bad[0] || badStr;
        }
        
        if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[WF_DAY_NAMES[i]]) {
            const colors = DASH_DAY_COLORS[WF_DAY_NAMES[i]].colors;
            if(colors && colors.length > 0) colorStr = colors.join(', ');
        }

        daysHtml += `
            <div style="flex: 1; text-align: center; padding: 0 10px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: ${WF_DAY_COLORS[i]}; margin: 0 auto 15px; border: 4px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;">
                    <span style="color:#fff; font-size:24px; font-weight:bold;">${WF_DAY_NAMES[i].substring(0,1)}</span>
                </div>
                <h4 style="color: #333; font-weight: bold; font-size: 20px; margin-bottom: 10px;">${WF_DAY_NAMES[i]}</h4>
                <div style="font-size: 14px; line-height: 1.4;">
                    <div style="color: #27ae60; margin-bottom: 5px;"><strong>จุดเด่น:</strong> ${goodStr}</div>
                    <div style="color: #c0392b; margin-bottom: 5px;"><strong>ระวัง:</strong> ${badStr}</div>
                    <div style="color: #666;"><strong>สีมงคล:</strong> ${colorStr}</div>
                </div>
            </div>
        `;
    }

    // วาด Canvas Template
    area.innerHTML = `
        <div id="wfCaptureArea" style="background: #fff; width: 1200px; height: 800px; position: relative; font-family: 'Sarabun', sans-serif; overflow: hidden;">
            <!-- Background Elements -->
            <div style="position: absolute; top: -100px; left: -100px; width: 400px; height: 400px; border-radius: 50%; background: rgba(241, 196, 15, 0.1);"></div>
            <div style="position: absolute; bottom: -100px; right: -100px; width: 500px; height: 500px; border-radius: 50%; background: rgba(212, 175, 55, 0.1);"></div>
            
            <!-- Header -->
            <div style="text-align: center; padding-top: 50px;">
                <h1 style="color: #333; font-size: 48px; font-weight: bold; margin-bottom: 10px;">เช็กดวงรายวัน!</h1>
                <h2 style="color: #d4af37; font-size: 42px; font-weight: bold; margin-bottom: 20px;">วัน${dayNameStr}ที่ ${dateTitle}</h2>
                <div style="display: inline-block; background: #333; color: #d4af37; padding: 10px 30px; border-radius: 30px; font-size: 24px; font-weight: bold;">พร้อมเคล็ดลับเสริมเฮง</div>
            </div>

            <!-- Top Highlights -->
            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 60px; padding: 0 50px;">
                <!-- วันมงคลสูงสุด -->
                <div style="width: 250px; height: 250px; border-radius: 50%; background: linear-gradient(135deg, #f1c40f, #e67e22); padding: 5px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    <div style="background: #fff; width: 100%; height: 100%; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px;">
                        <i class="fas fa-flag text-warning mb-2" style="font-size: 30px;"></i>
                        <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 5px;">วันมงคลสูงสุด</div>
                        <div style="font-size: 16px; color: #666; line-height: 1.4;">(ธงชัย/อธิบดี)</div>
                        <div style="font-size: 16px; color: #d4af37; font-weight: bold; margin-top: 10px;">คำนวณอัตโนมัติ</div>
                    </div>
                </div>

                <!-- Text ตรงกลาง -->
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 30px;">
                    <p style="text-align: center; font-size: 20px; color: #555; line-height: 1.6;">
                        สรุปคำทำนายดวงชะตาประจำวัน${dayNameStr}ที่ ${dateTitle} ครบทั้ง 7 วันเกิด โดยเป็นเกณฑ์พิเศษประจำวัน พร้อมคำแนะนำสีมงคลเพื่อเสริมโชคลาภ
                    </p>
                </div>

                <!-- วันที่ต้องระวัง -->
                <div style="width: 250px; height: 250px; border-radius: 50%; background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 5px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    <div style="background: #fff; width: 100%; height: 100%; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px;">
                        <i class="fas fa-bolt text-danger mb-2" style="font-size: 30px;"></i>
                        <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 5px;">วันที่ต้องระวัง</div>
                        <div style="font-size: 16px; color: #666; line-height: 1.4;">(วันอุบาทว์)</div>
                        <div style="font-size: 16px; color: #e74c3c; font-weight: bold; margin-top: 10px;">คำนวณอัตโนมัติ</div>
                    </div>
                </div>
            </div>

            <!-- 7 Days Grid -->
            <div style="display: flex; justify-content: space-between; margin-top: 80px; padding: 0 30px;">
                ${daysHtml}
            </div>
            
            <!-- Footer Watermark -->
            <div style="position: absolute; bottom: 20px; right: 30px; font-size: 18px; color: #999; font-weight: bold;">
                🔮 สยามโหรามงคล
            </div>
        </div>
    `;
}

async function downloadWeeklyFortuneImage() {
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        
        const canvasWidth = 1200;
        const canvasHeight = 800;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Decor circles
        ctx.beginPath();
        ctx.arc(100, 100, 200, 0, Math.PI * 2); // center -100,-100 radius 200 -> center is 100,100 because width 400 is radius 200. Actually if it's top: -100px, left: -100px and size 400x400, center is 100,100.
        ctx.fillStyle = 'rgba(241, 196, 15, 0.1)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvasWidth - 150, canvasHeight - 150, 250, 0, Math.PI * 2); // size 500x500
        ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
        ctx.fill();

        const dateStr = document.getElementById('wfDate').value;
        const dateObj = new Date(dateStr);
        const dayNameStr = WF_DAY_NAMES[dateObj.getDay()];
        const dateTitle = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

        // Header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.font = 'bold 48px "Sarabun", sans-serif';
        ctx.fillText("เช็กดวงรายวัน!", canvasWidth / 2, 100);
        
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 42px "Sarabun", sans-serif';
        ctx.fillText(`วัน${dayNameStr}ที่ ${dateTitle}`, canvasWidth / 2, 160);
        
        ctx.font = 'bold 24px "Sarabun", sans-serif';
        const pillWidth = 220;
        const pillHeight = 50;
        const pillX = (canvasWidth - pillWidth) / 2;
        drawRoundedRect(ctx, pillX, 190, pillWidth, pillHeight, 25, '#333');
        ctx.fillStyle = '#d4af37';
        ctx.fillText("พร้อมเคล็ดลับเสริมเฮง", canvasWidth / 2, 225);

        // Best Day / Text / Bad Day
        const highlightY = 280;
        
        // Best Day
        const bestGrad = ctx.createLinearGradient(80, highlightY, 330, highlightY + 250);
        bestGrad.addColorStop(0, '#f1c40f');
        bestGrad.addColorStop(1, '#e67e22');
        ctx.beginPath(); ctx.arc(205, highlightY + 125, 125, 0, Math.PI * 2);
        ctx.fillStyle = bestGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(205, highlightY + 125, 120, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px "Sarabun", sans-serif';
        ctx.fillText("วันมงคลสูงสุด", 205, highlightY + 120);
        ctx.fillStyle = '#666';
        ctx.font = '16px "Sarabun", sans-serif';
        ctx.fillText("(ธงชัย/อธิบดี)", 205, highlightY + 145);
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 16px "Sarabun", sans-serif';
        ctx.fillText("คำนวณอัตโนมัติ", 205, highlightY + 175);

        // Bad Day
        const badGrad = ctx.createLinearGradient(1200 - 330, highlightY, 1200 - 80, highlightY + 250);
        badGrad.addColorStop(0, '#e74c3c');
        badGrad.addColorStop(1, '#c0392b');
        ctx.beginPath(); ctx.arc(1200 - 205, highlightY + 125, 125, 0, Math.PI * 2);
        ctx.fillStyle = badGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(1200 - 205, highlightY + 125, 120, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px "Sarabun", sans-serif';
        ctx.fillText("วันที่ต้องระวัง", 1200 - 205, highlightY + 120);
        ctx.fillStyle = '#666';
        ctx.font = '16px "Sarabun", sans-serif';
        ctx.fillText("(วันอุบาทว์)", 1200 - 205, highlightY + 145);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 16px "Sarabun", sans-serif';
        ctx.fillText("คำนวณอัตโนมัติ", 1200 - 205, highlightY + 175);

        // Center text
        ctx.fillStyle = '#555';
        ctx.font = '20px "Sarabun", sans-serif';
        const centerTxt = `สรุปคำทำนายดวงชะตาประจำวัน${dayNameStr}ที่ ${dateTitle} ครบทั้ง 7 วันเกิด โดยเป็นเกณฑ์พิเศษประจำวัน พร้อมคำแนะนำสีมงคลเพื่อเสริมโชคลาภ`;
        wrapText(ctx, centerTxt, 600, highlightY + 110, 400, 32);

        // 7 Days Grid
        const gridY = 600;
        const cellWidth = 1140 / 7;
        const startX = 30 + cellWidth / 2;
        
        for (let i = 0; i < 7; i++) {
            let goodStr = "ทำจิตใจให้ผ่องใส";
            let badStr = "ระวังการใช้อารมณ์";
            let colorStr = "-";
            
            if (typeof DASH_TABOO !== 'undefined' && DASH_TABOO[i]) {
                goodStr = DASH_TABOO[i].good[0] || goodStr;
                badStr = DASH_TABOO[i].bad[0] || badStr;
            }
            if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[WF_DAY_NAMES[i]]) {
                const colors = DASH_DAY_COLORS[WF_DAY_NAMES[i]].colors;
                if(colors && colors.length > 0) colorStr = colors.join(', ');
            }

            const cx = startX + i * cellWidth;
            
            // Circle
            ctx.beginPath(); ctx.arc(cx, gridY, 40, 0, Math.PI * 2);
            ctx.fillStyle = WF_DAY_COLORS[i]; ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px "Sarabun", sans-serif';
            ctx.fillText(WF_DAY_NAMES[i].substring(0,1), cx, gridY + 8);
            
            ctx.fillStyle = '#333';
            ctx.font = 'bold 20px "Sarabun", sans-serif';
            ctx.fillText(WF_DAY_NAMES[i], cx, gridY + 70);

            ctx.font = '14px "Sarabun", sans-serif';
            ctx.fillStyle = '#27ae60';
            ctx.fillText(`จุดเด่น:`, cx, gridY + 95);
            ctx.fillStyle = '#333';
            wrapText(ctx, goodStr, cx, gridY + 115, cellWidth - 10, 18);
            
            ctx.fillStyle = '#c0392b';
            ctx.fillText(`ระวัง:`, cx, gridY + 135);
            ctx.fillStyle = '#333';
            wrapText(ctx, badStr, cx, gridY + 155, cellWidth - 10, 18);
            
            ctx.fillStyle = '#666';
            ctx.fillText(`สีมงคล:`, cx, gridY + 175);
            ctx.fillStyle = '#333';
            ctx.fillText(colorStr, cx, gridY + 195);
        }
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#999';
        ctx.font = 'bold 18px "Sarabun", sans-serif';
        ctx.fillText("🔮 สยามโหรามงคล", canvasWidth - 30, canvasHeight - 20);

        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `SiamHora_Daily_${document.getElementById('wfDate').value}.png`;
        link.href = imgData;
        link.click();
        
        Swal.fire('สำเร็จ', 'บันทึกรูปภาพเรียบร้อยแล้ว', 'success');
    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้', 'error');
    }
}
