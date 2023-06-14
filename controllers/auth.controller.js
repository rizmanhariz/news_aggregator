const jwt = require("jsonwebtoken");
const { addMinutes } = require("date-fns");
const { createHmac } = require("crypto");
const { UserModel } = require("../models/user.model");
const { AppError } = require("../core/error.core");

function hashPassword(inputPassword) {
  const hash = createHmac("sha256", process.env.HASH_SECRET);
  hash.update(inputPassword);
  return hash.digest("hex");
}

function signJWT(inputData) {
  const exp = addMinutes(new Date(), 60).getTime();
  console.log(exp);
  const token = jwt.sign(
    {
      ...inputData,
      exp,
    },
    process.env.JWT_SECRET,
  );
  return token;
}

async function login(req, res) {
  const { username, password } = req.body;
  const hashedPassword = hashPassword(password);
  const existingUser = await UserModel.findOne({ username, password: hashedPassword });
  if (!existingUser) {
    throw new AppError(400, "AUTH001", true, "INVALID CREDENTIALS");
  }
  const newUser = new UserModel({
    username,
    password: hashedPassword,
  });
  await newUser.save();

  const token = signJWT({ id: newUser._id.toString() });
  return res.send({ token });
}

async function register(req, res) {
  // check user exists
  const { username, password } = req.body;
  const existingUser = await UserModel.countDocuments({ username });
  if (existingUser) {
    throw new AppError(400, "AUTH002");
  }
  const hashedPassword = hashPassword(password);
  const newUser = new UserModel({
    username,
    password: hashedPassword,
  });
  await newUser.save();

  const token = signJWT({ id: newUser._id.toString() });
  return res.send({ token });
}

module.exports = {
  login,
  register,
};
