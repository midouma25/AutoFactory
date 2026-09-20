import React, { useState, useEffect } from 'react';
import { Zap, Film, Wand2, Loader2, Copy, CheckCircle, Trash2, Image as ImageIcon, FileText, Hash, Sparkles } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import axios from 'axios';

export default function PromptStudio() {
    // 1. جلب البيانات من المخزن السحابي (Zustand)
    const { viralData, clearViralData } = useIdeaStore();

    // 2. إدارة حالة الواجهة
    // إذا كان هناك بيانات فيروسية، افتح الوضع السينمائي تلقائياً، وإلا افتح السريع
    const [activeMode, setActiveMode] = useState(viralData ? 'cinematic' : 'quick');
    const [postType, setPostType] = useState('carousel'); // reel أو carousel
    const [quickTopic, setQuickTopic] = useState('');
    
    // 3. حالات التوليد والنتائج
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    // مراقب التغييرات: إذا جاءت بيانات جديدة، انقل المستخدم للوضع السينمائي
    useEffect(() => {
        if (viralData) setActiveMode('cinematic');
    }, [viralData]);

const handleGenerate = async () => {
        setIsGenerating(true);
        setResult(null);
        
        try {
            const payload = activeMode === 'cinematic' 
                ? { mode: 'cinematic', type: postType, viralData } 
                : { mode: 'quick', topic: quickTopic };

            const response = await axios.post('http://localhost:5000/api/generate-content', payload);
            
            if (response.data?.success) {
                setResult(response.data.content);
                setIsGenerating(false); // 👈 السطر الذي كان مفقوداً لإيقاف التحميل
            }
        } catch (error) {
            console.error("Error generating content:", error);
            // بيانات وهمية مؤقتة للحماية في حالة الخطأ
            setTimeout(() => {
                setResult({
                    script: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.",
                    prompts: "Error...",
                    caption: "Error..."
                });
                setIsGenerating(false); // إيقاف التحميل في حالة الخطأ أيضاً
            }, 2000);
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
            
            {/* القسم الأيمن: إعدادات التوليد */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* مبدل الأوضاع */}
                <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700 shadow-inner">
                    <button 
                        onClick={() => setActiveMode('quick')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'quick' ? 'bg-amber-500 text-gray-900 shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Zap size={20}/> التوليد السريع
                    </button>
                    <button 
                        onClick={() => setActiveMode('cinematic')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'cinematic' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <Film size={20}/> الإنتاج السينمائي
                    </button>
                </div>

                {/* واجهة التوليد السريع */}
                {activeMode === 'quick' && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-white mb-2">منشور سريع</h3>
                        <p className="text-gray-400 text-sm mb-6">أدخل عنواناً أو فكرة بسيطة وسنتكفل بالباقي.</p>
                        
                        <textarea
                            value={quickTopic}
                            onChange={(e) => setQuickTopic(e.target.value)}
                            placeholder="مثال: تحديثات React 19 الجديدة..."
                            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 resize-none mb-6"
                        ></textarea>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !quickTopic.trim()}
                            className="w-full py-4 bg-amber-500 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            توليد المحتوى
                        </button>
                    </div>
                )}

                {/* واجهة الإنتاج السينمائي */}
                {activeMode === 'cinematic' && (
                    <div className="bg-gradient-to-br from-gray-800 to-purple-900/30 rounded-2xl p-6 border border-purple-500/30 shadow-xl animate-fade-in-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">المخطط الفيروسي</h3>
                                <p className="text-purple-300/70 text-sm">توليد نصوص وأوامر صور بناءً على المختبر.</p>
                            </div>
                            {viralData && (
                                <button onClick={clearViralData} className="text-red-400 hover:text-red-300 p-2 bg-red-900/20 rounded-lg tooltip" title="مسح بيانات المختبر">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        {viralData ? (
                            <div className="bg-gray-900/80 rounded-xl p-4 mb-6 border border-purple-500/20">
                                <div className="mb-3">
                                    <span className="text-xs text-purple-400 font-bold block mb-1">الخطاف المستورد:</span>
                                    <p className="text-sm text-white line-clamp-2">{viralData.hook}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-blue-400 font-bold block mb-1">أسلوب التقديم:</span>
                                    <p className="text-sm text-gray-300 line-clamp-2">{viralData.presentation}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/80 rounded-xl p-6 mb-6 border border-dashed border-gray-600 text-center">
                                <Film className="mx-auto text-gray-500 mb-2" size={32} />
                                <p className="text-gray-400 text-sm">لا توجد بيانات مستوردة. اذهب إلى "مختبر الأفكار" لتجهيز فكرة فيروسية أولاً.</p>
                            </div>
                        )}

<div className="mb-6">
    <label className="text-sm font-bold text-gray-300 block mb-2">نوع المنشور المطلوب:</label>
    <select 
        value={postType} 
        onChange={(e) => setPostType(e.target.value)}
        className="w-full bg-gray-900 text-white border border-gray-600 rounded-xl p-3"
    >
        {/* 👇 تم تعديل النص هنا ليعكس الديناميكية */}
        <option value="carousel">ألبوم صور (ديناميكي: من 3 إلى 10 شرائح)</option>
        <option value="reel">فيديو قصير (Reel Script)</option>
    </select>
</div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !viralData}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            بدء الإنتاج السينمائي 🎬
                        </button>
                    </div>
                )}
            </div>

            {/* القسم الأيسر: شاشة النتائج المتعددة */}
            <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-white">مخرجات الاستوديو</h3>
                    {result && (
                        <button onClick={() => copyToClipboard(JSON.stringify(result))} className="text-sm flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-white transition-all">
                            {copied ? <CheckCircle size={16} className="text-green-400"/> : <Copy size={16}/>} 
                            {copied ? 'تم النسخ' : 'نسخ الكل'}
                        </button>
                    )}
                </div>

                {!result && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <Wand2 size={64} className="mb-4" />
                        <p className="text-lg">الاستوديو جاهز لتوليد المحتوى...</p>
                    </div>
                )}

                {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-purple-400">
                        <Loader2 className="animate-spin mb-4 text-purple-500" size={64} />
                        <p className="animate-pulse text-lg font-bold">جاري كتابة السيناريو وتوليد الأوامر البصرية...</p>
                    </div>
                )}

                {result && (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar animate-fade-in-up">
                        
{/* 1. قسم محتوى الشرائح (البيانات الجديدة) */}
<div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
        <FileText size={18}/> محتوى الشرائح ({result.categoryBadge})
    </h4>
    <div className="space-y-4 mt-4">
        {result.slides && result.slides.map((slide, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <span className="text-xs font-bold text-gray-500 mb-1 block">شريحة {slide.slideNumber} - {slide.type}</span>
                <h5 className="text-white font-bold text-lg mb-2">{slide.title}</h5>
                {slide.content && <p className="text-gray-300 text-sm mb-2">{slide.content}</p>}
                {slide.codeSnippet && (
                    <div className="bg-gray-950 p-3 rounded-md text-left dir-ltr mt-2">
                        <code className="text-green-400 text-sm font-mono">{slide.codeSnippet}</code>
                    </div>
                )}
                {slide.handwrittenNote && (
                    <p className="text-amber-400 text-sm font-bold mt-2 font-mono">✍️ {slide.handwrittenNote}</p>
                )}
            </div>
        ))}
    </div>
</div>

{/* 2. زر تشغيل محرك القوالب (Canvas) الفعلي */}
<div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mt-4 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
        <ImageIcon size={32} className="text-blue-400" />
    </div>
    <h4 className="text-lg font-bold text-gray-200 mb-2">محرك القوالب البصرية جاهز</h4>
    <p className="text-sm text-gray-400 mb-6 max-w-md">
        النصوص والأكواد جاهزة للطباعة على قالب "AutoFactory" المخصص الخاص بك.
    </p>
    <button 
        onClick={async () => {
            if (!result.slides) return;
            setIsPrinting(true);
            try {
                const res = await axios.post('http://localhost:5000/api/print-studio', {
                    slides: result.slides,
                    categoryBadge: result.categoryBadge
                });
                if (res.data.success) {
                    alert('✅ تم طباعة الصور بنجاح! راجع مجلد المشروع.');
                }
            } catch (err) {
                console.error(err);
                alert('❌ حدث خطأ أثناء الطباعة.');
            } finally {
                setIsPrinting(false);
            }
        }}
        disabled={isPrinting || !result.slides}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-900/50 transition-all disabled:opacity-50"
    >
        {isPrinting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        {isPrinting ? 'جاري رسم الصور...' : 'بدء طباعة الصور الآن'}
    </button>
</div>

                        {/* 3. قسم الكابشن والهاشتاجات */}
                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                            <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2"><Hash size={18}/> نص المنشور (Caption)</h4>
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                {result.caption}
                            </pre>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}