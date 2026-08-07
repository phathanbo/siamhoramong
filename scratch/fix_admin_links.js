const fs = require('fs');
const path = require('path');

function fixDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of files) {
        const fullPath = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            fixDir(fullPath);
        } else if (ent.isFile() && (ent.name.endsWith('.html') || ent.name.endsWith('.js'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            if (content.includes('admin.html')) {
                content = content.replace(/href=["']admin\.html["']/g, 'href="index.html"');
                content = content.replace(/window\.location\.href\s*=\s*['"]admin\.html['"]/g, "window.location.href='index.html'");
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated links in:', fullPath);
            }
        }
    }
}

fixDir('admin');
