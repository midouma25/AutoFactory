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

// 1. الحل الجذري لمشكلة الخطوط (تسجيل العائلة والوزن بشكل صحيح)
try {
    registerFont('./Cairo-Bold.ttf', { family: 'Cairo', weight: 'bold' });
    registerFont('./Tajawal-Regular.ttf', { family: 'Tajawal', weight: 'normal' });
    console.log('✅ تم تحميل خطوط Cairo و Tajawal بنجاح تام.');
} catch (e) {
    console.warn("⚠️ تنبيه: تأكد من وجود ملفات الخطوط (Cairo-Bold.ttf و Tajawal-Regular.ttf).");
}

// دالة التفاف النص المحسنة
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

// ---------------------------------------------------------
// رسم الأيقونات الحصرية (قلب، تعليق، مشاركة، حفظ)
// ---------------------------------------------------------
function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 4, y);
    ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
    ctx.quadraticCurveTo(x + size / 2, y, x + (size * 3) / 4, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
    ctx.quadraticCurveTo(x + size, y + size / 2, x + (size * 3) / 4, y + (size * 3) / 4);
    ctx.lineTo(x + size / 2, y + size);
    ctx.lineTo(x + size / 4, y + (size * 3) / 4);
    ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
    ctx.fill();
}

function drawComment(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2 - 2, size / 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 4, y + size - 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x + size / 3, y + size);
    ctx.fill();
}

function drawPaperPlane(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.75, y + size);
    ctx.lineTo(x + size * 0.5, y + size * 0.6);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.25, y + size * 0.5);
    ctx.closePath();
    ctx.fill();
}

function drawBookmark(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width / 2, y + height - 8);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
}

// 🎨 المحرك البصري
async function generateAutoFactorySlide(slide, totalSlides, batchId) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // الخلفية
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width, 0, 100, width, 0, 800);
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 30; x < width; x += 40) {
        for (let y = 30; y < height; y += 40) {
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        }
    }

    // ==========================================
    // الشريحة 1: الخطاف (Hook)
    // ==========================================
    if (slide.type === 'hook') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        ctx.font = 'bold 95px "Cairo"'; // خط حصري عريض
        ctx.fillStyle = '#F8FAFC';
        wrapText(ctx, slide.title, width / 2, height / 2 - 80, 900, 130);

        ctx.font = '40px "Tajawal"'; // خط حصري ناعم
        ctx.fillStyle = '#3B82F6';
        ctx.fillText("اسحب لتعرف السر 👈", width / 2, height - 160);
    } 
    
    // ==========================================
    // الشرائح 2,3,4: المحتوى
    // ==========================================
    else if (slide.type === 'content') {
        // الرقم العملاق في الخلفية (لمسة احترافية)
        ctx.save();
        ctx.font = 'bold 250px "Cairo"';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.textAlign = 'left';
        ctx.direction = 'ltr';
        ctx.fillText(`0${slide.slideNumber}`, 40, 250);
        ctx.restore();

        // 💡 حل مشكلة الأرقام المعكوسة (02 / 05)
        ctx.save();
        ctx.direction = 'ltr'; 
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundedRect(ctx, 80, 70, 120, 50, 25);
        ctx.fill();
        ctx.font = 'bold 22px "Cairo"';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`0${slide.slideNumber} / 0${totalSlides}`, 103, 103);
        ctx.restore();

        ctx.font = 'bold 28px "Cairo"';
        ctx.fillStyle = '#3B82F6';
        ctx.textAlign = 'right';
        ctx.fillText('AutoFactory ⚡', width - 80, 105);

        // النصوص
        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.font = 'bold 72px "Cairo"';
        ctx.fillStyle = '#F8FAFC';
        const titleY = wrapText(ctx, slide.title, width - 80, 240, 850, 90);

        ctx.font = '40px "Tajawal"';
        ctx.fillStyle = '#CBD5E1';
        const bodyY = wrapText(ctx, slide.content, width - 80, titleY + 70, 850, 60);

        // نافذة الكود
        const cardY = bodyY + 70;
        const cardHeight = height - cardY - 90;
        ctx.fillStyle = '#1E1E1E';
        drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 20);
        ctx.fill();

        const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
        dotColors.forEach((color, i) => {
            ctx.beginPath(); ctx.arc(115 + (i * 32), cardY + 28, 7, 0, Math.PI * 2);
            ctx.fillStyle = color; ctx.fill();
        });

        if (slide.codeSnippet) {
            ctx.save();
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
            ctx.font = '30px "Consolas", monospace';
            const lines = slide.codeSnippet.split('\n');
            let codeY = cardY + 100;

            lines.forEach(line => {
                if (line.trim().startsWith('#')) {
                    ctx.fillStyle = '#6A9955';
                } else if (/\b(print|def|for|in|return|if|else|elif|import)\b/.test(line)) {
                    ctx.fillStyle = '#569CD6';
                } else {
                    ctx.fillStyle = '#D4D4D4';
                }
                ctx.fillText(line, 120, codeY);
                codeY += 45;
            });
            ctx.restore();
        }
    }

    // ==========================================
    // الشريحة 5: الختام (التصميم الاحترافي المحدث)
    // ==========================================
    else if (slide.type === 'cta') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

        // صورتك واسمك
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = 'bold 50px "Cairo"';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText("غربي محمد الشريف", width / 2, 460);

        ctx.font = '35px "Tajawal"';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText("مهندس برمجيات ومطور أتمتة", width / 2, 520);

        // العنوان والسؤال المحفز (تصغير الخط لتجنب القص)
        ctx.font = 'bold 75px "Cairo"';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(slide.title, width / 2, 700);

        ctx.font = '40px "Tajawal"';
        ctx.fillStyle = '#60A5FA';
        // مساحة آمنة 900px لمنع خروج النص من الشاشة
        wrapText(ctx, slide.content, width / 2, 780, 900, 55); 

        // 💡 أزرار التفاعل الجديدة (أيقونة فوق، نص تحت)
        const btnY = 950;
        const btnWidth = 180;
        const btnHeight = 150;
        const gap = 30;
        const startX = (width - (4 * btnWidth + 3 * gap)) / 2;

        const actions = [
            { label: 'إعجاب', icon: 'heart', isPrimary: false },
            { label: 'رأيك', icon: 'comment', isPrimary: false },
            { label: 'شارك', icon: 'share', isPrimary: false },
            { label: 'احفظ', icon: 'save', isPrimary: true }
        ];

        actions.forEach((act, idx) => {
            const bx = startX + idx * (btnWidth + gap);
            
            // خلفية الزر
            ctx.fillStyle = act.isPrimary ? '#2563EB' : 'rgba(30, 41, 59, 0.8)';
            drawRoundedRect(ctx, bx, btnY, btnWidth, btnHeight, 20);
            ctx.fill();

            if (!act.isPrimary) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const iconColor = act.isPrimary ? '#FFFFFF' : '#94A3B8';
            const iconX = bx + btnWidth / 2;
            
            // رسم الأيقونات المتجهة بدقة أعلى النص
            ctx.fillStyle = iconColor;
            if (act.icon === 'heart') drawHeart(ctx, iconX - 18, btnY + 30, 36);
            if (act.icon === 'comment') drawComment(ctx, iconX - 18, btnY + 30, 36);
            if (act.icon === 'share') drawPaperPlane(ctx, iconX - 16, btnY + 30, 36);
            if (act.icon === 'save') drawBookmark(ctx, iconX - 14, btnY + 28, 28, 38);

            // النص أسفل الأيقونة
            ctx.font = 'bold 28px "Cairo"';
            ctx.fillStyle = act.isPrimary ? '#FFFFFF' : '#CBD5E1';
            ctx.fillText(act.label, iconX, btnY + 115);
        });
    }

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
        أنت صانع محتوى برمجي مشهور على إنستغرام، أسلوبك يشبه تماماً أسلوب تبسيط رياضيات التعليم المتوسط: تستخدم قصصاً مرحة، شخصيات خيالية، وقياسات من الحياة اليومية لشرح البرمجة.
        
        مهم جداً: كن مختصراً جداً جداً في الشرح لتوفير الكلمات.
        قسم الدرس إلى 5 شرائح بالضبط:
        - الشريحة 1 (type: "hook"): عنوان جذاب ومثير للفضول فقط. لا يوجد كود.
        - الشرائح 2, 3, 4 (type: "content"): عنوان + مثال هزلي من سطر واحد فقط + كود بايثون قصير.
        - الشريحة 5 (type: "cta"): شريحة الختام. عنوانها "احفظ المنشور لتعود إليه"، والمحتوى يحفز على التعليق بسؤال لا يتجاوز 8 كلمات.

        ⚠️ تنبيه أمني (لحماية JSON):
        داخل حقل "codeSnippet"، يُمنع استخدام علامات التنصيص المزدوجة ("). استخدم الفردية (') فقط.

        رد بصيغة JSON حصراً بهذا الشكل:
        {
          "caption": "...",
          "slides": [
            { "slideNumber": 1, "type": "hook", "title": "...", "content": "" },
            { "slideNumber": 2, "type": "content", "title": "...", "content": "قصة...", "codeSnippet": "..." }
          ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
            model: 'qwen/qwen3.8-27b', 
            temperature: 0.8,
            max_tokens: 900,
            response_format: { type: 'json_object' }
        });

        const lessonData = JSON.parse(chatCompletion.choices[0].message.content);
        const batchId = Date.now(); 
        const generatedImages = [];

        for (const slide of lessonData.slides) {
            const fileName = await generateAutoFactorySlide(slide, lessonData.slides.length, batchId);
            generatedImages.push(fileName);
        }

        res.json({ success: true, caption: lessonData.caption, slides: lessonData.slides, images: generatedImages });

    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء المعالجة.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 خادم AutoFactory يعمل على ${PORT}`));