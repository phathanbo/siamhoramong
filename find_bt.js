const fs = require('fs');
let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

// A simple parser to find the stray backtick
let inString = false;
let stringChar = '';
let isEscape = false;
let inCommentLine = false;
let inCommentBlock = false;
let openBtPos = -1;

for (let i = 0; i < js.length; i++) {
    if (inCommentLine) {
        if (js[i] === '\n') inCommentLine = false;
        continue;
    }
    if (inCommentBlock) {
        if (js[i] === '*' && js[i+1] === '/') {
            inCommentBlock = false;
            i++;
        }
        continue;
    }
    
    if (inString) {
        if (isEscape) {
            isEscape = false;
        } else if (js[i] === '\\') {
            isEscape = true;
        } else if (js[i] === stringChar) {
            inString = false;
        }
        continue;
    }

    if (js[i] === '/' && js[i+1] === '/') {
        inCommentLine = true;
        i++;
    } else if (js[i] === '/' && js[i+1] === '*') {
        inCommentBlock = true;
        i++;
    } else if (js[i] === "'" || js[i] === '"' || js[i] === '`') {
        inString = true;
        stringChar = js[i];
        if (js[i] === '`') openBtPos = i;
    }
}

if (inString && stringChar === '`') {
    console.log('Unclosed backtick found at index:', openBtPos);
    console.log('Context:', js.substring(openBtPos - 50, openBtPos + 50));
} else {
    console.log('No unclosed backtick found (or parsing failed).');
}
