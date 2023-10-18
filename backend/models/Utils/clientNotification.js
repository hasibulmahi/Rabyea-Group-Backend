const mongoose = require("mongoose");

const clientNotificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
  message: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clientNotification", clientNotificationSchema);
