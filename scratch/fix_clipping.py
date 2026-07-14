import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix canvas height to prevent clipping
text = text.replace('height: 1080px;', 'height: 1200px;')

# Remove box-shadow from the badge colors to fix checkered background
text = text.replace('margin: 0 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);', 'margin: 0 5px;')

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Applied final tweaks: increased height and removed box-shadow on badges.")
