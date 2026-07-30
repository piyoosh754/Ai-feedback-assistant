import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    feedbackText: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    productArea: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);