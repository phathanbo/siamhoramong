function renderElementManual() {
    const container = document.getElementById("elementManualContainer");
    if (!container) return;

    // ประกาศตัวแปร html ให้ถูกต้อง
    const html = `
    <div class="container mt-4"> <div class="card shadow-lg border-gold">
            <div class="card-header bg-white text-gold text-center py-4">
                <h2 class="mb-1" style="font-weight: 700;">📜 คัมภีร์ธาตุพยากรณ์</h2><br>
                <span>วิชาว่าด้วยการหนุนส่งและหักล้างของเบญจธาตุ</span>
            </div>                
    <div class="card-body bg-light text-dark">
        <div id="userElementSummary" class="alert bg-white border-gold mb-4 text-center shadow-sm" style="display:none;">
            <h6 class="text-gold mb-2">✨ ธาตุประจำตัวของคุณ ✨</h6>
            <div id="userElementBadges" class="d-flex justify-content-center flex-wrap gap-2"></div>
        </div>

        <div class="mb-5">
            <h5 class="text-gold mb-3" style="border-left: 4px solid #b8860b; padding-left: 10px; font-weight: 600;">
                ✨ วงจรหนุนส่ง (Creative Cycle)
            </h5>
            <p class="text-muted small mb-3">ธาตุที่ส่งเสริมกัน อยู่ด้วยกันแล้วจะช่วยผลักดันให้เกิดความเจริญรุ่งเรือง</p>
            <div class="row text-center g-2">
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-ไม้" class="p-3 border bg-white rounded shadow-sm">🌳 ไม้ <span class="text-gold">→</span> 🔥 ไฟ</div>
                </div>
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-ไฟ" class="p-3 border bg-white rounded shadow-sm">🔥 ไฟ <span class="text-gold">→</span> ⛰️ ดิน</div>
                </div>
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-ดิน" class="p-3 border bg-white rounded shadow-sm">⛰️ ดิน <span class="text-gold">→</span> 🪙 ทอง</div>
                </div>
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-ทอง" class="p-3 border bg-white rounded shadow-sm">🪙 ทอง <span class="text-gold">→</span> 💧 น้ำ</div>
                </div>
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-น้ำ" class="p-3 border bg-white rounded shadow-sm">💧 น้ำ <span class="text-gold">→</span> 🌳 ไม้</div>
                </div>
                <div class="col-6 col-md-4 mb-2">
                    <div id="manual-ลม" class="p-3 border bg-white rounded shadow-sm">🌬️ ลม <span class="text-gold">→</span> 🔥 ไฟ</div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <h5 class="text-danger mb-3" style="border-left: 4px solid #dc3545; padding-left: 10px; font-weight: 600;">
                ⚔️ วงจรหักล้าง (Destructive Cycle)
            </h5>
            <div class="row text-center g-2" id="destructiveRows">
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">🔥 ไฟ ⚔️ 🪙 ทอง</div></div>
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">🪙 ทอง ⚔️ 🌳 ไม้</div></div>
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">🌳 ไม้ ⚔️ ⛰️ ดิน</div></div>
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">⛰️ ดิน ⚔️ 💧 น้ำ</div></div>
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">💧 น้ำ ⚔️ 🔥 ไฟ</div></div>
                <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm">🪙 ทอง ⚔️ 🌬️ ลม</div></div>
            </div>
        </div>

        <div class="alert alert-secondary border-gold bg-white p-4 shadow-sm">
            <h5 class="text-gold text-center mb-4" style="font-weight: 700;">💡 เคล็ดลับการประสานธาตุ (The Mediator)</h5>
            <div class="table-responsive">
                <table class="table table-hover table-bordered mb-0" style="font-size: 1.05rem;">
                    <thead class="table-dark text-gold text-center">
                        <tr><th>คู่หักล้าง</th><th>ธาตุประสาน (ตัวช่วย)</th></tr>
                    </thead>
                    <tbody class="text-center">
                        <tr><td>🔥 ไฟ vs 🪙 ทอง</td><td class="bg-warning-subtle">⛰️ <b>ดิน</b></td></tr>
                        <tr><td>🪙 ทอง vs 🌳 ไม้</td><td class="bg-primary-subtle">💧 <b>น้ำ</b></td></tr>
                        <tr><td>🌳 ไม้ vs ⛰️ ดิน</td><td class="bg-danger-subtle">🔥 <b>ไฟ</b></td></tr>
                        <tr><td>⛰️ ดิน vs 💧 น้ำ</td><td class="bg-secondary-subtle">🪙 <b>ทอง</b></td></tr>
                        <tr><td>💧 น้ำ vs 🔥 ไฟ</td><td class="bg-success-subtle">🌳 <b>ไม้</b></td></tr>
                    </tbody>
                </table>
            </div>
        </div>               
    </div>
        <div class="row mt-4">
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')">
                    <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                </button>
            </div>
            <div class="col-6">
                <button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()">
                    <i class="fas fa-home"></i> กลับหน้าหลัก
                </button>
            </div>
        </div> 
    </div>`;

    container.innerHTML = html; // สั่งให้ใส่ HTML ลงไปใน Container
    window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนขึ้นบนสุดของหน้า
}

document.addEventListener('DOMContentLoaded', () => {
    renderElementManual();
});