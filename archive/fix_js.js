const fs = require('fs');

let js = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const code = fs.readFileSync('replace_func.js', 'utf8');
const lines = code.split('\n');
const funcLines = lines.slice(4, lines.length - 5);
const newFunc = funcLines.join('\n');

// Find the corrupted area. The corruption starts around 'const fs = require('fs');' or '[object Promise]'
// Let's just find the exact spot of `async function postCarouselToFacebook()`
let postIdx = js.indexOf('async function postCarouselToFacebook()');
let downloadIdx = js.indexOf('function downloadCarouselImages()');

// If the file is so corrupted we can't find it easily:
let preText = js.substring(0, js.indexOf('Swal.fire(\'สำเร็จ\', \'ดาวน์โหลดภาพทั้งหมด 9 ภาพเรียบร้อยแล้ว\', \'success\');') + 71);
preText += "\n\n    } catch (error) {\n        console.error(error);\n        Swal.fire('ข้อผิดพลาด', 'เกิดปัญหาขณะสร้างภาพอัลบั้ม', 'error');\n    }\n}\n\n";

let postText = js.substring(postIdx);

fs.writeFileSync('adminZodiacAutoCarousel.js', preText + newFunc + '\n\n' + postText);
