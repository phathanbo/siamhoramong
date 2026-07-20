async function checkToken() {
    const token = 'EAAOTsrElGicBR02y4Ft2j3ht73noUKrjBwZCnJdlYPmRo1Ky5RtnLOwZAGbBkcUPyMgbzZC2MyZBzfrx9jMfmejeYcDxChO9SSpMmI6C2GM1avJ32WlZCadqSwkAF69IIST5RMZC9ZAuAu182ZCeGvSDsa92K7DhRMKEqWx4ZBc2WNUBC7JHx3ZB7kyfalCoU64dZC4bo7DBiYZCOfU9QwjRtf5E0o4DGdXSGiZB6PKwEKBCROkXFnDON7vsZALrIvC8bjo5MAhRwwtg5TgR3YopyibOwL3r1f1iadfCZBGDQZDZD';
    
    // Check /me
    const res1 = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
    const data1 = await res1.json();
    console.log('--- /me ---');
    console.log(data1);

    // Check /me/accounts (if it's a user token, this will list their pages)
    const res2 = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
    const data2 = await res2.json();
    console.log('--- /me/accounts ---');
    if (data2.data) {
        data2.data.forEach(page => {
            console.log(`Page Name: ${page.name}, Page ID: ${page.id}, Token: ${page.access_token.substring(0, 20)}...`);
        });
    } else {
        console.log(data2);
    }
}
checkToken();
