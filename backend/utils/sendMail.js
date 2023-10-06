const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const REFRESH_TOKEN =
  "1//04W-2COVeBMHqCgYIARAAGAQSNwF-L9IrGZY7rcMeeWW3dQLSkFPrHnnLPg9Uqw_e7QfEjesNtn0NWMXIs-dCEtQV0_8OrttNMYA";
const CLIENT_ID =
  "448514247810-dbo8o1q7vbhni038tsjqu1c2lr3q3r3b.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (options) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transpoter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        type: "OAuth2",
        user: "soulpark0@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: process.env.MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    await transpoter.sendMail(mailOption);
  } catch (err) {
    console.log(err);
  }
};
module.exports = sendMail;
