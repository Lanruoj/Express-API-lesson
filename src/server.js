// Make the environment variables from .env available for use
const dotenv = require("dotenv");
dotenv.config();
// Configure environment variables from .env
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

// Create app instance using Express
const express = require("express");
const app = express();

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
