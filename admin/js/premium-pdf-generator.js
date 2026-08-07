window.generateUltimatePremiumPDF = async function() {
    Swal.fire({
        title: 'กำลังประมวลผลข้อมูลวิเคราะห์...',
        html: 'โปรดรอสักครู่ ระบบกำลังจัดเตรียมหน้าตัวอย่าง 30 หน้า',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const getSelectText = (id) => {
            const el = document.getElementById(id);
            return el && el.options.length > 0 ? el.options[el.selectedIndex].text : '';
        };

        let dayStr = getSelectText('birthDay');
        let dateNum = document.getElementById('birthDateSatta')?.value || '1';
        let monthStr = getSelectText('birthMonth');
        let yearStr = getSelectText('birthYear');
        let age = document.getElementById('currentAge')?.value || '1';
        
        const memberSelect = document.getElementById('sattalekMemberSelect');
        const memberName = memberSelect && memberSelect.selectedIndex > 0 ? (memberSelect.options[memberSelect.selectedIndex]?.text.split(' — ')[0] || 'คุณลูกค้า') : 'คุณลูกค้า';
        
        let matrixTableHtml = document.getElementById('tableArea') ? document.getElementById('tableArea').innerHTML : '<p style="text-align:center;">ไม่มีข้อมูลผังดวง กรุณากดคำนวณก่อน</p>';
        
        let html = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <title>Premium Report - ${memberName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background: #555;
                    margin: 0;
                    padding: 40px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: 'Sarabun', 'Prompt', sans-serif;
                }
                .pdf-page {
                    width: 210mm;
                    height: 297mm;
                    background: linear-gradient(135deg, #fefdfb 0%, #f7f3e8 100%);
                    margin-bottom: 20px;
                    position: relative;
                    box-sizing: border-box;
                    overflow: hidden;
                    padding: 15mm 15mm 25mm 15mm; /* increased bottom padding */
                    box-shadow: 0 8px 25px rgba(0,0,0,0.25);
                    page-break-after: always;
                    color: #333;
                }
                .pdf-page:last-child {
                    page-break-after: auto;
                    margin-bottom: 0;
                }
                
                /* Dual-layer elegant borders */
                .pdf-page::after {
                    content: '';
                    position: absolute;
                    top: 4mm; left: 4mm; right: 4mm; bottom: 4mm;
                    border: 1px solid #D4AF37;
                    border-radius: 8px;
                    pointer-events: none;
                    box-sizing: border-box;
                }
                .pdf-page::before {
                    content: '';
                    position: absolute;
                    top: 6mm; left: 6mm; right: 6mm; bottom: 6mm;
                    border: 2px solid rgba(42, 11, 76, 0.12);
                    border-radius: 6px;
                    pointer-events: none;
                    box-sizing: border-box;
                }
                .pdf-cover {
                    background: url('thai_astrology_pdf_cover_bg.jpg') no-repeat center center;
                    background-size: cover;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .pdf-cover::before, .pdf-cover::after {
                    content: none !important;
                }
                .pdf-header {
                    text-align: center;
                    color: #D4AF37;
                    background: linear-gradient(135deg, #1A0B2E 0%, #2A0B4C 100%);
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    margin-bottom: 25px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    border-left: 5px solid #D4AF37;
                    border-right: 5px solid #D4AF37;
                    box-shadow: 0 4px 12px rgba(42, 11, 76, 0.15);
                    font-family: 'Prompt', sans-serif;
                }
                .pdf-footer {
                    position: absolute;
                    bottom: 10mm;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 13px;
                    color: #8a7a5f;
                    z-index: 10;
                    background: transparent;
                    padding: 2px 0;
                    font-family: 'Prompt', sans-serif;
                    font-weight: 500;
                }
                
                /* Make the table card itself occupy full height to fill the A4 page layout */
                .pdf-page:has(table) .card {
                    height: calc(100% - 90px) !important;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    margin-bottom: 0 !important;
                }
                .pdf-page:has(table) table {
                    flex: 1;
                    height: 100%;
                    margin-bottom: 0 !important;
                }
                
                /* Override Page 3 matrix table page to not stretch full page */
                .pdf-page:has(.premium-matrix-container) .card {
                    height: auto !important;
                    display: block !important;
                }
                .pdf-page:has(.premium-matrix-container) table {
                    flex: none !important;
                    height: auto !important;
                }
                
                /* Generic table styling for reportArea */
                .pdf-page table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                    margin-bottom: 15px;
                    background-color: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .pdf-page table th, 
                .pdf-page table td {
                    border: 1px solid rgba(212, 175, 55, 0.25);
                    padding: 8px 12px;
                    line-height: 1.5;
                    text-align: left;
                    vertical-align: middle;
                }
                .pdf-page table th {
                    background-color: #2A0B4C;
                    color: #D4AF37;
                    font-weight: 500;
                    font-family: 'Prompt', sans-serif;
                }
                
                /* Override inline dark backgrounds in cards for PDF */
                .pdf-page .card > div[style*="background"] {
                    background-color: #faf8f5 !important;
                    border: 1px solid #e0c879 !important;
                    color: #333333 !important;
                }
                .pdf-page .card > div[style*="background"] * {
                    color: #333333 !important;
                }
                .content-box {
                    background: #ffffff;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 15px rgba(42, 11, 76, 0.05);
                }
                .content-title {
                    color: #2A0B4C;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    font-family: 'Prompt', sans-serif;
                }
                .highlight-gold {
                    color: #D4AF37;
                    font-weight: 600;
                }
                
                 .premium-matrix-container table {
                    width: 100% !important;
                    border-collapse: separate !important;
                    border-spacing: 5px !important;
                    margin: 30px 0 !important;
                    box-shadow: none !important;
                    background-color: transparent !important;
                }
                .premium-matrix-container th, .premium-matrix-container td {
                    border: 1px solid #D4AF37 !important;
                    padding: 10px !important;
                    text-align: center !important;
                    border-radius: 8px !important;
                    background: rgba(255,255,255,0.9) !important;
                    line-height: 1.2 !important; /* reset line-height for matrix cells */
                }
                .premium-matrix-container th {
                    background: #2A0B4C !important;
                    color: #D4AF37 !important;
                    font-family: 'Prompt', sans-serif;
                    font-size: 18px !important;
                }
                .premium-matrix-container tr:nth-child(5) td {
                    background: rgba(212, 175, 55, 0.15) !important;
                }
                .premium-matrix-container .big {
                    font-size: 26px;
                    color: #2A0B4C;
                    font-weight: bold;
                }
                .premium-matrix-container .house {
                    font-size: 13px;
                    color: #666;
                    margin-top: 5px;
                }
                .premium-matrix-container .highlight {
                    border: 2px solid #e74c3c !important;
                    background-color: #fdebd0 !important;
                }
                .premium-matrix-container .good {
                    color: #27ae60;
                    font-weight: bold;
                }
                .premium-matrix-container .bad {
                    color: #c0392b;
                    font-weight: bold;
                }

                .floating-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #D4AF37;
                    color: #1A0B2E;
                    padding: 15px 25px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    border: none;
                    font-family: 'Prompt', sans-serif;
                    z-index: 9999;
                    transition: transform 0.2s;
                }
                .floating-btn:hover {
                    transform: scale(1.05);
                }
                
                /* Override card styles from original HTML for PDF layout */
                .pdf-page .card {
                    background: #ffffff !important;
                    color: #333 !important;
                    border: 1px solid rgba(212, 175, 55, 0.35) !important;
                    border-left: 4px solid #2A0B4C !important;
                    box-shadow: 0 4px 15px rgba(42, 11, 76, 0.04) !important;
                    margin-bottom: 20px !important; /* Reduced margin */
                    padding: 18px !important; /* Reduced padding */
                    border-radius: 12px !important;
                }
                .pdf-page h3 {
                    color: #2A0B4C !important;
                    border-bottom: 2px solid rgba(212, 175, 55, 0.25) !important;
                    padding-bottom: 8px !important;
                    margin-top: 0 !important;
                    margin-bottom: 12px !important;
                    font-size: 17px !important;
                    font-family: 'Prompt', sans-serif;
                }
                .pdf-page p {
                    color: #444 !important;
                    margin-bottom: 10px !important;
                    line-height: 1.6;
                }
                
                /* Compact 12 houses grid to prevent overflow */
                .pdf-page div[style*="repeat(auto-fit, minmax(240px, 1fr))"] {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                }
                .pdf-page div[style*="repeat(auto-fit, minmax(240px, 1fr))"] > div {
                    padding: 10px !important;
                }

                @media print {
                    body {
                        background: none;
                        padding: 0;
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .pdf-page {
                        margin: 0;
                        box-shadow: none;
                        page-break-after: always;
                    }
                    .floating-btn {
                        display: none;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                }
            </style>
        </head>
        <body>
            <button class="floating-btn" onclick="window.print()">🖨️ บันทึกเป็น PDF</button>
        `;

        // === PAGE 1: Cover ===
        html += `
        <div class="pdf-page pdf-cover">
            <div style="border: 4px solid #D4AF37; padding: 40px; border-radius: 20px; width: 90%; height: 90%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: rgba(26, 11, 46, 0.8); backdrop-filter: blur(8px); box-sizing: border-box;">
                <div style="position: absolute; top: 10%; right: 10%; width: 50px; height: 50px; border: 2px solid #D4AF37; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 10%; left: 10%; width: 30px; height: 30px; border: 2px solid #D4AF37; border-radius: 50%;"></div>
                
                <h1 style="color: #D4AF37; font-size: 42px; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap; font-family: 'Prompt', sans-serif;">คัมภีร์มหาทักษาสัตตเลข</h1>
                <h2 style="color: #f0f0f0; font-size: 20px; font-weight: normal; letter-spacing: 2px; white-space: nowrap; font-family: 'Prompt', sans-serif;">รายงานคำทำนายส่วนบุคคล (Exclusive)</h2>
                
                <div style="margin: 60px 0; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 50%; border: 1px solid rgba(212,175,55,0.3);">
                    <div style="width: 250px; height: 250px; border-radius: 50%; background: #2A0B4C; border: 4px solid #D4AF37; display: flex; align-items: center; justify-content: center; color: #D4AF37; overflow: hidden; box-shadow: 0 0 30px rgba(212,175,55,0.4);">
                        <div style="font-size: 100px;">⚛️</div>
                    </div>
                </div>
                
                <h3 style="color: #D4AF37; font-size: 22px; font-weight: 300;">วิเคราะห์เจาะลึก 30 หน้าเต็ม</h3>
                <div style="margin-top: 40px; font-size: 22px; padding: 15px 40px; border-top: 1px solid #D4AF37; border-bottom: 1px solid #D4AF37;">จัดทำสำหรับ: <b style="color:#D4AF37;">${memberName}</b></div>
            </div>
        </div>
        `;

        // === PAGE 2: Profile & Basic Info ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">ข้อมูลดวงชะตาส่วนบุคคล</div>
            
            <div class="content-box" style="text-align: center; padding: 40px;">
                <div style="font-size: 80px; margin-bottom: 20px;">👤</div>
                <h2 style="font-size: 32px; color: #2A0B4C; margin-bottom: 10px;">${memberName}</h2>
                <p style="font-size: 20px; color: #666;">อายุย่าง: <b class="highlight-gold">${age}</b> ปี</p>
            </div>
            
            <div class="content-box">
                <div class="content-title">รายละเอียดการเกิด</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 18px;">
                    <div><b>วันเกิด:</b> ${dayStr}</div>
                    <div><b>วันที่:</b> ${dateNum}</div>
                    <div><b>เดือนเกิด:</b> ${monthStr}</div>
                    <div><b>ปีเกิด:</b> ${yearStr}</div>
                </div>
            </div>
            
            <div class="pdf-footer">หน้า 2 - ข้อมูลส่วนบุคคล</div>
        </div>
        `;

        // === PAGE 3: 21 Phum Matrix ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">ผังดวง 21 ภูมิ (สัตตเลข)</div>
            
            <div style="text-align:center; margin-bottom: 10px;">
                <p style="font-size: 18px;">ตารางวิเคราะห์ดวงชะตาจากฐานวัน เดือน ปีเกิด</p>
            </div>
            
            <div class="premium-matrix-container">
                ${matrixTableHtml}
            </div>
            
            <div class="content-box">
                <div class="content-title">การตีความ 4 ฐาน</div>
                <ul style="font-size: 16px; line-height: 1.8;">
                    <li><b>ฐาน 1 (แถวบนสุด):</b> ฐานวันเกิด แสดงถึงตัวตน นิสัยใจคอ</li>
                    <li><b>ฐาน 2 (แถวกลาง 1):</b> ฐานเดือนเกิด แสดงถึงสภาพแวดล้อม พ่อแม่</li>
                    <li><b>ฐาน 3 (แถวกลาง 2):</b> ฐานปีเกิด แสดงถึงกรรมเก่า สิ่งที่ติดตัวมา</li>
                    <li><b>ฐาน 4 (แถวล่างสุด):</b> กำลังพระเคราะห์ แสดงถึงบทสรุปและพลังขับเคลื่อน</li>
                </ul>
            </div>
            
            <div class="pdf-footer">หน้า 3 - ผังดวง 21 ภูมิ</div>
        </div>
        `;

        // Function to extract sections from DOM safely by title
        const extractDOMSectionByTitle = (containerId, titleSubstring) => {
            let container = document.getElementById(containerId);
            if (!container) return '';
            let children = Array.from(container.children);
            let matched = children.find(c => c.innerHTML.includes(titleSubstring));
            return matched ? matched.outerHTML : '';
        };

        // Extracting elements manually by checking their HTML content to avoid index-shifting bugs
        let attaLagnaCard = extractDOMSectionByTitle('topReportArea', 'ดาวประจำตัว (อัตตะ)');
        let houses12Card = extractDOMSectionByTitle('topReportArea', 'พื้นดวงชะตา 12 ภพเรือน');
        let mahataksaCard = extractDOMSectionByTitle('topReportArea', 'มหาทักษาประจำตัว');
        let loveCard = extractDOMSectionByTitle('topReportArea', 'วิเคราะห์ความรัก');
        let childCard = extractDOMSectionByTitle('topReportArea', 'วิเคราะห์บุตร');
        let wealthCard = extractDOMSectionByTitle('topReportArea', 'วิเคราะห์ทรัพย์สิน');
        let healthCard = extractDOMSectionByTitle('topReportArea', 'แจ้งเตือนสุขภาพและจุดอ่อนร่างกาย');
        let careerCard = extractDOMSectionByTitle('topReportArea', 'เจาะลึกอาชีพที่ใช่');
        let ageTransitCard = extractDOMSectionByTitle('topReportArea', 'ดวงชะตาปีนี้');

        // === PAGE 4: ดาวประจำตัว & มหาทักษา ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">ดาวประจำตัว & มหาทักษา</div>
            <div style="padding: 10px;">
                ${attaLagnaCard}
                ${mahataksaCard}
            </div>
            <div class="pdf-footer">หน้า 4</div>
        </div>
        `;

        // === PAGE 5: พื้นดวงชะตา 12 ภพเรือน ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">พื้นดวงชะตา 12 ภพเรือน</div>
            <div style="padding: 10px;">
                ${houses12Card}
            </div>
            <div class="pdf-footer">หน้า 5</div>
        </div>
        `;

        // === PAGE 6: ความรัก บุตร และ ทรัพย์สิน ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">ความรัก บุตร และ ทรัพย์สิน</div>
            <div style="padding: 10px;">
                ${loveCard}
                ${childCard}
                ${wealthCard}
            </div>
            <div class="pdf-footer">หน้า 6</div>
        </div>
        `;

        // === PAGE 7: อาชีพ และ ปีจร ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">อาชีพ และ ดวงชะตาปีจร</div>
            <div style="padding: 10px;">
                ${careerCard}
                ${ageTransitCard}
            </div>
            <div class="pdf-footer">หน้า 7</div>
        </div>
        `;

        // === PAGE 8: สุขภาพและจุดอ่อนร่างกาย ===
        html += `
        <div class="pdf-page">
            <div class="pdf-header">สุขภาพและจุดอ่อนร่างกาย</div>
            <div style="padding: 10px;">
                ${healthCard}
            </div>
            <div class="pdf-footer">หน้า 8</div>
        </div>
        `;

        // === PAGE 9+: reportArea Details (เลขโยค, เลขแตก, etc.) ===
        let mainReportContainer = document.getElementById('reportArea');
        let pageNum = 9;
        
        if (mainReportContainer) {
            let reportChildren = Array.from(mainReportContainer.children);
            let currentWeight = 0;
            let currentPageHTML = `
            <div class="pdf-page">
                <div class="pdf-header">เจาะลึกเลขศาสตร์ ฐาน 4 (หน้า ${pageNum})</div>
                <div style="padding: 10px;">
            `;

            reportChildren.forEach((child, index) => {
                // Add matrix-table class to matrix table so it doesn't get standard styling overridden
                let childHTML = child.outerHTML.replace('<table', '<table class="matrix-table"');
                
                // Determine weight: If card has a table, it takes a full page (weight 4), else short text (weight 1)
                let isTableCard = childHTML.includes('<table');
                let cardWeight = isTableCard ? 4 : 1;
                if (childHTML.includes('data-pdf-weight="4"')) cardWeight = 4;
                
                let forceNewPage = childHTML.includes('data-pdf-new-page="true"');
                
                // If adding this card exceeds the max weight of 4, OR if forceNewPage is true (and we already have cards on this page), push to next page
                if (currentWeight > 0 && ((currentWeight + cardWeight > 4) || forceNewPage)) {
                    currentPageHTML += `
                        </div>
                        <div class="pdf-footer">หน้า ${pageNum}</div>
                    </div>
                    `;
                    html += currentPageHTML;
                    pageNum++;
                    currentWeight = 0;
                    currentPageHTML = `
                    <div class="pdf-page">
                        <div class="pdf-header">เจาะลึกเลขศาสตร์ ฐาน 4 (หน้า ${pageNum})</div>
                        <div style="padding: 10px;">
                    `;
                }

                currentPageHTML += childHTML;
                currentWeight += cardWeight;
                
                if (index === reportChildren.length - 1) {
                    currentPageHTML += `
                        </div>
                        <div class="pdf-footer">หน้า ${pageNum}</div>
                    </div>
                    `;
                    html += currentPageHTML;
                    pageNum++;
                }
            });
        }

        // === PAGE X+: 12 Month Forecasts ===
        if (window.vip12MonthForecasts && window.vip12MonthForecasts.length > 0) {
            let monthCount = 0;
            let currentMonthPageHTML = `
            <div class="pdf-page">
                <div class="pdf-header">ทำนายดวงจรรายเดือน 12 เดือน (หน้า ${pageNum})</div>
                <div style="padding: 10px;">
            `;

            window.vip12MonthForecasts.forEach((forecastHTML, index) => {
                currentMonthPageHTML += forecastHTML;
                monthCount++;
                
                if (monthCount >= 3 || index === window.vip12MonthForecasts.length - 1) {
                    currentMonthPageHTML += `
                        </div>
                        <div class="pdf-footer">หน้า ${pageNum}</div>
                    </div>
                    `;
                    html += currentMonthPageHTML;
                    pageNum++;
                    
                    if (index < window.vip12MonthForecasts.length - 1) {
                        monthCount = 0;
                        currentMonthPageHTML = `
                        <div class="pdf-page">
                            <div class="pdf-header">ทำนายดวงจรรายเดือน 12 เดือน (หน้า ${pageNum})</div>
                            <div style="padding: 10px;">
                        `;
                    }
                }
            });
        }

        html += `
        <script>
            // Programmatically style cells and add visual dividers between different number groups
            document.querySelectorAll('table').forEach(table => {
                if (table.closest('.premium-matrix-container')) return;

                // Adjust spacing based on row count to prevent layout overflow in A4
                const rowCount = table.querySelectorAll('tbody tr').length;
                const isLargeTable = rowCount > 10;
                const paddingVal = isLargeTable ? '6px 10px' : '10px 12px';
                const lineHeightVal = isLargeTable ? '1.4' : '1.6';
                const fontSizeVal = isLargeTable ? '12px' : '13px';

                // Apply padding and line-height, overriding any inline styles
                table.querySelectorAll('td').forEach(td => {
                    td.style.setProperty('padding', paddingVal, 'important');
                    td.style.setProperty('line-height', lineHeightVal, 'important');
                    td.style.setProperty('font-size', fontSizeVal, 'important');
                    td.style.setProperty('border-color', 'rgba(212, 175, 55, 0.25)', 'important');
                });
                table.querySelectorAll('th').forEach(th => {
                    th.style.setProperty('padding', paddingVal, 'important');
                    th.style.setProperty('font-size', isLargeTable ? '13px' : '14px', 'important');
                });

                let lastGroup = null;
                table.querySelectorAll('tr.relation-row').forEach(row => {
                    const groupClass = Array.from(row.classList).find(c => c.startsWith('relation-num-'));
                    if (groupClass) {
                        const group = groupClass.replace('relation-num-', '');
                        if (lastGroup !== null && lastGroup !== group) {
                            // Add a distinct divider line between different number groups
                            Array.from(row.cells).forEach(cell => {
                                cell.style.setProperty('border-top', '3px double #2A0B4C', 'important');
                                cell.style.setProperty('padding-top', '18px', 'important');
                            });
                            // Light background highlight for the first row of a new group
                            row.style.backgroundColor = 'rgba(212, 175, 55, 0.04)';
                        }
                        lastGroup = group;
                    }
                });
            });
        </script>
        </body>
        </html>
        `;

        // Open preview in new tab
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
            previewWindow.document.write(html);
            previewWindow.document.close();
            Swal.close();
        } else {
            Swal.fire('Error', 'ไม่สามารถเปิดหน้าตัวอย่างได้ กรุณาอนุญาต Pop-ups ในบราวเซอร์ของคุณ', 'error');
        }

    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการรวบรวมข้อมูล: ' + e.message, 'error');
    }
};
