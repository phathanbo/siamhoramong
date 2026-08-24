"use strict";

function showdaylife() {
  const container = document.getElementById("showdaylifepage");
  if (!container) {
    console.warn('showdaylifepage element not found');
    return;
  }

  container.innerHTML = `
<div class="container py-4" style="max-width: 1140px; margin: 0 auto; color: #FFFFFF;">
  
  <!-- Header Banner -->
  <div class="text-center mb-4 p-4 rounded" style="background: linear-gradient(135deg, rgba(241,208,110,0.12) 0%, rgba(20,32,58,0.75) 100%); border: 1px solid rgba(241,208,110,0.35); border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.35); backdrop-filter: blur(20px);">
    <div style="font-size: 3.2rem; margin-bottom: 8px; filter: drop-shadow(0 0 15px rgba(241,208,110,0.6));">⏳</div>
    <h1 style="font-size: 2.2rem; font-weight: 700; background: linear-gradient(135deg, #FFFFFF 0%, #FFF3B0 40%, #F1D06E 80%, #C99727 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 4px 20px rgba(241,208,110,0.3); margin-bottom: 8px;">
      คำนวณอายุและสถิติเวลาชีวิต (Life Chronicle & Milestones)
    </h1>
    <p style="color: #CBD5E1; font-size: 1.05rem; max-width: 650px; margin: 0 auto;">
      บันทึกการเดินทางของชีวิต คำนวณวัน เวลา การเต้นของหัวใจ และหมุดหมายสำคัญในแต่ละช่วงวัย
    </p>
  </div>

  <!-- Member Selection & Custom Date Box -->
  <div class="p-4 mb-4 rounded" style="background: linear-gradient(135deg, rgba(30,46,78,0.75) 0%, rgba(18,28,50,0.85) 100%); border: 1px solid rgba(241,208,110,0.3); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); backdrop-filter: blur(20px);">
    <div class="row align-items-center g-3">
      <div class="col-12 col-md-6 mb-3 mb-md-0">
        <label class="font-weight-bold d-block mb-2" style="color: #FFF0A8; font-size: 0.95rem;">
          <i class="fas fa-users-gear mr-1 text-warning"></i> 👥 เลือกข้อมูลจากสมาชิก:
        </label>
        <select id="daylifeMemberSelect" class="form-control"
                style="border-radius: 12px; height: 46px; background: rgba(13,21,39,0.85); border: 1px solid rgba(241,208,110,0.4); color: #FFF0A8; font-weight: 500;">
          <option value="">— เลือกสมาชิกเพื่อดึงวันเกิด —</option>
        </select>
      </div>

      <div class="col-12 col-md-6">
        <label class="font-weight-bold d-block mb-2" style="color: #FFF0A8; font-size: 0.95rem;">
          <i class="fas fa-calendar-alt mr-1 text-warning"></i> หรือระบุวันเกิดด้วยตนเอง:
        </label>
        <input type="date" id="dob" class="form-control"
               style="border-radius: 12px; height: 46px; background: rgba(13,21,39,0.85); border: 1px solid rgba(241,208,110,0.4); color: #FFFFFF; font-size: 1rem; font-weight: 500;" />
      </div>
    </div>
  </div>

  <div id="dayliferesult" style="display: none;">
    
    <!-- Top 4 Highlight KPI Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3 mb-3">
        <div class="p-3 text-center h-100" style="background: linear-gradient(135deg, rgba(241,208,110,0.15) 0%, rgba(20,32,58,0.7) 100%); border: 1px solid rgba(241,208,110,0.35); border-radius: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
          <div style="font-size: 1.8rem; color: #F1D06E; margin-bottom: 4px;"><i class="fas fa-sun"></i></div>
          <span style="font-size: 0.85rem; color: #CBD5E1;" class="d-block">มีชีวิตอยู่มาแล้ว</span>
          <h3 id="total-days" style="font-size: 1.8rem; font-weight: 700; color: #FFF0A8; margin: 4px 0 0 0;">-</h3>
          <small class="text-white-50">วัน</small>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="p-3 text-center h-100" style="background: linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(20,32,58,0.7) 100%); border: 1px solid rgba(59,130,246,0.35); border-radius: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
          <div style="font-size: 1.8rem; color: #60A5FA; margin-bottom: 4px;"><i class="fas fa-hourglass-half"></i></div>
          <span style="font-size: 0.85rem; color: #CBD5E1;" class="d-block">อายุขัยปัจจุบัน</span>
          <h4 id="ymd" style="font-size: 1.15rem; font-weight: 600; color: #93C5FD; margin: 8px 0 0 0; line-height: 1.4;">-</h4>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="p-3 text-center h-100" style="background: linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(20,32,58,0.7) 100%); border: 1px solid rgba(168,85,247,0.35); border-radius: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
          <div style="font-size: 1.8rem; color: #C084FC; margin-bottom: 4px;"><i class="fas fa-clock"></i></div>
          <span style="font-size: 0.85rem; color: #CBD5E1;" class="d-block">ชั่วโมงในโลกนี้</span>
          <h3 id="total-hours" style="font-size: 1.6rem; font-weight: 700; color: #E9D5FF; margin: 4px 0 0 0;">-</h3>
          <small class="text-white-50">ชั่วโมง</small>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="p-3 text-center h-100" style="background: linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(20,32,58,0.7) 100%); border: 1px solid rgba(236,72,153,0.35); border-radius: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
          <div style="font-size: 1.8rem; color: #F472B6; margin-bottom: 4px;"><i class="fas fa-stopwatch"></i></div>
          <span style="font-size: 0.85rem; color: #CBD5E1;" class="d-block">นาทีแห่งลมหายใจ</span>
          <h3 id="total-mins" style="font-size: 1.6rem; font-weight: 700; color: #FBCFE8; margin: 4px 0 0 0;">-</h3>
          <small class="text-white-50">นาที</small>
        </div>
      </div>
    </div>

    <!-- Next Birthday Progress Card -->
    <div class="p-4 mb-4" style="background: linear-gradient(135deg, rgba(20,32,58,0.8) 0%, rgba(13,21,39,0.9) 100%); border: 1px solid rgba(241,208,110,0.3); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap">
        <h5 class="m-0 font-weight-bold" style="color: #FFF0A8;">
          <i class="fas fa-birthday-cake mr-2 text-warning"></i> วันเกิดครบรอบครั้งถัดไป
        </h5>
        <span id="next-bday" class="font-weight-bold" style="color: #F1D06E; font-size: 1rem;"></span>
      </div>
      <div class="d-flex align-items-center gap-3 mt-3">
        <div style="flex: 1; height: 12px; border-radius: 10px; background: rgba(255,255,255,0.1); overflow: hidden; padding: 2px;">
          <div id="bday-progress" style="height: 100%; border-radius: 8px; background: linear-gradient(90deg, #F1D06E 0%, #F59E0B 100%); transition: width 0.6s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 0 10px rgba(241,208,110,0.6);"></div>
        </div>
        <span id="bday-percent" style="color: #FFF0A8; font-weight: bold; font-size: 0.9rem; min-width: 45px; text-align: right;">0%</span>
      </div>
    </div>

    <!-- Detailed Statistics Grid -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 mb-3">
        <div class="p-4 h-100" style="background: rgba(15,23,42,0.75); border: 1px solid rgba(241,208,110,0.25); border-radius: 20px;">
          <h5 class="font-weight-bold mb-3" style="color: #FFF0A8;">
            <i class="fas fa-calendar-check mr-2 text-warning"></i> สัดส่วนวันทำงานและวันพักผ่อน
          </h5>
          <div class="d-flex justify-content-between py-2 border-bottom border-secondary">
            <span class="text-white-50">จำนวนสัปดาห์</span>
            <span id="total-weeks" class="font-weight-bold text-white"></span>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom border-secondary">
            <span class="text-white-50">วินาทีทั้งหมด</span>
            <span id="total-secs" class="font-weight-bold text-white"></span>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom border-secondary">
            <span class="text-white-50">วันทำงาน (จันทร์-ศุกร์)</span>
            <span id="weekdays" class="font-weight-bold text-info"></span>
          </div>
          <div class="d-flex justify-content-between py-2">
            <span class="text-white-50">วันหยุดสุดสัปดาห์ (เสาร์-อาทิตย์)</span>
            <span id="weekends" class="font-weight-bold text-success"></span>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 mb-3">
        <div class="p-4 h-100" style="background: rgba(15,23,42,0.75); border: 1px solid rgba(241,208,110,0.25); border-radius: 20px;">
          <h5 class="font-weight-bold mb-3" style="color: #FFF0A8;">
            <i class="fas fa-heartbeat mr-2 text-danger"></i> สถิติร่างกายและจังหวะชีวิต
          </h5>
          <div id="funfacts"></div>
        </div>
      </div>
    </div>

    <!-- Extra Fun: Cosmic Planetary Age & Journey -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 mb-3">
        <div class="p-4 h-100" style="background: linear-gradient(135deg, rgba(20,32,58,0.75) 0%, rgba(15,23,42,0.85) 100%); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px;">
          <h5 class="font-weight-bold mb-3" style="color: #E9D5FF;">
            <i class="fas fa-globe-asia mr-2 text-purple" style="color: #C084FC;"></i> อายุของคุณบนดาวเคราะห์ดวงอื่น (Cosmic Age)
          </h5>
          <p class="text-white-50 small mb-3">หากคุณไปอาศัยอยู่บนดาวเคราะห์ดวงอื่นในระบบสุริยะ คุณจะมีอายุเท่าไหร่?</p>
          <div id="cosmicAges"></div>
        </div>
      </div>

      <div class="col-12 col-md-6 mb-3">
        <div class="p-4 h-100" style="background: linear-gradient(135deg, rgba(20,32,58,0.75) 0%, rgba(15,23,42,0.85) 100%); border: 1px solid rgba(59,130,246,0.3); border-radius: 20px;">
          <h5 class="font-weight-bold mb-3" style="color: #93C5FD;">
            <i class="fas fa-utensils mr-2 text-primary" style="color: #60A5FA;"></i> สถิติการเดินทาง & การกิน (Lifestyle Fun Facts)
          </h5>
          <p class="text-white-50 small mb-3">ปริมาณอาหาร น้ำดื่ม และระยะทางที่คุณเดินทางร่วมกับโลก</p>
          <div id="lifestyleFacts"></div>
        </div>
      </div>
    </div>

    <!-- Astrological Life Phase Insight (ข้อคิดมงคลประจำช่วงวัย) -->
    <div class="p-4 mb-4" style="background: linear-gradient(135deg, rgba(241,208,110,0.12) 0%, rgba(20,32,58,0.8) 100%); border: 1px solid rgba(241,208,110,0.35); border-radius: 20px;">
      <div class="d-flex align-items-center gap-3 mb-2">
        <span style="font-size: 2rem; color: #F1D06E;"><i class="fas fa-quote-left"></i></span>
        <div>
          <h5 class="font-weight-bold m-0" style="color: #FFF0A8;" id="lifePhaseTitle">โอวาทมงคลประจำช่วงวัย</h5>
          <small class="text-white-50" id="lifePhaseSubtitle">ข้อคิดและแนวทางดำเนินชีวิต</small>
        </div>
      </div>
      <p class="p-3 mt-3 rounded" style="background: rgba(13,21,39,0.7); border-left: 4px solid #F1D06E; color: #F3F4F6; line-height: 1.8; font-size: 1.05rem;" id="lifePhaseQuote">
        กำลังประมวลผล...
      </p>
    </div>

    <!-- Milestones of Life -->
    <div class="p-4 mb-4" style="background: rgba(15,23,42,0.75); border: 1px solid rgba(241,208,110,0.25); border-radius: 20px;">
      <h5 class="font-weight-bold mb-3" style="color: #FFF0A8;">
        <i class="fas fa-flag-checkered mr-2 text-warning"></i> หมุดหมายชีวิตสำคัญ (Life Milestones)
      </h5>
      <p class="text-white-50 small mb-3">ก้าวสำคัญในแต่ละหลักพันวันของชีวิต นับตั้งแต่วันแรกที่ลืมตาดูโลก</p>
      <div id="milestones" style="display: flex; flex-direction: column; gap: 8px;"></div>
    </div>

  </div>

  <!-- Empty State Placeholder -->
  <div id="placeholder" class="text-center py-5" style="background: rgba(15,23,42,0.5); border: 1px dashed rgba(241,208,110,0.3); border-radius: 20px;">
    <div style="font-size: 3rem; margin-bottom: 12px; color: #F1D06E;"><i class="fas fa-calendar-alt"></i></div>
    <h5 style="color: #FFF0A8;">กรุณาเลือกสมาชิกหรือระบุวันเกิด</h5>
    <p class="text-white-50 m-0">เพื่อคำนวณสถิติเวลาชีวิตและหมุดหมายสำคัญของคุณ</p>
  </div>

  <!-- Bottom Return Button -->
  <div class="text-center mt-4">
    <button class="btn btn-outline-gold px-4 py-2" onclick="navigateTo('mainpage')" style="border-radius: 50px;">
      <i class="fas fa-chevron-left mr-2"></i> กลับหน้าห้องพยากรณ์
    </button>
  </div>

</div>`;

  const dobInput = document.getElementById('dob');
  const memberSelect = document.getElementById('daylifeMemberSelect');
  const resultSection = document.getElementById('dayliferesult');
  const placeholder = document.getElementById('placeholder');

  function fmt(n) { return Math.round(n).toLocaleString('th-TH'); }

  // โหลดรายชื่อสมาชิกเข้า Dropdown
  function populateMemberSelect() {
    if (!memberSelect) return;
    try {
      const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
      let members = allHistory;
      if (typeof filterHistoryByCurrentUser === 'function') {
        members = filterHistoryByCurrentUser(allHistory);
      }

      memberSelect.innerHTML = '<option value="">— เลือกสมาชิกเพื่อดึงวันเกิด —</option>';
      if (members.length === 0) {
        const opt = document.createElement('option');
        opt.disabled = true;
        opt.innerText = '(ยังไม่มีประวัติสมาชิก)';
        memberSelect.appendChild(opt);
        return;
      }

      members.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id || item.memberId;
        const bdateStr = item.birthdate ? ` (${item.birthdate})` : '';
        opt.innerText = `👤 ${item.name || 'ไม่ระบุชื่อ'} ${item.lastName || ''}${bdateStr}`;
        memberSelect.appendChild(opt);
      });
    } catch (e) {
      console.warn('⚠️ populateMemberSelect in daylife error:', e);
    }
  }

  // คำนวณวันหยุดและวันทำงาน O(1)
  function countWeekdaysWeekends(startDate, totalDays) {
    const startDay = startDate.getDay();
    const fullWeeks = Math.floor(totalDays / 7);
    const remainder = totalDays % 7;
    let weekdays = fullWeeks * 5;
    let weekends = fullWeeks * 2;
    for (let i = 0; i < remainder; i++) {
      const d = (startDay + i) % 7;
      (d === 0 || d === 6) ? weekends++ : weekdays++;
    }
    return { weekdays, weekends };
  }

  function renderMilestones(totalDays, dob) {
    const milestones = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 20000, 25000, 30000, 35000];
    const el = document.getElementById('milestones');
    if (!el) return;
    el.innerHTML = '';
    milestones.forEach(m => {
      const reached = totalDays >= m;
      const mDate = new Date(dob.getTime() + m * 86400000);
      const label = mDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      const daysAway = m - totalDays;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:12px;background:' + (reached ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.03)') + ';border:1px solid ' + (reached ? 'rgba(46,204,113,0.3)' : 'rgba(255,255,255,0.06)') + ';';
      row.innerHTML = `
        <span style="font-size:14px;font-weight:${reached ? '600' : 'normal'};color:${reached ? '#4ADE80' : '#CBD5E1'}">
          ${reached ? '✅' : '⏳'} ครบ ${m.toLocaleString('th-TH')} วัน
        </span>
        <span style="font-size:13px;color:${reached ? '#94A3B8' : '#FFF0A8'};font-weight:${reached ? 'normal' : '600'};">
          ${reached ? label : `อีก ${daysAway.toLocaleString('th-TH')} วัน (${label})`}
        </span>`;
      el.appendChild(row);
    });
  }

  function renderFunFacts(totalDays, totalHours) {
    const facts = [
      { label: 'หัวใจเต้นไปแล้วโดยประมาณ', value: `${fmt(totalDays * 24 * 60 * 70)} ครั้ง`, icon: 'fa-heart text-danger' },
      { label: 'สูดลมหายใจเข้า-ออก', value: `${fmt(totalDays * 24 * 60 * 15)} ครั้ง`, icon: 'fa-wind text-info' },
      { label: 'นอนหลับพักผ่อนสะสม', value: `${fmt(totalHours * 0.33)} ชั่วโมง (${fmt((totalHours * 0.33)/24)} วัน)`, icon: 'fa-bed text-warning' },
      { label: 'กระพริบตาเพื่อมองโลก', value: `${fmt(totalDays * 16 * 60 * 15)} ครั้ง`, icon: 'fa-eye text-primary' },
    ];
    const el = document.getElementById('funfacts');
    if (!el) return;
    el.innerHTML = facts.map(f => `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
        <span class="text-white-50"><i class="fas ${f.icon} mr-2"></i>${f.label}</span>
        <span class="font-weight-bold text-white">${f.value}</span>
      </div>`).join('');
  }

  function renderCosmicAges(totalDays) {
    const el = document.getElementById('cosmicAges');
    if (!el) return;

    // คาบการโคจรรอบดวงอาทิตย์ (เทียบวันบนโลก)
    const planets = [
      { name: 'ดาวพุธ (Mercury)', factor: 87.97, icon: 'fa-meteor text-secondary', note: 'ปีบนดาวพุธสั้นมากเพียง 88 วันโลก' },
      { name: 'ดาวศุกร์ (Venus)', factor: 224.7, icon: 'fa-star text-warning', note: 'ปีบนดาวศุกร์เท่ากับ 225 วันโลก' },
      { name: 'ดาวอังคาร (Mars)', factor: 686.98, icon: 'fa-fire text-danger', note: 'ปีบนดาวอังคารเท่ากับ 687 วันโลก' },
      { name: 'ดาวพฤหัสฯ (Jupiter)', factor: 4332.59, icon: 'fa-ring text-warning', note: 'ปีบนดาวพฤหัสฯ เท่ากับเกือบ 12 ปีโลก' },
      { name: 'ดาวเสาร์ (Saturn)', factor: 10759.22, icon: 'fa-circle-notch text-info', note: 'ปีบนดาวเสาร์เท่ากับ 29.5 ปีโลก' }
    ];

    el.innerHTML = planets.map(p => {
      const ageOnPlanet = (totalDays / p.factor).toFixed(1);
      return `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
          <div>
            <span class="text-white"><i class="fas ${p.icon} mr-2"></i>${p.name}</span>
            <small class="d-block text-white-50" style="font-size: 11px;">${p.note}</small>
          </div>
          <span class="font-weight-bold" style="color: #F1D06E; font-size: 1.1rem;">${ageOnPlanet} <small class="text-white-50">ขวบปี</small></span>
        </div>
      `;
    }).join('');
  }

  function renderLifestyleFacts(totalDays) {
    const el = document.getElementById('lifestyleFacts');
    if (!el) return;

    // การประมาณการเฉลี่ยต่อวันของมนุษย์
    const foodKg = (totalDays * 1.5).toFixed(0); // กินอาหารเฉลี่ย 1.5 กก./วัน
    const waterLiters = (totalDays * 2.2).toFixed(0); // ดื่มน้ำเฉลี่ย 2.2 ลิตร/วัน
    const earthOrbitKm = (totalDays * 2.57).toFixed(0); // โลกโคจรรอบดวงอาทิตย์ประมาณ 2.57 ล้าน กม./วัน
    const stepsCount = (totalDays * 5500).toFixed(0); // ก้าวเดินเฉลี่ย 5,500 ก้าว/วัน

    const items = [
      { label: 'อาหารที่รับประทานสะสม', value: `ประมาณ ${fmt(foodKg)} กิโลกรัม (${(foodKg/1000).toFixed(1)} ตัน)`, icon: 'fa-drumstick-bite text-warning' },
      { label: 'น้ำดื่มที่หล่อเลี้ยงร่างกาย', value: `ประมาณ ${fmt(waterLiters)} ลิตร (${(waterLiters/1000).toFixed(1)} ลบ.ม.)`, icon: 'fa-tint text-info' },
      { label: 'ก้าวเดินสะสมบนพื้นพิภพ', value: `ประมาณ ${fmt(stepsCount)} ก้าว (${fmt(stepsCount * 0.00075)} กม.)`, icon: 'fa-shoe-prints text-success' },
      { label: 'ท่องอวกาศไปพร้อมกับโลก', value: `เดินทางไปแล้วกว่า ${fmt(earthOrbitKm)} ล้านกิโลเมตร`, icon: 'fa-rocket text-danger' },
    ];

    el.innerHTML = items.map(f => `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
        <span class="text-white-50"><i class="fas ${f.icon} mr-2"></i>${f.label}</span>
        <span class="font-weight-bold text-white text-right" style="font-size: 0.95rem;">${f.value}</span>
      </div>`).join('');
  }

  function renderLifePhaseQuote(years) {
    const titleEl = document.getElementById('lifePhaseTitle');
    const subtitleEl = document.getElementById('lifePhaseSubtitle');
    const quoteEl = document.getElementById('lifePhaseQuote');
    if (!quoteEl) return;

    let phase = '';
    let subtitle = '';
    let quote = '';

    if (years < 15) {
      phase = 'ปฐมวัย (วัยเรียนรู้และก่อกำเนิดพลัง)';
      subtitle = 'ช่วงเวลาแห่งความสุข ความสดใส และการสะสมประสบการณ์แรกของชีวิต';
      quote = 'วัยเด็กคือผืนดินที่บริสุทธิ์ ทุกเมล็ดพันธุ์แห่งปัญญาและความดีงามที่ปลูกฝังในวันนี้ จะงอกงามเป็นร่มเงาที่ยิ่งใหญ่ในวันข้างหน้า';
    } else if (years < 30) {
      phase = 'มัชฌิมปฐมวัย (วัยสร้างตัว เบิกทางสู่อนาคต)';
      subtitle = 'ช่วงเวลาแห่งพลัง ความฝัน ความมุ่งมั่น และการค้นหาตัวตนที่แท้จริง';
      quote = 'วัยหนุ่มสาวคือช่วงเวลาแห่งการเรียนรู้จากความผิดพลาด จงกล้าที่จะก้าวเดินและสร้างเส้นทางของตนเอง ความล้มเหลวไม่ใช่จุดจบ แต่เป็นหินลองทองของความสำเร็จ';
    } else if (years < 45) {
      phase = 'มัชฌิมวัย (วัยแห่งความมั่นคง เกียรติยศ และปัญญา)';
      subtitle = 'ช่วงเวลาแห่งการเป็นเสาหลัก การบริหารจัดการชีวิต และสร้างความสำเร็จที่ยั่งยืน';
      quote = 'ชีวิตในวัยนี้เปรียบดั่งต้นไม้ใหญ่ที่ออกดอกผล จงใช้ปัญญาและความหนักแน่นนำทางชีวิต รักษาสมดุลระหว่างหน้าที่การงาน สุขภาพ และครอบครัวให้มั่นคง';
    } else if (years < 60) {
      phase = 'ปัจฉิมวัยต้น (วัยแห่งความสุขอิ่มเอมและการให้)';
      subtitle = 'ช่วงเวลาแห่งการส่งต่อประสบการณ์ การบำเพ็ญประโยชน์ และการมีชีวิตที่เปี่ยมคุณค่า';
      quote = 'ความสุขที่แท้จริงในวัยนี้มิได้เกิดจากการครอบครอง แต่เกิดจากการปล่อยวางและส่งต่อความรู้ ความรัก และความเมตตาให้แก่คนรุ่นหลัง';
    } else {
      phase = 'มหาปัจฉิมวัย (วัยแห่งความร่มเย็นและปัญญาสูงสุด)';
      subtitle = 'ช่วงเวลาแห่งความสงบสุข บารมีธรรม และการชื่นชมความงดงามของชีวิต';
      quote = 'กาลเวลาที่ผ่านมาคือตำนานชีวิตอันทรงคุณค่า ดั่งร่มโพธิ์ร่มไทรที่ให้ความร่มเย็นแก่ลูกหลาน จิตใจที่สงบและปล่อยวางคือสมบัติอันล้ำค่าที่สุดในชีวิต';
    }

    if (titleEl) titleEl.innerText = `โอวาทมงคลประจำ${phase}`;
    if (subtitleEl) subtitleEl.innerText = subtitle;
    if (quoteEl) quoteEl.innerHTML = `“ ${quote} ”`;
  }

  function compute() {
    try {
      const val = dobInput.value;
      if (!val) {
        resultSection.style.display = 'none';
        placeholder.style.display = 'block';
        return;
      }
      
      const dob = new Date(val + 'T00:00:00');
      if (isNaN(dob.getTime())) {
        resultSection.style.display = 'none';
        placeholder.style.display = 'block';
        return;
      }

      const now = new Date();
      if (dob > now) {
        resultSection.style.display = 'none';
        placeholder.style.display = 'block';
        if (typeof Swal !== 'undefined') {
          Swal.fire('แจ้งเตือน', 'กรุณาเลือกวันเกิดที่ผ่านมาแล้ว', 'warning');
        }
        return;
      }

      placeholder.style.display = 'none';
      resultSection.style.display = 'block';

      const diffMs = now - dob;
      const totalDays = Math.floor(diffMs / 86400000);
      const totalHours = Math.floor(diffMs / 3600000);
      const totalMins = Math.floor(diffMs / 60000);
      const totalSecs = Math.floor(diffMs / 1000);
      const totalWeeks = Math.floor(totalDays / 7);

      let y = now.getFullYear() - dob.getFullYear();
      let mo = now.getMonth() - dob.getMonth();
      let d = now.getDate() - dob.getDate();
      if (d < 0) { mo--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
      if (mo < 0) { y--; mo += 12; }

      const { weekdays, weekends } = countWeekdaysWeekends(dob, totalDays);

      const nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
      const daysToNext = Math.ceil((nextBday - now) / 86400000);
      
      const lastBday = new Date(nextBday);
      lastBday.setFullYear(nextBday.getFullYear() - 1);
      const daysBetween = Math.round((nextBday - lastBday) / 86400000);
      const daysSinceLast = Math.round((now - lastBday) / 86400000);
      const progress = Math.min(100, Math.max(0, Math.round((daysSinceLast / daysBetween) * 100)));

      document.getElementById('total-days').textContent = fmt(totalDays);
      document.getElementById('ymd').textContent = `${y} ปี ${mo} เดือน ${d} วัน`;
      document.getElementById('total-hours').textContent = fmt(totalHours);
      document.getElementById('total-mins').textContent = fmt(totalMins);
      document.getElementById('total-weeks').textContent = fmt(totalWeeks);
      document.getElementById('total-secs').textContent = fmt(totalSecs);
      document.getElementById('weekends').textContent = `${fmt(weekends)} วัน`;
      document.getElementById('weekdays').textContent = `${fmt(weekdays)} วัน`;
      document.getElementById('next-bday').textContent =
        `อีก ${daysToNext} วัน (${nextBday.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })})`;
      document.getElementById('bday-progress').style.width = progress + '%';
      const bdayPercentEl = document.getElementById('bday-percent');
      if (bdayPercentEl) bdayPercentEl.innerText = `${progress}%`;

      renderMilestones(totalDays, dob);
      renderFunFacts(totalDays, totalHours);
      renderCosmicAges(totalDays);
      renderLifestyleFacts(totalDays);
      renderLifePhaseQuote(y);
    } catch (err) {
      console.error('Error computing daylife:', err);
      resultSection.style.display = 'none';
      placeholder.style.display = 'block';
    }
  }

  // เมื่อเลือกสมาชิก ให้เซ็ตค่าวันเกิดและคำนวณทันที
  if (memberSelect) {
    memberSelect.addEventListener('change', (e) => {
      const memberId = e.target.value;
      if (!memberId) return;

      try {
        const allHistory = JSON.parse(localStorage.getItem('horo_history')) || [];
        const target = allHistory.find(m => (m.id == memberId || m.memberId == memberId));
        if (target && target.birthdate) {
          let d = typeof safeParseThaiDate === 'function' ? safeParseThaiDate(target.birthdate) : (typeof parseBirthdate === 'function' ? parseBirthdate(target.birthdate) : new Date(target.birthdate));
          if (d && !isNaN(d.getTime())) {
            const yearStr = d.getFullYear();
            const monthStr = String(d.getMonth() + 1).padStart(2, '0');
            const dateStr = String(d.getDate()).padStart(2, '0');
            dobInput.value = `${yearStr}-${monthStr}-${dateStr}`;
            compute();
          }
        }
      } catch (err) {
        console.error('Error selecting member in daylife:', err);
      }
    });
  }

  if (dobInput) {
    dobInput.addEventListener('change', compute);
  }

  // เรียกโหลดสมาชิกตอนเริ่มต้น
  populateMemberSelect();
}

// Ensure the UI is initialized whether script loads before or after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showdaylife);
} else {
  showdaylife();
}