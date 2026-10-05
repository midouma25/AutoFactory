import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Trash2, Download, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ألوان المخططات الدائرية (متناسقة مع ثيم الموقع الداكن)
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get('http://localhost:5000/api/leads')
      .then(response => {
        if (response.data.success) {
          setLeads(response.data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ خطأ في جلب بيانات العملاء:", error);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("⚠️ هل أنت متأكد من حذف هذا العميل نهائياً؟");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      setLeads(leads.filter(lead => lead._id !== id));
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  const exportToCSV = () => {
    const headers = ['اسم المستخدم', 'الكلمة المفتاحية', 'عدد التفاعلات', 'تاريخ آخر تفاعل'];
    const rows = leads.map(lead => [
      lead.username,
      lead.last_keyword || 'بدون',
      lead.interaction_count,
      new Date(lead.last_interaction).toLocaleString('ar-EG')
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AutoFactory_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 🧠 المحرك التحليلي للبيانات (يحدث تلقائياً)
  // ==========================================
  
  // 1. تحليل الكلمات المفتاحية (للمخطط الدائري)
  const keywordData = useMemo(() => {
    const counts = leads.reduce((acc, lead) => {
      const key = lead.last_keyword ? lead.last_keyword.trim() : 'بدون';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // 2. تحليل نشاط الأيام (للمخطط الشريطي)
  const activityData = useMemo(() => {
    const counts = leads.reduce((acc, lead) => {
      // استخراج اليوم والشهر فقط (مثال: 4 أكتوبر)
      const date = new Date(lead.last_interaction).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    // عكس المصفوفة لتظهر الأيام بترتيب زمني صحيح (من الأقدم للأحدث)
    return Object.entries(counts).reverse().map(([date, count]) => ({ date, count }));
  }, [leads]);

  // تصميم نافذة المعلومات (Tooltip) لتناسب الثيم الداكن
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-right dir-rtl">
          <p className="text-gray-300 mb-1">{label || payload[0].name}</p>
          <p className="text-emerald-400 font-bold">العدد: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white dir-rtl" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* الترويسة والأزرار */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">📊 قاعدة بيانات العملاء</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/50"
            >
              <Download size={18} />
              تصدير الإحصائيات
            </button>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              إجمالي المهتمين: <span className="text-emerald-400 font-bold">{leads.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20 animate-pulse text-xl">
            ⏳ جاري تحليل الخزنة السرية...
          </div>
        ) : (
          <>
            {/* قسم الرسوم البيانية */}
            {leads.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* 1. مخطط الكلمات المفتاحية (Pie Chart) */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                    <PieChartIcon className="text-blue-400" /> توزيع الكلمات المفتاحية
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={keywordData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {keywordData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. مخطط التفاعلات اليومية (Bar Chart) */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                    <BarChart2 className="text-emerald-400" /> التفاعل اليومي
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.4 }} />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* جدول البيانات */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              <table className="w-full text-right">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">اسم المستخدم (Instagram)</th>
                    <th className="p-4">الكلمة المفتاحية</th>
                    <th className="p-4 text-center">عدد التفاعلات</th>
                    <th className="p-4">تاريخ آخر تفاعل</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-750 transition-colors">
                      <td className="p-4 font-medium text-emerald-300">@{lead.username}</td>
                      <td className="p-4">
                        <span className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600">
                          {lead.last_keyword || 'بدون'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full font-bold">
                          {lead.interaction_count}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(lead.last_interaction).toLocaleString('ar-EG')}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                          title="حذف العميل"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        لا يوجد عملاء حتى الآن. بانتظار أول تعليق! 🎣
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadsDashboard;