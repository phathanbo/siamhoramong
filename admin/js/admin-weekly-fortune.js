/**
 * adminWeeklyFortune.js
 * ระบบสร้างภาพสรุปดวงรายวัน/รายสัปดาห์ (Auto) อิงตามตำราในระบบ
 */

function openWeeklyFortuneModal_impl() {
    // ลบอันเก่าทิ้งถ้ามี
    const existing = document.getElementById('weeklyFortuneModal');
    if (existing) existing.remove();

    const todayStr = new Date().toISOString().split('T')[0];

    const html = `
    <div id="weeklyFortuneModal" class="admin-modal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
        <div class="admin-modal-content" style="max-width: 1200px; width: 95%; padding: 0; display: flex; flex-direction: column; max-height: 95vh; overflow: hidden; background: #fdfdfd; color: #333; border-radius: 20px;">
            <div class="modal-header d-flex justify-content-between align-items-center" style="padding: 20px 30px; border-bottom: 1px solid #eee; background: #fff;">
                <h3 class="m-0 text-dark"><i class="fas fa-magic text-warning mr-2"></i>สร้างภาพดวงอัตโนมัติ</h3>
                <span class="close-modal" onclick="closeWeeklyFortuneModal()" style="font-size: 1.5rem; cursor: pointer; color: #888;">&times;</span>
            </div>
            
            <div style="display: flex; flex: 1; overflow: hidden;">
                <!-- ซ้าย: การตั้งค่า -->
                <div style="flex: 0 0 350px; padding: 25px; background: #f8f9fa; border-right: 1px solid #eee; overflow-y: auto;">
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">📅 เลือกวันที่:</label>
                        <input type="date" id="wfDate" class="form-control" value="${todayStr}" onchange="renderWeeklyFortunePreview()">
                    </div>
                    
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">✨ รูปแบบวันมงคลสูงสุด (ซ้ายบน):</label>
                        <select id="wfBestDay" class="form-control" onchange="renderWeeklyFortunePreview()">
                            <option value="auto">คำนวณอัตโนมัติ (ธงชัย/อธิบดี)</option>
                            <option value="sun">วันอาทิตย์</option>
                            <option value="mon">วันจันทร์</option>
                            <option value="tue">วันอังคาร</option>
                            <option value="wed">วันพุธ</option>
                            <option value="thu">วันพฤหัสบดี</option>
                            <option value="fri">วันศุกร์</option>
                            <option value="sat">วันเสาร์</option>
                        </select>
                    </div>

                    <div class="form-group mb-4">
                        <label class="font-weight-bold">⚠️ วันที่ต้องระวัง (ขวาบน):</label>
                        <select id="wfBadDay" class="form-control" onchange="renderWeeklyFortunePreview()">
                            <option value="auto">คำนวณอัตโนมัติ (อุบาทว์/โลกาวินาศ)</option>
                            <option value="sun">วันอาทิตย์</option>
                            <option value="mon">วันจันทร์</option>
                            <option value="tue">วันอังคาร</option>
                            <option value="wed">วันพุธ</option>
                            <option value="thu">วันพฤหัสบดี</option>
                            <option value="fri">วันศุกร์</option>
                            <option value="sat">วันเสาร์</option>
                        </select>
                    </div>
                    
                    <hr>
                    <button class="btn btn-warning btn-block font-weight-bold py-3 mt-4" style="border-radius: 10px;" onclick="downloadWeeklyFortuneImage()">
                        <i class="fas fa-download mr-2"></i> ดาวน์โหลดรูปภาพ
                    </button>
                    <p class="text-muted small mt-3 text-center">ภาพจะถูกบันทึกเป็นไฟล์ PNG ความละเอียดสูง</p>
                </div>

                <!-- ขวา: Preview -->
                <div style="flex: 1; padding: 20px; background: #e9ecef; overflow-y: auto; display: flex; justify-content: center; align-items: flex-start;">
                    <div id="wfPreviewArea" style="width: 1200px; transform-origin: top center; transform: scale(0.65); box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
                        <!-- Template จะถูกวาดที่นี่ -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    
    // วาด Preview ครั้งแรก
    setTimeout(renderWeeklyFortunePreview, 100);
}

function closeWeeklyFortuneModal() {
    const modal = document.getElementById('weeklyFortuneModal');
    if (modal) modal.remove();
}

const WF_DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const WF_DAY_COLORS = ['#e74c3c', '#f1c40f', '#e91e63', '#2ecc71', '#ff9800', '#3498db', '#9b59b6'];

// ลำดับทักษา ๘ ดวง (อาทิตย์(1) -> จันทร์(2) -> อังคาร(3) -> พุธ(4) -> เสาร์(7) -> พฤหัสบดี(5) -> ราหู(8) -> ศุกร์(6))
const WF_THAKSA_ORDER = [1, 2, 3, 4, 7, 5, 8, 6];
const WF_THAKSA_NAMES = ['บริวาร', 'อายุ', 'เดช', 'ศรี', 'มูละ', 'อุตสาหะ', 'มนตรี', 'กาลกิณี'];
const WF_DAY_PLANET_MAP = [1, 2, 3, 4, 5, 6, 7];

// ดาวคู่มิตร คู่ศัตรู คู่สมพล คู่ธาตุ จากตำรามหาทักษาปกรณ์
const WF_PLANET_RELATIONS = {
    partners: { '1': '5', '2': '4', '3': '6', '4': '2', '5': '1', '6': '3', '7': '8', '8': '7' },
    enemies: { '1': '3', '2': '5', '3': '1', '4': '8', '5': '2', '6': '7', '7': '6', '8': '4' },
    somphon: { '1': '6', '2': '8', '3': '5', '4': '7', '5': '3', '6': '1', '7': '4', '8': '2' },
    elements: { '1': '7', '2': '5', '3': '8', '4': '6', '5': '2', '6': '4', '7': '1', '8': '3' }
};

// สีมงคลและสีกาลกิณีตามกำลังดาวทักษาปกรณ์แท้
const WF_PLANET_LUCKY_COLORS = {
    1: 'แดง/แสด',
    2: 'ขาว/เหลืองนวล',
    3: 'ชมพู',
    4: 'เขียว',
    5: 'ส้ม/ทอง',
    6: 'ฟ้า/น้ำเงิน',
    7: 'ม่วง/ดำ',
    8: 'เทา/ควันบุหรี่'
};

/**
 * คำนวณอิทธิพลของวันจรที่มีต่อคนเกิดวันนั้น ๆ ตามหลักมหาทักษาพยากรณ์และสัมพันธ์ดวงดาว 100%
 * @param {number} birthDayIdx วันเกิดของบุคคล (0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์)
 * @param {Date} targetDateObj วันที่ดูคำทำนาย
 */
function getDailyInfluenceForBirthDay(birthDayIdx, targetDateObj) {
    const targetDayIdx = targetDateObj.getDay();
    const birthPlanet = WF_DAY_PLANET_MAP[birthDayIdx];
    const currentPlanet = WF_DAY_PLANET_MAP[targetDayIdx];

    // คำนวณภูมิเสวยของวันนี้ตามทักษาจร
    const bStartIdx = WF_THAKSA_ORDER.indexOf(birthPlanet);
    const curIdx = WF_THAKSA_ORDER.indexOf(currentPlanet);
    const diff = (curIdx - bStartIdx + 8) % 8;
    const thaksaName = WF_THAKSA_NAMES[diff];

    // ดาวศรี (โชคลาภ) และดาวกาลกิณี (ห้าม) ประจำวันเกิด
    const sriLord = WF_THAKSA_ORDER[(bStartIdx + 3) % 8];
    const kalaLord = WF_THAKSA_ORDER[(bStartIdx + 7) % 8];

    // ตรวจสอบสัมพันธ์คู่ดาว
    const bpStr = String(birthPlanet);
    const cpStr = String(currentPlanet);
    let relationBadge = '';

    if (birthPlanet === currentPlanet) {
        relationBadge = '⭐ วันตรงวันเกิด (กำลังดาวทับ)';
    } else if (WF_PLANET_RELATIONS.partners[bpStr] === cpStr) {
        relationBadge = '🌟 วันคู่มิตร (เกื้อหนุนโชคลาภ)';
    } else if (WF_PLANET_RELATIONS.somphon[bpStr] === cpStr) {
        relationBadge = '⚡ วันคู่สมพล (บารมีก้าวหน้า)';
    } else if (WF_PLANET_RELATIONS.elements[bpStr] === cpStr) {
        relationBadge = '🔥 วันคู่ธาตุ (มั่นคงสำเร็จ)';
    } else if (WF_PLANET_RELATIONS.enemies[bpStr] === cpStr) {
        relationBadge = '⚠️ วันคู่ศัตรู (ระวังขัดแย้ง)';
    }

    let statusTitle = '';
    let goodTip = '';
    let badTip = '';

    if (thaksaName === 'ศรี') {
        statusTitle = '✨ ภูมิศรีจร (มหาโชคลาภ)';
        goodTip = 'การเงินคล่องตัว มีโชคลาภ เจรจาค้าขายสำเร็จ';
        badTip = 'ระวังการใช้จ่ายเพลิดเพลินเกินงบประมาณ';
    } else if (thaksaName === 'มนตรี') {
        statusTitle = '👑 ภูมิมนตรีจร (ผู้ใหญ่อุปถัมภ์)';
        goodTip = 'ผู้ใหญ่เมตตา เข้าพบเจรจาขอความช่วยเหลือได้ดี';
        badTip = 'หลีกเลี่ยงความดื้อรั้น ไม่รับฟังความคิดเห็น';
    } else if (thaksaName === 'เดช') {
        statusTitle = '💪 ภูมิเดชจร (อำนาจบารมี)';
        goodTip = 'การตัดสินใจเด็ดขาด เป็นผู้นำ สอบแข่งขันโดดเด่น';
        badTip = 'ระวังคำพูดตรงเกินไป หรือการใช้อารมณ์ตัดสิน';
    } else if (thaksaName === 'มูละ') {
        statusTitle = '🏡 ภูมิมูละจร (ทรัพย์สินมั่นคง)';
        goodTip = 'การเงินมั่นคง วางแผนระยะยาว ติดต่อเรื่องบ้านที่ดินดี';
        badTip = 'อย่าเพิ่งรีบร้อนลงทุนในสิ่งที่มีความเสี่ยงสูง';
    } else if (thaksaName === 'อายุ') {
        statusTitle = '🌿 ภูมิกายาอายุจร (สุขภาพราบรื่น)';
        goodTip = 'ร่างกายฟื้นฟู สุขภาพดี เหมาะทำบุญสร้างกุศล';
        badTip = 'ระวังอาหารการกินและโรคประจำตัวกำเริบ';
    } else if (thaksaName === 'บริวาร') {
        statusTitle = '👥 ภูมิบริวารจร (มิตรภาพและทีม)';
        goodTip = 'เพื่อนฝูงช่วยเหลือ ทีมงานร่วมใจ สังสรรค์ราบรื่น';
        badTip = 'ระวังบริวารหรือคนใกล้ชิดนำเรื่องยุ่งยากมาให้';
    } else if (thaksaName === 'อุตสาหะ') {
        statusTitle = '🔨 ภูมิอุตสาหะจร (สำเร็จด้วยเพียร)';
        goodTip = 'ลุยงานหนัก สะสางงานคั่งค้าง สำเร็จด้วยความตั้งใจ';
        badTip = 'ระวังความเครียดสะสมหรือทำงานหนักเกินกำลัง';
    } else if (thaksaName === 'กาลกิณี') {
        statusTitle = '🛑 ภูมิกาลกิณีจร (ชะลอความเสี่ยง)';
        goodTip = 'มีสติตรวจทานงานสองเท่า สวดมนต์ปล่อยสัตว์เสริมดวง';
        badTip = 'เลี่ยงเซ็นสัญญาสำคัญ การปะทะ และงดสีกาลกิณี';
    }

    return {
        birthDayIdx,
        birthDayName: 'คนเกิดวัน' + WF_DAY_NAMES[birthDayIdx],
        thaksaName,
        statusTitle,
        relationBadge: relationBadge || statusTitle,
        goodTip,
        badTip,
        luckyColor: WF_PLANET_LUCKY_COLORS[sriLord] || '-',
        kalaColor: WF_PLANET_LUCKY_COLORS[kalaLord] || '-'
    };
}

// Theme definitions
const WF_THEMES = {
    royal: {
        bg: '#140c26',
        bgImage: '../assets/thai_astrology_bg.png',
        bgOverlay: 'rgba(18, 10, 35, 0.82)',
        outerBorder: '#d4af37',
        innerBorder: 'rgba(212, 175, 55, 0.5)',
        titleColor: '#ffe58f',
        dateColor: '#ffd700',
        ribbonBg: 'linear-gradient(135deg, #d4af37, #aa7c11)',
        ribbonText: '#140c26',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(212, 175, 55, 0.35)',
        cardShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
        dayNameColor: '#ffffff',
        goodLabel: '#68d391',
        goodVal: '#ffffff',
        badLabel: '#fc8181',
        badVal: '#fbd38d',
        colorLabel: '#90cdf4',
        colorVal: '#e2e8f0',
        centerTextColor: '#e2e8f0',
        watermarkColor: '#d4af37',
        circleInnerBg: 'rgba(20, 12, 38, 0.95)',
        circleTitleColor: '#ffffff'
    },
    astronomy: {
        bg: '#0a0d24',
        bgImage: '../assets/zodiac_bg.png',
        bgOverlay: 'rgba(8, 12, 32, 0.85)',
        outerBorder: '#70a1ff',
        innerBorder: 'rgba(112, 161, 255, 0.5)',
        titleColor: '#e0e7ff',
        dateColor: '#ffd32a',
        ribbonBg: 'linear-gradient(135deg, #4834d4, #686de0)',
        ribbonText: '#ffffff',
        cardBg: 'rgba(18, 26, 60, 0.65)',
        cardBorder: 'rgba(112, 161, 255, 0.35)',
        cardShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        dayNameColor: '#ffffff',
        goodLabel: '#4cd137',
        goodVal: '#f5f6fa',
        badLabel: '#ff6b81',
        badVal: '#fed330',
        colorLabel: '#70a1ff',
        colorVal: '#dcdde1',
        centerTextColor: '#ced6e0',
        watermarkColor: '#70a1ff',
        circleInnerBg: 'rgba(10, 15, 40, 0.95)',
        circleTitleColor: '#ffffff'
    },
    modern_dark: {
        bg: '#111116',
        bgImage: '',
        bgOverlay: 'rgba(17, 17, 22, 1)',
        outerBorder: '#d4af37',
        innerBorder: 'rgba(212, 175, 55, 0.3)',
        titleColor: '#f5f5f7',
        dateColor: '#ffd700',
        ribbonBg: 'linear-gradient(135deg, #2c2c34, #1a1a20)',
        ribbonText: '#ffd700',
        cardBg: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        cardShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
        dayNameColor: '#ffffff',
        goodLabel: '#48bb78',
        goodVal: '#edf2f7',
        badLabel: '#f56565',
        badVal: '#feebc8',
        colorLabel: '#cbd5e0',
        colorVal: '#e2e8f0',
        centerTextColor: '#a0aec0',
        watermarkColor: '#a0aec0',
        circleInnerBg: 'rgba(24, 24, 30, 0.95)',
        circleTitleColor: '#ffffff'
    },
    light: {
        bg: '#fbf9f5',
        bgImage: '',
        bgOverlay: 'rgba(251, 249, 245, 1)',
        outerBorder: '#d4af37',
        innerBorder: 'rgba(212, 175, 55, 0.4)',
        titleColor: '#2d3748',
        dateColor: '#b7791f',
        ribbonBg: 'linear-gradient(135deg, #d4af37, #f6e05e)',
        ribbonText: '#1a202c',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(212, 175, 55, 0.3)',
        cardShadow: '0 8px 20px rgba(180, 150, 80, 0.15)',
        dayNameColor: '#1a202c',
        goodLabel: '#2f855a',
        goodVal: '#2d3748',
        badLabel: '#c53030',
        badVal: '#9b2c2c',
        colorLabel: '#4a5568',
        colorVal: '#2d3748',
        centerTextColor: '#4a5568',
        watermarkColor: '#a0aec0',
        circleInnerBg: '#ffffff',
        circleTitleColor: '#2d3748'
    }
};

function renderWeeklyFortunePreview() {
    const area = document.getElementById('wfPreviewArea');
    if (!area) return;

    const dateStr = document.getElementById('wfDate').value;
    const dateObj = new Date(dateStr);
    
    const dayNameStr = WF_DAY_NAMES[dateObj.getDay()];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateTitle = dateObj.toLocaleDateString('th-TH', options);

    const themeKey = (document.getElementById('wfTheme') && document.getElementById('wfTheme').value) || 'royal';
    const theme = WF_THEMES[themeKey] || WF_THEMES.royal;

    // ดึงข้อมูล 7 วันเกิด (อิงตามหลักมหาทักษาพยากรณ์และดาวจรแท้ 100%)
    let daysHtml = '';
    
    for (let i = 0; i < 7; i++) {
        const inf = getDailyInfluenceForBirthDay(i, dateObj);

        daysHtml += `
            <div style="flex: 1; min-width: 0; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 16px; padding: 14px 6px; margin: 0 4px; box-shadow: ${theme.cardShadow}; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div style="width: 52px; height: 52px; border-radius: 50%; background: ${WF_DAY_COLORS[i]}; border: 3px solid rgba(255,255,255,0.9); box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; font-family: 'Prompt', sans-serif;">${WF_DAY_NAMES[i].substring(0,1)}</span>
                </div>
                <div style="color: ${theme.dayNameColor}; font-weight: 700; font-size: 15px; margin-bottom: 4px; font-family: 'Prompt', sans-serif;">${inf.birthDayName}</div>
                <div style="font-size: 11px; font-weight: 600; color: #f1c40f; background: rgba(241, 196, 15, 0.15); border: 1px solid rgba(241, 196, 15, 0.3); border-radius: 12px; padding: 2px 6px; margin-bottom: 8px; width: 92%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${inf.relationBadge}">${inf.relationBadge}</div>
                
                <div style="font-size: 11.5px; line-height: 1.4; width: 100%; display: flex; flex-direction: column; gap: 5px;">
                    <div style="background: rgba(46, 204, 113, 0.12); padding: 5px 5px; border-radius: 8px; border: 1px solid rgba(46, 204, 113, 0.25);">
                        <div style="color: ${theme.goodLabel}; font-weight: 700; font-size: 11px;">✨ จุดเด่นวันนี้</div>
                        <div style="color: ${theme.goodVal}; font-weight: 500; margin-top: 1px; word-break: break-word; font-size: 11px;">${inf.goodTip}</div>
                    </div>
                    <div style="background: rgba(231, 76, 60, 0.12); padding: 5px 5px; border-radius: 8px; border: 1px solid rgba(231, 76, 60, 0.25);">
                        <div style="color: ${theme.badLabel}; font-weight: 700; font-size: 11px;">⚠️ ข้อควรระวัง</div>
                        <div style="color: ${theme.badVal}; font-weight: 500; margin-top: 1px; word-break: break-word; font-size: 11px;">${inf.badTip}</div>
                    </div>
                    <div style="background: rgba(212, 175, 55, 0.12); padding: 5px 5px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.25);">
                        <div style="color: ${theme.colorLabel}; font-weight: 700; font-size: 11px;">🎨 สีมงคล / ⛔ ห้าม</div>
                        <div style="color: ${theme.colorVal}; font-weight: 600; margin-top: 1px; font-size: 11px;">
                            <span style="color:#2ecc71;">${inf.luckyColor}</span> / <span style="color:#e74c3c;">${inf.kalaColor}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let bestDayText = "คำนวณอัตโนมัติ";
    let badDayText = "คำนวณอัตโนมัติ";

    if (typeof calculateKalaYok === 'function') {
        const kala = calculateKalaYok(dateObj);
        const dayNamesMap = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        
        const bestSelect = document.getElementById('wfBestDay') ? document.getElementById('wfBestDay').value : 'auto';
        const badSelect = document.getElementById('wfBadDay') ? document.getElementById('wfBadDay').value : 'auto';

        if (bestSelect === 'auto') {
            bestDayText = `${dayNamesMap[kala.thongChai]} (ธงชัย)<br>${dayNamesMap[kala.athibadi]} (อธิบดี)`;
        } else {
            const selectMap = { sun: "วันอาทิตย์", mon: "วันจันทร์", tue: "วันอังคาร", wed: "วันพุธ", thu: "วันพฤหัสบดี", fri: "วันศุกร์", sat: "วันเสาร์" };
            bestDayText = selectMap[bestSelect] || "วันอาทิตย์";
        }

        if (badSelect === 'auto') {
            badDayText = `${dayNamesMap[kala.ubart]} (อุบาทว์)<br>${dayNamesMap[kala.lokawinat]} (โลกาวินาศ)`;
        } else {
            const selectMap = { sun: "วันอาทิตย์", mon: "วันจันทร์", tue: "วันอังคาร", wed: "วันพุธ", thu: "วันพฤหัสบดี", fri: "วันศุกร์", sat: "วันเสาร์" };
            badDayText = selectMap[badSelect] || "วันเสาร์";
        }
    }

    const bgImageLayer = theme.bgImage ? `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('${theme.bgImage}') center/cover no-repeat; opacity: 0.55; pointer-events: none;"></div>
    ` : `
        <!-- Luxury Gradient Mesh Background -->
        <div style="position: absolute; top: -150px; left: -150px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0) 70%); pointer-events: none;"></div>
        <div style="position: absolute; bottom: -150px; right: -150px; width: 650px; height: 650px; border-radius: 50%; background: radial-gradient(circle, rgba(142, 68, 173, 0.22) 0%, rgba(142, 68, 173, 0) 70%); pointer-events: none;"></div>
    `;

    area.innerHTML = `
        <div id="wfCaptureArea" style="background: ${theme.bg}; width: 1200px; height: 800px; position: relative; font-family: 'Sarabun', sans-serif; overflow: hidden; box-sizing: border-box; box-shadow: 0 25px 60px rgba(0,0,0,0.5);">
            <!-- Background Image & Overlay -->
            ${bgImageLayer}
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${theme.bgOverlay}; pointer-events: none;"></div>

            <!-- Outer Gold Border -->
            <div style="position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 3px solid ${theme.outerBorder}; border-radius: 12px; pointer-events: none;"></div>
            <!-- Inner Ornate Dashed Border -->
            <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1.5px dashed ${theme.innerBorder}; border-radius: 8px; pointer-events: none;"></div>

            <!-- Corner Accents -->
            <div style="position: absolute; top: 25px; left: 30px; color: ${theme.outerBorder}; font-size: 18px; opacity: 0.8;">✦</div>
            <div style="position: absolute; top: 25px; right: 30px; color: ${theme.outerBorder}; font-size: 18px; opacity: 0.8;">✦</div>
            <div style="position: absolute; bottom: 25px; left: 30px; color: ${theme.outerBorder}; font-size: 18px; opacity: 0.8;">✦</div>
            <div style="position: absolute; bottom: 25px; right: 30px; color: ${theme.outerBorder}; font-size: 18px; opacity: 0.8;">✦</div>

            <!-- Content Area -->
            <div style="position: relative; z-index: 5; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 35px 40px 25px;">
                
                <!-- Header -->
                <div style="text-align: center;">
                    <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                        <span style="color: ${theme.outerBorder}; font-size: 20px;">✦</span>
                        <h1 style="color: ${theme.titleColor}; font-size: 42px; font-weight: 700; font-family: 'Prompt', sans-serif; margin: 0; letter-spacing: 1px; text-shadow: 0 3px 12px rgba(0,0,0,0.6);">เช็กดวงรายวัน มหาทักษาพยากรณ์</h1>
                        <span style="color: ${theme.outerBorder}; font-size: 20px;">✦</span>
                    </div>
                    
                    <h2 style="color: ${theme.dateColor}; font-size: 34px; font-weight: 600; font-family: 'Prompt', sans-serif; margin: 4px 0 14px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">วัน${dayNameStr}ที่ ${dateTitle}</h2>
                    
                    <div style="display: inline-block; background: ${theme.ribbonBg}; color: ${theme.ribbonText}; padding: 6px 28px; border-radius: 25px; font-size: 18px; font-weight: 700; font-family: 'Prompt', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.3); letter-spacing: 0.5px;">
                        ✨ เกณฑ์ดวงและเคล็ดลับมงคลสำหรับคนเกิดทั้ง 7 วัน ✨
                    </div>
                </div>

                <!-- Middle Highlight Section -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 30px; margin: 10px 0;">
                    
                    <!-- วันมงคลสูงสุด Badge -->
                    <div style="width: 220px; height: 155px; border-radius: 20px; background: linear-gradient(135deg, #f1c40f, #e67e22); padding: 3px; box-shadow: 0 10px 25px rgba(241, 196, 15, 0.35);">
                        <div style="background: ${theme.circleInnerBg}; width: 100%; height: 100%; border-radius: 17px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 12px; box-sizing: border-box;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <i class="fas fa-crown" style="color: #f1c40f; font-size: 20px;"></i>
                                <span style="font-size: 17px; font-weight: 700; color: ${theme.circleTitleColor}; font-family: 'Prompt', sans-serif;">วันมงคลสูงสุด</span>
                            </div>
                            <div style="font-size: 12px; color: ${theme.watermarkColor}; font-weight: 500; margin-bottom: 6px;">(เกณฑ์ธงชัย / อธิบดี)</div>
                            <div style="font-size: 15px; color: #f1c40f; font-weight: 700; line-height: 1.35; font-family: 'Prompt', sans-serif;">${bestDayText}</div>
                        </div>
                    </div>

                    <!-- Center Text Banner -->
                    <div style="flex: 1; background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder}; border-radius: 18px; padding: 18px 25px; box-shadow: ${theme.cardShadow}; backdrop-filter: blur(10px); text-align: center;">
                        <p style="margin: 0; font-size: 18px; color: ${theme.centerTextColor}; line-height: 1.65; font-weight: 500;">
                            🔮 อิทธิพลของวัน${dayNameStr}ที่มีต่อดวงชะตาคนเกิดทั้ง 7 วัน คำนวณตามหลักมหาทักษาและดาวสัมพันธ์โบราณ พร้อมจุดเด่น ข้อควรระวัง และสีมงคลประจำตัว
                        </p>
                    </div>

                    <!-- วันที่ต้องระวัง Badge -->
                    <div style="width: 220px; height: 155px; border-radius: 20px; background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 3px; box-shadow: 0 10px 25px rgba(231, 76, 60, 0.35);">
                        <div style="background: ${theme.circleInnerBg}; width: 100%; height: 100%; border-radius: 17px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 12px; box-sizing: border-box;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <i class="fas fa-exclamation-triangle" style="color: #e74c3c; font-size: 19px;"></i>
                                <span style="font-size: 17px; font-weight: 700; color: ${theme.circleTitleColor}; font-family: 'Prompt', sans-serif;">วันที่ต้องระวัง</span>
                            </div>
                            <div style="font-size: 12px; color: #ff7675; font-weight: 500; margin-bottom: 6px;">(เกณฑ์อุบาทว์ / โลกาวินาศ)</div>
                            <div style="font-size: 15px; color: #ff7675; font-weight: 700; line-height: 1.35; font-family: 'Prompt', sans-serif;">${badDayText}</div>
                        </div>
                    </div>
                </div>

                <!-- 7 Days Grid -->
                <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 5px;">
                    ${daysHtml}
                </div>

                <!-- Footer Bar -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid ${theme.innerBorder};">
                    <div style="font-size: 14px; color: ${theme.centerTextColor}; opacity: 0.85;">
                        <i class="fas fa-star" style="color: ${theme.outerBorder}; font-size: 12px; margin-right: 5px;"></i>
                        ศาสตร์การพยากรณ์โบราณมหาทักษา &bull; Siam Hora Mangala
                    </div>
                    <div style="font-size: 16px; color: ${theme.watermarkColor}; font-weight: 700; font-family: 'Prompt', sans-serif; display: flex; align-items: center; gap: 8px;">
                        <span>🔮 สยามโหรามงคล</span>
                    </div>
                </div>

            </div>
        </div>
    `;

    if (typeof resizeCapturePreview === 'function') {
        resizeCapturePreview();
    }
}

async function downloadWeeklyFortuneImage() {
    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กำลังเรนเดอร์ภาพความละเอียดสูง กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        await document.fonts.ready;
        
        const canvasWidth = 1200;
        const canvasHeight = 800;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        const dateStr = document.getElementById('wfDate').value;
        const dateObj = new Date(dateStr);
        const dayNameStr = WF_DAY_NAMES[dateObj.getDay()];
        const dateTitle = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

        const themeKey = (document.getElementById('wfTheme') && document.getElementById('wfTheme').value) || 'royal';
        const theme = WF_THEMES[themeKey] || WF_THEMES.royal;

        // 1. Draw Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Load background image if specified
        if (theme.bgImage) {
            try {
                const bgImg = new Image();
                bgImg.src = theme.bgImage;
                await new Promise((resolve) => {
                    bgImg.onload = () => {
                        ctx.save();
                        ctx.globalAlpha = 0.55;
                        ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
                        ctx.restore();
                        resolve();
                    };
                    bgImg.onerror = () => resolve();
                });
            } catch(e) {
                console.warn('BG Image load error:', e);
            }
        } else {
            // Elegant background radial highlights
            const radGrad1 = ctx.createRadialGradient(100, 100, 10, 100, 100, 450);
            radGrad1.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
            radGrad1.addColorStop(1, 'rgba(212, 175, 55, 0)');
            ctx.fillStyle = radGrad1;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const radGrad2 = ctx.createRadialGradient(canvasWidth - 100, canvasHeight - 100, 10, canvasWidth - 100, canvasHeight - 100, 500);
            radGrad2.addColorStop(0, 'rgba(142, 68, 173, 0.22)');
            radGrad2.addColorStop(1, 'rgba(142, 68, 173, 0)');
            ctx.fillStyle = radGrad2;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Overlay tint
        ctx.fillStyle = theme.bgOverlay;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. Borders
        // Outer border
        ctx.save();
        ctx.strokeStyle = theme.outerBorder;
        ctx.lineWidth = 3;
        drawRoundedRect(ctx, 12, 12, canvasWidth - 24, canvasHeight - 24, 12, null, { width: 3, color: theme.outerBorder });
        
        // Inner dashed border
        ctx.setLineDash([8, 8]);
        drawRoundedRect(ctx, 20, 20, canvasWidth - 40, canvasHeight - 40, 8, null, { width: 1.5, color: theme.innerBorder });
        ctx.setLineDash([]);
        ctx.restore();

        // Corner accents
        ctx.fillStyle = theme.outerBorder;
        ctx.font = '18px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✦', 35, 38);
        ctx.fillText('✦', canvasWidth - 35, 38);
        ctx.fillText('✦', 35, canvasHeight - 30);
        ctx.fillText('✦', canvasWidth - 35, canvasHeight - 30);

        // 3. Header Section
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.titleColor;
        ctx.font = 'bold 36px "Prompt", sans-serif';
        ctx.fillText('เช็กดวงรายวัน มหาทักษาพยากรณ์', canvasWidth / 2, 68);

        ctx.fillStyle = theme.dateColor;
        ctx.font = '600 28px "Prompt", sans-serif';
        ctx.fillText(`วัน${dayNameStr}ที่ ${dateTitle}`, canvasWidth / 2, 110);

        // Ribbon Banner
        const ribbonText = '✨ เกณฑ์ดวงและเคล็ดลับมงคลสำหรับคนเกิดทั้ง 7 วัน ✨';
        ctx.font = 'bold 16px "Prompt", sans-serif';
        const ribbonW = ctx.measureText(ribbonText).width + 60;
        const ribbonH = 34;
        const ribbonX = (canvasWidth - ribbonW) / 2;
        const ribbonY = 126;

        let ribbonGrad = theme.ribbonBg;
        if (themeKey === 'royal') {
            ribbonGrad = ctx.createLinearGradient(ribbonX, ribbonY, ribbonX + ribbonW, ribbonY + ribbonH);
            ribbonGrad.addColorStop(0, '#d4af37');
            ribbonGrad.addColorStop(1, '#aa7c11');
        } else if (themeKey === 'astronomy') {
            ribbonGrad = ctx.createLinearGradient(ribbonX, ribbonY, ribbonX + ribbonW, ribbonY + ribbonH);
            ribbonGrad.addColorStop(0, '#4834d4');
            ribbonGrad.addColorStop(1, '#686de0');
        } else if (themeKey === 'light') {
            ribbonGrad = ctx.createLinearGradient(ribbonX, ribbonY, ribbonX + ribbonW, ribbonY + ribbonH);
            ribbonGrad.addColorStop(0, '#d4af37');
            ribbonGrad.addColorStop(1, '#f6e05e');
        } else {
            ribbonGrad = '#2c2c34';
        }

        drawRoundedRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 17, ribbonGrad, { width: 1, color: 'rgba(255,255,255,0.3)' }, { blur: 12, color: 'rgba(0,0,0,0.3)' });
        ctx.fillStyle = theme.ribbonText;
        ctx.font = 'bold 16px "Prompt", sans-serif';
        ctx.fillText(ribbonText, canvasWidth / 2, ribbonY + 23);

        // 4. Middle Highlight Section
        let bestDay1 = "คำนวณอัตโนมัติ";
        let bestDay2 = "";
        let badDay1 = "คำนวณอัตโนมัติ";
        let badDay2 = "";

        if (typeof calculateKalaYok === 'function') {
            const kala = calculateKalaYok(dateObj);
            const dayNamesMap = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
            
            const bestSelect = document.getElementById('wfBestDay') ? document.getElementById('wfBestDay').value : 'auto';
            const badSelect = document.getElementById('wfBadDay') ? document.getElementById('wfBadDay').value : 'auto';

            if (bestSelect === 'auto') {
                bestDay1 = `${dayNamesMap[kala.thongChai]} (ธงชัย)`;
                bestDay2 = `${dayNamesMap[kala.athibadi]} (อธิบดี)`;
            } else {
                const selectMap = { sun: "วันอาทิตย์", mon: "วันจันทร์", tue: "วันอังคาร", wed: "วันพุธ", thu: "วันพฤหัสบดี", fri: "วันศุกร์", sat: "วันเสาร์" };
                bestDay1 = selectMap[bestSelect] || "วันอาทิตย์";
            }

            if (badSelect === 'auto') {
                badDay1 = `${dayNamesMap[kala.ubart]} (อุบาทว์)`;
                badDay2 = `${dayNamesMap[kala.lokawinat]} (โลกาวินาศ)`;
            } else {
                const selectMap = { sun: "วันอาทิตย์", mon: "วันจันทร์", tue: "วันอังคาร", wed: "วันพุธ", thu: "วันพฤหัสบดี", fri: "วันศุกร์", sat: "วันเสาร์" };
                badDay1 = selectMap[badSelect] || "วันเสาร์";
            }
        }

        const midY = 180;
        const midH = 145;

        // Left Highlight Card (วันมงคลสูงสุด)
        const bestGrad = ctx.createLinearGradient(40, midY, 260, midY + midH);
        bestGrad.addColorStop(0, '#f1c40f');
        bestGrad.addColorStop(1, '#e67e22');
        drawRoundedRect(ctx, 40, midY, 220, midH, 20, bestGrad, null, { blur: 16, color: 'rgba(241, 196, 15, 0.35)' });
        drawRoundedRect(ctx, 43, midY + 3, 214, midH - 6, 17, theme.circleInnerBg);

        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 17px "Prompt", sans-serif';
        ctx.fillText('👑 วันมงคลสูงสุด', 150, midY + 35);
        ctx.fillStyle = theme.watermarkColor;
        ctx.font = '12px "Prompt", sans-serif';
        ctx.fillText('(เกณฑ์ธงชัย / อธิบดี)', 150, midY + 56);
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 15px "Prompt", sans-serif';
        ctx.fillText(bestDay1, 150, midY + 90);
        if (bestDay2) {
            ctx.fillText(bestDay2, 150, midY + 115);
        }

        // Center Text Card
        const centerCardX = 280;
        const centerCardW = canvasWidth - 560; // 640px
        drawRoundedRect(ctx, centerCardX, midY, centerCardW, midH, 18, theme.cardBg, { width: 1, color: theme.cardBorder }, { blur: 14, color: 'rgba(0,0,0,0.4)' });

        ctx.fillStyle = theme.centerTextColor;
        ctx.font = '500 18px "Sarabun", sans-serif';
        const centerTxt = `🔮 อิทธิพลของวัน${dayNameStr}ที่มีต่อดวงชะตาคนเกิดทั้ง 7 วัน คำนวณตามหลักมหาทักษาและดาวสัมพันธ์โบราณ พร้อมจุดเด่น ข้อควรระวัง และสีมงคลประจำตัว`;
        wrapText(ctx, centerTxt, centerCardX + centerCardW / 2, midY + 55, centerCardW - 60, 30);

        // Right Highlight Card (วันที่ต้องระวัง)
        const rightCardX = canvasWidth - 260;
        const badGrad = ctx.createLinearGradient(rightCardX, midY, rightCardX + 220, midY + midH);
        badGrad.addColorStop(0, '#e74c3c');
        badGrad.addColorStop(1, '#c0392b');
        drawRoundedRect(ctx, rightCardX, midY, 220, midH, 20, badGrad, null, { blur: 16, color: 'rgba(231, 76, 60, 0.35)' });
        drawRoundedRect(ctx, rightCardX + 3, midY + 3, 214, midH - 6, 17, theme.circleInnerBg);

        ctx.fillStyle = '#ff7675';
        ctx.font = 'bold 17px "Prompt", sans-serif';
        ctx.fillText('⚠️ วันที่ต้องระวัง', rightCardX + 110, midY + 35);
        ctx.fillStyle = '#ff7675';
        ctx.font = '12px "Prompt", sans-serif';
        ctx.fillText('(เกณฑ์อุบาทว์ / โลกาวินาศ)', rightCardX + 110, midY + 56);
        ctx.fillStyle = '#ff7675';
        ctx.font = 'bold 15px "Prompt", sans-serif';
        ctx.fillText(badDay1, rightCardX + 110, midY + 90);
        if (badDay2) {
            ctx.fillText(badDay2, rightCardX + 110, midY + 115);
        }

        // 5. 7 Days Grid Cards
        const gridY = 350;
        const cardH = 375;
        const totalPadding = 70;
        const gap = 10;
        const totalGap = gap * 6;
        const cardW = (canvasWidth - totalPadding - totalGap) / 7; // ~152px
        const startX = 35;

        for (let i = 0; i < 7; i++) {
            const inf = getDailyInfluenceForBirthDay(i, dateObj);

            const cardX = startX + i * (cardW + gap);
            const cx = cardX + cardW / 2;

            // Draw Card Background
            drawRoundedRect(ctx, cardX, gridY, cardW, cardH, 16, theme.cardBg, { width: 1, color: theme.cardBorder }, { blur: 12, color: 'rgba(0,0,0,0.35)' });

            // Day Icon Circle
            const iconY = gridY + 36;
            ctx.beginPath();
            ctx.arc(cx, iconY, 25, 0, Math.PI * 2);
            ctx.fillStyle = WF_DAY_COLORS[i];
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Letter
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 19px "Prompt", sans-serif';
            ctx.fillText(WF_DAY_NAMES[i].substring(0, 1), cx, iconY + 7);

            // Day Name
            ctx.fillStyle = theme.dayNameColor;
            ctx.font = 'bold 15px "Prompt", sans-serif';
            ctx.fillText(inf.birthDayName, cx, gridY + 84);

            // Relation Badge Pill
            const relPillW = cardW - 14;
            const relLeft = cardX + 7;
            drawRoundedRect(ctx, relLeft, gridY + 94, relPillW, 24, 12, 'rgba(241, 196, 15, 0.15)', { width: 1, color: 'rgba(241, 196, 15, 0.35)' });
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 11px "Prompt", sans-serif';
            ctx.fillText(inf.relationBadge, cx, gridY + 110);

            // Inner Pills / Sections
            const pillW = cardW - 12;
            const innerLeft = cardX + 6;

            // จุดเด่น Pill
            const gPillY = gridY + 126;
            const gPillH = 76;
            drawRoundedRect(ctx, innerLeft, gPillY, pillW, gPillH, 8, 'rgba(46, 204, 113, 0.12)', { width: 1, color: 'rgba(46, 204, 113, 0.3)' });
            ctx.fillStyle = theme.goodLabel;
            ctx.font = 'bold 11px "Prompt", sans-serif';
            ctx.fillText('✨ จุดเด่นวันนี้', cx, gPillY + 17);
            ctx.fillStyle = theme.goodVal;
            ctx.font = '500 11.5px "Sarabun", sans-serif';
            wrapText(ctx, inf.goodTip, cx, gPillY + 36, pillW - 8, 16);

            // ระวัง Pill
            const bPillY = gPillY + gPillH + 6;
            const bPillH = 76;
            drawRoundedRect(ctx, innerLeft, bPillY, pillW, bPillH, 8, 'rgba(231, 76, 60, 0.12)', { width: 1, color: 'rgba(231, 76, 60, 0.3)' });
            ctx.fillStyle = theme.badLabel;
            ctx.font = 'bold 11px "Prompt", sans-serif';
            ctx.fillText('⚠️ ข้อควรระวัง', cx, bPillY + 17);
            ctx.fillStyle = theme.badVal;
            ctx.font = '500 11.5px "Sarabun", sans-serif';
            wrapText(ctx, inf.badTip, cx, bPillY + 36, pillW - 8, 16);

            // สีมงคล Pill
            const cPillY = bPillY + bPillH + 6;
            const cPillH = 68;
            drawRoundedRect(ctx, innerLeft, cPillY, pillW, cPillH, 8, 'rgba(212, 175, 55, 0.12)', { width: 1, color: 'rgba(212, 175, 55, 0.3)' });
            ctx.fillStyle = theme.colorLabel;
            ctx.font = 'bold 11px "Prompt", sans-serif';
            ctx.fillText('🎨 สีมงคล / ⛔ ห้าม', cx, cPillY + 17);
            ctx.font = 'bold 12px "Sarabun", sans-serif';
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(inf.luckyColor, cx, cPillY + 36);
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 11.5px "Sarabun", sans-serif';
            ctx.fillText(`เลี่ยง: ${inf.kalaColor}`, cx, cPillY + 54);
        }

        // 6. Footer Divider & Watermark
        const footerY = 746;
        ctx.strokeStyle = theme.innerBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(35, footerY);
        ctx.lineTo(canvasWidth - 35, footerY);
        ctx.stroke();

        ctx.fillStyle = theme.centerTextColor;
        ctx.font = '500 13px "Sarabun", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('✦ ศาสตร์การพยากรณ์โบราณมหาทักษา • Siam Hora Mangala', 40, footerY + 26);

        ctx.fillStyle = theme.watermarkColor;
        ctx.font = 'bold 17px "Prompt", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('🔮 สยามโหรามงคล', canvasWidth - 45, footerY + 25);

        // Convert to download
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `SiamHora_Daily_${document.getElementById('wfDate').value}_${themeKey}.png`;
        link.href = imgData;
        link.click();
        
        Swal.fire({
            icon: 'success',
            title: 'สร้างรูปภาพสำเร็จ!',
            text: 'ดาวน์โหลดภาพดวงรายวันความละเอียดสูงเรียบร้อยแล้ว',
            confirmButtonColor: '#d4af37'
        });
    } catch (error) {
        console.error(error);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้: ' + (error.message || error), 'error');
    }
}
