document.addEventListener('DOMContentLoaded', () => {
    // Populate Members
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    const memberSelect = document.getElementById('memberSelect');
    if (memberSelect) {
        memberSelect.innerHTML = '<option value="">-- เลือกจากฐานข้อมูลลูกค้า --</option>';
        allHistory.filter(m => m.name).forEach((m) => {
            let realIdx = allHistory.indexOf(m);
            memberSelect.innerHTML += `<option value="${realIdx}">${m.name} (${m.birthdate || 'ไม่ระบุวันเกิด'})</option>`;
        });
    }

    // Adjust scale for preview area on load and resize
    adjustScale();
    window.addEventListener('resize', adjustScale);
});

function adjustScale() {
    const container = document.getElementById('previewContainer');
    const wrapper = document.getElementById('chartWrapper');
    if (!container || !wrapper) return;
    
    // Original size is 1080x1080
    const availWidth = container.clientWidth - 40; // padding
    if (availWidth < 1080) {
        const scale = availWidth / 1080;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.height = `${1080 * scale}px`;
    } else {
        wrapper.style.transform = 'scale(1)';
        wrapper.style.height = '1080px';
    }
}

window.autoFillMember = function(idx) {
    if (idx === '') return;
    let allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    let m = allHistory[idx];
    if (m) {
        document.getElementById('custName').value = m.name || '';
        
        if (m.birthdate) {
            let parts = m.birthdate.split('/');
            if (parts.length === 3) {
                let y = parseInt(parts[2]);
                if (y > 2400) y -= 543;
                let dStr = `${y}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                document.getElementById('custDobDate').value = dStr;
            }
        }
        
        if (m.birthtime) {
            document.getElementById('custDobTime').value = m.birthtime;
        }
        
        if (m.province || m.location) {
            document.getElementById('custLocation').value = m.province || m.location || '';
        }
    }
}

window.generateChartPreview = function() {
    const name = document.getElementById('custName').value.trim();
    const dobDate = document.getElementById('custDobDate').value;
    const dobTime = document.getElementById('custDobTime').value;
    const location = document.getElementById('custLocation').value.trim();

    if (!name || !dobDate) {
        alert("กรุณากรอกชื่อและวันเดือนปีเกิดให้ครบถ้วน");
        return;
    }

    const dobObj = new Date(dobDate);
    const daysTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dobThStr = dobObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const dayName = daysTh[dobObj.getDay()];

    // Lunar Info
    let lunarText = "-";
    let lObj = null;
    if (typeof getThaiLunar === 'function') {
        lObj = getThaiLunar(dobObj);
        if (lObj) {
            lunarText = `${lObj.phase} ${lObj.amount} ค่ำ เดือน ${lObj.month} ปี${lObj.zodiac}`;
        }
    }

    // Ascendant (Lagna)
    let ascText = "ไม่ระบุ (กรุณาใส่เวลาเกิด)";
    let zodiacIcon = "🌟";
    let ascElement = "";
    if (dobTime && typeof ascCalcLagna === 'function' && typeof ASC_CITY_LIST !== 'undefined' && typeof ZODIAC_DATA !== 'undefined') {
        const city = ASC_CITY_LIST.find(c => c.name === location) || ASC_CITY_LIST[0];
        const ascResult = ascCalcLagna(dobObj.toISOString().split('T')[0], dobTime, city.lat, city.lng);
        const zData = ZODIAC_DATA[ascResult.rasi];
        ascText = `ราศี${zData.name}`;
        ascElement = `(ธาตุ${zData.element})`;
        zodiacIcon = zData.icon;
    }

    // Taksa 7-Digits
    let taksaTableHtml = "";
    if (lObj) {
        let mMatch = lObj.month.match(/\d+/);
        let sdMonth = mMatch ? parseInt(mMatch[0]) : 5;
        const zodiacs = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
        let sdYear = zodiacs.indexOf(lObj.zodiac);
        if (sdYear === -1) sdYear = 0;

        let sdDayNum = dobObj.getDay();

        let globalRows = [[], [], [], []];
        for (let i = 0; i < 7; i++) {
            globalRows[0].push(((sdDayNum - 1 + i) % 7) + 2);
            globalRows[1].push(((sdMonth - 1 + i) % 7) + 1);
            globalRows[2].push((((sdYear % 7) + i) % 7) + 1);
        }
        for (let i = 0; i < 7; i++) {
            globalRows[3].push(globalRows[0][i] + globalRows[1][i] + globalRows[2][i]);
        }

        const posNames = [
            ["อัตตา", "หินะ", "ธนัง", "ปิตา", "มาตา", "โภคา", "มัชฌิมา"],
            ["ตะนุ", "กดุมพะ", "สหัชชะ", "พันธุ", "ปุตตะ", "อริ", "ปัตตนิ"],
            ["มรณะ", "สุภะ", "กัมมะ", "ลาภะ", "พยายะ", "ทาสี", "ทาสา"]
        ];

        taksaTableHtml = `<table class="taksa-table">`;
        for (let r = 0; r < 3; r++) {
            taksaTableHtml += `<tr>`;
            for (let c = 0; c < 7; c++) {
                taksaTableHtml += `<td>
                    <div class="taksa-label">${posNames[r][c]}</div>
                    <div class="taksa-val">${globalRows[r][c]}</div>
                </td>`;
            }
            taksaTableHtml += `</tr>`;
        }
        taksaTableHtml += `<tr style="background: rgba(212,175,55,0.2);">`;
        for (let c = 0; c < 7; c++) {
            taksaTableHtml += `<td style="border-top: 3px solid #D4AF37;">
                <div class="taksa-label" style="color: #FFDF73;">ฐานที่ 4</div>
                <div class="taksa-base-val">${globalRows[3][c]}</div>
            </td>`;
        }
        taksaTableHtml += `</tr></table>`;
    }

    const htmlContent = `
        <div class="overlay"></div>
        <div class="chart-header">
            <h2>ดวงชะตากำเนิด</h2>
            <h1>คุณ ${name}</h1>
        </div>
        
        <div class="chart-grid">
            <!-- Left Box: Personal Info & Ascendant -->
            <div class="chart-box">
                <div class="chart-box-title">ข้อมูลพื้นดวง</div>
                <div class="data-row">
                    <span class="data-label">วันเกิด:</span>
                    <span class="data-value">วัน${dayName}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">วันที่:</span>
                    <span class="data-value" style="font-size: 18px;">${dobThStr}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">จันทรคติ:</span>
                    <span class="data-value" style="font-size: 18px;">${lunarText}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">เวลาเกิด:</span>
                    <span class="data-value">${dobTime || 'ไม่ระบุ'}</span>
                </div>
                
                <div style="margin-top: 40px; text-align: center;">
                    <div class="zodiac-icon">${zodiacIcon}</div>
                    <div style="color: #D4AF37; font-size: 30px; font-weight: bold;">ลัคนา${ascText}</div>
                    <div style="color: #AAA; font-size: 20px;">${ascElement}</div>
                </div>
            </div>

            <!-- Right Box: Taksa Chart -->
            <div class="chart-box">
                <div class="chart-box-title">มหาทักษาสัตตเลข</div>
                ${taksaTableHtml}
                
                <div style="margin-top: 25px; padding: 15px; background: rgba(0,0,0,0.5); border-radius: 10px; border: 1px dashed #D4AF37; text-align: center; color: #FFF; font-size: 18px;">
                    ตำรามหาทักษากำเนิด (เลข ๗ ตัว ๔ ฐาน)<br>
                    <span style="color: #FFDF73; font-size: 16px;">สยามโหรามงคลใช้สำหรับวิเคราะห์จุดเด่นจุดด้อยในชีวิต</span>
                </div>
            </div>
        </div>
        
        <div class="chart-footer">
            จัดทำโดย สยามโหรามงคล (สงวนลิขสิทธิ์เฉพาะคุณ ${name})
        </div>
    `;

    document.getElementById('chartCanvas').innerHTML = htmlContent;
    document.getElementById('btnDownload').style.display = 'block';
    const btnPost = document.getElementById('btnPostFb');
    if (btnPost) btnPost.style.display = 'block';
};

window.downloadChart = function(action = 'download') {
    return new Promise((resolve) => {
        const canvasEl = document.getElementById('chartCanvas');
        const name = document.getElementById('custName').value.trim() || 'Astrology';
        
        // Temporarily remove scaling for high-quality export
        const wrapper = document.getElementById('chartWrapper');
        const originalTransform = wrapper.style.transform;
        wrapper.style.transform = 'scale(1)';
        
        // Give browser a tiny moment to reflow before capturing
        setTimeout(() => {
            html2canvas(canvasEl, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: '#111111'
            }).then(canvas => {
                const dataUrl = canvas.toDataURL('image/png');
                if (action === 'post') {
                    wrapper.style.transform = originalTransform;
                    resolve(dataUrl);
                    return;
                }
                const link = document.createElement('a');
                link.download = `ดวงชะตา_${name}.png`;
                link.href = dataUrl;
                link.click();
                
                // Restore scaling
                wrapper.style.transform = originalTransform;
                resolve();
            }).catch(err => {
                console.error(err);
                alert("เกิดข้อผิดพลาดในการสร้างรูปภาพ");
                wrapper.style.transform = originalTransform;
                resolve(null);
            });
        }, 100);
    });
};

window.postToFacebook = async function() {
    try {
        const dataUrl = await window.downloadChart('post');
        if (!dataUrl) {
            Swal.close();
            return;
        }
        
        const name = document.getElementById('custName').value.trim() || 'ลูกค้า';
        const msg = `ดวงชะตาของคุณ ${name} โดยสยามโหรามงคล`;

        // Preview Modal
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการโพสต์',
                        html: `
                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Siam&background=4F46E5&color=fff" style="width: 100%; height: 100%;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                        </div>
                    </div>
                    <div style="padding: 4px 16px 16px 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${msg}</div>
                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
                </div>
                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม (Optional)</h4>
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (ถ้ามี):</label>
                    <input type="datetime-local" id="swalScheduleTime" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">เช็คอินสถานที่ (รหัส Place ID):</label>
                    <input type="text" id="swalPlaceId" placeholder="เช่น 108398189188044 (Bangkok)" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์',
            cancelButtonText: 'ยกเลิก',
            background: '#1e1e1e',
            color: '#fff',
            width: '600px',
            preConfirm: () => {
                return {
                    scheduleTime: document.getElementById('swalScheduleTime') ? document.getElementById('swalScheduleTime').value : '',
                    placeId: document.getElementById('swalPlaceId') ? document.getElementById('swalPlaceId').value.trim() : ''
                };
            }
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        let scheduledPublishTime = null;
        if (confirmResult.value && confirmResult.value.scheduleTime) {
            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
        }
        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

        Swal.fire({
            title: 'กำลังโพสต์ลงเพจ...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://127.0.0.1:3000/api/facebook-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, image: dataUrl , scheduledPublishTime: scheduledPublishTime, place: place })
        });
        
        const data = await res.json();
        if (data.success) {
            Swal.fire('สำเร็จ!', 'โพสต์ลงเพจ Facebook เรียบร้อยแล้ว', 'success');
        } else {
            Swal.fire('ข้อผิดพลาด', data.error || 'ไม่สามารถโพสต์ได้', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message, 'error');
    }
};
