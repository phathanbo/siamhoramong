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
    // 🎴 Master Hub: ศูนย์รวมศาสตร์ไพ่ ๔ สำนัก
    { id: 'tarotPage', title: '🃏 ศูนย์รวมศาสตร์ไพ่ ๔ สำนัก', desc: 'ไพ่ยิปซีเซลติกครอส, ไพ่พรหมญาณ ๖๙ ใบ, ไพ่ป๊อกโบราณ และเซียมซีเสี่ยงทาย', icon: 'fa-layer-group', color: '#ffd700', category: '⭐ ดูดวงและพยากรณ์ทั่วไป' },
    { id: 'prommayanPage', title: '🎴 ไพ่พรหมญาณ ๖๙ ใบ', desc: 'เปิดไพ่ ๑ ใบ, ๓ ใบ หรือผัง ๑๒ ภพภูมิ เจาะลึกชะตาชีวิต', icon: 'fa-sun', color: '#ffd700', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', url: 'pages/prommayan.html', isHubChild: true },
    { id: 'cartomancyPage', title: '🃏 ไพ่ป๊อกพยากรณ์', desc: 'เสี่ยงทายดวงรายวันด้วยศาสตร์ไพ่ป๊อกโบราณ ๓ ใบ', icon: 'fa-heart', color: '#e74c3c', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', isHubChild: true },
    { id: 'siamsiPage', title: '🎋 เซียมซีเสี่ยงทาย', desc: 'เซียมซีศักดิ์สิทธิ์ ๒๘ ใบพยากรณ์ พร้อมบทวิเคราะห์', icon: 'fa-drum', color: '#ffd700', category: '⭐ ดูดวงและพยากรณ์ทั่วไป', isHubChild: true },
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
    { id: 'dailyAstrologyCalendarSheet', title: '📜 แผ่นปฏิทินดวงรายวัน<br>(สไตล์สมุดจดดวง)', desc: 'สร้างภาพปฏิทินโหราศาสตร์ไทย จักรราศี สมผุสดาว และฤกษ์ยามรายวันแบบ HD', icon: 'fa-calendar-alt', color: '#f59e0b', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/thai-horoscope-pro.html?tab=suriyayatra' },
    { id: 'ayanamsaPage', title: 'ผูกดวงนิรายนะ', desc: 'คำนวณอายนางศะ ลาหิรี/สุริยยาตร์', icon: 'fa-star', color: '#f1c40f', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/ayanamsa.html' },
    { id: 'monthlyTransitPage', title: 'ดาวจรรายเดือน', desc: 'การโคจรย้ายราศีของดวงดาวประจำเดือน', icon: 'fa-globe', color: '#03a9f4', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/monthly-transit.html' },
    { id: 'taksaPage', title: 'ทักษาพยากรณ์<br>(ภูมิพยากรณ์ ๘ ทิศ)', desc: 'วิเคราะห์บริวาร-กาลกิณี ๘ ทิศ', icon: 'fa-compass', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'thaksaninesection', title: 'ทักษาพยากรณ์<br>(๙ ภูมิรายปี)', desc: 'ทักษาจร ๙ ภูมิ พร้อมพระเกตุคุ้มดวง', icon: 'fa-chart-line', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'planetRelationPage', title: 'คู่มิตร-คู่ศัตรู', desc: 'คัมภีร์คู่มิตร คู่ธาตุ คู่สมพล คู่ศัตรู', icon: 'fa-user-friends', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'chatraPage', title: 'ฉัตร ๓ ชั้น', desc: 'พยากรณ์เกณฑ์ดวงชะตาฉัตร ๓ ชั้นจร', icon: 'fa-tree', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'chatninePage', title: 'ฉัตร ๙ ชั้น', desc: 'ยันต์มหาฉัตร ๙ ชั้น คุ้มครองเกณฑ์อายุ', icon: 'fa-shield-alt', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'birthfortune', title: 'พยากรณ์วันเกิด', desc: 'โชคกำเนิด ๓ ตำรา และอาชีพถูกโฉลก', icon: 'fa-birthday-cake', color: '#d4af37', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    // 🔢 Master Hub: เลข ๗ ตัว Master Suite
    { id: 'sevenDigitsPage', title: '🔢 มหาทักษาสัตตเลข & ๗ ตัว Master Suite', desc: 'ผัง ๗ ตัว ๔ ฐาน, มหาทักษาสัตตเลข และเลข ๗ ตัวภาคพิสดาร ครบวงจร', icon: 'fa-layer-group', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'taksaSattalekPage', title: '📜 มหาทักษาสัตตเลข', desc: 'วิเคราะห์โครงดวงชะตาสัตตเลข ฐาน ๔ ฐาน ๙ และคำนวณกำลังดาวแบบบูรณาการ', icon: 'fa-gem', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/taksasattalek.html', isHubChild: true },
    { id: 'thaiHoraBookPage', title: '📘 ตำราโหราศาสตร์<br>(สิงห์โต สุริยาอารักษ์)', desc: 'คัมภีร์แม่บทโหราศาสตร์ไทยดั้งเดิม', icon: 'fa-book', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/horasat.html' },
    { id: 'waentaHoraPage', title: '🔮 คัมภีร์แว่นตาโหร<br>(พยากรณ์ชะตาชีวิต)', desc: 'ตำราแว่นตาโหรโบราณ วัน-เดือน-ปีเกิด มหาทักษาเสวยอายุ ยามตรีเนตร์ และพิธีสะเดาะเคราะห์', icon: 'fa-glasses', color: '#67e8f9', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/waenta-hora.html' },
    { id: 'kalachakraWiphakPage', title: '📜 ตำรากาลจักรจรวิภาค<br>(ตัวเสวย-ตัวแทรก)', desc: 'วิเคราะห์วิถีจร ๔ จัตวาราศี ตัวเสวย ตัวแทรก อายุชำระ และเกณฑ์ฆาต (พ.ต. หลวงวุฒิรณพัสดุ์)', icon: 'fa-dharmachakra', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/kalachakra-wiphak.html' },
    { id: 'sevenDigitsPisadanPage', title: '✨ เลข ๗ ตัว ภาคพิสดาร', desc: 'คัมภีร์วิธีดูหมอเลข ๗ ตัว ภาคพิสดาร ผัง ๔ ฐาน ยามอัฏฐกาล ลัคนา และการทายจร ๔ จุด', icon: 'fa-feather-alt', color: '#f59e0b', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว', url: 'pages/seven-digits-pisadan.html', isHubChild: true },
    { id: 'twelveHousesPage', title: '🏛️ ๑๒ ภพเรือนชะตา', desc: 'ความหมายและดาวครองภพ ตนุ ถึง วินาศ', icon: 'fa-th', color: '#ffd700', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },
    { id: 'dashaPage', title: '🪐 ทศาดาว', desc: 'ช่วงเวลาที่ดาวแต่ละดวงเสวยอายุ', icon: 'fa-satellite', color: '#ce93d8', category: '📜 โหราศาสตร์ไทยและเลข 7 ตัว' },

    // 📅 ฤกษ์ยามและวันมงคล - Master Hub
    { id: 'auspiciousPage', title: '📅 ปฏิทิน ๑๐๐ ปี & ศูนย์รวมฤกษ์ยาม', desc: 'ปฏิทิน ๑๐๐ ปี, ยามอุบากอง, ฤกษ์ยาม ๗ เจ้า, ข้อห้ามประจำวัน, กาลโยค และแผนที่ฤกษ์', icon: 'fa-calendar-alt', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'personalizedAuspiciousPage', title: 'ฤกษ์มงคล<br>เฉพาะบุคคล', desc: 'คำนวณฤกษ์เฉพาะดวงชะตาบุคคล', icon: 'fa-calendar-alt', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล', action: 'initPersonalizedAuspicious()' },
    { id: 'auspicious-day', title: 'วันมงคลประจำเดือน', desc: 'วันธงชัย วันอธิบดี และดิถีมงคล', icon: 'fa-calendar-day', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'ubakong-yarm', title: '🧭 ยามอุบากอง', desc: 'ยามเดินทางและกาลโยคปลอดภัย ผังยาม ๕ ช่วงเวลา', icon: 'fa-clock', color: '#ffd700', category: '📅 ฤกษ์ยามและวันมงคล', isHubChild: true },
    { id: 'dailyTabooPage', title: '🚫 ข้อห้ามประจำวัน', desc: 'วันอุบาทว์ วันโลกาวินาศ กิจควรทำ-พึงเลี่ยง และทิศมงคล', icon: 'fa-ban', color: '#ffd700', category: '📅 ฤกษ์ยามและวันมงคล', isHubChild: true },
    { id: 'kaliyokepage', title: '⏰ คำนวณกาลโยค', desc: 'เกณฑ์กาลโยคประจำปีตามคัมภีร์สุริยยาตร์ ธงชัย อธิบดี', icon: 'fa-hourglass-half', color: '#ffd700', category: '📅 ฤกษ์ยามและวันมงคล', isHubChild: true },
    { id: 'reuxpage', title: 'คำนวณฤกษ์อายุ', desc: 'วิเคราะห์เกณฑ์ฤกษ์ตามช่วงอายุย่าง', icon: 'fa-tree', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'dailyHighlightPage', title: '🗺️ แผนที่ฤกษ์รายวัน', desc: 'สรุปเวลาฤกษ์ดีรายชั่วโมงตลอด ๒๔ ชั่วโมง', icon: 'fa-calendar-alt', color: '#ffd700', category: '📅 ฤกษ์ยามและวันมงคล', isHubChild: true },
    { id: 'lunarSection', title: 'คำนวณจันทรคติ', desc: 'ปฏิทินข้างขึ้น ข้างแรม และวันพระ', icon: 'fa-moon', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'fengShuiPage', title: '🧭 ปฏิทินฮวงจุ้ย<br>(ทิศมงคล)', desc: 'ทิศโชคลาภ ทิศอสูร และทิศมงคลประจำวัน', icon: 'fa-compass', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'auspiciousOpening', title: '🏠 วันเปิดร้าน<br>/ลงหลัก', desc: 'ฤกษ์เปิดกิจการ ขึ้นบ้านใหม่ ลงเสาเอก', icon: 'fa-store', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'ceremonyDate', title: '💍 กำหนดวัน<br>ประกอบพิธี', desc: 'ฤกษ์มงคลสมรส บวช และพิธีกรรม', icon: 'fa-ring', color: '#d4af37', category: '📅 ฤกษ์ยามและวันมงคล' },
    { id: 'planetaryHoursPage', title: '🌟 ฤกษ์ยาม ๗ เจ้า', desc: 'ยามดาวครองชั่วโมงประจำวัน ตามโหราศาสตร์คัลเดีย-ไทย', icon: 'fa-clock', color: '#f1c40f', category: '📅 ฤกษ์ยามและวันมงคล', isHubChild: true },
    { id: 'ditheePage', title: '🌙 ดิถีพยากรณ์', desc: 'พยากรณ์ความสำเร็จตามดิถีพระจันทร์', icon: 'fa-moon', color: '#90caf9', category: '📅 ฤกษ์ยามและวันมงคล' },

    // 💖 Master Hub: ศูนย์รวมความรัก & คู่สมพงษ์
    { id: 'compatibilityPage', title: '💖 ศูนย์รวมความรัก & คู่สมพงษ์', desc: 'สมพงศ์ธาตุ-ปีเกิด, ผูกดวงคู่ VIP, เกณฑ์สมพงศ์นาคราช, ทิศพบเนื้อคู่ และสมพงศ์มหาสมบัติ', icon: 'fa-heart', color: '#e74c3c', category: '💖 ความรักและสมพงศ์' },
    { id: 'deepSynastryPage', title: '💖 ผูกดวงคู่สมพงษ์ VIP', desc: 'เปรียบเทียบองศาดาว ๒ ชะตาแบบละเอียด วิเคราะห์ความสัมพันธ์เชิงลึก', icon: 'fa-heartbeat', color: '#e74c3c', category: '💖 ความรักและสมพงศ์', isHubChild: true },
    { id: 'marriage-compatibility', title: '💍 เกณฑ์สมพงศ์นาคราช', desc: 'เกณฑ์สมพงศ์นาคราชและคู่ครองเนื้อแท้ วิเคราะห์ตามตำราพรหมชาติ', icon: 'fa-ring', color: '#ffd700', category: '💖 ความรักและสมพงศ์', isHubChild: true },
    { id: 'soulmate-direction', title: '🧭 ทิศมงคลพบเนื้อคู่', desc: 'ทิศมงคลที่พบคู่ครองและคนอุปถัมภ์ เสริมเสน่ห์และวาสนา', icon: 'fa-compass', color: '#ffd700', category: '💖 ความรักและสมพงศ์', isHubChild: true },
    { id: 'sompong-wealth', title: '💰 สมพงศ์มหาสมบัติ', desc: 'ตรวจสมพงศ์ด้านการทำธุรกิจ หุ้นส่วน และร่วมกันสร้างทรัพย์สิน', icon: 'fa-coins', color: '#ffd700', category: '💖 ความรักและสมพงศ์', isHubChild: true },

    // 🔤 ชื่อและเลขศาสตร์
    { id: 'chaldeanNumerologyPage', title: '📜 คัมภีร์ปูมโหรโบราณ<br>(รหัสลับจากตัวเลข)', desc: 'ถอดรหัสลับแคลเดียนโบราณ กฎเหล็ก ๘ ข้อ รหัสกรรม ๑–๕๒ และกฎแห่งกรรม', icon: 'fa-scroll', color: '#f59e0b', category: '🔤 ชื่อและเลขศาสตร์', url: 'pages/chaldean-numerology.html' },
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
        // กรองเฉพาะเมนูที่ไม่ใช่การ์ดย่อยที่ถูกรวมเข้า Hub แล้ว (isHubChild) เพื่อความสะอาดและไม่ซ้ำซ้อน
        const items = APP_MENU.filter(item => item.category === cat.name && !item.isHubChild);
        if (items.length === 0) return;

        // หัวข้อหมวดหมู่
        html += `
            <div class="col-12 mt-3 mb-2 text-left w-100">
                <div class="d-flex align-items-center gap-2" style="border-bottom: 1px solid rgba(255, 215, 0, 0.15); padding-bottom: 8px;">
                    <span style="display:inline-block; width: 6px; height: 16px; background: ${cat.color}; border-radius: 4px;"></span>
                    <h5 style="color: #f1d06e; font-weight: 600; font-size: 1.1rem; margin: 0; letter-spacing: 0.3px;">
                        ${cat.name}
                    </h5>
                </div>
            </div>
        `;

        // ปุ่มเมนูในหมวดหมู่
        items.forEach((item) => {
            const hasAccess = (typeof window.hasPackagePermission === 'function') ? window.hasPackagePermission(item.id) : true;
            
            let lockedOverlay = '';
            if (!hasAccess) {
                lockedOverlay = `
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(8, 12, 24, 0.85); border-radius: 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2; backdrop-filter: blur(4px);">
                        <i class="fas fa-lock" style="color: #d4af37; font-size: 1.3rem; margin-bottom: 4px;"></i>
                        <span style="color: #cbd5e1; font-size: 0.72rem; font-weight: 600; text-align: center; padding: 0 4px; line-height: 1.2;">อัพเกรดสมาชิก</span>
                    </div>
                `;
            }
            
            const targetAction = hasAccess ? (item.url || '') : 'package';
            
            html += `
                <div class="col-6 col-md-4 col-lg-3 mb-3" style="animation: fadeIn 0.4s ease ${globalDelay * 0.04}s both; position: relative;">
                    <div class="dashboard-card"
                         id="menu-card-${item.id}"
                         data-menu-id="${item.id}"
                         style="cursor:pointer; position: relative; height: 100%;"
                         onclick="handleMenuCardClick('${item.id}', '${targetAction}')">
                        
                        ${lockedOverlay}

                        <div class="card-icon-wrapper" style="${!hasAccess ? 'opacity:0.35;' : ''}">
                            <i class="fas ${item.icon}" style="color: ${item.color};"></i>
                        </div>

                        <div class="card-body text-center px-1 py-2" style="${!hasAccess ? 'opacity:0.35;' : ''}">
                            <h6 class="card-title fw-bold mb-1">${item.title}</h6>
                            ${item.desc ? `<p class="card-desc text-white-50 mb-0">${item.desc}</p>` : ''}
                        </div>

                        <div class="card-shine"></div>
                    </div>
                </div>
            `;
            globalDelay++;
        });
    });

    menuGrid.innerHTML = html;

    // เพิ่ม CSS สำหรับ dashboard cards แบบ Sleek Modern Glass
    if (!document.getElementById('dashboardStyles')) {
        const style = document.createElement('style');
        style.id = 'dashboardStyles';
        style.textContent = '.dashboard-card {' +
            'background: linear-gradient(145deg, rgba(23, 28, 48, 0.7) 0%, rgba(13, 17, 34, 0.85) 100%) !important;' +
            'border: 1px solid rgba(255, 255, 255, 0.1) !important;' +
            'border-radius: 14px;' +
            'padding: 14px 12px;' +
            'height: 100%;' +
            'position: relative;' +
            'overflow: hidden;' +
            'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;' +
            'backdrop-filter: blur(16px);' +
            '-webkit-backdrop-filter: blur(16px);' +
            'transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);' +
            '}' +
            '.dashboard-card:hover {' +
            'transform: translateY(-4px);' +
            'border-color: rgba(241, 208, 110, 0.5) !important;' +
            'box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 18px rgba(241, 208, 110, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;' +
            'background: linear-gradient(145deg, rgba(30, 38, 66, 0.85) 0%, rgba(18, 23, 44, 0.95) 100%) !important;' +
            '}' +
            '.card-icon-wrapper {' +
            'font-size: 1.6rem;' +
            'margin: 0 auto 10px auto;' +
            'display: flex;' +
            'justify-content: center;' +
            'align-items: center;' +
            'width: 48px;' +
            'height: 48px;' +
            'background: rgba(255, 255, 255, 0.04);' +
            'border: 1px solid rgba(255, 255, 255, 0.12);' +
            'border-radius: 12px;' +
            'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);' +
            'transition: all 0.25s ease;' +
            '}' +
            '.dashboard-card:hover .card-icon-wrapper { transform: scale(1.08); border-color: rgba(241, 208, 110, 0.6); box-shadow: 0 0 14px rgba(241, 208, 110, 0.35); }' +
            '.dashboard-card .card-title {' +
            'color: #f1f5f9 !important;' +
            'font-size: 0.88rem !important;' +
            'font-weight: 600 !important;' +
            'letter-spacing: 0.2px;' +
            'line-height: 1.35 !important;' +
            'margin: 0 0 4px 0;' +
            '}' +
            '.dashboard-card:hover .card-title {' +
            'color: #ffd700 !important;' +
            '}' +
            '.dashboard-card .card-desc {' +
            'font-size: 0.72rem !important;' +
            'line-height: 1.25 !important;' +
            'color: #94a3b8 !important;' +
            '}' +
            '.card-shine {' +
            'position: absolute;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: radial-gradient(circle at 50% 0%, rgba(241, 208, 110, 0.15) 0%, transparent 60%);' +
            'pointer-events: none;' +
            'opacity: 0;' +
            'transition: opacity 0.25s;' +
            '}' +
            '.dashboard-card:hover .card-shine { opacity: 1; }' +
            '@keyframes fadeIn {' +
            'from { opacity: 0; transform: translateY(14px); }' +
            'to { opacity: 1; transform: translateY(0); }' +
            '}' +
            '@keyframes cardGlowPulse {' +
            '0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 215, 0, 0); border-color: rgba(241, 208, 110, 0.35); }' +
            '50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); border-color: #ffd700; }' +
            '100% { transform: scale(1); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35); border-color: rgba(241, 208, 110, 0.35); }' +
            '}' +
            '.menu-card-highlight {' +
            'animation: cardGlowPulse 1.8s ease-out !important;' +
            'z-index: 10 !important;' +
            '}' +
            '@media (max-width: 767px) {' +
            '.dashboard-card { padding: 12px 8px; border-radius: 12px; }' +
            '.card-icon-wrapper { width: 40px; height: 40px; font-size: 1.3rem; margin-bottom: 6px; border-radius: 10px; }' +
            '.dashboard-card .card-title { font-size: 0.82rem !important; }' +
            '.dashboard-card .card-desc { font-size: 0.68rem !important; }' +
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