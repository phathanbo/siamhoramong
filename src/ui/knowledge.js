"use strict";

/**
 * 📚 KNOWLEDGE UI MANAGER — GRAND ROYAL LIBRARY EDITION
 * ระบบจัดการหอสมุดคัมภีร์มหาโหราศาสตร์ สไตล์ห้องสมุดดิจิทัลพรีเมียม
 */

let currentCategory = 'all';

// แมปไอคอนและสีประจำหมวดหมู่
const KNOWLEDGE_CAT_CONFIG = {
    "ตำราโบราณ": { icon: "fa-scroll", color: "#F1D06E", bg: "rgba(241,208,110,0.15)" },
    "โหราศาสตร์": { icon: "fa-star", color: "#38B2AC", bg: "rgba(56,178,172,0.15)" },
    "วิถีสิริมงคล": { icon: "fa-gem", color: "#9F7AEA", bg: "rgba(159,122,234,0.15)" },
    "วิเคราะห์ลักษณะ": { icon: "fa-user-astronaut", color: "#F687B3", bg: "rgba(246,135,179,0.15)" }
};

// สกัดข้อความตัวอย่าง 120 ตัวอักษรจากเนื้อหา HTML
function extractSnippet(htmlContent) {
    if (!htmlContent) return "คำอธิบายเนื้อหาและเคล็ดวิชาความรู้ตามตำรา...";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const cleanText = text.replace(/\s+/g, ' ').trim();
    return cleanText.length > 125 ? cleanText.substring(0, 125) + "..." : cleanText;
}

// ฟังก์ชันโหลดข้อมูลเข้าสู่หอสมุด (เรียกใช้ตอนเข้าหน้า Knowledge)
function initKnowledgeTable() {
    renderKnowledgeLibrary();
}

function filterKnowledge(category) {
    currentCategory = category;
    
    // เปลี่ยนสถานะปุ่มใน Segmented Tab Bar
    const buttons = document.querySelectorAll('#knowledgeCategoryFilter .know-tab-btn');
    buttons.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        if (cat === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // อัปเดตหัวข้อหมวดหมู่
    const titleEl = document.getElementById("knowledgeCategoryTitle");
    if (titleEl) {
        titleEl.innerHTML = category === 'all' 
            ? '<i class="fas fa-book-reader mr-2"></i> คัมภีร์และบทความทั้งหมด' 
            : `<i class="fas fa-bookmark mr-2"></i> หมวดหมู่: ${category}`;
    }

    renderKnowledgeLibrary();
}

function searchKnowledge() {
    renderKnowledgeLibrary();
}

function renderKnowledgeLibrary() {
    const gridContainer = document.getElementById("knowledgeGridContainer");
    const searchInput = document.getElementById("knowledgeSearchInput");
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    
    if (!gridContainer || typeof KNOWLEDGE_ARTICLES === 'undefined') return;

    gridContainer.innerHTML = "";
    let count = 0;

    Object.keys(KNOWLEDGE_ARTICLES).forEach((key, index) => {
        const item = KNOWLEDGE_ARTICLES[key];
        const isCategoryMatch = currentCategory === 'all' || item.category === currentCategory;
        const isSearchMatch = !searchTerm || 
            item.title.toLowerCase().includes(searchTerm) || 
            item.category.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            item.level.toLowerCase().includes(searchTerm);

        if (isCategoryMatch && isSearchMatch) {
            const catConf = KNOWLEDGE_CAT_CONFIG[item.category] || { icon: "fa-book", color: "#F1D06E", bg: "rgba(241,208,110,0.15)" };
            const snippet = extractSnippet(item.content);

            const cardCol = document.createElement("div");
            cardCol.className = "col-12 col-md-6 col-lg-4 mb-4";
            cardCol.style.animation = `fadeIn 0.4s ease ${index * 0.04}s both`;

            cardCol.innerHTML = `
                <div class="library-book-card h-100 d-flex flex-column justify-content-between p-4" 
                     onclick="viewKnowledgeDetail('${key}')"
                     style="
                        background: linear-gradient(135deg, rgba(30, 46, 78, 0.75) 0%, rgba(18, 28, 50, 0.85) 100%);
                        border: 1px solid rgba(241, 208, 110, 0.3);
                        border-radius: 20px;
                        box-shadow: 0 12px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
                        backdrop-filter: blur(20px);
                        cursor: pointer;
                        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        overflow: hidden;
                     "
                     onmouseover="this.style.transform='translateY(-6px) scale(1.02)'; this.style.borderColor='rgba(255,243,176,0.7)'; this.style.boxShadow='0 20px 45px rgba(0,0,0,0.5), 0 0 25px rgba(241,208,110,0.25)';"
                     onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.borderColor='rgba(241,208,110,0.3)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)';"
                >
                    <!-- Top Category & Level Bar -->
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge px-3 py-2" style="background:${catConf.bg}; color:${catConf.color}; border:1px solid ${catConf.color}66; border-radius:20px; font-weight:600; font-size:0.8rem;">
                                <i class="fas ${catConf.icon} mr-1"></i> ${item.category}
                            </span>
                            <span class="small text-white-50" style="font-size:0.78rem;">
                                <i class="fas fa-layer-group mr-1"></i> ${item.level}
                            </span>
                        </div>

                        <!-- Book Title -->
                        <h5 class="font-weight-bold mb-2" style="color: #FFF0A8; font-size: 1.15rem; line-height: 1.4; letter-spacing: 0.3px;">
                            ${item.title}
                        </h5>

                        <!-- Type Tag -->
                        <div class="mb-3">
                            <span style="display:inline-block; font-size:0.8rem; color:#93C5FD; background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:2px 10px;">
                                <i class="fas fa-tag mr-1" style="font-size:0.7rem;"></i> ${item.type}
                            </span>
                        </div>

                        <!-- Snippet Preview -->
                        <p style="color: #CBD5E1; font-size: 0.9rem; line-height: 1.6; text-align: justify; margin-bottom: 20px;">
                            ${snippet}
                        </p>
                    </div>

                    <!-- Footer Action -->
                    <div class="pt-3 d-flex justify-content-between align-items-center" style="border-top: 1px dashed rgba(241,208,110,0.25);">
                        <span class="text-gold font-weight-bold" style="font-size:0.85rem;">
                            <i class="fas fa-book-open mr-1"></i> เปิดอ่านคัมภีร์
                        </span>
                        <div style="width:36px; height:36px; border-radius:50%; background:rgba(241,208,110,0.15); border:1px solid rgba(241,208,110,0.4); display:flex; align-items:center; justify-content:center; color:#F1D06E; transition:0.3s;">
                            <i class="fas fa-arrow-right" style="font-size:0.85rem;"></i>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.appendChild(cardCol);
            count++;
        }
    });

    const countEl = document.getElementById("knowledgeCount");
    if (countEl) {
        countEl.innerText = `แสดง ${count} รายการ`;
    }

    if (count === 0) {
        gridContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-white-50">ไม่พบคัมภีร์หรือบทความที่ตรงกับคำค้นหา</h5>
                <button class="btn btn-sm btn-outline-gold mt-3 px-4" onclick="document.getElementById('knowledgeSearchInput').value=''; searchKnowledge();">
                    ล้างการค้นหา
                </button>
            </div>
        `;
    }
}

// ฟังก์ชันแสดงรายละเอียดบทความ (Grand Library Reading View)
function viewKnowledgeDetail(key) {
    if (typeof KNOWLEDGE_ARTICLES === 'undefined') return;
    const item = KNOWLEDGE_ARTICLES[key];
    if (!item) return;

    const fullArea = document.getElementById("fullContentArea");
    if (fullArea) {
        fullArea.innerHTML = `
            <div class="library-article-header text-center mb-5 pb-4" style="border-bottom: 1px solid rgba(241,208,110,0.35);">
                <div class="mb-3">
                    <span class="badge px-3 py-2 mr-2" style="background:rgba(241,208,110,0.2); color:#FFF0A8; border:1px solid rgba(241,208,110,0.4); border-radius:20px; font-size:0.85rem;">
                        ${item.category}
                    </span>
                    <span class="badge px-3 py-2 mr-2" style="background:rgba(59,130,246,0.2); color:#93C5FD; border:1px solid rgba(59,130,246,0.4); border-radius:20px; font-size:0.85rem;">
                        ${item.type}
                    </span>
                    <span class="badge px-3 py-2" style="background:rgba(159,122,234,0.2); color:#D8B4FE; border:1px solid rgba(159,122,234,0.4); border-radius:20px; font-size:0.85rem;">
                        ระดับ: ${item.level}
                    </span>
                </div>
                <h1 style="font-size: 2.2rem; font-weight: 700; background: linear-gradient(135deg, #FFFFFF 0%, #FFF3B0 40%, #F1D06E 80%, #C99727 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 4px 20px rgba(241,208,110,0.3); margin-bottom: 15px;">
                    ${item.title}
                </h1>
                <p class="text-muted small m-0">คลังคัมภีร์มหาโหราศาสตร์ไทย • สยามโหรามงคล</p>
            </div>
            <div class="library-article-body" style="font-size: 1.1rem; line-height: 1.9; color: #F3F4F6;">
                ${item.content}
            </div>
        `;
    }

    const actionArea = document.getElementById("articleAction");
    if (actionArea) {
        actionArea.innerHTML = `
            <div class="d-flex justify-content-center flex-wrap gap-3" style="gap:15px;">
                <button class="btn btn-outline-gold px-4 py-3" onclick="navigateTo('knowledgePage')" style="border-radius: 50px; font-weight:600;">
                    <i class="fas fa-arrow-left mr-2"></i> กลับสู่หอสมุด
                </button>
                <button class="btn btn-gold btn-lg px-5 py-3 shadow-lg" onclick="navigateTo('${item.link}')" style="border-radius: 50px; font-weight:700;">
                    <i class="fas fa-magic mr-2"></i> เปิดเครื่องมือ${item.type}
                </button>
            </div>
        `;
    }

    navigateTo('articleViewPage');
}

// Global Export
window.initKnowledgeTable = initKnowledgeTable;
window.filterKnowledge = filterKnowledge;
window.searchKnowledge = searchKnowledge;
window.viewKnowledgeDetail = viewKnowledgeDetail;