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
    
    const HEX_COLORS = {
        "🔴": "#ff4757", "🟡": "#ffa502", "🩷": "#ff9ff3",
        "🟢": "#2ed573", "🟠": "#ff7f50", "🔵": "#1e90ff", "🟣": "#9b59b6",
        "♈": "#ff4757", "♉": "#2ed573", "♊": "#ffa502", "♋": "#dfe4ea",
        "♌": "#ff7f50", "♍": "#ced6e0", "♎": "#1e90ff", "♏": "#9b59b6",
        "♐": "#eccc68", "♑": "#2f3542", "♒": "#7bed9f", "♓": "#70a1ff"
    };
    
    let itemsHtml = '';
    
    // For 7 items, we can use flexbox to center the last one
    // For 12 items, 3 columns is better
    const isDay = cards.length === 7;
    const cardWidth = isDay ? 'calc(50% - 15px)' : 'calc(33.333% - 14px)';
    
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        // ย่อข้อความ
        let wShort = card.wText.substring(0, 45) + '...';
        let fShort = card.fText.substring(0, 45) + '...';
        let lShort = card.lText.substring(0, 45) + '...';
        
        itemsHtml += `
            <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); border-top: 1px solid rgba(255,255,255,0.3); border-left: 1px solid rgba(255,255,255,0.3); box-shadow: 0 15px 35px rgba(0,0,0,0.2), inset 0 0 20px rgba(${parseInt(bgColor.slice(1,3),16)}, ${parseInt(bgColor.slice(3,5),16)}, ${parseInt(bgColor.slice(5,7),16)}, 0.1); width: ${cardWidth}; text-align: left; position: relative; overflow: hidden; box-sizing: border-box;">
                
                <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: ${bgColor}; opacity: 0.15; filter: blur(30px); border-radius: 50%;"></div>
                
                <div style="font-size: 24px; color: ${bgColor}; margin-bottom: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                    <span style="font-size: 28px;">${card.icon}</span> ${card.title}
                </div>
                <div style="font-size: 16px; margin-bottom: 8px; line-height: 1.4; color: #f1f2f6;"><span style="display: inline-block; width: 25px;">💼</span> ${wShort}</div>
                <div style="font-size: 16px; margin-bottom: 8px; line-height: 1.4; color: #f1f2f6;"><span style="display: inline-block; width: 25px;">💰</span> ${fShort}</div>
                <div style="font-size: 16px; margin-bottom: 12px; line-height: 1.4; color: #f1f2f6;"><span style="display: inline-block; width: 25px;">❤️</span> ${lShort}</div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 14px; color: #d4af37; font-weight: 600;">✨ เลขพารวย: ${card.luckyNum || '00'}</div>
                </div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div id="exportSummary" style="width: 1080px; background: radial-gradient(circle at top right, #2c1b4d, #0f0c29 40%, #1a1a2e 100%); color: white; font-family: 'Sarabun', sans-serif; padding: 50px; box-sizing: border-box; text-align: center; position: relative;">
            
            <!-- Stars background -->
            <div style="position: absolute; top: 10%; left: 5%; width: 4px; height: 4px; background: white; border-radius: 50%; box-shadow: 0 0 10px 2px rgba(255,255,255,0.8);"></div>
            <div style="position: absolute; top: 25%; right: 10%; width: 3px; height: 3px; background: white; border-radius: 50%; box-shadow: 0 0 8px 1px rgba(255,255,255,0.6);"></div>
            <div style="position: absolute; bottom: 15%; left: 15%; width: 5px; height: 5px; background: #FFDF73; border-radius: 50%; box-shadow: 0 0 15px 3px rgba(212,175,55,0.8);"></div>
            <div style="position: absolute; bottom: 30%; right: 5%; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 5px 1px rgba(255,255,255,0.5);"></div>
            
            <!-- Golden frame -->
            <div style="border: 2px solid rgba(212, 175, 55, 0.4); border-radius: 30px; padding: 40px; position: relative; z-index: 10; box-shadow: inset 0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3);">
                
                <div style="margin-bottom: 40px;">
                    <h1 style="color: #FFDF73; font-size: 48px; margin: 0 0 15px 0; font-weight: 700; letter-spacing: 2px; text-shadow: 0 5px 15px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.5); display: flex; justify-content: center; align-items: center; gap: 15px;">
                        <span style="font-size: 55px;">🔮</span> สรุปดวงประจำวัน
                    </h1>
                    <h2 style="color: #e0e0e0; font-weight: 400; font-size: 26px; margin: 0; text-shadow: 0 2px 5px rgba(0,0,0,0.5); letter-spacing: 1px;">
                        ${dateThStr}
                    </h2>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 50px; font-size: 22px; color: #FFDF73; font-weight: 300; letter-spacing: 1.5px; background: rgba(0,0,0,0.3); padding: 15px 30px; border-radius: 50px; display: inline-block; border: 1px solid rgba(212,175,55,0.2);">
                    ✨ อ่านคำทำนายเจาะลึกแบบเต็มๆ ได้ที่แคปชั่น! #สยามโหรามงคล ✨
                </div>
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: "#0f0c29"
    });
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    
    const link = document.createElement('a');
    link.download = `สรุปดวงรายวัน_${dateStr}.png`;
    link.href = dataUrl;
    link.click();
    
    container.innerHTML = '';
}"""

updated_text = re.sub(old_func_pattern, new_func, text, flags=re.DOTALL)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(updated_text)

print("Updated downloadSummaryImage styling")
