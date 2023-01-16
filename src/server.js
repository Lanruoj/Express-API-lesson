// Make the environment variables from .env available for use
const dotenv = require("dotenv");
dotenv.config();
// Configure environment variables from .env
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

// Create Express server and configure basic settings
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure basic Helmet settings on our app
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
);

// Configure basic CORS settings
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Configure Mongoose & database environment settings
const mongoose = require("mongoose");
let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
  case "test":
    databaseURL = "mongodb://localhost:27017/ExpressAPI-test";
    break;
  case "development":
    databaseURL = "mongodb://localhost:27017/ExpressAPI-dev";
    break;
  case "production":
    databaseURL = process.env.DATABASE_URL;
    break;
  default:
    console.error(
      "Incorrect JavaScript environment specified, database will not be connected"
    );
    break;
}
// Connect to database
const { databaseConnector } = require("./database");
databaseConnector(databaseURL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log(`An error occurred connecting to the database:
  ${error}`);
  });

app.get("databaseHealth", (request, response) => {
  const databaseState = mongoose.connection.readyState;
  const databaseName = mongoose.connection.name;
  const databaseModels = mongoose.connection.modelNames();
  const databaseHost = mongoose.connection.host;

  return response.json({
    readyState: databaseState,
    databaseName: databaseName,
    databaseModels: databaseModels,
    databaseHost: databaseHost,
  });
});

// Test route
app.get("/", (request, response) => {
  response.json({
    message: "Hello World!",
  });
});

// If no routes / middleware was triggered, run this
app.get("*", (request, response) => {
  response.status(404).json({
    message: "No route with that path found!",
    attemptedPath: request.path,
  });
});

module.exports = { app, HOST, PORT };
