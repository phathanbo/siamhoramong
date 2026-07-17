const fs = require('fs');
let js = fs.readFileSync('adminTarotReading.js', 'utf-8');

// Update adjustScale to handle both modes
js = js.replace('const wrapper = document.getElementById(\'previewWrapper\');', 'const wrapper = currentMode === 3 ? document.getElementById(\'previewWrapper3\') : document.getElementById(\'previewWrapper1\');');
js = js.replace('const canvas = document.getElementById(\'renderCanvas\');', 'const canvas = currentMode === 3 ? document.getElementById(\'renderCanvas\') : document.getElementById(\'tarotRenderCanvas\');');
js = js.replace('const targetWidth = 1200;', 'const targetWidth = currentMode === 3 ? 1200 : 1080;');

const newLogic = `
// --- Mode Switching Logic ---
let currentMode = 3;

function switchMode(mode) {
    currentMode = mode;
    
    // Update Buttons
    document.getElementById('btnMode1').className = mode === 1 ? 'btn btn-warning active' : 'btn btn-outline-warning';
    document.getElementById('btnMode3').className = mode === 3 ? 'btn btn-warning active' : 'btn btn-outline-warning';
    
    // Update Controls
    document.getElementById('controlsMode1').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('controlsMode3').style.display = mode === 3 ? 'flex' : 'none';
    document.getElementById('summaryMode3').style.display = mode === 3 ? 'flex' : 'none';
    
    // Update Canvas Wrappers
    document.getElementById('previewWrapper1').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('previewWrapper3').style.display = mode === 3 ? 'flex' : 'none';
    
    // Update Title
    document.getElementById('pageTitle').innerHTML = mode === 1 
        ? '<i class="fas fa-layer-group text-warning mr-2"></i>ระบบสร้างภาพไพ่ยิปซี (1 ใบ)' 
        : '<i class="fas fa-layer-group text-warning mr-2"></i>ระบบสร้างภาพไพ่ยิปซี (3 ใบ)';
        
    adjustScale();
    
    // Auto draw if empty
    if (mode === 1 && lastCardIndex === -1) {
        drawSingleTarot();
    }
}

// Check URL Params for mode
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === '1') {
        switchMode(1);
    }
});

// --- 1 Card Mode Logic ---
let lastCardIndex = -1;

function drawSingleTarot() {
    if (typeof tarotCards === 'undefined') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี (tarot-data.js)', 'error');
        return;
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * tarotCards.length);
    } while (randomIndex === lastCardIndex && tarotCards.length > 1);
    
    lastCardIndex = randomIndex;
    const card = tarotCards[randomIndex];

    document.getElementById('tarotPreviewImg').src = card.img;
    document.getElementById('tarotPreviewName').innerText = card.name;
    document.getElementById('tarotPreviewMeaning').innerText = card.meaning;
    document.getElementById('tarotPreviewPast').innerText = card.past;
    document.getElementById('tarotPreviewPresent').innerText = card.present;
    document.getElementById('tarotPreviewFuture').innerText = card.future;
    
    setTimeout(adjustScale, 100);
}

function downloadSingleTarot() {
    Swal.fire({ title: 'กำลังประมวลผล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    // Reset scale before capture
    const canvas = document.getElementById('tarotRenderCanvas');
    const wrapper = document.getElementById('previewWrapper1');
    canvas.style.transform = 'none';
    
    // Use html2canvas
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => {
        html2canvas(canvas, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#090915'
        }).then(c => {
            const link = document.createElement('a');
            link.download = 'daily-tarot-' + Date.now() + '.png';
            link.href = c.toDataURL('image/png');
            link.click();
            Swal.close();
            adjustScale(); // restore scale
        }).catch(err => {
            console.error(err);
            Swal.fire('Error', 'ไม่สามารถสร้างภาพได้', 'error');
            adjustScale();
        });
    };
    document.body.appendChild(script);
}
`;

fs.writeFileSync('adminTarotReading.js', js + '\n' + newLogic, 'utf-8');
console.log("adminTarotReading.js updated.");
