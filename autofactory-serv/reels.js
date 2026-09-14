require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_ID = '17841404465286460'; // المعرّف الخاص بك

// رابط فيديو تجريبي (يجب أن يكون MP4 برابط مباشر)
const VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'; 
const CAPTION = 'أول تجربة لنشر فيديو Reels تلقائياً عبر مصنع AutoFactory 🎬🤖\n#برمجة #أتمتة_إنستغرام';

// دالة ذكية لفحص حالة معالجة الفيديو
async function waitForProcessing(containerId) {
    let status = 'IN_PROGRESS';
    console.log('⏳ جاري معالجة الفيديو في سيرفرات ميتا... (قد يستغرق بضع ثوانٍ)');
    
    while (status === 'IN_PROGRESS') {
        // ننتظر 5 ثوانٍ قبل كل فحص لتخفيف الضغط على السيرفر
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        
        const response = await axios.get(`https://graph.facebook.com/v20.0/${containerId}`, {
            params: {
                fields: 'status_code',
                access_token: TOKEN
            }
        });
        
        status = response.data.status_code;
        console.log(`🔄 حالة المعالجة الحالية: ${status}`);
        
        if (status === 'ERROR') {
            throw new Error('❌ فشلت سيرفرات ميتا في معالجة الفيديو.');
        }
    }
    return status;
}

async function publishReelToInstagram() {
    try {
        console.log('🚀 الخطوة 1: رفع الفيديو إلى سيرفرات ميتا كـ Reel...');
        
        // لاحظ إضافة media_type: 'REELS'
        const mediaResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media`, null, {
            params: {
                media_type: 'REELS',
                video_url: VIDEO_URL,
                caption: CAPTION,
                access_token: TOKEN
            }
        });

        const creationId = mediaResponse.data.id;
        console.log('✅ تم إنشاء الحاوية بنجاح! معرّف الحاوية:', creationId);

        // الخطوة 2: الانتظار حتى تنتهي المعالجة
        await waitForProcessing(creationId);

        console.log('\n🚀 الخطوة 3: إرسال أمر النشر الفعلي...');
        
        const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${IG_ID}/media_publish`, null, {
            params: {
                creation_id: creationId,
                access_token: TOKEN
            }
        });

        console.log('\n🎉 نجاح ساحق! تم نشر مقطع الـ Reel بنجاح على حسابك.');
        console.log('🆔 معرّف المنشور (Post ID):', publishResponse.data.id);

    } catch (error) {
        console.error('\n❌ حدث خطأ أثناء نشر الفيديو:');
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

publishReelToInstagram();