import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  listProjects,
  updateProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createProjectValidator,
  projectIdValidator,
  projectSlugValidator,
  updateProjectValidator
} from "../validators/projectValidators.js";

const router = Router();

router.get("/", listProjects);
router.get("/:slug", projectSlugValidator, validateRequest, getProjectBySlug);

router.post("/", protect, allowRoles("admin", "lead"), createProjectValidator, validateRequest, createProject);
router.patch("/:id", protect, allowRoles("admin", "lead"), updateProjectValidator, validateRequest, updateProject);
router.delete("/:id", protect, allowRoles("admin"), projectIdValidator, validateRequest, deleteProject);

export default router;
