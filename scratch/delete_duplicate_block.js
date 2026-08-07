const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');

// Normalize line endings
let normCode = code.replace(/\r\n/g, '\n');

// We will find the first Taksa calculation block and remove it:
const duplicateBlock = `                // ================= คำนวณทักษาปกรณ์ =================
                
                const localDate = new Date(y, mo - 1, d, hh, mm);
                if (hh < 6) localDate.setDate(localDate.getDate() - 1); // ก่อน 06.00 น. นับเป็นวันก่อนหน้า
                const dayOfWeek = localDate.getDay();
                
                let birthKey = "";
                if (dayOfWeek === 0) birthKey = "sun";
                if (dayOfWeek === 1) birthKey = "moon";
                if (dayOfWeek === 2) birthKey = "mars";
                if (dayOfWeek === 3) {
                    if (hh >= 18 || hh < 6) birthKey = "rahu"; // พุธกลางคืน
                    else birthKey = "mercury"; // พุธกลางวัน
                }
                if (dayOfWeek === 4) birthKey = "jupiter";
                if (dayOfWeek === 5) birthKey = "venus";
                if (dayOfWeek === 6) birthKey = "saturn";

                const taksaOrder = ["sun", "moon", "mars", "mercury", "saturn", "jupiter", "rahu", "venus"];
                const startIdx = taksaOrder.indexOf(birthKey);
                const sriKey = taksaOrder[(startIdx + 3) % 8];
                const kalineeKey = taksaOrder[(startIdx + 7) % 8];`;

const normDuplicate = duplicateBlock.replace(/\r\n/g, '\n');

if (normCode.includes(normDuplicate)) {
    // Replace only the FIRST occurrence of the duplicate block
    const index = normCode.indexOf(normDuplicate);
    const newCode = normCode.substring(0, index) + normCode.substring(index + normDuplicate.length);
    fs.writeFileSync(file, newCode.split('\n').join('\r\n'), 'utf8');
    console.log("Successfully removed the first duplicate Taksa block!");
} else {
    console.error("Duplicate Taksa block pattern not found!");
}
