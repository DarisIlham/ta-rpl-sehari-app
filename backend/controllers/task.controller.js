import Task from "../models/task.model.js";

// Create a new task
export async function createTask(req, res) {
  try {
    const task = new Task({
      ...req.body,
      user_id: req.user.user_id, // Use the authenticated user's ID
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task." });
  }
}

// Get all tasks for the authenticated user
export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({
      user_id: req.user.user_id,
    }).sort({ time: 1 }); // Sort by time ascending
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

// Update a task by ID
// In your task.controller.js
export async function updateTask(req, res) {
  try {
    const task = await Task.findOneAndUpdate(
      {
        task_id: req.params.id,
        user_id: req.user.user_id,
      },
      req.body,  // This will include the new status
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task." });
  }
}

// Delete a task by ID
export async function deleteTask(req, res) {
  try {
    const deleted = await Task.findOneAndDelete({
      task_id: req.params.id,
      user_id: req.user.user_id, // Ensure user owns the task
    });

    if (!deleted) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task." });
  }
}

// Get tasks grouped by progress status
export async function getTasksByStatus(req, res) {
  try {
    const result = await Task.aggregate([
      {
        $match: {
          user_id: req.user.user_id,
        },
      },
      {
        $group: {
          _id: "$status",
          tasks: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks by status." });
  }
}

// Get tasks grouped by category
export async function getTasksByCategory(req, res) {
  try {
    const result = await Task.aggregate([
      {
        $match: {
          user_id: req.user.user_id,
        },
      },
      {
        $group: {
          _id: "$category",
          tasks: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks by category." });
  }
}

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,  
  getTasksByCategory,
};