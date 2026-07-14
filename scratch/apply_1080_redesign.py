import re

# SVGs
svg_star = '''<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'''
svg_trend = '''<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>'''
svg_award = '''<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>'''
svg_shield = '''<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'''

svg_sun = '''<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'''
svg_fire = '''<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19c-1.5 2-4.5 2-5.5 0-1-2-1.5-3.5-3.5-3.5s-3 1.5-3 3.5c0 2 2 3.5 2 3.5 1.5 1.5 4 1.5 6.5 0s3.5-3.5 3.5-7c0-2-1.5-3.5-3.5-4.5z"></path></svg>'''
svg_leaf = '''<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>'''

new_html = f'''        container.innerHTML = `
        <div id="exportSummary" style="background: #fdfaf6; width: 1080px; height: 1080px; position: relative; font-family: 'Sarabun', 'Prompt', sans-serif !important; overflow: hidden; box-sizing: border-box; padding: 40px;">
            <!-- Header Section -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eaeaea; padding-bottom: 20px;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <div style="width: 50px; height: 50px; background: #2c3e50; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        {svg_star}
                    </div>
                    <div style="font-size: 24px; color: #555; font-weight: bold;">สยามโหรามงคล</div>
                </div>
                <h1 style="color: #111; font-size: 42px; font-weight: 800; margin: 0 0 10px 0;">${{titlePrefix}} เจาะลึกดวงรายวัน</h1>
                <h2 style="color: #d4af37; font-size: 32px; font-weight: bold; margin: 0;">ประจำ${{window.lastGeneratedDateStr}}</h2>
                <p style="color: #666; font-size: 18px; margin: 15px 0 0 0; line-height: 1.5;">สรุปคำทำนายดวงรายวัน ${{subHeaderKala}} โดยครอบคลุมทั้ง 7 วันเกิด<br>เน้นประเด็นสำคัญด้านการงาน การเงิน ความรัก และข้อควรระวัง</p>
            </div>
            
            <!-- Main Grid -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px;">
                
                <!-- Left Column: Highlights -->
                <div>
                    <h3 style="font-size: 24px; font-weight: 800; color: #2c3e50; margin: 0 0 20px 0; border-left: 5px solid #d4af37; padding-left: 15px;">ไฮไลต์ดวงชะตา</h3>
                    
                    <!-- Card 1 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: #2c3e50; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                {svg_trend}
                            </div>
                            <div>
                                <div style="font-size: 22px; font-weight: bold; color: #333;">ดวงรุ่งพุ่งแรง</div>
                                <div style="font-size: 18px; color: #888;">${{txtOut}}</div>
                            </div>
                        </div>
                        <div style="font-size: 18px; color: #444; line-height: 1.5;">มีเกณฑ์ได้รับข่าวดีเรื่องงาน โปรเจกต์สำเร็จเกินคาด หรือผู้ใหญ่ให้การสนับสนุน</div>
                    </div>
                    
                    <!-- Card 2 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: #2c3e50; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                {svg_award}
                            </div>
                            <div>
                                <div style="font-size: 22px; font-weight: bold; color: #333;">โชคลาภเด่น</div>
                                <div style="font-size: 18px; color: #888;">${{txtWealth}}</div>
                            </div>
                        </div>
                        <div style="font-size: 18px; color: #444; line-height: 1.5;">มีเกณฑ์ได้โชคลาภลอยแบบไม่คาดฝัน หรือได้รับเงินคืนจากลูกหนี้</div>
                    </div>
                    
                    <!-- Card 3 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: #2c3e50; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                {svg_shield}
                            </div>
                            <div>
                                <div style="font-size: 22px; font-weight: bold; color: #333;">ข้อควรระวัง</div>
                            </div>
                        </div>
                        <div style="font-size: 18px; color: #444; line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
                            <div><span style="font-weight:bold; color: #c0392b;">${{warningDays[0] !== undefined ? (ADMIN_CONTENT_DAYS_LIST[warningDays[0]]) : '-'}}</span> (ระวังอารมณ์หงุดหงิด)</div>
                            ${{warningDays.length > 1 ? `<div><span style="font-weight:bold; color: #c0392b;">${{warningDays.slice(1).map(d=>ADMIN_CONTENT_DAYS_LIST[d]).join('/')}}</span> (ระวังการสื่อสารผิดพลาด)</div>` : ''}}
                        </div>
                    </div>
                </div>
                
                <!-- Right Column: Lucky Tips -->
                <div>
                    <h3 style="font-size: 24px; font-weight: 800; color: #2c3e50; margin: 0 0 20px 0; border-left: 5px solid #d4af37; padding-left: 15px;">ตารางมงคลเสริมดวง</h3>
                    
                    <!-- Tip 1 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: center;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: #fdfaf6; border: 2px solid #f39c12; margin-bottom: 10px;">
                            {svg_sun}
                        </div>
                        <div style="font-size: 20px; font-weight: bold; color: #555; margin-bottom: 5px;">${{t1.label}}</div>
                        <div style="font-size: 38px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 15px;">${{t1.nums}}</div>
                        <div style="display: flex; justify-content: center; flex-wrap: wrap;">${{t1.colors}}</div>
                    </div>
                    
                    <!-- Tip 2 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: center;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: #fdfaf6; border: 2px solid #e74c3c; margin-bottom: 10px;">
                            {svg_fire}
                        </div>
                        <div style="font-size: 20px; font-weight: bold; color: #555; margin-bottom: 5px;">${{t2.label}}</div>
                        <div style="font-size: 38px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 15px;">${{t2.nums}}</div>
                        <div style="display: flex; justify-content: center; flex-wrap: wrap;">${{t2.colors}}</div>
                    </div>
                    
                    <!-- Tip 3 -->
                    <div style="background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 20px; text-align: center;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: #fdfaf6; border: 2px solid #2ecc71; margin-bottom: 10px;">
                            {svg_leaf}
                        </div>
                        <div style="font-size: 20px; font-weight: bold; color: #555; margin-bottom: 5px;">${{t3.label}}</div>
                        <div style="font-size: 38px; font-weight: 900; color: #111; letter-spacing: 2px; margin-bottom: 15px;">${{t3.nums}}</div>
                        <div style="display: flex; justify-content: center; flex-wrap: wrap;">${{t3.colors}}</div>
                    </div>
                    
                </div>
            </div>
            
            <div style="position: absolute; bottom: 20px; right: 40px; color: #888; font-size: 16px;">
                ใช้สำหรับเลือกเครื่องแต่งกายหรือตัวเลขสำคัญเพื่อเสริมสิริมงคลตามวันเกิด
            </div>
        </div>
        `;'''

with open('adminContentGenerator.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('container.innerHTML = `')
if start_idx != -1:
    end_idx = text.find('        `;\n    } else {', start_idx)
    if end_idx != -1:
        end_idx += len('        `;')
        
        new_content = text[:start_idx] + new_html + text[end_idx:]
        
        with open('adminContentGenerator.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Replaced isDay layout with 1080x1080 SVG flat design!")
    else:
        print("End tag not found!")
else:
    print("Start tag not found!")

