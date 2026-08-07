const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
const text = fs.readFileSync(targetFile, 'utf8');

const lines = text.split('\n');
console.log('--- ALL LINES WITH ? AND THAI ---');
lines.forEach((l, idx) => {
    if (l.includes('?') && l.match(/[\u0e00-\u0e7f]/)) {
        console.log(`Line ${idx + 1}: ${l.trim()}`);
    }
});
