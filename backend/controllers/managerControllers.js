const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const ApiFetaures = require("../utils/apiFeatures");
const Manager = require("../models/User/managerModel");
const Client = require("../models/User/clientModel");
const Project = require("../models/Projects/projectModel");
const Expenses = require("../models/Projects/projectExpensesModel");
const Deposit = require("../models/Projects/clientDepositModel");

/* ===================================================
        Active Project Data (/api/v1/manager/project/data) (req : get)
   =================================================== */
exports.activeProjectData = catchAsyncError(async (req, res, next) => {
  const project = await Project.findById(req.user.activeProject)
    .populate("totalExpenses")
    .populate("clientDeposit");

  if (!project) {
    return next(new ErrorHandler("Project Not Found", 400));
  }

  res.status(200).json({
    success: true,
    project: project,
  });
});
/* ===================================================
        Create Task (/api/v1/task/manager) (req : POST)
   =================================================== */
exports.createTask = catchAsyncError(async (req, res, next) => {
  const { projectId, task } = req.body;

  if (!projectId) {
    return next(new ErrorHandler("Project Not Found", 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 400));
  }

  project.projectLine.push({ tasks: task });
  project.save();
  res.status(200).json({
    success: true,
    message: "Successfully Tasks Created",
  });
});

/* ===================================================
        Create Expenses (/api/v1/project/expenses) (req : POST)
   =================================================== */
exports.createExpenses = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.body;
  if (!projectId) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const manager = await Manager.findById(req.user._id);
  const data = {
    projectManager: manager._id,
    title: req.body.title,
    amount: req.body.amount,
  };
  const expenses = await Expenses.create(data);
  if (expenses) {
    await project.totalExpenses.push(expenses._id);
    await project.save();
  }
  const projectUpdate = await Project.findById(projectId)
    .populate("totalExpenses")
    .populate("clientDeposit");

  res.status(200).json({
    success: true,
    message: "Successfully Expenses Created",
    project: projectUpdate,
  });
});
/* ================================================================================
        Delete Project Expenses (/api/v1/delete/project/expenses/:id) (req : Delete)
   ================================================================================ */
exports.deleteExpenses = catchAsyncError(async (req, res, next) => {
  const project = await Project.findById(req.user.activeProject);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const expenses = await Expenses.findById(req.params.id);
  if (!expenses) {
    return next(new ErrorHandler("Project Expenses Not Found", 404));
  }

  await Expenses.findByIdAndDelete(req.params.id);
  if (project.totalExpenses.includes(req.params.id)) {
    const index = project.totalExpenses.indexOf(req.params.id);
    await project.totalExpenses.splice(index, 1);
    await project.save();
  }
  const projectUpdate = await Project.findById(req.user.activeProject)
    .populate("totalExpenses")
    .populate("clientDeposit");

  res.status(200).json({
    success: true,
    message: "Successfully Expenses Deleted",
    project: projectUpdate,
  });
});

/* ===================================================
        Create Deposit (/api/v1/project/deposit) (req : POST)
   =================================================== */
exports.createDeposit = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.body;
  if (!projectId) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const manager = await Manager.findById(req.user._id);
  const client = await Client.findById(project.client);
  const data = {
    projectManager: manager._id,
    title: req.body.title,
    client: project.client,
    amount: req.body.amount,
  };
  const deposit = await Deposit.create(data);
  if (deposit) {
    await project.clientDeposit.push(deposit._id);
    await client.totalPay.push(deposit._id);
    const filter = project.due - req.body.amount;
    await Project.findByIdAndUpdate(
      projectId,
      {
        due: filter,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    await project.save();
    await client.save();
  }

  const projectUpdate = await Project.findById(projectId)
    .populate("totalExpenses")
    .populate("clientDeposit");

  res.status(200).json({
    success: true,
    message: "Deposit Successfull",
    project: projectUpdate,
  });
});

/* ================================================================================
        Delete  Deposit (/api/v1/delete/project/deposit/:id) (req : Delete)
   ================================================================================ */
exports.deleteDeposit = catchAsyncError(async (req, res, next) => {
  const project = await Project.findById(req.user.activeProject);
  const client = await Client.findById(project.client);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) {
    return next(new ErrorHandler("Project Deposit Not Found", 404));
  }

  await Deposit.findByIdAndDelete(req.params.id);
  if (project.clientDeposit.includes(req.params.id)) {
    const index = project.clientDeposit.indexOf(req.params.id);
    await project.clientDeposit.splice(index, 1);

    await project.save();
  }
  if (client.totalPay.includes(req.params.id)) {
    const cindex = client.totalPay.indexOf(req.params.id);
    await client.totalPay.splice(cindex, 1);
    await client.save();
  }
  const projectUpdate = await Project.findById(req.user.activeProject)
    .populate("totalExpenses")
    .populate("clientDeposit");

  res.status(200).json({
    success: true,
    message: "Successfully Deposit Deleted",
    project: projectUpdate,
  });
});
