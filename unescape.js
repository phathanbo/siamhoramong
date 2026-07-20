const fs = require('fs');
let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');
js = js.replace(/\\`/g, '`');
js = js.replace(/\\\$\{/g, '${');
fs.writeFileSync('adminZodiacAutoCarousel.js', js);
