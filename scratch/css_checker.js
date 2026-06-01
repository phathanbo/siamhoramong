const fs = require('fs');
const path = require('path');

const cssPath = 'd:\\สยามโหรามงคล\\style.css';
if (!fs.existsSync(cssPath)) {
  console.error('style.css not found');
  process.exit(1);
}

const css = fs.readFileSync(cssPath, 'utf8');
let openBraces = 0;
let lineNum = 1;
let lastOpenLine = 0;

for (let i = 0; i < css.length; i++) {
  const char = css[i];
  if (char === '\n') {
    lineNum++;
  } else if (char === '{') {
    openBraces++;
    lastOpenLine = lineNum;
  } else if (char === '}') {
    openBraces--;
    if (openBraces < 0) {
      console.error(`[ERROR] Unmatched closing brace '}' at line ${lineNum}`);
      openBraces = 0; // reset
    }
  }
}

if (openBraces > 0) {
  console.error(`[ERROR] Unmatched opening brace '{' at line ${lastOpenLine}`);
} else {
  console.log('style.css: All braces are balanced! CSS file is syntactically valid.');
}
