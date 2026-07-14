import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Inside generateDailyContent(), initialize cards array
text = text.replace('let outputText = "";', 'let outputText = "";\n    let cards = [];\n    window.lastGeneratedDateStr = dateThStr;')

# Inside the day loop
day_insert = '''outputText += `🌟 ทริคเสริมดวง: เลขมงคล ${luckyNum1}${luckyNum2} | สีมงคล: ${luckyColor}\\n`;
            outputText += `---------------------------------\\n\\n`;
            cards.push({ icon: dColor, title: dayName, wText, fText, lText });'''
text = text.replace('outputText += `🌟 ทริคเสริมดวง: เลขมงคล ${luckyNum1}${luckyNum2} | สีมงคล: ${luckyColor}\\n`;\n            outputText += `---------------------------------\\n\\n`;', day_insert)

# Inside the zodiac loop
zodiac_insert = '''outputText += `🌟 เลขมงคลพารวย: ${luckyNum1}, ${luckyNum2}\\n`;
            outputText += `---------------------------------\\n\\n`;
            cards.push({ icon: z.icon, title: z.name, wText, fText, lText });'''
text = text.replace('outputText += `🌟 เลขมงคลพารวย: ${luckyNum1}, ${luckyNum2}\\n`;\n            outputText += `---------------------------------\\n\\n`;', zodiac_insert)

# End of generateDailyContent()
end_insert = '''resText.value = outputText;
    resContainer.style.display = "block";
    window.lastGeneratedCards = cards;'''
text = text.replace('resText.value = outputText;\n    resContainer.style.display = "block";', end_insert)


with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Patched generateDailyContent to populate cards')
