require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERSION = 'v20.0';

async function deepScanFacebook() {
    try {
        console.log('🔍 بدء الفحص الشامل لصفحات فيسبوك...');

        // 1. الفحص الأول: اختبار الرمز بشكل مباشر كصفحة (Page Token)
        console.log('\n⏳ الفحص الأول: اختبار الرمز المباشر...');
        try {
            const directRes = await axios.get(`https://graph.facebook.com/${VERSION}/me`, {
                params: {
                    fields: 'id,name,category',
                    access_token: TOKEN
                }
            });
            
            console.log('📝 تم الدخول كـ:', directRes.data.name);
            
            // إذا أعاد الفحص تصنيفاً (category) فهذا يعني أنه توكن صفحة بنسبة 100%
            if (directRes.data.category) {
                console.log(`✅ هذا توكن صفحة سليم!`);
                console.log(`📌 معرّف الصفحة (FB_PAGE_ID): ${directRes.data.id}`);
                return; // إيقاف البحث، أنت في السليم!
            } else {
                console.log('⚠️ الرمز يخص حساباً شخصياً (User Profile). ننتقل للفحص الثاني...');
            }
        } catch (e) {
            console.log('⚠️ مسار الصفحة المباشر لم يعمل (الرمز قد يكون User Token منتهي أو ناقص الصلاحيات). ننتقل للفحص الثاني...');
        }

        // 2. الفحص الثاني: جلب جميع الصفحات والبحث العميق بداخلها
        console.log('\n⏳ الفحص الثاني: البحث العميق في كل الصفحات المرتبطة بحسابك...');
        const pagesRes = await axios.get(`https://graph.facebook.com/${VERSION}/me/accounts`, {
            params: {
                fields: 'id,name,category,access_token',
                access_token: TOKEN
            }
        });

        const pages = pagesRes.data.data;
        let found = false;

        for (const page of pages) {
            console.log(`\n- جاري فحص صفحة: ${page.name} (${page.category})`);
            console.log(`🎉 نجاح! معرّف الصفحة (FB_PAGE_ID): ${page.id}`);
            
            // سحر إضافي: استخراج توكن الصفحة المباشر!
            if (page.access_token) {
                console.log(`🔑 توكن هذه الصفحة (انسخه وضعه كـ PAGE_ACCESS_TOKEN):`);
                console.log(`   ${page.access_token}`);
            }
            found = true;
        }

        if (!found) {
            console.log('\n❌ النتيجة النهائية: لم يعثر الكود على أي صفحات تديرها بهذا التوكن.');
        }

    } catch (error) {
        console.error('\n❌ خطأ في الاتصال بالخادم:');
        console.error(error.response ? error.response.data.error.message : error.message);
    }
}

deepScanFacebook();