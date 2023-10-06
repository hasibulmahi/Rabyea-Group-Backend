const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  createTask,
  createExpenses,
  deleteExpenses,
  activeProjectData,
  deleteDeposit,
  createDeposit,
  labourExpenses,
  deleteLabourExpenses,
  createWithdraw,
  deleteWithdraw,
} = require("../controllers/managerControllers");

router
  .route("/manager/project/data")
  .get(isAuthenticatedUser, authorizeRoles("Manager"), activeProjectData);
router
  .route("/task/manager")
  .post(isAuthenticatedUser, authorizeRoles("Manager"), createTask);

router
  .route("/project/expenses")
  .post(isAuthenticatedUser, authorizeRoles("Manager"), createExpenses);
router
  .route("/delete/project/expenses/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Manager"), deleteExpenses);

router
  .route("/labour/expenses")
  .post(isAuthenticatedUser, authorizeRoles("Manager"), labourExpenses);
router
  .route("/delete/labour/expenses/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Manager"), deleteLabourExpenses);
router
  .route("/project/deposit")
  .post(isAuthenticatedUser, authorizeRoles("Manager"), createDeposit);
router
  .route("/delete/project/deposit/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Manager"), deleteDeposit);
router
  .route("/project/withdraw")
  .post(isAuthenticatedUser, authorizeRoles("Manager"), createWithdraw);
router
  .route("/delete/project/withdraw/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Manager"), deleteWithdraw);

router.route("/get/project/:id").get();

module.exports = router;
