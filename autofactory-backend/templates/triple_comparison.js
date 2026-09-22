const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

// دالة رسم الخلفية المموجة الخفيفة (محاكاة للصورة)
function drawLightBackground(ctx, width, height) {
    ctx.fillStyle = '#F8FAFC'; // لون أبيض مائل للرمادي الفاتح
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.lineWidth = 15;
    
    // رسم بعض الخطوط المنحنية
    ctx.beginPath();
    ctx.moveTo(0, height * 0.1);
    ctx.bezierCurveTo(width * 0.3, height * 0.05, width * 0.7, height * 0.15, width, height * 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.15);
    ctx.bezierCurveTo(width * 0.3, height * 0.1, width * 0.7, height * 0.2, width, height * 0.15);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, height * 0.2);
    ctx.bezierCurveTo(width * 0.3, height * 0.15, width * 0.7, height * 0.25, width, height * 0.2);
    ctx.stroke();
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
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

// رسم المؤشرات (سيئ، جيد، احترافي)
function drawRatingIndicator(ctx, x, y, level, text) {
    ctx.save();
    let color;
    let iconDraw;

    if (level === 'bad') {
        color = '#EF4444'; // أحمر
        iconDraw = (ix, iy) => {
            ctx.beginPath(); ctx.moveTo(ix, iy - 10); ctx.lineTo(ix, iy + 10); ctx.lineTo(ix + 15, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 20, iy - 7); ctx.lineTo(ix + 20, iy + 7); ctx.lineTo(ix + 30, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 35, iy - 4); ctx.lineTo(ix + 35, iy + 4); ctx.lineTo(ix + 42, iy); ctx.closePath(); ctx.fill();
        };
    } else if (level === 'good') {
        color = '#EAB308'; // أصفر
        iconDraw = (ix, iy) => {
            ctx.beginPath(); ctx.moveTo(ix, iy - 10); ctx.lineTo(ix, iy + 10); ctx.lineTo(ix + 15, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 20, iy - 14); ctx.lineTo(ix + 20, iy + 14); ctx.lineTo(ix + 35, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 40, iy - 7); ctx.lineTo(ix + 40, iy + 7); ctx.lineTo(ix + 50, iy); ctx.closePath(); ctx.fill();
        };
    } else { // pro
        color = '#10B981'; // أخضر
        iconDraw = (ix, iy) => {
            ctx.beginPath(); ctx.moveTo(ix, iy - 10); ctx.lineTo(ix, iy + 10); ctx.lineTo(ix + 15, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 20, iy - 15); ctx.lineTo(ix + 20, iy + 15); ctx.lineTo(ix + 35, iy); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(ix + 40, iy - 20); ctx.lineTo(ix + 40, iy + 20); ctx.lineTo(ix + 60, iy); ctx.closePath(); ctx.fill();
        };
    }

    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '60px "CairoBoldHack"';
    
    // تظليل خفيف للنص
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, x, y);
    ctx.shadowColor = 'transparent';

    // رسم الأيقونة بجانب النص
    ctx.fillStyle = color;
    const textWidth = ctx.measureText(text).width;
    iconDraw(x - textWidth - 80, y);
    
    ctx.restore();
}

async function drawToolBox(ctx, x, y, size, toolName, toolDomain) {
    // مربع الأداة مع حواف دائرية وظل
    drawRoundedRect(ctx, x - (size/2), y - (size/2), size, size, 25, '#FFFFFF', true);
    
    // إطار خفيف
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    let logoLoaded = false;
    let finalDomain = toolDomain ? toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    try {
        const logoUrl = `https://logo.clearbit.com/${finalDomain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = size * 0.7;
        ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2), logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = size * 0.6; 
            ctx.drawImage(logo, x - (logoSize / 2), y - (logoSize / 2), logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    if (!logoLoaded) {
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        ctx.beginPath();
        ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#F1F5F9';
        ctx.fill();

        ctx.font = '50px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#475569';
        ctx.fillText(firstLetter, x, y + 5);
    }

    // اسم الأداة أسفل المربع
    ctx.font = '30px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(toolName, x, y + (size/2) + 15);
}

// رسم العنوان الرئيسي بالشكل المحفور/البارز (كما في الصورة)
function drawMainTitle(ctx, title, x, y) {
    ctx.save();
    
    // المربع الأبيض الخلفي
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 10;
    
    // خلفية العنوان
    ctx.fillStyle = '#FFFFFF';
    const bgWidth = 600;
    const bgHeight = 120;
    
    ctx.beginPath();
    ctx.roundRect(x - bgWidth/2, y - bgHeight/2, bgWidth, bgHeight, 20);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    
    // الإطار الداخلي
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 4;
    ctx.stroke();

    // النص
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '75px "CairoBoldHack"';
    
    // تأثير النص المحفور (أو البارز) - برتقالي مع تظليل
    ctx.fillStyle = '#F97316'; // لون برتقالي فاقع
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // استبدال النص بخطوط أو تأثيرات إضافية يمكن وضعها هنا
    ctx.fillText(title, x, y);
    
    // طبقة نص إضافية لإعطاء التأثير المحفور (Outline)
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#C2410C';
    ctx.lineWidth = 2;
    ctx.strokeText(title, x, y);
    
    ctx.restore();
}

async function drawTripleComparisonSlide(slide, totalSlides, batchId, platform = 'instagram') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    drawLightBackground(ctx, width, height);

    // --------------------------------------------------
    // Header (رقم الصفحة وزر الحفظ)
    // --------------------------------------------------
    ctx.direction = 'ltr';
    ctx.font = '35px "CairoRegularHack"';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'right';
    const slideNumStr = slide.slideNumber.toString().padStart(2, '0');
    ctx.fillText(slideNumStr, width - 60, 80);

    ctx.save();
    const saveX = 60;
    const saveY = 80; 
    
    ctx.beginPath();
    ctx.moveTo(saveX, saveY - 14);
    ctx.lineTo(saveX + 18, saveY - 14);
    ctx.lineTo(saveX + 18, saveY + 16);
    ctx.lineTo(saveX + 9, saveY + 8);
    ctx.lineTo(saveX, saveY + 16);
    ctx.closePath();
    ctx.fillStyle = '#334155'; 
    ctx.fill();

    ctx.font = '24px "CairoRegularHack"';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("SAVE THE POST", saveX + 30, saveY);
    ctx.restore();

    // --------------------------------------------------
    // المحتوى
    // --------------------------------------------------
    ctx.direction = 'rtl';
    
    if (slide.type === 'comparison') {
        
        drawMainTitle(ctx, slide.title, width / 2, 230);

        const toolsStartX = width - 180; // موضع الأدوات على اليمين (عكس الصورة ليتناسب مع العربي)
        const levelsStartX = 350; // موضع التقييمات على اليسار
        
        const row1Y = 450;
        const row2Y = 750;
        const row3Y = 1050;

        // الأداة السيئة
        drawRatingIndicator(ctx, levelsStartX, row1Y, 'bad', 'سيئ');
        await drawToolBox(ctx, toolsStartX, row1Y, 180, slide.badTool, slide.badToolDomain);

        // الأداة الجيدة
        drawRatingIndicator(ctx, levelsStartX, row2Y, 'good', 'جيد');
        await drawToolBox(ctx, toolsStartX, row2Y, 180, slide.goodTool, slide.goodToolDomain);

        // الأداة الاحترافية
        drawRatingIndicator(ctx, levelsStartX, row3Y, 'pro', 'احترافي');
        await drawToolBox(ctx, toolsStartX, row3Y, 180, slide.proTool, slide.proToolDomain);

        // زر NEXT
        if (slide.nextTeaser) {
            ctx.font = '30px "CairoRegularHack"';
            ctx.fillStyle = '#0F172A';
            ctx.textAlign = 'left';
            ctx.fillText("NEXT", width - 150, height - 70);
            
            // سهم NEXT
            const arrowX = width - 70;
            const arrowY = height - 80;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY - 15); ctx.lineTo(arrowX + 25, arrowY - 15);
            ctx.lineTo(arrowX + 25, arrowY - 25); ctx.lineTo(arrowX + 45, arrowY - 5);
            ctx.lineTo(arrowX + 25, arrowY + 15); ctx.lineTo(arrowX + 25, arrowY + 5);
            ctx.lineTo(arrowX, arrowY + 5); ctx.closePath();
            ctx.fillStyle = '#0F172A';
            ctx.fill();
        }

    } else if (slide.type === 'cta') {
        // شريحة الختام (تشبه الشريحة الأولى في الصور المرفقة)
        
        // رسم دائرة الصورة الكبيرة
        const imgX = width / 2;
        const imgY = 350; 
        const imgRadius = 200; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        
        // إطار أسود حول الصورة
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

        // النص الختامي
        ctx.textAlign = 'center';
        ctx.font = '45px "CairoBoldHack"';
        ctx.fillStyle = '#0F172A';
        ctx.fillText("اكتبلي \"أدوات\" وراح ابعثلك افضل 10 ادوات في", width/2, 680);
        ctx.fillText("الذكاء الاصطناعي لسنة 2026", width/2, 750);
        
        // هنا يمكن إضافة كود رسم الأيقونات الأربعة (Like, Comment, Share, Save)
        // لقد أرفقتها لك في הקוד السابق الخاص بـ ai_comparison ويمكنك نسخه هنا
    }

    // --------------------------------------------------
    // الفوتر (معلومات الحساب)
    // --------------------------------------------------
    const footerY = height - 120;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(100, footerY + 40, 35, 0, Math.PI * 2);
    ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        ctx.drawImage(avatar, (avatar.width - s)/2, (avatar.height - s)/2, s, s, 65, footerY + 5, 70, 70);
    } catch (e) {}
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = '28px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 150, footerY + 35);
    ctx.fillStyle = '#64748B';
    ctx.font = '18px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", 150, footerY + 65);

    const fileName = `post_${batchId}_slide_${slide.slideNumber}.jpg`;
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawTripleComparisonSlide;