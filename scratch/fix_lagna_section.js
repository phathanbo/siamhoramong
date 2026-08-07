const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'Horasat.html');
let code = fs.readFileSync(file, 'utf8');

const target = `                if (tanuSedKey && ayanamsaPredictions.tanuSedPredictions[tanuSedKey]) {
                    const tsPlanet = results.find(p => p.key === (tanuSedKey === "sun" ? "sun" : tanuSedKey)); // match key
                    const tsColor = tsPlanet ? tsPlanet.color : "#fff";
                    predHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #b39ddb;"><b><span style="color:\${tsColor}; font-size:1.2em;">●</span> ตนุเศษ (จิตใต้สำนึก):</b> \${ayanamsaPredictions.tanuSedPredictions[tanuSedKey]}</div>\`;
                }
                predHtml += \`</div></div></div>\`; // Close section`;

const replacement = `                // 1. ลัคนาและตนุเศษ
                predHtml += \`<div class="prediction-section" id="section-lagna" class="pred-card-item" data-category="personality">\`;
                predHtml += \`<div class="section-header" onclick="toggleAccordion(this)"><h3 style="color:#ffd88a;">✨ ตัวตนแท้จริง (ลัคนา/ตนุเศษ) <i class="fas fa-chevron-down accordion-icon"></i></h3><button class="export-btn-sm hide-on-export" onclick="event.stopPropagation(); exportSection(this, 'section-lagna', 'ดวงชะตา-ตัวตนแท้จริง.png')"><i class="fas fa-download"></i> เซฟรูป</button></div>\`;
                predHtml += \`<div class="accordion-content"><div class="prediction-grid">\`;
                predHtml += \`<div class="birth-card" style="margin-bottom: 0;"><b>🌟 ลัคนา:</b> \${ayanamsaPredictions.lagna[lagnaSignIdx].text}</div>\`;
                if (tanuSedKey && ayanamsaPredictions.tanuSedPredictions[tanuSedKey]) {
                    const tsPlanet = results.find(p => p.key === (tanuSedKey === "sun" ? "sun" : tanuSedKey)); // match key
                    const tsColor = tsPlanet ? tsPlanet.color : "#fff";
                    predHtml += \`<div class="birth-card" style="margin-bottom: 0; border-left: 4px solid #b39ddb;"><b><span style="color:\${tsColor}; font-size:1.2em;">●</span> ตนุเศษ (จิตใต้สำนึก):</b> \${ayanamsaPredictions.tanuSedPredictions[tanuSedKey]}</div>\`;
                }
                predHtml += \`</div></div></div>\`; // Close section`;

// Normalize line endings for replacement search
const normCode = code.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normReplacement = replacement.replace(/\r\n/g, '\n');

if (normCode.includes(normTarget)) {
    const newCode = normCode.replace(normTarget, normReplacement);
    // Write back with CRLF if original had CRLF
    fs.writeFileSync(file, newCode.split('\n').join('\r\n'), 'utf8');
    console.log("Successfully restored section-lagna wrapping code!");
} else {
    console.error("Target text not found in Horasat.html!");
}
