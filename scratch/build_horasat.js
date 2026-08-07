const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'Ayanamsa.html');
const destPath = path.join(__dirname, '..', 'Horasat.html');

let content = fs.readFileSync(srcPath, 'utf8');

// Replace titles and headers
content = content.replace('<title>ดวงชะตากำเนิด - วงจักรราศีไทย</title>', '<title>ตำราโหราศาสตร์ - วงจักรราศีไทย (ผูกดวงชะตาพยากรณ์)</title>');
content = content.replace('<h1>ดวงชะตากำเนิด</h1>', '<h1>📘 ตำราโหราศาสตร์</h1>');
content = content.replace('<div class="subtitle">วงจักรราศีไทย · คำนวณจากตำแหน่งดาวจริง (สมผุส)</div>', '<div class="subtitle">สิงห์โต สุริยาอารักษ์ · ผูกดวงชะตาพยากรณ์ (สมผุสจริง)</div>');

// Ensure script references are clean and correct
content = content.replace('<script src="thai-astrology-book-system.html"></script>', '');

fs.writeFileSync(destPath, content, 'utf8');
console.log("Successfully generated Horasat.html from Ayanamsa.html!");
