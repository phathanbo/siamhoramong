const celticPositions = [
    { num: 1, title: "1. สถานการณ์ปัจจุบัน", desc: "สิ่งที่กำลังเกิดขึ้นในขณะนี้", key: "present" },
    { num: 2, title: "2. อุปสรรค/สิ่งที่เข้ามากระทบ", desc: "ความท้าทายที่ต้องเผชิญ", key: "present" },
    { num: 3, title: "3. รากฐานของปัญหา", desc: "เหตุการณ์ในอดีตที่ส่งผลถึงปัจจุบัน", key: "past" },
    { num: 4, title: "4. อดีตอันใกล้", desc: "สิ่งที่เพิ่งผ่านพ้นไปไม่นาน", key: "past" },
    { num: 5, title: "5. ความคิดและความมุ่งหวัง", desc: "เป้าหมายหรือสิ่งที่อยู่ในใจลึกๆ", key: "present" },
    { num: 6, title: "6. อนาคตอันใกล้", desc: "สิ่งที่กำลังจะเกิดขึ้นในไม่ช้า", key: "future" },
    { num: 7, title: "7. ตัวตนของคุณ", desc: "ทัศนคติและสภาวะของคุณในตอนนี้", key: "present" },
    { num: 8, title: "8. สภาพแวดล้อม", desc: "คนรอบข้างและปัจจัยภายนอก", key: "present" },
    { num: 9, title: "9. ความหวังและความกลัว", desc: "สิ่งที่คุณกังวลหรือปรารถนาให้เกิดขึ้น", key: "future" },
    { num: 10, title: "10. บทสรุป", desc: "ผลลัพธ์ที่จะเกิดขึ้นในท้ายที่สุด", key: "future" }
];

let currentSpread = [];

function drawCelticCross() {
    if (typeof tarotCards === 'undefined' || tarotCards.length < 10) {
        Swal.fire('ข้อผิดพลาด', 'ไม่พบฐานข้อมูลไพ่ยิปซี หรือข้อมูลไม่ครบถ้วน', 'error');
        return;
    }

    document.getElementById('tarotPreDraw').style.display = 'none';
    document.getElementById('tarotResult').style.display = 'block';

    // Shuffle and pick 10 cards
    let shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    currentSpread = shuffled.slice(0, 10);

    let layoutHtml = '<div class="row row-cols-3 row-cols-md-5 justify-content-center">';

    currentSpread.forEach((card, index) => {
        let pos = celticPositions[index];
        // The cards are initially shown face down.
        // We use a generic card back image, e.g., assets/tarot_bg.png or similar. 
        // Or simply a styled div.
        layoutHtml += `
            <div class="col mb-4 text-center">
                <div class="tarot-card-interactive" onclick="flipCard(${index})" id="tarotCardWrap_${index}" style="cursor: pointer; transition: transform 0.3s;">
                    <h6 class="text-gold" style="font-size: 0.8rem; margin-bottom: 8px;">${pos.title}</h6>
                    <img src="assets/tarot_bg.png" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/d/d4/RWS_Tarot_Card_Back.jpg'" id="tarotImg_${index}" alt="Tarot Back" class="img-fluid rounded shadow-lg border border-warning" style="max-height: 140px; border-width: 2px !important; transition: all 0.3s ease;">
                </div>
            </div>
        `;
    });

    layoutHtml += '</div>';

    document.querySelector('.celtic-cross-layout').innerHTML = layoutHtml;
    document.getElementById('tarotReadingContent').innerHTML = '<p class="text-center text-muted">คลิกที่ไพ่แต่ละใบเพื่อดูคำทำนายในตำแหน่งนั้นๆ</p>';
}

function flipCard(index) {
    let card = currentSpread[index];
    let pos = celticPositions[index];
    let meaningText = card[pos.key];

    // Flip animation & change image
    let imgEl = document.getElementById(`tarotImg_${index}`);
    let wrapEl = document.getElementById(`tarotCardWrap_${index}`);
    
    wrapEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        imgEl.onerror = function() {
            this.src = `https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}`;
        };
        imgEl.src = card.img;
        wrapEl.style.transform = 'scale(1)';
    }, 150);

    // Show meaning
    let readingHtml = `
        <div class="reading-result-card" style="animation: fadeIn 0.5s;">
            <div class="text-center mb-4">
                <h4 class="text-warning border-bottom border-warning pb-2 d-inline-block">${pos.title}</h4>
                <p class="text-muted small">${pos.desc}</p>
            </div>
            
            <div class="row align-items-center mb-4 p-3 rounded shadow-sm" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(212, 175, 55, 0.15);">
                <div class="col-md-3 text-center mb-3 mb-md-0">
                    <img src="${card.img}" onerror="this.src='https://placehold.co/300x500/1a1a1a/d4af37?text=${card.name.replace(/ /g, '+')}'" class="img-fluid rounded shadow-lg border border-warning" style="max-height: 180px;">
                </div>
                <div class="col-md-9">
                    <h3 class="text-gold mb-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${card.name}</h3>
                    <div class="mb-3">
                        <h6 class="text-light opacity-75 border-bottom border-secondary pb-1 d-inline-block">ความหมายทั่วไป</h6>
                        <p class="text-white-50 small lh-lg mt-2" style="text-align: justify; font-size: 0.95rem;">${card.meaning}</p>
                    </div>
                </div>
            </div>

            <div class="prediction-box p-4 rounded shadow-lg" style="background: linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0.6) 100%); border-left: 4px solid #d4af37;">
                <h5 class="text-warning mb-3">✨ คำทำนายในตำแหน่งนี้</h5>
                <p class="text-light lh-lg m-0" style="font-size: 1.15rem; text-align: justify; letter-spacing: 0.3px;">${meaningText}</p>
            </div>
        </div>
    `;
    
    document.getElementById('tarotReadingContent').innerHTML = readingHtml;
    
    // Highlight selected card visually
    for (let i = 0; i < 10; i++) {
        let el = document.getElementById(`tarotImg_${i}`);
        if(i === index) {
            el.classList.add('border-danger');
            el.classList.remove('border-warning');
        } else {
            el.classList.remove('border-danger');
            el.classList.add('border-warning');
        }
    }
}

function resetTarotReading() {
    document.querySelector('.celtic-cross-layout').innerHTML = '';
    document.getElementById('tarotReadingContent').innerHTML = '';
    document.getElementById('tarotPreDraw').style.display = 'block';
    document.getElementById('tarotResult').style.display = 'none';
}
