const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching', blobs.length, 'blobs for the Mojibake file containing astronomy-engine or 喔曕...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        if (content.includes('astronomy-engine') && content.includes('喔')) {
            console.log(`FOUND MOJIBAKE SINGHTO BLOB: ${b}, length=${content.length}`);
            fs.writeFileSync(path.join(__dirname, 'mojibake_backup.html'), content, 'utf8');
            process.exit(0);
        }
    } catch (e) { }
}
console.log('Search done.');
