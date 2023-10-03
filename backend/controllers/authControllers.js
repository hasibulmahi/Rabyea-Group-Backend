const crypto = require("crypto");
const cloudinary = require("cloudinary");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");

const Admin = require("../models/User/adminModel");
const SubAdmin = require("../models/User/subAdminModel");
const Manager = require("../models/User/managerModel");
const Client = require("../models/User/clientModel");

/* ===================================================
        Login User (/api/v1/login/user) (req : POST)
   =================================================== */
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { userName, password, role } = req.body;
  if (!userName | !password) {
    return next(new ErrorHandler("Please enter username & password", 400));
  }
  if (!role) {
    return next(new ErrorHandler("Please enter your role", 400));
  }

  if (role === "Admin") {
    const user = await Admin.findOne({ userName }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    sendToken(user, user.role, 200, res);
  } else if (role === "Hr") {
    const user = await SubAdmin.findOne({ userName }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    sendToken(user, user.role, 200, res);
  } else if (role === "Manager") {
    const user = await Manager.findOne({ userName })
      .select("+password")
      .populate("activeProject");
    if (!user) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    sendToken(user, user.role, 200, res);
  } else if (role === "Client") {
    const user = await Client.findOne({ userName }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }
    sendToken(user, user.role, 200, res);
  } else {
    return next(new ErrorHandler("Choose your proffesion", 401));
  }
});

/* ======================================================================
        Forgot Password (/api/v1/user/forgot/password) (req : Post)
   ====================================================================== */
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email, role } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter your email", 400));
  }
  if (role === "Admin") {
    const user = await Admin.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    } else {
      //Get Reset Password Token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetPasswordUrl = `${process.env.FONTEND_URL}/password/reset/${resetToken},${role}`;
      const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

      try {
        await sendMail({
          email: user.email,
          subject: `Rabeya Group -- ${role} Password Recovary`,
          message,
        });
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
      }
    }
  } else if (role === "Hr") {
    const user = await SubAdmin.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    } else {
      //Get Reset Password Token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetPasswordUrl = `${process.env.FONTEND_URL}/password/reset/${resetToken},${role}`;
      const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

      try {
        await sendMail({
          email: user.email,
          subject: `Rabeya Group -- ${role} Password Recovary`,
          message,
        });
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
      }
    }
  } else if (role === "Manager") {
    const user = await Manager.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    } else {
      //Get Reset Password Token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetPasswordUrl = `${process.env.FONTEND_URL}/password/reset/${resetToken},${role}`;
      const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

      try {
        await sendMail({
          email: user.email,
          subject: `Rabeya Group -- ${role} Password Recovary`,
          message,
        });
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
      }
    }
  } else if (role === "Client") {
    const user = await Client.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    } else {
      //Get Reset Password Token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const resetPasswordUrl = `${process.env.FONTEND_URL}/password/reset/${resetToken},${role}`;
      const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

      try {
        await sendMail({
          email: user.email,
          subject: `Rabeya Group -- ${role} Password Recovary`,
          message,
        });
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
      }
    }
  } else {
    return next(new ErrorHandler("Choose your role", 401));
  }
});

/* ==============================================================
        Reset Password (/api/v1/user/password/reset/:token) (req : Post)
   ============================================================== */
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //Creating Token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  //resetFunction For All Type User Database Auth
  const resetFunction = async (user) => {
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Successfully reset your password",
    });
  };

  if (req.body.role === "Admin") {
    const user = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Hr") {
    const user = await SubAdmin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Manager") {
    const user = await Manager.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Client") {
    const user = await Client.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else {
    return next(new ErrorHandler("Role is Invalid", 401));
  }
});

/* ===================================================
        Logout User (/api/v1/logout) (req : GET)
   =================================================== */
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/* ===================================================
        User Details (/api/v1/user/me) (req : GET)
   =================================================== */
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  let user;
  if (req.user.role === "Admin") {
    user = await Admin.findById(req.user._id);
  } else if (req.user.role === "Hr") {
    user = await SubAdmin.findById(req.user._id);
  } else if (req.user.role === "Manager") {
    user = await Manager.findById(req.user._id);
  } else if (req.user.role === "Client") {
    user = await Client.findById(req.user._id);
  } else {
    console.log(user);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.sampleWork = catchAsyncError(async (req, res, next) => {
  const date = new Date(Date.now());

  const users = await Admin.find();

  //DailyAmount
  const yearArray = [];
  for (var i = 0; i < users.length; i++) {
    var depositDate = users[i].createdAt;
    if (depositDate.getFullYear() === 2023) {
      yearArray.push(users[i]);
    }
  }

  let jan = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 0) {
      jan += val.balance;
    }
  });

  let feb = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 1) {
      feb += val.balance;
    }
  });

  let mar = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 2) {
      mar += val.balance;
    }
  });

  let apr = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 3) {
      apr += val.balance;
    }
  });
  let may = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 4) {
      may += val.balance;
    }
  });
  let jun = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 5) {
      jun += val.balance;
    }
  });
  let jul = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 6) {
      jul += val.balance;
    }
  });
  let aug = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 7) {
      aug += val.balance;
    }
  });
  let sep = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 8) {
      sep += val.balance;
    }
  });
  let oct = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 9) {
      oct += val.balance;
    }
  });
  let nov = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 10) {
      nov += val.balance;
    }
  });
  let dec = 0;
  yearArray.forEach((val) => {
    var depositDate = val.createdAt;
    if (depositDate.getMonth() === 11) {
      dec += val.balance;
    }
  });
  const monthlyRevenue = [
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec,
  ];
  // console.log(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);
  console.log(typeof monthlyRevenue[8]);
  res.status(200).json({
    success: true,
    message: "Successfully Working",
    monthlyRevenue: monthlyRevenue[8],
  });
});
