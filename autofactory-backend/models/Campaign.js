// [AUTO-FUNNEL ENGINE - CAMPAIGN MODEL V3]
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true },
    public_reply: { type: String, required: true },
    dm_message: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    usage_count: { type: Number, default: 0 },
    course_id: { type: String, default: '' },
    course_title: { type: String, default: '' },
    course_url: { type: String, default: '' },
    studio_type: { type: String, default: '' },
    carousel_topic: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
