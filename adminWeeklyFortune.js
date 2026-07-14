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
    const element = document.getElementById('wfCaptureArea');
    if (!element) return;

    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
    const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff'
        });

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
