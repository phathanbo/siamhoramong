# คู่มือการติดตั้ง - สยามโหรามงคล

## 🔧 การตั้งค่า Google Analytics

### ขั้นตอนการติดตั้ง:

1. **สร้าง Google Analytics Account:**
   - ไปที่ [Google Analytics](https://analytics.google.com/)
   - เข้าสู่ระบบด้วยบัญชี Google
   - คลิก "สร้างบัญชี" (Create Account)

2. **ตั้งค่าทรัพยากร (Property):**
   - ตั้งชื่อบัญชี: "สยามโหรามงคล"
   - เลือก "สร้างทรัพยากรใหม่"
   - ตั้งชื่อทรัพยากร: "สยามโหรามงคล - Website"
   - เลือก "ไทย" เป็นประเทศ
   - เลือก "ไทย" เป็นเขตเวลา

3. **ค้นหา Measurement ID:**
   - ไปที่ "Admin" (ด้านล่างซ้าย)
   - เลือก "ข้อมูลการติดตาม" (Tracking info)
   - คลิก "Tagging Instructions"
   - คัดลอก Measurement ID (ในรูปแบบ G-XXXXXXXXXX)

4. **แทนที่ใน index.html:**
   - เปิดไฟล์ `index.html`
   - ค้นหา: `G-XXXXXXXXXX`
   - แทนที่ด้วย Measurement ID ของคุณ 2 ครั้ง (บรรทัดที่มี `<script>` และ `gtag('config'`)

---

## 📱 PWA (Progressive Web App) - ติดตั้งแอปบนหน้าจอหลัก

### ไฟล์ที่เพิ่มเข้ามา:
- `manifest.json` - ไฟล์กำหนดสัญลักษณ์และข้อมูลแอป

### วิธีติดตั้งเป็นแอป:
1. เปิดเว็บไซต์ด้วย Chrome/Edge บนมือถือ
2. คลิกปุ่ม "เมนู" (⋮) → "ติดตั้งแอป"
3. เลือก "ติดตั้ง"

---

## ⚡ การเพิ่มความเร็ว (Performance Optimization)

### เพิ่มเข้ามาแล้ว:
- ✅ DNS Prefetch - เชื่อมต่อ DNS เร็ว
- ✅ Preconnect - เตรียมเชื่อมต่อล่วงหน้า
- ✅ Preload - โหลดทรัพยากรที่สำคัญก่อน
- ✅ Prefetch - โหลดทรัพยากรที่อาจใช้ต่อไป

---

## 🔘 ปุ่มกลับไปบนสุด (Back to Top Button)

### คุณสมบัติ:
- ✅ ปุ่มสีทอง (สไตล์ตามธีมเว็บไซต์)
- ✅ แสดงเมื่อเลื่อนลง 300px
- ✅ Smooth scroll ไปบนสุด
- ✅ มี animation เมื่อ hover
- ✅ ตอบสนองบน Mobile

---

## 📋 ประวัติการเปลี่ยนแปลง

### เวอร์ชั่น 2.0 (เพิ่มเข้ามาใหม่):
- ✨ ปุ่มกลับไปบนสุด
- ✨ Manifest.json (PWA Support)
- ✨ Google Analytics
- ✨ DNS Prefetch / Preconnect
- ✨ Preload / Prefetch ทรัพยากร

---

## ❓ FAQ

**Q: ต้องเปิด Google Analytics ทุกครั้งหรือ?**
A: ไม่ ปิดได้ด้วยการแทนที่ `G-XXXXXXXXXX` ด้วย `disabled` หรือเอา script ออก

**Q: ปุ่มกลับไปบนสุดจะแสดงที่ไหน?**
A: มุมล่างขวาของหน้าจอ ปรากฏเมื่อเลื่อนลง 300px ขึ้นไป

**Q: ต้องแก้ไขอะไรถ้าใช้โดเมนอื่น?**
A: ไม่ต้อง ไฟล์ manifest.json และ Google Analytics ใช้งานได้บนทุกโดเมน

---

## 📧 ติดต่อสำหรับการสนับสนุน
หากมีปัญหาใด ๆ กรุณาติดต่อที่ phathanbo@gmail.com
