const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { 
    type: Date, 
    validate: {
      validator: function(value) {
        return value > new Date(); // Ensures dueDate is in the future
      },
      message: "Due date must be in the future."
    }
  },  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Task", TaskSchema);
