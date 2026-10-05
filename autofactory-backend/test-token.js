require('dotenv').config();
const axios = require('axios');

const extractCorrectToken = async () => {
    const userToken = process.env.PAGE_ACCESS_TOKEN;
    console.log("🕵️‍♂️ جاري فحص نوع التوكن واستكشاف الصفحات المرتبطة...");

    try {
        // نطلب من Meta جلب كل الصفحات التي يديرها هذا التوكن مع توكناتها الخاصة وحسابات إنستغرام
        const response = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userToken}`);
        
        const pages = response.data.data;
        
        if (pages && pages.length > 0) {
            console.log("\n✅ نجحنا! التوكن الخاص بك هو توكن مستخدم، وقد وجدنا صفحاتك:");
            
            pages.forEach(page => {
                console.log(`\n📘 صفحة فيسبوك: ${page.name}`);
                
                if (page.instagram_business_account) {
                    console.log(`📸 إنستغرام المرتبط: @${page.instagram_business_account.username}`);
                    console.log(`\n🔑 **التوكن الصحيح الذي تحتاجه (انسخه وضعه في .env):**`);
                    console.log("==================================================");
                    console.log(page.access_token);
                    console.log("==================================================");
                } else {
                    console.log("⚠️ هذه الصفحة غير مربوطة بحساب إنستغرام احترافي.");
                }
            });
        } else {
            console.log("\n❌ التوكن صحيح، لكن هذا الحساب لا يملك أو يدير أي صفحات فيسبوك!");
        }
        
    } catch (error) {
        console.error("\n❌ فشل الاتصال بسيرفرات Meta:");
        if (error.response && error.response.data) {
            console.error(error.response.data.error.message);
        } else {
            console.error(error.message);
        }
    }
};

extractCorrectToken();