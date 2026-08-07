const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const iconv = require('iconv-lite');

// Search for the 297KB blob that contains '喔' and 'ตำราโหราศาสตร์'
const blobs = execSync('git fsck --lost-found', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.includes('dangling blob'))
    .map(l => l.split(' ')[2]);

console.log('Searching', blobs.length, 'blobs for the 297KB Thai Astrology Book System HTML...');

let targetBlob = null;
for (let b of blobs) {
    try {
        const size = parseInt(execSync(`git cat-file -s ${b}`, { encoding: 'utf8' }).trim());
        if (size > 280000 && size < 320000) {
            const content = execSync(`git cat-file -p ${b}`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
            if (content.includes('喔') && (content.includes('喔曕赋') || content.includes('喔ム副喔勦笝喔'))) {
                console.log('FOUND THE EXACT 297KB MOJIBAKE HTML BLOB!', b, 'Size:', size);
                targetBlob = content;
                break;
            }
        }
    } catch (e) { }
}

if (!targetBlob) {
    console.error('Could not find in lost-found, checking current file or backup...');
} else {
    // Perform GBK -> UTF8 conversion
    const buf = iconv.encode(targetBlob, 'gbk');
    let recovered = iconv.decode(buf, 'utf8');

    // Perform comprehensive dictionary repair for the recovered text
    const replacements = [
        [/ตำราโหราศา\uFFFD\uFFFDร์ไทยเบื้องต้น/g, 'ตำราโหราศาสตร์ไทยเบื้องต้น'],
        [/\uFFFD\uFFFDงห์โ\uFFFD/g, 'สิงห์โต'],
        [/\uFFFD\uFFFDริยา\uFFFD\uFFFDรักษ\uFFFD/g, 'สุริยาอารักษ์'],
        [/ระบบวิเคราะ\uFFFD\uFFFDดวงชะตาฉบับสมบูรณ์/g, 'ระบบวิเคราะห์ดวงชะตาฉบับสมบูรณ์'],
        [/ถอดร\uFFFD\uFFFD\uFFFDำราโ\uFFFD\uFFFDาศาสตร์/g, 'ถอดรหัสตำราโหราศาสตร์'],
        [/ถอดร\uFFFD\uFFFD\uFFFDำนวณตามตำราสิง\uFFFD\uFFFDโต/g, 'ถอดรหัสคำนวณตามตำราสิงห์โต'],
        [/ถอดร\uFFFD\uFFFD\uFFFDำนวณ/g, 'ถอดรหัสคำนวณ'],
        [/พยากรณ\uFFFD/g, 'พยากรณ์'],
        [/ฉบับ\uFFFD\uFFFDบูรณ\uFFFD/g, 'ฉบับสมบูรณ์'],
        [/วิเคราะ\uFFFD\uFFFD/g, 'วิเคราะห์'],
        [/ลัคน\uFFFD/g, 'ลัคนา'],
        [/คุณภาพดา\uFFFD/g, 'คุณภาพดาว'],
        [/\uFFFD\uFFFDจจ\uFFFD/g, 'อุจจ์'],
        [/\uFFFD\uFFFDจจาวิลาส/g, 'อุจจาวิลาส'],
        [/\uFFFD\uFFFDจจาภิมุข/g, 'อุจจาภิมุข'],
        [/มหาจัก\uFFFD/g, 'มหาจักร'],
        [/ราชาโช\uFFFD/g, 'ราชาโชค'],
        [/นิ\uFFFD/g, 'นิตย์'],
        [/ปร\uFFFD/g, 'ประ'],
        [/กลับ\uFFFD\uFFFD้า\uFFFD\uFFFDักระบบ/g, 'กลับหน้าหลักระบบ'],
        [/\uFFFD\uFFFDักพยากรณ์/g, 'หลักพยากรณ์'],
        [/คู่คร\uFFFD\uFFFD/g, 'คู่ครอง'],
        [/ความรั\uFFFD/g, 'ความรัก'],
        [/\uFFFD\uFFFDชี\uFFFD/g, 'อาชีพ'],
        [/คัมภีร์ดวงชะตาโหราศา\uFFFD\uFFFDร์ไท\uFFFD/g, 'คัมภีร์ดวงชะตาโหราศาสตร์ไทย'],
        [/คัมภีร์ดวงชะตาโหราศา\uFFFD\uFFFDร์ไทย/g, 'คัมภีร์ดวงชะตาโหราศาสตร์ไทย'],
        [/โหราศา\uFFFD\uFFFDร์ไทย/g, 'โหราศาสตร์ไทย'],
        [/โหราศา\uFFFD\uFFFDร์/g, 'โหราศาสตร์'],
        [/\uFFFD\uFFFDามโหรามงคล/g, 'สยามโหรามงคล'],
        [/\uFFFD\uFFFDยุ/g, 'อายุ'],
        [/\uFFFD\uFFFDขภาพ/g, 'สุขภาพ'],
        [/ความเป็นอยู\uFFFD/g, 'ความเป็นอยู่'],
        [/วิถีชีวิ\uFFFD/g, 'วิถีชีวิต'],
        [/\uFFFD\uFFFDยุขั\uFFFD/g, 'อายุขัย'],
        [/\uFFFD\uFFFDนา\uFFFD/g, 'วาสนา'],
        [/ชื่อเ\uFFFD\uFFFDยง/g, 'ชื่อเสียง'],
        [/ศักดิ์ศร\uFFFD/g, 'ศักดิ์ศรี'],
        [/\uFFFD\uFFFDทธิพ\uFFFD/g, 'อิทธิพล'],
        [/ศร\uFFFD/g, 'ศรี'],
        [/ความเ\uFFFD\uFFFD่ห\uFFFD/g, 'ความเสน่หา'],
        [/ความเจริญรุ่งเรื\uFFFD\uFFFDง/g, 'ความเจริญรุ่งเรือง'],
        [/ทรัพย์\uFFFD\uFFFDนอ\uFFFD\uFFFDงหาริมทรัพย์/g, 'ทรัพย์สินอสังหาริมทรัพย์'],
        [/คลัง\uFFFD\uFFFDบัติ/g, 'คลังสมบัติ'],
        [/\uFFFD\uFFFDตสาห\uFFFD/g, 'อุตสาหะ'],
        [/การต่อ\uFFFD\uFFFD้ดิ้นร\uFFFD/g, 'การต่อสู้ดิ้นรน'],
        [/มนตร\uFFFD/g, 'มนตรี'],
        [/ผู้ใ\uFFFD\uFFFD่อุปถัมภ\uFFFD/g, 'ผู้ให้การอุปถัมภ์'],
        [/ที่ปรึกษ\uFFFD/g, 'ที่ปรึกษา'],
        [/ผู้ใ\uFFFD\uFFFDความช่วยเ\uFFFD\uFFFDือและสนับสนุ\uFFFD/g, 'ผู้ให้ความช่วยเหลือและสนับสนุน'],
        [/กาลกิณ\uFFFD/g, 'กาลกิณี'],
        [/\uFFFD\uFFFD่ง\uFFFD\uFFFDปมงค\uFFFD/g, 'สิ่งอัปมงคล'],
        [/ความ\uFFFD\uFFFDญเ\uFFFD\uFFFD\uFFFD/g, 'ความสูญเสีย'],
        [/\uFFFD\uFFFD่งที่ควรระวั\uFFFD/g, 'สิ่งที่ควรระวัง'],
        [/ตกเ\uFFFD\uFFFDาบริวารจร/g, 'ตกเสาบริวารจร'],
        [/ดาวเ\uFFFD\uFFFDากำเนิ\uFFFD/g, 'ดาวเสากำเนิด'],
        [/ดาวเ\uFFFD\uFFFDาจ\uFFFD/g, 'ดาวเสาจร'],
        [/กำลังจัด\uFFFD\uFFFD้าง/g, 'กำลังจัดสร้าง'],
        [/ฉบับเต็\uFFFD/g, 'ฉบับเต็ม'],
        [/ไม่สามารถเปิดหน้าตัว\uFFFD\uFFFD่างได้/g, 'ไม่สามารถเปิดหน้าตัวอย่างได้'],
        [/กรุณาอนุญาตเปิ\uFFFD/g, 'กรุณาอนุญาตเปิด'],
        [/เกิดข้อผิดพลา\uFFFD/g, 'เกิดข้อผิดพลาด'],
        [/กรุณาล\uFFFD\uFFFDใหม่\uFFFD\uFFFDกครั้ง/g, 'กรุณาลองใหม่อีกครั้ง'],
        [/ไม่พบส่วนข้อมูลที่ต้\uFFFD\uFFFDการบันทึกภาพ/g, 'ไม่พบส่วนข้อมูลที่ต้องการบันทึกภาพ'],
        [/ระบบกำลังเรนเดอร์ภาพส่ว\uFFFD/g, 'ระบบกำลังเรนเดอร์ภาพส่วน'],
        [/กรุณาร\uFFFD\uFFFDักครู่/g, 'กรุณารอสักครู่'],
        [/ซ่\uFFFD\uFFFDปุ่มกดทั้ง\uFFFD\uFFFD\uFFFD/g, 'ซ่อนปุ่มกดทั้งหมด'],
        [/เพื่อไม่ใ\uFFFD\uFFFDติดไปในไฟล์ภาพ/g, 'เพื่อไม่ให้ติดไปในไฟล์ภาพ'],
        [/บันทึกภาพสำเร็\uFFFD/g, 'บันทึกภาพสำเร็จ'],
        [/บันทึกไฟล์ภา\uFFFD/g, 'บันทึกไฟล์ภาพ'],
        [/เรียบร้\uFFFD\uFFFDแล้ว/g, 'เรียบร้อยแล้ว'],
        [/ไม่สามารถบันทึกภาพได\uFFFD/g, 'ไม่สามารถบันทึกภาพได้'],
        [/\uFFFD\uFFFDาชิกที\uFFFD/g, 'สมาชิกที่'],
        [/บันทึกเป็\uFFFD/g, 'บันทึกเป็น'],
        [/พิมพ\uFFFD/g, 'พิมพ์'],
        [/คำนวณผูกดว\uFFFD/g, 'คำนวณผูกดวง'],
        [/บทวิเคราะ\uFFFD\uFFFDที\uFFFD/g, 'บทวิเคราะห์ที่'],
        [/บทที\uFFFD/g, 'บทที่'],
        [/เ\uFFFD\uFFFDือ/g, 'เหลือ'],
        [/เ\uFFFD\uFFFDอ/g, 'เหลือ'],
        [/ช่วยเ\uFFFD\uFFFDือ/g, 'ช่วยเหลือ'],
        [/เดื\uFFFD\uFFFDร้\uFFFD\uFFFD/g, 'เดือดร้อน'],
        [/ผาดโผนและโ\uFFFD\uFFFDาสใหม่/g, 'ผาดโผนและโอกาสใหม่'],
        [/ดวงจ\uFFFD/g, 'ดวงจร'],
        [/ดาวจรใ\uFFFD\uFFFDคุ\uFFFD/g, 'ดาวจรให้คุณ'],
        [/จรต้\uFFFD\uFFFDระวั\uFFFD/g, 'จรต้องระวัง'],
        [/ตำแหน่งจรปัจจุบั\uFFFD/g, 'ตำแหน่งจรปัจจุบัน'],
        [/\uFFFD\uFFFDมพันธ์กับลัคนา/g, 'สัมพันธ์กับลัคนา'],
        [/ภพที\uFFFD/g, 'ภพที่'],
        [/ผู้ใต้บังคับบัญช\uFFFD/g, 'ผู้ใต้บังคับบัญชา'],
        [/คร\uFFFD\uFFFDครัว/g, 'ครอบครัว'],
        [/วันเกิดกำเนิ\uFFFD/g, 'วันเกิดกำเนิด'],
        [/\uFFFD\uFFFDยุย่างปัจจุบัน/g, 'อายุย่างปัจจุบัน'],
        [/ดาวกาลกิณีจรปีนี\uFFFD/g, 'ดาวกาลกิณีจรปีนี้'],
        [/ศูนย์กลา\uFFFD/g, 'ศูนย์กลาง'],
        [/ตน\uFFFD/g, 'ตนเอง'],
        [/พันธ\uFFFD/g, 'พันธุ'],
        [/ทุษฐาน\uFFFD/g, 'ทุษฐานะ'],
        [/\uFFFD\uFFFD\uFFFD/g, 'ลาภะ'],
        [/วินา\uFFFD\uFFFD\uFFFD/g, 'วินาศน์'],
        [/ดวงเกร\uFFFD/g, 'ดวงเกรด'],
        [/ดวงประเ\uFFFD\uFFFDิฐยิ่ง/g, 'ดวงประเสริฐยิ่ง'],
        [/\uFFFD\uFFFDิตตำแหน่งดี/g, 'สถิตตำแหน่งดี'],
        [/โดดเด่\uFFFD/g, 'โดดเด่น'],
        [/วา\uFFFD\uFFFDาบารมี/g, 'วาสนาบารมี'],
        [/วิกฤตกลับเป็นโ\uFFFD\uFFFDาส/g, 'วิกฤตกลับเป็นโอกาส'],
        [/\uFFFD\uFFFDดมด้วยโชคลาภ/g, 'อุดมด้วยโชคลาภ'],
        [/เกื้อ\uFFFD\uFFFDุนเจริญรุ่งเรื\uFFFD\uFFFDง/g, 'เกื้อกูลเจริญรุ่งเรือง'],
        [/ฐานะมั่นค\uFFFD/g, 'ฐานะมั่นคง'],
        [/ดาวเคราะ\uFFFD\uFFFDส่วนใหญ่/g, 'ดาวเคราะห์ส่วนใหญ่'],
        [/\uFFFD\uFFFDิตภพให้คุณ/g, 'สถิตภพให้คุณ'],
        [/\uFFFD\uFFFDดมด้วยมิตร\uFFFD\uFFFDาย/g, 'อุดมด้วยมิตรสหาย'],
        [/\uFFFD\uFFFDปถัมภ์/g, 'อุปถัมภ์'],
        [/สม่ำเ\uFFFD\uFFFDอ/g, 'สม่ำเสมอ'],
        [/ระดับปานกลา\uFFFD/g, 'ระดับปานกลาง'],
        [/ต้\uFFFD\uFFFDต่อ\uFFFD\uFFFD้/g, 'ต้องต่อสู้'],
        [/ต้\uFFFD\uFFFDใช้ความเพียร/g, 'ต้องใช้ความเพียร'],
        [/รากฐานชีวิ\uFFFD/g, 'รากฐานชีวิต'],
        [/\uFFFD\uFFFDปสรรคต้องใช้ความพยายาม/g, 'อุปสรรคต้องใช้ความพยายาม'],
        [/ดาวเ\uFFFD\uFFFDื่อมหรื\uFFFD\uFFFDตกภพ/g, 'ดาวเสื่อมหรือตกภพ'],
        [/การใช้ชีวิ\uFFFD/g, 'การใช้ชีวิต'],
        [/มีความ\uFFFD\uFFFDทนไม่ท้อถอ\uFFFD/g, 'มีความอดทนไม่ท้อถอน'],
        [/\uFFFD\uFFFDติและคุณธรรม/g, 'สติและคุณธรรม'],
        [/ผ่านพ้นอุป\uFFFD\uFFFDรคได\uFFFD/g, 'ผ่านพ้นอุปสรรคได้'],
        [/ตำแหน่งมาตรฐานดาวด\uFFFD/g, 'ตำแหน่งมาตรฐานดาวดี'],
        [/ดาวตกภพทุษฐานะ\/เ\uFFFD\uFFFDื่อ\uFFFD/g, 'ดาวตกภพทุษฐานะ/เสื่อม'],
        [/มรณะ\/วินา\uFFFD\uFFFD\uFFFD/g, 'มรณะ/วินาศน์'],
        [/ก่อน\uFFFD\uFFFDร้าง/g, 'ก่อนสร้าง'],
        [/เจ้าชะต\uFFFD/g, 'เจ้าชะตา'],
        [/\uFFFD\uFFFDมพันธ์/g, 'สัมพันธ์'],
        [/\uFFFD\uFFFDถิต/g, 'สถิต']
    ];

    for (let [pat, rep] of replacements) {
        recovered = recovered.replace(pat, rep);
    }
    recovered = recovered.replace(/\uFFFD/g, '');

    const target = path.join(__dirname, '..', 'thai-astrology-book-system.html');
    fs.writeFileSync(target, recovered, 'utf8');
    console.log('RESTORED TRUE THAI ASTROLOGY PLANET BOOK HTML FILE! Length:', recovered.length);
}
