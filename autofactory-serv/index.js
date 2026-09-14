require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERSION = 'v20.0';

async function deepScanInstagram() {
    try {
        console.log('🔍 بدء الفحص الشامل لحسابات إنستغرام...');

        // 1. الفحص الأول: اختبار الرمز بشكل مباشر كصفحة (Page Token)
        console.log('\n⏳ الفحص الأول: اختبار الرمز المباشر...');
        try {
            const directRes = await axios.get(`https://graph.facebook.com/${VERSION}/me`, {
                params: {
                    // نطلب الحقلين معاً لتجنب أي أخطاء في تسمية ميتا
                    fields: 'id,name,instagram_business_account,connected_instagram_account',
                    access_token: TOKEN
                }
            });
            console.log('📝 تم الدخول كـ:', directRes.data.name);
            
            if (directRes.data.instagram_business_account) {
                console.log('✅ تم العثور على IG Business ID:', directRes.data.instagram_business_account.id);
                return; // إيقاف البحث إذا نجحنا
            } else if (directRes.data.connected_instagram_account) {
                console.log('✅ تم العثور على IG Connected ID:', directRes.data.connected_instagram_account.id);
                return; 
            } else {
                console.log('⚠️ لا يوجد إنستغرام مرتبط مباشرة في هذا المسار.');
            }
        } catch (e) {
            console.log('⚠️ مسار الصفحة المباشر لم يعمل (الرمز قد يكون User Token). ننتقل للفحص الثاني...');
        }

        // 2. الفحص الثاني: جلب جميع الحسابات والبحث العميق بداخلها
        console.log('\n⏳ الفحص الثاني: البحث العميق في كل الصفحات...');
        const pagesRes = await axios.get(`https://graph.facebook.com/${VERSION}/me/accounts`, {
            params: {
                fields: 'id,name,instagram_business_account,connected_instagram_account',
                access_token: TOKEN
            }
        });

        const pages = pagesRes.data.data;
        let found = false;

        for (const page of pages) {
            console.log(`\n- جاري فحص صفحة: ${page.name}`);
            if (page.instagram_business_account) {
                console.log(`🎉 نجاح! (IG Business ID): ${page.instagram_business_account.id}`);
                found = true;
            } else if (page.connected_instagram_account) {
                console.log(`🎉 نجاح! (IG Connected ID): ${page.connected_instagram_account.id}`);
                found = true;
            }
        }

        if (!found) {
            console.log('\n❌ النتيجة النهائية: لم يعثر الكود على إنستغرام في أي مسار.');
        }

    } catch (error) {
        console.error('\n❌ خطأ في الاتصال بالخادم:');
        console.error(error.response ? error.response.data.error.message : error.message);
    }
}

deepScanInstagram();