require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

try {
    registerFont('./Cairo-Bold.ttf', { family: 'Cairo' });
    console.log('✅ تم تحميل خط Cairo بنجاح.');
} catch (e) {
    console.warn("⚠️ تنبيه: لم يتم العثور على ملف الخط (Cairo-Bold.ttf).");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return y;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}

// 🎨 تحديث دالة الرسم لتشمل نافذة VS Code
function generateAutoFactorySlide(slideNumber, totalSlides, title, bodyText, codeSnippet, batchId) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // الخلفية العامة
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width, 0, 100, width, 0, 800);
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 30; x < width; x += 40) {
        for (let y = 30; y < height; y += 40) {
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        }
    }

    // الهيدر
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    drawRoundedRect(ctx, 80, 80, 140, 50, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '24px "Cairo", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText(`${slideNumber} of ${totalSlides}`, 150, 113);

    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillStyle = '#3B82F6';
    ctx.textAlign = 'right';
    ctx.fillText('AutoFactory ⚡', width - 80, 115);

    // النصوص العربية
    ctx.direction = 'rtl';
    ctx.font = 'bold 80px "Cairo", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    const titleY = wrapText(ctx, title, width - 80, 260, 800, 100);

    const gradientLine = ctx.createLinearGradient(width - 80, titleY + 30, width - 280, titleY + 30);
    gradientLine.addColorStop(0, '#3B82F6');
    gradientLine.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = gradientLine;
    drawRoundedRect(ctx, width - 280, titleY + 30, 200, 6, 3);
    ctx.fill();

    ctx.font = '42px "Cairo", sans-serif';
    ctx.fillStyle = '#94A3B8';
    const bodyY = wrapText(ctx, bodyText, width - 80, titleY + 120, 850, 70);

    // ==========================================
    // 💻 رسم نافذة VS Code
    // ==========================================
    const cardY = bodyY + 100;
    const cardHeight = 420;
    
    // خلفية النافذة (Dark Theme)
    ctx.fillStyle = '#1E1E1E';
    drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 20);
    ctx.fill();

    // رسم الأزرار الثلاثة (أحمر، أصفر، أخضر)
    const dotY = cardY + 25;
    const colors = ['#FF5F56', '#FFBD2E', '#27C93F']; 
    // ملاحظة: الأزرار ترسم من اليسار لليمين
    colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.arc(110 + (i * 35), dotY, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });

    // خط فاصل علوي للنافذة
    ctx.fillStyle = '#333333';
    ctx.fillRect(80, cardY + 50, width - 160, 2);

    // طباعة الكود البرمجي (إن وُجد)
    if (codeSnippet && codeSnippet !== "") {
        ctx.direction = 'ltr'; // إجبار الكتابة من اليسار لليمين للكود
        ctx.textAlign = 'left';
        // استخدام خط برمجي افتراضي
        ctx.font = '32px "Consolas", "Courier New", monospace'; 
        ctx.fillStyle = '#D4D4D4'; // اللون الرمادي الفاتح المألوف للمبرمجين

        const lines = codeSnippet.split('\n');
        let codeY = cardY + 110;
        
        lines.forEach(line => {
            // إضافة لمسة جمالية: تلوين التعليقات باللون الأخضر إذا كان السطر يبدأ بـ #
            if(line.trim().startsWith('#')) {
                ctx.fillStyle = '#6A9955'; // أخضر التعليقات في VS Code
            } else {
                ctx.fillStyle = '#D4D4D4'; // اللون العادي
            }
            
            ctx.fillText(line, 120, codeY);
            codeY += 45; // المسافة بين السطور
        });
    }

    const fileName = `post_${batchId}_slide_${slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, fileName), buffer);
    return fileName;
}

// ==========================================
// 4. الرابط الرئيسي (API Endpoint)
// ==========================================
app.post('/api/generate-lesson', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'الرجاء تقديم وصف للدرس.' });

    try {
        console.log(`\n⏳ 1. جاري إرسال الطلب إلى Groq لتأليف الدرس...`);

        // 🧠 تحديث الـ Prompt ليجبر النموذج على كتابة كود برمجي لكل شريحة
        const systemPrompt = `
        أنت صانع محتوى تعليمي برمجي احترافي لإنستغرام.
        مهمتك: تقسيم الموضوع البرمجي الذي يطلبه المستخدم إلى 5 شرائح متسلسلة.
        لكل شريحة، يجب أن تكتب عنواناً، شرحاً قصيراً جداً، و "كود برمجي" (Code Snippet) يوضح الفكرة.
        
        يجب أن ترد *فقط* بصيغة JSON صالحة بهذا الشكل الدقيق:
        {
          "caption": "وصف جذاب للمنشور مع هاشتاجات",
          "slides": [
            { 
              "slideNumber": 1, 
              "title": "عنوان جذاب", 
              "content": "شرح الفكرة باختصار (سطرين كحد أقصى)",
              "codeSnippet": "print('Hello World!')\\n# هذا تعليق برمجي"
            }
          ]
        }
        ملاحظة: حقل codeSnippet يجب أن يحتوي على كود حقيقي وقابل للتشغيل. استخدم \\n لكسر الأسطر داخل الكود.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: 'qwen/qwen3.8-27b', // النموذج المستقر
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const lessonData = JSON.parse(chatCompletion.choices[0].message.content);
        console.log('✅ 2. تم تأليف الدرس بنجاح! جاري إرساله للمطبعة الرقمية...');

        const batchId = Date.now(); 
        const generatedImages = [];
        const totalSlides = lessonData.slides.length;

        for (const slide of lessonData.slides) {
            const fileName = generateAutoFactorySlide(
                slide.slideNumber, 
                totalSlides, 
                slide.title, 
                slide.content, 
                slide.codeSnippet, // تمرير الكود البرمجي الجديد للمطبعة
                batchId
            );
            generatedImages.push(fileName);
            console.log(`🖼️ تمت طباعة: ${fileName}`);
        }

        console.log('🎉 3. اكتملت العملية بالكامل!');

        res.json({
            success: true,
            caption: lessonData.caption,
            slides: lessonData.slides,
            images: generatedImages
        });

    } catch (error) {
        console.error('❌ خطأ في النظام:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء معالجة البيانات.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 خادم AutoFactory الذكي يعمل على المنفذ ${PORT}`);
});