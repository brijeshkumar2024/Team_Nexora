import mongoose from "mongoose";

const roleRequirementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    count: {
      type: Number,
      default: 1,
      min: 1
    },
    skills: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    summary: {
      type: String,
      required: true,
      maxlength: 240
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["recruiting", "in-development", "completed"],
      default: "recruiting"
    },
    domain: {
      type: String,
      default: "Product Innovation"
    },
    techStack: {
      type: [String],
      default: []
    },
    rolesNeeded: {
      type: [roleRequirementSchema],
      default: []
    },
    unpaid: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", summary: "text", description: "text" });

const Project = mongoose.model("Project", projectSchema);

export default Project;
