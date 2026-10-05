import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Plus, Trash2, Power, MessageCircle, Send, Loader2, Activity } from 'lucide-react';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // حالة النموذج (Form State)
  const [formData, setFormData] = useState({
    keyword: '',
    public_reply: 'تم يا {username} 🚀 تفقد رسائلك في الخاص!',
    dm_message: 'مرحباً {username}! تفضل الرابط الذي طلبته: \n\nhttps://your-link.com'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الحملات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.keyword) return alert('الرجاء كتابة الكلمة المفتاحية!');
    
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/campaigns', {
        keyword: formData.keyword.toLowerCase().trim(),
        public_reply: formData.public_reply,
        dm_message: formData.dm_message
      });
      
      if (res.data.success) {
        setShowForm(false);
        setFormData({ ...formData, keyword: '' }); // تصفير الكلمة فقط
        fetchCampaigns(); // تحديث القائمة
      }
    } catch (error) {
      console.error(error);
      alert('خطأ! ربما الكلمة المفتاحية مستخدمة في حملة أخرى.');
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/campaigns/${id}/toggle`);
      fetchCampaigns();
    } catch (error) {
      alert('خطأ في تغيير حالة الحملة');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الحملة؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      fetchCampaigns();
    } catch (error) {
      alert('خطأ في الحذف');
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* الترويسة */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
            <Megaphone size={36} className="text-purple-500" />
            مدير الحملات والردود الذكية
          </h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/40"
          >
            {showForm ? 'إلغاء' : <><Plus size={20} /> إضافة حملة جديدة</>}
          </button>
        </div>

        {/* نموذج الإضافة */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-2xl border border-purple-500/30 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-6 text-purple-300">🎯 إنشاء حملة تسويقية جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-gray-400 font-bold mb-2 text-sm">الكلمة المفتاحية (Keyword):</label>
                <input 
                  type="text" 
                  value={formData.keyword}
                  onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                  placeholder="مثال: تداول، أدوات، استوديو"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">
                    <MessageCircle size={16} className="inline mr-1 text-blue-400"/> الرد على التعليق (العام):
                  </label>
                  <p className="text-xs text-gray-500 mb-2">استخدم <span className="text-purple-400">{"{username}"}</span> لذكر اسم العميل.</p>
                  <textarea 
                    value={formData.public_reply}
                    onChange={(e) => setFormData({...formData, public_reply: e.target.value})}
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-2 text-sm">
                    <Send size={16} className="inline mr-1 text-emerald-400"/> رسالة الخاص (DM):
                  </label>
                  <p className="text-xs text-gray-500 mb-2">استخدم <span className="text-purple-400">{"{username}"}</span> لجعل الرسالة شخصية.</p>
                  <textarea 
                    value={formData.dm_message}
                    onChange={(e) => setFormData({...formData, dm_message: e.target.value})}
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                  إطلاق الحملة وحفظها
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة الحملات (Cards Grid) */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">⏳ جاري تحميل الحملات...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign._id} className={`p-6 rounded-2xl border transition-all ${campaign.is_active ? 'bg-gray-800 border-gray-700 hover:border-purple-500/50' : 'bg-gray-800/50 border-red-900/30 opacity-75'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.is_active ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}>
                      {campaign.is_active ? 'نشطة 🟢' : 'متوقفة 🔴'}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-3 flex items-center gap-2">
                      "{campaign.keyword}"
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2" title="عدد الأشخاص الذين استخدموا الكلمة">
                      <Activity size={16} className="text-blue-400"/>
                      <span className="text-xl font-bold text-white">{campaign.usage_count}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleToggle(campaign._id)} className={`p-2 rounded-lg transition-colors ${campaign.is_active ? 'bg-gray-700 hover:bg-red-600 text-gray-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`} title={campaign.is_active ? "إيقاف الحملة" : "تشغيل الحملة"}>
                        <Power size={16} />
                      </button>
                      <button onClick={() => handleDelete(campaign._id)} className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-300 transition-colors" title="حذف نهائي">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4 text-sm">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-blue-400 font-bold mb-1 flex items-center gap-1"><MessageCircle size={12}/> الرد العام:</p>
                    <p className="text-gray-300">{campaign.public_reply}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-1"><Send size={12}/> رسالة الخاص:</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{campaign.dm_message}</p>
                  </div>
                </div>

              </div>
            ))}
            {campaigns.length === 0 && !showForm && (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                لا توجد حملات حالياً. ابدأ بإنشاء حملتك الأولى! 🚀
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CampaignManager;