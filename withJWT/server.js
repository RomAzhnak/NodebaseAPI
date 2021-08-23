const express = require("express");
const app = express();
const { verifySignUp } = require("./app/middleware");
const controllerAuth = require("./app/controllers/auth.controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// });

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.post(
  "/api/auth/signup",
  verifySignUp.checkDuplicateUsernameOrEmail,
  controllerAuth.signup
);

app.post("/api/auth/signin", controllerAuth.signin);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
