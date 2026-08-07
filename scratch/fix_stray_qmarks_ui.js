const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');
let html = fs.readFileSync(targetFile, 'utf8');

// Fix stray ? before string literals in UI objects/arrays
html = html.replace(/\?\s+('ปฏิทินวันมงคลเฉพาะบุคคล)/g, '$1');
html = html.replace(/\?\s+('ปฏิทินตรวจเช็ก)/g, '$1');
html = html.replace(/\?\s+('พบเลขบาปเคราะห์')/g, '$1');
html = html.replace(/\?\s+('มีเกณฑ์อุบัติเหตุ')/g, '$1');
html = html.replace(/\?\s+('มีเกณฑ์ราชาโชค')/g, '$1');
html = html.replace(/\?\s+('ดาวส่งเสริมกัน')/g, '$1');
html = html.replace(/\?\s+('มีแรงปะทะ')/g, '$1');
html = html.replace(/\?\s+('มั่นคง หนุนนำ')/g, '$1');
html = html.replace(/\?\s+('มีพลังขับเคลื่อนสูง สำเร็จไว')/g, '$1');

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Final UI polish completed!');
