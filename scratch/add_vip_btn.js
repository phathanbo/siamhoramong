const fs = require('fs');
const filepath = 'd:\\\\สยามโหรามงคล\\\\taksasattalek.html';

let content = fs.readFileSync(filepath, 'utf8');

const startStr = '        <!-- Premium Export Button -->';
const endStr = '        </div>';

const idx1 = content.indexOf(startStr);
if (idx1 !== -1) {
    const idx2 = content.indexOf(endStr, idx1);
    if (idx2 !== -1) {
        const oldPart = content.substring(idx1, idx2 + endStr.length);
        const newPart = `        <!-- Premium Export Button -->
        <div style="text-align: center; margin: 25px 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
            <button id="btnExport" class="btn-export" onclick="promptExportOptions()">
                <i class="fa-solid fa-download"></i> บันทึกภาพผังดวงและคำทำนาย (PNG)
            </button>
            <button id="btnExportVIP" class="btn-export" style="background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); color: #000; font-weight: bold; box-shadow: 0 4px 15px rgba(212,175,55,0.4);" onclick="generateVIPStylePDF()">
                <i class="fa-solid fa-file-pdf"></i> สร้างรายงาน (PDF แบบ VIP)
            </button>
        </div>`;
        content = content.replace(oldPart, newPart);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Success!');
    } else {
        console.log('End string not found');
    }
} else {
    console.log('Start string not found');
}
