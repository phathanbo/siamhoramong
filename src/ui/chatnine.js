"use strict";

/**
 * Logic: ฉัตร 9 ชั้น (ตำราหลวงทรงพล)
 * พัฒนาโดย: สยามโหรามงคล (ประธานโบ้)
 * อ้างอิง: ข้อมูลตามคัมภีร์หลวงทรงพล (นับเริ่มจากฐานวันเกิด เดินตามผังนวเคราะห์ ๙ มงคล)
 */

// 1. ลำดับการเดินตัวเลขฉัตร 9 ชั้น (ผังยันต์หน้า 8)
const chatraSequence = [1, 9, 2, 3, 4, 7, 5, 8, 6];

// 2. ข้อมูลเทพเจ้าและฝอยพยากรณ์แบบเต็ม พร้อมไอคอน ทิศ และสัตว์พาหนะ
const chatra9FullData = {
    1: { 
        number: 1,
        name: "สีหะโฉลก", 
        god: "พระสุริยเทพ", 
        mount: "พญาราชสีห์ (สิงโตทอง)", 
        direction: "ทิศตะวันออกเฉียงเหนือ (อิสาณ)", 
        icon: "🦁",
        color: "#ff6b6b", 
        badgeBg: "rgba(255, 107, 107, 0.15)",
        headline: "มักพาลผิดพ้องญาติ เกิดอัคคีภัย ระวังโลหิตและอุบัติเหตุ",
        desc: "แหล่งอิสาณ มักพาลผิดพ้องญาติ เกิดอาฆาตอัคคีภัย โลหิตไหลจากตน หนหน่ายกลบีทา กัดวัดถาแพรพรรณ์ วัตถุอันใดประหยัด เร่งระมัดจงดี",
        advice: "ควรระวังการมีปากเสียงกับญาติมิตร ระวังไฟและของมีคม หมั่นบริจาคโลหิต หรือทำบุญถวายหลอดไฟ น้ำมันตะเกียง เพื่อคลี่คลายเคราะห์ภัย"
    },
    9: { 
        number: 9,
        name: "สิทธิโชคนาโค", 
        god: "พระเกตุบดีเทพ", 
        mount: "พญานาคราช", 
        direction: "มัชฌิมภาค (ศูนย์กลางผัง)", 
        icon: "🐉",
        color: "#f1d06e", 
        badgeBg: "rgba(241, 208, 110, 0.15)",
        headline: "ลาภทุกข์ยากกล่าวทาย ร้ายกึ่งดี ตลอดปีต้องใช้ความเพียร",
        desc: "มัชฌิมภาค ลาภทุกข์ยากกล่าวทาย เป็นแต่ร้ายกึ่งดี ตลอดปีโชคอับ ครุ่นคิดคับใจครัน",
        advice: "ปีนี้เป็นเกณฑ์เสมอตัว มีทั้งดีและร้ายปนกัน อย่าเพิ่งลงทุนใหญ่ ให้เน้นถือศีลภาวนา สวดมนต์บทพระมหาจักรพรรดิหรือบูชาพญานาคเพื่อเปิดทางโชคลาภ"
    },
    2: { 
        number: 2,
        name: "จันโทบูรพา", 
        god: "พระโสมบดี", 
        mount: "ม้าขาวพรหมจรรย์", 
        direction: "ทิศตะวันออก (บูรพา)", 
        icon: "🐎",
        color: "#38bdf8", 
        badgeBg: "rgba(56, 189, 248, 0.15)",
        headline: "ระวังวาจาพาเดือดร้อน แผลหาย จะได้โชคลาภจากสตรีผู้รู้",
        desc: "ภิมิบอก ตะวันออกร้ายมาก เกิดความเพราะปากเอง เป็นขี้เกรงจะสึก คฤหัสถ์นึกอยากบวช เจ็บปวดบาดแผลหาย แต่จะได้ดังความคิด เหตุบัณฑิตนารี มีศัตรูมาเป็นมิตร พาดผูกผิดให้โทษ ชายโหดผมหยิกหยอง หญิงอะล่องเหลืองขาว ทำให้เราข้องขุ่นอย่าหมกมุ่นคบหา",
        advice: "ระวังคำพูดและการรับปากใคร มีเกณฑ์ได้รับความช่วยเหลือจากผู้ใหญ่ที่เป็นหญิง ควรทำบุญค่าน้ำ ทำทานแก่แม่ชี หรือถวายน้ำดื่มแด่พระสงฆ์"
    },
    3: { 
        number: 3,
        name: "มหิงษาภัยพิพิธ", 
        god: "พระอังคารบดี", 
        mount: "พญากระบือ (ควายสาร)", 
        direction: "ทิศตะวันออกเฉียงใต้ (อาคเณย์)", 
        icon: "🐃",
        color: "#ff6b6b", 
        badgeBg: "rgba(255, 107, 107, 0.15)",
        headline: "ระวังโรคภัยไข้เจ็บ เสียทรัพย์สิน อย่าให้ใครหยิบยืมเงิน",
        desc: "ประจำทิศอาคเณย์ โรคประเดเคืองเข็ญ เป็นทั้งในและนอก กับลาภงอกได้เมีย สินทรัพย์เสียก่ายกอง ริปูปองปรับทัณฑ์ ชายโสดพรรณพร่างสี่ หญิงอัปรีย์พิการ ทรัพย์สินทานเร่งรู้ อย่าให้กู้เกิดเข็ญ",
        advice: "ระวังสุขภาพเรื่องกล้ามเนื้อ อุบัติเหตุ และการถูกเบียดเบียนเรื่องเงิน อย่าค้ำประกันหรือให้กู้ยืม ควรทำบุญปล่อยสัตว์ ไถ่ชีวิตโคกระบือ"
    },
    4: { 
        number: 4,
        name: "คชสิทธิชัยโย", 
        god: "พระพุทธาธิบดี", 
        mount: "คชสาร (พญาช้างสาร)", 
        direction: "ทิศใต้ (ทักษิณ)", 
        icon: "🐘",
        color: "#4ade80", 
        badgeBg: "rgba(74, 222, 128, 0.15)",
        headline: "ชนะอุปสรรคคดีความ ลาภสักการะพิพัฒน์ผล ความสำเร็จงดงาม",
        desc: "เด่นแดนใต้ ห้ามมิให้กินเนื้อนก จักร้อนอกเจ็บท้อง หากความพ้องเราชนะ ลาภสการไกวลด พิพัฒน์ผลโสภี",
        advice: "การเจรจา ค้าขาย หรือการแข่งขันจะสำเร็จมีชัยชนะ งดเว้นการกินเนื้อนกหรือสัตว์ปีกในวันพระ หมั่นทำบุญปล่อยปลาและถวายหนังสือสวดมนต์"
    },
    7: { 
        number: 7,
        name: "พยัคโฆภัยหลาก", 
        god: "พระโสธรบดีเทพ (พระเสาร์)", 
        mount: "พญาพยัคฆ์ (เสือโคร่ง)", 
        direction: "ทิศตะวันตกเฉียงใต้ (หรดี)", 
        icon: "🐅",
        color: "#fb923c", 
        badgeBg: "rgba(251, 146, 60, 0.15)",
        headline: "ระวังของรักสูญหาย อย่าเดินทางผิดเวลา มูลนายเพื่อนฝูงให้ระวัง",
        desc: "มีหรดีถิ่นเนา เกรงภัยเผาพอกตน ประหยัดสินจงหนัก เสียของรักยุ่งใหญ่ เหตุมูลนายเพื่อนฝูง ร้ายถลุงหลายทิศ อย่าเดินทางผิดเวลา ลาภตาส่ำมากมี",
        advice: "ดูแลทรัพย์สินของมีค่าให้ดี หลีกเลี่ยงการสังสรรค์ยามวิกาล ควรทำบุญสร้างกระเบื้องมุงหลังคาโบสถ์ หรือถวายผ้าไตรจีวรเพื่อเสริมดวง"
    },
    5: { 
        number: 5,
        name: "มฤคมากลาภหลาย", 
        god: "พระวิหับดีเทพ (พระพฤหัสบดี)", 
        mount: "พญากวางทอง", 
        direction: "ทิศตะวันตก (ประจิม)", 
        icon: "🦌",
        color: "#f1d06e", 
        badgeBg: "rgba(241, 208, 110, 0.15)",
        headline: "มหามงคลภิญโญทรัพย์ มั่งคั่งอักขู บัณฑิตและผู้ใหญ่เมตตา",
        desc: "ประจิมทิศถิ่น สวัสดีภิญโญทรัพย์ มั่งคับอักขู ทั้งผู้ใหญ่และบัณฑิต ทั้งบรรพชิตพราหมณา มากเมตตาดีครัน",
        advice: "เป็นเกณฑ์มหาโชค ผู้ใหญ่ ครูอาจารย์ และพระสงฆ์เกื้อหนุน เหมาะแก่การเริ่มต้นกิจการใหม่ ทำบุญตักบาตร ไหว้พระพรหม และบูชาครูอาจารย์"
    },
    8: { 
        number: 8,
        name: "สุวรรณภัยพอกสิง", 
        god: "พระราหูเทพ", 
        mount: "พญาเวนไตย (พญาครุฑ)", 
        direction: "ทิศตะวันตกเฉียงเหนือ (พายัพ)", 
        icon: "🦅",
        color: "#fb923c", 
        badgeBg: "rgba(251, 146, 60, 0.15)",
        headline: "จิตใจร้อนรนวายวุ่น ระวังหลงผิดทิ้งแบบแผนเก่า",
        desc: "พายัพอิงแอบเนา จิตต์ร้อนเร่าวายวุ่น คิดข้องขุ่นผิดเป็นชอบ ทิ้งระบอบแบบแผน ความเก่าเล่นติดตน",
        advice: "ควรฝึกสมาธิ ควบคุมอารมณ์ อย่าหลงเชื่อคำชักชวนในสิ่งผิดกฎหมายหรืออบายมุข ไหว้พระราหู ทำบุญบริจาคโลงศพ หรือไถ่ชีวิตสัตว์"
    },
    6: { 
        number: 6,
        name: "อุศุภอิงแอบลาภ", 
        god: "พระศุกรเทพ", 
        mount: "พญาอุศุภราช (โคเผือก)", 
        direction: "ทิศเหนือ (อุดร)", 
        icon: "🐂",
        color: "#38bdf8", 
        badgeBg: "rgba(56, 189, 248, 0.15)",
        headline: "สถาพรโภคผล ลาภทรัพย์พูนทวี ระวังปากและอย่าสู่ความผู้อื่น",
        desc: "หนอุดร สถาพรโภคผล ระวังคนจงมาก ระวังปากจงดี อย่าสู่ความเขา เราจะเกิดร้อนรน อย่าเดินหนผิดกาล ภัยจักพาลติดตน",
        advice: "การเงินการค้าคล่องตัว ได้รับโชคลาภอย่างต่อเนื่อง ระวังอย่าเข้าไปเป็นคนกลางไกล่เกลี่ยเรื่องของผู้อื่น ทำบุญถวายดอกไม้สดสวยงาม พวงมาลัยหอมแด่พระประธาน"
    }
};

function showchatranine(){
    const container = document.getElementById('showchatraninePage');
    if (!container) return;

    const html = `
        <div class="chatra-universe-container pb-5">
            <!-- Glassmorphism Royal Card Header -->
            <div class="p-4 p-md-5 text-center" style="border-bottom: 1px solid rgba(241, 208, 110, 0.25);">
                <div class="chatra-header-badge mb-3">
                    <i class="fas fa-compass text-gold"></i> ศาสตร์พยากรณ์นวเคราะห์ชั้นสูง
                </div>
                <h1 class="display-6 fw-bold text-gold mb-2" style="letter-spacing: 0.5px;">
                    วิชามหามงคล "ฉัตร ๙ ชั้น"
                </h1>
                <p class="text-muted mb-0" style="font-size: 1.05rem;">
                    พยากรณ์เกณฑ์ชะตาชีวิตประจำปี ตามคัมภีร์ตำรับหลวงทรงพล โหราศาสตร์โบราณ
                </p>
            </div>

            <!-- Form Body -->
            <div class="p-4 p-md-5">
                <div class="row justify-content-center">
                    <div class="col-lg-6 col-md-8">
                        <div class="form-container p-4" style="background: rgba(13, 21, 39, 0.7); border: 1px solid rgba(241, 208, 110, 0.3); border-radius: 18px;">
                            <div class="form-group mb-3 text-start">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-user-circle mr-1"></i> เลือกจากรายชื่อสมาชิก (ประวัติ):
                                </label>
                                <select id="memberSelect"
                                    class="form-control member-selector-shared"
                                    onchange="autoFillMemberData(this.value)">
                                    <option value="">-- เลือกสมาชิก หรือคำนวณแบบระบุอายุ --</option>
                                </select>
                            </div>

                            <div class="form-group mb-3 text-start">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-calendar-day mr-1"></i> วันเกิดของท่าน (ฐานตั้งต้นในผังยันต์):
                                </label>
                                <select id="chatraninebirthDaySelect"
                                    class="form-control text-gold fw-semibold">
                                    <option value="7">วันอาทิตย์ — เลข ๑ (สีหะโฉลก · ทรงราชสีห์)</option>
                                    <option value="1">วันจันทร์ — เลข ๒ (จันโทบูรพา · ทรงม้าขาว)</option>
                                    <option value="2">วันอังคาร — เลข ๓ (มหิงษาภัยพิพิธ · ทรงกระบือ)</option>
                                    <option value="3">วันพุธ — เลข ๔ (คชสิทธิชัยโย · ทรงคชสาร)</option>
                                    <option value="6">วันเสาร์ — เลข ๗ (พยัคโฆภัยหลาก · ทรงพยัคฆ์)</option>
                                    <option value="4">วันพฤหัสบดี — เลข ๕ (มฤคมากลาภหลาย · ทรงกวางทอง)</option>
                                    <option value="5">วันศุกร์ — เลข ๖ (อุศุภอิงแอบลาภ · ทรงโคเผือก)</option>
                                </select>
                            </div>

                            <div class="form-group mb-4 text-start">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-birthday-cake mr-1"></i> อายุย่างตามปฏิทิน (คำนวณอัตโนมัติ):
                                </label>
                                <input type="number" id="chatranineAge" placeholder="กรอกอายุย่าง (เช่น 25, 36, 42)"
                                    onkeypress="if(event.key === 'Enter') { event.preventDefault(); calculateChatnine(); }"
                                    class="form-control text-center text-gold fw-bold" style="font-size: 1.25rem;" />
                            </div>

                            <button type="button" onclick="calculateChatnine()" class="btn btn-primary-gold w-100 py-3 fw-bold" style="font-size: 1.1rem;">
                                <i class="fas fa-sparkles mr-2"></i> คำนวณมหาพยากรณ์ฉัตร ๙ ชั้น
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Display Results Section -->
                <div id="chatranineDisplay" class="mt-5" style="display: none;">
                    <div class="text-center mb-4">
                        <div class="chatra-header-badge">
                            <i class="fas fa-sun text-gold"></i> ผังนวเคราะห์ ๙ มงคลเวียนทักษิณาวัฏ
                        </div>
                        <h3 class="text-gold mt-2">ผลการพยากรณ์ผังฉัตร ๙ ชั้น</h3>
                    </div>

                    <!-- 9-Tiers Compass / Yantra Grid Visual -->
                    <div class="row justify-content-center mb-4">
                        <div class="col-lg-8">
                            <div class="p-3 rounded-4 border-gold text-center" style="background: rgba(10, 16, 30, 0.75);">
                                <h6 class="text-gold mb-3"><i class="fas fa-dharmachakra fa-spin mr-1" style="animation-duration: 15s;"></i> ผังยันต์ ๙ ทิศนวเคราะห์ประจำปี</h6>
                                <div class="d-flex flex-wrap justify-content-center gap-2" id="yantraGridBadges">
                                    ${chatraSequence.map(num => {
                                        const d = chatra9FullData[num];
                                        return `
                                            <div id="yantraBadge_${num}" class="p-2 px-3 rounded-3 text-center border transition-all" 
                                                 style="background: rgba(255,255,255,0.03); border-color: rgba(241,208,110,0.2); min-width: 105px; opacity: 0.5;">
                                                <div style="font-size: 1.4rem;">${d.icon}</div>
                                                <div class="text-gold fw-bold small">เลข ${num}</div>
                                                <div class="text-muted" style="font-size: 0.72rem;">${d.name.split(' ')[0]}</div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Prediction Showcase Card -->
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="chatra-result-card text-center p-4 p-md-5" id="chatra9MainCard" style="border: 2px solid #f1d06e; box-shadow: 0 0 35px rgba(241, 208, 110, 0.25);">
                                <div id="chatra9BadgeEmblem" class="mb-3" style="font-size: 3.5rem; text-shadow: 0 0 20px rgba(241,208,110,0.6);">
                                    🦁
                                </div>
                                <div class="card-tier-tag mx-auto mb-2" id="chatra9NumberTag">
                                    ฉัตรชั้นที่ - · -
                                </div>
                                <h2 class="text-gold fw-bold mb-1" id="chatra9Name" style="letter-spacing: 0.5px;">-</h2>
                                <h5 class="text-white-50 mb-3" id="chatra9God">-</h5>

                                <div class="p-3 rounded-3 mb-4 text-start" id="chatra9HeadlineBox" style="background: rgba(241, 208, 110, 0.1); border-left: 4px solid #f1d06e;">
                                    <strong class="text-gold"><i class="fas fa-bolt mr-1"></i> เกณฑ์ชะตาสำคัญ: </strong>
                                    <span class="text-white" id="chatra9HeadlineText">-</span>
                                </div>

                                <div class="p-4 rounded-4 mb-4 text-start" style="background: rgba(8, 13, 24, 0.85); border: 1px solid rgba(241, 208, 110, 0.2);">
                                    <h6 class="text-gold mb-2"><i class="fas fa-scroll mr-2"></i> คำโคลงฝอยพยากรณ์โบราณ :</h6>
                                    <p class="text-white mb-0 lh-lg lead" style="font-size: 1.05rem;" id="chatra9PoemDesc">-</p>
                                </div>

                                <div class="p-3 rounded-3 text-start mb-4" style="background: rgba(30, 46, 78, 0.4); border: 1px solid rgba(241, 208, 110, 0.3);">
                                    <h6 class="text-gold mb-1"><i class="fas fa-lightbulb mr-2"></i> คำแนะนำและข้อปฏิบัติเสริมมงคล :</h6>
                                    <p class="text-muted small mb-0 lh-lg" id="chatra9AdviceText">-</p>
                                </div>

                                <div class="mt-4 d-flex flex-wrap justify-content-center gap-3">
                                    <button onclick="downloadChatnineImage(event)" class="btn btn-primary-gold px-4 py-2 fw-bold">
                                        <i class="fas fa-image mr-2"></i> บันทึกรูปภาพคำพยากรณ์
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Footer -->
                    <div class="row mt-5 pt-3 justify-content-center">
                        <div class="col-md-4 col-6">
                            <button class="btn btn-outline-gold w-100 py-2 border-0" onclick="navigateTo('mainpage')">
                                <i class="fas fa-chevron-left mr-2"></i> กลับห้องพยากรณ์
                            </button>
                        </div>
                        <div class="col-md-4 col-6">
                            <button class="btn btn-outline-gold w-100 py-2 border-0" onclick="goBack()">
                                <i class="fas fa-home mr-2"></i> กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    showchatranine();
});

function calculateChatnine() {
    const ageInput = document.getElementById('chatranineAge');
    const birthDayInput = document.getElementById('chatraninebirthDaySelect');

    if (!ageInput || !birthDayInput) {
        console.error("หาองค์ประกอบ HTML ไม่เจอ ตรวจสอบ ID อีกครั้ง");
        return;
    }

    const age = parseInt(ageInput.value);
    const startDay = parseInt(birthDayInput.value);

    if (!age || age <= 0 || isNaN(age)) {
        if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณากรอกอายุย่างของท่านเป็นตัวเลขที่ถูกต้อง', 'warning');
        else alert('กรุณากรอกอายุย่างของท่านเป็นตัวเลขที่ถูกต้อง');
        return;
    }

    // 1. สูตรหาจำนวนก้าว: (อายุ - 1) % 9
    let steps = (age - 1) % 9;

    // 2. หาตำแหน่งเริ่มต้นในยันต์ตามวันเกิด
    let startIndex = chatraSequence.indexOf(startDay);

    // 3. นับเวียนไปตามจำนวนก้าว
    let finalIndex = (startIndex + steps) % 9;
    let finalNumber = chatraSequence[finalIndex];
    const result = chatra9FullData[finalNumber];

    if (!result) return;

    // 4. Highlight Yantra Badges
    chatraSequence.forEach(num => {
        const badge = document.getElementById(`yantraBadge_${num}`);
        if (badge) {
            if (num === finalNumber) {
                badge.style.opacity = '1';
                badge.style.background = result.badgeBg;
                badge.style.borderColor = result.color;
                badge.style.transform = 'scale(1.08)';
                badge.style.boxShadow = `0 0 15px ${result.color}55`;
            } else {
                badge.style.opacity = '0.4';
                badge.style.background = 'rgba(255,255,255,0.03)';
                badge.style.borderColor = 'rgba(241,208,110,0.2)';
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = 'none';
            }
        }
    });

    // 5. Update Main Showcase Card
    const emblemEl = document.getElementById('chatra9BadgeEmblem');
    if (emblemEl) emblemEl.innerText = result.icon;

    const tagEl = document.getElementById('chatra9NumberTag');
    if (tagEl) {
        tagEl.innerText = `ฉัตรชั้นที่ ${finalNumber} · ${result.direction}`;
        tagEl.style.color = result.color;
        tagEl.style.borderColor = result.color;
    }

    const nameEl = document.getElementById('chatra9Name');
    if (nameEl) {
        nameEl.innerText = `${result.name} (เลข ${result.number})`;
        nameEl.style.color = result.color;
    }

    const godEl = document.getElementById('chatra9God');
    if (godEl) godEl.innerText = `💠 เทพประจำฉัตร: ${result.god} · ทรง${result.mount}`;

    const headBox = document.getElementById('chatra9HeadlineBox');
    if (headBox) {
        headBox.style.background = result.badgeBg;
        headBox.style.borderLeftColor = result.color;
    }

    const headText = document.getElementById('chatra9HeadlineText');
    if (headText) headText.innerText = result.headline;

    const poemEl = document.getElementById('chatra9PoemDesc');
    if (poemEl) poemEl.innerText = result.desc;

    const adviceEl = document.getElementById('chatra9AdviceText');
    if (adviceEl) adviceEl.innerText = result.advice;

    // 6. Reveal Display
    const display = document.getElementById('chatranineDisplay');
    if (display) {
        display.style.opacity = '0';
        display.style.display = 'block';
        setTimeout(() => {
            display.style.transition = 'opacity 0.6s ease-in-out';
            display.style.opacity = '1';
            display.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

async function downloadChatnineImage(e) {
    const ageInput = document.getElementById('chatranineAge');
    const birthDayInput = document.getElementById('chatraninebirthDaySelect');
    if (!ageInput || !birthDayInput || !ageInput.value) {
        if(typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ', 'warning');
        else alert('กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ');
        return;
    }

    const btn = e ? e.currentTarget : null;
    let originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังสร้างภาพความละเอียดสูง...';
        btn.disabled = true;
    }

    try {
        const age = parseInt(ageInput.value);
        const startDay = parseInt(birthDayInput.value);
        
        let steps = (age - 1) % 9;
        let startIndex = chatraSequence.indexOf(startDay);
        let finalIndex = (startIndex + steps) % 9;
        let finalNumber = chatraSequence[finalIndex];
        const result = chatra9FullData[finalNumber];
        
        if (!result) return;
        
        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3600;
        const ctx = canvas.getContext('2d');
        
        await document.fonts.ready;
        
        const drawContent = (isMeasure = false) => {
            let cy = 100;
            const cx = 80;
            const maxW = width - 160;
            
            if (!isMeasure) {
                // Background Gradient
                let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#0c1424');
                grad.addColorStop(0.3, '#14223c');
                grad.addColorStop(0.7, '#0d1628');
                grad.addColorStop(1, '#080d1a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, canvas.height);
                
                // Luxury Outer Golden Border
                ctx.strokeStyle = '#f1d06e';
                ctx.lineWidth = 3;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(40, 40, width - 80, canvas.height - 80, 24);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(40, 40, width - 80, canvas.height - 80);
                }

                // Inner Delicate Frame
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.25)';
                ctx.lineWidth = 1;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(50, 50, width - 100, canvas.height - 100, 18);
                    ctx.stroke();
                }
                
                // Header Titles
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e'; 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("👑 ศาสตร์พยากรณ์นวเคราะห์ชั้นสูง", width/2, cy);
                cy += 55;
                
                ctx.font = '700 52px "Prompt", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'middle';
                ctx.fillText("วิชามหามงคล \"ฉัตร ๙ ชั้น\"", width/2, cy);
                cy += 65;

                ctx.font = '400 32px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textBaseline = 'middle';
                ctx.fillText(`พยากรณ์เกณฑ์ชะตาประจำปี · อายุย่าง ${age} ปี`, width/2, cy);
                cy += 45;

                // Divider Line
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(width/2 - 220, cy);
                ctx.lineTo(width/2 + 220, cy);
                ctx.stroke();
                cy += 45;
            } else {
                cy += 220;
            }
            
            // Central Emblem Badge
            if (!isMeasure) {
                ctx.font = '90px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(result.icon, width/2, cy + 20);
            }
            cy += 85;

            // Tier Tag
            if (!isMeasure) {
                ctx.font = '600 26px "Prompt", sans-serif';
                ctx.fillStyle = result.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`ฉัตรชั้นที่ ${result.number} · ${result.direction}`, width/2, cy);
            }
            cy += 45;

            // Name
            if (!isMeasure) {
                ctx.font = '700 48px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${result.name}`, width/2, cy);
            }
            cy += 55;

            // Deity & Mount
            if (!isMeasure) {
                ctx.font = '500 30px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`💠 เทพประจำฉัตร: ${result.god} · ทรง${result.mount}`, width/2, cy);
            }
            cy += 65;

            // Text Wrapping Helper
            const renderWrappedText = (text, textColor = '#e8e9f5', fontSize = 28, lineHeight = 44, align = 'left', targetX = cx, targetW = maxW) => {
                ctx.font = `400 ${fontSize}px "Prompt", sans-serif`;
                let pLines = [];
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(text);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > targetW && currentLine.trim() !== '') {
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
                        if (ctx.measureText(testLine).width > targetW && j > 0) {
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
                        ctx.textBaseline = 'top';
                        ctx.fillText(l, targetX, cy);
                    }
                    cy += lineHeight;
                }
            };

            // Headline Box
            const boxPad = 26;
            const blockW = width - 160;
            const startHLY = cy;
            let hlInnerY = startHLY + boxPad;

            if (!isMeasure) {
                ctx.font = '700 30px "Prompt", sans-serif';
                ctx.fillStyle = result.color;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("⚡ เกณฑ์ชะตาสำคัญ :", cx + boxPad, hlInnerY);
            }
            hlInnerY += 46;

            cy = hlInnerY;
            renderWrappedText(result.headline, '#ffffff', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
            cy += boxPad;

            const hlBoxH = cy - startHLY;
            if (!isMeasure) {
                ctx.strokeStyle = result.color;
                ctx.lineWidth = 1.5;
                ctx.fillStyle = 'rgba(20, 30, 52, 0.75)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cx, startHLY, blockW, hlBoxH, 16);
                    ctx.fill();
                    ctx.stroke();
                }

                // Redraw text on top of box
                let redrawY = startHLY + boxPad;
                ctx.font = '700 30px "Prompt", sans-serif';
                ctx.fillStyle = result.color;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("⚡ เกณฑ์ชะตาสำคัญ :", cx + boxPad, redrawY);
                redrawY += 46;
                cy = redrawY;
                renderWrappedText(result.headline, '#ffffff', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
                cy = startHLY + hlBoxH;
            }
            cy += 30;

            // Poem Description Box
            const startPoemY = cy;
            let poemInnerY = startPoemY + boxPad;

            if (!isMeasure) {
                ctx.font = '600 30px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("📜 คำโคลงฝอยพยากรณ์โบราณ :", cx + boxPad, poemInnerY);
            }
            poemInnerY += 48;

            cy = poemInnerY;
            renderWrappedText(result.desc, '#e2e8f0', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
            cy += boxPad;

            const poemBoxH = cy - startPoemY;
            if (!isMeasure) {
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.35)';
                ctx.lineWidth = 1.5;
                ctx.fillStyle = 'rgba(20, 30, 52, 0.65)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cx, startPoemY, blockW, poemBoxH, 16);
                    ctx.fill();
                    ctx.stroke();
                }

                let redrawPoemY = startPoemY + boxPad;
                ctx.font = '600 30px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("📜 คำโคลงฝอยพยากรณ์โบราณ :", cx + boxPad, redrawPoemY);
                redrawPoemY += 48;
                cy = redrawPoemY;
                renderWrappedText(result.desc, '#e2e8f0', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
                cy = startPoemY + poemBoxH;
            }
            cy += 30;

            // Advice Box
            const startAdvY = cy;
            let advInnerY = startAdvY + boxPad;

            if (!isMeasure) {
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("💡 คำแนะนำและข้อปฏิบัติเสริมมงคล :", cx + boxPad, advInnerY);
            }
            advInnerY += 46;

            cy = advInnerY;
            renderWrappedText(result.advice, '#cbd5e1', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
            cy += boxPad;

            const advBoxH = cy - startAdvY;
            if (!isMeasure) {
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1;
                ctx.fillStyle = 'rgba(30, 46, 78, 0.5)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cx, startAdvY, blockW, advBoxH, 16);
                    ctx.fill();
                    ctx.stroke();
                }

                let redrawAdvY = startAdvY + boxPad;
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("💡 คำแนะนำและข้อปฏิบัติเสริมมงคล :", cx + boxPad, redrawAdvY);
                redrawAdvY += 46;
                cy = redrawAdvY;
                renderWrappedText(result.advice, '#cbd5e1', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
                cy = startAdvY + advBoxH;
            }

            cy += 50;
            if (!isMeasure) {
                ctx.font = '500 26px "Prompt", sans-serif';
                ctx.fillStyle = 'rgba(241, 208, 110, 0.85)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("🔮 สยามโหรามงคล · ระบบพยากรณ์โหราศาสตร์ไทยชั้นสูง", width/2, cy);
            }
            cy += 70;

            return cy;
        };
        
        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);
        
        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ฉัตร9ชั้น_อายุ${age}_${new Date().getTime()}.png`;
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