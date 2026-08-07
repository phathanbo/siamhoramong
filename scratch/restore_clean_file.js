const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blob = 'a8f527908cdb61716396ad5a863a013672e32133';
let content = execSync(`git cat-file -p ${blob}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });

const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
fs.writeFileSync(target, content, 'utf8');
console.log('Restored blob', blob, 'fresh to', target);
