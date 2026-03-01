import mongoose from "mongoose";

const certificateRecordSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    contributorName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    performanceNote: {
      type: String,
      required: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      required: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: Date,
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const CertificateRecord = mongoose.model("CertificateRecord", certificateRecordSchema);

export default CertificateRecord;
