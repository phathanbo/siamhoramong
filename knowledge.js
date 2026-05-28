"use strict";

// ฟังก์ชันโหลดข้อมูลลงตาราง (เรียกใช้ตอนเข้าหน้า Knowledge)
function initKnowledgeTable() {
    const body = document.getElementById("knowledgeBody");
    if (!body) return;

    body.innerHTML = "";
    // ดึงข้อมูลจาก KNOWLEDGE_ARTICLES มาสร้างตาราง
    Object.keys(KNOWLEDGE_ARTICLES).forEach(key => {
        const item = KNOWLEDGE_ARTICLES[key];
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge ${item.badge}">${item.category}</span></td>
            <td class="text-left font-weight-bold">${item.title}</td>
            <td>${item.type}</td>
            <td>${item.level}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-gold" onclick="viewKnowledgeDetail('${key}')"> อ่าน </button>
                    <button class="btn btn-sm btn-outline-gold" onclick="navigateTo('${item.link}')"> ใช้เครื่องมือ </button>
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

// ฟังก์ชันค้นหาความรู้
function searchKnowledge() {
    const input = document.getElementById("knowledgeSearchInput").value.toUpperCase();
    const table = document.getElementById("knowledgeBody");
    const tr = table.getElementsByTagName("tr");
    let count = 0;

    for (let i = 0; i < tr.length; i++) {
        const titleTd = tr[i].getElementsByTagName("td")[1];
        const categoryTd = tr[i].getElementsByTagName("td")[0];
        if (titleTd || categoryTd) {
            const titleText = titleTd.textContent || titleTd.innerText;
            const categoryText = categoryTd.textContent || categoryTd.innerText;
            if (titleText.toUpperCase().indexOf(input) > -1 || categoryText.toUpperCase().indexOf(input) > -1) {
                tr[i].style.display = "";
                count++;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    updateKnowledgeCount(count);
}

// ฟังก์ชันแสดงรายละเอียดบทความ
function viewKnowledgeDetail(key) {
    const item = KNOWLEDGE_ARTICLES[key]; // หยิบข้อมูลตาม Key ที่ส่งมา
    if (!item) return;

    document.getElementById("fullContentArea").innerHTML = item.content;
    document.getElementById("articleAction").innerHTML = `
        <button class="btn btn-gold btn-lg" onclick="navigateTo('${item.link}')">
            เริ่มใช้งานหน้า${item.type}
        </button>
    `;

    navigateTo('articleViewPage');
}

// ฟังก์ชันสำหรับเปลี่ยนหน้าจากปุ่มในบทความ

function updateKnowledgeCount(n) {
    const countEl = document.getElementById("knowledgeCount");
    if (countEl) countEl.innerText = `แสดงทั้งหมด ${n} รายการ`;
}

let currentCategory = 'all';

function filterKnowledge(category) {
    currentCategory = category;
    
    // เปลี่ยนสถานะปุ่ม (Active Class)
    const buttons = document.querySelectorAll('#knowledgeCategoryFilter .btn');
    buttons.forEach(btn => {
        if(btn.innerText === (category === 'all' ? 'ทั้งหมด' : category)) {
            btn.classList.add('active', 'btn-gold');
            btn.classList.remove('btn-outline-gold');
        } else {
            btn.classList.remove('active', 'btn-gold');
            btn.classList.add('btn-outline-gold');
        }
    });

    renderKnowledgeTable();
}

function renderKnowledgeTable() {
    const body = document.getElementById("knowledgeBody");
    const searchTerm = document.getElementById("knowledgeSearchInput").value.toLowerCase();
    if (!body) return;

    body.innerHTML = "";
    let count = 0;

    Object.keys(KNOWLEDGE_ARTICLES).forEach(key => {
        const item = KNOWLEDGE_ARTICLES[key];
        const isCategoryMatch = currentCategory === 'all' || item.category === currentCategory;
        const isSearchMatch = item.title.toLowerCase().includes(searchTerm) || 
                             item.category.toLowerCase().includes(searchTerm);

        if (isCategoryMatch && isSearchMatch) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="badge ${item.badge}">${item.category}</span></td>
                <td class="text-left font-weight-bold">${item.title}</td>
                <td>${item.type}</td>
                <td>${item.level}</td>
                <td>
                    <button class="btn btn-sm btn-gold" onclick="viewKnowledgeDetail('${key}')">อ่าน</button>
                </td>
            `;
            body.appendChild(tr);
            count++;
        }
    });

    document.getElementById("knowledgeCount").innerText = `แสดงทั้งหมด ${count} รายการ`;
}

// แก้ไขฟังก์ชัน search เดิมให้มาเรียก renderKnowledgeTable แทน
function searchKnowledge() {
    renderKnowledgeTable();
}