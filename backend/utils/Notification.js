const ErrorHandler = require("../utils/errorhandler");
const AdminNotification = require("../models/Utils/adminNotification");
const ManagerNotification = require("../models/Utils/managerNotification");
const ClientNotification = require("../models/Utils/clientNotification");

const createNotification = async (options) => {
  let notiData = {
    sender: options.sender,
    message: options.message,
    project: options.projectId,
    amount: options.amount,
  };

  if (options.senderType === "Admin") {
    await AdminNotification.create(notiData);
  } else if (options.senderType === "Manager") {
    await ManagerNotification.create(notiData);
  } else if (options.senderType === "Client") {
    await ClientNotification.create(notiData);
  } else {
    return next(new ErrorHandler("Sender Type Not Found", 404));
  }
};
module.exports = createNotification;
