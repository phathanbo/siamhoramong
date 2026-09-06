/* ======================================================
   📅 ปฏิทินฤกษ์มงคล
====================================================== */

"use strict";

/* ======================================================
   แปลงปี พ.ศ. → จ.ศ.
====================================================== */

function convertToChulaSakarat(beYear) {
    return beYear - 1181
}

/* ======================================================
   ปีโหราศาสตร์ (เปลี่ยนกาลโยคหลังวันเถลิงศก 16 เมษายน)
====================================================== */
function getEffectiveAstroYear(date) {
    const y = date.getFullYear();
    const m = date.getMonth(); // 0 = มกราคม, 3 = เมษายน
    const d = date.getDate();

    const thaiYear = y + 543;

    // กาลโยคจะเปลี่ยนตามปีจุลศักราช (จ.ศ.) ซึ่งเปลี่ยนในวันเถลิงศก
    // โดยทั่วไปใช้มาตรฐานวันที่ 16 เมษายนของทุกปี
    if (m < 3 || (m === 3 && d < 16)) {
        return thaiYear - 1;
    }
    return thaiYear;
}

/* ======================================================
   คำนวณกาลโยค (ฉบับปรับปรุง Logic Modulo)
====================================================== */
function calculateKalaYok(date) {
    const year = getEffectiveAstroYear(date);
    const cs = year - 1181; // แปลงเป็น จ.ศ.
    

    const getRem = (num, divisor) => {
        let rem = num % divisor;
        return rem < 0 ? rem + divisor : rem;
    };

    const thongchaiBase = (cs * 10) + 3;
    const athibadiBase = (cs % 498);
    const ubatBase = (cs * 10) + 2;
    const lokawinasBase = cs + 1120;  
    

  
    return {
        thongChai: getRem(thongchaiBase - 1, 7),
        athibadi: getRem(athibadiBase - 1, 7),
        ubart: getRem(ubatBase - 1, 7),
        lokawinat: getRem(lokawinasBase - 1, 7)
    }
   

}


/* ======================================================
   ดาวจร 7 ดาว
====================================================== */

function getPlanetTransit(date) {

    const day = date.getDay()

    const planets = [
        { name: "☀️ ดาวอาทิตย์", power: "อำนาจ วาสนา" },
        { name: "🌙 ดาวจันทร์", power: "เมตตา เสน่ห์" },
        { name: "♂ ดาวอังคาร", power: "พลัง การต่อสู้" },
        { name: "☿ ดาวพุธ", power: "การค้า การสื่อสาร" },
        { name: "♃ ดาวพฤหัส", power: "ปัญญา ผู้ใหญ่" },
        { name: "♀ ดาวศุกร์", power: "เงิน เสน่ห์" },
        { name: "♄ ดาวเสาร์", power: "กรรม อุปสรรค" }
    ]

    return planets[day]
}

/* ======================================================
   ฤกษ์บน ฤกษ์ล่าง
====================================================== */

function calculateRuek(date) {

    const d = date.getDate()
    const top = d % 3
    const bottom = d % 4

    let topResult = "ปกติ"
    let bottomResult = "ปกติ"

    if (top === 0) topResult = "ฤกษ์ดี"
    if (top === 1) topResult = "ฤกษ์กลาง"
    if (top === 2) topResult = "ฤกษ์แรง"

    if (bottom === 0) bottomResult = "ฤกษ์ดี"
    if (bottom === 1) bottomResult = "ฤกษ์เสีย"
    if (bottom === 2) bottomResult = "ฤกษ์กลาง"
    if (bottom === 3) bottomResult = "ฤกษ์ดี"

    return {
        top: topResult,
        bottom: bottomResult
    }
}

/* ======================================================
   หมายเหตุ: ฟังก์ชัน getAuspiciousDays ถูกย้ายไปที่ utils-auspicious.js แล้ว
====================================================== */
let viewDate = new Date();
let selectedMemberProfile = null;

// Key สำหรับเก็บบันทึกปฏิทินใน localStorage
const CALENDAR_NOTES_STORAGE_KEY = 'siam_calendar_notes_v1';

function getCalendarNotes() {
    try {
        return JSON.parse(localStorage.getItem(CALENDAR_NOTES_STORAGE_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function saveCalendarNote(dateKey, noteData) {
    const notes = getCalendarNotes();
    if (!noteData || (!noteData.title && !noteData.content)) {
        delete notes[dateKey];
    } else {
        notes[dateKey] = {
            ...noteData,
            updatedAt: new Date().toISOString()
        };
    }
    localStorage.setItem(CALENDAR_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function changeMonth(offset) {
    viewDate.setMonth(viewDate.getMonth() + offset);
    renderAuspiciousCalendar();
}

function changeYear(offset) {
    viewDate.setFullYear(viewDate.getFullYear() + offset);
    renderAuspiciousCalendar();
}

function setCalendarYear(year) {
    viewDate.setFullYear(parseInt(year, 10));
    renderAuspiciousCalendar();
}

function setCalendarMonth(month) {
    viewDate.setMonth(parseInt(month, 10));
    renderAuspiciousCalendar();
}

function isCalendarAdminUser() {
    if (typeof isAdmin === 'function' && isAdmin()) return true;
    try {
        const raw = localStorage.getItem('siamhora_auth_session');
        if (raw) {
            const session = JSON.parse(raw);
            if (session && (session.role === 'admin' || session.role === 'data_manager')) return true;
        }
    } catch (e) {}
    return false;
}

function getMemberFullName(m) {
    if (!m) return '';
    const firstName = m.name || m.firstName || '';
    const lastName = m.lastName || m.surname || '';
    return `${firstName} ${lastName}`.trim() || 'ไม่ระบุชื่อ';
}

/**
 * แปลงวันเกิดเป็นรูปแบบภาษาไทยเต็ม พร้อมคำนวณอายุ ปี/เดือน/วัน ณ วันที่ที่ระบุ (targetDate)
 * เพื่อให้ในแต่ละวันของปฏิทิน/ใบงานรายวัน อายุเพิ่มขึ้นตามวันที่จริงอย่างถูกต้อง
 * เช่น วันที่ 1 ส.ค. (อายุ 31 ปี 4 เดือน 30 วัน), วันที่ 2 ส.ค. (อายุ 31 ปี 5 เดือน 0 วัน), วันที่ 31 ส.ค. (อายุ 31 ปี 5 เดือน 29 วัน)
 */
function formatThaiBirthdateWithAge(bdateStr, targetDate) {
    if (!bdateStr) return '';
    const parts = bdateStr.split('/');
    if (parts.length !== 3) return bdateStr;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const monthThai = monthNames[month - 1] || '';

    // แปลงปี ค.ศ. / พ.ศ.
    let yearAD = year;
    let yearBE = year;
    if (year > 2400) {
        yearAD = year - 543;
    } else {
        yearBE = year + 543;
    }

    const birthDate = new Date(yearAD, month - 1, day);
    const refDate = targetDate ? new Date(targetDate) : new Date();

    if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime())) return bdateStr;

    // คำนวณอายุ ปี เดือน วัน ณ วันที่ refDate
    let ageYears = refDate.getFullYear() - birthDate.getFullYear();
    let ageMonths = refDate.getMonth() - birthDate.getMonth();
    let ageDays = refDate.getDate() - birthDate.getDate();

    if (ageDays < 0) {
        ageMonths -= 1;
        // หาวันที่ในเดือนก่อนหน้าของ refDate
        const prevMonthLastDay = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
        ageDays += prevMonthLastDay;
    }

    if (ageMonths < 0) {
        ageYears -= 1;
        ageMonths += 12;
    }

    let ageText = '';
    if (ageYears >= 0) {
        const parts = [];
        if (ageYears > 0) parts.push(`${ageYears} ปี`);
        if (ageMonths > 0) parts.push(`${ageMonths} เดือน`);
        if (ageDays > 0 || parts.length === 0) parts.push(`${ageDays} วัน`);
        ageText = ` (อายุ ณ วันนี้: ${parts.join(' ')})`;
    }

    return `${day} ${monthThai} ${yearBE}${ageText}`;
}

function selectProfileForCalendar(memberId) {
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    if (!memberId) {
        selectedMemberProfile = null;
    } else {
        selectedMemberProfile = allHistory.find(m => m.memberId === memberId || m.name === memberId || (m.name + ' ' + (m.lastName || '')).trim() === memberId) || null;
    }
    renderAuspiciousCalendar();
}

/* ======================================================
   ปฏิทินฤกษ์ 100 ปี + บันทึก & ทำนายเฉพาะบุคคล
====================================================== */

function Calenderbody() {
    const body = document.getElementById("calendarBodypage");
    if (!body) return;  

    const monthOptions = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ].map((m, idx) => `<option value="${idx}">${m}</option>`).join('');

    let yearOptions = '';
    const curYear = new Date().getFullYear();
    for (let y = 1950; y <= 2100; y++) {
        yearOptions += `<option value="${y}">พ.ศ. ${y + 543} (ค.ศ. ${y})</option>`;
    }

    const html = `
    <div class="calendar-main-card shadow-lg" style="background: #090e1c; border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 12px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.7);">
        <!-- Top Toolbar -->
        <div class="p-3 px-md-4" style="background: linear-gradient(180deg, #131b2e 0%, #090e1c 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div class="d-flex align-items-center gap-2">
                    <button type="button" onclick="changeYear(-1)" title="ปีก่อนหน้า" style="background: #1e293b; border: 1px solid #d4af37; color: #ffd700; border-radius: 6px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;">
                        <i class="fas fa-angle-double-left"></i> ปีก่อน
                    </button>
                    <button type="button" onclick="changeMonth(-1)" title="เดือนก่อนหน้า" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.2); color: #ffffff; border-radius: 6px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;">
                        <i class="fas fa-chevron-left"></i> เดือนก่อน
                    </button>
                </div>
                
                <div class="text-center">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <i class="fas fa-calendar-alt" style="color: #ffd700; font-size: 1.2rem;"></i>
                        <span id="currentMonthYear" style="font-size: 1.4rem; font-weight: 700; color: #ffd700; letter-spacing: 0.5px; text-shadow: 0 0 12px rgba(255,215,0,0.3);"></span>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <button type="button" onclick="changeMonth(1)" title="เดือนถัดไป" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.2); color: #ffffff; border-radius: 6px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;">
                        เดือนถัดไป <i class="fas fa-chevron-right"></i>
                    </button>
                    <button type="button" onclick="changeYear(1)" title="ปีถัดไป" style="background: #1e293b; border: 1px solid #d4af37; color: #ffd700; border-radius: 6px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;">
                        ปีถัดไป <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>
            </div>

            <!-- Filter & Jump Bar -->
            <div class="p-2 px-3 rounded" style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(212, 175, 55, 0.2);">
                <div class="row g-2 align-items-center text-start">
                    <div class="col-12 col-md-4">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-dark text-warning border-secondary" style="font-size:0.8rem;"><i class="fas fa-user-circle"></i></span>
                            <select id="calMemberSelect" class="form-select form-select-sm bg-dark text-warning border-secondary" onchange="selectProfileForCalendar(this.value)" style="font-size:0.85rem; color:#ffd700 !important;">
                                <option value="">-- คำทำนายภาพรวมสากล --</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-dark text-light border-secondary" style="font-size:0.8rem;">เดือน</span>
                            <select id="calMonthSelect" class="form-select form-select-sm bg-dark text-light border-secondary" onchange="setCalendarMonth(this.value)" style="font-size:0.85rem; color:#fff !important;">
                                ${monthOptions}
                            </select>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-dark text-light border-secondary" style="font-size:0.8rem;">ปี</span>
                            <select id="calYearSelect" class="form-select form-select-sm bg-dark text-light border-secondary" onchange="setCalendarYear(this.value)" style="font-size:0.85rem; color:#fff !important;">
                                ${yearOptions}
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-md-2 d-flex gap-2">
                        <button type="button" onclick="goToToday()" style="flex:1; background:#334155; border:1px solid #64748b; color:#ffffff; font-weight:700; border-radius:6px; font-size:0.85rem; padding:6px 0; cursor:pointer; transition:all 0.2s;">
                            📍 วันนี้
                        </button>
                        <button type="button" onclick="openPrintCalendarModal()" style="flex:1; background:linear-gradient(135deg, #ffd700, #d4af37); border:none; color:#000000; font-weight:700; border-radius:6px; font-size:0.85rem; padding:6px 0; cursor:pointer; transition:all 0.2s;" title="พิมพ์ปฏิทิน / PDF (เฉพาะแอดมิน)">
                            🖨️ พิมพ์ 👑
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="calPersonalizedBanner" class="mt-2 text-center small" style="display:none; padding: 5px 10px; background: rgba(56, 189, 248, 0.15); border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3); color: #7dd3fc;"></div>
        </div>

        <!-- Table View -->
        <div class="card-body p-0 table-responsive">
            <table class="table table-bordered calendar-table mb-0 text-white" style="border-color: rgba(255,255,255,0.1);">
                <thead>
                    <tr class="text-center" style="background: #131b2e; font-size: 0.92rem; border-bottom: 2px solid rgba(212, 175, 55, 0.4);">
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #ef4444 !important;">อาทิตย์</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">จันทร์</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">อังคาร</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">พุธ</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">พฤหัสบดี</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">ศุกร์</th>
                        <th class="py-2" style="width: 14.28%; font-weight: 700; color: #f1f5f9 !important;">เสาร์</th>
                    </tr>
                </thead>
                <tbody id="calendarBody"></tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="card-footer py-2 px-3" style="background: #090e1c; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <div class="d-flex flex-wrap justify-content-between align-items-center text-muted" style="font-size: 0.85rem;">
                <div class="d-flex flex-wrap gap-2 gap-md-3 align-items-center mb-1 mb-md-0" style="color: #94a3b8;">
                    <span><i class="fas fa-flag text-success"></i> วันธงชัย</span>
                    <span><i class="fas fa-crown text-info"></i> วันอธิบดี</span>
                    <span><i class="fas fa-exclamation-triangle text-warning"></i> อุบาทว์</span>
                    <span><i class="fas fa-times-circle text-danger"></i> โลกาวินาศ</span>
                    <span><i class="fas fa-sticky-note" style="color:#f59e0b;"></i> มีโน้ต</span>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn-sm px-3 py-1" style="background:transparent; border:1px solid #64748b; color:#cbd5e1; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> ห้องพยากรณ์
                    </button>
                    <button type="button" class="btn-sm px-3 py-1" style="background:transparent; border:1px solid #64748b; color:#cbd5e1; border-radius:6px; font-size:0.8rem; cursor:pointer;" onclick="navigateTo('mainContent')">
                        <i class="fas fa-home"></i> หน้าแรก
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    body.innerHTML = html;
    populateCalendarMemberSelect();
    renderAuspiciousCalendar();
}

function populateCalendarMemberSelect() {
    const select = document.getElementById('calMemberSelect');
    if (!select) return;
    
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    let opts = '<option value="">-- ดูคำทำนายภาพรวมสากล --</option>';
    
    allHistory.forEach(m => {
        const val = m.memberId || m.name;
        const fullName = getMemberFullName(m);
        const bdateFormatted = formatThaiBirthdateWithAge(m.birthdate);
        opts += `<option value="${val}">👤 ${fullName} (${bdateFormatted || m.birthdate || 'ไม่ระบุวันเกิด'})</option>`;
    });
    
    select.innerHTML = opts;
    if (selectedMemberProfile) {
        select.value = selectedMemberProfile.memberId || selectedMemberProfile.name;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Calenderbody();
});

function getMemberFortuneForDay(date, member) {
    if (!member || !member.birthdate) return null;
    
    // คำนวณวันเกิดของเจ้าชะตา
    let bDayIdx = -1;
    const parts = member.birthdate.split('/');
    if (parts.length === 3) {
        let bYear = parseInt(parts[2], 10);
        if (bYear > 2400) bYear -= 543;
        const bDate = new Date(bYear, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        bDayIdx = bDate.getDay();
    }
    if (bDayIdx === -1) return null;

    const currentDayIdx = date.getDay();
    
    // คู่มิตร / คู่ศัตรู / กาลกิณี ตามวันเกิด
    const kalakiniDays = {
        0: 5, // อาทิตย์ - ศุกร์
        1: 0, // จันทร์ - อาทิตย์
        2: 1, // อังคาร - จันทร์
        3: 2, // พุธ - อังคาร
        4: 6, // พฤหัสบดี - เสาร์
        5: 3, // ศุกร์ - พุธกลางคืน
        6: 4  // เสาร์ - พฤหัสบดี
    };

    const friendDays = {
        0: [4, 2], // อาทิตย์ มิตรกับ พฤหัส, อังคาร
        1: [3, 6], // จันทร์ มิตรกับ พุธ, เสาร์
        2: [5, 4], // อังคาร มิตรกับ ศุกร์, พฤหัส
        3: [1, 5], // พุธ มิตรกับ จันทร์, ศุกร์
        4: [0, 2], // พฤหัส มิตรกับ อาทิตย์, อังคาร
        5: [2, 1], // ศุกร์ มิตรกับ อังคาร, จันทร์
        6: [3, 5]  // เสาร์ มิตรกับ ราหู/ศุกร์
    };

    const isKalakini = kalakiniDays[bDayIdx] === currentDayIdx;
    const isFriend = (friendDays[bDayIdx] || []).includes(currentDayIdx);
    const isBirthDay = bDayIdx === currentDayIdx;

    let status = 'ปกติ';
    let badgeClass = 'text-light';
    let score = 75;

    if (isKalakini) {
        status = 'วันกาลกิณีจร (ควรระวัง)';
        badgeClass = 'text-danger';
        score = 40;
    } else if (isFriend) {
        status = 'วันคู่มิตรโชคลาภ (ดีมาก)';
        badgeClass = 'text-success';
        score = 95;
    } else if (isBirthDay) {
        status = 'วันตรงวันเกิด (พลังเด่น)';
        badgeClass = 'text-warning';
        score = 85;
    }

    return {
        memberName: getMemberFullName(member),
        status,
        badgeClass,
        score,
        isKalakini,
        isFriend,
        isBirthDay
    };
}

function renderAuspiciousCalendar() {
    const body = document.getElementById("calendarBody");
    const title = document.getElementById("currentMonthYear");
    const mSelect = document.getElementById("calMonthSelect");
    const ySelect = document.getElementById("calYearSelect");
    const banner = document.getElementById("calPersonalizedBanner");
    if (!body || !title) return;

    body.innerHTML = "";

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const thaiYear = year + 543;
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    title.innerText = `${monthNames[month]} พ.ศ. ${thaiYear} (ค.ศ. ${year})`;

    if (mSelect) mSelect.value = month;
    if (ySelect) ySelect.value = year;

    if (banner) {
        if (selectedMemberProfile) {
            const fullName = getMemberFullName(selectedMemberProfile);
            const bdateFormatted = formatThaiBirthdateWithAge(selectedMemberProfile.birthdate);
            banner.style.display = 'block';
            banner.innerHTML = `<i class="fas fa-sparkles text-warning"></i> กำลังแสดงคำทำนายเฉพาะบุคคลสำหรับ: <strong class="text-gold">${fullName}</strong> (เกิด ${bdateFormatted || selectedMemberProfile.birthdate || '-'})`;
        } else {
            banner.style.display = 'none';
        }
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const now = new Date();
    const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;
    const todayDate = now.getDate();

    const allNotes = getCalendarNotes();

    let dateCounter = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            cell.style.cssText = "width:14.28%;height:105px;border:1px solid rgba(255,255,255,0.07);padding:6px 8px;vertical-align:top;position:relative;background:rgba(15,23,42,0.45);transition:all 0.15s ease;";

            if ((i === 0 && j < firstDay) || dateCounter > daysInMonth) {
                cell.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
                cell.style.opacity = "0.3";
            } else {
                const currentDateNum = dateCounter;
                const date = new Date(year, month, currentDateNum);
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDateNum).padStart(2, '0')}`;
                
                const kala = calculateKalaYok(date);
                const planet = getPlanetTransit(date);
                const ruek = calculateRuek(date);
                const hasNote = !!allNotes[dateKey];
                const memberFortune = getMemberFortuneForDay(date, selectedMemberProfile);

                cell.style.cursor = "pointer";
                cell.onmouseenter = () => { cell.style.backgroundColor = "rgba(212,175,55,0.12)"; cell.style.borderColor = "rgba(212,175,55,0.4)"; };
                cell.onmouseleave = () => { 
                    if (isToday) {
                        cell.style.backgroundColor = "rgba(212,175,55,0.18)";
                        cell.style.borderColor = "#ffd700";
                    } else {
                        cell.style.backgroundColor = "rgba(15,23,42,0.45)"; 
                        cell.style.borderColor = "rgba(255,255,255,0.07)";
                    }
                };

                cell.onclick = function () {
                    showDayDetail(currentDateNum, month, year);
                };

                const isToday = isCurrentMonth && currentDateNum === todayDate;

                if (isToday) {
                    cell.style.backgroundColor = "rgba(212,175,55,0.18)";
                    cell.style.border = "1.5px solid #ffd700";
                    cell.style.boxShadow = "inset 0 0 10px rgba(255,215,0,0.15)";
                }

                let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                <span style="font-weight:700; font-size:1.05rem; color:${isToday ? '#ffd700' : '#f1f5f9'};">${currentDateNum}</span>
                                <div class="d-flex align-items-center gap-1">
                                    ${hasNote ? '<span title="มีบันทึกข้อความ" style="font-size:10px; color:#f59e0b;"><i class="fas fa-sticky-note"></i></span>' : ''}
                                    ${isToday ? '<span style="font-size:9px; background:#ffd700; color:#000; padding:1px 5px; border-radius:4px; font-weight:700;">วันนี้</span>' : ''}
                                </div>
                            </div>`;

                // ส่วนการแสดงกาลโยคแบบมินิมอล Sleek
                if (j === kala.thongChai) html += `<div class="text-success fw-bold" style="font-size:10.5px; line-height:1.2;"><i class="fas fa-flag"></i> ธงชัย</div>`;
                if (j === kala.athibadi) html += `<div class="text-info fw-bold" style="font-size:10.5px; line-height:1.2;"><i class="fas fa-crown"></i> อธิบดี</div>`;
                if (j === kala.ubart) html += `<div class="text-warning" style="font-size:10.5px; line-height:1.2;"><i class="fas fa-exclamation-triangle"></i> อุบาทว์</div>`;
                if (j === kala.lokawinat) html += `<div class="text-danger fw-bold" style="font-size:10.5px; line-height:1.2;"><i class="fas fa-times-circle"></i> โลกาวินาศ</div>`;

                // การแสดงผลคำทำนายรายบุคคล
                if (memberFortune) {
                    html += `<div class="${memberFortune.badgeClass}" style="font-size:9.5px; font-weight:600; margin-top:2px;">
                                ✨ ${memberFortune.status.split(' ')[0]} (${memberFortune.score}%)
                             </div>`;
                }

                html += `<div style="font-size:9.5px; margin-top:2px; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${planet.name}</div>`;
                
                if (hasNote) {
                    const noteTitle = allNotes[dateKey].title || allNotes[dateKey].content || 'บันทึก';
                    html += `<div style="font-size:9px; color:#fbbf24; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px; background:rgba(245,158,11,0.15); padding:1px 4px; border-radius:3px;">
                                📝 ${noteTitle}
                             </div>`;
                }

                cell.innerHTML = html;
                dateCounter++;
            }
            row.appendChild(cell);
        }
        body.appendChild(row);
        if (dateCounter > daysInMonth) break;
    }
}

/* ======================================================
   ฟังก์ชันกลับมายังเดือนปัจจุบัน
====================================================== */
function goToToday() {
    viewDate = new Date();
    renderAuspiciousCalendar();
    window.scrollTo({ behavior: 'smooth' });
}

/* ======================================================
   ฟังก์ชันดึงคำทำนายจากระบบยาม
====================================================== */
function getYarmPrediction(dayIdx) {
    if (window.YARM_CHART && typeof YARM_INFO !== 'undefined') {
        const starId = window.YARM_CHART.day[dayIdx][0];
        const info = YARM_INFO[starId];
        return `${info.name}: ${info.trait} (เหมาะสำหรับ${info.good})`;
    }
    return "ยามมงคลมหาโชค เหมาะแก่การประกอบการมงคล";
}

function getKalaStatus(dayIdx, kala) {
    if (dayIdx === kala.thongChai) return "🚩 วันธงชัย (ดีที่สุด)";
    if (dayIdx === kala.athibadi) return "👑 วันอธิบดี (เน้นอำนาจ/ความก้าวหน้า)";
    if (dayIdx === kala.ubart) return "⚠️ วันอุบาทว์ (ควรเลี่ยงเรื่องใหญ่)";
    if (dayIdx === kala.lokawinat) return "❌ วันโลกาวินาศ (ห้ามประกอบพิธีมงคล)";
    return "วันปกติ";
}

function getAuspiciousTime(dayIdx) {
    const timeMatrix = {
        0: "06.00-08.24 (ดีมาก), 13.13-15.36 (ปานกลาง)",
        1: "08.25-10.48 (ดี), 15.37-18.00 (ดีมาก)",
        2: "10.49-13.12 (ดีมาก), 06.00-08.24 (ปานกลาง)",
        3: "13.13-15.36 (ดี), 08.25-10.48 (ดีมาก)",
        4: "15.37-18.00 (ดีมาก), 10.49-13.12 (ดี)",
        5: "06.00-08.24 (ดี), 13.13-15.36 (ดีมาก)",
        6: "08.25-10.48 (ปานกลาง), 15.37-18.00 (ดี)"
    };
    return timeMatrix[dayIdx] || "09.00-12.00 (เวลามาตรฐาน)";
}

let currentAuspiciousData = null;

/* ======================================================
   ฟังก์ชันแสดงรายละเอียดวัน + แท็บบันทึกข้อมูล (Notes) & คำทำนาย
====================================================== */
function showDayDetail(day, month, year) {
    const date = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayIdx = date.getDay();
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const dayName = thaiDays[dayIdx];
    const thaiYear = year + 543;

    const kala = calculateKalaYok(date);
    const planet = getPlanetTransit(date);
    const colorInfo = (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[dayName]) ? COLOR_MASTER[dayName] : {
        bg: '#d4af37', lucky: 'สีทอง, สีเหลือง', forbidden: 'สีดำ', direction: 'ทิศตะวันออก'
    };
    const auspiciousTime = getAuspiciousTime(dayIdx);
    const memberFortune = getMemberFortuneForDay(date, selectedMemberProfile);

    // ดึงโน้ตที่เคยบันทึกไว้
    const allNotes = getCalendarNotes();
    const existingNote = allNotes[dateKey] || { title: '', content: '', category: 'general' };

    let doList = "";
    let dontList = "";
    if (dayIdx === kala.thongChai || dayIdx === kala.athibadi) {
        doList = "เหมาะกับการเริ่มต้นสิ่งใหม่, เปิดกิจการ, เจรจาธุรกิจสำคัญ, ซื้อยานพาหนะ";
        dontList = "ไม่มีข้อห้ามร้ายแรง แต่ควรระวังเรื่องความประมาท";
    } else if (dayIdx === kala.ubart || dayIdx === kala.lokawinat) {
        doList = "ควรเน้นงานเอกสาร, วางแผนภายใน, สวดมนต์ทำบุญปล่อยปลา";
        dontList = "ไม่ควรออกรถใหม่, ขึ้นบ้านใหม่ หรือจัดพิธีมงคลสมรส";
    } else {
        doList = "ทำงานติดต่อธุรกิจตามปกติ, พบปะมิตรสหาย, ริเริ่มเรียนรู้สิ่งใหม่";
        dontList = "งดการตัดสินใจเรื่องการเงินก้อนใหญ่แบบกะทันหัน";
    }

    const dayAnalysis = {
        0: { lucky: "พฤหัสบดี, อังคาร", unlucky: "ศุกร์", numbers: "1, 9, 5" },
        1: { lucky: "พุธ, เสาร์", unlucky: "อาทิตย์", numbers: "2, 4, 6" },
        2: { lucky: "ศุกร์, พฤหัสบดี", unlucky: "จันทร์", numbers: "3, 5, 8" },
        3: { lucky: "จันทร์, ศุกร์", unlucky: "อังคาร", numbers: "4, 2, 7" },
        4: { lucky: "อาทิตย์, อังคาร", unlucky: "เสาร์", numbers: "5, 1, 9" },
        5: { lucky: "อังคาร, จันทร์", unlucky: "พุธกลางคืน", numbers: "6, 3, 5" },
        6: { lucky: "พุธกลางคืน, ศุกร์", unlucky: "พฤหัสบดี", numbers: "7, 8, 2" }
    };
    const result = dayAnalysis[dayIdx];
    
    currentAuspiciousData = {
        day, monthName: monthNames[month], thaiYear, dayName,
        kalaStatus: getKalaStatus(dayIdx, kala),
        planetName: planet.name, planetPower: planet.power,
        auspiciousTime, doList, dontList,
        luckyDays: result.lucky, unluckyDays: result.unlucky,
        numbers: result.numbers, direction: colorInfo.direction,
        luckyColor: colorInfo.lucky, forbiddenColor: colorInfo.forbidden,
        bgColor: colorInfo.bg
    };

    let personalForecastHtml = '';
    if (memberFortune) {
        personalForecastHtml = `
        <div class="p-3 mb-3 rounded" style="background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.4);">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong class="text-gold"><i class="fas fa-sparkles"></i> คำทำนายเฉพาะคุณ${memberFortune.memberName}</strong>
                <span class="badge badge-warning text-dark font-weight-bold" style="font-size:0.85rem; background:#ffd700;">คะแนนพลัง: ${memberFortune.score}%</span>
            </div>
            <p class="mb-1 ${memberFortune.badgeClass}"><strong>เกณฑ์ดวง:</strong> ${memberFortune.status}</p>
            <small class="text-muted">คำนวณจากความสมพงศ์ของดาววันเกิดกับพลังจักรวาลในวันนี้</small>
        </div>`;
    }

    const content = `
        <div style="text-align:left; line-height:1.6; font-size: 14px; color:#222;">
            <!-- Tabs Menu -->
            <ul class="nav nav-tabs mb-3" id="calDetailTabs" role="tablist" style="border-bottom: 2px solid #d4af37;">
                <li class="nav-item">
                    <button class="nav-link active fw-bold text-dark" id="calTab1-btn" onclick="switchCalModalTab('forecast')">
                        🔮 ฤกษ์ & คำทำนาย
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-bold text-secondary" id="calTab2-btn" onclick="switchCalModalTab('notes')">
                        📝 บันทึกข้อมูลส่วนบุคคล
                    </button>
                </li>
            </ul>

            <!-- Tab 1: คำทำนายและฤกษ์ -->
            <div id="calTabForecast">
                ${personalForecastHtml}
                <div class="p-3 rounded" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                    <p class="mb-2"><strong>🌟 กาลโยค:</strong> ${getKalaStatus(dayIdx, kala)}</p>
                    <p class="mb-2"><strong>🪐 ดาวประจำวัน:</strong> ${planet.name} (${planet.power})</p>
                    <p class="mb-2"><strong>⏰ ยามมงคล:</strong> <span style="color:#e67e22; font-weight:bold;">${auspiciousTime}</span></p>
                    <hr style="margin:8px 0;">
                    <p class="mb-1 text-success"><strong>✅ สิ่งที่ควรทำ:</strong> ${doList}</p>
                    <p class="mb-1 text-danger"><strong>❌ สิ่งที่ควรเลี่ยง:</strong> ${dontList}</p>
                    <hr style="margin:8px 0;">
                    <p class="mb-1"><strong>💎 วันมิตรโชคดี:</strong> วัน${result.lucky}</p>
                    <p class="mb-1"><strong>⚠️ วันที่ควรระวัง:</strong> วัน${result.unlucky}</p>
                    <p class="mb-1"><strong>🔢 เลขนำโชค:</strong> <span style="color:#d4af37; font-weight:bold; font-size:16px;">${result.numbers}</span></p>
                    <p class="mb-0"><strong>🎨 สีมงคล:</strong> ${colorInfo.lucky} (เลี่ยง: ${colorInfo.forbidden}) | 🧭 ทิศ${colorInfo.direction}</p>
                </div>
            </div>

            <!-- Tab 2: บันทึกข้อมูล (Notes / Journal) -->
            <div id="calTabNotes" style="display:none;">
                <div class="p-3 rounded" style="background: #fffbeb; border: 1px solid #fde68a;">
                    <label class="fw-bold mb-1"><i class="fas fa-edit text-warning"></i> หัวข้อบันทึก / เหตุการณ์สำคัญ:</label>
                    <input type="text" id="noteTitleInput" class="form-control form-control-sm mb-2" placeholder="เช่น นัดเซ็นสัญญา, วันครบรอบ, ไดอารี่..." value="${existingNote.title || ''}">
                    
                    <label class="fw-bold mb-1"><i class="fas fa-align-left text-warning"></i> รายละเอียดบันทึก:</label>
                    <textarea id="noteContentInput" class="form-control form-control-sm mb-3" rows="4" placeholder="พิมพ์บันทึกข้อมูลของคุณที่นี่...">${existingNote.content || ''}</textarea>

                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-success px-3 fw-bold" onclick="handleSaveCalendarNote('${dateKey}')">
                            <i class="fas fa-save"></i> บันทึกข้อมูล
                        </button>
                        ${existingNote.title || existingNote.content ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteCalendarNote('${dateKey}')">
                                <i class="fas fa-trash"></i> ลบบันทึก
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: `วัน${dayName}ที่ ${day} ${monthNames[month]} พ.ศ. ${thaiYear}`,
        html: content,
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#4b5563',
        showCancelButton: true,
        cancelButtonText: '<i class="fas fa-print"></i> พิมพ์ใบงานรายวันนี้ (A4)',
        cancelButtonColor: '#d4af37',
        width: '600px',
        customClass: {
            cancelButton: 'text-dark fw-bold'
        }
    }).then((res) => {
        if (res.dismiss === Swal.DismissReason.cancel) {
            printSingleDaySheet(year, month, day);
        }
    });
}

// สลับแท็บใน Modal
window.switchCalModalTab = function(tab) {
    const tForecast = document.getElementById('calTabForecast');
    const tNotes = document.getElementById('calTabNotes');
    const b1 = document.getElementById('calTab1-btn');
    const b2 = document.getElementById('calTab2-btn');
    if (!tForecast || !tNotes) return;

    if (tab === 'forecast') {
        tForecast.style.display = 'block';
        tNotes.style.display = 'none';
        b1.className = 'nav-link active fw-bold text-dark';
        b2.className = 'nav-link fw-bold text-secondary';
    } else {
        tForecast.style.display = 'none';
        tNotes.style.display = 'block';
        b1.className = 'nav-link fw-bold text-secondary';
        b2.className = 'nav-link active fw-bold text-dark';
    }
};

window.handleSaveCalendarNote = function(dateKey) {
    const title = document.getElementById('noteTitleInput').value.trim();
    const content = document.getElementById('noteContentInput').value.trim();
    
    saveCalendarNote(dateKey, { title, content });
    Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเรียบร้อยแล้ว!',
        timer: 1200,
        showConfirmButton: false
    });
    renderAuspiciousCalendar();
};

window.handleDeleteCalendarNote = function(dateKey) {
    saveCalendarNote(dateKey, null);
    Swal.fire({
        icon: 'info',
        title: 'ลบบันทึกแล้ว',
        timer: 1000,
        showConfirmButton: false
    });
    renderAuspiciousCalendar();
};

async function downloadAuspiciousImage(element) {
    if (!currentAuspiciousData) return;
    const data = currentAuspiciousData;
    
    let btn = element instanceof HTMLElement ? element : document.querySelector('.btn-share-image');
    const originalText = btn ? btn.innerHTML : "บันทึกรูปภาพ";

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังวาดลายแทง...';
        btn.disabled = true;
    }

    try {
        await document.fonts.ready;
        
        const width = 1080;
        const height = 1350; // 4:5 portrait format for socials
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Background
        let grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, data.bgColor);
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Title Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(80, 80, width - 160, 100, 20);
        else ctx.rect(80, 80, width - 160, 100);
        ctx.fill();
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 50px "Sarabun"';
        ctx.fillStyle = data.bgColor;
        ctx.fillText(`วัน${data.dayName}ที่ ${data.day} ${data.monthName} ${data.thaiYear}`, width/2, 130);
        
        // Content Area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(80, 220, width - 160, height - 360, 20);
        else ctx.rect(80, 220, width - 160, height - 360);
        ctx.fill();
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.font = '400 36px "Sarabun"';
        
        let cy = 260;
        const cx = 130;
        const maxWidth = width - 260;
        const lh = 55;
        
        function drawLine(text, y, color = '#ffffff', bold = false) {
            ctx.font = `${bold ? '700' : '400'} 36px "Sarabun"`;
            ctx.fillStyle = color;
            ctx.fillText(text, cx, y);
            return y + lh;
        }
        
        function drawWrappedText(text, y, color = '#ffffff') {
            ctx.font = '400 36px "Sarabun"';
            ctx.fillStyle = color;
            let pLines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                const segments = segmenter.segment(text);
                let currentLine = "";
                for (const {segment} of segments) {
                    const testLine = currentLine + segment;
                    if (ctx.measureText(testLine).width > maxWidth && currentLine.trim() !== '') {
                        pLines.push(currentLine);
                        currentLine = segment;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            } else {
                let currentLine = "";
                for (let j = 0; j < text.length; j++) {
                    const char = text[j];
                    const testLine = currentLine + char;
                    if (ctx.measureText(testLine).width > maxWidth && j > 0) {
                        pLines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            }
            
            for (let l of pLines) {
                ctx.fillText(l, cx, y);
                y += lh;
            }
            return y;
        }

        cy = drawLine(`🌟 กาลโยค: ${data.kalaStatus}`, cy);
        cy = drawLine(`🪐 ดาวประจำวัน: ${data.planetName} (${data.planetPower})`, cy);
        
        cy += 15;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`⏰ ยามมงคลวันนี้:`, cy);
        cy = drawLine(`${data.auspiciousTime}`, cy, '#f39c12', true);
        
        cy += 15;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`✅ สิ่งที่ควรทำ:`, cy, '#4cd137', true);
        cy = drawWrappedText(`${data.doList}`, cy, '#4cd137');
        
        cy += 15;
        cy = drawLine(`❌ สิ่งที่ควรเลี่ยง:`, cy, '#e84118', true);
        cy = drawWrappedText(`${data.dontList}`, cy, '#e84118');
        
        cy += 15;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(width-cx, cy); ctx.stroke();
        cy += 30;
        
        cy = drawLine(`💎 คนที่วันเกิดจะโชคดี: วัน${data.luckyDays}`, cy);
        cy = drawLine(`⚠️ คนที่วันเกิดควรระวัง: วัน${data.unluckyDays}`, cy);
        
        cy += 15;
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🔢 เลขนำโชค: `, cx, cy);
        ctx.font = '700 42px "Sarabun"';
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`${data.numbers}`, cx + 220, cy - 4);
        cy += lh;
        
        cy = drawLine(`🧭 ทิศมงคล: ทิศ${data.direction}`, cy);
        
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🎨 สีมงคล: `, cx, cy);
        ctx.font = '700 36px "Sarabun"';
        ctx.fillStyle = data.bgColor;
        ctx.fillText(`${data.luckyColor}`, cx + 180, cy);
        ctx.font = '400 36px "Sarabun"';
        ctx.fillStyle = '#ffffff';
        const luckyW = ctx.measureText(`${data.luckyColor}`).width;
        ctx.fillText(`(เลี่ยงสี${data.forbiddenColor})`, cx + 180 + luckyW + 20, cy);
        
        // Footer
        const fy = height - 70;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '700 40px "Sarabun"';
        ctx.fillStyle = '#ffd700';
        ctx.fillText("🌌 มหาโหราจักรวาล", 80, fy);
        
        ctx.textAlign = 'right';
        ctx.font = '400 24px "Sarabun"';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText("วิเคราะห์โดย ประธานโบ้", width - 80, fy);
        
        // Export
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `มหาโหราจักรวาล_${new Date().getTime()}.png`;
        link.click();

        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', timer: 1000, showConfirmButton: false });

    } catch (e) {
        console.error("Save Error:", e);
        Swal.fire('เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง', 'error');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

/* ======================================================
   ระบบสั่งพิมพ์ปฏิทินสำหรับนำไปใช้งานจริง (Print / A4 Sheet)
   - มีช่องว่างสำหรับเขียนบันทึกด้วยปากกา / โน้ต
   - มีคำทำนายดวงชะตา/ฤกษ์ประจำวันกำกับไว้ครบถ้วน
====================================================== */
window.openPrintCalendarModal = function() {
    // 🔒 จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
    if (!isCalendarAdminUser()) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: '🔒 สิทธิ์เฉพาะผู้ดูแลระบบ',
                html: 'ระบบพิมพ์ปฏิทินและชุดใบงาน 365 วัน สงวนสิทธิ์สำหรับ <b>ผู้ดูแลระบบ (Admin)</b> เท่านั้นครับ<br><span style="font-size:12px; color:#94a3b8;">กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อใช้งานฟังก์ชันนี้</span>',
                confirmButtonText: 'รับทราบ',
                confirmButtonColor: '#d4af37',
                background: '#0a1020',
                customClass: { popup: 'border-gold' }
            });
        } else {
            alert('ระบบพิมพ์ปฏิทินสงวนสิทธิ์สำหรับผู้ดูแลระบบ (Admin) เท่านั้น');
        }
        return;
    }

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const thaiYear = year + 543;
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    const options = [
        {
            id: 'blank_lines',
            icon: 'fa-calendar-alt',
            color: '#ffd700',
            title: `ปฏิทินตารางรายเดือน (1 แผ่น A4 แนวนอน)`,
            subtitle: `พิมพ์เฉพาะเดือน ${monthNames[month]} เป็นตารางช่องวันพร้อมเส้นเขียนโน้ต`,
            badge: 'ยอดนิยม'
        },
        {
            id: 'daily_sheet',
            icon: 'fa-calendar-day',
            color: '#10b981',
            title: `ใบงานปฏิทินรายวัน (เฉพาะวันนี้ 1 แผ่น A4)`,
            subtitle: `พิมพ์เจาะลึกรายวัน ทั้งฤกษ์ยาม สีมงคล ทิศเดินทาง ข้อควรทำ และเส้นบันทึกเต็มหน้า`,
            badge: '1 วัน/แผ่น'
        },
        {
            id: 'daily_month_bundle',
            icon: 'fa-layer-group',
            color: '#06b6d4',
            title: `เล่มใบงานรายวันทั้งเดือนนี้ (${new Date(year, month + 1, 0).getDate()} แผ่น A4)`,
            subtitle: `พิมพ์ใบงานรายวันแบบ 1 วันต่อ 1 แผ่น เรียงต่อกันครบทุกวันในเดือน ${monthNames[month]}`,
            badge: 'เล่มรายเดือน'
        },
        {
            id: 'daily_year_bundle',
            icon: 'fa-book-reader',
            color: '#ec4899',
            title: `เล่มใบงานรายวันครบทั้งปี (365 แผ่น A4)`,
            subtitle: `สร้างชุดใบงานรายวันครบ 365 วันตลอดปี พ.ศ. ${thaiYear} สำหรับเย็บเล่มไดอารี่`,
            badge: 'สมุด 365 วัน'
        },
        {
            id: 'full_12_months',
            icon: 'fa-book-open',
            color: '#f59e0b',
            title: `เล่มตารางปฏิทินรายเดือน 12 เดือน (12 แผ่น)`,
            subtitle: `พิมพ์ครบชุด ม.ค. - ธ.ค. หน้าละ 1 เดือน สำหรับเย็บเล่มสมุดตลอดปี`,
            badge: '12 แผ่น'
        },
        {
            id: 'yearly_overview',
            icon: 'fa-th',
            color: '#a78bfa',
            title: `แผ่นพับสรุป 12 เดือนในหน้าเดียว`,
            subtitle: `พิมพ์ใบสรุปย่อภาพรวมทั้งปี 12 เดือน พร้อมไฮไลต์วันธงชัย/อธิบดี/เตือนภัย`,
            badge: '1 แผ่น'
        }
    ];

    let selectedType = 'blank_lines';

    let cardsHtml = options.map((opt, idx) => `
        <div class="print-opt-card ${idx === 0 ? 'selected' : ''}" 
             onclick="selectPrintOption('${opt.id}', this)"
             id="printOpt_${opt.id}"
             style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; background: ${idx === 0 ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)'}; border: 1.5px solid ${idx === 0 ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'}; cursor: pointer; transition: all 0.2s ease; margin-bottom: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: ${opt.color}; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08);">
                <i class="fas ${opt.icon}"></i>
            </div>
            <div style="flex-grow: 1; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: #f8fafc; font-size: 0.92rem;">${opt.title}</span>
                    ${opt.badge ? `<span style="font-size: 0.72rem; padding: 1px 6px; border-radius: 4px; background: rgba(212,175,55,0.2); color: #ffd700; border: 1px solid rgba(212,175,55,0.4); font-weight: 600;">${opt.badge}</span>` : ''}
                </div>
                <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 1px; line-height: 1.3;">${opt.subtitle}</div>
            </div>
            <div class="opt-check-icon" style="color: ${idx === 0 ? '#ffd700' : '#475569'}; font-size: 1rem;">
                <i class="fas ${idx === 0 ? 'fa-check-circle' : 'fa-circle'}"></i>
            </div>
        </div>
    `).join('');

    const content = `
        <div style="font-family: 'Sarabun', sans-serif;">
            <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 12px; text-align: left;">
                เลือกเอกสารที่ต้องการพิมพ์ <strong style="color: #ffd700;">ประจำปี พ.ศ. ${thaiYear}</strong>:
            </div>
            <input type="hidden" id="selectedPrintTypeInput" value="blank_lines">
            <div id="printOptionsContainer">
                ${cardsHtml}
            </div>
        </div>
    `;

    window.selectPrintOption = function(type, el) {
        document.getElementById('selectedPrintTypeInput').value = type;
        const allCards = document.querySelectorAll('.print-opt-card');
        allCards.forEach(card => {
            card.style.background = 'rgba(255, 255, 255, 0.03)';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            const icon = card.querySelector('.opt-check-icon i');
            if (icon) {
                icon.className = 'fas fa-circle';
                card.querySelector('.opt-check-icon').style.color = '#475569';
            }
        });
        el.style.background = 'rgba(212, 175, 55, 0.15)';
        el.style.borderColor = '#ffd700';
        const icon = el.querySelector('.opt-check-icon i');
        if (icon) {
            icon.className = 'fas fa-check-circle';
            el.querySelector('.opt-check-icon').style.color = '#ffd700';
        }
    };

    Swal.fire({
        title: `<div style="display:flex; align-items:center; justify-content:center; gap:8px; font-size:1.2rem; color:#ffd700;"><i class="fas fa-print"></i> พิมพ์ปฏิทินใช้งาน (Print / PDF)</div>`,
        html: content,
        background: '#0a1020',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-external-link-alt mr-1"></i> เปิดหน้าต่างพิมพ์',
        confirmButtonColor: '#d4af37',
        cancelButtonText: 'ปิด',
        cancelButtonColor: '#1e293b',
        customClass: {
            popup: 'border-gold shadow-lg',
            confirmButton: 'text-dark fw-bold px-4 py-2 border-0',
            cancelButton: 'text-muted px-4 py-2 border-0'
        },
        width: '520px'
    }).then((res) => {
        if (res.isConfirmed) {
            const printType = document.getElementById('selectedPrintTypeInput')?.value || 'blank_lines';
            generatePrintableCalendar(year, month, printType);
        }
    });
};

function generatePrintableCalendar(year, month, printType) {
    const thaiYear = year + 543;
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const allNotes = getCalendarNotes();

    const printWin = window.open('', '_blank');
    if (!printWin) {
        Swal.fire('แจ้งเตือน', 'กรุณาอนุญาตป็อปอัป (Popup) เพื่อเปิดหน้าต่างพิมพ์', 'warning');
        return;
    }

    let bodyHtml = '';

    if (printType === 'yearly_overview') {
        // พิมพ์สรุปทั้งปี 12 เดือนในหน้าเดียว
        bodyHtml = `
            <div class="print-header">
                <h2>สยามโหรามงคล • ปฏิทินกาลโยคและฤกษ์มงคล ประจำปี พ.ศ. ${thaiYear} (ค.ศ. ${year})</h2>
                <p>สำนักพยากรณ์ศาสตร์ชั้นสูง | สรุปวันธงชัย วันอธิบดี วันอุบาทว์ และวันโลกาวินาศ ตลอดปี</p>
            </div>
            <div class="year-grid">
        `;

        for (let m = 0; m < 12; m++) {
            const firstD = new Date(year, m, 1).getDay();
            const daysInM = new Date(year, m + 1, 0).getDate();
            
            bodyHtml += `
                <div class="mini-month">
                    <div class="mini-month-title">${monthNames[m]} ${thaiYear}</div>
                    <table class="mini-table">
                        <tr>
                            <th class="text-danger">อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th>
                        </tr>
            `;

            let dCount = 1;
            for (let r = 0; r < 6; r++) {
                bodyHtml += '<tr>';
                for (let c = 0; c < 7; c++) {
                    if ((r === 0 && c < firstD) || dCount > daysInM) {
                        bodyHtml += '<td class="empty"></td>';
                    } else {
                        const dObj = new Date(year, m, dCount);
                        const k = calculateKalaYok(dObj);
                        let badge = '';
                        if (c === k.thongChai) badge = 'bg-thongchai';
                        else if (c === k.athibadi) badge = 'bg-athibadi';
                        else if (c === k.ubart) badge = 'bg-ubat';
                        else if (c === k.lokawinat) badge = 'bg-lokawinat';

                        bodyHtml += `<td class="${badge}">${dCount}</td>`;
                        dCount++;
                    }
                }
                bodyHtml += '</tr>';
                if (dCount > daysInM) break;
            }
            bodyHtml += `</table></div>`;
        }
        bodyHtml += `</div>
            <div class="print-legend mt-3">
                <span><span class="legend-box bg-thongchai"></span> วันธงชัย</span>
                <span><span class="legend-box bg-athibadi"></span> วันอธิบดี</span>
                <span><span class="legend-box bg-ubat"></span> วันอุบาทว์</span>
                <span><span class="legend-box bg-lokawinat"></span> วันโลกาวินาศ</span>
            </div>
        `;
    } else if (printType === 'daily_sheet') {
        // พิมพ์ใบงานปฏิทินรายวัน 1 วัน ต่อ 1 แผ่น A4 (สำหรับวันปัจจุบันของเดือน หรือวันที่เลือก)
        const targetDay = (viewDate.getFullYear() === year && viewDate.getMonth() === month) ? viewDate.getDate() : 1;
        bodyHtml = generateDailyPrintHtml(year, month, targetDay, selectedMemberProfile, allNotes);
    } else if (printType === 'daily_month_bundle') {
        // พิมพ์เล่มใบงานรายวันทั้งเดือนนี้ (1 วัน ต่อ 1 แผ่น A4 เรียงต่อกัน 28-31 แผ่น)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const isLast = d === daysInMonth;
            bodyHtml += `
                <div class="daily-bundle-page" style="${!isLast ? 'page-break-after: always; break-after: page; margin-bottom: 20px;' : ''}">
                    ${generateDailyPrintHtml(year, month, d, selectedMemberProfile, allNotes)}
                </div>
            `;
        }
    } else if (printType === 'daily_year_bundle') {
        // พิมพ์เล่มใบงานรายวันครบทั้งปี (1 วัน ต่อ 1 แผ่น A4 เรียงต่อกัน 365 แผ่น)
        let pageCount = 1;
        for (let m = 0; m < 12; m++) {
            const daysInM = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInM; d++) {
                const isLast = (m === 11 && d === daysInM);
                bodyHtml += `
                    <div class="daily-bundle-page" style="${!isLast ? 'page-break-after: always; break-after: page; margin-bottom: 20px;' : ''}">
                        ${generateDailyPrintHtml(year, m, d, selectedMemberProfile, allNotes)}
                    </div>
                `;
                pageCount++;
            }
        }
    } else {
        // พิมพ์ปฏิทินรายเดือน (ตารางแนวนอน 1 เดือน หรือ 12 เดือน)
        const targetMonths = (printType === 'full_12_months') ? [0,1,2,3,4,5,6,7,8,9,10,11] : [month];
        const memberTitle = selectedMemberProfile ? ` | คำทำนายเฉพาะคุณ: ${selectedMemberProfile.name}` : '';

        targetMonths.forEach((curM, mIdx) => {
            const firstDay = new Date(year, curM, 1).getDay();
            const daysInMonth = new Date(year, curM + 1, 0).getDate();
            const isLastPage = mIdx === targetMonths.length - 1;

            bodyHtml += `
            <div class="month-print-page" style="${!isLastPage ? 'page-break-after: always; break-after: page;' : ''}">
                <div class="print-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 style="margin:0; font-size:20px; color:#92400e;">สยามโหรามงคล • ปฏิทินบันทึกดวงชะตาและฤกษ์มงคล</h1>
                            <p style="margin:2px 0 0 0; font-size:13px; color:#4b5563;">
                                ประจำเดือน <strong>${monthNames[curM]} พ.ศ. ${thaiYear} (ค.ศ. ${year})</strong> ${memberTitle}
                            </p>
                        </div>
                        <div style="text-align:right; font-size:11px; color:#6b7280;">
                            <div>🖨️ เอกสารบันทึกแผนงาน & พยากรณ์ (แผ่นที่ ${curM + 1}/12)</div>
                            <div>พิมพ์เมื่อ: ${new Date().toLocaleDateString('th-TH')}</div>
                        </div>
                    </div>
                </div>

                <table class="main-print-table">
                    <thead>
                        <tr>
                            <th style="color:#b91c1c;">อาทิตย์</th>
                            <th>จันทร์</th>
                            <th>อังคาร</th>
                            <th>พุธ</th>
                            <th>พฤหัสบดี</th>
                            <th>ศุกร์</th>
                            <th>เสาร์</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            let dCounter = 1;
            for (let row = 0; row < 6; row++) {
                bodyHtml += '<tr>';
                for (let col = 0; col < 7; col++) {
                    if ((row === 0 && col < firstDay) || dCounter > daysInMonth) {
                        bodyHtml += '<td class="empty-cell"></td>';
                    } else {
                        const cNum = dCounter;
                        const dateObj = new Date(year, curM, cNum);
                        const dateKey = `${year}-${String(curM + 1).padStart(2, '0')}-${String(cNum).padStart(2, '0')}`;
                        const kala = calculateKalaYok(dateObj);
                        const planet = getPlanetTransit(dateObj);
                        const memFort = getMemberFortuneForDay(dateObj, selectedMemberProfile);
                        const note = allNotes[dateKey];

                        let kalaBadge = '';
                        if (col === kala.thongChai) kalaBadge = '<span class="tag-flag tag-thongchai">ธงชัย</span>';
                        if (col === kala.athibadi) kalaBadge = '<span class="tag-flag tag-athibadi">อธิบดี</span>';
                        if (col === kala.ubart) kalaBadge = '<span class="tag-flag tag-ubat">อุบาทว์</span>';
                        if (col === kala.lokawinat) kalaBadge = '<span class="tag-flag tag-lokawinat">โลกาวินาศ</span>';

                        let fortuneText = '';
                        if (memFort) {
                            fortuneText = `<div class="member-fortune-line">✨ ${memFort.status.split(' ')[0]} (${memFort.score}%)</div>`;
                        }

                        let noteHtml = '';
                        if (printType === 'with_notes' && note) {
                            noteHtml = `
                                <div class="printed-note">
                                    ${note.title ? `<strong>${note.title}</strong><br>` : ''}
                                    <span>${note.content || ''}</span>
                                </div>
                            `;
                        } else {
                            noteHtml = `
                                <div class="handwriting-lines">
                                    <div class="hw-line"></div>
                                    <div class="hw-line"></div>
                                    <div class="hw-line"></div>
                                </div>
                            `;
                        }

                        bodyHtml += `
                            <td class="day-cell">
                                <div class="day-cell-header">
                                    <span class="day-num">${cNum}</span>
                                    <div>${kalaBadge}</div>
                                </div>
                                <div class="astro-meta">${planet.name.replace('☀️ ','').replace('🌙 ','').replace('♂ ','').replace('☿ ','').replace('♃ ','').replace('♀ ','').replace('♄ ','')}</div>
                                ${fortuneText}
                                ${noteHtml}
                            </td>
                        `;
                        dCounter++;
                    }
                }
                bodyHtml += '</tr>';
                if (dCounter > daysInMonth) break;
            }

            bodyHtml += `
                    </tbody>
                </table>

                <div class="print-footer d-flex justify-content-between align-items-center">
                    <div class="legend-items">
                        <strong>สัญลักษณ์:</strong>
                        <span class="tag-flag tag-thongchai">ธงชัย</span> = เริ่มต้นสิ่งใหม่ 
                        <span class="tag-flag tag-athibadi">อธิบดี</span> = อำนาจความก้าวหน้า
                        <span class="tag-flag tag-ubat">อุบาทว์</span> = เลี่ยงงานใหญ่
                        <span class="tag-flag tag-lokawinat">โลกาวินาศ</span> = ห้ามประกอบพิธีมงคล
                    </div>
                    <div class="signature-box">
                        ลงชื่อผู้บันทึก: ___________________________
                    </div>
                </div>
            </div>
            `;
        });
    }

    const isDailyBundle = (printType === 'daily_sheet' || printType === 'daily_month_bundle' || printType === 'daily_year_bundle');
    const fullDoc = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <title>ปฏิทิน ${monthNames[month]} ${thaiYear} - สยามโหรามงคล</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
            <style>
                @page {
                    size: ${isDailyBundle ? 'A4 portrait' : 'A4 landscape'};
                    margin: ${isDailyBundle ? '6mm 10mm' : '6mm 10mm'};
                }
                * { 
                    box-sizing: border-box; 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                }
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    background: #f8fafc;
                }
                body {
                    font-family: 'Sarabun', sans-serif;
                    color: #1f2937;
                    padding: ${isDailyBundle ? '10px 20px' : '10px'};
                }
                .daily-bundle-page {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    background: #fff;
                    padding: 15px 20px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    margin-bottom: 20px;
                }
                .daily-page-sheet {
                    max-width: 100%;
                    margin: 0 auto;
                    background: #fff;
                    padding: 15px 20px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .month-print-page {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    background: #fff;
                    padding: 10px;
                }
                .print-header {
                    border-bottom: 2px solid #b45309;
                    padding-bottom: 3px;
                    margin-bottom: 6px;
                }
                .d-flex { display: flex; }
                .justify-content-between { justify-content: space-between; }
                .align-items-center { align-items: center; }
                
                /* Daily Styles */
                .daily-box {
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 16px;
                    background: #fff;
                }
                .daily-journal-box {
                    margin-top: 10px;
                    min-height: 520px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .daily-title-badge {
                    display: inline-block;
                    font-size: 26px;
                    font-weight: 700;
                    color: #92400e;
                    margin-right: 8px;
                }
                .daily-hw-lines {
                    margin-top: 8px;
                    display: flex;
                    flex-direction: column;
                }
                .daily-hw-line {
                    border-bottom: 1px dotted #94a3b8;
                    height: 28px;
                    width: 100%;
                }

                /* Main Calendar Table */
                .main-print-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .main-print-table th {
                    background: #fef3c7 !important;
                    border: 1px solid #94a3b8;
                    padding: 4px 2px;
                    font-size: 13px;
                    font-weight: 700;
                    text-align: center;
                }
                .main-print-table td {
                    border: 1px solid #94a3b8;
                    height: 80px;
                    max-height: 80px;
                    vertical-align: top;
                    padding: 3px 5px;
                    position: relative;
                    overflow: hidden;
                }
                .empty-cell {
                    background: #f8fafc !important;
                }
                .day-cell-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2px;
                }
                .day-num {
                    font-size: 14px;
                    font-weight: 700;
                    color: #111827;
                }
                .astro-meta {
                    font-size: 9px;
                    color: #64748b;
                    line-height: 1.1;
                }
                .member-fortune-line {
                    font-size: 9px;
                    font-weight: 700;
                    color: #b45309;
                    margin-top: 1px;
                }
                
                /* Flags */
                .tag-flag {
                    font-size: 8.5px;
                    font-weight: 700;
                    padding: 1px 4px;
                    border-radius: 3px;
                }
                .tag-thongchai { background: #dcfce7 !important; color: #15803d !important; }
                .tag-athibadi { background: #dbeafe !important; color: #1d4ed8 !important; }
                .tag-ubat { background: #fef9c3 !important; color: #a16207 !important; }
                .tag-lokawinat { background: #fee2e2 !important; color: #b91c1c !important; }

                /* Lines for handwriting */
                .handwriting-lines {
                    margin-top: 3px;
                }
                .hw-line {
                    border-bottom: 1px dotted #94a3b8;
                    height: 14px;
                    width: 100%;
                }

                /* Printed Note */
                .printed-note {
                    font-size: 9.5px;
                    color: #1e293b;
                    background: #f1f5f9 !important;
                    padding: 2px 4px;
                    border-radius: 3px;
                    border-left: 2px solid #f59e0b;
                    margin-top: 2px;
                    max-height: 42px;
                    overflow: hidden;
                    line-height: 1.2;
                }

                .print-footer {
                    margin-top: 5px;
                    padding-top: 3px;
                    border-top: 1px solid #e2e8f0;
                    font-size: 10.5px;
                    color: #4b5563;
                }
                .signature-box {
                    font-size: 11px;
                    font-weight: 500;
                    color: #374151;
                }

                /* Yearly Grid Layout */
                .year-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 4px;
                }
                .mini-month {
                    border: 1px solid #cbd5e1;
                    border-radius: 4px;
                    padding: 2px 4px;
                    background: #ffffff;
                }
                .mini-month-title {
                    font-weight: 700;
                    text-align: center;
                    font-size: 10.5px;
                    background: #fef3c7 !important;
                    color: #92400e;
                    padding: 1px;
                    border-radius: 3px;
                    margin-bottom: 2px;
                }
                .mini-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 8.5px;
                    text-align: center;
                }
                .mini-table th { padding: 1px; color: #475569; font-weight: 600; }
                .mini-table td { padding: 1px 0.5px; }
                .bg-thongchai { background: #86efac !important; font-weight: bold; border-radius: 2px; color: #065f46 !important; }
                .bg-athibadi { background: #93c5fd !important; font-weight: bold; border-radius: 2px; color: #1e40af !important; }
                .bg-ubat { background: #fde047 !important; border-radius: 2px; color: #854d0e !important; }
                .bg-lokawinat { background: #fca5a5 !important; font-weight: bold; border-radius: 2px; color: #991b1b !important; }
                .legend-box { display: inline-block; width: 10px; height: 10px; vertical-align: middle; border-radius: 2px; margin-right: 3px; }
                .print-legend {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    font-size: 11px;
                    margin-top: 4px;
                    font-weight: 600;
                }
                
                .no-print-bar {
                    background: #1e293b;
                    color: #fff;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .btn-print-action {
                    background: #d4af37;
                    color: #000;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }
                @media print {
                    .no-print-bar { display: none !important; }
                    html, body {
                        background: #fff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    .daily-bundle-page, .daily-page-sheet {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin-bottom: 0 !important;
                        width: 100% !important;
                    }
                    .daily-hw-line {
                        height: 24px !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="no-print-bar">
                <span>🖨️ หน้าต่างแสดงตัวอย่างก่อนพิมพ์ (Print Preview) - สยามโหรามงคล</span>
                <button class="btn-print-action" onclick="window.print()">กดสั่งพิมพ์ / บันทึกเป็น PDF</button>
            </div>
            ${isDailyBundle && printType === 'daily_sheet' ? `<div class="daily-page-sheet">${bodyHtml}</div>` : bodyHtml}
        </body>
        </html>
    `;

    printWin.document.open();
    printWin.document.write(fullDoc);
    printWin.document.close();
}

function generateDailyPrintHtml(year, month, day, memberProfile, allNotes) {
    const date = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayIdx = date.getDay();
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const dayName = thaiDays[dayIdx];
    const thaiYear = year + 543;

    // ข้อมูลโหราศาสตร์รอบด้าน
    const kala = calculateKalaYok(date);
    const planet = getPlanetTransit(date);
    const ruek = calculateRuek(date);
    const auspiciousTime = getAuspiciousTime(dayIdx);
    const memFort = getMemberFortuneForDay(date, memberProfile);
    const note = allNotes ? allNotes[dateKey] : null;

    // 1. สีมงคลและพลัง
    const luckyData = (typeof dailyColors !== 'undefined' && dailyColors[dayIdx]) ? dailyColors[dayIdx] : {
        lucky: 'สีประจำวัน', wealth: 'สีเสริมโชคลาภ', power: 'สีเสริมอำนาจ', forbidden: 'สีกาลกิณี', numbers: '1, 9'
    };

    // 2. ทิศและเวลาเดินทางมงคล
    const travelDirections = {
        0: { dir: "🌅 ตะวันออก (ทิศเดช/มีชัยชนะ)", time: "06.00-08.30 น." },
        1: { dir: "🌙 เหนือ (ทิศศรี/ราบรื่นคล่องตัว)", time: "08.30-10.30 น." },
        2: { dir: "🔥 ตะวันออกเฉียงใต้ (ทิศมนตรี/ผู้ใหญ่อุปถัมภ์)", time: "13.00-15.00 น." },
        3: { dir: "💚 ตะวันตกเฉียงเหนือ (ทิศโชคลาภ/เงินทอง)", time: "09.00-11.00 น." },
        4: { dir: "🟡 ใต้ (ทิศมหาลาภ/เสน่ห์การค้า)", time: "15.30-17.30 น." },
        5: { dir: "💛 ตะวันตก (ทิศความสำเร็จ/เจรจาผ่านฉลุย)", time: "06.30-09.00 น." },
        6: { dir: "⚫ ตะวันตกเฉียงใต้ (ทิศคุ้มครองแคล้วคลาด)", time: "14.00-16.30 น." }
    };
    const travelInfo = travelDirections[dayIdx] || { dir: "ทิศตะวันออก", time: "ยามเช้า" };

    // 3. กาลโยค
    let kalaText = 'วันปรกติทั่วไป (ประกอบการมงคลได้ตามฤกษ์)';
    let kalaColor = '#334155';
    let kalaBadgeBg = '#f1f5f9';
    if (dayIdx === kala.thongChai) { 
        kalaText = '🚩 วันธงชัย (ยอดเยี่ยมที่สุดในการเปิดกิจการ ขึ้นบ้านใหม่ ออกรถ แต่งงาน)'; 
        kalaColor = '#15803d';
        kalaBadgeBg = '#dcfce7';
    } else if (dayIdx === kala.athibadi) { 
        kalaText = '👑 วันอธิบดี (เจริญในยศศักดิ์ อำนาจวาสนา นัดเจรจาผู้ใหญ่ ชนะคู่แข่ง)'; 
        kalaColor = '#1d4ed8';
        kalaBadgeBg = '#dbeafe';
    } else if (dayIdx === kala.ubart) { 
        kalaText = '⚠️ วันอุบาทว์ (เลี่ยงการทำการมงคลใหญ่ ระวังข้อผิดพลาดทางเอกสาร)'; 
        kalaColor = '#a16207';
        kalaBadgeBg = '#fef9c3';
    } else if (dayIdx === kala.lokawinat) { 
        kalaText = '❌ วันโลกาวินาศ (ห้ามประกอบพิธีมงคลเด็ดขาด ควรเน้นทำบุญสะเดาะเคราะห์)'; 
        kalaColor = '#b91c1c';
        kalaBadgeBg = '#fee2e2';
    }

    // 4. สิ่งที่ควรทำ / สิ่งที่ควรเลี่ยง
    let doList = "เจรจาค้าขาย, ติดต่อประสานงาน, ทำบุญกุศล, วางแผนอนาคต";
    let dontList = "การตัดสินใจด้วยอารมณ์วู่วาม, การค้ำประกันบุคคลที่ไม่สนิท";
    if (dayIdx === kala.thongChai || dayIdx === kala.athibadi) {
        doList = "เริ่มต้นสิ่งใหม่, เปิดร้าน, ลงทุน, ซื้อสินทรัพย์ชิ้นใหญ่, เซ็นสัญญาสำคัญ";
        dontList = "การผัดวันประกันพรุ่ง, ความประมาทเลินเล่อในเรื่องความปลอดภัย";
    } else if (dayIdx === kala.ubart || dayIdx === kala.lokawinat) {
        doList = "งานเอกสารภายใน, สวดมนต์นั่งสมาธิ, ทำบุญปล่อยปลา, จัดเก็บบ้านเรือน";
        dontList = "ออกรถใหม่, พิธีแต่งงาน, เดินทางไกลยามวิกาล, ทุ่มเงินเสี่ยงโชคเกินตัว";
    }

    const planetTraits = {
        0: "ธาตุไฟ • มีพลังอำนาจ กล้าตัดสินใจ ภาวะผู้นำโดดเด่น",
        1: "ธาตุดิน • เมตตามหานิยม วาจาไพเราะ มีเสน่ห์แก่ผู้พบเห็น",
        2: "ธาตุลม • พลังการต่อสู้ กล้าหาญ รวดเร็ว ปิดการขายได้ไว",
        3: "ธาตุน้ำ • สติปัญญา การค้าขายออนไลน์ การเจรจาแลกเปลี่ยน",
        4: "ธาตุดินแข็ง • คุณธรรม ปัญญาญาณ ผู้ใหญ่เมตตาเอ็นดู การเรียนรู้",
        5: "ธาตุน้ำ • ทรัพย์สิน ความรัก ความสุนทรีย์ ศิลปะ การเงินคล่องตัว",
        6: "ธาตุไฟ • ความอดทน งานโครงการระยะยาว การแก้ปัญหาเฉพาะหน้า"
    };

    return `
        <!-- ส่วนหัวเอกสาร -->
        <div class="print-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 style="margin:0; font-size:22px; color:#92400e; font-weight:700;">สยามโหรามงคล • ใบพยากรณ์และบันทึกดวงชะตารายวัน</h1>
                    <p style="margin:2px 0 0 0; font-size:13px; color:#4b5563;">
                        เอกสารวิเคราะห์ฤกษ์ยามและแผนงาน ${memberProfile ? ` | เจ้าชะตา: <strong style="color:#b45309;">คุณ${getMemberFullName(memberProfile)}</strong> (เกิด ${formatThaiBirthdateWithAge(memberProfile.birthdate, date) || '-'})` : ''}
                    </p>
                </div>
            </div>
        </div>

        <!-- 1. กล่องข้อควรรู้และโหราศาสตร์รอบด้านประจำวัน -->
        <div class="daily-box mb-2" style="background: #fafaf9; border-color: #e2d9c8;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #b45309; padding-bottom: 4px; margin-bottom: 6px;">
                <div>
                    <span class="daily-title-badge">วัน${dayName}ที่ ${day}</span>
                    <span style="font-size: 15px; color: #78350f; font-weight: 700;">${monthNames[month]} พ.ศ. ${thaiYear} (ค.ศ. ${year})</span>
                </div>
                <div style="background:${kalaBadgeBg}; color:${kalaColor}; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:4px; border:1px solid ${kalaColor};">
                    ${kalaText.split(' ')[0]} ${kalaText.split(' ')[1] || ''}
                </div>
            </div>


            <!-- พระจันทร์เสวยภพประจำวันในใบพิมพ์ -->
            ${(typeof ThaiHoroProEngine !== 'undefined' && memberProfile && memberProfile.birthdate) ? (() => {
                try {
                    let bPart = memberProfile.birthdate.split('/');
                    let bY = parseInt(bPart[2], 10);
                    if (bY > 2400) bY -= 543;
                    let bDateIso = `${bY}-${bPart[1].padStart(2,'0')}-${bPart[0].padStart(2,'0')}`;
                    let bHoro = ThaiHoroProEngine.calculateFullHoroscope(bDateIso, memberProfile.birthTime || '12:00');
                    let dHoro = ThaiHoroProEngine.calculateDailyPrediction(bHoro.asc.rasiIndex, bHoro.birthPlanetNum, date);
                    return `
                    <div style="background:#eff6ff; padding:8px 12px; border-radius:6px; border:1px solid #bfdbfe; margin-bottom:8px; font-size:11.5px; line-height:1.5;">
                        <strong style="color:#1d4ed8;">🌙 พระจันทร์เสวยภพ${dHoro.moonHouse} (ราศี${dHoro.moonRasi}):</strong> ${dHoro.moonInfluenceText}
                    </div>
                    `;
                } catch(e) { return ''; }
            })() : ''}
                <!-- Grid 2 คอลัมน์สำหรับสรุปข้อมูลมงคล -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11.5px; line-height: 1.4;">
                <div>
                    <div style="padding: 2px 0;"><strong>🌟 กาลโยค:</strong> <span style="color:${kalaColor}; font-weight:700;">${kalaText}</span></div>
                    <div style="padding: 2px 0;"><strong>🪐 ดาว & ธาตุ:</strong> ${planet.name} (${planetTraits[dayIdx] || planet.power})</div>
                    <div style="padding: 2px 0;"><strong>⏰ ยามมงคล:</strong> <span style="color:#b45309; font-weight:700;">${auspiciousTime}</span></div>
                    <div style="padding: 2px 0;"><strong>🚗 ทิศ & เวลาเดินทาง:</strong> <span style="color:#0f766e; font-weight:600;">${travelInfo.dir} (${travelInfo.time})</span></div>
                </div>
                <div>
                    <div style="padding: 2px 0;">
                        <strong>🎨 สีมงคล:</strong> 
                        <span style="color:#15803d; font-weight:600;">เมตตา: ${luckyData.lucky}</span> | 
                        <span style="color:#0369a1; font-weight:600;">โชคลาภ: ${luckyData.wealth}</span> | 
                        <span style="color:#6b21a8; font-weight:600;">อำนาจ: ${luckyData.power}</span>
                    </div>
                    <div style="padding: 2px 0;"><strong>🚫 สีกาลกิณี:</strong> <span style="color:#b91c1c; font-weight:700;">${luckyData.forbidden}</span> (ห้ามสวมใส่/เจรจางาน)</div>
                    <div style="padding: 2px 0;"><strong>🔢 เลขนำโชค:</strong> <span style="color:#b45309; font-weight:700;">${luckyData.numbers || '1, 9'}</span> (ดาวคู่มิตรประจำวัน)</div>
                    <div style="padding: 2px 0;"><strong>🔮 ฤกษ์บน-ล่าง:</strong> ฤกษ์บน: <strong>${ruek.top}</strong> | ฤกษ์ล่าง: <strong>${ruek.bottom}</strong></div>
                </div>
            </div>

            <!-- ข้อปฏิบัติ & พยากรณ์เฉพาะบุคคล -->
            <div style="display: grid; grid-template-columns: ${memFort ? '1.2fr 1fr' : '1fr'}; gap: 8px; margin-top: 6px;">
                <div style="background: #fff; padding: 5px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 11px;">
                    <div style="color: #15803d; font-weight: 700;">✅ ควรทำ: <span style="color:#334155; font-weight:normal;">${doList}</span></div>
                    <div style="color: #b91c1c; font-weight: 700;">❌ ควรเลี่ยง: <span style="color:#334155; font-weight:normal;">${dontList}</span></div>
                </div>
                ${memFort ? `
                <div style="background: #fef3c7; padding: 5px 8px; border-radius: 4px; border: 1px solid #fde047; font-size: 11px;">
                    <div style="font-weight: 700; color: #92400e;">✨ คำทำนายเฉพาะคุณ${memFort.memberName}:</div>
                    <div style="color: #78350f; font-weight: 600;">${memFort.status} (ดัชนีพลัง: ${memFort.score}%)</div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- 2. กล่องบันทึกแผนงาน & ไดอารี่เต็มแผ่น (Writing Lines to the Bottom) -->
        <div class="daily-box daily-journal-box" style="display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">
                    <span style="font-size: 14.5px; font-weight: 700; color: #1e293b;">📝 บันทึกแผนงาน, นัดหมาย & ไดอารี่ประจำวัน</span>
                    <span style="font-size: 11px; color: #64748b;">(บันทึกภารกิจ / การเงิน / สิ่งที่ต้องทำ)</span>
                </div>

                ${note && (note.title || note.content) ? `
                <div style="background: #f8fafc; padding: 6px 10px; border-radius: 4px; border-left: 3px solid #f59e0b; margin-bottom: 8px; font-size: 12px;">
                    ${note.title ? `<strong style="color:#0f172a; font-size:13px;">${note.title}</strong><br>` : ''}
                    <span style="color:#334155; white-space: pre-wrap;">${note.content || ''}</span>
                </div>
                ` : ''}

                <!-- เส้นบรรทัดเต็มพื้นที่แผ่นงานถึงล่างสุด (25-28 บรรทัด เต็มหน้า A4) -->
                <div class="daily-hw-lines">
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                    <div class="daily-hw-line"></div>
                </div>
            </div>
        </div>
    `;
}

window.printSingleDaySheet = function(year, month, day) {
    // 🔒 จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
    if (!isCalendarAdminUser()) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: '🔒 สิทธิ์เฉพาะผู้ดูแลระบบ',
                html: 'ระบบพิมพ์ใบงานปฏิทินรายวัน สงวนสิทธิ์สำหรับ <b>ผู้ดูแลระบบ (Admin)</b> เท่านั้นครับ',
                confirmButtonText: 'รับทราบ',
                confirmButtonColor: '#d4af37',
                background: '#0a1020',
                customClass: { popup: 'border-gold' }
            });
        } else {
            alert('ระบบพิมพ์ใบงานปฏิทินรายวันสงวนสิทธิ์สำหรับผู้ดูแลระบบ (Admin) เท่านั้น');
        }
        return;
    }

    const thaiYear = year + 543;
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const allNotes = getCalendarNotes();

    const printWin = window.open('', '_blank');
    if (!printWin) {
        Swal.fire('แจ้งเตือน', 'กรุณาอนุญาตป็อปอัป (Popup) เพื่อเปิดหน้าต่างพิมพ์', 'warning');
        return;
    }

    const bodyHtml = generateDailyPrintHtml(year, month, day, selectedMemberProfile, allNotes);

    const fullDoc = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <title>ใบงานปฏิทินรายวัน ${day} ${monthNames[month]} ${thaiYear} - สยามโหรามงคล</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
            <style>
                @page {
                    size: A4 portrait;
                    margin: 6mm 10mm;
                }
                * { 
                    box-sizing: border-box; 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                }
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    background: #f8fafc;
                }
                body {
                    font-family: 'Sarabun', sans-serif;
                    color: #1f2937;
                    padding: 10px 20px;
                }
                .daily-page-sheet {
                    max-width: 100%;
                    margin: 0 auto;
                    background: #fff;
                    padding: 15px 20px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .print-header {
                    border-bottom: 2px solid #b45309;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                }
                .d-flex { display: flex; }
                .justify-content-between { justify-content: space-between; }
                .align-items-center { align-items: center; }
                .mb-2 { margin-bottom: 10px; }
                
                .daily-box {
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 16px;
                    background: #fff;
                }
                .daily-journal-box {
                    margin-top: 10px;
                    min-height: 520px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .daily-title-badge {
                    display: inline-block;
                    font-size: 26px;
                    font-weight: 700;
                    color: #92400e;
                    margin-right: 8px;
                }
                .daily-hw-lines {
                    margin-top: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .daily-hw-line {
                    border-bottom: 1px dotted #94a3b8;
                    height: 28px;
                    width: 100%;
                }
                
                .no-print-bar {
                    background: #1e293b;
                    color: #fff;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .btn-print-action {
                    background: #d4af37;
                    color: #000;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .btn-print-action:hover {
                    background: #e6be44;
                }
                @media print {
                    .no-print-bar { display: none !important; }
                    html, body {
                        background: #fff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    .daily-page-sheet {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    .daily-hw-line {
                        height: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="no-print-bar">
                <span>🖨️ หน้าต่างแสดงตัวอย่างใบงานปฏิทินรายวัน - สยามโหรามงคล</span>
                <button class="btn-print-action" onclick="window.print()">กดสั่งพิมพ์ / บันทึกเป็น PDF</button>
            </div>
            <div class="daily-page-sheet">
                ${bodyHtml}
            </div>
        </body>
        </html>
    `;

    printWin.document.open();
    printWin.document.write(fullDoc);
    printWin.document.close();
};




