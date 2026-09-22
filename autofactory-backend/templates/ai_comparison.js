const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        currentY += lineHeight;
    }
    return currentY;
}

// 🚀 الدالة الجديدة: رسم العنوان مع تلوين الكلمة الأخيرة (Highlighting)
function drawSmartTitleRTL(ctx, text, x, y, maxWidth, lineHeight, mainColor, highlightColor) {
    if (!text) return y;
    
    const words = text.trim().split(/\s+/);
    let lines = [];
    let currentLine = words[0];

    // تقسيم النص إلى أسطر حسب عرض الشاشة
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    ctx.save();
    ctx.textAlign = 'right'; 
    ctx.direction = 'rtl'; 
    
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineWidth = ctx.measureText(line).width;
        let startX = x + (lineWidth / 2); // التوسيط الهندسي

        // إذا كان هذا هو السطر الأخير، نلصق التلوين على الكلمة الأخيرة
        if (i === lines.length - 1) {
            const lineWords = line.split(' ');
            const lastWord = lineWords.pop();
            const restOfLine = lineWords.join(' ');

            if (restOfLine.length > 0) {
                ctx.fillStyle = mainColor;
                ctx.fillText(restOfLine + ' ', startX, currentY);
                
                // حساب المسافة لطباعة الكلمة الأخيرة الملونة
                const restWidth = ctx.measureText(restOfLine + ' ').width;
                ctx.fillStyle = highlightColor;
                ctx.fillText(lastWord, startX - restWidth, currentY);
            } else {
                ctx.fillStyle = highlightColor;
                ctx.fillText(lastWord, startX, currentY);
            }
        } else {
            ctx.fillStyle = mainColor;
            ctx.fillText(line, startX, currentY);
        }
        currentY += lineHeight;
    }
    ctx.restore();
    return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 15;
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
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function drawCheckmark(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 5, y + 20); ctx.lineTo(x + 30, y - 25);
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}

function drawCross(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y - 20); ctx.lineTo(x + 20, y + 20);
    ctx.moveTo(x + 20, y - 20); ctx.lineTo(x - 20, y + 20);
    ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
}

function drawArrowLeft(ctx, x, y) {
    ctx.beginPath(); 
    ctx.moveTo(x, y); 
    ctx.lineTo(x + 20, y - 12); 
    ctx.lineTo(x + 20, y - 4);
    ctx.lineTo(x + 50, y - 4); 
    ctx.lineTo(x + 50, y + 4); 
    ctx.lineTo(x + 20, y + 4);
    ctx.lineTo(x + 20, y + 12); 
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; 
    ctx.fill();
}

function drawCircuitLines(ctx, width, height) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 2;
    
    ctx.beginPath(); ctx.moveTo(0, height - 200); ctx.lineTo(150, height - 200); ctx.lineTo(250, height - 300); ctx.stroke();
    ctx.beginPath(); ctx.arc(150, height - 200, 5, 0, Math.PI*2); ctx.stroke();
    
    ctx.beginPath(); ctx.moveTo(0, height - 250); ctx.lineTo(100, height - 250); ctx.lineTo(200, height - 350); ctx.stroke();
    ctx.beginPath(); ctx.arc(100, height - 250, 5, 0, Math.PI*2); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(width - 200, 0); ctx.lineTo(width - 200, 150); ctx.lineTo(width - 300, 250); ctx.stroke();
    ctx.beginPath(); ctx.arc(width - 200, 150, 5, 0, Math.PI*2); ctx.stroke();
}

async function drawToolBox(ctx, x, y, size, toolName, toolDomain, isGood) {
    drawRoundedRect(ctx, x, y, size, size, 35, '#FFFFFF', true);
    
    ctx.strokeStyle = isGood ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    let logoLoaded = false;

    let finalDomain = toolDomain ? toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    try {
        const logoUrl = `https://logo.clearbit.com/${finalDomain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = 110;
        ctx.drawImage(logo, x + (size - logoSize) / 2, y + 40, logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = 90; 
            ctx.drawImage(logo, x + (size - logoSize) / 2, y + 50, logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    if (!logoLoaded) {
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 95, 55, 0, Math.PI * 2);
        ctx.fillStyle = isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.fill();

        ctx.font = '65px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isGood ? '#059669' : '#DC2626';
        ctx.fillText(firstLetter, x + size / 2, y + 100);
    }

    ctx.font = '26px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#0F172A';
    wrapText(ctx, toolName, x + size / 2, y + 210, size - 20, 35);
}

// 🚀 تمت إضافة globalTopic كمعامل أخير
async function drawAiComparisonSlide(slide, totalSlides, batchId, platform = 'instagram', globalTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);
    drawCircuitLines(ctx, width, height);

    ctx.direction = 'rtl';
    
    if (platform === 'instagram') {
        const dotSpacing = 45;
        const dotRadius = 12;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        ctx.lineWidth = 2;
        for(let i = 0; i < totalSlides; i++) {
            ctx.beginPath(); 
            // 🚀 تم رفع النقاط للأعلى لمنع التداخل مع العنوان
            ctx.arc(startCX + (i * dotSpacing), 35, dotRadius, 0, Math.PI*2); 
            
            if (i + 1 === slide.slideNumber) {
                ctx.fillStyle = '#0F766E';
                ctx.fill();
                ctx.strokeStyle = '#0F766E';
            } else {
                ctx.strokeStyle = '#CBD5E1';
            }
            ctx.stroke();
        }
    }

    // --------------------------------------------------
    // 1. مربع رقم الصفحة
    // --------------------------------------------------
    const snX = width - 130; 
    drawRoundedRect(ctx, snX, 40, 90, 80, 15, '#FFFFFF', true);
    ctx.strokeStyle = 'rgba(15, 118, 110, 0.2)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '45px "CairoBoldHack"';
    ctx.fillStyle = '#0F766E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${slide.slideNumber}`, snX + 45, 85);
    ctx.textBaseline = 'alphabetic';

    // --------------------------------------------------
    // 2. زر SAVE THE POST 
    // --------------------------------------------------
    ctx.save();
    const saveX = 50;
    const saveY = 80; 
    
    ctx.beginPath();
    ctx.moveTo(saveX, saveY - 14);
    ctx.lineTo(saveX + 18, saveY - 14);
    ctx.lineTo(saveX + 18, saveY + 16);
    ctx.lineTo(saveX + 9, saveY + 8);
    ctx.lineTo(saveX, saveY + 16);
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; 
    ctx.fill();

    ctx.direction = 'ltr'; 
    ctx.font = 'bold 22px "CairoBoldHack"';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", saveX + 30, saveY);
    ctx.restore();

    // --------------------------------------------------
    // 🚀 3. رسم العنوان العام للمنشور (باستثناء الشريحتين الأخيرتين)
    // --------------------------------------------------
    if (globalTopic && slide.slideNumber <= totalSlides - 1) {
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = '24px "CairoRegularHack"'; 
        ctx.fillStyle = '#94A3B8'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(globalTopic).width;
        const centerX = width / 2;
        const centerY = 95; // مناسب للابتعاد عن النقاط في إنستغرام
        
        ctx.fillText(globalTopic, centerX, centerY);
        
        ctx.strokeStyle = '#E2E8F0'; 
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(centerX - textWidth/2 - 25, centerY); ctx.lineTo(centerX - textWidth/2 - 10, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX + textWidth/2 + 10, centerY); ctx.lineTo(centerX + textWidth/2 + 25, centerY); ctx.stroke();
        ctx.restore();
    }

    // ==========================================
    // شريحة المقارنة
    // ==========================================
    if (slide.type === 'comparison') {
        ctx.font = '85px "CairoBoldHack"'; 
        
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; 
        ctx.shadowBlur = 10; 
        ctx.shadowOffsetY = 5;
        
        drawSmartTitleRTL(ctx, slide.title, width / 2, 230, 950, 110, '#0F172A', '#EF4444');
        
        ctx.shadowColor = 'transparent';

        drawCross(ctx, width / 2 + 200, 440);
        drawCheckmark(ctx, width / 2 - 200, 440);

        const boxY = 510;
        const boxSize = 300;
        await drawToolBox(ctx, width / 2 + 60, boxY, boxSize, slide.badTool, slide.badToolDomain, false);
        await drawToolBox(ctx, width / 2 - 360, boxY, boxSize, slide.goodTool, slide.goodToolDomain, true);   

        if (slide.nextTeaser) {
            ctx.font = '35px "CairoBoldHack"';
            ctx.fillStyle = '#334155';
            ctx.textAlign = 'center';
            ctx.fillText(slide.nextTeaser, width / 2, 1080);
            
            const textWidth = ctx.measureText(slide.nextTeaser).width;
            drawArrowLeft(ctx, (width / 2) - (textWidth / 2) - 70, 1070);
        }
    } 
    // ==========================================
    // شريحة الختام (CTA)
    // ==========================================
    else if (slide.type === 'cta') {
        ctx.save();

        const imgX = width / 2;
        const imgY = 280; 
        const imgRadius = 120; 

        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(15, 23, 42, 0.4)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.lineWidth = 10;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2;
            const sy = (avatar.height - s) / 2;
            
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {
            console.log("⚠️ الصورة الشخصية غير موجودة.");
        }
        ctx.restore();
        
        ctx.font = '45px "CairoBoldHack"'; 
        ctx.textAlign = 'right';

        let part1, part2, part3, part4;

        if (platform === 'facebook') {
            part1 = "الروابط كاملة في ";
            part2 = '"أول تعليق"';
            part3 = " 👇 شارك المنشور";
            part4 = "لتعود إليه لاحقاً وتفيد غيرك ↪️";
        } else {
            part1 = "علق بكلمة ";
            part2 = '"أدوات"';
            part3 = " وراح أرسلك أفضل الأدوات";
            part4 = "والمقارنات لسنة 2026";
        }

        const w1 = ctx.measureText(part1).width;
        const w2 = ctx.measureText(part2).width;
        const w3 = ctx.measureText(part3).width;
        
        const totalWidthLine1 = w1 + w2 + w3;
        let currentX = (width / 2) + (totalWidthLine1 / 2);

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part1, currentX, 580);
        currentX -= w1;

        ctx.fillStyle = platform === 'facebook' ? '#2563EB' : '#0F766E'; 
        ctx.fillText(part2, currentX, 580);
        currentX -= w2;

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part3, currentX, 580);

        ctx.textAlign = 'center';
        ctx.fillText(part4, width / 2, 650);

        const iconY = 820; 
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        
        const btnGap = 200; 
        const startX = width / 2 - (btnGap * 1.5); 
        
        ctx.beginPath();
        ctx.moveTo(startX, iconY); 
        ctx.lineTo(startX + 30, iconY); 
        ctx.lineTo(startX + 30, iconY + 40); 
        ctx.lineTo(startX + 15, iconY + 25); 
        ctx.lineTo(startX, iconY + 40); 
        ctx.closePath(); 
        ctx.stroke();

        if (platform === 'facebook') {
            ctx.beginPath();
            ctx.moveTo(startX + btnGap + 15, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 35);
            ctx.moveTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 10, iconY + 40);
            ctx.stroke();
        } else {
            ctx.beginPath(); 
            ctx.moveTo(startX + btnGap, iconY + 35); 
            ctx.lineTo(startX + btnGap + 30, iconY); 
            ctx.lineTo(startX + btnGap + 15, iconY + 40); 
            ctx.lineTo(startX + btnGap + 10, iconY + 20); 
            ctx.closePath(); 
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(startX + (btnGap * 2) + 15, iconY + 25, 20, 0, Math.PI * 2);
        if (platform === 'facebook') {
            ctx.moveTo(startX + (btnGap * 2), iconY + 40);
            ctx.lineTo(startX + (btnGap * 2) - 10, iconY + 50);
            ctx.lineTo(startX + (btnGap * 2) + 5, iconY + 43);
        }
        ctx.stroke();

        if (platform === 'facebook') {
            ctx.beginPath();
            const thumbX = startX + (btnGap * 3) + 15;
            const thumbY = iconY + 25;
            ctx.moveTo(thumbX, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY - 5); ctx.lineTo(thumbX, thumbY - 5);
            ctx.moveTo(thumbX, thumbY - 5); ctx.lineTo(thumbX + 5, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 5);
            ctx.lineTo(thumbX + 20, thumbY - 5); ctx.lineTo(thumbX + 15, thumbY + 15); ctx.closePath();
            ctx.stroke();
        } else {
            ctx.beginPath(); 
            ctx.arc(startX + (btnGap * 3) + 15, iconY + 25, 20, 0, Math.PI * 2); 
            ctx.stroke();
        }

        ctx.font = '24px "CairoBoldHack"';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'center';
        
        if (platform === 'facebook') {
            ctx.fillText("احفظه لتعود", startX + 15, iconY + 80); ctx.fillText("إليه لاحقاً", startX + 15, iconY + 110);
            ctx.fillText("شارك المنشور", startX + btnGap + 15, iconY + 80); ctx.fillText("لتفيد غيرك", startX + btnGap + 15, iconY + 110);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 15, iconY + 80); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 15, iconY + 110);
            ctx.fillText("إعجاب", startX + (btnGap * 3) + 15, iconY + 80); ctx.fillText("ما يضر", startX + (btnGap * 3) + 15, iconY + 110);
        } else {
            ctx.fillText("احفظه يمكن", startX + 15, iconY + 80); ctx.fillText("تحتاجه بيوم", startX + 15, iconY + 110);
            ctx.fillText("شاركه مع", startX + btnGap + 15, iconY + 80); ctx.fillText("اللي تحبه", startX + btnGap + 15, iconY + 110);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 15, iconY + 80); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 15, iconY + 110);
            ctx.fillText("لايك واحد", startX + (btnGap * 3) + 15, iconY + 80); ctx.fillText("ما يضر", startX + (btnGap * 3) + 15, iconY + 110);
        }
    }

    // ==========================================
    // الفوتر 
    // ==========================================
    drawRoundedRect(ctx, 40, height - 120, 360, 90, 45, '#FFFFFF', true);
    
    ctx.save();
    
    ctx.beginPath();
    ctx.arc(320, height - 75, 30, 0, Math.PI * 2);
    ctx.clip();
    
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2;
        const sy = (avatar.height - s) / 2;
        
        ctx.drawImage(avatar, sx, sy, s, s, 290, height - 105, 60, 60);
    } catch (e) {
        console.log("⚠️ الصورة الشخصية المصغرة غير موجودة.");
    }
    
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = '24px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 270, height - 85);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", 270, height - 55);

    const fileName = `post_${batchId}_slide_${slide.slideNumber}.jpg`;
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiComparisonSlide;