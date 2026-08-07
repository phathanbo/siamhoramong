const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Replace broken chulajakra line 2372 area
const badString = `            });รงข้ามธนู)',
                    goodText: 'ให้คุณ: มีความกล้า?ลาภะ? ขยัน?ั่นเพียร ตัดสินใจรอบค? ฟันฝ่า?ปสรรคได้?่างราบรื่นไม่โลดโผ?'
                },`;

const fixedString = `                {
                    id: 'mars', symbol: '๓', name: 'อังคาร (จุลจักรราศีมิถุน)',
                    chulajakraSign: 'มิถุน (เลข ๒, ตรงข้ามธนู)',
                    goodText: 'ให้คุณ: มีความกล้าหาญ ขยันหมั่นเพียร ตัดสินใจรอบคอบ ฟันฝ่าอุปสรรคได้อย่างราบรื่นไม่โลดโผน'
                },`;

if (html.includes(badString)) {
    html = html.replace(badString, fixedString);
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log('Successfully replaced broken Chulajakra snippet!');
} else {
    console.log('badString not found exactly, searching line by line...');
    const lines = html.split('\n');
    const idx = lines.findIndex(l => l.includes('});รงข้ามธนู)\','));
    if (idx !== -1) {
        console.log('Found broken line at index:', idx + 1);
        lines[idx] = `                {
                    id: 'mars', symbol: '๓', name: 'อังคาร (จุลจักรราศีมิถุน)',
                    chulajakraSign: 'มิถุน (เลข ๒, ตรงข้ามธนู)',
                    goodText: 'ให้คุณ: มีความกล้าหาญ ขยันหมั่นเพียร ตัดสินใจรอบคอบ ฟันฝ่าอุปสรรคได้อย่างราบรื่นไม่โลดโผน'
                },`;
        fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
        console.log('Replaced line via array index!');
    }
}
