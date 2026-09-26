const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

try {
    // خطوطنا القديمة كاحتياط
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
    // 💰 خطوط البيزنس الفخمة الجديدة
    registerFont(path.join(__dirname, '../Alexandria-Bold.ttf'), { family: 'AlexandriaHack' });
    registerFont(path.join(__dirname, '../Tajawal-Bold.ttf'), { family: 'TajawalHack' });
} catch (error) {
    console.log("⚠️ مشكلة في تحميل الخطوط، تأكد من مسارها.");
}

// ==========================================
// الدوال المساعدة (نفس دوالك القوية السابقة)
// ==========================================

// دالة تكسير النصوص (تدعم اللغتين وتعيد الارتفاع الكلي)
function wrapText(ctx, text, x, y, maxWidth, lineHeight, draw = true) {
    if (!text) return y;
    // دعم تلوين الكلمات الإنجليزية بالذهبي (اختياري، مأخوذ من كودك السابق)
    const isEnglish = (word) => /^[a-zA-Z0-9\-\.\,\/\:]+$/.test(word);
    
    const paragraphs = text.split('\n');
    let currentY = y;
    
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let lineWords = [];
        let lineWidth = 0;
        
        for (let n = 0; n < words.length; n++) {
            const word = words[n];
            const testWidth = ctx.measureText(word + ' ').width;
            
            if (lineWidth + testWidth > maxWidth && lineWords.length > 0) {
                // رسم السطر
                if (draw) {
                    let cx = x + (ctx.textAlign === 'center' ? (maxWidth - lineWidth)/2 : 0) - (maxWidth/2); // للتبسيط نعتمد على محاذاة الكانفاس
                    ctx.fillText(lineWords.join(' '), x, currentY);
                    
                    // (ملاحظة: يمكنك الاحتفاظ بكود التلوين الذهبي المعقد الخاص بك هنا إذا كنت تستخدمه، 
                    // هذه النسخة المبسطة ترسم السطر العادي فقط لضمان عمل حساب الارتفاع بدقة)
                }
                currentY += lineHeight;
                lineWords = [word];
                lineWidth = testWidth;
            } else {
                lineWords.push(word);
                lineWidth += testWidth;
            }
        }
        if (lineWords.length > 0) {
            if (draw) ctx.fillText(lineWords.join(' '), x, currentY);
            currentY += lineHeight;
        }
    }
    return currentY; // نعيد الـ Y النهائي لنعرف الارتفاع الكلي للنص
}

function fillMixedText(ctx, text, x, y, maxWidth) {
    ctx.save(); 
    const parts = text.split(/([@.#$]*[a-zA-Z0-9]+[a-zA-Z0-9\-_.+#$]*)/);
    let totalWidth = 0;
    for (let i = 0; i < parts.length; i++) {
        totalWidth += ctx.measureText(parts[i]).width;
    }
    let currentX = x + (totalWidth / 2);
    ctx.textAlign = 'right';
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        const isEnglish = /[a-zA-Z0-9\-_]+/.test(part);
        const partWidth = ctx.measureText(part).width;
        ctx.save();
        ctx.direction = isEnglish ? 'ltr' : 'rtl';
        // 💰 تمييز الكلمات الإنجليزية (SaaS, AI, etc) باللون الذهبي تلقائياً
        if(isEnglish) {
            ctx.fillStyle = '#EAB308'; // Gold
        }
        ctx.fillText(part, currentX, y);
        ctx.restore();
        currentX -= partWidth;
    }
    ctx.restore(); 
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true, borderColor = null) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 15;
    }
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
    ctx.shadowColor = 'transparent';
    
    if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawMacWindow(ctx, x, y, width, height) {
    // 💼 تعديل نافذة الماك لتصبح كـ "لوحة تحكم مالية" (Financial Dashboard)
    drawRoundedRect(ctx, x, y, width, height, 25, 'rgba(15, 23, 42, 0.85)', true, 'rgba(234, 179, 8, 0.2)'); // إطار ذهبي خفيف
    ctx.beginPath();
    ctx.moveTo(x + 25, y); ctx.lineTo(x + width - 25, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + 25);
    ctx.lineTo(x + width, y + 60); ctx.lineTo(x, y + 60);
    ctx.lineTo(x, y + 25); ctx.quadraticCurveTo(x, y, x + 25, y);
    ctx.closePath();
    ctx.fillStyle = '#05070A'; ctx.fill();

    const dotY = y + 30;
    ctx.beginPath(); ctx.arc(x + 35, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#EF4444'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 65, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#F59E0B'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 95, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#10B981'; ctx.fill();
}

function drawPremiumBackground(ctx, width, height) {
    // 💼 خلفية ليلية عميقة جداً (Obsidian) مع توهج ذهبي خفي
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#020617'); grad.addColorStop(1, '#05070A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
    
    const glow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 900);
    glow.addColorStop(0, 'rgba(234, 179, 8, 0.08)'); // توهج ذهبي خافت
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let j = 0; j < height; j += 60) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke(); }
}

// ==========================================
// الدالة الرئيسية
// ==========================================
async function drawBusinessRoadmapSlide(slide, totalSlides, batchId, platform = 'instagram', mainTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const slideType = slide.type ? slide.type.toLowerCase() : '';

    // 1. الخلفية الفخمة
    drawPremiumBackground(ctx, width, height);

// ==========================================
    // 🔵 2. شريط التقدم الزمني والنقاط (مخفي في الغلاف)
    // ==========================================
    // يتم التنفيذ فقط إذا لم نكن في الشريحة الأولى ولم نكن على فيسبوك
    if (platform !== 'facebook' && slide.slideNumber > 1) {
        
        let dotSpacing = 50; 
        if (totalSlides >= 10) dotSpacing = 35; 
        if (totalSlides >= 14) dotSpacing = 26; 

        const dotRadius = 8;
        const dotsY = 70; 
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        
        // --- أ. رسم الخط الخلفي الداكن الأساسي ---
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1E293B'; 
        ctx.beginPath();
        ctx.moveTo(startCX, dotsY);
        ctx.lineTo(startCX + totalDotsWidth, dotsY);
        ctx.stroke();

        // --- ب. رسم الخط الذهبي للتقدم (Progress Line) ---
        const currentProgressWidth = (slide.slideNumber - 1) * dotSpacing;
        if (currentProgressWidth > 0) {
            ctx.strokeStyle = '#EAB308'; // خط ذهبي
            ctx.beginPath(); 
            ctx.moveTo(startCX, dotsY); 
            ctx.lineTo(startCX + currentProgressWidth, dotsY); 
            ctx.stroke();
        }
        
        // --- ج. رسم النقاط فوق الخطوط ---
        ctx.lineWidth = 2; // إعادة تعيين سمك الخط للنقاط
        for(let i = 0; i < totalSlides; i++) {
            const cx = startCX + (i * dotSpacing);
            ctx.beginPath();
            ctx.arc(cx, dotsY, dotRadius, 0, Math.PI*2);
            
            if (i + 1 === slide.slideNumber) {
                // النقطة الحالية
                ctx.fillStyle = '#EAB308'; ctx.shadowColor = '#EAB308'; ctx.shadowBlur = 15;
                ctx.fill(); ctx.strokeStyle = '#EAB308';
            } else if (i + 1 < slide.slideNumber) {
                // النقاط السابقة
                ctx.fillStyle = '#EAB308'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#EAB308';
            } else {
                // النقاط القادمة
                ctx.fillStyle = '#0F172A'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#334155';
            }
            
            ctx.stroke(); 
            ctx.shadowColor = 'transparent'; 
        }
    }
    

    // ==========================================
    // 🎨 شريحة الخطاف (Hook) - الغلاف الجشع
    // ==========================================
    if (slideType === 'hook') {

        // زر الحفظ (الذهبي)
        ctx.save();
        const saveX = 60; const saveY = 80; 
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#94A3B8'; ctx.fill(); 
        ctx.direction = 'ltr'; ctx.font = 'bold 20px "TajawalHack"'; ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE BLUEPRINT", saveX + 30, saveY);
        ctx.restore();

        // 💎 شارة الـ VIP (Business Blueprint)
        const stepsCount = totalSlides > 2 ? totalSlides - 2 : totalSlides;
        const valueBadgeText = `💼 خطة عمل من ${stepsCount} مراحل`; 
        
        ctx.save();
        ctx.direction = 'rtl';
        ctx.font = 'bold 24px "TajawalHack"'; 
        const badgeTextWidth = ctx.measureText(valueBadgeText).width;
        const badgeWidth = badgeTextWidth + 60; 
        const badgeHeight = 50;
        const badgeY = 160; 
        const badgeX = (width - badgeWidth) / 2;

        drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, 'rgba(234, 179, 8, 0.1)', false, '#EAB308');
        ctx.fillStyle = '#EAB308';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(valueBadgeText, width / 2, badgeY + (badgeHeight / 2) + 2);
        ctx.restore();
        
        // 5. العنوان العريض (الخطاف) بالخط الفخم الجديد
        ctx.font = '900 85px "AlexandriaHack"'; // 👈 خط الإسكندرية العملاق
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center'; 
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 15;
        let textY = 850; 
        textY = wrapText(ctx, slide.title, width/2, textY, 950, 110); 
        ctx.shadowColor = 'transparent';

        // 6. مؤشر الحركة (The Action Cue) الديناميكي الأخضر الزمردي
        const btnY = 1130; 
        ctx.save();
        let actionText = platform === 'facebook' ? "اضغط على الصور للتفاصيل 👆" : "اكتشف خريطة الأرباح 👉";
        ctx.font = 'bold 32px "TajawalHack"';
        const textWidthAction = ctx.measureText(actionText).width;
        const btnWidth = textWidthAction + 100;
        const btnHeight = 75;
        const btnX = (width / 2) - (btnWidth / 2);
        
        // لون أخضر زمردي فاخر (للدلالة على المال/الانطلاق)
        drawRoundedRect(ctx, btnX, btnY - (btnHeight / 2), btnWidth, btnHeight, 35, '#10B981', true);
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(actionText, width / 2, btnY);
        ctx.restore();
    }
    
    // ==========================================
    // شريحة الخطوة (Step) - Dashboard Style
    // ==========================================
    else if (slideType === 'step') {
        
        // زر الحفظ
        ctx.save();
        const saveY = height - 80; 
        ctx.direction = 'ltr'; ctx.font = 'bold 24px "TajawalHack"'; 
        const textWidthSave = ctx.measureText("SAVE THIS").width;
        const textEndX = 1000; 
        const saveX = textEndX - textWidthSave - 35; 
        
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#94A3B8'; ctx.fill();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THIS", saveX + 30, saveY);
        ctx.restore();

        // الرقم العملاق (مفرغ بالذهبي)
        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.font = '280px "AlexandriaHack"'; // 👈 خط الإسكندرية
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)'; // ذهبي مفرغ
        ctx.lineWidth = 4;
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.strokeText(slide.slideNumber, 100, 300);
        const numWidth = ctx.measureText(slide.slideNumber).width;
        ctx.restore();

        // اللوجو (نفس كودك القوي)
        const toolStartX = 100 + numWidth + 40;
        const logoSize = 100;
        let finalDomain = slide.toolDomain ? slide.toolDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] : `${slide.toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        
        let logoLoaded = false;
        try {
            const logo = await loadImage(`https://logo.clearbit.com/${finalDomain}`);
            ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
            logoLoaded = true;
        } catch (e) {
            try {
                const logo = await loadImage(`https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`);
                ctx.drawImage(logo, toolStartX, 180, logoSize, logoSize);
                logoLoaded = true;
            } catch (err) {}
        }

        if (!logoLoaded) {
            drawRoundedRect(ctx, toolStartX, 180, logoSize, logoSize, 20, '#1E293B', false);
            ctx.font = '50px "AlexandriaHack"'; ctx.fillStyle = '#EAB308'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(slide.toolName.charAt(0).toUpperCase(), toolStartX + logoSize/2, 180 + logoSize/2);
        }

        // اسم الأداة
        // ==========================================
        // ✍️ اسم الأداة (مع التصغير الديناميكي المتناسق)
        // ==========================================
        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.fillStyle = '#FFFFFF'; 
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'middle';
        
        const safeToolName = slide.toolName ? slide.toolName.split(' ')[0] : 'Tool';
        
        let toolFontSize = 90; // الحجم الأساسي الفخم
        ctx.font = `${toolFontSize}px "AlexandriaHack"`; 
        
        const maxAllowedWidth = 550; // أقصى عرض مسموح للكلمة حتى لا تخرج من الشاشة
        
        // لوغاريتم التصغير التلقائي: يصغر الخط درجتين في كل دورة حتى تتسع الكلمة في المساحة
        while (ctx.measureText(safeToolName).width > maxAllowedWidth && toolFontSize > 35) {
            toolFontSize -= 2;
            ctx.font = `${toolFontSize}px "AlexandriaHack"`;
        }

        // رسم الكلمة بالحجم الجديد (بدون استخدام معامل maxWidth القديم الذي يضغط الكلمة)
        ctx.fillText(safeToolName, toolStartX + logoSize + 30, 230);
        ctx.restore();

        // عنوان الخطوة (الشارة)
        ctx.save();
        ctx.direction = 'rtl'; ctx.font = '40px "TajawalHack"';
        const titleWidth = ctx.measureText(slide.title).width;
        const badgeWidthStep = titleWidth + 80; const badgeHeightStep = 80;
        const badgeXStep = (width / 2) - (badgeWidthStep / 2); const badgeYStep = 380;
        
        drawRoundedRect(ctx, badgeXStep, badgeYStep, badgeWidthStep, badgeHeightStep, 40, '#EAB308', true); // شارة ذهبية
        ctx.fillStyle = '#05070A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(slide.title, width / 2, badgeYStep + (badgeHeightStep / 2));
        ctx.restore();

        // نافذة الشرح (Dashboard)
// ==========================================
        // 🖥️ نافذة الشرح الذكية (تتمدد حسب النص)
        // ==========================================
        const windowX = 80; 
        const windowY = 510; 
        const windowW = 920; 
        let windowH = 480; // الارتفاع الافتراضي الأدنى

        if (slide.explanation) {
            ctx.save();
            ctx.direction = 'rtl'; 
            ctx.font = '38px "TajawalHack"';
            
            // 1. حساب الارتفاع المطلوب (بدون رسم، draw = false)
            const textStartX = width / 2;
            const textStartY = windowY + 130;
            const textMaxWidth = windowW - 120;
            const lineHeight = 70;
            
            // finalY هو آخر إحداثي صله النص
            const finalY = wrapText(ctx, slide.explanation, textStartX, textStartY, textMaxWidth, lineHeight, false);
            
            // 2. تحديث ارتفاع النافذة إذا كان النص طويلاً
            const requiredHeight = (finalY - windowY) + 60; // 60 بكسل مسافة تنفس سفلية
            if (requiredHeight > windowH) {
                windowH = requiredHeight;
            }

            // 3. رسم النافذة بالارتفاع المحسوب
            drawMacWindow(ctx, windowX, windowY, windowW, windowH);

            // 4. رسم النص الفعلي داخل النافذة (draw = true)
            ctx.fillStyle = '#F8FAFC'; 
            ctx.textAlign = 'center';
            wrapText(ctx, slide.explanation, textStartX, textStartY, textMaxWidth, lineHeight, true); 
            
            ctx.restore();
        } else {
            // رسم النافذة الافتراضية إذا لم يكن هناك نص
            drawMacWindow(ctx, windowX, windowY, windowW, windowH);
        }
    } 
// ==========================================
    // شريحة الختام (CTA) - [النسخة الاحترافية المضبوطة]
    // ==========================================
    else if (slideType === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 160; 

        // 1. رسم الصورة الشخصية (الأفاتار)
        ctx.save();
        ctx.beginPath(); ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(234, 179, 8, 0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#05070A'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = 10; ctx.strokeStyle = '#EAB308'; ctx.stroke();
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {}
        ctx.restore();
        
        // ==========================================
        // 2. كتابة النص الديناميكي (مفصول حسب المنصة)
        // ==========================================
        const textStartY = 640;

        if (platform === 'facebook') {
            // 📘 تنسيق فيسبوك (سطرين لمنع خروج النص وتصغير الخط)
            const part1FB = "الروابط كاملة في "; 
            const part2FB = '"أول تعليق"';
            
            // السطر الأول (ديناميكي ليتوسط الشاشة بدقة)
            ctx.font = 'bold 45px "AlexandriaHack"'; // خط أصغر ومناسب
            const w1FB = ctx.measureText(part1FB).width;
            const w2FB = ctx.measureText(part2FB).width;
            let currentX_FB = (width / 2) + ((w1FB + w2FB) / 2);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#F8FAFC'; 
            ctx.fillText(part1FB, currentX_FB, textStartY - 20); 
            currentX_FB -= w1FB;
            
            ctx.fillStyle = '#EAB308'; 
            ctx.fillText(part2FB, currentX_FB, textStartY - 20); // الكلمة الذهبية

            // السطر الثاني (نص المشاركة)
            ctx.font = 'bold 38px "TajawalHack"';
            ctx.fillStyle = '#E2E8F0'; 
            ctx.textAlign = 'center';
            ctx.fillText("شارك المنشور 🔄 لتعود إليه لاحقاً وتفيد غيرك", width / 2, textStartY + 60);

        } else {
            // 📸 تنسيق إنستغرام (النص الأصلي)
            const part1IG = "علق بكلمة "; 
            const part2IG = '"أرباح"';
            const part3IG = " وراح أرسلك الدليل الكامل"; 
            const part4IG = "وكل الروابط في رسالة خاصة";

            ctx.font = '50px "AlexandriaHack"'; 
            ctx.textAlign = 'right';
            const w1 = ctx.measureText(part1IG).width; 
            const w2 = ctx.measureText(part2IG).width; 
            const w3 = ctx.measureText(part3IG).width;
            let currentX = (width / 2) + ((w1 + w2 + w3) / 2);

            ctx.fillStyle = '#F8FAFC'; ctx.fillText(part1IG, currentX, textStartY); currentX -= w1;
            ctx.fillStyle = '#EAB308'; ctx.fillText(part2IG, currentX, textStartY); currentX -= w2;
            ctx.fillStyle = '#F8FAFC'; ctx.fillText(part3IG, currentX, textStartY);
            
            ctx.textAlign = 'center'; 
            ctx.fillText(part4IG, width / 2, textStartY + 80);
        }

        // ==========================================
        // 3. رسم الأيقونات السفلية
        // ==========================================
        const iconY = 900; 
        ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 4; 
        
        if (platform === 'facebook') {
            ctx.fillStyle = '#F8FAFC'; ctx.font = '30px "TajawalHack"'; ctx.textAlign = 'center';
            ctx.fillText("↪️ مشاركة", width/2 - 200, iconY + 50);
            ctx.fillText("💬 تعليق", width/2, iconY + 50);
            ctx.fillText("👍 إعجاب", width/2 + 200, iconY + 50);
        } else {
            ctx.beginPath(); ctx.moveTo(width/2 - 260, iconY); ctx.lineTo(width/2 - 220, iconY); ctx.lineTo(width/2 - 220, iconY+50); ctx.lineTo(width/2 - 240, iconY+35); ctx.lineTo(width/2 - 260, iconY+50); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width/2 - 100, iconY+10); ctx.lineTo(width/2 - 60, iconY-10); ctx.lineTo(width/2 - 80, iconY+40); ctx.lineTo(width/2 - 90, iconY+20); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 80, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 240, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

            ctx.font = '24px "TajawalHack"'; ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'center';
            ctx.fillText("احفظه يمكن", width/2 - 240, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 240, iconY + 120);
            ctx.fillText("شاركه مع", width/2 - 80, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 80, iconY + 120);
            ctx.fillText("رأيك يهمني", width/2 + 80, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 80, iconY + 120);
            ctx.fillText("لايك واحد", width/2 + 240, iconY + 90);  ctx.fillText("ما يضر", width/2 + 240, iconY + 120);
        }
    }

    // ==========================================
    // الفوتر (معلومات الخبير بالنمط المالي)
    // ==========================================
    drawRoundedRect(ctx, 40, height - 130, 420, 100, 50, 'rgba(15, 23, 42, 0.5)', true, 'rgba(234, 179, 8, 0.2)');

    ctx.save();
    ctx.beginPath(); ctx.arc(400, height - 80, 35, 0, Math.PI * 2); ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
        ctx.drawImage(avatar, sx, sy, s, s, 365, height - 115, 70, 70);
    } catch (e) {}
    ctx.restore();

    ctx.textAlign = 'right'; 
    ctx.fillStyle = '#F8FAFC'; 
    ctx.font = '24px "AlexandriaHack"'; // اسمك بخط فخم
    ctx.fillText("غربي محمد الشريف", 340, height - 90);
    
    ctx.fillStyle = '#EAB308'; // المسمى الوظيفي بالذهبي
    ctx.font = '18px "TajawalHack"';
    ctx.fillText("خبير أتمتة واستشاري أعمال", 340, height - 60);

    const fileName = `business_${batchId}_${platform}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawBusinessRoadmapSlide;