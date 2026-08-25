document.addEventListener('DOMContentLoaded', () => {
    // We can initialize it when the page loads or when navigateTo is called
});

function initAdminQuickTools() {
    const container = document.getElementById('adminQuickToolsContainer');
    if (!container) return;

    const p = window.location.pathname.includes('/admin/') ? '' : 'admin/';

    container.innerHTML = `
        <div class="admin-glass-card">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="m-0 font-weight-bold" style="color: #FFF0A8;">
                    <i class="fas fa-tools mr-2 text-warning"></i> ศูนย์รวมเครื่องมือสร้างสื่อ & คอนเทนต์ (Quick Tools)
                </h4>
                <span class="badge px-3 py-2" style="background: rgba(241,208,110,0.2); color: #FFF0A8; border: 1px solid rgba(241,208,110,0.4); border-radius: 20px;">
                    เครื่องมือด่วน
                </span>
            </div>
            
            <p style="color: #CBD5E1; margin-bottom: 25px; font-size: 0.95rem;">เลือกเครื่องมือสร้างภาพกราฟิก ใบดวงชะตา รายงาน PDF และโพสต์โซเชียลมีเดียอัตโนมัติ</p>

            <div class="row g-3">
                
                <!-- 0. โต๊ะพยากรณ์ประจำสำนัก (Pro Studio) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}../pages/thai-horoscope-pro.html'"
                         style="background: linear-gradient(135deg, rgba(217,119,6,0.3) 0%, rgba(20,32,58,0.8) 100%); border: 2px solid rgba(251,191,36,0.6); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FDE047'; this.style.boxShadow='0 12px 25px rgba(251,191,36,0.3)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(251,191,36,0.6)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #FBBF24;"><i class="fas fa-dharmachakra"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FEF08A; font-size: 1rem;">🏛️ โต๊ะพยากรณ์สำนัก</div>
                            <small class="text-white-50">ผูกดวง 6 มิติ + Dossier</small>
                        </div>
                    </div>
                </div>

                <!-- 1. แผ่นดวงชะตา / ดวงส่วนบุคคล -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}../pages/profile.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(241,208,110,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FFF0A8'; this.style.boxShadow='0 12px 25px rgba(241,208,110,0.2)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(241,208,110,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F1D06E;"><i class="fas fa-id-card"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">แผ่นดวงชะตา</div>
                            <small class="text-white-50">ดวงชะตาส่วนบุคคล</small>
                        </div>
                    </div>
                </div>

                <!-- 2. สร้างคำทำนายรายวัน -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}daily-content.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(241,208,110,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FFF0A8'; this.style.boxShadow='0 12px 25px rgba(241,208,110,0.2)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(241,208,110,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F1D06E;"><i class="fas fa-star-and-crescent"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">คำทำนายรายวัน</div>
                            <small class="text-white-50">โพสต์ + ภาพสรุป 1080px</small>
                        </div>
                    </div>
                </div>

                <!-- 3. อินโฟกราฟิก ฟันธงดวงรายวัน -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}daily-infographic.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(245,158,11,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FCD34D'; this.style.boxShadow='0 12px 25px rgba(245,158,11,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(245,158,11,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F59E0B;"><i class="fas fa-magic"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ฟันธงดวงรายวัน</div>
                            <small class="text-white-50">อินโฟกราฟิก 1920px</small>
                        </div>
                    </div>
                </div>

                <!-- 4. สร้างรายงาน PDF (VIP) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}vip-report.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(59,130,246,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#93C5FD'; this.style.boxShadow='0 12px 25px rgba(59,130,246,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(59,130,246,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #60A5FA;"><i class="fas fa-file-pdf"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">รายงาน PDF (VIP)</div>
                            <small class="text-white-50">วิเคราะห์ดวงฉบับเต็ม</small>
                        </div>
                    </div>
                </div>

                <!-- 5. รายงานดวงตลอดชีพ (PDF) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}lifetime-report.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(168,85,247,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#D8B4FE'; this.style.boxShadow='0 12px 25px rgba(168,85,247,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(168,85,247,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #A855F7;"><i class="fas fa-history"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ดวงตลอดชีพ (PDF)</div>
                            <small class="text-white-50">คำนวณกราฟชีวิตตลอดอายุ</small>
                        </div>
                    </div>
                </div>

                <!-- 6. ภาพดวงรายวัน (แผ่นเดียว) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}daily-single-image.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(234,88,12,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FDBA74'; this.style.boxShadow='0 12px 25px rgba(234,88,12,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(234,88,12,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #FB923C;"><i class="fas fa-image"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ภาพดวงรายวัน</div>
                            <small class="text-white-50">แผ่นเดียวกราฟิกสวย</small>
                        </div>
                    </div>
                </div>

                <!-- 7. ทำนายไพ่ยิปซี -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}tarot-reading.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(139,92,246,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#C4B5FD'; this.style.boxShadow='0 12px 25px rgba(139,92,246,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(139,92,246,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #A78BFA;"><i class="fas fa-layer-group"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ทำนายไพ่ยิปซี</div>
                            <small class="text-white-50">ระบบวิเคราะห์ไพ่ทาโรต์</small>
                        </div>
                    </div>
                </div>

                <!-- 8. วอลเปเปอร์สายมู -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}wallpaper-gen.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(16,185,129,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#6EE7B7'; this.style.boxShadow='0 12px 25px rgba(16,185,129,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(16,185,129,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #34D399;"><i class="fas fa-mobile-alt"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">วอลเปเปอร์สายมู</div>
                            <small class="text-white-50">เครื่องรางมงคลมือถือ</small>
                        </div>
                    </div>
                </div>

                <!-- 9. ภาพดวง 12 ราศี (แผ่นรวม) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.open('${p}zodiac-daily.html', '_blank')"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(217,70,239,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#F0ABFC'; this.style.boxShadow='0 12px 25px rgba(217,70,239,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(217,70,239,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #E879F9;"><i class="fas fa-th-large"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ดวง 12 ราศี</div>
                            <small class="text-white-50">ภาพรวม 12 ราศี</small>
                        </div>
                    </div>
                </div>

                <!-- 10. ภาพดวง 12 ราศี (แยกแผ่น) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.open('${p}zodiac-single.html', '_blank')"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(192,132,252,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#E9D5FF'; this.style.boxShadow='0 12px 25px rgba(192,132,252,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(192,132,252,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #C084FC;"><i class="fas fa-th-list"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ดวงรายราศี</div>
                            <small class="text-white-50">แยก 12 ภาพรายคน</small>
                        </div>
                    </div>
                </div>

                <!-- 11. ภาพไพ่ป๊อกทำนายดวง -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}cartomancy.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(239,68,68,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FCA5A5'; this.style.boxShadow='0 12px 25px rgba(239,68,68,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(239,68,68,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F87171;"><i class="fas fa-heart"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ภาพไพ่ป๊อก</div>
                            <small class="text-white-50">ทำนายดวง 1 ใบ / 3 ใบ</small>
                        </div>
                    </div>
                </div>

                <!-- 12. สร้างโพสต์ Facebook -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}facebook-post.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(37,99,235,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#93C5FD'; this.style.boxShadow='0 12px 25px rgba(37,99,235,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(37,99,235,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #3B82F6;"><i class="fab fa-facebook"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">โพสต์ Facebook</div>
                            <small class="text-white-50">เขียนข้อความและแคปชั่น</small>
                        </div>
                    </div>
                </div>

                <!-- 13. โพสต์เลขเด็ด (ทักษา) -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}lotto-post.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(245,158,11,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FDE68A'; this.style.boxShadow='0 12px 25px rgba(245,158,11,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(245,158,11,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #FBBF24;"><i class="fas fa-dice"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">โพสต์เลขเด็ด</div>
                            <small class="text-white-50">คำนวณตามหลักทักษา</small>
                        </div>
                    </div>
                </div>

                <!-- 14. ภาพดวงอัลบั้ม Carousel -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}zodiac-auto-carousel.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(244,114,182,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FBCFE8'; this.style.boxShadow='0 12px 25px rgba(244,114,182,0.25)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(244,114,182,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F472B6;"><i class="fas fa-images"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">อัลบั้มภาพดวง</div>
                            <small class="text-white-50">Carousel 9 ภาพโซเชียล</small>
                        </div>
                    </div>
                </div>

                <!-- 15. สร้างภาพพื้นดวง -->
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center text-center justify-content-between"
                         onclick="window.location.href='${p}chart-image-gen.html'"
                         style="background: rgba(20,32,58,0.6); border: 1px solid rgba(241,208,110,0.3); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);"
                         onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#FFF0A8'; this.style.boxShadow='0 12px 25px rgba(241,208,110,0.2)';"
                         onmouseout="this.style.transform='none'; this.style.borderColor='rgba(241,208,110,0.3)'; this.style.boxShadow='none';">
                        <div style="font-size: 2.2rem; margin-bottom: 10px; color: #F1D06E;"><i class="fas fa-camera-retro"></i></div>
                        <div>
                            <div class="font-weight-bold" style="color: #FFFFFF; font-size: 1rem;">ภาพพื้นดวงชะตา</div>
                            <small class="text-white-50">วิเคราะห์กราฟ & ทักษา</small>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}
