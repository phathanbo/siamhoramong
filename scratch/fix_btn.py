with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert the button into genResultContainer
old_btn = '<button class="btn btn-primary btn-block mt-2" onclick="copyGenResult()">📋 คัดลอกข้อความ (Copy)</button>'
new_btn = old_btn + '\n                <button class="btn btn-warning btn-block mt-2" onclick="downloadSummaryImage()">🖼️ สร้างภาพสรุปดวง (PNG)</button>'

text = text.replace(old_btn, new_btn)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Added downloadSummaryImage button back')
