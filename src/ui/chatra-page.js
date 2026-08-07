"use strict";

/**
 * Logic: ฉัตร 3 ชั้น (สูตรคำนวณเศษอายุมาตรฐาน)
 * ชั้น 1: อายุ % 3
 * ชั้น 2: อายุ % 7
 * ชั้น 3: อายุ % 8
 */

function showchatri(){
    const contianer = document.getElementById('showchatriPage')
    if (!contianer) return ;

    const html = `
    <div class="container mt-4">
            <div class="card shadow-lg"
                style="background: rgba(20, 20, 20, 0.95); border: 1px solid #d4af37; border-radius: 15px;">
                <div class="card-header text-center py-4" style="border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
                    <h2 class="text-gold" style="text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">
                        <i class="fas fa-umbrella-beach mr-2"></i> วิชามหามงคล "ฉัตร 3 ชั้น"
                    </h2>
                    <span class="text-muted small mb-0">พยากรณ์เกณฑ์ชะตา บารมี และลาภผลรายปี</span>
                </div>
                <div class="card-body p-4">
                    <div class="row justify-content-center mb-5">
                        <div class="col-md-6 col-lg-4 text-center">
                        <label class="text-gold">เลือกจากรายชื่อสมาชิก (ประวัติ):</label>
                            <select id="memberSelect"
                                class="form-control bg-dark text-white border-gold member-selector-shared"
                                onchange="autoFillMemberData(this.value)">
                                <option value="">-- เลือกสมาชิก --</option>
                            </select>
                            <label class="text-gold mb-2">อายุย่างตามปฏิทิน (คำนวณอัตโนมัติ)</label>
                            <input type="number" id="chatraAge" placeholder="กรอกอายุ (เช่น 25)"
                                onkeypress="if(event.key === 'Enter') { event.preventDefault(); calculateChatra(); }"
                                class="btn btn-outline-gold px-5 py-2" readonly /><br>                            
                            <button type="button" onclick="calculateChatra()" class="btn btn-gold mt-3"> คำนวณฉัตร 3 ชั้น</button>
                        </div>
                    </div>
                </div>
                <div id="chatraDisplay" style="display: none;">
                    <div class="chatra-visual-area d-flex flex-column align-items-center mt-4">
                        <div class="chatra-pinnacle"></div>
                        <div class="chatra-tier tier-top" id="chatraTier3">
                            <div class="tier-label">ชั้นที่ 3: บารมี/บริวาร</div>
                            <div class="tier-value" id="resTier3">-</div>
                        </div>
                        <div class="chatra-tier tier-mid" id="chatraTier2">
                            <div class="tier-label">ชั้นที่ 2: การงาน/การเงิน</div>
                            <div class="tier-value" id="resTier2">-</div>
                        </div>
                        <div class="chatra-tier tier-base" id="chatraTier1">
                            <div class="tier-label">ชั้นที่ 1: พื้นฐานดวงปีนี้</div>
                            <div class="tier-value" id="resTier1">-</div>
                        </div>
                        <div class="chatra-pole"></div>
                    </div>
                    <div class="fortune-box mt-4 p-4 text-center rounded">
                        <h4 class="text-gold mb-3"><i class="fas fa-scroll mr-2"></i> บันทึกมหาพยากรณ์</h4>
                        <p id="chatraInterpretation" class="text-white lead mb-0"></p>
                    </div>
                    <div class="text-center mt-4">
                        <button class="btn btn-outline-gold px-5 py-2" onclick="downloadChatraImage()">
                            <i class="fas fa-camera mr-2"></i> บันทึกภาพคำทำนาย
                        </button>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-6">
                        <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                            <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                            <i class="fas fa-home"></i> กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        </div>    
    `;
    contianer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    showchatri()
});


function showChatraPage() {
    $('.main-section').addClass('hidden').hide(); 
    $('#chatraPage').removeClass('hidden').fadeIn(500);
    
    // เคลียร์ค่า
    const ageInput = document.getElementById('chatraAge');
    if (ageInput) ageInput.value = '';
    document.getElementById('chatraDisplay').style.display = 'none';
    
    window.scrollTo(0, 0);

    // ตั้งค่ากด Enter
    setupChatraEnterKey();
}

// ฟังก์ชันจัดการสไตล์และสีของแต่ละชั้นฉัตร
function updateTierStyle(tierId, textId, value, type) {
    const tierEl = document.getElementById(tierId);
    const textEl = document.getElementById(textId);
    
    // Reset classes
    textEl.className = 'tier-value';
    tierEl.classList.remove('glow-gold', 'glow-red');

    if (type === 'base') { // ชั้น 1
        if (value === 1) { // 1 = ลำบาก
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else if (value === 2) { // 2 = ปานกลาง
            textEl.classList.add('text-info-bright');
        } else { // 0 = ดีเยี่ยม
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    } 
    else if (type === 'mid') { // ชั้น 2
        if ([1, 4].includes(value)) { // 1 = เสียเงิน, 4 = เหนื่อย
            textEl.classList.add('text-warning-bright');
            tierEl.classList.add('glow-red');
        } else if ([0, 3, 5, 6].includes(value)) { // ดี
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        } else { // 2 = ทรงตัว
            textEl.classList.add('text-white');
        }
    } 
    else if (type === 'top') { // ชั้น 3
        if (value === 1) { // 1 = ศัตรูปองร้าย
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else { // ที่เหลือดีหมด
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    }
}

const chatraLongPrediction = {
    tier1: [
        "ดวงชะตาชั้นฐานรุ่งโรจน์มาก ปีนี้ท่านจะมีโชคช่วยเหลือ หยิบจับสิ่งใดก็ราบรื่น งานการเจริญก้าวหน้า เงินทองไหลมาเทมา ลาภยศและชื่อเสียงจะติดตามมา บริวารและผู้ใหญ่ให้การสนับสนุนเต็มที่ ควรใช้โอกาสนี้ในการขยายกิจการหรือลงทุนใหม่ แต่ก็อย่าลืมทำบุญอุทิศส่วนกุศลเพื่อรักษาโชคนี้ไว้ให้นานที่สุด",
        "ปีนี้ดวงชะตาชั้นฐานตกอยู่ในเกณฑ์ลำบาก ท่านจะพบอุปสรรคและความวุ่นวายบ่อยครั้ง งานที่ทำอาจติดขัด เงินทองไหลออกง่าย ควรระวังการลงทุนใหญ่และการเป็นหนี้บุญคุณใคร ระวังคนใกล้ชิดนำปัญหามาให้ แนะนำให้หมั่นทำบุญ สวดมนต์ และรักษาสุขภาพให้แข็งแรง อย่าทุ่มเทแรงกายแรงใจเกินไปจนหมดตัว หากอดทนผ่านปีนี้ไปได้ ปีหน้าจะดีขึ้นอย่างเห็นได้ชัด",
        "ดวงชะตาชั้นฐานปานกลาง ท่านสามารถประคองตัวได้ตลอดปี แม้จะมีเรื่องให้ต้องปวดหัวบ้าง แต่ก็ยังพอมีโอกาสให้แก้ไข งานการจะค่อนข้างทรงตัว เงินเข้าเงินออกพอใช้ ควรระวังเรื่องคำพูดและการทะเลาะวิวาทกับผู้ใหญ่หรือบริวาร แนะนำให้ทำบุญทุกเดือนและหมั่นไหว้พระเพื่อเสริมสิริมงคล ปีนี้เหมาะกับการวางแผนมากกว่าการลงมือทำใหญ่โต"
    ],
    tier2: [
        "งานการในปีนี้จะขยับขยาย มีการเติบโตทั้งในด้านขนาดและรายได้ อาจได้เปิดสาขาใหม่หรือขยายธุรกิจ คว้าโอกาสนี้ไว้ แต่ต้องวางแผนให้ดีและไม่ประมาท",
        "ด้านการเงินและการงานในปีนี้ ท่านจะต้องจ่ายเงินออกมาก เก็บเงินไม่อยู่ มีค่าใช้จ่ายฉุกเฉินบ่อยครั้ง งานที่ทำอาจเหนื่อยล้าและไม่เป็นไปตามแผน ควรระวังการกู้ยืมหรือค้ำประกันใคร หมั่นตรวจสอบบัญชีและควบคุมการใช้จ่ายให้ดี แนะนำให้ทำบุญตัดกรรมและสวดมนต์ขอพรจากสิ่งศักดิ์สิทธิ์เพื่อคลายเคราะห์",
        "การเงินและการงานทรงตัวพอใช้ ไม่เด่นไม่ด้อย เงินเข้าเงินออกคล่องตัวปานกลาง งานราบรื่นแต่ไม่ก้าวกระโดด ควรใช้ความอดทนและความระมัดระวังในการตัดสินใจ บริวารและเพื่อนร่วมงานช่วยเหลือได้บ้าง แนะนำให้ทำบุญทุก ๑๕ ค่ำและแรม ๑๕ ค่ำเพื่อเสริมสิริมงคล",
        "ปีนี้มีโชคลาภลอยเข้ามาไม่คาดคิด อาจได้เงินก้อนจากงานอดิเรก การลงทุน หรือผู้ใหญ่ให้ การงานจะขยับขยาย มีโอกาสได้เลื่อนตำแหน่งหรือขยายธุรกิจ ควรคว้าโอกาสนี้ไว้ให้ดี แต่ก็อย่าประมาท ระวังคนอิจฉา",
        "งานในปีนี้จะทำให้ท่านเหนื่อยกายและเหนื่อยใจ ต้องทำงานหนักแต่ผลตอบแทนไม่คุ้มค่า ควรระวังสุขภาพและความเครียด อาจมีเรื่องขัดแย้งกับผู้ร่วมงาน แนะนำให้พักผ่อนให้เพียงพอและทำบุญเพื่อลดแรงกดดัน",
        "ผู้ใหญ่และผู้มีพระคุณจะเข้ามาหนุนหลังอย่างเต็มที่ งานการจะราบรื่นขึ้น มีโอกาสได้งานใหม่หรือตำแหน่งที่ดีกว่า ควรแสดงความกตัญญูและรักษาความสัมพันธ์ไว้ให้ดี ปีนี้เหมาะกับการขอความช่วยเหลือจากผู้ใหญ่",
        "บริวาร ลูกน้อง และคนรอบข้างจะช่วยเหลือท่านเป็นอย่างดี งานที่ทำจะสำเร็จด้วยความร่วมมือของทีม ควรดูแลบริวารและให้ความเป็นธรรมกับพวกเขาเพื่อรักษาโชคนี้ไว้"
    ],
    tier3: [
        "ปีนี้ท่านจะมีอำนาจวาสนาแผ่ไพศาล มีคนนับหน้าถือตาและให้ความเคารพ งานราชการหรือธุรกิจจะเจริญรุ่งเรือง ควรใช้พลังนี้ในการช่วยเหลือผู้อื่นและทำบุญเพื่อรักษาโชค",
        "ระวังคนปองร้ายและศัตรูแอบแฝง ปีนี้จะมีคนคิดร้ายหรือใส่ร้ายท่าน ควรระมัดระวังคำพูดและการกระทำ อย่าเปิดเผยความลับให้ใครมากเกินไป หมั่นทำบุญและสวดมนต์ขอพรเทวดาเพื่อป้องกันภัย",
        "เทวดาและสิ่งศักดิ์สิทธิ์จะคอยคุ้มครองท่านตลอดปี จะแคล้วคลาดจากอุบัติเหตุและภัยพิบัติ เรื่องร้าย ๆ จะคลี่คลายด้วยตัวเอง ควรทำบุญบ่อย ๆ เพื่อตอบแทนบุญคุณ",
        "ปีนี้ท่านจะแคล้วคลาดปลอดภัยจากทุกภัย เรื่องคดีความหรือปัญหาใหญ่จะได้รับการช่วยเหลืออย่างทันท่วงที ชื่อเสียงและเกียรติยศจะเพิ่มขึ้น ควรใช้โอกาสนี้ในการสร้างสัมพันธ์ที่ดี",
        "ชื่อเสียงและบารมีของท่านจะโดดเด่นเป็นที่รู้จัก งานที่ทำจะได้รับการยอมรับจากสังคม อาจมีข่าวดีเรื่องการเลื่อนตำแหน่งหรือได้รับรางวัล ควรรักษาพฤติกรรมและทำบุญเพื่อให้บารมีนี้ยั่งยืน",
        "บริวารและคนรอบข้างจะให้คุณแก่ท่านมาก ช่วยเหลือในยามยากและนำโชคมาให้ ควรดูแลและให้ความเมตตาแก่พวกเขา",
        "ท่านจะสามารถชนะอุปสรรคทั้งปวงที่เข้ามา ทุกปัญหาจะได้รับการแก้ไขด้วยปัญญาและความเพียร ควรมีสติและศรัทธาในสิ่งที่ดี",
        "สิ่งที่ท่านปรารถนาจะสำเร็จสมความต้องการ งาน การเงิน ความรัก และสุขภาพจะไปในทิศทางที่ดี ควรตั้งใจและทำบุญอุทิศส่วนกุศล"
    ]
};

function calculateChatra() {
    const ageInput = document.getElementById('chatraAge').value.trim();
    const age = parseInt(ageInput);

    if (!age || age <= 0 || isNaN(age)) {
        Swal.fire('แจ้งเตือน', 'โปรดระบุอายุเป็นตัวเลขที่ถูกต้อง (มากกว่า 0)', 'warning');
        return;
    }

    // คำนวณเศษตามสูตรมาตรฐาน
    const s1 = age % 3;
    const s2 = age % 7;
    const s3 = age % 8;

    const chatraDict = {
        tier1: [
            "ดวงรุ่งโรจน์ (หยิบจับอะไรเป็นเงิน)",
            "ตกที่นั่งลำบาก (ต้องระวัง)",
            "ดวงปานกลาง (ประคองตัวได้)"
        ],
        tier2: [
            "งานขยับขยาย",
            "จ่ายมากเก็บไม่อยู่",
            "การเงินทรงตัว",
            "มีโชคลาภลอย",
            "เหนื่อยเรื่องงาน",
            "ผู้ใหญ่หนุนหลัง",
            "บริวารช่วยเหลือ"
        ],
        tier3: [
            "มีอำนาจวาสนาแผ่ไพศาล",
            "ระวังคนปองร้าย",
            "เทวดาคุ้มครอง",
            "แคล้วคลาดปลอดภัย",
            "ชื่อเสียงโดดเด่น",
            "บริวารให้คุณ",
            "ชนะอุปสรรคทั้งปวง",
            "สำเร็จสมความปรารถนา"
        ]
    };

   

    // อัปเดตข้อความ
    document.getElementById('resTier1').innerText = chatraDict.tier1[s1];
    document.getElementById('resTier2').innerText = chatraDict.tier2[s2];
    document.getElementById('resTier3').innerText = chatraDict.tier3[s3];

    // อัปเดตสไตล์และเอฟเฟกต์
    updateTierStyle('chatraTier1', 'resTier1', s1, 'base');
    updateTierStyle('chatraTier2', 'resTier2', s2, 'mid');
    updateTierStyle('chatraTier3', 'resTier3', s3, 'top');

    // สรุปคำพยากรณ์
     const longPred = `
        ในปีนี้ที่ท่านอายุ ${age} ปี 

        ดวงชะตา**ชั้นฐาน** : <br>
        ${chatraDict.tier1[s1]}
        ${chatraLongPrediction.tier1[s1]}

        ด้าน**การงานและลาภผล** : <br>
        ${chatraDict.tier2[s2]}
        ${chatraLongPrediction.tier2[s2]}

        ด้าน**บารมีและการคุ้มครอง** : <br>
        ${chatraDict.tier3[s3]}
        ${chatraLongPrediction.tier3[s3]}

        **คำแนะนำจากตำรา**: <br>
        ควรหมั่นทำบุญ ไหว้พระ สวดมนต์ และรักษาจิตใจให้สงบ เพื่อเสริมดวงชะตาให้ดียิ่งขึ้นตลอดทั้งปี
            `;
    document.getElementById('chatraInterpretation').innerHTML = longPred.replace(/\n/g, '<br>');

    // แสดงผล
    $("#chatraDisplay").hide().fadeIn(1000);
}

async function downloadChatraImage(e) {
    const btn = e ? e.currentTarget : document.querySelector('button[onclick="downloadChatraImage()"]');
    let originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังเตรียมรูป...';
        btn.disabled = true;
    }

    try {
        const ageInput = document.getElementById('chatraAge').value.trim();
        const age = parseInt(ageInput);
        if (!age || age <= 0 || isNaN(age)) {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
            if(typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ', 'warning');
            else alert('กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ');
            return;
        }

        const s1 = age % 3;
        const s2 = age % 7;
        const s3 = age % 8;

        const chatraDict = {
            tier1: ["ดวงรุ่งโรจน์ (หยิบจับอะไรเป็นเงิน)", "ตกที่นั่งลำบาก (ต้องระวัง)", "ดวงปานกลาง (ประคองตัวได้)"],
            tier2: ["งานขยับขยาย", "จ่ายมากเก็บไม่อยู่", "การเงินทรงตัว", "มีโชคลาภลอย", "เหนื่อยเรื่องงาน", "ผู้ใหญ่หนุนหลัง", "บริวารช่วยเหลือ"],
            tier3: ["มีอำนาจวาสนาแผ่ไพศาล", "ระวังคนปองร้าย", "เทวดาคุ้มครอง", "แคล้วคลาดปลอดภัย", "ชื่อเสียงโดดเด่น", "บริวารให้คุณ", "ชนะอุปสรรคทั้งปวง", "สำเร็จสมความปรารถนา"]
        };
        
        let c1 = s1 === 1 ? '#ff4d4d' : (s1 === 2 ? '#0dcaf0' : '#d4af37'); 
        let c2 = [1, 4].includes(s2) ? '#ff4d4d' : ([0, 3, 5, 6].includes(s2) ? '#d4af37' : '#ffffff');
        let c3 = s3 === 1 ? '#ff4d4d' : '#d4af37';
        
        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3000;
        const ctx = canvas.getContext('2d');
        
        await document.fonts.ready;
        
        const drawContent = (isMeasure = false) => {
            let cy = 100;
            const cx = 80;
            const maxW = width - 160;
            
            if (!isMeasure) {
                let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#1c1c1e');
                grad.addColorStop(1, '#000000');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, canvas.height);
                
                ctx.strokeStyle = '#d4af37';
                ctx.lineWidth = 4;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(40, 40, width - 80, canvas.height - 80, 25);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(40, 40, width - 80, canvas.height - 80);
                }
                
                ctx.font = '700 60px "Chonburi"';
                ctx.fillStyle = '#d4af37'; 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText("✨ มหามงคลพยากรณ์: ฉัตร 3 ชั้น ✨", width/2, cy);
                
                ctx.font = '400 36px "Sarabun"';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`อายุย่าง ${age} ปี`, width/2, cy + 90);
            }
            
            cy += 180;
            
            let renderTier = (label, value, color) => {
                if (!isMeasure) {
                    ctx.font = '400 32px "Sarabun"';
                    ctx.fillStyle = '#cccccc';
                    ctx.textAlign = 'center';
                    ctx.fillText(label, width/2, cy);
                    
                    ctx.font = '700 45px "Sarabun"';
                    ctx.fillStyle = color;
                    ctx.fillText(value, width/2, cy + 45);
                    
                    ctx.strokeStyle = 'rgba(212,175,55,0.3)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(width/2 - 200, cy + 115);
                    ctx.lineTo(width/2 + 200, cy + 115);
                    ctx.stroke();
                }
                cy += 150;
            };
            
            renderTier("ชั้นที่ 3: บารมี/บริวาร", chatraDict.tier3[s3], c3);
            renderTier("ชั้นที่ 2: การงาน/การเงิน", chatraDict.tier2[s2], c2);
            renderTier("ชั้นที่ 1: พื้นฐานดวงปีนี้", chatraDict.tier1[s1], c1);
            
            cy += 40;
            
            ctx.font = '400 36px "Sarabun"';
            ctx.textAlign = 'left';
            
            const renderWrappedText = (text, textColor = '#e8e9f5', align = 'center') => {
                let pLines = [];
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(text);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > maxW && currentLine.trim() !== '') {
                            pLines.push(currentLine);
                            currentLine = segment;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                } else {
                    let currentLine = "";
                    for (let j = 0; j < text.length; j++) {
                        const char = text[j];
                        const testLine = currentLine + char;
                        if (ctx.measureText(testLine).width > maxW && j > 0) {
                            pLines.push(currentLine);
                            currentLine = char;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                }
                
                for (let l of pLines) {
                    if (!isMeasure) {
                        ctx.fillStyle = textColor;
                        ctx.textAlign = align;
                        if(align === 'center') {
                            ctx.fillText(l, width/2, cy);
                        } else {
                            ctx.fillText(l, cx, cy);
                        }
                    }
                    cy += 50;
                }
            };
            
            if(!isMeasure){
                ctx.font = '700 40px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'center';
                ctx.fillText("บันทึกมหาพยากรณ์", width/2, cy);
            }
            cy += 70;
            
            ctx.font = '400 36px "Sarabun"';
            
            renderWrappedText(`ในปีนี้ที่ท่านอายุ ${age} ปี`, '#e8e9f5', 'center');
            cy += 40;
            
            if(!isMeasure){
                ctx.font = '700 36px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'left';
                ctx.fillText(`ดวงชะตาชั้นฐาน :`, cx, cy);
            }
            cy += 50;
            ctx.font = '400 36px "Sarabun"';
            renderWrappedText(chatraDict.tier1[s1], c1, 'left');
            renderWrappedText(chatraLongPrediction.tier1[s1], '#cccccc', 'left');
            cy += 40;
            
            if(!isMeasure){
                ctx.font = '700 36px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'left';
                ctx.fillText(`ด้านการงานและลาภผล :`, cx, cy);
            }
            cy += 50;
            ctx.font = '400 36px "Sarabun"';
            renderWrappedText(chatraDict.tier2[s2], c2, 'left');
            renderWrappedText(chatraLongPrediction.tier2[s2], '#cccccc', 'left');
            cy += 40;
            
            if(!isMeasure){
                ctx.font = '700 36px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'left';
                ctx.fillText(`ด้านบารมีและการคุ้มครอง :`, cx, cy);
            }
            cy += 50;
            ctx.font = '400 36px "Sarabun"';
            renderWrappedText(chatraDict.tier3[s3], c3, 'left');
            renderWrappedText(chatraLongPrediction.tier3[s3], '#cccccc', 'left');
            cy += 60;
            
            if(!isMeasure){
                ctx.font = '700 36px "Sarabun"';
                ctx.fillStyle = '#d4af37';
                ctx.textAlign = 'left';
                ctx.fillText(`คำแนะนำจากตำรา :`, cx, cy);
            }
            cy += 50;
            ctx.font = '400 36px "Sarabun"';
            renderWrappedText("ควรหมั่นทำบุญ ไหว้พระ สวดมนต์ และรักษาจิตใจให้สงบ เพื่อเสริมดวงชะตาให้ดียิ่งขึ้นตลอดทั้งปี", '#cccccc', 'left');
            
            cy += 100;
            
            if (!isMeasure) {
                ctx.font = '400 30px "Sarabun"';
                ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
                ctx.textAlign = 'center';
                ctx.fillText("🔮 สยามโหรามงคล โดย ประธานโบ้", width/2, cy);
            }
            
            cy += 80;
            return cy;
        }
        
        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);
        
        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ฉัตร3ชั้น_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch(err) {
        console.error("เกิดข้อผิดพลาดในการสร้างภาพ:", err);
        if(typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}


