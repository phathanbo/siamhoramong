const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');
html = html.replace(/<script src="adminTarotFortune.js"><\/script>\r?\n?/g, '');
fs.writeFileSync('admin.html', html, 'utf-8');
console.log("Removed adminTarotFortune.js from admin.html");
