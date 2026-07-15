/**
 * Helper functions for Canvas 2D API rendering
 */

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle = null, strokeStyle = null, shadow = null) {
    ctx.save();
    
    if (shadow) {
        ctx.shadowColor = shadow.color || 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = shadow.blur || 10;
        ctx.shadowOffsetX = shadow.offsetX || 0;
        ctx.shadowOffsetY = shadow.offsetY || 0;
    }

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    
    ctx.shadowColor = 'transparent'; // Reset shadow for stroke
    
    if (strokeStyle) {
        ctx.lineWidth = strokeStyle.width || 1;
        ctx.strokeStyle = strokeStyle.color || strokeStyle;
        ctx.stroke();
    }
    
    ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        // Handle explicit newlines
        const parts = words[n].split('\n');
        for (let p = 0; p < parts.length; p++) {
            const testLine = line + parts[p] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0 && p === 0) {
                ctx.fillText(line, x, currentY);
                line = parts[p] + ' ';
                currentY += lineHeight;
                lineCount++;
            } else if (p > 0) {
                ctx.fillText(line, x, currentY);
                line = parts[p] + ' ';
                currentY += lineHeight;
                lineCount++;
            } else {
                line = testLine;
            }
        }
    }
    ctx.fillText(line, x, currentY);
    return lineCount + 1; // Return number of lines drawn
}

function loadSVGAsImage(svgString, width, height) {
    return new Promise((resolve, reject) => {
        // Ensure SVG has proper namespace and dimensions if missing
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (width && height && !svgString.includes('width=') && !svgString.includes('height=')) {
            svgString = svgString.replace('<svg', `<svg width="${width}" height="${height}"`);
        }

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            resolve(img);
            URL.revokeObjectURL(url);
        };
        img.onerror = (e) => {
            console.error("Error loading SVG", e);
            reject(e);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
}

function drawStrokedText(ctx, text, x, y, fillStyle, strokeStyle, lineWidth) {
    ctx.font = ctx.font; // retain font
    ctx.textAlign = ctx.textAlign;
    ctx.textBaseline = ctx.textBaseline;
    
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth || 2;
        ctx.strokeText(text, x, y);
    }
    
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fillText(text, x, y);
    }
}
