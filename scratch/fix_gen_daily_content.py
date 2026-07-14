import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the end of generateDailyContent
old_code = """    const resContainer = document.getElementById('genResultContainer');
    const resText = document.getElementById('genResultText');
    
    resText.value = outputText;
    resContainer.style.display = "block";
}"""

new_code = """    const resContainer = document.getElementById('genResultContainer');
    const resText = document.getElementById('genResultText');
    
    resText.value = outputText;
    resContainer.style.display = "flex";
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
    
    window.lastGeneratedCards = cards;
}"""

text = text.replace(old_code, new_code)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed end of generateDailyContent')
