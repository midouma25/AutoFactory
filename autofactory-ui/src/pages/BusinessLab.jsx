import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, Loader2, Image as ImageIcon, Share2, Send, CheckCircle, TrendingUp, Copy, Smartphone, Globe, Wand2, UserSquare2, MonitorPlay } from 'lucide-react';

export default function BusinessLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  const [coverOptions, setCoverOptions] = useState([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0); // الافتراضي هو الغلاف الأول
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  
  // نصوص السوشيال ميديا
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  
  // برومبتات جيميني
  const [magicPrompt3D, setMagicPrompt3D] = useState('');
  const [magicPromptAvatar, setMagicPromptAvatar] = useState('');
  const [magicPromptLifestyle, setMagicPromptLifestyle] = useState(''); // 👈 أضفنا متغير البرومبت الثالث
  const [magicPromptFounder, setMagicPromptFounder] = useState('');
  const [magicPromptTechVisionary, setMagicPromptTechVisionary] = useState('');
  const [magicPromptMastermind, setMagicPromptMastermind] = useState('');
  const [magicPromptVIP, setMagicPromptVIP] = useState('');

// حالات أزرار النسخ
  const [copiedStates, setCopiedStates] = useState({
    ig: false, fb: false, prompt3D: false, promptAvatar: false, promptLifestyle: false, promptFounder: false, promptTechVisionary: false, promptMastermind: false, promptVIP: false
  });

  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // دالة النسخ مع تغيير حالة الزر مؤقتاً
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
  };

  const suggestBusinessTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-business-roadmap');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  const generateBusinessRoadmap = async () => {
    if (!topic) return alert('اكتب الموضوع التجاري أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    
    try {
      const res = await axios.post('http://localhost:5000/api/generate-business-roadmap', { 
        topic, 
        slideCount, 
        platform 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
        setCoverOptions(res.data.coverOptions); // 👈 إضافة هذا السطر
        setSelectedCoverIndex(0); // إعادة التعيين
        // استلام النصوص من السيرفر
        setIgCaption(res.data.igCaption || 'اكتب هنا وصف إنستغرام...');
        setFbCaption(res.data.fbCaption || 'اكتب هنا وصف فيسبوك...');
        
        // توليد البرومبتات السحرية ديناميكياً بناءً على الموضوع
        const p3D = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".\nمرفق مع هذه الرسالة صورة الغلاف غير المكتملة.\n\nالمطلوب منك كخبير دمج وتصميم ثلاثي الأبعاد (3D Artist & Compositor):\n1. التجسيد الحرفي للفكرة: قم بتوليد مجسم 3D معقد ومذهل في "النصف العلوي فقط" من المساحة الفارغة، يعبر حرفياً عن فكرة الموضوع (مثلاً: آلة تستخرج البيانات، أو واجهة API، أو روبوت ذكي).\n2. الطابع البصري (Tech meets Wealth): أريد دمجاً عبقرياً بين "التكنولوجيا المتقدمة" و"الأرباح الطائلة". أضف عناصر توحي بالثراء المباشر (مثل: عملات ذهبية تتطاير من الكود، علامة الدولار $ مشعة ومجسمة، أو رسومات بيانية خضراء نيون تتصاعد بقوة). اجعل المشهد يثير "طمعاً إيجابياً" ويوحي بأن هذه التقنية هي آلة لطباعة الأموال!\n3. التفاصيل والمواد: اجعل المجسم فخماً جداً (Premium) وغالي الثمن. استخدم مواد مثل الزجاج الأسود اللامع، المعدن الكربوني، والذهب الخالص، مع خطوط بيانات نيون تتحول إلى أموال.\n4. الإضاءة: إضاءة درامية (Dark Moody Lighting) تناسب الـ Dark Mode، مع توهج (Glow) ذهبي وزمردي (أخضر فاقع) يشع من قلب المجسم ليفصله عن الخلفية الداكنة بأناقة.\n5. **قاعدة الحدود الجغرافية (حرج جداً):** المجسم والأموال المتطايرة يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم (مثل "اكسب 5000$...") أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً.`;

        const pAvatar = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".\nمرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع للوجه.\n\nالمطلوب كخبير دمج (Compositor):\n1. توليد صورة واقعية (Photorealistic) لي في "النصف العلوي فقط" من المساحة الفارغة في الغلاف.\n2. **قاعدة صارمة للوجه:** حافظ على ملامح وجهي وشكل رأسي بنسبة 100% (استخدم صورتي كمرجع دقيق).\n3. **الوضعية:** اجعلني أرتدي بدلة احترافية حديثة، وأقوم بفعل يعبر عن: "${topic}". (مثال: أنظر بثقة للجمهور وبجانبي مجسم 3D مشع يمثل الفكرة).\n4. **الحدود الجغرافية (حرج جداً):** يجب أن يكون جسدي والمجسم الـ 3D محصورين تماماً في "المساحة المظلمة العلوية". إياك أن تجعل يدي، جسدي، أو أي عنصر يمتد للأسفل ليغطي أو يتداخل مع النص الأبيض الكبير (مثل "كيف تكسب...") أو الزر الأخضر في الأسفل.\n5. الإضاءة: إضاءة حواف (Edge Lighting) درامية تتناسب مع الـ Dark Mode.`;

        const pLifestyle = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق مع هذه الرسالة صورة الغلاف غير المكتملة.

المطلوب منك كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. التجسيد الواقعي (Lifestyle & Tech): قم بملء "النصف العلوي فقط" من المساحة الفارغة بمشهد "بيئة عمل فاخرة جداً" (Luxury Workspace) تعبر عن فكرة الموضوع. (مثلاً: حاسوب محمول فخم مفتوح بزاوية سينمائية على طاولة من الرخام الأسود الداكن، وتنبثق من شاشته واجهات شفافة أنيقة (Holographic UI) أو رسومات بيانية خضراء توحي بالنجاح وتدفق الأرباح).
2. الطابع البصري (بيع الحلم): المشهد يجب أن يبدو كصورة فوتوغرافية حقيقية (Photorealistic) مأخوذة بكاميرا احترافية، وليس تصميماً كرتونياً. أضف عناصر توحي بالحرية المالية والاحترافية (مثلاً: كوب قهوة فاخر بجانب اللابتوب، نظارات، أو خلفية ضبابية "Bokeh" لنافذة تطل على أضواء ناطحات سحاب في مدينة حديثة ليلاً).
3. الإضاءة والتفاصيل: إضاءة سينمائية هادئة (Moody Cinematic Lighting) تتناغم مع الـ Dark Mode. ركز على انعكاس توهج الشاشة (أزرق/أخضر) على سطح الطاولة الرخامي الداكن لإعطاء واقعية مطلقة وفخامة.
4. **قاعدة الحدود الجغرافية (حرج جداً):** الطاولة، اللابتوب، وكل تفاصيل المشهد الواقعي يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً في الغلاف.`;

const pFounder = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب منك كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. التجسيد الواقعي المدمج (The Founder Lifestyle): قم بملء "النصف العلوي فقط" من المساحة الفارغة بمشهد يجمعني أنا شخصياً داخل "بيئة عمل فاخرة جداً". اجعلني (بنسخة واقعية Photorealistic) أجلس بثقة أو أقف خلف طاولة من الرخام الأسود الداكن.
2. الطابع البصري والتفاعل: ألبسني بدلة احترافية حديثة وأنيقة. على الطاولة أمامي، ضع حاسوباً محمولاً فخماً تنبثق منه واجهات شفافة أنيقة (Holographic UI) أو رسومات بيانية خضراء توحي بالنجاح (تعبر عن الموضوع). أضف خلفية ضبابية "Bokeh" لمدينة ليلية حديثة.
3. قاعدة صارمة للوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100% (استخدم صورتي المرفقة كمرجع دقيق ولا تغير ملامحي).
4. الإضاءة والدمج السلس (الحل السحري): إضاءة سينمائية هادئة (Moody Cinematic) تتناغم مع الـ Dark Mode. **حرج جداً: يجب أن تتلاشى الحافة السفلية للصورة (والمكتب) تدريجياً إلى السواد التام (Smooth Gradient Fade to Black) بحيث تندمج بسلاسة مطلقة مع خلفية الغلاف الداكنة دون أي خطوط قص حادة أو حواف مربعة مرئية.**
5. **قاعدة الحدود الجغرافية (حرج جداً):** جسدي، الطاولة، وكل تفاصيل المشهد يجب أن تكون محصورة تماماً في "النصف العلوي المظلم". إياك أن تجعل أي جزء يمتد للأسفل ليتداخل أو يغطي النص الأبيض الضخم أو الزر الأخضر. لا تمسح أو تشوه أي نصوص أو شارات موجودة أصلاً.`;


const pTechVisionary = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The Tech Visionary): املأ "النصف العلوي فقط". اجعلني أقف بوضعية الثقة والقيادة (مثلاً: ذراعان متقاطعان).
2. الطابع البصري: ألبسني بدلة 'سمارت كاجوال' أنيقة (مثل سويتر بياقة عالية داكن وسترة). أمامي أو بجانبي، ارسم شاشة هولوغرامية شفافة ضخمة تعرض هندسة معمارية لـ SaaS وتدفقات مالية خضراء (تعبر عن الفكرة). الخلفية: مركز بيانات متطور (Data Center) أو قاعة مؤتمرات تقنية مظلمة مع إضاءة نيون.
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة سينمائية تتناغم مع الـ Dark Mode. **يجب أن تتلاشى الحافة السفلية للصورة تدريجياً إلى السواد التام (Gradient Fade to Black) لتندمج مع الخلفية بلا حواف حادة.**
5. الحدود الجغرافية: كل شيء يجب أن يكون في النصف العلوي المظلم، دون تغطية أي نصوص أو أزرار في الأسفل.`;

        const pMastermind = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The Mastermind): املأ "النصف العلوي فقط". اجعلني في حالة تركيز شديد وعمل جاد.
2. الطابع البصري: ألبسني قميصاً أبيض احترافياً مع أكمام مطوية. اجعلني أنظر وأتفاعل (مثلاً: أكتب أو أشير) نحو لوح زجاجي شفاف ومضيء (Smart Board) يعرض مخططات مالية وأكواد برمجية (تعبر عن الفكرة). الخلفية: ضبابية لمكتب فاخر في طابق علوي يطل على المدينة.
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة سينمائية تتناغم مع الـ Dark Mode. **تلاشي الحافة السفلية تدريجياً إلى السواد التام (Gradient Fade to Black) ضروري جداً.**
5. الحدود الجغرافية: التزم بصرامة بالنصف العلوي فقط، دون المساس بالعناوين والأزرار.`;

        const pVIP = `أنا أصمم غلافاً لمنشور (Carousel) تجاري بخلفية داكنة فاخرة. موضوع المنشور هو: "${topic}".
مرفق صورتان: الغلاف غير المكتمل، وصورتي الشخصية كمرجع لوجهي.

المطلوب كخبير دمج وتصوير سينمائي واقعي (Photorealistic Compositor):
1. المشهد (The VIP Lifestyle): املأ "النصف العلوي فقط". ركز على الرفاهية والعمل بذكاء.
2. الطابع البصري: ألبسني ملابس كاجوال فاخرة ومريحة. اجعلني أجلس باسترخاء في صالة انتظار طيران فخمة (VIP Lounge) أو على شرفة زجاجية حديثة ليلاً. أعمل على لابتوب أنيق، وتنبثق منه إشعارات أرباح ومخططات خضراء (تعبر عن الفكرة).
3. الوجه: حافظ على ملامح وجهي وشكل رأسي بنسبة 100%.
4. الدمج السلس: إضاءة خافتة (Moody) توحي بالحرية المالية. **تأكد من تلاشي الحافة السفلية تدريجياً إلى السواد (Gradient Fade to Black) لدمج مثالي.**
5. الحدود الجغرافية: حافظ على نظافة النصف السفلي من أي تداخل مع النصوص الأصلية للغلاف.`;

        setMagicPromptFounder(pFounder);
        setMagicPromptTechVisionary(pTechVisionary);
        setMagicPromptMastermind(pMastermind);
        setMagicPromptVIP(pVIP);
        setMagicPrompt3D(p3D);
        setMagicPromptAvatar(pAvatar);
        setMagicPromptLifestyle(pLifestyle);
        setMagicPromptFounder(pFounder);
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // 🔥 مستشار التسويق الذكي - منطق تحليل الموضوع والنصيحة
const getMarketingAdvice = (topic, options) => {
    let recommendation = '';
    let reasoning = '';
    const topicLower = topic.toLowerCase();

 // تحليل الكلمات المفتاحية للموضوع (دعم ثنائي اللغة)
    const isRegional = topicLower.includes('algeria') || topicLower.includes('dz') || topicLower.includes('جزائر');
    const isEcom = topicLower.includes('ecommerce') || topicLower.includes('تجار') || topicLower.includes('سلع') || topicLower.includes('متاجر');
    const isTech = topicLower.includes('saas') || topicLower.includes('منصة') || topicLower.includes('برمج') || topicLower.includes('موقع') || topicLower.includes('ذكاء');
    const isIncome = topicLower.includes('$') || topicLower.includes('income') || topicLower.includes('أرباح') || topicLower.includes('اشتراك') || topicLower.includes('بيع');
    const isExpert = topicLower.includes('professional') || topicLower.includes('احترافي') || topicLower.includes('خبراء');


    // منطق التوصية التسويقية المطورة
    if (isRegional && isEcom && isTech) {
        // موضوعك الحالي تماماً
        recommendation = '🏆 الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)';
        reasoning = `الموضوع تقني إقليمي بامتياز. سيكولوجياً، المتابع الجزائري بحاجة لرؤية "العمل الفعلي". لقطة لوح الزجاج وهيئة "المبرمج الجاد" مع الكود الجزائرى المخصص تخلق ثقة (Credibility) لا تُقاوم وتثبت أنك تبني الحل بأذنك.`;
    } else if (isTech && isExpert && !isIncome) {
        // موضوعات الهندسة المعمارية والـ APIs
        recommendation = '💡 الخيار 5: المُحاضر التقني (الهولوغرام)';
        reasoning = `أنت تتحدث لجمهور تقني محترف. وقفة الخوارزميات وهياكل البيانات أمام الخوادم تبنيك كمرجعية تقنية (Authority) وتثبت قوة الأنظمة المعقدة التي تبنيها.`;
    } else if (isIncome && isEcom) {
        // موضوعات جني الأرباح بصمت
        recommendation = '✈️ الخيار 7: الرفاهية والـ VIP';
        reasoning = `هنا أنت تبيع "النتيجة النهائية". المتابع يريد أن يرى الحياة التي سيحصل عليها. إشعارات الأرباح الجزائرية المنبثقة من اللابتوب في جو من الرفاهية تضرب عصب "الرغبة" (Desire) وتجلب أعلى معدلات نقر (CTR) من الطموحين.`;
    } else if (isRegional && isExpert) {
        // موضوعات الاستشارات واللقاءات الرسمية
        recommendation = '💼 الخيار 4: هالة المؤسس (المكتب الكلاسيكي)';
        reasoning = `عندما تتحدث عن استشارات تجارية أو إطلاق منصة رسمية في السوق الجزائري، فإن الكلاسيكية هي الأفضل لبناء "الموثوقية" (Trust) في المقام الأول. نظرتك المباشرة للكاميرا من خلف مكتب فاخر تبنيك كشخصية قيادية موثوقة.`;
    } else {
        // النصيحة الافتراضية لأي موضوع آخر
        recommendation = '🏆 الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)';
        reasoning = `هذا هو الخيار الأقوى بشكل عام لمحتوى SaaS. إنه يجمع بين الاحترافية والديناميكية، ويظهرك في قمة التركيز وأنت تبني الحل.`;
    }

    return { recommendation, reasoning };
};


  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', { platform, images, igCaption, fbCaption });
      if (res.data.success) setPublishSuccess(true);
    } catch (error) {
      console.error(error); alert('فشل النشر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#05070A]" dir="rtl">
      {/* 💼 الهيدر الفخم */}
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center gap-3">
        <Briefcase className="text-yellow-500" size={38} />
        مصنع الأرباح والـ SaaS (Business Blueprint)
      </h1>
      
      {/* 🟢 محدد المنصة */}
      <div className="bg-slate-900 p-4 rounded-xl border border-yellow-500/20 flex gap-2 mb-8 mx-auto max-w-2xl text-sm shadow-[0_0_20px_rgba(234,179,8,0.05)]">
        <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-pink-500/50'}`}>إنستغرام</button>
        <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-blue-500/50'}`}>فيسبوك</button>
        <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'both' ? 'bg-emerald-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-emerald-500/50'}`}>كلاهما معاً</button>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-yellow-500/30 flex flex-col shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-emerald-400" size={32} />
            <h2 className="text-2xl font-bold text-slate-100">هندسة الفكرة التجارية</h2>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            <textarea 
              placeholder="عن أي منتج SaaS أو مهارة مربحة ستتحدث؟ (مثال: بناء منصة ذكاء اصطناعي لكتابة المحتوى وبيعها باشتراكات)" 
              className="w-full p-5 bg-[#020408] border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder:text-slate-600 resize-none h-32 text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-4 w-full">
              <button 
                onClick={suggestBusinessTopic} 
                disabled={isSuggesting} 
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#05070A] p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-yellow-600/20 text-lg"
              >
                {isSuggesting ? <Loader2 size={24} className="animate-spin" /> : <Briefcase size={24} />}
                <span>إلهام خطة أرباح 💰</span>
              </button>

              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-1/3 p-4 bg-[#020408] border border-slate-700 rounded-xl text-yellow-500 outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer font-bold transition-all text-lg text-center"
              >
                <option value="5">5 شرائح (سريع)</option>
                <option value="6">6 شرائح (أساسي)</option>
                <option value="7">7 شرائح (احترافي)</option>
                <option value="8">8 شرائح (خبير)</option>
                <option value="9">9 شرائح (ماستر)</option>
                <option value="10">10 شرائح</option>
                <option value="11">11 شريحة</option>
                <option value="12">12 شريحة</option>
                <option value="13">13 شريحة</option>
                <option value="14">14 شريحة</option>
                <option value="15">15 شريحة</option>
                <option value="16">16 شريحة</option>
                <option value="17">17 شريحة (أسطوري 👑)</option>
              </select>
            </div>
          </div>

          <button onClick={generateBusinessRoadmap} disabled={loading || !topic} className="w-full p-5 mt-8 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 flex justify-center items-center gap-3 text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
            {loading ? <><Loader2 size={26} className="animate-spin" /> جاري تخطيط البيزنس...</> : '⚡ صمم خريطة الأرباح الآن'}
          </button>
        </div>
      </div>

      {/* 👁️ غرفة المراجعة (Review Studio) */}
{/* 👁️ غرفة المراجعة (Review Studio) */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-3xl font-bold mb-8 text-slate-100 flex items-center justify-center gap-3">
            👁️ استوديو المراجعة والأدوات
          </h3>

          {/* 🧠 صندوق مستشار الأرباح الذكي (The Profit Advisor) */}
          {magicPromptFounder && (
            <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 mb-10 shadow-[0_0_30px_rgba(16,185,129,0.15)] mx-auto max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-500 text-slate-900 p-3 rounded-full text-xl font-bold">
                  <TrendingUp size={24}/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">🏆 مستشار الأرباح الذكي (The Profit Advisor)</h2>
                  <p className="text-sm text-emerald-300">تحليل تسويقي مستقل لأفضل غلاف لمنشورك</p>
                </div>
              </div>
              
              {/* استدعاء دالة النصيحة المطورة وعرض النتائج */}
              {(() => {
                const { recommendation, reasoning } = getMarketingAdvice(topic, {});
                return (
                  <div className="space-y-4">
                    <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-700 shadow-inner">
                      <p className="text-sm text-slate-400 mb-2">توصيتنا النهائية:</p>
                      <p className="text-xl font-extrabold text-emerald-400">{recommendation}</p>
                    </div>
                    <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-700 shadow-inner">
                      <p className="text-sm text-slate-400 mb-2">التحليل التسويقي والسيكولوجي (Developed Logic):</p>
                      <p className="text-base text-slate-300 leading-relaxed">{reasoning}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* 📸 قسم الصور المنتجة */}
            <div className="space-y-8">
              {(platform === 'instagram' || platform === 'both') && (
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-pink-500/20 shadow-2xl">
                  {/* 🎯 قسم اختيار الغلاف الأقوى (A/B/C Testing) */}
                  {coverOptions && coverOptions.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        <TrendingUp size={20}/> اختر أقوى غلاف (الخطاف الأفضل):
                      </h4>
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {coverOptions.map((optImg, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                                setSelectedCoverIndex(idx);
                                // تحديث المصفوفة الرئيسية بالصورة المختارة
                                const newImages = {...images};
                                if(newImages.instagram.length > 0) newImages.instagram[0] = coverOptions[idx];
                                if(newImages.facebook.length > 0) newImages.facebook[0] = coverOptions[idx]; // بافتراض التسمية تتطابق أو تكفي للإشارة
                                setImages(newImages);
                            }}
                            className={`cursor-pointer transition-all duration-300 rounded-xl border-4 ${selectedCoverIndex === idx ? 'border-yellow-500 scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={`http://localhost:5000/${optImg}`} className="h-64 rounded-lg" alt={`Hook Option ${idx+1}`}/>
                            <div className="text-center mt-2 text-sm font-bold text-slate-300">
                                {idx === 0 ? '💰 الرغبة' : idx === 1 ? '🤫 الفضول' : '⚡ التحدي'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* عرض الكاروسيل النهائي */}
                  <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={22}/> الكاروسيل النهائي:</h4>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.instagram.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt={`Slide ${idx+1}`}/>
                    ))}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.instagram.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="IG Slide"/>
                    ))}
                  </div>
                </div>
              )}

              {(platform === 'facebook' || platform === 'both') && (
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-blue-500/20 shadow-2xl">
                  <h4 className="font-bold text-blue-400 mb-6 flex items-center gap-2"><Share2 size={22}/> شرائح فيسبوك</h4>
                  <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    {images.facebook.map((img, idx) => (
                      <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="FB Slide"/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 📝 قسم النصوص والبرومبتات */}
            <div className="space-y-6">
              
              {/* 📱 صندوق وصف إنستغرام */}
              {(platform === 'instagram' || platform === 'both') && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-pink-500/40 relative shadow-[0_0_15px_rgba(219,39,119,0.1)]">
                  <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
                    <Smartphone size={18} /> كابشن إنستغرام (خوارزمية الحفظ)
                  </h4>
                  <textarea readOnly value={igCaption} className="w-full h-32 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"/>
                  <button onClick={() => handleCopy(igCaption, 'ig')} className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs">
                    {copiedStates.ig ? <><CheckCircle size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ</>}
                  </button>
                </div>
              )}

              {/* 📘 صندوق وصف فيسبوك */}
              {(platform === 'facebook' || platform === 'both') && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/40 relative shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                  <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Globe size={18} /> كابشن فيسبوك (خوارزمية المشاركة)
                  </h4>
                  <textarea readOnly value={fbCaption} className="w-full h-32 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"/>
                  <button onClick={() => handleCopy(fbCaption, 'fb')} className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs">
                    {copiedStates.fb ? <><CheckCircle size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ</>}
                  </button>
                </div>
              )}

              {/* 🪄 البرومبت الأول (عنصر 3D) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-yellow-500/40 relative shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  <Wand2 size={18} /> الخيار 1: إضافة مجسم 3D
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع الصورة الأولى لملء المساحة بمجسم 3D فخم.</p>
                <textarea readOnly value={magicPrompt3D} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPrompt3D, 'prompt3D')} className="absolute bottom-6 left-6 bg-yellow-600 hover:bg-yellow-500 text-slate-900 p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.prompt3D ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 👤 البرومبت الثاني (الأفاتار الشخصي) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/40 relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <UserSquare2 size={18} /> الخيار 2: صورتك تتفاعل مع الفكرة
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع <span className="font-bold text-emerald-300">الصورة الأولى + صورتك الشخصية</span> ليضعك في الغلاف.</p>
                <textarea readOnly value={magicPromptAvatar} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptAvatar, 'promptAvatar')} className="absolute bottom-6 left-6 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptAvatar ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>
              
              {/* 💻 البرومبت الثالث (بيئة العمل الفاخرة) - الجديد */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-blue-500/40 relative shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <MonitorPlay size={18} /> الخيار 3: بيئة عمل فاخرة (Lifestyle)
                </h4>
                <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع الصورة الأولى للحصول على مشهد مكتب فخم وواقعي.</p>
                <textarea readOnly value={magicPromptLifestyle} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptLifestyle, 'promptLifestyle')} className="absolute bottom-6 left-6 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptLifestyle ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>



               {/* 👑 البرومبت الرابع (المدير التنفيذي - هالة المؤسس) */}
<div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/40 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
  <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
    <Briefcase size={18} /> الخيار 4: هالة المؤسس (أنت + الرفاهية) 👑
  </h4>
  <p className="text-xs text-slate-400 mb-3">ارسل هذا لـ Gemini مع <span className="font-bold text-purple-300">صورتك + الغلاف</span> لتظهر كمدير تنفيذي في مكتب فاخر.</p>
  <textarea readOnly value={magicPromptFounder} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
  <button onClick={() => handleCopy(magicPromptFounder, 'promptFounder')} className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
    {copiedStates.promptFounder ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
  </button>
</div>


{/* ... (الصناديق السابقة) ... */}

              {/* 👑 الخيار 4: هالة المؤسس (المكتب) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/40 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Briefcase size={18} /> الخيار 4: هالة المؤسس (المكتب الكلاسيكي)
                </h4>
                <textarea readOnly value={magicPromptFounder} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptFounder, 'promptFounder')} className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptFounder ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 💡 الخيار 5: المُحاضر التقني */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-cyan-500/40 relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <MonitorPlay size={18} /> الخيار 5: المُحاضر التقني (الهولوغرام)
                </h4>
                <textarea readOnly value={magicPromptTechVisionary} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptTechVisionary, 'promptTechVisionary')} className="absolute bottom-6 left-6 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptTechVisionary ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* 🧠 الخيار 6: المُخطط الاستراتيجي */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-orange-500/40 relative shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                  <TrendingUp size={18} /> الخيار 6: المُخطط الاستراتيجي (لوح الزجاج)
                </h4>
                <textarea readOnly value={magicPromptMastermind} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptMastermind, 'promptMastermind')} className="absolute bottom-6 left-6 bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptMastermind ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>

              {/* ✈️ الخيار 7: الرفاهية والـ VIP */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-rose-500/40 relative shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
                  <Globe size={18} /> الخيار 7: الرفاهية والـ VIP (العمل من أي مكان)
                </h4>
                <textarea readOnly value={magicPromptVIP} className="w-full h-24 bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-slate-300 text-xs outline-none resize-none custom-scrollbar font-mono leading-relaxed"/>
                <button onClick={() => handleCopy(magicPromptVIP, 'promptVIP')} className="absolute bottom-6 left-6 bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                  {copiedStates.promptVIP ? <><CheckCircle size={16}/> تم</> : <><Copy size={16} /> نسخ</>}
                </button>
              </div>


            </div>
          </div>

          {/* زر النشر النهائي */}
          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-emerald-900/40 text-emerald-400 border border-emerald-500 p-5 rounded-2xl font-bold flex items-center gap-3 text-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle size={32} /> تمت إطلاق المشروع بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-yellow-500 to-emerald-600 hover:from-yellow-400 hover:to-emerald-500 text-white px-14 py-5 rounded-2xl font-bold text-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {publishing ? <><Loader2 size={32} className="animate-spin" /> جاري الإطلاق...</> : <><Send size={32} /> اعتمد خطة الأرباح وانشر 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}