const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));

// จำกัด CORS เฉพาะ origin ที่อนุญาต
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
];
app.use(cors({
    origin: function (origin, callback) {
        // อนุญาต request ที่ไม่มี origin (เช่น curl หรือ Postman ใน dev)
        // หรือ origin ที่อยู่ใน allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: origin not allowed"));
        }
    }
}));

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
        const { image, message } = req.body;
        
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

        const formData = new FormData();
        formData.append("source", blob, "post.png");
        if (message) {
            formData.append("message", message);
        }
        formData.append("access_token", accessToken);

        const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Facebook API Error:", data.error);
            return res.status(500).json({ error: "Facebook API Error: " + data.error.message });
        }

        res.json({ success: true, id: data.id, post_id: data.post_id });
    } catch (error) {
        console.error("Facebook API Exception:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
