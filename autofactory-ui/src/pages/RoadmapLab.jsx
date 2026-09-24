import React, { useState } from 'react';
import axios from 'axios';

const RoadmapLab = () => {
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false); // حالة تحميل أزرار الإلهام
  const [images, setImages] = useState([]); // 👈 أضف هذا السطر


  // دالة جلب الإلهام من الباك إند
  const fetchInspiration = async (type) => {
    setIsInspiring(true);
    setTopic('⏳ جاري استخراج فكرة عبقرية...'); // تأثير بصري للمستخدم
    
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

const handleGenerate = async () => {
    setIsLoading(true);
    setImages([]); // تصفير الصور القديمة
    try {
      // نرسل الموضوع والمنصة وعدد الشرائح (اخترنا 6 كافتراضي)
      const res = await axios.post('http://localhost:5000/api/generate-roadmap', { 
          topic, 
          platform,
          slideCount: 6 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التوليد والتصميم');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-right">🗺️ صانع خرائط الطريق (Roadmap Lab)</h2>
      
      {/* اختيار المنصة */}
      <div className="flex justify-end gap-4 mb-8">
         <button 
            className={`px-6 py-2 rounded-md transition-colors ${platform === 'both' ? 'bg-slate-700' : 'bg-slate-800'}`}
            onClick={() => setPlatform('both')}
          >كلاهما معاً</button>
          <button 
            className={`px-6 py-2 rounded-md transition-colors ${platform === 'facebook' ? 'bg-blue-600' : 'bg-slate-800'}`}
            onClick={() => setPlatform('facebook')}
          >فيسبوك</button>
          <button 
            className={`px-6 py-2 rounded-md transition-colors ${platform === 'instagram' ? 'bg-pink-600' : 'bg-slate-800'}`}
            onClick={() => setPlatform('instagram')}
          >إنستغرام</button>
      </div>

      {/* حقل الإدخال والأزرار */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-8 text-right">
          <h3 className="text-xl font-bold mb-4 text-emerald-400">🗺️ فكرة خريطة الطريق</h3>
          <input 
            type="text" 
            placeholder="أدخل فكرتك أو مجالك (مثال: بناء تطبيق SaaS، أو تحضير مقابلة عمل)"
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-4 text-white mb-4 text-right outline-none focus:border-emerald-500 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
{/* أزرار الإلهام المربوطة بالخادم */}
          <div className="flex flex-wrap justify-end gap-3 mb-6">
              <button 
                onClick={() => fetchInspiration('simple')}
                disabled={isInspiring}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
              >
                 {isInspiring ? '⏳' : 'إلهام بسيط 🎯'}
              </button>
              
              <button 
                onClick={() => fetchInspiration('viral')}
                disabled={isInspiring}
                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 font-bold text-sm"
              >
                 {isInspiring ? '⏳' : 'إلهام فيروسي ✨'}
              </button>

              {/* 🚀 الزر الجديد: التريند اليومي */}
              <button 
                onClick={() => fetchInspiration('trend')}
                disabled={isInspiring}
                className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 font-bold text-sm shadow-[0_0_10px_rgba(234,88,12,0.4)]"
              >
                 {isInspiring ? 'جاري البحث...' : 'التريند اليومي 🔥'}
              </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic || topic.includes('جاري')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-md font-bold text-xl transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/50"
          >
            {isLoading ? '⏳ جاري هندسة وتصميم الكاروسيل...' : '⚡ صمم خريطة الطريق'}
          </button>
      </div>
      {/* عرض الصور الناتجة */}
      {images.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right">
          <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4 text-emerald-400">
            🖼️ النتيجة النهائية:
          </h3>
          <div className="flex flex-row-reverse gap-4 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={`http://localhost:5000/${img}`} 
                alt={`Slide ${idx+1}`} 
                className="h-96 rounded-xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapLab;