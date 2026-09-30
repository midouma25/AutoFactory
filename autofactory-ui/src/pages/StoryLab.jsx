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

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {storySlides.map((slide, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl relative">
                          
                          {/* الهيدر (ما سيظهر للمتابع) */}
                          <div className="bg-slate-900 p-5 border-b border-slate-700">
                              <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">الشريحة {slide.slideNumber}</span>
                              <h4 className="text-white text-xl font-bold mb-2">{slide.title}</h4>
                              <p className="text-slate-400 text-sm">"{slide.text}"</p>
                          </div>

                          {/* قسم اختيار البرومبت */}
                          <div className="p-5 flex-1 flex flex-col gap-4">
                              <p className="text-sm font-bold text-slate-300">اختر أسلوب اللقطة لنسخه:</p>
                              
                              {/* خيار 1: الأجواء (بدون وجه) */}
                              <div className="group relative bg-slate-900/50 hover:bg-slate-900 transition-colors p-4 rounded-xl border border-slate-700 hover:border-purple-500/50">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-purple-400 flex items-center gap-2">
                                          🌌 لقطة الأجواء (Aesthetic / B-Roll)
                                      </span>
                                      <button 
                                          onClick={() => handleCopy(slide.vibePrompt || slide.geminiPrompt || "حدث خطأ في التوليد، حاول مرة أخرى", `vibe_${idx}`)}
                                          className="text-slate-400 hover:text-white bg-slate-800 hover:bg-purple-600 p-1.5 rounded-md transition-all"
                                      >
                                          {copiedIndex === `vibe_${idx}` ? <CheckCircle2 size={16} className="text-white"/> : <Copy size={16} />}
                                      </button>
                                  </div>
                                  <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                      {slide.vibePrompt || slide.geminiPrompt || "⚠️ فشل الذكاء الاصطناعي في توليد هذا الخيار."}
                                  </p>
                              </div>

                              {/* خيار 2: الواقعية (مع الوجه) */}
                              <div className="group relative bg-slate-900/50 hover:bg-slate-900 transition-colors p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                                          👤 لقطة واقعية (تظهر أنت فيها)
                                      </span>
                                      <button 
                                          onClick={() => handleCopy(slide.facePrompt || slide.geminiPrompt || "حدث خطأ في التوليد، حاول مرة أخرى", `face_${idx}`)}
                                          className="text-slate-400 hover:text-white bg-slate-800 hover:bg-emerald-600 p-1.5 rounded-md transition-all"
                                      >
                                          {copiedIndex === `face_${idx}` ? <CheckCircle2 size={16} className="text-white"/> : <Copy size={16} />}
                                      </button>
                                  </div>
                                  <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                      {slide.facePrompt || "⚠️ قم بتوليد السيناريو مرة أخرى للحصول على هذا الخيار المخصص."}
                                  </p>
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