require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkAllGeminiKeys() {
    console.log("==========================================");
    console.log("🔍 أداة فحص ترسانة مفاتيح Google Gemini (الـ 7 مفاتيح)");
    console.log("==========================================\n");

    // جلب كل المفاتيح من ملف .env وتجاهل الفارغ منها
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

    console.log(`🎯 تم العثور على ${geminiKeys.length} مفاتيح في ملف البيئة. جاري الفحص...\n`);

    let validCount = 0;

    for (let i = 0; i < geminiKeys.length; i++) {
        const apiKey = geminiKeys[i];
        // إخفاء جزء من المفتاح للأمان عند الطباعة
        const keyPreview = apiKey.substring(0, 10) + "********"; 
        
        console.log(`[المفتاح رقم ${i + 1}] (${keyPreview})`);
        
    try {
            const genAI = new GoogleGenerativeAI(apiKey);
            // 🌟 التعديل هنا: استخدام نموذج gemini-pro بدلاً من gemini-1.5-flash
             const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
            // حساب وقت الاستجابة
            const startTime = Date.now();
            
            // إرسال طلب صغير
            const result = await model.generateContent("Respond with exactly one word: 'READY'.");
            const responseText = result.response.text().trim();
            
            const ping = Date.now() - startTime;

            console.log(`   ✅ [نجاح] صالح ويعمل (السرعة: ${ping}ms) - الرد: ${responseText}`);
            validCount++;
        } catch (error) {
            console.log(`   ❌ [فشل]`);
            
            if (error.message.includes("API key not valid")) {
                console.log(`      ⚠️ السبب: المفتاح غير صالح (تأكد من النسخ الصحيح).`);
            } else if (error.status === 429 || error.message.includes("quota")) {
                console.log(`      ⚠️ السبب: تم تجاوز الحد المسموح (Rate Limit).`);
            } else {
                console.log(`      ⚠️ السبب التقني: ${error.message}`);
            }
        }
        console.log("------------------------------------------");
    }

    console.log(`\n📊 النتيجة النهائية: ${validCount} من أصل ${geminiKeys.length} مفاتيح تعمل بكفاءة!`);
    
    if(validCount > 0) {
        console.log("🚀 بمجرد دمج هذه الترسانة في السيرفر، ستتمكن من توليد مئات الشرائح دفعة واحدة!");
    }
}

checkAllGeminiKeys();