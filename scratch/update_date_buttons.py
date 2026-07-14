import re

with open('adminDailyContent.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the genDate input block
old_date_block = """            <div class="form-group">
                <label><i class="fas fa-calendar-alt"></i> เลือกวันที่ทำนาย:</label>
                <input type="date" id="genDate">
            </div>"""

new_date_block = """            <div class="form-group">
                <label><i class="fas fa-calendar-alt"></i> เลือกวันที่ทำนาย:</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button type="button" onclick="changeDate(-1)" style="padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); color: #FFDF73; border-radius: 8px; cursor: pointer; transition: 0.3s;"><i class="fas fa-chevron-left"></i></button>
                    <input type="date" id="genDate" style="flex: 1; width: 100%;">
                    <button type="button" onclick="changeDate(1)" style="padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); color: #FFDF73; border-radius: 8px; cursor: pointer; transition: 0.3s;"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>"""

html = html.replace(old_date_block, new_date_block)

# Add the changeDate function inside the script block at the bottom
script_addition = """
        function changeDate(delta) {
            const dateInput = document.getElementById('genDate');
            let d = dateInput.value ? new Date(dateInput.value) : new Date();
            d.setDate(d.getDate() + delta);
            dateInput.value = d.toISOString().split('T')[0];
            // Auto generate when date is changed via arrows
            if(document.getElementById('genResultContainer').style.display !== 'none') {
                generateDailyContent();
            }
        }
"""

html = html.replace("document.getElementById('genDate').value = new Date().toISOString().split('T')[0];", 
                    "document.getElementById('genDate').value = new Date().toISOString().split('T')[0];\n" + script_addition)


with open('adminDailyContent.html', 'w', encoding='utf-8') as f:
    f.write(html)
