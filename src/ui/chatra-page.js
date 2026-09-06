"use strict";

/**
 * Logic: ฉัตร 3 ชั้น (สูตรคำนวณเศษอายุมาตรฐาน)
 * ชั้น 1: อายุ % 3
 * ชั้น 2: อายุ % 7
 * ชั้น 3: อายุ % 8
 */

function showchatri(){
    const contianer = document.getElementById('showchatriPage')
    if (!contianer) return ;

    const html = `
    <style>
        /* Chatra Page Specific Luxury Glassmorphism Styles */
        .chatra-hero-card {
            background: linear-gradient(135deg, rgba(20, 30, 52, 0.92) 0%, rgba(13, 21, 39, 0.96) 100%);
            border: 1px solid rgba(241, 208, 110, 0.4);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(241, 208, 110, 0.12), inset 0 1px 0 rgba(255,255,255,0.2);
            backdrop-filter: blur(25px);
            overflow: hidden;
            position: relative;
        }

        .chatra-header-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(241, 208, 110, 0.12);
            border: 1px solid rgba(241, 208, 110, 0.35);
            color: #F9E596;
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 0.88rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        /* 3D Realistic Royal Chatra Visual */
        .chatra-svg-wrapper {
            position: relative;
            max-width: 550px;
            width: 100%;
            margin: 0 auto 20px;
            filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6));
        }

        .chatra-svg-wrapper svg {
            width: 100%;
            height: auto;
            display: block;
        }

        .chatra-tier-group {
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .chatra-tier-group:hover {
            filter: drop-shadow(0 0 15px rgba(241, 208, 110, 0.9));
        }

        /* Result Cards Grid */
        .chatra-result-card {
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(241, 208, 110, 0.3);
            border-radius: 18px;
            padding: 24px;
            height: 100%;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .chatra-result-card:hover {
            border-color: rgba(241, 208, 110, 0.7);
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(241, 208, 110, 0.15);
        }

        .chatra-result-card .card-tier-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 20px;
            margin-bottom: 12px;
            width: fit-content;
        }

        .chatra-summary-box {
            background: linear-gradient(135deg, rgba(30, 46, 78, 0.7) 0%, rgba(18, 28, 50, 0.8) 100%);
            border: 1px solid rgba(241, 208, 110, 0.4);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* Status Colors Glow */
        .glow-gold {
            border-color: #F1D06E !important;
            box-shadow: 0 0 25px rgba(241, 208, 110, 0.4) !important;
        }

        .glow-red {
            border-color: #FF5A5F !important;
            box-shadow: 0 0 25px rgba(255, 90, 95, 0.35) !important;
        }

        .glow-blue {
            border-color: #38BDF8 !important;
            box-shadow: 0 0 25px rgba(56, 189, 248, 0.35) !important;
        }

        .text-success-gold {
            color: #F9E596 !important;
            text-shadow: 0 0 12px rgba(241, 208, 110, 0.5);
        }

        .text-danger-bright {
            color: #FF6B6B !important;
            text-shadow: 0 0 12px rgba(255, 107, 107, 0.5);
        }

        .text-info-bright {
            color: #38BDF8 !important;
            text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
        }
    </style>

    <div class="container my-4">
        <div class="chatra-hero-card">
            <!-- Header Section -->
            <div class="p-4 p-md-5 text-center" style="border-bottom: 1px solid rgba(241, 208, 110, 0.25);">
                <div class="chatra-header-badge mb-3">
                    <i class="fas fa-crown text-gold"></i> ศาสตร์พยากรณ์ชั้นสูง
                </div>
                <h1 class="display-6 fw-bold text-gold mb-2" style="letter-spacing: 0.5px;">
                    วิชามหามงคล "ฉัตร ๓ ชั้น"
                </h1>
                <p class="text-muted mb-0" style="font-size: 1.05rem;">
                    พยากรณ์เกณฑ์ชะตาชีวิต ฐานดวง ลาภผลการงาน และอำนาจบารมีประจำปี
                </p>
            </div>

            <!-- Form Body -->
            <div class="p-4 p-md-5">
                <div class="row justify-content-center">
                    <div class="col-lg-6 col-md-8">
                        <div class="form-container p-4" style="background: rgba(13, 21, 39, 0.7); border: 1px solid rgba(241, 208, 110, 0.3); border-radius: 18px;">
                            <div class="form-group mb-3 text-start">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-user-circle mr-1"></i> เลือกจากรายชื่อสมาชิก (ประวัติ):
                                </label>
                                <select id="memberSelect"
                                    class="form-control member-selector-shared"
                                    onchange="autoFillMemberData(this.value)">
                                    <option value="">-- เลือกสมาชิก หรือคำนวณแบบระบุอายุ --</option>
                                </select>
                            </div>

                            <div class="form-group mb-4 text-start">
                                <label class="text-gold fw-semibold mb-2">
                                    <i class="fas fa-birthday-cake mr-1"></i> อายุย่างตามปฏิทิน (คำนวณอัตโนมัติ):
                                </label>
                                <input type="number" id="chatraAge" placeholder="กรอกอายุย่าง (เช่น 25, 36, 42)"
                                    onkeypress="if(event.key === 'Enter') { event.preventDefault(); calculateChatra(); }"
                                    class="form-control text-center text-gold fw-bold" style="font-size: 1.25rem;" />
                            </div>

                            <button type="button" onclick="calculateChatra()" class="btn btn-primary-gold w-100 py-3 fw-bold" style="font-size: 1.1rem;">
                                <i class="fas fa-sparkles mr-2"></i> คำนวณมหาพยากรณ์ฉัตร ๓ ชั้น
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Display Results Section -->
                <div id="chatraDisplay" class="mt-5" style="display: none;">
                    <div class="text-center mb-3">
                        <div class="chatra-header-badge">
                            <i class="fas fa-shield-alt text-gold"></i> ผังมหามงคลเศวตฉัตร ๓ ชั้น
                        </div>
                        <h3 class="text-gold mt-2">ภาพรวมเกณฑ์ชะตา ๓ มิติ</h3>
                    </div>

                    <!-- Authentic Royal Thai 3-Tier Chatra SVG Diagram -->
                    <div class="chatra-svg-wrapper">
                        <svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <!-- Golden Gradients -->
                                <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#FFF5C0" />
                                    <stop offset="40%" stop-color="#F1D06E" />
                                    <stop offset="100%" stop-color="#C99727" />
                                </linearGradient>
                                <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#F9E596" />
                                    <stop offset="70%" stop-color="#D4AF37" />
                                    <stop offset="100%" stop-color="#8C6819" />
                                </linearGradient>
                                <linearGradient id="clothGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#1e2c47" />
                                    <stop offset="50%" stop-color="#141e33" />
                                    <stop offset="100%" stop-color="#0c1322" />
                                </linearGradient>
                                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            <!-- Center Pole (คันฉัตร / เสาฉัตรทอง) -->
                            <rect x="294" y="20" width="12" height="520" fill="url(#goldGrad1)" rx="4" />
                            <rect x="290" y="525" width="20" height="25" fill="url(#goldGrad2)" rx="5" />
                            <polygon points="275,550 325,550 315,560 285,560" fill="url(#goldGrad1)" />

                            <!-- Top Pinnacle (ยอดฉัตรบัวกลุ่ม / พุ่มข้าวบิณฑ์เรืองแสง) -->
                            <g filter="url(#glowEffect)">
                                <path d="M300,8 L308,34 L292,34 Z" fill="url(#goldGrad1)" />
                                <circle cx="300" cy="8" r="5" fill="#FFF8D6" />
                                <ellipse cx="300" cy="38" rx="14" ry="7" fill="url(#goldGrad2)" />
                                <ellipse cx="300" cy="48" rx="18" ry="8" fill="url(#goldGrad1)" />
                            </g>

                            <!-- ================= TIER 3 (ชั้นที่ ๓ - ยอดฉัตร) ================= -->
                            <g class="chatra-tier-group" id="svgTierGroup3">
                                <!-- Umbrella Canopy Roof -->
                                <path d="M210,85 Q300,50 390,85 L380,105 Q300,75 220,105 Z" fill="url(#goldGrad1)" stroke="#FFF5C0" stroke-width="1.5" />
                                <!-- Tier Cloth Body (ผืนฉัตรขยายสูงขึ้นเพื่อความสบายตา) -->
                                <path d="M218,102 Q300,75 382,102 L374,168 Q300,142 226,168 Z" fill="url(#clothGrad3)" stroke="#F1D06E" stroke-width="2" id="svgCloth3" />
                                <!-- Golden Fringe / Tassels (ชายระบายฉัตร) -->
                                <path d="M226,168 Q300,142 374,168 L371,180 Q300,154 229,180 Z" fill="url(#goldGrad2)" />
                                <!-- Little Golden Hanging Bells (กระดิ่งทองคำ) -->
                                <circle cx="234" cy="182" r="3.5" fill="#F1D06E" />
                                <circle cx="265" cy="172" r="3.5" fill="#F1D06E" />
                                <circle cx="300" cy="166" r="4" fill="#F1D06E" />
                                <circle cx="335" cy="172" r="3.5" fill="#F1D06E" />
                                <circle cx="366" cy="182" r="3.5" fill="#F1D06E" />
                                
                                <!-- Tier Text (ยกข้อความขึ้นให้อยู่กึ่งกลางผืนฉัตรสวยงาม) -->
                                <text x="300" y="122" fill="#CBD5E1" font-size="13" font-weight="500" text-anchor="middle" font-family="'Prompt', sans-serif">ชั้นที่ ๓ : บารมี/บริวาร</text>
                                <text x="300" y="146" fill="#F1D06E" font-size="17" font-weight="700" text-anchor="middle" font-family="'Prompt', sans-serif" id="svgResTier3">-</text>
                            </g>

                            <!-- Mid Connector Ring -->
                            <ellipse cx="300" cy="198" rx="12" ry="5" fill="url(#goldGrad1)" />

                            <!-- ================= TIER 2 (ชั้นที่ ๒ - มัชฌิมฉัตร) ================= -->
                            <g class="chatra-tier-group" id="svgTierGroup2">
                                <!-- Umbrella Canopy Roof -->
                                <path d="M160,230 Q300,185 440,230 L428,252 Q300,212 172,252 Z" fill="url(#goldGrad1)" stroke="#FFF5C0" stroke-width="1.5" />
                                <!-- Tier Cloth Body (ผืนฉัตร) -->
                                <path d="M170,248 Q300,212 430,248 L420,318 Q300,285 180,318 Z" fill="url(#clothGrad3)" stroke="#F1D06E" stroke-width="2" id="svgCloth2" />
                                <!-- Golden Fringe / Tassels -->
                                <path d="M180,318 Q300,285 420,318 L417,330 Q300,297 183,330 Z" fill="url(#goldGrad2)" />
                                <!-- Little Golden Hanging Bells -->
                                <circle cx="188" cy="332" r="4" fill="#F1D06E" />
                                <circle cx="225" cy="320" r="4" fill="#F1D06E" />
                                <circle cx="262" cy="312" r="4" fill="#F1D06E" />
                                <circle cx="300" cy="308" r="4.5" fill="#F1D06E" />
                                <circle cx="338" cy="312" r="4" fill="#F1D06E" />
                                <circle cx="375" cy="320" r="4" fill="#F1D06E" />
                                <circle cx="412" cy="332" r="4" fill="#F1D06E" />

                                <!-- Tier Text -->
                                <text x="300" y="262" fill="#CBD5E1" font-size="14" font-weight="500" text-anchor="middle" font-family="'Prompt', sans-serif">ชั้นที่ ๒ : การงาน/การเงิน</text>
                                <text x="300" y="290" fill="#F1D06E" font-size="19" font-weight="700" text-anchor="middle" font-family="'Prompt', sans-serif" id="svgResTier2">-</text>
                            </g>

                            <!-- Base Connector Ring -->
                            <ellipse cx="300" cy="350" rx="14" ry="6" fill="url(#goldGrad1)" />

                            <!-- ================= TIER 1 (ชั้นที่ ๑ - ฐานฉัตร) ================= -->
                            <g class="chatra-tier-group" id="svgTierGroup1">
                                <!-- Umbrella Canopy Roof -->
                                <path d="M100,380 Q300,325 500,380 L486,405 Q300,355 114,405 Z" fill="url(#goldGrad1)" stroke="#FFF5C0" stroke-width="2" />
                                <!-- Tier Cloth Body (ผืนฉัตร) -->
                                <path d="M112,400 Q300,355 488,400 L478,472 Q300,430 122,472 Z" fill="url(#clothGrad3)" stroke="#F1D06E" stroke-width="2" id="svgCloth1" />
                                <!-- Golden Fringe / Tassels -->
                                <path d="M122,472 Q300,430 478,472 L475,486 Q300,444 125,486 Z" fill="url(#goldGrad2)" />
                                <!-- Little Golden Hanging Bells -->
                                <circle cx="129" cy="488" r="4.5" fill="#F1D06E" />
                                <circle cx="170" cy="474" r="4.5" fill="#F1D06E" />
                                <circle cx="215" cy="460" r="4.5" fill="#F1D06E" />
                                <circle cx="258" cy="450" r="4.5" fill="#F1D06E" />
                                <circle cx="300" cy="446" r="5" fill="#F1D06E" />
                                <circle cx="342" cy="450" r="4.5" fill="#F1D06E" />
                                <circle cx="385" cy="460" r="4.5" fill="#F1D06E" />
                                <circle cx="430" cy="474" r="4.5" fill="#F1D06E" />
                                <circle cx="471" cy="488" r="4.5" fill="#F1D06E" />

                                <!-- Tier Text -->
                                <text x="300" y="414" fill="#CBD5E1" font-size="15" font-weight="500" text-anchor="middle" font-family="'Prompt', sans-serif">ชั้นที่ ๑ : พื้นฐานดวงชะตาปีนี้</text>
                                <text x="300" y="442" fill="#F1D06E" font-size="21" font-weight="700" text-anchor="middle" font-family="'Prompt', sans-serif" id="svgResTier1">-</text>
                            </g>
                        </svg>
                    </div>

                    <!-- 3 Breakdown Detail Cards Grid -->
                    <div class="row g-4 mt-2">
                        <!-- Card Tier 3 -->
                        <div class="col-lg-4 col-md-6">
                            <div class="chatra-result-card" id="cardDetailTier3">
                                <div class="card-tier-tag bg-dark border-gold text-gold">
                                    <i class="fas fa-crown"></i> ชั้นที่ ๓ (ยอดฉัตร)
                                </div>
                                <h4 class="text-gold fw-bold mb-2" id="cardTitleTier3">-</h4>
                                <div class="badge bg-gold text-dark mb-3 p-2 fw-semibold" style="width: fit-content;">บารมี อำนาจวาสนา & มิตรบริวาร</div>
                                <p class="text-white small lh-lg mb-0 flex-grow-1" id="cardDescTier3">-</p>
                            </div>
                        </div>

                        <!-- Card Tier 2 -->
                        <div class="col-lg-4 col-md-6">
                            <div class="chatra-result-card" id="cardDetailTier2">
                                <div class="card-tier-tag bg-dark border-gold text-gold">
                                    <i class="fas fa-coins"></i> ชั้นที่ ๒ (มัชฌิมฉัตร)
                                </div>
                                <h4 class="text-gold fw-bold mb-2" id="cardTitleTier2">-</h4>
                                <div class="badge bg-gold text-dark mb-3 p-2 fw-semibold" style="width: fit-content;">ลาภผล การเงิน & กิจการงาน</div>
                                <p class="text-white small lh-lg mb-0 flex-grow-1" id="cardDescTier2">-</p>
                            </div>
                        </div>

                        <!-- Card Tier 1 -->
                        <div class="col-lg-4 col-md-12">
                            <div class="chatra-result-card" id="cardDetailTier1">
                                <div class="card-tier-tag bg-dark border-gold text-gold">
                                    <i class="fas fa-landmark"></i> ชั้นที่ ๑ (ฐานฉัตร)
                                </div>
                                <h4 class="text-gold fw-bold mb-2" id="cardTitleTier1">-</h4>
                                <div class="badge bg-gold text-dark mb-3 p-2 fw-semibold" style="width: fit-content;">พื้นฐานดวงชะตา & ความมั่นคง</div>
                                <p class="text-white small lh-lg mb-0 flex-grow-1" id="cardDescTier1">-</p>
                            </div>
                        </div>
                    </div>

                    <!-- Summary & Advice Box -->
                    <div class="chatra-summary-box mt-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="fas fa-scroll text-gold fa-2x"></i>
                            <h4 class="text-gold mb-0 fw-bold">บันทึกมหาพยากรณ์และคำแนะนำจากตำรา</h4>
                        </div>
                        <div id="chatraInterpretation" class="text-white lh-lg" style="font-size: 1.05rem;"></div>
                    </div>

                    <!-- Action Export Buttons -->
                    <div class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                        <button class="btn btn-outline-gold px-4 py-3" onclick="downloadChatraImage(event)">
                            <i class="fas fa-camera mr-2"></i> บันทึกภาพคำทำนายมงคล
                        </button>
                    </div>
                </div>

                <!-- Navigation Footer -->
                <div class="row mt-5 pt-3" style="border-top: 1px solid rgba(241, 208, 110, 0.2);">
                    <div class="col-6">
                        <button class="btn btn-outline-secondary w-100 border-0" onclick="navigateTo('mainpage')">
                            <i class="fas fa-chevron-left mr-2"></i> ห้องพยากรณ์
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-secondary w-100 border-0" onclick="goBack()">
                            <i class="fas fa-home mr-2"></i> หน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
    `;
    contianer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    showchatri()
});


function showChatraPage() {
    $('.main-section').addClass('hidden').hide(); 
    $('#chatraPage').removeClass('hidden').fadeIn(500);
    
    // เคลียร์ค่า
    const ageInput = document.getElementById('chatraAge');
    if (ageInput) ageInput.value = '';
    const display = document.getElementById('chatraDisplay');
    if (display) display.style.display = 'none';
    
    window.scrollTo(0, 0);

    // ตั้งค่ากด Enter
    setupChatraEnterKey();
}

// ฟังก์ชันจัดการสไตล์และสีของแต่ละชั้นฉัตร
function updateTierStyle(tierId, textId, value, type) {
    const tierEl = document.getElementById(tierId);
    const textEl = document.getElementById(textId);
    if (!tierEl || !textEl) return;
    
    // Reset classes
    textEl.className = 'tier-value-text';
    tierEl.classList.remove('glow-gold', 'glow-red', 'glow-blue');

    if (type === 'base') { // ชั้น 1
        if (value === 1) { // 1 = ลำบาก
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else if (value === 2) { // 2 = ปานกลาง
            textEl.classList.add('text-info-bright');
            tierEl.classList.add('glow-blue');
        } else { // 0 = ดีเยี่ยม
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    } 
    else if (type === 'mid') { // ชั้น 2
        if ([1, 4].includes(value)) { // 1 = เสียเงิน, 4 = เหนื่อย
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else if ([0, 3, 5, 6].includes(value)) { // ดี
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        } else { // 2 = ทรงตัว
            textEl.classList.add('text-info-bright');
            tierEl.classList.add('glow-blue');
        }
    } 
    else if (type === 'top') { // ชั้น 3
        if (value === 1) { // 1 = ศัตรูปองร้าย
            textEl.classList.add('text-danger-bright');
            tierEl.classList.add('glow-red');
        } else { // ที่เหลือดีหมด
            textEl.classList.add('text-success-gold');
            tierEl.classList.add('glow-gold');
        }
    }
}

const chatraLongPrediction = {
    tier1: [
        "ดวงชะตาชั้นฐานรุ่งโรจน์มาก ปีนี้ท่านจะมีโชคช่วยเหลือ หยิบจับสิ่งใดก็ราบรื่น งานการเจริญก้าวหน้า เงินทองไหลมาเทมา ลาภยศและชื่อเสียงจะติดตามมา บริวารและผู้ใหญ่ให้การสนับสนุนเต็มที่ ควรใช้โอกาสนี้ในการขยายกิจการหรือลงทุนใหม่ แต่ก็อย่าลืมทำบุญอุทิศส่วนกุศลเพื่อรักษาโชคนี้ไว้ให้นานที่สุด",
        "ปีนี้ดวงชะตาชั้นฐานตกอยู่ในเกณฑ์ลำบาก ท่านจะพบอุปสรรคและความวุ่นวายบ่อยครั้ง งานที่ทำอาจติดขัด เงินทองไหลออกง่าย ควรระวังการลงทุนใหญ่และการเป็นหนี้บุญคุณใคร ระวังคนใกล้ชิดนำปัญหามาให้ แนะนำให้หมั่นทำบุญ สวดมนต์ และรักษาสุขภาพให้แข็งแรง อย่าทุ่มเทแรงกายแรงใจเกินไปจนหมดตัว หากอดทนผ่านปีนี้ไปได้ ปีหน้าจะดีขึ้นอย่างเห็นได้ชัด",
        "ดวงชะตาชั้นฐานปานกลาง ท่านสามารถประคองตัวได้ตลอดปี แม้จะมีเรื่องให้ต้องปวดหัวบ้าง แต่ก็ยังพอมีโอกาสให้แก้ไข งานการจะค่อนข้างทรงตัว เงินเข้าเงินออกพอใช้ ควรระวังเรื่องคำพูดและการทะเลาะวิวาทกับผู้ใหญ่หรือบริวาร แนะนำให้ทำบุญทุกเดือนและหมั่นไหว้พระเพื่อเสริมสิริมงคล ปีนี้เหมาะกับการวางแผนมากกว่าการลงมือทำใหญ่โต"
    ],
    tier2: [
        "งานการในปีนี้จะขยับขยาย มีการเติบโตทั้งในด้านขนาดและรายได้ อาจได้เปิดสาขาใหม่หรือขยายธุรกิจ คว้าโอกาสนี้ไว้ แต่ต้องวางแผนให้ดีและไม่ประมาท",
        "ด้านการเงินและการงานในปีนี้ ท่านจะต้องจ่ายเงินออกมาก เก็บเงินไม่อยู่ มีค่าใช้จ่ายฉุกเฉินบ่อยครั้ง งานที่ทำอาจเหนื่อยล้าและไม่เป็นไปตามแผน ควรระวังการกู้ยืมหรือค้ำประกันใคร หมั่นตรวจสอบบัญชีและควบคุมการใช้จ่ายให้ดี แนะนำให้ทำบุญตัดกรรมและสวดมนต์ขอพรจากสิ่งศักดิ์สิทธิ์เพื่อคลายเคราะห์",
        "การเงินและการงานทรงตัวพอใช้ ไม่เด่นไม่ด้อย เงินเข้าเงินออกคล่องตัวปานกลาง งานราบรื่นแต่ไม่ก้าวกระโดด ควรใช้ความอดทนและความระมัดระวังในการตัดสินใจ บริวารและเพื่อนร่วมงานช่วยเหลือได้บ้าง แนะนำให้ทำบุญทุก ๑๕ ค่ำและแรม ๑๕ ค่ำเพื่อเสริมสิริมงคล",
        "ปีนี้มีโชคลาภลอยเข้ามาไม่คาดคิด อาจได้เงินก้อนจากงานอดิเรก การลงทุน หรือผู้ใหญ่ให้ การงานจะขยับขยาย มีโอกาสได้เลื่อนตำแหน่งหรือขยายธุรกิจ ควรคว้าโอกาสนี้ไว้ให้ดี แต่ก็อย่าประมาท ระวังคนอิจฉา",
        "งานในปีนี้จะทำให้ท่านเหนื่อยกายและเหนื่อยใจ ต้องทำงานหนักแต่ผลตอบแทนไม่คุ้มค่า ควรระวังสุขภาพและความเครียด อาจมีเรื่องขัดแย้งกับผู้ร่วมงาน แนะนำให้พักผ่อนให้เพียงพอและทำบุญเพื่อลดแรงกดดัน",
        "ผู้ใหญ่และผู้มีพระคุณจะเข้ามาหนุนหลังอย่างเต็มที่ งานการจะราบรื่นขึ้น มีโอกาสได้งานใหม่หรือตำแหน่งที่ดีกว่า ควรแสดงความกตัญญูและรักษาความสัมพันธ์ไว้ให้ดี ปีนี้เหมาะกับการขอความช่วยเหลือจากผู้ใหญ่",
        "บริวาร ลูกน้อง และคนรอบข้างจะช่วยเหลือท่านเป็นอย่างดี งานที่ทำจะสำเร็จด้วยความร่วมมือของทีม ควรดูแลบริวารและให้ความเป็นธรรมกับพวกเขาเพื่อรักษาโชคนี้ไว้"
    ],
    tier3: [
        "ปีนี้ท่านจะมีอำนาจวาสนาแผ่ไพศาล มีคนนับหน้าถือตาและให้ความเคารพ งานราชการหรือธุรกิจจะเจริญรุ่งเรือง ควรใช้พลังนี้ในการช่วยเหลือผู้อื่นและทำบุญเพื่อรักษาโชค",
        "ระวังคนปองร้ายและศัตรูแอบแฝง ปีนี้จะมีคนคิดร้ายหรือใส่ร้ายท่าน ควรระมัดระวังคำพูดและการกระทำ อย่าเปิดเผยความลับให้ใครมากเกินไป หมั่นทำบุญและสวดมนต์ขอพรเทวดาเพื่อป้องกันภัย",
        "เทวดาและสิ่งศักดิ์สิทธิ์จะคอยคุ้มครองท่านตลอดปี จะแคล้วคลาดจากอุบัติเหตุและภัยพิบัติ เรื่องร้าย ๆ จะคลี่คลายด้วยตัวเอง ควรทำบุญบ่อย ๆ เพื่อตอบแทนบุญคุณ",
        "ปีนี้ท่านจะแคล้วคลาดปลอดภัยจากทุกภัย เรื่องคดีความหรือปัญหาใหญ่จะได้รับการช่วยเหลืออย่างทันท่วงที ชื่อเสียงและเกียรติยศจะเพิ่มขึ้น ควรใช้โอกาสนี้ในการสร้างสัมพันธ์ที่ดี",
        "ชื่อเสียงและบารมีของท่านจะโดดเด่นเป็นที่รู้จัก งานที่ทำจะได้รับการยอมรับจากสังคม อาจมีข่าวดีเรื่องการเลื่อนตำแหน่งหรือได้รับรางวัล ควรรักษาพฤติกรรมและทำบุญเพื่อให้บารมีนี้ยั่งยืน",
        "บริวารและคนรอบข้างจะให้คุณแก่ท่านมาก ช่วยเหลือในยามยากและนำโชคมาให้ ควรดูแลและให้ความเมตตาแก่พวกเขา",
        "ท่านจะสามารถชนะอุปสรรคทั้งปวงที่เข้ามา ทุกปัญหาจะได้รับการแก้ไขด้วยปัญญาและความเพียร ควรมีสติและศรัทธาในสิ่งที่ดี",
        "สิ่งที่ท่านปรารถนาจะสำเร็จสมความต้องการ งาน การเงิน ความรัก และสุขภาพจะไปในทิศทางที่ดี ควรตั้งใจและทำบุญอุทิศส่วนกุศล"
    ]
};

function setupChatraEnterKey() {
    const ageInput = document.getElementById('chatraAge');
    if (ageInput) {
        ageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateChatra();
            }
        });
    }
}

function calculateChatra() {
    const ageInput = document.getElementById('chatraAge');
    if (!ageInput) return;
    const ageVal = ageInput.value.trim();
    const age = parseInt(ageVal);

    if (!age || age <= 0 || isNaN(age)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('แจ้งเตือน', 'โปรดระบุอายุเป็นตัวเลขที่ถูกต้อง (มากกว่า 0)', 'warning');
        } else {
            alert('โปรดระบุอายุเป็นตัวเลขที่ถูกต้อง (มากกว่า 0)');
        }
        return;
    }

    // คำนวณเศษตามสูตรมาตรฐาน
    const s1 = age % 3;
    const s2 = age % 7;
    const s3 = age % 8;

    const chatraDict = {
        tier1: [
            "ดวงรุ่งโรจน์ (หยิบจับอะไรเป็นเงิน)",
            "ตกที่นั่งลำบาก (ต้องระวัง)",
            "ดวงปานกลาง (ประคองตัวได้)"
        ],
        tier2: [
            "งานขยับขยาย",
            "จ่ายมากเก็บไม่อยู่",
            "การเงินทรงตัว",
            "มีโชคลาภลอย",
            "เหนื่อยเรื่องงาน",
            "ผู้ใหญ่หนุนหลัง",
            "บริวารช่วยเหลือ"
        ],
        tier3: [
            "มีอำนาจวาสนาแผ่ไพศาล",
            "ระวังคนปองร้าย",
            "เทวดาคุ้มครอง",
            "แคล้วคลาดปลอดภัย",
            "ชื่อเสียงโดดเด่น",
            "บริวารให้คุณ",
            "ชนะอุปสรรคทั้งปวง",
            "สำเร็จสมความปรารถนา"
        ]
    };

    // สีประจำสถานะ
    let c1 = s1 === 1 ? '#ff6b6b' : (s1 === 2 ? '#38bdf8' : '#f1d06e'); 
    let c2 = [1, 4].includes(s2) ? '#ff6b6b' : ([0, 3, 5, 6].includes(s2) ? '#f1d06e' : '#38bdf8');
    let c3 = s3 === 1 ? '#ff6b6b' : '#f1d06e';

    // อัปเดตข้อความและสีใน SVG Chatra 3 ชั้น
    const svgT1 = document.getElementById('svgResTier1');
    if (svgT1) {
        svgT1.textContent = chatraDict.tier1[s1];
        svgT1.setAttribute('fill', c1);
    }
    const svgCloth1 = document.getElementById('svgCloth1');
    if (svgCloth1) svgCloth1.setAttribute('stroke', c1);

    const svgT2 = document.getElementById('svgResTier2');
    if (svgT2) {
        svgT2.textContent = chatraDict.tier2[s2];
        svgT2.setAttribute('fill', c2);
    }
    const svgCloth2 = document.getElementById('svgCloth2');
    if (svgCloth2) svgCloth2.setAttribute('stroke', c2);

    const svgT3 = document.getElementById('svgResTier3');
    if (svgT3) {
        svgT3.textContent = chatraDict.tier3[s3];
        svgT3.setAttribute('fill', c3);
    }
    const svgCloth3 = document.getElementById('svgCloth3');
    if (svgCloth3) svgCloth3.setAttribute('stroke', c3);

    // อัปเดตข้อมูลในการ์ดแจกแจง 3 มิติ (3 Pillars Breakdown Cards)
    const titleT1 = document.getElementById('cardTitleTier1');
    const descT1 = document.getElementById('cardDescTier1');
    if (titleT1 && descT1) {
        titleT1.innerText = chatraDict.tier1[s1];
        titleT1.style.color = c1;
        descT1.innerText = chatraLongPrediction.tier1[s1];
    }

    const titleT2 = document.getElementById('cardTitleTier2');
    const descT2 = document.getElementById('cardDescTier2');
    if (titleT2 && descT2) {
        titleT2.innerText = chatraDict.tier2[s2];
        titleT2.style.color = c2;
        descT2.innerText = chatraLongPrediction.tier2[s2];
    }

    const titleT3 = document.getElementById('cardTitleTier3');
    const descT3 = document.getElementById('cardDescTier3');
    if (titleT3 && descT3) {
        titleT3.innerText = chatraDict.tier3[s3];
        titleT3.style.color = c3;
        descT3.innerText = chatraLongPrediction.tier3[s3];
    }

    // สรุปคำพยากรณ์และข้อคิดมงคล
    const summaryHtml = `
        <div class="alert-info p-3 rounded mb-3">
            <h5 class="text-gold mb-1"><i class="fas fa-star mr-2"></i> สรุปภาพรวมดวงชะตาในวัยย่าง <strong>${age}</strong> ปี</h5>
            <p class="mb-0 text-white">เกณฑ์ชะตาตกในผังมหาฉัตร ๓ ชั้น: <strong>${chatraDict.tier1[s1]}</strong> | <strong>${chatraDict.tier2[s2]}</strong> | <strong>${chatraDict.tier3[s3]}</strong></p>
        </div>
        <p class="text-muted small mb-0">
            <strong class="text-gold">💡 คำแนะนำเสริมมงคล:</strong> ควรหมั่นทำบุญตักบาตร ไหว้พระสวดมนต์ เจริญสมาธิภาวนา และรักษาศีลบริสุทธิ์ เพื่อเสริมพลังบารมีให้หนุนดวงชะตาให้ดียิ่งขึ้นไปตลอดทั้งปี
        </p>
    `;
    const interpEl = document.getElementById('chatraInterpretation');
    if (interpEl) interpEl.innerHTML = summaryHtml;

    // แสดงผลพร้อมแอนิเมชัน Smooth Reveal
    const display = document.getElementById('chatraDisplay');
    if (display) {
        display.style.opacity = '0';
        display.style.display = 'block';
        setTimeout(() => {
            display.style.transition = 'opacity 0.6s ease-in-out';
            display.style.opacity = '1';
            display.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

async function downloadChatraImage(e) {
    const btn = e ? e.currentTarget : document.querySelector('button[onclick="downloadChatraImage(event)"], button[onclick="downloadChatraImage()"]');
    let originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> กำลังเตรียมรูป...';
        btn.disabled = true;
    }

    try {
        const ageInput = document.getElementById('chatraAge');
        const ageVal = ageInput ? ageInput.value.trim() : '';
        const age = parseInt(ageVal);
        if (!age || age <= 0 || isNaN(age)) {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
            if(typeof Swal !== 'undefined') Swal.fire('แจ้งเตือน', 'กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ', 'warning');
            else alert('กรุณาคำนวณผลลัพธ์ก่อนบันทึกภาพ');
            return;
        }

        const s1 = age % 3;
        const s2 = age % 7;
        const s3 = age % 8;

        const chatraDict = {
            tier1: ["ดวงรุ่งโรจน์ (หยิบจับอะไรเป็นเงิน)", "ตกที่นั่งลำบาก (ต้องระวัง)", "ดวงปานกลาง (ประคองตัวได้)"],
            tier2: ["งานขยับขยาย", "จ่ายมากเก็บไม่อยู่", "การเงินทรงตัว", "มีโชคลาภลอย", "เหนื่อยเรื่องงาน", "ผู้ใหญ่หนุนหลัง", "บริวารช่วยเหลือ"],
            tier3: ["มีอำนาจวาสนาแผ่ไพศาล", "ระวังคนปองร้าย", "เทวดาคุ้มครอง", "แคล้วคลาดปลอดภัย", "ชื่อเสียงโดดเด่น", "บริวารให้คุณ", "ชนะอุปสรรคทั้งปวง", "สำเร็จสมความปรารถนา"]
        };
        
        let c1 = s1 === 1 ? '#ff6b6b' : (s1 === 2 ? '#38bdf8' : '#f1d06e'); 
        let c2 = [1, 4].includes(s2) ? '#ff6b6b' : ([0, 3, 5, 6].includes(s2) ? '#f1d06e' : '#38bdf8');
        let c3 = s3 === 1 ? '#ff6b6b' : '#f1d06e';
        
        const width = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = 3600;
        const ctx = canvas.getContext('2d');
        
        await document.fonts.ready;
        
        const drawContent = (isMeasure = false) => {
            let cy = 100;
            const cx = 80;
            const maxW = width - 160;
            
            if (!isMeasure) {
                // Background Gradient
                let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#0c1424');
                grad.addColorStop(0.3, '#14223c');
                grad.addColorStop(0.7, '#0d1628');
                grad.addColorStop(1, '#080d1a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, canvas.height);

                // Luxury Golden Border & Corner Accents
                ctx.strokeStyle = '#f1d06e';
                ctx.lineWidth = 3;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(40, 40, width - 80, canvas.height - 80, 24);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(40, 40, width - 80, canvas.height - 80);
                }

                // Inner delicate frame
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.25)';
                ctx.lineWidth = 1;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(50, 50, width - 100, canvas.height - 100, 18);
                    ctx.stroke();
                }

                // Header Badges & Titles
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("👑 ศาสตร์พยากรณ์ชั้นสูง", width/2, cy);
                cy += 55;

                ctx.font = '700 52px "Prompt", sans-serif';
                ctx.fillStyle = '#ffffff'; 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("วิชามหามงคล \"ฉัตร ๓ ชั้น\"", width/2, cy);
                cy += 65;
                
                ctx.font = '400 32px "Prompt", sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.textBaseline = 'middle';
                ctx.fillText(`พยากรณ์เกณฑ์ชะตาประจำปี · อายุย่าง ${age} ปี`, width/2, cy);
                cy += 45;

                // Section divider line
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(width/2 - 220, cy);
                ctx.lineTo(width/2 + 220, cy);
                ctx.stroke();
                cy += 35;
            } else {
                cy += 210;
            }
            
            // ==========================================
            // DRAW AUTHENTIC 3D ROYAL THAI CHATRA IN IMAGE
            // ==========================================
            if (!isMeasure) {
                // 1. Central Golden Pole (คันฉัตรทองคำ ยาวตลอดผัง)
                const poleGrad = ctx.createLinearGradient(width/2 - 7, cy, width/2 + 7, cy + 520);
                poleGrad.addColorStop(0, '#FFF5C0');
                poleGrad.addColorStop(0.5, '#F1D06E');
                poleGrad.addColorStop(1, '#8C6819');
                ctx.fillStyle = poleGrad;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width/2 - 7, cy + 20, 14, 500, 4);
                    ctx.fill();
                } else {
                    ctx.fillRect(width/2 - 7, cy + 20, 14, 500);
                }

                // 2. Pinnacle (ยอดฉัตรบัวกลุ่ม / พุ่มข้าวบิณฑ์เรืองแสง)
                ctx.fillStyle = '#F1D06E';
                ctx.shadowColor = 'rgba(241, 208, 110, 0.9)';
                ctx.shadowBlur = 22;
                ctx.beginPath();
                ctx.moveTo(width/2, cy);
                ctx.lineTo(width/2 - 14, cy + 32);
                ctx.lineTo(width/2 + 14, cy + 32);
                ctx.closePath();
                ctx.fill();

                // Pinnacle Spheres & Base Lotus
                ctx.beginPath();
                ctx.arc(width/2, cy, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#FFF8D6';
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(width/2, cy + 36, 18, 9, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#F1D06E';
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(width/2, cy + 48, 24, 11, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#D4AF37';
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
            cy += 55;

            // Function to render an authentic Royal Thai Chatra Tier in Canvas
            const renderRoyalChatraTier = (tierNum, tierTitle, tierValue, canopyW, roofH, clothH, strokeColor, fontColor, numBells) => {
                if (!isMeasure) {
                    const halfW = canopyW / 2;
                    const topY = cy;
                    const roofBottomY = topY + roofH;
                    const clothBottomY = roofBottomY + clothH;
                    const fringeBottomY = clothBottomY + 16;

                    // 1. Golden Roof Canopy (หลังคาฉัตรทรงโค้งระบายทอง)
                    let roofGrad = ctx.createLinearGradient(width/2 - halfW, topY, width/2 + halfW, roofBottomY);
                    roofGrad.addColorStop(0, '#FFF5C0');
                    roofGrad.addColorStop(0.35, '#F1D06E');
                    roofGrad.addColorStop(0.7, '#D4AF37');
                    roofGrad.addColorStop(1, '#8C6819');

                    ctx.beginPath();
                    ctx.moveTo(width/2 - halfW, roofBottomY);
                    ctx.quadraticCurveTo(width/2, topY - 15, width/2 + halfW, roofBottomY);
                    ctx.quadraticCurveTo(width/2, roofBottomY - 10, width/2 - halfW, roofBottomY);
                    ctx.fillStyle = roofGrad;
                    ctx.fill();
                    ctx.strokeStyle = '#FFF5C0';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // 2. Cloth Body (ผืนผ้าฉัตรมงคล)
                    let clothGrad = ctx.createLinearGradient(width/2 - halfW, roofBottomY, width/2 + halfW, clothBottomY);
                    clothGrad.addColorStop(0, '#1c2842');
                    clothGrad.addColorStop(0.5, '#141e33');
                    clothGrad.addColorStop(1, '#0d1527');

                    ctx.beginPath();
                    ctx.moveTo(width/2 - halfW + 10, roofBottomY);
                    ctx.quadraticCurveTo(width/2, roofBottomY - 6, width/2 + halfW - 10, roofBottomY);
                    ctx.lineTo(width/2 + halfW - 14, clothBottomY);
                    ctx.quadraticCurveTo(width/2, clothBottomY - 10, width/2 - halfW + 14, clothBottomY);
                    ctx.closePath();
                    ctx.fillStyle = clothGrad;
                    ctx.fill();
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    // 3. Golden Fringe / Tassels (ชายระบายฉัตรทอง)
                    let fringeGrad = ctx.createLinearGradient(width/2 - halfW, clothBottomY, width/2 + halfW, fringeBottomY);
                    fringeGrad.addColorStop(0, '#F9E596');
                    fringeGrad.addColorStop(1, '#C99727');

                    ctx.beginPath();
                    ctx.moveTo(width/2 - halfW + 14, clothBottomY);
                    ctx.quadraticCurveTo(width/2, clothBottomY - 10, width/2 + halfW - 14, clothBottomY);
                    ctx.lineTo(width/2 + halfW - 18, fringeBottomY);
                    ctx.quadraticCurveTo(width/2, fringeBottomY - 10, width/2 - halfW + 18, fringeBottomY);
                    ctx.closePath();
                    ctx.fillStyle = fringeGrad;
                    ctx.fill();

                    // 4. Little Golden Bells (กระดิ่งและพู่ห้อย)
                    ctx.fillStyle = '#F1D06E';
                    const bellSpan = (canopyW - 40) / (numBells - 1);
                    for (let i = 0; i < numBells; i++) {
                        const bx = (width/2 - halfW + 20) + (i * bellSpan);
                        const norm = (i / (numBells - 1)) - 0.5;
                        const curveOffset = (1 - (norm * norm * 4)) * 10;
                        const by = fringeBottomY - curveOffset + 3;

                        ctx.beginPath();
                        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // 5. Tier Texts (ข้อความบนผืนฉัตร จัดตำแหน่งระยะห่างอย่างชัดเจนไม่ทับซ้อน)
                    ctx.font = '500 24px "Prompt", sans-serif';
                    ctx.fillStyle = '#cbd5e1';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(tierTitle, width/2, roofBottomY + 36);

                    ctx.font = '700 34px "Prompt", sans-serif';
                    ctx.fillStyle = fontColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(tierValue, width/2, roofBottomY + 82);
                }
                cy += roofH + clothH + 36;
            };

            // Tier 3: Top Tier (ชั้นที่ ๓ - ยอดฉัตร ขนาด 580px, clothH: 110px)
            renderRoyalChatraTier(3, "ชั้นที่ ๓ : บารมี/บริวาร", chatraDict.tier3[s3], 580, 32, 110, c3, c3, 7);

            // Tier 2: Mid Tier (ชั้นที่ ๒ - มัชฌิมฉัตร ขนาด 740px, clothH: 110px)
            renderRoyalChatraTier(2, "ชั้นที่ ๒ : การงาน/การเงิน", chatraDict.tier2[s2], 740, 34, 110, c2, c2, 9);

            // Tier 1: Base Tier (ชั้นที่ ๑ - ฐานฉัตร ขนาด 900px, clothH: 110px)
            renderRoyalChatraTier(1, "ชั้นที่ ๑ : พื้นฐานดวงปีนี้", chatraDict.tier1[s1], 900, 36, 110, c1, c1, 11);

            // Base Ring & Pedestal (ฐานรองรับคันฉัตร)
            if (!isMeasure) {
                const baseGrad = ctx.createLinearGradient(width/2 - 40, cy, width/2 + 40, cy + 30);
                baseGrad.addColorStop(0, '#FFF5C0');
                baseGrad.addColorStop(0.5, '#F1D06E');
                baseGrad.addColorStop(1, '#8C6819');
                ctx.fillStyle = baseGrad;
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(width/2 - 25, cy - 8, 50, 16, 6);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.roundRect(width/2 - 45, cy + 8, 90, 20, 8);
                    ctx.fill();
                }
            }
            cy += 45;

            // ==========================================
            // DETAILED PREDICTION CARDS SECTION
            // ==========================================
            const renderWrappedText = (text, textColor = '#e8e9f5', fontSize = 28, lineHeight = 44, align = 'left', targetX = cx, targetW = maxW) => {
                ctx.font = `400 ${fontSize}px "Prompt", sans-serif`;
                let pLines = [];
                if (window.Intl && window.Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                    const segments = segmenter.segment(text);
                    let currentLine = "";
                    for (const {segment} of segments) {
                        const testLine = currentLine + segment;
                        if (ctx.measureText(testLine).width > targetW && currentLine.trim() !== '') {
                            pLines.push(currentLine);
                            currentLine = segment;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                } else {
                    let currentLine = "";
                    for (let j = 0; j < text.length; j++) {
                        const char = text[j];
                        const testLine = currentLine + char;
                        if (ctx.measureText(testLine).width > targetW && j > 0) {
                            pLines.push(currentLine);
                            currentLine = char;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    pLines.push(currentLine);
                }
                
                for (let l of pLines) {
                    if (!isMeasure) {
                        ctx.fillStyle = textColor;
                        ctx.textAlign = align;
                        ctx.textBaseline = 'top';
                        ctx.fillText(l, targetX, cy);
                    }
                    cy += lineHeight;
                }
            };

            // Section Header
            if (!isMeasure) {
                ctx.font = '700 36px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("📜 บันทึกมหาพยากรณ์แจกแจง ๓ มิติ", width/2, cy);
            }
            cy += 50;

            // Detail Block Component
            const renderDetailBlock = (tierTitle, tierHeadline, fullText, headlineColor) => {
                const blockPad = 28;
                const blockW = width - 160;
                const startY = cy;

                let blockInnerY = startY + blockPad;

                if (!isMeasure) {
                    // Tier Title
                    ctx.font = '600 30px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(tierTitle, cx + blockPad, blockInnerY);
                }
                blockInnerY += 46;

                if (!isMeasure) {
                    // Headline
                    ctx.font = '700 32px "Prompt", sans-serif';
                    ctx.fillStyle = headlineColor;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${tierHeadline}`, cx + blockPad, blockInnerY);
                }
                blockInnerY += 54;

                cy = blockInnerY;
                renderWrappedText(fullText, '#e2e8f0', 28, 44, 'left', cx + blockPad, blockW - (blockPad * 2));
                cy += blockPad;

                const blockHeight = cy - startY;
                if (!isMeasure) {
                    // Draw outer box for block
                    ctx.strokeStyle = 'rgba(241, 208, 110, 0.35)';
                    ctx.lineWidth = 1.5;
                    ctx.fillStyle = 'rgba(20, 30, 52, 0.75)';
                    if (ctx.roundRect) {
                        ctx.beginPath();
                        ctx.roundRect(cx, startY, blockW, blockHeight, 18);
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        ctx.fillRect(cx, startY, blockW, blockHeight);
                        ctx.strokeRect(cx, startY, blockW, blockHeight);
                    }

                    // Re-draw text on top of filled box
                    let redrawY = startY + blockPad;
                    ctx.font = '600 30px "Prompt", sans-serif';
                    ctx.fillStyle = '#f1d06e';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(tierTitle, cx + blockPad, redrawY);
                    redrawY += 46;

                    ctx.font = '700 32px "Prompt", sans-serif';
                    ctx.fillStyle = headlineColor;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(`• ${tierHeadline}`, cx + blockPad, redrawY);
                    redrawY += 54;

                    cy = redrawY;
                    renderWrappedText(fullText, '#e2e8f0', 28, 44, 'left', cx + blockPad, blockW - (blockPad * 2));
                    cy = startY + blockHeight;
                }
                cy += 25;
            };

            // Render 3 Details
            renderDetailBlock("ชั้นที่ ๓ (ยอดฉัตร) : บารมี อำนาจวาสนา และมิตรบริวาร", chatraDict.tier3[s3], chatraLongPrediction.tier3[s3], c3);
            renderDetailBlock("ชั้นที่ ๒ (มัชฌิมฉัตร) : ลาภผล การเงิน และกิจการงาน", chatraDict.tier2[s2], chatraLongPrediction.tier2[s2], c2);
            renderDetailBlock("ชั้นที่ ๑ (ฐานฉัตร) : พื้นฐานดวงชะตาชีวิต และความมั่นคง", chatraDict.tier1[s1], chatraLongPrediction.tier1[s1], c1);

            // ==========================================
            // ADVICE & FOOTER
            // ==========================================
            cy += 10;
            const boxPad = 28;
            const boxW = width - 160;
            const startAdviceY = cy;

            let adviceInnerY = startAdviceY + boxPad;
            if (!isMeasure) {
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("💡 คำแนะนำเสริมมงคลจากตำรา :", cx + boxPad, adviceInnerY);
            }
            adviceInnerY += 46;

            cy = adviceInnerY;
            renderWrappedText("ควรหมั่นทำบุญตักบาตร ไหว้พระสวดมนต์ เจริญสมาธิภาวนา และรักษาศีลบริสุทธิ์ เพื่อเสริมพลังบารมีให้หนุนดวงชะตาให้ดียิ่งขึ้นไปตลอดทั้งปี", '#cbd5e1', 26, 40, 'left', cx + boxPad, boxW - (boxPad * 2));
            cy += boxPad;

            const boxH = cy - startAdviceY;
            if (!isMeasure) {
                ctx.strokeStyle = 'rgba(241, 208, 110, 0.4)';
                ctx.lineWidth = 1;
                ctx.fillStyle = 'rgba(30, 46, 78, 0.5)';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(cx, startAdviceY, boxW, boxH, 16);
                    ctx.fill();
                    ctx.stroke();
                }

                // Re-draw text over box
                let redrawAdvY = startAdviceY + boxPad;
                ctx.font = '600 28px "Prompt", sans-serif';
                ctx.fillStyle = '#f1d06e';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText("💡 คำแนะนำเสริมมงคลจากตำรา :", cx + boxPad, redrawAdvY);
                redrawAdvY += 46;
                cy = redrawAdvY;
                renderWrappedText("ควรหมั่นทำบุญตักบาตร ไหว้พระสวดมนต์ เจริญสมาธิภาวนา และรักษาศีลบริสุทธิ์ เพื่อเสริมพลังบารมีให้หนุนดวงชะตาให้ดียิ่งขึ้นไปตลอดทั้งปี", '#cbd5e1', 26, 40, 'left', cx + boxPad, boxW - (boxPad * 2));
                cy = startAdviceY + boxH;
            }

            cy += 50;
            if (!isMeasure) {
                ctx.font = '500 26px "Prompt", sans-serif';
                ctx.fillStyle = 'rgba(241, 208, 110, 0.85)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("🔮 สยามโหรามงคล · ระบบพยากรณ์โหราศาสตร์ไทยชั้นสูง", width/2, cy);
            }
            cy += 70;

            return cy;
        };
        
        let actualHeight = drawContent(true);
        canvas.height = actualHeight;
        drawContent(false);
        
        const link = document.createElement('a');
        link.download = `สยามโหรามงคล_ฉัตร3ชั้น_อายุ${age}_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch(err) {
        console.error("เกิดข้อผิดพลาดในการสร้างภาพ:", err);
        if(typeof Swal !== 'undefined') Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างภาพได้ กรุณาลองใหม่อีกครั้ง', 'error');
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}


