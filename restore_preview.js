const fs = require('fs');

let fixBg = fs.readFileSync('fix_js_styling.js', 'utf8');
let start = fixBg.indexOf('const newPreviewFunc = `') + 24;
let end = fixBg.lastIndexOf('`;', fixBg.indexOf('const regexCanvas'));

if (start > 23 && end !== -1) {
    let previewCode = fixBg.substring(start, end);
    previewCode = previewCode.replace(/const spaceBg = `[\s\S]*?`;/, "const spaceBg = `\n        background: url('images/carousel_bg.png') center/cover no-repeat;\n    `;");
    previewCode = previewCode.replace(/\$\{astroRings\}/g, '');
    
    let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');
    
    // Check if renderCarouselPreview is already there (it isn't)
    if (!js.includes('function renderCarouselPreview()')) {
        js = js.replace('async function postCarouselToFacebook', previewCode + '\n\nasync function postCarouselToFacebook');
        fs.writeFileSync('adminZodiacAutoCarousel.js', js);
        console.log('Restored renderCarouselPreview');
    } else {
        console.log('renderCarouselPreview already exists!');
    }
} else {
    console.log('Could not extract previewCode');
}
