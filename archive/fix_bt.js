const fs = require('fs');
let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');
if (js[50941] === '`') {
    js = js.substring(0, 50941) + js.substring(50943); // remove ` and ;
    fs.writeFileSync('adminZodiacAutoCarousel.js', js);
    console.log('Removed backtick and semicolon');
} else {
    console.log('Char at 50941 is:', js[50941]);
}
