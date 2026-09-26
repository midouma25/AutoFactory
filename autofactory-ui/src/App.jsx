import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import PromptStudio from './pages/PromptStudio';
import TrendHub from './pages/TrendHub'; 
import TemplateLab from './pages/TemplateLab'; 
import TripleTemplateLab from './pages/TripleTemplateLab'; 
import RoadmapLab from './pages/RoadmapLab'; 
import BusinessLab from './pages/BusinessLab'; // 👈 استيراد مصنع الأرباح الجديد

function App() {
  const [activeTab, setActiveTab] = useState('trend-hub');

  const renderContent = () => {
    switch (activeTab) {
      case 'prompt':
        return <PromptStudio />;
      case 'trend-hub':
         return <TrendHub setActiveTab={setActiveTab} />;
      case 'template-lab':
        return <TemplateLab setActiveTab={setActiveTab} />;
      case 'triple-template-lab':
        return <TripleTemplateLab setActiveTab={setActiveTab} />;
      case 'roadmap-lab':
        return <RoadmapLab setActiveTab={setActiveTab} />;
      case 'business-lab': // 👈 ربط المسار بالصفحة
        return <BusinessLab setActiveTab={setActiveTab} />;
      case 'history':
      case 'dashboard':
      case 'settings':
        return <div className="text-gray-500 text-center mt-20 text-xl">جاري تطوير هذا القسم...</div>;
      default:
        return <TrendHub setActiveTab={setActiveTab} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;