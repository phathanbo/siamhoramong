import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix DAYS_LIST bug
text = text.replace("typeof DAYS_LIST !== 'undefined' ? ADMIN_CONTENT_DAYS_LIST[d] : d", "ADMIN_CONTENT_DAYS_LIST[d]")
text = text.replace("typeof DAYS_LIST !== 'undefined' ? ADMIN_CONTENT_DAYS_LIST[warningDays[0]] : ''", "ADMIN_CONTENT_DAYS_LIST[warningDays[0]]")
text = text.replace("typeof DAYS_LIST !== 'undefined' ? ADMIN_CONTENT_DAYS_LIST[d]:d", "ADMIN_CONTENT_DAYS_LIST[d]")

# Replace FontAwesome icons with native Emojis for better html2canvas rendering
text = re.sub(r'<i class="fas fa-chart-line".*?></i>', '📈', text)
text = re.sub(r'<i class="fas fa-coins".*?></i>', '🪙', text)
text = re.sub(r'<i class="fas fa-shield-alt".*?></i>', '🛡️', text)
text = re.sub(r'<i class="fas fa-sun".*?></i>', '☀️', text)
text = re.sub(r'<i class="fas fa-fire".*?></i>', '🔥', text)
text = re.sub(r'<i class="fas fa-tree".*?></i>', '🌳', text)
text = re.sub(r'<i class="fas fa-crown.*?></i>', '👑', text)
text = re.sub(r'<i class="fas fa-money-bill-wave.*?></i>', '💵', text)
text = re.sub(r'<i class="fas fa-cloud-showers-heavy.*?></i>', '🌧️', text)
text = re.sub(r'<i class="fas fa-exclamation-triangle.*?></i>', '⚠️', text)
text = re.sub(r'<i class="fas fa-globe"></i>', '🌐', text)
text = re.sub(r'<i class="fas fa-star".*?></i>', '⭐', text)

with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Patched DAYS_LIST and icons")
