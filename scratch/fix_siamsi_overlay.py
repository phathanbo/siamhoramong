
# -*- coding: utf-8 -*-
import re

html_file = "index.html"

with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# Find the siamsiResult div
match = re.search(r'(<!-- Siamsi Modal Overlay -->\s*<div id="siamsiResult".*?</div>\s*</div>\s*</div>)', html_content, flags=re.DOTALL)
if match:
    siamsi_result_html = match.group(1)
    
    # Remove it from its current position
    html_content = html_content.replace(siamsi_result_html, "")
    
    # Insert it right before </body>
    html_content = html_content.replace('</body>', siamsi_result_html + '\n</body>')
    
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Moved siamsiResult to body end.")
else:
    print("Could not find siamsiResult.")

