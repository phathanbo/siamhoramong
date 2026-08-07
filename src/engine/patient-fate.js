function calculatePatientFate() {
    const age = parseInt(document.getElementById('patientAge').value);
    const day = parseInt(document.getElementById('birthDayNum').value);
    const month = parseInt(document.getElementById('birthMonthNum').value);
    
    const display = document.getElementById('patient-result-display');
    if (!age || !day || !month) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
        return;
    }

    // --- วิธีที่ ๑: (อายุ + 12) * 4 / 5 ---
    const step1 = (age + 12) * 4;
    const remain1_raw = step1 % 5;
    const remain1 = remain1_raw === 0 ? 5 : remain1_raw; // ในทางโหราศาสตร์ไม่มีเศษ 0 หารลงตัวนับเป็นเศษ ๕
    let res1 = "";
    if ([1, 3, 5].includes(remain1)) {
        res1 = `<span style="color:red; font-weight:600;">เศษ ${remain1} : ทายว่าตาย (หรืออาการหนักรักษายากตามตำรา)</span>`;
    } else {
        res1 = `<span style="color:green; font-weight:600;">เศษ ${remain1} : ทายว่ามิตาย (จะหายเป็นปกติ)</span>`;
    }

    // --- วิธีที่ ๒: (อายุ + วัน + เดือน) * 3 / 7 ---
    // บาปเคราะห์ (๑, ๓, ๗, ๘) | ศุภเคราะห์ (๒, ๔, ๕, ๖)
    const step2 = (age + day + month) * 3;
    const remain2_raw = step2 % 7;
    const remain2 = remain2_raw === 0 ? 7 : remain2_raw; // 0 ในทางเศษคือเศษ ๗ (เสาร์) หรือราหู (๘)
    let res2 = "";
    const malefic = [1, 3, 7]; // ๑ (อาทิตย์), ๓ (อังคาร), ๗ (เสาร์/ราหู)
    const planetNames = { 1: "๑-ดาวอาทิตย์", 2: "๒-ดาวจันทร์", 3: "๓-ดาวอังคาร", 4: "๔-ดาวพุธ", 5: "๕-ดาวพฤหัสบดี", 6: "๖-ดาวศุกร์", 7: "๗-ดาวเสาร์/ราหู" };
    const pName2 = planetNames[remain2] || remain2;
    if (malefic.includes(remain2)) {
        res2 = `<span style="color:red; font-weight:600;">เศษ ${remain2} (ตกบาปเคราะห์ ${pName2}) : จะต้องตายในเดือนนั้น วันนั้น เวลานั้น (หรือมีเกณฑ์วิกฤตอันตรายยิ่ง)</span>`;
    } else {
        res2 = `<span style="color:green; font-weight:600;">เศษ ${remain2} (ตกศุภเคราะห์ ${pName2}) : ทายว่ามิตาย จะหายจากโรคภัย</span>`;
    }

    // --- วิธีที่ ๓: (อายุ + 7) * 3 / 7 ---
    const step3 = (age + 7) * 3;
    const remain3_raw = step3 % 7;
    const remain3 = remain3_raw === 0 ? 7 : remain3_raw;
    let res3 = "";
    if (remain3 === 7) {
        res3 = `<span style="color:red; font-weight:600;">เศษ ๗ (๐) : ชะตาขาดสามเส้น ทายว่าตาย หรืออยู่ในเกณฑ์อันตรายสูงสุด</span>`;
    } else if ([1, 3].includes(remain3)) {
        res3 = `<span style="color:#e67e22; font-weight:600;">เศษ ${remain3} : ถ้าไม่ตาย ก็จะหายช้าที่สุดและได้รับความลำบากมาก</span>`;
    } else {
        res3 = `<span style="color:green; font-weight:600;">เศษ ${remain3} : ไม่ตายเป็นอันขาด ในระหว่างที่ป่วยอยู่นั้น</span>`;
    }

    // แสดงผล
    document.getElementById('method1-result').innerHTML = res1;
    document.getElementById('method2-result').innerHTML = res2;
    document.getElementById('method3-result').innerHTML = res3;
    display.style.display = "block";
}