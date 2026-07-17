const fs = require('fs');
eval(fs.readFileSync('tarot-data.js', 'utf8'));

let maxLen = 0;
let maxText = "";
tarotCards.forEach(c => {
    let len = c.meaning.length + c.future.length;
    if (len > maxLen) {
        maxLen = len;
        maxText = c.name + "\nMeaning: " + c.meaning + "\nAdvice: " + c.future;
    }
});
console.log(maxText);
