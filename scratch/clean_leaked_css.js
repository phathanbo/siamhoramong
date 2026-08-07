const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');
let norm = code.replace(/\r\n/g, '\n');

// New style block ends at line 431 (index in norm)
// Old leaked CSS starts at line 432 (right after </style>)
// We need to remove everything from line 432 to line 1075 (just before <!-- ฐานข้อมูลคำทำนาย -->)

const lines = norm.split('\n');

// Find the </style> at line 431 (0-indexed: 430)
let styleCloseIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '</style>' && i > 400 && i < 450) {
        styleCloseIdx = i;
        break;
    }
}

// Find "<!-- ฐานข้อมูลคำทำนาย -->" 
let dbCommentIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('ฐานข้อมูลคำทำนาย')) {
        dbCommentIdx = i;
        break;
    }
}

console.log(`</style> at line ${styleCloseIdx + 1}, DB comment at line ${dbCommentIdx + 1}`);

if (styleCloseIdx !== -1 && dbCommentIdx !== -1 && dbCommentIdx > styleCloseIdx + 1) {
    // Remove all lines between </style> and the DB comment
    const newLines = [
        ...lines.slice(0, styleCloseIdx + 1),
        ...lines.slice(dbCommentIdx)
    ];
    fs.writeFileSync(file, newLines.join('\r\n'), 'utf8');
    console.log(`Removed ${dbCommentIdx - styleCloseIdx - 1} lines of leaked CSS!`);
} else {
    console.error('Could not find correct positions!');
}
