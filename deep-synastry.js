/**
 * VIP Deep Synastry (ผูกดวงคู่สมพงษ์เชิงลึก)
 */

function initDeepSynastry() {
    // Populate member selectors
    if (typeof updateAllMemberSelectors === 'function') {
        const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
        updateAllMemberSelectors(allHistory);
    }
}

function dsMemberSelected(personNum) {
    const memberId = document.getElementById(`dsMemberSelect${personNum}`).value;
    if (!memberId) return;

    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const member = allHistory.find(m => m.memberId === memberId || m.birthdate === memberId);
    
    if (member) {
        if (member.birthdate) {
            const parts = member.birthdate.split('/');
            if (parts.length === 3) {
                let year = parseInt(parts[2]);
                if (year > 2400) year -= 543;
                const formatted = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                document.getElementById(`dsBirthDate${personNum}`).value = formatted;
            }
        }
        if (member.gender) {
            const genderVal = (member.gender === 'm' || member.gender === 'male') ? 'male' : 'female';
            document.getElementById(`dsGender${personNum}`).value = genderVal;
        }
    }
}

function calculateDeepSynastry() {
    const b1Str = document.getElementById('dsBirthDate1').value;
    const g1 = document.getElementById('dsGender1').value;
    const b2Str = document.getElementById('dsBirthDate2').value;
    const g2 = document.getElementById('dsGender2').value;
    const resultDiv = document.getElementById('deepSynastryResult');

    if (!b1Str || !b2Str) {
        Swal.fire('แจ้งเตือน', 'กรุณาระบุวันเดือนปีเกิดของทั้งสองฝ่าย', 'warning');
        return;
    }

    resultDiv.innerHTML = '<div class="text-center mt-5"><i class="fas fa-heartbeat fa-pulse fa-3x text-danger"></i><br><h5 class="mt-3 text-gold">กำลังผูกดวงคู่สมพงษ์...</h5></div>';
    resultDiv.style.display = 'block';

    setTimeout(() => {
        const d1 = new Date(b1Str);
        const d2 = new Date(b2Str);

        // 1. ZODIAC CALCULATION
        let z1 = "", z2 = "";
        if (typeof getThaiLunar === 'function') {
            const l1 = getThaiLunar(d1);
            if (l1) z1 = l1.zodiac;
            const l2 = getThaiLunar(d2);
            if (l2) z2 = l2.zodiac;
        }
        
        const zodiacNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
        if (!z1) z1 = zodiacNames[(d1.getFullYear() - 1900) % 12 < 0 ? ((d1.getFullYear() - 1900) % 12) + 12 : (d1.getFullYear() - 1900) % 12];
        if (!z2) z2 = zodiacNames[(d2.getFullYear() - 1900) % 12 < 0 ? ((d2.getFullYear() - 1900) % 12) + 12 : (d2.getFullYear() - 1900) % 12];

        // 2. TAKSA CALCULATION
        const day1 = d1.getDay();
        const day2 = d2.getDay();
        const kalakiniMap = { 0: 5, 1: 0, 2: 1, 3: 2, 4: 6, 5: 3, 6: 3 };
        const k1 = kalakiniMap[day1];
        const k2 = kalakiniMap[day2];
        const thaiDayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

        let taksaScore = 30; // base score for neutral
        let taksaText = "ทักษากลางๆ ไม่ส่งเสริมและไม่ขัดแย้ง";
        if (day2 === k1 && day1 === k2) {
            taksaScore = 0;
            taksaText = "เป็นกาลกิณี (ศัตรู) ต่อกันและกันอย่างรุนแรง ควรหลีกเลี่ยงการปะทะคารม";
        } else if (day2 === k1) {
            taksaScore = 15;
            taksaText = `ฝ่ายที่ 2 ตกภูมิ "กาลกิณี" ของฝ่ายที่ 1 อาจมีความเห็นไม่ตรงกันบ่อยครั้ง`;
        } else if (day1 === k2) {
            taksaScore = 15;
            taksaText = `ฝ่ายที่ 1 ตกภูมิ "กาลกิณี" ของฝ่ายที่ 2 อาจเกิดความอึดอัดใจได้ง่าย`;
        } else {
            // Check for Sri (ศรี) or Montri (มนตรี)
            const sriMap = { 0: 4, 1: 3, 2: 6, 3: 5, 4: 1, 5: 2, 6: 0 };
            const montriMap = { 0: 6, 1: 5, 2: 0, 3: 1, 4: 2, 5: 4, 6: 3 };
            if (day2 === sriMap[day1] || day1 === sriMap[day2]) {
                taksaScore = 40;
                taksaText = `เป็น "ศรี" เกื้อหนุนกัน นำพาสิริมงคลและความเจริญรุ่งเรืองมาสู่ครอบครัว`;
            } else if (day2 === montriMap[day1] || day1 === montriMap[day2]) {
                taksaScore = 35;
                taksaText = `ตกภูมิ "มนตรี" มีความเมตตาเอื้ออาทรต่อกัน ประดุจผู้ใหญ่คอยอุปถัมภ์`;
            }
        }

        // 3. ELEMENT CALCULATION (based on birth year zodiac element)
        const zodiacElements = {
            "ชวด": "น้ำ", "ฉลู": "ดิน", "ขาล": "ไฟ", "เถาะ": "ลม",
            "มะโรง": "ดิน", "มะเส็ง": "ไฟ", "มะเมีย": "ไฟ", "มะแม": "ดิน",
            "วอก": "ลม", "ระกา": "ดิน", "จอ": "ดิน", "กุน": "น้ำ"
        };
        const e1 = zodiacElements[z1];
        const e2 = zodiacElements[z2];
        
        let elemScore = 15;
        let elemText = "ธาตุเป็นกลางต่อกัน";
        const ELEMENT_RELATION = {
            "น้ำ": { support: "ลม", block: "ไฟ" },
            "ดิน": { support: "ไฟ", block: "ลม" },
            "ไฟ":  { support: "ดิน", block: "น้ำ" },
            "ลม":  { support: "น้ำ", block: "ดิน" }
        };

        if (e1 === e2) {
            elemScore = 20;
            elemText = "ธาตุเดียวกัน เข้าใจธรรมชาติของกันและกันได้ดี";
        } else if (ELEMENT_RELATION[e1].support === e2) {
            elemScore = 30;
            elemText = `ฝ่ายที่ 1 (${e1}) เกื้อหนุน ฝ่ายที่ 2 (${e2})`;
        } else if (ELEMENT_RELATION[e2].support === e1) {
            elemScore = 30;
            elemText = `ฝ่ายที่ 2 (${e2}) เกื้อหนุน ฝ่ายที่ 1 (${e1})`;
        } else if (ELEMENT_RELATION[e1].block === e2) {
            elemScore = 5;
            elemText = `ฝ่ายที่ 1 (${e1}) พิฆาต ฝ่ายที่ 2 (${e2}) อาจมีความขัดแย้งลึกๆ`;
        } else if (ELEMENT_RELATION[e2].block === e1) {
            elemScore = 5;
            elemText = `ฝ่ายที่ 2 (${e2}) พิฆาต ฝ่ายที่ 1 (${e1}) อาจมีความขัดแย้งลึกๆ`;
        }

        // 4. ZODIAC CLASH/FRIEND
        let zScore = 15;
        let zText = "สมพงษ์ระดับกลาง อยู่ร่วมกันได้ด้วยความเข้าใจ";
        const ZODIAC_MASTER = {
            "ชวด":   { friend: ["ฉลู", "มะโรง", "วอก"], enemy: ["มะเมีย"] },
            "ฉลู":   { friend: ["ชวด", "มะเส็ง", "ระกา"], enemy: ["มะแม"] },
            "ขาล":   { friend: ["มะเมีย", "จอ", "กุน"], enemy: ["วอก"] },
            "เถาะ":  { friend: ["มะแม", "กุน", "จอ"], enemy: ["ระกา"] },
            "มะโรง": { friend: ["ชวด", "วอก", "ระกา"], enemy: ["จอ"] },
            "มะเส็ง": { friend: ["ฉลู", "ระกา"], enemy: ["กุน"] },
            "มะเมีย": { friend: ["ขาล", "จอ"], enemy: ["ชวด"] },
            "มะแม":  { friend: ["เถาะ", "กุน"], enemy: ["ฉลู"] },
            "วอก":   { friend: ["ชวด", "มะโรง"], enemy: ["ขาล"] },
            "ระกา":  { friend: ["ฉลู", "มะเส็ง", "มะโรง"], enemy: ["เถาะ"] },
            "จอ":    { friend: ["ขาล", "มะเมีย", "เถาะ"], enemy: ["มะโรง"] },
            "กุน":   { friend: ["เถาะ", "มะแม", "ขาล"], enemy: ["มะเส็ง"] }
        };

        if (ZODIAC_MASTER[z1].friend.includes(z2)) {
            zScore = 30;
            zText = "เป็นคู่มิตร คู่สร้างคู่สม (ฮะกัน) ส่งเสริมบารมีและฐานะซึ่งกันและกัน";
        } else if (ZODIAC_MASTER[z1].enemy.includes(z2)) {
            zScore = 0;
            zText = "ดวงชง ปะทะกัน (ชง) มักมีเรื่องขัดแย้ง หรือทัศนคติสวนทางกัน";
        }

        // CALCULATE TOTAL
        // Total possible = 40 (Taksa) + 30 (Elem) + 30 (Zodiac) = 100
        let totalScore = taksaScore + elemScore + zScore;
        if (totalScore < 15) totalScore = 15; // Minimum 15%
        
        let gradeColor = totalScore >= 80 ? '#2bff00' : totalScore >= 60 ? '#f1c40f' : '#dc3545';
        let gradeText = totalScore >= 80 ? 'ดีเยี่ยม (คู่สร้างคู่สม)' : totalScore >= 60 ? 'ปานกลาง (คู่อุปถัมภ์/คู่เวร)' : 'ควรระวัง (ต้องปรับตัวสูง)';
        let heartIcon = totalScore >= 80 ? '💖' : totalScore >= 60 ? '💛' : '💔';

        let html = `
            <div class="card bg-dark border-gold p-4 mb-4 shadow-lg text-center" style="border-radius: 15px;">
                <h3 class="text-gold mb-3"><i class="fas fa-gem"></i> ผลลัพธ์การผูกดวง VIP</h3>
                
                <div class="d-flex justify-content-center align-items-center mb-4">
                    <div class="text-center mx-3">
                        <i class="fas ${g1 === 'male' ? 'fa-male text-info' : 'fa-female text-danger'} fa-3x mb-2"></i>
                        <h5 class="text-white mt-2">ฝ่ายที่ 1</h5>
                        <p class="small text-white-50">วัน${thaiDayNames[day1]}<br>ปี${z1} (ธาตุ${e1})</p>
                    </div>
                    
                    <div class="mx-3 text-center">
                        <h1 class="display-4" style="color: ${gradeColor}; text-shadow: 0 0 10px ${gradeColor}; font-weight: bold;">${totalScore}%</h1>
                        <span class="badge" style="background-color: ${gradeColor}; color: #000; font-size: 1.1rem; padding: 8px 15px;">${gradeText}</span>
                    </div>

                    <div class="text-center mx-3">
                        <i class="fas ${g2 === 'male' ? 'fa-male text-info' : 'fa-female text-danger'} fa-3x mb-2"></i>
                        <h5 class="text-white mt-2">ฝ่ายที่ 2</h5>
                        <p class="small text-white-50">วัน${thaiDayNames[day2]}<br>ปี${z2} (ธาตุ${e2})</p>
                    </div>
                </div>

                <hr class="border-gold mb-4">

                <div class="row text-left">
                    <div class="col-md-4 mb-3">
                        <div class="card bg-black border-gold p-3 h-100" style="border-radius: 10px;">
                            <h5 class="text-warning"><i class="fas fa-star-and-crescent"></i> มิติที่ 1: มหาทักษา</h5>
                            <div class="progress mb-2" style="height: 10px; background-color: #333;">
                                <div class="progress-bar bg-warning" role="progressbar" style="width: ${(taksaScore/40)*100}%"></div>
                            </div>
                            <p class="text-light small mb-0">${taksaText}</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card bg-black border-gold p-3 h-100" style="border-radius: 10px;">
                            <h5 class="text-info"><i class="fas fa-water"></i> มิติที่ 2: ธาตุกำเนิด</h5>
                            <div class="progress mb-2" style="height: 10px; background-color: #333;">
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${(elemScore/30)*100}%"></div>
                            </div>
                            <p class="text-light small mb-0">${elemText}</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card bg-black border-gold p-3 h-100" style="border-radius: 10px;">
                            <h5 class="text-danger"><i class="fas fa-dragon"></i> มิติที่ 3: ปีนักษัตร</h5>
                            <div class="progress mb-2" style="height: 10px; background-color: #333;">
                                <div class="progress-bar bg-danger" role="progressbar" style="width: ${(zScore/30)*100}%"></div>
                            </div>
                            <p class="text-light small mb-0">${zText}</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 p-3 rounded" style="background: rgba(212, 175, 55, 0.1); border: 1px dashed #d4af37;">
                    <h5 class="text-gold"><i class="fas fa-comment-dots"></i> คำแนะนำเพิ่มเติม</h5>
                    <p class="text-light mb-0 text-left">
                        ${totalScore >= 80 ? 'ท่านทั้งสองเป็นคู่ที่มีวาสนาต่อกันอย่างลึกซึ้ง พลังงานดวงชะตาส่งเสริมกันในทุกมิติ แนะนำให้หมั่นทำบุญร่วมกันเพื่อเสริมบารมีให้ยิ่งใหญ่ขึ้นไปอีก' : 
                          totalScore >= 60 ? 'ดวงชะตาของท่านทั้งสองอยู่ในเกณฑ์ปานกลาง มีจุดที่เกื้อหนุนและจุดที่ต้องปรับตัวเข้าหากัน แนะนำให้ใช้สติและเหตุผลในการครองคู่' : 
                          'พื้นดวงชะตามีความขัดแย้งกันค่อนข้างสูง (ดวงชง หรือกาลกิณี) ต้องอาศัยความอดทนและความเข้าใจอย่างมาก แนะนำให้ทำบุญปล่อยสัตว์ หรือแก้ชงร่วมกันเพื่อผ่อนหนักเป็นเบา'}
                    </p>
                </div>
            </div>
        `;

        resultDiv.innerHTML = html;
        
        // เลื่อนหน้าจอไปที่ผลลัพธ์
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, 1500);
}

window.initDeepSynastry = initDeepSynastry;
window.dsMemberSelected = dsMemberSelected;
window.calculateDeepSynastry = calculateDeepSynastry;
