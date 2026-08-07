const fs = require('fs');
const crypto = require('crypto');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Matches both full URLs and the base prefix used in template strings
    // Wait, generate_tarot.js uses 'https://commons.wikimedia.org/wiki/Special:FilePath/'
    // and generate_tarot_detailed.js uses `https://commons.wikimedia.org/wiki/Special:FilePath/${suit.imgPrefix}${rank.num}.jpg`
    
    const regex = /https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/([A-Za-z0-9_.-]*)/g;
    let match;
    let count = 0;
    let newContent = content;

    while ((match = regex.exec(content)) !== null) {
        const fullUrl = match[0];
        let filename = match[1];
        
        if (!filename) {
            // It's just the prefix 'https://commons.wikimedia.org/wiki/Special:FilePath/'
            // We can't fix this using md5 statically if the filename is attached dynamically later!
            continue; 
        }

        // Check if filename contains variables like ${...}
        if (filename.includes('$')) {
            continue;
        }

        filename = decodeURIComponent(filename).replace(/ /g, '_');
        
        const hash = crypto.createHash('md5').update(filename).digest('hex');
        const a = hash.substring(0, 1);
        const b = hash.substring(0, 2);
        
        const newUrl = `https://upload.wikimedia.org/wikipedia/commons/${a}/${b}/${filename}`;
        newContent = newContent.split(fullUrl).join(newUrl);
        count++;
    }

    if (count > 0) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Replaced ${count} URLs in ${filePath}`);
    } else {
        console.log(`No static URLs replaced in ${filePath}. Manual fix needed for dynamic URLs.`);
    }
}

fixFile('d:\\สยามโหรามงคล\\data_major.js');
fixFile('d:\\สยามโหรามงคล\\generate_tarot.js');
fixFile('d:\\สยามโหรามงคล\\generate_tarot_detailed.js');
