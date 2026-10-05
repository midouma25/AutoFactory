require('dotenv').config();
const nodemailer = require('nodemailer');

const runTest = async () => {
    console.log("⏳ جاري فحص بيانات الاعتماد والاتصال بسيرفرات Google...");
    console.log(`- الإيميل المستخدم: ${process.env.EMAIL_USER}`);
    // طباعة أول 4 حروف فقط من الباسورد للتأكد من أنه يقرأ الملف
    console.log(`- كلمة المرور تبدأ بـ: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) : 'غير موجودة'}***`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // تأكد أن الباسورد في .env بدون أي مسافات
        }
    });

    try {
        // 1. اختبار صحة كلمة المرور والاتصال
        await transporter.verify();
        console.log("✅ المصادقة نجحت! كلمة مرور التطبيقات صحيحة.");

        // 2. محاولة إرسال إيميل لنفسك
        console.log("⏳ جاري محاولة إرسال رسالة اختبار...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // سيرسل رسالة من إيميلك إلى إيميلك نفسه
            subject: "🚀 فحص نظام AutoFactory",
            text: "إذا وصلت هذه الرسالة، فهذا يعني أن Nodemailer يعمل بشكل مثالي 100%!"
        });

        console.log("✅ تم إرسال رسالة الاختبار بنجاح! تفقد صندوق الوارد الخاص بك.");
        console.log("ID الرسالة:", info.messageId);

    } catch (error) {
        console.error("\n❌ فشل الاختبار! السبب هو:");
        console.error(error.message);
    }
};

runTest();