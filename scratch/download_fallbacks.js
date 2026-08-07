const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../assets/images/promchart');

const downloads = [
    {
        name: 'silver_parasol.jpg',
        url: 'https://images.unsplash.com/photo-1590736969955-71cb94801750?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'decapitated.jpg',
        url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'royal_house.jpg',
        url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'gold_parasol.jpg',
        url: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'deity_turtle.jpg',
        url: 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'prison.jpg',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'sorcerer.jpg',
        url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'witch.jpg',
        url: 'https://images.unsplash.com/photo-1515598911986-041477aa68ad?auto=format&fit=crop&w=600&q=80'
    }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const item of downloads) {
        const dest = path.join(dir, item.name);
        if (!fs.existsSync(dest)) {
            console.log(`Downloading ${item.name}...`);
            try {
                await downloadFile(item.url, dest);
                console.log(`Saved ${item.name}`);
            } catch (err) {
                console.error(`Error downloading ${item.name}:`, err.message);
                // copy a fallback image
                try {
                    fs.copyFileSync(path.join(__dirname, '../assets/images/mystic_thai_bg.jpg'), dest);
                    console.log(`Copied fallback background for ${item.name}`);
                } catch (e) {
                    console.error("Fallback copy failed:", e);
                }
            }
        } else {
            console.log(`${item.name} already exists.`);
        }
    }
    console.log("All done!");
}

run();
