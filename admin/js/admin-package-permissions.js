/**
 * Admin Package Permissions Controller
 * Siam Horamongkol - จัดการสิทธิ์แพ็กเกจสมาชิกอย่างง่ายดาย (Quick Filter + Bulk Actions + Single Package View)
 */

window.PackagePermissionsAdmin = (function() {
    let currentViewMode = 'matrix'; // 'matrix' | 'single'
    let selectedSinglePkgIndex = 0;
    let selectedCategory = 'all';
    let searchQuery = '';

    function init() {
        renderToolbar();
        bindEvents();
        // Hook into table rebuild if needed
        const origBuildTableInternal = window.buildTableInternal;
        if (typeof origBuildTableInternal === 'function') {
            window.buildTableInternal = function() {
                origBuildTableInternal();
                applyMatrixFilters();
                if (currentViewMode === 'single') {
                    renderSinglePackageView();
                }
            };
        }
    }

    function renderToolbar() {
        const mountEl = document.getElementById('permissionControlsMount');
        if (!mountEl) return;

        // Categories extraction from APP_MENU
        const categories = ['all'];
        if (typeof APP_MENU !== 'undefined') {
            APP_MENU.forEach(m => {
                if (m.category && !categories.includes(m.category)) {
                    categories.push(m.category);
                }
            });
        }

        const allMenusForCount = typeof APP_MENU !== 'undefined' ? APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin')) : [];
        const pkgOptions = (typeof packages !== 'undefined' ? packages : []).map((p, idx) => {
            const priceStr = typeof p.m === 'number' ? `฿${p.m.toLocaleString()}/ด.` : p.m;
            let cnt = 0;
            allMenusForCount.forEach((m, mIdx) => {
                let isAllowed = window.packagePermissions && window.packagePermissions[p.name] && window.packagePermissions[p.name][m.id] !== undefined
                    ? window.packagePermissions[p.name][m.id]
                    : checkPermissionDefault(p.name, mIdx, m.id);
                if (isAllowed) cnt++;
            });
            return `<option value="${idx}">ระดับที่ ${idx + 1}: ${p.name} (${cnt} ระบบ - ${priceStr})</option>`;
        }).join('');

        mountEl.innerHTML = `
            <div class="admin-box" style="margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.08); background: #0f1527; padding: 8px 14px; border-radius: 8px;">
                <!-- TOP ROW: MODE TOGGLE & QUICK ACTIONS -->
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-1 mb-2" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div class="d-flex align-items-center gap-2">
                        <span style="font-weight: 600; color: #94a3b8; font-size: 0.82rem;">
                            มุมมอง:
                        </span>
                        <div class="mode-toggle-group">
                            <button type="button" id="btnModeMatrix" class="mode-toggle-btn ${currentViewMode === 'matrix' ? 'active' : ''}">
                                <i class="fas fa-table mr-1"></i> ตารางเปรียบเทียบ (16 ระดับ)
                            </button>
                            <button type="button" id="btnModeSingle" class="mode-toggle-btn ${currentViewMode === 'single' ? 'active' : ''}">
                                <i class="fas fa-sliders-h mr-1"></i> จัดการรายแพ็กเกจ
                            </button>
                        </div>
                    </div>

                    <!-- Single Package Selector (Visible when in Single mode) -->
                    <div id="singlePackageSelectorWrap" style="display: ${currentViewMode === 'single' ? 'flex' : 'none'}; align-items: center; gap: 8px;">
                        <span style="color: #cbd5e1; font-weight: 500; font-size: 0.82rem;">
                            แพ็กเกจ:
                        </span>
                        <select id="singlePkgSelect" class="form-select text-white font-weight-bold" style="background: #182038; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 4px 10px; font-size: 0.84rem; min-width: 220px; cursor: pointer;">
                            ${pkgOptions}
                        </select>
                    </div>

                    <!-- Stats summary badge -->
                    <div class="d-none d-md-flex align-items-center gap-2" id="permissionStatsBadge">
                        <span style="font-size: 0.76rem; background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 20px; padding: 3px 10px;">
                            <i class="fas fa-shield-alt mr-1"></i> Cascade Auto-Save Active
                        </span>
                    </div>
                </div>

                <!-- FILTER ROW: SEARCH & CATEGORY TABS -->
                <div class="row g-2 align-items-center">
                    <!-- Search Input -->
                    <div class="col-12 col-md-5">
                        <div style="position: relative;">
                            <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 0.85rem;"></i>
                            <input type="text" id="menuSearchInput" placeholder="ค้นหาเมนูพยากรณ์ เช่น ฤกษ์, ชง, สมพงษ์, ดาวจร..." 
                                   style="width: 100%; padding: 7px 32px 7px 34px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.84rem; outline: none;"
                                   onfocus="this.style.borderColor='#ffd700'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                            <button type="button" id="clearSearchBtn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; display: none; font-size: 0.8rem;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Category Pills -->
                    <div class="col-12 col-md-7">
                        <div class="d-flex flex-wrap gap-1" id="categoryTabsContainer" style="overflow-x: auto; padding-bottom: 2px;">
                            ${categories.map(cat => {
                                const isAll = cat === 'all';
                                const label = isAll ? 'ทั้งหมด' : cat;
                                return `
                                    <button type="button" class="btn-category-tab ${cat === selectedCategory ? 'active' : ''}" data-cat="${cat}"
                                            style="padding: 4px 10px; font-size: 0.76rem; border-radius: 16px; border: 1px solid ${cat === selectedCategory ? '#ffd700' : 'rgba(255,255,255,0.08)'}; background: ${cat === selectedCategory ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)'}; color: ${cat === selectedCategory ? '#ffd700' : '#94a3b8'}; cursor: pointer; transition: all 0.2s; white-space: nowrap;">
                                        ${label}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- QUICK BULK CONTROLS -->
                <div id="bulkControlsRow" class="mt-2 pt-2" style="border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div style="font-size: 0.78rem; color: #94a3b8;">
                        <span id="filteredItemsCount">กำลังแสดงรายการพยากรณ์...</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span style="font-size: 0.76rem; color: #64748b;">จัดการด่วน:</span>
                        <button type="button" class="btn btn-sm btn-outline-success py-1 px-2" id="btnBulkAllowCurrent" style="font-size: 0.75rem; border-radius: 6px;">
                            <i class="fas fa-check mr-1"></i> เปิดสิทธิ์ที่แสดง
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger py-1 px-2" id="btnBulkDenyCurrent" style="font-size: 0.75rem; border-radius: 6px;">
                            <i class="fas fa-times mr-1"></i> ปิดสิทธิ์ที่แสดง
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary py-1 px-2" id="btnResetToDefaults" style="font-size: 0.75rem; border-radius: 6px;">
                            <i class="fas fa-undo mr-1"></i> ค่าเริ่มต้น
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function bindEvents() {
        // Mode switch
        document.getElementById('btnModeMatrix')?.addEventListener('click', () => switchMode('matrix'));
        document.getElementById('btnModeSingle')?.addEventListener('click', () => switchMode('single'));

        // Single package select
        document.getElementById('singlePkgSelect')?.addEventListener('change', (e) => {
            selectedSinglePkgIndex = parseInt(e.target.value, 10) || 0;
            renderSinglePackageView();
        });

        // Search input
        const searchInput = document.getElementById('menuSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = (e.target.value || '').trim().toLowerCase();
                if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
                applyFilters();
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                clearBtn.style.display = 'none';
                applyFilters();
            });
        }

        // Category pills click
        document.querySelectorAll('.btn-category-tab').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.btn-category-tab').forEach(b => {
                    b.style.borderColor = 'rgba(255,255,255,0.12)';
                    b.style.background = 'rgba(255,255,255,0.04)';
                    b.style.color = '#cbd5e1';
                });
                this.style.borderColor = '#ffd700';
                this.style.background = 'rgba(212,175,55,0.22)';
                this.style.color = '#ffd700';
                selectedCategory = this.getAttribute('data-cat');
                applyFilters();
            });
        });

        // Bulk Actions
        document.getElementById('btnBulkAllowCurrent')?.addEventListener('click', () => handleBulkPermission(true));
        document.getElementById('btnBulkDenyCurrent')?.addEventListener('click', () => handleBulkPermission(false));
        document.getElementById('btnResetToDefaults')?.addEventListener('click', handleResetDefaults);
    }

    function switchMode(mode) {
        currentViewMode = mode;
        const matrixEl = document.querySelector('.table-container');
        const singleEl = document.getElementById('singlePackageContainer');
        const singleSelectorWrap = document.getElementById('singlePackageSelectorWrap');
        const btnMatrix = document.getElementById('btnModeMatrix');
        const btnSingle = document.getElementById('btnModeSingle');

        if (mode === 'matrix') {
            if (matrixEl) matrixEl.style.display = 'block';
            if (singleEl) singleEl.style.display = 'none';
            if (singleSelectorWrap) singleSelectorWrap.style.display = 'none';
            btnMatrix?.classList.add('active');
            btnSingle?.classList.remove('active');
            applyMatrixFilters();
        } else {
            if (matrixEl) matrixEl.style.display = 'none';
            if (singleEl) singleEl.style.display = 'block';
            if (singleSelectorWrap) singleSelectorWrap.style.display = 'flex';
            btnSingle?.classList.add('active');
            btnMatrix?.classList.remove('active');
            renderSinglePackageView();
        }
    }

    function getFilteredMenus() {
        if (typeof APP_MENU !== 'undefined') {
            return APP_MENU.filter(m => {
                if (m.id === 'package' || m.id.toLowerCase().includes('admin')) return false;
                
                // Category filter
                if (selectedCategory !== 'all' && m.category !== selectedCategory) {
                    return false;
                }

                // Search filter
                if (searchQuery) {
                    const cleanTitle = (m.title || '').replace(/<[^>]*>?/gm, ' ').toLowerCase();
                    const desc = (m.desc || '').toLowerCase();
                    const id = (m.id || '').toLowerCase();
                    if (!cleanTitle.includes(searchQuery) && !desc.includes(searchQuery) && !id.includes(searchQuery)) {
                        return false;
                    }
                }
                return true;
            });
        }
        return [];
    }

    function applyFilters() {
        if (currentViewMode === 'matrix') {
            applyMatrixFilters();
        } else {
            renderSinglePackageView();
        }
    }

    function applyMatrixFilters() {
        const body = document.getElementById('serviceBody');
        if (!body) return;

        const filtered = getFilteredMenus();
        const filteredIds = new Set(filtered.map(m => m.id));
        let visibleCount = 0;

        const rows = body.querySelectorAll('tr');
        rows.forEach(tr => {
            const firstTd = tr.querySelector('.status-cell');
            if (firstTd && firstTd.id) {
                const parts = firstTd.id.split('_');
                const menuId = parts.slice(1, -1).join('_');
                if (filteredIds.has(menuId)) {
                    tr.style.display = '';
                    visibleCount++;
                } else {
                    tr.style.display = 'none';
                }
            }
        });

        updateFilteredCountText(visibleCount);
    }

    function renderSinglePackageView() {
        const container = document.getElementById('singlePackageContainer');
        if (!container) return;

        const targetPkg = packages[selectedSinglePkgIndex];
        if (!targetPkg) return;

        const priceText = typeof targetPkg.m === 'number' ? `฿${targetPkg.m.toLocaleString()}/ด.` : targetPkg.m;

        const filtered = getFilteredMenus();
        updateFilteredCountText(filtered.length);

        const groups = {};
        filtered.forEach(m => {
            const cat = m.category || 'หมวดหมู่ทั่วไป';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(m);
        });

        const allMenusForCount = typeof APP_MENU !== 'undefined' ? APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin')) : [];
        let allowedTotalCount = 0;
        allMenusForCount.forEach(m => {
            let isAllowed = window.packagePermissions && window.packagePermissions[targetPkg.name] && window.packagePermissions[targetPkg.name][m.id] !== undefined
                ? window.packagePermissions[targetPkg.name][m.id]
                : checkPermissionDefault(targetPkg.name, getMenuDepthIndex(m.id));
            if (isAllowed) allowedTotalCount++;
        });

        let html = `
            <!-- ACTIVE PACKAGE BANNER -->
            <div class="admin-box mb-3" style="background: linear-gradient(135deg, rgba(20, 26, 48, 0.95) 0%, rgba(13, 18, 34, 0.95) 100%); border: 1px solid rgba(212,175,55,0.4); padding: 14px 20px; border-radius: 14px;">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-3">
                        <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; color: #ffd700;">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div>
                            <div class="d-flex align-items-center gap-2 flex-wrap">
                                <span style="font-size: 0.76rem; color: #94a3b8; text-transform: uppercase;">ระดับที่ ${selectedSinglePkgIndex + 1}</span>
                                <h4 style="margin: 0; color: #fff; font-size: 1.15rem; font-weight: 700;">
                                    <span style="color: #ffd700;">${targetPkg.name}</span>
                                </h4>
                                <span style="font-size: 0.8rem; color: #34d399; font-weight: 600; margin-left: 4px;">(${priceText})</span>
                                <span class="badge" style="background: rgba(99, 102, 241, 0.25); border: 1px solid rgba(99, 102, 241, 0.5); color: #a5b4fc; font-size: 0.75rem; padding: 4px 8px; border-radius: 12px; margin-left: 6px;">
                                    <i class="fas fa-cubes mr-1"></i> ได้สิทธิ์ใช้งาน ${allowedTotalCount} / ${allMenusForCount.length} ระบบ
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <button type="button" class="btn btn-sm btn-outline-success py-1 px-3" onclick="PackagePermissionsAdmin.toggleAllInSinglePkg(true)" style="border-radius: 6px; font-size: 0.78rem; font-weight: 500;">
                            <i class="fas fa-check mr-1"></i> เปิดสิทธิ์ทั้งหมด
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger py-1 px-3" onclick="PackagePermissionsAdmin.toggleAllInSinglePkg(false)" style="border-radius: 6px; font-size: 0.78rem; font-weight: 500;">
                            <i class="fas fa-times mr-1"></i> ปิดสิทธิ์ทั้งหมด
                        </button>
                        ${selectedSinglePkgIndex > 0 ? `
                        <button type="button" class="btn btn-sm btn-outline-info py-1 px-3" onclick="PackagePermissionsAdmin.copyFromPreviousPkg()" style="border-radius: 6px; font-size: 0.78rem;">
                            <i class="fas fa-copy mr-1"></i> คัดลอกจาก [${packages[selectedSinglePkgIndex - 1].name}]
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        if (Object.keys(groups).length === 0) {
            html += `
                <div class="text-center py-5 admin-box text-white-50">
                    <i class="fas fa-search mb-3" style="font-size: 2.5rem; color: #ffd700; opacity: 0.5;"></i>
                    <h5>ไม่พบรายการพยากรณ์ที่ตรงกับคำค้นหา</h5>
                    <p style="font-size: 0.9rem;">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูครับ</p>
                </div>
            `;
            container.innerHTML = html;
            return;
        }

        Object.keys(groups).forEach(catName => {
            const catMenus = groups[catName];
            html += `
                <div class="admin-box mb-3" style="background: #0f1527; border: 1px solid rgba(255,255,255,0.06); padding: 16px 20px; border-radius: 14px;">
                    <div class="d-flex justify-content-between align-items-center mb-2 pb-2" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div class="d-flex align-items-center gap-2">
                            <span style="font-size: 0.95rem; font-weight: 600; color: #f1f5f9;">
                                ${catName}
                            </span>
                            <span style="font-size: 0.72rem; color: #64748b; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 12px;">${catMenus.length}</span>
                        </div>
                        <div class="d-flex gap-1">
                            <button type="button" class="btn btn-sm btn-outline-success py-0 px-2" style="font-size: 0.72rem; border-radius: 4px;"
                                    onclick="PackagePermissionsAdmin.toggleCategoryInSinglePkg('${catName}', true)">
                                เปิดทั้งหมด
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" style="font-size: 0.72rem; border-radius: 4px;"
                                    onclick="PackagePermissionsAdmin.toggleCategoryInSinglePkg('${catName}', false)">
                                ปิดทั้งหมด
                            </button>
                        </div>
                    </div>

                    <div class="row g-2">
                        ${catMenus.map(m => {
                            let isAllowed = window.packagePermissions && window.packagePermissions[targetPkg.name] && window.packagePermissions[targetPkg.name][m.id] !== undefined
                                ? window.packagePermissions[targetPkg.name][m.id]
                                : checkPermissionDefault(targetPkg.name, getMenuDepthIndex(m.id));

                            const cleanTitle = (m.title || '').replace(/<[^>]*>?/gm, ' ');
                            const iconClass = m.icon ? (m.icon.includes('fa-') && !m.icon.includes('fa ') && !m.icon.includes('fas') ? `fas ${m.icon}` : m.icon) : 'fas fa-star';

                            return `
                                <div class="col-12 col-md-6 col-lg-4">
                                    <div class="p-2 h-100 d-flex justify-content-between align-items-center"
                                         id="card_${m.id}_${selectedSinglePkgIndex}"
                                         style="background: ${isAllowed ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)'}; border: 1px solid ${isAllowed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)'}; border-radius: 10px; transition: all 0.15s ease;">
                                        <div class="d-flex align-items-center gap-2" style="max-width: 80%; min-width: 0;">
                                            <div style="font-size: 1.05rem; color: ${isAllowed ? '#10b981' : '#64748b'}; width: 24px; text-align: center; flex-shrink: 0;">
                                                <i class="${iconClass}"></i>
                                            </div>
                                            <div style="min-width: 0;">
                                                <div style="font-weight: 500; color: ${isAllowed ? '#fff' : '#94a3b8'}; font-size: 0.85rem; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                    ${cleanTitle}
                                                </div>
                                                <small style="color: #64748b; font-size: 0.72rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                                                    ${m.desc || ''}
                                                </small>
                                            </div>
                                        </div>

                                        <div style="flex-shrink: 0; margin-left: 8px;">
                                            <label class="switch-sm" title="${isAllowed ? 'คลิกเพื่อปิดสิทธิ์' : 'คลิกเพื่อเปิดสิทธิ์'}">
                                                <input type="checkbox" ${isAllowed ? 'checked' : ''} onchange="PackagePermissionsAdmin.toggleSingleItem('${targetPkg.name}', '${m.id}', ${selectedSinglePkgIndex})">
                                                <span class="slider-sm"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function updateFilteredCountText(count) {
        const el = document.getElementById('filteredItemsCount');
        if (el) {
            el.innerHTML = `พบ <strong>${count}</strong> รายการพยากรณ์ ${searchQuery ? `(ค้นหา: "${searchQuery}")` : ''} ${selectedCategory !== 'all' ? `(หมวด: ${selectedCategory})` : ''}`;
        }
    }

    async function toggleSingleItem(pkgName, menuId, pIndex) {
        const menuIdx = getMenuDepthIndex(menuId);
        await togglePermission(pkgName, menuId, `td_${menuId}_${pIndex}`, menuIdx, pIndex);
        renderSinglePackageView();
        if (typeof buildTableInternal === 'function') {
            buildTableInternal();
        }
    }

    async function toggleAllInSinglePkg(newState) {
        const targetPkg = packages[selectedSinglePkgIndex];
        if (!targetPkg) return;

        const confirm = await showConfirmModal(
            `${newState ? 'เปิด' : 'ปิด'}สิทธิ์ทั้งหมดในแพ็กเกจ ${targetPkg.name}`,
            `คุณต้องการ${newState ? 'เปิด' : 'ปิด'}สิทธิ์เมนูพยากรณ์ทุกรายการให้กับ [${targetPkg.name}] และระดับที่เกี่ยวข้องตามระบบ Cascade หรือไม่?`
        );
        if (!confirm) return;

        const menus = typeof APP_MENU !== 'undefined' ? APP_MENU.filter(m => m.id !== 'package' && !m.id.toLowerCase().includes('admin')) : [];
        if (!window.packagePermissions) window.packagePermissions = {};
        
        menus.forEach(m => {
            applyCascadeForSingleItem(targetPkg.name, m.id, selectedSinglePkgIndex, newState);
        });

        await savePermissionsToBackend();
        renderSinglePackageView();
        if (typeof buildTableInternal === 'function') buildTableInternal();
    }

    async function toggleCategoryInSinglePkg(catName, newState) {
        const targetPkg = packages[selectedSinglePkgIndex];
        if (!targetPkg) return;

        const catMenus = typeof APP_MENU !== 'undefined' ? APP_MENU.filter(m => m.category === catName && m.id !== 'package') : [];
        if (!window.packagePermissions) window.packagePermissions = {};

        catMenus.forEach(m => {
            applyCascadeForSingleItem(targetPkg.name, m.id, selectedSinglePkgIndex, newState);
        });

        await savePermissionsToBackend();
        renderSinglePackageView();
        if (typeof buildTableInternal === 'function') buildTableInternal();
    }

    async function copyFromPreviousPkg() {
        if (selectedSinglePkgIndex <= 0) return;
        const prevPkg = packages[selectedSinglePkgIndex - 1];
        const currentPkg = packages[selectedSinglePkgIndex];

        const confirm = await showConfirmModal(
            `คัดลอกสิทธิ์จาก [${prevPkg.name}]`,
            `คุณต้องการคัดลอกสิทธิ์การเข้าถึงทั้งหมดจาก ${prevPkg.name} มาใส่ให้ ${currentPkg.name} หรือไม่?`
        );
        if (!confirm) return;

        if (!window.packagePermissions) window.packagePermissions = {};
        const prevPerms = window.packagePermissions[prevPkg.name] || {};
        
        const menus = typeof APP_MENU !== 'undefined' ? APP_MENU.filter(m => m.id !== 'package') : [];
        menus.forEach(m => {
            const hasPrev = prevPerms[m.id] !== undefined ? prevPerms[m.id] : checkPermissionDefault(prevPkg.name, getMenuDepthIndex(m.id));
            applyCascadeForSingleItem(currentPkg.name, m.id, selectedSinglePkgIndex, hasPrev);
        });

        await savePermissionsToBackend();
        renderSinglePackageView();
        if (typeof buildTableInternal === 'function') buildTableInternal();
    }

    function applyCascadeForSingleItem(pkgName, menuId, pIndex, newState) {
        if (!window.packagePermissions[pkgName]) window.packagePermissions[pkgName] = {};
        window.packagePermissions[pkgName][menuId] = newState;

        if (newState === false) {
            for (let i = 0; i < pIndex; i++) {
                const lowerPkg = packages[i].name;
                if (!window.packagePermissions[lowerPkg]) window.packagePermissions[lowerPkg] = {};
                window.packagePermissions[lowerPkg][menuId] = false;
            }
        } else {
            for (let i = pIndex + 1; i < packages.length; i++) {
                const higherPkg = packages[i].name;
                if (!window.packagePermissions[higherPkg]) window.packagePermissions[higherPkg] = {};
                window.packagePermissions[higherPkg][menuId] = true;
            }
        }
    }

    async function handleBulkPermission(newState) {
        const filtered = getFilteredMenus();
        if (filtered.length === 0) return;

        const targetPkg = currentViewMode === 'single' ? packages[selectedSinglePkgIndex] : null;
        const msg = targetPkg 
            ? `คุณต้องการ${newState ? 'เปิด' : 'ปิด'}สิทธิ์จำนวน ${filtered.length} รายการที่กำลังแสดง ให้กับแพ็กเกจ [${targetPkg.name}] ใช่หรือไม่?`
            : `คุณต้องการ${newState ? 'เปิด' : 'ปิด'}สิทธิ์จำนวน ${filtered.length} รายการที่กำลังแสดง ให้กับทุกแพ็กเกจใช่หรือไม่?`;

        const confirm = await showConfirmModal(`การจัดการด่วนแบบกลุ่ม (${newState ? 'เปิดสิทธิ์' : 'ปิดสิทธิ์'})`, msg);
        if (!confirm) return;

        if (!window.packagePermissions) window.packagePermissions = {};

        if (targetPkg) {
            filtered.forEach(m => {
                applyCascadeForSingleItem(targetPkg.name, m.id, selectedSinglePkgIndex, newState);
            });
        } else {
            packages.forEach((pkg, pIdx) => {
                if (!window.packagePermissions[pkg.name]) window.packagePermissions[pkg.name] = {};
                filtered.forEach(m => {
                    window.packagePermissions[pkg.name][m.id] = newState;
                });
            });
        }

        await savePermissionsToBackend();
        if (currentViewMode === 'single') {
            renderSinglePackageView();
        } else {
            buildTableInternal();
        }
    }

    async function handleResetDefaults() {
        const confirm = await showConfirmModal(
            'รีเซ็ตเป็นค่าเริ่มต้นระบบ',
            'คุณต้องการล้างการตั้งค่ากำหนดเองทั้งหมด และคืนค่าสิทธิ์ตามมาตรฐานของระบบใช่หรือไม่?'
        );
        if (!confirm) return;

        window.packagePermissions = {};
        await savePermissionsToBackend();
        if (currentViewMode === 'single') {
            renderSinglePackageView();
        } else {
            buildTableInternal();
        }
    }

    async function savePermissionsToBackend() {
        try {
            localStorage.setItem('siamhora_package_permissions', JSON.stringify(window.packagePermissions));
            if (window.firebaseDb) {
                const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await setDoc(doc(window.firebaseDb, 'settings', 'packagePermissions'), window.packagePermissions);
            }
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (e) {
            console.error("Error saving package permissions", e);
        }
    }

    function showConfirmModal(title, text) {
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: title,
                text: text,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ffd700',
                cancelButtonColor: '#475569',
                confirmButtonText: '<span style="color:#000; font-weight:bold;">ยืนยัน</span>',
                cancelButtonText: 'ยกเลิก'
            }).then(res => res.isConfirmed);
        }
        return Promise.resolve(confirm(text));
    }

    return {
        init: init,
        toggleSingleItem: toggleSingleItem,
        toggleAllInSinglePkg: toggleAllInSinglePkg,
        toggleCategoryInSinglePkg: toggleCategoryInSinglePkg,
        copyFromPreviousPkg: copyFromPreviousPkg
    };
})();
