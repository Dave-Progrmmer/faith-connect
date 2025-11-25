import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date']
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

const Event = mongoose.model('Event', eventSchema);

export default Event;