import re
with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

with open('scratch/generateDailyContent.js', 'r', encoding='utf-8') as f:
    new_func = f.read()

# Find the start and end of generateDailyContent
start_idx = text.find('function generateDailyContent() {')
if start_idx != -1:
    # Find the end by looking for copyGenResult()
    end_idx = text.find('function copyGenResult() {', start_idx)
    if end_idx != -1:
        new_text = text[:start_idx] + new_func + '\n\n' + text[end_idx:]
        with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Replaced generateDailyContent successfully")
    else:
        print("Could not find end of generateDailyContent")
else:
    print("Could not find start of generateDailyContent")
