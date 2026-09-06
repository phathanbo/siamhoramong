"use strict";

/**
 * Logic: คำนวณโชคกำเนิด (พยากรณ์วาสนาและอาชีพ)
 * พัฒนาโดย: สยามโหรามงคล (ประธานโบ้)
 * อ้างอิง: คัมภีร์พรหมชาติโบราณ (สูตรไตรคูณวันเดือนปี และจุลศักราชกำเนิด)
 */

/* =========================
   1. UTIL
========================= */
function getInt(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.error(`❌ ไม่พบ element: ${id}`);
        return null;
    }
    const val = parseInt(el.value);
    return isNaN(val) ? null : val;
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

/* =========================
   2. VALIDATION
========================= */
function validateBirthFortuneInput(day, month, year, be) {
    if (!day || day < 1 || day > 7) return "วันเกิดไม่ถูกต้อง (๑-๗)";
    if (!month || month < 1 || month > 12) return "เดือนเกิดไม่ถูกต้อง (๑-๑๒)";
    if (!year || year < 1 || year > 12) return "ปีนักษัตรไม่ถูกต้อง (๑-๑๒)";
    if (!be || be < 1182) return "ปี พ.ศ. ไม่ถูกต้อง (ต้องมากกว่า พ.ศ. ๑๑๘๒)";
    return null;
}

/* =========================
   3. CORE LOGIC & DICTIONARIES
========================= */
function calculateMod7(value) {
    return ((value % 7) + 7) % 7; // กันค่าติดลบ
}

const birthFortuneDict = {
    method1: {
        0: { title: "ใจคอไม่แน่นอน ทำงานเป็นพักๆ", desc: "จิตใจแปรปรวนง่าย เบื่อง่าย ไม่ชอบความจำเจ ทำงานเป็นพักๆ มักเปลี่ยนสายงานบ่อย แต่มีไหวพริบเอาตัวรอดเก่ง ควรฝึกความอดทนและความต่อเนื่อง จะสร้างฐานะได้ดี" },
        1: { title: "กสิกรรม ทำไร่ทำนา เกษตรดี", desc: "ชะตากำเนิดถูกโฉลกกับงานกสิกรรม เกษตรกรรม เลี้ยงสัตว์ หรือทำธุรกิจที่เกี่ยวกับที่ดิน พืชพรรณธัญญาหาร จะเกิดผลผลิตงอกงามและมีความมั่นคง" },
        2: { title: "พาณิชยกรรม ค้าขายมีกำไร", desc: "มีวาสนาทางด้านการค้าขาย เจรจาพาทีมีเสน่ห์ ซื้อมาขายไปคล่องตัว เหมาะกับงานธุรกิจส่วนตัว การตลาด งานขาย หรือนำเข้าส่งออก มีเกณฑ์ร่ำรวยจากวาจา" },
        3: { title: "ข้าราชการ ทหาร ตำรวจดี", desc: "มีอำนาจและระเบียบวินัยในตัว เหมาะกับงานรับราชการ ทหาร ตำรวจ งานฝ่ายปกครอง หรือตำแหน่งที่ต้องใช้การตัดสินใจเด็ดขาด มีผู้ใหญ่สนับสนุนให้เจริญก้าวหน้า" },
        4: { title: "กสิกรรม ทำสวนทำไร่ อสังหาฯ ดี", desc: "ถูกโฉลกกับงานจัดสรรที่ดิน สวนผลไม้ ฟาร์ม หรือธุรกิจพัฒนาอสังหาริมทรัพย์ มีความเพียรพยายามสูง ยิ่งลงแรงยิ่งได้ผลตอบแทนคุ้มค่าในระยะยาว" },
        5: { title: "ครูบาอาจารย์ แพทย์ นักบวชดี", desc: "มีสติปัญญาเฉียบแหลม มีคุณธรรมเมตตาสูง เหมาะกับการเป็นครู อาจารย์ นักวิชาการ แพทย์ พยาบาล หรือผู้สอนสั่งให้ความรู้แก่ผู้คน จะมีเกียรติยศและคนนับถือ" },
        6: { title: "เข้าหาเจ้านาย รับใช้นายดี", desc: "เป็นผู้มีความอ่อนน้อมถ่อมตน มีวาทศิลป์ในการประสานงาน เหมาะกับงานเลขาธิการ ที่ปรึกษา งานติดต่อผู้ใหญ่ หรือทำงานร่วมกับบุคคลชั้นสูง จะได้รับความไว้วางใจและลาภยศ" }
    },
    method2: {
        0: { title: "ทำได้ทุกอย่าง วาสนาปานกลาง", desc: "เป็นคนเรียนรู้งานได้ไว จับงานอะไรก็ทำได้เสมอตัว มีความคล่องตัวสูง เหมาะกับงานฟรีแลนซ์ งานประสานงานทั่วไป หากตั้งใจในสายงานใดเป็นพิเศษจะก้าวหน้าขึ้น" },
        1: { title: "ราชการมียศศักดิ์ เกียรติยศสูง", desc: "ดวงชะตามีเกียรติยศชื่อเสียง มีโอกาสได้รับพระราชทานยศศักดิ์ ตำแหน่งสูงในแวดวงราชการหรือองค์กรใหญ่ เป็นที่เคารพนับถือของคนหมู่มาก" },
        2: { title: "พ่อบ้านแม่เรือน งานบริการดี", desc: "มีความละเอียดรอบคอบ เอาใจใส่คนรอบข้างดี เหมาะกับงานบริการ โรงแรม การจัดการดูแล อาหารและเครื่องดื่ม หรือสร้างครอบครัวที่อบอุ่นมั่นคง" },
        3: { title: "อาสาเจ้านาย กิจการงานสำเร็จ", desc: "ชอบการทำงานเชิงรุก อาสาทำงานยากได้สำเร็จลุล่วง มีความกล้าหาญ เจ้านายและผู้บังคับบัญชาชื่นชม มักได้รับมอบหมายงานสำคัญอยู่เสมอ" },
        4: { title: "เกษตรอุตสาหกรรม ค้าที่ดินดี", desc: "มีเกณฑ์ประสบความสำเร็จในด้านการเกษตรแปรรูป งานโรงงาน หรือค้าขายที่ดิน ทรัพย์สินจะเพิ่มพูนตามกาลเวลา" },
        5: { title: "ครู แพทย์ นักวิชาการเด่น", desc: "วาสนาส่งเสริมทางด้านวิทยาการ สติปัญญาดีเด่น เหมาะกับอาชีพผู้รักษาพยาบาล นักวิจัย หรือการถ่ายทอดองค์ความรู้ สังคมให้การยอมรับยกย่อง" },
        6: { title: "ค้าขายร่ำรวย เงินทองไหลมา", desc: "วาสนาทางโชคลาภและการเงินโดดเด่นมาก จับสิ่งใดเป็นเงินเป็นทอง เหมาะกับการลงทุน ทำธุรกิจ ค้าขายทั้งออนไลน์และออฟไลน์ มีโอกาสเป็นเศรษฐี" }
    },
    method3: {
        0: { title: "ใจกล้า นักสู้ ทรหดอดทน", desc: "เป็นนักสู้ชีวิต ไม่ยอมแพ้ต่ออุปสรรค มีความเป็นผู้นำสูง กล้าได้กล้าเสีย เหมาะกับงานท้าทาย งานบุกเบิกตลาดใหม่ หรืองานที่ต้องใช้ความเด็ดเดี่ยว" },
        1: { title: "เหนื่อยยาก แต่ประคองตัวได้", desc: "ช่วงต้นต้องบุกเบิกเหน็ดเหนื่อย ต้องพึ่งพาตนเองเป็นหลัก แต่เมื่อผ่านพ้นไปได้จะตั้งตัวได้อย่างมั่นคง ขอให้อดทนและมัธยัสถ์" },
        2: { title: "กสิกรรมและค้าขาย เกื้อหนุนกัน", desc: "ชะตาหนุนนำให้ทำมาค้าคล่อง ควบคู่กับกิจการผลิตหรือผลผลิตทางการเกษตร ทรัพย์สินเงินทองจะเพิ่มพูนขึ้นอย่างมั่นคง" },
        3: { title: "ราชการเด่น มียศฐาบรรดาศักดิ์", desc: "ชะตาตกในเกณฑ์ขุนนาง ผู้ใหญ่ค้ำจุน มีโอกาสเติบโตก้าวหน้าในตำแหน่งหน้าที่การงานราชการหรือองค์กรขนาดใหญ่" },
        4: { title: "พ่อค้าร่ำรวย ทรัพย์ศฤงคารมาก", desc: "ชะตาวาสนาของคหบดี มีหัวการค้าและวิสัยทัศน์ทางธุรกิจ ซื้อง่ายขายคล่อง มีเงินทองหมุนเวียนสะพัดตลอดปี" },
        5: { title: "นักบวช แพทย์ นักปราชญ์ผู้มีศีล", desc: "ดวงชะตามีบารมีธรรมคุ้มครอง มีญาณหยั่งรู้และสติปัญญา เหมาะกับงานช่วยเหลือเพื่อนมนุษย์ จิตใจสงบและมีผู้คนเลื่อมใสศรัทธา" },
        6: { title: "มีวาสนาบารมี เป็นผู้นำคน", desc: "ตกในเกณฑ์ผู้มีบุญวาสนาสูง มีอำนาจปกครองคน ผู้ใต้บังคับบัญชาเคารพยำเกรง ทำกิจการใดก็มักได้เป็นหัวหน้าหรือผู้นำองค์กร" }
    }
};

/* =========================
   4. MAIN FUNCTION
========================= */
function calculateBirthFortune() {
    try {
        const day = getInt("fortuneDay");
        const month = getInt("fortuneMonth");
        const year = getInt("fortuneYear");
        const be = getInt("fortuneBE");

        const error = validateBirthFortuneInput(day, month, year, be);
        if (error) {
            if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', error, 'error');
            else alert(error);
            return;
        }

        const display = document.getElementById("fortune-result-display");
        if (!display) {
            console.error("❌ ไม่พบ display");
            return;
        }

        // แปลง พ.ศ. → จ.ศ.
        const cs = be - 1181;

        /* =========================
           แบบที่ 1 และ 2: สูตรไตรคูณ (วัน + เดือน + ปี) * 3 / 7
        ========================= */
        const sum12 = (day + month + year) * 3;
        const remain12 = calculateMod7(sum12);

        const d1 = birthFortuneDict.method1[remain12];
        const d2 = birthFortuneDict.method2[remain12];

        safeSetText("fortune-res-1-title", `เศษ ${remain12} : ${d1.title}`);
        safeSetText("fortune-res-1", d1.desc);

        safeSetText("fortune-res-2-title", `เศษ ${remain12} : ${d2.title}`);
        safeSetText("fortune-res-2", d2.desc);

        /* =========================
           แบบที่ 3: สูตรจุลศักราช (((จ.ศ. * 40) + ปี + เดือน) * 3) + วัน / 7
        ========================= */
        let remain3 = 0;
        let d3 = null;
        if (cs > 0) {
            const step3 = (((cs * 40) + year + month) * 3) + day;
            remain3 = calculateMod7(step3);
            d3 = birthFortuneDict.method3[remain3];

            safeSetText("fortune-res-3-cs", `จุลศักราช (จ.ศ.) ${cs}`);
            safeSetText("fortune-res-3-title", `เศษ ${remain3} : ${d3.title}`);
            safeSetText("fortune-res-3", d3.desc);
        }

        // แสดงผลลัพธ์พร้อม Smooth Reveal
        display.style.opacity = '0';
        display.style.display = 'block';
        setTimeout(() => {
            display.style.transition = 'opacity 0.6s ease-in-out';
            display.style.opacity = '1';
            display.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);

    } catch (err) {
        console.error("🔥 ERROR:", err);
        if (typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

/* =========================
   5. IMAGE EXPORT FUNCTION
========================= */
async function downloadBirthFortuneImage(e) {
    const day = getInt("fortuneDay");
    const month = getInt("fortuneMonth");
    const year = getInt("fortuneYear");
    const be = getInt("fortuneBE");

    const error = validateBirthFortuneInput(day, month, year, be);
    if (error) {
        if (typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาระบุข้อมูลวันเดือนปีเกิดให้ครบถ้วนก่อนบันทึกภาพ', 'warning');
        else alert('กรุณาระบุข้อมูลวันเดือนปีเกิดให้ครบถ้วนก่อนบันทึกภาพ');
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
        const cs = be - 1181;
        const sum12 = (day + month + year) * 3;
        const remain12 = calculateMod7(sum12);
        const step3 = (((cs * 40) + year + month) * 3) + day;
        const remain3 = calculateMod7(step3);

        const d1 = birthFortuneDict.method1[remain12];
        const d2 = birthFortuneDict.method2[remain12];
        const d3 = birthFortuneDict.method3[remain3];

        const dayNames = ["", "วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const yearNames = ["", "ปีชวด", "ปีฉลู", "ปีขาล", "ปีเถาะ", "ปีมะโรง", "ปีมะเส็ง", "ปีมะเมีย", "ปีมะแม", "ปีวอก", "ปีระกา", "ปีจอ", "ปีกุน"];

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
                ctx.fillText("👑 ศาสตร์พยากรณ์วิถีอาชีพและโชคกำเนิด", width/2, cy);
                cy += 55;

                ctx.font = '700 52px "Prompt", sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'middle';
                ctx.fillText("คำนวณโชคกำเนิด (พยากรณ์อาชีพ)", width/2, cy);
                cy += 65;

                ctx.font = '400 30px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textBaseline = 'middle';
                ctx.fillText(`เกิด${dayNames[day]} เดือน ${month} ${yearNames[year]} · พ.ศ. ${be} (จ.ศ. ${cs})`, width/2, cy);
                cy += 45;

                // Divider Line
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(width/2 - 240, cy);
                ctx.lineTo(width/2 + 240, cy);
                ctx.stroke();
                cy += 50;
            } else {
                cy += 230;
            }

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

            // Card Rendering Block
            const renderMethodCard = (badgeTitle, headline, descText, strokeColor = '#f1d06e') => {
                const boxPad = 28;
                const blockW = width - 160;
                const startCardY = cy;
                let cardInnerY = startCardY + boxPad;

                if (!isMeasure) {
                    // Badge Title
                    ctx.font = '600 28px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, cardInnerY);
                }
                cardInnerY += 46;

                if (!isMeasure) {
                    // Headline
                    ctx.font = '700 32px "Prompt", sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${headline}`, cx + boxPad, cardInnerY);
                }
                cardInnerY += 54;

                cy = cardInnerY;
                renderWrappedText(descText, '#e2e8f0', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
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
                    } else {
                        ctx.fillRect(cx, startCardY, blockW, cardBoxH);
                        ctx.strokeRect(cx, startCardY, blockW, cardBoxH);
                    }

                    // Redraw text over filled box
                    let redrawY = startCardY + boxPad;
                    ctx.font = '600 28px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(badgeTitle, cx + boxPad, redrawY);
                    redrawY += 46;

                    ctx.font = '700 32px "Prompt", sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${headline}`, cx + boxPad, redrawY);
                    redrawY += 54;

                    cy = redrawY;
                    renderWrappedText(descText, '#e2e8f0', 28, 44, 'left', cx + boxPad, blockW - (boxPad * 2));
                    cy = startCardY + cardBoxH;
                }
                cy += 30;
            };

            // Render 3 Methods Cards
            renderMethodCard("แบบที่ ๑ : โชคกำเนิดและนิสัยการงาน (สูตรไตรคูณ)", `เศษ ${remain12} : ${d1.title}`, d1.desc, 'rgba(241, 208, 110, 0.4)');
            renderMethodCard("แบบที่ ๒ : วาสนาและอาชีพที่ถูกโฉลก (เกณฑ์ยศศักดิ์)", `เศษ ${remain12} : ${d2.title}`, d2.desc, 'rgba(56, 189, 248, 0.4)');
            renderMethodCard(`แบบที่ ๓ : โชคกำเนิดตามจุลศักราช (จ.ศ. ${cs})`, `เศษ ${remain3} : ${d3.title}`, d3.desc, 'rgba(74, 222, 128, 0.4)');

            // Advice Box
            const startAdvY = cy;
            const boxPad = 28;
            const blockW = width - 160;
            let advInnerY = startAdvY + boxPad;

            if (!isMeasure) {
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("💡 คำแนะนำเสริมมงคลตามโชคชะตากำเนิด :", cx + boxPad, advInnerY);
            }
            advInnerY += 46;

            cy = advInnerY;
            renderWrappedText("อาชีพการงานที่ถูกโฉลกตามชะตากำเนิดจะช่วยเกื้อหนุนให้ท่านมีความก้าวหน้าและราบรื่นยิ่งขึ้น หากประกอบอาชีพใดอยู่ให้ตั้งใจทำด้วยความซื่อสัตย์สุจริต และหมั่นสร้างบุญบารมีเสริมดวงชะตาเสมอ", '#cbd5e1', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
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
                ctx.fillText("💡 คำแนะนำเสริมมงคลตามโชคชะตากำเนิด :", cx + boxPad, redrawAdvY);
                redrawAdvY += 46;
                cy = redrawAdvY;
                renderWrappedText("อาชีพการงานที่ถูกโฉลกตามชะตากำเนิดจะช่วยเกื้อหนุนให้ท่านมีความก้าวหน้าและราบรื่นยิ่งขึ้น หากประกอบอาชีพใดอยู่ให้ตั้งใจทำด้วยความซื่อสัตย์สุจริต และหมั่นสร้างบุญบารมีเสริมดวงชะตาเสมอ", '#cbd5e1', 26, 40, 'left', cx + boxPad, blockW - (boxPad * 2));
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
        link.download = `สยามโหรามงคล_โชคกำเนิด_พศ${be}_${new Date().getTime()}.png`;
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