const express = require("express");
const router = express.Router();

const { getUsersWithRole, getAllRoles } = require("./RoleFunctions");

// Get all Roles from database
// [GET] /roles
router.get("/", async (request, response) => {
  const roles = await getAllRoles();

  return response.json({
    data: roles,
  });
});

// Show all Users with specified Role from database
// [GET] /roles/:roleName
router.get("/:roleName", async (request, response) => {
  const roleName = request.params.roleName || null;
  const usersWithRole = getUsersWithRole(roleName);

  return response.json({
    data: usersWithRole,
  });
});

module.exports = router;
