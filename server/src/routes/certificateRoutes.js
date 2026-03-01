import { Router } from "express";
import {
  approveRecord,
  createRecord,
  createTemplate,
  listRecords,
  listTemplates
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  approveCertificateValidator,
  createCertificateRecordValidator,
  createCertificateTemplateValidator
} from "../validators/certificateValidators.js";

const router = Router();

router.use(protect, allowRoles("admin", "lead"));

router.get("/templates", listTemplates);
router.post("/templates", createCertificateTemplateValidator, validateRequest, createTemplate);

router.get("/records", listRecords);
router.post("/records", createCertificateRecordValidator, validateRequest, createRecord);
router.patch("/records/:id/approve", approveCertificateValidator, validateRequest, approveRecord);

export default router;
