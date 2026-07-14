import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace downloadSummaryImage
old_func_pattern = r'async function downloadSummaryImage\(\) \{.*\}'

new_func = """async function downloadSummaryImage() {
    if (!window.lastGeneratedCards || window.lastGeneratedCards.length === 0) return alert('ยังไม่มีข้อมูล กรุณากดสร้างข้อความก่อน');
    if (typeof html2canvas === 'undefined') return alert('กำลังโหลดไลบรารีรูปภาพ กรุณารอสักครู่...');

    const container = document.getElementById('canvasExportArea');
    const cards = window.lastGeneratedCards;
    
    // Light, vibrant colors for the day indicators
    const HEX_COLORS = {
        "🔴": "#e74c3c", "🟡": "#f1c40f", "🩷": "#fd79a8",
        "🟢": "#2ecc71", "🟠": "#e67e22", "🔵": "#3498db", "🟣": "#9b59b6",
        "♈": "#e74c3c", "♉": "#2ecc71", "♊": "#f1c40f", "♋": "#b2bec3",
        "♌": "#e67e22", "♍": "#636e72", "♎": "#3498db", "♏": "#9b59b6",
        "♐": "#e1b12c", "♑": "#2d3436", "♒": "#00cec9", "♓": "#0984e3"
    };
    
    let itemsHtml = '';
    
    // We will use a 3-column layout for both to keep the image compact (Square-ish for Facebook)
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        
        // ย่อข้อความให้สั้นลง เพื่อให้การ์ดไม่สูงเกินไป
        let wShort = card.wText.length > 40 ? card.wText.substring(0, 40) + '...' : card.wText;
        let fShort = card.fText.length > 40 ? card.fText.substring(0, 40) + '...' : card.fText;
        let lShort = card.lText.length > 40 ? card.lText.substring(0, 40) + '...' : card.lText;
        
        itemsHtml += `
            <div style="background: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px; width: calc(33.333% - 14px); box-sizing: border-box; position: relative; overflow: hidden;">
                
                <!-- Color Bar Top -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: ${bgColor};"></div>
                
                <div style="font-size: 18px; color: #2c3e50; font-weight: 700; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-top: 4px;">
                    <span>${card.icon}</span> ${card.title}
                </div>
                
                <div style="font-size: 14px; line-height: 1.4; color: #4a5568; display: flex; gap: 6px;">
                    <span>💼</span>
                    <span>${wShort}</span>
                </div>
                <div style="font-size: 14px; line-height: 1.4; color: #4a5568; display: flex; gap: 6px;">
                    <span>💰</span>
                    <span>${fShort}</span>
                </div>
                <div style="font-size: 14px; line-height: 1.4; color: #4a5568; display: flex; gap: 6px;">
                    <span>❤️</span>
                    <span>${lShort}</span>
                </div>
                
                <div style="margin-top: auto; padding-top: 8px; text-align: center;">
                    <div style="background: #fdfaf0; border: 1px solid #f5e6b3; color: #b8860b; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; display: inline-block;">
                        ✨ เลขมงคล: ${card.luckyNum || '00'}
                    </div>
                </div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div id="exportSummary" style="width: 1080px; background: #faf9f6; color: #333; font-family: 'Sarabun', sans-serif; padding: 40px; box-sizing: border-box; text-align: center; position: relative;">
            
            <div style="position: relative; z-index: 10; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid rgba(212, 175, 55, 0.2);">
                
                <div style="margin-bottom: 30px;">
                    <h1 style="color: #b8860b; font-size: 42px; margin: 0 0 5px 0; font-weight: 700; display: flex; justify-content: center; align-items: center; gap: 10px;">
                        <span style="font-size: 38px;">🌙</span> สรุปดวงประจำวัน
                    </h1>
                    <h2 style="color: #6c7a89; font-weight: 500; font-size: 22px; margin: 0;">
                        ประจำ${dateThStr}
                    </h2>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; text-align: left;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 30px; font-size: 18px; color: #8b6b22; font-weight: 500; padding: 12px 25px; background: #fffdf5; border-radius: 30px; display: inline-block;">
                    🌟 อ่านคำทำนายเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล 🌟
                </div>
                
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#faf9f6"
    });
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    
    const link = document.createElement('a');
    link.download = `ดวงรายวัน_${dateStr}.png`;
    link.href = dataUrl;
    link.click();
    
    container.innerHTML = '';
}"""

updated_text = re.sub(old_func_pattern, new_func, text, flags=re.DOTALL)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(updated_text)

print("Updated downloadSummaryImage to square compact style")
