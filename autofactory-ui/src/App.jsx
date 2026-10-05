import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import PromptStudio from './pages/PromptStudio';
import TrendHub from './pages/TrendHub';
import TemplateLab from './pages/TemplateLab';
import TripleTemplateLab from './pages/TripleTemplateLab';
import RoadmapLab from './pages/RoadmapLab';
import BusinessLab from './pages/BusinessLab';
import StoryLab from './pages/StoryLab';
import ReelLab from './pages/ReelLab';
import LeadsDashboard from './pages/LeadsDashboard'; 
// 👈 استيراد مدير الحملات الجديد
import CampaignManager from './pages/CampaignManager'; 
import CommercialLab from './pages/CommercialLab';


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
      case 'business-lab':
        return <BusinessLab setActiveTab={setActiveTab} />;
      case 'story-lab':
        return <StoryLab setActiveTab={setActiveTab} />;
      case 'reel-lab':
        return <ReelLab setActiveTab={setActiveTab} />;
      case 'leads': 
        return <LeadsDashboard setActiveTab={setActiveTab} />;
      // 👈 ربط مسار مدير الحملات بالمكون الخاص به
      case 'campaigns':
        return <CampaignManager setActiveTab={setActiveTab} />;
      case 'commercial-lab':
        return <CommercialLab setActiveTab={setActiveTab} />;
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