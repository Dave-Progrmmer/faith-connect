import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    }
}, {
    timestamps: true
});

export default mongoose.model("Announcement", AnnouncementSchema);
