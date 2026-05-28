"use strict";

/**
 * Logic: ฉัตร 9 ชั้น (ตำราหลวงทรงพล)
 * พัฒนาโดย: สยามโหรามงคล (ประธานโบ้)
 * อ้างอิง: ข้อมูลจากภาพหน้า 7-21 (นับเริ่มจากฐานวันเกิด)
 */

// 1. ลำดับการเดินตัวเลขฉัตร 9 ชั้น (ผังยันต์หน้า 8)
const chatraSequence = [1, 9, 2, 3, 4, 7, 5, 8, 6];

// 2. ข้อมูลเทพเจ้าและฝอยพยากรณ์แบบเต็ม (ถอดจากตำราหน้า 16-17)
const chatra9FullData = {
    1: { name: "สีหะโฉลก", god: "พระสุริยเทพ (ทรงพญาราชสีห์)", style: "glow-red", color: "#ff4d4d", desc: "แหล่งอิสาณ มักพาลผิดพ้องญาติ เกิดอาฆาตอัคคีภัย โลหิตไหลจากตน หนหน่ายกลบีทา กัดวัดถาแพรพรรณ์ วัตถุอันใดประหยัด เร่งระมัดจงดี" },
    9: { name: "สิทธิโชคนาโค", god: "พระเกตุบดีเทพ (ทรงนาคราช)", style: "glow-gold", color: "#d4af37", desc: "มัชฌิมภาค ลาภทุกข์ยากกล่าวทาย เป็นแต่ร้ายกึ่งดี ตลอดปีโชคอับ ครุ่นคิดคับใจครัน" },
    2: { name: "จันโทบูรพา", god: "พระโสมบดี (ทรงม้าขาว)", style: "glow-gold", color: "#d4af37", desc: "ภิมิบอก ตะวันออกร้ายมาก เกิดความเพราะปากเอง เป็นขี้เกรงจะสึก คฤหัสถ์นึกอยากบวช เจ็บปวดบาดแผลหาย แต่จะได้ดังความคิด เหตุบัณฑิตนารี มีศัตรูมาเป็นมิตร พาดผูกผิดให้โทษ ชายโหดผมหยิกหยอง หญิงอะล่องเหลืองขาว ทำให้เราข้องขุ่นอย่าหมกมุ่นคบหา" },
    3: { name: "มหิงษาภัยพิพิธ", god: "พระอังคารบดี (ทรงควาย)", style: "glow-red", color: "#ff4d4d", desc: "ประจำทิศอาคเณย์ โรคประเดเคืองเข็ญ เป็นทั้งในและนอก กับลาภงอกได้เมีย สินทรัพย์เสียก่ายกอง ริปูปองปรับทัณฑ์ ชายโสดพรรณพร่างสี่ หญิงอัปรีย์พิการ ทรัพย์สินทานเร่งรู้ อย่าให้กู้เกิดเข็ญ" },
    4: { name: "คชสิทธิชัยโย", god: "พระพุทธาธิบดี (ทรงช้าง)", style: "glow-green", color: "#28a745", desc: "เด่นแดนใต้ ห้ามมิให้กินเนื้อนก จักร้อนอกเจ็บท้อง หากความพ้องเราชนะ ลาภสการไกวลด พิพัฒน์ผลโสภี" },
    7: { name: "พยัคโฆภัยหลาก", god: "พระโสธรบดีเทพ (ทรงเสือ)", style: "glow-orange", color: "#ffa500", desc: "มีหรดีถิ่นเนา เกรงภัยเผาพอกตน ประหยัดสินจงหนัก เสียของรักยุ่งใหญ่ เหตุมูลนายเพื่อนฝูง ร้ายถลุงหลายทิศ อย่าเดินทางผิดเวลา ลาภตาส่ำมากมี" },
    5: { name: "มฤคมากลาภหลาย", god: "พระวิหับดีเทพ (ทรงกวาง)", style: "glow-gold", color: "#d4af37", desc: "ประจิมทิศถิ่น สวัสดีภิญโญทรัพย์ มั่งคับอักขู ทั้งผู้ใหญ่และบัณฑิต ทั้งบรรพชิตพราหมณา มากเมตตาดีครัน" },
    8: { name: "สุวรรณภัยพอกสิง", god: "พระราหูเทพ (ทรงครุฑ)", style: "glow-orange", color: "#ffa500", desc: "พายัพอิงแอบเนา จิตต์ร้อนเร่าวายวุ่น คิดข้องขุ่นผิดเป็นชอบ ทิ้งระบอบแบบแผน ความเก่าเล่นติดตน" },
    6: { name: "อุศุภอิงแอบลาภ", god: "พระศุกร์ (ทรงวัว)", style: "glow-blue", color: "#007bff", desc: "หนอุดร สถาพรโภคผล ระวังคนจงมาก ระวังปากจงดี อย่าสู่ความเขา เราจะเกิดร้อนรน อย่าเดินหนผิดกาล ภัยจักพาลติดตน" }
};


function showchatranine(){
    // FIX 1: แก้ชื่อตัวแปร contianer → container
    const container = document.getElementById('showchatraninePage');
    if (!container) return;

    const html = `
        <div class="container-fluid py-4">
            <div class="text-center mb-4">
                <h1>📜 ตำราฉัตร 9 ชั้น</h1>
                <p class="text-gold">พยากรณ์ดวงชะตารายปีตามตำรับหลวงทรงพล</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card bg-dark-custom border-gold p-4">
                        <div class="form-group mb-3">
                            <label class="text-gold">เลือกจากรายชื่อสมาชิก (ประวัติ):</label>
                            <select id="memberSelect"
                                class="form-control bg-dark text-white border-gold member-selector-shared"
                                onchange="autoFillMemberData(this.value)">
                                <option value="">-- เลือกสมาชิก --</option>
                            </select>
                            <label class="text-dark mb-2">วันเกิดของท่าน:</label>
                            <select id="chatraninebirthDaySelect"
                                class="form-control bg-dark text-gold border-gold-subtle">
                                <option value="7">วันอาทิตย์ (สีหะโฉลก)</option>
                                <option value="1">วันจันทร์ (จันโทบูรพา)</option>
                                <option value="2">วันอังคาร (มหิงษาภัยพิพิธ)</option>
                                <option value="3">วันพุธ (คชสิทธิชัยโย)</option>
                                <option value="6">วันเสาร์ (พยัคโฆภัยหลาก)</option>
                                <option value="4">วันพฤหัสบดี (มฤคมากลาภหลาย)</option>
                                <option value="5">วันศุกร์ (อุศุภอิงแอบลาภ)</option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label class="text-gold mb-2">ระบุอายุย่างของท่าน:</label>
                            <input type="number" id="chatranineAge"
                                class="form-control bg-dark text-gold border-gold-subtle" placeholder="ตัวอย่าง: 43">
                        </div>
                        <button onclick="calculateChatnine()" class="btn btn-gold w-100 py-2 fw-bold">
                            🔮 ทำนายดวงชะตาตามตำรา
                        </button>
                    </div>
                </div>
            </div>

            <!-- FIX 2: แก้โครงสร้าง HTML ให้ถูกต้อง -->
            <div id="chatranineDisplay" class="mt-5" style="display: none; position: relative;">
                <div class="row justify-content-center">
                    <div class="col-md-8 text-center">
                        <div class="prediction-box p-4 rounded shadow">
                            <h4 class="text-gold mb-3">คำพยากรณ์ประจำปี</h4>
                            <p id="chatraLongPrediction" class="text-white lead px-2 px-md-5">
                                -- ผลคำทำนายจะปรากฏที่นี่ --
                            </p>
                            <hr class="border-gold-subtle my-4">
                            <p class="text-muted small">คำแนะนำ: ควรหมั่นทำบุญ สวดมนต์ และมีสติในการใช้ชีวิต</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-center gap-2">
                    <button onclick="downloadChatnineImage()" class="btn btn-outline-gold btn-sm">
                        <i class="fas fa-download me-1"></i> บันทึกรูปภาพ
                    </button>
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
    // FIX 1: ใช้ชื่อที่ถูกต้อง
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

    if (!age || age <= 0) {
        alert("กรุณากรอกอายุย่างของท่าน");
        return;
    }

    // 1. สูตรหาจำนวนก้าว (หน้า 9): (อายุ - 1) % 9
    let steps = (age - 1) % 9;

    // 2. หาตำแหน่งเริ่มต้นในยันต์ตามวันเกิด (หน้า 10)
    let startIndex = chatraSequence.indexOf(startDay);

    // 3. นับเวียนไปตามจำนวนก้าว (ถ้าเศษ 0 จะได้ก้าวเดิม)
    let finalIndex = (startIndex + steps) % 9;
    let finalNumber = chatraSequence[finalIndex];

    const result = chatra9FullData[finalNumber];

    // 4. การแสดงผล UI
    const display = document.getElementById('chatranineDisplay');
    const predictionText = document.getElementById('chatraLongPrediction');

    if (display && result) {

        // FIX 3 & FIX 5: แก้ HTML ใน innerHTML ให้ถูกต้อง (เพิ่ม div ที่หายไป, แก้ CSS class)
        predictionText.innerHTML = `
            <div class="mb-3">
                ${result.name}
            </div>
            <div class="mb-3">
                <span class="badge bg-gold text-dark fw-bold p-2" style="font-size: 1rem;">
                    💠 ${result.god} 💠
                </span>
            </div>
            <div class="text-white fw-light" style="line-height: 1.8;">
                ${result.desc}
            </div>
        `;

        // แสดงผลด้วย Animation
        $(display).fadeIn(600);

        // เลื่อนหน้าจอไปที่ผลลัพธ์
        display.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ฟังก์ชันสำหรับบันทึกภาพ (ปรับแต่งให้สวยงาม)
function downloadChatnineImage() {
    const displayElement = document.getElementById('chatranineDisplay');
    if (!displayElement) return;

    html2canvas(displayElement, {
        backgroundColor: "#121212",
        scale: 2,
        logging: false,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ฉัตร9ชั้น_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}