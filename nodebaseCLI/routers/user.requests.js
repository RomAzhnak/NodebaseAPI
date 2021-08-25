const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controllerAuth = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authJwt");
const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp");

router.get("/test", verifyToken, (req,res) => {res.status(200).send(`User Content id = ${req.userId} `);});

router.post(
  "/signup",
  // username must be an email
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: "Failed! Invalid password or email format!" });
    };
    next();
  },
  checkDuplicateUsernameOrEmail,
  controllerAuth.signup
);

router.post("/signin", controllerAuth.signin);

module.exports = router;