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
    
    const isDay = cards.length === 7;
    const cols = isDay ? 2 : 2; // Use 2 columns for both to give enough space for reading
    
    let itemsHtml = '';
    
    for(let card of cards) {
        const bgColor = HEX_COLORS[card.icon] || "#d4af37";
        
        // เราจะไม่ย่อข้อความมากเกินไป เพื่อให้อ่านรู้เรื่อง
        let wShort = card.wText.length > 70 ? card.wText.substring(0, 70) + '...' : card.wText;
        let fShort = card.fText.length > 70 ? card.fText.substring(0, 70) + '...' : card.fText;
        let lShort = card.lText.length > 70 ? card.lText.substring(0, 70) + '...' : card.lText;
        
        itemsHtml += `
            <div style="background: #ffffff; padding: 25px 30px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.04); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 12px; height: 100%; box-sizing: border-box;">
                
                <!-- Color Bar -->
                <div style="position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: ${bgColor};"></div>
                
                <div style="font-size: 24px; color: #2c3e50; font-weight: 700; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        ${card.icon}
                    </div>
                    ${card.title}
                </div>
                
                <div style="font-size: 17px; line-height: 1.5; color: #4a5568; display: flex; gap: 10px;">
                    <span style="font-size: 18px;">💼</span>
                    <span>${wShort}</span>
                </div>
                <div style="font-size: 17px; line-height: 1.5; color: #4a5568; display: flex; gap: 10px;">
                    <span style="font-size: 18px;">💰</span>
                    <span>${fShort}</span>
                </div>
                <div style="font-size: 17px; line-height: 1.5; color: #4a5568; display: flex; gap: 10px;">
                    <span style="font-size: 18px;">❤️</span>
                    <span>${lShort}</span>
                </div>
                
                <div style="margin-top: auto; padding-top: 15px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="background: #fdfaf0; border: 1px solid #f5e6b3; color: #b8860b; padding: 6px 15px; border-radius: 20px; font-size: 15px; font-weight: 600;">
                        ✨ เลขมงคล: ${card.luckyNum || '00'}
                    </div>
                </div>
            </div>
        `;
    }

    const dateStr = document.getElementById('genDate').value;
    const dateObj = new Date(dateStr);
    const dateThStr = dateObj.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // CSS Grid setup for layout
    let gridLayout = '';
    if (isDay) {
        // For 7 days, first row has 1 full-width card, then 3 rows of 2 cards
        itemsHtml = itemsHtml.replace('<div style="background: #ffffff;', '<div style="background: #ffffff; grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="first-card-override"');
        // We actually just let CSS Grid handle it without complex string replacement, 
        // a simple masonry or 2 columns where the last element spans 2 columns is easier.
    }
    
    // Actually, letting CSS Grid auto-flow is best.
    const lastChildSpan = isDay ? `
        <style>
            #exportSummary .grid-container > div:last-child {
                grid-column: 1 / -1;
                max-width: 50%;
                margin: 0 auto;
            }
        </style>
    ` : '';

    container.innerHTML = `
        ${lastChildSpan}
        <div id="exportSummary" style="width: 1080px; background: linear-gradient(135deg, #ffffff 0%, #f4f6f9 100%); color: #333; font-family: 'Sarabun', sans-serif; padding: 60px; box-sizing: border-box; text-align: center; position: relative;">
            
            <!-- Minimalist decorative background -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 350px; background: linear-gradient(to bottom, #fdf8eb, transparent); z-index: 1;"></div>
            
            <div style="position: relative; z-index: 10;">
                
                <div style="margin-bottom: 50px;">
                    <h1 style="color: #b8860b; font-size: 52px; margin: 0 0 10px 0; font-weight: 700; letter-spacing: 0px; display: flex; justify-content: center; align-items: center; gap: 15px;">
                        <span style="font-size: 45px;">🌙</span> สรุปดวงประจำวัน
                    </h1>
                    <h2 style="color: #6c7a89; font-weight: 500; font-size: 26px; margin: 0;">
                        ประจำ${dateThStr}
                    </h2>
                </div>
                
                <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; text-align: left;">
                    ${itemsHtml}
                </div>
                
                <div style="margin-top: 50px; font-size: 22px; color: #8b6b22; font-weight: 500; padding: 20px; background: #fffdf5; border: 1px dashed #d4af37; border-radius: 12px; display: inline-block;">
                    🌟 อ่านคำทำนายเจาะลึก 100% ได้ที่แคปชั่น! #สยามโหรามงคล 🌟
                </div>
                
            </div>
        </div>
    `;

    // Fix the first card override trick we attempted
    const exportDiv = document.getElementById('exportSummary');
    if (isDay) {
        const cardsArr = exportDiv.querySelectorAll('.grid-container > div');
        if (cardsArr.length === 7) {
            cardsArr[6].style.gridColumn = "1 / -1";
            cardsArr[6].style.maxWidth = "calc(50% - 12.5px)";
            cardsArr[6].style.justifySelf = "center";
            cardsArr[6].style.width = "100%";
        }
    }

    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('exportSummary');
    const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff"
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

print("Updated downloadSummaryImage to light minimal style")
