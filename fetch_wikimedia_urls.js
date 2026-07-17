const https = require('https');
const fs = require('fs');
const suits = ['Wands', 'Cups', 'Swords', 'Pents'];
const files = [];
for (let s of suits) {
  for (let i = 1; i <= 14; i++) {
    let num = i.toString().padStart(2, '0');
    files.push('File:' + s + num + '.jpg');
  }
}

// Wikimedia API allows batching up to 50 titles per request.
const batch1 = files.slice(0, 50).join('|');
const batch2 = files.slice(50).join('|');

function fetchBatch(titles) {
  return new Promise((resolve) => {
    let url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(titles) + '&prop=imageinfo&iiprop=url&format=json';
    https.get(url, { headers: { 'User-Agent': 'TarotAppBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function run() {
  const d1 = await fetchBatch(batch1);
  const d2 = await fetchBatch(batch2);
  const pages = { ...d1.query.pages, ...d2.query.pages };
  let map = {};
  for (let p in pages) {
    if (pages[p].imageinfo && pages[p].imageinfo[0]) {
      let title = pages[p].title.replace('File:', '');
      map[title] = pages[p].imageinfo[0].url;
    }
  }
  fs.writeFileSync('wikimedia_urls.json', JSON.stringify(map, null, 2));
  console.log('wikimedia_urls.json created');
}
run();
