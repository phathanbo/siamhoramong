
filename = "taksasattalek.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Revert my bad replacements
content = content.replace("#e0e0e0", "#2c3e50")
content = content.replace("#aaaaaa", "#7f8c8d")

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

