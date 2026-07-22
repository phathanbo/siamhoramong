import os

filepath = r'd:\สยามโหรามงคล\taksasattalek.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate exactly
start_str = '        <!-- Premium Export Button -->'
end_str = '        </div>'
idx1 = content.find(start_str)
if idx1 != -1:
    idx2 = content.find(end_str, idx1)
    if idx2 != -1:
        old_part = content[idx1:idx2 + len(end_str)]
        new_part = '''        <!-- Premium Export Button -->
        <div style="text-align: center; margin: 25px 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
            <button id="btnExport" class="btn-export" onclick="promptExportOptions()">
                <i class="fa-solid fa-download"></i> บันทึกภาพผังดวงและคำทำนาย (PNG)
            </button>
            <button id="btnExportVIP" class="btn-export" style="background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); color: #000; font-weight: bold; box-shadow: 0 4px 15px rgba(212,175,55,0.4);" onclick="generateVIPStylePDF()">
                <i class="fa-solid fa-file-pdf"></i> สร้างรายงาน (PDF แบบ VIP)
            </button>
        </div>'''
        content = content.replace(old_part, new_part)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Success!')
    else:
        print('End string not found')
else:
    print('Start string not found')
