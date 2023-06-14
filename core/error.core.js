const logger = require("./log.core");

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

const errorEnum = {
  AUTH001: "UNAUTHORIZED",
  AUTH002: "USERNAME EXISTS",

  INPUT001: "INVALID INPUT",
  INPUT002: "DID NOT FIND RESOURCE",
};

function sendErrorResponse(err, req, res, next) {
  let httpCode = 500;
  const errorResponse = {
    msg: "Something went wrong",
    errorCode: "G001",
  };
  if (err instanceof AppError) {
    httpCode = err.httpCode;
    logger.info(err);
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
  logger.info("final http", httpCode);
  logger.info("error res", errorResponse);

  res.status(httpCode).send(errorResponse);
}

module.exports = {
  sendErrorResponse,
  AppError,
};
