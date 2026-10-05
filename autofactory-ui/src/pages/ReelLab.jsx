import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

const ReelLab = () => {
  // ==========================================
  // 1. حالات (States) توليد السيناريو
  // ==========================================
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reelData, setReelData] = useState(null);
  const [error, setError] = useState('');
  
  // ==========================================
  // 2. حالات (States) الهوية البصرية المزدوجة (Persona)
  // ==========================================
  const [personaImageUrl, setPersonaImageUrl] = useState(''); 

  // ==========================================
  // 3. حالات (States) الإلهامات الديناميكية
  // ==========================================
  const [inspirations, setInspirations] = useState([]);
  const [isLoadingInspirations, setIsLoadingInspirations] = useState(false);

  // ==========================================
  // 4. حالات (States) توليد الصوت وقائمة الأصوات
  // ==========================================
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState('');

  const availableVoices = [
    { id: 'en-US-ChristopherNeural', name: 'Christopher', desc: 'صوت سينمائي فخم، عميق، وهادئ جداً' },
    { id: 'en-US-SteffanNeural', name: 'Steffan', desc: 'صوت شاب واثق، سريع ومناسب للتقنية' },
    { id: 'en-US-GuyNeural', name: 'Guy', desc: 'صوت إخباري وثائقي، دافئ ومريح' },
    { id: 'en-US-AriaNeural', name: 'Aria', desc: 'صوت نسائي راقي، واثق ومقنع' },
    { id: 'en-US-JennyNeural', name: 'Jenny', desc: 'صوت طبيعي جداً، دافئ ومناسب للسرد' }
  ];

  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0].id);

  // ==========================================
  // 5. 🌟 جديد: حالات (States) الفيديوهات المرفوعة للمونتاج
  // ==========================================
  const [sceneVideos, setSceneVideos] = useState({});
  const [sceneVideoPreviews, setSceneVideoPreviews] = useState({});
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    fetchInspirations();
  }, []);

  const fetchInspirations = async () => {
    setIsLoadingInspirations(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suggest-reel-topics');
      if (res.data.success) {
        setInspirations(res.data.inspirations);
      }
    } catch (err) {
      console.error('فشل جلب الإلهامات:', err);
    } finally {
      setIsLoadingInspirations(false);
    }
  };

  const handleGenerateReel = async () => {
    if (!topic) {
        setError('الرجاء كتابة فكرة الفيديو أولاً!');
        return;
    }
    
    setIsGenerating(true);
    setError('');
    setReelData(null);
    setAudioUrl(null); 
    setSceneVideos({});
    setSceneVideoPreviews({});

    try {
      const res = await axios.post('http://localhost:5000/api/generate-reel-script', { topic });
      if (res.data.success) {
        setReelData(res.data.reel);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء توليد السيناريو.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!reelData || !reelData.scenes) return;
    
    setIsGeneratingAudio(true);
    setAudioError('');
    setAudioUrl(null);

    const fullNarration = reelData.scenes
      .map(scene => scene.narration)
      .join(' ... '); 

    try {
      const res = await axios.post('http://localhost:5000/api/generate-voiceover', { 
        text: fullNarration,
        voiceId: selectedVoice 
      });
      
      if (res.data.success) {
        setAudioUrl(res.data.audioUrl);
      }
    } catch (err) {
      console.error(err);
      setAudioError(err.response?.data?.error || 'حدث خطأ أثناء توليد الصوت.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // 🎥 دالة معالجة رفع الفيديوهات لكل مشهد
  const handleVideoUpload = (index, file) => {
    if (file && file.type.startsWith('video/')) {
      setSceneVideos(prev => ({ ...prev, [index]: file }));
      setSceneVideoPreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }));
    } else {
      alert('الرجاء رفع ملف فيديو صالح (مثل MP4)');
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleVideoUpload(index, file);
  };

  // 🎬 دالة الرندرة النهائية للمونتاج
  const handleRenderFinalVideo = async () => {
    for (let i = 0; i < reelData.scenes.length; i++) {
      if (!sceneVideos[i]) {
        alert(`❌ الرجاء رفع الفيديو الخاص بالمشهد رقم ${i + 1} قبل الرندرة!`);
        return;
      }
    }

    setIsRendering(true);
    setAudioError('');

    try {
      const formData = new FormData();
      formData.append('scenes', JSON.stringify(reelData.scenes));
      formData.append('voiceId', selectedVoice);

      // إرفاق جميع الفيديوهات مع النموذج
      Object.keys(sceneVideos).forEach(key => {
        formData.append(`video_${key}`, sceneVideos[key]);
      });

      const response = await axios.post('http://localhost:5000/api/render-video', formData, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Raw_DocuReel_AutoFactory.mp4');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      alert('✅ تم تصدير الفيديو بنجاح! جاري التحميل...');

    } catch (err) {
      console.error(err);
      setAudioError('حدث خطأ أثناء مونتاج الفيديو. تأكد من أن السيرفر يعمل.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-3">
            استوديو الفيديوهات القصيرة (ReelLab)
          </h1>
          <p className="text-gray-400 text-lg">مصنع المحتوى الوثائقي الواقعي 🎬</p>
        </header>

        {/* 🌟 إعدادات الهوية */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-purple-900/50 shadow-lg mb-6">
          <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
            <span>🦸‍♂️</span> إعدادات الهوية البصرية (Persona):
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            للحفاظ على هويتك، ضع رابط صورتك لتوليد اللقطة الأساسية في Midjourney، ثم حركها في Veo.
          </p>
          <input
            type="text"
            className="w-full bg-gray-950 text-white p-3 rounded-xl border border-gray-700 focus:border-purple-500 outline-none transition-all text-sm font-mono text-left"
            dir="ltr"
            placeholder="https://cdn.discordapp.com/attachments/..."
            value={personaImageUrl}
            onChange={(e) => setPersonaImageUrl(e.target.value)}
          />
        </div>

        {/* منطقة الإدخال والإلهام */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl mb-10">
          <div className="mb-5 border-b border-gray-800 pb-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 font-bold">💡 أفكار فيروسية (وثائقية خامة):</span>
              <button 
                onClick={fetchInspirations} 
                disabled={isLoadingInspirations}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-900/50"
              >
                <RefreshCw size={14} className={isLoadingInspirations ? "animate-spin" : ""} />
                توليد أفكار جديدة
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {isLoadingInspirations ? (
                <div className="w-full col-span-1 md:col-span-2 text-center py-8 text-emerald-500 animate-pulse text-lg font-bold">
                  🧠 جاري استخراج الأفكار...
                </div>
              ) : (
                inspirations.map((insp) => (
                  <div
                    key={insp.id}
                    onClick={() => setTopic(`${insp.hook} ${insp.coreLesson}`)}
                    className="bg-gray-950/80 hover:bg-emerald-900/20 text-right p-5 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all shadow-sm group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{insp.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-900 px-2 py-1 rounded-md border border-gray-800">{insp.category}</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{insp.title}</h4>
                    <p className="text-emerald-400 text-sm font-bold mb-2">🪝 {insp.hook}</p>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed">💡 {insp.coreLesson}</p>
                    <div className="text-blue-400 text-xs font-bold bg-blue-900/20 p-2 rounded-lg border border-blue-900/50 inline-block">
                      🗣️ {insp.cta}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <label className="block text-emerald-400 font-bold mb-2 text-lg">فكرة الفيديو (Topic):</label>
          <textarea
            className="w-full bg-gray-950 text-white p-4 rounded-xl border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none leading-relaxed"
            rows="3"
            placeholder="اكتب فكرتك هنا..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          ></textarea>
          
          {error && <p className="text-red-500 mt-3 font-semibold text-sm">{error}</p>}
          
          <button
            onClick={handleGenerateReel}
            disabled={isGenerating}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
              isGenerating 
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isGenerating ? '⏳ جاري كتابة السيناريو الوثائقي...' : '🎬 إخراج السيناريو الآن'}
          </button>
        </div>

        {/* منطقة عرض النتائج ولوحة القصة */}
        {reelData && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
              <h2 className="text-2xl font-bold text-white mb-3">📌 {reelData.reelTitle}</h2>
              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/80">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">📱 كابشن إنستغرام / تيك توك:</span>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">{reelData.caption}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-emerald-400 border-b border-gray-800 pb-2 flex items-center gap-2">
                <span>🎬</span> لوحة القصة والمونتاج (Storyboard & Assembly):
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {reelData.scenes.map((scene, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 relative hover:border-emerald-500/50 transition-all flex flex-col lg:flex-row gap-6 group">
                  
                  {/* رقم المشهد */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-950 w-24 h-24 rounded-xl border border-gray-800">
                    <span className="text-3xl font-black text-gray-600 group-hover:text-emerald-500 transition-colors">0{scene.sceneNumber}</span>
                    <span className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-900/30 px-2 py-1 rounded-md">{scene.durationHint}</span>
                  </div>
                  
                  {/* محتوى المشهد */}
                  <div className="flex-grow space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">🎙️ التعليق الصوتي:</span>
                        {scene.deliveryStyle && (
                          <span className="text-xs font-bold bg-purple-900/40 text-purple-300 px-3 py-1 rounded-lg border border-purple-700/50 flex items-center gap-2">
                            🎭 الأداء: {scene.deliveryStyle}
                          </span>
                        )}
                      </div>
                      <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
                        <p dir="ltr" className="text-xl text-white font-medium leading-relaxed font-serif tracking-wide text-left">
                          {scene.narration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider block mb-2">👁 الكلمات الخاطفة:</span>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-md">
                        {scene.onScreenText}
                      </p>
                    </div>

                    {/* 🎥 البرومبت الحركي المزدوج (عام / شخصي) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* البرومبت العام */}
                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <span className="text-xs text-gray-500 font-bold uppercase block mb-2">🎬 برومبت حركة وثائقي (Veo/Runway):</span>
                        <p dir="ltr" className="text-sm text-gray-400 font-mono select-all cursor-text text-left">
                          {scene.videoPromptStandard || scene.visualPromptStandard}
                        </p>
                      </div>
                      
                      {/* برومبت الهوية */}
                      <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/50">
                        <span className="text-xs text-purple-400 font-bold uppercase block mb-2">🦸‍♂️ برومبت الهوية الوثائقي (Persona):</span>
                        <p dir="ltr" className="text-sm text-purple-300/80 font-mono select-all cursor-text text-left">
                          {scene.videoPromptPersona || scene.visualPromptPersona}
                        </p>
                      </div>
                    </div>

                    {/* 🎥 منطقة رفع وإسقاط الفيديو الخاص بالمشهد */}
                    <div 
                      className={`mt-4 border-2 border-dashed rounded-xl p-2 transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
                        sceneVideoPreviews[index] ? 'border-emerald-500/50 bg-gray-950' : 'border-gray-700 hover:border-emerald-500 bg-gray-950/50 hover:bg-gray-900'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(index, e)}
                    >
                      {sceneVideoPreviews[index] ? (
                        <div className="relative group w-full flex justify-center">
                          <video 
                            src={sceneVideoPreviews[index]} 
                            autoPlay 
                            loop 
                            muted 
                            className="max-h-48 rounded-lg object-contain shadow-lg" 
                          />
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-2">
                            <span className="text-emerald-400 font-bold text-sm">✅ تم ربط الفيديو بنجاح</span>
                            <label className="cursor-pointer text-white text-xs font-bold bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 border border-gray-600 transition-colors">
                              🔄 تغيير الفيديو
                              <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" onChange={(e) => handleVideoUpload(index, e.target.files[0])} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center">
                          <span className="text-4xl mb-3 opacity-80">🎥</span>
                          <span className="text-gray-300 font-bold text-sm mb-1">أسقط فيديو (Veo/Luma) هنا</span>
                          <span className="text-xs text-gray-500">أو اضغط لاختيار ملف MP4</span>
                          <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" onChange={(e) => handleVideoUpload(index, e.target.files[0])} />
                        </label>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* 🎬 غرفة المونتاج والإنتاج النهائي */}
            <div className="mt-12 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-600"></div>
              
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="bg-purple-600/20 p-2 rounded-lg text-purple-400">🎬</span>
                غرفة المونتاج والإخراج النهائي
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                تأكد من رفع جميع الفيديوهات في المشاهد بالأعلى، ثم اختر المعلق الصوتي واضغط على زر الإخراج.
              </p>

              <div className="mb-6 bg-gray-950 p-4 rounded-xl border border-gray-800">
                <label className="block text-sm font-bold text-gray-400 mb-3">🎭 اختر المعلق الصوتي (Edge TTS):</label>
                <div className="relative">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-gray-900 text-white font-medium p-3 pr-10 rounded-lg border border-gray-700 focus:border-purple-500 outline-none appearance-none cursor-pointer transition-all"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.desc}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={handleRenderFinalVideo}
                  disabled={isRendering}
                  className={`w-full py-5 rounded-xl font-black text-xl flex items-center justify-center transition-all border-2 shadow-2xl ${
                    isRendering 
                      ? 'bg-gray-800 text-purple-400 border-purple-900/50 cursor-wait' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-purple-400 hover:scale-[1.02]'
                  }`}
                >
                  {isRendering ? (
                    <span className="flex items-center gap-3 animate-pulse">
                      <RefreshCw className="animate-spin" size={24} /> جاري دمج الفيديوهات والنصوص... (يستغرق وقتاً)
                    </span>
                  ) : (
                    '📥 إخراج وتحميل الفيديو النهائي (MP4)'
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-xs mb-4 font-bold">خيارات ثانوية للاختبار:</p>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingAudio || isRendering}
                    className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center transition-all w-full md:w-auto ${
                      isGeneratingAudio ? 'bg-gray-800 text-gray-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                    }`}
                  >
                    {isGeneratingAudio ? '⏳ جاري التسجيل...' : '🎧 تجربة المقطع الصوتي فقط'}
                  </button>

                  {audioUrl && (
                    <div className="flex-grow w-full bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center gap-4">
                      <span className="text-xs font-bold text-green-400 uppercase whitespace-nowrap">✅ الصوت جاهز</span>
                      <audio controls className="w-full h-10" autoPlay>
                        <source src={audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
                {audioError && <p className="text-red-500 mt-3 font-semibold text-xs">{audioError}</p>}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelLab;