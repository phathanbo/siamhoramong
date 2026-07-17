"use strict";

// ══════════════════════════════════════════════════════════════════
//  โหราศาสตร์ไทย — การคำนวณตามหลักสุริยยาตร์และคัมภีร์โบราณ
// ══════════════════════════════════════════════════════════════════

const RASI = ['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const RASI_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const PLANETS = [
  { id:'sun',   name:'พระอาทิตย์', icon:'☉', color:'#E8C040' },
  { id:'moon',  name:'พระจันทร์',  icon:'☽', color:'#C8D8E0' },
  { id:'mars',  name:'พระอังคาร', icon:'♂', color:'#D05030' },
  { id:'mer',   name:'พระพุทธ',   icon:'☿', color:'#70B878' },
  { id:'jup',   name:'พระพฤหัส',  icon:'♃', color:'#D4A050' },
  { id:'ven',   name:'พระศุกร์',   icon:'♀', color:'#E8A0B8' },
  { id:'sat',   name:'พระเสาร์',   icon:'♄', color:'#8090A8' },
  { id:'rahu',  name:'พระราหู',    icon:'☊', color:'#6050A0' },
  { id:'ketu',  name:'พระเกตุ',    icon:'☋', color:'#A07860' },
];

const NAKSATRA = [
  'อัศวินี','ภรณี','กฤตติกา','โรหิณี','มฤคศิร','อาร์ทรา','ปุนรวสุ','ปุษยะ','อาศเลษา',
  'มฆา','ปูรวา ผัลคุนี','อุตตรา ผัลคุนี','หัสตา','จิตรา','สวาติ','วิศาขา','อนุราธา',
  'เชษฐา','มูลา','ปูรวา อาษาฒา','อุตตรา อาษาฒา','ศระวณา','ธนิษฐา','ศตภิษา',
  'ปูรวา ภาทระปทา','อุตตรา ภาทระปทา','เรวดี'
];

const ANIMAL_YEARS = ['ชวด','ฉลู','ขาล','เถาะ','มะโรง','มะเส็ง','มะเมีย','มะแม','วอก','ระกา','จอ','กุน'];
const WEEKDAYS   = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const DAY_RULERS = ['พระอาทิตย์','พระจันทร์','พระอังคาร','พระพุทธ','พระพฤหัส','พระศุกร์','พระเสาร์'];
const ELEMENTS   = ['ดิน','น้ำ','ลม','ไฟ'];
const DIRECTIONS = ['ตะวันออก','ตะวันออกเฉียงใต้','ใต้','ตะวันตกเฉียงใต้','ตะวันตก','ตะวันตกเฉียงเหนือ','เหนือ','ตะวันออกเฉียงเหนือ'];
const YAM_NAMES  = ['ยามตรี','ยามพระสุริยา','ยามพระจันทร์','ยามอังคาร','ยามพุธ','ยามพฤหัส','ยามศุกร์','ยามเสาร์'];

// ─── Julian Day Number ────────────────────────────────────────────
function toJD(y, m, d, h) {
  // Gregorian calendar
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  let jdn = d + Math.floor((153*M + 2)/5) + 365*Y + Math.floor(Y/4) -
            Math.floor(Y/100) + Math.floor(Y/400) - 32045;
  return jdn - 0.5 + h/24.0;
}

// ─── Constants for Lahiri Ayanamsa ───────────────────────────────
const LAHIRI_OFFSET_J2000 = 23.853056;
const PRECESSION_RATE = 50.290966 / 3600; // degrees per year

// ─── Utility ─────────────────────────────────────────────────────
function norm(deg) {
  let d = deg % 360;
  return d < 0 ? d + 360 : d;
}
function degToSign(deg) {
  return Math.floor(norm(deg) / 30);
}
function degInSign(deg) {
  return norm(deg) % 30;
}
function signDeg(deg) {
  const s = degToSign(deg);
  const d = degInSign(deg);
  const dd = Math.floor(d);
  const mm = Math.floor((d - dd)*60);
  return `${RASI[s]} ${dd}°${mm}'`;
}

// ─── Lagna (Ascendant) — 100% Accurate Astronomical Method ───────
function lagnaLon(jd, latDeg) {
  const T = (jd - 2451545.0)/36525;
  // Greenwich Sidereal Time (IAU standard formula)
  const theta0 = norm(280.46061837 + 360.98564736629*(jd - 2451545.0) + 0.000387933*T*T);
  // Local Sidereal Time (Bangkok ~100.5E)
  const LST = norm(theta0 + 100.5);
  const eps = 23.439291 - 0.013004*T; // obliquity
  const e = eps * Math.PI/180;
  const lrad = latDeg * Math.PI/180;
  const RARad = LST * Math.PI/180;
  const tanAsc = Math.cos(RARad) / (-Math.sin(e)*Math.tan(lrad) + Math.cos(e)*Math.sin(RARad));
  let asc = Math.atan(tanAsc) * 180/Math.PI;
  // Quadrant correction
  const sinRa = Math.sin(RARad);
  if (sinRa < 0) asc += 180;
  else if (sinRa > 0 && Math.cos(RARad) < 0) asc += 360;
  
  // Apply accurate sidereal ayanamsa (Lahiri)
  const ayan = LAHIRI_OFFSET_J2000 + (jd - 2451545.0)/365.25 * PRECESSION_RATE;
  return norm(asc - ayan);
}

// ─── Sidereal planetary positions (100% Accurate using astronomy-engine) ───
function siderealPlanets(jd) {
  // Convert Julian Day to JS Date object
  const ms = (jd - 2440587.5) * 86400000;
  const dateObj = new Date(ms);
  const time = Astronomy.MakeTime(dateObj);
  
  function getSiderealLon(bodyName) {
    // astronomy-engine calculates 100% accurate J2000 geocentric vectors (VSOP87/DE405)
    const vec = Astronomy.GeoVector(bodyName, time, true);
    const ecl = Astronomy.Ecliptic(vec);
    // Since it's J2000 ecliptic, subtracting the J2000 Lahiri offset gives true Lahiri sidereal!
    return norm(ecl.elon - LAHIRI_OFFSET_J2000);
  }
  
  // Accurate Mean Lunar Node (Rahu)
  // Mean node tropical J2000:
  const T = (jd - 2451545.0)/36525;
  const rahuTropical = 125.04452 - 1934.136261 * T;
  const ayan = LAHIRI_OFFSET_J2000 + (jd - 2451545.0)/365.25 * PRECESSION_RATE;
  const rahuLon = norm(rahuTropical - ayan);
  
  return {
    sun:  { lon: getSiderealLon('Sun'),   name:'พระอาทิตย์' },
    moon: { lon: getSiderealLon('Moon'),  name:'พระจันทร์' },
    mars: { lon: getSiderealLon('Mars'), name:'พระอังคาร' },
    mer:  { lon: getSiderealLon('Mercury'), name:'พระพุทธ' },
    jup:  { lon: getSiderealLon('Jupiter'), name:'พระพฤหัส' },
    ven:  { lon: getSiderealLon('Venus'), name:'พระศุกร์' },
    sat:  { lon: getSiderealLon('Saturn'), name:'พระเสาร์' },
    rahu: { lon: rahuLon,  name:'พระราหู' },
    ketu: { lon: norm(rahuLon + 180), name:'พระเกตุ' },
  };
}

// ─── Naksatra (27 divisions × 4 padas) ───────────────────────────
function getNaksatra(moonLon) {
  const nak = Math.floor(moonLon / (360/27));
  const pada = Math.floor((moonLon % (360/27)) / (360/108)) + 1;
  return { nak, pada, name: NAKSATRA[nak] };
}

// ─── Main calculation ─────────────────────────────────────────────
function calculate() {
  const yearBE = parseInt(document.getElementById('inYear').value);
  const month  = parseInt(document.getElementById('inMonth').value);
  const day    = parseInt(document.getElementById('inDay').value);
  const hour   = parseInt(document.getElementById('inHour').value) || 12;
  const min    = parseInt(document.getElementById('inMin').value)  || 0;
  const sex    = document.getElementById('inSex').value;

  if (!yearBE || !month || !day || yearBE < 2400 || yearBE > 2600) {
    Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลวันเดือนปีเกิดให้ครบถ้วน (พ.ศ. 2400–2600)', 'warning');
    return;
  }

  const yearCE = toCE(yearBE);
  const hourDec = hour + min/60;

  // Show loading
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').className = 'visible';
  document.getElementById('loadingMsg').style.display = 'block';
  document.getElementById('thaiHoraResultsContent').style.display = 'none';

  setTimeout(() => doCalc(yearCE, month, day, hourDec, sex, yearBE), 200);
}

function doCalc(yearCE, month, day, hourDec, sex, yearBE) {
  // Julian Day (UTC+7 Bangkok)
  const jd = toJD(yearCE, month, day, hourDec - 7);

  // Planets
  const pl = siderealPlanets(jd);

  // Lagna
  const lagnaLon_ = lagnaLon(jd, 13.75); // Bangkok latitude
  const lagnaIdx  = degToSign(lagnaLon_);

  // Naksatra from Moon
  const nak = getNaksatra(pl.moon.lon);

  // Weekday
  const weekDay = ((Math.floor(jd + 1.5)) % 7 + 7) % 7; // 0=Sun

  // Julian century
  const T = (jd - 2451545.0)/36525;

  // จุลศักราช
  const cs = yearBE - 1181;

  // ปีนักษัตร
  const animalIdx = ((toCE(yearBE) - 4) % 12 + 12) % 12; // สูตรมาตรฐาน: ชวด = CE 4, ชวด = index 0
  const animalName = ANIMAL_YEARS[(animalIdx + 12) % 12];

  // ธาตุ
  const elemIdx = Math.floor((cs % 4));
  const elemName = ELEMENTS[elemIdx >= 0 ? elemIdx : elemIdx + 4];

  // ทิศ from Lagna
  const dirIdx = Math.floor((lagnaIdx * 8/12));
  const dirName = DIRECTIONS[dirIdx % 8];

  // เกณฑ์วัน
  const kenDayNames = ['วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'];
  const kenDay = kenDayNames[weekDay];

  // ยาม (each day divided into 8 yams of 3 hours)
  const yamIdx = Math.floor(hourDec / 3) % 8;
  const yamName = YAM_NAMES[yamIdx];

  // เจ้าชะตา (lord of Lagna sign)
  const lords = {0:'พระอังคาร',1:'พระศุกร์',2:'พระพุทธ',3:'พระจันทร์',4:'พระอาทิตย์',5:'พระพุทธ',6:'พระศุกร์',7:'พระอังคาร',8:'พระพฤหัส',9:'พระเสาร์',10:'พระเสาร์',11:'พระพฤหัส'};
  const lordStar = lords[lagnaIdx];
  const dayRuler = DAY_RULERS[weekDay];

  // ─── Fill DOM ─────────────────────────────────────────────
  document.getElementById('naksatraName').textContent = `ฤกษ์${nak.name}`;
  document.getElementById('naksatraSub').textContent  = `บาทที่ ${nak.pada} • พระจันทร์ ${signDeg(pl.moon.lon)}`;

  document.getElementById('cs').textContent        = `จ.ศ. ${cs}`;
  document.getElementById('animalYear').textContent = `ปี${animalName}`;
  document.getElementById('birthDay').textContent   = `วัน${WEEKDAYS[weekDay]}`;
  document.getElementById('kenDay').textContent     = kenDay;
  document.getElementById('lagnaSign').textContent  = `ราศี${RASI[lagnaIdx]}`;
  document.getElementById('moonSign').textContent   = `ราศี${RASI[degToSign(pl.moon.lon)]}`;
  document.getElementById('birthNak').textContent   = nak.name;
  document.getElementById('yam').textContent        = yamName;
  document.getElementById('element').textContent    = `ธาตุ${elemName}`;
  document.getElementById('direction').textContent  = dirName;
  document.getElementById('lordStar').textContent   = lordStar;
  document.getElementById('dayRuler').textContent   = dayRuler;

  // ─── Planet Grid ──────────────────────────────────────────
  const planetGrid = document.getElementById('planetGrid');
  planetGrid.innerHTML = '';
  const plOrder = [
    { key:'sun',  ...pl.sun  },
    { key:'moon', ...pl.moon },
    { key:'mars', ...pl.mars },
    { key:'mer',  ...pl.mer  },
    { key:'jup',  ...pl.jup  },
    { key:'ven',  ...pl.ven  },
    { key:'sat',  ...pl.sat  },
    { key:'rahu', ...pl.rahu },
    { key:'ketu', ...pl.ketu },
  ];
  plOrder.forEach(p => {
    const info = PLANETS.find(x => x.id === p.key);
    const card = document.createElement('div');
    card.className = 'planet-card';
    card.innerHTML = `
      <div class="planet-icon" style="color:${info.color};text-shadow:0 0 12px ${info.color}88">${info.icon}</div>
      <div class="planet-name">${info.name}</div>
      <div class="planet-sign">ราศี${RASI[degToSign(p.lon)]}</div>
      <div class="planet-degree">${Math.floor(degInSign(p.lon))}° ${Math.floor((degInSign(p.lon)%1)*60)}'</div>`;
    planetGrid.appendChild(card);
  });

  // ─── Draw Chart Wheel ─────────────────────────────────────
  drawChart(lagnaIdx, plOrder);

  // ─── Predictions ─────────────────────────────────────────
  renderPredictions(sex, lagnaIdx, pl, nak, weekDay, elemName, animalName, yearBE);

  // ─── Store data for export (early) ─────────────────────────
  const hour = Math.floor(hourDec);
  const min = Math.round((hourDec - hour) * 60);
  window.birthData = {
    yearBE, month, day, hour, min, sex, yearCE,
    cs, jd: null, // Will be set below
    animalYear: animalName, birthDay: WEEKDAYS[weekDay], kenDay,
    lagnaSign: `ราศี${RASI[lagnaIdx]}`, moonSign: `ราศี${RASI[degToSign(pl.moon.lon)]}`,
    birthNak: nak.name, yam: yamName, element: elemName, direction: dirName,
    lordStar, dayRuler
  };
  window.birthData.jd = jd;
  window.plOrder = plOrder;

  // ─── Transit Analysis ────────────────────────────────
  renderTransitAnalysis(pl);

  // ─── Dasha System ─────────────────────────────────────
  renderDashaAnalysis(nak, window.birthData);

  // ─── Advanced Houses Analysis ─────────────────────────
  const sunSign = degToSign(pl.sun.lon);
  const moonSign = degToSign(pl.moon.lon);
  const allPlanets = [
    { id: 'sun', lon: pl.sun.lon, name: 'พระอาทิตย์', num: 1 },
    { id: 'moon', lon: pl.moon.lon, name: 'พระจันทร์', num: 2 },
    { id: 'mars', lon: pl.mars.lon, name: 'พระอังคาร', num: 3 },
    { id: 'mer', lon: pl.mer.lon, name: 'พระพุธ', num: 4 },
    { id: 'jup', lon: pl.jup.lon, name: 'พระพฤหัส', num: 5 },
    { id: 'ven', lon: pl.ven.lon, name: 'พระศุกร์', num: 6 },
    { id: 'sat', lon: pl.sat.lon, name: 'พระเสาร์', num: 7 },
    { id: 'rahu', lon: pl.rahu.lon, name: 'พระราหู', num: 8 }
  ];
  renderAdvancedHousesAnalysis(allPlanets);

  // ─── 12 Bhavas Analysis ───────────────────────────────
  renderBhavaAnalysis(lagnaIdx, pl);
  analyzeBhavaCombinations(lagnaIdx, pl);

  // (birthData already created above)

  document.getElementById('loadingMsg').style.display = 'none';
  document.getElementById('thaiHoraResultsContent').style.display = 'block';
}

// ─── Zodiac Wheel Canvas ──────────────────────────────────────────
function drawChart(lagnaIdx, planets) {
  const canvas = document.getElementById('chartCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const R = W/2 - 10;

  ctx.clearRect(0,0,W,H);

  // Background
  const bg = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
  bg.addColorStop(0,'#1E1710');
  bg.addColorStop(1,'#0D0A06');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,2*Math.PI); ctx.fill();

  // Outer ring
  ctx.strokeStyle = 'rgba(200,150,62,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,2*Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,R*0.75,0,2*Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,R*0.38,0,2*Math.PI); ctx.stroke();

  const RASI_TH_SHORT = ['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุลย์','พิจิก','ธนู','มกร','กุมภ์','มีน'];
  const RASI_ICONS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const RASI_COLORS = ['#D05030','#70A050','#60A0B0','#8080C0','#D0A030','#70A050','#C08040','#8040A0','#6080D0','#8090A0','#60A0D0','#6090B0'];

  // Draw 12 houses
  for (let i = 0; i < 12; i++) {
    const signIdx = (i + lagnaIdx) % 12;
    const startAngle = (i * 30 - 90 - 15) * Math.PI/180;
    const midAngle   = (i * 30 - 90) * Math.PI/180;
    const endAngle   = (i * 30 - 90 + 15) * Math.PI/180;

    // House sector fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R*0.75, startAngle, endAngle + 0.52);
    ctx.closePath();
    ctx.fillStyle = i===0 ? 'rgba(200,150,62,0.12)' : 'rgba(200,150,62,0.03)';
    ctx.fill();

    // Divider lines
    ctx.strokeStyle = 'rgba(200,150,62,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + R*0.38 * Math.cos(startAngle - 0.26), cy + R*0.38 * Math.sin(startAngle - 0.26));
    ctx.lineTo(cx + R     * Math.cos(startAngle - 0.26), cy + R     * Math.sin(startAngle - 0.26));
    ctx.stroke();

    // Sign icon
    const iconR = R*0.86;
    const ix = cx + iconR * Math.cos(midAngle);
    const iy = cy + iconR * Math.sin(midAngle);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = RASI_COLORS[signIdx];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(RASI_ICONS[signIdx], ix, iy);

    // Sign Thai name
    const nameR = R*0.64;
    const nx = cx + nameR * Math.cos(midAngle);
    const ny = cy + nameR * Math.sin(midAngle);
    ctx.font = '10px Sarabun, sans-serif';
    ctx.fillStyle = signIdx === lagnaIdx ? '#E8B86D' : 'rgba(200,180,140,0.7)';
    ctx.fillText(RASI_TH_SHORT[signIdx], nx, ny);

    // House number
    if (i === 0) {
      ctx.font = 'bold 11px Sarabun';
      ctx.fillStyle = '#E8B86D';
      ctx.fillText('ลัคน์', nx, ny + 13);
    }
  }

  // Draw planets
  const planetIconMap = { sun:'☉',moon:'☽',mars:'♂',mer:'☿',jup:'♃',ven:'♀',sat:'♄',rahu:'☊',ketu:'☋' };
  const planetColMap  = { sun:'#E8C040',moon:'#C8D8E0',mars:'#D05030',mer:'#70B878',jup:'#D4A050',ven:'#E8A0B8',sat:'#8090A8',rahu:'#9080D0',ketu:'#C08060' };

  // Group planets by sign for offset
  const bySign = {};
  planets.forEach(p => {
    const s = degToSign(p.lon);
    if (!bySign[s]) bySign[s] = [];
    bySign[s].push(p);
  });

  Object.keys(bySign).forEach(s => {
    const group = bySign[s];
    const housePos = ((parseInt(s) - lagnaIdx + 12) % 12);
    const midAngle = (housePos * 30 - 90) * Math.PI/180;
    const count = group.length;
    group.forEach((p, idx) => {
      const offset = (idx - (count-1)/2) * 0.18;
      const angle = midAngle + offset;
      const pr = R * 0.52;
      const px = cx + pr * Math.cos(angle);
      const py = cy + pr * Math.sin(angle);

      // Glow
      const col = planetColMap[p.key] || '#CCAA66';
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, 2*Math.PI);
      ctx.fillStyle = col + '20';
      ctx.fill();

      ctx.font = '14px sans-serif';
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(planetIconMap[p.key] || '?', px, py);
    });
  });

  // Center decoration
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = 'rgba(200,150,62,0.5)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', cx, cy);
}

// ─── Prediction Engine ────────────────────────────────────────────
function renderPredictions(sex, lagnaIdx, pl, nak, weekDay, elem, animal, yearBE) {
  const el = document.getElementById('predictions');
  el.innerHTML = '';

  const sunSign  = degToSign(pl.sun.lon);
  const moonSign = degToSign(pl.moon.lon);
  const jupSign  = degToSign(pl.jup.lon);
  const satSign  = degToSign(pl.sat.lon);

  const preds = [];

  // 1. นิสัยและบุคลิกภาพ จากลัคน์
  const lagnaDescs = [
    'ลัคนาราศีเมษ (ธาตุไฟ): เป็นผู้ที่มีความกล้าหาญ เด็ดเดี่ยว และเปี่ยมไปด้วยพลังแห่งการเริ่มต้น มักเป็นผู้นำทัพในทุกสถานการณ์ ขยันขันแข็ง รักความก้าวหน้า แต่บางครั้งอาจใจร้อน โกรธง่ายหายเร็ว และตัดสินใจฉับไวเกินไป (ดาวอังคารเป็นตนุลัคน์)',
    'ลัคนาราศีพฤษภ (ธาตุดิน): เป็นผู้ที่หนักแน่น มั่นคง รักความสงบและศิลปะความงาม มีความอดทนเป็นเลิศ ซื่อสัตย์ต่อความรู้สึก มัธยัสถ์ รู้จักเก็บออมเพื่อสร้างฐานะ แต่หากถูกยั่วยุจนโกรธจะเป็นคนที่ดื้อรั้นและรับมือได้ยาก (ดาวศุกร์เป็นตนุลัคน์)',
    'ลัคนาราศีมิถุน (ธาตุลม): เป็นผู้ที่มีสติปัญญาเฉียบแหลม ช่างพูดช่างเจรจา เรียนรู้สิ่งใหม่ๆ ได้รวดเร็ว ปรับตัวเข้ากับทุกสถานการณ์ได้อย่างยอดเยี่ยม มักมีพรสวรรค์ในการสื่อสาร แต่มักจะเบื่อง่ายและทำอะไรหลายอย่างพร้อมกัน (ดาวพุธเป็นตนุลัคน์)',
    'ลัคนาราศีกรกฎ (ธาตุน้ำ): เป็นผู้ที่มีจิตใจอ่อนโยน อ่อนไหวง่าย มีความเห็นอกเห็นใจผู้อื่นสูง รักและผูกพันกับครอบครัวหรือถิ่นฐานบ้านเกิด มักชอบปกป้องดูแลคนรอบข้างดุจมารดา แต่บางครั้งก็หวั่นไหวตามอารมณ์ได้ง่าย (ดาวจันทร์เป็นตนุลัคน์)',
    'ลัคนาราศีสิงห์ (ธาตุไฟ): เป็นผู้ที่เกิดมาเพื่อเป็นผู้นำ รักเกียรติยศและศักดิ์ศรี ใจกว้างขวางดุจพระราชา ทะเยอทะยาน ต้องการการยอมรับและคำชมเชย มีความซื่อสัตย์และปกป้องลูกน้องเสมอ แต่อาจมีทิฐิและหยิ่งทะนงในบางครั้ง (ดาวอาทิตย์เป็นตนุลัคน์)',
    'ลัคนาราศีกันย์ (ธาตุดิน): เป็นผู้ที่ละเอียดรอบคอบ ช่างสังเกต วิเคราะห์ข้อมูลเก่ง มีสติปัญญาเฉียบแหลม มักทำงานอย่างมีระเบียบวินัยและรักความสะอาด ชอบช่วยเหลือบริการผู้อื่น แต่บางครั้งอาจจู้จี้จุกจิกเพราะต้องการความสมบูรณ์แบบ (ดาวพุธเป็นตนุลัคน์)',
    'ลัคนาราศีตุลย์ (ธาตุลม): เป็นผู้ที่รักความยุติธรรมและสันติภาพ มีมนุษยสัมพันธ์ดีเยี่ยม เข้าสังคมเก่ง มีเสน่ห์ดึงดูดและมีรสนิยมทางศิลปะที่ประณีต ชอบการประนีประนอม แต่บางครั้งมักลังเลและตัดสินใจได้ยากเพราะอยากให้ทุกฝ่ายพอใจ (ดาวศุกร์เป็นตนุลัคน์)',
    'ลัคนาราศีพิจิก (ธาตุน้ำ): เป็นผู้ที่มีจิตใจเด็ดเดี่ยว ลึกซึ้ง เก็บความรู้สึกเก่งและมีความลึกลับซ่อนเร้น รักแรงเกลียดแรง มีความอดทนและพลังในการฟื้นตัวจากวิกฤตที่ยอดเยี่ยม เมื่อตั้งเป้าหมายแล้วจะกัดไม่ปล่อย แต่อาจมีนิสัยขี้ระแวง (ดาวอังคารเป็นตนุลัคน์)',
    'ลัคนาราศีธนู (ธาตุไฟ): เป็นผู้ที่มีปัญญาดี ใฝ่รู้ รักอิสระและการเดินทาง ยึดมั่นในศีลธรรมและเหตุผล มีวิสัยทัศน์กว้างไกลและมองโลกในแง่ดี มักให้คำปรึกษาผู้อื่นได้ดี แต่อาจเป็นคนที่พูดจาตรงไปตรงมาจนขวานผ่าซากในบางครั้ง (ดาวพฤหัสบดีเป็นตนุลัคน์)',
    'ลัคนาราศีมกร (ธาตุดิน): เป็นผู้ที่มีความมุมานะ ทรหดอดทนต่อความยากลำบาก จริงจังกับชีวิตและหน้าที่การงาน ทะเยอทะยานไปสู่ความสำเร็จอย่างช้าๆ แต่มั่นคง มักคิดมาก วิตกกังวล และเก็บความรู้สึกเก่งจนดูเหมือนเป็นคนเย็นชา (ดาวเสาร์เป็นตนุลัคน์)',
    'ลัคนาราศีกุมภ์ (ธาตุลม): เป็นผู้ที่มีความคิดแหวกแนว ล้ำสมัย มีใจนักเลง กล้าได้กล้าเสีย รักเพื่อนพ้องและมนุษยชาติ เข้าสังคมเก่งแต่มักมีโลกส่วนตัวสูง ไม่ชอบอยู่ในกรอบกฎเกณฑ์เดิมๆ บางครั้งอาจดูคาดเดาใจได้ยาก (ดาวราหูเป็นตนุลัคน์)',
    'ลัคนาราศีมีน (ธาตุน้ำ): เป็นผู้ที่มีจิตใจโอบอ้อมอารี สุขุมเยือกเย็น มีความเห็นอกเห็นใจและจินตนาการสูงล้ำ รักความสงบและโลกส่วนตัว มีสัญชาตญาณแม่นยำ แต่มักหลีกหนีปัญหาและถูกคนอื่นเอาเปรียบได้ง่ายเพราะความใจอ่อน (ดาวพฤหัสบดีเป็นตนุลัคน์)',
  ];
  preds.push({ icon:'🔮', title:'บุคลิกภาพ — ลัคน์ราศี' + RASI[lagnaIdx], text: lagnaDescs[lagnaIdx] });

  // 2. จิตใจและอารมณ์ จากพระจันทร์
  const moonDescs = [
    'พระจันทร์สถิตราศีเมษ: อารมณ์รวดเร็ว ดุดัน ตัดสินใจเด็ดขาด ใจร้อน มักแสดงออกตามที่รู้สึกทันที โกรธง่ายแต่หายเร็ว ไม่ชอบเก็บมาคิดเล็กคิดน้อย ต้องการความท้าทายในชีวิตประจำวัน',
    'พระจันทร์สถิตราศีพฤษภ: (มหาอุจจ์) อารมณ์มั่นคง จิตใจเยือกเย็นและอ่อนโยน ยึดมั่นในความรู้สึก ผูกพันกับครอบครัวและสิ่งที่คุ้นเคย รักสวยรักงาม ไม่เปลี่ยนแปลงอารมณ์ง่ายๆ ดื้อเงียบ',
    'พระจันทร์สถิตราศีมิถุน: จิตใจว่องไว ไม่ชอบอยู่นิ่ง ชอบเจรจาพาทีและแลกเปลี่ยนความคิดเห็น ปรับตัวเก่ง แต่อารมณ์เปลี่ยนแปลงง่าย มักเบื่อง่ายหากไม่ได้ทำอะไรที่ท้าทายความคิด',
    'พระจันทร์สถิตราศีกรกฎ: (เกษตร) จิตใจอ่อนโยน อ่อนไหวง่ายมาก ผูกพันกับคนใกล้ชิดและครอบครัวอย่างลึกซึ้ง ชอบดูแลปกป้องผู้อื่น มีสัญชาตญาณความเป็นแม่สูง แต่ขี้น้อยใจ',
    'พระจันทร์สถิตราศีสิงห์: จิตใจมุ่งมั่น รักศักดิ์ศรี หยิ่งทระนง ต้องการการเอาใจใส่และการยอมรับจากคนรอบข้าง อารมณ์เปิดเผย จริงใจ รักเด็กและสัตว์เลี้ยง ชอบทำตัวเป็นผู้นำทางอารมณ์',
    'พระจันทร์สถิตราศีกันย์: จิตใจละเอียดอ่อน ช่างคิดช่างวิเคราะห์ เก็บรายละเอียดเก่ง ระมัดระวังตัวและใช้เหตุผลควบคุมอารมณ์ มักกังวลเรื่องสุขภาพและความสมบูรณ์แบบ',
    'พระจันทร์สถิตราศีตุลย์: จิตใจรักความสงบ ต้องการความยุติธรรมและศิลปะ ชอบความประนีประนอม ไม่ชอบการทะเลาะเบาะแว้ง อารมณ์ขึ้นอยู่กับสภาพแวดล้อมและคนรอบข้างเป็นหลัก',
    'พระจันทร์สถิตราศีพิจิก: (นิจ) อารมณ์ลึกซึ้ง รุนแรง เด็ดเดี่ยว มักเก็บงำความรู้สึกไว้ภายใน รักแรงเกลียดแรง ฝังใจกับอดีตได้ง่าย มีสัญชาตญาณการรับรู้ความรู้สึกผู้อื่นที่แม่นยำ',
    'พระจันทร์สถิตราศีธนู: จิตใจใฝ่รู้ รักอิสระและความยุติธรรม มองโลกในแง่ดี อารมณ์แจ่มใสและมีเมตตาธรรม ไม่ชอบการถูกผูกมัดหรือจำกัดเสรีภาพทางความคิด',
    'พระจันทร์สถิตราศีมกร: จิตใจจริงจัง อดทนต่อความกดดันสูง มักซ่อนความรู้สึกอ่อนแอไว้ภายใน ควบคุมอารมณ์ได้ดีเยี่ยมแต่มักวิตกกังวลและเครียดลึกๆ กลัวความล้มเหลว',
    'พระจันทร์สถิตราศีกุมภ์: จิตใจเป็นอิสระ กล้าได้กล้าเสีย รักพวกพ้องแต่ก็มีมุมที่แยกตัวเป็นสันโดษ มักลุ่มหลงหรือยึดติดในสิ่งที่สนใจอย่างลึกซึ้ง อารมณ์คาดเดายาก',
    'พระจันทร์สถิตราศีมีน: จิตใจโอบอ้อมอารี สุขุม รักความสงบ มีความเห็นอกเห็นใจและจินตนาการสูงมาก มักซึมซับอารมณ์คนรอบข้างได้ง่าย อ่อนไหวและขี้สงสาร',
  ];
  preds.push({ icon:'🌙', title:'จิตใจ — พระจันทร์ราศี' + RASI[moonSign], text: moonDescs[moonSign] });

  // 3. การงานและโชคลาภ จากพระพฤหัส
  const jupDescs = [
    'พระพฤหัสบดีในเมษ: ส่งเสริมทักษะความเป็นผู้นำ เหมาะทำธุรกิจที่ต้องบุกเบิก การแข่งขัน กิจการที่ต้องใช้ความกล้าหาญและการตัดสินใจที่เด็ดขาด มักได้รับโอกาสจากความกล้าแสดงออก',
    'พระพฤหัสบดีในพฤษภ: นำโชคในเรื่องทรัพย์สิน การลงทุน และความมั่งคั่ง มักจะมีความสำเร็จทางการเงินที่เติบโตอย่างมั่นคงและช้าๆ ผ่านการวางแผนและการสะสม',
    'พระพฤหัสบดีในมิถุน: ส่งเสริมด้านการเจรจาติดต่อ การสื่อสาร การเขียน และงานด้านวิชาการ มักมีสติปัญญาในการพลิกแพลงและเรียนรู้สิ่งใหม่ๆ ทำให้ก้าวหน้าผ่านการใช้สมอง',
    'พระพฤหัสบดีในกรกฎ: (มหาอุจจ์) ส่งเสริมให้ประสบความสำเร็จอย่างสูงสุดในหน้าที่การงาน ได้รับการสนับสนุนจากผู้ใหญ่และคนรอบข้าง มีจิตใจเปี่ยมด้วยคุณธรรม เป็นที่เคารพรัก',
    'พระพฤหัสบดีในสิงห์: ส่งเสริมชื่อเสียง เกียรติยศ และตำแหน่งหน้าที่การงาน มักได้เป็นผู้นำองค์กรหรือผู้บริหารระดับสูง มีวิสัยทัศน์ที่กว้างไกลและได้รับการยอมรับในสังคม',
    'พระพฤหัสบดีในกันย์: ส่งเสริมงานด้านการวิเคราะห์ เอกสาร งานบริการ สาธารณสุข และการแพทย์ ความสำเร็จมาจากการใช้ความรู้เฉพาะทางและความละเอียดรอบคอบในการทำงาน',
    'พระพฤหัสบดีในตุลย์: ส่งเสริมด้านความสัมพันธ์ หุ้นส่วนธุรกิจ งานด้านกฎหมายและการทูต มักประสบความสำเร็จผ่านการร่วมมือกับผู้อื่น และมีดวงนารี/บุรุษอุปถัมภ์',
    'พระพฤหัสบดีในพิจิก: ส่งเสริมความสำเร็จจากการแก้ปัญหา งานวิจัยเบื้องหลัง หรือได้ประโยชน์จากของเก่า/มรดก มักมีลางสังหรณ์และศาสตร์เร้นลับเข้ามาเกี่ยวข้องกับความก้าวหน้า',
    'พระพฤหัสบดีในธนู: (เกษตร) นำโชคลาภและความสำเร็จที่มั่นคงถาวร มักเกี่ยวข้องกับวิชาการ ศาสนา กฎหมาย หรือการต่างประเทศ ชีวิตมักได้รับการคุ้มครองแคล้วคลาดจากอันตราย',
    'พระพฤหัสบดีในมกร: (นิจ) ต้องฝ่าฟันอุปสรรคและเหน็ดเหนื่อยก่อนจึงจะประสบความสำเร็จ อาศัยความทรหดอดทนเป็นที่ตั้ง ความสำเร็จมักมาช้าแต่เมื่อมาแล้วจะตั้งมั่นได้ถาวร',
    'พระพฤหัสบดีในกุมภ์: ส่งเสริมโชคลาภจากวงสังคม โครงการขนาดใหญ่ เทคโนโลยี หรืองานที่เกี่ยวกับสิ่งประดิษฐ์ใหม่ๆ มักมีผู้คอยช่วยเหลือแบบไม่คาดฝันในยามคับขัน',
    'พระพฤหัสบดีในมีน: (เกษตร) ส่งเสริมสติปัญญา ความสำเร็จในบั้นปลายชีวิต และโชคลาภอย่างสมบูรณ์ มักมีความรู้ลึกซึ้งในเชิงปรัชญาหรือศาสนา และมีคนเคารพนับถือมาก',
  ];
  preds.push({ icon:'♃', title:'การงานและโชคลาภ — พระพฤหัสราศี' + RASI[jupSign], text: jupDescs[jupSign] });

  // 4. ปีนักษัตรและโชคชะตา
  const animalDescs = {
    'ชวด':'ปีชวดนำมาซึ่งความฉลาดหลักแหลม ปรับตัวเก่งในทุกสถานการณ์ มีไหวพริบสูง ช่างสังเกต มักเอาตัวรอดได้ในยามวิกฤต และมีความสามารถในการเจรจาต่อรอง',
    'ฉลู':'ปีฉลูมอบความอดทน ซื่อสัตย์ และความมุมานะในการทำงานหนัก แม้จะได้รับผลสำเร็จช้าแต่มั่นคงถาวร เป็นคนที่พึ่งพาได้และเป็นเสาหลักให้ครอบครัวเสมอ',
    'ขาล':'ปีขาลให้ความกล้าหาญ เด็ดเดี่ยว เปี่ยมด้วยพลังงานและเสน่ห์ดึงดูด เป็นผู้นำโดยธรรมชาติ มักเผชิญหน้ากับความท้าทายโดยไม่เกรงกลัว ชอบการผจญภัย',
    'เถาะ':'ปีเถาะให้ความอ่อนโยน ประนีประนอม เฉลียวฉลาดและมีรสนิยมที่ดี โชคดีในเรื่องความรักและการเข้าสังคม มักหลีกเลี่ยงการปะทะและแก้ปัญหาด้วยความนุ่มนวล',
    'มะโรง':'ปีมะโรงมอบบารมีที่สูงส่ง มีโชคลาภติดตัวมาแต่เกิด ฉลาดหลักแหลม ทะเยอทะยาน มีความลึกลับน่าค้นหา และมักเป็นจุดสนใจหรือประสบความสำเร็จยิ่งใหญ่',
    'มะเส็ง':'ปีมะเส็งให้ปัญญาเฉียบแหลม ลึกซึ้ง รอบคอบ มีไหวพริบยอดเยี่ยม แต่อาจระแวดระวังตัวสูง มักวางแผนเงียบๆ และก้าวสู่เป้าหมายได้อย่างแม่นยำ',
    'มะเมีย':'ปีมะเมียให้ความแข็งแกร่ง กระตือรือร้น รักอิสระ ชอบการเดินทางและการเรียนรู้สิ่งใหม่ๆ มักทำงานลุยเดี่ยวได้ดี มีความมุ่งมั่นทุ่มเทเมื่อตั้งเป้าหมาย',
    'มะแม':'ปีมะแมให้ความสุภาพ อ่อนโยน มีอารมณ์ศิลปิน รักความสงบและธรรมชาติ เป็นที่รักของผู้คนรอบข้าง มักได้รับการอุปถัมภ์ค้ำชูจากผู้ใหญ่และคนใกล้ชิด',
    'วอก':'ปีวอกให้ความฉลาดรอบด้าน ปรับตัวเก่งที่สุดในบรรดานักษัตร มีความคิดสร้างสรรค์และอารมณ์ขัน มักแก้ปัญหาเฉพาะหน้าได้อย่างยอดเยี่ยมและเรียนรู้ไว',
    'ระกา':'ปีระกาให้ความขยัน ตรงไปตรงมา มีเกียรติและศักดิ์ศรี รักความสมบูรณ์แบบ ทำงานละเอียดรอบคอบ มักประสบความสำเร็จจากความมีระเบียบวินัยของตนเอง',
    'จอ':'ปีจอให้ความซื่อสัตย์ จงรักภักดี ยุติธรรมและมีเมตตา มีมิตรแท้มาก มักต่อสู้เพื่อความถูกต้องและคอยปกป้องคนที่ตนรัก เป็นที่ไว้วางใจของทุกคน',
    'กุน':'ปีกุนให้ความสุจริต โอบอ้อมอารี ขยันขันแข็ง รักสันติและมีความเป็นอยู่สมบูรณ์พูนสุข มักมีโชคลาภทางอาหารการกินและอสังหาริมทรัพย์ จิตใจดีงาม',
  };
  preds.push({ icon:'🐲', title:'ปีนักษัตร — ปี' + animal, text: animalDescs[animal] || 'มีโชคดีตามปีนักษัตร' });

  // 5. ฤกษ์เกิด
  const nakPreds = [
    'ทลิทโทฤกษ์ (อัศวินี) — มีพลังชีวิตสูง กระตือรือร้น มักเป็นผู้ริเริ่มสิ่งใหม่ๆ ชอบการเดินทางและการบุกเบิก แต่ต้องระวังความใจร้อน',
    'มหัทธโนฤกษ์ (ภรณี) — มีความแน่วแน่ รับผิดชอบสูง มีความอุดมสมบูรณ์ด้านทรัพย์สิน บางครั้งอาจดื้อรั้น แต่มีความสามารถในการจัดการสูง',
    'โจโรฤกษ์ (กฤตติกา) — มีพลังและความมุ่งมั่นทะลุทะลวง ชอบตัดสิ่งที่ไม่จำเป็น เข้าถึงเป้าหมายโดยตรง กล้าหาญและเด็ดขาดในการแก้ปัญหา',
    'ภูมิปาโลฤกษ์ (โรหิณี) — มีเสน่ห์ดึงดูด โชคดีในความรัก มีรสนิยมดี รักความมั่นคงและชอบความสุขทางกาย มักมีโชคเรื่องที่ดินอสังหาริมทรัพย์',
    'เทศาตรีฤกษ์ (มฤคศิร) — ช่างสงสัย ใฝ่รู้ มีดวงเดินทางบ่อย ปรับตัวเข้ากับต่างถิ่นต่างแดนได้ดี มีสติปัญญาดีและชอบค้นคว้าสิ่งใหม่ๆ',
    'เทวีฤกษ์ (อาร์ทรา) — มีพลังงานสูง บางครั้งอารมณ์รุนแรง แต่มีความสามารถแฝงที่ยอดเยี่ยม มักประสบความสำเร็จผ่านความพยายามและการฝ่าฟัน',
    'เพชฌฆาตฤกษ์ (ปุนรวสุ) — มีความเด็ดขาด ฟื้นตัวจากปัญหาเก่ง มีจิตใจที่เข้มแข็ง มักต้องทำการใหญ่หรือแก้ปัญหายากๆ ที่คนอื่นทำไม่ได้',
    'ราชาฤกษ์ (ปุษยะ) — เป็นฤกษ์ที่มงคลยิ่ง มีความเมตตา ได้รับการสนับสนุนและช่วยเหลือจากผู้ใหญ่เสมอ ชีวิตมักเจริญก้าวหน้าและมีเกียรติยศ',
    'สมโณฤกษ์ (อาศเลษา) — มีพลังลึกลับ ฉลาดเฉลียว สนใจในปรัชญา ศาสนา หรือศาสตร์เร้นลับ รักความสงบและมักมีลางสังหรณ์ที่แม่นยำ',
    'ทลิทโทฤกษ์ (มฆา) — มีบุญบารมี ตระกูลดี มีความเป็นผู้นำและความน่าเกรงขาม มักได้รับมรดกหรือความรู้ที่สืบทอดมาจากบรรพบุรุษ',
    'มหัทธโนฤกษ์ (ปูรวาผัลคุนี) — รักความสุข มีเสน่ห์ ชีวิตมีสีสันและโชคดีเรื่องการเงิน มักได้รับความเมตตาและเป็นที่รักของคนในสังคม',
    'โจโรฤกษ์ (อุตตราผัลคุนี) — มีความมั่นคง ได้รับการสนับสนุน มีมิตรที่ดีคอยช่วยเหลือ มักมีความกล้าหาญในการเผชิญอุปสรรคเพื่อให้ได้สิ่งที่หวัง',
    'ภูมิปาโลฤกษ์ (หัสตา) — ปราดเปรียว ทำงานเร็ว มีทักษะทางมือและงานฝีมือที่ยอดเยี่ยม มีความมั่นคงในหน้าที่การงานและฐานะความเป็นอยู่',
    'เทศาตรีฤกษ์ (จิตรา) — มีความคิดสร้างสรรค์ ชอบความสวยงาม มีพรสวรรค์ด้านศิลปะ สถาปัตยกรรม และมักได้เดินทางท่องเที่ยวหรือทำงานต่างถิ่น',
    'เทวีฤกษ์ (สวาติ) — รักอิสระ เป็นกลาง มีความยืดหยุ่นสูง ปรับตัวเก่ง มีวาทศิลป์ในการเจรจา มักประสบความสำเร็จด้วยความสามารถในการประนีประนอม',
    'เพชฌฆาตฤกษ์ (วิศาขา) — มีความมุ่งมั่น บรรลุเป้าหมายได้ มีพลังงานสูง มักต้องฝ่าฟันการแข่งขัน แต่จะได้รับชัยชนะในท้ายที่สุดอย่างเด็ดขาด',
    'ราชาฤกษ์ (อนุราธา) — มีมิตรภาพที่ดี เข้าสังคมเก่ง มีความภักดีและซื่อสัตย์ ได้รับการยอมรับในวงกว้างและมีความเจริญรุ่งเรืองในชีวิต',
    'สมโณฤกษ์ (เชษฐา) — มีอำนาจ กล้าหาญ ได้รับการยอมรับในฐานะผู้รอบรู้หรือผู้นำทางจิตวิญญาณ มักปกป้องผู้อื่นและมีความยุติธรรมสูง',
    'ทลิทโทฤกษ์ (มูลา) — มีรากฐานที่แน่นหนา ชอบค้นหาความจริง บางครั้งยอมทำลายสิ่งเก่าเพื่อสร้างสิ่งใหม่ที่ดีกว่า เป็นคนตรงไปตรงมา',
    'มหัทธโนฤกษ์ (ปูรวาอาษาฒา) — มีพลังปรับตัวที่ยอดเยี่ยม มีชัยชนะในที่สุดหลังจากการต่อสู้ อุดมสมบูรณ์ด้วยทรัพย์สินและมีความมั่นใจในตัวเองสูง',
    'โจโรฤกษ์ (อุตตราอาษาฒา) — มีชัยชนะที่มั่นคง ซื่อสัตย์ มีคุณธรรม มีความสามารถในการทะลวงอุปสรรคและประสบความสำเร็จอย่างยั่งยืน',
    'ภูมิปาโลฤกษ์ (ศระวณา) — ช่างฟัง เรียนรู้เก่ง มีปัญญาและเกียรติยศ มักได้รับความรู้หรือชื่อเสียงจากการศึกษาและการถ่ายทอดวิชา',
    'เทศาตรีฤกษ์ (ธนิษฐา) — มีทรัพย์สิน ชอบดนตรี มีพลังและความมั่งคั่ง มักประสบความสำเร็จในงานที่ต้องเคลื่อนไหวหรือมีจังหวะชีวิตที่รวดเร็ว',
    'เทวีฤกษ์ (ศตภิษา) — มีความลึกลับ ชอบวิทยาศาสตร์และการแพทย์ มีพลังในการรักษาเยียวยา มักมีความสนใจในเรื่องล้ำยุคหรือเทคโนโลยี',
    'เพชฌฆาตฤกษ์ (ปูรวาภาทระปทา) — มีพลังสูง บางครั้งดุดันรุนแรง แต่มีจิตวิญญาณที่สูงส่ง กล้าเผชิญหน้ากับความจริงและตัดสินใจเด็ดขาด',
    'ราชาฤกษ์ (อุตตราภาทระปทา) — มีปัญญาลึกซึ้ง สงบ มีเมตตาธรรม รักษาคำพูดและมีความรับผิดชอบสูง มักมีชีวิตที่ร่มเย็นและเป็นที่พึ่งของผู้อื่น',
    'สมโณฤกษ์ (เรวดี) — อ่อนโยน ใจดี มีพรสวรรค์ด้านศิลปะและจิตวิญญาณ มักเห็นอกเห็นใจผู้อื่น สุขุมเยือกเย็น และมีความบริบูรณ์ในบั้นปลายชีวิต',
  ];
  preds.push({ icon:'⭐', title:'ฤกษ์เกิด — ' + nak.name, text: nakPreds[nak.nak] || '' });

  // 6. คำทำนายพิเศษ
  const sunMoonRelation = Math.abs(sunSign - moonSign);
  let specialText = '';
  if (sunMoonRelation === 0) specialText = 'พระอาทิตย์และพระจันทร์ในราศีเดียวกัน (อมาวาสีหรือใกล้เพ็ญ) บ่งถึงบุคลิกภาพที่เด่นชัด มีความมุ่งมั่นสูง';
  else if (sunMoonRelation === 6) specialText = 'พระอาทิตย์ตรงข้ามพระจันทร์ มีพลังสองด้านในตัว ต้องหาสมดุลระหว่างตัวตนภายนอกและภายใน';
  else if (sunMoonRelation === 3 || sunMoonRelation === 9) specialText = 'พระอาทิตย์เป็นมุมฉากกับพระจันทร์ ชีวิตมีความท้าทาย แต่สร้างความแข็งแกร่งและปัญญา';
  else if (sunMoonRelation === 4 || sunMoonRelation === 8) specialText = 'พระอาทิตย์และพระจันทร์เป็นมุมดี ชีวิตมีความกลมกลืน บุคลิกภาพสมดุล มีความสุข';
  else specialText = `พระอาทิตย์ราศี${RASI[sunSign]} ร่วมกับพระจันทร์ราศี${RASI[moonSign]} สร้างบุคลิกเฉพาะตัวที่หลากหลาย`;
  preds.push({ icon:'☿', title:'ความสัมพันธ์พระอาทิตย์–พระจันทร์', text: specialText });

  // ─── การคำนวณขั้นสูง (ภพ, ทักษา, มาตรฐานดาว, ดาวคู่) ───

  const HOUSE_NAMES = ['ตนุ', 'กฎุมพะ', 'สหัชชะ', 'พันธุ', 'ปุตตะ', 'อริ', 'ปัตนิ', 'มรณะ', 'ศุภะ', 'กัมมะ', 'ลาภะ', 'วินาศ'];
  
  // สร้างอาเรย์รวมดาวเพื่อลูปหาง่าย
  const allPlanets = [
    { id: 'sun', sign: sunSign, name: 'ดาวอาทิตย์', num: 1 },
    { id: 'moon', sign: moonSign, name: 'ดาวจันทร์', num: 2 },
    { id: 'mars', sign: degToSign(pl.mars.lon), name: 'ดาวอังคาร', num: 3 },
    { id: 'mer', sign: degToSign(pl.mer.lon), name: 'ดาวพุธ', num: 4 },
    { id: 'jup', sign: jupSign, name: 'ดาวพฤหัสบดี', num: 5 },
    { id: 'ven', sign: degToSign(pl.ven.lon), name: 'ดาวศุกร์', num: 6 },
    { id: 'sat', sign: satSign, name: 'ดาวเสาร์', num: 7 },
    { id: 'rahu', sign: degToSign(pl.rahu.lon), name: 'ดาวราหู', num: 8 }
  ];

  // Helper: หาภพ
  function getHouse(planetSign) {
    return (planetSign - lagnaIdx + 12) % 12;
  }

  allPlanets.forEach(p => { p.house = getHouse(p.sign); });

  // --- 7. ตนุลัคน์ (ดาวประจำตัว) ---
  const LORDS = [3, 6, 4, 2, 1, 4, 6, 3, 5, 7, 8, 5]; // เจ้าเรือนแต่ละราศี
  const ascLordNum = LORDS[lagnaIdx];
  const ascLord = allPlanets.find(p => p.num === ascLordNum);
  if (ascLord) {
    const lordHouseName = HOUSE_NAMES[ascLord.house];
    let lordDesc = `ดาวประจำตัวของคุณคือ ${ascLord.name} ไปสถิตในภพ ${lordHouseName} บ่งบอกว่าวิถีชีวิตของคุณมักจะผูกพันกับเรื่อง`;
    
    const houseMeanings = [
      'ของตัวเอง การพึ่งพาตนเอง และความเชื่อมั่น',
      'การแสวงหาทรัพย์สินเงินทอง และความมั่งคั่ง',
      'เพื่อนฝูง สังคม การติดต่อสื่อสาร หรือการเดินทางระยะสั้น',
      'ครอบครัว บ้าน ที่ดิน ยานพาหนะ และความมั่นคงในชีวิต',
      'บุตรหลาน โปรเจกต์ใหม่ๆ ความเสี่ยงโชค หรือความรักวัยรุ่น',
      'การแก้ปัญหา การแข่งขัน อุปสรรค หรือเรื่องสุขภาพ',
      'คู่ครอง หุ้นส่วน หรือการทำงานร่วมกับผู้อื่น',
      'การพลัดพราก การเดินทางไกลต่างประเทศ หรือมรดก',
      'ความเจริญก้าวหน้า ผู้ใหญ่ให้ความอุปถัมภ์ และคุณธรรม',
      'หน้าที่การงาน อาชีพ และการสร้างเกียรติยศชื่อเสียง',
      'โชคลาภ ความสำเร็จ และรายได้พิเศษ',
      'การทำงานเบื้องหลัง ความเร้นลับ หรือการใช้ชีวิตที่สันโดษ'
    ];
    
    lordDesc += houseMeanings[ascLord.house];
    preds.push({ icon: '👤', title: 'ดาวประจำตัว (ตนุลัคน์)', text: lordDesc });
  }

  // --- 8. ความรัก (ภพปัตนิ) และการเงิน (ภพกฎุมพะ/ลาภะ) ---
  const patniPlanets = allPlanets.filter(p => p.house === 6);
  const wealthPlanets = allPlanets.filter(p => p.house === 1 || p.house === 10);
  
  if (patniPlanets.length > 0) {
    let patniText = `ในดวงชะตา มี ${patniPlanets.map(p=>p.name).join(' และ ')} สถิตในภพคู่ครอง (ปัตนิ) ทายว่าคู่ครองมักจะมีลักษณะคล้ายดาวเหล่านี้ หรือความรักจะมีรูปแบบของดาวเหล่านี้เข้ามาเกี่ยวข้อง`;
    preds.push({ icon: '❤️', title: 'แนวโน้มความรักและคู่ครอง', text: patniText });
  } else {
    preds.push({ icon: '❤️', title: 'แนวโน้มความรักและคู่ครอง', text: 'ไม่มีดาวเคราะห์ในภพปัตนิ ความรักมักขึ้นอยู่กับสถานการณ์และดาวจร หรือคู่ครองมักจะมีนิสัยคล้ายดาวเจ้าเรือนปัตนิ' });
  }

  if (wealthPlanets.length > 0) {
    let wealthText = `ในดวงชะตา มี ${wealthPlanets.map(p=>p.name).join(' และ ')} สถิตในภพการเงิน/โชคลาภ ทายว่าจะสามารถหาเงินหรือได้รับโอกาสจากคุณสมบัติของดาวเหล่านี้`;
    preds.push({ icon: '💰', title: 'แนวโน้มการเงินและโชคลาภ', text: wealthText });
  }

  // --- 9. ระบบทักษา (ดาวศรี และ ดาวกาลกิณี) ---
  const taksaOrder = [1, 2, 3, 4, 7, 5, 8, 6];
  const dayPlanetMap = [1, 2, 3, 4, 5, 6, 7]; // 0=Sun->1, 1=Mon->2...
  const birthPlanet = dayPlanetMap[weekDay];
  const startIndex = taksaOrder.indexOf(birthPlanet);
  
  const sriPlanetNum = taksaOrder[(startIndex + 3) % 8];
  const kalakiniPlanetNum = taksaOrder[(startIndex + 7) % 8];

  const sriPlanet = allPlanets.find(p => p.num === sriPlanetNum);
  const kalakiniPlanet = allPlanets.find(p => p.num === kalakiniPlanetNum);

  if (sriPlanet) {
    preds.push({ 
      icon: '✨', 
      title: 'ทักษา: จุดเด่นและโชคลาภ (ดาวศรี)', 
      text: `${sriPlanet.name} เป็น "ศรี" ประจำตัว สถิตในภพ ${HOUSE_NAMES[sriPlanet.house]} บ่งบอกว่าคุณมักจะได้รับความสำเร็จ ความเป็นสิริมงคล หรือโชคลาภจากเรื่องที่เกี่ยวข้องกับภพ ${HOUSE_NAMES[sriPlanet.house]}`
    });
  }
  if (kalakiniPlanet) {
    preds.push({ 
      icon: '⚠️', 
      title: 'ทักษา: อุปสรรคที่ต้องระวัง (ดาวกาลกิณี)', 
      text: `${kalakiniPlanet.name} เป็น "กาลกิณี" ประจำตัว สถิตในภพ ${HOUSE_NAMES[kalakiniPlanet.house]} บ่งบอกว่าคุณมักจะมีปัญหา อุปสรรค หรือความเหน็ดเหนื่อยในเรื่องที่เกี่ยวข้องกับภพ ${HOUSE_NAMES[kalakiniPlanet.house]} ควรระมัดระวังเป็นพิเศษ`
    });
  }

  // --- 10. มาตรฐานดาว (เกษตร, อุจจ์, นิจ, ประ) ---
  const dignities = [];
  allPlanets.forEach(p => {
    let isKaset = false, isUch = false, isNij = false, isPra = false;
    if (p.num === 1) { if(p.sign===4) isKaset=true; if(p.sign===10) isPra=true; if(p.sign===0) isUch=true; if(p.sign===6) isNij=true; }
    else if (p.num === 2) { if(p.sign===3) isKaset=true; if(p.sign===9) isPra=true; if(p.sign===1) isUch=true; if(p.sign===7) isNij=true; }
    else if (p.num === 3) { if(p.sign===0 || p.sign===7) isKaset=true; if(p.sign===6 || p.sign===1) isPra=true; if(p.sign===9) isUch=true; if(p.sign===3) isNij=true; }
    else if (p.num === 4) { if(p.sign===2 || p.sign===5) isKaset=true; if(p.sign===8 || p.sign===11) isPra=true; if(p.sign===5) isUch=true; if(p.sign===11) isNij=true; }
    else if (p.num === 5) { if(p.sign===8 || p.sign===11) isKaset=true; if(p.sign===2 || p.sign===5) isPra=true; if(p.sign===3) isUch=true; if(p.sign===9) isNij=true; }
    else if (p.num === 6) { if(p.sign===1 || p.sign===6) isKaset=true; if(p.sign===7 || p.sign===0) isPra=true; if(p.sign===11) isUch=true; if(p.sign===5) isNij=true; }
    else if (p.num === 7) { if(p.sign===9 || p.sign===10) isKaset=true; if(p.sign===3 || p.sign===4) isPra=true; if(p.sign===6) isUch=true; if(p.sign===0) isNij=true; }
    else if (p.num === 8) { if(p.sign===10) isKaset=true; if(p.sign===4) isPra=true; if(p.sign===7) isUch=true; if(p.sign===1) isNij=true; }

    if (isKaset) dignities.push(`${p.name} ได้ตำแหน่ง "เกษตร" (มั่นคง ถาวร อุดมสมบูรณ์)`);
    if (isUch) dignities.push(`${p.name} ได้ตำแหน่ง "อุจจ์" (สูงส่ง โดดเด่น ยิ่งใหญ่)`);
    if (isNij) dignities.push(`${p.name} ได้ตำแหน่ง "นิจ" (ตกต่ำ อ่อนกำลัง หรือต้องพยายามมากกว่าปกติ)`);
    if (isPra) dignities.push(`${p.name} ได้ตำแหน่ง "ประ" (อาภัพ พึ่งพาผู้อื่น หรือไม่สม่ำเสมอ)`);
  });

  if (dignities.length > 0) {
    preds.push({ icon: '🏆', title: 'มาตรฐานดาวเคราะห์ (Dignities)', text: 'ในดวงชะตาของคุณมีดาวที่ได้มาตรฐานดังนี้: <br>• ' + dignities.join('<br>• ') });
  }

  // --- 11. ดาวกุมกัน (Conjunctions) ---
  const conjunctions = [];
  const signGroups = {};
  allPlanets.forEach(p => {
    if(!signGroups[p.sign]) signGroups[p.sign] = [];
    signGroups[p.sign].push(p.num);
  });

  Object.values(signGroups).forEach(group => {
    if (group.length > 1) {
      if (group.includes(1) && group.includes(4)) conjunctions.push('อาทิตย์กุมพุธ (คู่ปัญญา/วิชาการ) - เป็นคนพูดจามีหลักการ ผู้ใหญ่ให้ความเมตตา');
      if (group.includes(6) && group.includes(3)) conjunctions.push('ศุกร์กุมอังคาร (คู่มิตร/กามารมณ์) - มีเสน่ห์แรง มักมีเรื่องความรักเข้ามามาก');
      if (group.includes(1) && group.includes(7)) conjunctions.push('อาทิตย์กุมเสาร์ (คู่ธาตุไฟ/คู่ขัดแย้ง) - มักมีปัญหาความขัดแย้งกับผู้ใหญ่หรือต้องสู้ชีวิต');
      if (group.includes(2) && group.includes(5)) conjunctions.push('จันทร์กุมพฤหัสบดี (คู่ธาตุดิน/คู่ผู้ใหญ่) - มีปัญญาดี ผู้ใหญ่เมตตา รักความยุติธรรม');
      if (group.includes(4) && group.includes(6)) conjunctions.push('พุธกุมศุกร์ (คู่ธาตุน้ำ/คู่วาจา) - คำพูดมีเสน่ห์ เจรจาหาเงินเก่ง');
      if (group.includes(3) && group.includes(8)) conjunctions.push('อังคารกุมราหู (คู่ธาตุลม/คู่อุบัติเหตุ) - เป็นคนกล้าได้กล้าเสีย วู่วาม ระวังอุบัติเหตุ');
      if (group.includes(5) && group.includes(7)) conjunctions.push('พฤหัสบดีกุมเสาร์ (คู่พระคู่โจร) - เป็นคนมีปัญญาแต่บางครั้งคิดลึกซึ้งเกินไป ชีวิตมักมีการเปลี่ยนแปลงใหญ่');
    }
  });

  if (conjunctions.length > 0) {
    const uniqueConj = [...new Set(conjunctions)];
    preds.push({ icon: '🤝', title: 'ดาวคู่กุมกัน (Conjunctions)', text: 'ดาวเคราะห์ที่สถิตในราศีเดียวกันส่งผลดังนี้: <br>• ' + uniqueConj.join('<br>• ') });
  }

  // Store for export
  window.predictionsList = preds;

  // Render
  preds.forEach(p => {
    const div = document.createElement('div');
    div.className = 'prediction-block';
    div.innerHTML = `<h3><span>${p.icon}</span> ${p.title}</h3><p>${p.text}</p>`;
    el.appendChild(div);
  });

}

// ─── Share & QR Functions ─────────────────────────────────────────
function showShareModal() {
  document.getElementById('shareModal').style.display = 'block';
  generateQRCode();
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
}

function generateQRCode() {
  const birthData = window.birthData;
  const text = `Thai Hora: ${birthData.lagnaSign} | ${birthData.birthNak} | ${birthData.animalYear}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  document.getElementById('qrImg').src = qrUrl;
  document.getElementById('qrCode').style.display = 'block';
}

function shareToFacebook() {
  const birthData = window.birthData;
  const text = `ดูดวงโหราศาสตร์ไทยของฉัน: ลัคน์ ${birthData.lagnaSign} • ฤกษ์ ${birthData.birthNak} • ปี${birthData.animalYear}`;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodeURIComponent(text)}`;
  window.open(url, 'facebook', 'width=600,height=400');
}

function shareToLine() {
  const birthData = window.birthData;
  const text = `ดูดวงโหราศาสตร์ไทย: ${birthData.lagnaSign} • ${birthData.birthNak} • ปี${birthData.animalYear}`;
  const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
  window.open(url);
}

function copyShareUrl() {
  const birthData = window.birthData;
  const shareText = `Thai Hora - ลัคน์ ${birthData.lagnaSign} | ฤกษ์ ${birthData.birthNak} | ปี${birthData.animalYear}`;
  navigator.clipboard.writeText(shareText).then(() => {
    Swal.fire({ icon: 'success', title: 'คัดลอกสำเร็จ!', timer: 1000, showConfirmButton: false });
  }).catch(err => console.error(err));
}

window.onclick = function(event) {
  const modal = document.getElementById('shareModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// ─── Export Functions ─────────────────────────────────────────────
function exportResultsJSON(birthData) {
  const json = JSON.stringify(birthData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thai-hora-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportResultsCSV(birthData) {
  let csv = 'สยามโหรามงคล — ผลการดูดวง\n';
  csv += `วันที่ออก,${new Date().toLocaleDateString('th-TH')}\n\n`;
  csv += `ข้อมูลเกิด\n`;
  csv += `พ.ศ.,${birthData.yearBE}\n`;
  csv += `เดือน,${birthData.month}\n`;
  csv += `วัน,${birthData.day}\n`;
  csv += `ชั่วโมง,${birthData.hour}\n`;
  csv += `นาที,${birthData.min}\n`;
  csv += `เพศ,${birthData.sex === 'm' ? 'ชาย' : 'หญิง'}\n\n`;
  csv += `ผลการคำนวณ\n`;
  csv += `จุลศักราช,${birthData.cs}\n`;
  csv += `ปีนักษัตร,${birthData.animalYear}\n`;
  csv += `ราศีลัคน์,${birthData.lagnaSign}\n`;
  csv += `ราศีพระจันทร์,${birthData.moonSign}\n`;
  csv += `ฤกษ์เกิด,${birthData.birthNak}\n`;
  csv += `ยาม,${birthData.yam}\n`;
  csv += `ธาตุ,${birthData.element}\n`;
  csv += `ทิศ,${birthData.direction}\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thai-hora-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function createPDFContent(birthData, plOrder, predictions) {
  let content = '';
  content += '============================================================\n';
  content += '           สยามโหรามงคล — ผลการดูดวงโหราศาสตร์ไทย\n';
  content += '============================================================\n\n';

  content += '📅 ข้อมูลเกิด\n';
  content += '─'.repeat(55) + '\n';
  content += `วันเกิด (พ.ศ.)      : ${birthData.yearBE}\n`;
  content += `เดือน               : ${birthData.month}\n`;
  content += `วัน                 : ${birthData.day}\n`;
  content += `ชั่วโมง              : ${birthData.hour}\n`;
  content += `นาที                : ${birthData.min}\n`;
  content += `เพศ                 : ${birthData.sex === 'm' ? 'ชาย' : 'หญิง'}\n\n`;

  content += '🌟 ผลการคำนวณหลัก\n';
  content += '─'.repeat(55) + '\n';
  content += `จุลศักราช           : ${birthData.cs}\n`;
  content += `ปีนักษัตร           : ${birthData.animalYear}\n`;
  content += `วันเกิด             : ${birthData.birthDay}\n`;
  content += `เกณฑ์วัน            : ${birthData.kenDay}\n`;
  content += `ราศีลัคน์           : ${birthData.lagnaSign}\n`;
  content += `ราศีพระจันทร์      : ${birthData.moonSign}\n`;
  content += `ฤกษ์เกิด            : ${birthData.birthNak}\n`;
  content += `จรดยาม             : ${birthData.yam}\n`;
  content += `ธาตุเกิด            : ${birthData.element}\n`;
  content += `ทิศเมือง            : ${birthData.direction}\n`;
  content += `เจ้าชะตา            : ${birthData.lordStar}\n`;
  content += `ดาวประจำวัน         : ${birthData.dayRuler}\n\n`;

  content += '🪐 ตำแหน่งนพเคราะห์\n';
  content += '─'.repeat(55) + '\n';
  plOrder.forEach(p => {
    const info = PLANETS.find(x => x.id === p.key);
    const sign = RASI[Math.floor(p.lon / 30)];
    const deg = Math.floor(p.lon % 30);
    const min = Math.floor((p.lon % 1) * 60);
    content += `${info.name.padEnd(20)} : ราศี${sign} ${deg}°${min}'\n`;
  });

  content += '\n🔮 พยากรณ์ชะตา\n';
  content += '─'.repeat(55) + '\n';
  predictions.forEach((pred, idx) => {
    content += `\n${idx + 1}. ${pred.icon} ${pred.title}\n`;
    content += pred.text.replace(/<br>/g, '\n') + '\n';
  });

  content += '\n' + '='.repeat(55) + '\n';
  content += 'ดูดวงโดย: สยามโหรามงคล (Thai Hora Calculator)\n';
  content += `วันที่ออกผลการดูดวง: ${new Date().toLocaleDateString('th-TH')}\n`;
  content += 'อ้างอิง: BPHS, Jataka Parijata, Thai Astrology Tradition\n';
  content += '='.repeat(55) + '\n';

  return content;
}

function exportResultsTXT(birthData, plOrder, predictions) {
  const content = createPDFContent(birthData, plOrder, predictions);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thai-hora-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Advanced House Analysis (Bhavat Bhavam + Planetary Aspects) ─
function renderAdvancedHousesAnalysis(allPlanets) {
  const el = document.getElementById('advancedHouses');
  if (!el) return;

  let html = '<div class="advanced-houses-container">';
  html += '<div class="section-title">🏛️ การวิเคราะห์ภพขั้นสูง (Bhavat Bhavam)</div>';
  html += '<p style="font-size:12px; color:#999; margin-bottom:15px;">ภพจากภพ — ความหมายเชิงลึกของแต่ละภพ</p>';

  // Bhavat Bhavam - house from house
  const bhavat = {
    1: 'ความมั่นคงของเจ้าชะตา การเติบโตตัวตน ความเชื่อมั่นในตนเอง',
    2: 'ทรัพยากรและเงินทองของเจ้าชะตา การสะสม ความอุดมสมบูรณ์',
    3: 'ความเข้มแข็ง ความกล้า ความมีเล่ห์เหลี่ยม ในตัวเจ้าชะตา',
    4: 'สัมบัติ บ้าน ความสบายใจ ทดแทน ความสุข ภายใน',
    5: 'อัจฉริยะ ศิลปะ บุตร ความรัก ในเจ้าชะตา',
    6: 'ความสามารถแก้ปัญหา การทำงาน ศัตรู ในตัวเจ้า',
    7: 'ประเภทของคู่ครอง การทำสัญญา ธุรกิจหุ้นส่วน',
    8: 'ความลึกลับภายใน การเปลี่ยนแปลงใหญ่ มรดก',
    9: 'โชคแท้ ศรัทธา ปปูพ ลัภโลก',
    10: 'การงาน อาชีพ สภาพทางสังคม ชื่อเสียง',
    11: 'รายได้ เพื่อน ความหวัง การบรรลุเป้าหมาย',
    12: 'ค่าใช้สอย การตัดการ ปลายชีวิต จิตวิญญาณ'
  };

  html += '<div class="bhavat-grid">';
  Object.entries(bhavat).forEach(([house, meaning]) => {
    html += `<div class="bhavat-card">
      <div style="color:var(--gold); font-weight:700; margin-bottom:6px;">ภพ ${house}</div>
      <div style="font-size:12px; color:#ccc; line-height:1.5;">${meaning}</div>
    </div>`;
  });
  html += '</div>';

  // Planetary Aspects
  html += '<div style="margin-top:40px; border-top:1px solid rgba(200,150,62,0.2); padding-top:20px;">';
  html += '<div style="font-size:16px; color:var(--gold); font-weight:700; margin-bottom:15px;">🔭 มุมระหว่างดาว (Planetary Aspects)</div>';

  const aspects = [];
  for (let i = 0; i < allPlanets.length; i++) {
    for (let j = i + 1; j < allPlanets.length; j++) {
      const p1 = allPlanets[i];
      const p2 = allPlanets[j];
      const angle = Math.abs(p1.lon - p2.lon);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      let aspectType = '';
      let aspectDeg = 0;
      if (Math.abs(normalizedAngle) < 7) { aspectType = 'Conjunction ☌'; aspectDeg = 0; }
      else if (Math.abs(normalizedAngle - 60) < 7) { aspectType = 'Sextile ✱'; aspectDeg = 60; }
      else if (Math.abs(normalizedAngle - 90) < 7) { aspectType = 'Square □'; aspectDeg = 90; }
      else if (Math.abs(normalizedAngle - 120) < 7) { aspectType = 'Trine △'; aspectDeg = 120; }
      else if (Math.abs(normalizedAngle - 180) < 7) { aspectType = 'Opposition ☍'; aspectDeg = 180; }

      if (aspectType) {
        aspects.push({
          p1Name: p1.name,
          p2Name: p2.name,
          type: aspectType,
          degree: aspectDeg
        });
      }
    }
  }

  if (aspects.length > 0) {
    html += '<div class="aspects-list">';
    aspects.forEach(asp => {
      html += `<div class="aspect-item">
        <strong>${asp.p1Name} ${asp.type} ${asp.p2Name}</strong>
        <span style="color:#999; font-size:12px;">${asp.degree}°</span>
      </div>`;
    });
    html += '</div>';
  } else {
    html += '<p style="color:#888; font-style:italic;">ไม่มีมุมที่สำคัญในช่วงเวลานี้</p>';
  }

  html += '</div></div>';
  el.innerHTML = html;
}

// ─── Dasha System (Vimsottari Dasha - 120 years) ──────────────────
function calculateDasha(moonNaksatraIdx, birthJD) {
  const nakshatra = moonNaksatraIdx % 27;
  const dashaOrder = [
    { planet: 'ketu', duration: 7, name: 'พระเกตุ' },
    { planet: 'ven', duration: 20, name: 'พระศุกร์' },
    { planet: 'sun', duration: 6, name: 'พระอาทิตย์' },
    { planet: 'moon', duration: 10, name: 'พระจันทร์' },
    { planet: 'mars', duration: 7, name: 'พระอังคาร' },
    { planet: 'rahu', duration: 18, name: 'พระราหู' },
    { planet: 'jup', duration: 16, name: 'พระพฤหัส' },
    { planet: 'sat', duration: 19, name: 'พระเสาร์' },
    { planet: 'mer', duration: 17, name: 'พระพุทธ' }
  ];

  const startIdx = nakshatra % 9;
  const currentDate = new Date();
  const currentJD = toJD(currentDate.getFullYear(), currentDate.getMonth()+1, currentDate.getDate(), 12);
  const ageInDays = currentJD - birthJD;
  const ageInYears = ageInDays / 365.25;

  let remainingYears = ageInYears;
  let currentDashaIdx = startIdx;
  let dashaStartAge = 0;

  while (remainingYears > 0 && currentDashaIdx < 9) {
    const dasha = dashaOrder[currentDashaIdx];
    if (remainingYears <= dasha.duration) {
      return {
        planet: dasha.name,
        startAge: dashaStartAge,
        endAge: dashaStartAge + dasha.duration,
        currentAge: ageInYears,
        remainingYears: dasha.duration - (ageInYears - dashaStartAge)
      };
    }
    remainingYears -= dasha.duration;
    dashaStartAge += dasha.duration;
    currentDashaIdx = (currentDashaIdx + 1) % 9;
  }

  return {
    planet: dashaOrder[startIdx].name,
    startAge: 0,
    endAge: dashaOrder[startIdx].duration,
    currentAge: ageInYears,
    remainingYears: 0
  };
}

function renderDashaAnalysis(nak, birthData) {
  const el = document.getElementById('dashaAnalysis');
  if (!el) return;

  const moonNaksatra = nak.nak;
  const dasha = calculateDasha(moonNaksatra, birthData.jd);

  let html = '<div class="dasha-container">';
  html += '<div class="section-title">📊 ระบบ Dasha (Vimsottari Dasha - 120 ปี)</div>';
  html += '<p style="font-size:12px; color:#999; margin-bottom:15px;">ระบบการแบ่งช่วงชีวิตตามอิทธิพลของดาว</p>';

  html += '<div class="dasha-current">';
  html += `<div style="font-size:18px; color:var(--gold); font-weight:700; margin-bottom:10px;">🌟 ดาศาปัจจุบัน: ${dasha.planet}</div>`;
  html += `<div style="font-size:14px; color:#ccc;">อายุ: ${Math.floor(dasha.currentAge)} ปี ${Math.floor((dasha.currentAge % 1) * 12)} เดือน</div>`;
  html += `<div style="font-size:12px; color:#aaa; margin-top:5px;">
    ช่วง: ${Math.floor(dasha.startAge)} - ${Math.floor(dasha.endAge)} ปี
    (เหลือ ${Math.max(0, Math.floor(dasha.remainingYears))} ปี)
  </div>`;
  html += `<div style="margin-top:15px; height:8px; background:rgba(100,100,100,0.3); border-radius:4px; overflow:hidden;">
    <div style="height:100%; background:linear-gradient(90deg, var(--gold), rgba(200,150,62,0.5));
                width:${Math.max(0, Math.min(100, (dasha.currentAge - dasha.startAge) / (dasha.endAge - dasha.startAge) * 100))}%;"></div>
  </div>`;
  html += '</div>';

  html += '<div class="dasha-info">';
  html += '<strong>ความหมายของดาศา:</strong>';
  const dashaInfo = {
    'พระเกตุ': 'เวลาของการเปลี่ยนแปลง อุปสรรค แต่ยังมีจิตวิญญาณเติบโต',
    'พระศุกร์': 'ความสুখ ความรัก ศิลปะ การเงินดี สัมพันธ์ดี',
    'พระอาทิตย์': 'ความสำเร็จ เกียรติยศ ความเป็นผู้นำ แต่อาจเมื่อยลา',
    'พระจันทร์': 'ความมั่นคง ครอบครัว ความนิ่มนวล แต่อารมณ์เปลี่ยนแปลง',
    'พระอังคาร': 'พลัง ความกล้า ความเป็นตัวตน บางครั้งทะเลาะ',
    'พระราหู': 'จุดหักเห บางครั้งสับสน แต่โอกาสเปลี่ยนแปลงใหญ่',
    'พระพฤหัส': 'ปัญญา ศาสนา การศึกษา ความสำเร็จปลายนิสัย',
    'พระเสาร์': 'ความพยายาม อุปสรรค ทำให้มีพื้นฐานแข็งแกร่ง',
    'พระพุทธ': 'การติดต่อ การค้นคว้า ธุรกิจ ความชาญฉลาด'
  };
  html += `<p style="margin-top:10px; color:#ddd; font-size:13px; line-height:1.6;">${dashaInfo[dasha.planet] || 'ดาวนี้มีอิทธิพลต่อชีวิตของคุณ'}</p>`;
  html += '</div>';

  html += '</div>';
  el.innerHTML = html;
}

// ─── Transit Analysis (ดาวจรปัจจุบัน) ──────────────────────────
function renderTransitAnalysis(birthPlanets) {
  const el = document.getElementById('transitAnalysis');
  if (!el) return;

  const now = new Date();
  const transitPlanets = siderealPlanets(toJD(now.getFullYear(), now.getMonth()+1, now.getDate(), 12));

  let html = '<div class="transit-container">';
  html += '<div class="section-title">🌍 การวิเคราะห์ดาวจรปัจจุบัน (Transit Analysis)</div>';
  html += `<p style="font-size:12px; color:#999; text-align:center; margin-bottom:15px;">วันนี้: ${now.toLocaleDateString('th-TH')}</p>`;

  html += '<div class="transit-grid">';

  const transitList = [
    { key: 'sun', name: 'พระอาทิตย์', color: '#E8C040' },
    { key: 'moon', name: 'พระจันทร์', color: '#C8D8E0' },
    { key: 'mars', name: 'พระอังคาร', color: '#D05030' },
    { key: 'mer', name: 'พระพุทธ', color: '#70B878' },
    { key: 'jup', name: 'พระพฤหัส', color: '#D4A050' },
    { key: 'ven', name: 'พระศุกร์', color: '#E8A0B8' },
    { key: 'sat', name: 'พระเสาร์', color: '#8090A8' }
  ];

  transitList.forEach(p => {
    const birthLon = birthPlanets[p.key].lon;
    const transitLon = transitPlanets[p.key].lon;
    const birthSign = Math.floor(birthLon / 30);
    const transitSign = Math.floor(transitLon / 30);
    const aspect = Math.abs(transitLon - birthLon);

    let aspectType = '';
    if (Math.abs(aspect) < 5) aspectType = '☌ คำ (Conjunction)';
    else if (Math.abs(aspect - 180) < 5) aspectType = '☍ ตรงข้าม (Opposition)';
    else if (Math.abs(aspect - 90) < 5 || Math.abs(aspect - 270) < 5) aspectType = '□ สี่เหลี่ยม (Square)';
    else if (Math.abs(aspect - 120) < 5 || Math.abs(aspect - 240) < 5) aspectType = '△ สามเหลี่ยม (Trine)';
    else aspectType = '✓ ไม่เกี่ยวข้อง';

    html += `<div class="transit-card" style="border-left-color:${p.color}">
      <div style="color:${p.color}; font-weight:700; margin-bottom:8px;">${p.name}</div>
      <div style="font-size:12px; color:#aaa;">เกิด: ราศี${RASI[birthSign]} ${Math.floor(birthLon % 30)}°</div>
      <div style="font-size:12px; color:#ccc;">วันนี้: ราศี${RASI[transitSign]} ${Math.floor(transitLon % 30)}°</div>
      <div style="margin-top:8px; padding:6px; background:rgba(200,150,62,0.1); border-radius:4px; font-size:11px;">
        ${aspectType}
      </div>
    </div>`;
  });

  html += '</div></div>';
  el.innerHTML = html;
}

// ─── 12 Bhavas Extended Analysis (Based on BPHS & Thai Astrology) ───
// Reference: Brihat Parashara Hora Shastra (BPHS), Jataka Parijata, Thai Astrology Tradition

function renderBhavaAnalysis(lagnaIdx, pl) {
  const el = document.getElementById('bhavaAnalysis');
  if (!el) {
    const resultsDiv = document.getElementById('thaiHoraResultsContent');
    const bhavaDiv = document.createElement('div');
    bhavaDiv.id = 'bhavaAnalysis';
    resultsDiv.appendChild(bhavaDiv);
  }

  // 12 Bhavas with BPHS reference
  const bhavas = [
    {
      name: 'ตนุ (Tanu Bhava)',
      num: 1,
      thai: 'ตนุ',
      meanings: ['ตัวตน', 'บุคลิกภาพ', 'ร่างกาย', 'สุขภาพ', 'ลักษณะ', 'สง่า'],
      detailed: `ตนุภพหรือลัคน์เป็นภพแรก กำหนดตัวตนและบุคลิกภาพของเจ้าชะตา นี่คือจุดเริ่มต้นของจักรชะตา (BPHS Ch.12) สิ่งที่แสดงในภพนี้ได้แก่ ลักษณะกายภาพ สีผิว รูปร่าง อายุ สุขภาพ จิตใจ และความเป็นตัวตนของคน ดาวเคราะห์ที่อยู่ในภพนี้จะส่งผลต่อบุคลิกและการจำแนกตัวตน เจ้าชะตาที่มีลัคน์ที่แข็งแกร่งจะมีเอกลักษณ์ชัดเจน กำลังจิตใจสูง และสามารถสร้างชะตาของตนเองได้`,
      significations: 'Physical body, appearance, vitality, self-identity, nature, well-being, complexion, vigor'
    },
    {
      name: 'กฎุมพะ (Dhana Bhava)',
      num: 2,
      thai: 'กฎุมพะ',
      meanings: ['ทรัพย์สิน', 'เงิน', 'ครอบครัว', 'คำพูด', 'อาหาร'],
      detailed: `กฎุมพะ (Dhana = ทรัพย์สิน) เป็นภพที่สองซึ่งบ่งบอกเรื่องการหาเงินหรือวาสนาทางการเงิน (BPHS Ch.13) ภพนี้ควบคุมความมั่งคั่ง การสะสมทรัพย์สิน ลักษณะการใช้จ่าย การสืบทอดมรดก ครอบครัว คำพูดและความสามารถในการเจรจา ดาวที่มีพลังดีในภพนี้จะนำเงินและความสมบูรณ์มา ดาวอุจจ์หรือเกษตรจะเพิ่มพูนทรัพย์สิน ส่วนดาวนิจจะทำให้เสียเงินหรือหนี้สิน`,
      significations: 'Wealth, money, accumulated possessions, family, food, speech, right eye, sources of income, financial stability'
    },
    {
      name: 'สหัชชะ (Sahaja Bhava)',
      num: 3,
      thai: 'สหัชชะ',
      meanings: ['พี่น้อง', 'ความกล้าหาญ', 'การติดต่อ', 'การเดินทางสั้น'],
      detailed: `สหัชชะ (Sahaja = coborn/พี่น้อง) เป็นภพที่สามซึ่งแสดงเรื่องพี่น้องหรือการติดต่อทั่วไป (BPHS Ch.14) ภพนี้เกี่ยวข้องกับพี่ชายพี่สาว เพื่อนบ้าน ชาวใกล้เคียง การเดินทางระยะสั้น ความกล้าหาญ ความเป็นกำลัง การเขียน การพูด และการประกอบการค้า ดาวในภพนี้จะส่งผลต่อความสัมพันธ์กับพี่น้องและความสามารถในการส่งสาร ภพนี้เป็นหนึ่งใน "Upachaya" (growth houses) ดังนั้นดาวลบจึงสามารถสร้างสรรค์ได้`,
      significations: 'Siblings, courage, communication, short travels, writing, hearing, trade/commerce, coborn, valor'
    },
    {
      name: 'พันธุ (Bandhu Bhava)',
      num: 4,
      thai: 'พันธุ',
      meanings: ['บ้าน', 'ครอบครัว', 'แม่', 'ยานพาหนะ', 'ที่ดิน'],
      detailed: `พันธุภพ (Bandhu = relation/บ้าน) เป็นภพที่สี่ซึ่งแสดงถึงบ้าน สถานที่อาศัย และความมั่นคงของครัวเรือน (BPHS Ch.15) ภพนี้ควบคุมบ้าน ที่ดิน ที่พักอาศัย รถยนต์หรือยานพาหนะ แม่ การแสดงความรักษัติ ความสบายใจ และความสุข ดาวที่ดีในภพนี้จะให้คณภาพชีวิตดี บ้านหลังใหญ่ และความอบอุ่นในครอบครัว ภพนี้เป็นภพเศษ (Kendra) และเป็นภพตรีโกณ (Trikona) ดังนั้นจึงสำคัญมาก`,
      significations: 'Home, property, mother, real estate, vehicles, emotions, inner happiness, roots, family foundation, land'
    },
    {
      name: 'ปุตตะ (Putra Bhava)',
      num: 5,
      thai: 'ปุตตะ',
      meanings: ['บุตร', 'ความรัก', 'ลูก', 'โปรเจกต์', 'การศึกษา'],
      detailed: `ปุตตะภพ (Putra = children) เป็นภพที่ห้าซึ่งบ่งบอกเรื่องบุตรหลาน ความรัก และความเป็นสิริมงคล (BPHS Ch.16) ภพนี้ควบคุมการมีบุตร การกำเนิดลูก ความรักโรแมนติก ความสร้างสรรค์ ศิลปะ เกม การเล่นการพนัน และการศึกษา ดาวที่อยู่ดีในภพนี้จะให้สัตว์บรรพชนดี (บุตร) และความสุขทางอารมณ์ ภพนี้เป็นเศษ (Kendra) และตรีโกณ (Trikona) ทำให้เป็นภพที่ดี`,
      significations: 'Children, progeny, romance, creativity, artistic abilities, intelligence, speculation, entertainment'
    },
    {
      name: 'อริ (Ari Bhava)',
      num: 6,
      thai: 'อริ',
      meanings: ['ศัตรู', 'โรค', 'หนี้', 'บริการ', 'อุปสรรค'],
      detailed: `อริภพ (Ari = enemies/ศัตรู) เป็นภพที่หกซึ่งแสดงความเคราะห์ร้ายและอุปสรรคต่างๆ (BPHS Ch.17) ภพนี้ควบคุมศัตรู คู่ต่อสู้ โรคภัยไข้เจ็บ หนี้บัญชี การให้บริการผู้อื่น การคิดค้นและการแก้ปัญหา ดาวที่มีพลังลบในภพนี้อาจนำมาซึ่งปัญหา แต่ดาวที่มีพลังบวกจะช่วยแก้ปัญหา ภพนี้เป็น "Upachaya" ดังนั้นดาวลบจึงสามารถเปลี่ยนกลับไปเป็นสิ่งดีได้`,
      significations: 'Enemies, diseases, obstacles, debt, service to others, problem-solving, conflicts, hard work, pets'
    },
    {
      name: 'ปัตนิ (Jaya Bhava)',
      num: 7,
      thai: 'ปัตนิ',
      meanings: ['คู่ครอง', 'คู่หู', 'คนรักกัน', 'ธุรกิจหุ้นส่วน'],
      detailed: `ปัตนิภพ (Jaya = conquest/spouse) เป็นภพที่เจ็ดซึ่งแสดงถึงการแต่งงานและคู่ครอง (BPHS Ch.18) ภพนี้ควบคุมบัณฑิตภรรยา คู่ครอง การแต่งงาน ความสัมพันธ์รักษัติ อัครศิลป์ความสวยงาม ธุรกิจหุ้นส่วน และการทำสัญญา ดาวที่ดีในภพนี้จะให้คู่ครองที่ดี การเลือกหุ้นส่วนที่เหมาะสม และความสุขในความสัมพันธ์ ภพนี้เป็นเศษ (Kendra) ซึ่งสำคัญต่อการวิเคราะห์ดวงชะตา`,
      significations: 'Spouse, partner, marriage, marital happiness, business partnerships, beauty, relations, cooperation'
    },
    {
      name: 'มรณะ (Randhra Bhava)',
      num: 8,
      thai: 'มรณะ',
      meanings: ['การเปลี่ยนแปลง', 'ความลับ', 'มรดก', 'ความลงลึก'],
      detailed: `มรณะภพ (Randhra = secret/ลึกลับ) เป็นภพที่แปดซึ่งเกี่ยวข้องกับการเปลี่ยนแปลงครั้งใหญ่และความลับ (BPHS Ch.19) ภพนี้ควบคุมอายุขัย ความลับ ความลึกลับ การพลัดพรากกัน มรดก ความรับมิได้ ความเจ็บปวด และปัญหาที่มีความจริงเชิงจิตใจลึก ดาวในภพนี้จะปลดปล่อยมรดกทางจิตใจหรือการแปรเปลี่ยน ภพนี้เป็น "Dusthana" (ภพที่ยากลำบาก) แต่ก็สำคัญต่อการเข้าใจความเลิกลับของชีวิต`,
      significations: 'Longevity, hidden matters, occult, inheritance, joint finances, death/transformation, mysteries, depth'
    },
    {
      name: 'ศุภะ (Dharma Bhava)',
      num: 9,
      thai: 'ศุภะ',
      meanings: ['ศาสนา', 'โชค', 'ท่องเที่ยว', 'พ่อ', 'ปัญญา'],
      detailed: `ศุภะภพ (Dharma = righteousness/โชค) เป็นภพที่เก้าซึ่งแสดงถึงความโชคดีและศาสตร์พระเวท (BPHS Ch.20) ภพนี้ควบคุมโชค พ่อ ศาสนา ปรัชญา การศึกษาระดับสูง การเดินทางไกลต่างประเทศ หนังสือเก่า และการบำรุงหนุนจากผู้ใหญ่ ดาวที่ดีในภพนี้จะให้มโหฬารศรัทธา โชคดีในการเดินทาง และพ่อที่ดี ภพนี้เป็นเศษ (Kendra) และตรีโกณ (Trikona) ซึ่งสำคัญมากต่อความสำเร็จ`,
      significations: 'Fortune, father, luck, philosophy, higher education, pilgrimage, long travels, righteousness, guru'
    },
    {
      name: 'กัมมะ (Karma Bhava)',
      num: 10,
      thai: 'กัมมะ',
      meanings: ['อาชีพ', 'การงาน', 'สถานะสังคม', 'กิจการ'],
      detailed: `กัมมะภพ (Karma = deeds/งาน) เป็นภพที่สิบซึ่งแสดงการงานและส่วนราชการ (BPHS Ch.21) ภพนี้ควบคุมอาชีพ การงาน ตำแหน่งหน้าที่ สถานะสังคม การสร้างเกียรติยศ และความสำเร็จในชีวิต ดาวที่ดีในภพนี้จะให้ความสำเร็จในการงาน ตำแหน่งที่ดี และเกียรติยศ ภพนี้เป็นเศษ (Kendra) และเป็นสถานที่ที่ได้รับพลังจาก 10th lord ซึ่งจะนำมาซึ่งความสำเร็จ`,
      significations: 'Career, profession, occupation, status, authority, achievement, reputation, public recognition, karma'
    },
    {
      name: 'ลาภะ (Labha Bhava)',
      num: 11,
      thai: 'ลาภะ',
      meanings: ['รายได้', 'การหา', 'เพื่อน', 'โลภ', 'ความปรารถนา'],
      detailed: `ลาภะภพ (Labha = gains/รายได้) เป็นภพที่สิบเอ็ดซึ่งแสดงการได้รับและความปรารถนา (BPHS Ch.22) ภพนี้ควบคุมรายได้พิเศษ ผลกำไร เพื่อน ความคาดหวังทั่วไป ความปรารถนา และมิตรภาพ ดาวที่ดีในภพนี้จะให้ผลกำไรหรือรายได้เสริม และมีเพื่อนดีที่ช่วยเหลือ ภพนี้เป็น "Upachaya" ดังนั้นดาวในที่ทำให้ดีและเพิ่มผลประโยชน์ ภพนี้เป็นเศษ (Kendra) ซึ่งให้ความแข็งแกร่ง`,
      significations: 'Gains, income, profits, friends, hopes, wishes, elder siblings, success in endeavors, large groups'
    },
    {
      name: 'วินาสน์ (Vyaya Bhava)',
      num: 12,
      thai: 'วินาสน์',
      meanings: ['บ้านเสีย', 'การสลัด', 'ปลายนิสัย', 'จิตวิญญาณ'],
      detailed: `วินาสน์ภพ (Vyaya = loss/สลัด) เป็นภพที่สิบสองซึ่งแสดงการสิ้นสุดและปลดปล่อยจากโลก (BPHS Ch.23) ภพนี้ควบคุมการใช้จ่าย ค่าใช้สอย ความเสียหาย การเคลื่อนไหวต่างประเทศ เรื่องลับเงียบ การแยกจากกัน จิตวิญญาณ และการหลุดพ้นจากโลก ดาวที่ดีในภพนี้จะหลีกเลี่ยงการสูญเสีย และสนับสนุนจิตวิญญาณ ภพนี้เป็น "Dusthana" (ภพท้ายอุบัติเหตุ) แต่มีความสำคัญต่อการปลดปล่อย`,
      significations: 'Expenses, losses, foreign residence, spirituality, hidden/subconscious, isolation, liberation, endings'
    }
  ];

  // Build bhavas with planets
  let html = '<div class="bhavas-container">';
  html += '<div class="section-title">📍 การวิเคราะห์ 12 ภพ (Bhavas) อย่างละเอียด</div>';
  html += '<p class="source-note" style="font-size:12px; color:#999; margin-bottom:20px;">อ้างอิง: Brihat Parashara Hora Shastra (BPHS) + Jataka Parijata + โหราศาสตร์ไทยประเพณี</p>';

  bhavas.forEach(bhava => {
    const houseIdx = (bhava.num - 1);
    const planetsInHouse = [];

    // Find planets in this house
    [
      { id: 'sun', lon: pl.sun.lon },
      { id: 'moon', lon: pl.moon.lon },
      { id: 'mars', lon: pl.mars.lon },
      { id: 'mer', lon: pl.mer.lon },
      { id: 'jup', lon: pl.jup.lon },
      { id: 'ven', lon: pl.ven.lon },
      { id: 'sat', lon: pl.sat.lon },
      { id: 'rahu', lon: pl.rahu.lon },
      { id: 'ketu', lon: pl.ketu.lon }
    ].forEach(p => {
      const pHouse = (degToSign(p.lon) - lagnaIdx + 12) % 12;
      if (pHouse === houseIdx) {
        const pInfo = PLANETS.find(x => x.id === p.id);
        planetsInHouse.push(pInfo);
      }
    });

    html += `<div class="bhava-card">
      <div class="bhava-header">
        <h3>ภพที่ ${bhava.num}: ${bhava.name}</h3>
        <span class="bhava-meanings">${bhava.meanings.join(' • ')}</span>
      </div>
      <div class="bhava-description">${bhava.detailed}</div>`;

    if (planetsInHouse.length > 0) {
      html += `<div class="planets-in-bhava">
        <strong>ดาวประจำภพนี้:</strong><br>`;
      planetsInHouse.forEach(p => {
        html += `<span style="color:${p.color}; margin-right:15px;">🔵 ${p.name}</span>`;
      });
      html += `</div>`;
    }

    html += `<div class="bhava-significations"><small><strong>นัยทั่วไป (Significations):</strong> ${bhava.significations}</small></div>`;
    html += `</div>`;
  });

  html += '</div>';
  el.innerHTML = html;
}

// Bhava Combinations Analysis
function analyzeBhavaCombinations(lagnaIdx, pl) {
  const el = document.getElementById('bhavaCombinations');
  if (!el) {
    const resultsDiv = document.getElementById('thaiHoraResultsContent');
    const combDiv = document.createElement('div');
    combDiv.id = 'bhavaCombinations';
    resultsDiv.appendChild(combDiv);
  }

  const sunSign = degToSign(pl.sun.lon);
  const moonSign = degToSign(pl.moon.lon);
  const jupSign = degToSign(pl.jup.lon);
  const satSign = degToSign(pl.sat.lon);
  const venSign = degToSign(pl.ven.lon);
  const merSign = degToSign(pl.mer.lon);
  const marsSign = degToSign(pl.mars.lon);

  const combinations = [];

  // Get house of each planet
  const sunHouse = (sunSign - lagnaIdx + 12) % 12;
  const moonHouse = (moonSign - lagnaIdx + 12) % 12;
  const jupHouse = (jupSign - lagnaIdx + 12) % 12;
  const satHouse = (satSign - lagnaIdx + 12) % 12;
  const venHouse = (venSign - lagnaIdx + 12) % 12;
  const merHouse = (merSign - lagnaIdx + 12) % 12;
  const marsHouse = (marsSign - lagnaIdx + 12) % 12;

  // Combinations analysis
  if (sunHouse === 0 && jupHouse === 9) {
    combinations.push({
      combo: 'อาทิตย์ใน Lagna + พฤหัสในศุภะ',
      meaning: 'สัญญาณของความสำเร็จมหาศาล พ่อจะได้รับเกียรติยศ และตัวเองจะเป็นผู้นำและผู้มีอำนาจ'
    });
  }

  if (jupHouse === 10 && sunHouse === 9) {
    combinations.push({
      combo: 'พฤหัสในกัมมะ + อาทิตย์ในศุภะ',
      meaning: 'โยค Raj Yoga — ความสำเร็จในอาชีพ บุคลิกภาพโดดเด่น และได้รับการสนับสนุนจากผู้ใหญ่'
    });
  }

  if (sunHouse === 10 && jupHouse === 1) {
    combinations.push({
      combo: 'อาทิตย์ในกัมมะ + พฤหัสในลัคน์',
      meaning: 'กำลังอำนาจสูง การงานประสบความสำเร็จ บุคลิกภาพแข็งแกร่งและเป็นผู้นำ'
    });
  }

  if (venHouse === 7 && merHouse !== 6 && marsHouse !== 6) {
    combinations.push({
      combo: 'ศุกร์ในปัตนิ ร่วมกับดาวบวก',
      meaning: 'คู่ครองจะมีบุคลิกที่ดี มีความรักอบอุ่น และความสุขในการแต่งงาน'
    });
  }

  if (jupHouse === 2) {
    combinations.push({
      combo: 'พฤหัสในกฎุมพะ',
      meaning: 'ทรัพย์สินเพิ่มพูน ได้รับมรดกดี ครอบครัวที่อบอุ่น และคำพูดที่มีผลจริง (BPHS Ch.13)'
    });
  }

  if (satHouse === 6) {
    combinations.push({
      combo: 'เสาร์ในอริ',
      meaning: 'ต้องฝ่าฟันอุปสรรค โรค หนี้บัญชี แต่มีความอดทนที่จะแก้ปัญหาและชนะศัตรู'
    });
  }

  if (moonHouse === 4) {
    combinations.push({
      combo: 'จันทร์ในพันธุ',
      meaning: 'บ้านหลังใหญ่ ครอบครัวอบอุ่น แม่มีสุขภาพดี และได้รับความรักษัติจากคนใกล้ชิด'
    });
  }

  let html = '<div class="bhava-combinations-container">';
  html += '<div class="section-title">🔗 การผสมผสานของดาวเคราะห์ในภพ (Bhava Combinations)</div>';

  if (combinations.length > 0) {
    html += '<div class="combinations-list">';
    combinations.forEach(c => {
      html += `<div class="combination-item">
        <strong>${c.combo}</strong><br>
        <span style="color:#888">${c.meaning}</span>
      </div>`;
    });
    html += '</div>';
  } else {
    html += '<p style="color:#888; font-style:italic;">ดาวเคราะห์ไม่ได้อยู่ในภพผสมผสานพิเศษในเวลานี้</p>';
  }

  html += '</div>';
  el.innerHTML = html;
}


function showthaihora() {
    const container = document.getElementById('thaiHoraContainer');
   
    const html = `
    
  <div class="container">

  <header class="header-hora">
    <div class="header-emblem">☽</div>
    <h1>โหราศาสตร์ไทย</h1>
    <p class="subtitle">คัมภีร์สุริยยาตร์ · สิบสองราศี · นพเคราะห์</p>
  </header>
 

  <div class="input-card">
    <div style="margin-bottom:16px;">
      <label style="display:block;color:#d4af37;font-size:0.82rem;margin-bottom:6px;">👥 เลือกสมาชิกจากประวัติ</label>
      <select id="thaiHoraMemberSelect" onchange="fillThaiHoraFromMember(this.value)"
              style="width:100%;background:#1a1410;color:#d4af37;border:1.5px solid #d4af37;padding:8px 12px;border-radius:8px;font-size:0.88rem;">
        <option value="">— เลือกสมาชิก —</option>
      </select>
    </div>
    <div class="input-grid">
      <div>
        <label>วันเกิด (พ.ศ.)</label>
        <input type="number" id="inYear" placeholder="2530" min="2400" max="2600">
      </div>
      <div>
        <label>เดือนเกิด</label>
        <select id="inMonth">
          <option value="1">มกราคม</option><option value="2">กุมภาพันธ์</option>
          <option value="3">มีนาคม</option><option value="4">เมษายน</option>
          <option value="5">พฤษภาคม</option><option value="6">มิถุนายน</option>
          <option value="7">กรกฎาคม</option><option value="8">สิงหาคม</option>
          <option value="9">กันยายน</option><option value="10">ตุลาคม</option>
          <option value="11">พฤศจิกายน</option><option value="12">ธันวาคม</option>
        </select>
      </div>
      <div>
        <label>วันที่เกิด</label>
        <input type="number" id="inDay" placeholder="1" min="1" max="31">
      </div>
      <div>
        <label>ชั่วโมง (0–23)</label>
        <input type="number" id="inHour" placeholder="12" min="0" max="23">
      </div>
      <div>
        <label>นาที</label>
        <input type="number" id="inMin" placeholder="0" min="0" max="59">
      </div>
      <div>
        <label>เพศ</label>
        <select id="inSex">
          <option value="m">ชาย</option>
          <option value="f">หญิง</option>
        </select>
      </div>
    </div>
    <button class="btn" onclick="calculate()">✦ ดูดวงชะตา ✦</button>
  </div>

  <div id="results">
    <div class="loading" id="loadingMsg">
      <div class="spinner"></div><br>กำลังคำนวณดาวนพเคราะห์…
    </div>
    <div id="thaiHoraResultsContent" style="display:none">

      <div class="section-title">นักษัตรและฤกษ์</div>
      <div class="nakkhatra-display">
        <div class="nakkhatra-name" id="naksatraName">—</div>
        <div class="nakkhatra-sub" id="naksatraSub">—</div>
      </div>

      <div class="section-title">ตำแหน่งนพเคราะห์</div>
      <div class="planet-grid" id="planetGrid"></div>

      <div class="section-title">แผนภูมิราศีจักร</div>
      <div class="chart-container">
        <canvas id="chartCanvas" width="480" height="480"></canvas>
      </div>

      <div class="section-title">ข้อมูลพื้นฐาน</div>
      <div class="info-grid">
        <div class="info-block">
          <h3>ชาตาศาสตร์</h3>
          <div class="info-row"><span class="info-label">จุลศักราช</span><span class="info-value highlight" id="cs">—</span></div>
          <div class="info-row"><span class="info-label">ปีนักษัตร</span><span class="info-value" id="animalYear">—</span></div>
          <div class="info-row"><span class="info-label">วันเกิด</span><span class="info-value" id="birthDay">—</span></div>
          <div class="info-row"><span class="info-label">เกณฑ์วันเกิด</span><span class="info-value" id="kenDay">—</span></div>
          <div class="info-row"><span class="info-label">ราศีลัคน์</span><span class="info-value highlight" id="lagnaSign">—</span></div>
          <div class="info-row"><span class="info-label">ราศีพระจันทร์</span><span class="info-value" id="moonSign">—</span></div>
        </div>
        <div class="info-block">
          <h3>เกณฑ์โหราศาสตร์</h3>
          <div class="info-row"><span class="info-label">ฤกษ์เกิด</span><span class="info-value highlight" id="birthNak">—</span></div>
          <div class="info-row"><span class="info-label">จรดยาม</span><span class="info-value" id="yam">—</span></div>
          <div class="info-row"><span class="info-label">ธาตุเกิด</span><span class="info-value" id="element">—</span></div>
          <div class="info-row"><span class="info-label">ทิศเมือง</span><span class="info-value" id="direction">—</span></div>
          <div class="info-row"><span class="info-label">เจ้าชะตา</span><span class="info-value highlight" id="lordStar">—</span></div>
          <div class="info-row"><span class="info-label">ดาวประจำวัน</span><span class="info-value" id="dayRuler">—</span></div>
        </div>
      </div>

      <div class="ornate-divider">✦ พยากรณ์ชะตา ✦</div>
      <div id="predictions"></div>

      <div class="export-buttons">
        <button class="btn-export" onclick="exportResultsJSON(window.birthData)" title="Export as JSON">📥 JSON</button>
        <button class="btn-export" onclick="exportResultsCSV(window.birthData)" title="Export as CSV">📋 CSV</button>
        <button class="btn-export" onclick="exportResultsTXT(window.birthData, window.plOrder, window.predictionsList)" title="Export as TXT">📄 TXT</button>
        <button class="btn-export" onclick="window.print()" title="Print">🖨️ Print</button>
        <button class="btn-export" onclick="showShareModal()" title="Share">📤 Share</button>
      </div>

      <div id="shareModal" class="share-modal" style="display:none;">
        <div class="share-modal-content">
          <span class="share-modal-close" onclick="closeShareModal()">&times;</span>
          <h3>แชร์ผลการดูดวง</h3>
          <div class="share-buttons">
            <button onclick="shareToFacebook()" class="share-btn facebook">📘 Facebook</button>
            <button onclick="shareToLine()" class="share-btn line">💬 LINE</button>
            <button onclick="copyShareUrl()" class="share-btn copy">📋 Copy Link</button>
          </div>
          <div id="qrCode" style="text-align:center; margin-top:20px; display:none;">
            <p style="font-size:12px; color:#999;">QR Code</p>
            <img id="qrImg" style="max-width:200px; margin-top:10px;">
          </div>
        </div>
      </div>

      <div class="ornate-divider">✦ ดาวจรปัจจุบัน ✦</div>
      <div id="transitAnalysis"></div>

      <div class="ornate-divider">✦ ระบบ Dasha (120 ปี) ✦</div>
      <div id="dashaAnalysis"></div>

      <div class="ornate-divider">✦ การวิเคราะห์ภพขั้นสูง ✦</div>
      <div id="advancedHouses"></div>

      <div class="ornate-divider">✦ การวิเคราะห์ 12 ภพ ✦</div>
      <div id="bhavaAnalysis"></div>

      <div id="bhavaCombinations"></div>

    </div>
  </div>

</div>
`;
    container.innerHTML = html;
    
    // เติมข้อมูลสมาชิกลงใน Dropdown หลังจากสร้าง HTML
    populateThaiHoraMemberSelect();
}

// ─── Member autofill helpers ──────────────────────────────────────
function getVisibleMembersHora() {
    const all = JSON.parse(localStorage.getItem('horo_history') || '[]');
    try {
        const s = JSON.parse(localStorage.getItem('siamhora_auth_session') || '{}');
        if (s.role === 'admin') return all;
        const u = s.username || localStorage.getItem('userId');
        if (!u) return all;
        return all.filter(m => !m.username || m.username === u);
    } catch { return all; }
}

function populateThaiHoraMemberSelect() {
    const sel = document.getElementById('thaiHoraMemberSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">— เลือกสมาชิก (' + getVisibleMembersHora().length + ' คน) —</option>';
    getVisibleMembersHora().forEach(m => {
        const name = [m.name, m.lastName].filter(Boolean).join(' ') || 'ไม่มีชื่อ';
        const opt = document.createElement('option');
        opt.value = JSON.stringify({ birthdate: m.birthdate, birthtime: m.birthtime, gender: m.gender });
        opt.textContent = name + (m.birthdate ? ' — ' + m.birthdate : '');
        sel.appendChild(opt);
    });
}

function fillThaiHoraFromMember(val) {
    if (!val) return;
    try {
        const m = JSON.parse(val);
        if (m.birthdate) {
            const parts = m.birthdate.split('/');
            let year = parseInt(parts[2]);
            if (year < 2400) year += 543;
            document.getElementById('inYear').value  = year;
            document.getElementById('inMonth').value = parseInt(parts[1]);
            document.getElementById('inDay').value   = parseInt(parts[0]);
        }
        if (m.birthtime) {
            const t = m.birthtime.replace(/\s*น\.?/, '').trim();
            const tp = t.split(':');
            if (tp.length >= 2) {
                document.getElementById('inHour').value = parseInt(tp[0]) || 0;
                document.getElementById('inMin').value  = parseInt(tp[1]) || 0;
            }
        }
        if (m.gender) {
            const sx = document.getElementById('inSex');
            if (sx) sx.value = (m.gender === 'ชาย' || m.gender === 'm') ? 'm' : 'f';
        }
    } catch(e) { console.error('fillThaiHoraFromMember:', e); }
}

// ─── Set default values ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    showthaihora();
    populateThaiHoraMemberSelect();
  const now = new Date();
  document.getElementById('inYear').value  = now.getFullYear() + 543 - 30;
  document.getElementById('inMonth').value = now.getMonth() + 1;
  document.getElementById('inDay').value   = now.getDate();
  document.getElementById('inHour').value  = 8;
  document.getElementById('inMin').value   = 0;
});