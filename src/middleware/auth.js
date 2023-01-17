const { User } = require("../models/User");

async function uniqueEmailCheck(request, response, next) {
  const isEmailInUse = await User.exists({ email: request.body.email }).exec();
  if (isEmailInUse) {
    next(new Error("Email is already in use"));
  } else {
    next();
  }
}

module.exports = { uniqueEmailCheck };
