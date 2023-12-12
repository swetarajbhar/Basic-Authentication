const express = require("express");
const timeout = require("connect-timeout");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Load environment variables from a .env file (if it exists)
require("dotenv").config();

const userRoute = require("./apis/src/v1/routes/users/index");

const app = express();

// disable default headers as per Infosec Guidelines
app.disable("x-powered-by");
app.set("etag", false);

app.use(express.text());
app.use(express.json());
app.use(cookieParser());

// timeout middleware
app.use(timeout("1200s"));
app.use(cors());

// custom routes for business logic to be placed below.
app.use("/api", userRoute);

// middleware to check timeout
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

// Define the port to listen on, using the PORT environment variable or a default value (10011)
const port = process.env.PORT;

// Start the Express app and listen on the specified port
app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});

// error handler
process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err);
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
});

module.exports = { app };
