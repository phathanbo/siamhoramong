"use strict";

(function() {
    // --- Constants ---
    const LIFE_GRAPH_LABELS = [
        "วาสนา", "ทรัพย์", "เพื่อน", "ญาติ", "บุตร", "บริวาร",
        "ศัตรู", "คู่ครอง", "โรคภัย", "ความสุข", "การงาน", "ลาภยศ"
    ];

    const ASTRO_SUNRISE_HOUR = 6; // ตัดรอบวันใหม่ทางโหราศาสตร์ที่ 6.00 น.
    const THAI_ZODIAC_CHANGE_MONTH = 3; // เดือนที่เปลี่ยนปีนักษัตร (0-11, 3=เม.ย.)
    const ZODIAC_BASE_YEAR_OFFSET = 1983; // ปีฐานสำหรับคำนวณนักษัตร (1984 = ปีชวด)

    // --- Helper Functions ---

    /* หมายเหตุ: ฟังก์ชัน parseBirthdate ถูกย้ายไปที่ utils-helpers.js แล้ว */

    function calculateFortuneScore(points) {
        const maxTotal = 7 * 12; // คะแนนเต็ม
        const total = points.reduce((a, b) => a + b, 0);
        return Math.round((total / maxTotal) * 100);
    }

    function getFortuneLevel(score) {
        if (score >= 80) return "ดวงแข็งมาก มีวาสนาและโอกาสสูง";
        if (score >= 65) return "ดวงดี มีความก้าวหน้าในชีวิต";
        if (score >= 50) return "ดวงปานกลาง ชีวิตขึ้นอยู่กับความพยายาม";
        if (score >= 35) return "ดวงอ่อน ต้องพยายามมากกว่าคนอื่น";
        return "ดวงตก มีอุปสรรค ควรเสริมบุญบารมี";
    }

    function getMonthlyFortune(points) {
        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const startMonth = new Date().getMonth();
        let result = [];
        for (let i = 0; i < 12; i++) {
            const score = points[(i + startMonth) % 12];
            let text = "";

            if (score >= 6) {
                text = "🌟 ดวงดี มีโอกาสสำเร็จ การเงินดี";
            } else if (score >= 4) {
                text = "⚖️ ดวงปานกลาง ต้องใช้ความพยายาม";
            } else {
                text = "⚠️ ดวงอ่อน ระวังอุปสรรคและรายจ่าย";
            }

            result.push({
                month: months[i],
                score: score,
                text: text
            });
        }
        return result;
    }

    function renderMonthlyFortune(points) {
        const data = getMonthlyFortune(points);
        let html = `
        <div class="mt-4 p-3 border-gold bg-dark shadow rounded" style="border:1px solid #d4af37;">
            <h4 class="text-gold mb-3 border-bottom pb-2">📅 ดวงชะตา 12 เดือน</h4>
        `;
        data.forEach(m => {
            html += `
            <div class="mb-2 border-bottom border-secondary pb-1 text-white small">
                <b>${m.month}</b> (${m.score}) : ${m.text}
            </div>
            `;
        });
        html += `</div>`;
        return html;
    }

    function calculateLifeGraph(passedMemberId) {
        let input = null;
        
        // 1️⃣ ลองดึงจาก currentMemberId ก่อน
        if (typeof currentMemberId !== "undefined" && currentMemberId) {
            if (typeof getProfileByMemberId === "function") {
                const profileData = getProfileByMemberId(currentMemberId);
                if (profileData && profileData.birthdate) {
                    input = profileData.birthdate;
                    console.log("✅ ดึงจากโปรไฟล์:", input);
                }
            }
        }
        
        // 2️⃣ ถ้าไม่มี → ดึงจาก form
        if (!input) {
            input = document.getElementById('birthdate')?.value;
        }
        
        // 3️⃣ ถ้ายังไม่มี → ดึงจากโปรไฟล์ที่แสดง
        if (!input) {
            input = document.getElementById('profBirth')?.innerText;
        }

        // เรียกใช้ฟังก์ชันแปลงฟอร์แมตวันเกิดที่ย้ายไปตัวช่วยส่วนกลาง
        const birthDate = typeof parseBirthdate === "function" ? parseBirthdate(input) : (input ? new Date(input) : null);
        if (!birthDate || isNaN(birthDate.getTime())) {
            if (typeof Swal !== "undefined") {
                Swal.fire('แจ้งเตือน', 'กรุณากรอกวันเกิดให้ถูกต้อง', 'warning');
            } else {
                alert('กรุณากรอกวันเกิดให้ถูกต้อง');
            }
            return;
        }

        localStorage.setItem('userBirthdate', birthDate.toISOString().split('T')[0]);
     
        // 1. คำนวณวัน (Day) ตามหลักโหราศาสตร์ไทย (ตัดวันตอน 6.00 น.)
        let d = birthDate.getDay() + 1; // 1=Sun, 2=Mon...
        if (birthDate.getHours() < ASTRO_SUNRISE_HOUR) {
            d = d - 1;
            if (d < 1) d = 7;
        }

        // 2. คำนวณเดือน (Month) แบบไทย (เดือนอ้าย=1(ธ.ค.), ยี่=2(ม.ค.), ..., 5(เม.ย.))
        let m = (birthDate.getMonth() + 2) % 12;
        if (m === 0) m = 12;

        // 3. คำนวณปีนักษัตร (Year) ตามหลักโหราศาสตร์ (เปลี่ยนปีนักษัตรในช่วงเดือนเมษายน หรือเดือน 5)
        let yearThai = birthDate.getFullYear();
        if (birthDate.getMonth() < THAI_ZODIAC_CHANGE_MONTH) {
            yearThai -= 1;
        }
        // คำนวณรหัสปีนักษัตร (ชวด=1, ฉลู=2 ... กุน=12)
        let y = (yearThai - ZODIAC_BASE_YEAR_OFFSET) % 12;
        if (y <= 0) y += 12;

        // 4. คำนวณจุดทั้ง 12 ภพ
        const points = Array.from({ length: 12 }, (_, i) => {
            let val = (d + m + y + i) % 7;
            return val === 0 ? 7 : val;
        });
     
        renderLifeGraph(points);
        renderLifeGraphTable(points);
     
        if (typeof navigateTo === "function") {
            navigateTo('lifeGraphPage');
        }
    }

    function getLifeGraphAdvice(label, score) {
        const adviceMap = {
            "วาสนา": score >= 5 ?
                "ดวงชะตาแข็งแกร่ง มีบารมีเก่าหนุนนำ ทำอะไรก็มักมีคนเกรงใจและได้รับโอกาสดีๆ เสมอ" :
                (score <= 2 ? "วาสนาอาภัพในวัยต้น ต้องสร้างทุกอย่างด้วยน้ำพักน้ำแรงตนเอง เหนื่อยก่อนแล้วจะสบายภายหลัง" :
                    "ดวงปานกลาง มีชีวิตราบรื่นตามอัตภาพ หมั่นทำบุญเสริมบารมีจะช่วยให้รุ่งเรืองยิ่งขึ้น"),

            "ทรัพย์": score >= 5 ?
                "การเงินโดดเด่นมั่งคั่ง มีทรัพย์สินพูนทวี หยิบจับอะไรก็เป็นเงินเป็นทอง มีโชคด้านการลงทุน" :
                (score <= 2 ? "การเงินฝืดเคืองหรือมีรายจ่ายสูง ระวังการใช้จ่ายเกินตัว ควรวางแผนออมเงินอย่างเคร่งครัด" :
                    "ฐานะปานกลาง มีกินมีใช้ไม่ขาดมือแต่ไม่ถึงกับร่ำรวยโลดโผน ต้องบริหารเงินให้รอบคอบ"),

            "เพื่อน": score >= 5 ?
                "มีกัลยาณมิตรดี เพื่อนฝูงคอยซัพพอร์ตและนำพาสิ่งดีๆ มาให้เสมอ สังคมกว้างขวาง" :
                (score <= 2 ? "เพื่อนน้อยหรือพึ่งพาไม่ค่อยได้ ระวังจะเดือดร้อนหรือเสียทรัพย์เพราะคนรอบข้าง" :
                    "มีเพื่อนมากหน้าหลายตา ให้เลือกคบคนที่ชักชวนไปในทางที่เจริญจะส่งเสริมดวง"),

            "ญาติ": score >= 5 ?
                "ญาติพี่น้องรักใคร่กลมเกลียว เป็นที่พึ่งพาอาศัยได้และคอยช่วยเหลือในยามคับขัน" :
                (score <= 2 ? "ต้องพึ่งพาตนเองเป็นหลัก ญาติพี่น้องอาจนำเรื่องร้อนใจมาให้ หรืออยู่ห่างกันจะดีกว่า" :
                    "ความสัมพันธ์กับญาติอยู่ในเกณฑ์ปกติ มีการช่วยเหลือเกื้อกูลกันตามสมควร"),

            "บุตร": score >= 5 ?
                "มีบุตรบริวารที่ดี เป็นอภิชาตบุตร หรือการเริ่มต้นโปรเจกต์ใหม่ๆ มักจะประสบความสำเร็จง่าย" :
                (score <= 2 ? "บุตรหรือบริวารอาจนำเรื่องปวดหัวมาให้ หรือมีบุตรยาก ต้องใช้ความอดทนในการอบรมสั่งสอน" :
                    "บุตรอยู่ในโอวาทปานกลาง มีเรื่องให้ต้องดูแลเอาใจใส่ตามวัย"),

            "บริวาร": score >= 5 ?
                "มีบารมีปกครองคน ลูกน้องซื่อสัตย์และทำงานถวายหัว มักได้รับความร่วมมือที่ดีจากผู้ใต้บังคับบัญชา" :
                (score <= 2 ? "บริวารมักสร้างปัญหาหรืออยู่ไม่ทน ระวังถูกเอาเปรียบหรือคดโกงจากคนใกล้ชิด" :
                    "การปกครองคนต้องใช้ทั้งเมตตาและเดชจึงจะคุมบริวารอยู่"),

            "ศัตรู": score >= 5 ?
                "**ระวัง!** ศัตรูมีกำลังแรง มีคนจ้องขัดขวางหรืออิจฉา ควรทำตัวให้เด่นน้อยที่สุดเพื่อลดแรงปะทะ" :
                (score <= 2 ? "ศัตรูพ่ายแพ้ภัยตนเอง ชีวิตสงบสุข ไร้คนขัดขวางหรืออุปสรรคขวากหนามที่รุนแรง" :
                    "มีคนไม่สมหวังดีบ้างเป็นธรรมดา อย่าเก็บมาใส่ใจ ให้มุ่งมั่นทำหน้าที่ของตนเอง"),

            "คู่ครอง": score >= 5 ?
                "คู่ครองดี ส่งเสริมดวงชะตา เป็นคู่คิดคู่ยากที่ช่วยกันสร้างฐานะจนมั่นคง" :
                (score <= 2 ? "ความรักมีอุปสรรค หรือคู่ครองมักมีความเห็นขัดแย้งกัน ควรใช้เหตุผลมากกว่าอารมณ์" :
                    "ชีวิตคู่ปานกลาง มีสุขมีทุกข์ปนกันไป ต้องหมั่นเติมความเข้าใจให้กันเสมอ"),

            "โรคภัย": score >= 5 ?
                "**ควรระวัง!** มีเกณฑ์เจ็บป่วยบ่อยหรือมีโรคเรื้อรังรบกวน ควรตรวจสุขภาพสม่ำเสมอและไม่ประมาท" :
                (score <= 2 ? "ร่างกายแข็งแรงดี มีภูมิต้านทานสูง หากเจ็บป่วยก็จะหายได้อย่างรวดเร็ว" :
                    "สุขภาพปานกลาง ระวังโรคเล็กๆ น้อยๆ จากการพักผ่อนไม่พอหรือความเครียดสะสม"),

            "ความสุข": score >= 5 ?
                "ชีวิตมีความสุขสมบูรณ์ สุขภาพจิตดี ครอบครัวอบอุ่นและมีความมั่นคงในจิตใจสูง" :
                (score <= 2 ? "มีความเครียดง่าย หรือในบ้านมีเรื่องให้ร้อนใจบ่อย ควรหาเวลาพักผ่อนและเข้าหาธรรมะ" :
                    "ความสุขหาได้ตามอัตภาพ มีเรื่องให้ลุ้นบ้างเป็นระยะ แต่โดยรวมยังถือว่ามีความสุขดี"),

            "การงาน": score >= 5 ?
                "การงานรุ่งโรจน์ ประสบความสำเร็จโดดเด่น มีตำแหน่งหน้าที่สูงและเป็นที่ยอมรับ" :
                (score <= 2 ? "งานมีอุปสรรคมาก หรือต้องเปลี่ยนงานบ่อย ต้องใช้ความเพียรและอดทนมากกว่าคนอื่น" :
                    "การงานมั่นคงปานกลาง มีความก้าวหน้าตามลำดับความขยันและความรับผิดชอบ"),

            "ลาภยศ": score >= 5 ?
                "มีวาสนาทางชื่อเสียง มีโชคลาภลอยหรือได้รับเกียรติยศจากสังคมอย่างไม่คาดฝัน" :
                (score <= 2 ? "โชคลาภมีน้อย ต้องสร้างด้วยน้ำพักน้ำแรง อย่าหวังทางลัดหรือการเสี่ยงโชค" :
                    "มีโชคบ้างเป็นครั้งคราว ได้รับความเคารพตามตำแหน่งหน้าที่และคุณงามความดี")
        };
        return adviceMap[label] || "ชีวิตดำเนินไปตามครรลอง หมั่นมีสติและทำความดีจะช่วยเสริมดวงชะตา";
    }

    function getTransitAdvice(type, label, score) {
        const advice = {
            "วาสนา": score >= 5 ? "เป็นปี/เดือนแห่งการเริ่มต้นใหม่ที่ดี มีเกณฑ์ได้รับโอกาสใหญ่" : "ช่วงนี้ควรอยู่นิ่งๆ รักษาสุขภาพจิต อย่าเพิ่งรีบร้อนตัดสินใจเรื่องใหญ่",
            "ทรัพย์": score >= 5 ? "มีเกณฑ์ได้ลาภลอย หรือเงินก้อนโตจากการลงทุน/ทำงาน" : "ระวังกระเป๋ารั่ว มีรายจ่ายฉุกเฉิน ห้ามให้คนกู้ยืมเงินเด็ดขาด",
            "เพื่อน": score >= 5 ? "เพื่อนฝูงจะนำโชคลาภหรือข่าวดีมาให้ เหมาะแก่การเข้าสังคม" : "ระวังความขัดแย้งกับคนรอบข้าง หรือถูกเพื่อนพาไปเดือดร้อน",
            "ญาติ": score >= 5 ? "ญาติผู้ใหญ่จะให้การสนับสนุน หรือมีเกณฑ์ได้ของขวัญจากครอบครัว" : "ระวังเรื่องร้อนใจภายในบ้าน หรือคนในครอบครัวเจ็บป่วย",
            "บุตร": score >= 5 ? "โปรเจกต์ใหม่ที่เริ่มจะไปได้ดี บริวารให้ความร่วมมือ" : "ระวังเรื่องวุ่นวายจากลูกหลานหรือลูกน้อง อย่าเพิ่งเริ่มงานใหม่ที่เสี่ยง",
            "บริวาร": score >= 5 ? "ผู้ใต้บังคับบัญชาซื่อสัตย์ ช่วยงานได้ดีมาก" : "ระวังถูกบริวารคดโกง หรือลูกน้องสร้างปัญหาทิ้งไว้ให้แก้",
            "ศัตรู": score >= 5 ? "ระวัง! มีคนจ้องทำร้ายหรือขัดขวาง ห้ามทำตัวเด่นเด็ดขาด" : "ศัตรูพ่ายแพ้ อุปสรรคที่มีจะคลี่คลายไปได้เอง",
            "คู่ครอง": score >= 5 ? "ความรักสดใส คู่ครองส่งเสริมเรื่องเงินทองหรืองาน" : "ระวังปากเสียงกับคนรัก หรือหุ้นส่วนทางธุรกิจมีปัญหาขัดแย้ง",
            "โรคภัย": score >= 5 ? "ควรหาเวลาตรวจสุขภาพ ระวังอุบัติเหตุหรือการเจ็บป่วยกะทันหัน" : "สุขภาพแข็งแรงดี มีเกณฑ์หายจากโรคที่เคยเป็น",
            "ความสุข": score >= 5 ? "ช่วงเวลาแห่งการพักผ่อน มีความสุขกายสบายใจ สภาพแวดล้อมดี" : "จิตใจว้าวุ่น เครียดง่าย ควรหาเวลาเข้าวัดหรือทำสมาธิ",
            "การงาน": score >= 5 ? "งานรุ่งพุ่งแรง มีโอกาสเลื่อนตำแหน่งหรือได้งานใหม่ที่ถูกใจ" : "งานหนักแต่ผลตอบแทนน้อย ระวังความผิดพลาดในเอกสารหรือการสื่อสาร",
            "ลาภยศ": score >= 5 ? "มีเกณฑ์ได้รับชื่อเสียง รางวัล หรือมีโชคลาภแบบไม่คาดฝัน" : "อย่าหวังพึ่งโชคชะตา ต้องลงมือทำด้วยตัวเองเท่านั้นถึงจะสำเร็จ"
        };
        return `<b>${type}:</b> ${advice[label] || "ใช้ชีวิตอย่างมีสติ"}`;
    }

    function getLuckyNumbers(birthInput) {
        const today = new Date();
        const birthDate = typeof parseThaiDate === 'function' ? parseThaiDate(birthInput) : new Date(birthInput);
        const birth = birthDate ? birthDate.getDate() : 1;
        const s = today.getDate() + today.getMonth() + birth;
        const n = (val) => (Math.abs(val) % 10).toString();
        return {
            twoDigits: [n(s) + n(s * 2), n(s + 3) + n(s * 7), n(s + 5) + n(s + birth), n(s * 4) + n(s - 2)],
            threeDigits: [n(s) + n(s + 2) + n(s + 4), n(s * 3) + n(s + 1) + n(s * 2), n(s + birth) + n(s) + n(s - 1), n(s * 5) + n(s + 6) + n(s * 2)]
        };
    }

    function calculateTransit(birthInput) {
        const birthDate = typeof parseThaiDate === 'function' ? parseThaiDate(birthInput) : new Date(birthInput);
        const today = new Date();

        let ageFull = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageFull--;
        }
        const ageStep = ageFull + 1;

        const yearlySlot = (ageStep - 1) % 12;

        const currentMonth = today.getMonth();
        const birthMonth = birthDate.getMonth();
        let monthDiff = currentMonth - birthMonth;
        if (monthDiff < 0) monthDiff += 12;
        const monthlySlot = (yearlySlot + monthDiff) % 12;

        const dailySlot = (monthlySlot + (today.getDate() - 1)) % 12;

        return {
            ageStep,
            yearly: { slot: yearlySlot, label: LIFE_GRAPH_LABELS[yearlySlot] },
            monthly: { slot: monthlySlot, label: LIFE_GRAPH_LABELS[monthlySlot] },
            daily: { slot: dailySlot, label: LIFE_GRAPH_LABELS[dailySlot] }
        };
    }

    function renderLifeGraph(points) {
        const canvas = document.getElementById('lifeGraphCanvas');
        if (!canvas || typeof Chart === "undefined") {
            console.warn("Chart not available");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (window.myLifeChart) {
            window.myLifeChart.destroy();
        }

        window.myLifeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: LIFE_GRAPH_LABELS,
                datasets: [{
                    label: 'ดวงชะตา',
                    data: points,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212,175,55,0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 1, max: 7 }
                }
            }
        });
    }

    function renderLifeGraphTable(points) {
        const resultDiv = document.getElementById('lifeGraphResult');
        if (!resultDiv) return;
        
        const birthInput = localStorage.getItem('userBirthdate') || document.getElementById('birthdate')?.value;
        const monthlyFortuneHtml = renderMonthlyFortune(points);

        if (!birthInput) return;

        const today = new Date();
        const day = today.getDate();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const isLottoTime = (day >= 14 && day <= 16) || (day >= lastDayOfMonth - 2) || (day === 1);

        const transit = calculateTransit(birthInput);
        const yearlySlot = transit.yearly.slot;
        const monthlySlot = transit.monthly.slot;
        const dailySlot = transit.daily.slot;
        const ageStep = transit.ageStep;

        const icons = {
            "วาสนา": "fa-crown", "ทรัพย์": "fa-coins", "เพื่อน": "fa-users",
            "ญาติ": "fa-home", "บุตร": "fa-child", "บริวาร": "fa-user-friends",
            "ศัตรู": "fa-shield-alt", "คู่ครอง": "fa-heart", "โรคภัย": "fa-medkit",
            "ความสุข": "fa-smile", "การงาน": "fa-briefcase", "ลาภยศ": "fa-trophy"
        };

        let maxScore = Math.max(...points);
        let minScore = Math.min(...points);
        const fortuneScore = calculateFortuneScore(points);
        const fortuneLevel = getFortuneLevel(fortuneScore);
        let bestSides = LIFE_GRAPH_LABELS.filter((l, i) => points[i] === maxScore);
        let weakSides = LIFE_GRAPH_LABELS.filter((l, i) => points[i] === minScore);
        
        let luckySection = "";
        if (isLottoTime) {
            const lucky = getLuckyNumbers(birthInput);
            luckySection = `
                <div class="mt-3 p-3 rounded" style="background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);">
                    <h6 class="text-gold text-center mb-3"><i class="fas fa-gem mr-2"></i>เลขมงคลเฉพาะดวงคุณวันนี้</h6>
                    <div class="mb-3">
                        <small class="text-white-50 d-block text-center mb-2">เลขท้าย 2 ตัว (4 ชุด)</small>
                        <div class="d-flex justify-content-around">
                            ${lucky.twoDigits.map(num => `<h4 class="text-white font-weight-bold mb-0">${num}</h4>`).join('')}
                        </div>
                    </div>
                    <div style="height: 1px; background: rgba(255,215,0,0.2); margin: 15px 0;"></div>
                    <div>
                        <small class="text-white-50 d-block text-center mb-2">เลขท้าย 3 ตัว (4 ชุด)</small>
                        <div class="d-flex justify-content-around">
                            ${lucky.threeDigits.map(num => `<h4 class="text-warning font-weight-bold mb-0">${num}</h4>`).join('')}
                        </div>
                    </div>
                    <small class="text-gold-50 mt-3 d-block text-center" style="font-size: 0.65rem;">
                        *คำนวณตามพื้นดวงและกำลังวัน เพื่อใช้เป็นแนวทางเสี่ยงโชค
                    </small>
                </div>
            `;
        }

        let html = `
        <div class="col-12 mb-4">
            <div class="p-3 rounded shadow-sm" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(0,0,0,0.8)); border: 2px solid #d4af37;">
                ${luckySection}
                <div class="mt-2" style="text-align: center;">
                    <h2 class="text-warning font-weight-bold">${fortuneScore}/100</h2>
                    <small class="text-white-50">ระดับดวง : ${fortuneLevel}</small>
                </div>
            </div>
            <div class="p-3 rounded shadow-sm mt-3" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(0,0,0,0.8)); border: 2px solid #d4af37;">
                <div class="text-center mb-3">
                    <h4 class="text-gold-500 font-weight-bold"><i class="fas fa-magic mr-2"></i>คัมภีร์ดวงจรรายวัน</h4>      
                    <p class="text-white-200px mb-0">วิเคราะห์ตามอายุย่าง <b>${ageStep}</b> ปี</p>
                </div>
                <hr style="border-top: 1px solid rgba(212,175,55,0.3);">
                <div class="transit-predictions mt-3">
                    <div class="mb-3 p-2 rounded" style="background: rgba(255, 193, 7, 0.1); border-left: 3px solid #ffc107;">
                        <small class="text-warning d-block font-weight-bold"><i class="fas fa-calendar-alt mr-1"></i> รายปี (${LIFE_GRAPH_LABELS[yearlySlot]})</small>
                        <div class="text-white small mt-1">${getTransitAdvice("ปีนี้", LIFE_GRAPH_LABELS[yearlySlot], points[yearlySlot])}</div>
                    </div>
                    ${monthlyFortuneHtml}
                    <div class="mb-3 p-2 rounded" style="background: rgba(23, 162, 184, 0.1); border-left: 3px solid #17a2b8;">
                        <small class="text-info d-block font-weight-bold"><i class="fas fa-moon mr-1"></i> รายเดือน (${LIFE_GRAPH_LABELS[monthlySlot]})</small>
                        <div class="text-white small mt-1">${getTransitAdvice("เดือนนี้", LIFE_GRAPH_LABELS[monthlySlot], points[monthlySlot])}</div>
                    </div>
                    <div class="p-2 rounded" style="background: rgba(255, 255, 255, 0.1); border-left: 3px solid #ffffff;">
                        <small class="text-white d-block font-weight-bold"><i class="fas fa-sun mr-1"></i> รายวัน (${LIFE_GRAPH_LABELS[dailySlot]})</small>
                        <div class="text-white-50 small mt-1">${getTransitAdvice("วันนี้", LIFE_GRAPH_LABELS[dailySlot], points[dailySlot])}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mb-4">
            <div class="p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(212,175,55,0.4);">
                <div class="row text-center">
                    <div class="col-6 border-right">
                        <small class="text-white-50 d-block mb-1">วาสนาเดิมโดดเด่น</small>
                        <span class="text-success font-weight-bold">🌟 ${bestSides[0]}</span>
                    </div>
                    <div class="col-6">
                        <small class="text-white-50 d-block mb-1">เคราะห์เดิมควรระวัง</small>
                        <span class="text-danger font-weight-bold">⚠️ ${weakSides[0]}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mb-2"><h5 class="text-gold text-center"><i class="fas fa-th-list mr-2"></i>เจาะลึกพื้นฐาน 12 ด้าน</h5></div>
        <div class="row w-100 m-0">
        `;

        points.forEach((p, i) => {
            let label = LIFE_GRAPH_LABELS[i];
            let colorClass = (label === "ศัตรู" || label === "โรคภัย")
                ? (p >= 5 ? 'danger' : (p <= 2 ? 'success' : 'warning'))
                : (p >= 5 ? 'success' : (p <= 2 ? 'danger' : 'warning'));

            let advice = getLifeGraphAdvice(label, p);
            let progressWidth = (p / 7) * 100;
            let icon = icons[label] || "fa-star";

            let transitBadge = "";
            let specialStyle = "";
            if (i === yearlySlot) {
                transitBadge += `<span class="badge badge-warning ml-1" style="font-size: 0.6rem;">📍 รายปี</span>`;
                specialStyle = "border: 2px solid #ffc107 !important; transform: scale(1.02); z-index: 2; box-shadow: 0 0 15px rgba(255,193,7,0.3);";
            }
            if (i === monthlySlot) transitBadge += `<span class="badge badge-info ml-1" style="font-size: 0.6rem;">🌙 รายเดือน</span>`;
            if (i === dailySlot) transitBadge += `<span class="badge badge-light ml-1 text-dark" style="font-size: 0.6rem;">☀️ วันนี้</span>`;

            html += `
                <div class="col-12 col-md-6 mb-3"> 
                    <div class="card h-100 overflow-hidden" style="background: rgba(255,255,255,0.07); border: 1px solid rgba(212, 175, 55, 0.2); position: relative; ${specialStyle}">
                        <i class="fas ${icon}" style="position: absolute; right: 10px; bottom: 10px; font-size: 3.5rem; color: rgba(212, 175, 55, 0.05); pointer-events: none;"></i>
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="text-gold m-0 font-weight-bold"><i class="fas ${icon} mr-2"></i>${label}</h6>
                                    <div class="mt-1">${transitBadge}</div>
                                </div>
                                <span class="badge badge-${colorClass}">ระดับ ${p}</span>
                            </div>
                            <div class="progress mb-2" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                                <div class="progress-bar bg-${colorClass} progress-bar-striped progress-bar-animated" style="width: ${progressWidth}%"></div>
                            </div>
                            <p class="text-white-50 mb-0" style="font-size: 0.85rem; line-height: 1.5;">${advice}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultDiv.innerHTML = html;
    }

    function showlifeGraph() {
        const container = document.getElementById('showlifeGraphPage');
        if (!container) return;

        const html = `
        <div class="card shadow-lg border-gold bg-dark text-white">
            <div class="card-header bg-dark border-gold py-3 text-center">
                <h2 class="text-gold mb-1">📈 กราฟชีวิตพยากรณ์</h2>
                <span class="text-white-50">วิเคราะห์ดวงชะตา 12 ด้านตามหลักเลขศาสตร์โบราณ</span>
            </div>
            <div class="card-body">
                <div class="p-3 rounded bg-white mb-4" style="height: 300px; position: relative; width: 100%; margin: 0 auto;">
                    <canvas id="lifeGraphCanvas" style="position:relative"></canvas>
                </div>
                <div id="lifeGraphResult" class="row"></div>
                <div class="text-center mt-4">
                    <button class="btn btn-gold btn-lg share-graph-btn" onclick="downloadLifeGraphImage(this)">
                        <i class="fas fa-chart-line mr-2"></i> เซฟรูปกราฟชีวิตแชร์ลง Facebook
                    </button>
                    <div class="row mt-4">
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="if(typeof navigateTo === 'function') navigateTo('mainpage')">
                                <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-secondary btn-block border-0" onclick="if(typeof goBack === 'function') goBack()">
                                <i class="fas fa-home"></i> กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        container.innerHTML = html;
    }

    async function downloadLifeGraphImage(element) {
        const area = document.getElementById('lifeGraphResult');
        if (!area || area.innerHTML === "") {
            if (typeof Swal !== "undefined") {
                Swal.fire('แจ้งเตือน', 'กรุณาคำนวณกราฟชีวิตก่อนทำการเซฟภาพครับ', 'warning');
            } else {
                alert('กรุณาคำนวณกราฟชีวิตก่อนทำการเซฟภาพครับ');
            }
            return;
        }

        let btn = element instanceof HTMLElement ? element : document.querySelector('.share-graph-btn');
        const originalText = btn ? btn.innerHTML : "";

        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสร้างกราฟดวงชะตา...';
            btn.disabled = true;
        }

        try {
            await document.fonts.ready;

            // Collect data from the existing Chart instance
            const points = window.myLifeChart?.data?.datasets?.[0]?.data || [];
            if (points.length === 0) throw new Error('ไม่พบข้อมูลกราฟ');

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1080;
            canvas.height = 1450; // Increased height to prevent overlap

            // Background - Beautiful light gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrad.addColorStop(0, '#fdfaf0'); // Warm light yellow-white
            bgGrad.addColorStop(0.5, '#ffffff');
            bgGrad.addColorStop(1, '#f4effa'); // Soft light purple at the bottom
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Border
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 10;
            ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

            // Inner dotted border for extra beauty
            ctx.strokeStyle = '#9370db';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 5]);
            ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
            ctx.setLineDash([]);

            // Header
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#6a0dad';
            ctx.font = 'bold 65px "Sarabun", sans-serif';
            ctx.fillText('📊 กราฟชีวิต 12 รอบ', canvas.width / 2, 65);
            ctx.font = '30px "Sarabun", sans-serif';
            ctx.fillStyle = '#666666';
            ctx.fillText('สยามโหรามงคล', canvas.width / 2, 150);

            // Mini bar chart area
            const chartTop = 230;
            const chartH = 340;
            const chartLeft = 80;
            const chartRight = canvas.width - 80;
            const chartW = chartRight - chartLeft;
            const barW = (chartW / LIFE_GRAPH_LABELS.length) * 0.65;
            const barGap = chartW / LIFE_GRAPH_LABELS.length;
            const maxVal = 7;

            // Grid lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;
            for (let v = 1; v <= maxVal; v++) {
                const gy = chartTop + chartH - (v / maxVal) * chartH;
                ctx.beginPath(); ctx.moveTo(chartLeft, gy); ctx.lineTo(chartRight, gy); ctx.stroke();
            }

            // Bars + labels
            points.forEach((p, i) => {
                const label = LIFE_GRAPH_LABELS[i];
                const isNeg = (label === 'ศัตรู' || label === 'โรคภัย');
                const isHigh = p >= 5;
                let barColor;
                if (isNeg) {
                    barColor = isHigh ? '#dc3545' : (p <= 2 ? '#28a745' : '#e0a800');
                } else {
                    barColor = isHigh ? '#28a745' : (p <= 2 ? '#dc3545' : '#e0a800');
                }

                const bx = chartLeft + i * barGap + (barGap - barW) / 2;
                const bh = (p / maxVal) * chartH;
                const by = chartTop + chartH - bh;

                // Draw bar with slight shadow
                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetY = 3;
                ctx.fillStyle = barColor;
                ctx.fillRect(bx, by, barW, bh);
                
                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Score on top of bar
                ctx.textAlign = 'center';
                ctx.font = 'bold 26px "Sarabun", sans-serif';
                ctx.fillStyle = '#333333';
                ctx.fillText(p, bx + barW / 2, by - 35);

                // Label below bar
                ctx.font = '22px "Sarabun", sans-serif';
                ctx.fillStyle = '#555555';
                ctx.fillText(label, bx + barW / 2, chartTop + chartH + 15);
            });

            // Divider
            const divY = chartTop + chartH + 70;
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(80, divY); ctx.lineTo(canvas.width - 80, divY); ctx.stroke();

            // Summary cards (best/worst)
            const maxScore = Math.max(...points);
            const minScore = Math.min(...points);
            const bestLabel = LIFE_GRAPH_LABELS.find((l, i) => points[i] === maxScore) || '-';
            const worstLabel = LIFE_GRAPH_LABELS.find((l, i) => points[i] === minScore) || '-';

            ctx.textAlign = 'center';
            let sy = divY + 40;
            ctx.font = 'bold 44px "Sarabun", sans-serif';
            ctx.fillStyle = '#b8860b';
            ctx.fillText('สรุปดวงชะตา', canvas.width / 2, sy); sy += 65;

            ctx.font = 'bold 34px "Sarabun", sans-serif';
            ctx.fillStyle = '#1e7e34';
            ctx.fillText(`🌟 วาสนาโดดเด่น: ${bestLabel} (ระดับ ${maxScore})`, canvas.width / 2, sy); sy += 55;
            ctx.fillStyle = '#bd2130';
            ctx.fillText(`⚠️ เคราะห์ควรระวัง: ${worstLabel} (ระดับ ${minScore})`, canvas.width / 2, sy); sy += 75;

            // Fortune score bar
            const total = points.reduce((a, b) => a + b, 0);
            const fortuneScore = Math.round((total / (7 * 12)) * 100);
            ctx.font = 'bold 44px "Sarabun", sans-serif';
            ctx.fillStyle = '#6a0dad';
            ctx.fillText(`ดัชนีดวง: ${fortuneScore}/100`, canvas.width / 2, sy); sy += 65;

            // Score progress bar
            const barBg = 'rgba(0,0,0,0.08)';
            const barFg = fortuneScore >= 65 ? '#28a745' : (fortuneScore >= 40 ? '#ffc107' : '#dc3545');
            ctx.fillStyle = barBg;
            ctx.beginPath(); ctx.roundRect(150, sy, canvas.width - 300, 28, 14); ctx.fill();
            ctx.fillStyle = barFg;
            ctx.beginPath(); ctx.roundRect(150, sy, (canvas.width - 300) * (fortuneScore / 100), 28, 14); ctx.fill();
            sy += 90;

            // 12 house breakdown (2 columns)
            ctx.textAlign = 'left';
            ctx.font = 'bold 34px "Sarabun", sans-serif';
            ctx.fillStyle = '#b8860b';
            ctx.fillText('เจาะลึก 12 ด้าน', 100, sy); sy += 55;

            const col1x = 100, col2x = canvas.width / 2 + 30;
            let row1y = sy, row2y = sy;
            points.forEach((p, i) => {
                const label = LIFE_GRAPH_LABELS[i];
                const isNeg = (label === 'ศัตรู' || label === 'โรคภัย');
                let col = isNeg ? (p >= 5 ? '#dc3545' : (p <= 2 ? '#28a745' : '#d39e00'))
                                : (p >= 5 ? '#28a745' : (p <= 2 ? '#dc3545' : '#d39e00'));
                const x = i % 2 === 0 ? col1x : col2x;
                const cy = i % 2 === 0 ? row1y : row2y;
                
                // Draw card background for each item
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.beginPath(); ctx.roundRect(x - 20, cy - 32, (canvas.width / 2) - 100, 50, 10); ctx.fill();
                
                ctx.font = 'bold 28px "Sarabun", sans-serif';
                ctx.fillStyle = '#444444';
                ctx.fillText(`${label}`, x, cy);
                ctx.font = '28px "Sarabun", sans-serif';
                ctx.fillStyle = col;
                ctx.fillText(` ระดับ ${p}`, x + ctx.measureText(label).width + 10, cy);
                if (i % 2 === 0) row1y += 60; else row2y += 60;
            });

            // Footer
            ctx.textAlign = 'center';
            ctx.fillStyle = '#888888';
            ctx.font = '26px "Sarabun", sans-serif';
            ctx.fillText('สยามโหรามงคล - ตรวจสอบดวงชะตาของคุณได้ทุกวัน 🔮', canvas.width / 2, canvas.height - 75);

            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `กราฟชีวิต_สยามโหรามงคล.png`;
                link.href = url;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }, 'image/png');

        } catch (e) {
            console.error("Graph Share Error:", e);
            if (typeof Swal !== "undefined") {
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างภาพกราฟได้: ' + e.message, 'error');
            } else {
                alert('ไม่สามารถสร้างภาพกราฟได้: ' + e.message);
            }
        } finally {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    }


    // --- Event Listeners & Global Exposure ---
    document.addEventListener("DOMContentLoaded", () => {
        showlifeGraph();
        const savedDate = localStorage.getItem('userBirthdate');
        if (savedDate) {
            const input = document.getElementById('birthdate');
            if (input) {
                input.value = savedDate;
                const lifeGraphPage = document.getElementById('lifeGraphPage');
                if (lifeGraphPage && lifeGraphPage.style.display !== 'none') {
                    setTimeout(() => calculateLifeGraph(), 500);
                }
            }
        }
    });

    // Expose functions to global scope safely
    window.calculateLifeGraph = calculateLifeGraph;
    window.downloadLifeGraphImage = downloadLifeGraphImage;

})();