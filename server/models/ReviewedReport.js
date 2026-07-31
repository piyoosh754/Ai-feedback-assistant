import mongoose from "mongoose";

const reviewedReportSchema = new mongoose.Schema(
  {
    summary: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ReviewedReport",
  reviewedReportSchema
);