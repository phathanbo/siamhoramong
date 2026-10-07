"use strict";

/**
 * 📚 KNOWLEDGE UI MANAGER — GRAND ROYAL LIBRARY EDITION
 * ระบบจัดการหอสมุดคัมภีร์มหาโหราศาสตร์ สไตล์ห้องสมุดดิจิทัลพรีเมียม
 */

let currentCategory = 'all';

// แมปไอคอนและสีประจำหมวดหมู่ครบถ้วนทั้ง 11 หมวด
const KNOWLEDGE_CATEGORIES = {
    "ตำราโบราณ": { icon: "fa-scroll", color: "#b45309", bg: "#fef3c7" },
    "ฤกษ์ยาม": { icon: "fa-clock", color: "#1d4ed8", bg: "#dbeafe" },
    "กาลโยค": { icon: "fa-calendar-alt", color: "#047857", bg: "#d1fae5" },
    "เลขศาสตร์": { icon: "fa-calculator", color: "#7c3aed", bg: "#ede9fe" },
    "ทักษาพยากรณ์": { icon: "fa-compass", color: "#c2410c", bg: "#ffedd5" },
    "โหราศาสตร์": { icon: "fa-star", color: "#0f766e", bg: "#ccfbf1" },
    "วิถีสิริมงคล": { icon: "fa-gem", color: "#be185d", bg: "#fce7f3" },
    "ฮวงจุ้ย": { icon: "fa-wind", color: "#0369a1", bg: "#e0f2fe" },
    "หัตถศาสตร์": { icon: "fa-hand-paper", color: "#b91c1c", bg: "#fee2e2" },
    "นรลักษณ์ศาสตร์": { icon: "fa-user-astronaut", color: "#4338ca", bg: "#e0e7ff" },
    "ปฏิทินจันทรคติ": { icon: "fa-moon", color: "#6b21a8", bg: "#f3e8ff" }
};
const KNOWLEDGE_CAT_CONFIG = KNOWLEDGE_CATEGORIES;

// 🏛️ Wikipedia-style Layout Stylesheet Injection
(function injectWikiStyles() {
    if (document.getElementById('wiki-encyclopedia-style')) return;
    const style = document.createElement('style');
    style.id = 'wiki-encyclopedia-style';
    style.innerHTML = `
        /* Wikipedia-Inspired Container & Typography */
        .wiki-container {
            background: #ffffff;
            color: #202122;
            padding: 30px 36px;
            border-radius: 8px;
            border: 1px solid #a2a9b1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Sarabun", "Prompt", sans-serif;
            font-size: 15px;
            line-height: 1.75;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            overflow: hidden;
        }

        /* Wikipedia Portal Header Banner */
        .wiki-portal-box {
            background: #f8f9fa;
            border: 1px solid #a2a9b1;
            border-radius: 6px;
            padding: 20px 24px;
            margin-bottom: 24px;
        }
        .wiki-portal-welcome {
            border-bottom: 1px solid #a2a9b1;
            padding-bottom: 14px;
            margin-bottom: 16px;
        }
        .wiki-portal-welcome h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #000000;
            margin: 0 0 6px 0;
            font-family: 'Sarabun', 'Prompt', serif;
        }
        .wiki-portal-welcome p {
            color: #54595d;
            font-size: 0.95rem;
            margin: 0;
        }

        /* Wikipedia Search Box */
        .wiki-search-wrapper {
            position: relative;
            max-width: 600px;
            margin: 16px auto 0 auto;
        }
        .wiki-search-input {
            width: 100%;
            height: 44px;
            padding: 8px 16px 8px 42px;
            font-size: 15px;
            border: 1px solid #a2a9b1;
            border-radius: 4px;
            background: #ffffff;
            color: #202122;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.08);
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wiki-search-input:focus {
            border-color: #3366cc;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.08), 0 0 0 1px #3366cc;
        }
        .wiki-search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #72777d;
            font-size: 15px;
            pointer-events: none;
        }

        /* Wikipedia Portal Section Headers */
        .wiki-section-header {
            background: #eaecf0;
            border: 1px solid #a2a9b1;
            border-radius: 4px 4px 0 0;
            padding: 10px 16px;
            font-weight: 700;
            font-size: 1.05rem;
            color: #000000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
        }
        .wiki-section-body {
            background: #ffffff;
            border: 1px solid #a2a9b1;
            border-top: none;
            border-radius: 0 0 4px 4px;
            padding: 16px;
            margin-bottom: 24px;
        }

        /* Wikipedia Category Pill Bar */
        .wiki-cat-pill-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #c8ccd1;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .wiki-cat-pill {
            padding: 6px 14px;
            font-size: 13.5px;
            border-radius: 20px;
            border: 1px solid #c8ccd1;
            background: #f8f9fa;
            color: #3366cc;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
            transition: all 0.15s ease-in-out;
        }
        .wiki-cat-pill:hover {
            background: #eaf3ff;
            border-color: #3366cc;
            color: #202122;
        }
        .wiki-cat-pill.active {
            background: #3366cc;
            border-color: #2a4b8d;
            color: #ffffff;
            font-weight: 600;
        }

        /* Wikipedia Article Entry Card */
        .wiki-entry-card {
            background: #ffffff;
            border: 1px solid #c8ccd1;
            border-left: 4px solid #3366cc;
            border-radius: 4px;
            padding: 16px 18px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
            cursor: pointer;
        }
        .wiki-entry-card:hover {
            border-color: #a2a9b1;
            border-left-color: #2a4b8d;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .wiki-entry-title {
            font-size: 1.12rem;
            font-weight: 700;
            color: #3366cc;
            margin-bottom: 8px;
            font-family: 'Sarabun', 'Prompt', serif;
            display: inline-block;
        }
        .wiki-entry-card:hover .wiki-entry-title {
            text-decoration: underline;
        }
        .wiki-entry-meta {
            font-size: 12.5px;
            color: #54595d;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .wiki-entry-snippet {
            font-size: 13.5px;
            color: #202122;
            line-height: 1.6;
            margin-bottom: 14px;
            text-align: justify;
        }
        .wiki-entry-footer {
            border-top: 1px solid #eaecf0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
        }
        
        .wiki-main-body {
            overflow: hidden;
        }

        /* Lead Paragraph */
        .wiki-lead {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 18px;
            color: #202122;
        }
        .wiki-lead strong {
            color: #000000;
        }

        /* Hatnote */
        .wiki-hatnote {
            padding: 8px 14px;
            margin-bottom: 18px;
            font-style: italic;
            background: #f8f9fa;
            border-left: 4px solid #36c;
            border-radius: 4px;
            color: #54595d;
            font-size: 13.5px;
        }

        /* Headings with Wikipedia Border */
        .wiki-heading {
            font-size: 1.5rem;
            font-weight: 700;
            color: #000000;
            border-bottom: 1px solid #a2a9b1;
            padding-bottom: 6px;
            margin-top: 32px;
            margin-bottom: 14px;
            font-family: 'Sarabun', 'Prompt', serif;
        }
        .wiki-subheading {
            font-size: 1.2rem;
            font-weight: 700;
            color: #202122;
            margin-top: 22px;
            margin-bottom: 10px;
        }

        /* Wikipedia Infobox (Right Sidebar) */
        .wiki-infobox {
            float: right;
            clear: right;
            margin: 0 0 18px 24px;
            width: 320px;
            max-width: 100%;
            border: 1px solid #a2a9b1;
            background-color: #f8f9fa;
            color: #202122;
            padding: 5px;
            font-size: 13.5px;
            line-height: 1.5;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .wiki-infobox-header {
            background-color: #eaecf0;
            text-align: center;
            padding: 8px 10px;
            border-radius: 3px;
            border: 1px solid #c8ccd1;
            margin-bottom: 8px;
        }
        .wiki-infobox-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #000000;
        }
        .wiki-infobox-subtitle {
            font-size: 0.82rem;
            color: #54595d;
            font-style: italic;
        }
        .wiki-infobox-image-box {
            text-align: center;
            padding: 12px 6px;
            background: #ffffff;
            border: 1px solid #c8ccd1;
            border-radius: 3px;
            margin-bottom: 8px;
        }
        .wiki-infobox-caption {
            font-size: 0.8rem;
            color: #54595d;
            margin-top: 6px;
            line-height: 1.4;
        }
        .wiki-infobox-table {
            width: 100%;
            border-collapse: collapse;
        }
        .wiki-infobox-table th {
            text-align: left;
            vertical-align: top;
            padding: 6px 8px;
            width: 38%;
            font-weight: 700;
            color: #202122;
            border-bottom: 1px solid #eaecf0;
            font-size: 13px;
        }
        .wiki-infobox-table td {
            padding: 6px 8px;
            border-bottom: 1px solid #eaecf0;
            color: #333333;
            font-size: 13px;
        }

        /* Table of Contents (TOC) */
        .wiki-toc {
            border: 1px solid #a2a9b1;
            background-color: #f8f9fa;
            padding: 12px 18px;
            display: inline-block;
            min-width: 260px;
            margin: 14px 0 24px 0;
            border-radius: 4px;
        }
        .wiki-toc-title {
            font-weight: 700;
            text-align: center;
            margin-bottom: 8px;
            color: #000000;
            font-size: 14px;
        }
        .wiki-toc ol {
            margin: 0;
            padding-left: 20px;
            font-size: 13.5px;
            line-height: 1.7;
        }
        .wiki-toc ol ol {
            padding-left: 18px;
        }

        /* Wikipedia Tables */
        .wiki-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
            color: #202122;
            border: 1px solid #a2a9b1;
            font-size: 13.5px;
            margin: 12px 0 18px 0;
        }
        .wiki-table th {
            background-color: #eaecf0;
            text-align: center;
            padding: 8px 12px;
            font-weight: 700;
            border: 1px solid #a2a9b1;
            color: #000000;
        }
        .wiki-table td {
            padding: 8px 12px;
            border: 1px solid #a2a9b1;
            vertical-align: middle;
        }
        .wiki-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        /* Quotes & Notes */
        .wiki-quote {
            border-left: 4px solid #eaecf0;
            padding: 10px 18px;
            margin: 14px 0;
            background-color: #f8f9fa;
            font-style: italic;
            color: #444;
            font-size: 14px;
        }
        .wiki-references {
            font-size: 13px;
            color: #54595d;
            line-height: 1.6;
        }
        .wiki-references ol {
            padding-left: 20px;
        }

        /* Wiki Links */
        .wiki-link {
            color: #3366cc !important;
            text-decoration: none !important;
            cursor: pointer;
        }
        .wiki-link:hover {
            text-decoration: underline !important;
            color: #447ff5 !important;
        }

        /* Article Rich Content styling when inside wiki */
        .wiki-container .article-rich-content {
            color: #202122;
        }
        .wiki-container h4, .wiki-container h5, .wiki-container h6 {
            color: #000000 !important;
            font-weight: 700;
        }
        .wiki-container h5.text-gold, .wiki-container h5 {
            font-size: 1.35rem;
            border-bottom: 1px solid #a2a9b1;
            padding-bottom: 6px;
            margin-top: 26px;
            margin-bottom: 12px;
            font-family: 'Sarabun', 'Prompt', serif;
        }
        .wiki-container h6.text-gold-light, .wiki-container h6 {
            font-size: 1.1rem;
            margin-top: 18px;
            margin-bottom: 8px;
            color: #1a1a1a !important;
        }
        .wiki-container .bg-black-25, 
        .wiki-container .bg-dark {
            background-color: #f8f9fa !important;
            border: 1px solid #c8ccd1 !important;
            color: #202122 !important;
        }
        .wiki-container .text-white-50, 
        .wiki-container .text-muted,
        .wiki-container small {
            color: #54595d !important;
        }
        .wiki-container b, .wiki-container strong {
            color: #111827;
        }
        .wiki-container .text-gold, 
        .wiki-container .text-info,
        .wiki-container .text-warning {
            color: #0b5394 !important;
        }
        .wiki-container .border-left-gold,
        .wiki-container .border-left-info {
            border-left: 4px solid #36c !important;
        }
        .wiki-container .border-left-danger {
            border-left: 4px solid #d33 !important;
        }
        .wiki-container .table,
        .wiki-container .table-dark {
            background-color: #ffffff !important;
            color: #202122 !important;
            border: 1px solid #a2a9b1 !important;
            font-size: 13.5px;
        }
        .wiki-container .table th,
        .wiki-container .table-dark th {
            background-color: #eaecf0 !important;
            color: #000000 !important;
            border: 1px solid #a2a9b1 !important;
        }
        .wiki-container .table td,
        .wiki-container .table-dark td {
            background-color: #ffffff !important;
            color: #202122 !important;
            border: 1px solid #a2a9b1 !important;
        }
        .wiki-container .table tr:nth-child(even) td {
            background-color: #f8f9fa !important;
        }
        .wiki-container .alert-gold,
        .wiki-container .alert {
            background-color: #fdfbf7 !important;
            border: 1px solid #e2d9c2 !important;
            border-left: 5px solid #d4af37 !important;
            color: #333333 !important;
        }

        @media (max-width: 768px) {
            .wiki-infobox {
                float: none;
                width: 100%;
                margin: 0 0 18px 0;
            }
            .wiki-container {
                padding: 18px 16px;
            }
        }
    `;
    document.head.appendChild(style);
})();

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
    
    // เปลี่ยนสถานะปุ่มใน Wikipedia Category Pill Bar
    const pills = document.querySelectorAll('#knowledgeCategoryFilter .wiki-cat-pill, #knowledgeCategoryFilter .know-tab-btn');
    pills.forEach(btn => {
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
            ? '<i class="fas fa-book-reader mr-2"></i> คัมภีร์และบทความสารานุกรมทั้งหมด' 
            : `<i class="fas fa-bookmark mr-2"></i> สารานุกรมหมวดหมู่: ${category}`;
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
            const catConf = KNOWLEDGE_CAT_CONFIG[item.category] || { icon: "fa-book", color: "#3366cc", bg: "#f0f4ff" };
            const snippet = extractSnippet(item.content);

            const cardCol = document.createElement("div");
            cardCol.className = "col-12 col-md-6 col-lg-4 mb-3";

            cardCol.innerHTML = `
                <div class="wiki-entry-card" onclick="viewKnowledgeDetail('${key}')">
                    <div>
                        <!-- Category & ID Badge -->
                        <div class="wiki-entry-meta">
                            <span class="badge" style="background:${catConf.bg}; color:${catConf.color}; border:1px solid ${catConf.color}44; border-radius:4px; font-weight:600; font-size:12px; padding:4px 8px;">
                                <i class="fas ${catConf.icon} mr-1"></i> ${item.category}
                            </span>
                            <span class="badge badge-light" style="border:1px solid #c8ccd1; color:#54595d; font-size:11.5px; border-radius:4px; padding:4px 7px;">
                                ${item.id}
                            </span>
                            <span style="font-size:11.5px; color:#72777d; margin-left:auto;">
                                <i class="fas fa-layer-group mr-1"></i> ${item.level}
                            </span>
                        </div>

                        <!-- Article Title -->
                        <div class="wiki-entry-title">
                            ${item.title}
                        </div>

                        <!-- Type Tag -->
                        <div class="mb-2">
                            <span style="display:inline-block; font-size:12px; color:#54595d; background:#f8f9fa; border:1px solid #eaecf0; border-radius:3px; padding:1px 6px;">
                                <i class="fas fa-tag mr-1" style="color:#72777d;"></i> ${item.type}
                            </span>
                        </div>

                        <!-- Content Snippet -->
                        <p class="wiki-entry-snippet">
                            ${snippet}
                        </p>
                    </div>

                    <!-- Footer Action -->
                    <div class="wiki-entry-footer">
                        <span class="wiki-link" style="font-weight:600; font-size:13px;">
                            อ่านบทความฉบับเต็ม <i class="fas fa-external-link-alt ml-1" style="font-size:11px;"></i>
                        </span>
                        <span style="color:#72777d; font-size:12px;">
                            สารานุกรมมหาโหรา
                        </span>
                    </div>
                </div>
            `;
            gridContainer.appendChild(cardCol);
            count++;
        }
    });

    const countEl = document.getElementById("knowledgeCount");
    if (countEl) {
        countEl.innerText = `แสดง ${count} บทความ`;
    }

    if (count === 0) {
        gridContainer.innerHTML = `
            <div class="col-12 text-center py-5" style="background:#ffffff; border:1px solid #a2a9b1; border-radius:6px; margin: 10px 0;">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 style="color:#202122; font-weight:700;">ไม่พบบทความหรือคัมภีร์ที่ตรงกับคำค้นหา</h5>
                <p style="color:#54595d; font-size:14px;">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อสำรวจสารานุกรม</p>
                <button class="btn btn-sm btn-outline-primary mt-2 px-4" onclick="document.getElementById('knowledgeSearchInput').value=''; searchKnowledge();">
                    <i class="fas fa-redo mr-1"></i> ล้างการค้นหาทั้งหมด
                </button>
            </div>
        `;
    }
}

// ฟังก์ชันแสดงรายละเอียดบทความ (Grand Library Wikipedia Reading View)
function viewKnowledgeDetail(key) {
    if (typeof KNOWLEDGE_ARTICLES === 'undefined') return;
    const item = KNOWLEDGE_ARTICLES[key];
    if (!item) return;

    const fullArea = document.getElementById("fullContentArea");
    if (fullArea) {
        // ตรวจสอบว่าบทความนี้มีโครงสร้าง wiki-container หรือยัง
        let renderedContent = item.content;
        const isCustomWiki = renderedContent && renderedContent.includes('wiki-container');

        if (!isCustomWiki) {
            // สร้าง Wikipedia Layout แบบไดนามิกอัตโนมัติสำหรับทุกบทความในหอสมุด
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = renderedContent;
            
            // ดึงหัวข้อทั้งหมดเพื่อสร้าง Table of Contents (TOC)
            const headings = tempDiv.querySelectorAll("h4, h5, h6");
            let tocListHtml = "";
            let sectionCount = 1;

            headings.forEach((h, idx) => {
                const titleText = h.textContent.trim().replace(/^[●•\s]+/, '');
                const anchorId = `wiki-section-${idx + 1}`;
                h.id = anchorId;
                h.classList.add("wiki-heading");
                tocListHtml += `<li><a href="#${anchorId}" class="wiki-link" onclick="document.getElementById('${anchorId}')?.scrollIntoView({behavior: 'smooth'}); return false;">${titleText}</a></li>`;
                sectionCount++;
            });

            // ดึงย่อหน้าแรกเป็น Lead Paragraph
            const firstP = tempDiv.querySelector("p");
            let leadText = "";
            if (firstP) {
                leadText = firstP.innerHTML;
                firstP.remove(); // นำออกจากตำแหน่งเดิมเพื่อนำมาวางในตำแหน่ง Lead
            } else {
                leadText = `<b>${item.title.replace(/^[^\w\sก-๙]+/, '').trim()}</b> เป็นหนึ่งในศาสตร์หลักแห่งคลังคัมภีร์มหาโหราศาสตร์ไทย ในหมวดหมู่ ${item.category}`;
            }

            // สัญลักษณ์ประจำหมวด
            const catMeta = KNOWLEDGE_CATEGORIES[item.category] || { icon: "fa-book-open", color: "#F1D06E" };

            // ประกอบเป็นโครงสร้าง Wikipedia สารานุกรมสมบูรณ์แบบ
            renderedContent = `
                <div class="wiki-container">
                    <!-- Wikipedia Infobox -->
                    <aside class="wiki-infobox">
                        <div class="wiki-infobox-header">
                            <div class="wiki-infobox-title">${item.title}</div>
                            <div class="wiki-infobox-subtitle">สารานุกรมมหาโหราศาสตร์ไทย</div>
                        </div>
                        <div class="wiki-infobox-image-box">
                            <div style="font-size: 2.5rem; color: #b45309;"><i class="fas ${catMeta.icon}"></i></div>
                            <div class="wiki-infobox-caption">คัมภีร์หมวด${item.category} (รหัส: ${item.id})</div>
                        </div>
                        <table class="wiki-infobox-table">
                            <tr><th>หมวดหมู่วิชา</th><td>${item.category}</td></tr>
                            <tr><th>ประเภทศาสตร์</th><td>${item.type}</td></tr>
                            <tr><th>ระดับการศึกษา</th><td>${item.level}</td></tr>
                            <tr><th>รหัสอ้างอิง</th><td>${item.id}</td></tr>
                            <tr><th>ระบบคำนวณ</th><td>สยามโหรามงคล มาตรฐาน</td></tr>
                            <tr><th>สถานะตำรา</th><td><span style="color:#15803d; font-weight:600;"><i class="fas fa-check-circle mr-1"></i>ตรวจสอบชำระแล้ว</span></td></tr>
                        </table>
                    </aside>

                    <div class="wiki-main-body">
                        <!-- Hatnote -->
                        <div class="wiki-hatnote">
                            <i class="fas fa-info-circle mr-1"></i> บทความนี้เป็นส่วนหนึ่งของ <b>หอสมุดมหาโหราศาสตร์</b> ชำระและจัดหมวดหมู่ตามคัมภีร์โหราศาสตร์ไทยโบราณ
                        </div>

                        <!-- Lead Paragraph -->
                        <p class="wiki-lead">
                            ${leadText}
                        </p>

                        ${headings.length > 0 ? `
                        <!-- Table of Contents -->
                        <div class="wiki-toc">
                            <div class="wiki-toc-title"><i class="fas fa-list-ul mr-2"></i>สารบัญเนื้อหา</div>
                            <ol>
                                ${tocListHtml}
                            </ol>
                        </div>
                        ` : ''}

                        <!-- Main Body Content -->
                        <div class="wiki-sections-content">
                            ${tempDiv.innerHTML}
                        </div>

                        <!-- References & Verification -->
                        <div class="wiki-references mt-5 pt-3" style="border-top: 1px solid #a2a9b1;">
                            <h6 style="color:#000000; font-weight:700;"><i class="fas fa-bookmark mr-2"></i>แหล่งข้อมูลและบรรณานุกรม</h6>
                            <ol>
                                <li>หอสมุดมหาโหราศาสตร์ไทย สยามโหรามงคล, <i>สารัตถคัมภีร์และพระเวทโบราณ</i>, หมวด ${item.category}, รหัส ${item.id}.</li>
                                <li>ระบบการคำนวณตำแหน่งดวงดาวและเกณฑ์พยากรณ์, สถาบันโหราศาสตร์ไทยมาตรฐาน.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            `;
        }

        fullArea.innerHTML = `
            <div class="library-article-header text-center mb-4 pb-3">
                <div class="mb-2">
                    <span class="badge px-3 py-1 mr-2" style="background:rgba(241,208,110,0.2); color:#FFF0A8; border:1px solid rgba(241,208,110,0.4); border-radius:20px; font-size:0.85rem;">
                        <i class="fas fa-landmark mr-1"></i> หอสมุดมหาโหราศาสตร์
                    </span>
                    <span class="badge px-3 py-1 mr-2" style="background:rgba(59,130,246,0.2); color:#93C5FD; border:1px solid rgba(59,130,246,0.4); border-radius:20px; font-size:0.85rem;">
                        ${item.category}
                    </span>
                    <span class="badge px-3 py-1" style="background:rgba(159,122,234,0.2); color:#D8B4FE; border:1px solid rgba(159,122,234,0.4); border-radius:20px; font-size:0.85rem;">
                        รหัส: ${item.id}
                    </span>
                </div>
                <h1 style="font-size: 2.2rem; font-weight: 700; background: linear-gradient(135deg, #FFFFFF 0%, #FFF3B0 40%, #F1D06E 80%, #C99727 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 4px 20px rgba(241,208,110,0.3); margin-bottom: 6px;">
                    ${item.title}
                </h1>
                <p class="text-muted small m-0">สารานุกรมคัมภีร์มหาโหราศาสตร์ไทย • สยามโหรามงคล</p>
            </div>
            <div class="library-article-body">
                ${renderedContent}
            </div>
        `;
    }

    const actionArea = document.getElementById("articleAction");
    if (actionArea) {
        actionArea.innerHTML = `
            <div class="d-flex justify-content-center flex-wrap gap-3" style="gap:15px;">
                <button class="btn btn-outline-gold px-4 py-3" onclick="navigateTo('knowledgePage')" style="border-radius: 50px; font-weight:600;">
                    <i class="fas fa-arrow-left mr-2"></i> กลับสู่หอสมุดมหาโหราศาสตร์
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