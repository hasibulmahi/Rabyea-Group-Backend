const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Project = require("../models/Projects/projectModel");

/* ===================================================
        Active Project Data (/api/v1/client/project/data) (req : get)
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
