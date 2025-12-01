// routes/taskRoutes.js
import express from "express";
import multer from "multer";
import { authenticateJWT } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleCheck.js";
import {
  createTask, getEmployeeTasks, getManagerTasks,
  claimTask, uploadAttachmentsAndComplete, closeTask
} from "../controllers/taskController.js";

const router = express.Router();
const upload = multer({ dest: "public/uploads/" });

router.post("/create", authenticateJWT, allowRoles("manager"), createTask); // manager assigns
router.get("/employee", authenticateJWT, allowRoles("employee"), getEmployeeTasks);
router.get("/manager", authenticateJWT, allowRoles("manager"), getManagerTasks);

router.put("/claim/:id", authenticateJWT, allowRoles("employee"), claimTask);
router.post("/complete/:id", authenticateJWT, allowRoles("employee"), upload.array("attachments", 5), uploadAttachmentsAndComplete);

router.put("/close/:id", authenticateJWT, allowRoles("manager"), closeTask);

export default router;
