"use strict";

// ===== ข้อมูลพยากรณ์รายธาตุ (อิงหลักเบญจธาตุ ไทย–จีน) =====
const ELEM_FORTUNE = {
    "ธาตุไฟ": {
        emoji: "🔥", color: "#c0392b", bg: "#fff5f5",
        dayName: "อาทิตย์/เสาร์",
        trait: "ผู้นำ มีพลัง กล้าหาญ ใจร้อน",
        overview: "ธาตุไฟให้พลังงานสูง มีความกระตือรือร้น เป็นผู้นำโดยธรรมชาติ กล้าริเริ่ม แต่มักใจร้อนและขาดความอดทนในระยะยาว",
        work: "เหมาะบทบาทผู้บริหาร ผู้ประกอบการ นักขาย นักทหาร ศิลปิน ครูผู้สอน — ควรเปิดตัวโครงการใหม่และนำทีม อย่าซ่อนความสามารถ",
        money: "ทรัพย์มักมาเร็วแต่ไปเร็วเช่นกัน ต้องฝึกวินัยเก็บออม ระวังลงทุนตามอารมณ์ เหมาะธุรกิจที่ต้องใช้พลังงานและการนำเสนอ",
        love: "รักร้อนแรง มีเสน่ห์ดึงดูดสูง แต่ต้องการพื้นที่อิสระ คู่ที่ดีที่สุดคือธาตุดิน (รับพลังได้) หรือธาตุลม (ช่วยเพิ่มแรง) — ระวังอหังการในความสัมพันธ์",
        health: "ระวังโรคหัวใจ ความดันโลหิตสูง การอักเสบ และความเครียดสะสม ควรดื่มน้ำมากๆ นอนหลับให้เพียงพอ ลดการแข่งขันกดดันตัวเอง",
        luckyColor: "แดง ส้ม ทอง",
        luckyDir: "ทิศใต้",
        luckyDay: "วันอาทิตย์",
        supportElem: "ธาตุลม (ลมเสริมไฟ), ธาตุไม้ (ไม้เป็นเชื้อเพลิง)",
        avoidElem: "ธาตุน้ำ (น้ำดับไฟ)",
        advice: "ถวายเทียนหรือดอกไม้สีแดงเพื่อหนุนธาตุ นั่งสมาธิเพื่อลดความร้อน สวมสีแดง-ส้มในวันสำคัญ หลีกเลี่ยงสีดำ-น้ำเงินเข้ม"
    },
    "ธาตุดิน": {
        emoji: "⛰️", color: "#8B6914", bg: "#fdf6ec",
        dayName: "จันทร์/พฤหัส",
        trait: "มั่นคง อดทน น่าเชื่อถือ ยึดหลักการ",
        overview: "ธาตุดินให้ความมั่นคง น่าเชื่อถือ อดทน ขยัน มีหลักการ แต่บางครั้งดื้อรั้นและกลัวการเปลี่ยนแปลง ชอบความแน่นอน",
        work: "เหมาะอสังหาริมทรัพย์ เกษตร ก่อสร้าง บริหารจัดการ บัญชี งานระยะยาว — วางรากฐานอย่างมีระบบ ไม่ต้องรีบร้อน ผลลัพธ์จะยั่งยืน",
        money: "สะสมทรัพย์ได้ดีในระยะยาว เหมาะลงทุนในสิ่งจับต้องได้ — อสังหาริมทรัพย์ โลหะมีค่า ทอง ระวังเก็บออมแต่ลืมลงทุน",
        love: "ซื่อสัตย์ มั่นคง ดูแลคนรักได้ดี แต่ตัดสินใจช้า คู่ที่ดีคือธาตุไฟ (ให้พลังงาน) หรือธาตุทอง (ส่งเสริมกัน) — ระวังดื้อรั้นในความสัมพันธ์",
        health: "ระวังกระเพาะ ระบบย่อยอาหาร ข้อต่อ น้ำหนักตัว ควรออกกำลังกายสม่ำเสมอเพื่อกระตุ้นการไหลเวียนเลือด",
        luckyColor: "เหลือง น้ำตาล ครีม",
        luckyDir: "ทิศกลาง ทิศตะวันออกเฉียงใต้",
        luckyDay: "วันพฤหัสบดี",
        supportElem: "ธาตุไฟ (ไฟเผาดินให้แกร่ง), ธาตุทอง (ดินบ่มแร่ธาตุ)",
        avoidElem: "ธาตุน้ำ (น้ำกัดเซาะดิน), ธาตุไม้ (ไม้แทรกซึมดิน)",
        advice: "สวมเครื่องประดับทองหรือดินเผา วางหินธรรมชาติในบ้านเพื่อเสริมธาตุ ทำบุญบริจาคเครื่องมือการเกษตร สวมสีเหลือง-น้ำตาลในวันสำคัญ"
    },
    "ธาตุน้ำ": {
        emoji: "💧", color: "#0077b6", bg: "#f0f8ff",
        dayName: "พุธ/ศุกร์",
        trait: "ฉลาด ปรับตัวเก่ง สัญชาตญาณดี อ่อนไหว",
        overview: "ธาตุน้ำให้สติปัญญา ความยืดหยุ่น สัญชาตญาณลึก ความเมตตา แต่บางครั้งลังเล กังวลเกินเหตุ และถูกอารมณ์ครอบงำ",
        work: "เหมาะแพทย์ จิตวิทยา วิจัย ศิลปะ การท่องเที่ยว นักเขียน ที่ปรึกษา — งานที่ต้องใช้ความเข้าใจผู้คนและความคิดสร้างสรรค์",
        money: "มีสัญชาตญาณทางธุรกิจดี แต่มักลังเลจนพลาดโอกาส ควรฝึกตัดสินใจเร็วขึ้น และเชื่อสัญชาตญาณแรกมากขึ้น",
        love: "อ่อนไหว ลึกซึ้ง เห็นอกเห็นใจสูง แต่ต้องการความมั่นใจจากคนรัก คู่ที่ดีคือธาตุทอง (โลหะนำน้ำ) หรือธาตุไม้ (น้ำหล่อเลี้ยงไม้) — ระวังสะสมความเจ็บปวดในใจ",
        health: "ระวังไต ระบบสืบพันธุ์ ปัญหาฮอร์โมน และภาวะซึมเศร้า ควรดื่มน้ำเยอะๆ และออกกำลังกายในน้ำหรือใกล้น้ำ",
        luckyColor: "น้ำเงิน ดำ เทาเข้ม",
        luckyDir: "ทิศเหนือ",
        luckyDay: "วันจันทร์",
        supportElem: "ธาตุทอง (โลหะนำน้ำ), ธาตุไม้ (น้ำหล่อเลี้ยงไม้)",
        avoidElem: "ธาตุดิน (ดินกั้นทางน้ำ), ธาตุไฟ (น้ำ-ไฟขัดกัน)",
        advice: "วางของตกแต่งที่มีน้ำหรือรูปน้ำในบ้าน สวมเครื่องประดับโลหะเพื่อเสริมธาตุ ฝึกสมาธิเพื่อลดความกังวล สวมสีน้ำเงิน-เทาในวันสำคัญ"
    },
    "ธาตุลม": {
        emoji: "🌬️", color: "#0096c7", bg: "#f0fbff",
        dayName: "อังคาร",
        trait: "คล่องแคล่ว ไหวพริบดี สื่อสารเก่ง รักอิสระ",
        overview: "ธาตุลมให้ความคล่องแคล่ว ไหวพริบ ปรับตัวเร็ว สื่อสารเก่ง ชอบเสรีภาพ แต่บางครั้งกระจัดกระจาย ขาดสมาธิ และเบื่อง่าย",
        work: "เหมาะนักสื่อสาร ประชาสัมพันธ์ ไกด์ ผู้แทนขาย ล่าม นักแสดง — เหมาะงานที่ต้องพบปะผู้คน เคลื่อนที่ และสร้างเครือข่าย",
        money: "รายได้มาจากหลายช่องทางแต่มักกระจัดกระจาย ต้องรวมพลังและวางแผนการเงินระยะยาว ระวังใช้จ่ายตามอารมณ์",
        love: "มีเสน่ห์ น่าคบ ร่าเริง แต่ต้องการคู่รักที่ให้อิสระ คู่ที่ดีคือธาตุน้ำ (ลมพาฝน) หรือธาตุไฟ (ลมช่วยไฟ) — ระวังเบื่อง่ายเมื่อความตื่นเต้นหมดไป",
        health: "ระวังระบบทางเดินหายใจ ภูมิแพ้ โรคผิวหนัง ควรออกกำลังกายกลางแจ้งและหลีกเลี่ยงสถานที่อับทึบ",
        luckyColor: "เขียว เขียวอ่อน ฟ้าอ่อน",
        luckyDir: "ทิศตะวันออก",
        luckyDay: "วันอังคาร",
        supportElem: "ธาตุน้ำ (ลมพาฝน), ธาตุไฟ (ลมช่วยให้ไฟโชติช่วง)",
        avoidElem: "ธาตุทอง (โลหะตัดกระแสลม)",
        advice: "ปลูกต้นไม้ในบ้านและที่ทำงาน นั่งสมาธิเพื่อฝึกสมาธิ เลือกงานที่ได้เคลื่อนไหว สวมสีเขียว-ฟ้าอ่อนในวันสำคัญ"
    },
    "ธาตุไม้": {
        emoji: "🌳", color: "#2a9d8f", bg: "#f0fdf4",
        dayName: "ปีนักษัตร ขาล/เถาะ",
        trait: "สร้างสรรค์ เติบโต วิสัยทัศน์กว้าง ใจดี",
        overview: "ธาตุไม้ให้ความสร้างสรรค์ วิสัยทัศน์ การเติบโต ใจกว้าง มีเมตตา แต่บางครั้งดื้อรั้นเมื่อตัดสินใจแล้ว และต้องการการยืนยันจากผู้อื่น",
        work: "เหมาะครูอาจารย์ แพทย์ นักสิ่งแวดล้อม นักออกแบบ สถาปนิก นักเขียน — เหมาะพัฒนาความรู้และสร้างสิ่งใหม่ที่ยั่งยืน",
        money: "เหมาะลงทุนระยะยาว ขยายกิจการ ลงทุนในการศึกษาและความรู้ — ระวังเสี่ยงเกินพอดีในระยะสั้น อย่าปล่อยให้ใจดีทำให้เสียเปรียบ",
        love: "อบอุ่น ดูแลเอาใจใส่ เสียสละเพื่อคนรัก คู่ที่ดีคือธาตุน้ำ (น้ำหล่อเลี้ยงไม้) หรือธาตุดิน (ไม้หยั่งรากในดิน) — ระวังให้มากเกินจนตัวเองเหนื่อย",
        health: "ระวังตับ ถุงน้ำดี กล้ามเนื้อ และเส้นเอ็น ควรออกกำลังกายสม่ำเสมอและพักผ่อนให้เพียงพอ",
        luckyColor: "เขียว น้ำตาลอ่อน ฟ้า",
        luckyDir: "ทิศตะวันออก",
        luckyDay: "วันพุธ",
        supportElem: "ธาตุน้ำ (น้ำหล่อเลี้ยงไม้), ธาตุดิน (ไม้หยั่งรากในดิน)",
        avoidElem: "ธาตุทอง (ขวานตัดไม้), ธาตุไฟ (ไฟเผาไม้)",
        advice: "ปลูกต้นไม้ในบ้านและที่ทำงาน ใช้เฟอร์นิเจอร์ไม้จริง ทำบุญถวายต้นไม้หรือปล่อยสัตว์ สวมสีเขียวในวันสำคัญ"
    },
    "ธาตุทอง": {
        emoji: "🪙", color: "#B8860B", bg: "#fffbf0",
        dayName: "ปีนักษัตร วอก/ระกา",
        trait: "เด็ดขาด มีระเบียบ ยุติธรรม มุ่งมั่น",
        overview: "ธาตุทองให้ความเด็ดขาด มีระเบียบ ยุติธรรม มุ่งมั่น ตรงไปตรงมา แต่บางครั้งแข็งกร้าวเกินไปและขาดความยืดหยุ่น",
        work: "เหมาะการเงิน บัญชี กฎหมาย ทหาร ตำรวจ วิศวกรรม เครื่องจักร — เหมาะสร้างระบบ กฎเกณฑ์ และตรวจสอบความถูกต้อง",
        money: "มีระเบียบวินัยทางการเงินสูง วางแผนรอบคอบ เหมาะลงทุนในสิ่งที่มีความมั่นคง — หลีกเลี่ยงการพนันและความเสี่ยงสูง",
        love: "จริงจังในความสัมพันธ์ ซื่อสัตย์ แต่อาจดูเย็นชาเกินไป คู่ที่ดีคือธาตุดิน (ดินสร้างทอง) หรือธาตุน้ำ (ทองเรียกน้ำ) — ฝึกแสดงความรู้สึกให้มากขึ้น",
        health: "ระวังปอด ระบบทางเดินหายใจ ผิวหนัง ควรฝึกหายใจลึกๆ สม่ำเสมอ ออกกำลังกายเบาๆ เช่น โยคะหรือไทชิ",
        luckyColor: "ขาว เงิน ทอง",
        luckyDir: "ทิศตะวันตก",
        luckyDay: "วันเสาร์",
        supportElem: "ธาตุดิน (ดินสร้างแร่ธาตุ), ธาตุน้ำ (ทองละลายเป็นน้ำ)",
        avoidElem: "ธาตุไฟ (ไฟหลอมทอง), ธาตุลม (ลมกัดกร่อนโลหะ)",
        advice: "สวมเครื่องประดับทองหรือเงิน วางสิ่งของโลหะในทิศตะวันตก ทำบุญถวายเครื่องมือแพทย์ สวมสีขาว-เงินในวันสำคัญ"
    }
};

const ELEM_THAI_DAYS = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const ELEM_EMOJI = { "ธาตุไฟ":"🔥","ธาตุดิน":"⛰️","ธาตุน้ำ":"💧","ธาตุลม":"🌬️","ธาตุไม้":"🌳","ธาตุทอง":"🪙" };
function selectElemMember(birthdate, name) {
    // แปลง dd/mm/yyyy (พ.ศ. หรือ ค.ศ.) → yyyy-mm-dd (ค.ศ.)
    let dateISO = '';
    if (birthdate && birthdate.includes('/')) {
        const parts = birthdate.split('/');
        let year = parseInt(parts[2]);
        year = toCE(year);
        dateISO = `${year}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    } else if (birthdate && birthdate.includes('-')) {
        dateISO = birthdate.split('T')[0];
    }
    const d = document.getElementById('elemPersonalDate');
    const n = document.getElementById('elemPersonalName');
    if (d) d.value = dateISO;
    if (n) n.value = name || '';
    calculatePersonalElement();
}

function renderElemHistory() {
    const container = document.getElementById('elemHistoryList');
    if (!container) return;

    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    const history = typeof filterHistoryByCurrentUser === 'function'
        ? filterHistoryByCurrentUser(allHistory)
        : allHistory;

    if (!history.length) {
        container.innerHTML = '<small class="text-muted">ยังไม่มีสมาชิก — เพิ่มสมาชิกในระบบก่อน</small>';
        return;
    }

    const options = history.map(m => {
        const fullName = [m.name, m.lastName].filter(Boolean).join(' ') || 'ไม่มีชื่อ';
        const birthdate = m.birthdate || '';
        const value = JSON.stringify({ birthdate, name: fullName });
        return `<option value='${value.replace(/'/g,"&apos;")}'>${fullName} — ${birthdate}</option>`;
    }).join('');

    container.innerHTML = `
        <div class="row align-items-center">
          <div class="col-md-8 mb-2 mb-md-0">
            <select id="elemMemberSelect" class="form-control border-gold text-dark" style="background:#ffffff !important; color:#111827 !important; border:2px solid #d4af37 !important;">
              <option value="">— เลือกสมาชิก (${history.length} คน) —</option>
              ${options}
            </select>
          </div>
          <div class="col-md-4">
            <button class="btn btn-gold btn-block" onclick="onElemMemberSelect()">
              🔮 วิเคราะห์ธาตุ
            </button>
          </div>
        </div>`;
}

function onElemMemberSelect() {
    const sel = document.getElementById('elemMemberSelect');
    if (!sel || !sel.value) { Swal.fire('แจ้งเตือน', 'กรุณาเลือกสมาชิก', 'warning'); return; }
    try {
        const m = JSON.parse(sel.value);
        selectElemMember(m.birthdate, m.name);
    } catch { Swal.fire('เกิดข้อผิดพลาด', 'ข้อมูลไม่ถูกต้อง', 'error'); }
}

function getRelBadge(relStr) {
    const s = typeof relStr === 'string' ? relStr : '';
    if (!s) return { icon:'〰️', cls:'warning', label:'เป็นกลาง' };
    if (s.includes('หนุนส่ง') || s.includes('เกื้อกูล') || s.includes('ธาตุเดียวกัน'))
        return { icon:'✅', cls:'success', label:'ส่งเสริม' };
    if (s.includes('พิฆาต'))
        return { icon:'⚠️', cls:'danger', label:'ขัดแย้ง' };
    return { icon:'〰️', cls:'warning', label:'เป็นกลาง' };
}

function calculatePersonalElement() {
    const inp = document.getElementById('elemPersonalDate');
    if (!inp || !inp.value) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกวันเกิด', 'warning');
        return;
    }
    const nameInp = document.getElementById('elemPersonalName');
    const memberName = nameInp ? nameInp.value.trim() : '';

    const parts = inp.value.split('-');
    const yr = parseInt(parts[0]), mo = parseInt(parts[1]) - 1, dy = parseInt(parts[2]);
    const dateObj = new Date(yr, mo, dy);
    if (isNaN(dateObj.getTime())) { Swal.fire('เกิดข้อผิดพลาด', 'วันเกิดไม่ถูกต้อง', 'error'); return; }

    const dow = dateObj.getDay();
    const dayElem   = getBirthElement(dow);   // { name:"ธาตุไฟ", level:"(ไฟแรง)", ... }
    const monthElem = getMonthElement(mo);    // { name:"ธาตุน้ำ", level:"(ต้นธาตุ)", ... }
    const zodElem   = getZodiacElement(dateObj); // { name:"ชวด", element:"ธาตุน้ำ", ... }

    const dayKey  = dayElem.name;             // "ธาตุไฟ"
    const moKey   = monthElem.name;           // "ธาตุน้ำ"
    const zodKey  = zodElem.element || zodElem.name; // "ธาตุน้ำ" or "ธาตุไม้"

    // Relationships (force string — getElementRelation may return undefined for unknown pairs)
    const relDayMo  = String(getElementRelation(dayKey, moKey)  || 'เป็นกลาง');
    const relDayZod = String(getElementRelation(dayKey, zodKey) || 'เป็นกลาง');
    const relMoZod  = String(getElementRelation(moKey, zodKey)  || 'เป็นกลาง');

    const bdDay  = getRelBadge(relDayMo);
    const bdZod  = getRelBadge(relDayZod);
    const bdMoZ  = getRelBadge(relMoZod);

    // Harmony score (positive=+1, neutral=0, negative=-1)
    const score = [bdDay, bdZod, bdMoZ].reduce((s, b) => {
        return s + (b.cls === 'success' ? 1 : b.cls === 'danger' ? -1 : 0);
    }, 0);
    const harmonyStars = score >= 2 ? '⭐⭐⭐⭐⭐' : score === 1 ? '⭐⭐⭐⭐' : score === 0 ? '⭐⭐⭐' : score === -1 ? '⭐⭐' : '⭐';
    const harmonyLabel = score >= 2 ? 'ธาตุประสานกันดีมาก' : score === 1 ? 'ธาตุค่อนข้างสมดุล' : score === 0 ? 'ธาตุเป็นกลาง ควรเสริม' : score === -1 ? 'ธาตุขัดแย้งบางส่วน ควรระวัง' : 'ธาตุขัดแย้งสูง ต้องเสริมสมดุล';

    const fortune = ELEM_FORTUNE[dayKey] || ELEM_FORTUNE["ธาตุดิน"];
    const dayEmoji  = ELEM_EMOJI[dayKey]  || '✨';
    const moEmoji   = ELEM_EMOJI[moKey]   || '✨';
    const zodEmoji  = ELEM_EMOJI[zodKey]  || '✨';

    const thaiDate = `${dy} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][mo]} ${yr + 543}`;

    const html = `
    <div class="card shadow-sm border-gold mb-4 animate__animated animate__fadeIn">
      <div class="card-header text-center py-3" style="background:${fortune.bg}; border-bottom:2px solid #d4af37;">
        <div style="font-size:2.5rem;">${fortune.emoji}</div>
        ${memberName ? `<div class="mb-1" style="font-size:1.15rem;font-weight:800;color:#2c1810;">👤 ${memberName}</div>` : ''}
        <h5 class="mb-0" style="font-weight:800; color:${fortune.color}; font-size:1.35rem;">${dayKey} <small style="font-size:0.85rem; color:#555; font-weight:600;">${dayElem.level || ''}</small></h5>
        <small class="text-dark font-weight-bold">เกิดวัน${ELEM_THAI_DAYS[dow]} ${thaiDate} — ปีนักษัตร${zodElem.name || '?'}</small>
      </div>
      <div class="card-body bg-white">

        <!-- 3 Element badges -->
        <div class="row text-center mb-4">
          <div class="col-4">
            <div class="p-2 rounded border" style="border-color:#d4af37 !important; background:${fortune.bg};">
              <div style="font-size:1.6rem;">${dayEmoji}</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">ธาตุวัน (ตัวตน)</div>
              <div class="font-weight-bold" style="font-size:0.95rem;color:#2c1810;">${dayKey}</div>
              <div style="font-size:0.7rem;color:#666;">${dayElem.level || ''}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="p-2 rounded border" style="border-color:#d4af37 !important; background:#f8f9fa;">
              <div style="font-size:1.6rem;">${moEmoji}</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">ธาตุเดือน (สภาพแวดล้อม)</div>
              <div class="font-weight-bold" style="font-size:0.95rem;color:#2c1810;">${moKey}</div>
              <div style="font-size:0.7rem;color:#666;">${monthElem.level || ''}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="p-2 rounded border" style="border-color:#d4af37 !important; background:#f8f9fa;">
              <div style="font-size:1.6rem;">${zodEmoji}</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">ธาตุปี (รากฐาน)</div>
              <div class="font-weight-bold" style="font-size:0.95rem;color:#2c1810;">${zodKey}</div>
              <div style="font-size:0.7rem;color:#666;">ปี${zodElem.name || ''}</div>
            </div>
          </div>
        </div>

        <!-- Element balance -->
        <div class="alert border-gold bg-white mb-4 p-3 shadow-sm">
          <div class="text-center mb-2">
            <strong style="color:#8b6914; font-size:1.1rem; font-weight:800;">⚖️ สมดุลธาตุ: ${harmonyStars}</strong>
            <small class="d-block text-dark font-weight-bold mt-1" style="font-size:0.9rem;">${harmonyLabel}</small>
          </div>
          <div class="row text-center" style="font-size:0.82rem;">
            <div class="col-4">
              <div class="mb-1 font-weight-bold text-dark">${dayEmoji} วัน × ${moEmoji} เดือน</div>
              <span class="badge badge-${bdDay.cls} px-2 py-1">${bdDay.icon} ${bdDay.label}</span>
              <div class="text-dark font-weight-bold mt-1" style="font-size:0.75rem;">${relDayMo}</div>
            </div>
            <div class="col-4">
              <div class="mb-1 font-weight-bold text-dark">${dayEmoji} วัน × ${zodEmoji} ปี</div>
              <span class="badge badge-${bdZod.cls} px-2 py-1">${bdZod.icon} ${bdZod.label}</span>
              <div class="text-dark font-weight-bold mt-1" style="font-size:0.75rem;">${relDayZod}</div>
            </div>
            <div class="col-4">
              <div class="mb-1 font-weight-bold text-dark">${moEmoji} เดือน × ${zodEmoji} ปี</div>
              <span class="badge badge-${bdMoZ.cls} px-2 py-1">${bdMoZ.icon} ${bdMoZ.label}</span>
              <div class="text-dark font-weight-bold mt-1" style="font-size:0.75rem;">${relMoZod}</div>
            </div>
          </div>
        </div>

        <!-- Personal trait -->
        <div class="mb-3 p-3 rounded" style="background:${fortune.bg}; border-left:4px solid ${fortune.color};">
          <strong style="color:${fortune.color}; font-size:1.05rem;">${fortune.emoji} ลักษณะประจำธาตุ</strong>
          <p class="mb-0 mt-1 small text-dark" style="line-height:1.6; font-size:0.9rem;">${fortune.overview}</p>
        </div>

        <!-- Fortune by category -->
        <div class="mb-2"><strong style="color:#8b6914; font-size:1.05rem; font-weight:800;">📋 พยากรณ์รายด้าน</strong></div>
        ${[
            ['💼','การงาน', fortune.work],
            ['💰','การเงิน', fortune.money],
            ['❤️','ความรัก', fortune.love],
            ['🏥','สุขภาพ', fortune.health]
        ].map(([ic,lb,tx]) => `
        <div class="d-flex align-items-start mb-3">
          <span style="font-size:1.3rem;min-width:32px;">${ic}</span>
          <div>
            <strong class="text-dark" style="font-size:0.92rem; font-weight:700;">${lb}</strong>
            <p class="mb-0 small text-dark" style="line-height:1.5;">${tx}</p>
          </div>
        </div>`).join('')}

        <!-- Lucky -->
        <div class="row text-center mt-3 mb-3">
          <div class="col-4">
            <div class="p-2 rounded border" style="background:#fffde7; border-color:#ffe082 !important;">
              <div style="font-size:1.2rem;">🎨</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">สีมงคล</div>
              <div style="font-size:0.85rem;font-weight:700;color:#2c1810;">${fortune.luckyColor}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="p-2 rounded border" style="background:#e8f5e9; border-color:#a5d6a7 !important;">
              <div style="font-size:1.2rem;">🧭</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">ทิศมงคล</div>
              <div style="font-size:0.85rem;font-weight:700;color:#2c1810;">${fortune.luckyDir}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="p-2 rounded border" style="background:#e3f2fd; border-color:#90caf9 !important;">
              <div style="font-size:1.2rem;">📅</div>
              <div style="font-size:0.75rem;color:#555;font-weight:600;">วันมงคล</div>
              <div style="font-size:0.85rem;font-weight:700;color:#2c1810;">${fortune.luckyDay}</div>
            </div>
          </div>
        </div>

        <!-- Support/avoid elements -->
        <div class="row mb-3">
          <div class="col-6">
            <div class="p-2 rounded border border-success bg-white text-center shadow-sm" style="font-size:0.85rem;">
              <div class="text-success font-weight-bold mb-1" style="font-size:0.9rem;">✅ ธาตุเกื้อกูล</div>
              <div class="text-dark font-weight-bold">${fortune.supportElem}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 rounded border border-danger bg-white text-center shadow-sm" style="font-size:0.85rem;">
              <div class="text-danger font-weight-bold mb-1" style="font-size:0.9rem;">⚠️ ธาตุควรระวัง</div>
              <div class="text-dark font-weight-bold">${fortune.avoidElem}</div>
            </div>
          </div>
        </div>

        <!-- Advice -->
        <div class="alert border-gold bg-white p-3 shadow-sm" style="border-left:4px solid #8b6914 !important;">
          <strong style="color:#8b6914; font-size:1rem;">🙏 คำแนะนำเสริมธาตุ</strong>
          <p class="mb-0 small mt-1 text-dark" style="line-height:1.6; font-size:0.88rem;">${fortune.advice}</p>
        </div>

        <!-- Zodiac job -->
        <div class="text-center mt-2 p-2 bg-light rounded border">
          <small class="text-dark font-weight-bold" style="font-size:0.85rem;">อาชีพเหมาะสมตามนักษัตร${zodElem.name || ''}: <span style="color:#8b6914;">${zodElem.job || '-'}</span></small>
        </div>

      </div>
    </div>`;

    const result = document.getElementById('elemPersonalResult');
    if (result) {
        result.innerHTML = html;
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

}

// ===== Render Main Page =====
function renderElementManual() {
    const container = document.getElementById("elementManualContainer");
    if (!container) return;

    const html = `
    <div class="container mt-4">
      <div class="card shadow-lg border-gold">
        <div class="card-header bg-dark text-white text-center py-4" style="border-bottom:3px solid #d4af37;">
          <h2 class="mb-1" style="font-weight:800; color:#ffd700 !important; text-shadow:1px 1px 2px #000;">📜 คัมภีร์ธาตุพยากรณ์</h2>
          <span style="color:#e0e0e0; font-size:0.95rem;">วิชาว่าด้วยการหนุนส่งและหักล้างของเบญจธาตุตามตำราโบราณ</span>
        </div>
        <div class="card-body bg-light text-dark">

          <!-- Personal Reading Form -->
          <div class="card shadow-sm border-gold mb-4">
            <div class="card-header bg-dark text-white py-3 text-center" style="border-bottom:2px solid #d4af37;">
              <h5 class="mb-0" style="color:#ffd700 !important; font-weight:700;">🔮 วิเคราะห์ธาตุรายบุคคล</h5>
              <small style="color:#ddd;">กรอกชื่อและวันเกิดเพื่อดูธาตุตัวตน พยากรณ์รายด้าน และคำแนะนำเสริมธาตุ</small>
            </div>
            <div class="card-body bg-white">

              <!-- Member dropdown -->
              <div class="mb-4 pb-3" style="border-bottom:1px dashed #d4af37;">
                <div class="mb-2" style="font-weight:700;color:#8b6914;font-size:0.95rem;">
                  👥 เลือกสมาชิกจากประวัติ
                </div>
                <div id="elemHistoryList">
                  <small class="text-muted">กำลังโหลด...</small>
                </div>
              </div>

              <!-- Manual input -->
              <div class="mb-2" style="font-weight:700;color:#8b6914;font-size:0.95rem;">
                ✍️ หรือกรอกเองด้วยตนเอง
              </div>
              <div class="row align-items-end">
                <div class="col-md-4 mb-3 mb-md-0">
                  <label class="font-weight-bold mb-1 text-dark" style="font-size:0.9rem;">👤 ชื่อ (ไม่บังคับ)</label>
                  <input type="text" id="elemPersonalName" class="form-control text-dark" placeholder="ชื่อสำหรับแสดงในผลลัพธ์"
                         style="background:#ffffff !important; color:#111827 !important; border:2px solid #d4af37 !important;" maxlength="50">
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                  <label class="font-weight-bold mb-1 text-dark" style="font-size:0.9rem;">📅 วันเกิด (ปี ค.ศ.)</label>
                  <input type="date" id="elemPersonalDate" class="form-control border-gold text-dark font-weight-bold"
                         style="background:#ffffff !important; color:#111827 !important; border:2px solid #d4af37 !important;" min="1900-01-01">
                </div>
                <div class="col-md-4">
                  <button class="btn btn-gold btn-block py-2 font-weight-bold" onclick="calculatePersonalElement()" style="font-size:1rem; background-color:#d4af37; color:#000;">
                    🔮 วิเคราะห์ธาตุ
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Personal Result (filled by calculatePersonalElement) -->
          <div id="elemPersonalResult" style="display:none;"></div>

          <hr class="my-4" style="border-color:#d4af37;">

          <!-- Creative Cycle -->
          <div class="mb-5">
            <h5 class="mb-3" style="color:#8b6914; font-weight:800; border-left:4px solid #8b6914; padding-left:10px;">
              ✨ วงจรหนุนส่ง (Creative Cycle)
            </h5>
            <p class="text-dark small mb-3 font-weight-bold">ธาตุที่ส่งเสริมกัน อยู่ด้วยกันแล้วจะช่วยผลักดันให้เกิดความเจริญรุ่งเรือง</p>
            <div class="row text-center g-2">
              <div class="col-6 col-md-4 mb-2"><div id="manual-ไม้" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🌳 ไม้ <span style="color:#8b6914;font-weight:800;">→</span> 🔥 ไฟ<div class="user-label mt-1"></div></div></div>
              <div class="col-6 col-md-4 mb-2"><div id="manual-ไฟ" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🔥 ไฟ <span style="color:#8b6914;font-weight:800;">→</span> ⛰️ ดิน<div class="user-label mt-1"></div></div></div>
              <div class="col-6 col-md-4 mb-2"><div id="manual-ดิน" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">⛰️ ดิน <span style="color:#8b6914;font-weight:800;">→</span> 🪙 ทอง<div class="user-label mt-1"></div></div></div>
              <div class="col-6 col-md-4 mb-2"><div id="manual-ทอง" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🪙 ทอง <span style="color:#8b6914;font-weight:800;">→</span> 💧 น้ำ<div class="user-label mt-1"></div></div></div>
              <div class="col-6 col-md-4 mb-2"><div id="manual-น้ำ" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">💧 น้ำ <span style="color:#8b6914;font-weight:800;">→</span> 🌳 ไม้<div class="user-label mt-1"></div></div></div>
              <div class="col-6 col-md-4 mb-2"><div id="manual-ลม" class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🌬️ ลม <span style="color:#8b6914;font-weight:800;">→</span> 🔥 ไฟ<div class="user-label mt-1"></div></div></div>
            </div>
          </div>

          <!-- Destructive Cycle -->
          <div class="mb-5">
            <h5 class="text-danger mb-3" style="border-left:4px solid #dc3545; padding-left:10px; font-weight:800;">
              ⚔️ วงจรหักล้าง (Destructive Cycle)
            </h5>
            <div class="row text-center g-2">
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🔥 ไฟ <span class="text-danger font-weight-bold">⚔️</span> 🪙 ทอง</div></div>
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🪙 ทอง <span class="text-danger font-weight-bold">⚔️</span> 🌳 ไม้</div></div>
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🌳 ไม้ <span class="text-danger font-weight-bold">⚔️</span> ⛰️ ดิน</div></div>
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">⛰️ ดิน <span class="text-danger font-weight-bold">⚔️</span> 💧 น้ำ</div></div>
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">💧 น้ำ <span class="text-danger font-weight-bold">⚔️</span> 🔥 ไฟ</div></div>
              <div class="col-6 col-md-4 mb-2"><div class="p-3 border bg-white rounded shadow-sm text-dark font-weight-bold">🪙 ทอง <span class="text-danger font-weight-bold">⚔️</span> 🌬️ ลม</div></div>
            </div>
          </div>

          <!-- Mediator Table -->
          <div class="alert alert-secondary border-gold bg-white p-4 shadow-sm">
            <h5 class="text-center mb-4" style="font-weight:800; color:#8b6914;">💡 เคล็ดลับการประสานธาตุ (The Mediator)</h5>
            <div class="table-responsive">
              <table class="table table-hover table-bordered mb-0" style="font-size:1.05rem;">
                <thead class="table-dark text-center" style="color:#ffd700;">
                  <tr><th>คู่หักล้าง (ศัตรูธาตุ)</th><th>ธาตุประสาน (ตัวช่วยลดความขัดแย้ง)</th></tr>
                </thead>
                <tbody class="text-center text-dark font-weight-bold bg-white">
                  <tr><td>🔥 ไฟ ⚔️ 🪙 ทอง</td><td>⛰️ <b style="color:#8b6914;">ดิน</b> <small class="text-muted font-weight-normal">(ไฟสร้างดิน, ดินสร้างทอง)</small></td></tr>
                  <tr><td>🪙 ทอง ⚔️ 🌳 ไม้</td><td>💧 <b style="color:#0077b6;">น้ำ</b> <small class="text-muted font-weight-normal">(ทองสร้างน้ำ, น้ำเลี้ยงไม้)</small></td></tr>
                  <tr><td>🌳 ไม้ ⚔️ ⛰️ ดิน</td><td>🔥 <b style="color:#c0392b;">ไฟ</b> <small class="text-muted font-weight-normal">(ไม้สร้างไฟ, ไฟสร้างดิน)</small></td></tr>
                  <tr><td>⛰️ ดิน ⚔️ 💧 น้ำ</td><td>🪙 <b style="color:#b8860b;">ทอง</b> <small class="text-muted font-weight-normal">(ดินสร้างทอง, ทองสร้างน้ำ)</small></td></tr>
                  <tr><td>💧 น้ำ ⚔️ 🔥 ไฟ</td><td>🌳 <b style="color:#2a9d8f;">ไม้</b> <small class="text-muted font-weight-normal">(น้ำเลี้ยงไม้, ไม้สร้างไฟ)</small></td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div class="row mt-4 mx-1 mb-2">
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
      </div>
    </div>`;

    container.innerHTML = html;
    renderElemHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    renderElementManual();
});
