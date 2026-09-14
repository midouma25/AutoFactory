require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// إعداد الاتصال بالسحابة
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadLocalImage(filePath) {
    try {
        console.log('⏳ جاري رفع الصورة من جهازك إلى السحابة...');
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'AutoFactory' // سيتم إنشاء هذا المجلد تلقائياً في حسابك
        });
        
        console.log('✅ تم الرفع بنجاح! هذا هو الرابط النظيف الذي تعشقه ميتا:');
        console.log(result.secure_url);
        return result.secure_url;
        
    } catch (error) {
        console.error('❌ خطأ في الرفع السحابي:', error.message);
    }
}

// اختبار الدالة - ضع هنا مسار صورة حقيقية موجودة في حاسوبك
// انتبه لطريقة كتابة المسار: استخدم الشرطة المائلة (/)
uploadLocalImage('E:/AutoFactory/Pictures/test.jpg');