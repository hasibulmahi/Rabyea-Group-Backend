const mongoose = require("mongoose");

const projectExpensesSchema = new mongoose.Schema({
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  title: {
    type: String,
  },
  uom: { type: String },
  qty: {
    type: Number,
  },
  unitPrice: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("projectExpenses", projectExpensesSchema);
