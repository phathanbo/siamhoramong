"use strict";

/* =========================
   1. DATA (Immutable)
========================= */
const relations = Object.freeze([
    { day: "อาทิตย์", friend: "พฤหัสบดี", enemy: "อังคาร", power: "ศุกร์", element: "เสาร์" },
    { day: "จันทร์", friend: "พุธ", enemy: "พฤหัสบดี", power: "ราหู", element: "พฤหัสบดี" },
    { day: "อังคาร", friend: "ศุกร์", enemy: "อาทิตย์", power: "พฤหัสบดี", element: "ราหู" },
    { day: "พุธ", friend: "จันทร์", enemy: "ราหู", power: "เสาร์", element: "ศุกร์" },
    { day: "พฤหัสบดี", friend: "อาทิตย์", enemy: "จันทร์", power: "อังคาร", element: "จันทร์" },
    { day: "ศุกร์", friend: "อังคาร", enemy: "เสาร์", power: "อาทิตย์", element: "พุธ" },
    { day: "เสาร์", friend: "ราหู", enemy: "ศุกร์", power: "พุธ", element: "อาทิตย์" }
]);

/* =========================
   6. UI TEMPLATE (Safe)
========================= */
function createCard(data) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-3";

    const card = document.createElement("div");
    card.className = "card border-gold h-100 shadow-sm";

    card.innerHTML = `
        <div class="card-header bg-dark text-white text-center py-2 border-bottom-gold">
            <b class="text-gold">วัน${data.day}</b>
        </div>
        <div class="card-body p-2 small">
            ${createItem("success", "มิตร", `<span style="color: #28a745;">${data.friend}</span>`, "เกื้อกูลกัน เป็นที่ปรึกษาที่ดี")}
            ${createItem("danger", "ศัตรู", `<span style="color: #dc3545;">${data.enemy}</span>`, "ความเห็นไม่ตรงกัน มักมีปากเสียง")}
            ${createItem("primary", "สมพล", `<span style="color: #007bff;">${data.power}</span>`, "ช่วยกันสร้างฐานะ มีพลังอำนาจ")}
            ${createItem("warning text-dark", "ธาตุ", `<span style="color: #ffc107;">${data.element}</span>`, "เสริมความมั่นคง เป็นปึกแผ่น")}
        </div>
    `;

    col.appendChild(card);
    return col;
}

/* =========================
   4. UI TEMPLATE
========================= */

const PLANETS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์","ราหู"];
const PLANET_COLORS = {
  "อาทิตย์": "#e67e22", "จันทร์": "#f1c40f", "อังคาร": "#e74c3c",
  "พุธ": "#2ecc71", "พฤหัสบดี": "#f39c12", "ศุกร์": "#3498db",
  "เสาร์": "#7f8c8d", "ราหู": "#2c3e50"
};

// 🔥 กำหนดความสัมพันธ์จริง (ครบทุกคู่)
const RELATION_RULES = {
"อาทิตย์|พฤหัสบดี": { type:"excellent", score:95, label:"มิตรใหญ่" },
"จันทร์|พุธ": { type:"excellent", score:95, label:"มิตรใหญ่" },
"ศุกร์|อังคาร": { type:"excellent", score:95, label:"มิตรใหญ่" },
"ราหู|เสาร์": { type:"excellent", score:95, label:"มิตรใหญ่" },


"อาทิตย์|เสาร์": { type:"good", score:75, label:"มิตรน้อย" },
"จันทร์|อังคาร": { type:"good", score:75, label:"มิตรน้อย" },
"อังคาร|ราหู": { type:"good", score:75, label:"มิตรน้อย" },
"พุธ|เสาร์": { type:"good", score:75, label:"มิตรน้อย" },

"อาทิตย์|อังคาร": { type:"bad", score:30, label:"ศัตรูใหญ่" },
"จันทร์|พฤหัสบดี": { type:"bad", score:30, label:"ศัตรูใหญ่" },
"พุธ|ราหู": { type:"bad", score:30, label:"ศัตรูใหญ่" },
"ศุกร์|เสาร์": { type:"bad", score:30, label:"ศัตรูใหญ่" },

"อาทิตย์|จันทร์": { type:"poor", score:50, label:"ศัตรูเล็ก" },
"อังคาร|เสาร์": { type:"poor", score:50, label:"ศัตรูเล็ก" },
"พฤหัสบดี|ราหู": { type:"poor", score:50, label:"ศัตรูเล็ก" },
"พุธ|ศุกร์": { type:"poor", score:50, label:"ศัตรูเล็ก" }

};



/* =========================
   3. UTIL
========================= */

function normalize(v = "") {
    // กรณีที่ value ส่งมาเป็น "ราหู" โดยตรง หรือมีคำว่า กลางคืน/ราหู
    if (v === "ราหู" || v.includes("กลางคืน") || v.includes("ราหู")) {
        return "ราหู";
    }

    return v
        .replace(/^วัน/, "")
        .replace(/\s*\(กลางวัน\)/, "")
        .trim();
}

function getRelation(a, b) {
    const descMap = {
        excellent: "ส่งเสริมกันสูงมาก ช่วยให้ชีวิตเจริญรุ่งเรือง",
        good: "เกื้อหนุนกันดี มีความเข้าใจซึ่งกันและกัน",
        bad: "ขัดแย้งรุนแรง ต้องระวังเป็นพิเศษ",
        poor: "มีปัญหาบ้าง ต้องปรับตัวและเข้าใจกัน",
        same: "เข้าใจกันง่าย มีมุมมองคล้ายกัน",
        neutral: "ความสัมพันธ์ปกติ อยู่ร่วมกันได้"
    };

    if (a === b) return { type:"same", score:80, label:"วันเดียวกัน", desc:descMap.same };

    const rule = RELATION_RULES[`${a}|${b}`] || RELATION_RULES[`${b}|${a}`];
    if (rule) return { ...rule, desc: descMap[rule.type] || "" };

    return { type:"neutral", score:60, label:"เป็นกลาง", desc:descMap.neutral };
}

const colorize = name => `<span style="color:${PLANET_COLORS[name]||'#fff'};font-weight:bold">${name}</span>`;




function createItem(color, label, value, desc) {
    return `
        <div class="mb-2">
            <span class="badge badge-${color}">${label}:</span>
            <b>${value}</b><br>
            <small class="text-muted">${desc}</small>
        </div>
    `;
}


/* =========================
   5. RENDER ENGINE
========================= */
function renderRelationTable() {
    const container = document.getElementById("relationTableBody");

    if (!container) {
        console.warn("❗ relationTableBody not found");
        return;
    }

    // ป้องกัน render ซ้ำ
    if (container.dataset.rendered === "true") return;

    container.innerHTML = "";

    relations.forEach(item => {
        if (!validateRelation(item)) {
            console.error("❌ Invalid data:", item);
            return;
        }
        container.appendChild(createCard(item));
    });

    container.dataset.rendered = "true";
}


function renderTablerelation() {
    const container = document.getElementById("relationTableBodypage");
    if (!container) return;
    if (container.innerHTML.trim() !== "") return;

    const html = `
    <div class="compatibility-container">
        <div class="card shadow-lg border-gold">
            <div class="card-header bg-white text-gold text-center py-4">
                <h2 class="section-title">ดูวันที่เป็นมิตร-ศัตรู ของคู่สมรส</h2>
                <span class="section-subtitle">วิเคราะห์ตามตำราคู่มิตรและคู่ศัตรู (วันเกิด)</span>
                <hr>
                <div class="selection-grid">
                    <div class="input-box">
                        <label for="maleDay">วันเกิดฝ่ายชาย</label>
                        <select id="maleDay" class="form-control">
                            <option value="อาทิตย์">วันอาทิตย์</option>
                            <option value="จันทร์">วันจันทร์</option>
                            <option value="อังคาร">วันอังคาร</option>
                            <option value="พุธ">วันพุธ (กลางวัน)</option>
                            <option value="พฤหัสบดี">วันพฤหัสบดี</option>
                            <option value="ศุกร์">วันศุกร์</option>
                            <option value="เสาร์">วันเสาร์</option>
                            <option value="ราหู">วันพุธ (กลางคืน/ราหู)</option>
                        </select>
                    </div>
                    <div class="input-box">
                        <label for="femaleDay">วันเกิดฝ่ายหญิง</label>
                        <select id="femaleDay" class="form-control">
                            <option value="อาทิตย์">วันอาทิตย์</option>
                            <option value="จันทร์">วันจันทร์</option>
                            <option value="อังคาร">วันอังคาร</option>
                            <option value="พุธ">วันพุธ (กลางวัน)</option>
                            <option value="พฤหัสบดี">วันพฤหัสบดี</option>
                            <option value="ศุกร์">วันศุกร์</option>
                            <option value="เสาร์">วันเสาร์</option>
                            <option value="ราหู">วันพุธ (กลางคืน/ราหู)</option>
                        </select>
                    </div>
                </div>
                <div id="day-result-display" class="result-card" style="display: none;">
                    <div id="day-match-text"></div>
                </div>
            </div>
            <div class="card-body bg-light">
                <h2 class="mb-0">🌟 ตำราดาวคู่มิตร - คู่ศัตรู</h2>
                <br>
                <span>สรุปความสัมพันธ์ของคนเกิดทั้ง 7 วัน</span>
                <br><br>
                <div class="row" id="relationTableBody">
                </div>
                <hr>
                <div class="alert alert-warning small py-2">
                    <b>หมายเหตุ:</b> ใช้สำหรับพิจารณาการหาหุ้นส่วน คู่ครอง หรือบุคคลที่จะขอความช่วยเหลือ
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
        </div>
    </div>
    `;
    container.innerHTML = html;


  document.getElementById("maleDay").addEventListener("change",calculateDayFriendship);
  document.getElementById("femaleDay").addEventListener("change",calculateDayFriendship);
  renderRelationTable();
  calculateDayFriendship();
};




/* =========================
   6. VALIDATION
========================= */
function validateRelation(data) {
    return data.day && data.friend && data.enemy && data.power && data.element;
}


/* =========================
   7. MAIN ENGINE
========================= */

function calculateDayFriendship() {
    const maleEl = document.getElementById("maleDay");
    const femaleEl = document.getElementById("femaleDay");
    
    if (!maleEl || !femaleEl) return;

    const male = normalize(maleEl.value);
    const female = normalize(femaleEl.value);
    const result = getRelation(male, female);

    const display = document.getElementById("day-result-display");
    const text = document.getElementById("day-match-text");

    if (display && text) {
        display.style.display = "block";
        // ล้าง class เก่าออกก่อนใส่ class ใหม่ตามประเภทความสัมพันธ์
        display.className = `result-card p-3 mt-3 rounded text-center ${result.type}`;
        
        // กำหนดสีพื้นหลังตามประเภท (Inline Style เพื่อความชัวร์ถ้า CSS class ไม่ครอบคลุม)
        const bgColors = {
            excellent: "#d4edda", // เขียว
            good: "#e3f2fd",      // ฟ้า
            bad: "#f8d7da",       // แดง
            poor: "#fff3cd",      // เหลือง
            neutral: "#f8f9fa"    // เทา
        };
        display.style.backgroundColor = bgColors[result.type] || "#fff";

        text.innerHTML = `
            <h4 class="font-weight-bold">${colorize(male)} + ${colorize(female)}</h4>
            <h5 class="mt-2">${result.label}</h5>
            <p class="mb-1">${result.desc}</p>
            <div class="progress mt-2" style="height: 20px;">
                <div class="progress-bar" role="progressbar" style="width: ${result.score}%;" 
                     aria-valuenow="${result.score}" aria-valuemin="0" aria-valuemax="100">
                     ${result.score}%
                </div>
            </div>
        `;
    }
}

