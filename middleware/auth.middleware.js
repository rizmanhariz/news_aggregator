const jwt = require("jsonwebtoken");
const { AppError } = require("../core/error.core");
const { UserModel } = require("../models/user.model");

function checkSecret(req, res, next) {
  if (req.header("auth_secret") !== process.env.AUTH_SECRET) {
    throw new AppError(400, "AUTH001");
  }

  next();
}

function checkIsAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    throw new AppError(400, "AUTH001", true, "NOT ADMIN");
  }
  next();
}

async function authenticateUser(req, res, next) {
  let user;
  // validate jwt
  const token = req.header("token");

  if (token) {
    // token exists - attempt to validate
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      user = await UserModel.findOne(
        { _id: tokenData.id },
        { username: 1, isAdmin: 1 },
      );
    } catch (err) {
      next(new AppError(401, "AUTH001"));
    }

    req.user = user;
  }

  next();
}

function checkUserLoggedIn(req, res, next) {
  if (!req.user) {
    throw new AppError(401, "AUTH001");
  }
  next();
}

module.exports = {
  checkSecret,
  checkIsAdmin,
  authenticateUser,
  checkUserLoggedIn,
};
