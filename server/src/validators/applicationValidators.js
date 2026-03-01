import { body, param } from "express-validator";

export const createApplicationValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("experienceLevel")
    .isIn(["beginner", "intermediate", "advanced", "expert"])
    .withMessage("Invalid experience level"),
  body("portfolioUrl").optional({ values: "falsy" }).isURL().withMessage("Portfolio/GitHub must be a valid URL"),
  body("whyNexora").trim().notEmpty().withMessage("Why Nexora response is required"),
  body("project").isMongoId().withMessage("Valid project id is required")
];

export const updateApplicationStatusValidator = [
  param("id").isMongoId().withMessage("Valid application id is required"),
  body("status").isIn(["accepted", "rejected", "pending"]).withMessage("Invalid status"),
  body("reviewerNote").optional().isLength({ max: 500 }).withMessage("Reviewer note too long"),
  body("project").optional().isMongoId().withMessage("Assigned project id must be valid")
];
