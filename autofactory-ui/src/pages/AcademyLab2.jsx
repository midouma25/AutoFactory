import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download, Microscope, Award } from 'lucide-react'; // 🆕 أضفنا Microscope

const AcademyLab2 = () => { // 🆕 تغيير اسم المكون
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('متوسط (B-Rank)');
  const [blueprint, setBlueprint] = useState(null);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [loadingIdea, setLoadingIdea] = useState(false);

  const [forgingStatus, setForgingStatus] = useState('idle'); 
  const [forgeProgress, setForgeProgress] = useState({ current: 0, total: 0, currentLessonName: '' });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [syncing, setSyncing] = useState(false); 

  // ==========================================
  // 💡 1. محرك الإلهامات الذكي V2
  // ==========================================
  const generateIdea = async (type) => {
    setLoadingIdea(true);
    setTopic('جاري العصف الذهني واستخراج فكرة... 🧠'); 

    try {
      // 🚨 التعديل: تغيير المسار إلى academy2
      const res = await axios.post('http://localhost:5000/api/academy2/suggest-topic', { type });
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
  // 📐 2. هندسة الهيكل V2 (اللامحدود)
  // ==========================================
  const handleGenerateBlueprint = async () => {
    if (!topic) return alert('يرجى إدخال أو توليد موضوع الدورة!');
    setLoadingBlueprint(true);
    try {
      // 🚨 التعديل: تغيير المسار إلى academy2
      const res = await axios.post('http://localhost:5000/api/academy2/blueprint1', { topic, difficulty });
      if (res.data.success) {
        setBlueprint(res.data.data);
        setForgingStatus('idle'); 
        setSelectedLesson(null);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ==========================================
  // ✍️ 3. تأليف الكورس V2 (التشريح + الزعماء)
  // ==========================================
  const handleForgeAllLessons = async () => {
    if (!blueprint) return;
    
    let totalLessons = 0;
    blueprint.blueprint.forEach(sec => {
      totalLessons += sec.lessons.length;
      totalLessons += Math.floor(sec.lessons.length / 2);
    });
    
    setForgingStatus('forging');
    let completedCount = 0;
    let updatedBlueprint = JSON.parse(JSON.stringify(blueprint));

    for (let sIdx = 0; sIdx < updatedBlueprint.blueprint.length; sIdx++) {
      const section = updatedBlueprint.blueprint[sIdx];
      let newLessonsArray = []; 
      let lessonsSinceLastBoss = 0;

      for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
        const lesson = section.lessons[lIdx];
        setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });

        try {
          // 🚨 التعديل: مسار تأليف الدرس V2
          const res = await axios.post('http://localhost:5000/api/academy2/forge-lesson', {
            courseTopic: updatedBlueprint.courseTitle,
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            difficulty: difficulty
          });

          if (res.data.success) {
            newLessonsArray.push({
              ...lesson,
              type: "video", 
              content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet || "",
              codeExplanation: res.data.data.codeExplanation || "", // 🆕 استلام حقل التشريح الجديد
              dailyQuest: res.data.data.dailyQuest || null, 
              isForged: true
            });
            lessonsSinceLastBoss++;
            completedCount++;
            setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: lesson.title });
          }

          if (lessonsSinceLastBoss === 2) {
             const prevLesson1 = newLessonsArray[newLessonsArray.length - 2];
             const prevLesson2 = newLessonsArray[newLessonsArray.length - 1];
             
             const hasCode = (prevLesson1.codeSnippet && prevLesson1.codeSnippet.length > 10) || 
                             (prevLesson2.codeSnippet && prevLesson2.codeSnippet.length > 10);
             
             const gateType = hasCode ? "البوابة الحمراء (Red Gate)" : "بوابة الزعيم (Boss Dungeon)";
             
             // 🚨 التعديل: مسارات الزعماء V2
             const apiUrl = hasCode ? 'http://localhost:5000/api/academy2/forge-red-gate' : 'http://localhost:5000/api/academy2/forge-boss';

             setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: `تجهيز ${gateType}...` });
             
             try {
                const bossRes = await axios.post(apiUrl, {
                  courseTopic: updatedBlueprint.courseTitle,
                  lesson1Content: prevLesson1.content,
                  lesson2Content: prevLesson2.content
                });

                if (bossRes.data.success) {
                  const bossQuestions = bossRes.data.data.bossQuiz || [];
                  newLessonsArray.push({
                    title: gateType,
                    description: hasCode 
                      ? "بوابة حمراء مليئة بتحديات الأكواد الدامية. كسر البوابة يتطلب نسبة 70%." 
                      : "اختبار شامل لكسر البوابة. يتطلب نسبة نجاح 70% للمرور.",
                    type: hasCode ? "red_gate" : "boss_quiz", 
                    content: "", 
                    codeSnippet: "",
                    bossQuiz: bossQuestions, 
                    isForged: true
                  });
                  lessonsSinceLastBoss = 0; 
                  completedCount++;
                  setForgeProgress({ current: completedCount, total: totalLessons, currentLessonName: "تم كسر البوابة!" });
                }
             } catch(bossErr) {
               console.error("خطأ في توليد الزعيم", bossErr);
             }
          }

        } catch (error) {
          console.error(`خطأ في تأليف درس: ${lesson.title}`);
        }
      }
      
      updatedBlueprint.blueprint[sIdx].lessons = newLessonsArray;
      setBlueprint({...updatedBlueprint});
    }
    
    setForgingStatus('complete');
    alert('🎉 اكتمل تأليف الكورس وبوابات الزعماء بالكامل! يمكنك الآن مراجعته.');
  };

  // ==========================================
  // 🚀 4. المزامنة مع المنصة (سيرفر 5001 يبقى كما هو)
  // ==========================================
  const handleSyncToPlatform = async () => {
    if (!blueprint || forgingStatus !== 'complete') return;
    
    const confirmSync = window.confirm('هل أنت متأكد من رفع هذا الكورس بالكامل إلى قاعدة بيانات منصتك؟');
    if (!confirmSync) return;

    setSyncing(true);
    try {
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
  // 💾 5. تصدير الكورس كملف V2
  // ==========================================
  const handleDownloadJSON = () => {
    if (!blueprint) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    
    const safeTitle = blueprint.courseTitle.replace(/[^a-zA-Z0-9أ-ي]/g, '_');
    // 🆕 تمييز اسم الملف المُصدّر
    downloadAnchorNode.setAttribute("download", `CourseExport_V2_${safeTitle}.json`);
    
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      
      {/* 🎨 الهيدر - تغيير الألوان لتمييز مختبر V2 */}
      <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-indigo-500" size={40} /> مختبر الأكاديمية <span className="text-indigo-500 bg-indigo-500/10 text-lg px-3 py-1 rounded-lg border border-indigo-500/20">V2 (BETA)</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">بيئة تجارب معزولة: هندسة لا محدودة، تشريح أكواد، وبوابات حمراء.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================================================== */}
        {/* العمود الأيمن */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="text-indigo-500" /> هندسة المنهج
            </h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => { generateIdea('crash'); setDifficulty('crash_eli5'); }} className="flex-1 bg-slate-800 hover:bg-yellow-900/30 border border-slate-700 hover:border-yellow-500/50 text-slate-400 hover:text-yellow-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Zap size={14}/> كراش كورس
              </button>
              <button onClick={() => { generateIdea('money'); setDifficulty('متوسط (B-Rank)'); }} className="flex-1 bg-slate-800 hover:bg-emerald-900/30 border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <TrendingUp size={14}/> مهارة للربح
              </button>
              <button onClick={() => { generateIdea('trend'); setDifficulty('متوسط (B-Rank)'); }} className="flex-1 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500/50 text-slate-400 hover:text-purple-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Lightbulb size={14}/> تريند ومطلوب
              </button>
              <button onClick={() => { generateIdea('bootcamp'); setDifficulty('معسكر شامل (Bootcamp - شهادات مصغرة)'); }} className="flex-1 bg-slate-800 hover:bg-rose-900/30 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-bold py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1">
                <GraduationCap size={14}/> معسكر شامل
              </button>

              {/* 🆕 الزر الجديد الاحترافي الخاص بـ Coursera */}
            <button 
              onClick={() => { generateIdea('coursera'); setDifficulty('معسكر شامل (Bootcamp - شهادات مصغرة)'); }} 
              className="w-full mb-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-800/50 hover:to-indigo-800/50 border border-blue-500/40 text-blue-300 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center justify-center gap-2"
            >
              <Award size={18} className="text-blue-400" /> 
              استلهام "شهادة مهنية" برعاية شركة كبرى (Coursera Style)
            </button>

            
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">الموضوع المراد تدريسه</label>
                <input type="text" placeholder="مثال: احتراف بناء تطبيقات بـ Electron.js" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">مستوى الصعوبة وأسلوب الشرح</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white appearance-none cursor-pointer" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="crash_eli5">كراش كورس (تبسيط مطلق - اشرح لي كأني طفل 👶)</option>
                  <option value="مبتدئ تماماً (E-Rank)">مبتدئ تماماً (E-Rank)</option>
                  <option value="متوسط (B-Rank)">متوسط (B-Rank)</option>
                  <option value="خبير متقدم (S-Rank)">خبير متقدم (S-Rank)</option>
                  <option value="معسكر شامل (Bootcamp - شهادات مصغرة)">معسكر شامل (Bootcamp - شهادات مصغرة)</option>
                </select>
              </div>
              
              <button onClick={handleGenerateBlueprint} disabled={loadingBlueprint || forgingStatus === 'forging'} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingBlueprint ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <><Wand2 size={20} /> هندسة خريطة المنهج (V2)</>}
              </button>
            </div>
          </div>

{/* 🎓 عرض شجرة المنهج (Coursera Professional Certificate Style) */}
          {blueprint && (
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden">
              
              {/* ترويسة الشهادة المهنية */}
              <div className="bg-gradient-to-r from-indigo-950 via-[#0b1120] to-[#0b1120] p-8 border-b border-slate-800 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-4">
                  <GraduationCap size={16} /> برنامج شهادة مهنية (Professional Certificate)
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{blueprint.courseTitle}</h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium max-w-3xl">{blueprint.courseDescription}</p>
                
                <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white"><Layers size={20} /></div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">سلسلة كورسات</p>
                      <p className="text-sm text-white font-black">{blueprint.blueprint.length} Courses series</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400"><CheckCircle size={20} /></div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">المستوى</p>
                      <p className="text-sm text-white font-black">من الصفر للاحتراف</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* قائمة الكورسات (المساقات) */}
              <div className="p-8 space-y-8">
                <h3 className="text-2xl font-black text-white mb-6">الكورسات المشمولة في هذه الشهادة:</h3>
                
                {blueprint.blueprint.map((section, sIdx) => (
                  <div key={sIdx} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <span className="text-indigo-400 font-bold text-sm mb-2 block">{section.coursePrefix || `Course ${sIdx + 1}`} • {section.estimatedHours || '15 hours'}</span>
                        <h4 className="text-xl font-black text-white">{section.sectionName}</h4>
                      </div>
                    </div>

                    {/* المهارات المكتسبة (Skills you'll gain) */}
                    {section.skills && section.skills.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-bold text-slate-500 mb-3">المهارات التي ستكتسبها (Skills you'll gain):</p>
                        <div className="flex flex-wrap gap-2">
                          {section.skills.map((skill, skIdx) => (
                            <span key={skIdx} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* دروس الكورس */}
                    <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} onClick={() => lesson.isForged && setSelectedLesson(lesson)} className={`p-4 border-b border-slate-800/50 last:border-0 flex items-center justify-between transition-colors ${lesson.isForged ? 'hover:bg-indigo-950/30 cursor-pointer' : 'opacity-70'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${lesson.isForged ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                              {lesson.isForged ? <CheckCircle size={12} /> : <Play size={10} />}
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${lesson.isForged ? 'text-slate-200' : 'text-slate-400'}`}>{lesson.title}</p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{lesson.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                ))}
              </div>

              {/* زر التأليف */}
              {forgingStatus === 'idle' && (
                <div className="p-8 border-t border-slate-800 bg-slate-900/30">
                  <button onClick={handleForgeAllLessons} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 hover:-translate-y-1">
                    <BrainCircuit size={24} /> بناء محتوى الشهادة المهنية بالكامل (Forge Professional Certificate)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* العمود الأيسر (المعاينة) */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {forgingStatus !== 'idle' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {forgingStatus === 'forging' ? <div className="animate-pulse w-3 h-3 bg-purple-500 rounded-full"></div> : <CheckCircle className="text-emerald-500" />}
                {forgingStatus === 'forging' ? 'الذكاء الاصطناعي يقوم بالتأليف الآن...' : 'تم اكتمال تأليف الكورس'}
              </h3>
              
              <div className="w-full bg-slate-950 rounded-full h-4 mb-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(forgeProgress.current / forgeProgress.total) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span className="truncate w-3/4">{forgingStatus === 'forging' ? `جاري تأليف: ${forgeProgress.currentLessonName}` : 'جميع الدروس جاهزة!'}</span>
                <span>{forgeProgress.current} / {forgeProgress.total}</span>
              </div>
            </div>
          )}

          {/* شاشة معاينة الدرس */}
          <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col max-h-[600px]">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <BookOpen className="text-indigo-500" /> معاينة محتوى الدرس V2
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
                {selectedLesson.content && (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><FileText size={16}/> الشرح النظري</h4>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {selectedLesson.content}
                    </div>
                  </div>
                )}

                {/* 2. الكود البرمجي و (تشريح الكود 🆕) */}
                {selectedLesson.codeSnippet && selectedLesson.codeSnippet.trim() !== '' && (
                  <div className="bg-[#0d1117] border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2"><Code size={16}/> الكود البرمجي</h4>
                    <pre className="text-emerald-400 text-sm overflow-x-auto" dir="ltr">
                      <code>{selectedLesson.codeSnippet}</code>
                    </pre>

                    {/* 🆕 إضافة قسم تشريح الكود في المعاينة */}
                    {selectedLesson.codeExplanation && selectedLesson.codeExplanation.trim() !== '' && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                          <Microscope size={16} /> تشريح الكود (Code Anatomy)
                        </h4>
                        <div className="text-slate-400 text-sm whitespace-pre-wrap font-mono">
                          {selectedLesson.codeExplanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. التحديات (بوابات الزعيم والاختبارات) */}
                {selectedLesson.bossQuiz && selectedLesson.bossQuiz.length > 0 ? (
                  <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2"><Flame size={16}/> تحدي الزعيم / البوابة الحمراء</h4>
                    <p className="text-slate-400 text-sm mb-4">هذا الدرس يحتوي على {selectedLesson.bossQuiz.length} أسئلة تحدي.</p>
                  </div>
                ) : selectedLesson.dailyQuest && selectedLesson.dailyQuest.question ? (
                  <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-xl">
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2"><HelpCircle size={16}/> اختبار نهاية الدرس</h4>
                    <p className="text-white font-bold text-sm mb-4">{selectedLesson.dailyQuest.question}</p>
                    <div className="space-y-2">
                      {selectedLesson.dailyQuest.options.map((opt, i) => (
                        <div key={i} className={`p-3 rounded-lg border text-sm font-bold ${selectedLesson.dailyQuest.correctAnswerIndex === i ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                          {opt} {selectedLesson.dailyQuest.correctAnswerIndex === i && '(إجابة صحيحة)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {forgingStatus === 'complete' && (
            <div className="flex gap-4 animate-fade-in-up">
              <button onClick={handleDownloadJSON} className="flex-1 bg-slate-800 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 text-blue-400 hover:text-white font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg">
                <Download size={24} /> تحميل كملف V2
              </button>

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

export default AcademyLab2;