async function testPost() {
    const token = 'EAAPQJPDfSsABRyAgUewpq8xzH9MXjxtIKloyQZBiQBkA9paHihZBQsjxAjd1nLI7CzhFiESMhYcFGerg3I1BOYTcp2qORYP8zlGcYKAI5qJXFVvZBmjFjeiqfrDNBCQZB53b8rnZC6ZCaBSY4oCZAvsz79mTnKnPfNhYnk9555ek9nuEDC6KpTKwfkUPZCUZArcV8hQRBlAVVZAhvXDThc8WpxNwx0';
    const pageId = '1250949584762943';
    
    const formData = new FormData();
    formData.append('message', 'ทดสอบระบบอัตโนมัติจากเซิร์ฟเวอร์ด้วย Token ใหม่');
    formData.append('access_token', token);

    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
testPost();
