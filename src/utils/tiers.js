
"use strict";

const siteSeo = {
    title: "สยามโหรามงคล - ดูดวงโหราศาสตร์ไทยแม่นยำ",
    description: "สยามโหรามงคล - เว็บดูดวงตามหลักโหราศาสตร์ไทยที่แม่นยำ พยากรณ์ตามตำราโบราณ ทำนายดวงชะตารายปี ปีนักษัตร ยามอัฏฐกาล ฉัตร ๙ ชั้น มหาทักษา และอีกมากมาย",
    packageTitle: "ดูดวงตามหลักโหราศาสตร์ไทยที่แม่นยำ"
};

const packages = [
    { name: "ทดลองใช้", m: "ฟรี", y: "ฟรี" },
    { name: "ธรรมดา", m: 60, y: 600 },
    { name: "ทองแดง", m: 90, y: 900 },
    { name: "เงิน", m: 150, y: 1500 },
    { name: "ทองคำ", m: 300, y: 3000 },
    { name: "ทองคำขาว", m: 600, y: 6000 },
    { name: "ไข่มุก", m: 900, y: 9000 },
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

// โหลดข้อมูลสิทธิ์จาก Firebase และ LocalStorage
try {
    const cached = localStorage.getItem('siamhora_package_permissions');
    if (cached) {
        window.packagePermissions = JSON.parse(cached) || {};
    } else {
        window.packagePermissions = {};
    }
} catch (e) {
    window.packagePermissions = {};
}

async function loadPackagePermissions() {
    try {
        const cached = localStorage.getItem('siamhora_package_permissions');
        if (cached) {
            window.packagePermissions = JSON.parse(cached) || {};
        }
    } catch(e) {}

    if (!window.firebaseDb) {
        setTimeout(loadPackagePermissions, 500);
        buildTableInternal();
        return;
    }
    try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        // Try to load cached or fresh settings
        const snapshot = await getDoc(doc(window.firebaseDb, 'settings', 'packagePermissions'));
        if (snapshot && snapshot.exists()) {
            window.packagePermissions = snapshot.data();
            localStorage.setItem('siamhora_package_permissions', JSON.stringify(window.packagePermissions));
        }
    } catch (e) {
        // Fallback gracefully to local defaults when offline
        console.warn("Operating in offline mode or network delayed. Using local permission defaults.");
    } finally {
        buildTableInternal();
        if (typeof buildDashboard === 'function') buildDashboard();
    }
}
// 🗂️ ระบบ → แพ็กเกจขั้นต่ำที่เปิดใช้ (index ใน packages[])
// จัดลำดับตามความละเอียดของการพยากรณ์ 5 ระดับ
const systemMinTier = {
    // 🟢 ฟรี / ทดลองใช้ (index 0) — ระบบสำเร็จรูป กรอกวันเกิดได้คำตอบทันที
    'todayDashboard': 0, 'promchartsection': 0, 'zodiacdetailsection': 0,
    'daily-horoscope': 0, 'showdaylife': 0, 'dreamPage': 0,
    'siamsiPage': 0, 'cartomancyPage': 0, 'lottoPage': 0,
    'weeklyColorSection': 0, 'elementManualPage': 0, 'yearClashPage': 0,

    // 🔵 ธรรมดา (index 1) — กรอกข้อมูลมากขึ้น ผลลัพธ์หลายมิติ
    'zodiacFortunePage': 1, 'businessFortune': 1, 'chantPage': 1,
    'chantLibraryPage': 1, 'auspicious-day': 1, 'dailyTabooPage': 1,
    'lunarSection': 1,

    // 🔵 ทองแดง (index 2) — มีการวิเคราะห์ลึกขึ้น
    'twelveZodiacFortunePage': 2, 'ubakong-yarm': 2, 'ditheePage': 2,
    'birthfortune': 2, 'tarotPage': 2,

    // 🟣 เงิน (index 3) — โหราศาสตร์ไทยจริงจัง ต้องใช้เวลาเกิด
    'thaiAstrology': 3, 'ascendantPage': 3, 'compatibilityPage': 3,
    'soulmate-direction': 3, 'kaliyokepage': 3, 'reuxpage': 3,

    // 🟣 ทองคำ (index 4) — ศาสตร์เฉพาะทาง ซับซ้อนขึ้น
    'marriage-compatibility': 4, 'nameAnalysisPage': 4, 'numerologyPage': 4,
    'fengShuiPage': 4, 'dailyHighlightPage': 4, 'lifeGraphPage': 4,

    // 🔴 ทองคำขาว (index 5) — คัมภีร์และระบบบันทึกดวง
    'planetRelationPage': 5, 'taksaPage': 5, 'mahathaksaPage': 5, 'chatraPage': 5,
    'auspiciousPage': 5, 'sompong-wealth': 5,

    // 🔴 ไข่มุก (index 6) — ศาสตร์ละเอียดอ่อน ฤกษ์เฉพาะกิจ
    'patient-prognosis': 6, 'lifeExtensionPage': 6,
    'auspiciousOpening': 6, 'ceremonyDate': 6,

    // 🔴 ทับทิม (index 7) — ฤกษ์ยามชั้นสูง ศาสตร์หายาก
    'planetaryHoursPage': 7, 'climate-section': 7,
    'personalizedAuspiciousPage': 7,

    // 🔴 ไพฑูรย์ (index 8) — ทักษา ฉัตร สัตตเลข
    'thaksaninesection': 8, 'chatninePage': 8, 'sevenDigitsPage': 8,

    // 👑 มรกต (index 9) — ภพเรือนชะตา ทศาดาว
    'twelveHousesPage': 9, 'dashaPage': 9,

    // 👑 เพชร (index 10) — ผูกดวงสมบูรณ์ & คัมภีร์แว่นตาโหร
    'thaiAstrologyEngine': 10, 'waentaHoraPage': 10,

    // 👑 มงกุฎ (index 11) — ผูกดวงมืออาชีพ นิรายนะ
    'thaiHoroscopeProPage': 11, 'ayanamsaPage': 11,

    // 👑 มงกุฎเพชร (index 12) — ดาวจรรายเดือน คัมภีร์มหาทักษาสัตตเลข
    'monthlyTransitPage': 12, 'taksaSattalekPage': 12,

    // 👑 ไตรมงกุฎ (index 13) — ตำราโหราศาสตร์
    'thaiHoraBookPage': 13,

    // 👑 เพชรยอดมงกุฎ (index 14) — สยามโหรามงคล ดวงเมือง
    'siamHoramangkolPage': 14, 'rattanakosinCityPage': 14,

    // 👑 วิมาน (index 15) — VIP ผูกดวงคู่สมพงษ์
    'deepSynastryPage': 15
};

function checkPermissionDefault(pkgName, menuIndex, menuId) {
    // ถ้ามี menuId → ใช้ systemMinTier ตรวจสอบตรง ๆ
    if (menuId && systemMinTier[menuId] !== undefined) {
        const pkgIndex = packages.findIndex(p => p.name === pkgName);
        if (pkgIndex === -1) return false;
        return pkgIndex >= systemMinTier[menuId];
    }
    // Fallback สำหรับ menuId ที่ไม่ได้กำหนดใน systemMinTier → ใช้ index เดิม
    const pkgIndex = packages.findIndex(p => p.name === pkgName);
    if (pkgIndex === -1) return false;
    if (pkgIndex >= 9) return true; // มรกตขึ้นไปได้ทุกอย่าง
    if (pkgIndex === 0) return menuIndex < 12;
    if (pkgIndex === 1) return menuIndex < 19;
    if (pkgIndex === 2) return menuIndex < 24;
    if (pkgIndex === 3) return menuIndex < 30;
    if (pkgIndex === 4) return menuIndex < 35;
    if (pkgIndex === 5) return menuIndex < 40;
    if (pkgIndex === 6) return menuIndex < 44;
    if (pkgIndex === 7) return menuIndex < 47;
    if (pkgIndex === 8) return menuIndex < 50;
    return true;
}

// 🔑 ฟังก์ชันดึง index ลำดับเมนูตามความลึก (สำหรับกรณีไม่มี custom permission ในฐานข้อมูล)
function getMenuDepthIndex(menuId) {
    if (typeof APP_MENU === 'undefined') return 0;
    const depthScores = {
        'deepSynastryPage': 100, 'ayanamsaPage': 99, 'monthlyTransitPage': 98, 'twelveHousesPage': 97, 'dashaPage': 96,
        'thaksaninesection': 95, 'taksaPage': 94, 'chatninePage': 93, 'sevenDigitsPage': 92, 'horoscopeseven': 91,
        'sompong-wealth': 90, 'personalizedAuspiciousPage': 89, 'chatraPage': 88, 'climate-section': 87, 'planetRelationPage': 86,
        'ascendantPage': 85, 'nameAnalysisPage': 84, 'numerologyPage': 83, 'soulmate-direction': 82, 'marriage-compatibility': 81,
        'compatibilityPage': 80, 'patient-prognosis': 79, 'lifeExtensionPage': 78, 'auspiciousOpening': 77, 'ceremonyDate': 76,
        'planetaryHoursPage': 75, 'dailyHighlightPage': 74, 'birthfortune': 73, 'kaliyokepage': 72, 'reuxpage': 71,
        'thaiHoraPage': 70, 'thaiAstrology': 69
    };
    const validMenus = APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin'));
    validMenus.sort((a, b) => {
        const scoreA = depthScores[a.id] || 50;
        const scoreB = depthScores[b.id] || 50;
        if (scoreA === scoreB) return a.title.localeCompare(b.title, 'th');
        return scoreA - scoreB;
    });
    const foundIdx = validMenus.findIndex(m => m.id === menuId);
    return foundIdx !== -1 ? foundIdx : 0;
}

// 🛡️ ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึงระบบตามระดับแพ็กเกจของผู้ใช้
window.hasPackagePermission = function(menuId) {
    if (!menuId) return true;
    // ข้อยกเว้น: หน้าหลัก, แพ็กเกจ, ประวัติ, คลังความรู้, โปรไฟล์ ให้เข้าได้ทุกคน
    const alwaysAllow = ['mainpage', 'mainContent', 'package', 'historySection', 'profilePage', 'knowledgePage'];
    if (alwaysAllow.includes(menuId)) return true;

    // 1. ถ้าเป็น Admin หรือ Data Manager ให้ผ่านได้ทุกเมนู (ยกเว้นกรณี Admin กำลังเปิดโหมดทดสอบจำลองระดับ simulatePackage)
    const isSimulating = localStorage.getItem('siamhora_simulate_package');
    if (checkIsAdminUser() && !isSimulating) return true;

    // 2. ดึงข้อมูล Session ของผู้ใช้
    let userPkg = isSimulating || 'ทดลองใช้';
    try {
        const raw = localStorage.getItem('siamhora_auth_session');
        if (raw) {
            const session = JSON.parse(raw);
            if (session) {
                if ((session.role === 'admin' || session.role === 'data_manager') && !isSimulating && !session.simulatePackage) return true;
                if (isSimulating) {
                    userPkg = isSimulating;
                } else if (session.simulatePackage) {
                    userPkg = session.simulatePackage;
                } else if (session.package) {
                    userPkg = session.package;
                }
                
                // ตรวจสอบวันหมดอายุแพ็กเกจ (ถ้าไม่ได้อยู่ในโหมดจำลอง)
                if (!isSimulating && !session.simulatePackage && session.packageExpiry && session.package !== 'ทดลองใช้') {
                    const expiry = new Date(session.packageExpiry).getTime();
                    if (Date.now() > expiry) {
                        userPkg = 'ทดลองใช้'; // หมดอายุแล้ว ลดระดับกลับเป็นทดลองใช้
                    }
                }
            }
        }
    } catch (e) {}

    // 3. ตรวจสอบสิทธิ์จาก window.packagePermissions หรือ default
    if (window.packagePermissions && window.packagePermissions[userPkg] && window.packagePermissions[userPkg][menuId] !== undefined) {
        return Boolean(window.packagePermissions[userPkg][menuId]);
    }

    const menuIdx = getMenuDepthIndex(menuId);
    return checkPermissionDefault(userPkg, menuIdx, menuId);
};

// 📌 ฟังก์ชันดึงข้อมูลระดับแพ็กเกจขั้นต่ำที่ต้องการสำหรับระบบนั้นๆ
window.getRequiredTierInfo = function(menuId) {
    const minTierIdx = (menuId && systemMinTier[menuId] !== undefined) ? systemMinTier[menuId] : 0;
    const targetPkg = packages[minTierIdx] || packages[0];
    return {
        minTierIndex: minTierIdx,
        packageName: targetPkg.name,
        priceMonth: targetPkg.m,
        priceYear: targetPkg.y
    };
};

// 🔒 ฟังก์ชันแจ้งเตือนอัปเกรดแพ็กเกจเมื่อผู้ใช้ไม่มีสิทธิ์เข้าถึงฟีเจอร์
window.showTierUpgradePrompt = function(featureTitle, menuId) {
    const tierInfo = window.getRequiredTierInfo(menuId);
    const titleText = featureTitle ? `ระบบ ${featureTitle}` : 'ระบบนี้';
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'warning',
            title: '🔒 สิทธิพิเศษเฉพาะสมาชิก',
            html: `
                <div class="text-left px-2" style="font-size: 0.95rem; line-height: 1.6;">
                    <p class="mb-2"><strong>${titleText}</strong> สงวนสิทธิ์สำหรับสมาชิกแพ็กเกจระดับ <strong>「${tierInfo.packageName}」</strong> ขึ้นไปครับ</p>
                    <p class="mb-2 text-muted" style="font-size: 0.88rem;">ผู้ใช้ในระดับ <strong>ทดลองใช้</strong> ยังไม่สามารถเข้าใช้งานฟีเจอร์นี้ได้</p>
                    <div class="p-3 rounded my-2" style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);">
                        <i class="fas fa-crown text-warning mr-1"></i> ปลดล็อกเริ่มต้นที่ระดับ: <strong class="text-warning">${tierInfo.packageName}</strong> 
                        ${tierInfo.priceMonth !== 'ฟรี' && tierInfo.priceMonth !== 'ติดต่อ' ? `(฿${Number(tierInfo.priceMonth).toLocaleString()}/เดือน)` : ''}
                    </div>
                </div>
            `,
            confirmButtonText: '👑 ดูและเลือกแพ็กเกจ',
            confirmButtonColor: '#d4af37',
            showCancelButton: true,
            cancelButtonText: 'ไว้คราวหน้า',
            cancelButtonColor: '#6c757d',
            customClass: { popup: 'rounded-4 shadow-lg' }
        }).then((result) => {
            if (result.isConfirmed) {
                if (typeof navigateTo === 'function') {
                    navigateTo('package');
                } else {
                    window.location.hash = '#package';
                }
            }
        });
    } else {
        if (confirm(`${titleText} สงวนสิทธิ์สำหรับสมาชิกระดับ ${tierInfo.packageName} ขึ้นไป\nคุณต้องการดูรายละเอียดแพ็กเกจเพื่ออัปเกรดหรือไม่?`)) {
            if (typeof navigateTo === 'function') {
                navigateTo('package');
            } else {
                window.location.hash = '#package';
            }
        }
    }
};

function checkIsAdminUser() {
    if (typeof isAdmin === 'function' && isAdmin()) return true;
    try {
        const raw = localStorage.getItem('siamhora_auth_session');
        if (raw) {
            const session = JSON.parse(raw);
            if (session && (session.role === 'admin' || session.role === 'data_manager')) return true;
        }
    } catch (e) {}
    return false;
}

window.togglePermission = async function(pkgName, menuId, tdId, menuIndex, pIndex) {
    if (!checkIsAdminUser()) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('เฉพาะผู้ดูแลระบบ', 'คุณต้องเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ (Admin) เพื่อปรับแต่งสิทธิ์แพ็กเกจ', 'warning');
        } else {
            alert('คุณต้องเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ (Admin) เพื่อปรับแต่งสิทธิ์แพ็กเกจ');
        }
        return;
    }
    
    if (!window.packagePermissions) {
        window.packagePermissions = {};
    }
    if (!window.packagePermissions[pkgName]) {
        window.packagePermissions[pkgName] = {};
    }
    
    let isAllowed = window.packagePermissions[pkgName][menuId];
    if (isAllowed === undefined) {
        isAllowed = checkPermissionDefault(pkgName, menuIndex, menuId);
    }
    
    const newState = !isAllowed;
    window.packagePermissions[pkgName][menuId] = newState;
    
    const tdElement = document.getElementById(tdId);
    if (tdElement) {
        tdElement.innerHTML = newState ? '<span class="perm-icon-tick"><i class="fas fa-check"></i></span>' : '<span class="perm-icon-cross"><i class="fas fa-times"></i></span>';
        tdElement.style.background = newState ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)';
        setTimeout(() => { if (tdElement) tdElement.style.background = ''; }, 600);
    }
    
    // ⚡ ระบบ Cascade ตามลำดับขั้นแพ็กเกจ:
    if (pIndex !== undefined) {
        if (newState === false) {
            // เมื่อ "ปิด" สิทธิ์ที่ระดับนี้ -> ระดับที่ "ต่ำกว่าทั้งหมด" (0 ถึง pIndex - 1) ต้องถูกปิดไปด้วยอัตโนมัติ
            for (let i = 0; i < pIndex; i++) {
                const lowerPkg = packages[i].name;
                if (!window.packagePermissions[lowerPkg]) window.packagePermissions[lowerPkg] = {};
                window.packagePermissions[lowerPkg][menuId] = false;
                
                const lowerTd = document.getElementById(`td_${menuId}_${i}`);
                if (lowerTd) {
                    lowerTd.innerHTML = '<span class="perm-icon-cross"><i class="fas fa-times"></i></span>';
                    lowerTd.style.background = 'rgba(239, 68, 68, 0.12)';
                    setTimeout(() => { if (lowerTd) lowerTd.style.background = ''; }, 600);
                }
            }
        } else {
            // เมื่อ "เปิด" สิทธิ์ที่ระดับนี้ -> ระดับที่ "สูงกว่าทั้งหมด" (pIndex + 1 เป็นต้นไป) ต้องได้ใช้ด้วยอัตโนมัติ
            for (let i = pIndex + 1; i < packages.length; i++) {
                const higherPkg = packages[i].name;
                if (!window.packagePermissions[higherPkg]) window.packagePermissions[higherPkg] = {};
                window.packagePermissions[higherPkg][menuId] = true;
                
                const higherTd = document.getElementById(`td_${menuId}_${i}`);
                if (higherTd) {
                    higherTd.innerHTML = '<span class="perm-icon-tick"><i class="fas fa-check"></i></span>';
                    higherTd.style.background = 'rgba(34, 197, 94, 0.12)';
                    setTimeout(() => { if (higherTd) higherTd.style.background = ''; }, 600);
                }
            }
        }
    }
    
    // อัปเดตตัวเลขสรุปจำนวนระบบที่ใช้ได้ด้านบนแบบ Realtime ทันที
    if (typeof window.updateAllPackageCounts === 'function') {
        window.updateAllPackageCounts();
    }
    
    // บันทึกลง Firestore และ LocalStorage
    try {
        localStorage.setItem('siamhora_package_permissions', JSON.stringify(window.packagePermissions));
        if (window.firebaseDb) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(window.firebaseDb, 'settings', 'packagePermissions'), window.packagePermissions, { merge: true });
        }
        if (typeof Swal !== 'undefined' && typeof Swal.mixin === 'function') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: `${newState ? '✅ เปิด' : '❌ ปิด'}สิทธิ์ [${pkgName}] และระดับที่เกี่ยวข้องเรียบร้อย`
            });
        }
    } catch (e) {
        console.error("Error saving permission", e);
    }
}

function applySiteSeo() {
    document.title = siteSeo.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', siteSeo.description);
    }
}

function countAllowedSystems(pkgName, pIndex, sortedMenus) {
    if (!sortedMenus || sortedMenus.length === 0) return 0;
    let count = 0;
    sortedMenus.forEach((menu, index) => {
        let isAllowed = window.packagePermissions && window.packagePermissions[pkgName] && window.packagePermissions[pkgName][menu.id] !== undefined
            ? window.packagePermissions[pkgName][menu.id]
            : checkPermissionDefault(pkgName, index, menu.id);
        if (isAllowed) count++;
    });
    return count;
}

window.updateAllPackageCounts = function() {
    if (typeof packages === 'undefined') return;
    let validMenus = [];
    if (typeof APP_MENU !== 'undefined') {
        validMenus = APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin'));
    }
    const depthScores = {
        'deepSynastryPage': 100, 'ayanamsaPage': 99, 'monthlyTransitPage': 98, 'twelveHousesPage': 97, 'dashaPage': 96,
        'thaksaninesection': 95, 'taksaPage': 94, 'chatninePage': 93, 'sevenDigitsPage': 92, 'horoscopeseven': 91,
        'sompong-wealth': 90, 'personalizedAuspiciousPage': 89, 'chatraPage': 88, 'climate-section': 87, 'planetRelationPage': 86,
        'ascendantPage': 85, 'nameAnalysisPage': 84, 'numerologyPage': 83, 'soulmate-direction': 82, 'marriage-compatibility': 81,
        'compatibilityPage': 80, 'patient-prognosis': 79, 'lifeExtensionPage': 78, 'auspiciousOpening': 77, 'ceremonyDate': 76,
        'planetaryHoursPage': 75, 'dailyHighlightPage': 74, 'birthfortune': 73, 'kaliyokepage': 72, 'reuxpage': 71,
        'thaiHoraPage': 70, 'thaiAstrology': 69
    };
    validMenus.sort((a, b) => {
        const scoreA = depthScores[a.id] || 50;
        const scoreB = depthScores[b.id] || 50;
        if (scoreA === scoreB) return a.title.localeCompare(b.title, 'th');
        return scoreA - scoreB;
    });

    packages.forEach((pkg, idx) => {
        const badge = document.getElementById(`pkgCountBadge_${idx}`);
        if (badge) {
            const count = countAllowedSystems(pkg.name, idx, validMenus);
            badge.textContent = `ใช้ได้ ${count} ระบบ`;
        }
    });
};

function buildTableInternal() {
    const title = document.querySelector('#package .package-hero-title') || document.querySelector('#package .title');
    const head = document.getElementById('headerRow');
    const body = document.getElementById('serviceBody');
    const mRow = document.querySelector('.row-m');
    const yRow = document.querySelector('.row-y');
    const bRow = document.querySelector('.row-buy');

    if (!head || !body || !mRow || !yRow) return;

    if (title) title.textContent = siteSeo.packageTitle;

    // เตรียมรายการเมนูเพื่อคำนวณจำนวนระบบทั้งหมด
    let validMenus = [];
    if (typeof APP_MENU !== 'undefined') {
        validMenus = APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin'));
    } else {
        validMenus = [{id: 'none', title: 'รอโหลดข้อมูล...'}];
    }

    const depthScores = {
        'deepSynastryPage': 100, 'ayanamsaPage': 99, 'monthlyTransitPage': 98, 'twelveHousesPage': 97, 'dashaPage': 96,
        'thaksaninesection': 95, 'taksaPage': 94, 'chatninePage': 93, 'sevenDigitsPage': 92, 'horoscopeseven': 91,
        'sompong-wealth': 90, 'personalizedAuspiciousPage': 89, 'chatraPage': 88, 'climate-section': 87, 'planetRelationPage': 86,
        'ascendantPage': 85, 'nameAnalysisPage': 84, 'numerologyPage': 83, 'soulmate-direction': 82, 'marriage-compatibility': 81,
        'compatibilityPage': 80, 'patient-prognosis': 79, 'lifeExtensionPage': 78, 'auspiciousOpening': 77, 'ceremonyDate': 76,
        'planetaryHoursPage': 75, 'dailyHighlightPage': 74, 'birthfortune': 73, 'kaliyokepage': 72, 'reuxpage': 71,
        'thaiHoraPage': 70, 'thaiAstrology': 69
    };

    validMenus.sort((a, b) => {
        const scoreA = depthScores[a.id] || 50;
        const scoreB = depthScores[b.id] || 50;
        if (scoreA === scoreB) return a.title.localeCompare(b.title, 'th');
        return scoreA - scoreB;
    });

    const totalSystemCount = validMenus.length;

    // Color gradients palette for 16 tiers matching reference
    const tierThemes = [
        { name: "ทดลองใช้", bg: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)", color: "#fff", accent: "#4ade80", btnBg: "#16a34a" },
        { name: "ธรรมดา", bg: "linear-gradient(180deg, #10b981 0%, #059669 100%)", color: "#fff", accent: "#34d399", btnBg: "#059669" },
        { name: "ทองแดง", bg: "linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)", color: "#fff", accent: "#38bdf8", btnBg: "#0891b2" },
        { name: "เงิน", bg: "linear-gradient(180deg, #0284c7 0%, #0369a1 100%)", color: "#fff", accent: "#7dd3fc", btnBg: "#0369a1" },
        { name: "ทองคำ", bg: "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)", color: "#fff", accent: "#a5b4fc", btnBg: "#4f46e5" },
        { name: "ทองคำขาว", bg: "linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)", color: "#fff", accent: "#c084fc", btnBg: "#7c3aed" },
        { name: "ไข่มุก", bg: "linear-gradient(180deg, #a855f7 0%, #9333ea 100%)", color: "#fff", accent: "#e879f9", btnBg: "#9333ea" },
        { name: "ทับทิม", bg: "linear-gradient(180deg, #ec4899 0%, #db2777 100%)", color: "#fff", accent: "#f472b6", btnBg: "#db2777" },
        { name: "ไพฑูรย์", bg: "linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)", color: "#fff", accent: "#fb7185", btnBg: "#e11d48" },
        { name: "มรกต", bg: "linear-gradient(180deg, #059669 0%, #047857 100%)", color: "#fff", accent: "#6ee7b7", btnBg: "#047857" },
        { name: "เพชร", bg: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", accent: "#93c5fd", btnBg: "#2563eb" },
        { name: "มงกุฎ", bg: "linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff", accent: "#ddd6fe", btnBg: "#6d28d9" },
        { name: "มงกุฎเพชร", bg: "linear-gradient(180deg, #ea580c 0%, #c2410c 100%)", color: "#fff", accent: "#fdba74", btnBg: "#c2410c" },
        { name: "ไตรมงกุฎ", bg: "linear-gradient(180deg, #d97706 0%, #b45309 100%)", color: "#fff", accent: "#fde68a", btnBg: "#b45309" },
        { name: "เพชรยอดมงกุฎ", bg: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)", color: "#fff", accent: "#fef08a", btnBg: "#d97706" },
        { name: "วิมาน", bg: "linear-gradient(180deg, #eab308 0%, #ca8a04 100%)", color: "#fff", accent: "#fef08a", btnBg: "#ca8a04" }
    ];

    // 1. ช่องมุมซ้ายบนสุด (ตรึงทั้ง top: 59px และ left:0) สไตล์ PRICING TABLE ป้ายลึก
    head.innerHTML = `
        <th class="sticky-col" style="position: sticky; position: -webkit-sticky; top: 59px; left: 0; z-index: 60; background: linear-gradient(135deg, #102154 0%, #0c173b 100%); color: #ffffff; border-right: 2.5px solid rgba(212,175,55,0.45); border-bottom: 2px solid rgba(255,255,255,0.1); text-align: left; padding: 12px 14px; white-space: nowrap; vertical-align: middle; min-width: 320px;">
            <div style="font-size: 0.7rem; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">SIAM HORAMANGKOL</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #ffd700; margin-top: 2px;">รายการพยากรณ์</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px; font-weight: 500;">ทั้งหมด ${totalSystemCount} ระบบ</div>
        </th>
    `;
    body.innerHTML = '';
    
    // 2. แถวราคาด้านล่าง
    if (mRow) mRow.innerHTML = '<th class="sticky-col" style="position: sticky; position: -webkit-sticky; left: 0; z-index: 25; background: #0c1329; color: #94a3b8; border-right: 2.5px solid rgba(212,175,55,0.45); text-align: left; padding: 8px 12px; white-space: nowrap; font-size: 0.8rem; min-width: 320px;">รายเดือน (30 วัน)</th>';
    if (yRow) yRow.innerHTML = '<th class="sticky-col" style="position: sticky; position: -webkit-sticky; left: 0; z-index: 25; background: #0c1329; color: #94a3b8; border-right: 2.5px solid rgba(212,175,55,0.45); text-align: left; padding: 8px 12px; white-space: nowrap; font-size: 0.8rem; min-width: 320px;">รายปี (365 วัน)</th>';
    if (bRow) bRow.innerHTML = '<th class="sticky-col" style="position: sticky; position: -webkit-sticky; left: 0; z-index: 25; background: #0c1329; color: #ffd700; border-right: 2.5px solid rgba(212,175,55,0.45); text-align: left; padding: 8px 12px; white-space: nowrap; font-size: 0.82rem; font-weight: 600; min-width: 320px;">เลือกแพ็กเกจ</th>';

    // สร้าง Header แต่ละแพ็กเกจ (ตรึง top: 59px) ด้วย Vibrant Arrow-Badge Ribbon
    packages.forEach((pkg, idx) => {
        const theme = tierThemes[idx] || tierThemes[0];
        const priceText = typeof pkg.m === 'number' ? `฿${pkg.m.toLocaleString()}` : pkg.m;
        const allowedCount = countAllowedSystems(pkg.name, idx, validMenus);
        
        const th = document.createElement('th');
        th.style.cssText = `position: sticky; position: -webkit-sticky; top: 59px; z-index: 40; background: #090e1f; padding: 0; border: none; text-align: center; vertical-align: top;`;
        
        th.innerHTML = `
            <div style="background: ${theme.bg}; color: #ffffff; padding: 10px 10px 18px; clip-path: polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%); min-width: 108px; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
                <div style="font-size: 0.78rem; font-weight: 700; opacity: 0.98; white-space: nowrap; letter-spacing: 0.2px;">${pkg.name}</div>
                <div style="font-size: 1.22rem; font-weight: 800; line-height: 1.15; margin-top: 2px; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${priceText}</div>
                <div style="font-size: 0.65rem; opacity: 0.88; margin-top: 1px;">ต่อเดือน</div>
                <div style="margin-top: 5px;">
                    <span id="pkgCountBadge_${idx}" style="display: inline-block; background: rgba(0, 0, 0, 0.28); backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.35); color: #ffffff; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 12px; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.2);">
                        ใช้ได้ ${allowedCount} ระบบ
                    </span>
                </div>
            </div>
        `;
        head.appendChild(th);

        // Action Buttons Row - รายเดือน
        const tdM = document.createElement('th');
        tdM.className = 'price-cell';
        tdM.style.cssText = `background: #0d142b; padding: 6px 8px; vertical-align: middle; text-align: center; border-right: 1px solid rgba(255,255,255,0.05);`;
        if (pkg.name === "ทดลองใช้") {
            tdM.innerHTML = `<span style="font-size: 0.76rem; color: #34d399; font-weight: 600;">ฟรี</span>`;
        } else {
            const pVal = typeof pkg.m === 'number' ? `฿${pkg.m.toLocaleString()}` : pkg.m;
            tdM.innerHTML = `<button type="button" class="btn btn-sm" style="border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); color: #fff; border-radius: 4px; font-size: 0.74rem; padding: 3px 6px; width: 100%; cursor: pointer;" onclick="openPaymentModal('${pkg.name}', 'รายเดือน', ${pkg.m})">${pVal}</button>`;
        }
        mRow.appendChild(tdM);

        // Action Buttons Row - รายปี
        const tdY = document.createElement('th');
        tdY.className = "price-cell";
        tdY.style.cssText = `background: #0d142b; padding: 6px 8px; vertical-align: middle; text-align: center; border-right: 1px solid rgba(255,255,255,0.05);`;
        if (pkg.name === "ทดลองใช้") {
            tdY.innerHTML = `<span style="font-size: 0.76rem; color: #34d399; font-weight: 600;">ฟรี</span>`;
        } else {
            const pVal = typeof pkg.y === 'number' ? `฿${pkg.y.toLocaleString()}` : pkg.y;
            tdY.innerHTML = `<button type="button" class="btn btn-sm" style="border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); color: #fff; border-radius: 4px; font-size: 0.74rem; padding: 3px 6px; width: 100%; cursor: pointer;" onclick="openPaymentModal('${pkg.name}', 'รายปี', ${pkg.y})">${pVal}</button>`;
        }
        yRow.appendChild(tdY);
    });

    // ใช้ validMenus ที่เตรียมและจัดเรียงไว้ด้านบนแล้ว (ยกเว้นเมนูที่จัดการระบบ)

    validMenus.forEach((menu, index) => {
        const tr = document.createElement('tr');
        const isEven = (index % 2 === 1);
        const colBg = isEven ? '#0f1226' : '#141730';
        
        // ทำความสะอาด HTML tags จากชื่อเมนู
        let cleanTitle = menu.title.replace(/<[^>]*>?/gm, ' ');
        let iconClass = menu.icon ? (menu.icon.includes('fa-') && !menu.icon.includes('fa ') && !menu.icon.includes('fas') ? `fas ${menu.icon}` : menu.icon) : 'fas fa-star';
        let rowHTML = `<td class="sticky-col" style="position: sticky; position: -webkit-sticky; left: 0; z-index: 25; background-color: ${colBg}; color: #ffffff; text-align:left; border-right: 2.5px solid rgba(212,175,55,0.45); padding: 8px 14px; font-weight: 600; white-space: nowrap; min-width: 320px;"><i class="${iconClass} mr-2" style="color: #ffd700;"></i> ${cleanTitle}</td>`;
        
        packages.forEach((pkg, pIndex) => {
            let isAllowed = window.packagePermissions && window.packagePermissions[pkg.name] && window.packagePermissions[pkg.name][menu.id] !== undefined
                ? window.packagePermissions[pkg.name][menu.id]
                : checkPermissionDefault(pkg.name, index, menu.id);
                
            let adminClick = '';
            let cursorStyle = '';
            const isAdm = checkIsAdminUser();
            if (isAdm) {
                adminClick = `onclick="togglePermission('${pkg.name}', '${menu.id}', 'td_${menu.id}_${pIndex}', ${index}, ${pIndex})" title="คลิกเพื่อ เปิด/ปิด สิทธิ์แพ็กเกจ ${pkg.name}"`;
                cursorStyle = 'cursor:pointer; user-select:none;';
            }
            
            const theme = tierThemes[pIndex] || tierThemes[0];
            let iconHtml = isAllowed 
                ? `<span class="perm-icon-tick" style="${cursorStyle} color: ${theme.accent};"><i class="fas fa-check"></i></span>` 
                : `<span class="perm-icon-cross" style="${cursorStyle}"><i class="fas fa-times"></i></span>`;
            rowHTML += `<td class="status-cell" id="td_${menu.id}_${pIndex}" ${adminClick} style="${cursorStyle} padding: 10px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); border-right: 1px solid rgba(255,255,255,0.04); text-align: center; vertical-align: middle;">${iconHtml}</td>`;
        });
        
        tr.innerHTML = rowHTML;
        body.appendChild(tr);
    });
}

function buildTable() {
    applySiteSeo();
    buildTableInternal();
    loadPackagePermissions();
}

// ==========================================
// 👑 MODERN AI PRICING UI CONTROLLER
// ==========================================
window.currentPackageBillingPeriod = 'monthly';

// ข้อมูลคำอธิบายและจุดเด่นของแต่ละแพ็กเกจ (ครบ 16 ระดับ แบบสะสมสิทธิ์ต่อเนื่อง)
const packageTierMeta = {
    "ทดลองใช้": {
        badge: "เริ่มต้นฟรี",
        icon: "fa-seedling",
        themeColor: "#94a3b8",
        desc: "สัมผัสการผูกดวงพื้นฐานตามตำราโบราณ",
        features: [
            "คำนวณวันเดือนปีเกิดสุริยคติ/จันทรคติ",
            "ผูกดวงพื้นฐาน ๑๒ ราศี",
            "บันทึกสมาชิก 1 ท่าน",
            "ดูฤกษ์ยามเบื้องต้น"
        ]
    },
    "ธรรมดา": {
        badge: "บุคคลทั่วไป",
        icon: "fa-user-check",
        themeColor: "#38bdf8",
        desc: "เหมาะสำหรับตรวจดวงชะตาส่วนบุคคลรายเดือน",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจทดลองใช้</strong>",
            "✨ คำนวณลัคนาอันโตนาที",
            "✨ วิเคราะห์ชื่อและถอดรหัสเลขศาสตร์",
            "✨ ตรวจดวงสมพงศ์ความรักพื้นฐาน",
            "✨ บันทึกข้อมูลสมาชิกได้ต่อเนื่อง"
        ]
    },
    "ทองแดง": {
        badge: "ระดับเริ่มต้น",
        icon: "fa-shield-alt",
        themeColor: "#fb923c",
        desc: "เสริมดวงชะตาและวิเคราะห์คู่มิตร-คู่ศัตรู",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจธรรมดา</strong>",
            "✨ วิเคราะห์คู่มิตร-คู่ศัตรูตามหลักโหร",
            "✨ ตรวจเกณฑ์กาลโยคประจำปี",
            "✨ คำนวณทิศโชคลาภรายวัน",
            "✨ ดูฤกษ์ยาม ๗ เจ้า"
        ]
    },
    "เงิน": {
        badge: "ยอดนิยม",
        icon: "fa-coins",
        themeColor: "#e2e8f0",
        desc: "ปลดล็อกคำทำนาย ๗ ภูมิรายปี และเลขเด็ด",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจทองแดง</strong>",
            "✨ ทักษาพยากรณ์ ๙ ภูมิรายปี",
            "✨ เลขเด่นและเลขมงคลประจำงวด",
            "✨ คำนวณเกณฑ์โรคภัยและทิศทางสุขภาพ",
            "✨ บันทึกสมาชิกได้ 10 ท่าน"
        ]
    },
    "ทองคำ": {
        badge: "👑 ยอดนิยม (BEST VALUE)",
        icon: "fa-crown",
        themeColor: "#ffd700",
        isPopular: true,
        desc: "ปลดล็อกระบบคัมภีร์ลัคนาและมหาทักษาเต็มรูปแบบ",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจเงิน</strong>",
            "✨ ลัคนาคัมภีร์สุริยยาตร์ & นวางศ์จักร",
            "✨ มหาทักษาเสวยอายุ & ชันษาจร",
            "✨ ฉัตร ๙ ชั้น และ ตรียางศ์นิรายนะ",
            "✨ พยากรณ์เนื้อคู่และสมพงศ์มหาสมบัติ",
            "✨ สร้างและพิมพ์แผ่นดวงชะตาได้ไม่จำกัด"
        ]
    },
    "ทองคำขาว": {
        badge: "โหราจารย์แนะนำ",
        icon: "fa-award",
        themeColor: "#f1f5f9",
        desc: "คัมภีร์มหาทักษาสัตตเลขและผูกดวงนิรายนะ",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจทองคำ</strong>",
            "✨ คัมภีร์มหาทักษาสัตตเลข ฐาน ๔ ฐาน ๙",
            "✨ ผูกดวงนิรายนะ ลาหิริ/สุริยยาตร์",
            "✨ คำนวณดาวจรรายเดือนแบบละเอียด",
            "✨ ตรวจสมพงศ์ดวงชะตากับดวงเมือง"
        ]
    },
    "ไข่มุก": {
        badge: "พรีเมียม VIP",
        icon: "fa-gem",
        themeColor: "#fbcfe8",
        desc: "ถอดรหัสวาสนา ๑๐ ขั้นตอน สไตล์สยามโหราฯ",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจทองคำขาว</strong>",
            "✨ ผังพยากรณ์สยามโหรามงคล ๑๐ ขั้นตอน",
            "✨ ระบบคำนวณทศาดาวเสวยอายุ",
            "✨ ฤกษ์มงคลเฉพาะบุคคลเจาะลึก",
            "✨ ออกรายงานดวงชะตารูปแบบบัตรทอง"
        ]
    },
    "ทับทิม": {
        badge: "ระดับสูง",
        icon: "fa-fire",
        themeColor: "#f43f5e",
        desc: "ตรวจเกณฑ์พิรุณศาสตร์ ชะตาโลก และดวงลึกซึ้ง",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจไข่มุก</strong>",
            "✨ เกณฑ์พิรุณศาสตร์และชะตาโลก ๔ ภูมิภพ",
            "✨ ระบบผูกดวงราศีจักร-ทักษา-ตรีวัย",
            "✨ วิเคราะห์ดวงเมืองรัตนโกสินทร์ ๒ ชั้น",
            "✨ ดาวจรและสมผุสดาวจริงดาราศาสตร์"
        ]
    },
    "ไพฑูรย์": {
        badge: "มาสเตอร์",
        icon: "fa-compass",
        themeColor: "#a3e635",
        desc: "ปลดล็อกคำทำนายและฤกษ์ยามชั้นสูงทุกมิติ",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจทับทิม</strong>",
            "✨ คลังบทสวดมนต์ศักดิ์สิทธิ์และพิธีกรรม",
            "✨ วิเคราะห์ฮวงจุ้ยและทิศทางอสูรประจำวัน",
            "✨ ฤกษ์เปิดกิจการ ขึ้นบ้านใหม่ ลงเสาเอก",
            "✨ บันทึกสมาชิกดวงชะตาได้ไม่จำกัด"
        ]
    },
    "มรกต": {
        badge: "สำนักพยากรณ์",
        icon: "fa-feather-alt",
        themeColor: "#34d399",
        desc: "โต๊ะพยากรณ์ระดับอาจารย์สำหรับเปิดรับลูกดวง",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจไพฑูรย์</strong>",
            "✨ โต๊ะพยากรณ์สำนัก (Pro Studio 6 มิติ)",
            "✨ บันทึกประวัติการปรึกษาและเคสลูกดวง",
            "✨ ระบบคำนวณค่าครูและประวัติรับเงิน",
            "✨ พิมพ์ใบดวงและส่งออก PDF ระดับมืออาชีพ"
        ]
    },
    "เพชร": {
        badge: "ปรมาจารย์ & Enterprise",
        icon: "fa-wand-magic-sparkles",
        themeColor: "#c084fc",
        desc: "สำหรับเปิดสำนักพยากรณ์และออกรายงานตลอดชีพ",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจมรกต</strong>",
            "✨ ระบบสร้างรายงานดวงชะตาตลอดชีพ PDF",
            "✨ โต๊ะพยากรณ์และบันทึกเคสไม่จำกัด",
            "✨ ส่งออกข้อมูลลูกค้าและการเงินสำนัก",
            "✨ ทีมงานดูแลสิทธิ์แบบ Priority VIP"
        ]
    },
    "มงกุฎ": {
        badge: "เกียรติยศสูงสุด",
        icon: "fa-crown",
        themeColor: "#fbbf24",
        desc: "ระดับบรมครูโหราศาสตร์ สำหรับสถาบันและองค์กร",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจเพชร</strong>",
            "✨ ระบบสร้างแบรนด์และลายน้ำสำนักตนเอง",
            "✨ สร้างใบดวงชะตาและคำทำนายตลอดชีพ",
            "✨ ระบบผู้ช่วยโหร AI วิเคราะห์ดวงขั้นสูง",
            "✨ ซัพพอร์ตโดยตรงจากอาจารย์ผู้พัฒนาระบบ"
        ]
    },
    "มงกุฎเพชร": {
        badge: "บรมครูเกียรติยศ",
        icon: "fa-ring",
        themeColor: "#e879f9",
        desc: "สิทธิ์สำนักโหรระดับประเทศ ออกรายงานได้ไม่จำกัด",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจมงกุฎ</strong>",
            "✨ ออกรายงานและหนังสือผูกดวงปกทองได้ไม่จำกัด",
            "✨ สิทธิ์เพิ่มบัญชีผู้ช่วยในสำนักได้หลายท่าน",
            "✨ ระบบการเงินสำนักและออกใบเสร็จอัตโนมัติ"
        ]
    },
    "ไตรมงกุฎ": {
        badge: "ราชสำนักโหร",
        icon: "fa-chess-king",
        themeColor: "#facc15",
        desc: "สำหรับสมาคม สถาบัน และองค์กรโหราศาสตร์",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจมงกุฎเพชร</strong>",
            "✨ ฐานข้อมูลดวงเมืองและประวัติศาสตร์ชั้นสูง",
            "✨ ระบบเชื่อมต่อ API ฐานข้อมูลดวงดาวสยามโหราฯ",
            "✨ ทีมวิศวกรดูแลความปลอดภัยและเซิร์ฟเวอร์เฉพาะ"
        ]
    },
    "เพชรยอดมงกุฎ": {
        badge: "สุดยอดมหาบารมี",
        icon: "fa-star-of-david",
        themeColor: "#67e8f9",
        desc: "แพ็กเกจสูงสุดสำหรับสถาบันพยากรณ์ครบวงจร",
        features: [
            "<strong>ทุกฟีเจอร์ในแพ็กเกจไตรมงกุฎ</strong>",
            "✨ สิทธิ์ครอบคลุมทุกฟีเจอร์ในปัจจุบันและอนาคต 100%",
            "✨ ที่ปรึกษาระบบส่วนตัวตลอด 24 ชั่วโมง",
            "✨ ปรับแต่งระบบและรายงานพิเศษตามความต้องการ",
            "✨ เอกสิทธิ์สูงสุดในเครือข่ายสยามโหรามงคล"
        ]
    },
    "วิมาน": {
        badge: "Custom Enterprise",
        icon: "fa-hotel",
        themeColor: "#cbd5e1",
        desc: "บริการระบบโซลูชันเฉพาะองค์กรหรือสถาบันขนาดใหญ่",
        features: [
            "<strong>ครอบคลุมฟีเจอร์ทั้งหมดในทุกระดับ</strong>",
            "✨ ปรับแต่งฟังก์ชันระบบตามสเปกเฉพาะทาง",
            "✨ ติดตั้งระบบบน Dedicated Server หรือ Private Cloud",
            "✨ สัญญาบริการระดับ Enterprise SLA"
        ]
    }
};

window.renderAllPackageCards = function() {
    const container = document.getElementById('featuredPricingCards');
    if (!container) return;

    let html = '';
    const period = window.currentPackageBillingPeriod || 'monthly';

    packages.forEach(pkg => {
        const meta = packageTierMeta[pkg.name] || {
            badge: "สมาชิก",
            icon: "fa-gem",
            themeColor: "#ffd700",
            desc: "แพ็กเกจพยากรณ์ระดับ " + pkg.name,
            features: ["เข้าถึงฟีเจอร์พยากรณ์ตามสิทธิ์", "บันทึกข้อมูลสมาชิก"]
        };

        const isFree = pkg.m === 'ฟรี';
        const isContact = pkg.m === 'ติดต่อ';
        const isPop = Boolean(meta.isPopular);

        // คำนวณราคาตาม billing period
        let priceDisplay = '';
        let periodDisplay = '';
        if (isFree) {
            priceDisplay = 'ฟรี';
            periodDisplay = '/ ตลอดชีพ';
        } else if (isContact) {
            priceDisplay = 'ติดต่อ';
            periodDisplay = '/ โซลูชัน';
        } else {
            const num = period === 'monthly' ? pkg.m : pkg.y;
            priceDisplay = '฿' + Number(num).toLocaleString();
            periodDisplay = period === 'monthly' ? '/ เดือน' : '/ ปี';
        }

        const borderStyle = isPop 
            ? 'border: 2px solid #ffd700; box-shadow: 0 10px 35px rgba(212, 175, 55, 0.3);' 
            : `border: 1px solid rgba(255, 255, 255, 0.12);`;
        const cardBg = isPop
            ? 'background: linear-gradient(145deg, rgba(30, 27, 75, 0.9), rgba(20, 24, 48, 0.95));'
            : 'background: rgba(20, 24, 48, 0.65);';

        let buttonHtml = '';
        if (isFree) {
            buttonHtml = `<button class="btn btn-outline-secondary w-100 py-2 rounded-pill font-weight-bold" disabled>ใช้งานฟรี</button>`;
        } else if (isContact) {
            buttonHtml = `<button class="btn btn-outline-light w-100 py-2 rounded-pill font-weight-bold" onclick="selectCardPackage('${pkg.name}')" style="border-color:${meta.themeColor}; color:${meta.themeColor};"><i class="fab fa-line mr-1"></i> ติดต่อเจ้าหน้าที่</button>`;
        } else if (isPop) {
            buttonHtml = `<button class="btn btn-warning w-100 py-2 rounded-pill font-weight-bold shadow" style="background: linear-gradient(135deg, #ffd700, #f59e0b); color: #000; border: none;" onclick="selectCardPackage('${pkg.name}')"><i class="fas fa-bolt mr-1"></i> เลือกแพ็กเกจนี้</button>`;
        } else {
            buttonHtml = `<button class="btn btn-outline-light w-100 py-2 rounded-pill font-weight-bold" style="border-color:${meta.themeColor}; color:#fff;" onclick="selectCardPackage('${pkg.name}')">เลือกแพ็กเกจนี้</button>`;
        }

        let featuresLi = meta.features.map(f => {
            if (f.startsWith('<strong>')) {
                return `<li style="color:#ffffff; font-weight:600; margin-bottom:6px;"><i class="fas fa-layer-group mr-2" style="color: ${meta.themeColor};"></i> ${f}</li>`;
            }
            return `<li><i class="fas fa-check mr-2" style="color: ${meta.themeColor};"></i> ${f}</li>`;
        }).join('');

        html += `
            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div class="h-100 p-4 rounded-3 d-flex flex-column justify-content-between position-relative" 
                     style="${cardBg} ${borderStyle} border-radius: 20px; backdrop-filter: blur(15px); transition: all 0.3s ease;">
                    
                    ${isPop ? `<div class="position-absolute" style="top: -13px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #ffd700, #f59e0b); color: #0a0e1c; font-size: 0.76rem; font-weight: 800; padding: 4px 16px; border-radius: 20px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); white-space: nowrap;">👑 แนะนำยอดนิยม (BEST VALUE)</div>` : ''}

                    <div class="mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3 ${isPop ? 'mt-1' : ''}">
                            <span class="badge px-3 py-1 rounded-pill" style="background: rgba(255,255,255,0.08); color: ${meta.themeColor}; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.15);">
                                ${meta.badge}
                            </span>
                            <i class="fas ${meta.icon}" style="font-size: 1.4rem; color: ${meta.themeColor};"></i>
                        </div>
                        <h3 class="font-weight-bold text-white mb-2" style="font-size: 1.45rem;">${pkg.name}</h3>
                        <p class="text-white-50 small mb-3" style="min-height: 40px;">${meta.desc}</p>
                        
                        <div class="my-4">
                            <span class="font-weight-bold price-value-tag" data-monthly="${pkg.m}" data-yearly="${pkg.y}" style="color: ${meta.themeColor}; font-size: 2.3rem;">
                                ${priceDisplay}
                            </span>
                            <span class="text-white-50 small price-period-tag">${periodDisplay}</span>
                        </div>

                        <ul class="list-unstyled text-left small mb-0" style="line-height: 2.1; color: #cbd5e1;">
                            ${featuresLi}
                        </ul>
                    </div>

                    <div class="mt-auto pt-3">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
};

window.setPackageBilling = function(period) {
    window.currentPackageBillingPeriod = period;
    const mBtn = document.getElementById('billingMonthlyBtn');
    const yBtn = document.getElementById('billingYearlyBtn');

    if (period === 'monthly') {
        if (mBtn) {
            mBtn.style.background = 'linear-gradient(135deg, #d4af37, #f59e0b)';
            mBtn.style.color = '#0a0e1c';
            mBtn.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.35)';
        }
        if (yBtn) {
            yBtn.style.background = 'transparent';
            yBtn.style.color = '#cbd5e1';
            yBtn.style.boxShadow = 'none';
        }
    } else {
        if (yBtn) {
            yBtn.style.background = 'linear-gradient(135deg, #d4af37, #f59e0b)';
            yBtn.style.color = '#0a0e1c';
            yBtn.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.35)';
        }
        if (mBtn) {
            mBtn.style.background = 'transparent';
            mBtn.style.color = '#cbd5e1';
            mBtn.style.boxShadow = 'none';
        }
    }

    // Re-render cards with updated period
    if (typeof renderAllPackageCards === 'function') {
        renderAllPackageCards();
    }
};

window.selectCardPackage = function(pkgName) {
    const pkg = packages.find(p => p.name === pkgName);
    if (!pkg) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('ข้อผิดพลาด', 'ไม่พบข้อมูลแพ็กเกจที่เลือก', 'error');
        }
        return;
    }

    const periodText = window.currentPackageBillingPeriod === 'monthly' ? 'รายเดือน' : 'รายปี';
    const price = window.currentPackageBillingPeriod === 'monthly' ? pkg.m : pkg.y;

    if (price === 'ฟรี') {
        if (typeof Swal !== 'undefined') {
            Swal.fire('แพ็กเกจทดลองใช้', 'คุณสามารถเข้าใช้งานระบบพื้นฐานได้ทันที', 'info');
        }
        return;
    }

    if (price === 'ติดต่อ') {
        window.open('https://line.me/ti/p/', '_blank');
        return;
    }

    if (typeof openPaymentModal === 'function') {
        openPaymentModal(pkgName, periodText, price);
    } else {
        console.error("openPaymentModal function not found");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    buildTable();
    if (typeof renderAllPackageCards === 'function') {
        renderAllPackageCards();
    }
});


