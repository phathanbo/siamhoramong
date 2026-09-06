const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'archive') continue;
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        getAllFiles(filePath, exts, fileList);
      } else if (exts.some(ext => file.endsWith(ext))) {
        fileList.push(filePath);
      }
    } catch(e) {}
  }
  return fileList;
}

const rootDir = 'd:\\สยามโหรามงคล';
const htmlFiles = getAllFiles(rootDir, ['.html']);

const brokenLinks = [];
const allLinks = [];

for (const file of htmlFiles) {
  const relFile = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Match href, action, window.location, location.href
  const patterns = [
    { type: 'href', regex: /href\s*=\s*["']([^"'#][^"']*)["']/gi },
    { type: 'src', regex: /src\s*=\s*["']([^"'#][^"']*)["']/gi },
    { type: 'nav', regex: /(?:location\.href|window\.open|window\.location)\s*=\s*["']([^"'#][^"']*)["']/gi }
  ];

  for (const { type, regex } of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const original = match[1].trim();
      if (
        original.startsWith('http://') ||
        original.startsWith('https://') ||
        original.startsWith('mailto:') ||
        original.startsWith('tel:') ||
        original.startsWith('javascript:') ||
        original.startsWith('data:') ||
        original.startsWith('#') ||
        original.includes('${')
      ) {
        continue;
      }

      const cleanUrl = original.split('?')[0].split('#')[0];
      if (!cleanUrl) continue;

      let targetPath;
      if (cleanUrl.startsWith('/')) {
        targetPath = path.join(rootDir, cleanUrl.substring(1));
      } else {
        targetPath = path.resolve(path.dirname(file), cleanUrl);
      }

      const exists = fs.existsSync(targetPath);
      const item = {
        source: relFile,
        type,
        url: original,
        cleanUrl,
        resolved: path.relative(rootDir, targetPath).replace(/\\/g, '/'),
        exists
      };

      allLinks.push(item);
      if (!exists) {
        brokenLinks.push(item);
      }
    }
  }
}

fs.writeFileSync(
  path.join(rootDir, 'audit-links-result.json'),
  JSON.stringify({ totalChecked: allLinks.length, brokenCount: brokenLinks.length, brokenLinks }, null, 2),
  'utf8'
);

console.log(`Audited ${htmlFiles.length} HTML files.`);
console.log(`Total links checked: ${allLinks.length}`);
console.log(`Broken links found: ${brokenLinks.length}`);
