import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      required: true
    },
    portfolioUrl: {
      type: String,
      trim: true
    },
    whyNexora: {
      type: String,
      required: true,
      maxlength: 1200
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    reviewerNote: {
      type: String,
      maxlength: 500
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

applicationSchema.index({ email: 1, project: 1 }, { unique: false });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
