


document.addEventListener('DOMContentLoaded', () => {
    // Populate Provinces
    

    // Populate Members
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    const memberSelect = document.getElementById('vipMemberSelect');
    memberSelect.innerHTML = '<option value="">-- เลือกจากฐานข้อมูลลูกค้า --</option>';
    allHistory.filter(m => m.name).forEach((m) => {
        let realIdx = allHistory.indexOf(m);
        memberSelect.innerHTML += `<option value="${realIdx}">${m.name} (${m.birthdate || 'ไม่ระบุวันเกิด'})</option>`;
    });
});

window.autoFillVipMember = function(idx) {
    if (idx === '') return;
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    let m = allHistory[idx];
    if (m) {
        document.getElementById('vipName').value = m.name || '';
        document.getElementById('vipIdCard').value = m.idCard || '';
        
        if (m.birthdate) {
            let parts = m.birthdate.split('/');
            if (parts.length === 3) {
                let y = parseInt(parts[2]);
                if (y > 2400) y -= 543;
                let dStr = `${y}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                document.getElementById('vipDobDate').value = dStr;
            }
        }
        
        if (m.birthtime) {
            document.getElementById('vipDobTime').value = m.birthtime;
        }
        
        if (m.province) {
            document.getElementById('vipLocation').value = m.province || m.location || '';
        }
    }
}
function generateAstrologicalDailyFortune(dobObj, targetDateObj) {
    // 1. ทักษาจรรายวัน (Daily Taksa)
    // ลำดับทักษา: อาทิตย์(0), จันทร์(1), อังคาร(2), พุธ(3), เสาร์(6), พฤหัส(4), ศุกร์(5)
    const taksaOrder = [0, 1, 2, 3, 6, 4, 5];
    const birthDay = dobObj.getDay();
    const targetDay = targetDateObj.getDay();

    const birthIndex = taksaOrder.indexOf(birthDay);
    const targetIndex = taksaOrder.indexOf(targetDay);
    const diff = (targetIndex - birthIndex + 7) % 7;

    // 2. ปรากฏการณ์ข้างขึ้น-ข้างแรมของวันเป้าหมาย
    let lunarPhase = "ขึ้น";
    if (typeof getThaiLunar === 'function') {
        const lunar = getThaiLunar(targetDateObj);
        if (lunar) lunarPhase = lunar.lunarPhase; // "ขึ้น" หรือ "แรม"
    }

    // 3. กำหนดคำทำนายตามความสัมพันธ์ทักษาและดิถีจันทร์
    let wText = "", fText = "", lText = "";

    // พลังงานของดิถี
    const moonEnergy = (lunarPhase === "ขึ้น") ? "พลังงานกำลังพุ่งทะยาน เหมาะแก่การเริ่มต้น" : "พลังงานชะลอตัว ควรเน้นสะสมและทบทวน";

    switch (diff) {
        case 0: // บริวาร (ครอบครัว/ลูกน้อง)
            wText = `การงานราบรื่น ได้รับความร่วมมือจากทีมงานและลูกน้องเป็นอย่างดี ${moonEnergy}`;
            fText = `มีค่าใช้จ่ายเกี่ยวกับคนในครอบครัวหรือบริวาร แต่ก็มีรายรับเข้ามาเรื่อยๆ ไม่ขัดสน`;
            lText = `คนมีคู่ความรักอบอุ่น เข้าใจกัน คนโสดมีโอกาสพบรักจากคนใกล้ตัวหรือเพื่อนแนะนำ`;
            break;
        case 1: // อายุ (สุขภาพ/ความราบรื่น)
            wText = `งานที่คั่งค้างจะได้รับการสะสางให้เสร็จสิ้น ปัญหาที่เคยกวนใจจะคลี่คลายลง`;
            fText = `สถานะการเงินมั่นคง หากมีหนี้สินจะหาทางเจรจาหรือจัดการได้อย่างลงตัว`;
            lText = `ความรักเรียบง่าย ไม่หวือหวาแต่มั่นคง ควรดูแลสุขภาพของคนรักเป็นพิเศษ`;
            break;
        case 2: // เดช (อำนาจ/ตำแหน่ง)
            wText = `✨ โดดเด่นมาก! ศัตรูพ่ายแพ้ มีโอกาสได้แสดงผลงานหรือรับมอบหมายโปรเจกต์สำคัญ เจ้านายจับตามองในทางที่ดี`;
            fText = `มีเกณฑ์ได้รับเงินก้อนจากการเจรจาต่อรอง หรือการเป็นนายหน้า ตัวแทน`;
            lText = `คุณจะมีเสน่ห์ดึงดูดและมีความมั่นใจสูง ระวังการใช้อารมณ์ตัดสินปัญหาชีวิตคู่`;
            break;
        case 3: // ศรี (โชคลาภ/เงินทอง)
            wText = `ดวงการงานเปิดกว้าง ทำอะไรก็สำเร็จลุล่วงด้วยดี มีคนคอยสนับสนุนทุกทิศทาง`;
            fText = `💰 วันนี้เด่นเรื่องเงินทอง! มีโชคลาภจากการเสี่ยง หรือได้รับเงินพิเศษที่รอคอยมานาน`;
            lText = `ความรักสดใส คนโสดมีเสน่ห์ดึงดูดเพศตรงข้าม คนมีคู่จะได้รับของขวัญถูกใจ`;
            break;
        case 4: // มูละ (ทรัพย์สิน/ความมั่นคง)
            wText = `งานที่เกี่ยวข้องกับอสังหาริมทรัพย์ หรือโปรเจกต์ระยะยาวจะส่งผลดีเป็นพิเศษ`;
            fText = `การเงินหนักแน่นมั่นคง เหมาะสำหรับการนำเงินไปลงทุนหรือซื้อสินทรัพย์ชิ้นใหญ่`;
            lText = `ความสัมพันธ์พัฒนาไปอีกขั้น อาจมีการพูดคุยถึงอนาคตหรือการสร้างครอบครัวร่วมกัน`;
            break;
        case 5: // อุตสาหะ (ความเหน็ดเหนื่อย/ความพยายาม)
            wText = `🧱 เป็นวันที่ต้องลุยด้วยตัวเอง อาศัยคนอื่นไม่ได้ แต่ความพยายามจะส่งผลสำเร็จอย่างงดงามแน่นอน`;
            fText = `ได้เงินมาจากน้ำพักน้ำแรงล้วนๆ ไม่มีโชคลาภลอยเข้ามา ควรระวังรายจ่ายจุกจิก`;
            lText = `อาจไม่มีเวลาให้กันมากนักเพราะต่างคนต่างยุ่งกับหน้าที่การงาน ควรหาเวลาทักทายกันบ้าง`;
            break;
        case 6: // มนตรี (ผู้ใหญ่อุปถัมภ์) & กาลกิณี (บางตำราใช้ 7 ตำแหน่ง)
            wText = `ผู้ใหญ่หรือเจ้านายจะให้ความเมตตา หากติดขัดปัญหาใดให้เข้าหาผู้ใหญ่จะได้รับการช่วยเหลือทันที`;
            fText = `มีคนคอยช่วยเหลือเรื่องการเงิน หรือได้รับอนุมัติสินเชื่อ/แหล่งทุนตามที่หวัง`;
            lText = `ความรักอยู่ในเกณฑ์ดี ผู้ใหญ่ของทั้งสองฝ่ายให้การสนับสนุนและเอ็นดู`;
            break;
    }

    return { wText, fText, lText };
}

function generateVIPReport() {
    const name = document.getElementById('vipName').value.trim();
    const idCard = document.getElementById('vipIdCard') ? document.getElementById('vipIdCard').value.replace(/[^0-9]/g, '') : '';
    const dobDate = document.getElementById('vipDobDate').value;
    const dobTime = document.getElementById('vipDobTime').value;
    const location = document.getElementById('vipLocation').value.trim();
    const targetMonthStr = document.getElementById('vipTargetMonth').value; // YYYY-MM

    if (!name || !dobDate || !targetMonthStr) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน โดยเฉพาะชื่อ วันเกิด และเดือนที่ต้องการทำนาย");
        return;
    }

    // Now generating HTML directly for preview

    const dobObj = new Date(dobDate);
    const dobTimestamp = dobObj.getTime();

    // Lunar
    let lunarText = "-";
    if (typeof getThaiLunar === 'function') {
        const lunarObj = getThaiLunar(dobObj);
        if (lunarObj) {
            const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
            const dow = daysTh[dobObj.getDay()];
            lunarText = `วัน${dow} เดือน ${lunarObj.month} ปี${lunarObj.zodiac} (${lunarObj.phase} ${lunarObj.amount} ค่ำ)`;
        }
    }
    const dobThStr = dobObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

    const [tYear, tMonth] = targetMonthStr.split('-').map(Number);
    const targetDateObj = new Date(tYear, tMonth - 1, 1);
    const monthNameTh = targetDateObj.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

    // Days in month
    const daysInMonth = new Date(tYear, tMonth, 0).getDate();


    let htmlContent = '';

    // Page 1: Cover
    htmlContent += `
        <div class="pdf-page cover-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-image: url('assets/mystical_astrology_cover.png') !important; background-size: cover !important; background-position: center !important; text-align: center; display: block; position: relative; padding: 0; border: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
            
            <!-- Top Banner Content (Positions text precisely in the dark banner of the image) -->
            <div style="position: absolute; top: 140px; left: 0; width: 100%; text-align: center; z-index: 10;">
                <div style="color: #D4AF37 !important; font-size: 24px; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                    รายงานดวงชะตา Exclusive VIP
                </div>
                <div style="color: #FFDF73 !important; font-size: 45px; font-weight: bold; margin-top: 10px; text-shadow: 3px 3px 8px rgba(0,0,0,0.9);">
                    คุณ${name}
                </div>
            </div>

            <!-- Center Content (Avoids the zodiac wheel by sitting below it or using a strong backdrop) -->
            <div style="position: absolute; top: 450px; left: 50%; transform: translateX(-50%); width: 90%; z-index: 10; background: rgba(0, 0, 0, 0.6) !important; padding: 25px 0; border-radius: 20px; border-top: 2px solid rgba(212, 175, 55, 0.5) !important; border-bottom: 2px solid rgba(212, 175, 55, 0.5) !important; box-shadow: 0 5px 20px rgba(0,0,0,0.8);">
                <div style="color: #FFDF73 !important; font-size: 70px; font-weight: bold; text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 3px 3px 10px rgba(0,0,0,0.9);">คำทำนายดวงชะตา</div>
                <div style="color: #E6C27A !important; font-size: 28px; letter-spacing: 3px; margin-top: 10px; text-shadow: 2px 2px 6px rgba(0,0,0,0.9);">ประจำเดือน ${monthNameTh}</div>
            </div>

            <!-- Bottom Content (Glassmorphism box for details) -->
            <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 80%; background: rgba(20, 10, 40, 0.85) !important; border: 2px solid #D4AF37 !important; padding: 30px; border-radius: 20px; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.9); z-index: 10;">
                <div style="font-size: 22px; color: #FFF !important; line-height: 1.8;">
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เกิด:</strong> วันที่ ${dobThStr}</p>
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">ตรงกับ:</strong> ${lunarText}</p>
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เวลาตกฟาก:</strong> ${dobTime || 'ไม่ระบุ'}</p>
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">สถานที่เกิด:</strong> ${location || 'ไม่ระบุ'}</p>
                </div>
            </div>

            <!-- Bottom Plaque Area -->
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; text-align: center; z-index: 10;">
                <div style="font-size: 16px; color: #AAA !important; text-shadow: 0 0 30px rgba(255, 196, 0, 0.8), 3px 3px 10px rgb(255, 255, 255) !important;">
                    จัดทำโดย สยามโหรามงคล ${tYear + 543} (สงวนลิขสิทธิ์เฉพาะคุณ${name}เท่านั้น)
                </div>
            </div>
        </div>
    `;
    // Page 1.5: Table of Contents
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 60px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
            <h2 style="color: #B8860B; font-size: 40px; text-align: center; margin-bottom: 50px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px;">สารบัญ (Table of Contents)</h2>
            
            <div style="font-size: 24px; line-height: 2.2; color: #4a235a; flex-grow: 1; padding: 0 40px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>พื้นดวงชะตา (ลัคนาพยากรณ์)</span><span>หน้า 3</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>คัมภีร์มหาทักษาสัตตเลข</span><span>หน้า 4</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>กราฟชีวิต (12 เรือน)</span><span>หน้า 5</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>ไพ่ยิปซีพยากรณ์ (10 ใบ)</span><span>หน้า 6</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>ปฏิทินจันทรคติ และฤกษ์มงคล (30 วัน)</span><span>หน้า 7</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>คำทำนายรายวันตลอดเดือน</span><span>หน้า 8 - ${daysInMonth + 7}</span></div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; margin-bottom: 15px;"><span>บทสรุปประจำเดือน และเลขมงคล</span><span>หน้า ${daysInMonth + 8}</span></div>
            </div>
            
            <div style="text-align: center; margin-top: auto;">
                <div style="font-size: 80px; color: #D4AF37; opacity: 0.3;">✨</div>
            </div>
        </div>
    `;

    // Page 2: Ascendant (ลัคนาพยากรณ์)
    let ascHtml = "";
    if (typeof ascCalcLagna === 'function' && typeof ASC_CITY_LIST !== 'undefined' && typeof ZODIAC_DATA !== 'undefined') {
        const city = ASC_CITY_LIST.find(c => c.name === location) || ASC_CITY_LIST[0];
        const ascResult = ascCalcLagna(dobObj.toISOString().split('T')[0], dobTime, city.lat, city.lng);
        const zData = ZODIAC_DATA[ascResult.rasi];

        ascHtml = `
            <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                <div style="color: #B8860B; font-size: 36px; text-align: center; margin-bottom: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: bold; ">พื้นดวงชะตา (ลัคนาพยากรณ์)</div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 80px; margin-bottom: 10px;">${zData.icon}</div>
                    <div style="font-size: 28px; color: #D4AF37; font-weight: bold;">ลัคนาสถิตราศี${zData.name}</div>
                    <div style="font-size: 18px; color: #777;">(${zData.element})</div>
                </div>

                <div style="font-size: 20px; line-height: 1.8; background: #FFF9E6; padding: 30px; border-radius: 10px; border: 2px solid #E6C27A; flex-grow: 1;">
                    <div style="color: #B8860B; font-size: 24px; margin-bottom: 15px; font-weight: bold; ">ลักษณะนิสัยโดยทั่วไป</div>
                    <p style="margin-bottom: 20px; color: #4a235a;">${zData.desc}</p>
                    
                    <div style="color: #B8860B; font-size: 24px; margin-bottom: 15px; font-weight: bold; ">จุดเด่น</div>
                    <p style="margin-bottom: 20px; color: #4a235a;">${Array.isArray(zData.strengths) ? zData.strengths.join(', ') : zData.strengths}</p>
                    
                    <div style="color: #B8860B; font-size: 24px; margin-bottom: 15px; font-weight: bold; ">ข้อควรระวัง</div>
                    <p style="margin-bottom: 20px; color: #4a235a;">${Array.isArray(zData.weaknesses) ? zData.weaknesses.join(', ') : zData.weaknesses}</p>
                    
                    <div style="color: #B8860B; font-size: 24px; margin-bottom: 15px; font-weight: bold; ">การเงินและการงาน</div>
                    <p style="color: #4a235a;">${zData.career}</p>
                </div>
            </div>
        `;
    }
    htmlContent += ascHtml;

    // Page 3: Taksa 7-Digits (คัมภีร์มหาทักษาสัตตเลข)
    let sdHtml = "";
    let sdGlobalRows = null;
    let sdDayNum = dobObj.getDay();
    if (typeof getThaiLunar === 'function') {
        const lObj = getThaiLunar(dobObj);
        if (lObj) {
            let mMatch = lObj.month.match(/\d+/);
            let sdMonth = mMatch ? parseInt(mMatch[0]) : 5;
            const zodiacs = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
            let sdYear = zodiacs.indexOf(lObj.zodiac);
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

            const posNames = [
                ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
                ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
                ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
            ];
            const base4Names = ["กำลังพระเคราะห์", "ฐานบวก"];

            let tableHtml = `<table style="width:100%; text-align:center; border-collapse:collapse; margin-bottom:10px;">`;
            for (let r = 0; r < 3; r++) {
                tableHtml += `<tr>`;
                for (let c = 0; c < 7; c++) {
                    tableHtml += `<td style="padding:5px; border:1px solid #E6C27A;">
                        <div style="font-size:12px; color:#6b5b95;">${posNames[r][c]}</div>
                        <div style="font-size:24px; font-weight:bold; color:#4a235a;">${globalRows[r][c]}</div>
                    </td>`;
                }
                tableHtml += `</tr>`;
            }
            tableHtml += `<tr style="background:#FFF9E6;">`;
            for (let c = 0; c < 7; c++) {
                tableHtml += `<td style="padding:5px; border:1px solid #E6C27A; border-top:3px solid #D4AF37;">
                    <div style="font-size:12px; color:#B8860B;">ฐานที่ 4</div>
                    <div style="font-size:24px; font-weight:bold; color:#D4AF37;">${globalRows[3][c]}</div>
                </td>`;
            }
            tableHtml += `</tr></table>`;

            let analysisHtml = "";
            if (typeof analyzeSevenDigits === 'function') {
                const analysis = analyzeSevenDigits(globalRows[3]);
                const luckScore = calculateLuckScore(globalRows[3]);
                const stars = analyzeStars(globalRows[3]);
                const mahaBot = getMahaBot(globalRows[3][0], globalRows[0][0]);

                analysisHtml = `
                    <div style="font-size: 16px; line-height: 1.5; background: #FFF; padding: 15px; border-radius: 10px; border: 2px solid #E6C27A; color: #4a235a; margin-bottom: 5px;">
                        <div style="font-size: 20px; color: #D4AF37; font-weight:bold; text-align:center; margin-bottom:10px;">คะแนนดวง: ${luckScore} / 100</div>
                        <div style="margin-bottom: 10px;"><strong>🌟 ดาวเด่น:</strong> ${stars.goodStars.join(", ")}</div>
                        <div style="margin-bottom: 10px;"><strong>⚠️ จุดต้องระวัง:</strong> ${stars.badStars.length > 0 ? stars.badStars.join(", ") : "ไม่มีดาวเสียที่เด่นชัด"}</div>
                        <div style="margin-bottom: 5px;"><strong>🔮 มหาบท (ภพแรก):</strong> ตกภพ ${mahaBot.name} - ${mahaBot.meaning}</div>
                    </div>
                `;
            }


            // ==========================================
            // PAGE A: Identity (Lagna, Element, Lucky Colors, Clash)
            // ==========================================
            let elementText = "ไม่ทราบ";
            let elementDesc = "ไม่มีข้อมูล";
            if (typeof getBirthElement === 'function') {
                const dE = getBirthElement(dobObj.getDay());
                elementText = dE.name + " " + (dE.level || '');
                elementDesc = dE.desc || '';
            }

            let luckyColors = "แดง, ชมพู";
            let badColors = "ฟ้า";
            const dayWk = dobObj.getDay();
            const luckyCArr = ["แดง, ชมพู", "เขียว, ม่วง", "ส้ม, ดำ", "เทา, ฟ้า", "แดง, น้ำเงิน", "ชมพู, ขาว", "ดำ, ม่วง"];
            const badCArr = ["ฟ้า", "แดง", "เหลือง", "ชมพู", "ดำ", "ม่วง", "เขียว"];
            luckyColors = luckyCArr[dayWk];
            badColors = badCArr[dayWk];

            let currentCeYear = parseInt(targetMonthStr.split("-")[0]);
            let clashText = "ปีนี้ดวงชะตาของท่าน <strong>ไม่ตกปีชง</strong> สามารถดำเนินชีวิตได้อย่างราบรื่น ทำบุญเสริมดวงตามปกติ";
            if (typeof ycAnalyze === 'function' && typeof ycBirthYearToZodiac === 'function') {
                const zObj = ycBirthYearToZodiac(dobObj.getFullYear());
                const ycResult = ycAnalyze(zObj.id, currentCeYear);
                if (ycResult.severity === 'warn' || ycResult.severity === 'danger') {
                    clashText = `ปีนี้ดวงชะตาของท่านตก <strong>${ycResult.relation}</strong> <br><strong>คำแนะนำ:</strong> ${ycResult.prediction}`;
                } else if (ycResult.severity === 'good') {
                    clashText = `ปีนี้ดวงชะตาของท่าน <strong>${ycResult.relation}</strong> ส่งเสริมให้เจริญก้าวหน้า <br><strong>คำอธิบาย:</strong> ${ycResult.prediction}`;
                }
            }

            let page1Html = `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                    
                    <div style="color: #B8860B; font-size: 26px; text-align: center; margin-bottom: 8px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">คัมภีร์มหาทักษาสัตตเลข (๗ ตัว ๔ ฐาน)</div>
                    ${tableHtml}
                    ${analysisHtml}

                    <div style="color: #B8860B; font-size: 24px; text-align: center; margin-top: 10px; margin-bottom: 8px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">พลังธาตุเจ้าเรือน</div>
                    <div style="font-size: 14px; line-height: 1.6; background: #FFF; padding: 10px 15px; border-radius: 10px; border: 2px solid #E6C27A;">
                        <div style="text-align: center; margin-bottom: 8px;">
                            <div style="font-size: 20px; color: #D4AF37; font-weight: bold;">ผู้ที่เกิด${elementText}</div>
                        </div>
                        <p style="margin-bottom: 10px; color: #4a235a;"><strong>ความหมาย:</strong> ${elementDesc.split("จุดแข็ง")[0].replace("ความหมายของธาตุ", "").trim()}</p>
                    </div>

                    <div style="color: #B8860B; font-size: 24px; text-align: center; margin-top: 10px; margin-bottom: 8px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">เคล็ดลับเสริมดวง & ปีชง ${currentCeYear + 543}</div>
                    <div style="display: flex; gap: 20px; align-items: stretch; flex-grow: 1;">
                        <div style="flex: 1; font-size: 14px; line-height: 1.5; background: #FFF; padding: 10px 15px; border-radius: 10px; border: 2px solid #E6C27A;">
                            <div style="color: #B8860B; font-size: 16px; margin-bottom: 5px; font-weight: bold; ">สีเสื้อมงคลประจำวันเกิด</div>
                            <p style="margin-bottom: 5px; color: #28a745;"><strong>✅ สีที่ช่วยเสริมดวง:</strong> ${luckyColors}</p>
                            <p style="margin-bottom: 10px; color: #dc3545;"><strong>❌ สีต้องห้าม (กาลกิณี):</strong> ${badColors}</p>
                        </div>
                        <div style="flex: 1; font-size: 14px; line-height: 1.5; background: #FFF; padding: 10px 15px; border-radius: 10px; border: 2px solid #E6C27A;">
                            <div style="color: #B8860B; font-size: 16px; margin-bottom: 5px; font-weight: bold; ">สถานะปีชง</div>
                            <p style="margin-bottom: 5px; color: #4a235a; font-size: 14px; font-weight: bold;">${clashText}</p>
                        </div>
                    </div>
                </div>
            `;

            // ==========================================
            // PAGE B: Numerology & Taksa Chart
            // ==========================================
            let nameSum = 0; let idSum = 0;
            const thaiToNum = (char) => { if (typeof getThaiBycodeValue === 'function') return getThaiBycodeValue(char); return 1; };
            let cleanName = name.replace(/[^ก-ฮ]/g, '');
            for (let char of cleanName) nameSum += thaiToNum(char);
            for (let char of idCard) { if (/[0-9]/.test(char)) idSum += parseInt(char); }
            let nameScore = nameSum > 0 ? (nameSum % 9 || 9) : 0;
            let idScore = idSum > 0 ? (idSum % 9 || 9) : 0;

            let namePlanetDesc = ""; let idPlanetDesc = "";
            if (typeof ThaiAstrologyData !== 'undefined' && ThaiAstrologyData.PLANETS_DATA) {
                const nPlanet = ThaiAstrologyData.PLANETS_DATA[nameScore];
                if (nPlanet) namePlanetDesc = `(ดาว${nPlanet.name} ${nPlanet.symbol} ส่งผลให้: ${nPlanet.character})`;
                const iPlanet = ThaiAstrologyData.PLANETS_DATA[idScore];
                if (iPlanet) idPlanetDesc = `(ดาว${iPlanet.name} ${iPlanet.symbol} ส่งผลให้: ${iPlanet.character})`;
            }

            let idCardHtml = "";
            if (idCard && idCard.length >= 10) {
                idCardHtml = `
                    <hr style="border-top: 1px dashed #E6C27A; margin: 10px 0;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 28px; color: #D4AF37; font-weight: bold;">บัตรประจำตัวประชาชน</div>
                        <div style="font-size: 22px; color: #4a235a; margin-top: 5px;">"${idCard}"</div>
                        <div style="font-size: 20px; color: #B8860B; margin-top: 5px;">ผลรวมเลขศาสตร์: <strong>${idSum}</strong> (กำลังดาว ${idScore})</div>
                        <div style="font-size: 16px; color: #4a235a; margin-top: 5px;">${idPlanetDesc}</div>
                    </div>
                `;
            }

            let page2Html = `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                    
                    <div style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">วิเคราะห์เลขศาสตร์ (Numerology)</div>
                    <div style="font-size: 18px; line-height: 1.6; background: #FFF; padding: 20px; border-radius: 10px; border: 2px solid #E6C27A; margin-bottom: 15px;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <div style="font-size: 28px; color: #D4AF37; font-weight: bold;">ชื่อ-นามสกุล</div>
                            <div style="font-size: 22px; color: #4a235a; margin-top: 5px;">"${name}"</div>
                            <div style="font-size: 20px; color: #B8860B; margin-top: 5px;">ผลรวมเลขศาสตร์: <strong>${nameSum > 0 ? nameSum : '-'}</strong> (กำลังดาว ${nameScore})</div>
                            <div style="font-size: 16px; color: #4a235a; margin-top: 5px;">${namePlanetDesc}</div>
                        </div>
                        ${idCardHtml}
                        <div style="margin-top: 10px; padding: 10px; background: rgba(212, 175, 55, 0.1); border-radius: 10px; color: #4a235a; font-size: 16px; text-align: center;">
                            <p style="margin: 0;"><strong>ความหมายอายตนะ 6:</strong> พลังของตัวเลขส่งผลต่อการดึงดูดสิ่งต่างๆ เข้ามาในชีวิต ดวงดาวประจำตัวเลขจะเป็นตัวแทนพลังงานหลักของคุณ</p>
                        </div>
                    </div>

                    <div style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">มหาทักษากำเนิด (Classic Taksa Chart)</div>
                    <div style="font-size: 18px; line-height: 1.6; background: #FFF; padding: 20px; border-radius: 10px; border: 2px solid #E6C27A; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                        <div style="color: #B8860B; font-size: 22px; margin-bottom: 15px; font-weight: bold; text-align: center; ">ดวงดาวที่ให้คุณและโทษโดยกำเนิด</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: rgba(40, 167, 69, 0.1); padding: 15px; border-radius: 8px;">
                                <strong style="color: #28a745; font-size: 20px;">🌟 ศรี (โชคลาภ)</strong><br>ดาวที่ส่งเสริมเงินทองและความสุข
                            </div>
                            <div style="background: rgba(23, 162, 184, 0.1); padding: 15px; border-radius: 8px;">
                                <strong style="color: #17a2b8; font-size: 20px;">🛡️ เดช (อำนาจ)</strong><br>ดาวที่ส่งเสริมความเคารพยำเกรง
                            </div>
                            <div style="background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 8px;">
                                <strong style="color: #b8860b; font-size: 20px;">🤝 มนตรี (อุปถัมภ์)</strong><br>ดาวที่นำพาคนมาช่วยเหลือสนับสนุน
                            </div>
                            <div style="background: rgba(220, 53, 69, 0.1); padding: 15px; border-radius: 8px;">
                                <strong style="color: #dc3545; font-size: 20px;">⚠️ กาลกิณี (อุปสรรค)</strong><br>ดาวที่เป็นข้อควรระวังในชีวิต
                            </div>
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: rgba(212, 175, 55, 0.1); border-radius: 10px; color: #4a235a; font-size: 16px; text-align: center;">
                            <p style="margin: 0;">ตำรามหาทักษากำเนิด ถือเป็นวิชาสำคัญของโหราศาสตร์ไทย ที่ใช้ตรวจสอบจุดแข็งและจุดอ่อนของบุคคล</p>
                        </div>
                    </div>
                </div>
            `;

            // ==========================================
            // PAGE C: Life Graph
            // ==========================================
            let d = dobObj.getDay() + 1; // 1=Sun
            let gm = (dobObj.getMonth() + 2) % 12; if (gm === 0) gm = 12;
            let yearThai = dobObj.getFullYear();
            if (dobObj.getMonth() < 3) yearThai -= 1;
            let y = (yearThai - 1983) % 12; if (y <= 0) y += 12;
            const pts = Array.from({ length: 12 }, (_, i) => { let v = (d + gm + y + i) % 7; return v === 0 ? 7 : v; });
            const labels = ["วาสนา", "ทรัพย์", "เพื่อน", "ญาติ", "บริวาร", "ศัตรู", "คู่ครอง", "โรคภัย", "ความสุข", "การงาน", "ลาภยศ", "หายนะ"];
            let boxes = "";
            for (let i = 0; i < 12; i++) {
                let color = pts[i] >= 5 ? "#28a745" : (pts[i] <= 2 ? "#dc3545" : "#B8860B");
                boxes += `
                    <div style="border: 2px solid ${color}; border-radius: 8px; padding: 15px; text-align: center; background: #FFF9E6;">
                        <div style="font-size: 16px; color: #6b5b95;">${labels[i]}</div>
                        <div style="font-size: 32px; font-weight: bold; color: ${color};">${pts[i]}</div>
                    </div>
                `;
            }
            let page3Html = `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                    <div style="color: #B8860B; font-size: 36px; text-align: center; margin-bottom: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: bold; ">กราฟชีวิต ๑๒ ตำแหน่ง (Life Graph)</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; flex-grow: 1;">
                        ${boxes}
                    </div>
                    <div style="margin-top: 20px; font-size: 18px; color: #4a235a; text-align: center; background: #FFF; padding: 20px; border-radius: 10px; border: 1px solid #E6C27A;">
                        คะแนนดวงชีวิต 1-7 (7=ดีเลิศ, 1=ตกต่ำ) <br>ตำแหน่งที่ได้คะแนนสูงคือจุดแข็งในชีวิต ส่วนตำแหน่งคะแนนน้อยต้องระมัดระวังเป็นพิเศษ
                    </div>
                </div>
            `;

            // ==========================================
            // PAGE D: Destiny, Wealth, Fengshui
            // ==========================================
            let soulDay = dobObj.getDay() + 1; // 1-7
            let thaiZodiac = 1;
            if (typeof ycBirthYearToZodiac === 'function') {
                const zObj = ycBirthYearToZodiac(dobObj.getFullYear());
                const zList = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
                thaiZodiac = zList.indexOf(zObj.name) + 1;
            }
            const soulSum = (soulDay + thaiZodiac) % 7;
            const soulPred = [
                "<strong>เศษ ๐ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอาคเนย์ หรือ ตะวันตกตรงกัน</b> เป็นคนผิวเนื้อสองสี (ดำแดง) ดุและเชื่อคนง่าย",
                "<strong>เศษ ๑ :</strong> เนื้อคู่อยู่ทาง <b>ทิศพายัพ หรือ อาคเนย์</b> ตระกูลดี รูปร่างสันทัด ผิวเกือบขาว นิสัยอ่อนโยน วิชาความรู้ดี",
                "<strong>เศษ ๒ :</strong> เนื้อคู่อยู่ทาง <b>ทิศประจิม หรือ ทิศบูรพา</b> ตระกูลเดิมเสมอกัน เป็นคนสุภาพเรียบร้อย ซื่อสัตย์สุจริต",
                "<strong>เศษ ๓ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอิสาณ หรือ ทิศหรดี</b> ตระกูลสามัญ รูปร่างค่อนข้างสูงใหญ่ ผิวดำสักหน่อย หาเลี้ยงตัวได้",
                "<strong>เศษ ๔ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอุดร หรือ ทิศทักษิณ</b> รูปร่างใหญ่ กว้างขวาง ชอบทางนักเลง โทโสร้ายสักหน่อย เมื่ออายุมากจะดี",
                "<strong>เศษ ๕ :</strong> เนื้อคู่อยู่ทาง <b>ทิศทักษิณ หรือ หรดี</b> ผิวเนื้อค่อนข้างดำ มักจะเป็นหม้าย หรือเป็นคนกำพร้า",
                "<strong>เศษ ๖ :</strong> เนื้อคู่อยู่ทาง <b>ทิศหรดี หรือ ทิศอุดร</b> ผิวเนื้อสองสี (ดำแดง) นิสัยใจเร็วด่วนได้ โกรธง่าย"
            ];

            let bRating = "ปานกลาง";
            let cList = "ค้าขายทั่วไป, งานบริการ";
            if (typeof calculateBusinessFortune === 'function') {
                const bf = calculateBusinessFortune(dobObj);
                if (bf && !bf.error) {
                    bRating = bf.incomeDescription || "ปานกลาง";
                    cList = (bf.careers || []).join(", ") || cList;
                }
            }

            let page4Html = `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                    
                    <!-- Soulmate -->
                    <div style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">ทำนายดวงเนื้อคู่ (Soulmate) 💕</div>
                    <div style="font-size: 18px; line-height: 1.6; background: #FFF; padding: 20px; border-radius: 10px; border: 2px solid #E6C27A; margin-bottom: 15px;">
                        <div style="color: #B8860B; font-size: 22px; margin-bottom: 10px; font-weight: bold; text-align: center; ">ลักษณะเนื้อคู่ และ ทิศสมพงษ์</div>
                        <p style="margin-bottom: 10px; color: #4a235a; font-size: 20px; text-align: center;">${soulPred[soulSum]}</p>
                    </div>

                    <!-- Wealth -->
                    <div style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">ดวงธุรกิจ & โชคลาภ 💰</div>
                    <div style="font-size: 18px; line-height: 1.6; background: #FFF; padding: 20px; border-radius: 10px; border: 2px solid #E6C27A; margin-bottom: 15px; display: flex; gap: 20px; flex-grow: 1;">
                        <div style="flex: 1;">
                            <div style="color: #B8860B; font-size: 20px; margin-bottom: 10px; font-weight: bold; ">เกณฑ์ความมั่งคั่ง: ${bRating}</div>
                            <div style="color: #B8860B; font-size: 18px; font-weight: bold;">สายอาชีพและธุรกิจที่ถูกโฉลก:</div>
                            <p style="margin-bottom: 0; color: #4a235a; font-size: 16px;">${cList}</p>
                        </div>
                        <div style="flex: 1; text-align: center; border-left: 1px dashed #E6C27A; padding-left: 20px; display: flex; flex-direction: column; justify-content: center;">
                            <div style="color: #B8860B; font-size: 20px; margin-bottom: 10px; font-weight: bold; ">ตัวเลขนำโชคประจำวันเกิด</div>
                            <div style="color: #dc3545; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                                ${((nameSum + idSum) % 99) || 89} , ${Math.floor(Math.random() * 90) + 10} , ${((soulDay * 12) + thaiZodiac) || 55}
                            </div>
                        </div>
                    </div>

                    <!-- Fengshui -->
                    <div style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">ฮวงจุ้ยและทิศมงคล 🧭</div>
                    <div style="font-size: 18px; line-height: 1.6; background: #FFF; padding: 20px; border-radius: 10px; border: 2px solid #E6C27A; height: 160px;">
                        <div style="display: flex; gap: 20px; align-items: center; height: 100%;">
                            <div style="flex: 1;">
                                <div style="color: #B8860B; font-size: 20px; margin-bottom: 5px; font-weight: bold; ">ทิศหันหัวเตียง/โต๊ะทำงาน</div>
                                <p style="margin-bottom: 15px; color: #4a235a; font-size: 18px;">ทิศเหนือ และ ทิศตะวันออกเฉียงเหนือ</p>
                            </div>
                            <div style="flex: 1; border-left: 1px dashed #E6C27A; padding-left: 20px;">
                                <div style="color: #B8860B; font-size: 20px; margin-bottom: 5px; font-weight: bold; ">เคล็ดลับจัดโต๊ะทำงาน</div>
                                <p style="margin-bottom: 0; color: #4a235a; font-size: 16px;">วางต้นไม้เล็กๆ หรือหินมงคล ไว้มุมซ้ายของโต๊ะ ลดความขัดแย้ง</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            htmlContent += page1Html + page2Html + page3Html + page4Html;

        }
    }

    // Page 4: Calendar of Auspicious Days (Full Month Grid)
    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
            <div style="color: #B8860B; font-size: 28px; text-align: center; margin-bottom: 10px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; font-weight: bold; ">ปฏิทินประจำเดือน ${monthNameTh}</div>
            <div style="font-size: 14px; text-align: center; margin-bottom: 10px; color: #666;">
                <span style="color:#28a745; margin-right: 15px;">✅ วันธงชัย (ดีเยี่ยม)</span>
                <span style="color:#17a2b8; margin-right: 15px;">✅ วันอธิบดี (ดีมาก)</span>
                <span style="color:#fd7e14; margin-right: 15px;">⚠️ วันอุบาทว์ (ระวัง)</span>
                <span style="color:#dc3545;">❌ วันโลกาวินาศ (ห้าม)</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; table-layout: fixed; flex-grow: 1;">
                <thead>
                    <tr style="background: #D4AF37; color: #FFF; font-weight: bold; font-size: 18px; height: 40px;">
                        <th style="border: 1px solid #ccc; width: 14.28%;">อาทิตย์</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">จันทร์</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">อังคาร</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">พุธ</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">พฤหัสบดี</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">ศุกร์</th>
                        <th style="border: 1px solid #ccc; width: 14.28%;">เสาร์</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
    `;

    const firstDayOfWeek = new Date(tYear, tMonth - 1, 1).getDay();
    let currentDayOfWeek = 0;

    // Empty cells before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
        htmlContent += `<td style="border: 1px solid #eee; background: #fafafa;"></td>`;
        currentDayOfWeek++;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        let curDate = new Date(tYear, tMonth - 1, d);
        let dayOfWk = curDate.getDay();

        let kala = null;
        if (typeof calculateKalaYok === 'function') {
            kala = calculateKalaYok(curDate);
        }

        let label = "";
        let color = "#333";
        let bgColor = "#FFF";

        if (kala) {
            if (dayOfWk === kala.thongChai) { label = "✅ ธงชัย"; color = "#28a745"; bgColor = "#eafbf0"; }
            else if (dayOfWk === kala.athibadi) { label = "✅ อธิบดี"; color = "#17a2b8"; bgColor = "#eaf8fb"; }
            else if (dayOfWk === kala.ubart) { label = "⚠️ อุบาทว์"; color = "#fd7e14"; bgColor = "#fff5ec"; }
            else if (dayOfWk === kala.lokawinat) { label = "❌ โลกาวินาศ"; color = "#dc3545"; bgColor = "#fbeaea"; }
        }

        // Check if there is a lunar string
        let lunarShort = "";
        let holyDayHtml = "";
        if (typeof getThaiLunar === 'function') {
            const lObj = getThaiLunar(curDate);
            if (lObj) {
                lunarShort = `${lObj.phase} ${lObj.amount} ค่ำ<br>เดือน ${lObj.month}`;
                if (lObj.isHolyDay) {
                    holyDayHtml = `<div style="font-size: 11px; color: #d63384; font-weight: bold; margin-top: 3px;">🙏 วันพระ</div>`;
                }
            }
        }

        htmlContent += `
            <td style="border: 1px solid #E6C27A; padding: 5px; vertical-align: top; background: ${bgColor}; height: auto;">
                <div style="font-size: 24px; font-weight: bold; color: ${dayOfWk === 0 ? '#dc3545' : (dayOfWk === 6 ? '#8A2BE2' : '#4a235a')}; margin-bottom: 5px;">${d}</div>
                <div style="font-size: 12px; color: #6b5b95; margin-bottom: 5px; line-height: 1.2;">${lunarShort}${holyDayHtml}</div>
                <div style="font-size: 14px; font-weight: bold; color: ${color};">${label}</div>
            </td>
        `;

        currentDayOfWeek++;
        if (currentDayOfWeek === 7) {
            htmlContent += `</tr>`;
            if (d < daysInMonth) {
                htmlContent += `<tr>`;
            }
            currentDayOfWeek = 0;
        }
    }

    // Fill remaining cells
    if (currentDayOfWeek > 0 && currentDayOfWeek < 7) {
        for (let i = currentDayOfWeek; i < 7; i++) {
            htmlContent += `<td style="border: 1px solid #E6C27A; background: #fafafa;"></td>`;
        }
        htmlContent += `</tr>`;
    }

    htmlContent += `
                </tbody>
            </table>
            
            <div style="margin-top: 10px; font-size: 16px; line-height: 1.4; background: #FFF; padding: 10px; border-radius: 10px; border: 2px solid #E6C27A; text-align: center; color: #4a235a;">
                <strong style="color: #B8860B;">คำแนะนำการใช้วันมงคล:</strong><br>
                ให้เลือกใช้วันธงชัยสำหรับการเริ่มต้นสิ่งใหม่ๆ ออกรถ ขึ้นบ้านใหม่<br>ส่วนวันโลกาวินาศควรหลีกเลี่ยงการทำสัญญา หรือเจรจาธุรกิจสำคัญ
            </div>
        </div>
    `;

    // Page 3 to 33: Daily Predictions
    const daysThArr = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const birthDayStr = daysThArr[dobObj.getDay()];
    const birthYearAD = dobObj.getFullYear();

    // YARM Helper
    const getYarmTimes = (dayOfWeek) => {
        let yarms = { work: "-", finance: "-", love: "-" };
        if (typeof window.YARM_CHART !== 'undefined') {
            const dayChart = window.YARM_CHART.day[dayOfWeek];

            // Format time helper (index 0 = 06:00-07:30)
            const formatT = (idx) => {
                let startMins = 360 + (idx * 90);
                let h1 = Math.floor(startMins / 60).toString().padStart(2, '0');
                let m1 = (startMins % 60).toString().padStart(2, '0');
                let h2 = Math.floor((startMins + 90) / 60).toString().padStart(2, '0');
                let m2 = ((startMins + 90) % 60).toString().padStart(2, '0');
                return `${h1}:${m1} - ${h2}:${m2} น.`;
            };

            // Find best match for each
            let workIdx = dayChart.findIndex(id => id === 5 || id === 0);
            let finIdx = dayChart.findIndex(id => id === 6 || id === 3);
            let loveIdx = dayChart.findIndex(id => id === 1 || id === 6);

            if (workIdx !== -1) yarms.work = formatT(workIdx);
            if (finIdx !== -1) yarms.finance = formatT(finIdx);
            if (loveIdx !== -1) yarms.love = formatT(loveIdx);
        }
        return yarms;
    };

    for (let d = 1; d <= daysInMonth; d++) {
        let curDate = new Date(tYear, tMonth - 1, d);
        let curDayOfWeek = curDate.getDay();
        let dStr = curDate.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        let seed = dobTimestamp + curDate.getTime();

        let fortunes = generateAstrologicalDailyFortune(dobObj, curDate);
        let wText = fortunes.wText;
        let fText = fortunes.fText;
        let lText = fortunes.lText;

        // 1. Lunar Info for the day
        let lunarShort = "";
        if (typeof getThaiLunar === 'function') {
            const lObj = getThaiLunar(curDate);
            if (lObj) {
                let wanPhra = "";
                if (lObj.amount === 8 || lObj.amount === 14 || lObj.amount === 15) {
                    wanPhra = ` <span style="color: #D4AF37; font-weight: bold;">( 🙏 วันพระ )</span>`;
                }
                lunarShort = `( ตรงกับจันทรคติ: ${lObj.phase} ${lObj.amount} ค่ำ เดือน ${lObj.month} )${wanPhra}`;
            }
        }

        // 2. Yarm (Auspicious times)
        let yarms = getYarmTimes(curDayOfWeek);

        // 3. Auspicious Colors (Mix of birth and current day)
        // Personal colors based on birth day & year
        let personalColors = null;
        if (typeof calculateLuckyColors === 'function') {
            personalColors = calculateLuckyColors(birthDayStr, birthYearAD);
        }

        // 4. Lucky numbers (Only on 1st and 16th)
        let luckySection = "";
        if (d === 1 || d === 16) {
            let rng = function (s) { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
            let l1 = Math.floor(rng(seed + 4) * 100).toString().padStart(2, '0');
            let l2 = Math.floor(rng(seed + 5) * 100).toString().padStart(2, '0');
            let l3 = Math.floor(rng(seed + 6) * 1000).toString().padStart(3, '0');
            luckySection = `
                <div style="background: #fdfbf7; border: 2px dashed #D4AF37; padding: 20px; border-radius: 15px; margin-top: 20px; text-align: center;">
                    <div style="font-size: 20px; color: #555; margin-bottom: 10px;">✨ <strong>เลขเด็ดมงคลนำโชค (ประจำงวดวันที่ ${d})</strong> ✨</div>
                    <div style="font-size: 36px; color: #D4AF37; font-weight: bold; letter-spacing: 5px;">${l1} - ${l2} - ${l3}</div>
                </div>
            `;
        }

        // 5. Daily Taksa Transit (ทักษาจรรายวัน)
        let taksaDailyHtml = "";
        if (typeof sdGlobalRows !== 'undefined' && sdGlobalRows !== null) {
            const diffDays = Math.floor((curDate - dobObj) / (1000 * 60 * 60 * 24));
            const sdDayNum = dobObj.getDay() === 0 ? 1 : dobObj.getDay() + 1; // Wait, actually dobObj.getDay() returns 0 for Sunday. But I used sdDayNum = dobObj.getDay() in Page 3. Wait, in page 3 I used `sdDayNum = dobObj.getDay();` (0 for sun). Let me just use the same variable.
            const sdDayIndex = dobObj.getDay();
            const dailyPos = Math.abs((sdDayIndex + diffDays)) % 7;
            const houseNames = ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"];
            const currentHouse = houseNames[dailyPos];

            const houseMeanings = {
                "อัตตา": "วันนี้เน้นเรื่องของตัวเอง การเริ่มต้นทำสิ่งใหม่ๆ จะมีพลัง",
                "หินะ": "ระวังอุปสรรค เรื่องหงุดหงิด หรือของสูญหาย ควรมีสติเป็นพิเศษ",
                "ธนัง": "เด่นเรื่องโชคลาภ เงินทอง มีเกณฑ์ได้รับข่าวดีเรื่องรายได้",
                "ปิตา": "ผู้ใหญ่ให้ความช่วยเหลือ ติดต่อเจรจากับผู้มีอำนาจจะสำเร็จ",
                "มาตา": "คนรอบข้างให้ความอุปถัมภ์ โดดเด่นด้านเมตตามหานิยม",
                "โภคา": "เหมาะแก่การจัดการทรัพย์สิน อสังหาฯ หรือซื้อของชิ้นใหญ่",
                "มัชฌิมา": "เรียบง่าย ไม่มีอะไรโดดเด่นมากนัก ประคองตัวทำกิจวัตรตามปกติ"
            };

            taksaDailyHtml = `
                <div style="background: rgba(212, 175, 55, 0.05); border-left: 5px solid #D4AF37; padding: 15px; margin-top: 20px; border-radius: 5px;">
                    <div style="color: #B8860B; margin: 0 0 10px 0; font-size: 20px; font-weight: bold; ">📜 ดวงจรรายวัน (มหาทักษาสัตตเลข)</div>
                    <div style="font-size: 18px; color: #444;">วันนี้ตกภพ <span style="font-weight: bold; color: #D4AF37;">${currentHouse}</span> - ${houseMeanings[currentHouse]}</div>
                </div>
            `;
        }

        htmlContent += `
            <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; position: relative; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                
                <div style="background: #FFF; padding: 15px 20px; border-radius: 10px; border: 2px solid #E6C27A; margin-bottom: 25px;">
                    <div style="color: #4a235a; font-size: 26px; margin: 0; font-weight: bold; ">
                        คำทำนายประจำวัน ${dStr}
                    </div>
                    <div style="font-size: 20px; font-weight: normal; margin-top: 5px; color: #6b5b95;">${lunarShort}</div>
                </div>

                ${taksaDailyHtml}
                
                <div style="font-size: 20px; line-height: 1.8; margin-bottom: 20px; flex-grow: 1;">
                    <div style="margin-bottom: 20px;">
                        <strong style="color: #B8860B; font-size: 22px;">💼 ด้านการงาน:</strong><br> 
                        <span style="color: #444;">${wText}</span>
                        ${yarms.work !== "-" ? `<div style="font-size: 14px; color: #28a745; margin-top: 5px;">⏰ เวลามงคลเจรจางาน: ${yarms.work}</div>` : ''}
                    </div>
                    <div style="margin-bottom: 20px;">
                        <strong style="color: #B8860B; font-size: 22px;">💰 ด้านการเงิน:</strong><br> 
                        <span style="color: #444;">${fText}</span>
                        ${yarms.finance !== "-" ? `<div style="font-size: 14px; color: #17a2b8; margin-top: 5px;">⏰ เวลามงคลเสี่ยงโชค/รับเงิน: ${yarms.finance}</div>` : ''}
                    </div>
                    <div style="margin-bottom: 20px;">
                        <strong style="color: #B8860B; font-size: 22px;">❤️ ด้านความรัก:</strong><br> 
                        <span style="color: #444;">${lText}</span>
                        ${yarms.love !== "-" ? `<div style="font-size: 14px; color: #e83e8c; margin-top: 5px;">⏰ เวลามงคลพบปะคนรัก: ${yarms.love}</div>` : ''}
                    </div>
                </div>
                
                ${personalColors ? `
                <div style="background: #f9f9f9; border-radius: 10px; padding: 15px; margin-bottom: 10px; font-size: 16px;">
                    <strong style="color: #555; font-size: 18px;">🎨 สีมงคลเสริมดวงของคุณในวันนี้ (คำนวณจากพื้นดวง):</strong>
                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                        <div style="flex: 1; text-align: center; background: ${personalColors.wealthHex}22; border: 1px solid ${personalColors.wealthHex}; color: ${personalColors.wealthHex}; padding: 8px; border-radius: 5px; font-weight: bold;">
                            เรียกทรัพย์: ${personalColors.wealthColor}
                        </div>
                        <div style="flex: 1; text-align: center; background: ${personalColors.powerHex}22; border: 1px solid ${personalColors.powerHex}; color: ${personalColors.powerHex}; padding: 8px; border-radius: 5px; font-weight: bold;">
                            เสริมบารมี: ${personalColors.powerColor}
                        </div>
                        <div style="flex: 1; text-align: center; background: ${personalColors.forbiddenHex}22; border: 1px solid ${personalColors.forbiddenHex}; color: ${personalColors.forbiddenHex}; padding: 8px; border-radius: 5px; font-weight: bold;">
                            กาลกิณี (เลี่ยง): ${personalColors.forbiddenColor}
                        </div>
                    </div>
                </div>
                ` : ''}

                ${luckySection}
            </div>
        `;
    }

    // Page 34: Summary
    let rng = function (s) { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
    let monthlyLucky1 = Math.floor(rng(dobTimestamp + tMonth) * 10);
    let monthlyLucky2 = Math.floor(rng(dobTimestamp + tMonth + 1) * 10);
    let monthlyLucky3 = Math.floor(rng(dobTimestamp + tMonth + 2) * 10);

    htmlContent += `
        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 60px; box-sizing: border-box; background: #FFF; color: #333; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
            <div style="text-align: right; color: #999; font-size: 16px;">หน้า ${daysInMonth + 8} / ${daysInMonth + 9}</div>
            <h2 style="color: #B8860B; font-size: 36px; text-align: center; margin-bottom: 40px; margin-top: 40px;">บทสรุปประจำเดือน และเลขมงคล</h2>
            
            <div style="background: rgba(212, 175, 55, 0.1); padding: 40px; border-radius: 20px; text-align: center; margin-bottom: 50px;">
                <div style="font-size: 28px; color: #555; margin-bottom: 20px;">กลุ่มเลขมงคลโดดเด่นประจำเดือนของคุณ</div>
                <div style="font-size: 60px; color: #D4AF37; font-weight: bold; letter-spacing: 10px;">${monthlyLucky1}${monthlyLucky2}${monthlyLucky3}</div>
                <div style="font-size: 22px; color: #666; margin-top: 20px;">สามารถนำไปประยุกต์ใช้ในการเสี่ยงโชค หรือตั้งเป็นรหัสผ่านเพื่อเสริมดวง</div>
            </div>

            <h3 style="font-size: 28px; color: #B8860B; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">🙏 บทสวดมนต์แนะนำประจำเดือน</h3>
            <div style="font-size: 22px; line-height: 1.8; color: #444; background: #f9f9f9; padding: 30px; border-radius: 10px;">
                <strong>พระคาถาชินบัญชร (แบบย่อ)</strong><br>
                ชินะปัญชะระปะริตตัง มังรักขะตุ สัพพะทา (สวด 3 จบ หรือ 9 จบ ก่อนนอน)<br><br>
                <em>อานิสงส์:</em> ช่วยเสริมสร้างความเป็นสิริมงคล แคล้วคลาดปลอดภัยจากภยันตรายทั้งปวง และช่วยดึงดูดโชคลาภให้เข้ามาอย่างไม่ขาดสายตลอดทั้งเดือน
            </div>
            
            <div style="margin-top: auto; text-align: center; font-size: 24px; color: #D4AF37;">
                ขอให้คุณ ${name} มีความสุข สมหวังตลอดทั้งเดือนครับ
            </div>
        </div>
    `;

    // Page 35: Back Cover
    htmlContent += `
        <div class="pdf-page cover-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-image: url('assets/mystical_astrology_cover.png') !important; background-size: cover !important; background-position: center !important; text-align: center; display: block; position: relative; padding: 0; border: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
            
            <!-- Top Banner Content (Positions Siamhora at the top banner) -->
            <div style="position: absolute; top: 120px; left: 0; width: 100%; text-align: center; z-index: 5;">
                <div style="color: #FFDF73 !important; font-size: 60px; font-weight: bold; text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 3px 3px 10px rgba(0,0,0,0.9);">สยามโหรามงคล</div>
                <div style="color: #D4AF37 !important; font-size: 26px; letter-spacing: 2px; margin-top: 5px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">ผู้ชี้แนะแนวทางแห่งดวงดาว</div>
            </div>

            <!-- Bottom Content (Contact Info in the dark glass box) -->
            <div style="position: absolute; bottom: 150px; left: 50%; transform: translateX(-50%); width: 70%; background: rgba(20, 10, 40, 0.85) !important; border: 2px solid #D4AF37 !important; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); z-index: 10;">
                <div style="font-size: 24px; color: #FFF !important; line-height: 2.2;">
                    <strong style="color: #FFDF73 !important;">สอบถามรายละเอียดเพิ่มเติม</strong><br>
                    หรือจองคิวดูดวงส่วนตัว<br><br>
                    <strong style="color: #D4AF37 !important;">Line:</strong> @siamhora<br>
                    <strong style="color: #D4AF37 !important;">Facebook:</strong> สยามโหรามงคล<br>
                    <strong style="color: #D4AF37 !important;">Tel:</strong> 094-392-6453
                </div>
            </div>
        </div>
    `;
    // Create Preview Screen
    let previewScreen = document.getElementById('vipPdfPreviewScreen');
    if (previewScreen) previewScreen.remove();

    previewScreen = document.getElementById('previewArea');
    previewScreen.style.display = 'block';
    previewScreen.innerHTML = ''; // Clear old content
    
    

    // Navbar
    const navHTML = `
        <div id="vipPdfPreviewNav" style="position: sticky; top: 0; background: rgba(20, 15, 35, 0.95); backdrop-filter: blur(10px); padding: 15px 30px; border-bottom: 1px solid rgba(212,175,55,0.3); border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="color: #FFDF73; font-size: 20px; font-weight: bold;">
                <i class="fas fa-eye"></i> พรีวิวตัวอย่างรายงาน (VIP)
            </div>
            <div>
                <button onclick="window.print()" style="background: linear-gradient(135deg, #d4af37, #f39c12); color: #111; font-weight: bold; font-size: 16px; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(212,175,55,0.4); transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-file-download"></i> บันทึกเป็น PDF (Print)
                </button>
            </div>
        </div>
    `;

    // Pages Wrapper

    // Add !important to all inline colors and backgrounds in htmlContent to defeat Chrome's ink-saving print overrides

    const pagesHTML = `
        <div id="vipPdfPreviewContent" style="display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 20px;">
            ${htmlContent}
        </div>
    `;


    // FORCE all text colors to have !important before injecting, completely nuking Bootstrap's color:#000
    // We do this by adding a global style block for the print preview
    const forceStyle = `
        <style>
            @media print {
                /* Defeat Bootstrap's aggressive black text by forcing inheritance with higher specificity AND !important */
                #vipPdfPreviewContent * {
                    text-shadow: inherit !important;
                    box-shadow: inherit !important;
                }
                body * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        </style>
    `;
    const finalPagesHTML = forceStyle + pagesHTML;
    previewScreen.innerHTML = navHTML + finalPagesHTML;

    /* Handled inline in previewArea */

    // Remove the generator modal since we are now in preview
    /* No modal to remove anymore */

    // Inject @media print CSS if not exists
    if (!document.getElementById('vipPrintStyle')) {
        const style = document.createElement('style');
        style.id = 'vipPrintStyle';
        style.innerHTML = `
            @media print {
                
                @page {
                    size: A4 portrait;
                    margin: 0;
                }
                html, body {
                    width: 100%;
                    height: auto !important; min-height: 100%;
                    margin: 0 !important;
                    padding: 0 !important;
                    
                    
                    background: #fff;
                }
                /* Removed invalid body > * hiding */
                #vipPdfPreviewNav {
                    display: none !important;
                }
                #vipPdfPreviewContent {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    gap: 0 !important;
                    display: block !important;
                }
                .pdf-page * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .pdf-page {
                    display: block !important;
                    width: 100% !important;
                    height: 297mm !important;
                    max-height: 297mm !important;
                    margin: 0 !important;
                    padding: 40px !important;
                    box-sizing: border-box !important;
                    page-break-after: always !important;
                    box-shadow: none !important;
                    border: 15px solid #D4AF37 !important;
                    overflow: hidden !important;
                    background-color: #FFF9E6 !important;
                    color: #4a235a !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .pdf-page.cover-page {
                    background-image: url('assets/mystical_astrology_cover.png') !important;
                    background-color: #1a0b2e !important;
                    background-size: cover !important;
                    background-position: center !important;
                    border: 15px solid #1a0b2e !important;
                    color: #FFF !important;
                    padding: 60px 40px !important;
                }
            }
            @media screen {
                .pdf-page {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                    transform: scale(0.65);
                    transform-origin: top center;
                    margin-bottom: -100mm;
                    border-radius: 10px;
                }
                #vipPdfPreviewContent {
                    padding-bottom: 110mm !important;
                }
                /* Hide sidebar when printing */
            }
            @media print {
                html, body { background: #fff !important; overflow: visible !important; height: auto !important; display: block !important; }
                .sidebar, .header, #vipPdfPreviewNav, .back-btn { display: none !important; }
                .content { padding: 0 !important; margin: 0 !important; display: block !important; overflow: visible !important; height: auto !important; width: 100% !important; }
                .preview-area { padding: 0 !important; margin: 0 !important; background: none !important; border: none !important; border-radius: 0 !important; display: block !important; overflow: visible !important; height: auto !important; width: 100% !important; position: static !important; }
                #vipPdfPreviewContent { margin: 0 !important; padding: 0 !important; overflow: visible !important; height: auto !important; width: 100% !important; display: block !important; }
            }
        `;
        document.head.appendChild(style);
    }
}

window.changeMonth = function(delta) {
    const monthInput = document.getElementById('vipTargetMonth');
    let targetDate = new Date();
    if (monthInput.value) {
        const parts = monthInput.value.split('-');
        targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    }
    targetDate.setMonth(targetDate.getMonth() + delta);
    monthInput.value = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
};
