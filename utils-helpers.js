/**
 * 🛠️ Utility Helper Functions
 *
 * รวม helper functions ที่ใช้บ่อย ๆ ทั่ว app
 */

"use strict";

/**
 * ⬆️ เลื่อนไปบนสุด
 *
 * @param {number} duration - เวลา scroll (millisecond, default 300)
 */
function scrollToTop(duration = 300) {
    const start = window.scrollY;
    const startTime = performance.now();

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        window.scrollY = start * (1 - easeProgress);
        window.scrollTo(0, start * (1 - easeProgress));

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

/**
 * 📋 ตรวจสอบว่า element มองเห็นใน viewport หรือไม่
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isElementInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 🎯 เลื่อนไปหาขององค์ประกอบ
 *
 * @param {string} elementId - ID ของ element
 * @param {number} offset - offset จากบนสุด (default 0)
 */
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`❌ Element #${elementId} ไม่พบ`);
        return;
    }

    const top = element.offsetTop - offset;
    window.scrollTo({
        top: top,
        behavior: 'smooth'
    });
}

/**
 * ⏱️ Debounce function
 *
 * @param {function} func - function ที่ต้อง debounce
 * @param {number} wait - เวลาหลังจาก event สุดท้าย (millisecond)
 * @returns {function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 🎭 Throttle function
 *
 * @param {function} func - function ที่ต้อง throttle
 * @param {number} limit - เวลา limit (millisecond)
 * @returns {function}
 */
function throttle(func, limit = 300) {
    let lastRun = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastRun >= limit) {
            func.apply(this, args);
            lastRun = now;
        }
    };
}

/**
 * 📝 Copy text ไปที่ clipboard
 *
 * @param {string} text - text ที่ต้อง copy
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('✅ Copy to clipboard สำเร็จ');
        return true;
    } catch (err) {
        console.error('❌ Copy to clipboard ล้มเหลว:', err);
        return false;
    }
}

/**
 * 🎨 สร้าง URL query string จาก object
 *
 * @param {object} params - object ของ parameters
 * @returns {string} - query string
 */
function buildQueryString(params) {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

/**
 * 📱 ตรวจสอบว่า device เป็น mobile หรือไม่
 *
 * @returns {boolean}
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

/**
 * 🔔 แสดง notification ง่าย ๆ
 *
 * @param {string} message - ข้อความ
 * @param {string} type - 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {number} duration - เวลาแสดง (millisecond, default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // สร้าง element สำหรับ notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // ลบออกหลังจาก duration
    setTimeout(() => {
        notification.remove();
    }, duration);
}

/**
 * 📥 ดาวน์โหลด horoscope image
 *
 * @param {string} elementId - ID ของ element ที่ต้อง capture
 * @param {string} filename - ชื่อไฟล์ที่บันทึก (default: 'horoscope.png')
 */
function downloadHoroscopeImage(elementId, filename = 'horoscope.png') {
    const element = document.getElementById(elementId);
    if (!element) {
        showNotification('❌ ไม่พบหน้าที่ต้องการบันทึก', 'error');
        return;
    }

    // ตรวจสอบว่า html2canvas มี (library สำหรับ capture element)
    if (typeof html2canvas === 'undefined') {
        showNotification('⚠️ ไลบรารี html2canvas ยังไม่ได้โหลด', 'warning');
        console.warn('ต้องใช้: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>');
        return;
    }

    // สร้าง canvas จาก element
    html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        // สร้าง link สำหรับ download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('✅ ดาวน์โหลดสำเร็จ!', 'success');
    }).catch(err => {
        console.error('❌ ข้อผิดพลาดในการบันทึกภาพ:', err);
        showNotification('❌ บันทึกภาพล้มเหลว', 'error');
    });
}

/**
 * 📱 Share ไปยัง Facebook
 *
 * @param {string} url - URL ที่ต้อง share (default: current page)
 * @param {string} title - ชื่อเรื่อง (optional)
 */
function shareToFacebook(url = null, title = null) {
    const shareUrl = url || window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    // เปิด Facebook share dialog
    window.open(facebookShareUrl, 'facebook-share-dialog', 'width=626,height=436');
}

/**
 * 📱 Share ไปยัง Twitter (X)
 *
 * @param {string} text - ข้อความ
 * @param {string} url - URL (optional)
 */
function shareToTwitter(text, url = null) {
    const shareUrl = url || window.location.href;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;

    window.open(twitterShareUrl, 'twitter-share-dialog', 'width=626,height=436');
}

/**
 * 📧 Share ไปยัง Email
 *
 * @param {string} subject - หัวเรื่อง
 * @param {string} body - เนื้อหา
 */
function shareViaEmail(subject, body) {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

/**
 * 📋 Share ไปยัง WhatsApp
 *
 * @param {string} text - ข้อความ
 * @param {string} url - URL (optional)
 */
function shareToWhatsApp(text, url = null) {
    const message = url ? `${text}\n${url}` : text;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, 'whatsapp-share-dialog', 'width=626,height=436');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToTop,
        isElementInViewport,
        scrollToElement,
        debounce,
        throttle,
        copyToClipboard,
        buildQueryString,
        isMobileDevice,
        showNotification,
        downloadHoroscopeImage,
        shareToFacebook,
        shareToTwitter,
        shareViaEmail,
        shareToWhatsApp
    };
}
