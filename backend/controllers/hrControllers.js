const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorhandler");
const ApiFetaures = require("../utils/apiFeatures");
const Admin = require("../models/User/adminModel");
const Subadmin = require("../models/User/subAdminModel");
const Manager = require("../models/User/managerModel");
const Client = require("../models/User/clientModel");
const Project = require("../models/Projects/projectModel");
const Salary = require("../models/Utils/salaryModel");

/* ===================================================
        Create Subadmin (/api/v1/subadmin/create) (req : POST)
   =================================================== */
exports.createSubadmin = catchAsyncError(async (req, res, next) => {
  const { userName, password, email, name } = req.body;
  if (!userName | !password) {
    return next(new ErrorHandler("Please enter username & password", 400));
  }
  if (!email | !name) {
    return next(new ErrorHandler("Please enter email & fullname", 400));
  }

  const user = await Subadmin.findOne({ userName });
  if (user) {
    return next(new ErrorHandler("This username is already created", 400));
  }

  await Subadmin.create({ userName, password, email, name });
  res.status(200).json({
    success: true,
    message: "Successfully Hr Created",
  });
});
/* ===================================================
        Create Admin (/api/v1/admin/create) (req : POST)
   =================================================== */
exports.adminCreate = catchAsyncError(async (req, res, next) => {
  const { userName, password, email, name } = req.body;
  if (!userName | !password) {
    return next(new ErrorHandler("Please enter username & password", 400));
  }
  if (!email | !name) {
    return next(new ErrorHandler("Please enter email & fullname", 400));
  }

  const user = await Admin.findOne({ userName });
  if (user) {
    return next(new ErrorHandler("This username is already created", 400));
  }

  await Admin.create({ userName, password, email, name });
  res.status(200).json({
    success: true,
    message: "Successfully Admin Created",
  });
});

/* ===================================================
        Create Manager (/api/v1/manager/create) (req : POST)
   =================================================== */
exports.managerCreate = catchAsyncError(async (req, res, next) => {
  const { userName, password, email, name, mobile, id, address, salary } =
    req.body;
  if (!userName | !password) {
    return next(new ErrorHandler("Please enter username & password", 400));
  }
  const user = await Manager.findOne({ userName });
  if (user) {
    return next(new ErrorHandler("This username is already created", 400));
  }
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 300,
    height: 300,
    crop: "scale",
  });
  const cv = await cloudinary.v2.uploader.upload(req.body.cv, {
    folder: "avatars",
    width: 300,
    height: 300,
    crop: "scale",
  });

  await Manager.create({
    userName,
    password,
    email,
    name,
    mobile,
    id,
    address,
    salary,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
      // public_id: "myCloud.public_id",
      // url: "myCloud.secure_url",
    },
    cv: {
      public_id: cv.public_id,
      url: cv.secure_url,
      // public_id: "myCloud.public_id",
      // url: "myCloud.secure_url",
    },
  });
  res.status(200).json({
    success: true,
    message: "Successfully Employee Created",
  });
});
/* ===================================================
        Get All Manager (/api/v1/get/manager) (req : Get)
   =================================================== */
exports.getAllManager = catchAsyncError(async (req, res, next) => {
  const apifeatures = new ApiFetaures(Manager.find(), req.query).nameSearch();
  const employee = await apifeatures.query;

  res.status(200).json({
    success: true,
    employee,
  });
});

/* ===================================================
        Get Single Client (/api/v1/manager/:id) (req : Get)
   =================================================== */
exports.getSingleManager = catchAsyncError(async (req, res, next) => {
  const employee = await Manager.findById(req.params.id);
  if (!employee) {
    return next(new ErrorHandler("Manager Not Found", 404));
  }
  res.status(200).json({
    success: true,
    employee,
  });
});
/* ===================================================
        Update Manager (/api/v1/manager/update/:id) (req : Get)
   =================================================== */
exports.updateManager = catchAsyncError(async (req, res, next) => {
  const employee = await Manager.findById(req.params.id);
  if (!employee) {
    return next(new ErrorHandler("Client Not Found", 404));
  }
  const userData = {
    userName: req.body.userName,
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    id: req.body.id,
    salary: req.body.salary,
    address: req.body.address,
    role: req.body.role,
    salaryAproved: req.body.salaryAproved,
  };
  await Manager.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const newEmployee = await Manager.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Updated Succefully",
    employee: newEmployee,
  });
});

/* ===================================================
        Delete Manager (/api/v1/manager/delete/:id) (req : Delete)
   =================================================== */
exports.deleteManager = catchAsyncError(async (req, res, next) => {
  const manager = await Manager.findById(req.params.id);

  if (!manager) {
    return next(new ErrorHandler(`No Manager Found`));
  }
  await Manager.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Successfully Manager Deleted",
  });
});

/* ===================================================
        Create Client (/api/v1/client/create) (req : POST)
   =================================================== */
exports.clientCreate = catchAsyncError(async (req, res, next) => {
  const { userName, password, email, name, mobile, bankAccount, work } =
    req.body;
  if (!userName | !password) {
    return next(new ErrorHandler("Please enter username & password", 400));
  }
  if (!email | !name) {
    return next(new ErrorHandler("Please enter email & fullname", 400));
  }

  const user = await Client.findOne({ userName });
  if (user) {
    return next(new ErrorHandler("This username is already created", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 300,
    height: 300,
    crop: "scale",
  });
  const agriment = await cloudinary.v2.uploader.upload(req.body.agriment, {
    folder: "avatars",
    width: 300,
    height: 300,
    crop: "scale",
  });

  await Client.create({
    userName,
    password,
    email,
    name,
    mobile,
    accountNumber: bankAccount,
    work,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    agriment: {
      url: agriment.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Successfully Client Created",
  });
});

/* ===================================================
        Get All Client (/api/v1/get/client) (req : Get)
   =================================================== */
exports.getAllClient = catchAsyncError(async (req, res, next) => {
  const apifeatures = new ApiFetaures(Client.find(), req.query).nameSearch();
  const client = await apifeatures.query;
  res.status(200).json({
    success: true,
    client,
  });
});
/* ===================================================
        Get Single Client (/api/v1/client/:id) (req : Get)
   =================================================== */
exports.getSingleClient = catchAsyncError(async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return next(new ErrorHandler("Client Not Found", 404));
  }
  res.status(200).json({
    success: true,
    client,
  });
});

/* ===================================================
        Update Client (/api/v1/client/update/:id) (req : Get)
   =================================================== */
exports.updateClient = catchAsyncError(async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return next(new ErrorHandler("Client Not Found", 404));
  }
  const userData = {
    userName: req.body.userName,
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    accountNumber: req.body.bankAccount,
    work: req.body.work,
  };
  await Client.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const newClient = await Client.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Updated Succefully",
    client: newClient,
  });
});
/* ===================================================
        Delete Client (/api/v1/client/delete/:id) (req : Delete)
=================================================== */
exports.deleteClient = catchAsyncError(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorHandler(`No Client Found`));
  }
  await Client.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Successfully Client Deleted",
  });
});

/* ===================================================
        Create Project (/api/v1/project/create) (req : POST)
   =================================================== */
exports.projectCreate = catchAsyncError(async (req, res, next) => {
  if (!req.body.deadline) {
    return next(new ErrorHandler(`Please Enter a Deadline`));
  }
  const deadline = new Date(req.body.deadline);
  if (!req.body.clientId) {
    return next(new ErrorHandler(`Please Select a Client`));
  }
  if (!req.body.managerId) {
    return next(new ErrorHandler(`Please Select a Manager`));
  }
  const projectData = {
    name: req.body.name,
    owner: req.user._id,
    plannedCost: req.body.actualCost,
    client: req.body.clientId,
    manager: req.body.managerId,
    code: req.body.code,
    description: req.body.description,
    payable: req.body.payable,
    due: req.body.payable,
    deadline: deadline,
  };

  const project = await Project.create(projectData);
  const manager = await Manager.findById(req.body.managerId);
  const client = await Client.findById(req.body.clientId);

  await Manager.findByIdAndUpdate(req.body.managerId, {
    activeProject: project._id,
  });
  await Client.findByIdAndUpdate(req.body.clientId, {
    activeProject: project._id,
  });
  await manager.allProject.push(project._id);
  await client.allProject.push(project._id);
  await manager.save();
  await client.save();
  res.status(200).json({
    success: true,
    message: "Successfully Project Created",
  });
});
/* ===================================================
        Get All Project (/api/v1/get/project) (req : Get)
   =================================================== */
exports.getAllProject = catchAsyncError(async (req, res, next) => {
  const apifeatures = new ApiFetaures(
    Project.find(),
    req.query
  ).projectSearch();
  const project = await apifeatures.query;

  res.status(200).json({
    success: true,
    project,
  });
});

/* ===================================================
        Get Single Project (/api/v1/get/project/:id) (req : Get)
   =================================================== */
exports.getProject = catchAsyncError(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorHandler(`No Project Found`));
  }
  res.status(200).json({
    success: true,
    project,
  });
});

/* =================================================================
        Get All Manager (/api/v1/project/manager) (req : Get)
   ==================================================================== */
exports.getProjectManager = catchAsyncError(async (req, res, next) => {
  const manager = await Manager.find({ role: "Manager" });
  // console.log(manager);

  res.status(200).json({
    success: true,
    manager: manager,
  });
});

/* =================================================================
        Get All Client (/api/v1/project/client) (req : Get)
   ==================================================================== */
exports.getProjectClient = catchAsyncError(async (req, res, next) => {
  const client = await Client.find();

  res.status(200).json({
    success: true,
    client: client,
  });
});

/* ===================================================
        Create Payment (/api/v1/payment/create) (req : POST)
   =================================================== */
exports.paymentCreate = catchAsyncError(async (req, res, next) => {
  const { amount, employeeId, date } = req.body;
  if (!employeeId) {
    return next(new ErrorHandler(`Employee Not Found`));
  }
  const salary = await Salary.create({
    amount,
    employee: employeeId,
    createdAt: date,
    hr: req.user._id,
  });
  if (salary) {
    await Manager.findByIdAndUpdate(employeeId, { salaryAproved: "Paid" });
  }
  res.status(200).json({
    success: true,
    message: "Successfully Salary Paid",
  });
});
