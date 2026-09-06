const timeSlots = [
    { start: "06:00", end: "08:24", nightStart: "18:00", nightEnd: "20:24", label: "ยาม ๑" },
    { start: "08:25", end: "10:48", nightStart: "20:25", nightEnd: "22:48", label: "ยาม ๒" },
    { start: "10:49", end: "13:12", nightStart: "22:49", nightEnd: "01:12", label: "ยาม ๓" },
    { start: "13:13", end: "15:36", nightStart: "01:13", nightEnd: "03:36", label: "ยาม ๔" },
    { start: "15:37", end: "18:00", nightStart: "03:37", nightEnd: "06:00", label: "ยาม ๕" }
];

const yarmTable = [
    ["4", "X", "0", "1", "2"], // อาทิตย์
    ["2", "4", "X", "0", "1"], // จันทร์
    ["1", "2", "4", "X", "0"], // อังคาร
    ["0", "1", "2", "4", "X"], // พุธ
    ["X", "0", "1", "2", "4"], // พฤหัสบดี
    ["4", "X", "0", "1", "2"], // ศุกร์ (เหมือนอาทิตย์)
    ["2", "4", "X", "0", "1"]  // เสาร์ (เหมือนจันทร์)
];

const predictions = {
    "4": { icon: "●●<br>●●", text: "สี่ศูนย์: จะพูนผล มีลาภล้นคณนา เร่งยาตราจะมีชัย", class: "good" },
    "2": { icon: "● ●", text: "สองศูนย์: เร่งยาตราจะมีลาภสวัสดี", class: "good" },
    "0": { icon: "○", text: "ปลอดศูนย์: พูลสวัสดิ์ภัยพิบัติลาภบ่มี (เสมอตัว)", class: "neutral" },
    "1": { icon: "●", text: "หนึ่งศูนย์: อย่าพึงจร แม้ราญรอยจะอัปราชัย", class: "bad" },
    "X": { icon: "✖", text: "กากบาท: ตัวอัปรีย์ แม้จรลีจะอัปรา (ห้ามเดินทาง)", class: "bad" }
};

function getCurrentSlotIndex() {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < timeSlots.length; i++) {
        const [h1, m1] = timeSlots[i].start.split(':').map(Number);
        const [h2, m2] = timeSlots[i].end.split(':').map(Number);
        if (currentMin >= (h1 * 60 + m1) && currentMin <= (h2 * 60 + m2)) return i;

        const [nh1, nm1] = timeSlots[i].nightStart.split(':').map(Number);
        const [nh2, nm2] = timeSlots[i].nightEnd.split(':').map(Number);
        // เช็กเคสข้ามคืน (ยาม 3 และ ยาม 5)
        let nStart = nh1 * 60 + nm1;
        let nEnd = nh2 * 60 + nm2;
        if (nEnd < nStart) { // ถ้าเวลาสิ้นสุดน้อยกว่าเวลาเริ่ม (เช่น 22:49 - 01:12)
            if (currentMin >= nStart || currentMin <= nEnd) return i;
        } else {
            if (currentMin >= nStart && currentMin <= nEnd) return i;
        }
    }
    return -1;
}

const badgeColors = {
    "good": { bg: "rgba(34, 197, 94, 0.15)", border: "#22c55e", text: "#4ade80", label: "ยามมงคลดีเลิศ" },
    "neutral": { bg: "rgba(234, 179, 8, 0.15)", border: "#eab308", text: "#facc15", label: "เสมอตัว/ปลอดภัย" },
    "bad": { bg: "rgba(239, 68, 68, 0.15)", border: "#ef4444", text: "#f87171", label: "ยามห้ามเดินทาง" }
};

function renderUbakongDay() {
    const daySelect = document.getElementById('ubakongDay');
    if (!daySelect) return;
    const selectedDay = parseInt(daySelect.value);
    const container = document.getElementById('ubakong-list');
    if (!container) return;

    const currentSlot = getCurrentSlotIndex();
    const isToday = (selectedDay === new Date().getDay());

    container.innerHTML = "";

    const grid = document.createElement('div');
    grid.className = "row g-3";

    timeSlots.forEach((slot, index) => {
        const resultKey = yarmTable[selectedDay][index];
        const data = predictions[resultKey];
        const isActive = (isToday && index === currentSlot);
        const bInfo = badgeColors[data.class] || badgeColors.neutral;

        const col = document.createElement('div');
        col.className = "col-12";

        const activeBorder = isActive 
            ? `border: 2px solid #ffd700 !important; box-shadow: 0 0 20px rgba(255,215,0,0.45); background: linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(20,25,55,0.9) 100%);` 
            : `border: 1px solid rgba(255,255,255,0.08); background: linear-gradient(145deg, #181b38 0%, #101226 100%);`;

        col.innerHTML = `
            <div class="card border-0 rounded-4 overflow-hidden" style="${activeBorder} transition: all 0.3s ease;">
                <div class="card-body p-3 p-md-4">
                    <div class="row align-items-center g-3">
                        
                        <!-- Col 1: Label & Current Indicator -->
                        <div class="col-md-3 col-12 text-center text-md-start">
                            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                                ${isActive ? '<span class="badge py-1 px-2" style="background:#ffd700; color:#000; font-weight:bold; font-size:0.75rem;"><i class="fas fa-play me-1"></i> ยามปัจจุบัน</span>' : ''}
                                <span class="fw-bold" style="color:#e8c876; font-size:1.15rem;">${slot.label}</span>
                            </div>
                            <div class="small text-white-50"><i class="fas fa-sun me-1"></i> กลางวัน: <strong class="text-light">${slot.start} - ${slot.end} น.</strong></div>
                            <div class="small text-white-50"><i class="fas fa-moon me-1"></i> กลางคืน: <strong class="text-light">${slot.nightStart} - ${slot.nightEnd} น.</strong></div>
                        </div>

                        <!-- Col 2: Symbol -->
                        <div class="col-md-2 col-12 text-center">
                            <div class="d-inline-flex align-items-center justify-content-center" style="min-width:65px; height:65px; border-radius:16px; background:${bInfo.bg}; border:2px solid ${bInfo.border}; color:${bInfo.text}; font-size:1.45rem; font-weight:bold; line-height:1.1; padding: 4px 10px;">
                                ${data.icon}
                            </div>
                        </div>

                        <!-- Col 3: Prediction Text -->
                        <div class="col-md-7 col-12 text-center text-md-start">
                            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                                <span class="badge" style="background:${bInfo.bg}; color:${bInfo.text}; border:1px solid ${bInfo.border}; font-size:0.8rem;">
                                    ${bInfo.label}
                                </span>
                            </div>
                            <p class="mb-0 fw-semibold" style="color:#f8fafc; font-size:1.05rem; line-height:1.6;">
                                ${data.text}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });

    container.appendChild(grid);
}

// ตั้งค่าเริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().getDay();
    const ubakongDayEl = document.getElementById('ubakongDay');
    if (ubakongDayEl) {
        ubakongDayEl.value = today;
    }
    
    const dateDisplayEl = document.getElementById('current-date-display');
    if (dateDisplayEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dateStr = "วันนี้: " + new Date().toLocaleDateString('th-TH', options);
        if (typeof getThaiLunar === 'function') {
            const lunar = getThaiLunar(new Date());
            if (lunar && lunar.fullString) {
                dateStr += ` (${lunar.fullString})`;
            }
        }
        dateDisplayEl.innerText = dateStr;
    }
    
    if (typeof renderUbakongDay === 'function' && ubakongDayEl) {
        renderUbakongDay();
        // อัปเดตลูกศรทุก 1 นาที
        setInterval(renderUbakongDay, 60000);
    }
});