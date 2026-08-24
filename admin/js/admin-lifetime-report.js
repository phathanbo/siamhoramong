window.isAdmin = () => true;

document.addEventListener('DOMContentLoaded', () => {
    // Populate Members Select
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    const memberSelect = document.getElementById('vipMemberSelect');
    if (memberSelect) {
        memberSelect.innerHTML = '<option value="">-- เลือกจากฐานข้อมูลลูกค้า --</option>';
        allHistory.forEach((m, idx) => {
            if (m && m.name) {
                memberSelect.innerHTML += `<option value="${idx}">${m.name} (${m.birthdate || m.birthDate || m.date || 'ไม่ระบุวันเกิด'})</option>`;
            }
        });
    }
});

window.autoFillLifetimeMember = function(idxOrId) {
    if (idxOrId === '') return;
    
    // ลองอ่านข้อมูลจาก data-member attribute ของ option ที่ถูกเลือกก่อน
    let m = null;
    const selectEl = document.getElementById('vipMemberSelect');
    if (selectEl) {
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        const dataMember = selectedOption && selectedOption.getAttribute('data-member');
        if (dataMember) {
            try { m = JSON.parse(dataMember); } catch(e) {}
        }
    }
    
    // ถ้าไม่มี data-member ค้นหาจาก localStorage แทน
    if (!m) {
        let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
        m = allHistory[idxOrId];
        if (!m) m = allHistory.find(item => item.memberId === idxOrId);
        if (!m) m = allHistory.find(item => (item.name + (item.lastName ? ' ' + item.lastName : '')) === idxOrId);
        if (!m) m = allHistory.find(item => item.name === idxOrId);
    }
    
    if (m) {
        // ชื่อ
        const fullName = m.name && m.lastName ? `${m.name} ${m.lastName}` : (m.name || '');
        document.getElementById('ltName').value = fullName;
        
        // เพศ
        if (m.gender) {
            const g = m.gender.toString().trim().toLowerCase();
            document.getElementById('ltSex').value = (g === 'หญิง' || g === 'female' || g === 'f') ? 'female' : 'male';
        }
        
        // วันเกิด (รองรับหลายฟอร์แมต)
        const bdate = m.birthdate || m.birthDate || m.date;
        if (bdate) {
            if (bdate.includes('-')) {
                // ISO format YYYY-MM-DD
                let y = parseInt(bdate.split('-')[0]);
                if (y > 2400) {
                    y -= 543;
                    document.getElementById('ltDobDate').value = `${y}-${bdate.split('-')[1]}-${bdate.split('-')[2]}`;
                } else {
                    document.getElementById('ltDobDate').value = bdate;
                }
            } else {
                // DD/MM/YYYY
                let parts = bdate.split('/');
                if (parts.length === 3) {
                    let y = parseInt(parts[2]);
                    if (y > 2400) y -= 543;
                    document.getElementById('ltDobDate').value = `${y}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                }
            }
        }
        
        // เวลาเกิด
        const btime = m.birthtime || m.birthTime || m.time;
        if (btime) document.getElementById('ltDobTime').value = btime;
        
        // สถานที่เกิด
        const loc = m.province || m.location || m.birthPlace || m.birthplace;
        if (loc) document.getElementById('ltLocation').value = loc;
    }
}

function generateLifetimeReport() {
    const name = document.getElementById('ltName').value.trim();
    const sex = document.getElementById('ltSex').value;
    const dobDate = document.getElementById('ltDobDate').value;
    const dobTime = document.getElementById('ltDobTime').value;
    const location = document.getElementById('ltLocation').value.trim();

    if (!name || !dobDate) {
        Swal.fire("กรุณากรอกข้อมูล", "กรุณากรอกชื่อและวันเกิดผู้ดูดวง", "warning");
        return;
    }

    const dobObj = new Date(dobDate);
    const birthYear = dobObj.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = (currentYear - birthYear) + 1; // อายุอย่าง

    // Lunar calculation
    let lunarText = "-";
    let lunarObj = null;
    if (typeof getThaiLunar === 'function') {
        lunarObj = getThaiLunar(dobObj);
        if (lunarObj) {
            const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
            const dow = daysTh[dobObj.getDay()];
            lunarText = `วัน${dow} เดือน ${lunarObj.month} ปี${lunarObj.zodiac} (${lunarObj.phase} ${lunarObj.amount} ค่ำ)`;
        }
    }

    const dobThStr = dobObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

    // Constants from Thai Hora
    const RASI_TH = ['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
    const hour = parseInt(dobTime.split(':')[0]) || 12;
    const min = parseInt(dobTime.split(':')[1]) || 0;
    const yearBE = birthYear + 543;
    const yearCE = birthYear;
    const hourDec = hour + min / 60;
    
    // Julian Day and planetary positions
    const jd = toJD(yearCE, dobObj.getMonth() + 1, dobObj.getDate(), hourDec - 7);
    const pl = siderealPlanets(jd);
    const lagnaLon_ = lagnaLon(jd, 13.75); // Bangkok
    const lagnaIdx = degToSign(lagnaLon_);
    const lagnaSignText = `ราศี${RASI_TH[lagnaIdx]}`;
    const dayOfWeek = dobObj.getDay();

    const lords = {0:'พระอังคาร',1:'พระศุกร์',2:'พระพุทธ',3:'พระจันทร์',4:'พระอาทิตย์',5:'พระพุทธ',6:'พระศุกร์',7:'พระอังคาร',8:'พระพฤหัส',9:'พระเสาร์',10:'พระเสาร์',11:'พระพฤหัส'};
    const lordStar = lords[lagnaIdx];
    const DAY_RULERS_LIST = ['พระอาทิตย์','พระจันทร์','พระอังคาร','พระพุทธ','พระพฤหัส','พระศุกร์','พระเสาร์'];
    const dayRuler = DAY_RULERS_LIST[dayOfWeek];

    const plKeys = {
        sun: 'พระอาทิตย์ (๑)', moon: 'พระจันทร์ (๒)', mars: 'พระอังคาร (๓)',
        mer: 'พระพุธ (๔)', jup: 'พระพฤหัสบดี (๕)', ven: 'พระศุกร์ (๖)',
        sat: 'พระเสาร์ (๗)', rahu: 'พระราหู (๘)', ketu: 'พระเกตุ (๙)'
    };

    // Calculate planets in signs
    const planetsInSigns = [];
    for (let key in plKeys) {
        if (pl[key]) {
            planetsInSigns.push(`<strong>${plKeys[key]}:</strong> ราศี${RASI_TH[degToSign(pl[key].lon)]}`);
        }
    }

    // Calculate spouse / soulmate direction
    const dayVal = dobObj.getDay() + 1; // 1-7
    const zodiacs = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
    let yearVal = 1;
    if (lunarObj) {
        yearVal = zodiacs.indexOf(lunarObj.zodiac) + 1;
        if (yearVal <= 0) yearVal = 1;
    }
    const sum = dayVal + yearVal;
    const remainder = sum % 7;
    let spousePrediction = "";
    switch (remainder) {
        case 1:
            spousePrediction = "ทิศพายัพ (ตะวันตกเฉียงเหนือ) หรืออาคเนย์ (ตะวันออกเฉียงใต้) เป็นผู้มีตระกูลดี รูปร่างสันทัด ผิวค่อนข้างขาวเกือบขาว นิสัยใจคออ่อนโยน เรียบร้อยดีนัก";
            break;
        case 2:
            spousePrediction = "ทิศประจิม (ตะวันตก) หรือทิศบูรพา (ตะวันออก) ตระกูลเดิมเท่าเทียมเสมอกัน เป็นคนสุภาพเรียบร้อย ซื่อสัตย์สุจริต ผิวค่อนข้างขาว อาจเป็นหม้ายหรือแก่กว่าหลายปี";
            break;
        case 3:
            spousePrediction = "ทิศอิสาณ (ตะวันออกเฉียงเหนือ) หรือทิศหรดี (ตะวันตกเฉียงใต้) ตระกูลสามัญ รูปร่างค่อนข้างสูงใหญ่ ผิวดำสักหน่อย หรือเป็นหม้าย มีความสามารถพอเลี้ยงตัวได้ดี";
            break;
        case 4:
            spousePrediction = "ทิศอุดร (เหนือ) หรือทิศทักษิณ (ใต้) รูปร่างใหญ่ นิสัยใจกว้างขวาง รักเพื่อนพ้อง ชอบสังคม รักเกียรติยศ เมื่ออายุมากแล้วดวงการคู่ครองจะส่งเสริมดีมาก";
            break;
        case 5:
            spousePrediction = "ทิศทักษิณ (ใต้) หรือหรดี (ตะวันตกเฉียงใต้) ผิวเนื้อค่อนข้างดำ มักเป็นคนต่างถิ่นต่างเมือง หรือเป็นคนกำพร้า หากได้คู่ผิวขาวมากจะเกื้อหนุนเสริมดวงชะตาดียิ่ง";
            break;
        case 6:
            spousePrediction = "ทิศหรดี (ตะวันตกเฉียงใต้) หรือทิศอุดร (เหนือ) ผิวเนื้อสองสี (ดำแดง) นิสัยใจเร็วด่วนได้ โกรธง่ายหายเร็ว แต่มีความรักที่มั่นคงจริงจัง";
            break;
        case 0:
            spousePrediction = "ทิศอาคเนย์ (ตะวันออกเฉียงใต้) หรือตะวันตกตรงกัน ผิวเนื้อสองสี (ดำแดง) โกรธง่ายเชื่อคนง่าย แต่มีความคิดอ่านเฉลียวฉลาด แก้ปัญหาเก่งรอบตัว";
            break;
    }

    // Build the Pages
    let htmlContent = '';

    // ================= PAGE 1: COVER PAGE =================
    htmlContent += `
        <div class="pdf-page cover-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-image: url('../assets/taksasattalek_cover.png') !important; background-size: cover !important; background-position: center !important; text-align: center; display: block; position: relative; padding: 0; border: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(12, 8, 28, 0.45) !important; z-index: 1; pointer-events: none;"></div>
            <div style="position: absolute; top: 15mm; bottom: 15mm; left: 15mm; right: 15mm; border: 2px solid rgba(212, 175, 55, 0.4); pointer-events: none; z-index: 2;"></div>
            <div style="position: absolute; top: 17mm; bottom: 17mm; left: 17mm; right: 17mm; border: 1px solid rgba(212, 175, 55, 0.2); pointer-events: none; z-index: 2;"></div>

            <div style="position: absolute; top: 110px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center; z-index: 10; padding: 25px 30px; box-sizing: border-box; background: rgba(15, 10, 30, 0.8) !important; border: 1.5px solid rgba(212, 175, 55, 0.45) !important; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.85);">
                <div style="font-size: 15px; color: #D4AF37 !important; letter-spacing: 5px; font-weight: 600; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-bottom: 5px;">
                    Siam Horamongkol Private Report
                </div>
                <div style="color: #FFFFFF !important; font-size: 34px; font-weight: 700; text-shadow: 0 4px 10px rgba(0,0,0,0.95); font-family: 'Sarabun', sans-serif;">
                    รายงานวิเคราะห์ดวงชะตาชีวิตลิขิตฟ้า
                </div>
                <div style="color: #FFDF73 !important; font-size: 26px; font-weight: 500; margin-top: 5px; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
                    ภาพรวมดวงชะตาชั่วชีวิต (Lifetime Report)
                </div>
                <div style="width: 120px; height: 1.5px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 15px auto 0 auto;"></div>
            </div>

            <div style="position: absolute; top: 380px; left: 50%; transform: translateX(-50%); width: 180px; height: 180px; border-radius: 50%; border: 2px dashed rgba(212, 175, 55, 0.35); display: flex; align-items: center; justify-content: center; z-index: 5;">
                <div style="width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%); display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 72px; filter: drop-shadow(0 0 15px rgba(212,175,55,0.6));">🌌</span>
                </div>
            </div>

            <div style="position: absolute; top: 560px; left: 50%; transform: translateX(-50%); width: 80%; z-index: 10; background: linear-gradient(135deg, rgba(20, 10, 45, 0.85), rgba(10, 5, 25, 0.9)) !important; padding: 18px 25px; border-radius: 12px; border: 1.5px solid rgba(212, 175, 55, 0.45) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.9); text-align: center;">
                <div style="color: #D4AF37 !important; font-size: 15px; letter-spacing: 2px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase;">
                    เจ้าชะตาผู้ครอบครองคำทำนาย
                </div>
                <div style="color: #FFFFFF !important; font-size: 36px; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.9); font-family: 'Sarabun', sans-serif;">
                    คุณ${name}
                </div>
            </div>

            <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 80%; background: rgba(10, 5, 20, 0.85) !important; border: 1px solid rgba(212, 175, 55, 0.2) !important; padding: 22px 25px; border-radius: 12px; text-align: left; box-shadow: 0 8px 25px rgba(0,0,0,0.95); z-index: 10;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 16.5px; color: #FFFFFF !important; line-height: 1.6;">
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;"><strong style="color:#D4AF37 !important; margin-right: 8px; font-weight: 600;">วันสุริยคติ:</strong> <span style="color: #FFFFFF !important;">วันที่ ${dobThStr}</span></div>
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;"><strong style="color:#D4AF37 !important; margin-right: 8px; font-weight: 600;">วันจันทรคติไทย:</strong> <span style="color: #FFFFFF !important;">${lunarText}</span></div>
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;"><strong style="color:#D4AF37 !important; margin-right: 8px; font-weight: 600;">เวลาตกฟาก:</strong> <span style="color: #FFFFFF !important;">${dobTime || 'ไม่ระบุ'} น.</span></div>
                    <div style="padding-bottom: 1px;"><strong style="color:#D4AF37 !important; margin-right: 8px; font-weight: 600;">ถิ่นกำเนิด:</strong> <span style="color: #FFFFFF !important;">จังหวัด${location || 'ไม่ระบุ'}</span></div>
                </div>
            </div>

            <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 90%; text-align: center; z-index: 10;">
                <div style="font-size: 13px; color: #A0A0A0 !important; letter-spacing: 1px;">
                    เอกสารวิเคราะห์ดวงชะตาชั่วชีวิต โดย สยามโหรามงคล
                </div>
            </div>
        </div>
    `;

    // ================= PAGE 2: INTRODUCTION & INDEX =================
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:26px; margin-top: 0; margin-bottom:20px;">บทนำและโครงสร้างรายงานชะตาชีวิต</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                
                <p style="text-indent: 30px; font-size:16.5px; line-height: 1.9; text-align: justify; margin-bottom: 20px;">
                    ยินดีต้อนรับสู่คู่มือพยากรณ์ดวงชะตาชีวิตฉบับส่วนบุคคลของท่าน ซึ่งจัดทำขึ้นเพื่อการวิเคราะห์และถอดรหัสเส้นทางชีวิตอย่างครบถ้วนสมบูรณ์ รายงานเล่มนี้ไม่ใช่เพียงแค่การพยากรณ์เหตุการณ์ชั่วคราว แต่เป็นการผสมผสานศาสตร์โบราณหลักสำคัญถึง 4 สาขาวิชา เพื่อสะท้อนตัวตน วาสนาเดิม อุปสรรค และโอกาสความสำเร็จตลอดการเดินทางของชีวิต
                </p>

                <h4 style="color:#b8860b; font-size:18px; margin-bottom: 12px;">โครงสร้างการวิเคราะห์มหาคัมภีร์ดวงชะตาประกอบด้วย:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; font-size:14.5px; line-height: 1.55;">
                    <div><strong>หน้า 1-2:</strong> หน้าปกมงคล & สารบัญนำดวง</div>
                    <div><strong>หน้า 3:</strong> คัมภีร์พรหมชาติตามปี-เดือนเกิด</div>
                    <div><strong>หน้า 4:</strong> อุปนิสัยวันเกิดและพลังปฏิสัมพันธ์ธาตุ</div>
                    <div><strong>หน้า 5:</strong> ลัคนากำเนิดวิถีนิรายะและทางชีวิต</div>
                    <div><strong>หน้า 6:</strong> แผนภูมิราศีจักรพิกัดดาวโคจรเกิด</div>
                    <div><strong>หน้า 7-8:</strong> คำทำนายทวาทศภพ (12 ภพละเอียด)</div>
                    <div><strong>หน้า 9:</strong> คัมภีร์สัตตเลข 7 ตัว 4 ฐาน (ดวงสากล)</div>
                    <div><strong>หน้า 10-14:</strong> เจาะลึกความหมาย 21 ภพสัตตเลข</div>
                    <div><strong>หน้า 15:</strong> มหาทักษาพยากรณ์กำเนิดตลอดชีพ</div>
                    <div><strong>หน้า 16:</strong> ฤกษ์มงคลกำเนิดและดวงดาวโคจรจร</div>
                    <div><strong>หน้า 17:</strong> วิถีความรักและเกณฑ์เนื้อคู่ประจำทิศ</div>
                    <div><strong>หน้า 18:</strong> ฮวงจุ้ยทำเลที่อยู่อาศัยเสริมชะตา</div>
                    <div><strong>หน้า 19:</strong> เลขศาสตร์ประยุกต์และคำทำนายชื่อ</div>
                    <div><strong>หน้า 20:</strong> คัมภีร์ยามอุบากอง & ฤกษ์ยาตราวันเกิด</div>
                    <div><strong>หน้า 21:</strong> ตารางสมพงษ์ 12 นักษัตรตลอดชีพ</div>
                    <div><strong>หน้า 22:</strong> พระคาถาบูชาดวงเกิด & ต่อชะตาชีวิต</div>
                    <div><strong>หน้า 23:</strong> สรุปภาพรวมและปกหลังมงคล</div>
                </div>
            </div>
            
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 2 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 3: PHROMMACHAT YEAR & MONTH =================
    let promchartHtml = "";
    const zodiacKeys = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
    let zodIdx = 0;
    if (lunarObj && lunarObj.zodiac) {
        const zodiacNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
        zodIdx = zodiacNames.indexOf(lunarObj.zodiac);
        if (zodIdx === -1) zodIdx = (birthYear - 4) % 12;
    } else {
        zodIdx = (birthYear - 4) % 12;
    }
    if (zodIdx < 0) zodIdx += 12;
    const zodKey = zodiacKeys[zodIdx];
    
    let zodInfo = null;
    if (typeof ZODIAC_ANIMALS !== 'undefined' && ZODIAC_ANIMALS[zodKey]) {
        zodInfo = ZODIAC_ANIMALS[zodKey];
    } else {
        zodInfo = {
            name: `ปี${zodiacs[zodIdx]}`,
            emoji: "",
            element: `ธาตุประจำปี`,
            guardian: "ต้นไม้ประจำดวงเกิด",
            friendly: "คู่มิตรตามตำรา",
            conflict: "ปีชงประคองตน",
            description: "ข้อมูลชะตานักษัตรตามตำราพรหมชาติหลวง"
        };
    }

    const birthMonth = dobObj.getMonth() + 1; // 1-12
    const monthNamesTh = ["เดือน ๕ (เมษายน)", "เดือน ๖ (พฤษภาคม)", "เดือน ๗ (มิถุนายน)", "เดือน ๘ (กรกฎาคม)", "เดือน ๙ (สิงหาคม)", "เดือน ๑๐ (กันยายน)", "เดือน ๑๑ (ตุลาคม)", "เดือน ๑๒ (พฤศจิกายน)", "เดือน ๑ (ธันวาคม)", "เดือน ๒ (มกราคม)", "เดือน ๓ (กุมภาพันธ์)", "เดือน ๔ (มีนาคม)"];
    
    // Traditional Thai Phrommachat Lunar month index mapping (April is Month 5 in Thai Calendar)
    let thaiMonthIdx = (birthMonth + 7) % 12; // Approximation mapping (April = index 0)
    const monthDescs = {
        5: "ตกพยาธิหรือมีเสน่ห์ทางวาจา โกรธง่ายหายเร็ว มักได้ดีจากความเพียรของตนเอง มีผู้ให้เกื้อหนุนพอเลี้ยงตัวได้ดี",
        6: "ตกเรือนหลวง มักมียศศักดิ์ ได้รับความเมตตาจากผู้ใหญ่ มีเกียรติยศและการเงินที่มั่นคงเด่นชัดชั่วชีวิต",
        7: "ตกเหน็ดเหนื่อย ทำคุณคนไม่ขึ้น แต่ในบั้นปลายชีวิตจะสบายด้วยน้ำพักน้ำแรงและการเก็บหอมรอมริบของตน",
        8: "ตกมีสติปัญญาดี เอาตัวรอดได้ในยามคับขัน มีไหวพริบปฏิภาณเลิศเลอในทางธรรมและการประกอบอาชีพ",
        9: "ตกที่ราบรื่น ค้าขายดี มีโชคลาภเดินทางปลอดภัย มิตรสหายคอยช่วยเหลือเกื้อกูลอย่างดียิ่ง",
        10: "ตกเกณฑ์โยกย้าย พลัดพรากจากบ้านเกิดไปรุ่งเรืองที่อื่น ได้คู่ครองดีพึ่งพาได้ สร้างชีวิตร่ำรวยมั่นคง",
        11: "ตกวาจาเป็นเลิศ เจรจาค้าขายดี ปัญญาเฉียบแหลม มักได้รับการอุปถัมภ์ค้ำชูจากมิตรสหายและผู้ใหญ่",
        12: "ตกการเดินทางไกล มีความก้าวหน้าจากการคบค้าสมาคมกับคนต่างถิ่นต่างเมือง ปัญญาดีเอาตัวรอดเก่ง",
        1: "ตกเกณฑ์วาสนาดี มีเกียรติยศชื่อเสียง ชีวิตราบรื่น มีคนเกรงอกเกรงใจ เหมาะแก่การเป็นเจ้าคนนายคน",
        2: "ตกเกณฑ์ปานกลาง ต้องต่อสู้ฝ่าฟันด้วยตนเองจึงจะประสบความสำเร็จอย่างยั่งยืนและมีชีวิตที่ร่มเย็น",
        3: "ตกความขยันหมั่นเพียร มีมิตรสหายบริวารมาก ชีวิตมีสิ่งท้าทายให้ฟันฝ่าเสมอในเรื่องยศทรัพย์",
        4: "ตกเกณฑ์การเรียนรู้ ปัญญาดี ชะตาชีวิตในบั้นปลายร่มเย็นมีสุขปราศจากโรคภัยไข้เจ็บเด่นชัด"
    };
    
    const thaiMonthNum = (thaiMonthIdx + 5) <= 12 ? (thaiMonthIdx + 5) : (thaiMonthIdx - 7);
    const selectedMonthDesc = monthDescs[thaiMonthNum] || "ชะตาชีวิตปานกลาง มีวาสนาตามการสร้างบุญของตน";

    promchartHtml = `
        <div style="font-size:16.5px; line-height:1.9;">
            <p><strong>โฉลกกำเนิดนักษัตรเกิด:</strong> ท่านเกิดใน <strong>"${zodInfo.name}"</strong> ${zodInfo.emoji}</p>
            <div style="background:#fdfaf2; border:1px solid #d4af37; border-radius:8px; padding:15px; margin-bottom:15px;">
                <p style="margin:0;"><strong>ธาตุกำเนิดพรหมชาติ:</strong> ${zodInfo.element} • <strong>มิ่งขวัญสถิต:</strong> ${zodInfo.guardian}</p>
                <p style="margin:5px 0 0 0;"><strong>นักษัตรคู่มิตร:</strong> ${zodInfo.friendly} • <strong style="color:#d9534f;">นักษัตรชง/อริ:</strong> ${zodInfo.conflict}</p>
            </div>
            
            <p style="text-align:justify;">${zodInfo.description}</p>
            
            <h4 style="color:#b8860b; font-size:18px; margin-top:20px; margin-bottom: 8px;">ชะตาชีวิตตกเกณฑ์เดือนเกิดทางจันทรคติไทย:</h4>
            <p style="margin-bottom: 12px;"><strong>เดือนเกิดของท่าน:</strong> ${monthNamesTh[thaiMonthIdx]} (ตกเดือนไทยคัมภีร์พรหมชาติ)</p>
            <div style="background:#fdfaf2; border-left:4px solid #b8860b; padding:15px; font-style:italic;">
                "${selectedMonthDesc}"
            </div>
        </div>
    `;

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 1: คัมภีร์พรหมชาติตามชะตาเกิด</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${promchartHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 3 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 4: BIRTHDAY TRAITS & ELEMENTS =================
    let characterHtml = "";
    if (typeof PLANETS_DATA !== 'undefined' && PLANETS_DATA[dayOfWeek + 1]) {
        const charData = PLANETS_DATA[dayOfWeek + 1];
        let elementText = "ไม่ทราบ";
        let elementDesc = "";
        if (typeof getBirthElement === 'function') {
            const dE = getBirthElement(dayOfWeek);
            elementText = dE.name + " " + (dE.level || '');
            elementDesc = dE.desc;
        }

        let dbDataText = "";
        if (typeof dayBirthData !== 'undefined' && dayBirthData[dayOfWeek + 1]) {
            const dbD = dayBirthData[dayOfWeek + 1];
            
            let detailMind = "-";
            let detailEmployment = "-";
            let detailElement = "-";
            if (typeof detailDayBirthData !== 'undefined' && detailDayBirthData[dayOfWeek + 1]) {
                const det = detailDayBirthData[dayOfWeek + 1];
                detailMind = det.mind || "-";
                detailEmployment = det.employment || "-";
                detailElement = det.element || "-";
            }
            
            let thaksaPropText = "";
            if (typeof THAKSA_PROPHESY !== 'undefined' && THAKSA_PROPHESY[dayOfWeek + 1]) {
                const tp = THAKSA_PROPHESY[dayOfWeek + 1];
                thaksaPropText = `
                    <p style="margin-top:5px; margin-bottom:3px;"><strong>🎯 ทักษาพยากรณ์ประจำวันเกิด (โชคลางโบราณ):</strong></p>
                    <div style="font-size:13px; background:#fbf8f0; padding:8px 12px; border:1px solid rgba(212,175,55,0.25); border-radius:6px; line-height:1.5; display:grid; grid-template-columns: 1fr 1fr; gap:4px; margin-bottom:10px;">
                        <div><strong>บริวาร:</strong> ${tp.บริวาร}</div>
                        <div><strong>อายุ:</strong> ${tp.อายุ}</div>
                        <div><strong>เดช:</strong> ${tp.เดช}</div>
                        <div><strong>ศรี:</strong> ${tp.ศรี}</div>
                        <div><strong>มูละ:</strong> ${tp.มูลละ}</div>
                        <div><strong>อุตสาหะ:</strong> ${tp.อุตสาหะ}</div>
                        <div><strong>มนตรี:</strong> ${tp.มนตรี}</div>
                        <div style="color:#d9534f;"><strong>กาลกิณี:</strong> ${tp.กาลกิณี}</div>
                    </div>
                `;
            }

            dbDataText = `
                <p style="margin-top:10px; margin-bottom:5px;"><strong>ฉายานามโบราณ:</strong> ${dbD.name} (${dbD.meta}) • <strong>ธาตุมงคลวันเกิด:</strong> ${detailElement}</p>
                <p style="text-align:justify; margin-bottom:5px;"><strong>🧠 ลักษณะนิสัยและพื้นดวงความคิด:</strong> ${detailMind}</p>
                <p style="text-align:justify; margin-bottom:5px;"><strong>💼 อาชีพและหน้าที่การงานที่เหมาะสม:</strong> ${detailEmployment}</p>
                
                ${thaksaPropText}
                
                <p style="margin-bottom:3px;"><strong>🧭 ทิศทางและสิ่งปลูกสร้างมงคลหนุนดวงชะตา:</strong></p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:13px; background:#fafafa; padding:8px; border:1px dashed #d4af37; border-radius:6px; margin-bottom:10px;">
                    <div><strong>ทิศใต้:</strong> ${dbD.directions.south || dbD.directions.southwest || 'ทิศสมดุล'}</div>
                    <div><strong>ทิศเหนือ:</strong> ${dbD.directions.north || dbD.directions.northeast || 'ทิศสมดุล'}</div>
                    <div><strong>ทิศตะวันออก:</strong> ${dbD.directions.east || dbD.directions.southeast || 'ทิศสมดุล'}</div>
                    <div><strong>ทิศตะวันตก:</strong> ${dbD.directions.west || 'ทิศสมดุล'}</div>
                </div>
            `;
        }

        characterHtml = `
            <div style="font-size:16.5px; line-height:1.9;">
                <p style="margin-bottom:8px;"><strong>ธาตุกำเนิดขัดเกลาชีวิต:</strong> ท่านเกิดในวันทางสุริยคติที่เป็น <strong>"${charData.dayName}"</strong> มีดาวประจำตัวนำพาชะตาคือดาวเคราะห์ดวงที่ ${charData.number}</p>
                <div style="background:#fdfaf2; border:1px solid #d4af37; border-radius:8px; padding:12px; margin-bottom:8px;">
                    <p style="margin:0; font-weight:bold; color:#b8860b;">ธาตุเคราะห์ประจำวันเกิด: ${elementText}</p>
                    <p style="margin:4px 0 0 0;">ลักษณะเด่นทางเคมีธาตุ: ${elementDesc}</p>
                </div>
                ${dbDataText}
                <p style="margin-top:5px; margin-bottom:2px;"><strong>💪 พลังด้านบวก (จุดแข็งหลัก):</strong> ${charData.strength}</p>
                <p style="margin-top:2px; margin-bottom:0;"><strong>⚠️ จุดบกพร่องทางพฤติกรรม (ควรระวัง):</strong> ${charData.weakness}</p>
            </div>
        `;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 2: อุปนิสัยวันเกิดและเคมีพลังธาตุ</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${characterHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 4 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 5: LAGNA & PATH OF LIFE (RICH FROM ZODIAC_DATA) =================
    let lagnaDetailHtml = "";
    let houseTablePageHtml = "";
    if (typeof ZODIAC_DATA !== 'undefined' && ZODIAC_DATA[lagnaIdx]) {
        const zData = ZODIAC_DATA[lagnaIdx];
        
        lagnaDetailHtml = `
            <div style="font-size:16.5px; line-height: 1.85;">
                <p style="font-size:18px; margin-bottom:10px;"><strong>ลัคนาของท่านสถิตเด่นที่:</strong> ลัคนาราศี${zData.name} ${zData.icon} <span style="color:#b8860b; font-weight:bold;">(${zData.element})</span></p>
                <p style="text-align:justify; margin-bottom: 12px; font-size:14.5px;"><strong>คำอธิบายภาพรวมชะตาเกิด (ดวงนิรายะ):</strong> ${typeof ayanamsaPredictions !== 'undefined' && ayanamsaPredictions.lagna && ayanamsaPredictions.lagna[lagnaIdx] ? ayanamsaPredictions.lagna[lagnaIdx].text : zData.desc}</p>
                
                <div style="background:#fdfaf2; border:1px solid #d4af37; border-radius:8px; padding:10px 15px; margin-bottom:12px; font-size:14.5px;">
                    <p style="margin:0;"><strong>🪐 ดาวเกษตรตนุลัคน์:</strong> ${zData.ruler} • <strong>🎨 สีที่เป็นมงคล:</strong> ${zData.luckyColor}</p>
                    <p style="margin:4px 0 0 0;"><strong>🤝 ราศีคู่มิตรสมาคม:</strong> ${zData.compatible.join(', ')}</p>
                </div>
                
                <p style="margin-bottom:6px;"><strong>💼 อาชีพที่เหมาะสมที่สุด:</strong> ${zData.career}</p>
                <p style="margin-bottom:6px;"><strong>💕 ความรักคู่ครองตลอดชั่วชีวิต:</strong> ${zData.love}</p>
                <p style="margin-bottom:12px;"><strong>🏥 เกณฑ์สุขภาพและข้อพึงระวัง:</strong> ${zData.health}</p>
                
                <h4 style="color:#b8860b; font-size:16px; margin-top:12px; margin-bottom:4px; font-weight:bold;">จุดเด่นและจุดแก้ไขวิถีจิตวิญญาณ:</h4>
                <p style="margin:2px 0; font-size:14.5px;"><strong>💪 จุดเด่นพึงส่งเสริม:</strong> ${zData.strengths.join(', ')}</p>
                <p style="margin:2px 0; font-size:14.5px;"><strong>⚠️ จุดด้อยพึงระวังระงับสติ:</strong> ${zData.weaknesses.join(', ')}</p>
            </div>
        `;

        // Generate larger 12 Bhavas table
        let houseTableHtml = "";
        const houseNames = [
            "ตนุ (ตัวตน)", "กดุมพะ (การเงิน)", "สหัชชะ (สังคม)", "พันธุ (ครอบครัว)",
            "ปุตตะ (บริวาร)", "อริ (อุปสรรค)", "ปัตนิ (คู่ครอง)", "มรณะ (ความสูญเสีย)",
            "ศุภะ (ความสำเร็จ)", "กัมมะ (การงาน)", "ลาภะ (โชคลาภ)", "วินาศ (ความลับ)"
        ];
        houseTableHtml += `<table style="width:100%; border-collapse:collapse; font-size:13.5px; margin-top:15px; border:2px solid #d4af37; color:#111; line-height:1.75;">`;
        houseTableHtml += `<thead style="background:#fdfaf2; color:#b8860b; font-weight:bold; font-size:14px;"><tr><td style="padding:6px; border:1.5px solid #d4af37;">ภพเรือนชะตา</td><td style="padding:6px; border:1.5px solid #d4af37;">ราศีสถิต</td><td style="padding:6px; border:1.5px solid #d4af37;">จุดเด่นประจักษ์</td><td style="padding:6px; border:1.5px solid #d4af37;">ข้อควรระวัง</td></tr></thead><tbody>`;
        for (let i = 0; i < 12; i++) {
            const idx = (lagnaIdx + i) % 12;
            const z = ZODIAC_DATA[idx];
            houseTableHtml += `<tr>
                <td style="padding:5px 6px; border:1px solid #ddd; font-weight:bold; color:#b8860b; white-space:nowrap;">${i+1}. ${houseNames[i]}</td>
                <td style="padding:5px 6px; border:1px solid #ddd; white-space:nowrap;">${z.icon} ราศี${z.name}</td>
                <td style="padding:5px 6px; border:1px solid #ddd; color:#2e7d32; font-weight:550;">${z.strengths.slice(0, 2).join(', ')}</td>
                <td style="padding:5px 6px; border:1px solid #ddd; color:#c62828;">${z.weaknesses.slice(0, 2).join(', ')}</td>
            </tr>`;
        }
        houseTableHtml += `</tbody></table>`;

        houseTablePageHtml = `
            <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 3.5: วิเคราะห์พื้นฐานดวงชะตา 12 ภพเรือน</h2>
                    <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                    <p style="font-size:15px; line-height:1.7; text-align:justify; margin-bottom:10px;">
                        โครงสร้างภพเรือนชะตา (Bhavas) ทั้ง 12 ภพที่โคจรสัมพันธ์กับลัคนาเกิดของท่าน ช่วยระบุคุณสมบัติเด่นและจุดบกพร่องที่ต้องควบคุมระมัดระวังในแต่ละมิติของการใช้ชีวิตอย่างมีหลักสถิติมั่นคง:
                    </p>
                    ${houseTableHtml}
                </div>
                <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                    หน้า 5.5 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;
    } else {
        lagnaDetailHtml = `
            <div style="font-size:16.5px; line-height: 1.9;">
                <p style="font-size:18px;">ลัคนาของท่านสถิตเด่นที่: <strong>${lagnaSignText}</strong></p>
                <p style="text-align:justify;">
                    ลัคนาคือจุดเริ่มต้นของชีวิตบนฟ้าในนาทีที่ท่านลืมตาดูโลก ถือเป็นจุดกำหนดภาพลักษณ์ รูปร่าง และลักษณะความเป็นตัวตนที่ชัดเจนที่สุดในการเดินทางชั่วชีวิตของบุคคล
                </p>
            </div>
        `;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 3: ลัคนากำเนิดวิถีนิรายะและทางชีวิต</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${lagnaDetailHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 5 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    if (houseTablePageHtml) {
        htmlContent += houseTablePageHtml;
    }

    // ================= PAGE 6: CHART WHEEL =================
    const tempCanvasId = `reportChartCanvas_${Date.now()}`;
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 4: แผนภูมิราศีจักรพิกัดดาวโคจรเกิด</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; margin-top: 15px;">
                    <canvas id="${tempCanvasId}" width="320" height="320" style="background:#110e24; border: 3px solid #d4af37; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"></canvas>
                    
                    <div style="text-align: left; width: 100%; font-size:15.5px; line-height: 1.8; margin-top: 10px;">
                        <p style="text-align: center; font-size:17px; font-weight: bold; color: #b8860b;">ตำแหน่งนพเคราะห์จรในสิบสองราศี ณ เวลาเกิด:</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; padding: 0 20px;">
                            ${planetsInSigns.map(item => `<div>${item}</div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 6 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGES 7 & 8: 12 BHAVAS IN DETAIL =================
    let bhavaList = [];
    const bhavaNames = ["ตนุ (ตัวตน)", "กดุมพะ (การเงิน)", "สหัชชะ (สังคม)", "พันธุ (ครอบครัว)", "ปุตตะ (บริวาร)", "อริ (อุปสรรค)", "ปัตตนิ (คู่ครอง)", "มรณะ (ความสูญเสีย)", "สุภะ (ความสำเร็จ)", "กัมมะ (การงาน)", "ลาภะ (ลาภผล)", "พยายะ (ความลับ)"];
    
    const signToRulerKey = { 0: 'mars', 1: 'venus', 2: 'mercury', 3: 'moon', 4: 'sun', 5: 'mercury', 6: 'venus', 7: 'mars', 8: 'jupiter', 9: 'saturn', 10: 'rahu', 11: 'jupiter' };
    const planetMapForPredictions = {
        sun: 'sun', moon: 'moon', mars: 'mars',
        mer: 'mercury', jup: 'jupiter', ven: 'venus',
        sat: 'saturn', rahu: 'rahu'
    };
    const plKeyMapForLord = {
        'sun': 'sun', 'moon': 'moon', 'mars': 'mars',
        'mercury': 'mer', 'jupiter': 'jup', 'venus': 'ven',
        'saturn': 'sat', 'rahu': 'rahu'
    };

    for (let i = 0; i < 12; i++) {
        const signIdx = (lagnaIdx + i) % 12;
        let planetInside = [];
        let predictionsInside = [];
        
        for (let key in pl) {
            const planetSignIdx = degToSign(pl[key].lon);
            const houseIdx = (planetSignIdx - lagnaIdx + 12) % 12;
            if (houseIdx === i) {
                planetInside.push(plKeys[key]);
                const predKey = planetMapForPredictions[key];
                if (predKey && typeof ayanamsaPredictions !== 'undefined' && ayanamsaPredictions.housePredictions && ayanamsaPredictions.housePredictions[predKey]) {
                    predictionsInside.push(ayanamsaPredictions.housePredictions[predKey][i].text);
                }
            }
        }
        
        const signRulerKey = signToRulerKey[signIdx];
        let lordInHouseText = "";
        if (signRulerKey) {
            const plKey = plKeyMapForLord[signRulerKey];
            if (plKey && pl[plKey]) {
                const rulerSignIdx = degToSign(pl[plKey].lon);
                const rulerInHouseIdx = (rulerSignIdx - lagnaIdx + 12) % 12;
                if (typeof ayanamsaPredictions !== 'undefined' && ayanamsaPredictions.lordInHousePredictions && ayanamsaPredictions.lordInHousePredictions[i] && ayanamsaPredictions.lordInHousePredictions[i][rulerInHouseIdx]) {
                    lordInHouseText = `<br><span style="color:#673ab7; font-size:13.5px;">🔗 <strong>ดาวเจ้าเรือน:</strong> ${ayanamsaPredictions.lordInHousePredictions[i][rulerInHouseIdx]}</span>`;
                }
            }
        }
        
        const planetsText = planetInside.length > 0 ? planetInside.join(', ') : "ไม่มีดาวสถิตโดยตรง";
        const predictionsText = predictionsInside.length > 0 
            ? predictionsInside.map(t => `<div style="color:#222; font-size:14px; margin-top:3px; text-align:justify; line-height:1.5;">🌟 ${t}</div>`).join('') 
            : `<div style="color:#666; font-size:14px; margin-top:3px; font-style:italic;">สถิตว่างเปล่า ส่งผลกลาง ๆ ตามดาวเจ้าเรือนสถิตส่องแสง</div>`;
        
        bhavaList.push(`
            <div style="margin-bottom:12px; border-bottom:1px solid #f0f0f0; padding-bottom:8px;">
                <strong style="color:#b8860b;">ภพที่ ${i+1}: ${bhavaNames[i]} สถิตในราศี${RASI_TH[signIdx]}</strong><br>
                <span style="font-size:13.5px; color:#555;">ดาวเจ้าเรือนสถิต: ${planetsText}</span>
                ${predictionsText}
                ${lordInHouseText}
            </div>
        `);
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 5: โหราศาสตร์ไทยประยุกต์ - ทวาทศภพ (ภพ 1 - 6)</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                <div style="font-size:15.5px; line-height:1.7;">
                    ${bhavaList.slice(0, 6).join('')}
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 7 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 5: โหราศาสตร์ไทยประยุกต์ - ทวาทศภพ (ภพ 7 - 12)</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                <div style="font-size:15.5px; line-height:1.7;">
                    ${bhavaList.slice(6, 12).join('')}
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 8 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 9: SEVEN DIGITS TABLE & PLANET-HOUSE COLLISIONS =================
    let sevenDigitsHtml = "";
    let collisionsPageHtml = "";
    let sdGlobalRows = null;
    let collisionsText = "";
    
    const collisionTextbook = {
        // ===== ภพ อัตตา =====
        "อัตตะ-หินะ": "ตัวตนถูกกดทับ มักถ่อมตนมากเกินหรือรู้สึกต่ำต้อยด้อยค่า ต้องสร้างความมั่นใจตนเองเพิ่มขึ้น",
        "อัตตะ-ธนัง": "ชีวิตผูกพันกับการสร้างความมั่งคั่ง ทำงานเพื่อหาทรัพย์เป็นเรื่องหลัก เนื้อตัวสร้างตัวเองได้ดี",
        "อัตตะ-ปิตา": "บิดาหรือผู้ใหญ่มีอิทธิพลสูงต่อการตัดสินใจ มักเดินตามรอยบิดา หรือถูกควบคุมโดยผู้อาวุโส",
        "อัตตะ-มาตา": "ผูกพันและได้รับความรักจากมารดาสูง บุคลิกสะท้อนความเป็นมารดา มักรักบ้านเรือนครอบครัว",
        "อัตตะ-โภคา": "มีทรัพย์สิน ยานพาหนะ หรือสมบัติเป็นแรงกระตุ้นชีวิต ทำสิ่งต่างๆ เพื่อสร้างความสุขสบาย",
        "อัตตะ-มัชฌิมา": "ใจเป็นกลาง มองเห็นทุกด้านของปัญหา บางครั้งลังเลไม่กล้าตัดสินใจ ชอบความยุติธรรม",
        "อัตตะ-ตนุ": "เชื่อมั่นในตนเองสูง พึ่งพาตนเองเป็นหลัก ทำสิ่งใดมักใช้ความคิดตนเป็นใหญ่",
        "อัตตะ-กดุมภะ": "ชีวิตมักผูกพันกับการหาเงินทอง สร้างฐานะ หรือต้องเหน็ดเหนื่อยเพื่อหาทรัพย์",
        "อัตตะ-สหัชชะ": "ชอบสังคม มิตรภาพ เพื่อนฝูงช่วยเหลือเกื้อหนุนดี เดินทางท่องเที่ยวบ่อย",
        "อัตตะ-พันธุ": "รักครอบครัว เป็นเสาหลักให้เครือญาติ มีความรับผิดชอบต่อบ้านช่องสูง",
        "อัตตะ-ปุตตะ": "มีความคิดสร้างสรรค์ รักอิสระ ชอบสิ่งแปลกใหม่ รักบริวารและลูกน้อง",
        "อัตตะ-อริ": "ชีวิตต้องฝ่าฟันอุปสรรคบ่อยครั้ง มีอริคอยขัดขวาง ต้องใช้ความพยายามสูงกว่าปกติ",
        "อัตตะ-ปัตนิ": "รักคู่ครองมาก คู่ครองมีบทบาทสูงในการตัดสินใจในชีวิต",
        "อัตตะ-มรณะ": "มักต้องพลัดพรากจากถิ่นฐานบ้านเกิด เดินทางไกล ทำมาหากินต่างแดนแล้วรุ่งเรือง",
        "อัตตะ-ศุภะ": "มีผู้ใหญ่คอยอุปถัมภ์ค้ำชู สนใจในศาสนา/ความเชื่อ จิตใจใฝ่ดี",
        "อัตตะ-กัมมะ": "ทุ่มเทกับการงานอาชีพอย่างเต็มที่ เอาตัวเองฝังอยู่กับงาน ทำงานเป็นหัวใจของชีวิต",
        "อัตตะ-ลาภะ": "มีโชคลาภที่มาจากน้ำพักน้ำแรงตนเอง ขยันขันแข็งก็ประสบความสำเร็จ",
        "อัตตะ-พยายะ": "ชอบทำงานเบื้องหลัง ปิดทองหลังพระ มีความลับซ่อนอยู่ หรือมีความคิดแฝงเร้น",
        "อัตตะ-ทาสี": "ต้องเหน็ดเหนื่อยดูแลช่วยเหลือญาติพี่น้องหรือบริวารผู้หญิง",
        "อัตตะ-ทาสา": "ต้องแบกรับภาระช่วยเหลือดูแลบริวารผู้ชายหรือสังคมภายนอก",

        // ===== ภพ หินะ =====
        "หินะ-ธนัง": "เก็บเงินยาก หรือทรัพย์สินที่หามาได้ถูกปิดบังหรือหมดไปอย่างไม่ทราบสาเหตุ",
        "หินะ-ปิตา": "บิดาหรือผู้ใหญ่มักสร้างความเครียดหรือเป็นภาระในชีวิต ไม่ค่อยได้รับการสนับสนุน",
        "หินะ-มาตา": "ความสัมพันธ์กับมารดาหรือผู้ใหญ่หญิงมีความซับซ้อน ต้องดูแลมารดาที่เจ็บป่วยหรือลำบาก",
        "หินะ-โภคา": "สมบัติพัสถานมักเสียหายหรือถูกฉ้อโกง ระวังการซื้อขายยานพาหนะหรืออสังหาริมทรัพย์",
        "หินะ-มัชฌิมา": "รู้สึกตัวเองไม่ดีพอหรือสูญเสียความสมดุลในชีวิต ต้องหมั่นฝึกสติเพื่อความสงบ",
        "หินะ-ตนุ": "มักตัดสินใจผิดพลาดหรือนำความลำบากมาสู่ตนเองโดยรู้เท่าไม่ถึงการณ์",
        "หินะ-กดุมภะ": "เก็บเงินยาก การเงินมีรอยรั่ว ทรัพย์สินเสียหายบ่อย ต้องระวังการใช้จ่าย",
        "หินะ-สหัชชะ": "เพื่อนฝูงมักนำความเดือดร้อนมาให้ หรือพึ่งพาเพื่อนไม่ได้",
        "หินะ-พันธุ": "คนในบ้านมักทะเลาะขัดแย้ง พึ่งพาเครือญาติไม่ได้ หรือบ้านที่ดินมีปัญหาบ่อย",
        "หินะ-ปุตตะ": "บุตรบริวารดื้อรั้นนำเรื่องเดือดร้อนมาให้ หรือเลี้ยงบริวารยาก",
        "หินะ-อริ": "(ภพเสียชนภพเสีย) อุปสรรคแพ้ภัยตนเอง เรื่องร้ายกลับกลายเป็นดี ศัตรูทำร้ายไม่ได้",
        "หินะ-ปัตนิ": "คู่ครองมักสร้างปัญหาเดือดร้อน หรือมีความขัดแย้งกับคนรักบ่อย",
        "หินะ-มรณะ": "(ภพเสียชนภพเสีย) ปัญหาใหญ่คลี่คลาย ปลดเปลื้องทุกข์โศกโรคภัยได้อย่างไม่คาดฝัน",
        "หินะ-ศุภะ": "ผู้ใหญ่ไม่ค่อยสนับสนุน ทำดีคนมองไม่เห็น ปิดทองหลังพระ",
        "หินะ-กัมมะ": "หน้าที่การงานมักมีอุปสรรค มีคนคอยเลื่อยขาเตียง ทำงานผิดพลาดบ่อย",
        "หินะ-ลาภะ": "ได้โชคลาภแบบทุกขลาภ คือต้องเหน็ดเหนื่อยหรือสูญเสียบางอย่างก่อนจึงจะได้ลาภ",
        "หินะ-พยายะ": "(ภพเสียชนภพเสีย) แคล้วคลาดปลอดภัยจากภัยมืดและผู้ไม่หวังดีแฝงเร้น",
        "หินะ-ทาสี": "บริวารหญิงมักสร้างปัญหา เบียดเบียน หรือนำความเดือดร้อนมาให้",
        "หินะ-ทาสา": "บริวารชายมักสร้างปัญหา ทรยศหักหลัง หรือพึ่งพาไม่ได้",

        // ===== ภพ ธนัง =====
        "ธนัง-ปิตา": "ได้รับมรดกหรือสนับสนุนทางการเงินจากบิดา/ผู้อาวุโส ทรัพย์สินผ่านสายตระกูลพ่อ",
        "ธนัง-มาตา": "ได้รับทรัพย์สินหรือความสุขสบายจากมารดา ครอบครัวฝ่ายแม่มีฐานะดีหนุนช่วย",
        "ธนัง-โภคา": "มีทรัพย์สินมาก มีรถ มีบ้าน มีของสะสมมีค่า ชีวิตมีความสุขสมบูรณ์ด้านวัตถุ",
        "ธนัง-มัชฌิมา": "รักษาสมดุลทางการเงินดี ใช้จ่ายพอประมาณ ไม่ฟุ่มเฟือยสุดโต่ง",
        "ธนัง-ตนุ": "สร้างเนื้อสร้างตัวด้วยหยาดเหงื่อน้ำพักน้ำแรงตนเอง ไม่มีใครช่วยก็รวยได้",
        "ธนัง-กดุมภะ": "หาเงินคล่องตัว ช่องทางทำมาหากินดี มีหัวการค้า โชคดีเรื่องทรัพย์สิน",
        "ธนัง-สหัชชะ": "ได้เงินทองจากสังคม การเจรจานายหน้า หรือเพื่อนฝูงแนะนำโอกาสการเงิน",
        "ธนัง-พันธุ": "ได้ทรัพย์สินจากครอบครัว มรดก หรือมีรายได้จากอสังหาริมทรัพย์/รถยนต์",
        "ธนัง-ปุตตะ": "ได้เงินจากการลงทุน โปรเจกต์ใหม่ๆ หรือบริวารนำผลประโยชน์มาให้",
        "ธนัง-อริ": "หาเงินมาได้มักมีเหตุให้ต้องจ่ายออก หรือมีปัญหาขัดแย้งเรื่องเงินทอง",
        "ธนัง-ปัตนิ": "ได้ทรัพย์สินจากคู่ครอง หรือคู่ครองช่วยดูแลจัดการทรัพย์สมบัติ",
        "ธนัง-มรณะ": "หาเงินเก่งแต่เก็บยาก หรือได้เงินจากการสูญเสีย เช่น ประกันภัย มรดก ต่างแดน",
        "ธนัง-ศุภะ": "การเงินรุ่งเรืองมั่นคง ผู้ใหญ่หนุนนำช่วยช่องทางทำเงินที่ดี",
        "ธนัง-กัมมะ": "มีรายได้มั่นคงจากการงานที่ทำ ยิ่งขยันงานยิ่งได้ทรัพย์สินพูนทวี",
        "ธนัง-ลาภะ": "หาเงินคล่องตัวมาก หยิบจับอะไรเป็นเงินเป็นทอง มักมีโชคทางการเงิน",
        "ธนัง-พยายะ": "มีรายได้จากงานลับๆ งานเบื้องหลัง หรือการทำงานต่างประเทศ/ออนไลน์",
        "ธนัง-ทาสี": "ได้บริวารหญิงมาช่วยดูแลทรัพย์สิน หรือนำทรัพย์ไปใช้กับบริวารหญิง",
        "ธนัง-ทาสา": "ใช้ทรัพย์สินเพื่อบริวารผู้ชาย หรือได้ทรัพย์จากบริวารชายที่ซื่อสัตย์",

        // ===== ภพ ปิตา =====
        "ปิตา-มาตา": "บิดามารดาสัมพันธ์กันแน่นแฟ้น หรือต้องดูแลพ่อแม่พร้อมกันในบางช่วงชีวิต",
        "ปิตา-โภคา": "บิดาหรือผู้อาวุโสมีฐานะดี มีทรัพย์สิน บ้านรถ ถ่ายทอดสู่ลูกหลาน",
        "ปิตา-มัชฌิมา": "บิดาเป็นคนมีเหตุมีผล ยึดมั่นในความสายกลาง เป็นแบบอย่างที่ดีในชีวิต",
        "ปิตา-ตนุ": "รูปร่างหน้าตาหรือบุคลิกภาพคล้ายบิดา เดินตามรอยบิดาทั้งอาชีพและวิถีชีวิต",
        "ปิตา-กดุมภะ": "บิดามีทรัพย์สินมากหรือสอนให้รู้จักหาเงิน ได้รับมรดกทางการเงินจากพ่อ",
        "ปิตา-สหัชชะ": "บิดาช่วยสร้างสังคมหรือเชื่อมโยงเครือข่ายให้ เดินทางร่วมกับบิดาบ่อย",
        "ปิตา-พันธุ": "บิดาเป็นหัวหน้าครอบครัวที่เข้มแข็ง บ้านเรือนมั่นคงด้วยน้ำมือบิดา",
        "ปิตา-ปุตตะ": "บิดามีบริวารมาก หรือบิดามีความผูกพันกับบุตรหลาน",
        "ปิตา-อริ": "บิดาต้องเผชิญอุปสรรค โรคภัย หรือต้องสู้กับอุปสรรคในชีวิต",
        "ปิตา-ปัตนิ": "บิดาได้คู่ครองดี หรือบิดาเป็นคนช่วยแนะนำเรื่องความรัก",
        "ปิตา-มรณะ": "พลัดพรากจากบิดาตั้งแต่เยาว์วัย หรือบิดาต้องเดินทางไกลอยู่เสมอ",
        "ปิตา-ศุภะ": "บิดาเป็นคนมีศีลธรรม เคร่งศาสนา และเป็นที่เคารพนับถือของสังคม",
        "ปิตา-กัมมะ": "บิดาส่งต่อความรู้ด้านอาชีพ หรือดวงชะตาทางอาชีพผูกพันกับมรดกจากบิดา",
        "ปิตา-ลาภะ": "ได้รับลาภผลจากบิดา ผู้อาวุโส หรือผู้มีอำนาจคอยส่งเสริม",
        "ปิตา-พยายะ": "บิดามีโรคประจำตัวแฝง หรือผู้ใหญ่ชายแอบช่วยเหลือลับๆ",
        "ปิตา-ทาสี": "บิดาต้องดูแลญาติฝ่ายหญิงหรือบริวารผู้หญิงมาก",
        "ปิตา-ทาสา": "บิดามีบริวารมาก หรือเป็นที่พึ่งพาของผู้คนรอบข้าง",
        "ปิตา-ปุตตะ": "บิดามีบริวารมาก หรือบิดามีความผูกพันกับบุตรหลาน",
        "ปิตา-พยายะ": "บิดามีโรคประจำตัวแฝง หรือผู้ใหญ่ชายแอบช่วยเหลือลับๆ",

        // ===== ภพ มาตา =====
        "มาตา-โภคา": "มารดามีฐานะดี มีรถมีบ้านให้ลูกหลาน หรือมารดาเป็นผู้หาทรัพย์หลักของครอบครัว",
        "มาตา-มัชฌิมา": "มารดาเป็นคนสุขุมรอบคอบ ยึดสายกลาง เป็นที่ปรึกษาของลูกหลานได้ดี",
        "มาตา-ตนุ": "รูปลักษณ์หรืออุปนิสัยคล้ายมารดา ได้รับอิทธิพลทางชีวิตจากฝั่งแม่สูงมาก",
        "มาตา-กดุมภะ": "มารดาสอนเรื่องการเงิน หรือมรดกสายแม่เกี่ยวข้องกับทรัพย์สินเงินทอง",
        "มาตา-สหัชชะ": "มารดาช่วยสร้างสังคมให้ มีเครือข่ายเพื่อนฝูงจากสายแม่",
        "มาตา-พันธุ": "มารดาเป็นศูนย์กลางของครอบครัว บ้านเป็นของมารดาหรือสร้างด้วยน้ำมือของแม่",
        "มาตา-ปุตตะ": "มารดารักลูกหลานมาก มีความผูกพันลึกซึ้งกับลูก มีโอกาสรับเลี้ยงบุตรบุญธรรม",
        "มาตา-อริ": "มักขัดแย้งกับมารดา/ผู้ใหญ่หญิง หรือมารดามีโรคประจำตัว",
        "มาตา-ปัตนิ": "มารดาแนะนำเรื่องความรักคู่ครอง หรือคู่ครองมีนิสัยคล้ายมารดา",
        "มาตา-มรณะ": "แยกจากมารดาตั้งแต่เยาว์ หรือต้องเดินทางไกลจากบ้านเกิดในที่สุด",
        "มาตา-ศุภะ": "มารดาเคร่งศาสนา เป็นคนดีมีคุณธรรม เป็นแบบอย่างทางจิตวิญญาณ",
        "มาตา-กัมมะ": "มารดาส่งเสริมด้านอาชีพ หรืออาชีพที่ทำเชื่อมโยงกับมรดกฝ่ายแม่",
        "มาตา-ลาภะ": "ได้รับลาภจากมารดาหรือผู้หญิงผู้ใหญ่ในชีวิต",
        "มาตา-ทาสา": "มารดามีลูกน้องผู้ชายมาก หรือต้องรับผิดชอบดูแลบริวารชายแทนมารดา",
        "มาตา-พยายะ": "มารดามีปัญหาสุขภาพลับๆ หรือต้องแบกภาระครอบครัวเงียบๆ",
        "มาตา-ทาสี": "มารดาดูแลบริวารหญิงมาก หรือต้องช่วยดูแลญาติฝ่ายหญิงของแม่",

        // ===== ภพ โภคา =====
        "โภคา-มัชฌิมา": "มีทรัพย์สินพอประมาณ ใช้ชีวิตพอเพียงสบาย ไม่ฟุ่มเฟือยจนเกินไป",
        "โภคา-ตนุ": "บุคลิกภาพโดดเด่นด้วยทรัพย์สินและยานพาหนะ รักความสวยงามและความสุขสบาย",
        "โภคา-กดุมภะ": "มีเงินสะสมดี มีสมบัติมีค่า บ้านรถครบครัน ชีวิตมีความสุขสบาย",
        "โภคา-สหัชชะ": "ได้รับทรัพย์สินจากเพื่อนหรือสังคม หรือมีรถมีของใช้แบ่งปันกับผู้อื่น",
        "โภคา-พันธุ": "บ้านและที่ดินมีมาก ครอบครัวมีทรัพย์สินมั่นคง สืบทอดสมบัติได้ดี",
        "โภคา-ปุตตะ": "บุตรหลานได้รับมรดกหรือทรัพย์สินตกทอด มีของมีค่าส่งต่อรุ่นลูก",
        "โภคา-อริ": "ทรัพย์สินมักถูกฉ้อโกงหรือโต้แย้งสิทธิ์ ต้องระวังการลงทุนหรือซื้อขายทรัพย์สิน",
        "โภคา-ปัตนิ": "คู่ครองมีทรัพย์สินดีหรือเป็นผู้นำทางการเงิน ได้รถบ้านจากสมรส",
        "โภคา-มรณะ": "ทรัพย์สินอาจสูญหายในช่วงวิกฤต หรือได้ทรัพย์จากมรดกหลังสูญเสีย",
        "โภคา-ศุภะ": "มีทรัพย์สินมากเพราะบุญกุศล ผู้ใหญ่หนุนส่งเรื่องบ้านรถและสิ่งของมีค่า",
        "โภคา-กัมมะ": "ได้ทรัพย์สินจากผลงาน มีรายได้จากธุรกิจที่เกี่ยวกับยานพาหนะหรืออสังหาริมทรัพย์",
        "โภคา-ลาภะ": "โชคลาภมักมาในรูปทรัพย์สิน ของมีค่า ยานพาหนะ หรืออสังหาริมทรัพย์",
        "โภคา-พยายะ": "ทรัพย์สินที่ได้มาอาจมาจากงานลับหรือจากต่างแดน มีรถหรือบ้านในต่างถิ่น",
        "โภคา-ปัตนิ": "ได้ทรัพย์สินจากคู่ครอง หรือคู่ครองช่วยดูแลจัดการทรัพย์สมบัติ",
        "โภคา-ทาสี": "บริวารหญิงช่วยดูแลรักษาทรัพย์สิน หรือใช้จ่ายทรัพย์เพื่อบริวารหญิง",
        "โภคา-ทาสา": "บริวารชายช่วยดูแลรักษาทรัพย์สิน หรือได้ทรัพย์จากบริวารผู้ชาย",

        // ===== ภพ มัชฌิมา =====
        "มัชฌิมา-ตนุ": "ทำอะไรแบบสายกลาง ไม่ตึงไม่หย่อนเกินไป รักความสงบ จิตใจมักลังเล",
        "มัชฌิมา-กดุมภะ": "รู้จักประหยัดพอดี ไม่ฟุ่มเฟือยไม่ขี้เหนียว มีสมดุลทางการเงินที่ดี",
        "มัชฌิมา-สหัชชะ": "มีสังคมแบบสายกลาง ไม่เด่นไม่ดับ แต่มีมิตรที่เชื่อถือได้รอบข้าง",
        "มัชฌิมา-พันธุ": "ครอบครัวรักสงบ มีวิถีชีวิตเรียบง่ายสบายๆ ไม่มีการแก่งแย่งมากนัก",
        "มัชฌิมา-ปุตตะ": "บุตรหลานมีนิสัยสุขุมรอบคอบ มีการศึกษาที่สมดุล",
        "มัชฌิมา-อริ": "รับมือกับอุปสรรคด้วยความสงบ แก้ปัญหาด้วยเหตุและผล ไม่มักรุนแรง",
        "มัชฌิมา-ปัตนิ": "คู่ครองสุขุม รักสงบ ชีวิตคู่ราบรื่น",
        "มัชฌิมา-มรณะ": "การเปลี่ยนแปลงหรือการพลัดพรากอยู่ในระดับที่ไม่รุนแรง หรือไปต่างถิ่นระยะสั้น",
        "มัชฌิมา-ศุภะ": "มีศีลธรรมในระดับสายกลาง นับถือศาสนาแบบพอดี ไม่หัวรุนแรง",
        "มัชฌิมา-กัมมะ": "อาชีพที่ทำเป็นงานสายกลาง มั่นคงแต่ไม่โดดเด่นสุดโต่ง",
        "มัชฌิมา-ลาภะ": "โชคลาภมาแบบพอดีๆ ไม่รวยเร็วไม่จนเร็ว แต่มีความมั่นคงในระยะยาว",
        "มัชฌิมา-พยายะ": "ระวังภัยแบบเงียบๆ ในชีวิต แต่สามารถรับมือได้ด้วยสติ",
        "มัชฌิมา-ทาสี": "มีบริวารหญิงช่วยงานพอประมาณ ไม่มากไม่น้อย ความสัมพันธ์ราบรื่น",
        "มัชฌิมา-ทาสา": "มีบริวารชายช่วยงานพอประมาณ สัมพันธ์แบบสายกลางไม่มีปัญหาใหญ่",

        // ===== ภพ ตนุ (แถวที่ 2) =====
        "ตนุ-กดุมภะ": "บุคลิกภาพของคนนี้มุ่งเน้นหาเงินตลอดเวลา สร้างตัวได้เองโดยลำพัง",
        "ตนุ-สหัชชะ": "มีเสน่ห์ดึงดูดเพื่อนฝูง บุคลิกดีสังคมชอบ ชอบเดินทางและสื่อสาร",
        "ตนุ-พันธุ": "รูปร่างหน้าตาหรือบุคลิกสะท้อนมาจากครอบครัว รักบ้านรักเหย้า",
        "ตนุ-ปุตตะ": "มีบุตรหลานหรือบริวารที่มีนิสัยคล้ายตนเอง รักเด็กและชอบเลี้ยงดูผู้อื่น",
        "ตนุ-อริ": "ร่างกายมักเจ็บป่วยหรือต้องต่อสู้กับอุปสรรค ต้องระวังสุขภาพและศัตรู",
        "ตนุ-ปัตนิ": "บุคลิกภาพผูกพันกับคู่ครอง หรือมีรูปลักษณ์ที่ดึงดูดคู่ครองที่ดี",
        "ตนุ-มรณะ": "ต้องระวังสุขภาพอย่างต่อเนื่อง หรือมีชะตากรรมที่ต้องเดินทางห่างไกลบ้าน",
        "ตนุ-ศุภะ": "มีบุคลิกที่ดูดี น่าเชื่อถือ มีคุณธรรมน่าเคารพ เป็นที่ยอมรับของสังคม",
        "ตนุ-กัมมะ": "ทำงานด้วยแรงกายตนเอง มีพลังงานสูง ขยันขันแข็ง ทำงานหนักจนประสบความสำเร็จ",
        "ตนุ-ลาภะ": "โชคลาภที่มาจากน้ำพักน้ำแรงตนเอง ยิ่งขยันยิ่งได้รับโชค",
        "ตนุ-พยายะ": "ต้องระวังศัตรูลับและโรคภัยแฝงเร้น ควรรักษาสุขภาพด้านจิตใจเพิ่มขึ้น",
        "ตนุ-ทาสี": "ต้องดูแลบริวารหญิงด้วยร่างกายตนเอง ทำงานหนักเพื่อผู้อื่น",
        "ตนุ-ทาสา": "ต้องออกแรงช่วยเหลือบริวารชายหรือสังคมภายนอกอยู่บ่อยครั้ง",

        // ===== ภพ กดุมภะ =====
        "กดุมภะ-สหัชชะ": "หาเงินได้จากสังคมและเพื่อนฝูง หรือมีรายได้จากการสื่อสารเจรจา",
        "กดุมภะ-พันธุ": "เงินทองมาจากที่ดินบ้านหรือครอบครัว มีมรดกอสังหาริมทรัพย์",
        "กดุมภะ-ปุตตะ": "ลงทุนผ่านบุตรหลาน มีรายได้จากกิจการที่บุตรหลานช่วยดูแล",
        "กดุมภะ-อริ": "มีรอยรั่วทางการเงิน ต้องจ่ายหนี้หรือค่าใช้จ่ายเกี่ยวกับโรคภัย",
        "กดุมภะ-ปัตนิ": "คู่ครองช่วยบริหารจัดการเงิน หรือมีรายได้จากการทำงานร่วมกับคู่รัก",
        "กดุมภะ-มรณะ": "เงินทองอาจหายไปในช่วงวิกฤตหรือเปลี่ยนแปลงครั้งใหญ่ ควรเก็บสำรองไว้",
        "กดุมภะ-ศุภะ": "ได้รับเงินทองจากการทำบุญหรือจากผู้มีธรรม มีทรัพย์เพราะบุญบารมี",
        "กดุมภะ-กัมมะ": "หาเงินจากการทำงาน รายได้มั่นคงจากอาชีพประจำ",
        "กดุมภะ-ลาภะ": "มีโชคลาภทางการเงิน ได้รับเงินจากสิ่งที่ไม่คาดหมาย",
        "กดุมภะ-พยายะ": "มีรายได้จากงานนอกสายตา หรือเก็บทรัพย์ไว้แบบไม่เปิดเผย",
        "กดุมภะ-ทาสี": "มีรายจ่ายเพื่อบริวารหญิง หรือรับเงินจากกิจการที่บริวารหญิงช่วยดูแล",
        "กดุมภะ-ทาสา": "มีรายได้จากบริวารชาย หรือต้องจ่ายเงินดูแลลูกน้องผู้ชาย",

        // ===== ภพ สหัชชะ =====
        "สหัชชะ-พันธุ": "ญาติพี่น้องเป็นเพื่อนที่ดี หรือมีเพื่อนฝูงที่กลายมาเป็นครอบครัว",
        "สหัชชะ-ปุตตะ": "มีบุตรหลานหรือลูกน้องที่เป็นเพื่อนและช่วยเหลือกันดี",
        "สหัชชะ-อริ": "มีเพื่อนที่เป็นคู่แข่ง หรือสังคมบางส่วนกลายเป็นอุปสรรค",
        "สหัชชะ-ปัตนิ": "พบรักผ่านเพื่อนฝูงหรือสังคม คู่ครองเป็นเพื่อนเก่าหรือเพื่อนแนะนำ",
        "สหัชชะ-มรณะ": "เดินทางบ่อยมากหรือต้องพลัดพรากจากเพื่อนฝูง มีมิตรในต่างแดน",
        "สหัชชะ-ศุภะ": "มีเพื่อนที่มีคุณธรรมสูง สังคมของผู้มีบุญบารมี",
        "สหัชชะ-กัมมะ": "อาชีพที่ทำเกี่ยวข้องกับการสื่อสาร เจรจา หรือการเดินทาง",
        "สหัชชะ-ลาภะ": "ได้โชคลาภผ่านเพื่อนฝูงหรือเครือข่ายสังคม",
        "สหัชชะ-พยายะ": "มีเพื่อนหรือสังคมลับที่ไม่เปิดเผย ชอบทำงานเงียบๆ",
        "สหัชชะ-ทาสี": "มีบริวารหญิงในแวดวงสังคม ทำงานร่วมกับผู้หญิงในทีม",
        "สหัชชะ-ทาสา": "มีบริวารชายในเครือข่าย ทำงานร่วมกับผู้ชายในสังคม",

        // ===== ภพ พันธุ =====
        "พันธุ-ปุตตะ": "บ้านเต็มไปด้วยเด็กๆ หรือบุตรหลาน ครอบครัวใหญ่และอบอุ่น",
        "พันธุ-อริ": "บ้านหรือที่ดินมีปัญหาข้อพิพาท หรือครอบครัวมีความขัดแย้งกับภายนอก",
        "พันธุ-ปัตนิ": "คู่ครองเป็นคนมีบ้านหรือที่ดิน หรือแต่งงานแล้วได้บ้านที่ดีขึ้น",
        "พันธุ-มรณะ": "ต้องย้ายบ้านหรือพลัดพรากจากถิ่นฐาน มักต้องสร้างบ้านใหม่หลายครั้ง",
        "พันธุ-ศุภะ": "บ้านเรือนร่มเย็นเป็นสุข มีการบวงสรวงสิ่งศักดิ์สิทธิ์ประจำบ้าน",
        "พันธุ-กัมมะ": "อาชีพเกี่ยวข้องกับบ้านที่ดิน อสังหาริมทรัพย์ หรือธุรกิจในบ้าน",
        "พันธุ-ลาภะ": "ได้โชคลาภจากที่ดิน อสังหาริมทรัพย์ หรือมรดกบ้านช่องที่ดี",
        "พันธุ-พยายะ": "มีเรื่องลับๆ เกี่ยวกับบ้านหรือครอบครัว หรือทำงานจากบ้านอย่างเงียบๆ",
        "พันธุ-ทาสี": "มีบริวารหญิงดูแลบ้าน หรือต้องดูแลญาติฝ่ายหญิงในบ้าน",
        "พันธุ-ทาสา": "มีบริวารชายดูแลบ้าน หรือต้องช่วยดูแลญาติผู้ชายในครอบครัว",

        // ===== ภพ ปุตตะ =====
        "ปุตตะ-อริ": "บุตรหลานมักมีปัญหาสุขภาพหรืออุปสรรค หรือบุตรกลายมาเป็นคู่แข่ง",
        "ปุตตะ-ปัตนิ": "ได้บุตรหลังจากสมรส หรือคู่ครองดูแลบุตรเป็นหลัก",
        "ปุตตะ-มรณะ": "บุตรหลานอาจต้องพลัดพราก หรือมีอุปสรรคในการมีบุตร",
        "ปุตตะ-ศุภะ": "บุตรหลานมีคุณธรรม เรียนเก่ง เป็นที่ภาคภูมิใจ",
        "ปุตตะ-กัมมะ": "อาชีพเกี่ยวข้องกับเด็ก การศึกษา หรือสิ่งสร้างสรรค์",
        "ปุตตะ-ลาภะ": "ได้โชคลาภผ่านบุตรหลานหรือการลงทุนสร้างสรรค์",
        "ปุตตะ-พยายะ": "บุตรหลานมีเรื่องลับๆ หรือมีบุตรนอกสมรสแบบไม่เปิดเผย",
        "ปุตตะ-ทาสี": "มีบริวารหญิงช่วยดูแลบุตร หรือบุตรเป็นเพศหญิงมากกว่า",
        "ปุตตะ-ทาสา": "มีบริวารชายช่วยดูแลลูกน้อง หรือบุตรเป็นเพศชายมากกว่า",

        // ===== ภพ อริ =====
        "อริ-ปัตนิ": "คู่ครองเป็นคู่แข่งกันเองบ้าง หรือชีวิตคู่ต้องต่อสู้กับอุปสรรคร่วมกัน",
        "อริ-มรณะ": "(ภพเสียชนภพเสีย) อุปสรรคและการสูญเสียหักล้างกัน แคล้วคลาดจากภัยร้าย",
        "อริ-ศุภะ": "ต่อสู้กับอุปสรรคด้วยธรรมะ ชนะคู่แข่งด้วยความดี",
        "อริ-กัมมะ": "อาชีพมักมีคู่แข่ง หรือทำงานในสภาพแวดล้อมที่ต้องแข่งขันสูง",
        "อริ-ลาภะ": "ได้โชคลาภหลังชนะอุปสรรค หรือได้รับผลตอบแทนจากการต่อสู้",
        "อริ-พยายะ": "มีศัตรูลับที่ซ่อนเร้น ต้องระวังคนที่แกล้งทำเป็นมิตรแต่เป็นศัตรู",
        "อริ-ทาสี": "บริวารหญิงมักสร้างปัญหาหรือเป็นอุปสรรค ระวังคนใกล้ชิดเพศหญิง",
        "อริ-ทาสา": "บริวารชายมักสร้างปัญหา ระวังลูกน้องหรือบริวารชายที่ทรยศ",

        // ===== ภพ ปัตนิ =====
        "ปัตนิ-มรณะ": "คู่ครองต้องเดินทางไกล หรือชีวิตคู่มีการพลัดพรากชั่วคราว",
        "ปัตนิ-ศุภะ": "คู่ครองมีคุณธรรมสูง เป็นคนดีมีศีล เชื่อถือได้ทุกเรื่อง",
        "ปัตนิ-กัมมะ": "คู่ครองทำงานดี หรือทำอาชีพร่วมกันกับคู่ครอง",
        "ปัตนิ-ลาภะ": "ได้โชคลาภจากคู่ครอง หรือหลังสมรสชีวิตดีขึ้นมาก",
        "ปัตนิ-พยายะ": "คู่ครองมีเรื่องลับๆ หรือชีวิตคู่มีความลึกลับซ่อนเร้น",
        "ปัตนิ-ทาสี": "คู่ครองมีบริวารหญิงมาก หรือมีความสัมพันธ์ลึกกับผู้หญิงข้างเคียง",
        "ปัตนิ-ทาสา": "คู่ครองมีบริวารชายมาก หรือมีหุ้นส่วนชายที่สนิทสนม",

        // ===== ภพ มรณะ =====
        "มรณะ-ศุภะ": "ผู้ใหญ่อุปถัมภ์จากต่างแดน หรือความสำเร็จต้องเดินทางไกลไปสร้างตัว",
        "มรณะ-กัมมะ": "มักต้องเปลี่ยนงานบ่อย หรือทำงานทางไกล เดินทางบ่อยๆ ในหน้าที่การงาน",
        "มรณะ-ลาภะ": "ได้โชคลาภจากแดนไกล ต่างชาติต่างภาษา หรือได้รับลาภหลังการสูญเสีย",
        "มรณะ-อริ": "(ภพเสียชนภพเสีย) เอาชนะอุปสรรคและโรคภัยไข้เจ็บได้ ศัตรูแพ้ภัยตนเอง",
        "มรณะ-พยายะ": "(ภพเสียชนภพเสีย) แคล้วคลาดปลอดภัยจากภัยร้ายแรงได้อย่างปาฏิหาริย์",
        "มรณะ-ทาสี": "พลัดพรากจากบริวารหญิง หรือบริวารหญิงต้องเดินทางไกลไปทำงาน",
        "มรณะ-ทาสา": "พลัดพรากจากบริวารชาย หรือต้องส่งลูกน้องชายไปทำงานต่างแดน",

        // ===== ภพ ศุภะ =====
        "ศุภะ-กัมมะ": "อาชีพเกี่ยวข้องกับศาสนา การศึกษา หรือการทำบุญสาธารณประโยชน์",
        "ศุภะ-ลาภะ": "ได้โชคลาภจากการทำบุญ หรือมีบุญบารมีนำพาโชคดี",
        "ศุภะ-พยายะ": "มีการปฏิบัติธรรมแบบเงียบๆ หรือทำบุญโดยไม่ประกาศให้คนรู้",
        "ศุภะ-ทาสี": "มีบริวารหญิงที่มีคุณธรรม หรือทำกิจกรรมกุศลร่วมกับผู้หญิง",
        "ศุภะ-ทาสา": "มีบริวารชายที่มีคุณธรรม หรือดูแลลูกน้องชายด้วยหลักธรรม",

        // ===== ภพ กัมมะ =====
        "กัมมะ-ลาภะ": "ทำงานมากยิ่งได้โชคลาภมาก อาชีพนำพาความสำเร็จและความร่ำรวย",
        "กัมมะ-พยายะ": "ทำงานเบื้องหลัง ทำงานดึก ทำงานนอกสายตา หรืออาชีพลับ",
        "กัมมะ-ทาสี": "ทำงานร่วมกับบริวารหญิงหรือในสายงานที่มีผู้หญิงเป็นหลัก",
        "กัมมะ-ทาสา": "ทำงานร่วมกับบริวารชายหรือในสายงานที่มีผู้ชายเป็นหลัก",

        // ===== ภพ ลาภะ =====
        "ลาภะ-พยายะ": "ได้โชคลาภจากที่ลับๆ ต่างแดน หรือจากการงานที่ไม่เปิดเผย",
        "ลาภะ-ทาสี": "ได้โชคลาภผ่านบริวารหญิง หรือบริวารหญิงนำโชคมาให้",
        "ลาภะ-ทาสา": "ได้โชคลาภผ่านบริวารชาย หรือบริวารชายนำโชคมาให้",

        // ===== ภพ พยายะ =====
        "พยายะ-ทาสี": "มีบริวารหญิงลับๆ หรือมีความสัมพันธ์ลึกลับกับผู้หญิง",
        "พยายะ-ทาสา": "มีบริวารชายลับๆ หรือมีบริวารชายที่ช่วยงานในเบื้องหลัง",

        // ===== ภพ ทาสี-ทาสา =====
        "ทาสี-ทาสา": "มีบริวารทั้งชายและหญิงพร้อมมูล เป็นที่พึ่งพาของคนมาก มีความรับผิดชอบสูง",
    };

    if (typeof getThaiLunar === 'function' && lunarObj) {
        let sdDayNum = dobObj.getDay();
        let mMatch = lunarObj.month.match(/\d+/);
        let sdMonth = mMatch ? parseInt(mMatch[0]) : 5;
        const zodiacs = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
        let sdYear = zodiacs.indexOf(lunarObj.zodiac);
        if (sdYear === -1) sdYear = 0;

        let globalRows = [[], [], [], []];
        for (let i = 0; i < 7; i++) {
            globalRows[0].push(((sdDayNum - 1 + i) % 7) + 2);
            globalRows[1].push(((sdMonth - 1 + i) % 7) + 1);
            globalRows[2].push((((sdYear % 7) + i) % 7) + 1);
        }
        for (let i = 0; i < 7; i++) {
            globalRows[3].push(globalRows[0][i] + globalRows[1][i] + globalRows[2][i]);
        }
        sdGlobalRows = globalRows;

        // Calculate collisions (ดาวชนภพ)
        const rowNames = [
            ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
            ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
            ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
        ];

        const normalizeHouseName = (name) => {
            if (name === "ตะนุ") return "ตนุ";
            if (name === "กดุมพะ") return "กดุมภะ";
            if (name === "ปัตตนิ") return "ปัตนิ";
            if (name === "สุภะ") return "ศุภะ";
            return name;
        };

        let collisionsFound = [];
        for (let num = 1; num <= 7; num++) {
            let matchedHouses = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 7; c++) {
                    if (globalRows[r][c] === num) {
                        matchedHouses.push(rowNames[r][c]);
                    }
                }
            }
            if (matchedHouses.length >= 2) {
                for (let i = 0; i < matchedHouses.length; i++) {
                    for (let j = i + 1; j < matchedHouses.length; j++) {
                        const normA = normalizeHouseName(matchedHouses[i]);
                        const normB = normalizeHouseName(matchedHouses[j]);
                        const key1 = `${normA}-${normB}`;
                        const key2 = `${normB}-${normA}`;
                        let desc = collisionTextbook[key1] || collisionTextbook[key2];
                        if (desc) {
                            collisionsFound.push({
                                star: num,
                                houseA: matchedHouses[i],
                                houseB: matchedHouses[j],
                                desc: desc
                            });
                        }
                    }
                }
            }
        }

        if (collisionsFound.length > 0) {
            collisionsText = `
                <h4 style="color:#b8860b; margin-top:15px; margin-bottom:5px; font-size:16px;">🔗 การเชื่อมโยงภพภูมิ (ดาวชนภพประจำตัว):</h4>
                <div style="display:grid; grid-template-columns:1fr; gap:6px;">
                    ${collisionsFound.map(c => `
                        <div style="font-size:14.5px; border-left:3px solid #d4af37; padding-left:10px; margin-bottom:4px; text-align:justify; line-height:1.45;">
                            <strong>ดาว ${c.star} ชนภพ "${c.houseA} - ${c.houseB}":</strong> ${c.desc}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            collisionsText = `<p style="font-size:14px; color:#666; margin-top:10px;">ไม่พบดาวชนภพหลักในเกณฑ์สาระสำคัญ</p>`;
        }

        const posNames = [
            ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
            ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
            ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
        ];

        let tableHtml = `<table style="width:100%; text-align:center; border-collapse:collapse; margin-bottom:15px; font-size:13px; color:#111;">`;
        tableHtml += `<thead><tr style="background:#eee; font-weight:bold;">`;
        for (let c = 0; c < 7; c++) {
            tableHtml += `<td style="padding:5px; border:1px solid #ddd;">เสาที่ ${c+1}</td>`;
        }
        tableHtml += `</tr></thead><tbody>`;

        for (let r = 0; r < 3; r++) {
            tableHtml += `<tr>`;
            for (let c = 0; c < 7; c++) {
                tableHtml += `<td style="padding:6px; border:1px solid #ddd; background:#fff;">
                    <div style="font-size:10.5px; color:#666;">${posNames[r][c]}</div>
                    <div style="font-size:17px; font-weight:bold; color:#333;">${globalRows[r][c]}</div>
                </td>`;
            }
            tableHtml += `</tr>`;
        }
        tableHtml += `<tr style="background:#fff9e6;">`;
        for (let c = 0; c < 7; c++) {
            tableHtml += `<td style="padding:6px; border:1px solid #d4af37; border-top:2px solid #d4af37;">
                <div style="font-size:10.5px; color:#b8860b;">ฐานที่ 4</div>
                <div style="font-size:17px; font-weight:bold; color:#b8860b;">${globalRows[3][c]}</div>
            </td>`;
        }
        tableHtml += `</tr></tbody></table>`;

        let analysisText = "";
        let luckScore = 50;
        let mahaBotResult = "";
        if (typeof analyzeSevenDigits === 'function') {
            const stars = analyzeStars(globalRows[3]);
            luckScore = calculateLuckScore(globalRows[3]);
            const mahaBot = getMahaBot(globalRows[3][0], globalRows[0][0]);
            mahaBotResult = `ผลการถอดรหัสมหาบท: ตกภพ <strong>"${mahaBot.name}"</strong> - ${mahaBot.meaning}`;
            analysisText = `<p style="margin:5px 0;"><strong>🌟 ดาวดวงดีเสริมชะตา:</strong> ${stars.goodStars.join(", ")}</p>
                            <p style="margin:5px 0;"><strong>⚠️ ดาวขัดขวางวาสนา:</strong> ${stars.badStars.length > 0 ? stars.badStars.join(", ") : "ไม่มีดวงอริเด่นชัด"}</p>`;
        }

        sevenDigitsHtml = `
            <div style="font-size:16.5px; line-height: 1.8;">
                <p>ดวงสัตตเลข 7 ตัว 4 ฐานช่วยวิเคราะห์แกนหลักของกรรมกำเนิดและผลกระทบชั่วชีวิต:</p>
                <div style="overflow-x:auto; margin-bottom: 15px;">${tableHtml}</div>
                <div style="background:#fdfaf2; padding:15px; border-radius:8px; border:1px solid #d4af37; margin-bottom: 15px;">
                    ${mahaBotResult}
                    ${analysisText}
                    <p style="margin:5px 0 0 0; font-weight:bold; font-size:17px; color:#b8860b;">คะแนนวาสนาสัตตเลขชั่วชีวิต: ${luckScore} / 100</p>
                </div>
            </div>
        `;

        // หน้า 9.1 เฉพาะดาวชนภพ (ย้ายออกมาเป็นหน้าใหม่เพื่อไม่ตกขอบ)
        collisionsPageHtml = collisionsText;
    } else {
        collisionsPageHtml = `<p style="font-size:14px; color:#666;">ไม่พบดาวชนภพหลักในเกณฑ์สาระสำคัญ</p>`;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 6: คัมภีร์สัตตเลข 7 ตัว 4 ฐาน (ดวงสากล)</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${sevenDigitsHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 9 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 6.1: การเชื่อมโยงภพภูมิ (ดาวชนภพประจำตัว)</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 20px auto;"></div>
                <div style="font-size:15px; line-height:1.7; color:#111;">
                    ${collisionsPageHtml}
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 9.1 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;


    // ================= NEW PAGES: FULL AYANAMSA PREDICTIONS =================
    if (typeof ayanamsaPredictions !== 'undefined') {
        // --- PAGE A: ตำแหน่งดาวนพเคราะห์ประจำตัว (sun,moon,mars,mercury,jupiter,venus,saturn,rahu) ---
        const planetPageData = [
            { key: 'sun',     plKey: 'sun', nameTh: 'พระอาทิตย์ (๑)', color: '#e67e00', icon: '☀️' },
            { key: 'moon',    plKey: 'moon', nameTh: 'พระจันทร์ (๒)',  color: '#5b8dd9', icon: '🌙' },
            { key: 'mars',    plKey: 'mars', nameTh: 'พระอังคาร (๓)',  color: '#e74c3c', icon: '🔴' },
            { key: 'mercury', plKey: 'mer',  nameTh: 'พระพุธ (๔)',     color: '#27ae60', icon: '💚' },
            { key: 'jupiter', plKey: 'jup',  nameTh: 'พระพฤหัสบดี (๕)',color: '#8e44ad', icon: '🟣' },
            { key: 'venus',   plKey: 'ven',  nameTh: 'พระศุกร์ (๖)',   color: '#e91e8c', icon: '🌸' },
            { key: 'saturn',  plKey: 'sat',  nameTh: 'พระเสาร์ (๗)',   color: '#607d8b', icon: '⚫' },
            { key: 'rahu',    plKey: 'rahu', nameTh: 'พระราหู (๘)',    color: '#4a148c', icon: '🌑' },
        ];

        let planetCardsHtml = '';
        planetPageData.forEach(p => {
            if (!pl[p.plKey]) return;
            const signIdx = degToSign(pl[p.plKey].lon);
            const predText = (ayanamsaPredictions[p.key] && ayanamsaPredictions[p.key][signIdx])
                ? ayanamsaPredictions[p.key][signIdx].text : '';
            const signName = RASI_TH[signIdx] || '';
            const houseNo = (signIdx - lagnaIdx + 12) % 12 + 1;
            if (!predText) return;
            planetCardsHtml += `
                <div style="border-left:4px solid ${p.color}; background:#fdfaf2; border-radius:6px; padding:9px 13px; margin-bottom:9px;">
                    <div style="font-size:14.5px; font-weight:bold; color:${p.color}; margin-bottom:2px;">
                        ${p.icon} ${p.nameTh} — ราศี${signName} (ภพที่ ${houseNo})
                    </div>
                    <div style="font-size:13.5px; color:#222; line-height:1.55; text-align:justify;">${predText}</div>
                </div>`;
        });

        htmlContent += `
            <div class="pdf-page" style="width:210mm;height:297mm;max-height:297mm;overflow:hidden;box-sizing:border-box;background:#FFFFFF !important;color:#111 !important;border:15px solid #d4af37 !important;padding:50px 40px !important;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <h2 style="color:#b8860b;text-align:center;font-size:24px;margin-top:0;margin-bottom:8px;">ส่วนที่ 7: ตำแหน่งนพเคราะห์ประจำดวงชะตา</h2>
                    <div style="width:60px;height:2px;background:#d4af37;margin:0 auto 18px auto;"></div>
                    <p style="font-size:14px;color:#555;text-align:center;margin-bottom:15px;">ดาวเคราะห์แต่ละดวงสถิตอยู่ในราศีใด ส่งผลอย่างไรต่อชีวิต ณ เวลาเกิด</p>
                    ${planetCardsHtml || '<p style="color:#999;font-size:14px;text-align:center;">ไม่พบข้อมูลดาวนพเคราะห์</p>'}
                </div>
                <div style="border-top:1.5px solid rgba(212,175,55,0.3);padding-top:15px;text-align:center;font-size:13px;color:#777;">
                    หน้า A | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;

        // --- PAGE B: ตนุเศษ + ดาวศรี/กาลกิณี + ทักษาฉายา ---
        const tanuSedKey = `${lagnaIdx}-${degToSign(pl.sun ? pl.sun.lon : 0)}`;
        let tanuSedHtml = '';
        if (ayanamsaPredictions.tanuSedPredictions && ayanamsaPredictions.tanuSedPredictions[tanuSedKey]) {
            tanuSedHtml = `
                <div style="background:linear-gradient(135deg,#f3e5ff,#ede0ff);border:1px solid #b39ddb;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
                    <div style="font-size:15px;font-weight:bold;color:#6a1b9a;margin-bottom:5px;">🔮 ตนุเศษ — จิตใต้สำนึกแห่งชะตากรรม</div>
                    <div style="font-size:13.5px;color:#333;line-height:1.6;text-align:justify;">${ayanamsaPredictions.tanuSedPredictions[tanuSedKey]}</div>
                </div>`;
        }

        let sriKalineeHtml = '';
        if (ayanamsaPredictions.taksaPredictions) {
            const sriSignToRulerKey = { 0:'mars',1:'venus',2:'mercury',3:'moon',4:'sun',5:'mercury',6:'venus',7:'mars',8:'jupiter',9:'saturn',10:'rahu',11:'jupiter' };
            const taksaRulerKey = sriSignToRulerKey[lagnaIdx];
            const taksaPlKey = plKeyMapForLord[taksaRulerKey];
            const sriKey = taksaRulerKey;
            const sriIdx = lagnaIdx;

            if (ayanamsaPredictions.taksaPredictions.sri && ayanamsaPredictions.taksaPredictions.sri[lagnaIdx]) {
                sriKalineeHtml += `
                    <div style="background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border:1px solid #4caf50;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
                        <div style="font-size:15px;font-weight:bold;color:#2e7d32;margin-bottom:5px;">⭐ ดาวศรี — ดาวมงคลแห่งชะตา</div>
                        <div style="font-size:13.5px;color:#1b5e20;line-height:1.6;text-align:justify;">${ayanamsaPredictions.taksaPredictions.sri[lagnaIdx].text}</div>
                    </div>`;
            }
            if (ayanamsaPredictions.taksaPredictions.kalinee && ayanamsaPredictions.taksaPredictions.kalinee[lagnaIdx]) {
                sriKalineeHtml += `
                    <div style="background:linear-gradient(135deg,#ffeaea,#ffcdd2);border:1px solid #f44336;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
                        <div style="font-size:15px;font-weight:bold;color:#b71c1c;margin-bottom:5px;">⚠️ ดาวกาลกิณี — ดาวที่ต้องระวัง</div>
                        <div style="font-size:13.5px;color:#7f0000;line-height:1.6;text-align:justify;">${ayanamsaPredictions.taksaPredictions.kalinee[lagnaIdx].text}</div>
                    </div>`;
            }
        }

        let bodyPartHtml = '';
        if (ayanamsaPredictions.bodyPartMapping && ayanamsaPredictions.bodyPartMapping[lagnaIdx]) {
            const bm = ayanamsaPredictions.bodyPartMapping[lagnaIdx];
            bodyPartHtml = `
                <div style="background:linear-gradient(135deg,#e3f2fd,#bbdefb);border:1px solid #2196f3;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
                    <div style="font-size:15px;font-weight:bold;color:#0d47a1;margin-bottom:5px;">👤 อวัยวะสำคัญประจำลัคนาราศี${bm.sign || RASI_TH[lagnaIdx]}</div>
                    <div style="font-size:13.5px;color:#1a237e;line-height:1.6;">ลัคนาสถิตราศี<strong>${bm.sign || RASI_TH[lagnaIdx]}</strong> ควบคุมและเชื่อมโยงกับ <strong>${bm.part}</strong> ควรดูแลและรักษาสุขภาพส่วนนี้เป็นพิเศษตลอดชีพ</div>
                </div>`;
        }

        htmlContent += `
            <div class="pdf-page" style="width:210mm;height:297mm;max-height:297mm;overflow:hidden;box-sizing:border-box;background:#FFFFFF !important;color:#111 !important;border:15px solid #d4af37 !important;padding:50px 40px !important;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <h2 style="color:#b8860b;text-align:center;font-size:24px;margin-top:0;margin-bottom:8px;">ส่วนที่ 7.1: จิตใต้สำนึก • ดาวมงคล-อัปมงคล • สุขภาพ</h2>
                    <div style="width:60px;height:2px;background:#d4af37;margin:0 auto 18px auto;"></div>
                    ${tanuSedHtml}
                    ${sriKalineeHtml}
                    ${bodyPartHtml}
                    ${(!tanuSedHtml && !sriKalineeHtml && !bodyPartHtml) ? '<p style="color:#999;font-size:14px;text-align:center;">ไม่พบข้อมูล</p>' : ''}
                </div>
                <div style="border-top:1.5px solid rgba(212,175,55,0.3);padding-top:15px;text-align:center;font-size:13px;color:#777;">
                    หน้า B | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;

        // --- PAGE C: ดาวเคราะห์ร่วมราศี (Conjunctions) ---
        let conjHtml = '';
        if (ayanamsaPredictions.conjunctions) {
            const planetPairs = [
                {k:'sun',l:'sun'},{k:'moon',l:'moon'},{k:'mars',l:'mars'},
                {k:'mercury',l:'mer'},{k:'jupiter',l:'jup'},{k:'venus',l:'ven'},
                {k:'saturn',l:'sat'},{k:'rahu',l:'rahu'}
            ];
            const plColors = {sun:'#e67e00',moon:'#5b8dd9',mars:'#e74c3c',mercury:'#27ae60',jupiter:'#8e44ad',venus:'#e91e8c',saturn:'#607d8b',rahu:'#4a148c'};
            const plIcons = {sun:'☀️',moon:'🌙',mars:'🔴',mercury:'💚',jupiter:'🟣',venus:'🌸',saturn:'⚫',rahu:'🌑'};
            const plNamesTh = {sun:'อาทิตย์',moon:'จันทร์',mars:'อังคาร',mercury:'พุธ',jupiter:'พฤหัส',venus:'ศุกร์',saturn:'เสาร์',rahu:'ราหู'};

            for (let a = 0; a < planetPairs.length; a++) {
                for (let b = a + 1; b < planetPairs.length; b++) {
                    const pA = planetPairs[a], pB = planetPairs[b];
                    if (!pl[pA.l] || !pl[pB.l]) continue;
                    const sA = degToSign(pl[pA.l].lon), sB = degToSign(pl[pB.l].lon);
                    if (sA !== sB) continue; // same sign = conjunction
                    const conjKey = `${pA.k}-${pB.k}`;
                    const conjKey2 = `${pB.k}-${pA.k}`;
                    const conjText = ayanamsaPredictions.conjunctions[conjKey] || ayanamsaPredictions.conjunctions[conjKey2];
                    if (!conjText) continue;
                    conjHtml += `
                        <div style="border-left:4px solid ${plColors[pA.k]};background:#fdfaf2;border-radius:6px;padding:9px 13px;margin-bottom:9px;">
                            <div style="font-size:14px;font-weight:bold;color:#333;margin-bottom:3px;">
                                ${plIcons[pA.k]}${plIcons[pB.k]} ${plNamesTh[pA.k]}-${plNamesTh[pB.k]} ร่วมราศี${RASI_TH[sA]}
                            </div>
                            <div style="font-size:13.5px;color:#222;line-height:1.55;text-align:justify;">${conjText}</div>
                        </div>`;
                }
            }
        }

        // --- Aspect Predictions ---
        let aspectHtml = '';
        if (ayanamsaPredictions.aspectPredictions) {
            const planetPairs2 = [
                {k:'sun',l:'sun'},{k:'moon',l:'moon'},{k:'mars',l:'mars'},
                {k:'mercury',l:'mer'},{k:'jupiter',l:'jup'},{k:'venus',l:'ven'},
                {k:'saturn',l:'sat'},{k:'rahu',l:'rahu'}
            ];
            const plNamesTh2 = {sun:'อาทิตย์',moon:'จันทร์',mars:'อังคาร',mercury:'พุธ',jupiter:'พฤหัส',venus:'ศุกร์',saturn:'เสาร์',rahu:'ราหู'};
            const aspectNames = {trine:'ไตรเกณฑ์ (120°)',square:'สี่เกณฑ์ (90°)',opposition:'ตรงข้าม (180°)',sextile:'หกเกณฑ์ (60°)'};
            for (let a = 0; a < planetPairs2.length; a++) {
                for (let b = a + 1; b < planetPairs2.length; b++) {
                    const pA = planetPairs2[a], pB = planetPairs2[b];
                    if (!pl[pA.l] || !pl[pB.l]) continue;
                    const diff = Math.abs(pl[pA.l].lon - pl[pB.l].lon) % 360;
                    const d = diff > 180 ? 360 - diff : diff;
                    let aspectKey = null;
                    if (d >= 115 && d <= 125) aspectKey = 'trine';
                    else if (d >= 85 && d <= 95) aspectKey = 'square';
                    else if (d >= 175 && d <= 185) aspectKey = 'opposition';
                    else if (d >= 55 && d <= 65) aspectKey = 'sextile';
                    if (!aspectKey) continue;
                    const pairKey = `${pA.k}-${pB.k}`;
                    const pairKey2 = `${pB.k}-${pA.k}`;
                    const aspText = (ayanamsaPredictions.aspectPredictions[pairKey] && ayanamsaPredictions.aspectPredictions[pairKey][aspectKey])
                        || (ayanamsaPredictions.aspectPredictions[pairKey2] && ayanamsaPredictions.aspectPredictions[pairKey2][aspectKey]);
                    if (!aspText) continue;
                    aspectHtml += `
                        <div style="border-left:4px solid #ff7043;background:#fff8f5;border-radius:6px;padding:8px 12px;margin-bottom:8px;">
                            <div style="font-size:13.5px;font-weight:bold;color:#bf360c;margin-bottom:2px;">
                                🔭 ${plNamesTh2[pA.k]}-${plNamesTh2[pB.k]} ${aspectNames[aspectKey]}
                            </div>
                            <div style="font-size:13px;color:#222;line-height:1.5;text-align:justify;">${aspText}</div>
                        </div>`;
                }
            }
        }

        htmlContent += `
            <div class="pdf-page" style="width:210mm;height:297mm;max-height:297mm;overflow:hidden;box-sizing:border-box;background:#FFFFFF !important;color:#111 !important;border:15px solid #d4af37 !important;padding:50px 40px !important;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <h2 style="color:#b8860b;text-align:center;font-size:24px;margin-top:0;margin-bottom:8px;">ส่วนที่ 7.2: ดาวเคราะห์ร่วมราศี &amp; การส่องทัศนะ</h2>
                    <div style="width:60px;height:2px;background:#d4af37;margin:0 auto 15px auto;"></div>
                    ${conjHtml ? `<div style="font-size:14.5px;font-weight:bold;color:#b8860b;margin-bottom:8px;">🤝 ดาวร่วมราศี (Conjunction)</div>${conjHtml}` : ''}
                    ${aspectHtml ? `<div style="font-size:14.5px;font-weight:bold;color:#bf360c;margin-bottom:8px;margin-top:10px;">🔭 การส่องทัศนะ (Aspect)</div>${aspectHtml}` : ''}
                    ${(!conjHtml && !aspectHtml) ? '<p style="color:#999;font-size:14px;text-align:center;">ไม่พบดาวร่วมราศีหรือการส่องทัศนะที่สำคัญ</p>' : ''}
                </div>
                <div style="border-top:1.5px solid rgba(212,175,55,0.3);padding-top:15px;text-align:center;font-size:13px;color:#777;">
                    หน้า C | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;

        // --- PAGE D: อาชีพ + คู่ครอง + เดกัน/นวางค์ ---
        let careerHtml = '';
        if (ayanamsaPredictions.careerPredictions && ayanamsaPredictions.careerPredictions[lagnaIdx]) {
            const cp = ayanamsaPredictions.careerPredictions[lagnaIdx];
            careerHtml = `
                <div style="background:linear-gradient(135deg,#fff8e1,#fff3cd);border:1px solid #d4af37;border-radius:8px;padding:13px 16px;margin-bottom:14px;">
                    <div style="font-size:15.5px;font-weight:bold;color:#b8860b;margin-bottom:6px;">💼 พยากรณ์อาชีพและหน้าที่การงาน (ดวงนิรายะ)</div>
                    <div style="font-size:13.5px;color:#333;line-height:1.65;text-align:justify;">${typeof cp === 'string' ? cp : (cp.text || JSON.stringify(cp))}</div>
                </div>`;
        }

        let spouseHtml = '';
        if (ayanamsaPredictions.spousePredictions && ayanamsaPredictions.spousePredictions[lagnaIdx]) {
            const sp = ayanamsaPredictions.spousePredictions[lagnaIdx];
            spouseHtml = `
                <div style="background:linear-gradient(135deg,#fce4ec,#f8bbd0);border:1px solid #e91e63;border-radius:8px;padding:13px 16px;margin-bottom:14px;">
                    <div style="font-size:15.5px;font-weight:bold;color:#880e4f;margin-bottom:6px;">💑 พยากรณ์คู่ครองและชีวิตสมรส</div>
                    <div style="font-size:13.5px;color:#4a0e2a;line-height:1.65;text-align:justify;">${typeof sp === 'string' ? sp : (sp.text || JSON.stringify(sp))}</div>
                </div>`;
        }

        // decanNavamsaTraits
        let decanHtml = '';
        if (ayanamsaPredictions.decanNavamsaTraits) {
            const lagnaRulerKey = { 0:'mars',1:'venus',2:'mercury',3:'moon',4:'sun',5:'mercury',6:'venus',7:'mars',8:'jupiter',9:'saturn',10:'rahu',11:'jupiter' }[lagnaIdx];
            const decanText = ayanamsaPredictions.decanNavamsaTraits[lagnaRulerKey];
            if (decanText) {
                decanHtml = `
                    <div style="background:linear-gradient(135deg,#e0f7fa,#b2ebf2);border:1px solid #00bcd4;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
                        <div style="font-size:15px;font-weight:bold;color:#006064;margin-bottom:5px;">🌀 ลักษณะเดกัน/นวางค์ประจำลัคนา</div>
                        <div style="font-size:13.5px;color:#00363a;line-height:1.6;text-align:justify;">${decanText}</div>
                    </div>`;
            }
        }

        // treeAnalogy
        let treeHtml = '';
        if (ayanamsaPredictions.treeAnalogy && ayanamsaPredictions.treeAnalogy.lagna) {
            treeHtml = `
                <div style="background:linear-gradient(135deg,#f1f8e9,#dcedc8);border:1px solid #8bc34a;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
                    <div style="font-size:15px;font-weight:bold;color:#33691e;margin-bottom:5px;">🌳 อุปมาต้นไม้ชีวิต — ภาพรวมดวงชะตา</div>
                    <div style="font-size:13.5px;color:#1b5e20;line-height:1.6;text-align:justify;">${ayanamsaPredictions.treeAnalogy.lagna}</div>
                </div>`;
        }

        htmlContent += `
            <div class="pdf-page" style="width:210mm;height:297mm;max-height:297mm;overflow:hidden;box-sizing:border-box;background:#FFFFFF !important;color:#111 !important;border:15px solid #d4af37 !important;padding:50px 40px !important;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <h2 style="color:#b8860b;text-align:center;font-size:24px;margin-top:0;margin-bottom:8px;">ส่วนที่ 7.3: อาชีพ • คู่ครอง • ต้นไม้ชีวิต</h2>
                    <div style="width:60px;height:2px;background:#d4af37;margin:0 auto 18px auto;"></div>
                    ${treeHtml}
                    ${careerHtml}
                    ${spouseHtml}
                    ${decanHtml}
                    ${(!careerHtml && !spouseHtml && !decanHtml && !treeHtml) ? '<p style="color:#999;font-size:14px;text-align:center;">ไม่พบข้อมูล</p>' : ''}
                </div>
                <div style="border-top:1.5px solid rgba(212,175,55,0.3);padding-top:15px;text-align:center;font-size:13px;color:#777;">
                    หน้า D | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;

        // --- PAGE E: มหาทศา / อันตรทศา ---
        let mahaTaksaHtml = '';
        if (ayanamsaPredictions.mahaTaksaPredictions) {
            const moonSignIdx = pl.moon ? degToSign(pl.moon.lon) : lagnaIdx;
            const mahaTaksaKeys = ['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu'];
            const mahaTaksaColors = {sun:'#e67e00',moon:'#5b8dd9',mars:'#e74c3c',mercury:'#27ae60',jupiter:'#8e44ad',venus:'#e91e8c',saturn:'#607d8b',rahu:'#4a148c',ketu:'#795548'};
            const mahaTaksaIcons = {sun:'☀️',moon:'🌙',mars:'🔴',mercury:'💚',jupiter:'🟣',venus:'🌸',saturn:'⚫',rahu:'🌑',ketu:'🟤'};
            const mahaTaksaNamesTh = {sun:'มหาทศาอาทิตย์',moon:'มหาทศาจันทร์',mars:'มหาทศาอังคาร',mercury:'มหาทศาพุธ',jupiter:'มหาทศาพฤหัส',venus:'มหาทศาศุกร์',saturn:'มหาทศาเสาร์',rahu:'มหาทศาราหู',ketu:'มหาทศาเกตุ'};
            const mahaTaksaYears = {sun:6,moon:10,mars:7,mercury:17,jupiter:16,venus:20,saturn:19,rahu:18,ketu:7};

            // Show the 3 dashas starting from moon sign ruler
            const startIdx = moonSignIdx % mahaTaksaKeys.length;
            for (let i = 0; i < Math.min(5, mahaTaksaKeys.length); i++) {
                const mKey = mahaTaksaKeys[(startIdx + i) % mahaTaksaKeys.length];
                const pred = ayanamsaPredictions.mahaTaksaPredictions[mKey];
                if (!pred) continue;
                const mahaText = pred.maha || '';
                const antarText = pred.antar || '';
                mahaTaksaHtml += `
                    <div style="border-left:4px solid ${mahaTaksaColors[mKey]};background:#fdfaf2;border-radius:6px;padding:9px 13px;margin-bottom:9px;">
                        <div style="font-size:14.5px;font-weight:bold;color:${mahaTaksaColors[mKey]};margin-bottom:3px;">
                            ${mahaTaksaIcons[mKey]} ${mahaTaksaNamesTh[mKey]} (${mahaTaksaYears[mKey]} ปี)
                        </div>
                        ${mahaText ? `<div style="font-size:13.5px;color:#333;line-height:1.5;text-align:justify;margin-bottom:4px;"><strong>มหาทศา:</strong> ${mahaText}</div>` : ''}
                        ${antarText ? `<div style="font-size:13px;color:#555;line-height:1.5;text-align:justify;"><strong>อันตรทศา:</strong> ${antarText}</div>` : ''}
                    </div>`;
            }
        }

        // planetaryDignitiesData summary
        let dignitiesHtml = '';
        if (ayanamsaPredictions.planetaryDignitiesData && ayanamsaPredictions.planetaryDignitiesData.definitions) {
            const defs = ayanamsaPredictions.planetaryDignitiesData.definitions;
            const dignityRows = Object.entries(defs).slice(0, 4).map(([k, v]) =>
                `<div style="padding:6px 10px;background:#fff;border:1px solid #e0d9c8;border-radius:5px;font-size:13px;color:#333;">
                    <strong style="color:#b8860b;">${k}:</strong> ${typeof v === 'string' ? v : JSON.stringify(v)}
                </div>`
            ).join('');
            if (dignityRows) {
                dignitiesHtml = `
                    <div style="margin-bottom:14px;">
                        <div style="font-size:15px;font-weight:bold;color:#b8860b;margin-bottom:8px;">⚖️ ค่าศักดิ์ดาวเคราะห์ (อุจจ์/นิจ/เกษตร)</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">${dignityRows}</div>
                    </div>`;
            }
        }

        htmlContent += `
            <div class="pdf-page" style="width:210mm;height:297mm;max-height:297mm;overflow:hidden;box-sizing:border-box;background:#FFFFFF !important;color:#111 !important;border:15px solid #d4af37 !important;padding:50px 40px !important;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <h2 style="color:#b8860b;text-align:center;font-size:24px;margin-top:0;margin-bottom:8px;">ส่วนที่ 7.4: มหาทศา-อันตรทศา &amp; ค่าศักดิ์ดาว</h2>
                    <div style="width:60px;height:2px;background:#d4af37;margin:0 auto 15px auto;"></div>
                    <p style="font-size:13.5px;color:#555;text-align:center;margin-bottom:12px;">ดาศาเริ่มต้นคำนวณจากตำแหน่งดาวจันทร์ ณ เวลาเกิด</p>
                    ${mahaTaksaHtml || '<p style="color:#999;font-size:14px;text-align:center;">ไม่พบข้อมูลมหาทศา</p>'}
                    ${dignitiesHtml}
                </div>
                <div style="border-top:1.5px solid rgba(212,175,55,0.3);padding-top:15px;text-align:center;font-size:13px;color:#777;">
                    หน้า E | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;
    }

    // ================= PAGES 10 - 14: 21 HOUSES DETAILED INTERPRETATIONS =================

    if (sdGlobalRows) {
        // Compute Page 9.5 (Taksasattalek Analysis Page)
        const dayNum = sdGlobalRows[0][0];
        const base4 = sdGlobalRows[3][0];
        
        // 1. Life Path (Maha Bot and Row 4)
        const base4Meanings = {
            1: "กำลังอาทิตย์: เด่นด้านเกียรติยศ ผู้นำ ได้ทำงานใหญ่ มีความเชื่อมั่นสูง",
            2: "กำลังจันทร์: เด่นด้านเมตตามหานิยม เสน่ห์ดึงดูดใจ และงานบริการ",
            3: "กำลังอังคาร: เด่นด้านความกล้าหาญ การบุกเบิก คล่องแคล่วว่องไว",
            4: "กำลังพุธ: เด่นด้านการค้าขาย เจรจาสื่อสาร และสติปัญญาไหวพริบดี",
            5: "กำลังพฤหัสบดี: เด่นด้านความรู้ คุณธรรม ผู้ใหญ่อุปถัมภ์ และการศึกษา",
            6: "กำลังศุกร์: เด่นด้านความรัก การเงิน ความบันเทิงรื่นรมย์ในชีวิต",
            7: "กำลังเสาร์: เด่นด้านความหนักแน่น อดทน แบกภาระรับผิดชอบสูง",
            8: "กำลังราหู: เด่นด้านการพลิกแพลง กล้าได้กล้าเสีย ทันเล่ห์เหลี่ยมคน",
            9: "กำลังเกตุ: เด่นด้านสิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาด และมีสัมผัสวิเศษ",
            10: "กำลังพระเคราะห์รวมสูง: มีเกียรติยศใหญ่และเกณฑ์ชะตามั่นคงในต่างแดน",
            11: "กำลังมหาโชค: หยิบจับสิ่งใดมักได้รับโอกาสที่ดีและมีความสำเร็จฟลุ๊คๆ เสมอ",
            12: "กำลังราชาโชค: วาสนาดี ได้ลาภจากชนชั้นสูงหรือคนรอบข้างเคารพนับถือ",
            13: "กำลังมหาอุตม์: พลังอำนาจแข็งแกร่ง มีความมุ่งมั่นทลายทุกอุปสรรคจนรุ่งเรือง",
            14: "กำลังจักรพรรดิ: มีความมั่นคงมั่งคั่ง เป็นเสาหลักให้ผู้คนพึ่งพาบารมี",
            15: "กำลังกำลังพระเคราะห์ยอดเยี่ยม: เกณฑ์ชะตาเปี่ยมพลังความสุขและความรุ่งโรจน์รอบตัว",
            16: "กำลังตบะบารมีสูง: มีสง่าราศี ผู้คนยำเกรงคอยเกื้อหนุนและมีอำนาจในการตัดสินใจ",
            17: "กำลังมหาจักร: ชีวิตพลิกผันจากลำบากสู่ยิ่งใหญ่ ความราบรื่นมาจากการสู้ไม่ถอย",
            18: "กำลังราชาบารมี: มีชื่อเสียงได้รับการยกย่องสูงสุดในสายวิชาชีพ",
            19: "กำลังดาวเกตุหนุน: ปาฏิหาริย์แห่งชีวิต มีโชคลาภพิเศษและแคล้วคลาดจากภัย",
            20: "กำลังพลังรวมสูงสุดพิเศษ: วาสนาความมั่งคั่งและปัญญาสูงระดับตำนานสี่ทิศ",
            21: "กำลังมหาเศรษฐี: พลังแห่งทรัพย์สมบัติเปี่ยมล้น ดึงดูดความร่ำรวยและผลกำไร"
        };
        const mb = getMahaBot(base4, dayNum);
        const base4Text = base4Meanings[base4] || "เป็นดวงชะตาที่มีพลังปานกลาง มั่นคงตามลำดับ";
        
        // 2. ปาก ใจ ที่นั่ง (Mouth, Mind, Seat)
        const pakNum = sdGlobalRows[0][3];
        const jaiNum = sdGlobalRows[1][3];
        const teenungNum = sdGlobalRows[2][3];
        const starNames = ["", "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "ราหู", "เกตุ"];
        const pakStar = starNames[pakNum] || `ดาว ${pakNum}`;
        const jaiStar = starNames[jaiNum] || `ดาว ${jaiNum}`;
        const teenungStar = starNames[teenungNum] || `ดาว ${teenungNum}`;
        
        const pakPred = (typeof TRIO_PREDICTIONS !== 'undefined' && TRIO_PREDICTIONS["ปาก"]?.[pakNum]) || "พูดจาอ่อนน้อมเป็นมงคล ค้าขายรุ่งเรืองด้วยวาทศิลป์อันประเสริฐแล";
        const jaiPred = (typeof TRIO_PREDICTIONS !== 'undefined' && TRIO_PREDICTIONS["ใจ"]?.[jaiNum]) || "มีอัธยาศัยดี มีปัญญาพิจารณารอบคอบ ทำบุญกุศลขึ้นนักแล";
        const teenungPred = (typeof TRIO_PREDICTIONS !== 'undefined' && TRIO_PREDICTIONS["ที่นั่ง"]?.[teenungNum]) || "มีหลักฐานบ้านเรือนมั่นคง วาสนาบารมีสูงส่ง มีคนนับถือยำเกรงแล";
        
        // 3. Life Stages (3 ช่วงอายุ)
        const starPower = ["", "อำนาจ/เด่นดัง", "เมตตา/อ่อนหวาน", "ขยัน/กล้าหาญ", "ปัญญา/เจรจา", "คุณธรรม/ผู้ใหญ่", "การเงิน/ความสุข", "อดทน/ภาระ", "พลิกผัน/ลึกลับ", "จิตวิญญาณ/หยั่งรู้"];
        const earlyNum = sdGlobalRows[0][0];
        const midNum = sdGlobalRows[1][0];
        const midWork = sdGlobalRows[1][2];
        const lateNum = sdGlobalRows[2][0];
        const earlyPower = starPower[earlyNum] || "ความสงบเรียบง่าย";
        const midPower = starPower[midNum] || "พลังสร้างตัวบุกเบิก";
        const latePower = starPower[lateNum] || "ความสมบูรณ์บารมี";
        
        // 4. Linkages (บทวิเคราะห์การเชื่อมโยงคู่ดาวชิ่งสัมพันธ์)
        let insights = [];
        if (base4 >= 16) insights.push(`🧬 <strong>วิเคราะห์กำลังพลังชีวิต:</strong> ได้กำลังรวมเสาสรุปฐานที่สี่เท่ากับ <strong>${base4}</strong> จัดว่าเป็นโครงสร้างดวงที่มี 'ตบะบารมี' สูง มีอิทธิพลและสง่าราศีในตัวเองรอบทิศ`);
        else if (base4 >= 11) insights.push(`🧬 <strong>วิเคราะห์กำลังพลังชีวิต:</strong> ได้กำลังรวมเสาสรุปฐานที่สี่เท่ากับ <strong>${base4}</strong> อยู่ในขอบข่ายดวง 'มหาโชคลาภ' หยิบจับสิ่งใดมีแนวโน้มได้รับโอกาสและการสนับสนุนที่ดีเด่น`);
        else insights.push(`🧬 <strong>วิเคราะห์กำลังพลังชีวิต:</strong> ได้กำลังรวมเสาสรุปฐานที่สี่เท่ากับ <strong>${base4}</strong> จัดเป็นดวงชะตาแบบ 'สู้แล้วรวยประสบความสำเร็จด้วยลำแข้งตนเอง' ทุกความก้าวหน้าแลกมาด้วยปัญญาความตั้งใจจริง`);

        let starMap = {};
        const posNamesFull = [
            ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
            ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
            ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                let num = sdGlobalRows[r][c];
                if (!starMap[num]) starMap[num] = [];
                starMap[num].push(posNamesFull[r][c]);
            }
        }

        for (let num in starMap) {
            let sites = starMap[num];
            if (sites.includes("ธนัง") || sites.includes("กดุมพะ") || sites.includes("กดุมภะ")) {
                if (sites.includes("ลาภะ")) insights.push(`💰 <strong>เส้นทางการเงินเด่น:</strong> มีจุดชิ่งดาวเลข <strong>${num}</strong> ไปตกภพโชคลาภ (ลาภะ) มีเกณฑ์ร่ำรวย โชคดี หรือทำมาหากินคล่องตัวเด่นชัด`);
                if (sites.includes("กัมมะ")) insights.push(`🛠️ <strong>งานสร้างทรัพย์:</strong> จุดชิ่งดาวเลข <strong>${num}</strong> เชื่อมกับการงาน (กัมมะ) สรุปชะตาทำงานสร้างรายได้ ยิ่งลุยงานยิ่งร่ำรวย`);
            }
            if (sites.includes("มัชฌิมา") || sites.includes("ปัตนิ") || sites.includes("ปัตตนิ")) {
                if (sites.includes("ธนัง") || sites.includes("โภคา")) insights.push(`💍 <strong>วาสนาคู่ส่งเสริม:</strong> ดาวเลข <strong>${num}</strong> ชิ่งโยงทรัพย์สิน (ธนัง/โภคา) สรุปมีคู่รักหรือหุ้นส่วนเข้ามาร่วมสร้างฐานะบ้านรถเป็นปึกแผ่น`);
                if (sites.includes("หินะ") || sites.includes("อริ")) insights.push(`⚠️ <strong>เรื่องความรักควรประคอง:</strong> ดาวเลข <strong>${num}</strong> สัมพันธ์กับจุดอุปสรรค แนะนำต้องอดทนใจเย็น พูดคุยกับคนรักด้วยความเข้าใจเป็นหลัก`);
            }
        }
        
        let linkagesHtml = insights.map(ins => `<div style="margin-bottom:6px; font-size:13.5px; line-height:1.45;">${ins}</div>`).join('');
        if (!linkagesHtml) linkagesHtml = `<div style="font-size:13.5px; color:#666; font-style:italic;">โครงชะตาค่อนข้างปกติ มุ่งเน้นการปฏิบัติตามสายกลางอย่างเป็นธรรม</div>`;

        let specialAnalysisHtml = `
            <div style="font-size:15px; line-height:1.75; color:#111;">
                <!-- 1. วาสนาพื้นดวงชะตา (Life Path) -->
                <div style="background:#fdfaf2; border:1px solid #d4af37; border-radius:8px; padding:12px 15px; margin-bottom:15px;">
                    <h4 style="color:#b8860b; font-size:16px; margin:0 0 6px 0; font-weight:bold; display:flex; align-items:center; gap:6px;">
                        <span>🌱</span> วาสนาพื้นดวงชะตา (Life Path) และกำลังพลังชีวิต
                    </h4>
                    <p style="margin:0; font-size:14px; text-align:justify;">
                        คุณเกิดมาพร้อมดาวเด่น <strong>ดาว ${dayNum}</strong> ในตำแหน่งเกียรติยศมหาบท <strong>"${mb.name}"</strong> 
                        <span style="color:#666; font-style:italic;">(${mb.meaning})</span> 
                        ประกอบกับเสาสรุปแถว 4 ได้ฐานกำลังดาวระดับ <strong>"${base4}"</strong>: 
                        <strong>${base4Text}</strong>
                    </p>
                </div>

                <!-- 2. ปาก ใจ ที่นั่ง -->
                <div style="margin-bottom:15px;">
                    <h4 style="color:#b8860b; font-size:16px; margin:0 0 8px 0; font-weight:bold; display:flex; align-items:center; gap:6px;">
                        <span>🗣️</span> อิทธิพลจุดพยากรณ์พิเศษ: ปาก ใจ ที่นั่ง (Mouth, Mind, Seat)
                    </h4>
                    <div style="display:grid; grid-template-columns:1fr; gap:8px;">
                        <div style="background:#fdfdfd; border:1px solid #eee; border-left:4px solid #f39c12; border-radius:6px; padding:8px 12px;">
                            <strong>👄 ปาก (วาทศิลป์และการเจรจา) ตกดาว ${pakNum} (${pakStar}):</strong> ${pakPred}
                        </div>
                        <div style="background:#fdfdfd; border:1px solid #eee; border-left:4px solid #e74c3c; border-radius:6px; padding:8px 12px;">
                            <strong>❤️ ใจ (ความนึกคิดและอุปนิสัยแท้จริง) ตกดาว ${jaiNum} (${jaiStar}):</strong> ${jaiPred}
                        </div>
                        <div style="background:#fdfdfd; border:1px solid #eee; border-left:4px solid #9b59b6; border-radius:6px; padding:8px 12px;">
                            <strong>🪑 ที่นั่ง (บารมี ที่อยู่อาศัย และคู่ครอง) ตกดาว ${teenungNum} (${teenungStar}):</strong> ${teenungPred}
                        </div>
                    </div>
                </div>

                <!-- 3. ช่วงอายุ -->
                <div style="margin-bottom:15px;">
                    <h4 style="color:#b8860b; font-size:16px; margin:0 0 8px 0; font-weight:bold; display:flex; align-items:center; gap:6px;">
                        <span>⏳</span> การวิเคราะห์เส้นทางดวงชะตา 3 ช่วงอายุ (Life Stages)
                    </h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
                        <div style="background:#f4f9ff; border:1px solid #cce2ff; border-radius:6px; padding:8px 12px; font-size:13.5px;">
                            <strong style="color:#3498db; display:block; margin-bottom:4px;">👶 ปฐมวัย (เด็ก - 25 ปี)</strong>
                            นำทางโดยดาว ${earlyNum} ส่งผลให้มีลักษณะเด่นทางด้าน <em>${earlyPower}</em> ผูกพันกับครอบครัวและการเรียนรู้
                        </div>
                        <div style="background:#fffcf4; border:1px solid #ffeeba; border-radius:6px; padding:8px 12px; font-size:13.5px;">
                            <strong style="color:#e67e22; display:block; margin-bottom:4px;">🏃 วัยสร้างตัว (26 - 50 ปี)</strong>
                            นำทางโดยดาว ${midNum} บุกเบิกขับเคลื่อนความก้าวหน้าและการงานผ่านทาง <em>${midPower}</em> มุ่งเน้นการปฏิสัมพันธ์ทางสังคม
                        </div>
                        <div style="background:#f4fff6; border:1px solid #c3e6cb; border-radius:6px; padding:8px 12px; font-size:13.5px;">
                            <strong style="color:#2ecc71; display:block; margin-bottom:4px;">🏡 บั้นปลาย (51 ปีขึ้นไป)</strong>
                            นำทางโดยดาว ${lateNum} มุ่งเน้นความสงบ ความมั่นคงในฐานะ มีบารมีและผลประโยชน์พรั่งพร้อมตามดวงชะตา
                        </div>
                    </div>
                </div>

                <!-- 4. ชิ่งสัมพันธ์ -->
                <div>
                    <h4 style="color:#b8860b; font-size:16px; margin:0 0 6px 0; font-weight:bold; display:flex; align-items:center; gap:6px;">
                        <span>🔗</span> บทวิเคราะห์คู่ดาวชิ่งสัมพันธ์และการเงิน-ความรัก (Linkages)
                    </h4>
                    <div style="background:#fafafa; border:1px solid #ddd; border-radius:6px; padding:10px 12px;">
                        ${linkagesHtml}
                    </div>
                </div>
            </div>
        `;

        htmlContent += `
            <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 6.2: อภิพยากรณ์โครงสร้างสัตตเลขวิเคราะห์พิเศษ</h2>
                    <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                    ${specialAnalysisHtml}
                </div>
                <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                    หน้า 9.5 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                </div>
            </div>
        `;

        const rowNames = [
            ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
            ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
            ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
        ];
        
        const starsMeanings = {
            1: "อาทิตย์: โดดเด่นในสายงาน เป็นผู้นำสูง ขยันขันแข็ง แต่ระวังความดื้อดึง",
            2: "จันทร์: สุภาพ มีเสน่ห์ เมตตา อารมณ์นุ่มนวล อุปถัมภ์เกื้อกูลสูง",
            3: "อังคาร: กล้าหาญ ลุยงานหนัก แข็งแกร่ง ว่องไว แต่ระวังอารมณ์ฉุนเฉียว",
            4: "พุธ: ช่างพูด ช่างเจรจา มีไหวพริบ ความคิดรวดเร็ว ค้าขายติดต่อประสานงานเก่ง",
            5: "พฤหัส: มีศีลธรรม ปัญญา ความสำเร็จจากผู้ใหญ่และหลักการวิชาการ",
            6: "ศุกร์: มีเสน่ห์ เมตตาด้านการเงินความรัก รสนิยมดี ได้รับโชคบ่อย",
            7: "เสาร์: ทรหด อดทน แบกภาระรับผิดชอบสูง มักทำงานปิดทองหลังพระ"
        };
        
        let houseDetailsList = [];
        
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                const starVal = sdGlobalRows[r][c];
                const cleanStarVal = ((starVal - 1) % 7) + 1; // Normalize to 1-7
                const interpretation = starsMeanings[cleanStarVal];
                
                houseDetailsList.push(`
                    <div style="margin-bottom:12px; padding:10px; background:#fff; border:1px solid #eee; border-left:3.5px solid #d4af37; border-radius:5px; font-size:15px;">
                        <strong style="color:#b8860b;">ภพ ${rowNames[r][c]}: ตกดาว ${cleanStarVal} (${plKeys[Object.keys(plKeys)[(cleanStarVal - 1) % 9]]})</strong><br>
                        <span>บทวิเคราะห์: ${interpretation} นำมาซึ่งความผูกพันและทิศทางชีวิตที่เกี่ยวข้องกับเรื่องนี้โดยตรง</span>
                    </div>
                `);
            }
        }
        
        for (let pIdx = 0; pIdx < 5; pIdx++) {
            const pageStart = pIdx * 4;
            const pageEnd = Math.min((pIdx + 1) * 4, 21);
            const housesSlice = houseDetailsList.slice(pageStart, pageEnd);
            
            htmlContent += `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 7: เจาะลึกความหมาย 21 ภพสัตตเลข (ชุดที่ ${pIdx+1}/5)</h2>
                        <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                        <div style="font-size:15.5px; line-height:1.7;">
                            ${housesSlice.join('')}
                        </div>
                    </div>
                    <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                        หน้า ${10 + pIdx} | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
                    </div>
                </div>
            `;
        }
    }

    // ================= PAGE 15: TAKSA PREDICTIONS =================
    let taksaHtml = "";
    if (typeof thaksaOrder !== 'undefined') {
        const thaksaOrder = [1, 2, 3, 4, 7, 5, 8, 6];
        const birthDayIndex = dobObj.getDay();
        const birthTaksaMap = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7};
        const birthStarNum = birthTaksaMap[birthDayIndex] || 1;
        const birthStarIdx = thaksaOrder.indexOf(birthStarNum);
        const taksaPositions = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
        
        let taksaList = [];
        for (let i = 0; i < 8; i++) {
            let starNum = thaksaOrder[(birthStarIdx + i) % 8];
            let starName = plKeys[Object.keys(plKeys)[(starNum - 1) % 9]] || `ดาว ${starNum}`;
            taksaList.push(`<strong>${taksaPositions[i]}:</strong> ${starName}`);
        }

        taksaHtml = `
            <div style="font-size:16.5px; line-height: 1.9;">
                <p style="text-align:justify;">
                    คัมภีร์มหาทักษากำเนิดพยากรณ์โครงสร้างพลังดาว 8 ทิศของชีวิต โดยบ่งบอกถึงขั้วบวกดึงดูดพลังดีอย่าง <strong>"เดช-ศรี-มูละ"</strong> และจุดกาลกิณีที่ชีวิตของท่านควรหลีกเลี่ยงหรือปรับแก้อย่างถาวร:
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: rgba(212,175,55,0.05); padding: 15px; border-radius: 8px; border:1px solid rgba(212,175,55,0.2); margin-bottom: 20px;">
                    ${taksaList.map(item => `<div>${item}</div>`).join('')}
                </div>
                <p><strong>คำอธิบายตำแหน่งทักษาชีวิตหลัก:</strong></p>
                <ul>
                    <li><strong>ศรี:</strong> หมายถึง โชคลาภ อำนาจความเมตตา และทรัพย์สมบัติที่ได้มาโดยง่าย</li>
                    <li><strong>กาลกิณี:</strong> อุปสรรค ปัญหา และสิ่งอับโชคที่ควรหลีกเลี่ยงหรือประคองสติยามเกี่ยวข้อง</li>
                    <li><strong>เดช:</strong> อำนาจบารมี ชื่อเสียง การควบคุมสั่งการ และเกียรติยศทางสังคม</li>
                </ul>
            </div>
        `;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 8: มหาทักษาพยากรณ์กำเนิดตลอดชีพ</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${taksaHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 15 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 16: NAKSHATRA & TRANSIT =================
    let advancedAstrologyHtml = "";
    if (pl) {
        const lordStarText = lordStar || "ไม่พบดาวเจ้าชะตา";
        const dayRulerText = dayRuler || "ไม่พบดาวประจำวัน";
        
        let dashaInfo = "";
        if (typeof getNaksatra === 'function') {
            const nak = getNaksatra(pl.moon.lon);
            dashaInfo = `<p><strong>ฤกษ์กำเนิด:</strong> ${nak.name} • <strong>นพเคราะห์เสวยอายุเกิด:</strong> ดุลจิตราฤกษ์ตามระยะวิถีโคจรของดวงจันทร์</p>`;
        }

        advancedAstrologyHtml = `
            <div style="font-size: 16.5px; line-height: 1.9;">
                <p>ตามแนววิถีโหราศาสตร์ไทยฉบับสมบูรณ์ (อ.สิงห์โต สุริยาอารักษ์):</p>
                <p><strong>ดาวเกษตรเจ้าเรือนลัคน์:</strong> ${lordStarText} (ดาวดวงนี้บ่งบอกถึงตัวตนและจิตวิญญาณหลักของเจ้าชะตา)</p>
                <p><strong>ดาวผู้ปกปักรักษาประจำวันเกิด:</strong> ${dayRulerText} (เป็นดาวกำลังวันหนุนนำการตัดสินใจและโชคลาภหลัก)</p>
                ${dashaInfo}
                <div style="border-left: 3px solid #d4af37; padding-left: 12px; margin-top: 15px; font-style: italic; color: #444;">
                    "ตามตำราอาจารย์สิงห์โต สุริยาอารักษ์ การศึกษาตำแหน่งดวงนพเคราะห์จรช่วยไขปริศนาเรื่องวาสนา โชคลาภ และวิกฤตวัยเบญจเพสได้อย่างแม่นยำยิ่งยวด"
                </div>
            </div>
        `;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 9: คัมภีร์สุริยยาตร์ & นพเคราะห์สมบูรณ์</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${advancedAstrologyHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 16 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 17: SOULMATE & DIRECTION =================
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 10: วิถีความรักและคู่ครองประจำทิศ</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                
                <div style="font-size:16.5px; line-height: 1.9;">
                    <p style="text-align:justify;">
                        ดวงชะตาชีวิตคู่และการครองเรือน ถูกกำหนดไว้ผ่านตัวแปรเศษดาวกำเนิดจากการคำนวณวันเกิดและปีนักษัตรดวงชะตา ณ ช่วงเวลาถือกำเนิด
                    </p>
                    <p>เศษชะตาชีวิตคู่ของท่านตกเศษที่: <strong>"${remainder}"</strong></p>
                    <div style="background: rgba(212,175,55,0.08); padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37; font-size:16.5px; margin-bottom: 20px;">
                        <strong>ลักษณะและทิศที่อยู่เนื้อคู่:</strong><br>
                        เนื้อคู่ของท่านมักตั้งถิ่นฐานหรือพบเจอกันจากทาง <strong>"${spousePrediction}"</strong>
                    </div>
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 17 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 18: FENG SHUI & FENG SHUI DIRECTIONS =================
    const fengShuiDirections = ["ทิศเหนือ (ส่งเสริมสติปัญญา)", "ทิศใต้ (ส่งเสริมชื่อเสียงบารมี)", "ทิศตะวันออก (ส่งเสริมความอุดมสมบูรณ์)", "ทิศตะวันตก (ส่งเสริมการป้องกันภัย)"];
    const bestDirection = fengShuiDirections[birthYear % 4];
    
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 11: ฮวงจุ้ยทำเลและทิศทางมงคลชะตาชีวิต</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                
                <div style="font-size:16.5px; line-height: 1.9;">
                    <p style="text-align:justify;">
                        ทิศทางมีพลังสะท้อนดวงดาวโดยตรง การนำพลังธาตุฮวงจุ้ยมาปรับตำแหน่งห้องนอน ทิศหัวนอน และประตูบ้าน จะนำมาซึ่งชัยชนะและช่วยเสริมโชคลาภการเงิน
                    </p>
                    <p><strong>ทิศเสริมดวงชะตาเฉพาะตัวของท่าน:</strong> <span style="color:#b8860b; font-weight:bold; font-size:17px;">${bestDirection}</span></p>
                    
                    <h4 style="color:#b8860b; font-size:18px; margin-top:20px; margin-bottom: 8px;">เคล็ดฮวงจุ้ยเสริมชีวิต:</h4>
                    <ul>
                        <li><strong>การตั้งทิศหัวนอน:</strong> ควรหันหัวนอนไปสู่ทิศมงคลของท่านเพื่อรับพลังดีในยามพักผ่อน</li>
                        <li><strong>สีห้องนอนที่ส่งเสริม:</strong> ใช้โทนสีอ่อนของดาวเคราะห์เคราะห์ประจำธาตุ หรือสีทองเพื่อดึงดูดทรัพย์</li>
                        <li><strong>ตำแหน่งโต๊ะทำงาน:</strong> ตั้งเยื้องประตู หลีกเลี่ยงหน้าต่างตรงหลังเพื่อเสริมอำนาจบารมีในการต่อรอง</li>
                    </ul>
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 18 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 19: NAME NUMEROLOGY =================
    let nameAnalysisHtml = "";
    if (typeof NameAnalysis !== 'undefined') {
        const sumName = NameAnalysis.calculate(name);
        const meaning = NameAnalysis.getMeaning(sumName);

        nameAnalysisHtml = `
            <div style="font-size:16.5px; line-height: 1.8;">
                <p>ชื่อ-นามสกุลของมนุษย์แฝงด้วยแรงสั่นสะเทือนของดวงดาวผ่านค่าตัวเลขศาสตร์อักษรไทย:</p>
                <div style="background: rgba(255, 255, 255, 0.02); padding: 15px; border-radius: 8px; border:1.5px solid rgba(212,175,55,0.3); margin-bottom: 20px;">
                    <p style="margin:0; font-size:18px;">เจ้าชะตา: <strong>คุณ${name}</strong></p>
                    <p style="margin:5px 0 0 0; font-weight:bold; color:#b8860b; font-size:17px;">ถอดรหัสผลรวมเลขศาสตร์ดวงดาวได้ผลลัพธ์: ${sumName}</p>
                </div>
                <h4 style="color:#b8860b; font-size:17px; margin:0 0 8px 0;">คำทำนายวิเคราะห์พลังชื่อหลัก:</h4>
                <p style="text-align:justify; background:#fdfaf2; padding:15px; border-radius:8px; border-left:4px solid #b8860b; font-style:italic;">
                    "${meaning || 'ไม่มีรายละเอียดคำพยากรณ์สำหรับเลขศาสตร์ตัวนี้โดยตรงในคัมภีร์หลัก'}"
                </p>
            </div>
        `;
    }

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:20px;">ส่วนที่ 12: เลขศาสตร์ประยุกต์และถอดรหัสคำทำนายชื่อ</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 25px auto;"></div>
                ${nameAnalysisHtml}
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 19 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= NEW SECTION 13: UBAKONG AUSPICIOUS HOURS =================
    const ubakongTimeSlots = [
        { start: "06:00", end: "08:24", nightStart: "18:00", nightEnd: "20:24", label: "ยาม ๑ (เช้า/หัวค่ำ)" },
        { start: "08:25", end: "10:48", nightStart: "20:25", nightEnd: "22:48", label: "ยาม ๒ (สาย/ดึก)" },
        { start: "10:49", end: "13:12", nightStart: "22:49", nightEnd: "01:12", label: "ยาม ๓ (เที่ยง/เที่ยงคืน)" },
        { start: "13:13", end: "15:36", nightStart: "01:13", nightEnd: "03:36", label: "ยาม ๔ (บ่าย/ดึกสงัด)" },
        { start: "15:37", end: "18:00", nightStart: "03:37", nightEnd: "06:00", label: "ยาม ๕ (เย็น/ย่ำรุ่ง)" }
    ];
    const ubakongYarmTable = [
        ["4", "X", "0", "1", "2"], // อาทิตย์
        ["2", "4", "X", "0", "1"], // จันทร์
        ["1", "2", "4", "X", "0"], // อังคาร
        ["0", "1", "2", "4", "X"], // พุธ
        ["X", "0", "1", "2", "4"], // พฤหัสบดี
        ["4", "X", "0", "1", "2"], // ศุกร์
        ["2", "4", "X", "0", "1"]  // เสาร์
    ];
    const ubakongPreds = {
        "4": { icon: "●● ●●", text: "สี่ศูนย์: จะพูนผล มีลาภล้นคณนา เร่งยาตราจะมีชัย (มงคลสูงสุด)", color: "#2e7d32" },
        "2": { icon: "● ●", text: "สองศูนย์: เร่งยาตราจะมีลาภสวัสดี พบผู้ใหญ่เมตตา", color: "#1565c0" },
        "0": { icon: "○", text: "ปลอดศูนย์: พูลสวัสดิ์ภัยพิบัติลาภบ่มี (เสมอตัว ราบรื่น)", color: "#f57f17" },
        "1": { icon: "●", text: "หนึ่งศูนย์: อย่าพึงจร แม้ราญรอยจะอัปราชัย (ติดขัด ชะลอไว้)", color: "#d84315" },
        "X": { icon: "✖", text: "กากบาท: ตัวอัปรีย์ แม้จรลีจะอัปรา (ห้ามเดินทาง/งดทำสัญญา)", color: "#c62828" }
    };

    let ubakongRowsHtml = "";
    ubakongTimeSlots.forEach((slot, sIdx) => {
        const resKey = ubakongYarmTable[dayOfWeek][sIdx];
        const pData = ubakongPreds[resKey];
        ubakongRowsHtml += `
            <tr style="border-bottom: 1px solid #ddd; background: ${sIdx % 2 === 0 ? '#fff' : '#fdfaf2'};">
                <td style="padding: 10px; border: 1px solid #d4af37; font-weight: bold; color: #b8860b;">${slot.label}</td>
                <td style="padding: 10px; border: 1px solid #d4af37; font-size: 13.5px;">${slot.start} - ${slot.end} น. / ${slot.nightStart} - ${slot.nightEnd} น.</td>
                <td style="padding: 10px; border: 1px solid #d4af37; text-align: center; font-weight: bold; font-size: 16px; color: ${pData.color};">${pData.icon}</td>
                <td style="padding: 10px; border: 1px solid #d4af37; font-size: 13.5px; color: ${pData.color}; font-weight: 550;">${pData.text}</td>
            </tr>
        `;
    });

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:15px;">ส่วนที่ 13: คัมภีร์ยามอุบากอง & ฤกษ์ยาตราประจำวันเกิด</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 20px auto;"></div>
                
                <div style="font-size:15px; line-height: 1.8; text-align: justify; margin-bottom: 15px;">
                    <p style="margin-bottom: 8px;">
                        <strong>ยามอุบากอง (ยามยาตราทัพโบราณ):</strong> เป็นคัมภีร์โหราศาสตร์ยามที่ตกทอดมาแต่ครั้งโบราณ ใช้สำหรับคำนวณช่วงเวลาที่ดีที่สุดในแต่ละวันของเจ้าชะตา สำหรับการติดต่อเจรจาธุรกิจ ค้าขาย ออกเดินทาง หรือประกอบพิธีมงคล
                    </p>
                    <p style="margin-bottom: 12px; color: #b8860b; font-weight: bold;">
                        ตารางยามมงคลเฉพาะบุคคลสำหรับผู้เกิดใน <strong>"วัน${DAY_RULERS_LIST[dayOfWeek]}"</strong>:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; border: 2px solid #d4af37; line-height: 1.5;">
                        <thead style="background: #fdfaf2; color: #b8860b;">
                            <tr>
                                <th style="padding: 8px; border: 1.5px solid #d4af37;">ช่วงยาม</th>
                                <th style="padding: 8px; border: 1.5px solid #d4af37;">เวลา (กลางวัน / กลางคืน)</th>
                                <th style="padding: 8px; border: 1.5px solid #d4af37;">สัญลักษณ์</th>
                                <th style="padding: 8px; border: 1.5px solid #d4af37;">ผลการทำนายและฤกษ์ยาตรา</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ubakongRowsHtml}
                        </tbody>
                    </table>
                </div>
                
                <div style="background: #fdfaf2; border-left: 4px solid #b8860b; padding: 12px 15px; font-size: 13.5px; line-height: 1.6; color: #333;">
                    <strong>💡 เคล็ดลับการใช้ยามอุบากองตลอดชีพ:</strong> ในการเจรจาสำคัญหรือเซ็นสัญญา ให้เลือกเริ่มทำในยามที่มีสัญลักษณ์ <strong>"สี่ศูนย์ (●● ●●)"</strong> หรือ <strong>"สองศูนย์ (● ●)"</strong> จะช่วยเปิดทางความสำเร็จ เมตตามหานิยม และได้รับความร่วมมืออันดียิ่ง
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 20 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= NEW SECTION 14: ZODIAC COMPATIBILITY MATRIX =================
    const currentZodName = zodiacs[zodIdx];
    let compRowsHtml = "";
    const allZodiacs = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
    
    allZodiacs.forEach(otherZod => {
        let res = { score: 70, zodiacResult: "เป็นกลาง (ถ้อยทีถ้อยอาศัย)", elementResult: "ธาตุสมดุล", text: "อยู่ร่วมกันได้ดีด้วยความเข้าใจและเคารพซึ่งกันและกัน" };
        if (typeof analyzeCompatibility === 'function') {
            const comp = analyzeCompatibility(currentZodName, otherZod);
            if (comp && !comp.error) res = comp;
        }
        
        let scoreBadgeColor = "#2e7d32";
        if (res.score < 50) scoreBadgeColor = "#c62828";
        else if (res.score < 75) scoreBadgeColor = "#f57f17";

        compRowsHtml += `
            <div style="background: #fdfaf2; border: 1px solid rgba(212,175,55,0.3); border-radius: 6px; padding: 8px 12px; font-size: 13px; line-height: 1.5;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                    <strong style="color: #b8860b; font-size: 14px;">ปี${currentZodName} ↔ ปี${otherZod}</strong>
                    <span style="background: ${scoreBadgeColor}; color: #fff; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">${res.score}% (${res.zodiacResult})</span>
                </div>
                <div style="color: #444; font-size: 12.5px;">${res.elementResult} • ${res.text || 'เกื้อหนุนตามวาสนา'}</div>
            </div>
        `;
    });

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:15px;">ส่วนที่ 14: ตารางวิเคราะห์สมพงษ์ 12 นักษัตรตลอดชีพ</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 20px auto;"></div>
                
                <p style="font-size:14.5px; line-height: 1.7; text-align: justify; margin-bottom: 12px;">
                    ดวงสมพงษ์และปฏิสัมพันธ์ของเจ้าชะตาผู้เกิด <strong>ปี${currentZodName}</strong> เทียบกับบุคคลทั้ง 12 นักษัตร สำหรับใช้ในการคัดเลือกหุ้นส่วนทางธุรกิจ เพื่อนร่วมงาน บุตรบริวาร และคู่ครอง:
                </p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    ${compRowsHtml}
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 21 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= NEW SECTION 15: CHANT & GUARDIAN BLESSINGS =================
    const dayKey = (dayOfWeek === 0 ? 1 : dayOfWeek + 1).toString();
    const dayBlessing = (typeof dayDict !== 'undefined' && dayDict[dayKey]) ? dayDict[dayKey] : {
        name: `วัน${DAY_RULERS_LIST[dayOfWeek]}`,
        power: 10,
        candleText: "บูชาเทียนมงคลตามกำลังวันเกิด",
        dayPrayer: "สวดพระพุทธมนต์พระปริตรประจำวันเกิด เพื่อความร่มเย็นเป็นสุข",
        guardian: "เทพยดาประจำวันเกิดคอยอุปถัมภ์ค้ำชู"
    };

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-color: #FFFFFF !important; color: #111 !important; border: 15px solid #d4af37 !important; padding: 50px 40px !important; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h2 style="color:#b8860b; text-align:center; font-size:24px; margin-top: 0; margin-bottom:15px;">ส่วนที่ 15: คัมภีร์ต่อชะตาชีวิต & พระคาถาบูชาดวงเกิด</h2>
                <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 20px auto;"></div>
                
                <div style="font-size:15px; line-height: 1.85; text-align: justify;">
                    <p style="margin-bottom: 12px;">
                        วิชามหามงคลต่อชะตาชีวิตตามตำราพรหมชาติและพระมหาทักษาปกรณ์ ได้วางระบบการบูชาเทวดาพระเคราะห์ประจำวันเกิด เพื่อหนุนดวงชะตาให้เข้มแข็ง มีตบะบารมี และขจัดปัดเป่าเคราะห์ภัยตลอดการดำเนินชีวิต:
                    </p>

                    <div style="background: #fdfaf2; border: 1.5px solid #d4af37; border-radius: 10px; padding: 18px 20px; margin-bottom: 15px;">
                        <h4 style="color: #b8860b; margin: 0 0 10px 0; font-size: 17px; font-weight: bold;">
                            🌟 เทวดาคุ้มครองชะตาและกำลังพระเคราะห์เกิด:
                        </h4>
                        <p style="margin: 0 0 6px 0;"><strong>🛡️ เทวดาประจำวันเกิด:</strong> ${dayBlessing.guardian}</p>
                        <p style="margin: 0 0 6px 0;"><strong>⚡ กำลังเทวดาพระเคราะห์:</strong> กำลัง ${dayBlessing.power}</p>
                        <p style="margin: 0;"><strong>🕯️ เทียนมงคลบูชาดวง:</strong> ${dayBlessing.candleText}</p>
                    </div>

                    <div style="background: linear-gradient(135deg, #fffcf5, #faf4e6); border: 1px dashed #b8860b; border-radius: 10px; padding: 18px 20px; margin-bottom: 15px;">
                        <h4 style="color: #b8860b; margin: 0 0 8px 0; font-size: 16.5px; font-weight: bold;">
                            📿 พระคาถาบูชาดวงชะตาประจำวันเกิด (สวดเป็นประจำทุกวัน):
                        </h4>
                        <p style="font-size: 15.5px; font-weight: 600; color: #1a0b2e; line-height: 1.8; margin-bottom: 8px;">
                            ${dayBlessing.dayPrayer}
                        </p>
                        <small style="color: #666; display: block; font-style: italic;">
                            (อานุภาพแห่งพระคาถา: ช่วยคุ้มครองป้องกันภัย ปรับสมดุลธาตุในร่างกาย เสริมเมตตามหานิยมและดึงดูดโชคลาภวาสนาแก่เจ้าชะตา)
                        </small>
                    </div>

                    <div style="background: #f4fff6; border: 1px solid #c3e6cb; border-radius: 8px; padding: 12px 16px; font-size: 14px; color: #155724; line-height: 1.6;">
                        <strong>🌿 การทำบุญเสริมดวงชะตาตลอดชีพ:</strong> ควรหมั่นทำบุญปล่อยปลา สวดมนต์ไหว้พระ และตักบาตรตามจำนวนกำลังวันเกิด (กำลัง ${dayBlessing.power}) ในวันคล้ายวันเกิดของตนเอง เพื่อเติมเต็มบุญบารมีและต่ออายุขัยให้ยืนยาวมั่นคง
                    </div>
                </div>
            </div>
            <div style="border-top: 1.5px solid rgba(212,175,55,0.3); padding-top: 15px; text-align: center; font-size: 13px; color: #777;">
                หน้า 22 | รายงานวิเคราะห์ดวงชะตาตลอดชีพ คุณ${name}
            </div>
        </div>
    `;

    // ================= PAGE 20: BACK COVER & FINAL BLESSINGS =================
    htmlContent += `
        <div class="pdf-page cover-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-image: url('../assets/zodiac_bg.png') !important; background-size: cover !important; background-position: center !important; text-align: center; display: block; position: relative; padding: 0; border: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(12, 8, 28, 0.45) !important; z-index: 1; pointer-events: none;"></div>
            <div style="position: absolute; top: 15mm; bottom: 15mm; left: 15mm; right: 15mm; border: 2px solid rgba(212, 175, 55, 0.4); pointer-events: none; z-index: 2;"></div>
            <div style="position: absolute; top: 17mm; bottom: 17mm; left: 17mm; right: 17mm; border: 1px solid rgba(212, 175, 55, 0.2); pointer-events: none; z-index: 2;"></div>

            <div style="position: absolute; top: 180px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center; z-index: 10; padding: 25px; box-sizing: border-box; background: rgba(15, 10, 30, 0.8) !important; border: 1.5px solid rgba(212, 175, 55, 0.45) !important; border-radius: 12px;">
                <div style="color: #FFDF73 !important; font-size: 26px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-bottom: 10px;">
                    มงคลชีวิตพยากรณ์ชั่วกาล
                </div>
                <div style="width: 80px; height: 1px; background: rgba(212,175,55,0.3); margin: 0 auto 15px auto;"></div>
                <div style="color: #E0E0E0 !important; font-size: 16px; line-height: 1.9; font-family: 'Sarabun', sans-serif; text-align: justify; text-indent: 20px;">
                    ดวงดาวเป็นเพียงเครื่องบอกทิศทางหลักของชีวิต แต่ความเพียรและสติของตัวท่านเองคือผู้กุมบังเหียนลิขิตฟ้าที่แท้จริง ขอพลังมงคลแห่งนพเคราะห์คุ้มครองและหนุนนำให้คุณ${name} ประสบความสุขความสำเร็จ ปราศจากโรคภัยไข้เจ็บ บรรลุซึ่งความสมปรารถนาทุกประการเทอญ
                </div>
            </div>

            <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 80%; background: linear-gradient(135deg, rgba(20, 10, 45, 0.85), rgba(10, 5, 25, 0.9)) !important; border: 1.5px solid rgba(212, 175, 55, 0.45) !important; padding: 22px 25px; border-radius: 12px; text-align: center; box-shadow: 0 12px 30px rgba(0,0,0,0.95); z-index: 10;">
                <div style="font-size: 16px; color: #E0E0E0 !important; line-height: 1.9;">
                    <div style="color: #FFDF73 !important; font-size: 20px; font-weight: 700; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                        สอบถามข้อมูลเพิ่มเติมหรือติดตามผลดวง
                    </div>
                    <div style="width: 80px; height: 1px; background: rgba(212,175,55,0.3); margin: 0 auto 12px auto;"></div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 6px; text-align: left; padding: 0 20px; font-size: 15.5px;">
                        <div><strong style="color: #D4AF37 !important; margin-right: 8px;"><i class="fab fa-line"></i> Line ID:</strong> @siamhora</div>
                        <div><strong style="color: #D4AF37 !important; margin-right: 8px;"><i class="fab fa-facebook"></i> Facebook:</strong> สยามโหรามงคล</div>
                        <div><strong style="color: #D4AF37 !important; margin-right: 8px;"><i class="fas fa-phone-alt"></i> เบอร์โทรศัพท์:</strong> 094-392-6453</div>
                    </div>
                </div>
            </div>

            <div style="position: absolute; bottom: 40px; left: 0; width: 100%; text-align: center; z-index: 10;">
                <div style="font-size: 13px; color: rgba(255, 255, 255, 0.35) !important; letter-spacing: 1px;">
                    ขอบพระคุณที่ร่วมเดินทางไปกับสยามโหรามงคล 🌌 ขอให้ท่านเจริญรุ่งเรืองมั่นคง
                </div>
            </div>
        </div>
    `;

    // Inject final layout into preview area
    const previewArea = document.getElementById('previewArea');
    previewArea.style.display = 'block';
    
    const navHTML = `
        <div id="lifetimePdfPreviewNav" style="position: sticky; top: 0; background: rgba(20, 15, 35, 0.95); backdrop-filter: blur(10px); padding: 15px 30px; border-bottom: 1px solid rgba(212,175,55,0.3); border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="color: #FFDF73; font-size: 20px; font-weight: bold;">
                <i class="fas fa-eye"></i> พรีวิวพยากรณ์ดวงชะตาชั่วชีวิต (20 หน้า A4 สมบูรณ์แบบ)
            </div>
            <div>
                <button onclick="window.print()" style="background: linear-gradient(135deg, #d4af37, #f39c12); color: #111; font-weight: bold; font-size: 16px; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(212,175,55,0.4); transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-file-download"></i> บันทึกเป็น PDF
                </button>
            </div>
        </div>
    `;

    const styleBlock = `
        <style id="ltPrintStyle">
            @media print {
                @page {
                    size: A4 portrait;
                    margin: 0;
                }
                html, body {
                    width: 100%;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #fff !important;
                }
                .pdf-page {
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: space-between !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    max-height: 297mm !important;
                    margin: 0 !important;
                    padding: 50px 40px !important;
                    box-sizing: border-box !important;
                    page-break-after: always !important;
                    border: 15px solid #d4af37 !important;
                    background-color: #FFFFFF !important;
                    color: #111 !important;
                }
                .pdf-page.cover-page {
                    border: none !important;
                    color: #fff !important;
                }
                .card-report {
                    background: #fff !important;
                    color: #111 !important;
                    border: none !important;
                    padding: 0 !important;
                    margin-bottom: 15px !important;
                }
            }
            @media screen {
                .pdf-page {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
                    margin: 20px auto !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    box-sizing: border-box !important;
                    background-color: #FFFFFF !important;
                    border: 15px solid #D4AF37 !important;
                    color: #111 !important;
                    padding: 50px 40px !important;
                }
                .pdf-page.cover-page {
                    background-position: center !important;
                    border: 15px solid #1a0b2e !important;
                    color: #FFF !important;
                    padding: 0 !important;
                    position: relative;
                }
                .card-report {
                    background: #fdfaf2 !important;
                    color: #222 !important;
                    border: 1px solid rgba(212,175,55,0.3);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }
            }
        </style>
    `;

    previewArea.innerHTML = navHTML + styleBlock + `<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">${htmlContent}</div>`;

    // Render the Canvas wheel chart inside Page 6 after inserting into DOM
    setTimeout(() => {
        const canvas = document.getElementById(tempCanvasId);
        if (canvas) {
            drawChartOnCanvas(canvas, lagnaIdx, pl);
        }
    }, 100);
}

function drawChartOnCanvas(canvas, lagnaIdx, pl) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = W / 2 - 8;

    ctx.clearRect(0, 0, W, H);

    // Draw background
    ctx.fillStyle = '#0f0a1c';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fill();

    // Draw lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.72, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw 12 divisions
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
        ctx.strokeStyle = 'rgba(212,175,55,0.4)';
        ctx.stroke();
    }

    // Add zodiac labels and planets
    const RASI_TH = ['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
    const planetsList = [
        { name: '๑', lon: pl.sun.lon },
        { name: '๒', lon: pl.moon.lon },
        { name: '๓', lon: pl.mars.lon },
        { name: '๔', lon: pl.mer.lon },
        { name: '๕', lon: pl.jup.lon },
        { name: '๖', lon: pl.ven.lon },
        { name: '๗', lon: pl.sat.lon },
        { name: '๘', lon: pl.rahu.lon },
        { name: '๙', lon: pl.ketu.lon }
    ];

    ctx.fillStyle = '#FFDF73';
    ctx.font = 'bold 11px Sarabun';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw house names
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 75) * Math.PI / 180;
        const textX = cx + (R * 0.85) * Math.cos(angle);
        const textY = cy + (R * 0.85) * Math.sin(angle);
        ctx.fillText(RASI_TH[i], textX, textY);
    }

    // Draw Ascendant Lagna (ล)
    const lagnaAngle = (lagnaIdx * 30 - 75) * Math.PI / 180;
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Sarabun';
    ctx.fillText('ล', cx + (R * 0.5) * Math.cos(lagnaAngle), cy + (R * 0.5) * Math.sin(lagnaAngle));

    // Draw Planets
    planetsList.forEach(p => {
        const pSign = degToSign(p.lon);
        const angle = (pSign * 30 - 75) * Math.PI / 180;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Sarabun';
        const offsetR = R * 0.45;
        ctx.fillText(p.name, cx + offsetR * Math.cos(angle), cy + offsetR * Math.sin(angle));
    });
}
