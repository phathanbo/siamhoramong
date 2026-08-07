const fs = require('fs');
const path = require('path');

// 1. Patch index.html to add style and onclick handlers
const indexFile = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexFile, 'utf8');

// Add css style for clickable positions
if (!indexContent.includes('#all-positions > g')) {
    const styleTag = '</style>';
    const customStyle = `\n        #all-positions > g { cursor: pointer; transition: transform 0.2s; }\n        #all-positions > g:hover { transform: scale(1.1) translate(var(--tx, 0), var(--ty, 0)); }\n    `;
    // We can insert it right before the closing style tag of the promchart section or general style
    indexContent = indexContent.replace(styleTag, customStyle + styleTag);
}

// Replace position elements with onclick
const posReplacements = [
    { old: '<g id="pos-0" transform="translate(200, 45)">', new: '<g id="pos-0" transform="translate(200, 45)" onclick="showSymbolMeaning(0)">' },
    { old: '<g id="pos-1" transform="translate(275, 65)">', new: '<g id="pos-1" transform="translate(275, 65)" onclick="showSymbolMeaning(1)">' },
    { old: '<g id="pos-2" transform="translate(335, 125)">', new: '<g id="pos-2" transform="translate(335, 125)" onclick="showSymbolMeaning(2)">' },
    { old: '<g id="pos-3" transform="translate(355, 200)">', new: '<g id="pos-3" transform="translate(355, 200)" onclick="showSymbolMeaning(3)">' },
    { old: '<g id="pos-4" transform="translate(335, 275)">', new: '<g id="pos-4" transform="translate(335, 275)" onclick="showSymbolMeaning(4)">' },
    { old: '<g id="pos-5" transform="translate(275, 335)">', new: '<g id="pos-5" transform="translate(275, 335)" onclick="showSymbolMeaning(5)">' },
    { old: '<g id="pos-6" transform="translate(200, 355)">', new: '<g id="pos-6" transform="translate(200, 355)" onclick="showSymbolMeaning(6)">' },
    { old: '<g id="pos-7" transform="translate(125, 335)">', new: '<g id="pos-7" transform="translate(125, 335)" onclick="showSymbolMeaning(7)">' },
    { old: '<g id="pos-8" transform="translate(65, 275)">', new: '<g id="pos-8" transform="translate(65, 275)" onclick="showSymbolMeaning(8)">' },
    { old: '<g id="pos-9" transform="translate(45, 200)">', new: '<g id="pos-9" transform="translate(45, 200)" onclick="showSymbolMeaning(9)">' },
    { old: '<g id="pos-10" transform="translate(65, 125)">', new: '<g id="pos-10" transform="translate(65, 125)" onclick="showSymbolMeaning(10)">' },
    { old: '<g id="pos-11" transform="translate(125, 65)">', new: '<g id="pos-11" transform="translate(125, 65)" onclick="showSymbolMeaning(11)">' }
];

posReplacements.forEach(r => {
    indexContent = indexContent.replace(r.old, r.new);
});

fs.writeFileSync(indexFile, indexContent, 'utf8');
console.log("SUCCESS: index.html clickable positions updated!");


// 2. Patch src/engine/promchart.js to append window.showSymbolMeaning
const promchartFile = path.join(__dirname, '../src/engine/promchart.js');
let promchartContent = fs.readFileSync(promchartFile, 'utf8');

const showSymbolMeaningFunc = `
// 🔮 แสดงความหมายสัญลักษณ์เมื่อคลิกที่วงล้อพร้อมภาพ AI ประกอบ
window.showSymbolMeaning = function(positionIndex) {
    const data = PROMCHART_DATA[positionIndex];
    if (!data) return;

    // ลิงก์รูปภาพ AI สำหรับแต่ละสัญลักษณ์ในระบบ
    const imageMap = {
        0: 'assets/images/promchart/chedi.jpg',
        1: 'assets/images/promchart/silver_parasol.jpg',
        2: 'assets/images/promchart/decapitated.jpg',
        3: 'assets/images/promchart/royal_house.jpg',
        4: 'assets/images/promchart/castle.jpg',
        5: 'assets/images/promchart/rahu.jpg',
        6: 'assets/images/promchart/gold_parasol.jpg',
        7: 'assets/images/promchart/deity_turtle.jpg',
        8: 'assets/images/promchart/prison.jpg',
        9: 'assets/images/promchart/sorcerer.jpg',
        10: 'assets/images/promchart/witch.jpg',
        11: 'assets/images/promchart/naga.jpg'
    };

    const imageUrl = imageMap[positionIndex] || '';

    Swal.fire({
        title: \`<span style="color:#d4af37; font-weight:bold; font-size:1.5rem;"><i class="fas fa-dharmachakra"></i> ตำแหน่ง: \${data.name} (\${data.meaning})</span>\`,
        html: \`
            <div style="text-align: left; font-family: 'Sarabun', sans-serif; color: #fff; max-height: 480px; overflow-y: auto; padding-right: 8px;">
                \${imageUrl ? \`<div style="text-align:center; margin-bottom:15px;"><img src="\${imageUrl}" style="width: 100%; max-width: 380px; height: 220px; object-fit: cover; border-radius: 12px; border: 2px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"></div>\` : ''}
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 12px;"><strong style="color: #ffe8a3;">โทนดวงชะตา:</strong> \${data.tone} \${data.rating}</p>
                <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; border-left: 4px solid #d4af37;">\${data.detail}</p>
                
                <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <div style="margin-bottom: 12px;"><strong style="color: #ffe8a3;"><i class="fas fa-briefcase"></i> การงาน:</strong> <span style="font-size: 0.95rem; color: #ddd; display:block; margin-top:2px;">\${data.dimensions.work}</span></div>
                    <div style="margin-bottom: 12px;"><strong style="color: #ffe8a3;"><i class="fas fa-coins"></i> การเงิน:</strong> <span style="font-size: 0.95rem; color: #ddd; display:block; margin-top:2px;">\${data.dimensions.money}</span></div>
                    <div style="margin-bottom: 12px;"><strong style="color: #ffe8a3;"><i class="fas fa-heart"></i> ความรัก:</strong> <span style="font-size: 0.95rem; color: #ddd; display:block; margin-top:2px;">\${data.dimensions.love}</span></div>
                    <div style="margin-bottom: 12px;"><strong style="color: #ffe8a3;"><i class="fas fa-heartbeat"></i> สุขภาพ:</strong> <span style="font-size: 0.95rem; color: #ddd; display:block; margin-top:2px;">\${data.dimensions.health}</span></div>
                    <div style="margin-bottom: 12px;"><strong style="color: #ff8b8b;"><i class="fas fa-exclamation-triangle"></i> ข้อควรระวัง:</strong> <span style="font-size: 0.95rem; color: #ffbaba; display:block; margin-top:2px;">\${data.dimensions.caution}</span></div>
                    <div style="margin-bottom: 0;"><strong style="color: #a3ffb4;"><i class="fas fa-gem"></i> การเสริมดวง:</strong> <span style="font-size: 0.95rem; color: #d4ffd9; display:block; margin-top:2px;">\${data.dimensions.remedy}</span></div>
                </div>
            </div>
        \`,
        background: '#15102a',
        color: '#fff',
        confirmButtonText: 'ปิดหน้าต่าง',
        confirmButtonColor: '#d4af37',
        width: '550px'
    });
};
`;

if (!promchartContent.includes('window.showSymbolMeaning')) {
    promchartContent += showSymbolMeaningFunc;
    fs.writeFileSync(promchartFile, promchartContent, 'utf8');
    console.log("SUCCESS: promchart.js patched with showSymbolMeaning!");
} else {
    console.log("INFO: showSymbolMeaning already exists in promchart.js.");
}
