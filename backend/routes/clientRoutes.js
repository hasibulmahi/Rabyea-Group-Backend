const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  activeProjectData,
  createNotification,
} = require("../controllers/clientControllers");

router
  .route("/client/project/data")
  .get(isAuthenticatedUser, authorizeRoles("Client"), activeProjectData);
router
  .route("/create/client/notification")
  .post(isAuthenticatedUser, authorizeRoles("Client"), createNotification);

module.exports = router;
