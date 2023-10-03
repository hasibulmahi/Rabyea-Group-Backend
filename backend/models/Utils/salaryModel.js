const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  hr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subadmin",
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  amount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("salary", salarySchema);
