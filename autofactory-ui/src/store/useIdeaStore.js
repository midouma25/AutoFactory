import { create } from 'zustand';

const useIdeaStore = create((set) => ({
    // الحالة: تخزين بيانات الفكرة الفيروسية
    viralData: null, 
    
    // دالة لحفظ البيانات القادمة من TrendHub
    setViralData: (data) => set({ viralData: data }),
    
    // دالة لتفريغ البيانات بعد الانتهاء منها في PromptStudio
    clearViralData: () => set({ viralData: null })
}));

export default useIdeaStore;