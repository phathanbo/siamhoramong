import os

functions_to_append = """
function copyGenResult() {
    const text = document.getElementById('genResultText').value;
    if(!text) return alert('ไม่มีข้อความให้คัดลอก');
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'คัดลอกสำเร็จ!',
            text: 'คัดลอกข้อความสำหรับโพสต์เรียบร้อยแล้ว',
            confirmButtonColor: '#d4af37',
            background: '#1a1a2e',
            color: '#fff'
        });
    }).catch(err => {
        alert('ไม่สามารถคัดลอกได้: ' + err);
    });
}

async function downloadSummaryImage() {
    if (!window.lastGeneratedCards || window.lastGeneratedCards.length === 0) return alert('ยังไม่มีข้อมูล กรุณากดสร้างข้อความก่อน');
    if (typeof html2canvas === 'undefined') return alert('กำลังโหลดไลบรารีรูปภาพ กรุณารอสักครู่...');

    const container = document.getElementById('canvasExportArea');
    const cards = window.lastGeneratedCards;
    
    const HEX_COLORS = {
        "🔴": "#e74c3c", "🟡": "#f1c40f", "💖": "#ff9ff3",
        "🟢": "#2ecc71", "🟠": "#e67e22", "🔵": "#3498db", "🟣": "#9b59b6",
        "♈": "#e74c3c", "♉": "#2ecc71", "♊": "#f1c40f", "♋": "#ecf0f1",
        "♌": "#e67e22", "♍": "#95a5a6", "♎": "#3498db", "♏": "#8e44ad",
        "♐": "#f39c12", "♑": "#34495e", "♒": "#00cec9", "♓": "#0984e3"
    };
    
    // คำนวณตาราง (ถ้า 7 วันให้เรียง 2x4, ถ้า 12 ราศีให้เรียง 3x4)
    const isDay = cards.length === 7;
    const cols = isDay ? 2 : 3;
    
    let itemsHtml = '';
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        // ย่อข้อความ
        let wShort = card.wText.substring(0, 25) + '...';
        let fShort = card.fText.substring(0, 25) + '...';
        let lShort = card.lText.substring(0, 25) + '...';
        
        itemsHtml += `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); border-left: 5px solid ${bgColor};">
                <div style="font-size: 20px; color: ${bgColor}; margin-bottom: 5px; font-weight: bold;">${card.icon} ${card.title}</div>
                <div style="font-size: 14px; margin-bottom: 3px;">💼 ${wShort}</div>
                <div style="font-size: 14px; margin-bottom: 3px;">💰 ${fShort}</div>
                <div style="font-size: 14px;">❤️ ${lShort}</div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div id="exportSummary" style="width: 1080px; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: white; font-family: 'Sarabun', sans-serif; padding: 40px; box-sizing: border-box; text-align: center; border-radius: 20px;">
            <div style="border: 2px dashed rgba(212, 175, 55, 0.5); border-radius: 20px; padding: 30px;">
                <h1 style="color: #FFDF73; font-size: 40px; margin: 0 0 10px 0; text-shadow: 0 0 20px rgba(212,175,55,0.4);">🔮 สรุปดวงประจำวัน</h1>
                <h2 style="color: white; font-weight: normal; margin: 0 0 30px 0;">${dateThStr}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 20px; text-align: left;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 40px; font-size: 24px; color: #888;">
                    อ่านคำทำนายแบบเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล
                </div>
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 100));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { scale: 1 });
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `สรุปดวงรายวัน_${dateStr}.png`;
    link.href = dataUrl;
    link.click();
    
    container.innerHTML = '';
}
"""

with open('adminContentGenerator.js', 'a', encoding='utf-8') as f:
    f.write("\n" + functions_to_append)

print("Appended missing functions.")
