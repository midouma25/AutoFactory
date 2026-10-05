// هذا السكربت يحاكي سيرفرات شركة Meta (إنستغرام)

const testWebhook = async () => {
    const payload = {
        object: 'instagram',
        entry: [
            {
                changes: [
                    {
                        field: 'comments',
                        value: {
                            text: "شرح أسطوري يا هندسة! كيف أحصل على كود بوت التداول؟",
                            from: { id: "9876543210" } // آيدي وهمي للعميل
                        }
                    }
                ]
            }
        ]
    };

    try {
        console.log("🚀 جاري إرسال التعليق الوهمي إلى سيرفرك...");
const response = await fetch('http://localhost:5000/webhook', {            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.text();
        console.log("✅ رد سيرفرك:", result);
    } catch (error) {
        console.error("❌ حدث خطأ في الاتصال:", error.message);
    }
};

testWebhook();