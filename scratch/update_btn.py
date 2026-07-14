import re

with open('adminQuickTools.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the Facebook button with the newly clarified Daily Fortune button
old_btn = '''<!-- สร้างโพสต์ Facebook -->
                <button class="btn btn-gold shadow" onclick="openContentGeneratorModal()" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; border: none; height: 100%; transition: transform 0.2s;">
                    <i class="fab fa-facebook-square" style="font-size: 3.5rem; color: #1877F2;"></i> 
                    <span style="font-weight: bold;">สร้างโพสต์ลง<br>Facebook</span>
                </button>'''

new_btn = '''<!-- สร้างคำทำนายรายวัน -->
                <button class="btn btn-gold shadow" onclick="openContentGeneratorModal()" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #f1c40f, #d4af37); color: #111; border: none; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-star-and-crescent" style="font-size: 3.5rem; color: #111;"></i> 
                    <span style="font-weight: bold; line-height: 1.3;">สร้างคำทำนายรายวัน<br><small style="font-weight: normal; font-size: 0.95rem; color: #333;">(โพสต์ + ภาพสรุป 1080px)</small></span>
                </button>'''

if old_btn in text:
    text = text.replace(old_btn, new_btn)
    with open('adminQuickTools.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced button successfully.")
else:
    print("Old button not found.")
