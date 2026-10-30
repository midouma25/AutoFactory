import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, 
  FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download, 
  Microscope, Award, Flame, Link2, Sparkles, Trophy, GitBranch, Bot, 
  Save, Clock, Trash2, RefreshCw, Briefcase, DollarSign, CheckCircle2, Eye,
  History, FolderClock, BookmarkPlus, Star, Edit3, Upload, Search, Database, X,
  PlusCircle, ArrowUp, ArrowDown, Compass, Target, Terminal, Monitor, Cpu,
  Globe, Volume2, Mic, Headphones, Square
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// ============================================================================
// 🗄️ محرك التخزين العملاق (IndexedDB Engine) لتجاوز حد 5MB الخاص بـ LocalStorage
// ============================================================================
const VAULT_DB_NAME = 'CherifAcademyLab2VaultDB';
const VAULT_STORE_NAME = 'projects_history';
const DRAFT_STORE_NAME = 'active_draft';

const openVaultDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VAULT_DB_NAME, 2);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(VAULT_STORE_NAME)) {
        db.createObjectStore(VAULT_STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(DRAFT_STORE_NAME)) {
        db.createObjectStore(DRAFT_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbSaveProject = async (projectObj) => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readwrite');
    tx.objectStore(VAULT_STORE_NAME).put(projectObj);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const dbGetAllProjects = async () => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readonly');
    const req = tx.objectStore(VAULT_STORE_NAME).getAll();
    req.onsuccess = () => {
      const list = req.result || [];
      list.sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
};

const dbDeleteProject = async (id) => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, 'readwrite');
    tx.objectStore(VAULT_STORE_NAME).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const dbSaveActiveDraft = async (draftObj) => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE_NAME, 'readwrite');
    tx.objectStore(DRAFT_STORE_NAME).put({ id: 'current_workspace_draft', ...draftObj });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const dbGetActiveDraft = async () => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE_NAME, 'readonly');
    const req = tx.objectStore(DRAFT_STORE_NAME).get('current_workspace_draft');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

const dbClearActiveDraft = async () => {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE_NAME, 'readwrite');
    tx.objectStore(DRAFT_STORE_NAME).delete('current_workspace_draft');
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

// ✨ FIX: Phase 1 Deterministic CEFR Course Sorter & Reindexer (يضبط موقع امتحانات المستويات ويوحد courseOrder و courseId)
const computeCoursePedagogicalRank = (c, idx = 0) => {
  const combined = `${c?.difficultyLevel || ''} ${c?.courseTitle || ''}`.toLowerCase();
  const isExam = /exam|goethe|testdaf|delf|dalf|ielts|toefl|jlpt|hsk|topik|dele|امتحان|اختبار/i.test(combined);

  if (/pre-a1|a0\.1|phonics|الأبجدية|الحروف/i.test(combined)) return 10 + idx * 0.01;
  if (/a0\.2|a0\b/i.test(combined)) return 20 + idx * 0.01;
  if (/a1\.1/i.test(combined)) return 30 + idx * 0.01;
  if (/a1\.2/i.test(combined)) return 35 + idx * 0.01;
  if (/(?<!pre-)a1\b/i.test(combined)) return (isExam ? 39 : 32) + idx * 0.01;
  if (/a2\.1/i.test(combined)) return 40 + idx * 0.01;
  if (/a2\.2/i.test(combined)) return 45 + idx * 0.01;
  if (/a2\b/i.test(combined)) return (isExam ? 49 : 42) + idx * 0.01;
  if (/b1\.1/i.test(combined)) return 50 + idx * 0.01;
  if (/b1\.2/i.test(combined)) return 54 + idx * 0.01;
  if (/b1\.5|b1\+/i.test(combined)) return 57 + idx * 0.01;
  if (/b1\b/i.test(combined)) return (isExam ? 59 : 52) + idx * 0.01;
  if (/b2\.1/i.test(combined)) return 60 + idx * 0.01;
  if (/b2\.2/i.test(combined)) return 62 + idx * 0.01;
  if (/b2\.3/i.test(combined)) return 64 + idx * 0.01;
  if (/b2\.4/i.test(combined)) return 66 + idx * 0.01;
  if (/b2\b/i.test(combined)) return (isExam ? 69 : 65) + idx * 0.01; // امتحان B2 قبل C1.1 دائماً
  if (/c1\.1/i.test(combined)) return 70 + idx * 0.01;
  if (/c1\.2/i.test(combined)) return 72 + idx * 0.01;
  if (/c1\.3/i.test(combined)) return 74 + idx * 0.01;
  if (/c1\.4/i.test(combined)) return 76 + idx * 0.01;
  if (/testdaf/i.test(combined) && !/c2/i.test(combined)) return 78 + idx * 0.01;
  if (/c1\b/i.test(combined)) return (isExam ? 79 : 75) + idx * 0.01;
  if (/c2\.1/i.test(combined)) return 80 + idx * 0.01;
  if (/c2/i.test(combined)) return (isExam ? 89 : 84 + idx * 0.1);
  return 100 + idx;
};

const reindexCoursesSequence = (coursesArray) => {
  if (!Array.isArray(coursesArray)) return [];
  const hasCEFRLevels = coursesArray.some(c => /pre-a1|a1|a2|b1|b2|c1|c2/i.test(`${c?.difficultyLevel || ''} ${c?.courseTitle || ''}`));
  const working = hasCEFRLevels
    ? [...coursesArray]
        .map((c, idx) => ({ c, rank: computeCoursePedagogicalRank(c, idx) }))
        .sort((a, b) => a.rank - b.rank)
        .map(item => item.c)
    : [...coursesArray];

  return working.map((c, idx) => {
    const trueOrder = idx + 1;
    let cleanTitle = (c.courseTitle || '')
      .replace(/^(?:كراش كورس إضافي|كراش كورس|المرحلة|الكورس|Course)\s*\d+(?:\.\d+)?\s*[:-]\s*/i, '')
      .replace(/^(?:كراش كورس إضافي|كراش كورس|المرحلة|الكورس|Course)\s*\d+(?:\.\d+)?\s*[:-]\s*/i, '')
      .replace(/TestDaF\s*و\s*Goethe\s*C1\/C2/gi, 'Goethe-Zertifikat C2 & المسار الأكاديمي المتقدم')
      .trim();

    if (!cleanTitle) cleanTitle = c.courseTitle || `المرحلة ${trueOrder}`;

    const hoursMatch = String(c.estimatedHours || '18').match(/\d+/);
    const guidedHours = hoursMatch ? parseInt(hoursMatch[0], 10) : 18;

    return {
      ...c,
      courseId: c.courseId || c._id || `cert_course_${trueOrder}`,
      courseOrder: trueOrder,
      guidedLearningHours: c.guidedLearningHours || guidedHours,
      independentPracticeHours: c.independentPracticeHours || Math.round(guidedHours * 1.5),
      coursePrefix: `الكراش كورس ${trueOrder}`,
      courseTitle: `كراش كورس ${trueOrder}: ${cleanTitle}`
    };
  });
};




// ✨ FIX: Phase 3 Client-Side Lesson & Answer-Key Verifier (يفحص ويصحح التمارين والاختبارات قبل الحفظ في IndexedDB)
const verifyAndNormalizeForgedLesson = (lessonObj) => {
  if (!lessonObj || typeof lessonObj !== 'object') return lessonObj;
  const copy = { ...lessonObj };

  if (typeof copy.content === 'string') {
    copy.content = copy.content
      .replace(/\bIch\s+تر\s*inke\b/g, 'Ich trinke')
      .replace(/\bWo\s+هو\b/g, 'Wo ist')
      .replace(/\bDas\s+هو\b/g, 'Das ist')
      .replace(/\bPfer\s*د\b/g, 'Pferd')
      .replace(
        /\b(mein|meine|meinen|meinem|dein|deine|ein|eine|einen|einem|kein|keine)\s+(?:`?[🔵🔴🟢]`?\s*)?(?:der|die|das|den|dem)\s+([A-ZÄÖÜ][a-zäöüß]+)/gi,
        '$1 $2'
      );
  }

  const healQuiz = (q) => {
    if (!q || !Array.isArray(q.options)) return q;
    const uniqueOpts = [...new Set(q.options.map(o => String(o || '').trim()).filter(Boolean))];
    const idx = Number.isInteger(Number(q.correctAnswerIndex)) && Number(q.correctAnswerIndex) >= 0 && Number(q.correctAnswerIndex) < uniqueOpts.length
      ? Number(q.correctAnswerIndex)
      : 0;
    return {
      ...q,
      options: uniqueOpts,
      correctAnswerIndex: idx,
      correctAnswer: uniqueOpts[idx] || uniqueOpts[0] || ''
    };
  };

  if (copy.dailyQuest) copy.dailyQuest = healQuiz(copy.dailyQuest);
  if (Array.isArray(copy.bossQuiz)) copy.bossQuiz = copy.bossQuiz.map(healQuiz);

  return copy;
};

const buildFallbackUnitSummary = (courseTitle, sec) => {
  const cleanLessons = (sec.lessons || [])
    .filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
    .map(l => l.title);
  const isProj = sec.isProjectUnit || (sec.sectionName || '').includes('مشروع') || (sec.sectionName || '').includes('GitHub');

  if (isProj) {
    return {
      sectionName: sec.sectionName,
      unitSummary: `ورشة تطبيقية شاملة في (${sec.sectionName}) ضمن (${courseTitle}) خطوة بخطوة مع الـ AI.`,
      whatYouLearn: cleanLessons.length > 0
        ? `ستقوم بتطبيق وتنفيذ: ${cleanLessons.slice(0, 5).join('، ')}.`
        : `التطبيق العملي الشامل لمحاور (${sec.sectionName}).`,
      whyItMatters: `تخرج من هذه الوحدة بتطبيق عملي حقيقي يرسخ كل المهارات التي اكتسبتها ويجهزك للاختبارات وسوق العمل.`,
      keyHighlights: cleanLessons.slice(0, 3)
    };
  }

  return {
    sectionName: sec.sectionName,
    unitSummary: `وحدة تأسيسية وتطبيقية مركزة في (${sec.sectionName}) تجمع بين الشرح المبسط والتدريب العملي.`,
    whatYouLearn: cleanLessons.length > 0
      ? `ستتقن وتطبق في هذه الوحدة: ${cleanLessons.slice(0, 5).join('، ')}.`
      : `إتقان الركائز الأساسية والعملية الخاصة بـ (${sec.sectionName}).`,
    whyItMatters: `تمنحك هذه الوحدة الفهم العميق والتدريب المباشر الذي يجعلك تتقن المهارة بثقة كاملة.`,
    keyHighlights: cleanLessons.slice(0, 3)
  };
};

const extractUnitSummariesMapFromSections = (courseTitle, sections = []) => {
  const map = {};
  sections.forEach(sec => {
    if (sec.sectionName) {
      map[sec.sectionName] = sec.unitDeepSummary || buildFallbackUnitSummary(courseTitle, sec);
    }
  });
  return map;
};

const AcademyLab2 = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('pro_certificate_eli5');
  const [targetLanguage, setTargetLanguage] = useState('الإنجليزية (English - IELTS/TOEFL)');
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

  const [previewMode, setPreviewMode] = useState('lesson');
  const [generatingDossier, setGeneratingDossier] = useState(false);
  const [bundlingExisting, setBundlingExisting] = useState(false);

  const [enhancingCert, setEnhancingCert] = useState(false);
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  const [customPlacementMode, setCustomPlacementMode] = useState('auto');
  const [injectingCustom, setInjectingCustom] = useState(false);
  const [aiArchitectReport, setAiArchitectReport] = useState(null);

  const [generatingUnitsSummaryCourseIdx, setGeneratingUnitsSummaryCourseIdx] = useState(null);
  const [generatingAllUnitsSummaries, setGeneratingAllUnitsSummaries] = useState(false);

  // 🔊 حالة مشغل الصوتيات والنطق التفاعلي (Interactive TTS & Shadowing Player)
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [speakingRate, setSpeakingRate] = useState(1.0);

// التحقق الذكي من نوع المسار الحالي (مشروع بدون اختبارات vs لغة أجنبية شهادة أو كورس منفرد)
  const isNoExamProjectMode = 
    difficulty === 'pro_project_scratch_cert' || 
    difficulty === 'single_project_scratch' || 
    Boolean(blueprint?.isProjectScratchSeries);

  const isTopicLanguageRelated = /لغة|لغات|إنجليزي|انجليزي|ياباني|فرنسي|ألماني|الماني|إسباني|اسباني|صيني|كوري|نطق|صوتيات|حروف|محادثة|قواعد|ielts|toefl|jlpt|delf|dalf|goethe|testdaf|dele|hsk|topik|hangul|kanji|a0|a1|a2|b1|b2|c1|c2/i.test(
    `${topic} ${blueprint?.courseTitle || ''} ${blueprint?.certificateTitle || ''}`
  );

  const isLanguageMasteryMode =
    difficulty === 'lang_a0_to_c2_cert' ||
    difficulty === 'lang_exam_prep_cert' ||
    difficulty === 'lang_mega_a0_c2_exam' ||
    Boolean(blueprint?.isLanguageSeries) ||
    (!isNoExamProjectMode && isTopicLanguageRelated);



  // ============================================================================
  // 🔊 دالة تشغيل النطق الصوتي التفاعلي لنصوص الاستماع والمحادثات (Web Speech Synthesis)
  // ============================================================================
  const handlePlayInteractiveAudio = (rawScriptText, rate = 1.0) => {
    if (!('speechSynthesis' in window)) {
      return alert('متصفحك لا يدعم محرك النطق الصوتي المباشر.');
    }

    window.speechSynthesis.cancel();

    // تنظيف النص من الرموز الصوتية IPA والترجمة العربية لقراءة الجمل الأجنبية بوضوح
    const cleanForeignLines = (rawScriptText || '')
      .split('\n')
      .map(line => line.replace(/🔊.*$/g, '').replace(/\|.*$/g, '').replace(/\[.*?\]/g, '').trim())
      .filter(line => line.length > 2 && !/^[\u0600-\u06FF\s\d.,:!؟-]+$/.test(line))
      .join('. ');

    const textToSpeak = cleanForeignLines || rawScriptText;
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;

    // كشف تلقائي للغة المستهدفة (يابانية، فرنسية، ألمانية، إسبانية، صينية، أو إنجليزية افتراضياً)
    const combinedContext = (topic + ' ' + targetLanguage + ' ' + (blueprint?.courseTitle || '') + ' ' + textToSpeak).toLowerCase();
    if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(textToSpeak) || combinedContext.includes('يابان') || combinedContext.includes('jlpt') || combinedContext.includes('japanese')) {
      utterance.lang = 'ja-JP';
    } else if (combinedContext.includes('فرنس') || combinedContext.includes('delf') || combinedContext.includes('dalf') || combinedContext.includes('french')) {
      utterance.lang = 'fr-FR';
    } else if (combinedContext.includes('ألمان') || combinedContext.includes('goethe') || combinedContext.includes('testdaf') || combinedContext.includes('german')) {
      utterance.lang = 'de-DE';
    } else if (combinedContext.includes('إسبان') || combinedContext.includes('dele') || combinedContext.includes('spanish')) {
      utterance.lang = 'es-ES';
    } else if (combinedContext.includes('صين') || combinedContext.includes('hsk') || combinedContext.includes('mandarin')) {
      utterance.lang = 'zh-CN';
    }  else if (/[\uac00-\ud7af\u1100-\u11ff]/.test(textToSpeak) || combinedContext.includes('كوري') || combinedContext.includes('topik') || combinedContext.includes('korean')) {
  utterance.lang = 'ko-KR';
  } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      setIsSpeakingAudio(true);
      setSpeakingRate(rate);
    };
    utterance.onend = () => setIsSpeakingAudio(false);
    utterance.onerror = () => setIsSpeakingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopInteractiveAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAudio(false);
    }
  };

  // ==========================================
  // 🏛️ 0. نظام الحفظ المحلي + سجل المشاريع الشامل (Save & History Vault)
  // ==========================================
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeProjectName, setActiveProjectName] = useState('');
  const [projectHistory, setProjectHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [saveToast, setSaveToast] = useState(null);
  const importFileInputRef = useRef(null);

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const computeProjectStats = (bp) => {
    if (!bp) return { totalCourses: 0, forgedCourses: 0, totalUnits: 0, totalLessons: 0, hasDossier: false, sizeKB: 0 };
    const sizeKB = Math.round((JSON.stringify(bp).length || 0) / 1024);

    if (bp.isCertificateSeries && Array.isArray(bp.courses)) {
      const totalCourses = bp.courses.length;
      const forgedCourses = bp.courses.filter(c => c.isForgedComplete).length;
      let totalUnits = 0;
      let totalLessons = 0;
      bp.courses.forEach(c => {
        totalUnits += c.sections?.length || 0;
        c.sections?.forEach(s => {
          totalLessons += s.lessons?.length || 0;
        });
      });
      return {
        totalCourses,
        forgedCourses,
        totalUnits,
        totalLessons,
        hasDossier: Boolean(bp.masterDossier),
        sizeKB
      };
    } else {
      const sections = bp.blueprint || [];
      const totalUnits = sections.length;
      let totalLessons = 0;
      let forgedLessons = 0;
      sections.forEach(s => {
        totalLessons += s.lessons?.length || 0;
        forgedLessons += s.lessons?.filter(l => l.isForged).length || 0;
      });
      return {
        totalCourses: 1,
        forgedCourses: forgedLessons > 0 && forgedLessons === totalLessons ? 1 : 0,
        totalUnits,
        totalLessons,
        hasDossier: false,
        sizeKB
      };
    }
  };

  const refreshHistoryList = async () => {
    try {
      const list = await dbGetAllProjects();
      setProjectHistory(list);
    } catch (e) {
      console.error("خطأ في جلب سجل المشاريع من IndexedDB", e);
    }
  };

  useEffect(() => {
    const initStorage = async () => {
      await refreshHistoryList();

      try {
        const idbDraft = await dbGetActiveDraft();
        if (idbDraft && idbDraft.blueprint) {
          setHasDraft(true);
          setLastSaved(idbDraft.timestamp || 'محفوظ');
          return;
        }
      } catch (e) {}

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
    };
    initStorage();
  }, []);

  useEffect(() => {
    if (blueprint) {
      saveDraft();
    }
  }, [blueprint]);

  const saveDraft = async () => {
    if (!blueprint) return;
    const timestamp = new Date().toLocaleTimeString('ar-EG');

    const draftData = {
      topic,
      difficulty,
      blueprint,
      activeProjectId,
      activeProjectName,
      timestamp
    };

    try {
      await dbSaveActiveDraft(draftData);
    } catch (idbErr) {
      console.warn("IndexedDB draft save warning:", idbErr);
    }

    try {
      const serializedData = JSON.stringify(draftData);

      if (serializedData.length > 4 * 1024 * 1024) {
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
        } catch (innerErr) {}
      }
      setLastSaved(timestamp + " (خزنة عميقة)");
      setHasDraft(true);
    }
  };

  const loadDraft = async () => {
    try {
      const idbDraft = await dbGetActiveDraft();
      if (idbDraft && idbDraft.blueprint) {
        setTopic(idbDraft.topic || '');
        setDifficulty(idbDraft.difficulty || 'pro_certificate_eli5');
        setBlueprint(idbDraft.blueprint);
        setActiveProjectId(idbDraft.activeProjectId || null);
        setActiveProjectName(idbDraft.activeProjectName || '');
        setLastSaved(idbDraft.timestamp || null);
        triggerToast('✅ تم استرجاع المسودة الكاملة من الخزنة بنجاح!');
        return;
      }
    } catch (e) {}

    const draft = localStorage.getItem('academyLab2_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setTopic(parsedDraft.topic || '');
        setDifficulty(parsedDraft.difficulty || 'pro_certificate_eli5');
        setBlueprint(parsedDraft.blueprint || null);
        setLastSaved(parsedDraft.timestamp || null);
        triggerToast('✅ تم استرجاع مسودة العمل بنجاح!');
      } catch (e) {
        alert('❌ حدث خطأ أثناء قراءة المسودة.');
      }
    }
  };

  const clearDraft = async () => {
    if (window.confirm('⚠️ تحذير: هل أنت متأكد من مسح مساحة العمل الحالية؟ (المشاريع المحفوظة في سجل التاريخ لن تتأثر)')) {
      localStorage.removeItem('academyLab2_draft');
      await dbClearActiveDraft().catch(() => {});
      setHasDraft(false);
      setLastSaved(null);
      setBlueprint(null);
      setTopic('');
      setActiveProjectId(null);
      setActiveProjectName('');
      setAiArchitectReport(null);
    }
  };

  // ==========================================
  // 💾 دوال سجل المشاريع (Save, Snapshot, Load, Rename, Star, Delete, Import)
  // ==========================================
  const handleSaveProjectToHistory = async (saveAsNewSnapshot = false, silentAutoSave = false, customBlueprint = null) => {
    const targetBp = customBlueprint || blueprint;
    if (!targetBp) {
      if (!silentAutoSave) alert('لا يوجد مشروع أو منهج مفتوح حالياً لحفظه في السجل!');
      return;
    }

    const defaultTitle = activeProjectName || targetBp.courseTitle || targetBp.certificateTitle || topic || 'مشروع أكاديمي بدون عنوان';
    let chosenName = defaultTitle;

    const isCreatingNew = saveAsNewSnapshot || !activeProjectId;

    if (!silentAutoSave && isCreatingNew) {
      const promptName = window.prompt(
        saveAsNewSnapshot 
          ? '📸 أدخل اسماً لهذه اللقطة/النسخة الجديدة في سجل المشاريع:' 
          : '💾 أدخل اسماً لحفظ هذا المشروع في سجل المشاريع (History):',
        saveAsNewSnapshot ? `${defaultTitle} (نسخة ${new Date().toLocaleTimeString('ar-EG')})` : defaultTitle
      );
      if (!promptName) return;
      chosenName = promptName.trim();
    }

    const projectId = isCreatingNew ? `proj_${Date.now()}` : activeProjectId;
    const existingItem = projectHistory.find(p => p.id === projectId);
    const nowStr = new Date().toLocaleString('ar-EG');
    const stats = computeProjectStats(targetBp);

    const projectRecord = {
      id: projectId,
      name: chosenName,
      topic: topic || chosenName,
      difficulty,
      isCertificateSeries: Boolean(targetBp.isCertificateSeries),
      isStarred: existingItem ? existingItem.isStarred : false,
      createdAt: existingItem ? existingItem.createdAt : nowStr,
      updatedAt: nowStr,
      updatedAtMs: Date.now(),
      stats,
      blueprint: JSON.parse(JSON.stringify(targetBp))
    };

    try {
      await dbSaveProject(projectRecord);
      setActiveProjectId(projectId);
      setActiveProjectName(chosenName);
      await refreshHistoryList();
      if (!silentAutoSave) {
        triggerToast(isCreatingNew ? `🎉 تم حفظ "${chosenName}" في سجل المشاريع!` : `💾 تم تحديث مشروع "${chosenName}" في السجل!`);
      }
    } catch (err) {
      console.error('Error saving to IndexedDB history:', err);
      alert('❌ حدث خطأ أثناء حفظ المشروع في السجل.');
    }
  };

  const handleLoadProjectFromHistory = (project) => {
    if (blueprint && forgingStatus === 'forging') {
      return alert('⚠️ يرجى انتظار انتهاء عملية التأليف الجارية قبل التبديل إلى مشروع آخر.');
    }

    setTopic(project.topic || project.name);
    setDifficulty(project.difficulty || 'pro_certificate_eli5');
    setBlueprint(project.blueprint);
    setActiveProjectId(project.id);
    setActiveProjectName(project.name);
    setSelectedLesson(null);
    setForgingStatus('idle');
    setActiveCourseIndex(null);
    setAiArchitectReport(null);
    setPreviewMode(project.blueprint?.masterDossier ? 'certificate_dossier' : 'lesson');
    setShowHistoryModal(false);
    triggerToast(`📂 تم فتح المشروع: "${project.name}" بنجاح!`);
  };

  const handleToggleStarProject = async (project, e) => {
    e.stopPropagation();
    const updated = { ...project, isStarred: !project.isStarred };
    await dbSaveProject(updated);
    await refreshHistoryList();
  };

  const handleRenameProjectInHistory = async (project, e) => {
    e.stopPropagation();
    const newName = window.prompt('✏️ أدخل الاسم الجديد للمشروع:', project.name);
    if (!newName || !newName.trim()) return;
    const updated = { ...project, name: newName.trim(), updatedAt: new Date().toLocaleString('ar-EG'), updatedAtMs: Date.now() };
    await dbSaveProject(updated);
    if (activeProjectId === project.id) setActiveProjectName(newName.trim());
    await refreshHistoryList();
    triggerToast('✏️ تم تغيير اسم المشروع بنجاح!');
  };

  const handleDeleteProjectFromHistory = async (project, e) => {
    e.stopPropagation();
    if (!window.confirm(`🗑️ هل أنت متأكد من حذف المشروع "${project.name}" من سجل المشاريع نهائياً؟`)) return;
    await dbDeleteProject(project.id);
    if (activeProjectId === project.id) {
      setActiveProjectId(null);
      setActiveProjectName('');
    }
    await refreshHistoryList();
    triggerToast('🗑️ تم حذف المشروع من السجل.');
  };

  const handleImportJSONToVault = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const importedTitle = parsed.courseTitle || parsed.certificateTitle || file.name.replace('.json', '');
        const resolvedDiff = parsed.isLanguageSeries
          ? 'lang_mega_a0_c2_exam'
          : parsed.isProjectScratchSeries 
            ? 'pro_project_scratch_cert' 
            : (parsed.isCertificateSeries ? 'pro_certificate_eli5' : 'crash_eli5');

        setTopic(importedTitle);
        setDifficulty(resolvedDiff);
        setBlueprint(parsed);
        setSelectedLesson(null);
        setAiArchitectReport(null);
        setPreviewMode(parsed.masterDossier ? 'certificate_dossier' : 'lesson');

        const newId = `proj_${Date.now()}`;
        const nowStr = new Date().toLocaleString('ar-EG');
        const record = {
          id: newId,
          name: importedTitle,
          topic: importedTitle,
          difficulty: resolvedDiff,
          isCertificateSeries: Boolean(parsed.isCertificateSeries),
          isStarred: true,
          createdAt: nowStr,
          updatedAt: nowStr,
          updatedAtMs: Date.now(),
          stats: computeProjectStats(parsed),
          blueprint: parsed
        };

        await dbSaveProject(record);
        setActiveProjectId(newId);
        setActiveProjectName(importedTitle);
        await refreshHistoryList();
        triggerToast(`📥 تم استيراد "${importedTitle}" وحفظه في خزنة المشاريع بنجاح!`);
      } catch (err) {
        alert('❌ ملف JSON غير صالح. تأكد من اختيار ملف كورس أو شهادة صحيح.');
      } finally {
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  // ==========================================
  // 💡 1. محرك الإلهامات الذكي V2 + إلهام المشاريع + إلهام اللغات والاختبارات العالمية
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

  const generateProjectFromScratchIdea = async (projectCategory) => {
    setLoadingIdea(true);
    setDifficulty('pro_project_scratch_cert');
    setTopic('جاري هندسة فكرة مشروع ضخم من الصفر للنهاية... 🏗️');

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/project-cert/suggest-idea', { projectCategory });
      if (res.data?.success && res.data.idea) {
        setTopic(res.data.idea);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      const projectFallbacks = {
        business_saas: 'الشهادة المهنية العملية: بناء منصة تجارة إلكترونية متعددة البائعين (Multi-Vendor E-Commerce SaaS) من الصفر للإطلاق باستخدام MERN Stack وStripe وAI Agent',
        dopamine_app: 'الشهادة المهنية العملية: بناء تطبيق مهام ولياقة بدنية تفاعلي بنظام التلعيب والرؤية الحاسوبية (Solo-Leveling Gamified App) من الصفر باستخدام React وNode.js وMediaPipe',
        desktop_app: 'الشهادة المهنية العملية: بناء نظام نقاط بيع ومخازن احترافي لسطح المكتب (Desktop POS & Inventory ERP) من الصفر باستخدام Electron وReact وSQLite ودعم الطابعات الحرارية',
        ai_model_scratch: 'الشهادة المهنية العملية: بناء وتدريب نموذج ذكاء اصطناعي ووكيل مستقل (Custom AI Model & Autonomous Agent) من الصفر بـ Python وPyTorch وربطه بواجهة ويب متكاملة'
      };
      setTopic(projectFallbacks[projectCategory] || projectFallbacks.business_saas);
    } finally {
      setLoadingIdea(false);
    }
  };

  // 🌍 دالة إلهام شهادات اللغات الأجنبية والاختبارات العالمية (بمنهجية Cambridge × Feynman ELI5)
  const generateLanguageMasteryIdea = async (langCategory) => {
    setLoadingIdea(true);
    if (langCategory === 'exam_prep') {
      setDifficulty('lang_exam_prep_cert');
    } else if (langCategory === 'mega_combined') {
      setDifficulty('lang_mega_a0_c2_exam');
    } else {
      setDifficulty('lang_a0_to_c2_cert');
    }
    setTopic(`جاري هندسة شهادة اللغة (${targetLanguage}) من الحروف حتى الطلاقة... 🌍`);

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-cert/suggest-idea', {
        langCategory,
        targetLanguage
      });
      if (res.data?.success && res.data.idea) {
        setTopic(res.data.idea);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      const langFallbacks = {
        a0_to_c2: `الشهادة المهنية الشاملة لإتقان اللغة ${targetLanguage}: من تعلم الحروف والأصوات (Pre-A1/A0) عبر مواقف الحياة اليومية حتى طلاقة المتحدث الأصلي (C2 Native)`,
        exam_prep: `الشهادة المهنية التكتيكية لاجتياز الاختبار العالمي للغة ${targetLanguage} (IELTS Band 8+ / JLPT / DELF): إتقان الاستماع، القراءة السريعة، الكتابة الأكاديمية، والمحادثة`,
        mega_combined: `الشهادة الإمبراطورية المدمجة للغة ${targetLanguage} (20 كراش كورس): من الحروف والنطق تحت الصفر (Pre-A1) إلى قمة البلاغة (C2 Native) مع المعسكر الكامل لاجتياز الاختبار العالمي`,
        tech_business_lang: `الشهادة المهنية للغة ${targetLanguage} الخاصة بالعمل والشركات العالمية: من التأسيس اللغوي وحتى احتراف التفاوض والاجتماعات والمقابلات التقنية`
      };
      setTopic(langFallbacks[langCategory] || langFallbacks.mega_combined);
    } finally {
      setLoadingIdea(false);
    }
  };

  // ==========================================
  // 📐 2. هندسة الهيكل V2 (يدعم الشهادة العادية + المشاريع بدون اختبارات + شهادات اللغات والاختبارات العالمية)
  // ==========================================
  const handleGenerateBlueprint = async () => {
    if (!topic) return alert('يرجى إدخال أو توليد موضوع الدورة أو المشروع أو اللغة!');
    setLoadingBlueprint(true);
    setSelectedLesson(null);
    setForgingStatus('idle');
    setAiArchitectReport(null);

    try {
      let endpoint = 'http://localhost:5000/api/academy2/blueprint1';
      if (
        difficulty === 'lang_a0_to_c2_cert' ||
        difficulty === 'lang_exam_prep_cert' ||
        difficulty === 'lang_mega_a0_c2_exam'
      ) {
        endpoint = 'http://localhost:5000/api/academy2/lang-cert/blueprint-series';
      } else if (difficulty === 'pro_project_scratch_cert') {
        endpoint = 'http://localhost:5000/api/academy2/project-cert/blueprint-series';
      } else if (difficulty === 'pro_certificate_eli5') {
        endpoint = 'http://localhost:5000/api/academy2/blueprint-certificate';
      }

      // بدلاً من: const res = await axios.post(endpoint, { topic, difficulty });
const res = await axios.post(endpoint, { topic, difficulty, targetLanguage });
      if (res.data.success) {
        const receivedData = res.data.data;
        if (difficulty === 'pro_project_scratch_cert' || difficulty === 'single_project_scratch') {
          receivedData.isProjectScratchSeries = true;
        }
        if (
          difficulty === 'lang_a0_to_c2_cert' ||
          difficulty === 'lang_exam_prep_cert' ||
          difficulty === 'lang_mega_a0_c2_exam'
        ) {
          receivedData.isLanguageSeries = true;
        }
        if (Array.isArray(receivedData.courses)) {
          receivedData.courses = reindexCoursesSequence(receivedData.courses);
        }
        setBlueprint(receivedData);
        setActiveProjectId(null);
        setActiveProjectName(receivedData.courseTitle || receivedData.certificateTitle || topic);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل. تأكد من إضافة المسارات الجديدة في server.js وإعادة تشغيل السيرفر.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ============================================================================
  // 🚀 2.1 زر تحسين عناوين الشهادة المهنية وإضافة الكراش كورسات الناقصة
  // ============================================================================
  const handleEnhanceAndExpandCertificate = async () => {
    if (!blueprint || !blueprint.courses || blueprint.courses.length === 0) {
      return alert('يرجى توليد الشهادة المهنية أولاً!');
    }

    setEnhancingCert(true);
    const certTitle = blueprint.courseTitle || blueprint.certificateTitle || topic;
    const currentCoursesLight = blueprint.courses.map((c, idx) => ({
      originalIndex: idx,
      courseTitle: c.courseTitle,
      description: c.courseDescription || c.description,
      skills: c.skills || []
    }));

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/enhance-certificate-courses', {
        certificateTitle: certTitle,
        mainAnalogy: blueprint.mainAnalogy,
        currentCourses: currentCoursesLight,
        isLanguageSeries: isLanguageMasteryMode
      });

      if (res.data?.success && Array.isArray(res.data.data?.courses)) {
        const aiCourses = res.data.data.courses;

        const mergedCourses = aiCourses.map((aiCourse) => {
          const matchedOld = 
            (typeof aiCourse.originalIndex === 'number' && blueprint.courses[aiCourse.originalIndex]) ||
            blueprint.courses.find(old => old.courseTitle === aiCourse.courseTitle);

          if (matchedOld) {
            return {
              ...matchedOld,
              courseTitle: aiCourse.courseTitle || matchedOld.courseTitle,
              courseDescription: aiCourse.description || aiCourse.courseDescription || matchedOld.courseDescription,
              description: aiCourse.description || aiCourse.courseDescription || matchedOld.description,
              difficultyLevel: aiCourse.difficultyLevel || matchedOld.difficultyLevel,
              certificateBadge: aiCourse.certificateBadge || matchedOld.certificateBadge,
              connectionToPrevious: aiCourse.connectionToPrevious || matchedOld.connectionToPrevious,
              githubProject: aiCourse.githubProject || matchedOld.githubProject,
              skills: aiCourse.skills?.length > 0 ? aiCourse.skills : matchedOld.skills,
              isUpgradedByAI: true
            };
          }

          return {
            ...aiCourse,
            courseDescription: aiCourse.description || aiCourse.courseDescription,
            description: aiCourse.description || aiCourse.courseDescription,
            estimatedHours: aiCourse.estimatedHours || '18 ساعة',
            isBlueprintReady: false,
            isForgedComplete: false,
            isNewlyAdded: true,
            sections: []
          };
        });

        const reindexed = reindexCoursesSequence(mergedCourses);
        const updatedBlueprint = {
          ...blueprint,
          courseTitle: res.data.data.upgradedCertificateTitle || blueprint.courseTitle,
          certificateTitle: res.data.data.upgradedCertificateTitle || blueprint.certificateTitle,
          courses: reindexed
        };

        setBlueprint(updatedBlueprint);
        setAiArchitectReport({
          type: 'expansion',
          summary: res.data.data.architectSummary || `تمت مراجعة الهيكلة وترقية العناوين وإضافة الكراش كورسات الناقصة ليصبح إجمالي المسار (${reindexed.length}) كراش كورس متكامل.`,
          addedCourses: reindexed.filter(c => c.isNewlyAdded).map(c => `${c.coursePrefix}: ${c.courseTitle}`)
        });
        await handleSaveProjectToHistory(false, true, updatedBlueprint);
        triggerToast(`🚀 تمت ترقية الشهادة وإضافة الكورسات الناقصة بنجاح (${reindexed.length} كراش كورس)!`);
        setEnhancingCert(false);
        return;
      }
      throw new Error('Fallback to local intelligent optimizer');
    } catch (err) {
      const existingText = blueprint.courses.map(c => c.courseTitle + ' ' + (c.description || '')).join(' ').toLowerCase();
      const missingCandidates = [];

      if (isLanguageMasteryMode) {
        missingCandidates.push({
          insertRatio: 0.4,
          courseTitle: 'معسكر الصوتيات المتقدم، الربط الصوتي (Connected Speech)، وإتقان النبرة الطبيعية',
          description: 'كراش كورس صوتي مكثف يركز على مخارج الحروف الدقيقة (IPA)، دمج الكلمات في التحدث السريع، والتخلص من التردد أثناء الكلام.',
          difficultyLevel: 'تدريب صوتي ونطقي مكثف',
          estimatedHours: '16 ساعة',
          certificateBadge: 'شهادة إتقان النطق الطبيعي والصوتيات',
          githubProject: {
            projectTitle: 'تسجيل عرض صوتي ومحادثة كاملة بنطق المتحدث الأصلي',
            projectSummary: 'تطبيق تقنيات الترديد (Shadowing) واجتياز تقييم النطق مع الـ AI Voice Examiner'
          },
          skills: ['IPA Phonetics', 'Connected Speech', 'Intonation & Stress', 'Shadowing Technique']
        });
        missingCandidates.push({
          insertRatio: 0.85,
          courseTitle: 'محاكي الاختبار العالمي الكامل (Full Mock Exams: Listening, Reading, Writing & Speaking)',
          description: 'كراش كورس تطبيقي يحاكي بيئة الاختبار الرسمي تحت ضغط الوقت مع تفكيك كل سؤال واستراتيجيات حصد أعلى الدرجات.',
          difficultyLevel: 'المستوى الاحترافي للاختبارات الدولية',
          estimatedHours: '20 ساعة',
          certificateBadge: 'شهادة الجاهزية القصوى للاختبار العالمي',
          githubProject: {
            projectTitle: 'اجتياز 3 اختبارات محاكاة شاملة (Full Mock Tests)',
            projectSummary: 'إتمام اختبارات الاستماع والقراءة والكتابة والمحادثة مع تصحيح تفصيلي بالذكاء الاصطناعي'
          },
          skills: ['Time Management', 'Academic Writing Task 1 & 2', 'Speaking Band 8+ Strategies', 'Active Listening']
        });
      } else {
        if (!existingText.includes('أمان') && !existingText.includes('security') && !existingText.includes('حماية')) {
          missingCandidates.push({
            insertRatio: 0.75,
            courseTitle: 'الأمن السيبراني التطبيقي وحماية الـ APIs والبيانات (بأسلوب قلعة الحصن 🛡️)',
            description: 'كراش كورس حاسم يسد فجوة الأمان؛ تتعلم فيه حماية تطبيقاتك من الثغرات الشائعة (XSS, CSRF, SQL/NoSQL Injection) وتأمين الجلسات والتشفير بأسلوب مبسط.',
            difficultyLevel: 'المستوى المتقدم: حماية وتأمين الأنظمة',
            estimatedHours: '16 ساعة',
            certificateBadge: 'شهادة مهندس أمن التطبيقات وحماية البيانات',
            githubProject: {
              projectTitle: 'نظام جدار حماية وتوثيق متقدم (Security Shield API)',
              projectSummary: 'بناء نظام مصادقة وحماية متكامل بمساعدة AI Agent ورفعه على GitHub'
            },
            skills: ['Cybersecurity Basics', 'API Rate Limiting', 'OWASP Top 10', 'Data Encryption', 'Secure Auth']
          });
        }
      }

      let workingCourses = blueprint.courses.map((c) => ({
        ...c,
        isUpgradedByAI: true
      }));

      const addedNames = [];
      missingCandidates.forEach((cand) => {
        const targetIdx = Math.max(1, Math.min(workingCourses.length - 1, Math.floor(workingCourses.length * cand.insertRatio)));
        const prevCourse = workingCourses[targetIdx - 1];
        const newCourseObj = {
          courseTitle: cand.courseTitle,
          courseDescription: cand.description,
          description: cand.description,
          difficultyLevel: cand.difficultyLevel,
          estimatedHours: cand.estimatedHours,
          certificateBadge: cand.certificateBadge,
          connectionToPrevious: `يسد الفجوة المهارية بعد (${prevCourse?.courseTitle || 'الكورس السابق'}) ليضمن جاهزيتك الكاملة.`,
          githubProject: cand.githubProject,
          skills: cand.skills,
          isBlueprintReady: false,
          isForgedComplete: false,
          isNewlyAdded: true,
          sections: []
        };
        workingCourses.splice(targetIdx, 0, newCourseObj);
        addedNames.push(cand.courseTitle);
      });

      const reindexed = reindexCoursesSequence(workingCourses);
      const updatedBlueprint = {
        ...blueprint,
        courses: reindexed
      };

      setBlueprint(updatedBlueprint);
      setAiArchitectReport({
        type: 'expansion',
        summary: `قام المهندس الذكي بفحص الشهادة المهنية وصقل تسلسلها، وأضاف (${addedNames.length}) كراش كورسات جوهرية في مواقعها المنطقية داخل السلسلة!`,
        addedCourses: addedNames
      });
      await handleSaveProjectToHistory(false, true, updatedBlueprint);
      triggerToast(`✨ تم تحسين الشهادة وإضافة (${addedNames.length}) كراش كورسات ناقصة في أماكنها المناسبة!`);
    } finally {
      setEnhancingCert(false);
    }
  };

  // ============================================================================
  // 🎯 2.15 حقن كراش كورس مخصص من اختيار المستخدم في المكان المناسب تماماً
  // ============================================================================
  const handleInjectCustomCrashCourse = async (e, overrideTopic = null) => {
    if (e) e.preventDefault();
    const targetCustomTopic = (overrideTopic ?? customCourseTitle).trim();

    if (!targetCustomTopic) {
      return alert('يرجى كتابة عنوان أو فكرة الكراش كورس الذي تريد إضافته!');
    }
    if (!blueprint || !blueprint.courses) {
      return alert('يرجى توليد الشهادة المهنية أولاً ثم إضافة الكراش كورس المخصص إليها!');
    }

    setInjectingCustom(true);
    const certTitle = blueprint.courseTitle || blueprint.certificateTitle || topic;
    const currentTitles = blueprint.courses.map((c, idx) => ({
      index: idx,
      title: c.courseTitle,
      description: c.courseDescription || c.description
    }));

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/inject-custom-course', {
        certificateTitle: certTitle,
        mainAnalogy: blueprint.mainAnalogy,
        customTopic: targetCustomTopic,
        placementMode: customPlacementMode,
        currentCourses: currentTitles
      });

      if (res.data?.success && res.data.data?.newCourse) {
        const { newCourse, insertIndex, placementReason } = res.data.data;
        const finalIndex = customPlacementMode === 'auto'
          ? Math.max(0, Math.min(blueprint.courses.length, typeof insertIndex === 'number' ? insertIndex : blueprint.courses.length - 1))
          : parseInt(customPlacementMode, 10);

        const courseToInsert = {
          ...newCourse,
          courseTitle: newCourse.courseTitle || targetCustomTopic,
          courseDescription: newCourse.description || newCourse.courseDescription,
          description: newCourse.description || newCourse.courseDescription,
          estimatedHours: newCourse.estimatedHours || '16 ساعة',
          certificateBadge: newCourse.certificateBadge || `شهادة إتقان ${targetCustomTopic}`,
          isBlueprintReady: false,
          isForgedComplete: false,
          isNewlyAdded: true,
          sections: []
        };

        const updatedCourses = [...blueprint.courses];
        updatedCourses.splice(finalIndex, 0, courseToInsert);
        const reindexed = reindexCoursesSequence(updatedCourses);

        const updatedBlueprint = {
          ...blueprint,
          courses: reindexed
        };

        setBlueprint(updatedBlueprint);
        setCustomCourseTitle('');
        setAiArchitectReport({
          type: 'custom_injection',
          summary: placementReason || `تمت صياغة "${courseToInsert.courseTitle}" ودمجه في الموضع رقم (${finalIndex + 1}) ضمن سلسلة الشهادة المهنية.`,
          addedCourses: [`الكراش كورس ${finalIndex + 1}: ${courseToInsert.courseTitle}`]
        });
        await handleSaveProjectToHistory(false, true, updatedBlueprint);
        triggerToast(`🎯 تمت إضافة "${courseToInsert.courseTitle}" في الموقع (${finalIndex + 1}) بنجاح!`);
        setInjectingCustom(false);
        return;
      }
      throw new Error('Fallback to smart local placement');
    } catch (err) {
      const finalIndex = customPlacementMode === 'auto' ? Math.max(1, blueprint.courses.length - 1) : parseInt(customPlacementMode, 10);
      const prevCourse = finalIndex > 0 ? blueprint.courses[finalIndex - 1] : null;

      const craftedCourse = {
        courseTitle: `${targetCustomTopic}`,
        courseDescription: `كراش كورس مخصص يأخذك خطوة بخطوة لإتقان (${targetCustomTopic}) وتطبيقه عملياً ضمن مسار الشهادة المهنية.`,
        description: `كراش كورس مخصص يأخذك خطوة بخطوة لإتقان (${targetCustomTopic}) وتطبيقه عملياً ضمن مسار الشهادة المهنية.`,
        difficultyLevel: finalIndex < 3 ? 'المستوى التأسيسي المبسط' : 'المستوى التطبيقي المتقدم',
        estimatedHours: '16 ساعة',
        certificateBadge: `شهادة إتقان: ${targetCustomTopic}`,
        connectionToPrevious: prevCourse 
          ? `يبني مباشرة على ما أنجزناه في (${prevCourse.courseTitle}) ليضيف (${targetCustomTopic}).` 
          : 'نقطة انطلاق تأسيسية مميزة في بداية الشهادة المهنية.',
        githubProject: {
          projectTitle: `مشروع تطبيقي متكامل في ${targetCustomTopic}`,
          projectSummary: `تطبيق عملي شامل لـ (${targetCustomTopic}) خطوة بخطوة بمساعدة الذكاء الاصطناعي.`
        },
        skills: [targetCustomTopic, 'Practical Implementation', 'AI-Assisted Learning'],
        isBlueprintReady: false,
        isForgedComplete: false,
        isNewlyAdded: true,
        sections: []
      };

      const updatedCourses = [...blueprint.courses];
      updatedCourses.splice(finalIndex, 0, craftedCourse);
      const reindexed = reindexCoursesSequence(updatedCourses);

      const updatedBlueprint = {
        ...blueprint,
        courses: reindexed
      };

      setBlueprint(updatedBlueprint);
      setCustomCourseTitle('');
      setAiArchitectReport({
        type: 'custom_injection',
        summary: `تمت إضافة الكراش كورس في الموضع (${finalIndex + 1}) وإعادة ترقيم السلسلة تلقائياً.`,
        addedCourses: [`الكراش كورس ${finalIndex + 1}: ${craftedCourse.courseTitle}`]
      });
      await handleSaveProjectToHistory(false, true, updatedBlueprint);
      triggerToast(`🎯 تمت إضافة الكراش كورس المخصص في الترتيب (${finalIndex + 1}) بنجاح!`);
    } finally {
      setInjectingCustom(false);
    }
  };

  const handleMoveCoursePosition = (cIdx, direction) => {
    if (!blueprint || !blueprint.courses) return;
    const targetIdx = direction === 'up' ? cIdx - 1 : cIdx + 1;
    if (targetIdx < 0 || targetIdx >= blueprint.courses.length) return;

    const updated = [...blueprint.courses];
    const temp = updated[cIdx];
    updated[cIdx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reindexed = reindexCoursesSequence(updated);
    setBlueprint({ ...blueprint, courses: reindexed });
    triggerToast(`↕️ تم نقل الكورس إلى الموضع رقم (${targetIdx + 1})`);
  };

  const handleDeleteCourseFromSeries = (cIdx) => {
    if (!blueprint || !blueprint.courses) return;
    const targetCourse = blueprint.courses[cIdx];
    if (!window.confirm(`🗑️ هل تريد حذف "${targetCourse.courseTitle}" من سلسلة الشهادة المهنية؟`)) return;

    const updated = blueprint.courses.filter((_, idx) => idx !== cIdx);
    const reindexed = reindexCoursesSequence(updated);
    setBlueprint({ ...blueprint, courses: reindexed });
    triggerToast('🗑️ تم حذف الكراش كورس وإعادة ترقيم السلسلة.');
  };

  // ============================================================================
  // 🎯 2.18 دالة توليد وحقن ملخصات جميع الوحدات لكراش كورس واحد في طلب مجمّع واحد
  // ============================================================================
  const forgeCourseUnitsSummaries = async (cIdx, customBlueprintState = null, silent = false) => {
    const workingCert = JSON.parse(JSON.stringify(customBlueprintState || blueprint));
    if (!workingCert || !workingCert.courses || !workingCert.courses[cIdx]) return workingCert;

    const targetCourse = workingCert.courses[cIdx];
    if (!targetCourse.sections || targetCourse.sections.length === 0) {
      if (!silent) alert('يرجى هندسة وحدات هذا الكراش كورس أولاً!');
      return workingCert;
    }

    setGeneratingUnitsSummaryCourseIdx(cIdx);

    const sectionsPayload = targetCourse.sections.map(sec => ({
      sectionName: sec.sectionName,
      isProjectUnit: Boolean(sec.isProjectUnit || (sec.sectionName || '').includes('مشروع')),
      lessonsTitles: (sec.lessons || [])
        .filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
        .map(l => l.title)
    }));

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/batch-course-units-summary', {
        courseTitle: targetCourse.courseTitle,
        sectionsData: sectionsPayload
      });

      const returnedList = res.data?.data?.unitsSummaries || [];
      const unitSummariesMap = {};

      workingCert.courses[cIdx].sections = targetCourse.sections.map((sec, sIdx) => {
        const matchedAi = returnedList[sIdx] || returnedList.find(u => u.sectionName === sec.sectionName);
        const finalSummary = (matchedAi && matchedAi.whatYouLearn)
          ? {
              sectionName: sec.sectionName,
              unitSummary: matchedAi.unitSummary || '',
              whatYouLearn: matchedAi.whatYouLearn || '',
              whyItMatters: matchedAi.whyItMatters || '',
              keyHighlights: matchedAi.keyHighlights || []
            }
          : buildFallbackUnitSummary(targetCourse.courseTitle, sec);

        unitSummariesMap[sec.sectionName] = finalSummary;
        return {
          ...sec,
          unitDeepSummary: finalSummary
        };
      });

      workingCert.courses[cIdx].unitSummariesMap = unitSummariesMap;
      workingCert.courses[cIdx].areUnitSummariesReady = true;
      setBlueprint({ ...workingCert });

      if (!silent) {
        await handleSaveProjectToHistory(false, true, workingCert);
        triggerToast(`🎯 تم توليد وحفظ ملخصات جميع وحدات الكورس ${cIdx + 1} بنجاح!`);
      }
      return workingCert;
    } catch (error) {
      const unitSummariesMap = {};
      workingCert.courses[cIdx].sections = targetCourse.sections.map((sec) => {
        const fallbackSum = buildFallbackUnitSummary(targetCourse.courseTitle, sec);
        unitSummariesMap[sec.sectionName] = fallbackSum;
        return {
          ...sec,
          unitDeepSummary: fallbackSum
        };
      });
      workingCert.courses[cIdx].unitSummariesMap = unitSummariesMap;
      workingCert.courses[cIdx].areUnitSummariesReady = true;
      setBlueprint({ ...workingCert });

      if (!silent) {
        await handleSaveProjectToHistory(false, true, workingCert);
        triggerToast(`🎯 تم تجهيز ملخصات وحدات الكورس ${cIdx + 1} بنجاح!`);
      }
      return workingCert;
    } finally {
      setGeneratingUnitsSummaryCourseIdx(null);
    }
  };

  const handleBatchGenerateAllUnitsSummaries = async () => {
    if (!blueprint || !blueprint.courses) return;
    const readyCourses = blueprint.courses.filter(c => c.sections && c.sections.length > 0);
    if (readyCourses.length === 0) {
      return alert('لا توجد كورسات تحتوي على وحدات حالياً. قم بهندسة وحدات الكورس أولاً!');
    }

    setGeneratingAllUnitsSummaries(true);
    let workingState = JSON.parse(JSON.stringify(blueprint));

    try {
      for (let i = 0; i < workingState.courses.length; i++) {
        if (workingState.courses[i].sections && workingState.courses[i].sections.length > 0) {
          workingState = await forgeCourseUnitsSummaries(i, workingState, true);
        }
      }
      setBlueprint({ ...workingState });
      await handleSaveProjectToHistory(false, true, workingState);
      alert(`🎉 اكتمل توليد وحقن ملخصات الوحدات لجميع الكورسات (${readyCourses.length} كراش كورس) وحفظها في السجل!`);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAllUnitsSummaries(false);
    }
  };

  // ==========================================
  // 👑 2.2 توليد الوثيقة التفصيلية الشاملة للشهادة المهنية وتجميع الكراش كورسات
  // ==========================================
  const handleGenerateMasterCertificateDossier = async () => {
    if (!blueprint || !blueprint.courses || blueprint.courses.length === 0) {
      return alert('لا توجد كراش كورسات لتجميعها في الشهادة المهنية!');
    }

    setGeneratingDossier(true);
    const certTitle = blueprint.courseTitle || blueprint.certificateTitle || topic || 'الشهادة المهنية الشاملة';

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
          projectSummary: 'تطبيق عملي شامل بمساعدة الذكاء الاصطناعي'
        },
        skills: c.skills || [],
        unitsCount: unitsList.length || 8,
        lessonsCount: lessonsInCourse,
        unitsList
      };
    });

    let masterDossier = {
      certificateTitle: certTitle,
      executiveVision: `${blueprint.courseDescription || ''}\n\nصُممت هذه الشهادة المهنية الخارقة لتكون دليلاً عملياً متكاملاً؛ حيث تم تفكيك المسار بالكامل إلى (${blueprint.courses.length}) كراش كورس متسلسل يخرج الطالب من كل مرحلة فيه بإتقان عملي وتطبيقي حقيقي.`,
      mainAnalogy: blueprint.mainAnalogy || 'منهجية متكاملة تربط جميع المراحل من التأسيس حتى القمة الاحترافية.',
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
          'International Remote Professional',
          'Global Exam Top Scorer (IELTS / TOEFL / JLPT)',
          'Full-Stack & AI Specialist'
        ],
        freelanceServices: [
          'العمل مع الشركات والعملاء الدوليين بطلاقة وثقة كاملة.',
          'اجتياز متطلبات الهجرة والمنح الجامعية والشركات العالمية.'
        ],
        saasOpportunities: [
          'توسيع نطاق مشاريعك وخدماتك للسوق العالمي متعدد اللغات.'
        ]
      },
      allSkills: Array.from(allSkillsSet),
      detailedCoursesGuide: coursesSummary.map(cs => ({
        ...cs,
        deepExplanation: `${cs.description} — في هذه المرحلة رقم (${cs.courseOrder}) يدرس ويطبق الطالب (${cs.unitsCount} وحدات تفصيلية تضم ${cs.lessonsCount} درساً وتمرينا).`,
        keyTakeaways: cs.unitsList.length > 0 
          ? cs.unitsList.slice(0, 6) 
          : ['إتقان المفاهيم الأساسية', 'التدريب الصوتي والعملي', 'تطبيقات الذكاء الاصطناعي'],
        projectAndAiRole: `يقوم الطالب في هذه المرحلة بإنجاز (${cs.githubProject.projectTitle}) بالتعاون مع المساعد الذكي.`
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

    await handleSaveProjectToHistory(false, true, updatedBlueprint);
    alert('👑 تم إنشاء وتجميع الوثيقة التفصيلية الشاملة للشهادة المهنية وحفظها في سجل المشاريع!');
  };

  // ==========================================
  // 🧲 2.3 جلب وتجميع الكورسات المنشورة مسبقاً في المنصة (5001) في شهادة مهنية واحدة
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

      const convertedCourses = platformCourses.map((pc, idx) => {
        const cleanDesc = (pc.description || '').split('|||UNITS_MAP:')[0].replace(/\|\s*🏆\s*يمنح:.*$/, '').trim();
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
        courseDescription: `برنامج شهادة مهنية متكامل يضم (${convertedCourses.length}) كراش كورسات متدرجة من الصفر المطلق وحتى الاحتراف وبناء المشاريع الحقيقية بمساعدة وكلاء الذكاء الاصطناعي.`,
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
      setActiveProjectId(null);
      setActiveProjectName(customCertName);
      setPreviewMode('certificate_dossier');
      alert(`🎉 تم استيراد وتجميع (${convertedCourses.length}) كراش كورس داخل الشهادة المهنية!`);
    } catch (err) {
      console.error(err);
      alert('❌ تعذر الاتصال بسيرفر المنصة (5001) لجلب الكورسات.');
    } finally {
      setBundlingExisting(false);
    }
  };

  // ==========================================
  // 🗺️ 2.5 هندسة وحدات كراش كورس واحد (يختار تلقائياً مسار اللغات، أو مسار المشاريع، أو المسار العادي)
  // ==========================================
  const handleGenerateSingleCrashBlueprint = async (cIdx, currentBlueprintState = blueprint) => {
    const targetCert = currentBlueprintState || blueprint;
    if (!targetCert || !targetCert.courses) return null;

    const targetCourse = targetCert.courses[cIdx];
    const prevCourse = cIdx > 0 ? targetCert.courses[cIdx - 1] : null;
    const nextCourse = cIdx < targetCert.courses.length - 1 ? targetCert.courses[cIdx + 1] : null;

    setActiveCourseIndex(cIdx);
    setForgingStatus('generating_sub_blueprint');

    const isLangCert = Boolean(
      targetCert.isLanguageSeries ||
      difficulty === 'lang_a0_to_c2_cert' ||
      difficulty === 'lang_exam_prep_cert' ||
      difficulty === 'lang_mega_a0_c2_exam'
    );
    const isScratchProject = Boolean(targetCert.isProjectScratchSeries || difficulty === 'pro_project_scratch_cert');

    const targetEndpoint = isLangCert
      ? 'http://localhost:5000/api/academy2/lang-cert/blueprint-course-units'
      : isScratchProject
        ? 'http://localhost:5000/api/academy2/project-cert/blueprint-phase-units'
        : 'http://localhost:5000/api/academy2/blueprint-crash-course';

    try {
const res = await axios.post(targetEndpoint, {
        certificateTitle: targetCert.courseTitle || targetCert.certificateTitle,
        targetLanguage: targetCert.targetLanguage || targetLanguage,
        difficulty, // 👈 مهم جداً لكي يعرف السيرفر نوع الشهادة المختارة!
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


// 🧠 دالة استخراج المفردات المكتسبة (من الكورسات/الوحدات السابقة + من الدروس السابقة في نفس الوحدة الحالية!)
  const extractPreviouslyLearnedVocab = (certState, currentCourseIdx, currentSecIdx = 0, currentUnitForgedLessons = []) => {
    if (!certState || !Array.isArray(certState.courses)) {
      return { unitVocabSoFar: [], olderVocab: [] };
    }
    const olderCollected = new Set();
    const currentUnitCollected = new Set();

    const harvestFromLesson = (les, targetSet) => {
      if (!les) return;
      // 1. استخراج من استوديو الصوتيات (codeSnippet)
      (les.codeSnippet || '').split('\n').forEach(line => {
        const match = line.match(/^\d+[.) -]+\s*([^🔊|]+)/);
        if (match && match[1]) {
          const cleanPhrase = match[1].trim();
          if (cleanPhrase.length >= 2 && cleanPhrase.length <= 35) {
            targetSet.add(cleanPhrase);
          }
        }
      });
      // 2. استخراج الكلمات الأساسية من العمود الأول في جدول المفردات داخل content
      (les.content || '').split('\n').forEach(line => {
        if (line.trim().startsWith('|') && !line.includes('---') && !line.includes('المفردة')) {
          const firstCol = (line.split('|')[1] || '').replace(/[*`]/g, '').trim();
          if (firstCol && firstCol.length >= 2 && firstCol.length <= 30 && !/[\u0600-\u06FF]/.test(firstCol)) {
            targetSet.add(firstCol);
          }
        }
      });
    };

    // أ) جمع المفردات من الكورس السابق
    if (currentCourseIdx > 0 && certState.courses[currentCourseIdx - 1]?.sections) {
      certState.courses[currentCourseIdx - 1].sections.forEach(sec => {
        (sec.lessons || []).forEach(les => harvestFromLesson(les, olderCollected));
      });
    }

    // ب) جمع المفردات من الوحدات السابقة في نفس الكورس الحالي
    const currCourse = certState.courses[currentCourseIdx];
    if (currCourse?.sections) {
      currCourse.sections.slice(0, currentSecIdx).forEach(sec => {
        (sec.lessons || []).forEach(les => harvestFromLesson(les, olderCollected));
      });
    }

    // ج) الأهم: جمع المفردات التي تم تدريسها للتو في الدروس السابقة من نفس الوحدة الحالية!
    (currentUnitForgedLessons || []).forEach(les => harvestFromLesson(les, currentUnitCollected));

    return {
      unitVocabSoFar: Array.from(currentUnitCollected).slice(-35),
      olderVocab: Array.from(olderCollected).slice(-25)
    };
  };


  // ==========================================
  // ✍️ 4. تأليف الدروس (يدعم: مسار اللغات بالصوتيات + مسار المشاريع بدون اختبارات + المسار الأكاديمي)
  // ==========================================
  const handleForgeCrashCourseLessons = async (cIdx, customBlueprintState = null) => {
    const currentState = customBlueprintState || blueprint;
    if (!currentState) return null;

    const targetCourse = currentState.courses[cIdx];
    if (!targetCourse.sections || targetCourse.sections.length === 0) {
      alert('يرجى هندسة وحدات هذا الكراش كورس أولاً!');
      return null;
    }

    const isLangCert = Boolean(
      currentState.isLanguageSeries ||
      difficulty === 'lang_a0_to_c2_cert' ||
      difficulty === 'lang_exam_prep_cert' ||
      difficulty === 'lang_mega_a0_c2_exam'
    );
    const isScratchProject = Boolean(currentState.isProjectScratchSeries || difficulty === 'pro_project_scratch_cert');

    let totalSteps = 0;
    targetCourse.sections.forEach(sec => {
      const rawLessons = isScratchProject
        ? (sec.lessons || []).filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
        : (sec.lessons || []);
      totalSteps += rawLessons.length;
      if (!isScratchProject) {
        totalSteps += Math.floor(rawLessons.length / 2);
        totalSteps += 1;
      }
    });
    totalSteps += 1;

    setActiveCourseIndex(cIdx);
    setForgingStatus('forging');
    let completedCount = 0;
    let updatedCert = JSON.parse(JSON.stringify(currentState));

    const contextualCourseTopic = `${targetCourse.courseTitle} (الكورس ${cIdx + 1} من: ${updatedCert.courseTitle || updatedCert.certificateTitle} | الربط السابق: ${targetCourse.connectionToPrevious || 'البداية'})`;

    for (let sIdx = 0; sIdx < updatedCert.courses[cIdx].sections.length; sIdx++) {
      const section = updatedCert.courses[cIdx].sections[sIdx];
      const baseLessonsToForge = isScratchProject
        ? (section.lessons || []).filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
        : (section.lessons || []);

      let newLessonsArray = [];
      let lessonsSinceLastBoss = 0;

      for (let lIdx = 0; lIdx < baseLessonsToForge.length; lIdx++) {
        const lesson = baseLessonsToForge[lIdx];
        setForgeProgress({ 
          current: completedCount, 
          total: totalSteps, 
          currentLessonName: `[كورس ${cIdx + 1} - وحدة ${sIdx + 1}] ${lesson.title}` 
        });

        try {
          const lessonEndpoint = isLangCert
            ? 'http://localhost:5000/api/academy2/lang-cert/forge-language-lesson'
            : isScratchProject
              ? 'http://localhost:5000/api/academy2/project-cert/forge-build-step'
              : 'http://localhost:5000/api/academy2/forge-lesson';

              
const vocabMemory = isLangCert
            ? extractPreviouslyLearnedVocab(updatedCert, cIdx, sIdx, newLessonsArray)
            : { unitVocabSoFar: [], olderVocab: [] };

          const res = await axios.post(lessonEndpoint, {
            courseTopic: contextualCourseTopic,
            targetLanguage: updatedCert.targetLanguage || targetLanguage,
            courseOrder: cIdx + 1,
            lessonOrderInUnit: lIdx + 1,
            totalLessonsInUnit: baseLessonsToForge.length,
            allUnitLessonTitles: baseLessonsToForge.map(item => item.title),
            unitLearnedVocab: vocabMemory.unitVocabSoFar, // 👈 الكلمات التي شُرحت في الدروس السابقة من نفس الوحدة (يُمنع تكرارها في الجدول!)
            previouslyLearnedVocab: vocabMemory.olderVocab, // 👈 الكلمات من الوحدات السابقة (للتكرار المتباعد)
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            lessonDescription: lesson.description || '',
            lessonCategory: lesson.lessonCategory || (isLangCert ? 'language_mastery' : 'code'),
            isProjectUnit: section.isProjectUnit || isScratchProject,
            difficulty: isLangCert ? difficulty : (isScratchProject ? 'pro_project_scratch_cert' : 'crash_eli5')
          });

        if (res.data.success) {
            newLessonsArray.push(
              verifyAndNormalizeForgedLesson({
                ...lesson,
                type: "video",
                content: res.data.data.content,
                codeSnippet: res.data.data.codeSnippet || "",
                codeExplanation: res.data.data.codeExplanation || "",
                codingPractice: isScratchProject ? null : (res.data.data.codingPractice || null),
                dailyQuest: isScratchProject
                  ? null
                  : res.data.data.dailyQuest
                    ? { ...res.data.data.dailyQuest, isMandatory: false, bonusExp: 50 }
                    : null,
                isForged: true
              })
            );
            lessonsSinceLastBoss++;
            completedCount++;
            setForgeProgress({ 
              current: completedCount, 
              total: totalSteps, 
              currentLessonName: `[كورس ${cIdx + 1}] ${lesson.title}` 
            });
          }

          if (!isScratchProject && lessonsSinceLastBoss === 2) {
            const prevLesson1 = newLessonsArray[newLessonsArray.length - 2];
            const prevLesson2 = newLessonsArray[newLessonsArray.length - 1];

            const hasCode = !isLangCert && (
              (prevLesson1.codeSnippet && prevLesson1.codeSnippet.length > 10) || 
              (prevLesson2.codeSnippet && prevLesson2.codeSnippet.length > 10) ||
              prevLesson1.codingPractice?.hasPractice ||
              prevLesson2.codingPractice?.hasPractice
            );

            const gateType = isLangCert
              ? "بوابة التحدي اللغوي والسمعي (Language Boss Check)"
              : (hasCode ? "البوابة الحمراء (Red Gate)" : "بوابة الزعيم (Boss Dungeon)");
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
                  description: isLangCert
                    ? "تحدي لغوي يختبر إتقانك للقواعد والمفردات والصوتيات قبل التقدم."
                    : (hasCode ? "بوابة حمراء مليئة بتحديات الأكواد الدامية. كسر البوابة يتطلب نسبة 70%." : "اختبار شامل لكسر البوابة. يتطلب نسبة نجاح 70% للمرور."),
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

      if (!isScratchProject) {
        setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: `[كورس ${cIdx + 1}] تجهيز الاختبار النهائي للوحدة ${sIdx + 1}...` });

        try {
          const unitLessonsTitles = baseLessonsToForge.map(l => l.title).join('، ');
          const unitExamRes = await axios.post('http://localhost:5000/api/academy2/forge-unit-exam', {
            courseTopic: contextualCourseTopic,
            sectionName: section.sectionName,
            unitLessonsSummary: unitLessonsTitles
          });

          if (unitExamRes.data.success) {
            newLessonsArray.push({
              title: unitExamRes.data.data.examTitle || `🏆 الاختبار النهائي: ${section.sectionName}`,
              description: isLangCert
                ? "اختبار شامل للوحدة اللغوية (قواعد + مفردات + صوتيات + مهمة كتابية)."
                : "اختبار نهائي مختلط (نظري + كودي + تحدي كتابة كود) لاجتياز هذه الوحدة بالكامل.",
              type: "unit_exam", content: "", codeSnippet: "",
              bossQuiz: unitExamRes.data.data.bossQuiz || [],
              codingPractice: unitExamRes.data.data.unitCodingChallenge || null,
              isForged: true
            });
            completedCount++;
          }
        } catch (examErr) { console.error("خطأ في توليد اختبار نهاية الوحدة"); }
      }

      updatedCert.courses[cIdx].sections[sIdx].lessons = newLessonsArray;
      setBlueprint({ ...updatedCert });
    }

    setForgeProgress({ 
      current: completedCount, 
      total: totalSteps, 
      currentLessonName: `[كورس ${cIdx + 1}] 🎯 توليد ملخصات جميع الوحدات وفوائدها العملية دفعة واحدة...` 
    });
    updatedCert = await forgeCourseUnitsSummaries(cIdx, updatedCert, true);
    completedCount++;

    updatedCert.courses[cIdx].isForgedComplete = true;
    setBlueprint({ ...updatedCert });
    setForgingStatus('complete');
    setActiveCourseIndex(null);

    await handleSaveProjectToHistory(false, true, updatedCert);
    triggerToast(
      isLangCert
        ? `🌍 اكتمل تأليف الكورس اللغوي ${cIdx + 1} (مع نصوص الاستماع والصوتيات والاختبارات) وتم حفظه في السجل!`
        : isScratchProject 
          ? `🏗️ اكتمل تأليف خطوات وأكواد المرحلة ${cIdx + 1} (بدون اختبارات) وتم حفظها في السجل!` 
          : `✅ اكتمل تأليف الكورس ${cIdx + 1} مع ملخصات جميع وحداته وتم حفظه في السجل!`
    );
    return updatedCert;
  };

  // الطيار الآلي
  const handleAutoPilotAllCourses = async () => {
    if (!blueprint || !blueprint.courses) return;
    const confirmAuto = window.confirm(`سيقوم النظام بهندسة وتأليف دروس وملخصات وحدات جميع الكورسات (${blueprint.courses.length} كراش كورس). هل تريد الانطلاق؟`);
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
      alert('🎉 اكتمل بناء وتأليف جميع الكراش كورسات وملخصات وحداتها في الشهادة المهنية بنجاح!');
    } catch (error) {
      alert(`توقف الطيار الآلي: ${error.message}`);
    } finally {
      setAutoPilotRunning(false);
    }
  };

  // تأليف الكورس المنفرد
  const handleForgeAllLessons = async () => {
    if (!blueprint || !blueprint.blueprint) return;

    const isScratchSingle = difficulty === 'single_project_scratch' || Boolean(blueprint.isProjectScratchSeries);

    let totalSteps = 0;
    blueprint.blueprint.forEach(sec => {
      totalSteps += sec.lessons.length;
      if (!isScratchSingle) {
        totalSteps += Math.floor(sec.lessons.length / 2);
        totalSteps += 1; 
      }
    });
    totalSteps += 1;

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
          const isSingleLang = Boolean(updatedBlueprint.isLanguageSeries || isLanguageMasteryMode);
          const targetEndpoint = isScratchSingle
            ? 'http://localhost:5000/api/academy2/project-cert/forge-build-step'
            : isSingleLang
              ? 'http://localhost:5000/api/academy2/lang-cert/forge-language-lesson'
              : 'http://localhost:5000/api/academy2/forge-lesson';

          const res = await axios.post(targetEndpoint, {
            courseTopic: updatedBlueprint.courseTitle,
            targetLanguage: updatedBlueprint.targetLanguage || targetLanguage,
            courseOrder: 1,
            lessonOrderInUnit: lIdx + 1,
            totalLessonsInUnit: section.lessons.length,
            allUnitLessonTitles: section.lessons.map(item => item.title),
            sectionName: section.sectionName,
            lessonTitle: lesson.title,
            lessonDescription: lesson.description || '',
            isProjectUnit: section.isProjectUnit || isScratchSingle,
            difficulty: difficulty
          });

          if (res.data.success) {
            newLessonsArray.push({
              ...lesson, type: "video", content: res.data.data.content,
              codeSnippet: res.data.data.codeSnippet || "", codeExplanation: res.data.data.codeExplanation || "",
              codingPractice: isScratchSingle ? null : (res.data.data.codingPractice || null),
              dailyQuest: isScratchSingle ? null : (res.data.data.dailyQuest ? { ...res.data.data.dailyQuest, isMandatory: false, bonusExp: 50 } : null),
              isForged: true
            });
            lessonsSinceLastBoss++;
            completedCount++;
            setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: lesson.title });
          }

          if (!isScratchSingle && lessonsSinceLastBoss === 2) {
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

      if (!isScratchSingle) {
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
      }

      updatedBlueprint.blueprint[sIdx].lessons = newLessonsArray;
      setBlueprint({...updatedBlueprint});
    }

    setForgeProgress({ current: completedCount, total: totalSteps, currentLessonName: '🎯 توليد ملخصات جميع الوحدات دفعة واحدة...' });
    try {
      const sectionsPayload = updatedBlueprint.blueprint.map(sec => ({
        sectionName: sec.sectionName,
        isProjectUnit: Boolean(sec.isProjectUnit || (sec.sectionName || '').includes('مشروع')),
        lessonsTitles: (sec.lessons || []).filter(l => l.type === 'video').map(l => l.title)
      }));
      const sumRes = await axios.post('http://localhost:5000/api/academy2/batch-course-units-summary', {
        courseTitle: updatedBlueprint.courseTitle,
        sectionsData: sectionsPayload
      });
      const returnedList = sumRes.data?.data?.unitsSummaries || [];
      const unitSummariesMap = {};
      updatedBlueprint.blueprint = updatedBlueprint.blueprint.map((sec, idx) => {
        const matched = returnedList[idx] || buildFallbackUnitSummary(updatedBlueprint.courseTitle, sec);
        unitSummariesMap[sec.sectionName] = matched;
        return { ...sec, unitDeepSummary: matched };
      });
      updatedBlueprint.unitSummariesMap = unitSummariesMap;
    } catch (e) {
      updatedBlueprint.unitSummariesMap = extractUnitSummariesMapFromSections(updatedBlueprint.courseTitle, updatedBlueprint.blueprint);
    }

    setBlueprint({...updatedBlueprint});
    setForgingStatus('complete');
    await handleSaveProjectToHistory(false, true, updatedBlueprint);
    alert('🎉 اكتمل تأليف جميع خطوات الكورس وملخصات الوحدات بالكامل وتم حفظه في السجل!');
  };

  // ==========================================
  // 🚀 5. المزامنة الموحدة (تحقن ملخصات الوحدات في courseDescription وفي الدروس لضمان حفظها 100% في سيرفر 5001)
  // ==========================================
  const injectUnitSummariesIntoSections = (courseTitle, sections = [], unitSummariesMap = {}) => {
    return (sections || []).map(sec => {
      const summaryObj = 
        sec.unitDeepSummary || 
        unitSummariesMap?.[sec.sectionName] || 
        buildFallbackUnitSummary(courseTitle, sec);

      const serializedSummary = JSON.stringify({
        unitSummary: summaryObj.unitSummary || '',
        whatYouLearn: summaryObj.whatYouLearn || '',
        whyItMatters: summaryObj.whyItMatters || '',
        keyHighlights: summaryObj.keyHighlights || []
      });

      const updatedLessons = (sec.lessons || []).map((lesson, lIdx) => {
        const cleanDesc = (lesson.description || '').split('|||UNIT_SUMMARY:')[0].trim();
        if (lIdx === 0) {
          return {
            ...lesson,
            description: `${cleanDesc} |||UNIT_SUMMARY:${serializedSummary}`
          };
        }
        return { ...lesson, description: cleanDesc };
      });

      return {
        ...sec,
        unitDeepSummary: summaryObj,
        lessons: updatedLessons
      };
    });
  };

  const handleSyncSingleCrashCourse = async (courseObj, cIdx) => {
    const parentCertTitle = blueprint.courseTitle || blueprint.certificateTitle;
    const confirmSync = window.confirm(`هل تريد رفع "${courseObj.courseTitle}" (مع ملخصات جميع وحداته) إلى CherifPlatform؟`);
    if (!confirmSync) return;

    setSyncingCourseIdx(cIdx);
    try {
      const detailedCourseInfo = blueprint.masterDossier?.detailedCoursesGuide?.[cIdx];
      const unitSummariesMap = courseObj.unitSummariesMap || extractUnitSummariesMapFromSections(courseObj.courseTitle, courseObj.sections);
      const sectionsWithEmbeddedSummaries = injectUnitSummariesIntoSections(courseObj.courseTitle, courseObj.sections, unitSummariesMap);

      const baseDescription = `${detailedCourseInfo?.deepExplanation || courseObj.courseDescription || courseObj.description} | 🏆 يمنح: ${courseObj.certificateBadge || 'شهادة إتمام الكراش كورس'} (ضمن ${parentCertTitle})`;
      const enrichedDescription = `${baseDescription} |||UNITS_MAP:${JSON.stringify(unitSummariesMap)}`;

      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: `${courseObj.coursePrefix || `الكورس ${cIdx + 1}`}: ${courseObj.courseTitle}`,
        courseDescription: enrichedDescription,
        difficulty: courseObj.difficultyLevel || 'مسار احترافي متكامل',
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
          githubProject: courseObj.githubProject || null,
          unitSummariesMap
        },
        blueprint: sectionsWithEmbeddedSummaries
      });
      if (res.data.success) alert(`🎉 تم رفع "${courseObj.courseTitle}" ونقل ملخصات جميع وحداته بنجاح!`);
    } catch (error) { alert('❌ حدث خطأ في المزامنة.'); } finally { setSyncingCourseIdx(null); }
  };

  const handleSyncEntireCertificate = async () => {
    if (!blueprint || !blueprint.courses) return;
    const parentCertTitle = blueprint.courseTitle || blueprint.certificateTitle;
    const forgedCourses = blueprint.courses.filter(c => c.isForgedComplete && c.sections?.length > 0);
    if (forgedCourses.length === 0) return alert('يرجى تأليف كراش كورس واحد على الأقل قبل المزامنة!');

    const confirmSync = window.confirm(
      `سيتم تجميع ورفع (${forgedCourses.length}) كراش كورسات مع نقل ملخصات جميع وحداتها إلى CherifPlatform.\nهل أنت متأكد؟`
    );
    if (!confirmSync) return;

    setSyncing(true);
    try {
      for (let i = 0; i < blueprint.courses.length; i++) {
        const courseObj = blueprint.courses[i];
        if (!courseObj.isForgedComplete) continue;

        const detailedCourseInfo = blueprint.masterDossier?.detailedCoursesGuide?.[i];
        const unitSummariesMap = courseObj.unitSummariesMap || extractUnitSummariesMapFromSections(courseObj.courseTitle, courseObj.sections);
        const sectionsWithEmbeddedSummaries = injectUnitSummariesIntoSections(courseObj.courseTitle, courseObj.sections, unitSummariesMap);

        const baseDescription = `${detailedCourseInfo?.deepExplanation || courseObj.courseDescription || courseObj.description} | 🏆 يمنح: ${courseObj.certificateBadge || `شهادة إتمام الكورس ${i + 1}`} (ضمن ${parentCertTitle})`;
        const enrichedDescription = `${baseDescription} |||UNITS_MAP:${JSON.stringify(unitSummariesMap)}`;

        await axios.post('http://localhost:5001/api/courses/auto-import', {
          courseTitle: `${courseObj.coursePrefix || `الكورس ${i + 1}`}: ${courseObj.courseTitle}`,
          courseDescription: enrichedDescription,
          difficulty: courseObj.difficultyLevel || 'مسار احترافي متكامل',
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
            githubProject: courseObj.githubProject || null,
            unitSummariesMap
          },
          blueprint: sectionsWithEmbeddedSummaries
        });
      }
      alert(`🎉 تم رفع جميع الكراش كورسات (${forgedCourses.length}) مع ملخصات وحداتها بنجاح إلى CherifPlatform!`);
    } catch (err) { alert('❌ حدث خطأ أثناء المزامنة الجماعية.'); } finally { setSyncing(false); }
  };

  const handleSyncToPlatform = async () => {
    if (!blueprint || forgingStatus !== 'complete') return;
    const confirmSync = window.confirm('هل أنت متأكد من الرفع إلى قاعدة بيانات منصتك؟');
    if (!confirmSync) return;

    setSyncing(true);
    try {
      const unitSummariesMap = blueprint.unitSummariesMap || extractUnitSummariesMapFromSections(blueprint.courseTitle, blueprint.blueprint);
      const sectionsWithEmbeddedSummaries = injectUnitSummariesIntoSections(blueprint.courseTitle, blueprint.blueprint, unitSummariesMap);
      const baseDesc = (blueprint.courseDescription || '').split('|||UNITS_MAP:')[0].trim();

      const res = await axios.post('http://localhost:5001/api/courses/auto-import', {
        courseTitle: blueprint.courseTitle,
        courseDescription: `${baseDesc} |||UNITS_MAP:${JSON.stringify(unitSummariesMap)}`,
        difficulty: difficulty,
        certificateMeta: { unitSummariesMap },
        blueprint: sectionsWithEmbeddedSummaries
      });
      if (res.data.success) alert('🎉 تم إطلاق الكورس مع ملخصات وحداته بنجاح!');
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

  const filteredHistoryProjects = projectHistory.filter(p => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(historySearch.toLowerCase()) ||
      (p.topic || '').toLowerCase().includes(historySearch.toLowerCase());
    if (!matchesSearch) return false;
    if (historyFilter === 'starred') return p.isStarred;
    if (historyFilter === 'certificate') return p.isCertificateSeries;
    if (historyFilter === 'single') return !p.isCertificateSeries;
    return true;
  });

  const quickGapSuggestions = isLanguageMasteryMode
    ? [
        'الصوتيات ومخارج الحروف والربط الصوتي (IPA & Connected Speech)',
        'تكتيكات الاستماع السريع وفهم اللهجات (Listening Mastery)',
        'هندسة المقالات الأكاديمية (Writing Task 1 & Task 2 Band 8+)',
        'محاكاة مقابلة التحدث الرسمية (Speaking Mock Exams)',
        'الاختبارات التجريبية الشاملة تحت ضغط الوقت (Full Mock Tests)'
      ]
    : [
        'أمن التطبيقات وحماية الـ APIs (Cybersecurity)',
        'الاختبارات الآلية وضمان الجودة (Automated Testing)',
        'بناء وكلاء الذكاء الاصطناعي (AI Agents & MCP)',
        'بوابات الدفع وتحويل المشروع لـ SaaS (Stripe & Billing)',
        'الحاويات والنشر السحابي (Docker & CI/CD)'
      ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8" dir="rtl">

      {/* 🔔 إشعار الحفظ الفوري العائم (Save Toast) */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 z-[120] bg-emerald-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(16,185,129,0.5)] flex items-center gap-2.5 animate-fade-in-up">
          <CheckCircle2 size={18} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 🎨 الهيدر مع لوحة الحفظ وسجل المشاريع */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-800 pb-6 gap-5">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-indigo-500" size={40} /> مختبر الأكاديمية <span className="text-indigo-500 bg-indigo-500/10 text-lg px-3 py-1 rounded-lg border border-indigo-500/20">V2 (SUPER ARCHITECT)</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">
            مصنع الشهادات المهنية الخارقة + شهادات بناء المشاريع من الصفر 🛠️ + أكاديمية اللغات والاختبارات العالمية (A0-C2 & IELTS 🌍)
          </p>
        </div>

        {/* 🛡️ شريط التحكم في الحفظ، النسخ، استيراد JSON، وسجل التاريخ */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-xl">
          
          <div className="flex flex-col text-right ml-3 pl-3 border-l border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 truncate max-w-[180px]">
              {activeProjectName ? `📌 ${activeProjectName}` : 'مساحة عمل جديدة'}
            </span>
            {hasDraft ? (
              <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1 mt-0.5">
                <Clock size={11}/> آخر حفظ تلقائي: {lastSaved || 'الآن'}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-500 mt-0.5">لا توجد مسودة نشطة</span>
            )}
          </div>

          <button 
            onClick={() => handleSaveProjectToHistory(false)} 
            disabled={!blueprint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>{activeProjectId ? 'حفظ التعديلات' : 'حفظ في السجل'}</span>
          </button>

          {blueprint && (
            <button 
              onClick={() => handleSaveProjectToHistory(true)} 
              className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <BookmarkPlus size={16} />
              <span className="hidden sm:inline">نسخة جديدة</span>
            </button>
          )}

          <button 
            onClick={() => setShowHistoryModal(true)}
            className="bg-amber-500/15 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <History size={16} />
            <span>سجل المشاريع ({projectHistory.length})</span>
          </button>

          <input 
            type="file" 
            accept=".json" 
            ref={importFileInputRef} 
            onChange={handleImportJSONToVault} 
            className="hidden" 
          />
          <button 
            onClick={() => importFileInputRef.current?.click()}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Upload size={15} />
            <span className="hidden md:inline">استيراد JSON</span>
          </button>

          {hasDraft && !blueprint && (
            <button 
              onClick={loadDraft}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={15} /> استرجاع المسودة
            </button>
          )}

          {blueprint && (
            <button 
              onClick={clearDraft}
              className="bg-red-500/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white p-2.5 rounded-xl transition-all"
            >
              <Trash2 size={16} />
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

            {/* أزرار الإلهام الأكاديمي التقليدي */}
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

            {/* 🏗️ صندوق إلهام المشاريع العملاقة من الصفر للنهاية (بدون اختبارات) */}
            <div className="bg-slate-950/90 border-2 border-emerald-500/30 rounded-2xl p-3.5 mb-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <Terminal size={14} /> استلهام شهادة "بناء مشروع ضخم من الصفر" (بدون اختبارات):
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  كود + AI Agent 🛠️
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => generateProjectFromScratchIdea('business_saas')}
                  className="bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Briefcase size={13} className="text-emerald-400 shrink-0" />
                  <span>💼 مشروع بزنس وSaaS</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateProjectFromScratchIdea('dopamine_app')}
                  className="bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Flame size={13} className="text-amber-400 shrink-0" />
                  <span>🔥 مشروع يضرب الدوبامين</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateProjectFromScratchIdea('desktop_app')}
                  className="bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Monitor size={13} className="text-indigo-400 shrink-0" />
                  <span>🖥️ تطبيق Desktop وPOS</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateProjectFromScratchIdea('ai_model_scratch')}
                  className="bg-slate-900 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Cpu size={13} className="text-purple-400 shrink-0" />
                  <span>🧠 بناء نموذج AI وAgent</span>
                </button>
              </div>
            </div>

            {/* 🌍 صندوق إلهام شهادات اللغات الأجنبية والاختبارات العالمية (Cambridge × Feynman ELI5) */}
            <div className="bg-slate-950/90 border-2 border-purple-500/35 rounded-2xl p-3.5 mb-4 space-y-2.5 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Globe size={14} className="text-amber-400" /> أكاديمية اللغات (من الحروف A0 إلى C2 Native):
                </span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-slate-900 border border-purple-500/40 text-purple-200 text-[11px] font-bold rounded-lg px-2.5 py-1 outline-none cursor-pointer"
                >
                  <option value="الإنجليزية (English - IELTS/TOEFL)">🇬🇧 الإنجليزية (English)</option>
                  <option value="اليابانية (Japanese - Hiragana/Kanji & JLPT)">🇯🇵 اليابانية (Japanese)</option>
                  <option value="الفرنسية (French - DELF/DALF)">🇫🇷 الفرنسية (French)</option>
                  <option value="الألمانية (German - Goethe/TestDaF)">🇩🇪 الألمانية (German)</option>
                  <option value="الإسبانية (Spanish - DELE)">🇪🇸 الإسبانية (Spanish)</option>
                  <option value="الصينية (Mandarin - HSK)">🇨🇳 الصينية (Mandarin)</option>
                  <option value="الكورية (Korean - Hangul & TOPIK)">🇰🇷 الكورية (Korean)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => generateLanguageMasteryIdea('a0_to_c2')}
                  className="bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-purple-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Headphones size={13} className="text-purple-400 shrink-0" />
                  <span>🗣️ من الحروف A0 إلى C2 Native</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateLanguageMasteryIdea('exam_prep')}
                  className="bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Trophy size={13} className="text-amber-400 shrink-0" />
                  <span>🎯 معسكر IELTS / JLPT / DELF</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateLanguageMasteryIdea('mega_combined')}
                  className="bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Sparkles size={13} className="text-rose-400 shrink-0" />
                  <span>👑 الشهادة الإمبراطورية (20+ كورس)</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateLanguageMasteryIdea('tech_business_lang')}
                  className="bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-all flex items-center gap-1.5 text-right"
                >
                  <Mic size={13} className="text-indigo-400 shrink-0" />
                  <span>💼 لغة الشركات والمبرمجين</span>
                </button>
              </div>
            </div>

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
                <label className="block text-sm font-bold text-slate-400 mb-2">الموضوع أو المشروع أو اللغة المراد تدريسها</label>
                <input type="text" placeholder="مثال: الشهادة الإمبراطورية لإتقان الإنجليزية من A0 إلى C2 واجتياز IELTS Band 8+" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white transition-colors" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">مستوى الصعوبة وأسلوب الشرح</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none text-white appearance-none cursor-pointer" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="pro_certificate_eli5">🎓 شهادة مهنية خارقة (9-15+ كراش كورس مترابط - تبسيط كأنك طفل 👶)</option>
                  <option value="pro_project_scratch_cert">🏗️ شهادة مهنية لبناء مشروع كامل من الصفر للنهاية (تطبيقات / مواقع / Desktop / AI - بدون اختبارات 🛠️)</option>
                  <option value="lang_a0_to_c2_cert">🌍 شهادة مهنية لإتقان اللغات من الصفر للطلاقة (A0 ➔ C2 الشاملة: صوتيات، استماع، تحدث، قواعد، كتابة 🗣️)</option>
                  <option value="lang_exam_prep_cert">🎯 شهادة مهنية لاجتياز الاختبارات العالمية للغات (IELTS / TOEFL / JLPT / DELF - استراتيجيات الدرجات العالية 🏆)</option>
                  <option value="lang_mega_a0_c2_exam">👑 الشهادة اللغوية الإمبراطورية المدمجة (من الصفر A0 إلى C2 + اجتياز الاختبار العالمي - 18 إلى 24+ كراش كورس 🔥)</option>
                  <option value="single_project_scratch">🛠️ كراش كورس عملي لبناء مشروع من الصفر للنهاية (مع AI Agent - بدون اختبارات)</option>
                  <option value="crash_eli5">كراش كورس منفرد (تبسيط مطلق - اشرح لي كأني طفل 👶)</option>
                  <option value="مبتدئ تماماً (E-Rank)">مبتدئ تماماً (E-Rank)</option>
                  <option value="متوسط (B-Rank)">متوسط (B-Rank)</option>
                  <option value="خبير متقدم (S-Rank)">خبير متقدم (S-Rank)</option>
                  <option value="معسكر شامل (Bootcamp - شهادات مصغرة)">معسكر شامل (Bootcamp - شهادات مصغرة)</option>
                </select>
              </div>

              <button onClick={handleGenerateBlueprint} disabled={loadingBlueprint || forgingStatus === 'forging' || autoPilotRunning} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingBlueprint ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                ) : (
                  <><Wand2 size={20} /> {isLanguageMasteryMode ? 'هندسة خريطة الشهادة اللغوية والاختبارات العالمية' : difficulty === 'pro_project_scratch_cert' ? 'هندسة خريطة بناء المشروع الكامل (بدون اختبارات)' : 'هندسة خريطة المنهج (V2)'}</>
                )}
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 🎓 العرض الأول: إذا كان المنهج "شهادة مهنية شاملة" */}
          {/* ============================================================== */}
          {blueprint && blueprint.isCertificateSeries && (
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl shadow-2xl animate-fade-in-up overflow-hidden">

              <div className="bg-gradient-to-r from-indigo-950 via-[#0b1120] to-[#0b1120] p-6 border-b border-slate-800 relative">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    <Award size={16} /> شهادة مهنية متكاملة ({blueprint.courses?.length} كراش كورسات)
                  </div>
                  {isNoExamProjectMode && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                      <Terminal size={14} /> نمط بناء مشروع من الصفر (بدون اختبارات 🛠️)
                    </div>
                  )}
                  {isLanguageMasteryMode && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black">
                      <Volume2 size={14} /> نظام اللغات الشامل (صوتيات + استماع + نطق + محاكي AI 🎙️)
                    </div>
                  )}
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
                      <Sparkles size={14}/> {isLanguageMasteryMode ? 'منهجية الانغماس اللغوي والصوتي (Immersion Methodology):' : isNoExamProjectMode ? 'المعمارية الهندسية للمشروع (Architecture Flow):' : 'القصة والتشبيه الموحد للشهادة (ELI5 Storyline):'}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">{blueprint.mainAnalogy}</p>
                  </div>
                )}

                {/* مختبر تطوير وتوسيع الشهادة المهنية */}
                <div className="bg-slate-950/90 border-2 border-indigo-500/30 rounded-2xl p-4 mb-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black text-indigo-300 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" /> مختبر تطوير وتوسيع الشهادة المهنية (AI Optimizer)
                    </h3>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30">
                      غير مدمّر للدروس المؤلفة 🛡️
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleEnhanceAndExpandCertificate}
                    disabled={enhancingCert || forgingStatus === 'forging'}
                    className="w-full bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {enhancingCert ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    ) : (
                      <Wand2 size={16} className="text-amber-300" />
                    )}
                    {enhancingCert 
                      ? 'جاري فحص الثغرات وترقية العناوين وإضافة الكورسات الناقصة...' 
                      : '🚀 تحسين عناوين الشهادة + إضافة الكراش كورسات الناقصة تلقائياً'}
                  </button>

                  <form onSubmit={handleInjectCustomCrashCourse} className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Compass size={14} className="text-emerald-400" /> أضف عنوان كراش كورس من عندك وسيضعه الذكاء الاصطناعي في مكانه المنطقي:
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder={isLanguageMasteryMode ? "مثال: كورس الصوتيات المتقدم والربط الصوتي، أو Writing Task 2..." : "مثال: لوحة تحكم البائعين، أو الدردشة الحية WebSockets..."}
                        value={customCourseTitle}
                        onChange={(e) => setCustomCourseTitle(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />

                      <select
                        value={customPlacementMode}
                        onChange={(e) => setCustomPlacementMode(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="auto">🤖 المكان الأنسب تلقائياً (AI)</option>
                        <option value="0">في البداية (كورس 1)</option>
                        {blueprint.courses?.map((c, idx) => (
                          <option key={idx} value={String(idx + 1)}>
                            بعد الكورس {idx + 1} ({c.courseTitle.slice(0, 18)}...)
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={injectingCustom || !customCourseTitle.trim()}
                      className="w-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {injectingCustom ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      ) : (
                        <PlusCircle size={15} />
                      )}
                      {injectingCustom ? 'جاري هندسة الكراش كورس ودمجه في المسار...' : 'إضافة الكراش كورس ووضعه في المكان المناسب'}
                    </button>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1.5">⚡ أو اضغط لإضافة مرحلة متخصصة فوراً:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickGapSuggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleInjectCustomCrashCourse(null, sug)}
                            disabled={injectingCustom}
                            className="text-[10px] bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg transition-all"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>

                  {aiArchitectReport && (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 text-xs space-y-1.5 animate-fade-in-up">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> تقرير المهندس المعماري:
                        </span>
                        <button onClick={() => setAiArchitectReport(null)} className="text-slate-500 hover:text-white">
                          <X size={13} />
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{aiArchitectReport.summary}</p>
                      {aiArchitectReport.addedCourses?.length > 0 && (
                        <div className="pt-1 space-y-1">
                          {aiArchitectReport.addedCourses.map((ac, i) => (
                            <div key={i} className="text-[11px] font-bold text-amber-300">• {ac}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* الأزرار الاستراتيجية لتجميع الشهادة وتوليد ملخصات الوحدات المسبقة */}
                <div className="flex flex-col gap-2.5 mt-4">

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

                  <button
                    type="button"
                    onClick={handleBatchGenerateAllUnitsSummaries}
                    disabled={generatingAllUnitsSummaries || forgingStatus === 'forging'}
                    className="w-full bg-teal-500/15 hover:bg-teal-500 border border-teal-500/40 text-teal-300 hover:text-slate-950 font-black text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingAllUnitsSummaries ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-current"></div>
                    ) : (
                      <Target size={16} />
                    )}
                    {generatingAllUnitsSummaries
                      ? 'جاري توليد وحقن ملخصات الوحدات لجميع الكورسات...'
                      : '🎯 توليد وحقن ملخصات الوحدات لجميع الكورسات مسبقاً (حماية لحصة الـ AI)'}
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
                    <Server size={15} /> ربط ومزامنة الشهادة وجميع الكراش كورسات (مع ملخصات الوحدات) لـ CherifPlatform
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
                {blueprint.courses?.map((course, cIdx) => (
                  <div 
                    key={cIdx} 
                    className={`bg-slate-900/70 border rounded-2xl p-5 transition-all ${
                      course.isNewlyAdded 
                        ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]' 
                        : 'border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >

                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-indigo-400 font-black text-xs bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                          {course.coursePrefix || `Crash Course ${cIdx + 1}`} • {course.estimatedHours || '15 Hours'}
                        </span>
                        {course.areUnitSummariesReady && (
                          <span className="text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                            ✓ ملخصات الوحدات جاهزة
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCoursePosition(cIdx, 'up')}
                          disabled={cIdx === 0}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCoursePosition(cIdx, 'down')}
                          disabled={cIdx === blueprint.courses.length - 1}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourseFromSeries(cIdx)}
                          className="p-1 rounded bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-white mb-2">{course.courseTitle}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{course.courseDescription || course.description}</p>

                    {!course.isBlueprintReady ? (
                      <button 
                        onClick={() => handleGenerateSingleCrashBlueprint(cIdx)}
                        disabled={forgingStatus !== 'idle'}
                        className="w-full bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        {activeCourseIndex === cIdx && forgingStatus === 'generating_sub_blueprint' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        ) : (
                          <><Layers size={15} /> {isLanguageMasteryMode ? '1. هندسة وحدات هذا الكورس اللغوي (نطق + استماع + قواعد + كتابة + محاكي اختبار)' : isNoExamProjectMode ? '1. هندسة وحدات وخطوات البناء لهذه المرحلة (بدون اختبارات)' : '1. هندسة وحدات هذا الكراش كورس (5-10+ وحدات + وحدة مشروع GitHub)'}</>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-4 mt-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-black text-emerald-400">
                            📚 وحدات الكراش كورس ({course.sections?.length} وحدات):
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => forgeCourseUnitsSummaries(cIdx)}
                              disabled={generatingUnitsSummaryCourseIdx === cIdx}
                              className="text-[10px] bg-teal-900/30 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/40 px-2.5 py-1 rounded flex items-center gap-1 transition-all disabled:opacity-50"
                              title="توليد ملخصات جميع وحدات هذا الكورس في طلب واحد"
                            >
                              <Target size={11} className={generatingUnitsSummaryCourseIdx === cIdx ? 'animate-spin' : ''} />
                              {course.areUnitSummariesReady ? 'تحديث ملخصات الوحدات' : 'توليد ملخصات الوحدات'}
                            </button>

                            <button 
                              onClick={() => handleResetAndReforgeCrashCourse(cIdx)}
                              disabled={forgingStatus === 'forging' || forgingStatus === 'generating_sub_blueprint'}
                              className="text-[10px] bg-red-900/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 px-2 py-1 rounded flex items-center gap-1 transition-all disabled:opacity-50"
                            >
                              <RefreshCw size={11} /> إعادة التأليف
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                          {course.sections?.map((sec, sIdx) => (
                            <div key={sIdx} className={`border rounded-xl p-3 ${sec.isProjectUnit ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950 border-slate-800/90'}`}>
                              <h5 className={`font-bold text-xs mb-1.5 flex items-center justify-between gap-1.5 ${sec.isProjectUnit ? 'text-emerald-400' : 'text-indigo-300'}`}>
                                <span className="flex items-center gap-1.5">
                                  {sec.isProjectUnit ? <Bot size={15} /> : <ChevronLeft size={14} />} 
                                  {sec.sectionName}
                                </span>
                                {sec.unitDeepSummary && (
                                  <span className="text-[9px] bg-teal-500/15 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                                    ملخص الوحدة جاهز ✓
                                  </span>
                                )}
                              </h5>

                              {sec.unitDeepSummary && (
                                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 mb-2 text-[10px] text-slate-300 space-y-1">
                                  <p><strong className="text-amber-400">ماذا ستتقن:</strong> {sec.unitDeepSummary.whatYouLearn}</p>
                                  <p><strong className="text-emerald-400">الفائدة:</strong> {sec.unitDeepSummary.whyItMatters}</p>
                                </div>
                              )}

                              <div className="space-y-1.5">
                                {sec.lessons?.map((lesson, lIdx) => (
                                  <div 
                                    key={lIdx} 
                                    onClick={() => {
                                      if (lesson.isForged) {
                                        handleStopInteractiveAudio();
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
                            <BrainCircuit size={16} /> 
                            {isLanguageMasteryMode
                              ? '2. تأليف دروس اللغة + نصوص الاستماع والصوتيات IPA + محاكي الـ AI + الاختبارات 🌍'
                              : isNoExamProjectMode 
                                ? '2. تأليف خطوات البناء + أكواد الملفات + أوامر الـ AI Agent (بدون اختبارات 🛠️)' 
                                : '2. تأليف الدروس + الاختبارات + ملخصات الوحدات تلقائياً (ELI5 👶)'}
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
                        <div key={lIdx} onClick={() => { if (lesson.isForged) { handleStopInteractiveAudio(); setSelectedLesson(lesson); setPreviewMode('lesson'); } }} className={`p-3.5 border-b border-slate-800/50 last:border-0 flex items-center justify-between transition-colors ${lesson.isForged ? 'hover:bg-indigo-950/30 cursor-pointer' : 'opacity-70'}`}>
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
                    <BrainCircuit size={22} /> تأليف محتوى جميع الدروس + ملخصات الوحدات
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* العمود الأيسر: شاشة المعاينة المزدوجة + مشغل الصوتيات التفاعلي للغات */}
        {/* ================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6">

          {forgingStatus !== 'idle' && forgingStatus !== 'generating_sub_blueprint' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {forgingStatus === 'forging' ? <div className="animate-pulse w-3 h-3 bg-purple-500 rounded-full"></div> : <CheckCircle className="text-emerald-500" />}
                {forgingStatus === 'forging' 
                  ? (isLanguageMasteryMode ? 'الذكاء الاصطناعي يؤلف الآن دروس اللغة ونصوص الاستماع والصوتيات (IPA) والاختبارات...' : isNoExamProjectMode ? 'الذكاء الاصطناعي يبني الآن خطوات المشروع وأكواد الملفات وبرومبتات الـ AI Agent (بدون اختبارات)...' : 'الذكاء الاصطناعي يقوم بالتأليف الآن (دروس + اختبارات + ملخصات الوحدات)...') 
                  : 'تم اكتمال التأليف بنجاح'}
              </h3>

              <div className="w-full bg-slate-950 rounded-full h-4 mb-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${forgeProgress.total > 0 ? (forgeProgress.current / forgeProgress.total) * 100 : 0}%` }}></div>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span className="truncate w-3/4">{forgingStatus === 'forging' ? `جاري تأليف: ${forgeProgress.currentLessonName}` : 'جميع الخطوات وملخصات الوحدات جاهزة!'}</span>
                <span>{forgeProgress.current} / {forgeProgress.total}</span>
              </div>
            </div>
          )}

          <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col max-h-[820px]">

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
                  <BookOpen size={15} /> معاينة محتوى الدرس / الصوتيات
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

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                      <DollarSign size={18} /> ماذا يمكن للطالب أن يفعل بهذه الشهادة المهنية؟ (العائد المادي والمهني)
                    </h3>

                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">🏢 المسميات الوظيفية والفرص المؤهل لها:</p>
                      <div className="flex flex-wrap gap-2">
                        {blueprint.masterDossier.careerAndFinancialROI?.jobRoles?.map((role, rIdx) => (
                          <span key={rIdx} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-lg">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">💰 الفرص العملية والمهنية:</p>
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

                        {cg.keyTakeaways && cg.keyTakeaways.length > 0 && (
                          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                            <p className="text-[11px] font-bold text-indigo-300 mb-1.5">📚 الوحدات والمحاور التي يتقنها الطالب في هذا الكورس:</p>
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

                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
                          <GitBranch size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>التطبيق العملي والـ AI:</strong> {cg.projectAndAiRole}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )
            ) : (
              !selectedLesson ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 py-20">
                  <BookOpen size={64} className="opacity-20" />
                  <p className="font-bold">اضغط على أي درس (مكتمل باللون الأخضر) لرؤية محتواه وتجربة النطق الصوتي هنا.</p>
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
                      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                        <FileText size={16}/> 
                        {isLanguageMasteryMode ? 'الشرح اللغوي، مختبر الصوتيات (IPA)، ومحاكاة الـ AI Voice' : 'الشرح التفصيلي وبرومبتات الـ AI Agent'}
                      </h4>
                      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedLesson.content}
                      </div>
                    </div>
                  )}

                  {/* 🔊 صندوق الكود البرمجي أو مشغل الاستماع والنطق التفاعلي للغات */}
                  {selectedLesson.codeSnippet && selectedLesson.codeSnippet.trim() !== '' && (
                    <div className="bg-[#0d1117] border border-slate-800 p-5 rounded-xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-blue-400 font-bold flex items-center gap-2">
                          {isLanguageMasteryMode || selectedLesson.codeSnippet.includes('IPA:') ? (
                            <><Headphones size={18} className="text-purple-400" /> نص الاستماع التفاعلي وتدريب النطق (Shadowing Script)</>
                          ) : (
                            <><Code size={16}/> الكود البرمجي</>
                          )}
                        </h4>

                        {/* أزرار تشغيل الصوت الحقيقي بـ 3 سرعات (طبيعي 1.0x + ترديد 0.75x + تأسيسي للحروف 0.5x) */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePlayInteractiveAudio(selectedLesson.codeSnippet, 1.0)}
                            className={`text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                              isSpeakingAudio && speakingRate === 1.0
                                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                : 'bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            <Volume2 size={14} /> 🔊 سرعة المتحدث الأصلي (1.0x)
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePlayInteractiveAudio(selectedLesson.codeSnippet, 0.75)}
                            className={`text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                              isSpeakingAudio && speakingRate === 0.75
                                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                                : 'bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            <Mic size={14} /> 🐢 نطق متوسط للترديد (0.75x)
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePlayInteractiveAudio(selectedLesson.codeSnippet, 0.5)}
                            className={`text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                              isSpeakingAudio && speakingRate === 0.5
                                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            <Headphones size={14} /> 🧒 نطق بطيء للحروف والمبتدئين (0.5x)
                          </button>

                          {isSpeakingAudio && (
                            <button
                              type="button"
                              onClick={handleStopInteractiveAudio}
                              className="text-xs font-bold bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-red-500/30 flex items-center gap-1"
                            >
                              <Square size={12} /> إيقاف
                            </button>
                          )}
                        </div>
                      </div>

                      <pre className="text-emerald-400 text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed" dir="ltr">
                        <code>{selectedLesson.codeSnippet}</code>
                      </pre>

                      {selectedLesson.codeExplanation && selectedLesson.codeExplanation.trim() !== '' && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                          <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                            <Microscope size={16} /> 
                            {isLanguageMasteryMode ? 'التشريح الصوتي والسمعي واللغوي (Phonetic & Audio Anatomy)' : 'تشريح الكود (Code Anatomy)'}
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
                        <Code size={18}/> {isLanguageMasteryMode ? 'التمرين التطبيقي للكتابة والصياغة اللغوية (مع 3 تلميحات)' : 'تمرين كتابة الكود التفاعلي للطالب (مع 3 تلميحات)'}
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
                        <Flame size={16}/> {selectedLesson.type === 'unit_exam' ? 'أسئلة الاختبار النهائي للوحدة' : 'تحدي الزعيم / البوابة'}
                      </h4>
                      <p className="text-slate-400 text-xs">يحتوي على {selectedLesson.bossQuiz.length} أسئلة:</p>
                      <div className="space-y-2">
                        {selectedLesson.bossQuiz.map((q, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                            <span className="text-amber-400 font-bold ml-2">[{q.questionType === 'code' ? 'تطبيقي' : 'مفاهيمي'}]</span>
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

      {/* ========================================================================= */}
      {/* 🏛️ نافذة سجل وخزنة المشاريع الشاملة (Project History & Vault Modal) */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b1120] border border-slate-700 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70">
              <div>
                <div className="flex items-center gap-2.5">
                  <Database className="text-amber-400" size={26} />
                  <h2 className="text-2xl font-black text-white">سجل وخزنة المشاريع (Project History Vault)</h2>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    IndexedDB ♾️ سعة عميقة
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  جميع الشهادات المهنية والكورسات المحفوظة هنا محمية ضد امتلاء الذاكرة، ويمكنك الرجوع لأي منها واستكمال بنائها في أي وقت.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => importFileInputRef.current?.click()}
                  className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Upload size={15} /> استيراد ملف JSON للسجل
                </button>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="w-10 h-10 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3.5 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="ابحث في مشاريعك السابقة..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white text-xs rounded-xl py-2.5 pr-10 pl-4 outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {[
                  { id: 'all', label: `الكل (${projectHistory.length})` },
                  { id: 'starred', label: '⭐ المفضلة' },
                  { id: 'certificate', label: '🎓 الشهادات المهنية' },
                  { id: 'single', label: '⚡ كورسات منفردة' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryFilter(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      historyFilter === tab.id
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-950/40">
              {filteredHistoryProjects.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <FolderClock size={60} className="text-slate-700 mx-auto" />
                  <h3 className="text-lg font-black text-white">لا توجد مشاريع محفوظة في هذا القسم</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    اضغط على زر <strong className="text-emerald-400">"حفظ في السجل"</strong> في أعلى المختبر لحفظ أي شهادة مهنية أو كورس تعمل عليه، أو استورد ملف JSON من جهازك.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHistoryProjects.map((project) => {
                    const isCurrentlyOpen = activeProjectId === project.id;
                    const st = project.stats || computeProjectStats(project.blueprint);
                    const completionPercent = st.totalCourses > 0 ? Math.round((st.forgedCourses / st.totalCourses) * 100) : 0;

                    return (
                      <div 
                        key={project.id} 
                        className={`bg-slate-900/90 border-2 rounded-2xl p-5 flex flex-col justify-between transition-all ${
                          isCurrentlyOpen 
                            ? 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.15)]' 
                            : 'border-slate-800 hover:border-indigo-500/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                                project.isCertificateSeries 
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                              }`}>
                                {project.isCertificateSeries ? '🎓 شهادة مهنية شاملة' : '⚡ كورس منفرد'}
                              </span>
                              {isCurrentlyOpen && (
                                <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                                  مفتوح حالياً
                                </span>
                              )}
                              {st.hasDossier && (
                                <span className="text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                                  👑 وثيقة الشهادة جاهزة
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleToggleStarProject(project, e)}
                                className={`p-1.5 rounded-lg transition-colors ${project.isStarred ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-amber-400'}`}
                              >
                                <Star size={15} fill={project.isStarred ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={(e) => handleRenameProjectInHistory(project, e)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-base font-black text-white mb-1 line-clamp-2 leading-snug">
                            {project.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 mb-4 flex items-center gap-1.5">
                            <Clock size={12} /> آخر تحديث: {project.updatedAt} • الحجم: {st.sizeKB > 1024 ? `${(st.sizeKB / 1024).toFixed(2)} MB` : `${st.sizeKB} KB`}
                          </p>

                          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 mb-4 space-y-2">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-400">حالة تأليف الكورسات:</span>
                              <span className="text-emerald-400">{st.forgedCourses} / {st.totalCourses} كورس مؤلف ({completionPercent}%)</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-l from-emerald-400 to-indigo-500 h-full rounded-full transition-all"
                                style={{ width: `${completionPercent}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span>📚 إجمالي الوحدات: {st.totalUnits}</span>
                              <span>📝 إجمالي الدروس والتحديات: {st.totalLessons}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                          <button 
                            onClick={() => handleLoadProjectFromHistory(project)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow"
                          >
                            <FolderClock size={15} /> فتح واستكمال المشروع
                          </button>

                          <button 
                            onClick={() => handleDownloadJSON(project.blueprint, `VaultExport_${project.name}`)}
                            className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-2.5 rounded-xl border border-slate-700 transition-colors"
                          >
                            <Download size={15} />
                          </button>

                          <button 
                            onClick={(e) => handleDeleteProjectFromHistory(project, e)}
                            className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white p-2.5 rounded-xl transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
              <span>💡 نصيحة: يتم حفظ مشاريعك تلقائياً في قاعدة بيانات المتصفح العميقة (IndexedDB) عند اكتمال تأليف أي كورس أو وثيقة شهادة.</span>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-xl transition-colors"
              >
                إغلاق السجل
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AcademyLab2;