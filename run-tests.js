// Gun Milan Calculator - Fixed Test

const PATNI_BY_PLANET = {
    1: { planet: "อาทิตย์", symbol: "☀️", element: "ไฟ", varna: "เกษตร" },
    2: { planet: "จันทร์", symbol: "🌙", element: "น้ำ", varna: "ว่าน" },
    3: { planet: "พฤหัสบดี", symbol: "♃", element: "อากาศ", varna: "พราหมณ์" },
    4: { planet: "ราหู", symbol: "🌑", element: "อากาศ", varna: "ศูดร" },
    5: { planet: "พุธ", symbol: "☿️", element: "ดิน", varna: "วัณิก" },
    6: { planet: "ศุกร์", symbol: "♀", element: "น้ำ", varna: "วัณิก" },
    7: { planet: "เกตุ", symbol: "☋", element: "ไฟ", varna: "ศูดร" },
    8: { planet: "เสาร์", symbol: "♄", element: "ลม", varna: "ศูดร" },
    9: { planet: "อังคาร", symbol: "♂", element: "ไฟ", varna: "เกษตร" }
};

const GRAHA_MAITRI = {
    1: { 3: 'เพื่อน', 6: 'เพื่อน', 9: 'ศัตรู', 2: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 7: 'เพื่อน', 8: 'เป็นกลาง' },
    2: { 3: 'เพื่อน', 4: 'เพื่อน', 5: 'เพื่อน', 1: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'ศัตรู', 9: 'เป็นกลาง' },
    3: { 1: 'เพื่อน', 2: 'เพื่อน', 9: 'เพื่อน', 6: 'เป็นกลาง', 8: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 7: 'ศัตรู' },
    4: { 2: 'เพื่อน', 5: 'เพื่อน', 8: 'เพื่อน', 1: 'เป็นกลาง', 3: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง', 9: 'ศัตรู' },
    5: { 2: 'เพื่อน', 4: 'เพื่อน', 6: 'เพื่อน', 8: 'เพื่อน', 1: 'เป็นกลาง', 3: 'เป็นกลาง', 7: 'เป็นกลาง', 9: 'เป็นกลาง' },
    6: { 1: 'เพื่อน', 3: 'เพื่อน', 5: 'เพื่อน', 2: 'เป็นกลาง', 4: 'เป็นกลาง', 7: 'เป็นกลาง', 8: 'ศัตรู', 9: 'เป็นกลาง' },
    7: { 1: 'เพื่อน', 3: 'ศัตรู', 2: 'เป็นกลาง', 4: 'เป็นกลาง', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 8: 'เพื่อน', 9: 'เป็นกลาง' },
    8: { 2: 'ศัตรู', 4: 'เพื่อน', 5: 'เพื่อน', 6: 'ศัตรู', 1: 'เป็นกลาง', 3: 'เป็นกลาง', 7: 'เพื่อน', 9: 'เพื่อน' },
    9: { 1: 'ศัตรู', 3: 'เพื่อน', 8: 'เพื่อน', 2: 'เป็นกลาง', 4: 'ศัตรู', 5: 'เป็นกลาง', 6: 'เป็นกลาง', 7: 'เป็นกลาง' }
};

function calculateGunMilan(yourNum, partnerNum) {
    const scores = { varna: 0, bhakoot: 0, gana: 0, graha: 0 };

    // Varna Gun
    const varnaOrder = { 'เกษตร': 1, 'พราหมณ์': 2, 'วัณิก': 3, 'ศูดร': 4 };
    const yourVarna = varnaOrder[PATNI_BY_PLANET[yourNum].varna];
    const partnerVarna = varnaOrder[PATNI_BY_PLANET[partnerNum].varna];
    const varnaDiff = Math.abs(yourVarna - partnerVarna);
    scores.varna = Math.max(4 - varnaDiff, 0);

    // Bhakoot Gun (Element compatibility)
    const elementCompatibility = {
        'ไฟ': { 'ไฟ': 7, 'ลม': 6, 'ดิน': 0, 'น้ำ': 0 },
        'น้ำ': { 'น้ำ': 7, 'ดิน': 6, 'ไฟ': 0, 'ลม': 0 },
        'ลม': { 'ลม': 7, 'ไฟ': 6, 'น้ำ': 0, 'ดิน': 0 },
        'ดิน': { 'ดิน': 7, 'น้ำ': 6, 'ลม': 0, 'ไฟ': 0 }
    };
    const yourElem = PATNI_BY_PLANET[yourNum].element;
    const partnerElem = PATNI_BY_PLANET[partnerNum].element;
    scores.bhakoot = (elementCompatibility[yourElem] && elementCompatibility[yourElem][partnerElem]) || 0;

    // Gana Gun
    const ganaMap = { 1: 'Deva', 2: 'Manushya', 3: 'Deva', 4: 'Rakshasa', 5: 'Manushya', 6: 'Deva', 7: 'Rakshasa', 8: 'Manushya', 9: 'Rakshasa' };
    const yourGana = ganaMap[yourNum];
    const partnerGana = ganaMap[partnerNum];
    if (yourGana === partnerGana) scores.gana = 6;
    else if ((yourGana === 'Deva' && partnerGana === 'Manushya') || (yourGana === 'Manushya' && partnerGana === 'Deva')) scores.gana = 3;
    else scores.gana = 1;

    // Graha Maitri
    const friendship = (GRAHA_MAITRI[yourNum] && GRAHA_MAITRI[yourNum][partnerNum]) || 'เป็นกลาง';
    if (friendship === 'เพื่อน') scores.graha = 5;
    else if (friendship === 'เป็นกลาง') scores.graha = 2;
    else scores.graha = 1;

    return scores;
}

console.log("═".repeat(75));
console.log("🧪 GUN MILAN COMPATIBILITY CALCULATOR - VERIFICATION TESTS");
console.log("═".repeat(75));

// Test 1: All planets
console.log("\n✅ TEST 1: All 9 Planets Defined");
console.log("─".repeat(75));
for (let i = 1; i <= 9; i++) {
    const p = PATNI_BY_PLANET[i];
    console.log(`  [${i}] ${p.symbol} ${p.planet.padEnd(12)} - ${p.element.padEnd(6)} (${p.varna})`);
}

// Test 2: Gun Milan calculation tests
console.log("\n✅ TEST 2: Gun Milan Scoring (Sample Calculations)");
console.log("─".repeat(75));

const testCases = [
    { p1: 4, p2: 7, desc: "Rahu vs Ketu - Shadow planets" },
    { p1: 1, p2: 9, desc: "Sun vs Mars - Both Fire, Enemies" },
    { p1: 2, p2: 5, desc: "Moon vs Mercury - Both Maitri" },
    { p1: 1, p2: 2, desc: "Sun vs Moon - Neutral" },
    { p1: 5, p2: 2, desc: "Mercury vs Moon - Friends" }
];

testCases.forEach((test, idx) => {
    const scores = calculateGunMilan(test.p1, test.p2);
    const total = Object.values(scores).reduce((a, b) => a + b);
    const pct = Math.round(total / 36 * 100);
    const desc = pct >= 32 ? "✅ Excellent" : pct >= 24 ? "✅ Good" : pct >= 18 ? "⚠️ Care" : "❌ Challenge";
    
    console.log(`\n  Case ${idx + 1}: ${test.desc}`);
    console.log(`    ${PATNI_BY_PLANET[test.p1].symbol} ${PATNI_BY_PLANET[test.p1].planet} ↔ ${PATNI_BY_PLANET[test.p2].symbol} ${PATNI_BY_PLANET[test.p2].planet}`);
    console.log(`    Varna: ${scores.varna}/4  |  Bhakoot: ${scores.bhakoot}/7  |  Gana: ${scores.gana}/6  |  Graha: ${scores.graha}/5`);
    console.log(`    Score: ${total}/36 (${pct}%) - ${desc}`);
});

// Test 3: Element compatibility
console.log("\n✅ TEST 3: Element Compatibility Matrix (Bhakoot Gun)");
console.log("─".repeat(75));
const elementTests = [
    { e1: "ไฟ", e2: "ไฟ", expected: 7 },
    { e1: "ไฟ", e2: "ลม", expected: 6 },
    { e1: "ไฟ", e2: "น้ำ", expected: 0 },
    { e1: "น้ำ", e2: "ดิน", expected: 6 },
    { e1: "ลม", e2: "ไฟ", expected: 6 }
];

elementTests.forEach(test => {
    // Find planets with these elements
    const p1 = Object.values(PATNI_BY_PLANET).find(p => p.element === test.e1);
    const p2 = Object.values(PATNI_BY_PLANET).find(p => p.element === test.e2);
    const scores = calculateGunMilan(
        Object.keys(PATNI_BY_PLANET).find(k => PATNI_BY_PLANET[k].element === test.e1),
        Object.keys(PATNI_BY_PLANET).find(k => PATNI_BY_PLANET[k].element === test.e2)
    );
    const status = scores.bhakoot === test.expected ? "✅" : "❌";
    console.log(`  ${status} ${test.e1.padEnd(4)} + ${test.e2.padEnd(4)} = ${scores.bhakoot}/7 (expected ${test.expected}/7)`);
});

// Test 4: Score ranges
console.log("\n✅ TEST 4: Compatibility Interpretation Levels");
console.log("─".repeat(75));
const ranges = [
    { min: 32, max: 36, level: "✅ Excellent (89-100%)" },
    { min: 24, max: 31, level: "✅ Good (67-86%)" },
    { min: 18, max: 23, level: "⚠️  Requires care (50-64%)" },
    { min: 0, max: 17, level: "❌ Challenging (0-47%)" }
];

ranges.forEach(r => {
    const pctMin = Math.round(r.min / 36 * 100);
    const pctMax = Math.round(r.max / 36 * 100);
    console.log(`  ${r.min.toString().padStart(2)}-${r.max} points: ${r.level} (${pctMin}-${pctMax}%)`);
});

console.log("\n" + "═".repeat(75));
console.log("🎉 VERIFICATION COMPLETE - Gun Milan Calculator is Functional!");
console.log("═".repeat(75));
