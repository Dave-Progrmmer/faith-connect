import mongoose from "mongoose";

const PrayerRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    request: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "prayed"],
        default: "pending"
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("PrayerRequest", PrayerRequestSchema);
