// auspiciousAlert.js
// ระบบแจ้งเตือนวันสำคัญทางโหราศาสตร์

document.addEventListener("DOMContentLoaded", () => {
    // หน่วงเวลาเล็กน้อยเพื่อให้หน้าจอโหลดเสร็จก่อนค่อยเช็กแจ้งเตือน
    setTimeout(() => {
        checkAndShowAuspiciousAlert();
    }, 1500);
});

function getTodayThaiDateText() {
    // ใช้ getThaiDateInfo() จากปฏิทินที่มีอยู่แล้ว หรือคำนวณเบื้องต้น
    // สำหรับ MVP นี้เราจะสุ่มจำลองเหตุการณ์ หรือเช็กจากวันที่จริง
    const today = new Date();
    const day = today.getDay();
    const date = today.getDate();
    
    // จำลองกฎเกณฑ์ (ในระบบจริงควรใช้ calendar-data.js ในการคำนวณ)
    let alertData = null;

    if (date === 1 || date === 16) {
        alertData = {
            title: "💰 วันรวย วันโชคลาภ",
            message: "วันนี้วันรุ่ย วันแห่งความหวัง! เสี่ยงโชคอย่างมีสตินะครับ ขอให้ดวงเฮงๆ ได้รับทรัพย์ก้อนโตครับ",
            type: "warning" // gold
        };
    } else if (day === 0) {
        alertData = {
            title: "☀️ วันอาทิตย์สดใส",
            message: "เริ่มต้นสัปดาห์ใหม่ด้วยพลังบวก เหมาะแก่การวางแผนงานและติดต่อผู้ใหญ่ครับ",
            type: "info"
        };
    } else {
        // จำลองแจ้งเตือนทั่วไปเพื่อทดสอบ
        const rand = Math.floor(Math.random() * 10);
        if (rand > 7) {
            alertData = {
                title: "🌙 พรุ่งนี้วันพระ",
                message: "พรุ่งนี้เป็นวันพระ แนะนำให้ไหว้พระสวดมนต์ หรือทำทานเพื่อเสริมสิริมงคลให้ชีวิตราบรื่นครับ",
                type: "success"
            };
        }
    }
    
    return alertData;
}

function checkAndShowAuspiciousAlert() {
    const alertData = getTodayThaiDateText();
    if (!alertData) return;

    // เช็กว่าวันนี้เคยแสดงแจ้งเตือนนี้ไปแล้วหรือยัง
    const todayStr = new Date().toLocaleDateString();
    const lastAlertDate = localStorage.getItem('lastAuspiciousAlertDate');

    // ถ้ามีการแจ้งเตือน ให้โชว์จุดแดงที่ Navbar เสมอ
    const badge = document.getElementById('navAlertBadge');
    if (badge) {
        badge.style.display = 'block';
    }

    if (lastAlertDate !== todayStr) {
        // ยังไม่เคยแสดงวันนี้ -> โชว์ Pop-up ทันที
        showAuspiciousAlert(false, alertData);
        localStorage.setItem('lastAuspiciousAlertDate', todayStr);
    }
}

function showAuspiciousAlert(manualClick = false, forceData = null) {
    const alertData = forceData || getTodayThaiDateText() || {
        title: "✨ ไม่มีแจ้งเตือนพิเศษ",
        message: "วันนี้เป็นวันราบเรียบปกติ ขอให้เป็นวันที่ดีของคุณครับ",
        type: "info"
    };

    // ลบจุดแดงเมื่อเปิดอ่าน
    const badge = document.getElementById('navAlertBadge');
    if (badge) {
        badge.style.display = 'none';
    }

    Swal.fire({
        title: alertData.title,
        text: alertData.message,
        icon: alertData.type === 'warning' ? 'warning' : alertData.type === 'success' ? 'success' : 'info',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        confirmButtonText: 'รับทราบครับ 🙏'
    });
}
