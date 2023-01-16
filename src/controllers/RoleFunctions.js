// Import Role & User models
const { Role } = require("../models/Role");
const { User } = require("../models/User");

// Query and return all Roles
async function getAllRoles() {
  return await Role.find({});
}

// Query and return Users with specified Role
async function getUsersWithRole(roleName) {
  let roleID = await Role.findOne({ name: roleName }).exec();
  let usersFound = await User.find({ role: roleID }).exec();

  return usersFound;
}

// Export functions for use in routes
module.exports = {
  getAllRoles,
  getUsersWithRole,
};
