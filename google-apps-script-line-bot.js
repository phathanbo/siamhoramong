/**
 * 🤖 LINE Bot System - Google Apps Script
 *
 * ใช้งาน:
 * 1. สร้าง Google Apps Script project ใหม่
 * 2. คัดลอกโค้ดนี้ลงไป
 * 3. ตั้งค่า Properties (ดูเมนู Project Settings)
 * 4. Deploy เป็น Web App
 * 5. ใช้ URL ในไฟล์ line-subscribe.html
 *
 * คำแนะนำ: ใช้ Properties Service (ปลอดภัยกว่า hardcoded)
 */

// ⚙️ อ่านค่า configuration จาก Script Properties
const PROPS = PropertiesService.getScriptProperties();

// ถ้า Property ยังไม่มี ให้ set default (แทนที่ด้วยของจริง)
function initializeProperties() {
    const defaults = {
        'LINE_CHANNEL_ID': 'YOUR_LINE_CHANNEL_ID',
        'LINE_CHANNEL_SECRET': 'YOUR_LINE_CHANNEL_SECRET',
        'LINE_ACCESS_TOKEN': 'YOUR_LINE_CHANNEL_ACCESS_TOKEN',
        'ZODIAC_FORTUNES_SCRIPT_ID': 'YOUR_ZODIAC_FORTUNES_SCRIPT_ID'
    };

    Object.entries(defaults).forEach(([key, value]) => {
        if (!PROPS.getProperty(key)) {
            PROPS.setProperty(key, value);
        }
    });
}

// อ่านค่า LINE configuration
const LINE_CHANNEL_ID = PROPS.getProperty('LINE_CHANNEL_ID') || 'YOUR_LINE_CHANNEL_ID';
const LINE_CHANNEL_SECRET = PROPS.getProperty('LINE_CHANNEL_SECRET') || 'YOUR_LINE_CHANNEL_SECRET';
const LINE_ACCESS_TOKEN = PROPS.getProperty('LINE_ACCESS_TOKEN') || 'YOUR_LINE_CHANNEL_ACCESS_TOKEN';
const ZODIAC_FORTUNES_SCRIPT_ID = PROPS.getProperty('ZODIAC_FORTUNES_SCRIPT_ID') || 'YOUR_ZODIAC_FORTUNES_SCRIPT_ID';

// ชื่อ Sheet ในสมุดบัญชี
const SUBSCRIBERS_SHEET = "Subscribers";
const LOGS_SHEET = "Logs";

/**
 * 🔧 ตั้งค่า LINE Credentials
 *
 * วิธีใช้:
 * 1. เปิด Google Apps Script editor
 * 2. Run: setupLineCredentials()
 * 3. กรอก Channel ID, Secret, Access Token
 */
function setupLineCredentials() {
    const props = PropertiesService.getScriptProperties();

    // ❌ MANUAL: แทนที่ค่าด้านล่างด้วยของจริง
    props.setProperty('LINE_CHANNEL_ID', 'YOUR_ACTUAL_CHANNEL_ID');
    props.setProperty('LINE_CHANNEL_SECRET', 'YOUR_ACTUAL_CHANNEL_SECRET');
    props.setProperty('LINE_ACCESS_TOKEN', 'YOUR_ACTUAL_ACCESS_TOKEN');

    alert('✅ ตั้งค่า LINE Credentials สำเร็จ');
    Logger.log('Updated credentials');
}

/**
 * 📊 สร้าง Google Sheet เพื่อเก็บข้อมูล
 */
function setupGoogleSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // สร้าง Sheet สำหรับสมาชิก
    try {
        ss.insertSheet(SUBSCRIBERS_SHEET);
    } catch (e) {}

    const subSheet = ss.getSheetByName(SUBSCRIBERS_SHEET);
    if (subSheet.getLastRow() === 0) {
        subSheet.appendRow([
            "LINE User ID",
            "Display Name",
            "Zodiac (1-12)",
            "Frequency (daily/weekly/monthly)",
            "Created Date",
            "Last Sent",
            "Status (active/paused)",
            "Consent Accepted"
        ]);
    }

    // สร้าง Sheet สำหรับ Logs
    try {
        ss.insertSheet(LOGS_SHEET);
    } catch (e) {}

    const logSheet = ss.getSheetByName(LOGS_SHEET);
    if (logSheet.getLastRow() === 0) {
        logSheet.appendRow([
            "Timestamp",
            "Action",
            "User ID",
            "Details",
            "Status"
        ]);
    }
}

/**
 * 📨 Web App Handler
 */
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;

        if (action === "verifyLineLogin") {
            return handleLineLogin(data);
        } else if (action === "subscribeZodiac") {
            return handleSubscribe(data);
        } else if (action === "webhook") {
            return handleWebhook(data);
        } else {
            return createResponse({ success: false, message: "Unknown action" });
        }
    } catch (error) {
        addLog("ERROR", "doPost", "", error.toString(), "FAILED");
        return createResponse({ success: false, message: error.toString() });
    }
}

/**
 * 🔐 ตรวจสอบ LINE Login
 */
function handleLineLogin(data) {
    const code = data.code;

    // แลก code กับ access token
    const url = "https://api.line.biz/oauth2.0/token";
    const payload = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: data.redirectUri,
        client_id: LINE_CHANNEL_ID,
        client_secret: LINE_CHANNEL_SECRET
    };

    const options = {
        method: "post",
        payload: Object.keys(payload).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(payload[key])).join("&"),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        muteHttpExceptions: true
    };

    try {
        const response = UrlFetchApp.fetch(url, options);
        const result = JSON.parse(response.getContentText());

        if (result.access_token) {
            // ดึงข้อมูลผู้ใช้
            const userUrl = "https://api.line.biz/v2/oauth2.0/verify?access_token=" + result.access_token;
            const userResp = UrlFetchApp.fetch(userUrl);
            const userData = JSON.parse(userResp.getContentText());

            addLog("LOGIN", userData.userId, "LINE Login Success", "", "SUCCESS");

            return createResponse({
                success: true,
                userId: userData.userId,
                displayName: userData.displayName || "ผู้ใช้"
            });
        } else {
            addLog("LOGIN_ERROR", "", result.error, result.error_description, "FAILED");
            return createResponse({ success: false, message: "LINE authentication failed" });
        }
    } catch (error) {
        addLog("LOGIN_ERROR", "", error.toString(), "", "FAILED");
        return createResponse({ success: false, message: error.toString() });
    }
}

/**
 * 📝 บันทึกสมาชิกใหม่
 */
function handleSubscribe(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SUBSCRIBERS_SHEET);

    const userId = data.userId;
    const zodiac = data.zodiac;
    const frequency = data.frequency;

    // ตรวจสอบว่า user มี subscription แล้วไหม
    const range = sheet.getDataRange();
    const values = range.getValues();

    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === userId) {
            // อัปเดต subscription เดิม
            sheet.getRange(i + 1, 3).setValue(zodiac);
            sheet.getRange(i + 1, 4).setValue(frequency);
            sheet.getRange(i + 1, 6).setValue(new Date());
            sheet.getRange(i + 1, 7).setValue("active");

            addLog("SUBSCRIBE", userId, "Updated subscription", `Zodiac: ${zodiac}, Frequency: ${frequency}`, "SUCCESS");
            return createResponse({ success: true, message: "Subscription updated" });
        }
    }

    // สร้าง subscription ใหม่
    sheet.appendRow([
        userId,
        data.displayName || "ผู้ใช้",
        zodiac,
        frequency,
        new Date(),
        "",
        "active",
        true
    ]);

    addLog("SUBSCRIBE", userId, "New subscription", `Zodiac: ${zodiac}, Frequency: ${frequency}`, "SUCCESS");

    // ส่งข้อความต้อนรับ
    sendLineMessage(userId, "🎉 สมัครสมาชิกสำเร็จ!\nคุณจะได้รับพยากรณ์ดวงผ่าน LINE ตามความถี่ที่เลือก");

    return createResponse({ success: true, message: "Subscription created" });
}

/**
 * 🔔 ส่งพยากรณ์ให้ subscriber
 */
function sendDailyFortunes() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SUBSCRIBERS_SHEET);
    const range = sheet.getDataRange();
    const values = range.getValues();

    const today = new Date().toDateString();
    let sentCount = 0;

    for (let i = 1; i < values.length; i++) {
        const userId = values[i][0];
        const zodiacNum = values[i][2];
        const frequency = values[i][3];
        const lastSent = values[i][5];
        const status = values[i][6];

        // ตรวจสอบว่า should send หรือไม่
        if (status !== "active") continue;
        if (lastSent && new Date(lastSent).toDateString() === today) continue;
        if (frequency === "weekly" && new Date().getDay() !== 1) continue; // วันจันทร์
        if (frequency === "monthly" && new Date().getDate() !== 1) continue; // วันที่ 1

        try {
            // ดึงพยากรณ์จาก zodiac-fortune.js
            const fortune = getZodiacFortune(zodiacNum);
            const message = formatFortuneMessage(zodiacNum, fortune);

            // ส่งข้อความ
            sendLineMessage(userId, message);

            // อัปเดต last sent date
            sheet.getRange(i + 1, 6).setValue(new Date());
            sentCount++;

            addLog("SENT", userId, "Fortune sent", `Zodiac: ${zodiacNum}, Frequency: ${frequency}`, "SUCCESS");
        } catch (error) {
            addLog("SEND_ERROR", userId, error.toString(), `Zodiac: ${zodiacNum}`, "FAILED");
        }
    }

    return { success: true, sentCount: sentCount };
}

/**
 * 📬 ส่งข้อความไปยัง LINE
 */
function sendLineMessage(userId, message) {
    const url = "https://api.line.biz/v2/bot/message/push";

    const payload = {
        to: userId,
        messages: [{
            type: "text",
            text: message
        }]
    };

    const options = {
        method: "post",
        headers: {
            "Authorization": "Bearer " + LINE_ACCESS_TOKEN,
            "Content-Type": "application/json"
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    return response.getResponseCode() === 200;
}

/**
 * ✨ ดึงพยากรณ์ดวง
 */
function getZodiacFortune(zodiacNum) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // ในจริง จะเรียก zodiac-fortune.js ที่มีอยู่
    // ตอนนี้ return ข้อมูลตัวอย่าง
    const sampleFortunes = {
        1: "♈ เมษ - วันนี้เป็นวันแห่งความกำลังใจ ทำให้ประสบความสำเร็จในสิ่งที่ลงมือทำ",
        2: "♉ พฤษภา - เป็นวันดีสำหรับการออมเงิน การลงทุน และการสร้างสิ่งคงทน",
        3: "♊ เมถุน - ความสื่อสารจะดีวันนี้ โอกาสดีสำหรับการเรียนรู้อะไรใหม่",
        4: "♋ กรกฎ - อารมณ์อาจผันผวนเล็กน้อย ควรสนใจเรื่องครอบครัว",
        5: "♌ สิงห์ - วันแห่งการได้รับการยอมรับ ความสำเร็จในสิ่งที่ตั้งใจทำ",
        6: "♍ กันย์ - วันดีสำหรับการปรับปรุง ดูแลสุขภาพ และการวิจารณ์อย่างสร้างสรรค์",
        7: "♎ ตุลย์ - ความสัมพันธ์จะดีมีความสมดุล เหมาะสำหรับการพูดคุยเรื่องสำคัญ",
        8: "♏ แมง - วันแห่งการเปลี่ยนแปลง ความลึกซึ้งในความรู้สึก",
        9: "♐ ธนู - วันดีสำหรับการเดินทาง การค้นหา และการขยายมุมมอง",
        10: "♑ มังกร - วันสำหรับการวางแผน การสร้างสรรค์ และความรับผิดชอบ",
        11: "♒ กุมภ์ - ความเป็นอิสระและการคิดล้ำหน้า โอกาสดีสำหรับการร่วมมือ",
        12: "♓ มีน - วันสำหรับสร้างสรรค์ ธรรมชาติของจินตนาการและศิลปะ"
    };

    return sampleFortunes[zodiacNum] || "ไม่พบข้อมูล";
}

/**
 * 📝 จัดรูปแบบข้อความ
 */
function formatFortuneMessage(zodiacNum, fortune) {
    const zodiacNames = [
        "เมษ", "พฤษภา", "เมถุน", "กรกฎ", "สิงห์", "กันย์",
        "ตุลย์", "แมง", "ธนู", "มังกร", "กุมภ์", "มีน"
    ];

    const today = new Date().toLocaleDateString('th-TH');

    return `📿 พยากรณ์ดวง ${zodiacNames[zodiacNum - 1]}\n📅 ${today}\n\n${fortune}\n\n✨ สยามโหรามงคล`;
}

/**
 * 📊 บันทึก Log
 */
function addLog(action, userId, details, description, status) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(LOGS_SHEET);

    sheet.appendRow([
        new Date(),
        action,
        userId || "",
        description || "",
        status
    ]);
}

/**
 * ⚙️ ตั้งค่า Daily Trigger (ต้องทำเอง)
 *
 * คำแนะนำ:
 * 1. ไปที่ Google Apps Script editor
 * 2. ไป Triggers (ไอเดียแสดงเป็น ⏰)
 * 3. Create new trigger
 * 4. เลือก "sendDailyFortunes" function
 * 5. วันละครั้ง เวลา 7 โมงเช้า
 */

/**
 * 🔧 Helper: สร้าง Response
 */
function createResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🧪 Test Function
 */
function testSubscribe() {
    setupGoogleSheet();
    const result = handleSubscribe({
        userId: "U1234567890abcdef1234567890abcdef",
        displayName: "Test User",
        zodiac: 1,
        frequency: "daily"
    });
    Logger.log(result);
}

function testSendFortune() {
    const result = sendDailyFortunes();
    Logger.log(result);
}
