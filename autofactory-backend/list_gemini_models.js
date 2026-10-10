require('dotenv').config();
const axios = require('axios');

async function listGeminiModels() {
    console.log("==========================================");
    console.log("🔍 أداة استكشاف نماذج Google Gemini المتاحة");
    console.log("==========================================\n");

    // جلب المفاتيح من ملف .env
    const geminiKeys = [
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY_4,
        process.env.GEMINI_API_KEY_5,
        process.env.GEMINI_API_KEY_6,
        process.env.GEMINI_API_KEY_7
    ].filter(Boolean);

    if (geminiKeys.length === 0) {
        console.log("❌ خطأ: لم يتم العثور على أي مفتاح GEMINI في ملف .env!");
        return;
    }

    // سنستخدم أول مفتاح صالح لطلب القائمة (لأن القائمة هي نفسها لجميع المفاتيح)
    const apiKey = geminiKeys[0];
    console.log("⏳ جاري الاتصال بخوادم Google لجلب النماذج المدعومة...\n");

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const models = response.data.models;

        console.log("✅ النماذج المتاحة الصالحة لتوليد النصوص والأكواد (generateContent):");
        console.log("------------------------------------------------------------------");

        let count = 0;
        models.forEach(model => {
            // نحن نهتم فقط بالنماذج التي تدعم توليد المحتوى (generateContent)
            if (model.supportedGenerationMethods.includes("generateContent")) {
                // إزالة كلمة 'models/' من الاسم ليكون جاهزاً للنسخ
                const cleanName = model.name.replace('models/', '');
                console.log(`📌 ${cleanName}`);
                console.log(`   📝 الوصف: ${model.description}`);
                console.log(`   📏 أقصى عدد توكنز للإدخال: ${model.inputTokenLimit}`);
                console.log(`   📏 أقصى عدد توكنز للإخراج: ${model.outputTokenLimit}`);
                console.log("------------------------------------------------------------------");
                count++;
            }
        });

        console.log(`\n🎉 تم العثور على ${count} نماذج قوية يمكنك استخدامها في مصفوفة الطوارئ!`);

    } catch (error) {
        console.error("\n❌ حدث خطأ أثناء جلب النماذج:");
        if (error.response && error.response.data) {
            console.error(error.response.data.error.message);
        } else {
            console.error(error.message);
        }
    }
}

listGeminiModels();