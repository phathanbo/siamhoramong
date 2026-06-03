/**
 * 🔢 numerology.js - เลขศาสตร์ไทยแท้
 *
 * อ้างอิง:
 * - ดาว 9 ดวง (Navagraha) จาก thai-astrology-data.js
 * - ธาตุ 5 ประการ (Wu Xing) จาก thai-astrology-data.js
 * - หลักการ: ผลรวมตัวเลข (1-9) → ดาว, ผลรวม (1-5) → ธาตุ
 */

"use strict";

function Numbertable() {
    const container = document.getElementById("numberlogypage");
    if (!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
        <div class="card-header bg-dark text-white text-center py-4 border-bottom-gold">
            <h2 class="text-gold mb-1">🔮 เลขศาสตร์ไทยแท้ - ดาว 9 ดวง</h2>
            <p class="text-white-50 mb-0 small">✨ อิงจากลัคนาและดาว 9 ดวง - โหราศาสตร์ไทยแท้</p>
        </div>
        <div class="card-body bg-light">
            <div class="btn-group btn-group-toggle w-100 mb-4 shadow-sm" data-toggle="buttons">
                <label class="btn btn-outline-gold active flex-fill">
                    <input type="radio" name="numType" value="phone" checked onchange="updateNumUI('phone')"> 📱 เบอร์มือถือ
                </label>
                <label class="btn btn-outline-gold flex-fill">
                    <input type="radio" name="numType" value="car" onchange="updateNumUI('car')"> 🚗 ทะเบียนรถ
                </label>
                <label class="btn btn-outline-gold flex-fill">
                    <input type="radio" name="numType" value="home" onchange="updateNumUI('home')"> 🏠 เลขที่บ้าน
                </label>
            </div>
            <div class="form-group text-center">
                <label for="phoneNumber" class="font-weight-bold text-dark" id="inputLabel">กรอกหมายเลข:</label>
                <input type="text" class="form-control form-control-lg border-gold text-center shadow-inner"
                    id="phoneNumber" placeholder="08XXXXXXXX" oninput="validateInput(this)"
                    style="font-size: 1.5rem; letter-spacing: 2px; border-radius: 15px;">
                <small class="text-muted mt-2 d-block">*วิเคราะห์ตามลัคนา: ผลรวมตัวเลข → ดาว 9 ดวง</small>
            </div>
            <button class="btn btn-gold btn-block btn-lg shadow mt-4 py-3 font-weight-bold" id="btnAnalyze"
                onclick="analyzeNumber()">
                ✨ วิเคราะห์เบอร์มือถือ
            </button>
            <div id="numerologyResult" class="mt-4"></div>
            <div id="numResult" class="mt-4 p-4 rounded-lg" style="display:none; background: #222; border: 1px solid #444;"></div>

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
    `;
    container.innerHTML = html;
}

/**
 * 🎯 วิเคราะห์ตัวเลข อิงดาว 9 ดวง + ธาตุ 5
 */
function analyzeNumber() {
    const inputField = document.getElementById('phoneNumber');
    const resultDiv = document.getElementById('numResult');

    if (!inputField || !resultDiv || !inputField.value) {
        alert('⚠️ กรุณากรอกหมายเลข');
        return;
    }

    resultDiv.style.display = 'block';

    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    // ล้างตัวเลขเท่านั้น
    let cleanInput = inputField.value.replace(/[^0-9ก-ฮ]/g, '');
    let numSum = 0;

    // คำนวณผลรวมตัวเลข
    for (let char of cleanInput) {
        if (/[0-9]/.test(char)) {
            numSum += parseInt(char);
        } else if (/[ก-ฮ]/.test(char)) {
            // แท็กไทย: ก-ง=1, จ-ช=2, ญ-ณ=3, ด-น=4, บ-ม=5, ย-ว=6, ศ-ฮ=7
            const thaiValue = getThaiBycodeValue(char);
            numSum += thaiValue;
        }
    }

    // ลด sum ให้เป็น 1-9 (เพื่อเชื่อมกับดาว 9)
    let planetNum = (numSum % 9) || 9;
    let elementNum = (numSum % 5) || 5;

    // ดึงข้อมูลจาก thai-astrology-data.js
    const planet = ThaiAstrologyData?.PLANETS_DATA?.[planetNum];
    const elementData = ThaiAstrologyData?.ELEMENTS_DATA?.[elementNum - 1];

    if (!planet) {
        alert('❌ ไม่สามารถโหลดข้อมูลดาว 9 ดวง');
        return;
    }

    // สร้าง Result HTML
    resultDiv.innerHTML = `
        <div class="card border-gold bg-dark text-white p-4 shadow-sm">
            <div class="text-center mb-4">
                <h3 class="text-gold">ผลวิเคราะห์เลขศาสตร์ไทยแท้</h3>
                <div style="font-size: 1.5rem; color: #d4af37;">${inputField.value}</div>
                <small class="text-muted">ผลรวม: ${numSum} → ดาว ${planetNum} / ธาตุ</small>
            </div>

            <!-- ดาวที่ได้ -->
            <div class="card bg-dark border-gold mb-3">
                <div class="card-header bg-gold text-dark">
                    <strong>⭐ ดาวเกิด (จากหลักลัคนา)</strong>
                </div>
                <div class="card-body text-center">
                    <div style="font-size: 3rem;">${planet.symbol}</div>
                    <h4 class="text-gold mt-2">${planet.name}</h4>
                    <p class="mb-1"><strong>ธาตุ:</strong> ${planet.element}</p>
                    <p class="mb-1"><strong>ทิศมงคล:</strong> ${planet.direction}</p>
                    <p class="mb-0"><strong>สี:</strong> ${planet.color}</p>
                </div>
            </div>

            <!-- ลักษณะบุคลิก (อิงดาว) -->
            <div class="card bg-dark border-gold mb-3">
                <div class="card-header bg-gold text-dark">
                    <strong>👤 ลักษณะบุคลิก</strong>
                </div>
                <div class="card-body small">
                    <p class="mb-2"><strong>ลักษณะ:</strong> ${planet.character}</p>
                    <p class="mb-2"><strong>💪 จุดแข็ง:</strong> ${planet.strength}</p>
                    <p class="mb-0"><strong>⚠️ จุดท้าทาย:</strong> ${planet.weakness}</p>
                </div>
            </div>

            <!-- ธาตุสนับสนุน -->
            ${elementData ? `
            <div class="card bg-dark border-gold">
                <div class="card-header bg-gold text-dark">
                    <strong>🌀 ธาตุสนับสนุน</strong>
                </div>
                <div class="card-body text-center small">
                    <p class="mb-1"><strong>${elementData.name}</strong> ${elementData.symbol}</p>
                    <p class="mb-1"><strong>สี:</strong> ${elementData.color}</p>
                    <p class="mb-0"><strong>อิทธิพล:</strong> ${elementData.influence}</p>
                </div>
            </div>
            ` : ''}

            <div class="alert alert-info small mt-4 mb-0">
                <strong>📚 แหล่งอ้างอิง:</strong><br>
                ✓ ดาว 9 ดวง (Navagraha) - โหราศาสตร์ไทยแท้<br>
                ✓ ธาตุ 5 ประการ (Wu Xing) - หลักลัคนา<br>
                ✓ ข้อมูลจาก thai-astrology-data.js
            </div>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 🔤 แปลงตัวอักษรไทยเป็นตัวเลข
 */
function getThaiBycodeValue(char) {
    const thaiMap = {
        "ก":1,"ข":1,"ค":1,"ฆ":1,"ง":1,
        "จ":2,"ฉ":2,"ช":2,"ซ":2,"ฌ":2,
        "ญ":3,"ฎ":3,"ฏ":3,"ฐ":3,"ฑ":3,"ฒ":3,"ณ":3,
        "ด":4,"ต":4,"ถ":4,"ท":4,"ธ":4,"น":4,
        "บ":5,"ป":5,"ผ":5,"ฝ":5,"พ":5,"ฟ":5,"ภ":5,"ม":5,
        "ย":6,"ร":6,"ล":6,"ว":6,
        "ศ":7,"ษ":7,"ส":7,"ห":7,"ฬ":7,"ฮ":7
    };
    return thaiMap[char] || 1;
}

/**
 * 📱 อัปเดต UI ตามประเภทที่เลือก
 */
function updateNumUI(type) {
    const label = document.getElementById('inputLabel');
    const input = document.getElementById('phoneNumber');
    const btn = document.getElementById('btnAnalyze');

    input.value = "";
    document.getElementById('numerologyResult').innerHTML = "";

    if (type === 'phone') {
        label.innerText = "กรอกหมายเลขโทรศัพท์:";
        input.placeholder = "0XXXXXXXXX";
        btn.innerHTML = "✨ วิเคราะห์เบอร์มือถือ";
    } else if (type === 'car') {
        label.innerText = "กรอกทะเบียนรถ:";
        input.placeholder = "1กข1234";
        btn.innerHTML = "✨ วิเคราะห์ทะเบียนรถ";
    } else if (type === 'home') {
        label.innerText = "กรอกเลขที่บ้าน:";
        input.placeholder = "123/45";
        btn.innerHTML = "✨ วิเคราะห์เลขที่บ้าน";
    }
}

/**
 * ✅ ล้างข้อมูลขณะพิมพ์
 */
function validateInput(input) {
    let selectionStart = input.selectionStart;
    let oldLength = input.value.length;

    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    if (type === 'phone') {
        let value = input.value.replace(/\D/g, '').slice(0, 10);
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = value.substring(0, 3);
            if (value.length > 3) formattedValue += '-' + value.substring(3, 6);
            if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
        }
        input.value = formattedValue;
    } else if (type === 'home') {
        input.value = input.value.replace(/[^0-9ก-ฮ\/]/g, '');
    } else {
        input.value = input.value.replace(/[^0-9ก-ฮ]/g, '');
    }

    let newLength = input.value.length;
    selectionStart += (newLength - oldLength);
    input.setSelectionRange(selectionStart, selectionStart);
}

document.addEventListener("DOMContentLoaded", () => {
    Numbertable();
});
