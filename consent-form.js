/**
 * ระบบการยินยอมการใช้ข้อมูลส่วนบุคคล
 * PDPA Consent Management System
 */

// ตรวจสอบการยินยอมเมื่อโหลดหน้า
function checkConsentStatus() {
    const consentGiven = localStorage.getItem('pdpaConsent');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // ถ้ายังไม่ได้ยินยอมและเข้าสู่ระบบแล้ว ให้แสดงฟอร์มยินยอม
    if (!consentGiven && userId) {
        showConsentOverlay();
    }
}

// แสดงโมดัลฟอร์มยินยอม
function showConsentOverlay() {
    // สร้างโมดัลหากยังไม่มี
    if (!document.getElementById('consentOverlay')) {
        createConsentOverlay();
    }
    
    const overlay = document.getElementById('consentOverlay');
    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '99998';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
}

// ซ่อนโมดัลฟอร์มยินยอม
function hideConsentOverlay() {
    const overlay = document.getElementById('consentOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// สร้าง HTML สำหรับฟอร์มยินยอม
function createConsentOverlay() {
    const consentHTML = `
    <div id="consentOverlay" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 99998;
        align-items: center;
        justify-content: center;
        padding: 20px;
    ">
        <div id="consentContainer" style="
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #1f4e78 0%, #203864 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
            ">
                <h2 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">
                    🔐 แบบฟอร์มขอความยินยอม
                </h2>
                <p style="margin: 0; opacity: 0.95; font-size: 14px;">
                    การใช้ข้อมูลส่วนบุคคล | บริการดูดวงออนไลน์
                </p>
            </div>

            <!-- Content -->
            <div style="
                padding: 40px 30px;
                background: white;
                max-height: calc(90vh - 140px);
                overflow-y: auto;
            ">
                <div id="consentSuccessMessage" class="consent-success-message" style="
                    display: none;
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                ">
                    ✓ ความยินยอมของคุณได้รับการบันทึกเรียบร้อยแล้ว
                </div>
                <div id="consentErrorMessage" class="consent-error-message" style="
                    display: none;
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                "></div>

                <!-- Introduction -->
                <div style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f4e78;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #d4af37;
                    ">📋 บทนำ</h3>
                    <p style="font-size: 14px; line-height: 1.8; color: #333;">
                        เว็บไซต์ <strong>สยามโหรามงคล</strong> ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของคุณ แบบฟอร์มนี้มีวัตถุประสงค์เพื่อขอความยินยอมจากคุณในการใช้ข้อมูลส่วนบุคคลของคุณตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                    </p>
                </div>

                <!-- Company Information -->
                <div style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f4e78;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #d4af37;
                    ">🏢 ข้อมูลผู้ให้บริการ</h3>
                    <div style="
                        background: #e8eff5;
                        border-left: 4px solid #1f4e78;
                        padding: 15px;
                        margin: 15px 0;
                        border-radius: 4px;
                        font-size: 14px;
                    ">
                        <strong style="display: block; color: #1f4e78; margin-bottom: 5px;">ชื่อผู้ให้บริการ:</strong>
                        สยามโหรามงคล
                    </div>
                    <div style="
                        background: #e8eff5;
                        border-left: 4px solid #1f4e78;
                        padding: 15px;
                        margin: 15px 0;
                        border-radius: 4px;
                        font-size: 14px;
                    ">
                        <strong style="display: block; color: #1f4e78; margin-bottom: 5px;">ช่องทางติดต่อ:</strong>
                        phathanbo@gmail.com | 094-392-6453
                    </div>
                </div>

                <!-- Purpose of Use -->
                <div style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f4e78;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #d4af37;
                    ">🎯 วัตถุประสงค์ในการใช้ข้อมูล</h3>
                    <ul style="margin-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li>ให้บริการดูดวง คำแนะนำ และสัตวสาสตร์</li>
                        <li>จัดส่งรายงานผลการดูดวง</li>
                        <li>ติดต่อและสื่อสารเพื่อการดำเนินการบริการ</li>
                        <li>จัดเก็บข้อมูลชำระเงิน</li>
                        <li>ปรับปรุงและพัฒนาคุณภาพบริการ</li>
                    </ul>
                </div>

                <!-- Security -->
                <div style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f4e78;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #d4af37;
                    ">🔒 ความปลอดภัยของข้อมูล</h3>
                    <ul style="margin-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li>🔐 การเข้ารหัสข้อมูล (Encryption)</li>
                        <li>🔑 ระบบตรวจสอบตัวตนที่ปลอดภัย</li>
                        <li>📊 การแยกข้อมูลแบบใช้งาน</li>
                        <li>💾 สำรองข้อมูลอย่างสม่ำเสมอ</li>
                    </ul>
                </div>

                <!-- Checkboxes -->
                <div style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f4e78;
                        margin-bottom: 20px;
                    ">✓ ยินยอมและส่งฟอร์ม</h3>
                    <p style="
                        color: #dc3545;
                        font-size: 14px;
                        margin-bottom: 20px;
                    ">* จำเป็นต้องยินยอมทั้งหมด 5 ข้อ เพื่อใช้งานบริการ</p>

                    <div style="margin: 20px 0;">
                        <div style="
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        ">
                            <input type="checkbox" id="consentCheck1" name="consentCheck" style="
                                width: 20px;
                                height: 20px;
                                margin-right: 12px;
                                margin-top: 2px;
                                cursor: pointer;
                                accent-color: #1f4e78;
                                flex-shrink: 0;
                            ">
                            <label for="consentCheck1" style="
                                font-size: 14px;
                                line-height: 1.6;
                                cursor: pointer;
                                flex: 1;
                            ">
                                <strong>ข้อ 1:</strong> ฉันได้อ่านและเข้าใจนโยบายคุ้มครองข้อมูลส่วนบุคคลนี้แล้ว
                            </label>
                        </div>

                        <div style="
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        ">
                            <input type="checkbox" id="consentCheck2" name="consentCheck" style="
                                width: 20px;
                                height: 20px;
                                margin-right: 12px;
                                margin-top: 2px;
                                cursor: pointer;
                                accent-color: #1f4e78;
                                flex-shrink: 0;
                            ">
                            <label for="consentCheck2" style="
                                font-size: 14px;
                                line-height: 1.6;
                                cursor: pointer;
                                flex: 1;
                            ">
                                <strong>ข้อ 2:</strong> ฉันให้ความยินยอมให้เรารวบรวม ประมวลผล และใช้ข้อมูลส่วนบุคคลของฉัน
                            </label>
                        </div>

                        <div style="
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        ">
                            <input type="checkbox" id="consentCheck3" name="consentCheck" style="
                                width: 20px;
                                height: 20px;
                                margin-right: 12px;
                                margin-top: 2px;
                                cursor: pointer;
                                accent-color: #1f4e78;
                                flex-shrink: 0;
                            ">
                            <label for="consentCheck3" style="
                                font-size: 14px;
                                line-height: 1.6;
                                cursor: pointer;
                                flex: 1;
                            ">
                                <strong>ข้อ 3:</strong> ฉันเข้าใจว่าสามารถเพิกถอนความยินยอมนี้ได้ทุกเมื่อ
                            </label>
                        </div>

                        <div style="
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        ">
                            <input type="checkbox" id="consentCheck4" name="consentCheck" style="
                                width: 20px;
                                height: 20px;
                                margin-right: 12px;
                                margin-top: 2px;
                                cursor: pointer;
                                accent-color: #1f4e78;
                                flex-shrink: 0;
                            ">
                            <label for="consentCheck4" style="
                                font-size: 14px;
                                line-height: 1.6;
                                cursor: pointer;
                                flex: 1;
                            ">
                                <strong>ข้อ 4:</strong> ฉันอนุญาตให้เปิดเผยข้อมูลแก่ผู้ให้บริการที่เกี่ยวข้อง
                            </label>
                        </div>

                        <div style="
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding: 12px;
                            border-radius: 4px;
                            transition: background-color 0.3s ease;
                        ">
                            <input type="checkbox" id="consentCheck5" name="consentCheck" style="
                                width: 20px;
                                height: 20px;
                                margin-right: 12px;
                                margin-top: 2px;
                                cursor: pointer;
                                accent-color: #1f4e78;
                                flex-shrink: 0;
                            ">
                            <label for="consentCheck5" style="
                                font-size: 14px;
                                line-height: 1.6;
                                cursor: pointer;
                                flex: 1;
                            ">
                                <strong>ข้อ 5:</strong> ฉันรับทราบและยอมรับความเสี่ยงจากการใช้บริการออนไลน์
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer with Buttons -->
            <div style="
                background: #f8f9fa;
                padding: 30px;
                border-top: 1px solid #ddd;
                border-radius: 0 0 12px 12px;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            ">
                <button id="consentRejectBtn" onclick="rejectConsent()" style="
                    padding: 12px 30px;
                    background: #f8f9fa;
                    color: #333;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    ✕ ไม่ยินยอม
                </button>
                <button id="consentAcceptBtn" onclick="acceptConsent()" disabled style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #1f4e78 0%, #203864 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: not-allowed;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                ">
                    ✓ ยินยอมและดำเนินการต่อ
                </button>
            </div>
        </div>
    </div>
    `;

    // เพิ่ม HTML ลงไปใน body
    document.body.insertAdjacentHTML('beforeend', consentHTML);

    // เพิ่ม event listeners สำหรับ checkboxes
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`consentCheck${i}`).addEventListener('change', updateConsentButton);
    }
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

    // บันทึกลง localStorage
    localStorage.setItem('pdpaConsent', JSON.stringify(consentData));
    localStorage.setItem('pdpaConsentDate', new Date().toISOString());

    // ส่งไป API (ปรับแต่ง URL ตามระบบจริง)
    sendConsentToServer(consentData);

    // ปิดโมดัล
    hideConsentOverlay();

    // แสดงข้อความสำเร็จ
    showSuccessMessage('ยินยอมเรียบร้อยแล้ว! คุณสามารถใช้งานบริการได้แล้ว');
}

// ปฏิเสธการยินยอม
function rejectConsent() {
    if (confirm('หากคุณไม่ยินยอม คุณจะไม่สามารถใช้งานบริการได้ คุณแน่ใจหรือ?')) {
        // ล้างข้อมูลและปิด
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId');
        hideConsentOverlay();
        alert('คุณได้ปฏิเสธการยินยอม ระบบจะนำคุณออกจากระบบ');
        // Redirect to login or home page
        window.location.href = 'index.html';
    }
}

// ส่งข้อมูลยินยอมไปยัง Server
function sendConsentToServer(consentData) {
    // ปรับ URL endpoint ตามระบบจริง
    const apiEndpoint = '/api/consent' || 'http://localhost:3000/api/consent';

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(consentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Consent saved to server:', data);
    })
    .catch(error => {
        console.error('Error sending consent:', error);
        // ยังคงบันทึกลง localStorage แม้ว่า server หาตอบสนองไม่ได้
    });
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
