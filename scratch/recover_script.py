import re

log_path = r'C:\Users\PHATHANBO\.gemini\antigravity\brain\24aea172-90a3-439f-8d5e-bffd3a2d7d34\.system_generated\logs\transcript_full.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    text = f.read()

import json
largest = ''

for line in text.split('\n'):
    if 'adminContentGenerator.js' not in line:
        continue
    try:
        data = json.loads(line)
        def search_strings(obj):
            res = []
            if isinstance(obj, dict):
                for v in obj.values():
                    res.extend(search_strings(v))
            elif isinstance(obj, list):
                for item in obj:
                    res.extend(search_strings(item))
            elif isinstance(obj, str):
                res.append(obj)
            return res
        
        for s in search_strings(data):
            if 'function openContentGeneratorModal' in s and 'html2canvas' in s:
                # Must be a substantial chunk
                if len(s) > len(largest) and not s.startswith('Created At:'):
                    # Also don't pick up the error messages or short snippets
                    if len(s) > 10000:
                        largest = s
    except Exception as e:
        pass

# Also look for python script creation
import ast
matches = re.finditer(r'with open\([\'"]adminContentGenerator\.js[\'"], [\'"]w[\'"]\).*?f\.write\(([\'"]{3})(.*?)\1\)', text, re.DOTALL)
for match in matches:
    if len(match.group(2)) > len(largest):
        largest = match.group(2)

if largest:
    with open('adminContentGenerator_recovered.js', 'w', encoding='utf-8') as f:
        f.write(largest)
    print(f'Recovered file size: {len(largest)}')
else:
    print('Failed to find full file')
