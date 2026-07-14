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
        if (typeof dateString === 'string' && dateString.includes('/')) {
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
