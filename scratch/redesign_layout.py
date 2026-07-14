import re

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the new container HTML for isDay
new_html = '''        container.innerHTML = `
        <div id="exportSummary" style="background: #fdfaf6; width: 1400px; height: 820px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; box-sizing: border-box;">
            <!-- Background Ornaments -->
            <div style="position: absolute; top: -100px; left: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, #f7e6a1 0%, transparent 70%); opacity: 0.5;"></div>
            <div style="position: absolute; bottom: -200px; right: -200px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, #f7e6a1 0%, transparent 70%); opacity: 0.5;"></div>
            
            <!-- Logo Icon -->
            <div style="position: absolute; top: 35px; left: 40px; width: 80px; height: 80px; background: #2c3e50; border-radius: 50%; display:flex; align-items:center; justify-content:center; border: 4px solid #d4af37; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 40px;">
                ⭐
            </div>
            <div style="position: absolute; bottom: 20px; right: 40px; font-size: 22px; color: #555; font-weight: bold;">
                🌐 สยามโหรามงคล
            </div>
            
            <!-- Header -->
            <div style="text-align: center; padding-top: 40px; padding-left: 120px; padding-right: 40px;">
                <h1 style="color: #111; font-size: 46px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.5px;">${titlePrefix} เจาะลึกดวงรายวันประจำ${window.lastGeneratedDateStr}</h1>
                <p style="color: #555; font-size: 22px; margin: 0; line-height: 1.5;">สรุปคำทำนายดวงรายวัน ${subHeaderKala} โดยครอบคลุมทั้ง 7 วันเกิด<br>เน้นประเด็นสำคัญด้านการงาน การเงิน ความรัก และข้อควรระวังพิเศษสำหรับบางกลุ่ม</p>
            </div>
            
            <!-- Main Grid -->
            <div style="display: grid; grid-template-columns: 1fr 0.8fr; gap: 40px; margin-top: 35px; padding: 0 50px;">
                
                <!-- Left Column -->
                <div style="position: relative;">
                    <h2 style="text-align: center; font-size: 28px; font-weight: 800; color: #222; margin-bottom: 20px;">✨ ไฮไลต์ดวงชะตาประจำวันเกิด</h2>
                    
                    <!-- Card 1 -->
                    <div style="display: flex; align-items: center; margin-bottom: 20px; background: #ffffff; padding: 18px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;">
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #302b63, #24243e); border: 3px solid #d4af37; display: flex; justify-content: center; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); flex-shrink: 0; font-size: 55px;">
                            📈
                        </div>
                        <div style="margin-left: 25px;">
                            <div style="font-size: 26px; font-weight: 800; color: #333; margin-bottom: 5px;">กลุ่มดวงรุ่งพุ่งแรง <span style="font-size: 22px; color: #666; font-weight: normal;">(${txtOut})</span></div>
                            <div style="font-size: 19px; color: #555; line-height: 1.4;">👑มีเกณฑ์ได้รับข่าวดีเรื่องงาน โปรเจกต์สำเร็จเกินคาด หรือผู้ใหญ่ให้การสนับสนุน</div>
                        </div>
                    </div>
                    
                    <!-- Card 2 -->
                    <div style="display: flex; align-items: center; margin-bottom: 20px; background: #ffffff; padding: 18px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;">
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #56ab2f, #a8e063); border: 3px solid #d4af37; display: flex; justify-content: center; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); flex-shrink: 0; font-size: 55px;">
                            🪙
                        </div>
                        <div style="margin-left: 25px;">
                            <div style="font-size: 26px; font-weight: 800; color: #333; margin-bottom: 5px;">กลุ่มโชคลาภเด่น <span style="font-size: 22px; color: #666; font-weight: normal;">(${txtWealth})</span></div>
                            <div style="font-size: 19px; color: #555; line-height: 1.4;">💵มีเกณฑ์ได้โชคลาภลอยแบบไม่คาดฝัน หรือได้รับเงินคืนจากลูกหนี้</div>
                        </div>
                    </div>
                    
                    <!-- Card 3 -->
                    <div style="display: flex; align-items: center; background: #ffffff; padding: 18px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;">
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #cb2d3e, #ef473a); border: 3px solid #d4af37; display: flex; justify-content: center; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); flex-shrink: 0; font-size: 55px;">
                            🛡️
                        </div>
                        <div style="margin-left: 25px;">
                            <div style="font-size: 26px; font-weight: 800; color: #333; margin-bottom: 5px;">ข้อควรระวังพิเศษตามเกณฑ์ชะตา</div>
                            <div style="font-size: 19px; color: #555; line-height: 1.4; display: flex; flex-direction: column; gap: 5px;">
                                <div>🌧️<span style="font-weight:bold;">${warningDays[0] !== undefined ? (ADMIN_CONTENT_DAYS_LIST[warningDays[0]]) : '-'}</span> (ระวังอารมณ์หงุดหงิด)</div>
                                ${warningDays.length > 1 ? `<div>⚠️<span style="font-weight:bold;">${warningDays.slice(1).map(d=>ADMIN_CONTENT_DAYS_LIST[d]).join('/')}</span> (ระวังการสื่อสารผิดพลาด)</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Divider -->
                    <div style="position: absolute; right: -20px; top: 10%; height: 80%; width: 2px; background: linear-gradient(to bottom, transparent, #d4af37, transparent);"></div>
                </div>
                
                <!-- Right Column -->
                <div style="display: flex; flex-direction: column;">
                    <h2 style="text-align: center; font-size: 28px; font-weight: 800; color: #222; margin-bottom: 20px;">🎯 ตารางมงคลเสริมดวง (Lucky Tips)</h2>
                    
                    <!-- Lucky Tip 1 -->
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #f39c12, #e67e22); border: 3px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; flex-shrink: 0; font-size: 50px; z-index: 2;">☀️</div>
                        <div style="margin-left: -20px; background: #fff; border: 2px solid #f39c12; border-radius: 50px; padding: 15px 20px 15px 35px; flex: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                            <div style="font-size: 22px; font-weight: 800; color: #333; margin-bottom: 5px;">${t1.label}</div>
                            <div style="font-size: 34px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 5px;">${t1.nums}</div>
                            <div style="display: flex; justify-content: center; margin-top: 5px;">${t1.colors}</div>
                        </div>
                    </div>
                    
                    <!-- Lucky Tip 2 -->
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #e74c3c, #c0392b); border: 3px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; flex-shrink: 0; font-size: 50px; z-index: 2;">🔥</div>
                        <div style="margin-left: -20px; background: #fff; border: 2px solid #e74c3c; border-radius: 50px; padding: 15px 20px 15px 35px; flex: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                            <div style="font-size: 22px; font-weight: 800; color: #333; margin-bottom: 5px;">${t2.label}</div>
                            <div style="font-size: 34px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 5px;">${t2.nums}</div>
                            <div style="display: flex; justify-content: center; margin-top: 5px;">${t2.colors}</div>
                        </div>
                    </div>
                    
                    <!-- Lucky Tip 3 -->
                    <div style="display: flex; align-items: center;">
                        <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #8e44ad, #9b59b6); border: 3px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; flex-shrink: 0; font-size: 50px; z-index: 2;">🌳</div>
                        <div style="margin-left: -20px; background: #fff; border: 2px solid #8e44ad; border-radius: 50px; padding: 15px 20px 15px 35px; flex: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                            <div style="font-size: 22px; font-weight: 800; color: #333; margin-bottom: 5px;">${t3.label}</div>
                            <div style="font-size: 34px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 5px;">${t3.nums}</div>
                            <div style="display: flex; justify-content: center; margin-top: 5px;">${t3.colors}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div style="text-align: right; padding-right: 50px; padding-top: 20px; color: #777; font-size: 15px;">
                ใช้สำหรับเลือกเครื่องแต่งกายหรือตัวเลขสำคัญเพื่อเสริมสิริมงคลตามวันเกิด
            </div>
        </div>
        `;'''

# Using regex to find the start of container.innerHTML = ` and the closing `; } else {
start_idx = text.find('container.innerHTML = `')
if start_idx != -1:
    end_idx = text.find('        `;\n    } else {', start_idx)
    if end_idx != -1:
        end_idx += len('        `;')
        
        # Replace
        new_content = text[:start_idx] + new_html + text[end_idx:]
        
        with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Replaced isDay layout!")
    else:
        print("End tag not found!")
else:
    print("Start tag not found!")

