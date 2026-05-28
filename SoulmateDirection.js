function calculateSoulmateDirection() {
    const day = parseInt(document.getElementById('userBirthDay').value);
    const year = parseInt(document.getElementById('userBirthYear').value);
    const display = document.getElementById('soulmate-result-display');
    const textContent = document.getElementById('soulmate-text-content');

    // สูตร: ตั้งวันเกิด + ปีเกิด แล้วเอา 7 หาร
    const sum = day + year;
    const remainder = sum % 7;

    let prediction = "";

    switch (remainder) {
        case 1:
            prediction = "<strong>เศษ ๑ :</strong> เนื้อคู่อยู่ทาง <b>ทิศพายัพ (ตะวันตกเฉียงเหนือ) หรืออาคเนย์ (ตะวันออกเฉียงใต้)</b> เป็นผู้มีตระกูลดี รูปร่างสันทัด ผิวค่อนข้างเกือบขาว กำพร้าบิดา นิสัยใจคอและกิริยามรรยาทอ่อนโยน เรียบร้อยดีนัก วิชาความรู้พอไปได้ แต่นิสัยติดจะเป็นนักเลงอยู่บ้าง";
            break;
        case 2:
            prediction = "<strong>เศษ ๒ :</strong> เนื้อคู่อยู่ทาง <b>ทิศประจิม (ตะวันตก) หรือทิศบูรพา (ตะวันออก)</b> ตระกูลเดิมเท่าเทียมเสมอกัน เป็นคนสุภาพเรียบร้อย ซื่อสัตย์สุจริต ผิวค่อนข้างขาวหน่อย หรืออาจจะเป็นหม้าย มิฉะนั้นจะเป็นผู้ที่มีอายุแก่กว่าหลายปี";
            break;
        case 3:
            prediction = "<strong>เศษ ๓ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอิสาณ (ตะวันออกเฉียงเหนือ) หรือทิศหรดี (ตะวันตกเฉียงใต้)</b> ตระกูลสามัญ มีความรู้ดี รูปร่างค่อนข้างสูงใหญ่ ผิวดำสักหน่อย มิฉะนั้นเป็นหม้ายและมีแผลไฝที่คิ้วหรือขนตางอน หรือเป็นแผลที่นมข้างซ้าย มีความสามารถพอเลี้ยงตัวได้";
            break;
        case 4:
            prediction = "<strong>เศษ ๔ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอุดร (เหนือ) หรือทิศทักษิณ (ใต้)</b> รูปร่างใหญ่ นิสัยใจคอเป็นคนกว้างขวาง ชอบทางนักเลง เป็นคนโทโสร้ายสักหน่อย เมื่ออายุมากแล้วจึงจะดี";
            break;
        case 5:
            prediction = "<strong>เศษ ๕ :</strong> เนื้อคู่อยู่ทาง <b>ทิศทักษิณ (ใต้) หรือหรดี (ตะวันตกเฉียงใต้)</b> ผิวเนื้อค่อนข้างดำ มักจะเป็นหม้าย หรือเป็นคนกำพร้า หากผิวเนื้อขาวมากทีเดียวจึงจะต้องโฉลกดี";
            break;
        case 6:
            prediction = "<strong>เศษ ๖ :</strong> เนื้อคู่อยู่ทาง <b>ทิศหรดี (ตะวันตกเฉียงใต้) หรือทิศอุดร (เหนือ)</b> ผิวเนื้อสองสี (ดำแดง) เป็นคนนิสัยใจเร็วด่วนได้ และเป็นผู้ที่โกรธง่าย";
            break;
        case 0:
            prediction = "<strong>เศษ ๐ :</strong> เนื้อคู่อยู่ทาง <b>ทิศอาคเนย์ (ตะวันออกเฉียงใต้) หรือตะวันตกตรงกัน</b> เป็นคนผิวเนื้อสองสี (ดำแดง) โกรธจัด เป็นคนดุร้ายและเชื่อคนง่าย แต่มีความคิดความอ่านดีพอใช้";
            break;
        default:
            prediction = "ไม่พบคำทำนาย กรุณาตรวจสอบการเลือกวันและปี";
    }

    // แสดงผล
    display.style.display = "block";
    display.className = "result-card neutral"; // ใช้สไตล์สีกลางๆ ตาม CSS ที่แต่งไว้
    textContent.innerHTML = `<p style="text-align:left;">${prediction}</p>`;
}