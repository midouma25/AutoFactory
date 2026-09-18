import React, { useState } from 'react';
import { Sparkles, Send, Loader2, ImagePlus, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function PromptStudio() {
    const [promptText, setPromptText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState(null);

    // دالة توليد المحتوى
    const handleGenerate = async () => {
        if (!promptText.trim()) return;
        
        setIsGenerating(true);
        setGeneratedData(null);
        setPublishStatus(null);

        try {
            // تأكد أن البورت 5000 يطابق بورت الخادم الخاص بك
            const response = await axios.post('http://localhost:5000/api/generate-lesson', {
                prompt: promptText
            });

            if (response.data && response.data.success) {
                setGeneratedData({
                    images: response.data.images,
                    caption: response.data.caption
                });
            } else {
                alert('⚠️ حدث خطأ في الخادم أثناء التوليد.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ فشل الاتصال بالخادم. تأكد من تشغيل Node.js.');
        } finally {
            setIsGenerating(false);
        }
    };

    // دالة النشر على إنستغرام
    const handlePublish = async () => {
        if (!generatedData) return;
        
        setIsPublishing(true);
        try {
            const response = await axios.post('http://localhost:5000/api/publish-lesson', {
                images: generatedData.images,
                caption: generatedData.caption
            });

            if (response.data && response.data.success) {
                setPublishStatus('success');
            } else {
                setPublishStatus('error');
            }
        } catch (error) {
            console.error('Error:', error);
            setPublishStatus('error');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full pb-10">
            {/* القسم الأيمن: إدخال الأوامر */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col h-fit">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-900/50 text-blue-400 rounded-lg">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">صياغة الفكرة</h3>
                        <p className="text-gray-400 text-sm">اكتب موضوع الدرس ليقوم الذكاء الاصطناعي بتصميمه</p>
                    </div>
                </div>

                <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="مثال: اشرح الفرق بين React و Vue بأسلوب بسيط..."
                    className="w-full h-48 bg-gray-900 text-white border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-6"
                    dir="rtl"
                />

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !promptText.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                        isGenerating || !promptText.trim()
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-600/50'
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            جاري التأليف والتصميم...
                        </>
                    ) : (
                        <>
                            <Send size={24} />
                            توليد الدرس التلقائي
                        </>
                    )}
                </button>
            </div>

            {/* القسم الأيسر: معاينة النتائج والنشر */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-900/50 text-purple-400 rounded-lg">
                        <ImagePlus size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">المعاينة والنشر</h3>
                        <p className="text-gray-400 text-sm">راجع الصور والنص قبل إرسالها لإنستغرام</p>
                    </div>
                </div>

                {!generatedData && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl p-10">
                        <ImagePlus size={48} className="mb-4 opacity-50" />
                        <p>النتائج ستظهر هنا بعد التوليد</p>
                    </div>
                )}

                {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-blue-400">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="animate-pulse">المصنع يعمل الآن... يرجى الانتظار</p>
                    </div>
                )}

                {generatedData && (
                    <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
                        {/* شبكة الصور المولدة */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {generatedData.images.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-600 aspect-square">
                                    <img 
                                        src={img} 
                                        alt={`Slide ${idx + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* النص المولد (Caption) */}
                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-6 whitespace-pre-wrap text-sm text-gray-300">
                            {generatedData.caption}
                        </div>

                        {/* زر النشر */}
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing || publishStatus === 'success'}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all mt-auto ${
                                publishStatus === 'success'
                                    ? 'bg-green-600 text-white'
                                    : isPublishing
                                    ? 'bg-gray-700 text-gray-500'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-600/50'
                            }`}
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    جاري الإرسال لـ Meta...
                                </>
                            ) : publishStatus === 'success' ? (
                                <>
                                    <CheckCircle size={24} />
                                    تم النشر بنجاح!
                                </>
                            ) : publishStatus === 'error' ? (
                                <>
                                    <AlertCircle size={24} />
                                    فشل النشر، أعد المحاولة
                                </>
                            ) : (
                                <>
                                    <Send size={24} />
                                    انشر على إنستغرام الآن
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}