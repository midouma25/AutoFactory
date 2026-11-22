// [AUTO-FUNNEL ENGINE - PART 2/3 V3 - DEDICATED STUDIO ADAPTER PANEL]
import React, { useState } from 'react';
import axios from 'axios';
import {
  GraduationCap, Sparkles, Rocket, CheckCircle2, Copy, ExternalLink,
  Megaphone, BookOpen, ChevronDown, ChevronUp, Code, HelpCircle, Check, Layers
} from 'lucide-react';

const STUDIO_META_CONFIG = {
  template_binary: {
    label: 'المقارنة الثنائية (أداة قديمة ❌ ضد أداة ذكية ✅)',
    endpoint: 'http://localhost:5000/api/funnel/forge/binary-comparison',
    buttonLabel: '⚖️ 1. توليد كبسولة المقارنة الثنائية والروابط البديلة + إعداد الحملة',
    badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
  },
  template_triple: {
    label: 'المقارنة الثلاثية (سيئ 🔴 / جيد 🟡 / احترافي 🟢 🏆)',
    endpoint: 'http://localhost:5000/api/funnel/forge/triple-comparison',
    buttonLabel: '🏆 1. توليد كبسولة المقارنة الثلاثية (الجيد والاحترافي) + إعداد الحملة',
    badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30'
  },
  roadmap_steps: {
    label: 'صانع الخطوات وخرائط الطريق (Step-by-Step Roadmap)',
    endpoint: 'http://localhost:5000/api/funnel/forge/roadmap-steps',
    buttonLabel: '🗺️ 1. تحويل خطوات خريطة الطريق إلى دروس تطبيقية + إعداد الحملة',
    badgeColor: 'text-teal-300 bg-teal-500/15 border-teal-500/30'
  },
  business_saas: {
    label: 'مصنع الأرباح ومشاريع الـ SaaS (Monetization & Tech Stack)',
    endpoint: 'http://localhost:5000/api/funnel/forge/business-saas',
    buttonLabel: '💰 1. توليد كبسولة هندسة الأرباح وبناء الـ SaaS + إعداد الحملة',
    badgeColor: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30'
  },
  story_lab: {
    label: 'استوديو القصص ودراسات الحالة (Actionable Playbook)',
    endpoint: 'http://localhost:5000/api/funnel/forge/story-playbook',
    buttonLabel: '📖 1. تحويل القصة/دراسة الحالة إلى دليل عمل تطبيقي + إعداد الحملة',
    badgeColor: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30'
  },
  commercial_lab: {
    label: 'استوديو الإعلانات والمشاريع التجارية (Product & B2B Showcase)',
    endpoint: 'http://localhost:5000/api/funnel/forge/commercial-showcase',
    buttonLabel: '🎥 1. توليد صفحة العرض التفاعلي ودليل النظام + إعداد الحملة',
    badgeColor: 'text-orange-300 bg-orange-500/15 border-orange-500/30'
  }
};

const CarouselCourseFunnelPanel = ({
  topic = '',
  studioType = 'template_binary',
  slides = [],
  igCaption = '',
  setIgCaption = null,
  fbCaption = '',
  setFbCaption = null
}) => {
  const [generatingCourse, setGeneratingCourse] = useState(false);
  const [deployingFunnel, setDeployingFunnel] = useState(false);
  const [courseBlueprint, setCourseBlueprint] = useState(null);
  const [campaignDraft, setCampaignDraft] = useState({
    keyword: '',
    public_reply: 'تم يا {username} 🚀 أرسلت لك رابط الكبسولة التطبيقية والروابط المباشرة في رسائلك الخاصة (DM) الآن!',
    dm_message: 'مرحباً {username}! 👋🚀\n\nتفضل رابط الكبسولة التطبيقية والروابط المشروحة في المنشور:\n\n{{COURSE_URL}}',
    suggestedCaptionCTA: ''
  });
  const [expandedLessonIdx, setExpandedLessonIdx] = useState(0);
  const [deployedResult, setDeployedResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [captionUpdatedBadge, setCaptionUpdatedBadge] = useState(false);

  const studioCfg = STUDIO_META_CONFIG[studioType] || STUDIO_META_CONFIG.template_binary;

  const handleGenerateDedicatedCourse = async () => {
    if (!topic && (!slides || slides.length === 0)) {
      return alert('⚠️ يرجى كتابة فكرة الموضوع أو توليد شرائح الكاروسيل أولاً!');
    }
    setGeneratingCourse(true);
    setDeployedResult(null);
    setCaptionUpdatedBadge(false);
    try {
      const res = await axios.post(studioCfg.endpoint, {
        topic,
        studioType,
        slides,
        igCaption,
        fbCaption
      });
      if (res.data?.success && res.data.data) {
        setCourseBlueprint(res.data.data.courseBlueprint);
        setCampaignDraft(res.data.data.campaignDraft);
        setExpandedLessonIdx(0);
      }
    } catch (error) {
      alert('❌ تعذر توليد الكبسولة المخصصة. تأكد من تشغيل سيرفر AutoFactory (Port 5000).');
    } finally {
      setGeneratingCourse(false);
    }
  };

  const handleLessonFieldChange = (lessonIdx, field, value) => {
    if (!courseBlueprint || !courseBlueprint.blueprint?.[0]?.lessons) return;
    const updatedBp = JSON.parse(JSON.stringify(courseBlueprint));
    updatedBp.blueprint[0].lessons[lessonIdx][field] = value;
    setCourseBlueprint(updatedBp);
  };

  const handleInsertVariable = (field, variableStr) => {
    setCampaignDraft(prev => ({
      ...prev,
      [field]: ((prev[field] || '') + ' ' + variableStr).trim()
    }));
  };

  const handleDeployFunnel = async () => {
    if (!courseBlueprint || !campaignDraft.keyword.trim()) {
      return alert('⚠️ يرجى توليد الكبسولة والتأكد من الكلمة المفتاحية أولاً!');
    }
    setDeployingFunnel(true);
    try {
      const res = await axios.post('http://localhost:5000/api/funnel/deploy-course-and-campaign', {
        courseBlueprint,
        campaignDraft,
        studioType,
        carouselTopic: topic || courseBlueprint.courseTitle,
        slides: courseBlueprint.structuredSlides || slides
      });
      if (res.data?.success) {
        setDeployedResult(res.data);
        const primaryKw = campaignDraft.keyword.split(/[،,|]/)[0].trim();
        const ctaLine = campaignDraft.suggestedCaptionCTA || (
          '🎁 للحصول على الشرح التطبيقي الكامل والروابط المباشرة، علق بكلمة "' + primaryKw + '" وسأرسل لك رابط الكبسولة التفاعلية في الخاص فوراً! 👇'
        );
        let didUpdate = false;
        if (typeof setIgCaption === 'function') {
          const curIg = (igCaption || '').trim();
          if (!curIg.includes(primaryKw)) {
            setIgCaption(curIg ? (curIg + '\n\n' + ctaLine) : ctaLine);
            didUpdate = true;
          }
        }
        if (typeof setFbCaption === 'function') {
          const curFb = (fbCaption || '').trim();
          if (!curFb.includes(res.data.courseUrl)) {
            const fbLine = '🔗 رابط الكبسولة التفاعلية والروابط المباشرة لهذا المنشور:\n' + res.data.courseUrl;
            setFbCaption(curFb ? (curFb + '\n\n' + fbLine) : fbLine);
            didUpdate = true;
          }
        }
        if (didUpdate) setCaptionUpdatedBadge(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || '❌ تعذر رفع الكبسولة إلى سيرفر 5001.');
    } finally {
      setDeployingFunnel(false);
    }
  };

  const handleCopyCourseUrl = () => {
    if (!deployedResult?.courseUrl) return;
    navigator.clipboard.writeText(deployedResult.courseUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const lessonsList = courseBlueprint?.blueprint?.[0]?.lessons || [];
  const structuredItems = courseBlueprint?.structuredSlides || slides.filter(s => s && s.type !== "cta") || [];

  return (
    <div dir="rtl" className="mt-10 bg-gradient-to-br from-slate-900 via-[#0a1226] to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_45px_rgba(16,185,129,0.14)] space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/90 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
              <Sparkles size={13} /> محرك القمع التخصصي المستقل (Carousel ➔ CapsuleClassroom ➔ DM Bot)
            </span>
            <span className={"text-[11px] px-3 py-1 rounded-full font-black border " + studioCfg.badgeColor}>
              مسار التوليد المخصص: {studioCfg.label}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5 pt-1">
            <GraduationCap className="text-emerald-400 shrink-0" size={28} />
            <span>بناء كبسولة تمهيدية مخصصة لهذا الاستوديو في قاعة الكبسولات المستقلة (/capsule/:id)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            يقرأ هذا المسار شرائح ({studioCfg.label}) حرفياً ويصمم كبسولة تفاعلية مستقلة عن صفحة الأكاديمية لتكون بوابة تعريفية تقود المتابعين نحو شهاداتك المهنية!
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateDedicatedCourse}
          disabled={generatingCourse}
          className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {generatingCourse ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              <span>جاري هندسة كبسولة ({studioCfg.label})...</span>
            </>
          ) : (
            <>
              <BookOpen size={18} />
              <span>{courseBlueprint ? '🔄 إعادة توليد الكبسولة المخصصة' : studioCfg.buttonLabel}</span>
            </>
          )}
        </button>
      </div>

      {/* شريط معاينة الأدوات أو الشرائح الملتقطة من هذا الاستوديو */}
      {structuredItems.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
            <Layers size={14} /> عناصر الشرائح المربوطة بالكبسولة ({structuredItems.length} محاور):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {structuredItems.slice(0, 6).map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <div className="font-black text-white truncate">{idx + 1}. {item.category || item.title || ("المحور " + (idx + 1))}</div>
                {studioType === "template_binary" && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-rose-400 line-through">❌ {item.badTool}</span>
                    <span className="text-emerald-400 font-black">✅ {item.goodTool}</span>
                  </div>
                )}
                {studioType === "template_triple" && (
                  <div className="flex items-center justify-between text-[10px] pt-1 gap-1">
                    <span className="text-rose-400">🔴 {item.badTool}</span>
                    <span className="text-amber-300">🟡 {item.goodTool}</span>
                    <span className="text-emerald-400 font-black">🏆 {item.proTool}</span>
                  </div>
                )}
                {(studioType === "roadmap_steps" || studioType === "business_saas") && item.toolName && (
                  <div className="text-emerald-300 font-bold text-[11px]">🛠️ الأداة: {item.toolName}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {courseBlueprint && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <BookOpen size={16} /> محطات الكبسولة الجاهزة للرفع ({lessonsList.length} محطات تطبيقية):
              </span>
              <span className="text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                تُعرض في قاعة الكبسولات المستقلة (/capsule/:id)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">عنوان الكبسولة التمهيدية:</label>
                <input
                  type="text"
                  value={courseBlueprint.courseTitle || ""}
                  onChange={(e) => setCourseBlueprint({ ...courseBlueprint, courseTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">وصف الكبسولة:</label>
                <input
                  type="text"
                  value={courseBlueprint.courseDescription || ""}
                  onChange={(e) => setCourseBlueprint({ ...courseBlueprint, courseDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {lessonsList.map((lesson, idx) => {
                const isOpen = expandedLessonIdx === idx;
                return (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedLessonIdx(isOpen ? -1 : idx)}
                      className="w-full p-3.5 flex items-center justify-between text-right hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-black text-white flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{lesson.title}</span>
                      </span>
                      {isOpen ? <ChevronUp size={16} className="text-emerald-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3 text-xs">
                        <input
                          type="text"
                          value={lesson.title || ""}
                          onChange={(e) => handleLessonFieldChange(idx, "title", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none"
                        />
                        <textarea
                          rows={5}
                          value={lesson.content || ""}
                          onChange={(e) => handleLessonFieldChange(idx, "content", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/90 border border-purple-500/35 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-black text-purple-300 flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                <Megaphone size={16} /> إعدادات حملة الرد التلقائي (Campaign Manager):
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">الكلمة المفتاحية (Keyword):</label>
                <input
                  type="text"
                  value={campaignDraft.keyword}
                  onChange={(e) => setCampaignDraft({ ...campaignDraft, keyword: e.target.value })}
                  className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3.5 py-2.5 text-sm font-black text-amber-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">الرد على التعليق العام (Public Reply):</label>
                <input
                  type="text"
                  value={campaignDraft.public_reply}
                  onChange={(e) => setCampaignDraft({ ...campaignDraft, public_reply: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">رسالة الخاص (DM Message):</label>
                <textarea
                  rows={4}
                  value={campaignDraft.dm_message}
                  onChange={(e) => setCampaignDraft({ ...campaignDraft, dm_message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleDeployFunnel}
                disabled={deployingFunnel}
                className="w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm py-4 px-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Rocket size={18} />
                <span>{deployingFunnel ? 'جاري رفع الكبسولة وتفعيل الحملة...' : '🚀 2. رفع الكبسولة إلى (/capsule/:id) + تفعيل الكلمة في مدير الحملات'}</span>
              </button>

              {deployedResult && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> تم نشر الكبسولة في القاعة المستقلة!
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                      🔑 الكلمة: {deployedResult.campaign?.keyword}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-lg p-2" dir="ltr">
                    <span className="text-[11px] text-amber-300 truncate flex-1 font-mono">{deployedResult.courseUrl}</span>
                    <button type="button" onClick={handleCopyCourseUrl} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1">
                      <Copy size={12} /> {copiedLink ? 'تم!' : 'نسخ'}
                    </button>
                    <a href={deployedResult.courseUrl} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1">
                      <ExternalLink size={12} /> فتح الكبسولة
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselCourseFunnelPanel;
