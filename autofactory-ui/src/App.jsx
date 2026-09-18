import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import PromptStudio from './pages/PromptStudio';
import TrendHub from './pages/TrendHub'; 

function App() {
  const [activeTab, setActiveTab] = useState('trend-hub');

  // دالة بسيطة لاختيار الصفحة المعروضة
  const renderContent = () => {
    switch (activeTab) {
      case 'prompt':
        return <PromptStudio />;
      case 'trend-hub':
         return <TrendHub />;
      case 'history':
      case 'dashboard':
      case 'settings':
        return <div className="text-gray-500 text-center mt-20 text-xl">جاري تطوير هذا القسم...</div>;
      default:

 
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;