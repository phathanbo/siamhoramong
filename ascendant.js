"use strict";

/**
 * ข้อมูลราศีและคำนิยามลัคนา
 */

const ZODIAC_DATA = [
  {
    name: "เมษ", icon: "♈",
    desc: "เป็นคนกระตือรือร้น มีความเป็นผู้นำ กล้าหาญ และชอบความท้าทาย",
    element: "ธาตุไฟ", ruler: "ดาวอังคาร",
    strengths: ["กล้าตัดสินใจ", "พลังงานสูง", "ตรงไปตรงมา"],
    weaknesses: ["ใจร้อน", "เบื่อง่าย", "ไม่ฟังใคร"],
    luckyColor: "แดง, ส้ม", luckyNumber: [1, 9],
    compatible: ["สิงห์", "ธนู", "เมถุน"],
    career: "ทหาร ตำรวจ นักกีฬา สตาร์ทอัพ นักขาย",
    love: "รักเร็ว ร้อนแรง ต้องการคนตามทัน",
    health: "ระวังศีรษะ ไมเกรน อุบัติเหตุจากความรีบ"
  },
  {
    name: "พฤษภ", icon: "♉",
    desc: "เป็นคนหนักแน่น อดทน รักสวยรักงาม และให้ความสำคัญกับความมั่นคง",
    element: "ธาตุดิน", ruler: "ดาวศุกร์",
    strengths: ["อดทน", "ซื่อสัตย์", "มีรสนิยม"],
    weaknesses: ["ดื้อ", "ยึดติด", "หวงของ"],
    luckyColor: "เขียว, ชมพู", luckyNumber: [2, 6],
    compatible: ["กันย์", "มังกร", "กรกฎ"],
    career: "การเงิน อสังหา เชฟ ศิลปะ งานฝีมือ",
    love: "รักมั่นคง ช้าแต่นาน ต้องการความปลอดภัย",
    health: "ระวังคอ ต่อมไทรอยด์ น้ำหนักขึ้นง่าย"
  },
  {
    name: "เมถุน", icon: "♊",
    desc: "เป็นคนฉลาด มีไหวพริบ ช่างพูดช่างเจรจา และปรับตัวเก่ง",
    element: "ธาตุลม", ruler: "ดาวพุธ",
    strengths: ["สื่อสารเก่ง", "เรียนรู้ไว", "ยืดหยุ่น"],
    weaknesses: ["ลังเล", "เบื่อง่าย", "พูดมาก"],
    luckyColor: "เหลือง, เทา", luckyNumber: [3, 5],
    compatible: ["ตุลย์", "กุมภ์", "เมษ"],
    career: "สื่อ นักเขียน MC ขาย การตลาด",
    love: "ต้องการความสนุก คุยรู้เรื่อง ไม่น่าเบื่อ",
    health: "ระวังปอด ภูมิแพ้ ความเครียดจากคิดมาก"
  },
  {
    name: "กรกฎ", icon: "♋",
    desc: "เป็นคนรักครอบครัว มีเมตตา อ่อนโยน และมีสัญชาตญาณแรงกล้า",
    element: "ธาตุน้ำ", ruler: "ดวงจันทร์",
    strengths: ["เอาใจใส่", "จำเก่ง", "ปกป้องคนรัก"],
    weaknesses: ["อ่อนไหว", "ขี้น้อยใจ", "ยึดติดอดีต"],
    luckyColor: "ขาว, เงิน", luckyNumber: [2, 7],
    compatible: ["พิจิก", "มีน", "พฤษภ"],
    career: "ครู พยาบาล เชฟ งานดูแล อสังหา",
    love: "รักลึกซึ้ง ต้องการบ้านที่อบอุ่น",
    health: "ระวังกระเพาะ ทางเดินอาหาร อารมณ์แปรปรวน"
  },
  {
    name: "สิงห์", icon: "♌",
    desc: "เป็นคนสง่างาม มั่นใจในตัวเอง มีบารมี และชอบความเป็นที่หนึ่ง",
    element: "ธาตุไฟ", ruler: "ดวงอาทิตย์",
    strengths: ["ผู้นำ", "ใจกว้าง", "สร้างแรงบันดาลใจ"],
    weaknesses: ["อีโก้สูง", "ชอบควบคุม", "ติดหรู"],
    luckyColor: "ทอง, ส้ม", luckyNumber: [1, 5],
    compatible: ["เมษ", "ธนู", "ตุลย์"],
    career: "ผู้บริหาร ดารา งานสร้างแบรนด์ อีเวนต์",
    love: "ชอบถูกยกย่อง รักแบบเปิดเผย",
    health: "ระวังหัวใจ หลัง ความดัน"
  },
  {
    name: "กันย์", icon: "♍",
    desc: "เป็นคนละเอียดรอบคอบ มีระเบียบวินัย และเก่งในการวิเคราะห์",
    element: "ธาตุดิน", ruler: "ดาวพุธ",
    strengths: ["เป๊ะ", "วิเคราะห์เก่ง", "บริการดี"],
    weaknesses: ["จู้จี้", "กังวล", "วิจารณ์เก่ง"],
    luckyColor: "เขียวอ่อน, น้ำตาล", luckyNumber: [5, 14],
    compatible: ["พฤษภ", "มังกร", "กรกฎ"],
    career: "หมอ นักวิจัย บัญชี QA งานข้อมูล",
    love: "รักด้วยการกระทำ ต้องการความสมบูรณ์แบบ",
    health: "ระวังลำไส้ ระบบย่อย ความเครียด"
  },
  {
    name: "ตุลย์", icon: "♎",
    desc: "เป็นคนรักความยุติธรรม มีเสน่ห์ เข้ากับคนง่าย และชอบความสมดุล",
    element: "ธาตุลม", ruler: "ดาวศุกร์",
    strengths: ["ทูต", "ยุติธรรม", "มีสไตล์"],
    weaknesses: ["ลังเล", "กลัวขัดแย้ง", "พึ่งพาคนอื่น"],
    luckyColor: "ฟ้า, ชมพู", luckyNumber: [6, 9],
    compatible: ["เมถุน", "กุมภ์", "สิงห์"],
    career: "กฎหมาย ดีไซน์ PR ที่ปรึกษา ความงาม",
    love: "โรแมนติก ต้องการคู่ที่เท่าเทียม",
    health: "ระวังไต หลังส่วนล่าง สมดุลฮอร์โมน"
  },
  {
    name: "พิจิก", icon: "♏",
    desc: "เป็นคนมีความลึกลับ มีพลังอำนาจในตัว และมีความมุ่งมั่นสูง",
    element: "ธาตุน้ำ", ruler: "ดาวอังคาร/พลูโต",
    strengths: ["ลึกซึ้ง", "อดทน", "อ่านคนออก"],
    weaknesses: ["หึงหวง", "แค้นฝัง", "ควบคุม"],
    luckyColor: "แดงเลือดหมู, ดำ", luckyNumber: [8, 11],
    compatible: ["กรกฎ", "มีน", "กันย์"],
    career: "สืบสวน จิตแพทย์ การเงิน นักวิจัย",
    love: "รักสุดใจ ต้องการความซื่อสัตย์ 100%",
    health: "ระวังระบบสืบพันธุ์ ความเครียดสะสม"
  },
  {
    name: "ธนู", icon: "♐",
    desc: "เป็นคนรักอิสระ มองโลกในแง่ดี ชอบเรียนรู้สิ่งใหม่ๆ และมีคุณธรรม",
    element: "ธาตุไฟ", ruler: "ดาวพฤหัส",
    strengths: ["มองบวก", "ซื่อตรง", "ชอบผจญภัย"],
    weaknesses: ["พูดตรงเกิน", "เบื่อง่าย", "ไม่ผูกมัด"],
    luckyColor: "ม่วง, น้ำเงิน", luckyNumber: [3, 12],
    compatible: ["เมษ", "สิงห์", "ตุลย์"],
    career: "อาจารย์ ไกด์ นักเดินทาง สื่อต่างประเทศ",
    love: "ต้องการพื้นที่ รักที่เป็นเพื่อนกันได้",
    health: "ระวังสะโพก ตับ จากการใช้ชีวิตสุดเหวี่ยง"
  },
  {
    name: "มังกร", icon: "♑",
    desc: "เป็นคนมีความรับผิดชอบสูง มุ่งมั่นในความสำเร็จ และมีความอดทนเป็นเลิศ",
    element: "ธาตุดิน", ruler: "ดาวเสาร์",
    strengths: ["วินัย", "อดทน", "วางแผนเก่ง"],
    weaknesses: ["เคร่งเครียด", "มองโลกแง่ร้าย", "บ้างาน"],
    luckyColor: "ดำ, น้ำตาลเข้ม", luckyNumber: [4, 8],
    compatible: ["พฤษภ", "กันย์", "มีน"],
    career: "ผู้บริหาร วิศวกร ราชการ การเงิน",
    love: "รักช้าแต่มั่นคง แสดงออกด้วยการดูแล",
    health: "ระวังเข่า กระดูก ผิวหนัง"
  },
  {
    name: "กุมภ์", icon: "♒",
    desc: "เป็นคนมีเอกลักษณ์ ชอบอิสระ มีความคิดสร้างสรรค์ และรักพวกพ้อง",
    element: "ธาตุลม", ruler: "ดาวเสาร์/ยูเรนัส",
    strengths: ["นวัตกรรม", "มนุษยธรรม", "เป็นตัวของตัวเอง"],
    weaknesses: ["ดื้อเงียบ", "เย็นชา", "แหกกฎ"],
    luckyColor: "ฟ้าไฟฟ้า, เงิน", luckyNumber: [7, 11],
    compatible: ["เมถุน", "ตุลย์", "ธนู"],
    career: "เทคโนโลยี นักประดิษฐ์ NGO งานสังคม",
    love: "ต้องการเพื่อนก่อนเป็นแฟน ไม่ชอบผูกมัด",
    health: "ระวังระบบไหลเวียน ข้อเท้า ความเครียด"
  },
  {
    name: "มีน", icon: "♓",
    desc: "เป็นคนอ่อนไหว มีเมตตา มีจินตนาการสูง และชอบช่วยเหลือผู้อื่น",
    element: "ธาตุน้ำ", ruler: "ดาวพฤหัส/เนปจูน",
    strengths: ["เห็นอกเห็นใจ", "ศิลปะ", "ยืดหยุ่น"],
    weaknesses: ["หนีปัญหา", "โลเล", "อ่อนไหวเกิน"],
    luckyColor: "เขียวทะเล, ม่วงลาเวนเดอร์", luckyNumber: [7, 12],
    compatible: ["กรกฎ", "พิจิก", "มังกร"],
    career: "ศิลปิน นักบำบัด งานช่วยเหลือ ครีเอทีฟ",
    love: "รักแบบเสียสละ ต้องการคนเข้าใจ",
    health: "ระวังเท้า ระบบน้ำเหลือง ภูมิแพ้"
  }
];

const colors = {
    ธาตุไฟ: "#ff0000",
    ธาตุดิน: "#914600",
    ธาตุลม: "#abfcff",
    ธาตุน้ำ: "#00a2ff",
};

function showascen(){
    const contianer = document.getElementById('showascPage')
    if (!contianer) return ;


    const html = `
            <div class="container mt-4">
            <div class="card bg-dark border-gold text-white p-4 shadow-lg text-center">
                <h2 class="text-gold mb-4"><i class="fas fa-star-and-crescent mr-2"></i> คำนวณลัคนาพยากรณ์</h2>

                <div class="form-group mb-3">
                    <label class="text-gold">เลือกสมาชิกจากประวัติ:</label>
                    <select class="form-control bg-black text-black border-gold member-selector-shared"
                        onchange="autoFillMemberData(this.value);calculateAscendant()"> >
                        <option value="">-- เลือกสมาชิก --</option>
                    </select>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-5 mb-3">
                        <label>วันเกิด (ค.ศ.)</label>
                        <input type="date" id="ascBirthDate" class="form-control bg-black text-gold border-gold">
                    </div>
                    <div class="col-md-5 mb-3">
                        <label>เวลาเกิด (HH:mm)</label>
                        <input type="time" id="ascBirthTime" class="form-control bg-black text-gold border-gold">
                    </div>
                </div>
                <button class="btn btn-gold btn-block mt-3" onclick="calculateAscendant()">
                    <i class="fas fa-magic"></i> คำนวณลัคนา
                </button>

                <div id="ascendantResult" class="mt-4 p-4 rounded"
                    style="display: none; background: rgba(212, 175, 55, 0.1); border: 1px dashed #d4af37;">
                    <h3 id="ascSign" class="text-gold"></h3>
                    <span style="font-size: 1.1rem;">ดาวประจำตัวคือ </span><b id="ascruler" class="text-gold" style="font-size: 1.1rem;"></b> <span id="ascElement" style="font-size: 1.1rem; text-align: center;"></span><span style="font-size: 1.1rem;"> ราศีที่เกี่ยวข้องคือ </span><b id="asccompatible" class="text-gold" style="font-size: 1.1rem;"></b><br>
                    <span id="ascDesc" style="font-size: 1.1rem; text-align: center;"></span>
                    <br>
                    <span id="asccareer" style="font-size: 1.1rem; text-align: center;"></span><br>
                    <span class="text-success">จุดเด่นของลัคนานี้ คือ </span><span id="ascstrengths" style="font-size: 1.1rem; text-align: center;"></span><br>
                    <span class="text-danger">จุดที่ควรระวัง คือ </span><span id="ascweaknesses" style="font-size: 1.1rem; text-align: center;"></span><br>
                    <span class="text-info">เรื่องรักของลัคนานี้ คือ </span><span id="ascLove" style="font-size: 1.1rem; text-align: center;"></span><br>
                    <span class="text-warning">เรื่องสุขภาพของลัคนานี้ คือ </span><span id="ascHealth" style="font-size: 1.1rem; text-align: center;"></span><br>
                    <hr style="border-top: 1px solid rgba(212, 175, 55, 0.3);">
                    <h5 class="text-gold mb-3"><i class="fas fa-th-large mr-2"></i> พื้นฐานดวงชะตา 12 ภพเรือน</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered text-white border-gold"
                            style="background: rgba(0,0,0,0.3);">
                            <thead class="text-gold">
                                <tr>
                                    <th>ภพเรือน</th>
                                    <th>ราศีที่สถิต</th>
                                    <th>จุดเด่น</th>
                                    <th>จุดที่ควรระวัง</th>
                                </tr>
                            </thead>
                            <tbody id="houseTableBody">
                            </tbody>
                        </table>                 
                    </div>                    
                </div>
                <div class="text-center mt-4">
                        <button class="btn btn-outline-gold px-5 py-2" onclick="saveAscendantImg()">
                            <i class="fas fa-camera mr-2"></i> บันทึกภาพดวงชะตา
                        </button>
                    </div>

                <div class="row mt-4">
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
        </div>
    `;
    contianer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    showascen()
});

/**
 * ฟังก์ชันหลัก: คำนวณลัคนาราศี
 */
function calculateAscendant() {
    const dateInput = document.getElementById('ascBirthDate');
    const timeInput = document.getElementById('ascBirthTime');
    const resDiv = document.getElementById('ascendantResult');

    if (!dateInput || !dateInput.value || !timeInput || !timeInput.value) {
        alert("กรุณาระบุวันเกิดและเวลาเกิดให้ครบถ้วนครับ");
        return;
    }

    const [hours, mins] = timeInput.value.split(':').map(Number);
    const totalMinutes = (hours * 60) + mins;

    /**
     * คำนวณหาลัคนาแบบประมาณการ (อิงตามเวลาเกิดมาตรฐาน)
     * ลำดับราศีเริ่มที่ เมษ (06:00-07:59 โดยประมาณ)
     */
    let adjustedMinutes = totalMinutes - 360; // เริ่มนับจาก 06:00 น.
    if (adjustedMinutes < 0) adjustedMinutes += 1440; // กรณีเกิดหลังเที่ยงคืน

    // ราศีหนึ่งใช้เวลาประมาณ 120 นาที (2 ชม.)
    let zodiacIndex = Math.floor(adjustedMinutes / 120);
    zodiacIndex = Math.min(Math.max(zodiacIndex, 0), 11); // คุมให้อยู่ใน 0-11
    generateHouseTable(zodiacIndex); // <--- เพิ่มบรรทัดนี้

    const result = ZODIAC_DATA[zodiacIndex];
    displayAscendantResult(result);
}

/**
 * ฟังก์ชันสร้างตารางภพเรือน 12 ภพ
 * @param {number} startZodiacIndex - ดัชนีราศีที่เป็นลัคนา (0-11)
 */
function generateHouseTable(startZodiacIndex) {
    const tableBody = document.getElementById('houseTableBody');
    if (!tableBody) return;

    const houseNames = [
        "ตนุ (ตัวตน)", "กดุมพะ (การเงิน)", "สหัชชะ (สังคม)", 
        "พันธุ (ครอบครัว)", "ปุตตะ (บุตร/บริวาร)", "อริ (อุปสรรค)", 
        "ปัตนิ (คู่ครอง)", "มรณะ (ความสูญเสีย)", "ศุภะ (ความสุข/ความสำเร็จ)", 
        "กัมมะ (การงาน)", "ลาภะ (โชคลาภ)", "วินาศ (ความลับ/เบื้องหลัง)"
    ];

    let html = '';
    for (let i = 0; i < 12; i++) {
        // คำนวณราศีที่เวียนไปตามภพเรือน
        const currentZodiacIndex = (startZodiacIndex + i) % 12;
        const zodiac = ZODIAC_DATA[currentZodiacIndex];

        html += `
            <tr>
                <td class="text-gold">${houseNames[i]}</td>
                <td>${zodiac.icon} ราศี${zodiac.name}</td>
                <td><span class="text-success">${zodiac.strengths}</span></td>
                <td><span class="text-danger"> ${zodiac.weaknesses}</span></td>
            </tr>
        `;
    }
    tableBody.innerHTML = html;
}

/**
 * แสดงผลลัพธ์ลงบนหน้าจอ
 */
function displayAscendantResult(data) {
    const resDiv = document.getElementById('ascendantResult');
    const signEl = document.getElementById('ascSign');
    const iconEl = document.getElementById('ascIcon');
    const descEl = document.getElementById('ascDesc');
    const elementEl = document.getElementById('ascElement');
    const careerEl = document.getElementById('asccareer');
    const strengthsEl = document.getElementById('ascstrengths');
    const weaknessesEl = document.getElementById('ascweaknesses');
    const loveEl = document.getElementById('ascLove');
    const healthEl = document.getElementById('ascHealth');
    const rulerEl = document.getElementById('ascruler');
    const compatibleEl = document.getElementById('asccompatible');
    const color = colors[data.element] || '#ffffff';


    if (!resDiv) return;

    if (signEl) signEl.innerText = `ลัคนาราศี${data.name} ${data.icon}`;
    if (iconEl) iconEl.innerText = data.icon;
    if (descEl) descEl.innerText = data.desc;
    if (elementEl) elementEl.innerHTML = `<span style="color: ${color};">(${data.element})</span>`;
    if (careerEl) careerEl.innerText = `อาชีพที่เหมาะสม คือ${data.career}`;
    if (strengthsEl) strengthsEl.innerText = `${data.strengths.join(', ')}`;
    if (weaknessesEl) weaknessesEl.innerText = `${data.weaknesses.join(', ')}`;
    if (loveEl) loveEl.innerText = `${data.love}`;
    if (healthEl) healthEl.innerText = `${data.health}`;
    if (rulerEl) rulerEl.innerText = `${data.ruler}`;
    if (compatibleEl) compatibleEl.innerText = `${data.compatible.join(', ')}`;

    resDiv.style.display = 'block';
    resDiv.classList.add('animate__animated', 'animate__fadeIn');
    
    // เลื่อนหน้าจอไปที่ผลลัพธ์
    resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}




/**
 * บันทึกรูปภาพผลลัพธ์ (Capture)
 */
async function saveAscendantImg() {
    if (typeof html2canvas === "undefined") {
        alert("ระบบไม่พบ Library สำหรับสร้างภาพ");
        return;
    }

    const captureArea = document.getElementById('ascendantResult');
    if (!captureArea || captureArea.style.display === 'none') {
        alert("กรุณาคำนวณลัคนาก่อนบันทึกภาพครับ");
        return;
    }

    // เตรียมปุ่มแชร์เพื่อซ่อน
    const saveButton = document.querySelector('.btn-outline-gold');
    const originalDisplay = saveButton ? saveButton.style.display : '';

    if (saveButton) saveButton.style.display = 'none';

    try {
        const canvas = await html2canvas(captureArea, {
            backgroundColor: '#000000',
            scale: 2,
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => {
                // ปรับแต่ง UI ใน Clone ก่อนถ่ายภาพให้ดูสวยงาม
                const clonedArea = clonedDoc.getElementById('ascendantResult');
                if (clonedArea) {
                    clonedArea.style.padding = '30px';
                    clonedArea.style.border = '2px solid #d4af37';
                    clonedArea.style.borderRadius = '15px';
                }
            }
        });

        const imageData = canvas.toDataURL("image/png");
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        
        const zodiacName = document.getElementById('ascSign')?.innerText.replace('ลัคนาราศี', '') || 'Zodiac';
        downloadLink.download = `ลัคนา_ราศี${zodiacName}.png`;
        downloadLink.click();

    } catch (error) {
        console.error("Capture Error:", error);
        alert("ไม่สามารถบันทึกภาพได้ โปรดลองอีกครั้ง");
    } finally {
        if (saveButton) saveButton.style.display = originalDisplay;
    }
}

// ผูกฟังก์ชันเข้ากับ DOM
document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btnCalculateAsc');
    if (calcBtn) calcBtn.addEventListener('click', calculateAscendant);
});