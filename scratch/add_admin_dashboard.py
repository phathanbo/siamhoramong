
import re

filename = "index.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# Add adminDashboard section if not exists
if "id=\"adminDashboard\"" not in content:
    section_html = """
    <!-- Admin Dashboard Section -->
    <section id="adminDashboard" class="page-section" style="display: none;">
        <div id="adminDashboardContainer" class="container mt-4"></div>
    </section>
"""
    # Insert before <section id="resultSection"
    content = content.replace('<section id="resultSection"', section_html + '\n    <section id="resultSection"')

# Add admin scripts if not exist
if "adminDashboard.js" not in content:
    script_html = """
    <script src="adminDashboard.js"></script>
    <script src="adminCarouselFortune.js"></script>
    <script src="adminTarotFortune.js"></script>
    <script src="adminWeeklyFortune.js"></script>
"""
    # Insert before <script src="script.js">
    content = content.replace('<script src="script.js"></script>', script_html + '\n    <script src="script.js"></script>')

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

