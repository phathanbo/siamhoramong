const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Fix Chulajakra System declaration & Moolakaset summary block
const badChunk = `                grid.appendChild(card);
                {
                    id: 'mars', symbol: '๓', name: 'อังคาร (จุลจักรราศีมิถุน)',
                    chulajakraSign: 'มิถุน (เลข ๒, ตรงข้ามธนู)',
                    goodText: 'ให้คุณ: มีความกล้าหาญ ขยันหมั่นเพียร ตัดสินใจรอบคอบ ฟันฝ่าอุปสรรคได้อย่างราบรื่นไม่โลดโผน'
                },`;

const fixedChunk = `                grid.appendChild(card);
            });

            const summaryEl = document.getElementById('moolakasetMatchedList');
            if (summaryEl) {
                summaryEl.innerHTML = matchedPlanets.length > 0 
                    ? matchedPlanets.join(' • ') 
                    : '<span style="color:var(--text-muted);"><i class="fas fa-info-circle"></i> ในดวงชะตานี้ ไม่มีดาวเคราะห์ดวงใดสถิตในพิกัดองศามูลเกษตร</span>';
            }
        }

        // ─── Detailed Chulajakra System (Book pp. 80-81) ───────────────────
        function renderChulajakraSystem(planets, lagnaIdx) {
            const grid = document.getElementById('chulajakraGrid');
            if (!grid) return;
            grid.innerHTML = '';

            const chulajakraData = [
                {
                    id: 'sun', symbol: '๑', name: 'อาทิตย์ (จุลจักรราศีเมษ)',
                    chulajakraSign: 'เมษ (เลข ๐, ตรงข้ามตุลย์)',
                    goodText: 'ให้คุณ: มียศศักดิ์ บารมี ปัญญาฉลาด และประสบความสำเร็จอย่างราบรื่น'
                },
                {
                    id: 'moon', symbol: '๒', name: 'จันทร์ (จุลจักรราศีพฤษภ)',
                    chulajakraSign: 'พฤษภ (เลข ๑, ตรงข้ามพิจิก)',
                    goodText: 'ให้คุณ: มีรูปเสน่ห์ ละมุนละไม สตรีเมตตาช่วยเหลือค้ำจุน มีลาภผลเงินทองราบรื่น'
                },
                {
                    id: 'mars', symbol: '๓', name: 'อังคาร (จุลจักรราศีมิถุน)',
                    chulajakraSign: 'มิถุน (เลข ๒, ตรงข้ามธนู)',
                    goodText: 'ให้คุณ: มีความกล้าหาญ ขยันหมั่นเพียร ตัดสินใจรอบคอบ ฟันฝ่าอุปสรรคได้อย่างราบรื่นไม่โลดโผน'
                },`;

if (html.includes(badChunk)) {
    html = html.replace(badChunk, fixedChunk);
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log('Replaced badChunk in Chulajakra!');
} else {
    console.log('badChunk not matching directly, checking...');
}
