require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listMyModels() {
    try {
        console.log("⏳ جاري الاتصال بخوادم Groq لجلب النماذج المتاحة لك...");
        const response = await groq.models.list();
        
        console.log("\n✅ هذه هي النماذج (Model IDs) التي يدعمها مفتاحك حالياً:");
        console.log("---------------------------------------------------");
        
        response.data.forEach(model => {
            console.log(`📌 ${model.id}`);
        });
        
        console.log("---------------------------------------------------");
        console.log("انسخ أي اسم من هذه الأسماء وضعه في ملف server.js!");
    } catch (error) {
        console.error("❌ حدث خطأ:", error.message);
    }
}

listMyModels();