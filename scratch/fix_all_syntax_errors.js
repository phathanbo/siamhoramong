const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Fix dow === 0 ? 1 : dow + 1
html = html.replace(/dow === 0\s+1\s*:\s*dow \+ 1/g, 'dow === 0 ? 1 : dow + 1');

// Find all ternary patterns missing ?
// e.g., expr1  expr2 : expr3
html = html.replace(/([a-zA-Z0-9_\$\[\]\.\(\)]+)\s+===\s+([a-zA-Z0-9_\$]+)\s+([a-zA-Z0-9_\$'"]+)\s*:\s*/g, '$1 === $2 ? $3 : ');
html = html.replace(/([a-zA-Z0-9_\$\[\]\.\(\)]+)\s+!==\s+([a-zA-Z0-9_\$]+)\s+([a-zA-Z0-9_\$'"]+)\s*:\s*/g, '$1 !== $2 ? $3 : ');

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Applied regex fixes for ternaries.');
