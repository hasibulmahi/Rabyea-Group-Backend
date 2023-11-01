const mongoose = require("mongoose");

const managerNotificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  message: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  amount: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "managerNotification",
  managerNotificationSchema
);
