async function checkToken() {
    const token = 'EAAOTsrElGicBR3JElaPf1vfLqzy250wpVlzJtA5utyXBZChdQnecQB9vvrLG9maG7SPZCOilM0xXWbYez8GDknFVnLXccTCXBENZBbGr80uZBbDGuZCPuNiHsfAS6Mb3qlRzmw15BzFsRE0ZAZCGdqkpgqLdaOBqQRBA6iZCZBamj3yAH0pKgZCG66e7C7kkiyMVHOiGdNUfCg8oOtqoIRcIxLUKlR9E4spLf1UtAb1TctYlQTZBEoypFQQn0UZD';
    
    // Check /me
    const res1 = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
    const data1 = await res1.json();
    console.log("--- /me ---");
    console.log(JSON.stringify(data1, null, 2));

    // Check permissions
    const res2 = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token}`);
    const data2 = await res2.json();
    console.log("--- permissions ---");
    console.log(JSON.stringify(data2, null, 2));
}
checkToken();
