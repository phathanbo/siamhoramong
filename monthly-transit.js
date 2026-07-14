document.addEventListener("DOMContentLoaded", () => {
    // Set initial date
    const now = new Date();
    document.getElementById("selectMonth").value = now.getMonth() + 1;
    document.getElementById("selectYear").value = now.getFullYear() + 543;
    
    document.getElementById("btnCalcTransit").addEventListener("click", calculateTransit);

// Modes
window.currentMode = "monthly";
const eyebrow = document.querySelector(".eyebrow");
const mainTitle = document.querySelector("h1");

document.getElementById("btnModeMonthly").addEventListener("click", () => {
    window.currentMode = "monthly";
    document.getElementById("btnModeMonthly").style.background = "rgba(201,164,92,0.2)";
    document.getElementById("btnModeMonthly").style.color = "#e8c876";
    document.getElementById("btnModeDaily").style.background = "transparent";
    document.getElementById("btnModeDaily").style.color = "#7d83ac";
    document.getElementById("monthlyControls").style.display = "inline-flex";
    document.getElementById("dailyControls").style.display = "none";
    if(eyebrow) eyebrow.innerHTML = "สยามโหรามงคล · ดวงดาวจรรายเดือน";
    if(mainTitle) mainTitle.innerHTML = "คำทำนายดาวจรประจำเดือน";
    calculateTransit();
});

document.getElementById("btnModeDaily").addEventListener("click", () => {
    window.currentMode = "daily";
    document.getElementById("btnModeDaily").style.background = "rgba(201,164,92,0.2)";
    document.getElementById("btnModeDaily").style.color = "#e8c876";
    document.getElementById("btnModeMonthly").style.background = "transparent";
    document.getElementById("btnModeMonthly").style.color = "#7d83ac";
    document.getElementById("monthlyControls").style.display = "none";
    document.getElementById("dailyControls").style.display = "inline-flex";
    if(eyebrow) eyebrow.innerHTML = "สยามโหรามงคล · ดวงดาวจรรายวัน";
    if(mainTitle) mainTitle.innerHTML = "คำทำนายดาวจรประจำวัน";
    
    if (!document.getElementById("selectTransitDate").value) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        document.getElementById("selectTransitDate").value = `${yyyy}-${mm}-${dd}`;
    }
    calculateTransit();
});
if(document.getElementById("btnCalcDaily")) {
    document.getElementById("btnCalcDaily").addEventListener("click", calculateTransit);
}

    
    // Check if Astronomy is loaded
    if (typeof Astronomy === 'undefined') {
        console.error("Astronomy engine not loaded");
        return;
    }
    
    
    // Initialize Personal Box from localStorage
    const isoDate = localStorage.getItem('userBirthdate');
    if (isoDate) document.getElementById("inpBirthDate").value = isoDate.split("T")[0];
    const bTime = localStorage.getItem('userBirthTime');
    if (bTime) document.getElementById("inpBirthTime").value = bTime;

    
    document.getElementById("btnPersonal").addEventListener("click", showPersonalTransit);
    
    // btnLoadProfile logic
    
    // Populate member select from localStorage
    const memberSelect = document.getElementById("memberSelect");
    if(memberSelect) {
        try {
            const historyStr = localStorage.getItem("horo_history");
            if (historyStr) {
                const history = JSON.parse(historyStr);
                if (history && Array.isArray(history)) {
                    history.forEach(member => {
                        const opt = document.createElement("option");
                        opt.value = JSON.stringify({
                            date: member.birthdate || member.birthDate || member.date,
                            time: member.birthtime || member.birthTime || member.time || "12:00"
                        });
                        opt.textContent = member.name || "ไม่มีชื่อ";
                        memberSelect.appendChild(opt);
                    });
                }
            }
        } catch(e) {
            console.error("Error loading members:", e);
        }

        memberSelect.addEventListener("change", (e) => {
            if(!e.target.value) return;
            const data = JSON.parse(e.target.value);
            if(data.date) {
                // If it's DD/MM/YYYY, we need to convert it, but horo_history usually saves ISO or DD/MM/YYYY
                // Let's assume ISO or simple format. Actually membermanager saves date as DD/MM/YYYY or YYYY-MM-DD
                let dateVal = data.date;
                if(dateVal.includes("/")) {
                    const parts = dateVal.split("/");
                    if(parts[2].length === 4) { // DD/MM/YYYY
                        dateVal = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                    }
                } else if (dateVal.includes("T")) {
                    dateVal = dateVal.split("T")[0];
                }
                document.getElementById("inpBirthDate").value = dateVal;
                document.getElementById("inpBirthTime").value = data.time || "12:00";
                showPersonalTransit();
            }
            // Reset select to default so user can re-select same person if needed
            e.target.value = "";
        });
    }
// Initial calculate
    calculateTransit();
});


function calculateTransit() {
    let targetDate;
    let yearEn, month, day;
    const thMonths = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    
    if (window.currentMode === "daily") {
        const dateStr = document.getElementById("selectTransitDate").value;
        if(!dateStr) return; // Wait until date is selected
        targetDate = new Date(dateStr + "T12:00:00Z"); // Fix noon UTC
        yearEn = targetDate.getUTCFullYear();
        month = targetDate.getUTCMonth() + 1;
        day = targetDate.getUTCDate();
        let yearTh = yearEn + 543;
        document.getElementById("reportTitle").innerHTML = `ประจำวันที่ ${day} ${thMonths[month]} พ.ศ. ${yearTh}`;
    } else {
        month = parseInt(document.getElementById("selectMonth").value);
        let yearTh = parseInt(document.getElementById("selectYear").value);
        yearEn = yearTh - 543;
        document.getElementById("reportTitle").innerHTML = `ประจำเดือน${thMonths[month]} พ.ศ. ${yearTh}`;
        targetDate = new Date(Date.UTC(yearEn, month - 1, 15, 12, 0, 0));
    }
    
    const ayanamsa = calculateLahiriAyanamsa(targetDate);
    
    let planets = [
        { key: "Sun", nameTh: "อาทิตย์", symbol: "☉", type: "minor" },
        { key: "Mars", nameTh: "อังคาร", symbol: "♂", type: "minor" },
        { key: "Mercury", nameTh: "พุธ", symbol: "☿", type: "minor" },
        { key: "Jupiter", nameTh: "พฤหัสฯ", symbol: "♃", type: "major" },
        { key: "Venus", nameTh: "ศุกร์", symbol: "♀", type: "minor" },
        { key: "Saturn", nameTh: "เสาร์", symbol: "♄", type: "major" },
        { key: "Rahu", nameTh: "ราหู", symbol: "☊", type: "major" },
        { key: "Ketu", nameTh: "เกตุ", symbol: "☋", type: "major" }
    ];
    
    if (window.currentMode === "daily") {
        planets.splice(1, 0, { key: "Moon", nameTh: "จันทร์", symbol: "☽", type: "minor" });
    }
    
    const positions = {};
    planets.forEach(p => {
        if (p.key === "Rahu" || p.key === "Ketu") {
            const moonNodes = getMoonNodes(targetDate);
            let lon = (p.key === "Rahu") ? moonNodes.rahu : moonNodes.ketu;
            let sidereal = (lon - ayanamsa + 360) % 360;
            positions[p.key] = { lon, sidereal, signIdx: Math.floor(sidereal / 30) };
        } else {
            let astroTime = Astronomy.MakeTime(targetDate);
            if (p.key === "Moon") {
                let vec = Astronomy.GeoMoon(astroTime);
                let ecl = Astronomy.Ecliptic(vec);
                let sidereal = (ecl.elon - ayanamsa + 360) % 360;
                positions[p.key] = { lon: ecl.elon, sidereal, signIdx: Math.floor(sidereal / 30) };
            } else {
                let vec = Astronomy.GeoVector(p.key, astroTime, true);
                let ecl = Astronomy.Ecliptic(vec);
                let sidereal = (ecl.elon - ayanamsa + 360) % 360;
                positions[p.key] = { lon: ecl.elon, sidereal, signIdx: Math.floor(sidereal / 30) };
            }
        }
    });
    
    drawWheel(planets, positions);
    generateHighlights(yearEn, month, planets, ayanamsa);
    generateCards(planets, positions);
}

function getJD(dateObj) {
    return (dateObj.getTime() / 86400000) + 2440587.5;
}

function calculateLahiriAyanamsa(dateObj) {
    const jd = getJD(dateObj);
    const t = (jd - 2451545.0) / 36525;
    return 23.85 + (1.396042 * t) + (0.000308 * t * t);
}
function getMoonNodes(dateObj) {
    const jd = getJD(dateObj);
    const T = (jd - 2451545.0) / 36525;
    let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
    omega = (omega % 360 + 360) % 360;
    return { rahu: omega, ketu: (omega + 180) % 360 };
}

const zodiacNames = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
const zodiacSymbols = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const zodiacDates = [
    "14 เม.ย. – 14 พ.ค.", "15 พ.ค. – 14 มิ.ย.", "15 มิ.ย. – 16 ก.ค.",
    "17 ก.ค. – 17 ส.ค.", "18 ส.ค. – 16 ก.ย.", "17 ก.ย. – 17 ต.ค.",
    "18 ต.ค. – 16 พ.ย.", "17 พ.ย. – 15 ธ.ค.", "16 ธ.ค. – 14 ม.ค.",
    "15 ม.ค. – 12 ก.พ.", "13 ก.พ. – 13 มี.ค.", "14 มี.ค. – 13 เม.ย."
];

function drawWheel(planets, positions) {
    const sectors = document.getElementById("sectors");
    if(!sectors) return;
    sectors.innerHTML = "";
    const cx = 200, cy = 200, rOuter = 180, rInner = 142;
    
    for (let i = 0; i < 12; i++) {
        let angle1 = i * 30 - 90 - 15;
        let angle2 = (i + 1) * 30 - 90 - 15;
        
        let a1Rad = angle1 * Math.PI / 180;
        let a2Rad = angle2 * Math.PI / 180;
        
        let x1_out = cx + rOuter * Math.cos(a1Rad);
        let y1_out = cy + rOuter * Math.sin(a1Rad);
        let x1_in = cx + rInner * Math.cos(a1Rad);
        let y1_in = cy + rInner * Math.sin(a1Rad);
        
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1_in);
        line.setAttribute("y1", y1_in);
        line.setAttribute("x2", x1_out);
        line.setAttribute("y2", y1_out);
        line.setAttribute("class", "sign-arc");
        sectors.appendChild(line);
        
        let midAngle = (angle1 + angle2) / 2;
        let midRad = midAngle * Math.PI / 180;
        let lx = cx + ((rOuter + rInner) / 2) * Math.cos(midRad);
        let ly = cy + ((rOuter + rInner) / 2) * Math.sin(midRad);
        
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", lx);
        text.setAttribute("y", ly);
        text.setAttribute("class", "sign-label");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.textContent = zodiacNames[i];
        sectors.appendChild(text);
    }
    
    const planetsGroup = document.getElementById("planetsGroup");
    planetsGroup.innerHTML = "";
    
    planets.forEach(p => {
        let pos = positions[p.key];
        let angle = pos.sidereal - 90 - 15;
        let rad = angle * Math.PI / 180;
        
        let rPlanet = rInner - 25 - (Math.random() * 20);
        let px = cx + rPlanet * Math.cos(rad);
        let py = cy + rPlanet * Math.sin(rad);
        
        let pText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        pText.setAttribute("x", px);
        pText.setAttribute("y", py);
        pText.setAttribute("class", "planet");
        pText.textContent = p.symbol;
        planetsGroup.appendChild(pText);
        
        let pLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        pLabel.setAttribute("x", px);
        pLabel.setAttribute("y", py + 14);
        pLabel.setAttribute("class", "planet-tag");
        pLabel.textContent = p.nameTh;
        planetsGroup.appendChild(pLabel);
    });
}

function generateHighlights(yearEn, month, planets, ayanamsa) {
    const list = document.getElementById("transitHighlightList");
    if(!list) return;
    list.innerHTML = "";
    
    const d1 = new Date(Date.UTC(yearEn, month - 1, 1, 12, 0, 0));
    const dLast = new Date(Date.UTC(yearEn, month, 0, 12, 0, 0));
    
    planets.forEach(p => {
        if(p.key === "Rahu" || p.key === "Ketu") return;
        
        let astroTime1 = Astronomy.MakeTime(d1);
        let vec1 = Astronomy.GeoVector(p.key, astroTime1, true);
        let ecl1 = Astronomy.Ecliptic(vec1);
        let sid1 = (ecl1.elon - ayanamsa + 360) % 360;
        let s1 = Math.floor(sid1 / 30);
        
        let astroTimeL = Astronomy.MakeTime(dLast);
        let vecL = Astronomy.GeoVector(p.key, astroTimeL, true);
        let eclL = Astronomy.Ecliptic(vecL);
        let sidL = (eclL.elon - ayanamsa + 360) % 360;
        let sL = Math.floor(sidL / 30);
        
        let li = document.createElement("li");
        let html = `<span class="glyph">${p.symbol}</span><span class="desc"><b>${p.nameTh}</b> `;
        
        if (s1 === sL) {
            html += `สถิตอยู่ใน <b>ราศี${zodiacNames[s1]}</b> ตลอดทั้งเดือน`;
            if (p.type === 'major') html += ` — ส่งอิทธิพลหลักอย่างต่อเนื่อง`;
        } else {
            html += `โคจรย้ายจาก <b>ราศี${zodiacNames[s1]}</b> เข้าสู่ <b>ราศี${zodiacNames[sL]}</b> ในช่วงเดือนนี้`;
        }
        html += `</span>`;
        li.innerHTML = html;
        list.appendChild(li);
    });
    
    let li = document.createElement("li");
    li.innerHTML = `<span class="glyph">☊☋</span><span class="desc"><b>ราหูและเกตุ</b> โคจรย้อนจักร (พักร์) ตามปกติ เป็นตัวกำหนดจุดเปลี่ยนแปรของโชคชะตา</span>`;
    list.appendChild(li);
}

function generateCards(planets, positions) {
    const grid = document.getElementById("predictionsGrid");
    if(!grid) return;
    grid.innerHTML = "";
    
    const keyMap = {
    "Sun": "sun",
    "Moon": "moon",
    "Mars": "mars",
    "Mercury": "mercury",
    "Jupiter": "jupiter",
    "Venus": "venus",
    "Saturn": "saturn",
    "Rahu": "rahu",
    "Ketu": "ketu"
};
    
    if (typeof ayanamsaPredictions === 'undefined') {
        console.error("ayanamsaPredictions is missing. Please ensure ayanamsa-data.js is loaded.");
        return;
    }
    
    
    for (let sign = 0; sign < 12; sign++) {
        let card = document.createElement("div");
        card.className = "card";
        card.id = "card-sign-" + sign;
        
        let html = `
            <button class="btn-save" onclick="saveCardAsImage(${sign})" title="บันทึกรูปภาพ">
                <i class="fas fa-download"></i> บันทึก
            </button>
            <h3><span class="glyph-big">${zodiacSymbols[sign]}</span> ราศี${zodiacNames[sign]}</h3>

            <div class="dates">${zodiacDates[sign]}</div>
        `;
        
        let tagsHtml = `<div class="tags">`;
        let descHtml = ``;
        
        planets.forEach(p => {
            let mappedKey = keyMap[p.key];
            let transitSign = positions[p.key].signIdx;
            let houseIdx = (transitSign - sign + 12) % 12; 
            
            let predText = "";
            let isMajor = (p.type === 'major');
            
            if (isMajor && ayanamsaPredictions.transitMajorPredictions[mappedKey]) {
                predText = ayanamsaPredictions.transitMajorPredictions[mappedKey][houseIdx].text;
                let tagClass = [0, 4, 8, 10, 1].includes(houseIdx) ? "good" : ([5, 7, 11].includes(houseIdx) ? "watch" : "");
                if(tagClass) tagsHtml += `<span class="tag ${tagClass}">${p.nameTh} เรือน ${houseIdx+1}</span>`;
            } else if (!isMajor && ayanamsaPredictions.transitMinorPredictions[mappedKey]) {
                predText = ayanamsaPredictions.transitMinorPredictions[mappedKey][houseIdx];
            }
            
            if (isMajor && predText) {
                descHtml += `<p><b>${p.nameTh}:</b> ${predText}</p>`;
            } else if (!isMajor && predText) {
                descHtml += `<p style="font-size: 0.85em; color: #a9afd6;"><b>${p.nameTh}:</b> ${predText}</p>`;
                if ([0, 9, 10].includes(houseIdx)) { 
                     tagsHtml += `<span class="tag good">${p.nameTh} เรือน ${houseIdx+1}</span>`;
                } else if ([7, 11].includes(houseIdx)) { 
                     tagsHtml += `<span class="tag watch">${p.nameTh} เรือน ${houseIdx+1}</span>`;
                }
            }
        });
        
        tagsHtml += `</div>`;
        
        card.innerHTML = html + descHtml + tagsHtml;
        grid.appendChild(card);
    }
}

function saveCardAsImage(sign) {
    const cardId = "card-sign-" + sign;
    const cardEl = document.getElementById(cardId);
    if(!cardEl) return;
    
    const btn = cardEl.querySelector('.btn-save');
    if(btn) btn.style.display = 'none'; // hide button for screenshot
    
    html2canvas(cardEl, {
        backgroundColor: '#151935',
        scale: 2 // good quality
    }).then(canvas => {
        if(btn) btn.style.display = 'block'; // show button again
        const link = document.createElement('a');
        link.download = `ดวงจร-ราศี${zodiacNames[sign]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        if(btn) btn.style.display = 'block';
        console.error("Error saving image:", err);
    });
}

function showPersonalTransit() {
    const dateStr = document.getElementById("inpBirthDate").value;
    if(!dateStr) {
        alert("กรุณาระบุวันเกิดครับ");
        return;
    }
    const timeStr = document.getElementById("inpBirthTime").value || "12:00";
    
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    
    // Save to localStorage so main program remembers
    localStorage.setItem('userBirthdate', dateStr);
    localStorage.setItem('userBirthTime', timeStr);
    
    // Calculate Sun Sidereal Sign (ราศีเกิดสุริยคตินิรายนะ)
    const birthDateUTC = new Date(Date.UTC(y, m - 1, d, hh - 7, mm, 0));
    const astroTime = Astronomy.MakeTime(birthDateUTC);
    const ayanamsa = calculateLahiriAyanamsa(birthDateUTC);
    
    const vec = Astronomy.GeoVector("Sun", astroTime, true);
    const ecl = Astronomy.Ecliptic(vec);
    const sidereal = (ecl.elon - ayanamsa + 360) % 360;
    const signIdx = Math.floor(sidereal / 30);
    
    // Highlight and scroll to the card
    const cardId = "card-sign-" + signIdx;
    const cardEl = document.getElementById(cardId);
    if(cardEl) {
        // Remove highlight from all cards
        document.querySelectorAll('.card').forEach(el => el.classList.remove('highlight-card'));
        
        // Add highlight to target card
        cardEl.classList.add('highlight-card');
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


function saveWheelSection() {
    const sectionEl = document.getElementById("wheelSectionContainer");
    if(!sectionEl) return;
    
    const btn = document.getElementById("btnSaveWheel");
    if(btn) btn.style.display = 'none'; // hide button for screenshot
    
    html2canvas(sectionEl, {
        backgroundColor: '#0d0f1f', // Use the background of the body for a seamless look
        scale: 2 
    }).then(canvas => {
        if(btn) btn.style.display = 'block'; 
        const link = document.createElement('a');
        const month = document.getElementById("selectMonth").options[document.getElementById("selectMonth").selectedIndex].text;
        const year = document.getElementById("selectYear").value;
        link.download = `แผ่นดาวจรเด่น-${month}-${year}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        if(btn) btn.style.display = 'block';
        console.error("Error saving image:", err);
    });
}
