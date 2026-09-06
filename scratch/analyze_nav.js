const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\สยามโหรามงคล';

function getFiles(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', 'archive'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      getFiles(p, list);
    } else if (f.endsWith('.html')) {
      list.push(p);
    }
  }
  return list;
}

const files = getFiles(rootDir);
const navItems = [];

for (const file of files) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // A tags
  const aRegex = /<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const href = match[1].trim();
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    navItems.push({
      file: rel,
      type: 'a-href',
      href,
      text: text.slice(0, 50)
    });
  }

  // Window navigation
  const navRegex = /(?:location\.href|window\.open|window\.location)\s*=\s*["']([^"']*)["']/gi;
  while ((match = navRegex.exec(content)) !== null) {
    navItems.push({
      file: rel,
      type: 'js-nav',
      href: match[1].trim(),
      text: '[JS Action]'
    });
  }
}

// Analysis
const deadLinks = navItems.filter(i => ['#', '', 'javascript:void(0)', 'javascript:;'].includes(i.href));
const externalLinks = navItems.filter(i => /^https?:\/\//i.test(i.href));
const internalLinks = navItems.filter(i => !['#', '', 'javascript:void(0)', 'javascript:;'].includes(i.href) && !/^https?:\/\//i.test(i.href) && !i.href.startsWith('mailto:') && !i.href.startsWith('tel:'));

// Group internal links and check destination existence
const broken = [];
const crossLinks = [];

for (const item of internalLinks) {
  let clean = item.href.split('?')[0].split('#')[0];
  if (!clean) continue;
  let resolved;
  const currentDir = path.dirname(path.join(rootDir, item.file));
  if (clean.startsWith('/')) {
    resolved = path.join(rootDir, clean.slice(1));
  } else {
    resolved = path.resolve(currentDir, clean);
  }

  const exists = fs.existsSync(resolved);
  const relResolved = path.relative(rootDir, resolved).replace(/\\/g, '/');
  if (!exists) {
    broken.push({ ...item, resolved: relResolved });
  } else {
    crossLinks.push({ ...item, resolved: relResolved });
  }
}

// Summary of how pages link to each other
const linkGraph = {};
for (const c of crossLinks) {
  if (!linkGraph[c.file]) linkGraph[c.file] = [];
  linkGraph[c.file].push({ to: c.resolved, text: c.text, rawHref: c.href });
}

fs.writeFileSync(
  path.join(rootDir, 'navigation-audit.json'),
  JSON.stringify({
    totalHtmlFiles: files.length,
    totalNavChecked: navItems.length,
    deadLinksCount: deadLinks.length,
    brokenLinksCount: broken.length,
    externalLinksCount: externalLinks.length,
    broken,
    deadLinksSample: deadLinks,
    linkGraph
  }, null, 2),
  'utf8'
);

console.log('Done navigation audit.');
console.log('Files:', files.length);
console.log('Nav Elements:', navItems.length);
console.log('Dead / Placeholder (# / empty):', deadLinks.length);
console.log('Broken relative links:', broken.length);
console.log('External links:', externalLinks.length);
