const fs = require('fs');
let html = fs.readFileSync('adminTarotReading.html', 'utf-8');

// 1. Update Title and Add Mode Switcher
const headerRegex = /<div class="admin-header">([\s\S]*?)<\/div>/;
const newHeader = `<div class="admin-header">
        <h2 id="pageTitle"><i class="fas fa-layer-group text-warning mr-2"></i>ระบบสร้างภาพไพ่ยิปซี (3 ใบ)</h2>
        <p class="mb-0 text-white-50">สำหรับผู้ดูแลระบบ - สร้างคอนเทนต์โพสต์โซเชียลมีเดีย</p>
    </div>

    <!-- Mode Switcher -->
    <div class="container-fluid mt-3 text-center">
        <div class="btn-group shadow-sm" role="group" aria-label="Tarot Mode Switcher">
            <button type="button" id="btnMode1" class="btn btn-outline-warning" onclick="switchMode(1)">ดวงรายวัน (1 ใบ)</button>
            <button type="button" id="btnMode3" class="btn btn-warning active" onclick="switchMode(3)">ทำนายทั่วไป (3 ใบ)</button>
        </div>
    </div>`;
html = html.replace(headerRegex, newHeader);

// 2. Wrap 3-card controls and custom summary
const controlsRegex = /<div class="row mb-3">([\s\S]*?)<div id="previewWrapper">/;
const newControls = `<div class="row mb-3" id="controlsMode3">
            <div class="col-12 text-center">
                <a href="index.html#adminQuickToolsSection" class="btn btn-secondary mr-2"><i class="fas fa-arrow-left"></i> กลับหน้า Admin</a>
                <button class="btn btn-gold px-4 py-2" onclick="drawThreeCards()"><i class="fas fa-random mr-2"></i> สุ่มไพ่ 3 ใบ (Draw)</button>
                <button class="btn btn-dark px-4 py-2 ml-2" onclick="downloadImage()"><i class="fas fa-download mr-2"></i> ดาวน์โหลดภาพ (PNG)</button>
            </div>
        </div>

        <div class="row mb-3" id="controlsMode1" style="display: none;">
            <div class="col-12 text-center">
                <a href="index.html#adminQuickToolsSection" class="btn btn-secondary mr-2"><i class="fas fa-arrow-left"></i> กลับหน้า Admin</a>
                <button class="btn btn-gold px-4 py-2" onclick="drawSingleTarot()"><i class="fas fa-random mr-2"></i> สุ่มไพ่ 1 ใบ (Draw)</button>
                <button class="btn btn-dark px-4 py-2 ml-2" onclick="downloadSingleTarot()"><i class="fas fa-download mr-2"></i> ดาวน์โหลดภาพ (PNG)</button>
            </div>
        </div>

        <!-- Custom Summary Input (Mode 3) -->
        <div class="row mb-4 justify-content-center" id="summaryMode3">
            <div class="col-md-8">
                <div class="card shadow-sm border-0">
                    <div class="card-body bg-light rounded">
                        <label for="customSummaryInput" class="font-weight-bold text-dark"><i class="fas fa-edit text-primary mr-1"></i> ปรับแต่งบทสรุปภาพรวม (แสดงด้านล่างภาพ):</label>
                        <textarea id="customSummaryInput" class="form-control" rows="3" placeholder="พิมพ์บทสรุปของคุณที่นี่... (หากเว้นว่างไว้ ระบบจะสร้างบทสรุปให้อัตโนมัติ)" oninput="document.getElementById('summaryText').innerText = this.value || autoSummary"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div id="previewWrapper">`;

html = html.replace(controlsRegex, newControls);

// 3. Add 1-card Canvas
const previewWrapperRegex = /<div id="previewWrapper">/;
const previewWrapperNew = `<div id="previewWrapper3">`;
html = html.replace(previewWrapperRegex, previewWrapperNew);

const addCanvas1 = `
        <!-- 1 Card Mode Canvas -->
        <div id="previewWrapper1" style="display: none; width: 100%; overflow: hidden; display: flex; justify-content: center; background: #e9ecef; border: 1px dashed #ccc; padding: 20px 0; border-radius: 8px; margin-top: 20px;">
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
                    <!-- Card Display -->
                    <div style="display: flex; gap: 40px; align-items: center; margin-bottom: 30px;">
                        <img id="tarotPreviewImg" src="" crossorigin="anonymous" style="height: 400px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 0 3px #d4af37;">
                        <div style="max-width: 500px; color: #fff;">
                            <h2 id="tarotPreviewName" style="color: #f1c40f; font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">The Fool</h2>
                            <p id="tarotPreviewMeaning" style="font-size: 1.3rem; line-height: 1.6; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">...</p>
                        </div>
                    </div>

                    <!-- Readings -->
                    <div style="width: 90%; background: rgba(0,0,0,0.4); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="background: rgba(255,255,255,0.05); padding: 15px 20px; border-radius: 10px; border-left: 4px solid #3498db;">
                                <strong style="color: #3498db; font-size: 1.2rem; display: block; margin-bottom: 5px;">🕰️ อดีต (Past)</strong>
                                <span id="tarotPreviewPast" style="color: #e0e0e0; font-size: 1.1rem; line-height: 1.5;">...</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 15px 20px; border-radius: 10px; border-left: 4px solid #2ecc71;">
                                <strong style="color: #2ecc71; font-size: 1.2rem; display: block; margin-bottom: 5px;">🎯 ปัจจุบัน (Present)</strong>
                                <span id="tarotPreviewPresent" style="color: #e0e0e0; font-size: 1.1rem; line-height: 1.5;">...</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 15px 20px; border-radius: 10px; border-left: 4px solid #9b59b6;">
                                <strong style="color: #9b59b6; font-size: 1.2rem; display: block; margin-bottom: 5px;">🔮 อนาคต (Future)</strong>
                                <span id="tarotPreviewFuture" style="color: #e0e0e0; font-size: 1.1rem; line-height: 1.5;">...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

html = html.replace('        <div id="previewWrapper3">', addCanvas1 + '\n        <div id="previewWrapper3">');

fs.writeFileSync('adminTarotReading.html', html, 'utf-8');
console.log("adminTarotReading.html updated.");
