import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    photo: {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      }
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

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;