import re
import os

with open('part1.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the open/close modal functions
content = re.sub(r'/\*\*\s*\n\s*\* เปิดหน้าต่างสร้างคอนเทนต์.*?\n\s*\*/\s*\nfunction openContentGeneratorModal\(\) \{.*?\n\}\n', '', content, flags=re.DOTALL)
content = re.sub(r'function closeContentGeneratorModal\(\) \{.*?\n\}\n', '', content, flags=re.DOTALL)

# 2. Update display logic in generateDailyContent
old_display = "document.getElementById('genResultContainer').style.display = 'block';"
new_display = """document.getElementById('genResultContainer').style.display = 'flex';
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.style.display = 'none';"""
content = content.replace(old_display, new_display)

# 3. Fix the contentDate bug
content = content.replace("'contentDate'", "'genDate'")

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Recovered and patched adminContentGenerator.js successfully.")
