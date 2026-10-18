import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, 
  FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download, 
  Microscope, Award, Flame, Link2, Sparkles, Trophy, GitBranch, Bot, 
  Save, Clock, Trash2, RefreshCw, Briefcase, DollarSign, CheckCircle2, Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const AcademyLab2 = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('pro_certificate_eli5');
  const [blueprint, setBlueprint] = useState(null);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [loadingIdea, setLoadingIdea] = useState(false);

  const [forgingStatus, setForgingStatus] = useState('idle'); 
  const [forgeProgress, setForgeProgress] = useState({ current: 0, total: 0, currentLessonName: '' });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const [activeCourseIndex, setActiveCourseIndex] = useState(null);
  const [syncingCourseIdx, setSyncingCourseIdx] = useState(null);
  const [autoPilotRunning, setAutoPilotRunning] = useState(false);

  // 🆕 حالات خاصة بتجميع الشهادة المهنية ومعاينتها التفصيلية
  const [previewMode, setPreviewMode] = useState('lesson'); // 'lesson' | 'certificate_dossier'
  const [generatingDossier, setGeneratingDossier] = useState(false);
  const [bundlingExisting, setBundlingExisting] = useState(false);

  // ==========================================
  // 💾 0. نظام الحفظ المحلي الآمن (Anti-Quota Crash Shield)
  // ==========================================
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem('academyLab2_draft');
    if (draft) {
      setHasDraft(true);
      try {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.timestamp) {
          setLastSaved(parsedDraft.timestamp);
        }
      } catch (e) {
        console.error("خطأ في قراءة المسودة القديمة");
      }
    }
  }, []);

  useEffect(() => {
    if (blueprint) {
      saveDraft();
    }
  }, [blueprint]);

  const saveDraft = () => {
    if (!blueprint) return;
    const timestamp = new Date().toLocaleTimeString('ar-EG');
    
    try {
      const draftData = {
        topic,
        difficulty,
        blueprint,
        timestamp
      };
      
      const serializedData = JSON.stringify(draftData);
      
      if (serializedData.length > 4 * 1024 * 1024) {
        console.warn("⚠️ تحذير: حجم الشهادة المهنية اقترب من الحد الأقصى للتخزين المحلي. يتم حفظ الهيكل الأساسي.");
        const lightBlueprint = JSON.parse(serializedData);
        localStorage.setItem('academyLab2_draft', JSON.stringify({
          topic, difficulty, blueprint: lightBlueprint, timestamp
        }));
      } else {
        localStorage.setItem('academyLab2_draft', serializedData);
      }

      setLastSaved(timestamp);
      setHasDraft(true);
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error("❌ امتلاء ذاكرة LocalStorage المتصفح!");
        try {
          const lightVersion = {
            topic,
            difficulty,
            blueprint: {
              ...blueprint,
              courses: blueprint.courses?.map(c => ({
                ...c,
                sections: c.sections?.map(s => ({
                  ...s,
                  lessons: s.lessons?.map(l => ({ title: l.title, type: l.type, isForged: l.isForged }))
                }))
              }))
            },
            timestamp
          };
          localStorage.setItem('academyLab2_draft', JSON.stringify(lightVersion));
          setLastSaved(timestamp + " (نسخة خفيفة)");
          setHasDraft(true);
        } catch (innerErr) {
          console.error("فشل الحفظ الاحتياطي أيضاً", innerErr);
        }
      } else {
        console.error("خطأ غير متوقع في الحفظ التلقائي", error);
      }
    }
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('academyLab2_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setTopic(parsedDraft.topic || '');
        setDifficulty(parsedDraft.difficulty || 'pro_certificate_eli5');
        setBlueprint(parsedDraft.blueprint || null);
        setLastSaved(parsedDraft.timestamp || null);
        alert('✅ تم استرجاع مسودة العمل بنجاح!');
      } catch (e) {
        alert('❌ حدث خطأ أثناء قراءة المسودة.');
      }
    }
  };

  const clearDraft = () => {
    if (window.confirm('⚠️ تحذير: هل أنت متأكد من مسح المسودة المحفوظة؟ لن تتمكن من استرجاعها!')) {
      localStorage.removeItem('academyLab2_draft');
      setHasDraft(false);
      setLastSaved(null);
      setBlueprint(null);
      setTopic('');
    }
  };

  // ==========================================
  // 💡 1. محرك الإلهامات الذكي V2
  // ==========================================
  const generateIdea = async (type) => {
    setLoadingIdea(true);
    setTopic('جاري العصف الذهني واستخراج فكرة... 🧠'); 

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/suggest-topic', { type });
      if (res.data.success && res.data.idea) {
        setTopic(res.data.idea);
      }
    } catch (err) {
      const fallbacks = {
        coursera: 'الشهادة المهنية الشاملة في تطوير الويب المتكامل والذكاء الاصطناعي (MERN, AI Agents & Cloud)',
        bootcamp: 'معسكر MERN Stack الشامل: 4 شهادات فرعية لبناء تطبيقات مؤسسية',
        default: 'الذكاء الاصطناعي للمطورين: من الصفر إلى إطلاق أول Agent'
      };
      setTopic(fallbacks[type] || fallbacks.default);
    } finally {
      setLoadingIdea(false);
    }
  };

  // ==========================================
  // 📐 2. هندسة الهيكل V2 
  // ==========================================
  const handleGenerateBlueprint = async () => {
    if (!topic) return alert('يرجى إدخال أو توليد موضوع الدورة!');
    setLoadingBlueprint(true);
    setSelectedLesson(null);
    setForgingStatus('idle');

    try {
      const endpoint = difficulty === 'pro_certificate_eli5' 
        ? 'http://localhost:5000/api/academy2/blueprint-certificate'
        : 'http://localhost:5000/api/academy2/blueprint1';

      const res = await axios.post(endpoint, { topic, difficulty });
      if (res.data.success) {
        setBlueprint(res.data.data);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ==========================================
  // 👑 2.2 جديد: توليد الوثيقة التفصيلية الشاملة للشهادة المهنية وتجميع الكراش كورسات
  // ==========================================
  const handleGenerateMasterCertificateDossier = async () => {
    if (!blueprint || !blueprint.courses || blueprint.courses.length === 0) {
      return alert('لا توجد كراش كورسات لتجميعها في الشهادة المهنية!');
    }

    setGeneratingDossier(true);
    const certTitle = blueprint.courseTitle || blueprint.certificateTitle || topic || 'الشهادة المهنية الشاملة';

    // استخلاص ملخص دقيق لكل كراش كورس مع وحداته ومشاريعه وساعاته
    let totalHoursNum = 0;
    let totalUnitsCount = 0;
    let totalLessonsCount = 0;
    const allSkillsSet = new Set();

    const coursesSummary = blueprint.courses.map((c, idx) => {
      const hoursMatch = String(c.estimatedHours || '15').match(/\d+/);
      const cHours = hoursMatch ? parseInt(hoursMatch[0], 10) : 15;
      totalHoursNum += cHours;

      const unitsList = c.sections?.map(s => s.sectionName) || [];
      totalUnitsCount += unitsList.length || 8;

      const lessonsInCourse = c.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 45;
      totalLessonsCount += lessonsInCourse;

      (c.skills || []).forEach(sk => allSkillsSet.add(sk));

      return {
        courseOrder: idx + 1,
        coursePrefix: c.coursePrefix || `الكراش كورس ${idx + 1}`,
        courseTitle: c.courseTitle,
        description: c.courseDescription || c.description,
        estimatedHours: `${cHours} ساعة`,
        certificateBadge: c.certificateBadge || `شهادة إتمام ${c.courseTitle}`,
        connectionToPrevious: c.connectionToPrevious || (idx === 0 ? 'نقطة الانطلاق من الصفر المطلق' : `يبني مباشرة على مهارات الكراش كورس ${idx}`),
        githubProject: c.githubProject || {
          projectTitle: `مشروع تطبيقي متكامل: ${c.courseTitle}`,
          projectSummary: 'بناء المشروع خطوة بخطوة بمساعدة AI Agent ورفعه على GitHub'
        },
        skills: c.skills || [],
        unitsCount: unitsList.length || 8,
        lessonsCount: lessonsInCourse,
        unitsList
      };
    });

    // بناء الوثيقة التفصيلية محلياً كقاعدة صلبة + تعزيزها من السيرفر إن كان متاحاً
    let masterDossier = {
      certificateTitle: certTitle,
      executiveVision: `${blueprint.courseDescription || ''}\n\nصُممت هذه الشهادة المهنية الخارقة لتكون بديلاً عملياً ومكثفاً عن سنوات من التشتت الأكاديمي؛ حيث تم تفكيك التخصص بالكامل إلى (${blueprint.courses.length}) كراش كورس متسلسل يعتمد على مبدأ فاينمان (التبسيط لطفل صغير 👶) مع الغوص الهندسي العميق، بحيث يخرج الطالب من كل كراش كورس بشهادة فرعية موثقة ومشروع حقيقي مرفوع على GitHub بمساعدة وكلاء الذكاء الاصطناعي (AI Agents).`,
      mainAnalogy: blueprint.mainAnalogy || 'تشبيه قصصي متكامل يربط المفاهيم التقنية المعقدة بالحياة الواقعية من أول كورس حتى مشروع التخرج.',
      timePlan: {
        totalHours: `${totalHoursNum} ساعة تدريبية وتطبيقية`,
        totalCourses: blueprint.courses.length,
        totalUnits: totalUnitsCount,
        totalLessons: totalLessonsCount,
        durationStandard: `${Math.max(3, Math.round(totalHoursNum / 40))} أشهر (بمعدل 10 ساعات أسبوعياً)`,
        durationIntensive: `${Math.max(1, Math.round(totalHoursNum / 80))} شهرين (بمعدل 20 ساعة أسبوعياً - مسار مكثف)`
      },
      careerAndFinancialROI: {
        jobRoles: blueprint.superCertificate?.careerOutcomes || [
          'Full-Stack Software Engineer',
          'AI-Augmented Application Developer',
          'Backend & Cloud Solutions Architect',
          'Freelance Technical Consultant & SaaS Builder'
        ],
        freelanceServices: [
          'بناء وتطوير تطبيقات ومنصات ويب متكاملة للعملاء والشركات على منصات العمل الحر ($800 - $2,500 للمشروع).',
          'ربط الأنظمة بـ APIs ووكلاء الذكاء الاصطناعي لأتمتة المهام البرمجية بسرعة 10x.',
          'إعادة هيكلة قواعد البيانات وتحسين أداء التطبيقات ونشرها سحابياً.'
        ],
        saasOpportunities: [
          'تحويل مشاريع التخرج الـ ' + blueprint.courses.length + ' إلى منتجات رقمية قابلة للبيع كاشتراكات شهرية (Micro-SaaS).',
          'إطلاق أدوات برمجية مؤتمتة بالذكاء الاصطناعي تخدم قطاعات الأعمال.'
        ]
      },
      allSkills: Array.from(allSkillsSet),
      detailedCoursesGuide: coursesSummary.map(cs => ({
        ...cs,
        deepExplanation: `${cs.description} — في هذا الكراش كورس رقم (${cs.courseOrder}) يدرس الطالب (${cs.unitsCount} وحدات تفصيلية تضم ${cs.lessonsCount} درساً وتحدياً)، تتناوب بين الشرح القصصي المبسط، وتدريبات كتابة الكود التفاعلية المزودة بـ 3 تلميحات، وبوابات الزعماء والبوابات الحمراء، وصولاً إلى الاختبار النهائي المختلط لكل وحدة.`,
        keyTakeaways: cs.unitsList.length > 0 
          ? cs.unitsList.slice(0, 6) 
          : ['إتقان المفاهيم الأساسية بأسلوب ELI5', 'التطبيق العملي عبر مختبر الكود', 'اجتياز البوابات الحمراء واختبارات الوحدات', 'بناء ورفع مشروع الكورس على GitHub'],
        projectAndAiRole: `في الوحدة النهائية من هذا الكراش كورس، يقوم الطالب ببناء (${cs.githubProject.projectTitle}) من الصفر، ويتعلم كيف يوجه الأوامر الاحترافية (Prompts) لـ AI Agent لكتابة ومراجعة الكود وإصلاح الأخطاء، ثم يرفعه خطوة بخطوة على حسابه في GitHub.`
      }))
    };

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/forge-certificate-dossier', {
        certificateTitle: certTitle,
        certificateDescription: blueprint.courseDescription,
        mainAnalogy: blueprint.mainAnalogy,
        coursesSummary
      });

      if (res.data?.success && res.data.data) {
        const aiData = res.data.data;
        masterDossier = {
          ...masterDossier,
          executiveVision: aiData.executiveVision || masterDossier.executiveVision,
          timePlan: { ...masterDossier.timePlan, ...(aiData.timePlan || {}) },
          careerAndFinancialROI: aiData.careerAndFinancialROI || masterDossier.careerAndFinancialROI,
          detailedCoursesGuide: coursesSummary.map((cs, idx) => {
            const aiCourse = aiData.detailedCoursesGuide?.[idx] || {};
            return {
              ...cs,
              deepExplanation: aiCourse.deepExplanation || masterDossier.detailedCoursesGuide[idx].deepExplanation,
              keyTakeaways: aiCourse.keyTakeaways?.length > 0 ? aiCourse.keyTakeaways : masterDossier.detailedCoursesGuide[idx].keyTakeaways,
              projectAndAiRole: aiCourse.projectAndAiRole || masterDossier.detailedCoursesGuide[idx].projectAndAiRole
            };
          })
        };
      }
    } catch (err) {
      console.log('ℹ️ تم استخدام المولد التفصيلي المدمج لتجهيز وثيقة الشهادة المهنية فوراً.');
    }

    const updatedBlueprint = {
      ...blueprint,
      masterDossier
    };
    setBlueprint(updatedBlueprint);
    setPreviewMode('certificate_dossier');
    setGeneratingDossier(false);
    alert('👑 تم إنشاء وتجميع الوثيقة التفصيلية الشاملة للشهادة المهنية وجميع الكراش كورسات! يمكنك مراجعتها الآن في شاشة المعاينة على اليسار.');
  };

  // ==========================================
  // 🧲 2.3 جديد: جلب وتجميع الكورسات المنشورة مسبقاً في المنصة (5001) في شهادة مهنية واحدة
  // ==========================================
  const handleBundleExistingPlatformCourses = async () => {
    const customCertName = window.prompt(
      'أدخل اسم الشهادة المهنية الكبرى التي تريد جمع الكراش كورسات المنشورة تحتها:',
      blueprint?.courseTitle || topic || 'الشهادة المهنية الشاملة في تطوير البرمجيات المتكامل والذكاء الاصطناعي'
    );
    if (!customCertName) return;

    setBundlingExisting(true);
    try {
      const res = await axios.get('http://localhost:5001/api/courses/public');
      if (!res.data?.success || !res.data.courses?.length) {
        alert('لم يتم العثور على كورسات منشورة في سيرفر المنصة (5001).');
        setBundlingExisting(false);
        return;
      }

      const platformCourses = res.data.courses;
      const confirmBundle = window.confirm(
        `تم العثور على (${platformCourses.length}) كراش كورس في منصتك.\nهل تريد تجميعها وترتيبها وإنشاء شرح تفصيلي للشهادة المهنية ولجميع هذه الكورسات وربطها معاً؟`
      );
      if (!confirmBundle) {
        setBundlingExisting(false);
        return;
      }

      // تحويل الكورسات المنشورة إلى هيكل الشهادة المهنية الموحدة
      const convertedCourses = platformCourses.map((pc, idx) => {
        const cleanDesc = (pc.description || '').replace(/\|\s*🏆\s*يمنح:.*$/, '').trim();
        return {
          _id: pc._id,
          courseOrder: idx + 1,
          coursePrefix: `الكراش كورس ${idx + 1}`,
          courseTitle: pc.title.replace(/^(الكراش كورس|الكورس)\s*\d+\s*:\s*/i, ''),
          courseDescription: cleanDesc,
          description: cleanDesc,
          estimatedHours: '15 ساعة',
          certificateBadge: `شهادة إتقان ${pc.title}`,
          connectionToPrevious: idx === 0 ? 'نقطة الانطلاق التأسيسية من الصفر المطلق' : `يبني مباشرة على ما تعلمته في الكورس ${idx}`,
          githubProject: {
            projectTitle: `مشروع تطبيقي شامل: ${pc.title}`,
            projectSummary: 'بناء المشروع خطوة بخطوة بمساعدة AI Agent ورفعه على GitHub'
          },
          skills: pc.certificateMeta?.skills || ['Software Engineering', 'AI Agents', 'GitHub Portfolio', 'Practical Coding'],
          isBlueprintReady: true,
          isForgedComplete: true,
          sections: []
        };
      });

      const newBundledCert = {
        isCertificateSeries: true,
        courseTitle: customCertName,
        certificateTitle: customCertName,
        courseDescription: `برنامج شهادة مهنية متكامل يضم (${convertedCourses.length}) كراش كورسات متدرجة من الصفر المطلق بأسلوب التبسيط (ELI5) وحتى الاحتراف وبناء المشاريع الحقيقية بمساعدة وكلاء الذكاء الاصطناعي.`,
        mainAnalogy: 'رحلة بناء مدينة رقمية ذكية متكاملة؛ يبدأ الطالب بتشييد المباني الأساسية ثم يربطها بشبكات الطاقة والبيانات والذكاء الاصطناعي.',
        superCertificate: {
          title: `الشهادة المهنية الخارقة المعتمدة: ${customCertName}`,
          badgeText: 'S-Rank Master Professional Certificate',
          careerOutcomes: ['Full-Stack Developer', 'AI Solutions Engineer', 'Freelance Specialist']
        },
        courses: convertedCourses
      };

      setTopic(customCertName);
      setBlueprint(newBundledCert);
      setPreviewMode('certificate_dossier');
      alert(`🎉 تم استيراد وتجميع (${convertedCourses.length}) كراش كورس داخل الشهادة المهنية! اضغط الآن على زر "👑 تأليف الوثيقة التفصيلية للشهادة" لتوليد الشرح الكامل.`);
    } catch (err) {
      console.error(err);
      alert('❌ تعذر الاتصال بسيرفر المنصة (5001) لجلب الكورسات.');
    } finally {
      setBundlingExisting(false);
    }
  };

  // ==========================================
  // 🗺️ 2.5 هندسة وحدات كراش كورس واحد
  // ==========================================
  const handleGenerateSingleCrashBlueprint = async (cIdx, currentBlueprintState = blueprint) => {
    const targetCert = currentBlueprintState || blueprint;
    if (!targetCert || !targetCert.courses) return null;

    const targetCourse = targetCert.courses[cIdx];
    const prevCourse = cIdx > 0 ? targetCert.courses[cIdx - 1] : null;
    const nextCourse = cIdx < targetCert.courses.length - 1 ? targetCert.courses[cIdx + 1] : null;

    setActiveCourseIndex(cIdx);
    setForgingStatus('generating_sub_blueprint');

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/blueprint-crash-course', {
        certificateTitle: targetCert.courseTitle || targetCert.certificateTitle,
        mainAnalogy: targetCert.mainAnalogy,
        courseOrder: cIdx + 1,
        totalCourses: targetCert.courses.length,
        currentCourseTitle: targetCourse.courseTitle,
        currentCourseDescription: targetCourse.courseDescription || targetCourse.description,
        githubProject: targetCourse.githubProject,
        previousCourseTitle: prevCourse ? prevCourse.courseTitle : null,
        nextCourseTitle: nextCourse ? nextCourse.courseTitle : null
      });

      if (res.data.success) {
        const updated = JSON.parse(JSON.stringify(targetCert));
        updated.courses[cIdx].sections = res.data.data.blueprint || [];
        updated.courses[cIdx].isBlueprintReady = true;
        updated.courses[cIdx].isForgedComplete = false;
        setBlueprint(updated);
        setForgingStatus('idle');
        setActiveCourseIndex(null);
        return updated;
      }
      alert(`تعذر إنشاء وحدات الكورس رقم ${cIdx + 1}. حاول مرة أخرى.`);
      setForgingStatus('idle');
      setActiveCourseIndex(null);
      return null;
    } catch (err) {
      console.error(err);
      alert(`حدث خطأ أثناء هندسة وحدات الكورس رقم ${cIdx + 1}`);
      setForgingStatus('idle');
      setActiveCourseIndex(null);
      return null;
    }
  };

  // ==========================================
  // 🛡️ 3. مسار الإصلاح (إعادة التأليف من الصفر للكراش كورس)
  // ==========================================
  const handleResetAndReforgeCrashCourse = async (cIdx) => {
    const confirmReset = window.confirm("⚠️ هل أنت متأكد من إعادة بناء وتأليف هذا الكورس من الصفر؟\n(سيتم مسح أي محتوى تالف أو غير مكتمل وبدء تأليفه من جديد لإصلاح الخلل).");
    if (!confirmReset) return;

    const freshBlueprintState = await handleGenerateSingleCrashBlueprint(cIdx);
    if (!freshBlueprintState) {
      alert("❌ فشل في إعادة بناء هيكل الكورس النظيف. يرجى المحاولة مرة أخرى.");
      return;
    }

    await handleForgeCrashCourseLessons(cIdx, freshBlueprintState);
  };

  // ==========================================
  // ✍️ 4. تأليف الدروس (كراش كورس ضمن شهادة)
  // ==========================================
  const handleForgeCrashCourseLessons = async (cIdx, customBlueprintState = null) => {
    const currentState = customBlueprintState || blueprint;
    if (!currentState) return null;

    const targetCourse = currentState.courses[cIdx];
    if (!targetCourse.sections || targetCourse.sections.length === 0) {
      alert('يرجى هندسة وحدات هذا الكراش كورس أولاً!');
      return null;
    }

    let totalSteps = 0;
    targetCourse.sections.forEach(sec => {
      totalSteps += sec.lessons.length;
      totalSteps += Math.floor(sec.lessons.length / 2); 
      totalSteps += 1; 
    });

    setActiveCourseIndex(cIdx);
    setForgingStatus('forging');
    let completedCount = 0;
    let updatedCert = JSON.parse(JSON.stringify(currentState));

    const contextualCourseTopic = `${targetCourse.courseTitle} (الكورس ${cIdx + 1} من شهادة: ${updatedCert.courseTitle || updatedCert.certificateTitle} | التشبيه القصصي: ${updatedCert.mainAnalogy || 'تبسيط مطلق'} | الربط السابق: ${targetCourse.connectionToPrevious || 'بداية المسار'})`;

    for (let sIdx = 0; sIdx < updatedCert.courses[cIdx].sections.length; sIdx++) {
      const section = updatedCert.courses[cIdx].sections[sIdx];
      let newLessonsArray = [];
      let lessonsSinceLastBoss = 0;

      for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
        const lesson = section.lessons[lIdx];
        setForgeProgress({ 
          current: completedCount, 
          total: totalSteps, 
          currentLessonName: `[كورس ${cIdx + 1} - وحدة ${sIdx + 1}] ${lesson.title}` 
        });

        try {
          const res = await axios.post('http://localhost:5000/api/academy2/forge-lesson', {
            courseTopic: contextualCourseTopic,
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            lessonCategory: lesson.lessonCategory || 'code',
            isProjectUnit: section.isProjectUnit || false,
            difficulty: 'crash_eli5'
          });

          if (res.data.success) {
            newLessonsArray.push({
              ...lesson,
              type: "video",
              content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet || "",
              codeExplanation: res.data.data.codeExplanation || "",
              codingPractice: res.data.data.codingPractice || null, 
              dailyQuest: res.data.data.dailyQuest 
                ? { ...res.data.data.dailyQuest, isMandatory: false, bonusExp: 50 } 
                : null,
              isForged: true
            });
            lessonsSinceLastBoss++;
            completedCount++;
            setForgeProgress({ 
              current: completedCount, 
              total: totalSteps, 
              currentLessonName: `[كورس ${cIdx + 1}] ${lesson.title}` 
            });
          }

          if (lessonsSinceLastBoss === 2) {
            const prevLesson1 = newLessonsArray[newLessonsArray.length - 2];
            const prevLesson2 = newLessonsArray[newLessonsArray.length - 1];

            const hasCode = (prevLesson1.codeSnippet && prevLesson1.codeSnippet.length > 10) || 
                            (prevLesson2.codeSnippet && prevLesson2.codeSnippet.length > 10) ||
                            prevLesson1.codingPractice?.hasPractice ||
                            prevLesson2.codingPractice?.hasPractice;

            const gateType = hasCode ? "البوابة الحمراء (Red Gate)" : "بوابة الزعيم (Boss Dungeon)";
            const apiUrl = hasCode ? 'http://localhost:5000/api/academy2/forge-red-gate' : 'http://localhost:5000/api/academy2/forge-boss';

            setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: `[كورس ${cIdx + 1}] تجهيز ${gateType}...` });

            try {
              const bossRes = await axios.post(apiUrl, {
                courseTopic: contextualCourseTopic,
                lesson1Content: prevLesson1.content,
                lesson2Content: prevLesson2.content
              });

              if (bossRes.data.success) {
                const bossQuestions = bossRes.data.data.bossQuiz || [];
                newLessonsArray.push({
                  title: gateType,
                  description: hasCode ? "بوابة حمراء مليئة بتحديات الأكواد الدامية. كسر البوابة يتطلب نسبة 70%." : "اختبار شامل لكسر البوابة. يتطلب نسبة نجاح 70% للمرور.",
                  type: hasCode ? "red_gate" : "boss_quiz",
                  content: "", codeSnippet: "", bossQuiz: bossQuestions, isForged: true
                });
                lessonsSinceLastBoss = 0;
                completedCount++;
                setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: "تم كسر البوابة!" });
              }
            } catch (bossErr) { console.error("خطأ في توليد الزعيم"); }
          }
        } catch (error) { console.error(`خطأ في تأليف درس: ${lesson.title}`); }
      }

      setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: `[كورس ${cIdx + 1}] تجهيز الاختبار النهائي للوحدة ${sIdx + 1}...` });

      try {
        const unitLessonsTitles = section.lessons.map(l => l.title).join('، ');
        const unitExamRes = await axios.post('http://localhost:5000/api/academy2/forge-unit-exam', {
          courseTopic: contextualCourseTopic,
          sectionName: section.sectionName,
          unitLessonsSummary: unitLessonsTitles
        });

        if (unitExamRes.data.success) {
          newLessonsArray.push({
            title: unitExamRes.data.data.examTitle || `🏆 الاختبار النهائي: ${section.sectionName}`,
            description: "اختبار نهائي مختلط (نظري + كودي + تحدي كتابة كود) لاجتياز هذه الوحدة بالكامل.",
            type: "unit_exam", content: "", codeSnippet: "",
            bossQuiz: unitExamRes.data.data.bossQuiz || [],
            codingPractice: unitExamRes.data.data.unitCodingChallenge || null,
            isForged: true
          });
          completedCount++;
        }
      } catch (examErr) { console.error("خطأ في توليد اختبار نهاية الوحدة"); }

      updatedCert.courses[cIdx].sections[sIdx].lessons = newLessonsArray;
      setBlueprint({ ...updatedCert });
    }

    updatedCert.courses[cIdx].isForgedComplete = true;
    setBlueprint({ ...updatedCert });
    setForgingStatus('complete');
    setActiveCourseIndex(null);
    return updatedCert;
  };

  // الطيار الآلي
  const handleAutoPilotAllCourses = async () => {
    if (!blueprint || !blueprint.courses) return;
    const confirmAuto = window.confirm(`سيقوم النظام بهندسة وتأليف دروس جميع الكورسات (${blueprint.courses.length} كراش كورس). هل تريد الانطلاق؟`);
    if (!confirmAuto) return;

    setAutoPilotRunning(true);
    let workingState = JSON.parse(JSON.stringify(blueprint));

    try {
      for (let i = 0; i < workingState.courses.length; i++) {
        if (!workingState.courses[i].isBlueprintReady) {
          const afterBlueprint = await handleGenerateSingleCrashBlueprint(i, workingState);
          if (!afterBlueprint) throw new Error(`تعذر إنشاء وحدات الكورس رقم ${i + 1}`);
          workingState = afterBlueprint;
        }
        if (!workingState.courses[i].isForgedComplete) {
          const afterForge = await handleForgeCrashCourseLessons(i, workingState);
          if (!afterForge || !afterForge.courses[i].isForgedComplete) throw new Error(`تعذر تأليف الكورس رقم ${i + 1}`);
          workingState = afterForge;
        }
      }
      alert('🎉 اكتمل بناء وتأليف جميع الكراش كورسات في الشهادة المهنية بنجاح!');
    } catch (error) {
      alert(`توقف الطيار الآلي: ${error.message}`);
    } finally {
      setAutoPilotRunning(false);
    }
  };

  // تأليف الكورس المنفرد
  const handleForgeAllLessons = async () => {
    if (!blueprint || !blueprint.blueprint) return;
    
    let totalSteps = 0;
    blueprint.blueprint.forEach(sec => {
      totalSteps += sec.lessons.length;
      totalSteps += Math.floor(sec.lessons.length / 2);
      totalSteps += 1; 
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
        setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: lesson.title });

        try {
          const res = await axios.post('http://localhost:5000/api/academy2/forge-lesson', {
            courseTopic: updatedBlueprint.courseTitle,
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            isProjectUnit: section.isProjectUnit || false,
            difficulty: difficulty
          });

          if (res.data.success) {
            newLessonsArray.push({
              ...lesson, type: "video", content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet || "", codeExplanation: res.data.data.codeExplanation || "",
              codingPractice: res.data.data.codingPractice || null,
              dailyQuest: res.data.data.dailyQuest ? { ...res.data.data.dailyQuest, isMandatory: false, bonusExp: 50 } : null,
              isForged: true
            });
            lessonsSinceLastBoss++;
            completedCount++;
            setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: lesson.title });
          }

          if (lessonsSinceLastBoss === 2) {
             const prevLesson1 = newLessonsArray[newLessonsArray.length - 2];
             const prevLesson2 = newLessonsArray[newLessonsArray.length - 1];
             const hasCode = (prevLesson1.codeSnippet && prevLesson1.codeSnippet.length > 10) || 
                             (prevLesson2.codeSnippet && prevLesson2.codeSnippet.length > 10) ||
                             prevLesson1.codingPractice?.hasPractice || prevLesson2.codingPractice?.hasPractice;
             
             const gateType = hasCode ? "البوابة الحمراء (Red Gate)" : "بوابة الزعيم (Boss Dungeon)";
             const apiUrl = hasCode ? 'http://localhost:5000/api/academy2/forge-red-gate' : 'http://localhost:5000/api/academy2/forge-boss';

             setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: `تجهيز ${gateType}...` });
             
             try {
                const bossRes = await axios.post(apiUrl, {
                  courseTopic: updatedBlueprint.courseTitle, lesson1Content: prevLesson1.content, lesson2Content: prevLesson2.content
                });
                if (bossRes.data.success) {
                  newLessonsArray.push({
                    title: gateType,
                    description: hasCode ? "بوابة حمراء مليئة بتحديات." : "اختبار شامل لكسر البوابة.",
                    type: hasCode ? "red_gate" : "boss_quiz", content: "", codeSnippet: "",
                    bossQuiz: bossRes.data.data.bossQuiz || [], isForged: true
                  });
                  lessonsSinceLastBoss = 0; completedCount++;
                  setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: "تم كسر البوابة!" });
                }
             } catch(bossErr) {}
          }
        } catch (error) {}
      }

      try {
        const unitLessonsTitles = section.lessons.map(l => l.title).join('، ');
        const unitExamRes = await axios.post('http://localhost:5000/api/academy2/forge-unit-exam', {
          courseTopic: updatedBlueprint.courseTitle, sectionName: section.sectionName, unitLessonsSummary: unitLessonsTitles
        });
        if (unitExamRes.data.success) {
          newLessonsArray.push({
            title: unitExamRes.data.data.examTitle || `🏆 الاختبار النهائي: ${section.sectionName}`,
            description: "اختبار نهائي مختلط (نظري + كودي).",
            type: "unit_exam", content: "", codeSnippet: "",
            bossQuiz: unitExamRes.data.data.bossQuiz || [],
            codingPractice: unitExamRes.data.data.unitCodingChallenge || null, isForged: true
          });
          completedCount++;
        }
      } catch (examErr) {}
      
      updatedBlueprint.blueprint[sIdx].lessons = newLessonsArray;
      setBlueprint({...updatedBlueprint});
    }
    
    setForgingStatus('complete');
    alert('🎉 اكتمل تأليف الكورس وبوابات الزعماء واختبارات الوحدات بالكامل!');
  };

  // ==========================================
  // 🚀 5. المزامنة الموحدة (تجميع الكراش كورسات مع الوثيقة التفصيلية للشهادة المهنية)
  // ==========================================
  const handleSyncSingleCrashCourse = async (courseObj, cIdx) => {
    const parentCertTitle = blueprint.courseTitle || blueprint.certificateTitle;
    const confirmSync = window.confirm(`هل تريد رفع "${courseObj.courseTitle}" وربطه بالشهادة المهنية "${parentCertTitle}" في CherifPlatform؟`);
    if (!confirmSync) return;

    setSyncingCourseIdx(cIdx);
    try {
      const detailedCourseInfo = blueprint.masterDossier?.detailedCoursesGuide?.[cIdx];
      const enrichedDescription = `${detailedCourseInfo?.deepExplanation || courseObj.courseDescription || courseObj.description} | 🏆 يمنح: ${courseObj.certificateBadge || 'شهادة إتمام الكراش كورس'} (ضمن ${parentCertTitle})`;

      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: `${courseObj.coursePrefix || `الكورس ${cIdx + 1}`}: ${courseObj.courseTitle}`,
        courseDescription: enrichedDescription,
        difficulty: courseObj.difficultyLevel || 'كراش كورس مبسط (ELI5)',
        certificateMeta: {
          parentCertificateTitle: parentCertTitle,
          parentCertificateDescription: blueprint.masterDossier?.executiveVision || blueprint.courseDescription,
          mainAnalogy: blueprint.mainAnalogy,
          timePlan: blueprint.masterDossier?.timePlan || null,
          careerAndFinancialROI: blueprint.masterDossier?.careerAndFinancialROI || null,
          subCertificateBadge: courseObj.certificateBadge,
          superCertificate: blueprint.superCertificate,
          courseOrder: cIdx + 1,
          totalCoursesInSeries: blueprint.courses?.length || 1,
          skills: courseObj.skills || [],
          githubProject: courseObj.githubProject || null
        },
        blueprint: courseObj.sections
      });
      if (res.data.success) alert(`🎉 تم رفع وربط "${courseObj.courseTitle}" بالشهادة المهنية بنجاح!`);
    } catch (error) { alert('❌ حدث خطأ في المزامنة.'); } finally { setSyncingCourseIdx(null); }
  };

  const handleSyncEntireCertificate = async () => {
    if (!blueprint || !blueprint.courses) return;
    const parentCertTitle = blueprint.courseTitle || blueprint.certificateTitle;
    const forgedCourses = blueprint.courses.filter(c => c.isForgedComplete && c.sections?.length > 0);
    if (forgedCourses.length === 0) return alert('يرجى تأليف كراش كورس واحد على الأقل قبل المزامنة!');

    const confirmSync = window.confirm(
      `سيتم تجميع ورفع (${forgedCourses.length}) كراش كورسات وربطها معاً تحت مظلة الشهادة المهنية:\n"${parentCertTitle}"\nمع كامل الشرح التفصيلي للشهادة والكورسات. هل أنت متأكد؟`
    );
    if (!confirmSync) return;

    setSyncing(true);
    try {
      for (let i = 0; i < blueprint.courses.length; i++) {
        const courseObj = blueprint.courses[i];
        if (!courseObj.isForgedComplete) continue;

        const detailedCourseInfo = blueprint.masterDossier?.detailedCoursesGuide?.[i];
        const enrichedDescription = `${detailedCourseInfo?.deepExplanation || courseObj.courseDescription || courseObj.description} | 🏆 يمنح: ${courseObj.certificateBadge || `شهادة إتمام الكورس ${i + 1}`} (ضمن ${parentCertTitle})`;

        await axios.post('http://localhost:5001/api/courses/auto-import', {
          courseTitle: `${courseObj.coursePrefix || `الكورس ${i + 1}`}: ${courseObj.courseTitle}`,
          courseDescription: enrichedDescription,
          difficulty: courseObj.difficultyLevel || 'كراش كورس مبسط (ELI5)',
          certificateMeta: {
            parentCertificateTitle: parentCertTitle,
            parentCertificateDescription: blueprint.masterDossier?.executiveVision || blueprint.courseDescription,
            mainAnalogy: blueprint.mainAnalogy,
            timePlan: blueprint.masterDossier?.timePlan || null,
            careerAndFinancialROI: blueprint.masterDossier?.careerAndFinancialROI || null,
            subCertificateBadge: courseObj.certificateBadge,
            superCertificate: blueprint.superCertificate,
            courseOrder: i + 1,
            totalCoursesInSeries: blueprint.courses.length,
            skills: courseObj.skills || [],
            githubProject: courseObj.githubProject || null
          },
          blueprint: courseObj.sections
        });
      }
      alert(`🎉 تم تجميع ورفع جميع الكراش كورسات (${forgedCourses.length}) وربطها بالشهادة المهنية "${parentCertTitle}" بنجاح في CherifPlatform!`);
    } catch (err) { alert('❌ حدث خطأ أثناء المزامنة الجماعية.'); } finally { setSyncing(false); }
  };

  const handleSyncToPlatform = async () => {
    if (!blueprint || forgingStatus !== 'complete') return;
    const confirmSync = window.confirm('هل أنت متأكد من الرفع إلى قاعدة بيانات منصتك؟');
    if (!confirmSync) return;

    setSyncing(true);
    try {
      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: blueprint.courseTitle, courseDescription: blueprint.courseDescription,
        difficulty: difficulty, blueprint: blueprint.blueprint
      });
      if (res.data.success) alert('🎉 تم إطلاق الكورس بنجاح!');
    } catch (error) { alert('❌ حدث خطأ في المزامنة.'); } finally { setSyncing(false); }
  };

  const handleDownloadJSON = (customData = null, customPrefix = 'CourseExport_V2') => {
    const targetData = customData || blueprint;
    if (!targetData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(targetData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const rawTitle = targetData.courseTitle || targetData.certificateTitle || 'Certificate';
    downloadAnchorNode.setAttribute("download", `${customPrefix}_${rawTitle.replace(/[^a-zA-Z0-9أ-ي]/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8" dir="rtl">
      
      {/* 🎨 الهيدر مع وحدة المسودات */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-indigo-500" size={40} /> مختبر الأكاديمية <span className="text-indigo-500 bg-indigo-500/10 text-lg px-3 py-1 rounded-lg border border-indigo-500/20">V2 (SUPER ARCHITECT)</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">
            مصنع الشهادات المهنية الخارقة (9-15+ كراش كورس متدرج 👶) + مُجمِّع الشهادات التفصيلي + Auto-Save Shield 🛡️
          </p>
        </div>

        {/* 🛡️ لوحة إدارة المسودات */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
          <div className="flex flex-col text-right ml-4">
            <span className="text-xs font-bold text-slate-500">حالة المسودة المحلية:</span>
            {hasDraft ? (
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                <Clock size={12}/> آخر حفظ: {lastSaved || 'الآن'}
              </span>
            ) : (
              <span className="text-xs font-black text-slate-400">لا توجد مسودات</span>
            )}
          </div>
          
          <button 
            onClick={saveDraft} 
            disabled={!blueprint}
            className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="حفظ مسودة يدوياً"
          >
            <Save size={18} />
          </button>
          
          {hasDraft && !blueprint && (
            <button 
              onClick={loadDraft}
              className="bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-900 p-2.5 rounded-xl transition-all"
              title="استرجاع آخر مسودة"
            >
              <RefreshCw size={18} />
            </button>
          )}

          {hasDraft && (
            <button 
              onClick={clearDraft}
              className="bg-red-500/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white p-2.5 rounded-xl transition-all"
              title="مسح المسودة نهائياً"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================================================== */}
        {/* العمود الأيمن: الهندسة وتجميع الشهادة المهنية */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="text-indigo-500" /> هندسة المنهج والشهادات
            </h2>

            <div className="flex gap-2 mb-3 flex-wrap">
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
            </div>

            <button 
              onClick={() => { generateIdea('coursera'); setDifficulty('pro_certificate_eli5'); }} 
              className="w-full mb-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-800/50 hover:to-indigo-800/50 border border-blue-500/40 text-blue-300 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Award size={18} className="text-amber-400" /> 
              استلهام فكرة "شهادة مهنية خارقة" (9 - 15+ كراش كورس)
            </button>

            {/* 🆕 زر تجميع الكورسات المنشورة مسبقاً في المنصة داخل شهادة مهنية واحدة */}
            <button 
              onClick={handleBundleExistingPlatformCourses}
              disabled={bundlingExisting}
              className="w-full mb-6 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Link2 size={16} className="text-amber-400" />
              {bundlingExisting ? 'جاري جلب وتجميع الكورسات...' : '🧲 جمع الكورسات المنشورة حالياً في المنصة (5001) في شهادة مهنية'}
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">الموضوع المراد تدريسه</label>
                <input type="text" placeholder="مثال: الشهادة المهنية في تطوير الويب الشامل MERN Stack" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">مستوى الصعوبة وأسلوب الشرح</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white appearance-none cursor-pointer" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="pro_certificate_eli5">🎓 شهادة مهنية خارقة (9-15+ كراش كورس مترابط - تبسيط كأنك طفل 👶)</option>
                  <option value="crash_eli5">كراش كورس منفرد (تبسيط مطلق - اشرح لي كأني طفل 👶)</option>
                  <option value="مبتدئ تماماً (E-Rank)">مبتدئ تماماً (E-Rank)</option>
                  <option value="متوسط (B-Rank)">متوسط (B-Rank)</option>
                  <option value="خبير متقدم (S-Rank)">خبير متقدم (S-Rank)</option>
                  <option value="معسكر شامل (Bootcamp - شهادات مصغرة)">معسكر شامل (Bootcamp - شهادات مصغرة)</option>
                </select>
              </div>
              
              <button onClick={handleGenerateBlueprint} disabled={loadingBlueprint || forgingStatus === 'forging' || autoPilotRunning} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingBlueprint ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <><Wand2 size={20} /> هندسة خريطة المنهج (V2)</>}
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 🎓 العرض الأول: إذا كان المنهج "شهادة مهنية شاملة" */}
          {/* ============================================================== */}
          {blueprint && blueprint.isCertificateSeries && (
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden">
              
              <div className="bg-gradient-to-r from-indigo-950 via-[#0b1120] to-[#0b1120] p-6 border-b border-slate-800 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                  <Award size={16} /> شهادة مهنية متكاملة ({blueprint.courses?.length} كراش كورسات)
                </div>
                
                <h2 className="text-2xl font-black text-white mb-3 leading-tight">{blueprint.courseTitle || blueprint.certificateTitle}</h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{blueprint.courseDescription}</p>

                {blueprint.superCertificate && (
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mb-4">
                    <p className="text-xs font-black text-amber-400 mb-1 flex items-center gap-1.5">
                      <Trophy size={14}/> الجائزة الكبرى بعد إتمام جميع الكورسات:
                    </p>
                    <p className="text-sm font-bold text-white">{blueprint.superCertificate.title}</p>
                  </div>
                )}

                {blueprint.mainAnalogy && (
                  <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 mb-4">
                    <p className="text-xs font-black text-indigo-400 mb-1 flex items-center gap-1.5">
                      <Sparkles size={14}/> القصة والتشبيه الموحد للشهادة (ELI5 Storyline):
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">{blueprint.mainAnalogy}</p>
                  </div>
                )}

                {/* 🆕 الأزرار الاستراتيجية لتجميع الشهادة وتوليد شرحها التفصيلي */}
                <div className="flex flex-col gap-2.5 mt-4">
                  
                  {/* 👑 الزر الجديد المطلوب: إنشاء وثيقة الشهادة المهنية المفصلة وتجميع الكراش كورسات */}
                  <button 
                    onClick={handleGenerateMasterCertificateDossier}
                    disabled={generatingDossier}
                    className="w-full bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingDossier ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-950"></div>
                    ) : (
                      <Trophy size={17} />
                    )}
                    {generatingDossier 
                      ? 'جاري تأليف الوثيقة التفصيلية وتجميع الكراش كورسات...' 
                      : '👑 إنشاء وتجميع الوثيقة التفصيلية للشهادة المهنية والكورسات'}
                  </button>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleAutoPilotAllCourses} 
                      disabled={autoPilotRunning || forgingStatus === 'forging'}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <BrainCircuit size={16} /> 
                      {autoPilotRunning ? 'الطيار الآلي يعمل...' : '⚡ تأليف جميع الكورسات تلقائياً'}
                    </button>
                    <button 
                      onClick={() => handleDownloadJSON(blueprint, 'Full_Professional_Certificate')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700 flex items-center gap-1.5"
                    >
                      <Download size={15} /> JSON الشهادة
                    </button>
                  </div>

                  <button 
                    onClick={handleSyncEntireCertificate}
                    disabled={syncing}
                    className="w-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Server size={15} /> ربط ومزامنة الشهادة وجميع الكراش كورسات لـ CherifPlatform
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
                {blueprint.courses?.map((course, cIdx) => (
                  <div key={cIdx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
                    
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-indigo-400 font-black text-xs bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        {course.coursePrefix || `Crash Course ${cIdx + 1}`} • {course.estimatedHours || '15 Hours'}
                      </span>
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <Award size={12}/> {course.certificateBadge || `شهادة إتمام الكورس ${cIdx + 1}`}
                      </span>
                    </div>

                    {course.difficultyLevel && (
                      <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded mb-2">
                        📈 {course.difficultyLevel}
                      </span>
                    )}

                    <h4 className="text-lg font-black text-white mb-2">{course.courseTitle}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{course.courseDescription || course.description}</p>

                    {course.connectionToPrevious && (
                      <div className="bg-slate-950/80 border-r-2 border-amber-500 p-2.5 rounded-lg mb-3 text-[11px] text-amber-300/90 flex items-start gap-2">
                        <Link2 size={14} className="shrink-0 mt-0.5 text-amber-400" />
                        <span><strong>الربط مع الكورس السابق:</strong> {course.connectionToPrevious}</span>
                      </div>
                    )}

                    {course.githubProject && (
                      <div className="bg-emerald-950/25 border border-emerald-500/30 p-3 rounded-xl mb-4 text-[11px] text-emerald-300 space-y-1">
                        <div className="font-black flex items-center gap-1.5 text-emerald-400">
                          <GitBranch size={13}/> مشروع الوحدة النهائية (GitHub + AI Agent):
                        </div>
                        <p className="font-bold text-white">{course.githubProject.projectTitle}</p>
                        <p className="text-slate-400">{course.githubProject.projectSummary}</p>
                      </div>
                    )}

                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.skills.map((skill, skIdx) => (
                          <span key={skIdx} className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {!course.isBlueprintReady ? (
                      <button 
                        onClick={() => handleGenerateSingleCrashBlueprint(cIdx)}
                        disabled={forgingStatus !== 'idle'}
                        className="w-full bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        {activeCourseIndex === cIdx && forgingStatus === 'generating_sub_blueprint' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        ) : (
                          <><Layers size={15} /> 1. هندسة وحدات هذا الكراش كورس (5-10+ وحدات + وحدة مشروع GitHub)</>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-4 mt-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-400">
                            📚 وحدات الكراش كورس ({course.sections?.length} وحدات):
                          </span>
                          
                          <button 
                            onClick={() => handleResetAndReforgeCrashCourse(cIdx)}
                            disabled={forgingStatus === 'forging' || forgingStatus === 'generating_sub_blueprint'}
                            className="text-[10px] bg-red-900/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 px-2 py-1 rounded flex items-center gap-1 transition-all disabled:opacity-50"
                          >
                            <RefreshCw size={12} className={activeCourseIndex === cIdx && forgingStatus !== 'idle' ? "animate-spin" : ""} /> 
                            إعادة التأليف (إصلاح الخلل)
                          </button>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                          {course.sections?.map((sec, sIdx) => (
                            <div key={sIdx} className={`border rounded-xl p-3 ${sec.isProjectUnit ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950 border-slate-800/90'}`}>
                              <h5 className={`font-bold text-xs mb-2 flex items-center gap-1.5 ${sec.isProjectUnit ? 'text-emerald-400' : 'text-indigo-300'}`}>
                                {sec.isProjectUnit ? <Bot size={15} /> : <ChevronLeft size={14} />} 
                                {sec.sectionName}
                              </h5>
                              <div className="space-y-1.5">
                                {sec.lessons?.map((lesson, lIdx) => (
                                  <div 
                                    key={lIdx} 
                                    onClick={() => {
                                      if (lesson.isForged) {
                                        setSelectedLesson(lesson);
                                        setPreviewMode('lesson');
                                      }
                                    }}
                                    className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-colors ${
                                      lesson.isForged 
                                        ? (lesson.type === 'red_gate' ? 'bg-red-950/30 border-red-500/40 text-red-300 cursor-pointer hover:bg-red-900/40' 
                                            : lesson.type === 'boss_quiz' ? 'bg-purple-950/30 border-purple-500/40 text-purple-300 cursor-pointer hover:bg-purple-900/40'
                                            : lesson.type === 'unit_exam' ? 'bg-amber-950/30 border-amber-500/40 text-amber-300 cursor-pointer hover:bg-amber-900/40'
                                            : 'bg-emerald-900/15 border-emerald-500/30 text-white cursor-pointer hover:bg-emerald-900/30') 
                                        : 'bg-slate-900 border-slate-800 text-slate-500'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {lesson.type === 'unit_exam' ? (
                                        <Trophy size={12} className="text-amber-400 shrink-0" />
                                      ) : lesson.type === 'red_gate' ? (
                                        <Flame size={12} className="text-red-400 shrink-0" />
                                      ) : (
                                        <Play size={12} className={lesson.isForged ? 'text-emerald-400 shrink-0' : 'text-slate-600 shrink-0'} />
                                      )}
                                      <span className="truncate">{lesson.title}</span>
                                    </div>
                                    {lesson.isForged && <CheckCircle size={12} className="text-emerald-400 shrink-0" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {!course.isForgedComplete ? (
                          <button 
                            onClick={() => handleForgeCrashCourseLessons(cIdx)}
                            disabled={forgingStatus === 'forging'}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <BrainCircuit size={16} /> 2. تأليف الدروس + التمارين الكودية + اختبارات الوحدات (ELI5 👶)
                          </button>
                        ) : (
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => handleDownloadJSON(course, `CrashCourse_${cIdx + 1}`)}
                              className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5"
                            >
                              <Download size={14} /> JSON الكورس
                            </button>
                            <button 
                              onClick={() => handleSyncSingleCrashCourse(course, cIdx)}
                              disabled={syncingCourseIdx === cIdx}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
                            >
                              {syncingCourseIdx === cIdx ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                              ) : (
                                <><Server size={14} /> رفع وربط بالشهادة</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 📘 العرض الثاني: إذا كان المنهج كورساً منفرداً عادياً */}
          {/* ============================================================== */}
          {blueprint && !blueprint.isCertificateSeries && blueprint.blueprint && (
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-950 via-[#0b1120] to-[#0b1120] p-8 border-b border-slate-800 relative">
                <h2 className="text-2xl font-black text-white mb-3 leading-tight">{blueprint.courseTitle}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{blueprint.courseDescription}</p>
              </div>
              
              <div className="p-6 space-y-6">
                {blueprint.blueprint.map((section, sIdx) => (
                  <div key={sIdx} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
                    <span className="text-indigo-400 font-bold text-xs mb-1 block">
                      {section.coursePrefix || `الوحدة ${sIdx + 1}`} • {section.estimatedHours || '10 hours'}
                    </span>
                    <h4 className="text-lg font-black text-white mb-4">{section.sectionName}</h4>

                    <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} onClick={() => { if (lesson.isForged) { setSelectedLesson(lesson); setPreviewMode('lesson'); } }} className={`p-3.5 border-b border-slate-800/50 last:border-0 flex items-center justify-between transition-colors ${lesson.isForged ? 'hover:bg-indigo-950/30 cursor-pointer' : 'opacity-70'}`}>
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

              {forgingStatus === 'idle' && (
                <div className="p-6 border-t border-slate-800 bg-slate-900/30">
                  <button onClick={handleForgeAllLessons} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base py-4 rounded-xl transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3">
                    <BrainCircuit size={22} /> تأليف محتوى جميع الدروس
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* العمود الأيسر: شاشة المعاينة المزدوجة (معاينة الدرس + وثيقة الشهادة المهنية المفصلة) */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {forgingStatus !== 'idle' && forgingStatus !== 'generating_sub_blueprint' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {forgingStatus === 'forging' ? <div className="animate-pulse w-3 h-3 bg-purple-500 rounded-full"></div> : <CheckCircle className="text-emerald-500" />}
                {forgingStatus === 'forging' ? 'الذكاء الاصطناعي يقوم بالتأليف الآن (دروس + تمارين كودية + اختبارات وحدات)...' : 'تم اكتمال التأليف بنجاح'}
              </h3>
              
              <div className="w-full bg-slate-950 rounded-full h-4 mb-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${forgeProgress.total > 0 ? (forgeProgress.current / forgeProgress.total) * 100 : 0}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span className="truncate w-3/4">{forgingStatus === 'forging' ? `جاري تأليف: ${forgeProgress.currentLessonName}` : 'جميع الدروس جاهزة!'}</span>
                <span>{forgeProgress.current} / {forgeProgress.total}</span>
              </div>
            </div>
          )}

          {/* نافذة المعاينة ذات التبويبين */}
          <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col max-h-[820px]">
            
            {/* أزرار التبديل بين معاينة الدرس ومعاينة وثيقة الشهادة المهنية المفصلة */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4 flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode('lesson')}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    previewMode === 'lesson'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <BookOpen size={15} /> معاينة محتوى الدرس
                </button>
                <button
                  onClick={() => setPreviewMode('certificate_dossier')}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    previewMode === 'certificate_dossier'
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-950 text-amber-400/80 hover:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <Trophy size={15} /> 👑 وثيقة الشهادة المهنية وتفاصيل الكورسات
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 👑 التبويب الأول للمعاينة: الوثيقة التفصيلية للشهادة المهنية والكورسات */}
            {/* ============================================================== */}
            {previewMode === 'certificate_dossier' ? (
              !blueprint?.masterDossier ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 py-16 text-center px-6">
                  <Trophy size={60} className="text-amber-400/40" />
                  <h3 className="text-lg font-black text-white">لم يتم توليد الوثيقة التفصيلية للشهادة المهنية بعد</h3>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    اضغط على الزر الذهبي <strong className="text-amber-400">"👑 إنشاء وتجميع الوثيقة التفصيلية للشهادة المهنية والكورسات"</strong> لتوليد الشرح الكامل للشهادة، الوقت المستغرق، العائد المادي، وتفاصيل كل كراش كورس.
                  </p>
                  {blueprint?.isCertificateSeries && (
                    <button
                      onClick={handleGenerateMasterCertificateDossier}
                      disabled={generatingDossier}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                    >
                      <Sparkles size={15} /> توليد الوثيقة التفصيلية وتجميع الكورسات الآن
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  
                  {/* 1. ترويسة الشهادة المهنية والوقت المستغرق */}
                  <div className="bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-6 space-y-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                      <Trophy size={14} /> الوثيقة الرسمية المجمعة للشهادة المهنية
                    </span>
                    <h1 className="text-2xl font-black text-white leading-snug">
                      {blueprint.masterDossier.certificateTitle}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {blueprint.masterDossier.executiveVision}
                    </p>

                    {/* إحصائيات الوقت والجهد */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">إجمالي الساعات</span>
                        <span className="text-sm font-black text-emerald-400">{blueprint.masterDossier.timePlan?.totalHours}</span>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">المدة المعتادة</span>
                        <span className="text-sm font-black text-white">{blueprint.masterDossier.timePlan?.durationStandard}</span>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">إجمالي الكراش كورسات</span>
                        <span className="text-sm font-black text-amber-400">{blueprint.courses?.length} كراش كورس</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. العائد المادي والوظيفي (ماذا يفعل الطالب بهذه الشهادة؟) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                      <DollarSign size={18} /> ماذا يمكن للطالب أن يفعل بهذه الشهادة المهنية؟ (العائد المادي والمهني)
                    </h3>

                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">🏢 المسميات الوظيفية المؤهل لها:</p>
                      <div className="flex flex-wrap gap-2">
                        {blueprint.masterDossier.careerAndFinancialROI?.jobRoles?.map((role, rIdx) => (
                          <span key={rIdx} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-lg">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">💰 خدمات العمل الحر ومشاريع الـ SaaS القابلة للبيع:</p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {blueprint.masterDossier.careerAndFinancialROI?.freelanceServices?.map((srv, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{srv}</span>
                          </li>
                        ))}
                        {blueprint.masterDossier.careerAndFinancialROI?.saasOpportunities?.map((saas, sIdx) => (
                          <li key={`saas-${sIdx}`} className="flex items-start gap-2">
                            <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                            <span>{saas}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3. التشريح التفصيلي لكل كراش كورس داخل الشهادة */}
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Layers size={18} className="text-indigo-400" /> الشرح التفصيلي للكراش كورسات المشمولة ({blueprint.masterDossier.detailedCoursesGuide?.length} كورس):
                    </h3>

                    {blueprint.masterDossier.detailedCoursesGuide?.map((cg, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">
                            الكراش كورس {cg.courseOrder}: {cg.courseTitle}
                          </span>
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <Award size={14} /> {cg.certificateBadge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {cg.deepExplanation}
                        </p>

                        {/* ماذا يدرس الطالب في هذا الكورس بالتفصيل */}
                        {cg.keyTakeaways && cg.keyTakeaways.length > 0 && (
                          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                            <p className="text-[11px] font-bold text-indigo-300 mb-1.5">📚 الوحدات والمحاور التي يدرسها الطالب في هذا الكورس:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {cg.keyTakeaways.map((kt, kIdx) => (
                                <div key={kIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                  <span className="truncate">{kt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* مشروع التخرج ودور الـ AI Agent */}
                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
                          <GitBranch size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>مشروع GitHub & AI Agent:</strong> {cg.projectAndAiRole}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )
            ) : (
              /* ============================================================== */
              /* 📖 التبويب الثاني للمعاينة: معاينة الدرس الفردي */
              /* ============================================================== */
              !selectedLesson ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
                  <BookOpen size={64} className="opacity-20" />
                  <p className="font-bold">اضغط على أي درس أو اختبار وحدة (مكتمل باللون الأخضر) لرؤية محتواه هنا.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h1 className="text-2xl font-black text-white">{selectedLesson.title}</h1>
                    {selectedLesson.type === 'unit_exam' && (
                      <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black px-3 py-1 rounded-full">
                        🏆 اختبار نهاية الوحدة المختلط
                      </span>
                    )}
                  </div>
                  
                  {selectedLesson.content && (
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><FileText size={16}/> الشرح التفصيلي (ELI5 & AI Agent Prompts)</h4>
                      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedLesson.content}
                      </div>
                    </div>
                  )}

                  {selectedLesson.codeSnippet && selectedLesson.codeSnippet.trim() !== '' && (
                    <div className="bg-[#0d1117] border border-slate-800 p-5 rounded-xl">
                      <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2"><Code size={16}/> الكود البرمجي</h4>
                      <pre className="text-emerald-400 text-sm overflow-x-auto" dir="ltr">
                        <code>{selectedLesson.codeSnippet}</code>
                      </pre>

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

                  {selectedLesson.codingPractice && selectedLesson.codingPractice.taskQuestion && (
                    <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl space-y-3">
                      <h4 className="text-indigo-400 font-black flex items-center gap-2">
                        <Code size={18}/> تمرين كتابة الكود التفاعلي للطالب (مع 3 تلميحات)
                      </h4>
                      <p className="text-sm text-white font-bold">{selectedLesson.codingPractice.taskQuestion}</p>
                      {selectedLesson.codingPractice.hints && (
                        <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <p className="text-xs font-bold text-amber-400">💡 التلميحات المتدرجة المولدة للطالب:</p>
                          {selectedLesson.codingPractice.hints.map((h, i) => (
                            <p key={i} className="text-xs text-slate-300">• {h}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedLesson.bossQuiz && selectedLesson.bossQuiz.length > 0 ? (
                    <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl space-y-3">
                      <h4 className="text-red-400 font-bold flex items-center gap-2">
                        <Flame size={16}/> {selectedLesson.type === 'unit_exam' ? 'أسئلة الاختبار النهائي للوحدة (نظري + كودي)' : 'تحدي الزعيم / البوابة الحمراء'}
                      </h4>
                      <p className="text-slate-400 text-xs">يحتوي على {selectedLesson.bossQuiz.length} أسئلة:</p>
                      <div className="space-y-2">
                        {selectedLesson.bossQuiz.map((q, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                            <span className="text-amber-400 font-bold ml-2">[{q.questionType === 'code' ? 'كودي' : 'نظري'}]</span>
                            {q.question}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedLesson.dailyQuest && selectedLesson.dailyQuest.question ? (
                    <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-purple-400 font-bold flex items-center gap-2"><HelpCircle size={16}/> سؤال نهاية الدرس</h4>
                        <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                          اختياري غير إجباري (+50 EXP)
                        </span>
                      </div>
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
              )
            )}
          </div>

          {!blueprint?.isCertificateSeries && forgingStatus === 'complete' && (
            <div className="flex gap-4 animate-fade-in-up">
              <button onClick={() => handleDownloadJSON()} className="flex-1 bg-slate-800 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 text-blue-400 hover:text-white font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg">
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