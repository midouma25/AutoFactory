const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

function drawLightBackground(ctx, width, height) {
    ctx.fillStyle = '#F8FAFC'; 
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.lineWidth = 15;
    
    ctx.beginPath();
    ctx.moveTo(0, height * 0.1);
    ctx.bezierCurveTo(width * 0.3, height * 0.05, width * 0.7, height * 0.15, width, height * 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.15);
    ctx.bezierCurveTo(width * 0.3, height * 0.1, width * 0.7, height * 0.2, width, height * 0.15);
    ctx.stroke();
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 12;
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

function drawArrowRight(ctx, ix, iy, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(ix, iy - 12); ctx.lineTo(ix, iy + 12); ctx.lineTo(ix + 18, iy); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix + 26, iy - 18); ctx.lineTo(ix + 26, iy + 18); ctx.lineTo(ix + 46, iy); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix + 56, iy - 26); ctx.lineTo(ix + 56, iy + 26); ctx.lineTo(ix + 84, iy); ctx.closePath(); ctx.fill();
}

function drawRatingRow(ctx, y, level, text) {
    let color = level === 'bad' ? '#EF4444' : level === 'good' ? '#F59E0B' : '#10B981';

    ctx.save();
    ctx.direction = 'rtl';
    ctx.fillStyle = color;
    ctx.textAlign = 'right'; 
    ctx.textBaseline = 'middle';
    ctx.font = '65px "CairoBoldHack"';
    
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, 400, y);
    ctx.restore();

    drawArrowRight(ctx, 470, y, color);
}

function drawMainTitle(ctx, title, x, y) {
    ctx.save();
    ctx.font = '70px "CairoBoldHack"';
    
    ctx.direction = 'rtl';
    const textWidth = ctx.measureText(title).width;
    ctx.direction = 'ltr'; 

    const paddingX = 140; 
    const boxWidth = textWidth + paddingX;
    const boxHeight = 130;

    drawRoundedRect(ctx, x - boxWidth/2, y - boxHeight/2, boxWidth, boxHeight, 25, '#FFFFFF', true);
    
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl'; 
    ctx.fillStyle = '#EA580C'; 
    ctx.shadowColor = 'rgba(234, 88, 12, 0.25)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    ctx.fillText(title, x, y + 5);
    ctx.restore();
}

async function drawToolBox(ctx, x, y, size, toolName, toolDomain) {
    drawRoundedRect(ctx, x - (size/2), y - (size/2), size, size, 30, '#FFFFFF', true);
    
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    let logoLoaded = false;
    let finalDomain = toolDomain ? toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    try {
        const logoUrl = `https://logo.clearbit.com/${finalDomain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = size * 0.65;
        ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2) - 10, logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = size * 0.55; 
            ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2) - 10, logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    if (!logoLoaded) {
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        ctx.beginPath();
        ctx.arc(x, y - 10, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#F1F5F9';
        ctx.fill();

        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.font = '55px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#475569';
        ctx.fillText(firstLetter, x, y - 5);
        ctx.restore();
    }

    ctx.save();
    ctx.direction = 'rtl'; 
    ctx.font = 'bold 30px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#0F172A';
    const cleanToolName = toolName.trim();
    ctx.fillText(cleanToolName, x, y + (size/2) + 15);
    ctx.restore();
}

async function drawTripleComparisonSlide(slide, totalSlides, batchId, platform = 'instagram', globalTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    drawLightBackground(ctx, width, height);

    // --------------------------------------------------
    // نقاط التنقل العلوية (حصرياً للإنستغرام) 🚀
    // --------------------------------------------------
    if (platform === 'instagram') {
        const dotSpacing = 45;
        const dotRadius = 12;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        ctx.lineWidth = 2;
        for(let i = 0; i < totalSlides; i++) {
            ctx.beginPath(); 
            ctx.arc(startCX + (i * dotSpacing), 30, dotRadius, 0, Math.PI*2); 
            
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
    // Header
    // --------------------------------------------------
    ctx.direction = 'ltr';
    ctx.font = '35px "CairoBoldHack"';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'right';
    const slideNumStr = slide.slideNumber.toString().padStart(2, '0');
    ctx.fillText(slideNumStr, width - 60, 80);

    ctx.save();
    const saveX = 60;
    const saveY = 80; 
    ctx.beginPath();
    ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
    ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
    ctx.lineTo(saveX, saveY + 16); ctx.closePath();
    ctx.fillStyle = '#1E293B'; 
    ctx.fill();

    ctx.font = 'bold 24px "CairoRegularHack"';
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", saveX + 30, saveY);
    ctx.restore();

    // 🚀 رسم العنوان العام للمنشور (Top Center Header)
   
    if (globalTopic && slide.slideNumber <= totalSlides - 1) {
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = '24px "CairoRegularHack"'; // استخدام الخط العادي للأناقة
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textWidth = ctx.measureText(globalTopic).width;
        const centerX = width / 2;
        const centerY = 80;
        
        ctx.fillText(globalTopic, centerX, centerY);
        
        // شرطات جمالية على الجانبين
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(centerX - textWidth/2 - 25, centerY); ctx.lineTo(centerX - textWidth/2 - 10, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX + textWidth/2 + 10, centerY); ctx.lineTo(centerX + textWidth/2 + 25, centerY); ctx.stroke();
        ctx.restore();
    }
    // --------------------------------------------------
    // المحتوى
    // --------------------------------------------------
    if (slide.type === 'comparison') {
        
        drawMainTitle(ctx, slide.title, width / 2, 250);

        const toolsStartX = 820; 
        const row1Y = 480;
        const row2Y = 770;
        const row3Y = 1060;

        drawRatingRow(ctx, row1Y, 'bad', 'سيئ');
        await drawToolBox(ctx, toolsStartX, row1Y, 210, slide.badTool, slide.badToolDomain);

        drawRatingRow(ctx, row2Y, 'good', 'جيد');
        await drawToolBox(ctx, toolsStartX, row2Y, 210, slide.goodTool, slide.goodToolDomain);

        drawRatingRow(ctx, row3Y, 'pro', 'احترافي');
        await drawToolBox(ctx, toolsStartX, row3Y, 210, slide.proTool, slide.proToolDomain);

        if (slide.nextTeaser) {
            ctx.save();
            ctx.direction = 'ltr';
            ctx.font = 'bold 28px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.textAlign = 'right';
            ctx.fillText("NEXT", width - 85, height - 70);
            
            const arrowX = width - 50;
            const arrowY = height - 70;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY - 12); ctx.lineTo(arrowX + 20, arrowY - 12);
            ctx.lineTo(arrowX + 20, arrowY - 22); ctx.lineTo(arrowX + 40, arrowY);
            ctx.lineTo(arrowX + 20, arrowY + 22); ctx.lineTo(arrowX + 20, arrowY + 12);
            ctx.lineTo(arrowX, arrowY + 12); ctx.closePath();
            ctx.fillStyle = '#0F172A';
            ctx.fill();
            ctx.restore();
        }

    } else if (slide.type === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 180; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#0F172A';
        ctx.stroke();
        
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2;
            const sy = (avatar.height - s) / 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, imgRadius * 2, imgRadius * 2);
        } catch (err) {}
        ctx.restore();

        // 🚀 التفريق الذكي في شريحة الختام بناءً على المنصة
        ctx.save();
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        
        if (platform === 'facebook') {
            ctx.font = '50px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.fillText("الروابط كاملة موجودة في", width/2, 630);
            
            ctx.font = '55px "CairoBoldHack"';
            ctx.fillStyle = '#2563EB'; // أزرق فيسبوك
            ctx.fillText('"أول تعليق" 👇', width/2, 700);
        } else {
            ctx.font = '50px "CairoBoldHack"';
            ctx.fillStyle = '#0F172A';
            ctx.fillText("اكتب كلمة أدوات في التعليقات", width/2, 630);
            
            ctx.font = '55px "CairoBoldHack"';
            ctx.fillStyle = '#EA580C'; // برتقالي مميز
            ctx.fillText("وراح ابعثلك الروابط في الخاص", width/2, 700);
        }
        ctx.restore();
        
        const iconY = 920; 
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 4;
        const btnGap = 200; 
        const startX = width / 2 - (btnGap * 1.5); 
        
        // Save
        ctx.beginPath(); ctx.moveTo(startX, iconY); ctx.lineTo(startX + 35, iconY); 
        ctx.lineTo(startX + 35, iconY + 45); ctx.lineTo(startX + 17.5, iconY + 30); 
        ctx.lineTo(startX, iconY + 45); ctx.closePath(); ctx.stroke();

        // Share
        if (platform === 'facebook') {
            ctx.beginPath(); ctx.moveTo(startX + btnGap + 15, iconY + 15); ctx.lineTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 35, iconY + 35); ctx.moveTo(startX + btnGap + 35, iconY + 15);
            ctx.lineTo(startX + btnGap + 10, iconY + 40); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(startX + btnGap, iconY + 40); ctx.lineTo(startX + btnGap + 35, iconY); 
            ctx.lineTo(startX + btnGap + 20, iconY + 45); ctx.lineTo(startX + btnGap + 10, iconY + 25); 
            ctx.closePath(); ctx.stroke();
        }

        // Comment
        ctx.beginPath(); ctx.arc(startX + (btnGap * 2) + 15, iconY + 25, 22, 0, Math.PI * 2);
        if (platform === 'facebook') {
            ctx.moveTo(startX + (btnGap * 2), iconY + 42); ctx.lineTo(startX + (btnGap * 2) - 10, iconY + 52); ctx.lineTo(startX + (btnGap * 2) + 5, iconY + 45);
        }
        ctx.stroke();

        // Like
        if (platform === 'facebook') {
            ctx.beginPath(); const thumbX = startX + (btnGap * 3) + 15; const thumbY = iconY + 25;
            ctx.moveTo(thumbX, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY + 15); ctx.lineTo(thumbX - 10, thumbY - 5); ctx.lineTo(thumbX, thumbY - 5);
            ctx.moveTo(thumbX, thumbY - 5); ctx.lineTo(thumbX + 5, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 15); ctx.lineTo(thumbX + 10, thumbY - 5);
            ctx.lineTo(thumbX + 20, thumbY - 5); ctx.lineTo(thumbX + 15, thumbY + 15); ctx.closePath(); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.arc(startX + (btnGap * 3) + 15, iconY + 25, 22, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.font = '26px "CairoBoldHack"';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'center';
        
        // 🚀 الأيقونات السفلية: تغيير النصوص بناءً على المنصة
        if (platform === 'facebook') {
            ctx.fillText("احفظه لتعود", startX + 17.5, iconY + 90); ctx.fillText("إليه لاحقاً", startX + 17.5, iconY + 125);
            ctx.fillText("شارك المنشور", startX + btnGap + 17.5, iconY + 90); ctx.fillText("لتفيد غيرك", startX + btnGap + 17.5, iconY + 125);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 17.5, iconY + 90); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 17.5, iconY + 125);
            ctx.fillText("إعجاب", startX + (btnGap * 3) + 17.5, iconY + 90); ctx.fillText("ما يضر", startX + (btnGap * 3) + 17.5, iconY + 125);
        } else {
            ctx.fillText("احفظه يمكن", startX + 17.5, iconY + 90); ctx.fillText("تحتاجه بيوم", startX + 17.5, iconY + 125);
            ctx.fillText("شاركه مع", startX + btnGap + 17.5, iconY + 90); ctx.fillText("اللي تحبه", startX + btnGap + 17.5, iconY + 125);
            ctx.fillText("رأيك يهمني", startX + (btnGap * 2) + 17.5, iconY + 90); ctx.fillText("بالتعليقات", startX + (btnGap * 2) + 17.5, iconY + 125);
            ctx.fillText("لايك واحد", startX + (btnGap * 3) + 17.5, iconY + 90); ctx.fillText("ما يضر", startX + (btnGap * 3) + 17.5, iconY + 125);
        }
    }

    // --------------------------------------------------
    // الفوتر (معلومات الحساب - تصميم الكبسولة الاحترافية) 
    // --------------------------------------------------
    const badgeHeight = 90;
    const badgeWidth = 430; 
    const badgeX = 50;
    const badgeY = height - 115; 
    
    drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, '#FFFFFF', true);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F1F5F9';
    ctx.stroke();

    const profileX = badgeX + (badgeHeight / 2);
    const profileY = badgeY + (badgeHeight / 2);
    const avatarRadius = (badgeHeight / 2) - 8; 

    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX, profileY, avatarRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#EA580C'; 
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX, profileY, avatarRadius, 0, Math.PI * 2);
    ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        ctx.drawImage(avatar, (avatar.width - s)/2, (avatar.height - s)/2, s, s, profileX - avatarRadius, profileY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    } catch (e) {}
    ctx.restore();

    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    const textRightEdge = badgeX + badgeWidth - 30; 
    
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", textRightEdge, profileY - 12);
    
    ctx.fillStyle = '#64748B';
    ctx.font = '18px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", textRightEdge, profileY + 20);
    ctx.restore();

// حفظ الصورة النهائية مع تمييز اسم المنصة (platform) لمنع التداخل
    const fileName = `post_${batchId}_${platform}_slide_${slide.slideNumber}.jpg`;
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 1.0 });
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawTripleComparisonSlide;