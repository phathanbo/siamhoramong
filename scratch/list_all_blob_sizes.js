const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Listing sizes of all', blobs.length, 'blobs...');

for (let b of blobs) {
    try {
        const size = parseInt(execSync(`git cat-file -s ${b}`, { encoding: 'utf8' }).trim());
        if (size > 10000) {
            console.log(`Blob ${b}: size=${size}`);
        }
    } catch (e) { }
}
