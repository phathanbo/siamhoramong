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
    
    // Vibrant colors for the day indicators (matches the mockup's neon glow feel)
    const HEX_COLORS = {
        "🔴": "#ff4d4d", "🟡": "#ffd700", "🩷": "#ffb6c1",
        "🟢": "#00e676", "🟠": "#ff9100", "🔵": "#2979ff", "🟣": "#d500f9",
        "♈": "#ff4d4d", "♉": "#00e676", "♊": "#ffd700", "♋": "#b0bec5",
        "♌": "#ff9100", "♍": "#78909c", "♎": "#2979ff", "♏": "#d500f9",
        "♐": "#ffab00", "♑": "#455a64", "♒": "#00b0ff", "♓": "#00e5ff"
    };
    
    let itemsHtml = '';
    
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        
        let wShort = card.wText.length > 50 ? card.wText.substring(0, 50) + '...' : card.wText;
        let fShort = card.fText.length > 50 ? card.fText.substring(0, 50) + '...' : card.fText;
        let lShort = card.lText.length > 50 ? card.lText.substring(0, 50) + '...' : card.lText;
        
        // Remove emoji from card title if it exists, as we use a colored circle instead
        let cleanTitle = card.title;
        
        itemsHtml += `
            <div style="background: rgba(255, 255, 255, 0.4); border-radius: 18px; padding: 20px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05), inset 0 10px 20px -10px ${bgColor}88; border: 1px solid rgba(255, 255, 255, 0.8); display: flex; flex-direction: column; gap: 8px; width: calc(33.333% - 14px); box-sizing: border-box; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                
                <!-- Card Header -->
                <div style="font-size: 20px; color: #1a1a2e; font-weight: bold; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 12px; margin-bottom: 5px;">
                    <div style="width: 18px; height: 18px; border-radius: 50%; background: ${bgColor}; box-shadow: 0 0 8px ${bgColor}; border: 2px solid white;"></div>
                    ${cleanTitle}
                    
                    <!-- Faded planet icon top right -->
                    <div style="position: absolute; top: 15px; right: 15px; font-size: 30px; opacity: 0.15; filter: grayscale(100%);">🪐</div>
                </div>
                
                <!-- Content -->
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">💼</span>
                    <span>${wShort}</span>
                </div>
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">💰</span>
                    <span>${fShort}</span>
                </div>
                <div style="font-size: 13.5px; line-height: 1.5; color: #2d3436; display: flex; gap: 6px;">
                    <span style="font-size: 14px;">❤️</span>
                    <span>${lShort}</span>
                </div>
                
                <!-- Bottom Pill & Stars -->
                <div style="margin-top: auto; padding-top: 10px; text-align: center;">
                    <div style="background: linear-gradient(to right, #b8860b, #d4af37); color: white; padding: 4px 20px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        เลขมงคล: ${card.luckyNum || '00'}
                    </div>
                    <div style="margin-top: 5px; color: #FFDF73; font-size: 14px; letter-spacing: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                        ⭐⭐⭐⭐⭐
                    </div>
                </div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
        <div id="exportSummary" style="width: 1080px; background: linear-gradient(135deg, #6c7293, #8c90a8, #6c7293); color: #333; font-family: 'Sarabun', sans-serif; padding: 35px; box-sizing: border-box; text-align: center; position: relative;">
            
            <!-- Stars background -->
            <div style="position: absolute; top: 15%; left: 10%; font-size: 10px; color: white; opacity: 0.5;">✨</div>
            <div style="position: absolute; top: 30%; right: 15%; font-size: 14px; color: white; opacity: 0.4;">✨</div>
            <div style="position: absolute; bottom: 20%; left: 20%; font-size: 12px; color: white; opacity: 0.6;">✨</div>
            <div style="position: absolute; bottom: 40%; right: 10%; font-size: 8px; color: white; opacity: 0.5;">✨</div>
            <div style="position: absolute; top: 50%; left: 5%; font-size: 16px; color: white; opacity: 0.3;">✨</div>
            
            <div style="position: relative; z-index: 10; background: rgba(255, 255, 255, 0.25); padding: 35px 30px; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(10px);">
                
                <div style="margin-bottom: 25px;">
                    <h1 style="color: #FFDF73; font-size: 48px; margin: 0 0 5px 0; font-weight: bold; text-shadow: 1px 2px 4px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; gap: 15px;">
                        <span style="font-size: 50px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🌙</span> สรุปดวงประจำวัน
                    </h1>
                    <h2 style="color: #ffffff; font-weight: 500; font-size: 22px; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                        ประจำ${dateThStr}
                    </h2>
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; text-align: left;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 30px; font-size: 16px; color: #333; font-weight: bold; padding: 10px 30px; background: rgba(255,255,255,0.7); border-radius: 30px; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.9);">
                    <span style="color: #b8860b;">🌟</span> อ่านคำทำนายเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล <span style="color: #b8860b;">🌟</span>
                </div>
                
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#6c7293",
        logging: false
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

print("Updated downloadSummaryImage to match the provided mockup")
