with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add section if not exists
if 'id="adminQuickToolsSection"' not in html:
    section_html = """
    <section id="adminQuickToolsSection" class="main-section" style="display: none;">
        <div id="adminQuickToolsContainer" class="container mt-4"></div>
    </section>
"""
    # Insert it before the end of body or near adminDashboard
    html = html.replace('<section id="adminDashboard"', section_html + '    <section id="adminDashboard"')
    
    # Add script tag
    html = html.replace('<script src="adminDashboard.js"></script>', '<script src="adminQuickTools.js"></script>\n    <script src="adminDashboard.js"></script>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated index.html')
