
filename = "index.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Add fortune-daily.js
if '<script src="fortune-daily.js"></script>' not in content:
    content = content.replace('<script src="fortune-daily-data.js"></script>', 
                              '<script src="fortune-daily-data.js"></script>\n    <script src="fortune-daily.js"></script>')

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

