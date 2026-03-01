import { body, param } from "express-validator";

export const createProjectValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("slug")
    .customSanitizer((value = "") =>
      String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug may contain lowercase letters, numbers, and hyphens"),
  body("summary").trim().notEmpty().withMessage("Summary is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("status")
    .optional()
    .isIn(["recruiting", "in-development", "completed"])
    .withMessage("Invalid project status"),
  body("rolesNeeded").optional().isArray().withMessage("rolesNeeded must be an array"),
  body("techStack").optional().isArray().withMessage("techStack must be an array")
];

export const updateProjectValidator = [
  param("id").isMongoId().withMessage("Valid project id is required"),
  body("status")
    .optional()
    .isIn(["recruiting", "in-development", "completed"])
    .withMessage("Invalid project status")
];

export const projectIdValidator = [param("id").isMongoId().withMessage("Valid project id is required")];
export const projectSlugValidator = [param("slug").notEmpty().withMessage("Project slug is required")];
