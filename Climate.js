"use strict";

function showclimate(){
    const container = document.getElementById("showclimatepage");
    if (!container) return;

    const html = `
    <div class="container wiki-article">
            <h2 style="text-align: center;">เกณฑ์พิรุณศาสตร์และชะตาโลก</h2>
            <p style="text-align: center;">พยากรณ์ปริมาณน้ำฝน ความอุดมสมบูรณ์ของธัญญาหาร และเกณฑ์นาคให้น้ำประจำปี</p>
            <div style="text-align: center;">
                    <div>
                        <label color: #000000>ระบุปี พ.ศ. :</label>
                        <div>
                            <input type="number" id="beYearInput" value="2569"
                                oninput="calculateClimate()">
                            <span id="displayCSYear" style="font-size: 1rem; color: #28a745; font-weight: bold;">(ป้อนปี พ.ศ.เพื่อเริ่มคำนวณ)</span>
                        </div>
                    </div>
                    <input type="hidden" id="zodiacInput">
                    <br>
                    <div id="climate-result-box" class="row d-none">
                <div class="col-md-8">
                    <div class="wiki-card p-3 border rounded shadow-sm">
                        <h5 class="border-bottom pb-2 text-primary">
                        <i class="fas fa-seedling"></i>เกณฑ์ธัญญาหารและธาราธิคุณ</h5>
                        <p id="res-crop-text" class="wiki-text"></p>
                        <p id="res-thara-text" class="wiki-text"></p>
                        <hr>
                        <h5 class="text-info"><i class="fas fa-dragon"></i> เกณฑ์นาคให้น้ำ</h5>
                        <p id="res-naga-text" class="wiki-text mb-0"></p>
                    <table class="rain-table mt-4" style="width: 100%; min-width: 200px; margin: 0 auto;">
                        <tr class="bg-primary text-white text-center">
                            <th colspan="2" style="font-size: 1rem; padding: 8px 4px;">ปริมาณน้ำฝน (ห่า)</th>
                        </tr>
                        <tr>
                            <th style="width: 50%; font-size: 0.85rem;text-align: center;">จักรวาล</th>
                            <td id="rain-uni" style="width: 40%;"></td>
                        </tr>
                        <tr>
                            <th style="font-size: 0.85rem;text-align: center;">หิมพานต์</th>
                            <td id="rain-him"></td>
                        </tr>
                        <tr>
                            <th style="font-size: 0.85rem;text-align: center;">มหาสมุทร</th>
                            <td id="rain-ocean"></td>
                        </tr>
                        <tr>
                            <th style="font-size: 0.85rem;text-align: center;">มนุษย์โลก</th>
                            <td id="rain-human" class="fw-bold text-success"></td>
                        </tr>
                        <tr class="table-info">
                            <th style="font-size: 0.85rem;text-align: center;">รวม</th>
                            <td id="rain-total" class="fw-bold"></td>
                        </tr>
                    </table>
                    </div>
                </div>
            </div>
            </div>            
            <div class="row mt-4">
                <div class="col-6">
                    <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                        <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                        <i class="fas fa-home"></i> กลับหน้าหลัก
                    </button>
                </div>
            </div>
        </div>    
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    showclimate();
});



// ---------------------------------------------------------------------------
// ข้อมูลปีนักษัตร
// เรียงให้ พ.ศ. 2563 (ปีชวด) % 12 === 3 → index 3 = "rat"
// ตรวจสอบ: 2563 % 12 = 7 → offset = (7 - 3 + 12) % 12 = 4
// ดังนั้น index = (beYear % 12 + ZODIAC_OFFSET) % 12
// ---------------------------------------------------------------------------
const ZODIAC_OFFSET = 4;

const ZODIAC_KEYS  = ["rat","ox","tiger","rabbit","dragon","snake",
                      "horse","goat","monkey","rooster","dog","pig"];
const ZODIAC_NAMES = ["ชวด","ฉลู","ขาล","เถาะ","มะโรง","มะเส็ง",
                      "มะเมีย","มะแม","วอก","ระกา","จอ","กุน"];

// ---------------------------------------------------------------------------
// แปลง พ.ศ. → จ.ศ.
// ---------------------------------------------------------------------------
function getCSYear(beYear) {
    return beYear - 1181;
}

// ---------------------------------------------------------------------------
// หาปีนักษัตรจาก พ.ศ.
// ---------------------------------------------------------------------------
function getZodiacFromBE(beYear) {
    const index = (beYear % 12 + ZODIAC_OFFSET) % 12;
    return {
        key:  ZODIAC_KEYS[index],
        name: ZODIAC_NAMES[index]
    };
}

// ---------------------------------------------------------------------------
// คำนวณพยากรณ์พิรุณศาสตร์
// @param {number} csYear   - จุลศักราช
// @param {string} zodiac   - key ปีนักษัตร (เช่น "rat", "dragon")
// @param {number} userAge  - อายุผู้ใช้ (รับจาก input)
// ---------------------------------------------------------------------------
function calculateWeatherFortune(csYear, zodiac, userAge) {

    // 1. เกณฑ์พิรุณศาสตร์ — จำนวนน้ำฝนรวม (ห่า)
    // เศษ 0=เสาร์ 1=อาทิตย์ 2=จันทร์ 3=อังคาร 4=พุธ 5=พฤหัส 6=ศุกร์
    const pirusaRemainder = ((csYear - 2) % 7 + 7) % 7;
    const rainByPlanet    = { 0:300, 1:400, 2:500, 3:600, 4:400, 5:500, 6:600 };
    const totalRain       = rainByPlanet[pirusaRemainder];

    const rainDist = {
        universe: (totalRain / 10) * 4,
        himmapan: (totalRain / 10) * 3,
        ocean:    (totalRain / 10) * 2,
        human:    (totalRain / 10) * 1
    };

    // 2. เกณฑ์น้ำมาก-น้อย — ใช้อายุจริงจากผู้ใช้
    const waterScore = (84 % csYear) * userAge % 16;
    let waterLevel;
    if      (waterScore <= 5)  waterLevel = "น้ำน้อยแล";
    else if (waterScore <= 10) waterLevel = "น้ำปานกลาง";
    else                       waterLevel = "น้ำมากแล";

    // 3. เกณฑ์ธาราธิคุณ (ปฐวี เตโช วาโย อาโป)
    const tharaList = [
        "อาโป (น้ำมาก — น้ำท่วม)",
        "ปฐวี (น้ำพองาม)",
        "เตโช (น้ำน้อย — อากาศร้อน)",
        "วาโย (น้ำน้อย — พายุจัด)"
    ];
    const tharaIndex  = csYear % 12;
    const tharaResult = tharaList[tharaIndex % 4];

    // 4. เกณฑ์ธัญญาหาร — ความอุดมสมบูรณ์ของข้าวปลา
    const cropRemainder = ((csYear + 12) % 7 + 7) % 7;
    const cropMap = {
        1: "ปาปะ — ข้าวกล้าได้ 1 ส่วน เสีย 10 ส่วน กันดารอาหารและฉิบหายมาก",
        6: "ลาภะ — ข้าวกล้าได้ 10 ส่วน เสีย 1 ส่วน อยู่เย็นเป็นสุข ธัญญาหารบริบูรณ์",
        2: "มัชฌิมา — ข้าวกล้าได้ครึ่งเสียครึ่ง ประชาชนได้สุขปานกลาง",
        4: "มัชฌิมา — ข้าวกล้าได้ครึ่งเสียครึ่ง ประชาชนได้สุขปานกลาง",
        3: "วิบัติ — เกิดกิมิชาติ (แมลง) รบกวน ข้าวเสียมาก เมืองเกิดยุทธสงคราม",
        5: "วิบัติ — เกิดกิมิชาติ (แมลง) รบกวน ข้าวเสียมาก เมืองเกิดยุทธสงคราม",
        0: "ปานกลางตามเกณฑ์ชะตาโลก"
    };
    const cropResult = cropMap[cropRemainder] || "ปานกลางตามเกณฑ์ชะตาโลก";

    // 5. นาคให้น้ำ — ตามปีนักษัตร
    const nagaRainMap = {
        rat:     { count: 3, note: "ฝนแรกน้อย กลางงาม ปลายงามแล" },
        ox:      { count: 6, note: "ฝนต้น-กลาง-ปลายปีเสมอกันแล" },
        tiger:   { count: 7, note: "ฝนต้นปีงาม กลางปีน้อย ปลายปีมากแล" },
        rabbit:  { count: 2, note: "ฝนต้นปีน้อย กลางปีงาม ปลายปีอุดมดีแล" },
        dragon:  { count: 3, note: "ฝนต้นปีมาก กลางปีงาม ปลายปีน้อยแล" },
        snake:   { count: 5, note: "ฝนต้นปีมีมาก กลางปีงาม ปลายปีน้อยแล" },
        horse:   { count: 4, note: "ฝนต้นปีงาม กลางปีงาม ปลายปีก็งามแล" },
        goat:    { count: 2, note: "ฝนต้น-กลาง-ปลายปีเสมอกันแล" },
        monkey:  { count: 3, note: "ฝนต้นปีน้อย กลางปีงาม ปลายปีมากแล" },
        rooster: { count: 3, note: "ฝนต้นปีน้อย กลางปีงาม ปลายปีมากแล" },
        dog:     { count: 6, note: "ฝนต้นปีน้อย กลางปีงาม ปลายปีงามแล" },
        pig:     { count: 5, note: "ฝนต้นปีงาม กลางปีน้อย ปลายปีมากแล" }
    };
    const nagaInfo = nagaRainMap[zodiac] || { count: 0, note: "ไม่ระบุ" };

    return { totalRain, rainDist, waterLevel, tharaResult, cropResult, nagaInfo };
}

// ---------------------------------------------------------------------------
// render ผลลัพธ์ลง DOM พร้อม null-check ทุก element
// ---------------------------------------------------------------------------
function renderClimateResult(data) {
    const box = document.getElementById("climate-result-box");
    if (!box) return;
    box.classList.remove("d-none");

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };
    const setHTML = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    const { universe, himmapan, ocean, human } = data.rainDist;

    set("rain-uni",   `${universe} ห่า`);
    set("rain-him",   `${himmapan} ห่า`);
    set("rain-ocean", `${ocean} ห่า`);
    set("rain-human", `${human} ห่า`);
    set("rain-total", `${universe + himmapan + ocean + human} ห่า`);

    setHTML("res-crop-text",  `<b>เกณฑ์ธัญญาหาร:</b> ${data.cropResult}`);
    setHTML("res-thara-text", `<b>เกณฑ์ธาราธิคุณ:</b> ${data.tharaResult} (${data.waterLevel})`);
    setHTML("res-naga-text",  `ปีนี้มีนาคให้น้ำ <b>${data.nagaInfo.count} ตัว</b> — ${data.nagaInfo.note}`);
}

// ---------------------------------------------------------------------------
// ฟังก์ชันหลัก — อ่าน input → คำนวณ → render
// ---------------------------------------------------------------------------
function calculateClimate() {
    const beYearEl = document.getElementById("beYearInput");
    const userAgeEl = document.getElementById("userAgeInput");

    if (!beYearEl || !beYearEl.value.trim()) return;

    const beYear  = parseInt(beYearEl.value, 10);
    const userAge = (userAgeEl && userAgeEl.value.trim())
                    ? parseInt(userAgeEl.value, 10)
                    : 0;

    if (isNaN(beYear) || beYear < 2400) return;

    const zodiacData = getZodiacFromBE(beYear);
    const csYear     = getCSYear(beYear);

    const displayEl = document.getElementById("displayCSYear");
    if (displayEl) {
        displayEl.innerText = `(จุลศักราช: ${csYear} | ปี${zodiacData.name})`;
    }

    const data = calculateWeatherFortune(csYear, zodiacData.key, userAge);
    renderClimateResult(data);
}

// ---------------------------------------------------------------------------
// Bootstrap — ผูก event ครั้งเดียวใน DOMContentLoaded
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const beYearInput = document.getElementById("beYearInput");
    if (beYearInput) {
        beYearInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                calculateClimate();
            }
        });
    }
});