const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');

// Normalize line endings
let normCode = code.replace(/\r\n/g, '\n');

// Targets to find and remove:
const target1 = `                // ================= คำนวณทักษาปกรณ์ =================
                const [y, mo, d] = dateStr.split("-").map(Number);
                const [hh, mm] = timeStr.split(":").map(Number);`;

const replacement1 = `                // ================= คำนวณทักษาปกรณ์ =================`;

let count = 0;
while (normCode.includes(target1)) {
    normCode = normCode.replace(target1, replacement1);
    count++;
}

if (count > 0) {
    fs.writeFileSync(file, normCode.split('\n').join('\r\n'), 'utf8');
    console.log(`Successfully removed ${count} duplicate [y, mo, d] and [hh, mm] declarations!`);
} else {
    console.error("Duplicate declarations not found using target pattern!");
}
