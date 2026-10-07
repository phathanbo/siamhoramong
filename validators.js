function validatePrompt(prompt) {
    if (typeof prompt !== "string") {
        return { valid: false, error: "กรุณาระบุ prompt เป็นข้อความ" };
    }

    const trimmed = prompt.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: "กรุณาระบุ prompt" };
    }

    if (trimmed.length > 4000) {
        return { valid: false, error: "Prompt ยาวเกินไป (สูงสุด 4000 ตัวอักษร)" };
    }

    if (/<script|<iframe|javascript:|onerror=/i.test(trimmed)) {
        return { valid: false, error: "Prompt contains invalid characters" };
    }

    return { valid: true, value: trimmed };
}

function validateBase64Image(image) {
    if (!image || typeof image !== "string") {
        return { valid: false, error: "กรุณาส่งข้อมูลรูปภาพ (image)" };
    }

    const match = image.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.*)$/);
    if (!match) {
        return { valid: false, error: "รูปแบบรูปภาพไม่ถูกต้อง ต้องเป็น data URL" };
    }

    const [, mimeType, base64Data] = match;
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length === 0 || buffer.length > 50 * 1024 * 1024) {
        return { valid: false, error: "ขนาดรูปภาพต้องอยู่ระหว่าง 1 byte ถึง 50 MB" };
    }

    return { valid: true, buffer, mimeType };
}

function validateImageArray(images) {
    if (!Array.isArray(images) || images.length === 0) {
        return { valid: false, error: "กรุณาส่งข้อมูลรูปภาพ (images array)" };
    }

    const results = [];
    for (let i = 0; i < images.length; i++) {
        const validation = validateBase64Image(images[i]);
        if (!validation.valid) {
            return { valid: false, error: `รูปภาพที่ ${i + 1}: ${validation.error}` };
        }
        results.push(validation.buffer);
    }

    return { valid: true, buffers: results };
}

module.exports = {
    validatePrompt,
    validateBase64Image,
    validateImageArray,
};
