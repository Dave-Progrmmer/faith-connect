import mongoose from "mongoose";

const SermonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    preacher: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    videoUrl: {
        type: String
    },
    audioUrl: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("Sermon", SermonSchema);
