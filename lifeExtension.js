const adviceDict = {
    "1": { 
        advice: "ดวงปีนี้เปรียบเสมือนตะเกียงที่ขาดน้ำมัน ต้องเติมแสงสว่างให้จิตใจและโชคลาภ", 
        prayer: "คาถาหัวใจเศรษฐี: อุ อา กะ สะ (ภาวนา 9 จบ) ขอให้แสงสว่างแห่งปัญญาและโชคลาภจงบังเกิด",
        do: "ถวายเทียนคู่, หลอดไฟ หรือเติมน้ำมันตะเกียงตามวัด", 
        avoid: "การเดินทางในที่อับโชคยามวิกาล" 
    },
    "2": { 
        advice: "ดวงชะตาติดธาตุไฟเบียดเบียน ต้องการความร่มเย็นจากอานิสงส์แห่งทานน้ำ", 
        prayer: "คาถาเมตตามหานิยม: นะเมตตา โมกรุณา พุทธปราณี ธายินดี ยะเอ็นดู (ภาวนา 5 จบ)",
        do: "ปล่อยปลาหน้าเขียง 9 ตัว หรือบริจาคน้ำดื่มให้คนยากไร้", 
        avoid: "การต่อปากต่อคำและการใช้อารมณ์ตัดสินปัญหา" 
    },
    "3": { 
        advice: "เกณฑ์ดวงมีอุปสรรคขวางกั้น ต้องใช้บารมีแห่งการเจริญสติแก้ไข", 
        prayer: "คาถาชนะมาร: ปัญจะมาเร ชิโน นาโถ เอตเตนะ สัจจะวัชเชนะ (ภาวนา 3 จบ) ขออุปสรรคทั้งปวงจงพินาศไป",
        do: "ถือศีล 8 หรือนุ่งขาวห่มขาวปฏิบัติธรรมอย่างน้อย 3 วัน", 
        avoid: "การตัดสินใจเรื่องใหญ่ในขณะที่ใจไม่สงบ" 
    },
    "4": { 
        advice: "ชะตาชีวิตปีนี้มักถูกเอาเปรียบ ต้องเสริมดวงด้วยการเป็นผู้ให้เพื่อแก้เคล็ด",
        prayer: "คาถาป้องกันภัย: ระตะนัตตะยัง นะมามิ (ภาวนา 7 จบ) ขออำนาจพระรัตนตรัยคุ้มครองกั้นขวางคนพาล", 
        do: "ทำบุญกับคนพิการหรือผู้ป่วยอนาถา", 
        avoid: "การค้ำประกันหรือให้หยิบยืมเงินทอง" 
    },
    "5": { 
        advice: "บารมีปีนี้อ่อนกำลัง ต้องพึ่งพาพลังแห่งสิ่งศักดิ์สิทธิ์และแรงครู", 
        prayer: "คาถาอาราธนาบารมีครู: สิทธิการิยะ มะหาลาโภ สัพพะคุโณ สัพพะลาโภ (ภาวนา 9 จบ)",
        do: "ไหว้ศาลหลักเมืองหรือบูรพกษัตริย์เพื่อขอพรบารมี", 
        avoid: "การลบหลู่ดูหมิ่นสถานศักดิ์สิทธิ์หรือครูบาอาจารย์" 
    },
    "6": { 
        advice: "ดวงชะตามีเกณฑ์ปากเป็นเอก ต้องระวังวาจาแต่ให้ใช้เสียงสร้างบุญ", 
        prayer: "คาถาสาริกาลิ้นทอง: พุทธา อะเนนา มะลิยา สุสังคะเยมิ (ภาวนา 3 จบ) ให้วาจาศักดิ์สิทธิ์มีเสน่ห์",
        do: "ร่วมบุญพิมพ์หนังสือธรรมะ หรือบริจาคเครื่องขยายเสียงให้วัด", 
        avoid: "การนินทาว่าร้ายหรือพูดจาส่อเสียดผู้อื่น" 
    },
    "7": { 
        advice: "ธาตุดินในดวงแปรปรวน ต้องเสริมความมั่นคงด้วยการสร้างถาวรวัตถุ", 
        prayer: "คาถาธรณีสาร: ยะโตหัง ภะคินิ อะริยายะ ชาติยา ชาโต (ภาวนา 1 จบ) ล้างสิ่งอัปมงคลในที่อยู่อาศัย",
        do: "ร่วมบุญซื้อที่ดินถวายวัด หรือซื้ออิฐหินปูนทรายสร้างโบสถ์", 
        avoid: "การโยกย้ายที่อยู่อาศัยหรือเปลี่ยนงานแบบกะทันหัน" 
    },
    "8": { 
        advice: "เกณฑ์ดวงมีทุกข์ลาภ ต้องแก้ด้วยการสละทรัพย์ส่วนเกินเพื่อป้องกันภัย", 
        prayer: "คาถาต่ออายุ: อะเตนะ สัจจะวัชเชนะ โสตถิ เต โหตุ สัพพะทา (ภาวนา 9 จบ) ขอความสวัสดีจงมีแก่ข้าพเจ้า",
        do: "ทำบุญโลงศพและผ้าขาวห่อศพไร้ญาติ", 
        avoid: "การเสี่ยงโชคแบบทุ่มสุดตัวจนเกินกำลัง" 
    },
    "9": { 
        advice: "ปีนี้มีเกณฑ์ผู้ใหญ่ให้โทษ ต้องเข้าหาความเมตตาเพื่อเปลี่ยนร้ายเป็นดี", 
        prayer: "คาถาพยัคฆ์เรียกทรัพย์: อิติปิโส ภะคะวา อะระหัง สัมมาสัมพุทโธ (สวดบทอิติปิโสเต็มเพื่อสร้างตบะบารมี)",
        do: "จัดสำรับอาหารถวายสังฆทานแก่พระสงฆ์เนื้อนาบุญ", 
        avoid: "การปะทะหรือโต้เถียงกับผู้ใหญ่ในครอบครัวหรือที่ทำงาน" 
    },
    "10": { 
        advice: "ดวงชะตามืดมัวด้วยเมฆหมอกอุปสรรค ต้องล้างอาถรรพ์ด้วยพลังแห่งน้ำมงคล", 
        prayer: "คาถาน้ำมนต์ล้างอาถรรพ์: ชะยันโต โพธิยา มูเล สักยานัง นันทิวัฑฒะโน (ภาวนาขณะกรวดน้ำ)",
        do: "ขอขมาพ่อแม่และรับพรน้ำพุทธมนต์เพื่อเป็นสิริมงคล", 
        avoid: "การข้องแวะกับอบายมุขและสิ่งมึนเมา" 
    },
    "11": { 
        advice: "ดวงชะตามีพลังงานไหลเวียนดีแต่ต้องระวังภัยจากบริวาร", 
        prayer: "คาถาเรียกทรัพย์ (หลวงพ่อปาน): พุทธะ มะอะอุ นะโมพุทธายะ (ภาวนา 9 จบ) เร่งโชคลาภให้ไหลมา",
        do: "ไหว้พระพรหมขอพรให้เปิดทางโชคลาภ", 
        avoid: "การนำคนแปลกหน้าเข้าบ้านหรือไว้ใจคนง่ายเกินไป" 
    },
    "12": { 
        advice: "ดวงปีนี้ธาตุน้ำหลาก ต้องคุมสติให้มั่นคงและเสริมดวงด้วยเมตตาบารมี", 
        prayer: "คาถาสงบจิต: จิตติ จิตตัง มะมัง สัพพะสิทธิ ชะยา สิทธิ (ภาวนาเพื่อคุมสติให้มั่นคง)",
        do: "ไหว้พระแม่คงคาหรือทำบุญปล่อยสัตว์น้ำที่เป็นอิสระ", 
        avoid: "การใจอ่อนยอมคนจนตัวเองต้องลำบาก" 
    }
};


function showlifeextension() {
    const contianer = document.getElementById('showlifeextensionpage')
    if (!contianer) return;
    
    const html = `
            <div class="container mt-4">
            <div class="card shadow-lg"
                style="background: radial-gradient(circle, #1a1a1a 0%, #000 100%); border: 1px solid #d4af37; border-radius: 20px;">
                <div class="card-header text-center py-4 border-gold">
                    <h2 class="text-gold"><i class="fas fa-praying-hands mr-2"></i> วิชามหามงคล "ต่อชะตาชีวิต"</h2>
                    <h4 class="text-muted">เสริมสิริมงคล แก้เคล็ดดวงชะตา ตามตำรับสยามโหรามงคล</h4>
                </div>
                <div class="card-body text-center p-5">
                    <div class="candle-container mb-5">
                        <div class="flame"></div>
                        <div class="candle"></div>
                    </div>
                    <div id="setupExtension">
                        <h4 class="text-white mb-4">ระบุเดือนเกิดของท่านเพื่อเริ่มพิธี</h4>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <select id="birthMonth" class="form-control bg-dark text-white border-gold mb-4" onclick="startRitual()">
                                    <option value="">-- เลือกเดือนเกิด --</option>
                                    <option value="1">มกราคม</option>
                                    <option value="2">กุมภาพันธ์</option>
                                    <option value="3">มีนาคม</option>
                                    <option value="4">เมษายน</option>
                                    <option value="5">พฤษภาคม</option>
                                    <option value="6">มิถุนายน</option>
                                    <option value="7">กรกฎาคม</option>
                                    <option value="8">สิงหาคม</option>
                                    <option value="9">กันยายน</option>
                                    <option value="10">ตุลาคม</option>
                                    <option value="11">พฤศจิกายน</option>
                                    <option value="12">ธันวาคม</option>
                                </select>
                                <button class="btn btn-gold btn-lg btn-block" onclick="startRitual()">
                                    <i class="fas fa-fire mr-2"></i> เริ่มพิธีต่อชะตา
                                </button>
                                <button class="btn btn-outline-secondary btn-block mt-4 border-0"
                                    onclick="navigateTo('mainpage')">
                                    <i class="fas fa-chevron-left"></i> กลับหน้าห้องพยากรณ์
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="ritualResult" style="display: none;" class="mt-4">
                        <div class="ritual-box p-4 rounded"
                            style="background: rgba(0, 0, 0, 0.6); border: 1px solid #d4af37; overflow: hidden; position: relative; min-height: 400px;">
                            <div id="prayerScroll" class="prayer-text-container">
                                <div class="prayer-content">
                                    <p>นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)</p>
                                    <p>สัพพะพุทธานุภาเวนะ สัพพะธัมมานุภาเวนะ สัพพะสังฆานุภาเวนะ</p>
                                    <p>พุทธะระตะนัง ธัมมะระตะนัง สังฆะระตะนัง</p>
                                    <p>โอสะถัง อุตตะมัง วะรัง สัพพะทุกขะ สัพพะภะยะ สัพพะโรคะ</p>
                                    <p>วินาสสะเมนตุ อะเสสะโต...</p>
                                    <p>✨ ตั้งจิตอธิษฐาน ขอให้ชะตาร้ายกลายเป็นดี ✨</p>
                                </div>
                            </div>

                            <div id="finalAdvice" style="display: none; position: relative; z-index: 10;">
                                <div id="captureRitualArea" class="p-4"
                                    style="background: rgba(0,0,0,0.4); border-radius: 15px;">
                                    <h2 class="text-gold mb-4">✨ ผลพิธีต่อชะตาชีวิต ✨</h2>

                                    <div class="prayer-summary-box mb-4 p-3"
                                        style="border: 1px double #d4af37; background: rgba(212, 175, 55, 0.05);">
                                        <small class="text-gold-50">บทสวดมงคลประจำชะตาของท่าน</small>
                                        <p id="summaryPrayer" class="text-white mt-2 mb-0"
                                            style="font-size: 1.3rem; font-weight: bold;"></p>
                                    </div>

                                    <div class="row text-left mb-4">
                                        <div class="col-12 mb-3">
                                            <label class="text-muted small">เกณฑ์ชะตาปีนี้:</label>
                                            <p id="extensionAdvice" class="text-white" style="font-size: 1.1rem;"></p>
                                        </div>
                                        <div class="col-6">
                                            <label class="text-success-gold small">สิ่งที่ควรทำเสริมดวง:</label>
                                            <p id="toDo" class="text-white"></p>
                                        </div>
                                        <div class="col-6">
                                            <label class="text-danger small">สิ่งที่ควรระวัง:</label>
                                            <p id="toAvoid" class="text-white"></p>
                                        </div>
                                    </div>
                                    <small class="text-gold-50 italic">สยามโหรามงคล 🔮 ประธานโบ้</small>
                                </div>

                                <button class="btn btn-outline-gold mt-4 px-5" onclick="downloadRitualImage()">
                                    <i class="fas fa-camera mr-2"></i> บันทึกภาพมงคลนี้
                                </button>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    `;
    contianer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    showlifeextension();
});


function startRitual() {
    const month = document.getElementById('birthMonth').value;
    if (!month) {
        return;
    }

    const result = adviceDict[month];

    // เปลี่ยนข้อความในบทสวดให้เป็นของเดือนนั้นๆ
    const prayerContainer = document.querySelector('.prayer-content');
    prayerContainer.innerHTML = `
        <p>--- เริ่มพิธีต่อชะตาเฉพาะเดือนเกิด ---</p>
        <p>ตั้งนะโม 3 จบ</p>
        <p style="color: #ffd700; font-size: 1.5rem; font-weight: bold;">${result.prayer}</p>
        <p>✨ ตั้งจิตอธิษฐานให้สิ่งชั่วร้ายกลายเป็นดี ✨</p>
    `;

    $("#setupExtension").fadeOut(500, function() {
        $("#ritualResult").fadeIn(500);
        
        // เริ่มเลื่อนบทสวด (ปรับเวลาตามต้องการ)
        prayerContainer.style.animation = "scrollUp 12s linear forwards";

        setTimeout(() => {
            $("#prayerScroll").fadeOut(1000, function() {
                const result = adviceDict[month];
                
                // ใส่ข้อมูลลงในหน้าสรุป
                document.getElementById('summaryPrayer').innerText = result.prayer;
                document.getElementById('extensionAdvice').innerText = result.advice;
                document.getElementById('toDo').innerText = result.do;
                document.getElementById('toAvoid').innerText = result.avoid;

                $("#finalAdvice").fadeIn(1000);
            });
        }, 12000);
    });
}

function downloadRitualImage() {
    const area = document.getElementById("captureRitualArea");
    const btn = event.currentTarget;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังเตรียมภาพมงคล...';

    html2canvas(area, {
        backgroundColor: "#121212",
        scale: 3,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById("captureRitualArea");
            el.style.padding = "50px";
            el.style.border = "2px solid #d4af37"; // ใส่กรอบทองในรูปให้หรูขึ้น
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ต่อชะตา-สยามโหรามงคล-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-camera mr-2"></i> บันทึกภาพมงคลนี้';
    });
}