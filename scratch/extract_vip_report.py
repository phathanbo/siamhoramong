import os

# 1. Update adminQuickTools.js
with open('adminQuickTools.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace onclick="openVIPReportModal()" with onclick="window.location.href='adminVipReport.html'"
text = text.replace('onclick="openVIPReportModal()"', 'onclick="window.location.href=\'adminVipReport.html\'"')

with open('adminQuickTools.js', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. Create adminVipReport.html
html_content = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>สร้างรายงานดวงชะตา (VIP) - สยามโหรามงคล</title>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Use local stylesheets if they exist, else basic styling -->
    <link rel="stylesheet" href="style.css">
    <style>
        body { margin: 0; background-color: #111; color: #fff; font-family: 'Sarabun', sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
        .header { background: linear-gradient(135deg, #1a1a1a, #000); padding: 20px 40px; border-bottom: 2px solid #d4af37; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .header h1 { margin: 0; color: #d4af37; font-size: 24px; text-shadow: 0 0 10px rgba(212,175,55,0.3); }
        .back-btn { background: #333; color: #fff; border: 1px solid #555; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: 0.3s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 16px; }
        .back-btn:hover { background: #444; border-color: #d4af37; color: #d4af37; }
        .content { display: flex; flex: 1; padding: 30px; gap: 30px; }
        .sidebar { flex: 0 0 350px; background: #1a1a1a; border: 1px solid #d4af37; border-radius: 15px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 15px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group label { color: #d4af37; font-weight: bold; }
        .form-group input, .form-group select { padding: 12px; border-radius: 8px; border: 1px solid #555; background: #222; color: #fff; font-family: 'Sarabun'; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #d4af37; }
        .btn-generate { background: linear-gradient(135deg, #d4af37, #f39c12); color: #111; font-weight: bold; font-size: 18px; padding: 15px; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212,175,55,0.4); }
        .preview-area { flex: 1; background: #2a2a2a; border-radius: 15px; padding: 30px; display: flex; justify-content: center; overflow-y: auto; align-items: flex-start; }
    </style>
</head>
<body>

    <div class="header">
        <h1><i class="fas fa-file-pdf"></i> ระบบสร้างรายงานดวงชะตา (VIP)</h1>
        <a href="taksasattalek.html#adminQuickToolsSection" class="back-btn"><i class="fas fa-arrow-left"></i> กลับไป Quick Tools</a>
    </div>

    <div class="content">
        <div class="sidebar">
            <h3 style="color: #fff; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">กรอกข้อมูลลูกค้า</h3>
            
            <div class="form-group" style="background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #444;">
                <label>🔍 ดึงข้อมูลจากระบบสมาชิก:</label>
                <select id="vipMemberSelect" onchange="window.autoFillVipMember(this.value)">
                    <option value="">-- กำลังโหลด --</option>
                </select>
                <small style="color: #aaa; margin-top: 5px; font-size: 0.85em;">* ข้อมูลด้านล่างจะถูกกรอกอัตโนมัติ</small>
            </div>
            
            <div class="form-group">
                <label>ชื่อ-นามสกุล / ชื่อเล่น:</label>
                <input type="text" id="vipName" placeholder="เช่น คุณสมชาย รักดี">
            </div>
            <div class="form-group" style="display:none;">
                <label>รหัสบัตรประชาชน (ออปชัน):</label>
                <input type="text" id="vipIdCard" placeholder="ไม่บังคับ">
            </div>
            <div class="form-group">
                <label>วันเดือนปีเกิด (ค.ศ.):</label>
                <input type="date" id="vipDobDate">
            </div>
            <div class="form-group">
                <label>เวลาเกิด (ถ้ามี):</label>
                <input type="time" id="vipDobTime">
            </div>
            <div class="form-group">
                <label>จังหวัดที่เกิด:</label>
                <select id="vipProvince"></select>
            </div>
            
            <button class="btn-generate" onclick="generateVIPReport()"><i class="fas fa-magic"></i> สร้างรายงาน (PDF)</button>
        </div>
        
        <div class="preview-area" id="previewArea">
            <div style="color: #777; text-align: center; margin-top: 50px;">
                <i class="fas fa-file-alt" style="font-size: 60px; margin-bottom: 15px; opacity: 0.5;"></i><br>
                <h3 style="margin:0;">ยังไม่ได้สร้างรายงาน</h3>
                <p>กรุณากรอกข้อมูลและกดปุ่ม "สร้างรายงาน" ด้านซ้าย</p>
            </div>
        </div>
    </div>

    <!-- Core astrologic scripts required for calculations -->
    <script src="thai-astrology-data.js"></script>
    <script src="horoscopeseven.js"></script>
    <!-- Assuming these calculate personal fortune -->
    <script src="adminVipReport.js"></script>
</body>
</html>
"""

with open('adminVipReport.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 3. Create adminVipReport.js from adminPdfGenerator.js structure
with open('adminPdfGenerator.js', 'r', encoding='utf-8') as f:
    pdf_gen_code = f.read()

# We need to extract the parts that build the HTML for the preview
# Basically, adminPdfGenerator.js has openVIPReportModal() and generateVIPReport() and executeVIPReportGeneration()
# We will just write a new script that replicates the logic cleanly.
js_content = """
const THAI_PROVINCES = [
    "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
    "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา",
    "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
    "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
    "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
    "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร",
    "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู",
    "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

document.addEventListener('DOMContentLoaded', () => {
    // Populate Provinces
    const provSelect = document.getElementById('vipProvince');
    provSelect.innerHTML = '<option value="">-- ไม่ระบุ --</option>';
    THAI_PROVINCES.forEach(p => {
        provSelect.innerHTML += `<option value="${p}">${p}</option>`;
    });

    // Populate Members
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    const memberSelect = document.getElementById('vipMemberSelect');
    memberSelect.innerHTML = '<option value="">-- เลือกจากฐานข้อมูลลูกค้า --</option>';
    allHistory.filter(m => m.name).forEach((m) => {
        let realIdx = allHistory.indexOf(m);
        memberSelect.innerHTML += `<option value="${realIdx}">${m.name} (${m.birthdate || 'ไม่ระบุวันเกิด'})</option>`;
    });
});

window.autoFillVipMember = function(idx) {
    if (idx === '') return;
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    let m = allHistory[idx];
    if (m) {
        document.getElementById('vipName').value = m.name || '';
        document.getElementById('vipIdCard').value = m.idCard || '';
        
        if (m.birthdate) {
            let parts = m.birthdate.split('/');
            if (parts.length === 3) {
                let y = parseInt(parts[2]);
                if (y > 2400) y -= 543;
                let dStr = `${y}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                document.getElementById('vipDobDate').value = dStr;
            }
        }
        
        if (m.birthtime) {
            document.getElementById('vipDobTime').value = m.birthtime;
        }
        
        if (m.province) {
            document.getElementById('vipProvince').value = m.province;
        }
    }
}
"""

# Append the actual generation logic from the original file. 
# We need to extract executeVIPReportGeneration and everything inside it.
import re
start_match = re.search(r'function generateVIPReport', pdf_gen_code)
if start_match:
    js_content += pdf_gen_code[start_match.start():]

# Now, we need to replace the preview screen logic. In the original, it appends a fixed screen to body.
# In our new standalone page, we want it to render inside `<div id="previewArea">`.
# Let's patch `previewScreen.style.cssText` and `document.body.appendChild(previewScreen)` in js_content.
js_content = js_content.replace(
    "previewScreen = document.createElement('div');",
    "previewScreen = document.getElementById('previewArea');\n    previewScreen.innerHTML = ''; // Clear old content"
)
js_content = js_content.replace(
    "previewScreen.id = 'vipPdfPreviewScreen';",
    ""
)
js_content = js_content.replace(
    "document.body.appendChild(previewScreen);",
    "/* Handled inline in previewArea */"
)
js_content = js_content.replace(
    "document.getElementById('vipReportModal').remove();",
    "/* No modal to remove anymore */"
)
js_content = js_content.replace(
    "previewScreen.style.cssText =",
    "// previewScreen.style.cssText ="
)

# Remove the 'close screen' button from navHTML since we are already in the report page
js_content = js_content.replace(
    """<button class="btn btn-outline-light" onclick="document.getElementById('vipPdfPreviewScreen').remove()" style="font-size: 16px;">
                    <i class="fas fa-times"></i> ปิดหน้าจอ
                </button>""",
    ""
)


with open('adminVipReport.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Created adminVipReport.html and adminVipReport.js successfully.")
