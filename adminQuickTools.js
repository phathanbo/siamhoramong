document.addEventListener('DOMContentLoaded', () => {
    // We can initialize it when the page loads or when navigateTo is called
});

function initAdminQuickTools() {
    const container = document.getElementById('adminQuickToolsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-panel shadow" style="background: #111; padding: 30px; border-radius: 15px; border: 1px solid #d4af37; color: white;">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 style="color: #d4af37; margin: 0;"><i class="fas fa-tools mr-2"></i> ศูนย์รวมเครื่องมือแอดมิน (Quick Tools)</h2>
            </div>
            
            <p style="color: #aaa; margin-bottom: 30px; font-size: 1.1rem;">เลือกเครื่องมือที่ต้องการใช้งานเพื่อสร้างคอนเทนต์หรือรายงานได้อย่างรวดเร็ว</p>

            <div class="dashboard-tools" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <!-- สร้างคำทำนายรายวัน -->
                <button class="btn btn-gold shadow" onclick="window.location.href='adminDailyContent.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #f1c40f, #d4af37); color: #111; border: none; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-star-and-crescent" style="font-size: 3.5rem; color: #111;"></i> 
                    <span style="font-weight: bold; line-height: 1.3;">สร้างคำทำนายรายวัน<br><small style="font-weight: normal; font-size: 0.95rem; color: #333;">(โพสต์ + ภาพสรุป 1080px)</small></span>
                </button>
                
                <!-- สร้างรายงาน PDF -->
                <button class="btn btn-primary shadow" onclick="window.location.href='adminVipReport.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-file-pdf" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">สร้างรายงาน<br>PDF (VIP)</span>
                </button>
                
                <!-- ดวงรายวัน (แผ่นเดียว) -->
                <button class="btn btn-warning shadow" onclick="openWeeklyFortuneModal_impl()" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; border: none; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-image" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพดวงรายวัน<br>(แผ่นเดียว)</span>
                </button>
                
                <!-- ดวงรายวัน (อัลบั้ม) -->
                <button class="btn btn-dark shadow" onclick="openCarouselFortuneModal()" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #2c3e50, #000000); color: #d4af37; border: 1px solid #d4af37; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-images" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพดวงรายวัน<br>(แบบอัลบั้ม)</span>
                </button>
                
                <!-- ไพ่ยิปซี (1 ใบ) -->
                <button class="btn btn-dark shadow" onclick="openTarotFortuneModal()" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #4b134f, #c94b4b); color: #fff; border: 1px solid #c94b4b; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-clone" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพไพ่ยิปซี<br>(รายวัน 1 ใบ)</span>
                </button>
                
                <!-- ไพ่ยิปซี (3 ใบ) - Navigate to external page -->
                <button class="btn btn-dark shadow" onclick="window.location.href='adminTarotReading.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #141e30, #243b55); color: #fff; border: 1px solid #243b55; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-layer-group" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ทำนายไพ่ยิปซี<br>(3 ใบ)</span>
                </button>
                
                <!-- วอลเปเปอร์สายมู - Navigate to external page -->
                <button class="btn btn-dark shadow" onclick="window.location.href='adminWallpaperGen.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #11998e, #38ef7d); color: #fff; border: 1px solid #38ef7d; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-mobile-alt" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">วอลเปเปอร์สายมู<br>(เครื่องราง)</span>
                </button>
                
                <!-- ดวง 12 ราศี (ภาพรวม) -->
                <button class="btn shadow" onclick="window.open('adminZodiacDaily.html', '_blank')" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #4b1a75, #1a0831); color: #f9d976; border: 1px solid #e9b64c; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-th-large" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพดวง 12 ราศี<br>(แผ่นรวม)</span>
                </button>
                
                <!-- ดวง 12 ราศี (แยกแผ่น) -->
                <button class="btn shadow" onclick="window.open('adminZodiacSingle.html', '_blank')" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #6a1b9a, #38006b); color: #f9d976; border: 1px solid #f9d976; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-th-list" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพดวง 12 ราศี<br>(แยกแผ่น)</span>
                </button>
                
                <!-- ไพ่ป๊อกทำนายดวง -->
                <button class="btn shadow" onclick="window.location.href='adminCartomancy.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #a61b1b, #590909); color: #fff; border: 1px solid #ff4d4d; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-heart" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">ภาพไพ่ป๊อก<br>(1 ใบ / 3 ใบ)</span>
                </button>
                
                <!-- สร้างโพสต์ Facebook -->
                <button class="btn shadow" onclick="window.location.href='adminFacebookPost.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #1877f2, #0c438c); color: #fff; border: 1px solid #1877f2; height: 100%; transition: transform 0.2s;">
                    <i class="fa-brands fa-facebook" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">สร้างโพสต์ Facebook<br><small style="font-weight: normal; font-size: 0.95rem; color: #ddd;">(พิมพ์ข้อความเอง)</small></span>
                </button>
                
                <!-- สร้างภาพดวงอัตโนมัติ -->
                <button class="btn shadow" onclick="window.location.href='adminAutoPost.html'" style="font-size: 1.2rem; padding: 30px 20px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(135deg, #ff9a9e, #fecfef); color: #111; border: 1px solid #ff9a9e; height: 100%; transition: transform 0.2s;">
                    <i class="fas fa-magic" style="font-size: 3.5rem;"></i> 
                    <span style="font-weight: bold;">สร้างภาพดวงอัตโนมัติ<br><small style="font-weight: normal; font-size: 0.95rem; color: #555;">(ดึงจากฐานข้อมูลจริง)</small></span>
                </button>
            </div>
            
            <style>
                #adminQuickToolsContainer button:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important;
                }
            </style>
        </div>
    `;
}

// Ensure init is called when navigating
const originalNavigateTo = window.navigateTo;
if (typeof originalNavigateTo === 'function') {
    window.navigateTo = function(sectionId) {
        if (sectionId === 'adminQuickToolsSection') {
            initAdminQuickTools();
        }
        originalNavigateTo(sectionId);
    };
} else {
    // If navigateTo isn't fully defined yet, we'll hook into it later or let script.js handle it
    document.addEventListener('DOMContentLoaded', () => {
        const _nav = window.navigateTo;
        window.navigateTo = function(sectionId) {
            if (sectionId === 'adminQuickToolsSection') {
                initAdminQuickTools();
            }
            if (_nav) _nav(sectionId);
        };
    });
}
