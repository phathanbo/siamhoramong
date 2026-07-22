import os

def build_js():
    js_content = \"\"\"
window.generateUltimatePremiumPDF = async function() {
    Swal.fire({
        title: 'กำลังสร้างรายงาน Premium 30 หน้า...',
        html: 'โปรดรอสักครู่ ระบบกำลังประมวลผลกราฟิกขั้นสูง<br><br><div class=\"progress\" style=\"height: 20px;\"><div id=\"pdfProgressBar\" class=\"progress-bar progress-bar-striped progress-bar-animated bg-warning\" role=\"progressbar\" style=\"width: 0%;\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\">0%</div></div>',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        let d = parseInt(document.getElementById('birthDay').value) || 1;
        let m = parseInt(document.getElementById('birthMonth').value) || 1;
        let y = parseInt(document.getElementById('birthYear').value) || 1;
        let age = parseInt(document.getElementById('currentAge').value) || 1;
        
        const matrix = window.globalRows || [[],[],[],[]];
        const memberSelect = document.getElementById('sattalekMemberSelect');
        const memberName = memberSelect ? (memberSelect.options[memberSelect.selectedIndex]?.text.split(' — ')[0] || 'คุณลูกค้า') : 'คุณลูกค้า';
        
        let html = \
        <div id=\"premium-pdf-container\" style=\"width: 794px; background: #fff; font-family: 'Sarabun', 'Prompt', sans-serif; color: #333;\">
            <style>
                .pdf-page {
                    width: 794px;
                    height: 1122px;
                    position: relative;
                    page-break-after: always;
                    box-sizing: border-box;
                    background-color: #fff;
                    overflow: hidden;
                    padding: 40px;
                }
                .pdf-cover {
                    background: linear-gradient(135deg, #1A0B2E 0%, #2A0B4C 100%);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .pdf-header {
                    text-align: center;
                    color: #D4AF37;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #D4AF37;
                    padding-bottom: 10px;
                }
                .pdf-footer {
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    color: #888;
                }
                .card-premium {
                    border: 2px solid #D4AF37;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    background: #fdfbf7;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
            </style>
        \;

        // PAGE 1: Cover
        html += \
        <div class=\"pdf-page pdf-cover\">
            <div style=\"border: 4px solid #D4AF37; padding: 40px; border-radius: 20px; width: 90%; height: 90%; display: flex; flex-direction: column; align-items: center; justify-content: center;\">
                <h1 style=\"color: #D4AF37; font-size: 48px; margin-bottom: 20px;\">คัมภีร์มหาทักษาสัตตเลข</h1>
                <h2 style=\"color: #fff; font-size: 24px; font-weight: normal;\">รายงานคำทำนายส่วนบุคคล</h2>
                <div style=\"margin: 40px 0;\">
                    <!-- Placeholder for the wheel image -->
                    <div style=\"width: 200px; height: 200px; border-radius: 50%; border: 2px dashed #D4AF37; display: flex; align-items: center; justify-content: center; color: #D4AF37;\">รูปวงล้อสัตตเลข</div>
                </div>
                <h3 style=\"color: #D4AF37; font-size: 20px;\">ศาสตร์แห่งดวงชะตา เพื่อชีวิตที่ดีขึ้น</h3>
                <p style=\"margin-top: 40px; font-size: 18px;\">โดย <b>\</b></p>
            </div>
        </div>
        \;

        // MORE PAGES TO BE ADDED HERE LATER...

        html += \</div>\;

        let container = document.getElementById('temp-pdf-render');
        if (!container) {
            container = document.createElement('div');
            container.id = 'temp-pdf-render';
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            document.body.appendChild(container);
        }
        container.innerHTML = html;

        const element = document.getElementById('premium-pdf-container');
        const opt = {
            margin:       0,
            filename:     'Premium_Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'px', format: [794, 1122], orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            Swal.close();
        }).catch(err => {
            console.error(err);
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการสร้าง PDF', 'error');
        });

    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการรวบรวมข้อมูล: ' + e.message, 'error');
    }
};
\"\"\"
    with open('../../premium_pdf_generator.js', 'w', encoding='utf8') as f:
        f.write(js_content)

if __name__ == '__main__':
    build_js()
