const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const FormData = require("form-data");
const dotenv = require("dotenv");
const { validatePrompt, validateBase64Image, validateImageArray } = require("./validators");

dotenv.config();

const app = express();
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json({ limit: "50mb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://phathanbo.github.io").split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.static("./"));

const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - RATE_WINDOW_MS;
    const timestamps = (rateLimitMap.get(ip) || []).filter((t) => t > windowStart);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return timestamps.length > RATE_LIMIT;
}

setInterval(() => {
    const cutoff = Date.now() - RATE_WINDOW_MS;
    for (const [ip, timestamps] of rateLimitMap) {
        const fresh = timestamps.filter((t) => t > cutoff);
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
        const validation = validatePrompt(req.body?.prompt);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

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
                messages: [{ role: "user", content: validation.value }],
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || `API returned ${response.status}`);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error("API Error:", error);

        if (error.name === "AbortError") {
            return res.status(504).json({ error: "Request timeout" });
        }

        return res.status(500).json({
            error: "Failed to fetch horoscope",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

app.post("/api/facebook-post", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests — กรุณารอสักครู่แล้วลองใหม่" });
    }

    try {
        const { image, message, scheduledPublishTime, place } = req.body;
        const imageValidation = validateBase64Image(image);

        if (!imageValidation.valid) {
            return res.status(400).json({ error: imageValidation.error });
        }

        const pageId = process.env.FB_PAGE_ID;
        const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

        if (!pageId || !accessToken) {
            return res.status(500).json({ error: "กรุณาตั้งค่า FB_PAGE_ID และ FB_PAGE_ACCESS_TOKEN ในไฟล์ .env" });
        }

        const formData = new FormData();
        formData.append("source", imageValidation.buffer, "post.png");
        formData.append("published", "false");
        formData.append("access_token", accessToken);

        const photoResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        });

        const photoData = await photoResponse.json();
        if (photoData.error) {
            console.error("Facebook API Error (Photo):", photoData.error);
            return res.status(500).json({ error: "Facebook API Error (Photo): " + photoData.error.message });
        }

        const feedPayload = {
            access_token: accessToken,
            attached_media: [{ media_fbid: photoData.id }],
        };

        if (message) feedPayload.message = message;
        if (scheduledPublishTime) {
            feedPayload.published = false;
            feedPayload.scheduled_publish_time = scheduledPublishTime;
        }
        if (place) feedPayload.place = place;

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

        return res.json({ success: true, id: feedData.id, post_id: feedData.id });
    } catch (error) {
        console.error("Facebook API Exception:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/facebook-post-multi", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;

    if (checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests — กรุณารอสักครู่แล้วลองใหม่" });
    }

    try {
        const { images, message, scheduledPublishTime, place } = req.body;
        const imageValidation = validateImageArray(images);

        if (!imageValidation.valid) {
            return res.status(400).json({ error: imageValidation.error });
        }

        const pageId = process.env.FB_PAGE_ID;
        const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

        if (!pageId || !accessToken) {
            return res.status(500).json({ error: "กรุณาตั้งค่า FB_PAGE_ID และ FB_PAGE_ACCESS_TOKEN ในไฟล์ .env" });
        }

        const uploadedPhotoIds = [];

        for (let i = 0; i < imageValidation.buffers.length; i++) {
            const buffer = imageValidation.buffers[i];
            const formData = new FormData();
            formData.append("source", buffer, `photo${i}.png`);
            formData.append("published", "false");
            formData.append("access_token", accessToken);

            const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
                method: "POST",
                body: formData,
                headers: formData.getHeaders(),
            });

            const data = await response.json();
            if (data.error) {
                console.error("Facebook API Error on Photo Upload:", data.error);
                return res.status(500).json({ error: "Facebook API Error on Photo Upload: " + data.error.message });
            }

            uploadedPhotoIds.push(data.id);
        }

        const attachedMedia = uploadedPhotoIds.map((id) => ({ media_fbid: id }));

        const feedPayload = {
            access_token: accessToken,
            attached_media: attachedMedia,
        };

        if (message) feedPayload.message = message;
        if (scheduledPublishTime) {
            feedPayload.published = false;
            feedPayload.scheduled_publish_time = scheduledPublishTime;
        }
        if (place) feedPayload.place = place;

        const feedResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedPayload),
        });

        const feedData = await feedResponse.json();
        if (feedData.error) {
            console.error("Facebook API Error on Feed Post:", feedData.error);
            return res.status(500).json({ error: "Facebook API Error on Feed Post: " + feedData.error.message });
        }

        return res.json({ success: true, id: feedData.id });
    } catch (error) {
        console.error("Facebook API Exception:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
