const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching', blobs.length, 'dangling blobs for HTML file...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        if (content.includes('<!DOCTYPE html>') && content.includes('สิงห์โต')) {
            console.log('FOUND EXACT MATCH HTML BLOB!', b, 'Length:', content.length);
            const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
            fs.writeFileSync(target, content, 'utf8');
            console.log('RESTORED PERFECT ORIGINAL HTML FILE FROM GIT OBJECT!');
            process.exit(0);
        }
    } catch (e) { }
}
console.log('No HTML blob match found.');
