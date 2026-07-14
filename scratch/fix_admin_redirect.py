
filename = "auth-enhanced-firebase-fixed.js"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Replace console.warn
content = content.replace(
    "console.warn('?? Admin Dashboard not loaded yet');",
    "console.warn('?? Admin Dashboard not loaded yet, redirecting to admin.html');\n            window.location.href = 'admin.html';"
)

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

