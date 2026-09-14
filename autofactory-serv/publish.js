require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
// المعرّف الذي حصلنا عليه لصفحة "القرآن"
const IG_ID = '17841404465286460'; 

// رابط صورة تجريبية (يجب أن تكون الصورة برابط مباشر URL وليس من جهازك حالياً)
const IMAGE_URL = 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; 
const CAPTION = 'تجربة النشر التلقائي عبر Node.js و Graph API 🚀🤖\n#برمجة #أتمتة';

async function publishToInstagram() {
    try {
        console.log('⏳ الخطوة 1: رفع الصورة إلى سيرفرات ميتا...');
        
        const mediaResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: {
                image_url: IMAGE_URL,
                caption: CAPTION,
                access_token: TOKEN
            }
        });

        const creationId = mediaResponse.data.id;
        console.log('✅ تم تجهيز الصورة بنجاح! معرّف الحاوية:', creationId);

        console.log('\n⏳ الخطوة 2: إرسال أمر النشر الفعلي لحساب إنستغرام...');
        
        const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: creationId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر الصورة بنجاح على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishResponse.data.id);
        console.log('قم بفتح تطبيق إنستغرام الآن من هاتفك وتأكد من وجود المنشور الجديد!');

    } catch (error) {
        console.error('\n❌ حدث خطأ أثناء النشر:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

publishToInstagram();