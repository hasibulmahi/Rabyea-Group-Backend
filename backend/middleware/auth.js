const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Admin = require("../models/User/adminModel");
const SubAdmin = require("../models/User/subAdminModel");
const Manager = require("../models/User/managerModel");
const Client = require("../models/User/clientModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new ErrorHandler("Please Login to access this resource", 401));
  } else {
    const tokenData = token.split(",");
    const decodeData = jwt.verify(tokenData[0], process.env.JWT_SECRET);
    if (tokenData[1] === "Admin") {
      req.user = await Admin.findById(decodeData.id);
    }
    if (tokenData[1] === "Hr") {
      req.user = await SubAdmin.findById(decodeData.id);
    }
    if (tokenData[1] === "Manager") {
      req.user = await Manager.findById(decodeData.id);
    }
    if (tokenData[1] === "Client") {
      req.user = await Client.findById(decodeData.id);
    }
    // console.log(typeof token);
    next();
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
