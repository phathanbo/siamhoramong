import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix n back to \n in outputText += ... 
text = text.replace('n`;', '\\n`;')
text = text.replace('nn`;', '\\n\\n`;')
text = text.replace('nประจำ', '\\nประจำ')
text = text.replace('nเช็คดวง', '\\nเช็คดวง')
text = text.replace('nขอให้ทุกท่าน', '\\nขอให้ทุกท่าน')
text = text.replace('nชะตากำหนด', '\\nชะตากำหนด')
text = text.replace('ความรัก: n${', 'ความรัก: \\n${')
text = text.replace('สะพา\\nนบุญ', 'สะพานบุญ') # Fix accidentally split words if any
text = text.replace('สะพา\nนบุญ', 'สะพานบุญ') 
text = text.replace('อย่าลืมกดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับความโชคดีกันนะครับ 🙏✨n`;', 'อย่าลืมกดไลก์ กดแชร์ เพื่อเป็นสะพานบุญและรับความโชคดีกันนะครับ 🙏✨\\n`;')
text = text.replace('#ดูดวง #ดวงรายวัน #ดวงวันนี้ \n#สยามโหรามงคล #ดวงแม่นๆ', '#ดูดวง #ดวงรายวัน #ดวงวันนี้ \\n#สยามโหรามงคล #ดวงแม่นๆ')
text = text.replace('#ดูดวง #ดวงรายวัน #ดวงวันนี้ n#สยามโหรามงคล #ดวงแม่นๆ', '#ดูดวง #ดวงรายวัน #ดวงวันนี้ \\n#สยามโหรามงคล #ดวงแม่นๆ')

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
