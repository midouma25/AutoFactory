import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Layers, Loader2, Image as ImageIcon, Share2, Send, CheckCircle } from 'lucide-react';

export default function TripleTemplateLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // جلب فكرة تريند
  const suggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-comparison-topic');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // توليد القالب الثلاثي
  const generateTriple = async () => {
    if (!topic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      // 🚀 إرسال الطلب إلى المسار الجديد (generate-triple)
      const res = await axios.post('http://localhost:5000/api/generate-triple', { 
        topic, 
        count: slideCount, 
        platform 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
        setIgCaption(res.data.igCaption || '');
        setFbCaption(res.data.fbCaption || '');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
  };

  // النشر (يستخدم نفس مسار النشر الموحد!)
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', {
        platform,
        images,
        igCaption,
        fbCaption
      });
      if (res.data.success) {
        setPublishSuccess(true);
      }
    } catch (error) {
      console.error(error); alert('فشل النشر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-900" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-amber-400 flex items-center gap-3">
        🚀 قالب المقارنة الثلاثية (سيئ، جيد، احترافي)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-amber-500 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-amber-400" size={32} />
            <h2 className="text-xl font-bold">إعدادات الكاروسيل الثلاثي</h2>
          </div>

          <div className="flex gap-2 mb-6 w-full text-sm">
            <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'instagram' ? 'bg-pink-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>إنستغرام</button>
            <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>فيسبوك</button>
            <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border-2 ${platform === 'both' ? 'bg-teal-600 border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>كلاهما معاً</button>
          </div>
          
          <div className="flex flex-col gap-3 mb-6 w-full">
            <div className="flex gap-2 w-full">
              <button 
                onClick={suggestTopic} 
                disabled={isSuggesting} 
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center shrink-0 w-12 disabled:opacity-50"
              >
                {isSuggesting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
              
              <input 
                type="text" 
                placeholder="عن ماذا ستتحدث؟ (مثال: توليد الفيديوهات)" 
                className="flex-1 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-bold transition-all"
            >
              <option value="4">مختصر (4 شرائح)</option>
              <option value="6">متوسط (6 شرائح)</option>
              <option value="8">دسم (8 شرائح)</option>
            </select>
          </div>

          <button onClick={generateTriple} disabled={loading || !topic} className="w-full p-4 mt-auto rounded-xl font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-50 flex justify-center items-center gap-2">
            {loading ? <><Loader2 size={20} className="animate-spin" /> جاري التصميم...</> : '✨ صمم الكاروسيل الثلاثي'}
          </button>
        </div>
      </div>

      {/* غرفة المراجعة والنشر (Review Studio) */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
            👁️ غرفة المراجعة (Review Studio)
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {(platform === 'instagram' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-pink-500/30">
                <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={20}/> نسخة إنستغرام</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.instagram.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="IG Slide"/>
                  ))}
                </div>
                <textarea 
                  value={igCaption} onChange={(e) => setIgCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 custom-scrollbar"
                />
              </div>
            )}

            {(platform === 'facebook' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/30">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><Share2 size={20}/> نسخة فيسبوك</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.facebook.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="FB Slide"/>
                  ))}
                </div>
                <textarea 
                  value={fbCaption} onChange={(e) => setFbCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 custom-scrollbar"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-green-600/20 text-green-400 border border-green-500 p-4 rounded-xl font-bold flex items-center gap-2 text-xl">
                <CheckCircle size={28} /> تم النشر بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {publishing ? <><Loader2 size={28} className="animate-spin" /> جاري الإطلاق...</> : <><Send size={28} /> اعتمد المحتوى وانشر فوراً 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}