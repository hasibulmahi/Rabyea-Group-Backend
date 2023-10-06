const mongoose = require("mongoose");

const labourExpensesSchema = new mongoose.Schema({
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

module.exports = mongoose.model("labourExpenses", labourExpensesSchema);
