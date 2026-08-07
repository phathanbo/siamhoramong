/**
 * ระบบหาฤกษ์มงคลเฉพาะบุคคล (Personalized Auspicious Timings)
 */

function initPersonalizedAuspicious() {
    const container = document.getElementById('personalizedAuspiciousResult');
    if (!container) return;

    // Trigger update of member selectors to populate paMemberSelect
    if (typeof updateAllMemberSelectors === 'function') {
        const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
        updateAllMemberSelectors(allHistory);
    }

    // Load default from UserProfile if exists
    const stored = UserProfile.load();
    if (stored && stored.birthDate) {
        document.getElementById('paBirthDate').value = stored.birthDate;
    }
}

// Function to handle member selection
function paMemberSelected() {
    const memberId = document.getElementById('paMemberSelect').value;
    if (!memberId) return;

    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const member = allHistory.find(m => m.memberId === memberId || m.birthdate === memberId);
    
    if (member && member.birthdate) {
        const parts = member.birthdate.split('/');
        if (parts.length === 3) {
            let year = parseInt(parts[2]);
            if (year > 2400) year -= 543;
            const formatted = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            document.getElementById('paBirthDate').value = formatted;
        }
    }
}

function calculatePersonalAuspicious() {
    const birthDateStr = document.getElementById('paBirthDate').value;
    const targetMonth = parseInt(document.getElementById('paTargetMonth').value);
    const activity = document.getElementById('paActivity').value;
    const resultDiv = document.getElementById('personalizedAuspiciousResult');

    if (!birthDateStr) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเดือนปีเกิดของคุณ', 'warning');
        return;
    }

    resultDiv.innerHTML = '<div class="text-center mt-5"><i class="fas fa-spinner fa-spin fa-2x text-gold"></i><br>กำลังคำนวณฤกษ์...</div>';
    resultDiv.style.display = 'block';

    setTimeout(() => {
        const birthDate = new Date(birthDateStr);
        
        // 1. ปีนักษัตรเกิด (แบบคำนวณเดือน 5 ตามปฏิทินจันทรคติ)
        let userZodiac = "";
        let birthLunarText = "";
        if (typeof getThaiLunar === 'function') {
            const lunarInfo = getThaiLunar(birthDate);
            if (lunarInfo) {
                userZodiac = lunarInfo.zodiac;
                birthLunarText = `(ตรงกับ ${lunarInfo.zodiac})`;
            }
        }
        
        // Fallback ถ้าไม่มี getThaiLunar
        const zodiacNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
        if (!userZodiac) {
            const birthYear = birthDate.getFullYear();
            const zodiacIndex = (birthYear - 1900) % 12;
            userZodiac = zodiacNames[zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex];
        }

        // 2. วันเกิดกาลกิณี (ทักษา)
        const dayOfWeek = birthDate.getDay(); // 0=Sun, 1=Mon...
        // กาลกิณีตามวันเกิด (วันปกติ)
        const kalakiniMap = {
            0: 5, // อาทิตย์ -> ศุกร์
            1: 0, // จันทร์ -> อาทิตย์
            2: 1, // อังคาร -> จันทร์
            3: 2, // พุธ(กลางวัน) -> อังคาร
            4: 6, // พฤหัส -> เสาร์
            5: 3, // ศุกร์ -> พุธ (พุธกลางคืน ถือเป็นวันพุธในระดับวัน)
            6: 3  // เสาร์ -> พุธ(กลางวัน) 
        };
        const birthKalakiniDayNum = kalakiniMap[dayOfWeek];
        const thaiDayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const userKalakiniDay = thaiDayNames[birthKalakiniDayNum];

        // 3. หาวันชง (ตามตำราสมพงษ์)
        const clashMap = {
            "ชวด": "มะเมีย", "ฉลู": "มะแม", "ขาล": "วอก", "เถาะ": "ระกา", 
            "มะโรง": "จอ", "มะเส็ง": "กุน", "มะเมีย": "ชวด", "มะแม": "ฉลู", 
            "วอก": "ขาล", "ระกา": "เถาะ", "จอ": "มะโรง", "กุน": "มะเส็ง"
        };
        const clashZodiac = clashMap[userZodiac];

        // ดึงวันมงคลทั่วไปของเดือนเป้าหมาย
        const currentYear = new Date().getFullYear();
        let goodDates = [];
        if (typeof getAuspiciousDays === 'function') {
            goodDates = getAuspiciousDays(targetMonth);
        } else {
            goodDates = [5, 9, 14, 18, 22, 27];
        }

        let html = `<h4 class="text-gold mt-4 mb-3"><i class="fas fa-calendar-check"></i> ฤกษ์มงคลสำหรับคุณ</h4>`;
        html += `<p class="text-light" style="font-size:1.1rem; line-height:1.6;">
                    <strong>พื้นดวงเกิด:</strong> เกิด${thaiDayNames[dayOfWeek]} ปีนักษัตร <strong>${userZodiac}</strong> ${birthLunarText ? '<small class="text-white-50">คำนวณตามปฏิทินจันทรคติไทย</small>' : ''}<br>
                    <strong>ข้อห้าม (กาลกิณีทักษา):</strong> ห้ามกระทำการใน <strong class="text-danger">${userKalakiniDay}</strong><br>
                    <strong>ข้อห้าม (วันชง):</strong> ห้ามทำการในวันที่มีนักษัตรเป็น <strong class="text-danger">${clashZodiac}</strong>
                 </p>`;
        
        html += `<div class="row mt-3">`;
        
        let found = 0;
        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        
        goodDates.forEach(dateNum => {
            const targetDate = new Date(currentYear, targetMonth - 1, dateNum);
            const targetDayOfWeek = targetDate.getDay();
            
            // สูตรคำนวณนักษัตรประจำวันอย่างง่าย (อิง Julian Day)
            const jd = Math.floor(targetDate.getTime() / 86400000) + 2440587.5;
            let dayZodiacIndex = Math.floor(jd + 1) % 12;
            if (dayZodiacIndex < 0) dayZodiacIndex += 12;
            const dayZodiac = zodiacNames[dayZodiacIndex];

            // เช็คว่า วันนั้นชงไหม หรือเป็นกาลกิณีไหม
            // หมายเหตุ: วันพุธ ถ้า targetDate เป็นพุธ อาจจะตรงกับกาลกิณี (พุธกลางคืน/กลางวัน) แบบหลวมๆ
            let isKalakini = (targetDayOfWeek === birthKalakiniDayNum);
            // กรณีพิเศษ กาลกิณีพุธกลางคืน
            if (birthKalakiniDayNum === 3 && targetDayOfWeek === 3) isKalakini = true;

            const isClash = (dayZodiac === clashZodiac);

            if (!isKalakini && !isClash) {
                found++;
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card bg-dark border-gold p-3 h-100 text-left" style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                            <h5 class="text-warning mb-2" style="font-weight: bold; border-bottom: 1px dashed #d4af37; padding-bottom: 10px;">
                                <i class="fas fa-sun"></i> ${thaiDayNames[targetDayOfWeek]}ที่ ${dateNum} ${monthNames[targetMonth - 1]} ${currentYear + 543}
                            </h5>
                            <p class="mb-1 text-light">วันนักษัตร: <strong>${dayZodiac}</strong></p>
                            <p class="mb-0 text-success" style="font-size: 0.95rem;">
                                <i class="fas fa-check-circle"></i> ปลอดกาลกิณี ไม่ชงปีเกิด<br>
                                <span class="text-white-50">เหมาะสำหรับการ${activity === 'wedding' ? 'มงคลสมรส/หมั้นหมาย' : activity === 'car' ? 'ออกรถใหม่' : 'เปิดกิจการ/ขึ้นบ้านใหม่'}</span>
                            </p>
                        </div>
                    </div>
                `;
            }
        });

        if (found === 0) {
            html += `<div class="col-12"><div class="alert alert-danger" style="border-radius: 10px;"><i class="fas fa-times-circle"></i> <strong>ไม่มีฤกษ์ที่เหมาะสมในเดือนนี้</strong><br>วันที่เป็นมงคลทั้งหมดในเดือนนี้ ตรงกับวันชง หรือวันกาลกิณีประจำตัวของคุณ แนะนำให้ลองเลือกเดือนอื่นครับ</div></div>`;
        }

        html += `</div>`;
        resultDiv.innerHTML = html;

    }, 800);
}

// Global scope exports
window.calculatePersonalAuspicious = calculatePersonalAuspicious;
window.initPersonalizedAuspicious = initPersonalizedAuspicious;
window.paMemberSelected = paMemberSelected;
