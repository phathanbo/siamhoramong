const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');

// Normalize line endings
let normCode = code.replace(/\r\n/g, '\n');

// 1. Remove duplicate declaration at the first prediction block (previously around line 1638)
// We will look for:
// const dateStr = document.getElementById("inpDate").value;
// const timeStr = document.getElementById("inpTime").value;
// and replace them with just accessing the variables (or completely omit because they are already declared at the top of the function!)

// Let's inspect the surrounding text around line 1638:
// ================= คำนวณทักษาปกรณ์ =================
// const dateStr = document.getElementById("inpDate").value;
// const timeStr = document.getElementById("inpTime").value;

const target1 = `                // ================= คำนวณทักษาปกรณ์ =================
                const dateStr = document.getElementById("inpDate").value;
                const timeStr = document.getElementById("inpTime").value;`;

const replacement1 = `                // ================= คำนวณทักษาปกรณ์ =================`;

// Let's look for:
// // ================= คำนวณทักษาปกรณ์ =================
// const dateStr = document.getElementById("inpDate").value;
// const timeStr = document.getElementById("inpTime").value;
// further down (previously around line 1666):
const target2 = `                // ================= คำนวณทักษาปกรณ์ =================
                const dateStr = document.getElementById("inpDate").value;
                const timeStr = document.getElementById("inpTime").value;`;

const replacement2 = `                // ================= คำนวณทักษาปกรณ์ =================`;

// Let's replace both targets
let count = 0;
while (normCode.includes(target1)) {
    normCode = normCode.replace(target1, replacement1);
    count++;
}

if (count > 0) {
    fs.writeFileSync(file, normCode.split('\n').join('\r\n'), 'utf8');
    console.log(`Successfully removed ${count} duplicate dateStr/timeStr declarations!`);
} else {
    console.error("Duplicate declarations not found using target pattern!");
}
