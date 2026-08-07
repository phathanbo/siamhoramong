const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Inspecting blobs containing สิงห์โต...');

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        if (content.includes('สิงห์โต') || content.includes('สุริยาอารักษ์')) {
            const hasChinese = /[\u4e00-\u9fff]/.test(content);
            const hasLagna = content.includes('ลัคนา');
            const hasSattalek = content.includes('สัตตเลข') || content.includes('7 ฐาน');
            console.log(`Blob ${b}: size=${content.length}, hasChinese=${hasChinese}, hasLagna=${hasLagna}, hasSattalek=${hasSattalek}`);
        }
    } catch (e) { }
}
