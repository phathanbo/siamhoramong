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
        title: "📜 ตำราพรหมชาติฉบับมาตรฐาน",
        type: "พื้นฐานดวงชะตา",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-history mr-2"></i>ตำนานและความเป็นมา</h5>
                    <p>ตำราพรหมชาติไม่ใช่เพียงแค่หนังสือดูดวง แต่เป็น "ภูมิปัญญาแผ่นดิน" ที่รวบรวมวิชาโหราศาสตร์ไทย มอญ และพรหมณ์เข้าด้วยกัน สืบทอดมาตั้งแต่สมัยอยุธยาจนถึงปัจจุบัน เพื่อใช้เป็นคู่มือในการดำเนินชีวิตให้สอดคล้องกับอำนาจดวงดาว</p>
                </section>
                <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                    <h6 class="text-gold-light">● หัวใจหลัก 3 ประการของพรหมชาติ</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><i class="fas fa-star text-warning mr-2"></i> <b>อัตตาชะตา:</b> การรู้จักตนเองผ่านปีนักษัตรและธาตุเกิด</li>
                        <li class="mb-2"><i class="fas fa-sync text-warning mr-2"></i> <b>วิถีหมุนเวียน:</b> การเข้าใจรอบเคราะห์และโชคลาภที่เปลี่ยนไปตามวัย</li>
                        <li><i class="fas fa-heart text-warning mr-2"></i> <b>สมพงษ์คู่ครอง:</b> การหาคู่มิตรที่เสริมบารมีและหลีกเลี่ยงคู่ศัตรู</li>
                    </ul>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-calculator mr-2"></i>เคล็ดวิชา: เศษพระจอมเกล้า</h5>
                    <p>หนึ่งในวิชาที่แม่นยำที่สุดในพรหมชาติ คือการคำนวณ "เศษ" เพื่อดูวาสนา วิธีการคือ นำเลข (ปี + เดือน + วัน) มาบวกรวมกันแล้วหารด้วย 7 ผลลัพธ์ที่ได้จะบอกถึง "แก่นแท้" ของชีวิต:</p>
                    <div class="table-responsive mt-3">
                        <table class="table table-sm table-dark text-white-50">
                            <thead>
                                <tr class="text-gold">
                                    <th>เศษที่ได้</th>
                                    <th>คำทำนายโดยย่อ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>เศษ ๑</td><td>เสาเรือนเหล็ก - มั่นคง ทรนง มีอำนาจ</td></tr>
                                <tr><td>เศษ ๓</td><td>เงินทองมาก - มั่งคั่ง มีกินมีใช้ไม่ขาด</td></tr>
                                <tr><td>เศษ ๖</td><td>ความสุขสม - มีเสน่ห์ ผู้อื่นเมตตาเสมอ</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-om mr-2"></i>การประยุกต์ใช้ในปัจจุบัน</h5>
                    <p>ประธานโบ้สามารถใช้ตำรานี้ในการวางแผนงานสำคัญ เช่น การเลือกวันเปิดตัว Content ใหม่ หรือการดีลงานกับลูกค้า โดยเช็คจาก <b>"วันธงชัย"</b> ในกาลโยค ซึ่งเป็นส่วนหนึ่งของวิชาพรหมชาติ เพื่อให้งานนั้นราบรื่นและมีชื่อเสียง</p>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>ข้อคิดจากครูบาอาจารย์</h6>
                    <small>"ดวงชะตาบอกแนวทาง แต่การกระทำ (กรรม) คือตัวกำหนดผลลัพธ์ที่แท้จริง" ใช้ตำราเพื่อเตรียมตัว ไม่ใช่เพื่อให้งมงาย</small>
                </div>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-warning"
    },
    "attakan": {
        id: "K002",
        category: "ฤกษ์ยาม",
        title: "🕒 เคล็ดวิชายามอัฏฐกาล (8 ยาม)",
        type: "การเลือกเวลา",
        level: "กลาง",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-clock mr-2"></i>ยามอัฏฐกาล: เคล็ดวิชาช่วงชิงจังหวะสวรรค์</h5>
                    <p>ยามอัฏฐกาล คือวิชาที่ว่าด้วยการแบ่งเวลาใน 1 วันออกเป็น 16 ส่วน (กลางวัน 8 ยาม / กลางคืน 8 ยาม) ยามละ 90 นาที เพื่อหาว่าในแต่ละช่วงเวลานั้น ดาวเคราะห์ดวงใดทำหน้าที่เป็น "เจ้าเวหา" คอยควบคุมโชคลาภและอุปสรรคของผู้กระทำการ</p>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● ยามมงคล (ศุภเคราะห์) - ช่วงเวลาแห่งโอกาส</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100 shadow-sm">
                                <b class="text-info">ยามพระจันทร์ (๒):</b>
                                <p class="small text-white-50 mt-1">ยามแห่งเสน่ห์และการอุปถัมภ์ เหมาะสำหรับการเข้าหาผู้ใหญ่ ขอความเมตตา หรือเจรจาในเรื่องที่ต้องใช้ความนุ่มนวล</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100 shadow-sm">
                                <b class="text-info">ยามพระพุธ (๔):</b>
                                <p class="small text-white-50 mt-1">ยามแห่งปัญญาและการสื่อสาร เหมาะสำหรับการค้าขาย ทำสัญญา ส่งข้อความสำคัญ หรือการเริ่มเรียนรู้สิ่งใหม่</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100 shadow-sm">
                                <b class="text-gold">ยามพระพฤหัสบดี (๕):</b>
                                <p class="small text-white-50 mt-1">ยามแห่งความสำเร็จและมงคลสูงสุด เหมาะสำหรับการประกอบพิธีการสำคัญ การทำบุญ หรือการวางแผนกลยุทธ์ที่ต้องการความยั่งยืน</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-info h-100 shadow-sm">
                                <b class="text-info">ยามพระศุกร์ (๖):</b>
                                <p class="small text-white-50 mt-1">ยามแห่งโชคลาภและความรื่นรมย์ เหมาะสำหรับการเปิดร้านใหม่ เริ่มงานศิลปะ หรือการออกเดทและความรัก</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h6 class="text-danger mb-3"><i class="fas fa-exclamation-circle mr-2"></i>ยามต้องห้าม (บาปเคราะห์) - ช่วงเวลาที่ควรสงบนิ่ง</h6>
                    <div class="p-3 bg-black-25 rounded border-left-danger">
                        <p class="small text-white-50 mb-0"><b>ยามอาทิตย์ (๑), อังคาร (๓), เสาร์ (๗), และราหู (๘):</b> เป็นช่วงเวลาที่ดาวฝ่ายร้ายให้โทษ มักเกิดอาการใจร้อน ขัดแย้ง หรือมีอุปสรรคไม่คาดฝัน หากหลีกเลี่ยงไม่ได้ โบราณให้แก้เคล็ดด้วยการมีสติและไม่ใจร้อนตามพลังดาว</p>
                    </div>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● เคล็ดลับการเลือกยามตามเป้าหมาย (ตำราพิชัยสงคราม)</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>เป้าหมาย</th>
                                    <th>ยามที่แนะนำ</th>
                                    <th>ผลลัพธ์ที่หวังผล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>เดินทางไกล</td><td><b>ยามธงชัย</b></td><td>ปลอดภัย ถึงจุดหมายโดยสวัสดิภาพ</td></tr>
                                <tr><td>เจรจาหนี้สิน/ขอลาภ</td><td><b>ยามลาภะ</b></td><td>มีโอกาสได้ทรัพย์ หรือได้รับการผ่อนปรน</td></tr>
                                <tr><td>แข่งขัน/เข้าหาผู้มีอำนาจ</td><td><b>ยามอธิบดี</b></td><td>ได้รับการยอมรับ ชนะเหนือคู่แข่ง</td></tr>
                                <tr><td>แก้ปัญหา/หนีอุปสรรค</td><td><b>ยามปลอด</b></td><td>ศัตรูมองไม่เห็น อุปสรรคคลี่คลาย</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1 small font-weight-bold"><i class="fas fa-history mr-2"></i>ความสำคัญของ "เวลาตกฟาก"</h6>
                    <p class="small mb-0">การคำนวณยามอัฏฐกาลที่แม่นยำที่สุด จะต้องอ้างอิงจาก "เวลาพระอาทิตย์ขึ้นจริง" ของในแต่ละวันและแต่ละพื้นที่ (Local Time) ซึ่งระบบของ **สยามโหรามงคล** ได้คำนวณสิ่งนี้ไว้ให้คุณเรียบร้อยแล้ว</p>
                </div>
            </div>
        `,
        link: "yarmPage",
        badge: "badge-info"
    },
    "kamalok": {
        id: "K003",
        category: "กาลโยค",
        title: "🌟 หลักกาลโยคและสีมงคล",
        type: "วิถีสิริมงคล",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-calendar-alt mr-2"></i>กาลโยค: เคล็ดวิชาจัดระเบียบวัน</h5>
                    <p>กาลโยค คือ การกำหนดตำแหน่งความดี-ความร้ายของ "วัน" ในรอบปี โดยคำนวณตามศักราชจุลศักราช (จ.ศ.) เพื่อหาว่าในปีนั้นๆ วันใดส่งเสริม (วันดี) และวันใดขัดขวาง (วันร้าย)</p>
                </section>
                <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                    <h6 class="text-gold-light">● ความหมายของตำแหน่งกาลโยค</h6>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <p><b class="text-gold">วันธงชัย:</b> ความสำเร็จ ชัยชนะ เหมาะแก่การขึ้นบ้านใหม่ แต่งงาน หรือเปิดธุรกิจ</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <p><b class="text-gold">วันอธิบดี:</b> ความยิ่งใหญ่ อำนาจ การปกครอง เหมาะแก่การเลื่อนตำแหน่ง หรือขอความช่วยเหลือจากผู้ใหญ่</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <p><b class="text-danger">วันอุบาทว์:</b> อุปสรรค ความไม่ราบรื่น ไม่ควรเริ่มงานสำคัญหรือเดินทางไกล</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <p><b class="text-danger">วันโลกาวินาศ:</b> ความสูญเสีย ความวุ่นวาย เป็นตำแหน่งที่ร้ายที่สุด ควรหลีกเลี่ยงงานมงคลทุกชนิด</p>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-tshirt mr-2"></i>เคล็ดสีเสื้อมงคลตามวัน</h5>
                    <p>การเลือกใช้สีเสื้อผ้าให้ถูกโฉลกกับวัน (ทักษา) เป็นวิธีกระตุ้นพลังงานบวกแบบง่ายที่สุดในแต่ละวัน:</p>
                    <div class="table-responsive mt-3">
                        <table class="table table-sm table-dark text-white-50">
                            <thead>
                                <tr class="text-gold">
                                    <th>วัน</th>
                                    <th>สีเสริมดวง (เดช/ศรี)</th>
                                    <th>สีต้องห้าม (กาลกิณี)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>อาทิตย์</td><td class="text-info">แดง / ชมพู</td><td class="text-danger">น้ำเงิน / ฟ้า</td></tr>
                                <tr><td>จันทร์</td><td class="text-info">ขาว / เหลือง / เขียว</td><td class="text-danger">แดง</td></tr>
                                <tr><td>อังคาร</td><td class="text-info">ชมพู / ม่วง</td><td class="text-danger">ขาว / เหลือง</td></tr>
                                <tr><td>พุธ (กลางวัน)</td><td class="text-info">เขียว / ส้ม</td><td class="text-danger">ชมพู</td></tr>
                                <tr><td>พฤหัสบดี</td><td class="text-info">ส้ม / แดง</td><td class="text-danger">ม่วง / ดำ</td></tr>
                                <tr><td>ศุกร์</td><td class="text-info">ฟ้า / น้ำเงิน / ชมพู</td><td class="text-danger">เทา / ควันบุหรี่</td></tr>
                                <tr><td>เสาร์</td><td class="text-info">ม่วง / ดำ / แดง</td><td class="text-danger">เขียว</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>ข้อควรรู้เพิ่มเติม</h6>
                    <small>ตำแหน่งกาลโยคจะมีการเปลี่ยนใหม่ทุกวันที่ 16 เมษายน ของทุกปี (หลังวันเถลิงศก) การใช้กาลโยคควบคู่กับสีมงคลจะช่วยให้การวางแผนงานในแต่ละวันของคุณมีประสิทธิภาพสูงสุด</small>
                </div>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-success"
    },
    "numbers": {
        id: "K004",
        category: "เลขศาสตร์",
        title: "🔢 พลังตัวเลขและเบอร์มงคลพื้นฐาน",
        type: "พยากรณ์ตัวเลข",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-fingerprint mr-2"></i>อิทธิพลของตัวเลขในชีวิต</h5>
                    <p>เลขศาสตร์คือวิชาที่ว่าด้วยแรงดึงดูดของดวงดาวผ่านตัวเลขที่อยู่รอบตัวเรา ไม่ว่าจะเป็นเบอร์โทรศัพท์ ทะเบียนรถ หรือเลขที่บ้าน ตัวเลขแต่ละตัวมี "คลื่นพลังงาน" ที่ส่งผลต่อโอกาสและโชคลาภต่างกัน</p>
                </section>
                <section class="mb-4 p-3 bg-black-25 rounded border-left-gold">
                    <h6 class="text-gold-light">● คู่เลขมงคลที่ควรมีไว้ติดตัว</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><b class="text-gold">45 / 54 :</b> คู่เลขแห่งปัญญาและความสำเร็จ (เทพนารีอุปถัมภ์)</li>
                        <li class="mb-2"><b class="text-gold">24 / 42 :</b> คู่เลขเมตตามหานิยม เจรจาค้าขายคล่องตัว</li>
                        <li><b class="text-gold">15 / 51 :</b> คู่เลขผู้ใหญ่เอ็นดู มีมิตรดีคอยช่วยเหลือ</li>
                    </ul>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-ban mr-2"></i>เลขที่ควรระวัง</h5>
                    <p>กลุ่มเลขที่มักทำให้เกิดอุปสรรคหรือความใจร้อน: <b>00, 13, 31, 37, 73</b> หากมีอยู่ในตำแหน่งท้ายของเบอร์โทรศัพท์ มักจะทำให้เหนื่อยกว่าคนอื่น</p>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-lightbulb mr-2"></i>ข้อคิดการใช้เลข</h6>
                    <small>เลขดีช่วยเสริมโอกาส แต่การลงมือทำด้วยสติคือความสำเร็จที่ยั่งยืนที่สุด</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-primary"
    },
    "zodiac": {
        id: "K005",
        category: "ตำราโบราณ",
        title: "🐲 การดูลักษณะนิสัยตามปีนักษัตร",
        type: "วิเคราะห์ตัวตน",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-paw mr-2"></i>12 นักษัตร: รหัสลับธาตุเกิด</h5>
                    <p>คนไทยโบราณใช้ปีเกิดในการบ่งบอกถึง "ธาตุ" และ "กมลสันดาน" ของบุคคล การรู้ปีนักษัตรจะช่วยให้เราเข้าใจจุดแข็งและจุดอ่อนของทั้งตัวเองและผู้อื่นได้ดีขึ้น</p>
                </section>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div class="p-2 border border-secondary rounded">
                            <b class="text-gold">ปีชวด (หนู) - ธาตุน้ำ:</b> 
                            <p class="small">ฉลาด ปรับตัวเก่ง มีเสน่ห์ แต่บางครั้งก็คิดมากและขี้ระแวง</p>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="p-2 border border-secondary rounded">
                            <b class="text-gold">ปีขาล (เสือ) - ธาตุไม้:</b> 
                            <p class="small">เป็นผู้นำ มีอำนาจ กล้าหาญ แต่ใจร้อนและรักอิสระสูง</p>
                        </div>
                    </div>
                </div>
                <section class="mb-4 mt-3">
                    <h5 class="text-gold"><i class="fas fa-handshake mr-2"></i>ปีที่เกื้อกูลกัน (สมพงษ์)</h5>
                    <p>การร่วมธุรกิจหรือใช้ชีวิตคู่ หากเป็นปีนักษัตรที่เสริมกันจะทำให้ชีวิตราบรื่น เช่น <b>มะเมีย-ขาล-จอ</b> หรือ <b>ชวด-มะโรง-วอก</b></p>
                </section>
                <div class="alert alert-info bg-dark border-info">
                    <small><i class="fas fa-info-circle mr-2"></i>เกร็ดความรู้: การชงไม่ได้แปลว่าร้ายเสมอไป แต่อาจหมายถึงการเปลี่ยนแปลงครั้งใหญ่ในชีวิต</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-warning"
    },
    "taksa_basic": {
        id: "K006",
        category: "ทักษาพยากรณ์",
        title: "☸️ พื้นฐานวิชาทักษาปกรณ์",
        type: "วิเคราะห์พื้นดวง",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-dharmachakra mr-2"></i>วิชาทักษา: หัวใจแห่งการพยากรณ์ไทย</h5>
                    <p>วิชาทักษาปกรณ์ (หรือทักษาคู่ธาตุ) คือวิชาพื้นฐานที่สำคัญที่สุดในโหราศาสตร์ไทย เป็นการจัดระเบียบดาวเคราะห์ทั้ง 8 ดวง (รวมราหู) ลงในทิศทั้ง 8 ทิศ เพื่อกำหนด "คุณภาพ" ของดาวในช่วงเวลานั้นๆ ไม่ว่าจะเป็นการตั้งชื่อ การเลือกสีมงคล หรือการวิเคราะห์ดวงจร</p>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● ความหมายของภูมิทั้ง 8 (จุดรับพลัง)</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">1. บริวาร:</b>
                                <p class="small text-white-50">หมายถึง คนในปกครอง บุตร ภรรยา สามี เพื่อนฝูง และความสัมพันธ์กับคนรอบข้าง หากดาวบริวารเสีย มักจะมีปัญหาเรื่องคนใกล้ชิด</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">2. อายุ:</b>
                                <p class="small text-white-50">หมายถึง วิถีการดำเนินชีวิต สุขภาพพลานามัย และความราบรื่นในการใช้ชีวิต หากดาวอายุเด่น จะส่งผลให้สุขภาพแข็งแรง มีอายุยืนยาว</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">3. เดช:</b>
                                <p class="small text-white-50">หมายถึง อำนาจ บารมี เกียรติยศ ชื่อเสียง และการได้รับความยำเกรง เหมาะสำหรับผู้ที่ทำงานข้าราชการหรือผู้บริหาร</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-gold">4. ศรี:</b>
                                <p class="small text-white-50">หมายถึง โชคลาภ เสน่ห์ ความเป็นสิริมงคล และความสุขใจ เป็นตำแหน่งที่คนมักใช้ตั้งชื่อหรือเลือกสีรถเป็นอันดับแรก</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">5. มูละ:</b>
                                <p class="small text-white-50">หมายถึง มรดก ทรัพย์สินกินใช้ไม่หมด ความมั่นคงในระยะยาว เช่น ที่ดิน บ้านเรือน และเงินเก็บ</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">6. อุตสาหะ:</b>
                                <p class="small text-white-50">หมายถึง ความขยันหมั่นเพียร ความพยายามในการสร้างตัว และความสำเร็จที่ได้มาจากการลงแรง</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-gold h-100">
                                <b class="text-info">7. มนตรี:</b>
                                <p class="small text-white-50">หมายถึง การได้รับการอุปถัมภ์ค้ำชูจากผู้ใหญ่ หรือบุคคลที่มีอำนาจเหนือกว่า คอยชี้แนะและสนับสนุน</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="p-3 bg-black-25 rounded border-left-danger h-100">
                                <b class="text-danger">8. กาลกิณี:</b>
                                <p class="small text-white-50">คือความอัปมงคล อุปสรรค ความติดขัด และสิ่งที่คอยขัดขวางความสำเร็จ เป็นตำแหน่งที่ต้อง "เลี่ยง" ในทุกพิธีกรรม</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-key mr-2"></i>เคล็ดลับการนำไปใช้งานจริง</h5>
                    <div class="table-responsive mt-3">
                        <table class="table table-sm table-dark text-white-50">
                            <thead>
                                <tr class="text-gold">
                                    <th>เป้าหมาย</th>
                                    <th>ภูมิที่ต้องใช้</th>
                                    <th>การนำไปใช้</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>หาแฟน/ความรัก</td><td><b>ศรี</b></td><td>ใช้สีเสื้อที่เป็นศรีของวันเกิด หรือตั้งชื่อให้มีอักษรศรี</td></tr>
                                <tr><td>สอบเข้า/สมัครงาน</td><td><b>เดช / มนตรี</b></td><td>เน้นสีเสื้อที่เป็นเดชเพื่อความยำเกรง และมนตรีเพื่อความเมตตา</td></tr>
                                <tr><td>ทำธุรกิจอสังหาฯ</td><td><b>มูละ</b></td><td>เน้นอักษรมูละในชื่อบริษัท หรือเลือกวันฤกษ์ดีที่เป็นมูละ</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1"><i class="fas fa-exclamation-triangle mr-2"></i>ข้อควรระวังสำคัญ</h6>
                    <p class="small mb-0">ในแต่ละช่วงอายุ "ดาวเสวยอายุ" จะเปลี่ยนไป ทำให้ตำแหน่งทักษาเปลี่ยนตาม (ทักษาจร) ดังนั้นสิ่งที่เคยดีในปีที่แล้ว ปีนี้อาจกลายเป็นกาลกิณีก็ได้ ควรหมั่นเช็คดวงด้วยเครื่องมือทักษาเป็นประจำ</p>
                </div>
            </div>
        `,
        link: "taksaPage",
        badge: "badge-info"
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
                    <h5 class="text-gold"><i class="fas fa-meteor mr-2"></i>กำลังวันและอิทธิพลของดาว</h5>
                    <p>ดาวแต่ละดวงมี "กำลัง" ไม่เท่ากัน ซึ่งเลขกำลังเหล่านี้ถูกนำมาใช้ในหลายตำรา ทั้งการตั้งศาล การหาเลขมงคล หรือการสวดมนต์เสริมดวง</p>
                </section>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50 border-gold">
                        <thead>
                            <tr class="text-gold">
                                <th>ดาว</th>
                                <th>ชื่อเรียก</th>
                                <th>กำลังดาว</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>๑</td><td>พระอาทิตย์</td><td>๖</td></tr>
                            <tr><td>๒</td><td>พระจันทร์</td><td>๑๕</td></tr>
                            <tr><td>๓</td><td>พระอังคาร</td><td>๘</td></tr>
                            <tr><td>๔</td><td>พระพุธ</td><td>๑๗</td></tr>
                            <tr><td>๕</td><td>พระพฤหัสบดี</td><td>๑๙</td></tr>
                            <tr><td>๖</td><td>พระศุกร์</td><td>๒๑</td></tr>
                            <tr><td>๗</td><td>พระเสาร์</td><td>๑๐</td></tr>
                            <tr><td>๘</td><td>พระราหู</td><td>๑๒</td></tr>
                        </tbody>
                    </table>
                </div>
                <section class="mt-4">
                    <h6 class="text-gold-light">● คู่มิตร-คู่ศัตรูที่ควรรู้</h6>
                    <p class="small"><b>คู่มิตร:</b> (1-5), (2-4), (3-6), (7-8) → ส่งเสริมกันดีนักแล</p>
                    <p class="small"><b>คู่ศัตรู:</b> (1-3), (2-5), (4-8), (6-7) → มักขัดแย้งหรือเกิดอุปสรรค</p>
                </section>
            </div>
        `,
        link: "planetRelationPage",
        badge: "badge-warning"
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
        title: "❤️ ตำราสมพงษ์นักษัตรคู่ครอง",
        type: "วิเคราะห์ความสัมพันธ์",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-heart mr-2"></i>วิชาสมพงษ์: ศาสตร์แห่งการเลือกคู่ครอง</h5>
                    <p>การดูสมพงษ์ในตำราไทยโบราณ ไม่ใช่เพียงแค่การดูว่า "รักกันไหม" แต่เป็นการวิเคราะห์ว่าเมื่ออยู่กินกันแล้ว พลังงานของทั้งคู่จะ "ส่งเสริม" หรือ "หักล้าง" กันอย่างไร โดยมีเกณฑ์พิจารณาดังนี้:</p>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● 3 เกณฑ์หลักในการพยากรณ์คู่ครอง</h6>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100 text-center">
                                <b class="text-gold">1. ปีนักษัตร (สมพงษ์ธาตุ)</b>
                                <p class="small text-white-50 mt-2">ดูว่าธาตุประจำปีเกิดเข้ากันได้หรือไม่ เช่น คนเกิดปีธาตุน้ำ อยู่กับปีธาตุไม้จะช่วยส่งเสริมให้เจริญรุ่งเรือง</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100 text-center">
                                <b class="text-gold">2. วันเกิด (คู่มิตร/ศัตรู)</b>
                                <p class="small text-white-50 mt-2">พิจารณาจากกำลังวัน เช่น วันอาทิตย์เป็นคู่มิตรกับวันพฤหัสบดี จะส่งผลให้ครองรักกันยืนยาว</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100 text-center">
                                <b class="text-gold">3. ตำรานาคสมพงษ์</b>
                                <p class="small text-white-50 mt-2">พิจารณาตำแหน่ง "หัว-ตัว-หาง" ของนาค หากตกตำแหน่งเดียวกันมักจะขัดแย้งกันบ่อย</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● ตารางคู่มิตร-คู่ศัตรู (หัวใจการครองเรือน)</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>ประเภท</th>
                                    <th>คู่ที่ส่งผลดี</th>
                                    <th>คำทำนาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td class="text-info">คู่มิตรใหญ่</td><td>อาทิตย์-พฤหัส, จันทร์-พุธ</td><td>ส่งเสริมลาภยศ เกื้อหนุนกันทุกด้าน</td></tr>
                                <tr><td class="text-info">คู่ธาตุ</td><td>อาทิตย์-เสาร์, จันทร์-พฤหัส</td><td>สร้างฐานะร่วมกันได้มั่นคง ร่ำรวยเร็ว</td></tr>
                                <tr><td class="text-info">คู่สมพล</td><td>อาทิตย์-ศุกร์, จันทร์-เสาร์</td><td>ช่วยแก้ปัญหาให้กันได้ดี เป็นคู่คิดที่ดี</td></tr>
                                <tr><td class="text-danger">คู่ศัตรู</td><td>อาทิตย์-อังคาร, จันทร์-พฤหัส</td><td>ระวังการขัดแย้ง อารมณ์ร้อนใส่กัน</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4">
                    <h6 class="mb-1 small font-weight-bold"><i class="fas fa-lightbulb mr-2"></i>ทางแก้สำหรับคู่ที่ไม่สมพงษ์</h6>
                    <p class="small mb-0">หากตรวจสอบแล้วตกเกณฑ์ไม่ดี ไม่ได้แปลว่าต้องเลิกกัน แต่ให้ใช้วิธี "แก้เคล็ด" ด้วยการแยกเตียงนอน (ชั่วคราว) หรือการทำบุญร่วมกันด้วยของที่เป็นคู่ เช่น หลอดไฟคู่ หรือแจกันคู่ เพื่อเป็นการเสริมดวงชะตาคู่ให้แน่นแฟ้นยิ่งขึ้น</p>
                </div>
            </div>
        `,
        link: "compatibilityPage",
        badge: "badge-pink"
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
        title: "✍️ หลักการตั้งชื่อมงคลตามวันเกิด",
        type: "การตั้งชื่อ",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-pen-nib mr-2"></i>อักขระมงคลและกาลกิณี</h5>
                    <p>การตั้งชื่อตามหลักทักษาปกรณ์ จะเน้นการเลือกอักขระที่เป็น "ศรี" หรือ "เดช" นำหน้า และที่สำคัญที่สุดคือต้อง <b>"ไม่มีอักขระกาลกิณี"</b> อยู่ในชื่อเด็ดขาด</p>
                </section>
                <div class="table-responsive">
                    <table class="table table-sm table-dark text-white-50">
                        <thead>
                            <tr class="text-gold">
                                <th>วันเกิด</th>
                                <th>อักษรกาลกิณี (ห้ามมี)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>อาทิตย์</td><td>ศ ษ ส ห ฬ ฮ</td></tr>
                            <tr><td>จันทร์</td><td>อ และ สระทั้งหมด</td></tr>
                            <tr><td>อังคาร</td><td>ก ข ค ฆ ง</td></tr>
                            <tr><td>พุธ (กลางวัน)</td><td>จ ฉ ช ซ ฌ ญ</td></tr>
                            <tr><td>พฤหัสบดี</td><td>ด ต ถ ท ธ น</td></tr>
                            <tr><td>ศุกร์</td><td>ย ร ล ว</td></tr>
                            <tr><td>เสาร์</td><td>ฎ ฏ ฐ ฑ ฒ ณ</td></tr>
                            <tr><td>ราหู (พุธกลางคืน)</td><td>บ ป ผ ฝ พ ฟ ภ ม</td></tr>
                        </tbody>
                    </table>
                </div>
                <p class="small mt-3 text-muted">* หมายเหตุ: การนับวันเกิดแบบโหราศาสตร์ไทยจะเปลี่ยนวันตอน 06.00 น. ไม่ใช่เที่ยงคืน</p>
            </div>
        `,
        link: "taksaPage",
        badge: "badge-success"
    },
    "fengshui_basic": {
        id: "K012",
        category: "ฮวงจุ้ย",
        title: "🏡 ทิศมงคลและการตั้งศาลพระภูมิ",
        type: "วิถีสิริมงคล",
        level: "กลาง",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-home mr-2"></i>การเลือกทิศหน้าบ้านและตำแหน่งศาล</h5>
                    <p>ทิศทางส่งผลต่อพลังงาน (ปราณ) ที่จะไหลเข้าสู่ตัวบ้าน ตามตำราพรหมชาติและการตั้งศาลพระภูมิ ทิศที่เป็นมงคลที่สุดคือทิศตะวันออกและทิศตะวันออกเฉียงเหนือ</p>
                </section>
                <div class="p-3 bg-black-25 border-left-gold rounded">
                    <h6 class="text-gold-light">● ทิศต้องห้าม</h6>
                    <p class="small text-white-50">ห้ามตั้งศาลพระภูมิหรือประตูหลักให้ตรงกับประตูรั้ว หรือหันหน้าศาลเข้าหาตัวบ้าน และหลีกเลี่ยงการหันไปทางทิศตะวันตกและทิศใต้หากไม่จำเป็น</p>
                </div>
                <section class="mt-4">
                    <h5 class="text-gold">ลำดับทิศมงคล</h5>
                    <ol class="small text-white-50">
                        <li><b>ทิศตะวันออกเฉียงเหนือ (ทิศเศรษฐี):</b> เหมาะแก่การค้าขาย</li>
                        <li><b>ทิศตะวันออก (ทิศราชา):</b> เสริมอำนาจบารมี</li>
                        <li><b>ทิศตะวันออกเฉียงใต้ (ทิศสิริมงคล):</b> เสริมความสงบสุขในครอบครัว</li>
                    </ol>
                </section>
            </div>
        `,
        link: "auspiciousPage",
        badge: "badge-primary"
    },
    "palm_reading": {
        id: "K013",
        category: "หัตถศาสตร์",
        title: "✋ พื้นฐานการอ่านเส้นลายมือ (เบื้องต้น)",
        type: "วิเคราะห์ลายมือ",
        level: "ทั่วไป",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold"><i class="fas fa-hand-paper mr-2"></i>ลายมือ: แผนที่ชีวิตบนฝ่ามือ</h5>
                    <p>การดูลายมือเป็นวิชาโบราณที่เชื่อว่าเส้นบนฝ่ามือคือการสะท้อนของกระแสประสาทและชะตาชีวิต โดยหลักการพื้นฐานจะดูที่เส้นหลัก 3 เส้นเป็นสำคัญ</p>
                </section>
                <div class="row mb-4">
                    <div class="col-12 mb-2">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">1. เส้นชีวิต (Life Line):</b>
                            <p class="small mb-0">เส้นที่ล้อมรอบฐานนิ้วโป้ง บ่งบอกถึงสุขภาพ พลังกาย และความเปลี่ยนแปลงครั้งใหญ่ในชีวิต (ไม่ใช่ความสั้น-ยาวของอายุอย่างเดียว)</p>
                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">2. เส้นสมอง (Head Line):</b>
                            <p class="small mb-0">เส้นที่ลากผ่านกลางฝ่ามือ บ่งบอกถึงระดับสติปัญญา วิธีการคิด และสมาธิในการทำงาน</p>
                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="p-3 bg-black-25 rounded border-left-gold">
                            <b class="text-gold">3. เส้นจิตใจ (Heart Line):</b>
                            <p class="small mb-0">เส้นที่อยู่บนสุดของฝ่ามือ บ่งบอกถึงอารมณ์ ความรัก และความเมตตา</p>
                        </div>
                    </div>
                </div>
                <div class="alert alert-gold bg-dark border-gold">
                    <small><i class="fas fa-info-circle mr-2"></i><b>เกร็ดความรู้:</b> โบราณมักให้ดูมือขวาเป็นหลักในคนถนัดขวา เพื่อดูวิถีชีวิตในปัจจุบันและอนาคต ส่วนมือซ้ายคือต้นทุนชีวิตที่ติดตัวมาตั้งแต่เกิด</small>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-warning"
    },
    "physiognomy": {
        id: "K014",
        category: "นรลักษณ์ศาสตร์",
        title: "👤 โหงวเฮ้งใบหน้าและลักษณะมงคล",
        type: "วิเคราะห์ลักษณะ",
        level: "กลาง",
        content: `
            <div class="article-rich-content">
                <section class="mb-4">
                    <h5 class="text-gold border-bottom-gold pb-2"><i class="fas fa-user-tie mr-2"></i>นรลักษณ์ศาสตร์: การอ่านลิขิตฟ้าจากใบหน้า</h5>
                    <p>โหงวเฮ้ง หรือ นรลักษณ์ศาสตร์ คือศาสตร์แห่งการพิจารณาลักษณะทางกายภาพเพื่อบ่งบอกนิสัยใจคอ สติปัญญา และวาสนาบารมี โดยโบราณท่านแบ่งการพิจารณาออกเป็น 3 ส่วนหลักที่เรียกว่า "3 วัง" ดังนี้:</p>
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● 3 ช่วงวัยบนใบหน้า (ไตรภาค)</h6>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">1. ส่วนบน (หน้าผาก-คิ้ว)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงช่วงชีวิตวัยเด็กถึงวัยหนุ่มสาว สติปัญญา และการอุปถัมภ์จากพ่อแม่พี่น้อง</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">2. ส่วนกลาง (คิ้ว-ปลายจมูก)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงช่วงชีวิตวัยกลางคน ความกระตือรือร้น การสร้างฐานะ และชีวิตคู่</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 bg-black-25 rounded border-top-gold h-100">
                                <b class="text-gold">3. ส่วนล่าง (ใต้จมูก-คาง)</b>
                                <p class="small text-white-50 mt-2">บ่งบอกถึงชีวิตวัยปลาย ความสงบสุข บริวาร และทรัพย์สมบัติที่สะสมมา</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="mb-4 p-3 rounded" style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2);">
                    <h6 class="text-gold"><i class="fas fa-mountain mr-2"></i>5 ขุนเขาแห่งใบหน้า (ตำแหน่งรับทรัพย์)</h6>
                    <ul class="list-unstyled small text-white-50">
                        <li class="mb-2"><b class="text-info">หน้าผาก:</b> ต้องอิ่มเต็ม ไม่บุบช้ำ หมายถึง บารมีสูง ได้รับโอกาสดีๆ ในชีวิต</li>
                        <li class="mb-2"><b class="text-info">จมูก:</b> เปรียบเสมือน "คลังสมบัติ" ต้องมีเนื้อ ปีกจมูกกว้าง บ่งบอกถึงการเก็บเงินอยู่</li>
                        <li class="mb-2"><b class="text-info">โหนกแก้ม (ซ้าย-ขวา):</b> ต้องสมดุลและรับกับจมูก บ่งบอกถึงอำนาจและการสนับสนุนจากบริวาร</li>
                        <li class="mb-2"><b class="text-info">คาง:</b> ต้องกลมมนหรือเป็นรูปไข่ที่มั่นคง บ่งบอกถึงที่อยู่อาศัยและการมีบริวารที่ดีในยามแก่</li>
                    </ul> 
                </section>
                <section class="mb-4">
                    <h6 class="text-gold-light mb-3">● วิเคราะห์ลักษณะ "จุดเด่น-จุดด้อย"</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-dark text-white-50 border-gold">
                            <thead>
                                <tr class="text-gold">
                                    <th>อวัยวะ</th>
                                    <th>ลักษณะมงคล</th>
                                    <th>อิทธิพล</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>หู</td><td>ติ่งหนาและยาว</td><td>สุขภาพแข็งแรง อายุยืน มีบุญวาสนา</td></tr>
                                <tr><td>ดวงตา</td><td>แววตาสดใส มีพลัง</td><td>มีความคิดเฉียบแหลม มักประสบความสำเร็จเร็ว</td></tr>
                                <tr><td>ปาก</td><td>ขอบปากชัด มุมปากยก</td><td>พูดจามีเสน่ห์ เจรจาค้าขายร่ำรวย (ลาภปาก)</td></tr>
                                <tr><td>คิ้ว</td><td>เรียงตัวสวย คลุมยาวถึงหางตา</td><td>มีชื่อเสียง มิตรสหายดี จิตใจมั่นคง</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <div class="alert alert-gold bg-dark border-gold mt-4 shadow">
                    <h6 class="mb-1 small font-weight-bold"><i class="fas fa-eye mr-2"></i>เคล็ดลับซินแส: "จิตเป็นนาย กายเป็นบ่าว"</h6>
                    <p class="small mb-0">แม้ลักษณะภายนอกจะบอกวาสนา แต่การรักษาจิตใจให้ผ่องใสและการหมั่นทำความดี จะช่วย "ปรับโหงวเฮ้ง" ให้เปลี่ยนจากร้ายกลายเป็นดีได้ในที่สุด</p>
                </div>
            </div>
        `,
        link: "mainContent",
        badge: "badge-primary"
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
