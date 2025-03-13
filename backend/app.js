const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3002',
  // origin: 'https://akledger.softwisesol.com/',
  credentials: true,
}));

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
const task = require("./routes/taskRoute");
const user = require("./routes/userRoute");
const assignedtask = require("./routes/assignedTaskRoute");
const role = require("./routes/roleRoute");
const history = require("./routes/historyRoute");
const customer = require("./routes/customerRoute");
const shop = require("./routes/shopRoute");

app.use("/api/v1", task);
app.use("/api/v1", user);
app.use("/api/v1", assignedtask);
app.use("/api/v1", role);
app.use("/api/v1", history);
app.use("/api/v1", customer);
app.use("/api/v1", shop);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;