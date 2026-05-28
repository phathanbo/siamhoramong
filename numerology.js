"use strict";

/**
 * numerology.js
 * ระบบวิเคราะห์เลขศาสตร์มงคล (เบอร์โทร, ทะเบียนรถ, เลขบ้าน)
 * เวอร์ชันเสถียร – ทำงานร่วมกับ element.js และ knowledge-data.js ได้สมบูรณ์
 */

const luckyPairs = {
    "14": "คู่สติปัญญา: เจรจาน่าเชื่อถือ ผู้ใหญ่เอ็นดู", "41": "คู่สติปัญญา: เจรจาน่าเชื่อถือ ผู้ใหญ่เอ็นดู",
    "15": "คู่มิตรผู้อุปถัมภ์: มีเสน่ห์ มีคนช่วยเหลือตลอด", "51": "คู่มิตรผู้อุปถัมภ์: มีเสน่ห์ มีคนช่วยเหลือตลอด",
    "24": "คู่เลขเมตตา: วาจาเป็นเงินเป็นทอง ค้าขายคล่อง", "42": "คู่เลขเมตตา: วาจาเป็นเงินเป็นทอง ค้าขายคล่อง",
    "36": "คู่เลขการค้า: หาเงินเก่ง มีโชคลาภด้านการเงิน", "63": "คู่เลขการค้า: หาเงินเก่ง มีโชคลาภด้านการเงิน",
    "45": "คู่เทพพยากรณ์: ประสบความสำเร็จอย่างมั่นคง", "54": "คู่เทพพยากรณ์: ประสบความสำเร็จอย่างมั่นคง",
    "56": "คู่ทรัพย์คู่โชค: การเงินและความรักสมบูรณ์", "65": "คู่ทรัพย์คู่โชค: การเงินและความรักสมบูรณ์",
    "78": "คู่มหาอำนาจ: บารมีสูง มีโชคจากธุรกิจใหญ่", "87": "คู่มหาอำนาจ: บารมีสูง มีโชคจากธุรกิจใหญ่",
    "19": "คู่ความสำเร็จ: โดดเด่น มีชื่อเสียงวาสนาดี", "91": "คู่ความสำเร็จ: โดดเด่น มีชื่อเสียงวาสนาดี",
    "23": "คู่เสน่ห์แรง: มีเสน่ห์ดึงดูดใจ มีลาภลอย", "32": "คู่เสน่ห์แรง: มีเสน่ห์ดึงดูดใจ มีลาภลอย"
};

// ตัวอย่างคำทำนายเลขศาสตร์ (เลือกเลขเด่นๆ มาเป็นตัวอย่าง)
const fortuneMeanings = {
    1: "พลังแห่งดวงอาทิตย์: มีความเชื่อมั่นในตนเองสูง มีบารมี ชอบความเป็นหนึ่ง แต่อาจจะดื้อรั้นและโดดเดี่ยวในบางครั้ง",
    2: "พลังแห่งดวงจันทร์: อ่อนโยน มีจินตนาการสูง เมตตามหานิยมดีเยี่ยม แต่จิตใจอ่อนไหวและลังเลได้ง่าย",
    3: "พลังแห่งดาวอังคาร: กล้าหาญ ขยันขันแข็ง รักพวกพ้อง แต่ต้องระวังอารมณ์ร้อนและการตัดสินใจที่วู่วาม",
    4: "พลังแห่งดาวพุธ: ปฏิภาณไหวพริบเป็นเลิศ ช่างเจรจา ปรับตัวเก่ง เหมาะกับงานขายหรืองานประสานงาน",
    5: "พลังแห่งดาวพฤหัสบดี: มีปัญญาเป็นเลิศ ผู้ใหญ่เมตตาเอ็นดู ชีวิตมักประสบความสำเร็จด้วยคุณธรรม",
    6: "พลังแห่งดาวศุกร์: เด่นด้านศิลปะ ความรัก และการบันเทิง มีเสน่ห์เหลือล้น การเงินมักไม่ขาดมือ",
    7: "พลังแห่งดาวเสาร์: มีความอดทนสูง แบกรับภาระหนักได้ดี แต่ชีวิตมักต้องเหนื่อยยากก่อนจึงจะพบความสำเร็จ",
    8: "พลังแห่งราหู: กล้าได้กล้าเสีย มีลาภลอยกะทันหัน ฉลาดแกมโกง แต่ระวังเรื่องลุ่มหลงในอบายมุข",
    9: "พลังแห่งพระเกตุ: มีสิ่งศักดิ์สิทธิ์คุ้มครอง ลางสังหรณ์แม่นยำ ชีวิตมักแคล้วคลาดจากอันตราย",
    10: "พลังแห่งการเริ่มต้น: มีความทะเยอทะยานสูง ชอบความท้าทาย แต่ต้องระวังเรื่องความเครียดและสุขภาพ",
    11: "พลังความขัดแย้ง: ภายนอกดูอ่อนโยนแต่ภายในแข็งกร้าว มีความคิดขัดแย้งในตัวเองสูง ทำคุณคนไม่ขึ้น",
    12: "พลังแห่งโมหะ: ชีวิตมักเจออุปสรรคและเรื่องวุ่นวาย ถูกชักจูงได้ง่าย ต้องใช้สติในการนำทางชีวิต",
    13: "พลังแห่งความรุนแรง: มีอุปสรรคเข้ามาทดสอบบ่อยครั้ง แต่ถ้าผ่านไปได้จะรวยและมั่นคงแบบกะทันหัน",
    14: "พลังแห่งสติปัญญา: เป็นเลขมงคล มีชื่อเสียงจากการพูดและการเขียน ชีวิตมีความรุ่งโรจน์และสงบสุข",
    15: "พลังแห่งเสน่ห์เมตตา: เป็นเลขมหาเสน่ห์ มีผู้ใหญ่คอยอุปถัมภ์ค้ำชูตลอดเวลา ชีวิตมีความสุขสมบูรณ์",
    16: "พลังแห่งความพยายาม: ประสบความสำเร็จจากการลงมือทำด้วยตนเอง มีวิสัยทัศน์ไกลแต่ต้องระวังเรื่องรักสามเส้า",
    17: "พลังแห่งภาระ: ต้องแบกรับหน้าที่สำคัญ มีอำนาจวาสนาแต่ชีวิตมีความกดดันสูง ต้องอดทนจึงจะสำเร็จ",
    18: "พลังแห่งความผันผวน: การเงินและการงานขึ้นลงไม่แน่นอน ระวังการถูกหักหลังหรือมีเรื่องอื้อฉาว",
    19: "พลังแห่งความสำเร็จอันยิ่งใหญ่: มีความโดดเด่นในสังคม มีโชคลาภวาสนาดีมาก เป็นมงคลแก่ชีวิต",
    20: "พลังแห่งจินตนาการ: มีหัวก้าวหน้า คิดการณ์ใหญ่ แต่ต้องระวังเรื่องการเพ้อฝันที่เกินความเป็นจริง",
    21: "พลังแห่งความไม่แน่นอน: เบื้องต้นมีความสำเร็จดีเยี่ยม แต่บั้นปลายต้องระวังความประมาทจะทำให้ล้มเหลว",
    22: "พลังแห่งความเพ้อฝัน: มีเสน่ห์มาก แต่ใจอ่อนและหูเบาเกินไป ชีวิตมักถูกผู้อื่นชักจูงได้ง่าย",
    23: "พลังเสน่ห์เจ้าชู้: มีเสน่ห์ดึงดูดเพศตรงข้ามอย่างแรง มีลาภผลจากความพยายาม แต่ระวังปัญหาชู้สาว",
    24: "พลังแห่งความสุขสมบูรณ์: เป็นเลขมหามงคลสูงสุด การงาน การเงิน ความรัก ราบรื่นและดีเยี่ยมทุกด้าน",
    25: "พลังแห่งการต่อสู้: ชีวิตต้องฟันฝ่าอุปสรรคอย่างหนักในช่วงต้น แต่จะประสบความสำเร็จอย่างยั่งยืนในตอนจบ",
    26: "พลังแห่งสุนทรียภาพ: รักความสบาย ชอบงานศิลปะ มีโชคลาภจากการเจรจา แต่ระวังเรื่องการใช้จ่ายเกินตัว",
    27: "พลังแห่งความทุกข์: มักมีความเครียดและความกดดันสูง ชีวิตเจอเรื่องพลิกผันบ่อย ต้องหมั่นทำบุญเสริมดวง",
    28: "พลังแห่งการเสี่ยงโชค: กล้าตัดสินใจ มีบารมีในการคุมคน มีลาภลอยกะทันหัน เหมาะกับงานเสี่ยงๆ",
    29: "พลังแห่งโชคลาภ: มีความเชื่อมั่นสูง มีสิ่งศักดิ์สิทธิ์ให้ลาภผล ร่ำรวยแบบไม่คาดฝัน ชีวิตโดดเด่น",
    30: "พลังแห่งความพลิกผัน: ชีวิตมักเจอเหตุการณ์ที่คาดไม่ถึงทั้งดีและร้าย มีความคิดที่แหวกแนวไม่เหมือนใคร",
    31: "พลังแห่งอุปสรรค: ต้องเหนื่อยยากและสู้ด้วยลำแข้งตนเอง ชีวิตมีความขัดแย้งและอุปสรรคเข้ามาตลอด",
    32: "พลังเมตตามหานิยม: มีเสน่ห์แรง มีคนคอยช่วยเหลือเสมอ การงานราบรื่นเพราะมีคอนเนกชันดี",
    33: "พลังแห่งความดุเดือด: อารมณ์ร้อน ขี้โมโห แต่อดทนและเก่งกล้า ระวังเรื่องอุบัติเหตุและคำพูด",
    34: "พลังแห่งปัญญา: มีไหวพริบดี แก้ปัญหาเฉพาะหน้าเก่ง แต่ชีวิตต้องผ่านบททดสอบที่ยากลำบาก",
    35: "พลังการสนับสนุน: ได้รับความเมตตาจากผู้ใหญ่ มีลาภผลจากการทำงานร่วมกับคนอื่น ชีวิตมั่นคง",
    36: "พลังแห่งมงคล: เป็นเลขที่ดีมากเรื่องความรักและการเงิน ชีวิตมีความสุข สบาย และสมหวัง",
    37: "พลังแห่งความวิริยะ: ต้องทำงานหนักและแบกรับความรับผิดชอบที่เกินตัว แต่จะมั่นคงในระยะยาว",
    38: "พลังแห่งอำนาจมืด: ระวังการถูกชักจูงไปในทางที่ผิด หรือถูกใส่ร้ายป้ายสี มีลาภจากการเสี่ยงโชค",
    39: "พลังแห่งชัยชนะ: มีดวงในการแข่งขันสูง มีโชคจากการติดต่อสื่อสาร และมีพลังขับเคลื่อนในชีวิตดีมาก",
    40: "พลังแห่งการเปลี่ยนแปลง: มีชีวิตที่โลดโผน ชอบเดินทางหรือติดต่อกับชาวต่างชาติ ชีวิตมักพบเรื่องตื่นเต้น",
    41: "พลังแห่งความรุ่งเรือง: มีสติปัญญาฉลาดหลักแหลม มีโชคลาภวาสนาดี การงานมีความก้าวหน้าต่อเนื่อง",
    42: "พลังแห่งความนุ่มนวล: มีเสน่ห์ทางคำพูด มิตรสหายมาก ชีวิตมีความสุขสมหวังทั้งเรื่องงานและเรื่องรัก",
    43: "พลังแห่งการพลิกแพลง: มีอุปสรรคเข้ามาบ่อยแต่ใช้ปัญญาเอาชนะได้เสมอ ต้องระวังเรื่องคดีความ",
    44: "พลังแห่งความสำเร็จ: เด่นด้านการพูดและการเจรจาต่อรอง มีชื่อเสียงขจรไกล การเงินคล่องตัว",
    45: "พลังเทพพยากรณ์: เป็นเลขมงคลยิ่งยวด มีสติปัญญาสูงส่ง มีความสำเร็จอย่างยิ่งใหญ่ในชีวิต",
    46: "พลังแห่งความสุข: ชีวิตราบรื่น มีโชคลาภและเสน่ห์เหลือล้น เป็นที่รักของคนรอบข้าง",
    47: "พลังความเหนื่อยยาก: ต้องใช้ความเพียรอย่างหนักกว่าจะสำเร็จ ระวังเรื่องการถูกเอารัดเอาเปรียบ",
    48: "พลังแห่งความลุ่มหลง: ระวังการใช้ชีวิตที่ประมาทหรือหลงไปในทางที่ผิด มีลาภลอยแต่เก็บเงินไม่อยู่",
    49: "พลังแห่งความเครียด: ประสบความสำเร็จแต่อาจต้องแลกมาด้วยความกังวลหรือสุขภาพกายที่ไม่แข็งแรง",
    50: "พลังแห่งต่างแดน: มีดวงเดินทางไปต่างประเทศหรือทำงานกับคนต่างชาติ มีโชคลาภจากทางไกล",
    51: "พลังอำนาจบารมี: มีดวงเป็นเจ้าคนนายคน มีความเชื่อมั่นและบารมีสูง ชีวิตมีความมั่นคงมั่งคั่ง",
    52: "พลังแห่งการเกื้อหนุน: มีโชคลาภจากการสนับสนุนของเพศตรงข้ามหรือหุ้นส่วน ชีวิตดีมีความสุข",
    53: "พลังความขัดแย้ง: มักมีความเห็นขัดแย้งกับผู้ใหญ่หรือผู้มีอำนาจ ชีวิตมีอุปสรรคที่ต้องอดทนฝ่าฟัน",
    54: "พลังแห่งความรู้: มีปัญญาธรรมสูง ชอบศึกษาหาความรู้ ชีวิตประสบความสำเร็จด้วยลำแข้งตนเอง",
    55: "พลังแห่งความสุข: เป็นเลขมงคล มีชีวิตที่สุขสบาย ไม่เดือดร้อน มีความมั่นคงในหน้าที่การงาน",
    56: "พลังโชคลาภ: มีดวงเฮงเรื่องการเงินและความรักสมหวัง ชีวิตมีความลงตัวและมีความสุขมาก",
    57: "พลังแห่งความคิดผิด: ระวังการตัดสินใจที่ผิดพลาดหรือถูกหลอกลวง ชีวิตมีความกดดันในจิตใจ",
    58: "พลังความผันผวนกะทันหัน: ชีวิตขึ้นลงรวดเร็วเหมือนรถไฟเหาะ ต้องตั้งสติให้ดีในการรับมืออุปสรรค",
    59: "พลังสิ่งศักดิ์สิทธิ์: มีพระคุ้มครอง ลางสังหรณ์แม่นยำ ชีวิตมักมีทางออกที่คาดไม่ถึงเสมอ",
    60: "พลังแห่งความมั่งคั่ง: มีสุนทรียภาพในชีวิต รสนิยมดี การเงินมั่งคั่งและมีความสุขกับความงาม",
    61: "พลังแห่งความเพ้อฝัน: มีเสน่ห์แรงแต่ความรักมักไม่สมหวังดั่งใจ มีโชคลาภเข้ามาแต่ต้องแลกด้วยความวุ่นวายใจ",
    62: "พลังแห่งเสน่ห์ซ้อนอุปสรรค: มีคนเมตตาเอ็นดูมาก แต่ระวังเรื่องการใช้จ่ายฟุ่มเฟือยและความใจอ่อนจะนำภัยมาให้",
    63: "พลังแห่งรักและความสำเร็จ: เป็นเลขมงคลโดดเด่นเรื่องความรักและการงาน มีคนช่วยเหลือให้ประสบความสำเร็จอย่างรวดเร็ว",
    64: "พลังแห่งโชคลาภการเจรจา: มีปฏิภาณไหวพริบดีเยี่ยม หาเงินเก่งจากการติดต่อสื่อสาร ชีวิตมักมีความสุขสมบูรณ์",
    65: "พลังแห่งความราบรื่น: เป็นเลขคู่ทรัพย์คู่โชค ผู้ใหญ่ให้การสนับสนุนอย่างดี ชีวิตมีความมั่นคงและมีชื่อเสียง",
    66: "พลังแห่งความฟุ่มเฟือย: มีเสน่ห์เหลือล้นและโชคลาภทางโลก แต่ต้องระวังเรื่องการลุ่มหลงในกามารมณ์หรือการใช้เงินเกินตัว",
    67: "พลังแห่งความทุกข์ระทม: ชีวิตมักเจอเรื่องพลัดพรากหรือผิดหวังเรื่องความรักบ่อยครั้ง มีอุปสรรคที่ทำให้จิตใจหม่นหมอง",
    68: "พลังแห่งความรวยกะทันหัน: กล้าได้กล้าเสีย มีดวงทางลาภลอยหรือธุรกิจสีเทา แต่ระวังเรื่องคดีความและอบายมุข",
    69: "พลังแห่งการหมุนเวียน: การเงินคล่องตัวดีมาก มีชื่อเสียงโดดเด่นในสังคม มีเสน่ห์ที่ดึงดูดทั้งโชคลาภและผู้คน",
    70: "พลังแห่งความสันโดษ: ชีวิตมักเจอเรื่องที่ทำให้ต้องอยู่คนเดียว หรือมีโลกส่วนตัวสูง ระวังโรคเครียดหรือโรคที่หาสาเหตุไม่ได้",
    71: "พลังแห่งความพยายามที่โดดเดี่ยว: ประสบความสำเร็จสูงแต่ไร้คนเข้าใจ มักต้องแบกภาระและแก้ไขปัญหาเพียงลำพัง",
    72: "พลังแห่งความผันผวนของทรัพย์สิน: ชีวิตขึ้นลงแรงเหมือนน้ำขึ้นน้ำลง มีลาภผลแต่ระวังการถูกคดโกงหรือคดีความเรื่องเงิน",
    73: "พลังแห่งอุบัติเหตุ: ชีวิตมีแต่อุปสรรคและเหตุการณ์ไม่คาดฝันระคายเคืองใจบ่อยครั้ง ต้องใช้ชีวิตด้วยความไม่ประมาท",
    74: "พลังแห่งความหลอกลวง: ระวังการถูกหักหลังหรือคำพูดที่เชื่อใจไม่ได้ ชีวิตมีอุปสรรคจากการตัดสินใจที่ผิดพลาด",
    75: "พลังแห่งปัญญาที่ผิดทาง: มีสติปัญญาดีแต่ชอบใช้ในทางที่เสี่ยง ระวังความขัดแย้งกับผู้ใหญ่หรือกฎหมาย",
    76: "พลังแห่งความโศกเศร้า: ชีวิตรักมักมีปัญหาแทรกแซงบ่อยครั้ง มีความสำเร็จในงานแต่จิตใจขาดความสุข",
    77: "พลังแห่งเคราะห์กรรม: ต้องรับภาระหนักหนาสาหัส เจออุปสรรคซ้ำซาก ต้องอาศัยความอดทนและบุญกุศลอย่างมาก",
    78: "พลังแห่งโชคลาภก้อนใหญ่: มีผู้ทรงอิทธิพลคอยช่วยเหลือ มีลาภลอยกะทันหัน แต่ชีวิตมักเกี่ยวพันกับเรื่องสีเทา",
    79: "พลังแห่งลางสังหรณ์: มีความลึกลับในตัวเอง มีสิ่งศักดิ์สิทธิ์คุ้มครอง มักมีชีวิตที่แปลกแยกจากคนทั่วไปแต่ปลอดภัย",
    80: "พลังแห่งความทุกข์เรื้อรัง: ชีวิตแบกความเครียดและความกดดันมานาน ระวังสุขภาพและปัญหาที่สะสางไม่จบสิ้น",
    81: "พลังแห่งความสำเร็จที่แลกด้วยความเหนื่อย: มีอำนาจบารมีดีแต่ชีวิตต้องต่อสู้อย่างหนักและมีศัตรูคอยขัดขวาง",
    82: "พลังแห่งเสน่ห์ดึงดูดปัญหา: มีเสน่ห์มากแต่ก็นำพาความวุ่นวายมาให้ไม่หยุดหย่อน ระวังเรื่องอารมณ์และคนรอบข้าง",
    83: "พลังแห่งความวุ่นวาย: ชีวิตมีเหตุให้ต้องเดินทางหรือเปลี่ยนแปลงกะทันหัน ระวังอุบัติเหตุและปัญหาสุขภาพ",
    84: "พลังแห่งการนินทา: มีไหวพริบดีแต่มักถูกใส่ร้ายป้ายสี มีเรื่องอื้อฉาว หรือมีความลับที่ไม่อยากเปิดเผย",
    85: "พลังแห่งความฉลาดแกมโกง: ทันคน เอาตัวรอดเก่ง มีโชคด้านธุรกิจแต่อาจต้องใช้เล่ห์เหลี่ยมในการแข่งขัน",
    86: "พลังแห่งอบายมุข: มีโชคลาภจากการเสี่ยงโชคดีมาก แต่ระวังชีวิตจะลุ่มหลงจนเสียการเสียงานและเสียเงินทอง",
    87: "พลังแห่งหนี้สิน: ระวังการถูกเบียดเบียนเรื่องเงินทอง หรือต้องแบกภาระหนี้แทนคนอื่น ชีวิตมีความเครียดสูง",
    88: "พลังแห่งความมั่งคั่งมหาศาล: เป็นเลขที่มีพลังอำนาจบารมีสูงมาก เหมาะกับนักธุรกิจใหญ่ มีลาภผลและโชคลาภดีเยี่ยม",
    89: "พลังแห่งความศักดิ์สิทธิ์ยั่งยืน: มีเทวดาคุ้มครอง มีอายุยืนยาว ประสบความสำเร็จในชีวิตอย่างมั่นคงและสงบสุข",
    90: "พลังแห่งความลี้ลับ: มีลางสังหรณ์แม่นยำ ชีวิตมักเกี่ยวข้องกับเรื่องมูเตลูหรือความเชื่อโบราณ แคล้วคลาดปลอดภัย",
    91: "พลังแห่งเกียรติยศที่หนักอึ้ง: มีชื่อเสียงโด่งดัง มีอำนาจวาสนาดี แต่ชีวิตขาดความเป็นส่วนตัวและมีความกดดัน",
    92: "พลังแห่งโชคลาภและความรัก: มีดวงดีเรื่องความรักและมิตรภาพ มีเสน่ห์และมีคนคอยอุปถัมภ์ไม่ขาดสาย",
    93: "พลังแห่งความเร็วและชัยชนะ: ทำอะไรมักประสบความสำเร็จอย่างรวดเร็ว มีโชคจากการแข่งขันและการเดินทาง",
    94: "พลังแห่งการติดต่อสื่อสารที่ยอดเยี่ยม: มีสติปัญญาดีเด่นด้านการพูดและการเจรจา ชีวิตมีความเจริญรุ่งเรือง",
    95: "พลังแห่งความรุ่งโรจน์ยิ่งใหญ่: มีความสำเร็จระดับสูง ผู้ใหญ่ให้ความเมตตา มีชีวิตที่อุดมสมบูรณ์",
    96: "พลังแห่งความสุขและทรัพย์สมบัติ: มีรสนิยมดี การเงินไหลมาเทมาไม่ขาดสาย มีความรักที่อบอุ่นและสมบูรณ์",
    97: "พลังแห่งความอดทนสู่ความสำเร็จ: ต้องผ่านบททดสอบที่ยากลำบากก่อนจึงจะยิ่งใหญ่และเป็นที่ยอมรับของสังคม",
    98: "พลังแห่งโชคดีในต่างแดน: มีดวงถูกโฉลกกับชาวต่างชาติหรือการเดินทางไกล มีความก้าวหน้าในชีวิตต่างถิ่น",
    99: "พลังแห่งมงคลสูงสุด: มีสิ่งศักดิ์สิทธิ์คุ้มครองอย่างแรงกล้า ชีวิตมีความสุข สงบ และประสบความสำเร็จอย่างปาฏิหาริย์",
    100: "พลังแห่งความสมบูรณ์แบบ: เป็นเลขที่ให้พลังอำนาจที่เต็มเปี่ยม ชีวิตสมบูรณ์พูนสุขในทุกด้านและมีชื่อเสียงขจรไกล",
};

function showNumerologyPage() {
    navigateTo('numerologyPage');
}

// ฟังก์ชันเปลี่ยน UI ตามประเภทที่เลือก
function updateNumUI(type) {
    const label = document.getElementById('inputLabel');
    const input = document.getElementById('phoneNumber');
    const btn = document.getElementById('btnAnalyze');
    
    input.value = "";
    document.getElementById('numerologyResult').innerHTML = "";

    if (type === 'phone') {
        label.innerText = "กรอกหมายเลขโทรศัพท์:";
        input.placeholder = "0XXXXXXXXX";
        btn.innerHTML = "✨ วิเคราะห์เบอร์มือถือ";
        input.inputMode = "tel"; // ให้คีย์บอร์ดมือถือโชว์ตัวเลข
    } else if (type === 'car') {
        label.innerText = "กรอกทะเบียนรถ:";
        input.placeholder = "1กข1234";
        btn.innerHTML = "✨ วิเคราะห์ทะเบียนรถ";
        input.inputMode = "text"; // ให้คีย์บอร์ดมือถือโชว์ตัวอักษร
    } else if (type === 'home') {
        label.innerText = "กรอกเลขที่บ้าน:";
        input.placeholder = "123/45";
        btn.innerHTML = "✨ วิเคราะห์เลขที่บ้าน";
        input.inputMode = "decimal"; // ให้คีย์บอร์ดมีทั้งเลขและเครื่องหมาย /
    }
}

// เพิ่มฟังก์ชันช่วยวิเคราะห์เกรด
// ฟังก์ชันวิเคราะห์ (ฉบับแก้ไขจุดผิด)
function analyzeNumber() {
    const inputField = document.getElementById('phoneNumber');
    if (!inputField) return;

    const resultDiv = document.getElementById('numResult'); // กล่องที่มีปุ่มเซฟภาพ
    if (resultDiv) {
        // บรรทัดสำคัญ: ต้องสั่งให้แสดงผลหลังจากคำนวณเสร็จ
        resultDiv.style.display = 'block'; 
    }
    const typeMap = {
        'phone': 'หมายเลขโทรศัพท์ หมายเลข ',
        'car': 'ทะเบียนรถ เลขที่ ',
        'home': 'เลขที่บ้าน เลขที่ '
    };

    // --- แก้ไขจุดนี้: ต้องดึงค่า type มาก่อนจะเอาไปใช้เช็คเงื่อนไขข้างล่าง ---
    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    // 1. ล้างค่าเครื่องหมายขีด (-) ออกก่อนเพื่อนำไปคำนวณ
    let inputRaw = inputField.value.trim();    if (type === 'phone') {
        // ถ้าเป็นเบอร์โทร: เอาเฉพาะตัวเลขเท่านั้น
        inputRaw = inputField.value.replace(/\D/g, '').trim();
    } else {
        // ถ้าเป็นทะเบียนรถ/บ้าน: เก็บทั้งตัวเลขและตัวอักษรไทยไว้คำนวณ
        inputRaw = inputField.value.replace(/[^0-9ก-ฮ\/]/g, '').trim();
    }
    
    if (inputRaw.length === 0) {
        alert("กรุณากรอกหมายเลขก่อนครับ");
        return;
    }
    
    // (ใส่ Logic เงื่อนไขเกรดตามด้านบน)
    // ล้างค่าให้เหลือแค่ตัวเลขและตัวอักษรไทย (สำหรับใช้บวกผลรวม)
    let cleanInput = inputRaw.replace(/[^0-9ก-ฮ]/g, '');

    const shareTypeName = document.getElementById('shareTypeName');
    if (shareTypeName) shareTypeName.innerText = typeMap[type] || 'หมายเลข';

    let sum = 0;

    // --- LOGIC การคำนวณ ---
    if (type !== 'phone' && !isNaN(inputRaw) && inputRaw.length <= 2) {
        sum = parseInt(inputRaw);
    } 
    else {
        const thaiToNum = {
            "ก":1,"ข":1,"ค":1,"ฆ":1,"ง":1,
            "จ":2,"ฉ":2,"ช":2,"ซ":2,"ฌ":2,
            "ญ":3,"ฎ":3,"ฏ":3,"ฐ":3,"ฑ":3,"ฒ":3,"ณ":3,
            "ด":4,"ต":4,"ถ":4,"ท":4,"ธ":4,"น":4,
            "บ":5,"ป":5,"ผ":5,"ฝ":5,"พ":5,"ฟ":5,"ภ":5,"ม":5,
            "ย":6,"ร":6,"ล":6,"ว":6,
            "ศ":7,"ษ":7,"ส":7,"ห":7,"ฬ":7,"ฮ":7
        };
        
        for (let char of cleanInput) {
        if (/[0-9]/.test(char)) {
            sum += parseInt(char);
        } else if (thaiToNum[char]) {
            sum += thaiToNum[char];
        }
    }
    }

    // ปรับผลรวมให้อยู่ในฐานข้อมูล 1-100
    let finalSum = sum;
    if (sum > 100) {
        finalSum = sum % 100;
        if (finalSum === 0) finalSum = 100;
    }
    if (sum === 0) finalSum = 1;

    // ดึงความหมายและเกรด
    const meaning = (typeof fortuneMeanings !== 'undefined') ? fortuneMeanings[finalSum] : "พลังแห่งการเปลี่ยนแปลง";
    const scores = (typeof calculateLuckScores === 'function') ? calculateLuckScores(cleanInput) : {money:5, work:5, love:5, health:5};

    const inputNumDisplay = document.getElementById('inputNumDisplay');
    if (inputNumDisplay) {
        inputNumDisplay.innerText = inputField.value; 
    }

    // --- Logic แกะคู่เลขมหาเฮง ---
    let pairsHTML = "";
    if (type === 'phone' && inputRaw.length >= 7) {
        let lastFour = inputRaw.substring(inputRaw.length - 4);
        let pairList = [
            lastFour.substring(0, 2),
            lastFour.substring(1, 3),
            lastFour.substring(2, 4)
        ];

        let foundPairs = [];
        pairList.forEach(p => {
            if (typeof luckyPairs !== 'undefined' && luckyPairs[p]) {
                foundPairs.push(`<div class="mb-1"><span class="badge badge-warning" style="font-size:1rem;">${p}</span> <small>${luckyPairs[p]}</small></div>`);
            }
        });

        if (foundPairs.length > 0) {
            pairsHTML = `
                <div class="mt-3 p-2 rounded" style="background: rgba(212, 175, 55, 0.1); border: 1px dashed #d4af37;">
                    <h6 style="text-align: center; color: #d4af37; font-size: 0.9rem;"><i class="fas fa-gem"></i> คู่เลขเด่นมงคลในเบอร์</h6>
                    <div class="text-center" style="font-size: 0.9rem;">${foundPairs.join('')}</div>
                </div>
            `;
        }
    }

    // --- เพิ่มส่วนนี้เพื่อหาเกรดและสีตามผลรวม ---
    let analysis = { grade: 'B', color: '#FFD700' }; // ค่าเริ่มต้น

    if (finalSum >= 90) {
        analysis = { grade: 'A+', color: '#52ffc0' };
    } else if (finalSum >= 80) {
        analysis = { grade: 'A', color: '#baff52' };
    } else if (finalSum >= 65) {
        analysis = { grade: 'B+', color: '#ffeb3b' };
    } else if (finalSum >= 50) {
        analysis = { grade: 'B', color: '#ffc107' };
    } else if (finalSum >= 40) {
        analysis = { grade: 'C', color: '#ff9800' };
    } else {
        analysis = { grade: 'D', color: '#ff5722' };
    }
    

    // ... โค้ดส่วนคำนวณเดิมของคุณด้านบน ...

    // --- ปรับปรุงส่วนการแสดงผล (เพื่อให้ติดไปในรูปภาพ) ---
    resultDiv.innerHTML = `
    <div id="captureArea" class="card border-gold bg-dark text-white p-4 shadow animate__animated animate__fadeInUp" 
         style="border-radius: 20px; border: 2px solid ${analysis.color} !important; background: #1a1a1a;">
        
        <div class="text-center mb-2">
            <small class="text-gold-50" style="letter-spacing: 2px;">ใบพยากรณ์ศาสตร์ตัวเลข</small>
            <h3 class="mt-1" style="color: #fff; font-weight: 600;">${inputField.value}</h3>
            <div style="width: 50px; height: 2px; background: ${analysis.color}; margin: 10px auto;"></div>
        </div>

        <div class="text-center mb-3">
            <h6 class="text-white-50">ผลรวมพลังตัวเลข (${typeMap[type].split(' ')[0]})</h6>
            <div id="sumResult" style="font-size: 4.5rem; font-weight: bold; color: ${analysis.color}; line-height:1;">${sum}</div>
            <span class="badge" style="background:${analysis.color}; color:#000; font-size:1.2rem;">เกรด ${analysis.grade}</span>
        </div>

        <div class="row text-center mb-4" style="font-size: 0.9rem;">
            <div class="col-6 mb-2">💰 การเงิน: ${"⭐".repeat(scores.money)}</div>
            <div class="col-6 mb-2">💼 การงาน: ${"⭐".repeat(scores.work)}</div>
            <div class="col-6 mb-2">❤️ ความรัก: ${"⭐".repeat(scores.love)}</div>
            <div class="col-6 mb-2">🏥 สุขภาพ: ${"⭐".repeat(scores.health)}</div>
        </div>

        <div class="p-3 rounded mb-3" style="background: rgba(0,0,0,0.3); border: 1px solid ${analysis.color}44;">
            <p class="mb-0 text-center" style="font-size: 1.1rem; line-height: 1.6;">"${meaning}"</p>
        </div>
        
        ${pairsHTML}

        <div class="row no-gutters mt-4 share-buttons">
            <div class="col-12 p-1 mt-2">
                <button class="btn btn-gold btn-block btn-lg" onclick="downloadNumerologyImage(this)">
                    <i class="fas fa-certificate mr-2"></i> เซฟใบพยากรณ์ (รูปภาพ)
                </button>
            </div>
        </div>
        
        
    </div>        
    `;

    // ... ส่วนที่เหลือของฟังก์ชัน ...

    if (typeof updateShareTemplate === 'function') {
        updateShareTemplate(sum, meaning, analysis, pairsHTML);
    }
    
    inputField.blur();
}

function Numbertable(){
    const container = document.getElementById("numberlogypage")
    if(!container) return;

    const html = `
    <div class="card shadow-lg border-gold overflow-hidden">
            <div class="card-header bg-dark text-white text-center py-4 border-bottom-gold">
                <h2 class="text-gold mb-1">🔮 วิเคราะห์เลขศาสตร์มงคล</h2>
                <p class="text-white-50 mb-0 small">ทำนายพลังตัวเลขที่ส่งผลต่อชีวิตคุณ</p>
            </div>
            <div class="card-body bg-light">
                <div class="btn-group btn-group-toggle w-100 mb-4 shadow-sm" data-toggle="buttons">
                    <label class="btn btn-outline-gold active flex-fill">
                        <input type="radio" name="numType" value="phone" checked onchange="updateNumUI('phone')"> 📱
                        เบอร์มือถือ
                    </label>
                    <label class="btn btn-outline-gold flex-fill">
                        <input type="radio" name="numType" value="car" onchange="updateNumUI('car')"> 🚗 ทะเบียนรถ
                    </label>
                    <label class="btn btn-outline-gold flex-fill">
                        <input type="radio" name="numType" value="home" onchange="updateNumUI('home')"> 🏠 เลขที่บ้าน
                    </label>
                </div>
                <div class="form-group text-center">
                    <label for="phoneNumber" class="font-weight-bold text-dark" id="inputLabel">กรอกหมายเลข:</label>
                    <input type="text" class="form-control form-control-lg border-gold text-center shadow-inner"
                        id="phoneNumber" placeholder="08XXXXXXXX" oninput="validateInput(this)"
                        style="font-size: 1.5rem; letter-spacing: 2px; border-radius: 15px;">
                    <small class="text-muted mt-2 d-block"
                        id="inputHelp">*ระบบจะลบช่องว่างและอักษรพิเศษออกให้อัตโนมัติ</small>
                </div>
                <button class="btn btn-gold btn-block btn-lg shadow mt-4 py-3 font-weight-bold" id="btnAnalyze"
                    onclick="analyzeNumber()">
                    ✨ วิเคราะห์เบอร์มือถือ
                </button>
                <div id="numerologyResult" class="mt-4"></div>
                <div id="numResult" class="mt-4 p-4 rounded-lg"
                    style="display:none; background: #222; border: 1px solid #444;">
                    <div id="numScoreDisplay"></div>
                    <div id="numMeaningDisplay"></div>
                        <button class="btn btn-gold btn-lg px-5 share-num-btn" onclick="downloadNumerologyImage(this)">
                            <i class="fas fa-certificate mr-2"></i> เซฟใบพยากรณ์แชร์ลง Facebook
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
        </div>>
    `;
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    Numbertable();
});


function updateShareTemplate(sum, meaning, analysis, pairsHTML) {
    // ป้องกันกรณีส่งค่ามาไม่ครบ
    const safeAnalysis = analysis || { grade: "B", color: "#FF8C00" };
    
    // 1. ดึง Element ทั้งหมดและเช็คว่ามีตัวตนจริงไหม (กัน Error บรรทัด 318)
    const shareNumEl = document.getElementById('shareSumNum');
    const shareMeaningEl = document.getElementById('shareMeaning');
    const shareGradeEl = document.getElementById('shareGrade');
    const pairsEl = document.getElementById('sharePairs');
    const inputDisplayEl = document.getElementById('inputNumDisplay');
    const phoneInput = document.getElementById('phoneNumber');

    // 2. ใส่ข้อมูลเบอร์โทร
    if (inputDisplayEl && phoneInput) {
        inputDisplayEl.innerText = phoneInput.value;
    }

    // 3. ใส่ผลรวมและสี
    if (shareNumEl) {
        shareNumEl.innerText = sum;
        shareNumEl.style.color = safeAnalysis.color;
    }

    // 4. ใส่คำทำนาย
    if (shareMeaningEl) {
        shareMeaningEl.innerText = meaning;
    }

    // 5. ใส่เกรดและสีพื้นหลัง
    if (shareGradeEl) {
        shareGradeEl.innerText = "เกรด " + safeAnalysis.grade;
        shareGradeEl.style.backgroundColor = safeAnalysis.color;
        shareGradeEl.style.color = (safeAnalysis.grade === 'A+') ? '#000' : '#fff';
    }

    // 6. ใส่คู่เลข (แก้จุดที่ทำให้ Error และลบคำซ้ำ)
    if (pairsEl) {
        if (pairsHTML) {
            const temp = document.createElement('div');
            temp.innerHTML = pairsHTML;
            
            // ล้างคำซ้ำที่อาจติดมาจาก UI หน้าเว็บ
            let rawText = temp.innerText
                .replace(/คู่เลขเด่นมงคลในเบอร์/g, "")
                .replace(/คู่เลขมงคล/g, "")
                .replace(/:/g, "")
                .trim();
                
            pairsEl.innerText = "คู่เลขมงคล: " + rawText;
        } else {
            pairsEl.innerText = "พลังตัวเลขมงคลหนุนนำชีวิต";
        }
    }
}

// ฟังก์ชันสำหรับสร้างและดาวน์โหลดรูปภาพ
function generateShareImage(platform) {
    const element = document.getElementById('shareImageTemplate'); 
    const currentSumText = document.getElementById('sumResult')?.innerText;

    if (!currentSumText || currentSumText === "0") {
        alert("กรุณากรอกเลขและกดปุ่ม 'วิเคราะห์' ก่อนนะครับ");
        return;
    }

    if (!element) return;

    const gradeBadge = element.querySelector('#shareGrade');
    const pairsBox = element.querySelector('#sharePairs');
    const sumNumEl = element.querySelector('#shareSumNum');
    const meaningBox = element.querySelector('div[style*="background: rgba"]');
    const meaningText = element.querySelector('#shareMeaning');

    // รีเซ็ตสไตล์พื้นฐาน
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center'; // เปลี่ยนเป็น center เพื่อคุมกลุ่มก้อนข้อมูล

    if (platform === 'facebook') {
        element.style.width = '1200px';
        element.style.height = '630px'; // กลับมาใช้มาตราฐาน FB จะสวยกว่า
        element.style.padding = '30px 80px';

        if (sumNumEl) {
            sumNumEl.style.fontSize = '180px'; // ลดลงนิดนึงให้ดูหรู
            sumNumEl.style.margin = '10px 0';
        }
        if (gradeBadge) {
            gradeBadge.style.fontSize = '24px';
            gradeBadge.style.marginBottom = '0px';
        }
        if (meaningBox) {
            meaningBox.style.minHeight = 'auto'; // ให้ขยายตามเนื้อหา
            meaningBox.style.width = '90%';
            meaningBox.style.padding = '25px 40px';
            meaningBox.style.marginTop = '10px';
        }
        if (meaningText) {
            const text = meaningText.innerText;
            // ปรับ Line Height ให้โปร่งขึ้นจะทำให้อ่านง่ายและดูสวย
            meaningText.parentElement.style.lineHeight = '1.6';
            meaningText.parentElement.style.fontSize = text.length > 80 ? '22px' : '28px';
        }
        if (pairsBox) {
            pairsBox.style.fontSize = '22px';
            pairsBox.style.marginTop = '15px';
            pairsBox.style.opacity = '0.9';
        }

    } else { // Line (1080x1080)
        element.style.width = '1080px';
        element.style.height = '1080px';
        element.style.padding = '60px';

        if (sumNumEl) {
            sumNumEl.style.fontSize = '280px'; // จาก 320 ลดเหลือ 280 จะดูสมส่วนกว่า
            sumNumEl.style.margin = '20px 0';
        }
        if (gradeBadge) {
            gradeBadge.style.fontSize = '38px';
        }
        if (meaningBox) {
            meaningBox.style.minHeight = 'auto';
            meaningBox.style.width = '100%';
            meaningBox.style.padding = '50px';
        }
        if (meaningText) {
            meaningText.parentElement.style.lineHeight = '1.5';
            meaningText.parentElement.style.fontSize = meaningText.innerText.length > 100 ? '36px' : '42px';
        }
        if (pairsBox) {
            pairsBox.style.fontSize = '30px';
            pairsBox.style.marginTop = '40px';
        }
    }

    // ส่วนการวาดรูปคงเดิม...
    element.style.position = 'relative';
    element.style.visibility = 'visible';
    element.style.left = '0';
    element.style.top = '0';

    html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#1a1a1a'
    }).then(canvas => {
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        
        const imageDataURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `SiamHora-${platform}-${currentSumText}.png`;
        link.href = imageDataURL;
        link.click();
    });
}


// ฟังก์ชันช่วยดาวน์โหลด
function downloadImage(url, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    link.click();
}

// ฟังก์ชันดักจับปุ่ม Enter
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                analyzeNumber();
            }
        });
    }
});

// --- 1. ฟังก์ชัน Auto-Clean (ล้างข้อมูลขณะพิมพ์) ---
function validateInput(input) {
    // 1. เก็บค่าตำแหน่ง Cursor ไว้ก่อน (ป้องกัน Cursor กระโดดไปท้ายสุดเวลาพิมพ์แทรก)
    let selectionStart = input.selectionStart;
    let oldLength = input.value.length;

    // 2. ดึงค่าประเภทการวิเคราะห์
    const typeElement = document.querySelector('input[name="numType"]:checked');
    const type = typeElement ? typeElement.value : 'phone';

    if (type === 'phone') {
        // ล้างทุกอย่างที่ไม่ใช่ตัวเลข
        let value = input.value.replace(/\D/g, '').slice(0, 10);
        
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = value.substring(0, 3);
            if (value.length > 3) formattedValue += '-' + value.substring(3, 6);
            if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
        }
        input.value = formattedValue;
    } else if (type === 'home') {
        // เลขที่บ้าน: อนุญาต ตัวเลข, ก-ฮ, และเครื่องหมาย /
        input.value = input.value.replace(/[^0-9ก-ฮ\/]/g, '');
    } else {
        // ทะเบียนรถ: อนุญาต ตัวเลข และ ก-ฮ (ไม่เอา /)
        input.value = input.value.replace(/[^0-9ก-ฮ]/g, '');
    }

    // 3. คืนค่าตำแหน่ง Cursor (ป้องกัน Cursor กระโดดเวลาลบหรือแก้ไขกลางเบอร์)
    let newLength = input.value.length;
    selectionStart += (newLength - oldLength);
    input.setSelectionRange(selectionStart, selectionStart);
}

// --- 2. ฟังก์ชันวิเคราะห์คะแนนแยกด้าน (เพิ่มความน่าสนใจ) ---
function calculateLuckScores(input) {
    // Logic: สุ่มคะแนนโดยใช้เลขท้ายเป็น Seed เพื่อให้เลขเดิมได้คะแนนเท่าเดิมเสมอ
    let seed = 0;
    for(let char of input) seed += char.charCodeAt(0);
    
    const getScore = (offset) => ((seed + offset) % 5) + 1; // ได้คะแนน 1-5

    return {
        money: getScore(7),
        work: getScore(3),
        love: getScore(5),
        health: getScore(1)
    };
}

async function downloadNumerologyImage(element) {
    const area = document.getElementById('numResult'); 
    if (!area || area.style.display === 'none') {
        alert("กรุณาวิเคราะห์ตัวเลขก่อนทำการบันทึกภาพครับ");
        return;
    }

    let btn = element instanceof HTMLElement ? element : document.querySelector('.share-num-btn');
    const originalText = btn ? btn.innerHTML : "";

    // 1. เตรียมสถานะปุ่ม
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังออกใบพยากรณ์...';
    }

    // 2. สร้าง Header/Footer ชั่วคราว
    const header = document.createElement('div');
    header.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #d4af37; padding-bottom: 15px;">
            <h2 style="color: #d4af37; margin: 0; font-weight: bold;">📜 ผลวิเคราะห์เลขศาสตร์มงคล</h2>
            <div style="color: #fff; font-size: 14px; opacity: 0.8; margin-top: 5px;">สยามโหรามงคล - พยากรณ์ศาสตร์ตัวเลข</div>
        </div>
    `;

    const footer = document.createElement('div');
    footer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(212,175,55,0.3); color: #d4af37;">
            <div style="font-size: 14px;">🔮 <strong>สยามโหรามงคล - พยากรณ์ศาสตร์ตัวเลข</strong></div>
            <div style="font-size: 12px;">วิเคราะห์แม่นยำตามตำราเลขศาสตร์</div>
        </div>
    `;

    try {
        // --- ส่วนที่แก้ไข: การซ่อนปุ่มต้องอยู่ตรงนี้ ---
        const shareSection = area.querySelector('.share-buttons');
        if(shareSection) shareSection.style.display = 'none'; // ซ่อนกลุ่มปุ่มแชร์ทั้งหมด
        if(btn) btn.classList.add('d-none'); // ซ่อนปุ่มตัวเองด้วย

        const originalStyle = area.style.cssText;
        
        // ปรับแต่งสไตล์ชั่วคราวสำหรับรูปภาพ
        area.style.width = "550px";
        area.style.padding = "40px";
        area.style.background = "linear-gradient(145deg, #1a1a1a, #2a2a2a)";
        area.style.border = "2px solid #d4af37";
        area.style.borderRadius = "0px";
        
        area.insertBefore(header, area.firstChild);
        area.appendChild(footer);

        // รอ Browser Render แป๊บนึงเพื่อให้แน่ใจว่าปุ่มหายไปจริงๆ
        await new Promise(resolve => setTimeout(resolve, 100));

        const options = {
            backgroundColor: '#1a1a1a',
            scale: 2.2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY,
            windowWidth: 550
        };

        const canvas = await html2canvas(area, options);
        
        // --- คืนค่า UI กลับมาเหมือนเดิมทันทีหลังจากแคปเสร็จ ---
        area.removeChild(header);
        area.removeChild(footer);
        area.style.cssText = originalStyle;
        if(shareSection) shareSection.style.display = 'flex'; // แสดงปุ่มแชร์คืน
        if(btn) btn.classList.remove('d-none'); // แสดงปุ่มตัวเองคืน

        // จัดการเรื่องการดาวน์โหลด
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const numField = document.getElementById('phoneNumber'); // ดึงจาก ID ที่คุณใช้กรอกเบอร์
            const numValue = numField ? numField.value : 'เบอร์มงคล';
            
            link.download = `วิเคราะห์เลข_${numValue.replace(/[-\s]+/g, '')}.png`;
            link.href = url;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, 'image/png', 0.95);

    } catch (e) {
        console.error("Numerology Share Error:", e);
        alert("ไม่สามารถบันทึกภาพได้: " + e.message);
        // กรณี error ต้องคืนค่า UI ด้วย
        if(btn) btn.classList.remove('d-none');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}