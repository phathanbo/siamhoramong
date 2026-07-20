const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));

// อนุญาต CORS ทั้งหมดเพื่อแก้ปัญหาการเชื่อมต่อ
app.use(cors());

app.use(express.static("./"));

// Rate limiter แบบ in-memory (20 requests ต่อ minute ต่อ IP)
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - RATE_WINDOW_MS;
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => t > windowStart);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return timestamps.length > RATE_LIMIT;
}

// ล้าง map ทุก 5 นาทีเพื่อไม่ให้ memory leak
setInterval(() => {
    const cutoff = Date.now() - RATE_WINDOW_MS;
    for (const [ip, timestamps] of rateLimitMap) {
        const fresh = timestamps.filter(t => t > cutoff);
        if (fresh.length === 0) rateLimitMap.delete(ip);
        else rateLimitMap.set(ip, fresh);
    }
}, 5 * 60 * 1000);

app.post("/api/horoscope", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests — กรุณารอสักครู่แล้วลองใหม่" });
    }

    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return res.status(400).json({ error: "กรุณาระบุ prompt" });
        }

        if (prompt.length > 4000) {
            return res.status(400).json({ error: "Prompt ยาวเกินไป (สูงสุด 4000 ตัวอักษร)" });
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{ role: "user", content: prompt }],
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to fetch horoscope" });
    }
});

app.post("/api/facebook-post", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests — กรุณารอสักครู่แล้วลองใหม่" });
    }

    try {
        const { image, message, scheduledPublishTime, place } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: "กรุณาส่งข้อมูลรูปภาพ (image)" });
        }

        const pageId = process.env.FB_PAGE_ID;
        const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

        if (!pageId || !accessToken) {
            return res.status(500).json({ error: "กรุณาตั้งค่า FB_PAGE_ID และ FB_PAGE_ACCESS_TOKEN ในไฟล์ .env" });
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const blob = new Blob([buffer], { type: "image/png" });

        // Step 1: Upload photo as unpublished
        const formData = new FormData();
        formData.append("source", blob, "post.png");
        formData.append("published", "false");
        formData.append("access_token", accessToken);

        const photoResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: "POST",
            body: formData,
        });

        const photoData = await photoResponse.json();
        
        if (photoData.error) {
            console.error("Facebook API Error (Photo):", photoData.error);
            return res.status(500).json({ error: "Facebook API Error (Photo): " + photoData.error.message });
        }

        // Step 2: Post to feed
        const feedPayload = {
            access_token: accessToken,
            attached_media: [{ media_fbid: photoData.id }]
        };
        if (message) {
            feedPayload.message = message;
        }
        if (scheduledPublishTime) {
            feedPayload.published = false;
            feedPayload.scheduled_publish_time = scheduledPublishTime;
        }
        if (place) {
            feedPayload.place = place;
        }

        const feedResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedPayload),
        });

        const feedData = await feedResponse.json();

        if (feedData.error) {
            console.error("Facebook API Error (Feed):", feedData.error);
            return res.status(500).json({ error: "Facebook API Error (Feed): " + feedData.error.message });
        }

        res.json({ success: true, id: feedData.id, post_id: feedData.id });
    } catch (error) {
        console.error("Facebook API Exception:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/facebook-post-multi", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests — กรุณารอสักครู่แล้วลองใหม่" });
    }

    try {
        const { images, message, scheduledPublishTime, place } = req.body;
        
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: "กรุณาส่งข้อมูลรูปภาพ (images array)" });
        }

        const pageId = process.env.FB_PAGE_ID;
        const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

        if (!pageId || !accessToken) {
            return res.status(500).json({ error: "กรุณาตั้งค่า FB_PAGE_ID และ FB_PAGE_ACCESS_TOKEN ในไฟล์ .env" });
        }

        const uploadedPhotoIds = [];

        // Upload all images as unpublished photos
        for (let i = 0; i < images.length; i++) {
            const base64Data = images[i].replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const blob = new Blob([buffer], { type: "image/png" });

            const formData = new FormData();
            formData.append("source", blob, `photo${i}.png`);
            formData.append("published", "false");
            formData.append("access_token", accessToken);

            const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.error) {
                console.error("Facebook API Error on Photo Upload:", data.error);
                return res.status(500).json({ error: "Facebook API Error on Photo Upload: " + data.error.message });
            }
            uploadedPhotoIds.push(data.id);
        }

        // Post to feed with attached media
        const attachedMedia = uploadedPhotoIds.map(id => ({ media_fbid: id }));
        
        const feedPayload = {
            access_token: accessToken,
            attached_media: attachedMedia
        };
        if (message) {
            feedPayload.message = message;
        }
        if (scheduledPublishTime) {
            feedPayload.published = false;
            feedPayload.scheduled_publish_time = scheduledPublishTime;
        }
        if (place) {
            feedPayload.place = place;
        }

        const feedResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedPayload)
        });

        const feedData = await feedResponse.json();
        
        if (feedData.error) {
            console.error("Facebook API Error on Feed Post:", feedData.error);
            return res.status(500).json({ error: "Facebook API Error on Feed Post: " + feedData.error.message });
        }

        res.json({ success: true, id: feedData.id });
    } catch (error) {
        console.error("Facebook API Exception:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
