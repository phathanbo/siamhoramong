/**
 * adminCartomancy.js
 * โลจิกควบคุมหน้าจอระบบทำนายไพ่ป๊อก 32 ใบ (ฝั่งแอดมิน)
 * อิงการแสดงผลแบบ HTML/CSS และจับภาพหน้าจอด้วย html2canvas
 */

"use strict";

let currentMode = 3; // 1 or 3
let drawnCards = [];
let autoSummary = "";

document.addEventListener("DOMContentLoaded", () => {
    // ป้องกันการทำงานบนหน้า admin.html (รันเฉพาะหน้าที่มีบอร์ดพรีวิวไพ่)
    if (!document.getElementById("renderCanvas")) return;

    const customSummary = document.getElementById("customSummaryInput");
    if (customSummary) customSummary.value = "";
    
    // โหลดครั้งแรก
    switchMode(3);
});

// 1. สลับโหมดการดูดวง (1 ใบ หรือ 3 ใบ)
function switchMode(mode) {
    currentMode = mode;
    
    const btnMode1 = document.getElementById("btnMode1");
    const btnMode3 = document.getElementById("btnMode3");
    const controlsMode1 = document.getElementById("controlsMode1");
    const controlsMode3 = document.getElementById("controlsMode3");
    const layout1Card = document.getElementById("layout1Card");
    const layout3Cards = document.getElementById("layout3Cards");
    const canvasHeaderTag = document.getElementById("canvasHeaderTag");
    const renderCanvas = document.getElementById("renderCanvas");
    
    if (!renderCanvas || !btnMode1 || !btnMode3) return;
    
    if (mode === 1) {
        btnMode1.classList.add("active");
        btnMode3.classList.remove("active");
        controlsMode1.style.display = "block";
        controlsMode3.style.display = "none";
        layout1Card.style.display = "flex";
        layout3Cards.style.display = "none";
        canvasHeaderTag.innerHTML = "♥️ ไพ่ป๊อกพยากรณ์ประจำวัน (1 ใบ)";
        
        // ปรับขนาดเฟรมรองรับ 1 ใบ (1080x1080)
        renderCanvas.style.width = "1080px";
        renderCanvas.style.minHeight = "1080px";
        renderCanvas.style.height = "1080px";
        
        drawSingleCard();
    } else {
        btnMode3.classList.add("active");
        btnMode1.classList.remove("active");
        controlsMode3.style.display = "block";
        controlsMode1.style.display = "none";
        layout3Cards.style.display = "flex";
        layout1Card.style.display = "none";
        canvasHeaderTag.innerHTML = "♣️ ไพ่ป๊อกพยากรณ์ชะตาชีวิต (3 ใบ)";
        
        // ปรับขนาดเฟรมรองรับ 3 ใบ (1200x1200)
        renderCanvas.style.width = "1200px";
        renderCanvas.style.minHeight = "1200px";
        renderCanvas.style.height = "1200px";
        
        drawThreeCards();
    }
    
    // ล้างช่องป้อนข้อความสรุปเอง
    const input = document.getElementById("customSummaryInput");
    if (input) input.value = "";
    
    adjustScale();
}

// 2. ปรับขนาดอัตราส่วนให้พอดีจอแสดงผล
function adjustScale() {
    const canvas = document.getElementById("renderCanvas");
    const wrapper = document.getElementById("previewWrapper");
    if (!canvas || !wrapper) return;
    
    const wrapperWidth = wrapper.offsetWidth;
    const canvasWidth = currentMode === 1 ? 1080 : 1200;
    
    if (wrapperWidth < canvasWidth) {
        const scale = wrapperWidth / canvasWidth;
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = "top center";
        // ปรับความสูง wrapper ให้พอดีกล่องหลังย่อสเกล
        const canvasHeight = currentMode === 1 ? 1080 : 1200;
        wrapper.style.height = (canvasHeight * scale) + "px";
    } else {
        canvas.style.transform = "none";
        wrapper.style.height = "auto";
    }
}

window.addEventListener("resize", adjustScale);

// 3. จั่วไพ่ 1 ใบ
function drawSingleCard() {
    if (typeof drawSingleCartomancy !== "function") {
        Swal.fire("ข้อผิดพลาด", "ไม่พบฟังก์ชันสุ่มไพ่", "error");
        return;
    }
    
    const card = drawSingleCartomancy();
    drawnCards = [card];
    
    // อัปเดตการ์ด HTML
    renderCardUI("cardUI1Single", card);
    document.getElementById("cardName1Single").innerHTML = `${card.name} (${card.symbol})`;
    document.getElementById("cardDesc1Single").innerHTML = card.meaning;
    
    // ตั้งค่าบทสรุปอัตโนมัติ
    autoSummary = `ไพ่ป๊อกพยากรณ์ประจำวันของคุณในวันนี้คือ "${card.name}"\nคำทำนายโดยรวม: ${card.meaning}\n• การงาน: ${card.work}\n• การเงิน: ${card.finance}\n• ความรัก: ${card.love}`;
    
    updateSummaryText("");
}

// 4. จั่วไพ่ 3 ใบ
function drawThreeCards() {
    if (typeof drawThreeCartomancy !== "function") {
        Swal.fire("ข้อผิดพลาด", "ไม่พบฟังก์ชันสุ่มไพ่ 3 ใบ", "error");
        return;
    }
    
    const cards = drawThreeCartomancy();
    drawnCards = cards;
    
    // อัปเดต HTML การ์ดทั้ง 3 ใบ
    renderCardUI("cardUI1", cards[0]);
    document.getElementById("cardName1").innerHTML = `${cards[0].name} (${cards[0].symbol})`;
    document.getElementById("cardDesc1").innerHTML = cards[0].meaning;
    
    renderCardUI("cardUI2", cards[1]);
    document.getElementById("cardName2").innerHTML = `${cards[1].name} (${cards[1].symbol})`;
    document.getElementById("cardDesc2").innerHTML = cards[1].meaning;
    
    renderCardUI("cardUI3", cards[2]);
    document.getElementById("cardName3").innerHTML = `${cards[2].name} (${cards[2].symbol})`;
    document.getElementById("cardDesc3").innerHTML = cards[2].meaning;
    
    // คำนวณสรุปดวง 3 ใบอดีต ปัจจุบัน อนาคต
    autoSummary = `สรุปทิศทางดวงชะตา 3 ใบ (อดีต - ปัจจุบัน - อนาคต):\nอดีตที่ผ่านมาดวงของคุณเป็นไปตามพลังของไพ่ "${cards[0].name}" (${cards[0].meaning.substring(0, 80)}...)\nในขณะที่ปัจจุบัน ดวงของคุณขึ้นอยู่กับอิทธิพลของไพ่ "${cards[1].name}" ซึ่งเด่นเรื่อง: ${cards[1].work}\nและอนาคตอันใกล้มีแนวโน้มจะลงเอยตามข้อสรุปของไพ่ "${cards[2].name}" แนะนำว่า: ${cards[2].love}`;
    
    updateSummaryText("");
}

// 5. วาดลวดลายและข้อมลในตัวไพ่ป๊อก
function renderCardUI(elementId, card) {
    const cardEl = document.getElementById(elementId);
    if (!cardEl) return;
    
    const isRed = card.color === "red";
    const colorClass = isRed ? "suit-red" : "suit-black";
    const rank = card.name.split(" ")[0];
    
    cardEl.innerHTML = `
        <div class="card-corner top-left ${colorClass}">${rank}<br>${card.symbol}</div>
        <div class="card-center-symbol ${colorClass}">${card.symbol}</div>
        <div class="card-corner bottom-right ${colorClass}">${rank}<br>${card.symbol}</div>
    `;
}

// 6. อัปเดตสเตตัสข้อความสรุปด้านล่าง
function updateSummaryText(customVal) {
    const summaryText = document.getElementById("summaryText");
    if (!summaryText) return;
    summaryText.innerText = customVal.trim() || autoSummary;
}

// 7. ดาวน์โหลดรูปภาพ หรือ คืนค่ารูปภาพแบบ Base64 สำหรับแชร์
function downloadImage(action = "download") {
    return new Promise((resolve) => {
        Swal.fire({
            title: "กำลังเตรียมสร้างภาพความละเอียดสูง...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // คืนค่า Scale เพื่อความละเอียด 100% ตอนแคปเจอร์
        const canvas = document.getElementById("renderCanvas");
        const wrapper = document.getElementById("previewWrapper");
        canvas.style.transform = "none";
        if (wrapper) wrapper.style.height = "auto";
        
        // เรียกใช้ html2canvas แบบ Dynamic
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = () => {
            html2canvas(canvas, {
                scale: 2, // เพิ่มความละเอียดระดับ Retina HD 2x
                useCORS: true,
                backgroundColor: "#1f0505"
            }).then(c => {
                const dataUrl = c.toDataURL("image/png");
                
                // คืนค่าการย่อสเกลสำหรับหน้าจอผู้ใช้
                adjustScale();
                Swal.close();
                
                if (action === "post") {
                    resolve(dataUrl);
                } else {
                    const link = document.createElement("a");
                    link.download = `cartomancy-${currentMode}-cards-${Date.now()}.png`;
                    link.href = dataUrl;
                    link.click();
                    resolve();
                }
            }).catch(err => {
                console.error("Capture failed:", err);
                Swal.fire("ข้อผิดพลาด", "ไม่สามารถสร้างไฟล์ภาพได้", "error");
                adjustScale();
                resolve();
            });
        };
        document.body.appendChild(script);
    });
}

// 8. การโพสต์คำทำนายลง Facebook
async function postToFacebook() {
    try {
        const dataUrl = await downloadImage("post");
        if (!dataUrl) return;
        
        const summary = document.getElementById("summaryText").innerText;
        
        const confirmResult = await Swal.fire({
            title: "ยืนยันการแชร์โพสต์ลงเพจ",
            html: `
                <div style="background: #ffffff; color: #1c1e21; border-radius: 12px; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif;">
                    <div style="display: flex; padding: 12px 16px; gap: 10px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ccc; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Siam&background=5a0909&color=fff" style="width: 100%; height: 100%;">
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 15px; color: #050505;">สยามโหรามงคล</span>
                            <span style="font-size: 13px; color: #65676b;">เพิ่งครู่ · 🌎</span>
                        </div>
                    </div>
                    <div style="padding: 4px 16px 16px 16px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; color: #050505; max-height: 200px; overflow-y: auto;">${summary}</div>
                    <img src="${dataUrl}" style="width: 100%; display: block; border-top: 1px solid #eee;">
                </div>
                <div style="margin-top: 20px; text-align: left; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #333;">
                    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #d4af37;"><i class="fas fa-cog"></i> ตั้งค่าเพิ่มเติม</h4>
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">ตั้งเวลาโพสต์ล่วงหน้า (Schedule):</label>
                    <input type="datetime-local" id="swalScheduleTime" style="width: 95%; padding: 10px; margin-bottom: 15px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                    <label style="color: #bbb; font-size: 13px; display: block; margin-bottom: 5px;">รหัสสถานที่เช็คอิน (Place ID):</label>
                    <input type="text" id="swalPlaceId" placeholder="เช่น 108398189188044" style="width: 95%; padding: 10px; border-radius: 6px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-family: inherit; font-size: 14px;">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> ยืนยันโพสต์ลงเพจ',
            cancelButtonText: "ยกเลิก",
            background: "#1e1e1e",
            color: "#fff",
            width: "600px",
            preConfirm: () => {
                return {
                    scheduleTime: document.getElementById("swalScheduleTime") ? document.getElementById("swalScheduleTime").value : "",
                    placeId: document.getElementById("swalPlaceId") ? document.getElementById("swalPlaceId").value.trim() : ""
                };
            }
        });

        if (!confirmResult.isConfirmed) return;

        let scheduledPublishTime = null;
        if (confirmResult.value && confirmResult.value.scheduleTime) {
            scheduledPublishTime = Math.floor(new Date(confirmResult.value.scheduleTime).getTime() / 1000);
        }
        let place = (confirmResult.value && confirmResult.value.placeId) ? confirmResult.value.placeId : null;

        Swal.fire({
            title: "กำลังโพสต์ไปยังเพจ Facebook...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const res = await fetch("http://127.0.0.1:3000/api/facebook-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: summary,
                image: dataUrl,
                scheduledPublishTime: scheduledPublishTime,
                place: place
            })
        });

        const data = await res.json();
        if (data.success) {
            Swal.fire("สำเร็จ!", "โพสต์ข้อมูลและแชร์ไพ่ป๊อกสำเร็จเรียบร้อย!", "success");
        } else {
            Swal.fire("เกิดข้อผิดพลาด", data.error || "ไม่สามารถโพสต์ได้", "error");
        }
    } catch (err) {
        console.error(err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับบริการ API หลังบ้านได้: " + err.message, "error");
    }
}
