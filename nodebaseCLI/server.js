const express = require("express");
const app = express();
const controllerAuth = require("./controllers/auth.controller");
const db = require("./models");
const userReq = require("./routers/user.requests");


db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// });

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.use("/auth", userReq);

app.get("/all", controllerAuth.allUser);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
