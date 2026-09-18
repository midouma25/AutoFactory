import React from 'react';
import { LayoutDashboard, PenTool, TrendingUp, History, Settings } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', name: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
  { id: 'trend-hub', name: 'مركز الترند والذكاء', icon: <TrendingUp size={20} /> }, // 👈 صفحتنا الجديدة!
  { id: 'prompt', name: 'استوديو الأوامر', icon: <PenTool size={20} /> },
  { id: 'history', name: 'أرشيف النشر', icon: <History size={20} /> },
  { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> },
];

export default function MainLayout({ activeTab, setActiveTab, children }) {
  return (
    <div dir="rtl" className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-5 flex flex-col border-l border-gray-700 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">
            AF
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-blue-400">AutoFactory</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        
        {/* توقيعك الشخصي في أسفل القائمة */}
        <div className="mt-auto pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500 font-bold">م/ محمد الشريف غربي</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            {menuItems.find(i => i.id === activeTab)?.icon}
            {menuItems.find(i => i.id === activeTab)?.name}
          </h2>
        </header>
        
        {/* هنا سيتم حقن محتوى الصفحة النشطة */}
        {children}
      </div>
    </div>
  );
}