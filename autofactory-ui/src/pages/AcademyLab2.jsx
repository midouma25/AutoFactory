import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  BookOpen, Wand2, Layers, CheckCircle, BrainCircuit, Play, Server, ChevronLeft, 
  FileText, Code, HelpCircle, Lightbulb, Zap, TrendingUp, GraduationCap, Download, 
  Microscope, Award, Flame, Link2, Sparkles, Trophy, GitBranch, Bot, 
  Save, Clock, Trash2, RefreshCw, Briefcase, DollarSign, CheckCircle2, Eye,
  History, FolderClock, BookmarkPlus, Star, Edit3, Upload, Search, Database, X,
  PlusCircle, ArrowUp, ArrowDown, Compass
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

// دالة مساعدة لإعادة ترقيم وضبط تسلسل الكراش كورسات بعد أي إضافة أو تعديل
const reindexCoursesSequence = (coursesArray) => {
  if (!Array.isArray(coursesArray)) return [];
  return coursesArray.map((c, idx) => ({
    ...c,
    courseOrder: idx + 1,
    coursePrefix: `الكراش كورس ${idx + 1}`
  }));
};

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

  // حالات خاصة بتجميع الشهادة المهنية ومعاينتها التفصيلية
  const [previewMode, setPreviewMode] = useState('lesson'); // 'lesson' | 'certificate_dossier'
  const [generatingDossier, setGeneratingDossier] = useState(false);
  const [bundlingExisting, setBundlingExisting] = useState(false);

  // 🆕 حالات خاصة بترقية الشهادة المهنية وحقن الكراش كورسات المخصصة
  const [enhancingCert, setEnhancingCert] = useState(false);
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  const [customPlacementMode, setCustomPlacementMode] = useState('auto'); // 'auto' أو رقم الفهرس
  const [injectingCustom, setInjectingCustom] = useState(false);
  const [aiArchitectReport, setAiArchitectReport] = useState(null);

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
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'starred' | 'certificate' | 'single'
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

        setTopic(importedTitle);
        setDifficulty(parsed.isCertificateSeries ? 'pro_certificate_eli5' : 'crash_eli5');
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
          difficulty: parsed.isCertificateSeries ? 'pro_certificate_eli5' : 'crash_eli5',
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
    setAiArchitectReport(null);

    try {
      const endpoint = difficulty === 'pro_certificate_eli5' 
        ? 'http://localhost:5000/api/academy2/blueprint-certificate'
        : 'http://localhost:5000/api/academy2/blueprint1';

      const res = await axios.post(endpoint, { topic, difficulty });
      if (res.data.success) {
        setBlueprint(res.data.data);
        setActiveProjectId(null);
        setActiveProjectName(res.data.data.courseTitle || res.data.data.certificateTitle || topic);
      }
    } catch (err) {
      alert('حدث خطأ أثناء هندسة الهيكل.');
    } finally {
      setLoadingBlueprint(false);
    }
  };

  // ============================================================================
  // 🚀 2.1 جديد: زر تحسين عناوين الشهادة المهنية وإضافة الكراش كورسات الناقصة (AI Gap Filler & Optimizer)
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
        currentCourses: currentCoursesLight
      });

      if (res.data?.success && Array.isArray(res.data.data?.courses)) {
        const aiCourses = res.data.data.courses;

        // 🛡️ دمج غير مدمّر: الاحتفاظ بوحدات ودروس الكورسات المؤلفة مسبقاً!
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

          // كراش كورس جديد كلياً أضافه الذكاء الاصطناعي لسد الفجوات
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
      // 🧠 محرك ذكي مدمج يعمل فوراً في حال لم يكن مسار السيرفر مفعلاً بعد
      const existingText = blueprint.courses.map(c => c.courseTitle + ' ' + (c.description || '')).join(' ').toLowerCase();
      const missingCandidates = [];

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

      if (!existingText.includes('اختبار') && !existingText.includes('testing') && !existingText.includes('جودة')) {
        missingCandidates.push({
          insertRatio: 0.65,
          courseTitle: 'هندسة الجودة والاختبارات الآلية الذكية (Automated Testing & AI QA 🧪)',
          description: 'الفرق بين المبرمج الهاوي والمهندس المحترف هو كتابة الاختبارات؛ ستتعلم كيف تجعل الـ AI Agent يكتب معك اختبارات شاملة تضمن عدم تعطل مشروعك أبداً.',
          difficultyLevel: 'المستوى المتوسط-المتقدم: ضمان الجودة الهندسية',
          estimatedHours: '15 ساعة',
          certificateBadge: 'شهادة إتقان هندسة الاختبارات الآلية (QA & Testing)',
          githubProject: {
            projectTitle: 'منظومة اختبارات آلية متكاملة لتطبيق إنتاجي',
            projectSummary: 'كتابة Unit & Integration Tests بمساعدة AI Agent وتوثيقها على GitHub'
          },
          skills: ['Automated Testing', 'TDD', 'AI Bug Hunting', 'Debugging Mastery', 'Clean Architecture']
        });
      }

      if (!existingText.includes('saas') && !existingText.includes('دفع') && !existingText.includes('stripe') && !existingText.includes('ربح')) {
        missingCandidates.push({
          insertRatio: 0.92,
          courseTitle: 'تحويل المشاريع إلى منتجات مربحة (Micro-SaaS & Payment Gateways 💰)',
          description: 'كيف تحول ما بنيته في هذه الشهادة إلى مصدر دخل؟ شرح مبسط لربط بوابات الدفع، إدارة الاشتراكات الشهرية، وإطلاق منتجك الرقمي للعملاء.',
          difficultyLevel: 'المستوى الاحترافي: هندسة المنتجات والربح',
          estimatedHours: '18 ساعة',
          certificateBadge: 'شهادة مطور ومؤسس منتجات Micro-SaaS',
          githubProject: {
            projectTitle: 'منصة SaaS متكاملة مع نظام اشتراكات ولوحة تحكم',
            projectSummary: 'بناء وإطلاق قالب SaaS جاهز للبيع بمساعدة AI Agent على GitHub'
          },
          skills: ['Micro-SaaS Architecture', 'Payment Integration', 'Subscription Logic', 'Product Launch', 'Monetization']
        });
      }

      // إذا كانت كل هذه موجودة، نضيف كورس هندسة الأنظمة العملاقة System Design
      if (missingCandidates.length === 0) {
        missingCandidates.push({
          insertRatio: 0.85,
          courseTitle: 'تصميم الأنظمة العملاقة والتوسع المليوني (System Design & Scalability 🚀)',
          description: 'كيف تصمم نظاماً يتحمل ملايين المستخدمين دون أن ينهار؟ شرح الكاش (Caching)، موازنة الأحمال، والطوابير بأسلوب قصصي مبسط.',
          difficultyLevel: 'مستوى S-Rank: معمارية الأنظمة الكبرى',
          estimatedHours: '20 ساعة',
          certificateBadge: 'شهادة معماري الأنظمة عالية الأداء (System Architect)',
          githubProject: {
            projectTitle: 'محاكي نظام موزع عالي السرعة مع Caching',
            projectSummary: 'بناء بنية عالية الأداء بمساعدة AI Agent ورفعها على GitHub'
          },
          skills: ['System Design', 'Redis Caching', 'Load Balancing', 'High Availability', 'Scalability']
        });
      }

      // تحسين عناوين الكورسات الحالية + حقن الكورسات الناقصة في مواقعها المنطقية
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
          connectionToPrevious: `يسد الفجوة الهندسية بعد (${prevCourse?.courseTitle || 'الكورس السابق'}) ليضمن جاهزيتك لسوق العمل الاحترافي.`,
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
        summary: `قام المهندس الذكي بفحص الشهادة المهنية وصقل تسلسلها، واكتشف (${addedNames.length}) كراش كورسات جوهرية كانت ناقصة فقام بحقنها في مواقعها المنطقية داخل السلسلة!`,
        addedCourses: addedNames
      });
      await handleSaveProjectToHistory(false, true, updatedBlueprint);
      triggerToast(`✨ تم تحسين الشهادة وإضافة (${addedNames.length}) كراش كورسات ناقصة في أماكنها المناسبة!`);
    } finally {
      setEnhancingCert(false);
    }
  };

  // ============================================================================
  // 🎯 2.15 جديد: حقن كراش كورس مخصص من اختيار المستخدم في المكان المناسب تماماً
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
      // 🧠 تحديد الموقع الذكي محلياً إذا لم يكن مسار السيرفر متصلاً
      const lower = targetCustomTopic.toLowerCase();
      let autoIndex = Math.max(1, blueprint.courses.length - 1); // افتراضياً قبل مشروع التخرج النهائي
      let reason = 'تم وضعه في المرحلة المتقدمة قبل كورس التخرج النهائي ليبني الطالب على كافة الأساسيات السابقة.';

      if (lower.includes('مقدمة') || lower.includes('أساسيات') || lower.includes('مدخل') || lower.includes('html') || lower.includes('مبتدئ')) {
        autoIndex = Math.min(1, blueprint.courses.length);
        reason = 'تم وضعه في بداية المسار التأسيسي لأنه يمثل حجر زاوية مبكراً للطالب.';
      } else if (lower.includes('git') || lower.includes('linux') || lower.includes('terminal') || lower.includes('بيئة')) {
        autoIndex = Math.min(2, blueprint.courses.length);
        reason = 'تم وضعه بعد التأسيس الأولي مباشرة ليتقن الطالب أدوات العمل قبل الغوص في المشاريع الكبرى.';
      } else if (lower.includes('react') || lower.includes('واجهة') || lower.includes('tailwind') || lower.includes('frontend')) {
        autoIndex = Math.floor(blueprint.courses.length * 0.45);
        reason = 'تم وضعه في منتصف السلسلة (مرحلة بناء الواجهات والتفاعل) ليتناغم مع التسلسل البيداغوجي.';
      } else if (lower.includes('database') || lower.includes('قاعدة بيانات') || lower.includes('sql') || lower.includes('mongo') || lower.includes('api') || lower.includes('node')) {
        autoIndex = Math.floor(blueprint.courses.length * 0.65);
        reason = 'تم وضعه في مرحلة هندسة الخوادم والبيانات ليربط الواجهات بالمنطق الخلفي.';
      }

      const finalIndex = customPlacementMode === 'auto' ? autoIndex : parseInt(customPlacementMode, 10);
      const prevCourse = finalIndex > 0 ? blueprint.courses[finalIndex - 1] : null;

      const craftedCourse = {
        courseTitle: `${targetCustomTopic} (بأسلوب التبسيط القصصي الشيق 👶)`,
        courseDescription: `كراش كورس مخصص يأخذك من الصفر في (${targetCustomTopic}) بأسلوب مبدأ فاينمان المبسط، مع تطبيقات كودية تفاعلية ومشروع عملي متكامل يربطه بمسار الشهادة المهنية.`,
        description: `كراش كورس مخصص يأخذك من الصفر في (${targetCustomTopic}) بأسلوب مبدأ فاينمان المبسط، مع تطبيقات كودية تفاعلية ومشروع عملي متكامل يربطه بمسار الشهادة المهنية.`,
        difficultyLevel: finalIndex < 3 ? 'المستوى التأسيسي المبسط' : 'المستوى التطبيقي المتقدم',
        estimatedHours: '16 ساعة',
        certificateBadge: `شهادة إتقان: ${targetCustomTopic}`,
        connectionToPrevious: prevCourse 
          ? `يبني مباشرة على ما أنجزناه في (${prevCourse.courseTitle}) ليضيف مهارة (${targetCustomTopic}) إلى ترسانتك.` 
          : 'نقطة انطلاق تأسيسية مميزة في بداية الشهادة المهنية.',
        githubProject: {
          projectTitle: `مشروع تطبيقي متكامل في ${targetCustomTopic}`,
          projectSummary: `بناء مشروع عملي يطبق مفاهيم (${targetCustomTopic}) خطوة بخطوة بمساعدة AI Agent ورفعه على GitHub.`
        },
        skills: [targetCustomTopic, 'Practical Implementation', 'AI-Assisted Coding', 'GitHub Portfolio'],
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
        summary: reason,
        addedCourses: [`الكراش كورس ${finalIndex + 1}: ${craftedCourse.courseTitle}`]
      });
      await handleSaveProjectToHistory(false, true, updatedBlueprint);
      triggerToast(`🎯 تمت إضافة الكراش كورس المخصص في الترتيب (${finalIndex + 1}) بنجاح!`);
    } finally {
      setInjectingCustom(false);
    }
  };

  // تحريك كراش كورس لأعلى أو لأسفل يدوياً أو حذفه من السلسلة
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
          projectSummary: 'بناء المشروع خطوة بخطوة بمساعدة AI Agent ورفعه على GitHub'
        },
        skills: c.skills || [],
        unitsCount: unitsList.length || 8,
        lessonsCount: lessonsInCourse,
        unitsList
      };
    });

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

    await handleSaveProjectToHistory(false, true, updatedBlueprint);
    alert('👑 تم إنشاء وتجميع الوثيقة التفصيلية الشاملة للشهادة المهنية وحفظها في سجل المشاريع! يمكنك مراجعتها الآن في شاشة المعاينة على اليسار.');
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
      setActiveProjectId(null);
      setActiveProjectName(customCertName);
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

    await handleSaveProjectToHistory(false, true, updatedCert);
    triggerToast(`✅ اكتمل تأليف الكورس ${cIdx + 1} وتم حفظ تقدمك في سجل المشاريع!`);
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
    await handleSaveProjectToHistory(false, true, updatedBlueprint);
    alert('🎉 اكتمل تأليف الكورس وبوابات الزعماء واختبارات الوحدات بالكامل وتم حفظه في السجل!');
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

  // اقتراحات سريعة لإضافة كراش كورسات بضغطة زر
  const quickGapSuggestions = [
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

      {/* 🎨 الهيدر مع لوحة الحفظ وسجل المشاريع (Save & History Vault Bar) */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-800 pb-6 gap-5">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BrainCircuit className="text-indigo-500" size={40} /> مختبر الأكاديمية <span className="text-indigo-500 bg-indigo-500/10 text-lg px-3 py-1 rounded-lg border border-indigo-500/20">V2 (SUPER ARCHITECT)</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold">
            مصنع الشهادات المهنية الخارقة (9-15+ كراش كورس 👶) + مُرقّي المناهج الذكي وحاقن الكورسات + خزنة المشاريع 🗄️
          </p>
        </div>

        {/* 🛡️ شريط التحكم في الحفظ، النسخ، استيراد JSON، وسجل التاريخ (History) */}
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
            title="حفظ هذا المشروع في سجل المشاريع"
          >
            <Save size={16} />
            <span>{activeProjectId ? 'حفظ التعديلات' : 'حفظ في السجل'}</span>
          </button>

          {blueprint && (
            <button 
              onClick={() => handleSaveProjectToHistory(true)} 
              className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              title="حفظ كنسخة جديدة مستقلة في السجل (Snapshot)"
            >
              <BookmarkPlus size={16} />
              <span className="hidden sm:inline">نسخة جديدة</span>
            </button>
          )}

          <button 
            onClick={() => setShowHistoryModal(true)}
            className="bg-amber-500/15 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            title="تصفح واسترجاع جميع المشاريع السابقة"
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
            title="استيراد ملف JSON محفوظ على جهازك"
          >
            <Upload size={15} />
            <span className="hidden md:inline">استيراد JSON</span>
          </button>

          {hasDraft && !blueprint && (
            <button 
              onClick={loadDraft}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              title="استرجاع آخر مسودة طوارئ"
            >
              <RefreshCw size={15} /> استرجاع المسودة
            </button>
          )}

          {blueprint && (
            <button 
              onClick={clearDraft}
              className="bg-red-500/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white p-2.5 rounded-xl transition-all"
              title="إفراغ مساحة العمل الحالية لبدء مشروع جديد"
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

                {/* ===================================================================== */}
                {/* 🆕🧠 قسم الترقية الذكية وحقن الكراش كورسات المخصصة في المكان المناسب */}
                {/* ===================================================================== */}
                <div className="bg-slate-950/90 border-2 border-indigo-500/30 rounded-2xl p-4 mb-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black text-indigo-300 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-400" /> مختبر تطوير وتوسيع الشهادة المهنية (AI Optimizer)
                    </h3>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30">
                      غير مدمّر للدروس المؤلفة 🛡️
                    </span>
                  </div>

                  {/* الميزة 1: زر تحسين العناوين وإضافة الكراش كورسات الناقصة تلقائياً */}
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

                  {/* الميزة 2: خانة إضافة كراش كورس مخصص من اختيارك ووضعه في المكان المناسب */}
                  <form onSubmit={handleInjectCustomCrashCourse} className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Compass size={14} className="text-emerald-400" /> أضف عنوان كراش كورس من عندك وسيضعه الذكاء الاصطناعي في مكانه المنطقي:
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="مثال: GraphQL، أو WebSockets، أو أتمتة الاختبارات..."
                        value={customCourseTitle}
                        onChange={(e) => setCustomCourseTitle(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />

                      <select
                        value={customPlacementMode}
                        onChange={(e) => setCustomPlacementMode(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer"
                        title="أين تريد وضع هذا الكراش كورس؟"
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

                    {/* شرائح اقتراحات سريعة بضغطة واحدة */}
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1.5">⚡ أو اضغط لإضافة كورس متخصص فوراً:</span>
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

                  {/* تقرير المهندس الذكي بعد الإضافة أو التحسين */}
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

                {/* الأزرار الاستراتيجية لتجميع الشهادة وتوليد شرحها التفصيلي */}
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
                        {course.isNewlyAdded && (
                          <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles size={11} /> مضاف حديثاً
                          </span>
                        )}
                      </div>

                      {/* أزرار تحريك الكورس لأعلى أو أسفل أو حذفه من السلسلة */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCoursePosition(cIdx, 'up')}
                          disabled={cIdx === 0}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                          title="تحريك الكورس لأعلى"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCoursePosition(cIdx, 'down')}
                          disabled={cIdx === blueprint.courses.length - 1}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                          title="تحريك الكورس لأسفل"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourseFromSeries(cIdx)}
                          className="p-1 rounded bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white"
                          title="حذف هذا الكورس من السلسلة"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      {course.difficultyLevel && (
                        <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          📈 {course.difficultyLevel}
                        </span>
                      )}
                      <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <Award size={12}/> {course.certificateBadge || `شهادة إتمام الكورس ${cIdx + 1}`}
                      </span>
                    </div>

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
                                title="تثبيت في المفضلة"
                              >
                                <Star size={15} fill={project.isStarred ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={(e) => handleRenameProjectInHistory(project, e)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="إعادة تسمية المشروع"
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
                            title="تحميل كملف JSON"
                          >
                            <Download size={15} />
                          </button>

                          <button 
                            onClick={(e) => handleDeleteProjectFromHistory(project, e)}
                            className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white p-2.5 rounded-xl transition-colors"
                            title="حذف من السجل"
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