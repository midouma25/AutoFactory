require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // إضافة
const cloudinary = require('cloudinary').v2; // إضافة
const cron = require('node-cron');
const app = express();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.toLocaleString('ar-EG', { month: 'long' });
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// إعداد Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// متغيرات Meta API
const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّف إنستغرام الخاص بك
const VERSION = 'v20.0';

// ==========================================
// 🚀 الخدعة النهائية: تسجيل الخطوط بأسماء مركبة بدون أوزان
// ==========================================
try {
    // نعتمد تماماً على الملفات الموجودة في صورتك
    registerFont(path.join(__dirname, 'Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, 'Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
    registerFont(path.join(__dirname, 'Marhey-Bold.ttf'), { family: 'MarheyBoldHack' }); 
    console.log('✅ تم اختراق نظام الخطوط وتحميلها بنجاح قاطع!');
} catch (error) {
    console.log('⚠️ تحذير: فشل تحميل الخطوط. تأكد من أسماء الملفات.');
}

// دالة التفاف النص
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, y);
    return y;
}

// رسم المربعات بحواف دائرية (مع ظلال)
function drawRoundedRect(ctx, x, y, width, height, radius, withShadow = false) {
    if (withShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 35;
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
    ctx.fill();
    if (withShadow) ctx.shadowColor = 'transparent';
}

// ==========================================
// 🤖🤖 نظام الطيار الآلي (Multi-Agent Auto-Pilot)
// ==========================================

async function runAutoPilot() {
    console.log('\n🌟 [الطيار الآلي] استيقظ النظام للعمل...');
    
const niches = [
        "تطوير الويب وهندسة البرمجيات (Web Dev, Node.js, React, Python)",
        "الذكاء الاصطناعي، نماذج LLMs، وطرق استغلالها في المشاريع",
        "التعليق الصوتي المدمج بالذكاء الاصطناعي وهندسة الصوتيات وبرامجها",
        "أسرار وحيل سريعة في المونتاج (بشكل خفيف وغير معقد)",
        "التداول الكمي والخوارزمي (Quantitative Trading) باستخدام البرمجة",
        "تبسيط الخوارزميات المعقدة والرياضيات البرمجية بأسلوب سهل جداً",
        "عالم الهاردوير، تجميع الحواسيب، والمقارنات التقنية لقطع الـ PC",
        "ثقافة عامة تقنية، وحلول ذكية لمشاكل برمجية أو يومية شائعة",
        "منهجيات فعالة لدراسة اللغات البرمجية واللغة الإنجليزية التقنية",
        "تحفيز، انضباط يومي، وقصص نجاح للوصول إلى الأهداف التقنية",
        "صحة المبرمج: الموازنة بين البرمجة، الرياضة، الانضباط الجسدي والروتين",
        "التلعيب (Gamification) وأفكار مشاريع برمجية ممتعة ومبتكرة",
        "دمج البرمجة بالعالم المادي (IoT، تحليل الكاميرات، وتعديل الأجهزة)"
    ];
    const selectedNiche = niches[Math.floor(Math.random() * niches.length)];
    console.log(`🎯 [الوكيل الاستراتيجي] المجال المختار لليوم: ${selectedNiche}`);

    try {
        // 2. سؤال Groq عن الموضوع الرائج (Trending)
        const trendResponse = await groq.chat.completions.create({
            messages: [
                { 
                    role: 'system', 
                    content: `أنت مدير تسويق تقني خبير. أعطني فكرة واحدة محددة ورائجة (Trending) حالياً في مجال "${selectedNiche}" تصلح لتكون منشور كاروسيل تعليمي جذاب على إنستغرام.
                    التعليمات الصارمة: 
                    - لا تكتب أي مقدمات أو شروحات. 
                    - اكتب الفكرة في جملة واحدة فقط (مثال: "كيف تبني بوت تداول آلي في بايثون في 5 خطوات").` 
                }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9,
        });

        const trendingTopic = trendResponse.choices[0].message.content.trim();
        console.log(`🔥 [الوكيل الاستراتيجي] الموضوع الرائج الذي تم التقاطه: ${trendingTopic}`);
        console.log(`⚙️ [الوكيل الصانع] جاري الآن تحويل الفكرة إلى صور وتصميمات...`);

        // 3. إرسال الموضوع لـ API التوليد الذي بنيناه سابقاً
        // نستخدم axios للاتصال بالخادم الخاص بنا محلياً
        const generateRes = await axios.post(`http://localhost:${process.env.PORT || 5000}/api/generate-lesson`, {
            prompt: trendingTopic
        });

        const generatedData = generateRes.data;
        if (!generatedData.success) throw new Error("فشل توليد الصور");

        console.log(`✅ [الوكيل الصانع] تم تصميم ${generatedData.images.length} صور بنجاح.`);
        console.log(`🚀 [الطيار الآلي] جاري إرسال الصور إلى إنستغرام...`);

        // 4. إرسال الصور المولدة لـ API النشر
        const publishRes = await axios.post(`http://localhost:${process.env.PORT || 5000}/api/publish-lesson`, {
            images: generatedData.images,
            caption: generatedData.caption
        });

        if (publishRes.data.success) {
            console.log(`🎉 [النجاح المطلق] تم نشر الموضوع الرائج بنجاح! ID: ${publishRes.data.postId}`);
        }

    } catch (error) {
        console.error('❌ [خطأ في الطيار الآلي]:', error.message);
    }
}

// ⏰ جدولة المهام (Cron Job)
// هذا التعبير '0 20 * * *' يعني: نفذ المهمة كل يوم الساعة 20:00 (8 مساءً) بتوقيت السيرفر
cron.schedule('0 20 * * *', () => {
    console.log('⏰ حان الموعد المجدول للنشر اليومي!');
    runAutoPilot();
}, {
    scheduled: true,
    timezone: "Africa/Algiers" // تم ضبط التوقيت لضمان النشر بدقة في منطقتك
});

// يمكنك فك التعليق عن السطر بالأسفل إذا أردت تشغيل الطيار الآلي فوراً بمجرد تشغيل السيرفر (للاختبار)
// setTimeout(runAutoPilot, 3000);
// 🎨 المحرك البصري
async function generateAutoFactorySlide(slide, totalSlides, batchId, categoryBadge ) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // الخلفية والشبكة (Blueprint Grid)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);
    
    const glow = ctx.createRadialGradient(width/2, height/2, 100, width/2, height/2, 900);
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for(let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for(let i = 0; i < height; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    // ==========================================
    // الشريحة 1: الخطاف
    // ==========================================
if (slide.type === 'hook') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        
        // 1. صورة المصمم (البراند الشخصي) مصغرة في الأعلى
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.clip(); 
        try {
            const avatar = await loadImage(path.join(__dirname, 'profile.png'));
            const size = Math.min(avatar.width, avatar.height); 
            const sx = (avatar.width - size) / 2; 
            const sy = (avatar.height - size) / 2; 
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 60, 260 - 60, 120, 120);
        } catch (err) {}
        ctx.restore(); 

        // إطار أزرق ناعم حول الصورة المصغرة
        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 2. اسمك تحت الصورة المصغرة
        ctx.font = '26px "CairoBoldHack"'; 
        ctx.fillStyle = '#94A3B8';
        ctx.fillText("غربي محمد الشريف", width / 2, 365);

        // 3. شارة التصنيف المضيئة (Badge)
        const pillWidth = 200;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        drawRoundedRect(ctx, (width - pillWidth) / 2, 410, pillWidth, 45, 22);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.font = '20px "CairoBoldHack"'; 
        ctx.fillStyle = '#60A5FA';
        ctx.fillText(categoryBadge, width / 2, 440);

        // 4. العنوان الرئيسي الجذاب (قمنا بتنزيله للأسفل ليناسب الإضافات)
        ctx.font = '95px "CairoBoldHack"'; 
        ctx.fillStyle = '#F8FAFC';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        wrapText(ctx, slide.title, width / 2, 620, 900, 130);
        ctx.shadowColor = 'transparent';

        // 5. دعوة السحب 
        ctx.font = '40px "CairoRegularHack"'; 
        ctx.fillStyle = '#3B82F6';
        ctx.fillText("اسحب لتعرف السر 👈", width / 2, height - 130);
    }
    
    // ==========================================
    // الشرائح 2,3,4: المحتوى
    // ==========================================
    else if (slide.type === 'content') {
        ctx.save();
        ctx.font = '280px "CairoBoldHack"';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.textAlign = 'left';
        ctx.direction = 'ltr';
        ctx.fillText(`0${slide.slideNumber}`, 30, 260);
        ctx.restore();

        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        drawRoundedRect(ctx, 80, 70, 130, 50, 25);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.font = '22px "CairoBoldHack"';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`0${slide.slideNumber} / 0${totalSlides}`, 108, 103);
        ctx.restore();

        ctx.font = '28px "CairoBoldHack"';
        ctx.fillStyle = '#3B82F6';
        ctx.textAlign = 'right';
        ctx.fillText('AutoFactory ⚡', width - 80, 105);

        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.font = '72px "CairoBoldHack"';
        ctx.fillStyle = '#F8FAFC';
        const titleY = wrapText(ctx, slide.title, width - 80, 230, 850, 90);

        ctx.font = '40px "CairoRegularHack"';
        ctx.fillStyle = '#CBD5E1';
        const bodyY = wrapText(ctx, slide.content, width - 80, titleY + 70, 850, 60);

        // نافذة الكود
        const cardY = bodyY + 70;
        const cardHeight = height - cardY - 110;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 24, true);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
        dotColors.forEach((color, i) => {
            ctx.beginPath(); ctx.arc(120 + (i * 32), cardY + 30, 8, 0, Math.PI * 2);
            ctx.fillStyle = color; ctx.fill();
        });

        if (slide.codeSnippet) {
            ctx.save();
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
            ctx.font = '32px "Consolas", monospace';
            const lines = slide.codeSnippet.split('\n');
            let codeY = cardY + 110;

            lines.forEach(line => {
                if (line.trim().startsWith('#')) {
                    ctx.fillStyle = '#6A9955';
                } else if (/\b(print|def|for|in|return|if|else|elif|import)\b/.test(line)) {
                    ctx.fillStyle = '#569CD6';
                } else {
                    ctx.fillStyle = '#E2E8F0';
                }
                ctx.fillText(line, 130, codeY);
                codeY += 50;
            });
            ctx.restore();
        }

        // ✍️ الملاحظة الجانبية بخط اليد 
        if (slide.handwrittenNote) {
            ctx.save();
            ctx.translate(width - 150, cardY + cardHeight - 60);
            ctx.rotate(-15 * Math.PI / 180); 
            ctx.direction = 'rtl';
            ctx.textAlign = 'right';
            
            ctx.font = '45px "MarheyBoldHack"'; 
            ctx.fillStyle = '#FBBF24'; 
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 10;
            ctx.fillText(slide.handwrittenNote, 0, 0);
            
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.quadraticCurveTo(-30, -50, -60, -10);
            ctx.strokeStyle = '#FBBF24';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
        }
    }

    // ==========================================
    // الشريحة 5: الختام
    // ==========================================
    else if (slide.type === 'cta') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

// 1. رسم الظل الخلفي
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // 2. تفعيل ميزة القص (Clipping) لجعل الصورة دائرية
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.clip(); // أي شيء يُرسم بعد هذا السطر سيكون محصوراً داخل الدائرة

// 3. تحميل الصورة ورسمها باحترافية (بدون تشويه الأبعاد)
        try {
            const avatar = await loadImage(path.join(__dirname, 'profile.png'));
            
            // خوارزمية الاقتطاع المربع (Crop) للحفاظ على التناسب
            const size = Math.min(avatar.width, avatar.height); // أخذ أصغر بُعد لصنع مربع
            const sx = (avatar.width - size) / 2; // نقطة البداية الأفقية للتوسيط
            const sy = (avatar.height - size) / 2; // نقطة البداية العمودية للتوسيط

            // استخدام الدالة الموسعة: (الصورة, نقطة القص س, ص, عرض القص, طول القص, نقطة الرسم س, ص, عرض الرسم, طول الرسم)
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 110, 280 - 110, 220, 220);
            
        } catch (err) {
            console.log('⚠️ لم يتم العثور على صورة profile.png، سيتم ترك الدائرة فارغة.');
        }
        ctx.restore(); // إنهاء القص للعودة للرسم الطبيعي

        // 4. رسم الإطار الأزرق فوق الصورة لتبدو احترافية
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.font = '50px "CairoBoldHack"';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText("غربي محمد الشريف", width / 2, 460);

        ctx.font = '35px "CairoRegularHack"';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText("مهندس برمجيات ومطور أتمتة", width / 2, 520);

        ctx.font = '75px "CairoBoldHack"';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(slide.title, width / 2, 700);

        ctx.font = '40px "CairoRegularHack"';
        ctx.fillStyle = '#60A5FA';
        wrapText(ctx, slide.content, width / 2, 780, 900, 55); 

        // 💡 رسالة الختام بخط اليد
        ctx.save();
        ctx.translate(width / 2 + 350, 630);
        ctx.rotate(10 * Math.PI / 180);
        ctx.font = '45px "MarheyBoldHack"'; 
        ctx.fillStyle = '#F472B6'; 
        ctx.fillText("لا تنسَ الحفظ! 📍", 0, 0);
        ctx.restore();

        const btnY = 950;
        const btnWidth = 180;
        const btnHeight = 150;
        const gap = 30;
        const startX = (width - (4 * btnWidth + 3 * gap)) / 2;

        const actions = [
            { label: 'إعجاب', isPrimary: false },
            { label: 'رأيك', isPrimary: false },
            { label: 'شارك', isPrimary: false },
            { label: 'احفظ', isPrimary: true }
        ];

        actions.forEach((act, idx) => {
            const bx = startX + idx * (btnWidth + gap);
            ctx.fillStyle = act.isPrimary ? 'rgba(37, 99, 235, 0.9)' : 'rgba(30, 41, 59, 0.6)';
            drawRoundedRect(ctx, bx, btnY, btnWidth, btnHeight, 20, true);
            ctx.strokeStyle = act.isPrimary ? '#60A5FA' : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = '32px "CairoBoldHack"';
            ctx.fillStyle = act.isPrimary ? '#FFFFFF' : '#CBD5E1';
            ctx.fillText(act.label, bx + btnWidth / 2, btnY + 85);
        });
    }
// ==========================================
    // 🌟 بصمة العلامة التجارية (تظهر في أسفل كل الشرائح)
    // ==========================================
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.font = '22px "CairoBoldHack"';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'; // لون رمادي خافت جداً وشفاف كي لا يزعج القارئ
    ctx.fillText("غربي محمد الشريف © مهندس برمجيات", width / 2, height - 40);
    const fileName = `post_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, fileName), buffer);
    return fileName;
}

app.post('/api/generate-lesson', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'الرجاء تقديم وصف للدرس.' });

    try {
        console.log(`\n⏳ جاري التأليف والأتمتة بالذكاء الاصطناعي...`);

    const systemPrompt = `
        أنت خبير واستراتيجي في صناعة المحتوى الرقمي، تمتلك موسوعة معرفية شاملة.
        مهمتك هي إنشاء محتوى تعليمي وتثقيفي عالي القيمة، بأسلوب احترافي، جذاب، ومبسط.
        
        التعليمات الصارمة:
        1. اللغة: استخدم اللغة العربية الفصحى المعاصرة فقط. يُمنع استخدام الدارجة أو العبارات الركيكة.
        2. الإيجاز: المساحة البصرية محدودة، كن دقيقاً ومختصراً.
        3. تنوع المجالات: المحتوى قد يكون في (البرمجة، التداول، المونتاج، المعالجة الصوتية، الذكاء الاصطناعي، الأتمتة، تطوير الويب، أو حكم وتحفيز). تكيف بمرونة مع الموضوع.
        4. المرونة في الحجم: حدد عدد الشرائح المناسب لتغطية الموضوع بقوة (من 3 إلى 8 شرائح). لا تتقيد بـ 5 شرائح إلا إذا كان الموضوع يتطلب ذلك.

        هيكلة الشرائح:
        - الشريحة الأولى دائماً (type: "hook"): عنوان جذاب جداً يثير الفضول.
        - الشرائح الوسطى (type: "content"): عنوان فرعي + شرح + حقل "codeSnippet" (يحتوي كود، أو خطوات مرقمة، أو معادلة حسب المجال) + "handwrittenNote" (ملاحظة بخط اليد من 3 كلمات).
        - الشريحة الأخيرة دائماً (type: "cta"): عنوان يحفز على الحفظ، وسؤال للنقاش.

        ⚠️ داخل "codeSnippet"، استخدم علامات التنصيص الفردية (') فقط.

        رد بصيغة JSON حصراً بهذا الشكل (أضف شرائح المحتوى حسب الحاجة):
        {
          "caption": "نص المنشور (Caption) لإنستغرام مع الهاشتاجات...",
          "categoryBadge": "إيموجي وكلمتين لتصنيف الموضوع، مثال: 📈 أسرار التداول، 🎬 خدعة مونتاج، 💻 أتمتة الويب",
          "slides": [
            { "slideNumber": 1, "type": "hook", "title": "...", "content": "" },
            { "slideNumber": 2, "type": "content", "title": "...", "content": "...", "codeSnippet": "...", "handwrittenNote": "..." },
            { "slideNumber": N, "type": "cta", "title": "...", "content": "..." }
          ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.8,
            max_tokens: 950,
            response_format: { type: 'json_object' }
        });

        const lessonData = JSON.parse(chatCompletion.choices[0].message.content);
        const batchId = Date.now(); 
        const generatedImages = [];

        for (const slide of lessonData.slides) {
            const fileName = await generateAutoFactorySlide(
                slide, 
                lessonData.slides.length, 
                lessonData.categoryBadge, // 👈 تمرير الشارة هنا
                batchId
            );
            generatedImages.push(fileName);
        }
        res.json({ success: true, caption: lessonData.caption, slides: lessonData.slides, images: generatedImages });

    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});

// مسار النشر الجديد الذي سيستدعيه زر الواجهة
app.post('/api/publish-lesson', async (req, res) => {
    const { images, caption } = req.body;
    
    if (!images || images.length === 0) {
        return res.status(400).json({ error: 'لم يتم العثور على صور للنشر.' });
    }

    try {
        console.log('\n======================================');
        console.log('🚀 بدء دورة النشر من لوحة التحكم');
        console.log('======================================');
        
        // 1. الرفع إلى Cloudinary
        console.log('\n☁️ 1. جاري الرفع للسحابة...');
        let imageUrls = [];
        for (let i = 0; i < images.length; i++) {
            const imagePath = path.join(__dirname, images[i]);
            const uploadRes = await cloudinary.uploader.upload(imagePath, { 
                folder: 'AutoFactory_Carousel',
                format: 'jpg' 
            });
            imageUrls.push(uploadRes.secure_url);
            console.log(`   ✅ تم رفع الصورة ${i + 1}`);
        }

        console.log('⏳ استراحة 8 ثوانٍ لانتشار الروابط...');
        await new Promise(resolve => setTimeout(resolve, 8000));

        // 2. إنشاء حاويات Meta (بنظام الإنقاذ الهادئ)
        console.log('\n📦 2. إنشاء حاويات Meta...');
        let creationIds = [];
        for (let i = 0; i < imageUrls.length; i++) {
            let success = false;
            let attempts = 0; 
            
            while (!success && attempts < 4) {
                attempts++;
                try {
                    const itemRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
                        params: { image_url: imageUrls[i], is_carousel_item: true, access_token: TOKEN }
                    });
                    creationIds.push(itemRes.data.id);
                    success = true; 
                    console.log(`   ✅ حاوية الصورة ${i + 1} جاهزة`);
                } catch (err) {
                    if (attempts === 4) throw err; 
                    console.log(`   ⏳ فشل ${attempts}/4، ننتظر 15 ثانية...`);
                    await new Promise(resolve => setTimeout(resolve, 15000));
                }
            }
            if (i < imageUrls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 12000));
            }
        }

        // 3. دمج الألبوم
        console.log('\n📚 3. دمج الألبوم...');
        const carouselRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
            params: { media_type: 'CAROUSEL', children: creationIds.join(','), caption: caption, access_token: TOKEN }
        });

        // 4. النشر النهائي
        console.log('\n📢 4. إرسال أمر النشر...');
        const publishRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media_publish`, null, {
            params: { creation_id: carouselRes.data.id, access_token: TOKEN }
        });

        console.log('\n🎉 تم النشر بنجاح! ID:', publishRes.data.id);
        res.json({ success: true, postId: publishRes.data.id });

    } catch (error) {
        console.error('\n❌ خطأ في عملية النشر:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'فشل النشر بسبب قيود API.' });
    }
});


// ==========================================
// 🧪 مسار مختبر الفيروسية (Viral Idea Engineering)
// ==========================================
app.post('/api/engineer-idea', async (req, res) => {
    try {
        const { rawIdea } = req.body;
        console.log(`\n🧪 [API] هندسة فكرة خام: ${rawIdea}`);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const systemPrompt = `أنت مخرج إبداعي وخبير "Growth Hacking" لمنصات التواصل التقنية في ${currentYear}.
        مهمتك أخذ فكرة المستخدم العادية (والمملة أحياناً) وتحويلها إلى قنبلة تفاعل (Viral Trend) تناسب عقلية المبرمجين في ${currentYear}.
        
        الرد يجب أن يكون حصرياً بصيغة JSON صالحة فقط، بهذا الشكل:
        {
          "hook": "الخطاف: الجملة الافتتاحية المستفزة أو الجذابة جداً التي ستوقف التمرير",
          "presentation": "أسلوب التقديم: كيف نصممها؟ (مثال: شاشة منقسمة، سيناريو كوميدي، تحدي وقت، كود ضد كود)",
          "viralAngle": "الزاوية النفسية: لماذا سينجح هذا الطرح ويجعل الناس تعلق وتشارك؟"
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `قم بهندسة هذه الفكرة الخام وتحويلها لتريند: "${rawIdea}"` }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9,
            response_format: { type: "json_object" }
        });

        const aiResponse = chatCompletion.choices[0].message.content;
        const parsedData = JSON.parse(aiResponse);

        console.log(`✅ [نجاح] تم هندسة الفكرة بنجاح!`);
        res.json({ success: true, ...parsedData });

    } catch (error) {
        console.error('❌ خطأ في هندسة الفكرة:', error.message);
        res.status(500).json({ success: false, error: 'فشل في الاتصال بالذكاء الاصطناعي.' });
    }
});

// ==========================================
// 🧠 مسار تحليل التريندات (Trend Analyzer API)
// ==========================================
app.post('/api/analyze-trend', async (req, res) => {
    try {
        const { niche, isAuto } = req.body;
        console.log(`\n🔍 [API] طلب تحليل تريند للمجال: ${niche} | النمط التلقائي: ${isAuto}`);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: 'system', 
                    content: `أنت خبير استراتيجي في صناعة المحتوى التقني على إنستغرام.
                    معلومة حرجة جداً: نحن الآن في شهر ${currentMonth} من عام ${currentYear}. 
                    يجب أن تكون التريندات حديثة وتخص تقنيات وتحديثات عام ${currentYear} وما بعده. 
                    إياك وبشكل قاطع ذكر أو اقتراح أي تقنيات أو تواريخ قديمة مثل 2023 أو 2024.
                    يجب أن تعيد الرد حصرياً بصيغة JSON صالحة (Valid JSON) فقط، بدون أي نصوص أو مقدمات إضافية.` 
                },
                { 
                    role: 'user', 
                    content: `المجال المطلوب: "${niche}".\nالسياق: ${isAuto ? 'تم اختيار هذا المجال تلقائياً من الخوارزمية لتنويع المحتوى.' : 'تم اختيار هذا المجال يدوياً من قبل المستخدم.'}\n\nمهمتك:\n1. استخراج فكرة منشور واحدة فقط تكون "تريند" (Trending) وثورية في هذا المجال بناءً على معطيات عام ${currentYear}.\n2. كتابة مبرر مقنع (Reasoning) يشرح لماذا هذه الفكرة ستنجح اليوم وتحقق تفاعلاً عالياً.\n\nالرد يجب أن يكون مطابقاً لهذا القالب:\n{\n  "trend": "اكتب الفكرة الجذابة هنا في جملة واحدة",\n  "reasoning": "اكتب المبرر التحليلي هنا في جملتين كحد أقصى"\n}` 
                }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9, // رفعنا الحرارة قليلاً لزيادة الإبداع
            response_format: { type: "json_object" }
        });

        const aiResponse = chatCompletion.choices[0].message.content;
        const parsedData = JSON.parse(aiResponse);

        console.log(`✅ [نجاح] تم استخراج الفكرة: ${parsedData.trend}`);

        res.json({
            success: true,
            niche: niche,
            trend: parsedData.trend,
            reasoning: parsedData.reasoning
        });

    } catch (error) {
        console.error('❌ خطأ في تحليل التريند:', error.message);
        res.status(500).json({ success: false, error: 'فشل في الاتصال بالذكاء الاصطناعي أو تحليل الرد.' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 خادم AutoFactory يعمل على ${PORT}`));