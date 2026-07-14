with open('adminQuickTools.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert ascendant.js before thai-astrology-data.js
text = text.replace('<script src="thai-astrology-data.js"></script>', '<script src="ascendant.js"></script>\n    <script src="thai-astrology-data.js"></script>')

with open('adminQuickTools.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Added ascendant.js')
