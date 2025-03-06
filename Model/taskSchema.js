const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  priority: { type: String, default: "Low" },
  status: { type: String, default: "Pending" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
