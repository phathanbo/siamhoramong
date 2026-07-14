import re
import os

# 1. Update adminContentGenerator.js
with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the open/close modal functions
content = re.sub(r'/\*\*\s*\n\s*\* เปิดหน้าต่างสร้างคอนเทนต์.*?\n\s*\*/\s*\nfunction openContentGeneratorModal\(\) \{.*?\n\}\n', '', content, flags=re.DOTALL)
content = re.sub(r'function closeContentGeneratorModal\(\) \{.*?\n\}\n', '', content, flags=re.DOTALL)

# Update display logic in generateDailyContent
old_display = "document.getElementById('genResultContainer').style.display = 'block';"
new_display = """document.getElementById('genResultContainer').style.display = 'flex';
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.style.display = 'none';"""
content = content.replace(old_display, new_display)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(content)


# 2. Update adminQuickTools.js
with open('adminQuickTools.js', 'r', encoding='utf-8') as f:
    quicktools = f.read()

quicktools = quicktools.replace('onclick="openContentGeneratorModal()"', 'onclick="window.location.href=\'adminDailyContent.html\'"')

with open('adminQuickTools.js', 'w', encoding='utf-8') as f:
    f.write(quicktools)

print("Updates applied successfully.")
