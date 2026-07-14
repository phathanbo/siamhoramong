import re

with open('adminDashboard.js', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<!-- เครื่องมือแอดมิน -->.*?<div class="dashboard-tools"[^>]*>.*?</div>'
replacement = '''<!-- เครื่องมือแอดมิน -->
            <div class="section-title mt-4" style="text-align: left; margin-bottom: 15px;">🛠️ เครื่องมือด่วน (Quick Tools)</div>
            <div class="dashboard-tools" style="display: grid; grid-template-columns: 1fr; margin-bottom: 30px;">
                <button class="btn btn-gold shadow" onclick="navigateTo('adminQuickToolsSection')" style="font-size: 1.2rem; padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 15px; border: none;">
                    <i class="fas fa-tools" style="font-size: 2rem;"></i> 
                    <span style="font-weight: bold;">ไปยังหน้าศูนย์รวมเครื่องมือแอดมิน (Quick Tools) ➡️</span>
                </button>
            </div>'''
new_text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('adminDashboard.js', 'w', encoding='utf-8') as f:
    f.write(new_text)
print('Updated adminDashboard.js')
