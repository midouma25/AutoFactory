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
const drawTerminalSlide = require('./templates/terminal');
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
    console.log('✅ تم اختراق نظام الخطوط وتحميلها بنجاح قاطع!');
} catch (error) {
    console.log('⚠️ تحذير: فشل تحميل الخطوط. تأكد من أسماء الملفات.');
}

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
           - العنوان (title): يجب أن يكون صادماً، يلعب على الفضول (5-7 كلمات).
           - الوصف (explanation): جملة تشويقية سيكولوجية تدفع المتابع للسحب فوراً (12 كلمة كحد أقصى).
        
        2. شرائح الخطوات (step) (باقي الشرائح في الوسط):
           - اسم الأداة (toolName): 🚨 حرج جداً 🚨 يجب أن يكون "كلمة واحدة فقط" وبدون فلسفة (اكتب React وليس React.js / اكتب Node وليس Node+Express).
           - الوصف (explanation): لا تعطني تعريفاً مملاً! أعطني "الزبدة والفائدة العملية" في جملة واحدة قوية (15 كلمة كحد أقصى).
           - الدومين (toolDomain): استخرج الدومين الرسمي للأداة لنجلب اللوجو (مثال: react.dev).

        3. شريحة الختام (cta) (الشريحة الأخيرة دائماً): 
           - يجب أن تكون الشريحة الأخيرة دائماً وأساساً من نوع "cta".
        
        4. تأكد بنسبة 1000% أن الرد هو JSON صالح (Valid JSON) تماماً.
        
        رد بصيغة JSON فقط بهذا الهيكل الدقيق:
        {
          "caption": "اكتب كابشن تسويقي جذاب جداً، يبدأ بسؤال قوي، يليه شرح بسيط، وينتهي بطلب التعليق (CTA) مع 5 هاشتاجات قوية.",
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
            // ... (أضف هنا العدد الذي تحتاجه من الشرائح الوسطى بناءً على عمق الموضوع: 3، 4، 5، 6، 7، 8، 9...)
            {
              "slideNumber": 99, // (اكتب هنا الرقم التسلسلي الأخير الفعلي)
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
        
        // إرسال البيانات للواجهة: نرسل الـ caption والـ magicPrompt مع الصور
        res.json({ 
            success: true, 
            caption: roadmapData.caption, 
            magicPrompt: magicPrompt, // 👈 تمرير البرومبت السحري للواجهة
            images: generatedImages // 👈 الهيكل الجديد للصور (كائن يحتوي على مصفوفتين)
        });

    } catch (error) {
        console.error('❌ خطأ في توليد خريطة الطريق:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 خادم AutoFactory يعمل على ${PORT}`));