const themes = {
    gold: {
        bg: "linear-gradient(135deg, #24243e, #302b63, #0f0c29)",
        glow: "#e8c97a",
        textColor: "#f1c40f"
    },
    pink: {
        bg: "linear-gradient(135deg, #4b134f, #c94b4b, #2c0b30)",
        glow: "#ff7eb3",
        textColor: "#ff7eb3"
    },
    blue: {
        bg: "linear-gradient(135deg, #141e30, #243b55, #0a0f18)",
        glow: "#00c6ff",
        textColor: "#00c6ff"
    },
    green: {
        bg: "linear-gradient(135deg, #134e5e, #71b280, #0b2e38)",
        glow: "#a8e063",
        textColor: "#a8e063"
    }
};

function adjustScale() {
    const wrapper = document.getElementById('previewWrapper');
    const canvas = document.getElementById('renderCanvas');
    if (!wrapper || !canvas) return;

    const wrapperHeight = wrapper.clientHeight;
    const targetHeight = 1920;
    
    let scale = wrapperHeight / targetHeight;
    if (scale > 1) scale = 1;

    canvas.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', adjustScale);

function initData() {
    if (typeof tarotCards === 'undefined') {
        Swal.fire('Error', 'ไม่พบข้อมูลไพ่ยิปซี', 'error');
        return;
    }

    const select = document.getElementById('cardSelect');
    
    tarotCards.forEach((card, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.text = `${card.name} - ${card.meaning.substring(0,30)}...`;
        
        if (card.name === "The Sun") {
            option.selected = true;
        }
        select.appendChild(option);
    });

    updatePreview();
    adjustScale();
}

function updatePreview() {
    const themeKey = document.getElementById('themeSelect').value;
    const patternKey = document.getElementById('patternSelect').value;
    const cardIndex = document.getElementById('cardSelect').value;
    const luckyNumbers = document.getElementById('luckyNumbersInput').value;
    const customName = document.getElementById('nameInput').value;

    const theme = themes[themeKey];
    const card = tarotCards[cardIndex];

    const canvas = document.getElementById('renderCanvas');
    const glow = document.getElementById('themeGlow');
    const numbers = document.getElementById('previewNumbers');
    
    // Toggle Patterns
    const starburst = document.querySelector('.starburst');
    const mandala = document.querySelector('.mandala-bg');
    
    if (starburst) starburst.style.display = 'none';
    if (mandala) mandala.style.display = 'none';
    
    if (patternKey === 'mandala' && mandala) {
        mandala.style.display = 'block';
        mandala.style.backgroundSize = 'cover';
        mandala.style.backgroundRepeat = 'no-repeat';
        mandala.style.backgroundPosition = 'center';
        mandala.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"><g fill=\"none\" stroke=\"rgba(212,175,55,0.15)\" stroke-width=\"0.5\"><circle cx=\"100\" cy=\"100\" r=\"90\"/><circle cx=\"100\" cy=\"100\" r=\"80\"/><path d=\"M100 10 Q140 50 190 100 Q140 150 100 190 Q60 150 10 100 Q60 50 100 10Z\"/><path d=\"M10 100 Q50 60 100 10 Q150 60 190 100 Q150 140 100 190 Q50 140 10 100Z\" transform=\"rotate(45 100 100)\"/><circle cx=\"100\" cy=\"100\" r=\"50\"/><path d=\"M100 50 L100 150 M50 100 L150 100\" stroke-dasharray=\"2,2\"/></g></svg>')";
    } else if (patternKey === 'flower' && mandala) {
        mandala.style.display = 'block';
        mandala.style.backgroundSize = '200px 200px';
        mandala.style.backgroundRepeat = 'repeat';
        mandala.style.backgroundPosition = 'top left';
        mandala.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" width=\"100\" height=\"100\"><g fill=\"none\" stroke=\"rgba(212,175,55,0.15)\" stroke-width=\"0.8\"><circle cx=\"0\" cy=\"0\" r=\"50\"/><circle cx=\"50\" cy=\"0\" r=\"50\"/><circle cx=\"100\" cy=\"0\" r=\"50\"/><circle cx=\"0\" cy=\"50\" r=\"50\"/><circle cx=\"50\" cy=\"50\" r=\"50\"/><circle cx=\"100\" cy=\"50\" r=\"50\"/><circle cx=\"0\" cy=\"100\" r=\"50\"/><circle cx=\"50\" cy=\"100\" r=\"50\"/><circle cx=\"100\" cy=\"100\" r=\"50\"/></g></svg>')";
    } else if (patternKey === 'starburst' && starburst) {
        starburst.style.display = 'block';
    }

    canvas.style.background = theme.bg;
    glow.style.background = theme.glow;
    
    numbers.style.color = theme.textColor;
    numbers.style.textShadow = `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${theme.textColor}`;

    document.getElementById('previewCard').src = card.img;
    document.getElementById('previewNumbers').innerText = luckyNumbers;
    document.getElementById('previewName').innerText = customName || " ";
}

async function downloadImage() {
    const canvasEl = document.getElementById('renderCanvas');
    const wrapper = document.getElementById('previewWrapper');

    // Remove scale trick and force exact dimensions
    const originalTransform = canvasEl.style.transform;
    
    // To prevent clipping issues, we temporarily clone or place it outside
    // For now, setting absolute sizes and removing transform works
    canvasEl.style.transform = 'none';
    
    // Move element temporarily to body to avoid container constraints
    document.body.appendChild(canvasEl);
    canvasEl.style.position = 'fixed';
    canvasEl.style.top = '0';
    canvasEl.style.left = '0';
    canvasEl.style.zIndex = '-9999';

    await new Promise(r => setTimeout(r, 200));

    Swal.fire({
        title: 'กำลังสร้างวอลเปเปอร์...',
        text: 'ภาพมีความละเอียดสูงมาก กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const canvas = await html2canvas(canvasEl, {
            scale: 1, 
            width: 1080,
            height: 1920,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement('a');
        let dateStr = new Date().toISOString().split('T')[0];
        link.download = `LuckyWallpaper_${dateStr}.png`;
        link.href = image;
        link.click();
        
        Swal.close();
    } catch (error) {
        console.error("Error generating image:", error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
    } finally {
        // Put it back
        canvasEl.style.position = 'relative';
        canvasEl.style.top = '';
        canvasEl.style.left = '';
        canvasEl.style.zIndex = '';
        
        // Find the wrapper and put it back in
        const previewContainer = document.getElementById('previewWrapper');
        if (previewContainer) {
            previewContainer.appendChild(canvasEl);
        }
        
        canvasEl.style.transform = originalTransform;
    }
}

window.onload = initData;
