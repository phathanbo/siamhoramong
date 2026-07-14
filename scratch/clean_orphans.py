
# -*- coding: utf-8 -*-
import re

html_file = "index.html"

with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# The orphaned block to remove
orphaned_regex = r'\s*<div class="mt-4 pt-3" style="border-top: 1px solid #d4af37;">.*?<div id="siamsiImagePreviewContainer" class="text-center mt-3 d-flex justify-content-center" style="display: none !important;"></div>\s*</div>'

html_content = re.sub(orphaned_regex, "", html_content, flags=re.DOTALL)

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)
print("Cleaned up orphaned HTML.")

