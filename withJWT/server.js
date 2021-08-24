const express = require("express");
const app = express();
const { checkDuplicateUsernameOrEmail } = require("./app/middleware/verifySignUp")
const controllerAuth = require("./app/controllers/auth.controller");
const { body, validationResult } = require('express-validator');
const { verifyToken } = require("./app/middleware/authJwt");
const db = require("./app/models");


db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// });

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

app.get("/test", verifyToken, (req,res) => {res.status(200).send(`User Content id = ${req.userId} `);})

// app.use(
//   "/auth/signup",
//   // username must be an email
//   body('email').isEmail(),
//   // password must be at least 5 chars long
//   body('password').isLength({ min: 5 }),
//   (req, res) => {
//     // Finds the validation errors in this request and wraps them in an object with handy functions
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).send({ message: "Failed! Invalid password or email format!" });
//     }
//     next();
//     // User.create({
//     //   username: req.body.username,
//     //   password: req.body.password,
//     // }).then(user => res.json(user));
//   }
// );

app.get("/all", controllerAuth.allUser);

app.post(
  "/auth/signup",
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

app.post("/auth/signin", controllerAuth.signin);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
