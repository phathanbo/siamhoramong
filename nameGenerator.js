"use strict";

const kalakiniRules = {
    0: /[ศษสหฬฮ]/,
    1: /[ะาิีึืุูเแโใไ]/,
    2: /[กขคฆง]/,
    3: /[จฉชซฌญ]/,
    4: /[ดตถทธน]/,
    5: /[ยรลว]/,
    6: /[ดตถทธน]/,
    7: /[ฎฏฐฑฒณ]/
};

// เช็คว่าผลรวมเลขศาสตร์เป็นมงคลหรือไม่
const luckySums = [14, 15, 19, 24, 36, 41, 42, 45, 51, 54, 55, 59, 63, 65];

function isLuckySum(sum) {
    return luckySums.includes(sum);
}

function hasKalakini(nameStr, dayIdx) {
    if (dayIdx === null || dayIdx === undefined) return false;
    const regex = kalakiniRules[dayIdx];
    if (!regex) return false;
    return regex.test(nameStr);
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateDynamicNames(dayIdx, count = 3, preferredTag = '') {
    const vocab = window.ThaiVocab; // หรือจะดึงจาก Firestore ถ้ามี
    if (!vocab || !vocab.prefixes || !vocab.suffixes) return [];

    let results = [];
    let attempts = 0;
    const maxAttempts = 2000; // เพิ่ม Max Attempts ป้องกันหาไม่เจอตอนใช้ Filter

    while (results.length < count && attempts < maxAttempts) {
        attempts++;
        
        // สุ่มรูปแบบ: 2 คำ (50%), 3 คำ (40%), 4 คำ (10%)
        const rand = Math.random();
        let wordParts = [];
        
        const prefix = getRandomItem(vocab.prefixes);
        const suffix = getRandomItem(vocab.suffixes);
        
        wordParts.push(prefix);

        if (rand > 0.9 && vocab.middles && vocab.middles.length >= 2) {
            // 4 คำ
            wordParts.push(getRandomItem(vocab.middles));
            wordParts.push(getRandomItem(vocab.middles));
        } else if (rand > 0.5 && vocab.middles && vocab.middles.length >= 1) {
            // 3 คำ
            wordParts.push(getRandomItem(vocab.middles));
        }
        
        wordParts.push(suffix);

        const fullName = wordParts.map(w => w.word).join('');
        const fullMeaning = wordParts.map(w => w.meaning).join('และ');
        let allTags = new Set();
        wordParts.forEach(w => w.tags.forEach(t => allTags.add(t)));

        // ถ้ามี preferredTag ต้องเช็คว่า tag นั้นมีอยู่ในคำที่สุ่มมาหรือไม่
        if (preferredTag && !allTags.has(preferredTag)) continue;

        // 1. เช็คกาลกิณี
        if (hasKalakini(fullName, dayIdx)) continue;

        // 2. เช็คเลขศาสตร์
        const sum = NameAnalysis.calculate(fullName);
        if (!isLuckySum(sum)) continue;

        // เช็คซ้ำ
        if (results.find(r => r.name === fullName)) continue;

        results.push({
            name: fullName,
            sum: sum,
            tags: Array.from(allTags),
            desc: fullMeaning
        });
    }

    return results;
}

window.generateDynamicNames = generateDynamicNames;

// อัปเดตพจนานุกรมจาก Firestore อัตโนมัติถ้าเชื่อมต่อได้
document.addEventListener('DOMContentLoaded', () => {
    if (window.firebaseDb && typeof window.firebaseDb.collection === 'function') {
        window.firebaseDb.collection('vocabularies').onSnapshot(snapshot => {
            if (snapshot.empty) return;
            
            // รีเซ็ตเพื่อเตรียมรับข้อมูลจาก Firestore
            window.ThaiVocab = { prefixes: [], middles: [], suffixes: [] };
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (window.ThaiVocab[data.type]) {
                    window.ThaiVocab[data.type].push({
                        word: data.word,
                        meaning: data.meaning,
                        tags: data.tags
                    });
                }
            });
            console.log("🌟 Synchronized vocabulary from Firestore");
        });
    }
});
