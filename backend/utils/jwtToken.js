//Create token and saving in cookie
const sendToken = (user, role, statusCode, res) => {
  try {
    const token = user.getJWTToken();
    //options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    const value = token + "," + role;
    res.status(statusCode).cookie("token", value, options).json({
      success: true,
      user,
    });
    // console.log(token);
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendToken;
