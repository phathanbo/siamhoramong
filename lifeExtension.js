const dayDict = {
    "1": { 
        name: "วันอาทิตย์ (๑)", 
        power: 6, 
        candleText: "บูชาเทียนมงคลกำลัง ๖ เล่ม ตามกำลังดาวอาทิตย์", 
        dayPrayer: "คาถาโมรปริตร: อุเทตะยัญจักขุมา เอกะราชา หะริสสะวัณโณ ปะฐะวิปะภาโส (สวด ๖ จบ)",
        guardian: "พระอาทิตย์ - เสริมตบะอำนาจ ขจัดศัตรูและอุปสรรคมืดมนให้สิ้นไป"
    },
    "2": { 
        name: "วันจันทร์ (๒)", 
        power: 15, 
        candleText: "บูชาเทียนมงคลกำลัง ๑๕ เล่ม ตามกำลังดาวจันทร์", 
        dayPrayer: "คาถาอภัยปริตร: ยันทุนนิมิตตัง อะวะมังคะลัญจะ โย จามะนาโป สะกุณัสสะ สัทโธ (สวด ๑๕ จบ)",
        guardian: "พระจันทร์ - เสริมเสน่ห์ เมตตามหานิยม และความสงบเย็นในจิตใจ"
    },
    "3": { 
        name: "วันอังคาร (๓)", 
        power: 8, 
        candleText: "บูชาเทียนมงคลกำลัง ๘ เล่ม ตามกำลังดาวอังคาร", 
        dayPrayer: "คาถากรณียเมตตสูตร: ยัสสานุภาวะโต ยักขา เนวะ ทัสเสนติ ภิงสะนัง (สวด ๘ จบ)",
        guardian: "พระอังคาร - เสริมความเข้มแข็ง ขจัดภูตผีปีศาจและภัยอันตรายทั้งปวง"
    },
    "4": { 
        name: "วันพุธ (กลางวัน) (๔)", 
        power: 17, 
        candleText: "บูชาเทียนมงคลกำลัง ๑๗ เล่ม ตามกำลังดาวพุธ", 
        dayPrayer: "คาถาสัพพะมงคลคาถา: สัพพะมังคะละสัจจัง สัพพะเทวะตานุภาเวนะ สัพพะโสตถี ภะวันตุ เต (สวด ๑๗ จบ)",
        guardian: "พระพุธ - เสริมปัญญา วาจาสิทธิ์ ค้าขายคล่อง และเจริญในโภคทรัพย์"
    },
    "8": { 
        name: "วันพุธ (กลางคืน) / พระราหู (๘)", 
        power: 12, 
        candleText: "บูชาเทียนมงคลกำลัง ๑๒ เล่ม ตามกำลังพระราหู", 
        dayPrayer: "คาถาสุริยปริตร-จันทปริตร: กินนุ สันตะระมาโนวะ ราหุ จันทัง ปะมุญจะสิ (สวด ๑๒ จบ)",
        guardian: "พระราหู - พลิกดวงชะตาจากร้ายกลายเป็นดี เสริมมหาโชคลาภลี้ลับ"
    },
    "5": { 
        name: "วันพฤหัสบดี (๕)", 
        power: 19, 
        candleText: "บูชาเทียนมงคลกำลัง ๑๙ เล่ม ตามกำลังดาวพฤหัสบดี", 
        dayPrayer: "คาถารัตนสูตร: ยานีธะ ภูตานิ สะมาคะตานิ ภุมมานิ วา ยานิวะ อันตะลิกเข (สวด ๑๙ จบ)",
        guardian: "พระพฤหัสบดี - เสริมบารมีแห่งปัญญา ครูบาอาจารย์ และเทพยดาอุปถัมภ์ค้ำชู"
    },
    "6": { 
        name: "วันศุกร์ (๖)", 
        power: 21, 
        candleText: "บูชาเทียนมงคลกำลัง ๒๑ เล่ม ตามกำลังดาวศุกร์", 
        dayPrayer: "คาถาธชัคคสูตร: อิติปิ โส ภะคะวา อะระหัง สัมมาสัมพุทโธ (สวด ๒๑ จบ ขจัดความกลัวและภัยร้าย)",
        guardian: "พระศุกร์ - เสริมความอุดมสมบูรณ์ ดึงดูดทรัพย์สมบัติ ความรัก และความร่มเย็น"
    },
    "7": { 
        name: "วันเสาร์ (๗)", 
        power: 10, 
        candleText: "บูชาเทียนมงคลกำลัง ๑๐ เล่ม ตามกำลังดาวเสาร์", 
        dayPrayer: "คาถาองคุลีมาลปริตร: ยะโตหัง ภะคินิ อะริยายะ ชาติยา ชาโต (สวด ๑๐ จบ สะเดาะเคราะห์หนักและโรคภัย)",
        guardian: "พระเสาร์ - เสริมความมั่นคงถาวร แคล้วคลาดจากเคราะห์กรรม ผ่านพ้นทุกข์โศกโรคภัย"
    }
};

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
        advice: "ดวงชะตามมีเกณฑ์ปากเป็นเอก ต้องระวังวาจาแต่ให้ใช้เสียงสร้างบุญ", 
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
        advice: "ดวงชะตามมีพลังงานไหลเวียนดีแต่ต้องระวังภัยจากบริวาร", 
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
    const contianer = document.getElementById('showlifeextensionpage');
    if (!contianer) return;
    
    const html = `
            <div class="container mt-4">
            <div class="card shadow-lg"
                style="background: radial-gradient(circle, #1a1a1a 0%, #000 100%); border: 1px solid #d4af37; border-radius: 20px;">
                <div class="card-header text-center py-4 border-gold">
                    <h2 class="text-gold"><i class="fas fa-praying-hands mr-2"></i> วิชามหามงคล "ต่อชะตาชีวิต"</h2>
                    <h4 class="text-muted">เสริมสิริมงคล สะเดาะเคราะห์ต่ออายุ ตามตำราพรหมชาติและคัมภีร์ทักษา</h4>
                </div>
                <div class="card-body text-center p-5">
                    <div class="candle-container mb-5">
                        <div class="flame"></div>
                        <div class="candle"></div>
                    </div>
                    <div id="setupExtension">
                        <h4 class="text-white mb-4">ระบุวันเกิดและเดือนเกิดของท่านเพื่อเริ่มพิธี</h4>
                        <div class="row justify-content-center">
                            <div class="col-md-8">
                                <label class="text-gold small text-left d-block mb-1" style="font-weight:bold;">๑. เลือกวันเกิด (เพื่อกำหนดกำลังเทียนมงคลและดาวคุ้มครอง)</label>
                                <select id="birthDay" class="form-control bg-dark text-white border-gold mb-3">
                                    <option value="">-- เลือกวันเกิด (อาทิตย์ - เสาร์) --</option>
                                    <option value="1">วันอาทิตย์ (๑) - กำลังเทียนมงคล ๖ เล่ม</option>
                                    <option value="2">วันจันทร์ (๒) - กำลังเทียนมงคล ๑๕ เล่ม</option>
                                    <option value="3">วันอังคาร (๓) - กำลังเทียนมงคล ๘ เล่ม</option>
                                    <option value="4">วันพุธ กลางวัน (๔) - กำลังเทียนมงคล ๑๗ เล่ม</option>
                                    <option value="8">วันพุธ กลางคืน / พระราหู (๘) - กำลังเทียนมงคล ๑๒ เล่ม</option>
                                    <option value="5">วันพฤหัสบดี (๕) - กำลังเทียนมงคล ๑๙ เล่ม</option>
                                    <option value="6">วันศุกร์ (๖) - กำลังเทียนมงคล ๒๑ เล่ม</option>
                                    <option value="7">วันเสาร์ (๗) - กำลังเทียนมงคล ๑๐ เล่ม</option>
                                </select>

                                <label class="text-gold small text-left d-block mb-1" style="font-weight:bold;">๒. เลือกเดือนเกิด (นับตามจันทรคติไทยในตำราพรหมชาติ)</label>
                                <select id="birthMonth" class="form-control bg-dark text-white border-gold mb-4">
                                    <option value="">-- เลือกเดือนเกิดตามตำราพรหมชาติ --</option>
                                    <option value="1">เดือนอ้าย (เดือน ๑ - ผู้เกิดช่วง ธ.ค. / ม.ค.)</option>
                                    <option value="2">เดือนยี่ (เดือน ๒ - ผู้เกิดช่วง ม.ค. / ก.พ.)</option>
                                    <option value="3">เดือนสาม (เดือน ๓ - ผู้เกิดช่วง ก.พ. / มี.ค.)</option>
                                    <option value="4">เดือนสี่ (เดือน ๔ - ผู้เกิดช่วง มี.ค. / เม.ย.)</option>
                                    <option value="5">เดือนห้า (เดือน ๕ - ผู้เกิดช่วง เม.ย. / พ.ค.)</option>
                                    <option value="6">เดือนหก (เดือน ๖ - ผู้เกิดช่วง พ.ค. / มิ.ย.)</option>
                                    <option value="7">เดือนเจ็ด (เดือน ๗ - ผู้เกิดช่วง มิ.ย. / ก.ค.)</option>
                                    <option value="8">เดือนแปด (เดือน ๘ - ผู้เกิดช่วง ก.ค. / ส.ค.)</option>
                                    <option value="9">เดือนเก้า (เดือน ๙ - ผู้เกิดช่วง ส.ค. / ก.ย.)</option>
                                    <option value="10">เดือนสิบ (เดือน ๑๐ - ผู้เกิดช่วง ก.ย. / ต.ค.)</option>
                                    <option value="11">เดือนสิบเอ็ด (เดือน ๑๑ - ผู้เกิดช่วง ต.ค. / พ.ย.)</option>
                                    <option value="12">เดือนสิบสอง (เดือน ๑๒ - ผู้เกิดช่วง พ.ย. / ธ.ค.)</option>
                                </select>
                                <button class="btn btn-gold btn-lg btn-block" onclick="startRitual()">
                                    <i class="fas fa-fire mr-2"></i> เริ่มพิธีต่อชะตาสะเดาะเคราะห์
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
                                    <h2 class="text-gold mb-4">✨ ผลพิธีต่อชะตาชีวิตและสะเดาะเคราะห์ ✨</h2>

                                    <div class="prayer-summary-box mb-3 p-3 text-left"
                                        style="border: 1px solid #d4af37; background: rgba(212, 175, 55, 0.1); border-radius: 10px;">
                                        <small class="text-gold-50">เครื่องบูชาต่อชะตาประจำกำลังวันเกิด</small>
                                        <div id="summaryDayPower" class="text-white mt-1 mb-0" style="font-size: 1.1rem;"></div>
                                    </div>

                                    <div class="prayer-summary-box mb-4 p-3 text-left"
                                        style="border: 1px double #d4af37; background: rgba(212, 175, 55, 0.05); border-radius: 10px;">
                                        <small class="text-gold-50">บทสวดมงคลต่อชะตาประจำตัวท่าน</small>
                                        <div id="summaryPrayer" class="text-white mt-2 mb-0" style="font-size: 1.1rem;"></div>
                                    </div>

                                    <div class="row text-left mb-4">
                                        <div class="col-12 mb-3">
                                            <label class="text-muted small">เกณฑ์ชะตาและคำแนะนำปีนี้:</label>
                                            <p id="extensionAdvice" class="text-white" style="font-size: 1.1rem;"></p>
                                        </div>
                                        <div class="col-6">
                                            <label class="text-success-gold small">สิ่งที่ควรทำเสริมดวง (แก้เคล็ด):</label>
                                            <p id="toDo" class="text-white"></p>
                                        </div>
                                        <div class="col-6">
                                            <label class="text-danger small">สิ่งที่ควรระวังเป็นพิเศษ:</label>
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
    const day = document.getElementById('birthDay').value;
    const month = document.getElementById('birthMonth').value;
    if (!day || !month) {
        if (typeof Swal !== 'undefined') {
            Swal.fire('แจ้งเตือน', 'กรุณาระบุทั้งวันเกิดและเดือนเกิดให้ครบถ้วนตามตำรา', 'warning');
        } else {
            alert('กรุณาระบุทั้งวันเกิดและเดือนเกิดให้ครบถ้วน');
        }
        return;
    }

    const mRes = adviceDict[month];
    const dRes = dayDict[day];

    const prayerContainer = document.querySelector('.prayer-content');
    prayerContainer.innerHTML = `
        <p style="color: #ffd700; font-weight: bold;">--- เริ่มพิธีต่อชะตาสำหรับผู้เกิด${dRes.name} ---</p>
        <p class="text-white" style="font-size:1.1rem;">${dRes.candleText}</p>
        <p>ตั้งนะโม 3 จบ</p>
        <p style="color: #ffd700; font-size: 1.25rem; font-weight: bold; margin-top:15px;">[พระคาถาประจำวันเกิด]<br><span style="color:#fff; font-size:1.1rem;">${dRes.dayPrayer}</span></p>
        <p style="color: #00ffcc; font-size: 1.25rem; font-weight: bold; margin-top:15px;">[พระคาถาประจำเดือนเกิด]<br><span style="color:#fff; font-size:1.1rem;">${mRes.prayer}</span></p>
        <p style="margin-top:20px;">✨ ตั้งจิตอธิษฐาน ขออานุภาพพระรัตนตรัยและแรงครู เปลี่ยนร้ายกลายเป็นดี ✨</p>
    `;

    $("#setupExtension").fadeOut(500, function() {
        $("#ritualResult").fadeIn(500);
        
        prayerContainer.style.animation = "scrollUp 14s linear forwards";

        setTimeout(() => {
            $("#prayerScroll").fadeOut(1000, function() {
                document.getElementById('summaryDayPower').innerHTML = `<strong class="text-gold" style="font-size:1.15rem;">${dRes.candleText}</strong><br><small class="text-muted">เทวดาคุ้มครอง: ${dRes.guardian}</small>`;
                document.getElementById('summaryPrayer').innerHTML = `<div style="margin-bottom:10px;"><strong>คาถาประจำวันเกิด:</strong> <span style="color:#ffd700;">${dRes.dayPrayer}</span></div><div><strong>คาถาประจำเดือนเกิด:</strong> <span style="color:#00ffcc;">${mRes.prayer}</span></div>`;
                document.getElementById('extensionAdvice').innerText = mRes.advice;
                document.getElementById('toDo').innerText = mRes.do;
                document.getElementById('toAvoid').innerText = mRes.avoid;

                $("#finalAdvice").fadeIn(1000);
            });
        }, 14000);
    });
}

async function downloadRitualImage() {
    const btn = event.currentTarget;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังเตรียมภาพมงคล...';

    try {
        await document.fonts.ready;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1350;

        // Background
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Outer border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 12;
        ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
        ctx.setLineDash([]);

        // Header
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 58px "Sarabun", sans-serif';
        ctx.fillText('✨ ผลพิธีต่อชะตาชีวิต ✨', canvas.width / 2, 80);

        // Divider line
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 165);
        ctx.lineTo(canvas.width - 100, 165);
        ctx.stroke();

        // Helper: wrapText
        const wrapText = (text, x, y, maxWidth, lineHeight) => {
            if (!text) return y;
            let lines = [];
            if (window.Intl && window.Intl.Segmenter) {
                const seg = new Intl.Segmenter('th', { granularity: 'word' });
                let curr = '';
                for (const { segment } of seg.segment(text)) {
                    if (ctx.measureText(curr + segment).width > maxWidth && curr.trim()) {
                        lines.push(curr); curr = segment;
                    } else curr += segment;
                }
                lines.push(curr);
            } else {
                lines = [text];
            }
            for (const line of lines) {
                ctx.fillText(line, x, y);
                y += lineHeight;
            }
            return y;
        };

        // Section: Day Power
        const dayPowerEl = document.getElementById('summaryDayPower');
        const dayPowerText = dayPowerEl?.innerText || '';
        let y = 195;

        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
        ctx.textAlign = 'left';
        ctx.fillText('เครื่องบูชาต่อชะตา:', 100, y);
        y += 55;
        ctx.font = '34px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffffff';
        y = wrapText(dayPowerText, 100, y, canvas.width - 200, 50);

        y += 30;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(canvas.width - 100, y); ctx.stroke();
        y += 30;

        // Section: Prayer
        const prayerEl = document.getElementById('summaryPrayer');
        const prayerText = prayerEl?.innerText || '';
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
        ctx.fillText('บทสวดมงคล:', 100, y);
        y += 55;
        ctx.font = '32px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffd700';
        y = wrapText(prayerText, 100, y, canvas.width - 200, 48);

        y += 30;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(canvas.width - 100, y); ctx.stroke();
        y += 30;

        // Section: Advice
        const adviceEl = document.getElementById('extensionAdvice');
        const adviceText = adviceEl?.innerText || '';
        ctx.font = 'bold 36px "Sarabun", sans-serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
        ctx.fillText('เกณฑ์ชะตาปีนี้:', 100, y);
        y += 55;
        ctx.font = '32px "Sarabun", sans-serif';
        ctx.fillStyle = '#cccccc';
        y = wrapText(adviceText, 100, y, canvas.width - 200, 48);

        y += 30;

        // Section: Do / Avoid
        const toDoEl = document.getElementById('toDo');
        const toAvoidEl = document.getElementById('toAvoid');
        const toDoText = toDoEl?.innerText || '';
        const toAvoidText = toAvoidEl?.innerText || '';

        const colW = (canvas.width - 200) / 2 - 20;

        ctx.font = 'bold 34px "Sarabun", sans-serif';
        ctx.fillStyle = '#28a745';
        ctx.fillText('✅ สิ่งควรทำ:', 100, y);
        ctx.fillStyle = '#dc3545';
        ctx.fillText('⚠️ ควรระวัง:', 100 + colW + 40, y);
        y += 50;

        ctx.font = '30px "Sarabun", sans-serif';
        ctx.fillStyle = '#ffffff';
        wrapText(toDoText, 100, y, colW, 44);
        wrapText(toAvoidText, 100 + colW + 40, y, colW, 44);

        // Footer watermark
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.font = '28px "Sarabun", sans-serif';
        ctx.fillText('สยามโหรามงคล 🔮 ประธานโบ้', canvas.width / 2, canvas.height - 100);

        const link = document.createElement('a');
        link.download = `ต่อชะตา-สยามโหรามงคล-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-camera mr-2"></i> บันทึกภาพมงคลนี้';
    } catch (e) {
        console.error('Canvas Error:', e);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกภาพได้', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-camera mr-2"></i> บันทึกภาพมงคลนี้';
    }
}