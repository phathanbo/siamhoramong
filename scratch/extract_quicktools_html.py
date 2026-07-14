import re

# 1. Revert index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

index_html = re.sub(r'<section id="adminQuickToolsSection".*?</section>', '', index_html, flags=re.DOTALL)
index_html = index_html.replace('<script src="adminQuickTools.js"></script>\n    ', '')
index_html = index_html.replace('<script src="adminQuickTools.js"></script>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

# 2. Update adminDashboard.js to link to the new HTML file
with open('adminDashboard.js', 'r', encoding='utf-8') as f:
    dash_js = f.read()

dash_js = dash_js.replace("navigateTo('adminQuickToolsSection')", "window.location.href='adminQuickTools.html'")

with open('adminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(dash_js)

# 3. Create adminQuickTools.html
quick_html = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ศูนย์รวมเครื่องมือแอดมิน - สยามโหรามงคล</title>
    
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        body { font-family: 'Sarabun', sans-serif; background-color: #121212; color: #fff; padding-top: 50px; }
    </style>
</head>
<body>
    <div class="container mt-4" id="adminQuickToolsContainer">
        <!-- Rendered by adminQuickTools.js -->
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    
    <!-- Data & Utilities -->
    <script src="utils-helpers.js"></script>
    <script src="thai-astrology-data.js"></script>
    
    <!-- Modals Logic -->
    <script src="adminContentGenerator.js"></script>
    <script src="adminCarouselFortune.js"></script>
    <script src="adminTarotFortune.js"></script>
    <script src="adminWeeklyFortune.js"></script>
    <script src="adminPdfGenerator.js"></script>
    
    <!-- Page Logic -->
    <script src="adminQuickTools.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            initAdminQuickTools();
            // Override the return button to go back to index
            setTimeout(() => {
                const btn = document.querySelector('button[onclick="navigateTo(\\'adminDashboard\\')"]');
                if (btn) {
                    btn.setAttribute('onclick', "window.location.href='index.html#adminDashboard'");
                }
            }, 100);
        });
    </script>
</body>
</html>
"""

with open('adminQuickTools.html', 'w', encoding='utf-8') as f:
    f.write(quick_html)

print('Separated adminQuickTools into a standalone page.')
