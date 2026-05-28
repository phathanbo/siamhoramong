function calculatePatientFate() {
    const age = parseInt(document.getElementById('patientAge').value);
    const day = parseInt(document.getElementById('birthDayNum').value);
    const month = parseInt(document.getElementById('birthMonthNum').value);
    
    const display = document.getElementById('patient-result-display');
    if (!age || !day || !month) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    // --- วิธีที่ ๑: (อายุ + 12) * 4 / 5 ---
    const step1 = (age + 12) * 4;
    const remain1 = step1 % 5;
    let res1 = "";
    if ([1, 3, 0].includes(remain1)) {
        res1 = `<span style="color:red">เศษ ${remain1} : ทายว่าตาย</span>`;
    } else {
        res1 = `<span style="color:green">เศษ ${remain1} : ทายว่ามิตาย</span>`;
    }

    // --- วิธีที่ ๒: (อายุ + วัน + เดือน) * 3 / 7 ---
    // บาปเคราะห์ (๑, ๓, ๗, ๘) | ศุภเคราะห์ (๒, ๔, ๕, ๖)
    const step2 = (age + day + month) * 3;
    const remain2 = step2 % 7;
    let res2 = "";
    const malefic = [1, 3, 0, 7]; // 0 ถือเป็นเสาร์(๗) หรือราหู(๘) ในทางเศษ
    if (malefic.includes(remain2)) {
        res2 = `<span style="color:red">เศษ ${remain2} (บาปเคราะห์) : จะต้องตายในเดือนนั้น วันนั้น เวลานั้น</span>`;
    } else {
        res2 = `<span style="color:green">เศษ ${remain2} (ศุภเคราะห์) : มิตาย</span>`;
    }

    // --- วิธีที่ ๓: (อายุ + 7) * 3 / 7 ---
    const step3 = (age + 7) * 3;
    const remain3 = step3 % 7;
    let res3 = "";
    if (remain3 === 0) {
        res3 = `<span style="color:red">เศษ ๐ : ชะตาขาดสามเส้น ทายว่าตาย</span>`;
    } else if ([1, 3, 7].includes(remain3)) {
        res3 = `<span style="color:orange">เศษ ${remain3} : ถ้าไม่ตาย ก็จะหายช้าที่สุดและได้รับความลำบากมาก</span>`;
    } else {
        res3 = `<span style="color:green">เศษ ${remain3} : ไม่ตายเป็นอันขาด ในระหว่างที่ป่วยอยู่นั้น</span>`;
    }

    // แสดงผล
    document.getElementById('method1-result').innerHTML = res1;
    document.getElementById('method2-result').innerHTML = res2;
    document.getElementById('method3-result').innerHTML = res3;
    display.style.display = "block";
}