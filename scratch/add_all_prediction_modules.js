const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');
let norm = code.replace(/\r\n/g, '\n');

const targetAnchor = '                // 5. คุณภาพดวงดาว (สถิตราศี และ นวางค์จักร)';

const newModulesCode = `
                // =========================================================================
                // 🌟 ระบบคำทำนายที่เพิ่มเพิ่มเติม (6 ระบบทรงคุณค่า)
                // =========================================================================

                // 1. ระบบปีนักษัตร & ธาตุประจำตัวกำเนิด (จาก thai-astrology-data.js)
                if (typeof ThaiAstrologyData !== 'undefined') {
                    const birthYearVal = parseInt(dignityDateStr ? dignityDateStr.substring(0, 4) : y);
                    if (!isNaN(birthYearVal)) {
                        const zodiacObj = ThaiAstrologyData.getZodiacByYear(birthYearVal);
                        const elementObj = ThaiAstrologyData.getElementByYear(birthYearVal);
                        if (zodiacObj && elementObj) {
                            let zodiacHtml = \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #00cc66;">
                                <b>🐉 ปีนักษัตรกำเนิด:</b> \${zodiacObj.data.name} (\${zodiacObj.data.animal}) ธาตุประจำปี: \${zodiacObj.data.element}<br>
                                <b>☯️ ธาตุทางโหราศาสตร์ (\${elementObj.data.name} / \${elementObj.data.element} \${elementObj.data.symbol}):</b> \${elementObj.data.influence}<br>
                                <span style="color:#88ffbb;">• สีโชคดี:</span> \${elementObj.data.luckyColor} | <span style="color:#ff8a80;">• สีควรหลีกเลี่ยง:</span> \${elementObj.data.avoidColor} | ธาตุตรงข้าม: \${elementObj.data.opposite}
                            </div>\`;

                            predHtml += \`<div class="prediction-section pred-card-item" id="section-zodiac-element" data-category="personality">
                                <div class="section-header"><h3>🐉 ธาตุและปีนักษัตรกำเนิด <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Thai Zodiac & Elements)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-zodiac-element', 'ดวงชะตา-ปีนักษัตร.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                                <div class="prediction-grid">\${zodiacHtml}</div>
                            </div>\`;
                        }
                    }
                }

                // 2. ระบบดาวคู่อันตราย / มิตร-ศัตรู-สมพล-ธาตุ
                const aspectPairRules = [
                    // คู่มิตร
                    { planets: ['sun', 'venus'], type: 'คู่มิตร (อาทิตย์-ศุกร์)', desc: 'ผู้คนเมตตาอุปถัมภ์ เสน่ห์เมตตาสูง ผู้ใหญ่อุปถัมภ์ค้ำชู', positive: true },
                    { planets: ['moon', 'jupiter'], type: 'คู่มิตร (จันทร์-พฤหัส)', desc: 'มีสติปัญญา ศีลธรรม ผู้ใหญ่เมตตา รักการเรียนรู้', positive: true },
                    { planets: ['mars', 'rahu'], type: 'คู่มิตร (อังคาร-ราหู)', desc: 'กล้าหาญ เด็ดเดี่ยว ทันคน ชนะศัตรูเสี่ยงโชคดี', positive: true },
                    { planets: ['mercury', 'saturn'], type: 'คู่มิตร (พุธ-เสาร์)', desc: 'วางแผนแยบคาย รอบคอบ ละเอียด มุ่งมั่นถาวร', positive: true },
                    // คู่ศัตรู
                    { planets: ['sun', 'mars'], type: 'คู่ศัตรู (อาทิตย์-อังคาร)', desc: 'ใจร้อน วู่วาม ระวังอุบัติเหตุ ความขัดแย้ง ทะเลาะวิวาท', positive: false },
                    { planets: ['moon', 'saturn'], type: 'คู่ศัตรู (จันทร์-เสาร์)', desc: 'อมทุกข์ คิดมาก วิตกกังวล พลัดพรากจากสิ่งที่รัก', positive: false },
                    { planets: ['mercury', 'rahu'], type: 'คู่ศัตรู (พุธ-ราหู)', desc: 'ระวังคำพูด ถูกหลอกลวง การผิดสัญญา คดีความ', positive: false },
                    { planets: ['jupiter', 'venus'], type: 'คู่ศัตรูมิตรภาพ (พฤหัส-ศุกร์)', desc: 'ผิดศีลธรรมความรัก หรือขัดแย้งเรื่องหลักการและความต้องการ', positive: false },
                    // คู่สมพล
                    { planets: ['sun', 'saturn'], type: 'คู่สมพล (อาทิตย์-เสาร์)', desc: 'มีความอดทนฝ่าฟัน มุ่งมั่น ยิ่งใหญ่อำนาจสูง', positive: true },
                    { planets: ['moon', 'rahu'], type: 'คู่สมพล (จันทร์-ราหู)', desc: 'มีเสน่ห์ลึกลับ จินตนาการกว้างไกล การค้าทางไกลดี', positive: true },
                    { planets: ['mars', 'jupiter'], type: 'คู่สมพล (อังคาร-พฤหัส)', desc: 'ขยันทรงพลัง งานสำเร็จตามเป้าหมาย ยศตำแหน่งดี', positive: true },
                    { planets: ['mercury', 'venus'], type: 'คู่สมพล (พุธ-ศุกร์)', desc: 'วาทศิลป์เป็นเลิศ ค้าขายเจรจาสมปรารถนา', positive: true },
                    // คู่ธาตุ
                    { planets: ['sun', 'saturn'], type: 'คู่ธาตุไฟ', desc: 'พลังสร้างสรรค์ ความเด็ดขาด มุ่งมั่นรวดเร็ว', positive: true },
                    { planets: ['moon', 'mercury'], type: 'คู่ธาตุดิน', desc: 'ความมั่นคงถาวร วางแผนอสังหาฯ และเงินทองดี', positive: true },
                    { planets: ['mars', 'jupiter'], type: 'คู่ธาตุลม', desc: 'ความคิดกว้างไกล ปรับตัวได้รวดเร็ว', positive: true },
                    { planets: ['venus', 'rahu'], type: 'คู่ธาตุน้ำ', desc: 'ลาภผลไหลมาเทมา ความรักอุดมสมบูรณ์', positive: true }
                ];

                let pairHtml = "";
                // จัดกลุ่มดาวตามราศี
                const planetInSignMap = {};
                results.forEach(p => {
                    const s = getSignIndex(p.sidereal);
                    if (!planetInSignMap[s]) planetInSignMap[s] = [];
                    planetInSignMap[s].push(p);
                });

                for (const sIdx in planetInSignMap) {
                    const pList = planetInSignMap[sIdx];
                    if (pList.length >= 2) {
                        const keysInSign = pList.map(p => p.key);
                        aspectPairRules.forEach(rule => {
                            if (keysInSign.includes(rule.planets[0]) && keysInSign.includes(rule.planets[1])) {
                                const borderCol = rule.positive ? '#00cc66' : '#ff5252';
                                const tagCol = rule.positive ? '#88ffbb' : '#ff8a80';
                                pairHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid \${borderCol};">
                                    <b style="color:\${tagCol};">⚡ \${rule.type}:</b> กุมกันสถิตราศี\${['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'][sIdx]}<br>
                                    <span style="color:#c0dfc8;">\${rule.desc}</span>
                                </div>\`;
                            }
                        });
                    }
                }

                if (pairHtml) {
                    predHtml += \`<div class="prediction-section pred-card-item" id="section-pair-aspects" data-category="personality">
                        <div class="section-header"><h3>⚡ วิเคราะห์ดาวกุมคู่มิตร-ศัตรู-สมพล-ธาตุ <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Special Planetary Combinations)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-pair-aspects', 'ดวงชะตา-ดาวคู่พิเศษ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                        <div class="prediction-grid">\${pairHtml}</div>
                    </div>\`;
                }

                // 3. ระบบพินทุบาทว์ (ดวงแตก/ดวงร้าว จุดเปราะบางดวงชะตา)
                let phintuHtml = "";
                results.forEach(p => {
                    const signIdx = getSignIndex(p.sidereal);
                    const houseIdx = getHouseIndex(signIdx, lagnaSignIdx); // 0..11
                    const hNum = houseIdx + 1; // 1..12

                    // เกณฑ์พินทุบาทว์ตามโหราศาสตร์ไทย:
                    // เสาร์/เพ่งลัคน์ (ภพ 7, 8, 12) | อังคาร (ภพ 3, 7, 8) | ราหู (ภพ 7, 8, 12) | อาทิตย์ (ภพ 7, 8, 11)
                    if (p.key === 'saturn' && [7, 8, 12].includes(hNum)) {
                        phintuHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #ff5252;">
                            <b style="color:#ff8a80;">⚠️ เสาร์เล็ง/เบียดลัคน์ (ภพ \${hNum}):</b> "เสาร์เพ่งลัคน์เกาะแปด... ให้ระวังความทุกข์ใจ อุปสรรคในเรื่องคู่และภาระความรับผิดชอบสูง"
                        </div>\`;
                    } else if (p.key === 'mars' && [3, 7, 8].includes(hNum)) {
                        phintuHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #ff5252;">
                            <b style="color:#ff8a80;">⚠️ อังคารสถิตภพ \${hNum}:</b> "อังคารเป็นเจ็ดอาจมีคู่ยาก หรือระวังการทะเลาะวิวาท อารมณ์ร้อน และอุบัติเหตุ"
                        </div>\`;
                    } else if (p.key === 'rahu' && [7, 8, 12].includes(hNum)) {
                        phintuHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #ff5252;">
                            <b style="color:#ff8a80;">⚠️ ราหูสถิตภพ \${hNum}:</b> "ราหูเล็งลัคนา/สถิตภพเปราะบาง ระวังความลุ่มหลง หูเบา คดีความ หรือปัญหาการเงินลุ่มๆ ดอนๆ"
                        </div>\`;
                    } else if (p.key === 'sun' && [7, 8].includes(hNum)) {
                        phintuHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #ff5252;">
                            <b style="color:#ff8a80;">⚠️ อาทิตย์สถิตภพ \${hNum}:</b> "อาทิตย์เล็งลัคนา ระวังทิฐิ ยศตำแหน่ง อารมณ์ร้อนกระทบความสัมพันธ์"
                        </div>\`;
                    }
                });

                if (phintuHtml) {
                    predHtml += \`<div class="prediction-section pred-card-item" id="section-phintu" data-category="personality">
                        <div class="section-header"><h3>⚠️ วิเคราะห์จุดเปราะบางดวงชะตา (พินทุบาทว์) <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Astrological Caution Points)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-phintu', 'ดวงชะตา-พินทุบาทว์.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                        <div class="prediction-grid">\${phintuHtml}</div>
                    </div>\`;
                }

                // 4. ระบบวิเคราะห์สุขภาพและอวัยวะตามราศี
                if (ayanamsaPredictions.bodyPartMapping) {
                    let healthHtml = "";
                    const maleficKeys = ['saturn', 'rahu', 'mars', 'uranus'];
                    results.forEach(p => {
                        if (maleficKeys.includes(p.key)) {
                            const signIdx = getSignIndex(p.sidereal);
                            const houseIdx = getHouseIndex(signIdx, lagnaSignIdx); // 0-indexed
                            // หากสถิตเรือน อริ (5), มรณะ (7), วินาศ (11)
                            if ([5, 7, 11].includes(houseIdx)) {
                                const bodyPart = ayanamsaPredictions.bodyPartMapping[signIdx];
                                const houseNames = ["ตนุ","กฎุมภะ","สหัชชะ","พันธุ","ปุตตะ","อริ","ปัตนิ","มรณะ","ศุภะ","กัมมะ","ลาภะ","วินาศ"];
                                healthHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #ff9800;">
                                    <b style="color:#ffb74d;">🏥 ดาว \${p.nameTh} สถิตภพ\${houseNames[houseIdx]} (ราศี\${['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'][signIdx]}):</b><br>
                                    ควรระมัดระวังเกี่ยวกับอวัยวะส่วน <span style="color:#88ffbb; font-weight:bold;">"\${bodyPart}"</span> เป็นพิเศษ (เช่น อาการอักเสบ ปวดเรื้อรัง หรือการผ่าตัด)
                                </div>\`;
                            }
                        }
                    });
                    if (healthHtml) {
                        predHtml += \`<div class="prediction-section pred-card-item" id="section-health" data-category="personality">
                            <div class="section-header"><h3>🏥 วิเคราะห์สุขภาพและอวัยวะที่ควรระวัง <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Health & Body Analysis)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-health', 'ดวงชะตา-สุขภาพ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                            <div class="prediction-grid">\${healthHtml}</div>
                        </div>\`;
                    }
                }

                // 5. ระบบตนุเศษสถิตภพ (จิตใต้สำนึกแท้จริง)
                if (tanuSedKey) {
                    const tanuSedPlanet = results.find(p => p.key === tanuSedKey);
                    if (tanuSedPlanet) {
                        const tanuSedSignIdx = getSignIndex(tanuSedPlanet.sidereal);
                        const tanuSedHouseIdx = getHouseIndex(tanuSedSignIdx, lagnaSignIdx);
                        const houseNames = ["ตนุ (ตนเอง)", "กฎุมภะ (การเงิน)", "สหัชชะ (มิตรสหาย)", "พันธุ (ครอบครัว)", "ปุตตะ (การลงทุน/บุตร)", "อริ (อุปสรรค)", "ปัตนิ (คนรัก/คู่ค้า)", "มรณะ (การเปลี่ยนแปลง)", "ศุภะ (ความสำเร็จ)", "กัมมะ (การงาน)", "ลาภะ (โชคลาภ)", "วินาศ (ความเร้นลับ)"];
                        
                        const tanuSedDesc = [
                            "ยึดถือตนเองเป็นหลัก มีความเชื่อมั่นสูง รักอิสระ ทำอะไรตามใจตนเอง",
                            "ให้ความสำคัญกับเงินทอง ทรัพย์สิน ความมั่นคง และการสร้างรายได้เป็นอันดับหนึ่ง",
                            "ให้ความสำคัญกับสังคม สื่อสาร การคบค้าสมาคม เพื่อนฝูง การเดินทาง",
                            "ยึดติดกับครอบครัว บ้านเรือน ญาติพี่น้อง ต้องการรากฐานชีวิตที่มั่นคง",
                            "ชอบความท้าทาย สนใจสิ่งใหม่ๆ การลงทุน บุตรบริวาร งานโปรเจกต์ใหม่",
                            "จิตใจชอบต่อสู้ แก้ไขปัญหาอุปสรรค ไม่ยอมแพ้ ชอบเอาชนะ",
                            "ให้ความสำคัญกับคู่ครอง หุ้นส่วน เพศตรงข้าม ความสัมพันธ์",
                            "จิตใจชอบเรื่องลึกลับ การเปลี่ยนแปลง ชอบความสันโดษ หรือสนใจเรื่องโหราศาสตร์/วิทยาศาสตร์",
                            "มุ่งหวังความเจริญก้าวหน้า คุณธรรม การศึกษา อนาคตอันไกล",
                            "มุ่งมั่นเรื่องงาน อาชีพ ตำแหน่งหน้าที่การงาน รับผิดชอบสูง",
                            "แสวงหาลาภผล ความสำเร็จ โชคลาภ มิตรภาพ และความสุข",
                            "ชอบความเงียบสงบ ความลับ การวางแผนเบื้องหลัง ทำงานปิดทองหลังพระ"
                        ];

                        let tanuSedHtml = \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #00cc66;">
                            <b style="color:#88ffbb;">🧠 ดาวตนุเศษ (\${tanuSedPlanet.nameTh}) สถิตภพ\${houseNames[tanuSedHouseIdx]}:</b><br>
                            \${tanuSedDesc[tanuSedHouseIdx]}
                        </div>\`;

                        predHtml += \`<div class="prediction-section pred-card-item" id="section-tanused-house" data-category="personality">
                            <div class="section-header"><h3>🧠 วิเคราะห์จิตใต้สำนึกแท้จริง (ตนุเศษสถิตภพ) <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Inner Mind Focus)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-tanused-house', 'ดวงชะตา-ตนุเศษสถิตภพ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                            <div class="prediction-grid">\${tanuSedHtml}</div>
                        </div>\`;
                    }
                }

                // 6. ระบบตรียางค์พิษ (ครุฑพิษ, นาคพิษ, สุนัขพิษ)
                let poisonHtml = "";
                results.forEach(p => {
                    const sid = p.sidereal;
                    const decanSignIdx = getDecanSign(sid);
                    const degInSign = sid % 30;
                    const decanNum = Math.floor(degInSign / 10) + 1; // 1, 2, 3

                    // ตรียางค์พิษตามหลักโหรไทย:
                    // ครุฑพิษ (ตรียางค์ที่ 1 ของราศีสิงห์, พิจิก, ธนู)
                    // นาคพิษ (ตรียางค์ที่ 2 ของราศีพฤษภ, กันย์, มังกร)
                    // สุนัขพิษ (ตรียางค์ที่ 3 ของราศีเมษ, กรกฎ, ตุลย์)
                    const signIdx = getSignIndex(sid);
                    if ([4, 7, 8].includes(signIdx) && decanNum === 1) {
                        poisonHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #e65100;">
                            <b style="color:#ffb74d;">🦅 ดาว \${p.nameTh} ต้องเกณฑ์ "ครุฑพิษ" (ตรียางค์ 1 ราศี\${['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'][signIdx]}):</b><br>
                            ระวังภัยจากที่สูง ลม สารเคมี พิษไข้ หรือภัยอันตรายจากสัตว์มีปีก
                        </div>\`;
                    } else if ([1, 5, 9].includes(signIdx) && decanNum === 2) {
                        poisonHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #e65100;">
                            <b style="color:#ffb74d;">🐍 ดาว \${p.nameTh} ต้องเกณฑ์ "นาคพิษ" (ตรียางค์ 2 ราศี\${['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'][signIdx]}):</b><br>
                            ระวังภัยทางน้ำ สารพิษ ยาเสพติด หรือภัยอันตรายจากสัตว์เลื้อยคลาน
                        </div>\`;
                    } else if ([0, 3, 6].includes(signIdx) && decanNum === 3) {
                        poisonHtml += \`<div class="birth-card" style="margin-bottom:0; text-align:left; border-left:4px solid #e65100;">
                            <b style="color:#ffb74d;">🐕 ดาว \${p.nameTh} ต้องเกณฑ์ "สุนัขพิษ" (ตรียางค์ 3 ราศี\${['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'][signIdx]}):</b><br>
                            ระวังภัยจากสัตว์สี่เท้ากัดข่วน พิษสุนัขบ้า หรือคำพูดของคนยุยงใส่ร้าย
                        </div>\`;
                    }
                });

                if (poisonHtml) {
                    predHtml += \`<div class="prediction-section pred-card-item" id="section-poison-decan" data-category="personality">
                        <div class="section-header"><h3>☣️ เกณฑ์ตรียางค์พิษที่ควรระวัง <small style="font-weight:400; color:#4a7a5a; font-size:0.8em;">(Decan Poison Cautions)</small></h3><button class="export-btn-sm hide-on-export" onclick="exportSection(this, 'section-poison-decan', 'ดวงชะตา-ตรียางค์พิษ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>
                        <div class="prediction-grid">\${poisonHtml}</div>
                    </div>\`;
                }

                ${targetAnchor}`;

if (norm.includes(targetAnchor)) {
    norm = norm.replace(targetAnchor, newModulesCode);
    fs.writeFileSync(file, norm.split('\n').join('\r\n'), 'utf8');
    console.log('Successfully added all 6 prediction modules to Horasat.html!');
} else {
    console.error('Target anchor not found!');
}
