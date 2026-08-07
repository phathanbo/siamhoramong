const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all objects in git (blobs)
const objects = execSync('git rev-list --objects --all', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.trim().length > 0)
    .map(l => l.split(' ')[0]);

console.log('Searching all', objects.length, 'git objects for the 348KB Thai Astrology Book HTML file...');

for (let obj of objects) {
    try {
        const size = parseInt(execSync(`git cat-file -s ${obj}`, { encoding: 'utf8' }).trim());
        if (size > 250000 && size < 400000) {
            console.log('Checking git object:', obj, 'size:', size);
            const content = execSync(`git cat-file -p ${obj}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
            if (content.includes('สิงห์โต') || content.includes('喔曕赋') || content.includes('ถอดรหัสตำราโหราศาสตร์')) {
                console.log('>>> FOUND MATCHING ASTROLOGY BOOK BLOB!', obj, 'Length:', content.length);
                const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
                fs.writeFileSync(target, content, 'utf8');
                console.log('RESTORED ORIGINAL THAI ASTROLOGY BOOK HTML TO FILE!');
                process.exit(0);
            }
        }
    } catch (e) { }
}
console.log('Done searching git objects.');
