const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator/check");

exports.signUpUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email, password } = req.body;

    const cryptedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      email: email,
      password: cryptedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Created New Account" });
  } else {
    next(errors);
  }
};

exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await UserModel.findOne({ email: email });

  if (foundUser) {
    const result = await bcrypt.compare(password, foundUser.password);
    if (result) {
      let token = jwt.sign({ email: foundUser.email }, "somebigString", {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "User Found", token: token });
    } else {
      return res.status(422).send("Password do not match");
    }
  } else {
    return res.status(500).send("User not Found");
  }
};
