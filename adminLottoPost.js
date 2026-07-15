"use strict";

// ลำดับดาวตามหลักมหาทักษา (เวียนขวา)
const TAKSA_CIRCLE = [1, 2, 3, 4, 7, 5, 8, 6];

// ข้อมูลดาวประจำวัน
const PLANET_DATA = {
    0: { name: "อาทิตย์", num: 1, color: "#e74c3c" },
    1: { name: "จันทร์", num: 2, color: "#f1c40f" },
    2: { name: "อังคาร", num: 3, color: "#e67e22" },
    3: { name: "พุธ", num: 4, color: "#2ecc71" },
    4: { name: "พฤหัสบดี", num: 5, color: "#f39c12" },
    5: { name: "ศุกร์", num: 6, color: "#3498db" },
    6: { name: "เสาร์", num: 7, color: "#9b59b6" }
};

// ชื่อตำแหน่งในทักษาปกรณ์
const TAKSA_POSITIONS = {
    0: "บริวาร", 1: "อายุ", 2: "เดช", 3: "ศรี", 4: "มูละ", 5: "อุตสาหะ", 6: "มนตรี", 7: "กาลกิณี"
};

function getTaksaInfo(dayOfWeekIndex) {
    const dayPlanet = PLANET_DATA[dayOfWeekIndex].num;
    const startIndex = TAKSA_CIRCLE.indexOf(dayPlanet);
    const sriIndex = (startIndex + 3) % 8;
    const montriIndex = (startIndex + 6) % 8;
    const kalakiniIndex = (startIndex + 7) % 8;
    const dechIndex = (startIndex + 2) % 8;
    return {
        dayNum: dayPlanet,
        dayName: PLANET_DATA[dayOfWeekIndex].name,
        sri: TAKSA_CIRCLE[sriIndex],
        montri: TAKSA_CIRCLE[montriIndex],
        dech: TAKSA_CIRCLE[dechIndex],
        kalakini: TAKSA_CIRCLE[kalakiniIndex]
    };
}

function generateTaksaCombinations(taksa, count2D = 12, count3D = 8, countGun = 2, countTry = 2) {
    const goodNumbers = [taksa.dayNum, taksa.sri, taksa.montri, taksa.dech];
    const allNumbers = [0,1,2,3,4,5,6,7,8,9];
    const safeNumbers = allNumbers.filter(n => n !== taksa.kalakini);

    const set2D = new Set();
    while (set2D.size < count2D) {
        const d1 = goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
        const d2 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        if (d1 !== d2) set2D.add(`${d1}${d2}`);
    }
    const set3D = new Set();
    while (set3D.size < count3D) {
        const d1 = goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
        const d2 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        const d3 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        if (d1 !== d2 && d2 !== d3 && d1 !== d3) set3D.add(`${d1}${d2}${d3}`);
    }
    const setGun = new Set();
    while (setGun.size < countGun) {
        setGun.add(`${safeNumbers[Math.floor(Math.random() * safeNumbers.length)]}`);
    }
    const setTry = new Set();
    while (setTry.size < countTry) {
        const d1 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        const d2 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        const d3 = safeNumbers[Math.floor(Math.random() * safeNumbers.length)];
        if (d1 !== d2 && d2 !== d3 && d1 !== d3) setTry.add(`${d1}${d2}${d3}`);
    }
    return {
        twoDigits: Array.from(set2D).sort(),
        threeDigits: Array.from(set3D).sort(),
        gunDigits: Array.from(setGun).sort(),
        tryDigits: Array.from(setTry).sort()
    };
}

const thaiMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

function formatDateThai(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function generateLottoPost() {
    const dateInput = document.getElementById('lottoDate').value;
    if (!dateInput) {
        Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกวันที่ออกสลาก', 'error');
        return;
    }
    const dateObj = new Date(dateInput);
    const dayOfWeek = dateObj.getDay();
    const formattedDate = formatDateThai(dateInput);
    const taksa = getTaksaInfo(dayOfWeek);
    const combos = generateTaksaCombinations(taksa);

    document.getElementById('previewPlaceholder').style.display = 'none';
    document.getElementById('genResultContainer').style.display = 'flex';

    const caption = `🌟 แจกแนวทางเลขเด็ด งวดประจำวันที่ ${formattedDate} 🌟\n\n` +
        `การคำนวณตามตำรา "มหาทักษาพยากรณ์" อิงจากวันที่ออกสลาก (วัน${taksa.dayName})\n` +
        `ดวงดาวโคจรให้โชคลาภเด่นชัดงวดนี้\n\n` +
        `🔮 เลขเด่นงวดนี้: ${[taksa.dayNum, taksa.sri, taksa.montri].join(', ')}\n` +
        `❌ เลขกาลกิณี (ควรเลี่ยง): ${taksa.kalakini}\n\n` +
        `💵 เลขชุด 2 ตัว:\n${combos.twoDigits.join(' - ')}\n\n` +
        `💵 เลขชุด 3 ตัว:\n${combos.threeDigits.join(' - ')}\n\n` +
        `🛡️ เลขกัน:\n${combos.gunDigits.join(' - ')}\n\n` +
        `🎯 เลขน่าลอง:\n${combos.tryDigits.join(' - ')}\n\n` +
        `#เลขเด็ด #มหาทักษา #สยามโหรามงคล #สลากกินแบ่งรัฐบาล #หวยรัฐบาล`;

    document.getElementById('genResultText').value = caption;
    renderLottoImage(formattedDate, taksa, combos);
}

// =============================================
// Canvas 2D API rendering (replaces html2canvas)
// =============================================

function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function _drawBadge(ctx, text, cx, y, fontSize) {
    ctx.font = `bold ${fontSize}px Sarabun, sans-serif`;
    const tw = ctx.measureText(text).width;
    const bw = tw + 32;
    const bh = fontSize + 12;
    _roundRect(ctx, cx - bw / 2, y - bh / 2, bw, bh, bh / 2);
    ctx.fillStyle = '#291147';
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, y);
}

function renderLottoImage(dateStr, taksa, combos) {
    const container = document.getElementById('canvasExportArea');
    container.innerHTML = '<canvas id="lottoCaptureTarget" width="1080" height="1080" style="display:block;"></canvas>';
    const canvas = document.getElementById('lottoCaptureTarget');
    const ctx = canvas.getContext('2d');
    document.fonts.ready.then(() => {
        const bgImg = new Image();
        bgImg.onload = () => _drawLottoCanvas(ctx, bgImg, dateStr, taksa, combos);
        bgImg.onerror = () => _drawLottoCanvas(ctx, null, dateStr, taksa, combos);
        bgImg.src = 'assets/lotto_kuman_bg.png';
    });
}

function _drawLottoCanvas(ctx, bgImg, dateStr, taksa, combos) {
    const W = 1080, H = 1080;

    // --- Background ---
    ctx.fillStyle = '#11051F';
    ctx.fillRect(0, 0, W, H);
    if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, W, H);
        const grad = ctx.createRadialGradient(W/2, H/2, 100, W/2, H/2, H/2);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(10,4,20,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    // Layout fills y=18 to y~1062 (18px bottom margin)
    // Total content: 140+16+58+16+195+16+135+16+308+16+125 = 1041 -> ends at 18+1041=1059
    const PX = 405, PW = 648;
    const GAP = 16;
    let cy = 18;

    // --- Header (h=140) ---
    const hdrH = 140;
    _roundRect(ctx, PX, cy, PW, hdrH, 20);
    ctx.fillStyle = 'rgba(17,5,31,0.9)'; ctx.fill();
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.stroke();
    [[PX,cy],[PX+PW,cy],[PX,cy+hdrH],[PX+PW,cy+hdrH]].forEach(([dx,dy]) => {
        ctx.save(); ctx.translate(dx, dy); ctx.rotate(Math.PI/4);
        ctx.fillStyle = '#d4af37'; ctx.fillRect(-11,-11,22,22); ctx.restore();
    });
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 56px Sarabun, sans-serif';
    ctx.fillText('แนะนำเลขเด็ด', PX + PW/2, cy + 48);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px Sarabun, sans-serif';
    ctx.fillText('งวดต่อไป', PX + PW/2, cy + 96);
    ctx.fillStyle = '#d4af37'; ctx.font = '17px Sarabun, sans-serif';
    ctx.fillText('โดย สยามโหรามงคล', PX + PW/2, cy + 125);
    cy += hdrH + GAP;

    // --- Date box (h=58) ---
    const dateH = 58;
    _roundRect(ctx, PX, cy, PW, dateH, 12);
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fill();
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 28px Sarabun, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`งวดประจำวันที่ ${dateStr}`, PX + PW/2, cy + dateH/2);
    cy += dateH + GAP;

    // --- เลขเด่น (h=195) ---
    const hlH = 195;
    _roundRect(ctx, PX, cy, PW, hlH, 15);
    ctx.fillStyle = 'rgba(17,5,31,0.8)'; ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    _drawBadge(ctx, 'เลขเด่น', PX + 76, cy, 19);
    const circR = 65, circCY = cy + hlH/2 + 12;
    [PX+PW/2-170, PX+PW/2, PX+PW/2+170].forEach((cx2, i) => {
        const num = [taksa.dayNum, taksa.sri, taksa.montri][i];
        const grd = ctx.createRadialGradient(cx2, circCY, 0, cx2, circCY, circR);
        grd.addColorStop(0, '#3a155c'); grd.addColorStop(1, '#11051F');
        ctx.beginPath(); ctx.arc(cx2, circCY, circR, 0, Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 84px Sarabun, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(num), cx2, circCY);
    });
    cy += hlH + GAP;

    // --- เลขชุด 2 ตัว (h=135) ---
    const g2H = 135;
    _roundRect(ctx, PX, cy, PW, g2H, 15);
    ctx.fillStyle = 'rgba(17,5,31,0.85)'; ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    _drawBadge(ctx, 'เลขชุด 2 ตัว', PX + PW/2, cy, 19);
    const COLS2 = 6, cw2 = (PW - 20) / COLS2, ch2 = 52;
    combos.twoDigits.forEach((n, i) => {
        const col = i % COLS2, row = Math.floor(i / COLS2);
        const bx = PX + 10 + col * cw2, by2 = cy + 24 + row * (ch2 + 7);
        _roundRect(ctx, bx, by2, cw2 - 6, ch2, 6);
        ctx.fillStyle = '#1a0833'; ctx.fill();
        ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px Sarabun, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n, bx + (cw2-6)/2, by2 + ch2/2);
    });
    cy += g2H + GAP;

    // --- Bottom row (h=308) ---
    const botH = 308;
    const col3W = 278, colGW = 158, colTW = PW - col3W - colGW - 16;
    const x3 = PX, xG = x3 + col3W + 8, xT = xG + colGW + 8;

    // เลขชุด 3 ตัว
    _roundRect(ctx, x3, cy, col3W, botH, 15);
    ctx.fillStyle = 'rgba(17,5,31,0.85)'; ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    _drawBadge(ctx, 'เลขชุด 3 ตัว', x3 + col3W/2, cy, 17);
    const cw3 = (col3W - 18) / 2, ch3 = 56;
    combos.threeDigits.forEach((n, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const bx = x3 + 9 + col * (cw3 + 6), by3 = cy + 26 + row * (ch3 + 8);
        _roundRect(ctx, bx, by3, cw3, ch3, 6);
        ctx.fillStyle = '#1a0833'; ctx.fill();
        ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px Sarabun, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n, bx + cw3/2, by3 + ch3/2);
    });

    // เลขกัน
    _roundRect(ctx, xG, cy, colGW, botH, 15);
    ctx.fillStyle = 'rgba(17,5,31,0.85)'; ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    _drawBadge(ctx, 'เลขกัน', xG + colGW/2, cy, 17);
    const gunR = 32, gunSpacing = colGW / (combos.gunDigits.length + 1);
    combos.gunDigits.forEach((n, i) => {
        const gcx = xG + gunSpacing * (i + 1), gcy = cy + botH/2 + 12;
        ctx.beginPath(); ctx.arc(gcx, gcy, gunR, 0, Math.PI*2);
        ctx.fillStyle = '#11051F'; ctx.fill();
        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 30px Sarabun, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(n), gcx, gcy);
    });

    // เลขน่าลอง
    _roundRect(ctx, xT, cy, colTW, botH, 15);
    ctx.fillStyle = 'rgba(17,5,31,0.85)'; ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    _drawBadge(ctx, 'เลขน่าลอง', xT + colTW/2, cy, 17);
    const tryH = 60, tryW = colTW - 18, tryGap = 12;
    const totalTryH = combos.tryDigits.length * tryH + (combos.tryDigits.length - 1) * tryGap;
    let tryStartY = cy + (botH - totalTryH) / 2 + 6;
    combos.tryDigits.forEach((n) => {
        _roundRect(ctx, xT + 9, tryStartY, tryW, tryH, 6);
        ctx.fillStyle = '#1a0833'; ctx.fill();
        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 28px Sarabun, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n, xT + 9 + tryW/2, tryStartY + tryH/2);
        tryStartY += tryH + tryGap;
    });
    cy += botH + GAP;

    // --- Footer (h=125) ---
    _roundRect(ctx, 28, cy, 358, 125, 15);
    ctx.fillStyle = 'rgba(10,4,20,0.9)'; ctx.fill();
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 22px Sarabun, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ขอให้ทุกท่านโชคดี', 207, cy + 30);
    ctx.fillText('ถูกรางวัล ร่ำรวยเงินทอง', 207, cy + 62);
    ctx.fillText('เฮงๆ ตลอดไป ✨', 207, cy + 94);

    _roundRect(ctx, PX, cy + 6, PW, 44, 22);
    ctx.fillStyle = 'rgba(17,5,31,0.95)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#dddddd'; ctx.font = '17px Sarabun, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('👍 กดไลก์ กดแชร์ เป็นกำลังใจให้สยามโหรามงคลด้วยนะครับ', PX + PW/2, cy + 28);

    _roundRect(ctx, PX, cy + 60, PW, 40, 20);
    ctx.fillStyle = 'rgba(17,5,31,0.95)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#aaaaaa'; ctx.font = '15px Sarabun, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('โปรดใช้วิจารณญาณในการซื้อสลากกินแบ่งรัฐบาล เป็นความเชื่อส่วนบุคคล', PX + PW/2, cy + 80);

    // --- Speech Bubble ---
    const bx = 32, bby = 378, bw = 228, bh = 118, br = 28;
    _roundRect(ctx, bx, bby, bw, bh, br);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save();
    ctx.translate(bx + bw - 72, bby + bh); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + bw - 83, bby + bh - 5, 26, 9);
    ctx.fillStyle = '#222222'; ctx.font = 'bold 23px Sarabun, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('เลขนี้มีโชค', bx + bw/2, bby + 28);
    ctx.fillText('เฮงๆ ปังๆ', bx + bw/2, bby + 60);
    ctx.fillText('รวยๆ ครับ', bx + bw/2, bby + 92);

    const previewImg = document.getElementById('lottoPreviewImg');
    if (previewImg) {
        previewImg.src = document.getElementById('lottoCaptureTarget').toDataURL('image/png');
    }
}

function copyGenResult() {
    const text = document.getElementById('genResultText').value;
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({ icon: 'success', title: 'คัดลอกสำเร็จ', text: 'นำข้อความไปวางใน Facebook ได้เลยครับ', timer: 1500, showConfirmButton: false });
    });
}

function downloadLottoImage() {
    const canvas = document.getElementById('lottoCaptureTarget');
    if (!canvas || canvas.tagName !== 'CANVAS') {
        Swal.fire('ข้อผิดพลาด', 'กรุณาสร้างโพสต์ก่อนดาวน์โหลด', 'error');
        return;
    }
    const link = document.createElement('a');
    link.download = `เลขเด็ดทักษา_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    Swal.fire({ icon: 'success', title: 'ดาวน์โหลดสำเร็จ!', text: 'รูปภาพถูกบันทึกลงในเครื่องของคุณแล้ว', timer: 2000, showConfirmButton: false });
}
