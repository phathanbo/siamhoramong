
import glob
import re

for filename in glob.glob("*.html"):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    
    # Replace google fonts link
    content = re.sub(
        r"family=Prompt:wght@[^&]+", 
        "family=Sarabun:wght@300;400;500;600;700", 
        content
    )
    
    # Replace Kanit font link
    content = re.sub(
        r"family=Kanit:wght@[^&]+", 
        "family=Sarabun:wght@300;400;500;600;700", 
        content
    )

    # Replace inline styles and css
    content = content.replace("'Prompt'", "'Sarabun'")
    content = content.replace("'Kanit'", "'Sarabun'")
    
    if content != original_content:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filename}")


