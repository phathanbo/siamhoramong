/**
 * adminCartomancyDb.js
 * โลจิกสำหรับหน้า adminCartomancyDb.html
 * เชื่อมต่อ Firebase Firestore Collection: cartomancy_db_32
 */

"use strict";

let db = null;
let localCardsCache = [];
let activeSuitFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    // โหลดฐานข้อมูลเมื่อเอกสารพร้อม
    db = window.firebaseDb;
    if (typeof firebase !== "undefined" && db) {
        loadCartomancyDb();
    } else {
        console.error("Firebase SDK not found or database not initialized!");
    }
});

// 1. โหลดข้อมูลจาก Firestore หรือแจ้งเตือนให้นำเข้าข้อมูลเริ่มต้น
function loadCartomancyDb() {
    const tbody = document.getElementById("cartomancyTableBody");
    if (!tbody) return;

    db.collection("cartomancy_db_32").orderBy("suit").onSnapshot((snapshot) => {
        localCardsCache = [];
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-white-50">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i><br>
                        ไม่พบข้อมูลในฐานข้อมูลออนไลน์<br>
                        <button class="btn btn-gold mt-3" onclick="initializeCartomancyDb()">
                            <i class="fas fa-cloud-upload-alt mr-2"></i> นำเข้าข้อมูลไพ่ 32 ใบเริ่มต้น
                        </button>
                    </td>
                </tr>
            `;
            document.getElementById("btnInitDb").style.display = "inline-block";
            return;
        }

        document.getElementById("btnInitDb").style.display = "none";

        snapshot.forEach((doc) => {
            const cardData = doc.data();
            cardData.id = doc.id;
            localCardsCache.push(cardData);
        });

        renderCardsTable();
    }, (error) => {
        console.error("Firestore loading error:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-danger">เกิดข้อผิดพลาด: ${error.message}</td></tr>`;
    });
}

// 2. แสดงผลตารางไพ่พร้อมการค้นหาและตัวกรอง
function renderCardsTable() {
    const tbody = document.getElementById("cartomancyTableBody");
    if (!tbody) return;

    const searchTerm = document.getElementById("searchCardInput").value.trim().toLowerCase();
    
    // กรองไพ่ตามค้นหาและ Suit
    const filtered = localCardsCache.filter(card => {
        const matchesSuit = (activeSuitFilter === "all" || card.suit === activeSuitFilter);
        const matchesSearch = !searchTerm || 
            card.name.toLowerCase().includes(searchTerm) || 
            card.meaning.toLowerCase().includes(searchTerm) ||
            card.work.toLowerCase().includes(searchTerm) ||
            card.finance.toLowerCase().includes(searchTerm) ||
            card.love.toLowerCase().includes(searchTerm);
        return matchesSuit && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-white-50">ไม่พบข้อมูลตรงตามเงื่อนไขค้นหา</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(card => {
        let badgeClass = "suit-clubs";
        let suitText = "♣️ ดอกจิก";
        if (card.suit === "Spades") { badgeClass = "suit-spades"; suitText = "♠️ โพดำ"; }
        else if (card.suit === "Hearts") { badgeClass = "suit-hearts"; suitText = "♥️ โพแดง"; }
        else if (card.suit === "Diamonds") { badgeClass = "suit-diamonds"; suitText = "♦️ ข้าวหลามตัด"; }

        return `
            <tr>
                <td class="font-weight-bold align-middle text-gold">${card.name} (${card.symbol})</td>
                <td class="align-middle"><span class="suit-badge ${badgeClass}">${suitText}</span></td>
                <td class="align-middle small text-white-50">${card.meaning.substring(0, 70)}${card.meaning.length > 70 ? '...' : ''}</td>
                <td class="align-middle small text-white-50">${card.work.substring(0, 50)}${card.work.length > 50 ? '...' : ''}</td>
                <td class="align-middle small text-white-50">${card.finance.substring(0, 50)}${card.finance.length > 50 ? '...' : ''}</td>
                <td class="align-middle small text-white-50">${card.love.substring(0, 50)}${card.love.length > 50 ? '...' : ''}</td>
                <td class="text-center align-middle">
                    <button class="btn btn-sm btn-outline-warning" onclick="editCartomancyCard('${card.id}')">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// 3. กรองตามประเภทหน้าไพ่
function setSuitFilter(suit, btnElement) {
    activeSuitFilter = suit;
    
    // สลับ Active Button
    const buttons = btnElement.parentElement.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
    
    renderCardsTable();
}

// 4. ค้นหา
function filterCards() {
    renderCardsTable();
}

// 5. นำเข้าข้อมูล 32 ใบดั้งเดิมจากโค้ดขึ้น Firestore
async function initializeCartomancyDb() {
    if (typeof CARTOMANCY_DATA === "undefined") {
        Swal.fire("ข้อผิดพลาด", "ไม่พบโครงสร้างข้อมูล CARTOMANCY_DATA", "error");
        return;
    }

    Swal.fire({
        title: "กำลังนำเข้าข้อมูลไพ่ 32 ใบ...",
        text: "ระบบกำลังกรองและสร้างความหมายไพ่ตั้งต้นกรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const batch = db.batch();
        let addedCount = 0;

        for (const [key, card] of Object.entries(CARTOMANCY_DATA)) {
            // กรองเอาเฉพาะ 32 ใบ (คัด 2-6 ออก)
            const rank = key.split("_")[1];
            if (["2", "3", "4", "5", "6"].includes(rank)) {
                continue; // ข้ามไพ่เลข 2-6
            }

            const docRef = db.collection("cartomancy_db_32").doc(key);
            batch.set(docRef, {
                name: card.name,
                suit: card.suit,
                symbol: card.symbol,
                color: card.color,
                meaning: card.meaning,
                work: card.work,
                finance: card.finance,
                love: card.love
            });
            addedCount++;
        }

        await batch.commit();
        Swal.fire("สำเร็จ!", `นำเข้าข้อมูลไพ่ 32 ใบขึ้นฐานข้อมูลเรียบร้อยแล้ว!`, "success");
    } catch (error) {
        console.error("Batch init error:", error);
        Swal.fire("ข้อผิดพลาด", `ไม่สามารถนำเข้าข้อมูลได้: ${error.message}`, "error");
    }
}

// 6. แก้ไขความหมายไพ่ (CRUD - Update)
function editCartomancyCard(cardId) {
    const card = localCardsCache.find(c => c.id === cardId);
    if (!card) return;

    Swal.fire({
        title: `✏️ แก้ไขความหมาย: ${card.name}`,
        html: `
            <div style="text-align: left; font-family: 'Sarabun', sans-serif;">
                <div class="form-group">
                    <label style="color:#d4af37; font-weight:bold;">ความหมายทั่วไป:</label>
                    <textarea id="editMeaning" class="form-control bg-dark text-white border-secondary" rows="3" style="font-size:14px;">${card.meaning}</textarea>
                </div>
                <div class="form-group">
                    <label style="color:#d4af37; font-weight:bold;">ดวงการงาน:</label>
                    <textarea id="editWork" class="form-control bg-dark text-white border-secondary" rows="2" style="font-size:14px;">${card.work}</textarea>
                </div>
                <div class="form-group">
                    <label style="color:#d4af37; font-weight:bold;">ดวงการเงิน:</label>
                    <textarea id="editFinance" class="form-control bg-dark text-white border-secondary" rows="2" style="font-size:14px;">${card.finance}</textarea>
                </div>
                <div class="form-group">
                    <label style="color:#d4af37; font-weight:bold;">ดวงความรัก:</label>
                    <textarea id="editLove" class="form-control bg-dark text-white border-secondary" rows="2" style="font-size:14px;">${card.love}</textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "บันทึกข้อมูล",
        cancelButtonText: "ยกเลิก",
        background: "#1e1e1e",
        color: "#fff",
        width: "650px",
        preConfirm: () => {
            return {
                meaning: document.getElementById("editMeaning").value.trim(),
                work: document.getElementById("editWork").value.trim(),
                finance: document.getElementById("editFinance").value.trim(),
                love: document.getElementById("editLove").value.trim()
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updated = result.value;
            if (!updated.meaning || !updated.work || !updated.finance || !updated.love) {
                Swal.fire("ข้อควรระวัง", "กรุณากรอกข้อมูลให้ครบถ้วนทุกด้าน", "warning");
                return;
            }

            Swal.fire({
                title: "กำลังอัปเดตข้อมูล...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            db.collection("cartomancy_db_32").doc(cardId).update(updated).then(() => {
                Swal.fire("สำเร็จ!", "อัปเดตคำทำนายเรียบร้อยแล้ว", "success");
            }).catch(err => {
                console.error("Update error:", err);
                Swal.fire("ข้อผิดพลาด", `ไม่สามารถบันทึกข้อมูลได้: ${err.message}`, "error");
            });
        }
    });
}

// 7. ล้างและรีเซ็ตฐานข้อมูล
function resetCartomancyDb() {
    Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "ระบบจะทำการล้างฐานข้อมูลไพ่ป๊อกออนไลน์ทั้งหมด และดึงค่าเริ่มต้น 32 ใบกลับมาคืนค่า",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, รีเซ็ตข้อมูล",
        cancelButtonText: "ยกเลิก",
        background: "#1e1e1e",
        color: "#fff"
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "กำลังล้างฐานข้อมูลเดิม...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                // ลบเอกสารทั้งหมดใน collection
                const snapshot = await db.collection("cartomancy_db_32").get();
                const batch = db.batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();

                // นำเข้าข้อมูลเริ่มต้นใหม่
                await initializeCartomancyDb();
            } catch (err) {
                console.error("Reset error:", err);
                Swal.fire("ข้อผิดพลาด", `ไม่สามารถรีเซ็ตข้อมูลได้: ${err.message}`, "error");
            }
        }
    });
}
