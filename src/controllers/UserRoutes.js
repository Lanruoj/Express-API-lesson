const express = require("express");
const router = express.Router();

const { User } = require("../models/User");

const {
  validateHashedData,
  generateUserJWT,
  verifyUserJWT,
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
} = require("./UserFunctions");

// Register a new User
// [POST] /users/register
router.post("/register", async (request, response) => {
  const userDetails = {
    email: request.body.email,
    password: request.body.password,
    username: request.body.username,
    country: request.body.country,
    roleID: request.body.roleID,
  };
  const newUser = await createUser(userDetails);

  return response.json({
    user: newUser,
  });
});

// Login an existing User
// [POST] /users/login
router.post("/login", async (request, response) => {
  // Find existing User with provided email
  const targetUser = await User.findOne({ email: request.body.email }).exec();
  // Verify that the provided password matches hashed password
  if (await validateHashedData(request.body.password, targetUser.password)) {
    // Encrypt user data and generate JWT
    const encryptedUserJWT = await generateUserJWT({
      userID: targetUser.id,
      email: targetUser.email,
      password: targetUser.password,
    });

    return response.json(encryptedUserJWT);
  } else {
    return response.status(400).json({ message: "Invalid user details" });
  }
});

// Refresh JWT
// [POST] /users/refresh
router.post("/refresh", async (request, response) => {
  // Get provided JWT from request body
  const oldJWT = request.body.jwt;
  // Verify and generate new JWT
  const newJWT = await verifyUserJWT(oldToken).catch((error) => {
    return { error: error.message };
  });

  return response.json(refreshResult);
});

// Update User details
// [PUT] /users/:userID
router.put("/:userID", async (request, response) => {
  const userDetails = {
    userID: request.params.userID,
    updatedData: request.body.newUserData,
  };

  const updatedUser = await updateUser(userDetails);
  return response.json(updatedUser);
});

// Delete a User
// [DELETE] /users/:userID
router.delete("/:userID", async (request, response) => {
  const deletedUser = await deletedUser(request.params.userID);
  return response.json(deletedUser);
});

// Get all Users
// [GET] /users
router.get("/", async (request, response) => {
  const allUsers = await getAllUsers();

  return response.json({
    count: allUsers.length,
    users: allUsers,
  });
});

// Get a specific User by ID
// [GET] /users/:userID
router.get("/:userID", async (request, response) => {
  const user = await getUserByID(request.params.userID);
  return response.json(user);
});

module.exports = router;
