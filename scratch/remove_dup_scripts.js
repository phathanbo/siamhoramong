const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');
let norm = code.replace(/\r\n/g, '\n');

// Remove the first set of duplicate script tags (in head area, lines ~432-434)
// Keep only the ones in body (lines ~552-554)
const dupBlock = `    <!-- ฐานข้อมูลคำทำนาย -->
    <script src="thai-astrology-data.js"></script>
    <script src="ayanamsa-data.js"></script>
</head>`;

const replacement = `</head>`;

if (norm.includes(dupBlock)) {
    norm = norm.replace(dupBlock, replacement);
    fs.writeFileSync(file, norm.split('\n').join('\r\n'), 'utf8');
    console.log('Removed duplicate script tags from head!');
} else {
    console.error('Pattern not found!');
}
