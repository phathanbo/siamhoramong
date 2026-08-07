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

async function saveCardAsImage(sign) {
    const cardId = "card-sign-" + sign;
    const cardEl = document.getElementById(cardId);
    if(!cardEl) return;
    
    const width = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = 3000;
    const ctx = canvas.getContext('2d');
    
    await document.fonts.ready;
    
    const drawContent = (isMeasure = false) => {
        let cy = 100;
        const cx = 80;
        const maxW = width - 160;
        
        if (!isMeasure) {
            let grad = ctx.createLinearGradient(0, 0, width, canvas.height);
            grad.addColorStop(0, '#232a56');
            grad.addColorStop(1, '#151935');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, canvas.height);
            
            let rGrad = ctx.createRadialGradient(width-60, 60, 0, width-60, 60, 300);
            rGrad.addColorStop(0, 'rgba(232,200,118,0.18)');
            rGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = rGrad;
            ctx.fillRect(0, 0, width, canvas.height);
            
            ctx.strokeStyle = 'rgba(201,164,92,0.35)';
            ctx.lineWidth = 4;
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(20, 20, width - 40, canvas.height - 40, 25);
                ctx.stroke();
            } else {
                ctx.strokeRect(20, 20, width - 40, canvas.height - 40);
            }
        }
        
        const sym = zodiacSymbols[sign];
        const title = `ราศี${zodiacNames[sign]}`;
        const dates = zodiacDates[sign];
        
        if (!isMeasure) {
            ctx.font = '700 70px "Chonburi"';
            ctx.fillStyle = '#e8c876';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`${sym} ${title}`, cx, cy);
            
            ctx.font = '400 32px "Sarabun"';
            ctx.fillStyle = '#9aa0c9';
            ctx.fillText(dates, cx, cy + 90);
        }
        cy += 160;
        
        const paragraphs = Array.from(cardEl.querySelectorAll('p'));
        for(let p of paragraphs) {
            let text = p.innerText;
            ctx.font = '400 36px "Sarabun"';
            let isMinor = p.style.color === 'rgb(169, 175, 214)' || p.style.color === '#a9afd6' || p.style.fontSize === '0.85em';
            
            let pLines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                const segments = segmenter.segment(text);
                let currentLine = "";
                for (const {segment} of segments) {
                    const testLine = currentLine + segment;
                    if (ctx.measureText(testLine).width > maxW && currentLine.trim() !== '') {
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
                    if (ctx.measureText(testLine).width > maxW && j > 0) {
                        pLines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            }
            
            for (let l of pLines) {
                if (!isMeasure) {
                    let colonIdx = l.indexOf(':');
                    if (colonIdx !== -1 && l.substring(0, colonIdx).length < 15) {
                        let boldPart = l.substring(0, colonIdx + 1);
                        let normPart = l.substring(colonIdx + 1);
                        
                        ctx.font = '700 36px "Sarabun"';
                        ctx.fillStyle = isMinor ? '#c0c5e8' : '#ffffff';
                        ctx.fillText(boldPart, cx, cy);
                        
                        let boldW = ctx.measureText(boldPart).width;
                        ctx.font = '400 36px "Sarabun"';
                        ctx.fillStyle = isMinor ? '#a9afd6' : '#e8e9f5';
                        ctx.fillText(normPart, cx + boldW, cy);
                    } else {
                        ctx.font = '400 36px "Sarabun"';
                        ctx.fillStyle = isMinor ? '#a9afd6' : '#e8e9f5';
                        ctx.fillText(l, cx, cy);
                    }
                }
                cy += 50;
            }
            cy += 20;
        }
        
        const tags = Array.from(cardEl.querySelectorAll('.tag'));
        if (tags.length > 0) {
            cy += 20;
            let currentX = cx;
            let tagH = 55;
            for (let tag of tags) {
                let txt = tag.innerText;
                ctx.font = '400 28px "Sarabun"';
                let txtW = ctx.measureText(txt).width;
                let tagW = txtW + 40;
                
                if (currentX + tagW > width - 80) {
                    currentX = cx;
                    cy += tagH + 20;
                }
                
                if (!isMeasure) {
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(currentX, cy, tagW, tagH, 25);
                    else ctx.rect(currentX, cy, tagW, tagH);
                    
                    if (tag.classList.contains('good')) {
                        ctx.strokeStyle = '#7cbf8e';
                        ctx.fillStyle = '#a7ddb3';
                    } else if (tag.classList.contains('watch')) {
                        ctx.strokeStyle = '#e08a8a';
                        ctx.fillStyle = '#f0b3b3';
                    } else {
                        ctx.strokeStyle = 'rgba(201,164,92,0.35)';
                        ctx.fillStyle = '#cfd3ea';
                    }
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(txt, currentX + tagW/2, cy + tagH/2);
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                }
                currentX += tagW + 20;
            }
            cy += tagH + 20;
        }
        
        if (!isMeasure) {
            ctx.font = '400 28px "Sarabun"';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.textAlign = 'center';
            ctx.fillText("คำทำนายดาวจร · สยามโหรามงคล", width/2, cy + 40);
        }
        cy += 100;
        
        return cy;
    };
    
    let actualHeight = drawContent(true);
    canvas.height = actualHeight;
    drawContent(false);
    
    const link = document.createElement('a');
    link.download = `ดวงจร-ราศี${zodiacNames[sign]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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


async function saveWheelSection() {
    const width = 1200;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = 3000;
    const ctx = canvas.getContext('2d');
    
    await document.fonts.ready;
    
    const drawContent = async (isMeasure = false) => {
        let cy = 100;
        const cx = 80;
        const maxW = width - 160;
        
        if (!isMeasure) {
            let grad = ctx.createLinearGradient(0, 0, width, canvas.height);
            grad.addColorStop(0, '#1c2149');
            grad.addColorStop(0.5, '#151935');
            grad.addColorStop(1, '#0d0f22');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, canvas.height);
            
            const monthText = document.getElementById("selectMonth") ? document.getElementById("selectMonth").options[document.getElementById("selectMonth").selectedIndex].text : '';
            const yearText = document.getElementById("selectYear") ? document.getElementById("selectYear").value : '';
            const titleStr = window.currentMode === 'daily' ? document.getElementById("reportTitle").innerText : `แผ่นดาวจรเด่น ประจำเดือน${monthText} พ.ศ. ${yearText}`;
            
            ctx.font = '700 50px "Chonburi"';
            ctx.fillStyle = '#e8c876';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(titleStr, width/2, cy);
            
            const svgEl = document.getElementById('transitWheel');
            if (svgEl) {
                const svgData = new XMLSerializer().serializeToString(svgEl);
                const styleDef = `<style>
                    .sign-arc{fill:none;stroke:rgba(201,164,92,0.35);stroke-width:1.5;}
                    .sign-label{fill:#a9afd6;font-size:16px;font-family:'Sarabun';font-weight:bold;}
                    .ring{fill:none;stroke:rgba(201,164,92,0.35);stroke-width:1.5;}
                    .planet{font-size:26px;fill:#e8c876;text-anchor:middle;dominant-baseline:middle;}
                    .planet-tag{font-size:13px;fill:#cfd3ea;text-anchor:middle;}
                </style>`;
                const modifiedSvg = svgData.replace(/<svg([^>]*)>/, `<svg$1>${styleDef}`);
                const blob = new Blob([modifiedSvg], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.src = url;
                await new Promise(r => { img.onload = r; img.onerror = r; });
                
                const svgSize = 650;
                ctx.drawImage(img, width/2 - svgSize/2, cy + 80, svgSize, svgSize);
                URL.revokeObjectURL(url);
            }
        }
        
        cy += 800;
        
        const listItems = Array.from(document.querySelectorAll('#transitHighlightList li'));
        for(let li of listItems) {
            let glyph = li.querySelector('.glyph') ? li.querySelector('.glyph').innerText : '';
            let text = li.querySelector('.desc') ? li.querySelector('.desc').innerText : li.innerText;
            
            if (!isMeasure) {
                ctx.font = '400 45px "Sarabun"';
                ctx.fillStyle = '#e8c876';
                ctx.textAlign = 'left';
                ctx.fillText(glyph, cx, cy);
            }
            
            ctx.font = '400 36px "Sarabun"';
            const listMaxW = maxW - 80;
            let pLines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                const segments = segmenter.segment(text);
                let currentLine = "";
                for (const {segment} of segments) {
                    const testLine = currentLine + segment;
                    if (ctx.measureText(testLine).width > listMaxW && currentLine.trim() !== '') {
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
                    if (ctx.measureText(testLine).width > listMaxW && j > 0) {
                        pLines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                pLines.push(currentLine);
            }
            
            for (let l of pLines) {
                if (!isMeasure) {
                    ctx.fillStyle = '#cfd3ea';
                    ctx.fillText(l, cx + 80, cy);
                }
                cy += 50;
            }
            cy += 30;
        }
        
        if (!isMeasure) {
            ctx.font = '400 28px "Sarabun"';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.textAlign = 'center';
            ctx.fillText("แผ่นดาวจร · สยามโหรามงคล", width/2, cy + 60);
        }
        
        cy += 120;
        return cy;
    }
    
    ctx.font = '400 36px "Sarabun"'; 
    let actualHeight = await drawContent(true);
    canvas.height = actualHeight;
    
    await drawContent(false);
    
    const link = document.createElement('a');
    let monthText = document.getElementById("selectMonth") ? document.getElementById("selectMonth").options[document.getElementById("selectMonth").selectedIndex].text : '';
    let yearText = document.getElementById("selectYear") ? document.getElementById("selectYear").value : '';
    if(window.currentMode === 'daily') {
        const dateStr = document.getElementById("selectTransitDate").value;
        link.download = `แผ่นดาวจรเด่น-${dateStr}.png`;
    } else {
        link.download = `แผ่นดาวจรเด่น-${monthText}-${yearText}.png`;
    }
    link.href = canvas.toDataURL('image/png');
    link.click();
}
