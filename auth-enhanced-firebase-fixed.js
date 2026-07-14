"use strict";

/**
 * ระบบตรวจสอบรหัสผ่าน + Firebase Firestore Integration
 * สยามโหรามงคล - Clean Version (ไม่ duplicate Firebase)
 * 
 * ⚠️ ต้องใช้กับ membermanager.js ที่ initialize Firebase แล้ว
 */

// ✨ ใช้ Firebase จาก membermanager.js ที่ initialize แล้ว
// (membermanager.js รัน import { initializeApp } ก่อนแล้ว)

// ===================================================
// Firestore Functions (ใช้ firebase ที่มีอยู่)
// ===================================================

async function saveUserToFirestore(user) {
    try {
        // ดึง Firebase modules ที่ membermanager.js ใช้อยู่
        const { getFirestore, collection, addDoc } = await import(
            "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        );
        
        const db = getFirestore();
        const usersCol = collection(db, "registered_users");
        
        const docRef = await addDoc(usersCol, {
            username: user.username,
            displayName: user.displayName,
            passwordHash: user.passwordHash,
            role: user.role || 'user',
            registeredAt: new Date(),
            registeredAtISO: new Date().toISOString()
        });
        console.log("✅ บันทึก Firestore สำเร็จ ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.warn("⚠️ Firestore save (บันทึก LocalStorage แทน):", error.message);
        return null;
    }
}

async function syncUsersFromFirestore() {
    try {
        const { getFirestore, collection, getDocs, query, orderBy } = await import(
            "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        );
        
        const db = getFirestore();
        const usersCol = collection(db, "registered_users");
        const q = query(usersCol, orderBy("registeredAt", "desc"));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        console.log("✅ ดึง Firestore สำเร็จ:", users.length, "คน");
        return users;
    } catch (err) {
        console.warn("⚠️ Firestore sync (ใช้ LocalStorage แทน):", err.message);
        return [];
    }
}

// ===================================================
// CONFIGURATION
// ===================================================

const AUTH_CONFIG = {
    sessionHours: 8,
    storageKey: 'siamhora_auth_session',
    maxAttempts: 5,
    lockMinutes: 15,
    enableRegistration: true,
    minPasswordLength: 6,
    usersStorageKey: 'siamhora_users'
};

// ⚠️ ความปลอดภัย: DEFAULT_USERS เป็น fallback credentials ที่ hardcode อยู่ในโค้ด
// ควรเปลี่ยนรหัสผ่านหรือลบ entry เหล่านี้ออก และจัดการ user ผ่าน Firestore แทน
// admin hash = SHA-256("1234567") — เปลี่ยนก่อน deploy จริง
// user  hash = SHA-256("123456")  — เปลี่ยนก่อน deploy จริง
const DEFAULT_USERS = [
    {
        username: "admin",
        passwordHash: "1035cdf4255b95ca16f9240a9cd8c13b8415d5bc3575ea8b20116296655486e8",
        displayName: "ประธานโบ้",
        role: "admin"
    },
    {
        username: "user",
        passwordHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
        displayName: "ผู้ใช้งาน",
        role: "user"
    }
];

// ===================================================
// HTML ESCAPE (ป้องกัน XSS)
// ===================================================

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

// ===================================================
// SHA-256
// ===================================================

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===================================================
// USER MANAGEMENT
// ===================================================

function getAllUsers() {
    const defaultUsers = DEFAULT_USERS;
    try {
        const registered = localStorage.getItem(AUTH_CONFIG.usersStorageKey);
        if (registered) {
            const registeredUsers = JSON.parse(registered);
            return [...defaultUsers, ...registeredUsers];
        }
    } catch (e) {
        console.error('Error loading users:', e);
    }
    return defaultUsers;
}

function getRegisteredUsers() {
    try {
        const registered = localStorage.getItem(AUTH_CONFIG.usersStorageKey);
        if (registered) {
            return JSON.parse(registered);
        }
    } catch (e) {
        console.error('Error loading registered users:', e);
    }
    return [];
}

function saveRegisteredUser(user) {
    try {
        const users = getRegisteredUsers();
        users.push(user);
        localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(users));
        
        // บันทึก Firestore (async, non-blocking)
        saveUserToFirestore(user);
        
        return true;
    } catch (e) {
        console.error('Error saving user:', e);
        return false;
    }
}

function userExists(username) {
    const allUsers = getAllUsers();
    return allUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
}

// ===================================================
// SESSION
// ===================================================

function getSession() {
    try {
        const raw = localStorage.getItem(AUTH_CONFIG.storageKey);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (!session || !session.expiry) return null;
        if (Date.now() > session.expiry) {
            localStorage.removeItem(AUTH_CONFIG.storageKey);
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

function saveSession(user) {
    const expiry = AUTH_CONFIG.sessionHours > 0
        ? Date.now() + AUTH_CONFIG.sessionHours * 3600 * 1000
        : Date.now() + 365 * 24 * 3600 * 1000;
    const session = {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        package: user.package || 'ทดลองใช้',
        packageExpiry: user.packageExpiry || null,
        expiry: expiry,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(session));
    // 🔐 สำหรับระบบการยินยอม (PDPA Consent)
    localStorage.setItem('userId', user.username);
    return session;
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    // 🔐 ลบข้อมูลการยินยอม PDPA
    localStorage.removeItem('userId');
    localStorage.removeItem('pdpaConsent');
    localStorage.removeItem('pdpaConsentDate');
}

// ===================================================
// LOGIN ATTEMPTS
// ===================================================

function getAttempts() {
    try {
        const raw = localStorage.getItem('siamhora_auth_attempts');
        if (!raw) return { count: 0, lockUntil: 0 };
        return JSON.parse(raw);
    } catch {
        return { count: 0, lockUntil: 0 };
    }
}

function saveAttempts(data) {
    localStorage.setItem('siamhora_auth_attempts', JSON.stringify(data));
}

function resetAttempts() {
    localStorage.removeItem('siamhora_auth_attempts');
}

function isLocked() {
    const attempts = getAttempts();
    if (attempts.lockUntil && Date.now() < attempts.lockUntil) {
        return Math.ceil((attempts.lockUntil - Date.now()) / 60000);
    }
    return 0;
}

// ===================================================
// VALIDATION
// ===================================================

function validateUsername(username) {
    const errors = [];
    username = username.trim();
    
    if (username.length < 3) {
        errors.push('ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
    }
    if (username.length > 20) {
        errors.push('ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('ชื่อผู้ใช้ต้องประกอบด้วยตัวอักษร ตัวเลข และ underscore เท่านั้น');
    }
    if (userExists(username)) {
        errors.push('ชื่อผู้ใช้นี้มีผู้ใช้แล้ว');
    }
    
    return errors;
}

function validatePassword(password) {
    const errors = [];
    
    if (password.length < AUTH_CONFIG.minPasswordLength) {
        errors.push(`รหัสผ่านต้องมีความยาวอย่างน้อย ${AUTH_CONFIG.minPasswordLength} ตัวอักษร`);
    }
    if (!/[a-z]/.test(password)) {
        errors.push('รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก');
    }
    
    return errors;
}

function validateDisplayName(displayName) {
    const errors = [];
    displayName = displayName.trim();
    
    if (displayName.length < 2) {
        errors.push('ชื่อแสดงผลต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    }
    if (displayName.length > 50) {
        errors.push('ชื่อแสดงผลต้องไม่เกิน 50 ตัวอักษร');
    }
    
    return errors;
}

// ===================================================
// UI FUNCTIONS
// ===================================================

function showLoginOverlay() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    }
    document.body.style.overflow = 'hidden';
}

function hideLoginOverlay() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400);
    }
    document.body.style.overflow = '';
}

function getActiveAuthErrorEl() {
    const registerForm = document.getElementById('authRegisterForm');
    if (registerForm && registerForm.style.display !== 'none') {
        return document.getElementById('authRegisterError');
    }
    return document.getElementById('authError');
}

function showAuthError(message) {
    const errorEl = getActiveAuthErrorEl();
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.color = '#ff6b6b';
        errorEl.style.animation = 'none';
        setTimeout(() => { errorEl.style.animation = 'authShake 0.4s ease'; }, 10);
    }
}

function clearAuthError() {
    ['authError', 'authRegisterError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.textContent = ''; }
    });
}

function showAuthSuccess(message) {
    const errorEl = getActiveAuthErrorEl();
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.color = '#4CAF50';
        errorEl.style.animation = 'none';
        setTimeout(() => { errorEl.style.animation = 'authShake 0.4s ease'; }, 10);
    }
}

function setLoginLoading(isLoading) {
    const btn = document.getElementById('authSubmitBtn');
    const spinner = document.getElementById('authSpinner');
    const btnText = document.getElementById('authBtnText');
    if (btn) btn.disabled = isLoading;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    if (btnText) btnText.textContent = isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ';
}

function setRegisterLoading(isLoading) {
    const btn = document.getElementById('authRegisterBtn');
    const spinner = document.getElementById('authRegisterSpinner');
    const btnText = document.getElementById('authRegisterBtnText');
    if (btn) btn.disabled = isLoading;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    if (btnText) btnText.textContent = isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก';
}

function switchToRegister() {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    clearAuthError();
}

function switchToLogin() {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    clearAuthError();
}

// ===================================================
// LOGIN & REGISTER
// ===================================================

async function doLogin() {
    clearAuthError();

    const lockMin = isLocked();
    if (lockMin > 0) {
        showAuthError(`⛔ ระบบถูกล็อค กรุณารออีก ${lockMin} นาที`);
        return;
    }

    const usernameInput = document.getElementById('authUsername');
    const passwordInput = document.getElementById('authPassword');
    const username = (usernameInput?.value || '').trim().toLowerCase();
    const password = passwordInput?.value || '';

    if (!username || !password) {
        showAuthError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }

    setLoginLoading(true);

    try {
        const hash = await sha256(password);
        const allUsers = getAllUsers();
        const user = allUsers.find(u => u.username.toLowerCase() === username && u.passwordHash === hash);

        if (user) {
            resetAttempts();
            
            // ดึง package จาก Firebase ถ้ามี
            try {
                const { collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                const q = query(collection(window.firebaseDb, "users"), where("username", "==", user.username.toLowerCase()));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const data = snap.docs[0].data();
                    if (data.package) user.package = data.package;
                    if (data.packageExpiry) user.packageExpiry = data.packageExpiry;
                }
            } catch (e) { console.error("Could not sync package", e); }
            
            const session = saveSession(user);
            showWelcomeMessage(session.displayName);

            setTimeout(() => {
                hideLoginOverlay();
                updateUserBadge(session);
                // 🔐 ตรวจสอบการยินยอม PDPA
                if (typeof checkConsentStatus === 'function') {
                    checkConsentStatus();
                }
            }, 1200);

        } else {
            const attempts = getAttempts();
            attempts.count = (attempts.count || 0) + 1;

            if (attempts.count >= AUTH_CONFIG.maxAttempts) {
                attempts.lockUntil = Date.now() + AUTH_CONFIG.lockMinutes * 60 * 1000;
                saveAttempts(attempts);
                showAuthError(`⛔ พิมพ์ผิดเกิน ${AUTH_CONFIG.maxAttempts} ครั้ง ระบบล็อค ${AUTH_CONFIG.lockMinutes} นาที`);
            } else {
                saveAttempts(attempts);
                const remaining = AUTH_CONFIG.maxAttempts - attempts.count;
                showAuthError(`❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (เหลืออีก ${remaining} ครั้ง)`);
            }

            if (passwordInput) passwordInput.value = '';
        }
    } catch (err) {
        console.error('Login error:', err);
        showAuthError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
        setLoginLoading(false);
    }
}

async function doRegister() {
    clearAuthError();

    const usernameInput = document.getElementById('authRegUsername');
    const passwordInput = document.getElementById('authRegPassword');
    const passwordConfirmInput = document.getElementById('authRegPasswordConfirm');
    const displayNameInput = document.getElementById('authRegDisplayName');

    const username = (usernameInput?.value || '').trim();
    const password = passwordInput?.value || '';
    const passwordConfirm = passwordConfirmInput?.value || '';
    const displayName = displayNameInput?.value || '';

    const usernameErrors = validateUsername(username);
    const passwordErrors = validatePassword(password);
    const displayNameErrors = validateDisplayName(displayName);

    const allErrors = [...usernameErrors, ...passwordErrors, ...displayNameErrors];

    if (password !== passwordConfirm) {
        allErrors.push('รหัสผ่านไม่ตรงกัน');
    }

    if (allErrors.length > 0) {
        showAuthError(allErrors.join('\n'));
        return;
    }

    setRegisterLoading(true);

    try {
        const passwordHash = await sha256(password);

        const newUser = {
            username: username.toLowerCase(),
            passwordHash: passwordHash,
            displayName: displayName,
            role: 'user',
            registeredAt: new Date().toISOString()
        };

        const saved = saveRegisteredUser(newUser);

        if (saved) {
            showAuthSuccess('✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอินด้วยชื่อผู้ใช้ใหม่');
            
            setTimeout(() => {
                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';
                if (passwordConfirmInput) passwordConfirmInput.value = '';
                if (displayNameInput) displayNameInput.value = '';
                
                switchToLogin();
            }, 1500);
        } else {
            showAuthError('❌ เกิดข้อผิดพลาดในการสมัครสมาชิก');
        }
    } catch (err) {
        console.error('Register error:', err);
        showAuthError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
        setRegisterLoading(false);
    }
}

function showWelcomeMessage(name) {
    const box = document.getElementById('authFormBox');
    if (!box) return;
    box.innerHTML = `
        <div style="text-align:center; padding: 20px 0;">
            <div style="font-size: 64px; margin-bottom: 16px; animation: authPop 0.5s ease;">✨</div>
            <h3 style="color:#d4af37; margin-bottom: 8px;">ยินดีต้อนรับ</h3>
            <p style="color:#fff; font-size: 1.2rem;">${escapeHtml(name)}</p>
            <p style="color:#aaa; font-size: 0.9rem;">กำลังเข้าสู่ระบบ...</p>
        </div>
    `;
}

function updateUserBadge(session) {
    const badge = document.getElementById('authUserBadge');
    if (badge) {
        badge.innerHTML = `
        <div class="Usename" style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 10px;">
            <span id="userProfileLink" style="font-weight:bold; font-size:16px; cursor: pointer; padding: 4px; border-radius: 4px;"
                  title="คลิกเพื่อไปหน้าโปรไฟล์">
                    <i class="fas fa-user-circle" style="color: #d4af37;"></i>
                    ${escapeHtml(session.displayName)} 
                    ${session.role === 'admin' ? '<span class="text-danger ml-1" style="font-size: 0.8em;"><i class="fas fa-crown"></i> ผู้ดูแลระบบ</span>' : ''}
                    <span id="packageBadge" style="margin-left:8px; padding:2px 8px; border-radius:12px; font-size:0.85em; background:rgba(212,175,55,0.2); border:1px solid #d4af37; color:#d4af37; ${session.role === 'admin' ? 'box-shadow: 0 0 10px rgba(212,175,55,0.5);' : ''}">
                        👑 ${session.role === 'admin' ? 'วิมาน (ผู้ดูแลระบบ)' : (session.package || 'ทดลองใช้')} <span id="packageCountdownText" style="font-weight:normal; font-size:0.9em;"></span>
                    </span>
            </span>
            <span id="logoutBtn" class="btn-eixt btn-link btn-sm p-0 ml-2" style="cursor: pointer; color: #ff6b6b;">
                <i class="fas fa-sign-out-alt mr-1"></i> ออกจากระบบ
            </span>
        </div>
        `;

        // เพิ่ม event listener ให้กับปุ่มโปรไฟล์
        const profileLink = document.getElementById('userProfileLink');
        if (profileLink) {
            profileLink.addEventListener('click', navigateToProfile);
            profileLink.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            });
            profileLink.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
        }

        // เพิ่ม event listener ให้กับปุ่ม logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', doLogout);
        }

        // แสดง/ซ่อนปุ่มแอดมินใน Navbar
        const adminNav = document.getElementById('adminDashboardNav');
        if (adminNav) {
            adminNav.style.display = (session && session.role === 'admin') ? '' : 'none';
        }

        // เรียกใช้ฟังก์ชันนับเวลาถอยหลัง
        if (typeof startPackageCountdown === 'function') {
            startPackageCountdown(session);
        }
    }
}

// ⏱️ ระบบนับเวลาถอยหลังและแจ้งเตือน
window.pkgCountdownInterval = null;
function startPackageCountdown(session) {
    if (window.pkgCountdownInterval) clearInterval(window.pkgCountdownInterval);
    
    const countdownEl = document.getElementById('packageCountdownText');
    if (!countdownEl) return;
    
    if (!session.packageExpiry || session.package === 'ทดลองใช้' || session.role === 'admin') {
        countdownEl.innerHTML = '';
        return;
    }
    
    const expiryTime = new Date(session.packageExpiry).getTime();
    
    function updateTimer() {
        const now = Date.now();
        const diff = expiryTime - now;
        
        if (diff <= 0) {
            countdownEl.innerHTML = '(หมดอายุแล้ว)';
            countdownEl.style.color = '#ff6b6b';
            clearInterval(window.pkgCountdownInterval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
            countdownEl.innerHTML = `(เหลือ ${days} วัน ${hours} ชม.)`;
        } else {
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            countdownEl.innerHTML = `(เหลือ ${hours} ชม. ${mins} นาที)`;
            countdownEl.style.color = '#ff6b6b';
        }
    }
    
    updateTimer(); // เรียกครั้งแรกทันที
    window.pkgCountdownInterval = setInterval(updateTimer, 60000); // อัปเดตทุก 1 นาที
    
    // 🚨 ระบบแจ้งเตือน (เช็คตอนล็อกอินว่าเหลือน้อยกว่า 3 วันหรือไม่)
    const diff = expiryTime - Date.now();
    const daysLeft = diff / (1000 * 60 * 60 * 24);
    if (daysLeft > 0 && daysLeft <= 3 && !sessionStorage.getItem('pkgWarned')) {
        sessionStorage.setItem('pkgWarned', 'true');
        setTimeout(() => {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'แจ้งเตือนสถานะสมาชิก',
                    html: `แพ็กเกจ <b>${session.package}</b> ของคุณเหลือเวลาใช้งานอีกเพียง <b>${Math.floor(daysLeft)} วัน</b><br>กรุณาต่ออายุเพื่อใช้งานฟีเจอร์พรีเมียมอย่างต่อเนื่องครับ`,
                    icon: 'warning',
                    confirmButtonText: 'อัปเกรด/ต่ออายุ',
                    showCancelButton: true,
                    cancelButtonText: 'ภายหลัง'
                }).then((result) => {
                    if (result.isConfirmed && typeof navigateTo === 'function') {
                        navigateTo('package');
                    }
                });
            }
        }, 3000); // ดีเลย์ 3 วินาทีหลังจากเข้ามา
    }
}


function navigateToProfile() {
    const session = getSession();

    // ถ้าเป็น Admin ให้ไปแดชบอร์ด
    if (session && typeof isAdmin === 'function' && isAdmin()) {
        if (typeof openAdminDashboard === 'function') {
            openAdminDashboard();
        } else {
            console.warn('⚠️ Admin Dashboard not loaded yet, redirecting to admin.html');
            window.location.href = 'admin.html';
        }
        return;
    }

    // ถ้าเป็น User ปกติ ให้ไปโปรไฟล์
    if (session && session.username) {
        if (typeof viewMemberProfile === 'function') {
            console.log('🔐 navigateToProfile: ใช้ username =', session.username);
            viewMemberProfile(session.username);
        } else {
            Swal.fire('แจ้งเตือน', 'ระบบยังไม่พร้อม กรุณารีเฟรชหน้า', 'warning');
        }
    } else {
        Swal.fire('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'warning');
    }
}

// ทำให้ function เป็น global เพื่อให้ onclick สามารถเรียกได้
window.navigateToProfile = navigateToProfile;

function doLogout() {
    if (!confirm('ต้องการออกจากระบบใช่หรือไม่?')) return;
    clearSession();
    location.reload();
}

function checkAuth() {
    const session = getSession();
    if (session) {
        hideLoginOverlay();
        updateUserBadge(session);
    } else {
        showLoginOverlay();
    }
}

// ===================================================
// EVENT LISTENERS
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    const passInput = document.getElementById('authPassword');
    const userInput = document.getElementById('authUsername');

    if (passInput) {
        passInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });
    }
    if (userInput) {
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const passEl = document.getElementById('authPassword');
                if (passEl) passEl.focus();
            }
        });
    }

    const regPassConfirmInput = document.getElementById('authRegPasswordConfirm');
    if (regPassConfirmInput) {
        regPassConfirmInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doRegister();
        });
    }

    const lockMin = isLocked();
    if (lockMin > 0) {
        showLoginOverlay();
        showAuthError(`⛔ ระบบถูกล็อค กรุณารออีก ${lockMin} นาที`);
        startLockCountdown();
    }
});

function startLockCountdown() {
    const interval = setInterval(() => {
        const lockMin = isLocked();
        if (lockMin <= 0) {
            clearInterval(interval);
            clearAuthError();
            resetAttempts();
        } else {
            showAuthError(`⛔ ระบบถูกล็อค กรุณารออีก ${lockMin} นาที`);
        }
    }, 10000);
}

// ===================================================
// ROLE-BASED FUNCTIONS
// ===================================================

function isAdmin() {
    const session = getSession();
    return session && session.role === 'admin';
}

function getCurrentUserRole() {
    const session = getSession();
    return session ? session.role : null;
}

function getCurrentUser() {
    return getSession();
}

function checkAdminAccess() {
    if (!isAdmin()) {
        Swal.fire('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
        return false;
    }
    return true;
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

function getRegisteredUsersList() {
    if (!checkAdminAccess()) return null;
    return getRegisteredUsers();
}

function deleteRegisteredUser(username) {
    if (!checkAdminAccess()) return false;
    
    try {
        let users = getRegisteredUsers();
        users = users.filter(u => u.username !== username);
        localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(users));
        return true;
    } catch (e) {
        console.error('Error deleting user:', e);
        return false;
    }
}

async function resetUserPassword(username, newPassword) {
    if (!checkAdminAccess()) return false;
    
    try {
        const users = getRegisteredUsers();
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่พบผู้ใช้', 'error');
            return false;
        }
        
        const hash = await sha256(newPassword);
        users[userIndex].passwordHash = hash;
        users[userIndex].resetAt = new Date().toISOString();
        
        localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(users));
        return true;
    } catch (e) {
        console.error('Error resetting password:', e);
        return false;
    }
}

// ===================================================
// EXPORT GLOBAL
// ===================================================

window.doLogin = doLogin;
window.doRegister = doRegister;
window.doGoogleLogin = doGoogleLogin; // Export Google Login
window.doLogout = doLogout;
window.checkAuth = checkAuth;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
window.isAdmin = isAdmin;
window.getCurrentUserRole = getCurrentUserRole;
window.getCurrentUser = getCurrentUser;
window.checkAdminAccess = checkAdminAccess;
window.getRegisteredUsersList = getRegisteredUsersList;
window.deleteRegisteredUser = deleteRegisteredUser;
window.resetUserPassword = resetUserPassword;
window.syncUsersFromFirestore = syncUsersFromFirestore;
window.saveUserToFirestore = saveUserToFirestore;

// ===================================================
// GOOGLE SIGN-IN FUNCTIONS
// ===================================================

async function doGoogleLogin() {
    if (!window.firebaseApp) {
        Swal.fire('ข้อผิดพลาด', 'ระบบจัดการฐานข้อมูลยังไม่พร้อมทำงาน (Firebase App not found)', 'error');
        return;
    }

    try {
        Swal.fire({
            title: 'กำลังเชื่อมต่อกับ Google...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // 1. นำเข้าโมดูล Firebase Auth แบบ Dynamic
        const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
        
        const auth = getAuth(window.firebaseApp);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        // 2. เรียกหน้าต่าง Popup ล็อกอิน Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // 3. กำหนดข้อมูลบัญชี
        const username = user.email.split('@')[0];
        // ตรวจสอบว่าเป็น admin หรือไม่ (สามารถเพิ่มอีเมลแอดมินที่นี่ได้)
        const role = (user.email === 'admin@siamhora.com') ? 'admin' : 'user';

        const userData = {
            username: username,
            displayName: user.displayName || username,
            email: user.email,
            role: role,
            uid: user.uid,
            provider: 'google',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // 4. บันทึกลง Firestore (ใช้ฟังก์ชันที่มีอยู่)
        // เพื่อไม่ให้ซ้ำซ้อนและสามารถใช้คู่กับข้อมูลเก่าได้ 
        const { collection, getDocs, query, where, updateDoc, doc, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const usersRef = collection(window.firebaseDb, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const snapshot = await getDocs(q);

        let dbPackage = 'ทดลองใช้';
        let dbPackageExpiry = null;

        if (snapshot.empty) {
            // สร้างผู้ใช้ใหม่
            await addDoc(usersRef, userData);
        } else {
            // อัปเดตการเข้าสู่ระบบล่าสุด
            const userDoc = snapshot.docs[0];
            const data = userDoc.data();
            if (data.package) dbPackage = data.package;
            if (data.packageExpiry) dbPackageExpiry = data.packageExpiry;
            await updateDoc(doc(window.firebaseDb, "users", userDoc.id), {
                lastLogin: new Date().toISOString()
            });
        }

        // 5. บันทึก Session และเข้าสู่ระบบ
        const sessionUser = {
            username: username,
            displayName: user.displayName || username,
            role: role,
            package: dbPackage,
            packageExpiry: dbPackageExpiry
        };
        const session = saveSession(sessionUser);

        Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ',
            text: `ยินดีต้อนรับ ${user.displayName || username}`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            hideLoginOverlay();
            updateUserBadge(getSession());
            location.reload();
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        
        let errorMsg = 'ไม่สามารถเชื่อมต่อกับ Google ได้';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMsg = 'ยกเลิกการเข้าสู่ระบบแล้ว';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMsg = 'กรุณาเปิดการใช้งาน Google Sign-in ใน Firebase Console ก่อน';
        }
        
        Swal.fire('เกิดข้อผิดพลาด', errorMsg, 'error');
    }
}

