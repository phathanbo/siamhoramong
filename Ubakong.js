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

function renderUbakongDay() {
    const selectedDay = parseInt(document.getElementById('ubakongDay').value);
    const container = document.getElementById('ubakong-list');
    const currentSlot = getCurrentSlotIndex();
    const isToday = (selectedDay === new Date().getDay());

    container.innerHTML = "";

    timeSlots.forEach((slot, index) => {
        const resultKey = yarmTable[selectedDay][index];
        const data = predictions[resultKey];
        const isActive = (isToday && index === currentSlot);

        const row = document.createElement('div');
        row.className = `yarm-row ${data.class} ${isActive ? 'active' : ''}`;
        row.innerHTML = `
            <div class="current-arrow">▶</div>
            <div class="yarm-time"><strong>${slot.label}</strong><br>${slot.start}-${slot.end}</div>
            <div class="yarm-symbol">${data.icon}</div>
            <div class="yarm-desc">${data.text}</div>
        `;
        container.appendChild(row);
    });
}

// ตั้งค่าเริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().getDay();
    document.getElementById('ubakongDay').value = today;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = "วันนี้: " + new Date().toLocaleDateString('th-TH', options);
    if (typeof getThaiLunar === 'function') {
        const lunar = getThaiLunar(new Date());
        if (lunar && lunar.fullString) {
            dateStr += ` (${lunar.fullString})`;
        }
    }
    document.getElementById('current-date-display').innerText = dateStr;
    
    renderUbakongDay();
    // อัปเดตลูกศรทุก 1 นาที
    setInterval(renderUbakongDay, 60000);
});