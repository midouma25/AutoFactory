import React, { useState } from 'react';
import { Brain, TrendingUp, Calendar, History, Sparkles, Target, Loader2, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';

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
    const [selectedNiche, setSelectedNiche] = useState(niches[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisType, setAnalysisType] = useState(''); // 'manual' or 'auto'
    const [copied, setCopied] = useState(false);

    // دالة محاكاة الاتصال بالخادم للحصول على التريند (سنربطها بالخادم لاحقاً)
    const fetchTrend = async (niche, isAuto = false) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalysisType(isAuto ? 'auto' : 'manual');
        setCopied(false);

        try {
            // ملاحظة: هذا الاتصال يفترض أننا سنضيف مسار '/api/analyze-trend' في الخادم لاحقاً
            // حالياً سنستخدم تأخير بسيط لمحاكاة التفكير وعرض واجهة احترافية
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // بيانات وهمية مؤقتة حتى نربطها بـ Groq في الخادم
            const mockTrend = {
                niche: niche,
                trend: isAuto ? `كيف تستخدم الذكاء الاصطناعي لتحسين جودة الكود في ${niche.split(' ')[0]}؟` : `أهم 3 تحديثات في مجال ${niche.split(' ')[0]} هذا الأسبوع`,
                reasoning: isAuto 
                    ? "بناءً على تحليل خوارزمية إنستغرام ليوم الثلاثاء، وتجنباً لتكرار منشور الأمس (تطوير الويب)، هذا الموضوع يحقق أعلى تفاعل تقني اليوم."
                    : "هذا الموضوع يحقق نمواً بنسبة 40% في عمليات البحث على محركات التقنية خلال الـ 24 ساعة الماضية."
            };

            setAnalysisResult(mockTrend);
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء تحليل البيانات");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // قرار الوكيل الذكي (Auto-Decider)
    const handleAutoDecide = () => {
        // الخوارزمية تختار مجالاً عشوائياً (محاكاة لاتخاذ القرار الذكي)
        const randomNiche = niches[Math.floor(Math.random() * niches.length)];
        fetchTrend(randomNiche, true);
    };

    // نسخ الفكرة لنقلها لاستوديو الأوامر
    const copyToClipboard = () => {
        if (analysisResult) {
            navigator.clipboard.writeText(analysisResult.trend);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
            
            {/* القسم الأيمن: لوحة التحكم والتحليل */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* 1. خيار الذكاء الاصطناعي المستقل */}
                <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl p-6 border border-indigo-500/30 shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-lg">
                            <Brain size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">الوكيل الاستراتيجي (Auto)</h3>
                            <p className="text-indigo-200 text-sm">دع النظام يحلل ويقرر ما يجب نشره اليوم</p>
                        </div>
                    </div>
                    
                    <ul className="text-sm text-indigo-200/80 mb-6 space-y-2">
                        <li className="flex items-center gap-2"><Calendar size={16}/> يحلل سيكولوجية يوم الأسبوع</li>
                        <li className="flex items-center gap-2"><History size={16}/> يراجع أرشيف منشوراتك السابقة</li>
                        <li className="flex items-center gap-2"><TrendingUp size={16}/> يكتشف أعلى التريندات التقنية</li>
                    </ul>

                    <button
                        onClick={handleAutoDecide}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-lg"
                    >
                        {isAnalyzing && analysisType === 'auto' ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {isAnalyzing && analysisType === 'auto' ? 'جاري التحليل المعقد...' : 'استخرج الفكرة الذهبية الآن'}
                    </button>
                </div>

                {/* 2. خيار التحليل اليدوي الموجه */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-900/50 text-blue-400 rounded-lg">
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">التوجيه اليدوي</h3>
                            <p className="text-gray-400 text-sm">اختر المجال الذي تريده وسنستخرج التريند له</p>
                        </div>
                    </div>

                    <select 
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="w-full bg-gray-900 text-white border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none mb-4 appearance-none"
                    >
                        {niches.map((niche, idx) => (
                            <option key={idx} value={niche}>{niche}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetchTrend(selectedNiche, false)}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        {isAnalyzing && analysisType === 'manual' ? <Loader2 className="animate-spin" /> : <TrendingUp />}
                        حلل هذا المجال
                    </button>
                </div>
            </div>

            {/* القسم الأيسر: شاشة عرض النتائج */}
            <div className="lg:col-span-7 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col h-full min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                    نتائج التحليل و الفكرة المقترحة
                </h3>

                {!analysisResult && !isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <Brain size={64} className="mb-4" />
                        <p className="text-lg">الوكيل الاستراتيجي في وضع الاستعداد...</p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-blue-400">
                        <div className="relative">
                            <Loader2 className="animate-spin mb-6 text-blue-500" size={64} />
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 opacity-50" size={24} />
                        </div>
                        <p className="animate-pulse text-lg font-bold">يتم فحص قواعد البيانات وتحليل الخوارزميات...</p>
                    </div>
                )}

                {analysisResult && !isAnalyzing && (
                    <div className="flex-1 flex flex-col animate-fade-in-up">
                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-4">
                            <span className="text-xs font-bold text-blue-400 mb-2 block">المجال المستهدف:</span>
                            <p className="text-white font-medium">{analysisResult.niche}</p>
                        </div>

                        <div className="bg-indigo-900/40 rounded-xl p-6 border border-indigo-500/50 mb-4 relative">
                            <span className="text-xs font-bold text-indigo-300 mb-3 block flex items-center gap-2">
                                <Sparkles size={14}/> الفكرة الرائجة (التريند):
                            </span>
                            <p className="text-2xl font-bold text-white leading-relaxed">
                                {analysisResult.trend}
                            </p>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-auto">
                            <span className="text-xs font-bold text-gray-400 mb-2 block">مبررات الاختيار (لماذا هذه الفكرة؟):</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.reasoning}</p>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button 
                                onClick={copyToClipboard}
                                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                    copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                            >
                                {copied ? <CheckCircle size={20}/> : <Copy size={20}/>}
                                {copied ? 'تم النسخ!' : 'انسخ الفكرة'}
                            </button>
                            <button 
                                onClick={() => alert('في التحديث القادم: سينقلك هذا الزر مباشرة لاستوديو الأوامر مع الفكرة!')}
                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                <Sparkles size={20}/>
                                ابدأ تصميم الدرس
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}