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
        'LINE_CHANNEL_ID': '2011471468',
        'LINE_CHANNEL_SECRET': 'af744f1156894a20b245a991983004a8',
        'LINE_ACCESS_TOKEN': 'cU2qdts0aHY8x8Vz/Q3jnHumGpNk1OFwT/8T1yBiJc4H5GeljkJnd56am4FB2Jk0+YCQxQn/w9W2ZBAFimOlV7hy+FUgcFhWttKnl0nFvist1wl2jKIpX+XfXZWJmE5hJrGLdxAVPAabc98iQ3ORSQdB04t89/1O/w1cDnyilFU=',
        'ZODIAC_FORTUNES_SCRIPT_ID': 'YOUR_ZODIAC_FORTUNES_SCRIPT_ID'
    };

    Object.entries(defaults).forEach(([key, value]) => {
        if (!PROPS.getProperty(key)) {
            PROPS.setProperty(key, value);
        }
    });
}

// อ่านค่า LINE configuration
const LINE_CHANNEL_ID = PROPS.getProperty('LINE_CHANNEL_ID') || '2011471468';
const LINE_CHANNEL_SECRET = PROPS.getProperty('LINE_CHANNEL_SECRET') || 'af744f1156894a20b245a991983004a8';
const LINE_ACCESS_TOKEN = PROPS.getProperty('LINE_ACCESS_TOKEN') || 'cU2qdts0aHY8x8Vz/Q3jnHumGpNk1OFwT/8T1yBiJc4H5GeljkJnd56am4FB2Jk0+YCQxQn/w9W2ZBAFimOlV7hy+FUgcFhWttKnl0nFvist1wl2jKIpX+XfXZWJmE5hJrGLdxAVPAabc98iQ3ORSQdB04t89/1O/w1cDnyilFU=';
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
 * 🌐 GET Handler (Health Check & Quick Verify)
 */
function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "สยามโหรามงคล LINE Webhook is active" }))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 📨 Web App Handler (Webhook & API)
 */
function doPost(e) {
    try {
        if (!e || !e.postData || !e.postData.contents) {
            return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
        }

        const data = JSON.parse(e.postData.contents);

        // 1. ตรวจสอบว่าส่งมาจาก LINE Webhook (มี events array)
        if (data.events && Array.isArray(data.events)) {
            return handleWebhook(data);
        }

        // 2. ตรวจสอบตาม action อื่นๆ ของเว็บไซต์
        const action = data.action;
        if (action === "verifyLineLogin") {
            return handleLineLogin(data);
        } else if (action === "subscribeZodiac") {
            return handleSubscribe(data);
        } else if (action === "webhook") {
            return handleWebhook(data);
        } else {
            return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
        }
    } catch (error) {
        // แม้เกิด error ก็ให้ return 200 OK เพื่อให้ LINE Verify ผ่านเสมอ
        return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
    }
}

/**
 * 💬 จัดการข้อความ Webhook จาก LINE (ระบบยืนยันตัวตน + แยกสิทธิ์คำถาม 2 ระดับ)
 */
function handleWebhook(data) {
    const events = data.events || [];
    events.forEach(event => {
        try {
            if (event.type === "message" && event.message.type === "text") {
                const userMsg = event.message.text.trim();
                const replyToken = event.replyToken;
                const userId = event.source ? event.source.userId : "";
                
                // ประมวลผลคำตอบ
                const replyText = processUserMessage(userId, userMsg);
                replyLineMessage(replyToken, replyText);
            }
        } catch (err) {
            // ป้องกัน script หยุดทำงานหากมี error ภายใน
            if (event.replyToken) {
                replyLineMessage(event.replyToken, "🔮 สยามโหรามงคล: กำลังประมวลผลดวงชะตา กรุณาลองใหม่อีกครั้ง");
            }
        }
    });

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 👑 รายชื่อแพ็กเกจระดับสมาชิกอย่างเป็นทางการ 16 ระดับ (จาก src/utils/tiers.js)
 */
const OFFICIAL_TIERS = [
    { name: "ทดลองใช้", level: 0, badge: "🌱", minDays: 0 },
    { name: "ธรรมดา", level: 1, badge: "🔹", priceM: 60 },
    { name: "ทองแดง", level: 2, badge: "🥉", priceM: 90 },
    { name: "เงิน", level: 3, badge: "🥈", priceM: 150 },
    { name: "ทองคำ", level: 4, badge: "🥇", priceM: 300 },
    { name: "ทองคำขาว", level: 5, badge: "⚪", priceM: 600 },
    { name: "ไข่มุก", level: 6, badge: "🦪", priceM: 900 },
    { name: "ทับทิม", level: 7, badge: "🔴", priceM: 1200 },
    { name: "ไพฑูรย์", level: 8, badge: "💎", priceM: 1500 },
    { name: "มรกต", level: 9, badge: "💚", priceM: 3000 },
    { name: "เพชร", level: 10, badge: "💠", priceM: 6000 },
    { name: "มงกุฎ", level: 11, badge: "👑", priceM: 9000 },
    { name: "มงกุฎเพชร", level: 12, badge: "✨👑", priceM: 18000 },
    { name: "ไตรมงกุฎ", level: 13, badge: "🔱👑", priceM: 27000 },
    { name: "เพชรยอดมงกุฎ", level: 14, badge: "🌟👑", priceM: 36000 },
    { name: "วิมาน", level: 15, badge: "🏰", priceM: "VIP สูงสุด" }
];

function getTierLevel(tierName) {
    if (!tierName) return 0;
    const found = OFFICIAL_TIERS.find(t => t.name === tierName);
    return found ? found.level : 0;
}

function getTierBadge(tierName) {
    if (!tierName) return "🌱";
    const found = OFFICIAL_TIERS.find(t => t.name === tierName);
    return found ? found.badge : "🌱";
}

/**
 * 🧠 วิเคราะห์ข้อความ และคัดกรองตามระดับแพ็กเกจสมาชิก 16 ระดับ
 */
function processUserMessage(userId, msg) {
    const cleanMsg = msg.replace(/\s+/g, " ");

    // 1. ตรวจสอบการ "ผูกบัญชี" หรือพิมพ์รหัสสมาชิก 10-11 หลัก (เช่น 20260705001)
    const linkMatch = cleanMsg.match(/(?:ผูกบัญชี|รหัสสมาชิก|สมาชิก|link)\s*[:=]?\s*(\d{10,11})/i) || cleanMsg.match(/^(\d{10,11})$/);
    if (linkMatch) {
        const memberId = linkMatch[1];
        return linkMemberAccount(userId, memberId);
    }

    if (cleanMsg.includes("วิธีผูกบัญชี") || cleanMsg === "ผูกบัญชี") {
        return "🔑 [วิธีผูกบัญชีสมาชิกสยามโหรามงคล]\n\n" +
               "สำหรับสมาชิกที่มีรหัส 10-11 หลักจากบนเว็บไซต์แล้ว ให้พิมพ์ในช่องแชทได้ทันที เช่น:\n\n" +
               "👉 'ผูกบัญชี ตามด้วยเลขสมาชิกของคุณ'\n" +
               "เช่น: ผูกบัญชี 20260705001\n" +
               "หรือพิมพ์เฉพาะตัวเลขส่งมาได้เลย เช่น: 20260705001\n\n" +
               "ระบบจะดึงชื่อและระดับแพ็กเกจของท่านมาปลดล็อกสิทธิ์ให้ทันทีครับ!";
    }

    // 2. ดึงข้อมูลสมาชิกและระดับแพ็กเกจ (Level 0 ถึง 15)
    const memberInfo = getMemberByLineId(userId);
    const userTier = memberInfo ? memberInfo.tier : "บุคคลทั่วไป";
    const userLevel = memberInfo ? getTierLevel(userTier) : -1;
    const tierBadge = memberInfo ? getTierBadge(userTier) : "";

    // ──────────────────────────────────────────────
    // 🟢 หมวดฟรี / ทดลองใช้ (Level 0 ขึ้นไป หรือ บุคคลทั่วไป)
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ดวงวันนี้") || cleanMsg === "ดวง" || cleanMsg.includes("พยากรณ์")) {
        return "✨ [พยากรณ์มงคลประจำวัน]\n" +
               "เกณฑ์ชะตาวันนี้ มีกระแสดาวมงคลหนุนนำด้านการงานและการเจรจา สิ่งที่ติดขัดจะเริ่มคลี่คลาย มีโอกาสได้รับโชคลาภแบบไม่คาดฝัน\n\n" +
               "💡 เคล็ดลับเสริมดวง: ทำบุญค่าน้ำค่าไฟ หรือสวดบทมหาจักรพรรดิจะช่วยเปิดทางทรัพย์ให้ราบรื่นยิ่งขึ้น";
    }

    if (cleanMsg.includes("ฤกษ์")) {
        return "⏰ [ปฏิทินฤกษ์มงคลประจำวัน]\n" +
               "• 09:09 - 10:39 น. (ภูมิปาโลฤกษ์) : เหมาะสำหรับตั้งศาล ขึ้นบ้านใหม่ เจรจาค้าขาย\n" +
               "• 13:19 - 14:49 น. (ราชาฤกษ์) : เหมาะสำหรับการติดต่อผู้ใหญ่ เซ็นสัญญา เริ่มต้นกิจการ\n\n" +
               "🚫 ยามที่ไม่ควรประกอบมงคล: ยามกาลกิณีช่วงบ่ายแก่ๆ หลีกเลี่ยงการตัดสินใจเรื่องใหญ่";
    }

    if (cleanMsg.includes("สีมงคล") || cleanMsg.includes("สีเสื้อ")) {
        return "🎨 [สีมงคลเสริมชะตาประจำวัน]\n" +
               "• เสริมโชคลาภ/เงินทอง: สีเขียวเหนี่ยวทรัพย์, สีทอง\n" +
               "• เสริมอำนาจวาสนา: สีม่วง, สีแดงเลือดนก\n" +
               "• เสริมผู้อุปถัมภ์: สีขาว, สีครีม\n" +
               "❌ สีกาลกิณีห้ามใส่: สีกรมท่า, สีน้ำเงินเข้ม";
    }

    if (cleanMsg.includes("เซียมซี") || cleanMsg.includes("เสี่ยงเซียมซี")) {
        const siamsiNum = Math.floor(Math.random() * 28) + 1;
        return `🎋 [ผลเสี่ยงเซียมซีมงคล - ใบที่ ${siamsiNum}]\n` +
               `คำทำนาย: ใบนี้เปรียบดั่งไม้งามยามวสันต์ เริ่มผลิดอกออกผล ความกังวลใจเรื่องการงานและการเงินจะค่อยๆ คลี่คลาย มีเกณฑ์ได้รับความเมตตาจากผู้ใหญ่ ขอให้หมั่นรักษาศีลทำสมาธิ`;
    }

    if (cleanMsg.includes("ฝัน") || cleanMsg.includes("ทำนายฝัน")) {
        return "🌙 [คลังทำนายฝันและเลขมงคล]\n" +
               "ท่านสามารถพิมพ์ระบุความฝันได้ เช่น 'ฝันเห็นงู', 'ฝันเห็นช้าง', 'ฝันเห็นพญานาค'\n" +
               "ระบบมีคลังคำศัพท์โบราณกว่า 360 คำ พร้อมถอดรหัสเลขเสี่ยงโชคตามตำราพรหมชาติครับ";
    }

    if (cleanMsg.includes("ปีชง") || cleanMsg.includes("ชง")) {
        return "🐉 [ตรวจปีชงและปีเสริม 12 นักษัตร]\n" +
               "• การปะทะชงตรง 100%: ชวด ชง มะเมีย | ฉลู ชง มะแม | ขาล ชง วอก | เถาะ ชง ระกา | มะโรง ชง จอ | มะเส็ง ชง กุน\n" +
               "• แนะนำทำบุญฝากดวงชะตากับองค์ไท้ส่วยเอี๊ย และปล่อยปลาเสริมบารมี";
    }

    // ──────────────────────────────────────────────
    // 🔵 หมวดระดับธรรมดา (Level 1+) : บทสวดมนต์ / ข้อห้ามรายวัน / ปฏิทินจันทรคติ
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("บทสวด") || cleanMsg.includes("สวดมนต์")) {
        if (userLevel < 1) {
            return `🔒 [คลังบทสวดมนต์มงคล]\nต้องใช้สิทธิ์แพ็กเกจระดับ "ธรรมดา" (Level 1) ขึ้นไปครับ`;
        }
        return "📿 [บทสวดมนต์มงคลหนุนดวง]\n" +
               "แนะนำพระคาถามหาจักรพรรดิ (หลวงปู่ดู่) หรือพระคาถาชินบัญชร สวด ๙ จบในเวลาเช้าหรือก่อนนอน เพื่อเสริมสิริมงคล ปัดเป่าอุปสรรคและสิ่งอัปมงคลทั้งปวง";
    }

    if (cleanMsg.includes("ข้อห้าม") || cleanMsg.includes("ห้ามทำ")) {
        if (userLevel < 1) {
            return `🔒 [ข้อห้ามโบราณรายวัน]\nต้องใช้สิทธิ์แพ็กเกจระดับ "ธรรมดา" (Level 1) ขึ้นไปครับ`;
        }
        return "⚠️ [ข้อห้ามมงคลตามโบราณประเพณี]\n" +
               "วันนี้ห้ามประกอบพิธีมงคลตัดผม ตัดเล็บ ห้ามเริ่มงานขุดเจาะหรือลงเสาเอกในช่วงบ่ายคล้อย ให้เน้นการทำบุญปล่อยสัตว์น้ำเพื่อผ่อนหนักเป็นเบา";
    }

    // ──────────────────────────────────────────────
    // 🔵 หมวดระดับทองแดง (Level 2+) : ยามอุบากอง / ดิถี / โชคกำเนิด / ไพ่ยิปซี
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("อุบากอง") || cleanMsg.includes("ยามอุบากอง")) {
        if (userLevel < 2) {
            return `🔒 [ยามอุบากองยาตราก้าวหน้า]\nต้องใช้สิทธิ์แพ็กเกจระดับ "ทองแดง" (Level 2) ขึ้นไปครับ`;
        }
        return "🧭 [ยามอุบากองยาตราก้าวหน้า]\n" +
               "• ศูนย์หนึ่งอย่าพึงจร แม้ราษฎรจะอัปรา\n" +
               "• สองศูนย์แถวตรงหน้า มีโชคลาภตลอดทาง\n" +
               "ยามปัจจุบันตกเกณฑ์มงคล 'สองศูนย์' เหมาะแก่การเดินทางไกล เจรจาติดต่อ และเสี่ยงโชค";
    }

    // ──────────────────────────────────────────────
    // 🟣 หมวดระดับเงิน (Level 3+) : ลัคนา / ทิศเนื้อคู่ / กาลโยค
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ทิศเนื้อคู่") || cleanMsg.includes("เนื้อคู่") || cleanMsg.includes("ลัคนา")) {
        if (userLevel < 3) {
            return `🔒 [ศาสตร์วิเคราะห์เนื้อคู่และลัคนา]\n` +
                   `ศาสตร์นี้ต้องการสิทธิ์แพ็กเกจขั้นต่ำ: "ระดับเงิน" (Level 3) ขึ้นไป\n` +
                   `สถานะปัจจุบันของท่าน: ${userTier} ${tierBadge}`;
        }
        return `🧭 [วิเคราะห์ทิศที่อยู่เนื้อคู่ - สมาชิกแพ็กเกจ ${userTier} ${tierBadge}]\n` +
               `คำนวณตามเศษวันเกิดและปีนักษัตรของท่าน: เนื้อคู่มีเกณฑ์อยู่ทางทิศตะวันออกเฉียงเหนือหรือทิศพายัพ เป็นคนผิวสองสี อุปนิสัยสุขุมรอบคอบ พูดจามีหลักการ และเกื้อหนุนหน้าที่การงาน`;
    }

    // ──────────────────────────────────────────────
    // 🟣 หมวดระดับทองคำ (Level 4+) : วิเคราะห์ชื่อ / เลขศาสตร์ / ฮวงจุ้ย
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("วิเคราะห์ชื่อ") || cleanMsg.includes("ชื่อมงคล") || cleanMsg.includes("ฮวงจุ้ย") || cleanMsg.includes("เลขศาสตร์")) {
        if (userLevel < 4) {
            return `🔒 [ศาสตร์เลขศาสตร์ชื่อมงคลและฮวงจุ้ย]\nต้องใช้สิทธิ์แพ็กเกจระดับ "ทองคำ" (Level 4) ขึ้นไปครับ`;
        }
        return `🔮 [วิเคราะห์เลขศาสตร์และพลังฮวงจุ้ย - สมาชิก ${userTier} ${tierBadge}]\n` +
               `ระบบวิเคราะห์ตามถอดรหัสกำลังดาวนพเคราะห์: ทิศมงคลประจำเดือนนี้คือ ทิศตะวันออกและทิศใต้ ช่วยกระตุ้นกระแสพลังโชคลาภ สำหรับชื่อมงคลสามารถกดวิเคราะห์ค่าอักษรทักษาได้ในหน้าเว็บ`;
    }

    // ──────────────────────────────────────────────
    // ⚪ หมวดระดับทองคำขาว (Level 5+) : ฉัตร 3 ชั้น / ดาวคู่มิตร-ศัตรู / ทักษา
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ฉัตร 3 ชั้น") || cleanMsg.includes("ฉัตรสามชั้น") || cleanMsg.includes("ดาวคู่มิตร")) {
        if (userLevel < 5) {
            return `🔒 [วิชามหามงคลฉัตร ๓ ชั้น]\nต้องใช้สิทธิ์แพ็กเกจระดับ "ทองคำขาว" (Level 5) ขึ้นไปครับ`;
        }
        return `✨ [วิชามหามงคลฉัตร ๓ ชั้น - สมาชิก ${userTier} ${tierBadge}]\n` +
               `ชั้นที่ ๑ ฐานชะตากำเนิด: มีดาวพฤหัสบดีคอยคุ้มครอง\n` +
               `ชั้นที่ ๒ พระเกตุหนุนส่ง: เกณฑ์แคล้วคลาดปลอดภัย\n` +
               `ชั้นที่ ๓ ยอดฉัตรมงคล: เปิดรับเกียรติยศชื่อเสียง`;
    }

    // ──────────────────────────────────────────────
    // 🦪 หมวดระดับไข่มุก (Level 6+) : ตัดอายุคนป่วย / ต่อชะตาชีวิต / ฤกษ์เปิดกิจการ
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ตัดอายุ") || cleanMsg.includes("คนป่วย") || cleanMsg.includes("ต่อชะตา")) {
        if (userLevel < 6) {
            return `🔒 [วิชาพรหมชาติทักษาตัดอายุคนป่วยและต่อชะตาชีวิต]\n` +
                   `ศาสตร์นี้ต้องการสิทธิ์แพ็กเกจระดับ "ไข่มุก" (Level 6) ขึ้นไปครับ\n` +
                   `สถานะปัจจุบันของท่าน: ${userTier} ${tierBadge}`;
        }
        return `⚕️ [พยากรณ์เกณฑ์ตัดอายุคนป่วยและต่อชะตา - แพ็กเกจ ${userTier} ${tierBadge}]\n` +
               `คำนวณตามสูตร ๗ บวก ๓ คูณและเบญจขันธ์โบราณ: เกณฑ์ชะตาอยู่ในช่วง 'พักฟื้นหนุนธาตุ' แนะนำให้จุดเทียนมงคลกำลังวันเกิด ๑๒ เล่ม และปล่อยปลาไหลเพื่อเสริมธาตุน้ำให้คนป่วย`;
    }

    // ──────────────────────────────────────────────
    // 💎 หมวดระดับไพฑูรย์ (Level 8+) : ฉัตร 9 ชั้น / สัตตเลข 7 ตัว 9 ฐาน
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("สัตตเลข") || cleanMsg.includes("7 ตัว") || cleanMsg.includes("ฉัตร 9 ชั้น") || cleanMsg.includes("ฉัตร๙ชั้น") || cleanMsg.includes("มหาทักษา")) {
        if (userLevel < 8) {
            return `🔒 [คัมภีร์สัตตเลข ๗ ตัว ๙ ฐาน และฉัตร ๙ ชั้น]\n` +
                   `ต้องการสิทธิ์แพ็กเกจระดับ "ไพฑูรย์" (Level 8) ขึ้นไปครับ\n` +
                   `สถานะปัจจุบันของท่าน: ${userTier} ${tierBadge}`;
        }
        return `📜 [บันทึกมหาทักษาและสัตตเลข ๗ ตัว ๙ ฐาน - แพ็กเกจ ${userTier} ${tierBadge}]\n` +
               `เรียน คุณ ${memberInfo.displayName || "สมาชิกผู้มีเกียรติ"}\n` +
               `ฐานกำลังดาวรอบปัจจุบันกำลังเสวยภูมิ 'ศรี' หนุนนำด้านการเงินและการลงทุน ฐานที่ ๙ ตกเกณฑ์มหาจักรพรรดิ สามารถเปิดดูกราฟ 7 ตัว 9 ฐานฉบับสมบูรณ์ได้ในหน้าโปรไฟล์ของคุณ`;
    }

    // ──────────────────────────────────────────────
    // 💚 หมวดระดับมรกต-เพชร (Level 9-10+) : 12 ภพ ลัคนา / ทศาดาว / ผูกดวงชะตาไทย
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("12 ภพ") || cleanMsg.includes("เรือนชะตา") || cleanMsg.includes("ทศา") || cleanMsg.includes("ผูกดวงไทย")) {
        if (userLevel < 9) {
            return `🔒 [๑๒ ภพเรือนชะตาและทศาดาวเสวยอายุ]\nต้องใช้สิทธิ์แพ็กเกจระดับ "มรกต" (Level 9) ขึ้นไปครับ`;
        }
        return `⭐ [๑๒ ภพเรือนชะตาและระบบทศา - แพ็กเกจ ${userTier} ${tierBadge}]\n` +
               `ภพตนุ ลาภะ และกัมมะ มีดาวพฤหัสบดีตรีโกณร่วมธาตุ หนุนนำให้กิจการงานมีความมั่นคงสูง`;
    }

    // ──────────────────────────────────────────────
    // 👑 หมวดระดับมงกุฎ-เพชรยอดมงกุฎ (Level 11-14+) : ดาวจรรายเดือน / ดวงเมืองรัตนโกสินทร์
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ดาวจร") || cleanMsg.includes("ดวงเมือง") || cleanMsg.includes("รัตนโกสินทร์")) {
        if (userLevel < 11) {
            return `🔒 [ระบบดาวจรและคัมภีร์ดวงเมืองรัตนโกสินทร์]\nต้องใช้สิทธิ์แพ็กเกจระดับ "มงกุฎ" (Level 11) ขึ้นไปครับ`;
        }
        return `🏛️ [การโคจรของดาวจรและดวงเมืองรัตนโกสินทร์ - แพ็กเกจ ${userTier} ${tierBadge}]\n` +
               `ดาวพฤหัสบดียกย้ายเข้าสู่ตำแหน่งตรีโกณ ส่งกระแสหนุนนำเศรษฐกิจและการค้าการลงทุน`;
    }

    // ──────────────────────────────────────────────
    // 🏰 หมวดระดับวิมาน (Level 15 VIP สูงสุด) : VIP ผูกดวงคู่สมพงษ์เชิงลึก 3 มิติ
    // ──────────────────────────────────────────────
    if (cleanMsg.includes("ผูกดวง") || cleanMsg.includes("สมพงษ์เชิงลึก") || cleanMsg.includes("synastry") || cleanMsg.includes("วิมาน") || cleanMsg.includes("สมพงษ์")) {
        if (userLevel < 15) {
            return `🏰 [VIP ผูกดวงคู่สมพงษ์เชิงลึก 3 มิติ]\n\n` +
                   `ศาสตร์นี้เป็นระดับสูงสุด "แพ็กเกจวิมาน" (Grand Royal Tier)\n` +
                   `วิเคราะห์ความเข้ากันได้แบบ 3 มิติ (มหาทักษา + ธาตุกำเนิด + ปีนักษัตร + วรรณะ 36 แต้ม)\n\n` +
                   `สถานะของท่าน: ${userTier} ${tierBadge}\n` +
                   `ติดต่ออาจารย์โดยตรงเพื่อรับคำปรึกษาพิเศษสำหรับแพ็กเกจวิมาน`;
        }
        return `🏰 [อัครมหาพยากรณ์คู่สมพงษ์ - แพ็กเกจวิมาน VIP]\n` +
               `ระบบผูกดวงคู่รัก 3 มิติระดับสมบูรณ์แบบพร้อมให้บริการแล้ว ท่านสามารถระบุวันเดือนปีเกิดและเวลาตกฟากของทั้งสองฝ่ายเพื่อประมวลผล Gun Milan และความสมพงษ์ธาตุได้ทันที`;
    }

    // ──────────────────────────────────────────────
    // 🔮 ข้อความต้อนรับและแสดงสถานะแพ็กเกจปัจจุบัน
    // ──────────────────────────────────────────────
    let welcome = "🔮 ยินดีต้อนรับสู่ สยามโหรามงคล!\n\n";
    if (memberInfo) {
        welcome += `👤 สมาชิก: ${memberInfo.displayName}\n`;
        welcome += `รหัส: ${memberInfo.memberId}\n`;
        welcome += `ระดับแพ็กเกจ: ${userTier} ${tierBadge} (Level ${userLevel}/15)\n\n`;
    } else {
        welcome += `💡 สมาชิกเว็บไซต์: พิมพ์ 'ผูกบัญชี [รหัส 10 หลัก]' เช่น:\n👉 'ผูกบัญชี 20260705001' เพื่อเชื่อมต่อแพ็กเกจของคุณ\n\n`;
    }
    welcome += "ท่านสามารถพิมพ์ถามได้ดังนี้:\n" +
               "• 'ดวงวันนี้', 'ฤกษ์', 'สีมงคล', 'เซียมซี' (ฟรี)\n" +
               "• 'บทสวดมนต์', 'ข้อห้าม' (ระดับธรรมดา)\n" +
               "• 'ยามอุบากอง' (ระดับทองแดง)\n" +
               "• 'ทิศเนื้อคู่', 'ลัคนา' (ระดับเงิน)\n" +
               "• 'วิเคราะห์ชื่อ', 'ฮวงจุ้ย' (ระดับทองคำ)\n" +
               "• 'ฉัตร 3 ชั้น' (ระดับทองคำขาว)\n" +
               "• 'ตัดอายุคนป่วย', 'ต่อชะตา' (ระดับไข่มุก)\n" +
               "• 'สัตตเลข 7 ตัว', 'ฉัตร 9 ชั้น' (ระดับไพฑูรย์)\n" +
               "• '12 ภพเรือนชะตา', 'ทศา' (ระดับมรกต)\n" +
               "• 'ดาวจร', 'ดวงเมือง' (ระดับมงกุฎ)\n" +
               "• 'ผูกดวงคู่สมพงษ์' (ระดับวิมาน)";
    return welcome;
}

/**
 * 🔗 ฟังก์ชันผูก LINE Account เข้ากับรหัสสมาชิก 10-11 หลัก
 */
function linkMemberAccount(userId, memberId) {
    if (!userId) {
        return "⚠️ ไม่สามารถระบุ LINE ID ได้ กรุณาลองใหม่อีกครั้ง";
    }

    // ข้อมูลสมาชิกจากระบบ
    let memberName = "สมาชิก";
    let memberTier = "ทดลองใช้"; // ค่าเริ่มต้น หรือดึงตามรหัส

    if (memberId === "20260705001") {
        memberName = "คุณ พิรุฬห์ บุญเพ็ชร์";
        memberTier = "ทดลองใช้";
    }

    // บันทึกลงใน Script Properties เพื่อให้จำ User ID นี้ได้ถาวร
    try {
        const userKey = "USER_" + userId;
        PROPS.setProperty(userKey, JSON.stringify({
            userId: userId,
            memberId: memberId,
            displayName: memberName,
            tier: memberTier,
            linkedAt: new Date().toISOString()
        }));
    } catch (e) {}

    const badge = getTierBadge(memberTier);
    const level = getTierLevel(memberTier);

    return `🎉 ผูกบัญชีสมาชิกสำเร็จ!\n\n` +
           `👤 ชื่อผู้ใช้: ${memberName}\n` +
           `รหัสสมาชิก: ${memberId}\n` +
           `ระดับแพ็กเกจ: ${memberTier} ${badge} (Level ${level}/15)\n\n` +
           `สถานะการเข้าใช้งานได้รับการยืนยันแล้ว สามารถพิมพ์ 'เมนู' เพื่อดูศาสตร์ที่ท่านเปิดใช้งานได้ทันทีครับ!`;
}

/**
 * 🔍 ค้นหาข้อมูลสมาชิกจาก LINE User ID
 */
function getMemberByLineId(userId) {
    if (!userId) return null;
    try {
        // 1. อ่านจาก Script Properties (เสถียรและเร็วที่สุด)
        const userKey = "USER_" + userId;
        const saved = PROPS.getProperty(userKey);
        if (saved) {
            return JSON.parse(saved);
        }

        // 2. อ่านจาก Spreadsheet (ถ้ามี)
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss) {
            const sheet = ss.getSheetByName(SUBSCRIBERS_SHEET);
            if (sheet) {
                const range = sheet.getDataRange();
                const values = range.getValues();
                for (let i = 1; i < values.length; i++) {
                    if (values[i][0] === userId) {
                        const memberId = values[i][8];
                        if (memberId && String(memberId).trim().length >= 8) {
                            return {
                                userId: values[i][0],
                                displayName: values[i][1],
                                memberId: String(memberId).trim(),
                                tier: "ทดลองใช้"
                            };
                        }
                    }
                }
            }
        }
    } catch (e) {
        return null;
    }
    return null;
}

/**
 * ↩️ ตอบกลับข้อความผ่าน Reply Token
 */
function replyLineMessage(replyToken, text) {
    if (!replyToken || replyToken === "00000000000000000000000000000000" || replyToken === "ffffffffffffffffffffffffffffffff") {
        return; // ข้ามกรณี LINE ส่ง Verify ping มา
    }
    const url = "https://api.line.me/v2/bot/message/reply";
    // สร้างปุ่ม Quick Reply เด้งเหนือช่องพิมพ์ข้อความ
    const quickReplyItems = [
        { type: "action", action: { type: "message", label: "🌟 ดวงวันนี้", text: "ดวงวันนี้" } },
        { type: "action", action: { type: "message", label: "⏰ ฤกษ์มงคล", text: "ฤกษ์" } },
        { type: "action", action: { type: "message", label: "🎨 สีมงคล", text: "สีมงคล" } },
        { type: "action", action: { type: "message", label: "🎋 เสี่ยงเซียมซี", text: "เซียมซี" } },
        { type: "action", action: { type: "message", label: "🧭 ทิศเนื้อคู่", text: "ทิศเนื้อคู่" } },
        { type: "action", action: { type: "message", label: "📜 มหาทักษา", text: "มหาทักษา" } },
        { type: "action", action: { type: "message", label: "🏰 ผูกดวงสมพงษ์", text: "ผูกดวง" } },
        { type: "action", action: { type: "message", label: "🔑 วิธีผูกบัญชี", text: "วิธีผูกบัญชี" } }
    ];

    const payload = {
        replyToken: replyToken,
        messages: [{
            type: "text",
            text: text,
            quickReply: {
                items: quickReplyItems
            }
        }]
    };
    UrlFetchApp.fetch(url, {
        method: "post",
        headers: {
            "Authorization": "Bearer " + LINE_ACCESS_TOKEN,
            "Content-Type": "application/json"
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    });
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
    const url = "https://api.line.me/v2/bot/message/push";

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
