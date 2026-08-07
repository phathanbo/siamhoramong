"use strict";

function showmainpage() {
    const contianer = document.getElementById('mainContentpage');

    if (contianer) {
        contianer.style.display = 'block';
    }

    // ✅ เติมข้อมูลจาก Single Profile (ข้อมูลล่าสุด)
    setTimeout(() => {
        try {
            if (typeof SingleProfileManager !== 'undefined' && SingleProfileManager) {
                const profile = SingleProfileManager.load();
                if (profile) {
                    if (profile.name) document.getElementById('targetName').value = profile.name;
                    if (profile.lastName) document.getElementById('targetLastName').value = profile.lastName;
                    if (profile.gender) document.getElementById('targetGender').value = profile.gender;
                    if (profile.birthdate) {
                        document.getElementById('birthdate').value = profile.birthdate;
                        // แจ้งเตือน flatpickr ให้แสดงค่าด้วย
                        if (document.getElementById('birthdate')._flatpickr) {
                            document.getElementById('birthdate')._flatpickr.setDate(profile.birthdate);
                        }
                    }
                    if (profile.birthDaythai) document.getElementById('dayjanta').value = profile.birthDaythai;
                    if (profile.birthMonththai) document.getElementById('birthMonththai').value = profile.birthMonththai;
                    if (profile.ThaiId) document.getElementById('ThaiId').value = profile.ThaiId;
                    if (profile.birthtime) document.getElementById('birthtime').value = profile.birthtime.substring(0, 5); // 00:00
                    if (profile.province) document.getElementById('targetProvince').value = profile.province;

                    console.log('✅ เติมข้อมูลทั้งหมดจาก Single Profile อัตโนมัติ');
                    return; // จบการทำงาน
                }
            }

            // ถ้าไม่มี Single Profile ให้ลองใช้ displayName
            const session = localStorage.getItem('siamhora_auth_session');
            if (session) {
                const data = JSON.parse(session);
                if (data.displayName) {
                    document.getElementById('targetName').value = data.displayName;
                }
            }
        } catch (e) {
            console.warn('⚠️ ไม่สามารถดึงข้อมูลมาเติมฟอร์มได้:', e);
        }
    }, 150);


    const html = `
    
        <p id="userGreeting" style="font-size: 2.8rem; text-align: center; text-shadow: 0 0 25px rgba(212,175,55,0.6); margin-bottom: 25px; color: #fff; font-weight: 300;">✨
            ยินดีต้อนรับท่านเจ้าชะตา ✨</p>
        
        <section id="form" class="card shadow-lg mb-5 border-0" style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(15px); border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.6) !important; border: 1px solid rgba(212, 175, 55, 0.25) !important; overflow: hidden; animation: fadeIn 0.8s ease;">
            
            <div class="card-header text-center py-4" style="background: linear-gradient(90deg, rgba(212,175,55,0.02) 0%, rgba(212,175,55,0.15) 50%, rgba(212,175,55,0.02) 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
                <h2 style="color: #d4af37; font-weight: 700; margin: 0; text-shadow: 0 2px 8px rgba(0,0,0,0.8);"><i class="fas fa-scroll mr-2"></i> กรอกข้อมูลเพื่อทำนายดวง</h2>
                <p class="text-white-50 small mb-0 mt-2">กรุณาระบุข้อมูลพื้นฐานให้ครบถ้วนเพื่อความแม่นยำ</p>
            </div>

            <div class="card-body p-4 p-md-5">
                <!-- Row 1: ชื่อ - นามสกุล -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2"><i class="fas fa-user mr-2"></i>ชื่อผู้รับคำทำนาย:</label>
                            <input type="text" class="form-control bg-dark text-white border-gold-subtle custom-input" id="targetName" placeholder="กรุณากรอกชื่อ" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2"><i class="fas fa-signature mr-2"></i>นามสกุล:</label>
                            <input type="text" class="form-control bg-dark text-white border-gold-subtle custom-input" id="targetLastName" placeholder="กรุณากรอกนามสกุล" required>
                        </div>
                    </div>
                </div>

                <!-- Row 2: เพศ - วันเกิด -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="targetGender"><i class="fas fa-venus-mars mr-2"></i>เพศ:</label>
                            <select class="form-control bg-dark text-gold border-gold-subtle custom-input" id="targetGender" required>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="birthdate"><i class="fas fa-calendar-alt mr-2"></i>วันเกิด (ปี ค.ศ.):</label>
                            <input type="text" class="form-control bg-dark text-white border-gold-subtle custom-input" id="birthdate" placeholder="วว/ดด/ปปปป" required autocomplete="off">
                        </div>
                    </div>
                </div>

                <!-- Row 3: เวลาเกิด - จังหวัด -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="birthtime"><i class="fas fa-clock mr-2"></i>เวลาเกิด:</label>
                            <input type="time" class="form-control bg-dark text-white border-gold-subtle custom-input" id="birthtime" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="targetProvince"><i class="fas fa-map-marker-alt mr-2"></i>จังหวัดที่เกิด:</label>
                            <input type="text" class="form-control bg-dark text-white border-gold-subtle custom-input" id="targetProvince" placeholder="เช่น กรุงเทพฯ (ถ้าไม่ทราบให้เว้นว่าง)">
                        </div>
                    </div>
                </div>
                
                <hr class="border-gold-subtle my-3" style="opacity: 0.3;">
                
                <!-- Row 4: จันทรคติ (เฉพาะทาง) -->
                <p class="text-white-50 small mb-3"><i class="fas fa-info-circle mr-1"></i> <strong>ข้อมูลเชิงลึก (สำหรับวิชาโหราศาสตร์ไทย):</strong></p>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="dayjanta"><i class="fas fa-moon mr-2"></i>ดิถีขึ้น/แรม:</label>
                            <select class="form-control bg-dark text-gold border-gold-subtle custom-input" id="dayjanta" required>
                                <option value="1">ขึ้น 1 ค่ำ</option>
                                <option value="2">ขึ้น 2 ค่ำ</option>
                                <option value="3">ขึ้น 3 ค่ำ</option>
                                <option value="4">ขึ้น 4 ค่ำ</option>
                                <option value="5">ขึ้น 5 ค่ำ</option>
                                <option value="6">ขึ้น 6 ค่ำ</option>
                                <option value="7">ขึ้น 7 ค่ำ</option>
                                <option value="8">ขึ้น 8 ค่ำ</option>   
                                <option value="9">ขึ้น 9 ค่ำ</option>
                                <option value="10">ขึ้น 10 ค่ำ</option>
                                <option value="11">ขึ้น 11 ค่ำ</option>
                                <option value="12">ขึ้น 12 ค่ำ</option>
                                <option value="13">ขึ้น 13 ค่ำ</option>
                                <option value="14">ขึ้น 14 ค่ำ</option>
                                <option value="15">ขึ้น 15 ค่ำ</option>
                                <option value="16">แรม 1 ค่ำ</option>
                                <option value="17">แรม 2 ค่ำ</option>
                                <option value="18">แรม 3 ค่ำ</option>
                                <option value="19">แรม 4 ค่ำ</option>
                                <option value="20">แรม 5 ค่ำ</option>
                                <option value="21">แรม 6 ค่ำ</option>
                                <option value="22">แรม 7 ค่ำ</option>
                                <option value="23">แรม 8 ค่ำ</option>
                                <option value="24">แรม 9 ค่ำ</option>
                                <option value="25">แรม 10 ค่ำ</option>
                                <option value="26">แรม 11 ค่ำ</option>
                                <option value="27">แรม 12 ค่ำ</option>
                                <option value="28">แรม 13 ค่ำ</option>
                                <option value="29">แรม 14 ค่ำ</option>
                                <option value="30">แรม 15 ค่ำ</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="birthMonththai"><i class="fas fa-om mr-2"></i>เดือนเกิด (ไทย):</label>
                            <input type="number" class="form-control bg-dark text-white border-gold-subtle custom-input" id="birthMonththai" max="12" min="1" placeholder="ระบุเดือน 1-12" required>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-4">
                            <label class="text-gold small font-weight-bold mb-2" for="ThaiId"><i class="fas fa-id-card mr-2"></i>เลขบัตร (สำหรับเลขศาสตร์):</label>
                            <input type="text" class="form-control bg-dark text-white border-gold-subtle custom-input" id="ThaiId" maxlength="13" placeholder="ระบุเลขบัตรประชาชน 13 หลัก" required>
                        </div>
                    </div>
                </div>

                <!-- Button -->
                <div class="form-group mt-4 text-center">
                    <button type="button" class="btn btn-gold btn-lg px-5 py-3 shadow-lg" onclick="calculateEsh()" style="border-radius: 50px; font-weight: 700; letter-spacing: 1px; font-size: 1.2rem; transition: all 0.3s ease;">
                        <i class="fas fa-magic mr-2"></i> เปิดดวงชะตา
                    </button>
                </div>
            </div>
            
            <style>
                .border-gold-subtle { border: 1px solid rgba(212, 175, 55, 0.4) !important; }
                .custom-input { border-radius: 12px; padding: 12px 18px; height: auto; transition: all 0.3s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
                .custom-input:focus { border-color: #d4af37 !important; box-shadow: 0 0 15px rgba(212, 175, 55, 0.6) !important; background: rgba(0,0,0,0.9) !important; outline: none; }
                .btn-gold { background: linear-gradient(135deg, #f1c40f 0%, #d4af37 100%); color: #000; border: none; }
                .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212,175,55,0.5) !important; color: #fff; }
            </style>
        </section>   
    `;
    contianer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () =>{
    showmainpage();
});
