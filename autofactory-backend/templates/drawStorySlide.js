const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

// 🧬 الجين البصري الثابت (للحفاظ على شكل الشخصية والأسلوب في كل الصور)
const MASTER_CHARACTER = "anime style illustration of a 22-year-old male developer, curly dark hair, wearing a plain black t-shirt, highly detailed, vivid colors, modern office night lighting, cinematic";

async function fetchImage(prompt, isLandscape = true) {
    const fullPrompt = `${MASTER_CHARACTER}, ${prompt}`;
    const width = isLandscape ? 1080 : 1080;
    const height = isLandscape ? 675 : 1350; // 675 هو نصف الـ 1350
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&nologo=true`;
    
    console.log(`🎨 جاري توليد مشهد: ${prompt}`);
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return await loadImage(response.data);
    } catch (error) {
        console.error("⚠️ فشل توليد الصورة:", error.message);
        return null;
    }
}

// دالة لرسم الصندوق الأبيض ذو الحواف الدائرية
function drawRoundedBox(ctx, x, y, width, height, radius, bgColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = 'transparent'; // إعادة تعيين الظل
}

// دالة مركزية لرسم النص داخل الصندوق
function drawQuoteBubble(ctx, text, yCenter, width) {
    ctx.font = '70px "CairoBoldHack"';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 80;
    const paddingY = 40;
    const boxWidth = textWidth + paddingX;
    const boxHeight = 110;
    
    const x = (width - boxWidth) / 2;
    const y = yCenter - (boxHeight / 2);

    drawRoundedBox(ctx, x, y, boxWidth, boxHeight, 30, '#FFFFFF');
    
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, yCenter + 10);
}

async function drawStorySlide(slide, batchId) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (slide.type === 'split') {
        // 1. جلب الصورتين (العلوية والسفلية)
        const topImage = await fetchImage(slide.topScene, true);
        const bottomImage = await fetchImage(slide.bottomScene, true);

        // 2. رسم الصورتين وتقسيم الشاشة
        if (topImage) ctx.drawImage(topImage, 0, 0, width, height / 2);
        if (bottomImage) ctx.drawImage(bottomImage, 0, height / 2, width, height / 2);

        // 3. رسم خط فاصل داكن في المنتصف لإبراز العزل
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, (height / 2) - 3, width, 6);

        // 4. رسم فقاعات النصوص
        if (slide.topQuote) drawQuoteBubble(ctx, slide.topQuote, 450, width);
        if (slide.bottomQuote) drawQuoteBubble(ctx, slide.bottomQuote, 1125, width);

    } else if (slide.type === 'cta') {
        // 1. جلب صورة طولية كاملة للشريحة الأخيرة
        const heroImage = await fetchImage(slide.heroScene, false);
        if (heroImage) ctx.drawImage(heroImage, 0, 0, width, height);

        // 2. إضافة طبقة تعتيم متدرجة للأسفل لضمان وضوح النصوص
        const grad = ctx.createLinearGradient(0, height / 2, 0, height);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 3. رسم عناصر الـ CTA (بنفس نمط الصورة المرجعية)
        // الصندوق الأول (العلوي الأبيض)
        drawRoundedBox(ctx, (width - 600)/2, 850, 600, 100, 30, '#FFFFFF');
        ctx.font = '60px "CairoBoldHack"'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
        ctx.fillText(slide.ctaText1, width/2, 915);

        // الصندوق الثاني (الأوسط الملون البارز)
        drawRoundedBox(ctx, (width - 900)/2, 980, 900, 120, 30, '#D9F99D'); // لون أخضر ليموني
        ctx.font = '75px "CairoBoldHack"'; ctx.fillStyle = '#000000';
        ctx.fillText(slide.ctaText2, width/2, 1060);

        // الصندوق الثالث (السفلي الأزرق مع أيقونة النار)
        drawRoundedBox(ctx, (width - 800)/2, 1130, 800, 100, 30, '#3B82F6'); // لون أزرق ساطع
        ctx.font = '50px "CairoBoldHack"'; ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`🔥 ${slide.ctaText3}`, width/2, 1195);
    }

    const fileName = `story_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawStorySlide;