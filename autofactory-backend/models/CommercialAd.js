const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
    sceneNumber: Number,
    duration: String,
    shotType: String,
    cameraMovement: String,
    videoPrompt: String,
    imagePrompt: String,
    imageToVideoPrompt: String,
    narration: String,
    onScreenText: String,
    sfx: String
});

const commercialAdSchema = new mongoose.Schema({
    productIdea: { type: String, required: true },
    targetAudience: String,
    adVibe: String,
    brandColors: String,
    adTitle: { type: String, required: true },
    marketingAngle: String,
    soundtrackVibe: String,
    scenes: [sceneSchema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommercialAd', commercialAdSchema);