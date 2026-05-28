// ตรวจสอบว่ามีการเชื่อมต่อ Firebase และ db มาจากไฟล์หลักแล้ว
const memberApp = {
    // 1. สมัครสมาชิก
    register: async function() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const pkg = document.getElementById('reg-package').value;

        if(!name || !email || !pass) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

        try {
            // บันทึกลงคอลเลกชัน 'users_profile' (หรือชื่อที่คุณต้องการ)
            await addDoc(collection(db, "users_profile"), {
                name: name,
                email: email,
                password: pass, // หมายเหตุ: ในระบบจริงควรใช้ Firebase Auth เพื่อความปลอดภัย
                package: pkg,
                createdAt: new Date().toISOString()
            });
            alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
            this.toggleForm(false);
        } catch (e) {
            console.error("Error: ", e);
            alert("เกิดข้อผิดพลาดในการสมัคร");
        }
    },

    // 2. เข้าสู่ระบบ
    login: async function() {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;

        const q = query(
            collection(db, "users_profile"), 
            where("email", "==", email), 
            where("password", "==", pass), 
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            localStorage.setItem('siamHoraUser', JSON.stringify(userData));
            this.updateUI(userData);
        } else {
            alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
    },

    // 3. จัดการหน้าจอ (UI)
    updateUI: function(user) {
        if (user) {
            document.getElementById('logged-out-view').classList.add('d-none');
            document.getElementById('logged-in-view').classList.remove('d-none');
            document.getElementById('display-user-name').innerText = user.name;
            document.getElementById('display-package').innerText = `ระดับ: ${user.package}`;
            
            // นำชื่อไปใส่ในตัวแปรหลักของระบบคุณ (ถ้ามี)
            if(typeof currentUser !== 'undefined') currentUser = user.name;
        } else {
            document.getElementById('logged-out-view').classList.remove('d-none');
            document.getElementById('logged-in-view').classList.add('d-none');
        }
    },

    toggleForm: function(isRegister) {
        document.getElementById('login-form').classList.toggle('d-none', isRegister);
        document.getElementById('register-form').classList.toggle('d-none', !isRegister);
    },

    logout: function() {
        localStorage.removeItem('siamHoraUser');
        location.reload();
    }
};

// ตรวจสอบสถานะเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('siamHoraUser');
    if (savedUser) {
        memberApp.updateUI(JSON.parse(savedUser));
    }
});

