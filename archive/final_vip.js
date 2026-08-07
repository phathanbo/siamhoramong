
window.generateVIPStylePDF = function() {
    Swal.fire({
        title: 'กำลังเตรียมเอกสาร PDF แบบ VIP...',
        text: 'กรุณารอสักครู่ ระบบกำลังจัดเตรียมหน้าพรีวิวให้คุณ',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(async () => {
        // Collect variables
        const bDate = document.getElementById('birthDateSatta').value;
        const bMonthSelect = document.getElementById('birthMonth');
        const bMonth = bMonthSelect.options[bMonthSelect.selectedIndex].text;
        
        const bYearSelect = document.getElementById('birthYear');
        const bYearText = bYearSelect.options[bYearSelect.selectedIndex].text;
        
        const bTime = document.getElementById('birthTime') ? document.getElementById('birthTime').value : '-';
        
        const dobThStr = `${bDate} ${bMonth} ปี${bYearText}`;

        // Determine if it's horary mode
        const isHoraryMode = document.getElementById('reportArea').innerHTML.trim() === '' && document.getElementById('topReportArea').innerHTML.trim() !== '';

        // Prepare Preview Screen
        let previewScreen = document.getElementById('vipPdfPreviewScreen');
        if (previewScreen) previewScreen.remove();

        previewScreen = document.createElement('div');
        previewScreen.id = 'vipPdfPreviewScreen';
        previewScreen.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #525659; z-index: 100000; overflow-y: auto; font-family: "Sarabun", sans-serif; padding-bottom: 50px;';

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
        previewScreen.innerHTML = navHTML;

        // Print Styles
        const printStyles = document.createElement('style');
        printStyles.innerHTML = `
            @page { size: A4 portrait; margin: 0; }
            .chart-container-rotated table { width: 100% !important; height: 100% !important; table-layout: fixed !important; }
            .chart-container-rotated th, .chart-container-rotated td { font-size: 1.4em !important; padding: 8px !important; }
            
            /* Force Light Theme for Print */
            .a4-physical-page:not(.cover-page) { background: #FFFFFF !important; }
            .a4-physical-page:not(.cover-page) .card { background: #FCF9F2 !important; border: 2px solid #D4AF37 !important; }
            .a4-physical-page:not(.cover-page) * { color: #333333 !important; text-shadow: none !important; box-shadow: none !important; }
            .a4-physical-page:not(.cover-page) h2, .a4-physical-page:not(.cover-page) h3, .a4-physical-page:not(.cover-page) h4, .a4-physical-page:not(.cover-page) strong { color: #9A7B4F !important; }
            
            @media print {
                html, body { margin: 0 !important; padding: 0 !important; background: #FFF !important; }
                #vipPdfPreviewScreen { position: relative !important; overflow: visible !important; background: none !important; padding: 0 !important; }
                #vipPdfPreviewNav { display: none !important; }
                #vipPdfPrintArea { padding: 0 !important; margin: 0 !important; }
                body > *:not(#vipPdfPreviewScreen) { display: none !important; }
                .a4-physical-page { margin: 0 !important; box-shadow: none !important; page-break-after: always !important; break-after: page !important; }
                .a4-physical-page.cover-page { border: none !important; }
                body * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
        `;
        previewScreen.appendChild(printStyles);

        const printArea = document.createElement('div');
        printArea.id = 'vipPdfPrintArea';
        printArea.style.cssText = 'padding-top: 30px; display: flex; flex-direction: column; align-items: center;';
        previewScreen.appendChild(printArea);

        // --- Pagination Logic ---
        function createA4Page(title) {
            const page = document.createElement('div');
            page.className = 'a4-physical-page';
            // Explicitly sizing as A4. Padding 20mm to stay inside borders.
            page.style.cssText = 'width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background: #FFFFFF; position: relative; margin: 0 auto 30px auto; box-shadow: 0 5px 20px rgba(0,0,0,0.5); border: 15px solid #D4AF37; padding: 20mm 15mm; page-break-after: always; display: flex; flex-direction: column;';
            
            if (title) {
                const header = document.createElement('h2');
                header.style.cssText = 'color: #D4AF37; font-size: 32px; text-align: center; margin: 0 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; flex-shrink: 0; line-height: 1.2;';
                header.innerHTML = title;
                page.appendChild(header);
            }
            
            const contentArea = document.createElement('div');
            contentArea.className = 'page-content-area';
            contentArea.style.cssText = 'flex-grow: 1; overflow: hidden; display: flex; flex-direction: column; gap: 15px; font-size: 20px; line-height: 1.5; color: #4a235a;';
            page.appendChild(contentArea);
            
            return { page, contentArea };
        }

        async function paginateSection(sourceContainer, title) {
            if (!sourceContainer || sourceContainer.innerHTML.trim() === '') return;
            
            let { page, contentArea } = createA4Page(title);
            printArea.appendChild(page);
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sourceContainer.innerHTML.replace(/color:\s*var\(--gold\)/g, 'color: #D4AF37 !important');
            
            const flatItems = [];
            Array.from(tempDiv.children).forEach(child => {
                if (child.classList.contains('grid-report') || child.style.display === 'grid') {
                    flatItems.push(...Array.from(child.children).map(c => c.cloneNode(true)));
                } else {
                    flatItems.push(child.cloneNode(true));
                }
            });
            
            for (let i = 0; i < flatItems.length; i++) {
                const item = flatItems[i];
                if (item.classList && item.classList.contains('card')) {
                    item.style.cssText = 'border: 2px solid #D4AF37; border-radius: 12px; padding: 15px; background: #FFFFFF; box-shadow: none !important; margin: 0; flex-shrink: 0; page-break-inside: avoid; break-inside: avoid;';
                } else if (item.tagName === 'H3' || item.tagName === 'H4') {
                    item.style.cssText = 'color: #D4AF37; border-bottom: 1px solid #D4AF37; padding-bottom: 5px; margin: 15px 0 5px 0; flex-shrink: 0; line-height: 1.3; font-weight: bold;';
                } else if (item.style) {
                    item.style.margin = '0';
                    item.style.flexShrink = '0';
                }
                
                contentArea.appendChild(item);
                
                // Batch updates, yielding to browser every few items or on overflow
                if (i % 3 === 0) {
                    await new Promise(r => requestAnimationFrame(r));
                }
                
                if (contentArea.scrollHeight > contentArea.clientHeight) {
                    if (contentArea.children.length > 1) { // Only move if page is not empty
                        contentArea.removeChild(item);
                        
                        let newPageObj = createA4Page(title + ' (ต่อ)');
                        printArea.appendChild(newPageObj.page);
                        page = newPageObj.page;
                        contentArea = newPageObj.contentArea;
                        
                        contentArea.appendChild(item);
                        await new Promise(r => requestAnimationFrame(r));
                    }
                }
            }
        }

        // Add to DOM immediately so measurements work
        document.body.appendChild(previewScreen);

        // 1. Cover Page
        const coverPage = document.createElement('div');
        coverPage.className = 'a4-physical-page cover-page';
        coverPage.style.cssText = 'width: 210mm; height: 296mm; max-height: 296mm; overflow: hidden; box-sizing: border-box; text-align: center; display: block; position: relative; margin: 0 auto 30px auto; box-shadow: 0 5px 20px rgba(0,0,0,0.5); padding: 0; page-break-after: always; -webkit-print-color-adjust: exact; print-color-adjust: exact; border: none; background-color: #ffffff;';
        coverPage.innerHTML = `
            <img src="assets/taksasattalek_cover_optimized.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;" />
            <div style="position: absolute; top: 140px; left: 0; width: 100%; text-align: center; z-index: 10;">
                <div style="color: #D4AF37 !important; font-size: 24px; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">รายงานดวงชะตา Exclusive VIP</div>
                <div style="color: #FFDF73 !important; font-size: 45px; font-weight: bold; margin-top: 10px; text-shadow: 3px 3px 8px rgba(0,0,0,0.9);">คัมภีร์มหาทักษาสัตตเลข</div>
            </div>
            <div style="position: absolute; top: 450px; left: 50%; transform: translateX(-50%); width: 90%; z-index: 10; background: rgba(0, 0, 0, 0.6) !important; padding: 25px 0; border-radius: 20px; border-top: 2px solid rgba(212, 175, 55, 0.5) !important; border-bottom: 2px solid rgba(212, 175, 55, 0.5) !important; box-shadow: 0 5px 20px rgba(0,0,0,0.8);">
                <div style="color: #FFDF73 !important; font-size: 60px; font-weight: bold; text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 3px 3px 10px rgba(0,0,0,0.9);">${isHoraryMode ? 'ดวงยามอัฏฐกาล' : 'คำทำนายพื้นดวง และดวงจร'}</div>
            </div>
            <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 80%; background: rgba(20, 10, 40, 0.85) !important; border: 2px solid #D4AF37 !important; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); z-index: 10;">
                <div style="font-size: 24px; color: #FFF !important; line-height: 1.8;">
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เกิดวันที่:</strong> ${dobThStr}</p>
                    <p style="margin: 5px 0; color: #FFF !important;"><strong style="color:#D4AF37 !important;">เวลาตกฟาก:</strong> ${bTime} น.</p>
                </div>
            </div>
        `;
        printArea.appendChild(coverPage);

        // 2. Table Page
        const tableAreaHTML = document.getElementById('tableArea') ? document.getElementById('tableArea').innerHTML : '';
        if (tableAreaHTML) {
            const tablePage = document.createElement('div');
            tablePage.className = 'a4-physical-page';
            tablePage.style.cssText = 'width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; background: #FFFFFF; position: relative; margin: 0 auto 30px auto; box-shadow: 0 5px 20px rgba(0,0,0,0.5); border: 15px solid #D4AF37; padding: 0; page-break-after: always; display: flex; align-items: center; justify-content: center;';
            tablePage.innerHTML = `<div class="chart-container-rotated" style="width: 285mm; height: 195mm; transform: rotate(-90deg) scale(1.03); transform-origin: center center; display: flex; flex-direction: column; align-items: center; justify-content: center;">${tableAreaHTML.replace(/style="/g, 'style="color: inherit !important; ').replace(/<h2.*?<\/h2>/, '')}</div>`;
            printArea.appendChild(tablePage);
        }

        // 3. Paginate Reports (Async to allow DOM measurement)
        const generatePages = async () => {
            const topReportArea = document.getElementById('topReportArea');
            await paginateSection(topReportArea, isHoraryMode ? 'คำทำนายยามอัฏฐกาล' : 'คำทำนายสรุป');

            if (!isHoraryMode) {
                const reportArea = document.getElementById('reportArea');
                await paginateSection(reportArea, 'คำทำนายวิถีชีวิต');
            }
        };

        await generatePages();
        
        Swal.close();
    }, 50);
};
