const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Total dangling blobs:', blobs.length);
for (let b of blobs) {
    try {
        const size = parseInt(execSync(`git cat-file -s ${b}`, { encoding: 'utf8' }).trim());
        if (size > 100000) {
            console.log('LARGE BLOB:', b, 'Size:', size);
            const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
            if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
                console.log('RESTORING LARGE HTML BLOB:', b);
                const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
                fs.writeFileSync(target, content, 'utf8');
            }
        }
    } catch (e) { }
}
