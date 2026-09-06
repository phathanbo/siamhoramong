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
    const selectEl = document.getElementById(`dsMemberSelect${personNum}`);
    if (!selectEl) return;
    const memberId = selectEl.value;
    if (!memberId) return;

    // First try data-member attribute
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    let member = null;
    if (selectedOption && selectedOption.getAttribute('data-member')) {
        try {
            member = JSON.parse(selectedOption.getAttribute('data-member'));
        } catch (e) {}
    }

    if (!member) {
        const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
        member = allHistory.find(m => m.memberId === memberId || m.id === memberId || m.birthdate === memberId);
    }
    
    if (member) {
        if (member.birthdate) {
            let formatted = "";
            if (member.birthdate.includes('/')) {
                const parts = member.birthdate.split('/');
                if (parts.length === 3) {
                    let year = parseInt(parts[2]);
                    if (year > 2400) year -= 543;
                    formatted = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            } else if (member.birthdate.includes('-')) {
                const parts = member.birthdate.split('-');
                if (parts.length === 3) {
                    let year = parseInt(parts[0]);
                    if (year > 2400) year -= 543;
                    formatted = `${year}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                }
            }
            if (formatted) {
                const bEl = document.getElementById(`dsBirthDate${personNum}`);
                if (bEl) bEl.value = formatted;
            }
        }
        if (member.gender) {
            const genderVal = (member.gender === 'm' || member.gender === 'male' || member.gender === 'ชาย') ? 'male' : 'female';
            const gEl = document.getElementById(`dsGender${personNum}`);
            if (gEl) gEl.value = genderVal;
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
            <div class="card border-0 rounded-4 p-3 p-md-4 mb-4 shadow-lg text-center" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid rgba(212, 175, 55, 0.4) !important;">
                <h3 class="fw-bold mb-4" style="font-family: 'Chonburi', serif; color: #ffd700; font-size: 1.4rem;">
                    <i class="fas fa-gem me-2"></i> ผลลัพธ์การผูกดวงคู่สมพงษ์ VIP
                </h3>
                
                <div class="row align-items-center justify-content-center g-3 mb-4">
                    <!-- ฝ่ายที่ 1 -->
                    <div class="col-md-4 col-4 text-center">
                        <div class="p-2 p-md-3 rounded-4" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);">
                            <div class="mb-2">
                                <i class="fas ${g1 === 'male' ? 'fa-male text-info' : 'fa-female text-danger'} fa-3x"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-1" style="font-size: 1.05rem;">ฝ่ายที่ ๑</h5>
                            <div class="small text-white-50">วัน${thaiDayNames[day1]}</div>
                            <div class="badge mt-1" style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4);">
                                ปี${z1} (ธาตุ${e1})
                            </div>
                        </div>
                    </div>
                    
                    <!-- คะแนนรวม -->
                    <div class="col-md-4 col-4 text-center">
                        <div class="p-2 p-md-3 rounded-4" style="background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0.4) 100%); border: 1.5px dashed ${gradeColor};">
                            <div class="display-4 fw-bold mb-1" style="color: ${gradeColor}; text-shadow: 0 0 15px ${gradeColor}; font-size: clamp(2rem, 5vw, 3.2rem);">
                                ${totalScore}%
                            </div>
                            <div class="badge px-2 py-1 px-md-3 py-md-2 rounded-pill fw-bold text-wrap" style="background-color: ${gradeColor}; color: #000; font-size: 0.95rem;">
                                ${gradeText}
                            </div>
                        </div>
                    </div>

                    <!-- ฝ่ายที่ 2 -->
                    <div class="col-md-4 col-4 text-center">
                        <div class="p-2 p-md-3 rounded-4" style="background: rgba(244, 114, 182, 0.1); border: 1px solid rgba(244, 114, 182, 0.3);">
                            <div class="mb-2">
                                <i class="fas ${g2 === 'male' ? 'fa-male text-info' : 'fa-female text-danger'} fa-3x"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-1" style="font-size: 1.05rem;">ฝ่ายที่ ๒</h5>
                            <div class="small text-white-50">วัน${thaiDayNames[day2]}</div>
                            <div class="badge mt-1" style="background: rgba(244, 114, 182, 0.2); color: #f472b6; border: 1px solid rgba(244, 114, 182, 0.4);">
                                ปี${z2} (ธาตุ${e2})
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="border-gold opacity-25 mb-4">

                <!-- 3 มิติวิเคราะห์ -->
                <div class="row text-start g-3 mb-4">
                    <div class="col-md-4 col-12">
                        <div class="p-3 rounded-3 h-100" style="background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.25);">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h6 class="fw-bold text-warning mb-0"><i class="fas fa-star-and-crescent me-1"></i> ๑. มหาทักษา</h6>
                                <span class="badge bg-warning text-dark">${Math.round((taksaScore/40)*100)}%</span>
                            </div>
                            <div class="progress mb-2" style="height: 8px; background-color: rgba(255,255,255,0.1); border-radius: 4px;">
                                <div class="progress-bar bg-warning" role="progressbar" style="width: ${(taksaScore/40)*100}%"></div>
                            </div>
                            <p class="small text-light mb-0" style="line-height: 1.6;">${taksaText}</p>
                        </div>
                    </div>
                    
                    <div class="col-md-4 col-12">
                        <div class="p-3 rounded-3 h-100" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25);">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h6 class="fw-bold text-info mb-0"><i class="fas fa-water me-1"></i> ๒. ธาตุกำเนิด</h6>
                                <span class="badge bg-info text-dark">${Math.round((elemScore/30)*100)}%</span>
                            </div>
                            <div class="progress mb-2" style="height: 8px; background-color: rgba(255,255,255,0.1); border-radius: 4px;">
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${(elemScore/30)*100}%"></div>
                            </div>
                            <p class="small text-light mb-0" style="line-height: 1.6;">${elemText}</p>
                        </div>
                    </div>
                    
                    <div class="col-md-4 col-12">
                        <div class="p-3 rounded-3 h-100" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25);">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h6 class="fw-bold text-danger mb-0"><i class="fas fa-dragon me-1"></i> ๓. ปีนักษัตร</h6>
                                <span class="badge bg-danger text-light">${Math.round((zScore/30)*100)}%</span>
                            </div>
                            <div class="progress mb-2" style="height: 8px; background-color: rgba(255,255,255,0.1); border-radius: 4px;">
                                <div class="progress-bar bg-danger" role="progressbar" style="width: ${(zScore/30)*100}%"></div>
                            </div>
                            <p class="small text-light mb-0" style="line-height: 1.6;">${zText}</p>
                        </div>
                    </div>
                </div>
                
                <!-- คำแนะนำ -->
                <div class="p-3 rounded-3 text-start" style="background: rgba(212, 175, 55, 0.1); border: 1px dashed rgba(212,175,55,0.4);">
                    <h6 class="fw-bold text-gold mb-2"><i class="fas fa-comment-dots me-1"></i> คำแนะนำและเคล็ดลับการครองคู่</h6>
                    <p class="small text-light mb-0" style="line-height: 1.7;">
                        ${totalScore >= 80 ? '🌟 ท่านทั้งสองเป็นคู่ที่มีวาสนาต่อกันอย่างลึกซึ้ง พลังงานดวงชะตาส่งเสริมกันในทุกมิติ แนะนำให้หมั่นทำบุญร่วมกันเพื่อเสริมบารมีให้ยิ่งใหญ่และมั่นคงยืนนาน' : 
                          totalScore >= 60 ? '⚖️ ดวงชะตาของท่านทั้งสองอยู่ในเกณฑ์ปานกลาง มีจุดที่เกื้อหนุนและจุดที่ต้องปรับตัวเข้าหากัน แนะนำให้ใช้สติ ความประนีประนอม และเหตุผลในการครองคู่' : 
                          '⚠️ พื้นดวงชะตามีความขัดแย้งกันค่อนข้างสูง (ดวงชง หรือกาลกิณี) ต้องอาศัยความอดทน ความเข้าใจ และการให้อภัยอย่างมาก แนะนำให้ทำบุญปล่อยสัตว์ หรือทำบุญร่วมกันเพื่อผ่อนหนักเป็นเบา'}
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
