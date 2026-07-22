/**
 * dashaPage.js
 * ระบบทำนายทศาดาว (Planetary Dasha / Vimshottari Dasha 120 ปี)
 * ปรับปรุงฐานข้อมูลคำทำนายละเอียดแบบเจาะลึก 100% และรองรับการเลือกพุธกลางวัน / พุธกลางคืน
 */

"use strict";

// ลำดับดาว 9 ดวง และระยะเวลา Dasha (ปี) ตามตำรามาตรฐาน
const DASHA_ORDER = [
  { planet:"อาทิตย์",   years:6,   icon:"☀️", color:"#f1c40f", element:"ไฟ"  },
  { planet:"จันทร์",    years:10,  icon:"🌙", color:"#90caf9", element:"ดิน" },
  { planet:"อังคาร",    years:7,   icon:"🔴", color:"#ef5350", element:"ลม"  },
  { planet:"ราหู",      years:18,  icon:"🌑", color:"#7c4dff", element:"ลม"  },
  { planet:"พฤหัสบดี",  years:16,  icon:"🟡", color:"#ffd54f", element:"ดิน" },
  { planet:"เสาร์",     years:19,  icon:"⬛", color:"#90a4ae", element:"ไฟ"  },
  { planet:"พุธ",       years:17,  icon:"💚", color:"#66bb6a", element:"น้ำ" },
  { planet:"เกตุ",      years:7,   icon:"☄️", color:"#ff8a65", element:"น้ำ" },
  { planet:"ศุกร์",     years:20,  icon:"💖", color:"#f48fb1", element:"น้ำ" }
];

// ดาวเกิดตามวันในสัปดาห์ (0=อาทิตย์, 3=พุธกลางวัน)
const DASHA_BIRTH_PLANET_IDX = {
  0: 0, // อาทิตย์ → เริ่มทศาอาทิตย์
  1: 1, // จันทร์  → เริ่มทศาจันทร์
  2: 2, // อังคาร → เริ่มทศาอังคาร
  3: 6, // พุธกลางวัน → เริ่มทศาพุธ (index 6)
  4: 4, // พฤหัส  → เริ่มทศาพฤหัส (index 4)
  5: 8, // ศุกร์  → เริ่มทศาศุกร์ (index 8)
  6: 5  // เสาร์  → เริ่มทศาเสาร์ (index 5)
};

// ฐานข้อมูลคำทำนายทศาดาวละเอียดพิเศษเจาะลึก 100% ตรงตามตำราพระคัมภีร์โหราศาสตร์
const DASHA_PRED = {
  "อาทิตย์": {
    positive: [
      "มีโอกาสได้รับเกียรติยศ ชื่อเสียง หรือการเลื่อนตำแหน่งหน้าที่การงานอย่างเด่นชัด",
      "มีผู้ใหญ่หรือผู้มีอำนาจคอยเกื้อหนุน อุปถัมภ์ค้ำชูในการทำธุรกิจหรือติดต่อราชการ",
      "ได้รับความยอมรับในวงสังคม ความเป็นผู้นำโดดเด่น มีชัยชนะเหนือศัตรูหมู่มาร",
      "สุขภาพร่างกายแข็งแรง กระปรี้กระเปร่า มีพลังในการสร้างสรรค์สิ่งใหม่ๆ"
    ],
    negative: [
      "ระวังความใจร้อน อวดดี ยโสโอหัง หรืออัตตาที่อาจสร้างความขัดแย้งกับคนรอบตัว",
      "มีเรื่องเดือดเนื้อร้อนใจอันเกิดจากผู้มีอำนาจเหนือกกว่า หรือหัวหน้างานเพ่งเล็ง",
      "ต้องระวังโรคที่เกี่ยวกับหัวใจ ระบบไหลเวียนโลหิต สายตา และอาการปวดหัวรุนแรง",
      "อาจมีปากเสียงหรือข้อพิพาทรุนแรงกับบุตร บริวาร หรือคนในปกครอง"
    ],
    summary: "ช่วงทศาแห่งเกียรติยศ อำนาจ และพลังขับเคลื่อนชีวิต (ระยะเวลา 6 ปี) เป็นช่วงเวลาทองในการบุกเบิกงานโครงการใหญ่ๆ การทำงานราชการ หรือการสร้างแบรนด์สร้างชื่อเสียงส่วนตัวให้เป็นที่รู้จัก ศัตรูที่คิดร้ายจะแพ้ภัยตัวเอง แต่ต้องควบคุมอารมณ์ความทิฐิและรับฟังความคิดเห็นของผู้อื่นให้มากเพื่อไม่ให้เกียรติยศกลายเป็นภัยกลับมาสู่ตน"
  },
  "จันทร์": {
    positive: [
      "ชีวิตครอบครัวมีความสุขร่มเย็น มีเกณฑ์ได้บ้านใหม่ ที่อยู่อาศัยใหม่ หรือการเดินทางท่องเที่ยว",
      "การค้าขายและธุรกิจส่วนตัวราบรื่น มีรายได้หมุนเวียนเข้ามาดีเด่นด้านการเงินและการลงทุน",
      "มีเสน่ห์เมตตามหานิยมสูง คนรอบข้างรักใคร่เอ็นดู ได้รับความช่วยเหลือจากเพศตรงข้าม",
      "เกิดความคิดสร้างสรรค์ แรงบันดาลใจใหม่ๆ อารมณ์มีความละเอียดอ่อนและสุขุมขึ้น"
    ],
    negative: [
      "อารมณ์แปรปรวนง่าย อ่อนไหวคิดมาก วิตกกังวลในเรื่องไม่เป็นเรื่องจนนอนไม่หลับ",
      "ระวังปัญหาด้านสุขภาพที่เกี่ยวกับระบบน้ำในร่างกาย ของเหลว ภูมิแพ้ และระบบทางเดินอาหาร",
      "อาจถูกเอารัดเอาเปรียบจากความใจอ่อน หรือความเชื่อใจคนรอบข้างมากเกินไป",
      "ระวังการถูกทรยศหักหลัง หรือนินทาว่าร้ายลับหลังในเรื่องชู้สาวหรือความสัมพันธ์"
    ],
    summary: "ช่วงทศาแห่งเสน่ห์ เมตตา และโชคลาภทางการค้า (ระยะเวลา 10 ปี) พลังของดาวจันทร์ส่งผลให้ชีวิตดำเนินไปอย่างนุ่มนวล มีโอกาสสำเร็จในการทำธุรกิจบริการ อาหาร เครื่องดื่ม หรือสินค้าเกี่ยวกับผู้หญิง การเงินมั่งคั่งไหลมาเทมาดั่งน้ำหลาก ควรประคองอารมณ์ไม่ให้อ่อนไหวตามสิ่งเร้า และหลีกเลี่ยงการค้ำประกันหรือให้หยิบยืมเงินทองในช่วงนี้"
  },
  "อังคาร": {
    positive: [
      "มีความตื่นตัว กล้าหาญ เด็ดเดี่ยว มีพลังงานในการลุยงานและก้าวข้ามอุปสรรคสูงมาก",
      "เหมาะแก่การเริ่มต้นทำธุรกิจเชิงรุก การท้าทายสิ่งใหม่ หรือทำงานที่ต้องแข่งขันสูง",
      "ได้ทรัพย์สินขนาดใหญ่ เช่น ยานพาหนะ ที่ดิน หรือเครื่องจักรกลใหม่ๆ เข้ามาครอบครอง",
      "มีชัยชนะในการเจรจาต่อรองคดีความ หรือข้อพิพาทที่เคยเรื้อรังมานาน"
    ],
    negative: [
      "ระวังอุบัติเหตุจากการเดินทาง การทำงานเสี่ยงอันตราย หรือมีเกณฑ์เจ็บป่วยต้องผ่าตัด",
      "อารมณ์ฉุนเฉียว ขาดสติจนนำไปสู่การมีปากเสียงรุนแรง หรือการทะเลาะเบาะแว้งกับคนใกล้ชิด",
      "สูญเสียการเงินไปกับเรื่องของคดีความ การซ่อมแซมสิ่งของชำรุด หรือการเสียค่าปรับต่างๆ",
      "ระวังโรคภัยไข้เจ็บเกี่ยวกับระบบเลือด ความดันโลหิตสูง และอุบัติเหตุเกี่ยวกับไฟหรือของมีคม"
    ],
    summary: "ช่วงทศาแห่งการบุกเบิก การต่อสู้ และพละกำลัง (ระยะเวลา 7 ปี) เป็นช่วงที่คุณจะมีพลังในการทำงานอย่างมหาศาล มีความกล้าคิดกล้าทำ เหมาะสำหรับการปฏิรูปชีวิต ย้ายงาน หรือทำโปรเจกต์เชิงรุก แต่เนื่องจากดาวอังคารเป็นดาวบาปเคราะห์ จึงต้องระมัดระวังอุบัติเหตุจากการเดินทาง การใช้อารมณ์ตัดสินปัญหา และหลีกเลี่ยงการปะทะคารมทุกรูปแบบ"
  },
  "ราหู": {
    positive: [
      "มีโอกาสเกิดโชคลาภฟลุ๊คๆ ก้อนโต ได้เงินก้อนโตจากการเสี่ยงโชค โครงการระยะสั้น หรือธุรกิจสีเทา",
      "มีเกณฑ์ได้เดินทางไปต่างประเทศ ได้ร่วมงานกับคนต่างชาติ หรือริเริ่มทำธุรกิจออนไลน์ระดับสากล",
      "หลุดพ้นจากกรอบชีวิตเดิมๆ มีการเปลี่ยนแปลงโชคชะตาอย่างพลิกฝันจากหน้ามือเป็นหลังมือ",
      "มีไหวพริบปฏิภาณเฉียบแหลมในการเอาตัวรอด แก้ไขสถานการณ์เฉพาะหน้าได้ยอดเยี่ยม"
    ],
    negative: [
      "ระวังการหลงผิด ลุ่มหลงมัวเมาในอบายมุข สิ่งเสพติด หรือถูกหลอกลวงหักหลังจากมิตรสหาย",
      "มีเรื่องวุ่นวายใจ คดีความขึ้นโรงขึ้นศาล หรือมีเรื่องอื้อฉาวเสื่อมเสียชื่อเสียง",
      "สุขภาพมีเกณฑ์เจ็บป่วยด้วยโรคหาสาเหตุยาก อาการแพ้ยา หรือปัญหาทางจิตใจ วิตกกังวลซึมเศร้า",
      "การเงินผันผวนรุนแรง ได้มาง่ายแต่ก็จ่ายออกไปอย่างรวดเร็วกับรายจ่ายที่ไม่คาดคิด"
    ],
    summary: "ช่วงทศาแห่งมรสุมชีวิต การเปลี่ยนแปลง และโชคลาภพลิกผัน (ระยะเวลา 18 ปี) พลังของดาวราหูจะนำความปั่นป่วนและโอกาสแปลกใหม่เข้ามาพร้อมๆ กัน ชีวิตมีเกณฑ์เดินทางไกล ย้ายที่อยู่ หรือทำงานเบื้องหลัง ค้าขายออนไลน์เด่นมาก แต่ต้องระมัดระวังเรื่องคดีความ การลงทุนที่มีความเสี่ยงสูงเกินไป และการมีสติสัมปชัญญะไม่หลงไปกับสิ่งยั่วยวนรอบตัว"
  },
  "พฤหัสบดี": {
    positive: [
      "ยุคทองแห่งความก้าวหน้า ชีวิตพบความร่มเย็นอุดมสมบูรณ์ ได้รับการเลื่อนขั้นเกียรติยศสูงสุด",
      "ประสบความสำเร็จอย่างยิ่งใหญ่ในการศึกษา หาความรู้เพิ่มเติม หรือการสอบแข่งขันบรรจุข้าราชการ",
      "ผู้ใหญ่ ครูบาอาจารย์ และผู้ทรงคุณวุฒิให้ความเมตตารักใคร่ คอยอุปถัมภ์สนับสนุนทุกด้าน",
      "มีสุขภาพร่างกายแข็งแรง โรคภัยไข้เจ็บที่เป็นอยู่จะบรรเทาเบาบางและหายขาดไปในที่สุด"
    ],
    negative: [
      "ระวังความเฉื่อยชา เฉื่อยแฉะ ปล่อยเวลาผ่านไปโดยเปล่าประโยชน์เนื่องจากชีวิตราบรื่นเกินไป",
      "อาจมีความเห็นต่างขัดแย้งกับผู้ใหญ่ในเรื่องของหลักการ ศีลธรรม หรือความถูกต้อง",
      "ระวังปัญหาสุขภาพที่เกิดจากน้ำหนักตัวเพิ่มขึ้น โรคเบาหวาน หรือไขมันอุดตัน",
      "ระวังการใจดีช่วยเหลือผู้อื่นมากเกินไปจนทำให้ตัวเองต้องเดือดร้อนภายหลัง"
    ],
    summary: "ช่วงทศาแห่งมหาโชค ปัญญา และความเจริญรุ่งเรืองสูงสุด (ระยะเวลา 16 ปี) ถือเป็นช่วงเวลาที่ดีและปลอดภัยที่สุดช่วงหนึ่งของชีวิต พลังดาวศุภเคราะห์ดวงใหญ่จะดึงดูดสิ่งดีๆ เข้ามาหาคุณอย่างต่อเนื่อง เหมาะอย่างยิ่งสำหรับการขยายธุรกิจ การแต่งงานมีบุตร การแสวงหาความก้าวหน้าทางปัญญาและจิตวิญญาณ ควรใช้โอกาสนี้ทำบุญกุศลและช่วยเหลือสังคมเพื่อเสริมบารมีให้ยั่งยืน"
  },
  "เสาร์": {
    positive: [
      "สร้างความมั่นคงในชีวิตระยะยาวได้สำเร็จ ได้ครอบครองอสังหาริมทรัพย์ ที่ดิน หรือบ้านหลังใหญ่",
      "มีความอดทน อดกลั้น แข็งแกร่ง สามารถแบกรับงานหนักและโปรเจกต์ระยะยาวจนสำเร็จได้",
      "ได้รับมรดกตกทอด หรือผลประโยชน์จากการตรากตรำทำงานหนักในอดีตย้อนกลับมาส่งผล",
      "มีความคิดที่สุขุมรอบคอบเป็นผู้ใหญ่ ไม่ประมาทในการดำเนินชีวิต"
    ],
    negative: [
      "ชีวิตมีความเครียดสูง วิตกกังวล ซึมเศร้า หรือต้องเผชิญกับอุปสรรคขัดขวางตลอดเวลา",
      "ระวังปัญหาสุขภาพเกี่ยวกับกระดูก ข้อต่อ ฟัน เส้นเอ็น และความเจ็บป่วยเรื้อรังรักษายาก",
      "มีเกณฑ์พลัดพรากจากคนรัก สูญเสียญาติผู้ใหญ่ หรือต้องแยกทางกับคนสนิทใกล้ตัว",
      "ภาระหนี้สินกดดันหนัก เงินทองติดขัด หมุนเวียนไม่ทัน ต้องเหน็ดเหนื่อยมากกว่าปกติหลายเท่า"
    ],
    summary: "ช่วงทศาแห่งกรรมเก่า อุปสรรค และบททดสอบความอดทน (ระยะเวลา 19 ปี) เป็นช่วงที่ดาวบาปเคราะห์ดวงใหญ่ส่งผลกดดันโชคชะตา ชีวิตจะเจอกับความล่าช้า การสูญเสีย และภาระหน้าที่ที่หนักหน่วง ต้องใช้สติ ความซื่อสัตย์ และความมานะบากบั่นในการฟันฝ่า ดูแลสุขภาพกายและสุขภาพจิตให้ดี หลีกเลี่ยงการกู้หนี้ยืมสินและการทำธุรกิจที่มีความเสี่ยงสูงในช่วงนี้"
  },
  "พุธ": {
    positive: [
      "การเจรจาติดต่อสื่อสารประสบความสำเร็จอย่างดีเยี่ยม ค้าขายรุ่งเรือง มีกำไรงอกเงย",
      "โดดเด่นในงานด้านเอกสาร การเขียน หนังสือ การประชาสัมพันธ์ และงานสมาคมทุกรูปแบบ",
      "สติปัญญาเฉียบแหลม เรียนรู้สิ่งใหม่ๆ ได้รวดเร็ว มีหัวการค้าและแก้ไขปัญหาธุรกิจเก่งกาจ",
      "ได้มิตรภาพที่ดี ได้เพื่อนฝูงหรือคู่ค้ารายใหม่ๆ เข้ามาร่วมงานสร้างความเจริญ"
    ],
    negative: [
      "ระวังคำพูด ข้อเขียน หรือการสื่อสารที่คลาดเคลื่อนสร้างความเข้าใจผิดและนำภัยมาให้ตนเอง",
      "มีความลังเลใจ โลเล ตัดสินใจช้าจนเสียโอกาสทางธุรกิจที่สำคัญไปต่อหน้าต่อตา",
      "ระวังความเครียดสะสม ปัญหาเกี่ยวกับระบบประสาท ความจำ หรือระบบทางเดินหายใจ",
      "อาจมีข้อพิพาทร้าวฉานกับเพื่อนฝูงคนใกล้ตัวอันเกิดจากการเข้าใจผิดในเรื่องคำพูด"
    ],
    summary: "ช่วงทศาแห่งปัญญา การค้าขาย และการปฏิสัมพันธ์ทางสังคม (ระยะเวลา 17 ปี) พลังดาวพุธส่งเสริมให้ชีวิตมีความคล่องตัวสูง เหมาะสำหรับการเจรจาต่อรอง การลงทุนค้าขายระยะสั้น และการศึกษาหาความรู้ใหม่ๆ การติดต่อสื่อสารจะเป็นกุญแจสำคัญสู่ความสำเร็จ ควรฝึกฝนการเป็นผู้ฟังที่ดี ควบคุมความลังเลใจ และระมัดระวังการลงนามในเอกสารสัญญาต่างๆ"
  },
  "เกตุ": {
    positive: [
      "มีลางสังหรณ์ แม่นยำ สิ่งศักดิ์สิทธิ์และเทวดาประจำตัวคอยปกป้องคุ้มครองให้แคล้วคลาด",
      "มีความสนใจในเรื่องธรรมะ จิตวิญญาณ ศาสตร์เร้นลับ หรือการทำสมาธิพัฒนาจิตใจ",
      "ได้โชคลาภหรือเหตุการณ์ดีๆ เข้ามาโปรดแบบกะทันหันไม่คาดฝัน (ปาฏิหาริย์)",
      "หลุดพ้นจากความเครียดทางโลก ปล่อยวางเรื่องวุ่นวายใจและมีความสุขสงบภายในตน"
    ],
    negative: [
      "รู้สึกโดดเดี่ยว อ้างว้าง อยากปลีกตัวออกจากสังคม หรือถูกคนรอบข้างเข้าใจผิดมองข้าม",
      "ชีวิตมีความผันผวนสูง เกิดเหตุการณ์ไม่คาดฝันบ่อยครั้งจนทำให้แผนการชีวิตสะดุด",
      "ระวังความคิดฟุ้งซ่าน วิตกกังวลในเรื่องจิตวิญญาณ หรือเกิดความกลัวในสิ่งที่มองไม่เห็น",
      "อาจสูญเสียสิ่งของมีค่า หรือต้องสูญเสียผลประโยชน์ไปเนื่องจากการปล่อยวางเกินไป"
    ],
    summary: "ช่วงทศาแห่งจิตวิญญาณ ปาฏิหาริย์ และความสันโดษ (ระยะเวลา 7 ปี) เป็นช่วงที่ชีวิตจะหันเข้าสู่ความสงบ พลังของดาวเกตุจะนำพาคุณไปสู่การเรียนรู้สัจธรรมของชีวิต มีลางสังหรณ์ที่เฉียบคม เหมาะแก่การสะสมเสบียงบุญ ศึกษาธรรมะ หรือเดินทางไปจาริกแสวงบุญตามสถานที่ศักดิ์สิทธิ์ ควรเตรียมพร้อมรับมือกับความผันผวนกะทันหันด้วยการมีสติอยู่เสมอ"
  },
  "ศุกร์": {
    positive: [
      "ชีวิตเต็มไปด้วยความสุข ความบันเทิงเริงใจ ประสบความสำเร็จในความรักและการแต่งงาน",
      "การเงินมั่งคั่งร่ำรวย มีโชคลาภหลั่งไหลเข้ามา หยิบจับอะไรก็เป็นเงินเป็นทองรุ่งเรือง",
      "ได้ครอบครองของสวยงาม ศิลปะ อัญมณี เสื้อผ้าหรูหรา หรือได้ยานพาหนะคันใหม่",
      "มีเกียรติยศและบารมีเพิ่มพูน มีผู้คนยกย่องสรรเสริญและมาร่วมยินดีในความสำเร็จ"
    ],
    negative: [
      "ระวังความฟุ่มเฟือย สุรุ่ยสุร่าย ใช้จ่ายเงินทองเกินตัวไปกับสิ่งเร้าความเพลิดเพลิน",
      "มีปัญหาขัดแย้งในเรื่องของความรัก ความสัมพันธ์ซ้อน หรือปัญหาชู้สาวชวนปวดหัว",
      "ระวังโรคภัยที่เกี่ยวกับระบบสืบพันธุ์ ไต ระบบปัสสาวะ และสุขภาพผิวพรรณ",
      "อาจเกิดความลุ่มหลงในกิเลส ตัณหา จนละเลยหน้าที่ความรับผิดชอบที่สำคัญ"
    ],
    summary: "ช่วงทศาที่ยาวนานที่สุด (ระยะเวลา 20 ปี) แห่งความสุข ความรัก และโลกียทรัพย์ พลังดาวศุภเคราะห์ที่เด่นด้านการเงินและความรักจะช่วยดลบันดาลให้ชีวิตคุณมีความสุขสบาย มั่งคั่ง มีเสน่ห์แรงกล้า เหมาะแก่การสร้างครอบครัว ขยายการลงทุน หรือทำงานสายศิลปะ บันเทิง ความงาม ควรแบ่งเงินทองไปทำบุญและสำรองเงินไว้เพื่อป้องกันการใช้จ่ายสุรุ่ยสุร่าย"
  }
};

function getDayOfWeekFromISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function calcDashas(birthISO, currentYear, isWednesdayNight) {
  const dow = getDayOfWeekFromISO(birthISO);
  
  // กำหนดตำแหน่งเริ่มต้น
  let startIdx = DASHA_BIRTH_PLANET_IDX[dow] ?? 0;
  // กรณีคนเกิดวันพุธกลางคืน (Rahu เสวยอายุตัวแรก)
  if (dow === 3 && isWednesdayNight) {
    startIdx = 3; // Index 3 คือ ราหู
  }

  const birthYear = parseInt(birthISO.split("-")[0]);
  const ageNow    = currentYear - birthYear;

  // สร้างลำดับทศาทั้งหมดตั้งแต่เกิด
  const dashas = [];
  let yearCursor = 0;
  for (let cycle = 0; cycle < 3; cycle++) { // 3 รอบ ครอบคลุม 360 ปี
    for (let i = 0; i < 9; i++) {
      const idx = (startIdx + i) % 9;
      const planet = DASHA_ORDER[idx];
      
      const duration = planet.years;
      const ageStart = yearCursor;
      const ageEnd   = yearCursor + duration;
      
      dashas.push({
        planet: planet.planet,
        icon: planet.icon,
        color: planet.color,
        element: planet.element,
        years: duration,
        ageStart: ageStart,
        ageEnd: ageEnd,
        yearStartCal: birthYear + ageStart,
        yearEndCal: birthYear + ageEnd
      });
      
      yearCursor += duration;
    }
  }

  // ค้นหาทศาช่วงอายุขัยปัจจุบัน
  const activeIdx = dashas.findIndex(d => ageNow >= d.ageStart && ageNow < d.ageEnd);
  
  return {
    dashas: dashas.slice(0, 15), // แสดง 15 ช่วงอายุแรกก็เพียงพอ
    activeIdx: activeIdx !== -1 ? activeIdx : 0
  };
}

function renderDashaPage() {
  const dateInput = document.getElementById("dashaBirthDate");
  const resultDiv = document.getElementById("dashaContent");
  if (!dateInput || !resultDiv) return;

  const birthISO = dateInput.value;
  if (!birthISO) {
    resultDiv.innerHTML = `<div class="alert alert-warning text-center mt-3">กรุณาระบุวันเกิด หรือเลือกสมาชิกจากประวัติก่อนทำการคำนวณ</div>`;
    return;
  }

  const curYear = new Date().getFullYear();
  
  // ตรวจสอบเช็คพุธกลางคืน
  const wedNightCheckbox = document.getElementById("dashaWedNight");
  const isWednesdayNight = wedNightCheckbox ? wedNightCheckbox.checked : false;

  const { dashas, activeIdx } = calcDashas(birthISO, curYear, isWednesdayNight);
  const activeDasha = dashas[activeIdx];
  const pred = DASHA_PRED[activeDasha.planet] || { positive:[], negative:[], summary:"" };

  let html = `
    <!-- แสดงผลทศาเสวยอายุในปัจจุบัน -->
    <div class="active-dasha-card p-4 mb-4 mt-3" style="background:rgba(212,175,55,0.08);border:2px solid #d4af37;border-radius:15px;box-shadow: 0 4px 15px rgba(212,175,55,0.15);">
      <h3 style="color:#d4af37;font-weight:700;" class="mb-3 text-center text-md-left">
        <i class="fas fa-history mr-2"></i> ปัจจุบันดวงชะตาตกอยู่ภายใต้ทศา: 
        <span style="color:${activeDasha.color};font-size:1.8rem;">
          ${activeDasha.icon} ดาว${activeDasha.planet} (ธาตุ${activeDasha.element})
        </span>
      </h3>
      <p style="font-size:1.15rem;color:#fff;opacity:0.9;line-height:1.7;">
        <strong>อายุช่วงเสวย:</strong> ย่างเข้าอายุ ${activeDasha.ageStart + 1} ปี ถึงอายุ ${activeDasha.ageEnd} ปี 
        (ครอบคลุมปี พ.ศ. ${activeDasha.yearStartCal + 543} ถึง พ.ศ. ${activeDasha.yearEndCal + 543})
      </p>
      
      <hr style="border-top:1px solid rgba(212,175,55,0.3);">
      
      <div class="row">
        <!-- ด้านบวก -->
        <div class="col-md-6 mb-3">
          <h5 class="text-success font-weight-bold mb-2"><i class="fas fa-check-circle mr-1"></i> จุดเด่นและสิ่งดีๆ ที่จะเกิดขึ้น (เกณฑ์บวก)</h5>
          <ul class="text-white-50 pl-3" style="line-height:1.6;font-size:1.05rem;">
            ${pred.positive.map(item => `<li class="mb-1">${item}</li>`).join("")}
          </ul>
        </div>
        <!-- ด้านลบ -->
        <div class="col-md-6 mb-3">
          <h5 class="text-danger font-weight-bold mb-2"><i class="fas fa-exclamation-circle mr-1"></i> ข้อควรระวังและอุปสรรค (เกณฑ์ลบ)</h5>
          <ul class="text-white-50 pl-3" style="line-height:1.6;font-size:1.05rem;">
            ${pred.negative.map(item => `<li class="mb-1">${item}</li>`).join("")}
          </ul>
        </div>
      </div>
      
      <div class="mt-2 p-3 rounded" style="background:rgba(0,0,0,0.3);border-left:4px solid ${activeDasha.color};">
        <h6 class="font-weight-bold mb-1" style="color:${activeDasha.color};"><i class="fas fa-bookmark mr-1"></i> บทสรุปแนวทางการดำเนินชีวิตตามตำราหลวง:</h6>
        <p class="text-white mb-0" style="line-height:1.6;font-size:1.05rem;">${pred.summary}</p>
      </div>
    </div>

    <!-- ตารางวัฏจักรช่วงชีวิต 120 ปี (Vimshottari Dasha Wheel) -->
    <h4 style="color:#d4af37;" class="mt-4 mb-3"><i class="fas fa-list-ol mr-2"></i> ลำดับวัฏจักรอายุทศาดาว (Vimshottari Dasha Cycle)</h4>
    <div class="table-responsive">
      <table class="table table-dark table-hover table-bordered text-center" style="border:1px solid rgba(255,255,255,0.1);">
        <thead>
          <tr style="background:rgba(0,0,0,0.5);">
            <th style="color:#d4af37;">ช่วงที่</th>
            <th style="color:#d4af37;">ดาวเสวยอายุ</th>
            <th style="color:#d4af37;">ระยะเวลาเสวย (ปี)</th>
            <th style="color:#d4af37;">ย่างเข้าช่วงอายุ (ปี)</th>
            <th style="color:#d4af37;">ช่วงปี พ.ศ. ที่เสวย</th>
            <th style="color:#d4af37;">สถานะดวง</th>
          </tr>
        </thead>
        <tbody>
          ${dashas.map((d, index) => {
            const isActive = index === activeIdx;
            const bgStyle = isActive ? `background:rgba(212,175,55,0.15);font-weight:bold;border:1px solid #d4af37;` : "";
            const statusLabel = isActive ? `<span class="badge badge-warning p-2" style="font-size:0.85rem;"><i class="fas fa-star mr-1"></i> อายุตกช่วงนี้</span>` : `<span class="text-white-50">-</span>`;
            return `
              <tr style="${bgStyle}">
                <td>${index + 1}</td>
                <td><span style="color:${d.color}">${d.icon} ดาว${d.planet}</span></td>
                <td>${d.years} ปี</td>
                <td>ย่าง ${d.ageStart + 1} - ${d.ageEnd} ปี</td>
                <td>พ.ศ. ${d.yearStartCal + 543} - พ.ศ. ${d.yearEndCal + 543}</td>
                <td>${statusLabel}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- คำอธิบายเพิ่มเติมตำรา -->
    <div class="card mt-4 bg-dark text-white border-secondary">
      <div class="card-body">
        <h5 style="color:#d4af37;" class="mb-2"><i class="fas fa-info-circle mr-1"></i> ข้อมูลทางวิชาการโหราศาสตร์:</h5>
        <p style="color:#ccc;font-size:0.95rem;margin:0;line-height:1.7;">
          ทศาดาว (Vimshottari Dasha) มาจากคัมภีร์โหราศาสตร์อินเดียโบราณ ซึ่งมีลักษณะการแบ่งพลังขับเคลื่อนชีวิตมนุษย์ออกเป็นคาบใหญ่รวม 120 ปี 
          โดยเริ่มนับดาวเสวยดวงแรกอิงตามวันเกิด (หรือจันทรคติสัมพัทธ์) โดยแต่ละดาวเสวยจะควบคุมโชคชะตาของบุคคลนั้นๆ 
          ระบบนี้จะช่วยเผยให้เห็นว่าช่วงชีวิตช่วงใดของคุณคือช่วงขาขึ้นที่สุด (ทศาพฤหัสบดี, ทศาศุกร์) และช่วงใดคือช่วงที่กรรมเก่าเข้ามาทดสอบแรงกดดันมากที่สุด (ทศาเสาร์, ทศาราหู) 
          ช่วยให้สามารถวางแผนชีวิต ลิขิตเป้าหมายการเงินและการงานได้อย่างรอบคอบสูงสุดครับ
        </p>
      </div>
    </div>`;

  resultDiv.innerHTML = html;

  // เพิ่มปุ่มโพสต์ Facebook สำหรับ Admin
  if (typeof window.addFacebookPostButtonsForAdmin === 'function') {
      window.addFacebookPostButtonsForAdmin("dashaContent", () => {
          return `🪐 ผลทำนายทศาดาว (Vimshottari Dasha) จากสยามโหรามงคล\nขณะนี้ดวงชะตารายปีตกอยู่ภายใต้ทศา: ดาว${activeDasha.planet} (ย่างอายุ ${activeDasha.ageStart + 1} - ${activeDasha.ageEnd} ปี)\n\n• บทสรุปคำทำนายตามตำราหลวง:\n${pred.summary}`;
      });
  }
}

function checkDashaWednesday() {
  const dateInput = document.getElementById("dashaBirthDate");
  const wedRow = document.getElementById("dashaWednesdayTimeRow");
  if (!dateInput || !wedRow) return;

  const val = dateInput.value;
  if (val) {
    const dow = getDayOfWeekFromISO(val);
    if (dow === 3) {
      wedRow.style.display = "block";
    } else {
      wedRow.style.display = "none";
      // หากไม่ใช่พุธ ให้เคลียร์เครื่องหมายเช็คพุธกลางคืนออก
      const checkbox = document.getElementById("dashaWedNight");
      if (checkbox) checkbox.checked = false;
    }
  } else {
    wedRow.style.display = "none";
  }
}

function dashaMemberSelected(selectEl) {
  const val = selectEl.value;
  if (!val) return;
  
  // ค้นข้อมูลวันเกิดของสมาชิกจากประวัติ
  const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
  const member = allHistory.find(m => m.memberId === val) || allHistory.find(m => m.birthdate === val);
  
  if (member && member.birthdate) {
    const dateInput = document.getElementById("dashaBirthDate");
    if (dateInput) {
      let formattedDate = member.birthdate;
      
      // แปลงรูปแบบ DD/MM/YYYY เป็น YYYY-MM-DD
      if (formattedDate.includes('/')) {
        const parts = formattedDate.split('/');
        let year = parseInt(parts[2]);
        if (year > 2400) year -= 543; // แปลงปี พ.ศ. เป็น ค.ศ.
        formattedDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else if (formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0];
      }
      
      dateInput.value = formattedDate;
      
      // อัปเดตสวิตช์เวลาเกิด และรันการคำนวณอัตโนมัติ
      checkDashaWednesday();
      
      // เช็คเพิ่มเติมว่าในโปรไฟล์เก็บเวลาเกิดเป็นช่วงกลางคืนไว้หรือไม่
      const checkbox = document.getElementById("dashaWedNight");
      if (checkbox) {
        // หากมีเก็บเวลาในรูปชั่วโมง/นาที และตกพุธกลางคืน (ตั้งแต่ 18:00 - 05:59 น.)
        if (member.birthtime) {
          const hr = parseInt(member.birthtime.split(":")[0]);
          if (hr >= 18 || hr < 6) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        }
      }
      
      renderDashaPage();
    }
  }
}

function showDashaPage() {
  const c = document.getElementById("dashaContainer");
  if (!c) return;

  const isoDate = localStorage.getItem("userBirthdate") || "";
  let dispDate  = isoDate;
  if (isoDate) {
    const [y, m, d] = isoDate.split("-").map(Number);
    dispDate = `${d}/${m}/${y + 543}`;
  }

  c.innerHTML = `
    <div class="headpage">
      <h1>🪐 ทศาดาว</h1>
      <p class="text">ช่วงอายุดาวเจ้าของตามหลักโหราศาสตร์ไทย-อินเดีย (120 ปี)</p>
    </div>
    <div class="container">
      <div class="card shadow-lg" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
        <div class="card-body p-4">
          <div class="row justify-content-center mb-4">
            <!-- ตัวเลือกสมาชิก -->
            <div class="col-md-5 mb-3 mb-md-0">
              <label class="text-gold mb-1">👥 เลือกสมาชิกจากประวัติ</label>
              <select id="dashaMemberSelect" class="member-selector-shared form-control bg-dark text-white border-gold" onchange="autoFillMemberData(this.value); dashaMemberSelected(this)">
                <option value="">-- เลือกสมาชิก --</option>
              </select>
            </div>
            <div class="col-md-5">
              <label class="text-gold mb-1">วัน/เดือน/ปีเกิด</label>
              <div class="input-group">
                <input type="date" id="dashaBirthDate" class="form-control bg-dark text-white border-gold"
                  value="${isoDate}"
                  style="border-radius:10px 0 0 10px;"
                  onchange="checkDashaWednesday()"
                  onkeydown="if(event.key==='Enter') renderDashaPage()">
                <div class="input-group-append">
                  <button class="btn btn-gold" onclick="renderDashaPage()" style="border-radius:0 10px 10px 0;">
                    <i class="fas fa-calculator mr-1"></i> คำนวณ
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- แผงสลับ พุธกลางวัน / พุธกลางคืน (ซ่อนไว้เริ่มต้น แสดงเมื่อคำนวณวันเกิดตกวันพุธ) -->
          <div class="row justify-content-center mb-3" id="dashaWednesdayTimeRow" style="display:none;">
            <div class="col-md-10 text-center">
              <div class="p-3 rounded border border-warning" style="background:rgba(212,175,55,0.06);display:inline-block;padding: 10px 30px !important;">
                <span class="text-gold font-weight-bold mr-3"><i class="fas fa-clock"></i> เกิดวันพุธ เลือกเวลาตกฟาก:</span>
                <div class="custom-control custom-radio custom-control-inline text-white">
                  <input type="radio" id="dashaWedDay" name="dashaWedTime" class="custom-control-input" checked onchange="renderDashaPage()">
                  <label class="custom-control-label" for="dashaWedDay">☀️ พุธกลางวัน (06.00 - 17.59 น.)</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline text-white">
                  <input type="radio" id="dashaWedNight" name="dashaWedTime" class="custom-control-input" onchange="renderDashaPage()">
                  <label class="custom-control-label" for="dashaWedNight">🌙 พุธกลางคืน (18.00 - 05.59 น.)</label>
                </div>
              </div>
            </div>
          </div>
          
          <div id="dashaContent"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
        <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
      </div>
    </div>`;

  // อัปเดตรายชื่อสมาชิกในดรอปดาวน์ทันทีที่แสดงผลหน้า Dasha
  if (typeof window.updateAllMemberSelectors === "function") {
    const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
    window.updateAllMemberSelectors(allHistory);
  }

  // เรียกตรวจเช็ควันเกิดเริ่มต้นว่าเป็นวันพุธหรือไม่
  checkDashaWednesday();

  if (isoDate) setTimeout(renderDashaPage, 80);
}

document.addEventListener("DOMContentLoaded", showDashaPage);
window.showDashaPage   = showDashaPage;
window.renderDashaPage = renderDashaPage;
window.dashaMemberSelected = dashaMemberSelected;
window.checkDashaWednesday = checkDashaWednesday;
