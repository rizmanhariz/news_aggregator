const logger = require("./log.core");
const errorEnum = require("./errors.json");

class AppError {
  constructor(
    httpCode = 500,
    errorCode = "G001",
    joinMessage = false,
    customMessage = "",
  ) {
    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.joinMessage = joinMessage;
    this.customMessage = customMessage;
  }
}

function sendErrorResponse(err, req, res, next) {
  let httpCode = 500;
  const errorResponse = {
    msg: "Something went wrong",
    errorCode: "G001",
  };
  if (err instanceof AppError) {
    httpCode = err.httpCode;
    if (err.errorCode) {
      errorResponse.errorCode = err.errorCode;
    }

    if (errorEnum[err.errorCode]) {
      errorResponse.msg = errorEnum[err.errorCode];
    }

    if (err.customMessage) {
      if (err.joinMessage) {
        errorResponse.msg = `${errorResponse.msg} - ${err.customMessage}`;
      } else {
        errorResponse.detail = err.customMessage;
      }
    }
  }

  logger.error(err);

  res.status(httpCode).send(errorResponse);
}

module.exports = {
  sendErrorResponse,
  AppError,
};
