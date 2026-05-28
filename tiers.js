"use strict";

// 1. ข้อมูลระดับของ Package และราคา
const packages = [
    { name: "ทดลองใช้", m: 30, y: 300 },
    { name: "ธรรมดา", m: 60, y: 600 },
    { name: "ทองแดง", m: 90, y: 900 },
    { name: "เงิน", m: 150, y: 1500 },
    { name: "ทองคำ", m: 300, y: 3000 },
    { name: "ทองคำขาว", m: 600, y: 6000 },
    { name: "ใข่มุก", m: 900, y: 9000 },
    { name: "ทับทิม", m: 1200, y: 12000 },
    { name: "ไพฑูรย์", m: 1500, y: 15000 },
    { name: "มรกต", m: 3000, y: 30000 },
    { name: "เพชร", m: 6000, y: 60000 },
    { name: "มงกุฎ", m: 9000, y: 90000 },
    { name: "มงกุฎเพชร", m: 18000, y: 180000 },
    { name: "ไตรมงกุฎ", m: 27000, y: 270000 },
    { name: "เพชรยอดมงกุฎ", m: 36000, y: 360000 },
    { name: "วิมาน", m: "ติดต่อ", y: "ติดต่อ" } 
];

// 2. รายการบริการทั้งหมด 42 รายการ
const services = [
    "1. ทำนายดวงประจำวัน", "2. - การงาน", "3. - การเงิน", "4. - โชคลาภ", "5. - ความรัก", "6. - ชะตาชีวิต", "7. - การสะเดาะเคราะห์",
    "8. วิธีเสริมมงคล", "9. ทำนายดวงประจำวันเกิด", "10. ทำนายดวงประจำเดือนเกิด", "11. ทำนายดวงประจำปีเกิด",
    "12. เบอร์มงคล", "13. ชื่อมงคล", "14. ตั้งชื่อมงคล", "15. ตรวจดวงสมพงษ์", "16. เลขนำโชค",
    "17. ฤกษ์มงคล", "18. - ฤกษ์เดินทาง", "19. - ฤกษ์ปลูกบ้าน", "20. - ฤกษ์แต่งงาน", "21. - ฤกษ์ทำบุญ",
    "22. ฉัตร 3 ชั้น", "23. พยากรณ์รายปี", "24. พยากรณ์รายเดือน", "25. พยากรณ์รายวัน",
    "26. พยากรณ์เฉพาะเรื่อง", "27. - การงาน", "28. - การเงิน", "29. - โชคลาภ", "30. - ความรัก", "31. - ชะตาชีวิต", "32. - การสะเดาะเคราะห์",
    "33. ตรวจกำลังพระประจำชะตา", "34. ต่อชะตาชีวิต", "35. ทำนายฝัน", "36. พยากรณ์พระเคราะห์เสวยอายุ",
    "37. บูชาเทวดาและสะเดาะเคราะห์", "38. แก้เรื่องอุบาทว์", "39. ตรวจดูนรลักษณ์", "40. ตรวจลายมือ", "41. ผูกดวงพิชัยสงคราม", "42. สร้างพระประจำวัน"
];

function buildTable() {
    const head = document.getElementById('headerRow');
    const body = document.getElementById('serviceBody');
    const mRow = document.querySelector('.row-m');
    const yRow = document.querySelector('.row-y');

    // ตรวจสอบว่า Element ครบถ้วนก่อนทำงาน
    if (!head || !body || !mRow || !yRow) return;

    // ล้างข้อมูลเก่า (เผื่อมีการเรียกใช้ซ้ำ)
    head.innerHTML = '<th class="sticky-col">รายการพยากรณ์</th>';
    body.innerHTML = '';

    // วนลูปสร้าง Header และ Footer (ราคา)
    packages.forEach(pkg => {
        // หัวตาราง: แสดงชื่อ Package
        const th = document.createElement('th');
        th.textContent = pkg.name;
        head.appendChild(th);
        
        // แถวราคามรายเดือน
        const tdM = document.createElement('td');
        tdM.className = "price-cell";
        tdM.textContent = typeof pkg.m === 'number' ? pkg.m.toLocaleString() : pkg.m;
        mRow.appendChild(tdM);

        // แถวราคารายปี
        const tdY = document.createElement('td');
        tdY.className = "price-cell";
        tdY.textContent = typeof pkg.y === 'number' ? pkg.y.toLocaleString() : pkg.y;
        yRow.appendChild(tdY);
    });

    // วนลูปสร้างรายการบริการ (Rows)
    services.forEach((s, index) => {
    const tr = document.createElement('tr');
    let rowHTML = `<td class="sticky-col">${s}</td>`;
    
    // วนลูปตามจำนวน Package เพื่อเช็คสิทธิ์
    packages.forEach(pkg => {
        let access = ""; // ตัวแปรเก็บสัญลักษณ์ (✔ หรือ ✘)

        if (pkg.name === "ทดลองใช้") {
            // ถ้าเป็น Package ทดลองใช้ และ index อยู่ใน 3 ข้อแรก (0, 1, 2)
            access = (index < 3) ? '<span class="check">✔</span>' : '<span class="not-allow">✘</span>';
        } else if (pkg.name === "ธรรมดา") {
            // ถ้าเป็น Package ธรรมดา และ index อยู่ใน 6 ข้อแรก (0, 1, 2, 3, 4, 5)
            access = (index < 6) ? '<span class="check">✔</span>' : '<span class="not-allow">✘</span>';
        } else {
            // Package อื่นๆ ให้ดูได้หมด (หรือจะใส่ Logic เพิ่มเติมที่นี่ก็ได้)
            access = '<span class="check">✔</span>';
        }

        rowHTML += `<td class="status-cell">${access}</td>`;
    });
    
    tr.innerHTML = rowHTML;
    body.appendChild(tr);
});
}

// เริ่มทำงานเมื่อโหลด DOM เสร็จ
document.addEventListener('DOMContentLoaded', buildTable);