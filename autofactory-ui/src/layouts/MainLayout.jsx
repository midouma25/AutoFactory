import React from 'react'; //[cite: 2]
// تم إضافة أيقونة Users لقاعدة العملاء
import { LayoutDashboard, PenTool, TrendingUp, History, Settings, FlaskConical, Layers, Map, Briefcase, BookOpen, Clapperboard, Users, Megaphone, Video } from 'lucide-react'; 

const menuItems = [ //[cite: 2]
  { id: 'dashboard', name: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> }, //[cite: 2]
  { id: 'trend-hub', name: 'مركز الترند والذكاء', icon: <TrendingUp size={20} /> }, //[cite: 2]
  { id: 'template-lab', name: 'مختبر القوالب', icon: <FlaskConical size={20} /> }, //[cite: 2]
  { id: 'triple-template-lab', name: 'المقارنة الثلاثية', icon: <Layers size={20} /> }, //[cite: 2]
  { id: 'roadmap-lab', name: 'صانع الخطوات', icon: <Map size={20} /> }, //[cite: 2]
  { id: 'business-lab', name: 'مصنع الأرباح', icon: <Briefcase size={20} /> }, //[cite: 2]
  { id: 'story-lab', name: 'استوديو القصص', icon: <BookOpen size={20} /> }, //[cite: 2]
  { id: 'leads', name: 'قاعدة العملاء', icon: <Users size={20} /> },
  // داخل مصفوفة menuItems:
{ id: 'commercial-lab', name: 'استوديو الإعلانات', icon: <Video size={20} /> },
  // 👈 إضافة زر استوديو الفيديوهات الجديد
  { id: 'campaigns', name: 'مدير الحملات', icon: <Megaphone size={20} /> },
  { id: 'reel-lab', name: 'استوديو الفيديوهات', icon: <Clapperboard size={20} /> }, 
  { id: 'prompt', name: 'استوديو الأوامر', icon: <PenTool size={20} /> }, //[cite: 2]
  { id: 'history', name: 'أرشيف النشر', icon: <History size={20} /> }, //[cite: 2]
  { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> }, //[cite: 2]
];

export default function MainLayout({ activeTab, setActiveTab, children }) { //[cite: 2]
  // دالة مساعدة لتحديد ستايل الزر النشط بناءً على المسار
  const getActiveStyle = (id) => { //[cite: 2]
    if (id === 'business-lab') return 'bg-gradient-to-r from-yellow-600 to-emerald-600 text-white shadow-lg'; //[cite: 2]
    if (id === 'story-lab') return 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-900/30'; //[cite: 2]
    if (id === 'reel-lab') return 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/30'; //[cite: 2]
    // 👈 إضافة ستايل مميز لزر مدير الحملات
    if (id === 'campaigns') return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30';
    if (id === 'commercial-lab') return 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/30';
    // 👈 إضافة ستايل مميز لزر قاعدة العملاء
    if (id === 'leads') return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30';
    return 'bg-blue-600 text-white shadow-lg'; //[cite: 2]
  };

  return ( //[cite: 2]
    <div dir="rtl" className="flex h-screen bg-gray-900 text-white font-sans"> 
      {/* Sidebar */} 
      <div className="w-64 bg-gray-800 p-5 flex flex-col border-l border-gray-700 shrink-0"> 
        <div className="flex items-center gap-3 mb-10"> 
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50"> 
            AF 
          </div> 
          <h1 className="text-2xl font-bold tracking-wider text-blue-400">AutoFactory</h1> 
        </div> 
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar"> 
          {menuItems.map((item) => ( //[cite: 2]
            <button //[cite: 2]
              key={item.id} //[cite: 2]
              onClick={() => setActiveTab(item.id)} //[cite: 2]
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${ //[cite: 2]
                activeTab === item.id  //[cite: 2]
                ? getActiveStyle(item.id)  //[cite: 2]
                : 'text-gray-400 hover:bg-gray-700 hover:text-white' //[cite: 2]
              }`} //[cite: 2]
            >
              {item.icon} 
              <span className="font-medium">{item.name}</span> 
            </button> //[cite: 2]
          ))}
        </nav> 
        
        {/* توقيعك الشخصي في أسفل القائمة */} 
        <div className="mt-auto pt-4 border-t border-gray-700 text-center"> 
            <p className="text-xs text-gray-500 font-bold">م/ غربي محمد الشريف</p> 
        </div> 
      </div> 

      {/* Main Content Area */} 
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar"> 
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
  ); //[cite: 2]
}