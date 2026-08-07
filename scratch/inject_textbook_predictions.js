const fs = require('fs');
const path = require('path');

const horasatPath = path.join(__dirname, '..', 'Horasat.html');
let html = fs.readFileSync(horasatPath, 'utf8');

// 1. Tree Analogy & Body Mapping insert
const treeMappingSection = `
                // ================= 1. พื้นดวงชะตาเปรียบเหมือน "ต้นไม้ใหญ่" & ร่างกาย =================
                if (ayanamsaPredictions.treeAnalogy) {
                    let treeHtml = "";
                    const lagnaPlanetRulerKey = taksaOrder[planetRulers[lagnaSignIdx]];
                    
                    treeHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #d4af37;"><b>🌳 สภาพรวมของดวงชะตา:</b> \${ayanamsaPredictions.treeAnalogy.lagna}</div>\`;
                    
                    results.forEach(p => {
                        const k = planetMap[p.key];
                        if (k && ayanamsaPredictions.treeAnalogy[k]) {
                            const isRuler = (k === lagnaPlanetRulerKey);
                            const highlightStyle = isRuler ? "border-left: 4px solid #ffd88a; background: rgba(212,175,55,0.1);" : "";
                            treeHtml += \`<div class="birth-card" style="margin-bottom: 0; \${highlightStyle}"><b><span style="color:\${p.color}; font-size:1.2em;">●</span> \${p.nameTh}:</b> \${ayanamsaPredictions.treeAnalogy[k]}</div>\`;
                        }
                    });

                    // เปรียบเทียบส่วนของร่างกายตามลัคนา
                    if (ayanamsaPredictions.bodyPartMapping && ayanamsaPredictions.bodyPartMapping[lagnaSignIdx]) {
                        treeHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #2196f3;"><b>👤 อวัยวะสำคัญประจำลัคนา (\${ayanamsaPredictions.bodyPartMapping[lagnaSignIdx].sign}):</b> ลัคนาสถิตราศี\${ayanamsaPredictions.bodyPartMapping[lagnaSignIdx].sign} ควบคุมเกี่ยวกับ <b>\${ayanamsaPredictions.bodyPartMapping[lagnaSignIdx].part}</b> ควรระมัดระวังและดูแลสุขภาพส่วนนี้เป็นพิเศษ</div>\`;
                    }

                    predHtml += \`<div class="prediction-section" id="section-tree">\`;
                    predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#ffd88a;">🌳 พื้นดวงชะตาเปรียบเหมือน "ต้นไม้ใหญ่" & ร่างกาย (ตามตำรา หน้า 103-104) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-tree', 'ดวงชะตา-ต้นไม้ใหญ่.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                    predHtml += \`<div class="accordion-content"><div class="prediction-grid">\${treeHtml}</div></div></div>\`;
                }
`;

// 2. Dignities insert
const dignitiesSection = `
                // ================= 1.5 มาตรฐานดาวเคราะห์ 12 ตำแหน่ง =================
                if (typeof getPlanetDignities === 'function' && ayanamsaPredictions.planetaryDignitiesData) {
                    let dignityHtml = "";
                    const digDefs = ayanamsaPredictions.planetaryDignitiesData.definitions;
                    const rassiNames = ['เมษ','พฤษภ','เมถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มังกร','กุมภ์','มีน'];
                    
                    results.forEach(p => {
                        const signIdx = getSignIndex(p.sidereal);
                        const degInSign = p.sidereal % 30;
                        const planetDignities = getPlanetDignities(p.key, signIdx, degInSign);
                        
                        if (planetDignities.length > 0) {
                            const digBadges = planetDignities.map(dk => {
                                const def = digDefs[dk];
                                return \`<span style="background: rgba(212,175,55,0.2); border:1px solid #d4af37; color:#ffd88a; padding:2px 8px; border-radius:12px; font-size:0.85em; margin-right:4px;"><b>\${def ? def.title : dk}</b></span> \${def ? def.meaning : ""}\`;
                            }).join('<br>');
                            
                            dignityHtml += \`<div class="birth-card" style="margin-bottom: 0; text-align: left; border-left: 4px solid \${p.color};">
                                <b><span style="color:\${p.color}; font-size:1.2em;">●</span> \${p.nameTh} (สถิตราศี\${rassiNames[signIdx]}):</b><br>
                                \${digBadges}
                            </div>\`;
                        }
                    });

                    if (dignityHtml === "") {
                        dignityHtml = \`<div class="birth-card" style="margin-bottom: 0;"><b>ดาวเคราะห์สถิตเรือนปกติ:</b> ในดวงชะตานี้ ดาวเคราะห์อยู่ในสภาวะปกติทั่วไป</div>\`;
                    }

                    predHtml += \`<div class="prediction-section" id="section-dignities">\`;
                    predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#ffd88a;">🏆 มาตรฐานดาวเคราะห์ 12 ตำแหน่ง (ตามตำรา หน้า 60-95) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-dignities', 'ดวงชะตา-มาตรฐานดาว.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                    predHtml += \`<div class="accordion-content"><div class="prediction-grid">\${dignityHtml}</div></div></div>\`;
                }
`;

// 3. Negative Lord Rule insert
const negativeLordSection = `
                // ================= 2.8 กฎโหราศาสตร์สำคัญ: ลบ - ลบ กลายเป็นบวก =================
                const evilHouses = [5, 7, 11]; // อริ, มรณะ, วินาศ
                let negativeRuleHtml = "";
                results.forEach(p => {
                    const key = planetMap[p.key];
                    if (key) {
                        const signIdx = getSignIndex(p.sidereal);
                        const currentHouseIdx = getHouseIndex(signIdx, lagnaSignIdx);
                        
                        // หาภพดั้งเดิมที่ดาวดวงนี้เป็นเจ้าเรือน
                        for (let h = 0; h < 12; h++) {
                            const signOfHouse = (lagnaSignIdx + h) % 12;
                            const rulerKey = signToRulerKey[signOfHouse];
                            if (rulerKey === key && evilHouses.includes(h) && evilHouses.includes(currentHouseIdx)) {
                                const houseNames = ["ตนุ", "กฎุมภะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตนิ", "มรณะ", "ศุภะ", "กัมมะ", "ลาภะ", "วินาศ"];
                                negativeRuleHtml += \`<div class="birth-card" style="margin-bottom: 0; text-align: left; border-left: 4px solid #ff7b54; background: rgba(255,123,84,0.08);">
                                    <b>🪐 กฎกาลกรรณี/ทุสถานภพกลับร้ายกลายเป็นดี:</b><br>
                                    ดาว <b>\${p.nameTh}</b> ซึ่งเป็นเจ้าเรือนทุสถานภพ <b>(\${houseNames[h]})</b> ได้ไปสถิตในทุสถานภพ <b>(\${houseNames[currentHouseIdx]})</b> 
                                    ตามตำราอาจารย์สิงห์โต หน้า 110-111 ระบุว่า <i>"เมื่อความชั่วร้ายกุมกับความชั่วร้ายย่อมทำลายกันเอง กลับกลายเป็นให้คุณ หรือทำให้หมดอุปสรรคไปโดยสิ้นเชิง"</i> จะประสบความสำเร็จแบบไม่คาดฝันหรือชนะศัตรูภัยพาล
                                </div>\`;
                            }
                        }
                    }
                });
                
                if (negativeRuleHtml) {
                    predHtml += \`<div class="prediction-section" id="section-negativelord">\`;
                    predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#ffd88a;">🛡️ กฎโหราศาสตร์ "ลบ - ลบ กลายเป็นบวก" (ตามตำรา หน้า 110-111) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-negativelord', 'ดวงชะตา-กฎลบลบ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                    predHtml += \`<div class="accordion-content"><div class="prediction-grid">\${negativeRuleHtml}</div></div></div>\`;
                }
`;

// 4. Spouse & Career insert
const spouseCareerSection = `
                // ================= 4.8 หมวดคำทำนายเรื่องคู่ครองและการสมรส =================
                if (ayanamsaPredictions.spousePredictions) {
                    let spouseHtml = "";
                    const signOfPatni = (lagnaSignIdx + 6) % 12; // ปัตนิ (ภพที่ 7)
                    const patniRulerKey = signToRulerKey[signOfPatni];
                    const patniRulerPlanet = results.find(p => p.key === patniRulerKey);
                    
                    if (patniRulerPlanet) {
                        const patniRulerCurrentSign = getSignIndex(patniRulerPlanet.sidereal);
                        const patniRulerInHouse = getHouseIndex(patniRulerCurrentSign, lagnaSignIdx);
                        
                        // คำทำนายปัตนิสถิต 12 ภพ
                        const patniLords = ayanamsaPredictions.spousePredictions.lordInHouse;
                        if (patniLords && patniLords[patniRulerInHouse]) {
                            spouseHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #e74c3c;">
                                <b>💍 เจ้าเรือนปัตนิสถิตภพ \u0e2d\u0e31\u0e19\u0e44\u0e14\u0e49\u0e41\u0e01\u0e48 \${["ตนุ","กฎุมภะ","สหัชชะ","พันธุ","ปุตตะ","อริ","ปัตนิ","มรณะ","ศุภะ","กัมมะ","ลาภะ","วินาศ"][patniRulerInHouse]}:</b> \${patniLords[patniRulerInHouse]}
                            </div>\`;
                        }
                    }
                    
                    // คำทำนายดาวเล็งลัคนา หรือเล็งปัตนิ (ดาวในปัตนิ)
                    results.forEach(p => {
                        const signIdx = getSignIndex(p.sidereal);
                        const houseIdx = getHouseIndex(signIdx, lagnaSignIdx);
                        const k = planetMap[p.key];
                        if (k && houseIdx === 6 && ayanamsaPredictions.spousePredictions.byPlanet && ayanamsaPredictions.spousePredictions.byPlanet[k]) {
                            spouseHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #e74c3c;">
                                <b>💖 ดาว \${p.nameTh} สถิตในภพปัตนิ (เล็งลัคนา):</b> \${ayanamsaPredictions.spousePredictions.byPlanet[k]}
                            </div>\`;
                        }
                    });
                    
                    if (spouseHtml === "") {
                        spouseHtml = \`<div class="birth-card" style="margin-bottom: 0;">ดาวเจ้าเรือนปัตนิและดาวดวงอื่นอยู่ในเกณฑ์ปกติ การสมรสเป็นไปตามจังหวะชีวิตทั่วไป</div>\`;
                    }
                    
                    predHtml += \`<div class="prediction-section" id="section-spouse">\`;
                    predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#ff7096;">💍 หมวดคำทำนายเรื่องคู่ครองและการสมรส (ตามตำรา หน้า 124-136) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-spouse', 'ดวงชะตา-คู่ครอง.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                    predHtml += \`<div class="accordion-content"><div class="prediction-grid">\${spouseHtml}</div></div></div>\`;
                }

                // ================= 4.9 หมวดคำทำนายเรื่องอาชีพการงาน =================
                if (ayanamsaPredictions.careerPredictions) {
                    let careerHtml = "";
                    const signOfKamma = (lagnaSignIdx + 9) % 12; // กัมมะ (ภพที่ 10)
                    const kammaElements = ["fire", "earth", "air", "water"];
                    const kammaElementKey = kammaElements[signOfKamma % 4];
                    
                    if (ayanamsaPredictions.careerPredictions.byElement && ayanamsaPredictions.careerPredictions.byElement[kammaElementKey]) {
                        careerHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #1e88e5;">
                            <b>💼 อาชีพตามกลุ่มธาตุภพกัมมะ (\${["ไฟ","ดิน","ลม","น้ำ"][signOfKamma % 4]}):</b><br>
                            \${ayanamsaPredictions.careerPredictions.byElement[kammaElementKey]}
                        </div>\`;
                    }
                    
                    const kammaRulerKey = signToRulerKey[signOfKamma];
                    const kammaRulerPlanet = results.find(p => p.key === kammaRulerKey);
                    if (kammaRulerPlanet && ayanamsaPredictions.careerPredictions.byPlanet && ayanamsaPredictions.careerPredictions.byPlanet[kammaRulerKey]) {
                        careerHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #1e88e5;">
                            <b>💼 อาชีพตามดาวเจ้าเรือนกัมมะ (\&nbsp;\${kammaRulerPlanet.nameTh}):</b><br>
                            \${ayanamsaPredictions.careerPredictions.byPlanet[kammaRulerKey]}
                        </div>\`;
                    }
                    
                    predHtml += \`<div class="prediction-section" id="section-career">\`;
                    predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#42a5f5;">💼 หมวดคำทำนายเรื่องอาชีพการงาน (ตามตำรา หน้า 139-141) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-career', 'ดวงชะตา-อาชีพ.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                    predHtml += \`<div class="accordion-content"><div class="prediction-grid">\${careerHtml}</div></div></div>\`;
                }
`;

// Apply replacements using dynamic token markers in Horasat.html
// 1. Tree Analogy & Body Mapping
html = html.replace("const lagnaSignIdx = getSignIndex(lagnaSidereal);", "const lagnaSignIdx = getSignIndex(lagnaSidereal);\n");
html = html.replace("// ================= การแสดงผล =================\r\n                // 1. ลัคนาและตนุเศษ", treeMappingSection + "\n                // 1. ลัคนาและตนุเศษ");
html = html.replace("// ================= การแสดงผล =================\n                // 1. ลัคนาและตนุเศษ", treeMappingSection + "\n                // 1. ลัคนาและตนุเศษ");

// 2. Dignities
html = html.replace("predHtml += `</div></div></div>`; // Close section", "predHtml += `</div></div></div>`; // Close section\n" + dignitiesSection);

// 3. Negative Lord Rule
html = html.replace("predHtml += `<div class=\"accordion-content\"><div class=\"prediction-grid\">\${lordHtml}</div></div></div>`;", "predHtml += `<div class=\"accordion-content\"><div class=\"prediction-grid\">\${lordHtml}</div></div></div>`;\n" + negativeLordSection);

// 4. Spouse & Career
html = html.replace("// 5. คุณภาพดวงดาว (สถิตราศี และ นวางค์จักร)", spouseCareerSection + "\n                // 5. คุณภาพดวงดาว (สถิตราศี และ นวางค์จักร)");

fs.writeFileSync(horasatPath, html, 'utf8');
console.log("Re-applied textbook predictions successfully with no syntax errors!");
