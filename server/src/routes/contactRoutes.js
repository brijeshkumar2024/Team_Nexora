import { Router } from "express";
import rateLimit from "express-rate-limit";
import { listContacts, submitContact, updateContactStatus } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createContactValidator,
  listContactsValidator,
  updateContactStatusValidator
} from "../validators/contactValidators.js";

const router = Router();

const contactSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact requests from this IP. Please try again in 15 minutes."
  }
});

router.post("/", contactSubmitLimiter, createContactValidator, validateRequest, submitContact);
router.get("/", protect, allowRoles("admin", "lead"), listContactsValidator, validateRequest, listContacts);
router.patch(
  "/:id",
  protect,
  allowRoles("admin", "lead"),
  updateContactStatusValidator,
  validateRequest,
  updateContactStatus
);

export default router;
