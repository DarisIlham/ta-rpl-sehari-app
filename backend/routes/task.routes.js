import { Router } from "express";
const router = Router();
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByCategory,
} from "../controllers/task.controller.js";
import validateTask from "../middleware/validate.task.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import validateTaskStatusOnly from "../middleware/validateTaskStatusOnly.js";

// Route khusus untuk update status via drag
router.put("/drag/:id", verifyToken, validateTaskStatusOnly, updateTask);

// Get all tasks
router.get("/", verifyToken, getTasks);

// Create a new task
router.post("/", verifyToken, validateTask, createTask);

// Update a task
router.put("/:id", verifyToken, validateTask, updateTask);

// Delete a task
router.delete("/:id", verifyToken, deleteTask);

// Get tasks by progress status
router.get("/status", verifyToken, getTasksByStatus);

// Get tasks by category
router.get("/category", verifyToken, getTasksByCategory);

export default router;