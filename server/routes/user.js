const express = require("express");
const userController = require("../controller/user");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .matches(/^(?![\s.]+$)[a-zA-Z\s.]{2,}$/, "g"),
    body("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("Please Enter a valid email.")
      .normalizeEmail(),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-_=?])[a-zA-Z0-9!@#$%^&*-_=?]{8,}/,
        "g"
      )
      .isLength({ min: 8 }),
  ],
  userController.createUser
);
router.post("/login", userController.postLogin);

module.exports = router;
