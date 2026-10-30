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
const CommercialAd = require('./models/CommercialAd');

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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
// 🎬 مسار 7: استوديو الإعلانات التجارية (CommercialLab Engine) - [النسخة الهجينة مع سير عمل Image-to-Video]
// ==========================================
app.post('/api/generate-commercial', async (req, res) => {
    const { productIdea, targetAudience, adVibe, brandColors } = req.body;

    if (!productIdea) {
        return res.status(400).json({ error: 'الرجاء توفير فكرة المنتج أو الإعلان.' });
    }

    try {
        console.log(`\n🎥 جاري إخراج إعلان تجاري (سير عمل احترافي) لـ: ${productIdea.substring(0, 30)}...`);

const systemPrompt = `You are an elite Commercial Director and Madison Avenue Creative Director.
        Your task is to create a top-tier, hyper-engaging short-form commercial script (15-20 seconds max) for a high-end product/service.

        🚨 LANGUAGE RULES:
        - The visual prompts (videoPrompt, imagePrompt, imageToVideoPrompt), camera movements, and shot types MUST be in pure English.
        - The voice-over (narration), on-screen text (onScreenText), and general descriptions MUST be in Arabic.

        🚨 SPECIAL VIBE RULES:
        - If the Vibe is "Personal Storytelling (Founder Story - Relatable POV)", YOU MUST FOLLOW THIS FAST-PACED 4-SCENE STRUCTURE (Max 15 seconds total):
          1. THE PROTAGONIST: The main character is the CUSTOMER/USER experiencing the pain. 
          2. THE IMAGE REFERENCE HOOK: You MUST start every \`videoPrompt\` and \`imagePrompt\` in this vibe with this exact phrase: "[Character Reference: Use the attached photo of the user as the main subject]. A hyper-realistic shot of..."
          3. Scene 1 (0-3s - The Pain): Protagonist suffering from the daily problem (e.g., headache, chaos, paperwork).
          4. Scene 2 (3-6s - The Click): Fast match-cut to protagonist using the digital solution (e.g., WhatsApp booking) on their phone.
          5. Scene 3 (6-10s - The Relief): Instant peace. Protagonist is relaxed and the environment is organized.
          6. Scene 4 (10-15s - The B2B Pitch): The narration flips to target professionals/business owners. Example: "Want to avoid this chaos in your business? Get our system today."

        🚨 PACING & STRUCTURE (For all other standard vibes, keep 5 scenes. If Founder Story, strictly 4 scenes):
        - Make it extremely fast-paced. No slow boring transitions.
        
        🚨 THE 3 PROMPT SYSTEM (HYPER-REALISM IS MANDATORY):
        For each scene, you must generate 3 distinct English prompts to optimize the AI workflow:
        1. \`videoPrompt\`: Direct Text-to-Video. Include hyper-realistic keywords (Arri Alexa, 8k, photorealistic).
        2. \`imagePrompt\`: Static frame for Midjourney/Flux. ONLY composition, lighting, and subjects. No motion.
        3. \`imageToVideoPrompt\`: Motion instructions ONLY for Luma/Runway I2V (e.g., "Camera fast zoom, subject smiles").

        Output ONLY pure JSON in this exact format:
        {
          "adTitle": "اسم الإعلان التجاري (العنوان الجذاب)",
          "marketingAngle": "الزاوية التسويقية المستخدمة",
          "soundtrackVibe": "وصف دقيق للموسيقى والمؤثرات الصوتية المطلوبة",
          "scenes": [
            {
              "sceneNumber": 1,
              "duration": "0-3s",
              "shotType": "Extreme Close-Up (ECU)",
              "cameraMovement": "Fast Pan Right or Sudden Zoom",
              "videoPrompt": "English prompt...",
              "imagePrompt": "English prompt...",
              "imageToVideoPrompt": "English prompt...",
              "narration": "التعليق الصوتي باللغة العربية...",
              "onScreenText": "نص قصير...",
              "sfx": "المؤثر الصوتي..."
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
                temperature: 0.85, 
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
                    console.log(`⚠ محاولة السيرفر ${modelName} فشلت للانتقال للذي يليه.`);
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
// 🎬 مسار 8: محرك تعديل المشاهد (Director's Cut - Scene Enhancer)
// ==========================================
app.post('/api/enhance-scene', async (req, res) => {
    const { originalScene, userInstruction, brandColors } = req.body;

    if (!originalScene || !userInstruction) {
        return res.status(400).json({ error: 'بيانات المشهد أو التعليمات مفقودة.' });
    }

    try {
        console.log(`\n🎬 جاري تعديل المشهد رقم ${originalScene.sceneNumber} بناءً على توجيهات المخرج...`);

        const systemPrompt = `You are a Hollywood Commercial Director assisting the lead human director.
        The human director wants to change a specific scene in a commercial.
        
        Here is the ORIGINAL SCENE JSON:
        ${JSON.stringify(originalScene)}

        Here is the HUMAN DIRECTOR'S NEW INSTRUCTION (in Arabic or English):
        "${userInstruction}"

        YOUR MISSION:
        1. Rewrite the scene to perfectly incorporate the human's instruction.
        2. Keep the exactly same JSON structure.
        3. 🚨 CRITICAL: The visual prompts MUST remain HYPER-REALISTIC (use keywords like: photorealistic, Arri Alexa 65, 8k, cinematic lighting). NEVER use CGI or cartoon terms.
        4. If the vibe is a "Founder Story", ensure the prompt starts with: "[Character Reference: Use the attached photo of the user as the main subject]. A hyper-realistic shot of..."
        5. Maintain the 3-prompt system: \`videoPrompt\` (Text-to-Video), \`imagePrompt\` (Static Midjourney), \`imageToVideoPrompt\` (Motion for Luma).
        6. Update the Arabic \`narration\` and \`sfx\` to match the new action.

        Output ONLY pure JSON for this SINGLE updated scene object.`;

        let updatedScene = null;

        // سنستخدم Groq (Qwen) لسرعته ومجانيته في التعديلات
        try {
            const currentGroq = getGroqClient(); 
            const chatCompletion = await currentGroq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: "Update the scene and return ONLY the JSON object." }
                ],
                model: 'qwen/qwen3.8-27b',
                temperature: 0.7,
                max_tokens: 1500,
                response_format: { type: "json_object" }
            });
            
            const rawContent = chatCompletion.choices[0].message.content;
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            updatedScene = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
            console.log(`✅ تم تعديل المشهد بنجاح عبر Groq.`);
        } catch (groqError) {
            console.log(`⚠️ سيرفر Groq مشغول. سيتم استخدام Gemini للتعديل...`);
            const genAI = getGeminiClient(); 
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
            const result = await model.generateContent(systemPrompt);
            let textResult = result.response.text();
            const jsonMatch = textResult.match(/\{[\s\S]*\}/);
            updatedScene = JSON.parse(jsonMatch ? jsonMatch[0] : textResult);
        }

        res.json({ success: true, updatedScene });

    } catch (error) {
        console.error('❌ خطأ في تعديل المشهد:', error.message);
        res.status(500).json({ error: 'فشل في تعديل المشهد.' });
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
            // 🚀 القطاعات الأربعة الجديدة للسوق الجزائري
            case 'real_estate':
                userPrompt = "اقترح فكرة منصة أو تطبيق لحل مشاكل العقارات، الكراء، أو رقمنة خدمات المقاولات والبحث عن الحرفيين (البناء، الترصيص) في الجزائر.";
                break;
            case 'logistics':
                userPrompt = "اقترح فكرة تطبيق لحل مشاكل النقل السريع، التوصيل الثقيل بين الولايات، أو إدارة أساطيل سيارات الأجرة والنقل في الجزائر.";
                break;
            case 'agriculture':
                userPrompt = "اقترح فكرة مشروع تقني أو منصة SaaS لقطاع الفلاحة، توزيع المنتجات الزراعية، أو دعم الفلاحين وتأجير العتاد في الجزائر.";
                break;
            case 'tourism_events':
                userPrompt = "اقترح فكرة منصة لرقمنة قطاع السياحة الداخلية (الصحراء/السواحل)، حجوزات دور الضيافة، أو تنظيم الفعاليات والأعراس في الجزائر.";
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


// ==========================================
// 📚 مسارات أرشيف الإعلانات (Commercial Vault API)
// ==========================================

// 1. حفظ إعلان جديد في الأرشيف
app.post('/api/commercial-ads/save', async (req, res) => {
    try {
        const adData = req.body;
        const newAd = new CommercialAd(adData);
        await newAd.save();
        res.json({ success: true, message: 'تم حفظ الإعلان في الأرشيف بنجاح 📚' });
    } catch (error) {
        console.error('❌ خطأ في حفظ الإعلان:', error);
        res.status(500).json({ error: 'فشل في حفظ الإعلان في قاعدة البيانات.' });
    }
});

// 2. جلب جميع الإعلانات المحفوظة
app.get('/api/commercial-ads', async (req, res) => {
    try {
        const ads = await CommercialAd.find().sort({ created_at: -1 });
        res.json({ success: true, data: ads });
    } catch (error) {
        console.error('❌ خطأ في جلب الأرشيف:', error);
        res.status(500).json({ error: 'فشل في جلب الأرشيف.' });
    }
});

// 3. حذف إعلان من الأرشيف
app.delete('/api/commercial-ads/:id', async (req, res) => {
    try {
        await CommercialAd.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف الإعلان من الأرشيف' });
    } catch (error) {
        console.error('❌ خطأ في حذف الإعلان:', error);
        res.status(500).json({ error: 'فشل في حذف الإعلان.' });
    }
});



// ==========================================
// 🧠 المحرك الذكي الموحد (Google First -> Groq Fallback)
// ==========================================
// ==========================================
// 🧠 المحرك الذكي الموحد (Google First -> Groq Fallback)
// ==========================================
async function generateContentSmart(systemPrompt, userPrompt, temperature = 0.7, maxTokens = 15000) {
    // 🛡️ ترسانة موديلات جوجل الشاملة (مرتبة لتناسب مفاتيحك الحالية وتسريع الاستجابة)
    const geminiModels = [
        "gemini-3.5-flash",       // النموذج المستقر والسريع جداً (Generally Available)
        "gemini-3.5-flash-lite",  // نسخة خفيفة للطوارئ
        "gemini-3.1-pro-preview", // الأذكى في التحليل العميق
        "gemini-3-flash-preview",
        "gemini-pro-latest",      
        "gemini-flash-latest",
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-omni-1.1-flash",
        "gemma-4-31b-it",         // موديل قوي جداً ومنفصل
        "gemma-4-26b-a4b-it",
        "gemini-3.1-flash-lite",
        "gemini-flash-lite-latest"
    ];

    // 1. الهجوم عبر ترسانة Google Gemini أولاً
    for (const modelName of geminiModels) {
        try {
            console.log(`[المدفع الذكي] 🚀 جاري إطلاق الطلب عبر Google: ${modelName}...`);
            const genAI = getGeminiClient(); // تسحب مفتاح جوجل عشوائي
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: { 
                    responseMimeType: "application/json",
                    temperature: temperature,
                    maxOutputTokens: maxTokens
                } 
            });

            const result = await model.generateContent(`${systemPrompt}\n\nالطلب:\n${userPrompt}`);
            const textResult = result.response.text();
            
            // تنظيف والتأكد من أنه JSON صالح
            const jsonMatch = textResult.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : textResult;
            JSON.parse(cleanJson); // اختبار التحويل

            console.log(`[المدفع الذكي] ✅ إصابة الهدف بدقة عبر: ${modelName} 🎯`);
            return cleanJson;

        } catch (error) {
            console.log(`[المدفع الذكي] ⚠️ السيرفر ${modelName} مشغول أو فشل. جاري التبديل للموديل التالي...`);
        }
    }

    // 2. خطة الطوارئ: اللجوء إلى Groq إذا انهارت كل سيرفرات جوجل الـ 16
    console.log(`[المدفع الذكي] 🔄 جميع سيرفرات جوجل الـ ${geminiModels.length} مشغولة! جاري تفعيل خطة الطوارئ عبر Groq...`);
    try {
        const currentGroq = getGroqClient(); // تسحب مفتاح Groq وتدوره
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'qwen/qwen3.8-27b', // استخدمنا qwen المستقر بدلاً من Llama المتوقف
            temperature: temperature,
            max_tokens: 6000, // سقف Groq الآمن
            response_format: { type: "json_object" }
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : rawContent;
        
        console.log(`[المدفع الذكي] ✅ تم الإنقاذ بنجاح عبر Groq (Qwen) 🛡️`);
        return cleanJson;

    } catch (groqError) {
        console.error(`[المدفع الذكي] ❌ كارثة: جميع الخوادم (Google + Groq) منهارة تماماً!`);
        throw new Error("فشل توليد المحتوى من جميع الخوادم المتاحة.");
    }
}



// ==========================================
// 🎓 مسارات مختبر الأكاديمية (AcademyLab - Course Generator)
// ==========================================

// 1. مسار توليد "هيكل المنهج" (Course Blueprint) - يعتمد على المدفع الذكي
app.post('/api/academy/blueprint', async (req, res) => {
    const { topic, difficulty } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الدورة.' });

    try {
        console.log(`\n📐 جاري هندسة هيكل منهج أكاديمي لموضوع: ${topic}...`);

        const isBootcamp = difficulty.includes('Bootcamp');
        const architectureInstruction = isBootcamp 
            ? `هذا الكورس عبارة عن 'معسكر برمجي شامل' (Bootcamp / Specialization). 
               قم بتقسيمه إلى 4 أو 6 "وحدات ضخمة"، حيث تُعتبر كل وحدة بمثابة كورس مصغر يركز على تقنية محددة (مثل جزء مخصص بالكامل لـ MongoDB، وجزء لـ React).
               يجب أن تُسمي الوحدات بطريقة توحي بأنها تمنح شهادة (مثال: "المسار الأول: إتقان MongoDB [شهادة فرعية]").
               داخل كل مسار، ضع 4 إلى 6 دروس عميقة.`
            : `قم بتقسيم الكورس إلى 3 أو 4 "وحدات رئيسية" (Sections) كحد أقصى، وداخل كل وحدة ضع من 3 إلى 5 "دروس" (Lessons).`;

        const systemPrompt = `أنت مهندس برمجيات كبير (Senior Architect) ومصمم مناهج تعليمية محترف في أكاديمية تقنية متقدمة.
        مهمتك هي بناء "هيكل منهج" (Syllabus) عملي، خالي من الحشو، ومتسلسل منطقياً حول موضوع: "${topic}".
        مستوى الدورة المستهدف هو: "${difficulty || 'متوسط'}".
        
        🚨 قواعد بناء الهيكل:
        1. ${architectureInstruction}
        2. عناوين الدروس يجب أن تكون عملية وتوحي بالتطبيق المباشر (مثال: "بناء أول خادم باستخدام Express" بدلاً من "مقدمة عن Express").
        3. لا تكتب أي شروحات، فقط قم بتوليد الهيكل المنظم.

        رد بصيغة JSON فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "عنوان فخم وجذاب للدورة",
          "courseDescription": "وصف تسويقي وتعليمي للكورس في 3 أسطر يشرح الفائدة النهائية والطريق نحو الاعتماد.",
          "blueprint": [
            {
              "sectionName": "اسم الوحدة أو المسار الفرعي",
              "lessons": [
                { "title": "عنوان الدرس الأول" },
                { "title": "عنوان الدرس الثاني" }
              ]
            }
          ]
        }`;

        // 🚀 استخدام المدفع الذكي
        const rawContent = await generateContentSmart(systemPrompt, "تفضل، قم بهندسة هذا المنهج الآن.", 0.7, 8000);
        const blueprintData = JSON.parse(rawContent);

        res.json({ success: true, data: blueprintData });

    } catch (error) {
        console.error('❌ خطأ في هندسة هيكل المنهج:', error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء بناء هيكل المنهج.' });
    }
});



// 2. مسار "تأليف محتوى الدرس" التفصيلي (Lesson Content Forge) - يعتمد على المدفع الذكي
app.post('/api/academy/forge-lesson', async (req, res) => {
    const { courseTopic, sectionName, lessonTitle, difficulty } = req.body;

    if (!lessonTitle) return res.status(400).json({ error: 'عنوان الدرس مفقود.' });

    try {
        console.log(`\n✍️ جاري صياغة المحتوى الدسم لدرس: "${lessonTitle}"...`);

        const systemPrompt = `أنت كبير مهندسي البرمجيات (Principal Engineer) وأعظم معلم تقني في العالم (Top-Rated Instructor) في منصة تضاهي LeetCode و Coursera. تستخدم دائماً "مبدأ فاينمان" (Feynman Technique) لتبسيط أعقد الأمور.
        مهمتك الآن هي تأليف درس واحد فقط، وعليك أولاً تحليل عنوان الدرس لتحديد نوعه: "نظري/مفاهيمي" أم "برمجي/عملي". بناءً على هذا التحليل، ستصوغ درساً شاملاً، عميقاً، وتفصيلياً جداً (Masterclass).

- موضوع الكورس العام: "${courseTopic}"
        - الوحدة الحالية: "${sectionName}"
        - 📌 الدرس المطلوب كتابته الآن: "${lessonTitle}"
        - مستوى الطالب المستهدف: "${difficulty || 'متوسط'}"

        // ✨ FIX: Exam Mastery Isolation - شرط صارم لعزل مستويات (A0-B2) عن مسار الامتحانات الدولية
        🚨 قاعدة الفصل الصارم لمسار الامتحانات الدولية:
        إذا كان مستوى الطالب (A0 إلى B2)، ركز حصراً على المواقف اليومية، البنية النحوية، والمفردات، ويُمنع منعاً باتاً ذكر امتحانات C2 أو TestDaF. أما إذا كان تصنيف الكورس هو 'EXAM_MASTERY'، فقم بتوليد محتوى يركز حصراً على استراتيجيات الاختبار، كشف الفخاخ، وتصحيح المقالات (Essays).


        🚨 استراتيجية المعلم المخضرم (The Master Teacher Method):
        حلل عنوان الدرس "${lessonTitle}". 
        
        🔴 إذا كان الدرس "نظرياً/مفاهيمياً" (مثال: كيف يعمل الإنترنت، ما هي الـ APIs، مفاهيم قواعد البيانات):
           - ركز على التشبيهات (Analogies) من الحياة اليومية لتبسيط المعقد (مثال: الـ API كالنادل في المطعم).
           - تجنب حشو الأكواد المعقدة، استخدم مقتطفات بسيطة جداً فقط للتوضيح إن لزم الأمر.
           - حقل "dailyQuest" يجب أن يكون سؤال خيارات متعددة (MCQ) يختبر الفهم النظري العميق.

        🔵 إذا كان الدرس "برمجياً/عملياً" (مثال: المتغيرات، بناء خادم، استخدام React Hooks، خوارزميات):
           - القاعدة الذهبية للشرح: (شرح قصير ⬅️ كود ⬅️ ماذا يفعل هذا الكود ⬅️ كود متقدم).
           - أغرق حقل "content" بالأمثلة البرمجية باستخدام علامات الـ Markdown (\`\`\`javascript مثلاً). لا تترك فكرة دون مثال برمجي يوضحها.
           - حقل "codeSnippet" يجب أن يحتوي على كود المشروع النهائي أو الخلاصة الجاهزة للنسخ والتشغيل (بدون شروحات نصية داخله).
           - 🆕 حقل "codeExplanation": يجب أن تشرح فيه وتُشرّح (Anatomy) الكود الموجود في codeSnippet سطراً بسطر أو كتلة بكتلة.
           - حقل "dailyQuest" يجب أن يكون "تحدي كود" (Coding Challenge). (مثال: "أكمل السطر الناقص في الكود التالي"، "ما هو مخرج Output هذا الكود؟"، أو "اكتشف الخطأ Debug").

        🚨 قواعد هندسة المحتوى النصي (The S-Rank Structure):
        يجب أن يكون حقل "content" طويلاً ودسماً جداً (لا يقل عن 800 إلى 1000 كلمة). إياك والاختصار. 
        يجب أن تلتزم التزاماً حرفياً بهيكل الـ Markdown التالي في الشرح:

        ### 🎯 مقدمة الدرس وأهميته
        (ابدأ بمقدمة قوية تشرح فكرة الدرس، لماذا نتعلم هذا الموضوع؟ وما هي المشكلة الحقيقية التي يحلها في سوق العمل وفي المشاريع الكبيرة).

        ### 🧠 الغوص في الأعماق (Deep Dive)
        (هنا قم بشرح المفهوم التقني بالتفصيل الممل. فكك المفهوم إلى أجزاء صغيرة. استخدم العناوين الفرعية #### لشرح كل جزء على حدة. اشرح كيف تعمل التقنية تحت الغطاء Under the hood. تذكر: أكثر من الأكواد هنا إذا كان الدرس برمجياً!).

        ### ⚙️ التطبيق العملي وسيناريوهات الاستخدام
        (أعطِ أمثلة واقعية Real-world Use Cases. متى نستخدم هذه التقنية؟ ولماذا نفضلها على البدائل الأخرى؟).

        ### ⚠️ أخطاء شائعة وأفضل الممارسات (Pro Tips)
        (فقرة بالغة الأهمية: ما هي الأخطاء التي يقع فيها المبرمجون المبتدئون عند استخدام هذه التقنية؟ وكيف يتجنبها المحترفون؟ اذكر الـ Best Practices).

        🚨 قواعد التنسيق الإجبارية (Markdown):
        - استخدم (###) للعناوين الرئيسية المذكورة أعلاه.
        - استخدم (####) للعناوين الفرعية داخل الشرح.
        - اترك سطرين فارغين (\\n\\n) بين كل فقرة وأخرى لإنشاء "تنفس بصري" مريح للطالب.
        - استخدم **الخط العريض** للكلمات المفتاحية والمصطلحات التقنية.
        - استخدم القوائم النقطية (-) بكثرة لتنظيم الأفكار.

        🚨 قواعد هيكل JSON الصارمة (CRITICAL):
        - حقل "options" في "dailyQuest" يجب أن يكون مصفوفة من 4 نصوص مسطحة (Flat Strings) فقط. لا تضع مصفوفات متداخلة!
        - "correctAnswerIndex": يجب أن يكون عشوائياً (0, 1, 2, أو 3).
        - "explanation": اشرح بالتفصيل العلمي والمنطقي لماذا هذه الإجابة أو هذا الكود هو الصحيح دوناً عن غيره.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "content": "الشرح التفصيلي المهيكل بـ Markdown هنا...",
          "codeSnippet": "const app = express(); \\n// الكود الفعلي هنا",
          "codeExplanation": "🔬 تشريح الكود: \\n- السطر الأول: قمنا باستدعاء المكتبة لكي...\\n- الدالة الرئيسية: تقوم بـ...",
          "dailyQuest": {
            "question": "السؤال النظري أو تحدي الكود هنا؟",
            "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
            "correctAnswerIndex": 2,
            "explanation": "الإجابة صحيحة لأن..."
          }
        }`;

        // 🚀 استخدام المدفع الذكي بطاقة استيعابية ضخمة (15000 توكن) ليتمكن Gemini من التوسع في الشرح
        const rawContent = await generateContentSmart(systemPrompt, "أكتب المحتوى الاحترافي والمطول لهذا الدرس الآن.", 0.8, 15000);
        
        // حماية إضافية للتحقق من JSON
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error(`❌ خطأ في صياغة درس (${lessonTitle}):`, error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء كتابة محتوى الدرس.' });
    }
});




// 🚀 مسار V2 المخصص للاستوديو التجريبي (AcademyLab2)
app.post('/api/academy/forge-lesson-v2', async (req, res) => {
    try {
        const { courseTopic, sectionName, lessonTitle, difficulty } = req.body;

        // 🧠 المحرك البيداغوجي: تحديد أسلوب الشرح بناءً على الصعوبة
        let pedagogicalRules = "";

        if (difficulty === 'crash_eli5') {
            pedagogicalRules = `
        🚨 استراتيجية الشرح (مبدأ فاينمان - Explain Like I'm 5):
        أنت الآن لست مجرد مبرمج، أنت أعظم وألطف معلم في العالم. أنت تشرح المفاهيم لشخص يبلغ من العمر 10 سنوات!
        1. ابدأ من الصفر المطلق: لا تفترض أي معرفة مسبقة على الإطلاق.
        2. التشبيهات اليومية (CRITICAL): إياك أن تشرح مفهوماً تقنياً دون ربطه بشيء من الحياة اليومية. (مثال: "قاعدة البيانات تشبه الخزانة المليئة بالأدراج").
        3. التدرج البطيء والآمن: ابدأ بالقصة أو التشبيه أولاً، ثم المفهوم النظري المبسط، وفي النهاية فقط ضع الكود. لا تقفز للأكواد المعقدة مباشرة.
        4. لغة دافئة ومبتسمة: استخدم لغة ودودة جداً، مشجعة، قل كلمات مثل "تخيل معي"، "لا تقلق الأمر بسيط جداً".
        5. التفصيل المريح: اجعل الشرح طويلاً ومفصلاً ولكن بفقرات قصيرة جداً لكي لا يمل القارئ.
            `;
        } else {
            pedagogicalRules = `
        🚨 استراتيجية الشرح (أسلوب المهندسين والخبراء - Masterclass):
        أنت كبير مهندسي البرمجيات (Principal Engineer).
        1. الغوص في الأعماق (Deep Dive): اشرح المفهوم التقني بالتفصيل الممل، فكك المفهوم إلى أجزاء، واشرح كيف تعمل التقنية تحت الغطاء.
        2. التطبيق العملي (Use Cases): متى نستخدم هذه التقنية؟ ولماذا نفضلها على البدائل؟
        3. أخطاء شائعة (Anti-patterns): ما هي الأخطاء التي يقع فيها المبتدئون وكيف يتجنبها المحترفون؟
            `;
        }

        const systemPrompt = `أنت أستاذ تقني من النخبة.
        مهمتك تأليف درس شامل، عميق، وتفصيلي جداً.

        - موضوع الكورس العام: "${courseTopic}"
        - الوحدة الحالية: "${sectionName}"
        - 📌 عنوان الدرس: "${lessonTitle}"

        ${pedagogicalRules}

        🚨 قواعد التنسيق الإجبارية (Markdown):
        - يجب أن تستخدم لغة Markdown مع مسافات الأسطر الإجبارية (\\n\\n).
        - العناوين الرئيسية: تبدأ بـ ### متبوعة بمسافة.
        - العناوين الفرعية: تبدأ بـ #### متبوعة بمسافة.
        - التنفس البصري (CRITICAL): يجب وضع سطرين فارغين تماماً (\\n\\n) قبل وبعد أي عنوان، وبعد كل فقرة.
        - القوائم: استخدم (-) للقوائم النقطية، واترك سطراً فارغاً قبل بداية القائمة.
        - الكلمات البارزة: ضع المصطلحات بين علامتي \` هكذا: \`React\`. والكلمات الهامة بين نجمتين **هام**.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "content": "### 🎯 عنوان رئيسي\\n\\nفقرة أولى...\\n\\n#### عنوان فرعي\\n\\n- نقطة 1\\n- نقطة 2\\n\\nفقرة أخيرة...",
          "codeSnippet": "// الكود الفعلي هنا (إن وجد، وإلا دعه فارغاً)",
          "dailyQuest": {
            "question": "سؤال تقييمي ذكي من محتوى الدرس؟",
            "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
            "correctAnswerIndex": 2,
            "explanation": "شرح مبسط يشرح لماذا هذه الإجابة هي الصحيحة..."
          }
        }`;

        // 💡 10000 توكن لضمان عدم قطع الشرح الطويل
        const content = await generateContentSmart(systemPrompt, `اكتب محتوى الدرس: ${lessonTitle}`, 0.7, 10000);
        res.json({ success: true, data: content });

    } catch (error) {
        console.error("❌ Error in forge-lesson-v2:", error);
        res.status(500).json({ success: false, error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' });
    }
});

// 🗺️ مسار هندسة الهيكل (Blueprint Generator - The Master Architect - V2 Unbounded)
app.post('/api/academy/blueprint1', async (req, res) => {
    const { topic, difficulty } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الدورة.' });

    try {
        console.log(`\n📐 جاري هندسة هيكل أكاديمي ضخم (لا محدود) لموضوع: ${topic}...`);

        // 🧠 المحرك المعماري الديناميكي: تحديد الحجم العملاق وتقسيم المراحل
        let architectureInstruction = "";
        let expectedSize = "";

        if (difficulty.includes('Bootcamp') || topic.includes('معسكر')) {
            expectedSize = "معسكر برمجي عملاق وشامل (Massive Bootcamp - Zero to Hero)";
            architectureInstruction = `
        🚨 الحجم الإلزامي (Silicon Valley Scale): 
        - إياك والتوقف عند 7 وحدات! يجب أن تصمم من (12 إلى 15) "وحدة رئيسية" (Sections) على الأقل.
        - داخل كل وحدة، ضع (6 إلى 10) دروس متدرجة وعميقة.
        
        🚨 المنهجية الإجبارية (Mandatory Phasing): للوصول لهذا الحجم الضخم، قسّم منهجك لهذه المراحل:
        1. التأسيس (الوحدات 1-3): إعداد البيئة، الأساسيات، والمفاهيم الجوهرية.
        2. الغوص العميق (الوحدات 4-7): الخوارزميات، هياكل البيانات، والمفاهيم المتقدمة.
        3. الأنظمة والتكامل (الوحدات 8-11): قواعد البيانات، الـ APIs، والأمان (Security).
        4. مرحلة سوق العمل (الوحدات 12-15): تحسين الأداء، النشر السحابي، ومشروع تخرج متكامل ضخم.`;

        } else if (topic.includes('كراش') || topic.includes('Crash')) {
            expectedSize = "دورة مكثفة وشاملة جداً (Comprehensive Crash Course)";
            architectureInstruction = `
        🚨 الحجم الإلزامي (Intensive Scale): 
        - يجب أن يتجاوز الكورس 7 وحدات! صمم من (8 إلى 12) "وحدة رئيسية" (Sections).
        - داخل كل وحدة، ضع (5 إلى 8) دروس سريعة الإيقاع تركز على التطبيق المباشر.
        
        🚨 المنهجية الإجبارية (Mandatory Phasing):
        1. الانطلاق (الوحدات 1-3): الأساسيات وتجهيز بيئة العمل وتطبيق أولي.
        2. التطور (الوحدات 4-7): بناء الميزات الأساسية، الـ State، وجلب البيانات.
        3. الاحتراف (الوحدات 8-10 وما فوق): ربط الأنظمة، تصحيح الأخطاء، مشروع نهائي والنشر.`;

        } else {
            expectedSize = "دورة احترافية متقدمة (Pro Masterclass)";
            architectureInstruction = `
        🚨 الحجم الإلزامي (Standard Pro Scale):
        - الكورس يجب أن يكون دسماً. صمم من (7 إلى 10) "وحدات رئيسية" (Sections).
        - داخل كل وحدة، ضع (5 إلى 8) دروس متعمقة تشرح النظريات وتطبقها عملياً.
        - تأكد من وجود وحدات مخصصة لأفضل الممارسات (Best Practices) والمشاريع المصغرة.`;
        }

        const systemPrompt = `أنت عميد أكاديمية تقنية (Dean of Computer Science) وأعظم خبير في تصميم المناهج التعليمية (Curriculum Designer) في العالم. لقد صممت أقوى المعسكرات البرمجية التي تخرج منها كبار مهندسي Silicon Valley.
        
        مهمتك الآن هي تصميم "خريطة طريق" (Blueprint) لكورس تعليمي متكامل ومدروس بعناية فائقة.

        - موضوع الكورس: "${topic}"
        - مستوى الطالب المستهدف: "${difficulty}"
        - نوع المنهج المطلوب بناؤه: "${expectedSize}"

        ${architectureInstruction}

        🚨 استراتيجية بناء المنهج الأكاديمي (CRITICAL RULES - DO NOT BE LAZY):
        1. التدرج المنطقي البطيء (Micro-learning): لا تقفز للمفاهيم المعقدة فجأة. كل درس يجب أن يعالج "مفهوماً صغيراً واحداً فقط" لتجنب تشتيت الطالب، وهذا يبرر وجود العشرات من الدروس.
        2. عنونة محترفة: عناوين الدروس يجب أن تكون قوية، احترافية، وتوحي بالتطبيق المباشر (مثال: "بناء وتأمين مسار API باستخدام JWT" وليس "مقدمة عن الأمان").
        3. إياك والاختصار (NO SHORTCUTS - DO NOT STOP EARLY): استمر في توليد الوحدات حتى تغطي كافة مراحل المنهجية المطلوبة بالكامل. الذكاء الاصطناعي الكسول يكتب 5 وحدات ويتوقف، أنت خبير، يجب أن تكتب الهيكل كاملاً!
        4. المشروع الختامي (Capstone Project): يجب أن تكون "الوحدة الأخيرة" مخصصة بالكامل لمشروع نهائي يجمع ما تعلمه الطالب، ويُختتم بدرس عن كيفية رفع المشروع على GitHub ليكون كمعرض أعمال.

        رد بصيغة JSON فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "عنوان فخم وجذاب للدورة",
          "courseDescription": "وصف شامل وتسويقي للكورس في 3 أسطر يوضح رحلة الطالب من الأساسيات حتى بناء ورفع مشروعه الأول...",
          "blueprint": [
            {
              "sectionName": "الوحدة 1: الأساسيات المطلقة والتهيئة",
              "lessons": [
                {
                  "title": "مقدمة: ما هي هذه التقنية ولماذا نستخدمها؟",
                  "description": "شرح نظري مبسط يمهد الطريق للطالب."
                },
                {
                  "title": "الأساسيات الأولى (تجهيز بيئة العمل)",
                  "description": "كيفية كتابة أول سطر كود وتجهيز الأدوات."
                }
                // ⚠️ استمر في إضافة الدروس حتى تصل للعدد المطلوب في هذه الوحدة
              ]
            },
            {
              "sectionName": "الوحدة 2: الغوص في الكود الأساسي",
              "lessons": [
                // الدروس هنا...
              ]
            }
            // ⚠️ استمر بقوة! الوحدة 3، الوحدة 4، الوحدة 5... حتى تصل إلى الوحدة 10 أو 15 لتغطية كل المراحل!
          ]
        }`;

        // 🚀 المدفع الذكي: رفعنا التوكنز إلى 25000 لضمان عدم انقطاع ملف الـ JSON الضخم جداً!
        const rawContent = await generateContentSmart(systemPrompt, "ابدأ بتصميم هيكل الكورس الأكاديمي العملاق الآن بصيغة JSON. إياك والكسل، أريد كل الوحدات!", 0.8, 25000);
        
        // التأكد من تحويل النص إلى كائن JSON
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        console.log(`✅ تم الانتهاء من هندسة الكورس بنجاح! تم إنشاء ${parsedContent.blueprint.length} وحدات بإجمالي مئات الدروس المحتملة.`);
        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error("❌ خطأ في توليد الهيكل:", error);
        res.status(500).json({ success: false, error: 'حدث خطأ في تصميم المنهج الأكاديمي، قد يكون الهيكل أضخم من اللازم.' });
    }
});


// 🐉 مسار توليد اختبار الزعيم (Boss Dungeon) المحصن
app.post('/api/academy/forge-boss', async (req, res) => {
    try {
        const { courseTopic, lesson1Content, lesson2Content } = req.body;

        // 🛡️ الحماية الهندسية القصوى: التأكد من أن المحتوى نصي وموجود قبل قصه
        const safeContent1 = (typeof lesson1Content === 'string') ? lesson1Content : "";
        const safeContent2 = (typeof lesson2Content === 'string') ? lesson2Content : "";

const systemPrompt = `أنت مصمم اختبارات عبقري (Boss Dungeon Master) في منصة برمجية.
        مهمتك قراءة الدرسين السابقين وبناء "اختبار زعيم" من 5 أسئلة قوية جداً.
        
        - موضوع الكورس: ${courseTopic}
        - محتوى الدرس الأول: ${safeContent1.substring(0, 1000)}...
        - محتوى الدرس الثاني: ${safeContent2.substring(0, 1000)}...

        🚨 استراتيجية أسئلة الزعيم (Boss Mechanics):
        1. إذا كان الدرسان يركزان على الأكواد، يجب أن تكون أسئلة الزعيم "تحديات برمجية" (اكتشف الخطأ، ما مخرجات الكود؟).
        2. إذا كان الدرسان نظريين، اجعل الأسئلة سيناريوهات هندسية.

        🚨 قواعد هيكل JSON صارمة جداً (CRITICAL):
        - حقل "options" في كل سؤال يجب أن يكون مصفوفة من نصوص مسطحة (Flat Strings array of 4 items).
        - ❌ ممنوع الترقيم داخل الخيارات (لا تكتب "أ. كذا"، اكتب النص مباشرة).
        - ❌ ممنوع المصفوفات المتداخلة (لا تفعل هكذا: [["أ", "نص"]]).
        - "correctAnswerIndex" يجب أن يتوزع عشوائياً (0, 1, 2, 3) بين الأسئلة.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "bossQuiz": [
            {
              "question": "تحدي الكود أو السؤال الأول؟",
              "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
              "correctAnswerIndex": 1,
              "explanation": "شرح لماذا هذه الإجابة هي الصحيحة."
            }
            // ... 4 أسئلة أخرى
          ]
        }`;

        // توليد المحتوى
        const rawContent = await generateContentSmart(systemPrompt, "ابدأ بتوليد اختبار الزعيم الآن بصيغة JSON.", 0.7, 10000);
        
        // التأكد من تحويل النص إلى كائن JSON
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
        
        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error("❌ خطأ في توليد الزعيم:", error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' });
    }
});


// ==========================================
// 🎓 مسارات مختبر الأكاديمية (AcademyLab - Course Generator)
// ==========================================

// 1. مسار إلهام أفكار الكورسات (Academy Ideas Generator)
app.post('/api/academy/suggest-topic', async (req, res) => {
    const { type } = req.body;

    try {
        let promptInstruction = '';
        if (type === 'crash') {
            promptInstruction = 'أعطني عنواناً لـ "كراش كورس" (دورة مكثفة سريعة) في تقنية حديثة مطلوبة في سوق العمل (مثال: كراش كورس Next.js 14).';
        } else if (type === 'money') {
            promptInstruction = 'أعطني عنواناً لكورس يعلم مهارة برمجية تجلب المال المباشر أو كيفية بناء منتجات SaaS.';
        } else if (type === 'bootcamp') {
            // 🆕 المسار الجديد للمعسكرات الشاملة (Bootcamps)
            promptInstruction = 'أعطني عنواناً لـ "تخصص متكامل أو معسكر برمجي" (Bootcamp) ضخم جداً على غرار كورسيرا. الكورس يغطي تقنيات متعددة (مثل MERN أو Data Science)، وكل تقنية تمثل جزءاً يمنح شهادة فرعية، وفي النهاية شهادة كبرى. العنوان يجب أن يوحي بالضخامة والاحترافية.';
        } else {
            promptInstruction = 'أعطني عنواناً لكورس تريند ومطلوب جداً في سوق العمل الحالي يدمج بين الذكاء الاصطناعي وتطوير الويب.';
        }

        const systemPrompt = `أنت مستشار تعليمي ومسوق تقني خبير.
        المطلوب منك إعطاء "عنوان كورس" واحد فقط بناءً على طلب المستخدم.
        لا تكتب أي مقدمات، لا تضع علامات تنصيص، ولا تشرح الفكرة. العنوان فقط.
        
        رد بصيغة JSON فقط بهذا الهيكل:
        { "topic": "اكتب العنوان المثير والجذاب هنا" }`;

        const currentGroq = getGroqClient(); 
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: promptInstruction }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9, 
            response_format: { type: "json_object" }
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const data = JSON.parse(rawContent.match(/\{[\s\S]*\}/) ? rawContent.match(/\{[\s\S]*\}/)[0] : rawContent);

        res.json({ success: true, idea: data.topic });

    } catch (error) {
        res.status(500).json({ error: 'فشل في استلهام فكرة الكورس.' });
    }
});


// 🔴 مسار توليد البوابة الحمراء (Red Gate - Coding Boss)
app.post('/api/academy/forge-red-gate', async (req, res) => {
    try {
        const { courseTopic, lesson1Content, lesson2Content } = req.body;

        const safeContent1 = (typeof lesson1Content === 'string') ? lesson1Content : "";
        const safeContent2 = (typeof lesson2Content === 'string') ? lesson2Content : "";

        const systemPrompt = `أنت مهندس برمجيات (S-Rank Hunter) ومصمم تحديات برمجية قاسية.
        الدروس السابقة تحتوي على أكواد برمجية. مهمتك بناء "بوابة حمراء" (Red Gate) وهي عبارة عن 5 تحديات أكواد (Coding Quests) مرعبة.
        
        - موضوع الكورس: ${courseTopic}
        - محتوى الدرس الأول: ${safeContent1.substring(0, 1000)}...
        - محتوى الدرس الثاني: ${safeContent2.substring(0, 1000)}...

        🚨 قواعد البوابة الحمراء (Red Gate):
        1. الأسئلة يجب أن تكون "تحديات برمجية" حصراً: (اكتشف الخطأ في الكود، ما هي مخرجات الكود؟، أكمل السطر الناقص).
        2. استخدم علامات Markdown (\`\`\`javascript) داخل حقل "question" لكتابة الكود بوضوح داخل السؤال.
        3. الخيارات (options) يجب أن تكون مصفوفة من 4 نصوص مسطحة (Flat Strings) خالية من المصفوفات المتداخلة.
        4. العشوائية الإجبارية: "correctAnswerIndex" موزع عشوائياً (0, 1, 2, 3).

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "bossQuiz": [
            {
              "question": "اقرأ الكود التالي:\\n\\n\`\`\`javascript\\nconst x = 5;\\n\`\`\`\\nما هو الخطأ هنا؟",
              "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
              "correctAnswerIndex": 1,
              "explanation": "الشرح البرمجي الدقيق للحل..."
            }
          ]
        }`;

        const rawContent = await generateContentSmart(systemPrompt, "افتح البوابة الحمراء الآن بصيغة JSON.", 0.7, 10000);
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
        
        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error("❌ خطأ في توليد البوابة الحمراء:", error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' });
    }
});




















// ==========================================
// 🎓 مسارات مختبر الأكاديمية (AcademyLab - Course Generator)
// ==========================================

// 1. مسار توليد "هيكل المنهج" (Course Blueprint) - يعتمد على المدفع الذكي
app.post('/api/academy2/blueprint', async (req, res) => {
    const { topic, difficulty } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الدورة.' });

    try {
        console.log(`\n📐 جاري هندسة هيكل منهج أكاديمي لموضوع: ${topic}...`);

        const isBootcamp = difficulty.includes('Bootcamp');
        const architectureInstruction = isBootcamp 
            ? `هذا الكورس عبارة عن 'معسكر برمجي شامل' (Bootcamp / Specialization). 
               قم بتقسيمه إلى 4 أو 6 "وحدات ضخمة"، حيث تُعتبر كل وحدة بمثابة كورس مصغر يركز على تقنية محددة (مثل جزء مخصص بالكامل لـ MongoDB، وجزء لـ React).
               يجب أن تُسمي الوحدات بطريقة توحي بأنها تمنح شهادة (مثال: "المسار الأول: إتقان MongoDB [شهادة فرعية]").
               داخل كل مسار، ضع 4 إلى 6 دروس عميقة.`
            : `قم بتقسيم الكورس إلى 3 أو 4 "وحدات رئيسية" (Sections) كحد أقصى، وداخل كل وحدة ضع من 3 إلى 5 "دروس" (Lessons).`;

        const systemPrompt = `أنت مهندس برمجيات كبير (Senior Architect) ومصمم مناهج تعليمية محترف في أكاديمية تقنية متقدمة.
        مهمتك هي بناء "هيكل منهج" (Syllabus) عملي، خالي من الحشو، ومتسلسل منطقياً حول موضوع: "${topic}".
        مستوى الدورة المستهدف هو: "${difficulty || 'متوسط'}".
        
        🚨 قواعد بناء الهيكل:
        1. ${architectureInstruction}
        2. عناوين الدروس يجب أن تكون عملية وتوحي بالتطبيق المباشر (مثال: "بناء أول خادم باستخدام Express" بدلاً من "مقدمة عن Express").
        3. لا تكتب أي شروحات، فقط قم بتوليد الهيكل المنظم.

        رد بصيغة JSON فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "عنوان فخم وجذاب للدورة",
          "courseDescription": "وصف تسويقي وتعليمي للكورس في 3 أسطر يشرح الفائدة النهائية والطريق نحو الاعتماد.",
          "blueprint": [
            {
              "sectionName": "اسم الوحدة أو المسار الفرعي",
              "lessons": [
                { "title": "عنوان الدرس الأول" },
                { "title": "عنوان الدرس الثاني" }
              ]
            }
          ]
        }`;

        // 🚀 استخدام المدفع الذكي
        const rawContent = await generateContentSmart(systemPrompt, "تفضل، قم بهندسة هذا المنهج الآن.", 0.7, 8000);
        const blueprintData = JSON.parse(rawContent);

        res.json({ success: true, data: blueprintData });

    } catch (error) {
        console.error('❌ خطأ في هندسة هيكل المنهج:', error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء بناء هيكل المنهج.' });
    }
});



// 2. مسار "تأليف محتوى الدرس" التفصيلي (Lesson Content Forge) - يعتمد على المدفع الذكي
app.post('/api/academy2/forge-lesson', async (req, res) => {
    const { courseTopic, sectionName, lessonTitle, difficulty } = req.body;

    if (!lessonTitle) return res.status(400).json({ error: 'عنوان الدرس مفقود.' });

    try {
        console.log(`\n✍️ جاري صياغة المحتوى الدسم لدرس: "${lessonTitle}"...`);

        const systemPrompt = `أنت كبير مهندسي البرمجيات (Principal Engineer) وأعظم معلم تقني في العالم (Top-Rated Instructor) في منصة تضاهي LeetCode و Coursera. تستخدم دائماً "مبدأ فاينمان" (Feynman Technique) لتبسيط أعقد الأمور.
        مهمتك الآن هي تأليف درس واحد فقط، وعليك أولاً تحليل عنوان الدرس لتحديد نوعه: "نظري/مفاهيمي" أم "برمجي/عملي". بناءً على هذا التحليل، ستصوغ درساً شاملاً، عميقاً، وتفصيلياً جداً (Masterclass).

        - موضوع الكورس العام: "${courseTopic}"
        - الوحدة الحالية: "${sectionName}"
        - 📌 الدرس المطلوب كتابته الآن: "${lessonTitle}"
        - مستوى الطالب المستهدف: "${difficulty || 'متوسط'}"

        🚨 استراتيجية المعلم المخضرم (The Master Teacher Method):
        حلل عنوان الدرس "${lessonTitle}". 
        
        🔴 إذا كان الدرس "نظرياً/مفاهيمياً" (مثال: كيف يعمل الإنترنت، ما هي الـ APIs، مفاهيم قواعد البيانات):
           - ركز على التشبيهات (Analogies) من الحياة اليومية لتبسيط المعقد (مثال: الـ API كالنادل في المطعم).
           - تجنب حشو الأكواد المعقدة، استخدم مقتطفات بسيطة جداً فقط للتوضيح إن لزم الأمر.
           - حقل "dailyQuest" يجب أن يكون سؤال خيارات متعددة (MCQ) يختبر الفهم النظري العميق.

        🔵 إذا كان الدرس "برمجياً/عملياً" (مثال: المتغيرات، بناء خادم، استخدام React Hooks، خوارزميات):
           - القاعدة الذهبية للشرح: (شرح قصير ⬅️ كود ⬅️ ماذا يفعل هذا الكود ⬅️ كود متقدم).
           - أغرق حقل "content" بالأمثلة البرمجية باستخدام علامات الـ Markdown (\`\`\`javascript مثلاً). لا تترك فكرة دون مثال برمجي يوضحها.
           - حقل "codeSnippet" يجب أن يحتوي على كود المشروع النهائي أو الخلاصة الجاهزة للنسخ والتشغيل (بدون شروحات نصية داخله).
           - 🆕 حقل "codeExplanation": يجب أن تشرح فيه وتُشرّح (Anatomy) الكود الموجود في codeSnippet سطراً بسطر أو كتلة بكتلة.
           - حقل "dailyQuest" يجب أن يكون "تحدي كود" (Coding Challenge). (مثال: "أكمل السطر الناقص في الكود التالي"، "ما هو مخرج Output هذا الكود؟"، أو "اكتشف الخطأ Debug").

        🚨 قواعد هندسة المحتوى النصي (The S-Rank Structure):
        يجب أن يكون حقل "content" طويلاً ودسماً جداً (لا يقل عن 800 إلى 1000 كلمة). إياك والاختصار. 
        يجب أن تلتزم التزاماً حرفياً بهيكل الـ Markdown التالي في الشرح:

        ### 🎯 مقدمة الدرس وأهميته
        (ابدأ بمقدمة قوية تشرح فكرة الدرس، لماذا نتعلم هذا الموضوع؟ وما هي المشكلة الحقيقية التي يحلها في سوق العمل وفي المشاريع الكبيرة).

        ### 🧠 الغوص في الأعماق (Deep Dive)
        (هنا قم بشرح المفهوم التقني بالتفصيل الممل. فكك المفهوم إلى أجزاء صغيرة. استخدم العناوين الفرعية #### لشرح كل جزء على حدة. اشرح كيف تعمل التقنية تحت الغطاء Under the hood. تذكر: أكثر من الأكواد هنا إذا كان الدرس برمجياً!).

        ### ⚙️ التطبيق العملي وسيناريوهات الاستخدام
        (أعطِ أمثلة واقعية Real-world Use Cases. متى نستخدم هذه التقنية؟ ولماذا نفضلها على البدائل الأخرى؟).

        ### ⚠️ أخطاء شائعة وأفضل الممارسات (Pro Tips)
        (فقرة بالغة الأهمية: ما هي الأخطاء التي يقع فيها المبرمجون المبتدئون عند استخدام هذه التقنية؟ وكيف يتجنبها المحترفون؟ اذكر الـ Best Practices).

        🚨 قواعد التنسيق الإجبارية (Markdown):
        - استخدم (###) للعناوين الرئيسية المذكورة أعلاه.
        - استخدم (####) للعناوين الفرعية داخل الشرح.
        - اترك سطرين فارغين (\\n\\n) بين كل فقرة وأخرى لإنشاء "تنفس بصري" مريح للطالب.
        - استخدم **الخط العريض** للكلمات المفتاحية والمصطلحات التقنية.
        - استخدم القوائم النقطية (-) بكثرة لتنظيم الأفكار.

        🚨 قواعد هيكل JSON الصارمة (CRITICAL):
        - حقل "options" في "dailyQuest" يجب أن يكون مصفوفة من 4 نصوص مسطحة (Flat Strings) فقط. لا تضع مصفوفات متداخلة!
        - "correctAnswerIndex": يجب أن يكون عشوائياً (0, 1, 2, أو 3).
        - "explanation": اشرح بالتفصيل العلمي والمنطقي لماذا هذه الإجابة أو هذا الكود هو الصحيح دوناً عن غيره.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "content": "الشرح التفصيلي المهيكل بـ Markdown هنا...",
          "codeSnippet": "const app = express(); \\n// الكود الفعلي هنا",
          "codeExplanation": "🔬 تشريح الكود: \\n- السطر الأول: قمنا باستدعاء المكتبة لكي...\\n- الدالة الرئيسية: تقوم بـ...",
          "dailyQuest": {
            "question": "السؤال النظري أو تحدي الكود هنا؟",
            "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
            "correctAnswerIndex": 2,
            "explanation": "الإجابة صحيحة لأن..."
          }
        }`;

        // 🚀 استخدام المدفع الذكي بطاقة استيعابية ضخمة (15000 توكن) ليتمكن Gemini من التوسع في الشرح
        const rawContent = await generateContentSmart(systemPrompt, "أكتب المحتوى الاحترافي والمطول لهذا الدرس الآن.", 0.8, 15000);
        
        // حماية إضافية للتحقق من JSON
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error(`❌ خطأ في صياغة درس (${lessonTitle}):`, error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء كتابة محتوى الدرس.' });
    }
});




// 🚀 مسار V2 المخصص للاستوديو التجريبي (AcademyLab2)
app.post('/api/academy2/forge-lesson-v2', async (req, res) => {
    try {
        const { courseTopic, sectionName, lessonTitle, difficulty } = req.body;

        // 🧠 المحرك البيداغوجي: تحديد أسلوب الشرح بناءً على الصعوبة
        let pedagogicalRules = "";

        if (difficulty === 'crash_eli5') {
            pedagogicalRules = `
        🚨 استراتيجية الشرح (مبدأ فاينمان - Explain Like I'm 5):
        أنت الآن لست مجرد مبرمج، أنت أعظم وألطف معلم في العالم. أنت تشرح المفاهيم لشخص يبلغ من العمر 10 سنوات!
        1. ابدأ من الصفر المطلق: لا تفترض أي معرفة مسبقة على الإطلاق.
        2. التشبيهات اليومية (CRITICAL): إياك أن تشرح مفهوماً تقنياً دون ربطه بشيء من الحياة اليومية. (مثال: "قاعدة البيانات تشبه الخزانة المليئة بالأدراج").
        3. التدرج البطيء والآمن: ابدأ بالقصة أو التشبيه أولاً، ثم المفهوم النظري المبسط، وفي النهاية فقط ضع الكود. لا تقفز للأكواد المعقدة مباشرة.
        4. لغة دافئة ومبتسمة: استخدم لغة ودودة جداً، مشجعة، قل كلمات مثل "تخيل معي"، "لا تقلق الأمر بسيط جداً".
        5. التفصيل المريح: اجعل الشرح طويلاً ومفصلاً ولكن بفقرات قصيرة جداً لكي لا يمل القارئ.
            `;
        } else {
            pedagogicalRules = `
        🚨 استراتيجية الشرح (أسلوب المهندسين والخبراء - Masterclass):
        أنت كبير مهندسي البرمجيات (Principal Engineer).
        1. الغوص في الأعماق (Deep Dive): اشرح المفهوم التقني بالتفصيل الممل، فكك المفهوم إلى أجزاء، واشرح كيف تعمل التقنية تحت الغطاء.
        2. التطبيق العملي (Use Cases): متى نستخدم هذه التقنية؟ ولماذا نفضلها على البدائل؟
        3. أخطاء شائعة (Anti-patterns): ما هي الأخطاء التي يقع فيها المبتدئون وكيف يتجنبها المحترفون؟
            `;
        }

        const systemPrompt = `أنت أستاذ تقني من النخبة.
        مهمتك تأليف درس شامل، عميق، وتفصيلي جداً.

        - موضوع الكورس العام: "${courseTopic}"
        - الوحدة الحالية: "${sectionName}"
        - 📌 عنوان الدرس: "${lessonTitle}"

        ${pedagogicalRules}

        🚨 قواعد التنسيق الإجبارية (Markdown):
        - يجب أن تستخدم لغة Markdown مع مسافات الأسطر الإجبارية (\\n\\n).
        - العناوين الرئيسية: تبدأ بـ ### متبوعة بمسافة.
        - العناوين الفرعية: تبدأ بـ #### متبوعة بمسافة.
        - التنفس البصري (CRITICAL): يجب وضع سطرين فارغين تماماً (\\n\\n) قبل وبعد أي عنوان، وبعد كل فقرة.
        - القوائم: استخدم (-) للقوائم النقطية، واترك سطراً فارغاً قبل بداية القائمة.
        - الكلمات البارزة: ضع المصطلحات بين علامتي \` هكذا: \`React\`. والكلمات الهامة بين نجمتين **هام**.

        رد بصيغة JSON فقط بهذا الهيكل:
        {
          "content": "### 🎯 عنوان رئيسي\\n\\nفقرة أولى...\\n\\n#### عنوان فرعي\\n\\n- نقطة 1\\n- نقطة 2\\n\\nفقرة أخيرة...",
          "codeSnippet": "// الكود الفعلي هنا (إن وجد، وإلا دعه فارغاً)",
          "dailyQuest": {
            "question": "سؤال تقييمي ذكي من محتوى الدرس؟",
            "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
            "correctAnswerIndex": 2,
            "explanation": "شرح مبسط يشرح لماذا هذه الإجابة هي الصحيحة..."
          }
        }`;

        // 💡 10000 توكن لضمان عدم قطع الشرح الطويل
        const content = await generateContentSmart(systemPrompt, `اكتب محتوى الدرس: ${lessonTitle}`, 0.7, 10000);
        res.json({ success: true, data: content });

    } catch (error) {
        console.error("❌ Error in forge-lesson-v2:", error);
        res.status(500).json({ success: false, error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' });
    }
});

// 🌍 كاشف موحد لجميع اللغات الـ 7 والاختبارات العالمية
const isLanguageTopicText = (txt = '') =>
    /لغة|لغات|إنجليزي|انجليزي|ياباني|فرنسي|ألماني|الماني|إسباني|اسباني|صيني|كوري|نطق|صوتيات|حروف|أبجدية|محادثة|مفردات|IELTS|TOEFL|JLPT|DELF|DALF|Goethe|TestDaF|DELE|HSK|TOPIK|Hangul|Kanji|Pre-A1|A0|A1|A2|B1|B2|C1|C2|Phonics|IPA/i.test(txt);

// 🗺️ مسار blueprint1 الذكي (يدعم الكورس المنفرد البرمجي، أو الكورس المنفرد اللغوي، أو مشروع من الصفر بدون اختبارات)
app.post('/api/academy2/blueprint1', async (req, res) => {
    const { topic, difficulty = 'crash_eli5', targetLanguage = '' } = req.body;
    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الدورة.' });

    try {
        const isLangSingle = isLanguageTopicText(`${topic} ${targetLanguage}`);
        const isSingleScratchProject = difficulty === 'single_project_scratch';

        // 1. إذا كان المستخدم يبني كراش كورس منفرد لبناء مشروع من الصفر (بدون اختبارات)
        if (isSingleScratchProject) {
            const scratchPrompt = `أنت كبير مهندسي البرمجيات. صمم هيكل "كراش كورس عملي لبناء مشروع كامل من الصفر للنهاية (بدون أي اختبارات)" حول: "${topic}".
            قسّم بناء المشروع إلى (6 إلى 8 وحدات عملية متسلسلة)، وداخل كل وحدة (5 إلى 7 خطوات بناء كودية عملية مع الـ AI Agent).
            رد بصيغة JSON صالحة 100% فقط:
            {
              "isCertificateSeries": false,
              "isProjectScratchSeries": true,
              "courseTitle": "${topic}",
              "courseDescription": "ورشة بناء عملية خطوة بخطوة وملفاً بملف من الصفر حتى الإطلاق بمساعدة AI Agent وبدون اختبارات.",
              "blueprint": [
                {
                  "coursePrefix": "المرحلة 1",
                  "sectionName": "الوحدة 1: ...",
                  "isProjectUnit": true,
                  "lessons": [ { "title": "الخطوة 1: ...", "description": "وصف الخطوة", "lessonCategory": "project_step" } ]
                }
              ]
            }`;
            const raw = await generateContentSmart(scratchPrompt, "صمم هيكل بناء المشروع الآن بصيغة JSON.", 0.75, 18000);
            return res.json({ success: true, data: safeParseAIJson(raw) });
        }

        // 2. إذا كان الكورس المنفرد لتعليم لغة أجنبية (بمستوى E-Rank / B-Rank / S-Rank / crash_eli5)
        if (isLangSingle) {
            let mappedCourseOrder = 1;
            if (difficulty.includes('B-Rank') || difficulty.includes('متوسط')) mappedCourseOrder = 8; // B1/B2
            else if (difficulty.includes('S-Rank') || difficulty.includes('خبير')) mappedCourseOrder = 14; // C1/C2
            else if (difficulty.includes('Bootcamp') || difficulty.includes('معسكر')) mappedCourseOrder = 4; // A1-B1

            const tierSpec = getCEFRProgressionSpec(topic, '', '', difficulty, mappedCourseOrder, targetLanguage || topic);
            const { langProfile } = tierSpec;

            const singleLangPrompt = `${langProfile.instituteRole}
            صمم هيكل كراش كورس لغوي متكامل حول: "${topic}" في **اللغة ${langProfile.nameAr} (${langProfile.nameEn})** بمستوى (${tierSpec.cefrLabel} - ${difficulty}).
            ${langProfile.specialMorphologyRule}
            قسّم الكورس إلى (6 إلى 7 وحدات متدرجة)، وداخل كل وحدة ضع **المحطات الـ 6 التخصصية الثابتة**:
            (الدرس 1: المفردات والقوالب، الدرس 2: المحادثة الواقعية، الدرس 3: هندسة الجملة بالمكعبات، الدرس 4: معمل الصوتيات والنطق، الدرس 5: مختبر الاستماع والترديد، الدرس 6: ورشة القراءة والكتابة).
            رد بصيغة JSON صالحة 100% فقط:
            {
              "isCertificateSeries": false,
              "isLanguageSeries": true,
              "targetLanguage": "${langProfile.nameAr} (${langProfile.nameEn})",
              "speechLang": "${langProfile.speechLang}",
              "courseTitle": "${topic}",
              "courseDescription": "كورس تفاعلي متكامل في اللغة ${langProfile.nameAr} بنظام الشرائح البصرية والصوتيات (${tierSpec.cefrLabel}).",
              "blueprint": [
                {
                  "coursePrefix": "الوحدة 1",
                  "sectionName": "الوحدة 1: ...",
                  "isProjectUnit": false,
                  "lessons": [
                    { "title": "الدرس 1: المفردات والقوالب — ...", "description": "...", "lessonCategory": "language_mastery" }
                  ]
                }
              ]
            }`;
            const raw = await generateContentSmart(singleLangPrompt, "صمم هيكل كورس اللغة الآن بصيغة JSON.", 0.72, 20000);
            return res.json({ success: true, data: sanitizeLanguageLessonJSON(safeParseAIJson(raw)) });
        }

        // 3. الكورس التقني/البرمجي المنفرد (يتكيف مع crash_eli5, E-Rank, B-Rank, S-Rank, Bootcamp)
        const singlePrompt = `أنت عميد أكاديمية تقنية. صمم هيكل كورس شامل من 6 إلى 10 وحدات (Sections)، وفي كل وحدة من 5 إلى 8 دروس متدرجة حول: "${topic}" بمستوى وأسلوب: "${difficulty}".
        🚨 إلزامي: الوحدة الأخيرة يجب أن تكون مخصصة بالكامل لبناء مشروع تطبيقي خطوة بخطوة بمساعدة AI Agent ورفعه على GitHub.
        رد بصيغة JSON صالحة 100% فقط:
        {
          "isCertificateSeries": false,
          "courseTitle": "عنوان الكورس",
          "courseDescription": "وصف الكورس",
          "blueprint": [
            {
              "coursePrefix": "الوحدة 1",
              "sectionName": "اسم الوحدة",
              "isProjectUnit": false,
              "lessons": [ { "title": "عنوان الدرس", "description": "وصف الدرس", "lessonType": "theory_or_code" } ]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(singlePrompt, "صمم الهيكل الآن بصيغة JSON.", 0.78, 20000);
        res.json({ success: true, data: safeParseAIJson(rawContent) });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في تصميم المنهج.' });
    }
});





// ============================================================================
// 🐉 مسار توليد بوابة الزعيم (يفحص الدرسين السابقين بدقة ويدعم اللغات والبرمجة!)
// ============================================================================
app.post('/api/academy2/forge-boss', async (req, res) => {
    const { courseTopic, lesson1Content, lesson2Content } = req.body;

    try {
    const isLangBoss = isLanguageTopicText(`${courseTopic} ${(lesson1Content || '').slice(0, 400)}`);

        const systemPrompt = isLangBoss
            ? `أنت أستاذ لغات خبير تختبر طالباً فيما تعلمه للتو في الدرسين السابقين فقط!
            اقرأ محتوى الدرسين السابقين بعناية، وصمم **5 أسئلة اختيار من متعدد دقيقة ومتنوعة** تختبر:
            (الكلمات التي وردت في الدرسين، كيفية نطقها ومخارج حروفها، تركيب الجملة الصحيح، وتصحيح الأخطاء الشائعة التي ذُكرت في الدرسين).
            🚫 ممنوع تكرار أسئلة عامة من خارج الدرسين! يجب أن تكون الأسئلة مبنية 100% على الأمثلة والكلمات المشروحة في النص المرفق.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "bossQuiz": [
                {
                  "question": "سؤال واضح ومباشر يختبر كلمة أو نطقاً أو جملة من الدرسين...",
                  "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
                  "correctAnswerIndex": 1,
                  "explanation": "شرح مبسط وواضح لماذا هذا الخيار هو الصحيح..."
                }
              ]
            }`
            : `أنت ممتحن تقني. صمم 5 أسئلة اختيار من متعدد تختبر فهم الطالب العميق للدرسين السابقين في "${courseTopic}".
            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "bossQuiz": [
                {
                  "question": "نص السؤال...",
                  "options": ["1", "2", "3", "4"],
                  "correctAnswerIndex": 0,
                  "explanation": "الشرح..."
                }
              ]
            }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `محتوى الدرس الأول:\n${(lesson1Content || '').slice(0, 3500)}\n\nمحتوى الدرس الثاني:\n${(lesson2Content || '').slice(0, 3500)}\n\nولّد 5 أسئلة دقيقة بصيغة JSON.`,
            0.65,
            6000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في توليد الزعيم:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء توليد تحدي الزعيم.' });
    }
});



// ==========================================
// 🎓 مسارات مختبر الأكاديمية (AcademyLab - Course Generator)
// ==========================================
// 1. مسار إلهام أفكار الشهادات المهنية الضخمة (باللغة العربية)
app.post('/api/academy2/suggest-topic', async (req, res) => {
    const { type } = req.body;

    try {
        let promptInstruction = '';
        if (type === 'crash') {
            promptInstruction = 'أعطني عنواناً لـ "كراش كورس" (دورة مكثفة سريعة) في تقنية حديثة مطلوبة في سوق العمل.';
        } else if (type === 'money') {
            promptInstruction = 'أعطني عنواناً لكورس يعلم مهارة برمجية تجلب المال المباشر أو كيفية بناء منتجات SaaS.';
        } else if (type === 'bootcamp') {
            promptInstruction = 'أعطني عنواناً لـ "معسكر برمجي" (Bootcamp) ضخم يغطي تقنيات متعددة.';
        } else if (type === 'coursera') {
            promptInstruction = 'أعطني عنواناً عربياً فخماً واحترافياً لـ "شهادة مهنية شاملة" (Professional Certificate) تتكون من سلسلة متدرجة من 9 إلى 15 كراش كورس (تبدأ من الصفر المطلق وتصل إلى الذكاء الاصطناعي والحوسبة السحابية ومشاريع التخرج). لا تذكر أسماء شركات، واكتب العنوان باللغة العربية فقط.';
        } else {
            promptInstruction = 'أعطني عنواناً لكورس تريند ومطلوب جداً في سوق العمل الحالي يدمج بين الذكاء الاصطناعي وتطوير الويب.';
        }

        const systemPrompt = `أنت مستشار تعليمي ومسوق تقني خبير.
        المطلوب منك إعطاء "عنوان" واحد فقط باللغة العربية بناءً على طلب المستخدم بدون أي مقدمات أو علامات تنصيص.
        رد بصيغة JSON فقط بهذا الهيكل:
        { "topic": "اكتب العنوان المثير والجذاب هنا" }`;

        const currentGroq = getGroqClient();
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: promptInstruction }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9,
            response_format: { type: "json_object" }
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const data = JSON.parse(rawContent.match(/\{[\s\S]*\}/) ? rawContent.match(/\{[\s\S]*\}/)[0] : rawContent);

        res.json({ success: true, idea: data.topic });
    } catch (error) {
        res.status(500).json({ error: 'فشل في استلهام فكرة الكورس.' });
    }
});



// ============================================================================
// 🔴 6. مسار البوابة الحمراء (Red Gate - بعد درسين يحتويان على كود)
// ============================================================================
app.post('/api/academy2/forge-red-gate', async (req, res) => {
    try {
        const { courseTopic, lesson1Content, lesson2Content } = req.body;
        const safeContent1 = (typeof lesson1Content === 'string') ? lesson1Content : "";
        const safeContent2 = (typeof lesson2Content === 'string') ? lesson2Content : "";

        const systemPrompt = `أنت مهندس برمجيات (S-Rank Hunter) ومصمم تحديات أكواد. ابنِ "بوابة حمراء" مكونة من 5 تحديات أكواد (Coding Quests) من محتوى الدرسين في (${courseTopic}).
        - الدرس الأول: ${safeContent1.substring(0, 800)}
        - الدرس الثاني: ${safeContent2.substring(0, 800)}
        🚨 الأسئلة يجب أن تتضمن أكواد Markdown (\`\`\`) لاكتشاف الخطأ أو توقع المخرجات أو إكمال السطر الناقص.
        🚨 الخيارات 4 نصوص مسطحة فقط.
        رد بصيغة JSON فقط:
        {
          "bossQuiz": [
            {
              "question": "اقرأ الكود التالي... ما هو المخرج أو الخطأ؟",
              "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
              "correctAnswerIndex": 1,
              "explanation": "الشرح البرمجي المبسط..."
            }
          ]
        }`;

        const rawContent = await generateContentSmart(systemPrompt, "افتح البوابة الحمراء بصيغة JSON.", 0.7, 10000);
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
        res.json({ success: true, data: parsedContent });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في توليد البوابة الحمراء.' });
    }
});





// ============================================================================
// 🎓 2. مسار بناء الشهادة المهنية الكاملة (9 إلى 15+ كراش كورس متدرج + نظام الشهادات)
// ============================================================================
app.post('/api/academy2/blueprint-certificate', async (req, res) => {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الشهادة المهنية.' });

    try {
        console.log(`\n🎓 [Super Certificate Architect] جاري هندسة شهادة مهنية متكاملة لموضوع: ${topic}...`);

        const systemPrompt = `أنت عميد أكاديمية تقنية عالمية وأفضل مصمم مناهج وشهادات مهنية (Professional Certificates) في العالم، وتتمتع بعبقرية فائقة في التبسيط المطلق (Explain Like I'm 5).
        
        مهمتك هي بناء هيكل **"شهادة مهنية خارقة"** حول موضوع: "${topic}".

        🚨 القواعد المعمارية الصارمة (CRITICAL RULES - DO NOT BE LAZY):
        
        1. عدد الكراش كورسات (من 9 إلى 15 كراش كورس أو أكثر إذا لزم الأمر):
           - فكك المجال بالكامل إلى سلسلة متصلة ومتناسقة من الكراش كورسات (لا تقل عن 9 كورسات، وتصل إلى 15 كورساً أو أكثر حسب ضخامة المجال).
           - يجب أن يكون التدرج تصاعدياً ومنطقياً جداً (من الأسهل للصفر المطلق ⬅️ إلى الأصعب والاحترافي في نهاية المجال).
           - مثال استرشادي لو كان المجال Full-Stack:
             * الكورس 1: مدخل شامل ومبسط لعالم هندسة البرمجيات وكيف يعمل الإنترنت.
             * الكورس 2: تجهيز بيئة العمل، التيرمينال، وأساسيات التفكير المنطقي.
             * الكورس 3: مقدمة تأسيسية في HTML5 و CSS3 وبناء الهياكل.
             * الكورس 4: احتراف التصميم المتجاوب والأنيميشن و Tailwind CSS.
             * الكورس 5: أساسيات البرمجة بلغة JavaScript والتلاعب بالـ DOM.
             * الكورس 6: احتراف JavaScript المتقدمة (ES6+, Async, APIs).
             * الكورس 7: إدارة الأكواد والعمل الجماعي عبر Git و GitHub.
             * الكورس 8: بناء واجهات المستخدم التفاعلية باستخدام React.js.
             * الكورس 9: إدارة الحالة المتقدمة والأداء في React.
             * الكورس 10: بناء الخوادم والـ APIs باستخدام Node.js و Express.
             * الكورس 11: قواعد البيانات (MongoDB / SQL) وهيكلة البيانات.
             * الكورس 12: ربط الـ Full-Stack والأمان والتوثيق (JWT & Auth).
             * الكورس 13: البرمجة والتطوير الخارق بمساعدة أدوات ووكلاء الذكاء الاصطناعي (Dev with AI Tools & Agents).
             * الكورس 14: الحاويات والنشر السحابي (Docker, CI/CD, Cloud Deployment).
             * الكورس 15: مشروع التخرج العملاق (Full-Stack Capstone) والاستعداد لسوق العمل.

        2. الترابط القصصي والتشبيه الممتد (Master Analogy):
           ابتكر تشبيهاً قصصياً واحداً ممتعاً يفهمه طفل صغير (مثل بناء مدينة ذكية أو مطعم عالمي) يربط الكورسات ببعضها، واشرح في كل كورس كيف يتصل بالكورس الذي قبله ("connectionToPrevious") وكيف يمهد للكورس الذي بعده ("cliffhangerToNext").

        3. مشروع GitHub بمساعدة AI Agent لكل كراش كورس:
           حدد لكل كراش كورس مشروعاً تطبيقياً بسيطاً وواضحاً ("githubProject") سيبنيه الطالب في الوحدة الأخيرة من ذلك الكورس بمساعدة AI Agent ويرفعه على GitHub.

        4. نظام الشهادات المزدوج:
           - كل كراش كورس يمنح شهادة خاصة به ("subCertificateTitle").
           - إتمام جميع الكراش كورسات يمنح الطالب "الشهادة المهنية الخارقة" ("superCertificate").

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "isCertificateSeries": true,
          "certificateTitle": "الاسم الرسمي الفخم للشهادة المهنية الخارقة",
          "courseTitle": "الاسم الرسمي الفخم للشهادة المهنية الخارقة",
          "courseDescription": "وصف شامل ومفصل للشهادة المهنية وكيف تأخذ الطالب من الصفر المطلق إلى قمة الاحتراف...",
          "mainAnalogy": "القصة والتشبيه المبسط الموحد الذي يربط جميع الكراش كورسات معاً...",
          "superCertificate": {
            "title": "الشهادة المهنية الخارقة المعتمدة في ...",
            "badgeText": "S-Rank Master Professional Certificate",
            "careerOutcomes": ["مسمى وظيفي 1", "مسمى وظيفي 2", "مسمى وظيفي 3"]
          },
          "courses": [
            {
              "courseOrder": 1,
              "coursePrefix": "الكراش كورس 1",
              "difficultyLevel": "المستوى 1: تأسيسي (سهل جداً)",
              "courseTitle": "كراش كورس 1: ...",
              "description": "وصف تفصيلي مبسط لما سيتعلمه الطالب في هذا الكراش كورس...",
              "courseDescription": "وصف تفصيلي مبسط لما سيتعلمه الطالب في هذا الكراش كورس...",
              "estimatedHours": "15 ساعة",
              "certificateBadge": "شهادة إتمام الكراش كورس 1: ...",
              "connectionToPrevious": "نقطة البداية من الصفر المطلق...",
              "cliffhangerToNext": "كيف يمهد هذا الكورس للكورس رقم 2؟",
              "githubProject": {
                "projectTitle": "اسم المشروع البسيط الذي سيبنيه ويرفعه على GitHub",
                "projectSummary": "وصف المشروع وكيف سيستخدم الطالب AI Agent للمساعدة في بنائه"
              },
              "skills": ["مهارة 1", "مهارة 2", "مهارة 3", "مهارة 4"]
            }
            // ⚠️ استمر في توليد ما بين 9 إلى 15 كراش كورس (أو أكثر) متدرجة الصعوبة!
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بهندسة الشهادة المهنية الكاملة لموضوع "${topic}" (من 9 إلى 15 كراش كورس متدرج من السهل إلى الأصعب مع مشاريع GitHub وشهادات فرعية) بصيغة JSON.`,
            0.8,
            25000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        console.log(`✅ [Super Certificate] تم بناء الشهادة بنجاح بعدد (${parsedContent.courses?.length || 0}) كراش كورسات!`);
        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error('❌ خطأ في تصميم الشهادة المهنية:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ في تصميم الشهادة المهنية.' });
    }
});





// ============================================================================
// 🗺️ 2. مسار تفكيك الكراش كورس الواحد إلى منهج كامل (8-12 وحدة مفصلة)
// ============================================================================

app.post('/api/academy2/blueprint-crash-course', async (req, res) => {
    const { 
        certificateTitle, 
        mainAnalogy, 
        courseOrder,
        totalCourses,
        currentCourseTitle, 
        currentCourseDescription,
        githubProject,
        previousCourseTitle, 
        nextCourseTitle 
    } = req.body;

    if (!currentCourseTitle) {
        return res.status(400).json({ error: 'عنوان الكراش كورس الحالي مطلوب.' });
    }

    try {
        console.log(`\n🧩 [Crash Course Architect] جاري تفكيك (${currentCourseTitle}) إلى 5-10+ وحدات...`);

        const projectTitle = githubProject?.projectTitle || `مشروع تطبيقي شامل لـ ${currentCourseTitle}`;

        const systemPrompt = `أنت أعظم مهندس مناهج تعليمية (Curriculum Architect) وخبير في التبسيط المطلق (ELI5 - تشرح لطفل صغير ذكي وتصل به للاحتراف).
        
        أنت الآن تقوم ببناء الهيكل التفصيلي لـ "${currentCourseTitle}" (الكورس رقم ${courseOrder || 1} من أصل ${totalCourses || 12} ضمن "${certificateTitle || 'الشهادة المهنية'}").
        
        📋 المعطيات:
        - 🎭 القصة والتشبيه الممتد: "${mainAnalogy || 'تبسيط المفاهيم بتشبيهات الحياة اليومية'}"
        - 📝 وصف الكراش كورس: "${currentCourseDescription || ''}"
        - ⏪ الكورس السابق: "${previousCourseTitle || 'لا يوجد (هذا هو الكورس التأسيسي الأول)'}"
        - ⏩ الكورس القادم: "${nextCourseTitle || 'لا يوجد (هذا هو كورس التخرج النهائي)'}"
        - 🚀 مشروع نهاية هذا الكراش كورس: "${projectTitle}"

        🚨 قواعد الهندسة المعمارية الصارمة (CRITICAL RULES):
        
        1. عدد الوحدات والدروس:
           - قسّم هذا الكراش كورس إلى **(من 5 إلى 10 وحدات رئيسية / Sections)**، وإذا كان الموضوع دسماً أضف وحدات أكثر دون تردد.
           - داخل كل وحدة، ضع **(من 5 إلى 10 دروس)** متدرجة ومفصلة.

        2. تنويع الدروس (نظري + كودي تفاعلي):
           - حدد لكل درس حقل "lessonCategory": إما "theory" (نظري مفاهيمي) أو "code" (تطبيقي برمجي يحتوي على كتابة كود وتلميحات) أو "ai_project" (لدروس وحدة المشروع النهائية).
           - كل وحدة ستنتهي باختبار نهائي مختلط (نظري + كودي).

        3. 🚨 الوحدة الأخيرة الإجبارية (وحدة بناء المشروع البسيط + AI Agent + GitHub):
           يجب أن تكون **الوحدة الأخيرة دائماً** مخصصة بالكامل لبناء المشروع: "${projectTitle}" ووضعه على GitHub!
           اضبط حقل "isProjectUnit": true لهذه الوحدة الأخيرة، ويجب أن تحتوي على 6 إلى 8 دروس تشرح بالتفصيل الممل جداً:
           - الدرس 1: فهم فكرة المشروع، تخطيط هيكل الملفات، وتجهيز بيئة العمل من الصفر.
           - الدرس 2: كيف تستعين بـ AI Agent (مثل Cursor أو Copilot أو ChatGPT) كمساعد برمجي وكيف تكتب له الـ Prompts الصحيحة لبناء المشروع.
           - الدرس 3: بناء الجزء الأول من كود المشروع خطوة بخطوة (مع شرح كل سطر).
           - الدرس 4: إكمال بناء المشروع وربط الأجزاء واختبار عمله.
           - الدرس 5: كيف تطلب من الـ AI Agent فحص الكود وإصلاح الأخطاء (Debugging) وتحسين التصميم.
           - الدرس 6: شرح أوامر Git ورفع المشروع خطوة بخطوة على حساب الطالب في GitHub.
           - الدرس 7: كتابة ملف README.md احترافي بمساعدة الـ AI واستلام شهادة الكراش كورس والتمهيد للكورس القادم (${nextCourseTitle || 'سوق العمل'}).

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "${currentCourseTitle}",
          "subCertificateTitle": "شهادة إتقان ${currentCourseTitle}",
          "blueprint": [
            {
              "sectionOrder": 1,
              "sectionName": "الوحدة 1: ...",
              "isProjectUnit": false,
              "sectionExamSummary": "اختبار الوحدة 1 المختلط (نظري + كودي)",
              "lessons": [
                {
                  "title": "عنوان الدرس الأول",
                  "description": "وصف الدرس",
                  "lessonCategory": "theory"
                },
                {
                  "title": "عنوان الدرس الثاني (تطبيقي كودي)",
                  "description": "وصف الدرس البرمجي",
                  "lessonCategory": "code"
                }
                // ⚠️ ضع من 5 إلى 10 دروس في كل وحدة!
              ]
            },
            {
              "sectionOrder": 99,
              "sectionName": "الوحدة النهائية: بناء مشروع (${projectTitle}) بمساعدة AI Agent ورفعه على GitHub",
              "isProjectUnit": true,
              "sectionExamSummary": "الاختبار الختامي ومراجعة المشروع",
              "lessons": [
                // ⚠️ دروس المشروع الـ 7 التفصيلية مع lessonCategory: "ai_project"
              ]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم ببناء الهيكل الكامل (5 إلى 10+ وحدات، وفي كل وحدة 5 إلى 10 دروس، مع وحدة المشروع النهائي على GitHub بمساعدة AI Agent) للكراش كورس "${currentCourseTitle}" بصيغة JSON.`,
            0.8,
            25000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        console.log(`✅ [Crash Course Architect] تم إنشاء ${parsedContent.blueprint?.length || 0} وحدات بنجاح!`);
        res.json({ success: true, data: parsedContent });

    } catch (error) {
        console.error('❌ خطأ في تفكيك الكراش كورس:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء هندسة وحدات الكراش كورس.' });
    }
});


// ============================================================================
// 🏆 مسار توليد الاختبار النهائي للوحدة (يتكيف تلقائياً بين: اختبار لغوي شامل أو اختبار برمجي!)
// ============================================================================
app.post('/api/academy2/forge-unit-exam', async (req, res) => {
    const { courseTopic, sectionName, unitLessonsSummary } = req.body;

    try {
    const isLanguageExam = isLanguageTopicText(`${courseTopic} ${sectionName} ${unitLessonsSummary}`);

        const systemPrompt = isLanguageExam
            ? `أنت كبير ممتحني جامعة كامبريدج والاختبارات الدولية (Cambridge & IELTS Chief Examiner).
            مهمتك تصميم **"الاختبار النهائي الشامل للوحدة اللغوية"**: "${sectionName}" ضمن كورس "${courseTopic}".
            الدروس التي درسها الطالب في هذه الوحدة هي: "${unitLessonsSummary}".

            🚨 شروط صارمة لاختبار اللغة:
            1. 🚫 ممنوع منعاً باتاً كتابة أي كود برمجي (لا بايثون ولا جافاسكريبت ولا JSON)! هذا اختبار لغة طبيعية 100%.
            2. صمم **6 أسئلة متدرجة وشاملة** في مصفوفة "bossQuiz":
               - 3 أسئلة ("questionType": "theory") تختبر: **الصوتيات والنطق (Phonics/IPA)، المفردات، والفهم السمعي**.
               - 3 أسئلة ("questionType": "code") تختبر: **التطبيق العملي لتركيب الجمل، القواعد، اكتشاف الخطأ الإملائي أو النحوي، وفهم جملة أو فقرة قرائية قصيرة**.
            3. في حقل "unitCodingChallenge"، ضع **مهمة الكتابة وبناء الجمل النهائية للوحدة (Unit Writing & Sentence Production Task)** مع 3 تلميحات متدرجة والحل اللغوي النموذجي.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "examTitle": "🏆 الاختبار اللغوي الشامل: ${sectionName}",
              "bossQuiz": [
                {
                  "questionType": "theory",
                  "question": "سؤال في الصوتيات أو المفردات أو الفهم...",
                  "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
                  "correctAnswerIndex": 1,
                  "explanation": "الشرح اللغوي المبسط..."
                },
                {
                  "questionType": "code",
                  "question": "سؤال تطبيقي في تركيب الجمل أو تصحيح الخطأ أو القراءة...",
                  "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
                  "correctAnswerIndex": 0,
                  "explanation": "الشرح اللغوي المبسط..."
                }
              ],
              "unitCodingChallenge": {
                "hasPractice": true,
                "taskQuestion": "✍️ التحدي الكتابي النهائي للوحدة: اكتب / ركب 4 جمل كاملة تطبق ما تعلمته في هذه الوحدة...",
                "starterCode": "// اكتب جملك الصحيحة هنا:\\n1. \\n2. \\n3. \\n4. \\n",
                "hints": ["💡 تلميح 1: ...", "🛠️ تلميح 2: ...", "🔓 تلميح 3: ..."],
                "solutionCode": "✅ الحل اللغوي النموذجي:\\n1. ...\\n2. ...\\n3. ...\\n4. ..."
              }
            }`
            : `أنت كبير الممتحنين التقنيين. صمم اختباراً نهائياً مختلطاً (3 أسئلة نظرية + 3 أسئلة كودية + تحدي كتابة كود شامل) للوحدة: "${sectionName}" ضمن كورس "${courseTopic}".
            الدروس المشمولة: "${unitLessonsSummary}".
            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "examTitle": "🏆 الاختبار النهائي: ${sectionName}",
              "bossQuiz": [
                {
                  "questionType": "theory",
                  "question": "سؤال نظري...",
                  "options": ["1", "2", "3", "4"],
                  "correctAnswerIndex": 0,
                  "explanation": "الشرح..."
                },
                {
                  "questionType": "code",
                  "question": "سؤال كودي مع مقتطف كود...",
                  "options": ["1", "2", "3", "4"],
                  "correctAnswerIndex": 1,
                  "explanation": "الشرح..."
                }
              ],
              "unitCodingChallenge": {
                "hasPractice": true,
                "taskQuestion": "تحدي الوحدة البرمجي الشامل...",
                "starterCode": "// اكتب الكود هنا\\n",
                "hints": ["تلميح 1", "تلميح 2", "تلميح 3"],
                "solutionCode": "// الحل النموذجي"
              }
            }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بتوليد الاختبار النهائي للوحدة "${sectionName}" بصيغة JSON.`,
            0.7,
            10000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في توليد اختبار الوحدة:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء توليد اختبار الوحدة.' });
    }
});



const sanitizeLanguageText = (rawStr = '') => {
    if (!rawStr || typeof rawStr !== 'string') return rawStr;

    // ✨ FIX: Data Contamination Firewall - حماية الروابط ورموز الهروب البرمجية (Escapes) قبل الفصل اللغوي
    const protectedTokens = [];
    let tokenMarker = '__PROTECTED_TOKEN_';
    while (rawStr.includes(tokenMarker)) tokenMarker += '_';
    let cleaned = rawStr.replace(
        /(https?:\/\/[^\s"'`)<\]]+|\\[nrtbf"\\]|\\u[0-9a-fA-F]{4})/g,
        (match) => {
            protectedTokens.push(match);
            return `${tokenMarker}${protectedTokens.length - 1}__`;
        }
    );

    cleaned = cleaned
        // 1. إزالة أي رموز ديفاناغاري/هندية أو رموز تالفة
        .replace(/[\u0900-\u097F]+/g, '')
        .replace(/פּ/g, 'پ')
        // 2. إصلاح التداخل بين الحروف العربية واللاتينية داخل الكلمة الواحدة (فرنسي / ألماني)
        .replace(/\bHiو\s*hören\s+Sie!?/gi, 'Hören Sie!')
        .replace(/\bHiو\b/gi, 'Hören')
        .replace(/c'هست/gi, "c'est")
        .replace(/C'هست/g, "C'est")
        .replace(/c'ست/gi, "c'est")
        .replace(/C'ست/g, "C'est")
        .replace(/مaman/gi, "maman")
        .replace(/Il\s+هو\s+bon/gi, "Il est bon")
        .replace(/ت\s*άλλο\s*كـ/gi, "تُنطق كـ")
        // 3. تصحيح أخطاء التذكير والتأنيث الشائعة بحدود كلمة صارمة (\b)
        .replace(/\bun clé\b/gi, "une clé")
        .replace(/\bUn clé\b/g, "Une clé")
        .replace(/---+\+/g, '---')
        .replace(/---;/g, '---')
        // ✨ FIX: Data Contamination Firewall - فصل الحروف العربية الملتصقة بالحروف اللاتينية أو الآسيوية والعكس
        .replace(/([\u0600-\u06FF])([a-zA-Z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf\uac00-\ud7af])/g, '$1 $2')
        .replace(/([a-zA-Z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf\uac00-\ud7af])([\u0600-\u06FF])/g, '$1 $2');

    // استعادة الروابط ورموز الأكواد المحمية كما كانت تماماً
    const tokenPattern = new RegExp(`${tokenMarker}(\\d+)__`, 'g');
    cleaned = cleaned.replace(tokenPattern, (_, idx) => protectedTokens[Number(idx)]);
    
    // 🔗 4. دمج الكلمات الأجنبية المتجاورة المقطعة بـ backticks في كبسولة واحدة من المنبع!
    for (let pass = 0; pass < 4; pass++) {
        cleaned = cleaned.replace(
            /`([^\u0600-\u06FF`\n]{1,45})`\s*([,.;:?!'’+-]?)\s*`([^\u0600-\u06FF`\n]{1,45})`/g,
            (_, part1, sep, part2) => {
                const cleanSep = sep ? `${sep} ` : ' ';
                return `\`${part1.trim()}${cleanSep}${part2.trim()}\``.replace(/\s+/g, ' ');
            }
        );
    }

    return cleaned;
};

// ✨ FIX: Automated 3-Layer Curriculum QA Linter & Auto-Healer (فاحص ومُصلح جودة المناهج لـ 7 لغات)
const lintAndHealLessonContent = (rawMarkdown = '', targetLangCode = 'en-US') => {
    if (!rawMarkdown || typeof rawMarkdown !== 'string') return { cleanedMarkdown: '', issues: [] };
    const issues = [];
    let text = sanitizeLanguageText(rawMarkdown);

    // 1. إصلاح الأخطاء اللغوية والتحريرية المرصودة في التقييم (مثل الألمانية والفرنسية)
    if (/Hiو\s*hören\s+Sie/i.test(text)) {
        issues.push('fixed_mixed_arabic_latin_token: Hiو hören Sie -> Hören Sie!');
        text = text.replace(/Hiو\s*hören\s+Sie!?/gi, 'Hören Sie!');
    }
    if (/أنا\s+أسمي\s+آنا|أنا\s+اسمي\s+آنا/g.test(text)) {
        issues.push('fixed_literal_arabic_translation: أنا أسمي آنا -> اسمي آنا');
        text = text.replace(/أنا\s+[أا]سمي\s+آنا/g, 'اسمي آنا');
    }
    if (/\bdas\s+Berlin\b/gi.test(text)) {
        issues.push('fixed_improper_city_article: das Berlin -> Berlin');
        text = text.replace(/\bdas\s+Berlin\b/gi, 'Berlin');
    }

    // 2. فحص تسرب المفردات الإنجليزية الافتراضية داخل كورسات اللغات غير الإنجليزية
    if (!targetLangCode.startsWith('en')) {
        const englishBleedMatch = text.match(/`\s*(a cat|a mat|a red cup|in the sun)\s*`/i);
        if (englishBleedMatch) {
            issues.push(`english_bleed_detected_in_${targetLangCode}: ${englishBleedMatch[1]}`);
        }
    }

    // 3. إصلاح تمارين املأ الفراغ [[...]] لمنع تكرار الكلمة المكتوبة قبل القوس داخل الخيار الصحيح
    text = text.replace(
        /(\b[A-Za-z\u00C0-\u024F]+\s+)\[\[\s*\1([^\]]+)\]\]/g,
        (fullMatch, repeatedPrefix, restInside) => {
            issues.push(`fixed_duplicate_prefix_in_fill_blank: ${repeatedPrefix.trim()}`);
            return `${repeatedPrefix}[[${restInside.trim()}]]`;
        }
    );

    return { cleanedMarkdown: text, issues };
};

const validateAndHealQuizObject = (quizObj, quizLabel = 'dailyQuest') => {
    const issues = [];
    if (!quizObj || typeof quizObj !== 'object') return { healedQuiz: quizObj, issues };

    const healed = { ...quizObj };
    if (Array.isArray(healed.options)) {
        // إزالة الخيارات المكررة أو المتداخلة
        const flatOptions = healed.options.map(opt => (Array.isArray(opt) ? opt.join(' ') : String(opt || '').trim())).filter(Boolean);
        const uniqueOptions = [...new Set(flatOptions)];
        if (uniqueOptions.length !== flatOptions.length) {
            issues.push(`${quizLabel}_duplicate_options_removed`);
        }
        healed.options = uniqueOptions;

        // التحقق من أن مؤشر الإجابة الصحيحة ضمن النطاق الصحيح
        const idx = Number(healed.correctAnswerIndex);
        if (!Number.isInteger(idx) || idx < 0 || idx >= healed.options.length) {
            issues.push(`${quizLabel}_invalid_correctAnswerIndex_reset_to_0`);
            healed.correctAnswerIndex = 0;
        }
    }
    return { healedQuiz: healed, issues };
};

const sanitizeLanguageLessonJSON = (lessonObj, targetLangCode = 'en-US') => {
    if (!lessonObj || typeof lessonObj !== 'object') return lessonObj;
    try {
        const serialized = JSON.stringify(lessonObj);
        const cleaned = sanitizeLanguageText(serialized);
        const parsed = JSON.parse(cleaned);

        if (typeof parsed.content === 'string') {
            const { cleanedMarkdown } = lintAndHealLessonContent(parsed.content, targetLangCode);
            parsed.content = cleanedMarkdown;
        }
        if (parsed.dailyQuest) {
            parsed.dailyQuest = validateAndHealQuizObject(parsed.dailyQuest, 'dailyQuest').healedQuiz;
        }
        if (Array.isArray(parsed.bossQuiz)) {
            parsed.bossQuiz = parsed.bossQuiz.map((q, i) => validateAndHealQuizObject(q, `bossQuiz_${i}`).healedQuiz);
        }
        return parsed;
    } catch (e) {
        return lessonObj;
    }
};

// 🛡️ مسار الفحص والتدقيق الشامل للكورس أو الشهادة (Automated Course QA Linter API)
app.post('/api/academy2/surgeon/lint-course', (req, res) => {
    try {
        const { lessonsList = [], langCode = 'en-US' } = req.body;
        if (!Array.isArray(lessonsList)) {
            return res.status(400).json({ success: false, error: 'قائمة الدروس غير صالحة.' });
        }

        const report = {
            totalLessonsScanned: lessonsList.length,
            duplicateLessonsRemoved: 0,
            totalIssuesFixed: 0,
            detailedFixes: []
        };

        const seenSignatures = new Set();
        const healedLessons = [];

        lessonsList.forEach((lesson, idx) => {
            if (!lesson || typeof lesson !== 'object') return;

            // كشف حلقات التكرار المفرغة (Loop Detection) للدروس أو بوابات الزعيم المنسوخة
            const normTitle = String(lesson.title || '').replace(/\s+/g, ' ').trim().toLowerCase();
            const normContentHead = String(lesson.content || '').slice(0, 160).replace(/\s+/g, ' ').trim().toLowerCase();
            const signature = `${lesson.section || ''}__${lesson.type || 'video'}__${normTitle}__${normContentHead}`;

            if (normTitle && seenSignatures.has(signature)) {
                report.duplicateLessonsRemoved++;
                report.detailedFixes.push(`حذف درس/بوابة مكررة في الحلقة: (${lesson.title})`);
                return;
            }
            seenSignatures.add(signature);

            const healedLesson = sanitizeLanguageLessonJSON(lesson, langCode);
            const { cleanedMarkdown, issues: contentIssues } = lintAndHealLessonContent(healedLesson.content || '', langCode);
            healedLesson.content = cleanedMarkdown;

            const { healedQuiz, issues: questIssues } = validateAndHealQuizObject(healedLesson.dailyQuest, `Lesson_${idx + 1}_dailyQuest`);
            healedLesson.dailyQuest = healedQuiz;

            const allLessonIssues = [...contentIssues, ...questIssues];
            if (allLessonIssues.length > 0) {
                report.totalIssuesFixed += allLessonIssues.length;
                report.detailedFixes.push(`[${lesson.title}]: ${allLessonIssues.join(' | ')}`);
            }

            healedLessons.push({
                ...healedLesson,
                order: healedLessons.length + 1
            });
        });

        return res.json({
            success: true,
            report,
            healedLessons
        });
    } catch (err) {
        console.error('❌ [Course QA Linter Error]:', err.message);
        return res.status(500).json({ success: false, error: 'تعذر إتمام الفحص الآلي للكورس.' });
    }
});


// ============================================================================
// 🎙️ (أ) محرك الصوت العصبي الفائق لـ 7 لغات عالمية (Multi-Language Neural TTS)
// ============================================================================
const NEURAL_VOICE_MAP = {
    'fr-FR': { female: 'fr-FR-DeniseNeural', male: 'fr-FR-HenriNeural' },
    'ja-JP': { female: 'ja-JP-NanamiNeural', male: 'ja-JP-KeitaNeural' },
    'ko-KR': { female: 'ko-KR-SunHiNeural', male: 'ko-KR-InJoonNeural' },
    'zh-CN': { female: 'zh-CN-XiaoxiaoNeural', male: 'zh-CN-YunxiNeural' },
    'de-DE': { female: 'de-DE-KatjaNeural', male: 'de-DE-ConradNeural' },
    'es-ES': { female: 'es-ES-ElviraNeural', male: 'es-ES-AlvaroNeural' },
    'en-US': { female: 'en-US-AriaNeural', male: 'en-US-ChristopherNeural' }
};



const { execFile } = require('child_process');
const execFilePromise = util.promisify(execFile);

app.post('/api/academy2/lang-cert/neural-tts', async (req, res) => {
    const { text, langCode = 'fr-FR', rate = 1.0 } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'النص الصوتي مفقود.' });
    }

    // تنظيف النص
    const cleanForeignText = sanitizeLanguageText(text)
        .replace(/🔊.*$/g, '').replace(/\|.*$/g, '').replace(/^✅.*$/g, '')
        .replace(/^\d+[.) -]+/, '').replace(/\([^)]*[\u0600-\u06FF]+[^)]*\)/g, '')
        .replace(/[\u0600-\u06FF]+/g, '').replace(/["`$\\]/g, '').replace(/\s+/g, ' ').trim();

    const finalTextToSpeak = (cleanForeignText || text.replace(/[\u0600-\u06FF"`$\\]/g, '').trim()).slice(0, 300);
    if (!finalTextToSpeak) return res.status(400).json({ success: false, error: 'نص غير صالح.' });

    const numericRate = Number(rate) || 1.0;

    // 🚀 المحرك الأول والأسرع (RAM & Node.js): يستغرق 100 ملي ثانية فقط للكلمات والجمل القصيرة!
    try {
        const ttsRes = await axios.get('https://translate.google.com/translate_tts', {
            params: {
                ie: 'UTF-8',
                q: finalTextToSpeak,
                tl: langCode,
                client: 'tw-ob',
                ttsspeed: numericRate < 0.8 ? 0.24 : 1
            },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            responseType: 'arraybuffer',
            timeout: 2500 // لن ننتظر أكثر من ثانيتين ونصف
        });

        if (ttsRes.data) {
            return res.json({
                success: true,
                audioUrl: `data:audio/mpeg;base64,${Buffer.from(ttsRes.data).toString('base64')}`,
                engine: 'node-ram-fast'
            });
        }
    } catch (cloudErr) {
        // إذا فشل المحرك السريع، ننتقل فوراً لمحرك بايثون
    }

    // 🐢 المحرك الثاني (Python Edge-TTS): أبطأ قليلاً لكنه احتياطي ممتاز
    const uniqueFileName = `temp_neural_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
    const outputPath = path.join(__dirname, uniqueFileName);

    try {
        const rateFlag = numericRate < 1 ? `-25%` : `+0%`;
        const voicePack = NEURAL_VOICE_MAP[langCode] || NEURAL_VOICE_MAP['en-US'];
        
        const { execFile } = require('child_process');
        const execFilePromise = util.promisify(execFile);
        
        await execFilePromise('python', ['-m', 'edge_tts', '--voice', voicePack.female, '--text', finalTextToSpeak, `--rate=${rateFlag}`, '--write-media', outputPath], { timeout: 4000 });

        if (fs.existsSync(outputPath)) {
            const audioBuffer = fs.readFileSync(outputPath);
            fs.unlinkSync(outputPath);
            return res.json({
                success: true,
                audioUrl: `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`,
                engine: 'python-edge'
            });
        }
    } catch (pyErr) {
        if (fs.existsSync(outputPath)) { try { fs.unlinkSync(outputPath); } catch (e) {} }
    }

    res.status(503).json({ success: false, fallbackToBrowser: true });
});




// ============================================================================
// 🤖 (د) المصحح المزدوج الذكي: يفحص الإملاء والنبرات والتذكير والتأنيث في اللغات + يفحص الأكواد في البرمجة!
// ============================================================================
app.post('/api/academy2/verify-student-code', async (req, res) => {
    try {
        const { taskQuestion = '', studentCode = '', solutionCode = '', targetLanguage = '', isLanguageTask = false } = req.body;

        if (!studentCode || studentCode.trim() === '') {
            return res.status(400).json({ success: false, error: 'يرجى كتابة إجابتك أولاً قبل التحقق.' });
        }

        const isLang = Boolean(isLanguageTask || isLanguageTopicText(`${taskQuestion} ${solutionCode} ${targetLanguage}`));

        const systemPrompt = isLang
            ? `أنت كبير مصححي اختبارات اللغات الدولية (DELF/DALF للفرنسية، IELTS للإنجليزية، JLPT لليابانية، Goethe للألمانية).
            - السؤال المطلوب من الطالب: "${taskQuestion}"
            - الحل النموذجي المرجعي: "${solutionCode}"
            - إجابة الطالب الفعلية: "${studentCode}"

            🚨 مهمتك الدقيقة كمصحح لغوي وإملائي:
            1. افحص إجابة الطالب بدقة من حيث:
               - صحة التهجئة والحروف الصامتة.
               - علامات النبر والحركات المزخرفة (مثل Les accents: é, è, ê, ç في الفرنسية) وعلامة الحذف (L'apostrophe مثل C'est, L'eau).
               - تطابق الجنس النحوي (المذكر والمؤنث: un/le مقابل une/la، وتطابق الصفة مع الموصوف مثل un chat gris / une pomme rouge).
            2. إذا كانت إجابة الطالب صحيحة في المعنى والتركيب (حتى لو نسي حركة بسيطة كالـ accent)، اجعل "isCorrect": true، ولكن نبهه بلطف في "feedback" على الحركة أو الـ Accent لتكون كتابته بمستوى المتحدث الأصلي 100%!
            3. إذا كان هناك خطأ في الجنس النحوي (مثل un table بدلاً من une table) أو خطأ هيكلي، اجعل "isCorrect": false واشرح له القاعدة الصوتية/النحوية بلطف شديد مع إعطائه الصياغة المصححة في "correctedSnippet".

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "isCorrect": true,
              "feedback": "رسالة تشجيعية دقيقة توضح نقاط القوة، وتنبهه على أي Accent أو حرف صامت أو قاعدة تذكير/تأنيث...",
              "correctedSnippet": "الإجابة النموذجية المصححة بالحركات الكاملة (أو اتركها فارغة إذا كانت إجابته مثالية 100%)"
            }`
            : `أنت معلم برمجة لطيف ومشجع جداً (تشرح بأسلوب مبسط لطفل ذكي).
            - المطلوب من الطالب: "${taskQuestion}"
            - الحل النموذجي المرجعي: "${solutionCode}"
            - الكود الذي كتبه الطالب: "${studentCode}"

            افحص كود الطالب بمرونة؛ إذا كان يؤدي المطلوب اعتبره ناجحاً ("isCorrect": true) وكافئه بكلمات حماسية! وإذا كان فيه خطأ، اجعل "isCorrect": false واشرح له خطأه بلطف شديد.
            رد بصيغة JSON فقط بهذا الهيكل:
            {
              "isCorrect": true,
              "feedback": "رسالتك التشجيعية أو ملاحظتك المبسطة للطالب هنا...",
              "correctedSnippet": "السطر المصحح إن وجد خطأ، أو اتركه فارغاً إذا كان كوده صحيحاً"
            }`;

        const rawContent = await generateContentSmart(systemPrompt, "افحص إجابة الطالب الآن بصيغة JSON.", 0.4, 4000);
        const parsedContent = safeParseAIJson(rawContent);

        res.json({ success: true, data: sanitizeLanguageLessonJSON(parsedContent) });
    } catch (error) {
        console.error('❌ خطأ في فحص إجابة الطالب:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء فحص الإجابة.' });
    }
});




// ============================================================================
// 👑 9. مسار توليد الوثيقة التفصيلية الشاملة للشهادة المهنية وتجميع الكراش كورسات
// ============================================================================
app.post('/api/academy2/forge-certificate-dossier', async (req, res) => {
    try {
        const { certificateTitle, certificateDescription, mainAnalogy, coursesSummary } = req.body;

        console.log(`\n👑 [Master Dossier] جاري تأليف الوثيقة التفصيلية الشاملة للشهادة: "${certificateTitle}"...`);

        const systemPrompt = `أنت عميد أكاديمية تقنية عالمية وخبير في التخطيط الاستراتيجي للشهادات المهنية (على طراز Coursera وIBM).
        مهمتك هي كتابة **"الوثيقة المرجعية والتسويقية الشاملة"** للشهادة المهنية التالية وتفصيل كل كراش كورس بداخلها:
        
        - اسم الشهادة المهنية: "${certificateTitle}"
        - الوصف الأولي: "${certificateDescription}"
        - القصة والتشبيه الممتد (ELI5): "${mainAnalogy}"
        - قائمة الكراش كورسات المشمولة ووحداتها: ${JSON.stringify(coursesSummary)}

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "executiveVision": "شرح مفصل وملهم (3 فقرات) يشرح فلسفة هذه الشهادة المهنية وكيف تأخذ الطالب من الصفر المطلق إلى الاحتراف الكامل...",
          "timePlan": {
            "totalHours": "إجمالي الساعات (مثال: 210 ساعة تدريبية)",
            "durationStandard": "4 إلى 5 أشهر (بمعدل 10 ساعات أسبوعياً)",
            "durationIntensive": "شهران (بمعدل 25 ساعة أسبوعياً - معسكر مكثف)"
          },
          "careerAndFinancialROI": {
            "jobRoles": ["المسمى الوظيفي 1", "المسمى الوظيفي 2", "المسمى الوظيفي 3", "المسمى الوظيفي 4"],
            "freelanceServices": [
              "خدمة العمل الحر 1 التي يمكن للطالب بيعها للعملاء وبكم؟",
              "خدمة العمل الحر 2...",
              "خدمة العمل الحر 3..."
            ],
            "saasOpportunities": [
              "فكرة مشروع Micro-SaaS 1 يستطيع الطالب بناءها بعد إتمام الشهادة",
              "فكرة مشروع Micro-SaaS 2..."
            ]
          },
          "detailedCoursesGuide": [
            {
              "courseOrder": 1,
              "courseTitle": "اسم الكراش كورس",
              "deepExplanation": "شرح مفصل جداً لما يدرسه الطالب في هذا الكراش كورس، ولماذا هو أساسي، وكيف يبني على ما قبله...",
              "keyTakeaways": ["ماذا سيتقن 1", "ماذا سيتقن 2", "ماذا سيتقن 3"],
              "projectAndAiRole": "شرح تفصيلي للمشروع الذي سيبنيه في نهاية هذا الكراش كورس وكيف سيستعين بـ AI Agent ورفعه على GitHub"
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            "قم بتأليف الوثيقة التفصيلية الشاملة للشهادة المهنية وجميع الكراش كورسات الآن بصيغة JSON.",
            0.7,
            18000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في توليد وثيقة الشهادة:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء توليد وثيقة الشهادة.' });
    }
});




// ============================================================================
// 🚀 10. مسار تحسين عناوين الشهادة المهنية وسد الفجوات (يدعم البرمجة + اللغات بذكاء!)
// ============================================================================
app.post('/api/academy2/enhance-certificate-courses', async (req, res) => {
    try {
        const { certificateTitle, mainAnalogy, currentCourses, isLanguageSeries } = req.body;

        console.log(`\n🚀 [AI Optimizer] جاري فحص وترقية الشهادة المهنية: "${certificateTitle}"...`);

        const isLang = Boolean(isLanguageSeries || isLanguageTopicText(certificateTitle));

        const systemPrompt = isLang
            ? `أنت عميد معهد كامبريدج للغات (Cambridge & CEFR Chief Architect) وأعظم خبير في تدريس اللغات من الحروف (Pre-A1/A0) إلى طلاقة المتحدث الأصلي (C2 Native) واجتياز الاختبارات العالمية (IELTS/JLPT/DELF).
            لدينا الشهادة اللغوية التالية: "${certificateTitle}"
            وهذه قائمة الكراش كورسات الحالية فيها:
            ${JSON.stringify(currentCourses)}

            🚨 مهمتك المزدوجة (بأسلوب كتب Cambridge Interchange + التبسيط لطفل صغير ELI5):
            1. إعادة صياغة وترقية عناوين وأوصاف الكورسات الحالية لتكون متدرجة بسلاسة فائقة ومنطقية جداً من الأسهل للأصعب، مع الحفاظ على حقل "originalIndex" لكل كورس قديم كما هو تماماً.
            2. فحص الفجوات في التدرج اللغوي وإضافة 2 إلى 4 "كراش كورسات لغوية حاسمة مفقودة" في مكانها الصحيح تماماً (مثل: كورس تأسيس الحروف والأصوات والقراءة من الصفر Phonics، أو كورس الربط الصوتي وفهم المتحدث السريع Connected Speech، أو كورس المتلازمات اللفظية Collocations، أو كورس هندسة الكتابة والمحادثة لاختبار IELTS/JLPT). الكورسات الجديدة ضع لها "originalIndex": null.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "upgradedCertificateTitle": "الاسم المطور للشهادة اللغوية",
              "architectSummary": "شرح موجز لما قمت بترقيته في التسلسل اللغوي وما هي الكورسات التي أضفتها لسد الفجوات من الحروف حتى الطلاقة...",
              "courses": [
                {
                  "originalIndex": 0,
                  "courseTitle": "العنوان المحسن أو الجديد...",
                  "description": "الوصف المبسط والعميق لما سيتعلمه الطالب سمعياً ونطقياً ونحوياً...",
                  "difficultyLevel": "المستوى اللغوي (مثال: Pre-A1 / A1.1 / B2 / C2)...",
                  "estimatedHours": "18 ساعة",
                  "certificateBadge": "شهادة إتمام...",
                  "connectionToPrevious": "كيف يبني على المستوى اللغوي السابق...",
                  "githubProject": {
                    "projectTitle": "التحدي الصوتي واللغوي التطبيقي لنهاية الكورس",
                    "projectSummary": "وصف المحادثة الصوتية والمهمة الكتابية مع الـ AI Voice Tutor"
                  },
                  "skills": ["مهارة 1", "مهارة 2", "مهارة 3"]
                }
              ]
            }`
            : `أنت عميد أكاديمية تقنية عالمية ومهندس مناهج خارق (S-Rank Curriculum Architect).
            لدينا الشهادة المهنية التالية: "${certificateTitle}"
            والتشبيه القصصي المعتمد لها (ELI5): "${mainAnalogy}"
            وهذه قائمة الكراش كورسات الحالية فيها:
            ${JSON.stringify(currentCourses)}

            🚨 مهمتك المزدوجة:
            1. تحسين وصقل عناوين وأوصاف الكورسات الحالية لتكون أكثر احترافية وتشويقاً، مع الحفاظ على حقل "originalIndex" لكل كورس قديم كما هو تماماً لكي لا نفقد بياناته!
            2. اكتشاف 2 إلى 4 "كراش كورسات ناقصة وحاسمة" تجعل هذه الشهادة المهنية خارقة ولا مثيل لها في سوق العمل، ودمجها في المكان الترتيبي الأنسب داخل المصفوفة. الكورسات الجديدة ضع لها "originalIndex": null.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "upgradedCertificateTitle": "الاسم المطور للشهادة المهنية",
              "architectSummary": "شرح موجز لما قمت بترقيته وما هي الكورسات الناقصة التي أضفتها ولماذا وضعتها في تلك الأماكن...",
              "courses": [
                {
                  "originalIndex": 0,
                  "courseTitle": "العنوان المحسن أو الجديد...",
                  "description": "الوصف المبسط والعميق...",
                  "difficultyLevel": "المستوى...",
                  "estimatedHours": "16 ساعة",
                  "certificateBadge": "شهادة إتمام...",
                  "connectionToPrevious": "كيف يرتبط بما قبله...",
                  "githubProject": {
                    "projectTitle": "اسم مشروع GitHub",
                    "projectSummary": "وصف المشروع بمساعدة AI Agent"
                  },
                  "skills": ["مهارة 1", "مهارة 2", "مهارة 3"]
                }
              ]
            }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            "قم بترقية عناوين الشهادة وحقن الكراش كورسات الناقصة في أماكنها الصحيحة الآن بصيغة JSON.",
            0.7,
            20000
        );
        const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في ترقية الشهادة:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء ترقية الشهادة المهنية.' });
    }
});

// ============================================================================
// 🛠️ دالة مساعدة لتحليل JSON بأمان تام من ردود الذكاء الاصطناعي
// ============================================================================
const safeParseAIJson = (rawContent) => {
    if (!rawContent) return {};
    if (typeof rawContent === 'object') return rawContent;
    if (typeof rawContent === 'string') {
        const cleaned = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        return JSON.parse(match ? match[0] : cleaned);
    }
    return {};
};

// ============================================================================
// 🌍 (ب) البروفايل البيداغوجي الذكي لـ 7 لغات (يراعي الفروق الجذرية بين اللغات الأوروبية والآسيوية!)
// ============================================================================
const detectTargetLanguageProfile = (rawContext = '', explicitTargetLang = '') => {
    const combined = `${explicitTargetLang} ${rawContext}`.toLowerCase();

    // 1. 🇯🇵 اللغة اليابانية (3 أنظمة كتابة + جملة SOV + الأدوات النحوية Particles)
    if (/يابان|japanese|日本語|jlpt|hiragana|kanji|هيراغانا|كانجي/i.test(combined)) {
        return {
            id: 'ja',
            family: 'east_asian_sov',
            nameAr: 'اليابانية',
            nameEn: 'Japanese (日本語)',
            speechLang: 'ja-JP',
            instituteRole: 'أنت كبير مؤلفي مناهج مؤسسة اليابان (Japan Foundation) وخبير اختبارات JLPT (من N5 إلى N1).',
            examName: 'JLPT N5-N1',
            vocabTableColumns: '| المفردة (كانجي/هيراغانا + Romaji) | الرمز الصوتي والنبر (IPA & Pitch) | النطق التقريبي بالعربية | الأداة النحوية (Particle) أو تشريح الكانجي ومستوى الأدب | المعنى الدقيق بالعربية |',
            specialMorphologyRule: `
            🎌 **قانون تدريس اللغة اليابانية الخاص (Japanese Pedagogical DNA):**
            1. **نظام الكتابة الثلاثي:** اكتب الكلمات دائماً بالهيراغانا/الكانجي متبوعة بنطق (Romaji) بين قوسين مثل: \`みず (mizu)\` أو \`食べる (taberu)\` ليربط الطالب الشكل بالصوت فوراً.
            2. **هندسة الجملة المعكوسة (SOV + Particles):** ذكّر الطالب دائماً في معادلات الليغو أن **الفعل في اليابانية يأتي في نهاية الجملة دائماً**، وأن الكلمات ترتبط ببعضها عبر **الأدوات (Particles 助詞: は wa, が ga, を wo, に ni, で de, へ e, の no, か ka)** وليس بتصريف الفعل حسب الضمير!
            3. **مستويات الأدب:** وضّح الفرق بين الصيغة المهذبة اليومية (\`です / ます Desu/Masu\`) والصيغة العادية (\`Plain Form\`).`,
            a0PhonicsUnits: `
            - الوحدة 1: حروف العلة الخمسة في الهيراغانا (あ a, い i, う u, え e, お o) وصفا (Ka & Sa) مع الكلمات التأسيسية الأولى.
            - الوحدة 2: حروف الهيراغانا لصفوف (Ta, Na, Ha) ومخارج الأصوات اليابانية الصافية.
            - الوحدة 3: حروف الهيراغانا لصفوف (Ma, Ya, Ra, Wa, N) والأصوات المجهورة (Dakuten: ga, za, da, ba, pa).
            - الوحدة 4: الأصوات المدمجة (Yoon: kya, sha, cha) والشدة الصوتية (Sokuon っ) والمد الطويل والنبر النغمي (Pitch Accent).
            - الوحدة 5: حروف الكاتاكانا الأساسية (Katakana) لقراءة الكلمات العالمية والتقنية والأسماء.
            - الوحدة 6: معادلة الجملة اليابانية الأولى بالمكعبات ([الفاعل + は wa] + [الاسم + です desu]) والتحيات اليومية (Aisatsu).
            - الوحدة 7: أسماء الإشارة للمكان والأشياء (これ kore, それ sore, あれ are) وأداة الملكية والسؤال (の no, か ka) وأول 15 رمز كانجي تصويري (Kanji).`,
            a0PedagogyRules: `
            🚨 تحذير صارم (مستوى التأسيس Pre-A1 / A0 للغة اليابانية 🇯🇵):
            - ممنوع استخدام أي كلمة إنجليزية كـمثال! كل الأمثلة يابانية مكتوبة بالهيراغانا/الكاتاكانا مع Romaji والترجمة العربية.
            - الجمل قصيرة جداً (2 إلى 5 كلمات) مثل: \`これは ほん です (Kore wa hon desu)\`.`,
            a0SentenceRules: `الأدوات النحوية الأساسية (は wa, を wo, に ni, で de, へ e)، أفعال الحياة اليومية بصيغة (ます Masu-form: 食べます، 行きます، 見ます)، النفي بـ (ません masen)، والسؤال بـ (か ka).`,
            a1Grammar: `قواعد JLPT N5: الصفات بنوعيها (i-adjectives & na-adjectives)، صيغة (Te-form) للربط والطلب المهذب (てください)، التعبير عن الرغبة (たい tai) والوجود (あります / います) + أول 100 كانجي.`,
            a2Grammar: `قواعد JLPT N4: الصيغ العادية (Plain Form: Nai, Ta, Dictionary)، الجمل الشرطية (たら tara, ば ba, と to)، وإعطاء وتلقي الخدمات (あげる، もらう، くれる) + 300 كانجي.`,
            b1Grammar: `قواعد JLPT N3: المبني للمجهول والسببية (Passive & Causative)، لغة الاحترام الرسمية في العمل (Keigo: Sonkeigo & Kenjougo)، والروابط السردية.`,
            b2Grammar: `قواعد JLPT N2: التراكيب النحوية المهنية والإعلامية، المتلازمات اليابانية، وفهم المحادثات بالسرعة الطبيعية + 1000 كانجي.`,
            c1c2Grammar: `قواعد JLPT N1: الذروة البلاغية والأدبية، التعابير الرباعية الحكيمة (Yojijukugo 四字熟語)، قراءة النصوص الفلسفية والاقتصادية، والطلاقة الكاملة.`
        };
    }

    // 2. 🇨🇳 اللغة الصينية الماندرين (النغمات الـ 4 + الجذور التصويرية Radicals + أدوات القياس Measure Words)
    if (/صين|mandarin|chinese|中文|hsk|pinyin/i.test(combined)) {
        return {
            id: 'zh',
            family: 'east_asian_tonal',
            nameAr: 'الصينية (الماندرين)',
            nameEn: 'Mandarin Chinese (中文)',
            speechLang: 'zh-CN',
            instituteRole: 'أنت كبير مؤلفي مناهج معهد كونفوشيوس وخبير اختبارات HSK القياسية (من HSK 1 إلى HSK 6).',
            examName: 'HSK 1-6',
            vocabTableColumns: '| المفردة (الرمز الصيني Hanzi + Pinyin) | النغمة الصوتية والـ IPA | النطق التقريبي بالعربية | الجذر التصويري (Radical) وأداة القياس (Measure Word) | المعنى الدقيق بالعربية |',
            specialMorphologyRule: `
            🏮 **قانون تدريس اللغة الصينية الماندرين الخاص (Mandarin Pedagogical DNA):**
            1. **الرمز الصيني + البينين بالنغمات دائماً:** اكتب كل كلمة أو جملة بالرموز الصينية (Hanzi) متبوعة بنظام (Pinyin مع علامات النغمات الأربع: ā, á, ǎ, à) مثل: \`你好 (Nǐ hǎo)\` أو \`喝水 (hē shuǐ)\`.
            2. **تشريح الجذور وأدوات القياس:** اشرح للطالب كيف يتكون الرمز الصيني من **جذر معنوي (Radical 部首)** (مثلاً جذر الماء \`氵\` أو الفم \`口\`)، واذكر دائماً **أداة القياس (Measure Word 量词: 个 gè, 本 běn, 杯 bēi)** مع الأسماء!
            3. **بنية الجملة الصينية بلا تصريف:** ذكّر الطالب في معادلات الليغو أن الفعل في الصينية لا يتصرف أبداً، بل يعتمد الزمن على **ترتيب المكعبات: \`[الفاعل] + [الزمان] + [المكان] + [الفعل] + [المفعول]\`** وأدوات الحالة (\`了 le, 过 guo\`).`,
            a0PhonicsUnits: `
            - الوحدة 1: البينين الصوتي (Pinyin): الأصوات الاستهلالية البسيطة (b, p, m, f, d, t, n, l) والنهايات الصوتية الصافية.
            - الوحدة 2: النغمات الأربع في اللغة الصينية (The 4 Tones: المسطحة ā، الصاعدة á، المنحنية ǎ، الهابطة à) وكيف تغير النغمة المعنى كلياً (mā أم، má قنب، mǎ حصان، mà يوبخ).
            - الوحدة 3: مخارج الأصوات الصينية الخاصة بالتاج واللسان (j, q, x مقابل zh, ch, sh, r مقابل z, c, s).
            - الوحدة 4: قواعد تغير النغمة في الكلام المتصل (Tone Sandhi: مثل تحول النغمة الثالثة الأولى إلى ثانية في Nǐ hǎo ➔ Ní hǎo، وتغير نغمة 不 bù و 一 yī).
            - الوحدة 5: الجذور التصويرية الأساسية للرموز الصينية (Radicals: إنسان 人، ماء 氵، فم 口، يد 扌، قلب 心) وأول 40 رمز هانزي.
            - الوحدة 6: الضمائر الشخصية (我 wǒ, 你 nǐ, 他/她 tā) وفعل الكينونة (是 shì) والنفي بـ (不 bù و 没 méi).
            - الوحدة 7: الأرقام، وأدوات القياس الإلزامية بين الرقم والاسم (Measure Words: 一个人، 一本书، 一杯茶) وتكوين السؤال بـ (吗 ma و 什么 shénme).`,
            a0PedagogyRules: `
            🚨 تحذير صارم (مستوى التأسيس Pre-A1 / A0 للغة الصينية 🇨🇳):
            - ممنوع استخدام أي كلمة إنجليزية! كل مثال يجب أن يضم الرمز الصيني (Hanzi) + (Pinyin بالنغمات) + الترجمة العربية.`,
            a0SentenceRules: `قاعدة ترتيب الجملة الصينية الذهبية (الفاعل + الزمان + المكان + الفعل + المفعول)، أداة الملكية والوصف (的 de)، وأفعال الحياة اليومية لـ HSK 1.`,
            a1Grammar: `قواعد HSK 1-2: أداة اكتمال الحدث (了 le)، التجربة السابقة (过 guo)، الأفعال المساعدة (想 xiǎng, 要 yào, 会 huì, 能 néng, 可以 kěyǐ)، وتراكيب المسافة والوقت.`,
            a2Grammar: `قواعد HSK 3: المكملات النتيجية والاتجاهية (Resultative & Directional Complements: 看见، 听懂، 进来)، صيغ المقارنة بـ (比 bǐ)، وتراكيب تقديم المفعول بـ (把 bǎ).`,
            b1Grammar: `قواعد HSK 4: الجمل المركبة والروابط المنطقية (虽然...但是 / 不但...而且 / 只要...就)، المبني للمجهول بـ (被 bèi)، والتعبير عن الآراء المهنية.`,
            b2Grammar: `قواعد HSK 5: المتلازمات الصينية الرسمية، الأمثال الرباعية المأثورة (Chengyu 成语)، وقراءة النصوص الإعلامية والاقتصادية.`,
            c1c2Grammar: `قواعد HSK 6+: البلاغة الصينية الكلاسيكية والحديثة، الظلال الدلالية الدقيقة بين المترادفات، والخطاب الأكاديمي والدبلوماسي الرفيع.`
        };
    }

    // 3. 🇰🇷 اللغة الكورية (مكعبات الهانغول Hangul + الحرف السفلي Batchim + تناغم الأدوات ومستويات الاحترام)
    if (/كوري|korean|한국어|topik|hangul|هانغول/i.test(combined)) {
        return {
            id: 'ko',
            family: 'east_asian_sov',
            nameAr: 'الكورية',
            nameEn: 'Korean (한국어)',
            speechLang: 'ko-KR',
            instituteRole: 'أنت كبير مؤلفي مناهج معهد الملك سيجونغ (King Sejong Institute) وخبير اختبارات TOPIK I & II.',
            examName: 'TOPIK I & II',
            vocabTableColumns: '| المفردة بالهانغول (Hangul + Romanization) | النطق الصوتي والـ IPA | النطق التقريبي بالعربية | تحليل المقطع والـ Batchim ومستوى الاحترام | المعنى الدقيق بالعربية |',
            specialMorphologyRule: `
            🇰🇷 **قانون تدريس اللغة الكورية الخاص (Korean Pedagogical DNA):**
            1. **تركيب مكعبات الهانغول (Hangul Syllable Blocks):** وضح للطالب كيف تتجمع الحروف الساكنة والصوتية في مربع مقطعي واحد (حرف أول + حركة + حرف سفلي \`Batchim 받침\`) مع كتابة النطق اللاتيني بين قوسين مثل: \`한국어 (han-gug-eo)\`.
            2. **قاعدة الوصل الصوتي للـ Batchim (Liaison 연음):** نبه الطالب دائماً في الأشعة الصوتية كيف يقفز الحرف الساكن السفلي (Batchim) ليندمج مع الحركة التي تليه (مثل: \`먹어요 ➔ 머거요 meo-geo-yo\`).
            3. **هندسة الجملة المعكوسة (SOV + تناغم الأدوات):** الفعل أو الصفة في نهاية الجملة دائماً! والأدوات النحوية تتغير حسب وجود Batchim أو عدمه (\`은/는\`, \`이/가\`, \`을/를\`).`,
            a0PhonicsUnits: `
            - الوحدة 1: فلسفة حروف العلة الكورية الأساسية في الهانغول (ㅏ a, ㅓ eo, ㅗ o, ㅜ u, ㅡ eu, ㅣ i) والحروف الساكنة الأولى (ㄱ, ㄴ, ㅁ, ㅅ, ㅇ).
            - الوحدة 2: باقي الحروف الساكنة البسيطة والمنفوخة بالهواء (Aspirated: ㅋ, ㅌ, ㅍ, ㅊ) والحروف المشددة المزدوجة (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ).
            - الوحدة 3: الحروف الصوتية المركبة (ㅐ, ㅔ, ㅘ, ㅝ, ㅢ) وكيفية بناء مربع المقطع الكوري (Syllable Block Assembly).
            - الوحدة 4: أسرار الحرف الساكن السفلي (Batchim 받침) وقواعد نطقه الـ 7 والوصل الصوتي التلقائي (Liaison 연음).
            - الوحدة 5: فعل الكينونة الكوري (이에요 / 예요) والتحيات اليومية ومستوى الاحترام المهذب (해요체).
            - الوحدة 6: هيكل الجملة الكورية بالمكعبات (SOV) وأدوات الموضوع والفاعل والمفعول المتناغمة (은/는, 이/가, 을/를).
            - الوحدة 7: أسماء الإشارة (이거, 그거, 저거)، الوجود والملكية (있어요 / 없어요)، والأرقام الكورية والصينية-الكورية.`,
            a0PedagogyRules: `
            🚨 تحذير صارم (مستوى التأسيس Pre-A1 / A0 للغة الكورية 🇰🇷):
            - ممنوع استخدام أي كلمة إنجليزية كـمثال! كل الأمثلة كورية مكتوبة بالهانغول مع النطق والترجمة العربية.`,
            a0SentenceRules: `تصريف الأفعال والصفات في المضارع المهذب (-아요 / -어요)، أدوات المكان والاتجاه (에 / 에서)، والنفي بـ (안 / 못).`,
            a1Grammar: `قواعد TOPIK I (المستوى 1): الماضي (-았/었어요)، المستقبل (-을 거예요)، الطلب المهذب (-으세요)، وأدوات الربط البسيطة (-고, -지만, -아/어서).`,
            a2Grammar: `قواعد TOPIK I (المستوى 2): التعبير عن القدرة والاستطاعة (-을 수 있다/없다)، الالتزام (-아야/어야 하다)، التجربة (-아/어 본 적이 있다)، وتعديل الأسماء (-(으)ㄴ/는).`,
            b1Grammar: `قواعد TOPIK II (المستوى 3-4): مستويات الخطاب الرسمية والكتابة، الكلام غير المباشر (-다고 하다)، والروابط السببية والشرطية المتقدمة.`,
            b2Grammar: `قواعد TOPIK II (المستوى 5): التراكيب الأكاديمية والإعلامية، الأمثال الكورية، والمفردات الصينية-الكورية (Hanja-eo) المتقدمة.`,
            c1c2Grammar: `قواعد TOPIK II (المستوى 6): الذروة البلاغية والمهنية، كتابة المقالات التحليلية الطويلة، والطلاقة الكاملة.`
        };
    }

    // 4. 🇫🇷 اللغة الفرنسية
    if (/فرنس|french|français|delf|dalf/i.test(combined)) {
        return {
            id: 'fr',
            family: 'european',
            nameAr: 'الفرنسية',
            nameEn: 'French (Français)',
            speechLang: 'fr-FR',
            instituteRole: 'أنت كبير مؤلفي مناهج Alliance Française وخبير اختبارات DELF/DALF.',
            examName: 'DELF B2 / DALF C1-C2',
            vocabTableColumns: '| المفردة / العبارة (Français) | الرمز الصوتي (IPA) | النطق التقريبي بالعربية | حركة الفم والأشعة الصوتية (🔇 للصامت / ‿ للوصل) | المعنى الدقيق بالعربية (🔵 مذكر / 🔴 مؤنث) |',
            specialMorphologyRule: `
            🇫🇷 **قانون تدريس اللغة الفرنسية الخاص:**
            - ضع دائماً رمز الجنس النحوي **(🔵 مذكر)** أو **(🔴 مؤنث)** مع كل اسم.
            - أبرز دائماً الحروف الصامتة في نهاية الكلمة والوصل الصوتي بعلامة القوس السفلي \`‿\` (La Liaison) والحذف الصوتي (L'Élision \`l' / c'est\`).`,
            a0PhonicsUnits: `
            - الوحدة 1: الحروف الفرنسية، الحركات الصوتية الأساسية (a, e, i, o, u, y)، وقاعدة الحروف الصامتة في نهاية الكلمات (e, s, t, d, x).
            - الوحدة 2: الحركات المزخرفة والنبرات الفرنسية (Les Accents: é, è, ê, ç) والفرق الصوتي الدقيق بين (/e/ المغلقة و /ɛ/ المفتوحة).
            - الوحدة 3: المقاطع الصوتية المركبة الأساسية (Les Sons Composés: ou, oi, au, eau, eu, œu) في مفردات الحياة اليومية.
            - الوحدة 4: الأصوات الأنفية الفرنسية الشهيرة (Les Voyelles Nasales: an/en, in/ain, on, un) ومخارج الهواء من الفم والأنف.
            - الوحدة 5: الحروف الساكنة المركبة (ch, ph, gn, ill, qu) وأدوات التنكير والتعريف للمذكر والمؤنث (un, une, des / le, la, l', les).
            - الوحدة 6: الوصل الصوتي الإجباري (La Liaison & L'Élision) وتقديم الأشياء والناس بـ (C'est un... / Voici la...).
            - الوحدة 7: الضمائر الشخصية (je, tu, il, elle) مع فعلي الكينونة والملكية (être & avoir) والأرقام والألوان.`,
            a0PedagogyRules: `
            🚨 تحذير صارم (مستوى التأسيس Pre-A1 / A0 للغة الفرنسية 🇫🇷):
            - ممنوع كتابة أي كلمة إنجليزية! كل الأمثلة والمفردات فرنسية حصراً مع ترجمتها العربية.`,
            a0SentenceRules: `الضمائر الشخصية، تصريف أفعال المجموعة الأولى (-er) وفعلي (être / avoir)، النفي بالمكعبين المحيطين بالفعل (ne... pas)، وتكوين السؤال بـ (Est-ce que... ?).`,
            a1Grammar: `المضارع الدلالي (Présent de l'indicatif)، أفعال المجموعات الثلاث، أدوات التجزئة (du, de la, des)، صفات الملكية، والمستقبل القريب (Futur proche).`,
            a2Grammar: `الماضي المركب (Passé composé مع avoir و être) والماضي الناقص (Imparfait) لسرد الذكريات، المستقبل البسيط (Futur simple)، والضمائر المفعولة (COD / COI / y / en).`,
            b1Grammar: `الربط بين الأزمنة السردية، المضارع الشرطي (Conditionnel présent)، المنصوب (Subjonctif présent)، والضمائر الموصولة (qui, que, dont, où).`,
            b2Grammar: `صيغ الـ (Subjonctif) المتقدمة، الشرطيات المعقدة، الروابط الحجاجية (en revanche, quoique, néanmoins)، ومنهجية (Essai argumenté) لاختبار DELF B2.`,
            c1c2Grammar: `البلاغة الفرنسية الرفيعة، إتقان (Synthèse de documents) لاختبار DALF C1/C2، والظلال الدلالية الدقيقة.`
        };
    }

    // 5. 🇩🇪 اللغة الألمانية
    if (/ألمان|المان|german|deutsch|goethe|testdaf/i.test(combined)) {
        return {
            id: 'de',
            family: 'european',
            nameAr: 'الألمانية',
            nameEn: 'German (Deutsch)',
            speechLang: 'de-DE',
            instituteRole: 'أنت كبير مؤلفي مناهج معهد غوته (Goethe-Institut) وخبير اختبارات Goethe-Zertifikat و TestDaF.',
            examName: 'Goethe-Zertifikat / TestDaF',
            vocabTableColumns: '| المفردة (Deutsch - بحرف أول كبير للأسماء!) | الرمز الصوتي (IPA) | النطق التقريبي بالعربية | مخرج الصوت وقاعدة التركيب | المعنى الدقيق (🔵 der / 🔴 die / 🟢 das) |',
            specialMorphologyRule: `
            🇩🇪 **قانون تدريس اللغة الألمانية الخاص:**
            - اكتب كل اسم في الألمانية بحرف أول كبير دائماً مع أداة جنسه النحوي الثلاثي: **(🔵 der مذكر / 🔴 die مؤنث / 🟢 das محايد)**.
            - ركز في معادلات الليغو على **قاعدة الفعل في الموقع رقم 2 دائماً (V2 Rule)** وفي نهاية الجملة مع الروابط!`,
            a0PhonicsUnits: `
            - الوحدة 1: الأبجدية الألمانية ومخارج المقاطع الصوتية المركبة (ei, ie, eu, äu, au).
            - الوحدة 2: الحروف الصوتية المميزة (Umlaute: ä, ö, ü) وحرف (ß - Eszett).
            - الوحدة 3: مخارج الحروف الساكنة المركبة (ch في ich مقابل ach، و sch، و sp/st، و pf).
            - الوحدة 4: الأجناس النحوية الثلاثة وأدوات التعريف والتنكير (der, die, das / ein, eine) مع أول 100 اسم ملموس.
            - الوحدة 5: الضمائر الشخصية مع فعلي الكينونة والملكية (sein & haben).
            - الوحدة 6: بناء الجملة الألمانية الأولى وقاعدة الفعل في المركز الثاني (V2 Rule).
            - الوحدة 7: جمع الأسماء والنفي باستخدام (nicht مقابل kein/keine).`,
            a0PedagogyRules: `🚨 تحذير صارم: جميع الأمثلة والمفردات بالألمانية حصراً مع كتابة الحرف الأول كبيراً لكل اسم!`,
            a0SentenceRules: `قاعدة الفعل في الموقع الثاني (V2)، تصريف الأفعال القياسية في المضارع، وتكوين الأسئلة بـ (W-Fragen & Ja/Nein-Fragen).`,
            a1Grammar: `حالتا الرفع والنصب (Nominativ & Akkusativ)، الأفعال المنفصلة (Trennbare Verben)، والأفعال المساعدة (Modalverben).`,
            a2Grammar: `حالة الجر (Dativ)، حروف الجر متغيرة الحالة (Wechselpräpositionen)، الماضي التام (Perfekt)، والروابط التي ترسل الفعل للنهاية (weil, dass, wenn).`,
            b1Grammar: `الماضي البسيط السردي (Präteritum)، حالة المضاف إليه (Genitiv)، المبني للمجهول (Passiv)، وصيغة التمني والشرط (Konjunktiv II).`,
            b2Grammar: `الروابط المزدوجة، النعوت الموسعة، Nominalstil مقابل Verbalstil، والتحضير لاختبار Goethe B2.`,
            c1c2Grammar: `الكلام المنقول الرسمي (Konjunktiv I)، البلاغة الأكاديمية والعلمية، وإتقان مهارات TestDaF و Goethe C1/C2.`
        };
    }

    // 6. 🇪🇸 اللغة الإسبانية
    if (/إسبان|اسبان|spanish|español|dele|siele/i.test(combined)) {
        return {
            id: 'es',
            family: 'european',
            nameAr: 'الإسبانية',
            nameEn: 'Spanish (Español)',
            speechLang: 'es-ES',
            instituteRole: 'أنت كبير مؤلفي مناهج معهد ثيربانتس (Instituto Cervantes) وخبير اختبارات DELE/SIELE.',
            examName: 'DELE / SIELE',
            vocabTableColumns: '| المفردة / العبارة (Español) | الرمز الصوتي (IPA) | النطق التقريبي بالعربية | مخرج الصوت وموضع النبر (La Tilde) | المعنى الدقيق (🔵 el مذكر / 🔴 la مؤنث) |',
            specialMorphologyRule: `
            🇪🇸 **قانون تدريس اللغة الإسبانية الخاص:**
            - ميز بوضوح بين فعلي الكينونة **(\`Ser\` للجوهر والهوية الدائمة vs \`Estar\` للحالة والموقع)** وبين (\`Por\` vs \`Para\`).
            - ضع رمز الجنس النحوي (🔵 مذكر / 🔴 مؤنث) وعلامات الاستفهام والتعجب المزدوجة (\`¿...? / ¡...!\`).`,
            a0PhonicsUnits: `
            - الوحدة 1: الأبجدية الإسبانية وحروف العلة الخمسة الصافية الثابتة (a, e, i, o, u).
            - الوحدة 2: الحروف الخاصة في الإسبانية (ñ, ll, ch, rr) وحرف (h) الصامت دائماً.
            - الوحدة 3: قواعد نطق حرفي (c / z / q) وحرفي (g / j) حسب حرف العلة الذي يليهما.
            - الوحدة 4: التذكير والتأنيث وأدوات التعريف والتنكير (el, la, los, las / un, una).
            - الوحدة 5: قواعد النبر الصوتي وعلامة المد (La Tilde: á, é, í, ó, ú).
            - الوحدة 6: الفرق التأسيسي الأول بين فعلي الكينونة (Ser vs Estar) وتقديم النفس.
            - الوحدة 7: الفعل (Tener & Hay) مع الأرقام والألوان والصفات المطابقة للاسم.`,
            a0PedagogyRules: `🚨 تحذير صارم: جميع الأمثلة والمفردات بالإسبانية حصراً مع ترجمتها العربية!`,
            a0SentenceRules: `تصريف أفعال المجموعات الثلاث (-ar, -er, -ir) في المضارع، استخدامات (Ser, Estar, Tener, Ir)، وتكوين الأسئلة بـ (¿...?).`,
            a1Grammar: `الأفعال المنعكسة للروتين اليومي (Verbos reflexivos)، الأفعال متغيرة الجذر (poder, querer)، والفعل (Gustar).`,
            a2Grammar: `أزمنة الماضي في الإسبانية (Pretérito Indefinido vs Imperfecto vs Perfecto)، وضمائر المفعول المباشر وغير المباشر.`,
            b1Grammar: `المنصوب الإسباني (Presente de Subjuntivo)، صيغ الأمر (Imperativo)، والفرق الدقيق بين (Por vs Para).`,
            b2Grammar: `أزمنة الـ Subjuntivo الماضي، الجمل الشرطية المعقدة، والروابط الحجاجية لاختبار DELE B2.`,
            c1c2Grammar: `البلاغة الإسبانية، التعابير الاصطلاحية (Modismos)، والتحرير الأكاديمي لمستوى DELE C1/C2.`
        };
    }

    // 7. 🇬🇧 الافتراضي: اللغة الإنجليزية (على طراز The English Master Course + Cambridge)
    return {
        id: 'en',
        family: 'european',
        nameAr: 'الإنجليزية',
        nameEn: 'English',
        speechLang: 'en-US',
        instituteRole: 'أنت كبير مؤلفي مناهج Cambridge وأستاذ كورس (The English Master Course: Grammar, Speaking, Pronunciation & Writing).',
        examName: 'IELTS Band 8.0+ / TOEFL iBT',
        vocabTableColumns: '| المفردة / القالب (English Chunk) | الرمز الصوتي والنبر (IPA & Stress) | النطق التقريبي بالعربية | حركة الفم والوصل الصوتي (Connected Speech) | المعنى الدقيق والسياق بالعربية |',
        specialMorphologyRule: `
        🇬🇧 **قانون تدريس اللغة الإنجليزية الخاص (Cambridge × English Master Course Method):**
        - اشرح الأزمنة والقواعد دائماً عبر **الخطوط الزمنية البصرية (Visual Timelines)** ومعادلات الليغو.
        - ركز على **التشديد الصوتي (Word Stress)** والأصوات المركبة والحروف الصامتة والربط الصوتي في الكلام السريع (Connected Speech).`,
        a0PhonicsUnits: `
        - الوحدة 1: الحروف الساكنة الأولى وصوت العلة القصير (Short A) وعائلات (-at, -an) مثل (cat, mat, man, pan).
        - الوحدة 2: أصوات العلة القصيرة (Short I & Short E) والفرق السمعي بين (P / B) وعائلات (-in, -it, -et, -ed).
        - الوحدة 3: أصوات العلة القصيرة (Short O & Short U) وعائلات (-ot, -og, -ug, -un) مثل (dog, hot, cup, sun).
        - الوحدة 4: الأصوات المركبة الأساسية (Digraphs: SH, CH, TH, PH) والكلمات البصرية الأولى (Sight Words).
        - الوحدة 5: أصوات العلة الطويلة (Long Vowels & Magic E) والمقارنة السمعية بين القصير والطويل (hat vs hate, bit vs bite).
        - الوحدة 6: أدوات التنكير للمفرد (a / an) وأسماء الإشارة القريبة والبعيدة (This is a... / That is an...).
        - الوحدة 7: جمع الأسماء البسيطة والألوان والأرقام لوصف الأشياء اليومية الملموسة.`,
        a0PedagogyRules: `🚨 تحذير صارم: أنت في المستوى التأسيسي الأول (Pre-A1 / A0.1)؛ استخدم كلمات ملموسة وجمل قصيرة جداً (2 إلى 5 كلمات) مع نطقها وترجمتها فوراً.`,
        a0SentenceRules: `الضمائر الشخصية (I, you, he, she, it, we, they)، فعل الكينونة (am, is, are)، الأفعال اليومية البسيطة (have, want, like, go)، وتكوين الجملة والسؤال.`,
        a1Grammar: `المضارع البسيط والمستمر (Present Simple vs Continuous) بخط زمني بصري، الأسماء المعدودة وغير المعدودة، وحروف الجر المكانية والزمانية.`,
        a2Grammar: `الماضي البسيط والمستمر (Past Simple vs Continuous)، خطط المستقبل (will vs going to)، صيغ المقارنة والتفضيل، والمضارع التام التأسيسي.`,
        b1Grammar: `الأزمنة التامة المستمرة، ضمائر الوصل (Relative Clauses)، الجمل الشرطية (Conditionals 0-3)، المبني للمجهول، والكلام المتصل السريع (Connected Speech).`,
        b2Grammar: `المتلازمات اللفظية (Collocations)، الأفعال المركبة (Phrasal Verbs)، الشرطيات المختلطة (Mixed Conditionals)، وأفعال الاستنتاج (Modals of Deduction).`,
        c1c2Grammar: `الأساليب العكسية البلاغية (Inversion)، الجمل المنشطرة (Cleft Sentences)، المصدرية الأكاديمية (Nominalization)، والتعابير المجازية الدقيقة.`
    };
};



// ============================================================================
// 🧠 محرك التدرج اللغوي التصاعدي الحتمي متعدد اللغات (Deterministic 7-Tier CEFR Engine V4)
// يكتشف اللغة المستهدفة أولاً، ثم يعزل رقم الكورس ويقفل المحتوى على اللغة والمستوى بدقة 100%!
// ============================================================================
const getCEFRProgressionSpec = (courseTopic = '', sectionName = '', lessonTitle = '', difficulty = '', explicitCourseOrder = null, explicitTargetLang = '') => {
    const rawTopic = String(courseTopic || '');

    // 0. اكتشاف اللغة المستهدفة من النص الكامل (قبل قص اسم الشهادة!)
    const langProfile = detectTargetLanguageProfile(`${rawTopic} ${sectionName} ${lessonTitle}`, explicitTargetLang);

    // 1. عزل اسم الكراش كورس الحالي عن اسم الشهادة العام (لكي لا تتسرب كلمات C2 أو أسماء الاختبارات من اسم الشهادة!)
    let isolatedCourseTitle = rawTopic;
    const crashCourseIdx = rawTopic.search(/(?:الكراش كورس|كراش كورس|Course)\s*\d+/i);
    if (crashCourseIdx !== -1) {
        isolatedCourseTitle = rawTopic.slice(crashCourseIdx);
    }

    // 2. استخراج رقم الكورس الفعلي بدقة (من 1 إلى 20)
    const courseNumMatch = isolatedCourseTitle.match(/(?:الكراش كورس|كراش كورس|الكورس|كورس|Course|المرحلة)\s*(\d+)/i);
    const courseNum = explicitCourseOrder ? Number(explicitCourseOrder) : (courseNumMatch ? Number(courseNumMatch[1]) : null);

    const cleanLocalCtx = `${isolatedCourseTitle} ${sectionName} ${lessonTitle}`;

// 3. التحديد الحتمي للمستوى حسب الخيار المختار في القائمة المنسدلة ورقم الكورس
    let detectedTier = 'A1';

    if (difficulty === 'lang_exam_prep_cert') {
        detectedTier = 'EXAM_MASTERY';
    } else if (courseNum) {
        if (courseNum === 1) detectedTier = 'A0_PHONICS';
        else if (courseNum === 2) detectedTier = 'A0_SENTENCE';
        else if (courseNum === 3 || courseNum === 4) detectedTier = 'A1';
        else if (courseNum >= 5 && courseNum <= 7) detectedTier = 'A2';
        else if (courseNum >= 8 && courseNum <= 10) detectedTier = 'B1';
        else if (courseNum >= 11 && courseNum <= 13) detectedTier = 'B2';
        else if (difficulty === 'lang_a0_to_c2_cert') {
            // في شهادة A0->C2 الشاملة: الكورسات من 14 فما فوق كلها قمة الطلاقة C1/C2 Native
            detectedTier = 'C1_C2';
        } else {
            // في الشهادة الإمبراطورية المدمجة (18-22 كورس): 14-16 لـ C1/C2، و 17+ لمعسكر الاختبار العالمي
            if (courseNum >= 14 && courseNum <= 16) detectedTier = 'C1_C2';
            else if (courseNum >= 17) detectedTier = 'EXAM_MASTERY';
        }
    } else {
        if (/Pre-A1|A0\.1|Phonics|مخارج الأصوات|الحروف|الأبجدية|CVC/i.test(cleanLocalCtx)) {
            detectedTier = 'A0_PHONICS';
        } else if (/A0\.2|A0\b|الأفعال اليومية البسيطة|الضمائر/i.test(cleanLocalCtx)) {
            detectedTier = 'A0_SENTENCE';
        } else if (/(?<!Pre-)A1\b|A1\.1|A1\.2|الروتين اليومي/i.test(cleanLocalCtx)) {
            detectedTier = 'A1';
        } else if (/A2\b|A2\.1|A2\.2|A2\+|الماضي|المقارنات/i.test(cleanLocalCtx)) {
            detectedTier = 'A2';
        } else if (/B1\b|B1\.1|B1\.2|B1\+/i.test(cleanLocalCtx)) {
            detectedTier = 'B1';
        } else if (/B2\b|B2\.1|B2\.2|B2\+/i.test(cleanLocalCtx)) {
            detectedTier = 'B2';
        } else if (/C1\b|C1\.1|C1\.2|C2\b/i.test(cleanLocalCtx)) {
            detectedTier = 'C1_C2';
        } else if (/IELTS|TOEFL|JLPT|DELF|DALF|TestDaF|DELE|HSK|TOPIK|Mock Exam|تشريح الاختبار/i.test(cleanLocalCtx)) {
            detectedTier = 'EXAM_MASTERY';
        }
    }


// ✨ FIX: Exam Mastery Isolation - عزل كورسات التأسيس والمواقف اليومية (A0-B2) عن مسار الامتحانات الدولية (EXAM_MASTERY)
    const examIsolationInstruction = detectedTier === 'EXAM_MASTERY'
        ? `\n🚨 تعليمة مسار الامتحانات الدولية (EXAM_MASTERY):
        - بما أن تصنيف الكورس هو 'EXAM_MASTERY'، قم بتوليد محتوى يركز حصراً على استراتيجيات الاختبار (${langProfile.examName})، كشف الفخاخ، وتصحيح المقالات (Essays) والقراءة التحليلية.`
        : `\n🚨 تعليمة عزل المستويات القياسية (Exam Mastery Isolation):
        - إذا كان مستوى الطالب (A0 إلى B2)، ركز حصراً على المواقف اليومية، البنية النحوية، والمفردات، ويُمنع منعاً باتاً ذكر امتحانات C2 أو TestDaF أو Goethe أو DELF أو IELTS في العناوين أو الشروحات. أما إذا كان تصنيف الكورس هو 'EXAM_MASTERY'، فقم بتوليد محتوى يركز حصراً على استراتيجيات الاختبار، كشف الفخاخ، وتصحيح المقالات (Essays).`;

    const strictLangLockRule = (langProfile.id !== 'en'
        ? `\n🚨🚨 قانون الهوية اللغوية القاطع (STRICT LANGUAGE LOCK):
        - اللغة المستهدفة في هذا الكورس هي **اللغة ${langProfile.nameAr} (${langProfile.nameEn})** حصراً!
        - 🚫 يُمنع منعاً باتاً وقاطعاً استخدام أي مفردة أو جملة أو قاعدة صوتية باللغة الإنجليزية (إياك أن تكتب كلمات مثل cat, mat, short A, this is a... إلخ)!
        - جميع المفردات، الجمل، الحوارات، نصوص الاستماع، والتمارين يجب أن تكون باللغة **${langProfile.nameAr} (${langProfile.nameEn})** مع شرحها وترجمتها بالعربية!`
        : '') + examIsolationInstruction;

    const specsMap = {
        A0_PHONICS: {
            tierId: 'A0',
            langProfile,
            cefrLabel: `المستوى التأسيسي الأول للصوتيات والحروف في اللغة ${langProfile.nameAr} (Pre-A1 / A0.1 Phonics & First Words)`,
            unitStructureGuide: `
            ${langProfile.a0PhonicsUnits}
            (داخل كل وحدة 6 دروس: 1. اكتشاف الصوت والمفردات الملموسة في اللغة ${langProfile.nameAr} ➔ 2. مختبر مخارج الفم واللسان ➔ 3. تركيب الكلمات بالمكعبات ➔ 4. بناء عبارات وجمل قصيرة من 3-4 كلمات باللغة ${langProfile.nameAr} ➔ 5. مختبر الاستماع والترديد Shadowing ➔ 6. ورشة التهجئة والإملاء الصوتي).`,
            pedagogyRules: `
            ${langProfile.a0PedagogyRules}
            ${strictLangLockRule}
            5. قطعة القراءة: من 4 إلى 5 جمل بسيطة جداً باللغة ${langProfile.nameAr} مبنية 100% من الكلمات الصوتية البسيطة مع ترجمتها العربية.`
        },
        A0_SENTENCE: {
            tierId: 'A0',
            langProfile,
            cefrLabel: `المستوى التأسيسي الثاني للغة ${langProfile.nameAr}: الضمائر، الأفعال اليومية، وتكوين الجملة والسؤال الأول (CEFR A0.2)`,
            unitStructureGuide: `
            - محور القواعد والتراكيب في اللغة ${langProfile.nameAr}: ${langProfile.a0SentenceRules}
            - الدرس 1 (المفردات الأساسية المصورة في اللغة ${langProfile.nameAr}: التحيات، الضمائر، الأفعال اليومية البسيطة، والصفات المباشرة).
            - الدرس 2 (مختبر النطق الصوتي والوصل في اللغة ${langProfile.nameAr}).
            - الدرس 3 (قاعدة التركيب البسيطة بالمكعبات في اللغة ${langProfile.nameAr}: الفاعل + الفعل + المفعول البسيط).
            - الدرس 4 (تطبيق القاعدة في جمل يومية قصيرة من 4 إلى 6 كلمات باللغة ${langProfile.nameAr} في الإثبات والنفي).
            - الدرس 5 (مختبر الاستماع النشط وتكوين السؤال والجواب الأول باللغة ${langProfile.nameAr}).
            - الدرس 6 (ورشة القراءة المبسطة وكتابة 3 إلى 4 جمل قصيرة عن النفس باللغة ${langProfile.nameAr}).`,
            pedagogyRules: `
            🚨🚨 تحذير صارم جداً (أنت في المستوى التأسيسي A0.2 للغة ${langProfile.nameAr} للمبتدئين!):
            ${strictLangLockRule}
            1. 🚫 ممنوع منعاً باتاً استخدام مفردات متقدمة أو أكاديمية! التزم فقط بالكلمات اليومية البسيطة جداً في اللغة ${langProfile.nameAr}.
            2. محور التركيز النحوي: ${langProfile.a0SentenceRules}
            3. طول الجملة باللغة ${langProfile.nameAr} يجب ألا يتجاوز (4 إلى 6 كلمات فقط!).
            4. قطعة القراءة: فقرة بسيطة جداً باللغة ${langProfile.nameAr} من (45 إلى 65 كلمة) بحوار تعارف أو موقف يومي سهل جداً.`
        },
        A1: {
            tierId: 'A1',
            langProfile,
            cefrLabel: `المستوى الابتدائي المتكامل للغة ${langProfile.nameAr} (CEFR A1)`,
            unitStructureGuide: `
            - محور القواعد للغة ${langProfile.nameAr}: ${langProfile.a1Grammar}
            - الدرس 1 (المفردات الحياتية والروتين اليومي والعبارات الوظيفية باللغة ${langProfile.nameAr}).
            - الدرس 2 (مختبر النطق والإيقاع الصوتي في اللغة ${langProfile.nameAr}).
            - الدرس 3 (هندسة القواعد التأسيسية في اللغة ${langProfile.nameAr}: ${langProfile.a1Grammar}).
            - الدرس 4 (تطبيق القواعد في بناء جمل حياتية باللغة ${langProfile.nameAr} من 6 إلى 10 كلمات).
            - الدرس 5 (مختبر الاستماع الحواري وفهم المتحدث باللغة ${langProfile.nameAr} في المواقف اليومية كالمطعم والتسوق).
            - الدرس 6 (ورشة القراءة التطبيقية وكتابة فقرة شخصية قصيرة باللغة ${langProfile.nameAr} من 40-50 كلمة).`,
            pedagogyRules: `
            🚨 قانون التدرج التصاعدي لمستوى (CEFR A1) في اللغة ${langProfile.nameAr}:
            ${strictLangLockRule}
            1. استخدم مفردات الحياة اليومية الواضحة باللغة ${langProfile.nameAr} (العائلة، المنزل، العمل، الطعام، التسوق، الأوقات).
            2. يبني الطالب جملاً حياتية باللغة ${langProfile.nameAr} طولها من (6 إلى 10 كلمات) لتطبيق: ${langProfile.a1Grammar}.
            3. قطعة القراءة: قصة يومية أو رسالة بسيطة باللغة ${langProfile.nameAr} من (80 إلى 110 كلمات) متبوعة بحوار حياتي طبيعي.`
        },
        A2: {
            tierId: 'A2',
            langProfile,
            cefrLabel: `المستوى ما قبل المتوسط للغة ${langProfile.nameAr} (CEFR A2 - Waystage)`,
            unitStructureGuide: `
            - محور القواعد للغة ${langProfile.nameAr}: ${langProfile.a2Grammar}
            - الدرس 1 (الحصيلة اللفظية الموسعة والأفعال الشائعة في اللغة ${langProfile.nameAr}).
            - الدرس 2 (مختبر الصوتيات: وصل الكلمات والتنغيم الصوتي في اللغة ${langProfile.nameAr}).
            - الدرس 3 (هندسة القواعد السردية في اللغة ${langProfile.nameAr}: ${langProfile.a2Grammar}).
            - الدرس 4 (بناء الجمل المركبة والسرد القصصي المترابط باللغة ${langProfile.nameAr} من 10 إلى 14 كلمة).
            - الدرس 5 (مختبر الفهم السمعي لمواقف السفر، الصحة، والعمل باللغة ${langProfile.nameAr}).
            - الدرس 6 (ورشة القراءة التحليلية المبسطة وكتابة رسالة أو قصة مترابطة باللغة ${langProfile.nameAr} من 70-90 كلمة).`,
            pedagogyRules: `
            🚨 قانون التدرج التصاعدي لمستوى (CEFR A2) في اللغة ${langProfile.nameAr}:
            ${strictLangLockRule}
            1. الطالب هنا يسرد تجاربه في الماضي، يخطط للمستقبل، ويقارن بين الأشياء باللغة ${langProfile.nameAr} بجمل طولها (10 إلى 14 كلمة) مطبقاً: ${langProfile.a2Grammar}.
            2. قطعة القراءة: مقال مبسط أو قصة واقعية باللغة ${langProfile.nameAr} من (130 إلى 170 كلمة).`
        },
        B1: {
            tierId: 'B1',
            langProfile,
            cefrLabel: `المستوى المتوسط المستقل للغة ${langProfile.nameAr} (CEFR B1 / B1+ Threshold)`,
            unitStructureGuide: `
            - محور القواعد للغة ${langProfile.nameAr}: ${langProfile.b1Grammar}
            - الدرس 1 (المفردات المفاهيمية والمتلازمات اللفظية في اللغة ${langProfile.nameAr}).
            - الدرس 2 (مختبر الكلام المتصل السريع في اللغة ${langProfile.nameAr}).
            - الدرس 3 (هندسة القواعد المتوسطة في اللغة ${langProfile.nameAr}: ${langProfile.b1Grammar}).
            - الدرس 4 (صياغة الحجج، التعبير عن الآراء، وبناء جمل باللغة ${langProfile.nameAr} من 14 إلى 18 كلمة).
            - الدرس 5 (مختبر الاستماع للمتحدث الأصلي السريع باللغة ${langProfile.nameAr}).
            - الدرس 6 (ورشة القراءة المقالاتية وكتابة فقرة رأي أو بريد رسمي باللغة ${langProfile.nameAr} من 120-150 كلمة).`,
            pedagogyRules: `
            🚨 قانون التدرج التصاعدي لمستوى (CEFR B1 / B1+) في اللغة ${langProfile.nameAr}:
            ${strictLangLockRule}
            1. الطالب في مرحلة الاستقلالية اللغوية؛ الأمثلة باللغة ${langProfile.nameAr} يجب أن تطبق: ${langProfile.b1Grammar}.
            2. قطعة القراءة: مقال تحليلي أو نقاشي باللغة ${langProfile.nameAr} من (190 إلى 240 كلمة).`
        },
        B2: {
            tierId: 'B2',
            langProfile,
            cefrLabel: `المستوى فوق المتوسط والطلاقة المهنية للغة ${langProfile.nameAr} (CEFR B2 / B2+ Vantage)`,
            unitStructureGuide: `
            - محور القواعد للغة ${langProfile.nameAr}: ${langProfile.b2Grammar}
            - الدرس 1 (الثروة اللفظية المتقدمة في اللغة ${langProfile.nameAr} والتمييز بين الرسمي وغير الرسمي).
            - الدرس 2 (مختبر الإيقاع البلاغي وتنغيم الإقناع في اللغة ${langProfile.nameAr}).
            - الدرس 3 (الهندسة النحوية المتقدمة في اللغة ${langProfile.nameAr}: ${langProfile.b2Grammar}).
            - الدرس 4 (التواصل المهني، إدارة المفاوضات، وصياغة الجمل المعقدة باللغة ${langProfile.nameAr} 18-24 كلمة).
            - الدرس 5 (مختبر الاستماع التحليلي للمحاضرات والمناقشات السريعة باللغة ${langProfile.nameAr}).
            - الدرس 6 (هندسة كتابة المقالات الجدلية والتقارير الاحترافية باللغة ${langProfile.nameAr}).`,
            pedagogyRules: `
            🚨 قانون التدرج التصاعدي لمستوى (CEFR B2 / B2+) في اللغة ${langProfile.nameAr}:
            ${strictLangLockRule}
            1. نحن في مستوى الطلاقة المهنية والأكاديمية باللغة ${langProfile.nameAr}؛ طبق بعمق: ${langProfile.b2Grammar}.
            2. قطعة القراءة: نص تحليلي أو دراسة حالة مهنية/أكاديمية باللغة ${langProfile.nameAr} من (250 إلى 300 كلمة).`
        },
        C1_C2: {
            tierId: 'C1_C2',
            langProfile,
            cefrLabel: `مستوى الكفاءة العليا وطلاقة المتحدث الأصلي للغة ${langProfile.nameAr} (CEFR C1 / C2 Mastery)`,
            unitStructureGuide: `
            - محور القواعد والبلاغة للغة ${langProfile.nameAr}: ${langProfile.c1c2Grammar}
            - الدرس 1 (المعجم البلاغي والأكاديمي الرفيع والظلال الدلالية الدقيقة والكنايات في اللغة ${langProfile.nameAr}).
            - الدرس 2 (مختبر البلاغة الصوتية وإيقاع المتحدث الأصلي في المحاضرات باللغة ${langProfile.nameAr}).
            - الدرس 3 (الذروة النحوية في اللغة ${langProfile.nameAr}: ${langProfile.c1c2Grammar}).
            - الدرس 4 (الارتجال الفوري والمحاججة الفلسفية والعلمية باللغة ${langProfile.nameAr}).
            - الدرس 5 (مختبر الاستماع النقدي للنصوص الأدبية والإعلامية والأكاديمية باللغة ${langProfile.nameAr}).
            - الدرس 6 (ورشة التحرير البلاغي والكتابة الأكاديمية بمستوى C2 في اللغة ${langProfile.nameAr}).`,
            pedagogyRules: `
            🚨 قانون الذروة اللغوية الصارم (CEFR C1 / C2 Native Mastery) في اللغة ${langProfile.nameAr}:
            ${strictLangLockRule}
            1. أنت تخاطب طالباً في قمة الهرم اللغوي (C1/C2) في اللغة ${langProfile.nameAr}؛ طبق: ${langProfile.c1c2Grammar}.
            2. قطعة القراءة: مقال فكري/أكاديمي/أدبي رفيع المستوى باللغة ${langProfile.nameAr} (300 إلى 380 كلمة) مع تشريحه البلاغي.`
        },
        EXAM_MASTERY: {
            tierId: 'EXAM_MASTERY',
            langProfile,
            cefrLabel: `معسكر الاختبارات العالمية القياسية للغة ${langProfile.nameAr} (${langProfile.examName} Mastery)`,
            unitStructureGuide: `
            - الدرس 1 (تشريح خوارزمية القسم ومعايير المصحح الرسمي في اختبار ${langProfile.examName}).
            - الدرس 2 (الثروة اللفظية الأكاديمية المتقدمة وإعادة الصياغة في اللغة ${langProfile.nameAr}).
            - الدرس 3 (الهندسة النحوية والتراكيب المعقدة التي ترفع التقييم فوراً في ${langProfile.examName}).
            - الدرس 4 (تكتيكات كشف الفخاخ السمعية والقرائية وإدارة الوقت في ${langProfile.examName}).
            - الدرس 5 (مختبر المحاكاة الصوتية والشفهية تحت ضغط الوقت باللغة ${langProfile.nameAr}).
            - الدرس 6 (ورشة الكتابة الأكاديمية التحليلية وترقية الإجابات لأعلى درجة في ${langProfile.examName}).`,
            pedagogyRules: `
            🚨 قانون التدرج الصارم (معسكر الاختبارات العالمية ${langProfile.examName} للغة ${langProfile.nameAr}):
            ${strictLangLockRule}
            1. ركز 100% على استراتيجيات الحل، معايير التقييم الرسمية لاختبار (${langProfile.examName})، كشف الفخاخ، وإعادة الصياغة الأكاديمية باللغة ${langProfile.nameAr}.`
        }
    };

    return specsMap[detectedTier] || specsMap.A1;
};




// ============================================================================
// 🎯 11. مسار حقن كراش كورس مخصص (يتكيف تلقائياً بين شهادات اللغات وشهادات البرمجة!)
// ============================================================================
app.post('/api/academy2/inject-custom-course', async (req, res) => {
    try {
        const { certificateTitle, mainAnalogy, customTopic, placementMode, currentCourses } = req.body;

        console.log(`\n🎯 [Custom Injector] جاري هندسة ودمج كراش كورس مخصص: "${customTopic}"...`);

        const isLangCert = /لغة|لغات|إنجليزي|انجليزي|ياباني|فرنسي|ألماني|الماني|إسباني|صيني|نطق|صوتيات|حروف|IELTS|TOEFL|JLPT|DELF|Pre-A1|A0|A1|A2|B1|B2|C1|C2/i.test(
            `${certificateTitle} ${customTopic}`
        );

        const systemPrompt = isLangCert
            ? `أنت كبير مؤلفي مناهج اللغات والاختبارات الدولية (Cambridge & IELTS Architect).
            يريد المستخدم إضافة كراش كورس لغوي جديد حول: "${customTopic}"
            داخل الشهادة اللغوية: "${certificateTitle}"
            قائمة الكورسات الحالية بالترتيب:
            ${JSON.stringify(currentCourses)}

            مهمتك:
            1. صياغة "${customTopic}" ككراش كورس لغوي وصوتي متكامل يتدرج بوضوح ويغطي (النطق IPA، الاستماع، المفردات، القواعد، والقراءة والكتابة) بما يتناسب مع مستواه في السلسلة.
            2. تحديد الفهرس الأمثل ("insertIndex" يبدأ من 0) لوضع هذا الكورس في السلسلة بحيث يكون التدرج اللغوي منطقياً من الأسهل للأصعب.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "insertIndex": 4,
              "placementReason": "اخترنا وضعه في هذا الموضع لأن الطالب يكون قد أتقن... ويحتاج الآن إلى...",
              "newCourse": {
                "courseTitle": "عنوان الكراش كورس اللغوي المخصص بوضوح",
                "description": "وصف تفصيلي مبسط لما سيتقنه الطالب سمعياً ونطقياً ونحوياً وكتابياً...",
                "difficultyLevel": "المستوى اللغوي المناسب (مثال: A1 / B1 / C1 / IELTS Prep)...",
                "estimatedHours": "18 ساعة تدريب صوتي ولغوي",
                "certificateBadge": "شهادة إتقان ...",
                "connectionToPrevious": "كيف يبني على الكورس اللغوي الذي يسبقه...",
                "githubProject": {
                  "projectTitle": "التحدي الصوتي والكتابي التطبيقي لهذا الكورس",
                  "projectSummary": "وصف المحادثة الصوتية والمهمة الكتابية التي ينجزها الطالب مع الـ Live Speak Coach"
                },
                "skills": ["Pronunciation & Prosody", "Active Listening", "Syntactic Mastery", "Writing & Fluency"]
              }
            }`
            : `أنت مهندس مناهج تعليمية عبقري وخبير في التبسيط المطلق (ELI5).
            يريد المستخدم إضافة كراش كورس جديد حول موضوع: "${customTopic}"
            داخل الشهادة المهنية: "${certificateTitle}"
            التشبيه القصصي للشهادة: "${mainAnalogy}"
            قائمة الكورسات الحالية بالترتيب (مع الفهرس index):
            ${JSON.stringify(currentCourses)}

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
            {
              "insertIndex": 4,
              "placementReason": "اخترنا وضعه بعد كورس كذا وقبل كورس كذا لأن الطالب يحتاج...",
              "newCourse": {
                "courseTitle": "عنوان الكراش كورس المخصص بأسلوب جذاب",
                "description": "وصف تفصيلي مبسط لما سيتعلمه الطالب في هذا الكراش كورس...",
                "difficultyLevel": "المستوى المناسب...",
                "estimatedHours": "16 ساعة",
                "certificateBadge": "شهادة إتقان ...",
                "connectionToPrevious": "كيف يبني على الكورس الذي سيسبقه مباشرة...",
                "githubProject": {
                  "projectTitle": "اسم المشروع العملي الخاص بهذا الكورس",
                  "projectSummary": "وصف بناء المشروع بمساعدة AI Agent ورفعه على GitHub"
                },
                "skills": ["مهارة 1", "مهارة 2", "مهارة 3", "مهارة 4"]
              }
            }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `صمم الكراش كورس المخصص "${customTopic}" وحدد مكانه الأنسب في السلسلة بصيغة JSON.`,
            0.7,
            10000
        );
        const parsedContent = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في حقن الكورس المخصص:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة الكراش كورس المخصص.' });
    }
});

// ============================================================================
// 🎯 12. مسار توليد ملخصات جميع وحدات الكراش كورس دفعة واحدة (يتكيف تلقائياً للغات وللبرمجة!)
// ============================================================================
app.post('/api/academy2/batch-course-units-summary', async (req, res) => {
    try {
        const { courseTitle, sectionsData } = req.body;

        const isLangCourse = /لغة|لغات|إنجليزي|انجليزي|ياباني|فرنسي|ألماني|الماني|إسباني|صيني|نطق|صوتيات|حروف|IELTS|TOEFL|JLPT|DELF|Pre-A1|A0|A1|A2|B1|B2|C1|C2|Phonics|CVC/i.test(
            `${courseTitle} ${JSON.stringify(sectionsData)}`
        );

        console.log(`\n📦 [Batch Unit Summaries] جاري توليد ملخصات جميع وحدات الكورس (${isLangCourse ? 'لغات 🌍' : 'تقني 💻'}): "${courseTitle}"...`);

        const systemPrompt = isLangCourse
            ? `أنت كبير مؤلفي مناهج اللغات في جامعة كامبريدج وأفضل أستاذ لغات في العالم.
            لدينا كورس اللغة التالي: "${courseTitle}"
            وهذه قائمة بجميع الوحدات الدراسية (Sections) الموجودة فيه مع عناوين الدروس الفعلية داخل كل وحدة:
            ${JSON.stringify(sectionsData)}

            مهمتك:
            كتابة ملخص تشويقي وتطبيقي مخصص لكل وحدة يوضح للطالب كيف ستنقله هذه الوحدة خطوة بخطوة في النطق، الفهم السمعي، القواعد، القراءة، الكتابة، والتحدث بطلاقة.

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
            {
              "unitsSummaries": [
                {
                  "sectionName": "اسم الوحدة كما ورد تماماً",
                  "unitSummary": "ملخص مشوق في سطرين يشرح الفكرة الجوهرية لهذه الوحدة اللغوية وكيف تبني فوق ما سبقها...",
                  "whatYouLearn": "شرح مفصل (2-3 جمل) يوضح بدقة الأصوات، المفردات، القواعد، ومهارات القراءة والاستماع التي سيتقنها الطالب في هذه الوحدة...",
                  "whyItMatters": "شرح قوي يوضح كيف ستفتح له هذه الوحدة القدرة على الفهم السمعي، التحدث بثقة دون تلعثم، واجتياز الاختبارات الدولية...",
                  "keyHighlights": ["مهارة لغوية/صوتية 1", "مهارة لغوية/صوتية 2", "مهارة لغوية/صوتية 3"]
                }
              ]
            }`
            : `أنت عميد أكاديمية هندسة برمجيات ومؤلف مناهج عالمي بأسلوب التبسيط المطلق (ELI5).
            لدينا الكراش كورس التالي: "${courseTitle}"
            وهذه قائمة بجميع الوحدات الدراسية (Sections) الموجودة فيه مع عناوين الدروس الفعلية داخل كل وحدة:
            ${JSON.stringify(sectionsData)}

            رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
            {
              "unitsSummaries": [
                {
                  "sectionName": "اسم الوحدة كما ورد تماماً",
                  "unitSummary": "ملخص مشوق في سطرين يشرح الفكرة الجوهرية لهذه الوحدة بتشبيه قصصي مبسط...",
                  "whatYouLearn": "شرح مفصل (2-3 جمل) يوضح بدقة ماذا سيتعلم الطالب ويطبقه عملياً في دروس هذه الوحدة تحديداً...",
                  "whyItMatters": "شرح قوي يضرب الدوبامين (2-3 جمل) يوضح في ماذا ستفيده هذه الوحدة في بناء المشاريع، العمل الحر، أو اجتياز المقابلات التقنية...",
                  "keyHighlights": ["مهارة عملية 1", "مهارة عملية 2", "مهارة عملية 3"]
                }
              ]
            }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بتوليد ملخصات جميع الوحدات (${sectionsData?.length || 0} وحدات) للكورس "${courseTitle}" بصيغة JSON الآن.`,
            0.7,
            8000
        );

        const parsedContent = safeParseAIJson(rawContent);

        res.json({
            success: true,
            data: parsedContent
        });
    } catch (error) {
        console.error('❌ خطأ في توليد ملخصات الوحدات المجمعة:', error.message);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ أثناء توليد ملخصات الوحدات.'
        });
    }
});

// ============================================================================
// 🏗️ 13. مسارات "الشهادة المهنية لبناء المشاريع الكاملة من الصفر" (بدون اختبارات)
// معزولة بالكامل تحت بادئة: /api/academy2/project-cert/...
// ============================================================================

// أ) مسار إلهام أفكار المشاريع الضخمة
app.post('/api/academy2/project-cert/suggest-idea', async (req, res) => {
    const { projectCategory } = req.body;

    try {
        let categoryInstruction = '';
        if (projectCategory === 'business_saas') {
            categoryInstruction = 'أعطني عنواناً لمشروع "بزنس وتجارة إلكترونية أو SaaS" ضخم وعالي العائد المادي (مثال: شهادة مهنية في بناء منصة تجارة إلكترونية متعددة البائعين Multi-Vendor E-Commerce مع بوابات دفع ولوحة تحكم، أو نظام ERP سحابي للشركات).';
        } else if (projectCategory === 'dopamine_app') {
            categoryInstruction = 'أعطني عنواناً لمشروع "تطبيق يضرب الدوبامين وتريند" (مثال: تطبيق مهام ولياقة بدنية بنظام التلعيب Gamified Solo-Leveling Style، أو منصة أتمتة محتوى فيروسي بالذكاء الاصطناعي، أو لوحة تداول خوارزمي حية).';
        } else if (projectCategory === 'desktop_app') {
            categoryInstruction = 'أعطني عنواناً لمشروع "تطبيق سطح مكتب احترافي Desktop App" (باستخدام Electron وReact وSQLite أو Python، مثل نظام نقاط بيع ومخازن POS متكامل يدعم الطابعات الحرارية والعمل بدون إنترنت، أو استوديو معالجة صوتيات بالذكاء الاصطناعي).';
        } else if (projectCategory === 'ai_model_scratch') {
            categoryInstruction = 'أعطني عنواناً لمشروع "بناء وتدريب نموذج ذكاء اصطناعي أو وكيل مستقل AI Model & Agent من الصفر" (باستخدام Python وPyTorch/TensorFlow أو LLMs & RAG وربطه بواجهة ويب متكاملة).';
        } else {
            categoryInstruction = 'أعطني عنواناً لشهادة مهنية لبناء مشروع برمجي متكامل من الصفر للنهاية (Full-Stack أو AI أو Desktop).';
        }

        const systemPrompt = `أنت كبير مهندسي المنتجات التقنية (Chief Product Architect).
        المطلوب منك إعطاء "عنوان شهادة مهنية لبناء مشروع عملي من الصفر للنهاية" باللغة العربية (مع ذكر التقنيات الأساسية بين قوسين).
        لا تكتب أي مقدمات أو شروحات، فقط العنوان الجذاب الذي يصلح ليكون شهادة بناء مشروع كامل.
        رد بصيغة JSON فقط بهذا الهيكل:
        { "topic": "الشهادة المهنية العملية: بناء [اسم المشروع] من الصفر للإطلاق باستخدام [التقنيات]" }`;

        const currentGroq = getGroqClient();
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: categoryInstruction }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.9,
            response_format: { type: "json_object" }
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const data = safeParseAIJson(rawContent);

        res.json({ success: true, idea: data.topic });
    } catch (error) {
        console.error('❌ خطأ في إلهام المشاريع:', error.message);
        res.status(500).json({ success: false, error: 'فشل في توليد فكرة المشروع.' });
    }
});

// ب) مسار هندسة هيكل الشهادة المهنية للمشروع
app.post('/api/academy2/project-cert/blueprint-series', async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع المشروع.' });

    try {
        console.log(`\n🏗️ [Project Certificate Architect] جاري تفكيك المشروع الضخم إلى سلسلة كراش كورسات بناء من الصفر: ${topic}...`);

        const systemPrompt = `أنت أعظم مهندس معماري للبرمجيات (Principal Systems Architect) وصانع كورسات بناء المشاريع العملاقة (مثل فيديوهات اليوتيوب التي تمتد لـ 20 ساعة لبناء مشروع ضخم من الصفر From Scratch، ولكن بشكل مكتوب ومفصل للغاية).

        المطلوب: تصميم هيكل **"شهادة مهنية لبناء مشروع كامل من الصفر للنهاية (بدون أي اختبارات)"** حول المشروع التالي:
        "${topic}"

        🚨 القواعد الهندسية الصارمة:
        1. قسّم بناء هذا المشروع الضخم من اللحظة الصفرية (تهيئة المجلد الفارغ وتصميم المعمارية) وحتى الإطلاق النهائي إلى **سلسلة من (9 إلى 15 كراش كورس متسلسل)**.
        2. كل "كراش كورس" في هذه السلسلة يمثل **"مرحلة بناء نظام فرعي كامل من المشروع" (Build Phase)**، بحيث ينتهي الطالب من الكورس الأول وقد بنى الأساس، وفي الثاني بنى قاعدة البيانات والمصادقة، وفي الثالث بنى النظام الأساسي... وهكذا حتى يكتمل المشروع العملاق في الكورس الأخير!
        3. وضّح في كل كراش كورس كيف سنستخدم **الـ AI Agent (مثل Cursor / Copilot / Claude)** لتسريع كتابة الكود وما الذي سنبنيه يدوياً.
        4. هذه الشهادة خالية تماماً من الاختبارات؛ التركيز 100% على الكود، الملفات، الربط البرمجي، والأوامر.

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "isCertificateSeries": true,
          "isProjectScratchSeries": true,
          "certificateTitle": "الشهادة المهنية العملية: ${topic}",
          "courseTitle": "الشهادة المهنية العملية: ${topic}",
          "courseDescription": "دليل بناء هندسي شامل يأخذك خطوة بخطوة وملفاً بملف لبناء هذا المشروع الضخم من الصفر المطلق وحتى الإطلاق الإنتاجي بمساعدة وكلاء الذكاء الاصطناعي (AI Agents) وبدون أي حشو نظري أو اختبارات.",
          "mainAnalogy": "خريطة معمارية متكاملة (Architecture Blueprint): نبدأ بحفر الأساسات وتجهيز بيئة المشروع، ثم نشيد الخوادم وقواعد البيانات، ثم نبني الواجهات التفاعلية ونربط الذكاء الاصطناعي وصولاً للإطلاق.",
          "superCertificate": {
            "title": "شهادة كبير مهندسي بناء الأنظمة والمشاريع المتكاملة (From-Scratch Project Architect)",
            "badgeText": "S-Rank Project Builder Certificate",
            "careerOutcomes": ["Full-Stack Project Architect", "AI-Augmented Product Builder", "SaaS & Systems Founder"]
          },
          "courses": [
            {
              "courseOrder": 1,
              "coursePrefix": "المرحلة 1 (كراش كورس 1)",
              "difficultyLevel": "مرحلة التأسيس المعماري وتجهيز المشروع",
              "courseTitle": "كراش كورس 1: هندسة معمارية المشروع، هيكلة المجلدات، وإعداد بيئة العمل والـ AI Agent",
              "description": "وصف دقيق للملفات والمكونات التي سنقوم ببرمجتها وبنائها في هذه المرحلة من المشروع...",
              "courseDescription": "وصف دقيق للملفات والمكونات التي سنقوم ببرمجتها وبنائها في هذه المرحلة من المشروع...",
              "estimatedHours": "12 ساعة بناء عملي",
              "certificateBadge": "شهادة إتمام المرحلة 1 من بناء المشروع",
              "connectionToPrevious": "نقطة الصفر: إنشاء المجلد الفارغ وتثبيت الحزم الأساسية.",
              "cliffhangerToNext": "بعد تجهيز البنية التحتية، سننتقل في الكورس القادم لبناء...",
              "githubProject": {
                "projectTitle": "الجزء الذي سيكتمل في مستودع GitHub بنهاية هذا الكورس",
                "projectSummary": "الملفات والميزات التي ستكون شغالة في مشروعك بعد إنهاء هذه المرحلة"
              },
              "skills": ["System Architecture", "AI Agent Prompting", "Project Setup", "Git Workflow"]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بهندسة خارطة بناء المشروع الكامل "${topic}" عبر 9 إلى 15 كراش كورس متسلسل بصيغة JSON.`,
            0.75,
            25000
        );
        const parsedContent = safeParseAIJson(rawContent);
        parsedContent.isCertificateSeries = true;
        parsedContent.isProjectScratchSeries = true;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في هندسة شهادة المشروع:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء هندسة شهادة المشروع.' });
    }
});

// ج) مسار تفكيك مرحلة البناء (الكراش كورس) إلى وحدات وخطوات تنفيذية عملية
app.post('/api/academy2/project-cert/blueprint-phase-units', async (req, res) => {
    const {
        certificateTitle,
        courseOrder,
        totalCourses,
        currentCourseTitle,
        currentCourseDescription,
        previousCourseTitle,
        nextCourseTitle
    } = req.body;

    if (!currentCourseTitle) {
        return res.status(400).json({ error: 'عنوان مرحلة المشروع مطلوب.' });
    }

    try {
        console.log(`\n🛠️ [Project Phase Units] جاري تفكيك (${currentCourseTitle}) إلى وحدات وخطوات برمجية...`);

        const systemPrompt = `أنت كبير مهندسي البرمجيات تبني مشروعاً حقيقياً أمام الطالب خطوة بخطوة (مثل سلاسل البناء الطويلة على يوتيوب ولكن بشكل مكتوب ومنظم للغاية).
        نحن الآن في: "${currentCourseTitle}" (المرحلة ${courseOrder || 1} من ${totalCourses || 10} ضمن مشروع "${certificateTitle}").
        - تفاصيل هذه المرحلة: "${currentCourseDescription || ''}"
        - ما بنيناه في الكورس السابق: "${previousCourseTitle || 'بداية المشروع من الصفر'}"
        - ما سنبنيه في الكورس القادم: "${nextCourseTitle || 'الإطلاق النهائي'}"

        🚨 القواعد الصارمة:
        1. قسّم هذه المرحلة إلى **(6 إلى 10 وحدات عملية / Sections)**.
        2. داخل كل وحدة، ضع **(5 إلى 8 دروس عملية تطبيقية)** تمثل خطوات بناء حقيقية متسلسلة (إنشاء ملف كذا، كتابة مودل كذا، توجيه الـ AI Agent لبناء مكون كذا، ربط الـ API بالواجهة، اختبار الميزة في التيرمينال/المتصفح).
        3. 🚫 **ممنوع وجود أي اختبارات أو امتحانات!** كل الدروس هي خطوات بناء كودية وعملية (lessonCategory: "project_step").

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "${currentCourseTitle}",
          "subCertificateTitle": "شهادة إنجاز ${currentCourseTitle}",
          "blueprint": [
            {
              "sectionOrder": 1,
              "sectionName": "الوحدة 1: ...",
              "isProjectUnit": true,
              "lessons": [
                {
                  "title": "الخطوة 1: إنشاء وهيكلة ملفات ... وتثبيت المكاتب اللازمة",
                  "description": "ماذا سنبرمج في هذه الخطوة وأي ملفات سنعدلها",
                  "lessonCategory": "project_step"
                }
              ]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `فكك المرحلة "${currentCourseTitle}" إلى 6-10 وحدات بناء عملي متسلسلة بصيغة JSON.`,
            0.75,
            22000
        );
        const parsedContent = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في تفكيك وحدات المشروع:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تفكيك وحدات المشروع.' });
    }
});

// د) مسار تأليف خطوة البناء التفصيلية للمشروع
app.post('/api/academy2/project-cert/forge-build-step', async (req, res) => {
    const { courseTopic, sectionName, lessonTitle } = req.body;
    if (!lessonTitle) return res.status(400).json({ error: 'عنوان خطوة البناء مفقود.' });

    try {
        console.log(`\n🔨 [Project Step Forge] جاري كتابة دليل البناء والأكواد للخطوة: "${lessonTitle}"...`);

        const systemPrompt = `أنت كبير مهندسي البرمجيات (Principal Full-Stack & AI Architect) تسجل دورة بناء مشروع ضخم من الصفر (From Scratch Build-Along) ولكن بصيغة مكتوبة فائقة الدقة والتفصيل.
        هدفك أن يقرأ الطالب هذا الدرس فيعرف **بالضبط** أي ملف يفتح، ماذا يكتب لـ AI Agent، أي كود يضعه بيده هنا وهناك، وكيف يربط الملفات ببعضها حتى يشتغل المشروع أمامه.

        - المشروع والمرحلة الحالية: "${courseTopic}"
        - الوحدة الحالية: "${sectionName}"
        - 📌 الخطوة المطلوب بناؤها الآن: "${lessonTitle}"

        🚨 يجب أن يكون حقل "content" غنياً ومفصلاً جداً (900 إلى 1400 كلمة) ويلتزم حرفياً بهذا الهيكل في Markdown:

        ### 🗺️ 1. موقعنا في خريطة المشروع وشجرة الملفات (File Tree & Context)
        (اشرح للطالب أين نحن الآن في المشروع، وما هي الملفات الجديدة التي سننشئها أو الملفات السابقة التي سنفتحها ونعدل عليها في هذه الخطوة، واعرض شجرة مجلدات مصغرة بعلامات \`\`\`).

        ### 🤖 2. ورشة الـ AI Agent: ماذا تكتب للوكيل الذكي وكيف توجهه؟
        (أعطِ الطالب **الـ Prompt الحرفي الجاهز للنسخ** ليضعه في Cursor أو GitHub Copilot أو Claude Code أو ChatGPT لبناء هذه الجزئية، ثم اشرح له: ماذا سيولّد لك الـ AI؟ وما هي النقاط الحرجة التي يجب أن تراجعها وتعدلها بيدك خلف الـ AI لكي لا يحدث تعارض مع باقي ملفات المشروع؟).

        ### 🛠️ 3. التنفيذ البرمجي خطوة بخطوة (أين تضع الكود هنا وهناك؟)
        (اشرح بالتفصيل الممل: افتح الملف الفلاني، أضف هذا الكود في الأعلى، ثم اذهب للملف الفلاني واستورد هذه الدالة.. أكثر من مقتطفات الكود التوضيحية وأوامر التيرمينال اللازمة).

        ### 🔗 4. الربط المعماري واختبار الميزة حياً (Wiring & Live Verification)
        (كيف تتصل هذه القطعة التي بنيناها بقاعدة البيانات أو الواجهة؟ وكيف يختبر الطالب الآن على جهازه أن هذه الخطوة تعمل بنجاح 100% قبل الانتقال للخطوة التالية؟).

        ### ⚠️ 5. أخطاء شائعة أثناء بناء هذه الخطوة وكيف تصلحها فوراً (Troubleshooting)
        (اذكر أشهر 2-3 أخطاء برمجية قد تظهر للطالب في الكونسول أو التيرمينال أثناء تنفيذ هذه الخطوة وكيف يحلها في ثوانٍ).

        🚨 قواعد الحقول الإضافية في الـ JSON:
        - "codeSnippet": ضع فيه الكود الكامل النهائي الجاهز للنسخ والتشغيل للملف الرئيسي في هذه الخطوة (مع كتابة مسار الملف كتعليق في السطر الأول مثل: // filepath: src/...).
        - "codeExplanation": تشريح دقيق سطراً بسطر وكتلة بكتلة للكود الموجود في codeSnippet ولماذا كتبناه بهذه الطريقة.

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
        {
          "content": "الشرح الهندسي التفصيلي الكامل بصيغة Markdown مع مسافات \\n\\n بين الفقرات...",
          "codeSnippet": "// filepath: ...\n// الكود البرمجي الكامل والجاهز للتشغيل هنا...",
          "codeExplanation": "🔬 تشريح الكود التفصيلي:\n- ..."
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `اكتب دليل البناء العملي الكامل والأكواد للخطوة: "${lessonTitle}" بصيغة JSON.`,
            0.75,
            16000
        );
        const parsedContent = safeParseAIJson(rawContent);

        res.json({
            success: true,
            data: {
                content: parsedContent.content || '',
                codeSnippet: parsedContent.codeSnippet || '',
                codeExplanation: parsedContent.codeExplanation || '',
                codingPractice: null,
                dailyQuest: null
            }
        });
    } catch (error) {
        console.error(`❌ خطأ في تأليف خطوة المشروع (${lessonTitle}):`, error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تأليف خطوة المشروع.' });
    }
});


// ============================================================================
// 🌍 14. مسارات "أكاديمية اللغات والاختبارات العالمية" (بمصفوفة التصعيد السداسية من A0 إلى C2)
// معزولة بالكامل تحت بادئة: /api/academy2/lang-cert/...
// ============================================================================

// أ) مسار إلهام شهادات اللغات حسب اللغة المختارة ونوع المسار
app.post('/api/academy2/lang-cert/suggest-idea', async (req, res) => {
    const { langCategory, targetLanguage = 'الإنجليزية (English)' } = req.body;

    try {
        let categoryInstruction = '';
        if (langCategory === 'a0_to_c2') {
            categoryInstruction = `أعطني عنواناً قوياً ومحبوكاً لشهادة مهنية شاملة لتعلم اللغة (${targetLanguage}) من الصفر المطلق (من أصوات الحروف وأشكالها Pre-A1 / A0 لمن لا يعرف حتى قراءة حرف واحد) بالتدرج التصاعدي المتوازن خطوة بخطوة حتى الوصول إلى طلاقة المتحدث الأصلي (C2 Native) في الاستماع والنطق والقراءة والكتابة والقواعد.`;
        } else if (langCategory === 'exam_prep') {
            categoryInstruction = `أعطني عنواناً لشهادة مهنية تكتيكية ومكثفة لاجتياز الاختبار العالمي الخاص باللغة (${targetLanguage}) بدرجة قياسية (مثل IELTS Academic Band 8.0+ أو TOEFL iBT للإنجليزية، أو JLPT N1/N2 لليابانية، أو DALF C1 للفرنسية، أو TestDaF للألمانية) تغطي أسرار وخوارزميات الأقسام الأربعة (الاستماع، القراءة، الكتابة، والمحادثة).`;
        } else if (langCategory === 'mega_combined') {
            categoryInstruction = `أعطني عنواناً لـ "الشهادة الإمبراطورية المدمجة للغة ${targetLanguage} (20 كراش كورس)" التي تأخذ الطالب من الصفر المطلق وتعلم الحروف والأصوات (Pre-A1/A0) بتدرج منطقي سلس حتى قمة البلاغة والطلاقة (C2 Native) مع المعسكر الكامل لاجتياز الاختبار العالمي للغة بأعلى درجة.`;
        } else if (langCategory === 'tech_business_lang') {
            categoryInstruction = `أعطني عنواناً لشهادة مهنية لتعلم اللغة (${targetLanguage}) من التأسيس وحتى احتراف التواصل المهني، اجتماعات الشركات العالمية، كتابة التقارير، واجتياز مقابلات العمل التقنية (Tech & Business Fluency).`;
        } else {
            categoryInstruction = `أعطني عنواناً لشهادة مهنية شاملة لإتقان اللغة (${targetLanguage}) من الحروف حتى الطلاقة الكاملة.`;
        }

        const systemPrompt = `أنت كبير مؤلفي مناهج Cambridge اللغوية وأفضل مدرس لغات في العالم.
        المطلوب: كتابة "عنوان شهادة مهنية لغوية" واحد فقط باللغة العربية، واضح، جذاب، ويوحي بالتدرج المنطقي المحكم من الصفر حتى الاحتراف.
        رد بصيغة JSON فقط بهذا الهيكل:
        { "topic": "الشهادة المهنية اللغوية: ..." }`;

        const currentGroq = getGroqClient();
        const chatCompletion = await currentGroq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: categoryInstruction }
            ],
            model: 'qwen/qwen3.8-27b',
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const data = safeParseAIJson(rawContent);

        res.json({ success: true, idea: data.topic });
    } catch (error) {
        console.error('❌ خطأ في إلهام اللغات:', error.message);
        res.status(500).json({ success: false, error: 'فشل في توليد فكرة شهادة اللغة.' });
    }
});

// ============================================================================
// 🏗️ (ج) مسار هندسة الشهادة المهنية اللغوية بنظام الأطوار الـ 4 المتتابعة
// ============================================================================
app.post('/api/academy2/lang-cert/blueprint-series', async (req, res) => {
    const { topic, difficulty, targetLanguage = 'الإنجليزية (English)' } = req.body;
    if (!topic) return res.status(400).json({ error: 'الرجاء توفير موضوع الشهادة اللغوية.' });

    try {
 const langProfile = detectTargetLanguageProfile(topic, targetLanguage);
        const isMega = difficulty === 'lang_mega_a0_c2_exam';
        const isExamOnly = difficulty === 'lang_exam_prep_cert';
        const targetCoursesCount = isMega ? '18 إلى 22' : (isExamOnly ? '10 إلى 12' : '14 إلى 16');

        console.log(`\n🌍 [Language Series Architect V7 - ${langProfile.nameAr} - Mode: ${difficulty}] جاري هندسة شهادة محبوكة التدرج (${targetCoursesCount} كراش كورس)...`);

        const progressionArchitecture = isExamOnly
            ? `🎯 **المعمارية التكتيكية لمعسكر الاختبار العالمي (${targetCoursesCount} كراش كورس مخصص لاجتياز ${langProfile.examName}):**
            قسّم الشهادة إلى (${targetCoursesCount} كراش كورس) تغطي بالتتابع الهندسي الدقيق جميع أقسام ومهارات اختبار (${langProfile.examName}) في اللغة ${langProfile.nameAr}:
            - الكورسات 1 ⬅️ 2: تشريح خوارزمية اختبار (${langProfile.examName})، معايير المصححين الرسمية، والثروة اللفظية الأكاديمية عالية التردد.
            - الكورسات 3 ⬅️ 4: الهندسة النحوية والتراكيب المعقدة التي ترفع التقييم فوراً في (${langProfile.examName}).
            - الكورسات 5 ⬅️ 6: تكتيكات الفهم السمعي السريع (Listening Mastery) وكشف الفخاخ السمعية وتغير النغمات/اللهجات.
            - الكورسات 7 ⬅️ 8: استراتيجيات القراءة التحليلية السريعة (Skimming, Scanning & Trap Elimination).
            - الكورسات 9 ⬅️ 10: هندسة الكتابة الأكاديمية والحجاجية الممنهجة (Academic & Essay Writing).
            - الكورسات 11 ⬅️ 12: محاكاة المقابلة الشفهية الرسمية (Speaking Mock Exams) والاختبارات التجريبية الكاملة تحت ضغط الوقت.`
            : isMega
                ? `👑 **المعمارية الإمبراطورية المدمجة (18 إلى 22 كراش كورس متسلسل: من الحروف A0 إلى C2 + المعسكر الكامل لاختبار ${langProfile.examName}):**
                يجب أن تبني سلسلة ضخمة ومترابطة من (18 إلى 22 كراش كورس) مقسمة إلى 5 أطوار متتابعة بدون أي فجوة:
                - **🟢 الطور 1 (الكورسات 1 ⬅️ 2 | Pre-A1 / A0):** كورس 1 للحروف والأصوات ونظام الكتابة (${langProfile.a0PhonicsUnits.replace(/\s+/g, ' ').slice(0, 150)}...) + كورس 2 لبناء الجملة التأسيسية الأولى بالمكعبات (${langProfile.a0SentenceRules}).
                - **🔵 الطور 2 (الكورسات 3 ⬅️ 6 | CEFR A1 ➔ A2):** كورس 3 و 4 للمستوى A1 (${langProfile.a1Grammar}) ومواقف الحياة اليومية + كورس 5 و 6 للمستوى A2 (${langProfile.a2Grammar}) والسرد والماضي والمستقبل والسفر.
                - **🟣 الطور 3 (الكورسات 7 ⬅️ 12 | CEFR B1 ➔ B2):** الكورسات 7-9 للمستوى B1 (${langProfile.b1Grammar}) والكلام المتصل السريع + الكورسات 10-12 للمستوى B2 (${langProfile.b2Grammar}) والطلاقة المهنية والمناقشة.
                - **🟡 الطور 4 (الكورسات 13 ⬅️ 16 | CEFR C1 ➔ C2 Native):** البلاغة العليا، التعابير الاصطلاحية الدقيقة، والكتابة والارتجال بمستوى المتحدث الأصلي (${langProfile.c1c2Grammar}).
                - **🏆 الطور 5 (الكورسات 17 ⬅️ 20+ | معسكر اجتياز الاختبار العالمي ${langProfile.examName}):** 4 إلى 6 كورسات ختامية مخصصة بالكامل لتكتيكات الاستماع، القراءة السريعة، الكتابة الأكاديمية، والمحادثة الرسمية لاكتساح اختبار (${langProfile.examName}) بأعلى درجة!`
                : `🌍 **المعمارية الشاملة لإتقان اللغة من الصفر للطلاقة (14 إلى 16 كراش كورس من Pre-A1/A0 إلى C2 Native):**
                قسّم الشهادة إلى (14 إلى 16 كراش كورس) عبر 4 أطوار متتابعة تركز 100% على الطلاقة الشاملة (صوتيات، استماع، تحدث، قواعد، قراءة وكتابة):
                - **🟢 الطور 1 (الكورسات 1 ⬅️ 2 | Pre-A1 / A0):** كورس 1 للحروف والأصوات ونظام الكتابة + كورس 2 لبناء الجملة الأولى بالمكعبات (${langProfile.a0SentenceRules}).
                - **🔵 الطور 2 (الكورسات 3 ⬅️ 6 | CEFR A1 ➔ A2):** كورس 3 و 4 للمستوى A1 (${langProfile.a1Grammar}) + كورس 5 و 6 للمستوى A2 (${langProfile.a2Grammar}).
                - **🟣 الطور 3 (الكورسات 7 ⬅️ 12 | CEFR B1 ➔ B2):** الكورسات 7-9 للمستوى B1 (${langProfile.b1Grammar}) والكلام المتصل + الكورسات 10-12 للمستوى B2 (${langProfile.b2Grammar}) والتواصل المهني.
                - **👑 الطور 4 (الكورسات 13 ⬅️ 16 | CEFR C1 ➔ C2 Native):** إتقان البلاغة العليا، الظلال الدلالية، والكتابة والتحدث بطلاقة المتحدث الأصلي (${langProfile.c1c2Grammar}).`;


        const systemPrompt = `${langProfile.instituteRole}
        أنت تصمم الآن أقوى **"شهادة مهنية عالمية لإتقان اللغة ${langProfile.nameAr} (${langProfile.nameEn})"** بنظام القراءة التفاعلية، المخططات البصرية، والصوتيات الناطقة (تتفوق على كورسات Udemy و Cambridge).
        الموضوع المطلوب: "${topic}".

        ${langProfile.specialMorphologyRule}
        ${progressionArchitecture}

        🚨 شروط صارمة لكل كراش كورس في المصفوفة "courses":
        1. يجب أن يوضح حقل "description" بدقة: (ماذا سيتقن الطالب في الصوتيات/الكتابة + ماذا سيتقن في القواعد بالمكعبات + ما هي المواقف الحياتية التي سيتحدث فيها).
        2. يجب أن يوضح حقل "connectionToPrevious" كيف يبني هذا الكورس مباشرة فوق الكورس الذي قبله بدون تكرار.

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "isCertificateSeries": true,
          "isLanguageSeries": true,
          "targetLanguage": "${langProfile.nameAr} (${langProfile.nameEn})",
          "speechLang": "${langProfile.speechLang}",
          "certificateTitle": "الاسم الرسمي الفخم للشهادة اللغوية في اللغة ${langProfile.nameAr}",
          "courseTitle": "الاسم الرسمي الفخم للشهادة اللغوية في اللغة ${langProfile.nameAr}",
          "courseDescription": "وصف شامل يشرح كيف تأخذ هذه الشهادة الطالب في اللغة ${langProfile.nameAr} عبر الأطوار الأربعة من الصفر المطلق حتى قمة الطلاقة واجتياز ${langProfile.examName}...",
          "mainAnalogy": "فلسفة الشهادة: نظام الشرائح البصرية التفاعلية + مكعبات الجمل (Lego Syntax) + الأشعة الصوتية (X-Ray Phonics) + المحادثة الحية (Speak Class).",
          "superCertificate": {
            "title": "الشهادة المهنية الدولية المعتمدة في اللغة ${langProfile.nameAr} (${langProfile.examName} & C2 Mastery)",
            "badgeText": "S-Rank Global Language Master",
            "careerOutcomes": ["الطلاقة الشفهية والكتابية C2", "اجتياز اختبار ${langProfile.examName} بدرجة قياسية", "التواصل المهني والأكاديمي الدولي"]
          },
          "courses": [
            {
              "courseOrder": 1,
              "coursePrefix": "الكراش كورس 1",
              "difficultyLevel": "الطور 1: التأسيس الصوتي والكتابي (Pre-A1 / A0.1)",
              "courseTitle": "كراش كورس 1: ...",
              "description": "وصف تفصيلي يحدد الأصوات/الحروف، القواعد التأسيسية، والمفردات الحياتية المشمولة...",
              "courseDescription": "وصف تفصيلي يحدد الأصوات/الحروف، القواعد التأسيسية، والمفردات الحياتية المشمولة...",
              "estimatedHours": "18 ساعة تدريب تفاعلي وصوتي",
              "certificateBadge": "شهادة إتقان ...",
              "connectionToPrevious": "نقطة الانطلاق من الصفر المطلق...",
              "cliffhangerToNext": "كيف يمهد للكورس 2...",
              "githubProject": {
                "projectTitle": "التحدي الصوتي والكتابي الشامل لنهاية الكورس 1",
                "projectSummary": "إتمام محادثة حية في غرفة Speak Class ومهمة كتابية شاملة مع المصحح الذكي"
              },
              "skills": ["IPA & Script Mastery", "Lego Grammar", "Active Shadowing", "Real-Life Dialogues"]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بهندسة الشهادة اللغوية الكاملة للغة ${langProfile.nameAr} ("${topic}") عبر الأطوار الأربعة المتتابعة (${targetCoursesCount} كراش كورس) بصيغة JSON.`,
            0.72,
            25000
        );
        const parsedContent = sanitizeLanguageLessonJSON(safeParseAIJson(rawContent));
        parsedContent.isCertificateSeries = true;
        parsedContent.isLanguageSeries = true;
        parsedContent.targetLanguage = `${langProfile.nameAr} (${langProfile.nameEn})`;
        parsedContent.speechLang = langProfile.speechLang;

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في هندسة شهادة اللغات:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء هندسة شهادة اللغات.' });
    }
});





// ============================================================================
// 🧩 (د) مسار تفكيك الكراش كورس إلى وحدات بنظام "المحطات الـ 6 التخصصية الثابتة"
// يطابق 100% شارات CourseDetails.jsx ويمنع التشابه داخل الوحدة!
// ============================================================================
app.post('/api/academy2/lang-cert/blueprint-course-units', async (req, res) => {
    const {
        certificateTitle,
        targetLanguage = '',
        courseOrder,
        totalCourses,
        currentCourseTitle,
        currentCourseDescription,
        previousCourseTitle,
        nextCourseTitle
    } = req.body;

    if (!currentCourseTitle) {
        return res.status(400).json({ error: 'عنوان كورس اللغة مطلوب.' });
    }

    try {
        const fullLangContext = `${certificateTitle || ''} ${currentCourseTitle || ''} ${currentCourseDescription || ''}`;
        const tierSpec = getCEFRProgressionSpec(fullLangContext, '', '', '', courseOrder, targetLanguage);
        const { langProfile } = tierSpec;

        console.log(`\n🗣️ [Language Unit Architect V7 - ${langProfile.nameAr} - ${tierSpec.tierId}] تفكيك (${currentCourseTitle}) بنظام المحطات الـ 6...`);

        const systemPrompt = `${langProfile.instituteRole}
        نحن الآن نفكك الكراش كورس التالي لتعليم **اللغة ${langProfile.nameAr} (${langProfile.nameEn})**:
        - عنوان الكورس: "${currentCourseTitle}" (الكورس رقم ${courseOrder || 1} من أصل ${totalCourses || 16} ضمن "${certificateTitle}").
        - المستوى اللغوي المعتمد: **${tierSpec.cefrLabel}**
        - وصف الكورس: "${currentCourseDescription || ''}"
        - الكورس السابق: "${previousCourseTitle || 'بداية المسار من الصفر'}"
        - الكورس القادم: "${nextCourseTitle || 'المستوى التالي'}"

        ${langProfile.specialMorphologyRule}

        🚨 **الهندسة الصارمة للوحدات والمحطات الـ 6 داخل كل وحدة (CRITICAL SYMMETRY RULE):**
        1. قسّم هذا الكورس إلى **(7 وحدات متدرجة منطقياً من الأسهل للأصعب / Sections)** تغطي:
           ${tierSpec.unitStructureGuide}
        2. كل وحدة من الوحدات الـ 6 الأولى يجب أن تمتلك **"موضوعاً حياتياً + محوراً صوتياً/نحوياً محدداً"**، ويجب أن تتكون بداخلها من **6 دروس بالترتيب التخصصي الثابت التالي** (مع تخصيص 6 مفردات مختلفة لكل درس في حقل الوصف حتى لا تتكرر المفردات بين دروس نفس الوحدة!):
           - **الدرس 1: [المفردات والقوالب - Word Power]** (عنوان يبدأ بـ: \`الدرس 1: المفردات والقوالب — ...\`) يقدم الكلمات والقوالب الذهبية للموضوع.
           - **الدرس 2: [المحادثة الواقعية - Conversation]** (عنوان يبدأ بـ: \`الدرس 2: المحادثة الواقعية — ...\`) يضع مفردات الوحدة في سيناريو حواري حي.
           - **الدرس 3: [هندسة الجملة بالمكعبات - Lego Grammar]** (عنوان يبدأ بـ: \`الدرس 3: هندسة الجملة بالمكعبات — ...\`) يشرح القاعدة النحوية/التركيبية للوحدة عبر مخطط بصري ومعادلات ليغو.
           - **الدرس 4: [معمل الصوتيات والنطق - Pronunciation & IPA]** (عنوان يبدأ بـ: \`الدرس 4: معمل الصوتيات والنطق — ...\`) يركز على مخارج الصوت، الثنائيات الصوتية المتضادة (Minimal Pairs)، أو نظام الكتابة/النغمات.
           - **الدرس 5: [مختبر الاستماع والترديد - Shadowing]** (عنوان يبدأ بـ: \`الدرس 5: مختبر الاستماع والترديد — ...\`) يركز على الوصل الصوتي وإيقاع الجملة الطبيعي.
           - **الدرس 6: [ورشة القراءة والكتابة - Reading & Writing]** (عنوان يبدأ بـ: \`الدرس 6: ورشة القراءة والكتابة — ...\`) يضم قصة تطبيقية وعيادة كشف الأخطاء الشائعة في الوحدة.
        3. اجعل **الوحدة 7 والأخيرة** مخصصة لـ **"المراجعة الشاملة وتحدي التحدث والكتابة التراكمي للكورس"** (\`isProjectUnit: true\`).

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "courseTitle": "${currentCourseTitle}",
          "subCertificateTitle": "شهادة إتقان ${currentCourseTitle}",
          "blueprint": [
            {
              "sectionOrder": 1,
              "sectionName": "الوحدة 1: [عنوان الموقف الحياتي والهدف النحوي/الصوتي في اللغة ${langProfile.nameAr}]",
              "isProjectUnit": false,
              "sectionExamSummary": "اختبار الوحدة 1 اللغوي الشامل",
              "lessons": [
                {
                  "title": "الدرس 1: المفردات والقوالب — [موضوع الدرس]",
                  "description": "بناء الحصيلة اللفظية للموقف مع تطبيقها على مفردات حصرية مثل: (كلمة1، كلمة2، كلمة3، كلمة4، كلمة5)",
                  "lessonCategory": "language_mastery"
                },
                {
                  "title": "الدرس 2: المحادثة الواقعية — [موضوع الحوار]",
                  "description": "حوار تطبيقي حي يوظف عبارات جديدة مثل: (عبارة1، عبارة2، عبارة3، عبارة4)",
                  "lessonCategory": "language_mastery"
                },
                {
                  "title": "الدرس 3: هندسة الجملة بالمكعبات — [اسم القاعدة البصرية]",
                  "description": "مخطط بصري ومعادلات ليغو لتطبيق القاعدة على أمثلة جديدة مثل: (مثال1، مثال2، مثال3)",
                  "lessonCategory": "language_mastery"
                },
                {
                  "title": "الدرس 4: معمل الصوتيات والنطق — [اسم الصوت/النغمة/المقطع]",
                  "description": "تشريح الفم والثنائيات الصوتية المتضادة (Minimal Pairs) على كلمات جديدة مثل: (كلمة1 vs كلمة2، كلمة3 vs كلمة4)",
                  "lessonCategory": "language_mastery"
                },
                {
                  "title": "الدرس 5: مختبر الاستماع والترديد — [الربط والإيقاع الصوتي]",
                  "description": "تدريب الأذن واللسان على دمج الكلمات والتنغيم في جمل متدفقة جديدة",
                  "lessonCategory": "language_mastery"
                },
                {
                  "title": "الدرس 6: ورشة القراءة والكتابة — [التطبيق القصصي وعيادة الأخطاء]",
                  "description": "قصة قرائية متدرجة، كشف الفخاخ الإملائية والنحوية، وتمرين كتابة موجه",
                  "lessonCategory": "language_mastery"
                }
              ]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `فكك كورس اللغة ${langProfile.nameAr} "${currentCourseTitle}" (مستوى ${tierSpec.cefrLabel}) إلى وحدات تضم كل منها المحطات الـ 6 التخصصية بالترتيب بصيغة JSON.`,
            0.7,
            24000
        );
        const parsedContent = sanitizeLanguageLessonJSON(safeParseAIJson(rawContent));

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error('❌ خطأ في تفكيك وحدات اللغة:', error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تفكيك وحدات اللغة.' });
    }
});





// ============================================================================
// 🎞️ (هـ) محرك تأليف الدرس اللغوي بنظام "الشرائح التخصصية البديلة للفيديو" (V7 Slide-Deck Engine)
// يغير تصميم الشرائح حسب نوع المحطة (1..6) ويضيف المخططات البصرية وثنائيات النطق!
// ============================================================================
app.post('/api/academy2/lang-cert/forge-language-lesson', async (req, res) => {
    const {
        courseTopic,
        sectionName,
        lessonTitle,
        lessonDescription = '',
        difficulty,
        courseOrder,
        lessonOrderInUnit = 1,
        totalLessonsInUnit = 6,
        allUnitLessonTitles = [],
        targetLanguage = '',
        unitLearnedVocab = [],
        previouslyLearnedVocab = []
    } = req.body;

    if (!lessonTitle) return res.status(400).json({ error: 'عنوان درس اللغة مفقود.' });

    try {
        const tierSpec = getCEFRProgressionSpec(courseTopic, sectionName, lessonTitle, difficulty, courseOrder, targetLanguage);
        const { langProfile } = tierSpec;

        // كشف تخصص الدرس (من 1 إلى 6) من عنوانه أو ترتيبه
        let stationType = ((Number(lessonOrderInUnit) - 1) % 6) + 1;
        if (/المفردات والقوالب|word power/i.test(lessonTitle)) stationType = 1;
        else if (/المحادثة الواقعية|conversation/i.test(lessonTitle)) stationType = 2;
        else if (/هندسة الجملة بالمكعبات|lego|قواعد/i.test(lessonTitle)) stationType = 3;
        else if (/معمل الصوتيات|pronunciation|نطق/i.test(lessonTitle)) stationType = 4;
        else if (/الاستماع والترديد|shadowing/i.test(lessonTitle)) stationType = 5;
        else if (/القراءة والكتابة|reading|writing|عيادة/i.test(lessonTitle)) stationType = 6;

        console.log(`\n🎞️ [Slide-Deck Forge V7 - ${langProfile.nameAr} - Tier: ${tierSpec.tierId} - Station #${stationType}] تأليف: "${lessonTitle}"...`);

        // 🎨 تخصيص الشريحة رقم 1 والشريحة رقم 4 حسب نوع المحطة لكي لا تتشابه الدروس الـ 6 أبداً!
        const stationSlideBlueprints = {
            1: {
                badgeName: '💎 المحطة 1: بنك المفردات والقوالب الذهبية (Word Power & Chunks)',
                slide1Title: '### 🎯 الشريحة 1: الخريطة التصويرية للمفردات وعائلات الكلمات (Visual Word Map)',
                slide1Guide: `- افتتح الشريحة بشرح مشوق يربط مفردات هذا الدرس ("${lessonTitle}") بموقف بصري في ذهن الطالب.\n- اعرض **مخططاً شجرياً أو تصنيفياً (Word Family / Collocation Map)** يقسم مفردات الدرس إلى 3 مجموعات منطقية واضحة.\n- أضف معادلتي ليغو (\`[المكعب 1] + [المكعب 2] = [النتيجة]\`) توضحان كيف نركب القالب اللفظي فوراً.`,
                slide5Title: '### 💬 الشريحة 5: توظيف المفردات في مواقف مصغرة وقوالب جاهزة (Mini-Scenes & Power Chunks)',
                slide5Guide: `- اعرض 3 مواقف يومية قصيرة جداً (كل موقف سطرين) يرى فيها الطالب كيف تُستخدم مفردات الجدول في الحياة الحقيقية.\n- اختم الشريحة بـ **3 قوالب ذهبية جاهزة للحفظ الفوري (Ready-to-Use Chunks)**.`
            },
            2: {
                badgeName: '💬 المحطة 2: استوديو المحادثة الواقعية (Cambridge Live Conversation)',
                slide1Title: '### 🎬 الشريحة 1: مسرح المشهد، الشخصيات، ومفتاح الدخول في الحوار (Scene Setup & Openers)',
                slide1Guide: `- صوّر للطالب مكان المحادثة وشخصياتها وهدفها كأنه يشاهد مشهداً سينمائياً.\n- اعرض **خريطة تدفق الحوار (Conversation Flow Diagram)**: \`[1. عبارة الافتتاح 🗣️] ➔ [2. السؤال/الطلب ❓] ➔ [3. الرد الطبيعي والتفاعل ✅]\`.\n- ضع معادلتي ليغو لبناء جملة الطلب والرد في هذا الموقف.`,
                slide5Title: '### 🎭 الشريحة 5: الحوار الواقعي الكامل وتشريح الردود نبرةً بنبرة (Full Dialogue & Breakdown)',
                slide5Guide: `- اكتب **حواراً واقعياً حياً وممتعاً (6 إلى 8 أسطر)** بين شخصيتين في اللغة ${langProfile.nameAr}؛ كل سطر يبدأ باسم المتحدث متبوعاً بالجملة الأجنبية كاملة داخل علامة كود واحدة \`...\` ثم \`(الترجمة: ...)\`.\n- تحت الحوار، قم بـ **تشريح 3 عبارات مفتاحية وردت في الحوار** ولماذا استخدم المتحدث الأصلي هذه الصياغة تحديداً.`
            },
            3: {
                badgeName: '🧱 المحطة 3: هندسة القواعد البصرية ومكعبات الليغو (Visual Grammar & Timeline)',
                slide1Title: '### 📊 الشريحة 1: المخطط الزمني البصري وهندسة القاعدة بالمكعبات (Visual Grammar Timeline)',
                slide1Guide: `- اشرح قاعدة ("${lessonTitle}") كما يفعل أعظم أساتذة القواعد البصرية (مثل The English Master Course):\n- ارسم داخل الشريحة **مخططاً بصرياً أو خطاً زمنياً واضحاً (Visual Timeline / Matrix)** يوضح متى وكيف نستخدم هذه القاعدة:\n  مثال: \`[⏪ الماضي] ──────── [📍 اللحظة الحالية] ──────── [⏩ المستقبل]\` أو جدول مقارنة بصري سريع بين حالتين (الإثبات ➕ / النفي ➖ / السؤال ❓).\n- ضع **3 معادلات ليغو متدرجة** بصيغة الأقواس المربعة \`[المكعب 1: ...] + [المكعب 2: ...] = [الجملة باللغة ${langProfile.nameAr}]\`.`,
                slide5Title: '### 🔄 الشريحة 5: مختبر تحويل الجمل في السياق (إثبات ⬅️ نفي ⬅️ سؤال)',
                slide5Guide: `- خذ 3 جمل تطبيقية وأرِ الطالب بصرياً كيف تتغير نفس الجملة عند تحويلها من **(➕ الإثبات)** إلى **(➖ النفي)** وإلى **(❓ السؤال)**.\n- أضف حواراً تطبيقياً قصيراً (4 أسطر) يوظف هذه القاعدة النحوية بشكل طبيعي.`
            },
            4: {
                badgeName: '🔊 المحطة 4: معمل الصوتيات، تشريح الفم، والثنائيات المتضادة (Phonics & Minimal Pairs Lab)',
                slide1Title: '### 👄 الشريحة 1: تشريح الفم واللسان ومقارنة الثنائيات الصوتية (Mouth Map & Minimal Pairs Duel)',
                slide1Guide: `- اشرح بالتفصيل البصري الممل كيف ينطق الطالب الصوت أو النغمة أو الحرف المستهدف في ("${lessonTitle}"): موقع اللسان، شكل الشفاه (⭕ مضمومة / ↔️ مبتسمة / 😮 مفتوحة)، وتدفق الهواء (فموي أو أنفي 👃).\n- اعرض **جدول تحدي الثنائيات الصوتية المتضادة (Minimal Pairs Sound Duel)** يقارن بين 4 أزواج من الكلمات التي يخلط بينها المتعلمون وتغير المعنى تماماً عند تغير الصوت/النغمة!\n- ضع معادلتي ليغو صوتيتين توضحان دمج المقاطع.`,
                slide5Title: '### 🔬 الشريحة 5: رادار الأشعة الصوتية (X-Ray Phonics) في الجمل المتصلة',
                slide5Guide: `- اعرض 4 جمل قصيرة مع تفكيكها تحت **مجهر الأشعة الصوتية**: أين الحروف الصامتة 🔇؟ أين الوصل الصوتي \`‿\` أو تغير النغمة؟ وأين يقع التشديد الصوتي (Stress)؟\n- أضف حواراً صوتياً قصيراً من 4 أسطر لتطبيق النطق السليم.`
            },
            5: {
                badgeName: '🎧 المحطة 5: مختبر الاستماع، الكلام المتصل، والترديد الظلي (Connected Speech & Shadowing)',
                slide1Title: '### 🌊 الشريحة 1: أسرار موسيقى الجملة والدمج الصوتي السريع (Connected Speech & Rhythm)',
                slide1Guide: `- اشرح للطالب لماذا يبدو المتحدث الأصلي سريعاً في اللغة ${langProfile.nameAr} وكيف تندمج الكلمات معاً في ("${lessonTitle}").\n- اعرض **3 قواعد بصرية للدمج والتنغيم الصوتي** بصيغة معادلات الليغو: \`[ما يُكتب على الورق] + [السرعة الطبيعية] = [كيف تسمعها أذنك فعلياً 🔊]\` مع الأسهم النغمية (↗ صاعد للسؤال / ↘ هابط للتأكيد).`,
                slide5Title: '### 🎙️ الشريحة 5: نص الترديد الظلي المقسم زمنياً (Paced Shadowing Script)',
                slide5Guide: `- قدم **فقرة استماع وحوار متدفق (6 أسطر)** مقسمة بعلامات الوقف القصيرة \`/\` وعلامات الوصل \`‿\` لكي يقرأها الطالب ويرددها خلف القارئ الصوتي بنفس الإيقاع والنغمة!`
            },
            6: {
                badgeName: '✍️ المحطة 6: ورشة القراءة القصصية، الكتابة، وعيادة الأخطاء (Reading, Writing & Error Clinic)',
                slide1Title: '### 📖 الشريحة 1: القصة التطبيقية المتدرجة وتشريح تراكيبها (Graded Story & Text Anatomy)',
                slide1Guide: `- ابدأ بـ **قصة قرائية تطبيقية مشوقة (Graded Reading Story)** باللغة ${langProfile.nameAr} داخل \`...\` متبوعة بترجمتها العربية بين قوسين \`(الترجمة: ...)\` تجمع مفردات وقواعد الوحدة.\n- استخرج من القصة **معادلتي ليغو** لأهم تركيبين كتابيين وردا فيها.`,
                slide5Title: '### ✍️ الشريحة 5: قالب الكتابة الذهبي خطوة بخطوة (Guided Writing Blueprint)',
                slide5Guide: `- أعطِ الطالب **مخططاً كتابياً جاهزاً من 4 خطوات (Writing Template)** يعلمه كيف يكتب فقرة أو رسالة أو حواراً كاملاً بنفسه حول موضوع الوحدة بدون أخطاء إملائية أو نحوية.`
            }
        };

        const activeStation = stationSlideBlueprints[stationType] || stationSlideBlueprints[1];

        // منع تكرار مفردات الدروس السابقة في نفس الوحدة
        const antiCloneVocabRule = Array.isArray(unitLearnedVocab) && unitLearnedVocab.length > 0
            ? `\n🚫 **قانون منع تكرار المفردات داخل نفس الوحدة (ANTI-CLONE RULE):**
            تم تدريس هذه الكلمات في المحطات السابقة من هذه الوحدة: (${unitLearnedVocab.join('، ')}).
            - **لا تكرر نفس هذه الكلمات كعناصر أساسية في جدول الشريحة 2!** اختر **8 مفردات / عبارات جديدة** تخدم ("${lessonTitle}" - ${lessonDescription}).`
            : '';

        const spacedRepetitionRule = Array.isArray(previouslyLearnedVocab) && previouslyLearnedVocab.length > 0
            ? `\n🔄 **قانون التكرار المتباعد:** وظّف 2 من مفردات الوحدات السابقة (${previouslyLearnedVocab.slice(0, 12).join('، ')}) داخل أمثلة الشريحة 4 أو 5.`
            : '';

        const systemPrompt = `${langProfile.instituteRole}
        - اللغة المستهدفة: **اللغة ${langProfile.nameAr} (${langProfile.nameEn})**
        - الكورس الحالي: "${courseTopic}" (${tierSpec.cefrLabel})
        - الوحدة الحالية: "${sectionName}"
        - تخصص هذه المحطة: **${activeStation.badgeName}**
        - 📌 الدرس المطلوب تأليفه الآن (رقم ${lessonOrderInUnit} من ${totalLessonsInUnit}): "${lessonTitle}" (${lessonDescription})

        ${langProfile.specialMorphologyRule}
        ${tierSpec.pedagogyRules}
        ${antiCloneVocabRule}
        ${spacedRepetitionRule}

        🚨 **قوانين تصميم الشرائح التفاعلية (CRITICAL SLIDE-DECK & BIDI RULES):**
        1. **منع تقطيع الجملة الأجنبية:** ضع أي جملة أو عبارة باللغة ${langProfile.nameAr} كاملة داخل علامة كود مفردة واحدة هكذا: \`الجملة كاملة هنا\` ثم ضع الترجمة العربية بعدها بين قوسين هكذا: \`(الترجمة: ...)\`. إياك أن تقطع كلمات الجملة الواحدة في عدة علامات كود متجاورة!
        2. **الكثافة البصرية المثالية للشريحة:** اكتب كل شريحة بأسلوب "سبورة تفاعلية منظمة" (نقاط مرقمة، جداول، أسهم زمنية، رموز إيموجي توضيحية) وتجنب الفقرات النصية الطويلة المملة.

        🚨 يجب أن يتكون حقل "content" من **6 شرائح تفاعلية متتابعة (كل شريحة تبدأ بـ \`###\`)**:

        ${activeStation.slide1Title}
        ${activeStation.slide1Guide}

        ### 🗣️ الشريحة 2: جدول المفردات الحصرية، الصوتيات (IPA)، وتشريح النطق
        - ضع **جدول Markdown إلزامياً** يضم **(8 مفردات / عبارات جديدة باللغة ${langProfile.nameAr} خاصة بهذا الدرس)** بالأعمدة الخمسة المخصصة للغة ${langProfile.nameAr}:
          \`${langProfile.vocabTableColumns}\`
        - أضف تحت الجدول 3 ملاحظات سريعة تبرز أهم سر صوتي أو كتابي في هذه الكلمات.

        ### 🧩 الشريحة 3: محطة التفاعل السريع بمنتصف الدرس (Mid-Lesson Interactive Check)
        - اكتب **4 تمارين "املأ الفراغ" تفاعلية** تختبر ما ورد في الشريحة 1 و 2 بصيغة القوسين المزدوجين الإلزامية (بحيث تكون الإجابة الصحيحة هي الخيار الأول دائماً داخل \`[[...]]\`):
          * \`- الجملة 1 باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة: ...).\`
          * \`- الجملة 2 باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة: ...).\`
          * \`- الجملة 3 باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة: ...).\`
          * \`- الجملة 4 باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة: ...).\`

        ### 🪜 الشريحة 4: سُلّم البناء والارتقاء التراكمي الناطق (5-Step Sentence Escalation Ladder)
        - أرِ الطالب كيف نصعد بالجملة في **اللغة ${langProfile.nameAr}** عبر **5 درجات متسلسلة** من كلمة واحدة حتى جملة متكاملة (مع وضع النص الأجنبي داخل \`...\` والترجمة بين قوسين):
          1. **الدرجة 1:** \`...\` (الترجمة: ...)
          2. **الدرجة 2:** \`...\` (الترجمة: ...)
          3. **الدرجة 3:** \`...\` (الترجمة: ...)
          4. **الدرجة 4:** \`...\` (الترجمة: ...)
          5. **الدرجة 5:** \`...\` (الترجمة: ...)

        ${activeStation.slide5Title}
        ${activeStation.slide5Guide}

        ### 🩺 الشريحة 6: عيادة كشف الأخطاء الشائعة والتحدي الختامي (Error X-Ray & Final Check)
        - اعرض أشهر 4 أخطاء يقع فيها الطلاب في هذا الدرس بالتنسيق الإلزامي:
          * ❌ **الخطأ الشائع:** ...
          * ✅ **الصواب الأصيل (Native ${langProfile.nameEn} Way):** ...
          * 💡 **السبب اللغوي:** ...
        - اختم الشريحة بـ **جملتين تفاعليتين إضافيتين** بصيغة \`[[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]]\` لتثبيت القاعدة.

        ### 🎙️ 7. التدريب الصوتي الحي مع مدربك الذكي (Live AI Voice Tutor Prompt)
        - ضع توجيه المدرب الصوتي داخل كتلة \`\`\`text ... \`\`\` لتدريب الطالب شفهياً على ("${lessonTitle}").

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
        {
          "content": "الشرح الكامل المقسم إلى الشرائح التفاعلية بصيغة Markdown...",
          "codeSnippet": "🎧 [Listening & Shadowing Studio - ${langProfile.nameEn}]\\n\\n1. ...\\n   🔊 IPA: /.../ | المعنى: ...\\n\\n2. ...",
          "codeExplanation": "🔬 دليل تدريب الأذن والأشعة الصوتية (Shadowing & X-Ray Anatomy):\\n- ...",
          "codingPractice": {
            "hasPractice": true,
            "taskQuestion": "✍️ التمرين التطبيقي (خطوة بخطوة باللغة ${langProfile.nameAr}):\\n1. ...\\n2. ...\\n3. ...",
            "starterCode": "// اكتب إجاباتك باللغة ${langProfile.nameAr} هنا بالترتيب:\\n1. \\n2. \\n3. \\n",
            "hints": [
              "💡 تلميح 1 (القاعدة الأساسية): ...",
              "🛠️ تلميح 2 (الكلمات المساعدة): ...",
              "🔓 تلميح 3 (بداية الحل): ..."
            ],
            "solutionCode": "✅ الحل النموذجي:\\n1. ...\\n2. ...\\n3. ..."
          },
          "dailyQuest": {
            "question": "سؤال تفاعلي دقيق من صلب هذا الدرس...",
            "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
            "correctAnswerIndex": 1,
            "explanation": "الشرح الوافي..."
          }
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `قم بتأليف المحطة رقم (${stationType}) بعنوان ("${lessonTitle}") في اللغة ${langProfile.nameAr} بمستوى (${tierSpec.cefrLabel}) بنظام الشرائح البصرية التفاعلية بصيغة JSON.`,
            0.68,
            16000
        );

        const parsedContent = sanitizeLanguageLessonJSON(safeParseAIJson(rawContent));

        res.json({ success: true, data: parsedContent });
    } catch (error) {
        console.error(`❌ خطأ في تأليف درس اللغة (${lessonTitle}):`, error.message);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تأليف درس اللغة.' });
    }
});




// ============================================================================
// 🎙️ 15. مسار "Speak Class" الثلاثي للمحادثة الصوتية الحية (متعدد اللغات!)
// ============================================================================
app.post('/api/academy2/lang-cert/live-voice-coach', async (req, res) => {
    const {
        courseTitle = '',
        targetLanguage = '',
        courseOrder = 1,
        sectionOrder = 1,
        difficulty = '',
        sectionName = '',
        lessonTitle = '',
        lessonExcerpt = '',
        classMode = 'speak_class',
        targetVocab = [],
        activeMissionWord = '',
        stepNumber = 1,
        chatHistory = [],
        studentSpokenText = ''
    } = req.body;

    try {
        const tierSpec = getCEFRProgressionSpec(courseTitle, sectionName, lessonTitle, difficulty, courseOrder, targetLanguage);
        const { langProfile } = tierSpec;

        let levelGuardrail = '';
        if (tierSpec.tierId === 'A0') {
            levelGuardrail = `
            🚨 قيود المستوى الصارمة جداً (${tierSpec.cefrLabel}الوحدة ${sectionOrder}):
            - الطالب في بداية تعلم **اللغة ${langProfile.nameAr} (${langProfile.nameEn})**! يجب أن تكون جملك باللغة ${langProfile.nameAr} قصيرة جداً وبسيطة للغاية (من 3 إلى 7 كلمات كحد أقصى!).
            - استخدم فقط الكلمات البسيطة الملموسة باللغة ${langProfile.nameAr} الموجودة في هذا الدرس: ${JSON.stringify(targetVocab.slice(0, 8))}.`;
        } else if (tierSpec.tierId === 'A1' || tierSpec.tierId === 'A2') {
            levelGuardrail = `
            🚨 قيود المستوى (${tierSpec.cefrLabel}الوحدة ${sectionOrder}):
            - تحدث باللغة **${langProfile.nameAr} (${langProfile.nameEn})** بجمل حياتية واضحة ومتوسطة الطول (من 7 إلى 13 كلمة).
            - ادفع الطالب لتكوين جمل تامة باللغة ${langProfile.nameAr} في مواقف الدرس ("${lessonTitle}") باستخدام مفرداته: ${JSON.stringify(targetVocab.slice(0, 8))}.`;
        } else {
            levelGuardrail = `
            🚨 قيود المستوى المتقدم (${tierSpec.cefrLabel}):
            - حاور الطالب كمتحدث أصلي مثقف باللغة **${langProfile.nameAr} (${langProfile.nameEn})**، وادفعه لاستخدام التراكيب المتقدمة الخاصة بالدرس ("${lessonTitle}").`;
        }

        let modeSpecificBlueprint = '';
        if (classMode === 'roleplay') {
            modeSpecificBlueprint = `
            🎭 [النمط المختار: تمثيل موقف حقيقي باللغة ${langProfile.nameAr}Real-Life Roleplay]
            - أنت الآن شخصية حقيقية داخل مشهد تمثيلي حي باللغة ${langProfile.nameAr} يناسب موضوع ("${sectionName} ${lessonTitle}") ومستوى (${tierSpec.cefrLabel}).`;
        } else if (classMode === 'mission') {
            const targetNow = activeMissionWord || targetVocab[0] || '';
            modeSpecificBlueprint = `
            🎯 [النمط المختار: تحدي توظيف مفردات الدرس باللغة ${langProfile.nameAr}]
            - الكلمة/العبارة المطلوبة من الطالب في هذه الجولة هي: "${targetNow}".
            - اطرح على الطالب موقفاً أو سؤالاً باللغة ${langProfile.nameAr} يجبره على استخدام ("${targetNow}") في إجابته القادمة، واجعل جميع الخيارات الثلاثة في "suggestedReplies" باللغة ${langProfile.nameAr} توظف ("${targetNow}")!`;
        } else {
            modeSpecificBlueprint = `
            👩‍🏫 [النمط المختار: حصة محادثة ومناقشة باللغة ${langProfile.nameAr}الخطوة ${stepNumber} من 5]`;
        }

        const systemPrompt = `${langProfile.instituteRole}
        أنت المحرك الذكي لغرفة المحادثة الحية (Live Speak Class) لتعليم **اللغة ${langProfile.nameAr} (${langProfile.nameEn})**.
        📌 بيانات الدرس الحالي:
        - اللغة المستهدفة للحوار: **${langProfile.nameAr} (${langProfile.nameEn})**
        - الكورس: "${courseTitle}" (${tierSpec.cefrLabel})
        - الوحدة: "${sectionName}"
        - الدرس: "${lessonTitle}"
        - مقتطف الدرس: "${(lessonExcerpt || '').slice(0, 800)}"
        - مفردات وعبارات الدرس: ${JSON.stringify(targetVocab)}

        ${levelGuardrail}
        ${modeSpecificBlueprint}

        🚨 تحذير حاسم: جميع الحقول الحوارية الأجنبية (studentSpeechUpgrade, coachReactionEnglish, nextQuestionEnglish, modelAnswerForNextQuestion, suggestedReplies) يجب أن تُكتب **باللغة ${langProfile.nameAr} (${langProfile.nameEn}) حصراً**!

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "speechLang": "${langProfile.speechLang}",
          "studentSpeechUpgrade": "ترقية الجملة التي قالها الطالب للتو إلى صياغة أصيلة باللغة ${langProfile.nameAr} (أو اتركها فارغة في بداية الجلسة)",
          "studentSpeechFeedbackArabic": "ملاحظة عربية سريعة تشرح تصحيح جملة الطالب السابقة...",
          "pronunciationScore": 95,
          "coachReactionEnglish": "تفاعل المعلم أو الشخصية باللغة ${langProfile.nameAr} (${langProfile.nameEn}) مع كلام الطالب...",
          "coachReactionArabic": "ترجمة تفاعل المعلم إلى العربية...",
          "nextQuestionEnglish": "السؤال الجديد أو الحوار التالي باللغة ${langProfile.nameAr} (${langProfile.nameEn}) الذي يوجهه المعلم للطالب الآن...",
          "nextQuestionArabic": "ترجمة السؤال الجديد إلى العربية...",
          "connectedSpeechHint": "كيف ينطق المتحدث الأصلي للغة ${langProfile.nameAr} جملة السؤال الجديد متصلة",
          "modelAnswerForNextQuestion": "إجابة نموذجية مقترحة باللغة ${langProfile.nameAr} للسؤال الجديد تحديداً...",
          "sceneMeta": {
            "setting": "مكان المشهد التمثيلي",
            "aiRole": "اسم ودور الشخصية المحاورة",
            "studentGoal": "المهمة المطلوبة من الطالب"
          },
          "suggestedReplies": [
            "رد مقترح 1 باللغة ${langProfile.nameAr} يجيب مباشرة على السؤال الجديد",
            "رد مقترح 2 باللغة ${langProfile.nameAr} يجيب مباشرة على السؤال الجديد",
            "رد مقترح 3 باللغة ${langProfile.nameAr} يجيب مباشرة على السؤال الجديد"
          ]
        }`;

        const historyText = (Array.isArray(chatHistory) ? chatHistory : [])
            .slice(-6)
            .map(m => `${m.role === 'coach' ? 'Coach' : 'Student'}: ${m.text || ''}`)
            .join('\n');

        const userPrompt = `سجل الحوار السابق:\n${historyText || '(بداية الحصة الآن)'}\n\nما نطقه الطالب للتو: "${studentSpokenText || '__START_SESSION__'}"\n\nولّد الرد باللغة ${langProfile.nameAr} (${langProfile.nameEn}) مع الترجمة العربية بصيغة JSON الآن.`;

        // 1. طلب المحتوى من الذكاء الاصطناعي
        const rawContent = await generateContentSmart(systemPrompt, userPrompt, 0.72, 2500);
        
        // 2. فك التشفير
        const parsed = safeParseAIJson(rawContent);
        parsed.speechLang = langProfile.speechLang;

        // ==========================================
        // ✨ FIX: Voice Coach Validation (المكان الصحيح داخل الـ try)
        // ==========================================
        const cleanedCoachData = sanitizeLanguageLessonJSON(parsed);
        const isValidCoachPayload =
            cleanedCoachData &&
            typeof cleanedCoachData === 'object' &&
            !Array.isArray(cleanedCoachData) &&
            typeof cleanedCoachData.studentSpeechUpgrade === 'string' &&
            typeof cleanedCoachData.coachReactionEnglish === 'string' &&
            cleanedCoachData.coachReactionEnglish.trim().length > 0 &&
            typeof (cleanedCoachData.nextQuestionEnglish || cleanedCoachData.replyEnglish) === 'string';

        // رمي خطأ إذا كانت الاستجابة غير صالحة ليتم التقاطها في الواجهة وتفعيل مسار الطوارئ
        if (!isValidCoachPayload) {
            console.error('❌ [Voice Coach Validation Failed]: استجابة غير مكتملة من الـ AI، تفعيل مسار الطوارئ في الواجهة.');
            return res.status(500).json({
                success: false,
                error: 'INVALID_COACH_PAYLOAD_STRUCTURE'
            });
        }

        // التحقق من أن pronunciationScore رقم صالح بين 0 و 100 أو تعيينه كـ null
        if (
            cleanedCoachData.pronunciationScore !== null &&
            cleanedCoachData.pronunciationScore !== undefined
        ) {
            const numericScore = Number(cleanedCoachData.pronunciationScore);
            cleanedCoachData.pronunciationScore =
                Number.isFinite(numericScore) && numericScore >= 0 && numericScore <= 100
                    ? Math.round(numericScore)
                    : null;
        } else {
            cleanedCoachData.pronunciationScore = null;
        }

        // إرسال البيانات بعد التأكد التام من سلامتها
        return res.json({ success: true, data: cleanedCoachData });

    } catch (error) {
        // ==========================================
        // منطقة الأخطاء فقط (Catch Block)
        // ==========================================
        console.error('❌ خطأ في Speak Class Coach:', error.message);
        return res.status(500).json({ success: false, error: 'تعذر الاتصال بالمدرب الصوتي.' });
    }
});




// ============================================================================
// 🧐 16. مسار "مجلس الحكماء الثلاثي للدرس" المترابط هرمياً (Course -> Unit -> Lesson)
// يحلل الدرس في سياق دروس الوحدة المحيطة به ويفحص جميع ودجاته التفاعلية
// ============================================================================
app.post('/api/academy2/surgeon/critique-and-suggest', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        sectionName = '',
        unitLessonsTitles = [],
        prevLessonTitle = '',
        nextLessonTitle = '',
        lesson = {},
        targetLanguage = ''
    } = req.body;

    if (!lesson || !lesson.title) {
        return res.status(400).json({ success: false, error: 'بيانات الدرس مطلوبة للتحليل.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            sectionName,
            lesson.title,
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n🧐 [Lesson Council V2 - ${langProfile.nameAr} ${tierSpec.tierId}] تشخيص مترابط لدرس: "${lesson.title}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت تقود **"مجلس الحكماء الثلاثي لهندسة الدروس العالمية (AI Lesson Surgeon Council)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى الصارم **(${tierSpec.cefrLabel})**.

        🔗 **سلسلة الترابط الهرمي (Hierarchical Context):**
        - الكراش كورس: "${courseTitle}" (الوصف: ${courseDescription.slice(0, 250)})
        - الوحدة الحالية: "${sectionName}"
        - خريطة دروس هذه الوحدة بالترتيب: ${JSON.stringify(unitLessonsTitles)}
        - الدرس السابق مباشرة: "${prevLessonTitle || 'هذا أول درس في الوحدة'}"
        - 📌 **الدرس الحالي قيد الفحص:** "${lesson.title}"
        - الدرس التالي مباشرة: "${nextLessonTitle || 'هذا آخر درس في الوحدة'}"

        📄 **محتوى الدرس الحالي (Markdown):**
        """
        ${(lesson.content || '').slice(0, 5500)}
        """
        🎧 **استوديو الصوتيات الحالي (codeSnippet):**
        """
        ${(lesson.codeSnippet || '').slice(0, 1000)}
        """

        المطلوب منك فحص هذا الدرس بدقة فائقة وتوليد **إلهامات جراحية احترافية ومحددة جداً** (لا تعطِ كلاماً عاماً، بل اذكر القواعد والمفردات والأمثلة بالاسم من صلب الدرس "${lesson.title}" وما يربطه بـ "${prevLessonTitle}" و"${nextLessonTitle}"):

        1. **🧐 الناقد والمُقيّم العالمي (Rater Persona):** يفحص التماسك البنيوي، الربط بين الدرس السابق واللاحق، ودقة معايير (${tierSpec.cefrLabel}). يقترح إضافة محددة (مثل: جدول مقارن، أو جسر صوتي/نحوي، أو حوار تطبيقي ناطق) مع ذكر ما سيُضاف بالتفصيل.
        2. **👨‍🏫 الأستاذ الخبير (Master Teacher Persona):** يكشف الفجوة العلمية أو الصوتية التي قد تربك الطالب في ("${lesson.title}")، ويحدد الحشو أو التكرار الواجب تنقيحه، ويقترح إضافة بيداغوجية عميقة (معادلة مكعبات ليغو [...] + [...] = [...], أو أمثلة صوتية IPA جديدة، أو قاعدة ذهبية).
        3. **🎓 التلميذ الذكي (Smart Student Persona):** يطلب أداة تفاعلية ممتعة في منتصف الدرس تكسر الرتابة وتثبت المعلومة فوراً (تحدي املأ الفراغ [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]], أو شفرة ذاكرة بصرية، أو سيناريو محادثة سريع).

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "qualityScore": 91,
          "raterVerdict": "تشخيص معماري دقيق للدرس وموقعه في الوحدة في سطرين...",
          "contextLinkageNote": "كيف يرتبط هذا الدرس بالدرس السابق (${prevLessonTitle || 'البداية'}) ويمهد للدرس التالي (${nextLessonTitle || 'الختام'})...",
          "personas": {
            "rater": {
              "roleTitle": "🧐 رؤية الناقد والمُقيّم العالمي (CEFR Rater)",
              "diagnosis": "تشخيص دقيق ومفصل لما ينقص الدرس ليحقق الترابط والكمال...",
              "whatWillBeAdded": ["عنصر محدد 1 سيُضاف", "عنصر محدد 2 سيُضاف"],
              "suggestionTitle": "عنوان الترقية المعمارية المقترحة من الناقد",
              "command": "أمر جراحي تفصيلي ودقيق لتنفيذ توصية الناقد داخل الدرس مع أمثلة باللغة ${langProfile.nameAr}..."
            },
            "teacher": {
              "roleTitle": "👨‍🏫 رؤية الأستاذ الخبير (إثراء وتنقيح)",
              "whatIsMissing": "الفجوة العلمية أو الصوتية التي اكتشفها الأستاذ في هذا الدرس...",
              "whatToDeleteOrEdit": "الحشو أو الجزئية التي يجب تنظيفها أو إعادة صياغتها...",
              "whatWillBeAdded": ["قاعدة أو جدول محدد", "أمثلة صوتية ناطقة"],
              "suggestionTitle": "عنوان التعديل البيداغوجي للأستاذ",
              "command": "أمر جراحي تفصيلي لإضافة ما ينقص وتنقيح الحشو بأمثلة ناطقة باللغة ${langProfile.nameAr}..."
            },
            "student": {
              "roleTitle": "🎓 رؤية التلميذ الذكي (تفاعل وكسر الملل)",
              "studentNeed": "ما يحتاجه الطالب في هذا الدرس تحديداً ليفهم القاعدة بدون تعقيد...",
              "whatWillBeAdded": ["شفرة ذاكرة سريعة", "تمرين املأ الفراغ من 4 جمل تفاعلية"],
              "suggestionTitle": "عنوان المحطة التفاعلية للطالب",
              "command": "أضف في منتصف الدرس قسماً تفاعلياً يبسط القاعدة بشفرة ذاكرة مع 4 جمل تمرين املأ الفراغ بصيغة [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] مع ترجمتها العربية..."
            }
          },
          "applyAllCommand": "أمر جراحي شامل يدمج توصية الناقد + إثراء وتنقيح الأستاذ + محطة التلميذ التفاعلية (شاملة تمرين املأ الفراغ [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] وأمثلة صوتية جديدة في codeSnippet) بتناغم تام.",
          "midLessonSuggestions": [
            {
              "id": "rater_sug",
              "persona": "rater",
              "badge": "🧐 توصية الناقد (Rater)",
              "title": "عنوان محدد لتوصية الناقد...",
              "why": "كيف ترفع هذه الإضافة جودة الدرس وترابطه مع الوحدة؟",
              "deliverables": "ماذا سيُضاف للدرس بدقة؟",
              "operationType": "inject_mid_custom",
              "command": "الأمر الجراحي الكامل لتوصية الناقد..."
            },
            {
              "id": "teacher_sug",
              "persona": "teacher",
              "badge": "👨‍🏫 توصية الأستاذ الخبير",
              "title": "عنوان محدد لتوصية الأستاذ...",
              "why": "كيف تعالج الفجوة العلمية وتنقي الدرس؟",
              "deliverables": "ماذا سيُضاف أو يُنقح في الدرس؟",
              "operationType": "inject_mid_custom",
              "command": "الأمر الجراحي الكامل لتوصية الأستاذ..."
            },
            {
              "id": "student_sug",
              "persona": "student",
              "badge": "🎓 طلب التلميذ الذكي",
              "title": "عنوان محدد لطلب التلميذ...",
              "why": "كيف يثبت المعلومة عملياً وبسرعة؟",
              "deliverables": "تمرين تفاعلي [[...]] + شفرة ذاكرة",
              "operationType": "inject_mid_fill_blank",
              "command": "الأمر الجراحي الكامل لطلب التلميذ..."
            }
          ],
          "fluffToPrune": {
            "title": "✂️ تنظيف وتكثيف الشرح",
            "whatToRemove": "وصف دقيق لأي تكرار أو شرح نظري جاف يُنصح بتكثيفه وتحويله لنقاط واضحة...",
            "command": "قم بتنظيف أي حشو أو تكرار في الدرس، وحوّل الفقرات الطويلة إلى نقاط وجداول منظمة وسهلة القراءة مع الحفاظ على جميع الأمثلة والتمارين."
          }
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `حلل الدرس "${lesson.title}" في سياق الوحدة "${sectionName}" والكورس "${courseTitle}" بصيغة JSON.`,
            0.7,
            5000
        );
        const parsed = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('❌ خطأ في مجلس الحكماء الثلاثي:', error.message);
        res.status(500).json({ success: false, error: 'تعذر تحليل الدرس حالياً.' });
    }
});



// ============================================================================
// 🩺 17. المسار الجراحي الشامل لتعديل وإثراء الدرس (Full Lesson AI Surgeon V2)
// يضمن الترابط الهرمي + التزامن الصوتي التلقائي + صيغ الواجهة التفاعلية 100%
// ============================================================================
app.post('/api/academy2/surgeon/operate-lesson', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        sectionName = '',
        unitLessonsTitles = [],
        prevLessonTitle = '',
        nextLessonTitle = '',
        lesson = {},
        userCommand = '',
        operationType = 'custom',
        targetLanguage = ''
    } = req.body;

    if (!lesson || !userCommand) {
        return res.status(400).json({ success: false, error: 'بيانات الدرس والأمر الجراحي مطلوبان.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            sectionName,
            lesson.title || '',
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        const currentContent = (lesson.content || '').trim();
        const isStubLesson =
            currentContent.length < 240 ||
            currentContent.includes('افتح المُشرط الذكي لإثرائه الآن') ||
            currentContent.includes('تمت إضافته عبر جراح');

        const safeDescription = (lesson.description || lesson.title || '').split('|||')[0].trim();

        console.log(`\n🩺 [Lesson Surgeon V2 - ${langProfile.nameAr} ${tierSpec.tierId}] تنفيذ (${operationType}) على درس: "${lesson.title}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت الآن **"كبير الجراحين الأكاديميين (Master AI Lesson Surgeon)"** لتطوير وهندسة درس في اللغة **${langProfile.nameAr} (${langProfile.nameEn})** ضمن المستوى **(${tierSpec.cefrLabel})**.

        🔗 **سياق الترابط الهرمي:**
        - الكورس: "${courseTitle}"
        - الوحدة: "${sectionName}" (دروس الوحدة: ${JSON.stringify(unitLessonsTitles)})
        - الدرس السابق: "${prevLessonTitle || 'بداية الوحدة'}" | الدرس الحالي: "${lesson.title}" | الدرس التالي: "${nextLessonTitle || 'نهاية الوحدة'}"

        📋 **محتوى الدرس الحالي (Markdown):**
        """
        ${currentContent || '(درس جديد فارغ يحتاج لبناء كامل ومفصل)'}
        """
        🎧 **استوديو الصوتيات الحالي (codeSnippet):**
        """
        ${lesson.codeSnippet || ''}
        """
        🔬 **دليل تدريب الأذن الحالي (codeExplanation):**
        """
        ${lesson.codeExplanation || ''}
        """
        ✍️ **التمرين التطبيقي الحالي (codingPractice):**
        ${JSON.stringify(lesson.codingPractice || null)}
        🧠 **سؤال التحدي السريع الحالي (dailyQuest):**
        ${JSON.stringify(lesson.dailyQuest || null)}

        🎯 **الأمر الجراحي المطلوب تنفيذه بدقة واحترافية 100%:**
        "${userCommand}"

        ${tierSpec.pedagogyRules}

        🚨 **قوانين التوافق الديناميكي الصارمة مع واجهة المنصة (UI Dynamic Compatibility Rules):**
        1. ${isStubLesson
            ? `بما أن هذا الدرس لا يزال فارغاً أو مقتضباً، قم بتأليف درس كامل ومفصل وغني جداً في حقل "content" يضم 6 أقسام واضحة بعناوين ### (1. القاعدة ومعادلة الليغو، 2. جدول المفردات مع IPA والنطق العربي والـ 🔵/🔴، 3. سُلّم البناء التراكمي ### 🪜، 4. قراءة وحوار واقعي، 5. ورشة أخطاء شائعة ❌ و ✅ و 💡، 6. تمرين املأ الفراغ التفاعلي) مع تنفيذ الأمر الجراحي أعلاه بالكامل!`
            : `**إياك أن تختصر أو تحذف أقسام الدرس الأصلية السليمة!** حافظ على جميع الأقسام والجداول والفقرات الموجودة في "content"، وقم بحقن أو تعديل أو تطوير ما طلبه الأمر الجراحي في الموضع المنطقي الأنسب بغزارة علمية وتنسيق Markdown فخم.`}
        2. **قانون التفعيل الصوتي للكلمات والجمل:** أي كلمة أو جملة باللغة ${langProfile.nameAr} تذكرها داخل الشرح أو الأمثلة، ضعها إما بين علامتي كود مفردة هكذا word أو داخل جدول Markdown، لكي تضع الواجهة بجانبها زر نطق صوتي 🔊 تلقائياً!
        3. **قانون المحادثات الناطقة (Interactive Dialogues):** إذا أضفت حواراً أو محادثة، اكتبه في أسطر تبدأ بـ - **اسم المتحدث:** الجملة باللغة ${langProfile.nameAr} (الترجمة العربية) لكي تحوله الواجهة إلى مشغل حوار صوتي تفاعلي!
        4. **قانون معادلات مكعبات الليغو (Lego Formulas):** عند إضافة معادلة تركيب، اكتبها في سطر مستقل بصيغة الأقواس المربعة:
           [المكعب 1: ...] + [المكعب 2: ...] = [النتيجة: ...]
        5. **قانون تمرين املأ الفراغ التفاعلي:** أي تمرين املأ الفراغ يُطلب إضافته يجب أن يُكتب حصراً بصيغة القوسين المزدوجين التفاعلية (والإجابة الصحيحة هي الخيار الأول دائماً):
           - الجملة باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة العربية).
        6. **التزامن التلقائي مع استوديو الصوتيات (codeSnippet):** إذا أضفت مفردات أو جملاً جديدة للدرس، قم بتحديث وإثراء حقل "codeSnippet" ليضم من 5 إلى 7 جمل مرقمة متبوعة بسطر 🔊 IPA: /.../ | المعنى: ... لكل جملة حتى تظهر فوراً في جدول الصوتيات وبطاقات الذاكرة ولعبة المكعبات!

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "surgeonReport": "تقرير جراحي واضح يذكر بدقة ما تم حقنه وتطويره في الدرس وكيف تم ربطه بالوحدة...",
          "updatedLesson": {
            "title": "${lesson.title}",
            "description": "${safeDescription}",
            "content": "نص الـ Markdown الكامل والمحدث للدرس بعد تنفيذ الجراحة دون اختصار أي قسم أصلي...",
            "codeSnippet": "🎧 استوديو الاستماع والترديد (Audio Shadowing):\\n1. ...\\n🔊 IPA: /.../ | المعنى: ...\\n2. ...\\n🔊 IPA: /.../ | المعنى: ...",
            "codeExplanation": "🔬 دليل تدريب الأذن والنطق (Shadowing Anatomy):\\n- ...",
            "codingPractice": {
              "hasPractice": true,
              "taskQuestion": "✍️ التمرين التطبيقي (خطوة بخطوة باللغة ${langProfile.nameAr}):\\n1. ...\\n2. ...\\n3. ...",
              "starterCode": "// اكتب إجابتك هنا:\\n1. \\n2. \\n3. ",
              "hints": ["💡 تلميح 1: ...", "🛠️ تلميح 2: ...", "🔓 تلميح 3: ..."],
              "solutionCode": "✅ الحل النموذجي:\\n1. ...\\n2. ...\\n3. ..."
            },
            "dailyQuest": {
              "question": "سؤال التحدي السريع...",
              "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
              "correctAnswerIndex": 0,
              "explanation": "شرح الإجابة الصحيحة...",
              "bonusExp": 50
            }
          }
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `نفّذ هذا الأمر الجراحي على الدرس "${lesson.title}" مع الحفاظ على كامل ثراء الدرس وتنسيق العناصر التفاعلية بصيغة JSON: "${userCommand}"`,
            0.68,
            16000
        );

        const parsed = sanitizeLanguageLessonJSON(safeParseAIJson(rawContent));
        const rawUpdated = parsed.updatedLesson || parsed;

        const finalUpdatedLesson = {
            ...lesson,
            title: rawUpdated.title || lesson.title,
            description: rawUpdated.description || safeDescription,
            content: rawUpdated.content || lesson.content,
            codeSnippet: rawUpdated.codeSnippet || lesson.codeSnippet,
            codeExplanation: rawUpdated.codeExplanation || lesson.codeExplanation,
            codingPractice: rawUpdated.codingPractice || lesson.codingPractice,
            dailyQuest: rawUpdated.dailyQuest || lesson.dailyQuest
        };

        res.json({
            success: true,
            surgeonReport: parsed.surgeonReport || 'تم تنفيذ التعديل الجراحي على الدرس ومزامنة عناصره التفاعلية بنجاح!',
            updatedLesson: finalUpdatedLesson
        });
    } catch (error) {
        console.error('❌ خطأ في المسار الجراحي للدرس (operate-lesson):', error.message);
        res.status(500).json({ success: false, error: 'تعذر تنفيذ التعديل الجراحي على الدرس حالياً.' });
    }
});







// ============================================================================
// 🔬 18. مسار تعديل شريحة واحدة من الدرس بالذكاء الاصطناعي (Block-Level AI Section Editor V2)
// يضمن الترابط مع الشريحة السابقة واللاحقة والدرس + التفاعل الصوتي والديناميكي الكامل!
// ============================================================================
app.post('/api/academy2/surgeon/operate-section', async (req, res) => {
    const {
        courseTitle = '',
        courseOrder = 1,
        sectionName = '',
        lessonTitle = '',
        lessonDescription = '',
        allBlocksHeadings = [],
        blockIndex = 0,
        prevBlockHeading = '',
        nextBlockHeading = '',
        sectionMarkdown = '',
        userInstruction = '',
        targetLanguage = ''
    } = req.body;

    if (!sectionMarkdown || !userInstruction) {
        return res.status(400).json({ success: false, error: 'نص القسم والتعليمات مطلوبان.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(courseTitle, sectionName, lessonTitle, '', courseOrder, targetLanguage);
        const { langProfile } = tierSpec;

        const systemPrompt = `${langProfile.instituteRole}
        أنت **"الجراح المجهري للشرائح التعليمية (Micro-Block AI Surgeon)"** في اللغة **${langProfile.nameAr} (${langProfile.nameEn})** للمستوى **(${tierSpec.cefrLabel})**.

        🔗 **سياق الترابط الهرمي للشريحة الحالية:**
        - الكورس: "${courseTitle}"
        - الوحدة: "${sectionName}"
        - الدرس: "${lessonTitle}" (${lessonDescription})
        - خريطة أقسام هذا الدرس: ${JSON.stringify(allBlocksHeadings)}
        - القسم السابق: "${prevBlockHeading || 'هذه هي الشريحة الافتتاحية للدرس'}"
        - 📌 **ترتيب الشريحة الحالية:** القسم رقم (${blockIndex + 1})
        - القسم التالي: "${nextBlockHeading || 'هذه هي الشريحة الختامية للدرس'}"

        📄 **محتوى الشريحة الحالية المراد تطويرها:**
        """
        ${sectionMarkdown}
        """

        🎯 **أمر التطوير المطلوب تنفيذه على هذه الشريحة:**
        "${userInstruction}"

        🚨 **قوانين الإخراج الديناميكي الصارمة (لضمان تفاعل الواجهة 100%):**
        1. حافظ على عنوان القسم الرئيسي الذي يبدأ بـ \`###\` في أول سطر (إلا إذا طُلب تغييره)، وطوّر محتوى الشريحة بعمق وتنسيق Markdown احترافي يترابط مع القسم السابق واللاحق.
        2. أي كلمة أو عبارة أجنبية باللغة ${langProfile.nameAr} تذكرها في الشرح أو القوائم ضعها داخل علامتي كود مفردة \`كلمة\` أو في جدول Markdown لكي يظهر بجانبها زر الاستماع الصوتي 🔊 وشارة الجنس النحوي (🔵 مذكر / 🔴 مؤنث) تلقائياً!
        3. إذا أضفت محادثة أو حواراً، اكتبه بصيغة: \`- **المتحدث:** الجملة باللغة ${langProfile.nameAr} (الترجمة العربية)\`.
        4. إذا أضفت معادلة تركيب، اكتبها بصيغة مكعبات الليغو: \`[المكعب 1: ...] + [المكعب 2: ...] = [النتيجة: ...]\`.
        5. إذا أضفت تمرين "املأ الفراغ"، استخدم الصيغة التفاعلية حصراً:
           \`- الجملة باللغة ${langProfile.nameAr} [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] (الترجمة العربية).\`
        6. إذا أضفت جملاً صوتية جديدة مهمة في هذه الشريحة، ضعها أيضاً في حقل "newAudioStudioLines" بصيغة (الجملة + سطر 🔊 IPA: /.../ | المعنى: ...) ليتم إلحاقها باستوديو الصوتيات للدرس!

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
        {
          "updatedSectionMarkdown": "نص الـ Markdown المحدث والغني لهذه الشريحة فقط...",
          "newAudioStudioLines": "اختياري: إذا أضفت جملاً صوتية جديدة، اكتبها هنا بصيغة:\\n- الجملة\\n🔊 IPA: /.../ | المعنى: ... (أو اتركها فارغة)",
          "summary": "ملخص دقيق في سطر واحد لما تم تطويره وإضافته في هذه الشريحة..."
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `نفّذ هذا التطوير الجراحي على الشريحة: "${userInstruction}" وأعد النتيجة بصيغة JSON.`,
            0.65,
            6000
        );
        const parsed = sanitizeLanguageLessonJSON(safeParseAIJson(rawContent));

        res.json({
            success: true,
            updatedSectionMarkdown: parsed.updatedSectionMarkdown || sectionMarkdown,
            newAudioStudioLines: parsed.newAudioStudioLines || '',
            summary: parsed.summary || 'تم تطوير الشريحة بنجاح!'
        });
    } catch (error) {
        console.error('❌ خطأ في تعديل القسم:', error.message);
        res.status(500).json({ success: false, error: 'تعذر تعديل القسم حالياً.' });
    }
});




// ============================================================================
// 💾 19. مسار حفظ تعديلات الدرس مباشرة في قاعدة البيانات MongoDB Atlas
// ============================================================================
app.post('/api/academy2/surgeon/save-lesson-db', async (req, res) => {
    const { lessonId, courseId, updatedLesson } = req.body;
    if (!updatedLesson) {
        return res.status(400).json({ success: false, error: 'بيانات الدرس المحدثة مطلوبة.' });
    }

    try {
        let dbUpdated = false;
        if (lessonId && mongoose.Types.ObjectId.isValid(lessonId)) {
            const result = await mongoose.connection.collection('lessons').updateOne(
                { _id: new mongoose.Types.ObjectId(lessonId) },
                {
                    $set: {
                        title: updatedLesson.title,
                        description: updatedLesson.description,
                        content: updatedLesson.content,
                        codeSnippet: updatedLesson.codeSnippet,
                        codeExplanation: updatedLesson.codeExplanation,
                        codingPractice: updatedLesson.codingPractice,
                        dailyQuest: updatedLesson.dailyQuest,
                        bossQuiz: updatedLesson.bossQuiz,
                        updatedAt: new Date()
                    }
                }
            );
            if (result.matchedCount > 0) dbUpdated = true;
        }

        res.json({
            success: true,
            dbUpdated,
            message: dbUpdated
                ? '☁️ تم حفظ التعديلات نهائياً في قاعدة البيانات (MongoDB)!'
                : '💾 تم حفظ التعديلات في ذاكرة المتصفح الدائمة!'
        });
    } catch (error) {
        console.error('❌ خطأ في حفظ الدرس بقاعدة البيانات:', error.message);
        res.status(500).json({ success: false, error: 'تعذر الحفظ في قاعدة البيانات.' });
    }
});





// ============================================================================
// 🏗️✨ 20-A. مسار "مجلس الحكماء الثلاثي لإلهام وهندسة الوحدة" (Unit Inspiration Council)
// يحلل الوحدة الحالية في سياق الوحدات السابقة واللاحقة في الكورس ويقدم مقترحات مفصلة
// ============================================================================
app.post('/api/academy2/surgeon/inspire-unit', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        sectionName = '',
        allUnitsNames = [],
        prevUnitName = '',
        nextUnitName = '',
        currentLessons = [],
        targetLanguage = ''
    } = req.body;

    if (!sectionName) {
        return res.status(400).json({ success: false, error: 'اسم الوحدة مطلوب.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            sectionName,
            '',
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n🏗️✨ [Unit Inspiration Council - ${langProfile.nameAr} ${tierSpec.tierId}] تحليل وهندسة الوحدة: "${sectionName}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت تقود **"مجلس الحكماء الثلاثي لهندسة الوحدات الدراسية (Unit Curriculum Council)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى **(${tierSpec.cefrLabel})**.

        🔗 **سياق الترابط الهرمي للوحدة:**
        - الكراش كورس: "${courseTitle}"
        - خريطة جميع وحدات الكورس: ${JSON.stringify(allUnitsNames)}
        - الوحدة السابقة: "${prevUnitName || 'هذه هي الوحدة الأولى في الكورس'}"
        - 📌 **الوحدة الحالية قيد الفحص:** "${sectionName}"
        - الوحدة التالية: "${nextUnitName || 'هذه هي الوحدة الأخيرة في الكورس'}"
        - الدروس الحالية داخل هذه الوحدة (${currentLessons.length} دروس):
        ${JSON.stringify(currentLessons.map((l, i) => ({ order: i + 1, title: l.title, type: l.type, description: (l.description || '').split('|||')[0] })))}

        المطلوب منك فحص هيكل هذه الوحدة وتوليد **تشخيص معماري + 3 رؤى إلهامية مفصلة جداً** من منظور:
        1. **🧐 الناقد والمُقيّم العالمي (Rater):** كيف نجعل تسلسل دروس هذه الوحدة متماسكاً 100% ويربط بين ما تعلمه الطالب في ("${prevUnitName || 'البداية'}") وما سيتعلمه في ("${nextUnitName || 'المستوى التالي'}")؟ وما الدرس الذي يجب إضافته لتحقيق معايير (${tierSpec.cefrLabel})؟
        2. **👨‍🏫 الأستاذ الخبير (Master Teacher):** ما الفجوة العلمية أو الصوتية أو التطبيقية الناقصة في قائمة دروس هذه الوحدة؟ وما الدروس التي يجب دمجها أو إعادة ترتيبها أو إضافتها؟
        3. **🎓 التلميذ الذكي (Smart Student):** ما الدرس التطبيقي أو الورشة الحوارية/الصوتية التي يحتاجها الطالب داخل هذه الوحدة لكي يمارس ما تعلمه عملياً بدون ملل؟

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "unitScore": 92,
          "unitDiagnosis": "تشخيص شامل لتماسك دروس الوحدة الحالية وموقعها داخل الكورس في سطرين...",
          "unitBridgeNote": "كيف تبني هذه الوحدة على (${prevUnitName || 'نقطة الانطلاق'}) وتمهد لـ (${nextUnitName || 'الوحدة القادمة'})...",
          "applyAllUnitCommand": "أمر جراحي شامل يعيد هيكلة وترتيب دروس الوحدة ويضيف الدروس التطبيقية والجسور المفقودة التي أوصى بها الثلاثي (الناقد + الأستاذ + التلميذ) بتناغم تام.",
          "personas": {
            "rater": {
              "badge": "🧐 رؤية الناقد العالمي (CEFR Rater)",
              "title": "عنوان الترقية الهيكلية للوحدة من منظور الناقد",
              "diagnosis": "تحليل عميق لتسلسل الدروس الحالي وما ينقصه...",
              "whatItWillChange": ["إضافة درس جسر مترابط: ...", "إعادة ضبط تسلسل: ..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ رؤية الناقد على هذه الوحدة..."
            },
            "teacher": {
              "badge": "👨‍🏫 رؤية الأستاذ الخبير",
              "title": "عنوان الإثراء العلمي والتطبيقي للوحدة",
              "diagnosis": "الفجوة التعليمية أو الصوتية التي يجب سدها في هذه الوحدة...",
              "whatItWillChange": ["إضافة درس متخصص في: ...", "تنقيح أو دمج: ..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ رؤية الأستاذ على هذه الوحدة..."
            },
            "student": {
              "badge": "🎓 رؤية التلميذ الذكي",
              "title": "عنوان الورشة التطبيقية والمحادثة الممتعة للوحدة",
              "diagnosis": "ما يحتاجه الطالب ليطبق مفردات وقواعد هذه الوحدة في الواقع...",
              "whatItWillChange": ["إضافة ورشة تطبيقية/حوارية: ...", "تحدي تثبيت سمعي: ..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ رؤية التلميذ على هذه الوحدة..."
            }
          },
          "suggestedNewLessons": [
            {
              "title": "عنوان مقترح لدرس جديد يثري هذه الوحدة...",
              "description": "وصف دقيق للمهارات والصوتيات والتمارين التي سيقدمها هذا الدرس...",
              "whyNeeded": "لماذا يعتبر هذا الدرس إضافة ذهبية لهذه الوحدة تحديداً؟"
            },
            {
              "title": "عنوان مقترح ثانٍ لدرس تطبيقي أو حواري...",
              "description": "وصف دقيق لما سيتقنه الطالب في هذا الدرس...",
              "whyNeeded": "كيف يربط دروس الوحدة ببعضها؟"
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `حلل الوحدة "${sectionName}" وولّد توصيات الثلاثي والدروس المقترحة بصيغة JSON.`,
            0.7,
            5000
        );
        const parsed = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('❌ خطأ في إلهام الوحدة (inspire-unit):', error.message);
        res.status(500).json({ success: false, error: 'تعذر توليد إلهام الوحدة حالياً.' });
    }
});


// ============================================================================
// 🏗️ 20-B. مسار جراح المناهج الشامل للوحدة (Unit Level Surgeon V2)
// يحافظ على الدروس القديمة، ويبني محتوى غنياً وتفاعلياً كاملاً لأي درس جديد يضاف!
// ============================================================================
app.post('/api/academy2/surgeon/operate-unit', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        sectionName = '',
        prevUnitName = '',
        nextUnitName = '',
        currentLessons = [],
        userCommand = '',
        targetLanguage = ''
    } = req.body;

    if (!sectionName || !userCommand) {
        return res.status(400).json({ success: false, error: 'اسم الوحدة وأمر التعديل مطلوبان.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            sectionName,
            '',
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n🏗️ [Unit Surgeon V2 - ${langProfile.nameAr} ${tierSpec.tierId}] تعديل الوحدة (${sectionName}) بناءً على: "${userCommand}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت **"عميد هندسة الوحدات الدراسية (Master Unit Architect)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى **(${tierSpec.cefrLabel})**.

        🔗 **سياق الترابط:**
        - الكورس: "${courseTitle}"
        - الوحدة السابقة: "${prevUnitName || 'بداية الكورس'}" | الوحدة الحالية: "${sectionName}" | الوحدة التالية: "${nextUnitName || 'نهاية الكورس'}"
        - قائمة الدروس الحالية في هذه الوحدة:
        ${JSON.stringify(currentLessons.map(l => ({ title: l.title, type: l.type, description: (l.description || '').split('|||')[0] })))}

        🎯 **أمر التعديل الجراحي المطلوب على الوحدة:**
        "${userCommand}"

        🚨 **قوانين التنفيذ الصارمة:**
        1. بالنسبة للدروس الموجودة مسبقاً والتي لم يُطلب حذفها أو دمجها، **حافظ على عنوانها ("title") كما هو** وضَع \`"isNewOrModified": false\` لكي نحتفظ بمحتواها الكامل.
        2. بالنسبة لأي **درس جديد تماماً** تضيفه (أو درس ناتج عن دمج درسين)، ضع \`"isNewOrModified": true\` وقم بتوليد **محتوى تأسيسي وتفاعلي كامل وغني جداً له** في حقل \`"content"\` (يشمل أقسام \`###\`، معادلة ليغو \`[...] + [...] = [...]\`، جدول مفردات باللغة ${langProfile.nameAr} مع IPA والـ 🔵/🔴، سُلّم بناء تراكمي \`### 🪜\`، حوار واقعي، وتمرين املأ الفراغ \`[[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]]\`) بالإضافة إلى \`"codeSnippet"\` (5 جمل صوتية مع IPA) و \`"codingPractice"\` و \`"dailyQuest"\` حتى يظهر الدرس الجديد كاملاً ومتفاعلاً فوراً على الواجهة!

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "surgeonReport": "ملخص دقيق ومفصل لما قمت به في هيكل الوحدة والدروس التي أضفتها أو طورتها...",
          "updatedUnitSummary": {
            "unitSummary": "ملخص محدث للوحدة...",
            "whatYouLearn": "ماذا سيتقن الطالب في هذه الوحدة بعد التحديث...",
            "whyItMatters": "أهمية هذه الوحدة وترابطها مع الكورس..."
          },
          "updatedLessonsBlueprint": [
            {
              "title": "عنوان الدرس",
              "description": "وصف الدرس الواضح",
              "type": "video",
              "isNewOrModified": false,
              "content": "إذا كان isNewOrModified=true اكتب هنا نص الـ Markdown الكامل والغني للدرس الجديد...",
              "codeSnippet": "إذا كان isNewOrModified=true اكتب هنا 5 جمل مرقمة لاستوديو الصوتيات مع سطر 🔊 IPA: /.../ | المعنى: ...",
              "codeExplanation": "🔬 دليل تدريب الأذن والنطق...",
              "codingPractice": {
                "hasPractice": true,
                "taskQuestion": "✍️ التمرين التطبيقي...",
                "starterCode": "// اكتب إجابتك هنا:\\n1. \\n2. ",
                "hints": ["💡 تلميح 1: ...", "🛠️ تلميح 2: ..."],
                "solutionCode": "✅ الحل النموذجي:..."
              },
              "dailyQuest": {
                "question": "سؤال التحدي السريع...",
                "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
                "correctAnswerIndex": 0,
                "explanation": "شرح الإجابة الصحيحة...",
                "bonusExp": 50
              }
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `نفذ أمر تعديل الوحدة "${sectionName}" الآن مع بناء محتوى كامل لأي درس جديد بصيغة JSON.`,
            0.7,
            14000
        );
        const parsed = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('❌ خطأ في جراحة الوحدة:', error.message);
        res.status(500).json({ success: false, error: 'تعذر تعديل هيكل الوحدة.' });
    }
});


// ============================================================================
// 🌍✨ 21-A. مسار "مجلس الحكماء الثلاثي لإلهام وهندسة الكورس الشامل" (Course Inspiration Council)
// يحلل جميع وحدات الكورس ودروسها ويقترح ترقيات استراتيجية مترابطة من (الناقد + الأستاذ + التلميذ)
// ============================================================================
app.post('/api/academy2/surgeon/inspire-course', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        parentCertTitle = '',
        currentBlueprint = [],
        targetLanguage = ''
    } = req.body;

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${parentCertTitle} ${courseTitle} ${courseDescription}`,
            '',
            '',
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n🌍✨ [Course Inspiration Council - ${langProfile.nameAr} ${tierSpec.tierId}] تشخيص هيكل الكورس: "${courseTitle}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت تقود **"المجلس الأعلى لهندسة المناهج والكورسات العالمية (Course-Level Strategic Council)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى **(${tierSpec.cefrLabel})**.

        🔗 **بيانات الكراش كورس الحالي:**
        - الشهادة الأم: "${parentCertTitle || 'مسار احترافي شامل'}"
        - عنوان الكراش كورس (رقم ${courseOrder}): "${courseTitle}"
        - الوصف: "${courseDescription}"
        - الهيكل الحالي للوحدات والدروس (${currentBlueprint.length} وحدات):
        ${JSON.stringify(currentBlueprint.map((sec, idx) => ({
            unitOrder: idx + 1,
            sectionName: sec.sectionName,
            lessonsCount: sec.lessons?.length || 0,
            lessonTitles: (sec.lessons || []).map(l => l.title)
        })))}

        المطلوب منك فحص المعمارية الكاملة لهذا الكورس وتوليد **تشخيص استراتيجي + 3 رؤى إلهامية مفصلة** من منظور:
        1. **🧐 الناقد والمُقيّم العالمي (CEFR Rater):** هل تغطي وحدات هذا الكورس جميع متطلبات مستوى (${tierSpec.cefrLabel}) بتدرج سليم؟ ما الوحدة الانتقالية أو التكميلية التي يجب إضافتها لربط الوحدات ببعضها؟
        2. **👨‍🏫 الأستاذ الخبير (Master Teacher):** ما الموضوع الحيوي أو القاعدة أو المهارة الصوتية التي أغفلها الكورس؟ وكيف نعيد تنظيم الوحدات أو نضيف وحدة متخصصة ترفع القيمة العلمية للكورس؟
        3. **🎓 التلميذ الذكي (Smart Student):** ما الوحدة التطبيقية الحياتية (مثل: مواقف السفر، المحادثة السريعة، أو معسكر المراجعة التفاعلي) التي يتمنى الطالب وجودها ليستمتع بالكورس ويتحدث بطلاقة؟

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "courseQualityScore": 93,
          "architecturalVerdict": "تشخيص معماري شامل لتسلسل وحدات الكورس الحالية ومدى تغطيتها للمستوى في سطرين...",
          "applyAllCourseCommand": "أمر جراحي شامل يطبق توصيات الثلاثي على هيكل الكورس (إضافة الوحدات التكميلية والتطبيقية مع دروسها الكاملة وترتيب مسار الكورس بتناغم 100%).",
          "personas": {
            "rater": {
              "badge": "🧐 رؤية الناقد العالمي (Course Rater)",
              "title": "عنوان الترقية المعمارية للكورس من منظور الناقد",
              "diagnosis": "تحليل عميق لتسلسل الوحدات وما ينقصها لتحقيق معايير (${tierSpec.cefrLabel})...",
              "proposedChanges": ["إضافة وحدة متكاملة بعنوان: ...", "ربط التدرج بين الوحدات: ..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ توصية الناقد على هيكل الكورس..."
            },
            "teacher": {
              "badge": "👨‍🏫 رؤية الأستاذ الخبير",
              "title": "عنوان الإثراء الأكاديمي والصوتي للكورس",
              "diagnosis": "المهارة أو الوحدة المحورية التي يرى الأستاذ ضرورة إضافتها للكورس...",
              "proposedChanges": ["إضافة وحدة تخصصية بعنوان: ...", "تطوير محاور: ..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ توصية الأستاذ على هيكل الكورس..."
            },
            "student": {
              "badge": "🎓 رؤية التلميذ الذكي",
              "title": "عنوان وحدة المواقف الحية والممارسة العملية",
              "diagnosis": "ما يحتاجه الطالب في هذا الكورس ليطبق اللغة في مواقف حقيقية ممتعة...",
              "proposedChanges": ["إضافة وحدة مواقف وتحديات بعنوان: ...", "محطات محادثة وتثبيت..."],
              "command": "الأمر الجراحي الدقيق لتنفيذ توصية التلميذ على هيكل الكورس..."
            }
          },
          "suggestedNewUnits": [
            {
              "sectionName": "الوحدة المقترحة 1: [عنوان واضح ومشوق باللغة العربية مع مصطلح ${langProfile.nameAr}]",
              "whyNeeded": "لماذا تعتبر هذه الوحدة إضافة استراتيجية للكورس؟",
              "proposedLessons": ["الدرس 1: ...", "الدرس 2: ...", "الدرس 3: ...", "الدرس 4: ..."]
            },
            {
              "sectionName": "الوحدة المقترحة 2: [عنوان واضح ومشوق]",
              "whyNeeded": "كيف ترفع طلاقة الطالب وتربط وحدات الكورس؟",
              "proposedLessons": ["الدرس 1: ...", "الدرس 2: ...", "الدرس 3: ...", "الدرس 4: ..."]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `حلل الهيكل الكامل للكورس "${courseTitle}" وولّد توصيات الثلاثي والوحدات المقترحة بصيغة JSON.`,
            0.7,
            5500
        );
        const parsed = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('❌ خطأ في إلهام الكورس (inspire-course):', error.message);
        res.status(500).json({ success: false, error: 'تعذر توليد إلهام الكورس حالياً.' });
    }
});

// ============================================================================
// 🌍 21-B. مسار جراح المناهج الشامل للكورس (Course Level Surgeon V2)
// يحافظ على جميع الدروس القديمة، ويبني محتوى غنياً وملخصات بوصلة للوحدات الجديدة!
// ============================================================================
app.post('/api/academy2/surgeon/operate-course-blueprint', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        currentBlueprint = [],
        userCommand = '',
        targetLanguage = ''
    } = req.body;

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            '',
            '',
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n🌍 [Course Surgeon V2 - ${langProfile.nameAr} ${tierSpec.tierId}] تعديل هيكل الكورس (${courseTitle}) بناءً على: "${userCommand}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت **"كبير مهندسي المناهج الشاملة (Chief Course Blueprint Surgeon)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى **(${tierSpec.cefrLabel})**.

        - الكورس الحالي: "${courseTitle}"
        - الهيكل الحالي للوحدات والدروس:
        ${JSON.stringify(currentBlueprint)}

        🎯 **أمر المخرج (المستخدم) لتعديل هيكل الكورس:**
        "${userCommand}"

        🚨 **تعليمات التنفيذ الصارمة جداً (CRITICAL):**
        1. نفّذ أمر المخرج على مستوى الوحدات (إضافة وحدة جديدة، دمج وحدتين، إعادة ترتيب الوحدات، أو حذف وحدة طُلب حذفها).
        2. **حافظ حرفياً على عناوين الدروس الحالية ("title")** داخل الوحدات القديمة التي لم يُطلب حذفها، وضع لها \`"isNewLesson": false\`.
        3. لأي **وحدة جديدة** تضيفها (أو أي **درس جديد** تضيفه):
           - ضع للوحدة الجديدة ملخص بوصلة كامل في \`"unitDeepSummary"\` (\`unitSummary\`, \`whatYouLearn\`, \`whyItMatters\`).
           - ضع داخل الوحدة الجديدة من 4 إلى 5 دروس متسلسلة، وضع لكل درس جديد \`"isNewLesson": true\` مع توليد **محتوى تأسيسي وتفاعلي غني له** في حقل \`"content"\` (يشمل شرح القاعدة، معادلة ليغو \`[...] + [...] = [...]\`، جدول مفردات باللغة ${langProfile.nameAr} مع IPA والـ 🔵/🔴، سُلّم بناء \`### 🪜\`، وتمرين املأ الفراغ \`[[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]]\`) + \`"codeSnippet"\` (4 جمل صوتية مع IPA) حتى تكون الوحدة الجديدة جاهزة للدراسة فوراً دون دروس فارغة!

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "surgeonReport": "ملخص دقيق لما قمت به في هيكل الكورس والوحدات المضافة أو المعدلة...",
          "updatedBlueprint": [
            {
              "sectionName": "اسم الوحدة",
              "unitDeepSummary": {
                "unitSummary": "ملخص الوحدة...",
                "whatYouLearn": "ماذا ستتقن في هذه الوحدة...",
                "whyItMatters": "لماذا هذه الوحدة حاسمة..."
              },
              "lessons": [
                {
                  "title": "عنوان الدرس",
                  "description": "وصف الدرس",
                  "type": "video",
                  "isNewLesson": false,
                  "content": "إذا كان isNewLesson=true اكتب هنا شرح Markdown غني ومتكامل للدرس...",
                  "codeSnippet": "إذا كان isNewLesson=true اكتب هنا 4 جمل صوتية مع سطر 🔊 IPA: /.../ | المعنى: ..."
                }
              ]
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `نفذ أمر تعديل هيكل الكورس الآن بصيغة JSON: "${userCommand}"`,
            0.7,
            16000
        );
        const parsed = safeParseAIJson(rawContent);

        res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('❌ خطأ في جراحة الكورس:', error.message);
        res.status(500).json({ success: false, error: 'تعذر تعديل هيكل الكورس.' });
    }
});



// ============================================================================
// 💾 20. مسار المزامنة السحابية الشاملة للكورس (Master Cloud Sync)
// يحفظ (التعديلات، الحذف، الترتيب الجديد، الدروس الجديدة، وهيكل الشهادة) في MongoDB
// ============================================================================
app.post('/api/academy2/surgeon/sync-full-course', async (req, res) => {
    // 🌟 إضافة استقبال fullCourseSnapshot من الواجهة
    const { courseId, lessonsList, fullCourseSnapshot } = req.body;

    if (!courseId || !lessonsList || !Array.isArray(lessonsList)) {
        return res.status(400).json({ success: false, error: 'بيانات المزامنة غير صالحة.' });
    }

    try {
        console.log(`\n☁️ [Master Sync] جاري مزامنة وحفظ الكورس (${courseId}) بالكامل في قاعدة البيانات...`);

        // 1. استخراج الـ IDs الحقيقية للدروس الموجودة حالياً في الواجهة
        const incomingValidIds = lessonsList
            .filter(l => mongoose.Types.ObjectId.isValid(l._id))
            .map(l => l._id);

        // 2. 🧹 التنظيف: حذف الدروس المحذوفة من قاعدة البيانات
        if (mongoose.Types.ObjectId.isValid(courseId)) {
            const deleteResult = await mongoose.connection.collection('lessons').deleteMany({
                courseId: new mongoose.Types.ObjectId(courseId),
                _id: { $nin: incomingValidIds.map(id => new mongoose.Types.ObjectId(id)) }
            });
            console.log(`   🗑️ تم تنظيف ${deleteResult.deletedCount} دروس محذوفة من قاعدة البيانات.`);
        }

        // 3. 🔄 التحديث والإدراج للدروس المنفصلة
        let updatedCount = 0;
        let insertedCount = 0;

        for (let i = 0; i < lessonsList.length; i++) {
            const les = lessonsList[i];
            
            const lessonDataToSave = {
                title: les.title,
                description: les.description || '',
                section: les.section,
                order: les.order || (i + 1),
                sectionOrder: les.sectionOrder || 1,
                content: les.content || '',
                codeSnippet: les.codeSnippet || '',
                codeExplanation: les.codeExplanation || '',
                codingPractice: les.codingPractice || null,
                dailyQuest: les.dailyQuest || null,
                bossQuiz: les.bossQuiz || [],
                type: les.type || 'video',
                lessonCategory: les.lessonCategory || 'standard',
                hideMistakesWidget: les.hideMistakesWidget || false,
                hideLegoWidget: les.hideLegoWidget || false,
                hideLadderWidget: les.hideLadderWidget || false,
                hideSpeakClassWidget: les.hideSpeakClassWidget || false,
                hideCodingWidget: les.hideCodingWidget || false,
                hideQuestWidget: les.hideQuestWidget || false,
                customMistakeRows: les.customMistakeRows || null,
                customLegoEquations: les.customLegoEquations || null,
                customLadderSteps: les.customLadderSteps || null,
                customVoiceTitle: les.customVoiceTitle || null,
                updatedAt: new Date()
            };

            if (mongoose.Types.ObjectId.isValid(les._id)) {
                await mongoose.connection.collection('lessons').updateOne(
                    { _id: new mongoose.Types.ObjectId(les._id) },
                    { $set: lessonDataToSave }
                );
                updatedCount++;
            } 
            else if (mongoose.Types.ObjectId.isValid(courseId)) {
                lessonDataToSave.courseId = new mongoose.Types.ObjectId(courseId);
                lessonDataToSave.created_at = new Date();
                await mongoose.connection.collection('lessons').insertOne(lessonDataToSave);
                insertedCount++;
            }
        }

        // 🌟 4. التحديث الجذري: تحديث وثيقة الكورس الرئيسية (هيكل الشهادة / Blueprint)
        if (fullCourseSnapshot && mongoose.Types.ObjectId.isValid(courseId)) {
            const updateFields = {};
            if (fullCourseSnapshot.courses) updateFields.courses = fullCourseSnapshot.courses;
            if (fullCourseSnapshot.sections) updateFields.sections = fullCourseSnapshot.sections;
            if (fullCourseSnapshot.blueprint) updateFields.blueprint = fullCourseSnapshot.blueprint;
            if (fullCourseSnapshot.unitSummariesMap) updateFields.unitSummariesMap = fullCourseSnapshot.unitSummariesMap;

            if (Object.keys(updateFields).length > 0) {
                await mongoose.connection.collection('courses').updateOne(
                    { _id: new mongoose.Types.ObjectId(courseId) },
                    { $set: updateFields }
                );
                console.log(`   🏗️ تم تحديث الهيكل المعماري (Blueprint/Certificate) في مجموعة courses.`);
            }
        }

        console.log(`✅ [Master Sync] اكتملت المزامنة: (تم تحديث ${updatedCount}) | (تم إنشاء ${insertedCount}).`);
        res.json({ success: true, message: 'تمت المزامنة السحابية بنجاح!' });

    } catch (error) {
        console.error('❌ خطأ في المزامنة الشاملة للكورس:', error.message);
        res.status(500).json({ success: false, error: 'تعذر مزامنة الكورس مع قاعدة البيانات.' });
    }
});



// ============================================================================
// ✨ 18-B. مسار محرك الإلهام المجهري المترابط لتطوير شريحة من الدرس (Micro-Slice Inspiration V2)
// يقرأ الشريحة + الدرس + الوحدة + الكورس ويقترح 4 ترقيات عميقة ومفصلة جداً!
// ============================================================================
app.post('/api/academy2/surgeon/inspire-section', async (req, res) => {
    const {
        courseTitle = '',
        courseDescription = '',
        courseOrder = 1,
        sectionName = '',
        unitLessonsTitles = [],
        lessonTitle = '',
        lessonDescription = '',
        allBlocksHeadings = [],
        blockIndex = 0,
        prevBlockHeading = '',
        nextBlockHeading = '',
        sectionMarkdown = '',
        targetLanguage = ''
    } = req.body;

    if (!sectionMarkdown || !sectionMarkdown.trim()) {
        return res.status(400).json({ success: false, error: 'محتوى الشريحة مطلوب لتوليد الإلهام.' });
    }

    try {
        const tierSpec = getCEFRProgressionSpec(
            `${courseTitle} ${courseDescription}`,
            sectionName,
            lessonTitle,
            '',
            courseOrder,
            targetLanguage
        );
        const { langProfile } = tierSpec;

        console.log(`\n✨ [Contextual Block Inspiration V2 - ${langProfile.nameAr} ${tierSpec.tierId}] إلهام للشريحة (${blockIndex + 1}) في درس "${lessonTitle}"...`);

        const systemPrompt = `${langProfile.instituteRole}
        أنت الآن **"كبير مهندسي الإلهام التعليمي المجهري (Contextual Micro-Slice Inspiration Architect)"** للغة **${langProfile.nameAr} (${langProfile.nameEn})** في المستوى **(${tierSpec.cefrLabel})**.

        🔗 **الخريطة الهرمية الكاملة التي تنتمي إليها هذه الشريحة (يجب أن تتطابق أفكارك معها 100%):**
        1. **الكراش كورس:** "${courseTitle}" (${courseDescription.slice(0, 200)})
        2. **الوحدة الدراسية:** "${sectionName}" (دروس الوحدة: ${JSON.stringify(unitLessonsTitles)})
        3. **الدرس الحالي:** "${lessonTitle}" (${lessonDescription})
        4. **موقع الشريحة داخل الدرس:** هي الشريحة رقم (${blockIndex + 1} من ${allBlocksHeadings.length || 1})
           - الشريحة السابقة لها: "${prevBlockHeading || 'لا يوجد (هذه فاتحة الدرس)'}"
           - الشريحة التالية لها: "${nextBlockHeading || 'لا يوجد (هذه خاتمة الدرس)'}"

        📄 **النص الفعلي للشريحة المراد تطويرها:**
        """
        ${sectionMarkdown}
        """

        المطلوب منك قراءة كل كلمة ومثال في هذه الشريحة، وفهم موقعها في الدرس والوحدة، ثم توليد **4 أفكار إلهامية احترافية وغير تقليدية** ترفع قيمة هذه الشريحة 10 أضعاف وتجعلها نابضة بالحياة في الواجهة التفاعلية:
        - **الفكرة 1 (🧠 الهندسة البصرية ومعادلة الليغو / المخطط المقارن):** كيف نحول القاعدة المشروحة في هذه الشريحة إلى معادلة مكعبات ليغو \`[...] + [...] = [...]\` أو جدول مقارن ذكي مع إشارات صوتية؟
        - **الفكرة 2 (🔊 المختبر الصوتي ومحادثة الموقف الحي):** ما هي الأمثلة الصوتية الناطقة (بخط \`inline code\` ومقاطع IPA) أو الحوار المصغر (3-4 أسطر) الذي يجسد هذه الشريحة في موقف واقعي من صلب الوحدة ("${sectionName}")؟
        - **الفكرة 3 (🧩 التحدي التفاعلي الذكي الفوري):** تمرين "املأ الفراغ" من 3 إلى 4 جمل بصيغة \`[[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]]\` يختبر أدق تفصيلة وردت في هذه الشريحة تحديداً!
        - **الفكرة 4 (💎 رادار الأخطاء الشائعة وجسر الربط):** كشف الفخ الذي يقع فيه 90% من الطلاب في هذه الجزئية (❌ لا تقل ... ✅ بل قل ...) مع ربط ذكي يمهد للشريحة التالية ("${nextBlockHeading || 'التطبيق العملي'}").

        رد بصيغة JSON صالحة 100% فقط بهذا الهيكل الإلزامي:
        {
          "blockDiagnosis": "تشخيص هندسي عميق في سطرين يوضح نقاط القوة في هذه الشريحة وما ينقصها لتكتمل وتقود الطالب بسلاسة نحو (${nextBlockHeading || 'إتقان الدرس'})...",
          "superchargeCommand": "أمر جراحي شامل ومفصل يدمج: 1) معادلة ليغو بصرية أو جدول منظم، 2) أمثلة ناطقة باللغة ${langProfile.nameAr} بين علامات كود \`...\` مع نطقها، 3) تنبيه (❌ خطأ شائع مقابل ✅ صواب)، 4) تمرين املأ الفراغ من 3 جمل بصيغة [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] في نهاية الشريحة.",
          "inspirations": [
            {
              "id": "insp_visual_lego",
              "badge": "🧠 هندسة بصرية ومعادلة ليغو",
              "title": "عنوان محدد ومبتكر من صلب كلمات الشريحة...",
              "why": "لماذا ستجعل هذه الإضافة الطالب يستوعب القاعدة بصرياً فوراً؟",
              "whatItAdds": "معادلة [...] + [...] + جدول مقارن ناطق",
              "command": "الأمر الجراحي التفصيلي والدقيق (مع ذكر الأمثلة باللغة ${langProfile.nameAr}) لتنفيذ هذه الفكرة على الشريحة..."
            },
            {
              "id": "insp_audio_dialogue",
              "badge": "🔊 أمثلة ناطقة وحوار تطبيقي",
              "title": "عنوان محدد للإثراء الصوتي والحواري...",
              "why": "كيف يربط الشريحة بموضوع الوحدة (${sectionName}) ويدرب أذن الطالب؟",
              "whatItAdds": "أمثلة صوتية بـ IPA + حوار واقعي قصير ناطق",
              "command": "الأمر الجراحي التفصيلي لإضافة أمثلة ناطقة وحوار قصير باللغة ${langProfile.nameAr} مع الترجمة العربية وأسرار النطق..."
            },
            {
              "id": "insp_interactive_drill",
              "badge": "🧩 محطة املأ الفراغ التفاعلية",
              "title": "عنوان التمرين التفاعلي المخصص لهذه الشريحة...",
              "why": "يختبر استيعاب الطالب لما قرأه في هذه الشريحة قبل الانتقال للشريحة التالية.",
              "whatItAdds": "4 جمل تفاعلية بصيغة [[الصواب | خطأ1 | خطأ2]]",
              "command": "أضف في نهاية هذا القسم محطة تفاعلية بعنوان (#### 🧩 اختبر فهمك السريع لهذه القاعدة) تضم 4 جمل تطبيقية حول ما ورد في هذه الشريحة بصيغة [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] مع الترجمة العربية بين قوسين."
            },
            {
              "id": "insp_trap_bridge",
              "badge": "💎 كاشف الفخاخ وجسر الشريحة",
              "title": "عنوان التنبيه اللغوي وجسر الربط...",
              "why": "يحمي الطالب من الخطأ الكلاسيكي في هذه القاعدة ويمهد للشريحة القادمة.",
              "whatItAdds": "مقارنة (❌ خطأ شائع vs ✅ صواب أصيل) + 💡 السبب",
              "command": "الأمر الجراحي التفصيلي لإضافة صندوق كشف الأخطاء الشائعة (❌ و ✅ و 💡) في هذه الجزئية مع سطر تمهيدي يربطها بالقسم التالي..."
            }
          ]
        }`;

        const rawContent = await generateContentSmart(
            systemPrompt,
            `حلل الشريحة رقم (${blockIndex + 1}) من درس "${lessonTitle}" ضمن وحدة "${sectionName}" وولّد 4 إلهامات احترافية مترابطة بصيغة JSON.`,
            0.7,
            4500
        );

        const parsed = safeParseAIJson(rawContent);

        res.json({
            success: true,
            data: {
                blockDiagnosis: parsed.blockDiagnosis || 'شريحة تأسيسية ممتازة يمكن مضاعفة قوتها بمعادلة بصرية، أمثلة ناطقة، وتحدي املأ الفراغ.',
                superchargeCommand: parsed.superchargeCommand || 'طوّر هذا القسم بإضافة معادلة ليغو بصرية، وأمثلة ناطقة، وتنبيه للأخطاء الشائعة، وتمرين املأ الفراغ التفاعلي [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]] في نهايته.',
                inspirations: Array.isArray(parsed.inspirations) ? parsed.inspirations : []
            }
        });
    } catch (error) {
        console.error('❌ خطأ في مسار إلهام الشريحة (inspire-section):', error.message);
        res.status(500).json({ success: false, error: 'تعذر توليد الإلهام لهذه الشريحة حالياً.' });
    }
});





// ============================================================================
// 🌍 1. مسار توليد اختبار لغوي عميق وفق نظرية الاستجابة للمفردة (IRT) والطبقات الـ 4
// ============================================================================
app.post('/api/academy2/lang-exam/generate', async (req, res) => {
  const {
    targetLanguage = 'الإنجليزية',
    officialExamName = 'IELTS Academic / TOEFL iBT',
    finalBossTitle = ''
  } = req.body;

  try {
    const systemPrompt = `أنت كبير علماء القياس النفسي واللغوي (Chief Psychometrician) ومصمم اختبارات (${officialExamName}) و(EF SET / Duolingo DET).
قم بتوليد بنك اختبار تشخيصي ومحاكاة رسمية للغة (${targetLanguage}) يراعي:
1. تصميم المشتتات وفق نظرية (IRT Distractor Analysis):
   - خيار يصطاد طالب A2 (يحتوي على كلمات ذُكرت حرفياً في النص لكن بمعنى مضلل).
   - خيار يصطاد طالب B1/B2 (مرادف جزئي يتجاهل أداة نفي أو شرطاً زمنياً).
   - الجواب الصحيح لطالب C1/C2 يعتمد على إعادة الصياغة (Paraphrasing) والاستنتاج المبطن (Inference).
2. تضمين الطبقات الأربع التشخيصية (Register Shifting، Fossilized Errors & L1 Interference، وSpontaneous Stress/Boundary Roleplay).
3. تضمين مهمة "الزعيم الأخير" الخاصة بهذه اللغة: (${finalBossTitle}).

رد بصيغة JSON صالحة 100% فقط بنفس هيكل buildDeepPsychometricBank المعتمد.`;

    const raw = await generateContentSmart(
      systemPrompt,
      `ولّد اختباراً سيكومترياً متكاملاً للغة ${targetLanguage} بصيغة JSON.`,
      0.7,
      10000
    );
    const parsed = safeParseAIJson(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 🔬 2. مسار التشريح العميق للأداء عبر الأركان الـ 4 ونظرية اللغة البينية (Interlanguage Theory)
// ============================================================================
app.post('/api/academy2/lang-exam/evaluate', async (req, res) => {
  const {
    targetLanguage,
    officialExamName,
    listeningScore,
    readingScore,
    registerShifting,
    fossilizedResponses,
    stressTestResponse,
    boundaryRoleplayResponse,
    integratedSynthesisResponse,
    officialEssayResponse,
    officialSpeakingTranscript
  } = req.body;

  try {
    const systemPrompt = `أنت كبير المصححين الدوليين لاختبار (${officialExamName}) وخبير نظرية اللغة البينية (Interlanguage Theory) في اللغة (${targetLanguage}).
بيانات أداء الممتحن:
- الاستماع (Listening): ${listeningScore}% | القراءة (Reading): ${readingScore}%
- إجابات المرونة السياقية (Register Shifting): ${JSON.stringify(registerShifting)}
- إجابات الفخاخ المتحجرة (Fossilized Check): ${JSON.stringify(fossilizedResponses)}
- اختبار الضغط الارتجالي والحدود: "${stressTestResponse}" | "${boundaryRoleplayResponse}"
- مهام المحاكي الرسمي (Synthesis & Essay): "${integratedSynthesisResponse}" | "${officialEssayResponse}"
- نص المحادثة الشفوية: "${officialSpeakingTranscript}"

قم بتشريح الأداء بدقة عبر:
1. الأركان الأربعة (25% لكل ركن): إنجاز المهمة والترابط، الكثافة المعجمية والمتلازمات (Collocations & Nuance)، عمق التفرع النحوي (Branching & Passive)، والطلاقة والوصل الصوتي (Connected Speech & Chunking).
2. الفلاتر الثلاثة لتصنيف الأخطاء: زلات عابرة (Slips)، فجوات معرفية (Mistakes)، وأخطاء متحجرة وتداخل اللغة الأم (Fossilization & L1 Interference).
3. الترقية الفورية (Upgrading): خذ جملة فعلية كتبها الممتحن وأعد صياغتها بمستوى C2 Native مع شرح التغييرات الثلاثة.

رد بصيغة JSON صالحة 100% فقط بهذا الهيكل:
{
  "writingScore": 78,
  "speakingScore": 75,
  "overallCEFR": "B2",
  "fourPillarsRubric": [
    { "title": "1. إنجاز المهمة والترابط المنطقي (Task Achievement & Coherence - 25%)", "score": 80, "diagnosis": "..." },
    { "title": "2. الثروة والكثافة المعجمية (Lexical Resource & Collocations - 25%)", "score": 76, "diagnosis": "..." },
    { "title": "3. المدى والدقة النحوية وعمق التفرع (Syntactic Complexity & Branching - 25%)", "score": 78, "diagnosis": "..." },
    { "title": "4. الطلاقة والتحكم الصوتي الإيقاعي (Fluency, Connected Speech & Chunking - 25%)", "score": 75, "diagnosis": "..." }
  ],
  "errorTaxonomy": {
    "slips": ["..."],
    "mistakes": ["..."],
    "fossilizedAndL1": ["..."]
  },
  "upgradingComparison": {
    "studentOriginal": "...",
    "upgradedC2Native": "...",
    "whatChanged": "..."
  }
}`;

    const raw = await generateContentSmart(
      systemPrompt,
      `شرّح أداء الممتحن في اللغة ${targetLanguage} وأخرج التقرير بصيغة JSON.`,
      0.35,
      7000
    );
    const parsed = safeParseAIJson(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 خادم AutoFactory يعمل على ${PORT}`));