"use strict";
/**
 * knowledge-data.js
 * ข้อมูลบทความความรู้โหราศาสตร์ไทย / วิถีสิริมงคล / พรหมชาติ
 * เวอร์ชันเสถียร – พร้อมใช้งานในระบบเว็บแอป (ES Module + CommonJS + Global)
 */
const KNOWLEDGE_ARTICLES = {
    "promchat": {
        id: "K001",
        category: "ตำราโบราณ",
        title: "📜 ตำราพรหมชาติฉบับมาตรฐาน (เข้าใจง่าย ไม่มีพื้นฐานก็อ่านเป็น)",
        type: "พื้นฐานดวงชะตา",
        level: "ทั่วไป (เหมาะสำหรับทุกคน)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-history mr-2"></i>๑. ตำราพรหมชาติคืออะไร? ทำไมคนไทยถึงเปิดอ่านมากว่า ๓๐๐ ปี?</h5>
                    <p>หากจะเปรียบเทียบให้เห็นภาพชัดเจนที่สุด <b>"ตำราพรหมชาติ"</b> ก็คือ <i>คู่มือแผนที่ชีวิตและวิถีชุมชนของคนไทยโบราณ</i> นั่นเอง รวบรวมภูมิปัญญาโหราศาสตร์ไทย มอญ ลานนา และพราหมณ์เข้าไว้ด้วยกัน เริ่มใช้แพร่หลายตั้งแต่สมัยกรุงศรีอยุธยาเรื่อยมาจนถึงรัตนโกสินทร์</p>
                    <p>ในอดีต บ้านคนไทยแทบทุกหลังคาเรือนจะต้องมีสมุดข่อยหรือหนังสือพรหมชาติติดบ้านไว้คนละเล่ม ไม่ใช่เพียงเพื่อ "ดูดวงสะเดาะเคราะห์" เท่านั้น แต่ใช้เป็น <b>เข็มทิศประจำวัน</b> เช่น วันนี้จะปลูกเรือนหันหน้าไปทางไหน, แต่งงานวันไหนดี, ลูกคลอดเดือนนี้ควรชื่ออะไร, และคู่ครองคนนี้อยู่ด้วยกันแล้วจะช่วยกันสร้างตัวได้หรือไม่</p>
                </section>

                <section class="mb-4 p-3 bg-black-25 rounded border-left-gold shadow-sm">
                    <h6 class="text-gold-light mb-2"><i class="fas fa-compass mr-2"></i>๓ แกนหลักของพรหมชาติที่ทุกคนต้องรู้</h6>
                    <div class="row">
                        <div class="col-md-4 mb-2">
                            <b class="text-info"><i class="fas fa-user-circle mr-1"></i> ๑. อัตตาชะตา (ตัวเรา)</b>
                            <p class="small text-white-50 mt-1 mb-0">เข้าใจต้นทุนชีวิตตัวเอง นิสัย ธาตุเกิด ข้อดีข้อเสียจากปีนักษัตรและวันเกิด</p>
                        </div>
                        <div class="col-md-4 mb-2">
                            <b class="text-gold"><i class="fas fa-hourglass-half mr-1"></i> ๒. วิถีหมุนเวียน (จังหวะเวลา)</b>
                            <p class="small text-white-50 mt-1 mb-0">เข้าใจช่วงชีวิต น้ำขึ้นให้รีบตัก ช่วงดวงตกให้สงบสุขุม ไม่ลงทุนสุ่มเสี่ยง</p>
                        </div>
                        <div class="col-md-4 mb-2">
                            <b class="text-success"><i class="fas fa-heart mr-1"></i> ๓. สมพงษ์ (คนรอบข้าง)</b>
                            <p class="small text-white-50 mt-1 mb-0">การเลือกคนรู้ใจ หุ้นส่วนธุรกิจ และมิตรเกื้อหนุนให้อยู่ร่วมกันอย่างผาสุก</p>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-calculator mr-2"></i>๒. เคล็ดวิชาที่แม่นยำและง่ายที่สุด: "วิชาหาเศษพระจอมเกล้า"</h5>
                    <p>ศาสตร์นี้ว่าด้วยการหา <b>"แก่นแท้ชะตาชีวิต"</b> คิดค้นและสืบทอดโดยพระโหราธิบดีโบราณ โดยคำนวณง่ายๆ ได้ด้วยตัวเองใน ๓ ขั้นตอน:</p>
                    <div class="p-3 bg-dark rounded border-gold mb-3">
                        <h6 class="text-gold mb-2"><i class="fas fa-magic mr-2"></i>สูตรคำนวณหาเศษวาสนา:</h6>
                        <p class="small text-white-50 mb-2"><b>(เลขวันเกิด + เลขเดือนเกิด + เลขปีนักษัตร) รวมกัน แล้วหารด้วย ๗ นำ "เศษที่เหลือ" มาอ่านคำทำนาย</b></p>
                        <div class="small text-muted mb-2">
                            • <b>เลขวัน:</b> อาทิตย์(๑), จันทร์(๒), อังคาร(๓), พุธ(๔), พฤหัสบดี(๕), ศุกร์(๖), เสาร์(๗)<br>
                            • <b>เลขเดือนไทย:</b> นับเดือนอ้าย=๑, เดือนยี่=๒, เดือนสาม=๓ ... หรือนับเดือนสากลเทียบได้<br>
                            • <b>เลขปีนักษัตร:</b> ชวด=๑, ฉลู=๒, ขาล=๓, เถาะ=๔, มะโรง=๕, มะเส็ง=๖, มะเมีย=๗, มะแม=๘, วอก=๙, ระกา=๑๐, จอ=๑๑, กุน=๑๒
                        </div>
                        <div class="p-2 bg-black-25 rounded text-white-50 small">
                            <b class="text-warning">ตัวอย่างง่ายๆ:</b> เกิดวันจันทร์ (๒) + เดือนห้า (๕) + ปีขาล (๓) = ๒ + ๕ + ๓ = ๑๐<br>
                            นำ ๑๐ หาร ๗ ได้ ๑ ครั้ง <b>เหลือเศษ ๓</b> ➔ ตกตำรา "เศษ ๓ มีทรัพย์มาก"
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th style="width: 15%;">เศษที่ได้</th>
                                    <th style="width: 25%;">สมญานามตำรา</th>
                                    <th>คำทำนายถอดความภาษาเข้าใจง่าย</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๑</td>
                                    <td>เสาเรือนเหล็กหัก</td>
                                    <td>ชีวิตมักต้องยืนหยัดด้วยลำแข้งตนเอง เป็นที่พึ่งให้คนอื่น มีบารมีและความเป็นผู้นำสูง อดทนหนักแน่น ชนะอุปสรรคทั้งปวง</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๒</td>
                                    <td>ตกบ่อน้ำเย็น</td>
                                    <td>ชีวิตร่มเย็นเป็นสุข ปลอดโปร่ง ไปไหนมีคนเอ็นดูอุปถัมภ์ ไม่ค่อยตกระกำลำบาก มีกินมีใช้เสมอ</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๓</td>
                                    <td>เงินทองไหลนองเนือง</td>
                                    <td>เด่นด้านโภคทรัพย์ ค้าขายคล่องตัว หากขยันหมั่นเพียรจะตั้งตัวได้เร็วและร่ำรวยมั่นคง</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๔</td>
                                    <td>มีคดีติดตัว / เหน็ดเหนื่อย</td>
                                    <td>ต้องรอบคอบในการทำสัญญาและเอกสาร มักมีเรื่องจุกจิกให้แก้ แต่เป็นคนปัญญาไว แก้ปัญหาเก่ง</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๕</td>
                                    <td>สุขสำราญกายใจ</td>
                                    <td>ชอบทำบุญกุศล รักสงบ จิตใจเมตตา มีผู้ใหญ่คอยประคับประคอง ยามคับขันมักแคล้วคลาดปลอดภัย</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๖</td>
                                    <td>ราชครูสรรเสริญ</td>
                                    <td>มีเสน่ห์ วาจาน่าฟัง คนเชื่อถือ ผู้ใหญ่เมตตาเอ็นดู เหมาะกับงานเจรจา งานศิลปะ หรืองานติดต่อประสานงาน</td>
                                </tr>
                                <tr>
                                    <td class="text-warning font-weight-bold">เศษ ๗ หรือ ๐</td>
                                    <td>มหาจักรพรรดิ / ภูผา</td>
                                    <td>ชีวิตมีช่วงขึ้นลงชัดเจน หากต่อสู้ไม่ยอมแพ้จะยิ่งใหญ่ก้าวหน้า เป็นนายคน มีบารมีคุมบริวาร</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-lightbulb mr-2"></i>๓. วิธีนำตำราพรหมชาติมาใช้ในชีวิตประจำวันยุคดิจิทัล</h5>
                    <ul>
                        <li><b>การเลือกเวลาเจรจาหรือเปิดงาน:</b> ตรวจสอบวันธงชัยและกาลโยคประจำสัปดาห์ เลี่ยงวันอุบาทว์และโลกาวินาศเพื่อให้งานราบรื่น</li>
                        <li><b>การเข้าใจคนในครอบครัวและเพื่อนร่วมงาน:</b> สังเกตปีนักษัตรและธาตุเพื่อปรับวิธีสื่อสาร เช่น คนธาตุไฟควรพูดจาตรงไปตรงมาแต่ไม่ก้าวร้าว คนธาตุน้ำต้องใช้ความนุ่มนวลและเหตุผล</li>
                        <li><b>การบริหารเงินตามช่วงวัย:</b> นำรอบปีจรมาดูเพื่อวางแผนการเงิน หากตกช่วงเคราะห์ ให้ชะลอการกู้ยืมและสะสมเงินสดสำรอง</li>
                    </ul>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-heart text-danger mr-2"></i>ข้อคิดเตือนใจจากครูบาอาจารย์</h6>
                    <small><b>"ลิขิตฟ้า ๕๐% ตัวเราทำเองอีก ๕๐%"</b> พรหมชาติไม่ใช่การนั่งรอโชคชะตา แต่คือแผนที่พยากรณ์อากาศที่บอกว่าฝนจะตกหรือแดดจะออก เพื่อให้เราเตรียมร่มหรือหมวกได้ทันเวลา</small>
                </div>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-warning",
        references: [
            "พระยาโหราธิบดี. <em>ตำราพรหมชาติฉบับหลวง รวบรวมสรรพวิชาโหราศาสตร์พยากรณ์แผ่นดินสยาม</em>. โรงพิมพ์เจริญธรรม.",
            "หลวงประเสริฐอักษรนิติ์. (๒๔๗๒). <em>ประชุมตำราพรหมชาติและการทำนายโบราณ</em>. โรงพิมพ์โสภณพิพรรฒธนากร.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>คู่มือการพยากรณ์ชะตาชีวิตตามตำราพรหมชาติมาตรฐาน</em>."
        ]
    },
    "attakan": {
        id: "K002",
        category: "ฤกษ์ยาม",
        title: "🕒 เคล็ดวิชายามอัฏฐกาล (8 ยาม) : จังหวะเวลานาทีทองที่คนทั่วไปใช้ได้จริง",
        type: "การเลือกเวลาฤกษ์ยาม",
        level: "ทั่วไป (เข้าใจง่ายทันที)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-clock mr-2"></i>๑. ยามอัฏฐกาลคืออะไร? (คนไม่มีพื้นฐานเข้าใจใน ๑ นาที)</h5>
                    <p>เคยสงสัยไหมว่า... ทำไมบางคนพูดจาเรื่องเดียวกันแท้ๆ แต่พูดตอน <b>๑๐ โมงเช้า</b> ลูกค้าตกลงทันที ทว่าพอพูดตอน <b>บ่ายโมง</b> กลับโดนปฏิเสธแถมทะเลาะกัน? คนโบราณค้นพบว่า ในรอบวัน พลังงานจากฟากฟ้าหมุนเวียนเปลี่ยนไปตลอดเวลา</p>
                    <p><b>"ยามอัฏฐกาล"</b> จึงคือวิชาที่แบ่งเวลา ๑ วันออกเป็นช่วงย่อยๆ <b>ช่วงละ ๙๐ นาที (๑ ชั่วโมงครึ่ง)</b> โดยกลางวันมี ๘ ยาม และกลางคืนมี ๘ ยาม แต่ละยามจะมี "ดาวเทวดาประจำยาม" คอยปกครอง ใครที่เลือกทำกิจกรรมให้ตรงกับพลังของยามนั้น ย่อมสำเร็จได้ง่ายดายเหมือนพายเรือตามน้ำ</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-bullseye mr-2"></i>๒. ตารางเลือกยามใช้งานจริงในชีวิตประจำวัน</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>กิจกรรมที่คุณจะทำ</th>
                                    <th>ยามมงคลที่ควรเลือก</th>
                                    <th>เหตุผล & เคล็ดลับที่ทำให้สำเร็จ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-info font-weight-bold">เจรจาค้าขาย / ปิดดีล / เซ็นสัญญา</td>
                                    <td><b class="text-warning">ยามพระพุธ (๔)</b> หรือ <b>ยามลาภะ</b></td>
                                    <td>พุธคือดาวแห่งวาจาและการค้า ทำให้ผู้ฟังเคลิบเคลิ้ม เชื่อมั่น ลดการโต้แย้ง</td>
                                </tr>
                                <tr>
                                    <td class="text-info font-weight-bold">เข้าหาผู้ใหญ่ / สัมภาษณ์งาน / ขอความช่วยเหลือ</td>
                                    <td><b class="text-warning">ยามพระจันทร์ (๒)</b> หรือ <b>ยามมนตรี</b></td>
                                    <td>พระจันทร์ส่งกระแสเมตตามหานิยม ผู้ใหญ่เห็นแล้วรู้สึกเอ็นดู อยากปกป้องอุปถัมภ์</td>
                                </tr>
                                <tr>
                                    <td class="text-info font-weight-bold">เริ่มงานใหญ่ / เปิดบริษัท / ออกรถ / ขึ้นบ้านใหม่</td>
                                    <td><b class="text-warning">ยามพระพฤหัสบดี (๕)</b> หรือ <b>ยามธงชัย</b></td>
                                    <td>พฤหัสบดีคือประธานศุภเคราะห์ มอบความเจริญรุ่งเรือง ไร้อุปสรรค ความสำเร็จยั่งยืน</td>
                                </tr>
                                <tr>
                                    <td class="text-info font-weight-bold">เดทแรก / ปรับความเข้าใจคนรัก / โพสต์ขายของสวยงาม</td>
                                    <td><b class="text-warning">ยามพระศุกร์ (๖)</b></td>
                                    <td>ศุกร์คือความรัก ความสดใสและรสนิยม เหมาะแก่การสร้างความประทับใจตั้งแต่แรกเห็น</td>
                                </tr>
                                <tr>
                                    <td class="text-info font-weight-bold">หลีกเลี่ยงการปะทะ / แก้ไขสถานการณ์คับขัน</td>
                                    <td><b class="text-warning">ยามปลอด</b></td>
                                    <td>หมายถึงความโปร่ง ปลอดโปร่ง ศัตรูมองไม่เห็นปัญหา เรื่องร้ายกลับกลายเป็นราบรื่น</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-danger"><i class="fas fa-exclamation-triangle mr-2"></i>๓. ยามที่ควร "ชะลอ" หรือต้องมีสติรอบคอบเป็นพิเศษ</h5>
                    <div class="p-3 bg-black-25 rounded border-left-danger">
                        <p class="small text-white-50 mb-1"><b>• ยามพระเสาร์ (๗) & ยามพระราหู (๘):</b> มักนำพาความตึงเครียด อารมณ์หงุดหงิดง่าย การตัดสินใจผิดพลาดจากความโลภ หากต้องขับรถหรือคุยเรื่องเงินช่วงนี้ ให้หายใจลึกๆ และตรวจเช็คเอกสารอย่างละเอียด</p>
                        <p class="small text-white-50 mb-0"><b>• ยามพระอังคาร (๓):</b> มักใจร้อน ปะทะคารม ควรหลีกเลี่ยงการทวงหนี้หรือการตัดพ้อเรื่องความรักในช่วงเวลานี้</p>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1 small font-weight-bold"><i class="fas fa-mobile-alt mr-2"></i>กดเปิดระบบคำนวณยามสดในแอป</h6>
                    <p class="small mb-0">ในแต่ละวัน พระอาทิตย์ขึ้นไม่พร้อมกัน ระบบของ <b>สยามโหรามงคล</b> ได้คำนวณตำแหน่งยามอัฏฐกาลแบบเรียลไทม์ไว้ให้แล้วในหน้า <b>"ยามอัฏฐกาล"</b> สามารถเปิดดูได้ทันทีก่อนก้าวเท้าออกจากบ้าน</p>
                </div>
            </div>
        `,
        link: "yarmPage",
        badge: "badge-info",
        references: [
            "สมเด็จพระมหาสมณเจ้า กรมพระปรมานุชิตชิโนรส. <em>ตำราพิชัยสงคราม (หมวดยามยาตราและยามอัฏฐกาล)</em>.",
            "พระยาโหราธิบดี. <em>คัมภีร์สุริยยาตร์และเกณฑ์ยามแปดประการ</em>.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>คู่มือโหราศาสตร์ภาคคำนวณฤกษ์ยามอัฏฐกาล</em>."
        ]
    },
    "kamalok": {
        id: "K003",
        category: "กาลโยค",
        title: "🌟 กาลโยคและสีมงคลประจำวัน (วิธีเช็ควันดี-วันร้ายแบบเซียน)",
        type: "วิถีสิริมงคล",
        level: "ทั่วไป (ใช้ได้ทุกวัน)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-calendar-alt mr-2"></i>๑. "กาลโยค" คืออะไร? (ถอดรหัสเข้าใจง่าย)</h5>
                    <p>เคยได้ยินคำว่า <b>"วันธงชัย"</b> หรือ <b>"วันโลกาวินาศ"</b> ไหม? ในรอบแต่ละปี (คำนวณเปลี่ยนใหม่ทุกวันที่ ๑๖ เมษายน หลังสงกรานต์) ตำแหน่งของวันทั้ง ๗ จะได้รับมอบหมายบทบาทพลังงานจักรวาลที่ไม่เหมือนกัน วิชา <b>"กาลโยค"</b> จึงเปรียบเสมือนปฏิทินตรวจสภาพอากาศทางดวงดาว เพื่อให้เรารู้ว่าวันไหนมีลมส่งเสริม และวันไหนมีพายุ</p>
                </section>

                <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                    <h6 class="text-gold-light mb-3"><i class="fas fa-star mr-2"></i>๔ ตำแหน่งสำคัญของกาลโยคที่คนไทยต้องรู้</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-dark rounded border-left-success h-100">
                                <b class="text-success"><i class="fas fa-flag mr-1"></i> วันธงชัย (วันแห่งชัยชนะและเริ่มต้น)</b>
                                <p class="small text-white-50 mt-1 mb-0">เหมาะที่สุดสำหรับการ: เปิดกิจการใหม่, ขึ้นบ้านใหม่, ทำบุญเปิดร้าน, จดทะเบียนสมรส, ออกรถใหม่ ทำสิ่งใดมักสำเร็จสมหวังและมีชื่อเสียง</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-dark rounded border-left-info h-100">
                                <b class="text-info"><i class="fas fa-crown mr-1"></i> วันอธิบดี (วันแห่งอำนาจและการปกครอง)</b>
                                <p class="small text-white-50 mt-1 mb-0">เหมาะที่สุดสำหรับการ: เข้ารับตำแหน่งใหม่, ส่งผลงานชิงรางวัล, นำเสนองานผู้ใหญ่, ยื่นประมูลงานราชการ, เจรจาเรื่องสำคัญ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-dark rounded border-left-warning h-100">
                                <b class="text-warning"><i class="fas fa-exclamation-triangle mr-1"></i> วันอุบาทว์ (วันสะดุด ติดขัด)</b>
                                <p class="small text-white-50 mt-1 mb-0">ข้อแนะนำ: ควรงดเริ่มโปรเจกต์ใหม่ที่สำคัญ หากจำเป็นต้องเดินทางหรือทำงาน ให้ทำด้วยความรอบคอบ ไม่ประมาท</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-dark rounded border-left-danger h-100">
                                <b class="text-danger"><i class="fas fa-skull-crossbones mr-1"></i> วันโลกาวินาศ (วันวุ่นวาย ความสูญเสีย)</b>
                                <p class="small text-white-50 mt-1 mb-0">ข้อแนะนำ: วันที่ควรหลีกเลี่ยงงานมงคลทุกชนิด ไม่ควรผ่าตัดใหญ่ (ยกเว้นเคสฉุกเฉิน) เหมาะกับการเก็บกวาด ซ่อมแซม และนั่งสมาธิ</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-tshirt mr-2"></i>๒. ตารางสีเสื้อมงคลกระตุ้นพลังบวกประจำวัน</h5>
                    <p>การแต่งกายด้วยสีที่เป็นมิตรกับดวงชะตา เป็นการปรับสมดุลคลื่นพลังงานรอบตัวที่ทำได้ง่ายและเห็นผลทางจิตวิทยามากที่สุด:</p>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>วัน</th>
                                    <th>สีเสริมอำนาจบารมี (เดช)</th>
                                    <th>สีเสริมการเงิน & เสน่ห์ (ศรี)</th>
                                    <th>สีกาลกิณี (ควรเลี่ยง)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>วันอาทิตย์</b></td>
                                    <td><span class="text-warning">ชมพู</span></td>
                                    <td><span class="text-success">เขียว</span></td>
                                    <td><span class="text-danger">น้ำเงิน / ฟ้า</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันจันทร์</b></td>
                                    <td><span class="text-success">เขียว</span></td>
                                    <td><span class="text-dark bg-light px-1 rounded">ม่วง / ดำ</span></td>
                                    <td><span class="text-danger">แดง</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันอังคาร</b></td>
                                    <td><span class="text-dark bg-light px-1 rounded">ม่วง / ดำ</span></td>
                                    <td><span class="text-warning">ส้ม / ทอง</span></td>
                                    <td><span class="text-danger">ขาว / ครีม</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันพุธ (กลางวัน)</b></td>
                                    <td><span class="text-warning">ส้ม / ทอง</span></td>
                                    <td><span class="text-info">น้ำเงิน / ฟ้า</span></td>
                                    <td><span class="text-danger">ชมพู</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันพฤหัสบดี</b></td>
                                    <td><span class="text-info">ฟ้า / น้ำเงิน</span></td>
                                    <td><span class="text-danger">แดง</span></td>
                                    <td><span class="text-danger">ม่วง / ดำ</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันศุกร์</b></td>
                                    <td><span class="text-light">ขาว / เหลือง</span></td>
                                    <td><span class="text-warning">ชมพู</span></td>
                                    <td><span class="text-danger">เทาเข้ม / ควันบุหรี่</span></td>
                                </tr>
                                <tr>
                                    <td><b>วันเสาร์</b></td>
                                    <td><span class="text-danger">เทา / ดำ</span></td>
                                    <td><span class="text-info">น้ำเงิน / ฟ้า</span></td>
                                    <td><span class="text-danger">เขียว</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>เกร็ดความรู้กาลโยค</h6>
                    <small>ตำแหน่งกาลโยคจะประกาศใน <b>"ประกาศสงกรานต์หลวง"</b> ประจำทุกปี โดยมีผลตั้งแต่เวลาเปลี่ยนเถลิงศกใหม่เป็นต้นไป ระบบของสยามโหรามงคลได้อัปเดตค่าปีปัจจุบันตรงตามประกาศสำนักพระราชวัง</small>
                </div>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-success",
        references: [
            "สำนักพระราชวัง. <em>ประกาศสงกรานต์และตารางกาลโยคประจำปีพุทธศักราช</em>.",
            "พระยาโหราธิบดี. <em>คัมภีร์กาลโยคและสุริยยาตร์โบราณ</em>.",
            "เสถียรโกเศศ. <em>ประเพณีสงกรานต์และพิธีเปลี่ยนศักราชของไทย</em>. สำนักพิมพ์ศิลปาบรรณาคาร."
        ]
    },
    "numbers": {
        id: "K004",
        category: "เลขศาสตร์",
        title: "🔢 พลังตัวเลขและเบอร์มงคลพื้นฐาน (เข้าใจง่าย ใช้ได้จริง)",
        type: "พยากรณ์ตัวเลข",
        level: "ทั่วไป (เหมาะสำหรับผู้เริ่มต้น)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-fingerprint mr-2"></i>๑. ทำไมตัวเลขถึงมีผลกับชีวิตเรา? (เข้าใจง่ายใน ๑ นาที)</h5>
                    <p>ลองจินตนาการว่า <b>ตัวเลขทุกตัวคือ "คลื่นวิทยุ" หรือพลังงานเฉพาะตัว</b> ที่เราเปิดรับอยู่ตลอดเวลา ไม่ว่าจะเป็นเบอร์โทรศัพท์ ทะเบียนรถ หรือเลขบัญชีธนาคาร เมื่อเราใช้เบอร์นั้นบ่อยๆ คลื่นพลังงานของตัวเลขก็จะดึงดูดเหตุการณ์ ผู้คน และโอกาสที่ตรงกับคลื่นนั้นเข้ามาในชีวิต</p>
                    <div class="p-3 bg-black-25 rounded border-left-gold mb-3">
                        <b class="text-gold-light"><i class="fas fa-check-circle mr-1"></i> กฎเหล็กจำง่ายในการดูเบอร์โทรศัพท์:</b>
                        <ul class="mb-0 mt-2 small text-white-50">
                            <li>เราเน้นดูที่ <b>เลข ๗-๘ ตัวท้าย</b> ของเบอร์โทรศัพท์เป็นหลัก (เช่น 08X-<b>ABCD-EFG</b>) เพราะเป็นตำแหน่งที่ส่งคลื่นพลังงานตรงถึงตัวผู้ใช้มากที่สุด</li>
                            <li>ดูเป็น <b>"คู่เลข"</b> ติดกัน เช่น เบอร์ลงท้ายด้วย 4542 จะแยกอ่านเป็นคู่ <b>45</b> (สติปัญญา) + <b>54</b> (โชคลาภผู้ใหญ่) + <b>42</b> (เมตตาเสน่ห์)</li>
                        </ul>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-gem mr-2"></i>๒. รวมชุดคู่เลขมงคลยอดฮิต เลือกใช้ให้ตรงเป้าหมาย</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100">
                                <b class="text-info"><i class="fas fa-coins mr-1"></i> คู่เลขการเงิน & ค้าขายคล่องตัว</b>
                                <p class="small text-white-50 mt-1 mb-1"><b>24, 42, 26, 62:</b> วาจาเรียกทรัพย์ ปากหวาน ลูกค้าเมตตา เหมาะกับงานขาย ออนไลน์ งานบริการ</p>
                                <p class="small text-white-50 mb-0"><b>36, 63, 78, 87:</b> เงินเข้าหมุนเวียนคล่องตัว หยิบจับโปรเจกต์ใหญ่ ค้าขายกล้าได้กล้าเสีย</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-gold"><i class="fas fa-brain mr-1"></i> คู่เลขสติปัญญา ผู้ใหญ่อุปถัมภ์</b>
                                <p class="small text-white-50 mt-1 mb-1"><b>15, 51, 45, 54:</b> สติปัญญาเลิศ ใจเย็น วางแผนรอบคอบ ผู้ใหญ่เจ้านายให้ความเอ็นดู</p>
                                <p class="small text-white-50 mb-0"><b>56, 65, 59, 95:</b> มีโชคสองชั้น ทั้งความสุขุม ปัญญา และสิ่งศักดิ์สิทธิ์คุ้มครอง</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-success h-100">
                                <b class="text-success"><i class="fas fa-heart mr-1"></i> คู่เลขเสน่ห์ เมตตามหานิยม ความรัก</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>22, 23, 32, 24, 42:</b> ใครเห็นก็เอ็นดู อารมณ์นุ่มนวล เข้ากับคนง่าย มีเสน่ห์ต่อเพศตรงข้าม</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-warning h-100">
                                <b class="text-warning"><i class="fas fa-shield-alt mr-1"></i> คู่เลขผู้นำ อำนาจ บารมี คุมบริวาร</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>14, 41, 15, 51, 19, 91:</b> วิสัยทัศน์กว้างไกล เจรจามีน้ำหนัก บริวารเกรงใจ เหมาะกับเจ้าของธุรกิจและผู้นำ</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-exclamation-triangle mr-2"></i>๓. คู่เลขที่ควรระวังในเบอร์ประจำวัน</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50">
                            <thead><tr class="text-gold"><th>คู่เลข</th><th>อิทธิพลที่มักส่งผล</th><th>ข้อแนะนำในการปรับใช้</th></tr></thead>
                            <tbody>
                                <tr><td><b>00, 03, 30</b></td><td>อารมณ์ขึ้นลงง่าย ปัญหาผ่าตัด โรคกระดูกและอุบัติเหตุ</td><td>ควรหลีกเลี่ยงในเบอร์หลักที่ใช้คุยงาน</td></tr>
                                <tr><td><b>13, 31, 76, 67</b></td><td>เหน็ดเหนื่อย ทะเลาะเบาะแว้ง ความรักสะดุด มีศัตรูง่าย</td><td>เหมาะกับสายทหาร ตำรวจ ลุยงานหนัก</td></tr>
                                <tr><td><b>27, 72, 37, 73</b></td><td>หนี้สินพัวพัน เครียดสะสม แบกรับภาระแทนคนอื่น</td><td>ควรเปลี่ยนหรือปรึกษาผู้เชี่ยวชาญเลขศาสตร์</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>หัวใจสำคัญของเลขศาสตร์</h6>
                    <small>"เบอร์โทรศัพท์คือลมใต้ปีกที่ช่วยผลักดันให้บินได้สูงขึ้น แต่ทิศทางและความพยายามยังคงอยู่ที่ตัวเรา 100%" เลือกเบอร์ที่ส่งเสริมอาชีพเพื่อเปิดรับโอกาสที่ดีที่สุด</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-primary",
        references: [
            "อาจารย์นิติกฤตย์ กิตติศรีวรนันท์. <em>ถอดรหัสพลังตัวเลขพลิกชีวิต</em>. สำนักพิมพ์อมรินทร์ธรรมะ.",
            "หลวงวิศาลดรุณกร (อั้น สาริกบุตร). <em>คัมภีร์เลขศาสตร์ไทย-ภารตะโบราณ</em>.",
            "สถาบันเลขศาสตร์ประยุกต์แห่งประเทศไทย. <em>สถิติคู่เลขและคลื่นพลังงานโทรศัพท์มือถือ</em>."
        ]
    },
    "zodiac": {
        id: "K005",
        category: "ตำราโบราณ",
        title: "🐲 ๑๒ นักษัตรฉบับสมบูรณ์ : ธาตุเกิด นิสัย และคู่สมพงษ์",
        type: "วิเคราะห์ตัวตน",
        level: "ทั่วไป (อ่านเข้าใจทันที)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-paw mr-2"></i>๑. ทำไมคนโบราณต้องจำแนกเป็น ๑๒ นักษัตร?</h5>
                    <p>บรรพบุรุษไทยสังเกตรอบวงโคจรของ <b>ดาวพฤหัสบดี (Jupiter)</b> ซึ่งใช้เวลาประมาณ ๑๒ ปีในการโคจรรอบดวงอาทิตย์ครบ ๑ รอบ จึงแบ่งช่วงพลังงานแห่งปีออกเป็น ๑๒ นักษัตร โดยแต่ละปีมีสัตว์สัญลักษณ์และ "ธาตุประจำตัว" คอยกำหนดนิสัยพื้นฐาน พรสวรรค์ และจุดอ่อน</p>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-list-alt mr-2"></i>๒. เจาะลึกอุปนิสัยและธาตุของครบทั้ง ๑๒ ปีเกิด</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-info rounded h-100">
                                <b class="text-info">๑. ปีชวด (หนู) - ธาตุน้ำ</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> ฉลาดเป็นกรด ปรับตัวเก่ง เอาตัวรอดได้ทุกสถานการณ์ เสน่ห์แพรวพราว มีหัวการค้า<br><b>จุดควรระวัง:</b> ขี้ระแวง คิดวนเวียน กังวลล่วงหน้ามากเกินไป</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-gold rounded h-100">
                                <b class="text-gold">๒. ปีฉลู (วัว) - ธาตุดิน</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> อดทนเป็นเลิศ ซื่อสัตย์ หนักแน่น ไม่ทอดทิ้งใคร ทำงานละเอียดสม่ำเสมอ<br><b>จุดควรระวัง:</b> ดื้อเงียบ หากโกรธจะยอมหักไม่ยอมงอ ไม่ชอบการเปลี่ยนแปลงกะทันหัน</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-success rounded h-100">
                                <b class="text-success">๓. ปีขาล (เสือ) - ธาตุไม้</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> ผู้นำโดยกำเนิด กล้าหาญ มั่นใจ ใจกว้าง ชอบช่วยเหลือคนอ่อนแอกว่า<br><b>จุดควรระวัง:</b> อารมณ์ร้อน ปากไว ตรงเกินไปจนคนอื่นเสียใจ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-success rounded h-100">
                                <b class="text-success">๔. ปีเถาะ (กระต่าย) - ธาตุไม้</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> สุภาพ อ่อนโยน มีมารยาท รักสงบ เข้าสังคมเก่ง รสนิยมดี<br><b>จุดควรระวัง:</b> ลังเล ไม่ค่อยกล้าเสี่ยง กลัวความขัดแย้งจนบางครั้งหนีปัญหา</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-gold rounded h-100">
                                <b class="text-gold">๕. ปีมะโรง (งูใหญ่/มังกร) - ธาตุดิน</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> บุคลิกสง่า มีบารมี ใจใหญ่ ทะเยอทะยานสูง มีความคิดสร้างสรรค์ล้ำหน้า<br><b>จุดควรระวัง:</b> มั่นใจในตัวเองสูงจนไม่ฟังคำเตือน หยิ่งในศักดิ์ศรี</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-danger rounded h-100">
                                <b class="text-danger">๖. ปีมะเส็ง (งูเล็ก) - ธาตุไฟ</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> มีเสน่ห์ลึกลับ ช่างสังเกต ปัญญาเฉียบแหลม มุ่งมั่น วางแผนลึกซึ้ง<br><b>จุดควรระวัง:</b> ขี้หึง อาฆาตแรง เก็บความรู้สึกเก่งจนคนรอบข้างเดาใจไม่ถูก</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-danger rounded h-100">
                                <b class="text-danger">๗. ปีมะเมีย (ม้า) - ธาตุไฟ</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> กระตือรือร้น รักอิสระ คล่องแคล่ว มีพลังงานสูง มนุษยสัมพันธ์ยอดเยี่ยม<br><b>จุดควรระวัง:</b> ขี้เบื่อ ไม่อดทนกับงานซ้ำซาก ทำอะไรตามอารมณ์ชั่ววูบ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-gold rounded h-100">
                                <b class="text-gold">๘. ปีมะแม (แพะ) - ธาตุดิน</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> จิตใจดี ขี้สงสาร มีศิลปะ รักธรรมชาติ เข้าอกเข้าใจผู้อื่นสูง<br><b>จุดควรระวัง:</b> ขี้น้อยใจ ขี้กังวล อารมณ์อ่อนไหว ขาดความมั่นใจในตนเอง</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-warning rounded h-100">
                                <b class="text-warning">๙. ปีวอก (ลิง) - ธาตุทอง</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> ปัญญาไว หัวไว มีอารมณ์ขัน แก้ปัญหาเฉพาะหน้าเก่ง คล่องตัวสูง<br><b>จุดควรระวัง:</b> อยู่นิ่งไม่เป็น เจ้าเล่ห์ในบางครั้ง ไม่ค่อยรักษากฎเกณฑ์</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-warning rounded h-100">
                                <b class="text-warning">๑๐. ปีระกา (ไก่) - ธาตุทอง</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> เจ้าระเบียบ ตรงต่อเวลา ช่างสังเกต ขยันขันแข็ง พูดจาฉะฉานมีเหตุผล<br><b>จุดควรระวัง:</b> ช่างติ จู้จี้จุกจิก ยึดติดความสมบูรณ์แบบมากเกินไป</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-gold rounded h-100">
                                <b class="text-gold">๑๑. ปีจอ (หมา) - ธาตุดิน</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> ภักดี ซื่อสัตย์ รักความยุติธรรม ปกป้องคนที่รักสุดชีวิต ไว้ใจได้ 100%<br><b>จุดควรระวัง:</b> มองโลกในแง่ร้ายในบางครั้ง ปากร้ายใจดี ขี้บ่น</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-info rounded h-100">
                                <b class="text-info">๑๒. ปีกุน (หมู) - ธาตุน้ำ</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>จุดเด่น:</b> อบอุ่น ใจดี มีน้ำใจ มองโลกในแง่ดี กินง่ายอยู่ง่าย มีวาสนาโภคทรัพย์<br><b>จุดควรระวัง:</b> หูเบา ใจอ่อน มักถูกคนอื่นเอาเปรียบ ขาดความรอบคอบ</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-handshake mr-2"></i>๓. กลุ่มตรีโกณสมพงษ์ (ฮะ / ส่งเสริมกัน)</h5>
                    <p>คนโบราณจับกลุ่ม ๓ นักษัตรที่เป็นมิตรแท้ ร่วมงานกันรุ่งเรือง หรือแต่งงานกันราบรื่น เรียกว่า <b>"ซาฮะ" (三合)</b>:</p>
                    <ul>
                        <li><b>กลุ่มธาตุน้ำ (ปัญญา & ความคล่องตัว):</b> ชวด (หนู) + มะโรง (งูใหญ่) + วอก (ลิง)</li>
                        <li><b>กลุ่มธาตุไม้ (คุณธรรม & เติบโต):</b> กุน (หมู) + เถาะ (กระต่าย) + มะแม (แพะ)</li>
                        <li><b>กลุ่มธาตุไฟ (บารมี & ชื่อเสียง):</b> ขาล (เสือ) + มะเมีย (ม้า) + จอ (หมา)</li>
                        <li><b>กลุ่มธาตุทอง (ความมั่งคั่ง & เด็ดขาด):</b> ฉลู (วัว) + มะเส็ง (งูเล็ก) + ระกา (ไก่)</li>
                    </ul>
                </section>
            </div>
        `,
        link: "mainContent",
        badge: "badge-warning",
        references: [
            "พระยาโหราธิบดี. <em>ตำราพรหมชาติฉบับหลวง รวบรวม ๑๒ นักษัตรและธาตุทั้งสี่</em>.",
            "เสถียรโกเศศ (พระยาอนุมานราชธน). <em>ประเพณีเนื่องในการเกิดและปีนักษัตรไทย</em>. ราชบัณฑิตยสภา.",
            "คัมภีร์โหราศาสตร์พุทธศตวรรษที่ ๒๕. สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์."
        ]
    },
    "taksa_basic": {
        id: "K006",
        category: "ทักษาพยากรณ์",
        title: "☸️ พื้นฐานวิชาทักษาปกรณ์ : บริวาร อายุ เดช ศรี มนตรี กาลกิณี (เข้าใจทันที)",
        type: "วิเคราะห์พื้นดวง",
        level: "ทั่วไป (เหมาะสำหรับผู้เริ่มต้น)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-dharmachakra mr-2"></i>๑. ทักษาปกรณ์คืออะไร? (คนไม่มีพื้นฐานก็จำได้แม่น)</h5>
                    <p>คำว่า <b>"ทักษา"</b> ฟังดูเหมือนศัพท์โหราศาสตร์ชั้นสูงที่เข้าใจยาก แต่ความจริงแล้ว ทักษาคือ <b>"แถบสถานะชีวิต ๘ ช่อง"</b> ประจำตัวเรา คล้ายๆ กับ Status ในเกมที่มีทั้ง ค่าพลังโจมตี ค่าป้องกัน ค่าโชคลาภ และจุดอ่อน โดยคำนวณตั้งต้นจาก <b>วันเกิด (อาทิตย์ - เสาร์ และพุธกลางคืน)</b></p>
                    <p>เมื่อเราทราบว่าวันเกิดเรามีตำแหน่งดาวอะไรอยู่ที่ช่องไหน เราจะรู้ทันทีว่า <i>ควรใช้สีอะไรตั้งชื่อ, สีรถคันไหนขับแล้วรวย, และอักษรตัวไหนคือตัวต้องห้าม (กาลกิณี)</i> ที่ไม่ควรนำมาใช้</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-th-large mr-2"></i>๒. เจาะลึกความหมาย ๘ ภูมิชีวิต (เปรียบเทียบชีวิตจริง)</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100">
                                <b class="text-info">๑. บริวาร (คนรอบข้าง & ทีมงาน):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง ลูกน้อง ลูกหลาน แฟน เพื่อนฝูง และผู้ร่วมงาน หากภูมิบริวารดี จะได้ทีมงานซื่อสัตย์ ไม่ถูกหักหลัง มีคนคอยหนุนหลังเสมอ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100">
                                <b class="text-info">๒. อายุ (สุขภาพ & พลังชีวิต):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง ความแข็งแรงของร่างกาย ความกระปรี้กระเปร่า และวิถีการใช้ชีวิต หากภูมินี้เด่น โรคภัยจะเบาบาง ฟื้นตัวเร็ว จิตใจเบิกบาน</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-gold">๓. เดช (อำนาจ & ความน่าเกรงขาม):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง บารมี ความเป็นผู้นำ คำพูดมีน้ำหนัก คนเกรงใจ เหมาะสำหรับผู้บริหาร ข้าราชการ หรือคนที่ต้องคุมคนจำนวนมาก</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-success h-100">
                                <b class="text-success">๔. ศรี (โชคลาภ เงินทอง เสน่ห์เมตตา):</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>ตำแหน่งยอดฮิตอันดับ ๑</b> หมายถึง ความมั่งคั่ง ทรัพย์สิน ความสุขใจ เสน่ห์ดึงดูดใจ นิยมใช้เลือกสีเสื้อ สีรถ และตั้งชื่อลูก</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100">
                                <b class="text-info">๕. มูละ (ความมั่นคง ทรัพย์สินมรดก):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง รากฐานชีวิต บ้าน ที่ดิน อสังหาริมทรัพย์ เงินเก็บระยะยาว และธุรกิจกงสีที่ส่งต่อให้ลูกหลาน</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100">
                                <b class="text-info">๖. อุตสาหะ (ความขยัน & ความเพียร):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง สมาธิในการทำงาน ความมุ่งมั่น ไม่ย่อท้อต่ออุปสรรค ความสำเร็จที่ต้องลงมือทำด้วยตนเอง</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-gold">๗. มนตรี (ผู้ใหญ่อุปถัมภ์ & ที่ปรึกษา):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง เจ้านายรักใคร่ มีคนคอยชี้แนะทางรวย ผู้ใหญ่คอยช่วยเหลือยามคับขัน ได้รับโอกาสพิเศษเสมอ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-danger h-100">
                                <b class="text-danger">๘. กาลกิณี (อุปสรรค & ข้อพึงระวัง):</b>
                                <p class="small text-white-50 mt-1 mb-0">หมายถึง ความติดขัด ศัตรูคอยขัดขวาง ความสูญเสีย เป็นสิ่งเดียวในทักษาที่โบราณให้ <b>"หลีกเลี่ยงเด็ดขาด"</b> ในการตั้งชื่อหรือเลือกสีมงคลหลัก</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-check-circle mr-2"></i>๓. สรุปวิธีนำไปใช้จริงใน ๓ สเต็ปง่ายๆ</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>สิ่งที่คุณต้องการ</th>
                                    <th>เลือกใช้ภูมิใด</th>
                                    <th>ตัวอย่างการใช้งาน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>อยากมีโชคลาภ เงินคล่อง เมตตามหานิยม</b></td>
                                    <td><b class="text-success">ศรี</b></td>
                                    <td>ใช้สีประจำภูมิ "ศรี" เป็นสีเคสโทรศัพท์ สีเสื้อ หรือขึ้นต้นชื่อด้วยหมวดอักษรศรี</td>
                                </tr>
                                <tr>
                                    <td><b>ไปสัมภาษณ์งาน / เจรจาขอความช่วยเหลือ</b></td>
                                    <td><b class="text-warning">มนตรี</b> หรือ <b>เดช</b></td>
                                    <td>ใส่เสื้อผ้าสีที่เป็นเดชเพื่อความน่าเชื่อถือ และใช้สีมนตรีเพื่อเปิดใจผู้ใหญ่</td>
                                </tr>
                                <tr>
                                    <td><b>ซื้อบ้าน ซื้อที่ดิน ลงทุนระยะยาว</b></td>
                                    <td><b class="text-info">มูละ</b></td>
                                    <td>ทำสัญญาในวัน/ยามที่เป็นมูละ เพื่อให้ทรัพย์สินงอกเงยและมั่นคง</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-sync-alt mr-2"></i>ทักษากำเนิด VS ทักษาจร ต่างกันอย่างไร?</h6>
                    <small><b>ทักษากำเนิด:</b> คือติดตัวมาตั้งแต่วันเกิด ไม่เปลี่ยนแปลง ใช้สำหรับตั้งชื่อและดูลักษณะพื้นฐาน<br>
                    <b>ทักษาจร:</b> คือเมื่ออายุเราเปลี่ยนไปแต่ละปี ภูมิต่างๆ จะหมุนเวียนไปตามรอบอายุ ทำให้บางปีสีบางสีอาจดีเป็นพิเศษ หรือกลายเป็นกาลกิณีชั่วคราว เช็คได้ในหน้า <b>"ทักษาพยากรณ์"</b> ของระบบ</small>
                </div>
            </div>
        `,
        link: "taksaPage",
        badge: "badge-info",
        references: [
            "พระยาโหราธิบดี. <em>คัมภีร์ทักษาปกรณ์และมหาทักษาเฉลิมพระเกียรติ</em>.",
            "หลวงวิศาลดรุณกร (อั้น สาริกบุตร). <em>คัมภีร์โหราศาสตร์ไทยฉบับสมบูรณ์ (หมวดทักษาและอักขระมงคล)</em>.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>แบบเรียนทักษาปกรณ์มาตรฐานภาคพยากรณ์</em>."
        ]
    },
    "planet_nature": {
        id: "K007",
        category: "โหราศาสตร์",
        title: "🪐 ธรรมชาติและกำลังของดวงดาว",
        type: "พื้นฐานโหราศาสตร์",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-meteor mr-2"></i>๑. "กำลังดาว" คืออะไร? (คนไม่มีพื้นฐานก็เข้าใจได้)</h5>
                    <p>ในวิชาโหราศาสตร์ไทย ดาวแต่ละดวงไม่ได้มีแค่ชื่อ แต่มี <b>"กำลังตัวเลขประจำตัว" (Planetary Power)</b> ซึ่งเปรียบเหมือนแรงม้าหรือขนาดเครื่องยนต์ของดาวดวงนั้น ตัวเลขเหล่านี้มาจากจำนวนเทวดาหรือธาตุตามคัมภีร์พระเวทที่พระอิศวรทรงร่ายเวทสร้างขึ้นมา</p>
                    <p><b>ประโยชน์ในชีวิตจริง:</b> เลขกำลังดาวนำมาใช้ในหลายเรื่อง เช่น <i>จำนวนจบในการสวดมนต์บูชาดวงชะตา, การเลือกตัวเลขเสริมมงคล, การทำบุญตามกำลังวันเกิด</i> เช่น คนเกิดวันจันทร์มีกำลังดาว ๑๕ นิยมสวดมนต์ ๑๕ จบ หรือถวายสังฆทาน ๑๕ ชิ้น</p>
                </section>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50 border-gold">
                        <thead>
                            <tr class="text-gold">
                                <th>สัญลักษณ์</th>
                                <th>ดาวเคราะห์</th>
                                <th>กำลังดาว</th>
                                <th>ธาตุประจำดาว</th>
                                <th>บุคลิกดาว (จำง่าย)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>๑</td><td>พระอาทิตย์</td><td><b>๖</b></td><td>ไฟกรด</td><td>ผู้นำ สง่าผ่าเผย มีเกียรติ มั่นใจ ใจร้อน</td></tr>
                            <tr><td>๒</td><td>พระจันทร์</td><td><b>๑๕</b></td><td>น้ำฝน</td><td>อ่อนหวาน นุ่มนวล เมตตา เสน่ห์ อารมณ์ไหว</td></tr>
                            <tr><td>๓</td><td>พระอังคาร</td><td><b>๘</b></td><td>ลมกรด</td><td>นักสู้ กล้าหาญ ขยัน ลุยงาน ตรงไปตรงมา</td></tr>
                            <tr><td>๔</td><td>พระพุธ</td><td><b>๑๗</b></td><td>น้ำนิ่ง</td><td>นักพูด ค้าขาย ปัญญาไว ปรับตัวเก่ง ข้อมูลแน่น</td></tr>
                            <tr><td>๕</td><td>พระพฤหัสบดี</td><td><b>๑๙</b></td><td>ดินบริสุทธิ์</td><td>ครูบาอาจารย์ ปัญญาบริสุทธิ์ คุณธรรม โชคลาภใหญ่</td></tr>
                            <tr><td>๖</td><td>พระศุกร์</td><td><b>๒๑</b></td><td>ลมพัด</td><td>ความรัก ศิลปะ ความสวยงาม การเงิน อารมณ์รื่นรมย์</td></tr>
                            <tr><td>๗</td><td>พระเสาร์</td><td><b>๑๐</b></td><td>ไฟสุมขอน</td><td>ความอดทน หนักแน่น คิดลึกซึ้ง กิจการระยะยาว</td></tr>
                            <tr><td>๘</td><td>พระราหู</td><td><b>๑๒</b></td><td>ลมพายุ</td><td>พลิกแพลง กล้าได้กล้าเสีย ว่องไว ไม่กลัวใคร</td></tr>
                            <tr><td>๙</td><td>พระเกตุ</td><td><b>๙</b></td><td>อากาศธาตุ</td><td>สิ่งศักดิ์สิทธิ์ ลางสังหรณ์ แคล้วคลาด เทพคุ้มครอง</td></tr>
                            <tr><td>๐</td><td>พระมฤตยู</td><td><b>๐</b></td><td>สุญญากาศ</td><td>การเปลี่ยนแปลง พลิกฟ้าคว่ำดิน นวัตกรรม วิทยาการ</td></tr>
                        </tbody>
                    </table>
                </div>
                <section class="mt-4">
                    <h5 class="text-gold"><i class="fas fa-handshake mr-2"></i>๒. ดาวคู่มิตร & ดาวคู่ศัตรู (สูตรจำแม่นโบราณ)</h5>
                    <p>เหมือนคนเราที่มีเพื่อนสนิทที่อยู่ด้วยแล้วสบายใจ และคนที่ไม่ค่อยถูกชะตา ดาวก็มีคู่มิตรและคู่ศัตรูเช่นกัน:</p>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-success rounded h-100">
                                <b class="text-success"><i class="fas fa-heart mr-1"></i> ดาวคู่มิตรใหญ่ (เจอกันแล้วดี ส่งเสริมกัน):</b>
                                <ul class="small text-white-50 mt-2 mb-0">
                                    <li><b>อาทิตย์ร่วมพฤหัส (๑-๕):</b> มิตรใหญ่ ส่งเสริมปัญญา ผู้ใหญ่เมตตา ลาภยศสูง</li>
                                    <li><b>จันทร์คู่พุธ (๒-๔):</b> วาจาไพเราะ ค้าขายดี คนรักใคร่เอ็นดู</li>
                                    <li><b>อังคารร่วมศุกร์ (๓-๖):</b> มิตรรื่นรมย์ เสน่ห์ร้อนแรง มีไฟในการทำงาน</li>
                                    <li><b>เสาร์คู่ราหู (๗-๘):</b> มิตรนักเลง พลังใจเข้มแข็ง ลุยโปรเจกต์ยากสำเร็จ</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 border-left-danger rounded h-100">
                                <b class="text-danger"><i class="fas fa-bolt mr-1"></i> ดาวคู่ศัตรู (เจอกันแล้วขัดแย้ง ต้องมีสติ):</b>
                                <ul class="small text-white-50 mt-2 mb-0">
                                    <li><b>อาทิตย์ผิดอังคาร (๑-๓):</b> ใจร้อนปะทะกัน เกิดอุบัติเหตุหรือปากเสียง</li>
                                    <li><b>พุธขัดราหู (๔-๘):</b> เอกสารผิดพลาด ถูกหลอกลวง คำพูดสร้างศัตรู</li>
                                    <li><b>ศุกร์ผิดเสาร์ (๖-๗):</b> ความรักเหน็ดเหนื่อย ทุกข์ใจเรื่องเงิน เสียสละฝ่ายเดียว</li>
                                    <li><b>จันทร์แคลงพฤหัส (๒-๕):</b> ความคิดเห็นต่างระหว่างวัย ผู้ใหญ่ขัดใจ</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-3">
                    <small><i class="fas fa-info-circle mr-2"></i><b>วิธีนำไปใช้:</b> เมื่อทราบว่าเราเกิดวันใด ให้เน้นสร้างมิตรภาพและผูกพันกับดาวที่เป็นคู่มิตรของวันเกิดตนเอง เช่น เกิดวันจันทร์ (๒) การเจรจาหรือทำธุรกิจที่ใช้ดาวพุธ (๔ - สื่อสาร) จะส่งผลสำเร็จได้ง่ายที่สุด</small>
                </div>
            </div>
        `,
        link: "planetRelationPage",
        badge: "badge-warning",
        references: [
            "พระยาโหราธิบดี. <em>คัมภีร์จักรทีปนี (หมวดกำลังพระเคราะห์และมิตร-ศัตรู)</em>.",
            "หลวงประเสริฐอักษรนิติ์. (๒๔๗๒). <em>คู่มือโหราศาสตร์ไทยเบื้องต้น</em>. โรงพิมพ์โสภณพิพรรฒธนากร.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>ตำราดวงดาวและกำลังพระเคราะห์มาตรฐาน</em>."
        ]
    },
    "seven_digits": {
        id: "K008",
        category: "ตำราโบราณ",
        title: "🔢 พื้นฐานวิชาเลข 7 ตัว 4 ฐาน",
        type: "วิเคราะห์ชะตาชีวิต",
        level: "ขั้นสูง",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-th mr-2"></i>คัมภีร์เลข 7 ตัว 4 ฐาน: ศาสตร์แห่งการพยากรณ์ไทย</h5>
                    <p>วิชาเลข 7 ตัว 4 ฐาน คือการนำตัวเลข วัน เดือน และปีนักษัตร มาตั้งเป็นตาราง 3 แถว และรวมกำลังธาตุเป็นฐานที่ 4 เพื่อวิเคราะห์เส้นทางชีวิตตั้งแต่วันเกิดจนถึงวันตาย โดยแบ่งโครงสร้างสำคัญดังนี้:</p>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● โครงสร้าง 3 แถวหลัก (วิถีชีวิต)</h6>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">แถวที่ 1: แถววัน (อัตตา)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงตัวตน นิสัยใจคอ สุขภาพ และเรื่องส่วนตัว เป็นพื้นฐานของจิตใจและความนึกคิดของเจ้าชะตา</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">แถวที่ 2: แถวเดือน (หิรัญ)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงทรัพย์สิน การทำมาหากิน โชคลาภ และความมั่นคงทางการเงิน รวมถึงช่องทางการได้มาซึ่งรายได้</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">แถวที่ 3: แถวปี (สิทธิ)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงความสำเร็จ มิตรบริวาร สังคมรอบข้าง และผลลัพธ์สุดท้ายของความพยายามในแต่ละเรื่อง</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4 p-3 rounded" style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2);">
                    <h6 class="text-gold"><i class="fas fa-star mr-2"></i>ฐานที่ 4: ฐานพยากรณ์ (หัวใจสำคัญ)</h6>
                    <p class="small">ฐานที่ 4 เกิดจากผลรวมของเลขใน 3 แถวบนรวมกัน เป็นฐานที่ใช้ตัดสินว่าเรื่องนั้นๆ จะส่งผล "ดี" หรือ "ร้าย" มากน้อยเพียงใด เช่น:</p>
                    <ul class="small text-white-50">
                        <li><b class="text-info">ฐานกำลังพระเคราะห์ (เช่น ๙, ๑๐, ๑๒...):</b> บ่งบอกถึงความเข้มแข็งของดวงดาวที่จะส่งผลต่อชีวิต</li>
                        <li><b class="text-gold">ฐานจักรพรรดิ / มหาอุจ:</b> บ่งบอกถึงความยิ่งใหญ่ ความสำเร็จแบบก้าวกระโดด</li>
                        <li><b class="text-danger">ฐานโสฬสมงคล:</b> เป็นฐานมงคลยิ่งใหญ่ที่คอยเกื้อหนุนแม้ในช่วงที่ดวงตก</li>
                    </ul>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● ความหมายของภพสำคัญในตาราง</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>ชื่อภพ</th>
                                    <th>ความหมายในการทำนาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>อัตตา</td><td>ตัวเอง นิสัย ความคิด</td></tr>
                                <tr><td>มรณะ</td><td>การพลัดพราก การสิ้นสุด หรือทางไกล</td></tr>
                                <tr><td>โภคา</td><td>ที่อยู่อาศัย รถ อสังหาริมทรัพย์</td></tr>
                                <tr><td>ปัตนิ</td><td>คู่ครอง หุ้นส่วน หรือฝ่ายตรงข้าม</td></tr>
                                <tr><td>กัมมะ</td><td>งาน หน้าที่ ความรับผิดชอบ</td></tr>
                                <tr><td>ลาภะ</td><td>โชคลาภ สิ่งที่ได้มาโดยไม่คาดฝัน</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="p-3 bg-dark border-gold rounded text-center shadow">
                    <h6 class="text-gold mb-2">"เลข 7 ตัว บอกกรรมเก่า... แต่ฐานที่ 4 บอกทางแก้"</h6>
                    <p class="small mb-0 text-white-50">การอ่านเลข 7 ตัวที่แม่นยำ ต้องดูความสัมพันธ์ของภพ (เรื่องราว) และดาว (ตัวเลข) ควบคู่ไปกับฐานรองรับเสมอ</p>
                </div>
            </div>
        `,
        link: "sevenDigitsPage",
        badge: "badge-danger"
    },
    "compatibility_guide": {
        id: "K009",
        category: "ตำราโบราณ",
        title: "❤️ ตำราสมพงษ์คู่ครองและคู่แท้ : อยู่ด้วยกันอย่างไรให้ส่งเสริม ร่ำรวย และมั่นคง",
        type: "วิเคราะห์ความสัมพันธ์",
        level: "ทั่วไป (เข้าใจง่ายทันที)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-heart mr-2"></i>๑. "ดวงสมพงษ์" คืออะไร? จำเป็นต้องเลิกไหมถ้าดวงไม่เข้ากัน?</h5>
                    <p><b>ความจริงที่หลายคนเข้าใจผิด:</b> การดูสมพงษ์ในวิชาโบราณ <b>ไม่ใช่การบอกว่า "ห้ามรักกัน" หรือ "ต้องเลิกกัน"</b> แต่คือ <i>"คู่มือทำความเข้าใจธรรมชาติของคนสองคน"</i> เปรียบเหมือนเรารู้ว่าแฟนเราเป็นต้นกระบองเพชร (ชอบแดด ไม่ชอบน้ำมาก) ส่วนเราเป็นบัวหลวง (ชอบน้ำชุ่มฉ่ำ) เมื่อเข้าใจความต่างของธาตุ เราจะได้ไม่รดน้ำต้นกระบองเพชรจนรากเน่าตาย</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-hand-holding-heart mr-2"></i>๒. ๓ เกณฑ์โบราณเช็คความเข้ากันแบบง่ายที่สุด</h5>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๑. สมพงษ์ธาตุเกิด (เคมีตรงกัน):</b>
                                <p class="small text-white-50 mt-2 mb-0"><b>น้ำ + ไม้:</b> ส่งเสริมกันดีเยี่ยม น้ำหล่อเลี้ยงไม้ให้เติบโต<br><b>ไฟ + ลม:</b> พากันเจริญรุ่งเรือง กระตือรือร้น แต่ต้องระวังอารมณ์ร้อน<br><b>ไฟ + น้ำ:</b> ความเห็นต่างกันบ่อย ต้องใช้ความใจเย็นประคับประคอง</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๒. สมพงษ์วันเกิด (คู่มิตรคู่คิด):</b>
                                <p class="small text-white-50 mt-2 mb-0"><b>คู่มิตรใหญ่:</b> อาทิตย์-พฤหัส, จันทร์-พุธ เกื้อหนุนเรื่องเงินทองและตำแหน่งหน้าที่<br><b>คู่ธาตุ:</b> อาทิตย์-เสาร์, จันทร์-พฤหัส ช่วยกันสร้างเนื้อสร้างตัว เก็บเงินเก่ง รวยเร็ว</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๓. ตำรานาคสมพงษ์ (หัว-ตัว-หาง):</b>
                                <p class="small text-white-50 mt-2 mb-0">โบราณจัดวางปีเกิดเทียบกับตัวพญานาค หากคนหนึ่งอยู่หัวนาค อีกคนอยู่หางนาค จะปรับตัวเข้าหากันง่าย แต่ถ้าอยู่หัวนาคทั้งคู่ ต้องผลัดกันเป็นผู้นำ อย่าเอาชนะคะคานกัน</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-magic mr-2"></i>๓. เคล็ดลับแก้เคล็ดสำหรับคู่ที่ธาตุขัดแย้งกัน</h5>
                    <div class="p-3 bg-dark border-gold rounded">
                        <ul class="small text-white-50 mb-0">
                            <li><b>จัดเตียงนอนและห้องนอนใหม่:</b> ใช้ผ้าปูที่นอนโทนสีธรรมชาติ (สีครีม เขียวอ่อน หรือเอิร์ธโทน) เพื่อเป็นธาตุตัวกลางช่วยประสานพลังงาน</li>
                            <li><b>ทำบุญร่วมกันด้วย "ของคู่":</b> เช่น ถวายเทียนคู่ หลอดไฟคู่ เชิงเทียน หรือหมอนคู่ อธิษฐานขอให้ชีวิตคู่สว่างไสว ราบรื่น</li>
                            <li><b>แบ่งหน้าที่การเงินและงานบ้านให้ชัดเจน:</b> คนใจเย็นเก็บเงิน คนใจเด็ดขาดลุยงานนอกบ้าน เพื่อลดการปะทะกันในเรื่องไม่เป็นเรื่อง</li>
                        </ul>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-heart text-danger mr-2"></i>นิยามความรักตามหลักสยามโหรามงคล</h6>
                    <small>"ดวงสมพงษ์เป็นเพียงแรงส่ง ๕๐% แต่อีก ๕๐% คือความซื่อสัตย์ ความเข้าใจ และการให้อภัยซึ่งกันและกัน"</small>
                </div>
            </div>
        `,
        link: "compatibilityPage",
        badge: "badge-pink",
        references: [
            "พระยาโหราธิบดี. <em>ตำราสมพงษ์หมวดนาคเกี้ยวและคู่ครองพรหมชาติฉบับหลวง</em>.",
            "หลวงวิศาลดรุณกร. <em>คัมภีร์มหาทักษาและสมพงษ์พระเคราะห์</em>. โรงพิมพ์เจริญธรรม.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>หลักการวิเคราะห์ดวงสมพงษ์และชะตาชีวิตคู่ครอง</em>."
        ]
    },
    "planet_meanings": {
        id: "K010",
        category: "โหราศาสตร์",
        title: "🌌 ความหมายเลขดวงดาว ๑ - ๐",
        type: "วิเคราะห์ดาวเคราะห์",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-sun mr-2"></i>อิทธิพลของดาวพระเคราะห์</h5>
                    <p>ในทางโหราศาสตร์ ดาวแต่ละดวงมีบุคลิกและ "พลัง" ที่ส่งผลต่อเจ้าชะตาต่างกัน โบราณท่านสรุปไว้เป็นคำกลอนเพื่อให้จำง่ายดังนี้</p>
                </section>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <ul class="list-unstyled small text-white-50">
                            <li><b class="text-gold">๑ (อาทิตย์):</b> ยศศักดิ์ ทิฐิ ความสง่าผ่าเผย</li>
                            <li><b class="text-gold">๒ (จันทร์):</b> รูปร่าง เสน่ห์ ความเมตตา</li>
                            <li><b class="text-gold">๓ (อังคาร):</b> กล้าแข็ง ขยัน ขาลุย</li>
                            <li><b class="text-gold">๔ (พุธ):</b> เจรจาอ่อนหวาน ปัญญาไว</li>
                            <li><b class="text-gold">๕ (พฤหัส):</b> ปัญญาบริสุทธิ์ คุณธรรม</li>
                        </ul>
                    </div>
                    <div class="col-md-6 mb-3">
                        <ul class="list-unstyled small text-white-50">
                            <li><b class="text-gold">๖ (ศุกร์):</b> กิเลส สมบัติ ความรัก</li>
                            <li><b class="text-gold">๗ (เสาร์):</b> โทษทุกข์ ความอดทน</li>
                            <li><b class="text-gold">๘ (ราหู):</b> มัวเมา พลิกแพลง</li>
                            <li><b class="text-gold">๙ (เกตุ):</b> สิ่งศักดิ์สิทธิ์ ปาฏิหาริย์</li>
                            <li><b class="text-gold">๐ (มฤตยู):</b> การเปลี่ยนแปลง นวัตกรรม</li>
                        </ul>
                    </div>
                </div>
                <div class="alert alert-gold bg-dark border-gold mt-2">
                    <small>คำกล่าวที่ว่า "ดูรูปงามให้ดูจันทร์ ดูปัญญาให้ดูพฤหัส ดูความสบายให้ดูศุกร์" ยังคงใช้ได้ดีเสมอในการวิเคราะห์ดวงพื้นฐาน</small>
                </div>
            </div>
        `,
        link: "planetRelationPage",
        badge: "badge-info"
    },
    "naming_tips": {
        id: "K011",
        category: "วิถีสิริมงคล",
        title: "✍️ หลักการตั้งชื่อมงคลตามวันเกิด (ทักษาปกรณ์ & อักษรต้องห้าม)",
        type: "การตั้งชื่อ",
        level: "ทั่วไป (เหมาะสำหรับผู้ปกครอง & คนเปลี่ยนชื่อ)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-pen-nib mr-2"></i>๑. ทำไมชื่อถึงมีความสำคัญต่อชะตาชีวิต?</h5>
                    <p>ชื่อไม่ใช่แค่ป้ายเรียก แต่คือ <b>"รหัสเสียง" (Sound Frequency)</b> ที่ตัวเราและผู้อื่นเปล่งออกมาเรียกขานเรานับหมื่นนับแสนครั้งตลอดชีวิต ทุกครั้งที่มีคนเรียกชื่อเรา คลื่นพลังงานของสระและพยัญชนะนั้นจะกระตุ้นเซลล์สมองและจิตใต้สำนึก</p>
                    <p>หลักการตั้งชื่อไทยโบราณตาม <b>คัมภีร์ทักษาปกรณ์</b> มีกฎเหล็กข้อเดียวที่ห้ามฝ่าฝืนคือ: <b>"ต้องไม่มีอักษรกาลกิณีอยู่ในชื่อเด็ดขาด"</b> จากนั้นจึงเลือกใช้อักษรที่เป็น เดช (ผู้นำ บารมี) หรือ ศรี (เสน่ห์ โชคลาภ ทรัพย์สิน) นำหน้า</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-table mr-2"></i>๒. ตารางอักษรประจำวันเกิดและอักษรต้องห้าม (กาลกิณี)</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>วันเกิดของคุณ</th>
                                    <th>อักษรเสริมบารมี & โชคลาภ (เดช/ศรี)</th>
                                    <th>อักษรกาลกิณี (ห้ามมีในชื่อเด็ดขาด)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>วันอาทิตย์</b></td>
                                    <td>ก ข ค ฆ ง (เดช) / จ ฉ ช ซ ฌ ญ (ศรี)</td>
                                    <td><b class="text-danger">ศ ษ ส ห ฬ ฮ</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันจันทร์</b></td>
                                    <td>จ ฉ ช ซ ฌ ญ (เดช) / ฎ ฏ ฐ ฑ ฒ ณ (ศรี)</td>
                                    <td><b class="text-danger">อ และ สระทั้งหมด (ะ า ิ ี ึ ื ุ ู เ แ โ ใ ไ)</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันอังคาร</b></td>
                                    <td>ฎ ฏ ฐ ฑ ฒ ณ (เดช) / ด ต ถ ท ธ น (ศรี)</td>
                                    <td><b class="text-danger">ก ข ค ฆ ง</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันพุธ (กลางวัน: 06.00-17.59)</b></td>
                                    <td>ด ต ถ ท ธ น (เดช) / บ ป ผ ฝ พ ฟ ภ ม (ศรี)</td>
                                    <td><b class="text-danger">จ ฉ ช ซ ฌ ญ</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันพฤหัสบดี</b></td>
                                    <td>บ ป ผ ฝ พ ฟ ภ ม (เดช) / อ และสระ (ศรี)</td>
                                    <td><b class="text-danger">ด ต ถ ท ธ น</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันศุกร์</b></td>
                                    <td>อ และสระทั้งหมด (เดช) / ก ข ค ฆ ง (ศรี)</td>
                                    <td><b class="text-danger">ย ร ล ว</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันเสาร์</b></td>
                                    <td>ย ร ล ว (เดช) / ศ ษ ส ห ฬ ฮ (ศรี)</td>
                                    <td><b class="text-danger">ฎ ฏ ฐ ฑ ฒ ณ</b></td>
                                </tr>
                                <tr>
                                    <td><b>วันพุธกลางคืน (ราหู: 18.00-05.59)</b></td>
                                    <td>ศ ษ ส ห ฬ ฮ (เดช) / ย ร ล ว (ศรี)</td>
                                    <td><b class="text-danger">บ ป ผ ฝ พ ฟ ภ ม</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-clock mr-2"></i>เกณฑ์นับวันเกิดแบบโหราศาสตร์ไทย</h6>
                    <small><b>สำคัญมาก:</b> โหราศาสตร์ไทยไม่ได้เปลี่ยนวันตอนเที่ยงคืน (00:00 น.) แต่เปลี่ยนวันตอน <b>06:00 น. (พระอาทิตย์ขึ้น)</b> เช่น เกิดวันพฤหัสบดี ตอนตี ๓ ยังคงนับเป็น <i>วันพุธกลางคืน</i></small>
                </div>
            </div>
        `,
        link: "taksaPage",
        badge: "badge-success",
        references: [
            "พระยาโหราธิบดี. <em>คัมภีร์นามศาสตร์และอักขระทักษาเฉลิมพระเกียรติ</em>.",
            "สมเด็จพระพุฒาจารย์ (นวม พุทฺธสโร). <em>หลักการผูกชื่อมงคลตามตำราหลวง</em>. วัดอนงคาราม.",
            "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>คู่มือการตั้งชื่อ-เปลี่ยนชื่อมงคลตามหลักทักษาปกรณ์</em>."
        ]
    },
    "fengshui_basic": {
        id: "K012",
        category: "ฮวงจุ้ย",
        title: "🏡 ทิศมงคลและการตั้งศาลพระภูมิ (บ้านเดี่ยว ทาวน์โฮม และคอนโด)",
        type: "วิถีสิริมงคล",
        level: "ทั่วไป (นำไปจัดบ้านได้ทันที)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-home mr-2"></i>๑. ฮวงจุ้ยและทิศทางลมในเมืองไทย (เข้าใจใน ๑ นาที)</h5>
                    <p><b>"ฮวง" คือ ลม และ "จุ้ย" คือ น้ำ</b> การจัดทิศทางบ้านในเมืองไทยไม่ใช่เรื่องลี้ลับ แต่คือ <i>การออกแบบทางสถาปัตยกรรมธรรมชาติ</i> เพื่อให้บ้านรับลมระบายความร้อนได้ดี ไม่อับชื้น และไม่โดนแดดบ่ายแผดเผาจนคนในบ้านใจร้อนหงุดหงิด</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-compass mr-2"></i>๒. ลำดับทิศหน้าบ้านยอดนิยม</h5>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-success"><i class="fas fa-star mr-1"></i> ทิศเหนือ (ทิศเย็นสบาย บารมีสงบ)</b>
                                <p class="small text-white-50 mt-1 mb-0">หน้าบ้านแทบไม่โดนแดดตรงๆ ลมพัดเย็นสบาย คนในบ้านใจเย็น มีสมาธิในการคิดสร้างสรรค์ เหมาะกับสายวิชาการและงานที่ต้องการความสงบ</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold"><i class="fas fa-coins mr-1"></i> ทิศใต้ (ทิศเปิดรับทรัพย์ ลมพัดตลอดปี)</b>
                                <p class="small text-white-50 mt-1 mb-0">รับลมมรสุมพัดเข้าบ้านเกือบ ๘-๙ เดือนต่อปี พลังงานไหลเวียนคึกคัก เหมาะกับบ้านที่ทำการค้า ธุรกิจออนไลน์ หรือเจ้าของกิจการ</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-info"><i class="fas fa-sun mr-1"></i> ทิศตะวันออก (ทิศรุ่งอรุณ เริ่มต้นใหม่)</b>
                                <p class="small text-white-50 mt-1 mb-0">รับแสงแดดยามเช้าที่มีประโยชน์ ตกบ่ายบ้านเย็นสบาย ปลุกพลังความสดชื่น เหมาะกับการเริ่มต้นครอบครัวใหม่</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-torii-gate mr-2"></i>๓. กฎเหล็กการตั้งศาลพระภูมิและหิ้งพระในบ้าน</h5>
                    <div class="p-3 bg-dark border-gold rounded">
                        <ul class="small text-white-50 mb-0">
                            <li><b>ทิศหันหน้าศาลที่ดีที่สุด:</b> ทิศตะวันออกเฉียงเหนือ (ทิศเศรษฐี) หรือ ทิศตะวันออก (ทิศราชา)</li>
                            <li><b>ข้อห้ามสำคัญ:</b> ห้ามหันหน้าศาลเข้าหาตัวบ้าน, ห้ามตั้งใต้บันได, ห้ามตั้งชิดติดกับแนวกำแพงห้องน้ำ และไม่ควรตั้งตรงกับแนวประตูรั้วแบบประจันหน้าตรงๆ</li>
                            <li><b>สำหรับคอนโดมิเนียม:</b> ไม่จำเป็นต้องตั้งศาล ให้ตั้ง "หิ้งพระ" ในตำแหน่งที่สงบ หันหน้าพระไปทางทิศตะวันออกหรือเหนือ และต้องอยู่สูงกว่าระดับศีรษะขณะยืน</li>
                        </ul>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-broom mr-2"></i>หัวใจฮวงจุ้ยที่ง่ายที่สุด: "สะอาด โปร่ง โล่ง สว่าง"</h6>
                    <small>บ้านที่สะอาดสะอ้าน อากาศถ่ายเท และมีแสงสว่างเพียงพอ คือบ้านที่มีพลัง "ชี่" (พลังชีวิต) ดีที่สุดตามธรรมชาติ ไม่จำเป็นต้องซื้อของเสริมดวงราคาแพง</small>
                </div>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-primary",
        references: [
            "พระยาโหราธิบดี. <em>ตำราพรหมชาติและพิธีมงคลการปลูกเรือนตั้งศาล</em>.",
            "อาจารย์เกรียงไกร บุญธกานนท์. <em>ฮวงจุ้ยปัญจธาตุและการจัดชัยภูมิบ้านพักอาศัย</em>. สถาบันค้นคว้าวิชาการฮวงจุ้ยแห่งประเทศไทย.",
            "สมาคมสถาปนิกสยาม ในพระบรมราชูปถัมภ์. <em>ภูมิสถาปัตยกรรมและทิศทางลมแดดในบริบทไทย</em>."
        ]
    },
    "palm_reading": {
        id: "K013",
        category: "หัตถศาสตร์",
        title: "✋ พื้นฐานการอ่านเส้นลายมือ : แผนที่ชีวิตบนฝ่ามือ (ดูเองได้ทันที ไม่ต้องมีครู)",
        type: "วิเคราะห์ลายมือ",
        level: "ทั่วไป (เหมาะสำหรับผู้เริ่มต้น)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-hand-paper mr-2"></i>๑. ทำไมลายมือถึงบอกชะตาชีวิตได้? มือซ้ายหรือมือขวาดี?</h5>
                    <p>ในทางการแพทย์ เส้นบนฝ่ามือเชื่อมโยงโดยตรงกับ <b>ปลายประสาทและสมอง</b> เมื่อความคิด สุขภาพ และพฤติกรรมเราเปลี่ยน เส้นลายมือก็จะค่อยๆ เปลี่ยนตามไปด้วย ลายมือจึงเปรียบเหมือน <i>"บันทึกพฤติกรรมและแผนที่ชีวิต"</i></p>
                    <div class="p-3 bg-black-25 rounded border-left-gold mb-3">
                        <b class="text-gold-light"><i class="fas fa-question-circle mr-1"></i> ดูมือไหนกันแน่? (สูตรจำง่าย):</b>
                        <ul class="mb-0 mt-1 small text-white-50">
                            <li><b>มือซ้าย:</b> คือ <b>"ต้นทุนชีวิต"</b> บุญวาสนา พรสวรรค์ และสิ่งที่ติดตัวมาแต่กำเนิด</li>
                            <li><b>มือขวา:</b> คือ <b>"ชีวิตปัจจุบันและอนาคต"</b> ผลจากการกระทำ การทำงาน และความพยายามของเรา</li>
                            <li><i>(คนถนัดซ้ายให้สลับความหมายระหว่างซ้ายกับขวา)</i></li>
                        </ul>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-road mr-2"></i>๒. สำรวจ ๓ เส้นหลักบนฝ่ามือ (ดูได้ใน ๒ นาที)</h5>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-dark rounded border-top-gold h-100">
                                <b class="text-danger"><i class="fas fa-heartbeat mr-1"></i> ๑. เส้นชีวิต (Life Line)</b>
                                <p class="small text-white-50 mt-2 mb-1"><b>ตำแหน่ง:</b> เส้นโค้งที่โอบรอบโคนนิ้วหัวแม่มือ</p>
                                <p class="small text-white-50 mb-0"><b>วิธีดู:</b> ไม่ได้บอกว่าจะตายเมื่อไหร่! แต่บอกถึง <i>พลังกาย สุขภาพ และความหนักแน่นของชีวิต</i> เส้นคมชัดลึก แปลว่าสุขภาพแข็งแรง ฟื้นตัวเร็ว ลุยงานหนักได้สบาย หากมีเส้นตัดขวางเยอะ ช่วงนั้นมักมีเรื่องเปลี่ยนแปลงหรือเหนื่อย</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-dark rounded border-top-gold h-100">
                                <b class="text-info"><i class="fas fa-brain mr-1"></i> ๒. เส้นสมอง (Head Line)</b>
                                <p class="small text-white-50 mt-2 mb-1"><b>ตำแหน่ง:</b> เส้นกลางฝ่ามือ ลากยาวขวางไปทางสันมือ</p>
                                <p class="small text-white-50 mb-0"><b>วิธีดู:</b> บ่งบอกถึง <i>วิธีคิด การตัดสินใจ และสติปัญญา</i> เส้นตรงยาว=คิดเป็นตรรกะ มีเหตุผล เหมาะกับงานบริหารคำนวณ; เส้นปลายโค้งลงล่าง=มีความคิดสร้างสรรค์ จินตนาการสูง เหมาะกับงานศิลปะ สื่อ และการตลาด</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-dark rounded border-top-gold h-100">
                                <b class="text-warning"><i class="fas fa-heart mr-1"></i> ๓. เส้นจิตใจ (Heart Line)</b>
                                <p class="small text-white-50 mt-2 mb-1"><b>ตำแหน่ง:</b> เส้นบนสุด ใต้นิ้วชี้และนิ้วกลาง</p>
                                <p class="small text-white-50 mb-0"><b>วิธีดู:</b> บ่งบอกถึง <i>อารมณ์ ความรัก และความเมตตา</i> เส้นยาวโค้งขึ้นถึงใต้นิ้วชี้=โรแมนติก ซื่อสัตย์ ทุ่มเทให้คนรัก; เส้นตรงสั้น=เก็บความรู้สึก ไม่ชอบความหวือหวา รักสงบ</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-coins mr-2"></i>๓. เส้นวาสนา (Fate Line) เส้นที่ทุกคนตามหา!</h5>
                    <p>เส้นที่ลากตั้งตรงจากโคนฝ่ามือพุ่งขึ้นไปหานิ้วกลาง เรียกว่า <b>"เส้นวาสนา"</b> บ่งบอกถึงความสำเร็จในหน้าที่การงาน หากเส้นนี้ชัดเจน ไม่ขาดตอน แปลว่าชีวิตการงานมีเป้าหมายมั่นคง มีโอกาสสร้างฐานะเป็นเศรษฐีได้ด้วยความเพียรของตนเอง</p>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>ความจริงของหัตถศาสตร์</h6>
                    <small>"เส้นลายมือเปลี่ยนได้ทุกๆ ๖ เดือน ถึง ๑ ปี ตามการดูแลสุขภาพ ความคิด และการกระทำของเรา" อย่าท้อถ้าเส้นตอนนี้ยังไม่สวย เพราะมือของคุณอยู่ในกำมือคุณเอง</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-warning",
        references: [
            "พันเอก สมาน สมาโน. <em>หัตถศาสตร์มาตรฐานและการพยากรณ์เส้นลายมือฉบับสมบูรณ์</em>.",
            "หลวงวิศาลดรุณกร. <em>คัมภีร์หัตถศาสตร์ไทย-สากล</em>. สำนักพิมพ์ศิลปาบรรณาคาร.",
            "Cheiro (Count Louis Hamon). <em>Palmistry for All: Language of the Hand</em>."
        ]
    },
    "physiognomy": {
        id: "K014",
        category: "นรลักษณ์ศาสตร์",
        title: "👤 โหงวเฮ้งใบหน้าและลักษณะมงคล (เทคนิคดูคนใน ๓ วินาที)",
        type: "วิเคราะห์ลักษณะ",
        level: "ทั่วไป (เหมาะสำหรับงานสัมภาษณ์ เจรจา ค้าขาย)",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-user-tie mr-2"></i>๑. โหงวเฮ้งคืออะไร? (วิทยาศาสตร์การอ่านมนุษย์โบราณ)</h5>
                    <p><b>"โหงวเฮ้ง" หรือ "นรลักษณ์ศาสตร์"</b> ไม่ใช่ไสยศาสตร์ แต่เป็น <i>สถิติการสังเกตสรีระใบหน้ามนุษย์ที่บันทึกต่อเนื่องมากว่า ๓,๐๐๐ ปี</i> กล้ามเนื้อบนใบหน้าและโครงกระดูกสะท้อนถึง ฮอร์โมน ความคิด อารมณ์ และนิสัยที่สั่งสมมาอย่างยาวนาน</p>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-layer-group mr-2"></i>๒. ๓ โซนบนใบหน้าบอก ๓ ช่วงวัย (ไตรภาค)</h5>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๑. ส่วนบน (หน้าผากถึงคิ้ว)</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>ช่วงวัย:</b> ๑๕ - ๓๐ ปี<br>บอกถึง: สติปัญญา การศึกษา และการสนับสนุนจากบิดามารดา หน้าผากกว้าง อิ่มเต็ม แปลว่าหัวไว ได้รับโอกาสดีตั้งแต่อายุน้อย</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๒. ส่วนกลาง (คิ้วถึงปลายจมูก)</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>ช่วงวัย:</b> ๓๑ - ๕๐ ปี<br>บอกถึง: การสร้างเนื้อสร้างตัว ความมุ่งมั่น และคู่ครอง จมูกอิ่ม ปีกจมูกหนา แปลว่าหาเงินเก่งและเก็บทรัพย์อยู่</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">๓. ส่วนล่าง (ใต้จมูกถึงปลายคาง)</b>
                                <p class="small text-white-50 mt-1 mb-0"><b>ช่วงวัย:</b> ๕๑ ปีขึ้นไป<br>บอกถึง: วัยเกษียณ บริวาร และความสงบสุขในบั้นปลาย คางกลมมน มีเนื้อ แปลว่าลูกหลานรักใคร่ มีที่ดินและทรัพย์สินมั่นคง</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-mountain mr-2"></i>๓. "๕ ขุนเขา" จุดรับทรัพย์บนใบหน้าที่ควรสังเกต</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>จุดบนใบหน้า</th>
                                    <th>ลักษณะโหงวเฮ้งที่ดี</th>
                                    <th>สะท้อนถึงนิสัยและวาสนา</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>หน้าผาก</b></td>
                                    <td>โหนกนูน เกลี้ยงเกลา ไม่เป็นหลุม</td>
                                    <td>วิสัยทัศน์กว้างไกล เจ้านายเมตตา ได้รับโอกาสเติบโตเร็ว</td>
                                </tr>
                                <tr>
                                    <td><b>จมูก (คลังเงิน)</b></td>
                                    <td>สันตรง ปลายจมูกกลมมน ปีกจมูกมีเนื้อปิดมิด</td>
                                    <td>หาเงินคล่อง กระเป๋าเงินไม่รั่วไหล มีวินัยทางการเงินสูง</td>
                                </tr>
                                <tr>
                                    <td><b>โหนกแก้มซ้าย-ขวา</b></td>
                                    <td>อิ่มเต็ม ไม่แหลมคม รับกับจมูก</td>
                                    <td>มีอำนาจคุมลูกน้อง บริวารให้ความเคารพยำเกรง</td>
                                </tr>
                                <tr>
                                    <td><b>คาง</b></td>
                                    <td>กลมมน รูปไข่หรือทรงยู ไม่สั้นตัด</td>
                                    <td>บั้นปลายชีวิตสุขสบาย มีบ้านที่อยู่อาศัยร่มเย็น</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1"><i class="fas fa-smile mr-2"></i>เคล็ดลับปรับโหงวเฮ้งทันทีโดยไม่ต้องศัลยกรรม</h6>
                    <small><b>"รอยยิ้มและแววตาผ่องใสคือโหงวเฮ้งที่ดีที่สุด":</b> คนที่มีมุมปากยกขึ้นเล็กน้อยตามธรรมชาติ และมีแววตาสดใสจริงใจ ใครเห็นก็อยากเข้าใกล้ เจรจาค้าขายใดๆ ก็ปิดดีลได้ง่ายขึ้น</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-primary",
        references: [
            "พระยาโหราธิบดี. <em>ตำรานรลักษณ์ศาสตร์ไทยโบราณและลักษณะสตรี-บุรุษมงคล</em>.",
            "อาจารย์สมศักดิ์ หัตถศาสตร์. <em>คัมภีร์โหงวเฮ้งยอดศาสตร์แห่งการอ่านคน</em>. สำนักพิมพ์มติชน.",
            "สมาคมโหราศาสตร์นานาชาติ. <em>ศาสตร์การวิเคราะห์นรลักษณ์และโหงวเฮ้งประยุกต์</em>."
        ]
    },
    "moles_predict": {
        id: "K015",
        category: "ตำราโบราณ",
        title: "จุดไฝพยากรณ์ (ดี-ร้าย)",
        type: "วิเคราะห์ลักษณะ",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-dot-circle mr-2"></i>ไฝและขี้แมลงวันบอกชะตา</h5>
                    <p>ตำแหน่งของไฝบนร่างกายสามารถบอกถึงโชคลาภหรืออุปสรรคที่อาจเกิดขึ้นได้ โดยเฉพาะบนใบหน้า</p>
                </section>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50 border-gold">
                        <thead>
                            <tr class="text-gold">
                                <th>ตำแหน่ง</th>
                                <th>คำทำนายโดยย่อ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>กลางหน้าผาก</td><td>มีบุญวาสนา มักได้เป็นเจ้าคนนายคน</td></tr>
                            <tr><td>หางตา</td><td>มีเสน่ห์ต่อเพศตรงข้าม แต่อาจมีเรื่องรักวุ่นๆ</td></tr>
                            <tr><td>ดั้งจมูก</td><td>ระวังเรื่องสุขภาพและอุบัติเหตุ</td></tr>
                            <tr><td>ริมฝีปากบน</td><td>เจรจาพาทีดี มีลาภปากอยู่เสมอ</td></tr>
                            <tr><td>ติ่งหู</td><td>เป็นคนกตัญญู มีผู้อุปถัมภ์ดี</td></tr>
                            <tr><td>หลังมือ</td><td>ขยันหมั่นเพียร จะตั้งตัวได้ด้วยตัวเอง</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-secondary"
    },
    "dream_predict": {
        id: "K016",
        category: "ตำราโบราณ",
        title: "💤 ทำนายฝันพยากรณ์และเลขมงคล",
        type: "วิเคราะห์ความฝัน",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-moon mr-2"></i>ความฝัน: ลางบอกเหตุหรือธาตุโขภ?</h5>
                    <p>ตามตำราโบราณ ความฝันอาจเกิดได้จากหลายสาเหตุ ทั้ง "เทพสังหรณ์" (เทวดาบอกเหตุ), "จิตนิวรณ์" (คิดมากไปเอง) หรือ "ธาตุโขภ" (อาหารไม่ย่อย) การจะดูว่าฝันไหนแม่นยำที่สุด มักดูจากความฝันในช่วงใกล้รุ่ง (เวลา ๐๓.๐๐ - ๐๖.๐๐ น.)</p>
                </section>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50 border-gold">
                        <thead>
                            <tr class="text-gold">
                                <th>หมวดความฝัน</th>
                                <th>คำทำนายโดยย่อ</th>
                                <th>เลขเด่น</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>ฝันเห็นงู</td><td>จะได้พบเนื้อคู่ หรือมีโชคจากเสน่หา</td><td>4, 5, 6</td></tr>
                            <tr><td>ฝันว่าฟันหัก</td><td>ระวังเรื่องสุขภาพของผู้ใหญ่ในบ้าน</td><td>0, 3, 7</td></tr>
                            <tr><td>ฝันเห็นปลา</td><td>จะมีโชคลาภจากการเสี่ยงโชคหรือหน้าที่การงาน</td><td>8, 2, 1</td></tr>
                            <tr><td>ฝันว่าได้แหวน</td><td>คนโสดจะพบรัก คนมีคู่จะได้บุตรมงคล</td><td>0, 9, 1</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1 small font-weight-bold"><i class="fas fa-magic mr-2"></i>วิธีแก้ฝันร้าย</h6>
                    <small>หากฝันไม่ดี โบราณให้แก้เคล็ดด้วยการ "เล่าความฝันให้แม่พระคงคา" (เล่าที่หน้าอ่างล้างหน้าหรือที่น้ำไหล) เพื่อให้เรื่องร้ายไหลไปกับน้ำ</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-dark"
    },
    "remedy_spirit": {
        id: "K017",
        category: "วิถีสิริมงคล",
        title: "🕯️ วิธีเสริมดวงและแก้เคล็ดตามวันเกิด",
        type: "วิถีสิริมงคล",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-praying-hands mr-2"></i>การสร้างบุญบารมีเฉพาะบุคคล</h5>
                    <p>เมื่อรู้ว่าช่วงนี้ดวงตกหรือมีอุปสรรค การเลือกทำบุญที่ถูกโฉลกกับวันเกิดจะช่วยผ่อนหนักเป็นเบา และช่วยดึงพลัง "ศรี" ให้กลับมาทำงานได้ดีขึ้น</p>
                </section>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">วันอาทิตย์/พฤหัสบดี:</b>
                            <p class="small mb-0">เน้นทำบุญที่เกี่ยวกับแสงสว่าง เช่น ถวายเทียน หลอดไฟ หรือบริจาคเงินค่าไฟฟ้าให้วัด</p>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">วันจันทร์/ศุกร์:</b>
                            <p class="small mb-0">เน้นทำบุญเกี่ยวกับน้ำดื่ม หรือช่วยเหลือเด็กและสตรีด้อยโอกาส</p>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">วันอังคาร/เสาร์:</b>
                            <p class="small mb-0">เน้นทำบุญกับโรงพยาบาล บริจาคเลือด หรือร่วมสมทบทุนซื้ออุปกรณ์การแพทย์</p>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">วันพุธ:</b>
                            <p class="small mb-0">เน้นการปล่อยปลา ปล่อยสัตว์ที่กำลังจะถูกฆ่า หรือบริจาคหนังสือเรียน</p>
                        </div>
                    </div>
                </div>
                <p class="text-center text-muted small mt-2">"ศรัทธามาพร้อมปัญญา นำพาความสำเร็จที่ยั่งยืน"</p>
            </div>
        `,
        link: "mainContent",
        badge: "badge-success"
    },
    "rahu_worship": {
        id: "K018",
        category: "วิถีสิริมงคล",
        title: "🌑 เคล็ดลับการบูชาพระราหูและของดำ 8 อย่าง",
        type: "การบูชาเสริมดวง",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <h5 class="text-gold">ไหว้ราหูอย่างไรให้รวย?</h5>
                <p>พระราหูในทางโหราศาสตร์คือดาวกึ่งดีกึ่งร้าย หากบูชาถูกวิธีจะให้คุณด้านโชคลาภแบบไม่คาดฝัน (Windfall Luck)</p>
                <b class="text-gold">ของไหว้ 8 อย่าง:</b>
                <p class="small">1. ไก่ดำ 2. เหล้าดำ 3. กาแฟดำ 4. เฉาก๊วย 5. ถั่วดำ 6. ข้าวเหนียวดำ 7. ขนมเปียกปูน 8. ไข่เยี่ยวมา</p>
            </div>
        `,
        link: "mainContent",
        badge: "badge-success"
    },
    "lucky_animals": {
        id: "K019",
        category: "ฮวงจุ้ย",
        title: "🦁 สัตว์มงคลเสริมบารมีและตำแหน่งวาง",
        type: "ฮวงจุ้ย",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <h5 class="text-gold">ปี่เซียะ สิงห์ และมังกร</h5>
                <p>การวางสัตว์มงคลในบ้านต้องวางให้ถูกตำแหน่งเพื่อดึงพลังงานบวก</p>
                <ul>
                    <li><b class="text-gold">ปี่เซียะ:</b> วางหันหน้าออกไปทางประตูหลักเพื่อดูดทรัพย์</li>
                    <li><b class="text-gold">มังกร:</b> วางทางทิศซ้ายของโต๊ะทำงานเสริมอำนาจ</li>
                </ul>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-primary"
    },
    "foundation_stone": {
        id: "K020",
        category: "ตำราโบราณ",
        title: "🏗️ พิธีวางศิลาฤกษ์และไม้มงคล 9 ชนิด",
        type: "พิธีกรรม",
        level: "กลาง",
        content: `
            <div class="article-rich-content">
                <h5 class="text-gold">ไม้มงคล 9 ชนิดที่ต้องฝังดิน</h5>
                <p>ก่อนสร้างบ้าน การตอกไม้มงคลจะช่วยให้บ้านร่มเย็นเป็นสุข</p>
                <p class="small">ประกอบด้วย: ไม้ราชพฤกษ์, ไม้ขนุน, ไม้ชัยพฤกษ์, ไม้ทองหลาง, ไม้ไผ่สีสุก, ไม้ทรงบาดาล, ไม้สัก, ไม้พะยูง, และไม้กันเกรา</p>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-warning"
    },
    "pakkhakana": {
        id: "K021",
        category: "ปฏิทินจันทรคติ",
        title: "🌙 วิชาปักขคณนา : หัวใจแห่งปฏิทินไทย",
        type: "คำนวณปฏิทินจันทรคติ",
        level: "ขั้นสูง",
        content: `
    <div class="article-rich-content">
        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-moon mr-2"></i>
                ปักขคณนาคืออะไร
            </h5>
            <p>
            ปักขคณนา เป็นศาสตร์การคำนวณปฏิทินจันทรคติไทย
            ที่ใช้กำหนดวันขึ้นแรม วันพระ วันสำคัญทางพระพุทธศาสนา
            ตลอดจนการหาปีอธิกมาสและอธิกวาร
            ศาสตร์แขนงนี้ถือเป็นรากฐานสำคัญของ
            โหราศาสตร์ไทย ปฏิทินไทย การหาฤกษ์ยาม
            และพิธีกรรมทางศาสนาทั้งหมด
            โบราณเรียกว่า
            <b>"วิชารู้กาลแห่งจันทร์"</b>
            เพราะเป็นการคำนวณการโคจรของดวงจันทร์
            เพื่อกำหนดกิจกรรมสำคัญของบ้านเมือง
            </p>
        </section>
        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
            <h6 class="text-gold-light">
            ● องค์ประกอบสำคัญของปักขคณนา
            </h6>
            <ul class="list-unstyled">
                <li class="mb-2">
                <i class="fas fa-star text-warning mr-2"></i>
                <b>ดิถี</b>
                คืออายุของดวงจันทร์ในแต่ละวัน
                </li>
                <li class="mb-2">
                <i class="fas fa-star text-warning mr-2"></i>
                <b>ปักษ์</b>
                คือช่วงขึ้นและช่วงแรม
                </li>
                <li class="mb-2">
                <i class="fas fa-star text-warning mr-2"></i>
                <b>อธิกมาส</b>
                คือการเพิ่มเดือนพิเศษ
                </li>
                <li class="mb-2">
                <i class="fas fa-star text-warning mr-2"></i>
                <b>อธิกวาร</b>
                คือการเพิ่มวันพิเศษ
                </li>
                <li>
                <i class="fas fa-star text-warning mr-2"></i>
                <b>มหาพยุหะ</b>
                คือหัวใจการคำนวณรอบจันทรคติ
                </li>
            </ul>
        </section>
        <section class="mb-4">
            <h5 class="text-gold">
            <i class="fas fa-history mr-2"></i>
            ประวัติความเป็นมา
            </h5>
            <p>
            วิชาปักขคณนาของไทยได้รับอิทธิพลจาก
            คัมภีร์สุริยยาตร์ของอินเดียโบราณ
            ต่อมาถูกปรับปรุงโดยนักปราชญ์ไทย
            ตั้งแต่สมัยสุโขทัย อยุธยา
            จนถึงรัตนโกสินทร์
            พระมหากษัตริย์ไทยหลายพระองค์
            โดยเฉพาะพระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว
            ทรงศึกษาวิชานี้อย่างลึกซึ้ง
            และทรงใช้ในการปรับปรุงปฏิทินไทย
            </p>
        </section>
        <section class="mb-4">
            <h5 class="text-gold">
            <i class="fas fa-balance-scale mr-2"></i>
            เหตุใดต้องคำนวณปักขคณนา
            </h5>
            <p>
            ปีจันทรคติและปีสุริยคติมีความยาวไม่เท่ากัน
            </p>
            <div class="table-responsive mt-3">
                <table class="table table-sm table-dark text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th>ระบบ</th>
                            <th>จำนวนวัน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ปีจันทรคติ</td>
                            <td>ประมาณ 354 วัน</td>
                        </tr>
                        <tr>
                            <td>ปีสุริยคติ</td>
                            <td>ประมาณ 365.2422 วัน</td>
                        </tr>
                        <tr>
                            <td>ผลต่าง</td>
                            <td>ประมาณ 11 วัน</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="mt-3">
            หากไม่แก้ไข
            วันสำคัญทางพระพุทธศาสนา
            จะค่อย ๆ เลื่อนไปจากฤดูกาลจริง
            จึงจำเป็นต้องใช้ระบบอธิกมาสและอธิกวาร
            เข้ามาปรับสมดุล
            </p>
        </section>
        <section class="mb-4">
            <h5 class="text-gold">
            <i class="fas fa-calendar-alt mr-2"></i>
            ประโยชน์ของปักขคณนา
            </h5>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">
                        กำหนดวันพระ
                        </b>
                        <p class="small text-white-50 mt-2">
                        ใช้คำนวณวันขึ้น 8 ค่ำ
                        ขึ้น 15 ค่ำ
                        แรม 8 ค่ำ
                        และแรม 15 ค่ำ
                        </p>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">
                        วันสำคัญทางศาสนา
                        </b>
                        <p class="small text-white-50 mt-2">
                        มาฆบูชา
                        วิสาขบูชา
                        อาสาฬหบูชา
                        เข้าพรรษา
                        ออกพรรษา
                        </p>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">
                        การหาฤกษ์ยาม
                        </b>
                        <p class="small text-white-50 mt-2">
                        ใช้ประกอบการหาฤกษ์มงคล
                        และการเลือกวันสำคัญ
                        </p>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">
                        โหราศาสตร์ไทย
                        </b>
                        <p class="small text-white-50 mt-2">
                        เป็นพื้นฐานของมหาทักษา
                        เลข 7 ตัว
                        พรหมชาติ
                        และกาลโยค
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section class="mb-4">
            <h5 class="text-gold">
            <i class="fas fa-link mr-2"></i>
            ความสัมพันธ์กับศาสตร์อื่น
            </h5>
            <p>
            ปักขคณนาไม่ได้เป็นเพียงการคำนวณวันเดือนปี
            แต่เป็นรากฐานของศาสตร์ไทยแทบทุกแขนง
            ไม่ว่าจะเป็น
            </p>
            <ul>
                <li>โหราศาสตร์ไทย</li>
                <li>เลข 7 ตัว 9 ฐาน</li>
                <li>มหาทักษา</li>
                <li>กาลโยค</li>
                <li>การหาฤกษ์</li>
                <li>พิธีกรรมทางศาสนา</li>
            </ul>
        </section>
        <div class="alert alert-gold bg-dark border-gold mt-4">
            <h6 class="mb-1">
            <i class="fas fa-lightbulb mr-2"></i>
            เกร็ดความรู้
            </h6>
            <small>
            หากไม่มีระบบปักขคณนา
            วันวิสาขบูชาจะค่อย ๆ เลื่อนออกจากเดือนหก
            และในที่สุดจะไม่ตรงกับฤดูกาลเดิมอีกต่อไป
            วิชานี้จึงเป็นกลไกสำคัญที่รักษาความถูกต้อง
            ของปฏิทินไทยมานานกว่าพันปี
            </small>
        </div>
    </div>
    `,
        link: "knowledgePage",
        badge: "badge-primary"
    },
    "adhikamasa": {
        id: "K022",
        category: "ปฏิทินจันทรคติ",
        title: "🌓 อธิกมาส : ความลับของเดือน 8 สองหน",
        type: "การเพิ่มเดือน",
        level: "ขั้นสูง",
        content: `
<div class="article-rich-content">
<section class="mb-4">
<h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-calendar-plus mr-2"></i>อธิกมาสคืออะไร</h5>
<p>อธิกมาส คือ การเพิ่มเดือนพิเศษเข้าไปในปีจันทรคติอีก 1 เดือน เพื่อแก้ความคลาดเคลื่อนระหว่างปีจันทรคติกับปีสุริยคติ ทำให้ปีนั้นมี 13 เดือน แทนที่จะมี 12 เดือนตามปกติ</p>
</section>

<section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
<h6 class="text-gold-light">● เหตุผลที่ต้องมีอธิกมาส</h6>
<p>ปีจันทรคติมีความยาวประมาณ 354 วัน ส่วนปีสุริยคติมีความยาวประมาณ 365.2422 วัน ทำให้แต่ละปีต่างกันประมาณ 11 วัน หากปล่อยไว้นาน ๆ วันสำคัญทางพระพุทธศาสนาจะเลื่อนออกจากฤดูกาลเดิม</p>
</section>

<section class="mb-4">
<h5 class="text-gold"><i class="fas fa-balance-scale mr-2"></i>การแก้ไขความคลาดเคลื่อน</h5>
<div class="table-responsive">
<table class="table table-sm table-dark text-white-50 border-gold">
<thead>
<tr class="text-gold">
<th>ระบบ</th>
<th>จำนวนวัน</th>
</tr>
</thead>
<tbody>
<tr><td>จันทรคติ</td><td>354 วัน</td></tr>
<tr><td>สุริยคติ</td><td>365.2422 วัน</td></tr>
<tr><td>ผลต่าง</td><td>≈ 11 วัน</td></tr>
</tbody>
</table>
</div>
<p class="mt-3">เมื่อสะสมไปประมาณ 3 ปี จะคลาดเคลื่อนเกือบ 1 เดือน จึงต้องเพิ่มเดือนพิเศษเข้ามา</p>
</section>

<section class="mb-4">
<h5 class="text-gold"><i class="fas fa-moon mr-2"></i>เดือนที่เพิ่มคือเดือนใด</h5>
<p>เดือนที่เพิ่มคือ "เดือน 8 หลัง" หรือที่ชาวบ้านเรียกว่า "เดือน 8 สองหน" ทำให้ปีนั้นมีเดือน 8 สองครั้งติดต่อกัน</p>
<div class="table-responsive mt-3">
<table class="table table-sm table-dark text-white-50 border-gold">
<thead>
<tr class="text-gold">
<th>ปกติ</th>
<th>อธิกมาส</th>
</tr>
</thead>
<tbody>
<tr><td>1-2-3-4-5-6-7-8-9-10-11-12</td><td>1-2-3-4-5-6-7-8-8หลัง-9-10-11-12</td></tr>
</tbody>
</table>
</div>
</section>

<section class="mb-4">
<h5 class="text-gold"><i class="fas fa-landmark mr-2"></i>ผลกระทบต่อวันสำคัญ</h5>
<ul>
<li>วันเข้าพรรษาเลื่อนออกไปประมาณ 1 เดือน</li>
<li>วันอาสาฬหบูชาเลื่อนตาม</li>
<li>วันออกพรรษาเลื่อนตาม</li>
<li>ปฏิทินกลับมาตรงกับฤดูกาลจริง</li>
</ul>
</section>

<section class="mb-4">
<h5 class="text-gold"><i class="fas fa-calculator mr-2"></i>ในทางปักขคณนา</h5>
<p>การหาอธิกมาสไม่ใช่การนับทุก 3 ปีแบบตายตัว แต่ต้องอาศัยการคำนวณมหาพยุหะ จุลพยุหะ สมพยุหะ และเกณฑ์จันทรคติที่สืบทอดจากคัมภีร์สุริยยาตร์</p>
</section>

<div class="alert alert-gold bg-dark border-gold mt-4">
<h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>เกร็ดความรู้</h6>
<small>หลายคนเข้าใจว่าอธิกมาสเกิดทุก 3 ปี แต่ความจริงมีการสลับช่วงตามหลักปักขคณนา ทำให้บางครั้งห่าง 2 ปี บางครั้งห่าง 3 ปี และบางครั้งห่างมากกว่านั้นได้</small>
</div>
</div>
`,
        link: "knowledgePage",
        badge: "badge-warning"
    },
    "adhikavara": {
    id: "K023",
    category: "ปฏิทินจันทรคติ",
    title: "📅 อธิกวาร : การเพิ่มวันเพื่อรักษาฤดูกาล",
    type: "การเพิ่มวัน",
    level: "ขั้นสูง",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-calendar-day mr-2"></i>
                อธิกวารคืออะไร
            </h5>

            <p>
                อธิกวาร คือ การเพิ่มวันพิเศษเข้าไปในปีจันทรคติอีก 1 วัน
                เพื่อแก้ความคลาดเคลื่อนที่ยังเหลืออยู่หลังจากการปรับด้วยอธิกมาส
                ถือเป็นกลไกสำคัญที่ทำให้ปฏิทินจันทรคติไทยยังคงสอดคล้องกับการโคจรจริงของดวงจันทร์
            </p>
        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
            <h6 class="text-gold-light">
                ● หลักการของอธิกวาร
            </h6>

            <p>
                แม้จะมีอธิกมาสช่วยเพิ่มเดือนแล้ว
                แต่ยังคงมีเศษความคลาดเคลื่อนสะสมอยู่
                จึงจำเป็นต้องเพิ่มวันพิเศษอีก 1 วัน
                เพื่อรักษาความแม่นยำของปฏิทินไทย
            </p>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-clock mr-2"></i>
                เพิ่มวันในเดือนไหน
            </h5>

            <p>
                ตามหลักปักขคณนา อธิกวารจะเพิ่มวันเข้าไปในเดือน 7
                ทำให้เดือนนั้นมีจำนวนวันมากกว่าปกติ
            </p>

            <div class="table-responsive mt-3">
                <table class="table table-sm table-dark text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th>ประเภทปี</th>
                            <th>จำนวนวัน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ปีปกติ</td>
                            <td>354 วัน</td>
                        </tr>
                        <tr>
                            <td>ปีอธิกวาร</td>
                            <td>355 วัน</td>
                        </tr>
                        <tr>
                            <td>ปีอธิกมาส</td>
                            <td>384 วัน</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-moon mr-2"></i>
                ความแตกต่างระหว่างอธิกมาสและอธิกวาร
            </h5>

            <div class="table-responsive">
                <table class="table table-sm table-dark text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th>หัวข้อ</th>
                            <th>อธิกมาส</th>
                            <th>อธิกวาร</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>สิ่งที่เพิ่ม</td>
                            <td>เพิ่ม 1 เดือน</td>
                            <td>เพิ่ม 1 วัน</td>
                        </tr>
                        <tr>
                            <td>จำนวนเดือน</td>
                            <td>13 เดือน</td>
                            <td>12 เดือน</td>
                        </tr>
                        <tr>
                            <td>ผลต่อวันสำคัญ</td>
                            <td>เลื่อนประมาณ 1 เดือน</td>
                            <td>เลื่อนเพียงเล็กน้อย</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-calculator mr-2"></i>
                การคำนวณอธิกวาร
            </h5>

            <p>
                ในทางปักขคณนา การตัดสินว่าปีใดเป็นอธิกวาร
                ไม่ได้ใช้การนับรอบอย่างง่าย
                แต่คำนวณจากเกณฑ์ทางดาราศาสตร์และค่าที่ได้จาก
                มหาพยุหะ จุลพยุหะ สมพยุหะ และเกณฑ์จันทรคติ
                ซึ่งสืบทอดมาจากคัมภีร์สุริยยาตร์
            </p>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-landmark mr-2"></i>
                ความสำคัญทางพระพุทธศาสนา
            </h5>

            <p>
                การเพิ่มวันเพียง 1 วันอาจดูเล็กน้อย
                แต่มีผลต่อการกำหนดวันพระ วันเข้าพรรษา
                และวันสำคัญทางศาสนาในระยะยาว
                หากไม่มีอธิกวาร ปฏิทินไทยจะค่อย ๆ คลาดเคลื่อนจากความเป็นจริง
            </p>
        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">
            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                คนทั่วไปมักรู้จักอธิกมาสมากกว่าอธิกวาร
                แต่ในทางดาราศาสตร์ไทย อธิกวารมีความสำคัญไม่แพ้กัน
                เพราะเป็นตัวปรับละเอียดที่ช่วยให้ปฏิทินมีความแม่นยำสูงขึ้น
            </small>
        </div>

    </div>
    `,

    link: "knowledgePage",
    badge: "badge-info"
},
"tithi": {
    id: "K024",
    category: "ปฏิทินจันทรคติ",
    title: "🌔 ดิถี : หัวใจแห่งวันขึ้น-แรม",
    type: "พื้นฐานการคำนวณจันทรคติ",
    level: "ขั้นสูง",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-moon mr-2"></i>
                ดิถีคืออะไร
            </h5>

            <p>
                ดิถี คือ หน่วยวัดอายุของดวงจันทร์ในทางโหราศาสตร์และปฏิทินจันทรคติไทย
                ใช้กำหนดวันขึ้น-แรม วันพระ และวันสำคัญทางพระพุทธศาสนา
                ถือเป็นหัวใจสำคัญที่สุดของวิชาปักขคณนา
            </p>

            <p>
                คำว่า "ดิถี" มาจากภาษาสันสกฤตว่า "ติติ" (Tithi)
                หมายถึงช่วงเวลาที่มุมระหว่างดวงอาทิตย์และดวงจันทร์
                เปลี่ยนไป 12 องศา
                หนึ่งเดือนจันทรคติจึงมีทั้งหมด 30 ดิถี
            </p>
        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
            <h6 class="text-gold-light">
                ● หลักสำคัญของดิถี
            </h6>

            <ul class="list-unstyled">
                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    1 เดือนจันทรคติ = 30 ดิถี
                </li>
                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    ขึ้น 15 ค่ำ = 15 ดิถีแรก
                </li>
                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    แรม 15 ค่ำ = 15 ดิถีหลัง
                </li>
                <li>
                    <i class="fas fa-star text-warning mr-2"></i>
                    วันพระทุกวันอ้างอิงจากดิถี
                </li>
            </ul>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-calendar-alt mr-2"></i>
                ดิถีกับวันขึ้น-แรม
            </h5>

            <div class="table-responsive">
                <table class="table table-sm table-dark text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th>ดิถี</th>
                            <th>เรียกตามปฏิทินไทย</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>ขึ้น 1 ค่ำ</td></tr>
                        <tr><td>2</td><td>ขึ้น 2 ค่ำ</td></tr>
                        <tr><td>8</td><td>ขึ้น 8 ค่ำ (วันพระ)</td></tr>
                        <tr><td>15</td><td>ขึ้น 15 ค่ำ (วันเพ็ญ)</td></tr>
                        <tr><td>16</td><td>แรม 1 ค่ำ</td></tr>
                        <tr><td>23</td><td>แรม 8 ค่ำ (วันพระ)</td></tr>
                        <tr><td>30</td><td>แรม 15 ค่ำ หรือ แรม 14 ค่ำ</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-globe-asia mr-2"></i>
                ความสัมพันธ์กับดวงจันทร์จริง
            </h5>

            <p>
                ดิถีไม่ได้อิงเวลา 24 ชั่วโมงพอดีเหมือนวันสุริยคติ
                แต่คำนวณจากการเคลื่อนที่จริงของดวงจันทร์
                ทำให้บางดิถีสั้นกว่าหนึ่งวัน
                และบางดิถียาวกว่าหนึ่งวัน
            </p>

            <p>
                ด้วยเหตุนี้จึงเกิดปรากฏการณ์ที่เรียกว่า
                "ดิถีขาด" และ "ดิถีเกิน"
                ซึ่งเป็นหนึ่งในสาเหตุที่ทำให้การคำนวณปฏิทินไทยซับซ้อนกว่าปฏิทินสากล
            </p>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-praying-hands mr-2"></i>
                ดิถีกับวันพระ
            </h5>

            <p>
                วันพระทุกวันเกิดจากตำแหน่งดิถีโดยตรง
                จึงถือว่าดิถีเป็นรากฐานของกิจกรรมทางพระพุทธศาสนาทั้งหมด
            </p>

            <div class="table-responsive mt-3">
                <table class="table table-sm table-dark text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th>วันพระ</th>
                            <th>ตำแหน่งดิถี</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>ขึ้น 8 ค่ำ</td><td>ดิถีที่ 8</td></tr>
                        <tr><td>ขึ้น 15 ค่ำ</td><td>ดิถีที่ 15</td></tr>
                        <tr><td>แรม 8 ค่ำ</td><td>ดิถีที่ 23</td></tr>
                        <tr><td>แรม 15 ค่ำ</td><td>ดิถีที่ 30</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-calculator mr-2"></i>
                ดิถีในทางปักขคณนา
            </h5>

            <p>
                การคำนวณดิถีเป็นจุดเริ่มต้นของการคำนวณจันทรคติทั้งหมด
                ไม่ว่าจะเป็นการหาปักษ์ การหาวันพระ
                การหาอธิกวาร อธิกมาส
                รวมถึงการหาวันสำคัญทางพระพุทธศาสนา
            </p>

            <p>
                ในคัมภีร์ปักขคณนา
                จะใช้มหาพยุหะ จุลพยุหะ สมพยุหะ
                และจันทรเกณฑ์ประกอบกัน
                เพื่อหาดิถีที่ถูกต้องในแต่ละวัน
            </p>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-star mr-2"></i>
                การประยุกต์ใช้ในโหราศาสตร์ไทย
            </h5>

            <div class="row">

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">การหาฤกษ์</b>
                        <p class="small text-white-50 mt-2">
                            ใช้พิจารณาวันมงคลและวันต้องห้าม
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">ปฏิทินพระ</b>
                        <p class="small text-white-50 mt-2">
                            ใช้กำหนดวันพระและวันโกน
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">กาลโยค</b>
                        <p class="small text-white-50 mt-2">
                            ใช้ร่วมกับวันทางจันทรคติ
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">เลข 7 ตัว</b>
                        <p class="small text-white-50 mt-2">
                            ใช้ตรวจสอบความสัมพันธ์ของวันเกิด
                        </p>
                    </div>
                </div>

            </div>
        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">
            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                คำว่า "ขึ้น 15 ค่ำ" ไม่ได้หมายถึงวันที่ 15 ของเดือน
                แต่หมายถึงดิถีที่ 15 ซึ่งเป็นวันที่ดวงจันทร์เต็มดวง
                หรือที่เรียกว่า "วันเพ็ญ"
                ส่วน "แรม 15 ค่ำ" คือวันที่ดวงจันทร์ดับ
                หรือ "วันอมาวสี"
            </small>
        </div>

    </div>
    `,
    link: "knowledgePage",
    badge: "badge-warning"
},
"paksa": {
    id: "K025",
    category: "ปฏิทินจันทรคติ",
    title: "🌗 ปักษ์ : วงจรแห่งข้างขึ้นและข้างแรม",
    type: "พื้นฐานจันทรคติ",
    level: "ขั้นสูง",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-adjust mr-2"></i>
                ปักษ์คืออะไร
            </h5>

            <p>
                ปักษ์ คือ การแบ่งเดือนจันทรคติออกเป็น 2 ช่วงใหญ่
                ได้แก่ "ข้างขึ้น" และ "ข้างแรม"
                ซึ่งเกิดจากการเปลี่ยนแปลงรูปร่างที่มองเห็นได้ของดวงจันทร์บนท้องฟ้า
            </p>

            <p>
                คำว่า "ปักษ์" มาจากภาษาสันสกฤต
                หมายถึง ครึ่งหนึ่งของเดือนจันทรคติ
                โดยหนึ่งเดือนจันทรคติจะมีทั้งหมด 2 ปักษ์
            </p>

        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">

            <h6 class="text-gold-light">
                ● การแบ่งปักษ์
            </h6>

            <ul class="list-unstyled">

                <li class="mb-2">
                    <i class="fas fa-moon text-warning mr-2"></i>
                    <b>ศุกลปักษ์</b> หรือ ข้างขึ้น
                </li>

                <li>
                    <i class="fas fa-moon text-info mr-2"></i>
                    <b>กาฬปักษ์</b> หรือ ข้างแรม
                </li>

            </ul>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-arrow-up mr-2"></i>
                ศุกลปักษ์ (ข้างขึ้น)
            </h5>

            <p>
                เป็นช่วงที่ดวงจันทร์ค่อย ๆ สว่างขึ้น
                เริ่มตั้งแต่ขึ้น 1 ค่ำ
                ไปจนถึงขึ้น 15 ค่ำ
                ซึ่งเป็นวันที่ดวงจันทร์เต็มดวง
            </p>

            <div class="table-responsive mt-3">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>วัน</th>
                            <th>ลักษณะดวงจันทร์</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>ขึ้น 1 ค่ำ</td>
                            <td>เริ่มเห็นเสี้ยวจันทร์</td>
                        </tr>
                        <tr>
                            <td>ขึ้น 8 ค่ำ</td>
                            <td>ครึ่งดวง</td>
                        </tr>
                        <tr>
                            <td>ขึ้น 15 ค่ำ</td>
                            <td>พระจันทร์เต็มดวง</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-arrow-down mr-2"></i>
                กาฬปักษ์ (ข้างแรม)
            </h5>

            <p>
                เป็นช่วงที่ดวงจันทร์ค่อย ๆ ลดความสว่างลง
                เริ่มตั้งแต่แรม 1 ค่ำ
                จนถึงแรม 15 ค่ำ
                ซึ่งเป็นวันที่ดวงจันทร์ดับ
            </p>

            <div class="table-responsive mt-3">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>วัน</th>
                            <th>ลักษณะดวงจันทร์</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>แรม 1 ค่ำ</td>
                            <td>เริ่มลดแสง</td>
                        </tr>
                        <tr>
                            <td>แรม 8 ค่ำ</td>
                            <td>เหลือครึ่งดวง</td>
                        </tr>
                        <tr>
                            <td>แรม 15 ค่ำ</td>
                            <td>ดับมืดทั้งดวง</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-calendar-week mr-2"></i>
                วันพระในแต่ละปักษ์
            </h5>

            <div class="table-responsive">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>วันพระ</th>
                            <th>ปักษ์</th>
                            <th>ความสำคัญ</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>ขึ้น 8 ค่ำ</td>
                            <td>ข้างขึ้น</td>
                            <td>วันพระกึ่งปักษ์</td>
                        </tr>
                        <tr>
                            <td>ขึ้น 15 ค่ำ</td>
                            <td>ข้างขึ้น</td>
                            <td>วันเพ็ญ</td>
                        </tr>
                        <tr>
                            <td>แรม 8 ค่ำ</td>
                            <td>ข้างแรม</td>
                            <td>วันพระกึ่งปักษ์</td>
                        </tr>
                        <tr>
                            <td>แรม 15 ค่ำ</td>
                            <td>ข้างแรม</td>
                            <td>วันดับ</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-dharmachakra mr-2"></i>
                ปักษ์กับพระพุทธศาสนา
            </h5>

            <p>
                พระพุทธศาสนาเถรวาทใช้วันขึ้นและวันแรม
                เป็นเกณฑ์กำหนดวันอุโบสถ
                และวันสำคัญทางศาสนา
                เช่น มาฆบูชา วิสาขบูชา และอาสาฬหบูชา
            </p>

            <p>
                เหตุการณ์สำคัญหลายประการในพุทธประวัติ
                ล้วนเกิดในวันเพ็ญหรือวันขึ้น 15 ค่ำ
                จึงถือเป็นวันที่มีความศักดิ์สิทธิ์สูง
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-star mr-2"></i>
                ปักษ์ในทางโหราศาสตร์
            </h5>

            <div class="row">

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">ข้างขึ้น</b>
                        <p class="small text-white-50 mt-2">
                            เหมาะกับการเริ่มต้น
                            การลงทุน
                            การเปิดกิจการ
                            และงานมงคล
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-danger">
                        <b class="text-danger">ข้างแรม</b>
                        <p class="small text-white-50 mt-2">
                            เหมาะกับการสะสางหนี้
                            เลิกสิ่งไม่ดี
                            ปล่อยวาง
                            และการปฏิบัติธรรม
                        </p>
                    </div>
                </div>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-calculator mr-2"></i>
                ความสัมพันธ์กับดิถี
            </h5>

            <p>
                ปักษ์เกิดจากการแบ่งดิถีออกเป็นสองส่วน
                โดยดิถีที่ 1-15 เป็นข้างขึ้น
                และดิถีที่ 16-30 เป็นข้างแรม
            </p>

            <p>
                ดังนั้นหากไม่มีการคำนวณดิถี
                ก็จะไม่สามารถกำหนดปักษ์ได้อย่างถูกต้อง
                ทำให้ปักษ์ถือเป็นผลลัพธ์ที่ต่อเนื่องมาจากดิถีโดยตรง
            </p>

        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">

            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                คำว่า "ข้างขึ้น" และ "ข้างแรม"
                ที่คนไทยใช้กันอยู่ทุกวันนี้
                มีอายุการใช้งานต่อเนื่องมานานกว่าพันปี
                และยังคงเป็นระบบนับวันจันทรคติที่ใช้อยู่จริงในวัดไทยทั่วประเทศ
            </small>

        </div>

    </div>
    `,

    link: "knowledgePage",
    badge: "badge-success"
},
"holyday": {
    id: "K026",
    category: "ปฏิทินจันทรคติ",
    title: "🙏 วันพระและวันโกน : จังหวะแห่งบุญกุศล",
    type: "วันสำคัญทางพระพุทธศาสนา",
    level: "ทั่วไป",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-praying-hands mr-2"></i>
                วันพระคืออะไร
            </h5>

            <p>
                วันพระ หรือ วันอุโบสถ
                คือวันที่พุทธศาสนิกชนใช้สำหรับฟังธรรม
                รักษาศีล ทำบุญ และเจริญภาวนา
                เป็นวันที่พระสงฆ์ประชุมทำสังฆกรรม
                ตามพระวินัยที่สืบทอดมาตั้งแต่สมัยพุทธกาล
            </p>

            <p>
                ในประเทศไทย
                วันพระถูกกำหนดจากปฏิทินจันทรคติ
                มิได้อ้างอิงตามปฏิทินสากล
                จึงมีวันเปลี่ยนแปลงไปในแต่ละเดือน
            </p>

        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">

            <h6 class="text-gold-light">
                ● วันพระประจำเดือนจันทรคติ
            </h6>

            <ul class="list-unstyled">

                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    ขึ้น 8 ค่ำ
                </li>

                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    ขึ้น 15 ค่ำ
                </li>

                <li class="mb-2">
                    <i class="fas fa-star text-warning mr-2"></i>
                    แรม 8 ค่ำ
                </li>

                <li>
                    <i class="fas fa-star text-warning mr-2"></i>
                    แรม 14 หรือ 15 ค่ำ
                </li>

            </ul>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-calendar-week mr-2"></i>
                วันโกนคืออะไร
            </h5>

            <p>
                วันโกน คือวันก่อนวันพระ 1 วัน
                เป็นวันที่พระภิกษุสามเณร
                เตรียมตัวสำหรับการทำอุโบสถกรรม
                และในอดีตนิยมโกนผม โกนหนวด
                เพื่อความเรียบร้อยก่อนเข้าร่วมพิธี
            </p>

            <p>
                ชาวบ้านโบราณถือว่าวันโกน
                เป็นวันเตือนใจให้เตรียมจิตใจ
                ก่อนเข้าสู่วันบุญใหญ่ในวันถัดไป
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-table mr-2"></i>
                ความสัมพันธ์ระหว่างวันโกนและวันพระ
            </h5>

            <div class="table-responsive">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>วันโกน</th>
                            <th>วันพระ</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>ขึ้น 7 ค่ำ</td>
                            <td>ขึ้น 8 ค่ำ</td>
                        </tr>
                        <tr>
                            <td>ขึ้น 14 ค่ำ</td>
                            <td>ขึ้น 15 ค่ำ</td>
                        </tr>
                        <tr>
                            <td>แรม 7 ค่ำ</td>
                            <td>แรม 8 ค่ำ</td>
                        </tr>
                        <tr>
                            <td>แรม 13 หรือ 14 ค่ำ</td>
                            <td>แรม 14 หรือ 15 ค่ำ</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-dharmachakra mr-2"></i>
                ความสำคัญในพระพุทธศาสนา
            </h5>

            <p>
                วันพระถือเป็นวันสำคัญที่พระพุทธองค์ทรงกำหนดให้
                พระสงฆ์ประชุมสวดพระปาติโมกข์
                เพื่อทบทวนพระธรรมวินัย
                และรักษาความบริสุทธิ์ของคณะสงฆ์
            </p>

            <p>
                สำหรับฆราวาส
                วันพระเป็นโอกาสในการรักษาศีล
                ฟังธรรม ทำบุญ และฝึกจิตใจให้สงบ
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-star mr-2"></i>
                วันพระกับวิถีชีวิตไทย
            </h5>

            <div class="row">

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">ทำบุญตักบาตร</b>
                        <p class="small text-white-50 mt-2">
                            เสริมสิริมงคลแก่ชีวิต
                            และอุทิศส่วนกุศลให้บรรพบุรุษ
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-info">
                        <b class="text-info">รักษาศีล 5 หรือศีล 8</b>
                        <p class="small text-white-50 mt-2">
                            เป็นการฝึกจิตใจให้สงบ
                            ลดกิเลสและความฟุ้งซ่าน
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">ฟังพระธรรมเทศนา</b>
                        <p class="small text-white-50 mt-2">
                            เพิ่มพูนปัญญาและความเข้าใจในชีวิต
                        </p>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-black-25 rounded border-left-gold">
                        <b class="text-gold">เจริญภาวนา</b>
                        <p class="small text-white-50 mt-2">
                            สร้างสติและความสงบภายใน
                        </p>
                    </div>
                </div>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-calculator mr-2"></i>
                วันพระในทางปักขคณนา
            </h5>

            <p>
                วันพระเกิดจากการคำนวณดิถีโดยตรง
                จึงเป็นผลลัพธ์สำคัญของวิชาปักขคณนา
                การคำนวณวันพระที่คลาดเคลื่อน
                จะส่งผลต่อการกำหนดวันสำคัญทางศาสนาทั้งหมด
            </p>

            <p>
                ด้วยเหตุนี้ตำราปักขคณนาโบราณ
                จึงให้ความสำคัญกับการคำนวณดิถี
                ปักษ์ และจันทรเกณฑ์อย่างละเอียด
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-history mr-2"></i>
                ความเชื่อโบราณเกี่ยวกับวันโกน
            </h5>

            <p>
                คนไทยโบราณมีความเชื่อว่า
                วันโกนเป็นวันแห่งการเตรียมตัว
                จึงนิยมทำความสะอาดบ้านเรือน
                จัดเตรียมเครื่องสักการะ
                และงดเว้นการทะเลาะเบาะแว้ง
            </p>

            <p>
                มีคำกล่าวที่สืบทอดกันมาว่า
                "วันโกนอย่าโกรธ วันพระอย่าประมาท"
                เพื่อเตือนใจให้ใช้ชีวิตด้วยสติ
            </p>

        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">

            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                ในอดีตหลายชุมชนจะตีฆ้องหรือกลองวัดในวันโกน
                เพื่อแจ้งเตือนชาวบ้านว่า
                วันรุ่งขึ้นเป็นวันพระ
                จึงเป็นที่มาของคำพูดว่า
                "ได้ยินกลองวันโกน"
                ที่ยังใช้กันอยู่จนถึงปัจจุบัน
            </small>

        </div>

    </div>
    `,
    link: "knowledgePage",
    badge: "badge-success"
},
"mahaphayuha": {
    id: "K027",
    category: "ปฏิทินจันทรคติ",
    title: "⭐ มหาพยุหะ : รากฐานแห่งการคำนวณปฏิทินไทย",
    type: "ปักขคณนาชั้นสูง",
    level: "ผู้ศึกษาโหราศาสตร์",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-star mr-2"></i>
                มหาพยุหะคืออะไร
            </h5>

            <p>
                มหาพยุหะ เป็นหนึ่งในหัวใจสำคัญของวิชาปักขคณนา
                ใช้เป็นฐานข้อมูลทางคณิตศาสตร์ดาราศาสตร์
                สำหรับคำนวณการเดินของดวงจันทร์ในระบบจันทรคติไทย
            </p>

            <p>
                ในคัมภีร์สุริยยาตร์และตำราปักขคณนาโบราณ
                มหาพยุหะถือเป็นค่าหลักที่ใช้ร่วมกับ
                จุลพยุหะ สมพยุหะ วิกติ และจันทรเกณฑ์
                เพื่อหาความคลาดเคลื่อนของรอบดวงจันทร์
            </p>
        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
            <h6 class="text-gold-light">
                ● หน้าที่ของมหาพยุหะ
            </h6>

            <ul class="list-unstyled">

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ใช้เป็นค่าพื้นฐานในการคำนวณดิถี
                </li>

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ใช้ตรวจสอบอธิกมาส
                </li>

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ใช้ตรวจสอบอธิกวาร
                </li>

                <li>
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ใช้หาวันสำคัญทางพระพุทธศาสนา
                </li>

            </ul>
        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-history mr-2"></i>
                ความเป็นมาในคัมภีร์โบราณ
            </h5>

            <p>
                มหาพยุหะปรากฏอยู่ในตำราปักขคณนา
                ที่สืบทอดมาจากคัมภีร์สุริยยาตร์
                ซึ่งเป็นศาสตร์ดาราศาสตร์อินเดียโบราณ
                ที่มีอิทธิพลต่อการสร้างปฏิทินไทย
                ลาว เขมร และมอญ
            </p>

            <p>
                นักปราชญ์ไทยในอดีตได้นำหลักดังกล่าว
                มาปรับให้เหมาะสมกับการใช้ในราชอาณาจักรไทย
                จนกลายเป็นระบบปฏิทินที่ใช้งานจริงมาหลายร้อยปี
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-calculator mr-2"></i>
                บทบาทในกระบวนการคำนวณ
            </h5>

            <p>
                มหาพยุหะไม่ได้ใช้เพียงลำพัง
                แต่ทำงานร่วมกับค่าคำนวณอื่น ๆ
                ตามลำดับขั้นของปักขคณนา
            </p>

            <div class="table-responsive mt-3">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>ลำดับ</th>
                            <th>กระบวนการ</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>1</td>
                            <td>มหาพยุหะ</td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>จุลพยุหะ</td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>สมพยุหะ</td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>วิกติ</td>
                        </tr>

                        <tr>
                            <td>5</td>
                            <td>ดิถี</td>
                        </tr>

                        <tr>
                            <td>6</td>
                            <td>อธิกมาส / อธิกวาร</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-project-diagram mr-2"></i>
                ความสัมพันธ์กับจุลพยุหะ
            </h5>

            <p>
                หากเปรียบมหาพยุหะเป็น "โครงสร้างหลัก"
                จุลพยุหะก็เปรียบเสมือน "ค่าปรับละเอียด"
                ที่ช่วยแก้ความคลาดเคลื่อนของการคำนวณ
            </p>

            <p>
                เมื่อรวมค่าทั้งสองเข้าด้วยกัน
                จะเกิดเป็นสมพยุหะ
                ซึ่งเป็นค่าที่ใช้ในขั้นตอนถัดไปของการคำนวณจันทรคติ
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-moon mr-2"></i>
                ความสำคัญต่อวันสำคัญทางศาสนา
            </h5>

            <p>
                การกำหนดวันมาฆบูชา
                วิสาขบูชา
                อาสาฬหบูชา
                เข้าพรรษา
                และออกพรรษา
                จำเป็นต้องอาศัยการคำนวณที่เริ่มต้นจากมหาพยุหะ
            </p>

            <p>
                หากคำนวณมหาพยุหะผิดเพียงเล็กน้อย
                วันสำคัญทั้งหมดอาจคลาดเคลื่อนได้
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-landmark mr-2"></i>
                มหาพยุหะกับปฏิทินหลวง
            </h5>

            <p>
                ในอดีตการจัดทำปฏิทินหลวง
                และการประกาศวันสำคัญทางศาสนา
                จะต้องอาศัยนักคำนวณปักขคณนา
                ซึ่งมีความรู้เกี่ยวกับมหาพยุหะอย่างลึกซึ้ง
            </p>

            <p>
                ตำแหน่งโหรหลวงในราชสำนัก
                จึงต้องศึกษาวิชานี้เป็นพิเศษ
                เพื่อป้องกันความผิดพลาดในการกำหนดวันสำคัญของบ้านเมือง
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-brain mr-2"></i>
                การประยุกต์ใช้ในปัจจุบัน
            </h5>

            <p>
                ปัจจุบันมหาพยุหะยังคงถูกนำมาใช้
                ในโปรแกรมปฏิทินไทย
                ระบบคำนวณวันพระ
                ซอฟต์แวร์โหราศาสตร์ไทย
                และระบบพยากรณ์ที่อ้างอิงปฏิทินจันทรคติ
            </p>

            <p>
                แม้ผู้ใช้งานทั่วไปจะไม่เห็นค่ามหาพยุหะโดยตรง
                แต่ทุกครั้งที่ดูวันพระหรือวันสำคัญทางศาสนา
                ก็ล้วนมีมหาพยุหะทำงานอยู่เบื้องหลัง
            </p>

        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">

            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                คำว่า "พยุหะ" ในภาษาสันสกฤต
                มีความหมายถึงการจัดเรียงหรือการรวมกลุ่ม
                ซึ่งสอดคล้องกับหน้าที่ของมหาพยุหะ
                ที่เป็นการรวบรวมค่าพื้นฐานต่าง ๆ
                เพื่อใช้ในการคำนวณทางดาราศาสตร์ไทย
            </small>

        </div>

    </div>
    `,

    link: "knowledgePage",
    badge: "badge-danger"
},
"julaphayuha": {
    id: "K028",
    category: "ปฏิทินจันทรคติ",
    title: "✨ จุลพยุหะ : ตัวปรับละเอียดแห่งปักขคณนา",
    type: "ปักขคณนาชั้นสูง",
    level: "ผู้ศึกษาโหราศาสตร์",

    content: `
    <div class="article-rich-content">

        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-satellite mr-2"></i>
                จุลพยุหะคืออะไร
            </h5>

            <p>
                จุลพยุหะ เป็นองค์ประกอบสำคัญในระบบปักขคณนา
                ที่ทำหน้าที่ปรับแก้รายละเอียดของการคำนวณจันทรคติ
                ให้มีความละเอียดและแม่นยำมากยิ่งขึ้น
            </p>

            <p>
                หากเปรียบมหาพยุหะเป็นโครงสร้างหลักของอาคาร
                จุลพยุหะก็คือการตกแต่งและปรับแต่งรายละเอียด
                เพื่อให้อาคารนั้นสมบูรณ์พร้อมใช้งานจริง
            </p>

        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">

            <h6 class="text-gold-light">
                ● หน้าที่สำคัญของจุลพยุหะ
            </h6>

            <ul class="list-unstyled">

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ปรับค่าความคลาดเคลื่อนของจันทรคติ
                </li>

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ใช้ร่วมกับมหาพยุหะ
                </li>

                <li class="mb-2">
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    เป็นพื้นฐานของสมพยุหะ
                </li>

                <li>
                    <i class="fas fa-check-circle text-warning mr-2"></i>
                    ส่งผลต่อการคำนวณดิถีและวันพระ
                </li>

            </ul>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-history mr-2"></i>
                ที่มาของแนวคิด
            </h5>

            <p>
                ระบบปฏิทินจันทรคติไม่สามารถอาศัยค่าคงที่เพียงค่าเดียวได้
                เพราะการโคจรของดวงจันทร์และดวงอาทิตย์
                มีความซับซ้อนและมีเศษค่าที่ต้องปรับแก้ตลอดเวลา
            </p>

            <p>
                นักปราชญ์โบราณจึงสร้างระบบจุลพยุหะขึ้น
                เพื่อใช้เป็นกลไกปรับละเอียด
                ให้ผลการคำนวณใกล้เคียงกับปรากฏการณ์จริงบนท้องฟ้า
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-cogs mr-2"></i>
                การทำงานร่วมกับมหาพยุหะ
            </h5>

            <p>
                มหาพยุหะและจุลพยุหะ
                ไม่ได้ทำงานแยกจากกัน
                แต่เป็นระบบที่ต้องอาศัยซึ่งกันและกัน
            </p>

            <div class="table-responsive mt-3">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>
                        <tr class="text-gold">
                            <th>องค์ประกอบ</th>
                            <th>หน้าที่</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>มหาพยุหะ</td>
                            <td>คำนวณค่าหลัก</td>
                        </tr>

                        <tr>
                            <td>จุลพยุหะ</td>
                            <td>คำนวณค่าปรับละเอียด</td>
                        </tr>

                        <tr>
                            <td>สมพยุหะ</td>
                            <td>ผลรวมของทั้งสองค่า</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-project-diagram mr-2"></i>
                ลำดับการคำนวณในปักขคณนา
            </h5>

            <div class="table-responsive">

                <table class="table table-sm table-dark text-white-50 border-gold">

                    <thead>

                        <tr class="text-gold">
                            <th>ลำดับ</th>
                            <th>กระบวนการ</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>1</td>
                            <td>มหาพยุหะ</td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>จุลพยุหะ</td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>สมพยุหะ</td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>วิกติ</td>
                        </tr>

                        <tr>
                            <td>5</td>
                            <td>ดิถี</td>
                        </tr>

                        <tr>
                            <td>6</td>
                            <td>วันพระ</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-moon mr-2"></i>
                ความสำคัญต่อการหาดิถี
            </h5>

            <p>
                ดิถีเป็นหัวใจของวันขึ้นและวันแรม
                ซึ่งค่าดิถีที่ถูกต้องจะเกิดขึ้นได้
                ก็ต่อเมื่อมีการคำนวณจุลพยุหะอย่างถูกต้อง
            </p>

            <p>
                ความคลาดเคลื่อนเพียงเล็กน้อย
                อาจส่งผลให้วันพระหรือวันสำคัญทางศาสนา
                เปลี่ยนแปลงไปได้
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-dharmachakra mr-2"></i>
                ความสัมพันธ์กับวันสำคัญทางศาสนา
            </h5>

            <p>
                แม้ประชาชนทั่วไปจะไม่รู้จักจุลพยุหะ
                แต่วันสำคัญทางพระพุทธศาสนาทั้งหมด
                ล้วนผ่านกระบวนการคำนวณที่อาศัยค่าจุลพยุหะทั้งสิ้น
            </p>

            <p>
                ไม่ว่าจะเป็นวันมาฆบูชา
                วิสาขบูชา
                อาสาฬหบูชา
                หรือวันเข้าพรรษา
                ต่างมีความเกี่ยวข้องกับระบบนี้โดยตรง
            </p>

        </section>

        <section class="mb-4">

            <h5 class="text-gold">
                <i class="fas fa-laptop-code mr-2"></i>
                การประยุกต์ใช้ในยุคดิจิทัล
            </h5>

            <p>
                โปรแกรมปฏิทินไทยสมัยใหม่
                และระบบโหราศาสตร์คอมพิวเตอร์
                จำเป็นต้องสร้างโมดูลจุลพยุหะขึ้นมา
                เพื่อให้สามารถคำนวณวันจันทรคติได้อย่างถูกต้อง
            </p>

            <p>
                ในระบบโหราศาสตร์ออนไลน์
                จุลพยุหะจึงเป็นหนึ่งใน Engine เบื้องหลัง
                ที่ผู้ใช้งานไม่เห็น
                แต่มีความสำคัญอย่างยิ่ง
            </p>

        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">

            <h6 class="mb-1">
                <i class="fas fa-lightbulb mr-2"></i>
                เกร็ดความรู้
            </h6>

            <small>
                คำว่า "จุล" แปลว่า เล็ก หรือ ย่อย
                จึงมีความหมายว่า
                พยุหะส่วนย่อยที่ใช้ปรับรายละเอียด
                ให้การคำนวณทางดาราศาสตร์มีความแม่นยำมากขึ้น
            </small>

        </div>

    </div>
    `,

    link: "knowledgePage",
    badge: "badge-secondary"
},
"jakkatheepani_conjunctions": {
    id: "K029",
    category: "ตำราโบราณ",
    title: "🪐 พระเคราะห์อยู่ร่วมราศีเดียวกัน (คัมภีร์จักรทีปนี)",
    type: "คัมภีร์จักรทีปนี",
    level: "ทั่วไป",
    content: `
    <div class="article-rich-content">
        <section class="mb-4">
            <h5 class="text-gold border-bottom-gold pb-2">
                <i class="fas fa-book-reader mr-2"></i>
                คัมภีร์จักรทีปนี ว่าด้วยพระเคราะห์ร่วมราศี
            </h5>
            <p>
                ในวิชาโหราศาสตร์ไทยโบราณ ตาม <b>คัมภีร์จักรทีปนี</b> เรียบเรียงโดย <i>พ.ต.หลวงเสนานุกิจการ (ยง บุญนาค)</i> 
                ได้บันทึกคำทำนายโบราณเมื่อดวงดาวพระเคราะห์โคจรมาสถิตกุมร่วมราศีเดียวกัน 
                ซึ่งส่งผลต่ออุปนิสัย วาสนาบารมี โชคลาภ และข้อควรระวังในชีวิตของเจ้าชะตาอย่างมีนัยสำคัญ
            </p>
        </section>

        <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
            <h6 class="text-gold-light mb-3">
                ● พระเคราะห์กุมร่วมราศีกับพระอาทิตย์ (๑)
            </h6>
            <div class="table-responsive">
                <table class="table table-sm table-dark table-hover text-white-50 border-gold">
                    <thead>
                        <tr class="text-gold">
                            <th style="width: 25%;">คู่ดาวร่วมราศี</th>
                            <th>คำพยากรณ์ตามคัมภีร์จักรทีปนี</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๒<br><small class="text-muted">(อาทิตย์ + จันทร์)</small></td>
                            <td>ผู้นั้นใจดี แต่อายุไม่ยืน เพราะเล่นชู้ มักมีลูกหัวปีตาย เมียมาก เพื่อนมาก นัยน์ตาผิดปกติ <span class="badge badge-danger">ถ้าอยู่เรือนพฤหัสบดี แต่งงานแล้วมีแต่จะเดือดร้อน</span></td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๓<br><small class="text-muted">(อาทิตย์ + อังคาร)</small></td>
                            <td>รู้วิชาการ รู้ธรรมและศิลปศาสตร์ทั้งหลายล้ำลึก มีทรัพย์มาก ไม่กลัวใคร มีกำลังกล้าหาญ มีทิฐิมานะ มีศัตรู ใจร้อนเร็ว มักเกิดเรื่องวุ่นวาย</td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๔<br><small class="text-muted">(อาทิตย์ + พุธ)</small></td>
                            <td>มีศิลปศาสตร์ รู้ธรรมดี เจ้าชู้ พูดมาก กระแสเสียงผิดปกติ มีโรคฟัน ฟันไม่ดี</td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๕<br><small class="text-muted">(อาทิตย์ + พฤหัสบดี)</small></td>
                            <td>มีเครื่องบริโภคมาก ยำเกรงผู้ใหญ่ พอเรียนอะไรรู้ได้</td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๖<br><small class="text-muted">(อาทิตย์ + ศุกร์)</small></td>
                            <td>มักเกิดลาภจะเป็นเจ้าแก่หญิง จะมีของมากแต่บริวารน้อย สึกพระหรือเป็นปาราชิก ตาบอดพิกลหรือตัวพิการสิ่งหนึ่ง</td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๗<br><small class="text-muted">(อาทิตย์ + เสาร์)</small></td>
                            <td>มีข้าหญิงชายมาก ทรัพย์โภชนาหารมาก เมื่อเกิดหรือเล็กๆ ไฟไหม้ หรือมิฉะนั้นตกใจไฟ</td>
                        </tr>
                        <tr>
                            <td class="text-warning font-weight-bold">พระ ๑ และ ๘<br><small class="text-muted">(อาทิตย์ + ราหู)</small></td>
                            <td>ผู้ใหญ่ให้ร้าย มักเดินทาง</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-4">
            <h5 class="text-gold">
                <i class="fas fa-fire mr-2"></i>
                เกณฑ์พิเศษ: พระเคราะห์ ๓ องค์ร่วมราศี
            </h5>
            <div class="alert alert-dark border-warning">
                <b class="text-warning">พระ ๑ ๓ ๗ ร่วมกัน (อาทิตย์ + อังคาร + เสาร์):</b> 
                พ่อตายก่อนแม่ (บิดามักสิ้นก่อนมารดา) เนื่องจากดาวธาตุไฟและบาปเคราะห์ประชุมรวมกันอย่างเข้มข้น
            </div>
        </section>

        <div class="alert alert-gold bg-dark border-gold mt-4">
            <h6 class="mb-1">
                <i class="fas fa-info-circle mr-2"></i>
                เกร็ดโหราจารย์
            </h6>
            <small>
                คำทำนายโบราณสะท้อนพลังธาตุของดวงดาวที่กระทบกันโดยตรงเมื่ออยู่ราศีเดียวกัน 
                อย่างไรก็ตาม ในการอ่านดวงชะตาจริงต้องพิจารณาภพเรือนและมาตรฐานดาว (เกษตร อุจจ์ นิจ ประ) ประกอบร่วมด้วยเสมอ
            </small>
        </div>
    </div>
    `,
    link: "knowledgePage",
    badge: "badge-warning"
},
"kalachakra_wiphak": {
    id: "K016",
    category: "ตำราโบราณ",
    title: "📜 สารานุกรมตำรากาลจักรจรวิภาค (ตัวเสวย-ตัวแทรก & อายุชำระ)",
    type: "กาลจักรจรวิภาค",
    level: "ชั้นสูง (VIP)",
    content: `
    <div class="wiki-container">
        <!-- Wiki Infobox Sidebar -->
        <aside class="wiki-infobox">
            <div class="wiki-infobox-header">
                <div class="wiki-infobox-title">กาลจักรจรวิภาค</div>
                <div class="wiki-infobox-subtitle">Kālacakra Cara Vibhāga</div>
            </div>
            <div class="wiki-infobox-image-box">
                <div style="font-size: 3.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">☸️</div>
                <div class="wiki-infobox-caption">กาลจักรจรวิภาค: คัมภีร์หมุนเวียนแห่งกาลเวลาและวิถีชะตา</div>
            </div>
            <table class="wiki-infobox-table">
                <tbody>
                    <tr><th>ชื่อคัมภีร์</th><td>ตำรากาลจักรจรวิภาค (เล่ม ๒)</td></tr>
                    <tr><th>ผู้เรียบเรียง</th><td>พันตรี หลวงวุฒิรณพัสดุ์</td></tr>
                    <tr><th>สังกัด</th><td>สมาคมโหรแห่งประเทศไทย</td></tr>
                    <tr><th>ประเภทศาสตร์</th><td>โหราศาสตร์ไทยชั้นสูง / วิถีจักรจร</td></tr>
                    <tr><th>โครงสร้างราศี</th><td>๔ จัตวาราศี (นระ, ปัสวะ, อัมพุ, กฎะ)</td></tr>
                    <tr><th>รอบเกณฑ์วัฏจักร</th><td>๒๘, ๔๔, ๕๖, ๒๐ ปี (รวม ๑๔๘ ปี)</td></tr>
                    <tr><th>หัวใจสำคัญ</th><td>ตัวเสวย, ตัวแทรก, อายุชำระ ๒ แถว, เกณฑ์ฆาต</td></tr>
                    <tr><th>ระดับผู้ศึกษา</th><td>โหราจารย์ / สมาชิกระดับเพชร (Diamond)</td></tr>
                    <tr><th>เครื่องมือคำนวณ</th><td><a href="#kalachakraWiphakPage" onclick="navigateTo('kalachakraWiphakPage'); return false;" class="wiki-link">เปิดแผงคำนวณกาลจักรจรวิภาค</a></td></tr>
                </tbody>
            </table>
        </aside>

        <!-- Wiki Main Content Body -->
        <div class="wiki-main-body">
            <!-- Hatnote / Disambiguation notice -->
            <div class="wiki-hatnote">
                <i class="fas fa-info-circle mr-1"></i> บทความนี้ว่าด้วย <strong>ตำรากาลจักรจรวิภาค</strong> ฉบับ พันตรี หลวงวุฒิรณพัสดุ์ สำหรับระบบคำนวณวิถีจรสด ดูที่ <a href="#kalachakraWiphakPage" onclick="navigateTo('kalachakraWiphakPage'); return false;" class="wiki-link">หน้าห้องพยากรณ์กาลจักรจรวิภาค</a>
            </div>

            <!-- Lead Paragraph (Introduction) -->
            <p class="wiki-lead">
                <strong>ตำรากาลจักรจรวิภาค</strong> (อังกฤษ: <em>Kalachakra Cara Wiphak</em>) เป็นมหาคัมภีร์โหราศาสตร์ไทยภาคพยากรณ์วิถีจรชั้นสูง เรียบเรียงโดย <strong>พันตรี หลวงวุฒิรณพัสดุ์</strong> อดีตอุปนายกสมาคมโหรแห่งประเทศไทย โดยเป็นตำราเล่มที่ ๒ สืบต่อจากตำรา <em>กาลจักรลัคน์จร</em> มีจุดเด่นคือการจำแนกการโคจรของดวงชะตาออกเป็นสองระดับ ได้แก่ <strong>"ตัวเสวย"</strong> (รอบใหญ่ประจำช่วงวัย) และ <strong>"ตัวแทรก"</strong> (เหตุการณ์เฉพาะหน้าในแต่ละรอบอายุ) โดยสามารถอ่านผลกระทบชะตาชีวิตได้จบเสร็จสิ้นในตัวจรโดยมิต้องสับสนกับดาวจรภายนอก
            </p>
            <p>
                ในคัมภีร์นี้ได้บัญญัติการคำนวณอายุที่แท้จริงด้วยวิธี <strong>"อายุชำระ ๒ แถว"</strong> อันเป็นระเบียบวิธีทางคณิตศาสตร์ดาราศาสตร์โบราณที่ละเอียดลึกซึ้งถึงระดับปี เดือน วัน ชั่วโมง และนาที รวมถึงการตั้งเกณฑ์เตือนภัยฉุกเฉินผ่าน <strong>"เกณฑ์ฆาตประจำ ๔ จัตวาราศี"</strong> และ <strong>"เกณฑ์ลัคน์ขาด"</strong> ที่แม่นยำจนได้รับการยกย่องเป็นหนึ่งในเสาหลักของโหราศาสตร์ไทย
            </p>

            <!-- Table of Contents (TOC) -->
            <div class="wiki-toc">
                <div class="wiki-toc-title"><i class="fas fa-list-ul mr-2"></i>เนื้อหา</div>
                <ol>
                    <li><a href="#wiki-sec-history" class="wiki-link">๑. ประวัติและความเป็นมา</a></li>
                    <li><a href="#wiki-sec-chatuwa" class="wiki-link">๒. โครงสร้าง ๔ จัตวาราศี และรอบเกณฑ์ปี</a>
                        <ol>
                            <li><a href="#wiki-sec-nara" class="wiki-link">๒.๑ นระราศี (เกณฑ์ ๒๘ ปี)</a></li>
                            <li><a href="#wiki-sec-pasawa" class="wiki-link">๒.๒ ปัสวะราศี (เกณฑ์ ๔๔ ปี)</a></li>
                            <li><a href="#wiki-sec-amphu" class="wiki-link">๒.๓ อัมพุราศี (เกณฑ์ ๕๖ ปี)</a></li>
                            <li><a href="#wiki-sec-kada" class="wiki-link">๒.๔ กฎะราศี (เกณฑ์ ๒๐ ปี)</a></li>
                        </ol>
                    </li>
                    <li><a href="#wiki-sec-mechanism" class="wiki-link">๓. กลไกตัวเสวยและตัวแทรก</a></li>
                    <li><a href="#wiki-sec-chamra" class="wiki-link">๔. วิธีคำนวณอายุชำระ (ตั้งเลข ๒ แถว)</a></li>
                    <li><a href="#wiki-sec-khat" class="wiki-link">๕. เกณฑ์ฆาตบังคับ ๔ ประการ และลัคน์ขาด</a></li>
                    <li><a href="#wiki-sec-cases" class="wiki-link">๖. บันทึกกรณีศึกษาในประวัติศาสตร์</a></li>
                    <li><a href="#wiki-sec-references" class="wiki-link">๗. แหล่งอ้างอิงและบรรณานุกรม</a></li>
                </ol>
            </div>

            <!-- Section 1: ประวัติและความเป็นมา -->
            <h2 id="wiki-sec-history" class="wiki-heading">๑. ประวัติและความเป็นมา</h2>
            <p>
                ในอดีต การพยากรณ์ลัคน์จรของวิชากาลจักรลัคน์จร มักประสบความคลุมเครือเมื่อต้องพยากรณ์เหตุการณ์ย่อยในแต่ละปี โหราจารย์ในอดีตจึงต้องอนุมานหรืออาศัยดาวจรบนฟากฟ้ามาประกอบ ซึ่งหลายครั้งทำให้เกิดความคลาดเคลื่อน พันตรี หลวงวุฒิรณพัสดุ์ จึงได้ค้นคว้าคัมภีร์ดั้งเดิม รวบรวมหลักการจัดสรรสัดส่วนเวลา และเรียบเรียงขึ้นเป็น <em>"ตำรากาลจักรจรวิภาค"</em> เพื่อแจกแจงวิถีการเสวยและการแทรกอย่างเป็นระบบ
            </p>
            <p>
                ตำรานี้ถือเป็นสมบัติทางวิชาการของสมาคมโหรแห่งประเทศไทย มีการตีพิมพ์เผยแพร่ครั้งแรกเพื่อเป็นวิทยาทานแก่นักศึกษาโหราศาสตร์ชั้นสูง และได้รับการยอมรับว่าเป็นแบบเรียนมาตรฐานสำหรับผู้ที่ต้องการพยากรณ์ชะตาชีวิตในระยะยาวระดับ ๐ - ๑๐๐ ปี
            </p>

            <!-- Section 2: โครงสร้าง ๔ จัตวาราศี -->
            <h2 id="wiki-sec-chatuwa" class="wiki-heading">๒. โครงสร้าง ๔ จัตวาราศี และรอบเกณฑ์ปี</h2>
            <p>
                คัมภีร์แบ่ง ๑๒ ราศีในจักรราศีออกเป็น ๔ หมวดหมู่ เรียกว่า <strong>จัตวาราศี</strong> โดยแต่ละหมวดมีจำนวนปีประจำเกณฑ์ (รอบตัวหารกาลจักร) ที่แตกต่างกันอย่างมีนัยสำคัญ:
            </p>
            <div class="table-responsive my-3">
                <table class="wiki-table">
                    <thead>
                        <tr>
                            <th>หมวดจัตวาราศี</th>
                            <th>ความหมาย / สัญลักษณ์</th>
                            <th>ราศีในสังกัด</th>
                            <th>รอบเกณฑ์ (ปี)</th>
                            <th>สภาวะพื้นฐานตามตำรา</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>นระราศี</strong></td>
                            <td>ราศีมนุษย์ (คนยืนสองเท้า)</td>
                            <td>เมถุน, กันย์, ตุลย์, ธนู, กุมภ์ (๕ ราศี)</td>
                            <td><span class="badge badge-success px-2 py-1">๒๘ ปี</span></td>
                            <td>ศุภเคราะห์ มหาโชค เจริญด้วยยศฐาบรรดาศักดิ์</td>
                        </tr>
                        <tr>
                            <td><strong>ปัสวะราศี</strong></td>
                            <td>ราศีสัตว์สี่เท้า</td>
                            <td>เมษ, พฤษภ, สิงห์ (๓ ราศี)</td>
                            <td><span class="badge badge-warning px-2 py-1">๔๔ ปี</span></td>
                            <td>ต้นร้ายปลายดี แรกมีภัยภายหลังเกิดลาภผล</td>
                        </tr>
                        <tr>
                            <td><strong>อัมพุราศี</strong></td>
                            <td>ราศีสัตว์น้ำ (อาพ)</td>
                            <td>กรกฎ, มังกร, มีน (๓ ราศี)</td>
                            <td><span class="badge badge-danger px-2 py-1">๕๖ ปี</span></td>
                            <td>อาภัพผล ระวังโรคภัย พลัดพรากถิ่นฐาน</td>
                        </tr>
                        <tr>
                            <td><strong>กฎะราศี</strong></td>
                            <td>ราศีสัตว์แมลง / แมงป่อง</td>
                            <td>พิจิก (๑ ราศี)</td>
                            <td><span class="badge badge-primary px-2 py-1">๒๐ ปี</span></td>
                            <td>เจ้าขุนมูลนายโปรดปราน ได้ศักดินาและลาภยศ</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 id="wiki-sec-nara" class="wiki-subheading">๒.๑ นระราศี (เกณฑ์ ๒๘ ปี)</h3>
            <p>
                เป็นราศีที่ให้คุณสูงสุดในคัมภีร์ ตำราระบุว่า <em>"เมื่อลัคน์จรตกนระราศี จะได้รับศุภโชค ชัยชนะอันประเสริฐ ได้สามีภริยา ญาติมิตรนำลาภมาให้ ปวงชนพากันมาสรรเสริญบูชา"</em>
            </p>

            <h3 id="wiki-sec-pasawa" class="wiki-subheading">๒.๒ ปัสวะราศี (เกณฑ์ ๔๔ ปี)</h3>
            <p>
                เป็นราศีแห่งการดิ้นรนต่อสู้ ในระยะแรกมักมีโภยภัย รำคาญเคืองใจเรื่องเจ้านายหรือญาติมิตร เปรียบดั่งวิหคจับไม้ไม่เป็นแห่งเดียว แต่ครั้นภายหลังจึงค่อยเกิดลาภผลพูนทวี
            </p>

            <h3 id="wiki-sec-amphu" class="wiki-subheading">๒.๓ อัมพุราศี (เกณฑ์ ๕๖ ปี)</h3>
            <p>
                ถือเป็นเกณฑ์ที่ต้องสุขุมรอบคอบที่สุด มักอาภัพผล เสี่ยงต่อการเจ็บไข้ได้ป่วย เหน็บชา หรือพลัดพรากจากเหย้าเรือนและบริวาร เว้นแต่ลัคน์จรจะเดินเข้าสู่ภพสุภะ ลาภผลจึงงอกงาม
            </p>

            <h3 id="wiki-sec-kada" class="wiki-subheading">๒.๔ กฎะราศี (เกณฑ์ ๒๐ ปี)</h3>
            <p>
                มีเพียงราศีเดียวคือราศีพิจิก ให้ผลเด่นชัดด้านอำนาจราชศักดิ์ เจ้านายผู้ใหญ่มอบความไว้วางใจ มั่งคั่งด้วยทรัพย์สินไร่นาและข้าทาสบริวาร
            </p>

            <!-- Section 3: กลไกตัวเสวยและตัวแทรก -->
            <h2 id="wiki-sec-mechanism" class="wiki-heading">๓. กลไกตัวเสวยและตัวแทรก</h2>
            <p>
                หัวใจของการพยากรณ์กาลจักรจรวิภาคคือการผสานความสัมพันธ์ระหว่าง <strong>"ตัวเสวย"</strong> และ <strong>"ตัวแทรก"</strong>:
            </p>
            <ul>
                <li><strong>ลัคน์จรตัวเสวย:</strong> คือราศีที่ลัคน์จรโคจรเข้าไปสถิตตามรอบใหญ่ (นับจากเกณฑ์ปีประจำจัตวาราศี) ทำหน้าที่เป็น "ฉากหลัง" หรือ "โครงสร้างวาสนาหลัก" ในช่วงวัยนั้น</li>
                <li><strong>ลัคน์จรตัวแทรก:</strong> คือการซอยย่อยระยะเวลาของตัวเสวยออกเป็น ๑๒ ส่วนตามสัดส่วนคณิตศาสตร์ โดยมีดาวเกษตรเจ้าเรือนของราศีแทรกเป็นผู้กำกับเหตุการณ์เฉพาะหน้าในแต่ละช่วงเดือนและปี</li>
            </ul>

            <!-- Section 4: วิธีคำนวณอายุชำระ -->
            <h2 id="wiki-sec-chamra" class="wiki-heading">๔. วิธีคำนวณอายุชำระ (ตั้งเลข ๒ แถว)</h2>
            <p>
                การคำนวณตามตำรับของ พันตรี หลวงวุฒิรณพัสดุ์ มิได้ใช้อายุตามปีปฏิทินสุริยคติธรรมดา แต่ใช้การคำนวณแบบ <strong>"อายุชำระ ๒ แถว"</strong>:
            </p>
            <div class="wiki-quote">
                <strong>หลักเกณฑ์การตั้งเลข ๒ แถว:</strong><br>
                • <em>แถวบน (เวลาเหลือในปีกำเนิด):</em> คำนวณจากเวลาเกิดจนถึงสิ้นปีนักษัตร/จันทรคติเดิม<br>
                • <em>แถวล่าง (เวลาที่ผ่านไปในปีประสงค์):</em> คำนวณจากต้นปีนักษัตรจนถึงวันเวลาที่ต้องการพยากรณ์<br>
                • นำทั้งสองแถวมารวมกัน แล้ว <strong>"หักออก ๑ ปีชำระ"</strong> จึงจะได้อายุชำระสุทธิที่ถูกต้อง ละเอียดถึงระดับ วัน ชั่วโมง และนาที
            </div>

            <!-- Section 5: เกณฑ์ฆาตบังคับ ๔ ประการ -->
            <h2 id="wiki-sec-khat" class="wiki-heading">๕. เกณฑ์ฆาตบังคับ ๔ ประการ และลัคน์ขาด</h2>
            <p>
                คัมภีร์ระบุคำเตือนสำคัญยิ่งไว้ว่า: <em>"การพยากรณ์ราศีกาลจักรเสวยและแทรกจะทายว่าดีได้แท้จริงก็ต่อเมื่ออายุไม่ถูกฆาต หากอายุต้องเกณฑ์ฆาตเมื่อใด แม้ราศีเสวยและแทรกจะดีสักปานใด ห้ามด่วนพยากรณ์ว่าดีเด็ดขาด"</em>
            </p>
            <div class="table-responsive my-3">
                <table class="wiki-table">
                    <thead>
                        <tr>
                            <th>ชื่อเกณฑ์ฆาต</th>
                            <th>ราศีที่ลัคน์จรตก</th>
                            <th>ดาวที่จรมาต้อง / ทับ</th>
                            <th>ผลร้ายและข้อพึงระวัง</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>ปัสวะชีโว</strong></td>
                            <td>ปัสวะ (เมษ, พฤษภ, สิงห์)</td>
                            <td>พระพฤหัสบดี (๕)</td>
                            <td>อันตรายถึงชีวิต เสียทรัพย์สิน เกียรติยศมัวหมอง</td>
                        </tr>
                        <tr>
                            <td><strong>นระโสโร</strong></td>
                            <td>นระ (เมถุน, กันย์, ตุลย์, ธนู, กุมภ์)</td>
                            <td>พระเสาร์ (๗)</td>
                            <td>เคราะห์หนัก สังขารทรุดโทรม อันตรายถึงชีวิตฉับพลัน</td>
                        </tr>
                        <tr>
                            <td><strong>อัมพุภูมโม</strong></td>
                            <td>อัมพุ (กรกฎ, มังกร, มีน)</td>
                            <td>พระอังคาร (๓)</td>
                            <td>อุบัติเหตุรุนแรง เลือดตกยางออก ผ่าตัด ไฟไหม้</td>
                        </tr>
                        <tr>
                            <td><strong>กฎะอสุรินโท</strong></td>
                            <td>กฎะ (พิจิก)</td>
                            <td>พระราหู (๘)</td>
                            <td>คดีความอื้อฉาว ถูกทรยศหักหลัง หรือภัยถึงชีวิต</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                นอกจากเกณฑ์ฆาต ๔ ประการแล้ว ยังมี <strong>"เกณฑ์ลัคน์ขาด"</strong> กล่าวคือ เมื่อลัคนากำเนิดอยู่ในราศีนระ แล้วลัคน์จรเดินไปตกในราศีอัมพุ พร้อมมีดาวบาปเคราะห์ (๑, ๓, ๕, ๗, ๘) จรมาต้อง เรียกว่าลัคน์ขาด หากเจ็บป่วยจะรักษายาก และอาจพลัดพรากจากถิ่นกำเนิด
            </p>

            <!-- Section 6: บันทึกกรณีศึกษาในประวัติศาสตร์ -->
            <h2 id="wiki-sec-cases" class="wiki-heading">๖. บันทึกกรณีศึกษาในประวัติศาสตร์</h2>
            <p>
                ในคัมภีร์ได้บันทึกดวงชะตาจริงไว้พิสูจน์ความแม่นยำ ๒ กรณีสำคัญ:
            </p>
            <ol>
                <li><strong>กรณีศึกษา พันตรี หลวงวุฒิรณพัสดุ์ (ผู้เขียน):</strong> เกิดวันพฤหัสบดี เดือน ๑๐ ปีกุน จ.ศ. ๑๒๔๗ ลัคนาสถิตราศีธนู (๑๓ องศา ๑๗ ลิบดา) ในวัยอายุชำระ ๒๒ ปี ลัคน์จรตัวเสวยตกราศีพิจิก (กฎะ) และตัวแทรกตกราศีกรกฎ (อัมพุ) ได้รับพระราชทานยศและศักดินาตามคำทำนายตัวเสวย แต่ต้องเหน็ดเหนื่อยเจ็บป่วยตามเกณฑ์ตัวแทรก</li>
                <li><strong>กรณีศึกษา พันเอก หลวงธรณ์นิติญาณ:</strong> ชะตาต้อง <em>เกณฑ์ฆาตนระโสโร</em> (ลัคน์จรตกราศีนระ ถูกพระเสาร์จรมาทับ) ประกอบกับลัคน์จรทับลัคนากำเนิดเดิม นำไปสู่การถึงแก่อนิจกรรมตรงตามเวลาที่คัมภีร์คำนวณไว้ทุกประการ</li>
            </ol>

            <!-- Section 7: แหล่งอ้างอิงและบรรณานุกรม -->
            <h2 id="wiki-sec-references" class="wiki-heading">๗. แหล่งอ้างอิงและบรรณานุกรม</h2>
            <div class="wiki-references">
                <ol>
                    <li>หลวงวุฒิรณพัสดุ์, พันตรี. (๒๔๙๕). <em>ตำรากาลจักรจรวิภาค (เล่ม ๒)</em>. สมาคมโหรแห่งประเทศไทย.</li>
                    <li>สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>ประมวลคัมภีร์โหราศาสตร์ไทยโบราณ</em>.</li>
                    <li>ระบบคำนวณกาลจักรจรวิภาค สยามโหรามงคล. เข้าถึงได้จาก <a href="#kalachakraWiphakPage" onclick="navigateTo('kalachakraWiphakPage'); return false;" class="wiki-link">หน้ากาลจักรจรวิภาคดิจิทัล</a></li>
                </ol>
            </div>
        </div>
    </div>
    `,
    link: "kalachakraWiphakPage",
    badge: "badge-warning",
    references: [
        "หลวงวุฒิรณพัสดุ์, พันตรี. (๒๔๙๕). <em>ตำรากาลจักรจรวิภาค (เล่ม ๒)</em>. สมาคมโหรแห่งประเทศไทย.",
        "สมาคมโหรแห่งประเทศไทย ในพระบรมราชินูปถัมภ์. <em>ประมวลคัมภีร์โหราศาสตร์ไทยโบราณ</em>.",
        "ระบบคำนวณกาลจักรจรวิภาค สยามโหรามงคล. เข้าถึงได้จาก <a href=\"#kalachakraWiphakPage\" onclick=\"navigateTo('kalachakraWiphakPage'); return false;\" class=\"wiki-link\">หน้ากาลจักรจรวิภาคดิจิทัล</a>"
    ]
},
"twelve_houses": {
    id: "K031",
    category: "โหราศาสตร์",
    title: "🏛️ ภพทั้ง ๑๒ (ทวาทศภพ) แห่งดวงชะตา",
    type: "หลักการพยากรณ์จักรราศี",
    level: "ชั้นกลาง - ชั้นสูง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-landmark mr-2"></i>นิยามและความสำคัญของทวาทศภพ</h5>
                <p><b>ภพทั้ง ๑๒ (Twelve Astrological Houses)</b> ในวิชาโหราศาสตร์ไทย คือการแบ่งวงกลมจักรราศี ๓๖๐ องศาออกเป็น ๑๒ ส่วนเท่าๆ กัน โดยมี <b>"ลัคนา" (จุดตัดขอบฟ้าทิศตะวันออกขณะกำเนิด)</b> เป็นจุดเริ่มต้นของภพที่ ๑ แต่ละภพเป็นตัวแทนมิติชีวิตตั้งแต่กำเนิดจนสิ้นอายุขัย</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● รายละเอียดความหมายของภพ ๑–๑๒</h6>
                <div class="table-responsive mt-2">
                    <table class="table table-sm table-dark text-white-50">
                        <thead>
                            <tr class="text-gold"><th>ภพ</th><th>ชื่อมคธ</th><th>ความหมายหลัก</th><th>เกณฑ์คุณ-โทษ</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>ภพที่ ๑</td><td><b>ตนุ</b></td><td>ตัวตน วาสนา ร่างกาย สุขภาพ อุปนิสัยใจคอ</td><td>เกณฑ์เกษตร-เกณฑ์นำ</td></tr>
                            <tr><td>ภพที่ ๒</td><td><b>กดุมภะ</b></td><td>ทรัพย์สิน สมบัติ เงินสด แหล่งรายได้ ความมั่งคั่ง</td><td>ภพศุภะเกื้อกูล</td></tr>
                            <tr><td>ภพที่ ๓</td><td><b>สหัชชะ</b></td><td>พี่น้อง มิตรสหาย การเดินทางใกล้ การติดต่อเจรจา</td><td>อุปจยะ (เติบโตตามวัย)</td></tr>
                            <tr><td>ภพที่ ๔</td><td><b>พันธุ</b></td><td>ครอบครัว บรรพบุรุษ บ้าน ที่ดิน ยานพาหนะ จิตใจ</td><td>เกณฑ์จตุรเกณฑ์ (มั่นคง)</td></tr>
                            <tr><td>ภพที่ ๕</td><td><b>ปุตตะ</b></td><td>บุตร บริวาร ความคิดสร้างสรรค์ โชคลาภ เสี่ยงดวง</td><td>ตรีโกณเกณฑ์ (มงคลยิ่ง)</td></tr>
                            <tr><td>ภพที่ ๖</td><td><b>อริ</b></td><td>ศัตรู อุปสรรค หนี้สิน โรคภัย การต่อสู้คดีความ</td><td>ทุสถานภพ (ควรระวัง)</td></tr>
                            <tr><td>ภพที่ ๗</td><td><b>ปัตนิ</b></td><td>คู่ครอง หุ้นส่วน คู่สัญญา ฝ่ายตรงข้าม การสมรส</td><td>เกณฑ์จตุรเกณฑ์</td></tr>
                            <tr><td>ภพที่ ๘</td><td><b>มรณะ</b></td><td>ความตาย การสูญเสีย มรดก ต่างแดน ความเร้นลับ</td><td>ทุสถานภพ (ควรระวัง)</td></tr>
                            <tr><td>ภพที่ ๙</td><td><b>ศุภะ</b></td><td>คุณงามความดี ผู้ใหญ่ ความเจริญ การศึกษา ศาสนา</td><td>ตรีโกณเกณฑ์ (มงคลสูงสุด)</td></tr>
                            <tr><td>ภพที่ ๑๐</td><td><b>กัมมะ</b></td><td>การงาน อาชีพ เกียรติยศ ภาระหน้าที่ ผลงาน</td><td>เกณฑ์จตุรเกณฑ์</td></tr>
                            <tr><td>ภพที่ ๑๑</td><td><b>ลาภะ</b></td><td>โชคลาภ ผลประโยชน์ ความสำเร็จ มิตรภาพอุปถัมภ์</td><td>อุปจยะ (ผลตอบแทน)</td></tr>
                            <tr><td>ภพที่ ๑๒</td><td><b>วินาศ</b></td><td>การสูญสิ้น เบื้องหลัง การปิดบัง ขังคุก ความลับ</td><td>ทุสถานภพ (ควรระวัง)</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-balance-scale mr-2"></i>ทุสถานภพ และ จตุรเกณฑ์</h5>
                <p>ในบรรดา ๑๒ ภพ โหราศาสตร์ไทยจัดกลุ่มภพที่มีความสำคัญยิ่งยวด ๒ กลุ่ม:</p>
                <ul>
                    <li><b>จตุรเกณฑ์ (ภพที่ ๑, ๔, ๗, ๑๐):</b> เปรียบเสมือนเสาหลัก ๔ ต้นของเรือนดวงชะตา หากดาวศุภเคราะห์ครองหรือสัมพันธ์ถึง มักเป็นคนตั้งหลักปักฐานได้อย่างมั่นคงถาวร</li>
                    <li><b>ทุสถานภพ (ภพที่ ๖ อริ, ๘ มรณะ, ๑๒ วินาศ):</b> ภพแห่งอุปสรรคและกรรมเก่า หากดาวบาปเคราะห์สถิต มักสร้างความเสียหาย แต่หากดาวศุภเคราะห์ที่ตกภพเหล่านี้อาจถูกทอนกำลัง หรือกลับกลายเป็นผู้แก้ปัญหาเชี่ยวชาญ</li>
                </ul>
            </section>
        </div>
    `,
    link: "twelveHousesPage",
    badge: "badge-primary",
    references: [
        "พระยาโหราธิบดี. (ฉบับพิมพ์สมโภชพระนคร). <em>คัมภีร์จักรทีปนีและทวาทศภพพยากรณ์</em>.",
        "สิงห์โต ปุกหุต. (๒๕๒๓). <em>คัมภีร์โหราศาสตร์ไทยฉบับสมบูรณ์</em>. สำนักพิมพ์เกษมบรรณกิจ.",
        "อาจารย์อรุณ ลัมเพ็ญ (หมอเถา). <em>หลักการพยากรณ์ภพและตนุเศษ</em>. ชมรมโหรไทย."
    ]
},
"gun_milan": {
    id: "K032",
    category: "โหราศาสตร์",
    title: "❤️ อัษฏกูฏ / คุณมิฬาน (Gun Milan) ๓๖ ประการ",
    type: "โหราศาสตร์วิวาห์มงคล",
    level: "ชั้นสูง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-heart mr-2"></i>ที่มาของระบบสมพงษ์ชั้นสูง</h5>
                <p><b>คุณมิฬาน (Gun Milan)</b> หรือ <b>อัษฏกูฏพยากรณ์ (Ashtakoota)</b> เป็นศาสตร์การตรวจดวงสมพงษ์คู่ครองขั้นสูงจากคัมภีร์พระเวทภารตะ มีการคำนวณคะแนนเต็ม <b>๓๖ คะแนน (๓๖ คุณ)</b> โดยอาศัยตำแหน่งของ <i>พระจันทร์เสวยนักษัตรฤกษ์ (Janma Nakshatra)</i> และราศีเกิดของทั้งคู่</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● เสาหลัก ๘ ประการ (อัษฏกูฏ) และคะแนน</h6>
                <ol>
                    <li><b>วรรณะกูฏ (Varna Koot - ๑ คะแนน):</b> ตรวจความเข้ากันได้ด้านอัตตา จิตวิญญาณ และการยอมรับทางสังคม</li>
                    <li><b>วศยะกูฏ (Vashya Koot - ๒ คะแนน):</b> ตรวจเสน่ห์ดึงดูด อำนาจการโน้มน้าว และความภักดีต่อกัน</li>
                    <li><b>ตาระกูฏ (Tara Koot - ๓ คะแนน):</b> สุขภาพ ความปลอดภัย และการคุ้มครองโชคชะตาร่วมกัน</li>
                    <li><b>โยนิกูฏ (Yoni Koot - ๔ คะแนน):</b> ความเข้ากันได้ทางสรีระ ความสัมพันธ์ทางเพศ และสัญชาตญาณสัตว์ประจำฤกษ์</li>
                    <li><b>เคราะห์ไมตรี (Graha Maitri - ๕ คะแนน):</b> ความเข้ากันได้ของดาวเจ้าเรือนจันทร์ (จิตใจ, มุมมองชีวิต, มิตรภาพ)</li>
                    <li><b>คณะกูฏ (Gana Koot - ๖ คะแนน):</b> พื้นเพอารมณ์และจริยธรรม แบ่งเป็น เทวะ, มนุษย์, รากษส</li>
                    <li><b>ภกูฏ (Bhakoot - ๗ คะแนน):</b> ความรุ่งเรือง มั่งคั่ง มรดกครอบครัว และการมีบุตรสืบสกุล</li>
                    <li><b>นาฑีกูฏ (Nadi Koot - ๘ คะแนน):</b> สุขภาพพันธุกรรม อายุขัย และพลังงานชี่ (ลมปราณวาตะ-ปิตตะ-เสมหะ)</li>
                </ol>
            </section>
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-chart-pie mr-2"></i>เกณฑ์การแปลผลคะแนนรวม</h5>
                <ul>
                    <li><b>๓๒–๓๖ คะแนน:</b> ดีเลิศยิ่ง (Uttama) พบคู่แท้หนุนนำดวงชะตาสูงสุด</li>
                    <li><b>๒๔–๓๑ คะแนน:</b> ดีมาก (Madhyama-Uttama) ครองเรือนราบรื่น สำเร็จในชีวิตคู่</li>
                    <li><b>๑๘–๒๓ คะแนน:</b> ปานกลาง (Madhyama) ผ่านเกณฑ์แต่งงานได้ แต่ต้องปรับตัวเข้าหากัน</li>
                    <li><b>ต่ำกว่า ๑๘ คะแนน:</b> ต่ำกว่าเกณฑ์ (Adhama) เสี่ยงต่อความขัดแย้ง แนะนำให้ทำพิธีแก้เคล็ดหรือพิจารณาอย่างรอบคอบ</li>
                </ul>
            </section>
        </div>
    `,
    link: "marriage-compatibility",
    badge: "badge-danger",
    references: [
        "Sage Parasara. <em>Brihat Parasara Hora Sastra (BPHS)</em>, Marriage Chapter.",
        "BV Raman. (1986). <em>Muhurtha or Electional Astrology</em>. Raman Publications, Bangalore.",
        "สมาคมโหรนานาชาติ. <em>หลักเกณฑ์การพิจารณาสมพงษ์วิวาห์มงคล อัษฏกูฏ</em>."
    ]
},
"nine_auspicious_gemstones": {
    id: "K033",
    category: "วิถีสิริมงคล",
    title: "💎 นวรัตน์ : คัมภีร์อัญมณีเสริมสิริราชันย์ ๙ ประการ",
    type: "โหราศาสตร์อัญมณีและดาวนพเคราะห์",
    level: "ทั่วไป - ชั้นกลาง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-gem mr-2"></i>อิทธิพลของนวรัตน์ตามคัมภีร์มหาพุทธาภิเษก</h5>
                <p><b>นพรัตน์</b> หรือ <b>นวรัตน์ (The Nine Gems)</b> คือแก้ว ๙ ชนิดอันเป็นมงคลสูงสุดของแผ่นดินสยาม สัมพันธ์โดยตรงกับพลังจักรวาลของดาวนพเคราะห์ทั้ง ๙ ดวง โบราณจารย์เชื่อว่าผู้ใดประดับอัญมณีครบทั้งเก้า จะคุ้มครองป้องกันภัยพิบัติ และดึงดูดมหิธยานุภาพมหาศาล</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● โคลงกลอนโบราณพรรณนานพรัตน์</h6>
                <blockquote style="font-style: italic; color: #fde047;">
                    "เพชรดี มณีแดง เขียวใสแสงมรกต<br>
                    เหลืองใสบุษราคัม แดงแก่ก่ำโกเมนเอก<br>
                    สีหมอกเมฆนิลกาฬ มุกดาหารหมอกมัว<br>
                    แดงสลัวเพทาย สังวาลสายไพฑูรย์"
                </blockquote>
                <div class="table-responsive mt-3">
                    <table class="table table-sm table-dark text-white-50">
                        <thead>
                            <tr class="text-gold"><th>อัญมณี</th><th>ดาวนพเคราะห์</th><th>คุณประโยชน์และอำนาจหนุนดวง</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><b>เพชร (Diamond)</b></td><td>พระศุกร์ (๖)</td><td>มหาเสน่ห์ อำนาจ เกียรติยศ ชนะศัตรู ความบริสุทธิ์</td></tr>
                            <tr><td><b>ทับทิม / มณีแดง (Ruby)</b></td><td>พระอาทิตย์ (๑)</td><td>ตบะ เดชะ บารมี ผู้นำ สุขภาพแข็งแรง</td></tr>
                            <tr><td><b>มรกต (Emerald)</b></td><td>พระพุธ (๔)</td><td>วาจาศักดิ์สิทธิ์ ปัญญา การค้าขาย ความรู้ความจำ</td></tr>
                            <tr><td><b>บุษราคัม (Yellow Sapphire)</b></td><td>พระพฤหัสบดี (๕)</td><td>ความรู้ ธรรมะ โชคลาภ ผู้ใหญ่อุปถัมภ์ เมตตามหานิยม</td></tr>
                            <tr><td><b>โกเมน (Garnet)</b></td><td>พระราหู (๘)</td><td>คุ้มครองการเดินทาง ป้องกันคุณไสย ชนะอุปสรรค</td></tr>
                            <tr><td><b>ไพลิน / นิลกาฬ (Blue Sapphire)</b></td><td>พระเสาร์ (๗)</td><td>ความอดทน ทรัพย์สินมั่นคง ที่ดิน กิจการระยะยาว</td></tr>
                            <tr><td><b>มุกดาหาร (Moonstone)</b></td><td>พระจันทร์ (๒)</td><td>ความร่มเย็น อารมณ์สงบ เมตตามหานิยม คนรักใคร่</td></tr>
                            <tr><td><b>เพทาย (Zircon)</b></td><td>พระอังคาร (๓)</td><td>ความกล้าหาญ ขยันขันแข็ง ชนะการแข่งขัน ป้องกันโรคภัย</td></tr>
                            <tr><td><b>ไพฑูรย์ / ตาแมว (Chrysoberyl Cat's Eye)</b></td><td>พระเกตุ (๙)</td><td>หยั่งรู้ล่วงหน้า ลางสังหรณ์ แคล้วคลาด เทพารักษ์ปกป้อง</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    link: "knowledgePage",
    badge: "badge-warning",
    references: [
        "พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว. <em>พระราชพิธีสิบสองเดือน (หมวดเครื่องราชอิสริยาภรณ์อันเป็นสิริโบราณมงคลนพรัตนราชวราภรณ์)</em>.",
        "กรมศิลปากร. (๒๕๔๒). <em>อัญมณีและเครื่องประดับโบราณในราชสำนักไทย</em>.",
        "คัมภีร์รัตนปกรณ์โบราณ. หอสมุดแห่งชาติ กรมศิลปากร."
    ]
},
"auspicious_directions_fengshui": {
    id: "K034",
    category: "ฮวงจุ้ย",
    title: "🧭 มหาทิศมงคล ๘ ทิศและหลักชัยภูมิเสือขาว-มังกรเขียว",
    type: "ฮวงจุ้ยและชัยภูมิศาสตร์",
    level: "ทั่วไป - ชั้นกลาง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-compass mr-2"></i>สัจธรรมแห่งชัยภูมิธรรมชาติ (เสือขาว มังกรเขียว เต่าดำ หงส์แดง)</h5>
                <p>วิชาชัยภูมิศาสตร์โบราณเปรียบที่อยู่อาศัยเป็นร่างกายของมนุษย์ และทิศทั้ง ๔ รอบตัวเป็นสัตว์เทพประจำทิศผู้ปกปักรักษาพลังงานชี่ (Qi) ดังนี้:</p>
                <ul>
                    <li><b>ด้านหลัง (เต่าดำ / เสวียนอู่):</b> ต้องมีความมั่นคง เป็นเนินสูงหรืออาคารใหญ่ เปรียบเหมือนมีหลังพิงหนุนหลังมั่นคง ไม่ถูกแทงข้างหลัง</li>
                    <li><b>ด้านหน้า (หงส์แดง / จูเชวี่ย):</b> ต้องเปิดโล่ง สว่างไสว มีลานรับพลังงาน (เหม่งตึ๊ง) นำพาชื่อเสียงและโอกาสทางธุรกิจเข้ามา</li>
                    <li><b>ด้านซ้าย (มังกรเขียว / ชิงหลง):</b> ตัวแทนพลังหยาง บารมี อำนาจ และเพศชาย ควรสูงกว่าด้านขวา มีการเคลื่อนไหวของน้ำหรือทางสัญจร</li>
                    <li><b>ด้านขวา (เสือขาว / ไป๋หู่):</b> ตัวแทนพลังหยิน ความสงบ นิ่ง และเพศหญิง ควรต่ำกว่าด้านซ้ายเพื่อป้องกันการข่มขวัญกัน</li>
                </ul>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● ทิศมงคล ๘ ทิศประจำยุค ๙ (พ.ศ. ๒๕๖๗ – ๒๕๘๗)</h6>
                <p>ในศาสตร์ฮวงจุ้ยดาวเหิน (Xuan Kong Flying Stars) ปัจจุบันโลกเข้าสู่ <b>ยุค ๙ (ธาตุไฟ - กว้าหลี่)</b> ทิศมงคลหลักที่ส่งผลต่อความมั่งคั่งและเทคโนโลยี ได้แก่:</p>
                <ol>
                    <li><b>ทิศใต้ (ธาตุไฟ):</b> ทิศประธานประจำยุค ๙ เสริมเกียรติยศ ชื่อเสียง นวัตกรรม ปัญญา และความโด่งดัง</li>
                    <li><b>ทิศเหนือ (ธาตุน้ำ):</b> ทิศคู่สมพงษ์ขั้วตรงข้าม ดึงดูดทรัพย์สมบัติและเงินสดไหลเวียนคล่องตัว</li>
                    <li><b>ทิศตะวันตกเฉียงใต้ (ธาตุดิน):</b> เสริมสุขภาพสตรี ครอบครัวร่มเย็น และการถือครองอสังหาริมทรัพย์</li>
                </ol>
            </section>
        </div>
    `,
    link: "fengShuiPage",
    badge: "badge-info",
    references: [
        "กัวผู่ (Guo Pu). <em>คัมภีร์ฝังศพและชัยภูมิ (Zang Shu / Book of Burial)</em>.",
        "หยางอวิ๋นซง (Yang Yun Song). <em>คัมภีร์มังกรสั่นสะเทือนดิน (Han Long Jing)</em>.",
        "อาจารย์วิศิษฏ์ เตชะเกษม. (๒๕๕๕). <em>สารานุกรมฮวงจุ้ยไทย-จีนร่วมสมัย</em>."
    ]
},
"daily_planetary_hours": {
    id: "K035",
    category: "ฤกษ์ยาม",
    title: "⏰ ศาสตร์แห่งยามกลางวัน-กลางคืน และยามอุบากอง",
    type: "ฤกษ์ยามพิชัยสงคราม",
    level: "ชั้นกลาง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-clock mr-2"></i>ที่มาของยามอุบากอง</h5>
                <p><b>ยามอุบากอง</b> เป็นวิชายามพิชัยสงครามโบราณที่มีตำนานเล่าขานสืบต่อกันมาตั้งแต่สมัยรัชกาลที่ ๑ แห่งกรุงรัตนโกสินทร์ จากแม่ทัพพม่าชื่อ <i>"อุบากอง"</i> ผู้ตกเป็นเชลยศึก และได้ถ่ายทอดวิชาการคำนวณยามปลอด ยามดี ยามร้าย โดยใช้สัญลักษณ์วงกลม ๑-๕ จุด</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● โคลงกลอนโบราณท่องจำยามอุบากอง</h6>
                <blockquote style="font-style: italic; color: #6ee7b7;">
                    "ศูนย์หนึ่งอย่าพึงจร แม้ราษฎรจะอัปรา<br>
                    สองศูนย์เร่งสัญจร จะพบลาภมีคณนา<br>
                    ปลอดศูนย์พูนสวัสดิ์ ภัยพิบัติบ่บีฑา<br>
                    สี่ศูนย์จะพบพา อริร้ายบ่มิแคล้ว<br>
                    กาจักรร้ายแรงนัก ถึงม้วยมักมิคลาดแคล้ว<br>
                    เร่งตรวจตามยามแล้ว จึงยาตราสุขารมณ์"
                </blockquote>
            </section>
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-table mr-2"></i>การแบ่งช่วงเวลายามทั้ง ๕ ช่วง</h5>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50">
                        <thead><tr class="text-gold"><th>ยามที่</th><th>เวลากลางวัน</th><th>เวลากลางคืน</th><th>ความหมายประจำสัญลักษณ์</th></tr></thead>
                        <tbody>
                            <tr><td>ยาม ๑</td><td>06:01 – 08:24 น.</td><td>18:01 – 20:24 น.</td><td>ตรวจจุดตามตารางวัน (อาทิตย์ ถึง เสาร์)</td></tr>
                            <tr><td>ยาม ๒</td><td>08:25 – 10:48 น.</td><td>20:25 – 22:48 น.</td><td><b>๒ ศูนย์ (••):</b> มีลาภมาก เหมาะเดินทางเจรจาค้าขาย</td></tr>
                            <tr><td>ยาม ๓</td><td>10:49 – 13:12 น.</td><td>22:49 – 01:12 น.</td><td><b>ปลอดศูนย์:</b> ราบรื่น แคล้วคลาด ปราศจากศัตรู</td></tr>
                            <tr><td>ยาม ๔</td><td>13:13 – 15:36 น.</td><td>01:13 – 03:36 น.</td><td><b>๔ ศูนย์ (••••):</b> อัปมงคล ห้ามเคลื่อนทัพหรือเจรจาสำคัญ</td></tr>
                            <tr><td>ยาม ๕</td><td>15:37 – 18:00 น.</td><td>03:37 – 06:00 น.</td><td><b>กาบาท (กากบาท):</b> ยามอุบาทว์ร้ายแรงที่สุด ควรงดเว้นเด็ดขาด</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    link: "ubakong-yarm",
    badge: "badge-success",
    references: [
        "สมเด็จพระมหาสมณเจ้า กรมพระปรมานุชิตชิโนรส. <em>ตำราพิชัยสงครามและยามยาตราทัพ</em>.",
        "พระยาปริยัติธรรมธาดา (แพ ตาละลักษมณ์). (๒๔๖๕). <em>ตำรายามอุบากองฉบับหลวง</em>. โรงพิมพ์ไทย.",
        "หอสมุดดำรงราชานุภาพ. <em>จดหมายเหตุโบราณคดีเรื่องยามพม่าแปลง</em>."
    ]
},
"seven_digits_four_bases": {
    id: "K036",
    category: "เลขศาสตร์",
    title: "🔢 คัมภีร์สัตตเลข (เลข ๗ ตัว ๔ ฐาน) พิสดาร",
    type: "เลขศาสตร์ดวงกำเนิด",
    level: "ชั้นสูง",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-layer-group mr-2"></i>โครงสร้างจักรราศีแบบ ๗ ตัว ๔ ฐาน</h5>
                <p><b>วิชาเลข ๗ ตัว (Sattalek)</b> เป็นมรดกทางโหราศาสตร์ไทยแท้ที่แม่นยำลึกซึ้ง คำนวณโดยใช้ ๓ ปัจจัยหลักแห่งกำเนิด:</p>
                <ul>
                    <li><b>ฐานที่ ๑ (แถววันเกิด):</b> อัตตา, หินะ, ธะนัง, ปิตา, มาตา, โภคา, มัชฌิมา</li>
                    <li><b>ฐานที่ ๒ (แถวเดือนเกิด):</b> ตนุ, กระดุมภะ, สหัชชะ, พันธุ, ปุตตะ, อริ, ปัตนิ</li>
                    <li><b>ฐานที่ ๓ (แถวปีนักษัตร):</b> มรณะ, สุภะ, กัมมะ, ลาภะ, พยายะ, ทาสา, ทาสี</li>
                    <li><b>ฐานที่ ๔ (ฐานกำลังพระเคราะห์ / กำลังเทวดา):</b> ผลรวมของแถว ๑ + แถว ๒ + แถว ๓ เป็นฐานสำคัญที่สุดในการชี้ขาดโชคชะตา</li>
                </ul>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● ถอดรหัสฐานที่ ๔ (กำลังพระเคราะห์ยอดนิยม)</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50">
                        <thead><tr class="text-gold"><th>ผลบวก</th><th>กำลังดาว</th><th>คำทำนายโดยย่อ</th></tr></thead>
                        <tbody>
                            <tr><td>กำลัง ๗</td><td>เสาร์บริสุทธิ์</td><td>ชีวิตสมบุกสมบัน มีความอดทนสูง เป็นผู้นำที่กรำศึกหนัก</td></tr>
                            <tr><td>กำลัง ๑๐</td><td>กำลังพระเสาร์มหาราช</td><td>เหนื่อยยากก่อนจึงสำเร็จ มั่งคั่งในบั้นปลาย ใจนักเลง</td></tr>
                            <tr><td>กำลัง ๑๒</td><td>กำลังพระราหู</td><td>พลิกแพลงเก่ง เอาตัวรอดได้ทุกสถานการณ์ มีโชคลาภแบบไม่คาดฝัน</td></tr>
                            <tr><td>กำลัง ๑๕</td><td>กำลังพระจันทร์</td><td>เสน่ห์เมตตามหานิยมสูง ผู้ใหญ่เอ็นดู อารมณ์ศิลปิน</td></tr>
                            <tr><td>กำลัง ๑๙</td><td>กำลังพฤหัสบดี</td><td>ปัญญาเลิศล้ำ มีครูบาอาจารย์คุ้มครอง ก้าวหน้าในราชการและวิชาการ</td></tr>
                            <tr><td>กำลัง ๒๑</td><td>กำลังพระศุกร์</td><td>โภคทรัพย์สมบูรณ์ ร่ำรวยความสุขและศิลปศาสตร์</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    link: "sevenDigitsPage",
    badge: "badge-purple",
    references: [
        "อาจารย์เจษฎา คำไหล. (๒๕๓๘). <em>คัมภีร์เลข ๗ ตัว ๔ ฐาน ๙ ฐาน พิสดาร</em>. สถาบันโหราศาสตร์วิทยา.",
        "หลวงวิศาลดรุณกร (อั้น สาริกบุตร). <em>คัมภีร์โหราศาสตร์ไทยภาคเลข ๗ ตัว</em>.",
        "อาจารย์ธนกร สินเกษม. (๒๕๔๘). <em>คู่มือพยากรณ์เลข ๗ ตัวฉบับบูรณาการ</em>. สมาคมโหรแห่งประเทศไทย."
    ]
},
"life_graph_analysis": {
    id: "K037",
    category: "เลขศาสตร์",
    title: "📈 คัมภีร์กราฟชีวิตพยากรณ์ (Life Graph Cycles)",
    type: "สถิติและวงจรชีวิตมนุษย์",
    level: "ทั่วไป",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-chart-line mr-2"></i>หลักการคำนวณกราฟชีวิต ๑๒ ภพ</h5>
                <p><b>กราฟชีวิต</b> คือระบบการแปลงรหัสดวงชะตา (วัน เดือน ปีตกฟาก) ให้เป็นพิกัดเส้นโค้ง (Life Curves) สะท้อนจุดขึ้นลงของโชคชะตาตั้งแต่คะแนน ๑ (ต่ำสุด) ถึง ๑๒ (สูงสุด) เพื่อช่วยให้ผู้รับคำทำนายวางแผนจังหวะรุก-รับในชีวิตได้อย่างมีสติ</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● การอ่านค่าระดับคะแนน ๑–๑๒</h6>
                <ul>
                    <li><b>คะแนน ๑–๓ (ระดับวิกฤต/ระมัดระวัง):</b> ควรงดเว้นการลงทุนเสี่ยง ก้มหน้าเก็บเกี่ยวประสบการณ์ ไม่สร้างหนี้สินเพิ่ม หมั่นสะสมบุญ</li>
                    <li><b>คะแนน ๔–๖ (ระดับทรงตัว/เริ่มตั้งหลัก):</b> เหมาะแก่การเรียนรู้ ปรับปรุงระบบงาน พัฒนาตนเอง เตรียมรอจังหวะดาวหนุน</li>
                    <li><b>คะแนน ๗–๙ (ระดับดี/ก้าวหน้า):</b> มีโอกาสดีเข้ามา ผู้ใหญ่สนับสนุน สามารถขยับขยายธุรกิจและการงานได้ผลดี</li>
                    <li><b>คะแนน ๑๐–๑๒ (ระดับสูงสุด/มหาโชค):</b> จุดสูงสุดของดวงชะตา ทำสิ่งใดมักประสบความสำเร็จอย่างงดงาม ชื่อเสียงโดดเด่น</li>
                </ul>
            </section>
        </div>
    `,
    link: "lifeGraphPage",
    badge: "badge-info",
    references: [
        "พลูหลวง (ประจวบ วัชรปาน). <em>การคำนวณกราฟชีวิตและวงจรอายุขัย</em>. สำนักพิมพ์ศิลปาบรรณาคาร.",
        "ร.ต.อ. เปี่ยม บุณยะโชติ. (๒๕๑๘). <em>ตำรากราฟชีวิตมาตรฐาน</em>. เกษมบรรณกิจ.",
        "สถาบันค้นคว้าโหราศาสตร์ไทย. <em>สถิติกราฟชีวิตและความสัมพันธ์ต่อสภาวะเศรษฐกิจ</em>."
    ]
},
"sompong_elements_love": {
    id: "K038",
    category: "ตำราโบราณ",
    title: "💞 ตำราสมพงษ์ธาตุสัมพันธ์ ดิน น้ำ ลม ไฟ",
    type: "สมพงษ์ธรรมชาติ",
    level: "ทั่วไป",
    content: `
        <div class="article-rich-content">
            <section class="mb-4">
                <h5 class="text-gold"><i class="fas fa-fire-alt mr-2"></i>ธรรมชาติของธาตุทั้ง ๔ ในการครองเรือน</h5>
                <p>โบราณาจารย์จำแนกธาตุเกิดของมนุษย์ออกเป็น ๔ กองธาตุใหญ่ ได้แก่ <b>ธาตุดิน, ธาตุน้ำ, ธาตุลม, ธาตุไฟ</b> การจับคู่ของธาตุเป็นตัวบอกถึงพลังเกื้อหนุนหรือหักล้างกันในชีวิตประจำวัน:</p>
            </section>
            <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                <h6 class="text-gold-light">● กฎการส่งเสริมและทำลายของธาตุคู่ครอง</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50">
                        <thead><tr class="text-gold"><th>คู่ธาตุ</th><th>ระดับความสมพงษ์</th><th>ผลการทำนายตามตำราโบราณ</th></tr></thead>
                        <tbody>
                            <tr><td><b>ไฟ + ลม</b></td><td><span class="badge badge-success">ดีเลิศ (ส่งเสริม)</span></td><td>ลมพัดให้ไฟลุกโชติช่วง ส่งเสริมให้มีความคิดสร้างสรรค์ ก้าวหน้า รวดเร็ว</td></tr>
                            <tr><td><b>น้ำ + ดิน</b></td><td><span class="badge badge-success">ดีเลิศ (ส่งเสริม)</span></td><td>น้ำช่วยให้ดินชุ่มชื้น เพาะปลูกสิ่งใดก็งอกงาม มั่นคง ร่ำรวยมรดก</td></tr>
                            <tr><td><b>ดิน + ดิน</b></td><td><span class="badge badge-info">มั่นคง (เกื้อกูล)</span></td><td>หนักแน่น มั่นคง ดั่งขุนเขา แต่ควรระวังความดื้อดึงไม่ยอมใคร</td></tr>
                            <tr><td><b>น้ำ + น้ำ</b></td><td><span class="badge badge-info">ร่มเย็น (เกื้อกูล)</span></td><td>เข้าอกเข้าใจกันดี อ่อนโยน มีเมตตา แต่อาจขาดผู้นำเด็ดขาด</td></tr>
                            <tr><td><b>ไฟ + น้ำ</b></td><td><span class="badge badge-danger">ขัดแย้ง (ทำลาย)</span></td><td>น้ำดับไฟ ไฟทำให้น้ำเดือด อารมณ์ร้อน ปะทะกันบ่อย ต้องใช้สติและธรรมะครองเรือน</td></tr>
                            <tr><td><b>ลม + ดิน</b></td><td><span class="badge badge-warning">ปานกลาง (แปรปรวน)</span></td><td>ลมพัดฝุ่นดินฟุ้งกระจาย มักมีความเห็นต่างในเรื่องการเงินและการใช้ชีวิต</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    link: "compatibilityPage",
    badge: "badge-danger",
    references: [
        "พระธรรมธีรราชมหามุนี (โชดก ญาณสิทฺธิ). <em>คัมภีร์มหาภูตรูป ๔ และธาตุสมพงษ์</em>.",
        "อาจารย์จำลอง พิศนาคะ. (๒๕๑๖). <em>ตำราพรหมชาติและสมพงษ์ธาตุคู่สร้างคู่สม</em>. สำนักพิมพ์หอสมุดกลาง.",
        "สมาคมโหราศาสตร์นานาชาติ. <em>หลักการผสมธาตุดาวและธาตุราศีในวิชาดูดวงไทย</em>."
    ]
}
};
/**
 * ฟังก์ชันช่วยเหลือ (Helper) เพื่อความเสถียรสูงสุด
 */
const KnowledgeAPI = {
    KNOWLEDGE_ARTICLES,
    /**
     * ดึงบทความตาม key
     * @param {string} key - ชื่อ key ของบทความ (เช่น "promchat")
     * @returns {object|null} ข้อมูลบทความ หรือ null ถ้าไม่พบ
     */
    getArticle(key) {
        if (typeof key !== "string" || !key) return null;
        return KNOWLEDGE_ARTICLES[key] || null;
    },
    /**
     * ดึงบทความตาม id
     * @param {string} id - เช่น "K001"
     * @returns {object|null}
     */
    getArticleById(id) {
        if (typeof id !== "string" || !id) return null;
        return Object.values(KNOWLEDGE_ARTICLES).find(article => article.id === id) || null;
    },
    /**
     * ดึงบทความทั้งหมดในหมวดหมู่
     * @param {string} category 
     * @returns {object[]}
     */
    getArticlesByCategory(category) {
        if (typeof category !== "string" || !category) return [];
        return Object.values(KNOWLEDGE_ARTICLES).filter(a => a.category === category);
    },
    /**
     * ค้นหาบทความตามคำค้น (title + content)
     * @param {string} term 
     * @returns {object[]}
     */
    searchArticles(term) {
        if (typeof term !== "string" || !term.trim()) return Object.values(KNOWLEDGE_ARTICLES);
        const lowerTerm = term.toLowerCase();
        return Object.values(KNOWLEDGE_ARTICLES).filter(article =>
            article.title.toLowerCase().includes(lowerTerm) ||
            article.content.toLowerCase().includes(lowerTerm)
        );
    },
    /**
     * รายชื่อหมวดหมู่ทั้งหมด (ไม่ซ้ำ)
     * @returns {string[]}
     */
    getAllCategories() {
        const cats = new Set(Object.values(KNOWLEDGE_ARTICLES).map(a => a.category));
        return Array.from(cats);
    },
    /**
     * จำนวนบทความทั้งหมด
     */
    totalArticles: Object.keys(KNOWLEDGE_ARTICLES).length,
    /**
     * รายการ key ทั้งหมด
     */
    getAllKeys() {
        return Object.keys(KNOWLEDGE_ARTICLES);
    }
};
// ============================================================
// Export สำหรับใช้งานทุกแบบ (ES Module / CommonJS / Global)
// ============================================================
if (typeof module !== "undefined" && module.exports) {
    module.exports = KnowledgeAPI;
} else if (typeof window !== "undefined") {
    window.KnowledgeAPI = KnowledgeAPI;
    // เปิดให้เรียกใช้งานโดยตรงได้ทันที
    window.KNOWLEDGE_ARTICLES = KNOWLEDGE_ARTICLES;
}
