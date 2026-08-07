const fs = require('fs');
let code = fs.readFileSync('adminZodiacAutoCarousel.js', 'utf8');

let topPart = `// --- Combined Logic for adminZodiacAutoCarousel ---

function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    
    if(mode === 'single') {
        document.getElementById('tabSingle').classList.add('active');
        document.getElementById('singleControls').style.display = 'block';
        document.getElementById('carouselControls').style.display = 'none';
        
        document.getElementById('captureArea').style.display = 'flex';
        document.getElementById('singlePreviewBtns').style.display = 'block';
        document.getElementById('cfPreviewWrapper').style.display = 'none';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่าง (ขนาด 1080x1080)';
    } else {
        document.getElementById('tabCarousel').classList.add('active');
        document.getElementById('singleControls').style.display = 'none';
        document.getElementById('carouselControls').style.display = 'block';
        
        document.getElementById('captureArea').style.display = 'none';
        document.getElementById('singlePreviewBtns').style.display = 'none';
        document.getElementById('cfPreviewWrapper').style.display = 'flex';
        document.getElementById('previewTitle').innerText = 'ภาพตัวอย่างอัลบั้ม 9 ภาพ (เลื่อนลงเพื่อดูทั้งหมด)';
        
        const dateInput = document.getElementById('cfDate');
        if (!dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

// ข้อมูลคงที่
const THAI_DAYS_LONG = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

const ZODIAC_LIST = [
    { id: '1', name: 'ราศีเมษ', dateRange: '13 เม.ย. - 13 พ.ค.', icon: '♈' },
    { id: '2', name: 'ราศีพฤษภ', dateRange: '14 พ.ค. - 13 มิ.ย.', icon: '♉' },
    { id: '3', name: 'ราศีเมถุน', dateRange: '14 มิ.ย. - 14 ก.ค.', icon: '♊' },
    { id: '4', name: 'ราศีกรกฎ', dateRange: '15 ก.ค. - 16 ส.ค.', icon: '♋' },
    { id: '5', name: 'ราศีสิงห์', dateRange: '17 ส.ค. - 16 ก.ย.', icon: '♌' },
    { id: '6', name: 'ราศีกันย์', dateRange: '17 ก.ย. - 16 ต.ค.', icon: '♍' },
    { id: '7', name: 'ราศีตุลย์', dateRange: '17 ต.ค. - 15 พ.ย.', icon: '♎' },
    { id: '8', name: 'ราศีพิจิก', dateRange: '16 พ.ย. - 15 ธ.ค.', icon: '♏' },
    { id: '9', name: 'ราศีธนู', dateRange: '16 ธ.ค. - 13 ม.ค.', icon: '♐' },
    { id: '10', name: 'ราศีมังกร', dateRange: '14 ม.ค. - 12 ก.พ.', icon: '♑' },
    { id: '11', name: 'ราศีกุมภ์', dateRange: '13 ก.พ. - 13 มี.ค.', icon: '♒' },
    { id: '12', name: 'ราศีมีน', dateRange: '14 มี.ค. - 12 เม.ย.', icon: '♓' }
];

const SEVEN_DAYS_LIST = [
    { id: '0', name: 'วันอาทิตย์ (สีแดง)', color: '#FF0000', bg: '#ffe5e5', border: '#ff4d4d' },
    { id: '1', name: 'วันจันทร์ (สีเหลือง)', color: '#FFC107', bg: '#fffbd6', border: '#ffdb4d' },
    { id: '2', name: 'วันอังคาร (สีชมพู)', color: '#FF69B4', bg: '#ffe6f2', border: '#ff99cc' },
    { id: '3', name: 'วันพุธ (สีเขียว)', color: '#4CAF50', bg: '#e8f5e9', border: '#81c784' },
    { id: '4', name: 'วันพฤหัสบดี (สีส้ม)', color: '#FF9800', bg: '#fff3e0', border: '#ffb74d' },
    { id: '5', name: 'วันศุกร์ (สีฟ้า)', color: '#2196F3', bg: '#e3f2fd', border: '#64b5f6' },
    { id: '6', name: 'วันเสาร์ (สีม่วง)', color: '#9C27B0', bg: '#f3e5f5', border: '#ba68c8' }
];

document.addEventListener('DOMContentLoaded', () => {
    // กำหนดวันที่ค่าเริ่มต้นเป็นวันนี้
    const dateInput = document.getElementById('dateSelect');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = \`\${yyyy}-\${mm}-\${dd}\`;
    }
    updateSubOptions();
});

document.getElementById('categorySelect').addEventListener('change', () => {
    updateSubOptions();
});

function updateSubOptions() {
    const category = document.getElementById('categorySelect').value;
    const targetSelect = document.getElementById('targetSelect');
    const targetGroup = document.getElementById('subTargetGroup');
    const label = document.getElementById('subTargetLabel');

    targetSelect.innerHTML = '';
    
    if (category === 'zodiac') {
        targetGroup.style.display = 'flex';
        label.innerText = 'เลือกราศี';
        ZODIAC_LIST.forEach(z => {
            targetSelect.innerHTML += \`<option value="\${z.id}">\${z.name} (\${z.dateRange})</option>\`;
        });
    } else if (category === 'sevendays') {
        targetGroup.style.display = 'flex';
        label.innerText = 'เลือกวันเกิด';
        SEVEN_DAYS_LIST.forEach(d => {
            targetSelect.innerHTML += \`<option value="\${d.id}">\${d.name}</option>\`;
        });
    } else {
        targetGroup.style.display = 'none';
    }
}
`;

let index = code.indexOf('function formatDateThai(dateObj)');
if(index > 0) {
    code = topPart + '\n' + code.substring(index);
    fs.writeFileSync('adminZodiacAutoCarousel.js', code, 'utf8');
    console.log('Fixed top part.');
} else {
    console.log('Could not find function formatDateThai');
}
