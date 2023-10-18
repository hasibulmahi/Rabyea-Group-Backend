const express = require("express");
const router = express.Router();

const {
  adminCreate,
  managerCreate,
  clientCreate,
  deleteManager,
  deleteClient,
  projectCreate,
  getAllProject,
  getProject,
  getAllManager,
  getAllClient,
  createSubadmin,
  getSingleClient,
  updateClient,
  getSingleManager,
  updateManager,
  getProjectManager,
  getProjectClient,
  paymentCreate,
  getAdminNotification,
  getManagerNotification,
  getClientNotification,
} = require("../controllers/hrControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router
  .route("/admin/create")
  .post(isAuthenticatedUser, authorizeRoles("Hr"), adminCreate);
router.route("/subadmin/create").post(createSubadmin);
router
  .route("/manager/create")
  .post(isAuthenticatedUser, authorizeRoles("Hr"), managerCreate);
router
  .route("/get/manager")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getAllManager);
router
  .route("/manager/:id")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getSingleManager);
router
  .route("/manager/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Hr"), updateManager);
router
  .route("/manager/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Hr"), deleteManager);
router
  .route("/client/create")
  .post(isAuthenticatedUser, authorizeRoles("Hr"), clientCreate);

router
  .route("/get/client")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getAllClient);
router
  .route("/client/:id")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getSingleClient);
router
  .route("/client/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Hr"), updateClient);
router
  .route("/client/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Hr"), deleteClient);

router
  .route("/project/create")
  .post(isAuthenticatedUser, authorizeRoles("Hr"), projectCreate);
router
  .route("/get/project")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getAllProject);
router
  .route("/get/project/:id")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getProject);

router
  .route("/project/manager")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getProjectManager);

router
  .route("/project/client")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getProjectClient);

router
  .route("/payment/create")
  .post(isAuthenticatedUser, authorizeRoles("Hr"), paymentCreate);

router
  .route("/admin/notification")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getAdminNotification);
router
  .route("/maneger/notification")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getManagerNotification);
router
  .route("/get/client/notification")
  .get(isAuthenticatedUser, authorizeRoles("Hr"), getClientNotification);

module.exports = router;
