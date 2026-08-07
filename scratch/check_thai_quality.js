const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
const text = fs.readFileSync(targetFile, 'utf8');

const chineseCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
const thaiCount = (text.match(/[\u0e00-\u0e7f]/g) || []).length;
const qMarkCount = (text.match(/\?/g) || []).length;

console.log('--- THAI QUALITY REPORT ---');
console.log('Total characters:', text.length);
console.log('Thai characters:', thaiCount);
console.log('Chinese characters:', chineseCount);
console.log('Question marks (?):', qMarkCount);

// Inspect where question marks occur if any
const lines = text.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('?') && l.match(/[\u0e00-\u0e7f]/)) {
        if (idx < 500) {
            console.log(`Line ${idx + 1}: ${l.trim()}`);
        }
    }
});
