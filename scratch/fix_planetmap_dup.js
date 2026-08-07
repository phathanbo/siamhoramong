const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');
let normCode = code.replace(/\r\n/g, '\n');

// ===== Remove the SECOND occurrence of planetMap + signToRulerKey block =====
// This is the orphaned duplicate that sits at ~line 1795 (after dignities section).
// The first one at ~line 1715 is correct and should stay.

const dupPlanetMapBlock = `                
                const planetMap = {
                    "sun": "sun", "moon": "moon", "mars": "mars", "mercury": "mercury",
                    "jupiter": "jupiter", "venus": "venus", "saturn": "saturn", "rahu": "rahu"
                };
                
                const signToRulerKey = { 0: 'mars', 1: 'venus', 2: 'mercury', 3: 'moon', 4: 'sun', 5: 'mercury', 6: 'venus', 7: 'mars', 8: 'jupiter', 9: 'saturn', 10: 'rahu', 11: 'jupiter' };
                
                // 2. เรื่องราวชีวิต (12 ภพ)`;

const replacePlanetMapBlock = `                
                // 2. เรื่องราวชีวิต (12 ภพ)`;

if (normCode.includes(dupPlanetMapBlock)) {
    // Remove only the SECOND occurrence (first find after the first planetMap declaration)
    const firstIdx = normCode.indexOf('const planetMap = {');
    const secondIdx = normCode.indexOf('const planetMap = {', firstIdx + 1);
    if (secondIdx !== -1) {
        // Find the start of the block to remove (walk back to find the blank line)
        const blockStart = normCode.lastIndexOf('\n                \n', secondIdx);
        // Find the end: after signToRulerKey line
        const signToRulerLine = normCode.indexOf('\n', normCode.indexOf('const signToRulerKey', secondIdx)) + 1;
        // Remove from blockStart to signToRulerLine
        normCode = normCode.substring(0, blockStart) + '\n' + normCode.substring(signToRulerLine);
        fs.writeFileSync(file, normCode.split('\n').join('\r\n'), 'utf8');
        console.log('Successfully removed duplicate planetMap + signToRulerKey block!');
    } else {
        console.log('No second occurrence of planetMap found — already clean!');
    }
} else {
    // Fallback: simple string replacement
    const idx1 = normCode.indexOf('const planetMap = {');
    const idx2 = normCode.indexOf('const planetMap = {', idx1 + 1);
    if (idx2 !== -1) {
        const endIdx = normCode.indexOf('\n', normCode.indexOf('};\n', idx2) + 3);
        // Also remove the signToRulerKey that follows
        const sigIdx = normCode.indexOf('const signToRulerKey = ', endIdx);
        const sigEnd = normCode.indexOf('\n', sigIdx) + 1;
        normCode = normCode.substring(0, idx2 - 16) + normCode.substring(sigEnd);
        fs.writeFileSync(file, normCode.split('\n').join('\r\n'), 'utf8');
        console.log('Removed second planetMap block via fallback!');
    } else {
        console.log('No duplicates found!');
    }
}
