const fs = require('fs');

let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const newPreviewFunc = `function renderCarouselPreview() {
    const area = document.getElementById('cfPreviewWrapper');
    if (!area) return;

    const dateStr = document.getElementById('cfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = CF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dateTitle = dateObj.toLocaleDateString('th-TH', options);

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

    // CSS สำหรับ Background อวกาศ (โทนสว่าง)
    const spaceBg = \`
        background-color: #fdfbf7; 
        background-image: radial-gradient(circle at 50% 10%, #fffdfa 0%, #f9f4ea 80%);
    \`;
    
    // CSS สำหรับวงแหวนดาราศาสตร์ (ทองจาง)
    const astroRings = \`
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:700px; height:700px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.15); box-sizing:border-box;"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:960px; height:960px; border-radius:50%; border:1.5px solid rgba(212,175,55,0.15); box-sizing:border-box;"></div>
    \`;

    // 1. หน้าปก (Cover)
    let slidesHtml = \`
        <div class="cf-slide" id="cf-slide-0" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; \${spaceBg}">
            \${astroRings}
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(0,0,0,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
            
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:800px; height:550px; background:#fff; border-radius:30px; box-shadow:0 15px 40px rgba(0,0,0,0.15); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:40px; border:2px solid rgba(212,175,55,0.4);">
                <h1 style="color:#b8860b; font-size:80px; font-weight:bold; margin-bottom:10px; text-align:center;">
                    ดวงรายวัน
                </h1>
                <h2 style="color:#2c3e50; font-size:50px; font-weight:bold; margin-top:0;">แม่นๆ มาแล้วจ้า!</h2>
                <div style="background:#fdfbf7; border-radius:35px; border:1px solid #d4af37; padding:15px 50px; margin:30px 0;">
                    <span style="color:#333; font-size:30px; font-weight:bold;">ประจำวัน\${dayNameStr}ที่ \${dateTitle}</span>
                </div>
                <h2 style="color:#555; font-size:32px; margin-top:10px;">เช็คดวงด่วนๆ ก่อนเริ่มวันใหม่!</h2>
            </div>
            
            <div style="position:absolute; bottom:150px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg, #b8860b, #d4af37); padding:25px 60px; border-radius:40px; box-shadow:0 10px 20px rgba(184,134,11,0.3);">
                <span style="color:#fff; font-size:24px; font-weight:bold;">เตรียมรับมือกับการงาน การเงิน ความรัก และทริคเสริมดวงฉบับรวบรัด 👉</span>
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
            <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(0,0,0,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
            
            <div style="position:absolute; top:100px; left:0; width:100%; text-align:center;">
                <h2 style="color:#2c3e50; font-size:46px; font-weight:bold;">
                    อัปเดตฐานดวง: ใครดวงปัง ใครต้องระวัง?
                </h2>
            </div>

            <div style="position:absolute; top:260px; left:70px; width:300px; height:520px; background:#fff; border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#e74c3c; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #e74c3c; background:#fcf8f2; display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">⚠️</div>
                <h3 style="color:#333; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${badDayTxt}</h3>
                <h4 style="color:#e74c3c; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'อุบาทว์'</h4>
                <p style="color:#555; font-size:22px; text-align:center; padding:0 20px;">ระวังเรื่องหงุดหงิดใจเป็นพิเศษ ควบคุมอารมณ์ให้ดี</p>
            </div>

            <div style="position:absolute; top:260px; left:390px; width:300px; height:520px; background:#fff; border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#27ae60; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #27ae60; background:#fcf8f2; display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">🚩</div>
                <h3 style="color:#333; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${bestDayTxt}</h3>
                <h4 style="color:#27ae60; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'วันธงชัย'</h4>
                <p style="color:#555; font-size:22px; text-align:center; padding:0 20px;">ดวงแข็งเป็นพิเศษ! ทำการใหญ่มีโอกาสสำเร็จสูง</p>
            </div>

            <div style="position:absolute; top:260px; left:710px; width:300px; height:520px; background:#fff; border-radius:25px; box-shadow:0 15px 20px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center;">
                <div style="width:100%; height:8px; background:#8e44ad; border-radius:25px 25px 0 0;"></div>
                <div style="width:120px; height:120px; border-radius:50%; border:4px solid #8e44ad; background:#fcf8f2; display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:50px;">👑</div>
                <h3 style="color:#333; font-size:30px; font-weight:bold; margin:20px 0 5px 0;">\${powerDayTxt}</h3>
                <h4 style="color:#8e44ad; font-size:26px; font-weight:bold; margin:0 0 15px 0;">เกณฑ์ 'วันอธิบดี'</h4>
                <p style="color:#555; font-size:22px; text-align:center; padding:0 20px;">ดวงมีเกณฑ์ได้เป็นใหญ่ ผู้คนเกรงใจและให้เกียรติ</p>
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
        if (dColor === '#000000') dColor = '#34495e';

        const luckyNum = '' + Math.floor(seededRandom(seed + 4) * 10) + Math.floor(seededRandom(seed + 5) * 10);
        let colorStr = '-';
        if (typeof DASH_DAY_COLORS !== 'undefined' && DASH_DAY_COLORS[CF_DAY_NAMES[i]]) {
            const colors = DASH_DAY_COLORS[CF_DAY_NAMES[i]].colors;
            if(colors && colors.length > 0) colorStr = colors.join(', ');
        }

        slidesHtml += \`
            <div class="cf-slide" id="cf-slide-\${i+2}" style="width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; \${spaceBg}">
                \${astroRings}
                <div style="position:absolute; bottom:20px; right:30px; font-size:18px; color:rgba(0,0,0,0.3); font-weight:bold;">🔮 สยามโหรามงคล (Siamhora)</div>
                
                <div style="position:absolute; top:80px; left:290px; width:500px; height:80px; background:#fff; border-radius:40px; box-shadow:0 15px 20px rgba(0,0,0,0.15); display:flex; align-items:center; padding:0 30px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:\${dColor}; margin-right:20px;"></div>
                    <h2 style="color:#333; font-size:44px; font-weight:bold; margin:0;">คนเกิดวัน\${CF_DAY_NAMES[i]}</h2>
                </div>

                <div style="position:absolute; top:210px; left:90px; width:900px; height:170px; background:#fff; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.08);">
                    <div style="width:100%; height:6px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#b8860b; font-size:28px; font-weight:bold; margin-bottom:15px;">💼 การงาน</div>
                        <div style="color:#4a4a4a; font-size:24px;">\${wText}</div>
                    </div>
                </div>

                <div style="position:absolute; top:410px; left:90px; width:900px; height:170px; background:#fff; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.08);">
                    <div style="width:100%; height:6px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#b8860b; font-size:28px; font-weight:bold; margin-bottom:15px;">💰 การเงิน</div>
                        <div style="color:#4a4a4a; font-size:24px;">\${fText}</div>
                    </div>
                </div>

                <div style="position:absolute; top:610px; left:90px; width:900px; height:200px; background:#fff; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.08);">
                    <div style="width:100%; height:6px; background:\${dColor}; border-radius:20px 20px 0 0;"></div>
                    <div style="padding: 25px 30px;">
                        <div style="color:#b8860b; font-size:28px; font-weight:bold; margin-bottom:15px;">❤️ ความรัก</div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div><span style="color:#8b5a2b; font-size:22px; font-weight:bold;">โสด:</span> <span style="color:#4a4a4a; font-size:22px;">\${lText}</span></div>
                            <div><span style="color:#8b5a2b; font-size:22px; font-weight:bold;">มีคู่:</span> <span style="color:#4a4a4a; font-size:22px;">\${coupleText}</span></div>
                        </div>
                    </div>
                </div>

                <div style="position:absolute; top:850px; left:90px; width:900px; height:90px; background:#fff; border-radius:25px; box-shadow:0 10px 15px rgba(0,0,0,0.1); display:flex; align-items:center; padding:0 40px;">
                    <div style="color:\${dColor}; font-size:26px; font-weight:bold; flex:1;">✨ ทริคเสริมดวง</div>
                    <div style="color:#555; font-size:24px; flex:1;">เลขมงคล: \${luckyNum}</div>
                    <div style="color:#555; font-size:24px; flex:1;">สีมงคล: \${colorStr}</div>
                </div>
            </div>
        \`;
    }

    area.innerHTML = slidesHtml;
    // ปรับ Scale ให้พอดีกับกรอบ
    const containerWidth = document.getElementById('cfPreviewContainer').clientWidth;
    const scale = (containerWidth - 20) / 1080;
    const slides = document.querySelectorAll('.cf-slide');
    slides.forEach(s => {
        s.style.transform = \`scale(\${scale})\`;
        s.style.transformOrigin = 'top left';
        s.style.marginBottom = \`-\${1080 * (1 - scale) - 20}px\`;
    });
}
`;

const regex = /function renderCarouselPreview\(\) \{[\s\S]*?area\.innerHTML = slidesHtml;[\s\S]*?\}\s*\n/m;
let fixedJs = js.replace(regex, newPreviewFunc);
fs.writeFileSync('adminZodiacAutoCarousel.js', fixedJs);
