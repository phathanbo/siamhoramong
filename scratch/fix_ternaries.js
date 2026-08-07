const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Fix specific known broken ternary expressions
html = html.replace("this.style.display = isActive  'block' : 'none';", "this.style.display = isActive ? 'block' : 'none';");
html = html.replace("opt.textContent = name + (m.birthdate  ' — ' + m.birthdate : '');", "opt.textContent = name + (m.birthdate ? ' — ' + m.birthdate : '');");

// Let's also check for other instances of missing ? before : in JS string/expr
html = html.replace(/\b([a-zA-Z0-9_\$]+)\s+('[^']+'|"[^"]+"|[a-zA-Z0-9_\$]+)\s*:\s*('[^']+'|"[^"]+"|[a-zA-Z0-9_\$]+)/g, (match, p1, p2, p3) => {
    // If it looks like condition val1 : val2
    if (match.includes('display =') || match.includes('m.birthdate')) {
        return `${p1} ? ${p2} : ${p3}`;
    }
    return match;
});

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Fixed ternary operators.');
