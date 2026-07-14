import re
import os

# 1. Extract generateAstrologicalDailyFortune from adminPdfGenerator.js
with open('adminPdfGenerator.js', 'r', encoding='utf-8') as f:
    original = f.read()

# Find the function definition
func_match = re.search(r'function generateAstrologicalDailyFortune.*?return \{ wText, fText, lText \};\n\s*\}', original, flags=re.DOTALL)
if not func_match:
    print("Could not find generateAstrologicalDailyFortune")
else:
    func_code = func_match.group(0)
    
    # Prepend it to adminVipReport.js
    with open('adminVipReport.js', 'r', encoding='utf-8') as f:
        vip_js = f.read()
    
    if 'generateAstrologicalDailyFortune' not in vip_js:
        # Insert before generateVIPReport
        vip_js = vip_js.replace('function generateVIPReport()', func_code + '\n\nfunction generateVIPReport()')
        
        # Add changeMonth logic
        change_month_code = """
window.changeMonth = function(delta) {
    const monthInput = document.getElementById('vipTargetMonth');
    let targetDate = new Date();
    if (monthInput.value) {
        const parts = monthInput.value.split('-');
        targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    }
    targetDate.setMonth(targetDate.getMonth() + delta);
    monthInput.value = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
};
"""
        vip_js += change_month_code
        with open('adminVipReport.js', 'w', encoding='utf-8') as f:
            f.write(vip_js)
        print("Patched adminVipReport.js successfully.")
    else:
        print("adminVipReport.js already has generateAstrologicalDailyFortune")

# 2. Update HTML to add buttons
with open('adminVipReport.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_month_input = '<input type="month" id="vipTargetMonth">'
new_month_input = """<div style="display: flex; gap: 10px; align-items: center;">
                    <button type="button" onclick="changeMonth(-1)" style="padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); color: #FFDF73; border-radius: 8px; cursor: pointer; transition: 0.3s;"><i class="fas fa-chevron-left"></i></button>
                    <input type="month" id="vipTargetMonth" style="flex: 1; width: 100%;">
                    <button type="button" onclick="changeMonth(1)" style="padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); color: #FFDF73; border-radius: 8px; cursor: pointer; transition: 0.3s;"><i class="fas fa-chevron-right"></i></button>
                </div>"""

if old_month_input in html:
    html = html.replace(old_month_input, new_month_input)
    # Also add some hover effects for the buttons
    style_addition = """
        .form-group button:hover {
            background: rgba(212, 175, 55, 0.2) !important;
            border-color: #d4af37 !important;
        }
    """
    html = html.replace('</style>', style_addition + '</style>')
    with open('adminVipReport.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Patched adminVipReport.html successfully.")
else:
    print("Could not find the month input in HTML.")
