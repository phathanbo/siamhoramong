
filename = "index.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Add adminDashboard section after mainContent
if 'id="adminDashboard"' not in content:
    content = content.replace('<section id="mainContent" class="main-section">', 
                              '<section id="adminDashboard" class="main-section" style="display: none;">\n        <div id="adminDashboardContainer" class="container mt-4"></div>\n    </section>\n    <section id="mainContent" class="main-section">')

# Fix duplicate script tags
content = content.replace('<script src="adminDashboard.js"></script>\n    <script src="adminCarouselFortune.js"></script>\n    <script src="adminTarotFortune.js"></script>\n    <script src="adminWeeklyFortune.js"></script>\n\n    <script src="adminDashboard.js"></script>\n    <script src="adminCarouselFortune.js"></script>\n    <script src="adminTarotFortune.js"></script>\n    <script src="adminWeeklyFortune.js"></script>', 
                          '<script src="adminDashboard.js"></script>\n    <script src="adminCarouselFortune.js"></script>\n    <script src="adminTarotFortune.js"></script>\n    <script src="adminWeeklyFortune.js"></script>')

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

