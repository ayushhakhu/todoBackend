const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const UserContoller = require("../controllers/UserContoller");
const UserModel = require("../models/UserModel");

router.post(
  "/signup",
  [
    body("email").customSanitizer((value, { req }) => value.toLowerCase()),
    body("email").custom((value) => {
      return UserModel.find({ email: value }).then((user) => {
        if (user.length > 0) {
          throw new Error("User already exists");
        }
      });
    }),
  ],
  UserContoller.signUpUser
);

router.post(
  "/login",
  [body("email").customSanitizer((value, { req }) => value.toLowerCase())],
  UserContoller.LoginUser
);

module.exports = router;
