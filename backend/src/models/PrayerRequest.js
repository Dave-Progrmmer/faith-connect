import mongoose from 'mongoose';

const prayerRequestSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide prayer content'],
      trim: true
    },
    visibility: {
      type: String,
      enum: ['public', 'anonymous', 'private'],
      default: 'public',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const PrayerRequest = mongoose.model('PrayerRequest', prayerRequestSchema);

export default PrayerRequest;