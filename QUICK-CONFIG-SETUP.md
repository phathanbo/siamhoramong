# ⚙️ ตั้งค่า Configuration - ด่วน!

> **จำเป็นต้องทำก่อน Deploy LINE Bot**

---

## 📋 ขั้นตอนที่ 1: สร้าง config.js (5 นาที)

### 1.1 Copy ไฟล์ template
```bash
# Copy config-template.js -> config.js
cp config-template.js config.js
```

### 1.2 แก้ไข config.js
เปิดไฟล์ `config.js` แล้วแทนที่:

```javascript
// ❌ หา และแทนที่ค่าเหล่านี้:

LINE: {
    CHANNEL_ID: "YOUR_LINE_CHANNEL_ID",              // ← ที่นี่
    CHANNEL_SECRET: "YOUR_LINE_CHANNEL_SECRET",      // ← ที่นี่
    CHANNEL_ACCESS_TOKEN: "YOUR_LINE_CHANNEL_ACCESS_TOKEN"  // ← ที่นี่
},

GOOGLE_APPS_SCRIPT: {
    DEPLOYMENT_URL: "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb",  // ← ที่นี่
    SPREADSHEET_ID: "YOUR_GOOGLE_SHEET_ID"  // ← ที่นี่
},
```

### 1.3 ค่าที่ต้องหา

#### 📱 LINE Channel (จาก LINE Developer Console)
1. ไป https://developers.line.biz/console/
2. เลือก Provider > Channel
3. ไปที่ "Channel settings"
4. Copy:
   - **Channel ID** → `CHANNEL_ID`
   - **Channel Secret** → `CHANNEL_SECRET`

5. ไปที่ "Messaging API" tab
6. Click "Issue" ของ "Channel access token"
7. Copy token → `CHANNEL_ACCESS_TOKEN`

#### 🔗 Google Apps Script URL
1. Deploy ไปยัง Web App (ตามคำแนะนำในไฟล์ LINE-BOT-SETUP-GUIDE.md)
2. Copy Deployment URL → `DEPLOYMENT_URL`

---

## 📋 ขั้นตอนที่ 2: ตั้งค่า Google Apps Script (3 นาที)

### 2.1 ใน Google Apps Script Editor
```javascript
// Run function นี้:
function setupLineCredentials() {
    const props = PropertiesService.getScriptProperties();
    
    props.setProperty('LINE_CHANNEL_ID', 'YOUR_ACTUAL_CHANNEL_ID');
    props.setProperty('LINE_CHANNEL_SECRET', 'YOUR_ACTUAL_CHANNEL_SECRET');
    props.setProperty('LINE_ACCESS_TOKEN', 'YOUR_ACTUAL_ACCESS_TOKEN');
    
    alert('✅ ตั้งค่า LINE Credentials สำเร็จ');
}

// ทำการ Run ↑
```

**วิธี:**
1. เปิด Google Apps Script editor
2. Copy function ด้านบน ลงไป
3. Select function `setupLineCredentials`
4. Click "Run" (▶️)
5. Authorize app
6. Wait สำหรับ alert "✅ ตั้งค่า LINE Credentials สำเร็จ"

---

## 📋 ขั้นตอนที่ 3: เพิ่ม config.js ลงเว็บ (2 นาที)

### 3.1 อัปโหลด config.js
```bash
# Upload ไปยัง web server
scp config.js username@server:/path/to/web/
```

### 3.2 เพิ่ม reference ใน HTML
ในไฟล์ที่ใช้ config:
- ✅ `line-subscribe.html` (already updated)
- ✅ `line-admin-dashboard.html` (already updated)

---

## ✅ Checklist

- [ ] Copy `config-template.js` → `config.js`
- [ ] แทนที่ LINE Channel ID/Secret/Token
- [ ] แทนที่ Google Apps Script URL
- [ ] Run `setupLineCredentials()` ใน Google Apps Script
- [ ] Upload `config.js` ไปเว็บ
- [ ] Test: เปิดหน้า `/line-subscribe.html` ดูว่า config load ไหม
  
**ทดสอบ:** เปิด Browser Console (F12) มองหา warning:
```javascript
// ❌ ถ้าเห็นอันนี้ = config ยังไม่ถูกต้อง
❌ config.js ยังไม่ได้ตั้งค่า

// ✅ ถ้าไม่เห็น = setup สำเร็จ
```

---

## 🔒 Security Note

### ⚠️ อย่า commit config.js!

```bash
# เพิ่ม .gitignore
echo "config.js" >> .gitignore
git add .gitignore
git commit -m "Add config.js to gitignore"
```

### ⚠️ อย่า share config.js
- ไม่ share ผ่าน email/chat
- ไม่ push ไป GitHub
- เก็บไว้เฉพาะ server เท่านั้น

---

## 🐛 Troubleshooting

### ❌ "config.js not found"
**วิธีแก้:**
```html
<!-- ตรวจสอบว่า HTML มี tag นี้ -->
<script src="config.js"></script>
```

### ❌ "CONFIG is undefined"
**วิธีแก้:**
1. ตรวจสอบ config.js อยู่ในโฟลเดอร์ถูก
2. ตรวจสอบไม่มี syntax error ใน config.js
3. Reload page (Ctrl+F5)

### ❌ LINE Bot still doesn't work
**วิธีแก้:**
1. ตรวจสอบ config.js values ถูกต้อง
2. ตรวจสอบ Google Apps Script deployed แล้ว
3. ตรวจสอบ LINE Webhook URL ถูกต้อง
4. อ่าน Logs ใน Google Sheets

---

**Generated**: 2026-06-03
**Next Step**: Deploy LINE Bot เมื่อ config ตั้งค่าเสร็จ
