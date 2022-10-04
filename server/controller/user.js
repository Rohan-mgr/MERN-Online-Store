require("dotenv").config();
const User = require("../model/user");
const Product = require("../model/product");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.name;
  const email = req.body.email;
  const pass = req.body.password;
  let dupUser;
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }
  try {
    dupUser = await User.findOne({ email: email });
    if (dupUser) {
      const error = new Error("Email Address already exists!");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(pass, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    const result = await user.save();
    res
      .status(200)
      .json({ message: "user created successfully", userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 401;
      throw error;
    } else {
      await bcrypt.compare(password, user.password);
      const token = jwt.sign(
        {
          email: email,
          userId: user._id.toString(),
        },
        process.env.JWT_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "Login Successfull",
        token: token,
        userId: user._id.toString(),
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
