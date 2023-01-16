const express = require("express");
const router = express.Router();

const { getUsersWithRole, getAllRoles } = require("./RoleFunctions");

// Show all roles
router.get("/", async (request, response) => {
  let responseData = {};
  responseData = await getAllRoles();

  return response.json({
    data: responseData,
  });
});

module.exports = router;
