import React, { useState } from 'react';
import { Brain, TrendingUp, Calendar, History, Sparkles, Target, Loader2, Copy, CheckCircle, FlaskConical, Eye, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // للتنقل بين الصفحات
import useIdeaStore from '../store/useIdeaStore'; // المخزن الذي أنشأناه للتو
// قائمة مجالاتك الاحترافية
const niches = [
    "تطوير الويب وهندسة البرمجيات (Web Dev, Node.js, React, Python)",
    "الذكاء الاصطناعي، نماذج LLMs، وطرق استغلالها في المشاريع",
    "التعليق الصوتي المدمج بالذكاء الاصطناعي وهندسة الصوتيات",
    "أسرار وحيل سريعة في المونتاج",
    "التداول الكمي والخوارزمي (Quantitative Trading) بالبرمجة",
    "تبسيط الخوارزميات المعقدة والرياضيات البرمجية",
    "عالم الهاردوير، تجميع الحواسيب، والمقارنات التقنية",
    "ثقافة عامة تقنية، وحلول ذكية لمشاكل برمجية",
    "منهجيات فعالة لدراسة اللغات البرمجية والإنجليزية التقنية",
    "تحفيز، انضباط يومي، وقصص نجاح تقنية",
    "صحة المبرمج: الرياضة، الانضباط الجسدي والروتين",
    "التلعيب (Gamification) ومشاريع برمجية ممتعة",
    "دمج البرمجة بالعالم المادي (IoT)"
];

export default function TrendHub() {
    // حالة التحكم بنوع الواجهة (trend vs lab)
    const [activeMode, setActiveMode] = useState('trend'); 
    
    // حالات قسم التريند
    const [selectedNiche, setSelectedNiche] = useState(niches[0]);
    
    // حالات قسم المختبر
    const [customIdea, setCustomIdea] = useState('');

    // الحالات المشتركة
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [copied, setCopied] = useState(false);

    // دالة استخراج التريند (القديمة)
    const fetchTrend = async (niche, isAuto = false) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const response = await axios.post('http://localhost:5000/api/analyze-trend', { niche, isAuto });
            if (response.data?.success) {
                setAnalysisResult({ type: 'trend', ...response.data });
            }
        } catch (error) {
            alert("❌ حدث خطأ في الخادم.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // دالة هندسة الفكرة (الجديدة)
    const engineerIdea = async () => {
        if (!customIdea.trim()) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const response = await axios.post('http://localhost:5000/api/engineer-idea', { rawIdea: customIdea });
            if (response.data?.success) {
                setAnalysisResult({ type: 'engineered', ...response.data });
            }
        } catch (error) {
            alert("❌ حدث خطأ في الخادم.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };
 const navigate = useNavigate();
const setViralData = useIdeaStore((state) => state.setViralData);

// دالة النقل الذكية
const handleTransferToStudio = () => {
    // 1. حفظ البيانات المندسة في المخزن
    setViralData(analysisResult); 
    // 2. توجيه المستخدم فوراً إلى صفحة الاستوديو
    navigate('/studio'); 
};
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
            
            {/* القسم الأيمن: لوحة التحكم */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* مبدل الأوضاع (Toggle) */}
                <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700">
                    <button 
                        onClick={() => { setActiveMode('trend'); setAnalysisResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'trend' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <TrendingUp size={20}/> استكشاف التريند
                    </button>
                    <button 
                        onClick={() => { setActiveMode('lab'); setAnalysisResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeMode === 'lab' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <FlaskConical size={20}/> مختبر الأفكار
                    </button>
                </div>

                {/* واجهة استكشاف التريندات */}
                {activeMode === 'trend' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl p-6 border border-indigo-500/30">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Brain size={24}/> الوكيل الاستراتيجي</h3>
                            <p className="text-indigo-200 text-sm mb-6">دع النظام يحلل ويقرر المجال والتريند المناسب لليوم.</p>
                            <button onClick={() => fetchTrend(niches[Math.floor(Math.random() * niches.length)], true)} disabled={isAnalyzing} className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100">
                                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />} استخرج الفكرة الذهبية
                            </button>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Target size={24}/> التوجيه اليدوي</h3>
                            <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-gray-900 text-white border border-gray-600 rounded-xl p-4 mb-4">
                                {niches.map((niche, idx) => <option key={idx} value={niche}>{niche}</option>)}
                            </select>
                            <button onClick={() => fetchTrend(selectedNiche, false)} disabled={isAnalyzing} className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                {isAnalyzing ? <Loader2 className="animate-spin" /> : <TrendingUp />} حلل هذا المجال
                            </button>
                        </div>
                    </div>
                )}

                {/* واجهة مختبر الأفكار */}
                {activeMode === 'lab' && (
                    <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-2xl p-6 border border-pink-500/30 shadow-xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
                                <FlaskConical size={28} className={isAnalyzing ? "animate-pulse" : ""} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">مُهندس التريند</h3>
                                <p className="text-pink-200/70 text-sm">أعطني فكرة ميتة، وسأحييها لك.</p>
                            </div>
                        </div>
                        
                        <textarea
                            value={customIdea}
                            onChange={(e) => setCustomIdea(e.target.value)}
                            placeholder="مثال: أريد عمل درس مقارنة بين لغة Python و JavaScript، كيف أقدمه ليكون تريند؟"
                            className="w-full h-32 bg-gray-900/80 border border-pink-500/30 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 resize-none mb-6 placeholder-gray-500"
                        ></textarea>

                        <button
                            onClick={engineerIdea}
                            disabled={isAnalyzing || !customIdea.trim()}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-pink-900/20"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Zap />}
                            حوّلها إلى قنبلة تفاعل 🚀
                        </button>
                    </div>
                )}
            </div>

            {/* القسم الأيسر: شاشة النتائج */}
            <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 border border-gray-700 flex flex-col min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">نتائج التحليل</h3>

                {!analysisResult && !isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <Brain size={64} className="mb-4" />
                        <p className="text-lg">في انتظار تعليماتك...</p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-blue-400">
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={64} />
                        <p className="animate-pulse text-lg font-bold">جاري المعالجة والتحليل الإبداعي...</p>
                    </div>
                )}

                {/* عرض النتيجة إذا كان النمط "تريند عادي" */}
                {analysisResult?.type === 'trend' && (
                    <div className="flex-1 flex flex-col animate-fade-in-up">
                        <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-500/50 mb-4">
                            <span className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2"><Sparkles size={14}/> الفكرة الرائجة:</span>
                            <p className="text-2xl font-bold text-white leading-relaxed">{analysisResult.trend}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-auto">
                            <span className="text-xs font-bold text-gray-400 mb-2 block">مبررات النجاح:</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.reasoning}</p>
                        </div>
                        <button onClick={() => copyToClipboard(analysisResult.trend)} className="mt-6 w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex justify-center gap-2">
                            {copied ? <CheckCircle size={20}/> : <Copy size={20}/>} {copied ? 'تم النسخ!' : 'انسخ الفكرة'}
                        </button>
                    </div>
                )}

                {/* عرض النتيجة إذا كان النمط "هندسة فكرة" (المختبر) */}
                {analysisResult?.type === 'engineered' && (
                    <div className="flex-1 flex flex-col gap-4 animate-fade-in-up">
                        <div className="bg-pink-900/30 rounded-xl p-5 border border-pink-500/30 border-l-4 border-l-pink-500">
                            <span className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-2"><Zap size={14}/> الخطاف الجذاب (Hook):</span>
                            <p className="text-xl font-bold text-white">{analysisResult.hook}</p>
                        </div>
                        
                        <div className="bg-blue-900/30 rounded-xl p-5 border border-blue-500/30 border-l-4 border-l-blue-500">
                            <span className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2"><Eye size={14}/> أسلوب التقديم البصري:</span>
                            <p className="text-white text-md leading-relaxed">{analysisResult.presentation}</p>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-auto">
                            <span className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2"><Brain size={14}/> الزاوية النفسية (لماذا ستنجح؟):</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.viralAngle}</p>
                        </div>

<button 
    onClick={handleTransferToStudio} 
    className="mt-2 w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl flex justify-center gap-2 hover:opacity-90"
>
    <Sparkles size={20}/> اعتماد ونقل للاستوديو
</button>
                    </div>
                )}
            </div>
        </div>
    );
}