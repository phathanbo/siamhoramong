"use strict";

const LOTTO_THEORY = {
    "อาทิตย์": { power: 6, friend: [1, 4], powerNum: 9 },
    "จันทร์": { power: 15, friend: [2, 5], powerNum: 2 },
    "อังคาร": { power: 8, friend: [3, 7], powerNum: 8 },
    "พุธ": { power: 17, friend: [4, 6], powerNum: 7 },
    "พฤหัสบดี": { power: 19, friend: [5, 9], powerNum: 1 },
    "ศุกร์": { power: 21, friend: [6, 3], powerNum: 3 },
    "เสาร์": { power: 10, friend: [7, 2], powerNum: 7 }
};

const birthBase = {
    "อาทิตย์": 1, "จันทร์": 2, "อังคาร": 3, "พุธ": 4, "พฤหัสบดี": 5, "ศุกร์": 6, "เสาร์": 7
};

// 1. ฟังก์ชันหาปฏิทินหวยออก (รวมเป็นอันเดียว)
function getNextLottoDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    let target;
    if (day < 16) {
        target = new Date(year, month, 16);
    } else {
        target = new Date(year, month + 1, 1);
    }

    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    return {
        date: target.getDate(),
        month: target.getMonth() + 1,
        year: target.getFullYear(),
        fullDate: `${target.getDate()} ${thaiMonths[target.getMonth()]} ${target.getFullYear() + 543}`,
        dayName: thaiDays[target.getDay()]
    };
}

function calculateMainNumbers(birthDay) {
    const next = getNextLottoDate();
    const base = birthBase[birthDay] || 1;
    
    // แปลงปี ค.ศ. เป็น พ.ศ. แล้วเอาเลขท้ายมาเป็นตัวคูณกำลังงวด
    const thaiYearDigit = (next.year + 543) % 10; 

    // สูตรใหม่: (พื้นฐานวันเกิด + วันที่ออก + เดือนที่ออก + เลขท้ายปี พ.ศ.)
    let main = (base + next.date + next.month + thaiYearDigit) % 10;
    
    // เลขรอง: ใช้เลขเด่นบวกเดือนและเลขท้ายปี
    let secondary = (main + next.month + thaiYearDigit) % 10;
    
    // ถ้าเลขรองดันไปซ้ำกับเลขเด่น ให้ขยับหนี (+1)
    if (secondary === main) {
        secondary = (secondary + 1) % 10;
    }

    // เลขกัน: คำนวณเบื้องต้น
    let forbidden = (main + secondary + 3) % 10;

    // --- 🛡️ ระบบป้องกันเลขซ้ำกันเอง (Conflict Resolution) ---
    // วนลูปเช็กจนกว่าเลขกันจะไม่ซ้ำกับเด่นและรอง
    while (forbidden === main || forbidden === secondary) {
        forbidden = (forbidden + 1) % 10;
    }

    return {
        main,
        secondary,
        forbidden
    };
}

// (ฟังก์ชัน generateTwoDigits และ generateThreeDigits คงเดิมตามที่ประธานเขียน)
// สุ่มเลข 2 ตัว (ห้ามซ้ำ, ห้ามมีเลขกัน)
function generateTwoDigits(main, secondary, forbidden, count = 6) {
    const nums = [];
    while (nums.length < count) {
        const d1 = Math.random() < 0.5 ? main : secondary;
        let d2 = Math.floor(Math.random() * 10);

        // 🛡️ ถ้าหลักที่ 2 ไปตรงกับเลขกัน ให้สุ่มใหม่จนกว่าจะไม่ตรง
        while (d2 === forbidden) {
            d2 = Math.floor(Math.random() * 10);
        }

        const num = `${d1}${d2}`;
        const rev = `${d2}${d1}`;

        if (!nums.includes(num) && !nums.includes(rev)) {
            nums.push(num);
        }
    }
    return nums;
}

// สุ่มเลข 3 ตัว (ห้ามซ้ำ, ห้ามมีเลขกันในทุกหลัก)
function generateThreeDigits(main, secondary, forbidden, count = 6) {
    const nums = [];
    while (nums.length < count) {
        const d1 = Math.random() < 0.5 ? main : secondary;
        let d2 = Math.floor(Math.random() * 10);
        let d3 = Math.floor(Math.random() * 10);

        // 🛡️ เช็กหลักที่ 2 และ 3 ถ้าตรงกับเลขกัน ให้สุ่มใหม่ทันที
        while (d2 === forbidden) d2 = Math.floor(Math.random() * 10);
        while (d3 === forbidden) d3 = Math.floor(Math.random() * 10);

        const num = `${d1}${d2}${d3}`;

        if (!nums.includes(num)) {
            nums.push(num);
        }
    }
    return nums;
}

// 2. ปรับปรุงการสร้างเลขและใส่ ID ให้ถูกต้อง
function generateLuckyNumbers() {
    const birthDayEl = document.getElementById("birthDay");
    if (!birthDayEl || !birthDayEl.value) {
        return;
    }
    
    const birthDay = birthDayEl.value;
    const next = getNextLottoDate();
    const calc = calculateMainNumbers(birthDay);
    const twoDigits = generateTwoDigits(calc.main, calc.secondary, calc.forbidden, 6);
    const threeDigits = generateThreeDigits(calc.main, calc.secondary, calc.forbidden, 6);

    // เพิ่ม id="lottoCaptureArea" เพื่อให้โหลดภาพได้
    const html = `
    <div id="lottoCaptureArea" class="card shadow mt-4 border-0 p-3 bg-white">
        <div class="card-body text-center">
            <h4 class="text-gold">🔮 วิเคราะห์งวด ${next.fullDate}</h4>
            <span style="color: #d4af37;">งวดวัน${next.dayName}</span>
            <hr>
            <div class="row">
                <div class="col-4 text-gold"><h5>⭐ เด่น</h5><h2 class="text-success">${calc.main}</h2></div>
                <div class="col-4 text-gold"><h5>✨ รอง</h5><h2>${calc.secondary}</h2></div>
                <div class="col-4 text-danger"><h5>⚠ กัน</h5><h2>${calc.forbidden}</h2></div>
            </div>
            <hr>
            <h5 class="mt-4 text-gold">🎯 เลข 2 ตัว</h5>
            <h3 class="text-primary">${twoDigits.join(" &nbsp; ")}</h3>
            <h5 class="mt-4 text-gold">🎯 เลข 3 ตัว</h5>
            <h3 class="text-success">${threeDigits.join(" &nbsp; ")}</h3>
        </div>
    </div><br>
            <button class="btn btn-gold" onclick="downloadLottoResult()">🔮 บันทึกเป็นรูปภาพ</button>

    `;
    document.getElementById("lottoResult").innerHTML = html;
}

function showlotto(){
    const contioner = document.getElementById("lottoResultpage")

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4">
                <h2 class="text-gold mb-1">🎰 หอคำนวณเลขมงคล</h2>
                <span class="text-white-50 mb-0 small">สุ่มเลขนำโชคอ้างอิงตามกำลังวันและฐานดวงเกิด</span>
            </div>
            <div class="card-body bg-light text-center">
                <div class="py-5" id="beforeGenerate">
                    <i class="fas fa-dice-d20 fa-5x text-gold mb-4 animate__animated animate__infinite animate__pulse"></i>
                    <h3 style="font-style: normal ; font-weight: normal; color: #000;">พร้อมเสี่ยงทายเลขมงคลหรือยัง?</h3>
                    <span class="text-muted">ระบบจะนำวันเกิดของคุณมาคำนวณหาตัวเลขที่สมพงษ์ที่สุดในงวดนี้</span>
                    <div class="mt-4 mb-3">
                        <select id="birthDay" class="form-control text-center" onclick="generateLuckyNumbers()" value="เลือกวันเกิด">
                            <option>อาทิตย์</option>
                            <option>จันทร์</option>
                            <option>อังคาร</option>
                            <option>พุธ</option>
                            <option>พฤหัสบดี</option>
                            <option>ศุกร์</option>
                            <option>เสาร์</option>
                        </select>
                    </div>
                </div>
                <div id="lottoResult" class="mt-2"></div>
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
    contioner.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    showlotto();
});

window.saveAscendantImage = function() {
    const captureArea = document.getElementById('ascResult');
    if (!captureArea || captureArea.style.display === 'none') {
        alert("คำนวณก่อนเซฟครับประธาน!");
        return;
    }

    // สั่งเซฟด้วยการ "จำลอง" ขนาดใหม่
    html2canvas(captureArea, {
        backgroundColor: '#0a0a0a',
        scale: 2, // เพิ่มความชัด x2
        logging: false,
        onclone: (clonedDoc) => {
            // --- 💡 ความลับอยู่ตรงนี้ครับประธาน ---
            const clonedElement = clonedDoc.getElementById('ascResult');
            
            // บังคับขนาดในรูปเซฟให้เป็น 1080px (ขนาดมาตรฐาน Facebook/Instagram)
            clonedElement.style.width = '1080px';
            clonedElement.style.maxWidth = 'none'; 
            clonedElement.style.padding = '40px'; // เพิ่มขอบให้รูปดูแพง
            
            // ปรับตัวหนังสือในรูปให้ใหญ่ขึ้นนิดนึงตอนเซฟ จะได้อ่านในเฟสง่าย
            clonedElement.style.fontSize = '20px'; 
            
            // แอบเติมลายน้ำหรือเครดิตแอปในรูปเซฟ (โผล่เฉพาะในรูป)
            const footer = clonedDoc.createElement('div');
            footer.innerHTML = '<center><p style="color:#d4af37; margin-top:20px; font-size:18px;">✨ สยามโหรามงคล - พยากรณ์ดวงชะตาแม่นยำ ✨</p></center>';
            clonedElement.appendChild(footer);
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ดวงชะตา_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        console.log("📸 เซฟรูปขนาด Facebook Standard เรียบร้อย!");
    });
};

// 3. ฟังก์ชันบันทึกภาพ
function downloadLottoResult() {
    const area = document.getElementById('lottoCaptureArea');
    if (!area) return alert("คำนวณเลขก่อนครับประธาน");

    html2canvas(area, {
        backgroundColor: null, // ปล่อยเป็นใสเพื่อให้ Background ที่เราตั้งใน clone ทำงาน
        scale: 2,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('lottoCaptureArea');
            
            // --- 🎨 แต่งองค์ทรงเครื่องให้ภาพเซฟ ---
            el.style.width = '600px';
            el.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'; // พื้นหลังกาแล็กซี่ทางช้างเผือก
            el.style.border = '5px double #d4af37'; // ขอบทองสองชั้นแบบยันต์
            el.style.borderRadius = '20px';
            el.style.padding = '40px';
            el.style.color = '#fff';
            el.style.boxShadow = 'inset 0 0 50px rgba(212, 175, 55, 0.3)'; // แสงสีทองเรืองๆ ด้านใน

            // ปรับแต่งหัวข้อ
            const title = el.querySelector('h4');
            if(title) {
                title.style.fontSize = '32px';
                title.style.textShadow = '2px 2px 4px #000';
                title.style.color = '#ffd700';
                title.innerHTML = `✨ ${title.innerText} ✨`;
            }

            // ปรับแต่งตัวเลขเด่น (ทำให้ดูเหมือนลูกบอลทองคำ)
            const mainNum = el.querySelector('.text-danger');
            if(mainNum) {
                mainNum.style.fontSize = '80px';
                mainNum.style.color = '#fff';
                mainNum.style.textShadow = '0 0 20px #ff0000, 0 0 30px #ff0000';
                mainNum.style.margin = '20px 0';
            }

            // เพิ่มเครดิตแบบหรูๆ
            const footer = clonedDoc.createElement('div');
            footer.style.marginTop = '30px';
            footer.style.borderTop = '1px solid #d4af37';
            footer.style.paddingTop = '15px';
            footer.style.fontSize = '14px';
            footer.style.color = '#d4af37';
            footer.style.textAlign = 'center';
            footer.style.letterSpacing = '2px';
            footer.innerHTML = '⚜️ สยามโหรามงคล ⚜️';
            el.appendChild(footer);
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `เลขมงคล_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}