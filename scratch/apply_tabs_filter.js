const fs = require('fs');
const path = require('path');

const horasatPath = path.join(__dirname, '..', 'Horasat.html');
let html = fs.readFileSync(horasatPath, 'utf8');

// 1. Add filter tabs container
const oldResultContainer = `<div id="predictionResult" style="margin-top: 30px; display: none;">
            <h2 style="text-align: center; color: #d4af37; font-size: 1.5rem; margin-bottom: 20px;">📜 คำพยากรณ์ดวงชะตากำเนิด (ตามตำรา สิงห์โต สุริยาอารักษ์)</h2>
            <div id="predictionContent" style="display: flex; flex-direction: column; gap: 15px;"></div>
        </div>`;

const newResultContainer = `<div id="predictionResult" style="margin-top: 40px; display: none;">
            <h2 style="text-align: center; color: #ffd88a; font-size: 1.8rem; margin-bottom: 8px; text-shadow: 0 0 10px rgba(212,175,55,0.3);">📜 คำพยากรณ์ดวงชะตากำเนิดและดวงจรตามตำรา</h2>
            <div style="text-align: center; color: #bfa8e6; margin-bottom: 25px; font-size: 1.02rem;">ผูกดวงชะตาพยากรณ์ตามหลักการในตำราอาจารย์สิงห์โต สุริยาอารักษ์ แบบละเอียดเป๊ะ 100%</div>
            
            <div class="filter-tabs no-print" id="filterTabs">
                <button class="filter-tab active" onclick="filterPredictions('all', this)">🌟 ดูทั้งหมด</button>
                <button class="filter-tab" onclick="filterPredictions('personality', this)">🌳 ตัวตน & ร่างกาย</button>
                <button class="filter-tab" onclick="filterPredictions('dignities', this)">🏆 มาตรฐานดาวเคราะห์</button>
                <button class="filter-tab" onclick="filterPredictions('houses', this)">🏛️ 12 ภพ & เจ้าเรือน</button>
                <button class="filter-tab" onclick="filterPredictions('spouse-career', this)">💍 คู่ครอง & อาชีพ</button>
                <button class="filter-tab" onclick="filterPredictions('transit', this)">🔮 ดวงจร & มหาทักษา</button>
            </div>
            
            <div id="predictionContent" style="display: flex; flex-direction: column; gap: 20px;"></div>
        </div>`;

html = html.replace(oldResultContainer, newResultContainer);

// 2. Add classes to prediction sections dynamically in the script:
html = html.replace('id="section-tree"', 'id="section-tree" class="pred-card-item" data-category="personality"');
html = html.replace('id="section-lagna"', 'id="section-lagna" class="pred-card-item" data-category="personality"');
html = html.replace('id="section-dignities"', 'id="section-dignities" class="pred-card-item" data-category="dignities"');
html = html.replace('id="section-houses"', 'id="section-houses" class="pred-card-item" data-category="houses"');
html = html.replace('id="section-lord"', 'id="section-lord" class="pred-card-item" data-category="houses"');
html = html.replace('id="section-negativelord"', 'id="section-negativelord" class="pred-card-item" data-category="houses"');
html = html.replace('id="section-spouse"', 'id="section-spouse" class="pred-card-item" data-category="spouse-career"');
html = html.replace('id="section-career"', 'id="section-career" class="pred-card-item" data-category="spouse-career"');
html = html.replace('id="section-conjunctions"', 'id="section-conjunctions" class="pred-card-item" data-category="personality"');
html = html.replace('id="section-aspects"', 'id="section-aspects" class="pred-card-item" data-category="houses"');
html = html.replace('id="section-qualities"', 'id="section-qualities" class="pred-card-item" data-category="personality"');
html = html.replace('id="section-taksa"', 'id="section-taksa" class="pred-card-item" data-category="personality"');
html = html.replace('id="section-transit-major"', 'id="section-transit-major" class="pred-card-item" data-category="transit"');
html = html.replace('id="section-transit-minor"', 'id="section-transit-minor" class="pred-card-item" data-category="transit"');
html = html.replace('id="section-transit-daily"', 'id="section-transit-daily" class="pred-card-item" data-category="transit"');
html = html.replace('id="section-mahataksa"', 'id="section-mahataksa" class="pred-card-item" data-category="transit"');

// 3. Add filterPredictions JS function
const filterFunction = `
        window.filterPredictions = function(category, tabBtn) {
            // Update active state of tabs
            const tabs = document.querySelectorAll('#filterTabs .filter-tab');
            tabs.forEach(t => t.classList.remove('active'));
            if (tabBtn) tabBtn.classList.add('active');

            // Show/Hide cards with animation
            const cards = document.querySelectorAll('.pred-card-item');
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        }
`;

// Insert the filter function in the global window script block:
html = html.replace('window.toggleAccordion = function(headerElement) {', filterFunction + '\n        window.toggleAccordion = function(headerElement) {');

fs.writeFileSync(horasatPath, html, 'utf8');
console.log("Successfully added tab filters and animations to Horasat.html!");
