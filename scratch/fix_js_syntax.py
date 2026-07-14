import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the backslashes before backticks
content = content.replace(r'\`', '`')
# Same for any backslashes before ${}
content = content.replace(r'\${', '${')

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Syntax errors fixed.")
