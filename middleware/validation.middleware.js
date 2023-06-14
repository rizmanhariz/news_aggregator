const Joi = require("joi");
const { AppError } = require("../core/error.core");

async function validateGetPublishers(req, res, next) {
  const inputSchema = Joi.object({
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
    name: Joi.string(),
  });

  try {
    await inputSchema.validateAsync(req.query, {
      allowUnknown: false,
      abortEarly: false,
    });
  } catch (err) {
    return next(new AppError(400, "INPUT001", false, err.message));
  }

  return next();
}

async function validateLogin(req, res, next) {
  const inputSchema = Joi.object({
    username: Joi.string().min(5).max(15).required(),
    password: Joi.string().min(5).max(15).required(),
  });

  try {
    await inputSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    return next(new AppError(400, "INPUT001", false, err.message));
  }

  return next();
}

async function validateCreatePublisher(req, res, next) {
  const inputSchema = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required(),
    rss_url: Joi.string().required(),
    isActive: Joi.boolean().required(),
  });

  try {
    await inputSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    return next(new AppError(400, "INPUT001", false, err.message));
  }

  return next();
}

async function validateGetArticles(req, res, next) {
  const inputSchema = Joi.object({
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
  });

  try {
    await inputSchema.validateAsync(req.query, {
      abortEarly: false,
    });
  } catch (err) {
    return next(new AppError(400, "INPUT001", false, err.message));
  }

  return next();
}

module.exports = {
  validateGetPublishers,
  validateLogin,
  validateCreatePublisher,
  validateGetArticles,
};