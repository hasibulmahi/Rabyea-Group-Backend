const crypto = require("crypto");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Admin = require("../models/User/adminModel");
const Client = require("../models/User/clientModel");
const Project = require("../models/Projects/projectModel");
const Expenses = require("../models/Projects/projectExpensesModel");
const Deposit = require("../models/Projects/clientDepositModel");
const AdminDeposit = require("../models/Admin/adminDepositModel");
const AdminWithdraw = require("../models/Admin/adminWithdrawModel");
const Salary = require("../models/Utils/salaryModel");

/* ===================================================
        Total Revenue (/api/v1/total/revenue) (req : GET)
   =================================================== */
exports.getRevenue = catchAsyncError(async (req, res, next) => {
  const totalDepositArray = await Deposit.find();
  const totalExpensesArray = await Expenses.find();
  const totalAdminDeposit = await AdminDeposit.find();
  const totalAdminWithdraw = await AdminWithdraw.find();
  const totalSalary = await Salary.find();

  //Total Revenue
  const expense = totalExpensesArray.map((val) => {
    return val.amount;
  });
  const deposit = totalDepositArray.map((val) => {
    return val.amount;
  });
  const admindeposit = totalAdminDeposit.map((val) => {
    return val.amount;
  });
  const adminwithdraw = totalAdminWithdraw.map((val) => {
    return val.amount;
  });
  const salary = totalSalary.map((val) => {
    return val.amount;
  });
  let totalExpenses = 0;
  let totalDeposit = 0;
  let totaladminDeposit = 0;
  let totaladminWithdraw = 0;
  let totalSalaryAmount = 0;
  for (var i = 0; i < expense.length; i++) {
    totalExpenses = totalExpenses + expense[i];
  }
  for (var i = 0; i < deposit.length; i++) {
    totalDeposit = totalDeposit + deposit[i];
  }

  for (var i = 0; i < admindeposit.length; i++) {
    totaladminDeposit = totaladminDeposit + admindeposit[i];
  }

  for (var i = 0; i < adminwithdraw.length; i++) {
    totaladminWithdraw = totaladminWithdraw + adminwithdraw[i];
  }

  for (var i = 0; i < salary.length; i++) {
    totalSalaryAmount = totalSalaryAmount + salary[i];
  }

  const revenue =
    totalDeposit +
    totaladminDeposit -
    totalExpenses -
    totaladminWithdraw -
    totalSalaryAmount;

  //Daily Array Calculation
  function ArrayCalculation(Array) {
    let amount = 0;
    Array.forEach((val) => {
      amount = val.amount + amount;
    });
    return amount;
  }

  //Daily Revenue
  const today = new Date();
  let date = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  const todayMatch = `${date}/${month}/${year}`;

  let dailyExpeneses = [];
  for (var i = 0; i < totalExpensesArray.length; i++) {
    let date = totalExpensesArray[i].createdAt.getDate();
    let month = totalExpensesArray[i].createdAt.getMonth();
    let year = totalExpensesArray[i].createdAt.getFullYear();
    const valueMatch = `${date}/${month}/${year}`;
    if (todayMatch == valueMatch) {
      dailyExpeneses.push(totalExpensesArray[i]);
    }
  }
  const dailyEAmount = ArrayCalculation(dailyExpeneses);

  let dailyDeposit = [];
  for (var i = 0; i < totalDepositArray.length; i++) {
    let date = totalDepositArray[i].createdAt.getDate();
    let month = totalDepositArray[i].createdAt.getMonth();
    let year = totalDepositArray[i].createdAt.getFullYear();
    const valueMatch = `${date}/${month}/${year}`;
    if (todayMatch === valueMatch) {
      dailyDeposit.push(totalDepositArray[i]);
    }
  }
  const dailyDAmount = ArrayCalculation(dailyDeposit);

  let dailyAdminDeposit = [];
  for (var i = 0; i < totalAdminDeposit.length; i++) {
    let date = totalAdminDeposit[i].createdAt.getDate();
    let month = totalAdminDeposit[i].createdAt.getMonth();
    let year = totalAdminDeposit[i].createdAt.getFullYear();
    const valueMatch = `${date}/${month}/${year}`;
    if (todayMatch === valueMatch) {
      dailyAdminDeposit.push(totalAdminDeposit[i]);
    }
  }
  const dailyADAmount = ArrayCalculation(dailyAdminDeposit);

  let dailyAdminWithdraw = [];
  for (var i = 0; i < totalAdminWithdraw.length; i++) {
    let date = totalAdminWithdraw[i].createdAt.getDate();
    let month = totalAdminWithdraw[i].createdAt.getMonth();
    let year = totalAdminWithdraw[i].createdAt.getFullYear();
    const valueMatch = `${date}/${month}/${year}`;
    if (todayMatch === valueMatch) {
      dailyAdminWithdraw.push(totalAdminWithdraw[i]);
    }
  }
  const dailyAWAmount = ArrayCalculation(dailyAdminWithdraw);

  let dailySalary = [];
  for (var i = 0; i < totalSalary.length; i++) {
    let date = totalSalary[i].createdAt.getDate();
    let month = totalSalary[i].createdAt.getMonth();
    let year = totalSalary[i].createdAt.getFullYear();
    const valueMatch = `${date}/${month}/${year}`;
    if (todayMatch === valueMatch) {
      dailySalary.push(totalSalary[i]);
    }
  }
  const dailySAmount = ArrayCalculation(dailySalary);
  const dailyRevenue =
    dailyDAmount + dailyADAmount - dailyEAmount - dailyAWAmount - dailySAmount;
  res.status(200).json({
    success: true,
    revenue,
    dailyRevenue,
  });
});

/* ===================================================
        Monthly Revenue (/api/v1/monthly/revenue) (req : GET)
   =================================================== */
exports.getMonthlyRevenue = catchAsyncError(async (req, res, next) => {
  const totalDepositArray = await Deposit.find();
  const totalExpensesArray = await Expenses.find();
  const totalAdminDeposit = await AdminDeposit.find();
  const totalAdminWithdraw = await AdminWithdraw.find();
  const totalSalary = await Salary.find();

  //Monthly Calculation Array (Deposit & Expense)
  function ArrayCalculation(Array) {
    let amount = 0;
    Array.forEach((val) => {
      amount = val.amount + amount;
    });
    return amount;
  }
  //Yearly Expense

  const DATE = new Date(Date.now());

  let yearlyExpenses = [];
  let yearlyDeposit = [];
  let yearlyADeposit = [];
  let yearlyAWithdraw = [];
  let yearlySalary = [];

  yearlyExpenses = totalExpensesArray.filter(
    (val) => val.createdAt.getFullYear() === DATE.getFullYear()
  );
  yearlyDeposit = totalDepositArray.filter(
    (val) => val.createdAt.getFullYear() === DATE.getFullYear()
  );
  yearlyADeposit = totalAdminDeposit.filter(
    (val) => val.createdAt.getFullYear() === DATE.getFullYear()
  );
  yearlyAWithdraw = totalAdminWithdraw.filter(
    (val) => val.createdAt.getFullYear() === DATE.getFullYear()
  );
  yearlySalary = totalSalary.filter(
    (val) => val.createdAt.getFullYear() === DATE.getFullYear()
  );

  //Monthly Expenses
  const janExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 0
  );
  const janEAmount = ArrayCalculation(janExpeneses);

  //February
  const febExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 1
  );
  const febEAmount = ArrayCalculation(febExpeneses);

  //March
  const marExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 2
  );
  const marEAmount = ArrayCalculation(marExpeneses);

  //April
  const aprExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 3
  );
  const aprEAmount = ArrayCalculation(aprExpeneses);

  //May
  const mayExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 4
  );
  const mayEAmount = ArrayCalculation(mayExpeneses);

  //June
  const junExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 5
  );
  const junEAmount = ArrayCalculation(junExpeneses);

  //July
  const julExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 6
  );
  const julEAmount = ArrayCalculation(julExpeneses);

  //Augest
  const augExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 7
  );
  const augEAmount = ArrayCalculation(augExpeneses);

  //September
  const sepExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 8
  );
  const sepEAmount = ArrayCalculation(sepExpeneses);

  //October
  const octExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 9
  );
  const octEAmount = ArrayCalculation(octExpeneses);

  //November
  const novExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 10
  );
  const novEAmount = ArrayCalculation(novExpeneses);

  //Decempber
  const decExpeneses = yearlyExpenses.filter(
    (val) => val.createdAt.getMonth() === 11
  );
  const decEAmount = ArrayCalculation(decExpeneses);

  //Monthly Deposit
  const janDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 0
  );
  const janDAmount = ArrayCalculation(janDeposit);

  //February
  const febDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 1
  );
  const febDAmount = ArrayCalculation(febDeposit);

  //March
  const marDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 2
  );
  const marDAmount = ArrayCalculation(marDeposit);

  //April
  const aprDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 3
  );
  const aprDAmount = ArrayCalculation(aprDeposit);

  //May
  const mayDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 4
  );
  const mayDAmount = ArrayCalculation(mayDeposit);

  //June
  const junDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 5
  );
  const junDAmount = ArrayCalculation(junDeposit);

  //July
  const julDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 6
  );
  const julDAmount = ArrayCalculation(julDeposit);

  //Augest
  const augDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 7
  );
  const augDAmount = ArrayCalculation(augDeposit);

  //September
  const sepDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 8
  );
  const sepDAmount = ArrayCalculation(sepDeposit);

  //October
  const octDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 9
  );
  const octDAmount = ArrayCalculation(octDeposit);

  //November
  const novDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 10
  );
  const novDAmount = ArrayCalculation(novDeposit);

  //Decempber
  const decDeposit = yearlyDeposit.filter(
    (val) => val.createdAt.getMonth() === 11
  );
  const decDAmount = ArrayCalculation(decDeposit);

  //Monthly Admin Deposit
  const janADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 0
  );
  const janADAmount = ArrayCalculation(janADeposit);

  //February
  const febADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 1
  );
  const febADAmount = ArrayCalculation(febADeposit);

  //March
  const marADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 2
  );
  const marADAmount = ArrayCalculation(marADeposit);

  //April
  const aprADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 3
  );
  const aprADAmount = ArrayCalculation(aprADeposit);

  //May
  const mayADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 4
  );
  const mayADAmount = ArrayCalculation(mayADeposit);

  //June
  const junADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 5
  );
  const junADAmount = ArrayCalculation(junADeposit);

  //July
  const julADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 6
  );
  const julADAmount = ArrayCalculation(julADeposit);

  //Augest
  const augADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 7
  );
  const augADAmount = ArrayCalculation(augADeposit);

  //September
  const sepADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 8
  );
  const sepADAmount = ArrayCalculation(sepADeposit);

  //October
  const octADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 9
  );
  const octADAmount = ArrayCalculation(octADeposit);

  //November
  const novADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 10
  );
  const novADAmount = ArrayCalculation(novADeposit);

  //Decempber
  const decADeposit = yearlyADeposit.filter(
    (val) => val.createdAt.getMonth() === 11
  );
  const decADAmount = ArrayCalculation(decADeposit);

  //Monthly Admin Withdraw
  const janAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 0
  );
  const janAWAmount = ArrayCalculation(janAWithdraw);

  //February
  const febAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 1
  );
  const febAWAmount = ArrayCalculation(febAWithdraw);

  //March
  const marAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 2
  );
  const marAWAmount = ArrayCalculation(marAWithdraw);

  //April
  const aprAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 3
  );
  const aprAWAmount = ArrayCalculation(aprAWithdraw);

  //May
  const mayAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 4
  );
  const mayAWAmount = ArrayCalculation(mayAWithdraw);

  //June
  const junAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 5
  );
  const junAWAmount = ArrayCalculation(junAWithdraw);

  //July
  const julAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 6
  );
  const julAWAmount = ArrayCalculation(julAWithdraw);

  //Augest
  const augAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 7
  );
  const augAWAmount = ArrayCalculation(augAWithdraw);

  //September
  const sepAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 8
  );
  const sepAWAmount = ArrayCalculation(sepAWithdraw);

  //October
  const octAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 9
  );
  const octAWAmount = ArrayCalculation(octAWithdraw);

  //November
  const novAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 10
  );
  const novAWAmount = ArrayCalculation(novAWithdraw);

  //Decempber
  const decAWithdraw = yearlyAWithdraw.filter(
    (val) => val.createdAt.getMonth() === 11
  );
  const decAWAmount = ArrayCalculation(decAWithdraw);

  //Monthly Salary
  const janSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 0
  );
  const janSAmount = ArrayCalculation(janSalary);

  //February
  const febSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 1
  );
  const febSAmount = ArrayCalculation(febSalary);

  //March
  const marSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 2
  );
  const marSAmount = ArrayCalculation(marSalary);

  //April
  const aprSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 3
  );
  const aprSAmount = ArrayCalculation(aprSalary);

  //May
  const maySalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 4
  );
  const maySAmount = ArrayCalculation(maySalary);

  //June
  const junSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 5
  );
  const junSAmount = ArrayCalculation(junSalary);

  //July
  const julSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 6
  );
  const julSAmount = ArrayCalculation(julSalary);

  //Augest
  const augSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 7
  );
  const augSAmount = ArrayCalculation(augSalary);

  //September
  const sepSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 8
  );
  const sepSAmount = ArrayCalculation(sepSalary);

  //October
  const octSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 9
  );
  const octSAmount = ArrayCalculation(octSalary);

  //November
  const novSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 10
  );
  const novSAmount = ArrayCalculation(novSalary);

  //Decempber
  const decSalary = yearlySalary.filter(
    (val) => val.createdAt.getMonth() === 11
  );
  const decSAmount = ArrayCalculation(decSalary);

  const janRevenue =
    janDAmount - janEAmount + janADAmount - janAWAmount - janSAmount;
  const febRevenue =
    febDAmount - febEAmount + febADAmount - febAWAmount - febSAmount;
  const marRevenue =
    marDAmount - marEAmount + marADAmount - marAWAmount - marSAmount;
  const aprRevenue =
    aprDAmount - aprEAmount + aprADAmount - aprAWAmount - aprSAmount;
  const mayRevenue =
    mayDAmount - mayEAmount + mayADAmount - mayAWAmount - maySAmount;
  const junRevenue =
    junDAmount - junEAmount + junADAmount - junAWAmount - junSAmount;
  const julRevenue =
    julDAmount - julEAmount + julADAmount - julAWAmount - julSAmount;
  const augRevenue =
    augDAmount - augEAmount + augADAmount - augAWAmount - augSAmount;
  const sepRevenue =
    sepDAmount - sepEAmount + sepADAmount - sepAWAmount - sepSAmount;
  const octRevenue =
    octDAmount - octEAmount + octADAmount - octAWAmount - octSAmount;
  const novRevenue =
    novDAmount - novEAmount + novADAmount - novAWAmount - novSAmount;
  const decRevenue =
    decDAmount - decEAmount + decADAmount - decAWAmount - decSAmount;

  const monthlyRevenueArray = [
    janRevenue,
    febRevenue,
    marRevenue,
    aprRevenue,
    mayRevenue,
    junRevenue,
    julRevenue,
    augRevenue,
    sepRevenue,
    octRevenue,
    novRevenue,
    decRevenue,
  ];

  res.status(200).json({
    success: true,
    monthlyRevenueArray,
  });
});

/* ======================================================================
        All Project (/api/v1/all/project) (req : Get)
   ====================================================================== */
exports.getAllProject = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    success: true,
    projects,
  });
});

/* ======================================================================
        Create Deposit (/api/v1/create/deposit) (req : Post)
   ====================================================================== */
exports.createDeposit = catchAsyncError(async (req, res, next) => {
  const { title, amount } = req.body;
  if (!title | !amount) {
    return next(new ErrorHandler("Please enter title & amount", 400));
  }
  const data = {
    title: title,
    amount: amount,
    owner: req.user._id,
  };
  const deposit = await AdminDeposit.create(data);
  if (deposit) {
    const user = await Admin.findById(req.user._id);
    await user.totalDeposit.push(deposit._id);
    await user.save();
  }
  res.status(200).json({
    success: true,
    message: "Deposit Successfull",
  });
});

/* ======================================================================
        Create Withdraw (/api/v1/create/withdraw) (req : Post)
   ====================================================================== */
exports.createWithdraw = catchAsyncError(async (req, res, next) => {
  const { title, amount } = req.body;
  if (!title | !amount) {
    return next(new ErrorHandler("Please enter title & amount", 400));
  }
  const data = {
    title: title,
    amount: amount,
    owner: req.user._id,
  };
  const withdraw = await AdminWithdraw.create(data);
  if (withdraw) {
    const user = await Admin.findById(req.user._id);
    await user.totalWithdraw.push(withdraw._id);
    await user.save();
  }
  res.status(200).json({
    success: true,
    message: "Withdraw Successfull",
  });
});

/* ======================================================================
        All Deposit (/api/v1/admin/deposit) (req : get)
   ====================================================================== */
exports.allDeposit = catchAsyncError(async (req, res, next) => {
  const deposit = await AdminDeposit.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    adminDeposit: deposit,
  });
});

/* ======================================================================
        All Withdraw (/api/v1/admin/withdraw) (req : get)
   ====================================================================== */
exports.allWithdraw = catchAsyncError(async (req, res, next) => {
  const withdraw = await AdminWithdraw.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    adminWithdraw: withdraw,
  });
});

/* ======================================================================
        Delete Deposit (/api/v1/delete/deposit/:id) (req : delete)
   ====================================================================== */
exports.deleteDeposit = catchAsyncError(async (req, res, next) => {
  const deposit = await AdminDeposit.findById(req.params.id);
  const admin = await Admin.findById(req.user._id);
  if (!deposit) {
    return next(new ErrorHandler("Deposit Not Found", 404));
  }
  await AdminDeposit.findByIdAndDelete(req.params.id);
  if (admin.totalDeposit.includes(deposit._id)) {
    const index = admin.totalDeposit.indexOf(deposit._id);
    await admin.totalDeposit.splice(0, index);
    await admin.save();
  }
  const allDeposit = await AdminWithdraw.find({ owner: req.user._id });
  res.status(200).json({
    success: true,
    message: "Deposit Delete Successfully",
  });
});
/* ======================================================================
        Delete Withdraw (/api/v1/delete/withdraw/:id) (req : delete)
   ====================================================================== */
exports.deleteWithdraw = catchAsyncError(async (req, res, next) => {
  const withdraw = await AdminWithdraw.findById(req.params.id);
  const admin = await Admin.findById(req.user._id);
  if (!withdraw) {
    return next(new ErrorHandler("Deposit Not Found", 404));
  }
  await AdminWithdraw.findByIdAndDelete(req.params.id);
  if (admin.totalWithdraw.includes(withdraw._id)) {
    const index = admin.totalWithdraw.indexOf(withdraw._id);
    await admin.totalWithdraw.splice(0, index);
    await admin.save();
  }
  const allWithdraw = await AdminWithdraw.find({ owner: req.user._id });
  res.status(200).json({
    success: true,
    message: "Withdraw Delete Successfully",
  });
});

/* ======================================================================
         Top Undapid Customer (/api/v1/top/unpaid/customer) (req : get)
   ====================================================================== */
exports.unpaidCustomer = catchAsyncError(async (req, res, next) => {
  const client = await Client.find().populate({ path: "activeProject" });
  let clientD = [];
  for (var i = 0; i < client.length; i++) {
    clientD.push({
      amount: client[i].activeProject.due,
      client: client[i],
    });
  }
  const topUnpaidCustomer = clientD.sort(function (a, b) {
    return b.amount - a.amount;
  });
  res.status(200).json({
    success: true,
    topUnpaidCustomer,
  });
});

/* ======================================================================
         Top  Customer (/api/v1/top/customer) (req : get)
   ====================================================================== */
exports.topCustomer = catchAsyncError(async (req, res, next) => {
  const client = await Client.find().populate({ path: "totalPay" });
  const clientPay = [];
  for (var i = 0; i < client.length; i++) {
    let sum = 0;
    for (var j = 0; j < client[i].totalPay.length; j++) {
      sum = sum + client[i].totalPay[j].amount;
    }
    clientPay.push({
      amount: sum,
      client: client[i],
    });
  }

  const topCustomer = clientPay.sort(function (a, b) {
    return b.amount - a.amount;
  });

  res.status(200).json({
    success: true,
    topCustomer,
  });
});

/* ======================================================================
         Total Deposit (/api/v1/total/deposit) (req : get)
   ====================================================================== */
exports.totalDeposit = catchAsyncError(async (req, res, next) => {
  const deposit = await AdminDeposit.find().populate({ path: "owner" });
  let totalDeposit = 0;
  for (var i = 0; i < deposit.length; i++) {
    totalDeposit = totalDeposit + deposit[i].amount;
  }
  let chairman = [];
  let md = [];
  for (var i = 0; i < deposit.length; i++) {
    if (deposit[i].owner.code === "Chairman") {
      chairman.push(deposit[i]);
    } else {
      md.push(deposit[i]);
    }
  }
  let totalChairmanDeposit = 0;
  for (var i = 0; i < chairman.length; i++) {
    totalChairmanDeposit = totalChairmanDeposit + chairman[i].amount;
  }
  let totalMDDeposit = 0;
  for (var i = 0; i < md.length; i++) {
    totalMDDeposit = totalMDDeposit + md[i].amount;
  }
  res.status(200).json({
    success: true,
    totalDeposit,
    chairmanDeposit: totalChairmanDeposit,
    mdDeposit: totalMDDeposit,
  });
});

/* ======================================================================
         Total Withdraw (/api/v1/total/withdraw) (req : get)
   ====================================================================== */
exports.totalWithdraw = catchAsyncError(async (req, res, next) => {
  const withdraw = await AdminWithdraw.find().populate({ path: "owner" });
  let totalWithdraw = 0;
  for (var i = 0; i < withdraw.length; i++) {
    totalWithdraw = totalWithdraw + withdraw[i].amount;
  }
  let chairman = [];
  let md = [];
  for (var i = 0; i < withdraw.length; i++) {
    if (withdraw[i].owner.code === "Chairman") {
      chairman.push(withdraw[i]);
    } else {
      md.push(withdraw[i]);
    }
  }
  let totalChairmanWithdraw = 0;
  for (var i = 0; i < chairman.length; i++) {
    totalChairmanWithdraw = totalChairmanWithdraw + chairman[i].amount;
  }
  let totalMDWithdraw = 0;
  for (var i = 0; i < md.length; i++) {
    totalMDWithdraw = totalMDWithdraw + md[i].amount;
  }
  res.status(200).json({
    success: true,
    totalWithdraw,
    chairmanWithdraw: totalChairmanWithdraw,
    mdWithdraw: totalMDWithdraw,
  });
});
