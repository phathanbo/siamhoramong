const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const gitObjDir = path.join(__dirname, '..', '.git', 'objects');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'info' && file !== 'pack') {
                results = results.concat(walk(filePath));
            }
        } else {
            results.push(filePath);
        }
    });
    return results;
}

console.log('Searching all raw git objects in .git/objects...');
const files = walk(gitObjDir);
console.log('Total loose objects:', files.length);

for (let file of files) {
    try {
        const buffer = fs.readFileSync(file);
        const decompressed = zlib.inflateSync(buffer).toString('utf8');
        if (decompressed.includes('astronomy-engine') || decompressed.includes('สิงห์โต') || decompressed.includes('喔曕')) {
            console.log('FOUND MATCH IN LOOSE OBJECT:', file, 'length:', decompressed.length);
            // Save decompressed content (strip git header like "blob 297037\0")
            const headerEnd = decompressed.indexOf('\0');
            const content = decompressed.substring(headerEnd + 1);
            const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
            fs.writeFileSync(target, content, 'utf8');
            console.log('RESTORED RAW LOOSE GIT OBJECT TO FILE!');
            process.exit(0);
        }
    } catch (e) { }
}
console.log('Loose objects search completed.');
