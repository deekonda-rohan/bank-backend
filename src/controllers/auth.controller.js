const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.services.js");

async function userRegisterController(req, res) {
  const { email, username, password } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });

  if (isExist) {
    return res.status(422).json({
      message: "User already exists",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    username,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  await emailService.sendRegistrationEmail(user.email, user.username);

  res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    token,
  });

}

async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or password is INVALID",
    });
  }

  const validPassword = await user.comparepassword(password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Email or password is INVALID",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    token,
  });
}


module.exports = {userRegisterController,userLoginController};
