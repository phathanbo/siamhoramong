
import re

filename = "taksasattalek.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Replace hardcoded dark colors with lighter theme-appropriate colors
content = content.replace("#2c3e50", "#e0e0e0")  # Dark blue -> light gray
content = content.replace("#7f8c8d", "#aaaaaa")  # Gray -> lighter gray
content = content.replace("color:#2c3e50", "color:#e0e0e0")
content = content.replace("color:#7f8c8d", "color:#aaaaaa")
content = content.replace("color: #2c3e50", "color: #e0e0e0")
content = content.replace("color: #7f8c8d", "color: #aaaaaa")

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Updated {filename}")

