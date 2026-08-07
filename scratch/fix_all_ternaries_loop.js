const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'thai-astrology-book-system.html');

function runFixLoop() {
    for (let iteration = 0; iteration < 100; iteration++) {
        let html = fs.readFileSync(targetFile, 'utf8');

        // Extract script blocks
        const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
        let match;
        let blockCount = 0;
        let hasError = false;

        while ((match = scriptRegex.exec(html)) !== null) {
            blockCount++;
            const code = match[1];
            try {
                new vm.Script(code);
            } catch (err) {
                hasError = true;
                console.log(`[Iter ${iteration + 1}] Found error in block ${blockCount}: ${err.message}`);

                const lines = code.split('\n');
                let fixedThisIter = false;

                // Loop through lines looking for ternary missing ?
                for (let i = 0; i < lines.length; i++) {
                    let l = lines[i];

                    // Check if line or preceding line has missing ? before :
                    if (l.includes(':') && !l.includes('?') && !l.includes('case ') && !l.includes('default:') && !l.includes('http') && !l.includes('//')) {
                        // Check if previous line has the condition without ?
                        if (i > 0 && lines[i - 1].trim().length > 0 && !lines[i - 1].includes('?') && !lines[i - 1].endsWith('{') && !lines[i - 1].endsWith(';')) {
                            let prev = lines[i - 1];
                            prev = prev.trimEnd() + ' ?';
                            console.log(`Fixing prev line ${i}:\nBEFORE: ${lines[i - 1]}\nAFTER:  ${prev}`);
                            lines[i - 1] = prev;
                            fixedThisIter = true;
                            break;
                        }

                        // Check inline patterns
                        let newL = l.replace(/(>\s*0)\s+([a-zA-Z0-9_\$])/g, '$1 ? $2');
                        newL = newL.replace(/(!==\s*null)\s+([a-zA-Z0-9_\$])/g, '$1 ? $2');
                        newL = newL.replace(/(!==\s*undefined)\s+([a-zA-Z0-9_\$])/g, '$1 ? $2');
                        newL = newL.replace(/(===\s*true)\s+([a-zA-Z0-9_\$])/g, '$1 ? $2');
                        newL = newL.replace(/(===\s*false)\s+([a-zA-Z0-9_\$])/g, '$1 ? $2');
                        newL = newL.replace(/([a-zA-Z0-9_\$\.\(\)]+)\s+('[^']+'|"[^"]+"|[a-zA-Z0-9_\$\.\(\)]+)\s*:\s*('[^']+'|"[^"]+"|[a-zA-Z0-9_\$\.\(\)]+)/g, '$1 ? $2 : $3');

                        if (newL !== l) {
                            console.log(`Fixing line ${i + 1}:\nBEFORE: ${lines[i]}\nAFTER:  ${newL}`);
                            lines[i] = newL;
                            fixedThisIter = true;
                            break;
                        }
                    }
                }

                if (fixedThisIter) {
                    const newCode = lines.join('\n');
                    html = html.replace(match[1], newCode);
                    fs.writeFileSync(targetFile, html, 'utf8');
                    break;
                } else {
                    console.error('Could not auto-fix error line. Stack:', err.stack);
                    return;
                }
            }
        }

        if (!hasError) {
            console.log('🎉 ALL SCRIPT BLOCKS PASSED SYNTAX CHECK!');
            return;
        }
    }
}

runFixLoop();
