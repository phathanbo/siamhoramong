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

