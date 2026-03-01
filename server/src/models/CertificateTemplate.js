import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true
    },
    version: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const CertificateTemplate = mongoose.model("CertificateTemplate", certificateTemplateSchema);

export default CertificateTemplate;
