"use strict";

// Pagination state
let dashboardPageSize = 10;
let dashboardCurrentPage = 0;

// Filter state
let dashboardSelectedGender = null;
let dashboardSelectedAgeGroup = null;

// 📊 ฟังก์ชันวิเคราะห์ข้อมูลสมาชิก
function getAdminStatistics() {
    const allHistory = JSON.parse(localStorage.getItem("horo_history")) || [];
    
    const stats = {
        total: allHistory.length,
        byGender: { male: 0, female: 0, unknown: 0 },
        byAgeGroup: { teen: 0, adult: 0, senior: 0, unknown: 0 },
        members: allHistory
    };

    const now = new Date();

    allHistory.forEach(member => {
        // เพศ
        if (member.gender === "male" || member.gender === "m") stats.byGender.male++;
        else if (member.gender === "female" || member.gender === "f") stats.byGender.female++;
        else stats.byGender.unknown++;

        // อายุ
        if (member.birthdate) {
            try {
                const [day, month, year] = member.birthdate.split("/");
                let birthYear = parseInt(year);
                birthYear = toCE(birthYear);
                
                const age = now.getFullYear() - birthYear;
                
                if (age < 20) stats.byAgeGroup.teen++;
                else if (age < 60) stats.byAgeGroup.adult++;
                else stats.byAgeGroup.senior++;
            } catch (e) {
                stats.byAgeGroup.unknown++;
            }
        } else {
            stats.byAgeGroup.unknown++;
        }
    });

    return stats;
}

// 📈 สร้าง HTML Dashboard
function renderAdminDashboard() {
    const stats = getAdminStatistics();
    const container = document.getElementById("adminDashboardContainer");
    
    if (!container) return;

    const genderPercent = stats.total > 0 ? {
        male: ((stats.byGender.male / stats.total) * 100).toFixed(1),
        female: ((stats.byGender.female / stats.total) * 100).toFixed(1)
    } : { male: 0, female: 0 };

    const agePercent = stats.total > 0 ? {
        teen: ((stats.byAgeGroup.teen / stats.total) * 100).toFixed(1),
        adult: ((stats.byAgeGroup.adult / stats.total) * 100).toFixed(1),
        senior: ((stats.byAgeGroup.senior / stats.total) * 100).toFixed(1)
    } : { teen: 0, adult: 0, senior: 0 };

    const html = `
        <div class="admin-dashboard">
            <div class="dashboard-header">
                <h1>📊 แดชบอร์ดผู้ดูแลระบบ</h1>
                <p class="subtitle">สรุปข้อมูลสมาชิกทั้งระบบ</p>
            </div>

            <!-- ระบบหลังบ้าน (Admin) -->
            <div class="section-title mt-4" style="text-align: left; margin-bottom: 15px;">⚙️ ระบบหลังบ้าน (Admin)</div>
            <div class="dashboard-tools" style="display: grid; grid-template-columns: 1fr; margin-bottom: 30px;">
                <button class="btn btn-gold shadow" onclick="window.location.href='admin.html'" style="font-size: 1.2rem; padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 15px; border: none;">
                    <i class="fas fa-cogs" style="font-size: 2rem;"></i> 
                    <span style="font-weight: bold;">ไปยังระบบจัดการหลังบ้าน (Admin Dashboard) ➡️</span>
                </button>
            </div>


            <!-- หลัก KPI -->
            <div class="stats-grid">
                <div class="stat-card total">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>สมาชิกทั้งหมด</h3>
                        <p class="stat-number">${stats.total}</p>
                        <small>ราย</small>
                    </div>
                </div>
            </div>

            <!-- สถิติเพศ -->
            <div class="section-title">👨👩 สถิติตามเพศ (คลิกเพื่อกรอง)</div>
            <div class="stats-row">
                <div class="stat-card gender male" onclick="filterByGender('male')" style="cursor: pointer; opacity: ${dashboardSelectedGender === 'male' ? 1 : dashboardSelectedGender ? 0.5 : 1}; transition: opacity 0.3s;">
                    <div class="stat-icon">👨</div>
                    <div class="stat-content">
                        <h4>ชาย</h4>
                        <p class="stat-number">${stats.byGender.male}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${genderPercent.male}%;"></div>
                        </div>
                        <small>${genderPercent.male}%</small>
                    </div>
                </div>

                <div class="stat-card gender female" onclick="filterByGender('female')" style="cursor: pointer; opacity: ${dashboardSelectedGender === 'female' ? 1 : dashboardSelectedGender ? 0.5 : 1}; transition: opacity 0.3s;">
                    <div class="stat-icon">👩</div>
                    <div class="stat-content">
                        <h4>หญิง</h4>
                        <p class="stat-number">${stats.byGender.female}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${genderPercent.female}%;"></div>
                        </div>
                        <small>${genderPercent.female}%</small>
                    </div>
                </div>
            </div>

            <!-- สถิติช่วงอายุ -->
            <div class="section-title">📅 สถิติตามช่วงอายุ (คลิกเพื่อกรอง)</div>
            <div class="stats-row">
                <div class="stat-card age teen" onclick="filterByAgeGroup('teen')" style="cursor: pointer; opacity: ${dashboardSelectedAgeGroup === 'teen' ? 1 : dashboardSelectedAgeGroup ? 0.5 : 1}; transition: opacity 0.3s;">
                    <div class="stat-icon">🎓</div>
                    <div class="stat-content">
                        <h4>วัยรุ่น (< 20)</h4>
                        <p class="stat-number">${stats.byAgeGroup.teen}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${agePercent.teen}%;"></div>
                        </div>
                        <small>${agePercent.teen}%</small>
                    </div>
                </div>

                <div class="stat-card age adult" onclick="filterByAgeGroup('adult')" style="cursor: pointer; opacity: ${dashboardSelectedAgeGroup === 'adult' ? 1 : dashboardSelectedAgeGroup ? 0.5 : 1}; transition: opacity 0.3s;">
                    <div class="stat-icon">💼</div>
                    <div class="stat-content">
                        <h4>ผู้ใหญ่ (20-60)</h4>
                        <p class="stat-number">${stats.byAgeGroup.adult}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${agePercent.adult}%;"></div>
                        </div>
                        <small>${agePercent.adult}%</small>
                    </div>
                </div>

                <div class="stat-card age senior" onclick="filterByAgeGroup('senior')" style="cursor: pointer; opacity: ${dashboardSelectedAgeGroup === 'senior' ? 1 : dashboardSelectedAgeGroup ? 0.5 : 1}; transition: opacity 0.3s;">
                    <div class="stat-icon">🧓</div>
                    <div class="stat-content">
                        <h4>สูงอายุ (60+)</h4>
                        <p class="stat-number">${stats.byAgeGroup.senior}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${agePercent.senior}%;"></div>
                        </div>
                        <small>${agePercent.senior}%</small>
                    </div>
                </div>
            </div>

            <!-- ตารางสมาชิก -->
            <div class="section-title">📋 รายชื่อสมาชิก</div>
            <div class="table-controls">
                <input type="text" id="dashboardSearchInput" placeholder="🔍 ค้นหาชื่อ..." class="search-input" onkeyup="filterDashboardTable()">
                <select id="dashboardPageSize" class="search-input" onchange="setDashboardPageSize(this.value)" style="width: auto; flex: 0; padding: 10px;">
                    <option value="10">10 แถว</option>
                    <option value="50">50 แถว</option>
                    <option value="100">100 แถว</option>
                    <option value="all">ทั้งหมด</option>
                </select>
                <button class="btn-export" onclick="exportTableToCSV()">📥 ส่งออก CSV</button>
            </div>
            <div class="table-container">
                <table class="members-table">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รหัสสมาชิก</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>เพศ</th>
                            <th>วันเกิด</th>
                            <th>อายุ</th>
                            <th>ปีนักษัตร</th>
                            <th>วันที่เพิ่ม</th>
                            <th>ระดับ</th>
                            <th>สถานะ</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody id="dashboardTableBody" style="color: #333;">
                        ${renderTableRows(stats.members)}
                    </tbody>
                </table>
            </div>

            <!-- ตรวจสอบการชำระเงิน (Payments) -->
            <div class="section-title" style="margin-top: 30px;">💰 ตรวจสอบการชำระเงิน (Pending Payments)</div>
            <div class="table-container">
                <table class="members-table">
                    <thead>
                        <tr>
                            <th>เวลาที่แจ้ง</th>
                            <th>บัญชีผู้ใช้ (Username)</th>
                            <th>แพ็กเกจ</th>
                            <th>ยอดโอน</th>
                            <th>สถานะ</th>
                            <th>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody id="dashboardPaymentsBody" style="color: #333;">
                        <tr><td colspan="6" style="text-align: center; padding: 20px;">กำลังโหลดข้อมูล...</td></tr>
                    </tbody>
                </table>
            </div>

            

            <!-- ปุ่มกลับ -->
            <div class="dashboard-footer" style="margin-top: 30px;">
                <button class="btn-back" onclick="navigateTo('mainpage')">← กลับหน้าหลัก</button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Load Payments
    if (typeof loadAdminDashboardPayments === 'function') {
        loadAdminDashboardPayments();
    }
}

// 🔄 ตัวแสดงแถวตาราง
function renderTableRows(members) {
    const now = new Date();

    // ใช้ filter ถ้ามี
    let filteredMembers = members;
    if (dashboardSelectedGender || dashboardSelectedAgeGroup) {
        filteredMembers = members.filter(member => {
            let matchGender = !dashboardSelectedGender;
            let matchAge = !dashboardSelectedAgeGroup;

            // เช็คเพศ
            if (dashboardSelectedGender) {
                const isMale = member.gender === "male" || member.gender === "m";
                const isFemale = member.gender === "female" || member.gender === "f";
                matchGender = (dashboardSelectedGender === "male" && isMale) || (dashboardSelectedGender === "female" && isFemale);
            }

            // เช็คอายุ
            if (dashboardSelectedAgeGroup) {
                let age = 0;
                if (member.birthdate) {
                    try {
                        const [day, month, year] = member.birthdate.split("/");
                        let birthYear = parseInt(year);
                        birthYear = toCE(birthYear);
                        age = now.getFullYear() - birthYear;
                    } catch (e) {}
                }
                const isTeen = age < 20;
                const isAdult = age >= 20 && age < 60;
                const isSenior = age >= 60;
                matchAge = (dashboardSelectedAgeGroup === "teen" && isTeen) ||
                           (dashboardSelectedAgeGroup === "adult" && isAdult) ||
                           (dashboardSelectedAgeGroup === "senior" && isSenior);
            }

            return matchGender && matchAge;
        });
    }

    // คำนวณ pagination
    const totalMembers = filteredMembers.length;
    const start = dashboardCurrentPage * dashboardPageSize;
    const end = dashboardPageSize === "all" ? totalMembers : start + parseInt(dashboardPageSize);
    const paginatedMembers = filteredMembers.slice(start, end);

    return paginatedMembers.map((member, idx) => {
        let age = "ไม่ระบุ";
        if (member.birthdate) {
            try {
                const [day, month, year] = member.birthdate.split("/");
                let birthYear = parseInt(year);
                birthYear = toCE(birthYear);
                age = now.getFullYear() - birthYear;
            } catch (e) {}
        }

        const genderText = (member.gender === "male" || member.gender === "m") ? "ชาย" : (member.gender === "female" || member.gender === "f") ? "หญิง" : "-";
        let createdDate = "-";
        if (member.memberId && member.memberId.length >= 8) {
            const dateStr = member.memberId.substring(0, 8);
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6));
            const day = parseInt(dateStr.substring(6, 8));
            const monthNames = ['', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
            createdDate = `${day} ${monthNames[month] || ''} ${year}`;
        }

        const tierDisplay = member.tier || "ทดลองใช้";
        const statusDisplay = member.status === "banned" ? "🚫 แบน" : member.status === "deactivated" ? "🔒 ปิดบัญชี" : "✅ ปกติ";
        const statusClass = member.status === "banned" ? "status-banned" : member.status === "deactivated" ? "status-deactivated" : "status-active";

        const esc = (v) => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
        const safeId = esc(member.memberId || member.id || member.username);
        const safeMemberId = esc(member.memberId);

        return `
            <tr>
                <td>${start + idx + 1}</td>
                <td>${esc(member.memberId) || "-"}</td>
                <td><a href="javascript:void(0)" onclick="viewMemberFromDashboard('${safeId}')" style="color: #007bff; text-decoration: none; cursor: pointer;">${esc(member.name)} ${esc(member.lastName)}</a></td>
                <td>${genderText}</td>
                <td>${esc(member.birthdate) || "-"}</td>
                <td>${age}</td>
                <td>${esc(member.zodiac) || "-"}</td>
                <td>${createdDate}</td>
                <td>${esc(tierDisplay)}</td>
                <td><span class="${statusClass}">${statusDisplay}</span></td>
                <td>
                    <button class="btn-action" onclick="showMemberActionMenu('${safeMemberId}', event)" style="padding: 5px 10px; cursor: pointer;">⋮</button>
                </td>
            </tr>
        `;
    }).join("");
}

// 🔍 กรองตาราง
function filterDashboardTable() {
    const input = document.getElementById("dashboardSearchInput");
    const filter = (input ? input.value : "").toUpperCase();

    const stats = getAdminStatistics();
    const filtered = stats.members.filter(member => {
        const fullText = `${member.name}${member.lastName || ""}${member.memberId || ""}`.toUpperCase();
        return fullText.includes(filter);
    });

    dashboardCurrentPage = 0;
    const tbody = document.getElementById("dashboardTableBody");
    if (tbody) {
        tbody.innerHTML = renderTableRows(filtered);
    }
}

// 👨 กรองตามเพศ
function filterByGender(gender) {
    if (dashboardSelectedGender === gender) {
        dashboardSelectedGender = null;
    } else {
        dashboardSelectedGender = gender;
    }
    dashboardCurrentPage = 0;
    renderAdminDashboard();
}

// 📅 กรองตามช่วงอายุ
function filterByAgeGroup(ageGroup) {
    if (dashboardSelectedAgeGroup === ageGroup) {
        dashboardSelectedAgeGroup = null;
    } else {
        dashboardSelectedAgeGroup = ageGroup;
    }
    dashboardCurrentPage = 0;
    renderAdminDashboard();
}

// ⚙️ เปลี่ยนจำนวนแถวต่อหน้า
function setDashboardPageSize(size) {
    dashboardPageSize = size;
    dashboardCurrentPage = 0;

    const stats = getAdminStatistics();
    const input = document.getElementById("dashboardSearchInput");
    const filter = (input ? input.value : "").toUpperCase();

    let members = stats.members;
    if (filter) {
        members = members.filter(member => {
            const fullText = `${member.name}${member.lastName || ""}${member.memberId || ""}`.toUpperCase();
            return fullText.includes(filter);
        });
    }

    const tbody = document.getElementById("dashboardTableBody");
    if (tbody) {
        tbody.innerHTML = renderTableRows(members);
    }
}

// 📥 ส่งออก CSV
function exportTableToCSV() {
    const stats = getAdminStatistics();
    let csv = "ลำดับ,รหัสสมาชิก,ชื่อ-นามสกุล,เพศ,วันเกิด,ปีนักษัตร,วันที่เพิ่ม\n";
    
    const now = new Date();
    stats.members.forEach((member, idx) => {
        const genderText = (member.gender === "male" || member.gender === "m") ? "ชาย" : (member.gender === "female" || member.gender === "f") ? "หญิง" : "-";
        let createdDate = "-";
        if (member.memberId && member.memberId.length >= 8) {
            const dateStr = member.memberId.substring(0, 8); // ตัด 2 ตัวท้าย
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6));
            const day = parseInt(dateStr.substring(6, 8));
            const monthNames = ['', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
            createdDate = `${day} ${monthNames[month] || ''} ${year}`;
        }
        csv += `"${idx + 1}","${member.memberId || "-"}","${member.name} ${member.lastName || ""}","${genderText}","${member.birthdate || "-"}","${member.zodiac || "-"}","${createdDate}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `สมาชิก_${new Date().toLocaleDateString('th-TH')}.csv`;
    link.click();
}

// 👤 ไปยังโปรไฟล์จาก Dashboard
function viewMemberFromDashboard(memberId) {
    if (typeof viewMemberProfile === "function") {
        viewMemberProfile(memberId);
    } else {
        console.warn("⚠️ viewMemberProfile function not found");
    }
}

// 📋 แสดง Action Menu
function showMemberActionMenu(memberId, event) {
    event.stopPropagation();

    // ลบ menu เก่า ถ้ามี
    const oldMenu = document.querySelector('.member-action-menu');
    if (oldMenu) oldMenu.remove();

    const stats = getAdminStatistics();
    const member = stats.members.find(m => m.memberId === memberId);
    if (!member) return;

    const menu = document.createElement('div');
    menu.className = 'member-action-menu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        min-width: 180px;
    `;

    menu.innerHTML = `
        <div style="padding: 8px 0;">
            <button onclick="openEditMemberModal('${memberId}'); document.querySelector('.member-action-menu').remove();" style="display: block; width: 100%; text-align: left; padding: 10px 15px; border: none; background: none; cursor: pointer; font-size: 14px;">📋 เปลี่ยนระดับ</button>
            <button onclick="toggleMemberBan('${memberId}'); document.querySelector('.member-action-menu').remove();" style="display: block; width: 100%; text-align: left; padding: 10px 15px; border: none; background: none; cursor: pointer; font-size: 14px;">🚫 ${member.status === 'banned' ? 'เปิดแบน' : 'แบน'}</button>
            <button onclick="toggleMemberDeactivate('${memberId}'); document.querySelector('.member-action-menu').remove();" style="display: block; width: 100%; text-align: left; padding: 10px 15px; border: none; background: none; cursor: pointer; font-size: 14px;">🔒 ${member.status === 'deactivated' ? 'เปิดบัญชี' : 'ปิดบัญชี'}</button>
            <button onclick="deleteMember('${memberId}'); document.querySelector('.member-action-menu').remove();" style="display: block; width: 100%; text-align: left; padding: 10px 15px; border: none; background: none; cursor: pointer; font-size: 14px; color: red;">🗑️ ลบ</button>
        </div>
    `;

    document.body.appendChild(menu);

    const rect = event.target.getBoundingClientRect();
    menu.style.left = Math.min(rect.left, window.innerWidth - 200) + 'px';
    menu.style.top = (rect.bottom + 5) + 'px';

    // ปิด menu เมื่อ click นอก
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            if (document.querySelector('.member-action-menu')) {
                document.querySelector('.member-action-menu').remove();
            }
            document.removeEventListener('click', closeMenu);
        });
    }, 50);
}

// ✏️ เปิด Modal แก้ไข Tier
function openEditMemberModal(memberId) {
    const stats = getAdminStatistics();
    const member = stats.members.find(m => m.memberId === memberId);
    if (!member) return;

    const packages = ["ทดลองใช้", "ธรรมดา", "ทองแดง", "เงิน", "ทองคำ", "ทองคำขาว", "ไข่มุก", "ทับทิม", "ไพฑูรย์", "มรกต", "เพชร", "มงกุฎ"];

    let optionsHTML = packages.map(pkg => `<option value="${pkg}" ${member.tier === pkg ? 'selected' : ''}>${pkg}</option>`).join('');

    const modal = document.createElement('div');
    modal.id = 'editMemberModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 8px; width: 400px;">
            <h3>เปลี่ยนระดับสมาชิก</h3>
            <p><strong>${member.name} ${member.lastName || ""}</strong></p>
            <label style="display: block; margin: 15px 0;">ระดับ:</label>
            <select id="tierSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${optionsHTML}
            </select>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="saveMemberTier('${memberId}')" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">บันทึก</button>
                <button onclick="document.getElementById('editMemberModal').remove()" style="flex: 1; padding: 10px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">ยกเลิก</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 💾 บันทึก Tier
function saveMemberTier(memberId) {
    const tierSelect = document.getElementById('tierSelect');
    if (!tierSelect) return;

    const stats = getAdminStatistics();
    const member = stats.members.find(m => m.memberId === memberId);
    if (!member) return;

    member.tier = tierSelect.value;
    localStorage.setItem('horo_history', JSON.stringify(stats.members));

    // ปิด modal
    const modal = document.getElementById('editMemberModal');
    if (modal) modal.remove();

    renderAdminDashboard();
    Swal.fire('สำเร็จ', 'เปลี่ยนระดับสำเร็จ', 'success');
}

// 🚫 แบน/เปิดแบน
function toggleMemberBan(memberId) {
    const stats = getAdminStatistics();
    const member = stats.members.find(m => m.memberId === memberId);
    if (!member) return;

    if (member.status === 'banned') {
        member.status = 'active';
        Swal.fire('สำเร็จ', 'เปิดแบนสำเร็จ', 'success');
    } else {
        member.status = 'banned';
        Swal.fire('สำเร็จ', 'แบนสมาชิกสำเร็จ', 'success');
    }

    localStorage.setItem('horo_history', JSON.stringify(stats.members));
    renderAdminDashboard();
}

// 🔒 ปิด/เปิดบัญชี
function toggleMemberDeactivate(memberId) {
    const stats = getAdminStatistics();
    const member = stats.members.find(m => m.memberId === memberId);
    if (!member) return;

    if (member.status === 'deactivated') {
        member.status = 'active';
        Swal.fire('สำเร็จ', 'เปิดบัญชีสำเร็จ', 'success');
    } else {
        member.status = 'deactivated';
        Swal.fire('สำเร็จ', 'ปิดบัญชีสำเร็จ', 'success');
    }

    localStorage.setItem('horo_history', JSON.stringify(stats.members));
    renderAdminDashboard();
}

// 🗑️ ลบสมาชิก
function deleteMember(memberId) {
    if (!confirm('⚠️ คุณแน่ใจไหม? การลบไม่สามารถย้อนกลับได้')) return;

    const stats = getAdminStatistics();
    const filtered = stats.members.filter(m => m.memberId !== memberId);
    localStorage.setItem('horo_history', JSON.stringify(filtered));

    renderAdminDashboard();
    Swal.fire('สำเร็จ', 'ลบสมาชิกสำเร็จ', 'success');
}

// 🎯 เปิด Dashboard
function openAdminDashboard() {
    if (typeof navigateTo === "function") {
        navigateTo("adminDashboard");
    }
}

window.openAdminDashboard = openAdminDashboard;
window.filterDashboardTable = filterDashboardTable;
window.filterByGender = filterByGender;
window.filterByAgeGroup = filterByAgeGroup;
window.setDashboardPageSize = setDashboardPageSize;
window.exportTableToCSV = exportTableToCSV;
window.getAdminStatistics = getAdminStatistics;
window.viewMemberFromDashboard = viewMemberFromDashboard;
window.openWeeklyFortuneModal = function() {
    if(typeof openWeeklyFortuneModal_impl === 'function') openWeeklyFortuneModal_impl();
    else Swal.fire('Error', 'ไม่พบสคริปต์สำหรับสร้างรูปภาพ', 'error');
};
window.showMemberActionMenu = showMemberActionMenu;
window.openEditMemberModal = openEditMemberModal;
window.saveMemberTier = saveMemberTier;
window.toggleMemberBan = toggleMemberBan;
window.toggleMemberDeactivate = toggleMemberDeactivate;
window.deleteMember = deleteMember;

// ==========================================
// ฟังก์ชันจัดการ Payment Approval (Firestore)
// ==========================================
let unsubscribePayments = null;

async function loadAdminDashboardPayments() {
    const tbody = document.getElementById('dashboardPaymentsBody');
    if (!tbody || !window.firebaseDb) {
        if(tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</td></tr>`;
        return;
    }

    try {
        const { collection, query, where, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const paymentsRef = collection(window.firebaseDb, "payments");
        const q = query(paymentsRef, where("status", "==", "pending"));

        if (unsubscribePayments) {
            unsubscribePayments();
        }

        unsubscribePayments = onSnapshot(q, (snapshot) => {
            const tableBody = document.getElementById('dashboardPaymentsBody');
            if (!tableBody) return;

            tableBody.innerHTML = '';
            
            if (snapshot.empty) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: green; padding: 20px;">ไม่มีสลิปโอนเงินที่รอการตรวจสอบ 🎉</td></tr>';
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const tr = document.createElement('tr');
                
                let timeStr = "ไม่ระบุ";
                if (data.timestamp) {
                    const d = new Date(data.timestamp);
                    timeStr = `${d.toLocaleDateString('th-TH')} ${d.toLocaleTimeString('th-TH')}`;
                }

                tr.innerHTML = `
                    <td>${timeStr}</td>
                    <td style="font-weight: bold; color: #d4af37;">${data.username || '-'}</td>
                    <td><span style="background:#17a2b8; color:white; padding:3px 8px; border-radius:12px; font-size:12px;">${data.package || '-'}</span></td>
                    <td style="color: green; font-weight: bold;">฿${data.price || '0'}</td>
                    <td><span style="background:#ffc107; color:#333; padding:3px 8px; border-radius:12px; font-size:12px;">รอตรวจสอบ</span></td>
                    <td>
                        <button style="background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;" onclick="approveDashboardPayment('${doc.id}', '${data.username}', '${data.package}')">
                            ✓ อนุมัติ
                        </button>
                        <button style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="rejectDashboardPayment('${doc.id}')">
                            ✕ ปฏิเสธ
                        </button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }, (error) => {
            console.error("Error loading payments: ", error);
            const tableBody = document.getElementById('dashboardPaymentsBody');
            if(tableBody) tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>`;
        });
    } catch (error) {
        console.error("Error setting up payments listener:", error);
    }
}

window.approveDashboardPayment = async function(paymentId, username, pkgName) {
    try {
        const confirmResult = await Swal.fire({
            title: 'ยืนยันการอนุมัติ?',
            text: `อัปเกรดให้ ${username} เป็นแพ็กเกจ ${pkgName} หรือไม่?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'ใช่, อนุมัติเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (!confirmResult.isConfirmed) return;

        Swal.fire({ title: 'กำลังประมวลผล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const { doc, updateDoc, collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        
        // 1. อัปเดตสถานะบิล
        const paymentRef = doc(window.firebaseDb, "payments", paymentId);
        await updateDoc(paymentRef, {
            status: 'approved',
            approvedAt: new Date().toISOString()
        });

        // 2. อัปเดต Role ผู้ใช้งานใน registered_users
        const usersRef = collection(window.firebaseDb, "registered_users");
        const q = query(usersRef, where("username", "==", username));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await updateDoc(doc(window.firebaseDb, "registered_users", userDoc.id), {
                role: pkgName
            });
        } else {
            const gUsersRef = collection(window.firebaseDb, "users");
            const gq = query(gUsersRef, where("email", "==", username));
            const gSnapshot = await getDocs(gq);
            if (!gSnapshot.empty) {
                await updateDoc(doc(window.firebaseDb, "users", gSnapshot.docs[0].id), {
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

window.rejectDashboardPayment = async function(paymentId) {
    try {
        const confirmResult = await Swal.fire({
            title: 'ปฏิเสธรายการนี้?',
            text: 'คุณต้องการปฏิเสธบิลนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'ใช่, ปฏิเสธ',
            cancelButtonText: 'ยกเลิก'
        });

        if (!confirmResult.isConfirmed) return;

        const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        
        const paymentRef = doc(window.firebaseDb, "payments", paymentId);
        await updateDoc(paymentRef, {
            status: 'rejected',
            rejectedAt: new Date().toISOString()
        });

        Swal.fire('ปฏิเสธสำเร็จ', 'เปลี่ยนสถานะบิลเป็นปฏิเสธแล้ว', 'success');
    } catch (error) {
        console.error(error);
        Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
    }
};

window.loadAdminDashboardPayments = loadAdminDashboardPayments;

// Close modals on Esc key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const vipModal = document.getElementById('vipReportModal');
        if (vipModal) vipModal.remove();
        const contentModal = document.getElementById('contentGenModal');
        if (contentModal) contentModal.remove();
        const editMemberModal = document.getElementById('editMemberModal');
        if (editMemberModal) editMemberModal.remove();
        const paymentModal = document.getElementById('paymentModalOverlay');
        if (paymentModal) paymentModal.style.display = 'none';
        const shareModal = document.getElementById('shareModal');
        if (shareModal) shareModal.style.display = 'none';
    }
});
