import React, { useState } from 'react';
import axios from 'axios';
import { Video, Sparkles, Loader2, Music, Clapperboard, Copy, CheckCircle, Store, HeartPulse, ShoppingCart, GraduationCap } from 'lucide-react';

const CommercialLab = () => {
  const [productIdea, setProductIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [adVibe, setAdVibe] = useState('Cinematic & Emotional'); 
  const [brandColors, setBrandColors] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false); // حالة تحميل الإلهامات
  const [adData, setAdData] = useState(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 💡 دالة جلب إلهام السوق الجزائري
  const fetchAlgerianIdea = async (category) => {
    setIsSuggesting(true);
    setProductIdea('⏳ جاري ابتكار فكرة مشروع للسوق الجزائري...');
    setTargetAudience('⏳ جاري التحليل...');
    
    try {
      const res = await axios.post('http://localhost:5000/api/suggest-commercial-idea', { category });
      if (res.data.success) {
        const { productIdea, targetAudience, adVibe } = res.data.ideaData;
        setProductIdea(productIdea);
        setTargetAudience(targetAudience);
        
        // استخراج النمط الأساسي من الرد (تجاهل الشرح الذي بين الأقواس)
        const pureVibe = adVibe.split('(')[0].trim();
        setAdVibe(pureVibe);
        
        // اقتراح ألوان تلقائية إذا كانت فارغة
        if(!brandColors) {
            setBrandColors(category === 'healthcare' ? 'أزرق طبي وأبيض' : category === 'ecommerce' ? 'برتقالي وأسود' : 'أخضر داكن وذهبي');
        }
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جلب الفكرة.');
      setProductIdea('');
      setTargetAudience('');
    } finally {
      setIsSuggesting(false);
    }
  };

  const generateCommercial = async () => {
    if (!productIdea) {
        setError('الرجاء كتابة فكرة المنتج/البرنامج أولاً!');
        return;
    }
    
    setIsGenerating(true);
    setError('');
    setAdData(null);

    try {
      const res = await axios.post('http://localhost:5000/api/generate-commercial', { 
          productIdea,
          targetAudience,
          adVibe,
          brandColors
      });
      
      if (res.data.success) {
        setAdData(res.data.commercial);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء توليد السيناريو.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-gray-100 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-3 flex items-center justify-center gap-3">
            <Video className="text-red-500" size={36} />
            استوديو الإعلانات التجارية (CommercialLab)
          </h1>
          <p className="text-gray-400 text-lg">بناء إعلانات بجودة كوكاكولا وأبل بالذكاء الاصطناعي 🎥✨</p>
        </header>

        <div className="bg-gray-900 p-8 rounded-2xl border border-red-900/30 shadow-2xl mb-10">
          
          {/* ==========================================
              💡 أزرار استراتيجيات السوق الجزائري
              ========================================== */}
          <div className="mb-8">
            <label className="text-gray-300 font-bold mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500"/> الإلهام المزدوج (فكرة مشروع + إعلان للسوق الجزائري 🇩🇿):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={() => fetchAlgerianIdea('local_business')} disabled={isSuggesting}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <Store size={24} className="text-amber-500"/>
                <span className="text-xs font-bold text-center">رقمنة المحلات والخدمات</span>
              </button>
              <button 
                onClick={() => fetchAlgerianIdea('ecommerce')} disabled={isSuggesting}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={24} className="text-orange-500"/>
                <span className="text-xs font-bold text-center">حلول التجارة الإلكترونية</span>
              </button>
              <button 
                onClick={() => fetchAlgerianIdea('healthcare')} disabled={isSuggesting}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <HeartPulse size={24} className="text-blue-500"/>
                <span className="text-xs font-bold text-center">القطاع الطبي والعيادات</span>
              </button>
              <button 
                onClick={() => fetchAlgerianIdea('youth_edu')} disabled={isSuggesting}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <GraduationCap size={24} className="text-emerald-500"/>
                <span className="text-xs font-bold text-center">الطلبة والتعليم الحديث</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div className="md:col-span-2">
                  <label className="block text-red-400 font-bold mb-2 text-sm">عن ماذا الإعلان؟ (المنتج / البرنامج):</label>
                  <textarea
                    className="w-full bg-gray-950 text-white p-4 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all resize-none"
                    rows="2"
                    placeholder="اضغط على أحد الأزرار بالأعلى لاستلهام فكرة، أو اكتب فكرتك هنا..."
                    value={productIdea}
                    onChange={(e) => setProductIdea(e.target.value)}
                  />
              </div>

              <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">الجمهور المستهدف:</label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all"
                    placeholder="مثال: أصحاب الشركات والمشاريع الصغيرة"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
              </div>

              <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">ألوان هويتك البصرية (لدمجها في الفيديو):</label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all"
                    placeholder="مثال: أخضر زمردي وأسود"
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                  />
              </div>

              <div className="md:col-span-2">
                  <label className="block text-gray-400 font-bold mb-2 text-sm">النمط السينمائي (Vibe):</label>
                  <select
                    className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-red-500 outline-none transition-all cursor-pointer"
                    value={adVibe}
                    onChange={(e) => setAdVibe(e.target.value)}
                  >
                      <option value="Cinematic & Emotional">سينمائي وعاطفي (النمط الكلاسيكي الفخم)</option>
                      <option value="Fast Paced & Energetic">سريع وحماسي (مثل إعلانات الرياضة والسيارات)</option>
                      <option value="Tech Minimalist">تقني بسيط (مثل إعلانات أبل، خلفيات مظلمة وتركيز على المنتج)</option>
                      <option value="Humorous & Relatable">كوميدي وواقعي (يجذب الانتباه بالضحك)</option>
                  </select>
              </div>
          </div>

          {error && <p className="text-red-500 mb-4 font-semibold text-sm">{error}</p>}
          
          <button
            onClick={generateCommercial}
            disabled={isGenerating || isSuggesting}
            className={`w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center transition-all ${
              isGenerating 
                ? 'bg-gray-800 text-gray-400 cursor-wait' 
                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            }`}
          >
            {isGenerating ? <><Loader2 size={24} className="animate-spin ml-2" /> جاري التخطيط مع المخرج السينمائي...</> : '🎬 هندسة الإعلان الآن'}
          </button>
        </div>

        {/* ==========================================
            لوحة عرض الإعلان (The Storyboard)
            ========================================== */}
        {adData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="bg-gradient-to-br from-red-900/40 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                <h2 className="text-3xl font-black text-white mb-2">{adData.adTitle}</h2>
                <div className="flex flex-wrap gap-3 mt-4">
                    <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-sm font-bold border border-orange-500/30 flex items-center gap-1">
                        <Sparkles size={14}/> زاوية التسويق: {adData.marketingAngle}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold border border-blue-500/30 flex items-center gap-1">
                        <Music size={14}/> الموسيقى: {adData.soundtrackVibe}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-red-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Clapperboard size={20}/> لوحة القصة والمشاهد (The Storyboard):
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {adData.scenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-red-500/50 transition-all flex flex-col md:flex-row gap-6">
                  
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-950 w-24 h-24 rounded-xl border border-gray-800">
                    <span className="text-3xl font-black text-gray-600">0{scene.sceneNumber}</span>
                    <span className="text-xs font-bold text-red-500 mt-1 bg-red-900/30 px-2 py-1 rounded-md">{scene.duration}</span>
                  </div>
                  
                  <div className="flex-grow space-y-4 w-full">
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">
                            🎥 {scene.shotType}
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">
                            🔄 {scene.cameraMovement}
                        </span>
                        <span className="text-[11px] bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-700/50">
                            🎧 SFX: {scene.sfx}
                        </span>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 relative group">
                        <span className="text-xs text-orange-400 font-bold uppercase block mb-2">🎬 Video Generation Prompt (Sora/Runway/Veo):</span>
                        <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">
                          {scene.videoPrompt}
                        </p>
                        <button onClick={() => handleCopy(scene.videoPrompt, index)} className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            {copiedIndex === index ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
                            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-2">🎙️ التعليق الصوتي (Voice-over):</span>
                            <p className="text-sm text-white font-medium leading-relaxed">
                            "{scene.narration}"
                            </p>
                        </div>
                        {scene.onScreenText && scene.onScreenText !== "None" && scene.onScreenText !== "لا يوجد" && (
                            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-900/30">
                                <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider block mb-2">👁 نص الشاشة (On-Screen):</span>
                                <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-md">
                                {scene.onScreenText}
                                </p>
                            </div>
                        )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialLab;