function openCarouselFortuneModal() {
    let existing = document.getElementById('carouselFortuneModal');
    if (existing) existing.remove();

    const todayStr = new Date().toISOString().split('T')[0];

    const html = `
    <div id="carouselFortuneModal" class="admin-modal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
        <div class="admin-modal-content" style="max-width: 1400px; width: 95%; padding: 0; display: flex; flex-direction: column; max-height: 95vh; overflow: hidden; background: #fdfdfd; color: #333; border-radius: 20px;">
            <div class="modal-header d-flex justify-content-between align-items-center" style="padding: 20px 30px; border-bottom: 1px solid #eee; background: #fff;">
                <h3 class="m-0 text-dark"><i class="fas fa-images text-dark mr-2"></i>สร้างอัลบั้มดวงรายวัน (Carousel)</h3>
                <span class="close-modal" onclick="closeCarouselFortuneModal()" style="font-size: 1.5rem; cursor: pointer; color: #888;">&times;</span>
            </div>
            
            <div style="display: flex; flex: 1; overflow: hidden;">
                <!-- ซ้าย: การตั้งค่า -->
                <div style="flex: 0 0 350px; padding: 25px; background: #f8f9fa; border-right: 1px solid #eee; overflow-y: auto;">
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">📅 เลือกวันที่:</label>
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" onclick="changeCarouselDate(-1)" type="button" style="padding: 4px 12px !important; border-radius: 8px 0 0 8px !important; font-size: 0.9rem !important; height: auto !important;"><i class="fas fa-chevron-left"></i></button>
                            <input type="date" id="cfDate" class="form-control text-center" value="${todayStr}" onchange="renderCarouselPreview()" style="border-radius: 0 !important; height: auto !important;">
                            <button class="btn btn-outline-secondary" onclick="changeCarouselDate(1)" type="button" style="padding: 4px 12px !important; border-radius: 0 8px 8px 0 !important; font-size: 0.9rem !important; height: auto !important;"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>

                    <button class="btn btn-dark btn-block mt-4 mb-2 shadow-sm" onclick="downloadCarouselImages()" style="font-size: 1.1rem; padding: 12px; border-radius: 8px; font-weight: bold; background: linear-gradient(135deg, #2c3e50, #000000); border: 1px solid #d4af37; color: #d4af37;">
                        <i class="fas fa-download mr-2"></i> ดาวน์โหลด 9 ภาพ
                    </button>
                    <p class="text-muted small mt-3 text-center">ภาพจะถูกบันทึกเป็นไฟล์ PNG ความละเอียดสูง (1080x1080) จำนวน 9 ภาพ สำหรับลงโซเชียลแบบสไลด์อัลบั้ม</p>
                </div>

                <!-- ขวา: พื้นที่ Preview (Scroll ได้) -->
                <div style="flex: 1; padding: 20px; background: #eaedf2; display: flex; flex-direction: column; align-items: center; overflow-y: auto; overflow-x: hidden;">
                    <div id="cfPreviewWrapper" style="transform: scale(0.6); transform-origin: top center; transition: all 0.3s; display: flex; flex-direction: column; gap: 40px; padding-bottom: 500px;">
                        <!-- Canvas Slides จะถูกวาดในนี้ -->
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    renderCarouselPreview();
}

function closeCarouselFortuneModal() {
    const el = document.getElementById('carouselFortuneModal');
    if (el) el.remove();
}

function changeCarouselDate(offset) {
    const dateInput = document.getElementById('cfDate');
    if (!dateInput) return;
    
    let currentDate = new Date(dateInput.value);
    if (isNaN(currentDate.getTime())) currentDate = new Date();
    
    currentDate.setDate(currentDate.getDate() + offset);
    
    const tzOffset = currentDate.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(currentDate - tzOffset)).toISOString().slice(0, 10);
    
    dateInput.value = localISOTime;
    renderCarouselPreview();
}

const CF_DAY_COLORS = ['#e74c3c', '#f1c40f', '#e84393', '#27ae60', '#e67e22', '#3498db', '#8e44ad'];
const CF_DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

function renderCarouselPreview() {
    const area = document.getElementById('cfPreviewWrapper');
    if (!area) return;

    const dateStr = document.getElementById('cfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = CF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dateTitle = dateObj.toLocaleDateString('th-TH', options);
    // เปลี่ยน พ.ศ. ให้ถูกต้องถ้ายังไม่บวก 543
    if (dateTitle.includes('202') || dateTitle.includes('256')) {
        // Javascript toLocaleDateString('th-TH') usually outputs BE (256x) automatically. 
    }

    // ดึงกาลโยค
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

    
    const svgStar = `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    const svgGlobe = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
    const svgWarning = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    const svgFlag = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`;
    const svgCrown = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#9b59b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="2 20 22 20 19 6 15 12 12 4 9 12 5 6 2 20"></polygon></svg>`;
    const svgBriefcase = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    const svgMoney = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`;
    const svgHeart = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

    // CSS สำหรับ Background อวกาศ (ใช้ในทุกสไลด์)
    const spaceBg = `
        background-color: #0d1221; 
        background-image: radial-gradient(circle at 20% 30%, #1a2235 0%, transparent 40%), radial-gradient(circle at 80% 70%, #1a2235 0%, transparent 40%);
    `;
    
    // CSS สำหรับวงแหวนดาราศาสตร์
    const astroRings = `
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:600px; height:600px; border-radius:50%; border:1px solid rgba(255,255,255,0.05); box-sizing:border-box;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:800px; height:800px; border-radius:50%; border:1px solid rgba(255,255,255,0.03); box-sizing:border-box;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:1000px; height:1000px; border-radius:50%; border:1px solid rgba(255,255,255,0.02); box-sizing:border-box;"></div>
    `;

    // สไตล์ Glassmorphism
    const glassPanel = `
        background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px;
        box-shadow: inset 0 0 20px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5);
    `;

    // 1. หน้าปก (Cover)
    let slidesHtml = `
        <div class="cf-slide" id="cf-slide-0" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
            ${astroRings}
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.4); font-weight:bold;">🔮 สยามโหรามงคล</div>
            
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:800px; height:450px; ${glassPanel} display:flex; flex-direction:column; justify-content:center; align-items:center; padding:40px;">
                <h1 style="color:#d4af37; font-size:64px; font-weight:bold; margin-bottom:10px; text-shadow:0 0 20px rgba(212,175,55,0.3); text-align:center;">
                    ${svgStar} ดวงรายวัน<br>แม่นๆ มาแล้วจ้า!
                </h1>
                <div style="background:rgba(255,255,255,0.1); border-radius:30px; padding:10px 40px; margin:30px 0;">
                    <span style="color:#fff; font-size:28px;">ประจำวัน${dayNameStr}ที่ ${dateTitle}</span>
                </div>
                <h2 style="color:#fff; font-size:36px; font-weight:bold; margin-top:10px;">เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!</h2>
            </div>
            
            <div style="position:absolute; bottom:150px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg, #3498db, #9b59b6); padding:20px 50px; border-radius:50px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                <span style="color:#fff; font-size:24px; font-weight:bold;">เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉</span>
            </div>
        </div>
    `;

    // 2. สไลด์กาลโยค (KalaYok)
    let badDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.ubart]}` : 'วันอาทิตย์';
    let bestDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.thongChai]}` : 'วันจันทร์';
    let powerDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.athibadi]}` : 'วันเสาร์';

    slidesHtml += `
        <div class="cf-slide" id="cf-slide-1" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
            ${astroRings}
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.4); font-weight:bold;">🔮 สยามโหรามงคล</div>
            
            <div style="position:absolute; top:120px; left:0; width:100%; text-align:center;">
                <h2 style="color:#fff; font-size:50px; font-weight:bold;">
                    ${svgGlobe} ฐานดวงประจำปี: ใครดวงปัง ใครต้องระวัง?
                </h2>
            </div>

            <div style="position:absolute; top:350px; left:0; width:100%; display:flex; justify-content:center; gap:40px; padding:0 60px;">
                <!-- อุบาทว์ -->
                <div style="width:300px; height:450px; ${glassPanel} display:flex; flex-direction:column; align-items:center; padding:30px; border-top: 3px solid #e74c3c;">
                    <div style="width:150px; height:150px; border-radius:50%; border:10px solid #e74c3c; margin-bottom:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(231,76,60,0.5);">
                        ${svgWarning}
                    </div>
                    <h3 style="color:#fff; font-size:28px; font-weight:bold; margin-bottom:10px; text-align:center;">🔴 ${badDayTxt}<br>เกณฑ์ 'อุบาทว์'</h3>
                    <p style="color:#bbb; font-size:20px; text-align:center; line-height:1.6; margin-top:20px;">ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี</p>
                </div>
                <!-- ธงชัย -->
                <div style="width:300px; height:450px; ${glassPanel} display:flex; flex-direction:column; align-items:center; padding:30px; border-top: 3px solid #2ecc71;">
                    <div style="width:150px; height:150px; border-radius:50%; border:10px solid #2ecc71; margin-bottom:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(46,204,113,0.5);">
                        ${svgFlag}
                    </div>
                    <h3 style="color:#fff; font-size:28px; font-weight:bold; margin-bottom:10px; text-align:center;">🟢 ${bestDayTxt}<br>เกณฑ์ 'วันธงชัย'</h3>
                    <p style="color:#bbb; font-size:20px; text-align:center; line-height:1.6; margin-top:20px;">ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง</p>
                </div>
                <!-- อธิบดี -->
                <div style="width:300px; height:450px; ${glassPanel} display:flex; flex-direction:column; align-items:center; padding:30px; border-top: 3px solid #9b59b6;">
                    <div style="width:150px; height:150px; border-radius:50%; border:10px solid #9b59b6; margin-bottom:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(155,89,182,0.5);">
                        ${svgCrown}
                    </div>
                    <h3 style="color:#fff; font-size:28px; font-weight:bold; margin-bottom:10px; text-align:center;">🟣 ${powerDayTxt}<br>เกณฑ์ 'วันอธิบดี'</h3>
                    <p style="color:#bbb; font-size:20px; text-align:center; line-height:1.6; margin-top:20px;">ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ</p>
                </div>
            </div>
        </div>
    `;

    // 3. สไลด์ 7 วันเกิด (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
        const seed = dateSeedBase + i;
        
        let wText = "";
        let fText = "";
        let rawLove = "";

        if (typeof DAILY_FORTUNE_DB !== 'undefined') {
            wText = getRandomFromDB(DAILY_FORTUNE_DB.work, seed + 1);
            fText = getRandomFromDB(DAILY_FORTUNE_DB.finance, seed + 2);
            rawLove = getRandomFromDB(DAILY_FORTUNE_DB.love, seed + 3);
        } else {
            wText = "การงานมีความคืบหน้า ได้รับการสนับสนุนจากผู้ใหญ่";
            fText = "การเงินหมุนเวียนดี มีโชคลาภเล็กๆน้อยๆเข้ามา";
            rawLove = "คนโสด: เสน่ห์แรง มีคนเข้ามาให้ความสนใจ\nคนมีคู่: ความรักราบรื่น ดูแลเอาใจใส่กันดี";
        }

        let lText = "เสน่ห์แรง มีคนเข้ามาให้ความสนใจ";
        let coupleText = "ความรักราบรื่น ดูแลเอาใจใส่กันดี";

        if (rawLove.includes("คนมีคู่:")) {
            let parts = rawLove.split("คนมีคู่:");
            lText = parts[0].replace("คนโสด:", "").trim();
            coupleText = parts[1].trim();
        }

        // ตัดแต่งคำให้กระชับ
        wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
        fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
        lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
        coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);

        let colorStr = "-";
        if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[i]]) {
            const colors = DASH_DAY_COLORS[CF_DAY_NAMES[i]].colors;
            if(colors && colors.length > 0) colorStr = colors.join(', ');
        } else {
            const colorMap = {'อาทิตย์':'แดง','จันทร์':'เหลือง','อังคาร':'ชมพู','พุธ':'เขียว','พฤหัสบดี':'ส้ม','ศุกร์':'ฟ้า','เสาร์':'ม่วง'};
            colorStr = colorMap[CF_DAY_NAMES[i]];
        }
        
        const luckyNum1 = Math.floor(seededRandom(seed + 4) * 10);
        const luckyNum2 = Math.floor(seededRandom(seed + 5) * 10);

        const dColor = CF_DAY_COLORS[i];

        slidesHtml += `
            <div class="cf-slide" id="cf-slide-${i+2}" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; ${spaceBg}">
                ${astroRings}
                <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(255,255,255,0.4); font-weight:bold;">🔮 สยามโหรามงคล</div>
                
                <!-- Title Box -->
                <div style="position:absolute; top:80px; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:15px 50px; display:flex; align-items:center; gap:20px; box-shadow:0 0 30px ${dColor}33;">
                    <div style="width:30px; height:30px; border-radius:50%; background:${dColor}; box-shadow:0 0 10px ${dColor};"></div>
                    <h2 style="color:#fff; font-size:48px; font-weight:bold; margin:0;">คนเกิดวัน${CF_DAY_NAMES[i]}</h2>
                </div>

                <!-- Content Boxes -->
                <div style="position:absolute; top:250px; left:50%; transform:translateX(-50%); width:860px; display:flex; flex-direction:column; gap:25px;">
                    
                    <!-- การงาน -->
                    <div style="${glassPanel} padding:30px 40px; display:flex; gap:30px; align-items:center;">
                        <div style="width:70px; height:70px; border-radius:15px; border:2px solid rgba(255,255,255,0.2); display:flex; justify-content:center; align-items:center;">
                            ${svgBriefcase(dColor)}
                        </div>
                        <div style="flex:1;">
                            <h4 style="color:#fff; font-size:24px; font-weight:bold; margin-bottom:5px;">💼 การงาน</h4>
                            <p style="color:#eee; font-size:22px; margin:0; line-height:1.5;">${wText}</p>
                        </div>
                    </div>

                    <!-- การเงิน -->
                    <div style="${glassPanel} padding:30px 40px; display:flex; gap:30px; align-items:center;">
                        <div style="width:70px; height:70px; border-radius:15px; border:2px solid rgba(255,255,255,0.2); display:flex; justify-content:center; align-items:center;">
                            ${svgMoney(dColor)}
                        </div>
                        <div style="flex:1;">
                            <h4 style="color:#fff; font-size:24px; font-weight:bold; margin-bottom:5px;">💰 การเงิน</h4>
                            <p style="color:#eee; font-size:22px; margin:0; line-height:1.5;">${fText}</p>
                        </div>
                    </div>

                    <!-- ความรัก (มีปุ่มโสด/คู่) -->
                    <div style="${glassPanel} padding:30px 40px; display:flex; gap:30px; align-items:center;">
                        <div style="width:70px; height:70px; border-radius:15px; border:2px solid rgba(255,255,255,0.2); display:flex; justify-content:center; align-items:center;">
                            ${svgHeart(dColor)}
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                                <h4 style="color:#fff; font-size:24px; font-weight:bold; margin:0; width: 140px;">❤️ ความรัก</h4>
                                
                                <div style="display:flex; justify-content:space-between; align-items:center; flex:1;">
                                    <div style="flex:1; text-align: center;">
                                        <span style="color:#fff; font-size:24px; font-weight:bold;">โสด</span>
                                    </div>
                                    <div style="width:60px; height:30px; background:rgba(255,255,255,0.2); border-radius:15px; position:relative; margin:0 10px;">
                                        <div style="width:26px; height:26px; background:#fff; border-radius:50%; position:absolute; left:2px; top:2px;"></div>
                                    </div>
                                    <div style="flex:1; text-align: center;">
                                        <span style="color:#fff; font-size:24px; font-weight:bold;">มีคู่</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display:flex; justify-content:space-between; gap:30px; margin-left: 140px;">
                                <p style="color:#eee; font-size:20px; margin:0; line-height:1.4; flex:1; text-align:center;">${lText}</p>
                                <p style="color:#999; font-size:20px; margin:0; line-height:1.4; flex:1; text-align:center;">${coupleText}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer (ทริคเสริมดวง) -->
                <div style="position:absolute; bottom:120px; left:50%; transform:translateX(-50%); width:860px; height:70px; display:flex; border-radius:15px; overflow:hidden; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);">
                    <div style="background:${dColor}44; display:flex; align-items:center; justify-content:center; padding:0 30px; border-right:1px solid rgba(255,255,255,0.1);">
                        <span style="color:#fff; font-size:24px; font-weight:bold;">ทริคเสริมดวง</span>
                    </div>
                    <div style="flex:1; display:flex; align-items:center; padding:0 30px; border-right:1px solid rgba(255,255,255,0.1);">
                        <span style="color:#fff; font-size:24px; font-weight:bold;">เลขมงคล: ${luckyNum1}${luckyNum2}</span>
                    </div>
                    <div style="flex:1; display:flex; align-items:center; padding:0 30px; gap:15px;">
                        <span style="color:#fff; font-size:24px; font-weight:bold;">สีมงคล: ${colorStr}</span>
                        <div style="width:25px; height:25px; border-radius:50%; background:${dColor}; box-shadow:0 0 10px ${dColor}; margin-left:auto;"></div>
                    </div>
                </div>

            </div>
        `;
    }

    area.innerHTML = slidesHtml;
}

async function downloadCarouselImages() {
    const slides = document.querySelectorAll('.cf-slide');
    if (slides.length === 0) return;

    const wrapper = document.getElementById('cfPreviewWrapper');
    let originalTransform = "";
    if (wrapper) {
        originalTransform = wrapper.style.transform;
        wrapper.style.transform = "scale(1)";
    }

    Swal.fire({
        title: 'กำลังสร้างอัลบั้มภาพ...',
        html: 'เรนเดอร์ภาพ 0 / 9',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const dateStr = document.getElementById('cfDate').value;
        
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            
            Swal.update({ html: `เรนเดอร์ภาพ ${i+1} / 9` });
            
            // รอให้ UI update สักครู่
            await new Promise(r => setTimeout(r, 100));

            const canvas = await html2canvas(slide, {
                scale: 1.5, // ลด scale ลงเล็กน้อยเพื่อให้ทำงานเร็วและไฟล์ไม่ใหญ่เกินไป 1080x1080 -> 1620x1620
                useCORS: true,
                backgroundColor: '#0d1221'
            });

            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            
            let namePart = "Cover";
            if(i === 1) namePart = "KalaYok";
            else if (i > 1) namePart = "Day" + (i - 1); // Day1-7

            link.download = `Carousel_${dateStr}_${namePart}.png`;
            link.href = imgData;
            link.click();
            
            // หน่วงเวลาให้เบราว์เซอร์เซฟไฟล์
            await new Promise(r => setTimeout(r, 500));
        }
        
        if (wrapper) wrapper.style.transform = originalTransform;
        Swal.fire('สำเร็จ', 'ดาวน์โหลดภาพทั้งหมด 9 ภาพเรียบร้อยแล้ว', 'success');

    } catch (error) {
        if (wrapper) wrapper.style.transform = originalTransform;
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');
    }
}
