"use strict";

/**
 * 🕉️ chantPage.js
 * ระบบบทสวดมนต์เสริมดวงชะตา 4 มิติ
 * - บทสวดประจำวันเกิด (บทสวดปริตรเต็ม & พระคาถาทักษาประจำวัน)
 * - บทสวดประจำเดือนเกิด (พระคาถาบูชาประจำเดือนจันทรคติไทย)
 * - บทสวดประจำปีเกิด / ปีนักษัตร (บทสวดบูชาพระธาตุประจำปีเกิด)
 * - บทสวดประจำราศีเกิด (คาถาบูชาดาวเกษตรประจำราศี)
 */

// 1. บทสวดประจำวันเกิด (บทสวดปริตรเต็ม & พระคาถาทักษา)
const CHANTS_BY_DAY = {
    0: {
        name: "วันอาทิตย์ (กำลัง ๖)",
        planet: "พระอาทิตย์",
        buddha: "ปางถวายเนตร",
        mantraShort: "อะ วิ สุ โล ปุ สะ พุ ภะ (๖ จบ)",
        mantraFull: `[บทสวด โมระปริตร (คาถาพญายูงทอง)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nอุเทตะยัญจักขุมา เอกะราชา หะริสสะวัณโณ ปะฐะวิปปะภาโส\nตัง ตัง นะมัสสามิ หะริสสะวัณณัง ปะฐะวิปปะภาสัง\nตะยัชชะ คุตตา วิหะเรมุ ทิวะสัง\nเย พราหมะณา เวทะคุ สัพพะธัมเม\nเต เม นะโม เต จะ มัง ปาละยันตุ\nนะมัตถุ พุทธานัง นะมัตถุ โพธิยา\nนะโม วิมุตตานัง นะโม วิมุตติยา\nอิมัง โส ปะริตตัง กัตวา โมโร จะระติ เอสะนาฯ\n\n[พระคาถาประจำวันอาทิตย์ (กำลัง ๖ จบ)]\nอะ วิ สุ โล ปุ สะ พุ ภะ`,
        effect: "เสริมเดช อำนาจบารมี เมตตามหานิยม แคล้วคลาดปลอดภัย ผู้ใหญ่เอ็นดูสนับสนุน"
    },
    1: {
        name: "วันจันทร์ (กำลัง ๑๕)",
        planet: "พระจันทร์",
        buddha: "ปางห้ามญาติ / ปางห้ามสมุทร",
        mantraShort: "อิ ระ ชา คะ ตะ ระ สา (๑๕ จบ)",
        mantraFull: `[บทสวด อภะยะปะริตตัง (คาถายันทุน)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nยันทุนนิมิตตัง อะวะมังคะลัญจะ โย จามะนาโป สะกุณัสสะ สัทโท\nปาปัคคะโห ทุสสุปินัง อะกันตัง พุทธานุภาเวนะ วินาสะเมนตุฯ\nยันทุนนิมิตตัง อะวะมังคะลัญจะ โย จามะนาโป สะกุณัสสะ สัทโท\nปาปัคคะโห ทุสสุปินัง อะกันตัง ธัมมานุภาเวนะ วินาสะเมนตุฯ\nยันทุนนิมิตตัง อะวะมังคะลัญจะ โย จามะนาโป สะกุณัสสะ สัทโท\nปาปัคคะโห ทุสสุปินัง อะกันตัง สังฆานุภาเวนะ วินาสะเมนตุฯ\n\n[พระคาถาประจำวันจันทร์ (กำลัง ๑๕ จบ)]\nอิ ระ ชา คะ ตะ ระ สา`,
        effect: "เสริมเสน่ห์ การค้าขาย เมตตามหานิยม ขจัดฝันร้าย ลางร้าย จิตใจสงบร่มเย็น"
    },
    2: {
        name: "วันอังคาร (กำลัง ๘)",
        planet: "พระอังคาร",
        buddha: "ปางไสยาสน์ / ปางโปรดอสุรินทราหู",
        mantraShort: "ติ หัง จะ โต โร ถิ นัง (๘ จบ)",
        mantraFull: `[บทสวด กะระณียะเมตตะสุตตัง (เมตตสูตรย่อ)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nเมตตัญจะ สัพพะโลกัสะมิง มานะสัมภาวะเย อะปะริมาณัง\nอุทธัง อะโธ จะ ติริยัญจะ อะสัมพาธัง อะเวรัง อะสะปัตตังฯ\nติฏฐัญจะรัง นิสินโน วา สะยาโน วา ยาวะตัสสะ วิคตะมิทโธ\nเอตัง สะติง อะธิฏเฐยยะ พรัหมะเมตัง วิหารัง อิธะมาหุฯ\n\n[พระคาถาประจำวันอังคาร (กำลัง ๘ จบ)]\nติ หัง จะ โต โร ถิ นัง`,
        effect: "ขจัดแคล้วคลาด ป้องกันอุบัติเหตุ อุปสรรค ศัตรูพ่ายแพ้ เสริมความเข้มแข็ง"
    },
    3: {
        name: "วันพุธกลางวัน (กำลัง ๑๗)",
        planet: "พระพุธ",
        buddha: "ปางอุ้มบาตร",
        mantraShort: "ปิ สัม ระ โล ปุ สัต พุท (๑๗ จบ)",
        mantraFull: `[บทสวด ขันธะปะริตตัง (คาถาป้องกันพิษและสัพพะภัย)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nวิรูปักเขหิ เม เมตตัง เมตตัง เอราปะเถหิ เม\nฉัพพะยาปุตเตหิ เม เมตตัง เมตตัง กัณหาโคตะมะเกหิ จะ\nอะปาทะเกหิ เม เมตตัง เมตตัง ทิปาทะเกหิ เม\nจะตุปปาเทหิ เม เมตตัง เมตตัง พะหุปปาเทหิ เม\nมา มัง อะปาทะโก หิงสิ มา มัง หิงสิ ทิปาทะโก\nมา มัง จะตุปปาโท หิงสิ มา มัง หิงสิ พะหุปปาโท\nสัพเพ สัตตา สัพเพ ปาณา สัพเพ ภูตา จะ เกวะลา\nสัพเพ ภัทรานิ ปัสสันตุ มา กิญจิ ปาปะมาคะมาฯ\n\n[พระคาถาประจำวันพุธ (กำลัง ๑๗ จบ)]\nปิ สัม ระ โล ปุ สัต พุท`,
        effect: "เสริมสติปัญญา คำพูดน่าเชื่อถือ ค้าขายคล่อง เจรจาสำเร็จ ป้องกันอันตราย"
    },
    8: {
        name: "วันพุธกลางคืน / ราหู (กำลัง ๑๒)",
        planet: "พระราหู",
        buddha: "ปางป่าเลไลยก์",
        mantraShort: "กิน นุ สัน ตะ ระ มา โน วะ (๑๒ จบ)",
        mantraFull: `[บทสวด สุริยะปะริตตัง & จันทัปปะริตตัง (คาถาสุริยะ-จันทราหู)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nกินนุ สันตะระมาโน วะ ราหุ สุริยัง ปะมุญจะสิ\nสังวิคคะรูโป อาคัมมะ กินนุ ภีโต วะ ติฏฐะสีติฯ\nสัตตะธา เม ผะเล มุทธา ชีวันโตนะ สุขัง ละเภ\nพุทธะคาถาภิคีโตมหิ โน เจ มุญเจยยะ สุริยันติฯ\n\n[พระคาถาประจำวันราหู (กำลัง ๑๒ จบ)]\nกิน นุ สัน ตะ ระ มา โน วะ`,
        effect: "สะเดาะเคราะห์ ป้องกันภัยมืด สิ่งอัปมงคล คุณไสย พลิกร้ายกลายเป็นดี"
    },
    4: {
        name: "วันพฤหัสบดี (กำลัง ๑๙)",
        planet: "พระพฤหัสบดี",
        buddha: "ปางสมาธิ",
        mantraShort: "ภะ สัม สัม วิ สะ เท ภะ (๑๙ จบ)",
        mantraFull: `[บทสวด วัฏฏะกะปะริตตัง (คาถาไฟใหม้ไม่ถึง)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nอัตถิ โลเก ศีละคุโณ สัจจัง โสเจยยะ นุททะยา\nเตนะ สัจเจนะ กาหามิ สัจจะกิริยะมะนุตตะรัง\nอาวัชชิตวา ธัมมะพะลัง สะริตวา ปุพพะเก ชิเน\nสัจจะพะละมะวัสสายะ สัจจะกิริยะมะกาสะหัง\nสันติ ปักขา อะปัตตะนา สันติ ปาทา อะวัญจะนา\nมาตา ปิตา จะ นิกขันตา ชาตะเวทะ ปะฏิกกะมะฯ\nสะหะ สัจเจ กะเต มัยหัง มะหาปัชชะลิโต สิขี\nวัชเชสิ โสฬะสะ กะรีสานิ อุทะกัง ปัตวา ยะถา สิขี\nสัจเจนะ เม สะโม นัตถิ เอสา เม สัจจะปาระมีติฯ\n\n[พระคาถาประจำวันพฤหัสบดี (กำลัง ๑๙ จบ)]\nภะ สัม สัม วิ สะ เท ภะ`,
        effect: "เสริมสติปัญญา การเรียน การสอบ ความก้าวหน้าในหน้าที่การงาน มีครูบาอาจารย์คุ้มครอง"
    },
    5: {
        name: "วันศุกร์ (กำลัง ๒๑)",
        planet: "พระศุกร์",
        buddha: "ปางรำพึง",
        mantraShort: "วา โธ โน อะ มะ มะ วา (๒๑ จบ)",
        mantraFull: `[บทสวด อาฏานาฏิยะปะริตตัง (ย่อ)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nวิปัสสิสสะ จะ นัตถุ จักขุมันตัสสะ สิรีมะโต\nสิกขิสสะปิ จะ นัตถุ สัพพะภูตานุกัมปิโน\nเวสสะภุสสะ จะ นัตถุ นหาตะกัสสะ ตะปัสสิโน\nกะกุสันธัสสะ จะ นัตถุ มาระเสนาปะมัททิโน\nโกณาคะมะนัสสะ จะ นัตถุ พราหมะณัสสะ วุสีมะโต\nกัสสะปัสสะ จะ นัตถุ วิปปะมุตตัสสะ สัพพะธิ\nอังคีระสัสสะ จะ นัตถุ สักยะปุตตัสสะ สิรีมะโต\nโย อิ มัง ธัมมะมะเทเสสิ สัพพะทุกขาปะนูทะนังฯ\n\n[พระคาถาประจำวันศุกร์ (กำลัง ๒๑ จบ)]\nวา โธ โน อะ มะ มะ วา`,
        effect: "เสริมความรัก ความโชคดี โภคทรัพย์ เงินทองไหลมาเทมา ร่มเย็นเป็นสุข"
    },
    6: {
        name: "วันเสาร์ (กำลัง ๑๐)",
        planet: "พระเสาร์",
        buddha: "ปางนาคปรก",
        mantraShort: "คะ พุท ปัน ทู ธัม วะ คะ (๑๐ จบ)",
        mantraFull: `[บทสวด อังคุลิมาละปะริตตัง (คาถาพระอังคุลิมาล)]\n\nนะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n\nยะโตหัง ภะคินี อะริยายะ ชาติยา ชาโต\nนาภิชานามิ สัญจิจจะ ปาณัง ชีวิตา โวโรเปตา\nเตนะ สัจเจนะ โสตถิ เต โหตุ โสตถิ คัพภัสสะฯ\n\n[พระคาถาประจำวันเสาร์ (กำลัง ๑๐ จบ)]\nคะ พุท ปัน ทู ธัม วะ คะ`,
        effect: "ขจัดความทุกข์โศก โรคภัย ป้องกันภยันตราย มีความหนักแน่นมั่นคง คลอดบุตรง่าย"
    }
};

// 2. บทสวดประจำเดือนเกิด (เดือนจันทรคติไทย 1-12)
const CHANTS_BY_MONTH = {
    1: { name: "เดือนอ้าย (เดือน ๑)", title: "คาถาพระสิวลีมหาลาภ", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nสีวะลี จะ มะหาเถโร เทวะตานะปูชิโต โสระโห ปัจจะยาทิมหิ อะหัง วันทามิ ตัง สะทา (9 จบ)", detail: "เสริมลาภลอย ความอุดมสมบูรณ์ ค้าขายเจริญรุ่งเรืองตลอดปี" },
    2: { name: "เดือนยี่ (เดือน ๒)", title: "คาถาหัวใจมหาเศรษฐี (อุดหนุนโชคลาภ)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nอุ อา กะ สะ อากะสะอุ กะสะอุอา สะอุอากะ (9 จบ)", detail: "ขยันหา ประหยัดเก็บ คบมิตรดี ดำรงชีวิตเหมาะสม เสริมทรัพย์สินเงินทอง" },
    3: { name: "เดือนสาม (เดือน ๓)", title: "คาถาชินบัญชร ย่อ", mantra: "ชินะปัญชะระ ปะริตตัง มัง รักขะตุ สัพพะทา (9 จบ)", detail: "ขจัดอุปสรรคทั้งปวง คุ้มครองป้องกันภัย ปรับธาตุในร่างกายให้สมดุล" },
    4: { name: "เดือนสี่ (เดือน ๔)", title: "คาถาเมตตามหานิยม (สมเด็จโต)", mantra: "เมตตา กุสะละจิตตัง อะระหัง สุคะโต โลกะวิทู (9 จบ)", detail: "คนรักใคร่เอ็นดู มิตรรักซื่อสัตย์ ติดต่อเจรจาประสบความสำเร็จ" },
    5: { name: "เดือนห้า (เดือน ๕)", title: "คาถามหาจักรพรรดิ (หลวงปู่ดู่)", mantra: "นโมพุทธายะ พระพุทธะ ไตรรัตนะญาณ มณีนพรัตน์ สีสะหัสสะ สุธรรมา พุทโธ ธัมโม สังโฆ ยะธาพุทธโมนะ...", detail: "ปรับภพภูมิ ปรับดวงชะตาให้สูงขึ้น คุ้มครองแคล้วคลาด ปรับรังสีออร่าให้แจ่มใส" },
    6: { name: "เดือนหก (เดือน ๖)", title: "คาถาโพธิบาท (ป้องกันภัย 10 ทิศ)", mantra: "บูรพารัสมิง พระพุทธะคุณัง บูรพารัสมิง พระธัมเมตัง บูรพารัสมิง พระสังฆานัง...", detail: "สร้างเกราะป้องกันภัยอันตราย เสริมความปลอดภัยในชีวิตและการเดินทาง" },
    7: { name: "เดือนเจ็ด (เดือน ๗)", title: "คาถามหาลาภ (หลวงพ่อกวย)", mantra: "สุจิปุลิ มหาลาโภ ภะวันตุ เม (9 จบ)", detail: "เปิดทางโชคลาภ เสริมสติปัญญา ความคิดสร้างสรรค์ แก้ปัญหาฉับไว" },
    8: { name: "เดือนแปด (เดือน ๘)", title: "คาถาบารมี 30 ทัศ", mantra: "อิติปาระมิตา ติงสา อิติสัพพัญญู มาคะตา อิติโพธิ มะนุปปัตโต อิติปิโส จะเตนะโม (9 จบ)", detail: "บำเพ็ญบารมี เสริมความอดทน ชนะศัตรูคู่แข่ง ข้ามผ่านวิกฤตชีวิต" },
    9: { name: "เดือนเก้า (เดือน ๙)", title: "คาถาพระพุทธเจ้า 5 พระองค์", mantra: "นะ โม พุท ธา ยะ (108 จบ)", detail: "เสริมความเป็นสิริมงคลสูงสุด ชนะอุปสรรค ป้องกันคุณไสยและภัยมืด" },
    10: { name: "เดือนสิบ (เดือน ๑๐)", title: "คาถาต่ออายุ (อุณหิสสะวิชะยะสูตร)", mantra: "อัตถิ อุณหิสสะ วิชะโย ธัมโม โลเก อะนุตตะโร สัพพะสัตตะหิตัตถายะ ตัง ตวัง คัณหาหิ เทวะเต...", detail: "ต่ออายุขัย ป้องกันโรคภัยไข้เจ็บ ปรับดวงคนป่วยให้ทุเลาเบาบาง" },
    11: { name: "เดือนสิบเอ็ด (เดือน ๑๑)", title: "คาถาพระปาจิม (พระอุปคุตมหาลาภ)", mantra: "อุปะคุตโต จะ มะหาเถโร สัมพุทเธนะ วิยากะโต มาระญจะ มาระพะลัง จะ นิพพานัง สุขัง ตัง วันทามิ...", detail: "ขจัดขวากหนามอุปสรรค ปราบมาร มีโชคลาภขจัดความขัดสน" },
    12: { name: "เดือนสิบสอง (เดือน ๑๒)", title: "คาถานพเคราะห์สวดบูชาดวงชะตา", mantra: "ยะโตหัง ภะคินี อะริยายะ ชาติยา ชาโต นาภิชานามิ สัญจิจจะ ปาณัง ชีวิตา โวโรเปตา...", detail: "ชำระจิตใจให้บริสุทธิ์ ต้อนรับสิ่งดีๆ เสริมโชคลาภรับปีใหม่จันทรคติ" }
};

// 3. บทสวดประจำปีเกิด (12 ปีนักษัตร)
const CHANTS_BY_ZODIAC = {
    "ชวด": { relic: "พระธาตุศรีจอมทอง (เชียงใหม่)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nสุวัณณะเจติยัง โชติปะวะรัง สะระณัง อะหัง วันทามิ สัพพะทา", detail: "เสริมความว่องไว สติปัญญาฉลาดหลักแหลม เอาตัวรอดเก่ง" },
    "ฉลู": { relic: "พระธาตุลำปางหลวง (ลำปาง)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nยาเปนตุ พุทธะชาตินัง มหาธาตุ ลัมพะกัปปะปุระ อะหัง วันทามิ สัพพะทา", detail: "เสริมความอดทน หนักแน่น มั่นคง การงานเจริญก้าวหน้ายั่งยืน" },
    "ขาล": { relic: "พระธาตุช่อแฮ (แพร่)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nโกสิยะ ธะชัคคะ ปัพพะเต สุพัณณะ เจติยัง อะหัง วันทามิ สัพพะทา", detail: "เสริมบารมี ตบะอำนาจ ชนะศัตรูขวากหนาม คุ้มครองเกรงขาม" },
    "เถาะ": { relic: "พระธาตุแช่แห้ง (น่าน)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nยา ธาตุเสฏฐา อะระหันตา ชินะธาตุ อะหัง วันทามิ สัพพะทา", detail: "เสริมเสน่ห์ความเมตตา อ่อนโยน มีผู้อุปถัมภ์ค้ำชูอยู่เสมอ" },
    "มะโรง": { relic: "พระธาตุพระสิงห์ (เชียงใหม่)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nนะมามิ พุทธะรูปัง อะระหัง สุคะโต ชินะธาตุ อะหัง วันทามิ สัพพะทา", detail: "เสริมวาสนา บารมี ยศถาบรรดาศักดิ์ เป็นที่เคารพยำเกรง" },
    "มะเส็ง": { relic: "พระเจดีย์พุทธคยา (อินเดีย) / พระธาตุชีวกลิ่น", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nปะฐะมัง พุทธะโพธิยัง ปัญจะมะหาฐาเน อะหัง วันทามิ สัพพะทา", detail: "เสริมหยั่งรู้ สัญชาตญาณแม่นยำ ป้องกันสิ่งลี้ลับและคุณไสย" },
    "มะเมีย": { relic: "พระบรมธาตุเมืองนคร (นครศรีธรรมราช) / พระธาตุชเวดากอง", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nอะระหันตะ ธาตุ สุวัณณะเจติยัง อะหัง วันทามิ สัพพะทา", detail: "เสริมความรวดเร็ว ก้าวหน้า ค้าขายทางไกลสำเร็จ รวดเร็วทันใจ" },
    "มะแม": { relic: "พระธาตุดอยสุเทพ (เชียงใหม่)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nสุวัณณะเจติยัง สุเทปะปัพพะตัง อะหัง วันทามิ สัพพะทา", detail: "เสริมความเมตตา โชคลาภ มิตรสหายช่วยเหลือ งานราบรื่นไร้อุปสรรค" },
    "วอก": { relic: "พระธาตุพนม (นครพนม)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nกะปะณะปะนัง มหาธาตุเจติยัง อะหัง วันทามิ สัพพะทา", detail: "เสริมความเฉลียวฉลาด แก้ไขปัญหาคล่องแคล่ว เปลี่ยนร้ายเป็นดี" },
    "ระกา": { relic: "พระธาตุหริภุญชัย (ลำพูน)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nสุวัณณะเจติยัง หะริภุญชะยัฏฐัง อะหัง วันทามิ สัพพะทา", detail: "เสริมขยันทำมาหากิน เสียงพูดมีพลัง ดึงดูดทรัพย์สินเงินทอง" },
    "จอ": { relic: "พระธาตุเกตุแก้วจุฬามณี / พระธาตุอินทร์แขวน", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nจุฬามะณี ปะติฏฐิตา อะระหันตะ ธาตุ อะหัง วันทามิ สัพพะทา", detail: "เสริมความกตัญญู ซื่อสัตย์สุจริต มีเทวดาคุ้มครองรักษาดวงชะตา" },
    "กุน": { relic: "พระธาตุดอยตุง (เชียงราย)", mantra: "นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (3 จบ)\nพุทธะธาตุ สุวัณณะเจติยัง ตุงคะปัพพะตัง อะหัง วันทามิ สัพพะทา", detail: "เสริมความอุดมสมบูรณ์ กินอิ่มนอนหลับ พ้นจากความยากจนขัดสน" }
};

// 4. บทสวดประจำราศีเกิด (12 ราศี)
const CHANTS_BY_RASEI = {
    1: { name: "ราศีเมษ (ดาวอังคาร เลข ๓)", mantra: "คาถาพระอังคาร: ติ หัง จะ โต โร ถิ นัง (8 จบ)", detail: "เสริมความกล้าหาญ ขจัดความกลัว เพิ่มพลังชีวิตและการต่อสู้" },
    2: { name: "ราศีพฤษภ (ดาวศุกร์ เลข ๖)", mantra: "คาถาพระศุกร์: วา โธ โน อะ มะ มะ วา (21 จบ)", detail: "เสริมเสน่ห์ การเงิน ความรัก รสนิยมและความสุขสวัสดิ์" },
    3: { name: "ราศีเมถุน (ดาวพุธ เลข ๔)", mantra: "คาถาพระพุธ: ปิ สัม ระ โล ปุ สัต พุท (17 จบ)", detail: "เสริมความสามารถด้านการสื่อสาร การเจรจา และสติปัญญา" },
    4: { name: "ราศีกรกฎ (ดาวจันทร์ เลข ๒)", mantra: "คาถาพระจันทร์: อิ ระ ชา คะ ตะ ระ สา (15 จบ)", detail: "เสริมเมตตามหานิยม จิตใจละมุนละไม ผู้ใหญ่เอ็นดู" },
    5: { name: "ราศีสิงห์ (ดาวอาทิตย์ เลข ๑)", mantra: "คาถาพระอาทิตย์: อะ วิ สุ โล ปุ สะ พุ ภะ (6 จบ)", detail: "เสริมอำนาจ เกียรติยศ ศักดิ์ศรี ความเป็นผู้นำ" },
    6: { name: "ราศีกันย์ (ดาวพุธ เลข ๔)", mantra: "คาถาพระพุธ: ปิ สัม ระ โล ปุ สัต พุท (17 จบ)", detail: "เสริมความละเอียดรอบคอบ การวิเคราะห์ ค้าขายก้าวหน้า" },
    7: { name: "ราศีตุลย์ (ดาวศุกร์ เลข ๖)", mantra: "คาถาพระศุกร์: วา โธ โน อะ มะ มะ วา (21 จบ)", detail: "เสริมความยุติธรรม เสน่ห์ดึงดูด หุ้นส่วนและคู่ครองราบรื่น" },
    8: { name: "ราศีพิจิก (ดาวอังคาร เลข ๓)", mantra: "คาถาพระอังคาร: ติ หัง จะ โต โร ถิ นัง (8 จบ)", detail: "เสริมจิตใจเข้มแข็ง ความอดทน เอาชนะอุปสรรคซ่อนเร้น" },
    9: { name: "ราศีธนู (ดาวพฤหัสบดี เลข ๕)", mantra: "คาถาพระพฤหัสบดี: ภะ สัม สัม วิ สะ เท ภะ (19 จบ)", detail: "เสริมความรู้ คุณธรรม ผู้ใหญ่อุปถัมภ์ ความก้าวหน้ายั่งยืน" },
    10: { name: "ราศีมังกร (ดาวเสาร์ เลข ๗)", mantra: "คาถาพระเสาร์: คะ พุท ปัน ทู ธัม วะ คะ (10 จบ)", detail: "เสริมความอดทน ทรหด อสังหาริมทรัพย์และความมั่นคง" },
    11: { name: "ราศีกุมภ์ (ดาวราหู เลข ๘)", mantra: "คาถาพระราหู: กิน นุ สัน ตะ ระ มา โน วะ (12 จบ)", detail: "เสริมพลิกวิกฤตเป็นโอกาส ความคิดนอกกรอบ โชคลาภก้อนโต" },
    12: { name: "ราศีมีน (ดาวพฤหัสบดี เลข ๕)", mantra: "คาถาพระพฤหัสบดี: ภะ สัม สัม วิ สะ เท ภะ (19 จบ)", detail: "เสริมความสงบสุข สติปัญญาญาณ การหลุดพ้นจากปัญหา" }
};

// สลับดึงราศีตามวันเกิด
function getRaseiIndex(dateObj) {
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    if ((month === 4 && day >= 13) || (month === 5 && day <= 13)) return 1; // เมษ
    if ((month === 5 && day >= 14) || (month === 6 && day <= 13)) return 2; // พฤษภ
    if ((month === 6 && day >= 14) || (month === 7 && day <= 14)) return 3; // เมถุน
    if ((month === 7 && day >= 15) || (month === 8 && day <= 16)) return 4; // กรกฎ
    if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return 5; // สิงห์
    if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) return 6; // กันย์
    if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) return 7; // ตุลย์
    if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) return 8; // พิจิก
    if ((month === 12 && day >= 16) || (month === 1 && day <= 13)) return 9; // ธนู
    if ((month === 1 && day >= 14) || (month === 2 && day <= 12)) return 10; // มังกร
    if ((month === 2 && day >= 13) || (month === 3 && day <= 13)) return 11; // กุมภ์
    return 12; // มีน
}

/**
 * แสดงผลหน้าบทสวดมนต์เสริมดวงชะตา 4 มิติ
 */
function showChantPage() {
    const container = document.getElementById("chantContainer");
    if (!container) return;

    let birthDateVal = "";
    if (typeof MemberManager !== 'undefined' && typeof MemberManager.getSingleProfile === 'function') {
        const prof = MemberManager.getSingleProfile();
        if (prof && prof.birthdate) birthDateVal = prof.birthdate;
    }
    if (!birthDateVal) birthDateVal = localStorage.getItem("userBirthdate") || "";

    container.innerHTML = `
        <div class="headpage">
            <h1>🕉️ บทสวดมนต์เสริมดวงชะตา</h1>
            <p class="text">รวมพระคาถามหาศิริมงคลประจำ วันเกิด • เดือนเกิด • ปีเกิด • ราศีเกิด</p>
        </div>
        <div class="container">
            <div class="card shadow-lg mb-4" style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.4);border-radius:16px;">
                <div class="card-body p-4">
                    <div class="row justify-content-center mb-3">
                        <div class="col-md-6">
                            <label class="text-gold mb-2">👤 เลือกสมาชิกจากประวัติ</label>
                            <select class="form-control bg-dark text-white border-gold member-selector-shared" onchange="autoFillMemberData(this.value); setTimeout(calculateChants, 150);">
                                <option value="">-- เลือกสมาชิก --</option>
                            </select>
                        </div>
                    </div>

                    <div class="row justify-content-center mb-4">
                        <div class="col-md-6 text-center">
                            <label class="text-gold mb-2">📅 วันเดือนปีเกิดของคุณ</label>
                            <div class="input-group mb-3">
                                <input type="date" id="chantBirthDate" class="form-control bg-dark text-white border-gold" value="${birthDateVal}" onchange="calculateChants()">
                                <div class="input-group-append">
                                    <button class="btn btn-gold" onclick="calculateChants()">
                                        <i class="fas fa-praying-hands mr-1"></i> ค้นหาบทสวด
                                    </button>
                                </div>
                            </div>

                            <button class="btn btn-outline-warning btn-block shadow-sm py-2 mb-2" onclick="navigateTo('lifeExtensionPage')" style="border-radius: 25px; font-weight: bold; background: rgba(212, 175, 55, 0.15);">
                                <i class="fas fa-fire-alt text-warning mr-2"></i> ✨ เข้าสู่พิธีบทสวดสวดต่อชะตาสะเดาะเคราะห์ (พิธีเต็ม)
                            </button>

                            <button class="btn btn-gold btn-block shadow-sm py-2" onclick="window.location.href='chantLibrary.html'" style="border-radius: 25px; font-weight: bold;">
                                <i class="fas fa-book-open mr-2"></i> 📚 เปิดคลังบทสวดมนต์ทั้งหมด (บาลี & แปลไทย)
                            </button>
                        </div>
                    </div>

                    <div id="chantResults" class="mt-4"></div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="navigateTo('mainpage')"><i class="fas fa-chevron-left"></i> ห้องพยากรณ์</button></div>
                <div class="col-6"><button class="btn btn-outline-secondary btn-block border-0" onclick="goBack()"><i class="fas fa-home"></i> หน้าหลัก</button></div>
            </div>
        </div>
    `;

    // อัปเดตสมาชิกในตัวเลือก
    if (typeof window.updateAllMemberSelectors === "function") {
        const allHistory = JSON.parse(localStorage.getItem('horo_history') || '[]');
        window.updateAllMemberSelectors(allHistory);
    }

    if (birthDateVal) {
        calculateChants();
    }
}

function calculateChants() {
    const dateInput = document.getElementById("chantBirthDate");
    const resultDiv = document.getElementById("chantResults");
    if (!dateInput || !resultDiv) return;

    if (!dateInput.value) {
        resultDiv.innerHTML = `<div class="alert alert-warning text-center">กรุณาเลือกวันเดือนปีเกิดเพื่อดูบทสวดเสริมดวงประจำตัวท่าน</div>`;
        return;
    }

    const d = new Date(dateInput.value);
    if (isNaN(d.getTime())) return;

    // 1. วันเกิด
    const dayOfWeek = d.getDay();
    const chantDay = CHANTS_BY_DAY[dayOfWeek] || CHANTS_BY_DAY[0];

    // 2. เดือนเกิด (จันทรคติไทย)
    let chantMonth = CHANTS_BY_MONTH[1];
    if (typeof getThaiLunar === 'function') {
        const lunar = getThaiLunar(d);
        if (lunar && lunar.month) {
            let mNum = parseInt(lunar.month);
            if (isNaN(mNum)) {
                if (lunar.month.includes("อ้าย")) mNum = 1;
                else if (lunar.month.includes("ยี่")) mNum = 2;
                else mNum = 8;
            }
            if (CHANTS_BY_MONTH[mNum]) chantMonth = CHANTS_BY_MONTH[mNum];
        }
    } else {
        const m = d.getMonth() + 1;
        chantMonth = CHANTS_BY_MONTH[m] || CHANTS_BY_MONTH[1];
    }

    // 3. ปีเกิด (ปีนักษัตร)
    let chantZodiac = CHANTS_BY_ZODIAC["ชวด"];
    let zodiacName = "ชวด";

    if (typeof getThaiLunar === 'function') {
        const lunar = getThaiLunar(d);
        if (lunar && lunar.zodiac) {
            zodiacName = lunar.zodiac;
        }
    }
    
    if (!zodiacName || zodiacName === "ชวด") {
        if (typeof getThaiZodiacYear === 'function') {
            const zYear = getThaiZodiacYear(d);
            const zNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
            const zIdx = (zYear - 4) % 12;
            zodiacName = zNames[(zIdx + 12) % 12] || "ชวด";
        } else {
            const zNames = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];
            const zIdx = (d.getFullYear() - 4) % 12;
            zodiacName = zNames[(zIdx + 12) % 12] || "ชวด";
        }
    }

    if (CHANTS_BY_ZODIAC[zodiacName]) {
        chantZodiac = CHANTS_BY_ZODIAC[zodiacName];
    }

    // 4. ราศีเกิด
    const raseiIdx = getRaseiIndex(d);
    const chantRasei = CHANTS_BY_RASEI[raseiIdx];

    resultDiv.innerHTML = `
        <div class="text-center mb-4">
            <h3 class="text-gold"><i class="fas fa-dharmachakra fa-spin mr-2" style="--fa-animation-duration: 15s;"></i> พระคาถามหาศิริมงคล 4 มิติ เสริมดวงชะตา</h3>
            <p class="text-white-50">สวดมนต์เจริญภาวนาเป็นประจำเพื่อความเป็นสิริมงคลขจัดอุปสรรคทั้งปวง</p>
        </div>

        <div class="row">
            <!-- 1. วันเกิด -->
            <div class="col-md-6 mb-4">
                <div class="card h-100 bg-dark border-gold text-white shadow">
                    <div class="card-header bg-gold-dark text-gold font-weight-bold d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #d4af37;">
                        <span><i class="fas fa-sun mr-2"></i>1. บทสวดประจำวันเกิด</span>
                        <span class="badge badge-warning">${chantDay.name}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="text-warning mb-2">${chantDay.planet} (${chantDay.buddha})</h5>
                        <p class="text-muted small mb-3">✨ ${chantDay.effect}</p>
                        <div class="p-3 mb-3 rounded" style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3);">
                            <label class="text-gold small font-weight-bold">พระคาถาบทสั้นประจำวัน:</label>
                            <div class="text-white h5 text-center my-2 font-weight-bold">${chantDay.mantraShort}</div>
                        </div>
                        <div class="p-3 rounded" style="background: rgba(0,0,0,0.4); border: 1px solid #444;">
                            <label class="text-gold-50 small font-weight-bold">พระคาถาฉบับเต็ม:</label>
                            <pre class="text-gold mb-0" style="font-family: inherit; font-size: 0.95rem; white-space: pre-wrap;">${chantDay.mantraFull}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. เดือนเกิด -->
            <div class="col-md-6 mb-4">
                <div class="card h-100 bg-dark border-gold text-white shadow">
                    <div class="card-header bg-gold-dark text-gold font-weight-bold d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #d4af37;">
                        <span><i class="fas fa-moon mr-2"></i>2. บทสวดประจำเดือนเกิด</span>
                        <span class="badge badge-info">${chantMonth.name}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="text-info mb-2">${chantMonth.title}</h5>
                        <p class="text-muted small mb-3">✨ ${chantMonth.detail}</p>
                        <div class="p-3 rounded" style="background: rgba(0,0,0,0.4); border: 1px solid #444;">
                            <label class="text-gold-50 small font-weight-bold">บทสวดเจริญภาวนาประจำเดือน:</label>
                            <pre class="text-gold mb-0" style="font-family: inherit; font-size: 0.95rem; white-space: pre-wrap;">${chantMonth.mantra}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. ปีเกิด -->
            <div class="col-md-6 mb-4">
                <div class="card h-100 bg-dark border-gold text-white shadow">
                    <div class="card-header bg-gold-dark text-gold font-weight-bold d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #d4af37;">
                        <span><i class="fas fa-dragon mr-2"></i>3. บทสวดประจำปีเกิด (นักษัตร)</span>
                        <span class="badge badge-danger">ปี${zodiacName}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="text-danger mb-2">พระธาตุประจำปี: ${chantZodiac.relic}</h5>
                        <p class="text-muted small mb-3">✨ ${chantZodiac.detail}</p>
                        <div class="p-3 rounded" style="background: rgba(0,0,0,0.4); border: 1px solid #444;">
                            <label class="text-gold-50 small font-weight-bold">บทบูชาพระธาตุประจำปีเกิด:</label>
                            <pre class="text-gold mb-0" style="font-family: inherit; font-size: 0.95rem; white-space: pre-wrap;">${chantZodiac.mantra}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. ราศีเกิด -->
            <div class="col-md-6 mb-4">
                <div class="card h-100 bg-dark border-gold text-white shadow">
                    <div class="card-header bg-gold-dark text-gold font-weight-bold d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #d4af37;">
                        <span><i class="fas fa-star mr-2"></i>4. บทสวดประจำราศีเกิด</span>
                        <span class="badge badge-success">${chantRasei.name.split(' ')[0]}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="text-success mb-2">${chantRasei.name}</h5>
                        <p class="text-muted small mb-3">✨ ${chantRasei.detail}</p>
                        <div class="p-3 rounded" style="background: rgba(0,0,0,0.4); border: 1px solid #444;">
                            <label class="text-gold-50 small font-weight-bold">บทสวดบูชาดาวเกษตรเจ้าเรือนราศี:</label>
                            <pre class="text-gold mb-0" style="font-family: inherit; font-size: 0.95rem; white-space: pre-wrap;">${chantRasei.mantra}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("chantContainer")) {
        showChantPage();
    }
});

window.showChantPage = showChantPage;
window.calculateChants = calculateChants;
