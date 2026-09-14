require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// 1. إعداد الاتصال بالسحابة
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّف إنستغرام لصفحة القرآن

// 2. الدالة الشاملة: ترفع للسحابة ثم تنشر على إنستغرام
async function uploadAndPublish(localFilePath, captionText) {
    try {
        console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 بدء دورة النشر الآلي...`);
        
        // المرحلة الأولى: الرفع السحابي
        console.log('☁️ 1. جاري رفع الصورة من الحاسوب إلى السحابة...');
        const uploadResult = await cloudinary.uploader.upload(localFilePath, { 
            folder: 'AutoFactory' 
        });
        const secureUrl = uploadResult.secure_url;
        console.log('✅ تم الرفع بنجاح! الرابط:', secureUrl);

        // المرحلة الثانية: إنشاء الحاوية في سيرفرات ميتا
        console.log('📦 2. جاري إنشاء حاوية المنشور في Meta...');
        const mediaRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: { image_url: secureUrl, caption: captionText, access_token: TOKEN }
        });
        const creationId = mediaRes.data.id;

        // المرحلة الثالثة: النشر الفعلي
        console.log('📢 3. إرسال أمر النشر النهائي لحساب إنستغرام...');
        const publishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: { creation_id: creationId, access_token: TOKEN }
        });

        console.log(`[${new Date().toLocaleTimeString()}] 🎉 نجاح ساحق! تم نشر الصورة. Post ID:`, publishRes.data.id);
        
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ حدث خطأ في إحدى المراحل:`);
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

// ---------------------------------------------------------
// إعداد الجدولة الزمنية (Cron Jobs)
// ---------------------------------------------------------

// ⚠️ تأكد من تعديل هذا المسار ليكون مساراً حقيقياً لصورة في جهازك
const LOCAL_IMAGE_PATH = 'E:/AutoFactory/Pictures/test.jpg'; 
const POST_CAPTION = 'تجربة النشر المتكامل: من الحاسوب 💻 -> إلى السحابة ☁️ -> إلى إنستغرام 🚀\n#أتمتة #NodeJS';

console.log('⏳ نظام الجدولة الشامل يعمل الآن في الخلفية. بانتظار الموعد المحدد...');

// مضبوط حالياً للعمل كل دقيقة لأغراض الاختبار
cron.schedule('* * * * *', () => {
    console.log('\n⏰ حان موعد النشر المجدول!');
    uploadAndPublish(LOCAL_IMAGE_PATH, POST_CAPTION);
});