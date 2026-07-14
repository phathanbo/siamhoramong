/**
 * สมพงศ์มหาสมบัติ - คำนวณตามตำราพรหมชาติ 100%
 */

// ข้อมูลนักษัตรและธาตุ
const SOMPONG_ZODIAC_DATA = {
    rat: { name: 'ชวด (หนู)', element: 'น้ำ', index: 1 },
    ox: { name: 'ฉลู (วัว)', element: 'ดิน', index: 2 },
    tiger: { name: 'ขาล (เสือ)', element: 'ไม้', index: 3 },
    rabbit: { name: 'เถาะ (กระต่าย)', element: 'ไม้', index: 4 },
    dragon: { name: 'มะโรง (งูใหญ่)', element: 'ทอง', index: 5 },
    snake: { name: 'มะเส็ง (งูเล็ก)', element: 'ไฟ', index: 6 },
    horse: { name: 'มะเมีย (ม้า)', element: 'ไฟ', index: 7 },
    goat: { name: 'มะแม (แพะ)', element: 'ทอง', index: 8 },
    monkey: { name: 'วอก (ลิง)', element: 'เหล็ก', index: 9 },
    rooster: { name: 'ระกา (ไก่)', element: 'เหล็ก', index: 10 },
    dog: { name: 'จอ (สุนัข)', element: 'ดิน', index: 11 },
    pig: { name: 'กุน (หมู)', element: 'น้ำ', index: 12 }
};

// กฎของสมพงศ์ธาตุ
function getElementCompatibility(elem1, elem2) {
    const pair = [elem1, elem2].sort().join('-');
    
    const compatibilityRules = {
        'น้ำ-น้ำ': { text: 'ธาตุเดียวกัน (น้ำ-น้ำ) อยู่ด้วยกันร่มเย็นเป็นสุข ทรัพย์สินเพิ่มพูน', score: 4 },
        'น้ำ-ไม้': { text: 'น้ำหล่อเลี้ยงไม้ เป็นคู่ที่ดีมาก เกื้อหนุนให้เจริญรุ่งเรืองบริบูรณ์ด้วยทรัพย์', score: 5 },
        'น้ำ-ทอง': { text: 'น้ำทำให้ทองบริสุทธิ์ ส่งเสริมกันดีในด้านทรัพย์สมบัติ', score: 4 },
        'น้ำ-เหล็ก': { text: 'น้ำทำให้เหล็กสะอาด ส่งเสริมกันดี มีโชคลาภเสมอ', score: 4 },
        'ดิน-น้ำ': { text: 'ดินกั้นน้ำ มักมีความคิดขัดแย้งกัน ต้องระวังเรื่องการใช้จ่าย', score: 2 },
        'น้ำ-ไฟ': { text: 'น้ำกับไฟดับกัน มักทะเลาะเบาะแว้ง ร้อนรุ่ม ทรัพย์สินเก็บยาก', score: 1 },
        
        'ไม้-ไม้': { text: 'ธาตุเดียวกัน (ไม้-ไม้) ชีวิตคู่ราบเรียบ ร่มเย็น แต่อาจก้าวหน้าช้า', score: 3 },
        'ดิน-ไม้': { text: 'ดินบำรุงไม้ เป็นคู่ที่สร้างเนื้อสร้างตัวได้ดี มั่นคง', score: 4 },
        'ทอง-ไม้': { text: 'ทองตัดไม้ มักขัดใจกันและมีอุปสรรคเรื่องเงินทอง', score: 2 },
        'ไม้-เหล็ก': { text: 'เหล็กตัดไม้ ความคิดมักสวนทางกัน ทำให้เกิดข้อพิพาทเรื่องทรัพย์สิน', score: 2 },
        'ไฟ-ไม้': { text: 'ไม้เป็นเชื้อไฟ อยู่ด้วยกันมักร้อนรุ่ม ขาดความสุขสงบ', score: 1 },
        
        'ดิน-ดิน': { text: 'ธาตุเดียวกัน (ดิน-ดิน) รักกันมั่นคง สร้างฐานะได้แข็งแกร่งมาก', score: 5 },
        'ดิน-ทอง': { text: 'ดินก่อเกิดทอง เป็นคู่ส่งเสริม ฐานะมั่งคั่งร่ำรวย', score: 5 },
        'ดิน-เหล็ก': { text: 'ดินก่อเกิดแร่เหล็ก ช่วยเหลือเกื้อกูลกันดีมาก', score: 4 },
        'ดิน-ไฟ': { text: 'ไฟเผาเป็นเถ้าลงดิน พออยู่กันได้ ต้องอาศัยความเข้าใจ', score: 3 },
        
        'ทอง-ทอง': { text: 'ธาตุเดียวกัน (ทอง-ทอง) รุ่งเรือง มั่งมีศรีสุขด้วยกัน', score: 5 },
        'ทอง-เหล็ก': { text: 'ทองกับเหล็ก อยู่ด้วยกันแล้วจะช่วยกันหาเงินได้ดี', score: 4 },
        'ทอง-ไฟ': { text: 'ไฟหลอมทอง มักขัดแย้งและทำให้สูญเสียทรัพย์สมบัติ', score: 1 },
        
        'เหล็ก-เหล็ก': { text: 'ธาตุเดียวกัน (เหล็ก-เหล็ก) เข้มแข็ง เด็ดขาด ช่วยกันสร้างอิทธิพลและทรัพย์', score: 4 },
        'ไฟ-เหล็ก': { text: 'ไฟหลอมเหล็ก ทะเลาะเบาะแว้งง่าย เงินทองรั่วไหล', score: 1 },
        
        'ไฟ-ไฟ': { text: 'ธาตุเดียวกัน (ไฟ-ไฟ) ร้อนแรง อาภัพ ร้อนใจ มักมีปากเสียง', score: 1 }
    };
    
    return compatibilityRules[pair] || { text: `ธาตุ ${elem1} กับ ${elem2} ถือว่าพออยู่กันได้ หากมีความรักและเข้าใจ`, score: 3 };
}

function calculateWealth() {
    const userYearId = document.getElementById('userYear').value;
    const partnerYearId = document.getElementById('partnerYear').value;
    
    const userGender = document.querySelector('input[name="userGender"]:checked').value;
    const partnerGender = document.querySelector('input[name="partnerGender"]:checked').value;

    if (!userYearId || !partnerYearId) {
        document.getElementById('marriage-result-box').classList.add('d-none');
        document.getElementById('user-race-display').innerText = '-';
        document.getElementById('uElement-display').innerText = '-';
        document.getElementById('partner-race-display').innerText = '-';
        document.getElementById('pElement-display').innerText = '-';
        return;
    }

    const uData = SOMPONG_ZODIAC_DATA[userYearId];
    const pData = SOMPONG_ZODIAC_DATA[partnerYearId];

    document.getElementById('user-race-display').innerText = uData.name;
    document.getElementById('uElement-display').innerText = uData.element;
    document.getElementById('partner-race-display').innerText = pData.name;
    document.getElementById('pElement-display').innerText = pData.element;

    // 1. ธาตุสมพงศ์
    const elementCompat = getElementCompatibility(uData.element, pData.element);

    // 2. สมพงศ์นาคคู่ (ต้องนับชายไปหาหญิง)
    let maleIndex, femaleIndex;
    
    if (userGender === 'male' && partnerGender === 'female') {
        maleIndex = uData.index;
        femaleIndex = pData.index;
    } else if (userGender === 'female' && partnerGender === 'male') {
        maleIndex = pData.index;
        femaleIndex = uData.index;
    } else {
        // กรณีเพศเดียวกัน ให้ใช้ปีที่แก่กว่า (น้อยกว่า) เป็นหลัก หรืออนุโลมนับ 1->2
        maleIndex = uData.index;
        femaleIndex = pData.index;
    }

    let nagaDistance = femaleIndex - maleIndex + 1;
    if (nagaDistance <= 0) nagaDistance += 12; // นับวน

    let nagaResult = '';
    let nagaScore = 0;
    const nagaRemainder = nagaDistance % 3;

    if (nagaRemainder === 1) { // 1, 4, 7, 10
        nagaResult = 'ตกหัวนาค : แรกๆ รักกันมาก ทรัพย์สินดี แต่อยู่ไปปลายๆ มักจะผิดใจกัน ต้องระวังอารมณ์';
        nagaScore = 3;
    } else if (nagaRemainder === 2) { // 2, 5, 8, 11
        nagaResult = 'ตกกลางนาค : สมพงศ์ดีมาก อยู่ด้วยกันร่มเย็นเป็นสุข รักใคร่กลมเกลียว เงินทองพอกพูน';
        nagaScore = 5;
    } else { // 0 (3, 6, 9, 12)
        nagaResult = 'ตกหางนาค : อาภัพ มักมีปากเสียง หย่าร้าง หรือต้องเหน็ดเหนื่อยแสนสาหัสเรื่องเงินทอง';
        nagaScore = 1;
    }

    // 3. เกณฑ์คำนวณเศษ (ความยั่งยืน)
    const totalSum = uData.index + pData.index;
    const formulaVal = (totalSum * 3);
    const remainder = formulaVal % 7;
    
    let remainderText = '';
    let remainderScore = 0;

    switch (remainder) {
        case 1:
            remainderText = 'เศษ ๑ : ดีมาก จะมีข้าทาสบริวาร ทรัพย์สมบัติมาก เป็นเศรษฐี';
            remainderScore = 5;
            break;
        case 2:
            remainderText = 'เศษ ๒ : กลางๆ จะต้องเหน็ดเหนื่อยฝ่าฟันก่อน จึงจะตั้งตัวได้มั่นคง';
            remainderScore = 3;
            break;
        case 3:
            remainderText = 'เศษ ๓ : ดี มีกินมีใช้ไม่ขาดมือ ร่มเย็นเป็นสุข ไร้ความยากลำบาก';
            remainderScore = 4;
            break;
        case 4:
            remainderText = 'เศษ ๔ : ไม่ดี มักมีเรื่องเดือดร้อนใจ เสียทรัพย์สินบ่อย เก็บเงินไม่อยู่';
            remainderScore = 2;
            break;
        case 5:
            remainderText = 'เศษ ๕ : ดีมาก จะมีทรัพย์สมบัติ ยศถาบรรดาศักดิ์ และบริวารมาก';
            remainderScore = 5;
            break;
        case 6:
            remainderText = 'เศษ ๖ : ร้าย มักวิวาท ขัดแย้ง หามาได้เท่าไรก็หมดไป';
            remainderScore = 1;
            break;
        case 0:
            remainderText = 'เศษ ๐ (ลงตัว) : อาภัพ ทรัพย์สินมักวิบัติ หรือสุขภาพอ่อนแอ';
            remainderScore = 1;
            break;
    }

    // ประมวลผลลัพธ์รวม
    const totalScore = elementCompat.score + nagaScore + remainderScore; // Max: 15
    let overallWealth = '';
    let overallText = '';

    if (totalScore >= 13) {
        overallWealth = 'เกณฑ์สมบัติ: ระดับเศรษฐีมหาศาล 🌟';
        overallText = 'ชะตาคู่นี้ส่งเสริมกันอย่างยอดเยี่ยม เป็นคู่บุญบารมี ทรัพย์สินเงินทองจะงอกเงยทวีคูณ หยิบจับสิ่งใดก็เป็นเงินเป็นทอง ควรทำธุรกิจร่วมกันจะรุ่งเรืองที่สุด';
    } else if (totalScore >= 10) {
        overallWealth = 'เกณฑ์สมบัติ: ระดับดีมาก 💰';
        overallText = 'ชะตาคู่นี้เข้ากันได้ดีมาก ช่วยกันทำมาหากินสร้างเนื้อสร้างตัวได้ไว ครอบครัวมีความมั่นคง อบอุ่นสมบูรณ์พูนสุข';
    } else if (totalScore >= 7) {
        overallWealth = 'เกณฑ์สมบัติ: ระดับปานกลาง ⚖️';
        overallText = 'ชะตาคู่นี้อยู่เกณฑ์พอใช้ ต้องอาศัยความขยันหมั่นเพียรและอดทน ชีวิตคู่จึงจะราบรื่น สามารถสร้างฐานะได้แต่อาจต้องใช้เวลาประคับประคอง';
    } else {
        overallWealth = 'เกณฑ์สมบัติ: ระดับต้องฝ่าฟัน ⚠️';
        overallText = 'ชะตาคู่นี้มีความขัดแย้งในเรื่องธาตุและโชคลาภ มักจะเหน็ดเหนื่อยในเรื่องการเงิน ต้องใช้สติ ความอดทน และรู้จักเก็บออมอย่างมากจึงจะพ้นอุปสรรคไปได้';
    }

    // แสดงผล
    document.getElementById('element-compatibility-text').innerText = elementCompat.text;
    document.getElementById('naga-text').innerText = nagaResult;
    document.getElementById('remainder-text').innerText = remainderText;
    document.getElementById('wealthResult').innerText = overallWealth;
    document.getElementById('marriage-text').innerText = overallText;

    document.getElementById('marriage-result-box').classList.remove('d-none');
}

window.calculateWealth = calculateWealth;
