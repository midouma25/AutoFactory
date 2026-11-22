// [AUTO-FUNNEL ENGINE - PART 2/3 V1 - CAMPAIGN MANAGER HUB]
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Megaphone, Plus, Trash2, Power, ExternalLink, BookOpen, RefreshCw,
  Edit3, Check, X, Sparkles, Copy
} from 'lucide-react';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [platformCourses, setPlatformCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [publicReply, setPublicReply] = useState('تم يا {username} 🚀 تفقد رسائلك في الخاص!');
  const [dmMessage, setDmMessage] = useState(
    'مرحباً {username}! 👋\nتفضل رابط الكورس والشرح التطبيقي الكامل الذي طلبته:\n\nhttps://your-link.com'
  );
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/campaigns');
      if (res.data?.success) {
        setCampaigns(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setCampaigns(res.data);
      }
    } catch (e) {
      console.error('Error fetching campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/funnel/platform-courses');
      if (res.data?.success) {
        setPlatformCourses(res.data.courses || []);
        return;
      }
    } catch (_) {
      try {
        const directRes = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (directRes.data?.success) {
          const mapped = (directRes.data.courses || []).map(c => ({
            ...c,
            courseUrl: `http://localhost:5173/classroom/${c._id}`
          }));
          setPlatformCourses(mapped);
        }
      } catch (err) {
        console.warn('Could not load courses from 5001');
      }
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchPlatformCourses();
  }, []);

  const handleSelectCourseForDM = (courseIdVal) => {
    setSelectedCourseId(courseIdVal);
    const found = platformCourses.find(c => String(c._id) === String(courseIdVal));
    if (found && found.courseUrl) {
      setDmMessage(
        `مرحباً {username}! 👋🚀\n\nتفضل رابط الشرح التطبيقي (${found.title}) على منصتنا:\n${found.courseUrl}\n\nقراءة وتطبيقاً ممتعاً! 💡`
      );
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!keyword.trim() || !publicReply.trim() || !dmMessage.trim()) {
      return alert('⚠️ يرجى ملء جميع الحقول المطلوبة!');
    }

    const foundCourse = platformCourses.find(c => String(c._id) === String(selectedCourseId));

    try {
      const payload = {
        keyword: keyword.trim(),
        public_reply: publicReply.trim(),
        dm_message: dmMessage.trim(),
        course_id: foundCourse?._id || '',
        course_title: foundCourse?.title || '',
        course_url: foundCourse?.courseUrl || ''
      };

      const res = await axios.post('http://localhost:5000/api/campaigns', payload);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setKeyword('');
        setSelectedCourseId('');
        setEditingCampaignId(null);
        fetchCampaigns();
        alert('🎯 تم حفظ وتفعيل الحملة التسويقية بنجاح!');
      }
    } catch (err) {
      alert('❌ حدث خطأ أثناء حفظ الحملة (تأكد من عدم تكرار نفس الكلمة المفتاحية).');
    }
  };

  const handleStartEdit = (camp) => {
    setEditingCampaignId(camp._id);
    setKeyword(camp.keyword || '');
    setPublicReply(camp.public_reply || '');
    setDmMessage(camp.dm_message || '');
    setSelectedCourseId(camp.course_id || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCampaignId(null);
    setKeyword('');
    setSelectedCourseId('');
    setPublicReply('تم يا {username} 🚀 تفقد رسائلك في الخاص!');
    setDmMessage('مرحباً {username}! 👋\nتفضل رابط الكورس والشرح التطبيقي الكامل الذي طلبته:\n\nhttps://your-link.com');
  };

  const handleToggleCampaign = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/campaigns/${id}/toggle`);
      fetchCampaigns();
    } catch (e) {
      try {
        await axios.put(`http://localhost:5000/api/campaigns/${id}/toggle`);
        fetchCampaigns();
      } catch (_) {}
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('🗑️ هل أنت متأكد من حذف هذه الحملة التسويقية؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      fetchCampaigns();
    } catch (e) {}
  };

  const handleResetPlatformCourses = async (resetMode) => {
    const modeLabel =
      resetMode === 'capsules_only'
        ? 'مسح الكورسات المصغرة (كبسولات الكاروسيل) فقط مع الإبقاء على الشهادات المهنية الكبرى'
        : 'إعادة تهيئة شاملة ومسح جميع الكورسات في منصة Cherif-Platform (5001)';

    if (!window.confirm(`⚠️ تأكيد إداري:\nهل أنت متأكد من: ${modeLabel}؟`)) return;

    setResetLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/funnel/platform-reset', { resetMode });
      if (res.data?.success) {
        alert(`✅ تمت العملية بنجاح! تم حذف (${res.data.deletedCount || 0}) كورس من المنصة.`);
        fetchPlatformCourses();
      }
    } catch (error) {
      alert('❌ تعذر الاتصال بسيرفر المنصة (5001) لتنفيذ إعادة التهيئة.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-slate-200 p-6 space-y-8">
      {/* الهيدر وأزرار إدارة منصة Cherif-Platform */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Megaphone className="text-purple-400" size={34} /> مدير الحملات والردود الذكية
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            إدارة الكلمات المفتاحية وربط تعليقات إنستغرام وفيسبوك بروابط الكورسات التطبيقية على منصة Cherif-Platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
          <button
            type="button"
            onClick={fetchPlatformCourses}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <RefreshCw size={14} /> تحديث كورسات المنصة ({platformCourses.length})
          </button>

          <button
            type="button"
            disabled={resetLoading}
            onClick={() => handleResetPlatformCourses('capsules_only')}
            className="bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-black px-3 py-2 rounded-xl transition-all"
          >
            🧹 مسح كبسولات الكاروسيل فقط
          </button>

          <button
            type="button"
            disabled={resetLoading}
            onClick={() => handleResetPlatformCourses('all')}
            className="bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-black px-3 py-2 rounded-xl transition-all"
          >
            ⚠️ تصفير شامل لـ Cherif-Platform
          </button>
        </div>
      </div>

      {/* نموذج إنشاء أو تعديل حملة تسويقية */}
      <form
        onSubmit={handleSaveCampaign}
        className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-purple-300 flex items-center gap-2">
            🎯 {editingCampaignId ? 'تعديل الحملة التسويقية' : 'إنشاء حملة تسويقية جديدة'}
          </h2>
          {editingCampaignId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <X size={14} /> إلغاء التعديل
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              الكلمة المفتاحية (Keyword) — يمكنك وضع عدة كلمات مفصولة بفاصلة:
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="مثال: تداول, أدوات, استوديو"
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-400 mb-2">
              🎓 اختر كورساً من Cherif-Platform لإدراج رابطه تلقائياً في رسالة الخاص:
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleSelectCourseForDM(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-4 py-3 text-xs font-bold text-emerald-200 outline-none cursor-pointer"
            >
              <option value="">-- اختر كورساً من المنصة لإدراج رابطه (اختياري) --</option>
              {platformCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              💬 الرد على التعليق (العام):{' '}
              <span className="text-slate-500">استخدم {'{username}'} لذكر اسم العميل</span>
            </label>
            <textarea
              rows={4}
              value={publicReply}
              onChange={(e) => setPublicReply(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              🚀 رسالة الخاص (DM):{' '}
              <span className="text-slate-500">استخدم {'{username}'} لجعل الرسالة شخصية</span>
            </label>
            <textarea
              rows={4}
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-sm text-white outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> {editingCampaignId ? 'حفظ التعديلات على الحملة' : 'إطلاق الحملة وحفظها'}
        </button>
      </form>

      {/* قائمة الحملات المسجلة */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>📋 الحملات التسويقية النشطة ({campaigns.length})</span>
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400">جاري تحميل الحملات...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            لا توجد حملات مسجلة حالياً. أنشئ حملة من الأعلى أو من داخل أي استوديو كاروسيل!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp._id}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-3.5 transition-all ${
                  camp.is_active ? 'border-emerald-500/40' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-xl text-sm font-black">
                      🔑 {camp.keyword}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      🎯 الاصطياد: {camp.usage_count || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(camp)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="تعديل الحملة"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCampaign(camp._id)}
                      className={`p-2 rounded-lg border ${
                        camp.is_active
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title={camp.is_active ? 'إيقاف مؤقت' : 'تفعيل'}
                    >
                      <Power size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(camp._id)}
                      className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white"
                      title="حذف الحملة"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {camp.course_url && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-emerald-300 font-bold truncate flex items-center gap-1.5">
                      <BookOpen size={14} className="shrink-0" />
                      <span className="truncate">
                        {camp.course_title || 'كورس تطبيقي مرتبط على Cherif-Platform'}
                      </span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(camp.course_url, camp._id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"
                      >
                        <Copy size={11} /> {copiedId === camp._id ? 'تم!' : 'نسخ'}
                      </button>
                      <a
                        href={camp.course_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1"
                      >
                        <span>فتح الكورس</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  <strong className="text-indigo-400 block mb-1">رسالة الخاص (DM):</strong>
                  {camp.dm_message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManager;
