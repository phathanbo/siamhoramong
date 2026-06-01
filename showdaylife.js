"use strict";

function showdaylife() {
  const container = document.getElementById("showdaylifepage");
  if (!container) {
    console.warn('showdaylifepage element not found');
    return;
  }

  container.innerHTML = `
<div style="padding: 2rem 0;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0 0 8px;">วันเกิดของคุณ</p>
    <input type="date" id="dob" style="font-size: 16px; padding: 10px 16px; border-radius: var(--border-radius-md); width: 220px; text-align: center;" />
  </div>

  <div id="dayliferesult" style="display: none;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 1.5rem;">
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem; text-align: center;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">วันทั้งหมด</p>
        <p id="total-days" style="font-size: 26px; font-weight: 500; margin: 0; color: var(--color-text-primary);"></p>
      </div>
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem; text-align: center;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">ปี / เดือน / วัน</p>
        <p id="ymd" style="font-size: 16px; font-weight: 500; margin: 0; color: var(--color-text-primary);"></p>
      </div>
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem; text-align: center;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">ชั่วโมง</p>
        <p id="total-hours" style="font-size: 26px; font-weight: 500; margin: 0; color: var(--color-text-primary);"></p>
      </div>
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem; text-align: center;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">นาที</p>
        <p id="total-mins" style="font-size: 26px; font-weight: 500; margin: 0; color: var(--color-text-primary);"></p>
      </div>
    </div>

    <div style="background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
      <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 10px;">สัปดาห์ที่ผ่านมา</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary);">
          <span style="font-size: 14px; color: var(--color-text-secondary);">สัปดาห์</span>
          <span id="total-weeks" style="font-size: 14px; font-weight: 500;"></span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 0.5px solid var(--color-border-tertiary);">
          <span style="font-size: 14px; color: var(--color-text-secondary);">วินาที</span>
          <span id="total-secs" style="font-size: 14px; font-weight: 500;"></span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
          <span style="font-size: 14px; color: var(--color-text-secondary);">วันหยุดสุดสัปดาห์</span>
          <span id="weekends" style="font-size: 14px; font-weight: 500;"></span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
          <span style="font-size: 14px; color: var(--color-text-secondary);">วันทำงาน</span>
          <span id="weekdays" style="font-size: 14px; font-weight: 500;"></span>
        </div>
      </div>
    </div>

    <!-- Milestones -->
    <div style="background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
      <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 10px;">milestone สำคัญ</p>
      <div id="milestones" style="display: flex; flex-direction: column; gap: 8px;"></div>
    </div>

    <!-- Fun facts -->
    <div style="background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
      <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 10px;">ข้อเท็จจริงสนุก ๆ</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" id="funfacts"></div>
    </div>

    <!-- Next birthday -->
    <div style="background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem;">
      <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 8px;">วันเกิดถัดไป</p>
      <p id="next-bday" style="font-size: 15px; font-weight: 500; margin: 0;"></p>
      <div style="margin-top: 10px; height: 6px; border-radius: 3px; background: var(--color-background-secondary); overflow: hidden;">
        <div id="bday-progress" style="height: 100%; border-radius: 3px; background: var(--color-text-primary); transition: width 0.4s;"></div>
      </div>
    </div>
  </div>

  <p id="placeholder" style="text-align: center; color: var(--color-text-tertiary); font-size: 14px; margin-top: 1.5rem;">เลือกวันเกิดเพื่อดูผล</p>
</div>`;

  // ✅ FIX: query elements AFTER innerHTML is set
  const dobInput = document.getElementById('dob');
  const resultSection = document.getElementById('dayliferesult');
  const placeholder = document.getElementById('placeholder');

  if (!dobInput) {
    console.warn('dob input not found');
    return;
  }

  function fmt(n) { return Math.round(n).toLocaleString('th-TH'); }

  // ✅ FIX: O(1) weekday/weekend calculation — no loop
  function countWeekdaysWeekends(startDate, totalDays) {
    const startDay = startDate.getDay(); // 0=Sun
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
    const milestones = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 15000, 20000, 25000, 30000];
    const el = document.getElementById('milestones');
    el.innerHTML = '';
    milestones.forEach(m => {
      const reached = totalDays >= m;
      const mDate = new Date(dob.getTime() + m * 86400000);
      const label = mDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      const daysAway = m - totalDays;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);';
      row.innerHTML = `
        <span style="font-size:14px;color:${reached ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}">
          ${reached ? '✓' : '○'} ครบ ${m.toLocaleString('th-TH')} วัน
        </span>
        <span style="font-size:13px;color:${reached ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'}">
          ${reached ? label : `อีก ${daysAway.toLocaleString('th-TH')} วัน`}
        </span>`;
      el.appendChild(row);
    });
  }

  function renderFunFacts(totalDays, totalHours) {
    const facts = [
      { label: 'หัวใจเต้น (ครั้ง)', value: fmt(totalDays * 24 * 60 * 70) },
      { label: 'หายใจ (ครั้ง)', value: fmt(totalDays * 24 * 60 * 15) },
      { label: 'นอนหลับโดยประมาณ (ชม.)', value: fmt(totalHours * 0.33) },
      { label: 'กระพริบตา (ครั้ง)', value: fmt(totalDays * 16 * 60 * 15) },
    ];
    const el = document.getElementById('funfacts');
    el.innerHTML = facts.map(f => `
      <div style="padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary);">
        <p style="font-size:12px;color:var(--color-text-secondary);margin:0 0 2px;">${f.label}</p>
        <p style="font-size:15px;font-weight:500;margin:0;">${f.value}</p>
      </div>`).join('');
  }

  function compute() {
    try {
      const val = dobInput.value;
    if (!val) {
      resultSection.style.display = 'none';
      placeholder.style.display = 'block';
      placeholder.textContent = 'เลือกวันเกิดเพื่อดูผล';
      return;
    }
      const dob = new Date(val + 'T00:00:00');
      if (isNaN(dob.getTime())) {
        resultSection.style.display = 'none';
        placeholder.style.display = 'block';
        placeholder.textContent = 'รูปแบบวันที่ไม่ถูกต้อง';
        return;
      }
    const now = new Date();
    if (dob > now) {
      resultSection.style.display = 'none';
      placeholder.style.display = 'block';
      placeholder.textContent = 'กรุณาเลือกวันที่ผ่านมาแล้ว';
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
      // compute progress between last birthday and next birthday (handles leap years)
      const lastBday = new Date(nextBday);
      lastBday.setFullYear(nextBday.getFullYear() - 1);
      const daysBetween = Math.round((nextBday - lastBday) / 86400000);
      const daysSinceLast = Math.round((now - lastBday) / 86400000);
      const progress = Math.round((daysSinceLast / daysBetween) * 100);

    document.getElementById('total-days').textContent = fmt(totalDays);
    document.getElementById('ymd').textContent = `${y} ปี ${mo} เดือน ${d} วัน`;
    document.getElementById('total-hours').textContent = fmt(totalHours);
    document.getElementById('total-mins').textContent = fmt(totalMins);
    document.getElementById('total-weeks').textContent = fmt(totalWeeks);
    document.getElementById('total-secs').textContent = fmt(totalSecs);
    document.getElementById('weekends').textContent = fmt(weekends);
    document.getElementById('weekdays').textContent = fmt(weekdays);
    document.getElementById('next-bday').textContent =
      `อีก ${daysToNext} วัน (${nextBday.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })})`;
    document.getElementById('bday-progress').style.width = progress + '%';

    renderMilestones(totalDays, dob);
    renderFunFacts(totalDays, totalHours);
    } catch (err) {
      console.error('Error computing daylife:', err);
      resultSection.style.display = 'none';
      placeholder.style.display = 'block';
      placeholder.textContent = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    }
  }

  dobInput.addEventListener('change', compute);
}

// Ensure the UI is initialized whether script loads before or after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showdaylife);
} else {
  // DOM already ready
  showdaylife();
}