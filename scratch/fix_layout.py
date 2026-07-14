import re
with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix height and margins for the layout
text = text.replace('height: 500px;', 'height: 540px;')
text = text.replace('margin-bottom: 35px;', 'margin-bottom: 25px;')
text = text.replace('margin-bottom: 30px;', 'margin-bottom: 20px;')

# Ensure text overflow is hidden or text is smaller
text = text.replace('font-size: 18px; color: #555; line-height: 1.4;', 'font-size: 17px; color: #555; line-height: 1.35;')

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Adjusted layout to prevent overlap")
