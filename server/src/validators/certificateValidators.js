import { body, param } from "express-validator";

export const createCertificateTemplateValidator = [
  body("name").trim().notEmpty().withMessage("Template name is required"),
  body("body").trim().notEmpty().withMessage("Template body is required")
];

export const createCertificateRecordValidator = [
  body("application").isMongoId().withMessage("Valid application id is required"),
  body("project").isMongoId().withMessage("Valid project id is required"),
  body("contributorName").trim().notEmpty().withMessage("Contributor name is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("duration").trim().notEmpty().withMessage("Duration is required"),
  body("performanceNote").trim().notEmpty().withMessage("Performance note is required"),
  body("template").isMongoId().withMessage("Valid template id is required")
];

export const approveCertificateValidator = [param("id").isMongoId().withMessage("Valid certificate id is required")];
