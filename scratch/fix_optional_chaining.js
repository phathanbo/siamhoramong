const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Fix optional chaining where .[ became .[
html = html.replace(/\.\[/g, '?.[');
html = html.replace(/\.\(/g, '?.(');

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Fixed optional chaining syntax.');
