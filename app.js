const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const errorMiddleware = require("./backend/middleware/error");
const path = require("path");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  fileUpload({ limits: { fieldSize: 50 * 1024 * 1024 }, useTempFiles: true })
);
// app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ["*"]);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

// This are all route import
//Route Imports
const user = require("./backend/routes/authRoutes");
const Admin = require("./backend/routes/adminRoutes");
const subadmin = require("./backend/routes/hrRoutes");
const manager = require("./backend/routes/managerRoutes");
const client = require("./backend/routes/clientRoutes");

app.use("/api/v1", user);
app.use("/api/v1", Admin);
app.use("/api/v1", subadmin);
app.use("/api/v1", manager);
app.use("/api/v1", client);

app.use(errorMiddleware);

module.exports = app;
