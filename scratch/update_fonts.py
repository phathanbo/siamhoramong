import re

with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace all common font families with Sarabun
css = css.replace("'Kanit'", "'Sarabun'")
css = css.replace("'Prompt'", "'Sarabun'")
css = css.replace("'Times New Roman'", "'Sarabun'")
css = css.replace("'Cinzel Decorative'", "'Sarabun'")

# Make sure body uses Sarabun
css = re.sub(r"font-family:\s*.*?sans-serif;", "font-family: 'Sarabun', sans-serif;", css)

with open("style.css", "w", encoding="utf-8") as f:
    f.write(css)

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Update Google Fonts links in index.html
html = re.sub(
    r"family=Prompt:wght@[^&]+", 
    "family=Sarabun:wght@300;400;500;600;700", 
    html
)

html = html.replace("'Prompt'", "'Sarabun'")
html = html.replace("'Kanit'", "'Sarabun'")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Fonts updated successfully.")
