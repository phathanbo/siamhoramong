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

    const typeConfig = {
        thongchai: {
            border: "#22c55e",
            badgeBg: "rgba(34, 197, 94, 0.2)",
            badgeColor: "#4ade80",
            titleColor: "#4ade80",
            glow: "rgba(34, 197, 94, 0.25)",
            badgeText: "เกณฑ์มงคลสูงสุด (ดีเลิศ)"
        },
        athibadi: {
            border: "#3b82f6",
            badgeBg: "rgba(59, 130, 246, 0.2)",
            badgeColor: "#60a5fa",
            titleColor: "#60a5fa",
            glow: "rgba(59, 130, 246, 0.25)",
            badgeText: "เกณฑ์บารมี อำนาจ สำเร็จ"
        },
        ubat: {
            border: "#f59e0b",
            badgeBg: "rgba(245, 158, 11, 0.2)",
            badgeColor: "#fbbf24",
            titleColor: "#fbbf24",
            glow: "rgba(245, 158, 11, 0.25)",
            badgeText: "เกณฑ์อุปสรรค ขัดข้อง (ควรเลี่ยง)"
        },
        lokawinas: {
            border: "#ef4444",
            badgeBg: "rgba(239, 68, 68, 0.2)",
            badgeColor: "#f87171",
            titleColor: "#f87171",
            glow: "rgba(239, 68, 68, 0.25)",
            badgeText: "เกณฑ์วิบัติ สูญเสีย (ห้ามเด็ดขาด)"
        }
    };

    const createCard = (base, type, title) => {
        const dIdx = getRem(base, 7);
        const yIdx = getRem(base, 16);
        const rsIdx = getRem(base, 12);
        const dtIdx = getRem(base, 30);
        const rkIdx = getRem(base, 27);

        let reukValue = safeIndex(reuks, rkIdx);
        let dithiValue = safeIndex(dithis, dtIdx);

        const cfg = typeConfig[type] || typeConfig.thongchai;

        return `
        <div class="col-md-6 col-12 mb-3">
            <div class="card h-100 border-0 rounded-4 shadow-lg overflow-hidden" style="background: linear-gradient(145deg, #181b38 0%, #101226 100%); border: 1.5px solid ${cfg.border} !important; box-shadow: 0 4px 20px ${cfg.glow};">
                <div class="card-header py-3 px-4 d-flex align-items-center justify-content-between" style="background: ${cfg.badgeBg}; border-bottom: 1px solid rgba(255,255,255,0.08);">
                    <h3 class="mb-0 fw-bold" style="color: ${cfg.titleColor}; font-family: 'Chonburi', serif; font-size: 1.35rem;">
                        ${title}
                    </h3>
                    <span class="badge py-1 px-3" style="background: ${cfg.badgeBg}; color: ${cfg.badgeColor}; border: 1px solid ${cfg.border}; font-size: 0.8rem;">
                        ${cfg.badgeText}
                    </span>
                </div>
                <div class="card-body p-3 p-md-4">
                    <div class="row g-2 text-light">
                        <div class="col-6">
                            <div class="p-2 rounded-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);">
                                <small class="text-white-50 d-block"><i class="fas fa-calendar-day me-1 text-gold"></i> วันประจำเกณฑ์:</small>
                                <strong class="fs-6" style="color: #ffd700;">วัน${days[dIdx]}</strong>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-2 rounded-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);">
                                <small class="text-white-50 d-block"><i class="fas fa-clock me-1 text-gold"></i> ยามประจำเกณฑ์:</small>
                                <strong class="fs-6 text-white">${safeIndex(yarms, yIdx)} น.</strong>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 rounded-3 text-center" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);">
                                <small class="text-white-50 d-block">ราศี</small>
                                <strong class="small text-white">ราศี${safeIndex(rasris, rsIdx - 1)}</strong>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 rounded-3 text-center" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);">
                                <small class="text-white-50 d-block">ดิถี</small>
                                <strong class="small text-white">${dithiValue}</strong>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="p-2 rounded-3 text-center" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05);">
                                <small class="text-white-50 d-block">ฤกษ์</small>
                                <strong class="small text-white">${reukValue}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    };

    // สูตรตามคัมภีร์
    const thongchaiBase = (cs * 10) + 3;
    const athibadiBase = getRem(cs, 498);
    const ubatBase = (cs * 10) + 2;
    const lokawinasBase = cs + 1120;

    return `
    <div class="row g-3">
        ${createCard(thongchaiBase, 'thongchai', '🚩 ธงชัย')}
        ${createCard(athibadiBase, 'athibadi', '👑 อธิบดี')}
        ${createCard(ubatBase, 'ubat', '💀 อุบาทว์')}
        ${createCard(lokawinasBase, 'lokawinas', '🏚️ โลกาวินาศ')}
    </div>
    `;
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