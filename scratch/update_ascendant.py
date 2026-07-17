
import sys

filepath = r"D:\สยามโหรามงคล\ascendant.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """async function saveAscendantImg() {
  if (typeof html2canvas === "undefined") {
    Swal.fire('เกิดข้อผิดพลาด', 'ระบบไม่พบ Library สำหรับสร้างภาพ', 'error');
    return;
  }
  const captureArea = document.getElementById('ascendantResult');
  if (!captureArea || captureArea.style.display === 'none') {
    Swal.fire('แจ้งเตือน', 'กรุณาคำนวณลัคนาก่อนบันทึกภาพครับ', 'warning');
    return;
  }
  const saveBtn = document.querySelector('.btn-outline-gold');
  if (saveBtn) saveBtn.style.display = 'none';
  try {
    const canvas = await html2canvas(captureArea, {
      backgroundColor: '#000000', scale: 2, useCORS: true, logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('ascendantResult');
        if (el) { el.style.padding = '30px'; el.style.border = '2px solid #d4af37'; el.style.borderRadius = '15px'; }
      }
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const zodiacName = document.getElementById('ascSign')?.innerText.replace('ลัคนาราศี', '') || '';
    link.download = `ลัคนา_ราศี${zodiacName}.png`;
    link.click();
  } catch (e) {
    console.error('Capture Error:', e);
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้ โปรดลองอีกครั้ง', 'error');
  } finally {
    if (saveBtn) saveBtn.style.display = '';
  }
}"""

replacement = """async function saveAscendantImg() {
  const captureArea = document.getElementById('ascendantResult');
  if (!captureArea || captureArea.style.display === 'none') {
    Swal.fire('แจ้งเตือน', 'กรุณาคำนวณลัคนาก่อนบันทึกภาพครับ', 'warning');
    return;
  }
  
  Swal.fire({
      title: 'กำลังสร้างรูปภาพ...',
      text: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
  });

  try {
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1350;
    
    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.setLineDash([]);
    
    // Header
    const icon = document.getElementById('ascIcon')?.innerText || '?';
    const sign = document.getElementById('ascSign')?.innerText || 'ลัคนา';
    const degree = document.getElementById('ascDegree')?.innerText || '';
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 120px "Sarabun", sans-serif';
    ctx.fillText(icon, canvas.width / 2, 120);
    
    ctx.font = 'bold 65px "Sarabun", sans-serif';
    ctx.fillText(sign, canvas.width / 2, 260);
    
    ctx.font = '35px "Sarabun", sans-serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.fillText(degree, canvas.width / 2, 340);
    
    // Content box
    ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.fillRect(80, 420, canvas.width - 160, 720);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 420, canvas.width - 160, 720);
    
    // Detail texts
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let y = 480;
    const drawLine = (label, text, color) => {
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText(label, 120, y);
        const w = ctx.measureText(label).width;
        ctx.font = '36px "Sarabun", sans-serif';
        ctx.fillStyle = color || '#ffffff';
        ctx.fillText(text, 120 + w + 15, y);
        y += 65;
    };
    
    const ruler = document.getElementById('ascruler')?.innerText || '';
    drawLine('ดาวเจ้าเรือน:', ruler, '#ffffff');
    
    const compatible = document.getElementById('asccompatible')?.innerText || '';
    drawLine('ราศีที่สมพงศ์:', compatible, '#ffffff');
    
    y += 15;
    const desc = document.getElementById('ascDesc')?.innerText || '';
    ctx.font = '32px "Sarabun", sans-serif';
    ctx.fillStyle = '#cccccc';
    
    // wrap logic
    let lines = [];
    if (window.Intl && window.Intl.Segmenter) {
        const seg = new Intl.Segmenter('th', { granularity: 'word' });
        const segments = seg.segment(desc);
        let curr = "";
        for (const {segment} of segments) {
            if (ctx.measureText(curr + segment).width > 800 && curr.trim() !== "") {
                lines.push(curr); curr = segment;
            } else curr += segment;
        }
        lines.push(curr);
    } else {
        lines.push(desc.substring(0, 50) + "...");
    }
    for(let l of lines) {
        ctx.fillText(l, 120, y);
        y += 50;
    }
    
    y += 20;
    const career = document.getElementById('asccareer')?.innerText || '';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(career, 120, y); y += 65;
    
    const strengths = document.getElementById('ascstrengths')?.innerText || '';
    drawLine('จุดเด่น:', strengths, '#4caf50');
    
    const weaknesses = document.getElementById('ascweaknesses')?.innerText || '';
    drawLine('ควรระวัง:', weaknesses, '#f44336');
    
    const love = document.getElementById('ascLove')?.innerText || '';
    drawLine('เรื่องรัก:', love, '#00bcd4');
    
    const health = document.getElementById('ascHealth')?.innerText || '';
    drawLine('สุขภาพ:', health, '#ff9800');
    
    // Footer watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '28px "Sarabun", sans-serif';
    ctx.fillText('สยามโหรามงคล - โปรแกรมคำนวณลัคนาพยากรณ์', canvas.width / 2, canvas.height - 100);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const zodiacName = sign.replace('ลัคนาราศี', '') || '';
    link.download = `ลัคนา_ราศี${zodiacName}.png`;
    link.click();
    
    Swal.close();
  } catch (e) {
    console.error('Capture Error:', e);
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้ โปรดลองอีกครั้ง', 'error');
  }
}"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced ascendant.js")
else:
    print("Target not found in ascendant.js")

