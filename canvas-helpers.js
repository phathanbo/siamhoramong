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
    let words = [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
        words = Array.from(segmenter.segment(text)).map(s => s.segment);
    } else {
        words = text.split(' ');
    }

    let line = '';
    let currentY = y;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        const parts = words[n].split('\n');
        for (let p = 0; p < parts.length; p++) {
            const testLine = line + parts[p];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && line !== '') {
                ctx.fillText(line, x, currentY);
                line = parts[p];
                currentY += lineHeight;
                lineCount++;
            } else if (p > 0) {
                ctx.fillText(line, x, currentY);
                line = parts[p];
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

// ------------------------------------------------------------------
// Native DOM-to-Canvas Engine for replacing html2canvas
// ------------------------------------------------------------------
async function renderElementToCanvas(elementId, options = {}) {
    await document.fonts.ready;
    const root = document.getElementById(elementId);
    if (!root) throw new Error("Element not found: " + elementId);

    const canvasWidth = options.width || 1080;
    // We create a very tall canvas and crop it later
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = 8000;
    const ctx = tempCanvas.getContext('2d');

    const bgColor = options.backgroundColor || '#0d0a1a';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    let currentY = options.paddingTop || 40;
    const paddingX = options.paddingX || 40;
    const drawWidth = canvasWidth - (paddingX * 2);

    // Helper: convert rgb/rgba/hex to something ctx.fillStyle accepts
    function parseColor(colorStr, defaultColor) {
        if (!colorStr || colorStr === 'rgba(0, 0, 0, 0)' || colorStr === 'transparent') return defaultColor;
        return colorStr;
    }

    // Recursively draw nodes
    async function drawNode(node, x, y, inheritedColor) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (!text) return 0;
            
            const parent = node.parentElement;
            const style = window.getComputedStyle(parent);
            
            const fontSize = parseFloat(style.fontSize) || 30;
            const fontWeight = style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600 ? 'bold' : 'normal';
            let fontFamily = style.fontFamily || '"Sarabun", sans-serif';
            fontFamily = fontFamily.replace(/"/g, '');
            ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
            
            ctx.fillStyle = parseColor(style.color, inheritedColor || '#ffffff');
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const lineHeight = fontSize * 1.5;
            const lines = wrapText(ctx, text, x, y, drawWidth - (x - paddingX), lineHeight);
            return lines * lineHeight;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const style = window.getComputedStyle(node);
            
            if (style.display === 'none' || node.classList.contains('hide-on-export')) return 0;

            let heightAdded = 0;
            
            if (tag === 'br') {
                return parseFloat(style.fontSize || 30) * 1.5;
            }

            // Margin Top
            const mt = parseFloat(style.marginTop) || 0;
            let childY = y + mt;

            // Background color of the block
            const bgColor = parseColor(style.backgroundColor, null);
            let startY = childY; // for background fill later

            if (tag === 'img') {
                try {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = node.src;
                    await new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                    
                    const availableW = drawWidth - (x - paddingX);
                    const imgW = Math.min(img.width, availableW);
                    const ratio = imgW / img.width;
                    const imgH = img.height * ratio;
                    
                    // center image
                    const imgX = x + (availableW - imgW) / 2;
                    ctx.drawImage(img, imgX, childY, imgW, imgH);
                    childY += imgH;
                } catch(e) {}
            } else if (tag === 'canvas') {
                const availableW = drawWidth - (x - paddingX);
                const imgW = Math.min(node.width, availableW);
                const ratio = imgW / node.width;
                const imgH = node.height * ratio;
                const imgX = x + (availableW - imgW) / 2;
                ctx.drawImage(node, imgX, childY, imgW, imgH);
                childY += imgH;
            } else if (tag === 'table') {
                const rows = Array.from(node.querySelectorAll('tr'));
                rows.forEach((row) => {
                    const cells = Array.from(row.querySelectorAll('td, th'));
                    const rowHeight = 60; // Fixed row height for simplicity
                    const cellWidth = drawWidth / (cells.length || 1);
                    
                    cells.forEach((cell, cIdx) => {
                        const cellX = x + (cIdx * cellWidth);
                        
                        // draw cell border
                        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(cellX, childY, cellWidth, rowHeight);
                        
                        // draw cell background if th
                        const cellBg = parseColor(window.getComputedStyle(cell).backgroundColor, null);
                        if (cell.tagName.toLowerCase() === 'th' || cellBg) {
                            ctx.fillStyle = cellBg || 'rgba(255,255,255,0.1)';
                            ctx.fillRect(cellX, childY, cellWidth, rowHeight);
                        }
                        
                        ctx.fillStyle = window.getComputedStyle(cell).color || '#ffffff';
                        const isTh = cell.tagName.toLowerCase() === 'th';
                        ctx.font = `${isTh ? 'bold' : 'normal'} 24px "Sarabun", sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        const text = cell.innerText.trim();
                        if (text) {
                            ctx.fillText(text, cellX + (cellWidth/2), childY + (rowHeight/2));
                        }
                    });
                    childY += rowHeight;
                });
            } else {
                // Generic block element
                let innerX = x + (parseFloat(style.paddingLeft) || 0);
                
                // If it's a flex container (like row), handle specially or just render block
                // For simplicity, we just flow block elements downwards. 
                // Inline elements (span, i, strong) within a p/div are parsed sequentially but 
                // our naive renderer treats them as separate blocks unless they are text nodes.
                // Since wrapText handles long text, we just pass the color down.
                
                let curColor = parseColor(style.color, inheritedColor);
                
                for (let child of Array.from(node.childNodes)) {
                    // For inline elements (span, i, strong, b, em) that have display: inline, 
                    // we ideally want them to flow. But since we just want a rough accurate canvas, 
                    // we'll stack text blocks. 
                    // To handle inline text correctly, we should ideally flatten text for blocks.
                    // However, we will just drawNode which treats text nodes as blocks.
                    const h = await drawNode(child, innerX, childY, curColor);
                    childY += h;
                }
            }

            // Draw background if any block element had one
            if (bgColor && tag !== 'table' && tag !== 'img' && tag !== 'canvas' && tag !== 'br') {
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, startY, drawWidth - (x - paddingX), childY - startY);
                ctx.globalCompositeOperation = "source-over";
            }

            const mb = parseFloat(style.marginBottom) || 0;
            childY += mb;
            
            // Add extra spacing for block elements
            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'li'].includes(tag)) {
                 childY += 15;
            }

            heightAdded = (childY - y);
            return heightAdded;
        }
        return 0;
    }

    currentY += await drawNode(root, paddingX, currentY, '#ffffff');
    currentY += (options.paddingBottom || 40);

    // Crop to actual height
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvasWidth;
    finalCanvas.height = currentY;
    const finalCtx = finalCanvas.getContext('2d');
    
    finalCtx.drawImage(tempCanvas, 0, 0, canvasWidth, currentY, 0, 0, canvasWidth, currentY);
    return finalCanvas;
}
