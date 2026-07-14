import re

with open('adminVipReport.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the THAI_PROVINCES array and the population of provSelect
text = re.sub(r'const THAI_PROVINCES = \[.*?\];', '', text, flags=re.DOTALL)
text = re.sub(r'const provSelect = document\.getElementById\(\'vipProvince\'\);.*?\}\);', '', text, flags=re.DOTALL)

# 2. In autoFillVipMember, replace 'vipProvince' with 'vipLocation'
text = text.replace("document.getElementById('vipProvince').value = m.province;", "document.getElementById('vipLocation').value = m.province || m.location || '';")

with open('adminVipReport.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated adminVipReport.js")
