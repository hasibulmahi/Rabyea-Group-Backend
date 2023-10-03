const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { activeProjectData } = require("../controllers/clientControllers");

router
  .route("/client/project/data")
  .get(isAuthenticatedUser, authorizeRoles("Client"), activeProjectData);

module.exports = router;
