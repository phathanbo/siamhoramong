document.addEventListener('DOMContentLoaded', () => {
    // We can initialize it when the page loads or when navigateTo is called
});

function initAdminQuickTools() {
    const container = document.getElementById('adminQuickToolsContainer');
    if (!container) return;

    const inAdmin = window.location.pathname.includes('/admin/');
    const pAdmin = inAdmin ? '' : 'admin/';
    const pPages = inAdmin ? '../pages/' : 'pages/';

    // All tools catalog categorized
    const tools = [
        // Category: system (ระบบและโต๊ะพยากรณ์หลัก)
        {
            title: 'ฤกษ์สมาคมโหรฯ',
            desc: 'พ.ต. หลวงวุฒิรณพัสดุ์',
            icon: 'fas fa-dharmachakra',
            badge: 'ระบบหลัก',
            color: '#f59e0b',
            category: 'system',
            action: `window.location.href='${pAdmin}luang-wuthi-reux.html'`
        },
        {
            title: 'กาลจักรจรวิภาค',
            desc: 'ตัวเสวย-ตัวแทรก & ชำระ',
            icon: 'fas fa-scroll',
            badge: 'คัมภีร์',
            color: '#38bdf8',
            category: 'system',
            action: `window.location.href='${pPages}kalachakra-wiphak.html'`
        },
        {
            title: 'โต๊ะพยากรณ์สำนัก',
            desc: 'ผูกดวง 6 มิติ + Dossier',
            icon: 'fas fa-laptop-code',
            badge: 'Pro Studio',
            color: '#10b981',
            category: 'system',
            action: `window.location.href='${pPages}thai-horoscope-pro.html'`
        },
        {
            title: 'แผ่นดวงชะตา',
            desc: 'ดวงชะตาส่วนบุคคล',
            icon: 'fas fa-id-card',
            badge: 'ส่วนตัว',
            color: '#eab308',
            category: 'system',
            action: `window.location.href='${pPages}profile.html'`
        },

        // Category: graphic (สื่อกราฟิก & ภาพโซเชียล)
        {
            title: 'คำทำนายรายวัน',
            desc: 'โพสต์ + ภาพสรุป 1080px',
            icon: 'fas fa-star-and-crescent',
            badge: 'Social',
            color: '#f59e0b',
            category: 'graphic',
            action: `window.location.href='${pAdmin}daily-content.html'`
        },
        {
            title: 'ฟันธงดวงรายวัน',
            desc: 'อินโฟกราฟิก 1920px',
            icon: 'fas fa-magic',
            badge: 'Infographic',
            color: '#d97706',
            category: 'graphic',
            action: `window.location.href='${pAdmin}daily-infographic.html'`
        },
        {
            title: 'ภาพดวงรายวัน',
            desc: 'แผ่นเดียวกราฟิกสวย',
            icon: 'fas fa-image',
            badge: 'Story/IG',
            color: '#fb923c',
            category: 'graphic',
            action: `window.location.href='${pAdmin}daily-single-image.html'`
        },
        {
            title: 'ภาพพื้นดวงชะตา',
            desc: 'วิเคราะห์กราฟ & ทักษา',
            icon: 'fas fa-camera-retro',
            badge: 'Chart',
            color: '#facc15',
            category: 'graphic',
            action: `window.location.href='${pAdmin}chart-image-gen.html'`
        },

        // Category: zodiac (12 ราศี & โซเชียลมีเดีย)
        {
            title: 'ดวง 12 ราศีรวม',
            desc: 'ภาพรวม 12 ราศีในแผ่นเดียว',
            icon: 'fas fa-th-large',
            badge: '12 ราศี',
            color: '#c084fc',
            category: 'zodiac',
            action: `window.open('${pAdmin}zodiac-daily.html', '_blank')`
        },
        {
            title: 'ดวงรายราศีเดี่ยว',
            desc: 'แยก 12 ภาพรายราศี',
            icon: 'fas fa-th-list',
            badge: 'แยก 12 แผ่น',
            color: '#e879f9',
            category: 'zodiac',
            action: `window.open('${pAdmin}zodiac-single.html', '_blank')`
        },
        {
            title: 'อัลบั้มภาพ Carousel',
            desc: 'ภาพสไลด์ 9 ภาพ Facebook/IG',
            icon: 'fas fa-images',
            badge: 'Carousel',
            color: '#f472b6',
            category: 'zodiac',
            action: `window.location.href='${pAdmin}zodiac-auto-carousel.html'`
        },
        {
            title: 'โพสต์ Facebook',
            desc: 'ร่างข้อความ & แคปชั่นอัตโนมัติ',
            icon: 'fab fa-facebook',
            badge: 'ข้อความ',
            color: '#3b82f6',
            category: 'zodiac',
            action: `window.location.href='${pAdmin}facebook-post.html'`
        },

        // Category: special (ไพ่, สายมู, เลขเด็ด & PDF)
        {
            title: 'รายงาน PDF (VIP)',
            desc: 'วิเคราะห์ดวงฉบับสมบูรณ์',
            icon: 'fas fa-file-pdf',
            badge: 'VIP Report',
            color: '#60a5fa',
            category: 'special',
            action: `window.location.href='${pAdmin}vip-report.html'`
        },
        {
            title: 'ทำนายไพ่ยิปซี',
            desc: 'ระบบสุ่มวิเคราะห์ไพ่ทาโรต์',
            icon: 'fas fa-layer-group',
            badge: 'Tarot',
            color: '#a78bfa',
            category: 'special',
            action: `window.location.href='${pAdmin}tarot-reading.html'`
        },
        {
            title: 'ภาพไพ่ป๊อกทำนาย',
            desc: 'ไพ่ป๊อกทำนายดวง 1/3 ใบ',
            icon: 'fas fa-heart',
            badge: 'Cartomancy',
            color: '#f87171',
            category: 'special',
            action: `window.location.href='${pAdmin}cartomancy.html'`
        },
        {
            title: 'วอลเปเปอร์สายมู',
            desc: 'เครื่องรางมงคลจอมือถือ',
            icon: 'fas fa-mobile-alt',
            badge: 'Wallpaper',
            color: '#34d399',
            category: 'special',
            action: `window.location.href='${pAdmin}wallpaper-gen.html'`
        },
        {
            title: 'โพสต์เลขเด็ดทักษา',
            desc: 'คำนวณเลขมงคลประจำวัน',
            icon: 'fas fa-dice',
            badge: 'เลขมงคล',
            color: '#fde047',
            category: 'special',
            action: `window.location.href='${pAdmin}lotto-post.html'`
        }
    ];

    container.innerHTML = `
        <div class="admin-glass-card" style="padding: 18px 22px; border-radius: 16px; margin-bottom: 24px;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div class="d-flex align-items-center gap-2">
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:10px; background:rgba(245,158,11,0.15); color:#f59e0b; font-size:1.05rem;">
                        <i class="fas fa-wand-magic-sparkles"></i>
                    </span>
                    <div>
                        <h4 class="m-0 font-weight-bold" style="font-size: 1.05rem; letter-spacing: -0.3px; color: var(--text-main);">
                            ศูนย์รวมเครื่องมือสร้างสื่อ & คอนเทนต์ (Quick Tools)
                        </h4>
                        <span style="font-size: 0.78rem; color: var(--text-sub);">
                            เครื่องมือด่วน 4×4 จัดเป็นระเบียบ กะทัดรัด ไม่เปลืองพื้นที่
                        </span>
                    </div>
                </div>

                <!-- Filter Pills & Minimize Toggle -->
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="quick-tools-filter-group" style="display:inline-flex; background:var(--bg-card-inner); border:1px solid var(--border-color); padding:3px; border-radius:10px; gap:4px;">
                        <button type="button" class="qt-filter-btn active" onclick="filterQuickTools('all', this)">ทั้งหมด (${tools.length})</button>
                        <button type="button" class="qt-filter-btn" onclick="filterQuickTools('system', this)">ระบบสำนัก</button>
                        <button type="button" class="qt-filter-btn" onclick="filterQuickTools('graphic', this)">กราฟิกรายวัน</button>
                        <button type="button" class="qt-filter-btn" onclick="filterQuickTools('zodiac', this)">12 ราศี</button>
                        <button type="button" class="qt-filter-btn" onclick="filterQuickTools('special', this)">ไพ่ & มงคล</button>
                    </div>
                    
                    <button type="button" id="btnToggleQuickTools" onclick="toggleQuickToolsCollapse()" 
                            title="ย่อ/ขยายกล่องเครื่องมือ"
                            style="background:var(--bg-card-inner); border:1px solid var(--border-color); color:var(--text-sub); border-radius:8px; padding:6px 12px; font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fas fa-chevron-up" id="toggleQuickToolsIcon"></i>
                        <span id="toggleQuickToolsText">ย่อ</span>
                    </button>
                </div>
            </div>

            <!-- Compact 4x4 Grid Container -->
            <div id="quickToolsGrid" class="quick-tools-4x4-grid">
                ${tools.map(tool => `
                    <div class="qt-card-item" data-category="${tool.category}" onclick="${tool.action}">
                        <div class="qt-card-icon" style="color: ${tool.color}; background: ${tool.color}18; border: 1px solid ${tool.color}35;">
                            <i class="${tool.icon}"></i>
                        </div>
                        <div class="qt-card-body">
                            <div class="qt-card-title">${tool.title}</div>
                            <div class="qt-card-desc">${tool.desc}</div>
                        </div>
                        <span class="qt-card-badge">${tool.badge}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add filter logic to window
    window.filterQuickTools = function(cat, btn) {
        const buttons = document.querySelectorAll('.qt-filter-btn');
        buttons.forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        const items = document.querySelectorAll('.qt-card-item');
        items.forEach(item => {
            if (cat === 'all' || item.getAttribute('data-category') === cat) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    };

    // Add collapse toggle logic
    window.toggleQuickToolsCollapse = function() {
        const grid = document.getElementById('quickToolsGrid');
        const icon = document.getElementById('toggleQuickToolsIcon');
        const text = document.getElementById('toggleQuickToolsText');
        if (!grid) return;

        if (grid.style.display === 'none') {
            grid.style.display = 'grid';
            icon.className = 'fas fa-chevron-up';
            text.textContent = 'ย่อ';
        } else {
            grid.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
            text.textContent = 'ขยาย';
        }
    };
}
