
window.generateVIPStylePDF = function() {
    Swal.fire({
        title: 'กำลังเตรียมเอกสาร PDF แบบ VIP...',
        text: 'กรุณารอสักครู่ ระบบกำลังจัดเตรียมหน้าพรีวิวให้คุณ',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        // Collect variables
        const bDate = document.getElementById('birthDateSatta').value;
        const bMonth = document.getElementById('birthMonth').options[document.getElementById('birthMonth').selectedIndex].text;
        const bYear = document.getElementById('birthYearSatta').value;
        const bTime = document.getElementById('birthTime') ? document.getElementById('birthTime').value : '-';
        
        const dobThStr = `${bDate} ${bMonth} พ.ศ. ${bYear}`;

        // Determine if it's horary mode
        const isHoraryMode = document.getElementById('reportArea').innerHTML.trim() === '' && document.getElementById('topReportArea').innerHTML.trim() !== '';

        let htmlContent = '';

        // Page 1: Cover
        htmlContent += `
            <div class="pdf-page cover-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background-image: url('assets/mystical_astrology_cover.png') !important; background-size: cover !important; background-position: center !important; text-align: center; display: block; position: relative; padding: 0; border: none; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
                
                <div style="position: absolute; top: 140px; left: 0; width: 100%; text-align: center; z-index: 10;">
                    <div style="color: #D4AF37 !important; font-size: 24px; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                        รายงานดวงชะตา Exclusive VIP
                    </div>
                    <div style="color: #FFDF73 !important; font-size: 45px; font-weight: bold; margin-top: 10px; text-shadow: 3px 3px 8px rgba(0,0,0,0.9);">
                        คัมภีร์มหาทักษาสัตตเลข
                    </div>
                </div>

                <div style="position: absolute; top: 450px; left: 50%; transform: translateX(-50%); width: 90%; z-index: 10; background: rgba(0, 0, 0, 0.6) !important; padding: 25px 0; border-radius: 20px; border-top: 2px solid rgba(212, 175, 55, 0.5) !important; border-bottom: 2px solid rgba(212, 175, 55, 0.5) !important; box-shadow: 0 5px 20px rgba(0,0,0,0.8);">
                    <div style="color: #FFDF73 !important; font-size: 60px; font-weight: bold; text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 3px 3px 10px rgba(0,0,0,0.9);">
                        ${isHoraryMode ? 'ดวงยามอัฏฐกาล' : 'คำทำนายพื้นดวง และดวงจร'}
                    </div>
                </div>

                <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 80%; background: rgba(20, 10, 40, 0.85) !important; border: 2px solid #D4AF37 !important; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); z-index: 10;">
                    <div style="font-size: 24px; color: #FFF !important; line-height: 1.8;">
                        <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เกิดวันที่:</strong> ${dobThStr}</p>
                        <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เวลาตกฟาก:</strong> ${bTime} น.</p>
                    </div>
                </div>
            </div>
        `;

        // Page 2: Table Area (21 Houses Chart)
        const tableAreaHTML = document.getElementById('tableArea') ? document.getElementById('tableArea').innerHTML : '';
        if (tableAreaHTML) {
            htmlContent += `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
                    <h2 style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; width: 100%;">ผังดวง 21 ภูมิ</h2>
                    <div style="transform: scale(0.9); transform-origin: top center; width: 100%; display: flex; justify-content: center;">
                        ${tableAreaHTML.replace(/style="/g, 'style="color: inherit !important; ')}
                    </div>
                </div>
            `;
        }

        // Page 3: Summary / Horary Report (Top Report Area)
        const topReportAreaHTML = document.getElementById('topReportArea') ? document.getElementById('topReportArea').innerHTML : '';
        if (topReportAreaHTML) {
            htmlContent += `
                <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                    <h2 style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">${isHoraryMode ? 'คำทำนายยามอัฏฐกาล' : 'คำทำนายสรุป'}</h2>
                    <div style="font-size: 22px; line-height: 1.6; text-align: left; overflow-y: hidden;">
                        ${topReportAreaHTML.replace(/color:\s*var\(--gold\)/g, 'color: #B8860B !important').replace(/class="card"/g, 'style="border: 1px solid #D4AF37; border-radius: 10px; padding: 15px; margin-bottom: 15px; background: rgba(255, 249, 230, 0.5);"')}
                    </div>
                </div>
            `;
        }

        // Page 4+: Detailed Report Area
        if (!isHoraryMode) {
            const reportArea = document.getElementById('reportArea');
            if (reportArea) {
                // Split children into chunks to fit on A4 pages (approx 4 cards per page)
                const cards = Array.from(reportArea.children);
                let currentChunk = [];
                let chunks = [];
                
                for(let i = 0; i < cards.length; i++) {
                    currentChunk.push(cards[i].outerHTML);
                    if (currentChunk.length === 3 || i === cards.length - 1) {
                        chunks.push(currentChunk.join(''));
                        currentChunk = [];
                    }
                }

                chunks.forEach((chunkHTML, index) => {
                    htmlContent += `
                        <div class="pdf-page" style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 40px; box-sizing: border-box; background: #FFF9E6; color: #4a235a; page-break-after: always; border: 15px solid #D4AF37; display: flex; flex-direction: column;">
                            <h2 style="color: #B8860B; font-size: 32px; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">คำทำนายวิถีชีวิต (หน้า ${index + 1}/${chunks.length})</h2>
                            <div style="font-size: 20px; line-height: 1.5; text-align: left; display: flex; flex-direction: column; gap: 15px;">
                                ${chunkHTML.replace(/color:\s*var\(--gold\)/g, 'color: #B8860B !important').replace(/class="card"/g, 'style="border: 1px solid #D4AF37; border-radius: 10px; padding: 15px; margin-bottom: 10px; background: rgba(255, 249, 230, 0.5);"').replace(/class="grid-report"/g, '')}
                            </div>
                        </div>
                    `;
                });
            }
        }

        // Preview Screen Logic
        let previewScreen = document.getElementById('vipPdfPreviewScreen');
        if (previewScreen) previewScreen.remove();

        previewScreen = document.createElement('div');
        previewScreen.id = 'vipPdfPreviewScreen';
        previewScreen.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #E0E0E0; z-index: 100000; overflow-y: auto; font-family: "Sarabun", sans-serif;';

        const navHTML = `
            <div id="vipPdfPreviewNav" style="position: sticky; top: 0; background: #F8F9FA; padding: 15px; border-bottom: 2px solid #D4AF37; display: flex; justify-content: space-between; align-items: center; z-index: 100001; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                <div style="color: #D4AF37; font-size: 20px; font-weight: bold;">
                    📄 พรีวิวรายงาน (VIP) ทักษาสัตตเลข
                </div>
                <div>
                    <button class="btn btn-warning mr-2" onclick="window.print()" style="font-size: 16px; font-weight: bold; background: #D4AF37; border: none; padding: 8px 16px; border-radius: 8px; color: black; cursor: pointer;">
                        <i class="fas fa-print"></i> พิมพ์ / บันทึกเป็น PDF
                    </button>
                    <button class="btn btn-outline-light" onclick="document.getElementById('vipPdfPreviewScreen').remove()" style="font-size: 16px; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: black; border: 1px solid #ccc;">
                        <i class="fas fa-times"></i> ปิดหน้าจอ
                    </button>
                </div>
            </div>
        `;

        const pagesHTML = `
            <div id="vipPdfPreviewContent" style="display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 20px;">
                ${htmlContent}
            </div>
        `;

        const forceStyle = `
            <style>
                @media print {
                    #vipPdfPreviewContent * {
                        color: inherit !important;
                        text-shadow: inherit !important;
                        box-shadow: inherit !important;
                    }
                    body * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body > *:not(#vipPdfPreviewScreen) {
                        display: none !important;
                    }
                    #vipPdfPreviewScreen {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                        background: none !important;
                    }
                    #vipPdfPreviewNav {
                        display: none !important;
                    }
                    #vipPdfPreviewContent {
                        padding: 0 !important;
                        gap: 0 !important;
                    }
                    .pdf-page {
                        page-break-after: always !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            </style>
        `;

        previewScreen.innerHTML = forceStyle + navHTML + pagesHTML;
        document.body.appendChild(previewScreen);
        
        Swal.close();
    }, 500);
};
