const mongoose = require("mongoose");
const { databaseConnector } = require("./database");

const { Role } = require("./models/Role");
const { User } = require("./models/User");
const { Post } = require("./models/Post");

const dotenv = require("dotenv");
dotenv.config();

const roles = [
  {
    name: "regular",
    description:
      "A regular user can view, create and read data. They can edit and delete only their own data.",
  },
  {
    name: "admin",
    description:
      "An admin user has full access permissions to do anything within this API.",
  },
  {
    name: "banned",
    description: "A banned user can read data, but cannot do anything else.",
  },
];
