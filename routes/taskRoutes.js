const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
//router.post("/", async (req, res) => {

  const { title, description, dueDate } = req.body;
  //const task = new Task({ title, description, dueDate});
  const task = new Task({ title, description, dueDate, user: req.user.id });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks
// router.get("/", authMiddleware, async (req, res) => {
//   const tasks = await Task.find({ user: req.user.id });
//   res.json(tasks);
// });

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    const formattedTasks = tasks.map(task => {
      return {
        ...task.toObject(),
        completed: task.completed ? "Yes" : "No"  // Convert to "Yes" or "No"
      };
    });
    res.status(200).json(formattedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;

