const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  cv: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
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
    default: "Employee",
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
  },
  salaryAproved: {
    type: String,
    default: "No",
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

//Hashing Password
managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

//JWT Token
managerSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
managerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
managerSchema.methods.getResetPasswordToken = function () {
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

module.exports = mongoose.model("manager", managerSchema);
