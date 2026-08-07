const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/images/promchart');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
console.log("Directory created!");
