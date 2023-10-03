const mongoose = require("mongoose");

const clientDepositSchema = new mongoose.Schema({
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
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clientDeposit", clientDepositSchema);
