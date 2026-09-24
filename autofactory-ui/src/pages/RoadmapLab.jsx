import React, { useState } from 'react';
import axios from 'axios';
import { Copy, CheckCircle2, Wand2, Share2, ImageIcon } from 'lucide-react'; // استيراد أيقونات أنيقة

const RoadmapLab = () => {
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false); 
  const [images, setImages] = useState([]); 
  
  // 🚀 حالات جديدة لتخزين النصوص الوصفية والبرومبت السحري
  const [caption, setCaption] = useState('');
  const [magicPrompt, setMagicPrompt] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // دالة النسخ مع تغيير حالة الزر مؤقتاً
  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // دالة جلب الإلهام
  const fetchInspiration = async (type) => {
    setIsInspiring(true);
    setTopic('⏳ جاري استخراج فكرة عبقرية...'); 
    
    try {
      const res = await axios.post('http://localhost:5000/api/inspire-roadmap', { type });
      if (res.data.success) {
        setTopic(res.data.idea);
      }
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      setTopic('');
      alert('حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي');
    }
    
    setIsInspiring(false);
  };

  // دالة التوليد الرئيسية
  const handleGenerate = async () => {
    setIsLoading(true);
    setImages([]); 
    setCaption(''); // تصفير النص القديم
    setMagicPrompt(''); // تصفير البرومبت القديم

    try {
      const res = await axios.post('http://localhost:5000/api/generate-roadmap', { 
          topic, 
          platform,
          slideCount: 6 
      });
      
      if (res.data.success) {
setImages([
    ...(res.data.images.instagram || []), 
    ...(res.data.images.facebook || [])
]);        
        // 🚀 استقبال النص الوصفي من السيرفر
        setCaption(res.data.caption || 'لم يتم توليد وصف لهذه الخريطة.');
        
        // 🚀 توليد البرومبت السحري تلقائياً بناءً على الموضوع الذي تم إدخاله
        const generatedPrompt = `إليك صورة غلاف لمنشور كاروسيل (Carousel) غير مكتملة بخلفية داكنة (Dark Mode).\nموضوع المنشور هو: "${topic}".\n\nمهمتك هي العمل كخبير دمج وتصميم ثلاثي الأبعاد (3D Artist & Compositor):\n1. قم بتوليد عنصر 3D أيقوني، فخم، وحديث يعبر بدقة عن هذا الموضوع.\n2. يجب أن يكون العنصر 3D معزولاً ومركّزاً ببراعة في "المساحة الفارغة" الموجودة في منتصف الصورة.\n3. **قواعد صارمة جداً لتناسب الوضع الداكن:**\n   - حافظ على لون الخلفية الداكن الأصلي (لا تقم بتفتيحه أو إضافة سماء أو خلفيات معقدة).\n   - اجعل إضاءة العنصر الـ 3D (Lighting) تتناسب مع البيئة الداكنة لتبدو سينمائية وجذابة.\n   - أضف ظلالاً أرضية (Drop Shadow) خفيفة أو توهجاً (Glow) حول المجسم ليفصله عن الخلفية الداكنة باحترافية.\n   - لا تقم بتغيير، مسح، أو تشويه أي نص موجود في الصورة أو صورتي الشخصية الموجودة بالأسفل.`;
        setMagicPrompt(res.data.magicPrompt || generatedPrompt);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التوليد والتصميم');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen" dir="rtl">
      <h2 className="text-3xl font-bold mb-8 text-emerald-400">🗺️ صانع خرائط الطريق (Roadmap Lab)</h2>
      
      {/* اختيار المنصة */}
      <div className="flex gap-4 mb-8">
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'instagram' ? 'bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('instagram')}
          >إنستغرام</button>
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'facebook' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('facebook')}
          >فيسبوك</button>
          <button 
            className={`px-6 py-2 rounded-md font-bold transition-all ${platform === 'both' ? 'bg-teal-600 shadow-[0_0_15px_rgba(13,148,136,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setPlatform('both')}
          >كلاهما معاً</button>
      </div>

      {/* حقل الإدخال والأزرار */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-8">
          <input 
            type="text" 
            placeholder="أدخل فكرتك أو مجالك (مثال: بناء تطبيق SaaS، أو تحضير مقابلة عمل)"
            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white mb-4 outline-none focus:border-emerald-500 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
          {/* أزرار الإلهام */}
          <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => fetchInspiration('simple')} disabled={isInspiring} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm">
                 {isInspiring ? '⏳' : 'إلهام بسيط 🎯'}
              </button>
              
              <button onClick={() => fetchInspiration('viral')} disabled={isInspiring} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm">
                 {isInspiring ? '⏳' : 'إلهام فيروسي ✨'}
              </button>

              <button onClick={() => fetchInspiration('trend')} disabled={isInspiring} className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(234,88,12,0.4)]">
                 {isInspiring ? 'جاري البحث...' : 'التريند اليومي 🔥'}
              </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic || topic.includes('جاري')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
          >
            {isLoading ? '⏳ جاري هندسة وتصميم الكاروسيل...' : '⚡ صمم خريطة الطريق الآن'}
          </button>
      </div>

      {/* ==========================================
          👁️ عرض النتائج (الصور + النصوص)
          ========================================== */}
      {images.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* القسم الأيمن: استوديو الصور (يأخذ ثلثي المساحة) */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
                <ImageIcon size={24} /> الصور المنتجة:
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={`http://localhost:5000/${img}`} 
                    alt={`Slide ${idx+1}`} 
                    className="h-[450px] rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
            </div>

            {/* القسم الأيسر: النصوص والبرومبت السحري */}
            <div className="space-y-6">
              
              {/* صندوق الوصف (Caption) */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-blue-500/30 relative">
                <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Share2 size={18} /> الوصف الخاص بالمنشور (Caption)
                </h4>
                <textarea 
                  readOnly 
                  value={caption} 
                  className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar"
                />
                <button 
                  onClick={() => handleCopy(caption, setCopiedCaption)}
                  className="absolute bottom-6 left-6 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs"
                >
                  {copiedCaption ? <><CheckCircle2 size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ النص</>}
                </button>
              </div>

              {/* صندوق البرومبت السحري لجيميني */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-purple-500/30 relative shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Wand2 size={18} /> البرومبت السحري (لـ Gemini)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  قم بنسخ هذا النص والصقه في Gemini مع الصورة الأولى (الغلاف) لإضافة المجسم 3D.
                </p>
                <textarea 
                  readOnly 
                  value={magicPrompt} 
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-300 text-sm outline-none resize-none custom-scrollbar font-mono leading-relaxed"
                />
                <button 
                  onClick={() => handleCopy(magicPrompt, setCopiedPrompt)}
                  className="absolute bottom-6 left-6 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                >
                  {copiedPrompt ? <><CheckCircle2 size={16} className="text-green-400"/> تم النسخ</> : <><Copy size={16} /> نسخ البرومبت</>}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapLab;