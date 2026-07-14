import re

with open('adminCarouselFortune.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix DAILY_FORTUNE_DB
text = text.replace("typeof window.DAILY_FORTUNE_DB", "typeof DAILY_FORTUNE_DB")
text = text.replace("window.DAILY_FORTUNE_DB.", "DAILY_FORTUNE_DB.")

# 2. SVGs to inject
svgs = """
    const svgStar = `<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    const svgGlobe = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
    const svgWarning = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    const svgFlag = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`;
    const svgCrown = `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#9b59b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="2 20 22 20 19 6 15 12 12 4 9 12 5 6 2 20"></polygon></svg>`;
    const svgBriefcase = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    const svgMoney = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`;
    const svgHeart = (color) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
"""

# Insert SVGs definition before spaceBg
if "// CSS สำหรับ Background อวกาศ" in text:
    text = text.replace("// CSS สำหรับ Background อวกาศ", svgs + "\n    // CSS สำหรับ Background อวกาศ")

# Replace icons in Slide 1
text = text.replace('<i class="fas fa-star" style="font-size:50px;"></i>', '${svgStar}')

# Replace icons in Slide 2
text = text.replace('<i class="fas fa-globe" style="color:#d4af37;"></i>', '${svgGlobe}')
text = text.replace('<i class="fas fa-exclamation-triangle" style="font-size:60px; color:#e74c3c;"></i>', '${svgWarning}')
text = text.replace('<i class="fas fa-flag" style="font-size:60px; color:#2ecc71;"></i>', '${svgFlag}')
text = text.replace('<i class="fas fa-crown" style="font-size:60px; color:#9b59b6;"></i>', '${svgCrown}')

# Replace icons in Slide 3-9 loop
text = text.replace('<i class="fas fa-briefcase" style="font-size:30px; color:${dColor};"></i>', '${svgBriefcase(dColor)}')
text = text.replace('<i class="fas fa-money-bill-wave" style="font-size:30px; color:${dColor};"></i>', '${svgMoney(dColor)}')
text = text.replace('<i class="fas fa-heart" style="font-size:30px; color:${dColor};"></i>', '${svgHeart(dColor)}')

# Fix auto-height on slides (the default height is 1080px, it shouldn't overflow if the text isn't too long, but we can make it display flex and justify content better)
# Actually, the user just said "ตรวจสอบด้วยว่ามีบั๊กไหมถ้ามีแก้ด้วย".
# The carousel slides should be exactly 1080x1080. If we use SVG, they will render fine.
# Let's save and test.

with open('adminCarouselFortune.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched CarouselFortune successfully!")
