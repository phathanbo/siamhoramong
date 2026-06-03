# 🤖 คำแนะนำการติดตั้ง LINE Bot System

> **ระบบส่งพยากรณ์ดวงผ่าน LINE แบบอัตโนมัติ**

---

## 📋 สิ่งที่ต้องเตรียม

- ✅ LINE Developer Account
- ✅ LINE Business Account (สำหรับ Channel)
- ✅ Google Account (สำหรับ Apps Script)
- ✅ Web server (เว็บไซต์สยามโหรามงคล)

---

## ✅ ขั้นตอนที่ 1: สร้าง LINE Channel

### 1.1 เข้า LINE Developer Console
- ไปที่ https://developers.line.biz/
- ล็อกอินด้วย LINE account

### 1.2 สร้าง Provider ใหม่
1. คลิก "Create"
2. ใส่ชื่อ: "สยามโหรามงคล"
3. คลิก "Create"

### 1.3 สร้าง Channel ใหม่
1. คลิกไปที่ Provider ที่สร้าง
2. คลิก "Create Channel"
3. เลือก "Messaging API"
4. ใส่ข้อมูล:
   - **Channel name**: สยามโหรามงคล
   - **Channel description**: LINE Bot พยากรณ์ดวง
   - **Category**: Lifestyle
   - **Subcategory**: Others

### 1.4 ได้รับ Credentials
ไปที่ **Channel settings**:
- ⚠️ Copy **Channel ID** (เก็บไว้)
- ⚠️ Copy **Channel Secret** (เก็บไว้)

ไปที่ **Messaging API** tab:
- ⚠️ Click "Issue" เพื่อได้ **Channel Access Token** (เก็บไว้)

---

## ✅ ขั้นตอนที่ 2: ตั้งค่า Google Apps Script

### 2.1 สร้าง Apps Script project
1. ไปที่ https://script.google.com/
2. คลิก "New Project"
3. ตั้งชื่อ: "LINE Bot สยามโหรามงคล"

### 2.2 ใส่โค้ด
1. คัดลอก **ทั้งหมด** จาก `google-apps-script-line-bot.js`
2. วางลงใน editor

### 2.3 ตั้งค่า Credentials
แก้ไขส่วนนี้ (บรรทัด 9-12):
```javascript
const LINE_CHANNEL_ID = "YOUR_LINE_CHANNEL_ID";              // แทนด้วยของจริง
const LINE_CHANNEL_SECRET = "YOUR_LINE_CHANNEL_SECRET";      // แทนด้วยของจริง
const LINE_ACCESS_TOKEN = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";  // แทนด้วยของจริง
```

**วิธีการหา:**
- **LINE_CHANNEL_ID** → ค้นหาใน LINE Developer Console > Channel settings
- **LINE_CHANNEL_SECRET** → ค้นหาใน LINE Developer Console > Channel settings
- **LINE_ACCESS_TOKEN** → ค้นหาใน LINE Developer Console > Messaging API tab

### 2.4 Deploy เป็น Web App

#### ขั้นที่ 1: Save Project
- Ctrl+S (หรือ Cmd+S บน Mac)

#### ขั้นที่ 2: Deploy
1. คลิก "Deploy" ที่มุมบนขวา
2. เลือก "New deployment"
3. เลือก Type → "Web app"
4. ใส่:
   - **Description**: LINE Bot webhook
   - **Execute as**: ตัวของคุณ
   - **Who has access**: Anyone

5. คลิก "Deploy"

#### ขั้นที่ 3: Copy URL
- ⚠️ Copy **Deployment ID** ที่ได้
- URL จะเป็น: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb`

---

## ✅ ขั้นตอนที่ 3: ตั้งค่า LINE Webhook

### 3.1 ใน LINE Developer Console
1. ไปที่ **Messaging API** tab
2. หาส่วน **Webhook settings**
3. ใส่ **Webhook URL**: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb?action=webhook`

(แทน `{DEPLOYMENT_ID}` ด้วยของจริง)

4. Click "Verify" เพื่อตรวจสอบ
5. Toggle "Use webhook" เป็น ON

---

## ✅ ขั้นตอนที่ 4: ตั้งค่าเว็บไซต์

### 4.1 เพิ่มปุ่ม Subscribe
เพิ่มลงใน `index.html` (ในเมนูหลัก):

```html
<button onclick="window.location.href='/line-subscribe.html'" class="btn btn-success">
    <i class="fab fa-line"></i> สมัครสมาชิก LINE
</button>
```

### 4.2 อัปโหลด `line-subscribe.html`
1. ขึ้น `line-subscribe.html` ลงเว็บ
2. แก้ไขบรรทัด 132-133:
```javascript
const LINE_CHANNEL_ID = "YOUR_LINE_CHANNEL_ID";              // แทนด้วยของจริง
const REDIRECT_URI = window.location.origin + "/line-subscribe.html?callback";
```

3. แก้ไขบรรทัด 178 และ 209:
```javascript
fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {  // แทนด้วย Deployment URL
```

แทนด้วย:
```javascript
fetch('https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb', {
```

---

## ✅ ขั้นตอนที่ 5: ตั้งค่า Daily Scheduler

### 5.1 ใน Google Apps Script
1. ไปที่ "Triggers" (ไอเดียแสดง ⏰ บน editor)
2. คลิก "Create new trigger"
3. ตั้งค่า:
   - **Function**: `sendDailyFortunes`
   - **Deployment**: Head
   - **Event**: Time-driven
   - **Type**: Day timer
   - **Time**: 07:00-08:00 (เช้า 7 โมง)

4. Click "Save"

---

## 🧪 ทดสอบระบบ

### ขั้นที่ 1: ทดสอบ Function
1. ใน Google Apps Script
2. เลือก "testSendFortune" function
3. Click "Run"
4. ตรวจสอบ Logs (Ctrl+Enter)

### ขั้นที่ 2: ทดสอบ Web App
1. ไปที่เว็บของคุณ `/line-subscribe.html`
2. คลิก "เข้าสู่ระบบด้วย LINE"
3. ทำตาม steps
4. ถ้าสำเร็จจะเห็น "สมัครสมาชิกสำเร็จ"

### ขั้นที่ 3: ตรวจสอบ Database
1. ในระหว่างการใช้งาน ให้เปิด Google Sheet ของ Google Apps Script
2. ดูชีท "Subscribers" เพื่อดูข้อมูล
3. ดูชีท "Logs" เพื่อดูประวัติ

---

## 📌 ข้อมูลที่ต้องจดไว้

สร้างไฟล์ `.env` (ไม่ต้องอัปโหลด):

```
LINE_CHANNEL_ID=YOUR_LINE_CHANNEL_ID
LINE_CHANNEL_SECRET=YOUR_LINE_CHANNEL_SECRET
LINE_ACCESS_TOKEN=YOUR_LINE_CHANNEL_ACCESS_TOKEN
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb
LINE_SUBSCRIBE_PAGE=https://yourwebsite.com/line-subscribe.html
```

---

## 🎯 การใช้งาน

### สำหรับผู้ใช้:
1. คลิกปุ่ม "สมัครสมาชิก LINE" บนเว็บไซต์
2. เข้าสู่ระบบด้วย LINE
3. เลือกราศีและความถี่
4. ยินยอมข้อมูล
5. ได้รับพยากรณ์ทุกวัน (หรือตามความถี่ที่เลือก)

### สำหรับผู้ดูแลแอปพลิเคชัน:
1. เปิด Google Sheet (ใน Google Apps Script)
2. ดูจำนวนสมาชิก ใน "Subscribers" sheet
3. ตรวจสอบประวัติการส่งใน "Logs" sheet

---

## 🔧 แก้ไขปัญหา

### ❌ ปัญหา: "Webhook verification failed"
**วิธีแก้:**
- ตรวจสอบ Deployment URL ถูกต้องไหม
- ตรวจสอบ LINE Channel ID ถูกต้องไหม
- ลองแก้โค้ยใน Google Apps Script แล้ว Deploy ใหม่

### ❌ ปัญหา: "Cannot login with LINE"
**วิธีแก้:**
- ตรวจสอบ LINE_CHANNEL_ID ในไฟล์ `line-subscribe.html`
- ตรวจสอบ REDIRECT_URI ตรงกับ OAuth redirect URI ใน LINE Developer Console

### ❌ ปัญหา: "ไม่ได้รับข้อความจาก LINE Bot"
**วิธีแก้:**
- ตรวจสอบ LINE_ACCESS_TOKEN ถูกต้อง
- ตรวจสอบ Trigger "sendDailyFortunes" ทำงานแล้ว
- ดูที่ Logs sheet เพื่อหาข้อผิดพลาด

---

## 📚 ดูเพิ่มเติม

- [LINE Messaging API](https://developers.line.biz/en/documentation/messaging-api/)
- [Google Apps Script](https://developers.google.com/apps-script)
- [LINE Login](https://developers.line.biz/en/documentation/line-login/)

---

**Created**: 2026-06-03  
**Version**: 1.0  
**Status**: ✅ Ready to deploy
