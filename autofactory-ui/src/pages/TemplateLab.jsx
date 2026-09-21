import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Scale, Loader2, Image, Share2, Layers } from 'lucide-react'; // 👈 أضفنا أيقونة Layers للزر الجديد

export default function TemplateLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  const [images, setImages] = useState([]);

  const suggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-comparison-topic');
      if (res.data.success) {
        setTopic(res.data.topic); 
      }
    } catch (error) {
      console.error(error);
    }
    setIsSuggesting(false);
  };

  const generateComparison = async () => {
    if (!topic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-comparison', { topic, slideCount, platform });
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-900" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
        🧪 مختبر القوالب الذكية (Template Lab)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-colors duration-500 ${platform === 'instagram' ? 'bg-pink-600/10' : platform === 'facebook' ? 'bg-blue-600/10' : 'bg-teal-600/10'}`}></div>

          <div className="flex items-center gap-3 mb-4">
            <Scale className={platform === 'instagram' ? 'text-pink-400' : platform === 'facebook' ? 'text-blue-400' : 'text-teal-400'} size={32} />
            <h2 className="text-xl font-bold">قالب فضح الأدوات (The Expose)</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            مثالي للمقارنة بين أدوات عشوائية وأدوات ذكاء اصطناعي متخصصة.
          </p>

          {/* 👈 أزرار اختيار المنصة (مع الزر الثالث الجديد) */}
          <div className="flex gap-2 mb-6 w-full text-sm">
            <button
              onClick={() => setPlatform('instagram')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl font-bold transition-all border-2 ${
                platform === 'instagram' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-pink-900/30' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Image size={18} /> إنستغرام
            </button>
            <button
              onClick={() => setPlatform('facebook')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl font-bold transition-all border-2 ${
                platform === 'facebook' 
                  ? 'bg-blue-600 border-transparent text-white shadow-lg shadow-blue-900/30' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Share2 size={18} /> فيسبوك
            </button>
            <button
              onClick={() => setPlatform('both')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl font-bold transition-all border-2 ${
                platform === 'both' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-transparent text-white shadow-lg shadow-teal-900/30' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Layers size={18} /> كلاهما معاً
            </button>
          </div>
          
          <div className="flex flex-col gap-3 mb-6 flex-1">
            <div className="flex gap-2 w-full">
              <button 
                onClick={suggestTopic}
                disabled={isSuggesting}
                title="اقترح لي فكرة تريند"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center shrink-0 w-12 disabled:opacity-50"
              >
                {isSuggesting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
              
              <input 
                type="text" 
                placeholder="عن ماذا المقارنة؟" 
                className="flex-1 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-bold transition-all"
            >
              <option value="4">مختصر (4 شرائح)</option>
              <option value="6">متوسط (6 شرائح)</option>
              <option value="8">دسم (8 شرائح)</option>
              <option value="10">موسوعي (10 شرائح)</option>
            </select>
          </div>
          
          <button 
            onClick={generateComparison}
            disabled={loading || !topic}
            className={`w-full p-4 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg mt-auto ${
              platform === 'instagram' ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/30' : platform === 'facebook' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30' : 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/30'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                جاري التصميم لـ {platform === 'instagram' ? 'إنستغرام' : platform === 'facebook' ? 'فيسبوك' : 'المنصتين معاً'}...
              </>
            ) : (
              '✨ صمم الكاروسيل الآن'
            )}
          </button>
        </div>

        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-slate-600 border-dashed">
          <Sparkles size={40} className="mb-3 opacity-20" />
          <p className="font-medium">قوالب أخرى قريباً...</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4 flex items-center gap-2">
            🖼️ النتيجة النهائية لـ ({platform === 'both' ? 'إنستغرام + فيسبوك' : platform}):
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={`http://localhost:5000/${img}`} 
                alt={`Slide ${idx+1}`} 
                className="h-96 rounded-xl shadow-2xl border border-slate-700 flex-shrink-0 hover:scale-[1.02] transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}