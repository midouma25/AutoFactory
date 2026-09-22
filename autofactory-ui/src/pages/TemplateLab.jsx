import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Scale, Loader2, Image as ImageIcon, Share2, Layers, Send, CheckCircle, Target } from 'lucide-react';

export default function TemplateLab() {
  // ----------------------------------------------------
  // States المشتركة 
  // ----------------------------------------------------
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); 
  
  // ----------------------------------------------------
  // States: المقارنة الثنائية (Classic AI vs Trad)
  // ----------------------------------------------------
  const [basicTopic, setBasicTopic] = useState('');
  const [basicSlideCount, setBasicSlideCount] = useState(6);

  // ----------------------------------------------------
  // States: المقارنة الثلاثية (The Expose)
  // ----------------------------------------------------
  const [tripleTopic, setTripleTopic] = useState('');
  const [tripleSlideCount, setTripleSlideCount] = useState(6);

  // ----------------------------------------------------
  // States: غرفة المراجعة (Review Studio)
  // ----------------------------------------------------
  const [images, setImages] = useState({ instagram: [], facebook: [] });
  const [igCaption, setIgCaption] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // ==========================================
  // دوال الإلهام (Inspiration Fetchers)
  // ==========================================
  
  // إلهام بسيط (موضوع قصير ومباشر)
  const suggestBasicTopic = async (setTopicFunction) => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-basic-topic');
      if (res.data.success) setTopicFunction(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // إلهام فيروسي (موضوع شامل وتريند)
  const suggestViralTopic = async (setTopicFunction) => {
    setIsSuggesting(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-comparison-topic');
      if (res.data.success) setTopicFunction(res.data.topic); 
    } catch (error) { console.error(error); }
    setIsSuggesting(false);
  };

  // ==========================================
  // دوال التوليد (Generation Triggers)
  // ==========================================

  // توليد الكاروسيل الثنائي
  const generateBasicComparison = async () => {
    if (!basicTopic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-comparison', { 
        topic: basicTopic, 
        slideCount: basicSlideCount, 
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

  // توليد الكاروسيل الثلاثي
  const generateTripleComparison = async () => {
    if (!tripleTopic) return alert('اكتب الموضوع أو اضغط على زر الإلهام أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-triple', { 
        topic: tripleTopic, 
        count: tripleSlideCount, 
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

  // ==========================================
  // دالة النشر (Publishing)
  // ==========================================
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/publish-omni', {
        platform, images, igCaption, fbCaption
      });
      if (res.data.success) setPublishSuccess(true);
    } catch (error) {
      console.error(error); alert('فشل النشر. تأكد من إعدادات السيرفر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-slate-900" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
        🧪 مختبر القوالب الذكية (Template Lab)
      </h1>
      
      {/* ==========================================
          محدد المنصة الرئيسي (Global Platform Selector)
          ========================================== */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-2 mb-8 mx-auto max-w-2xl text-sm shadow-lg">
        <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'instagram' ? 'bg-pink-600 border-transparent text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-pink-500/50'}`}>إنستغرام</button>
        <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-500/50'}`}>فيسبوك</button>
        <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${platform === 'both' ? 'bg-teal-600 border-transparent text-white shadow-[0_0_15px_rgba(13,148,136,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-teal-500/50'}`}>كلاهما معاً</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* ==========================================
            1. بطاقة: المقارنة الثنائية (التريند)
            ========================================== */}
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-emerald-500/50 flex flex-col hover:border-emerald-500 transition-colors shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Scale className="text-emerald-400" size={32} />
              <h2 className="text-xl font-bold text-emerald-50">المقارنة الثنائية (التريند)</h2>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">سريع ومباشر</span>
          </div>

          <div className="flex flex-col gap-4 mb-6 w-full">
            <input 
              type="text" 
              placeholder="اكتب فكرة تريند (مثال: توليد الفيديو بالذكاء الاصطناعي)" 
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              value={basicTopic}
              onChange={(e) => setBasicTopic(e.target.value)}
            />
            
            {/* 👈 أزرار الإلهام المطابقة للصورة المرجعية */}
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => suggestBasicTopic(setBasicTopic)} 
                disabled={isSuggesting} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-600"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                <span className="text-sm">إلهام بسيط</span>
              </button>
              
              <button 
                onClick={() => suggestViralTopic(setBasicTopic)} 
                disabled={isSuggesting} 
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-900/20"
              >
                {isSuggesting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span className="text-sm">إلهام فيروسي</span>
              </button>
            </div>

            <select value={basicSlideCount} onChange={(e) => setBasicSlideCount(Number(e.target.value))} className="w-full mt-2 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 cursor-pointer font-bold transition-all text-sm">
              <option value="4">مختصر (4 شرائح)</option>
              <option value="6">متوسط (6 شرائح)</option>
              <option value="8">دسم (8 شرائح)</option>
            </select>
          </div>

          <button onClick={generateBasicComparison} disabled={loading || !basicTopic} className="w-full p-4 mt-auto rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex justify-center items-center gap-2 transition-all">
            {loading ? <><Loader2 size={20} className="animate-spin" /> جاري التصميم...</> : '⚡ صمم الكاروسيل الثنائي'}
          </button>
        </div>



      </div>

      {/* ==========================================
          👁️ غرفة المراجعة والنشر (Review Studio) المشتركة
          ========================================== */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 border-t border-slate-700 pt-8 mt-4">
          <h3 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            👁️ غرفة المراجعة والاعتماد
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* قسم إنستغرام */}
            {(platform === 'instagram' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-pink-500/30 shadow-2xl">
                <h4 className="font-bold text-pink-400 mb-4 flex items-center gap-2"><ImageIcon size={20}/> نسخة إنستغرام</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.instagram?.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000/${img}`} className="h-64 rounded-lg shadow-lg border border-slate-700" alt="IG Slide"/>
                  ))}
                </div>
                <textarea 
                  value={igCaption} onChange={(e) => setIgCaption(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 custom-scrollbar"
                />
              </div>
            )}

            {/* قسم فيسبوك */}
            {(platform === 'facebook' || platform === 'both') && (
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/30 shadow-2xl">
                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><Share2 size={20}/> نسخة فيسبوك</h4>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                  {images.facebook?.map((img, idx) => (
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

          {/* زر النشر النهائي */}
          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-green-600/20 text-green-400 border border-green-500 p-4 rounded-xl font-bold flex items-center gap-2 text-xl shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle size={28} /> تم النشر بنجاح على {platform === 'both' ? 'المنصتين!' : platform}
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {publishing ? <><Loader2 size={28} className="animate-spin" /> جاري الإطلاق للسيرفرات...</> : <><Send size={28} /> اعتمد المحتوى وانشر فوراً 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}