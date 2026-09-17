require('dotenv').config();
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// 1. إعداد الاتصال بالسحابة (كما في أكوادك السابقة)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // معرّفك الخاص
const VERSION = 'v20.0';

async function publishCarousel(imagePaths, caption) {
    try {
        console.log('\n======================================');
        console.log('🚀 بدء دورة نشر الألبوم (Carousel) عبر AutoFactory');
        console.log('======================================');
        
// ----------------------------------------------------
        // المرحلة الأولى: الرفع السحابي المتعدد مع التحويل الإجباري
        // ----------------------------------------------------
        console.log('\n☁️ 1. جاري رفع الصور إلى السحابة...');
        let imageUrls = [];
        for (let i = 0; i < imagePaths.length; i++) {
            
            // 💡 السلاح الأقوى: نجبر السحابة على تحويل الصور إلى JPG ليرضى إنستغرام
            const uploadRes = await cloudinary.uploader.upload(imagePaths[i], { 
                folder: 'AutoFactory_Carousel',
                format: 'jpg' 
            });
            
            imageUrls.push(uploadRes.secure_url);
            console.log(`   ✅ الصورة ${i + 1} تم رفعها بنجاح`);
        }

        console.log('⏳ ننتظر 8 ثوانٍ لضمان انتشار الروابط في السحابة...');
        await new Promise(resolve => setTimeout(resolve, 8000));

// ----------------------------------------------------
        // المرحلة الثانية: إنشاء الحاويات الفرعية في Meta (مع نظام الإنقاذ الهادئ)
        // ----------------------------------------------------
        console.log('\n📦 2. إنشاء حاويات فرعية (Carousel Items) في Meta...');
        let creationIds = [];
        
        for (let i = 0; i < imageUrls.length; i++) {
            let success = false;
            let attempts = 0; 
            let itemId = null;
            
            // 💡 زدنا عدد المحاولات إلى 4
            while (!success && attempts < 4) {
                attempts++;
                
                // 💡 التعديل الأهم: نستخدم الرابط النقي تماماً بدون ?t= لكي لا نوقظ جدار الحماية
                const pureUrl = imageUrls[i];
                
                try {
                    if (attempts > 1) {
                        console.log(`   🔄 إعادة المحاولة (${attempts}/4) للصورة ${i + 1}...`);
                    }
                    
                    const itemRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
                        params: {
                            image_url: pureUrl,
                            is_carousel_item: true,
                            access_token: TOKEN
                        }
                    });
                    
                    itemId = itemRes.data.id;
                    success = true; 
                    creationIds.push(itemId);
                    console.log(`   ✅ تم إنشاء حاوية للصورة ${i + 1} (ID: ${itemId})`);
                    
                } catch (err) {
                    console.error(`   ⚠️ فشلت المحاولة ${attempts} للصورة ${i + 1}.`);
                    
                    if (attempts === 4) { 
                        console.error('\n❌ استنفدنا جميع المحاولات! التفاصيل:');
                        console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                        throw err; 
                    }
                    
                    // 💡 استراحة 15 ثانية عند الفشل لتهدئة خوادم Cloudinary و Meta
                    console.log('   ⏳ ننتظر 15 ثانية قبل المحاولة مجدداً لتهدئة السيرفرات...');
                    await new Promise(resolve => setTimeout(resolve, 15000));
                }
            }

            // 💡 استراحة 12 ثانية كاملة بين نجاح صورة والبدء في الصورة التي تليها
            if (i < imageUrls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 12000));
            }
        }
        // ----------------------------------------------------
        // المرحلة الثالثة: دمج الحاويات في ألبوم واحد
        // ----------------------------------------------------
        console.log('\n📚 3. دمج الحاويات في ألبوم (Carousel Container)...');
        const carouselRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media`, null, {
            params: {
                media_type: 'CAROUSEL',
                children: creationIds.join(','), // نرسل المعرّفات مفصولة بفاصلة
                caption: caption,
                access_token: TOKEN
            }
        });
        const carouselId = carouselRes.data.id;
        console.log(`   ✅ تم إنشاء حاوية الألبوم بنجاح (ID: ${carouselId})`);

        // ----------------------------------------------------
        // المرحلة الرابعة: النشر الفعلي على إنستغرام
        // ----------------------------------------------------
        console.log('\n📢 4. إرسال أمر النشر النهائي لحساب إنستغرام...');
        const publishRes = await axios.post(`https://graph.facebook.com/${VERSION}/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: carouselId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر الألبوم بجميع شرائحه على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishRes.data.id);
        
} catch (error) {
        console.error('\n❌ حدث خطأ في إحدى المراحل:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error);
    }
}

// ==========================================
// 🧪 قسم الاختبار (التشغيل اليدوي)
// ==========================================
const myGeneratedImages = [
    'pictures/post_🎙️ فن الصوت_slide_1.png', 
    'pictures/post_🎙️ فن الصوت_slide_2.png',
    'pictures/post_🎙️ فن الصوت_slide_3.png',
    'pictures/post_🎙️ فن الصوت_slide_4.png',
    'pictures/post_🎙️ فن الصوت_slide_5.png',
    'pictures/post_🎙️ فن الصوت_slide_6.png' // لاحظ الصيغة هنا jpg
];

const postCaption = 'أول ألبوم صور (Carousel) يتم توليده وتصميمه ونشره برمجياً بالكامل عبر الذكاء الاصطناعي! 🤖✨\n#أتمتة #AutoFactory #NodeJS';

// تشغيل الدالة
publishCarousel(myGeneratedImages, postCaption);