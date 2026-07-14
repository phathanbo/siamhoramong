with open('adminQuickTools.html', 'r', encoding='utf-8') as f:
    text = f.read()

deps = """
    <!-- Data & Utilities -->
    <script src="utils-helpers.js"></script>
    <script src="thai-astrology-data.js"></script>
    <script src="thai-astrology-calculator.js"></script>
    <script src="AuspiciousDays.js"></script>
    <script src="colors.js"></script>
    <script src="namesdb.js"></script>
    <script src="namesdb-female-addon.js"></script>
    <script src="namesdb-special-addon.js"></script>
    <script src="namesdb-extended.js"></script>
    <script src="utils-auspicious.js"></script>
"""

# Replace the existing Data & Utilities block
import re
text = re.sub(r'<!-- Data & Utilities -->.*?<!-- Modals Logic -->', deps + '\n    <!-- Modals Logic -->', text, flags=re.DOTALL)

with open('adminQuickTools.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed dependencies')
