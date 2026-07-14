import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Loop 1
old_loop1 = '''while (outstandingDays.length < 3) {
            let r = Math.floor(seededRandom(dateSeedBase + 20) * 7);
            if (!outstandingDays.includes(r)) outstandingDays.push(r);
        }'''
new_loop1 = '''let counter1 = 0;
        while (outstandingDays.length < 3 && counter1 < 50) {
            let r = Math.floor(seededRandom(dateSeedBase + 20 + counter1) * 7);
            if (!outstandingDays.includes(r)) outstandingDays.push(r);
            counter1++;
        }'''
text = text.replace(old_loop1, new_loop1)

# Loop 2
old_loop2 = '''while (wealthDays.length < 2) {
            let r = Math.floor(seededRandom(dateSeedBase + 30) * 7);
            if (!outstandingDays.includes(r) && !wealthDays.includes(r)) wealthDays.push(r);
        }'''
new_loop2 = '''let counter2 = 0;
        while (wealthDays.length < 2 && counter2 < 50) {
            let r = Math.floor(seededRandom(dateSeedBase + 30 + counter2) * 7);
            if (!outstandingDays.includes(r) && !wealthDays.includes(r)) wealthDays.push(r);
            counter2++;
        }'''
text = text.replace(old_loop2, new_loop2)

# Loop 3
old_loop3 = '''while (warningDays.length < 2) {
            let r = Math.floor(seededRandom(dateSeedBase + 40) * 7);
            if (!outstandingDays.includes(r) && !wealthDays.includes(r) && !warningDays.includes(r)) warningDays.push(r);
        }'''
new_loop3 = '''let counter3 = 0;
        while (warningDays.length < 2 && counter3 < 50) {
            let r = Math.floor(seededRandom(dateSeedBase + 40 + counter3) * 7);
            if (!outstandingDays.includes(r) && !wealthDays.includes(r) && !warningDays.includes(r)) warningDays.push(r);
            counter3++;
        }'''
text = text.replace(old_loop3, new_loop3)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Patched infinite loops in adminContentGenerator.js")
