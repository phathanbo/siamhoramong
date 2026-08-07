const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching', blobs.length, 'dangling blobs...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        if ((content.includes('สิงห์โต') || content.includes('สุริยาอารักษ์') || content.includes('ตำราโหราศาสตร์ไทย')) && !content.includes('喔')) {
            console.log('FOUND CLEAN UNCORRUPTED ORIGINAL BLOB!', b, 'Length:', content.length);
            const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
            fs.writeFileSync(target, content, 'utf8');
            console.log('RESTORED PERFECT ORIGINAL FILE FROM GIT OBJECT!');
            process.exit(0);
        }
    } catch (e) { }
}
console.log('No clean blob found in lost-found.');
