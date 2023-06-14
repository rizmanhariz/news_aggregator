const jwt = require("jsonwebtoken");
const { AppError } = require("../core/error.core");
const { UserModel } = require("../models/user.model");
const logger = require("../core/log.core");

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

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    user = await UserModel.findOne(
      { _id: tokenData.id },
      { username: 1, isAdmin: 1 },
    );
  } catch (err) {
    logger.error(err);
  }

  if (!user) {
    next(new AppError(400, "AUTH001"));
  }
  req.user = user;
  next();
}

module.exports = {
  checkSecret,
  checkIsAdmin,
  authenticateUser,
};
