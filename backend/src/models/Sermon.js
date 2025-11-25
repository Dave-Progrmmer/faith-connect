import mongoose from 'mongoose';

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },
    speaker: {
      type: String,
      required: [true, 'Please provide speaker name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    audio: {
      url: String,
      public_id: String
    },
    video: {
      url: String,
      public_id: String
    },
    notes: {
      url: String,
      public_id: String
    },
    thumbnail: {
      url: String,
      public_id: String
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Sermon = mongoose.model('Sermon', sermonSchema);

export default Sermon;