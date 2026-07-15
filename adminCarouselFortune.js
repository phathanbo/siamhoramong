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
            if (!arr || arr.length === 0) return "-";
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
            
            // Astro rings
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
            ctx.fillText("🔮 สยามโหรามงคล", 1050, 1060);
        }

        for (let i = 0; i < 9; i++) {
            Swal.update({ html: `เรนเดอร์ภาพ ${i+1} / 9` });
            await new Promise(r => setTimeout(r, 50));
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawSpaceBg();

            let namePart = "";

            if (i === 0) { // Cover
                namePart = "Cover";
                drawRoundedRect(ctx, 140, 315, 800, 450, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', {color:'rgba(0,0,0,0.5)', blur:40});
                
                ctx.textAlign = 'center';
                ctx.font = 'bold 64px "Sarabun", sans-serif';
                drawStrokedText(ctx, "ดวงรายวัน", 540, 380, '#d4af37', 'rgba(212,175,55,0.3)', 2);
                drawStrokedText(ctx, "แม่นๆ มาแล้วจ้า!", 540, 460, '#d4af37', 'rgba(212,175,55,0.3)', 2);
                
                drawRoundedRect(ctx, 240, 520, 600, 60, 30, 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = '28px "Sarabun", sans-serif';
                ctx.fillText(`ประจำวัน${dayNameStr}ที่ ${dateTitle}`, 540, 560);
                
                ctx.font = 'bold 36px "Sarabun", sans-serif';
                ctx.fillText("เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!", 540, 650);
                
                const btnGrad = ctx.createLinearGradient(140, 0, 940, 0);
                btnGrad.addColorStop(0, '#3498db');
                btnGrad.addColorStop(1, '#9b59b6');
                drawRoundedRect(ctx, 140, 850, 800, 80, 40, btnGrad, null, {color:'rgba(0,0,0,0.5)', blur:30});
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText("เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉", 540, 898);

            } else if (i === 1) { // KalaYok
                namePart = "KalaYok";
                ctx.textAlign = 'center';
                ctx.font = 'bold 50px "Sarabun", sans-serif';
                ctx.fillStyle = '#fff';
                ctx.fillText("ฐานดวงประจำปี: ใครดวงปัง ใครต้องระวัง?", 540, 160);
                
                let badDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.ubart]}` : 'วันอาทิตย์';
                let bestDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.thongChai]}` : 'วันจันทร์';
                let powerDayTxt = kala ? `วัน${CF_DAY_NAMES[kala.athibadi]}` : 'วันเสาร์';

                const panels = [
                    {x: 70, color: '#e74c3c', t1: badDayTxt, t2: "เกณฑ์ 'อุบาทว์'", desc: "ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี"},
                    {x: 390, color: '#2ecc71', t1: bestDayTxt, t2: "เกณฑ์ 'วันธงชัย'", desc: "ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง"},
                    {x: 710, color: '#9b59b6', t1: powerDayTxt, t2: "เกณฑ์ 'วันอธิบดี'", desc: "ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ"}
                ];

                panels.forEach(p => {
                    drawRoundedRect(ctx, p.x, 350, 300, 450, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, 350, 300, 5); // top border
                    
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
                namePart = "Day" + (i - 1);
                const dayIdx = i - 2;
                const seed = dateSeedBase + dayIdx;
                
                let wText = "", fText = "", rawLove = "";
                if (typeof DAILY_FORTUNE_DB !== 'undefined') {
                    wText = getRandomFromDB(DAILY_FORTUNE_DB.work, seed + 1);
                    fText = getRandomFromDB(DAILY_FORTUNE_DB.finance, seed + 2);
                    rawLove = getRandomFromDB(DAILY_FORTUNE_DB.love, seed + 3);
                }
                
                let lText = "เสน่ห์แรง มีคนเข้ามาให้ความสนใจ";
                let coupleText = "ความรักราบรื่น ดูแลเอาใจใส่กันดี";
                if (rawLove.includes("คนมีคู่:")) {
                    let parts = rawLove.split("คนมีคู่:");
                    lText = parts[0].replace("คนโสด:", "").trim();
                    coupleText = parts[1].trim();
                }
                wText = wText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                fText = fText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                lText = lText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);
                coupleText = coupleText.replace(/✨|💼|🧱|🌟|🗣️|🚶‍♂️|🤝|จ้า|กันเลย/g, '').trim().substring(0, 70);

                const dColor = CF_DAY_COLORS[dayIdx];
                const luckyNum = `${Math.floor(seededRandom(seed + 4) * 10)}${Math.floor(seededRandom(seed + 5) * 10)}`;
                let colorStr = "-";
                if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]]) {
                    const colors = DASH_DAY_COLORS[CF_DAY_NAMES[dayIdx]].colors;
                    if(colors && colors.length > 0) colorStr = colors.join(', ');
                }

                // Title Box
                drawRoundedRect(ctx, 340, 80, 400, 70, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', {color: dColor, blur: 30});
                ctx.beginPath(); ctx.arc(380, 115, 15, 0, Math.PI*2); ctx.fillStyle = dColor; ctx.fill();
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 48px "Sarabun", sans-serif';
                ctx.fillText(`คนเกิดวัน${CF_DAY_NAMES[dayIdx]}`, 420, 130);

                // Work Box
                drawRoundedRect(ctx, 110, 250, 860, 140, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText("💼 การงาน", 230, 290);
                ctx.font = '22px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                ctx.fillText(wText, 230, 330);

                // Finance Box
                drawRoundedRect(ctx, 110, 415, 860, 140, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText("💰 การเงิน", 230, 455);
                ctx.font = '22px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                ctx.fillText(fText, 230, 495);

                // Love Box
                drawRoundedRect(ctx, 110, 580, 860, 200, 20, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText("❤️ ความรัก", 230, 620);
                ctx.fillText("โสด", 400, 620);
                ctx.fillText("มีคู่", 700, 620);
                
                ctx.font = '20px "Sarabun", sans-serif';
                ctx.fillStyle = '#eee';
                wrapText(ctx, lText, 400, 670, 350, 28);
                ctx.fillStyle = '#999';
                wrapText(ctx, coupleText, 700, 670, 350, 28);

                // Footer Box
                drawRoundedRect(ctx, 110, 890, 860, 70, 15, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Sarabun", sans-serif';
                ctx.fillText("ทริคเสริมดวง", 150, 935);
                ctx.fillText(`เลขมงคล: ${luckyNum}`, 380, 935);
                ctx.fillText(`สีมงคล: ${colorStr}`, 650, 935);
            }

            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Carousel_${dateStr}_${namePart}.png`;
            link.href = imgData;
            link.click();
            await new Promise(r => setTimeout(r, 500));
        }
        
        Swal.fire('สำเร็จ', 'ดาวน์โหลดภาพทั้งหมด 9 ภาพเรียบร้อยแล้ว', 'success');

    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');
    }
}
