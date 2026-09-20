const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

try {
    registerFont(path.join(__dirname, '../Cairo-Bold.ttf'), { family: 'CairoBoldHack' });
    registerFont(path.join(__dirname, '../Cairo-Regular.ttf'), { family: 'CairoRegularHack' });
} catch (error) {}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        currentY += lineHeight;
    }
    return currentY;
}

function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, shadow = true) {
    if (shadow) {
        ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
        ctx.shadowBlur = 40;
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
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function drawCheckmark(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 5, y + 20); ctx.lineTo(x + 30, y - 25);
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}

function drawCross(ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 20, y - 20); ctx.lineTo(x + 20, y + 20);
    ctx.moveTo(x + 20, y - 20); ctx.lineTo(x - 20, y + 20);
    ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
}

// ⬅️ دالة رسم السهم
function drawArrowLeft(ctx, x, y) {
    ctx.beginPath(); 
    ctx.moveTo(x, y); 
    ctx.lineTo(x + 20, y - 12); 
    ctx.lineTo(x + 20, y - 4);
    ctx.lineTo(x + 50, y - 4); 
    ctx.lineTo(x + 50, y + 4); 
    ctx.lineTo(x + 20, y + 4);
    ctx.lineTo(x + 20, y + 12); 
    ctx.closePath();
    ctx.fillStyle = '#0F172A'; 
    ctx.fill();
}

function drawCircuitLines(ctx, width, height) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 2;
    
    ctx.beginPath(); ctx.moveTo(0, height - 200); ctx.lineTo(150, height - 200); ctx.lineTo(250, height - 300); ctx.stroke();
    ctx.beginPath(); ctx.arc(150, height - 200, 5, 0, Math.PI*2); ctx.stroke();
    
    ctx.beginPath(); ctx.moveTo(0, height - 250); ctx.lineTo(100, height - 250); ctx.lineTo(200, height - 350); ctx.stroke();
    ctx.beginPath(); ctx.arc(100, height - 250, 5, 0, Math.PI*2); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(width - 200, 0); ctx.lineTo(width - 200, 150); ctx.lineTo(width - 300, 250); ctx.stroke();
    ctx.beginPath(); ctx.arc(width - 200, 150, 5, 0, Math.PI*2); ctx.stroke();
}

async function drawToolBox(ctx, x, y, size, toolName, isGood) {
    // 1. رسم المربع الأساسي
    drawRoundedRect(ctx, x, y, size, size, 35, '#FFFFFF', true);
    
    // إطار المربع (أخضر أو أحمر)
    ctx.strokeStyle = isGood ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 2. محرك البحث عن الشعارات (Double-Engine)
    let cleanName = toolName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let domain = `${cleanName}.com`; // الافتراضي
    
// 🌐 القاموس الشامل والعملاق لأدوات التقنية والذكاء الاصطناعي (تحديث 2026)
    const domainMap = {
        // 🤖 نماذج اللغة والدردشة (LLMs & Chatbots)
        'chatgpt': 'openai.com', 'gpt': 'openai.com', 'openai': 'openai.com', 'sora': 'openai.com', 'dalle': 'openai.com',
        'claude': 'anthropic.com', 'anthropic': 'anthropic.com',
        'gemini': 'google.com', 'bard': 'google.com', 'google': 'google.com',
        'copilot': 'microsoft.com', 'bing': 'microsoft.com',
        'perplexity': 'perplexity.ai',
        'grok': 'x.ai', 'xai': 'x.ai',
        'mistral': 'mistral.ai',
        'huggingface': 'huggingface.co',
        'meta': 'meta.com', 'llama': 'meta.com',
        'character': 'character.ai', 'pi': 'inflection.ai',
        'groq': 'groq.com', 'cohere': 'cohere.com',

        // 💻 البرمجة وهندسة البرمجيات (Coding & Dev AI)
        'cursor': 'cursor.com', 'devin': 'cognition.ai', 'replit': 'replit.com',
        'github': 'github.com', 'gitlab': 'gitlab.com', 'bitbucket': 'bitbucket.org',
        'v0': 'v0.dev', 'vercel': 'vercel.com', 'bolt': 'bolt.new', 'lovable': 'lovable.dev',
        'tabnine': 'tabnine.com', 'codeium': 'codeium.com', 'pythagora': 'pythagora.ai',
        'sweep': 'sweep.dev', 'cline': 'cline.bot', 'stackblitz': 'stackblitz.com',
        'vscode': 'visualstudio.com', 'intellij': 'jetbrains.com',

        // 🎨 توليد الصور والتصميم (Image & Design)
        'midjourney': 'midjourney.com', 
        'leonardo': 'leonardo.ai', 'ideogram': 'ideogram.ai',
        'canva': 'canva.com', 'figma': 'figma.com', 'framer': 'framer.com',
        'adobe': 'adobe.com', 'photoshop': 'adobe.com', 'illustrator': 'adobe.com',
        'remove': 'remove.bg', 'photoroom': 'photoroom.com', 'spline': 'spline.design',
        'webflow': 'webflow.com', 'gamma': 'gamma.app',

        // 🎬 الفيديو والمونتاج (Video & Animation)
        'runway': 'runwayml.com', 'pika': 'pika.art', 'luma': 'lumalabs.ai',
        'kling': 'klingai.com', 'haiper': 'haiper.ai',
        'synthesia': 'synthesia.io', 'heygen': 'heygen.com', 'did': 'd-id.com',
        'capcut': 'capcut.com', 'premiere': 'adobe.com', 'aftereffects': 'adobe.com',
        'descript': 'descript.com', 'invideo': 'invideo.io', 'opus': 'opus.pro',

        // 🎵 الصوت والتعليق الصوتي (Audio & Voice)
        'elevenlabs': 'elevenlabs.io', 'suno': 'suno.com', 'udio': 'udio.com',
        'murf': 'murf.ai', 'playht': 'play.ht', 'speechify': 'speechify.com',

        // 🚀 الإنتاجية وإدارة المشاريع (Productivity & Workspaces)
        'notion': 'notion.so', 'obsidian': 'obsidian.md', 'evernote': 'evernote.com',
        'linear': 'linear.app', 'asana': 'asana.com', 'trello': 'trello.com',
        'monday': 'monday.com', 'clickup': 'clickup.com', 'jira': 'atlassian.com',
        'slack': 'slack.com', 'teams': 'microsoft.com', 'zoom': 'zoom.us',
        'superhuman': 'superhuman.com', 'gmail': 'gmail.com', 'outlook': 'microsoft.com',
        'motion': 'usemotion.com', 'reclaim': 'reclaim.ai', 'todoist': 'todoist.com',

        // 📈 البيانات والتحليل (Data & Analytics)
        'julius': 'julius.ai', 'tableau': 'tableau.com', 'powerbi': 'microsoft.com',
        'excel': 'microsoft.com', 'sheets': 'google.com',
        'akkio': 'akkio.com', 'snowflake': 'snowflake.com', 'databricks': 'databricks.com',

        // ⚙️ الأتمتة والوكلاء (Automation & Agents)
        'zapier': 'zapier.com', 'make': 'make.com', 'n8n': 'n8n.io',
        'langchain': 'langchain.com', 'langgraph': 'langchain.com', 'llamaindex': 'llamaindex.ai',
        'autogpt': 'agpt.co', 'manus': 'manus.im',

        // 📚 التعليم والأكاديميا (Education & Research)
        'khan': 'khanacademy.org', 'coursera': 'coursera.org', 'udemy': 'udemy.com',
        'codecademy': 'codecademy.com', 'w3schools': 'w3schools.com', 'freecodecamp': 'freecodecamp.org',
        'duolingo': 'duolingo.com', 'speak': 'speak.com', 'babbel': 'babbel.com',
        'notebooklm': 'google.com', 'scholar': 'google.com', 'researchgate': 'researchgate.net',
        'quizlet': 'quizlet.com', 'brainly': 'brainly.com',

        // 💰 المال والتداول (Finance & Trading)
        'bloomberg': 'bloomberg.com', 'tradingview': 'tradingview.com',
        'robinhood': 'robinhood.com', 'binance': 'binance.com', 'coinbase': 'coinbase.com',

        // 🏋️ الصحة والرياضة (Health & Fitness)
        'myfitnesspal': 'myfitnesspal.com', 'strava': 'strava.com', 'fitbod': 'fitbod.me',
        'apple': 'apple.com', 'oura': 'ouraring.com', 'whoop': 'whoop.com',

        // 📝 التسويق وكتابة المحتوى (Marketing & SEO)
        'jasper': 'jasper.ai', 'copyai': 'copy.ai', 'writesonic': 'writesonic.com',
        'surfer': 'surferseo.com', 'ahrefs': 'ahrefs.com', 'semrush': 'semrush.com',
        'sprout': 'sproutsocial.com', 'hootsuite': 'hootsuite.com', 'buffer': 'buffer.com',
        'hubspot': 'hubspot.com', 'mailchimp': 'mailchimp.com',

        // 🌐 ترجمة وتدقيق لغوي (Translation & Writing)
        'deepl': 'deepl.com', 'grammarly': 'grammarly.com', 'quillbot': 'quillbot.com'
    };
    
    // البحث في الخريطة وتصحيح الدومين
    for (const [key, val] of Object.entries(domainMap)) {
        if (cleanName.includes(key)) domain = val;
    }

    let logoLoaded = false;

    // المحاولة 1: جلب الشعار عالي الدقة من Clearbit
    try {
        const logoUrl = `https://logo.clearbit.com/${domain}`;
        const logo = await loadImage(logoUrl);
        const logoSize = 110;
        ctx.drawImage(logo, x + (size - logoSize) / 2, y + 40, logoSize, logoSize);
        logoLoaded = true;
    } catch (e) {
        // المحاولة 2: جلب الشعار من محرك Google السري (مستقر جداً ولا يفشل)
        try {
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            const logo = await loadImage(fallbackUrl);
            const logoSize = 90; // تصغيره قليلاً لأنه يأتي بحواف أحياناً
            ctx.drawImage(logo, x + (size - logoSize) / 2, y + 50, logoSize, logoSize);
            logoLoaded = true;
        } catch (err) {
            logoLoaded = false;
        }
    }

    // المحاولة 3: إذا كانت الأداة وهمية أو لا تمتلك موقعاً، ارسم الحرف الأول
    if (!logoLoaded) {
        // استخراج أول حرف إنجليزي أو عربي
        const firstLetter = toolName.replace(/[^a-zA-Zأ-ي]/g, '').charAt(0).toUpperCase() || toolName.charAt(0).toUpperCase();
        
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 95, 55, 0, Math.PI * 2);
        ctx.fillStyle = isGood ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.fill();

        ctx.font = '65px "CairoBoldHack"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isGood ? '#059669' : '#DC2626';
        ctx.fillText(firstLetter, x + size / 2, y + 100);
    }

    // 3. رسم اسم الأداة في أسفل المربع
    ctx.font = '26px "CairoBoldHack"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#0F172A';
    wrapText(ctx, toolName, x + size / 2, y + 210, size - 20, 35);
}

async function drawAiComparisonSlide(slide, totalSlides, batchId) {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // الخلفية
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);
    drawCircuitLines(ctx, width, height);

    ctx.direction = 'rtl';
    
    // 🟢 النقاط العلوية الديناميكية (تحل مشكلة التعبير عن الصفحة)
    const dotSpacing = 45;
    const dotRadius = 12;
    const totalDotsWidth = (totalSlides - 1) * dotSpacing;
    const startCX = (width - totalDotsWidth) / 2;
    
    ctx.lineWidth = 2;
    for(let i = 0; i < totalSlides; i++) {
        ctx.beginPath(); 
        ctx.arc(startCX + (i * dotSpacing), 70, dotRadius, 0, Math.PI*2); 
        
        if (i + 1 === slide.slideNumber) {
            ctx.fillStyle = '#0F766E'; // لون الدائرة النشطة
            ctx.fill();
            ctx.strokeStyle = '#0F766E';
        } else {
            ctx.strokeStyle = '#CBD5E1'; // لون الدوائر الفارغة
        }
        ctx.stroke();
    }

    // مربع رقم الصفحة
    drawRoundedRect(ctx, 40, 40, 90, 80, 15, '#FFFFFF', true);
    ctx.strokeStyle = 'rgba(15, 118, 110, 0.2)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '45px "CairoBoldHack"';
    ctx.fillStyle = '#0F766E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${slide.slideNumber}`, 85, 85);
    ctx.textBaseline = 'alphabetic';

    // ==========================================
    // شريحة المقارنة
    // ==========================================
    if (slide.type === 'comparison') {
        ctx.font = '65px "CairoBoldHack"'; 
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
        wrapText(ctx, slide.title, width / 2, 260, 950, 85);
        ctx.shadowColor = 'transparent';

        drawCross(ctx, width / 2 + 200, 440);
        drawCheckmark(ctx, width / 2 - 200, 440);

        const boxY = 510;
        const boxSize = 300;
        await drawToolBox(ctx, width / 2 + 60, boxY, boxSize, slide.badTool, false);
        await drawToolBox(ctx, width / 2 - 360, boxY, boxSize, slide.goodTool, true);

        // ⬅️ إصلاح السهم والنص السفلي
        if (slide.nextTeaser) {
            ctx.font = '35px "CairoBoldHack"';
            ctx.fillStyle = '#334155';
            ctx.textAlign = 'center';
            ctx.fillText(slide.nextTeaser, width / 2, 1080);
            
            // حساب عرض النص لضمان التصاق السهم به دائماً
            const textWidth = ctx.measureText(slide.nextTeaser).width;
            drawArrowLeft(ctx, (width / 2) - (textWidth / 2) - 70, 1070);
        }
    } 
    // ==========================================
    // شريحة الختام (CTA)
    // ==========================================
    else if (slide.type === 'cta') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, 300, 200, 0, Math.PI * 2); 
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.clip();
        try {
            const avatar = await loadImage(path.join(__dirname, '../profile.png'));
            const s = Math.min(avatar.width, avatar.height);
            const sx = (avatar.width - s) / 2;
            const sy = (avatar.height - s) / 2;
            ctx.drawImage(avatar, sx, sy, s, s, width / 2 - 200, 300 - 200, 400, 400);
        } catch (err) {}
        ctx.restore();
        
        ctx.beginPath(); ctx.arc(width / 2, 300, 200, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 40; ctx.stroke(); ctx.shadowColor = 'transparent';

        ctx.font = '45px "CairoBoldHack"'; 
        ctx.textAlign = 'center';
        
// تم تجاهل النص القادم من الذكاء الاصطناعي (slide.title) 
        // لرسم النص الملون والمنسق يدوياً وتفادي التداخل

        ctx.font = '45px "CairoBoldHack"'; 
        ctx.textAlign = 'right'; // نضبط المحاذاة لليمين لرسم الجملة بشكل متسلسل

        // 1. حساب عرض الكلمات لضبط المسافات
        const part1 = "علق بكلمة ";
        const part2 = '"أدوات"';
        const part3 = " وراح ارسلك افضل 30 اداة ذكاء";
        const part4 = "اصطناعي مع وصفها لسنة 2026";

        const w1 = ctx.measureText(part1).width;
        const w2 = ctx.measureText(part2).width;
        const w3 = ctx.measureText(part3).width;
        
        // إجمالي عرض السطر الأول لتوسيطه
        const totalWidthLine1 = w1 + w2 + w3;
        let currentX = (width / 2) + (totalWidthLine1 / 2);

        // 2. رسم السطر الأول
        ctx.fillStyle = '#0F172A';
        ctx.fillText(part1, currentX, 620);
        currentX -= w1;

        ctx.fillStyle = '#0F766E'; // اللون الأخضر المميز لكلمة "أدوات"
        ctx.fillText(part2, currentX, 620);
        currentX -= w2;

        ctx.fillStyle = '#0F172A';
        ctx.fillText(part3, currentX, 620);

        // 3. رسم السطر الثاني (موسط)
        ctx.textAlign = 'center';
        ctx.fillText(part4, width / 2, 690);

        const iconY = 850;
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 4;
        
        ctx.beginPath(); ctx.moveTo(width/2 - 250, iconY); ctx.lineTo(width/2 - 210, iconY); ctx.lineTo(width/2 - 210, iconY+50); ctx.lineTo(width/2 - 230, iconY+35); ctx.lineTo(width/2 - 250, iconY+50); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width/2 - 90, iconY+10); ctx.lineTo(width/2 - 50, iconY-10); ctx.lineTo(width/2 - 70, iconY+40); ctx.lineTo(width/2 - 80, iconY+20); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(width/2 + 90, iconY+20, 25, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(width/2 + 250, iconY+20, 22, 0, Math.PI*2); ctx.stroke();

        ctx.font = '24px "CairoBoldHack"';
        ctx.fillStyle = '#334155';
        ctx.fillText("احفظه يمكن", width/2 - 230, iconY + 90); ctx.fillText("تحتاجه بيوم", width/2 - 230, iconY + 120);
        ctx.fillText("شاركه مع", width/2 - 70, iconY + 90);   ctx.fillText("اللي تحبه", width/2 - 70, iconY + 120);
        ctx.fillText("رأيك يهمني", width/2 + 90, iconY + 90); ctx.fillText("بالتعليقات", width/2 + 90, iconY + 120);
        ctx.fillText("لايك واحد", width/2 + 250, iconY + 90);  ctx.fillText("ما يضر", width/2 + 250, iconY + 120);
    }

    // ==========================================
    // الفوتر 
    // ==========================================
    drawRoundedRect(ctx, 40, height - 120, 360, 90, 45, '#FFFFFF', true);
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(350, height - 75, 35, 0, Math.PI * 2);
    ctx.clip();
    try {
        const avatar = await loadImage(path.join(__dirname, '../profile.png'));
        const s = Math.min(avatar.width, avatar.height);
        const sx = (avatar.width - s) / 2;
        const sy = (avatar.height - s) / 2;
        ctx.drawImage(avatar, sx, sy, s, s, 315, height - 110, 70, 70);
    } catch (e) {}
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = '24px "CairoBoldHack"';
    ctx.fillText("غربي محمد الشريف", 290, height - 85);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "CairoRegularHack"';
    ctx.fillText("مستشار وخبير أتمتة و AI", 290, height - 55);

    const fileName = `post_${batchId}_slide_${slide.slideNumber}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../', fileName), buffer);
    return fileName;
}

module.exports = drawAiComparisonSlide;