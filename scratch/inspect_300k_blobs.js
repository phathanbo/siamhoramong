const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = ['412454fbe3a096836903c6557aba6ebda76dc8fe', '3e856156498c8ec9cb21d6778ca7a99af74d42db', '97a0a7a37979b4ca89eed9c2ebf55d7d5b794890'];

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        console.log(`Blob ${b}: length=${content.length}`);
        const lines = content.split('\n');
        for (let i = 0; i < Math.min(20, lines.length); i++) {
            console.log(`  Line ${i + 1}: ${lines[i]}`);
        }
        if (content.includes('สิงห์โต') || content.includes('喔曕赋') || content.includes('ตำราโหราศาสตร์')) {
            console.log('>>> FOUND MATCHING BOOK BLOB! <<<');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}
