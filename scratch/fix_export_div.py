with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert the canvasExportArea div inside the modal
old_html = 'document.body.insertAdjacentHTML(\'beforeend\', html);'
new_html = '''
    const exportDiv = '<div id="canvasExportArea" style="position: absolute; top: -9999px; left: -9999px; opacity: 0; pointer-events: none;"></div>';
    document.body.insertAdjacentHTML('beforeend', html + exportDiv);
'''

text = text.replace(old_html, new_html)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Added canvasExportArea div back')
