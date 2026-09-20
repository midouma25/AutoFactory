const { loadImage } = require('canvas');
const path = require('path');

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
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
        currentY += lineHeight + 5; // تقليل المسافة بين الفقرات
    }
    return currentY;
}

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

async function drawTerminalSlide(ctx, width, height, slide, totalSlides, categoryBadge) {
    const theme = {
        bg: '#0F172A',
        grid: 'rgba(255, 255, 255, 0.04)',
        glow: 'rgba(59, 130, 246, 0.12)',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        accent: '#3B82F6'
    };

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);
    
    const glow = ctx.createRadialGradient(width/2, height/2, 100, width/2, height/2, 900);
    glow.addColorStop(0, theme.glow);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for(let i = 0; i < width; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for(let i = 0; i < height; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    if (slide.type === 'hook') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.clip(); 
        try {
            const avatar = await loadImage(path.join(__dirname, '..', 'profile.png'));
            const size = Math.min(avatar.width, avatar.height); 
            const sx = (avatar.width - size) / 2; 
            const sy = (avatar.height - size) / 2; 
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 60, 260 - 60, 120, 120);
        } catch (err) {}
        ctx.restore(); 

        ctx.beginPath();
        ctx.arc(width / 2, 260, 60, 0, Math.PI * 2); 
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '26px "CairoBoldHack"'; 
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText("غربي محمد الشريف", width / 2, 365);

        const pillWidth = 200;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        drawRoundedRect(ctx, (width - pillWidth) / 2, 410, pillWidth, 45, 22);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.font = '20px "CairoBoldHack"'; 
        ctx.fillStyle = '#60A5FA';
        ctx.fillText(categoryBadge, width / 2, 440);

        ctx.font = '80px "CairoBoldHack"'; 
        ctx.fillStyle = theme.textPrimary;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        wrapText(ctx, slide.title, width / 2, 600, 900, 100);
        ctx.shadowColor = 'transparent';

        ctx.font = '40px "CairoRegularHack"'; 
        ctx.fillStyle = theme.accent;
        ctx.fillText("اسحب لتعرف السر 👈", width / 2, height - 130);
    }
    
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
        ctx.fillStyle = theme.accent;
        ctx.textAlign = 'right';
        ctx.fillText('AutoFactory ⚡', width - 80, 105);

        ctx.direction = 'rtl';
        ctx.textAlign = 'right';

        const hasCode = slide.codeSnippet && slide.codeSnippet.trim() !== "" && slide.codeSnippet !== "لا يوجد";
        
        // 🚀 تعديل 1: رفعنا نقطة الانطلاق إلى الأعلى جداً لترك مساحة شاسعة
        let startY = 220; 

        // 🚀 تعديل 2: تصغير خط العنوان ليتسع للنصوص الضخمة
        ctx.font = 'bold 55px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        const titleY = wrapText(ctx, slide.title || "", width - 80, startY, 850, 75);

        let bodyY = titleY + 30; 
        // 🚀 تعديل 3: تصغير خط المحتوى وتصغير المسافة بين الأسطر
        ctx.font = '35px "CairoRegularHack"';
        ctx.fillStyle = theme.textSecondary;
        if (slide.content) {
            bodyY = wrapText(ctx, slide.content, width - 80, bodyY, 850, 55);
        }

        let finalElementY = bodyY;

        if (hasCode) {
            const cardY = bodyY + 40; 
            const codeLines = slide.codeSnippet.split('\n');
            
            // 🚀 تعديل 4: ارتفاع المربع يعتمد 100% على عدد الأسطر (لن يختفي الكود بعد الآن)
            const cardHeight = (codeLines.length * 45) + 80;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            drawRoundedRect(ctx, 80, cardY, width - 160, cardHeight, 24);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
            dotColors.forEach((color, i) => {
                ctx.beginPath(); ctx.arc(120 + (i * 32), cardY + 30, 8, 0, Math.PI * 2);
                ctx.fillStyle = color; ctx.fill();
            });

            ctx.save();
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
            ctx.font = '28px "Consolas", monospace'; // تصغير خط الكود
            let codeY = cardY + 80;

            codeLines.forEach(line => {
                if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
                    ctx.fillStyle = '#6A9955';
                } else if (/\b(const|let|var|function|return|if|else|import|from)\b/.test(line)) {
                    ctx.fillStyle = '#C586C0';
                } else if (/\b(print|def|for|in|elif)\b/.test(line)) {
                    ctx.fillStyle = '#569CD6';
                } else {
                    ctx.fillStyle = '#E2E8F0';
                }
                ctx.fillText(line, 130, codeY);
                codeY += 45;
            });
            ctx.restore();
            finalElementY = cardY + cardHeight;
        }

        if (slide.handwrittenNote) {
            ctx.save();
            const noteY = finalElementY + 60;
            // 🚀 تعديل 5: ضمان عدم نزول الملاحظة أسفل الشاشة مطلقاً (1200 بيكسل كحد أقصى)
            ctx.translate(width - 250, Math.min(noteY, 1200)); 
            ctx.rotate(-10 * Math.PI / 180); 
            ctx.direction = 'rtl';
            ctx.textAlign = 'right';
            ctx.font = '45px "MarheyBoldHack"'; 
            ctx.fillStyle = '#FBBF24'; // أصفر فاقع وممتاز
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText(slide.handwrittenNote, 0, 0);
            ctx.restore();
        }
    }

else if (slide.type === 'cta') {
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.save(); 
        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.clip(); 
        try {
            const avatar = await loadImage(path.join(__dirname, '..', 'profile.png'));
            const size = Math.min(avatar.width, avatar.height); 
            const sx = (avatar.width - size) / 2; 
            const sy = (avatar.height - size) / 2; 
            ctx.drawImage(avatar, sx, sy, size, size, width / 2 - 110, 280 - 110, 220, 220);
        } catch (err) {}
        ctx.restore();

        ctx.beginPath();
        ctx.arc(width / 2, 280, 110, 0, Math.PI * 2);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.font = '45px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        ctx.fillText("غربي محمد الشريف", width / 2, 460);

        ctx.font = '30px "CairoRegularHack"';
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText("مهندس برمجيات ومطور أتمتة", width / 2, 520);

        // 🚀 الإصلاح 1: دفعنا العنوان للأسفل (650 بدلاً من 580) ليترك مسافة واسعة تحت اسمك
        ctx.font = '60px "CairoBoldHack"';
        ctx.fillStyle = theme.textPrimary;
        const ctaTitleY = wrapText(ctx, slide.title || "", width / 2, 650, 950, 80);

        // 🚀 الإصلاح 2: دفعنا الشرح ليكون أسفل العنوان بمسافة مريحة
        ctx.font = '32px "CairoRegularHack"';
        ctx.fillStyle = theme.accent;
        wrapText(ctx, slide.content || "", width / 2, ctaTitleY + 50, 900, 50); 

        // 🚀 الإصلاح 3: تثبيت الملاحظة الوردية فوق الأزرار بشكل دائم (1000 بيكسل) وفصلها عن النصوص تماماً
        ctx.save();
        ctx.translate(width / 2 + 300, 1000); 
        ctx.rotate(10 * Math.PI / 180);
        ctx.font = '40px "MarheyBoldHack"'; 
        ctx.fillStyle = '#F472B6'; 
        ctx.fillText("لا تنسَ الحفظ! 📍", 0, 0);
        ctx.restore();

        const btnY = 1080;
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
            ctx.strokeStyle = act.isPrimary ? theme.accent : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = '32px "CairoBoldHack"';
            ctx.fillStyle = act.isPrimary ? '#FFFFFF' : '#CBD5E1';
            ctx.fillText(act.label, bx + btnWidth / 2, btnY + 85);
        });
    }

    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.font = '22px "CairoBoldHack"';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'; 
    ctx.fillText("غربي محمد الشريف © مهندس برمجيات", width / 2, 1310);
}

module.exports = drawTerminalSlide;