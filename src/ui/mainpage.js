"use strict";

const APP_MENU = [
    { id: 'todayDashboard', title: '✨ สรุปดวงวันนี้<br>(Dashboard)', desc: 'รวมผลทำนายดวงชะตารายวันของคุณ', icon: 'fa-sun', color: '#f1c40f', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'promchartsection', title: 'วงล้อพยากรณ์', desc: 'ทำนายดวงชะตารอบทิศ ๑๒ ราศี', icon: 'fa-chart-pie', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'zodiacdetailsection', title: 'ตำราพรหมชาติ', desc: 'พยากรณ์ตามตำราพรหมชาติโบราณ', icon: 'fa-smile', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'daily-horoscope', title: 'ลักษณะผู้เกิดทั้ง 7 วัน', desc: 'วิเคราะห์อุปนิสัยและชะตาตามวันเกิด', icon: 'fa-calendar-alt', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'showdaylife', title: 'คำนวณวันเกิด', desc: 'คำนวณวัน-เวลาเกิดและอายุย่าง', icon: 'fa-birthday-cake', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'businessFortune', title: '💼 พยากรณ์ธุรกิจ<br>/การเงิน', desc: 'ชี้ทิศทางการค้า การลงทุน และโชคลาภ', icon: 'fa-chart-line', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'zodiacFortunePage', title: '⭐ พยากรณ์ดวง<br>ตามราศี', desc: 'ดูดวง ๑๒ ราศีประจำสัปดาห์/เดือน', icon: 'fa-star', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'twelveZodiacFortunePage', title: '♈ คำพยากรณ์<br>๑๒ ราศีเจาะลึก', desc: 'วิเคราะห์พื้นดวง การงาน การเงิน ความรัก สุขภาพ และเคล็ดเสริมดวง', icon: 'fa-star-and-crescent', color: '#ffd700', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', url: 'pages/twelve-zodiac-fortune.html' },
    { id: 'dreamPage', title: 'ทำนายฝัน', desc: 'ตีความหมายความฝันและเลขนำโชค', icon: 'fa-moon', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'tarotPage', title: 'ไพ่ยิปซี<br>เซลติกครอส', desc: 'เปิดไพ่ทาโรต์ ๑๐ ใบ วิเคราะห์ลึกซึ้ง', icon: 'fa-layer-group', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'cartomancyPage', title: 'ไพ่ป๊อกรายวัน', desc: 'เสี่ยงทายดวงรายวันด้วยศาสตร์ไพ่ป๊อก', icon: 'fa-heart', color: '#e74c3c', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'siamsiPage', title: 'เซียมซีเสี่ยงทาย', desc: 'เซียมซีศักดิ์สิทธิ์ ๒๘ ใบพยากรณ์', icon: 'fa-drum', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'lottoPage', title: 'เลขเด็ด', desc: 'เลขมงคลและเลขเด่นประจำวัน', icon: 'fa-dice', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'weeklyColorSection', title: 'สีมงคลประจำปี', desc: 'ตารางสีเสื้อมงคลเสริมเสน่ห์/โชคลาภ', icon: 'fa-palette', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'elementManualPage', title: 'ธาตุประจำวันเกิด', desc: 'คู่มือธาตุกำเนิดและการเสริมธาตุ', icon: 'fa-fire-alt', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'patient-prognosis', title: 'ทำนายชะตาผู้ป่วย', desc: 'ดูเกณฑ์โรคภัยและทิศทางสุขภาพ', icon: 'fa-procedures', color: '#d4af37', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'lifeExtensionPage', title: 'ต่อชะตา', desc: 'พิธีต่ออายุและสะเดาะเคราะห์ตามตำรา', icon: 'fa-fire', color: '#ff9800', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'chantPage', title: '🕉️ บทสวดมนต์<br>เสริมดวงชะตา', desc: 'บทสวดบูชาเทวดานพเคราะห์ประจำวัน', icon: 'fa-praying-hands', color: '#ffd700', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', action: 'showChantPage()' },
    { id: 'chantLibraryPage', title: '📚 คลังบทสวดมนต์<br>(บาลี/แปลไทย)', desc: 'รวมบทสวดมนต์มงคลและพระปริตร', icon: 'fa-book-open', color: '#f1c40f', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', url: 'pages/chant-library.html' },
    { id: 'yearClashPage', title: '🐉 ปีชง–ปีเสริม', desc: 'ตรวจเกณฑ์ปีชงและวิธีแก้ชงเสริมดวง', icon: 'fa-dragon', color: '#e74c3c', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },

    // 📜 โหราศาสตร์ไทยและเลข 7 ตัว
    { id: 'siamHoramangkolPage', title: '🌟 สยามโหรามงคล<br>(ผังพยากรณ์ ๑๐ ขั้นตอน)', desc: 'ถอดรหัสวาสนา ๑๐ ขั้นตอน ๔ ระยะ สไตล์โหรสยามฯ', icon: 'fa-dharmachakra', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/siam-horamangkol.html' },
    { id: 'rattanakosinCityPage', title: '🏛️ ดวงชะตากรุงรัตนโกสินทร์<br>(ดวงเมือง ๒๓๒๕)', desc: 'วิเคราะห์ดวงเมือง ดาวจร ๒ ชั้น ชันษาเมือง และตรวจสมพงศ์ดวงชะตากับแผ่นดิน', icon: 'fa-landmark', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/rattanakosin-city-horoscope.html' },
    { id: 'thaiAstrology', title: '🔮 โหราศาสตร์ไทย<br>(ดาวเกิด & ๑๒ ภพ)', desc: 'วิเคราะห์ดาวประจำตัว ภพเรือน และฤกษ์เกิด', icon: 'fa-star', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },   
    { id: 'ascendantPage', title: 'คำนวณลัคนา', desc: 'หาลัคนาราศีเกิดตามเวลาตกฟาก', icon: 'fa-star-and-crescent', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'thaiAstrologyEngine', title: '🔮 ผูกดวงสมบูรณ์<br>(สมผุสดาวจริง)', desc: 'คำนวณตำแหน่งดาวจริงตามดาราศาสตร์', icon: 'fa-sun', color: '#F9E596', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/thai-astrology-engine.html' },
    { id: 'thaiHoroscopeProPage', title: '☸️ ราศีจักร-ทักษา-ตรีวัย<br>(ผูกดวงมืออาชีพ)', desc: 'ระบบผูกดวงโหราศาสตร์ไทยชั้นสูง', icon: 'fa-dharmachakra', color: '#ffb703', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/thai-horoscope-pro.html' },
    { id: 'ayanamsaPage', title: 'ผูกดวงนิรายนะ', desc: 'คำนวณอายนางศะ ลาหิรี/สุริยยาตร์', icon: 'fa-star', color: '#f1c40f', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/ayanamsa.html' },
    { id: 'monthlyTransitPage', title: 'ดาวจรรายเดือน', desc: 'การโคจรย้ายราศีของดวงดาวประจำเดือน', icon: 'fa-globe', color: '#03a9f4', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/monthly-transit.html' },
    { id: 'taksaPage', title: 'ทักษาพยากรณ์<br>(ภูมิพยากรณ์ ๘ ทิศ)', desc: 'วิเคราะห์บริวาร-กาลกิณี ๘ ทิศ', icon: 'fa-compass', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'thaksaninesection', title: 'ทักษาพยากรณ์<br>(๙ ภูมิรายปี)', desc: 'ทักษาจร ๙ ภูมิ พร้อมพระเกตุคุ้มดวง', icon: 'fa-chart-line', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'planetRelationPage', title: 'คู่มิตร-คู่ศัตรู', desc: 'คัมภีร์คู่มิตร คู่ธาตุ คู่สมพล คู่ศัตรู', icon: 'fa-user-friends', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'chatraPage', title: 'ฉัตร ๓ ชั้น', desc: 'พยากรณ์เกณฑ์ดวงชะตาฉัตร ๓ ชั้นจร', icon: 'fa-tree', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'chatninePage', title: 'ฉัตร ๙ ชั้น', desc: 'ยันต์มหาฉัตร ๙ ชั้น คุ้มครองเกณฑ์อายุ', icon: 'fa-shield-alt', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'birthfortune', title: 'พยากรณ์วันเกิด', desc: 'โชคกำเนิด ๓ ตำรา และอาชีพถูกโฉลก', icon: 'fa-birthday-cake', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'climate-section', title: 'เกณฑ์พิรุณศาสตร์<br>และชะตาโลก', desc: 'อธิบดีฝน ห่าฝน ๔ ภูมิภพ และนาคให้น้ำ', icon: 'fa-cloud-showers-heavy', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'sevenDigitsPage', title: '🔢 เลข ๗ ตัว ๔ ฐาน<br>(มหาคัมภีร์สัตตเลข)', desc: 'รวมผังตารางเลข ๗ ตัว ฐาน ๑-๔ และคำทำนายตำราโบราณครบวงจร', icon: 'fa-layer-group', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'taksaSattalekPage', title: '📜 คัมภีร์มหาทักษาสัตตเลข<br>(ฐาน ๔ ฐาน ๙)', desc: 'วิเคราะห์โครงดวงชะตาสัตตเลข ฐาน ๔ ฐาน ๙ และคำนวณกำลังดาวแบบบูรณาการ', icon: 'fa-gem', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/taksasattalek.html' },
    { id: 'thaiHoraBookPage', title: '📘 ตำราโหราศาสตร์<br>(สิงห์โต สุริยาอารักษ์)', desc: 'คัมภีร์แม่บทโหราศาสตร์ไทยดั้งเดิม', icon: 'fa-book', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/horasat.html' },
    { id: 'twelveHousesPage', title: '🏛️ ๑๒ ภพเรือนชะตา', desc: 'ความหมายและดาวครองภพ ตนุ ถึง วินาศ', icon: 'fa-th', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'dashaPage', title: '🪐 ทศาดาว', desc: 'ช่วงเวลาที่ดาวแต่ละดวงเสวยอายุ', icon: 'fa-satellite', color: '#ce93d8', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },

    // 📅 ฤกษ์ยามและวันมงคล
    { id: 'auspiciousPage', title: '📅 ปฏิทิน 100 ปี<br>& บันทึกดวง', desc: 'ปฏิทินสากล 100 ปี บันทึกโน้ต & ทำนายเฉพาะบุคคล', icon: 'fa-calendar-alt', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'personalizedAuspiciousPage', title: 'ฤกษ์มงคล<br>เฉพาะบุคคล', desc: 'คำนวณฤกษ์เฉพาะดวงชะตาบุคคล', icon: 'fa-calendar-alt', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล', action: 'initPersonalizedAuspicious()' },
    { id: 'auspicious-day', title: 'วันมงคลประจำเดือน', desc: 'วันธงชัย วันอธิบดี และดิถีมงคล', icon: 'fa-calendar-day', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'ubakong-yarm', title: 'ยามอุบากอง', desc: 'ยามเดินทางและกาลโยคปลอดภัย', icon: 'fa-clock', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'dailyTabooPage', title: 'ข้อห้ามประจำวัน', desc: 'วันอุบาทว์ วันโลกาวินาศ และข้อพึงระวัง', icon: 'fa-ban', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'kaliyokepage', title: 'คำนวณกาลโยค', desc: 'เกณฑ์กาลโยคประจำปีตามคัมภีร์สุริยยาตร์', icon: 'fa-hourglass-half', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'reuxpage', title: 'คำนวณฤกษ์อายุ', desc: 'วิเคราะห์เกณฑ์ฤกษ์ตามช่วงอายุย่าง', icon: 'fa-tree', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'dailyHighlightPage', title: 'แผนที่ฤกษ์มงคล<br>รายวัน', desc: 'สรุปเวลาฤกษ์ดีรายชั่วโมงตลอดวัน', icon: 'fa-calendar-alt', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'lunarSection', title: 'คำนวณจันทรคติ', desc: 'ปฏิทินข้างขึ้น ข้างแรม และวันพระ', icon: 'fa-moon', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'fengShuiPage', title: '🧭 ปฏิทินฮวงจุ้ย<br>(ทิศมงคล)', desc: 'ทิศโชคลาภ ทิศอสูร และทิศมงคลประจำวัน', icon: 'fa-compass', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'auspiciousOpening', title: '🏠 วันเปิดร้าน<br>/ลงหลัก', desc: 'ฤกษ์เปิดกิจการ ขึ้นบ้านใหม่ ลงเสาเอก', icon: 'fa-store', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'ceremonyDate', title: '💍 กำหนดวัน<br>ประกอบพิธี', desc: 'ฤกษ์มงคลสมรส บวช และพิธีกรรม', icon: 'fa-ring', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'planetaryHoursPage', title: '🌟 ฤกษ์ยาม ๗ เจ้า', desc: 'ยามดาวครองชั่วโมงประจำวัน', icon: 'fa-clock', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'ditheePage', title: '🌙 ดิถีพยากรณ์', desc: 'พยากรณ์ความสำเร็จตามดิถีพระจันทร์', icon: 'fa-moon', color: '#90caf9', category: '📅 ฤกษ์ยามและวันมงคล' },

    // 💖 ความรักและสมพงศ์
    { id: 'deepSynastryPage', title: 'VIP ผูกดวงคู่สมพงษ์', desc: 'เปรียบเทียบองศาดาว ๒ ชะตาแบบละเอียด', icon: 'fa-heartbeat', color: '#e74c3c', category: '💖 ความรักและสมพงศ์' },
    { id: 'compatibilityPage', title: 'เช็คดวงสมพงษ์', desc: 'ตรวจสมพงศ์ธาตุและปีนักษัตรคู่ครอง', icon: 'fa-heart', color: '#d4af37', category: '💖 ความรักและสมพงศ์' },
    { id: 'marriage-compatibility', title: 'หาคู่รักหรือคู่สมรส', desc: 'เกณฑ์สมพงศ์นาคราชและคู่ครองเนื้อแท้', icon: 'fa-ring', color: '#d4af37', category: '💖 ความรักและสมพงศ์' },
    { id: 'soulmate-direction', title: 'ทิศเนื้อคู่', desc: 'ทิศมงคลที่พบคู่ครองและคนอุปถัมภ์', icon: 'fa-compass', color: '#d4af37', category: '💖 ความรักและสมพงศ์' },
    { id: 'sompong-wealth', title: 'สมพงศ์มหาสมบัติ', desc: 'ตรวจสมพงศ์ด้านการทำธุรกิจและสร้างทรัพย์', icon: 'fa-coins', color: '#d4af37', category: '💖 ความรักและสมพงศ์' },

    // 🔤 ชื่อและเลขศาสตร์
    { id: 'nameAnalysisPage', title: 'วิเคราะห์ชื่อ', desc: 'ถอดรหัสชื่อตามหลักทักษาและเลขศาสตร์', icon: 'fa-signature', color: '#d4af37', category: '🔤 ชื่อและเลขศาสตร์' },
    { id: 'numerologyPage', title: 'เบอร์มงคล', desc: 'ทำนายคู่เลขเบอร์โทรศัพท์และทะเบียนรถ', icon: 'fa-mobile-alt', color: '#d4af37', category: '🔤 ชื่อและเลขศาสตร์' }
];

const UserProfile = {
    save: function() {
        // ดึงวันเกิดจาก form ใดก็ได้ที่มีค่า
        const raw = document.getElementById('birthdate')?.value ||
                    document.getElementById('birthDate')?.value || '';
        const birthTime = document.getElementById('birthtime')?.value ||
                          document.getElementById('birthTime')?.value || '';

        // บันทึกลง canonical key เสมอ
        if (raw && typeof birthdateToISO === 'function') {
            const iso = birthdateToISO(raw);
            if (iso) localStorage.setItem('userBirthdate', iso);
        }
        if (birthTime) localStorage.setItem('userBirthTime', birthTime);
    },
    load: function() {
        // อ่านจาก canonical key userBirthdate
        const iso = localStorage.getItem('userBirthdate');
        if (iso) {
            const display = typeof isoToDisplayDate === 'function' ? isoToDisplayDate(iso) : iso;
            $('.birth-date-input').val(display || iso);
            const parts = iso.split('-');
            if (parts.length === 3) {
                $('.birth-year-input').val(parts[0]);
                $('.birth-month-input').val(String(parseInt(parts[1])));
                $('.birth-day-input').val(String(parseInt(parts[2])));
            }
            const birthTime = localStorage.getItem('userBirthTime') || '';
            if (birthTime) $('.birth-time-input').val(birthTime);
            return { birthDate: iso, birthTime };
        }
        return null;
    }
};

function buildDashboard() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    const categories = [
        { name: '⭐ ดูดวงและพยากรณ์ทั่วไป', color: '#f1c40f' },
        { name: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', color: '#d4af37' },
        { name: '📅 ฤกษ์ยามและวันมงคล', color: '#2ecc71' },
        { name: '💖 ความรักและสมพงศ์', color: '#e74c3c' },
        { name: '🔤 ชื่อและเลขศาสตร์', color: '#3498db' },
        { name: '⚙️ ระบบและอื่นๆ', color: '#95a5a6' }
    ];

    let html = '';
    let globalDelay = 0;

    categories.forEach(cat => {
        const items = APP_MENU.filter(item => item.category === cat.name);
        if (items.length === 0) return;

        // หัวข้อหมวดหมู่
        html += `
            <div class="col-12 mt-4 mb-3 text-left w-100">
                <h4 style="color: var(--gold-lt, #F9E596); border-bottom: 1px dashed var(--border, rgba(212,175,55,0.3)); padding-bottom: 10px; font-weight: 600; font-size: 1.3rem; margin-top: 15px;">
                    ${cat.name}
                </h4>
            </div>
        `;

        // ปุ่มเมนูในหมวดหมู่
        items.forEach((item) => {
            const hasAccess = (typeof window.hasPackagePermission === 'function') ? window.hasPackagePermission(item.id) : true;
            
            let lockedOverlay = '';
            if (!hasAccess) {
                lockedOverlay = `
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); border-radius: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2; transition: all 0.3s ease;">
                        <i class="fas fa-lock" style="color: #d4af37; font-size: 2rem; margin-bottom: 5px;"></i>
                        <span style="color: #fff; font-size: 0.85rem; font-weight: bold; text-align: center; padding: 0 5px; line-height: 1.2;">อัพเกรดสมาชิก<br>เพื่อปลดล็อค</span>
                    </div>
                `;
            }
            
            const targetAction = hasAccess ? (item.url || '') : 'package';
            
            html += `
                <div class="col-6 col-md-4 col-lg-3 mb-4" style="animation: fadeIn 0.5s ease ${globalDelay * 0.05}s both; position: relative;">
                    <div class="dashboard-card"
                         id="menu-card-${item.id}"
                         data-menu-id="${item.id}"
                         style="cursor:pointer; position: relative; height: 100%;"
                         onclick="handleMenuCardClick('${item.id}', '${targetAction}')">
                        
                        ${lockedOverlay}

                        <div class="card-icon-wrapper" style="${!hasAccess ? 'opacity:0.4;' : ''}">
                            <i class="fas ${item.icon}" style="color: ${item.color};"></i>
                        </div>

                        <div class="card-body text-center px-2 py-3" style="${!hasAccess ? 'opacity:0.4;' : ''}">
                            <h6 class="card-title fw-bold mb-1" style="font-size: 1.02rem; color: #f1d06e;">${item.title}</h6>
                            ${item.desc ? `<p class="text-white-50 small mb-0" style="font-size: 0.78rem; line-height: 1.3;">${item.desc}</p>` : ''}
                        </div>

                        <div class="card-shine"></div>
                    </div>
                </div>
            `;
            globalDelay++;
        });
    });

    menuGrid.innerHTML = html;

    // เพิ่ม CSS สำหรับ dashboard cards
    if (!document.getElementById('dashboardStyles')) {
        const style = document.createElement('style');
        style.id = 'dashboardStyles';
        style.textContent = '.dashboard-card {' +
            'background: linear-gradient(135deg, rgba(35, 52, 88, 0.75) 0%, rgba(20, 32, 58, 0.85) 100%) !important;' +
            'border: 1px solid rgba(241, 208, 110, 0.35) !important;' +
            'border-radius: 20px;' +
            'padding: 22px 18px;' +
            'height: 100%;' +
            'position: relative;' +
            'overflow: hidden;' +
            'box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;' +
            'backdrop-filter: blur(20px);' +
            '-webkit-backdrop-filter: blur(20px);' +
            'transition: all 0.35s cubic-bezier(0.23, 1, 0.320, 1);' +
            '}' +
            '.dashboard-card:hover {' +
            'transform: translateY(-8px) scale(1.03);' +
            'border-color: rgba(255, 243, 176, 0.8) !important;' +
            'box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45), 0 0 25px rgba(241, 208, 110, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;' +
            'background: linear-gradient(135deg, rgba(45, 66, 110, 0.85) 0%, rgba(25, 40, 72, 0.9) 100%) !important;' +
            '}' +
            '.dashboard-card::before {' +
            'content: "";' +
            'position: absolute;' +
            'top: 0;' +
            'left: -100%;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);' +
            'transition: left 0.6s;' +
            '}' +
            '.dashboard-card:hover::before { left: 100%; }' +
            '.card-icon-wrapper {' +
            'font-size: 2.8rem;' +
            'margin-bottom: 15px;' +
            'display: flex;' +
            'justify-content: center;' +
            'align-items: center;' +
            'height: 70px;' +
            'background: radial-gradient(circle, rgba(241, 208, 110, 0.25) 0%, rgba(20, 32, 58, 0.5) 100%);' +
            'border: 1px solid rgba(241, 208, 110, 0.35);' +
            'border-radius: 18px;' +
            'box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);' +
            'transition: all 0.3s ease;' +
            '}' +
            '.dashboard-card:hover .card-icon-wrapper { transform: scale(1.15) rotate(4deg); border-color: #FFF0A8; box-shadow: 0 0 20px rgba(241, 208, 110, 0.5); }' +
            '.dashboard-card .card-title {' +
            'color: #FFFFFF !important;' +
            'background: none !important;' +
            '-webkit-text-fill-color: #FFFFFF !important;' +
            'font-size: 1.05rem !important;' +
            'font-weight: 600 !important;' +
            'letter-spacing: 0.3px;' +
            'text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7) !important;' +
            'line-height: 1.4 !important;' +
            'margin: 0;' +
            '}' +
            '.dashboard-card:hover .card-title {' +
            'color: #FFF0A8 !important;' +
            '-webkit-text-fill-color: #FFF0A8 !important;' +
            'text-shadow: 0 0 15px rgba(241, 208, 110, 0.8) !important;' +
            '}' +
            '.card-shine {' +
            'position: absolute;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: radial-gradient(circle at 20% 50%, rgba(241, 208, 110, 0.2) 0%, transparent 60%);' +
            'pointer-events: none;' +
            'opacity: 0;' +
            'transition: opacity 0.3s;' +
            '}' +
            '.dashboard-card:hover .card-shine { opacity: 1; }' +
            '@keyframes fadeIn {' +
            'from { opacity: 0; transform: translateY(20px); }' +
            'to { opacity: 1; transform: translateY(0); }' +
            '}' +
            '@keyframes cardGlowPulse {' +
            '0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 215, 0, 0); border-color: rgba(241, 208, 110, 0.35); }' +
            '50% { transform: scale(1.04); box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), inset 0 0 15px rgba(255, 215, 0, 0.4); border-color: #ffd700; }' +
            '100% { transform: scale(1); box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3); border-color: rgba(241, 208, 110, 0.35); }' +
            '}' +
            '.menu-card-highlight {' +
            'animation: cardGlowPulse 1.8s ease-out !important;' +
            'z-index: 10 !important;' +
            '}' +
            '@media (max-width: 767px) {' +
            '.dashboard-card { padding: 15px 12px; }' +
            '.card-icon-wrapper { font-size: 2.2rem; height: 60px; }' +
            '.dashboard-card .card-title { font-size: 0.95rem !important; }' +
            '}';
        document.head.appendChild(style);
    }
}

// 📌 ฟังก์ชันจัดการเมื่อคลิกเลือกการ์ดในห้องพยากรณ์
window.handleMenuCardClick = function(menuId, targetAction) {
    // บันทึก ID การ์ดล่าสุดและตำแหน่ง Scroll ลงใน SessionStorage
    sessionStorage.setItem('lastSelectedMenuId', menuId);
    sessionStorage.setItem('lastMainpageScrollY', window.scrollY.toString());

    // 🔒 ตรวจสอบสิทธิ์ซ้ำเพื่อความปลอดภัย 100%
    const hasAccess = (typeof window.hasPackagePermission === 'function') ? window.hasPackagePermission(menuId) : true;
    if (!hasAccess || targetAction === 'package') {
        navigateTo('package');
        return;
    }

    if (targetAction && targetAction.length > 0) {
        window.location.href = targetAction;
    } else {
        navigateTo(menuId);
    }
};

// 🎯 ฟังก์ชันเลื่อนหน้าจอกลับมาที่การ์ดที่เลือกล่าสุด
window.restoreMainpageLastPosition = function() {
    const lastId = sessionStorage.getItem('lastSelectedMenuId');
    if (!lastId) return;

    setTimeout(() => {
        const targetCard = document.getElementById('menu-card-' + lastId);
        if (targetCard && targetCard.offsetParent !== null) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.remove('menu-card-highlight');
            void targetCard.offsetWidth; // Trigger reflow
            targetCard.classList.add('menu-card-highlight');
            setTimeout(() => targetCard.classList.remove('menu-card-highlight'), 2200);
        } else {
            const scrollY = parseInt(sessionStorage.getItem('lastMainpageScrollY') || '0');
            if (scrollY > 0) {
                window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
        }
    }, 150);
};

if (typeof $ !== 'undefined') {
    $(document).ready(function () {
        buildDashboard();

        // แสดงหน้าหลักทันทีที่โหลดเสร็จ
        $('#mainpage').fadeIn();

        // ตรวจสอบว่ามีย้อนกลับมาหน้าหลักหรือไม่
        if (sessionStorage.getItem('lastSelectedMenuId')) {
            restoreMainpageLastPosition();
        }

        if (typeof updateNavYarm === 'function') {
            updateNavYarm();
            setInterval(updateNavYarm, 60000);
        }
    });
}