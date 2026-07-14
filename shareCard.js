// shareCard.js
// ระบบสำหรับแชร์คำทำนายด้วย html2canvas

async function sharePrediction(title, detailsHTML) {
    const userName = window.currentUser || (typeof getProfileData === 'function' && getProfileData()?.name) || "ผู้มาเยือน";
    
    // ตั้งค่า Content ให้ Share Card Template
    const titleEl = document.getElementById('shareCardTitle');
    const userEl = document.getElementById('shareCardUser');
    const detailsEl = document.getElementById('shareCardDetails');
    const templateWrapper = document.getElementById('shareCardTemplateWrapper');
    
    if(!templateWrapper) {
        console.error("❌ Share Card Template Not Found!");
        return;
    }

    // ใส่ข้อมูล
    titleEl.innerHTML = `✨ ${title} ✨`;
    userEl.innerHTML = `สำหรับ: <span style="color: #d4af37; font-weight: 600;">คุณ ${userName}</span>`;
    detailsEl.innerHTML = detailsHTML;

    // แสดงชั่วคราวเพื่อให้ html2canvas เรนเดอร์ได้
    templateWrapper.style.top = '0';
    templateWrapper.style.left = '0';
    templateWrapper.style.zIndex = '-9999';

    Swal.fire({
        title: 'กำลังสร้างรูปภาพ...',
        text: 'กรุณารอสักครู่ ระบบกำลังจัดเตรียมบัตรคำทำนายของคุณ',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
    });

    try {
        // ใช้ html2canvas จับภาพ
        const canvas = await html2canvas(templateWrapper, {
            scale: 2, // เพิ่มความคมชัด
            useCORS: true,
            backgroundColor: null
        });

        // ซ่อนกลับ
        templateWrapper.style.top = '-9999px';
        templateWrapper.style.left = '-9999px';

        const imgData = canvas.toDataURL('image/png');

        Swal.close();

        // แสดงผลลัพธ์เป็น SweetAlert เพื่อให้บันทึกหรือแชร์
        Swal.fire({
            title: '🎉 สร้างบัตรสำเร็จ!',
            html: `
                <div style="text-align: center;">
                    <img src="${imgData}" style="max-width: 100%; border-radius: 15px; box-shadow: 0 4px 15px rgba(212,175,55,0.3); margin-bottom: 20px;">
                    <p class="text-white-50 small mb-3">กดค้างที่รูปภาพ (มือถือ) หรือคลิกขวา (คอมพิวเตอร์) เพื่อบันทึกรูปภาพ</p>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-gold px-4 py-2" onclick="downloadImage('${imgData}', 'SiamHora_${Date.now()}.png')">
                            <i class="fas fa-download mr-1"></i> บันทึกรูปลงเครื่อง
                        </button>
                        <button class="btn btn-outline-gold px-4 py-2" onclick="shareToSocial('${imgData}')" id="nativeShareBtn" style="display: none;">
                            <i class="fas fa-share-alt mr-1"></i> แชร์
                        </button>
                    </div>
                </div>
            `,
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            showConfirmButton: false,
            showCloseButton: true,
            width: '600px'
        });

        // ตรวจสอบว่า Browser รองรับ Web Share API ไหม
        if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
            document.getElementById('nativeShareBtn').style.display = 'inline-block';
        }

    } catch (error) {
        console.error("❌ Error generating share card:", error);
        templateWrapper.style.top = '-9999px';
        templateWrapper.style.left = '-9999px';
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function shareToSocial(dataUrl) {
    if (!navigator.share) return;
    
    try {
        // แปลง Base64 เป็น File Object สำหรับ Share API
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'siamhora-prediction.png', { type: blob.type });

        await navigator.share({
            title: 'คำทำนายจาก สยามโหรามงคล',
            text: 'เช็คดวงแม่นๆ กับแอปสยามโหรามงคล! 🔮✨',
            files: [file]
        });
    } catch (error) {
        console.log("Error sharing:", error);
    }
}
