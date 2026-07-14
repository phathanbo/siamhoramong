import re
import os

with open('adminPdfGenerator.js', 'r', encoding='utf-8') as f:
    original = f.read()

# Find the function definition
func_match = re.search(r'function generateAstrologicalDailyFortune.*?return \{ wText, fText, lText \};\n\s*\}', original, flags=re.DOTALL)
if not func_match:
    print("Could not find generateAstrologicalDailyFortune")
else:
    func_code = func_match.group(0)
    
    with open('adminVipReport.js', 'r', encoding='utf-8') as f:
        vip_js = f.read()
    
    if 'function generateAstrologicalDailyFortune' not in vip_js:
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
        print("adminVipReport.js already has function generateAstrologicalDailyFortune")
