import re

with open('adminVipReport.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('// previewScreen.style.cssText = `\n        position: fixed; top: 0; left: 0; width: 100%; height: 100%; \n        background: #E0E0E0; z-index: 100000; overflow-y: auto;\n    `;', '')

with open('adminVipReport.js', 'w', encoding='utf-8') as f:
    f.write(text)
