"use strict";

// ข้อมูลคำทำนายพรหมชาติ 12 ตำแหน่ง
const promchartData = [
  { name: "เจดีย์", detail: "ปีนั้นจะอยู่ร่มเย็นเป็นสุข จะมีความสุขกายสบายใจ จะได้ทำบุญกุศลในศาสนา ปรารถนาสิ่งใด ย่อมได้สมใจนึกแล" },
  { name: "ฉัตรเงิน", detail: "ปีนั้นจะมีลาภผลเงินทอง ใช้พอสบายไม่เดือดร้อนกายในครอบครัว ไปทางไหนทิศใด จะมีคนอุปถัมภ์ค้ำชูพอประมาณแล" },
  { name: "คอขาด", detail: "ปีนั้นจะประสบความร้อนอกร้อนใจ จะมีคดีความถึงโรงถึงศาลทำให้ต้องเสียเงินทองของรัก ไม่ดีเลย" },
  { name: "เรือนหลวง", detail: "ปีนั้นจะดีมีความสุขกายสบายใจ จะมีที่พึ่งพิงในความอนุเคราะห์ เป็นข้าราชการจะได้เลื่อนยศฐาบรรดาศักดิ์ดีแล" },
  { name: "ปราสาท", detail: "ปีนั้นว่าจะมีความสุขอย่างยิ่ง จะประสบโชคลาภมากมายในชีวิต คิดสิ่งใดจะได้สมความปรารถนา ดีนักแล" },
  { name: "ราหู", detail: "ปีนั้นจะเดือดร้อนใจอาจจะมีเรื่องทะเลาะวิวาท มีคนมาคอยยุแหย่ให้วุ่นวาย มีอาการเจ็บป่วยเป็นประจำ ไม่ดีแล" },
  { name: "ฉัตรทอง", detail: "ปีนั้นจะมีเกียรติยศปรากฏในฝูงชนทั่วไป ไปสารทิศใดๆจะมีคนคอยอุปถัมภ์ค้ำชู ไม่เดือดร้อนเลย ดีมากแล" },
  { name: "เทวดาขี่เต่า", detail: "ปีนั้นค่อนข้างดี จะมีคนคอยช่วยเหลือในหน้าที่การงาน แต่ระวังบริวารจะนำความเดือดร้อนมาให้ ดีปานกลางแล" },
  { name: "คนต้องข้อคา", detail: "ปีนั้นถึงคราวเคราะห์หามยามร้ายจะมีเรื่องวุ่นวายในตนและครอบครัว ไม่มีความสุขกายสบายใจเลย" },
  { name: "พ่อมด", detail: "ปีนั้นจะมีคนมาขอความช่วยเหลือรับอาสาเจ้านายจะได้ดี จะมีความทุกข์กายทุกข์ใจพอประมาณ ดีปานกลางแล" },
  { name: "แม่มด", detail: "ปีนั้นจะมีคนนำลาภมาให้ แต่ต้องแลกเปลี่ยนกับความช่วยเหลือจากตน มีความสบายใจพอประมาณแต่เหนื่อยใจปานกลางแล" },
  { name: "นาคราช", detail: "ปีนั้นจะมีอำนาจวาสนา ชะตากำลังดี มีคนมาอ่อนน้อมยอมเป็นคนรับใช้ แต่ให้ระวังคำพูดและอารมณ์ให้มาก ดีปานกลางแล" }
];

// พิกัดสำหรับไฮไลท์บนวงล้อ
const posCoords = [
  {x: 200, y: 45, angle: 0}, {x: 275, y: 65, angle: 30}, {x: 335, y: 125, angle: 60},
  {x: 355, y: 200, angle: 90}, {x: 335, y: 275, angle: 120}, {x: 275, y: 335, angle: 150},
  {x: 200, y: 355, angle: 180}, {x: 125, y: 335, angle: 210}, {x: 65, y: 275, angle: 240},
  {x: 45, y: 200, angle: 270}, {x: 65, y: 125, angle: 300}, {x: 125, y: 65, angle: 330}
];

// ไอคอนสำหรับวาดบน Canvas
const canvasIcons = [
  { name: "เจดีย์", path: "M0 -40 L25 40 L-25 40 Z M-5 -45 H5 V-40 H-5 Z", color: "#f1c40f" },
  { name: "ฉัตรเงิน", path: "M-25 0 Q0 -35 25 0 L0 0 Z M-2 0 V40 H2 V0 Z", color: "#bdc3c7" },
  { name: "คอขาด", path: "M0 -25 A15 15 0 1 1 0 5 A15 15 0 1 1 0 -25 M-20 40 Q0 10 20 40", color: "#e74c3c" },
  { name: "เรือนหลวง", path: "M-30 40 V0 L0 -30 L30 0 V40 Z M-10 10 H10 V40 H-10 Z", color: "#2980b9" },
  { name: "ปราสาท", path: "M-30 40 V0 L-15 -20 L0 0 L15 -20 L30 0 V40 Z M-5 15 H5 V40 H-5 Z", color: "#8e44ad" },
  { name: "ราหู", path: "M0 0 A35 35 0 1 1 0 0.1 Z M-15 -10 A3 3 0 1 0 -15 -9.9 Z M15 -10 A3 3 0 1 0 15 -9.9 Z", color: "#2c3e50" },
  { name: "ฉัตรทอง", path: "M-30 -5 Q0 -40 30 -5 L0 -5 Z M-20 -5 Q0 -30 20 -5 L0 -5 Z M-10 -5 Q0 -20 10 -5 L0 -5 Z M-2 -5 V40 H2 V-5 Z", color: "#f1c40f" },
  { name: "เทวดาขี่เต่า", path: "M0 20 A30 18 0 1 1 0 20.1 Z M0 -15 A12 12 0 1 1 0 -14.9 Z", color: "#27ae60" },
  { name: "คนต้องข้อคา", path: "M-35 0 H35 V15 H-35 Z M-5 0 V15 M5 0 V15", color: "#7f8c8d" },
  { name: "พ่อมด", path: "M-25 35 L0 -25 L25 35 Z M0 45 A5 5 0 1 1 0 44.9 Z", color: "#34495e" },
  { name: "แม่มด", path: "M-30 25 Q0 -25 30 25 Z M0 40 A8 8 0 1 1 0 39.9 Z", color: "#9b59b6" },
  { name: "นาคราช", path: "M-35 15 Q-15 -30 0 0 Q15 30 35 -15", color: "#16a085" }
];

let shareCanvas = null;

document.addEventListener('DOMContentLoaded', () => {
  shareCanvas = document.getElementById('shareCanvas');
  if (shareCanvas) {
    shareCanvas.width = 1200;
    shareCanvas.height = 1200;
  }
  initHoverTooltips(); // เพิ่ม tooltip ตอนชี้จุด
});

function getPosition(age, gender) {
  const base = (age - 1) % 12;
  return gender === 'male' ? base : (12 - base) % 12;
}

function calculateFortune() {
  const ageInput = document.getElementById('userAgeprom');
  const genderInput = document.getElementById('userGender');
  
  const age = parseInt(ageInput?.value, 10);
  const gender = genderInput?.value;

  if (!age || age < 1) {
    alert("กรุณาระบุอายุ");
    return;
  }

  const position = getPosition(age, gender);
  const fortune = promchartData[position];

  const resultDisplay = document.getElementById('resultDisplay');
  const fortuneName = document.getElementById('fortuneName');
  const fortuneDetail = document.getElementById('fortuneDetail');

  if (resultDisplay) resultDisplay.style.display = 'block';
  if (fortuneName) fortuneName.textContent = fortune.name;
  if (fortuneDetail) fortuneDetail.textContent = fortune.detail;

  updateHighlight(position);
}

function updateHighlight(index) {
  const circle = document.getElementById('highlight-circle');
  const needle = document.getElementById('wheel-needle');
  const target = posCoords[index];
  if (!target) return;

  if (circle) {
    circle.setAttribute('cx', target.x);
    circle.setAttribute('cy', target.y);
    circle.style.display = 'block';
  }

  if (needle) {
    needle.style.display = 'block';
    needle.style.transformOrigin = "200px 200px";
    needle.style.transform = `rotate(${target.angle}deg)`;
    needle.style.transition = "transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  }

  for (let i = 0; i < 12; i++) {
    const el = document.getElementById(`pos-${i}`);
    if (el) el.style.opacity = "0.3";
  }
  const activeGroup = document.getElementById(`pos-${index}`);
  if (activeGroup) {
    activeGroup.style.opacity = "1";
    activeGroup.style.transition = "0.5s";
  }
}

// --- ใหม่: Tooltip ตอนชี้ ---
function initHoverTooltips() {
  let tooltip = document.getElementById('prom-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'prom-tooltip';
    Object.assign(tooltip.style, {
      position: 'absolute',
      display: 'none',
      padding: '10px 14px',
      background: 'rgba(44, 62, 80, 0.95)',
      color: 'white',
      borderRadius: '10px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '260px',
      zIndex: '9999',
      pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontFamily: "'Sarabun', sans-serif"
    });
    document.body.appendChild(tooltip);
  }

  for (let i = 0; i < 12; i++) {
    const el = document.getElementById(`pos-${i}`);
    if (!el) continue;
    const data = promchartData[i];
    
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', () => {
      tooltip.innerHTML = `<strong style="color:#f1c40f;font-size:16px">${data.name}</strong><br>${data.detail}`;
      tooltip.style.display = 'block';
    });
    el.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.pageX + 15) + 'px';
      tooltip.style.top = (e.pageY + 15) + 'px';
    });
    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
    // สำหรับมือถือ: แตะแล้วแสดง
    el.addEventListener('click', (e) => {
      tooltip.innerHTML = `<strong style="color:#f1c40f;font-size:16px">${data.name}</strong><br>${data.detail}`;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.pageX + 15) + 'px';
      tooltip.style.top = (e.pageY + 15) + 'px';
      setTimeout(() => tooltip.style.display = 'none', 3000);
    });
  }
}

function createShareImage(callback) {
  if (!shareCanvas) {
    console.error('shareCanvas not found');
    return;
  }
  
  const age = parseInt(document.getElementById('userAgeprom')?.value, 10);
  const gender = document.getElementById('userGender')?.value;
  const genderText = gender === 'male' ? 'ชาย' : 'หญิง';

  if (!age || age < 1) {
    alert("กรุณาระบุอายุก่อน");
    return;
  }

  const position = getPosition(age, gender);
  const fortune = promchartData[position];
  const ctx = shareCanvas.getContext('2d');

  ctx.fillStyle = '#f8f9ff';
  ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);

  ctx.fillStyle = '#6c5ce7';
  ctx.font = "bold 60px 'Sarabun', 'Noto Sans Thai', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('ผลทำนายดวงชะตาตามตำราพรหมชาติ', 600, 100);

  ctx.fillStyle = '#2d3436';
  ctx.font = "40px 'Sarabun', 'Noto Sans Thai', sans-serif";
  ctx.fillText(`เพศ: ${genderText} | อายุ: ${age} ปี`, 600, 180);

  drawSimplifiedWheel(ctx);
  drawActiveIcon(ctx, fortune);

  ctx.fillStyle = '#2d3436';
  ctx.font = "36px 'Sarabun', 'Noto Sans Thai', sans-serif";
  ctx.textAlign = 'left';
  wrapText(ctx, fortune.detail, 200, 850, 800, 50);

  ctx.fillStyle = '#b2bec3';
  ctx.font = "30px 'Sarabun', 'Noto Sans Thai', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('siamhora.com', 600, 1150);

  if (typeof callback === 'function') callback();
}

function drawSimplifiedWheel(ctx) {
  ctx.beginPath();
  ctx.arc(600, 500, 300, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#6c5ce7';
  ctx.stroke();
}

function drawActiveIcon(ctx, fortune) {
  const icon = canvasIcons.find(i => i.name === fortune.name);
  if (!icon) return;

  ctx.save();
  ctx.translate(600, 450);
  ctx.scale(3, 3);
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 15;

  const p = new Path2D(icon.path);
  if (fortune.name === "นาคราช" || fortune.name === "คนต้องข้อคา") {
    ctx.strokeStyle = icon.color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(p);
  } else {
    ctx.fillStyle = icon.color;
    ctx.fill(p);
  }
  ctx.restore();

  ctx.fillStyle = '#6c5ce7';
  ctx.font = "bold 85px 'Sarabun', 'Noto Sans Thai', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(fortune.name, 600, 700);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  if (words.length > 1) {
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
  } else {
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i];
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, y);
        line = text[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, y);
  }
}

function downloadHoroscopeImage() {
  const age = parseInt(document.getElementById('userAgeprom')?.value, 10);
  if (!age || age < 1) {
    alert("กรุณาระบุอายุก่อนดาวน์โหลด");
    return;
  }
  createShareImage(() => {
    const fortuneName = document.getElementById('fortuneName')?.textContent || 'promchart';
    const link = document.createElement('a');
    link.download = `ดวงพรหมชาติ-${fortuneName}-${age}ปี.png`;
    link.href = shareCanvas.toDataURL("image/png");
    link.click();
  });
}

function shareToFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

window.calculateFortune = calculateFortune;
window.downloadHoroscopeImage = downloadHoroscopeImage;
window.createShareImage = createShareImage;
window.shareToFacebook = shareToFacebook;

