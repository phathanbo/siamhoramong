const fs = require('fs');
let js = fs.readFileSync('adminAutoPost.js', 'utf-8');

const oldLogic = `      if (card.img) {
          const cImg = new Image(); cImg.src = card.img; cImg.crossOrigin = "Anonymous";
          await new Promise(r => { cImg.onload=r; cImg.onerror=r; });
          ctx.save(); ctx.beginPath(); ctx.roundRect(435, 250, 210, 350, 15); ctx.clip();
          ctx.drawImage(cImg, 435, 250, 210, 350); ctx.restore();
          ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(435, 250, 210, 350);
      }
      
      ctx.fillStyle = '#fff'; ctx.font = 'bold 52px "Sarabun"';
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
      ctx.fillText(card.name, 540, 660); ctx.shadowBlur = 0;
      
      // Dynamic text scaling
      const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
      let fontSize = 32;
      let lineH = 45;
      let startY = 720;
      
      if (combinedLength > 150) {
          fontSize = 28;
          lineH = 40;
      }
      if (combinedLength > 250) {
          fontSize = 24;
          lineH = 34;
      }
      if (combinedLength > 350) {
          fontSize = 22;
          lineH = 32;
      }`;

const newLogic = `      // Dynamic text scaling and positioning
      const combinedLength = card.meaning.length + (card.future ? card.future.length : 0);
      let fontSize = 32;
      let lineH = 45;
      let startY = 720;
      let imgY = 250;
      let titleY = 660;
      
      if (combinedLength > 150) {
          fontSize = 28;
          lineH = 40;
      }
      if (combinedLength > 250) {
          fontSize = 24;
          lineH = 34;
          imgY = 220;
          titleY = 610;
          startY = 660;
      }
      if (combinedLength > 350) {
          fontSize = 21;
          lineH = 30;
          imgY = 215;
          titleY = 600;
          startY = 640;
      }

      if (card.img) {
          const cImg = new Image(); cImg.src = card.img; cImg.crossOrigin = "Anonymous";
          await new Promise(r => { cImg.onload=r; cImg.onerror=r; });
          ctx.save(); ctx.beginPath(); ctx.roundRect(435, imgY, 210, 350, 15); ctx.clip();
          ctx.drawImage(cImg, 435, imgY, 210, 350); ctx.restore();
          ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(435, imgY, 210, 350);
      }
      
      ctx.fillStyle = '#fff'; ctx.font = 'bold 52px "Sarabun"';
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
      ctx.fillText(card.name, 540, titleY); ctx.shadowBlur = 0;`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('adminAutoPost.js', js, 'utf-8');
console.log('Fixed overlapping logic');
