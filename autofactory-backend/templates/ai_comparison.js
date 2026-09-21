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

// 👈 1. التعديل الأول: إضافة platform هنا
async function drawAiComparisonSlide(slide, totalSlides, batchId, platform = 'instagram') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);
    drawCircuitLines(ctx, width, height);

    ctx.direction = 'rtl';
    
    // 👈 2. التعديل الثاني: إخفاء نقاط التمرير في الفيسبوك
    if (platform === 'instagram') {
        const dotSpacing = 45;
        const dotRadius = 12;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        ctx.lineWidth = 2;
        for(let i = 0; i < totalSlides; i++) {
            ctx.beginPath(); 
            ctx.arc(startCX + (i * dotSpacing), 70, dotRadius, 0, Math.PI*2); 
            
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

    drawRoundedRect(ctx, 40, 40, 90, 80, 15, '#FFFFFF', true);
    ctx.strokeStyle = 'rgba(15, 118, 110, 0.2)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '45px "CairoBoldHack"';
    ctx.fillStyle = '#0F766E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${slide.slideNumber}`, 85, 85);
    ctx.textBaseline = 'alphabetic';

    // ==========================================
    // شريحة المقارنة
    // ==========================================
    if (slide.type === 'comparison') {
        ctx.font = '65px "CairoBoldHack"'; 
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
        wrapText(ctx, slide.title, width / 2, 260, 950, 85);
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
        
        // 👈 3. التعديل الثالث: نصوص وأيقونات الشريحة الختامية الذكية
        ctx.font = '45px "CairoBoldHack"'; 
        ctx.textAlign = 'right';

        let part1, part2, part3, part4;

        // خوارزمية تحديد النص حسب المنصة
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

        // اللون المميز (أزرق لفيسبوك، أخضر لإنستغرام)
        ctx.fillStyle = platform === 'facebook' ? '#2563EB' : '#0F766E'; 
        ctx.fillText(part2, currentX, 580);
        currentX -= w2;

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part3, currentX, 580);

        ctx.textAlign = 'center';
        ctx.fillText(part4, width / 2, 650);

        // رسم الأيقونات السفلية حسب المنصة
        const iconY = 820; 
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#334155';
        ctx.font = '24px "CairoBoldHack"';
        
        if (platform === 'facebook') {
            // أيقونات فيسبوك 
            ctx.fillText("↪️ مشاركة", width/2 - 200, iconY + 50);
            ctx.fillText("💬 تعليق", width/2, iconY + 50);
            ctx.fillText("👍 إعجاب", width/2 + 200, iconY + 50);
        } else {
            // أيقونات إنستغرام
            ctx.beginPath(); ctx.moveTo(width/2 - 250, iconY); ctx.lineTo(width/2 - 210, iconY); ctx.lineTo(width/2 - 210, iconY+50); ctx.lineTo(width/2 - 230, iconY+35); ctx.lineTo(width/2 - 250, iconY+50); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width/2 - 90, iconY+10); ctx.lineTo(width/2 - 50, iconY-10); ctx.lineTo(width/2 - 70, iconY+40); ctx.lineTo(width/2 - 80, iconY+20); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 90, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 250, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

            ctx.fillText("احفظه يمكن", width/2 - 230, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 230, iconY + 120);
            ctx.fillText("شاركه مع", width/2 - 70, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 70, iconY + 120);
            ctx.fillText("رأيك يهمني", width/2 + 90, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 90, iconY + 120);
            ctx.fillText("لايك واحد", width/2 + 250, iconY + 90);  ctx.fillText("ما يضر", width/2 + 250, iconY + 120);
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

    const fileName = `post_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiComparisonSlide;