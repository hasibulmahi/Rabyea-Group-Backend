const mongoose = require("mongoose");

const projectExpensesSchema = new mongoose.Schema({
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  title: {
    type: String,
  },
  amount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("projectExpenses", projectExpensesSchema);
