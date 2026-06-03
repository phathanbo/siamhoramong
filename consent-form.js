/**
 * ระบบการยินยอมการใช้ข้อมูลส่วนบุคคล - PDPA Consent Management System
 * UI: Modern Design with Tabs, Full Details, Easy to Read
 */

// ตรวจสอบการยินยอมเมื่อโหลดหน้า
function checkConsentStatus() {
    const consentGiven = localStorage.getItem('pdpaConsent');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const authSession = localStorage.getItem('siamhora_auth_session');
    
    // ตรวจสอบว่า user เป็น admin หรือไม่
    let userRole = 'user';
    if (authSession) {
        try {
            const session = JSON.parse(authSession);
            userRole = session.role || 'user';
        } catch (e) {
            console.error('Error parsing auth session:', e);
        }
    }
    
    // ถ้าเป็น admin ไม่ต้องแสดงฟอร์มยินยอม
    if (userRole === 'admin') {
        return;
    }
    
    // ถ้ายังไม่ได้ยินยอมและเข้าสู่ระบบแล้ว ให้แสดงฟอร์มยินยอม
    if (!consentGiven && userId) {
        showConsentOverlay();
    }
}

// แสดงโมดัลฟอร์มยินยอม
function showConsentOverlay() {
    if (!document.getElementById('consentOverlay')) {
        createConsentOverlay();
    }
    
    const overlay = document.getElementById('consentOverlay');
    overlay.style.display = 'flex';
}

// ซ่อนโมดัลฟอร์มยินยอม
function hideConsentOverlay() {
    const overlay = document.getElementById('consentOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// สร้าง HTML สำหรับฟอร์มยินยอมพร้อม Tabs
function createConsentOverlay() {
    const consentHTML = `
    <style>
        @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        #consentOverlay { animation: fadeIn 0.3s ease; }
        #consentContainer { animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .consent-checkbox-item:hover { transform: translateX(8px); }
        
        .consent-tab {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 12px 20px;
            border-bottom: 3px solid transparent;
            font-weight: 600;
            font-size: 14px;
            color: #64748b;
        }
        .consent-tab.active {
            color: #6366f1;
            border-bottom-color: #6366f1;
        }
        .consent-tab-content {
            display: none;
        }
        .consent-tab-content.active {
            display: block;
            animation: slideInDown 0.3s ease;
        }
    </style>
    
    <div id="consentOverlay" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3)), rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 99998;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Segoe UI', 'Prompt', sans-serif;
    ">
        <div id="consentContainer" style="
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 70px rgba(99, 102, 241, 0.25);
            max-width: 950px;
            width: 100%;
            max-height: 92vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
                color: white;
                padding: 50px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
                flex-shrink: 0;
            ">
                <div style="position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -50%; left: -5%; width: 250px; height: 250px; background: rgba(255, 255, 255, 0.05); border-radius: 50%;"></div>
                <h2 style="font-size: 32px; margin: 0 0 12px 0; font-weight: 800; position: relative; z-index: 1; letter-spacing: -0.5px;">🔐 ยืนยันข้อมูลส่วนบุคคล</h2>
                <p style="margin: 0; opacity: 0.95; font-size: 15px; position: relative; z-index: 1; font-weight: 500;">เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ</p>
            </div>

            <!-- Tabs Navigation -->
            <div style="display: flex; gap: 0; background: white; border-bottom: 2px solid #e2e8f0; overflow-x: auto; flex-shrink: 0; padding: 0 40px;">
                <div class="consent-tab active" onclick="switchConsentTab(event, 'info')" style="border-bottom-color: #6366f1;">📋 ข้อมูล</div>
                <div class="consent-tab" onclick="switchConsentTab(event, 'terms')">⚖️ เงื่อนไข</div>
                <div class="consent-tab" onclick="switchConsentTab(event, 'rights')">👤 สิทธิ์</div>
                <div class="consent-tab" onclick="switchConsentTab(event, 'consent')">✓ ยินยอม</div>
            </div>

            <!-- Content Area -->
            <div style="flex: 1; overflow-y: auto; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); padding: 40px;">
                
                <!-- Tab: Information -->
                <div id="consentTab-info" class="consent-tab-content active">
                    <h3 style="font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 24px;">📋 ข้อมูลและนโยบาย</h3>
                    
                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #6366f1; margin-bottom: 12px;">บทนำ</h4>
                        <p style="color: #334155; line-height: 1.8; font-size: 15px;">เว็บไซต์ <strong>สยามโหรามงคล</strong> ("เรา" หรือ "ผู้ให้บริการ") ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของคุณ แบบฟอร์มนี้มีวัตถุประสงค์เพื่อขอความยินยอมจากคุณในการใช้ข้อมูลส่วนบุคคลของคุณเพื่อให้บริการดูดวงออนไลน์ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
                    </div>

                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02)); border: 2px solid rgba(99, 102, 241, 0.15); border-radius: 14px; padding: 20px; margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #6366f1; margin-bottom: 16px;">🏢 ข้อมูลผู้ให้บริการ</h4>
                        <div style="font-size: 15px; color: #334155; line-height: 1.8;">
                            <p><strong>ชื่อผู้ให้บริการ:</strong> สยามโหรามงคล</p>
                            <p><strong>ที่อยู่:</strong> 113/82 ม.2 ต.พยุหะ อ.พยุหะคีรี จ.นครสวรรค์ 60130</p>
                            <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> 1-6001-00594-89-4</p>
                            <p><strong>อีเมล:</strong> phathanbo@gmail.com</p>
                            <p><strong>โทรศัพท์:</strong> 094-392-6453</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #8b5cf6; margin-bottom: 12px;">📝 ข้อมูลที่เรารวบรวม</h4>
                        <div style="font-size: 15px; color: #334155;">
                            <p style="font-weight: 600; color: #6366f1; margin-bottom: 8px;">ข้อมูลพื้นฐาน:</p>
                            <ul style="margin-left: 20px; margin-bottom: 16px; line-height: 1.8;">
                                <li>ชื่อ-นามสกุล</li>
                                <li>เลขประจำตัวประชาชน 13 หลัก</li>
                                <li>วันเดือนปีเกิด เพศ ที่อยู่ปัจจุบัน</li>
                                <li>หมายเลขโทรศัพท์ และที่อยู่อีเมล</li>
                            </ul>
                            <p style="font-weight: 600; color: #6366f1; margin-bottom: 8px;">ข้อมูลการดูดวง:</p>
                            <ul style="margin-left: 20px; margin-bottom: 16px; line-height: 1.8;">
                                <li>เวลาเกิด (ชั่วโมง นาที วินาที)</li>
                                <li>สถานที่เกิด (จังหวัด/เมือง)</li>
                                <li>ประวัติครอบครัว (บิดา มารดา พี่น้อง)</li>
                                <li>สถานะการสมรส และอาชีพ/งาน</li>
                            </ul>
                            <p style="font-weight: 600; color: #6366f1; margin-bottom: 8px;">ข้อมูลการชำระเงิน:</p>
                            <ul style="margin-left: 20px; line-height: 1.8;">
                                <li>วิธีการชำระเงิน ประวัติการใช้บริการ</li>
                                <li>ความเห็นและข้อเสนอแนะ</li>
                            </ul>
                        </div>
                    </div>

                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #ec4899; margin-bottom: 12px;">🎯 วัตถุประสงค์ในการใช้ข้อมูล</h4>
                        <ul style="margin-left: 20px; font-size: 15px; color: #334155; line-height: 1.8;">
                            <li>ให้บริการดูดวง คำแนะนำทางจิตรวิทยา และสัตวสาสตร์</li>
                            <li>จัดส่งรายงานผลการดูดวงและข้อมูลที่เกี่ยวข้อง</li>
                            <li>ติดต่อและสื่อสารเพื่อการดำเนินการบริการ</li>
                            <li>จัดเก็บข้อมูลชำระเงินและประวัติธุรกรรม</li>
                            <li>ปรับปรุงและพัฒนาคุณภาพบริการ</li>
                        </ul>
                    </div>
                </div>

                <!-- Tab: Terms & Conditions -->
                <div id="consentTab-terms" class="consent-tab-content">
                    <h3 style="font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 24px;">⚖️ เงื่อนไขและความปลอดภัย</h3>
                    
                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #6366f1; margin-bottom: 12px;">⚖️ หลักเกณฑ์ทางกฎหมาย</h4>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 16px; line-height: 1.8;">การประมวลผลข้อมูลของคุณเป็นไปตามหลักเกณฑ์ของพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล:</p>
                        <div style="background: rgba(99, 102, 241, 0.05); border-radius: 8px; overflow: hidden;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.2);"><td style="padding: 12px; font-weight: 700; color: #6366f1; width: 30%;">✓ ความยินยอม</td><td style="padding: 12px; color: #334155;">คุณให้ความยินยอมที่ชัดเจนเป็นลายลักษณ์อักษร</td></tr>
                                <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.2);"><td style="padding: 12px; font-weight: 700; color: #6366f1;">✓ ความจำเป็น</td><td style="padding: 12px; color: #334155;">จำเป็นเพื่อการให้บริการดูดวง</td></tr>
                                <tr><td style="padding: 12px; font-weight: 700; color: #6366f1;">✓ ประโยชน์กฎหมาย</td><td style="padding: 12px; color: #334155;">ปฏิบัติตามข้อกำหนดทางกฎหมาย</td></tr>
                            </table>
                        </div>
                    </div>

                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #8b5cf6; margin-bottom: 12px;">📅 ระยะเวลาการเก็บข้อมูล</h4>
                        <div style="font-size: 15px; color: #334155; line-height: 1.8;">
                            <p><strong>ข้อมูลพื้นฐาน:</strong> เก็บไว้ตลอดระยะเวลาของการเป็นสมาชิกและ 1 ปี หลังการยกเลิก</p>
                            <p><strong>ข้อมูลการชำระเงิน:</strong> เก็บไว้ตาม 5-7 ปี (ตามข้อบังคับภาษี)</p>
                            <p><strong>ข้อมูลการติดต่อ:</strong> เก็บไว้ 1-3 ปี เพื่อการตรวจสอบบริการ</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 28px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #ec4899; margin-bottom: 12px;">🔗 การเปิดเผยข้อมูล</h4>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 12px;">เราจะไม่เปิดเผยข้อมูลของคุณ ยกเว้นในกรณีต่อไปนี้:</p>
                        <ul style="margin-left: 20px; font-size: 15px; color: #334155; line-height: 1.8;">
                            <li>ผู้ให้บริการด้านการดูดวง (จิตรวิทยา ดาราศาสตร์) ตามความจำเป็น</li>
                            <li>บริษัทจัดการการชำระเงิน</li>
                            <li>หน่วยงานรัฐตามที่กฎหมายกำหนด</li>
                            <li>บุคคลที่ได้รับอนุญาตจากคุณ</li>
                        </ul>
                    </div>

                    <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.02)); border: 2px solid rgba(236, 72, 153, 0.15); border-radius: 14px; padding: 20px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #ec4899; margin-bottom: 12px;">🔒 ความปลอดภัยของข้อมูล</h4>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 12px;">เราใช้มาตรการปกป้องข้อมูล:</p>
                        <ul style="margin-left: 20px; font-size: 15px; color: #334155; line-height: 1.8;">
                            <li>🔐 การเข้ารหัสข้อมูล (Encryption)</li>
                            <li>🔑 ระบบตรวจสอบตัวตนที่ปลอดภัย</li>
                            <li>📊 การแยกข้อมูลแบบใช้งาน</li>
                            <li>💾 สำรองข้อมูลอย่างสม่ำเสมอ</li>
                            <li>🛡️ นโยบายการเข้าถึงอย่างเข้มงวด</li>
                        </ul>
                    </div>
                </div>

                <!-- Tab: Rights -->
                <div id="consentTab-rights" class="consent-tab-content">
                    <h3 style="font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 24px;">👤 สิทธิของคุณ (ตามกฎหมาย PDPA)</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02)); border: 2px solid rgba(99, 102, 241, 0.15); border-radius: 12px; padding: 16px;">
                            <h4 style="font-size: 15px; font-weight: 700; color: #6366f1; margin-bottom: 8px;">✓ ยืนยันและเข้าถึงข้อมูล</h4>
                            <p style="font-size: 14px; color: #334155; margin: 0;">ขอดูข้อมูลที่เรามีเกี่ยวกับคุณ</p>
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.02)); border: 2px solid rgba(139, 92, 246, 0.15); border-radius: 12px; padding: 16px;">
                            <h4 style="font-size: 15px; font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">✓ แก้ไขข้อมูล</h4>
                            <p style="font-size: 14px; color: #334155; margin: 0;">ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</p>
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.02)); border: 2px solid rgba(236, 72, 153, 0.15); border-radius: 12px; padding: 16px;">
                            <h4 style="font-size: 15px; font-weight: 700; color: #ec4899; margin-bottom: 8px;">✓ ลบข้อมูล</h4>
                            <p style="font-size: 14px; color: #334155; margin: 0;">ขอให้ลบข้อมูลในบางกรณี</p>
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02)); border: 2px solid rgba(245, 158, 11, 0.15); border-radius: 12px; padding: 16px;">
                            <h4 style="font-size: 15px; font-weight: 700; color: #f59e0b; margin-bottom: 8px;">✓ คัดค้านการประมวลผล</h4>
                            <p style="font-size: 14px; color: #334155; margin: 0;">ปฏิเสธการใช้ข้อมูลทางการตลาด</p>
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02)); border: 2px solid rgba(16, 185, 129, 0.15); border-radius: 12px; padding: 16px;">
                            <h4 style="font-size: 15px; font-weight: 700; color: #10b981; margin-bottom: 8px;">✓ จำกัดการประมวลผล</h4>
                            <p style="font-size: 14px; color: #334155; margin: 0;">ขอจำกัดวิธีการใช้ข้อมูล</p>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02)); border: 2px solid rgba(99, 102, 241, 0.15); border-radius: 14px; padding: 20px; margin-top: 24px;">
                        <h4 style="font-size: 16px; font-weight: 700; color: #6366f1; margin-bottom: 12px;">📞 ติดต่อเพื่อใช้สิทธิ</h4>
                        <div style="font-size: 15px; color: #334155; line-height: 1.8;">
                            <p><strong>อีเมล:</strong> phathanbo@gmail.com</p>
                            <p><strong>โทรศัพท์:</strong> +66-94-392-6453</p>
                            <p><strong>เวลาทำการ:</strong> จันทร์-ศุกร์ 09:00-17:00 น.</p>
                            <p style="font-size: 13px; color: #64748b; margin-top: 12px;">⏱️ เราจะตอบสนองภายใน <strong>15 วัน</strong> นับแต่ได้รับคำขอ</p>
                        </div>
                    </div>
                </div>

                <!-- Tab: Consent Checkboxes -->
                <div id="consentTab-consent" class="consent-tab-content">
                    <h3 style="font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 24px;">✓ ยินยอมและส่งฟอร์ม</h3>
                    
                    <div id="consentSuccessMessage" style="display: none; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border: 2px solid #10b981; color: #10b981; padding: 16px 18px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; animation: slideInDown 0.3s ease;">
                        ✓ ความยินยอมของคุณได้รับการบันทึกเรียบร้อยแล้ว
                    </div>

                    <div id="consentErrorMessage" style="display: none; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)); border: 2px solid #ef4444; color: #ef4444; padding: 16px 18px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; animation: slideInDown 0.3s ease;"></div>

                    <p style="color: #ef4444; font-size: 14px; margin-bottom: 20px; font-weight: 600; background: rgba(239, 68, 68, 0.05); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #ef4444;">* จำเป็นต้องเช็ค 5 ข้อเพื่อดำเนินการต่อ</p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div class="consent-checkbox-item" style="display: flex; align-items: flex-start; padding: 16px 18px; border-radius: 12px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; background: rgba(99, 102, 241, 0.04); cursor: pointer;">
                            <input type="checkbox" id="consentCheck1" name="consentCheck" style="width: 22px; height: 22px; min-width: 22px; margin-right: 16px; margin-top: 2px; cursor: pointer; accent-color: #6366f1; flex-shrink: 0;">
                            <label for="consentCheck1" style="font-size: 15px; line-height: 1.7; cursor: pointer; flex: 1; color: #334155; font-weight: 500;">
                                <strong style="color: #6366f1; font-weight: 700;">ข้อ 1:</strong> ฉันได้อ่านและเข้าใจนโยบายการคุ้มครองข้อมูลแล้ว
                            </label>
                        </div>
                        <div class="consent-checkbox-item" style="display: flex; align-items: flex-start; padding: 16px 18px; border-radius: 12px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; background: rgba(99, 102, 241, 0.04); cursor: pointer;">
                            <input type="checkbox" id="consentCheck2" name="consentCheck" style="width: 22px; height: 22px; min-width: 22px; margin-right: 16px; margin-top: 2px; cursor: pointer; accent-color: #6366f1; flex-shrink: 0;">
                            <label for="consentCheck2" style="font-size: 15px; line-height: 1.7; cursor: pointer; flex: 1; color: #334155; font-weight: 500;">
                                <strong style="color: #6366f1; font-weight: 700;">ข้อ 2:</strong> ฉันให้ความยินยอมให้รวบรวมและใช้ข้อมูลส่วนบุคคลของฉัน
                            </label>
                        </div>
                        <div class="consent-checkbox-item" style="display: flex; align-items: flex-start; padding: 16px 18px; border-radius: 12px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; background: rgba(99, 102, 241, 0.04); cursor: pointer;">
                            <input type="checkbox" id="consentCheck3" name="consentCheck" style="width: 22px; height: 22px; min-width: 22px; margin-right: 16px; margin-top: 2px; cursor: pointer; accent-color: #6366f1; flex-shrink: 0;">
                            <label for="consentCheck3" style="font-size: 15px; line-height: 1.7; cursor: pointer; flex: 1; color: #334155; font-weight: 500;">
                                <strong style="color: #6366f1; font-weight: 700;">ข้อ 3:</strong> ฉันเข้าใจว่าสามารถเพิกถอนความยินยอมได้ทุกเมื่อ
                            </label>
                        </div>
                        <div class="consent-checkbox-item" style="display: flex; align-items: flex-start; padding: 16px 18px; border-radius: 12px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; background: rgba(99, 102, 241, 0.04); cursor: pointer;">
                            <input type="checkbox" id="consentCheck4" name="consentCheck" style="width: 22px; height: 22px; min-width: 22px; margin-right: 16px; margin-top: 2px; cursor: pointer; accent-color: #6366f1; flex-shrink: 0;">
                            <label for="consentCheck4" style="font-size: 15px; line-height: 1.7; cursor: pointer; flex: 1; color: #334155; font-weight: 500;">
                                <strong style="color: #6366f1; font-weight: 700;">ข้อ 4:</strong> ฉันอนุญาตให้เปิดเผยข้อมูลแก่ผู้ให้บริการที่เกี่ยวข้อง
                            </label>
                        </div>
                        <div class="consent-checkbox-item" style="display: flex; align-items: flex-start; padding: 16px 18px; border-radius: 12px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; background: rgba(99, 102, 241, 0.04); cursor: pointer;">
                            <input type="checkbox" id="consentCheck5" name="consentCheck" style="width: 22px; height: 22px; min-width: 22px; margin-right: 16px; margin-top: 2px; cursor: pointer; accent-color: #6366f1; flex-shrink: 0;">
                            <label for="consentCheck5" style="font-size: 15px; line-height: 1.7; cursor: pointer; flex: 1; color: #334155; font-weight: 500;">
                                <strong style="color: #6366f1; font-weight: 700;">ข้อ 5:</strong> ฉันรับทราบและยอมรับความเสี่ยงจากการใช้บริการออนไลน์
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer with Buttons -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%); padding: 30px 40px; border-top: 1px solid rgba(99, 102, 241, 0.1); display: flex; gap: 14px; justify-content: flex-end; flex-wrap: wrap; flex-shrink: 0;">
                <button id="consentRejectBtn" onclick="rejectConsent()" style="padding: 14px 32px; background: white; color: #64748b; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.3px;">✕ ไม่ยินยอม</button>
                <button id="consentQuickApproveBtn" onclick="checkAllConsents()" style="padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.3px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);">⚡ ยินยอมทั้ง 5 ข้อ</button>
                <button id="consentAcceptBtn" onclick="acceptConsent()" disabled style="padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: not-allowed; opacity: 0.5; transition: all 0.3s ease; letter-spacing: 0.3px; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);">✓ ยินยอมและดำเนินการต่อ</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', consentHTML);

    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById(`consentCheck${i}`);
        if (checkbox) {
            checkbox.addEventListener('change', updateConsentButton);
        }
    }

    const rejectBtn = document.getElementById('consentRejectBtn');
    const acceptBtn = document.getElementById('consentAcceptBtn');

    if (rejectBtn) {
        rejectBtn.addEventListener('mouseover', function() {
            this.style.background = '#f1f5f9';
            this.style.borderColor = '#94a3b8';
        });
        rejectBtn.addEventListener('mouseout', function() {
            this.style.background = 'white';
            this.style.borderColor = '#e2e8f0';
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('mouseover', function() {
            if (this.disabled) return;
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
        });
        acceptBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.2)';
        });
    }

    const quickApproveBtn = document.getElementById('consentQuickApproveBtn');
    if (quickApproveBtn) {
        quickApproveBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)';
        });
        quickApproveBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
        });
    }
}

// ฟังก์ชันสำหรับสลับ tabs
function switchConsentTab(event, tabName) {
    const tabs = document.querySelectorAll('.consent-tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.consent-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const tabElement = document.getElementById(`consentTab-${tabName}`);
    if (tabElement) {
        tabElement.classList.add('active');
    }

    event.target.classList.add('active');
}

// อัปเดตสถานะปุ่ม Accept
function updateConsentButton() {
    const allChecked = 
        document.getElementById('consentCheck1').checked &&
        document.getElementById('consentCheck2').checked &&
        document.getElementById('consentCheck3').checked &&
        document.getElementById('consentCheck4').checked &&
        document.getElementById('consentCheck5').checked;

    const btn = document.getElementById('consentAcceptBtn');
    btn.disabled = !allChecked;
    btn.style.opacity = allChecked ? '1' : '0.5';
    btn.style.cursor = allChecked ? 'pointer' : 'not-allowed';
}

// เช็คและยินยอมทั้ง 5 ข้อพร้อมกัน
function checkAllConsents() {
    document.getElementById('consentCheck1').checked = true;
    document.getElementById('consentCheck2').checked = true;
    document.getElementById('consentCheck3').checked = true;
    document.getElementById('consentCheck4').checked = true;
    document.getElementById('consentCheck5').checked = true;
    
    // อัปเดตปุ่ม
    updateConsentButton();
    
    // ยินยอมทันทีหลังจากเช็คทั้ง 5 ข้อ
    setTimeout(() => {
        acceptConsent();
    }, 300);
}

// ยินยอมและบันทึก
function acceptConsent() {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    const consentData = {
        userId: userId,
        timestamp: new Date().toISOString(),
        allConsents: true,
        userAgent: navigator.userAgent,
        language: navigator.language
    };

    console.log('Consent accepted:', consentData);

    localStorage.setItem('pdpaConsent', JSON.stringify(consentData));
    localStorage.setItem('pdpaConsentDate', new Date().toISOString());

    sendConsentToServer(consentData);

    hideConsentOverlay();

    showSuccessMessage('ยินยอมเรียบร้อยแล้ว! คุณสามารถใช้งานบริการได้แล้ว');
}

// ปฏิเสธการยินยอม
function rejectConsent() {
    if (confirm('หากคุณไม่ยินยอม คุณจะไม่สามารถใช้งานบริการได้ คุณแน่ใจหรือ?')) {
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId');
        hideConsentOverlay();
        alert('คุณได้ปฏิเสธการยินยอม ระบบจะนำคุณออกจากระบบ');
        window.location.href = 'index.html';
    }
}

// ส่งข้อมูลยินยอมไปยัง Server
function sendConsentToServer(consentData) {
    const apiEndpoint = '/api/consent' || 'http://localhost:3000/api/consent';

    fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentData)
    })
    .then(response => response.json())
    .then(data => console.log('Consent saved to server:', data))
    .catch(error => console.error('Error sending consent:', error));
}

// แสดงข้อความสำเร็จ
function showSuccessMessage(message) {
    const existingAlert = document.getElementById('consentAlert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.id = 'consentAlert';
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 100000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// เริ่มการตรวจสอบเมื่อโหลด DOM
document.addEventListener('DOMContentLoaded', checkConsentStatus);
