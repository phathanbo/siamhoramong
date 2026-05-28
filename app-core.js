/**
 * สยามโหรามงคล - Core Application Logic
 * รวมระบบ Navigation, Storage และ Global Widgets
 */
"use strict";

// 1. รายการเมนูทั้งหมด
const APP_MENU = [
    { id: 'ascendantPage', title: 'คำนวณลัคนา', icon: 'fa-star-and-crescent', color: '#d4af37' },
    { id: 'auspiciousPage', title: 'ปฏิทินฤกษ์มงคล', icon: 'fa-calendar-check', color: '#d4af37' },
    { id: 'sevenDigitsPage', title: 'เลข 7 ตัว ฐาน 9', icon: 'fa-layer-group', color: '#d4af37' },
    { id: 'taksaPage', title: 'ทักษา', icon: 'fa-chart-line', color: '#d4af37' },
    { id: 'yarmPage', title: 'ยามอัฏฐกาล', icon: 'fa-clock', color: '#d4af37' },
    { id: 'chatraPage', title: 'ฉัตร 3 ชั้น', icon: 'fa-tree', color: '#d4af37' },
    { id: 'weeklyColorSection', title: 'สีมงคลประจำวัน', icon: 'fa-fill', color: '#d4af37' },
    { id: 'planetRelationPage', title: 'คู่มิตร-ศัตรู', icon: 'fa-user-friends', color: '#d4af37' },
    { id: 'numerologyPage', title: 'เบอร์มงคล', icon: 'fa-mobile-alt', color: '#d4af37' },
    { id: 'dreamPage', title: 'ทำนายฝัน', icon: 'fa-moon', color: '#d4af37' },
    { id: 'nameAnalysisPage', title: 'วิเคราะห์ชื่อ', icon: 'fa-signature', color: '#d4af37' },
    { id: 'lottoPage', title: 'เลขเด็ด', icon: 'fa-dice', color: '#d4af37' },
];

// 2. ระบบจำข้อมูลผู้ใช้ (LocalStorage)
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

// 3. ระบบนำทาง (รองรับปุ่มย้อนกลับ Browser)
function navigateTo(pageId, addHistory = true) {
    // ซ่อนทุกหน้า
    $('.main-section').hide().removeClass('active');
    
    const targetPage = $('#' + pageId);
    if (targetPage.length) {
        targetPage.fadeIn(300).addClass('active');
        window.scrollTo(0, 0);
        
        // บันทึกประวัติลง Browser
        if (addHistory) {
            history.pushState({ pageId: pageId }, "", "#" + pageId);
        }
    }
    // ทุกครั้งที่เปลี่ยนหน้า ให้โหลดข้อมูลผู้ใช้มาเติมเสมอ
    UserProfile.load();
}

// 4. วิดเจ็ตสรุปดวงรายวันหน้าแรก
function renderDailyBrief() {
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const now = new Date();
    const dayName = thaiDays[now.getDay()];
    const colorInfo = (typeof COLOR_MASTER !== 'undefined') ? COLOR_MASTER[dayName] : null;

    return `
        <div class="daily-brief-card mb-4 p-3 border-gold bg-dark text-white rounded shadow">
            <h6 class="text-gold"><i class="fas fa-sun"></i> มงคลวัน${dayName}</h6>
            <div class="d-flex justify-content-between small mt-2">
                <span>🎨 สีนำโชค: <b style="color:${colorInfo?.bg}">${colorInfo?.lucky || '-'}</b></span>
                <span>🧭 ทิศมงคล: <b>${colorInfo?.direction || '-'}</b></span>
            </div>
        </div>
    `;
}

// 5. สร้าง Dashboard เมนู
function buildDashboard() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    let html = renderDailyBrief();
    html += '<div class="row">';
    html += APP_MENU.map(item => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 bg-dark border-gold py-3 text-center" 
                 style="cursor:pointer; transition:0.3s;" 
                 onclick="navigateTo('${item.id}')"
                 onmouseover="this.style.transform='translateY(-5px)'"
                 onmouseout="this.style.transform='translateY(0)'">
                <div class="card-body">
                    <i class="fas ${item.icon} fa-2x mb-2" style="color:${item.color}"></i>
                    <p class="text-white mb-0 small">${item.title}</p>
                </div>
            </div>
        </div>
    `).join('');
    html += '</div>';
    menuGrid.innerHTML = html;
}

// 6. เริ่มต้นระบบเมื่อโหลดหน้าเสร็จ
$(document).ready(function() {
    buildDashboard();
    UserProfile.load();

    // ดักจับปุ่มย้อนกลับ Browser
    window.onpopstate = function(event) {
        const pageId = (event.state && event.state.pageId) ? event.state.pageId : 'mainpage';
        navigateTo(pageId, false);
    };

    // บันทึกข้อมูลอัตโนมัติเมื่อมีการกรอก
    $(document).on('change', 'select, input', function() {
        UserProfile.save();
    });

    // อัปเดตยามบน Navbar (ถ้ามีฟังก์ชัน)
    if (typeof updateNavYarm === 'function') {
        updateNavYarm();
        setInterval(updateNavYarm, 60000);
    }
});