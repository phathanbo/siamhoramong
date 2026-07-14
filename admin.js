"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // ใช้ window.firebaseDb จาก firebase-config.js
    const db = window.firebaseDb;
    if (!db) {
        console.error("Firebase is not initialized");
        document.getElementById('vocabTableBody').innerHTML = '<tr><td colspan="5" class="text-center text-danger">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</td></tr>';
        return;
    }

    const vocabForm = document.getElementById('addVocabForm');
    const vocabTableBody = document.getElementById('vocabTableBody');
    const statusText = document.getElementById('vocabStatus');

    // โหลดข้อมูลคำศัพท์ทั้งหมด
    function loadVocabularies() {
        db.collection('vocabularies').orderBy('type').onSnapshot((snapshot) => {
            vocabTableBody.innerHTML = '';
            if (snapshot.empty) {
                vocabTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-white-50">ยังไม่มีข้อมูลคำศัพท์ในระบบ</td></tr>';
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${getTypeName(data.type)}</td>
                    <td class="text-gold font-weight-bold">${data.word}</td>
                    <td>${data.meaning}</td>
                    <td><span class="badge badge-info">${data.tags.join(', ')}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteVocab('${doc.id}')">
                            <i class="fas fa-trash"></i> ลบ
                        </button>
                    </td>
                `;
                vocabTableBody.appendChild(tr);
            });
        }, (error) => {
            console.error("Error loading vocabularies: ", error);
            vocabTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">เกิดข้อผิดพลาด: ${error.message}</td></tr>`;
        });
    }

    function getTypeName(type) {
        switch(type) {
            case 'prefixes': return 'คำขึ้นต้น (Prefix)';
            case 'middles': return 'คำกลาง (Middle)';
            case 'suffixes': return 'คำลงท้าย (Suffix)';
            default: return type;
        }
    }

    // เพิ่มคำศัพท์
    vocabForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = document.getElementById('vocabType').value;
        const word = document.getElementById('vocabWord').value.trim();
        const meaning = document.getElementById('vocabMeaning').value.trim();
        const tag = document.getElementById('vocabTag').value.trim();

        if (!word || !meaning || !tag) return;

        statusText.innerText = "กำลังบันทึก...";

        db.collection('vocabularies').add({
            type: type,
            word: word,
            meaning: meaning,
            tags: tag.split(',').map(t => t.trim()).filter(t => t),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            statusText.className = "ml-3 text-success";
            statusText.innerText = "✅ บันทึกสำเร็จ!";
            vocabForm.reset();
            setTimeout(() => statusText.innerText = "", 3000);
        }).catch((error) => {
            console.error("Error adding document: ", error);
            statusText.className = "ml-3 text-danger";
            statusText.innerText = "❌ เกิดข้อผิดพลาด";
        });
    });

    // ฟังก์ชันลบคำศัพท์ (ถูกเรียกผ่าน onclick ใน HTML)
    window.deleteVocab = function(id) {
        if(confirm('คุณต้องการลบคำศัพท์นี้ใช่หรือไม่?')) {
            db.collection('vocabularies').doc(id).delete()
                .then(() => console.log("Deleted ", id))
                .catch(err => console.error("Error deleting ", err));
        }
    };

    // ----------------------------------------------------
    // ส่วนของการตรวจสอบการชำระเงิน (Payments)
    // ----------------------------------------------------
    const paymentsTableBody = document.getElementById('paymentsTableBody');

    function loadPendingPayments() {
        if (!paymentsTableBody) return;

        // ดึงเฉพาะรายการที่ pending (รอการอนุมัติ) เรียงตามเวลาล่าสุด
        db.collection('payments').where('status', '==', 'pending').onSnapshot((snapshot) => {
            paymentsTableBody.innerHTML = '';
            
            if (snapshot.empty) {
                paymentsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-success">ไม่มีสลิปโอนเงินที่รอการตรวจสอบ 🎉</td></tr>';
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const tr = document.createElement('tr');
                
                // รูปแบบเวลา
                let timeStr = "ไม่ระบุ";
                if (data.timestamp) {
                    const d = new Date(data.timestamp);
                    timeStr = `${d.toLocaleDateString('th-TH')} ${d.toLocaleTimeString('th-TH')}`;
                }

                tr.innerHTML = `
                    <td>${timeStr}</td>
                    <td class="text-gold">${data.username || '-'}</td>
                    <td><span class="badge badge-info">${data.package || '-'}</span></td>
                    <td class="text-success font-weight-bold">฿${data.price || '0'}</td>
                    <td><span class="badge badge-warning text-dark">รอตรวจสอบ</span></td>
                    <td>
                        <button class="btn btn-sm btn-success mr-2" onclick="approvePayment('${doc.id}', '${data.username}', '${data.package}')">
                            <i class="fas fa-check"></i> อนุมัติ
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rejectPayment('${doc.id}')">
                            <i class="fas fa-times"></i> ปฏิเสธ
                        </button>
                    </td>
                `;
                paymentsTableBody.appendChild(tr);
            });
        }, (error) => {
            console.error("Error loading payments: ", error);
            paymentsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>`;
        });
    }

    // ฟังก์ชันอนุมัติการชำระเงิน
    window.approvePayment = async function(paymentId, username, pkgName) {
        try {
            const confirm = await Swal.fire({
                title: 'ยืนยันการอนุมัติ?',
                text: `อัปเกรดให้ ${username} เป็นแพ็กเกจ ${pkgName} หรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                confirmButtonText: 'ใช่, อนุมัติเลย!',
                cancelButtonText: 'ยกเลิก'
            });

            if (!confirm.isConfirmed) return;

            Swal.fire({ title: 'กำลังประมวลผล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            // 1. อัปเดตสถานะบิลเป็น approved
            await db.collection('payments').doc(paymentId).update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 2. ไปอัปเดต Role ผู้ใช้งานใน registered_users (สมมติแพ็กเกจใช้ชื่อเดียวกับ role)
            const usersRef = db.collection('registered_users');
            const q = firebase.firestore().collection('registered_users').where("username", "==", username);
            const snapshot = await q.get();

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                await usersRef.doc(userDoc.id).update({
                    role: pkgName
                });
            } else {
                console.warn("User not found in registered_users, might be in 'users' collection (Google Auth).");
                const gUsersRef = db.collection('users');
                const gq = gUsersRef.where("email", "==", username); // username usually stores email for Google Auth fallback
                const gSnapshot = await gq.get();
                if (!gSnapshot.empty) {
                    await gUsersRef.doc(gSnapshot.docs[0].id).update({
                        role: pkgName
                    });
                }
            }

            Swal.fire('อนุมัติสำเร็จ!', 'อัปเกรดสถานะผู้ใช้เรียบร้อยแล้ว (ผู้ใช้ต้องล็อกอินใหม่เพื่อรับสถานะ)', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
        }
    };

    // ฟังก์ชันปฏิเสธการชำระเงิน
    window.rejectPayment = async function(paymentId) {
        try {
            const confirm = await Swal.fire({
                title: 'ปฏิเสธรายการนี้?',
                text: 'คุณต้องการปฏิเสธบิลนี้ใช่หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'ใช่, ปฏิเสธ',
                cancelButtonText: 'ยกเลิก'
            });

            if (!confirm.isConfirmed) return;

            await db.collection('payments').doc(paymentId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            Swal.fire('ปฏิเสธสำเร็จ', 'เปลี่ยนสถานะบิลเป็นปฏิเสธแล้ว', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
        }
    };

    // โหลดครั้งแรก
    loadVocabularies();
    loadPendingPayments();
});
