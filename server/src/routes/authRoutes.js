import { Router } from "express";
import { login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import { loginValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, me);

export default router;
