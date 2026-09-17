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
            phone: user.phone || '',
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

// 🔐 ความปลอดภัย: ไม่มีการฮาร์ดโค้ดรหัสผ่านในไฟล์โค้ด
// บัญชีผู้ใช้และสิทธิ์ Admin ทั้งหมดถูกจัดเก็บและตรวจสอบผ่าน Firestore Database โดยตรง
const DEFAULT_USERS = [];

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
    localStorage.removeItem('userId');
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

function validatePhone(phone) {
    const errors = [];
    phone = (phone || '').trim().replace(/[-\s]/g, '');
    
    if (!phone) {
        errors.push('กรุณาระบุหมายเลขโทรศัพท์');
    } else if (!/^0[689]\d{8}$|^0[2-57]\d{7,8}$/.test(phone)) {
        errors.push('รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)');
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
    const resetForm = document.getElementById('authResetForm');
    if (resetForm && resetForm.style.display !== 'none') {
        return document.getElementById('authResetError');
    }
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
    ['authError', 'authRegisterError', 'authResetError'].forEach(id => {
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

function setResetLoading(isLoading) {
    const btn = document.getElementById('authResetBtn');
    const spinner = document.getElementById('authResetSpinner');
    const btnText = document.getElementById('authResetBtnText');
    if (btn) btn.disabled = isLoading;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    if (btnText) btnText.textContent = isLoading ? 'กำลังบันทึกรหัสผ่านใหม่...' : 'ยืนยันตั้งรหัสผ่านใหม่';
}

function switchToRegister() {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const resetForm = document.getElementById('authResetForm');
    const authNavTabs = document.getElementById('authNavTabs');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (authNavTabs) authNavTabs.style.display = 'flex';
    if (loginForm) loginForm.style.display = 'none';
    if (resetForm) resetForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';

    if (loginTab) {
        loginTab.style.color = 'rgba(203, 213, 225, 0.6)';
        loginTab.style.background = 'transparent';
        loginTab.style.borderColor = 'transparent';
    }
    if (registerTab) {
        registerTab.style.color = '#f1d06e';
        registerTab.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)';
        registerTab.style.borderColor = 'rgba(212, 175, 55, 0.4)';
    }
    clearAuthError();
}

function switchToLogin() {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const resetForm = document.getElementById('authResetForm');
    const authNavTabs = document.getElementById('authNavTabs');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (authNavTabs) authNavTabs.style.display = 'flex';
    if (registerForm) registerForm.style.display = 'none';
    if (resetForm) resetForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';

    if (loginTab) {
        loginTab.style.color = '#f1d06e';
        loginTab.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)';
        loginTab.style.borderColor = 'rgba(212, 175, 55, 0.4)';
    }
    if (registerTab) {
        registerTab.style.color = 'rgba(203, 213, 225, 0.6)';
        registerTab.style.background = 'transparent';
        registerTab.style.borderColor = 'transparent';
    }
    clearAuthError();
}

function switchToReset() {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const resetForm = document.getElementById('authResetForm');
    const authNavTabs = document.getElementById('authNavTabs');
    
    if (authNavTabs) authNavTabs.style.display = 'none';
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (resetForm) resetForm.style.display = 'block';

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
        let user = null;

        // 1. ตรวจสอบจาก Firestore Database โดยตรงเป็นอันดับแรก
        try {
            const { getFirestore, collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const db = (typeof window.firebaseDb !== 'undefined' && window.firebaseDb) ? window.firebaseDb : getFirestore();
            
            // ค้นหาจาก registered_users
            const usersCol = collection(db, "registered_users");
            const q = query(usersCol, where("username", "==", username));
            const snap = await getDocs(q);
            
            if (!snap.empty) {
                for (const docSnap of snap.docs) {
                    const data = docSnap.data();
                    if (data.passwordHash === hash) {
                        user = { id: docSnap.id, ...data };
                        break;
                    }
                }
            }
        } catch (fsErr) {
            console.warn("⚠️ Firestore login query fallback to local cache:", fsErr);
        }

        // 2. Fallback: ตรวจสอบจาก Local Cache ถ้าออฟไลน์
        if (!user) {
            const allUsers = getAllUsers();
            user = allUsers.find(u => u.username.toLowerCase() === username && u.passwordHash === hash);
        }

        if (user) {
            resetAttempts();
            
            // ดึง package จาก Firebase เพิ่มเติมถ้ามี
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
            
            // แคช user ไว้ใน LocalStorage ให้ใช้งานออฟไลน์ได้
            try {
                const localUsers = getRegisteredUsers();
                const existIdx = localUsers.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
                if (existIdx >= 0) {
                    localUsers[existIdx] = { ...localUsers[existIdx], ...user };
                } else {
                    localUsers.push(user);
                }
                localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(localUsers));
            } catch (cErr) {}

            const session = saveSession(user);
            showWelcomeMessage(session.displayName);

            setTimeout(() => {
                hideLoginOverlay();
                updateUserBadge(session);
                // 🔐 ตรวจสอบและกู้คืนการยินยอม PDPA
                const userConsent = localStorage.getItem('pdpaConsent_' + user.username.toLowerCase());
                if (userConsent && !localStorage.getItem('pdpaConsent')) {
                    localStorage.setItem('pdpaConsent', userConsent);
                }
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
    const phoneInput = document.getElementById('authRegPhone');
    const passwordInput = document.getElementById('authRegPassword');
    const passwordConfirmInput = document.getElementById('authRegPasswordConfirm');
    const displayNameInput = document.getElementById('authRegDisplayName');

    const username = (usernameInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim().replace(/[-\s]/g, '');
    const password = passwordInput?.value || '';
    const passwordConfirm = passwordConfirmInput?.value || '';
    const displayName = displayNameInput?.value || '';

    const usernameErrors = validateUsername(username);
    const phoneErrors = validatePhone(phone);
    const passwordErrors = validatePassword(password);
    const displayNameErrors = validateDisplayName(displayName);

    const allErrors = [...displayNameErrors, ...usernameErrors, ...phoneErrors, ...passwordErrors];

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
            displayName: displayName,
            phone: phone,
            passwordHash: passwordHash,
            role: 'user',
            registeredAt: new Date().toISOString()
        };

        const saved = saveRegisteredUser(newUser);

        if (saved) {
            showAuthSuccess('✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอินด้วยชื่อผู้ใช้ใหม่');
            
            setTimeout(() => {
                if (usernameInput) usernameInput.value = '';
                if (phoneInput) phoneInput.value = '';
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

async function doResetPassword() {
    clearAuthError();

    const usernameInput = document.getElementById('authResetUsername');
    const phoneInput = document.getElementById('authResetPhone');
    const passwordInput = document.getElementById('authResetPassword');
    const passwordConfirmInput = document.getElementById('authResetPasswordConfirm');

    const username = (usernameInput?.value || '').trim().toLowerCase();
    const phone = (phoneInput?.value || '').trim().replace(/[-\s]/g, '');
    const password = passwordInput?.value || '';
    const passwordConfirm = passwordConfirmInput?.value || '';

    if (!username) {
        showAuthError('กรุณากรอกชื่อผู้ใช้');
        return;
    }

    if (!phone) {
        showAuthError('กรุณากรอกเบอร์โทรศัพท์ที่ลงทะเบียนไว้');
        return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
        showAuthError(passwordErrors.join('\n'));
        return;
    }

    if (password !== passwordConfirm) {
        showAuthError('รหัสผ่านยืนยันไม่ตรงกัน');
        return;
    }

    setResetLoading(true);

    try {
        // 1. ค้นหาผู้ใช้จาก Firestore ก่อน
        let matchedUser = null;
        let firestoreDocId = null;

        try {
            const { getFirestore, collection, getDocs, query, where, doc, updateDoc } = await import(
                "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
            );
            const db = (typeof window.firebaseDb !== 'undefined' && window.firebaseDb) ? window.firebaseDb : getFirestore();
            const usersCol = collection(db, "registered_users");
            const q = query(usersCol, where("username", "==", username));
            const snap = await getDocs(q);

            if (!snap.empty) {
                for (const docSnap of snap.docs) {
                    const data = docSnap.data();
                    const userPhone = (data.phone || '').toString().trim().replace(/[-\s]/g, '');
                    if (userPhone === phone) {
                        matchedUser = { id: docSnap.id, ...data };
                        firestoreDocId = docSnap.id;
                        break;
                    }
                }
            }
        } catch (fsErr) {
            console.warn("⚠️ Firestore query fallback during reset:", fsErr);
        }

        // 2. ถ้าไม่พบใน Firestore หรือออฟไลน์ ให้ตรวจสอบจาก LocalStorage
        const localUsers = getRegisteredUsers();
        const localIndex = localUsers.findIndex(u => u.username.toLowerCase() === username);
        
        if (!matchedUser && localIndex !== -1) {
            const localUser = localUsers[localIndex];
            const localPhone = (localUser.phone || '').toString().trim().replace(/[-\s]/g, '');
            if (localPhone && localPhone === phone) {
                matchedUser = localUser;
            }
        }

        // ถ้าค้นหาไม่พบ หรือเบอร์โทรศัพท์ไม่ตรงกัน
        if (!matchedUser) {
            showAuthError('❌ ไม่พบชื่อผู้ใช้ หรือเบอร์โทรศัพท์ไม่ถูกต้องตรงกับที่ลงทะเบียนไว้');
            return;
        }

        // 3. ทำการ Hash รหัสผ่านใหม่
        const newPasswordHash = await sha256(password);

        // 4. บันทึกลง LocalStorage
        if (localIndex !== -1) {
            localUsers[localIndex].passwordHash = newPasswordHash;
            localUsers[localIndex].resetAt = new Date().toISOString();
            localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(localUsers));
        } else {
            // ถ้าอยู่ใน Firestore แต่ยังไม่เคยแคชลง Local ให้แคชลง
            matchedUser.passwordHash = newPasswordHash;
            matchedUser.resetAt = new Date().toISOString();
            localUsers.push(matchedUser);
            localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(localUsers));
        }

        // 5. บันทึกลง Firestore (ถ้าต่อเน็ตได้)
        if (firestoreDocId) {
            try {
                const { getFirestore, doc, updateDoc } = await import(
                    "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
                );
                const db = (typeof window.firebaseDb !== 'undefined' && window.firebaseDb) ? window.firebaseDb : getFirestore();
                await updateDoc(doc(db, "registered_users", firestoreDocId), {
                    passwordHash: newPasswordHash,
                    resetAt: new Date().toISOString()
                });
                console.log("✅ อัปเดตรหัสผ่านใหม่ลง Firestore สำเร็จ");
            } catch (upErr) {
                console.warn("⚠️ ไม่สามารถอัปเดตลง Firestore ได้ทันที:", upErr.message);
            }
        }

        showAuthSuccess('🎉 เปลี่ยนรหัสผ่านใหม่สำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่');

        setTimeout(() => {
            if (usernameInput) usernameInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (passwordInput) passwordInput.value = '';
            if (passwordConfirmInput) passwordConfirmInput.value = '';
            switchToLogin();
        }, 1800);

    } catch (err) {
        console.error('Reset password error:', err);
        showAuthError('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง');
    } finally {
        setResetLoading(false);
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
        const isAdminUser = session && session.role === 'admin';
        const isSimulating = Boolean(localStorage.getItem('siamhora_simulate_package') || session.simulatePackage);
        const currentSimPkg = localStorage.getItem('siamhora_simulate_package') || session.simulatePackage;

        badge.innerHTML = `
        <div class="Usename" style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                <span id="userProfileLink" style="font-weight:bold; font-size:16px; cursor: pointer; padding: 4px; border-radius: 4px; display: inline-flex; align-items: center; flex-wrap: wrap; gap: 6px;"
                      title="คลิกเพื่อไปหน้าโปรไฟล์">
                        <i class="fas fa-user-circle" style="color: #d4af37;"></i>
                        ${escapeHtml(session.displayName)} 
                        ${session.role === 'admin' ? '<span class="text-danger ml-1" style="font-size: 0.8em;"><i class="fas fa-crown"></i> ผู้ดูแลระบบ</span>' : ''}
                        <span id="packageBadge" style="margin-left:4px; padding:2px 8px; border-radius:12px; font-size:0.82em; background:rgba(212,175,55,0.2); border:1px solid #d4af37; color:#d4af37; display:inline-flex; align-items:center; gap:6px; ${session.role === 'admin' ? 'box-shadow: 0 0 10px rgba(212,175,55,0.5);' : ''}">
                            <span>👑 ${session.role === 'admin' ? (isSimulating ? `ทดสอบ: ${currentSimPkg}` : 'วิมาน (ผู้ดูแลระบบ)') : (session.package || 'ทดลองใช้')}</span>
                            <span id="packageCountdownText" style="font-weight:normal; font-size:0.9em;"></span>
                            ${isAdminUser ? `
                            <button type="button" id="adminSimulateTierBtn" class="btn btn-sm" style="background: rgba(245, 158, 11, 0.25); color: #ffe082; font-weight: 600; font-size: 0.65rem; line-height: 1; border-radius: 4px; padding: 2px 6px; border: 1px solid rgba(245, 158, 11, 0.6); cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 3px;" title="คลิกเพื่อจำลองสิทธิ์หรือเลือกระดับแพ็กเกจทดสอบระบบ" onmouseover="this.style.background='rgba(245, 158, 11, 0.45)';" onmouseout="this.style.background='rgba(245, 158, 11, 0.25)';">
                                <i class="fas fa-flask" style="font-size: 0.62rem;"></i> <span>${isSimulating ? `${currentSimPkg}` : 'ทดสอบ'}</span>
                            </button>
                            ` : ''}
                        </span>
                </span>
            </div>
            <span id="logoutBtn" class="btn-eixt btn-link btn-sm p-0 ml-2" style="cursor: pointer; color: #ff6b6b;">
                <i class="fas fa-sign-out-alt mr-1"></i> ออกจากระบบ
            </span>
        </div>
        `;

        // เพิ่ม event listener ให้กับปุ่มจำลองระดับสมาชิกของแอดมิน
        const simBtn = document.getElementById('adminSimulateTierBtn');
        if (simBtn) {
            simBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openAdminTierSimulatorModal();
            });
        }

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

    // ถ้าเป็น Admin ให้ไปหน้าระบบจัดการหลังบ้าน (Admin Console)
    if (session && (session.role === 'admin' || (typeof isAdmin === 'function' && isAdmin()))) {
        window.location.href = 'admin/admin-console.html';
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
    // 🛠️ โหมดนักพัฒนา / ทดสอบบนมือถือ: ถ้า URL มี ?dev=true ให้จำลองสิทธิ์เป็น Admin ทันที
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
        const devSession = {
            username: 'admin',
            displayName: 'ผู้ดูแลระบบ (Dev Preview)',
            role: 'admin',
            package: 'วิมาน',
            loginTime: Date.now(),
            expiry: Date.now() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(devSession));
        localStorage.setItem('userId', 'admin');
        hideLoginOverlay();
        updateUserBadge(devSession);
        return;
    }

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
    if (typeof checkLineLoginCallback === 'function') {
        checkLineLoginCallback();
    }

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

    const resetPassConfirmInput = document.getElementById('authResetPasswordConfirm');
    if (resetPassConfirmInput) {
        resetPassConfirmInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doResetPassword();
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
// ROLE-BASED ACCESS CONTROL (RBAC)
// ===================================================

const USER_ROLES = {
    ADMIN: 'admin',                 // 👑 แอดมิน / ผู้ดูแลระบบสูงสุด
    DATA_MANAGER: 'data_manager',   // 📁 ผู้ดูแลข้อมูล
    MEMBER_CHECKER: 'member_checker', // 🔍 คนเช็คสมาชิก
    USER: 'user'                    // 👤 สมาชิกทั่วไป
};

function getCurrentUserRole() {
    const session = getSession();
    return session ? (session.role || USER_ROLES.USER) : null;
}

function getCurrentUser() {
    return getSession();
}

function isAdmin() {
    const session = getSession();
    return session && session.role === USER_ROLES.ADMIN;
}

function isDataManager() {
    const session = getSession();
    return session && session.role === USER_ROLES.DATA_MANAGER;
}

function isMemberChecker() {
    const session = getSession();
    return session && session.role === USER_ROLES.MEMBER_CHECKER;
}

// 🔐 ตรวจสอบสิทธิ์การจัดการระดับสิทธิ์สมาชิก (แอดมินเท่านั้น)
function canManageRoles() {
    return isAdmin();
}

// 🔐 ตรวจสอบสิทธิ์การเข้าถึง Admin Dashboard & ระบบหลังบ้าน
function canAccessAdmin() {
    const role = getCurrentUserRole();
    return role === USER_ROLES.ADMIN || role === USER_ROLES.DATA_MANAGER;
}

// 🔐 ตรวจสอบสิทธิ์การแก้ไข/ลบข้อมูลสมาชิกทุกคน
function canEditAllMembers() {
    const role = getCurrentUserRole();
    return role === USER_ROLES.ADMIN || role === USER_ROLES.DATA_MANAGER;
}

// 🔐 ตรวจสอบสิทธิ์การดูข้อมูลสมาชิกทุกคน
function canViewAllMembers() {
    const role = getCurrentUserRole();
    return role === USER_ROLES.ADMIN || role === USER_ROLES.DATA_MANAGER || role === USER_ROLES.MEMBER_CHECKER;
}

function checkAdminAccess() {
    if (!isAdmin()) {
        Swal.fire('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น', 'error');
        return false;
    }
    return true;
}

function getRoleDisplayName(role) {
    switch (role) {
        case USER_ROLES.ADMIN:
            return '👑 แอดมิน (Admin)';
        case USER_ROLES.DATA_MANAGER:
            return '📁 ผู้ดูแลข้อมูล (Data Manager)';
        case USER_ROLES.MEMBER_CHECKER:
            return '🔍 คนเช็คสมาชิก (Member Checker)';
        case USER_ROLES.USER:
        default:
            return '👤 สมาชิกทั่วไป (Member)';
    }
}

function getRoleBadgeHTML(role) {
    switch (role) {
        case USER_ROLES.ADMIN:
            return '<span class="badge" style="background: rgba(255,215,0,0.2); color: #FFD700; border: 1px solid #FFD700; padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;"><i class="fas fa-crown mr-1"></i> แอดมิน</span>';
        case USER_ROLES.DATA_MANAGER:
            return '<span class="badge" style="background: rgba(56,178,172,0.2); color: #4FD1C5; border: 1px solid #4FD1C5; padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;"><i class="fas fa-database mr-1"></i> ผู้ดูแลข้อมูล</span>';
        case USER_ROLES.MEMBER_CHECKER:
            return '<span class="badge" style="background: rgba(72,187,120,0.2); color: #68D391; border: 1px solid #68D391; padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;"><i class="fas fa-user-check mr-1"></i> คนเช็คสมาชิก</span>';
        case USER_ROLES.USER:
        default:
            return '<span class="badge" style="background: rgba(160,174,192,0.2); color: #CBD5E0; border: 1px solid #718096; padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;"><i class="fas fa-user mr-1"></i> สมาชิก</span>';
    }
}

// 👑 ปรับระดับสิทธิ์สมาชิก (Firestore + LocalStorage)
async function updateUserRole(username, newRole) {
    if (!canManageRoles()) {
        Swal.fire('ไม่มีสิทธิ์', 'เฉพาะแอดมินเท่านั้นที่มีสิทธิ์ปรับเปลี่ยนระดับสมาชิก', 'error');
        return false;
    }

    if (!Object.values(USER_ROLES).includes(newRole)) {
        Swal.fire('ข้อผิดพลาด', 'ระดับสิทธิ์ที่ระบุไม่ถูกต้อง', 'error');
        return false;
    }

    try {
        // 1. อัปเดตใน LocalStorage: siamhora_users
        let users = getRegisteredUsers();
        let userFound = false;
        users = users.map(u => {
            if (u.username === username) {
                userFound = true;
                return { ...u, role: newRole, roleUpdatedAt: new Date().toISOString() };
            }
            return u;
        });
        localStorage.setItem(AUTH_CONFIG.usersStorageKey, JSON.stringify(users));

        // 2. อัปเดตใน LocalStorage: horo_history (ถ้ามีข้อมูลสมาชิกที่ผูกกับ username นี้)
        let history = JSON.parse(localStorage.getItem('horo_history') || '[]');
        history = history.map(m => {
            if (m.username === username || m.name === username || m.memberId === username) {
                return { ...m, role: newRole };
            }
            return m;
        });
        localStorage.setItem('horo_history', JSON.stringify(history));

        // 3. หากเป็น Session ของผู้ใช้ปัจจุบัน ให้ซิงก์ Session ทันที
        const currentSession = getSession();
        if (currentSession && currentSession.username === username) {
            currentSession.role = newRole;
            localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(currentSession));
        }

        // 4. อัปเดต Firestore (ถ้ามีเชื่อมต่อ Firebase)
        try {
            const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = await import(
                "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
            );
            const db = getFirestore();
            
            // อัปเดตใน registered_users
            const usersCol = collection(db, "registered_users");
            const qUsers = query(usersCol, where("username", "==", username));
            const userSnap = await getDocs(qUsers);
            userSnap.forEach(async (docSnap) => {
                await updateDoc(doc(db, "registered_users", docSnap.id), {
                    role: newRole,
                    roleUpdatedAt: new Date()
                });
            });

            // อัปเดตใน members
            const membersCol = collection(db, "members");
            const qMembers = query(membersCol, where("username", "==", username));
            const memberSnap = await getDocs(qMembers);
            memberSnap.forEach(async (docSnap) => {
                await updateDoc(doc(db, "members", docSnap.id), {
                    role: newRole
                });
            });
        } catch (cloudErr) {
            console.warn("⚠️ บันทึกสิทธิ์ลง Firestore ล้มเหลว (บันทึกในเครื่องเรียบร้อย):", cloudErr.message);
        }

        // แจ้งเตือนสำเร็จ
        Swal.fire({
            icon: 'success',
            title: 'ปรับระดับสิทธิ์สำเร็จ',
            html: `ปรับผู้ใช้งาน <b>${username}</b> เป็น <b>${getRoleDisplayName(newRole)}</b> เรียบร้อยแล้ว`,
            confirmButtonColor: '#d4af37'
        });

        // รีเฟรชตารางสมาชิกและตัวเลือก Dropdown
        if (typeof updateAllMemberSelectors === 'function') updateAllMemberSelectors();
        if (typeof loadHistory === 'function') loadHistory();

        return true;
    } catch (e) {
        console.error('Error updating user role:', e);
        Swal.fire('ข้อผิดพลาด', 'ไม่สามารถปรับระดับสิทธิ์ได้: ' + e.message, 'error');
        return false;
    }
}

// 🧪 Modal จำลองและสลับระดับสมาชิก (Package Tier Simulator) สำหรับ Admin ทดสอบระบบ
function openAdminTierSimulatorModal() {
    const session = getSession();
    if (!session || (session.role !== 'admin' && (typeof isAdmin !== 'function' || !isAdmin()))) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('ไม่มีสิทธิ์', 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถใช้เครื่องมือจำลองระดับสมาชิกเพื่อทดสอบระบบได้', 'warning');
        }
        return;
    }

    const currentSimulated = localStorage.getItem('siamhora_simulate_package') || session.simulatePackage || '';
    const currentActivePkg = currentSimulated || session.package || 'วิมาน';

    const allPackages = [
        { name: "ทดลองใช้", desc: "ระดับฟรี (มีฟังก์ชันล็อกหลายส่วน)", icon: "👤" },
        { name: "ธรรมดา", desc: "ระดับเริ่มต้น 60 บ./เดือน", icon: "⭐" },
        { name: "ทองแดง", desc: "ระดับ 90 บ./เดือน", icon: "🥉" },
        { name: "เงิน", desc: "ระดับ 150 บ./เดือน", icon: "🥈" },
        { name: "ทองคำ", desc: "ระดับ 300 บ./เดือน (ปลดล็อกกราฟชีวิต, วิเคราะห์ชื่อ)", icon: "🥇" },
        { name: "ทองคำขาว", desc: "ระดับ 600 บ./เดือน (ปลดล็อกมหาทักษา)", icon: "✨" },
        { name: "ไข่มุก", desc: "ระดับ 900 บ./เดือน", icon: "🦪" },
        { name: "ทับทิม", desc: "ระดับ 1,200 บ./เดือน", icon: "💎" },
        { name: "ไพฑูรย์", desc: "ระดับ 1,500 บ./เดือน", icon: "🔮" },
        { name: "มรกต", desc: "ระดับ 3,000 บ./เดือน", icon: "❇️" },
        { name: "เพชร", desc: "ระดับ 6,000 บ./เดือน", icon: "🔷" },
        { name: "มงกุฎ", desc: "ระดับ 9,000 บ./เดือน", icon: "👑" },
        { name: "มงกุฎเพชร", desc: "ระดับ 18,000 บ./เดือน", icon: "👑💎" },
        { name: "ไตรมงกุฎ", desc: "ระดับ 27,000 บ./เดือน", icon: "👑👑👑" },
        { name: "เพชรยอดมงกุฎ", desc: "ระดับ 36,000 บ./เดือน", icon: "🏆" },
        { name: "วิมาน", desc: "ระดับสูงสุด (ผู้ดูแลระบบ)", icon: "🏰" }
    ];

    let optionsHtml = '';
    allPackages.forEach(p => {
        const isSelected = p.name === currentActivePkg ? 'selected' : '';
        optionsHtml += `<option value="${p.name}" ${isSelected}>${p.icon} ${p.name} - ${p.desc}</option>`;
    });

    const isSimulationActive = Boolean(currentSimulated);

    const htmlContent = `
        <div class="text-left p-2" style="font-family: 'Prompt', sans-serif;">
            <div class="mb-3 text-center p-3 rounded" style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px;">
                <div style="font-size: 1.1rem; font-weight: 700; color: #ffd700;">
                    🧪 แผงทดสอบระดับสมาชิก (Admin Sandbox)
                </div>
                <div class="small mt-1 text-light">
                    ผู้ดูแลระบบ: <b>${escapeHtml(session.displayName || session.username)}</b>
                </div>
                <div class="mt-2" style="font-size: 0.88rem;">
                    สถานะการจำลองปัจจุบัน: 
                    ${isSimulationActive 
                        ? `<span class="badge badge-warning" style="background:#ff9800; color:#fff; font-size:0.85rem; padding: 4px 10px; border-radius: 12px;"><i class="fas fa-flask mr-1"></i>จำลองระดับ ${currentSimulated} (เสมือนผู้ใช้จริง)</span>` 
                        : `<span class="badge badge-success" style="background:#28a745; color:#fff; font-size:0.85rem; padding: 4px 10px; border-radius: 12px;"><i class="fas fa-crown mr-1"></i>สิทธิ์แอดมินเต็ม (วิมาน)</span>`}
                </div>
            </div>

            <div class="form-group mb-3">
                <label class="text-warning small font-weight-bold mb-1">
                    <i class="fas fa-crown mr-1"></i> เลือกระดับแพ็กเกจที่ต้องการทดสอบ:
                </label>
                <select id="swalSimulatePackageSelect" class="form-control bg-dark text-warning border-warning w-100" style="height: 48px; font-size: 0.95rem; border-radius: 10px;">
                    ${optionsHtml}
                </select>
            </div>

            <div class="form-group mb-3 p-3 rounded" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1);">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="swalSimulateEnforceLock" ${isSimulationActive ? 'checked' : ''}>
                    <label class="custom-control-label text-light" for="swalSimulateEnforceLock" style="cursor: pointer; font-size: 0.88rem;">
                        <b>เปิดโหมดจำลองสิทธิ์เสมือนจริง</b> (บังคับบล็อก/ล็อกฟีเจอร์ตามเงื่อนไขแพ็กเกจนั้นจริง ๆ เพื่อทดสอบปุ่มล็อกและการแจ้งเตือน)
                    </label>
                </div>
            </div>

            <div class="small text-muted" style="line-height: 1.5;">
                <i class="fas fa-info-circle text-info mr-1"></i> ท่านสามารถกดสลับเปลี่ยนระดับหรือรีเซ็ตกลับเป็นสิทธิ์แอดมินเต็มได้ตลอดเวลา โดยไม่กระทบฐานข้อมูลจริง
            </div>
        </div>
    `;

    Swal.fire({
        title: '👑 เลือกระดับสมาชิกสำหรับทดสอบ',
        html: htmlContent,
        showCancelButton: true,
        showDenyButton: isSimulationActive,
        confirmButtonText: '<i class="fas fa-check mr-1"></i> ใช้งานระดับนี้',
        denyButtonText: '<i class="fas fa-undo mr-1"></i> รีเซ็ตกลับเป็นแอดมินเต็ม',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d4af37',
        denyButtonColor: '#4a5568',
        cancelButtonColor: '#2d3748',
        background: '#0f172a',
        color: '#f8fafc',
        customClass: { popup: 'border-gold shadow-lg' },
        preConfirm: () => {
            const selectEl = document.getElementById('swalSimulatePackageSelect');
            const enforceCheck = document.getElementById('swalSimulateEnforceLock');
            return {
                package: selectEl ? selectEl.value : 'วิมาน',
                enforce: enforceCheck ? enforceCheck.checked : false
            };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            applySimulatedPackage(result.value.package, result.value.enforce);
        } else if (result.isDenied) {
            resetSimulatedPackage();
        }
    });
}

function applySimulatedPackage(targetPackage, enforceLock) {
    const session = getSession();
    if (!session) return;

    if (enforceLock) {
        localStorage.setItem('siamhora_simulate_package', targetPackage);
        session.simulatePackage = targetPackage;
    } else {
        localStorage.removeItem('siamhora_simulate_package');
        delete session.simulatePackage;
    }

    session.package = targetPackage;
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(session));

    // อัปเดต UI ทันที
    updateUserBadge(session);
    if (typeof window.updateProfileSidebarTierAccess === 'function') {
        window.updateProfileSidebarTierAccess();
    }

    Swal.fire({
        icon: 'success',
        title: 'สลับระดับสมาชิกสำเร็จ',
        html: `กำลังจำลองระบบในระดับ <b>「${targetPackage}」</b> ${enforceLock ? '<br><span class="text-warning" style="font-size:0.85em;">(เปิดโหมดจำลองสิทธิ์เสมือนจริง: ระบบจะล็อกฟีเจอร์ตามสิทธิ์แพ็กเกจนี้)</span>' : ''}`,
        confirmButtonColor: '#d4af37',
        timer: 2000,
        timerProgressBar: true
    });
}

function resetSimulatedPackage() {
    localStorage.removeItem('siamhora_simulate_package');
    const session = getSession();
    if (session) {
        delete session.simulatePackage;
        session.package = 'วิมาน';
        session.role = 'admin';
        localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(session));
        updateUserBadge(session);
    }
    if (typeof window.updateProfileSidebarTierAccess === 'function') {
        window.updateProfileSidebarTierAccess();
    }

    Swal.fire({
        icon: 'info',
        title: 'รีเซ็ตเรียบร้อย',
        text: 'คืนค่าสิทธิ์ผู้ดูแลระบบสูงสุด (วิมาน) เรียบร้อยแล้วครับ',
        confirmButtonColor: '#d4af37',
        timer: 1800,
        timerProgressBar: true
    });
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

window.USER_ROLES = USER_ROLES;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.doGoogleLogin = doGoogleLogin; // Export Google Login
window.doLogout = doLogout;
window.checkAuth = checkAuth;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
window.isAdmin = isAdmin;
window.isDataManager = isDataManager;
window.isMemberChecker = isMemberChecker;
window.canManageRoles = canManageRoles;
window.canAccessAdmin = canAccessAdmin;
window.canEditAllMembers = canEditAllMembers;
window.canViewAllMembers = canViewAllMembers;
window.getRoleDisplayName = getRoleDisplayName;
window.getRoleBadgeHTML = getRoleBadgeHTML;
window.updateUserRole = updateUserRole;
window.getCurrentUserRole = getCurrentUserRole;
window.getCurrentUser = getCurrentUser;
window.checkAdminAccess = checkAdminAccess;
window.getRegisteredUsersList = getRegisteredUsersList;
window.deleteRegisteredUser = deleteRegisteredUser;
window.resetUserPassword = resetUserPassword;
window.doResetPassword = doResetPassword;
window.switchToReset = switchToReset;
window.validatePhone = validatePhone;
window.syncUsersFromFirestore = syncUsersFromFirestore;
window.saveUserToFirestore = saveUserToFirestore;
window.openAdminTierSimulatorModal = openAdminTierSimulatorModal;
window.applySimulatedPackage = applySimulatedPackage;
window.resetSimulatedPackage = resetSimulatedPackage;

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

// ===================================================
// LINE SIGN-IN FUNCTIONS
// ===================================================

function doLineLogin() {
    const channelId = (typeof CONFIG !== 'undefined' && CONFIG?.LINE?.CHANNEL_ID) ? CONFIG.LINE.CHANNEL_ID : "2011471468";
    const redirectUri = window.location.origin + window.location.pathname;
    const state = 'line_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('line_oauth_state', state);

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=openid%20profile`;
    window.location.href = lineAuthUrl;
}

async function checkLineLoginCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('code') || !urlParams.has('state')) return;

    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const savedState = sessionStorage.getItem('line_oauth_state');

    // ลบ query parameters ออกจาก URL เพื่อความสะอาดสวยงาม
    window.history.replaceState({}, document.title, window.location.pathname);

    if (savedState && state !== savedState) {
        console.warn("LINE state mismatch");
        return;
    }
    sessionStorage.removeItem('line_oauth_state');

    Swal.fire({
        title: 'กำลังเชื่อมต่อกับ LINE...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    const appsScriptUrl = (typeof CONFIG !== 'undefined' && CONFIG?.GOOGLE_APPS_SCRIPT?.DEPLOYMENT_URL)
        ? CONFIG.GOOGLE_APPS_SCRIPT.DEPLOYMENT_URL
        : "";

    let lineUserId = 'line_user_' + Math.random().toString(36).substring(2, 8);
    let displayName = 'สมาชิก LINE';

    try {
        if (appsScriptUrl && !appsScriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
            const redirectUri = window.location.origin + window.location.pathname;
            const res = await fetch(appsScriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verifyLineLogin', code: code, redirectUri: redirectUri })
            });
            const data = await res.json();
            if (data.success) {
                lineUserId = data.userId || lineUserId;
                displayName = data.displayName || displayName;
            }
        }
    } catch (apiErr) {
        console.warn("LINE Apps Script token verification fallback:", apiErr);
    }

    // ซิงก์ข้อมูลผู้ใช้และระดับสมาชิก (Tier)
    let userPackage = 'ทดลองใช้';
    let packageExpiry = null;
    let userRole = 'user';
    const cleanUsername = ('line_' + lineUserId.replace(/[^a-zA-Z0-9_]/g, '')).toLowerCase().substring(0, 20);

    // ตรวจสอบจาก Firestore ถ้ามี
    try {
        if (window.firebaseDb) {
            const { collection, getDocs, query, where, updateDoc, doc, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const usersRef = collection(window.firebaseDb, "users");
            const q = query(usersRef, where("lineUserId", "==", lineUserId));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                await addDoc(usersRef, {
                    username: cleanUsername,
                    displayName: displayName,
                    lineUserId: lineUserId,
                    role: userRole,
                    package: userPackage,
                    provider: 'line',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
            } else {
                const userDoc = snapshot.docs[0];
                const data = userDoc.data();
                if (data.package) userPackage = data.package;
                if (data.packageExpiry) packageExpiry = data.packageExpiry;
                if (data.role) userRole = data.role;
                await updateDoc(doc(window.firebaseDb, "users", userDoc.id), {
                    lastLogin: new Date().toISOString()
                });
            }
        }
    } catch (dbErr) {
        console.warn("Firestore sync fallback for LINE user:", dbErr);
    }

    // ตรวจสอบแพ็กเกจในเครื่องจาก horo_history ถ้ามี
    try {
        const history = JSON.parse(localStorage.getItem('horo_history') || '[]');
        const matched = history.find(m => m.username === cleanUsername || (m.lineUserId && m.lineUserId === lineUserId));
        if (matched && matched.package) {
            userPackage = matched.package;
            if (matched.packageExpiry) packageExpiry = matched.packageExpiry;
        }
    } catch (e) {}

    const sessionUser = {
        username: cleanUsername,
        displayName: displayName,
        role: userRole,
        package: userPackage,
        packageExpiry: packageExpiry,
        provider: 'line'
    };

    const session = saveSession(sessionUser);

    Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบด้วย LINE สำเร็จ',
        text: `ยินดีต้อนรับ ${displayName} (ระดับ: ${userPackage})`,
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        hideLoginOverlay();
        updateUserBadge(session);
        if (typeof checkConsentStatus === 'function') {
            checkConsentStatus();
        }
        location.reload();
    });
}

window.doLineLogin = doLineLogin;
window.checkLineLoginCallback = checkLineLoginCallback;

