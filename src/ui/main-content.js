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
        <div class="container py-4" style="max-width: 920px; margin: 0 auto;">
            <!-- Header Hero -->
            <div class="text-center mb-4">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 20px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 14px; box-shadow: 0 0 25px rgba(212, 175, 55, 0.2);">
                    <i class="fas fa-scroll" style="font-size: 2rem; color: #ffd700;"></i>
                </div>
                <h1 id="userGreeting" style="font-size: 2.1rem; font-weight: 700; background: linear-gradient(135deg, #FFFFFF 0%, #FFF3B0 40%, #F1D06E 80%, #C99727 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 6px;">
                    ผูกดวงชะตาส่วนบุคคล
                </h1>
                <p style="color: #cbd5e1; font-size: 0.95rem; max-width: 540px; margin: 0 auto;">
                    กรอกข้อมูลวันเวลาตกฟาก เพื่อถอดรหัสวาสนาและเปิดตำราคำทำนายเฉพาะตัวคุณ
                </p>
            </div>

            <!-- Modern Form Container Card -->
            <section id="form" class="shadow-lg border-0" style="background: linear-gradient(145deg, rgba(20, 28, 48, 0.85) 0%, rgba(11, 16, 32, 0.95) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(212, 175, 55, 0.35) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12) !important; overflow: hidden; animation: fadeIn 0.5s ease;">
                
                <div class="p-4 p-md-5">
                    
                    <!-- Section 1: ข้อมูลบุคคลพื้นฐาน -->
                    <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="display:inline-block; width: 4px; height: 16px; background: #ffd700; border-radius: 4px;"></span>
                            <h5 style="color: #ffd700; font-weight: 600; font-size: 1.05rem; margin: 0;">
                                ๑. ข้อมูลผู้รับคำทำนาย
                            </h5>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1"><i class="fas fa-user text-warning mr-1"></i> ชื่อจริง:</label>
                                <input type="text" class="form-control modern-form-input" id="targetName" placeholder="ระบุชื่อจริง" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1"><i class="fas fa-signature text-warning mr-1"></i> นามสกุล:</label>
                                <input type="text" class="form-control modern-form-input" id="targetLastName" placeholder="ระบุนามสกุล" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="targetGender"><i class="fas fa-venus-mars text-warning mr-1"></i> เพศสภาพ:</label>
                                <select class="form-control modern-form-input" id="targetGender" required>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="targetProvince"><i class="fas fa-map-marker-alt text-warning mr-1"></i> จังหวัดที่เกิด:</label>
                                <input type="text" class="form-control modern-form-input" id="targetProvince" placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่">
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: เวลาตกฟากและดวงกำเนิด -->
                    <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="display:inline-block; width: 4px; height: 16px; background: #38bdf8; border-radius: 4px;"></span>
                            <h5 style="color: #38bdf8; font-weight: 600; font-size: 1.05rem; margin: 0;">
                                ๒. วัน-เวลาตกฟาก (สุริยคติ)
                            </h5>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="birthdate"><i class="fas fa-calendar-alt text-info mr-1"></i> วันเกิด:</label>
                                <input type="text" class="form-control modern-form-input" id="birthdate" placeholder="วว/ดด/ปปปป" required autocomplete="off" onchange="autoSyncLunarFields(this.value)">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="birthtime"><i class="fas fa-clock text-info mr-1"></i> เวลาเกิด (น.):</label>
                                <input type="time" class="form-control modern-form-input" id="birthtime" required>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: ข้อมูลโหราศาสตร์ไทย & เลขศาสตร์ -->
                    <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                            <span style="display:inline-block; width: 4px; height: 16px; background: #eab308; border-radius: 4px;"></span>
                            <h5 style="color: #eab308; font-weight: 600; font-size: 1.05rem; margin: 0;">
                                ๓. ข้อมูลจันทรคติ & เลขศาสตร์ (คำนวณอัตโนมัติ)
                            </h5>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-4 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="dayjanta"><i class="fas fa-moon text-warning mr-1"></i> ดิถีขึ้น/แรม:</label>
                                <select class="form-control modern-form-input" id="dayjanta" required>
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
                            <div class="col-md-4 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="birthMonththai"><i class="fas fa-om text-warning mr-1"></i> เดือนไทย (๑–๑๒):</label>
                                <input type="number" class="form-control modern-form-input" id="birthMonththai" max="12" min="1" placeholder="เช่น 5" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="text-white-50 small font-weight-medium mb-1" for="ThaiId"><i class="fas fa-id-card text-warning mr-1"></i> เลขประจำตัว (เลขศาสตร์):</label>
                                <input type="text" class="form-control modern-form-input" id="ThaiId" maxlength="13" placeholder="เลข 13 หลัก" required>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4 pt-2" style="gap: 14px;">
                        <button type="button" class="btn btn-outline-light px-4 py-2" onclick="navigateTo('mainpage')" style="border-radius: 50px; font-weight: 500; font-size: 0.95rem; border-color: rgba(255,255,255,0.25);">
                            <i class="fas fa-arrow-left mr-1"></i> กลับห้องพยากรณ์
                        </button>
                        <button type="button" class="btn btn-gold-action px-5 py-3" onclick="calculateEsh()">
                            <i class="fas fa-magic mr-2"></i> บันทึกและเปิดดวงชะตา
                        </button>
                    </div>

                </div>
            </section>
        </div>

        <script>
            // คำนวณเดือนไทยอัตโนมัติเมื่อเลือกวันเกิด
            window.autoSyncLunarFields = function(val) {
                if (!val) return;
                try {
                    let month = null;
                    if (val.includes('/')) {
                        month = parseInt(val.split('/')[1], 10);
                    } else if (val.includes('-')) {
                        month = parseInt(val.split('-')[1], 10);
                    }
                    if (month && !isNaN(month)) {
                        const mInput = document.getElementById('birthMonththai');
                        if (mInput && !mInput.value) mInput.value = month;
                    }
                } catch(e) {}
            };
        </script>

        <style>
            .modern-form-input {
                background: rgba(15, 23, 42, 0.7) !important;
                border: 1.5px solid rgba(212, 175, 55, 0.3) !important;
                color: #ffffff !important;
                border-radius: 12px !important;
                padding: 10px 14px !important;
                height: 46px !important;
                font-size: 0.95rem !important;
                transition: all 0.25s ease !important;
            }
            .modern-form-input:focus {
                border-color: #ffd700 !important;
                background: rgba(15, 23, 42, 0.95) !important;
                box-shadow: 0 0 0 3px rgba(241, 208, 110, 0.25) !important;
                outline: none !important;
            }
            .btn-gold-action {
                background: linear-gradient(135deg, #f1d06e 0%, #c99727 50%, #9a7318 100%) !important;
                color: #0b1120 !important;
                font-weight: 700 !important;
                border: none !important;
                border-radius: 50px !important;
                font-size: 1.05rem !important;
                box-shadow: 0 8px 25px rgba(201, 151, 39, 0.4) !important;
                transition: all 0.25s ease !important;
            }
            .btn-gold-action:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 12px 30px rgba(241, 208, 110, 0.6) !important;
                color: #000 !important;
            }
        </style>
    `;
    contianer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () =>{
    showmainpage();
});

