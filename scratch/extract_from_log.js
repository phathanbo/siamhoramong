const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\PHATHANBO\\.gemini\\antigravity\\brain\\8095f4d8-0202-450b-a536-979e505e93df\\.system_generated\\logs\\transcript_full.jsonl';
const content = fs.readFileSync(logFile, 'utf8');

console.log('Transcript length:', content.length);

// Look for occurrences of thai-astrology-book-system
let pos = 0;
let occurrences = [];
while ((pos = content.indexOf('thai-astrology-book-system.html', pos)) !== -1) {
    occurrences.push(pos);
    pos += 'thai-astrology-book-system.html'.length;
}

console.log('Occurrences found:', occurrences.length);

occurrences.forEach((p, i) => {
    console.log(`\n--- Occurrence ${i + 1} at pos ${p} ---`);
    console.log(content.substring(Math.max(0, p - 100), Math.min(content.length, p + 500)));
});
