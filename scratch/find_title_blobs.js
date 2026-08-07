const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching all', blobs.length, 'blobs for <title>...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
        if (titleMatch) {
            console.log(`Blob ${b}: size=${content.length}, title="${titleMatch[1].trim()}"`);
        }
    } catch (e) { }
}
