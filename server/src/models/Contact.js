import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";

export const inquiryTypes = ["Project Collaboration", "Client Inquiry", "Join Nexora", "General Question"];
export const contactStatuses = ["New", "In Progress", "Resolved", "Closed"];

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, "Invalid email format"]
    },
    inquiryType: {
      type: String,
      enum: inquiryTypes,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 3000
    },
    status: {
      type: String,
      enum: contactStatuses,
      default: "New"
    }
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
