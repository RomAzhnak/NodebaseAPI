const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.allUser = (req, res) => {
  User.findAll({

  })
    .then(user => {
      res.json(user)
    });
}

exports.signup = async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    })
    res.send({ message: "User registered successfully!" })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.signin = async (req, res) => {

  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 60*60*24
    });
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
