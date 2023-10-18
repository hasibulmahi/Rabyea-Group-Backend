const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userName: {
    type: String,
    required: [true, "Please Enter admin name"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  agriment: {
    url: {
      type: String,
    },
  },
  work: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please Enter admin password"],
    select: false,
  },
  role: {
    type: String,
    default: "Client",
  },

  totalPay: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientDeposit",
    },
  ],

  totalRecieve: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientWithdraw",
    },
  ],
  allProject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  ],
  activeProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  notification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientNotification",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

//Hashing Password
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

//JWT Token
clientSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
clientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
clientSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("client", clientSchema);
