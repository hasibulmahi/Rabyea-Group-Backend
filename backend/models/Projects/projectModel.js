const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subadmin",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  code: {
    type: String,
  },
  description: {
    type: String,
  },
  totalExpenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projectExpenses",
    },
  ],
  labourExpenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "labourExpenses",
    },
  ],
  clientDeposit: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientDeposit",
    },
  ],
  clientWithdraw: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientWithdraw",
    },
  ],
  payable: {
    type: Number,
  },
  plannedCost: {
    type: Number,
  },
  due: {
    type: Number,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    default: "On-Time",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("project", projectSchema);
