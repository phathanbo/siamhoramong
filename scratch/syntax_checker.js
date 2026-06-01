const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dirPath = 'd:\\สยามโหรามงคล';
const files = fs.readdirSync(dirPath);

console.log('--- STARTING COMPREHENSIVE JS SYNTAX CHECK ---');
let errorCount = 0;
let fileCount = 0;

for (const file of files) {
  if (file.endsWith('.js') && file !== 'syntax_checker.js') {
    fileCount++;
    const filePath = path.join(dirPath, file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Check if it looks like an ES module or standard script
    const isModule = code.includes('import ') || code.includes('export ');
    
    if (isModule && vm.SourceTextModule) {
      try {
        new vm.SourceTextModule(code, { identifier: file });
      } catch (err) {
        errorCount++;
        console.error(`\n[ERROR] in Module ${file}:`);
        console.error(err.stack || err.message);
      }
    } else {
      try {
        new vm.Script(code, { filename: file });
      } catch (err) {
        // If it failed because of import/export, and we don't have SourceTextModule, or just in case
        if (err.message.includes('Cannot use import statement') || err.message.includes('Unexpected token \'export\'')) {
          if (vm.SourceTextModule) {
            try {
              new vm.SourceTextModule(code, { identifier: file });
              continue; // Success as Module
            } catch (err2) {
              errorCount++;
              console.error(`\n[ERROR] in Module ${file}:`);
              console.error(err2.stack || err2.message);
              continue;
            }
          }
        }
        errorCount++;
        console.error(`\n[ERROR] in ${file}:`);
        console.error(err.stack || err.message);
      }
    }
  }
}

console.log(`\n--- SUMMARY ---`);
console.log(`Checked ${fileCount} files.`);
console.log(`Found ${errorCount} files with syntax errors.`);
