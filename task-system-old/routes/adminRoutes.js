// routes/adminRoutes.js
import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleCheck.js";
import { adminDashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", authenticateJWT, allowRoles("admin"), adminDashboard);

export default router;
