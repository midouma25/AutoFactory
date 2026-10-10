import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Video,
  Sparkles,
  Loader2,
  Music,
  Clapperboard,
  Copy,
  CheckCircle,
  Store,
  HeartPulse,
  ShoppingCart,
  GraduationCap,
  Building,
  Truck,
  Sprout,
  CalendarDays,
  Image as ImageIcon,
  Wind,
  BookmarkPlus,
  Archive,
  Trash2,
  Eye,
  X,
  Edit3, Wand2

} from 'lucide-react';

const CommercialLab = () => {
  const [productIdea, setProductIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [adVibe, setAdVibe] = useState('Cinematic & Emotional'); 
  const [brandColors, setBrandColors] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [adData, setAdData] = useState(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // حالات الأرشيف
  const [showArchive, setShowArchive] = useState(false);
  const [savedAds, setSavedAds] = useState([]);
  const [loadingArchive, setLoadingArchive] = useState(false);
  

  // حالات تعديل المشاهد
  const [editingSceneIndex, setEditingSceneIndex] = useState(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [isEnhancingScene, setIsEnhancingScene] = useState(false);



  useEffect(() => {
    fetchSavedAds();
  }, []);

  const fetchSavedAds = async () => {
    setLoadingArchive(true);
    try {
      const res = await axios.get('http://localhost:5000/api/commercial-ads');
      if (res.data.success) {
        setSavedAds(res.data.data);
      }
    } catch (err) {
      console.error('خطأ في جلب الأرشيف:', err);
    } finally {
      setLoadingArchive(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
        
        const pureVibe = adVibe.split('(')[0].trim();
        setAdVibe(pureVibe);
        
        if(!brandColors) {
            const colorsMap = {
                healthcare: 'أزرق طبي وأبيض',
                ecommerce: 'برتقالي وأسود',
                local_business: 'أخضر داكن وذهبي',
                youth_edu: 'بنفسجي وأصفر',
                real_estate: 'رمادي داكن وفضي',
                logistics: 'أصفر فاقع وأسود',
                agriculture: 'أخضر طبيعي وترابي',
                tourism_events: 'وردي دافئ وذهبي'
            };
            setBrandColors(colorsMap[category] || 'أزرق داكن وذهبي');
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
    setSaveSuccess(false);

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

  // دالة حفظ الإعلان الحالي في الأرشيف
  const handleSaveToVault = async () => {
    if (!adData) return;
    setIsSaving(true);
    try {
      const payload = {
        productIdea,
        targetAudience,
        adVibe,
        brandColors,
        ...adData
      };
      const res = await axios.post('http://localhost:5000/api/commercial-ads/save', payload);
      if (res.data.success) {
        setSaveSuccess(true);
        fetchSavedAds(); // تحديث القائمة
      }
    } catch (err) {
      console.error(err);
      alert('فشل حفظ الإعلان.');
    }
    setIsSaving(false);
  };

  // دالة حذف إعلان من الأرشيف
  const handleDeleteAd = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان من الأرشيف؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/commercial-ads/${id}`);
      fetchSavedAds();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };


  const handleEnhanceScene = async (index) => {
    if (!editInstruction.trim()) return;
    setIsEnhancingScene(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/enhance-scene', {
        originalScene: adData.scenes[index],
        userInstruction: editInstruction,
        brandColors: brandColors
      });

      if (res.data.success) {
        // تحديث المشهد المحدد فقط في الواجهة
        const updatedScenes = [...adData.scenes];
        updatedScenes[index] = res.data.updatedScene;
        setAdData({ ...adData, scenes: updatedScenes });
        
        // إغلاق وضع التعديل
        setEditingSceneIndex(null);
        setEditInstruction('');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تطوير المشهد.');
    } finally {
      setIsEnhancingScene(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#05070A] text-gray-100 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-2 flex items-center gap-3">
              <Video className="text-red-500" size={36} />
              استوديو الإعلانات التجارية (CommercialLab)
            </h1>
            <p className="text-gray-400 text-sm">بناء إعلانات بجودة كوكاكولا وأبل بالذكاء الاصطناعي 🎥✨</p>
          </div>
          
          <button 
            onClick={() => setShowArchive(true)}
            className="bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500/30 px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
          >
            <Archive size={20} /> أرشيف الإعلانات المحفوظة ({savedAds.length})
          </button>
        </header>

        <div className="bg-gray-900 p-8 rounded-2xl border border-red-900/30 shadow-2xl mb-10">
          
          <div className="mb-8">
            <label className="text-gray-300 font-bold mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500"/> الإلهام المزدوج (فكرة مشروع + إعلان للسوق الجزائري 🇩🇿):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => fetchAlgerianIdea('local_business')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-amber-500/50">
                <Store size={24} className="text-amber-500"/><span className="text-xs font-bold text-center">رقمنة المحلات والخدمات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('ecommerce')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-orange-500/50">
                <ShoppingCart size={24} className="text-orange-500"/><span className="text-xs font-bold text-center">حلول التجارة الإلكترونية</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('healthcare')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-blue-500/50">
                <HeartPulse size={24} className="text-blue-500"/><span className="text-xs font-bold text-center">القطاع الطبي والعيادات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('youth_edu')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-emerald-500/50">
                <GraduationCap size={24} className="text-emerald-500"/><span className="text-xs font-bold text-center">الطلبة والتعليم الحديث</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('real_estate')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-slate-400/50">
                <Building size={24} className="text-slate-400"/><span className="text-xs font-bold text-center">العقارات والمقاولات</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('logistics')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-yellow-400/50">
                <Truck size={24} className="text-yellow-400"/><span className="text-xs font-bold text-center">النقل واللوجستيك</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('agriculture')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-lime-500/50">
                <Sprout size={24} className="text-lime-500"/><span className="text-xs font-bold text-center">الفلاحة والإنتاج</span>
              </button>
              <button onClick={() => fetchAlgerianIdea('tourism_events')} disabled={isSuggesting} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl border border-gray-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 hover:border-pink-500/50">
                <CalendarDays size={24} className="text-pink-500"/><span className="text-xs font-bold text-center">السياحة والفعاليات</span>
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
                      
                      {/* 🚀 النمط الجديد الذي ابتكرته أنت */}
                      <option value="Personal Storytelling (Founder Story - Relatable POV)">سرد قصصي شخصي (Founder Story - البطل هو أنت)</option>
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

        {/* عرض النتائج وزر الحفظ */}
        {adData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="bg-gradient-to-br from-red-900/40 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                <div>
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

                {/* زر حفظ الإعلان */}
                <button
                  onClick={handleSaveToVault}
                  disabled={isSaving || saveSuccess}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    saveSuccess 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                  }`}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20}/> : saveSuccess ? <CheckCircle size={20}/> : <BookmarkPlus size={20}/>}
                  {saveSuccess ? 'تم الحفظ في الأرشيف ✅' : 'حفظ في الأرشيف 📚'}
                </button>
            </div>

            <h3 className="text-xl font-bold text-red-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Clapperboard size={20}/> لوحة القصة والمشاهد (The Storyboard):
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {adData.scenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-red-500/50 transition-all flex flex-col lg:flex-row gap-6">
                  
<div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center justify-center bg-gray-950 w-24 h-24 rounded-xl border border-gray-800">
                        <span className="text-3xl font-black text-gray-600">0{scene.sceneNumber}</span>
                        <span className="text-xs font-bold text-red-500 mt-1 bg-red-900/30 px-2 py-1 rounded-md">{scene.duration}</span>
                    </div>
                    {/* زر فتح وضع التعديل */}
                    <button 
                        onClick={() => { setEditingSceneIndex(index); setEditInstruction(''); }}
                        className="text-gray-400 hover:text-blue-400 bg-gray-800 p-2 rounded-lg w-full flex justify-center transition-all"
                        title="تعديل هذا المشهد"
                    >
                        <Edit3 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">🎥 {scene.shotType}</span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">🔄 {scene.cameraMovement}</span>
                        <span className="text-[11px] bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded border border-indigo-700/50">🎧 SFX: {scene.sfx}</span>
                    </div>
{/* واجهة تعديل المشهد (تظهر عند الضغط) */}
                    {editingSceneIndex === index && (
                        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/50 mb-4 animate-in fade-in">
                            <label className="text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">
                                <Wand2 size={16} /> تطوير هذا المشهد (أعطِ تعليماتك للمخرج):
                            </label>
                            <textarea
                                className="w-full bg-gray-950 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none resize-none text-sm mb-3"
                                rows="2"
                                placeholder="مثال: اجعل البطل يشرب القهوة وهو يبتسم بدلاً من الجلوس فقط..."
                                value={editInstruction}
                                onChange={(e) => setEditInstruction(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingSceneIndex(null)} className="text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm">إلغاء</button>
                                <button 
                                    onClick={() => handleEnhanceScene(index)} 
                                    disabled={isEnhancingScene}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm flex items-center gap-2"
                                >
                                    {isEnhancingScene ? <Loader2 size={14} className="animate-spin"/> : 'تطوير المشهد ✨'}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 relative group">
                            <span className="text-xs text-orange-400 font-bold uppercase flex items-center gap-2 mb-2"><Video size={14}/> نص-إلى-فيديو:</span>
                            <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.videoPrompt}</p>
                            <button onClick={() => handleCopy(scene.videoPrompt, `v-${index}`)} className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                {copiedIndex === `v-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-900/30 relative group">
                                <span className="text-xs text-purple-400 font-bold uppercase flex items-center gap-2 mb-2"><ImageIcon size={14}/> صورة ثابتة (Midjourney):</span>
                                <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.imagePrompt}</p>
                                <button onClick={() => handleCopy(scene.imagePrompt, `i-${index}`)} className="absolute top-4 right-4 bg-purple-900/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    {copiedIndex === `i-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="bg-cyan-900/10 p-4 rounded-xl border border-cyan-900/30 relative group">
                                <span className="text-xs text-cyan-400 font-bold uppercase flex items-center gap-2 mb-2"><Wind size={14}/> تحريك الصورة (Luma/Veo):</span>
                                <p dir="ltr" className="text-sm text-gray-300 font-mono text-left leading-relaxed">{scene.imageToVideoPrompt}</p>
                                <button onClick={() => handleCopy(scene.imageToVideoPrompt, `m-${index}`)} className="absolute top-4 right-4 bg-cyan-900/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    {copiedIndex === `m-${index}` ? <CheckCircle size={14} className="text-green-400"/> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
                            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-2">🎙️ التعليق الصوتي:</span>
                            <p className="text-sm text-white font-medium">"{scene.narration}"</p>
                        </div>
                        {scene.onScreenText && scene.onScreenText !== "None" && scene.onScreenText !== "لا يوجد" && (
                            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-900/30">
                                <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider block mb-2">👁 نص الشاشة:</span>
                                <p className="text-lg font-black text-yellow-400">{scene.onScreenText}</p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نافذة أرشيف الإعلانات (Modal / Drawer) */}
        {showArchive && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
            <div className="w-full max-w-2xl bg-gray-900 h-full p-6 overflow-y-auto border-r border-gray-800 flex flex-col">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Archive className="text-red-500" /> أرشيف الإعلانات المحفوظة
                </h2>
                <button onClick={() => setShowArchive(false)} className="text-gray-400 hover:text-white p-2 rounded-lg bg-gray-800">
                  <X size={20} />
                </button>
              </div>

              {loadingArchive ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">⏳ جاري تحميل الأرشيف...</div>
              ) : (
                <div className="space-y-4 flex-1">
                  {savedAds.map((ad) => (
                    <div key={ad._id} className="bg-gray-800/80 p-5 rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-red-900/30 text-red-400 px-2.5 py-1 rounded-md border border-red-500/30 font-bold">
                            {new Date(ad.created_at).toLocaleDateString('ar-DZ')}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{ad.adTitle}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setAdData(ad); setProductIdea(ad.productIdea); setShowArchive(false); }}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all" title="استعراض الإعلان"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteAd(ad._id, e)}
                            className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white p-2.5 rounded-xl transition-all" title="حذف نهائي"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">💡 الفكرة: {ad.productIdea}</p>
                    </div>
                  ))}
                  {savedAds.length === 0 && (
                    <div className="text-center py-20 text-gray-500">لا توجد إعلانات محفوظة في الأرشيف حتى الآن.</div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CommercialLab;