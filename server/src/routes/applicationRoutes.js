import { Router } from "express";
import {
  exportApplicationsCsv,
  listApplications,
  listProjectApplicants,
  submitApplication,
  updateApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createApplicationValidator,
  updateApplicationStatusValidator
} from "../validators/applicationValidators.js";
import { projectIdValidator } from "../validators/projectValidators.js";

const router = Router();

router.post("/", createApplicationValidator, validateRequest, submitApplication);

router.get("/", protect, allowRoles("admin", "lead"), listApplications);
router.get("/export/csv", protect, allowRoles("admin", "lead"), exportApplicationsCsv);
router.get("/project/:id", protect, allowRoles("admin", "lead"), projectIdValidator, validateRequest, listProjectApplicants);
router.patch("/:id", protect, allowRoles("admin", "lead"), updateApplicationStatusValidator, validateRequest, updateApplication);

export default router;
