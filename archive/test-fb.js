// native fetch

async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/facebook-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', message: 'test' })
        });
        const text = await response.text();
        console.log('STATUS:', response.status);
        console.log('BODY:', text);
    } catch (err) {
        console.error('FETCH ERROR:', err);
    }
}
test();
