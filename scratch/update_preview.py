import re
import os

with open('adminVipReport.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Update previewScreen to display: block
js_content = js_content.replace("previewScreen = document.getElementById('previewArea');\n    previewScreen.innerHTML = ''; // Clear old content",
                                "previewScreen = document.getElementById('previewArea');\n    previewScreen.style.display = 'block';\n    previewScreen.innerHTML = ''; // Clear old content")

# 2. Replace navHTML
old_nav = r"const navHTML = `.*?`;"
new_nav = """const navHTML = `
        <div id="vipPdfPreviewNav" style="position: sticky; top: 0; background: rgba(20, 15, 35, 0.95); backdrop-filter: blur(10px); padding: 15px 30px; border-bottom: 1px solid rgba(212,175,55,0.3); border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="color: #FFDF73; font-size: 20px; font-weight: bold;">
                <i class="fas fa-eye"></i> พรีวิวตัวอย่างรายงาน (VIP)
            </div>
            <div>
                <button onclick="window.print()" style="background: linear-gradient(135deg, #d4af37, #f39c12); color: #111; font-weight: bold; font-size: 16px; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(212,175,55,0.4); transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-file-download"></i> บันทึกเป็น PDF (Print)
                </button>
            </div>
        </div>
    `;"""
js_content = re.sub(old_nav, new_nav, js_content, flags=re.DOTALL)

# 3. Add transform to @media screen
old_media = r"@media screen {\s*\.pdf-page {\s*box-shadow: 0 4px 15px rgba\(0,0,0,0\.5\);\s*}\s*}"
new_media = """@media screen {
                .pdf-page {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                    transform: scale(0.65);
                    transform-origin: top center;
                    margin-bottom: -100mm;
                    border-radius: 10px;
                }
                #vipPdfPreviewContent {
                    padding-bottom: 110mm !important;
                }
                /* Hide sidebar when printing */
            }
            @media print {
                body { background: #fff !important; }
                .sidebar, .header, #vipPdfPreviewNav, .back-btn { display: none !important; }
                .content { padding: 0 !important; gap: 0 !important; display: block !important; }
                .preview-area { padding: 0 !important; background: none !important; border: none !important; border-radius: 0 !important; display: block !important; }
                #vipPdfPreviewContent { gap: 0 !important; padding: 0 !important; }
            }"""
js_content = re.sub(old_media, new_media, js_content, flags=re.DOTALL)

with open('adminVipReport.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print("Updated adminVipReport.js")
