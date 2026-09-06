"use strict";

/**
 * 🌧️ เกณฑ์พิรุณศาสตร์ ชะตาโลก และเกณฑ์ดินฟ้าอากาศประจำปี
 * พัฒนาโดย: สยามโหรามงคล (ประธานโบ้)
 * อ้างอิง: คัมภีร์สุริยยาตร์ และคัมภีร์พรหมชาติโบราณ
 * รวมทั้ง:
 * 1. เกณฑ์พิรุณศาสตร์ (อธิบดีฝน และจำนวนห่าฝน ๔ ภูมิภพ)
 * 2. เกณฑ์นาคให้น้ำ (๑-๗ ตัว)
 * 3. เกณฑ์ธาราธิคุณ (วาโย/เตโช/อาโป/ปฐวี)
 * 4. เกณฑ์ธัญญาหาร (ผละ/ลาภะ/วิบัติ/ปาปะ/มณฑะ/โจร/ชยะ)
 * 5. ดาวธาตุพิรุณศาสตร์ประจำตัวชะตา (ดาว ๙ พระองค์)
 * 6. วิถีพิธีกรรมขอฝนตามหลักโบราณ
 */

/* =========================================================
   1. DICTIONARIES & CLASSICAL ASTROLOGICAL FORMULAS
========================================================= */

// 1. เกณฑ์พิรุณศาสตร์ (อธิบดีฝน & จำนวนห่าฝน) : สูตร (จ.ศ. - 4) mod 7
const PIRUN_PRESIDENTS = {
    1: { name: "พระอาทิตย์", symbol: "☀️", totalHa: 400, nature: "ฝนตกพอประมาณ แดดร้อน ธัญญาหารปานกลาง", element: "ธาตุไฟ" },
    2: { name: "พระจันทร์", symbol: "🌙", totalHa: 500, nature: "ฝนตกชุ่มฉ่ำ สม่ำเสมอ ธัญญาหารบริบูรณ์ดี", element: "ธาตุดิน" },
    3: { name: "พระอังคาร", symbol: "♂️", totalHa: 300, nature: "ฝนน้อย ลมพายุกล้า พืชผลอาจแห้งแล้งหรือมีอัคคีภัย", element: "ธาตุลม" },
    4: { name: "พระพุธ", symbol: "☿️", totalHa: 600, nature: "ฝนตกชุก มวลน้ำมาก พืชพรรณเจริญงอกงามดีเยี่ยม", element: "ธาตุน้ำ" },
    5: { name: "พระพฤหัสบดี", symbol: "♃", totalHa: 500, nature: "ฝนตกต้องตามฤดูกาล อุดมสมบูรณ์ ข้าวกล้าได้ผลดี", element: "ธาตุดิน" },
    6: { name: "พระศุกร์", symbol: "♀", totalHa: 600, nature: "ฝนตกชุก น้ำท่าอุดมสมบูรณ์ ข้าวปลาอาหารบริบูรณ์ยิ่ง", element: "ธาตุน้ำ" },
    0: { name: "พระเสาร์", symbol: "♄", totalHa: 400, nature: "ฝนตกปานกลาง แต่มักมีพายุ ลมแรง อากาศแปรปรวน", element: "ธาตุไฟ" }
};

// 2. เกณฑ์นาคให้น้ำ : สูตร (จ.ศ. + 1) mod 7 (ถ้า 0 ให้เป็น 7 ตัว)
const NAK_HAI_NAM_DICT = {
    1: { count: 1, desc: "นาคให้น้ำ ๑ ตัว · ทำนายว่า ปริมาณน้ำฝนจะมาก น้ำหลาก น้ำท่วมเรือกสวนไร่นา", icon: "🐉" },
    2: { count: 2, desc: "นาคให้น้ำ ๒ ตัว · ทำนายว่า ฝนตกชุกพอดี น้ำท่าอุดมสมบูรณ์ดี ข้าวกล้าได้ผลดี", icon: "🐉🐉" },
    3: { count: 3, desc: "นาคให้น้ำ ๓ ตัว · ทำนายว่า น้ำท่าบริบูรณ์ดี ผลผลิตเจริญงอกงาม", icon: "🐉🐉🐉" },
    4: { count: 4, desc: "นาคให้น้ำ ๔ ตัว · ทำนายว่า ฝนตกตามฤดูกาล พืชผลไร่นาได้ผลบริบูรณ์ดี", icon: "🐉" },
    5: { count: 5, desc: "นาคให้น้ำ ๕ ตัว · ทำนายว่า ฝนจะค่อนข้างน้อย ต้องกักเก็บน้ำไว้ใช้ในการเกษตร", icon: "🐉" },
    6: { count: 6, desc: "นาคให้น้ำ ๖ ตัว · ทำนายว่า ฝนแล้ง น้ำน้อย พืชผลอาจเสียหาย ข้าวกล้าไม่สู้งาม", icon: "🐉" },
    7: { count: 7, desc: "นาคให้น้ำ ๗ ตัว · ทำนายว่า นาคเกี่ยงน้ำกัน ฝนจะแล้งหนัก น้ำไม่เพียงพอแก่การเพาะปลูก", icon: "🐉" }
};

// 3. เกณฑ์ธาราธิคุณ : สูตร จ.ศ. mod 4
const THARATHIKUN_DICT = {
    1: { name: "วาโย (ธาตุลม)", desc: "ตกราศีวาโย ทำนายว่า อากาศแห้งแล้ง ลมพัดจัด ฝนฟ้าไม่สม่ำเสมอ พืชผลต้องระวังลมพายุ" },
    2: { name: "เตโช (ธาตุไฟ)", desc: "ตกราศีเตโช ทำนายว่า อากาศร้อนจัด ภัยแล้ง แดดแผดเผา น้ำน้อยกว่าปกติ" },
    3: { name: "อาโป (ธาตุน้ำ)", desc: "ตกราศีอาโป ทำนายว่า น้ำมาก ฝนชุก ชุ่มฉ่ำ แม่น้ำลำคลองบริบูรณ์ ข้าวกล้าเขียวชอุ่ม" },
    0: { name: "ปฐวี (ธาตุดิน)", desc: "ตกราศีปฐวี ทำนายว่า แผ่นดินอุดมสมบูรณ์ พืชพรรณธัญญาหารงอกงามมั่นคงดี" }
};

// 4. เกณฑ์ธัญญาหาร : สูตร (จ.ศ. + 1) mod 7
const THANYAHARN_DICT = {
    1: { name: "ผละ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๙ ส่วน เสียเพียง ๑ ส่วน ธัญญาหารบริบูรณ์ดีเลิศ ประชาชนอยู่เย็นเป็นสุข" },
    2: { name: "ลาภะ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๑๐ ส่วน เสีย ๑ ส่วน ข้าวปลาอาหารอุดมสมบูรณ์ มียศศักดิ์โชคลาภ" },
    3: { name: "วิบัติ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๕ ส่วน เสีย ๕ ส่วน มักมีแมลงศัตรูพืชรบกวน พืชผลเสียหายกึ่งหนึ่ง" },
    4: { name: "ปาปะ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๓ ส่วน เสีย ๗ ส่วน เกิดข้าวยากหมากแพง ประชาชนเดือดร้อน" },
    5: { name: "มณฑะ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๔ ส่วน เสีย ๖ ส่วน ผลผลิตไม่พอบริโภค ต้องประหยัดมัธยัสถ์" },
    6: { name: "โจร", desc: "ข้าวกล้าในภูมินาจะได้ผล ๖ ส่วน เสีย ๔ ส่วน มักมีสัตว์หรือโจรผู้ร้ายเบียดเบียนพืชผล" },
    0: { name: "ชยะ", desc: "ข้าวกล้าในภูมินาจะได้ผล ๘ ส่วน เสีย ๒ ส่วน ชัยชนะเหนืออุปสรรค พืชผลได้ผลดีพอประมาณ" }
};

// 5. ดาวธาตุพิรุณศาสตร์ประจำวันเกิด (ดาว ๙ พระองค์)
const PIRUN_BY_PLANET = {
    1: { planet: "อาทิตย์", symbol: "☀️", prediction: "น้ำฝนน้อย แดดร้อนจัด ธัญญาหารขาดแคลน พืชพรรณแห้งแล้ง", rainfall: "น้อย (0-50%)", crops: "ต้องการน้ำชลประทานเพิ่มเติม ระวังภัยแล้ง", recommendation: "เน้นปลูกพืชทนแล้ง พืชอายุสั้น และจัดทำแหล่งกักเก็บน้ำสำรอง" },
    2: { planet: "จันทร์", symbol: "🌙", prediction: "น้ำฝนปกติ ธัญญาหารดี มีน้ำเพียงพอบริโภคและเพาะปลูก", rainfall: "ปกติ (50-100%)", crops: "ผลผลิตสมดุล ธัญพืชและผลไม้อุดมสมบูรณ์", recommendation: "ปลูกพืชตามฤดูกาลปกติ ดูแลรักษาหน้าดินอย่างต่อเนื่อง" },
    3: { planet: "พฤหัสบดี", symbol: "♃", prediction: "น้ำฝนมาก ธัญญาหารอุดมสมบูรณ์ ผลผลิตงอกงามดีเยี่ยม", rainfall: "มาก (100-150%)", crops: "ผลผลิตสูง ข้าวปลาอาหารบริบูรณ์ ไร่นาเขียวชอุ่ม", recommendation: "เหมาะสำหรับการเพาะปลูกพืชทุกชนิด ขยายพื้นที่เกษตรกรรมได้ดี" },
    4: { planet: "ราหู", symbol: "🌑", prediction: "น้ำฝนแปรปรวน ลมพายุพัดพา เมฆหมอกปกคลุม อากาศผันผวน", rainfall: "แปรปรวน (60-120%)", crops: "พืชผลอาจเสียหายจากลมกรรโชกและแมลงศัตรูพืช", recommendation: "ทำแนวกันลมรอบสวน และตรวจตราแปลงเกษตรสม่ำเสมอ" },
    5: { planet: "พุธ", symbol: "☿️", prediction: "น้ำฝนปะปนแปรปรวน บางพื้นที่ดี บางพื้นที่แล้ง", rainfall: "ผันผวน (50-100%)", crops: "ผลผลิตไม่แน่นอน ขึ้นอยู่กับการบริหารจัดการน้ำ", recommendation: "เตรียมระบบน้ำหยดหรือระบบรดน้ำสำรองให้พร้อมรับมือ" },
    6: { planet: "ศุกร์", symbol: "♀", prediction: "น้ำฝนดี ชุ่มฉ่ำสม่ำเสมอ พืชพันธุ์เจริญเติบโตงดงาม", rainfall: "ดีมาก (80-120%)", crops: "ผลผลิตมั่นคง ตลาดต้องการสูง สร้างรายได้มหาศาล", recommendation: "เสริมการปลูกไม้ดอก ไม้ผล หรือพืชเศรษฐกิจมูลค่าสูง" },
    7: { planet: "เกตุ", symbol: "🪐", prediction: "ฝนฟ้าตกตามเทวบัญชา มีความชุ่มชื้นตามบุญบารมีสถานที่", rainfall: "ปานกลางถึงมาก (70-130%)", crops: "พืชสมุนไพร พืชศักดิ์สิทธิ์ หรือไม้มงคลเจริญงอกงาม", recommendation: "หมั่นทำบุญบูชาพระเจ้าน้ำเพื่อเสริมความอุดมสมบูรณ์" },
    8: { planet: "เสาร์", symbol: "♄", prediction: "น้ำฝนขาดแคลน ภัยแล้งยาวนาน ดินแตกระแหง ธัญญาหารน้อย", rainfall: "น้อย (20-50%)", crops: "ผลผลิตต่ำ ต้องระวังภัยแล้งและแมลงรบกวน", recommendation: "ขุดสระเก็บน้ำ คลุมดินด้วยฟาง ปลูกพืชทนความแห้งแล้งสูง" },
    9: { planet: "อังคาร", symbol: "♂️", prediction: "ฝนตกหนัก ลมพายุกล้า น้ำป่าไหลหลาก เสี่ยงน้ำท่วม", rainfall: "สูงกว่าปกติ (120-180%)", crops: "พืชผลอาจจมน้ำเสียหายจากอุทกภัย", recommendation: "ขุดลอกคูคลอง ระบายน้ำให้รวดเร็ว หลีกเลี่ยงแปลงในที่ลุ่มต่ำ" }
};

// 6. พิธีกรรมขอฝนตามหลักพิรุณศาสตร์โบราณ
const PIRUN_METHODS = [
    { name: "พิธีขอพระเจ้าน้ำ (เทวบูชา)", description: "บวงสรวงไหว้พระเจ้าน้ำ ท้าววรุณเทวราช หรือพญานาคราชในวันพระและวันมงคล" },
    { name: "การปล่อยสัตว์น้ำเสริมทานบารมี", description: "ปล่อยปลา ปล่อยเต่า สัตว์น้ำลงสู่แหล่งน้ำธรรมชาติ เพื่อสื่อสารความปรารถนาและต่อชะตาฟ้าฝน" },
    { name: "การทำบุญคันธารราษฎร์", description: "ประกอบพิธีสวดพระคาถาปลาช่อน หรืออัญเชิญพระพุทธรูปปางขอฝน (คันธารราษฎร์) เพื่อขอฟ้าขอฝน" },
    { name: "การรักษาศีลเจริญสัจจะอธิษฐาน", description: "ผู้นำชุมชนและเกษตรกรตั้งจิตในศีลธรรม อธิษฐานขอความร่มเย็นอุดมสมบูรณ์แก่แผ่นดิน" }
];

/* =========================================================
   2. RENDER MAIN PAGE HTML
========================================================= */
function showClimate() {
    const container = document.getElementById('climate-section');
    if (!container) return;

    const currentBE = new Date().getFullYear() + 543;

    const html = `
    <div class="chatra-universe-container pb-5">
        <!-- Glassmorphism Royal Card Header -->
        <div class="p-4 p-md-5 text-center" style="border-bottom: 1px solid rgba(241, 208, 110, 0.25);">
            <div class="chatra-header-badge mb-3">
                <i class="fas fa-cloud-showers-heavy text-gold"></i> มหาคัมภีร์สุริยยาตร์และพรหมชาติโบราณ
            </div>
            <h1 class="display-6 fw-bold text-gold mb-2" style="letter-spacing: 0.5px;">
                เกณฑ์พิรุณศาสตร์ (คาดการณ์ปริมาณฝนและชะตาโลก)
            </h1>
            <p class="text-muted mb-0" style="font-size: 1.05rem;">
                พยากรณ์ปริมาณน้ำฝน (ห่าฝน ๔ ภูมิภพ) นาคให้น้ำ ธาราธิคุณ ธัญญาหาร และดาวธาตุพิรุณประจำตัวชะตา
            </p>
        </div>

        <!-- Form Body -->
        <div class="p-4 p-md-5">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-10">
                    <div class="form-container p-4 p-md-5" style="background: rgba(13, 21, 39, 0.7); border: 1px solid rgba(241, 208, 110, 0.3); border-radius: 20px;">
                        <div class="form-group mb-4 text-start">
                            <label class="text-gold fw-semibold mb-2">
                                <i class="fas fa-user-circle mr-1"></i> เลือกจากรายชื่อสมาชิก (เพื่อดูปีเกิด/วันเกิด):
                            </label>
                            <select id="climateMemberSelect" class="form-control member-selector-shared"
                                onchange="autoFillMemberData(this.value); calculatePirun();">
                                <option value="">-- เลือกสมาชิก หรือคำนวณตามปี พ.ศ. ด้านล่าง --</option>
                            </select>
                        </div>

                        <div class="row g-3 text-start">
                            <div class="col-md-6">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-calendar-alt mr-1"></i> ระบุวันเกิด (เพื่อคำนวณดาวประจำตัว):
                                </label>
                                <input type="date" id="pirunBirthDate" class="form-control text-gold fw-semibold" onchange="syncYearFromDate()">
                            </div>
                            <div class="col-md-6">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-hourglass-half mr-1"></i> ปี พ.ศ. ที่ต้องการคำนวณเกณฑ์:
                                </label>
                                <input type="number" id="pirunYearBE" class="form-control text-gold fw-semibold" value="${currentBE}" min="1182" max="3000" placeholder="เช่น ${currentBE}">
                                <small class="text-muted" style="font-size: 0.8rem;">*คำนวณได้ทั้งปีเกิด หรือดูทำนายปีปัจจุบัน (${currentBE})</small>
                            </div>
                        </div>

                        <button type="button" class="btn btn-primary-gold w-100 py-3 mt-4 fw-bold" style="font-size: 1.1rem;" onclick="calculatePirun()">
                            <i class="fas fa-sparkles mr-2"></i> คำนวณมหาพยากรณ์พิรุณศาสตร์ครบวงจร
                        </button>
                    </div>
                </div>
            </div>

            <!-- Result Section -->
            <div id="pirunResult" class="mt-5" style="display: none;"></div>

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
    `;
    container.innerHTML = html;
}

function syncYearFromDate() {
    const bDate = document.getElementById('pirunBirthDate');
    const yBE = document.getElementById('pirunYearBE');
    if (bDate && bDate.value && yBE) {
        const yr = new Date(bDate.value).getFullYear() + 543;
        yBE.value = yr;
    }
}

/* =========================================================
   3. CALCULATION CORE FUNCTION (COMBINED CRITERIA)
========================================================= */
function calculatePirun() {
    const yearEl = document.getElementById('pirunYearBE');
    const birthDateEl = document.getElementById('pirunBirthDate');
    const resultEl = document.getElementById('pirunResult');

    let be = parseInt(yearEl ? yearEl.value : 0);
    if (!be || isNaN(be) || be < 1182) {
        if (birthDateEl && birthDateEl.value) {
            be = new Date(birthDateEl.value).getFullYear() + 543;
            if (yearEl) yearEl.value = be;
        } else {
            if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาระบุปี พ.ศ. ให้ถูกต้อง (มากกว่า พ.ศ. ๑๑๘๒)', 'warning');
            else alert('กรุณาระบุปี พ.ศ. ให้ถูกต้อง');
            return;
        }
    }

    const cs = be - 1181; // จุลศักราช

    // 1. เกณฑ์พิรุณศาสตร์ (อธิบดีฝน และ ห่าฝน) : (จ.ศ. - 4) mod 7
    let pRem = ((cs - 4) % 7 + 7) % 7;
    const president = PIRUN_PRESIDENTS[pRem];
    const totalHa = president.totalHa;

    // การกระจายห่าฝน 4 ส่วน: รวมเป็น 10 ส่วน (เขาจักรวาล 4, ป่าหิมพานต์ 3, มหาสมุทร 2, มนุษย์โลก 1)
    const haChakkrawan = (totalHa * 4) / 10;
    const haHimmaphan = (totalHa * 3) / 10;
    const haSamut = (totalHa * 2) / 10;
    const haManut = (totalHa * 1) / 10;

    // 2. เกณฑ์นาคให้น้ำ : (จ.ศ. + 1) mod 7 (ถ้า 0 คือ 7)
    let nakRem = ((cs + 1) % 7 + 7) % 7;
    if (nakRem === 0) nakRem = 7;
    const nakInfo = NAK_HAI_NAM_DICT[nakRem];

    // 3. เกณฑ์ธาราธิคุณ : จ.ศ. mod 4
    let tharaRem = ((cs % 4) + 4) % 4;
    const tharaInfo = THARATHIKUN_DICT[tharaRem];

    // 4. เกณฑ์ธัญญาหาร : (จ.ศ. + 1) mod 7
    let thanyaRem = ((cs + 1) % 7 + 7) % 7;
    const thanyaInfo = THANYAHARN_DICT[thanyaRem];

    // 5. ดาวธาตุพิรุณศาสตร์ประจำวันเกิด (ถ้ามีการระบุวันเกิด)
    let personalPlanetHtml = '';
    let birthDayNum = 1;
    if (birthDateEl && birthDateEl.value) {
        const bDate = new Date(birthDateEl.value);
        birthDayNum = bDate.getDate();
        const pNum = (birthDayNum % 9) || 9;
        const pPlanet = PIRUN_BY_PLANET[pNum];

        if (pPlanet) {
            personalPlanetHtml = `
            <div class="col-lg-12 mb-4">
                <div class="chatra-result-card p-4" style="background: rgba(13, 21, 39, 0.9); border: 1.5px solid rgba(241, 208, 110, 0.4);">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="card-tier-tag text-gold border-gold">
                            <i class="fas fa-star mr-1"></i> ดาวธาตุพิรุณศาสตร์ประจำตัวชะตา (เกิดวันที่ ${birthDayNum})
                        </span>
                        <span class="badge bg-gold text-dark p-2 fw-bold">พระ${pPlanet.planet}ครองธาตุ</span>
                    </div>

                    <div class="row align-items-center g-3">
                        <div class="col-md-3 text-center">
                            <div style="font-size: 3.5rem; text-shadow: 0 0 20px rgba(241,208,110,0.6);">
                                ${pPlanet.symbol}
                            </div>
                            <h4 class="text-gold fw-bold mb-0">พระ${pPlanet.planet}</h4>
                            <small class="text-white-50">ดาวกำเนิดประจำตัว</small>
                        </div>
                        <div class="col-md-9">
                            <div class="p-3 rounded-3 mb-2" style="background: rgba(241, 208, 110, 0.1); border-left: 4px solid #f1d06e;">
                                <strong class="text-gold"><i class="fas fa-cloud-rain mr-1"></i> เกณฑ์ปริมาณน้ำฝนส่วนตัว: </strong>
                                <span class="text-white fw-bold">${pPlanet.rainfall}</span> — <span class="text-white-50">${pPlanet.prediction}</span>
                            </div>
                            <div class="p-3 rounded-3 mb-2" style="background: rgba(8, 13, 24, 0.8); border: 1px solid rgba(241, 208, 110, 0.25);">
                                <strong class="text-gold"><i class="fas fa-seedling mr-1"></i> สภาพธัญญาหารและพืชผล: </strong>
                                <span class="text-white small">${pPlanet.crops}</span>
                            </div>
                            <div class="p-3 rounded-3" style="background: rgba(30, 46, 78, 0.4); border: 1px solid rgba(241, 208, 110, 0.3);">
                                <strong class="text-gold"><i class="fas fa-lightbulb mr-1"></i> คำแนะนำการเกษตรและวิถีชีวิต: </strong>
                                <span class="text-muted small">${pPlanet.recommendation}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }

    resultEl.innerHTML = `
        <div class="text-center mb-4">
            <div class="chatra-header-badge">
                <i class="fas fa-award text-gold"></i> มหาพยากรณ์พิรุณศาสตร์ประจำปี พ.ศ. ${be} (จ.ศ. ${cs})
            </div>
            <h3 class="text-gold mt-2">อธิบดีฝน · ปริมาณห่าฝน ๔ ภูมิภพ · เกณฑ์นาคให้น้ำและชะตาโลก</h3>
        </div>

        <div class="row g-4 justify-content-center">
            <!-- Personal Birth Planet (If Available) -->
            ${personalPlanetHtml}

            <!-- Main Rain & President Card -->
            <div class="col-lg-6">
                <div class="chatra-result-card h-100 d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="card-tier-tag text-gold border-gold">
                            <i class="fas fa-crown mr-1"></i> อธิบดีฝนประจำปี
                        </span>
                        <span class="badge bg-gold text-dark p-2 fw-bold" style="font-size: 0.95rem;">
                            ฝนรวมทั้งสิ้น ${totalHa} ห่า
                        </span>
                    </div>

                    <div class="text-center my-3">
                        <div style="font-size: 4rem; text-shadow: 0 0 25px rgba(241,208,110,0.6);">
                            ${president.symbol}
                        </div>
                        <h3 class="text-gold fw-bold mt-2">พระ${president.name} เป็นอธิบดีฝน</h3>
                        <div class="badge bg-dark border border-gold text-gold px-3 py-1">${president.element}</div>
                        <p class="text-white-50 small mt-2 mb-0">${president.nature}</p>
                    </div>

                    <hr style="border-top: 1px dashed rgba(241, 208, 110, 0.3); margin: 15px 0;">

                    <!-- Distribution of Rain (4 Realms) -->
                    <h5 class="text-gold mb-3"><i class="fas fa-globe-asia mr-2"></i> สัดส่วนการตกของฝนใน ๔ ภูมิภพ :</h5>
                    
                    <div class="row g-2 text-center">
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(13, 21, 39, 0.85); border: 1px solid rgba(241, 208, 110, 0.25);">
                                <small class="text-muted d-block">🪐 ตกในเขาจักรวาล</small>
                                <strong class="text-gold" style="font-size: 1.25rem;">${haChakkrawan} ห่า</strong>
                                <small class="text-white-50 d-block">(๔ ใน ๑๐ ส่วน)</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(13, 21, 39, 0.85); border: 1px solid rgba(241, 208, 110, 0.25);">
                                <small class="text-muted d-block">🌲 ตกในป่าหิมพานต์</small>
                                <strong class="text-gold" style="font-size: 1.25rem;">${haHimmaphan} ห่า</strong>
                                <small class="text-white-50 d-block">(๓ ใน ๑๐ ส่วน)</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(13, 21, 39, 0.85); border: 1px solid rgba(241, 208, 110, 0.25);">
                                <small class="text-muted d-block">🌊 ตกในมหาสมุทร</small>
                                <strong class="text-gold" style="font-size: 1.25rem;">${haSamut} ห่า</strong>
                                <small class="text-white-50 d-block">(๒ ใน ๑๐ ส่วน)</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(241, 208, 110, 0.15); border: 1.5px solid #f1d06e;">
                                <small class="text-gold d-block fw-bold">🏡 ตกในมนุษย์โลก</small>
                                <strong class="text-white" style="font-size: 1.35rem; text-shadow: 0 0 10px #f1d06e;">${haManut} ห่า</strong>
                                <small class="text-gold d-block fw-semibold">(๑ ใน ๑๐ ส่วน)</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nak, Criteria & Rituals Card -->
            <div class="col-lg-6">
                <div class="chatra-result-card h-100 d-flex flex-column p-4">
                    <div class="card-tier-tag mb-3" style="width: fit-content;">
                        <i class="fas fa-water"></i> เกณฑ์นาค ธารา และธัญญาหาร
                    </div>

                    <!-- Nak Hai Nam -->
                    <div class="p-3 rounded-3 mb-2" style="background: rgba(13, 21, 39, 0.8); border: 1px solid rgba(241, 208, 110, 0.3);">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="text-gold"><i class="fas fa-dragon mr-1"></i> เกณฑ์นาคให้น้ำ :</strong>
                            <span class="badge bg-gold text-dark fw-bold">นาค ${nakInfo.count} ตัว</span>
                        </div>
                        <p class="text-white-50 small mb-0 lh-lg">${nakInfo.desc}</p>
                    </div>

                    <!-- Tharathikun -->
                    <div class="p-3 rounded-3 mb-2" style="background: rgba(13, 21, 39, 0.8); border: 1px solid rgba(56, 189, 248, 0.35);">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="text-info"><i class="fas fa-wind mr-1"></i> เกณฑ์ธาราธิคุณ :</strong>
                            <span class="badge bg-info text-dark fw-bold">ราศี${tharaInfo.name}</span>
                        </div>
                        <p class="text-white-50 small mb-0 lh-lg">${tharaInfo.desc}</p>
                    </div>

                    <!-- Thanyaharn -->
                    <div class="p-3 rounded-3 mb-3" style="background: rgba(13, 21, 39, 0.8); border: 1px solid rgba(74, 222, 128, 0.35);">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="text-success"><i class="fas fa-seedling mr-1"></i> เกณฑ์ธัญญาหาร :</strong>
                            <span class="badge bg-success text-dark fw-bold">ชื่อ${thanyaInfo.name}</span>
                        </div>
                        <p class="text-white-50 small mb-0 lh-lg">${thanyaInfo.desc}</p>
                    </div>

                    <!-- Ancient Rituals Box -->
                    <div class="p-3 rounded-3 flex-grow-1" style="background: rgba(20, 30, 52, 0.6); border: 1px solid rgba(241, 208, 110, 0.25);">
                        <h6 class="text-gold mb-2"><i class="fas fa-hands-praying mr-1"></i> พิธีกรรมขอฝนตามหลักโบราณ :</h6>
                        <ul class="list-unstyled small mb-0">
                            ${PIRUN_METHODS.map(m => `
                                <li class="py-1 text-white-50">
                                    <strong class="text-gold">• ${m.name}:</strong> ${m.description}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Export Action Button -->
        <div class="mt-4 d-flex justify-content-center gap-3">
            <button onclick="downloadPirunImage(event)" class="btn btn-primary-gold px-4 py-2 fw-bold">
                <i class="fas fa-image mr-2"></i> บันทึกรูปภาพพิรุณศาสตร์
            </button>
        </div>
    `;

    resultEl.style.opacity = '0';
    resultEl.style.display = 'block';
    setTimeout(() => {
        resultEl.style.transition = 'opacity 0.6s ease-in-out';
        resultEl.style.opacity = '1';
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}

/* =========================================================
   4. IMAGE EXPORT FUNCTION (HIGH RESOLUTION CANVAS)
========================================================= */
async function downloadPirunImage(e) {
    const yearEl = document.getElementById('pirunYearBE');
    const birthDateEl = document.getElementById('pirunBirthDate');
    let be = parseInt(yearEl ? yearEl.value : 0);
    if (!be || isNaN(be) || be < 1182) {
        if (birthDateEl && birthDateEl.value) {
            be = new Date(birthDateEl.value).getFullYear() + 543;
        } else {
            if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาระบุปี พ.ศ. ให้ถูกต้องก่อนบันทึกภาพ', 'warning');
            else alert('กรุณาระบุปี พ.ศ. ให้ถูกต้อง');
            return;
        }
    }

    const btn = e ? e.currentTarget : null;
    let originalText = '';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังสร้างภาพความละเอียดสูง...';
        btn.disabled = true;
    }

    try {
        const cs = be - 1181;
        let pRem = ((cs - 4) % 7 + 7) % 7;
        const president = PIRUN_PRESIDENTS[pRem];
        const totalHa = president.totalHa;

        const haChakkrawan = (totalHa * 4) / 10;
        const haHimmaphan = (totalHa * 3) / 10;
        const haSamut = (totalHa * 2) / 10;
        const haManut = (totalHa * 1) / 10;

        let nakRem = ((cs + 1) % 7 + 7) % 7;
        if (nakRem === 0) nakRem = 7;
        const nakInfo = NAK_HAI_NAM_DICT[nakRem];

        let tharaRem = ((cs % 4) + 4) % 4;
        const tharaInfo = THARATHIKUN_DICT[tharaRem];

        let thanyaRem = ((cs + 1) % 7 + 7) % 7;
        const thanyaInfo = THANYAHARN_DICT[thanyaRem];

        // Personal Planet
        let pPlanet = null;
        let bDayNum = 0;
        if (birthDateEl && birthDateEl.value) {
            const bDate = new Date(birthDateEl.value);
            bDayNum = bDate.getDate();
            const pNum = (bDayNum % 9) || 9;
            pPlanet = PIRUN_BY_PLANET[pNum];
        }

        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 4000;
        const ctx = canvas.getContext('2d');

        await document.fonts.ready;

        const drawContent = (isMeasure = false) => {
            let cy = 80;
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

                // Luxury Golden Border
                ctx.strokeStyle = '#f1d06e';
                ctx.lineWidth = 3;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(40, 40, width - 80, canvas.height - 80, 24);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(40, 40, width - 80, canvas.height - 80);
                }

                // Inner Frame
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
                ctx.fillText("👑 มหาคัมภีร์สุริยยาตร์และพรหมชาติโบราณ", width/2, cy);
                cy += 50;

                ctx.font = '700 50px "Prompt", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'middle';
                ctx.fillText("เกณฑ์พิรุณศาสตร์และชะตาโลก", width/2, cy);
                cy += 60;

                ctx.font = '400 30px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textBaseline = 'middle';
                ctx.fillText(`พยากรณ์ประจำปี พ.ศ. ${be} (จุลศักราช ${cs})`, width/2, cy);
                cy += 40;

                // Divider Line
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(width/2 - 240, cy);
                ctx.lineTo(width/2 + 240, cy);
                ctx.stroke();
                cy += 45;
            } else {
                cy += 215;
            }

            // Text Wrapping Helper
            const renderWrappedText = (text, textColor = '#e8e9f5', fontSize = 26, lineHeight = 40, align = 'left', targetX = cx, targetW = maxW) => {
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

            // 1. Personal Planet Box (If Present)
            if (pPlanet) {
                const boxPad = 24;
                const blockW = width - 160;
                const startPersY = cy;
                let persInnerY = startPersY + boxPad;

                if (!isMeasure) {
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`⭐ ดาวธาตุพิรุณศาสตร์ประจำตัว (เกิดวันที่ ${bDayNum}) : พระ${pPlanet.planet}`, cx + boxPad, persInnerY);
                }
                persInnerY += 40;

                const pLine1 = `• เกณฑ์ปริมาณน้ำฝนส่วนตัว : ${pPlanet.rainfall} (${pPlanet.prediction})`;
                const pLine2 = `• สภาพธัญญาหารและพืชผล : ${pPlanet.crops}`;
                const pLine3 = `• คำแนะนำเกษตรและวิถีชีวิต : ${pPlanet.recommendation}`;

                cy = persInnerY;
                renderWrappedText(`${pLine1}\n${pLine2}\n${pLine3}`, '#e2e8f0', 25, 38, 'left', cx + boxPad, blockW - (boxPad * 2));
                cy += boxPad;

                const persBoxH = cy - startPersY;
                if (!isMeasure) {
                    ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                    ctx.lineWidth = 1.5;
                    ctx.fillStyle = 'rgba(20, 30, 52, 0.85)';
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(cx, startPersY, blockW, persBoxH, 18);
                        ctx.fill();
                        ctx.stroke();
                    }

                    let redrawPersY = startPersY + boxPad;
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`⭐ ดาวธาตุพิรุณศาสตร์ประจำตัว (เกิดวันที่ ${bDayNum}) : พระ${pPlanet.planet}`, cx + boxPad, redrawPersY);
                    redrawPersY += 40;
                    cy = redrawPersY;
                    renderWrappedText(`${pLine1}\n${pLine2}\n${pLine3}`, '#e2e8f0', 25, 38, 'left', cx + boxPad, blockW - (boxPad * 2));
                    cy = startPersY + persBoxH;
                }
                cy += 20;
            }

            // Symbol & President Name
            if (!isMeasure) {
                ctx.font = '70px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(president.symbol, width/2, cy + 10);
            }
            cy += 65;

            if (!isMeasure) {
                ctx.font = '700 42px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`พระ${president.name} เป็นอธิบดีฝน (ฝน ${totalHa} ห่า)`, width/2, cy);
            }
            cy += 50;

            // 4 Realms Rain Distribution Box
            const distPad = 24;
            const distW = width - 160;
            const startDistY = cy;
            let distInnerY = startDistY + distPad;

            if (!isMeasure) {
                ctx.font = '600 26px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("🌧️ สัดส่วนการตกของฝนใน ๔ ภูมิภพ :", cx + distPad, distInnerY);
            }
            distInnerY += 40;

            const r1 = `• เขาจักรวาล : ตก ${haChakkrawan} ห่า (๔ ใน ๑๐ ส่วน)`;
            const r2 = `• ป่าหิมพานต์ : ตก ${haHimmaphan} ห่า (๓ ใน ๑๐ ส่วน)`;
            const r3 = `• มหาสมุทร : ตก ${haSamut} ห่า (๒ ใน ๑๐ ส่วน)`;
            const r4 = `• มนุษย์โลก : ตก ${haManut} ห่า (๑ ใน ๑๐ ส่วน)`;

            cy = distInnerY;
            renderWrappedText(`${r1}\n${r2}\n${r3}\n${r4}`, '#ffffff', 25, 38, 'left', cx + distPad, distW - (distPad * 2));
            cy += distPad;

            const distBoxH = cy - startDistY;
            if (!isMeasure) {
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.fillStyle = 'rgba(20, 30, 52, 0.75)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cx, startDistY, distW, distBoxH, 18);
                    ctx.fill();
                    ctx.stroke();
                }

                let redrawDistY = startDistY + distPad;
                ctx.font = '600 26px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("🌧️ สัดส่วนการตกของฝนใน ๔ ภูมิภพ :", cx + distPad, redrawDistY);
                redrawDistY += 40;

                cy = redrawDistY;
                renderWrappedText(`${r1}\n${r2}\n${r3}\n${r4}`, '#ffffff', 25, 38, 'left', cx + distPad, distW - (distPad * 2));
                cy = startDistY + distBoxH;
            }
            cy += 20;

            // Card Rendering Block Helper
            const renderInfoCard = (badgeTitle, mainLine, subLine, strokeColor = '#f1d06e') => {
                const boxPad = 24;
                const blockW = width - 160;
                const startCardY = cy;
                let cardInnerY = startCardY + boxPad;

                if (!isMeasure) {
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, cardInnerY);
                }
                cardInnerY += 38;

                if (!isMeasure) {
                    ctx.font = '700 28px "Prompt", sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${mainLine}`, cx + boxPad, cardInnerY);
                }
                cardInnerY += 44;

                cy = cardInnerY;
                renderWrappedText(subLine, '#e2e8f0', 25, 38, 'left', cx + boxPad, blockW - (boxPad * 2));
                cy += boxPad;

                const cardBoxH = cy - startCardY;
                if (!isMeasure) {
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1.5;
                    ctx.fillStyle = 'rgba(20, 30, 52, 0.75)';
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(cx, startCardY, blockW, cardBoxH, 18);
                        ctx.fill();
                        ctx.stroke();
                    }

                    let redrawY = startCardY + boxPad;
                    ctx.font = '600 26px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, redrawY);
                    redrawY += 38;

                    ctx.font = '700 28px "Prompt", sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${mainLine}`, cx + boxPad, redrawY);
                    redrawY += 44;

                    cy = redrawY;
                    renderWrappedText(subLine, '#e2e8f0', 25, 38, 'left', cx + boxPad, blockW - (boxPad * 2));
                    cy = startCardY + cardBoxH;
                }
                cy += 20;
            };

            // Render other 3 criteria
            renderInfoCard("🐉 เกณฑ์นาคให้น้ำ", `นาคให้น้ำ ${nakInfo.count} ตัว`, nakInfo.desc, 'rgba(56, 189, 248, 0.4)');
            renderInfoCard("🌊 เกณฑ์ธาราธิคุณ", `ตกในราศี${tharaInfo.name}`, tharaInfo.desc, 'rgba(168, 85, 247, 0.4)');
            renderInfoCard("🌾 เกณฑ์ธัญญาหาร", `ชื่อเกณฑ์${thanyaInfo.name}`, thanyaInfo.desc, 'rgba(74, 222, 128, 0.4)');

            // Footer
            cy += 30;
            if (!isMeasure) {
                ctx.font = '500 24px "Prompt", sans-serif';
                ctx.fillStyle = 'rgba(241, 208, 110, 0.85)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("🔮 สยามโหรามงคล · ระบบพยากรณ์โหราศาสตร์ไทยชั้นสูง", width/2, cy);
            }
            cy += 50;

            return cy;
        };

        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);

        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_พิรุณศาสตร์_พศ${be}_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch(err) {
        console.error("เกิดข้อผิดพลาดในการสร้างภาพ:", err);
        if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

/* =========================================================
   5. AUTO INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    showClimate();
});

window.showClimate = showClimate;
window.calculatePirun = calculatePirun;
window.downloadPirunImage = downloadPirunImage;
window.syncYearFromDate = syncYearFromDate;
