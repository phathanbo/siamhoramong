const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blobs = ['a8f527908cdb61716396ad5a863a013672e32133', '412454fbe3a096836903c6557aba6ebda76dc8fe', '3e856156498c8ec9cb21d6778ca7a99af74d42db', '97a0a7a37979b4ca89eed9c2ebf55d7d5b794890'];

for (let b of blobs) {
    try {
        const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
        const hasChinese = /[\u4e00-\u9fff]/.test(content);
        const qMarkCount = (content.match(/\?/g) || []).length;
        const thaiCount = (content.match(/[\u0e00-\u0e7f]/g) || []).length;
        console.log(`Blob ${b}: size=${content.length}, hasChinese=${hasChinese}, qMarkCount=${qMarkCount}, thaiCount=${thaiCount}`);
        if (content.includes('สิงห์โต') || content.includes('สุริยาอารักษ์') || content.includes('ตำราโหราศาสตร์')) {
            console.log(`Blob ${b} MATCHES BOOK SYSTEM! Sample title:`, content.substring(0, 300));
            if (!hasChinese && qMarkCount < 50) {
                console.log('>>> THIS BLOB IS THE CLEAN ORIGINAL FILE! RESTORING IT NOW <<<');
                const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
                fs.writeFileSync(target, content, 'utf8');
                process.exit(0);
            }
        }
    } catch (e) {
        console.error('Err:', e.message);
    }
}
