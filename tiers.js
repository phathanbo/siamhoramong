
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

// โหลดข้อมูลสิทธิ์จาก Firebase แบบง่าย
window.packagePermissions = {};

async function loadPackagePermissions() {
    if (!window.firebaseDb) {
        setTimeout(loadPackagePermissions, 500);
        return;
    }
    try {
        const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snapshot = await getDoc(doc(window.firebaseDb, 'settings', 'packagePermissions'));
        if (snapshot.exists()) {
            window.packagePermissions = snapshot.data();
        }
        buildTableInternal();
        if (typeof buildDashboard === 'function') buildDashboard();
    } catch (e) {
        console.error("Error loading permissions", e);
    }
}

function checkPermissionDefault(pkgName, menuIndex) {
    if (pkgName === "ทดลองใช้") return menuIndex < 3;
    if (pkgName === "ธรรมดา") return menuIndex < 6;
    return true; // แพ็กเกจอื่นได้หมดตาม default เดิม
}

window.togglePermission = async function(pkgName, menuId, tdId, menuIndex, pIndex) {
    if (!isAdmin()) return;
    
    if (!window.packagePermissions[pkgName]) {
        window.packagePermissions[pkgName] = {};
    }
    
    let isAllowed = window.packagePermissions[pkgName][menuId];
    if (isAllowed === undefined) {
        isAllowed = checkPermissionDefault(pkgName, menuIndex);
    }
    
    const newState = !isAllowed;
    window.packagePermissions[pkgName][menuId] = newState;
    
    const tdElement = document.getElementById(tdId);
    if (tdElement) {
        tdElement.innerHTML = newState ? '<span class="check" style="cursor:pointer;">✔</span>' : '<span class="not-allow" style="cursor:pointer;">✘</span>';
    }
    
    if (pIndex !== undefined) {
        if (newState === false) {
            // ถ้าปิด ต้องปิดระดับที่ต่ำกว่าทั้งหมดด้วย
            for (let i = 0; i < pIndex; i++) {
                const lowerPkg = packages[i].name;
                if (!window.packagePermissions[lowerPkg]) window.packagePermissions[lowerPkg] = {};
                window.packagePermissions[lowerPkg][menuId] = false;
                const lowerTd = document.getElementById(`td_${menuId}_${i}`);
                if (lowerTd) lowerTd.innerHTML = '<span class="not-allow" style="cursor:pointer;">✘</span>';
            }
        } else {
            // ถ้าเปิด ต้องเปิดระดับที่สูงกว่าทั้งหมดด้วย
            for (let i = pIndex + 1; i < packages.length; i++) {
                const higherPkg = packages[i].name;
                if (!window.packagePermissions[higherPkg]) window.packagePermissions[higherPkg] = {};
                window.packagePermissions[higherPkg][menuId] = true;
                const higherTd = document.getElementById(`td_${menuId}_${i}`);
                if (higherTd) higherTd.innerHTML = '<span class="check" style="cursor:pointer;">✔</span>';
            }
        }
    }
    
    try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        await setDoc(doc(window.firebaseDb, 'settings', 'packagePermissions'), window.packagePermissions, { merge: true });
    } catch (e) {
        console.error("Error saving permission", e);
        alert("บันทึกสิทธิ์ล้มเหลว: " + e.message);
    }
}

function applySiteSeo() {
    document.title = siteSeo.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', siteSeo.description);
    }
}

function buildTableInternal() {
    const title = document.querySelector('#package .title');
    const head = document.getElementById('headerRow');
    const body = document.getElementById('serviceBody');
    const mRow = document.querySelector('.row-m');
    const yRow = document.querySelector('.row-y');
    const bRow = document.querySelector('.row-buy');

    if (!head || !body || !mRow || !yRow) return;

    if (title) title.textContent = siteSeo.packageTitle;

    head.innerHTML = '<th class="sticky-col">รายการพยากรณ์</th>';
    body.innerHTML = '';
    if (mRow) mRow.innerHTML = '<th class="sticky-col">รายเดือน (30 วัน)</th>';
    if (yRow) yRow.innerHTML = '<th class="sticky-col">รายปี (365 วัน)</th>';
    if (bRow) bRow.innerHTML = '<th class="sticky-col" style="background:#fff;">เลือกแพ็กเกจ</th>';

    packages.forEach(pkg => {
        const th = document.createElement('th');
        th.textContent = pkg.name;
        head.appendChild(th);

        const tdM = document.createElement('th');
        tdM.className = 'price-cell';
        if (pkg.name === "ทดลองใช้") {
            tdM.innerHTML = `<button class="btn btn-sm btn-secondary" disabled style="width:100%; border-radius: 4px;">ฟรี</button>`;
        } else {
            const priceText = typeof pkg.m === 'number' ? pkg.m.toLocaleString() : pkg.m;
            if (typeof pkg.m === 'number') {
                tdM.innerHTML = `<button class="btn btn-sm" style="background:#d4af37; color:#000; font-weight:bold; border-radius: 4px; width:100%;" onclick="openPaymentModal('${pkg.name}', 'รายเดือน', ${pkg.m})">รายเดือน ฿${priceText}</button>`;
            } else {
                tdM.innerHTML = `<button class="btn btn-sm btn-info" style="width:100%; border-radius: 4px;" onclick="window.open('https://line.me/ti/p/', '_blank')">${priceText}</button>`;
            }
        }
        mRow.appendChild(tdM);

        const tdY = document.createElement('th');
        tdY.className = "price-cell";
        if (pkg.name === "ทดลองใช้") {
            tdY.innerHTML = `<button class="btn btn-sm btn-secondary" disabled style="width:100%; border-radius: 4px;">ฟรี</button>`;
        } else {
            const priceText = typeof pkg.y === 'number' ? pkg.y.toLocaleString() : pkg.y;
            if (typeof pkg.y === 'number') {
                tdY.innerHTML = `<button class="btn btn-sm" style="background:#b8960c; color:#000; font-weight:bold; border-radius: 4px; width:100%;" onclick="openPaymentModal('${pkg.name}', 'รายปี', ${pkg.y})">รายปี ฿${priceText}</button>`;
            } else {
                tdY.innerHTML = `<button class="btn btn-sm btn-info" style="width:100%; border-radius: 4px;" onclick="window.open('https://line.me/ti/p/', '_blank')">${priceText}</button>`;
            }
        }
        yRow.appendChild(tdY);
    });

    // ใช้ APP_MENU จาก mainpage.js ยกเว้นเมนูที่จัดการระบบ
    let validMenus = [];
    if (typeof APP_MENU !== 'undefined') {
        validMenus = APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin'));
    } else {
        // Fallback ถ้ายังไม่มี
        validMenus = [{id: 'none', title: 'รอโหลดข้อมูล...'}];
    }

    // จัดกลุ่มตามความลึก (จากมากไปน้อย)
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
        const scoreA = depthScores[a.id] || 50; // default score for unlisted items
        const scoreB = depthScores[b.id] || 50;
        
        // ถ้าคะแนนเท่ากัน ให้เรียงตามชื่อ
        if (scoreA === scoreB) {
            return a.title.localeCompare(b.title, 'th');
        }
        // เรียงจากน้อยไปมาก
        return scoreA - scoreB;
    });


    validMenus.forEach((menu, index) => {
        const tr = document.createElement('tr');
        // ทำความสะอาด HTML tags จากชื่อเมนู
        let cleanTitle = menu.title.replace(/<[^>]*>?/gm, ' ');
        let rowHTML = `<td class="sticky-col" style="text-align:left;"><i class="fas ${menu.icon} mr-2"></i> ${cleanTitle}</td>`;
        
        packages.forEach((pkg, pIndex) => {
            let isAllowed = window.packagePermissions && window.packagePermissions[pkg.name] && window.packagePermissions[pkg.name][menu.id] !== undefined
                ? window.packagePermissions[pkg.name][menu.id]
                : checkPermissionDefault(pkg.name, index);
                
            let adminClick = '';
            let cursorStyle = '';
            if (typeof isAdmin === 'function' && isAdmin()) {
                adminClick = `onclick="togglePermission('${pkg.name}', '${menu.id}', 'td_${menu.id}_${pIndex}', ${index}, ${pIndex})"`;
                cursorStyle = 'cursor:pointer;';
            }
            
            let iconHtml = isAllowed ? `<span class="check" style="${cursorStyle} ">✔</span>` : `<span class="not-allow" style="${cursorStyle} ">✘</span>`;
            rowHTML += `<td class="status-cell" id="td_${menu.id}_${pIndex}" ${adminClick}>${iconHtml}</td>`;
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

document.addEventListener('DOMContentLoaded', buildTable);
