// THIS FILE INITIATLIZES THE EXPRESS SERVER AND THE MAIN ROUTES TO OUR DB TABLES

const express = require("express");
const app = express();
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//log out the body to the console.
app.use((req, res, next) => {
  console.log("<___BODY LOGGER START___>");
  console.log(req.body);
  console.log("<___BODY LOGGER END>");
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.anthropic.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'none'"],
    },
  })
);

const baseQuery = `/api/`;

app.get(baseQuery, (req, res) => [
  res.json({
    success: true,
  }),
]);

// Requiring each of our routes - UPDATE AS THESE ARE COMPLETED
app.use("/auth", require("../auth/index")); // for register and login
app.use(baseQuery + "users", require("./users"));
// app.use(baseQuery + "scores", require("./scores"));
app.use(baseQuery + "invite", require("./invite"));
app.use("/anthropic", require("../anthropic/anthropicAPI")); // for Anthropic API routes / endpoints

app.use(express.static(path.join(__dirname, "/../../client/dist")));
app.use("*", express.static(path.join(__dirname, "/../../client/dist")));

app.listen(port, () => {
  console.log(`WoofReading is running at port ${port}`);
});
