const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

// تسجيل الخط (تأكد من وجود الملف في المجلد!)
try {
    registerFont('./Cairo-Bold.ttf', { family: 'Cairo' });
} catch (e) {
    console.warn("⚠️ تنبيه: لم يتم العثور على ملف الخط. التصميم سيفقد 50% من جماليته.");
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

async function generateAutoFactorySlide(slideNumber, totalSlides, title, bodyText) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // ----------------------------------------------------
    // 1. الخلفية الداكنة (Dark Mode)
    // ----------------------------------------------------
    ctx.fillStyle = '#0F172A'; // لون كحلي داكن جداً (Slate 900)
    ctx.fillRect(0, 0, width, height);

    // إضافة تدرج لوني خفيف (Glow) في الزاوية
    const glow = ctx.createRadialGradient(width, 0, 100, width, 0, 800);
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.15)'); // أزرق مضيء
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 2. شبكة النقط البرمجية (Dot Matrix)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 30; x < width; x += 40) {
        for (let y = 30; y < height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ----------------------------------------------------
    // 3. الهيدر (شريط التقدم وهوية المصنع)
    // ----------------------------------------------------
    // كبسولة رقم الشريحة (Pill)
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

    // اسم النظام أعلى اليمين
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillStyle = '#3B82F6'; // أزرق تقني
    ctx.textAlign = 'right';
    ctx.fillText('AutoFactory ⚡', width - 80, 115);

    // ----------------------------------------------------
    // 4. النصوص (مريحة، بيضاء، وواضحة)
    // ----------------------------------------------------
    ctx.direction = 'rtl';
    
    // العنوان
    ctx.font = 'bold 80px "Cairo", sans-serif';
    ctx.fillStyle = '#F8FAFC'; // أبيض ساطع
    const titleY = wrapText(ctx, title, width - 80, 260, 800, 100);

    // الخط الفاصل التجميلي تحت العنوان
    const gradientLine = ctx.createLinearGradient(width - 80, titleY + 30, width - 280, titleY + 30);
    gradientLine.addColorStop(0, '#3B82F6');
    gradientLine.addColorStop(1, '#8B5CF6'); // بنفسجي
    ctx.fillStyle = gradientLine;
    drawRoundedRect(ctx, width - 280, titleY + 30, 200, 6, 3);
    ctx.fill();

    // المحتوى
    ctx.font = '42px "Cairo", sans-serif';
    ctx.fillStyle = '#94A3B8'; // رمادي فاتح
    const bodyY = wrapText(ctx, bodyText, width - 80, titleY + 120, 850, 70);

    // ----------------------------------------------------
    // 5. بطاقة الزجاج (Glassmorphism Card)
    // ----------------------------------------------------
    const cardY = bodyY + 120;
    const cardHeight = 450;
    
    // خلفية البطاقة شبه شفافة
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)'; // لون داكن شفاف
    drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 40);
    ctx.fill();

    // إطار مضيء خفيف يعطي إحساس الزجاج
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // محتوى البطاقة (وهمي حالياً)
    ctx.font = 'bold 50px "Cairo", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.fillText("</ Code Snippet Or UI goes here >", width / 2, cardY + 220);

    // ----------------------------------------------------
    // حفظ الصورة
    // ----------------------------------------------------
    const buffer = canvas.toBuffer('image/png');
    const fileName = `autofactory_slide_${slideNumber}.png`;
    fs.writeFileSync(fileName, buffer);
    console.log(`✅ تمت طباعة هوية AutoFactory: ${fileName}`);
}

// تشغيل الاختبار
generateAutoFactorySlide(
    1, 
    5, 
    "أتمتة إنستغرام بـ Node.js", 
    "تعلم كيف تبني خادماً برمجياً يولد المحتوى بالذكاء الاصطناعي، ويقوم بنشره تلقائياً دون أي تدخل بشري باستخدام Graph API."
);