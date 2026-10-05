const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    username: { type: String, required: true },
    instagram_id: { type: String, required: true, unique: true },
    last_keyword: { type: String },
    interaction_count: { type: Number, default: 0 },
    last_interaction: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);