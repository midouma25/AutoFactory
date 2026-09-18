import React, { useState } from 'react';
import { LayoutDashboard, PenTool, Image as ImageIcon, Video, History, Settings, Sparkles, Send, Loader2, ImagePlus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('prompt');
  
  const [promptText, setPromptText] = useState('');
  const [contentType, setContentType] = useState('carousel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null); // الآن سيحمل البيانات الحقيقية
  const [isPublishing, setIsPublishing] = useState(false); // 👈 إضافة حالة جديدة للنشر
  const menuItems = [
    { id: 'dashboard', name: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
    { id: 'prompt', name: 'استوديو الأوامر', icon: <PenTool size={20} /> },
    { id: 'images', name: 'معرض الصور', icon: <ImageIcon size={20} /> },
    { id: 'reels', name: 'منصة الفيديوهات', icon: <Video size={20} /> },
    { id: 'history', name: 'أرشيف النشر', icon: <History size={20} /> },
    { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  // 🚀 الاتصال الحقيقي بخادم Node.js و Groq
  const handleGenerate = async () => {
    if (!promptText) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    
    try {
      // إرسال الطلب إلى الخادم الخاص بنا الذي يعمل على المنفذ 5000
      const response = await fetch('http://localhost:5000/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, contentType })
      });

      const data = await response.json();

      if (data.success) {
        // إذا نجحنا، نخزن النتيجة القادمة من Groq لعرضها في الشاشة
        setGeneratedPreview(data);
      } else {
        alert('خطأ من الخادم: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ فشل الاتصال بالخادم. تأكد من أن Node.js يعمل في الخلفية.');
    } finally {
      setIsGenerating(false);
    }
  };
// 👈 إضافة دالة النشر الجديدة
  const handlePublish = async () => {
    if (!generatedPreview || !generatedPreview.images) return;
    setIsPublishing(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/publish-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            images: generatedPreview.images, 
            caption: generatedPreview.caption 
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('🎉 تم النشر على حساب إنستغرام بنجاح!\nمعرف المنشور: ' + data.postId);
        setGeneratedPreview(null); // مسح الشاشة بعد النشر للبدء من جديد
        setPromptText('');
      } else {
        alert('❌ خطأ أثناء النشر: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ فشل الاتصال بالخادم أثناء النشر.');
    } finally {
      setIsPublishing(false);
    }
  };
  const renderPromptStudio = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* القسم الأيمن: إدخال الأوامر */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-gray-100">المولد الذكي</h3>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">نوع المحتوى المطلوب</label>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
            {['carousel', 'image', 'reel'].map((type) => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  contentType === type ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {type === 'carousel' ? 'سلسلة (Carousel)' : type === 'image' ? 'صورة واحدة' : 'فيديو (Reel)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col mb-4">
          <label className="block text-gray-400 text-sm mb-2">وصف الدرس أو المنشور</label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="اكتب هنا: 'درس عن القوائم في بايثون' أو 'كيف تستخدم حلقة for'..."
            className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder-gray-600"
          ></textarea>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !promptText}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              الذكاء الاصطناعي يكتب ويصمم الآن...
            </>
          ) : (
            <>
              <Send size={20} />
              توليد المحتوى
            </>
          )}
        </button>
      </div>

      {/* القسم الأيسر: شاشة المعاينة الحقيقية */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col">
        <h3 className="text-xl font-bold text-gray-100 mb-6">نتيجة المعالجة الحية</h3>
        
        <div className="flex-1 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center bg-gray-900/50 overflow-hidden relative">
          {!isGenerating && !generatedPreview && (
            <div className="text-center text-gray-500">
              <ImagePlus size={48} className="mx-auto mb-3 opacity-50" />
              <p>محتوى الذكاء الاصطناعي سيظهر هنا</p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-400 animate-pulse font-medium">نرجو الانتظار، السيرفر يعمل بقوة...</p>
            </div>
          )}

          {generatedPreview && (
            <div className="absolute inset-0 p-4 flex flex-col overflow-y-auto w-full h-full">
              
              <div className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 mb-4 border border-gray-700">
                <p className="font-semibold text-blue-400 mb-2">النص المقترح للمنشور (Caption):</p>
                <p className="whitespace-pre-wrap">{generatedPreview.caption}</p>
              </div>

              <p className="font-semibold text-blue-400 mb-2">محتوى الشرائح الذي سيُطبع على الصور:</p>
              <div className="flex-1 space-y-3 mb-4">
                {generatedPreview.slides.map((slide, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        شريحة {slide.slideNumber}
                      </span>
                      <span className="font-bold text-gray-200">{slide.title}</span>
                    </div>
                    <p className="text-gray-400 mt-1 text-sm">{slide.content}</p>
                  </div>
                ))}
              </div>
              
{/* 👈 تعديل قائمة الأزرار السفلية لربط دالة النشر */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700">
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري الاتصال بـ Meta...
                    </>
                  ) : (
                    "رفع ونشر لإنستغرام 🚀"
                  )}
                </button>
                <button onClick={() => setGeneratedPreview(null)} className="px-6 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 rounded-lg font-bold transition-all border border-red-600/30">
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="flex h-screen bg-gray-900 text-white font-sans">
      <div className="w-64 bg-gray-800 p-5 flex flex-col border-l border-gray-700 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">
            AF
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-blue-400">AutoFactory</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            {menuItems.find(i => i.id === activeTab)?.icon}
            {menuItems.find(i => i.id === activeTab)?.name}
          </h2>
        </header>
        {activeTab === 'prompt' ? renderPromptStudio() : (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-[calc(100%-120px)] flex flex-col items-center justify-center text-gray-500">
            <LayoutDashboard size={64} className="mb-4 opacity-20" />
            <p className="text-xl">جاري تطوير هذا القسم...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;