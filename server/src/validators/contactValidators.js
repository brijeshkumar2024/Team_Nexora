import { body, param, query } from "express-validator";
import { contactStatuses, inquiryTypes } from "../models/Contact.js";

export const createContactValidator = [
  body("name").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("inquiryType")
    .trim()
    .isIn(inquiryTypes)
    .withMessage("Inquiry type must be one of: Project Collaboration, Client Inquiry, Join Nexora, General Question"),
  body("message")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Message must be at least 20 characters long")
    .isLength({ max: 3000 })
    .withMessage("Message cannot exceed 3000 characters")
];

export const listContactsValidator = [
  query("status").optional().isIn(contactStatuses).withMessage("Invalid contact status"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
];

export const updateContactStatusValidator = [
  param("id").isMongoId().withMessage("Valid contact id is required"),
  body("status").trim().isIn(contactStatuses).withMessage("Invalid contact status")
];
