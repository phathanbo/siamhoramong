import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    full_code = f.read()

with open('scratch/generateDailyContent.js', 'r', encoding='utf-8') as f:
    new_func = f.read()

# Apply the UI fixes to new_func
new_func = new_func.replace(
    'resContainer.style.display = "block";',
    '''resContainer.style.display = "flex";
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.style.display = 'none';'''
)

# Extract the body of generateDailyContent from full_code
# Since we know the file structure: it starts with DBs, then generateDailyContent(), then copyGenResult(), downloadSummaryImage()
# We can just replace everything from "function generateDailyContent() {" up to "function copyGenResult() {"

pattern = r'function generateDailyContent\(\) \{.*?\}\n\nfunction copyGenResult\(\) \{'
replacement = new_func + '\n\nfunction copyGenResult() {'

updated_code = re.sub(pattern, replacement, full_code, flags=re.DOTALL)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(updated_code)

print("Replaced generateDailyContent with the updated version that builds the cards array.")
