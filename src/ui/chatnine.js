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
                            <label class="text-gold mb-2">อายุย่างตามปฏิทิน (คำนวณอัตโนมัติ):</label>
                            <input type="number" id="chatranineAge"
                                class="form-control bg-dark text-gold border-gold-subtle" placeholder="ตัวอย่าง: 43" readonly>
                        </div>
                        <button onclick="calculateChatnine()" class="btn btn-gold w-100 py-2 fw-bold">
                            🔮 ทำนายดวงชะตาตามตำรา
                        </button>
                    </div>
                </div>
            </div>

            <!-- FIX 2: แก้โครงสร้าง HTML ให้ถูกต้อง -->
            <div id="chatranineDisplay" class="mt-5" style="display: none;">
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
        Swal.fire('แจ้งเตือน', 'กรุณากรอกอายุย่างของท่าน', 'warning');
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
        
        // FIX 3: แก้ HTML ใน innerHTML ให้ถูกต้อง
        predictionText.innerHTML = `
            <div class="mb-3">
                ${result.name}
            </div>
            <!-- FIX 5: แก้ไขการแสดงผลให้สวยงามขึ้น -->
            <div class="mb-3">
                <span class="badge bg-gold text-dark fw-bold p-2" style="font-size: 1rem;">
                    💠 ${result.god} 💠
                </span>
            </div>
            <div class="text-white fw-light" style="line-height: 1.8;">
                ${result.desc}
            </div>
        `;

        // FIX 4: แสดงผลแบบปกติ ไม่ใช้ jQuery
        display.style.opacity = 0;
        display.style.display = 'block';
        setTimeout(() => { display.style.opacity = 1; display.style.transition = 'opacity 0.6s'; }, 10);

        // เลื่อนหน้าจอไปที่ผลลัพธ์
        display.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function downloadChatnineImage() {
    const ageInput = document.getElementById('chatranineAge');
    const birthDayInput = document.getElementById('chatraninebirthDaySelect');
    if (!ageInput || !birthDayInput || !ageInput.value) {
        if(typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ', 'warning');
        else alert('กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ');
        return;
    }

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
            ctx.fillText("ตำราฉัตร 9 ชั้น (หลวงทรงพล)", width/2, cy);
            
            ctx.font = '400 36px "Sarabun"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`อายุย่าง ${age} ปี`, width/2, cy + 90);
        }
        
        cy += 200;
        
        if (!isMeasure) {
            ctx.font = '700 50px "Sarabun"';
            ctx.fillStyle = result.color || '#d4af37';
            ctx.fillText(result.name, width/2, cy);
        }
        cy += 80;
        
        if (!isMeasure) {
            ctx.font = '700 40px "Sarabun"';
            ctx.fillStyle = '#d4af37';
            ctx.fillText(`💠 ${result.god} 💠`, width/2, cy);
        }
        cy += 100;
        
        ctx.font = '400 40px "Sarabun"';
        let text = result.desc;
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
                ctx.fillStyle = '#e8e9f5';
                ctx.textAlign = 'center';
                ctx.fillText(l, width/2, cy);
            }
            cy += 60;
        }
        
        cy += 80;
        
        if (!isMeasure) {
            ctx.font = '400 30px "Sarabun"';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText("คำพยากรณ์ · สยามโหรามงคล", width/2, cy);
        }
        
        cy += 100;
        return cy;
    }
    
    let actualHeight = drawContent(true);
    canvas.height = actualHeight;
    drawContent(false);
    
    const link = document.createElement('a');
    link.download = `สยามโหรามงคล_ฉัตร9ชั้น_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}