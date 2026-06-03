/**
 * ⚙️ Configuration Template
 *
 * คำแนะนำ:
 * 1. Copy ไฟล์นี้ เป็น config.js
 * 2. แทนที่ค่าต่าง ๆ ด้วยของจริง
 * 3. เพิ่ม config.js ลงใน .gitignore
 * 4. Update HTML/JS files ให้อ่านจากไฟล์นี้
 */

// 🔐 LINE Bot Configuration
const CONFIG = {
    // LINE Messaging API
    LINE: {
        CHANNEL_ID: "YOUR_LINE_CHANNEL_ID",           // https://developers.line.biz/console/
        CHANNEL_SECRET: "YOUR_LINE_CHANNEL_SECRET",
        CHANNEL_ACCESS_TOKEN: "YOUR_LINE_CHANNEL_ACCESS_TOKEN"
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
