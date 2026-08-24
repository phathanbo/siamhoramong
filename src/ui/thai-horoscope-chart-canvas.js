/**
 * 🎨 Thai Horoscope Pro Charts & UI Renderer
 * รองรับ: ราศีจักร, นวางค์จักร (นว.), ตรียางค์จักร (ตย.), ทักษา, ตรีวัย และ Export รูปภาพ
 */

const ThaiHoroProUI = (function() {
    "use strict";

    // ฟังก์ชันช่วยวาดวงกลม 12 ราศีพื้นฐาน
    function drawBaseWheel(ctx, cx, cy, radius, centerLabel = "") {
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.82, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.28, 0, 2 * Math.PI);
        ctx.stroke();

        // เส้นแบ่ง 12 ช่อง
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = cx + (radius * 0.28) * Math.cos(angle);
            const y1 = cy + (radius * 0.28) * Math.sin(angle);
            const x2 = cx + radius * Math.cos(angle);
            const y2 = cy + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#888888";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        const rasiNames = ["เมษ", "พฤษภ", "มิถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px Sarabun, sans-serif";
        ctx.fillStyle = "#222222";

        for (let i = 0; i < 12; i++) {
            const midAngle = ((i * 30) - 75) * Math.PI / 180;
            const rx = cx + (radius * 0.91) * Math.cos(midAngle);
            const ry = cy + (radius * 0.91) * Math.sin(midAngle);
            ctx.fillText(rasiNames[i], rx, ry);
        }

        if (centerLabel) {
            ctx.font = "bold 18px Sarabun, sans-serif";
            ctx.fillStyle = "#111111";
            ctx.fillText(centerLabel, cx, cy);
        }
    }

    // 1. วาดดวงราศีจักร
    function renderRasiChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - 30;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        drawBaseWheel(ctx, cx, cy, radius, "");

        if (data && data.asc) {
            ctx.font = "bold 15px Sarabun, sans-serif";
            ctx.fillStyle = "#111111";
            ctx.fillText(`${data.asc.deg}°`, cx, cy - 8);
            ctx.fillText(`${data.asc.min}'`, cx, cy + 12);
        }

        if (!data) return;

        const ascRasi = data.asc.rasiIndex;
        const planetsInRasi = {};
        for (let i = 0; i < 12; i++) planetsInRasi[i] = [];

        planetsInRasi[ascRasi].push({ label: "ล", color: "#d9534f" });

        for (let p in data.birthPlanets) {
            const planet = data.birthPlanets[p];
            planetsInRasi[planet.rasi].push({
                label: planet.thNum,
                color: (p === "1" || p === "3" || p === "7" || p === "8") ? "#c0392b" : "#2980b9"
            });
        }

        for (let i = 0; i < 12; i++) {
            const list = planetsInRasi[i];
            if (list.length === 0) continue;
            const midAngle = ((i * 30) - 75) * Math.PI / 180;
            const px = cx + (radius * 0.56) * Math.cos(midAngle);
            const py = cy + (radius * 0.56) * Math.sin(midAngle);
            ctx.font = "bold 20px Sarabun, sans-serif";
            ctx.fillStyle = "#1b2631";
            ctx.fillText(list.map(item => item.label).join(""), px, py);
        }

        if (options.showHouse !== false) {
            ctx.font = "12px Sarabun, sans-serif";
            ctx.fillStyle = "#d35400";
            for (let h = 0; h < 12; h++) {
                const targetRasi = (ascRasi + h) % 12;
                const midAngle = ((targetRasi * 30) - 75) * Math.PI / 180;
                const hx = cx + (radius * 1.14) * Math.cos(midAngle);
                const hy = cy + (radius * 1.14) * Math.sin(midAngle);
                ctx.fillText(ThaiHoroProEngine.HOUSES_12[h].name, hx, hy);
            }
        }

        if (options.showTransit !== false && data.transitPlanets) {
            ctx.font = "bold 15px Sarabun, sans-serif";
            ctx.fillStyle = "#27ae60";
            for (let p in data.transitPlanets) {
                const tp = data.transitPlanets[p];
                const midAngle = ((tp.rasi * 30) - 75) * Math.PI / 180;
                const tx = cx + (radius * 0.72) * Math.cos(midAngle);
                const ty = cy + (radius * 0.72) * Math.sin(midAngle);
                ctx.fillText(tp.thNum, tx + 6, ty + 8);
            }
        }
    }

    // 2. วาดดวงนวางค์จักร (นว.)
    function renderNavamshaChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - 25;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        drawBaseWheel(ctx, cx, cy, radius, "นว.");

        const planetsInRasi = {};
        for (let i = 0; i < 12; i++) planetsInRasi[i] = [];

        // ลัคนาในนวางค์
        planetsInRasi[data.asc.navamsha.navRasi].push("ล");

        // ดาวในนวางค์
        for (let p in data.birthPlanets) {
            const planet = data.birthPlanets[p];
            planetsInRasi[planet.navamsha.navRasi].push(planet.thNum);
        }

        for (let i = 0; i < 12; i++) {
            const list = planetsInRasi[i];
            if (list.length === 0) continue;
            const midAngle = ((i * 30) - 75) * Math.PI / 180;
            const px = cx + (radius * 0.56) * Math.cos(midAngle);
            const py = cy + (radius * 0.56) * Math.sin(midAngle);
            ctx.font = "bold 18px Sarabun, sans-serif";
            ctx.fillStyle = "#2c3e50";
            ctx.fillText(list.join(""), px, py);
        }
    }

    // 3. วาดดวงตรียางค์จักร (ตย.)
    function renderDrekkanaChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - 25;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        drawBaseWheel(ctx, cx, cy, radius, "ตย.");

        const planetsInRasi = {};
        for (let i = 0; i < 12; i++) planetsInRasi[i] = [];

        planetsInRasi[data.asc.drekkana.drekRasi].push("ล");

        for (let p in data.birthPlanets) {
            const planet = data.birthPlanets[p];
            planetsInRasi[planet.drekkana.drekRasi].push(planet.thNum);
        }

        for (let i = 0; i < 12; i++) {
            const list = planetsInRasi[i];
            if (list.length === 0) continue;
            const midAngle = ((i * 30) - 75) * Math.PI / 180;
            const px = cx + (radius * 0.56) * Math.cos(midAngle);
            const py = cy + (radius * 0.56) * Math.sin(midAngle);
            ctx.font = "bold 18px Sarabun, sans-serif";
            ctx.fillStyle = "#2c3e50";
            ctx.fillText(list.join(""), px, py);
        }
    }

    // วาดตารางทักษา
    function renderThaksaTable(containerId, thaksaData) {
        const el = document.getElementById(containerId);
        if (!el || !thaksaData) return;

        const pDefs = ThaiHoroProEngine.PLANET_DEFS;
        const orig = thaksaData.original;

        const cellData = [
            { pos: "ศรี", pNum: orig["ศรี"], jorPos: "มูละจร" },
            { pos: "มูละ", pNum: orig["มูละ"], jorPos: "อุตสาหะจร" },
            { pos: "อุตสาหะ", pNum: orig["อุตสาหะ"], jorPos: "มนตรีจร" },
            { pos: "เดช", pNum: orig["เดช"], jorPos: "ศรีจร" },
            { pos: "center", pNum: 9, jorPos: "↑ ๙" },
            { pos: "มนตรี", pNum: orig["มนตรี"], jorPos: "กาลกิณีจร" },
            { pos: "อายุ", pNum: orig["อายุ"], jorPos: "เดชจร" },
            { pos: "บริวาร", pNum: orig["บริวาร"], jorPos: "อายุจร" },
            { pos: "กาลกิณี", pNum: orig["กาลกิณี"], jorPos: "บริวารจร" }
        ];

        let html = '<div class="thaksa-grid">';
        cellData.forEach((c) => {
            const isCenter = c.pos === "center";
            const isKala = !isCenter && (c.pNum === thaksaData.kalakiniJor || c.jorPos.includes("กาลกิณี"));
            const circleClass = isKala ? 'thaksa-highlight-circle' : '';

            html += `
                <div class="thaksa-cell ${isCenter ? 'center-cell' : ''} ${circleClass}">
                    <div class="thaksa-top-label">${isCenter ? '' : c.pos}</div>
                    <div class="thaksa-num">${pDefs[c.pNum] ? pDefs[c.pNum].thNum : '๙'}</div>
                    <div class="thaksa-bot-label">${c.jorPos}</div>
                </div>
            `;
        });
        html += '</div>';

        el.innerHTML = html;
    }

    // วาดตารางตรีวัย
    function renderTrivaiTable(containerId, trivaiMatrix) {
        const el = document.getElementById(containerId);
        if (!el || !trivaiMatrix) return;

        let html = '<div class="trivai-grid">';
        for (let r = 0; r < trivaiMatrix.length; r++) {
            for (let c = 0; c < trivaiMatrix[r].length; c++) {
                const cell = trivaiMatrix[r][c];
                const activeClass = cell.isCurrent ? 'trivai-active-circle' : '';
                html += `
                    <div class="trivai-cell ${activeClass}">
                        <div class="trivai-house">${cell.houseName}</div>
                        <div class="trivai-num">${cell.thNum}</div>
                        <div class="trivai-age">${cell.ageText}</div>
                    </div>
                `;
            }
        }
        html += '</div>';
        html += `
            <div class="trivai-footer-labels">
                <span>วัยต้น</span>
                <span>วัยกลาง</span>
                <span>วัยปลาย</span>
                <span>วัยเทียบ</span>
            </div>
        `;

        el.innerHTML = html;
    }

    async function saveChartImage(elementId, filename = "siamhora_horoscope.png") {
        const target = document.getElementById(elementId);
        if (!target) return;

        if (typeof html2canvas === "function") {
            try {
                const canvas = await html2canvas(target, {
                    scale: 2,
                    backgroundColor: "#ffffff"
                });
                const link = document.createElement("a");
                link.download = filename;
                link.href = canvas.toDataURL("image/png");
                link.click();
            } catch (err) {
                console.error("Save image failed", err);
                alert("เกิดข้อผิดพลาดในการบันทึกภาพ");
            }
        }
    }

    return {
        renderRasiChart,
        renderNavamshaChart,
        renderDrekkanaChart,
        renderThaksaTable,
        renderTrivaiTable,
        saveChartImage
    };
})();

if (typeof window !== "undefined") {
    window.ThaiHoroProUI = ThaiHoroProUI;
}
