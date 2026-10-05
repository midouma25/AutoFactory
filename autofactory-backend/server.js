require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // مجلد مؤقت لحفظ الصور المرفوعة
const stampStoryDesign = require('./templates/drawStorySlide'); // تأكد من مسار الملف الذي أنشأناه
const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // إضافة
const cloudinary = require('cloudinary').v2; // إضافة
const cron = require('node-cron');
const drawTerminalSlide = require('./templates/terminal');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const ffmpeg = require('fluent-ffmpeg');
const Lead = require('./Lead');
const Campaign = require('./models/Campaign'); // 👈 أضف هذا
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// ... (الاستدعاءات القديمة مثل express و groq-sdk)
const { GoogleGenerativeAI } = require("@google/generative-ai");
// 🌟 تشغيل محرك Gemini الثقيل (نستدعيه فقط عند الحاجة)
// ==========================================
// 🔄 موزع الحمل الذكي لمفاتيح Google Gemini
// ==========================================
const geminiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5
].filter(Boolean);

const getGeminiClient = () => {
    // اختيار مفتاح عشوائي لتوزيع الضغط على حساباتك الخمسة
    const randomKey = geminiKeys[Math.floor(Math.random() * geminiKeys.length)];
    return new GoogleGenerativeAI(randomKey);
};

const app = express();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.toLocaleString('ar-EG', { month: 'long' });
app.use(cors());
app.use(express.json());
const drawAiComparisonSlide = require('./templates/ai_comparison');
const drawTripleComparisonSlide = require('./templates/triple_comparison');
const drawAiRoadmapSlide = require('./templates/ai_roadmap'); // 👈 استدعاء رسام خرائط الطريق
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const drawBusinessRoadmapSlide = require('./templates/business_roadmap');


// إعداد Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// متغيرات Meta API
const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّف إنستغرام الخاص بك
const FB_PAGE_ID = '1356519727534543'; // 👈 أضف هذا
const VERSION = 'v20.0';

// ==========================================
// 🚀 الخدعة النهائية: تسجيل الخطوط بأسماء مركبة بدون أوزان
// ==========================================
try {
    // نعتمد تماماً على الملفات الموجودة في صورتك
    registerFont(path.join(__dirname, 'Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, 'Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
    registerFont(path.join(__dirname, 'Marhey-Bold.ttf'), { family: 'MarheyBoldHack' }); 
    registerFont(path.join(__dirname, 'Alexandria-Bold.ttf'), { family: 'AlexandriaHack' });
    registerFont(path.join(__dirname, 'Tajawal-Bold.ttf'), { family: 'TajawalHack' });
    console.log('✅ تم تحميل جميع الخطوط (بما فيها خطوط البيزنس) بنجاح!');
} catch (error) {
    console.log('⚠️ تحذير: فشل تحميل الخطوط. تأكد من أسماء الملفات.');
}
// جلب كل المفاتيح وتجاهل الفارغ منها بذكاء
const groqKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3
].filter(Boolean);

if (groqKeys.length === 0) {
    console.error("🚨 خطأ قاتل: لم يتم العثور على أي مفتاح Groq في ملف .env");
}

// إنشاء نسخة Groq لكل مفتاح
const groqClients = groqKeys.map(key => new Groq({ apiKey: key }));
let currentClientIndex = 0;

// هذه الدالة السحرية ستعطيك مفتاحاً مختلفاً في كل مرة يتم استدعاؤها!
const getGroqClient = () => {
    const client = groqClients[currentClientIndex];
    const usedKeyNumber = currentClientIndex + 1;
    
    // الانتقال للمفتاح التالي، وإذا وصلنا للأخير نعود للأول
    currentClientIndex = (currentClientIndex + 1) % groqClients.length;
    
    console.log(`[Load Balancer] 🔄 جاري إرسال الطلب باستخدام المفتاح رقم: ${usedKeyNumber}`);
    return client;
};
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    // فصل النص بناءً على الأسطر الجديدة التي يرسلها الذكاء الاصطناعي
    const paragraphs = text.split('\n');
    let currentY = y;

    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        // إضافة مسافة إضافية صغيرة بين الفقرات
        currentY += lineHeight + 10; 
    }
    return currentY;
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

async function generateAutoFactorySlide(slide, totalSlides, batchId, categoryBadge, templateStyle) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // توجيه الرسم حسب القالب (حالياً لدينا قالب واحد، وسنضيف البقية لاحقاً)
    if (templateStyle === 'terminal' || !templateStyle) {
        await drawTerminalSlide(ctx, width, height, slide, totalSlides, categoryBadge);
    }

// العودة إلى صيغة PNG المدعومة أصلياً والمستقرة
    const fileName = `post_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png'); // إزالة أي إشارة لـ jpeg
    
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

app.post('/api/generate-lesson', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'الرجاء تقديم وصف للدرس.' });

    try {
        console.log(`\n⏳ جاري التأليف والأتمتة بالذكاء الاصطناعي...`);

const systemPrompt = `
        أنت مهندس برمجيات محترف وأستاذ أكاديمي مبدع على إنستغرام لعام 2026.
        مهمتك كتابة درس تقني متكامل، واضح، ومتسلسل بطريقة بيداغوجية سليمة.
        
        ⚠️ تعليمات صارمة جداً لتوليد البيانات:
        1. التسلسل التعليمي: اشرح الأفكار خطوة بخطوة. لا تقفز للحلول المعقدة دون شرح الأساسيات أولاً.
        2. دسامة المحتوى: في شرائح المحتوى (content)، اكتب فقرة شرح غنية ودسمة (بين 30 إلى 50 كلمة) لكي لا تبدو الشريحة فارغة.
        3. الأكواد (codeSnippet): اكتب أمثلة برمجية واضحة ومتعددة الأسطر لملء الشاشة فنياً. استخدم (\\n) للأسطر الجديدة.
        4. في الشريحة الأخيرة (نوع cta): حقل "content" يجب أن يكون جملة قصيرة جداً (أقل من 8 كلمات).
        5. الرد يجب أن يكون حصرياً بصيغة JSON صالحة (Valid JSON).

        إليك الهيكل الدقيق:
        {
          "caption": "الكابشن الجاهز للنشر",
          "categoryBadge": "إيموجي وتصنيف (مثال: 🐍 أساسيات بايثون)",
          "templateStyle": "terminal",
          "slides": [
            { "slideNumber": 1, "type": "hook", "title": "عنوان الدرس بأسلوب جذاب", "content": "" },
            { "slideNumber": 2, "type": "content", "title": "المقدمة أو شرح الأساسيات", "content": "شرح وافٍ ومفهوم يمهد للدرس بطريقة سلسلة ومريحة للمبتدئين...", "codeSnippet": "مثال برمجي\\nسطر آخر", "handwrittenNote": "ملاحظة" },
            { "slideNumber": 3, "type": "content", "title": "التطبيق أو المستوى المتقدم", "content": "استكمال الشرح بشكل دسم ومفصل يشرح كيف تعمل الأكواد السابقة...", "codeSnippet": "مثال تطبيقي", "handwrittenNote": "ملاحظة" },
            { "slideNumber": "الرقم الأخير", "type": "cta", "title": "سؤال تفاعلي للجمهور", "content": "جملة واحدة قصيرة جداً!" }
          ]
        }
        `;

const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                {role: 'user', content: prompt }            ],
            model: 'llama-3.1-70b-versatile', // غيّرنا النموذج لنموذج أقوى بحدود مجانية ضخمة
            temperature: 0.7,
            max_tokens: 800, // وضعنا سقفاً إجبارياً هنا أيضاً
            response_format: { type: "json_object" }
        });

        const lessonData = JSON.parse(chatCompletion.choices[0].message.content);
        const batchId = Date.now(); 
        const generatedImages = [];

        for (const slide of lessonData.slides) {
            const fileName = await generateAutoFactorySlide(
                slide, 
                lessonData.slides.length, 
                lessonData.categoryBadge, // 👈 تمرير الشارة هنا
                batchId,
                lessonData.templateStyle
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

// ==========================================
// 🎬 مسار الاستوديو (Prompt Studio)
// ==========================================
app.post('/api/generate-content', async (req, res) => {
    try {
        const { mode, type, viralData, topic } = req.body;
        console.log(`\n🎬 [API] طلب إنتاج استوديو - النمط: ${mode === 'cinematic' ? 'سينمائي 🎥' : 'سريع ⚡'}`);

        let systemPrompt = '';
        let userPrompt = '';

    if (mode === 'cinematic') {
        systemPrompt = `أنت مهندس برمجيات خبير وصانع محتوى تعليمي محترف على إنستغرام لعام 2026.
            مهمتك كتابة درس تعليمي متكامل بناءً على "مخطط فيروسي"، ولكن يجب أن يكون الشرح واضحاً، متسلسلاً، ومفهوماً للمبرمجين بجميع مستوياتهم.
            
            ⚠️ تعليمات المحتوى (لتجنب الشرائح الفارغة والملخبطة):
            1. التسلسل المنطقي: ابدأ بتمهيد للمشكلة، ثم الشرح خطوة بخطوة، ثم الحل. لا تقفز للأفكار المعقدة فجأة.
            2. دسامة المحتوى: في شرائح المحتوى (content)، اكتب فقرة شرح غنية وواضحة (بين 30 إلى 50 كلمة). لا تجعل الشريحة فارغة! يجب أن تقدم قيمة حقيقية للمتابع.
            3. الأكواد (codeSnippet): اكتب أكواداً واقعية وواضحة (متعددة الأسطر لملء الشاشة بشكل أنيق). استخدم (\\n) لكسر الأسطر.
            4. الشريحة الأخيرة (cta): يجب أن تحتوي على جملة قصيرة جداً (أقل من 8 كلمات) لتشجيع التفاعل.
            
            يجب أن يكون الرد حصرياً بصيغة JSON صالحة، ويحتوي على 4 مفاتيح:
            {
              "caption": "الكابشن الجاهز للنشر مع الهاشتاجات.",
              "categoryBadge": "إيموجي وكلمتين لتصنيف الموضوع",
              "templateStyle": "اختر واحداً فقط: (terminal, quant, creator, board, blueprint, gym, versus)",
              "slides": [
                { "slideNumber": 1, "type": "hook", "title": "عنوان جذاب جداً يطرح المشكلة" },
                { "slideNumber": 2, "type": "content", "title": "شرح المفهوم أو المشكلة", "content": "فقرة غنية ومفصلة تشرح الفكرة بوضوح تام، استخدم أمثلة من الواقع البرمجي لتبسيط الفكرة...", "codeSnippet": "كود يوضح الفكرة\\nسطر آخر", "handwrittenNote": "ملاحظة" },
                { "slideNumber": 3, "type": "content", "title": "الحل أو التطبيق العملي", "content": "فقرة غنية أخرى تشرح الحل وتكمل الدرس بطريقة متسلسلة...", "codeSnippet": "كود الحل", "handwrittenNote": "ملاحظة" },
                { "slideNumber": "الرقم الأخير", "type": "cta", "title": "سؤال للنقاش", "content": "شاركنا رأيك في التعليقات!" }
              ]
            }`;

            userPrompt = `قم بإنتاج محتوى من نوع: ${type === 'carousel' ? 'كاروسيل (Carousel - 5 Slides)' : 'فيديو قصير (Reel)'}
            بناءً على هذا المخطط الفيروسي:
            - الخطاف (Hook): ${viralData.hook}
            - أسلوب التقديم البصري: ${viralData.presentation}
            - الزاوية النفسية: ${viralData.viralAngle}`;
        }  

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'qwen/qwen3.8-27b', // تأكد أن هذا هو الموديل الذي تستخدمه في مشروعك
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const aiResponse = chatCompletion.choices[0].message.content;
        const parsedData = JSON.parse(aiResponse);

        console.log(`✅ [نجاح] تم إنتاج المحتوى السينمائي!`);
        res.json({ success: true, content: parsedData });

    } catch (error) {
        console.error('❌ خطأ في توليد المحتوى بالاستوديو:', error.message);
        res.status(500).json({ success: false, error: 'فشل في الاتصال بالذكاء الاصطناعي.' });
    }
});


// ==========================================
// 🖨️ مسار الطباعة المباشرة من الاستوديو
// ==========================================
app.post('/api/print-studio', async (req, res) => {
    try {
        // استلام القالب من الواجهة
        const { slides, categoryBadge, templateStyle } = req.body; 
        
        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({ error: 'بيانات الشرائح غير صالحة للطباعة.' });
        }

        console.log(`\n🎨 بدء طباعة ${slides.length} شرائح بنمط (${templateStyle || 'terminal'})...`);
        const batchId = Date.now();
        const generatedImages = [];

        for (const slide of slides) {
            const fileName = await generateAutoFactorySlide(
                slide, 
                slides.length, 
                batchId,
                categoryBadge || '🔥 تريند سريع',
                templateStyle || 'terminal' // 👈 تمرير القالب هنا
            );
            generatedImages.push(fileName);
        }

        console.log(`✅ تم طباعة ${generatedImages.length} صور بنجاح!`);
        res.json({ success: true, images: generatedImages });

    } catch (error) {
        console.error('❌ خطأ في الطباعة المباشرة:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء طباعة الصور.' });
    }
});


// ==========================================
// ⚖️ مسار توليد قوالب المقارنات (The Expose)
// ==========================================
// ==========================================
// ⚖️ مسار توليد قوالب المقارنات (The Expose)
// ==========================================
// ==========================================
// ⚖️ مسار توليد قوالب المقارنات (مع الكابشن المزدوج الذكي)
// ==========================================
app.post('/api/generate-comparison', async (req, res) => {
    const { topic, slideCount, platform = 'instagram' } = req.body;
    const count = slideCount || 6; 

    if (!topic) return res.status(400).json({ error: 'الرجاء تقديم موضوع.' });

    try {
        console.log(`\n⚖️ جاري تصميم المقارنة المزدوجة لموضوع: ${topic}...`);

const systemPrompt = `
        أنت خبير تسويق فيروسي (Growth Hacker) لعام 2026. مهمتك صناعة كاروسيل مقارنة وكتابة وصف مخصص لكل منصة.
        
        ⚠️ قواعد اللغة (حاسمة وصارمة جداً):
        - يجب استخدام "لغة عربية فصحى معاصرة، بليغة، ومبسطة" (Modern Standard Arabic).
        - يُمنع منعاً باتاً وقاطعاً استخدام أي لهجة عامية محلية (مثل: دي، كده، مش، لسه، بتبكي، زفت، وغيرها).
        - الأسلوب يجب أن يكون احترافياً، غامضاً قليلاً، ومثيراً للاهتمام (Hook) ليناسب المحترفين والمبرمجين.
        
        ⚠️ استراتيجية الوصف (Captions):
        - igCaption (لإنستغرام): 
          1. ابدأ بجملة افتتاحية صادمة بالفصحى (Hook).
          2. سطران لشرح الفكرة باختصار وقوة.
          3. دعوة واضحة للتفاعل نصها: (اكتب كلمة "أدوات" في التعليقات لأرسل لك القائمة الكاملة والروابط فوراً عبر الرسائل).
          4. أضف 6 إلى 8 هاشتاجات تقنية ترند في النهاية (مثل: #ذكاء_اصطناعي #برمجة #أدوات_تقنية #تطوير_الويب ...).
          
        - fbCaption (لفيسبوك): 
          1. ابدأ بسؤال يثير الجدل والنقاش الفكري بين المهنيين (مثال: هل انتهى عصر العمل اليدوي؟).
          2. سرد حقيقة تقنية أو مقارنة توضح كيف تغيرت قواعد اللعبة.
          3. دعوة للتفاعل نصها: (جميع الروابط والأدوات المذكورة تجدونها في "أول تعليق" 👇. شاركونا آراءكم، هل تتفقون مع هذه المقارنة؟).
          4. أضف 3 إلى 5 هاشتاجات عامة.

        ⚠️ قواعد الشرائح:
        1. مقارنة عادلة، استخدم أسماء أدوات AI حقيقية وحديثة ضد أدوات كلاسيكية.
        2. لا تكرر الأدوات أبداً. استخرج الدومين الرسمي لكل أداة (مثال: openai.com).
        3. اربط الشرائح منطقياً بحقل "nextTeaser".
        4. الشريحة الأخيرة (رقم ${count}) يجب أن تدعو للتفاعل حصراً وتتضمن كلمة "أدوات".

        رد بصيغة JSON فقط:
        {
          "igCaption": "وصف الانستغرام هنا...",
          "fbCaption": "وصف الفيسبوك هنا...",
          "slides": [
            { "slideNumber": 1, "type": "comparison", "title": "لشرح الدروس؟", "badTool": "Khan Academy", "badToolDomain": "khanacademy.org", "goodTool": "NotebookLM", "goodToolDomain": "google.com", "nextTeaser": "لكتابة الكود؟" },
            // ... أكمل حتى الشريحة ${count} (الشريحة الأخيرة تكون type: cta)
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `الموضوع: ${topic}` }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const lessonData = JSON.parse(chatCompletion.choices[0].message.content);
        const batchId = Date.now(); 
        const generatedImages = { instagram: [], facebook: [] };

        const targetPlatforms = platform === 'both' ? ['instagram', 'facebook'] : [platform];

        for (const currentPlatform of targetPlatforms) {
            const platformBatchId = `${batchId}_${currentPlatform}`;
            for (const slide of lessonData.slides) {
                // ✅ الكود الجديد: تم تمرير المتغير topic للدالة
                const fileName = await drawAiComparisonSlide(slide, lessonData.slides.length, platformBatchId, currentPlatform, topic);
                generatedImages[currentPlatform].push(fileName);
            }
        }
        res.json({ 
            success: true, 
            igCaption: lessonData.igCaption,
            fbCaption: lessonData.fbCaption,
            images: generatedImages 
        });

    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});

// ==========================================
// 🚀 مسار النشر الشامل (الإنستغرام + الفيسبوك)
// ==========================================
app.post('/api/publish-omni', async (req, res) => {
    const { platform, images, igCaption, fbCaption } = req.body;
    
    try {
        console.log(`\n🚀 بدء دورة النشر لمنصة: ${platform}`);
        
// 1. رفع الصور للسحابة 
        console.log('☁️ 1. جاري الرفع للسحابة...');
        let imageUrls = { instagram: [], facebook: [] };
        const platformsToPublish = platform === 'both' ? ['instagram', 'facebook'] : [platform];

        for (const p of platformsToPublish) {
            for (const img of images[p]) {
                const uploadRes = await cloudinary.uploader.upload(path.join(__dirname, img), { 
                    folder: 'AutoFactory_Carousel',
                    format: 'jpg' // هذا السطر هو السحر الذي يحول الـ PNG السليم إلى JPG خفيف لإنستغرام
                });
                
                const url = uploadRes.secure_url; 
                imageUrls[p].push(url);
                console.log(`   ✅ تم الرفع: ${url}`);
            }
        }
        
        console.log('⏳ استراحة 5 ثوانٍ...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        let results = {};

        // 2. النشر على إنستغرام (مع نظام الإنقاذ الهادئ من ملفك القديم)
        if (platformsToPublish.includes('instagram')) {
            console.log('\n📱 جاري النشر على إنستغرام...');
            let creationIds = [];
            
            for (const [index, url] of imageUrls['instagram'].entries()) {
                let success = false;
                let attempts = 0; 
                let itemId = null;

                // 🧠 نظام الإنقاذ الهادئ: 4 محاولات لكل صورة
                while (!success && attempts < 4) {
                    attempts++;
                    try {
                        if (attempts > 1) {
                            console.log(`   🔄 إعادة المحاولة (${attempts}/4) للصورة ${index + 1}...`);
                        } else {
                            console.log(`   📦 جاري إرسال الصورة ${index + 1} لإنستغرام...`);
                        }
                        
                        const itemRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
                            params: { image_url: url, is_carousel_item: true, access_token: TOKEN }
                        });
                        
                        itemId = itemRes.data.id;
                        success = true; 
                        creationIds.push(itemId);
                        console.log(`   ✅ تم إنشاء حاوية للصورة ${index + 1} (ID: ${itemId})`);
                        
                    } catch (err) {
                        console.error(`   ⚠️ فشلت المحاولة ${attempts} للصورة ${index + 1}.`);
                        if (attempts === 4) { 
                            throw err; // ارمي الخطأ إذا استنفدنا جميع المحاولات الـ 4
                        }
                        
                        console.log('   ⏳ ننتظر 15 ثانية لتهدئة السيرفرات وتخزين الكاش قبل المحاولة مجدداً...');
                        await new Promise(resolve => setTimeout(resolve, 15000));
                    }
                }
                
                // استراحة 12 ثانية بين صورة وأخرى كما في كودك القديم
                if (index < imageUrls['instagram'].length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 12000));
                }
            }
            
            console.log('\n📦 جاري تجميع الصور في حاوية الكاروسيل...');
            const carouselRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
                params: { media_type: 'CAROUSEL', children: creationIds.join(','), caption: igCaption, access_token: TOKEN }
            });
            
            // إضافة استراحة لإنستغرام لمعالجة الكاروسيل قبل النشر
            console.log('⏳ إنستغرام يقوم الآن بمعالجة الحاوية، يرجى الانتظار 15 ثانية...');
            await new Promise(resolve => setTimeout(resolve, 15000));
            
            console.log('🚀 جاري إطلاق النشر النهائي...');
            const publishRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media_publish`, null, {
                params: { creation_id: carouselRes.data.id, access_token: TOKEN }
            });
            
            results.instagram = publishRes.data.id;
            console.log('✅ تم نشر إنستغرام بنجاح!');
        }

        // 3. النشر على فيسبوك (Facebook Page)
        if (platformsToPublish.includes('facebook')) {
            console.log('\n📘 جاري النشر على فيسبوك...');
            let attachedMedia = [];
            for (const url of imageUrls['facebook']) {
                const photoRes = await axios.post(`https://graph.facebook.com/${VERSION}/${FB_PAGE_ID}/photos`, null, {
                    params: { url: url, published: false, access_token: TOKEN }
                });
                attachedMedia.push({ media_fbid: photoRes.data.id });
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            const fbPublishRes = await axios.post(`https://graph.facebook.com/${VERSION}/${FB_PAGE_ID}/feed`, null, {
                params: { 
                    message: fbCaption, 
                    attached_media: JSON.stringify(attachedMedia),
                    access_token: TOKEN 
                }
            });
            results.facebook = fbPublishRes.data.id;
            console.log('✅ تم نشر فيسبوك بنجاح!');
        }

        res.json({ success: true, results });

    } catch (error) {
        const errorDetails = error.response ? error.response.data : (error.message || error);
        console.error('\n❌ خطأ نهائي في عملية النشر:', JSON.stringify(errorDetails, null, 2));
        res.status(500).json({ error: 'فشل النشر. راجع الـ Terminal للتفاصيل.' });
    }
});

// ==========================================
// 💡 مسار إلهام أفكار المقارنة الثلاثية (Viral Growth Edition)
// ==========================================
app.get('/api/suggest-comparison-topic', async (req, res) => {
    try {
        console.log('\n💡 جاري هندسة فكرة تريند شاملة للمقارنة الثلاثية...');
        
        const systemPrompt = `أنت خبير "Growth Hacker" وصانع محتوى فيروسي تقني لعام 2026.
        مهمتك إعطائي فكرة "موضوع" (Topic) واحد فقط لمقارنة ثلاثية (مبتدئ -> متوسط -> احترافي/خبير) أو (سيئ -> جيد -> أسطوري).
        الهدف هو جذب ملايين المشاهدات والتفاعلات من خلال استهداف اهتمامات الجمهور التقني الواسع (المبرمجين، الطلاب، صناع المحتوى، والباحثين عن الإنتاجية).
        الوصف يجب أن يكون دقيقاً، طويلاً نسبياً، ويشرح الفكرة بوضوح للذكاء الاصطناعي لكي يبني عليها المحتوى.

        ⚠️ اختر الفكرة عشوائياً وبشكل مبتكر من هذه المجالات الواسعة:
        1. مسارات ولغات البرمجة: (مثال: لغات تطوير الويب Full-stack، لغات تحليل البيانات، لغات بناء الذكاء الاصطناعي).
        2. أدوات المطورين: (محررات الأكواد، منصات الاستضافة، أتمتة المهام).
        3. الذكاء الاصطناعي التوليدي: (وكلاء AI، المحادثة، البحث، وتوليد الأكواد).
        4. صناعة المحتوى والمونتاج: (تحرير الفيديو، المؤثرات الحركية Motion Graphics، التعليق الصوتي، استنساخ الصوت).
        5. التعليم والتدريس: (أدوات وشروحات الرياضيات المتقدمة، تبسيط العلوم، تطبيقات تعلم اللغات الأجنبية).
        6. الإنتاجية وتنظيم الحياة: (إدارة المشاريع، تدوين الملاحظات، الجدولة الذكية للوقت).
        7. المال والأعمال: (أدوات التداول الكمي والتحليل المالي، منصات العمل الحر، إدارة المتاجر).
        8. الصحة والروتين للمبرمجين: (تطبيقات الجيم وتتبع التمارين والأوزان، إدارة الدايت والمكملات، الانضباط اليومي).

        أمثلة لردود "فيروسية" ممتازة:
        - "لغات البرمجة الأفضل لتطوير الويب وبناء تطبيقات كاملة (Full-stack)، من اللغات القديمة والمعقدة إلى مكتبات الجافاسكريبت الحديثة المطلوبة في سوق العمل."
        - "أفضل اللغات والأدوات للتحليل المالي والتداول الكمي (Quant Trading)، من استخدام الجداول العادية إلى لغات البرمجة المتخصصة في تحليل البيانات الضخمة."
        - "أدوات وتطبيقات المونتاج والموشن جرافيك، من التطبيقات الهاتفية البسيطة للمبتدئين إلى برامج الاستوديوهات الاحترافية."
        - "الأساليب والأدوات الحديثة لتعلم وإتقان اللغة الإنجليزية، من الحفظ التلقيني الممل إلى معسكرات الذكاء الاصطناعي التفاعلية."
        - "منصات تعليم وشرح الرياضيات للطلاب، من الطرق التقليدية إلى أدوات الذكاء الاصطناعي التفاعلية لحل المعادلات المعقدة."
        - "تطبيقات تتبع التمارين الرياضية وبناء العضلات، من التسجيل الورقي العشوائي إلى المدرب الشخصي المدعوم بالذكاء الاصطناعي."

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "topic": "اكتب الوصف التفصيلي الجذاب هنا"
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                // 👈 تم إضافة رسالة المستخدم لكي لا يرفض الموديل الطلب
                { role: 'user', content: 'اقترح لي فكرة تريند شاملة للمقارنة الثلاثية الآن.' }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.95, 
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(chatCompletion.choices[0].message.content);
        console.log(`✅ تم ابتكار فكرة: ${parsedData.topic}`);
        
        res.json({ success: true, topic: parsedData.topic });

    } catch (error) {
        console.error('❌ خطأ في جلب الفكرة:', error.message);
        res.status(500).json({ success: false, error: 'فشل استلهام الفكرة.' });
    }
});
 

// ==========================================
// 🚀 مسار توليد القالب الثلاثي المزدوج
// ==========================================
app.post('/api/generate-triple', async (req, res) => {
    const { topic, count, platform } = req.body; 

    try {
        console.log(`\n🤖 جاري توليد محتوى (قالب ثلاثي) عن: ${topic}`);

        const systemPrompt = `
        أنت خبير في إنشاء محتوى إنستغرام وفيسبوك التقني الفيروسي لعام 2026.
        بناءً على هذا الوصف التفصيلي للموضوع: "${topic}"
        المطلوب: توليد ${count} شرائح بنظام "المقارنة الثلاثية" (أداة سيئة للمبتدئين، أداة جيدة، منصة احترافية للخبراء).
        
        🚨🚨 شروط قاسية جداً لنجاح التصميم (إياك ومخالفتها):
        1. حقل "title": هذا الحقل سيطبع في المربع البرتقالي أعلى الصورة. **يجب أن يكون قصيراً جداً (من كلمة إلى 3 كلمات كحد أقصى)** لكي لا يفسد التصميم!
           - أمثلة صحيحة: "توليد الفيديوهات", "الصور الرمزية", "دراسة اللغات", "كتابة الأكواد", "الوكلاء الأذكياء".
           - ممنوع كتابة جمل طويلة هنا.
        2. الأدوات: يجب أن تكون أدوات حقيقية وموجودة. لا تكرر نفس الأداة في شرائح مختلفة أبداً.
        3. الدومين (Domain): استخرج الرابط الرسمي القصير لكل أداة (مثال: canva.com).

        رد بصيغة JSON فقط بهذا الهيكل الدقيق:
        {
          "caption": "اكتب هنا نص المنشور الجذاب مع الهاشتاجات المناسبة...",
          "slides": [
            {
              "slideNumber": 1,
              "type": "comparison",
              "title": "عنوان قصير جداً (1-3 كلمات)",
              "badTool": "اسم الأداة المبتدئة",
              "badToolDomain": "domain1.com",
              "goodTool": "اسم الأداة الجيدة",
              "goodToolDomain": "domain2.com",
              "proTool": "اسم الأداة الاحترافية",
              "proToolDomain": "domain3.com",
              "nextTeaser": "NEXT"
            },
            // ... (استمر حتى الشريحة ما قبل الأخيرة بنفس النمط) ...
            {
              "slideNumber": ${count},
              "type": "cta",
              "title": "", "badTool": "", "badToolDomain": "", "goodTool": "", "goodToolDomain": "", "proTool": "", "proToolDomain": "", "nextTeaser": ""
            }
          ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `ابدأ التوليد بناءً على الموضوع المعطى وبألقاب قصيرة جداً للشرائح.` }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const contentData = JSON.parse(chatCompletion.choices[0].message.content);
        const batchId = Date.now();
        
        let finalImages = { instagram: [], facebook: [] };

        if (platform === 'instagram' || platform === 'both') {
            for (const slide of contentData.slides) {
                // 🚀 لاحظ إضافة المتغير topic في نهاية القوس هنا
                const fileName = await drawTripleComparisonSlide(slide, count, batchId, 'instagram', topic);
                finalImages.instagram.push(fileName);
            }
        }

        if (platform === 'facebook' || platform === 'both') {
            for (const slide of contentData.slides) {
                // 🚀 وإضافته هنا أيضاً لنسخة فيسبوك
                const fileName = await drawTripleComparisonSlide(slide, count, batchId, 'facebook', topic);
                finalImages.facebook.push(fileName);
            }
        }

        const igCaption = contentData.caption;
        const fbCaption = contentData.caption + '\n\n🔗 روابط جميع المنصات المذكورة في أول تعليق 👇';

        res.json({
            success: true,
            images: finalImages,
            igCaption: igCaption,
            fbCaption: fbCaption
        });

    } catch (error) {
        console.error('❌ خطأ في القالب الثلاثي:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 💡 مسار إلهام أفكار المقارنة الثلاثية (Basic Edition - المطور ضد التكرار)
// ==========================================
app.get('/api/suggest-basic-topic', async (req, res) => {
    try {
        console.log('\n🎯 جاري جلب فكرة تريند بسيطة (بدون تكرار)...');
        
        // خدعة برمجية: توليد رقم عشوائي لحقنه في الطلب لكسر تكرار الذكاء الاصطناعي
        const randomSeed = Math.floor(Math.random() * 1000000);

        const systemPrompt = `أنت خبير محتوى تقني إبداعي. مهمتك إعطائي فكرة "واحدة فقط" لمقارنة ثلاثية بسيطة جداً ومباشرة.
        الهدف هو فكرة قصيرة ومألوفة للجمهور العام (طولها من كلمتين إلى 5 كلمات كحد أقصى).
        
        🚨 قواعد صارمة ضد التكرار:
        - إياك أن تكرر الأفكار الشائعة. أريد فكرة فريدة من نوعها في كل مرة.
        - اختر بشكل عشوائي جداً من أحد هذه المجالات: (لغات البرمجة، محررات الأكواد، أدوات المونتاج، الذكاء الاصطناعي للصوت/الصور/الفيديو، أدوات الـ UI/UX، تطبيقات الإنتاجية، أنظمة التشغيل، متصفحات الويب).

        أمثلة سريعة (لا تقم بنسخها أبداً، بل قِس عليها):
        - "لغات تطوير تطبيقات الموبايل"
        - "برامج هندسة وتعديل الصوت"
        - "أدوات الذكاء الاصطناعي للرسم"
        - "متصفحات الويب للمبرمجين"
        - "تطبيقات تدوين الملاحظات"

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "topic": "الفكرة القصيرة جداً هنا"
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                // تمرير الرقم العشوائي يجبر الموديل على إعطاء استجابة مختلفة تماماً كل مرة
                { role: 'user', content: `أعطني فكرة مقارنة ثلاثية بسيطة، قصيرة، وجديدة كلياً الآن. (مفتاح العشوائية: ${randomSeed})` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.98, // 👈 رفعنا الحرارة لأقصى درجة إبداع ممكنة
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(chatCompletion.choices[0].message.content);
        console.log(`✅ تم ابتكار فكرة بسيطة جديدة: ${parsedData.topic}`);
        
        res.json({ success: true, topic: parsedData.topic });

    } catch (error) {
        console.error('❌ خطأ في جلب الفكرة البسيطة:', error.message);
        res.status(500).json({ success: false, error: 'فشل استلهام الفكرة البسيطة.' });
    }
});
// ==========================================
// 🚀 مسار توليد أفكار خرائط الطريق (Step-by-Step Roadmaps)
// ==========================================
app.post('/api/suggest-roadmap-topic', async (req, res) => {
    try {
        const { topic } = req.body; // نأخذ الفكرة من الواجهة (مثال: "بناء روبوت تداول")

        const systemPrompt = `
        أنت خبير تقني محترف ومصمم محتوى تعليمي تسلسلي.
        مهمتك هي تقسيم موضوع المستخدم إلى "خريطة طريق" (Roadmap) عملية تتكون من 5 أو 6 خطوات متسلسلة بدقة.
        
        شروط توليد المحتوى:
        1. كل خطوة يجب أن تقترح "أداة تقنية"، "برنامج"، أو "لغة برمجة" محددة (مثل: Python, Vercel, Claude, Make.com).
        2. تجنب ذكر نفس الأداة في أكثر من خطوة.
        3. اكتب عنواناً صغيراً يعبر عن "دور" الخطوة (مثال: "العقل المدبر"، "تحليل البيانات"، "بيئة التطوير").
        4. اكتب شرحاً عملياً ومختصراً (جملة واحدة قوية) لما يجب فعله في هذه الخطوة.
        5. يجب أن يكون السرد تصاعدياً ومنطقياً (من الصفر حتى النتيجة النهائية).
        
        استخدم هيكل JSON التالي بالضبط:
        {
          "title": "عنوان جذاب للبوست (مثال: كيف تبني روبوت تداول في 5 خطوات)",
          "steps": [
            {
              "stepNumber": 1,
              "role": "دور الخطوة (مثال: التخطيط والهيكلة)",
              "toolName": "اسم الأداة (مثال: ChatGPT)",
              "description": "وصف الخطوة بوضوح وإيجاز."
            },
            ... (أكمل باقي الخطوات)
          ]
        }
        `;

        let userPrompt = "اقترح لي خريطة طريق تريند وشاملة الآن.";
        if (topic) {
            userPrompt = `قم بتوليد خريطة طريق عملية متسلسلة حول هذا الموضوع: ${topic}`;
        }

        console.log(`\n💡 جاري توليد خريطة طريق متسلسلة للموضوع: ${topic || 'فكرة عامة'}...`);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'qwen/qwen3.8-27b', // يمكنك تغيير الموديل إذا لزم الأمر
            temperature: 0.9,
            response_format: { type: "json_object" }
        });

// 🧹 استخراج JSON بقوة من أي مكان في النص (يتجاهل الثرثرة وعلامات Markdown)
        const rawContent = chatCompletion.choices[0].message.content;
        let cleanJson = "";

        try {
            // 1. محاولة التقاط ما بين علامات ```json و ```
            const jsonBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                cleanJson = jsonBlockMatch[1].trim();
            } else {
                // 2. إذا لم تكن هناك علامات، نبحث عن أول { وأخر }
                const jsonObjectMatch = rawContent.match(/\{[\s\S]*\}/);
                if (jsonObjectMatch) {
                    cleanJson = jsonObjectMatch[0].trim();
                } else {
                    throw new Error("لم يتم العثور على هيكل JSON صالح في الرد.");
                }
            }

            // الآن نقوم بفك التشفير بأمان تام
            const roadmapData = JSON.parse(cleanJson);
            
            console.log('✅ تم توليد وفك تشفير خريطة الطريق بنجاح!');
            
            // إرسال البيانات الناجحة إلى الواجهة الأمامية
            res.json(roadmapData);

        } catch (parseError) {
            console.error("❌ فشل ذريع في استخراج أو قراءة JSON:", parseError.message);
            console.error("النص الخام الذي أعطاه الذكاء الاصطناعي كان:\n", rawContent);
            return res.status(500).json({ error: 'الذكاء الاصطناعي أرجع تنسيقاً غير مفهوم.' });
        }

    } catch (error) {
        console.error('❌ خطأ في الاتصال بالذكاء الاصطناعي:', error.response?.status, error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' });
    }
});
// ==========================================
// 💡 مسار إلهامات خرائط الطريق (Roadmap Inspirations) - [مع رادار التريند اليومي]
// ==========================================
app.post('/api/inspire-roadmap', async (req, res) => {
    try {
        const { type } = req.body; 

        // 🎲 مصفوفة المجالات الشاملة للإلهام العادي والفيروسي
        const niches = [
            "تطوير الويب وهندسة البرمجيات (MERN, React, Node.js)",
            "التداول الكمي والخوارزميات (Python, Backtesting, Data Analysis)",
            "الذكاء الاصطناعي وأتمتة المهام (Make.com, AI Agents)",
            "الموشن جرافيك وتحرير الفيديو (Adobe After Effects, AI Tools)",
            "منهجيات تعلم اللغات والإنجليزية التقنية (برامج الانغماس)",
            "تعليم الرياضيات وأتمتة الجداول المدرسية (شرح تفاعلي, خوارزميات جدولة)",
            "روتين المبرمج الصحي (رفع الأثقال، المكملات الرياضية، التركيز الذهني)",
            "بناء منتجات SaaS وريادة الأعمال التقنية",
            "عالم الهاردوير (تجميع الـ PC) وصيانة الأجهزة",
            "الأمن السيبراني وحماية تطبيقات الويب"
        ];

        const selectedNiche = niches[Math.floor(Math.random() * niches.length)];
        let promptInstructions = "";
        
        if (type === 'viral') {
            promptInstructions = `أنت خبير Growth Hacking على إنستغرام لعام 2026.
            أعطني عنواناً فيروسياً واحداً فقط لـ "خريطة طريق" (Step-by-Step).
            يجب أن يخلق العنوان فضولاً شديداً (FOMO) ويوحي بحل سحري.
            ⚠️ المجال الإجباري: "${selectedNiche}".
            التعليمات الصارمة: لا تكتب أي مقدمات، لا تضع علامات تنصيص. اكتب العنوان فقط.`;
            
        } else if (type === 'trend') {
            // 🚀 النمط الجديد: رادار التريند اليومي
            const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
            
            promptInstructions = `أنت محلل بيانات (Trend Analyst) تقني وتعليمي.
            تاريخ اليوم هو: ${today}.
            مهمتك هي تحديد موضوع "رائج جداً" (Trending) يُحدث ضجة في مجتمعات المطورين أو المتعلمين هذا الأسبوع، وكتابة عنوان لـ "خريطة طريق" متسلسلة تشرح هذا التريند.
            
            يمكنك اختيار تريند يتعلق بـ:
            - مكتبة بايثون أو أداة تحليل بيانات انفجرت شعبيتها مؤخراً.
            - تحديث ثوري في أطر عمل الويب (React, Node.js, Express).
            - أداة ذكاء اصطناعي جديدة غيرت قواعد اللعبة في تحرير الفيديو (After Effects).
            - تطبيق أو منهجية حديثة جداً لاكتساب اللغة الإنجليزية بسرعة.
            
            أمثلة للنمط:
            - "خريطة طريق لإتقان مكتبة الـ AI الجديدة التي يتحدث عنها الجميع في بايثون اليوم."
            - "كيف تستغل تحديث React الأخير لبناء تطبيقاتك في 5 خطوات."
            
            التعليمات الصارمة: لا تكتب أي مقدمات، لا تضع علامات تنصيص. اكتب العنوان فقط.`;
            
        } else {
            promptInstructions = `أنت أستاذ أكاديمي ومهندس محترف.
            أعطني عنواناً تعليمياً وعملياً واحداً فقط لـ "خريطة طريق" (Step-by-Step) تفيد المتابعين في التطبيق المباشر.
            ⚠️ المجال الإجباري: "${selectedNiche}".
            التعليمات الصارمة: لا تكتب أي مقدمات، لا تضع علامات تنصيص. اكتب العنوان بصيغة دليل أو خطوات.`;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: promptInstructions },
                { role: 'user', content: "أعطني العنوان الآن بناءً على التعليمات المحددة." }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: type === 'trend' ? 0.9 : 0.8, // حرارة أعلى للتريند لزيادة الإبداع
        });

        const idea = chatCompletion.choices[0].message.content.trim().replace(/["'*]/g, "");
        
        console.log(`✨ تم توليد إلهام خريطة طريق (${type}):`, idea);
        res.json({ success: true, idea });

    } catch (error) {
        console.error('❌ خطأ في جلب الإلهام:', error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإلهام.' });
    }
});

// ==========================================
// 🗺️ مسار توليد وتصميم خرائط الطريق (Roadmap Generator)
// ==========================================
app.post('/api/generate-roadmap', async (req, res) => {
    const { topic, platform, slideCount } = req.body;
    const count = slideCount || 6; // الافتراضي 6 شرائح

    if (!topic) return res.status(400).json({ error: 'الرجاء تقديم موضوع.' });

    try {
        console.log(`\n🗺️ جاري تفكيك وتصميم خريطة طريق لموضوع: ${topic} بعدد (${count}) شرائح...`);

const systemPrompt = `
        أنت خبير 'Growth Hacking' تقني واستشاري ذكاء اصطناعي محترف لعام 2026.
        مهمتك تصميم "خريطة طريق" (Roadmap) عملية، سريعة، ومصممة لتكون "فيروسية" (Viral) وتنتشر كالفيضان.
        
        ⚠️ كسر القيود (العدد الديناميكي للشرائح):
        لا تتقيد بعدد ثابت من الشرائح! قم بتقسيم الدرس إلى العدد الذي يراه عقلك مناسباً لتغطية الموضوع باحترافية تامة (من 5 إلى 15 شريحة، أو أكثر إذا تطلب الأمر ذلك) لضمان عدم وجود حشو، مع تغطية كل الخطوات اللازمة.
        
        🔥 أسرار الانتشار (قواعد صارمة جداً إياك مخالفتها):
        1. شريحة الخطاف (hook) (الشريحة رقم 1):
           - العنوان (title): يجب أن يكون صادماً ويثير الفضول (5-9 كلمات). 🚨 تحذير صارم: يجب أن يحتوي العنوان صراحةً على "الكلمة المفتاحية" للتقنية، ويجب أن يربط هذه التقنية بـ "المال الذكي" (مثل: بناء منتج SaaS مربح، رفع الدخل كمستقل، أو توفير التكاليف للشركات). إياك واستخدام عبارات الثراء السريع الرخيصة! استخدم أسلوباً احترافياً للمطورين ورواد الأعمال.
           - الوصف (explanation): جملة تشويقية سيكولوجية تدفع المتابع للسحب فوراً لمعرفة السر العملي (12 كلمة كحد أقصى).

        2. شرائح الخطوات (step) (باقي الشرائح في الوسط):
           - اسم الأداة (toolName): 🚨 حرج جداً 🚨 يجب أن يكون "كلمة واحدة فقط" وبدون فلسفة (اكتب React وليس React.js / اكتب Node وليس Node+Express).
           - الوصف (explanation): لا تعطني تعريفاً مملاً! أعطني "الزبدة والفائدة العملية" في جملة واحدة قوية (15 كلمة كحد أقصى).
           - الدومين (toolDomain): استخرج الدومين الرسمي للأداة لنجلب اللوجو (مثال: react.dev).

        3. شريحة الختام (cta) (الشريحة الأخيرة دائماً): 
           - يجب أن تكون الشريحة الأخيرة دائماً وأساساً من نوع "cta".
        
        ⚠️ استراتيجية الوصف (Captions):
        - igCaption (لإنستغرام): 
          1. ابدأ بجملة افتتاحية صادمة.
          2. سطران لشرح الفكرة باختصار وقوة.
          3. دعوة واضحة للتفاعل نصها: (اكتب كلمة "دليل" في التعليقات لأرسل لك الروابط والخطوات كاملة عبر الرسائل).
          4. أضف 6 إلى 8 هاشتاجات تقنية ترند في النهاية.
          
        - fbCaption (لفيسبوك): 
          1. ابدأ بسؤال يثير النقاش.
          2. سرد حقيقة تقنية أو تلخيص للخطوات.
          3. دعوة للتفاعل نصها: (جميع الروابط والأدوات المذكورة تجدونها في "أول تعليق" 👇. شاركونا آراءكم!).
          4. أضف 3 إلى 5 هاشتاجات عامة.

        4. تأكد بنسبة 1000% أن الرد هو JSON صالح (Valid JSON) تماماً.
        
        رد بصيغة JSON فقط بهذا الهيكل الدقيق:
        {
          "igCaption": "وصف إنستغرام هنا...",
          "fbCaption": "وصف فيسبوك هنا...",
          "slides": [
            {
              "slideNumber": 1,
              "type": "hook",
              "title": "عنوان فيروسي خاطف للأنظار",
              "searchKeyword": "3d programming laptop",
              "toolName": "",
              "toolDomain": "",
              "explanation": "وصف نفسي مشوق يسحب القارئ.",
              "nextTeaser": "اسحب للبدء 👉"
            },
            {
              "slideNumber": 2,
              "type": "step",
              "title": "اسم الخطوة العملية",
              "toolName": "كلمة_واحدة_فقط",
              "toolDomain": "domain.com",
              "explanation": "فائدة الأداة العملية والسرية في جملة مختصرة وقوية.",
              "nextTeaser": "الخطوة التالية؟"
            },
            {
              "slideNumber": 99,
              "type": "cta",
              "title": "الختام",
              "toolName": "",
              "toolDomain": "",
              "explanation": "",
              "nextTeaser": ""
            }
          ]
        }`;



const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `الموضوع: ${topic}` }
            ],
            model: 'qwen/qwen3.8-27b', // استخدم هذا النموذج فهو ممتاز ويدعم نصوصاً أطول
            max_tokens: 6000, // 👈 قمنا برفع الحد الأقصى بشكل كبير جداً لمنع الانقطاع
            temperature: 0.7,
            response_format: { type: "json_object" } // 👈 أضفنا هذا لضمان إرجاع JSON
        });

// 🧹 استخراج JSON بقوة من أي مكان في النص
        const rawContent = chatCompletion.choices[0].message.content;
        let cleanJson = "";
        let roadmapData;

        try {
            const jsonBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                cleanJson = jsonBlockMatch[1].trim();
            } else {
                const jsonObjectMatch = rawContent.match(/\{[\s\S]*\}/);
                if (jsonObjectMatch) {
                    cleanJson = jsonObjectMatch[0].trim();
                } else {
                    throw new Error("لم يتم العثور على هيكل JSON صالح في الرد.");
                }
            }

            roadmapData = JSON.parse(cleanJson);
            
        } catch (parseError) {
            console.error('❌ فشل في فك تشفير JSON. الذكاء الاصطناعي أرسل صيغة خاطئة:\n', rawContent);
            return res.status(500).json({ error: 'الذكاء الاصطناعي أنتج بيانات غير صالحة. حاول مرة أخرى.' });
        }
// --- إضافة البرومبت السحري ---
        // استبدل req.body.topic بالمتغير الذي يحمل اسم موضوعك الأساسي في مسارك
        const topicForPrompt = req.body.topic || "الموضوع المذكور في الشريحة"; 

const magicPrompt = `
إليك صورة غلاف لمنشور كاروسيل (Carousel) غير مكتملة بخلفية داكنة (Dark Mode). 
موضوع المنشور هو: "${topicForPrompt}".

مهمتك هي العمل كخبير دمج وتصميم ثلاثي الأبعاد (3D Artist & Compositor):
1. قم بتوليد عنصر 3D أيقوني، فخم، وحديث يعبر بدقة عن هذا الموضوع.
2. يجب أن يكون العنصر 3D معزولاً ومركّزاً ببراعة في "المساحة الفارغة" الموجودة في منتصف الصورة.
3. **قواعد صارمة جداً لتناسب الوضع الداكن:**
   - حافظ على لون الخلفية الداكن الأصلي (لا تقم بتفتيحه أو إضافة سماء أو خلفيات معقدة).
   - اجعل إضاءة العنصر الـ 3D (Lighting) تتناسب مع البيئة الداكنة لتبدو سينمائية وجذابة.
   - أضف ظلالاً أرضية (Drop Shadow) خفيفة أو توهجاً (Glow) حول المجسم ليفصله عن الخلفية الداكنة باحترافية.
   - لا تقم بتغيير، مسح، أو تشويه أي نص موجود في الصورة أو صورتي الشخصية الموجودة بالأسفل.
`;
// ... (داخل مسار /api/generate-roadmap)
        console.log("\n✨ ======================================= ✨");
        console.log("🎨 [البرومبت السحري لإكمال الشريحة الأولى عبر Gemini]:");
        console.log(magicPrompt);
        console.log("✨ ======================================= ✨\n");
        const batchId = Date.now(); 
        
        // 🚀 تعديل: يجب أن نرسل كائناً يحتوي على مصفوفتين (واحدة للفيسبوك وأخرى للإنستغرام) 
        // لتطابق الهيكل الذي تتوقعه الواجهة الأمامية (RoadmapLab.jsx)
        const generatedImages = { instagram: [], facebook: [] };

        // تحديد المنصات المطلوبة
        const targetPlatforms = platform === 'both' ? ['instagram', 'facebook'] : [platform];

        // حلقة تكرار للمنصات
        for (const currentPlatform of targetPlatforms) {
            const platformBatchId = `${batchId}_${currentPlatform}`;
            
            // حلقة تكرار لرسم الشرائح الخاصة بكل منصة
            for (const slide of roadmapData.slides) {
                const fileName = await drawAiRoadmapSlide(
                    slide, 
                    roadmapData.slides.length, 
                    platformBatchId, 
                    currentPlatform, 
                    topic
                );
                
                // إضافة الصورة للمنصة المناسبة
                generatedImages[currentPlatform].push(fileName);
            }
        }

console.log(`✅ تم تصميم شرائح خريطة الطريق بنجاح!`);
        
        // إرسال البيانات للواجهة: نرسل وصفي المنصتين والبرومبت السحري مع الصور
        res.json({ 
            success: true, 
            igCaption: roadmapData.igCaption, // 👈 استخراج وصف إنستغرام
            fbCaption: roadmapData.fbCaption, // 👈 استخراج وصف فيسبوك
            magicPrompt: magicPrompt, 
            images: generatedImages 
        });

    } catch (error) {
        console.error('❌ خطأ في توليد خريطة الطريق:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});

// ==========================================
// 💰 مسار 1: إلهام خرائط طريق الأعمال (مصفوفة الأفكار اللانهائية)
// ==========================================
app.get('/api/suggest-business-roadmap', async (req, res) => {
    try {
        console.log('\n🎰 جاري تدوير عجلة الأفكار التجارية اللانهائية...');

        // 1. مصفوفة المجالات الشاملة (كل تخصصاتك)
        const niches = [
            "تطوير البرمجيات (تطبيقات ويب، موبايل، أو ديسكتوب)",
            "برمجة الألعاب ومحركات 3D",
            "الذكاء الاصطناعي ووكلاء الأتمتة المستقلين (AI Agents)",
            "التجارة الإلكترونية، دروبشيبينغ، أو التجارة المحلية",
            "التعليق الصوتي والهندسة الصوتية (التقليدي أو عبر استنساخ الصوت بالـ AI)",
            "المونتاج، الموشن جرافيك، وصناعة المحتوى المرئي (بأدوات AI)",
            "التداول الخوارزمي، الفوركس، وتطوير بوتات الخيارات الثنائية (Binary Options)",
            "بناء منتجات الـ SaaS والـ Micro-SaaS",
            "الربح من الإنترنت (المنتجات الرقمية والعمل الحر عالي القيمة)",
            "تعلم اللغات الأجنبية (الإنجليزية/اليابانية) واستغلالها في الترجمة التقنية",
            "اقتناص فرص الهجرة، العمل عن بعد، وتأشيرات الـ Digital Nomad"
        ];

        // 2. مصفوفة نماذج الربح السلبي والتجاري
        const monetizationModels = [
            "بيع اشتراكات شهرية (MRR) للعملاء",
            "بيع خدمات عالية القيمة (High-Ticket Services) بأسعار تبدأ من 1000$",
            "تحقيق دخل سلبي تام (Passive Income) يعمل أثناء النوم",
            "بناء أصول رقمية وبيعها كقوالب أو سكريبتات جاهزة",
            "اقتطاع نسبة (عمولة) من أرباح العملاء عبر تقليل تكاليفهم"
        ];

        // 3. مصفوفة الزوايا التسويقية (الـ Hook النفسي)
        const psychologicalAngles = [
            "استهداف المبتدئين للوصول لأول 1000$ بأسرع وقت",
            "أتمتة عملية معقدة جداً لتقليل الجهد البشري بنسبة 90%",
            "دمج مهارتين مختلفتين لخلق خدمة لا منافس لها في السوق",
            "استغلال ثغرة أو تريند تقني جديد قبل أن ينتبه له الجميع",
            "تحويل مهارة يدوية مملة إلى آلة طباعة أموال تعمل آلياً"
        ];

        // السحب العشوائي
        const randomNiche = niches[Math.floor(Math.random() * niches.length)];
        const randomModel = monetizationModels[Math.floor(Math.random() * monetizationModels.length)];
        const randomAngle = psychologicalAngles[Math.floor(Math.random() * psychologicalAngles.length)];

        const systemPrompt = `أنت العقل المدبر لأكبر شركات التقنية ومستشار نمو (Growth Hacker) أسطوري.
        لقد اخترت لك هذا المزيج العشوائي لبناء فكرة خريطة طريق تقنية/تجارية:
        - المجال: ${randomNiche}
        - نموذج الربح: ${randomModel}
        - الزاوية التسويقية: ${randomAngle}

        المطلوب:
        اكتب فكرة موضوع "خارقة للعادة" و"مغرية جداً" لخريطة طريق من 6 خطوات.
        الفكرة يجب أن تكون جملة واحدة دسمة، تشرح ماذا سنبني؟ وكيف سنربح منه؟
        اجعلها تبدو كأنها "سر خطير" أو "استراتيجية حصرية" تدر المال.
        
        أمثلة سابقة للأسلوب المطلوب:
        - "بناء بوت تداول خوارزمي بـ Python يحلل سيولة الفوركس، وتأجيره للمتداولين المبتدئين باشتراك شهري 100$."
        - "استنساخ الأصوات بالـ AI لأتمتة قنوات يوتيوب أجنبية بالكامل، وتحقيق دخل سلبي من إعلانات أدسنس دون التحدث بكلمة."
        
        رد بصيغة JSON فقط بهذا الهيكل:
        { "topic": "الفكرة الجشعة والمغرية هنا" }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'أعطني فكرة المليون دولار القادمة.' }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.95, // حرارة عالية للإبداع والجنون في الأفكار
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(chatCompletion.choices[0].message.content);
        console.log(`✅ فكرة جديدة ملهمة: ${parsedData.topic}`);
        res.json({ success: true, topic: parsedData.topic });

    } catch (error) {
        console.error('❌ خطأ في جلب الفكرة التجارية:', error.message);
        res.status(500).json({ success: false, error: 'فشل استلهام الفكرة.' });
    }
});

// ==========================================
// 💼 مسار 2: توليد ورسم خريطة الأرباح (Business Roadmap)
// ==========================================
app.post('/api/generate-business-roadmap', async (req, res) => {
    const { topic, slideCount, platform = 'instagram' } = req.body;
    const count = slideCount || 6; 

    if (!topic) return res.status(400).json({ error: 'الرجاء تقديم موضوع.' });

    try {
        console.log(`\n💼 جاري هندسة خريطة الأرباح لموضوع: ${topic}...`);

const systemPrompt = `أنت مهندس برمجيات و Growth Hacker شرس جداً في بناء الـ SaaS وتحقيق الدخل السلبي لعام 2026.
        مهمتك تحويل الفكرة التقنية التالية إلى خريطة طريق تجارية من ${count} شرائح بالضبط.
    
        🚨 قواعد صارمة لضمان سلامة البيانات (العدد الكبير):
        بما أن المستخدم طلب عدداً كبيراً من الشرائح (${count} شريحة)، يجب عليك توليد جميع الشرائح المطلوبة بالكامل وعدم قطع الاستجابة أبداً. تأكد من إغلاق مصفوفة الشرائح "slides" والقوس النهائي للـ JSON بشكل صحيح.

        🚨 قواعد صارمة وغير قابلة للتفاوض (توزيع الشرائح):
        1. عدد الشرائح الكلي يجب أن يكون ${count} فقط.
        2. الشريحة 1 يجب أن تكون دائماً "hook" (الغلاف).
        3. 🚨 الشريحة 2 يجب أن تكون دائماً "setup" (شريحة تمهيدية تشرح باختصار الفكرة الاستراتيجية).
        4. الشريحة رقم ${count} يجب أن تكون دائماً "cta" (الختام).
        5. باقي الشرائح في الوسط يجب أن تكون "step" (خطوات عملية).
        
        🚨 هندسة العناوين الفيروسية للغلاف (The 3 Viral Hooks - A/B/C Testing):
           بدلاً من العناوين التقليدية المملة، يجب أن تولد 3 خيارات "شرسة" وجذابة جداً توقف التمرير فوراً (بحد أقصى 8 كلمات للعنوان):
           - الخيار 1 (الخريطة المكشوفة / شفرة الغش): يركز على إعطاء "نظام حرفي" يطبع المال. (أمثلة: "الخريطة الحرفية لبناء SaaS يطبع 5000$ شهرياً"، "شفرة الـ SaaS: نظام منسوخ يدر دخلاً سلبياً").
           - الخيار 2 (العدو المشترك / التمرد): يهاجم الألم (العمل الحر، بيع الوقت للعملاء) ويقدم الفكرة كمنقذ. (أمثلة: "العمل الحر مات! ابنِ هذا النظام واضمن حريتك"، "توقف عن كتابة الأكواد للآخرين.. افعل هذا!").
           - الخيار 3 (السر القذر / الميزة الخفية): يثير فضولاً قاتلاً حول سر يحتكره كبار السوق. (أمثلة: "السر القذر لصناع الـ SaaS (وكيف يكتسحون السوق)"، "ما لا يخبرك به الخبراء عن الدخل السلبي").
           - ⚠️ قاموس الكلمات: استخدم مصطلحات هجومية وقوية (سيطرة، يكتسح، ثروة، يطبع، شفرة، حرفياً، منسوخ).

        🚨 محتوى الشرائح الداخلية:
        - الشريحة الأولى (hook): حقل الوصف (explanation) يجب أن يكون جملة تشويقية سيكولوجية تضرب على الوتر الحساس للمطور.
        - الشريحة الثانية (setup): 
          * حقل "toolName": اجعله دائماً عبارة عربية قوية (مثال: "آلية الربح 💰" أو "المخطط السري 🗺️"). يُمنع استخدام كلمات إنجليزية هنا.
          * 🚨 حقل "title": يجب أن يكون "جملة جوكر" (Universal Bridge) تناسب وترتبط منطقياً بجميع الخطافات الثلاثة السابقة مهما كان اختيار المستخدم. (أمثلة إجبارية للقياس عليها: "كيف نطبق هذا على أرض الواقع؟ 🎯", "التشريح الكامل لهذه الاستراتيجية 👇", "السر يكمن في هذه المنظومة ⚙️", "كيف نحول الفكرة إلى أرباح؟").
          * حقل "explanation": شرح مبسط وجذاب جداً يمهد للمتابع فهم الفكرة التجارية قبل الخطوات.
        - شرائح الخطوات (step): حقل "toolName" يجب أن يكون كلمة إنجليزية واحدة فقط (اسم الأداة أو التقنية مثل Stripe, React). حقل "explanation" يجب أن يكون شرحاً عملياً لكيفية استخدام الأداة لجني المال.

        رد بصيغة JSON فقط بهذا الهيكل الدقيق:
        {
          "igCaption": "كابشن إنستغرام بأسلوب تسويقي يحفز على الحفظ والتعليق بكلمة 'أرباح' + 6 هاشتاجات",
          "fbCaption": "كابشن فيسبوك يبدأ بسؤال يثير النقاش حول بناء الدخل السلبي + 4 هاشتاجات",
          "hooks": [
            "العنوان الأول (الخريطة المكشوفة)",
            "العنوان الثاني (العدو المشترك)",
            "العنوان الثالث (السر القذر)"
          ],
          "slides": [
            { "slideNumber": 1, "type": "hook", "title": "سيتم تجاهل هذا الحقل وتعويضه برمجياً", "explanation": "جملة نفسية قصيرة تشوق لسحب الشاشة", "nextTeaser": "اكتشف الخريطة 👉" },
            { "slideNumber": 2, "type": "setup", "title": "جملة الجوكر هنا", "toolName": "آلية الربح 💰", "toolDomain": "", "explanation": "شرح مبسط وجذاب جداً لفكرة المشروع وكيف سيطبع المال، لتهيئة عقل القارئ قبل الدخول في الخطوات التقنية.", "nextTeaser": "لنبدأ التنفيذ ⚡" },
            { "slideNumber": 3, "type": "step", "title": "هندسة الدفع (مثال)", "toolName": "Stripe", "toolDomain": "stripe.com", "explanation": "شرح دسم يركز على التطبيق العملي للربح وبناء النظام.", "nextTeaser": "الخطوة التالية؟" },
            { "slideNumber": ${count}, "type": "cta", "title": "الختام", "toolName": "", "toolDomain": "", "explanation": "", "nextTeaser": "" }
          ]
        }`;

    const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `الموضوع التجاري: ${topic}` }
            ],
            model: 'qwen/qwen3.8-27b',
            max_tokens: 8000, // 👈 هذا هو السطر السحري لاستيعاب 17 شريحة دون انقطاع
            temperature: 0.85,
            response_format: { type: "json_object" }
        });

        // 🧹 استخراج JSON بقوة لضمان عدم حدوث خطأ مع النصوص الطويلة جداً
        const rawContent = chatCompletion.choices[0].message.content;
        let cleanJson = "";
        let lessonData;

        try {
            const jsonBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                cleanJson = jsonBlockMatch[1].trim();
            } else {
                const jsonObjectMatch = rawContent.match(/\{[\s\S]*\}/);
                if (jsonObjectMatch) {
                    cleanJson = jsonObjectMatch[0].trim();
                } else {
                    throw new Error("لم يتم العثور على هيكل JSON صالح في الرد.");
                }
            }

            lessonData = JSON.parse(cleanJson);
            
        } catch (parseError) {
            console.error('❌ فشل في فك تشفير JSON الطويل:\n', rawContent);
            return res.status(500).json({ error: 'الذكاء الاصطناعي أنتج بيانات غير صالحة. حاول مرة أخرى.' });
        }
        
        // 🛡️ جدار الحماية لاقتطاع الشرائح الزائدة إذا هلوس النموذج
        if (lessonData.slides.length > count) {
            lessonData.slides = lessonData.slides.slice(0, count);
        }
        // إجبار الشريحة الأخيرة لتكون CTA
        const lastIndex = lessonData.slides.length - 1;
        lessonData.slides[lastIndex].type = 'cta';

const batchId = Date.now(); 
        const generatedImages = { instagram: [], facebook: [] };
        // مصفوفة جديدة لحفظ خيارات الغلاف للمنصة المختارة لتسهيل الاختيار في الواجهة
        const coverOptions = []; 
        const targetPlatforms = platform === 'both' ? ['instagram', 'facebook'] : [platform];

        for (const currentPlatform of targetPlatforms) {
            for (let i = 0; i < lessonData.slides.length; i++) {
                let slide = { ...lessonData.slides[i] };
                
                // إذا كنا في الشريحة الأولى (الخطاف)
                if (slide.slideNumber === 1 && lessonData.hooks && lessonData.hooks.length === 3) {
                    // رسم 3 خيارات للغلاف
                    for (let h = 0; h < 3; h++) {
                        let hookSlide = { ...slide, title: lessonData.hooks[h] };
                        const fileName = await drawBusinessRoadmapSlide(hookSlide, count, `${batchId}_hook${h}`, currentPlatform, topic);
                        
                        // نضيف الصورة الأولى الافتراضية إلى المصفوفة الرئيسية
                        if (h === 0) {
                           generatedImages[currentPlatform].push(fileName);
                        }
                        
                        // نحفظ الخيارات الثلاثة في مصفوفة منفصلة لإرسالها للواجهة (فقط للإنستغرام كممثل للخيارات)
                        if (currentPlatform === 'instagram' || (currentPlatform === 'facebook' && platform === 'facebook')) {
                            coverOptions.push(fileName);
                        }
                    }
                } else {
                    // رسم باقي الشرائح بشكل طبيعي
                    const fileName = await drawBusinessRoadmapSlide(slide, count, batchId, currentPlatform, topic);
                    generatedImages[currentPlatform].push(fileName);
                }
            }
        }

        // إرسال البيانات للواجهة متضمنة خيارات الغلاف
        res.json({ 
            success: true, 
            igCaption: lessonData.igCaption, 
            fbCaption: lessonData.fbCaption, 
            images: generatedImages,
            coverOptions: coverOptions.slice(0,3) // نرسل الخيارات الثلاثة الأولى فقط
        });


    } catch (error) {
        console.error('❌ خطأ في مسار البيزنس:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});


// ==========================================
// 📖 مسار استوديو القصص المصورة (StoryLab)
// ==========================================
const drawStorySlide = require('./templates/drawStorySlide'); // سننشئ هذا الملف في الخطوة القادمة

app.post('/api/generate-story', async (req, res) => {
    const { topic, slideCount = 6 } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء تقديم موضوع للقصة.' });

    try {
        console.log(`\n📖 جاري تأليف سيناريو قصة مرئية لموضوع: ${topic}...`);

        const systemPrompt = `أنت مخرج قصص مصورة (Storyboard Artist) تقني وخبير تسويق بأسلوب "رحلة البطل".
        مهمتك تأليف سيناريو لكاروسيل تعليمي بأسلوب القصة البصرية (Visual Storytelling) يتكون من ${slideCount} شرائح.
        الموضوع هو: "${topic}".

        🚨 القواعد الإخراجية:
        1. الشرائح من 1 إلى ${slideCount - 1} يجب أن تكون من نوع "split" (شاشة منقسمة).
           - "topQuote": التساؤل، المشكلة، أو الفكرة (جملة قصيرة جداً بالعامية البيضاء أو فصحى مبسطة، بحد أقصى 5 كلمات).
           - "bottomQuote": الحل، الإجراء، أو النتيجة (جملة قصيرة جداً، بحد أقصى 5 كلمات).
           - "topScene" و "bottomScene": وصف دقيق باللغة الإنجليزية لما يحدث في المشهد ليتم رسمه بالذكاء الاصطناعي. (مثال: "looking confused at a laptop with messy code", "smiling confident while looking at clean server architecture").
        2. الشريحة الأخيرة (رقم ${slideCount}) يجب أن تكون "cta" (شريحة كاملة).
           - "ctaText1": العرض الرئيسي (مثال: "سجّل بكورس").
           - "ctaText2": اسم الدورة أو الأداة (مثال: "Full Stack Web Development").
           - "ctaText3": دعوة الإجراء (مثال: "اكتب WEB وسنرسل لك التفاصيل").
           - "heroScene": وصف المشهد النهائي باللغة الإنجليزية (مثال: "standing proud in a high-tech server room looking at the camera").

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "caption": "اكتب الكابشن الجذاب هنا مع الهاشتاجات",
          "slides": [
            {
              "slideNumber": 1,
              "type": "split",
              "topQuote": "عندك فكرة؟",
              "bottomQuote": "حوّلها لـ Web App",
              "topScene": "looking thoughtful at a blank notebook on a desk",
              "bottomScene": "typing fast on a glowing keyboard with code on screen"
            },
            // ... أكمل باقي شرائح الـ split بنفس النمط
            {
              "slideNumber": ${slideCount},
              "type": "cta",
              "ctaText1": "سجل بكورس",
              "ctaText2": "Python & AI Mastery",
              "ctaText3": "علق بكلمة AI للتفاصيل",
              "heroScene": "standing confidently in front of floating holographic screens"
            }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `الموضوع: ${topic}` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        // تنظيف وفك تشفير الـ JSON (استخدام نفس المغناطيس الذي برمجناه سابقاً)
        const rawContent = chatCompletion.choices[0].message.content;
        let storyData;
        try {
            const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i) || rawContent.match(/\{[\s\S]*\}/);
            storyData = JSON.parse(jsonMatch ? (jsonMatch[1] ? jsonMatch[1] : jsonMatch[0]) : rawContent);
        } catch (e) {
            console.error('❌ خطأ في الـ JSON:', rawContent);
            return res.status(500).json({ error: 'بيانات القصة غير صالحة.' });
        }

        const batchId = Date.now();
        const generatedImages = [];

        for (const slide of storyData.slides) {
            const fileName = await drawStorySlide(slide, batchId);
            generatedImages.push(fileName);
        }

        console.log(`✅ تم رسم قصة من ${generatedImages.length} شرائح بنجاح!`);
        res.json({ success: true, caption: storyData.caption, images: generatedImages });

    } catch (error) {
        console.error('❌ خطأ في مسار القصص:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء رسم القصة.' });
    }
});



// ==========================================
// 🖨️ مسار مختبر القصص - المرحلة 2: طباعة التصميم (Stamping)
// ==========================================
app.post('/api/stamp-story-images', upload.any(), async (req, res) => {
    try {
        // req.files يحتوي على الصور المرفوعة، و req.body.slidesData يحتوي على نصوص الشريحة (Stringified JSON)
        const slidesData = JSON.parse(req.body.slidesData);
        const files = req.files;

        if (!files || files.length !== slidesData.length) {
            return res.status(400).json({ error: 'عدد الصور المرفوعة لا يتطابق مع عدد الشرائح.' });
        }

        console.log(`\n🖨️ جاري طباعة التصميم الزجاجي الفاخر على ${files.length} صور...`);
        const batchId = Date.now();
        const generatedImages = [];

        // ترتيب الملفات لضمان تطابقها مع الشرائح
        // نفترض أن الواجهة الأمامية سترسل الملفات بأسماء حقول مثل image_1, image_2 ...
        
        for (let i = 0; i < slidesData.length; i++) {
            const slide = slidesData[i];
            const file = files.find(f => f.fieldname === `image_${slide.slideNumber}`);
            
            if (file) {
                // استدعاء دالة الرسم التي صممناها سابقاً وتمرير مسار الصورة المرفوعة
                const fileName = await stampStoryDesign(slide, slidesData.length, file.path, batchId);
                generatedImages.push(fileName);
                
                // تنظيف الملف المؤقت
                fs.unlinkSync(file.path);
            }
        }

        console.log(`✅ تمت الطباعة بنجاح!`);
        res.json({ success: true, images: generatedImages });

    } catch (error) {
        console.error('❌ خطأ في عملية الطباعة:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء دمج التصميم.' });
    }
});

// ==========================================
// 💡 مسار 1: الإلهام الشخصي (Personal Arsenal) - النسخة الشاملة
// ==========================================
// ==========================================
// 💡 مسار 1: الإلهام الشخصي (The "Pain & Grind" Arsenal)
// ==========================================
app.get('/api/suggest-story-personal', async (req, res) => {
    try {
        const randomSeed = Math.floor(Math.random() * 1000000);

        const systemPrompt = `أنت العقل الاستراتيجي لصانع محتوى تقني حقيقي وشرس (المهندس غربي محمد الشريف).
        مهمتك كتابة "فكرة/سيناريو لقصة إنستغرام" (بحد أقصى سطرين) تلامس قلوب المبرمجين وتجبرهم على التفاعل بشدة.
        
        🚨 القواعد الذهبية (مهم جداً):
        1. حقيقي وقاسي: لا تكتب تنمية بشرية مبتذلة. المبرمجون يكرهون المثاليات. تحدث عن شرب القهوة الباردة، عيون مرهقة، كود لا يعمل، واحتراق وظيفي قاد للنجاح.
        2. اختر "مجالاً واحداً فقط" في كل مرة (إياك أن تدمجها كلها في قصة واحدة):
           - إما: المعاناة في بناء نظام (MERN/Electron) معقد (مثل POS أو ERP).
           - أو: الخسارة في التداول، ثم بناء بوت (Python/Quant) يعتمد على الانضباط الصارم (SMC/ICT).
           - أو: نقل عقلية "الألم والانضباط" من رياضة كمال الأجسام أو الملاكمة إلى الجلوس 14 ساعة لحل "Bug" في خوارزمية ذكاء اصطناعي (Computer Vision).
           - أو: كيف ألهمتك عقلية "التطور المستمر" في (Solo Leveling / Blue Lock) لعدم الاستسلام وبناء Micro-SaaS للصوتيات.

        يجب أن يكون النص المولد جاهزاً ليوضع كـ "وصف" في خانة (إدخال القصة)، ليقوم لاحقاً نظام آخر بتحويله لشرائح.
        مثال للنتيجة المطلوبة: "قصة الليلة التي خسرت فيها أموالاً في التداول، وكيف دفعني الإحباط لغلق هاتفي لمدة شهر كامل لبناء بوت بايثون يعتمد على استراتيجية SMC وحقق لي أول نجاح مؤتمت."

        رد بصيغة JSON فقط بهذا الهيكل: { "topic": "النص القوي هنا" }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt }, 
                { role: 'user', content: `ابتكر لي فكرة قصة شخصية خام، فيها معاناة ثم انتصار. (Seed: ${randomSeed})` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.9, 
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: parsedData.topic });

    } catch (error) {
        console.error('❌ خطأ في الإلهام الشخصي:', error);
        res.status(500).json({ success: false });
    }
});

// ==========================================
// 📈 مسار 2: الإلهام الترندي (The "FOMO & Greed" Viral Hooks)
// ==========================================
app.get('/api/suggest-story-viral', async (req, res) => {
    try {
        const randomSeed = Math.floor(Math.random() * 1000000);

        const systemPrompt = `أنت خبير تسويق فيروسي (Growth Hacker) متخصص في المحتوى التقني لعام 2026.
        مهمتك ابتكار "فكرة/سيناريو لقصة إنستغرام" (سطرين كحد أقصى) تستهدف "الطمع، الفضول، أو الخوف (FOMO)" لدى المبرمجين والمستقلين.
        
        🚨 القوالب الفيروسية (اختر واحداً فقط عشوائياً):
        1. الكنز المخفي (The Secret Wealth): فكرة Micro-SaaS أو أداة AI يمكن برمجتها في نهاية الأسبوع وتدر دخلاً سلبياً.. والكل يتجاهلها.
        2. الصدمة وهدم المعتقدات (Debunking): لماذا تعلم برمجة الواجهات (Front-end) بالشكل التقليدي في 2026 هو مضيعة للوقت.. وما هو البديل المربح (مثلاً: أتمتة الـ Backend أو الذكاء الاصطناعي).
        3. الاختراق الزمني (The Time Hack): كيف استخدمت أداة محددة أو سكربت Python لاختصار عمل أسابيع في ساعة واحدة وحصلت على عميل أجنبي.

        الأسلوب: جشع إيجابي، يثير الفضول بشكل مرعب، ويعطي وعداً بقيمة ضخمة. يجب أن يكون النص المولد جاهزاً ليوضع كـ "وصف" في خانة الإدخال.
        مثال للنتيجة المطلوبة: "الصدمة: لماذا أتوقف عن قبول مشاريع الويب العادية، والسر وراء بناء Micro-SaaS يعتمد على واجهة AI بسيطة ويدر اشتراكات شهرية بدون تدخل مني."

        رد بصيغة JSON فقط بهذا الهيكل: { "topic": "النص الفيروسي هنا" }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt }, 
                { role: 'user', content: `ابتكر لي فكرة ترندية تصنع هوساً لدى المبرمجين اليوم. (Seed: ${randomSeed})` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.9, 
            response_format: { type: "json_object" }
        });

        const parsedData = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: parsedData.topic });

    } catch (error) {
        console.error('❌ خطأ في الإلهام الترندي:', error);
        res.status(500).json({ success: false });
    }
});

// ==========================================
// 🎬 مسار 3: استوديو المخرج الوثائقي (The Viral 8-Slide Architecture)
// ==========================================
app.post('/api/generate-story-prompts', async (req, res) => {
    // 🌟 جعلنا العدد الافتراضي 8 شرائح 
    const { topic, slideCount = 8 } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء تقديم فكرة القصة.' });

    try {
        console.log(`\n🎬 جاري إخراج الكاروسيل الفيروسي المكون من ${slideCount} شرائح لقصة: ${topic.substring(0, 30)}...`);

        const systemPrompt = `أنت كاتب إعلانات محترف (Senior Copywriter) و Growth Hacker خبير في إنستغرام.
        مهمتك تحويل الفكرة إلى "كاروسيل" (Carousel) فيروسي يتكون من ${slideCount} شرائح بالضبط. 
        🚨 تحذير حرج: إياك أن تولد أقل من ${slideCount} شرائح! يجب أن تحتوي المصفوفة على ${slideCount} عناصر تماماً.

        🚨🚨 الهيكل النفسي الإلزامي للـ ${slideCount} شرائح (استراتيجية الساندويتش):
        
        - الشريحة رقم 1 (الخطاف المغناطيسي - The Viral Hook): 
          * العنوان: صادم جداً، يكسر المعتقدات أو يثير فضولاً شديداً.
          * النص التوضيحي: يجب أن يشرح بوضوح ما سيجده المتابع في الشرائح القادمة ويحفزه على سحب الشاشة. (مثال: "في هذا الكاروسيل، سأكشف لك الخطة الكاملة.. اسحب لليسار").
        
        - الشرائح من 2 إلى ${slideCount - 1} (الرحلة العملية - The Journey): 
          * قم بتقسيم (المشكلة، الفجوة، التخطيط، التنفيذ، النتيجة) على هذه الشرائح بنصوص عملية ومباشرة.
        
        - الشريحة رقم ${slideCount} (آلة التفاعل - The Automation CTA): 
          * العنوان: تحفيزي (مثال: "استلم خطتك الآن"، "هديتك جاهزة").
          * النص التوضيحي: يجب أن تطلب من المتابع التعليق بكلمة مفتاحية محددة (من اختيارك وتناسب الموضوع)، 🚨 ويجب إجبارياً وضع هذه الكلمة بين علامتي تنصيص مزدوجتين "". (مثال: علق بكلمة "مسار" وسأرسل لك الرابط في الخاص فوراً!). لا تنسَ علامات التنصيص المزدوجة أبداً!

    🚨 قواعد النصوص:
        1. "mainTopicTitle": عنوان عام مبسط ومغناطيسي (أقل من 5 كلمات) يُطبع في أعلى كل الشرائح لربط القصة.
        2. "title": عنوان الشريحة (كلمة إلى 3 كلمات).
        3. "text": نص عملي مباشر، 🚨 وقصير جداً جداً (من 6 إلى 15 كلمة كحد أقصى). ممنوع كتابة فقرات طويلة نهائياً! الشريحة الأولى يجب أن تكون جملة واحدة سريعة وخاطفة (Punchline).
        4. "تلوين الكلمات": في حقل "text" أو "title"، ضع أهم كلمة أو رقم بين نجمتين *مثل هذا* ليتم تلوينها في التصميم وإبرازها.

        🚨 هندسة برومبتات الصور (باللغة الإنجليزية حصراً - واقعية مفرطة - Hyper-Realistic):
        لكل شريحة ابتكر خيارين للصورة (vibePrompt و facePrompt):
        - للشريحة 1 (الخطاف): "Highly engaging hook thumbnail, mysterious tech vibe, cinematic dark lighting, neon accents, evoking intense curiosity, POV perspective or over the shoulder showing a shocking result on screen."
        - للشرائح من 2 إلى ${slideCount - 1}: "Natural working environment, deep focus, tech setup, coding, dynamic office lighting."
        - للشريحة ${slideCount} (الخاتمة - CTA): "Direct eye contact, confident 26yo Arab man, premium lifestyle/business aesthetic, pointing slightly down towards the comments section, inviting and trustworthy expression."

        ⚠️ قاعدة التأطير والأبعاد الإلزامية (أضفها في نهاية كل برومبت حرفياً):
        "MANDATORY: VERTICAL PORTRAIT ORIENTATION ONLY (Aspect Ratio 4:5 or 9:16). Do NOT generate landscape images. Shot on Sony A7S III, 35mm. Frame the main subjects and action entirely in the TOP HALF of this vertical image. The BOTTOM HALF MUST be pure dark, negative space, or heavy bokeh for text overlay. No elements bleeding into the bottom half."

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "mainTopicTitle": "عنوان المغناطيس العام",
          "slides": [
            { 
              "slideNumber": 1, 
              "title": "...", 
              "text": "...", 
              "vibePrompt": "...",
              "facePrompt": "..."
            }
            // 🚨 يجب أن تستمر بإنشاء العناصر هنا حتى تصل إلى slideNumber: ${slideCount}
          ]
        }`;
const userRequest = `أخرج لي هذا الكاروسيل الفيروسي في ${slideCount} شرائح كاملة: ${topic}`;
        const finalPrompt = systemPrompt + "\n\nالطلب:\n" + userRequest;

        // ==============================================================
        // 🛡️ نظام الطوارئ: قائمة النماذج المتاحة من الأقوى إلى الأكثر استقراراً
        // ==============================================================
        const fallbackModels = [
            "gemini-3.8-flash", 
            "gemini-3.5-flash", 
            "gemini-flash-latest",
            "gemini-2.5-flash", // الخيار الأول: سريع ومستقر جداً
            "gemini-2.5-pro",   // الخيار الثاني: دقة متناهية وقدرة استيعاب هائلة
            "gemma-4-31b-it",   // الخيار الثالث: نموذج منفصل تماماً نادراً ما يزدحم
            "gemini-pro-latest"
        ];
        let storyData = null;
        let successModel = "";

        // المحاولة الذكية: المرور على النماذج واحداً تلو الآخر
        for (const modelName of fallbackModels) {
            try {
                console.log(`⏳ جاري المحاولة باستخدام السيرفر: ${modelName}...`);
                const genAI = getGeminiClient();
                const model = genAI.getGenerativeModel({ 
                    model: modelName, 
                    generationConfig: { responseMimeType: "application/json" } 
                });

                const result = await model.generateContent(finalPrompt);
                storyData = JSON.parse(result.response.text());
                successModel = modelName;
                
                console.log(`✅ [نجاح] تم التوليد بنجاح عبر السيرفر: ${successModel}`);
                break; // الخروج من الحلقة فور النجاح

            } catch (error) {
                if (error.status === 503 || error.status === 429) {
                    console.log(`⚠️ السيرفر ${modelName} مزدحم حالياً (503/429). الانتقال للبديل...`);
                    continue; // تخطي هذا النموذج وتجربة الذي يليه
                }
                throw error; // إذا كان الخطأ برمجياً وليس بسبب الازدحام، أوقف العملية
            }
        }

        // إذا فشلت جميع النماذج في القائمة
        if (!storyData) {
            throw new Error("جميع سيرفرات Gemini تواجه ضغطاً هائلاً في هذه اللحظة. يرجى المحاولة بعد قليل.");
        }
        // ==============================================================

        // 🌟 فرض التلوين الإجباري
        if (storyData.slides) {
            storyData.slides.forEach(slide => {
                if (slide.title && !slide.title.includes('*')) {
                    let words = slide.title.trim().split(' ');
                    if (words.length > 1) {
                        let lastWord = words.pop(); 
                        words.push(`*${lastWord}*`); 
                        slide.title = words.join(' ');
                    } else if (words.length === 1) {
                        slide.title = `*${slide.title}*`;
                    }
                }
            });
        }

        if (storyData.slides && storyData.slides.length > slideCount) {
            storyData.slides = storyData.slides.slice(0, slideCount);
        }

        if (storyData.slides && storyData.mainTopicTitle) {
            storyData.slides.forEach(slide => {
                slide.mainTopicTitle = storyData.mainTopicTitle;
            });
        }

        res.json({ 
            success: true, 
            mainTopicTitle: storyData.mainTopicTitle, 
            slides: storyData.slides 
        });

    } catch (error) {
        console.error('❌ خطأ نهائي في توليد السيناريو:', error.message);
        res.status(500).json({ error: 'الخوادم مزدحمة جداً. حاول مرة أخرى.' });
    }
});

// ==========================================
// 🚀 محرك النمو الاستراتيجي (The Growth Engine Routes)
// ==========================================

// 1. مسار خرائط الطريق والأدوات (الهدف: رفع نسبة الحفظ Saves 🗺️)
app.get('/api/suggest-story-roadmap', async (req, res) => {
    try {
        const systemPrompt = `أنت خبير Growth Hacking في إنستغرام. 
        أعطني فكرة واحدة (Topic) لكاروسيل إنستغرام في مجال (أتمتة الأعمال، Python، MERN Stack، أو الذكاء الاصطناعي).
        🚨 الهدف من هذه الفكرة: إجبار المتابع على الضغط على زر "حفظ" (Save).
        يجب أن تكون الفكرة عبارة عن: "خريطة طريق خطوة بخطوة"، أو "قائمة أدوات قوية وسرية"، أو "دليل شامل".
        مثال: "خريطة طريق 2026: كيف تبني نظام أتمتة كامل من الصفر في 5 أيام".
        رد بصيغة JSON فقط: {"topic": "اكتب الفكرة الجذابة هنا"}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'اقترح علي فكرة قوية عبارة عن خريطة طريق أو قائمة أدوات تجبر المتابع على حفظ المنشور.' } // 🌟 التعديل هنا: أضفنا طلب المستخدم
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.8,
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: data.topic });
    } catch (error) {
        console.error('Error suggesting roadmap topic:', error);
        res.status(500).json({ error: 'حدث خطأ في توليد فكرة خريطة الطريق.' });
    }
});

// 2. مسار إثارة الجدل وكسر المسلمات (الهدف: زيادة التعليقات Comments 🔥)
app.get('/api/suggest-story-controversial', async (req, res) => {
    try {
        const systemPrompt = `أنت خبير Growth Hacking في إنستغرام. 
        أعطني فكرة واحدة (Topic) لكاروسيل إنستغرام في مجال (البرمجة، الأتمتة، أو العمل الحر).
        🚨 الهدف من هذه الفكرة: استفزاز المتابعين بشكل إيجابي لدفعهم للتعليق والنقاش (Comments).
        يجب أن تهاجم الفكرة "معتقداً شائعاً"، أو "تقنية قديمة"، أو "نصيحة مبتذلة" وتطرح بديلاً ذكياً.
        مثال: "لماذا يعتبر تعلم HTML و CSS في 2026 أسوأ قرار مهني؟ (وماذا تفعل بدلاً من ذلك)".
        رد بصيغة JSON فقط: {"topic": "اكتب الفكرة المستفزة والذكية هنا"}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'اقترح علي فكرة تكسر المسلمات وتهاجم معتقداً شائعاً في البرمجة لإشعال خانة التعليقات.' } // 🌟 التعديل هنا
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9, 
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: data.topic });
    } catch (error) {
        console.error('Error suggesting controversial topic:', error);
        res.status(500).json({ error: 'حدث خطأ في توليد الفكرة الجدلية.' });
    }
});

// 3. مسار دراسات الحالة والأرقام (الهدف: جلب عملاء Leads & Sales 📊)
app.get('/api/suggest-story-casestudy', async (req, res) => {
    try {
        const systemPrompt = `أنت خبير مبيعات (Sales Copywriter) لمشاريع B2B. 
        أعطني فكرة واحدة (Topic) لكاروسيل إنستغرام لاستهداف "أصحاب الأعمال والشركات".
        🚨 الهدف من هذه الفكرة: إثبات خبرتك بالأرقام لجلب عملاء يطلبون خدماتك (Leads).
        يجب أن تكون الفكرة عبارة عن "دراسة حالة (Case Study)" توضح كيف قمت بحل مشكلة معقدة، توفير المال، أو تسريع العمل باستخدام (Python Automation, AI, Web Apps).
        مثال: "كيف وفرنا 40 ساعة عمل أسبوعياً لشركة شحن باستخدام سكربت بايثون بسيط".
        رد بصيغة JSON فقط: {"topic": "اكتب دراسة الحالة الجذابة هنا"}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'اقترح علي فكرة عبارة عن دراسة حالة مدعمة بالأرقام لاصطياد أصحاب الأعمال كعملاء.' } // 🌟 التعديل هنا
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.7, 
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: data.topic });
    } catch (error) {
        console.error('Error suggesting case study topic:', error);
        res.status(500).json({ error: 'حدث خطأ في توليد فكرة دراسة الحالة.' });
    }
});

// 4. مسار كواليس الكفاح والإنتاجية (الهدف: صناعة جمهور وفي وبناء ارتباط عاطفي ⏳)
app.get('/api/suggest-story-journey', async (req, res) => {
    try {
        const systemPrompt = `أنت خبير Growth Hacking ومدرب إنتاجية (Productivity Coach) للمبرمجين ورواد الأعمال.
        أعطني فكرة واحدة (Topic) لكاروسيل إنستغرام.
        🚨 الهدف من هذه الفكرة: إظهار الجانب الإنساني (The Hero's Journey)، ومشاركة كواليس المعاناة والنجاح لبناء ارتباط عاطفي قوي مع المتابعين.
        يجب أن تتمحور الفكرة حول موضوع من هذه المواضيع:
        - رحلة تعلم لغة برمجة معينة من الصفر (مثل Python أو MERN).
        - كيفية تقسيم الوقت بذكاء (Time Management/Time Boxing) لإنجاز مشروع Full-Stack في مدة قصيرة.
        - كيف تتغلب على احتراق المبرمجين (Burnout) والمثابرة في التعلم الذاتي.
        مثال: "كيف قسمت وقتي لأبني تطبيق MERN Stack كامل في 14 يوماً فقط رغم انشغالي".
        رد بصيغة JSON فقط: {"topic": "اكتب فكرة الكفاح والإنتاجية هنا"}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'اقترح علي فكرة قصة كفاح واقعية أو طريقة عبقرية لتقسيم الوقت لإنجاز مشروع برمجي، لكي ألهم المتابعين.' }
            ],
            model: 'qwen/qwen3.8-27b', // نستخدم الموديل المستقر
            temperature: 0.85, 
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: data.topic });
    } catch (error) {
        console.error('Error suggesting journey topic:', error);
        res.status(500).json({ error: 'حدث خطأ في توليد فكرة الكفاح والإنتاجية.' });
    }
});

// 5. مسار خرائط الإتقان (الهدف: جلب آلاف الحفظ والمشاركات بأن تكون المرجع الأول 🚀)
app.get('/api/suggest-story-mastery', async (req, res) => {
    try {
        const systemPrompt = `أنت خبير تعليم تقني (Tech Educator) و Growth Hacker.
        مهمتك ابتكار فكرة (Topic) واحدة لكاروسيل إنستغرام توضح خطة "من الصفر للاحتراف" (Zero to Hero).
        
        🚨 مهاراتي التي أريد التدريس عنها (اختر واحدة فقط عشوائياً في كل مرة):
        [Full Stack MERN, Python, Machine Learning (ML), Deep Learning (DL), Django, Adobe Audition, Automation, Node.js, Web dev full stack, Desktop app dev full stack, AI MODELS, Voice ACTING, Audio editing, Saas dev, Video Montage/Editing, Algorithmic Trading, English Language Mastery].

        🚨 الهدف من الفكرة: يجب أن تكون الفكرة قابلة للحفظ (Highly Savable). استخدم أسلوب:
        - "خطة الـ X يوماً لتعلم..."
        - "لا تشاهد كورسات، ابدأ ببناء هذه الـ 3 مشاريع في..."
        - "المسار السري لإتقان [المهارة] لو عاد بي الزمن..."
        
        مثال: "خطة الـ 90 يوماً لإتقان التداول الخوارزمي (Algorithmic Trading) وبناء أول بوت لك".
        مثال 2: "كيف تتقن MERN Stack عبر بناء 3 مشاريع حقيقية (تخلى عن الكورسات المملة)".

        رد بصيغة JSON فقط: {"topic": "اكتب الفكرة الفيروسية لتعلم المهارة هنا"}`;

// 🌟 1. استدعاء الموزع الذكي للانتقال للمفتاح التالي تلقائياً
        const currentGroq = getGroqClient();

        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'اقترح علي خطة تعلم فيروسية، مكثفة، وتعتمد على الوقت أو المشاريع لإحدى مهاراتي لكي ينبهر المتابعون ويحفظوا المنشور.' }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9, 
            max_tokens: 400, // 🌟 2. حماية صارمة من الـ Rate Limit: لن يتجاوز الطلب 400 توكن أبداً
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, topic: data.topic });
    } catch (error) {
        console.error('Error suggesting mastery topic:', error);
        res.status(500).json({ error: 'حدث خطأ في توليد فكرة خارطة الإتقان.' });
    }
});
// ==========================================
// 🎬 مسار الإخراج السينمائي (تم نقله إلى Gemini مع نظام الطوارئ 🚀)
// ==========================================
app.post('/api/generate-cinematic-prompts', async (req, res) => {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'الرجاء توفير بيانات الشرائح (slides).' });
    }

    try {
const systemPrompt = `أنت مخرج سينمائي (Cinematographer) ومدير فني عبقري.
        سأعطيك مصفوفة تحتوي على نص شريحة أو شرائح كاروسيل إنستغرام (بالعربية).
        مهمتك هي تخيل 5 زوايا تصوير مختلفة لكل شريحة، وكتابة الـ Prompts الخاصة بها باللغة الإنجليزية لتوليدها عبر Midjourney أو أدوات الذكاء الاصطناعي للصور.
        
        🚨 الزوايا الخمس المطلوبة لكل شريحة (Hyper-Realistic, 8k, Cinematic Lighting):
        1. "vibePrompt": لقطة أجواء (B-Roll). مكتب تقني، إضاءة خافتة، أكواد (بدون إظهار وجه بشري كامل).
        2. "facePrompt": لقطة هوية. شاب عربي بملامح جدية/واثقة يمثل شخصية الخبير التقني، ينظر للكاميرا أو يعمل بتركيز.
        3. "povPrompt": لقطة إثبات (POV). منظور الشخص الأول، تركيز مكبر (Macro) على شاشة هاتف، حاسوب، أو إشعارات نجاح.
        4. "emotionPrompt": لقطة مشاعر. تركز على لغة الجسد الدرامية (إرهاق، احتراق وظيفي، شرب قهوة بتعب، أو صدمة إيجابية).
        5. "technicalPrompt": لقطة الشرح العميق (The Masterclass). تركيز مكبر (Macro) على شاشة حاسوب تعرض كوداً حقيقياً يخص الموضوع، أو سبورة زجاجية (Glass Whiteboard) عليها مخططات. 🚨 شرط صارم: خالية تماماً من أي تواجد بشري (No humans, empty room).

        🚨 تحذير برمجي صارم جداً (CRITICAL):
        يجب أن يكون ردك عبارة عن كود JSON صالح 100% فقط.
        ممنوع منعاً باتاً كتابة أي كلمة خارج الـ JSON.
        لا تشرح أفكارك (No Chain of Thought)، لا تقل "Let's break down"، ولا تقل "Here is the JSON".
        يجب أن يبدأ الرد بالحرف { وينتهي بالحرف } فقط!

        رد بصيغة JSON فقط بهذا الهيكل الإلزامي:
        {
          "cinematic_slides": [
            {
              "slideNumber": 1,
              "vibePrompt": "...",
              "facePrompt": "...",
              "povPrompt": "...",
              "emotionPrompt": "...",
              "technicalPrompt": "..."
            }
          ]
        }`;

        const userRequest = `إليك نصوص الشرائح، قم بتوليد اللقطات الخمس لكل منها دفعة واحدة:\n${JSON.stringify(slides)}`;
        const finalPrompt = systemPrompt + "\n\nالطلب:\n" + userRequest;

        // ==============================================================
        // 🛡️ نظام الطوارئ: قائمة النماذج المتاحة من الأقوى إلى الأكثر استقراراً
        // ==============================================================
    const fallbackModels = [
            "gemini-3.8-flash", 
            "gemini-flash-latest",
            "gemini-flash-lite-latest", // نموذج خفيف وسريع جداً لتفادي الزحام
            "gemini-3.1-flash-lite", 
            "gemma-4-31b-it", 
            "gemini-pro-latest"
        ];

        let cinematicData = null;
        let successModel = "";

        // المحاولة الذكية: المرور على النماذج واحداً تلو الآخر
        for (const modelName of fallbackModels) {
            try {
                console.log(`⏳ [الإخراج السينمائي] جاري المحاولة عبر سيرفر: ${modelName}...`);
                
                const genAI = getGeminiClient();
                const model = genAI.getGenerativeModel({ 
                    model: modelName, 
                    generationConfig: { responseMimeType: "application/json" } 
                });

                const result = await model.generateContent(finalPrompt);
                cinematicData = JSON.parse(result.response.text());
                successModel = modelName;
                
                console.log(`✅ [نجاح] تم توليد 40 لقطة سينمائية بنجاح عبر: ${successModel}`);
                break; // الخروج من الحلقة فور النجاح

            } catch (error) {
                if (error.status === 503 || error.status === 429) {
                    console.log(`⚠️ السيرفر ${modelName} مزدحم حالياً (503). الانتقال للبديل...`);
                    continue; // تخطي هذا النموذج وتجربة الذي يليه
                }
                throw error; // إذا كان الخطأ برمجياً (مثل JSON غير صالح)، أوقف العملية
            }
        }

        // إذا فشلت جميع النماذج في القائمة
        if (!cinematicData) {
            throw new Error("جميع سيرفرات Gemini تواجه ضغطاً هائلاً في هذه اللحظة. يرجى المحاولة بعد قليل.");
        }
        // ==============================================================

        res.json({ success: true, cinematic_slides: cinematicData.cinematic_slides });

    } catch (error) {
        console.error('❌ خطأ في توليد اللقطات السينمائية:', error.message);
        res.status(500).json({ error: 'حدث خطأ في توليد اللقطات السينمائية.' });
    }
});
// ==========================================
// 👑 مسار المستشار الخبير (The Ultimate Director's Cut)
// ==========================================
app.post('/api/suggest-best-shots', async (req, res) => {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'الرجاء توفير بيانات الشرائح.' });
    }

    try {
        const systemPrompt = `أنت أفضل مستشار Growth Hacking ومخرج إبداعي (Creative Director) في العالم.
        أمامك مصفوفة لشرائح كاروسيل إنستغرام، كل شريحة تحتوي على نص، و 5 خيارات لزوايا التصوير:
        (vibePrompt, facePrompt, povPrompt, emotionPrompt, technicalPrompt).
        
        مهمتك: اختر اللقطة *الأكثر فيروسية* (The Viral Choice) لكل شريحة والتي ستكسر ملل المتابع (Pattern Interrupt) وترفع التفاعل.
        🚨 القواعد الاستراتيجية لاختيارك:
        - الشريحة الأولى (الخطاف): تحتاج دائماً إلى صدمة بصرية (povPrompt أو emotionPrompt).
        - شرائح الشرح في المنتصف: تحتاج إلى إثبات (technicalPrompt) أو أجواء (vibePrompt).
        - الشريحة الأخيرة (الدعوة للإجراء): تحتاج دائماً إلى بناء ثقة شخصية (facePrompt).
        
        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "expert_advice": [
            {
              "slideNumber": 1,
              "bestShotKey": "povPrompt", // اكتب اسم المفتاح الفائز هنا بالضبط
              "reasoning": "سبب اختيارك التسويقي هنا (مثال: لأن لقطة الشاشة من منظور الشخص الأول ستجعل المتابع يتوقف عن التمرير فوراً ليرى النتيجة...)"
            }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `بصفتك الخبير الأول، حلل هذه الشرائح واختر اللقطة الفيروسية الأفضل لكل شريحة مع ذكر الدليل التسويقي القاطع: ${JSON.stringify(slides)}` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.6, // حرارة منخفضة ليكون التحليل منطقياً واستراتيجياً
            max_tokens: 6000,
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, expert_advice: data.expert_advice });
    } catch (error) {
        console.error('Error suggesting best shots:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحليل المستشار الخبير.' });
    }
});


// ==========================================
// ✍️ مسار إعادة الصياغة السحرية للشريحة (AI Slide Rewrite)
// ==========================================
app.post('/api/rewrite-slide', async (req, res) => {
    const { slideTitle, slideText, slideType } = req.body;

    if (!slideTitle || !slideText) {
        return res.status(400).json({ error: 'الرجاء توفير النص الحالي للشريحة.' });
    }

    try {
        const systemPrompt = `أنت أفضل Copywriter و Growth Hacker في العالم.
        مهمتك إعادة صياغة (العنوان والنص) لشريحة إنستغرام ليكون أقوى، أكثر صدمة، وأكثر فيروسية (Viral).
        
        🚨 قواعد إعادة الصياغة:
        1. العنوان (title): قصير جداً (1 إلى 3 كلمات كحد أقصى). صادم. 🚨 ضع أهم كلمة بين نجمتين *هكذا* لتلوينها.
        2. النص (text): 🚨 قصير جداً ومباشر (من 6 إلى 15 كلمة كحد أقصى). لا تكتب فقرات أبداً!
        3. الأسلوب: ${slideType === 'hook' ? 'صادم ويثير الفضول لدرجة التوقف عن التمرير.' : (slideType === 'cta' ? 'يخلق إلحاحاً شديداً (FOMO) للتعليق.' : 'عملي، مباشر، ويكشف سراً صغيراً.')}

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "newTitle": "العنوان *الجديد*",
          "newText": "النص الجديد القوي هنا."
        }`;

        const currentGroq = getGroqClient(); 

        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `أعد صياغة هذا ليكون ترندياً وقوياً:\nالعنوان الحالي: ${slideTitle}\nالنص الحالي: ${slideText}` }
            ],
            model: 'qwen/qwen3.8-27b', // نستخدم qwen للسرعة
            temperature: 0.8, // حرارة مرتفعة قليلاً للإبداع
            max_tokens: 300, 
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        
        // 🌟 تطبيق التلوين الإجباري إذا نسي الذكاء الاصطناعي النجمات
        if (data.newTitle && !data.newTitle.includes('*')) {
            let words = data.newTitle.trim().split(' ');
            if (words.length > 1) {
                let lastWord = words.pop();
                words.push(`*${lastWord}*`);
                data.newTitle = words.join(' ');
            } else if (words.length === 1) {
                data.newTitle = `*${data.newTitle}*`;
            }
        }

        res.json({ success: true, newTitle: data.newTitle, newText: data.newText });
    } catch (error) {
        console.error('Error rewriting slide:', error);
        res.status(500).json({ error: 'حدث خطأ في إعادة الصياغة السحرية.' });
    }
});

// ==========================================
// 🔄 مسار تحديث زوايا الإخراج لشريحة واحدة (Single Slide Prompts)
// ==========================================
app.post('/api/regenerate-single-prompts', async (req, res) => {
    const { slideTitle, slideText } = req.body;

    if (!slideTitle) {
        return res.status(400).json({ error: 'الرجاء توفير بيانات الشريحة.' });
    }

    try {
        const systemPrompt = `أنت مخرج سينمائي. لديك الآن نص شريحة واحدة فقط تم تعديلها.
        مهمتك توليد 5 زوايا تصوير (Midjourney Prompts) تتناسب حصرياً مع هذا النص الجديد.
        
        🚨 قوانين صارمة:
        - اجعل كل برومبت واضحاً ومفصلاً (25-35 كلمة) مع وصف دقيق للموضوع، المكان، الإضاءة، الألوان، التكوين، زاوية الكاميرا، نوع اللقطة، وعمق المجال.
        - ابدأ دائماً بـ: Hyper-realistic 8k cinematic.
        - استخدم أوصافاً بصرية محددة وتجنب الكلمات العامة أو المجردة، وأضف تفاصيل واقعية تساعد على إنتاج صورة حادة وواضحة.
        - اذكر العناصر الرئيسية في المقدمة، واجعل الخلفية بسيطة وغير مشتتة، مع الحفاظ على تناسق جميع التفاصيل مع نص الشريحة.
        
        الزوايا:
        1. vibePrompt: أجواء (B-Roll) بدون وجوه، مع تحديد المكان والعناصر والإضاءة والتكوين السينمائي.
        2. facePrompt: لقطة هوية لشاب عربي خبير، مع وصف العمر التقريبي، الملابس، تعبير الوجه، الإضاءة، والخلفية.
        3. povPrompt: منظور الشخص الأول (شاشة هاتف/حاسوب)، مع وصف ما يظهر على الشاشة واليدين والبيئة المحيطة.
        4. emotionPrompt: لغة جسد ومشاعر درامية، مع وصف الوضعية، تعبير الوجه، الإضاءة، والأجواء العاطفية.
        5. technicalPrompt: شاشة كود أو سبورة زجاجية (بدون بشر تماماً)، مع نص تقني مقروء وتكوين منظم وإضاءة واضحة.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "prompts": {
            "vibePrompt": "...",
            "facePrompt": "...",
            "povPrompt": "...",
            "emotionPrompt": "...",
            "technicalPrompt": "..."
          }
        }`;

        const currentGroq = getGroqClient(); 

        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `استلهم اللقطات من هذا النص الجديد:\nالعنوان: ${slideTitle}\nالنص: ${slideText}` }
            ],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.7, 
            max_tokens: 500, // سعة صغيرة جداً تكفي لشريحة واحدة وتتفادى حدود السيرفر
            response_format: { type: "json_object" }
        });
        
        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, prompts: data.prompts });
    } catch (error) {
        console.error('Error regenerating single prompts:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث زوايا الإخراج.' });
    }
});



// ==========================================
// 💡 مسار توليد إلهامات الريلز الفيروسية (نسخة الـ Growth Hacker V2.0)
// ==========================================
app.get('/api/suggest-reel-topics', async (req, res) => {
    try {
        console.log(`\n💡 جاري استدعاء العقل المدبر لابتكار أفكار ودروس فيروسية...`);

        const systemPrompt = `أنت أدهى خبير (Growth Hacker)، وأعظم مخرج فيديوهات تعليمية قصيرة (Reels/TikTok) في العالم. 
        مهمتك ليست مجرد رمي الأفكار، بل هندسة "دروس مصغرة فيروسية" (Micro-Learning) تجعل المشاهد يشعر بالغباء لأنه لم يعرف هذه المعلومة من قبل، وتجبره على الحفظ والمشاركة.

        🚨 استهدف هذه المحاور الخمسة بذكاء شديد (نوّع بينها):
        1. شروحات برمجية صادمة (MERN & Python): لا تشرح الدرس بالطريقة التقليدية. ابدأ بـ "خطأ يدمر تطبيقك" أو "شفرة غش في Node.js توفر عليك ساعات". قدم الكود أو الحل كأنه كنز سري.
        2. بناء الأنظمة (الذكاء الاصطناعي والتداول): كيف تبني بوت تداول آلي (Algo-Trading) أو أداة ذكاء اصطناعي (SaaS). اشرح الهيكلية المعمارية (Architecture) في 30 ثانية لتجعل المشاهد ينبهر بالنتيجة ويريد التعلم.
        3. اختراق العقل باللغات (The Linguistic Cheat Code): كيف أن إتقان الإنجليزية يضاعف الراتب، وكيف أن تعلم لغة معقدة (كاليابانية) يغير حرفياً مسارات الدماغ العصبية ويرفع الـ IQ.
        4. الانضباط الوحشي (Monk Mode & Gym): دمج الانضباط الجسدي (كمال الأجسام، الكاليستنكس) مع الإنتاجية التقنية. كيف تبني جسمك وعقلك كآلة لا تقهر.
        5. تدمير الخرافات (Debunking Myths): كشف حقيقة كورسات البرمجة الوهمية، أو خرافات التداول العاطفي، وتقديم "الكبسولة الحمراء" والواقع المر.

        🚨 القواعد النفسية الصارمة (Psychological Triggers):
        - استخدم "فجوة الفضول" (Curiosity Gap) لجعله يكمل الفيديو.
        - في الدروس: استخدم قاعدة (المشكلة ⬅️ التخويف من عواقبها ⬅️ الحل السحري السريع).
        - الكلمات الذهبية المحفزة: (السر المظلم، شفرة الغش، الكبسولة الحمراء، توقف عن فعل هذا فوراً، 99% من المبرمجين، اختراق الدماغ، هذا الكود).
        - النبرة: حادة، واثقة، سلطوية، وتقدم (Tough Love).

        رد بصيغة JSON نقي فقط بهذا الهيكل:
        {
          "inspirations": [
            {
              "id": 1,
              "category": "نوع المحور (مثال: درس برمجي خاطف، انضباط نفسي، أتمتة وذكاء اصطناعي)",
              "title": "عنوان ساحق (كلمتين أو 3)",
              "emoji": "🔥",
              "hook": "الخطاف (الـ 3 ثواني الأولى): الجملة الصادمة التي ستجمد المشاهد مكانه.",
              "coreLesson": "جوهر الدرس: شرح الفكرة أو التقنية أو المعلومة في سطرين بطريقة سريعة وعبقرية.",
              "cta": "الدعوة للإجراء: اطلب منه التعليق بكلمة محددة (مثل: كود، خطة، أتمتة) لإرسال الملف أو الشرح الكامل له."
            }
          ]
        }`;

        const userPrompt = "ادخل في وضع العبقرية التسويقية الآن. استخرج لي 4 أفكار (Hooks + Lessons) لدروس مصغرة وأفكار فيروسية جديدة كلياً وغير مكررة. أريدها أن تكون مغناطيسية وتجبر المشاهد على التعليق ومتابعتي فوراً.";

        const currentGroq = getGroqClient(); // تأكد من دالة جلب العميل لديك
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'qwen/qwen3.8-27b', // أنصح بتحديث الموديل لنسخة أحدث إن أمكن أو إبقاء qwen2.5
            temperature: 0.85, // تقليل بسيط لضمان دقة معلومات "الدروس"
            max_tokens: 1500,
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, inspirations: data.inspirations });

    } catch (error) {
        console.error('❌ خطأ في توليد إلهامات الريلز:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإلهامات.' });
    }
});

// ==========================================
// 🎬 Route 4: Short Video Engine (English Only, Video Prompts)
// ==========================================
app.post('/api/generate-reel-script', async (req, res) => {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ error: 'Topic is missing.' });

    try {
        console.log(`\n🎞️ Generating English script for: ${topic.substring(0, 30)}...`);

        const systemPrompt = `You are a world-class documentary director and Growth Hacker.
        Your task is to write a short video script in a "Raw Documentary" style.

        🚨 STRICT RULE: THE ENTIRE OUTPUT MUST BE 100% IN ENGLISH. NO ARABIC WORDS ALLOWED AT ALL IN ANY FIELD. 🚨
        
        Voice-over & Emotion Directing:
        - Use punctuation to engineer the voice: (...) for deep pauses, (!!!) for shock.
        
        Visual Rules (Veo / Motion Prompts):
        - The footage must look 100% real, shot on a phone or documentary camera.
        - NEVER use AI words (cyberpunk, 3d render, neon, hyper-cinematic).
        - Use natural camera movements: "Handheld camera with slight shake, subtle breathing".
        - DO NOT request audio or voice-over generation in the visual prompt.

        Output ONLY pure JSON in this exact format:
        {
          "reelTitle": "Catchy title in English",
          "caption": "Instagram caption with CTA in English",
          "scenes": [
            {
              "sceneNumber": 1,
              "durationHint": "0-3s",
              "deliveryStyle": "Emotion/Style in English (e.g., Whispering and serious)",
              "narration": "English voice-over text...",
              "onScreenText": "Short catchy hook in English",
              "videoPromptStandard": "Handheld camera footage with a slight shake. A man sitting at a desk... Raw footage, silent.",
              "videoPromptPersona": "Handheld camera footage with a slight shake. A 25-year-old athletic Algerian man with sharp features sitting at a desk... Raw footage, silent."
            }
          ]
        }`;

        const geminiPrompt = systemPrompt + `\n\nRequest:\nCreate a viral, hard-hitting script about this topic: ${topic}`;

        const fallbackModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash", "gemini-pro-latest"];
        let reelData = null;

        for (const modelName of fallbackModels) {
            try {
                const genAI = getGeminiClient(); 
                const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: "application/json" } });
                const result = await model.generateContent(geminiPrompt);
                let textResult = result.response.text();
                const jsonMatch = textResult.match(/\{[\s\S]*\}/);
                reelData = JSON.parse(jsonMatch ? jsonMatch[0] : textResult);
                break; 
            } catch (error) {
                continue;
            }
        }

        if (!reelData || !reelData.scenes) return res.status(503).json({ error: 'Servers are busy.' });
        res.json({ success: true, reel: reelData });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: 'Failed to generate script.' });
    }
});

// ==========================================
// 🎙️ مسار 5: محرك الصوت اللانهائي والمجاني (Microsoft Edge TTS)
// ==========================================
app.post('/api/generate-voiceover', async (req, res) => {
    // نستخدم صوت Christopher كافتراضي (صوت سينمائي فخم جداً)
    const { text, voiceId = 'en-US-ChristopherNeural' } = req.body; 

    if (!text) return res.status(400).json({ error: 'الرجاء توفير النص.' });

    try {
        console.log(`\n🎙️ جاري استدعاء محرك Edge TTS المجاني بصوت: ${voiceId}...`);

        // مسار مؤقت لحفظ ملف الصوت على القرص E
        const outputPath = path.join(__dirname, 'temp_audio.mp3');

        // تنظيف النص من علامات الاقتباس لتجنب أخطاء سطر الأوامر
        const cleanText = text.replace(/"/g, "'").replace(/\n/g, ' ');

        // 🌟 الأمر البرمجي لتشغيل Edge-TTS
        // 🌟 جعل الصوت أسرع قليلاً وأكثر وضوحاً مع الحفاظ على طابع سينمائي
        // --rate=-10% (أسرع من الوضع الحالي لكنه لا يزال هادئاً)
        // --pitch=-8Hz (أرق قليلاً من -12Hz مع بقاء الصوت عميقاً بشكل لطيف)
        const command = `edge-tts --voice ${voiceId} --text "${cleanText}" --rate=-10% --pitch=-8Hz --write-media "${outputPath}"`;

        // تنفيذ الأمر
        await execPromise(command);

        // قراءة الملف بعد توليده وتحويله إلى Base64 للواجهة
        const audioBuffer = fs.readFileSync(outputPath);
        const audioBase64 = audioBuffer.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        // حذف الملف المؤقت للحفاظ على مساحة القرص
        fs.unlinkSync(outputPath);

        console.log(`✅ [نجاح] تم توليد الصوت مجاناً وبدون حدود!`);
        res.json({ success: true, audioUrl: audioUrl });

    } catch (error) {
        console.error('❌ خطأ في محرك Edge TTS:', error.message);
        res.status(500).json({ 
            error: 'حدث خطأ. تأكد من تثبيت مكتبة edge-tts بكتابة: pip install edge-tts في الـ Terminal.' 
        });
    }
});


// ==========================================
// 🎬 مسار 6: محرك المونتاج الخفي (FFmpeg + Edge TTS)
// ==========================================

// دالة لجلب مدة الملف الصوتي
const getAudioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });
};

// دالة لإنشاء ملف الترجمة الاحترافي (ASS) للنص العربي
const createAssFile = (text, duration, outputPath) => {
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = (seconds % 60).toFixed(2);
        return `${h}:${m.toString().padStart(2, '0')}:${s.padStart(5, '0')}`;
    };

    // إعدادات خط سينمائية: أصفر نيون، حواف سوداء، في منتصف الشاشة
    const assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,95,&H0000D7FF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,4,2,10,10,960,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,${formatTime(duration)},Default,,0,0,0,,{\\b1}${text}`;
    
    fs.writeFileSync(outputPath, assContent, 'utf8');
};

app.post('/api/render-video', upload.any(), async (req, res) => {
    console.log(`\n🎬 جاري بدء عملية المونتاج السينمائي الآلي...`);
    
    try {
        const scenes = JSON.parse(req.body.scenes);
        const voiceId = req.body.voiceId || 'en-US-ChristopherNeural';
        const files = req.files;

        // إنشاء مجلد temp إذا لم يكن موجوداً
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        let videoClips = [];

        // معالجة كل مشهد على حدة
        for (let i = 0; i < scenes.length; i++) {
            console.log(`⏳ جاري معالجة المشهد رقم ${i + 1}...`);
            const scene = scenes[i];
            
            // 1. العثور على الصورة المرفوعة لهذا المشهد
            const imageFile = files.find(f => f.fieldname === `image_${i}`);
            if (!imageFile) throw new Error(`الصورة مفقودة للمشهد رقم ${i + 1}`);
            const imagePath = path.join(__dirname, imageFile.path);

            // 2. توليد الصوت عبر Edge-TTS
            const audioPath = path.join(tempDir, `audio_${i}.mp3`);
            const cleanText = scene.narration.replace(/"/g, "'").replace(/\n/g, ' ');
            // تضخيم وإبطاء الصوت لزيادة الفخامة والدراما
            const ttsCommand = `edge-tts --voice ${voiceId} --text "${cleanText}" --rate=-15% --pitch=-10Hz --write-media "${audioPath}"`;
            await execPromise(ttsCommand);

            // 3. حساب مدة الصوت
            const duration = await getAudioDuration(audioPath);

            // 4. إنشاء ملف الترجمة العربي (ASS)
            const assFileName = `sub_${i}.ass`; // نستخدم اسماً قصيراً لتجنب مشاكل المسارات في الويندوز
            const assPath = path.join(__dirname, assFileName);
            createAssFile(scene.onScreenText, duration, assPath);

            // 5. دمج (صورة + صوت + نص) للمشهد
            const sceneOutputPath = path.join(tempDir, `scene_${i}.mp4`);
            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(imagePath)
                    .loop(1) // تكرار الصورة الثابتة
                    .input(audioPath)
                    .outputOptions([
                        '-c:v libx264',
                        '-tune stillimage',
                        '-c:a aac',
                        '-b:a 192k',
                        '-pix_fmt yuv420p',
                        `-t ${duration}`,
                        // اقتصاص الصورة لتلائم الهاتف (9:16) وطباعة النص العربي
                        `-vf scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,ass=${assFileName}`
                    ])
                    .save(sceneOutputPath)
                    .on('end', resolve)
                    .on('error', reject);
            });

            videoClips.push(sceneOutputPath);
            
            // تنظيف الملفات المؤقتة للمشهد
            fs.unlinkSync(assPath);
            fs.unlinkSync(imagePath);
            fs.unlinkSync(audioPath);
        }

        console.log(`🎞️ جاري دمج كافة المشاهد في فيديو واحد نهائي...`);
        
        // 6. تجميع كل المشاهد في فيديو واحد
        const finalOutputPath = path.join(__dirname, 'final_reel.mp4');
        const listPath = path.join(tempDir, 'concat_list.txt');
        const fileContent = videoClips.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
        fs.writeFileSync(listPath, fileContent);

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(listPath)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions(['-c copy']) // نسخ بدون إعادة ترميز (سريع جداً)
                .save(finalOutputPath)
                .on('end', resolve)
                .on('error', reject);
        });

        // تنظيف الملفات المتبقية
        fs.unlinkSync(listPath);
        videoClips.forEach(clip => fs.unlinkSync(clip));

        console.log(`✅ [نجاح] اكتمل تصدير الفيديو النهائي!`);
        
        // إرسال الفيديو كملف للتحميل
        res.download(finalOutputPath, 'AutoFactory_Reel.mp4');

    } catch (error) {
        console.error('❌ خطأ في محرك المونتاج:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء رندرة الفيديو: ' + error.message });
    }
});

// ==========================================
// 🔐 مسار التحقق من Webhook (تطلبه Meta مرة واحدة)
// ==========================================
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "cherif"; 

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ تم التحقق من Webhook بنجاح من قبل Meta!');
            res.status(200).send(challenge); 
        } else {
            console.log('❌ فشل التحقق: الكلمة السرية غير متطابقة.');
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});



// ==========================================
// 🪝 مسار Webhook الذكي (الردود الديناميكية)
// ==========================================
app.post('/webhook', async (req, res) => {
    let body = req.body;

    if (body.object === 'instagram' || body.object === 'page') {
        
        body.entry.forEach(async function(entry) {
            if (entry.changes && entry.changes.length > 0) {
                let change = entry.changes[0].value;
                let field = entry.changes[0].field;

                if (field === 'comments' && change.text) {
                    const commentText = change.text.trim();
                    const commentId = change.id;
                    const commenterUsername = change.from ? change.from.username : 'عميلنا العزيز';
                    const commenterId = change.from ? change.from.id : 'unknown';

                    // 1. حماية ضد الرد على النفس (لتجنب الحلقة المفرغة)
                    if (commenterUsername === 'thegherbiai') {
                        return; 
                    }

                    try {
                        // 2. جلب جميع الحملات النشطة من قاعدة البيانات
                        const activeCampaigns = await Campaign.find({ is_active: true });
                        const lowerComment = commentText.toLowerCase();

                        // 3. البحث عن تطابق مع أي كلمة مفتاحية لحملة نشطة
                        let matchedCampaign = null;
                        for (const campaign of activeCampaigns) {
                            if (lowerComment.includes(campaign.keyword.toLowerCase())) {
                                matchedCampaign = campaign;
                                break; // نكتفي بأول تطابق نجده
                            }
                        }

                        // إذا لم يتم العثور على كلمة مفتاحية تابعة لحملة، نتجاهل التعليق
                        if (!matchedCampaign) {
                            console.log(`🛡️ [فلترة] تعليق عادي من [@${commenterUsername}]: "${commentText}"`);
                            return;
                        }

                        console.log(`\n🎯 [تم اصطياد العميل!] حملة: "${matchedCampaign.keyword}" | العميل: [@${commenterUsername}]`);

                        // 4. تحديث أو إنشاء بيانات العميل (Lead)
                        await Lead.findOneAndUpdate(
                            { instagram_id: commenterId },
                            { 
                                $set: { 
                                    username: commenterUsername, 
                                    last_keyword: matchedCampaign.keyword, 
                                    last_interaction: Date.now() 
                                },
                                $inc: { interaction_count: 1 }
                            },
                            { upsert: true, returnDocument: 'after' } // 👈 تم إصلاح التحذير القديم هنا
                        );

                        // 5. زيادة عداد استخدام الحملة برمجياً
                        await Campaign.findByIdAndUpdate(matchedCampaign._id, { $inc: { usage_count: 1 } });
                        console.log(`💾 تم حفظ العميل وتحديث إحصائيات الحملة.`);

                        // 6. إرسال الرسالة المخصصة في الخاص (DM)
                        // نستبدل كلمة {username} باسم العميل لنجعل الرسالة شخصية!
                        const personalizedDm = matchedCampaign.dm_message.replace(/{username}/g, commenterUsername);
                        const messageData = {
                            recipient: { comment_id: commentId },
                            message: { text: personalizedDm }
                        };

                        try {
                            // نستخدم متغيرات VERSION و TOKEN الموجودة لديك في الأعلى
                            await axios.post(
                                `https://graph.facebook.com/${VERSION}/me/messages?access_token=${TOKEN}`,
                                messageData
                            );
                            console.log("✅ [1] تم إرسال رسالة الخاص (DM) بنجاح!");
                        } catch (error) {
                            console.error("❌ فشل إرسال الـ DM:", error.response ? error.response.data : error.message);
                        }

                        // 7. الرد المخصص على التعليق العام
                        const personalizedReply = matchedCampaign.public_reply.replace(/{username}/g, commenterUsername);
                        const replyData = {
                            message: personalizedReply
                        };

                        try {
                            await axios.post(
                                `https://graph.facebook.com/${VERSION}/${commentId}/replies?access_token=${TOKEN}`,
                                replyData
                            );
                            console.log("✅ [2] تم الرد على التعليق العام بنجاح!");
                        } catch (error) {
                            console.error("❌ فشل الرد على التعليق:", error.response ? error.response.data : error.message);
                        }

                    } catch (dbError) {
                        console.error("❌ خطأ داخلي في محرك الردود الذكي:", dbError);
                    }
                }
            }
        });
        
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});


// تغيير حالة الحملة (تشغيل/إيقاف)
app.patch('/api/campaigns/:id/toggle', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        campaign.is_active = !campaign.is_active;
        await campaign.save();
        res.json({ success: true, is_active: campaign.is_active });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في تغيير حالة الحملة' });
    }
});



// حذف الحملة
app.delete('/api/campaigns/:id', async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في حذف الحملة' });
    }
});



// ==========================================
// 📊 مسار جلب بيانات العملاء (لعرضها في لوحة التحكم)
// ==========================================
app.get('/api/leads', async (req, res) => {
    try {
        // جلب كل العملاء من الأحدث للأقدم
        const leads = await Lead.find().sort({ last_interaction: -1 }); 
        res.json({ success: true, count: leads.length, data: leads });
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error);
        res.status(500).json({ error: 'حدث خطأ في جلب البيانات' });
    }
});


// ==========================================
// 🗑️ مسار حذف عميل محدد من قاعدة البيانات
// ==========================================
app.delete('/api/leads/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        await Lead.findByIdAndDelete(leadId);
        console.log(`🗑️ تم حذف العميل (ID: ${leadId}) بنجاح.`);
        res.json({ success: true, message: 'تم الحذف بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في حذف العميل:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء الحذف' });
    }
});


// ==========================================
// 🗄️ مسار 6: الخزنة السرية (التقاط العملاء وإرسال الملفات)
// ==========================================




// إعداد مرسل الإيميلات (Transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/vault/submit', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان.' });
    }

    try {
        // 1. الحفظ في قاعدة البيانات السحابية
        const newLead = new Lead({ name, email });
        await newLead.save();
        console.log(`\n🎯 عميل محتمل جديد: ${name} (${email})`);

        // 2. إعداد وإرسال الإيميل
        const mailOptions = {
            from: `"المهندس محمد الشريف" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🚀 الكود المصدري: بوت التداول الخوارزمي (Python)',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                    <h2 style="color: #059669;">مرحباً ${name}!</h2>
                    <p>أنت الآن تمتلك أفضلية تقنية. كما وعدتك، هذا هو السكربت الخاص ببوت التداول المبني بلغة Python.</p>
                    <p>تأكد من تثبيت مكتبات <code>pandas</code> و <code>backtrader</code> قبل تشغيل الكود.</p>
                    
                    <div style="margin: 30px 0;">
                        <a href="https://github.com/midouma25/your-repo-link" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">📥 تحميل السكربت الآن</a>
                    </div>
                    
                    <p>إذا كنت ترغب في احتراف بناء أنظمة مماثلة، لا تنسَ إلقاء نظرة على معسكرات الأكاديمية.</p>
                    <p>بالتوفيق،<br><strong>محمد الشريف</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ تم إرسال السكربت بنجاح إلى: ${email}`);

        res.status(200).json({ success: true, message: 'تم الإرسال بنجاح!' });
    } catch (error) {
        console.error('❌ خطأ في النظام:', error.message);
        res.status(500).json({ error: 'فشلت عملية المعالجة.' });
    }
});
// كود الاتصال بقاعدة البيانات
console.log("⏳ جاري محاولة الاتصال بقاعدة البيانات..."); // أضفنا هذا السطر لنرى هل يصل الكود إلى هنا

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (Online)'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
  });




  // ==========================================
// 🎯 مسارات مدير الحملات (Campaigns API)
// ==========================================
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ created_at: -1 });
        res.json({ success: true, data: campaigns });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ في جلب الحملات' });
    }
});




app.post('/api/campaigns', async (req, res) => {
    try {
        const newCampaign = new Campaign(req.body);
        await newCampaign.save();
        res.json({ success: true, message: 'تم إنشاء الحملة بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الحفظ (قد تكون الكلمة مكررة)' });
    }
});


// ==========================================
// 🎬 مسار 7: استوديو الإعلانات التجارية (CommercialLab Engine) - [النسخة الهجينة مع التشويق الفيروسي]
// ==========================================
app.post('/api/generate-commercial', async (req, res) => {
    const { productIdea, targetAudience, adVibe, brandColors } = req.body;

    if (!productIdea) {
        return res.status(400).json({ error: 'الرجاء توفير فكرة المنتج أو الإعلان.' });
    }

    try {
        console.log(`\n🎥 جاري إخراج إعلان تجاري سينمائي (عالي التشويق) لـ: ${productIdea.substring(0, 30)}...`);

        const systemPrompt = `You are an elite Commercial Director and Madison Avenue Creative Director.
        Your task is to create a top-tier, 20-25 second commercial script for a high-end product/service.
        The ad must feel like an Apple, Nike, or Coca-Cola commercial: emotional, visually stunning, and highly engaging.

        🚨 LANGUAGE RULES:
        - The visual prompts (videoPrompt), camera movements, and shot types MUST be in pure English.
        - The voice-over (narration), on-screen text (onScreenText), and general descriptions MUST be in Arabic.

        🚨 PACING & STRUCTURE (Strictly 5 Scenes):
        - Scene 1 (0-3s): The Suspense Hook (Pattern Interrupt). 🚨 CRITICAL: Start with a shocking visual, a mysterious action, or an extreme close-up that makes the viewer immediately ask "What is happening?". The narration MUST be a provocative question or a shocking statement to build instant suspense.
        - Scene 2 (3-8s): The Problem/Desire (Emotional build-up, slow-motion to contrast the fast hook).
        - Scene 3 (8-14s): The Reveal/Solution (Epic product appearance, perfect lighting, energetic).
        - Scene 4 (14-19s): The Impact (People smiling, sleek UI, or satisfying usage).
        - Scene 5 (19-22s): The CTA (Logo placement, strong final message).

        🚨 VIDEO PROMPTS FOR AI (Runway/Veo/Sora):
        Make the \`videoPrompt\` extremely detailed and technical. Use cinematic terms.
        Example: "Shot on 35mm lens, Arri Alexa, cinematic lighting, volumetric fog, dynamic tracking shot, hyper-realistic, 8k resolution, ${brandColors ? `featuring ${brandColors} color palette accents` : 'moody color grading'}."
        Never use words like "3d render", "cartoon", or "illustration". It must look like real life.

        Output ONLY pure JSON in this exact format:
        {
          "adTitle": "اسم الإعلان التجاري (العنوان الجذاب)",
          "marketingAngle": "الزاوية التسويقية المستخدمة",
          "soundtrackVibe": "وصف دقيق للموسيقى والمؤثرات الصوتية المطلوبة (يجب أن تبدأ بصوت صادم أو صمت درامي للتشويق)",
          "scenes": [
            {
              "sceneNumber": 1,
              "duration": "0-3s",
              "shotType": "Extreme Close-Up (ECU)",
              "cameraMovement": "Fast Pan Right or Sudden Zoom",
              "videoPrompt": "English prompt for AI video generation...",
              "narration": "سؤال مستفز أو عبارة صادمة باللغة العربية هنا للتشويق...",
              "onScreenText": "نص قصير يظهر على الشاشة (اختياري)",
              "sfx": "وصف المؤثر الصوتي هنا (مثال: Whoosh قوي، دقات قلب سريعة، أو كسر صمت)"
            }
          ]
        }`;

        const userRequest = `Product/Idea: ${productIdea}\nTarget Audience: ${targetAudience || 'General Audience'}\nAd Vibe/Style: ${adVibe || 'Cinematic & Emotional'}`;
        
        let adData = null;
        let successEngine = "";

        // =========================================================
        // 🛡️ المحرك الهجين المضاد للأعطال (Groq -> Llama -> Gemini)
        // =========================================================
        
        // 1. المحاولة الأولى: سيرفرات Groq (صاروخية ومستقرة جداً)
        try {
            console.log(`⏳ جاري المحاولة عبر سيرفرات Groq (qwen/qwen3.8-27b)...`);
            const currentGroq = getGroqClient(); 
            const chatCompletion = await currentGroq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userRequest }
                ],
                model: 'qwen/qwen3.8-27b',
                temperature: 0.85, // 👈 رفعنا الحرارة قليلاً لزيادة جرعة الإبداع والجنون في التشويق
                max_tokens: 3000,
                response_format: { type: "json_object" }
            });
            
            const rawContent = chatCompletion.choices[0].message.content;
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            adData = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
            successEngine = "Groq (Qwen)";
            console.log(`✅ تم التوليد بنجاح عبر: ${successEngine}`);
        } catch (groqError) {
            console.log(`⚠️ سيرفرات Groq (Qwen) مشغولة. جاري الانتقال للخطة ب...`);
        }

        // 2. المحاولة الثانية: سيرفرات Groq (Llama-3.1 كبديل)
        if (!adData || !adData.scenes) {
            try {
                console.log(`⏳ جاري المحاولة عبر سيرفرات Groq (llama-3.1-70b-versatile)...`);
                const currentGroq = getGroqClient();
                const chatCompletion = await currentGroq.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userRequest }
                    ],
                    model: 'llama-3.1-70b-versatile',
                    temperature: 0.85,
                    max_tokens: 3000,
                    response_format: { type: "json_object" }
                });
                
                const rawContent = chatCompletion.choices[0].message.content;
                const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
                adData = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
                successEngine = "Groq (Llama 3.1)";
                console.log(`✅ تم التوليد بنجاح عبر: ${successEngine}`);
            } catch (llamaError) {
                console.log(`⚠ سيرفرات Llama مشغولة. جاري تفعيل بروتوكول Gemini...`);
            }
        }

        // 3. المحاولة الثالثة: سيرفرات Gemini (الملاذ الأخير)
        if (!adData || !adData.scenes) {
            const geminiPrompt = systemPrompt + "\n\nRequest:\n" + userRequest;
            const fallbackModels = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-pro-latest", "gemini-flash-latest"];
            
            for (const modelName of fallbackModels) {
                try {
                    console.log(`⏳ جاري المحاولة عبر سيرفر Gemini (${modelName})...`);
                    const genAI = getGeminiClient(); 
                    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: "application/json" } });
                    const result = await model.generateContent(geminiPrompt);
                    let textResult = result.response.text();
                    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
                    adData = JSON.parse(jsonMatch ? jsonMatch[0] : textResult);
                    
                    if(adData && adData.scenes && adData.scenes.length > 0) {
                         successEngine = `Gemini (${modelName})`;
                         console.log(`✅ تم التوليد بنجاح عبر: ${successEngine}`);
                         break; 
                    }
                } catch (error) {
                    console.log(`⚠️️ محاولة السيرفر ${modelName} فشلت للانتقال للذي يليه.`);
                    continue;
                }
            }
        }

        if (!adData || !adData.scenes) {
             return res.status(503).json({ error: 'جميع السيرفرات (Groq و Gemini) مزدحمة حالياً. الرجاء المحاولة بعد قليل.' });
        }
        
        res.json({ success: true, commercial: adData });

    } catch (error) {
        console.error('❌ خطأ في محرك الإعلانات:', error.message);
        res.status(500).json({ error: 'فشل في بناء السيناريو الإعلاني.' });
    }
});

// ==========================================
// 💡 مسار: إلهام مشاريع وإعلانات السوق الجزائري (Algerian Market Ideas)
// ==========================================
app.post('/api/suggest-commercial-idea', async (req, res) => {
    const { category } = req.body;

    try {
        console.log(`\n💡 جاري ابتكار فكرة مشروع وإعلان للسوق الجزائري في قطاع: ${category}...`);

        const systemPrompt = `أنت مستشار أعمال (Business Developer) ومخرج إعلانات محترف.
        نحن الآن في عام 2026. السوق المستهدف هو: "الجزائر" (Algeria).
        مهمتك هي اقتراح فكرة مشروع تقني أو خدمة (SaaS، تطبيق، أتمتة) تحل مشكلة حقيقية في السوق الجزائري اليوم، بالإضافة إلى تحديد الجمهور المستهدف، ونمط الإعلان السينمائي الأنسب لبيع هذه الفكرة.

        🚨 تجنب الأفكار غير القابلة للتطبيق في الجزائر (مثل التطبيقات التي تعتمد حصرياً على PayPal أو Stripe). ركز على الدفع عند الاستلام، بريدي موب، التوصيل (Yalidine ونحوها)، رقمنة القطاع الطبي، الإداري، أو التجارة المحلية (الحوانيت، الحرفيين، الوكالات).

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "productIdea": "شرح فكرة المشروع في سطرين (يجب أن تحل مشكلة جزائرية حقيقية)",
          "targetAudience": "الجمهور الجزائري المستهدف بدقة (مثال: أطباء الأسنان، أصحاب المتاجر الإلكترونية، وكالات كراء السيارات)",
          "adVibe": "اختر واحداً فقط من هذه الأنماط (Cinematic & Emotional, Fast Paced & Energetic, Tech Minimalist, Humorous & Relatable) واشرح بين قوسين لماذا يناسب العقلية الجزائرية"
        }`;

        let userPrompt = "";
        switch (category) {
            case 'local_business':
                userPrompt = "اقترح فكرة تطبيق أو منصة SaaS لرقمنة المحلات التقليدية، الحرفيين، أو وكالات كراء السيارات في الجزائر.";
                break;
            case 'healthcare':
                userPrompt = "اقترح فكرة منصة أو أتمتة لحل فوضى المواعيد أو إدارة العيادات (أطباء، صيادلة، مخابر) في الجزائر.";
                break;
            case 'ecommerce':
                userPrompt = "اقترح فكرة أداة أو خدمة لحل مشاكل التجارة الإلكترونية في الجزائر (التوصيل، الروتور، تأكيد الطلبيات، أو التسويق).";
                break;
            case 'youth_edu':
                userPrompt = "اقترح فكرة منصة للطلبة الجامعيين في الجزائر أو الشباب الباحثين عن عمل، عمل حر، أو تعلم مهارات حديثة.";
                break;
            default:
                userPrompt = "اقترح فكرة مشروع تقني مربح جداً ومناسب للسوق الجزائري حالياً.";
        }

        const currentGroq = getGroqClient(); 
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.85,
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(chatCompletion.choices[0].message.content);
        res.json({ success: true, ideaData: data });

    } catch (error) {
        console.error('❌ خطأ في جلب إلهام السوق الجزائري:', error.message);
        res.status(500).json({ error: 'فشل في ابتكار الفكرة.' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 خادم AutoFactory يعمل على ${PORT}`));