import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      trim: true
    },
    image: {
      url: String,
      public_id: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;