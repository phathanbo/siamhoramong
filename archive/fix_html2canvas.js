const fs = require('fs');
let code = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

const html2canvasHelper = `
function captureWithHtml2Canvas(elementId) {
    return new Promise((resolve, reject) => {
        const captureArea = document.getElementById(elementId);
        if (!captureArea) return reject('Element not found');
        
        // Reset scale before capture
        const originalTransform = captureArea.style.transform;
        captureArea.style.transform = 'none';
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
            html2canvas(captureArea, {
                scale: 1, 
                useCORS: true,
                backgroundColor: '#0d0a1a',
                width: 1080,
                height: 1080
            }).then(c => {
                const dataUrl = c.toDataURL('image/png', 0.9);
                captureArea.style.transform = originalTransform;
                resolve(dataUrl);
            }).catch(err => {
                captureArea.style.transform = originalTransform;
                reject(err);
            });
        };
        script.onerror = () => {
            captureArea.style.transform = originalTransform;
            reject(new Error('Failed to load html2canvas'));
        }
        document.body.appendChild(script);
    });
}
`;

code = code.replace(/async function downloadImage\(\) \{/, html2canvasHelper + '\nasync function downloadImage() {');
code = code.replace(/const canvas = await renderElementToCanvas\('captureArea', \{ width: 1080, height: 1080 \}\);\s*const dataUrl = canvas\.toDataURL\('image\/png', 0\.9\);/g, 'const dataUrl = await captureWithHtml2Canvas(\'captureArea\');');

fs.writeFileSync('adminZodiacAutoCarousel.js', code, 'utf8');
console.log('Updated to use html2canvas!');
