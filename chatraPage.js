"use strict";

/**
 * Logic: ฉัตร 3 ชั้น (สูตรคำนวณเศษอายุ)
 * ชั้น 1: อายุ + 1 % 3
 * ชั้น 2: อายุ + 2 % 7
 * ชั้น 3: อายุ + 3 % 8
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
                            <label class="text-gold mb-2">ระบุอายุที่ต้องการตรวจ (ปีปัจจุบัน)</label>
                            <input type="number" id="chatraAge" placeholder="กรอกอายุ (เช่น 25)"
                                onkeypress="if(event.key === 'Enter') { event.preventDefault(); calculateChatra(); }"
                                class="btn btn-outline-gold px-5 py-2" /><br>                            
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
        if (value === 0) {
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else if (value === 1) {
            textEl.classList.add('text-info-bright');
        } else { // value === 2 → ดีที่สุด
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    } 
    else if (type === 'mid') { // ชั้น 2
        if ([0, 3].includes(value)) {
            textEl.classList.add('text-warning-bright');   // ไม่ดี
        } else if ([2, 4, 6].includes(value)) {
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');             // ดี
        } else {
            textEl.classList.add('text-white');            // ปานกลาง
        }
    } 
    else if (type === 'top') { // ชั้น 3
        if (value === 0) {
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else {
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    }
}

const chatraLongPrediction = {
    tier1: [
        "ปีนี้ดวงชะตาชั้นฐานตกอยู่ในเกณฑ์ลำบาก ท่านจะพบอุปสรรคและความวุ่นวายบ่อยครั้ง งานที่ทำอาจติดขัด เงินทองไหลออกง่าย ควรระวังการลงทุนใหญ่และการเป็นหนี้บุญคุณใคร ระวังคนใกล้ชิดนำปัญหามาให้ แนะนำให้หมั่นทำบุญ สวดมนต์ และรักษาสุขภาพให้แข็งแรง อย่าทุ่มเทแรงกายแรงใจเกินไปจนหมดตัว หากอดทนผ่านปีนี้ไปได้ ปีหน้าจะดีขึ้นอย่างเห็นได้ชัด",
        "ดวงชะตาชั้นฐานปานกลาง ท่านสามารถประคองตัวได้ตลอดปี แม้จะมีเรื่องให้ต้องปวดหัวบ้าง แต่ก็ยังพอมีโอกาสให้แก้ไข งานการจะค่อนข้างทรงตัว เงินเข้าเงินออกพอใช้ ควรระวังเรื่องคำพูดและการทะเลาะวิวาทกับผู้ใหญ่หรือบริวาร แนะนำให้ทำบุญทุกเดือนและหมั่นไหว้พระเพื่อเสริมสิริมงคล ปีนี้เหมาะกับการวางแผนมากกว่าการลงมือทำใหญ่โต",
        "ดวงชะตาชั้นฐานรุ่งโรจน์มาก ปีนี้ท่านจะมีโชคช่วยเหลือ หยิบจับสิ่งใดก็ราบรื่น งานการเจริญก้าวหน้า เงินทองไหลมาเทมา ลาภยศและชื่อเสียงจะติดตามมา บริวารและผู้ใหญ่ให้การสนับสนุนเต็มที่ ควรใช้โอกาสนี้ในการขยายกิจการหรือลงทุนใหม่ แต่ก็อย่าลืมทำบุญอุทิศส่วนกุศลเพื่อรักษาโชคนี้ไว้ให้นานที่สุด"
    ],
    tier2: [
        "ด้านการเงินและการงานในปีนี้ ท่านจะต้องจ่ายเงินออกมาก เก็บเงินไม่อยู่ มีค่าใช้จ่ายฉุกเฉินบ่อยครั้ง งานที่ทำอาจเหนื่อยล้าและไม่เป็นไปตามแผน ควรระวังการกู้ยืมหรือค้ำประกันใคร หมั่นตรวจสอบบัญชีและควบคุมการใช้จ่ายให้ดี แนะนำให้ทำบุญตัดกรรมและสวดมนต์ขอพรจากสิ่งศักดิ์สิทธิ์เพื่อคลายเคราะห์",
        "การเงินและการงานทรงตัวพอใช้ ไม่เด่นไม่ด้อย เงินเข้าเงินออกคล่องตัวปานกลาง งานราบรื่นแต่ไม่ก้าวกระโดด ควรใช้ความอดทนและความระมัดระวังในการตัดสินใจ บริวารและเพื่อนร่วมงานช่วยเหลือได้บ้าง แนะนำให้ทำบุญทุก ๑๕ ค่ำและแรม ๑๕ ค่ำเพื่อเสริมสิริมงคล",
        "ปีนี้มีโชคลาภลอยเข้ามาไม่คาดคิด อาจได้เงินก้อนจากงานอดิเรก การลงทุน หรือผู้ใหญ่ให้ การงานจะขยับขยาย มีโอกาสได้เลื่อนตำแหน่งหรือขยายธุรกิจ ควรคว้าโอกาสนี้ไว้ให้ดี แต่ก็อย่าประมาท ระวังคนอิจฉา",
        "งานในปีนี้จะทำให้ท่านเหนื่อยกายและเหนื่อยใจ ต้องทำงานหนักแต่ผลตอบแทนไม่คุ้มค่า ควรระวังสุขภาพและความเครียด อาจมีเรื่องขัดแย้งกับผู้ร่วมงาน แนะนำให้พักผ่อนให้เพียงพอและทำบุญเพื่อลดแรงกดดัน",
        "ผู้ใหญ่และผู้มีพระคุณจะเข้ามาหนุนหลังอย่างเต็มที่ งานการจะราบรื่นขึ้น มีโอกาสได้งานใหม่หรือตำแหน่งที่ดีกว่า ควรแสดงความกตัญญูและรักษาความสัมพันธ์ไว้ให้ดี ปีนี้เหมาะกับการขอความช่วยเหลือจากผู้ใหญ่",
        "บริวาร ลูกน้อง และคนรอบข้างจะช่วยเหลือท่านเป็นอย่างดี งานที่ทำจะสำเร็จด้วยความร่วมมือของทีม ควรดูแลบริวารและให้ความเป็นธรรมกับพวกเขาเพื่อรักษาโชคนี้ไว้",
        "งานการในปีนี้จะขยับขยาย มีการเติบโตทั้งในด้านขนาดและรายได้ อาจได้เปิดสาขาใหม่หรือขยายธุรกิจ คว้าโอกาสนี้ไว้ แต่ต้องวางแผนให้ดีและไม่ประมาท"
    ],
    tier3: [
        "ระวังคนปองร้ายและศัตรูแอบแฝง ปีนี้จะมีคนคิดร้ายหรือใส่ร้ายท่าน ควรระมัดระวังคำพูดและการกระทำ อย่าเปิดเผยความลับให้ใครมากเกินไป หมั่นทำบุญและสวดมนต์ขอพรเทวดาเพื่อป้องกันภัย",
        "เทวดาและสิ่งศักดิ์สิทธิ์จะคอยคุ้มครองท่านตลอดปี จะแคล้วคลาดจากอุบัติเหตุและภัยพิบัติ เรื่องร้าย ๆ จะคลี่คลายด้วยตัวเอง ควรทำบุญบ่อย ๆ เพื่อตอบแทนบุญคุณ",
        "ปีนี้ท่านจะแคล้วคลาดปลอดภัยจากทุกภัย เรื่องคดีความหรือปัญหาใหญ่จะได้รับการช่วยเหลืออย่างทันท่วงที ชื่อเสียงและเกียรติยศจะเพิ่มขึ้น ควรใช้โอกาสนี้ในการสร้างสัมพันธ์ที่ดี",
        "ชื่อเสียงและบารมีของท่านจะโดดเด่นเป็นที่รู้จัก งานที่ทำจะได้รับการยอมรับจากสังคม อาจมีข่าวดีเรื่องการเลื่อนตำแหน่งหรือได้รับรางวัล ควรรักษาพฤติกรรมและทำบุญเพื่อให้บารมีนี้ยั่งยืน",
        "บริวารและคนรอบข้างจะให้คุณแก่ท่านมาก ช่วยเหลือในยามยากและนำโชคมาให้ ควรดูแลและให้ความเมตตาแก่พวกเขา",
        "ท่านจะสามารถชนะอุปสรรคทั้งปวงที่เข้ามา ทุกปัญหาจะได้รับการแก้ไขด้วยปัญญาและความเพียร ควรมีสติและศรัทธาในสิ่งที่ดี",
        "สิ่งที่ท่านปรารถนาจะสำเร็จสมความต้องการ งาน การเงิน ความรัก และสุขภาพจะไปในทิศทางที่ดี ควรตั้งใจและทำบุญอุทิศส่วนกุศล",
        "ปีนี้ท่านจะมีอำนาจวาสนาแผ่ไพศาล มีคนนับหน้าถือตาและให้ความเคารพ งานราชการหรือธุรกิจจะเจริญรุ่งเรือง ควรใช้พลังนี้ในการช่วยเหลือผู้อื่นและทำบุญเพื่อรักษาโชค"
    ]
};

function calculateChatra() {
    const ageInput = document.getElementById('chatraAge').value.trim();
    const age = parseInt(ageInput);

    if (!age || age <= 0 || isNaN(age)) {
        alert("โปรดระบุอายุเป็นตัวเลขที่ถูกต้อง (มากกว่า 0)");
        return;
    }

    // คำนวณเศษตามสูตร
    const s1 = (age + 1) % 3;
    const s2 = (age + 2) % 7;
    const s3 = (age + 3) % 8;

    const chatraDict = {
        tier1: [
            "ตกที่นั่งลำบาก (ต้องระวัง)",
            "ดวงปานกลาง (ประคองตัวได้)",
            "ดวงรุ่งโรจน์ (หยิบจับอะไรเป็นเงิน)"
        ],
        tier2: [
            "จ่ายมากเก็บไม่อยู่",
            "การเงินทรงตัว",
            "มีโชคลาภลอย",
            "เหนื่อยเรื่องงาน",
            "ผู้ใหญ่หนุนหลัง",
            "บริวารช่วยเหลือ",
            "งานขยับขยาย"
        ],
        tier3: [
            "ระวังคนปองร้าย",
            "เทวดาคุ้มครอง",
            "แคล้วคลาดปลอดภัย",
            "ชื่อเสียงโดดเด่น",
            "บริวารให้คุณ",
            "ชนะอุปสรรคทั้งปวง",
            "สำเร็จสมความปรารถนา",
            "มีอำนาจวาสนาแผ่ไพศาล"
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

// ฟังก์ชันบันทึกภาพฉัตร (แก้ไขแล้ว)
function downloadChatraImage(e) {
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังเตรียมรูป...';
    btn.disabled = true;

    const container = document.getElementById("chatraDisplay");

    html2canvas(container, {
        backgroundColor: "#121212",
        scale: 3,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
            // ซ่อนปุ่มดาวน์โหลด
            const buttons = clonedDoc.querySelectorAll('button[data-action="download-chatra"]');
            buttons.forEach(btn => btn.style.display = 'none');

            const clonedDisplay = clonedDoc.getElementById("chatraDisplay");

            // ปรับแต่ง container สำหรับรูปภาพ
            clonedDisplay.style.padding = "80px 50px 120px 50px";
            clonedDisplay.style.width = "1080px";           // กำหนดความกว้างชัดเจน
            clonedDisplay.style.minHeight = "1350px";
            clonedDisplay.style.position = "relative";
            clonedDisplay.style.display = "flex";
            clonedDisplay.style.flexDirection = "column";
            clonedDisplay.style.alignItems = "center";
            clonedDisplay.style.backgroundColor = "#121212";
            clonedDisplay.style.borderRadius = "12px";

            // หัวข้อด้านบน
            const header = clonedDoc.createElement("div");
            header.innerHTML = "✨ มหามงคลพยากรณ์: ฉัตร 3 ชั้น ✨";
            header.style.cssText = `
                position: absolute;
                top: 40px;
                left: 0;
                width: 100%;
                text-align: center;
                color: #d4af37;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 4px;
                text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
            `;
            clonedDisplay.prepend(header);

            // ฟุตเตอร์ด้านล่าง
            const footer = clonedDoc.createElement("div");
            footer.innerHTML = "🔮 สยามโหรามงคล โดย ประธานโบ้";
            footer.style.cssText = `
                position: absolute;
                bottom: 40px;
                left: 0;
                width: 100%;
                text-align: center;
                color: rgba(212, 175, 55, 0.75);
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                text-shadow: 1px 1px 6px rgba(0,0,0,0.9);
            `;
            clonedDisplay.appendChild(footer);
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ฉัตร3ชั้น_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // คืนค่าปุ่ม
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("เกิดข้อผิดพลาดในการสร้างภาพ:", err);
        alert("ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง");
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}


