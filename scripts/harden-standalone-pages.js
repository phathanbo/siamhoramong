const fs = require('fs');

const pagesToProtect = [
  { path: 'pages/siam-horamangkol.html', menuId: 'siamHoramangkolPage', tier: 14, name: 'สยามโหรามงคล (ผังพยากรณ์ ๑๐ ขั้นตอน)', tierName: 'เพชรยอดมงกุฎ' },
  { path: 'pages/horasat.html', menuId: 'thaiHoraBookPage', tier: 13, name: 'ตำราโหราศาสตร์ไทย (สิงห์โต สุริยาอารักษ์)', tierName: 'ไตรมงกุฎ' },
  { path: 'pages/taksasattalek.html', menuId: 'taksaSattalekPage', tier: 12, name: 'คัมภีร์มหาทักษาสัตตเลข', tierName: 'มงกุฎเพชร' },
  { path: 'pages/monthly-transit.html', menuId: 'monthlyTransitPage', tier: 12, name: 'ดาวจรรายเดือน', tierName: 'มงกุฎเพชร' },
  { path: 'pages/ayanamsa.html', menuId: 'ayanamsaPage', tier: 11, name: 'ผูกดวงนิรายนะ', tierName: 'มงกุฎ' },
  { path: 'pages/thai-astrology-engine.html', menuId: 'thaiAstrologyEngine', tier: 10, name: 'ผูกดวงสมบูรณ์ (สมผุสดาวจริง)', tierName: 'เพชร' },
  { path: 'pages/chaldean-numerology.html', menuId: 'chaldeanNumerologyPage', tier: 10, name: 'คัมภีร์ปูมโหรโบราณ (เลขศาสตร์แคลเดียน)', tierName: 'เพชร' }
];

let updatedCount = 0;

for (const cfg of pagesToProtect) {
  if (!fs.existsSync(cfg.path)) continue;
  let content = fs.readFileSync(cfg.path, 'utf8');

  if (content.includes('id="tierLockOverlay"') || content.includes("id='tierLockOverlay'")) {
    console.log(cfg.path, 'already has tierLockOverlay');
    continue;
  }

  if (!content.includes('tiers.js')) {
    content = content.replace('</head>', '    <script src="../src/utils/tiers.js"></script>\n</head>');
  }

  const overlayStyle = `
    <style>
        #tierLockOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(4, 8, 19, 0.95);
            z-index: 99999;
            backdrop-filter: blur(20px);
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .page-lock-box {
            background: linear-gradient(135deg, rgba(23, 33, 58, 0.96) 0%, rgba(13, 20, 39, 0.98) 100%);
            border: 2px solid rgba(241, 208, 110, 0.5);
            border-radius: 28px;
            max-width: 550px;
            width: 100%;
            padding: 44px 34px;
            text-align: center;
            box-shadow: 0 25px 70px rgba(0,0,0,0.8), 0 0 50px rgba(241, 208, 110, 0.3);
            animation: popInLock 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popInLock {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    </style>
`;
  content = content.replace('</head>', overlayStyle + '</head>');

  const modalHtml = `
    <!-- 🔒 Modal ล็อกสิทธิ์เฉพาะสมาชิก -->
    <div id="tierLockOverlay">
        <div class="page-lock-box">
            <div style="font-size: 4rem; margin-bottom: 16px; filter: drop-shadow(0 0 25px rgba(241, 208, 110, 0.9));">🔒</div>
            <div style="background: rgba(241, 208, 110, 0.15); border: 1px solid rgba(241, 208, 110, 0.4); color: #ffd768; padding: 6px 16px; border-radius: 50px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.88rem; font-weight: 600; margin-bottom: 15px;">
                <i class="fas fa-crown"></i> เฉพาะสมาชิกระดับ ${cfg.tierName} ขึ้นไป
            </div>
            <h2 style="font-weight: 700; color: #fff8db; margin-bottom: 12px; font-size: 1.6rem;">${cfg.name}</h2>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.7; margin-bottom: 28px;">
                ระบบนี้สงวนสิทธิ์สำหรับสมาชิกตั้งแต่ระดับ <strong>「${cfg.tierName}」</strong> ขึ้นไป<br>
                <span style="color: #f87171; font-weight: 600; font-size: 0.9rem;">⚠️ ผู้ใช้ทั่วไปและผู้ใช้ระดับทดลองใช้ ต้องสมัครสมาชิกและอัปเกรดแพ็กเกจก่อนเข้าใช้งาน</span>
            </p>
            <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
                <button type="button" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 22px; border-radius: 50px; font-weight: 600; cursor: pointer;" onclick="window.location.href='../index.html#mainpage'">
                    <i class="fas fa-arrow-left"></i> กลับห้องพยากรณ์
                </button>
                <button type="button" style="background: linear-gradient(135deg, #f1d06e, #c99727); border: none; color: #070d1e; padding: 10px 24px; border-radius: 50px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(241, 208, 110, 0.4);" onclick="window.location.href='../index.html#package'">
                    <i class="fas fa-crown"></i> ดูแพ็กเกจสมาชิก
                </button>
            </div>
        </div>
    </div>
`;
  content = content.replace(/<body[^>]*>/i, match => match + '\n' + modalHtml);

  const checkScript = `
    <script>
        function checkStandaloneTierAccess() {
            let hasAccess = false;
            if (typeof window.hasPackagePermission === 'function') {
                hasAccess = window.hasPackagePermission('${cfg.menuId}');
            } else {
                try {
                    const raw = localStorage.getItem('siamhora_auth_session');
                    const isSimulating = localStorage.getItem('siamhora_simulate_package');
                    if (raw) {
                        const sess = JSON.parse(raw);
                        if (sess && sess.role === 'admin' && !isSimulating) {
                            hasAccess = true;
                        } else {
                            const pkg = isSimulating || sess.simulatePackage || sess.package || 'ทดลองใช้';
                            const pkgIdx = (typeof packages !== 'undefined') ? packages.findIndex(p => p.name === pkg) : -1;
                            hasAccess = (pkgIdx >= ${cfg.tier});
                        }
                    }
                } catch(e) {}
            }

            const overlay = document.getElementById('tierLockOverlay');
            if (!hasAccess) {
                if (overlay) overlay.style.display = 'flex';
                return false;
            } else {
                if (overlay) overlay.style.display = 'none';
                return true;
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkStandaloneTierAccess);
        } else {
            checkStandaloneTierAccess();
        }
    </script>
`;
  content = content.replace('</body>', checkScript + '</body>');

  fs.writeFileSync(cfg.path, content, 'utf8');
  console.log('Successfully hardened:', cfg.path);
  updatedCount++;
}

console.log('Total hardened:', updatedCount);
