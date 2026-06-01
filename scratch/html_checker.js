const fs = require('fs');
const path = require('path');

const dirPath = 'd:\\สยามโหรามงคล';
const htmlFiles = ['index.html', 'pakka.html', 'taksasattalek.html'];

console.log('--- STARTING HTML STATIC ANALYSIS ---');

// Load all JS files to find function declarations and globally defined variables
const jsFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.js') && f !== 'syntax_checker.js' && f !== 'html_checker.js');
const jsContents = {};
const jsFunctions = new Set();
const jsGlobals = new Set();

for (const jsFile of jsFiles) {
  const content = fs.readFileSync(path.join(dirPath, jsFile), 'utf8');
  jsContents[jsFile] = content;
  
  // Basic regex to find function declarations: function name(...) or name = function(...) or class declarations or const name = (...) =>
  const funcRegexes = [
    /function\s+([a-zA-Z0-9_$]+)\s*\(/g,
    /window\.([a-zA-Z0-9_$]+)\s*=/g,
    /class\s+([a-zA-Z0-9_$]+)/g,
    /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/g,
    /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function/g
  ];
  
  for (const regex of funcRegexes) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      jsFunctions.add(match[1]);
    }
  }
}

// Add some known global/library functions
const knownGlobals = new Set([
  'alert', 'confirm', 'prompt', 'console.log', 'parseInt', 'parseFloat', 'isNaN', 
  'Date', 'Math', 'String', 'Number', 'Array', 'Object', 'RegExp',
  '$', 'jQuery', 'Swal', 'Chart', 'html2canvas', 'searchKnowledge', 'filterKnowledge', 'searchHistory', 'goBack', 'navigateTo'
]);

for (const htmlFile of htmlFiles) {
  console.log(`\nAnalyzing ${htmlFile}...`);
  const htmlPath = path.join(dirPath, htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.log(`[WARNING] File ${htmlFile} does not exist.`);
    continue;
  }
  
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // 1. Check duplicate IDs
  const idRegex = /id=["']([^"']+)["']/g;
  const ids = {};
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    const id = match[1];
    ids[id] = (ids[id] || 0) + 1;
  }
  
  const duplicates = Object.entries(ids).filter(([id, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`  [ERROR] Duplicate IDs found:`);
    for (const [id, count] of duplicates) {
      console.log(`    - ID "${id}" appears ${count} times.`);
    }
  } else {
    console.log(`  [OK] No duplicate IDs.`);
  }

  // 2. Check referenced local JS files
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
  let scriptMatch;
  console.log(`  Checking script dependencies...`);
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    const src = scriptMatch[1];
    if (!src.startsWith('http') && !src.startsWith('//')) {
      // Local file
      const resolvedPath = path.join(dirPath, src);
      if (!fs.existsSync(resolvedPath)) {
        console.log(`    [ERROR] Referenced script not found: ${src}`);
      } else {
        // Ok
      }
    }
  }

  // 3. Check referenced local CSS files
  const cssRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
  let cssMatch;
  console.log(`  Checking stylesheet dependencies...`);
  while ((cssMatch = cssRegex.exec(content)) !== null) {
    const href = cssMatch[1];
    if (href.endsWith('.css') && !href.startsWith('http') && !href.startsWith('//')) {
      const resolvedPath = path.join(dirPath, href);
      if (!fs.existsSync(resolvedPath)) {
        console.log(`    [ERROR] Referenced stylesheet not found: ${href}`);
      }
    }
  }

  // 4. Check inline event handlers (e.g. onclick="func()")
  const eventRegex = /on(?:click|change|submit|keyup|keydown|load|input)\s*=\s*["']([^"']+)["']/gi;
  let eventMatch;
  const missingEventHandlers = new Set();
  while ((eventMatch = eventRegex.exec(content)) !== null) {
    const handlerCode = eventMatch[1].trim();
    // Extract the function call name (e.g. "calculateEsh()" -> "calculateEsh")
    const funcNameMatch = /^([a-zA-Z0-9_$]+)/.exec(handlerCode);
    if (funcNameMatch) {
      const funcName = funcNameMatch[1];
      // Special check: memberApp.login() -> check memberApp
      const dotParts = funcName.split('.');
      const baseName = dotParts[0];
      
      if (!jsFunctions.has(baseName) && !knownGlobals.has(baseName) && !jsGlobals.has(baseName)) {
        // Check if defined as variable/object in JS
        let foundInJs = false;
        for (const jsFile of jsFiles) {
          if (jsContents[jsFile].includes(`var ${baseName}`) || 
              jsContents[jsFile].includes(`let ${baseName}`) || 
              jsContents[jsFile].includes(`const ${baseName}`) ||
              jsContents[jsFile].includes(`window.${baseName}`)) {
            foundInJs = true;
            jsGlobals.add(baseName);
            break;
          }
        }
        if (!foundInJs && !baseName.startsWith('javascript')) {
          missingEventHandlers.add(baseName);
        }
      }
    }
  }
  
  if (missingEventHandlers.size > 0) {
    console.log(`  [WARNING] Possible missing event handlers/variables (not found in JS files):`);
    for (const h of missingEventHandlers) {
      console.log(`    - "${h}"`);
    }
  } else {
    console.log(`  [OK] All inline event handlers seem defined.`);
  }
}
