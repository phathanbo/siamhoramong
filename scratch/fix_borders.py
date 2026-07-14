import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

def fix_border(match):
    style = match.group(0)
    b_match = re.search(r'border:\s*(\d+)px\s+solid\s+([^;]+);', style)
    if b_match:
        px = b_match.group(1)
        color = b_match.group(2)
        style = re.sub(r'border:\s*\d+px\s+solid\s+[^;]+;', f'outline: {px}px solid {color}; outline-offset: -{px}px; border: none;', style)
    return style

text = re.sub(r'<div style="[^"]*border-radius:\s*50%[^"]*border:\s*\d+px[^"]*">', fix_border, text)
text = re.sub(r'<div style="[^"]*border-radius:\s*50px[^"]*border:\s*\d+px[^"]*">', fix_border, text)
text = re.sub(r'<div style="[^"]*border:\s*2px\s+solid\s+#D4AF37[^"]*border-radius:\s*20px[^"]*">', fix_border, text)

# Also fix the SVG issues by changing FontAwesome classes to literal base64/SVG images if needed
# Wait, let's just use the border fix first.

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed borders')
