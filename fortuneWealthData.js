"use strict";

// ===========================================================================
// ตารางสมบัติมหาจักร — ผลการพบกันระหว่างปีนักษัตรทั้ง 12
// ===========================================================================
const fortuneWealthData = {
    rat:     { name: "ชวด",   matches: { rat: "คนโหด",       ox: "พ่อค้าเป็ด",  tiger: "พ่อค้าถ่าน",  rabbit: "เศรษฐี",        dragon: "เรือจ้าง",     snake: "พ่อค้าหาปลา", horse: "เศรษฐี",    goat: "พ่อค้ายา",   monkey: "นายทวาร",    rooster: "หัวหมื่น",  dog: "พระยา",       pig: "เทวดา"         } },
    ox:      { name: "ฉลู",   matches: { ox: "เจ้าสำเภา",    rat: "ตลาด",        tiger: "เศรษฐี",       rabbit: "ขุนคลัง",       dragon: "ลูกขุน",       snake: "นายเมือง",    horse: "เศรษฐี",    goat: "คนโหด",      monkey: "เรือจ้าง",   rooster: "พระอินทร์", dog: "พระอินทร์",   pig: "คนเลี้ยงม้า"   } },
    tiger:   { name: "ขาล",   matches: { tiger: "เข็ญใจ",    rat: "พ่อค้าปลา",  ox: "เศรษฐี",          rabbit: "พ่อค้า",        dragon: "เจ้าสำเภา",    snake: "ขุนคลัง",     horse: "พ่อค้า",    goat: "เทวดา",      monkey: "พ่อค้าทอง",  rooster: "เทวดา",     dog: "พ่อค้า",      pig: "เทวดา"         } },
    rabbit:  { name: "เถาะ",  matches: { rabbit: "แม่ค้า",   rat: "เศรษฐี",      ox: "ขุนคลัง",         tiger: "พ่อค้า",         dragon: "ขุนคลัง",      snake: "เทวดา",       horse: "เศรษฐี",    goat: "คนโหด",      monkey: "เจ้าพระยา",  rooster: "ราชกุมาร",  dog: "ช่างเรือนหลวง", pig: "ลูกค้า"       } },
    dragon:  { name: "มะโรง", matches: { dragon: "เทวดา",    rat: "ค้าเรือ",     ox: "ขุนคลัง",         tiger: "เจ้าสำเภา",      rabbit: "ขุนคลัง",      snake: "อสูร",         horse: "เทวดา",     goat: "มนตรี",      monkey: "ยักษ์",      rooster: "พระอินทร์", dog: "คนโหด",       pig: "พระไพศรพณ์"    } },
    snake:   { name: "มะเส็ง",matches: { snake: "เลี้ยงช้าง", rat: "ค้าปลา",    ox: "พระอินทร์",        tiger: "ขุนคลัง",        rabbit: "พรานเนื้อ",    dragon: "มนตรี",      horse: "เลี้ยงม้า", goat: "ขุนคลัง",    monkey: "พระยา",      rooster: "เทวดา",     dog: "พระอินทร์",   pig: "เศรษฐี"        } },
    horse:   { name: "มะเมีย",matches: { horse: "เข็ญใจ",    rat: "ค้าปลา",      ox: "เศรษฐี",           tiger: "เทวดา",          rabbit: "ค้าวัว",       snake: "ขุนคลัง",     dragon: "หัวเมือง", goat: "ลูกค้า",     monkey: "หัวหมื่น",   rooster: "พระยา",     dog: "คนโหด",       pig: "ราชครู"        } },
    goat:    { name: "มะแม",  matches: { goat: "เข็ญใจ",     rat: "ค้าปลา",      ox: "เศรษฐี",           tiger: "ช่างทอง",        rabbit: "คนโหด",        dragon: "เจ้าสำเภา",  snake: "ขุนช้าง",   horse: "เจ้าเรือ",  monkey: "เศรษฐี",     rooster: "ขุนคลัง",   dog: "เลี้ยงวัว",   pig: "ขุนช้าง"       } },
    monkey:  { name: "วอก",   matches: { monkey: "หัวสิบ",   rat: "นายประตู",    ox: "เรือจ้าง",         tiger: "ค้าทอง",         rabbit: "พระยา",        dragon: "ยักษ์",       snake: "เทวดา",     horse: "นักเรียน",  goat: "เทวดา",        rooster: "เศรษฐี",    dog: "หมอช้าง",     pig: "พระอินทร์"     } },
    rooster: { name: "ระกา",  matches: { rooster: "เข็ญใจ",  rat: "ค้าวัว",      ox: "หัวพัน",           tiger: "ลูกขุน",         rabbit: "เศรษฐี",       dragon: "ขุนคลัง",    snake: "เศรษฐี",    horse: "ขุนช้าง",   goat: "ค้าปลา",       monkey: "เศรษฐี",     dog: "พระอินทร์",   pig: "คนโหด"         } },
    dog:     { name: "จอ",    matches: { dog: "คนโหด",       rat: "หัวหมื่นพัน", ox: "พระอินทร์",        tiger: "นายประตู",       rabbit: "ช่างเรือ",     dragon: "คนโหด",      snake: "อุปราช",    horse: "ขุนคลัง",   goat: "พ่อค้าวัว",    monkey: "หมอช้าง",    rooster: "พระยา",   pig: "เศรษฐี"        } },
    pig:     { name: "กุน",   matches: { pig: "ค้าผ้า",      rat: "หัวเมือง",    ox: "เลี้ยงม้า",        tiger: "เทวดา",          rabbit: "คนโหด",        dragon: "ไพศรพณ์",    snake: "ทำนา",      horse: "ขุนนาง",    goat: "ขายยา",        monkey: "ขุนนาง",     rooster: "เศรษฐี",  dog: "มัชฌิมา"       } }
};

// ===========================================================================
// ระดับสมบัติ — จัดกลุ่มเพื่อให้ feedback สีและความหมาย
// ===========================================================================
const wealthRank = {
    "เทวดา":        { level: 5, label: "สูงสุด",    color: "gold" },
    "พระอินทร์":    { level: 5, label: "สูงสุด",    color: "gold" },
    "พระไพศรพณ์":   { level: 5, label: "สูงสุด",    color: "gold" },
    "ไพศรพณ์":      { level: 5, label: "สูงสุด",    color: "gold" },
    "ราชกุมาร":     { level: 4, label: "สูงมาก",    color: "orange" },
    "ราชครู":        { level: 4, label: "สูงมาก",    color: "orange" },
    "พระยา":        { level: 4, label: "สูงมาก",    color: "orange" },
    "เจ้าพระยา":    { level: 4, label: "สูงมาก",    color: "orange" },
    "อุปราช":       { level: 4, label: "สูงมาก",    color: "orange" },
    "มนตรี":        { level: 3, label: "ปานกลางดี", color: "green" },
    "เศรษฐี":       { level: 3, label: "ปานกลางดี", color: "green" },
    "ขุนคลัง":      { level: 3, label: "ปานกลางดี", color: "green" },
    "เจ้าสำเภา":    { level: 3, label: "ปานกลางดี", color: "green" },
    "ลูกขุน":       { level: 3, label: "ปานกลางดี", color: "green" },
    "หัวเมือง":     { level: 3, label: "ปานกลางดี", color: "green" },
    "นายเมือง":     { level: 3, label: "ปานกลางดี", color: "green" },
    "ช่างเรือนหลวง":{ level: 3, label: "ปานกลางดี", color: "green" },
    "หัวหมื่น":     { level: 2, label: "ปานกลาง",   color: "blue" },
    "หัวหมื่นพัน":  { level: 2, label: "ปานกลาง",   color: "blue" },
    "หัวพัน":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "หัวสิบ":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ขุนช้าง":      { level: 2, label: "ปานกลาง",   color: "blue" },
    "นายทวาร":      { level: 2, label: "ปานกลาง",   color: "blue" },
    "นายประตู":     { level: 2, label: "ปานกลาง",   color: "blue" },
    "ขุนนาง":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "หมอช้าง":      { level: 2, label: "ปานกลาง",   color: "blue" },
    "มัชฌิมา":      { level: 2, label: "ปานกลาง",   color: "blue" },
    "พ่อค้าทอง":    { level: 2, label: "ปานกลาง",   color: "blue" },
    "พ่อค้ายา":     { level: 2, label: "ปานกลาง",   color: "blue" },
    "พ่อค้า":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "แม่ค้า":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ลูกค้า":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ค้าเรือ":      { level: 2, label: "ปานกลาง",   color: "blue" },
    "ค้าปลา":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ค้าวัว":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ค้าทอง":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ขายยา":        { level: 2, label: "ปานกลาง",   color: "blue" },
    "ค้าผ้า":       { level: 2, label: "ปานกลาง",   color: "blue" },
    "ทำนา":         { level: 2, label: "ปานกลาง",   color: "blue" },
    "ช่างเรือ":     { level: 2, label: "ปานกลาง",   color: "blue" },
    "เรือจ้าง":     { level: 1, label: "ต่ำ",        color: "gray" },
    "พ่อค้าปลา":    { level: 1, label: "ต่ำ",        color: "gray" },
    "พ่อค้าหาปลา":  { level: 1, label: "ต่ำ",        color: "gray" },
    "พ่อค้าถ่าน":   { level: 1, label: "ต่ำ",        color: "gray" },
    "พ่อค้าเป็ด":   { level: 1, label: "ต่ำ",        color: "gray" },
    "พ่อค้าวัว":    { level: 1, label: "ต่ำ",        color: "gray" },
    "เลี้ยงช้าง":   { level: 1, label: "ต่ำ",        color: "gray" },
    "เลี้ยงม้า":    { level: 1, label: "ต่ำ",        color: "gray" },
    "เลี้ยงวัว":    { level: 1, label: "ต่ำ",        color: "gray" },
    "เลี้ยงม้า":    { level: 1, label: "ต่ำ",        color: "gray" },
    "คนเลี้ยงม้า":  { level: 1, label: "ต่ำ",        color: "gray" },
    "ตลาด":         { level: 1, label: "ต่ำ",        color: "gray" },
    "นักเรียน":     { level: 1, label: "ต่ำ",        color: "gray" },
    "พรานเนื้อ":    { level: 1, label: "ต่ำ",        color: "gray" },
    "หัวเมือง":     { level: 1, label: "ต่ำ",        color: "gray" },
    "ยักษ์":        { level: 0, label: "ร้าย",       color: "red" },
    "อสูร":         { level: 0, label: "ร้าย",       color: "red" },
    "คนโหด":        { level: 0, label: "ร้าย",       color: "red" },
    "เข็ญใจ":       { level: 0, label: "ยากจน",      color: "red" }
};

// ===========================================================================
// เผ่าพันธุ์และเพศตามปีนักษัตร
// ===========================================================================
const raceMapping = {
    rat:     { race: "เทวดา",  gender: "ผู้ชาย" },  // ชวด
    dragon:  { race: "เทวดา",  gender: "ผู้ชาย" },  // มะโรง
    horse:   { race: "เทวดา",  gender: "ผู้หญิง" }, // มะเมีย
    goat:    { race: "เทวดา",  gender: "ผู้หญิง" }, // มะแม
    monkey:  { race: "ยักษ์",  gender: "ผู้ชาย" },  // วอก
    rooster: { race: "ยักษ์",  gender: "ผู้ชาย" },  // ระกา
    dog:     { race: "ยักษ์",  gender: "ผู้หญิง" }, // จอ
    tiger:   { race: "ยักษ์",  gender: "ผู้หญิง" }, // ขาล
    snake:   { race: "มนุษย์", gender: "ผู้ชาย" },  // มะเส็ง
    ox:      { race: "มนุษย์", gender: "ผู้ชาย" },  // ฉลู
    rabbit:  { race: "มนุษย์", gender: "ผู้หญิง" }, // เถาะ
    pig:     { race: "มนุษย์", gender: "ผู้หญิง" }  // กุน
};

// ===========================================================================
// สมพงศ์การแต่งงาน — ครบทุก 21 คู่ที่เป็นไปได้
// (เพิ่ม 4 คู่ที่ขาดหายไปจากต้นฉบับ)
// ===========================================================================
const marriageFortune = {
    "เทวดาผู้ชาย-เทวดาผู้ชาย":
        "ดีพอปานกลาง เริ่มต้นรักใคร่กันดีมีความสุขราบรื่น แต่พอมีลูกมักมีการทะเลาะวิวาท บั้นปลายชีวิตไม่สู้ราบรื่นนักเพราะไม่ค่อยเกรงใจกัน",
    "เทวดาผู้ชาย-เทวดาผู้หญิง":
        "ดีมาก อยู่ด้วยกันอย่างราบรื่นร่มเย็นเป็นสุข เป็นที่อิจฉาแก่คนทั่วไป บริบูรณ์ด้วยโภคทรัพย์สมบัติ จะอยู่กินกันตราบเท่าถือไม้เท้ายอดทองกระบองยอดเพชร",
    "เทวดาผู้หญิง-เทวดาผู้หญิง":
        "ฐานะปานกลาง ไม่สู้ราบรื่นนัก มักชิงดีชิงเด่นกัน มีเรื่องระหองระแหงเล็กน้อย หาความสุขที่แท้จริงได้ยาก",
    "เทวดาผู้ชาย-ยักษ์ผู้ชาย":
        "ไม่สู้ดี มักทะเลาะวิวาทข่มเหงกันเสมอ ไม่ลดหย่อนผ่อนปรนให้กัน ทัศนะต่างกัน มักอยู่กินด้วยกันไม่กี่ปี",
    "เทวดาผู้ชาย-ยักษ์ผู้หญิง":
        "ดีพอควร แม้จะทะเลาะกันบ้างแต่อีกฝ่ายจะนิ่งเฉย ปรับความเข้าใจกันได้ เป็นสามีภรรยาที่ดีมีทรัพย์สมบัติในชีวิตสมรส",
    "เทวดาผู้ชาย-มนุษย์ผู้ชาย":
        "ไม่สู้ดีนัก มีความหึงหวง วางอำนาจใส่กัน มักหย่าร้างกันในเวลาอันรวดเร็ว ก้นหม้อข้าวยังไม่ทันดำ",
    "เทวดาผู้ชาย-มนุษย์ผู้หญิง":
        "มีความสุขราบรื่นดีที่สุด ประสบความสำเร็จรุ่งโรจน์ตลอดชีวิต บุตรบริวารมาก ทรัพย์สมบัติบริบูรณ์",
    "เทวดาผู้หญิง-ยักษ์ผู้ชาย":
        "ไม่ดีเลย ไม่ปรองดองกัน ทะเลาะกันเรื่องไร้สาระตลอดเวลา ต่างฝ่ายมักมีชู้หลายคู่ครอง หาความสุขไม่ได้",
    "เทวดาผู้หญิง-ยักษ์ผู้หญิง":
        "ปานกลาง ต่างฝ่ายต่างมีความดื้อรั้น ชีวิตร่วมกันค่อนข้างขรุขระ ต้องพยายามประนีประนอมกันจึงจะอยู่ได้",
    "เทวดาผู้หญิง-มนุษย์ผู้ชาย":
        "ดีพอสมควร ฝ่ายชายมักยอมตาม ฝ่ายหญิงมีอำนาจมากกว่า แต่อยู่กินด้วยกันได้อย่างราบรื่น มีทรัพย์สมบัติพอกิน",
    "เทวดาผู้หญิง-มนุษย์ผู้หญิง":
        "อยู่ด้วยกันได้ไม่นาน มักเกิดจากการคลุมถุงชนโดยที่ไม่ได้รักกันจริง มักนอกใจกันในระยะเวลาอันสั้น",
    "มนุษย์ผู้ชาย-มนุษย์ผู้ชาย":
        "ไม่สู้ราบรื่นนัก มักทะเลาะกันเสมอและถูกชาวบ้านตำหนิติเตียน หึงหวงกันมาก ดีสุดแค่ระดับปานกลาง",
    "มนุษย์ผู้ชาย-มนุษย์ผู้หญิง":
        "ดีมาก รักใคร่กลมเกลียว อายุยืน บุตรบริวารมาก ได้เกียรติยศจากคนทั่วไป อยู่กันจนถือไม้เท้ายอดทองกระบองยอดเพชร",
    "มนุษย์ผู้ชาย-ยักษ์ผู้ชาย":
        "ไม่ดี ชีวิตสมรสไม่ราบรื่น หาความสุขน้อย ต้องอดกลั้นอย่างสาหัส มักทะเลาะและหย่าร้างแล้วคืนดีกันวนเวียน",
    "มนุษย์ผู้ชาย-ยักษ์ผู้หญิง":
        "ดีพอประมาณ ฝ่ายหญิงมักปรนนิบัติเอาใจดีมาก อยู่กินกันได้ยืดยาว ถ้าต่างฝ่ายเข้าใจกันจะมีความสุขพอสมควร",
    "มนุษย์ผู้หญิง-ยักษ์ผู้ชาย":
        "ไม่ดีนัก ฝ่ายชายมักข่มเหงรังแก ฝ่ายหญิงอดทนได้ในระยะหนึ่งแต่จะอ่อนล้า ชีวิตสมรสมักจบลงด้วยการพลัดพราก",
    "มนุษย์ผู้หญิง-ยักษ์ผู้หญิง":
        "ปานกลาง อยู่ด้วยกันได้ในช่วงแรก แต่ทัศนะและนิสัยต่างกันมาก ต้องใช้ความอดทนสูงมาก บั้นปลายมักแยกทางกัน",
    "ยักษ์ผู้ชาย-ยักษ์ผู้ชาย":
        "ดีนัก อยู่กันเหมือนเพื่อนสนิท มีความสุขราบรื่น การดำเนินชีวิตโลดโผน ไม่มีใครได้เปรียบเสียเปรียบกัน",
    "ยักษ์ผู้หญิง-ยักษ์ผู้หญิง":
        "ดีนัก อยู่กันเหมือนเพื่อนสนิท มีความสุขราบรื่น การดำเนินชีวิตโลดโผน ไม่มีใครได้เปรียบเสียเปรียบกัน",
    "ยักษ์ผู้ชาย-มนุษย์ผู้หญิง":
        "ไม่ดี มักข่มเหงน้ำใจและดูหมิ่นตระกูลกัน หาความสุขได้น้อย นานไปจะระทมทุกข์และยากจน",
    "ยักษ์ผู้หญิง-มนุษย์ผู้หญิง":
        "ดีแค่ช่วงแรก พออยู่ไปไม่นานจะพลัดพรากจากกันเพราะทัศนะเข้ากันไม่ได้ ต้องหย่าร้างกันโดยไม่มีใครประนีประนอม"
};

// ===========================================================================
// ธาตุประจำปีนักษัตร
// หมายเหตุ: "ทอง" ในตำราสมพงศ์มหาสมบัติถือว่าเป็นธาตุเดียวกับ "เหล็ก"
// (โลหะชนิดเดียวกัน) จึงใช้คำว่า "โลหะ" รวมทั้งสองไว้ใน elementCompatibility
// ===========================================================================
const zodiacElements = {
    rat:     "น้ำ",   // ชวด
    ox:      "ดิน",   // ฉลู
    tiger:   "ไม้",   // ขาล
    rabbit:  "ไม้",   // เถาะ
    dragon:  "โลหะ",  // มะโรง (ทอง → รวมเป็นโลหะ)
    snake:   "ไฟ",    // มะเส็ง
    horse:   "ไฟ",    // มะเมีย
    goat:    "โลหะ",  // มะแม  (ทอง → รวมเป็นโลหะ)
    monkey:  "โลหะ",  // วอก   (เหล็ก → รวมเป็นโลหะ)
    rooster: "โลหะ",  // ระกา  (เหล็ก → รวมเป็นโลหะ)
    dog:     "ดิน",   // จอ
    pig:     "น้ำ"    // กุน
};

// ===========================================================================
// ตารางความสมพงศ์ระหว่างธาตุ — ครบทุก 15 คู่
// ใช้ธาตุ 5 ชนิด: น้ำ ดิน ไม้ ไฟ โลหะ
// ===========================================================================
const elementCompatibility = {
    // ธาตุเดียวกัน
    "น้ำ-น้ำ":     { result: "ดี",      detail: "ธาตุเดียวกัน อยู่ด้วยกันร่มเย็น หนุนเสริมกันให้เจริญ" },
    "ดิน-ดิน":     { result: "ดี",      detail: "ธาตุเดียวกัน ส่งเสริมความมั่นคงและฐานะ" },
    "ไม้-ไม้":     { result: "ดี",      detail: "ธาตุเดียวกัน ช่วยกันสร้างฐานะ แต่ต้องระวังแก่งแย่งกัน" },
    "ไฟ-ไฟ":       { result: "ปานกลาง",detail: "ธาตุเดียวกัน มีพลังงานสูงร่วมกัน แต่ต้องระวังอารมณ์ร้อน" },
    "โลหะ-โลหะ":  { result: "ไม่ดี",   detail: "โลหะกับโลหะกระทบกระทั่งกัน แข็งต่อแข็ง มักขัดแย้งกันอยู่เสมอ" },

    // ธาตุเกื้อหนุนกัน (ดี)
    "ดิน-น้ำ":     { result: "ดี",      detail: "ดินชุ่มชื้นเพราะน้ำ น้ำมีที่พัก ต่างเกื้อหนุนซึ่งกันและกัน" },
    "ดิน-โลหะ":    { result: "ดี",      detail: "ดินให้กำเนิดโลหะ ส่งเสริมฐานะและความมั่งคั่ง" },
    "น้ำ-ไม้":     { result: "ดี",      detail: "น้ำช่วยให้ไม้เขียวขจีงอกงาม เกื้อหนุนกันเป็นอย่างดี" },
    "ไม้-ไฟ":      { result: "ปานกลาง",detail: "ไม้ส่งเสริมไฟ แต่ต้องระวังไม้จะถูกเผาผลาญจนหมด" },
    "โลหะ-น้ำ":    { result: "ดี",      detail: "โลหะให้กำเนิดน้ำ (ตามหลักธาตุโบราณ) เสริมสร้างความมั่งคั่ง" },

    // ธาตุขัดแย้งกัน (ไม่ดี)
    "น้ำ-ไฟ":      { result: "ไม่ดี",   detail: "น้ำดับไฟ ขัดแย้งรุนแรง ทัศนะตรงข้ามกัน มักทะเลาะไม่หยุด" },
    "ดิน-ไม้":     { result: "ปานกลาง",detail: "ไม้ดูดซึมดิน ต้องระวังฝ่ายหนึ่งเอาเปรียบอีกฝ่าย" },
    "ไฟ-โลหะ":     { result: "ไม่ดี",   detail: "ไฟหลอมละลายโลหะ ทำให้สูญเสียทรัพย์หรืออำนาจ" },
    "ไม้-โลหะ":    { result: "ไม่ดี",   detail: "โลหะตัดไม้ ฝ่ายแข็งแกร่งมักข่มเหงฝ่ายอ่อนแอ" },
    "น้ำ-ดิน":     { result: "ปานกลาง",detail: "น้ำมากเกินไปทำให้ดินพัง แต่พอดีกันจะเกื้อหนุนได้" }
};

// ===========================================================================
// ตำแหน่งนาค — ชาย: ชวด(index 0)→กุน(index 11) / หญิง: ชวด(index 11)→กุน(index 0)
// ===========================================================================
const NAGA_POSITIONS = ["หัว", "หัว", "กลาง", "กลาง", "กลาง", "กลาง", "กลาง", "กลาง", "กลาง", "กลาง", "หาง", "หาง"];

const zodiacIndex = {
    rat: 0, ox: 1, tiger: 2, rabbit: 3, dragon: 4, snake: 5,
    horse: 6, goat: 7, monkey: 8, rooster: 9, dog: 10, pig: 11
};

// ===========================================================================
// เกณฑ์เศษ — ผลการหาร 7 ของคะแนนรวม
// ===========================================================================
const remainderFortune = {
    0: { text: "ไม่มีอะไรดีเลย",                         level: "bad"  },
    1: { text: "มีทรัพย์สมบัติมาก อยู่ด้วยกันร่มเย็นเป็นสุข", level: "good" },
    2: { text: "ฝ่ายชายมักไปก่อน (ตามเกณฑ์โบราณ)",          level: "warn" },
    3: { text: "ฝ่ายหญิงมักไปก่อน (ตามเกณฑ์โบราณ)",          level: "warn" },
    4: { text: "มักเจ็บไข้ได้ป่วยทั้งคู่ ควรดูแลสุขภาพ",     level: "warn" },
    5: { text: "ดีทุกอย่าง ดีนักแล",                        level: "good" },
    6: { text: "ดีทุกอย่าง ดีนักแล",                        level: "good" }
};

// ===========================================================================
// helper — เขียนค่าลง DOM พร้อม null-check
// ===========================================================================
function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setElHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function getEl(id) {
    return document.getElementById(id);
}

// ===========================================================================
// คำนวณและแสดงผลสมพงศ์ทั้งหมด
// ===========================================================================
function calculateWealth() {
    const u = (getEl("userYear")    || {}).value || "";
    const p = (getEl("partnerYear") || {}).value || "";
    const resDiv     = getEl("wealthResult");
    const marriageBox  = getEl("marriage-result-box");
    const userRaceDisp    = getEl("user-race-display");
    const partnerRaceDisp = getEl("partner-race-display");
    const marriageText    = getEl("marriage-text");
    const userElementDisp    = getEl("uElement-display");
    const partnerElementDisp = getEl("pElement-display");
    const elemCompatText     = getEl("element-compatibility-text");
    const nagaText     = getEl("naga-text");
    const remainderText = getEl("remainder-text");

    // รีเซ็ต UI เมื่อยังไม่ได้เลือกครบ
    if (!u || !p) {
        if (resDiv)      resDiv.innerHTML = "";
        if (marriageBox) marriageBox.classList.add("d-none");
        if (userRaceDisp)    userRaceDisp.innerText = "-";
        if (partnerRaceDisp) partnerRaceDisp.innerText = "-";
        return;
    }

    // ── 1. สมบัติมหาจักร ─────────────────────────────────────────────────
    const wealthLabel = fortuneWealthData[u]?.matches[p] || "ไม่ระบุ";
    const rank        = wealthRank[wealthLabel] || { level: 1, label: "ปานกลาง", color: "gray" };
    if (resDiv) {
        resDiv.innerHTML = `<span>ตกสมบัติ: <b>${wealthLabel}</b> — ระดับ: ${rank.label}</span>`;
    }

    // ── 2. เผ่าพันธุ์และสมพงศ์แต่งงาน ───────────────────────────────────
    const uInfo = raceMapping[u];
    const pInfo = raceMapping[p];

    if (userRaceDisp)    userRaceDisp.innerText    = `${uInfo.race} ${uInfo.gender}`;
    if (partnerRaceDisp) partnerRaceDisp.innerText = `${pInfo.race} ${pInfo.gender}`;

    const pairKey    = `${uInfo.race}${uInfo.gender}-${pInfo.race}${pInfo.gender}`;
    const reverseKey = `${pInfo.race}${pInfo.gender}-${uInfo.race}${uInfo.gender}`;
    const prediction = marriageFortune[pairKey] || marriageFortune[reverseKey] || "ไม่พบข้อมูลสมพงศ์";

    if (marriageBox)  marriageBox.classList.remove("d-none");
    if (marriageText) marriageText.innerText = prediction;

    // ── 3. สมพงศ์ธาตุ ────────────────────────────────────────────────────
    const uElement = zodiacElements[u];
    const pElement = zodiacElements[p];

    if (userElementDisp)    userElementDisp.innerText    = uElement;
    if (partnerElementDisp) partnerElementDisp.innerText = pElement;

    const elemKey   = [uElement, pElement].sort().join("-");
    const elemMatch = elementCompatibility[elemKey];
    if (elemCompatText) {
        if (elemMatch) {
            elemCompatText.innerText = `${uElement} กับ ${pElement} — ${elemMatch.result}: ${elemMatch.detail}`;
        } else {
            elemCompatText.innerText = `${uElement} กับ ${pElement} — ไม่พบข้อมูลธาตุสมพงศ์`;
        }
    }

    // ── 4. สมพงศ์นาคคู่ ──────────────────────────────────────────────────
    const maleIdx   = zodiacIndex[u];
    const femaleIdx = 11 - zodiacIndex[p]; // หญิงนับย้อน

    const malePos   = NAGA_POSITIONS[maleIdx];
    const femalePos = NAGA_POSITIONS[femaleIdx];

    // ตัวนาค: ชวด-มะเส็ง = ตัวที่ 1 / มะเมีย-กุน = ตัวที่ 2
    const maleNagaNum   = maleIdx   < 6 ? 1 : 2;
    const femaleNagaNum = femaleIdx < 6 ? 1 : 2;

    let nagaComment = `ชายตก${malePos}นาค ตัวที่ ${maleNagaNum}, หญิงตก${femalePos}นาค ตัวที่ ${femaleNagaNum} — `;

    if (maleNagaNum === femaleNagaNum) {
        // ตกนาคตัวเดียวกัน
        if (maleIdx === femaleIdx) {
            if (malePos === "หัว")   nagaComment += "ดีนักแล อยู่ร่วมสุขร่วมทุกข์กันจนแก่เฒ่า มีความสุขทั้งกายและใจ";
            else if (malePos === "หาง") nagaComment += "อยู่กินกันอย่างร่มเย็นเป็นสุข รักใคร่ปรองดองไม่ทอดทิ้งกัน";
            else                        nagaComment += "รักใคร่สามัคคีกันดี แต่จะลำบากมากกว่าสุข";
        } else if (malePos === femalePos && malePos === "กลาง") {
            nagaComment += "ดี จะมีทรัพย์สินเงินทองโภคสมบัติ อยู่กันเป็นสุข";
        } else if ((malePos === "หัว" && femalePos === "หาง") || (malePos === "หาง" && femalePos === "หัว")) {
            nagaComment += "เป็นคู่ผัวเมียที่ปานกลาง ต่างพึ่งพาอาศัยกันได้";
        } else {
            nagaComment += "อาจตกทุกข์ได้ยาก เดือดร้อนใจ หาความเจริญได้ยาก";
        }
    } else {
        // ตกนาคคนละตัว
        if (malePos === "หัว" && femalePos === "หัว") {
            nagaComment += "มักหย่าร้างกัน หรือเป็นหม้ายในไม่ช้า";
        } else if (malePos === "หาง" && femalePos === "หาง") {
            nagaComment += "มักหย่าร้างกัน ไม่ดีเลย";
        } else if (malePos === "กลาง" && femalePos === "กลาง") {
            nagaComment += "อยู่กินกันไม่ยืด (ไม่ทันหม้อข้าวจะดำ) ต้องจากกัน";
        } else {
            nagaComment += "ไม่สู้ดีนัก มักหย่าร้างกัน หรือหาความเจริญได้ยากแล";
        }
    }

    if (nagaText) nagaText.innerText = nagaComment;

    // ── 5. เกณฑ์เศษ ──────────────────────────────────────────────────────
    const malePoints   = maleIdx + 1;
    const femalePoints = (11 - femaleIdx) + 1;
    const totalRemainder = ((malePoints + femalePoints) * 3) % 7;
    const remData = remainderFortune[totalRemainder] || remainderFortune[0];

    if (remainderText) {
        remainderText.innerText = `ตกเศษ ${totalRemainder}: ${remData.text}`;
    }
}

// ===========================================================================
// ผูก event — ใช้ DOMContentLoaded เพียงจุดเดียว (ลบ window.onload ออก)
// ===========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const userYear    = getEl("userYear");
    const partnerYear = getEl("partnerYear");

    if (userYear)    userYear.addEventListener("change",   calculateWealth);
    if (partnerYear) partnerYear.addEventListener("change", calculateWealth);
});