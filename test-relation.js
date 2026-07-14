/**
 * Test script for relation.js compatibility calculator
 */

// Mock DOM elements for testing
const mockDOM = {
    yourBirthDate: { value: '2000-01-04' },  // Planet 4 (Rahu)
    partnerBirthDate: { value: '1999-05-07' }, // Planet 7 (Ketu)
    relationResult: { innerHTML: '' }
};

// Mock document.getElementById
global.document = {
    getElementById: (id) => mockDOM[id] || null,
    addEventListener: () => {}
};

// Import the functions from relation.js
const fs = require('fs');
const relationCode = fs.readFileSync('d:/สยามโหรามงคล/relation.js', 'utf8');

// Remove "use strict" and DOM listeners, then eval in global scope
const cleanCode = relationCode
    .replace('"use strict";', '')
    .split('document.addEventListener("DOMContentLoaded"')[0];

// Create a function to evaluate in global scope
(function() {
    eval(cleanCode);

    // Make variables accessible in global scope for tests
    global.PATNI_BY_PLANET = PATNI_BY_PLANET;
    global.GRAHA_MAITRI = GRAHA_MAITRI;
    global.calculateGunMilan = calculateGunMilan;
    global.getScoreBadge = getScoreBadge;
    global.getProgressColor = getProgressColor;
    global.getCompatibilityText = getCompatibilityText;
    global.capitalizeFirst = capitalizeFirst;
})();

console.log('✅ Testing relation.js compatibility calculator\n');
console.log('='.repeat(60));

// Test 1: Check if all 9 planets are defined
console.log('\n📊 Test 1: Verify all 9 planets are defined');
const planetCount = Object.keys(PATNI_BY_PLANET).length;
console.log(`✓ Total planets defined: ${planetCount}/9`);
for (let i = 1; i <= 9; i++) {
    const planet = PATNI_BY_PLANET[i];
    if (planet) {
        console.log(`  ✓ [${i}] ${planet.symbol} ${planet.planet} (${planet.element})`);
    } else {
        console.log(`  ✗ [${i}] MISSING`);
    }
}

// Test 2: Check Graha Maitri table
console.log('\n📊 Test 2: Verify Graha Maitri (Planetary Friendship) table');
const grahaKeys = Object.keys(GRAHA_MAITRI).length;
console.log(`✓ Graha Maitri entries: ${grahaKeys}/9`);

// Test 3: Test Gun Milan calculation
console.log('\n📊 Test 3: Calculate Gun Milan for test cases');
console.log('Testing: Your birthday (day 4 = Rahu) vs Partner birthday (day 7 = Ketu)');

const scores = calculateGunMilan(4, 7);
const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
const maxScore = 36;
const compatibilityPercent = Math.round((totalScore / maxScore) * 100);

console.log(`\nGun Milan Scores:`);
console.log(`  • Varna Gun: ${scores.varna}/4`);
console.log(`  • Bhakoot Gun: ${scores.bhakoot}/7`);
console.log(`  • Gana Gun: ${scores.gana}/6`);
console.log(`  • Graha Maitri: ${scores.graha}/5`);
console.log(`  ────────────────────`);
console.log(`  Total: ${totalScore}/${maxScore} (${compatibilityPercent}%)`);

// Test 4: Verify new planets have data
console.log('\n📊 Test 4: Verify new planets (Rahu & Ketu) have complete data');
const rahuData = PATNI_BY_PLANET[4];
const ketuData = PATNI_BY_PLANET[7];

console.log('\n✓ Rahu (4):');
console.log(`  • Symbol: ${rahuData.symbol}`);
console.log(`  • Element: ${rahuData.element}`);
console.log(`  • Varna: ${rahuData.varna}`);
console.log(`  • Character: ${rahuData.character}`);

console.log('\n✓ Ketu (7):');
console.log(`  • Symbol: ${ketuData.symbol}`);
console.log(`  • Element: ${ketuData.element}`);
console.log(`  • Varna: ${ketuData.varna}`);
console.log(`  • Character: ${ketuData.character}`);

// Test 5: Check element compatibility
console.log('\n📊 Test 5: Element compatibility calculations');
const testCases = [
    { num1: 1, num2: 9, desc: 'Sun (Fire) vs Mars (Fire)' },
    { num1: 2, num2: 6, desc: 'Moon (Water) vs Venus (Water)' },
    { num1: 4, num2: 7, desc: 'Rahu (Air) vs Ketu (Fire)' }
];

testCases.forEach(test => {
    const scores = calculateGunMilan(test.num1, test.num2);
    console.log(`✓ ${test.desc}`);
    console.log(`  Bhakoot (Element): ${scores.bhakoot}/7`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!\n');
