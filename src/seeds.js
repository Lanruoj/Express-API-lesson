const mongoose = require("mongoose");

const { Role } = require("./models/Role");
const { User } = require("./models/User");
const { Post } = require("./models/Post");
const { hashString } = require("./controllers/UserFunctions");

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

const users = [
  {
    username: "seedUser1",
    email: "seed1@email.com",
    password: null,
    country: "Australia",
    role: null,
  },
  {
    username: "seedUser2",
    email: "seed2@email.com",
    password: null,
    country: "TheBestOne",
    role: null,
  },
];

const posts = [
  {
    title: "Some seeded post",
    description: "Very cool. Best post. Huge post. No other posts like it!",
    author: null,
  },
  {
    title: "Some other seeded post",
    description: "Very cool. Best post. Huge post. One other post like it!",
    author: null,
  },
  {
    title: "Another seeded post",
    description: "Very cool. Best post. Huge post. Two other posts like it!",
    author: null,
  },
];

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
      // If WIPE=true, wipe database
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
    let rolesCreated = await Role.insertMany(roles);
    // Iterate through User seeds and hash passwords
    for (const user of users) {
      // Set password with a randomly generated hash
      user.password = await hashString(process.env.USER_SEED_PASSWORD_STRING);
      // Pick a random role from the roles and set for User
      user.role =
        rolesCreated[Math.floor(Math.random() * rolesCreated.length)].id;
    }
    // Save Users to database
    const usersCreated = await User.insertMany(users);
    // Assign random author to each Post
    for (const post of posts) {
      post.author =
        usersCreated[Math.floor(Math.random() * usersCreated.length)].id;
    }
    const postsCreated = await Post.insertMany(posts);
    // Save Posts to database
    console.log("Database seeded");
  })
  .then(() => {
    // Disconnect from database
    mongoose.connection.close();
    console.log("Seed connection closed");
  });

// NODE_ENV=development WIPE=true node src/seeds.js
