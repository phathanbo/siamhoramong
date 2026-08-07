const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching', blobs.length, 'dangling blobs for Thai Astrology Book System (สิงห์โต / ลัคนา)...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        if (content.includes('สิงห์โต') && content.includes('ลัคนา') && content.includes('มหาอุจ')) {
            console.log(`FOUND MATCH! Blob: ${b}, Size: ${content.length}`);
            console.log('Sample:', content.substring(0, 300));
            const hasChinese = /[\u4e00-\u9fff]/.test(content);
            console.log('Has Chinese:', hasChinese);
            if (!hasChinese) {
                console.log('>>> THIS BLOB IS CLEAN! RESTORING... <<<');
                const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
                fs.writeFileSync(target, content, 'utf8');
                process.exit(0);
            }
        }
    } catch (e) { }
}
console.log('Done searching.');
