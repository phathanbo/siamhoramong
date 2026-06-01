"use strict";

const APP_MENU = [
    { id: 'ascendantPage', title: 'คำนวณลัคนา', icon: 'fa-star-and-crescent', color: '#d4af37' },
    { id: 'auspiciousPage', title: 'ปฏิทินฤกษ์มงคล', icon: 'fa-calendar-check', color: '#d4af37' },
    { id: 'taksaPage', title: 'ทักษาพยากรณ์<br>(ภูมิพยากรณ์)', icon: 'fa-chart-line', color: '#d4af37' },
    { id: 'thaksaninesection', title: 'ทักษาพยากรณ์<br>(พยากรณ์รายปี)', icon: 'fa-chart-line', color: '#d4af37' },
    { id: 'elementManualPage', title: 'ธาตุประจำวันเกิด', icon: 'fa-fire-alt', color: '#d4af37' },
    { id: 'planetRelationPage', title: 'คู่มิตร-ศัตรู', icon: 'fa-user-friends', color: '#d4af37' },
    { id: 'numerologyPage', title: 'เบอร์มงคล', icon: 'fa-mobile-alt', color: '#d4af37' },
    { id: 'dreamPage', title: 'ทำนายฝัน', icon: 'fa-moon', color: '#d4af37' },
    { id: 'nameAnalysisPage', title: 'วิเคราะห์ชื่อ', icon: 'fa-signature', color: '#d4af37' },
    { id: 'lottoPage', title: 'เลขเด็ด', icon: 'fa-dice', color: '#d4af37' },
    { id: 'chatraPage', title: 'ฉัตร 3 ชั้น', icon: 'fa-tree', color: '#d4af37' },
    { id: 'chatninePage', title: 'ฉัตร 9 ชั้น', icon: 'fa-tree', color: '#d4af37' },
    { id: 'marriage-compatibility', title: 'เช็คดวงคู่', icon: 'fa-heart', color: '#d4af37' },
    { id: 'patient-prognosis', title: 'ทำนายชะตาผู้ป่วย', icon: 'fa-procedures', color: '#d4af37' },
    { id: 'soulmate-direction', title: 'ทิศเนื้อคู่', icon: 'fa-compass', color: '#d4af37' },
    { id: 'birthfortune', title: 'พยากรณ์วันเกิด', icon: 'fa-birthday-cake', color: '#d4af37' },
    { id: 'auspicious-day', title: 'วันมงคลประจำเดือน', icon: 'fa-calendar-day', color: '#d4af37' },
    { id: 'ubakong-yarm', title: 'ฤกษ์ดีประจำวัน', icon: 'fa-clock', color: '#d4af37' },
    { id: 'dailyTabooPage', title: 'ข้อห้ามประจำวัน', icon: 'fa-ban', color: '#d4af37' },
    { id: 'package', title: 'ระดับสมาชิก', icon: 'fa-file-import', color: '#d4af37' },
    { id: 'promchartsection', title: 'วงล้อพยากรณ์', icon: 'fa-chart-pie', color: '#d4af37' },
    { id: 'zodiacdetailsection', title: 'ตำราพรหมชาติ', icon: 'fa-smile', color: '#d4af37' },
    { id: 'daily-horoscope', title: 'ลักษณะผู้เกิดทั้ง 7 วัน<br>(ตำราโบราณ)', icon: 'fa-calendar-alt', color: '#d4af37' },
    { id: 'sompong-wealth', title: 'สมพงศ์มหาสมบัติ', icon: 'fa-coins', color: '#d4af37' },
    { id: 'climate-section', title: 'เกณฑ์พิรุณศาสตร์และชะตาโลก', icon: 'fa-cloud-showers-heavy', color: '#d4af37' },
    { id: 'sevenDigitsPage', title: 'เลข 7 ตัว ฐาน 4', icon: 'fa-layer-group', color: '#d4af37' },
    { id: 'horoscopeseven', title: 'เลข 7 ตัว ฐาน 4<br>(ตำราโบราณ)', icon: 'fa-layer-group', color: '#d4af37' },
    { id: 'compatibilityPage', title: 'เช็คดวงคู่', icon: 'fa-heart', color: '#d4af37' },
    { id: 'kaliyokepage', title: 'คำนวณกาลโยค', icon: 'fa-skull-crossbones', color: '#d4af37' },
    { id: 'reuxpage', title: 'คำนวณฤกษ์อายุ', icon: 'fa-tree', color: '#d4af37' },
    { id: 'dailyHighlightPage',title: 'แผนที่ฤกษ์มงคลรายวัน', icon: 'fa-calendar-alt', color: '#d4af37' },
    { id: 'lifeExtensionPage',title: 'ต่อชะตา', icon:'fa-candle-holder', color: '#d4af37' },
    { id: 'lunarSection' ,title: 'คำนวณจันทรคติ' ,icon: 'fa-calendar-alt', color: '#d4af37' },
    { id: 'showdaylife', title: 'คำนวณวันเกิด', icon: 'fa-birthday-cake', color: '#d4af37' },
    { id: 'fengshuiCalendar', title: '🧭 ปฏิทินฮวงจุ้ย<br>(ทิศมงคล)', icon: 'fa-compass', color: '#d4af37' },
    { id: 'fengShuiPage', title: '🏠 วิเคราะห์ฮวงจุ้ย<br>(เฉพาะบุคคล)', icon: 'fa-home', color: '#d4af37' },
    { id: 'businessFortune', title: '💼 พยากรณ์ธุรกิจ<br>/การเงิน', icon: 'fa-chart-line', color: '#d4af37' },
    { id: 'auspiciousOpening', title: '🏠 วันเปิดร้าน<br>/ลงหลัก', icon: 'fa-store', color: '#d4af37' },
    { id: 'ceremonyDate', title: '💍 กำหนดวัน<br>ประกอบพิธี', icon: 'fa-ring', color: '#d4af37' },
    { id: 'thaiAstrology', title: '🔮 โหราศาสตร์ไทย<br>(ดาวเกิด)', icon: 'fa-stars', color: '#d4af37' }

];

const UserProfile = {
    save: function() {
        const data = {
            birthDay: document.getElementById('birthDay')?.value || '',
            birthDate: document.getElementById('birthDate')?.value || '',
            birthTime: document.getElementById('birthTime')?.value || ''
        };
        localStorage.setItem('siamHora_Profile', JSON.stringify(data));
    },
    load: function() {
        const saved = localStorage.getItem('siamHora_Profile');
        if (saved) {
            const data = JSON.parse(saved);
            // เติมค่าให้ทุก Input ที่มี Class เหล่านี้ (ใช้ Class แทน ID เพื่อให้เติมได้หลายหน้าพร้อมกัน)
            if (data.birthDay) $('.birth-day-input').val(data.birthDay);
            if (data.birthDate) $('.birth-date-input').val(data.birthDate);
            if (data.birthTime) $('.birth-time-input').val(data.birthTime);
            return data;
        }
        return null;
    }
};

function buildDashboard() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = APP_MENU.map((item, index) => `
        <div class="col-6 col-md-4 col-lg-3 mb-4" style="animation: fadeIn 0.5s ease ${index * 0.05}s both;">
            <div class="dashboard-card"
                 style="cursor:pointer; transition: all 0.35s cubic-bezier(0.23, 1, 0.320, 1);"
                 onclick="navigateTo('${item.id}')"
                 onmouseover="this.style.transform='translateY(-12px) scale(1.05)'; this.style.boxShadow='0 20px 50px rgba(212, 175, 55, 0.35)';"
                 onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(212, 175, 55, 0.15)';">

                <div class="card-icon-wrapper">
                    <i class="fas ${item.icon}" style="color: ${item.color};"></i>
                </div>

                <div class="card-body text-center px-3 py-4">
                    <h6 class="card-body" style="font-weight: 600; line-height: 1.4;">${item.title}</h6>
                </div>

                <div class="card-shine"></div>
            </div>
        </div>
    `).join('');

    // เพิ่ม CSS สำหรับ dashboard cards
    if (!document.getElementById('dashboardStyles')) {
        const style = document.createElement('style');
        style.id = 'dashboardStyles';
        style.textContent = '.dashboard-card {' +
            'background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 235, 0.92) 100%);' +
            'border: 2px solid #d4af37;' +
            'border-radius: 18px;' +
            'padding: 20px 15px;' +
            'height: 100%;' +
            'position: relative;' +
            'overflow: hidden;' +
            'box-shadow: 0 8px 25px rgba(212, 175, 55, 0.15);' +
            'backdrop-filter: blur(10px);' +
            '}' +
            '.dashboard-card::before {' +
            'content: "";' +
            'position: absolute;' +
            'top: 0;' +
            'left: -100%;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);' +
            'transition: left 0.5s;' +
            '}' +
            '.dashboard-card:hover::before { left: 100%; }' +
            '.card-icon-wrapper {' +
            'font-size: 2.8rem;' +
            'margin-bottom: 12px;' +
            'display: flex;' +
            'justify-content: center;' +
            'align-items: center;' +
            'height: 70px;' +
            'background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%);' +
            'border-radius: 12px;' +
            'transition: transform 0.3s ease;' +
            '}' +
            '.dashboard-card:hover .card-icon-wrapper { transform: scale(1.15) rotate(5deg); }' +
            '.card-title {' +
            'color: #2c1810;' +
            'font-size: 0.95rem;' +
            'letter-spacing: 0.3px;' +
            '}' +
            '.card-shine {' +
            'position: absolute;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 50%);' +
            'pointer-events: none;' +
            'opacity: 0;' +
            'transition: opacity 0.3s;' +
            '}' +
            '.dashboard-card:hover .card-shine { opacity: 1; }' +
            '@keyframes fadeIn {' +
            'from { opacity: 0; transform: translateY(20px); }' +
            'to { opacity: 1; transform: translateY(0); }' +
            '}' +
            '@media (max-width: 767px) {' +
            '.dashboard-card { padding: 15px 12px; }' +
            '.card-icon-wrapper { font-size: 2.2rem; height: 60px; }' +
            '.card-title { font-size: 0.9rem; }' +
            '}';
        document.head.appendChild(style);
    }
}

$(document).ready(function () {
    buildDashboard();

    // แสดงหน้าหลักทันทีที่โหลดเสร็จ
    $('#mainpage').fadeIn();

    if (typeof updateNavYarm === 'function') {
        updateNavYarm();
        setInterval(updateNavYarm, 60000);
    }
});