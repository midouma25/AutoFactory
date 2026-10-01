import React, { useState } from 'react';
import axios from 'axios';
import { Copy, CheckCircle2, Upload, ImageIcon, Wand2, PenTool, Zap, TrendingUp, Loader2, Eye, RefreshCw } from 'lucide-react';

const StoryLab = () => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(8); // الافتراضي 8 شرائح
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const [storySlides, setStorySlides] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});

  const [imagePreviews, setImagePreviews] = useState({}); // 🌟 State جديد لحفظ صور المعاينة
  const [finalImages, setFinalImages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
// --- States للتحرير اليدوي وإعادة الصياغة ---
  const [editingSlideIndex, setEditingSlideIndex] = useState(null); // من هي الشريحة المفتوحة للتحرير؟
  const [editForm, setEditForm] = useState({ title: '', text: '' }); // بيانات النموذج المؤقتة
  const [isRewriting, setIsRewriting] = useState(false);
// تتبع أي شريحة يتم تحديث صورها حالياً لإظهار أيقونة التحميل
  const [regeneratingPromptsIndex, setRegeneratingPromptsIndex] = useState(null);

  // 🔄 دالة تحديث اللقطات لشريحة محددة
  const handleRegenerateSinglePrompts = async (slideIndex) => {
    setRegeneratingPromptsIndex(slideIndex);
    try {
      const slide = storySlides[slideIndex];
      const res = await axios.post('http://localhost:5000/api/regenerate-single-prompts', { 
        slideTitle: slide.title,
        slideText: slide.text
      });
      
      if (res.data.success) {
        const updatedSlides = [...storySlides];
        updatedSlides[slideIndex] = { 
            ...updatedSlides[slideIndex], 
            vibePrompt: res.data.prompts.vibePrompt,
            facePrompt: res.data.prompts.facePrompt,
            povPrompt: res.data.prompts.povPrompt,
            emotionPrompt: res.data.prompts.emotionPrompt,
            technicalPrompt: res.data.prompts.technicalPrompt
        };
        setStorySlides(updatedSlides);
        
        // مسح نصيحة المستشار القديمة لأنها لم تعد صالحة للبرومبتات الجديدة
        const updatedAdvice = { ...expertAdvice };
        delete updatedAdvice[slide.slideNumber];
        setExpertAdvice(updatedAdvice);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تحديث اللقطات. حاول مجدداً.');
    }
    setRegeneratingPromptsIndex(null);
  };
  // فتح وضع التحرير
  const handleEditClick = (slideIndex, slide) => {
    setEditingSlideIndex(slideIndex);
    setEditForm({ title: slide.title, text: slide.text });
  };

  // إغلاق وضع التحرير بدون حفظ
  const handleCancelEdit = () => {
    setEditingSlideIndex(null);
  };

  // حفظ التعديلات اليدوية
  const handleSaveEdit = (slideIndex) => {
    const updatedSlides = [...storySlides];
    updatedSlides[slideIndex] = { 
        ...updatedSlides[slideIndex], 
        title: editForm.title, 
        text: editForm.text 
    };
    setStorySlides(updatedSlides);
    setEditingSlideIndex(null);
  };

  // 🪄 زر السحر الاصطناعي لإعادة الصياغة
  const handleAiRewrite = async (slideIndex) => {
    setIsRewriting(true);
    try {
      const slideToRewrite = storySlides[slideIndex];
      const res = await axios.post('http://localhost:5000/api/rewrite-slide', { 
        slideTitle: slideToRewrite.title,
        slideText: slideToRewrite.text,
        slideType: slideIndex === 0 ? 'hook' : (slideIndex === storySlides.length - 1 ? 'cta' : 'content')
      });
      
      if (res.data.success) {
        // تحديث الـ Form المؤقت لكي ترى النتيجة فوراً
        setEditForm({ title: res.data.newTitle, text: res.data.newText });
        
        // أو حفظها مباشرة في الـ State الرئيسي
        const updatedSlides = [...storySlides];
        updatedSlides[slideIndex] = { 
            ...updatedSlides[slideIndex], 
            title: res.data.newTitle, 
            text: res.data.newText 
        };
        setStorySlides(updatedSlides);
        // نغلق وضع التحرير بعد نجاح السحر
        setEditingSlideIndex(null);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إعادة الصياغة بالذكاء الاصطناعي.');
    }
    setIsRewriting(false);
  };

  
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ==========================================
  // دوال الإلهام الاستراتيجي (The Growth Engine)
  // ==========================================
  
  // 1. دالة الإلهام الشخصي (Personal Arsenal) - لبناء الثقة
  const handlePersonalInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-personal');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  // 2. دالة الإلهام الترندي (Viral Trends) - للانتشار
  const handleViralInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-viral');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  // 3. دالة خرائط الطريق (Roadmaps & Tools) - قنابل الحفظ
  const handleRoadmapInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-roadmap');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-roadmap في السيرفر.');
    }
    setIsSuggesting(false);
  };

  // 4. دالة إثارة الجدل (Controversial) - لزيادة التعليقات
  const handleControversialInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-controversial');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-controversial في السيرفر.');
    }
    setIsSuggesting(false);
  };

  // 5. دالة دراسات الحالة (Case Studies) - لصيد العملاء
  const handleCaseStudyInspiration = async () => {
    setIsSuggesting(true);
    try {
      // ⚠️ تأكد من إنشاء هذا المسار في server.js لاحقاً
      const res = await axios.get('http://localhost:5000/api/suggest-story-casestudy');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('تحتاج إلى إنشاء مسار /api/suggest-story-casestudy في السيرفر.');
    }
    setIsSuggesting(false);
  };

  const handleGeneratePrompts = async () => {
    setIsLoading(true);
    try {
      // 🌟 التغيير هنا: نرسل topic و slideCount صراحةً
      const res = await axios.post('http://localhost:5000/api/generate-story-prompts', { 
        topic: topic, 
        slideCount: slideCount 
      });
      if (res.data.success) {
        setStorySlides(res.data.slides);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء توليد السيناريو.');
    }
    setIsLoading(false);
  };


  // 6. دالة كفاح وإنتاجية (Hero's Journey) - لربط الجمهور عاطفياً
  const handleJourneyInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-journey');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  
// 7. دالة خرائط الإتقان (Zero to Hero)
  const handleMasteryInspiration = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-story-mastery');
      if (res.data.success) setTopic(res.data.topic);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء جلب الفكرة.');
    }
    setIsSuggesting(false);
  };

  const [expertAdvice, setExpertAdvice] = useState({});
  const [isConsulting, setIsConsulting] = useState(false);

  // دالة طلب نصيحة المستشار
  const handleGetExpertAdvice = async () => {
    setIsConsulting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/suggest-best-shots', { 
        slides: storySlides 
      });
      
      if (res.data.success) {
        // تحويل المصفوفة إلى كائن (Object) يسهل الوصول إليه عبر رقم الشريحة
        const adviceObj = {};
        res.data.expert_advice.forEach(item => {
          adviceObj[item.slideNumber] = item;
        });
        setExpertAdvice(adviceObj);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء استشارة الخبير.');
    }
    setIsConsulting(false);
  };


  // التعامل مع اختيار الصور من المستخدم وإنشاء معاينة
  const handleImageUpload = (slideNumber, file) => {
    if (file) {
      // حفظ الملف الفعلي للإرسال للسيرفر
      setUploadedImages(prev => ({
        ...prev,
        [`image_${slideNumber}`]: file
      }));
      
      // إنشاء رابط معاينة فوري لعرضه في الواجهة
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [`image_${slideNumber}`]: previewUrl
      }));
    }
  };

  const [isGeneratingCinematics, setIsGeneratingCinematics] = useState(false);
// دالة مساعدة لإنشاء تأخير زمني (Sleep)
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🎬 دالة طلب اللقطات السينمائية (تعمل الآن عبر Gemini لجميع الشرائح دفعة واحدة)
  const handleGenerateCinematics = async () => {
    setIsGeneratingCinematics(true);
    try {
      // إرسال المصفوفة كاملة للسيرفر بدون أي تأخير زمني
      const res = await axios.post('http://localhost:5000/api/generate-cinematic-prompts', { 
        slides: storySlides 
      });
      
      if (res.data.success) {
        const cinematicData = res.data.cinematic_slides;
        const updatedSlides = storySlides.map(slide => {
          const matchingCinematic = cinematicData.find(c => c.slideNumber === slide.slideNumber);
          if (matchingCinematic) {
             return { 
                 ...slide, 
                 vibePrompt: matchingCinematic.vibePrompt,
                 facePrompt: matchingCinematic.facePrompt,
                 povPrompt: matchingCinematic.povPrompt,
                 emotionPrompt: matchingCinematic.emotionPrompt,
                 technicalPrompt: matchingCinematic.technicalPrompt
             };
          }
          return slide;
        });
        
        setStorySlides(updatedSlides);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء توليد اللقطات السينمائية.');
    }
    setIsGeneratingCinematics(false);
  };



  const handleStampImages = async () => {
    if (Object.keys(uploadedImages).length !== storySlides.length) {
        alert('الرجاء رفع صورة لكل شريحة من Gemini قبل الطباعة!');
        return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('slidesData', JSON.stringify(storySlides));
    
    storySlides.forEach(slide => {
        const file = uploadedImages[`image_${slide.slideNumber}`];
        formData.append(`image_${slide.slideNumber}`, file);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/stamp-story-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFinalImages(res.data.images);
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء طباعة التصميم.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#05070A]" dir="rtl">
      <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center gap-3">
        <Wand2 size={36} className="text-purple-500" /> استوديو القصص (Story Lab - Pro)
      </h2>

      {/* ==========================================
          المرحلة 1: إدخال الفكرة وأزرار الإلهام
          ========================================== */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-3">
              1. هندسة القصة والسيناريو
            </h3>

            {/* ==========================================
                لوحة التحكم الاستراتيجية (The Growth Engine)
                ========================================== */}
 {/* ==========================================
                لوحة التحكم الاستراتيجية (The Growth Engine)
                ========================================== */}
            <div className="mb-6">
              <label className="text-slate-300 font-bold mb-3 flex items-center gap-2">
                <Wand2 size={18} className="text-purple-400"/> اختر الاستراتيجية النفسية للمنشور:
              </label>
              
              {/* شبكة متوازنة من 6 أزرار (3 أعمدة) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                
                {/* 1. بناء الثقة */}
                <button 
                  onClick={handlePersonalInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-purple-300 py-3 px-3 rounded-xl font-medium border border-purple-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يبني الثقة والولاء مع جمهورك عبر مشاركة تجاربك."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  <div className="text-right">
                    <div className="text-sm font-bold">تجارب شخصية</div>
                    <div className="text-[10px] text-purple-400/70">لبناء الثقة والولاء</div>
                  </div>
                </button>

                {/* 2. الانتشار السريع */}
                <button 
                  onClick={handleViralInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-emerald-300 py-3 px-3 rounded-xl font-medium border border-emerald-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يستغل المواضيع الرائجة لجلب مشاهدات سريعة."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                  <div className="text-right">
                    <div className="text-sm font-bold">ترند وسوق</div>
                    <div className="text-[10px] text-emerald-400/70">للانتشار السريع (Reach)</div>
                  </div>
                </button>

                {/* 3. قنابل الحفظ */}
                <button 
                  onClick={handleRoadmapInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-amber-400 py-3 px-3 rounded-xl font-medium border border-amber-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يقدم قيمة مركزة تجبر المتابع على حفظ المنشور للعودة إليه."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">🗺️</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">خرائط وأدوات</div>
                    <div className="text-[10px] text-amber-400/70">لرفع نسبة الحفظ (Saves)</div>
                  </div>
                </button>

                {/* 4. إثارة الجدل */}
                <button 
                  onClick={handleControversialInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-rose-400 py-3 px-3 rounded-xl font-medium border border-rose-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يهاجم فكرة شائعة لإشعال خانة التعليقات."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">🔥</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">كسر المسلمات</div>
                    <div className="text-[10px] text-rose-400/70">لزيادة التعليقات (Comments)</div>
                  </div>
                </button>

                {/* 5. صائد العملاء */}
                <button 
                  onClick={handleCaseStudyInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-blue-400 py-3 px-3 rounded-xl font-medium border border-blue-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يعرض أرقاماً ونتائج حقيقية لجذب العملاء المحتملين."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">📊</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">دراسات حالة</div>
                    <div className="text-[10px] text-blue-400/70">لجذب العملاء (Leads)</div>
                  </div>
                </button>

                {/* 🌟 6. الزر الجديد: كفاح وإنتاجية (Hero's Journey) */}
                <button 
                  onClick={handleJourneyInspiration} 
                  disabled={isSuggesting}
                  className="bg-slate-800/80 hover:bg-slate-700 text-indigo-400 py-3 px-3 rounded-xl font-medium border border-indigo-500/30 transition-all flex items-center justify-start gap-2 disabled:opacity-50"
                  title="يشارك كواليس تعلمك، تقسيم وقتك، وكيفية إنجاز المشاريع لربط المتابع بك عاطفياً."
                >
                  {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <span className="text-lg">⏳</span>}
                  <div className="text-right">
                    <div className="text-sm font-bold">كفاح وإنتاجية</div>
                    <div className="text-[10px] text-indigo-400/70">لصناعة جمهور وفي (Super Fans)</div>
                  </div>
                </button>
{/* 🌟 7. الزر المَلَكي: خرائط الإتقان من الصفر للاحتراف */}
                <button 
                  onClick={handleMasteryInspiration} 
                  disabled={isSuggesting}
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-medium border border-indigo-500/50 transition-all flex items-center justify-between gap-4 disabled:opacity-50 md:col-span-2 lg:col-span-3 shadow-[0_0_20px_rgba(79,70,229,0.2)] mt-2"
                  title="خلاصات مكثفة وخطوات عملية لتعلم مهاراتك التقنية المعقدة في وقت قياسي."
                >
                  <div className="flex items-center gap-3">
                    {isSuggesting ? <Loader2 size={24} className="animate-spin text-indigo-300" /> : <span className="text-2xl">🚀</span>}
                    <div className="text-right">
                      <div className="text-base font-bold text-indigo-100">خرائط الإتقان (Zero to Hero)</div>
                      <div className="text-xs text-indigo-300/80">خطوات عملية لتعلم (Full-Stack, AI, Trading) في وقت قياسي</div>
                    </div>
                  </div>
                  <span className="hidden md:inline-block bg-indigo-500/30 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/50">
                    الأكثر طلباً 🔥
                  </span>
                </button>


              </div>
            </div>
            
            <textarea 
              placeholder="اكتب فكرتك هنا أو اضغط على أحد الأزرار العلوية لجلب فكرة استراتيجية..." 
              className="w-full p-5 bg-[#020408] border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600 resize-none h-32 text-lg mb-6 shadow-inner"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* 🌟 شريط التحكم بعدد الشرائح */}
            <div className="mb-8 bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <label className="text-slate-200 font-bold flex items-center gap-2">
                  <PenTool size={18} className="text-purple-400"/> اختر عدد شرائح القصة:
                </label>
                <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg">
                  {slideCount} شرائح
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold">
                <span>5 (قصير)</span>
                <span>8 (فيروسي مثالي)</span>
                <span>10 (دسم جداً)</span>
              </div>
            </div>

            <button 
              onClick={handleGeneratePrompts}
              disabled={isLoading || !topic}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-5 rounded-2xl font-bold text-xl transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? <><Loader2 size={26} className="animate-spin" /> جاري كتابة السيناريو السري...</> : '⚡ توليد السيناريو والبرومبتات'}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          المرحلة 2: استوديو الإخراج (اختيار البرومبت ورفع الصور)
          ========================================== */}
      {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-xl mb-8 flex items-start gap-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <span className="text-2xl">🎬</span>
                  <div>
                      <h4 className="font-bold text-purple-300">كرسي المخرج: اختر لقطاتك!</h4>
                      <p className="text-sm text-purple-200/80 mt-1">
                          لكل شريحة، وفرنا لك زاوية تصوير (جمالية/غامضة) وزاوية (واقعية بوجهك). انسخ البرومبت الذي يخدم قصتك بشكل أفضل، ولده في Gemini، ثم ارفع الصورة هنا.
                      </p>
                  </div>
              </div>
{/* قسم أزرار الذكاء الاصطناعي والصور */}
              <div className="mb-8 p-6 bg-slate-900/60 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  
                  {!storySlides[0]?.technicalPrompt ? (
                      // زر التوليد السينمائي يظهر أولاً
                      <div className="flex-1 flex items-center justify-between w-full">
                          <div>
                              <h4 className="text-xl font-bold text-indigo-300">النصوص جاهزة!</h4>
                              <p className="text-sm text-indigo-200/70">اضغط لتوليد 5 زوايا إخراجية لكل شريحة.</p>
                          </div>
                          <button onClick={handleGenerateCinematics} disabled={isGeneratingCinematics} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                              {isGeneratingCinematics ? <Loader2 size={20} className="animate-spin" /> : <span className="text-xl">🎬</span>}
                              توليد اللقطات السينمائية
                          </button>
                      </div>
                  ) : (
                      // زر المستشار يظهر بعد توليد اللقطات
                      <div className="flex-1 flex items-center justify-between w-full">
                          <div>
                              <h4 className="text-xl font-bold text-amber-400">حائر بين اللقطات؟ 👑</h4>
                              <p className="text-sm text-amber-200/70">اسمح لمستشار Growth Hacking باختيار اللقطة الفيروسية الأفضل لك.</p>
                          </div>
                          <button onClick={handleGetExpertAdvice} disabled={isConsulting} className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                              {isConsulting ? <Loader2 size={20} className="animate-spin" /> : <span className="text-xl">🧠</span>}
                              استشارة الخبير الاستراتيجي
                          </button>
                      </div>
                  )}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {storySlides.map((slide, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl relative">
                          
{/* الهيدر (العنوان والنص - مع ميزة التحرير) */}
                          <div className="bg-slate-900 p-5 border-b border-slate-700 relative">
                              <div className="flex justify-between items-start mb-3">
                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full inline-block">
                                    الشريحة {slide.slideNumber}
                                </span>
                                
                                {/* زر القلم لفتح وضع التحرير */}
                                {editingSlideIndex !== idx && (
                                    <button 
                                        onClick={() => handleEditClick(idx, slide)}
                                        className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                    >
                                        <PenTool size={14} /> تعديل النصوص
                                    </button>
                                )}
                              </div>

                              {/* وضع القراءة (العادي) */}
                              {editingSlideIndex !== idx ? (
                                  <>
                                      <h4 className="text-white text-xl font-bold mb-2">{slide.title}</h4>
                                      <p className="text-slate-400 text-sm">"{slide.text}"</p>
                                  </>
                              ) : (
                                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                                      {/* 🌟 وضع التحرير (Edit Mode) */}
                                      {/* حقل العنوان */}
                                      <div className="relative">
                                          <label className="text-[10px] text-slate-500 absolute -top-2.5 right-3 bg-slate-900 px-1 font-bold">العنوان (لا تنسَ النجمتين * *)</label>
                                          <input 
                                              type="text" 
                                              value={editForm.title}
                                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                              className="w-full bg-slate-800 border border-indigo-500/50 text-white rounded-lg p-3 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                          />
                                      </div>
                                      
                                      {/* حقل النص */}
                                      <div className="relative">
                                          <label className="text-[10px] text-slate-500 absolute -top-2.5 right-3 bg-slate-900 px-1 font-bold">النص التوضيحي (قصير ومباشر)</label>
                                          <textarea 
                                              value={editForm.text}
                                              onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                                              className="w-full bg-slate-800 border border-indigo-500/50 text-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-20 resize-none"
                                          />
                                      </div>

                                      {/* أزرار التحكم في وضع التحرير */}
                                      <div className="flex gap-2 justify-end mt-2">
                                          <button 
                                              onClick={handleCancelEdit}
                                              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                          >
                                              إلغاء
                                          </button>
                                          
                                          {/* زر السحر الاصطناعي (AI Rewrite) */}
                                          <button 
                                              onClick={() => handleAiRewrite(idx)}
                                              disabled={isRewriting}
                                              className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)] disabled:opacity-50"
                                          >
                                              {isRewriting ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                              صياغة سحرية أقوى
                                          </button>

                                          {/* زر الحفظ اليدوي */}
                                          <button 
                                              onClick={() => handleSaveEdit(idx)}
                                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                          >
                                              <CheckCircle2 size={14} /> حفظ التعديل
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>

{/* 🌟 قسم اختيار البرومبت (الزوايا الخمس) */}
                          <div className="p-5 flex-1 flex flex-col gap-4">
{/* رأس قسم اللقطات مع زر التحديث */}
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-bold text-slate-300">اختر زاوية الإخراج السينمائي:</p>
                                    
                                    {/* 🔄 زر تحديث اللقطات لهذه الشريحة فقط */}
                                    <button 
                                        onClick={() => handleRegenerateSinglePrompts(idx)}
                                        disabled={regeneratingPromptsIndex === idx}
                                        className="text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                                        title="توليد لقطات جديدة تتناسب مع النص الحالي"
                                    >
                                        {regeneratingPromptsIndex === idx ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                        تحديث اللقطات
                                    </button>
                                </div>

                                {expertAdvice[slide.slideNumber] && (
                                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 animate-pulse">
                                        تم تحديد الخيار الأمثل 👑
                                    </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                  {/* دالة مساعدة لتحديد ستايل اللقطة الفائزة */}
                                  {['vibePrompt', 'facePrompt', 'povPrompt', 'emotionPrompt', 'technicalPrompt'].map((promptKey, pIdx) => {
                                      const isWinner = expertAdvice[slide.slideNumber]?.bestShotKey === promptKey;
                                      const promptTitles = {
                                          vibePrompt: "🌌 لقطة أجواء (B-Roll)",
                                          facePrompt: "👤 لقطة الهوية (وجهك)",
                                          povPrompt: "📱 الإثبات (شاشة/POV)",
                                          emotionPrompt: "🎭 المشاعر (دراما/إرهاق)",
                                          technicalPrompt: "📝 الشرح التقني (شاشة كود/سبورة)"
                                      };

                                      return (
                                          <div key={pIdx} className={`group relative p-3 rounded-xl border transition-all ${
                                              isWinner 
                                              ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]' 
                                              : 'bg-slate-900/50 hover:bg-slate-900 border-slate-700'
                                          } ${promptKey === 'technicalPrompt' ? 'lg:col-span-2' : ''}`}>
                                              
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className={`text-[11px] font-bold ${isWinner ? 'text-amber-400' : 'text-slate-400'}`}>
                                                      {promptTitles[promptKey]} {isWinner && '👑'}
                                                  </span>
                                                  <button onClick={() => handleCopy(slide[promptKey], `${promptKey}_${idx}`)} className={`p-1.5 rounded transition-colors disabled:opacity-50 ${isWinner ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} disabled={!slide[promptKey]}>
                                                      {copiedIndex === `${promptKey}_${idx}` ? <CheckCircle2 size={14} className="text-white"/> : <Copy size={14} />}
                                                  </button>
                                              </div>
                                              
                                              <p className={`text-[10px] font-mono line-clamp-2 group-hover:line-clamp-none ${isWinner ? 'text-amber-100' : 'text-slate-400'}`}>
                                                  {slide[promptKey] || "اضغط لتوليد الإخراج..."}
                                              </p>

                                              {/* عرض تعليق المستشار أسفل اللقطة الفائزة */}
                                              {isWinner && (
                                                  <div className="mt-3 pt-3 border-t border-amber-500/30 text-[11px] text-amber-200 leading-relaxed font-bold bg-amber-900/40 p-2 rounded-lg">
                                                      💡 <strong>رأي المستشار:</strong> {expertAdvice[slide.slideNumber].reasoning}
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          
                          </div>
                          

                          {/* قسم رفع الصورة المختارة ومعاينتها */}
                          <div className="p-5 bg-slate-800/80 border-t border-slate-700 mt-auto">
                              {imagePreviews[`image_${slide.slideNumber}`] ? (
                                  // 🌟 حالة: تم رفع الصورة (عرض المعاينة)
                                  <div className="flex flex-col gap-3 w-full">
                                      <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-lg">
                                          <img 
                                              src={imagePreviews[`image_${slide.slideNumber}`]} 
                                              alt="Preview" 
                                              className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                          />
                                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                              تم الرفع ✅
                                          </div>
                                      </div>
                                      
                                      <div className="flex justify-between gap-3">
                                          <button 
                                              onClick={() => window.open(imagePreviews[`image_${slide.slideNumber}`], '_blank')}
                                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2"
                                          >
                                              <Eye size={16} /> تكبير
                                          </button>
                                          
                                          <label className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2">
                                              <RefreshCw size={16} /> تغيير
                                              <input 
                                                  type="file" 
                                                  accept="image/*" 
                                                  className="hidden"
                                                  onChange={(e) => handleImageUpload(slide.slideNumber, e.target.files[0])}
                                              />
                                          </label>
                                      </div>
                                  </div>
                              ) : (
                                  // 🌟 حالة: لم يتم رفع الصورة بعد (زر الرفع العادي)
                                  <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-slate-700/50 hover:bg-slate-600 transition-colors py-4 rounded-xl border-2 border-dashed border-slate-500 hover:border-slate-400">
                                      <span className="text-slate-300 flex items-center gap-2 text-sm font-medium">
                                          <Upload size={20}/> ارفع الصورة التي ولدتها هنا
                                      </span>
                                      <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          onChange={(e) => handleImageUpload(slide.slideNumber, e.target.files[0])}
                                      />
                                  </label>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* زر الطباعة النهائي */}
              <div className="mt-10 flex justify-end">
                  <button 
                      onClick={handleStampImages}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold text-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3"
                  >
                      {isLoading ? '⏳ جاري دمج الصور والنصوص...' : <><PenTool size={24}/> طباعة التصميم النهائي للقصة</>}
                  </button>
              </div>
          </div>
      )}

      {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center gap-3">
                  <ImageIcon size={32} className="text-emerald-400" /> العمل الفني جاهز
                </h3>
                <button onClick={() => {setStep(1); setStorySlides([]); setUploadedImages({}); setTopic('');}} className="text-slate-400 hover:text-white underline font-medium">بدء مشروع جديد</button>
              </div>
              
              <div className="flex gap-8 overflow-x-auto pb-8 pt-2 px-2 custom-scrollbar">
                {finalImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={`http://localhost:5000/${img}`} 
                    alt={`Final Slide ${idx+1}`} 
                    className="h-[650px] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default StoryLab;