import re

with open('adminQuickTools.html', 'r', encoding='utf-8') as f:
    text = f.read()

if 'fortune-daily-data.js' not in text:
    text = text.replace('<script src="adminTarotFortune.js"></script>', '<script src="fortune-daily-data.js"></script>\n    <script src="adminTarotFortune.js"></script>')
    with open('adminQuickTools.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added fortune-daily-data.js to adminQuickTools.html")
else:
    print("Already exists")
