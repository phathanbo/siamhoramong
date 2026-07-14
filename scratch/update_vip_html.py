import re

with open('adminVipReport.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add missing scripts
if 'ascendant.js' not in html:
    html = html.replace('<script src="thai-astrology-data.js"></script>', 
                        '<script src="ascendant.js"></script>\n    <script src="thai-astrology-data.js"></script>')

# Replace the form group with member selection to include target month and hide the rest
new_sidebar = """<div class="sidebar">
            <h3 style="color: #fff; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">ข้อมูลรายงาน VIP</h3>
            
            <div class="form-group" style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #d4af37;">
                <label>👤 เลือกชื่อลูกค้าจากฐานข้อมูล:</label>
                <select id="vipMemberSelect" onchange="window.autoFillVipMember(this.value)" style="font-size: 16px;">
                    <option value="">-- กำลังโหลด --</option>
                </select>
            </div>
            
            <div class="form-group" style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #d4af37; margin-top: 10px;">
                <label>📅 เลือกเดือนที่ต้องการทำนาย:</label>
                <input type="month" id="vipTargetMonth" style="font-size: 16px;">
            </div>

            <!-- Hidden fields for JS logic -->
            <input type="hidden" id="vipName">
            <input type="hidden" id="vipIdCard">
            <input type="hidden" id="vipDobDate">
            <input type="hidden" id="vipDobTime">
            <input type="hidden" id="vipLocation">
            
            <button class="btn-generate" onclick="generateVIPReport()"><i class="fas fa-magic"></i> สร้างรายงาน (PDF)</button>
        </div>"""

html = re.sub(r'<div class="sidebar">.*?</div>', new_sidebar, html, flags=re.DOTALL)

with open('adminVipReport.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated adminVipReport.html")
