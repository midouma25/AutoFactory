const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // 👈 أضف هذا السطر هنا لكي تعمل دالة جلب الصور
try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

// دالة تكسير النصوص (محدثة لدعم النصوص المختلطة)
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                // استخدام الدالة الجديدة لرسم السطر المكتمل
                fillMixedText(ctx, line.trim(), x, currentY, maxWidth);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        // استخدام الدالة الجديدة لرسم السطر الأخير
        fillMixedText(ctx, line.trim(), x, currentY, maxWidth);
        currentY += lineHeight;
    }
    return currentY;
}
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN; 
// 1. دالة التوليد عبر Pollinations (مجانية 100%، بدون توكن، ولا تنقطع أبداً)
async function generateImagePollinations(keyword) {
    console.log(`🎨 جاري توليد صورة لـ: ${keyword}...`);
    // نطلب من الذكاء الاصطناعي رسم العنصر على خلفية بيضاء نقية لتسهيل تفريغها
    const prompt = encodeURIComponent(`3d icon of ${keyword}, solid pure white background, highly detailed, high quality, isolated single object`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=800&nologo=true`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("⚠️ فشل التوليد:", error.message);
        return null;
    }
}

// 2. دالة السحر المحلي: تفريغ الخلفية البيضاء باستخدام Canvas (بدون API!)
async function makeWhiteTransparent(imageBuffer) {
    console.log(`✂️ جاري إزالة الخلفية البيضاء محلياً...`);
    const img = await loadImage(imageBuffer);
    
    // إنشاء لوحة مؤقتة لمعالجة بكسلات الصورة
    const tempCanvas = require('canvas').createCanvas(img.width, img.height);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // مسح كل بكسل لونه قريب من الأبيض لجعله شفافاً تماماً
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        // إذا كان البكسل شديد البياض، اجعل الشفافية (Alpha) تساوي 0
        if (r > 230 && g > 230 && b > 230) {
            data[i+3] = 0; 
        }
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas; // نرجع الـ Canvas المفرغ لطباعته مباشرة كصورة شفافة!
}


// 3. الدالة الرئيسية التي يطلبها كود الشريحة
async function fetchTransparentCoverImage(keyword) {
    // الخطوة الأولى: التوليد
    const generatedBuffer = await generateImageHF(keyword);
    
    if (!generatedBuffer) {
         console.log("⚠️ تم الرجوع للصورة الاحتياطية (التوليد فشل).");
         return null;
    }

    // الخطوة الثانية: إزالة الخلفية
    const transparentBuffer = await removeBackgroundHF(generatedBuffer);
    
    if (transparentBuffer) {
        console.log("✅ تمت العملية بنجاح! لدينا صورة شفافة.");
        return { buffer: transparentBuffer, isTransparent: true };
    } else {
        console.log("⚠️ فشلت الإزالة، سنستخدم الصورة كما هي بخلفيتها.");
        return { buffer: generatedBuffer, isTransparent: false };
    }
}


// دالة احترافية لرسم النصوص المختلطة (عربي/إنجليزي) بشكل سليم ومحصن
function fillMixedText(ctx, text, x, y, maxWidth) {
    ctx.save(); // حماية الإعدادات الأصلية للشريحة (مثل التوسيط)

    const parts = text.split(/([a-zA-Z0-9\-_]+)/);
    let totalWidth = 0;

    // حساب العرض الكلي لتوسيط النص بدقة
    for (let i = 0; i < parts.length; i++) {
        totalWidth += ctx.measureText(parts[i]).width;
    }

    // تحديد نقطة البداية (أقصى اليمين) لأننا نكتب في سياق عربي (من اليمين لليسار)
    let currentX = x + (totalWidth / 2);

    // 🔴 السر هنا: إجبار المحاذاة لليمين مؤقتاً داخل هذه الدالة فقط
    // لكي تعمل الحسابات الرياضية (currentX) بدقة تامة دون تداخل
    ctx.textAlign = 'right';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;

        const isEnglish = /[a-zA-Z0-9\-_]+/.test(part);
        const partWidth = ctx.measureText(part).width;

        ctx.save();
        ctx.direction = isEnglish ? 'ltr' : 'rtl';
        
        // رسم الجزء الحالي بحيث ينتهي عند currentX ويمتد يساراً
        ctx.fillText(part, currentX, y);
        ctx.restore();

        // تحريك نقطة النهاية لليسار بمقدار عرض الكلمة التي تم رسمها
        currentX -= partWidth;
    }

    ctx.restore(); // استرجاع الإعدادات الأصلية لتكمل الشريحة رسم باقي العناصر بشكل طبيعي
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15;
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
}

// 🌟 الدالة المفقودة: رسم الشارة التسويقية البارزة (3D Badge)
function draw3DBadge(ctx, text, x, y, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 80px "CairoBoldHack"';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 60;
    const paddingY = 40;
    
    // رسم الظل الداكن (البُعد الثالث)
    drawRoundedRect(ctx, x - (textWidth/2) - paddingX, y - 10, (textWidth + paddingX*2), 120 + 15, 30, '#064E3B', false);
    
    // رسم الواجهة المضيئة
    drawRoundedRect(ctx, x - (textWidth/2) - paddingX, y - 20, (textWidth + paddingX*2), 120, 30, bgColor, false);
    
    // رسم النص
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 40);
    ctx.restore();
} 



function drawMacWindow(ctx, x, y, width, height) {
    drawRoundedRect(ctx, x, y, width, height, 25, '#1E293B', true);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 25, y); ctx.lineTo(x + width - 25, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + 25);
    ctx.lineTo(x + width, y + 60); ctx.lineTo(x, y + 60);
    ctx.lineTo(x, y + 25); ctx.quadraticCurveTo(x, y, x + 25, y);
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; ctx.fill();

    const dotY = y + 30;
    ctx.beginPath(); ctx.arc(x + 35, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#EF4444'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 65, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#F59E0B'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + 95, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = '#10B981'; ctx.fill();
}

function drawDarkTechBackground(ctx, width, height) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#020617'); grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 800);
    glow.addColorStop(0, 'rgba(16, 185, 129, 0.15)'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let j = 0; j < height; j += 60) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke(); }
}

// دالة لتوليد صورة 3D فورية بالذكاء الاصطناعي (مجانية ولا تحتاج API Key)
async function fetchAiCoverImage(keyword) {
    console.log(`🎨 جاري توليد صورة 3D بالذكاء الاصطناعي لموضوع: ${keyword}...`);
    
    // هندسة الأوامر (Prompt Engineering) لإجبار الـ AI على رسم 3D بخلفية بيضاء
    const prompt = `3d illustration of ${keyword}, high quality, vibrant colors, modern tech style, isolated on pure white background`;
    
    // استخدام API التوليد المجاني
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data; // نعيد الصورة كـ Buffer
    } catch (error) {
        console.error("⚠️ فشل توليد الصورة بالذكاء الاصطناعي:", error.message);
        return null;
    }
}
// دالة لجلب صورة ديناميكية بناءً على الموضوع
// دالة هجينة مضادة للأعطال: (AI -> Pixabay -> Local)
async function fetchDynamicCoverImage(keyword) {
    console.log(`🎨 جاري محاولة توليد صورة 3D بالذكاء الاصطناعي لموضوع: ${keyword}...`);
    const prompt = `3d illustration of ${keyword}, high quality, vibrant colors, modern tech style, isolated on pure white background`;
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;

    try {
        // المحاولة 1: الذكاء الاصطناعي (نعطيه 15 ثانية كحد أقصى)
        const response = await axios.get(aiUrl, { 
            responseType: 'arraybuffer',
            timeout: 15000 
        });
        console.log('✅ تم توليد الصورة بالذكاء الاصطناعي بنجاح!');
        // نعيد الصورة كبيانات مع إشارة (isMultiply: true) لتفعيل خدعة إخفاء الخلفية
        return { buffer: response.data, isMultiply: true }; 
        
    } catch (error) {
        console.error(`⚠️ فشل الـ AI (${error.code}). جاري الانتقال للخطة ب (Pixabay)...`);
        
        // المحاولة 2: Pixabay (البديل الآمن)
        const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
        if (PIXABAY_API_KEY) {
            try {
                const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keyword)}&image_type=illustration&orientation=horizontal&per_page=3`;
                const pixabayRes = await axios.get(pixabayUrl, { timeout: 8000 });
                
                if (pixabayRes.data.hits && pixabayRes.data.hits.length > 0) {
                    const imgUrl = pixabayRes.data.hits[0].largeImageURL;
                    const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                    console.log('✅ تم جلب صورة بديلة من Pixabay بنجاح!');
                    // صور بيكساباي غالباً مفرغة، لا نحتاج خدعة الـ Multiply
                    return { buffer: imgResponse.data, isMultiply: false }; 
                }
            } catch (pixError) {
                console.error("⚠️ فشل جلب الصورة من Pixabay أيضاً.");
            }
        }
        
        return null; // سيؤدي هذا لتشغيل الصورة الاحتياطية المحلية
    }
}
async function drawAiRoadmapSlide(slide, totalSlides, batchId, platform = 'instagram', mainTopic = '') {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // توحيد حالة الحروف لتجنب أخطاء الذكاء الاصطناعي
    const slideType = slide.type ? slide.type.toLowerCase() : '';

    // 1. الخلفية الداكنة
    drawDarkTechBackground(ctx, width, height);

// 2. رسم شريط التقدم الزمني (Timeline)
    if (platform !== 'facebook') {
        const dotSpacing = 50; // وسعنا المسافة لتبدو أرقى
        const dotRadius = 8;
        const totalDotsWidth = (totalSlides - 1) * dotSpacing;
        const startCX = (width - totalDotsWidth) / 2;
        const dotsY = 70; 

        // رسم الخط الخلفي (الداكن)
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1E293B';
        ctx.beginPath();
        ctx.moveTo(startCX, dotsY);
        ctx.lineTo(startCX + totalDotsWidth, dotsY);
        ctx.stroke();

        // رسم الخط الأخضر (مستوى التقدم الحالي)
        const currentProgressWidth = (slide.slideNumber - 1) * dotSpacing;
        if (currentProgressWidth > 0) {
            ctx.strokeStyle = '#10B981';
            ctx.beginPath();
            ctx.moveTo(startCX, dotsY);
            ctx.lineTo(startCX + currentProgressWidth, dotsY);
            ctx.stroke();
        }

        // رسم المحطات (الدوائر) فوق الخط
        for(let i = 0; i < totalSlides; i++) {
            const cx = startCX + (i * dotSpacing);
            ctx.beginPath();
            ctx.arc(cx, dotsY, dotRadius, 0, Math.PI*2);
            
            if (i + 1 === slide.slideNumber) {
                // المحطة الحالية: خضراء مع توهج نيون
                ctx.fillStyle = '#10B981';
                ctx.shadowColor = '#10B981'; ctx.shadowBlur = 12;
                ctx.fill(); ctx.strokeStyle = '#10B981';
            } else if (i + 1 < slide.slideNumber) {
                // المحطات السابقة: خضراء مكتملة بدون توهج
                ctx.fillStyle = '#10B981'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#10B981';
            } else {
                // المحطات القادمة: داكنة وفارغة
                ctx.fillStyle = '#0F172A'; ctx.shadowColor = 'transparent';
                ctx.fill(); ctx.strokeStyle = '#334155';
            }
            ctx.stroke();
            ctx.shadowColor = 'transparent'; // إعادة ضبط الظل
        }
    }

    // ==========================================
    // 🎨 شريحة الخطاف (Hook - الصفحة الأولى)
    // ==========================================
if (slideType === 'hook') {
        // 1. خلفية بيضاء نقية مع ظل خفيف في الأسفل (كما في المثال)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0F172A'); 
        bgGrad.addColorStop(0.8, '#0F172A'); 
        bgGrad.addColorStop(1, '#0F172A'); 
        ctx.fillStyle = bgGrad; 
        ctx.fillRect(0, 0, width, height);

        // 2. زر الحفظ (Save the Post) في أعلى اليسار
        ctx.save();
        const saveX = 60; const saveY = 80; 
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#87898d'; ctx.fill(); // لون رمادي أنيق
        ctx.direction = 'ltr'; ctx.font = 'bold 22px "CairoBoldHack"'; ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE POST", saveX + 30, saveY);
        ctx.restore();

        // 3. رسم الصورة الشخصية المفرغة (The Hero)
        try {

            
            // حساب الأبعاد لجعل الصورة ضخمة ومتمركزة في النصف العلوي
            const heroW = 750; // عرض الصورة الشخصية
            const heroH = heroImage.height * (heroW / heroImage.width);
            const heroX = (width - heroW) / 2;
            const heroY = 150; // تبدأ من الأعلى قليلاً

            ctx.drawImage(heroImage, heroX, heroY, heroW, heroH);
        } catch(e) {
            console.log("⚠️ الصورة الشخصية المفرغة (my-hook-photo.png) غير موجودة.");
        }

// 4. تجهيز المسرح (مساحة فارغة للذكاء الاصطناعي)
        // تم إيقاف التوليد التلقائي هنا عمداً.
        // سيتم ترك المساحة فوق صورتك الشخصية فارغة لتقوم بدمج عنصر 3D لاحقاً عبر Gemini.

        
        // 5. العنوان العريض (الخطاف) في النصف السفلي
        // نستخدم خطاً أسود عريضاً جداً مع تظليل بعض الكلمات
        ctx.font = '900 80px "CairoBoldHack"'; 
        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'center'; 
        
        // نقطة بداية العنوان (تحت الصورة الشخصية)
        let textY = 850; 
        
        // الخدعة: يمكننا استخدام دالة رسم النصوص المختلطة التي برمجناها سابقاً، 
        // أو دالة wrapText العادية، مع إضافة لون مختلف لاسم الأداة (toolName)
        textY = wrapText(ctx, slide.title, width/2, textY, 950, 100); 

        // 6. زر السحب للبدء (نفس تصميم الصورة المرجعية تقريباً)
        const btnY = 1180;
        let actionText = "NEXT";
        
        ctx.save();
        ctx.font = 'bold 30px "CairoBoldHack"';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'right';
        ctx.fillText(actionText, width - 120, btnY + 10);
        
        // رسم أيقونة السهم داخل دائرة
        ctx.beginPath();
        ctx.arc(width - 70, btnY, 30, 0, Math.PI * 2);
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // رسم السهم
        ctx.beginPath();
        ctx.moveTo(width - 85, btnY);
        ctx.lineTo(width - 55, btnY);
        ctx.lineTo(width - 65, btnY - 10);
        ctx.moveTo(width - 55, btnY);
        ctx.lineTo(width - 65, btnY + 10);
        ctx.stroke();
        ctx.restore();
    }

    
    // ==========================================
    // شريحة الخطوة (Step)
    // ==========================================
    else if (slideType === 'step') {
        
        // زر الحفظ يظهر فقط في الخطوات
        ctx.save();
        const saveX = 60; const saveY = 80; 
        ctx.beginPath();
        ctx.moveTo(saveX, saveY - 14); ctx.lineTo(saveX + 18, saveY - 14);
        ctx.lineTo(saveX + 18, saveY + 16); ctx.lineTo(saveX + 9, saveY + 8);
        ctx.lineTo(saveX, saveY + 16); ctx.closePath();
        ctx.fillStyle = '#94A3B8'; ctx.fill();
        ctx.direction = 'ltr'; ctx.font = 'bold 22px "CairoBoldHack"'; ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText("SAVE THE POST", saveX + 30, saveY);
        ctx.restore();

        ctx.save();
        ctx.direction = 'ltr'; ctx.font = '280px "CairoBoldHack"'; ctx.fillStyle = '#10B981'; 
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)'; ctx.shadowBlur = 40;
        ctx.fillText(slide.slideNumber, 100, 300);
        ctx.shadowColor = 'transparent';
        const numWidth = ctx.measureText(slide.slideNumber).width;
        ctx.restore();

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
            ctx.font = '50px "CairoBoldHack"'; ctx.fillStyle = '#10B981'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(slide.toolName.charAt(0).toUpperCase(), toolStartX + logoSize/2, 180 + logoSize/2);
        }

        ctx.save();
        ctx.direction = 'ltr'; ctx.font = '90px "CairoBoldHack"'; ctx.fillStyle = '#F8FAFC'; 
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
// جدار حماية: نأخذ الكلمة الأولى فقط في حال هلوس الذكاء الاصطناعي وكتب جملة
        const safeToolName = slide.toolName ? slide.toolName.split(' ')[0] : 'Tool';
        ctx.fillText(safeToolName, toolStartX + logoSize + 30, 230, 580);
        ctx.restore();

        ctx.save();
        ctx.direction = 'rtl'; ctx.font = '45px "CairoBoldHack"';
        const titleWidth = ctx.measureText(slide.title).width;
        const badgeWidth = titleWidth + 80; const badgeHeight = 90;
        const badgeX = (width / 2) - (badgeWidth / 2); const badgeY = 380;
        
        drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 45, '#10B981', true);
        ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(slide.title, width / 2, badgeY + (badgeHeight / 2));
        ctx.restore();

        const windowX = 80; const windowY = 530; const windowW = 920; const windowH = 450;
        drawMacWindow(ctx, windowX, windowY, windowW, windowH);

        if (slide.explanation) {
            ctx.save();
            ctx.direction = 'rtl'; ctx.font = '35px "CairoRegularHack"'; ctx.fillStyle = '#F1F5F9'; ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 5;
            wrapText(ctx, slide.explanation, width / 2, windowY + 130, windowW - 120, 60); 
            ctx.restore();
        }
    } 
    // ==========================================
    // شريحة الختام (CTA)
    // ==========================================
    else if (slideType === 'cta') {
        const imgX = width / 2;
        const imgY = 320; 
        const imgRadius = 160; 

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX, imgY, imgRadius, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#1E293B'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.lineWidth = 10; ctx.strokeStyle = '#10B981'; ctx.stroke();
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
            const destSize = imgRadius * 2;
            ctx.drawImage(avatar, sx, sy, s, s, imgX - imgRadius, imgY - imgRadius, destSize, destSize);
        } catch (err) {}
        ctx.restore();
        
        ctx.font = '50px "CairoBoldHack"'; ctx.textAlign = 'right';

        let part1, part2, part3, part4;
        if (platform === 'facebook') {
            part1 = "الروابط كاملة في "; part2 = '"أول تعليق"';
            part3 = " 👇 شارك المنشور"; part4 = "لتعود إليه لاحقاً وتفيد غيرك ↪️";
        } else {
            part1 = "علق بكلمة "; part2 = '"فكرة"';
            part3 = " وراح أرسلك الدليل الكامل"; part4 = "وكل الروابط في رسالة خاصة";
        }

        const w1 = ctx.measureText(part1).width; const w2 = ctx.measureText(part2).width; const w3 = ctx.measureText(part3).width;
        let currentX = (width / 2) + ((w1 + w2 + w3) / 2);

        ctx.fillStyle = '#F8FAFC'; ctx.fillText(part1, currentX, 620); currentX -= w1;
        ctx.fillStyle = '#10B981'; ctx.fillText(part2, currentX, 620); currentX -= w2;
        ctx.fillStyle = '#F8FAFC'; ctx.fillText(part3, currentX, 620);
        ctx.textAlign = 'center'; ctx.fillText(part4, width / 2, 700);

        const iconY = 880; ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 4; 
        
        if (platform === 'facebook') {
            ctx.fillStyle = '#F8FAFC'; ctx.font = '30px "CairoBoldHack"'; ctx.textAlign = 'center';
            ctx.fillText("↪️ مشاركة", width/2 - 200, iconY + 50);
            ctx.fillText("💬 تعليق", width/2, iconY + 50);
            ctx.fillText("👍 إعجاب", width/2 + 200, iconY + 50);
        } else {
            ctx.beginPath(); ctx.moveTo(width/2 - 260, iconY); ctx.lineTo(width/2 - 220, iconY); ctx.lineTo(width/2 - 220, iconY+50); ctx.lineTo(width/2 - 240, iconY+35); ctx.lineTo(width/2 - 260, iconY+50); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width/2 - 100, iconY+10); ctx.lineTo(width/2 - 60, iconY-10); ctx.lineTo(width/2 - 80, iconY+40); ctx.lineTo(width/2 - 90, iconY+20); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 80, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(width/2 + 240, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

            ctx.font = '24px "CairoBoldHack"'; ctx.fillStyle = '#94A3B8'; ctx.textAlign = 'center';
            ctx.fillText("احفظه يمكن", width/2 - 240, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 240, iconY + 120);
            ctx.fillText("شاركه مع", width/2 - 80, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 80, iconY + 120);
            ctx.fillText("رأيك يهمني", width/2 + 80, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 80, iconY + 120);
            ctx.fillText("لايك واحد", width/2 + 240, iconY + 90);  ctx.fillText("ما يضر", width/2 + 240, iconY + 120);
        }
    }

    // ==========================================
    // الفوتر (تعديل الألوان للنمط الداكن)
    // ==========================================
    drawRoundedRect(ctx, 40, height - 130, 400, 100, 50, '#1E293B', true);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2;
    drawRoundedRect(ctx, 40, height - 130, 400, 100, 50, 'transparent', false);

    ctx.save();
    ctx.beginPath(); ctx.arc(380, height - 80, 35, 0, Math.PI * 2); ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2; const sy = (avatar.height - s) / 2;
        ctx.drawImage(avatar, sx, sy, s, s, 345, height - 115, 70, 70);
    } catch (e) {}
    ctx.restore();

// ------------------------------------------
    // الفوتر (مع إصلاح مشكلة تداخل اللغات)
    // ------------------------------------------
    ctx.textAlign = 'right'; 
    ctx.fillStyle = '#F8FAFC'; 
    ctx.font = '26px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 330, height - 90);
    
    ctx.fillStyle = '#94A3B8'; 
    ctx.font = '18px "CairoRegularHack"';
    // حل مشكلة RTL/LTR بتجنب دمج اللغات في سطر واحد بدون تنظيم
    ctx.fillText("خبير أتمتة وذكاء اصطناعي", 330, height - 60);

    const fileName = `roadmap_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiRoadmapSlide;