"use strict";

/**
 * nameAnalysis.js
 * ระบบวิเคราะห์ชื่อ-นามสกุล (สยามโหรามงคล)
 * โดย ประธานโบ้
 */

const NameAnalysis = {
    // 1. ตารางค่าตัวเลขศาสตร์ไทย (มาตรฐานแม่นยำ)
    // ตารางค่าตัวเลขศาสตร์ไทย (ปรับปรุงแล้ว: ลบ duplicate key ทั้งหมด ใช้ค่าสุดท้ายตามมาตรฐานหลัก)
    // *** FIXED: เดิมมี 17 duplicate keys (JS ใช้ค่าหลังสุด) และ 'แต' เป็น 2-char key ที่ไม่มีวันตรงกับตัวอักษรใดเลย ***
    alphabetValues: {
        // ค่าตัวเลข 1
        'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ส': 1, 'า': 1, 'ำ': 1, 'ุ': 1,
        // ค่าตัวเลข 2
        'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2, 'ู': 2,
        // ค่าตัวเลข 3
        'ฆ': 3, 'ต': 3, 'ฑ': 3, 'ฒ': 3,
        // ค่าตัวเลข 4
        'ค': 4, 'ธ': 4, 'ญ': 4, 'ร': 4, 'ะ': 4,
        // ค่าตัวเลข 5
        'ฉ': 5, 'ฌ': 5, 'ฎ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
        // ค่าตัวเลข 6
        'จ': 6, 'ล': 6, 'ว': 6, 'ใ': 6,
        // ค่าตัวเลข 7
        'ซ': 7, 'ศ': 7, 'ษ': 7, 'ี': 7, 'ื': 7, 'เ': 7, 'แ': 7,
        // ค่าตัวเลข 8
        'ย': 8, 'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8, 'ึ': 8, '็': 8,
        // ค่าตัวเลข 9
        'ฏ': 9, 'ฐ': 9, 'ไ': 9, 'โ': 9, 'อ': 9, '์': 9, 'ิ': 9
    },

    // 2. ฟังก์ชันคำนวณผลรวม
    calculate: function(name) {
        if (!name) return 0;
        let sum = 0;
        // ลูปเช็คทีละตัวอักษรแล้วดึงค่าจาก alphabetValues
        for (let char of name) {
            sum += this.alphabetValues[char] || 0;
        }
        return sum;
    },

    // 3. ตัวอย่างคำทำนาย (ประธานสามารถเพิ่มให้ครบ 1-100 ได้ภายหลัง)
    getMeaning: function(num) {
        const data = {
            1: "เลขแห่งความเป็นผู้นำ: มีความเชื่อมั่นในตัวเองสูง มีสติปัญญาดี ชอบเอาชนะและไม่ยอมคน",
            2: "เลขแห่งจินตนาการ: อ่อนโยน เมตตา มีเสน่ห์ แต่ทางด้านจิตใจมักแปรปรวนง่าย",
            3: "เลขแห่งการต่อสู้: ขยัน อดทน กล้าหาญ แต่ระวังเรื่องใจร้อนและความใจดีเกินไป",
            4: "เลขแห่งสติปัญญา: ไหวพริบดีเลิศ ปรับตัวเก่ง เจรจาน่าเชื่อถือ เหมาะกับงานติดต่อสื่อสาร",
            5: "เลขแห่งความสำเร็จ: มีคุณธรรม ชอบศึกษาหาความรู้ ผู้ใหญ่ให้ความอุปถัมภ์ ชีวิตมักมั่นคง",
            6: "เลขแห่งศิลปะและบันเทิง: มีเสน่ห์ทางเพศสูง รักสวยรักงาม การเงินดี มีโชคลาภ",
            7: "เลขแห่งความอดทน: ต้องแบกรับภาระหนัก ชีวิตมักต้องฝ่าฟันอุปสรรคก่อนถึงจะสำเร็จ",
            8: "เลขแห่งราหู: มีไหวพริบในทางธุรกิจ ใจใหญ่ กล้าเสี่ยง แต่ระวังเรื่องมัวเมาและคดีความ",
            9: "เลขแห่งสิ่งศักดิ์สิทธิ์: มีลางสังหรณ์แม่นยำ มักแคล้วคลาดปลอดภัย มีอายุยืนยาว",
            10: "เลขแห่งความแปรปรวน: ชีวิตมีขึ้นมีลงไม่แน่นอน มักต้องเริ่มต้นใหม่บ่อยครั้ง",
            11: "เลขแห่งความทะเยอทะยาน: มีความทะเยอทะยานสูง มักทำอะไรสองอย่างในเวลาเดียวกัน ระวังถูกทรยศ",
            12: "เลขแห่งความย้อนแย้ง: ภายนอกดูเข้มแข็งแต่ภายในอ่อนแอ ระวังการถูกหลอกลวงหรือคิดผิดพลาด",
            13: "เลขแห่งการเปลี่ยนแปลง: ชีวิตมักเจอเหตุการณ์ไม่คาดฝันอย่างรวดเร็ว (ทั้งดีและร้าย)",
            14: "เลขดีมาก: มีสติปัญญาไหวพริบดีเยี่ยม ผู้ใหญ่เมตตาอุปถัมภ์ การงานรุ่งเรืองมั่นคง",
            15: "เลขแห่งมงคล: มีเสน่ห์ เมตตามหานิยม มีโชคลาภแบบไม่คาดฝัน ชีวิตมีความสุข",
            16: "เลขแห่งความสำเร็จปนอุปสรรค: มีชื่อเสียงและเงินทอง แต่ต้องระวังปัญหาเรื่องความรักและรถยนต์",
            17: "เลขแห่งความพยายาม: ชีวิตต้องเหนื่อยก่อนถึงจะสบาย มีตำแหน่งหน้าที่การงานสูงแต่มีศัตรูมาก",
            18: "เลขแห่งความวุ่นวาย: มักถูกนินทาใส่ร้าย ชีวิตเบื้องหลังมีความลับ ระวังเรื่องสุขภาพ",
            19: "เลขแห่งความสำเร็จ: มีอำนาจบารมี โดดเด่นในสังคม มักเป็นที่รู้จักและยอมรับกว้างขวาง",
            20: "เลขแห่งการเริ่มต้นใหม่: มักชอบริเริ่มโครงการใหม่ๆ มีหัวคิดก้าวหน้า แต่ระวังใจร้อนเกินไป",
            21: "เลขคู่ชู้ชื่น: มีเสน่ห์ มีคนรักใคร่เมตตาดี แต่ระวังเรื่องใจอ่อนและการถูกเอาเปรียบ",
            22: "เลขแห่งความเพ้อฝัน: จิตใจอ่อนไหวง่าย มีจินตนาการสูง เหมาะกับงานศิลปะ แต่ระวังถูกหลอก",
            23: "เลขเสน่ห์เมตตา: มีเสน่ห์ดึงดูดเพศตรงข้าม ผู้ใหญ่เอ็นดู ชีวิตมักได้รับการช่วยเหลือ",
            24: "เลขมหาเสน่ห์: เป็นเลขดีมาก การเงินคล่องตัว พูดจาเป็นเงินเป็นทอง มีโชคลาภตลอด",
            25: "เลขแห่งการต่อสู้เพื่อความสำเร็จ: ต้องผ่านอุปสรรคและการเปลี่ยนแปลงก่อนจะได้รับชัยชนะ",
            26: "เลขแห่งโลกีย์: รักสวยรักงาม มีโชคด้านการเงินและความรัก แต่อย่าประมาทเรื่องการใช้จ่าย",
            27: "เลขแห่งความเครียด: มีความรับผิดชอบสูง แบกรับภาระมาก ระวังเรื่องการคิดมากหรือนอนไม่หลับ",
            28: "เลขแห่งความกล้า: กล้าคิดกล้าทำ มีไหวพริบในการแก้ปัญหาดีเยี่ยม มักมีช่องทางหาเงินเก่ง",
            29: "เลขแห่งโชคลาภ: มีสิ่งศักดิ์สิทธิ์คุ้มครอง มักมีลาภลอยหรือได้อะไรมาแบบฟลุ๊คๆ",
            30: "เลขแห่งความไม่แน่นอน: ความคิดรวดเร็ว ปราดเปรียว แต่อารมณ์แปรปรวนง่าย ชีวิตมีเรื่องเซอร์ไพรส์บ่อย",
            31: "เลขแห่งอุปสรรค: ชีวิตมักเจอทางตันหรือความวุ่นวาย ต้องอาศัยความอดทนสูงมากถึงจะผ่านไปได้",
            32: "เลขแห่งเสน่ห์และการชิงดีชิงเด่น: มีเสน่ห์แรงแต่มีศัตรูเงียบ ระวังเรื่องรักสามเส้า",
            33: "เลขพลังฉุนเฉียว: ขยันขันแข็ง ทำงานไว แต่ใจร้อนและตัดสินใจรวดเร็วเกินไป",
            34: "เลขแห่งปัญญาและการเจรจา: เป็นคนมีความรู้ดี พูดจามีหลักการ แต่ระวังถูกนินทา",
            35: "เลขแห่งอำนาจ: มีบารมี มีคนเกรงใจ บริหารจัดการเก่ง ผู้ใหญ่มักให้การสนับสนุน",
            36: "เลขแห่งความรักและการเงิน: เป็นเลขมงคลมาก ชีวิตราบรื่น มีโชคด้านการเงินและคนรักอุปถัมภ์",
            37: "เลขแห่งวิบากกรรม: มักเจอเรื่องขัดแย้งหรืออุบัติเหตุ ต้องระวังความใจร้อนและการตัดสินใจผิดพลาด",
            38: "เลขแห่งความมัวเมา: มีไหวพริบดีแต่ระวังการหลงผิด หรือไปยุ่งเกี่ยวกับอบายมุข",
            39: "เลขแห่งชัยชนะ: มีสิ่งศักดิ์สิทธิ์ให้โชค มักจะชนะศัตรูและอุปสรรคได้อย่างไม่คาดฝัน",
            40: "เลขแห่งความทันสมัย: สนใจเรื่องเทคโนโลยีหรือสิ่งแปลกใหม่ มีหัวคิดก้าวหน้ากว่าคนอื่น",
            41: "เลขแห่งพลังปัญญา: การงานมั่นคง มีสติปัญญาดีเยี่ยม มักได้รับความร่วมมือจากผู้อื่นเสมอ",
            42: "เลขแห่งโชคลาภและเสน่ห์: เป็นที่รักของคนรอบข้าง วาจาศักดิ์สิทธิ์ พูดอะไรคนก็เชื่อถือและคล้อยตาม",
            43: "เลขแห่งการเปลี่ยนแปลง: มีไหวพริบดีแต่ชีวิตมักมีเรื่องให้ต้องตัดสินใจกะทันหัน ระวังการถูกหักหลัง",
            44: "เลขแห่งการเจรจา: มีฝีปากดี ฉลาดหลักแหลม แต่ระวังเรื่องการพูดตรงเกินไปจนสร้างศัตรู",
            45: "เลขมงคลสูงสุด: ประสบความสำเร็จทั้งการงานและความรัก มีโชคลาภและสิ่งศักดิ์สิทธิ์คุ้มครอง",
            46: "เลขแห่งความสุข: มีเสน่ห์ รักสวยรักงาม การเงินดี มีโชคด้านความรักและนิมิตหมายที่ดีในชีวิต",
            47: "เลขแห่งความเพียร: มีความรับผิดชอบสูงมาก มักต้องทำงานหนักเพื่อผู้อื่น แต่ผลตอบแทนจะคุ้มค่า",
            48: "เลขแห่งไหวพริบ: ฉลาดแกมโกงเล็กน้อย เอาตัวรอดเก่งในสถานการณ์คับขัน ระวังเรื่องการพนัน",
            49: "เลขแห่งความผันผวน: ชีวิตมีขึ้นมีลงอย่างรวดเร็ว มักสนใจเรื่องลี้ลับหรือศาสตร์แปลกใหม่",
            50: "เลขแห่งปัญญาและต่างประเทศ: มีดวงชะตาที่ต้องเดินทางหรือติดต่อกับต่างชาติ มีสติปัญญาเฉลียวฉลาด",
            51: "เลขแห่งความเฮง: มีโชคลาภแบบไม่คาดฝันเสมอ สติปัญญาดีเยี่ยม มีผู้ใหญ่คอยหนุนหลัง",
            52: "เลขแห่งนารีอุปถัมภ์: ชีวิตมักได้รับการช่วยเหลือจากเพศตรงข้าม มีเสน่ห์ แต่อย่าใจอ่อนจนเกินไป",
            53: "เลขแห่งการต่อสู้ที่ชนะ: มักเจออุปสรรคก่อนแต่จะเอาชนะได้ด้วยสติปัญญาและบารมี",
            54: "เลขแห่งความสำเร็จที่มั่นคง: มีความรู้รอบตัวสูง ชีวิตปลอดภัยจากอันตราย มีสิ่งศักดิ์สิทธิ์คุ้มครอง",
            55: "เลขแห่งความสุขและมงคล: ชีวิตสงบ ร่มเย็น มีความเจริญรุ่งเรืองแบบยั่งยืนด้วยคุณธรรม",
            56: "เลขคู่ทรัพย์คู่โชค: การเงินดีมาก ความรักสมบูรณ์แบบ เป็นเลขที่ส่งผลให้ชีวิตมั่งคั่ง",
            57: "เลขแห่งความขัดแย้ง: ความคิดเห็นมักไม่ตรงกับผู้ใหญ่ ระวังเรื่องอารมณ์และการตัดสินใจ",
            58: "เลขแห่งความลุ่มหลง: มีไหวพริบดีในเชิงธุรกิจ แต่ระวังการตัดสินใจผิดพลาดเพราะความใจร้อน",
            59: "เลขแห่งความศักดิ์สิทธิ์: มีลางสังหรณ์แม่นยำ แคล้วคลาดปลอดภัย มักมีโชคจากสิ่งลี้ลับ",
            60: "เลขแห่งศิลปะและการเงิน: มีรสนิยมดี การเงินไหลเวียนดี มีโชคด้านความรักแต่อาจจะเลือกมากไปหน่อย",
            61: "เลขแห่งความเพ้อฝัน: มีรสนิยมสูง รักความสบาย แต่ระวังเรื่องการใช้เงินเกินตัวและความรักที่ซับซ้อน",
            62: "เลขแห่งความอ่อนโยน: มีเสน่ห์ทางคำพูด มีคนเมตตาช่วยเหลือเสมอ การเงินหมุนเวียนดี",
            63: "เลขมหาเสน่ห์และการเงิน: เป็นเลขดีมาก มีเสน่ห์ดึงดูดและหาเงินเก่ง ประสบความสำเร็จอย่างรวดเร็ว",
            64: "เลขแห่งความโชคดี: มีชื่อเสียงและผู้อุปถัมภ์ดีเยี่ยม การเจรจานำมาซึ่งทรัพย์สินและโอกาสใหม่ๆ",
            65: "เลขคู่ทรัพย์คู่โชค: เป็นเลขมงคลสูงมาก มีปัญญาดีและโชคลาภเด่น ชีวิตมีความสมบูรณ์ทุกด้าน",
            66: "เลขแห่งความสำราญ: มีโชคด้านศิลปะ บันเทิง และความรัก แต่อาจจะใจอ่อนและรักสนุกเกินไป",
            67: "เลขแห่งความผิดหวัง: มักมีเรื่องขัดแย้งในครอบครัวหรือความรัก ชีวิตต้องระวังอุปสรรคที่มาแบบไม่คาดคิด",
            68: "เลขแห่งไหวพริบและอบายมุข: ฉลาดแกมโกง หาเงินเก่งในทางลัด แต่ระวังเรื่องกิเลสตัณหา",
            69: "เลขแห่งการหมุนเวียน: ชีวิตมีขึ้นมีลงตลอดเวลา แต่จะแคล้วคลาดด้วยสิ่งศักดิ์สิทธิ์และลางสังหรณ์",
            70: "เลขแห่งความกดดัน: มักแบกโลกไว้คนเดียว มีความเครียดสะสมหรือโรคประจำตัวที่ต้องดูแล",
            71: "เลขแห่งพลังที่ถูกจำกัด: มีความสามารถสูงแต่ถูกขัดขวาง ต้องอาศัยความเพียรอย่างหนักถึงจะสำเร็จ",
            72: "เลขแห่งการเปลี่ยนแปลงที่ดี: มักมีโชคจากการเดินทางหรือการย้ายที่อยู่ ชีวิตจะดีขึ้นตามลำดับ",
            73: "เลขแห่งอุปสรรคและการต่อสู้: ชีวิตมักเจอทางตันบ่อยครั้ง ต้องระวังอุบัติเหตุหรือความใจร้อน",
            74: "เลขแห่งการถูกนินทา: มีสติปัญญาดีแต่ระวังการถูกใส่ร้ายป้ายสี หรือปัญหาจากคำพูดของตัวเอง",
            75: "เลขแห่งคุณธรรมและปัญญา: ชอบช่วยเหลือผู้อื่น มีสติปัญญาดี แต่ชีวิตมักเหนื่อยเพื่อคนรอบข้าง",
            76: "เลขแห่งความวุ่นวายใจ: มักมีเรื่องเครียดเกี่ยวกับผลประโยชน์หรือความรักที่ไม่ลงตัว",
            77: "เลขแห่งความทุกข์ระทม: เป็นเลขที่ต้องระวังความเครียดสะสม อุปสรรคถาโถม และความโดดเดี่ยว",
            78: "เลขแห่งอำนาจบารมี: มีไหวพริบในการบริหารจัดการ มีโชคจากธุรกิจใหญ่และคนที่มีอิทธิพล",
            79: "เลขแห่งการหยั่งรู้: มีลางสังหรณ์ดีมาก สนใจศาสตร์ลี้ลับและเทคโนโลยี มักพบความสำเร็จแบบแปลกๆ",
            80: "เลขแห่งการเก็บกด: มักมีความลับในใจ หรือต้องแบกรับภาระที่บอกใครไม่ได้ ระวังเรื่องสุขภาพ",
            81: "เลขแห่งการต่อสู้เพื่อชัยชนะ: ชีวิตมีเรื่องให้ต้องฝ่าฟันตลอด แต่จะประสบความสำเร็จได้ด้วยความเพียรและสติปัญญา",
            82: "เลขแห่งอารมณ์ที่อ่อนไหว: มีจินตนาการกว้างไกล แต่อารมณ์มักแปรปรวน ระวังเรื่องการตัดสินใจผิดเพราะเชื่อคนง่าย",
            83: "เลขแห่งพลังความกล้า: ขยัน มั่นใจในตัวเองสูง ชอบการแข่งขัน แต่ระวังเรื่องใจร้อนและการมีปากเสียงกับคนรอบข้าง",
            84: "เลขแห่งไหวพริบในวิกฤต: เอาตัวรอดเก่งมากในสถานการณ์คับขัน มีความคิดสร้างสรรค์ดีเยี่ยมในการแก้ปัญหา",
            85: "เลขแห่งความรุ่งโรจน์: มีโชคลาภจากการเสี่ยงและธุรกิจ ชีวิตมักพบกับความโชคดีและการสนับสนุนจากผู้ใหญ่",
            86: "เลขแห่งความสุขสำราญ: รักความรื่นเริง มีโชคด้านความรักและศิลปะ แต่อาจจะตามใจตัวเองมากไปจนเสียงาน",
            87: "เลขแห่งความอดทนและมรดก: ชีวิตมักต้องรับภาระแทนคนอื่น แต่จะได้รับผลตอบแทนเป็นทรัพย์สมบัติหรืออสังหาริมทรัพย์",
            88: "เลขมหาเศรษฐี (Double Infinity): มีพลังด้านการเงินสูงมาก จับอะไรก็เป็นเงินเป็นทอง มีบารมีและโชคลาภมหาศาล",
            89: "เลขแห่งพลังอัศจรรย์: มีสิ่งศักดิ์สิทธิ์คุ้มครองแรงมาก มักแคล้วคลาดจากอันตรายและมีโชคลาภจากสิ่งลี้ลับ",
            90: "เลขแห่งการหยั่งรู้: มีลางสังหรณ์แม่นยำ สนใจเรื่องศาสนาและศาสตร์โบราณ ชีวิตมักได้รับความเมตตาจากสิ่งศักดิ์สิทธิ์",
            91: "เลขแห่งความโดดเด่น: มีชื่อเสียง มีพลังดึงดูดความสำเร็จ มักจะอยู่เหนือคู่แข่งในทุกด้าน",
            92: "เลขแห่งเมตตามหานิยม: มีคนรักใคร่ช่วยเหลือเสมอ วาจาเป็นเสน่ห์ การงานมักจะราบรื่นเพราะได้รับโอกาสดีๆ",
            93: "เลขแห่งชัยชนะและอำนาจ: มีพลังในการควบคุมบริวาร มักได้ตำแหน่งหน้าที่การงานสูงและชนะอุปสรรคทั้งปวง",
            94: "เลขแห่งความรุ่งเรืองด้วยปัญญา: เป็นคนมีความรู้ลึกซึ้ง แตกฉานในวิชาการ การเจรจานำมาซึ่งความสำเร็จที่ยั่งยืน",
            95: "เลขมหาจักรพรรดิ: เป็นเลขมงคลสูงสุด มีอำนาจ บารมี และความสุขสมบูรณ์ในชีวิตครบทุกด้าน",
            96: "เลขแห่งโชคลาภและการเงิน: มีเงินทองใช้ไม่ขาดมือ มีรสนิยมดีและได้รับความอุปถัมภ์จากผู้ใหญ่เป็นอย่างดี",
            97: "เลขแห่งความคิดสร้างสรรค์: มีไอเดียแปลกใหม่ไม่ซ้ำใคร เหมาะกับงานด้านนวัตกรรมหรือศิลปะที่ต้องใช้จินตนาการ",
            98: "เลขแห่งบารมีและทรัพย์สิน: มีดวงเป็นเศรษฐี มีความมั่นคงในชีวิตสูง มักมีที่ดินหรืออสังหาริมทรัพย์มาก",
            99: "เลขแห่งความศักดิ์สิทธิ์สูงสุด: มีพลังคุ้มครองจากเทวดา ชีวิตมักประสบความสำเร็จอย่างปาฏิหาริย์และมีอายุยืน",
            100: "เลขแห่งความสมบูรณ์แบบ: ชีวิตมีความสำเร็จเต็มร้อย มีความเจริญรุ่งเรืองถึงขีดสุดและมีชื่อเสียงขจรขจาย"
        };
        return data[num] || "เป็นเลขที่มีพลังปานกลาง ควรหมั่นทำบุญเสริมดวงชะตา";
    }
};

/**
 * ฐานข้อมูลทักษาปกรณ์ (อักษรมงคล/กาลกิณี)
 */
const TaksaData = {
    0: { // วันอาทิตย์
        name: "วันอาทิตย์", color: "#e63946",
        mapping: {
            "บริวาร": "ะาิีึืุูเแโใไำ", "อายุ": "กขคฆง", "เดช": "จฉชซฌญ",
            "ศรี": "ฎฏฐฑฒณ", "มูละ": "ดตถทธน", "อุตสาหะ": "บปผฝพฟภม",
            "มนตรี": "ยรลว", "กาลกิณี": "ศษสหฬฮ"
        }
    },
    1: { // วันจันทร์
        name: "วันจันทร์", color: "#ffdc5e",
        mapping: {
            "บริวาร": "กขคฆง", "อายุ": "จฉชซฌญ", "เดช": "ฎฏฐฑฒณ",
            "ศรี": "ดตถทธน", "มูละ": "บปผฝพฟภม", "อุตสาหะ": "ยรลว",
            "มนตรี": "ศษสหฬฮ", "กาลกิณี": "ะาิีึืุูเแโใไำ"
        }
    },
    2: { // วันอังคาร
        name: "วันอังคาร", color: "#ff8fab",
        mapping: {
            "บริวาร": "จฉชซฌญ", "อายุ": "ฎฏฐฑฒณ", "เดช": "ดตถทธน",
            "ศรี": "บปผฝพฟภม", "มูละ": "ยรลว", "อุตสาหะ": "ศษสหฬฮ",
            "มนตรี": "ะาิีึืุูเแโใไำ", "กาลกิณี": "กขคฆง"
        }
    },
    3: { // วันพุธ (กลางวัน)
        name: "วันพุธ (กลางวัน)", color: "#2b9348",
        mapping: {
            "บริวาร": "ฎฏฐฑฒณ", "อายุ": "ดตถทธน", "เดช": "บปผฝพฟภม",
            "ศรี": "ยรลว", "มูละ": "ศษสหฬฮ", "อุตสาหะ": "ะาิีึืุูเแโใไำ",
            "มนตรี": "กขคฆง", "กาลกิณี": "จฉชซฌญ"
        }
    },
    4: { // วันพฤหัสบดี
        name: "วันพฤหัสบดี", color: "#fb8500",
        mapping: {
            "บริวาร": "บปผฝพฟภม", "อายุ": "ยรลว", "เดช": "ศษสหฬฮ",
            "ศรี": "ะาิีึืุูเแโใไำ", "มูละ": "กขคฆง", "อุตสาหะ": "จฉชซฌญ",
            "มนตรี": "ฎฏฐฑฒณ", "กาลกิณี": "ดตถทธน"
        }
    },
    5: { // วันศุกร์
        name: "วันศุกร์", color: "#8ecae6",
        mapping: {
            "บริวาร": "ศษสหฬฮ", "อายุ": "ะาิีึืุูเแโใไำ", "เดช": "กขคฆง",
            "ศรี": "จฉชซฌญ", "มูละ": "ฎฏฐฑฒณ", "อุตสาหะ": "ดตถทธน",
            "มนตรี": "บปผฝพฟภม", "กาลกิณี": "ยรลว"
        }
    },
    6: { // วันเสาร์
        name: "วันเสาร์", color: "#7b2cbf",
        mapping: {
            "บริวาร": "ดตถทธน", "อายุ": "บปผฝพฟภม", "เดช": "ยรลว",
            "ศรี": "ศษสหฬฮ", "มูละ": "ะาิีึืุูเแโใไำ", "อุตสาหะ": "กขคฆง",
            "มนตรี": "จฉชซฌญ", "กาลกิณี": "ฎฏฐฑฒณ"
        }
    },
    7: { // วันพุธ (กลางคืน)
        name: "วันพุธ (กลางคืน)", color: "#1a4301",
        mapping: {
            "บริวาร": "ยรลว", "อายุ": "ศษสหฬฮ", "เดช": "ะาิีึืุูเแโใไำ",
            "ศรี": "กขคฆง", "มูละ": "จฉชซฌญ", "อุตสาหะ": "ฎฏฐฑฒณ",
            "มนตรี": "ดตถทธน", "กาลกิณี": "บปผฝพฟภม"
        }
    }
};

const TaksaMeanings = {
    "บริวาร": "บารมี การสนับสนุนจากคนรอบข้าง ลูกน้อง และครอบครัว",
    "อายุ": "สุขภาพร่างกาย พลานามัย ความเป็นอยู่ และอายุยืนยาว",
    "เดช": "อำนาจ วาสนา บารมี ชื่อเสียง และตำแหน่งหน้าที่การงาน",
    "ศรี": "โชคลาภ เสน่ห์ เมตตามหานิยม และความเป็นสิริมงคล",
    "มูละ": "หลักฐาน ทรัพย์สมบัติ มรดก และความมั่นคงในชีวิต",
    "อุตสาหะ": "ความขยันหมั่นเพียร ความพยายาม และความสำเร็จจากน้ำพักน้ำแรง",
    "มนตรี": "การอุปถัมภ์ค้ำชูจากผู้ใหญ่ เจ้านาย และผู้ให้โอกาส",
    "กาลกิณี": "อุปสรรค ปัญหา ความโชคร้าย และสิ่งที่ควรหลีกเลี่ยง"
};



function showname() {
    const contianer = document.getElementById('shownamepage')
    if (contianer) {
        contianer.style.display = 'block';
    }

    const html = `
            <div class="container py-4">
            <div class="card bg-dark border-gold text-white p-3 text-center">
                <h2 class="text-gold">🔮 วิเคราะห์เลขศาสตร์ ชื่อ-นามสกุล</h2>
                <h5 class="small text-white-50">ถอดรหัสตัวเลขและตรวจสอบอักษรกาลกิณี</h5>                
                <label class="text-gold">เลือกจากรายชื่อสมาชิก (ประวัติ):</label>
                <select id="memberSelect" class="form-control bg-dark text-white border-gold member-selector-shared"
                    onchange="autoFillMemberData(this.value); analyzeName()">
                    <option value="">-- เลือกสมาชิก --</option>
                </select>
                <div class="row mt-3">
                    <div class="col-md-4 mb-2">
                        <input type="text" id="firstName" class="form-control bg-dark text-white border-gold"
                            placeholder="กรอกชื่อ">
                    </div>
                    <div class="col-md-4 mb-2">
                        <input type="text" id="lastName" class="form-control bg-dark text-white border-gold"
                            placeholder="กรอกนามสกุล">
                    </div>
                    <div class="col-md-4 mb-2">
                        <select id="birthDaynumSelect" class="form-control bg-dark text-white border-gold">
                            <option value="">-- เลือกวันเกิด (เพื่อเช็คกาลกิณี) --</option>
                            <option value="0">วันอาทิตย์</option>
                            <option value="1">วันจันทร์</option>
                            <option value="2">วันอังคาร</option>
                            <option value="3">วันพุธ (กลางวัน)</option>
                            <option value="7">วันพุธ (กลางคืน)</option>
                            <option value="4">วันพฤหัสบดี</option>
                            <option value="5">วันศุกร์</option>
                            <option value="6">วันเสาร์</option>
                        </select>
                    </div>
                    <div class="col-md-12 mb-2">
                        <button class="btn btn-gold btn-block" onclick="analyzeName()">วิเคราะห์รหัสชีวิต</button>
                    </div>
                </div>
                <div id="nameResultArea" style="display: none;"></div>
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

document.addEventListener("DOMContentLoaded", () =>{
    showname();
});


// ฟังก์ชันหาอักษรกาลกิณีในชื่อ
function getKalakiniInName(name, dayIndex) {
    // แก้ไขจุดผิด: ตรวจสอบว่า name เป็น string และไม่ว่าง
    if (!name || typeof name !== 'string') return [];

    // ตารางอักษรกาลกิณีตามวันเกิด (ทักษา)
    const kalakiniMap = TaksaData[dayIndex]?.mapping?.["กาลกิณี"] || "";

    const forbiddenChars = kalakiniMap;
    const found = [];

    // วนลูปตรวจสอบทีละตัวอักษรอย่างปลอดภัย
    for (const char of name) {
        if (forbiddenChars.includes(char)) {
            if (!found.includes(char)) found.push(char);
        }
    }
    return found;
}


function analyzeTaksaDetailed(fname, lname, dayIdx) {
    if (dayIdx === null || typeof TaksaData[dayIdx] === 'undefined') return null;
    
    const mapping = TaksaData[dayIdx].mapping;
    
    // ฟังก์ชันช่วยสแกนอักษร
    const scan = (text) => {
        const res = { "บริวาร":[], "อายุ":[], "เดช":[], "ศรี":[], "มูละ":[], "อุตสาหะ":[], "มนตรี":[], "กาลกิณี":[] };
        for (let char of text) {
            for (let cat in mapping) {
                if (mapping[cat].includes(char)) {
                    if (!res[cat].includes(char)) res[cat].push(char);
                }
            }
        }
        return res;
    };

    return {
        first: scan(fname),
        last: scan(lname)
    };
}

function getLuckyChars(dayIdx, target) {
    if (dayIdx === null || !TaksaData[dayIdx]) return "กรุณาระบุวันเกิดก่อนครับ";
    
    const mapping = TaksaData[dayIdx].mapping;
    const targetMap = {
        "wealth": "ศรี",      // เน้นเงินทอง โชคลาภ
        "power": "เดช",       // เน้นอำนาจ บารมี
        "health": "อายุ",      // เน้นสุขภาพ ความเป็นอยู่
        "mercy": "มนตรี",     // เน้นผู้ใหญ่เมตตา สนับสนุน
        "success": "อุตสาหะ"   // เน้นความสำเร็จ ความขยัน
    };

    const category = targetMap[target];
    // *** FIXED: ถ้า target ไม่ตรงกับ targetMap จะได้ category=undefined → mapping[undefined] crash ***
    if (!category || !mapping[category]) {
        console.warn("getLuckyChars: target ไม่ถูกต้อง →", target);
        return { category: "ไม่ทราบ", chars: "", meaning: "ไม่พบข้อมูลหมวดนี้" };
    }
    const chars = mapping[category];
    
    return {
        category: category,
        chars: chars,
        meaning: TaksaMeanings[category]
    };
}



/**
 * ฟังก์ชันหลักในการวิเคราะห์ชื่อ
 * ดึงข้อมูลสมาชิกอัตโนมัติ และตรวจเช็คกาลกิณีตามวันเกิด
 */
function analyzeName() {
    // 1. ดึง Element มาเช็คก่อนว่ามีตัวตนจริงไหม
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    const daySelectEl = document.getElementById('birthDaynumSelect');

    if (!firstNameEl || !lastNameEl || !daySelectEl) {
        console.error("หา Element ไม่เจอ! เช็ค ID ใน HTML ด่วนครับ");
        return;
    }

    let fname = firstNameEl.value.trim();
    let lname = lastNameEl.value.trim();
    let selectedDay = daySelectEl.value; 

    // 2. ถ้าชื่อว่าง ให้ดึงจากระบบสมาชิก
    if (!fname) {
        const savedName = localStorage.getItem('thaiHoroUserName');
        if (savedName) {
            let name = savedName.trim();
            let lastname = savedName.trim();
            fname = name.split(' ')[0] || "";
            lname = lastname.split(' ')[1] || "";
            firstNameEl.value = fname;
            lastNameEl.value = lname;
        }
    }

    // 3. ป้องกันกดวิเคราะห์โดยไม่มีชื่อ
    if (!fname) {
        return Swal.fire({ icon: 'info', title: 'กรุณากรอกชื่อ', confirmButtonColor: '#d4af37' });
    }

    // 4. แก้ปัญหา "วันอาทิตย์ตลอดกาล"
    let finalDayIdx = null;

    // เช็คว่า selectedDay มีค่า และไม่ใช่ค่าว่าง
    if (selectedDay !== "") {
        finalDayIdx = parseInt(selectedDay); 
        console.log("เลือกจากหน้าจอเป็นเลข:", finalDayIdx); // เช็คใน Console (F12)
    } else {
        const birthdate = localStorage.getItem('thaiHoroUserBirthdate');
        if (birthdate) {
            finalDayIdx = new Date(birthdate).getDay();
            console.log("ดึงจากระบบสมาชิกเป็นเลข:", finalDayIdx);
        }
    }

    // 5. คำนวณ (ใช้ชื่อที่ได้จากข้อ 2 และวันที่จากข้อ 4)
    const kalakiniList = getKalakiniInName(fname, finalDayIdx);
    const sumF = NameAnalysis.calculate(fname);
    const sumL = NameAnalysis.calculate(lname);
    const sumTotal = sumF + sumL;

    // 6. แสดงผลลัพธ์
    renderNameUI(fname, lname, sumF, sumL, sumTotal, finalDayIdx, kalakiniList);
}

function showLuckyChars(target, dayIdx) {
    if (dayIdx === null) {
        return Swal.fire('ระบุวันเกิด', 'กรุณาเลือกวันเกิดก่อนดูอักษรนำโชคครับประธาน', 'warning');
    }

    const result = getLuckyChars(dayIdx, target); // ฟังก์ชันที่เราสร้างไว้ก่อนหน้านี้
    const area = document.getElementById('luckyResultArea');
    
    if (area) {
        // แยกตัวอักษรออกมาทำเป็น Badge สวยๆ
        const charArray = result.chars.split('');
        const charBadges = charArray.map(c => `<span class="char-badge">${c}</span>`).join('');

        area.innerHTML = `
            <div class="animate__animated animate__zoomIn">
                <div class="text-gold-gradient mb-1" style="font-size: 0.9rem;">หมวด${result.category} (อักษรนำโชคของคุณ)</div>
                <div class="mb-2">${charBadges}</div>
                <div class="text-info small" style="font-size: 0.7rem; line-height: 1.2;">
                    <i class="fas fa-info-circle"></i> ${result.meaning}
                </div>
            </div>
        `;
    }
}

// ฟังก์ชันสุ่มชื่อแนะนำ (ใส่ไว้ในไฟล์ main.js)
function suggestLuckyNames(dayIdx) {
    if (dayIdx === null || !NameDatabase[dayIdx]) {
        return Swal.fire('ระบุวันเกิด', 'เลือกวันเกิดก่อนครับประธาน', 'warning');
    }

    const names = NameDatabase[dayIdx];
    const shuffled = [...names].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    let html = `
        <div class="text-left animate__animated animate__fadeIn">
            <p class="small text-white-50 mb-3 text-center">อักษรถูกคัดกรองตามหลักทักษาประจำวันเกิดของคุณแล้ว</p>
    `;

    selected.forEach(item => {
        html += `
            <div class="mb-3 p-3 rounded" style="background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.2);">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="h4 text-gold mb-0">${item.name}</span>
                    <span class="badge badge-info">เลขรวม ${item.sum}</span>
                </div>
                <div class="mt-2">
                    ${item.tags.map(t => `<span class="badge badge-outline-gold mr-1" style="font-size: 0.6rem;">${t}</span>`).join('')}
                </div>
                <div class="small text-white-50 mt-1 italic" style="font-size: 0.75rem;">
                    ความหมาย: ${item.desc}
                </div>
            </div>
        `;
    });

    html += `
        <div class="mt-3 text-center">
            <button onclick="suggestLuckyNames(${dayIdx})" class="btn btn-sm btn-outline-gold">
                <i class="fas fa-sync-alt mr-1"></i> สุ่มใหม่
            </button>
        </div>
    </div>`;

    Swal.fire({
        title: '🌟 ชื่อมงคลแนะนำ',
        html: html,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#121212',
        color: '#d4af37',
        customClass: { popup: 'border-gold' }
    });
}

/**
 * ฟังก์ชันแสดงผลลัพธ์ (UI) - ปรับปรุงให้โชว์ทักษา/วันเกิด
 */
function renderNameUI(f, l, sf, sl, st, dayIdx, kalaList) {
    const resultDiv = document.getElementById('nameResultArea');
    if (!resultDiv) return;

    // ดึงข้อมูลวันเกิด (ถ้ามี)
    const dayInfo = dayIdx !== null ? TaksaData[dayIdx] : null;
    const dayName = dayInfo ? dayInfo.name : "ไม่ระบุวันเกิด";
    const dayColor = dayInfo ? dayInfo.color : "#d4af37";

    // เตรียมข้อความกาลกิณี
    let kalaHTML = "";
    if (dayIdx !== null) {
        if (kalaList.length > 0) {
            kalaHTML = `<div class="mt-2 text-danger small"><i class="fas fa-exclamation-triangle"></i> พบอักษรกาลกิณี: <b>${kalaList.join(', ')}</b></div>`;
        } else {
            kalaHTML = `<div class="mt-2 text-success small"><i class="fas fa-check-circle"></i> ชื่อนี้เป็นมงคล ไม่มีอักษรกาลกิณี</div>`;
        }
    }

    // เพิ่มส่วนนี้เข้าไปใน renderNameUI ตรงใต้ส่วนกาลกิณีเดิมครับ
    // เพิ่มส่วนนี้ใน renderNameUI
    const taksa = analyzeTaksaDetailed(f, l, dayIdx);
    let taksaHTML = "";

    if (taksa) {
        taksaHTML = `
            <div class="mt-3 p-3 bg-black-25 rounded border border-gold-25 shadow-inner">
                <div class="small text-gold mb-3 text-center font-weight-bold">
                    <i class="fas fa-star"></i> วิเคราะห์พลังทักษา (ชื่อ vs นามสกุล)
                </div>
                <div class="row no-gutters">
        `;

    // รายการหมวดทักษา
    const categories = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];

    categories.forEach(cat => {
        const hasF = taksa.first[cat].length > 0;
        const hasL = taksa.last[cat].length > 0;

        // ความหมายสั้นๆ ของแต่ละตัว
        const meaning = TaksaMeanings[cat];
        
        // กำหนดสี: กาลกิณีเป็นแดง, อันที่มีอักษรเป็นเขียว/ทอง
        let colorStyle = "color: #ffffff55;"; // Default จางๆ
        if (cat === "กาลกิณี") {
            if (hasF || hasL) colorStyle = "color: #ff4d4d; font-weight: bold;";
        } else if (hasF || hasL) {
            colorStyle = "color: #d4af37; font-weight: bold;";
        }

        taksaHTML += `
                <div class="col-6 mb-3 px-2 text-center">
                    <div style="font-size: 0.8rem; border-bottom: 1px solid rgba(212,175,55,0.3); margin-bottom: 2px; ${colorStyle}">
                        ${cat}
                    </div>
                    <div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 4px; line-height: 1;">
                        (${meaning.split(' ')[0]}) </div>
                    
                    <div class="d-flex justify-content-center align-items-center" style="font-size: 0.9rem;">
                        <span class="${hasF ? 'text-info' : 'text-white-25'}" style="min-width: 45px; text-align: right;">
                            ${hasF ? taksa.first[cat].join('') : '-'}
                        </span>
                        <span class="text-white-25 mx-2" style="font-size: 0.6rem;">|</span>
                        <span class="${hasL ? 'text-warning' : 'text-white-25'}" style="min-width: 45px; text-align: left;">
                            ${hasL ? taksa.last[cat].join('') : '-'}
                        </span>
                    </div>
                </div>
            `;
        });

        taksaHTML += `
                </div>
                <div class="text-center mt-2" style="font-size: 0.6rem; color: rgba(255,255,255,0.4);">
                    ( ซ้าย: ชื่อ | ขวา: นามสกุล )
                </div>
            </div>
        `;
    }

    
        // ส่วน UI สำหรับเลือกเป้าหมายชีวิต
    let luckySectionHTML = `
    <div class="mt-4 p-3 bg-dark border-gold-50 rounded shadow-lg animate__animated animate__fadeInUp" style="background: rgba(0,0,0,0.4); border: 1px dashed rgba(212, 175, 55, 0.5);">
        <div class="text-center mb-3">
            <span class="badge badge-gold px-3 py-2" style="font-size: 0.8rem;">
                <i class="fas fa-magic mr-1"></i> เข็มทิศอักษรมงคล
            </span>
            <p class="text-white-50 small mt-2">คลิกเลือกด้านที่ต้องการเสริม เพื่อดูอักษรนำโชคของคุณ</p>
        </div>

        <div class="row no-gutters text-center mb-3">
            <div class="col-3">
                <button onclick="showLuckyChars('wealth', ${dayIdx})" class="btn-lucky" title="เงินทอง/โชคลาภ">
                    <i class="fas fa-coins text-warning"></i><br><span class="very-small">เงินทอง</span>
                </button>
            </div>
            <div class="col-3">
                <button onclick="showLuckyChars('power', ${dayIdx})" class="btn-lucky" title="อำนาจ/วาสนา">
                    <i class="fas fa-crown text-danger"></i><br><span class="very-small">อำนาจ</span>
                </button>
            </div>
            <div class="col-3">
                <button onclick="showLuckyChars('mercy', ${dayIdx})" class="btn-lucky" title="เมตตา/ผู้อุปถัมภ์">
                    <i class="fas fa-heart text-info"></i><br><span class="very-small">เมตตา</span>
                </button>
            </div>
            <div class="col-3">
                <button onclick="showLuckyChars('success', ${dayIdx})" class="btn-lucky" title="สำเร็จ/ขยัน">
                    <i class="fas fa-rocket text-success"></i><br><span class="very-small">สำเร็จ</span>
                </button>
            </div>
        </div>

        <div id="luckyResultArea" class="p-3 text-center rounded bg-black-50" style="min-height: 80px; border: 1px solid rgba(255,255,255,0.1);">
            <div class="text-white-25 small italic">เลือกเป้าหมายด้านบนเพื่อเปิดรหัสอักษร...</div>
        </div>
    </div>
    <div class="mt-3">
            <button onclick="suggestLuckyNames(${dayIdx})" class="btn btn-outline-gold btn-block btn-sm">
                <i class="fas fa-search-plus mr-1"></i> ค้นหาไอเดียชื่อมงคลสำหรับคุณ
            </button>
        </div>
`;

  
        


    // ส่วนแสดงผลลัพธ์


        resultDiv.innerHTML = `
            <div class="card bg-dark border-gold text-white p-4 mt-3 shadow-lg animate__animated animate__zoomIn">
                <div class="text-center mb-3">
                    <h4 class="text-gold"><i class="fas fa-fingerprint mr-2"></i>วิเคราะห์รหัสชีวิต</h4>
                    <div style="color: ${dayColor}; font-weight: bold; font-size: 1rem; text-shadow: 0 0 5px ${dayColor}55;">
                        <i class="fas fa-sun"></i> ดวงวันเกิด: ${dayName}
                    </div>
                    <p class="small text-white-50 mb-0">คุณ${f} ${l}</p>
                    ${kalaHTML}
                    ${taksaHTML}
                    </div>
                    ${luckySectionHTML}
                    
                
                <div class="row text-center mb-4 mt-3">
                    <div class="col-4">
                        <div class="text-white-50 small mb-2">ชื่อ</div>
                        <div class="d-flex justify-content-center">
                            <div style="width: 50px; height: 50px; line-height: 46px; border-radius: 50%; border: 2px solid #17a2b8; color: #17a2b8; font-weight: bold; font-size: 1.4rem; background: rgba(23, 162, 184, 0.1);">
                                ${sf}
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="text-white-50 small mb-2">นามสกุล</div>
                        <div class="d-flex justify-content-center">
                            <div style="width: 50px; height: 50px; line-height: 46px; border-radius: 50%; border: 2px solid #17a2b8; color: #17a2b8; font-weight: bold; font-size: 1.4rem; background: rgba(23, 162, 184, 0.1);">
                                ${sl}
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="text-white-50 small mb-2">รวม</div>
                        <div class="d-flex justify-content-center">
                            <div style="width: 60px; height: 60px; line-height: 54px; border-radius: 50%; border: 3px solid #d4af37; color: #d4af37; font-weight: bold; font-size: 1.6rem; background: rgba(212, 175, 55, 0.2); box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); margin-top: -5px;">
                                ${st}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-3 bg-black-50 rounded border border-gold-50 shadow-inner" style="background: rgba(0,0,0,0.3);">
                    <div class="text-gold font-weight-bold mb-1"><i class="fas fa-scroll mr-1"></i> คำทำนายโดยสรุป:</div>
                    <div class="text-white small" style="line-height: 1.6; font-weight: 300;">${NameAnalysis.getMeaning(st)}</div>
                </div>

                <button onclick="exportNameAnalysis()" class="btn btn-gold btn-sm btn-block mt-3 shadow">
                    <i class="fas fa-camera mr-1"></i> บันทึกภาพมงคล
                </button>
            </div>
        `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}


/**
 * ฟังก์ชันบันทึกภาพสำหรับ Facebook (ฉบับวาดใหม่แบบ Full-HD)
 * ปรับปรุงโดย ประธานโบ้ - เพิ่มระบบตรวจเช็ควันเกิดและกาลกิณีลงในรูป
 */
async function exportNameAnalysis() {
    // *** FIXED: อ่าน .value โดยตรงโดยไม่มี null check → crash ถ้า element ไม่มีใน DOM ***
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl  = document.getElementById('lastName');
    if (!firstNameEl) return Swal.fire('Error', 'ไม่พบช่องกรอกชื่อครับ', 'error');

    const fname = firstNameEl.value.trim();
    const lname = lastNameEl ? lastNameEl.value.trim() : '';
    
    if (!fname) return Swal.fire('Error', 'ไม่พบชื่อที่จะบันทึกครับ', 'error');

    // --- ส่วนที่เพิ่มเข้ามาเพื่อให้รูปภาพรู้ข้อมูลวันเกิด ---
    const birthdate = localStorage.getItem('thaiHoroUserBirthdate');
    let dayIdx = null;
    if (birthdate) {
        dayIdx = new Date(birthdate).getDay();
    }
    const kalakiniList = getKalakiniInName(fname, dayIdx);
    // --------------------------------------------------

    const sumF = NameAnalysis.calculate(fname);
    const sumL = NameAnalysis.calculate(lname);
    const sumTotal = sumF + sumL;
    const meaning = NameAnalysis.getMeaning(sumTotal);

    Swal.fire({
        title: 'กำลังดีไซน์รูปภาพ...',
        text: 'ปรับขนาดให้เหมาะกับ Facebook',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1200;
        canvas.height = 1200;

        // 1. พื้นหลัง Gradient สีเข้มหรูหรา
        const grd = ctx.createRadialGradient(600, 600, 100, 600, 600, 800);
        grd.addColorStop(0, "#2c2c2c");
        grd.addColorStop(1, "#0d0d0d");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1200, 1200);

        // 2. กรอบทอง 2 ชั้น
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 12;
        ctx.strokeRect(40, 40, 1120, 1120);
        ctx.lineWidth = 2;
        ctx.strokeRect(65, 65, 1070, 1070);

        // 3. หัวกระดาษ
        ctx.textAlign = "center";
        ctx.fillStyle = "#d4af37";
        ctx.font = "bold 65px 'Sarabun', sans-serif";
        ctx.fillText("🔮 สยามโหรามงคล", 600, 160);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "32px 'Sarabun', sans-serif";
        ctx.fillText("วิเคราะห์รหัสชีวิตด้วยพลังเลขศาสตร์ไทย", 600, 220);

        // 4. แสดงชื่อ-นามสกุลแบบเน้นๆ
        ctx.fillStyle = "rgba(212, 175, 55, 0.1)";
        ctx.fillRect(150, 290, 900, 130);
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 1;
        ctx.strokeRect(150, 290, 900, 130);
        
        ctx.fillStyle = "#d4af37";
        ctx.font = "bold 50px 'Sarabun', sans-serif";
        ctx.fillText(`คุณ ${fname} ${lname}`, 600, 375);

        // 5. วงกลมพลังตัวเลข
        const drawCircle = (x, y, label, value, color, isMain = false) => {
            const radius = isMain ? 120 : 100;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = isMain ? 8 : 4;
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "28px 'Sarabun', sans-serif";
            ctx.fillText(label, x, y - (radius/3));
            ctx.fillStyle = color;
            ctx.font = `bold ${isMain ? 90 : 70}px 'Sarabun', sans-serif`;
            ctx.fillText(value, x, y + (radius/3));
        };

        drawCircle(300, 600, "เลขชื่อ", sumF, "#00cfd5");
        drawCircle(600, 600, "ผลรวม", sumTotal, "#d4af37", true);
        drawCircle(900, 600, "เลขนามสกุล", sumL, "#00cfd5");

        // 5.5 วาดข้อมูลทักษา (มงคล/กาลกิณี) - ส่วนที่ประธานเพิ่มมา
        if (dayIdx !== null && typeof TaksaData !== 'undefined') {
            const dayInfo = TaksaData[dayIdx];
            ctx.fillStyle = dayInfo.color || "#d4af37";
            ctx.font = "bold 32px 'Sarabun', sans-serif";
            ctx.fillText(`ดวงวันเกิด: ${dayInfo.name}`, 600, 720);

            if (kalakiniList && kalakiniList.length > 0) {
                ctx.fillStyle = "#ff4d4d";
                ctx.font = "bold 30px 'Sarabun', sans-serif";
                ctx.fillText(`⚠️ พบอักษรกาลกิณี: ${kalakiniList.join(', ')}`, 600, 765);
            } else {
                ctx.fillStyle = "#4ade80";
                ctx.font = "bold 30px 'Sarabun', sans-serif";
                ctx.fillText("✅ ชื่อนี้เป็นมงคล ไม่มีอักษรกาลกิณี", 600, 765);
            }
        }

        // 6. กล่องคำทำนาย
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(120, 780, 960, 280);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
        ctx.strokeRect(120, 780, 960, 280);
        ctx.fillStyle = "#d4af37";
        ctx.font = "bold 38px 'Sarabun', sans-serif";
        ctx.fillText("คำทำนายพลังชีวิต", 600, 845);
        ctx.fillStyle = "#ffffff";
        ctx.font = "34px 'Sarabun', sans-serif";
        
        const wrapText = (text, x, y, maxWidth, lineHeight) => {
            let chars = text.split('');
            let line = '';
            for(let n = 0; n < chars.length; n++) {
                let testLine = line + chars[n];
                if (ctx.measureText(testLine).width > maxWidth) {
                    ctx.fillText(line, x, y);
                    line = chars[n];
                    y += lineHeight;
                } else { line = testLine; }
            }
            ctx.fillText(line, x, y);
        };
        wrapText(meaning, 600, 915, 850, 50);

        // 7. ลายเซ็นเครดิต
        ctx.fillStyle = "#555";
        ctx.font = "24px 'Sarabun', sans-serif";
        ctx.fillText("วิเคราะห์จากโปรแกรมสยามโหรามงคล โดย ประธานโบ้", 600, 1100);

        // 8. สั่งดาวน์โหลด
        const link = document.createElement('a');
        link.download = `วิเคราะห์ชื่อ_${fname}_SiamHora.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

        Swal.close();
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'บันทึกไม่สำเร็จ: ' + err.message, 'error');
    }
}