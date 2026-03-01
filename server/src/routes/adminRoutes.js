import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/stats", protect, allowRoles("admin", "lead"), getDashboardStats);

export default router;
