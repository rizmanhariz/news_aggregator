const { AppError } = require("../core/error.core");
function checkSecret(req, res, next) {
  if (req.header("auth_secret") !== process.env.AUTH_SECRET) {
    throw new AppError(400, "AUTH001");
  };

  next();
};

function checkIsAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    throw new AppError(400, "AUTH001");
  }
  next();
}

module.exports = {
  checkSecret,
  checkIsAdmin,
};