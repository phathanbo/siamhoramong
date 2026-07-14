with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'adminPdfGenerator.js' not in html:
    html = html.replace('<script src="adminWeeklyFortune.js"></script>', '<script src="adminWeeklyFortune.js"></script>\n    <script src="adminPdfGenerator.js"></script>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Added adminPdfGenerator.js to index.html')
else:
    print('Already exists')
