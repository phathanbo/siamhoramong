
# -*- coding: utf-8 -*-
filename = "index.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

target = '<div class="text-center mt-4 w-100" style="max-width: 450px; animation: slideUpFade 0.5s ease-out;">'
replacement = '<div class="text-center mt-4 w-100" style="max-width: 450px; animation: slideUpFade 0.5s ease-out;">\n                    <h4 class="text-white mb-3" style="text-shadow: 1px 1px 2px #000; font-weight: bold;">คุณได้ใบเซียมซีที่ <span id="previewNum"></span></h4>'

if target in content:
    content = content.replace(target, replacement)
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print("Added previewNum successfully.")
else:
    print("Target not found.")

