/**
 * ⚙️ Configuration File
 *
 * คำแนะนำ:
 * แทนที่ค่า YOUR_* ด้วยค่าคอนฟิกจริงจาก LINE Developers Console และ Google Apps Script
 */

// 🔐 LINE Bot Configuration
const CONFIG = {
    // LINE Messaging API
    LINE: {
        CHANNEL_ID: "2011471468",           // https://developers.line.biz/console/
        CHANNEL_SECRET: "af744f1156894a20b245a991983004a8",
        CHANNEL_ACCESS_TOKEN: "cU2qdts0aHY8x8Vz/Q3jnHumGpNk1OFwT/8T1yBiJc4H5GeljkJnd56am4FB2Jk0+YCQxQn/w9W2ZBAFimOlV7hy+FUgcFhWttKnl0nFvist1wl2jKIpX+XfXZWJmE5hJrGLdxAVPAabc98iQ3ORSQdB04t89/1O/w1cDnyilFU="
    },

    // Google Apps Script
    GOOGLE_APPS_SCRIPT: {
        DEPLOYMENT_URL: "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb",
        SPREADSHEET_ID: "YOUR_GOOGLE_SHEET_ID"
    },

    // ตั้งค่า LINE Bot
    BOT_SETTINGS: {
        SEND_TIME: "07:00",  // เวลาส่งพยากรณ์ (HH:mm)
        TIMEZONE: "Asia/Bangkok",
        INITIAL_ZODIAC: 1,  // ราศี default
        INITIAL_FREQUENCY: "daily"  // daily, weekly, monthly
    },

    // Firebase (ถ้าใช้)
    FIREBASE: {
        API_KEY: "YOUR_FIREBASE_API_KEY",
        AUTH_DOMAIN: "YOUR_FIREBASE_AUTH_DOMAIN",
        PROJECT_ID: "YOUR_FIREBASE_PROJECT_ID",
        STORAGE_BUCKET: "YOUR_FIREBASE_STORAGE_BUCKET",
        MESSAGING_SENDER_ID: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
        APP_ID: "YOUR_FIREBASE_APP_ID"
    },

    // Google Analytics
    ANALYTICS: {
        GA_ID: "G-DH8VVHWKQ5"  // แก้ไขให้ตรงกับ GA4 property
    }
};

// 📝 Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
