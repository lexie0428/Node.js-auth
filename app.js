const express = require("express");
const useMiddleware = require("./middleware");
const indexRouter = require("./routes/index");
const homeRouter = require("./routes/home");
const useErrorHandlers = require("./middleware/error-handlers");

const app = express();
useMiddleware(app);

app.use("/", indexRouter);
app.use("/", homeRouter);

useErrorHandlers(app);

module.exports = app;
