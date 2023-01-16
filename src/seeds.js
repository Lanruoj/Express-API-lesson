const mongoose = require("mongoose");
const { databaseConnector } = require("./database");

const { Role } = require("./models/Role");
const { User } = require("./models/User");
const { Post } = require("./models/Post");

const dotenv = require("dotenv");
dotenv.config();
