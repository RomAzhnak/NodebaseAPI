const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {

  try {
    const user = await User.findAll({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    });
    if (user[0]) {;
      throw new Error("Failed! Username or email already in use!");
    }
    next();
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};
