with open('adminQuickTools.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('onclick="openWeeklyFortuneModal()"', 'onclick="openWeeklyFortuneModal_impl()"')

with open('adminQuickTools.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed onclick for openWeeklyFortuneModal')
