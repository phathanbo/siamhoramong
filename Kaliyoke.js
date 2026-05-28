"use strict";

/**
 * Utility: ป้องกัน index หลุด
 */
const safeIndex = (arr, index) => arr[index] ?? "-";

/**
 * ฟังก์ชันคำนวณกาลโยค
 */
function calculateKaliyoke(yearBE) {
    if (!Number.isInteger(yearBE) || yearBE < 1182 || yearBE > 3000) {
        return `<div class="card" style="grid-column:1/-1;color:red;text-align:center;">
            ปี พ.ศ. ไม่ถูกต้อง (1182 - 3000)
        </div>`;
    }

    const cs = yearBE - 1181;

    const days = ["", "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

    const yarms = [
        "",
        "06.01 - 07.30","07.31 - 09.00","09.01 - 10.30","10.31 - 12.00",
        "12.01 - 13.30","13.31 - 15.00","15.01 - 16.30","16.31 - 18.00",
        "18.01 - 19.30","19.31 - 21.00","21.01 - 22.30","22.31 - 24.00",
        "00.01 - 01.30","01.31 - 03.00","03.01 - 04.30","04.31 - 06.00"
    ];

    const reuks = ["", "อัศวินี", "ภรณี", "กฤติกา", "โรหิณี", "มฤคศิร", "อารทรา", "ปุนีพสุ", "บุษย", "อาศเลษา", "มาฆ", "บุรพผลคุนี", "อุตรผลคุนี", "หัสต", "จิตรา", "สวาติ", "วิศาขา", "อนุราธา", "เชษฐา", "มูลา", "บุรพษาฒ", "อุตราษาฒ", "ศรวณะ", "ธนิษฐา", "ศตภิษัช", "บุรพภัทรบท", "อุตรภัทรบท", "เรวดี"];

    const rasris = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุล", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"];

    const dithis = ["", "ขึ้น 1 ค่ำ", "ขึ้น 2 ค่ำ", "ขึ้น 3 ค่ำ", "ขึ้น 4 ค่ำ", "ขึ้น 5 ค่ำ", "ขึ้น 6 ค่ำ", "ขึ้น 7 ค่ำ", "ขึ้น 8 ค่ำ", "ขึ้น 9 ค่ำ", "ขึ้น 10 ค่ำ", "ขึ้น 11 ค่ำ", "ขึ้น 12 ค่ำ", "ขึ้น 13 ค่ำ", "ขึ้น 14 ค่ำ", "ขึ้น 15 ค่ำ", "แรม 1 ค่ำ", "แรม 2 ค่ำ", "แรม 3 ค่ำ", "แรม 4 ค่ำ", "แรม 5 ค่ำ", "แรม 6 ค่ำ", "แรม 7 ค่ำ", "แรม 8 ค่ำ", "แรม 9 ค่ำ", "แรม 10 ค่ำ", "แรม 11 ค่ำ", "แรม 12 ค่ำ", "แรม 13 ค่ำ", "แรม 14 ค่ำ", "แรม 15 ค่ำ"];

    const getRem = (val, mod) => {
        const r = val % mod;
        return r === 0 ? mod : r;
    };

    const createCard = (base, type, title) => {
        const dIdx = getRem(base, 7);
        const yIdx = getRem(base, 16);
        const rsIdx = getRem(base, 12);
        const dtIdx = getRem(base, 30);
        const rkIdx = getRem(base, 27);

        let reukValue = safeIndex(reuks, rkIdx);
        let dithiValue = safeIndex(dithis, dtIdx);

         // ✅ อธิบดี (สูตรใหม่ที่คุณให้)
    if (type === "athibadi") {
        reukValue = safeIndex(reuks, rkIdx);
        dithiValue = safeIndex(dithis, dtIdx);
    }

        return `
        <div class="card ${type} shadow bg-white/10">
            <h3 style="color:gold; font-weight: bold;">${title}</h3>
            <p><span class="label">วัน:</span> <span style="color:black; font-weight: bold;">${days[dIdx]}</span></p>
            <p><span class="label">ยาม:</span> <span style="color:black; font-weight: bold;">${safeIndex(yarms, yIdx)}</span></p>
            <p><span class="label">ราศี:</span> <span style="color:black; font-weight: bold;">${safeIndex(rasris, rsIdx - 1)}</span></p>
            <p><span class="label">ดิถี:</span> <span style="color:black; font-weight: bold;">${dithiValue}</span></p>
            <p><span class="label">ฤกษ์:</span> <span style="color:black; font-weight: bold;">${reukValue}</span></p>
        </div>`;
    };

    // สูตรตามคัมภีร์
    const thongchaiBase = (cs * 10) + 3;
    const athibadiBase = getRem(cs, 498);
    const ubatBase = (cs * 10) + 2;
    const lokawinasBase = cs + 1120;

    return [
        createCard(thongchaiBase, 'thongchai', '🚩 ธงชัย'),
        createCard(athibadiBase, 'athibadi', '👑 อธิบดี'),
        createCard(ubatBase, 'ubat', '💀 อุบาทว์'),
        createCard(lokawinasBase, 'lokawinas', '🏚️ โลกาวินาศ')
    ].join('');
}

/**
 * debounce ลด render ถี่
 */
function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

function displayKaliyoke() {
    const inputEl = document.getElementById('yearkarayokInput');
    const resultArea = document.getElementById('kaliyoke-resultArea');

    if (!inputEl || !resultArea) return;

    const year = Number(inputEl.value.trim());

    if (!year) {
        resultArea.innerHTML = "";
        return;
    }

    resultArea.innerHTML = calculateKaliyoke(year);
}

const debouncedDisplay = debounce(displayKaliyoke, 150);

// INIT
document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('yearkarayokInput');

    if (!inputEl) return;

    displayKaliyoke();

    inputEl.addEventListener('input', debouncedDisplay);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') displayKaliyoke();
    });
});