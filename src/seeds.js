const mongoose = require("mongoose");

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

const users = [];

const posts = [];

// Configure database environment settings
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
  })
  .then(async () => {
    // Parse all collections from database object
    if (process.env.WIPE == "true") {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      collections
        .map((collection) => collection.name)
        .forEach(async (collectionName) => {
          // Drop all collections from database
          mongoose.connection.db.dropCollection(collectionName);
        });
      console.log("Database wiped");
    }
  })
  .then(async () => {
    // Add seeds to database
    await Role.insertMany(roles);
    console.log("Database seeded");
  })
  .then(() => {
    // Disconnect from database
    mongoose.connection.close();
    console.log("Seed connection closed");
  });

// NODE_ENV=development WIPE=true node src/seeds.js
