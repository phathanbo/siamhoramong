/**
 * ฟังก์ชันสำหรับตรวจสอบสถานะของคำทำนายเพื่อกำหนด Style สี
 * @param {string} text - ข้อความคำทำนาย
 * @returns {string} - Inline Style สำหรับสี
 */
function getStatusStyle(text) {
    // กำหนดคำสำคัญที่บ่งบอกถึง "สิ่งไม่ดี" หรือ "ข้อห้าม"
    const badKeywords = ["ห้าม","ร้ายมาก"];
    
    // ตรวจสอบสถานะ "ไม่ดี" (สีแดง)
    const isBad = badKeywords.some(keyword => text.includes(keyword));
    if (isBad) {
        return "color: #dc2626; font-weight: bold;"; // สีแดงเข้ม (Hex Code)
    }

    // กำหนดคำสำคัญที่บ่งบอกถึง "สิ่งดี"
    const goodKeywords = ["มงคลดี", "มีลาภ", "โชค", "เป็นใหญ่", "ดีทุกประการ", "ค้าขายดี"];
    const isGood = goodKeywords.some(keyword => text.includes(keyword));
    if (isGood) {
        return "color: #16a34a; font-weight: bold;"; // สีเขียวเข้ม (Hex Code)
    }

    // กรณีทั่วไป
    return "color: #374151;"; 
}

/**
 * ฟังก์ชันช่วย Render ตารางเพื่อลดความซ้ำซ้อนของโค้ด
 * @param {HTMLElement} container - Element ที่จะใส่เนื้อหา (tbody)
 * @param {Object} data - ข้อมูลคำทำนาย
 * @param {string} prefix - คำนำหน้า (ขึ้น/แรม)
 */
function renderTableContent(container, data, prefix) {
    if (!container) return;

    let html = "";
    for (let i = 1; i <= 15; i++) {
        const description = data[i.toString()];
        const statusStyle = getStatusStyle(description);
        
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; font-weight: 500; color: #111827; width: 100px;">${prefix} ${i} ค่ำ</td>
                <td style="padding: 8px; ${statusStyle}">${description}</td>
            </tr>
        `;
    }
    container.innerHTML = html;
}

function renderAuspiciousTable() {
    const waxingData = {
        "1": "ทำการมงคลดี ไปทางบกดี ทางเรือไม่ดี",
        "2": "ห้ามทำการมงคลไม่ดี",
        "3": "ห้ามทำการมงคลไม่ดีจะตายจากกัน ไปหาขุนนางดี ไปค้าขายดีมีลาภ",
        "4": "ทำการมงคลดีมีลาภ ไปทางบกดี ทางเรือไม่ดี",
        "5": "ห้ามทำการมงคล (ตำราเว้นไว้)",
        "6": "ทำการมงคลดี ไปทางบกดี ทางเรือไม่ดี",
        "7": "ห้ามทำการมงคลไม่ดีเลย",
        "8": "ทำการมงคลดี",
        "9": "ทำการมงคลดีมีลาภ เข้าหาท่านผู้ใหญ่ไม่ดี",
        "10": "ทำการมงคลดี ผู้ใหญ่จะให้ลาภ",
        "11": "ทำการมงคลดีทุกประการ",
        "12": "ทำการมงคลไม่ดี ไปทางอื่นมีลาภ",
        "13": "ทำการมงคลไม่ดี ร้ายมาก",
        "14": "ทำการมงคลไม่ดี ร้ายมาก",
        "15": "ทำการมงคลดี ไปค้าขายดีมีลาภเพราะผู้ใหญ่"
    };

    const waningData = {
        "1": "ทำการมงคลดี ไปค้าขายมีลาภ",
        "2": "ห้ามทำการมงคลไม่ดี",
        "3": "ห้ามทำการมงคลไม่ดี",
        "4": "ทำการมงคลดี ไปหาขุนนางไม่ดี",
        "5": "ห้ามทำการมงคลไม่ดี",
        "6": "ทำการมงคลมีลาภ",
        "7": "ทำการมงคลมีลาภ เข้าหาขุนนางดี",
        "8": "ทำการมงคลไม่ดี ไปค้าขายดีมีลาภ",
        "9": "ทำการมงคลดี ไปทางเรือไม่ดี",
        "10": "ห้ามทำการมงคลไม่ดีจะป่วยไข้",
        "11": "ทำการมงคลดี ไปค้าขายจะมีโชค",
        "12": "ทำการมงคลไม่ดี ไปค้าขายจะพบโชคเหมาะ",
        "13": "ทำการมงคลดีจะได้เป็นใหญ่",
        "14": "ทำการมงคลดี ไถ่ข้าคนดีจะมีลาภ",
        "15": "ทำการมงคลไปค้าขายจะมีลาภ"
    };

    const waxBody = document.getElementById('waxingTableBody');
    const wanBody = document.getElementById('waningTableBody');

    renderTableContent(waxBody, waxingData, "ขึ้น");
    renderTableContent(wanBody, waningData, "แรม");
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บเสร็จ
window.addEventListener('load', renderAuspiciousTable);