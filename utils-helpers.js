/**
 * utils-helpers.js
 * รวบรวมฟังก์ชันอรรถประโยชน์ (Utility Functions) ที่ใช้ซ้ำในหลายๆ ไฟล์
 * เพื่อลดความซ้ำซ้อนของโค้ด (DRY)
 */

// 1. ฟังก์ชันแปลงวันที่เกิดจาก String (dd/mm/yyyy หรือ yyyy-mm-dd) เป็น Date Object ที่รองรับ properties ครบถ้วน
function parseBirthdate(dateString) {
    if (!dateString || dateString === "undefined") return null;
    try {
        let day, month, year, d;
        if (typeof dateString === 'string' && /[ก-๙]/.test(dateString)) {
            const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            const thaiMonthsAbbr = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            const parts = dateString.trim().split(/\s+/);
            if (parts.length >= 3) {
                day = parseInt(parts[0], 10);
                month = thaiMonths.findIndex(m => parts[1].includes(m));
                if (month === -1) month = thaiMonthsAbbr.findIndex(m => parts[1].includes(m));
                year = parseInt(parts[2], 10);
                if (!isNaN(day) && month !== -1 && !isNaN(year)) {
                    if (year > 2400) year -= 543;
                    d = new Date(year, month, day);
                }
            }
        } else if (typeof dateString === 'string' && dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                year = parseInt(parts[2], 10);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    if (year > 2400) year -= 543; // แปลง พ.ศ. เป็น ค.ศ.
                    d = new Date(year, month, day);
                }
            }
        } else {
            d = new Date(dateString);
            if (!isNaN(d.getTime())) {
                day = d.getDate();
                month = d.getMonth();
                year = d.getFullYear();
                if (year > 2400) {
                    year -= 543;
                    d = new Date(year, month, day);
                }
            }
        }

        if (d && !isNaN(d.getTime())) {
            d.day = day;
            d.month = month;
            d.year = year;
            d.dateObj = d;
            return d;
        }
    } catch (e) {
        return null;
    }
    return null;
}

// 2. ฟังก์ชันดึงชื่อผู้ใช้ปัจจุบันจาก Session
function getCurrentUsername() {
    try {
        const session = JSON.parse(localStorage.getItem('siamhora_auth_session') || '{}');
        return session.username || localStorage.getItem('userId') || localStorage.getItem('thaiHoroUserName') || null;
    } catch (e) {
        return null;
    }
}

// 3. ฟังก์ชันดึงชื่อเดือนภาษาไทย
function getMonthNameThai(monthNum) {
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return months[monthNum - 1] || "เดือนไม่ทราบ";
}

// 4. ฟังก์ชันป้องกัน XSS (Sanitize HTML)
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 5. คำนวณวันในสัปดาห์ทางโหราศาสตร์ (0=อาทิตย์, 1=จันทร์ ... 6=เสาร์)
// ตัดวันตอน 06:00 น. หากเกิดก่อน 06:00 จะนับเป็นวันก่อนหน้า
function getAstrologicalDayOfWeek(dateString, timeString) {
    if (!dateString) return null;

    let d;
    // Handle YYYY-MM-DD format explicitly to avoid UTC timezone issues.
    // new Date('YYYY-MM-DD') creates a UTC date, which can cause off-by-one day errors.
    // We parse it manually to create a local date at noon.
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2], 10);
        d = new Date(year, month, day, 12, 0, 0); // Noon local time
    } else {
        // Fallback for other formats like DD/MM/YYYY, relies on parseBirthdate
        d = parseBirthdate(dateString);
    }
    
    if (!d || isNaN(d.getTime())) {
        return null;
    }
    
    let dayOfWeek = d.getDay(); // Get day based on local timezone. 0 = Sunday.
    
    // Only adjust the day if a valid time is provided.
    if (timeString && typeof timeString === 'string' && timeString.includes(':')) {
        const timeParts = timeString.split(':');
        const hour = parseInt(timeParts[0], 10);
        
        // If hour is before 6 AM (astrological sunrise), it's the previous day.
        if (!isNaN(hour) && hour < 6) {
            dayOfWeek = dayOfWeek - 1;
            if (dayOfWeek < 0) {
                dayOfWeek = 6; // Rollover from Sunday (0) to Saturday (6).
            }
        }
    }
    
    return dayOfWeek;
}

// 6. คำนวณ "อายุย่าง" อัตโนมัติตามปฏิทิน
function calculateRunningAge(dateString) {
    const d = parseBirthdate(dateString);
    if (!d) return 0;
    
    const today = new Date();
    let fullAge = today.getFullYear() - d.getFullYear();
    
    // ตรวจสอบว่าถึงวันเกิดในปีนี้หรือยัง
    const isBeforeBirthdayThisYear = 
        today.getMonth() < d.getMonth() || 
        (today.getMonth() === d.getMonth() && today.getDate() < d.getDate());
        
    if (isBeforeBirthdayThisYear) {
        fullAge--;
    }
    
    // อายุย่าง = อายุเต็ม + 1
    return fullAge + 1;
}

// 7. ฟังก์ชันแปลงปีพ.ศ. เป็น ค.ศ.
function toCE(year) {
    if (!year) return 0;
    year = parseInt(year, 10);
    return year > 2400 ? year - 543 : year;
}

// 8. ฟังก์ชันแปลงปีค.ศ. เป็น พ.ศ.
function toBE(year) {
    if (!year) return 0;
    year = parseInt(year, 10);
    return year < 2400 ? year + 543 : year;
}

// 🌐 Export to window for global access across scripts and modules
if (typeof window !== 'undefined') {
    window.parseBirthdate = parseBirthdate;
    window.getCurrentUsername = getCurrentUsername;
    window.getMonthNameThai = getMonthNameThai;
    window.escapeHTML = escapeHTML;
    window.getAstrologicalDayOfWeek = getAstrologicalDayOfWeek;
    window.calculateRunningAge = calculateRunningAge;
    window.toCE = toCE;
    window.toBE = toBE;
}

// ==========================================================================
// 🛡️ SECURITY SHIELDS & ERROR PROTECTION (Global Bug Prevention)
// ==========================================================================
if (typeof window !== 'undefined') {
    // 1. Global Unhandled Error Shield
    // Displays user-friendly logs and prevents silent freezing when unexpected DOM errors occur.
    window.addEventListener('error', function(event) {
        console.error('Captured unhandled runtime error:', event.error || event.message);
        // Silently capture or log without interrupting user session
        if (event.message && (event.message.includes('null') || event.message.includes('undefined'))) {
            console.warn("Recoverable DOM reference missing error bypassed.");
        }
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled Promise Rejection captured:', event.reason);
    });
}

// ==========================================================================
// 🚀 DYNAMIC FACEBOOK SHARING FOR ADMIN ON CLIENT PAGES
// ==========================================================================
if (typeof window !== 'undefined') {
    window.addFacebookPostButtonsForAdmin = function(containerId, getSummaryTextFunc) {
        // ดักว่าเปิดใช้งานในฐานะ Admin หรือไม่
        const isAdminUser = typeof window.isAdmin === 'function' && window.isAdmin();
        if (!isAdminUser) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        // ล้างปุ่มเดิมออกก่อนสร้างใหม่เพื่ออัปเดตสเตตัสผลการคำนวณรอบใหม่
        const existing = container.querySelector('.admin-fb-post-buttons-container');
        if (existing) existing.remove();

        const btnContainer = document.createElement('div');
        btnContainer.className = 'admin-fb-post-buttons-container text-center mt-3 p-3 rounded';
        btnContainer.style.background = 'rgba(212, 175, 55, 0.1)';
        btnContainer.style.border = '1px dashed #d4af37';
        btnContainer.style.borderRadius = '12px';
        btnContainer.style.margin = '20px 0';
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.gap = '15px';
        btnContainer.style.flexWrap = 'wrap';

        // ปุ่ม 1: โพสต์ลงเพจเฟซบุ๊กอัตโนมัติ
        const btnDirect = document.createElement('button');
        btnDirect.className = 'btn btn-primary font-weight-bold';
        btnDirect.style.background = 'linear-gradient(45deg, #1877F2, #3b5998)';
        btnDirect.style.border = 'none';
        btnDirect.style.padding = '12px 24px';
        btnDirect.style.borderRadius = '8px';
        btnDirect.innerHTML = '<i class="fab fa-facebook mr-2"></i> โพสต์ลงเพจ Facebook โดยตรง';
        btnDirect.onclick = () => window.postContainerToFacebook(containerId, getSummaryTextFunc, 'direct');

        // ปุ่ม 2: ก๊อปปี้คำทำนายและโหลดรูปสำหรับแชร์เอง
        const btnManual = document.createElement('button');
        btnManual.className = 'btn btn-dark font-weight-bold';
        btnManual.style.background = 'linear-gradient(45deg, #2c3e50, #1a252f)';
        btnManual.style.border = '1px solid #d4af37';
        btnManual.style.color = '#fff';
        btnManual.style.padding = '12px 24px';
        btnManual.style.borderRadius = '8px';
        btnManual.innerHTML = '<i class="fas fa-copy mr-2"></i> ดึงรูปภาพ + ก๊อปปี้คำทำนาย';
        btnManual.onclick = () => window.postContainerToFacebook(containerId, getSummaryTextFunc, 'manual');

        btnContainer.appendChild(btnDirect);
        btnContainer.appendChild(btnManual);
        container.appendChild(btnContainer);
    };

    window.postContainerToFacebook = async function(containerId, getSummaryTextFunc, action = 'direct') {
        const container = document.getElementById(containerId);
        if (!container) return;

        Swal.fire({
            title: 'กำลังจัดทำรูปภาพสำหรับเฟสบุ๊ค...',
            text: 'ระบบกำลังจำลองขนาดสัดส่วนที่เหมาะสมและโหลดทรัพยากร กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // ดึงบทสรุปข้อความพยากรณ์
        let summaryText = "";
        if (typeof getSummaryTextFunc === 'function') {
            summaryText = getSummaryTextFunc();
        } else if (typeof getSummaryTextFunc === 'string') {
            const textEl = document.querySelector(getSummaryTextFunc);
            summaryText = textEl ? (textEl.innerText || textEl.textContent) : getSummaryTextFunc;
        }

        try {
            // โคลนตัวชี้วัดดวงชะตาไปจัดขนาดแบบ 1200x1200px ในหลังบ้านเพื่อไม่ให้รูปเพี้ยน
            const clone = container.cloneNode(true);
            const fbButtons = clone.querySelector('.admin-fb-post-buttons-container');
            if (fbButtons) fbButtons.remove();

            // ลบแถบแชร์เดิมออก
            const shareCont = clone.querySelector('.share-buttons-container');
            if (shareCont) shareCont.remove();

            const renderBox = document.createElement('div');
            renderBox.style.position = 'fixed';
            renderBox.style.left = '-9999px';
            renderBox.style.top = '-9999px';
            renderBox.style.width = '1200px';
            renderBox.style.height = '1200px';
            renderBox.style.padding = '50px';
            renderBox.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
            renderBox.style.color = '#fff';
            renderBox.style.display = 'flex';
            renderBox.style.flexDirection = 'column';
            renderBox.style.justifyContent = 'space-between';
            renderBox.style.boxSizing = 'border-box';
            renderBox.style.zIndex = '-9999';

            // ส่วนหัวลายน้ำ
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.borderBottom = '2px solid rgba(212,175,55,0.4)';
            header.style.paddingBottom = '15px';
            header.style.marginBottom = '25px';
            header.innerHTML = `
                <div style="font-size: 32px; font-weight: bold; color: #d4af37; font-family: 'Sarabun', sans-serif;">🔮 สยามโหรามงคล</div>
                <div style="font-size: 20px; color: #fff; opacity: 0.8; font-family: 'Sarabun', sans-serif;">ผลพยากรณ์ประจำตัวคุณ</div>
            `;
            renderBox.appendChild(header);

            // บอดี้รายละเอียด
            clone.style.width = '100%';
            clone.style.background = 'transparent';
            clone.style.border = 'none';
            clone.style.padding = '0';
            clone.style.boxShadow = 'none';
            clone.style.color = '#fff';

            // ตกแต่งตารางภายในโคลน
            const tables = clone.querySelectorAll('table');
            tables.forEach(t => {
                t.className = 'table table-dark table-bordered';
                t.style.background = 'rgba(0,0,0,0.5)';
                t.style.color = '#fff';
                t.style.fontSize = '18px';
            });

            const cardBody = document.createElement('div');
            cardBody.style.flex = '1';
            cardBody.style.overflow = 'hidden';
            cardBody.appendChild(clone);
            renderBox.appendChild(cardBody);

            // ส่วนท้ายลายน้ำ
            const footer = document.createElement('div');
            footer.style.textAlign = 'center';
            footer.style.fontSize = '18px';
            footer.style.color = '#d4af37';
            footer.style.marginTop = '25px';
            footer.style.paddingTop = '15px';
            footer.style.borderTop = '1px solid rgba(255,255,255,0.1)';
            footer.innerHTML = `ตรวจชะตาชีวิตส่วนบุคคลเพิ่มเติมได้ที่ <strong>siamhoramongkol.com</strong>`;
            renderBox.appendChild(footer);

            document.body.appendChild(renderBox);

            // เรียกใช้ html2canvas แบบ Dynamic
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
            script.onload = () => {
                html2canvas(renderBox, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#15102a'
                }).then(async (c) => {
                    renderBox.remove();
                    Swal.close();

                    const dataUrl = c.toDataURL('image/png');

                    if (action === 'manual') {
                        // ก๊อปปี้ข้อความคำทำนายลงคลิปบอร์ด
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(summaryText);
                        } else {
                            const ta = document.createElement('textarea');
                            ta.value = summaryText;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            ta.remove();
                        }

                        // ดาวน์โหลดรูปภาพ
                        const link = document.createElement('a');
                        link.download = `siamhora-manual-${Date.now()}.png`;
                        link.href = dataUrl;
                        link.click();

                        Swal.fire({
                            title: 'ดึงข้อมูลเสร็จสิ้น!',
                            text: 'คัดลอกคำทำนายลงคลิปบอร์ดและบันทึกรูปภาพ HD ลงเครื่องเรียบร้อยแล้ว แอดมินสามารถนำไปวางโพสต์ได้เองตามใจชอบ!',
                            icon: 'success',
                            background: '#1a1a1a',
                            color: '#fff'
                        });
                    } else {
                        // แชร์โดยตรงไป Facebook
                        const confirmResult = await Swal.fire({
                            title: 'ยืนยันการแชร์โพสต์ลงเพจ',
                            html: `
                                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                                            <img src="https://ui-avatars.com/api/?name=Siam&background=5a0909&color=fff" style="width: 100%; height: 100%;">
                                        </div>
                                        <div style="display: flex; flex-direction: column;">
                                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                                        </div>
                                    </div>
                                    <div style="padding: 4px 16px 16px 16px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${summaryText}</div>
                                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
                                </div>
                                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม</h4>
                                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (Schedule):</label>
                                    <input type="datetime-local" id="swalScheduleTime2" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">รหัสสถานที่เช็คอิน (Place ID):</label>
                                    <input type="text" id="swalPlaceId2" placeholder="เช่น 108398189188044" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                                </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์ลงเพจ',
                            cancelButtonText: 'ยกเลิก',
                            background: '#1e1e1e',
                            color: '#fff',
                            width: '600px',
                            preConfirm: () => {
                                return {
                                    scheduleTime: document.getElementById('swalScheduleTime2') ? document.getElementById('swalScheduleTime2').value : '',
                                    placeId: document.getElementById('swalPlaceId2') ? document.getElementById('swalPlaceId2').value.trim() : ''
                                };
                            }
                        });

                        if (!confirmResult.isConfirmed) return;

                        let scheduledPublishTime = null;
                        if (confirmResult.value && confirmResult.value.scheduleTime) {
                            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
                        }
                        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

                        Swal.fire({
                            title: 'กำลังโพสต์ไปยังเพจ Facebook...',
                            allowOutsideClick: false,
                            didOpen: () => Swal.showLoading()
                        });

                        const res = await fetch("http://127.0.0.1:3000/api/facebook-post", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: summaryText,
                                image: dataUrl,
                                scheduledPublishTime: scheduledPublishTime,
                                place: place
                            })
                        });

                        const data = await res.json();
                        if (data.success) {
                            Swal.fire('สำเร็จ!', 'โพสต์ผลลัพธ์ดวงชะตาลงเพจเฟซบุ๊กเรียบร้อย!', 'success');
                        } else {
                            Swal.fire('เกิดข้อผิดพลาด', data.error || 'ไม่สามารถโพสต์ได้', 'error');
                        }
                    }
                }).catch(e => {
                    console.error(e);
                    renderBox.remove();
                    Swal.fire('ข้อผิดพลาด', 'ไม่สามารถจำลองภาพถ่ายหน้าจอได้', 'error');
                });
            };
            document.body.appendChild(script);
        } catch (e) {
            console.error(e);
            Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการรวบรวมเลย์เอาต์คำทำนาย', 'error');
        }
    };

    // 🚀 ระบบตรวจจับและฝังปุ่มแชร์ Facebook อัตโนมัติ (MutationObserver สำหรับ Admin)
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            const targets = [
                { id: "dashaContent", title: "ทศาดาวพยากรณ์" },
                { id: "twHContent", title: "คำพยากรณ์ 12 ภพ" },
                { id: "taksaResult", title: "ทักษาพยากรณ์" },
                { id: "sevenPage", title: "คำนวณเลข 7 ตัว ฐาน 4" },
                { id: "yearClashContainer", title: "ปีชง - ปีเสริม" },
                { id: "showchatriPage", title: "ดวงฉัตร 3 ชั้น" },
                { id: "showchatraninePage", title: "ดวงฉัตร 9 ชั้น" },
                { id: "showascPage", title: "ลัคนาพยากรณ์" },
                { id: "numResult", title: "วิเคราะห์เบอร์มงคล" },
                { id: "nameAnalysisResult", title: "วิเคราะห์ชื่อมงคล" },
                { id: "businessFortuneContent", title: "พยากรณ์ธุรกิจและการเงิน" },
                { id: "zodiacFortuneContent", title: "พยากรณ์ดวงชะตาราศี" },
                { id: "elementManualContent", title: "วิเคราะห์ธาตุประจำวันเกิด" },
                { id: "promchartContent", title: "วงล้อพยากรณ์พรหมชาติ" },
                { id: "dayLifeContent", title: "พยากรณ์คำนวณวันเกิด" },
                { id: "personalizedAuspiciousResult", title: "ฤกษ์มงคลเฉพาะบุคคล" },
                { id: "thaksaResult", title: "มหาทักษาพยากรณ์" },
                { id: "elementManualContainer", title: "ธาตุประจำวันเกิด" },
                { id: "calendarBodypage", title: "ปฏิทินฤกษ์มงคล" },
                { id: "thaiHoraContainer", title: "โหราศาสตร์ไทย" },
                { id: "twelveHousesContainer", title: "12 ภพภูมิชะตา" },
                { id: "relationPage", title: "ความสัมพันธ์คู่ดาว" },
                { id: "numberlogypage", title: "วิเคราะห์เบอร์มงคล" },
                { id: "compatipage", title: "สมพงษ์คู่รัก" },
                { id: "fengshuiResult", title: "ฮวงจุ้ยที่อยู่อาศัย" },
                { id: "lottoResultpage", title: "คำนวณเลขเด็ด" },
                { id: "colorpage", title: "สีมงคลประจำวันเกิด" },
                { id: "taksaTablepage", title: "ผังทักษาพยากรณ์" },
                { id: "showyarmpage", title: "ยามสามตาพยากรณ์" },
                { id: "planetaryHoursContainer", title: "ฤกษ์ยามดวงดาว" },
                { id: "showdailytablepage", title: "ลักษณะผู้เกิดรายวัน" },
                { id: "showdailytaboopage", title: "ข้อห้ามกาลกิณีประจำวัน" },
                { id: "showlifeGraphPage", title: "กราฟชีวิต 12 มิติ" },
                { id: "dreampage", title: "ทำนายฝันพยากรณ์" },
                { id: "deepSynastryResult", title: "สมพงษ์คู่ชะตาเชิงลึก" },
                { id: "shownamepage", title: "วิเคราะห์ชื่อนามสกุล" },
                { id: "showlifeextensionpage", title: "วิชาต่อชะตาชีวิต" },
                { id: "showMatchpage", title: "สมพงษ์วิชาธาตุชะตา" },
                { id: "patient-result-display", title: "ทำนายชะตาอาการผู้ป่วย" },
                { id: "soulmateDirectionResult", title: "ทิศมงคลคู่ครอง" },
                { id: "birthFortuneResult", title: "ทำนายวันเศษอายุ" },
                { id: "auspiciousResult", title: "คำนวณวันดีฤกษ์เด่น" },
                { id: "ubakongResult", title: "ยามอุบากองแปดทิศ" },
                { id: "lunarResult", title: "คำนวณฤกษ์ดิถีมงคล" },
                { id: "zodiacDetailContent", title: "พรหมชาติตำราหลวง" },
                { id: "dailyHoroscopeResult", title: "ทำนายวันเกิดพยากรณ์" },
                { id: "sompongResult", title: "สมพงษ์ผูกดวงคู่ชะตา" },
                { id: "climateResult", title: "วิเคราะห์สภาพชะตาการเงิน" },
                { id: "thaksanineResult", title: "ทักษาพยากรณ์รายปี" },
                { id: "horosevenResult", title: "เลข 7 ตัว ฐาน 4 (ชุด 2)" },
                { id: "kaliyokeResult", title: "ตำรากาลโยคมงคล" },
                { id: "reuxResult", title: "ตำราฤกษ์ยามอุดม" },
                { id: "resultDisplay", title: "ทำนายดวงตามอายุ (ตำราพรหมชาติ)" },
                { id: "dynamicResultArea", title: "ดูดวงตามปีนักษัตร (ตำราพรหมชาติ)" },
                { id: "showdaybirthpage", title: "ทำนายดวงชะตาประจำวันเกิด" },
                { id: "businessResult", title: "พยากรณ์ธุรกิจและการเงิน" },
                { id: "zodiacResult", title: "พยากรณ์ดวงชะตาราศี" },
                { id: "dreamResult", title: "ทำนายฝันพยากรณ์" },
                { id: "tarotResult", title: "ทำนายไพ่ยิปซีเซลติกครอส" },
                { id: "cartomancyResult", title: "ไพ่ป๊อกทำนายดวงรายวัน" },
                { id: "siamsiResult", title: "ใบเซียมซีเสี่ยงทาย" }
            ];

            const observer = new MutationObserver((mutations) => {
                // ตรวจเช็คสิทธิ์ ณ วินาทีที่มีการอัปเดตคำทำนาย
                const isAdminUser = typeof window.isAdmin === 'function' && window.isAdmin();
                if (!isAdminUser) return;

                mutations.forEach((mutation) => {
                    // ค้นหา Main Container จากรายการเป้าหมายที่ถูกกระตุ้นหรือมีตัวแปรลูกเปลี่ยนแปลง
                    let targetEl = null;
                    let targetConfig = null;
                    
                    for (const t of targets) {
                        const el = document.getElementById(t.id);
                        if (el && (el === mutation.target || el.contains(mutation.target))) {
                            targetEl = el;
                            targetConfig = t;
                            break;
                        }
                    }

                    if (targetEl) {
                        // ดึงค่าการจัดแสดงสไตล์จริงเพื่อรองรับการเปลี่ยนแบบสลับ Class CSS หรือ style.display
                        const isVisible = window.getComputedStyle(targetEl).display !== 'none';
                        if (isVisible && targetEl.innerHTML.trim().length > 100) {
                            observer.disconnect(); // ปิดชั่วคราวเพื่อป้องกัน Infinite Loop
                            
                            // ถ้ายังไม่มีปุ่ม ให้ทำการฝังปุ่มแชร์
                            if (!targetEl.querySelector('.admin-fb-post-buttons-container')) {
                                const title = targetConfig.title;
                                
                                const getSummaryText = () => {
                                    // คัดกรองย่อย่อหน้าคำทำนายที่เหมาะสมเป็นข้อความแชร์
                                    const paragraphs = Array.from(targetEl.querySelectorAll('p, li, td'))
                                        .map(el => el.innerText.trim())
                                        .filter(txt => txt.length > 10 && txt.length < 500 && !txt.includes('Facebook') && !txt.includes('ผูกดวงใหม่') && !txt.includes('ส่วนที่'));
                                    
                                    const headText = `🔮 ${title} จากสยามโหรามงคล\n\n`;
                                    const mainText = paragraphs.slice(0, 5).join('\n• ');
                                    return headText + (mainText ? `• ${mainText}` : "ผลวิเคราะห์ดวงชะตาส่วนบุคคลของคุณ");
                                };

                                window.addFacebookPostButtonsForAdmin(targetEl.id, getSummaryText);
                            }
                            
                            connectAll(); // เชื่อมต่อใหม่
                        }
                    }
                });
            });

            function connectAll() {
                targets.forEach(target => {
                    const el = document.getElementById(target.id);
                    if (el) {
                        observer.observe(el, { 
                            childList: true, 
                            attributes: true, 
                            subtree: true,
                            attributeFilter: ['style', 'class'] 
                        });
                    }
                });
            }

            connectAll();
            console.log("🚀 Admin Facebook Auto-Posting Observer initialized across all active fortune systems.");
        }, 1500);
    });
}
