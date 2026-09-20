import React, { useState } from 'react';
import axios from 'axios';

export default function TemplateLab() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const generateComparison = async () => {
    if (!topic) return alert('اكتب الموضوع أولاً!');
    setLoading(true);
    try {
      // الاتصال بالمسار الجديد الذي أنشأناه في الخادم
      const res = await axios.post('http://localhost:5000/api/generate-comparison', { topic });
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
      <h1 className="text-3xl font-bold mb-8 text-blue-400">🧪 مختبر القوالب الذكية (Template Lab)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* بطاقة قالب المقارنة */}
        <div className="bg-slate-800 p-6 rounded-2xl border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <div className="text-4xl mb-4">⚖️</div>
          <h2 className="text-xl font-bold mb-2">قالب فضح الأدوات (The Expose)</h2>
          <p className="text-slate-400 text-sm mb-4">
            مثالي للمقارنة بين أدوات عشوائية وأدوات ذكاء اصطناعي متخصصة.
          </p>
          
          <input 
            type="text" 
            placeholder="عن ماذا تريد المقارنة؟ (مثال: أدوات المونتاج والبرمجة)" 
            className="w-full p-3 bg-slate-700 rounded-lg text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
          <button 
            onClick={generateComparison}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-all"
          >
            {loading ? '⏳ جاري التصميم...' : '✨ صمم الكاروسيل الآن'}
          </button>
        </div>

        {/* يمكنك إضافة قوالب أخرى هنا مستقبلاً (مثل قالب الاقتباس، قالب الكود السريع، إلخ) */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex items-center justify-center">
          <p className="text-slate-500">قوالب أخرى قريباً...</p>
        </div>
      </div>

      {/* عرض الصور الناتجة */}
      {images.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">🖼️ النتيجة النهائية:</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={`http://localhost:5000/${img}`} 
                alt={`Slide ${idx+1}`} 
                className="h-96 rounded-xl shadow-lg border border-slate-700 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}