const fs = require('fs');
const crypto = require('crypto');

const tarotFile = 'd:\\สยามโหรามงคล\\tarot-data.js';
let content = fs.readFileSync(tarotFile, 'utf8');

const regex = /https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/([A-Za-z0-9_.-]+)/g;
let match;
let count = 0;
let newContent = content;

while ((match = regex.exec(content)) !== null) {
    const fullUrl = match[0];
    let filename = match[1];
    // Replace %20 with underscore if any, standard wiki format
    filename = decodeURIComponent(filename).replace(/ /g, '_');
    
    const hash = crypto.createHash('md5').update(filename).digest('hex');
    const a = hash.substring(0, 1);
    const b = hash.substring(0, 2);
    
    const newUrl = `https://upload.wikimedia.org/wikipedia/commons/${a}/${b}/${filename}`;
    newContent = newContent.split(fullUrl).join(newUrl);
    count++;
}

fs.writeFileSync(tarotFile, newContent, 'utf8');
console.log(`Replaced ${count} URLs with upload.wikimedia.org direct links.`);
