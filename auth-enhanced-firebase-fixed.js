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
        expiry: expiry,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(session));
    return session;
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
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

function showAuthError(message) {
    const errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.animation = 'none';
        setTimeout(() => { errorEl.style.animation = 'authShake 0.4s ease'; }, 10);
    }
}

function clearAuthError() {
    const errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }
}

function showAuthSuccess(message) {
    const errorEl = document.getElementById('authError');
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
            const session = saveSession(user);
            showWelcomeMessage(session.displayName);

            setTimeout(() => {
                hideLoginOverlay();
                updateUserBadge(session);
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
            <p style="color:#fff; font-size: 1.2rem;">${name}</p>
            <p style="color:#aaa; font-size: 0.9rem;">กำลังเข้าสู่ระบบ...</p>
        </div>
    `;
}

function updateUserBadge(session) {
    const badge = document.getElementById('authUserBadge');
    if (badge) {
        badge.innerHTML = `
        <div class="Usename" style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <span id="userProfileLink" style="font-weight:bold; font-size:16px; cursor: pointer; flex: 1; padding: 8px 12px; border-radius: 8px; transition: all 0.2s ease;"
                  title="คลิกเพื่อไปหน้าโปรไฟล์">
                    <i class="fas fa-user-circle"></i>
                    ${session.displayName} ${session.role === 'admin' ? '(ผู้ดูแลระบบ)' : '(ผู้ใช้งานทั่วไป)'}
            </span>
            <span id="logoutBtn" class="btn btn-link btn-sm p-0 ml-2" style="cursor: pointer;">
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
    }
}

function navigateToProfile() {
    const session = getSession();
    if (session && session.username) {
        // ใช้ฟังก์ชัน viewMemberProfile เพื่อแสดงโปรไฟล์ โดยใช้ username
        if (typeof viewMemberProfile === 'function') {
            console.log('🔐 navigateToProfile: ใช้ username =', session.username);
            viewMemberProfile(session.username);
        } else {
            alert('⚠️ ระบบยังไม่พร้อม กรุณารีเฟรชหน้า');
        }
    } else {
        alert('⚠️ ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
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
        alert('⛔ เฉพาะผู้ดูแลระบบเท่านั้น');
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
            alert('ไม่พบผู้ใช้');
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

console.log("✅ ใช้ Firebase จาก membermanager.js");