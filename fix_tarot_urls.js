const fs = require('fs');
const https = require('https');

const tarotFile = 'd:\\สยามโหรามงคล\\tarot-data.js';
let content = fs.readFileSync(tarotFile, 'utf8');

const regex = /https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/([A-Za-z0-9_.-]+)/g;
let match;
let urls = [];

while ((match = regex.exec(content)) !== null) {
    urls.push(match[0]);
}

urls = [...new Set(urls)];

async function getFinalUrl(url, maxRedirects = 5) {
    if (maxRedirects === 0) return url;
    
    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let nextUrl = res.headers.location;
                if (!nextUrl.startsWith('http')) {
                    nextUrl = 'https://commons.wikimedia.org' + nextUrl;
                }
                resolve(getFinalUrl(nextUrl, maxRedirects - 1));
            } else {
                resolve(url);
            }
        }).on('error', () => {
            resolve(url);
        });
    });
}

async function fixUrls() {
    let newContent = content;
    let count = 0;
    for (const url of urls) {
        process.stdout.write(`Resolving: ${url} ... `);
        const realUrl = await getFinalUrl(url);
        if (realUrl && realUrl !== url && realUrl.includes('upload.wikimedia.org')) {
            newContent = newContent.split(url).join(realUrl);
            console.log('OK -> ' + realUrl);
            count++;
        } else {
            console.log('FAILED or already OK');
        }
    }
    fs.writeFileSync(tarotFile, newContent, 'utf8');
    console.log(`Fixed ${count} URLs in tarot-data.js`);
}

fixUrls();
