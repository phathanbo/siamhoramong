const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
const code = fs.readFileSync(file, 'utf8');

try {
    // Look for script blocks and eval them to check for Javascript syntax errors
    const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;
    while ((match = scriptRegex.exec(code)) !== null) {
        const js = match[1];
        if (js.trim() && !js.includes("Astronomy =")) { // skip large astronomy bundle to avoid slow evaluation
            new Function(js);
            count++;
        }
    }
    console.log(`✅ Checked ${count} javascript blocks: No syntax errors!`);
} catch (e) {
    console.error("❌ Syntax error in script block:", e.message);
    process.exit(1);
}
