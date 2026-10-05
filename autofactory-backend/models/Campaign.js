const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true }, // الكلمة التي سيصطادها البوت
    public_reply: { type: String, required: true },          // الرد على التعليق
    dm_message: { type: String, required: true },            // رسالة الخاص
    is_active: { type: Boolean, default: true },             // هل الحملة شغالة حالياً؟
    usage_count: { type: Number, default: 0 },               // كم شخص استخدم هذه الكلمة؟
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);