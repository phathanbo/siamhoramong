import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update font sizes
    content = content.replace('if (combinedLength > 150) { fontSize = 28; nameSize = 48; imgSize = 320; gap = 15; }', 'if (combinedLength > 150) { fontSize = 26; nameSize = 46; imgSize = 300; gap = 15; }')
    content = content.replace('if (combinedLength > 250) { fontSize = 24; lineH = 1.3; nameSize = 42; imgSize = 270; gap = 10; }', 'if (combinedLength > 250) { fontSize = 23; lineH = 1.3; nameSize = 40; imgSize = 280; gap = 12; }')
    content = content.replace('if (combinedLength > 350) { fontSize = 21; lineH = 1.2; nameSize = 36; imgSize = 230; gap = 5; }', 'if (combinedLength > 350) { fontSize = 20; lineH = 1.25; nameSize = 36; imgSize = 260; gap = 10; }')

    # 2. Update HTML
    old_html = """        <div class="tarot-content-wrapper" style="padding: ${gap}px 0;">
            <div class="tarot-header" style="margin-bottom: ${gap}px; font-size: 40px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:26px; color:#aaa;">${dateThai}</span></div>
            
            <div class="tarot-card-img" style="background-image: url('${cardImgUrl}'); height: ${imgSize}px; width: ${imgSize * 0.6}px; background-size: cover; margin-bottom: 0;">
            </div>
            
            <h2 style="font-size: ${nameSize}px; color: #fff; margin-bottom: ${gap}px; margin-top: ${gap}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5);">${card.name}</h2>
            
            <div class="tarot-meaning" style="font-size: ${fontSize}px; line-height: ${lineH}; max-width: 900px; padding: 0 40px;">
                "${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> ${card.future}
            </div>
            
            <div style="position: absolute; bottom: ${gap}px; font-size: 22px; color: rgba(255,255,255,0.4);">
                สยามโหรามงคล (Siamhora.com)
            </div>
        </div>"""
        
    old_html_carousel = old_html.replace("<div class=\"tarot-card-img\" style=\"background-image: url('${cardImgUrl}'); height: ${imgSize}px; width: ${imgSize * 0.6}px; background-size: cover; margin-bottom: 0;\">\n            </div>", 
        '<img src="${cardImgUrl}" class="tarot-card-img" style="height: ${imgSize}px; margin: 0 auto; display: block; border-radius: 10px; border: 2px solid #d4af37; margin-bottom: 0;" crossorigin="anonymous" />')
        
    new_html = """        <div class="tarot-content-wrapper" style="padding: ${gap + 10}px 0; height: auto; min-height: 100%; box-sizing: border-box; justify-content: center;">
            <div class="tarot-header" style="margin-bottom: ${gap}px; font-size: 36px;">ไพ่ยิปซีประจำวัน<br><span style="font-size:24px; color:#aaa;">${dateThai}</span></div>
            
            <div class="tarot-card-img" style="background-image: url('${cardImgUrl}'); height: ${imgSize}px; width: ${imgSize * 0.6}px; background-size: cover; margin: 0 auto; border-radius: 10px; border: 2px solid #d4af37;">
            </div>
            
            <h2 style="font-size: ${nameSize}px; color: #fff; margin-bottom: ${gap}px; margin-top: ${gap}px; font-weight: bold; text-shadow: 0 5px 15px rgba(0,0,0,0.5); text-align: center;">${card.name}</h2>
            
            <div class="tarot-meaning" style="font-size: ${fontSize}px; line-height: ${lineH}; max-width: 900px; padding: 0 40px; display: -webkit-box; -webkit-line-clamp: 7; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; text-align: center; width: 100%;">
                "${card.meaning}"<br><br>
                <span style="color: #d4af37;">คำแนะนำ:</span> ${card.future}
            </div>
            
            <div style="margin-top: ${gap + 15}px; font-size: 20px; color: rgba(255,255,255,0.4); text-align: center;">
                สยามโหรามงคล (Siamhora.com)
            </div>
        </div>"""
        
    new_html_carousel = new_html.replace("<div class=\"tarot-card-img\" style=\"background-image: url('${cardImgUrl}'); height: ${imgSize}px; width: ${imgSize * 0.6}px; background-size: cover; margin: 0 auto; border-radius: 10px; border: 2px solid #d4af37;\">\n            </div>", 
        '<img src="${cardImgUrl}" class="tarot-card-img" style="height: ${imgSize}px; margin: 0 auto; display: block; border-radius: 10px; border: 2px solid #d4af37; margin-bottom: 0;" crossorigin="anonymous" />')

    if old_html in content:
        content = content.replace(old_html, new_html)
        print(f'Fixed {filepath} pattern.')
    elif old_html_carousel in content:
        content = content.replace(old_html_carousel, new_html_carousel)
        print(f'Fixed {filepath} carousel pattern.')
    else:
        # regex fallback
        content = re.sub(r'<div class="tarot-content-wrapper.*?</div>\s+</div>', new_html, content, flags=re.DOTALL)
        print(f'Used regex fallback for {filepath}.')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('d:\\\\สยามโหรามงคล\\\\adminAutoPost.js')
fix_file('d:\\\\สยามโหรามงคล\\\\adminZodiacAutoCarousel.js')
