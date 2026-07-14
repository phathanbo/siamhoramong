import re

targets = [
    'fengshuiResult', 'lottoResultpage', 'tarotResult', 'siamsiResult', 
    'thaksaResult', 'patient-result-display', 'soulmate-result-display', 
    'fortune-result-display', 'lunarResult', 'resultDisplay', 
    'dynamicResultArea', 'marriage-result-box', 'kaliyoke-resultArea', 
    'businessResult', 'openingResult', 'ceremonyResult', 'astrologyResult'
]

with open('index.html', 'r', encoding='utf-8') as f:
    new_content = f.read()

for t in targets:
    pattern1 = f'id=\"{t}\" class=\"'
    if pattern1 in new_content:
        new_content = new_content.replace(pattern1, f'id=\"{t}\" class=\"exportable-result ')
    else:
        pattern2 = f'id=\"{t}\"'
        new_content = new_content.replace(pattern2, f'id=\"{t}\" class=\"exportable-result\"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done')
