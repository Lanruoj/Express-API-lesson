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
