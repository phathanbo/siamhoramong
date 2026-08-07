// Test script to run in browser console
console.log('%c✅ Testing relation.js', 'color: gold; font-size: 16px; font-weight: bold;');

// Test 1: Check if PATNI_BY_PLANET is defined
if (typeof PATNI_BY_PLANET === 'undefined') {
    console.error('❌ PATNI_BY_PLANET is not defined');
} else {
    console.log('%c✅ PATNI_BY_PLANET is defined', 'color: green;');
    console.log('Number of planets:', Object.keys(PATNI_BY_PLANET).length);
    Object.entries(PATNI_BY_PLANET).forEach(([num, planet]) => {
        console.log(`[${num}] ${planet.symbol} ${planet.planet} - ${planet.element}`);
    });
}

// Test 2: Check if GRAHA_MAITRI is defined
if (typeof GRAHA_MAITRI === 'undefined') {
    console.error('❌ GRAHA_MAITRI is not defined');
} else {
    console.log('%c✅ GRAHA_MAITRI is defined', 'color: green;');
    console.log('Graha Maitri entries:', Object.keys(GRAHA_MAITRI).length);
}

// Test 3: Check if calculateGunMilan function exists
if (typeof calculateGunMilan === 'undefined') {
    console.error('❌ calculateGunMilan function is not defined');
} else {
    console.log('%c✅ calculateGunMilan function is defined', 'color: green;');
    // Test with planets 4 and 7
    const scores = calculateGunMilan(4, 7);
    console.log('Gun Milan test (Planet 4 vs 7):', scores);
}
