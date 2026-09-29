const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// تحميل الخطوط
try {
    registerFont(path.join(__dirname, '../Alexandria.ttf'), { family: 'Alexandria' });
    registerFont(path.join(__dirname, '../Tajawal.ttf'), { family: 'Tajawal' });
    registerFont(path.join(__dirname, '../Cairo.ttf'), { family: 'Cairo' }); 
} catch (e) {
    console.log('⚠️ تأكد من وجود ملفات الخطوط.');
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor; ctx.fill();
}

function drawBookmark(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y);
    ctx.lineTo(x + 20, y + 28);
    ctx.lineTo(x + 10, y + 20);
    ctx.lineTo(x, y + 28);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function cleanArabicText(text) {
    return text ? text.replace(/\*/g, '').replace(/\.$/, '').trim() : '';
}

function getLinesCount(ctx, text, maxWidth) {
    if (!text) return 0;
    const words = text.split(' ');
    let line = '';
    let count = 1;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            count++;
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    return count;
}

function wrapTextDynamic(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight; 
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight; 
}

async function stampStoryDesign(slideData, totalSlides, uploadedImagePath, batchId) {
    const baseImage = await loadImage(uploadedImagePath);
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const scale = Math.max(width / baseImage.width, height / baseImage.height);
    const x = (width / 2) - (baseImage.width / 2) * scale;
    const y = (height / 2) - (baseImage.height / 2) * scale;
    ctx.drawImage(baseImage, x, y, baseImage.width * scale, baseImage.height * scale);

    const topGradient = ctx.createLinearGradient(0, 0, 0, 200);
    topGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)'); 
    topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');   
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, 200);

    const bottomGradient = ctx.createLinearGradient(0, height * 0.35, 0, height);
    bottomGradient.addColorStop(0, 'rgba(5, 7, 10, 0)');
    bottomGradient.addColorStop(0.35, 'rgba(5, 7, 10, 0.85)');
    bottomGradient.addColorStop(1, 'rgba(5, 7, 10, 1)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, 0, width, height);

    const topY = 80;

    drawBookmark(ctx, 45, topY - 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.direction = 'ltr';
    ctx.font = 'bold 26px "Alexandria", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", 85, topY - 8);

    ctx.textAlign = 'right';
    ctx.font = 'bold 36px "Alexandria", sans-serif';
    const slideNumStr = slideData.slideNumber < 10 ? `0${slideData.slideNumber}` : slideData.slideNumber;
    ctx.fillText(slideNumStr, width - 45, topY - 8);

    const dotSpacing = 22;
    const dotsWidth = (totalSlides - 1) * dotSpacing;
    const startX = (width - dotsWidth) / 2;
    for(let i=0; i<totalSlides; i++) {
        ctx.beginPath();
        ctx.arc(startX + (i * dotSpacing), topY - 8, 6, 0, Math.PI * 2);
        ctx.fillStyle = (i + 1 === slideData.slideNumber) ? '#10B981' : 'rgba(255,255,255,0.3)';
        ctx.fill();
    }

    const centerX = width / 2;
    const footerY = height - 150; 
    ctx.direction = 'rtl'; 

    const cleanTitle = cleanArabicText(slideData.title);
    const rawTextForCalc = cleanArabicText(slideData.text);
    
    const isCTA = rawTextForCalc.includes('علق') || rawTextForCalc.includes('احفظ') || rawTextForCalc.includes('تابعني');

    ctx.font = '900 100px "Alexandria", sans-serif';
    const titleLines = getLinesCount(ctx, cleanTitle, width * 0.9);

    ctx.font = isCTA ? 'bold 46px "Cairo", sans-serif' : '600 42px "Cairo", sans-serif';
    const textLines = getLinesCount(ctx, rawTextForCalc, width * 0.85);

    const pillHeightSpace = slideData.mainTopicTitle ? 95 : 0; 
    const titleHeightSpace = titleLines * 125; 
    const gapBetween = 45; 
    const textHeightSpace = textLines * 65; 

    const totalTextHeight = pillHeightSpace + titleHeightSpace + gapBetween + textHeightSpace;

    let currentY = footerY - totalTextHeight - 40;

    if (slideData.mainTopicTitle) {
        ctx.font = 'bold 28px "Tajawal", sans-serif';
        const topicWidth = ctx.measureText(slideData.mainTopicTitle).width + 80;

        drawRoundedRect(ctx, centerX - topicWidth/2, currentY - 35, topicWidth, 60, 30, 'rgba(16, 185, 129, 0.15)');
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2.5; ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.textAlign = 'center';
        ctx.fillText(slideData.mainTopicTitle, centerX, currentY + 5); 
        currentY += 100; 
    } else {
        currentY += 20;
    }

    // رسم العنوان الرئيسي ككتلة واحدة آمنة باللون الأبيض
    ctx.font = '900 100px "Alexandria", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 20;
    currentY = wrapTextDynamic(ctx, cleanTitle, centerX, currentY, width * 0.9, 125);
    ctx.shadowBlur = 0;

    currentY += gapBetween; 

    // رسم النص التوضيحي
    if (isCTA || slideData.slideNumber === totalSlides) {
        ctx.font = 'bold 46px "Cairo", sans-serif';
        ctx.fillStyle = '#FBBF24'; 
        ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
        ctx.shadowBlur = 15;
    } else {
        ctx.font = '600 42px "Cairo", sans-serif';
        ctx.fillStyle = '#E2E8F0'; 
        ctx.shadowBlur = 0;
    }

    wrapTextDynamic(ctx, rawTextForCalc, centerX, currentY, width * 0.85, 65);
    ctx.shadowBlur = 0;

    ctx.direction = 'ltr'; 

    try {
        const profileImg = await loadImage(path.resolve(process.cwd(), 'profile.png'));
        const avatarSize = 90;

        ctx.save();
        ctx.beginPath();
        ctx.arc(45 + avatarSize/2, footerY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const s = Math.min(profileImg.width, profileImg.height);
        const sx = (profileImg.width - s) / 2;
        const sy = (profileImg.height - s) / 2;
        ctx.drawImage(profileImg, sx, sy, s, s, 45, footerY, avatarSize, avatarSize);
        ctx.restore();
    } catch(e) {
        console.log('لم يتم العثور على صورة الهوية.');
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Alexandria", sans-serif';
    ctx.fillText("غربي محمد الشريف", 160, footerY + 40);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillText("خبير أتمتة واستشاري أعمال", 160, footerY + 80);

    ctx.textAlign = 'right';
    if (slideData.slideNumber < totalSlides) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px "Alexandria", sans-serif';
        ctx.fillText("NEXT ➔", width - 45, footerY + 60);
    } else {
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 32px "Alexandria", sans-serif';
        ctx.fillText("اقرأ الوصف 👇", width - 45, footerY + 60);
    }

    const fileName = `pro_story_${batchId}_slide_${slideData.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = stampStoryDesign;