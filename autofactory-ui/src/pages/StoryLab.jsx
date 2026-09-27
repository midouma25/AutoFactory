import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen, Loader2, Image as ImageIcon, Share2, Send, CheckCircle, Copy, Sparkles, Wand2 } from 'lucide-react';

export default function StoryLab() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [platform, setPlatform] = useState('instagram'); 
  const [loading, setLoading] = useState(false);
  
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // أفكار ملهمة جاهزة للقصص البصرية
  const storyIdeas = [
    "من مبرمج تائه في الأكواد إلى بناء إضافة (Chrome Extension) تدر 100$ يومياً.",
    "كيف تحولت من تصميم مواقع رخيصة إلى إغلاق عقود بـ 2000$ باستخدام React.",
    "القصة الحقيقية: كيف ينقذك تعلم الـ Backend من ضياع أفكارك العظيمة.",
    "يوم في حياة مبرمج ذكاء اصطناعي: من فكرة على ورق إلى منتج SaaS شغال.",
    "لماذا يجب أن تتوقف عن مشاهدة الكورسات وتطرح أول مشروع لك اليوم."
  ];

  const handleSuggest = () => {
    const randomIdea = storyIdeas[Math.floor(Math.random() * storyIdeas.length)];
    setTopic(randomIdea);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateStory = async () => {
    if (!topic) return alert('اكتب فكرة القصة أولاً!');
    setLoading(true); setShowReview(false); setPublishSuccess(false);
    
    try {
      const res = await axios.post('http://localhost:5000/api/generate-story', { 
        topic, 
        slideCount 
      });
      
      if (res.data.success) {
        setImages(res.data.images);
        setCaption(res.data.caption || 'اكتب هنا الوصف...');
        setShowReview(true);
      }
    } catch (error) {
      console.error(error); alert('حدث خطأ أثناء التأليف والرسم.');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // نستخدم نفس مسار النشر Omni، نرسل نفس الكابشن والصور للمنصتين مؤقتاً
      const payloadImages = { instagram: images, facebook: images };
      const res = await axios.post('http://localhost:5000/api/publish-omni', { 
        platform, 
        images: payloadImages, 
        igCaption: caption, 
        fbCaption: caption 
      });
      if (res.data.success) setPublishSuccess(true);
    } catch (error) {
      console.error(error); alert('فشل النشر.');
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#05070A]" dir="rtl">
      {/* 📖 الهيدر الإبداعي */}
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 flex items-center gap-3">
        <BookOpen className="text-fuchsia-500" size={38} />
        استوديو القصص المصورة (StoryLab)
      </h1>
      
      {/* 🟢 محدد المنصة */}
      <div className="bg-slate-900 p-4 rounded-xl border border-fuchsia-500/20 flex gap-2 mb-8 mx-auto max-w-2xl text-sm shadow-[0_0_20px_rgba(217,70,239,0.05)]">
        <button onClick={() => setPlatform('instagram')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-pink-500/50'}`}>إنستغرام</button>
        <button onClick={() => setPlatform('facebook')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'facebook' ? 'bg-blue-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-blue-500/50'}`}>فيسبوك</button>
        <button onClick={() => setPlatform('both')} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${platform === 'both' ? 'bg-fuchsia-600 border-transparent text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-fuchsia-500/50'}`}>كلاهما معاً</button>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-fuchsia-500/30 flex flex-col shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-fuchsia-400" size={32} />
            <h2 className="text-2xl font-bold text-slate-100">ألف قصتك التقنية</h2>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            <textarea 
              placeholder="اكتب الفكرة، المشكلة، أو القصة التي تريد تحويلها لمانجا تقنية..." 
              className="w-full p-5 bg-[#020408] border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all placeholder:text-slate-600 resize-none h-32 text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-4 w-full">
              <button 
                onClick={handleSuggest} 
                className="flex-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20 text-lg"
              >
                <Wand2 size={24} />
                <span>إلهام قصة عشوائية ✨</span>
              </button>

              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-1/3 p-4 bg-[#020408] border border-slate-700 rounded-xl text-fuchsia-400 outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer font-bold transition-all text-lg text-center"
              >
                <option value="4">4 شرائح (قصيرة)</option>
                <option value="5">5 شرائح</option>
                <option value="6">6 شرائح (قياسية)</option>
                <option value="7">7 شرائح</option>
                <option value="8">8 شرائح (ملحمية)</option>
              </select>
            </div>
          </div>

          <button onClick={generateStory} disabled={loading || !topic} className="w-full p-5 mt-8 rounded-xl font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-500 disabled:opacity-50 flex justify-center items-center gap-3 text-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]">
            {loading ? <><Loader2 size={26} className="animate-spin" /> جاري الإخراج وتوليد الصور...</> : '🎬 صوّر القصة الآن'}
          </button>
        </div>
      </div>

      {/* 👁️ مسرح المراجعة */}
      {showReview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-3xl font-bold mb-8 text-slate-100 flex items-center justify-center gap-3">
            🍿 مسرح العرض الأول
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* 📸 قسم الصور المنتجة */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-fuchsia-500/20 shadow-2xl">
              <h4 className="font-bold text-fuchsia-400 mb-6 flex items-center gap-2"><ImageIcon size={22}/> الشرائح السينمائية</h4>
              <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar mb-4">
                {images.map((img, idx) => (
                  <img key={idx} src={`http://localhost:5000/${img}`} className="h-96 rounded-xl shadow-lg border border-slate-800 object-cover" alt="Story Slide"/>
                ))}
              </div>
            </div>

            {/* 📝 قسم النص */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col relative">
              <h4 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
                <BookOpen size={22} /> النص السينمائي (الكابشن)
              </h4>
              <textarea readOnly value={caption} className="flex-1 w-full bg-[#0F172A] border border-slate-700 rounded-xl p-4 text-slate-300 text-base outline-none resize-none custom-scrollbar leading-relaxed"/>
              <button onClick={handleCopy} className="absolute bottom-10 left-10 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg transition-all flex items-center gap-2 text-sm font-bold shadow-lg">
                {copied ? <><CheckCircle size={18} className="text-green-300"/> تم النسخ</> : <><Copy size={18} /> نسخ النص</>}
              </button>
            </div>
          </div>

          {/* زر النشر النهائي */}
          <div className="flex justify-center mb-20">
            {publishSuccess ? (
              <div className="bg-green-900/40 text-green-400 border border-green-500 p-5 rounded-2xl font-bold flex items-center gap-3 text-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle size={32} /> تم بث القصة بنجاح!
              </div>
            ) : (
              <button 
                onClick={handlePublish} disabled={publishing}
                className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-14 py-5 rounded-2xl font-bold text-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(217,70,239,0.3)] transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {publishing ? <><Loader2 size={32} className="animate-spin" /> جاري البث...</> : <><Send size={32} /> انشر القصة الآن 🚀</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}