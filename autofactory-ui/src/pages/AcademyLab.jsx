import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download } from 'lucide-react';


const AcademyLab = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('متوسط (B-Rank)');
  const [blueprint, setBlueprint] = useState(null);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [loadingIdea, setLoadingIdea] = useState(false);

  const [forgingStatus, setForgingStatus] = useState('idle'); 
  const [forgeProgress, setForgeProgress] = useState({ current: 0, total: 0, currentLessonName: '' });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [syncing, setSyncing] = useState(false); // حالة زر المزامنة



// ===========
// ===============================
  // 💡 1. محرك الإلهامات الذكي (Ideas Engine)
  // ==========================================
  const generateIdea = async (type) => {
    setLoadingIdea(true);
    // إفراغ حقل النص أثناء التفكير ليعرف المستخدم أن هناك عملية تحدث
    setTopic('جاري العصف الذهني واستخراج فكرة... 🧠'); 

try {
      const res = await axios.post('http://localhost:5000/api/academy/suggest-topic', { type });
      if (res.data.success && res.data.idea) {
        setTopic(res.data.idea);
      }
    } catch (err) {
      const fallbacks = [
        type === 'bootcamp' ? 'معسكر MERN Stack الشامل: 4 شهادات فرعية لبناء تطبيقات مؤسسية' : 'الذكاء الاصطناعي للمطورين: من الصفر إلى إطلاق أول Agent'
      ];
      setTopic(fallbacks[0]);
    } finally {
      setLoadingIdea(false);
    }
  };

  // ==========================================
  // 📐 2. هندسة الهيكل (Blueprint)
  // ==========================================
  const handleGenerateBlueprint = async () => {
    if (!topic) return alert('يرجى إدخال أو توليد موضوع الدورة!');
    setLoadingBlueprint(true);
    try {
      const res = await axios.post('http://localhost:5000/api/academy/blueprint', { topic, difficulty });
      if (res.data.success) {
        setBlueprint(res.data.data);
        setForgingStatus('idle'); // إعادة تعيين الحالة
        setSelectedLesson(null);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ==========================================
  // ✍️ 3. تأليف الكورس (The Forge)
  // ==========================================
  const handleForgeAllLessons = async () => {
    if (!blueprint) return;
    
    let totalLessons = 0;
    blueprint.blueprint.forEach(sec => totalLessons += sec.lessons.length);
    
    setForgingStatus('forging');
    let completedCount = 0;
    let updatedBlueprint = JSON.parse(JSON.stringify(blueprint));

    for (let sIdx = 0; sIdx < updatedBlueprint.blueprint.length; sIdx++) {
      const section = updatedBlueprint.blueprint[sIdx];
      for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
        const lesson = section.lessons[lIdx];
        setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });

        try {
          const res = await axios.post('http://localhost:5000/api/academy/forge-lesson', {
            courseTopic: updatedBlueprint.courseTitle,
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            difficulty: difficulty
          });

          if (res.data.success) {
            updatedBlueprint.blueprint[sIdx].lessons[lIdx] = {
              ...lesson,
              content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet || "", // حماية إضافية
              // 🆕 وضعنا الـ quiz داخل مصفوفة [] لكي يتطابق مع منصتك!
              quiz: res.data.data.quiz && res.data.data.quiz.question ? [res.data.data.quiz] : [], 
              isForged: true
            };
            setBlueprint({...updatedBlueprint}); 
          }
        } catch (error) {
          console.error(`خطأ في تأليف درس: ${lesson.title}`);
        }
        
        completedCount++;
        setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });
      }
    }
    setForgingStatus('complete');
    alert('🎉 اكتمل تأليف الكورس بالكامل! يمكنك الآن مراجعته.');
  };

  // ==========================================
  // 🚀 4. المزامنة مع المنصة (The API Bridge)
  // ==========================================
  const handleSyncToPlatform = async () => {
    if (!blueprint || forgingStatus !== 'complete') return;
    
    const confirmSync = window.confirm('هل أنت متأكد من رفع هذا الكورس بالكامل إلى قاعدة بيانات منصتك؟');
    if (!confirmSync) return;

    setSyncing(true);
    try {
      // ⚠️ أرسل البيانات إلى السيرفر الخاص بـ CherifPlatform! 
      // (تأكد من أن السيرفر يعمل على بورت 5001 أو البورت الذي تستخدمه المنصة)
      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: blueprint.courseTitle,
        courseDescription: blueprint.courseDescription,
        difficulty: difficulty,
        blueprint: blueprint.blueprint
      });

      if (res.data.success) {
        alert('🎉 تم إطلاق الكورس بنجاح! اذهب الآن لـ CherifPlatform وستجده هناك مع كل دروسه!');
      }
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ في المزامنة. تأكد من أن سيرفر CherifPlatform يعمل (على البورت 5001).');
    } finally {
      setSyncing(false);
    }
  };

// ==========================================
  // 💾 5. تصدير الكورس كملف (فكرتك العبقرية)
  // ==========================================
  const handleDownloadJSON = () => {
    if (!blueprint) return;
    
    // تحويل الكائن إلى نص JSON منسق
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    
    // تسمية الملف باسم الكورس مع استبدال المسافات
    const safeTitle = blueprint.courseTitle.replace(/[^a-zA-Z0-9أ-ي]/g, '_');
    downloadAnchorNode.setAttribute("download", `CourseExport_${safeTitle}.json`);
    
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };


  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      
      {/* الهيدر */}
      <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-emerald-500" size={40} /> مختبر الأكاديمية <span className="text-emerald-500 bg-emerald-500/10 text-lg px-3 py-1 rounded-lg border border-emerald-500/20">Auto-Course AI</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">مصنع توليد الكورسات وهيكلة المناهج التعليمية بضغطة زر ونقلها لـ CherifPlatform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================================================== */}
        {/* العمود الأيمن */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. إعدادات وإلهامات التوليد */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="text-blue-500" /> هندسة المنهج
            </h2>

            {/* أزرار الإلهام السريعة */}
{/* أزرار الإلهام السريعة */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => generateIdea('crash')} className="flex-1 bg-slate-800 hover:bg-yellow-900/30 border border-slate-700 hover:border-yellow-500/50 text-slate-400 hover:text-yellow-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Zap size={14}/> كراش كورس
              </button>
              <button onClick={() => generateIdea('money')} className="flex-1 bg-slate-800 hover:bg-emerald-900/30 border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <TrendingUp size={14}/> مهارة للربح
              </button>
              <button onClick={() => generateIdea('trend')} className="flex-1 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/50 text-slate-400 hover:text-purple-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Lightbulb size={14}/> تريند ومطلوب
              </button>
              {/* 🆕 الزر الجديد للتخصصات الكبرى */}
              <button onClick={() => generateIdea('bootcamp')} className="flex-1 bg-slate-800 hover:bg-rose-900/30 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <GraduationCap size={14}/> معسكر شامل
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">الموضوع المراد تدريسه (اكتب أو اختر من الإلهامات)</label>
                <input type="text" placeholder="مثال: احتراف بناء تطبيقات بـ Electron.js" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
<div>
                <label className="block text-sm font-bold text-slate-400 mb-2">مستوى الصعوبة المستهدف</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white appearance-none" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="مبتدئ تماماً (E-Rank)">مبتدئ تماماً (E-Rank)</option>
                  <option value="متوسط (B-Rank)">متوسط (B-Rank)</option>
                  <option value="خبير متقدم (S-Rank)">خبير متقدم (S-Rank)</option>
                  {/* 🆕 الخيار الخاص بالمعسكرات والشهادات المصغرة */}
                  <option value="معسكر شامل (Bootcamp - شهادات مصغرة)">معسكر شامل (Bootcamp - شهادات مصغرة)</option>
                </select>
              </div>
              
              <button onClick={handleGenerateBlueprint} disabled={loadingBlueprint || forgingStatus === 'forging'} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingBlueprint ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <><Wand2 size={20} /> هندسة خريطة المنهج</>}
              </button>
            </div>
          </div>

          {/* 2. عرض شجرة المنهج (Blueprint Tree) */}
          {blueprint && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">{blueprint.courseTitle}</h2>
              <p className="text-sm text-slate-400 mb-6 border-b border-slate-800 pb-4">{blueprint.courseDescription}</p>
              
              <div className="space-y-4">
                {blueprint.blueprint.map((section, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-black text-emerald-400 mb-3 text-sm flex items-center gap-2"><ChevronLeft size={16}/> {section.sectionName}</h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} onClick={() => lesson.isForged && setSelectedLesson(lesson)} className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-between transition-colors ${lesson.isForged ? 'bg-emerald-900/10 border-emerald-500/30 text-white cursor-pointer hover:bg-emerald-900/30' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <div className="flex items-center gap-2 truncate">
                            <Play size={14} className={lesson.isForged ? 'text-emerald-500' : 'text-slate-600'} />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {lesson.isForged && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {forgingStatus === 'idle' && (
                <button onClick={handleForgeAllLessons} className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2">
                  <BrainCircuit size={20} /> تأليف محتوى جميع الدروس
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* العمود الأيسر */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* حالة التأليف المباشرة */}
          {forgingStatus !== 'idle' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {forgingStatus === 'forging' ? <div className="animate-pulse w-3 h-3 bg-purple-500 rounded-full"></div> : <CheckCircle className="text-emerald-500" />}
                {forgingStatus === 'forging' ? 'الذكاء الاصطناعي يقوم بالتأليف الآن...' : 'تم اكتمال تأليف الكورس'}
              </h3>
              
              <div className="w-full bg-slate-950 rounded-full h-4 mb-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(forgeProgress.current / forgeProgress.total) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span className="truncate w-3/4">{forgingStatus === 'forging' ? `جاري تأليف: ${forgeProgress.currentLessonName}` : 'جميع الدروس جاهزة!'}</span>
                <span>{forgeProgress.current} / {forgeProgress.total}</span>
              </div>
            </div>
          )}

          {/* شاشة معاينة الدرس (Preview) */}
          <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col max-h-[600px]">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <BookOpen className="text-emerald-500" /> معاينة محتوى الدرس
            </h2>

            {!selectedLesson ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
                <BookOpen size={64} className="opacity-20" />
                <p className="font-bold">اضغط على أي درس (مكتمل باللون الأخضر) لرؤية محتواه هنا.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <h1 className="text-2xl font-black text-white">{selectedLesson.title}</h1>
                
                {/* 1. الشرح النظري */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><FileText size={16}/> الشرح النظري</h4>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedLesson.content}
                  </div>
                </div>

                {/* 2. الكود البرمجي */}
                {selectedLesson.codeSnippet && selectedLesson.codeSnippet.trim() !== '' && (
                  <div className="bg-[#0d1117] border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2"><Code size={16}/> الكود البرمجي</h4>
                    <pre className="text-emerald-400 text-sm overflow-x-auto" dir="ltr">
                      <code>{selectedLesson.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* 3. الاختبار التفاعلي */}
                {selectedLesson.quiz && selectedLesson.quiz.question && (
                  <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-xl">
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><HelpCircle size={16}/> اختبار نهاية الدرس</h4>
                    <p className="text-white font-bold text-sm mb-4">{selectedLesson.quiz.question}</p>
                    <div className="space-y-2">
                      {selectedLesson.quiz.options.map((opt, i) => (
                        <div key={i} className={`p-3 rounded-lg border text-sm font-bold ${selectedLesson.quiz.correctAnswerIndex === i ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          {opt} {selectedLesson.quiz.correctAnswerIndex === i && '(إجابة صحيحة)'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

{/* 🚀 أزرار النقل والحفظ (تظهر بعد اكتمال التأليف) */}
          {forgingStatus === 'complete' && (
            <div className="flex gap-4 animate-fade-in-up">
              
              {/* زر فكرتك (تصدير كملف) */}
              <button onClick={handleDownloadJSON} className="flex-1 bg-slate-800 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 text-blue-400 hover:text-white font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg">
                <Download size={24} /> تحميل كملف (JSON)
              </button>

              {/* زر المزامنة المباشرة (بعد إصلاح السيرفر) */}
              <button onClick={handleSyncToPlatform} disabled={syncing} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 text-lg disabled:opacity-50">
                {syncing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                ) : (
                  <><Server size={24} className="animate-pulse" /> مزامنة لـ CherifPlatform</>
                )}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AcademyLab;