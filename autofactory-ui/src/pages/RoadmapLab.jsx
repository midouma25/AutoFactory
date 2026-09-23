import React, { useState } from 'react';

const RoadmapLab = () => {
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // هنا سنضيف لاحقاً منطق الاتصال بـ API التوليد
    console.log(`Generating roadmap for ${topic} on ${platform}`);
    setTimeout(() => setIsLoading(false), 2000); // محاكاة للتحميل
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-right">🗺️ صانع خرائط الطريق (Roadmap Lab)</h2>
      
      {/* اختيار المنصة */}
      <div className="flex justify-end gap-4 mb-8">
         <button 
            className={`px-6 py-2 rounded-md ${platform === 'both' ? 'bg-slate-700' : 'bg-slate-800'}`}
            onClick={() => setPlatform('both')}
          >كلاهما معاً</button>
          <button 
            className={`px-6 py-2 rounded-md ${platform === 'facebook' ? 'bg-blue-600' : 'bg-slate-800'}`}
            onClick={() => setPlatform('facebook')}
          >فيسبوك</button>
          <button 
            className={`px-6 py-2 rounded-md ${platform === 'instagram' ? 'bg-pink-600' : 'bg-slate-800'}`}
            onClick={() => setPlatform('instagram')}
          >إنستغرام</button>
      </div>

      {/* حقل الإدخال */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-8 text-right">
          <h3 className="text-xl font-bold mb-4 text-emerald-400">🗺️ فكرة خريطة الطريق</h3>
          <input 
            type="text" 
            placeholder="أدخل فكرتك أو مجالك (مثال: بناء تطبيق SaaS، أو تحضير مقابلة عمل)"
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-4 text-white mb-4 text-right"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
          <div className="flex justify-end gap-4 mb-6">
              <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md flex items-center gap-2">
                 إلهام بسيط 🎯
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md flex items-center gap-2">
                 إلهام فيروسي ✨
              </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-md font-bold text-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'جاري التوليد...' : '⚡ صمم خريطة الطريق'}
          </button>
      </div>
    </div>
  );
};

export default RoadmapLab;