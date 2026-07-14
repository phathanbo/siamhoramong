import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('ADMIN_CONTENT_DAYS_LIST', 'DAYS_LIST')
text = text.replace('ADMIN_CONTENT_DAY_COLORS', 'DAY_COLORS')
text = text.replace('ADMIN_CONTENT_ZODIAC_LIST', 'ZODIAC_LIST')

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed variable names')
