const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

const newTheveechokFunc = `function renderTheveechokSystem(planets, lagnaIdx) {
            const grid = document.getElementById('theveechokGrid');
            if (!grid) return;
            grid.innerHTML = '';

            const theveechokData = [
                {
                    id: 'sun', symbol: '๑', name: 'อาทิตย์ (เทวีโชคราศีพิจิก)',
                    theveechokSign: 'พิจิก (เลข ๗)',
                    goodText: 'ให้คุณ: มียศศักดิ์ ทรัพย์สินเงินทอง มีผู้ใหญ่ที่เป็นสตรีคอยอุปถัมภ์ เมตตามหานิยม ประสบความสำเร็จงดงาม'
                },
                {
                    id: 'moon', symbol: '๒', name: 'จันทร์ (เทวีโชคราศีสิงห์)',
                    theveechokSign: 'สิงห์ (เลข ๔)',
                    goodText: 'ให้คุณ: รูปร่างงาม มีเสน่ห์สดชื่น ละมุนละไม สตรีและมิตรสหายเมตตาค้ำจุน โชคลาภเงินทองสมบูรณ์'
                },
                {
                    id: 'mars', symbol: '๓', name: 'อังคาร (เทวีโชคราศีกันย์)',
                    theveechokSign: 'กันย์ (เลข ๕)',
                    goodText: 'ให้คุณ: มีความขยันหมั่นเพียร สตรีสนับสนุนช่วยเหลือให้ตำแหน่งหน้าที่การงานเจริญเติบโตรวดเร็ว'
                },
                {
                    id: 'mer', symbol: '๔', name: 'พุธ (เทวีโชคราศีพฤษภ)',
                    theveechokSign: 'พฤษภ (เลข ๑)',
                    goodText: 'ให้คุณ: ปัญญาฉลาด วาทศิลป์ไพเราะ เจรจาค้าขายและประสานงานกับสตรีบรรลุผลสำเร็จ ได้โชคลาภเงินทอง'
                },
                {
                    id: 'jup', symbol: '๕', name: 'พฤหัสบดี (เทวีโชคราศีมีน)',
                    theveechokSign: 'มีน (เลข ๑๑)',
                    goodText: 'ให้คุณ: มีศีลธรรมความรู้สูง ผู้ใหญ่สตรีเมตตาโปรดปราน มีโชคโภคทรัพย์สม่ำเสมอ'
                },
                {
                    id: 'ven', symbol: '๖', name: 'ศุกร์ (เทวีโชคราศีเมษ)',
                    theveechokSign: 'เมษ (เลข ๐)',
                    goodText: 'ให้คุณ: มีความสุขความเจริญ สมบูรณ์ด้วยทรัพย์เสน่หา สตรีนำความโชคดีและศิลปะความงามมาให้'
                },
                {
                    id: 'sat', symbol: '๗', name: 'เสาร์ (เทวีโชคราศีธนู)',
                    theveechokSign: 'ธนู (เลข ๘)',
                    goodText: 'ให้คุณ: มีความหนักแน่น อดทน สร้างฐานะได้มั่นคง มิตรสหายและสตรีช่วยเหลือหนุนหลัง'
                },
                {
                    id: 'rahu', symbol: '๘', name: 'ราหู (เทวีโชคราศีกุมภ์)',
                    theveechokSign: 'กุมภ์ (เลข ๑๐)',
                    goodText: 'ให้คุณ: กล้าหาญเฉลียวฉลาดในกลอุบาย ได้ลาภยศความสำเร็จและโชคใหญ่จากสตรี'
                }
            ];

            const matchedPlanets = [];

            theveechokData.forEach(tv => {
                const lon = planets[tv.id];
                const signIdx = degToSign(lon);
                const signName = lon !== undefined ? RASI[signIdx] : '-';
                const currentDegInSign = degInSign(lon);
                const dignity = evaluateDignity(tv.id, signIdx, currentDegInSign);
                const isTheveechok = (dignity === 'เทวีโชค');
                if (!isTheveechok) return;

                const pInfo = PLANETS.find(x => x.id === tv.id);
                matchedPlanets.push(\`<strong>พระ\${pInfo ? pInfo.name : ''}</strong> (\${dignity} สถิตราศี\${signName})\`);
                const color = pInfo ? pInfo.color : 'var(--accent-gold)';

                const card = document.createElement('div');
                card.className = 'bhava-card';
                card.style.borderColor = '#ff7675';

                card.innerHTML = \`
                    <div class="bhava-card-header">
                        <span class="bhava-name" style="color:\${color}; font-size:1.05rem;">
                            <span style="font-size:1.2rem; margin-right:4px;">\${tv.symbol}</span> พระ\${tv.name}
                        </span>
                        <span class="dignity-badge badge-เทวีโชค" style="background:rgba(255, 118, 117, 0.25); color:#ff7675; border:1px solid #ff7675;"><i class="fas fa-gem"></i> ได้ตำแหน่งเทวีโชค</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--accent-gold-light); margin-bottom: 4px;">
                        <strong>สถิตราศีเกณฑ์เทวีโชค:</strong> ราศี\${tv.theveechokSign}
                    </div>
                    <div style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 6px;">
                        <strong>สถิตในดวงกำเนิด:</strong> ราศี\${signName}
                    </div>
                    <p style="font-size: 0.83rem; color: #ff7675; line-height:1.5;">\${tv.goodText}</p>
                \`;
                grid.appendChild(card);
            });

            const summaryEl = document.getElementById('theveechokMatchedList');
            if (summaryEl) {
                summaryEl.innerHTML = matchedPlanets.length > 0 
                    ? matchedPlanets.join(' • ') 
                    : '<span style="color:var(--text-muted);"><i class="fas fa-info-circle"></i> ในดวงชะตานี้ ไม่มีดาวเคราะห์ดวงใดสถิตในราศีเกณฑ์เทวีโชค</span>';
            }
        }`;

const startIdx = html.indexOf('function renderTheveechokSystem(planets, lagnaIdx) {');
const endIdx = html.indexOf('function renderPraSystem(planets, lagnaIdx) {', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newTheveechokFunc + '\n\n        // ─── Detailed Pra System (Book pp. 66-67) ─────────────────────────\n        ' + html.substring(endIdx);
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log('Successfully fixed renderTheveechokSystem!');
} else {
    console.error('Indices not found!', startIdx, endIdx);
}
