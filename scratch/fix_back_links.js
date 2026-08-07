const fs = require('fs');
const path = require('path');

function fixBackLinks(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of files) {
        const fullPath = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            fixBackLinks(fullPath);
        } else if (ent.isFile() && ent.name.endsWith('.html')) {
            if (ent.name === 'index.html') continue; // Handled separately
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            // Replace any links pointing to index.html (which inside admin folder would be admin/index.html)
            // or index.html#adminDashboard or index.html#adminQuickToolsSection
            // with ../index.html#adminDashboard
            
            const backLinkRegex = /href=["']index\.html(?:#\w+)?["']/g;
            if (backLinkRegex.test(content)) {
                content = content.replace(backLinkRegex, 'href="../index.html#adminDashboard"');
                updated = true;
            }
            
            // Also replace window.location.href='index.html' in onclicks
            const onclickRegex = /window\.location\.href\s*=\s*['"]index\.html['"]/g;
            if (onclickRegex.test(content)) {
                content = content.replace(onclickRegex, "window.location.href='../index.html#adminDashboard'");
                updated = true;
            }
            
            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed back links in:', fullPath);
            }
        }
    }
}

fixBackLinks('admin');
