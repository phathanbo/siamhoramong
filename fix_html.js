const fs = require('fs');
const path = 'taksasattalek.html';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<script>') && lines[i+1] && lines[i+1].includes('let globalRows = [];')) {
        startIdx = i;
    }
    // We want the last </script> tag
    if (lines[i].includes('</script>') && startIdx !== -1) {
        endIdx = i;
    }
    
    if (lines[i].includes('บันทึกภาพผังดวงและคำทำนาย (PNG Image)')) {
        lines[i] = lines[i].replace('บันทึกภาพผังดวงและคำทำนาย (PNG Image)', 'บันทึกภาพผังดวงและคำทำนาย (PNG / PDF)');
    }
    if (lines[i].includes('fa-camera') && lines[i-1] && lines[i-1].includes('btnExport')) {
        lines[i] = lines[i].replace('fa-camera', 'fa-download');
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const newScripts = [
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>',
        '    <script src="taksasattalek-data.js"></script>',
        '    <script src="taksasattalek.js"></script>'
    ];
    
    lines.splice(startIdx, endIdx - startIdx + 1, ...newScripts);
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Successfully replaced inline script and updated button text in taksasattalek.html!');
} else {
    console.log('Failed to find script bounds. Start:', startIdx, 'End:', endIdx);
}
