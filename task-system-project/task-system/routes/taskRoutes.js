// routes/taskRoutes.js
// -------------------------------------------------------
// Task se related saare routes yaha handle honge
// -------------------------------------------------------

import express from "express";
import * as taskController from "../controllers/taskController.js";
import isLoggedIn from "../middleware/isLoggedIn.js"; // user login check
import isAdmin from "../middleware/isAdmin.js"; // Admin role check

const router = express.Router();


// -------------------------------------------------------
// USER TASK ROUTES
// -------------------------------------------------------

// ✔ All tasks of logged-in user
router.get("/my-tasks", isLoggedIn, taskController.getMyTasks);

// ✔ Create new task
router.post("/create", isLoggedIn, taskController.createTask);

// ✔ Update a task
router.put("/:taskId", isLoggedIn, taskController.updateTask);

// ✔ Mark completed / toggle complete
router.put("/complete/:taskId", isLoggedIn, taskController.markComplete);

// ✔ Delete task
router.delete("/:taskId", isLoggedIn, taskController.deleteTask);


// -------------------------------------------------------
// ADMIN ROUTES (Optional, Future Part)
// -------------------------------------------------------

// ✔ Get all tasks of all users
router.get("/admin/all", isLoggedIn, isAdmin, taskController.getAllTasks);

// ✔ Admin delete anyone's task
router.delete("/admin/:taskId", isLoggedIn, isAdmin, taskController.adminDeleteTask);


// -------------------------------------------------------
export default router;
