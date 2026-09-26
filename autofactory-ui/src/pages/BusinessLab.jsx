import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, Loader2, Image as ImageIcon, Share2, Send, CheckCircle, TrendingUp } from 'lucide-react';

export default function BusinessLab() {
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

  // إلهام أفكار الربح والأعمال
  const suggestBusinessTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-business-roadmap');
      if (res.data.success) setTopic(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // توليد خريطة الأرباح
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
        setIgCaption(res.data.igCaption || '');
        setFbCaption(res.data.fbCaption || '');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التوليد');
    }
    setLoading(false);
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
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-3xl font-bold mb-8 text-slate-100 flex items-center justify-center gap-3">
            👁️ استوديو مراجعة المشاريع
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {(platform === 'instagram' || platform === 'both') && (
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-pink-500/20 shadow-2xl">
                <h4 className="font-bold text-pink-400 mb-6 flex items-center gap-2"><ImageIcon size={22}/> نسخة إنستغرام</h4>
                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                  {images.instagram.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="IG Slide"/>
                  ))}
                </div>
                <textarea 
                  value={igCaption} onChange={(e) => setIgCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-[#020408] border border-slate-800 rounded-xl text-slate-300 outline-none focus:border-pink-500 custom-scrollbar leading-relaxed"
                />
              </div>
            )}

            {(platform === 'facebook' || platform === 'both') && (
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-blue-500/20 shadow-2xl">
                <h4 className="font-bold text-blue-400 mb-6 flex items-center gap-2"><Share2 size={22}/> نسخة فيسبوك</h4>
                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                  {images.facebook.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-72 rounded-xl shadow-lg border border-slate-800" alt="FB Slide"/>
                  ))}
                </div>
                <textarea 
                  value={fbCaption} onChange={(e) => setFbCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-[#020408] border border-slate-800 rounded-xl text-slate-300 outline-none focus:border-blue-500 custom-scrollbar leading-relaxed"
                />
              </div>
            )}
          </div>

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